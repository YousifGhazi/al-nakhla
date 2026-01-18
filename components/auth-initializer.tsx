"use client";

import { useEffect } from "react";
import {
  getToken,
  saveBookmarkedCategoryIds,
  saveUsername,
} from "@/lib/token-utils";
import { getBookmarkedCategories, getTokenProfile } from "@/lib/api/token-api";

/**
 * This component initializes the user's profile data on app launch
 * It fetches bookmarked categories and user profile if a token exists
 */
export default function AuthInitializer() {
  const initializeAuth = async () => {
    const token = getToken();
    if (!token) return;

    try {
      // Fetch profile and bookmarked categories in parallel
      const [profileResponse, bookmarksResponse] = await Promise.all([
        getTokenProfile(token).catch(() => null),
        getBookmarkedCategories(token).catch(() => null),
      ]);

      // Update username from profile if available
      if (profileResponse?.success && profileResponse.data?.name) {
        saveUsername(profileResponse.data.name);
      }

      // Update bookmarked categories
      if (bookmarksResponse?.success && bookmarksResponse.data) {
        const ids = bookmarksResponse.data.map((cat) => cat.id);
        saveBookmarkedCategoryIds(ids);
      }
    } catch (error) {
      console.error("Error initializing auth:", error);
    }
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  // This component doesn't render anything
  return null;
}
