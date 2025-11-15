// lib/api.ts
import axios from "axios";

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT!;

export interface ProcessImagesResponse {
  message: string;
  imageUrl: string;
}

/**
 * Converts a File to base64 string
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data:image/...;base64, prefix
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Calls the backend Lambda function to process images using Gemini AI
 * @param userImage - User's photo file
 * @param outfitImage - Outfit photo file
 * @returns Promise with the processed image URL
 */
export async function processImages(
  userImage: File,
  outfitImage: File
): Promise<ProcessImagesResponse> {
  try {
    // Convert images to base64
    const [userImageBase64, outfitImageBase64] = await Promise.all([
      fileToBase64(userImage),
      fileToBase64(outfitImage),
    ]);

    const response = await axios.post<ProcessImagesResponse>(
      API_ENDPOINT,
      {
        userImageBase64,
        outfitImageBase64,
        userImageMimeType: userImage.type,
        outfitImageMimeType: outfitImage.type,
        saveToS3: true, // Save for record keeping
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.error || error.message || "Failed to process images";
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred while processing images");
  }
}
