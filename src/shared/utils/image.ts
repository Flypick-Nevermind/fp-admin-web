import { env } from '@/shared/utils/env';

/**
 * Resolve a stored image value into a renderable <img> src.
 *
 * Stored images come in two shapes:
 *  - Full URLs (e.g. Taobao/Tmall product links) → used as-is.
 *  - An S3 object key (from the upload API) → rendered through the
 *    backend media proxy `GET /api-admin/v1/images/media/{object_key}`,
 *    because Wasabi blocks direct public object access.
 *
 * Only the object key is ever persisted; the raw url / signed_url /
 * public_url from the upload response are intentionally NOT used.
 */
export function resolveImageSrc(image: string): string {
  if (!image) return image;
  if (/^https?:\/\//i.test(image)) {
    // Already an absolute URL (external product image) — use as-is.
    return image;
  }
  // Otherwise it's an object key → build the media proxy URL.
  return `${env.apiBaseUrl}/images/media/${encodeURIComponent(image)}`;
}
