// lib/s3-upload.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const BUCKET_NAME = process.env.NEXT_PUBLIC_UPLOADS_BUCKET_NAME!;
const REGION = process.env.NEXT_PUBLIC_AWS_REGION!;

// Initialize S3 client with anonymous credentials
// The bucket must have public write permissions configured in the CDK stack
const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: "anonymous",
    secretAccessKey: "anonymous",
  },
});

export interface UploadResult {
  key: string;
  url: string;
}

/**
 * Uploads a file to S3 and returns the object key
 * @param file - The file to upload
 * @param prefix - Optional prefix for the S3 key (e.g., "user-images/")
 * @returns Promise with the S3 object key and URL
 */
export async function uploadToS3(
  file: File,
  prefix: string = ""
): Promise<UploadResult> {
  try {
    // Generate a unique filename
    const fileExtension = file.name.split(".").pop() || "jpg";
    const key = `${prefix}${uuidv4()}.${fileExtension}`;

    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: file.type,
    });

    await s3Client.send(command);

    const url = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${key}`;

    return { key, url };
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error("Failed to upload image to S3");
  }
}
