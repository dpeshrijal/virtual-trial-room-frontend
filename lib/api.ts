// lib/api.ts
import axios from "axios";

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT!;

export interface ProcessImagesResponse {
  message: string;
  imageUrl: string;
}

export interface JobSubmissionResponse {
  jobId: string;
  status: "processing";
  message: string;
}

export interface JobStatusResponse {
  jobId: string;
  status: "processing" | "completed" | "failed";
  imageUrl?: string;
  error?: string;
  progress?: number;
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
 * Submit images for async processing
 * @param userImage - User's photo file
 * @param outfitImage - Outfit photo file
 * @returns Promise with job ID
 */
export async function submitJob(
  userImage: File,
  outfitImage: File
): Promise<JobSubmissionResponse> {
  try {
    // Convert images to base64
    const [userImageBase64, outfitImageBase64] = await Promise.all([
      fileToBase64(userImage),
      fileToBase64(outfitImage),
    ]);

    const response = await axios.post<JobSubmissionResponse>(
      API_ENDPOINT,
      {
        userImageBase64,
        outfitImageBase64,
        userImageMimeType: userImage.type,
        outfitImageMimeType: outfitImage.type,
        async: true, // Flag for async processing
        saveToS3: true,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000, // 30 seconds for job submission (large images need more time)
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.error || error.message || "Failed to submit job";
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred while submitting job");
  }
}

/**
 * Check job status
 * @param jobId - The job ID to check
 * @returns Promise with job status
 */
export async function checkJobStatus(jobId: string): Promise<JobStatusResponse> {
  try {
    const response = await axios.get<JobStatusResponse>(
      `${API_ENDPOINT}?jobId=${jobId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 5000,
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.error || error.message || "Failed to check job status";
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred while checking job status");
  }
}

/**
 * Poll for job completion
 * @param jobId - The job ID to poll
 * @param onProgress - Optional callback for progress updates
 * @returns Promise with the final result
 */
export async function pollJobStatus(
  jobId: string,
  onProgress?: (progress: number) => void
): Promise<ProcessImagesResponse> {
  const maxAttempts = 60; // 5 minutes (60 * 5 seconds)
  const pollInterval = 5000; // 5 seconds

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const status = await checkJobStatus(jobId);

    if (status.status === "completed" && status.imageUrl) {
      return {
        message: "Processing completed successfully",
        imageUrl: status.imageUrl,
      };
    }

    if (status.status === "failed") {
      throw new Error(status.error || "Processing failed");
    }

    // Update progress if callback provided
    if (onProgress && status.progress !== undefined) {
      onProgress(status.progress);
    }

    // Wait before next poll
    await new Promise((resolve) => setTimeout(resolve, pollInterval));
  }

  throw new Error("Processing timeout - job took too long");
}

/**
 * Process images with async polling pattern
 * @param userImage - User's photo file
 * @param outfitImage - Outfit photo file
 * @param onProgress - Optional callback for progress updates
 * @returns Promise with the processed image URL
 */
export async function processImagesAsync(
  userImage: File,
  outfitImage: File,
  onProgress?: (progress: number) => void
): Promise<ProcessImagesResponse> {
  try {
    // Step 1: Submit job
    const jobSubmission = await submitJob(userImage, outfitImage);

    // Step 2: Poll for completion
    const result = await pollJobStatus(jobSubmission.jobId, onProgress);

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to process images");
  }
}

/**
 * Calls the backend Lambda function to process images using Gemini AI
 * This function tries async pattern first, falls back to sync if not supported
 * @param userImage - User's photo file
 * @param outfitImage - Outfit photo file
 * @param onProgress - Optional callback for progress updates
 * @returns Promise with the processed image URL
 */
export async function processImages(
  userImage: File,
  outfitImage: File,
  onProgress?: (progress: number) => void
): Promise<ProcessImagesResponse> {
  try {
    // Try async pattern first
    return await processImagesAsync(userImage, outfitImage, onProgress);
  } catch (error) {
    // If async not supported, fall back to sync (old behavior)
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      console.log("Async not supported, falling back to sync processing");
      return await processImagesSync(userImage, outfitImage);
    }
    throw error;
  }
}

/**
 * Sync processing (fallback for backwards compatibility)
 */
async function processImagesSync(
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
        async: false,
        saveToS3: true,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 60000,
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === "ERR_NETWORK" || error.message.includes("Network Error")) {
        throw new Error(
          "AI processing is taking longer than expected. Please try with smaller images."
        );
      }

      if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
        throw new Error(
          "Request timed out. Please try again with smaller images."
        );
      }

      const errorMessage =
        error.response?.data?.error || error.message || "Failed to process images";
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred while processing images");
  }
}
