import { injectable } from "tsyringe";
import sharp from "sharp";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

import { AppError } from "../../../shared/errors/AppError";
import { r2Client, r2BucketName, r2PublicUrl } from "../../../config/r2";

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const VARIANTS = [
  { name: "small", maxWidth: 320, quality: 75 },
  { name: "medium", maxWidth: 800, quality: 80 },
  { name: "large", maxWidth: 1920, quality: 85 },
] as const;

type IRequest = {
  file: Buffer;
  mimeType: string;
  entityType: string;
  entityId: string;
};

export type UploadResult = {
  url_small: string;
  url_medium: string;
  url_large: string;
  file_key: string;
  mime_type: string;
  size_kb: number;
};

@injectable()
export class UploadImageUseCase {
  /**
   * Validates MIME type, generates three WebP variants via sharp, uploads all
   * to Cloudflare R2, and returns the public URLs. No database record is
   * created here — the caller stores the desired URL in EventMedia, NewsMedia,
   * or ProjectMedia via their own endpoints.
   */
  async execute({ file, mimeType, entityType, entityId }: IRequest): Promise<UploadResult> {
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      throw new AppError(
        "Only JPEG, PNG and WebP images are allowed",
        415,
        "INVALID_MIME_TYPE"
      );
    }

    const baseKey = `${entityType}/${entityId}/${uuidv4()}`;
    const urls: Record<string, string> = {};
    let totalSizeBytes = 0;

    for (const variant of VARIANTS) {
      const webpBuffer = await sharp(file)
        .resize({ width: variant.maxWidth, withoutEnlargement: true })
        .webp({ quality: variant.quality })
        .toBuffer()
        .catch(() => {
          throw new AppError("Invalid or corrupted image file", 400, "INVALID_IMAGE");
        });

      const key = `${baseKey}-${variant.name}.webp`;

      await r2Client.send(
        new PutObjectCommand({
          Bucket: r2BucketName,
          Key: key,
          Body: webpBuffer,
          ContentType: "image/webp",
        })
      );

      urls[variant.name] = `${r2PublicUrl}/${key}`;
      totalSizeBytes += webpBuffer.byteLength;
    }

    return {
      url_small: urls["small"] as string,
      url_medium: urls["medium"] as string,
      url_large: urls["large"] as string,
      file_key: baseKey,
      mime_type: mimeType,
      size_kb: Math.round(totalSizeBytes / 1024),
    };
  }
}
