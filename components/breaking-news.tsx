"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { AlertCircle, TrendingUp, Zap, Eye } from "lucide-react";
import { News } from "@/types/news";
import NewsImage from "@/components/news-image";

interface BreakingNewsProps {
  news: News[];
}

export default function BreakingNews({ news }: BreakingNewsProps) {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const t = useTranslations("BreakingNews");

  if (news.length === 0) {
    return null;
  }

  const mainNews = news[0];
  const sideNews = news.slice(1);

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

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section Header */}
        {/* <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-full animate-pulse">
            <AlertCircle className="w-6 h-6" />
            <span className="text-xl font-bold">{t("title")}</span>
          </div>
          <div className="h-1 flex-1 bg-linear-to-r from-red-600 to-transparent rounded-full"></div>
        </div> */}
        {/* Breaking News Ticker */}
        <div className="mt-8 bg-linear-to-r from-red-600 to-orange-600 rounded-xl overflow-hidden shadow-lg mb-8">
          <div className="flex items-center gap-4 py-3 px-6">
            <div className="flex items-center gap-2 text-white font-bold whitespace-nowrap">
              <Zap className="w-5 h-5 animate-pulse" fill="white" />
              {t("urgent")}:
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="animate-marquee whitespace-nowrap text-white font-medium">
                {news.map((item) => item.title).join(" • ")}
              </div>
            </div>
          </div>
        </div>
        {/* Main Breaking News Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured Main News - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="relative group h-full bg-gray-900 rounded-2xl overflow-hidden shadow-2xl hover:shadow-red-500/20 transition-all duration-300">
              {/* Image */}
              <div className="relative h-[400px] lg:h-full">
                <NewsImage
                  src={mainNews.cover_url}
                  alt={mainNews.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent"></div>

                {/* Priority Badge */}
                <div className="absolute top-6 left-6 bg-red-600 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg">
                  <Zap className="w-5 h-5" fill="white" />
                  {t("urgent")}
                </div>

                {/* Views Badge */}
                <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  <span className="font-semibold">
                    {formatViews(mainNews.views_count)}
                  </span>
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex items-center gap-2 text-red-400 mb-3">
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-sm font-semibold">
                      {formatRelativeTime(mainNews.published_at)}
                    </span>
                  </div>

                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                    {mainNews.title}
                  </h3>

                  <p className="text-lg text-gray-200 mb-6 line-clamp-2">
                    {mainNews.description}
                  </p>

                  <Link
                    href={`/${locale}/news/${mainNews.slug}`}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors duration-300 inline-flex items-center gap-2"
                  >
                    {t("readFullDetails")}
                    <span>{isArabic ? "←" : "→"}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Side Breaking News - 1 column */}
          <div className="space-y-6">
            {sideNews.map((item) => (
              <Link
                key={item.id}
                href={`/${locale}/news/${item.slug}`}
                className="group block bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-200 hover:border-red-500 transition-all duration-300 hover:shadow-lg cursor-pointer"
              >
                <div className="relative h-48">
                  <NewsImage
                    src={item.cover_url}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent"></div>

                  {/* Priority Badge */}
                  <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {t("breaking")}
                  </div>

                  {/* Time Badge */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center justify-between text-white text-sm">
                      <span className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded">
                        {formatRelativeTime(item.published_at)}
                      </span>
                      <span className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {formatViews(item.views_count)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}

            {/* View All Breaking News Button */}
            <Link
              href={`/${locale}/news`}
              className="w-full py-4 bg-linear-to-r from-slate-700 to-gray-800 hover:from-slate-800 hover:to-gray-900 text-white font-bold rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
            >
              <AlertCircle className="w-5 h-5" />
              {t("allBreakingNews")}
            </Link>
          </div>
        </div>
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
      `}</style>
    </section>
  );
}
