"use client";

import { useState, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import {
  AlertCircle,
  TrendingUp,
  Zap,
  Eye,
  ChevronLeft,
  ChevronRight,
  Flame,
} from "lucide-react";
import { News } from "@/types/news";
import NewsImage from "@/components/news-image";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  news: News[];
}

interface BreakingNewsProps {
  news: News[];
  categories?: Category[];
}

export default function BreakingNews({
  news,
  categories = [],
}: BreakingNewsProps) {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const t = useTranslations("BreakingNews");
  const [activeTab, setActiveTab] = useState<"breaking" | string>("breaking");
  const categorySliderRef = useRef<HTMLDivElement>(null);

  if (news.length === 0 && categories.length === 0) {
    return null;
  }

  // Get current news to display based on active tab
  const getCurrentNews = (): News[] => {
    if (activeTab === "breaking") {
      return news;
    }
    const category = categories.find((cat) => cat.slug === activeTab);
    return category?.news?.slice(0, 4) || [];
  };

  const currentNews = getCurrentNews();
  const mainNews = currentNews[0];
  const sideNews = currentNews.slice(1);

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMinutes < 60) {
      return isArabic
        ? `منذ ${diffInMinutes} دقيقة`
        : `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return isArabic
        ? `منذ ${hours} ساعة`
        : `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return isArabic
        ? `منذ ${days} يوم`
        : `${days} day${days > 1 ? "s" : ""} ago`;
    }
  };

  // Format views count
  const formatViews = (count?: number) => {
    if (count === undefined || count === null) {
      return "0";
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  // Scroll category slider
  const scrollCategories = (direction: "left" | "right") => {
    if (categorySliderRef.current) {
      const scrollAmount = 200;
      categorySliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-6 sm:py-10 md:py-12 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        {/* Breaking News Ticker */}
        <div className="bg-linear-to-r from-red-600 to-orange-600 rounded-lg sm:rounded-xl overflow-hidden shadow-lg mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-4 py-2 sm:py-3 px-3 sm:px-6">
            <div className="flex items-center gap-1.5 sm:gap-2 text-white font-bold whitespace-nowrap text-sm sm:text-base">
              <Zap
                className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse"
                fill="white"
              />
              {t("urgent")}:
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="animate-marquee whitespace-nowrap text-white font-medium text-sm sm:text-base">
                {news.map((item) => item.title).join(" • ")}
              </div>
            </div>
          </div>
        </div>

        {/* Category/Breaking News Switcher */}
        <div className="mb-4 sm:mb-6">
          <div className="relative flex items-center gap-2">
            {/* Left scroll button - hidden on mobile, shown when needed */}
            {categories.length > 3 && (
              <button
                onClick={() => scrollCategories("left")}
                className="hidden sm:flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex-shrink-0 transition-colors"
                aria-label="Scroll left"
              >
                {isArabic ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronLeft className="w-4 h-4" />
                )}
              </button>
            )}

            {/* Tabs container with horizontal scroll */}
            <div
              ref={categorySliderRef}
              className="flex-1 flex items-center gap-2 overflow-x-auto scrollbar-hide scroll-smooth pb-1"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {/* Breaking News Tab */}
              <button
                onClick={() => setActiveTab("breaking")}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-300 flex-shrink-0 ${
                  activeTab === "breaking"
                    ? "bg-red-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Flame
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                    activeTab === "breaking" ? "animate-pulse" : ""
                  }`}
                />
                {t("title")}
              </button>

              {/* Category Tabs */}
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.slug)}
                  className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-300 flex-shrink-0 ${
                    activeTab === category.slug
                      ? "bg-slate-800 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Right scroll button - hidden on mobile, shown when needed */}
            {categories.length > 3 && (
              <button
                onClick={() => scrollCategories("right")}
                className="hidden sm:flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex-shrink-0 transition-colors"
                aria-label="Scroll right"
              >
                {!isArabic ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronLeft className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* News Content */}
        {currentNews.length === 0 ? (
          <div className="flex items-center justify-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-500">
              {isArabic ? "لا توجد أخبار متاحة" : "No news available"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5">
            {/* Featured Main News - Takes more space on larger screens */}
            <div className="md:col-span-2 lg:col-span-7">
              <Link
                href={`/${locale}/news/${mainNews.slug}`}
                className="relative group block h-[280px] sm:h-[350px] lg:h-[420px] bg-gray-900 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl hover:shadow-red-500/20 transition-all duration-300"
              >
                <NewsImage
                  src={mainNews.cover_url}
                  alt={mainNews.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent"></div>

                {/* Badges */}
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between">
                  <div
                    className={`${
                      activeTab === "breaking" ? "bg-red-600" : "bg-slate-800"
                    } text-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full font-bold flex items-center gap-1.5 text-xs sm:text-sm shadow-lg`}
                  >
                    {activeTab === "breaking" ? (
                      <>
                        <Zap className="w-3 h-3 sm:w-4 sm:h-4" fill="white" />
                        {t("urgent")}
                      </>
                    ) : (
                      categories.find((c) => c.slug === activeTab)?.name
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                  <div className="flex items-center gap-1.5 text-red-400 mb-2">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm font-semibold">
                      {formatRelativeTime(mainNews.published_at)}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 leading-tight line-clamp-2">
                    {mainNews.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-200 line-clamp-2 hidden sm:block">
                    {mainNews.description}
                  </p>
                </div>
              </Link>
            </div>

            {/* Side News - Horizontal cards on mobile, vertical on desktop */}
            <div className="lg:col-span-5 flex flex-col gap-3 sm:gap-4">
              {sideNews.slice(0, 3).map((item) => (
                <Link
                  key={item.id}
                  href={`/${locale}/news/${item.slug}`}
                  className="group flex flex-row bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-red-500 transition-all duration-300 hover:shadow-md"
                >
                  {/* Image - Left side */}
                  <div className="relative w-28 sm:w-36 lg:w-40 h-24 sm:h-28 lg:h-32 flex-shrink-0">
                    <NewsImage
                      src={item.cover_url}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div
                      className={`absolute top-2 left-2 ${
                        activeTab === "breaking" ? "bg-red-600" : "bg-slate-700"
                      } text-white px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold`}
                    >
                      {activeTab === "breaking"
                        ? t("breaking")
                        : categories.find((c) => c.slug === activeTab)?.name}
                    </div>
                  </div>

                  {/* Content - Right side */}
                  <div className="flex-1 p-3 sm:p-4 flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-gray-500 text-[10px] sm:text-xs mb-1">
                      <span>{formatRelativeTime(item.published_at)}</span>
                      <span className="flex items-center gap-0.5">
                        <Eye className="w-3 h-3" />
                        {formatViews(item.views_count)}
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors">
                      {item.title}
                    </h4>
                  </div>
                </Link>
              ))}

              {/* View All Button */}
              <Link
                href={
                  activeTab === "breaking"
                    ? `/${locale}/news`
                    : `/${locale}/news?category=${activeTab}`
                }
                className="w-full py-2.5 sm:py-3 bg-linear-to-r from-slate-700 to-gray-800 hover:from-slate-800 hover:to-gray-900 text-white font-bold rounded-xl transition-all duration-300 shadow-md flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                {activeTab === "breaking"
                  ? t("allBreakingNews")
                  : isArabic
                  ? `عرض كل ${
                      categories.find((c) => c.slug === activeTab)?.name
                    }`
                  : `View All ${
                      categories.find((c) => c.slug === activeTab)?.name
                    }`}
              </Link>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 20s linear infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
