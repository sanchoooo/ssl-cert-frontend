// lib/utils.ts

/**
 * Decodes a base64url encoded string into a UTF-8 string.
 * This is a browser-safe implementation.
 * @param str The base64url encoded string.
 * @returns The decoded UTF-8 string.
 */
export function base64UrlDecode(str: string): string {
  if (!str) return '';

  try {
    // 1. CRITICAL: Decode the URL-encoded string from Next.js first.
    // This turns "%3D%3D" back into "==" so atob doesn't crash.
    const urlDecoded = decodeURIComponent(str);

    // 2. Clean up: replace URL-safe chars, remove whitespace, and strip existing padding
    const base64 = urlDecoded
      .trim()
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .replace(/\s/g, '')
      .replace(/=+$/, ''); // Strip ALL equals signs from the end

    // 3. Add the mathematically correct amount of padding
    const pad = base64.length % 4;
    const padded = pad ? base64 + '='.repeat(4 - pad) : base64;

    // 4. Finally, decode using the modern approach
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    return new TextDecoder().decode(bytes);
  } catch (e) {
    // By logging 'str', you can see exactly what Next.js is passing in
    console.error("Base64 Decode Error:", e, "\nOriginal Input:", str);
    return '';
  }
}