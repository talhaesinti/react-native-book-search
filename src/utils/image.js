/**
 * image.js - Image utilities
 */

export function getCoverUri(thumbnail) {
  if (typeof thumbnail === 'string' && thumbnail.length > 0) {
    const uri = thumbnail.replace(/^http:/, 'https:');
    return { uri };
  }
  // Lightweight fallback: transparent 1x1 png data URI to avoid bundling asset
  return { uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=' };
}
