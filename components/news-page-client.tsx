"use client";

import NewsCategoriesSidebar from "./news-categories-sidebar";
import { Category } from "@/types/categories";

interface NewsPageClientProps {
  categories: Category[];
  currentCategory?: string;
  locale: string;
  translations: {
    categories: string;
    allCategories: string;
    filters: string;
    breakingNews: string;
    trending: string;
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
}

export default function NewsPageClient({
  categories,
  currentCategory,
  locale,
  translations,
}: NewsPageClientProps) {
  return (
    <NewsCategoriesSidebar
      categories={categories}
      currentCategory={currentCategory}
      locale={locale}
      translations={translations}
    />
  );
}
