/**
 * Build a same-origin URL for inventory photos under /items/...
 * Encodes each path segment so spaces and special characters work on static hosts (e.g. GitHub Pages).
 */
export function inventoryImageSrc(basePath: string, relativePath: string): string {
  const segments = relativePath.split('/').filter(Boolean).map((s) => encodeURIComponent(s));
  const encoded = segments.join('/');
  const b = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
  if (!b) return `/${encoded}`;
  return `${b}/${encoded}`;
}
