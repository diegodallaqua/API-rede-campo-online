import { Request, Response } from "express";
import { container } from "tsyringe";
import { UploadImageUseCase } from "../../useCases/UploadImageUseCase";
import { AppError } from "../../../../shared/errors/AppError";

export class UploadImageController {
  /**
   * POST /images/upload
   * Body: multipart/form-data — fields: file (binary), entityType (string), entityId (string)
   * Returns: { url_small, url_medium, url_large, file_key, mime_type, size_kb }
   * Use the desired URL in the `media` field when calling EventMedia, NewsMedia or ProjectMedia endpoints.
   */
  async handle(req: Request, res: Response): Promise<Response> {
    if (!req.file) {
      throw new AppError("No file provided", 400, "FILE_MISSING");
    }

    const { entityType, entityId } = req.body as {
      entityType: string;
      entityId: string;
    };

    const useCase = container.resolve(UploadImageUseCase);

    const result = await useCase.execute({
      file: req.file.buffer,
      mimeType: req.file.mimetype,
      entityType,
      entityId,
    });

    return res.status(201).json(result);
  }
}
