import type { ImageUploadResponseDTO } from '../models/imageUpload';
import { env } from '@/shared/utils/env';

/**
 * Raw data source — HTTP client for the images/upload API.
 *
 * Auth note: the upload endpoint sits behind the admin JWT, so the caller
 * supplies the `Authorization` header. The display path (images/media) is
 * public so it can be used directly by <img> tags.
 *
 * Only `object_key` from the response is used by the app — the raw
 * `url` / `signed_url` / `public_url` fields are NOT, because Wasabi
 * blocks public object access. Images are always rendered through the
 * backend media proxy built from the object_key.
 */
export class ImageUploadDataSource {
  /** Stable API paths (relative to the admin base URL). */
  private static readonly UPLOAD_PATH = '/images/upload';
  static readonly MEDIA_PATH = '/images/media';

  private uploadUrl(): string {
    return `${env.apiBaseUrl}${ImageUploadDataSource.UPLOAD_PATH}`;
  }

  /**
   * Upload an image file (multipart/form-data, field name `image`).
   * Returns the full response; callers use `.data.object_key`.
   */
  async upload(
    file: File,
    authorization?: string,
  ): Promise<ImageUploadResponseDTO> {
    const form = new FormData();
    form.append('image', file);

    const headers: Record<string, string> = {};
    if (authorization) headers.Authorization = authorization;

    const res = await fetch(this.uploadUrl(), {
      method: 'POST',
      headers,
      body: form,
    });

    const json = (await res.json()) as ImageUploadResponseDTO;

    if (!res.ok || !json.success || !json.data?.object_key) {
      throw new Error(
        json.message || `Image upload failed (${res.status})`,
      );
    }

    return json;
  }
}
