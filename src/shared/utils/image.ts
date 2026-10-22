import { env } from '@/shared/utils/env';

/**
 * Get backend origin without the /api-admin/v1 prefix, e.g. "http://localhost:8080".
 */
function getBackendOrigin(): string {
  try {
    return new URL(env.apiBaseUrl).origin;
  } catch {
    return 'http://localhost:8080';
  }
}

/**
 * Extract a raw string representation from various image payload shapes:
 * string, object { cart_image_value, url, file_url, object_key }.
 */
export function extractImageValue(image: unknown): string {
  if (!image) return '';
  if (typeof image === 'string') return image.trim();
  if (typeof image === 'object' && image !== null) {
    const obj = image as Record<string, unknown>;
    if (typeof obj.cart_image_value === 'string') return obj.cart_image_value.trim();
    if (typeof obj.url === 'string') return obj.url.trim();
    if (typeof obj.file_url === 'string') return obj.file_url.trim();
    if (typeof obj.object_key === 'string') return obj.object_key.trim();
    if (typeof obj.media_key === 'string') return obj.media_key.trim();
  }
  return '';
}

/**
 * Resolve a stored image value into a renderable <img> src.
 *
 * Stored images come in several shapes:
 *  - Full URLs (e.g. Taobao/Tmall product links, data URIs) → used as-is.
 *  - Full/relative API paths (e.g. `/api/v1/images/media/:key` from payment proof)
 *    → prepended with backend origin.
 *  - Bare S3 object keys (from upload API / ms_flypick_cart_image)
 *    → rendered through backend media proxy `GET /api-admin/v1/images/media/{object_key}`.
 *  - Objects with `cart_image_value` from database relation.
 */
export function resolveImageSrc(image: unknown): string {
  const raw = extractImageValue(image);
  if (!raw) return '';

  // Already an absolute URL or base64 data URI — use as-is.
  if (/^(?:https?:\/\/|data:image\/)/i.test(raw)) {
    return raw;
  }

  const backendOrigin = getBackendOrigin();

  // Relative path with leading slash like /api/v1/images/media/... or /api-admin/v1/...
  if (raw.startsWith('/')) {
    return `${backendOrigin}${raw}`;
  }

  // Relative path without leading slash like api/v1/... or api-admin/v1/...
  if (raw.startsWith('api/') || raw.startsWith('api-admin/')) {
    return `${backendOrigin}/${raw}`;
  }

  // Path like images/media/:key
  if (raw.startsWith('images/media/')) {
    return `${env.apiBaseUrl}/${raw}`;
  }

  // Otherwise it's a bare S3 object key → build media proxy URL
  const cleanKey = raw.replace(/^\/+/, '');
  return `${env.apiBaseUrl}/images/media/${encodeURIComponent(cleanKey)}`;
}

