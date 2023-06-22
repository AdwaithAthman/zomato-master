import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

// dotenv config
dotenv.config();

// AWS S3 bucket config
const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET_KEY,
  },
});

export const s3Upload = async (uploadParams) => {
  const command = new PutObjectCommand(uploadParams);
  const response = await s3Client.send(command);
  return response;
};
