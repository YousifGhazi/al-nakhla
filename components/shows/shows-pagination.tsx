"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationMeta } from "@/types/reels";

interface ShowsPaginationProps {
  meta: PaginationMeta;
  locale: string;
  baseUrl: string;
  translations: {
    page: string;
    of: string;
    previous: string;
    next: string;
  };
}

export default function ShowsPagination({
  meta,
  locale,
  baseUrl,
  translations,
}: ShowsPaginationProps) {
  const isArabic = locale === "ar";
  const PrevIcon = isArabic ? ChevronRight : ChevronLeft;
  const NextIcon = isArabic ? ChevronLeft : ChevronRight;

  const { current_page, last_page } = meta;

  if (last_page <= 1) return null;

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    const delta = 2;

    for (let i = 1; i <= last_page; i++) {
      if (
        i === 1 ||
        i === last_page ||
        (i >= current_page - delta && i <= current_page + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }

    return pages;
  };

  const createPageUrl = (page: number) => {
    const url = new URL(baseUrl, "http://localhost");
    url.searchParams.set("page", page.toString());
    return `/${locale}/shows?${url.searchParams.toString()}`;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* Previous Button */}
      <Link
        href={current_page > 1 ? createPageUrl(current_page - 1) : "#"}
        className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-colors ${
          current_page > 1
            ? "bg-white border border-gray-200 text-gray-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
            : "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none"
        }`}
        aria-disabled={current_page <= 1}
      >
        <PrevIcon className="w-4 h-4" />
        <span className="hidden sm:inline">{translations.previous}</span>
      </Link>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
              ...
            </span>
          ) : (
            <Link
              key={page}
              href={createPageUrl(page)}
              className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-colors ${
                current_page === page
                  ? "bg-red-600 text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
              }`}
            >
              {page}
            </Link>
          )
        )}
      </div>

      {/* Next Button */}
      <Link
        href={current_page < last_page ? createPageUrl(current_page + 1) : "#"}
        className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-colors ${
          current_page < last_page
            ? "bg-white border border-gray-200 text-gray-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
            : "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none"
        }`}
        aria-disabled={current_page >= last_page}
      >
        <span className="hidden sm:inline">{translations.next}</span>
        <NextIcon className="w-4 h-4" />
      </Link>

      {/* Page Info */}
      <div className="hidden md:flex items-center gap-1 text-sm text-gray-500 ml-4">
        <span>{translations.page}</span>
        <span className="font-medium text-gray-900">{current_page}</span>
        <span>{translations.of}</span>
        <span className="font-medium text-gray-900">{last_page}</span>
      </div>
    </div>
  );
}
