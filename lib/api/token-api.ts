// API functions for token and bookmark management
import {
  GenerateTokenResponse,
  TokenProfile,
  BookmarkedCategoriesResponse,
} from "@/types/token";

const API_BASE_URL = "https://api.palm-fm.cloud/api";

/**
 * Generate a new public token
 */
export async function generatePublicToken(
  name: string,
  deviceId: string,
): Promise<GenerateTokenResponse> {
  const response = await fetch(`${API_BASE_URL}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      device_id: deviceId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate token");
  }

  return await response.json();
}

/**
 * Get token profile (with bookmarked categories)
 */
export async function getTokenProfile(token: string): Promise<TokenProfile> {
  const response = await fetch(`${API_BASE_URL}/token/profile`, {
    method: "GET",
    headers: {
      "X-Public-Token": token,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch token profile");
  }

  return await response.json();
}

/**
 * Get all bookmarked categories
 */
export async function getBookmarkedCategories(
  token: string,
): Promise<BookmarkedCategoriesResponse> {
  const response = await fetch(`${API_BASE_URL}/bookmarks`, {
    method: "GET",
    headers: {
      "X-Public-Token": token,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch bookmarked categories");
  }

  return await response.json();
}

/**
 * Bookmark or unbookmark a category
 * POST to bookmark, POST again to unbookmark (toggle behavior)
 */
export async function toggleBookmarkCategory(
  token: string,
  categoryId: number,
): Promise<{
  success: boolean;
  data: {
    category: {
      id: number;
      name: string;
      slug: string;
    };
    bookmarked_categories: number[];
    is_bookmarked: boolean;
  };
  message: string;
}> {
  const response = await fetch(`${API_BASE_URL}/bookmarks/${categoryId}`, {
    method: "POST",
    headers: {
      "X-Public-Token": token,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to toggle bookmark");
  }

  return await response.json();
}

/**
 * Bookmark a category using POST method
 */
export async function bookmarkCategory(
  token: string,
  categoryId: number,
): Promise<{ success: boolean; message: string; is_bookmarked: boolean }> {
  const response = await fetch(`${API_BASE_URL}/bookmarks/${categoryId}`, {
    method: "POST",
    headers: {
      "X-Public-Token": token,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to bookmark category");
  }

  const data = await response.json();
  // Check if categoryId is in the bookmarked_categories array
  const isBookmarked =
    data.data?.bookmarked_categories?.includes(categoryId) ?? false;
  return {
    success: data.success,
    message: data.message,
    is_bookmarked: isBookmarked,
  };
}

/**
 * Unbookmark/delete a category bookmark using DELETE method
 */
export async function deleteBookmarkCategory(
  token: string,
  categoryId: number,
): Promise<{ success: boolean; message: string; is_bookmarked: boolean }> {
  const response = await fetch(`${API_BASE_URL}/bookmarks/${categoryId}`, {
    method: "DELETE",
    headers: {
      "X-Public-Token": token,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete bookmark");
  }

  const data = await response.json();
  // Check if categoryId is still in the bookmarked_categories array
  const isBookmarked =
    data.data?.bookmarked_categories?.includes(categoryId) ?? false;
  return {
    success: data.success,
    message: data.message,
    is_bookmarked: isBookmarked,
  };
}
