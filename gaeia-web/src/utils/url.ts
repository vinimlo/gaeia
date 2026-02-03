/**
 * URL utility for handling base path in different deployment environments.
 * Uses Astro's import.meta.env.BASE_URL which is set based on the `base` config.
 */

/**
 * Prefixes a path with the application base URL.
 * @param path - The path to prefix (e.g., '/trilhas' or 'trilhas')
 * @returns The full path with base URL prefix
 */
export function url(path: string): string {
  const base = import.meta.env.BASE_URL || '/';
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  // Ensure base doesn't end with / when path starts with /
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  return `${normalizedBase}${normalizedPath}`;
}
