import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  region: "eu-south",
  endpoint: process.env.MINIO_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY!,
    secretAccessKey: process.env.MINIO_SECRET_KEY!,
  },
});

export const BUCKET = process.env.MINIO_BUCKET!;