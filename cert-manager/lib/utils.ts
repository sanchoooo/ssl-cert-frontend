// lib/utils.ts

/**
 * Decodes a base64url encoded string into a UTF-8 string.
 * This is a browser-safe implementation.
 * @param str The base64url encoded string.
 * @returns The decoded UTF-8 string.
 */
export function base64UrlDecode(str: string): string {
  try {
    // Replace URL-safe characters with their base64 equivalents
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    // Pad the string with '=' characters if necessary
    const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
    // Decode the base64 string and then decode the URI components
    return decodeURIComponent(atob(padded).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
  } catch (e) {
    console.error("Failed to decode base64url string:", e);
    return '';
  }
}
