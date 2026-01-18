"use client";

import { useState, useEffect } from "react";
import { Bookmark, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { getToken, getUsername } from "@/lib/token-utils";
import { bookmarkCategory, deleteBookmarkCategory } from "@/lib/api/token-api";
import AuthModal from "./auth-modal";

interface CategoryBookmarkButtonProps {
  categoryId: number;
  categoryName: string;
  initialBookmarked?: boolean;
  locale: string;
  translations: {
    bookmark: string;
    bookmarked: string;
    authModal: {
      title: string;
      description: string;
      namePlaceholder: string;
      nameLabel: string;
      submit: string;
      cancel: string;
      generating: string;
      success: string;
      error: string;
    };
  };
  onBookmarkChange?: (isBookmarked: boolean) => void;
}

export default function CategoryBookmarkButton({
  categoryId,
  initialBookmarked = false,
  locale,
  translations: t,
  onBookmarkChange,
}: CategoryBookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Check if category is bookmarked on mount
  useEffect(() => {
    setIsBookmarked(initialBookmarked);
  }, [initialBookmarked]);

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if inside a link
    e.stopPropagation(); // Prevent event bubbling

    const token = getToken();
    const username = getUsername();

    // If no token/username, show auth modal
    if (!token || !username) {
      setShowAuthModal(true);
      return;
    }

    // Toggle bookmark
    await performBookmark(token);
  };

  const performBookmark = async (token: string) => {
    setIsLoading(true);
    try {
      // Use appropriate method based on current state
      const response = isBookmarked
        ? await deleteBookmarkCategory(token, categoryId)
        : await bookmarkCategory(token, categoryId);

      if (response.success) {
        setIsBookmarked(response.is_bookmarked);
        onBookmarkChange?.(response.is_bookmarked);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSuccess = (token: string) => {
    setShowAuthModal(false);
    // After successful auth, perform the bookmark action
    performBookmark(token);
  };

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleBookmarkClick}
        disabled={isLoading}
        className={`p-2 rounded-lg transition-all ${
          isBookmarked
            ? "text-primary-700 hover:bg-primary-100"
            : "text-gray-500 hover:bg-gray-200"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        title={isBookmarked ? t.bookmarked : t.bookmark}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Bookmark
            className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`}
          />
        )}
      </motion.button>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        locale={locale}
        translations={t.authModal}
      />
    </>
  );
}
