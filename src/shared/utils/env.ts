/**
 * Centralized env access — the ONLY place that reads `import.meta.env`.
 * Everything else imports from here so env keys are typed and
 * validated in one spot.
 */
export const env = {
  /** e.g. http://localhost:8080/api-admin/v1 */
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
};
