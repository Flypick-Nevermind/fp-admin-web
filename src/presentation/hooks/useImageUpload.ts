import { useCallback, useState } from 'react';
import { ImageUploadDataSource } from '@/data/datasources/imageUpload';
import { getAccessToken } from './useAuthStore';

/**
 * Presentation-layer composition root for image uploads.
 * Posts the file to the backend `/images/upload` endpoint (admin JWT)
 * and returns the persisted `object_key` — NOT a raw/signed/public URL.
 *
 * Displaying an uploaded image is done elsewhere via
 * `resolveImageSrc(objectKey)` → `GET /images/media/{object_key}`.
 */
export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const source = new ImageUploadDataSource();

  /**
   * Upload a single image file. Resolves to the S3 `object_key`.
   * The admin's JWT is read from the persisted auth store at call time.
   */
  const upload = useCallback(
    async (file: File): Promise<string> => {
      setError(null);
      setUploading(true);
      try {
        const auth = getAccessToken() ? `Bearer ${getAccessToken()}` : undefined;
        const response = await source.upload(file, auth);
        return response.data.object_key;
      } catch (e) {
        const message =
          e instanceof Error ? e.message : 'Failed to upload image.';
        setError(message);
        throw e;
      } finally {
        setUploading(false);
      }
    },
    [source],
  );

  return { upload, uploading, error, clearError: () => setError(null) };
}
