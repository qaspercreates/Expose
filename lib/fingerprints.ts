// Simple device fingerprint fallback using localStorage + UA hash.
// Not foolproof, but good enough to prevent casual multi-votes.
export function getFingerprint(): string {
  const key = "expose_fp";
  const existing = typeof window !== "undefined" ? localStorage.getItem(key) : null;
  if (existing) return existing;
  const raw = `${navigator.userAgent}|${Intl.DateTimeFormat().resolvedOptions().timeZone}|${screen.width}x${screen.height}|${Math.random()}`;
  const id = hashString(raw);
  localStorage.setItem(key, id);
  return id;
}

function hashString(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(36);
}
