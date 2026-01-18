"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Tag, Star, Zap, TrendingUp } from "lucide-react";
import { Category } from "@/types/categories";
import CategoryBookmarkButton from "./category-bookmark-button";
import {
  getToken,
  getBookmarkedCategoryIds,
  saveBookmarkedCategoryIds,
} from "@/lib/token-utils";
import { getBookmarkedCategories } from "@/lib/api/token-api";

interface NewsCategoriesSidebarProps {
  categories: Category[];
  currentCategory?: string;
  locale: string;
  translations: {
    categories: string;
    allCategories: string;
    bookmark: string;
    bookmarked: string;
    filters: string;
    breakingNews: string;
    trending: string;
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
}

export default function NewsCategoriesSidebar({
  categories,
  currentCategory,
  locale,
  translations: t,
}: NewsCategoriesSidebarProps) {
  const searchParams = useSearchParams();
  const [bookmarkedCategoryIds, setBookmarkedCategoryIds] = useState<
    Set<number>
  >(new Set());
  const [isBreakingNews, setIsBreakingNews] = useState(false);
  const [isTrending, setIsTrending] = useState(false);

  // Load filter states from URL params
  useEffect(() => {
    setIsBreakingNews(searchParams.get("breaking") === "true");
    setIsTrending(searchParams.get("trending") === "true");
  }, [searchParams]);

  // Build URL with params (client-side)
  const buildUrl = (newParams: {
    category?: string;
    page: string;
    breaking?: boolean;
    trending?: boolean;
  }) => {
    const urlParams = new URLSearchParams(searchParams);

    // Handle category parameter
    if (newParams.category === undefined) {
      urlParams.delete("category");
    } else {
      urlParams.set("category", newParams.category);
    }

    // Handle breaking news filter
    if (newParams.breaking !== undefined) {
      if (newParams.breaking) {
        urlParams.set("breaking", "true");
      } else {
        urlParams.delete("breaking");
      }
    }

    // Handle trending filter
    if (newParams.trending !== undefined) {
      if (newParams.trending) {
        urlParams.set("trending", "true");
      } else {
        urlParams.delete("trending");
      }
    }

    // Handle page parameter
    if (newParams.page && newParams.page !== "1") {
      urlParams.set("page", newParams.page);
    } else {
      urlParams.delete("page");
    }

    const queryString = urlParams.toString();
    return `/${locale}/news${queryString ? `?${queryString}` : ""}`;
  };

  useEffect(() => {
    const loadBookmarkedCategories = async () => {
      // First, load from localStorage for instant display
      const cachedIds = getBookmarkedCategoryIds();
      if (cachedIds.length > 0) {
        setBookmarkedCategoryIds(new Set(cachedIds));
      }

      // Then fetch from API if user has token
      const token = getToken();
      if (!token) return;

      try {
        const response = await getBookmarkedCategories(token);
        if (response.success && response.data) {
          const ids = response.data.map((cat) => cat.id);
          setBookmarkedCategoryIds(new Set(ids));
          // Update localStorage cache
          saveBookmarkedCategoryIds(ids);
        }
      } catch (error) {
        console.error("Error loading bookmarked categories:", error);
      }
    };

    loadBookmarkedCategories();
  }, []);

  const handleBookmarkChange = (categoryId: number, isBookmarked: boolean) => {
    setBookmarkedCategoryIds((prev) => {
      const newSet = new Set(prev);
      if (isBookmarked) {
        newSet.add(categoryId);
      } else {
        newSet.delete(categoryId);
      }
      // Update localStorage
      saveBookmarkedCategoryIds(Array.from(newSet));
      return newSet;
    });
  };

  return (
    <aside className="lg:w-64 shrink-0">
      <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4 space-y-6">
        {/* Categories Section */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Tag className="w-5 h-5 text-primary-800" />
            {t.categories}
          </h2>
          <div className="flex flex-col gap-2">
            <Link
              href={buildUrl({ category: undefined, page: "1" })}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                !currentCategory
                  ? "bg-primary-800 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {t.allCategories}
            </Link>
            {categories.map((cat) => {
              const isBookmarked = bookmarkedCategoryIds.has(cat.id);
              const isActive = currentCategory === cat.slug;

              return (
                <div
                  key={cat.id}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-between relative ${
                    isActive
                      ? "bg-primary-800 text-white"
                      : isBookmarked
                        ? "bg-amber-50 text-gray-700 hover:bg-amber-100 ring-2 ring-amber-400"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {isBookmarked && !isActive && (
                    <Star className="absolute -top-1 -right-1 w-4 h-4 text-amber-500 fill-amber-500" />
                  )}
                  <Link
                    href={buildUrl({ category: cat.slug, page: "1" })}
                    className="flex-1 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-1.5">{cat.name}</span>
                    <span className="text-xs opacity-70">{cat.news_count}</span>
                  </Link>
                  <CategoryBookmarkButton
                    categoryId={cat.id}
                    categoryName={cat.name}
                    initialBookmarked={isBookmarked}
                    locale={locale}
                    translations={{
                      bookmark: t.bookmark,
                      bookmarked: t.bookmarked,
                      authModal: t.authModal,
                    }}
                    onBookmarkChange={(bookmarked) =>
                      handleBookmarkChange(cat.id, bookmarked)
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Filters Section */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary-800" />
            {t.filters}
          </h3>
          <div className="flex flex-col gap-2">
            {/* Breaking News Filter */}
            <Link
              href={buildUrl({
                category: currentCategory,
                page: "1",
                breaking: !isBreakingNews,
                trending: isTrending,
              })}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                isBreakingNews
                  ? "bg-primary-800 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Zap className={`w-4 h-4 ${isBreakingNews ? "text-white" : "text-red-500"}`} />
              {t.breakingNews}
            </Link>

            {/* Trending Filter */}
            <Link
              href={buildUrl({
                category: currentCategory,
                page: "1",
                breaking: isBreakingNews,
                trending: !isTrending,
              })}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                isTrending
                  ? "bg-primary-800 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <TrendingUp className={`w-4 h-4 ${isTrending ? "text-white" : "text-blue-500"}`} />
              {t.trending}
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
