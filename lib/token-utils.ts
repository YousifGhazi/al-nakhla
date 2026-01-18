// Token and authentication utilities

/**
 * Generate a unique device ID
 * Uses a combination of timestamp, random values, and browser fingerprint
 */
export function generateDeviceId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15);
  const randomPart2 = Math.random().toString(36).substring(2, 15);

  // Try to include some browser-specific data for consistency
  const navigator = typeof window !== "undefined" ? window.navigator : null;
  const screenResolution =
    typeof window !== "undefined"
      ? `${window.screen.width}x${window.screen.height}`
      : "";

  const fingerprint = `${navigator?.userAgent || ""}-${screenResolution}`;
  const fingerprintHash = simpleHash(fingerprint);

  return `${timestamp}-${randomPart}-${randomPart2}-${fingerprintHash}`;
}

/**
 * Simple hash function for fingerprinting
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Get or create device ID from localStorage
 */
export function getDeviceId(): string {
  if (typeof window === "undefined") return "";

  const stored = localStorage.getItem("device_id");
  if (stored) return stored;

  const newDeviceId = generateDeviceId();
  localStorage.setItem("device_id", newDeviceId);
  return newDeviceId;
}

/**
 * Get stored token from localStorage
 */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("public_token");
}

/**
 * Save token to localStorage
 */
export function saveToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("public_token", token);
}

/**
 * Get stored username from localStorage
 */
export function getUsername(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("username");
}

/**
 * Save username to localStorage
 */
export function saveUsername(username: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("username", username);
}

/**
 * Clear all authentication data
 */
export function clearAuthData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("public_token");
  localStorage.removeItem("username");
  // Keep device_id as it should persist
}

/**
 * Check if user is authenticated (has token and username)
 */
export function isAuthenticated(): boolean {
  return !!(getToken() && getUsername());
}

/**
 * Get bookmarked category IDs from localStorage
 */
export function getBookmarkedCategoryIds(): number[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("bookmarked_categories");
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

/**
 * Save bookmarked category IDs to localStorage
 */
export function saveBookmarkedCategoryIds(ids: number[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("bookmarked_categories", JSON.stringify(ids));
}

/**
 * Add a bookmarked category ID to localStorage
 */
export function addBookmarkedCategoryId(id: number): void {
  const ids = getBookmarkedCategoryIds();
  if (!ids.includes(id)) {
    ids.push(id);
    saveBookmarkedCategoryIds(ids);
  }
}

/**
 * Remove a bookmarked category ID from localStorage
 */
export function removeBookmarkedCategoryId(id: number): void {
  const ids = getBookmarkedCategoryIds();
  const filtered = ids.filter((existingId) => existingId !== id);
  saveBookmarkedCategoryIds(filtered);
}
