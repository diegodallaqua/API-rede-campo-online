import { S3Client } from "@aws-sdk/client-s3";

const accountId = process.env.R2_ACCOUNT_ID ?? "";

/** S3-compatible client pointed at Cloudflare R2. */
export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
  },
});

export const r2BucketName = process.env.R2_BUCKET_NAME ?? "";

/** Public base URL served by R2 (custom domain or r2.dev subdomain, no trailing slash). */
export const r2PublicUrl = (process.env.R2_PUBLIC_URL ?? "").replace(/\/$/, "");
