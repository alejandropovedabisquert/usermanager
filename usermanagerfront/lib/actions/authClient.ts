export function getAuthTokenClient(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(^|;)\\s*token=([^;]*)/);
  return match ? decodeURIComponent(match[2]) : null;
}
