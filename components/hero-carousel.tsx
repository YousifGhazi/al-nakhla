"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Clock,
  MessageCircle,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { News } from "@/types/news";
import Link from "next/link";
import NewsImage from "@/components/news-image";

interface HeroCarouselProps {
  news: News[];
}

export default function HeroCarousel({ news }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const locale = useLocale();
  const isArabic = locale === "ar";
  const t = useTranslations("HeroCarousel");

  useEffect(() => {
    if (news.length === 0 || isHovered) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % news.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [news.length, isHovered]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + news.length) % news.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % news.length);
  };

  if (news.length === 0) {
    return (
      <section className="relative w-full h-[60vh] sm:h-[70vh] md:h-[calc(100vh-80px)] bg-gray-900 flex items-center justify-center">
        <p className="text-white text-xl">{t("noNews")}</p>
      </section>
    );
  }

  return (
    <section
      className="relative w-full h-[60vh] sm:h-[70vh] md:h-[calc(100vh-80px)] bg-gray-900 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Carousel */}
      <div className="relative w-full h-full">
        {news.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
              <NewsImage
                src={item.cover_url}
                alt={item.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/50 to-black/30 md:from-black/70 md:via-black/30 md:to-transparent" />
            </div>

            {/* Content */}
            <div className="relative h-full container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 flex items-center z-10">
              {/* Main Content - Center Left */}
              <div className="max-w-2xl pointer-events-auto">
                {/* Date and Time - Above Title */}
                <div className="text-white/80 mb-2 sm:mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">
                    {new Date(item.published_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    <span className="mx-1">⊙</span>
                    {new Date().toLocaleTimeString(
                      isArabic ? "ar-SA" : "en-US",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-4 md:mb-5 leading-tight line-clamp-3 sm:line-clamp-none">
                  {item.title}
                </h2>

                {/* Metadata - Comments, Likes, Shares */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-5 mb-4 sm:mb-6 text-white/80">
                  <button className="flex items-center gap-1 sm:gap-1.5 hover:text-white transition-colors">
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                    <span className="text-xs sm:text-sm">
                      {isArabic ? "٣١٥" : "315"} {t("comments")}
                    </span>
                  </button>

                  <button className="flex items-center gap-1 sm:gap-1.5 hover:text-white transition-colors">
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                    <span className="text-xs sm:text-sm">
                      {isArabic ? "١٤٩٤٠" : "14940"} {t("likes")}
                    </span>
                  </button>

                  <button className="flex items-center gap-1 sm:gap-1.5 hover:text-white transition-colors">
                    <Share2 className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                    <span className="text-xs sm:text-sm">
                      {isArabic ? "٤٠٨" : "408"} {t("shares")}
                    </span>
                  </button>
                </div>

                {/* Read More Button */}
                <Link
                  href={`/${locale}/news/${item.slug}`}
                  className="inline-flex items-center justify-center px-5 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 border-2 border-white text-white text-sm sm:text-base font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-300 cursor-pointer touch-manipulation relative z-20"
                >
                  {t("readMore")}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-300 z-[15] pointer-events-auto"
        aria-label={t("previous")}
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-300 z-[15] pointer-events-auto"
        aria-label={t("next")}
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
      </button>

      {/* Dots Navigation - Bottom Center with Thicker Background */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-4 sm:gap-6 md:gap-10 px-4 sm:px-6 md:px-9 py-2 sm:py-2.5 md:py-3 bg-black/40 backdrop-blur-xs rounded-full z-[15] pointer-events-auto">
        {news.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="transition-all duration-300"
            aria-label={`${t("slide")} ${index + 1}`}
          >
            {index === currentSlide ? (
              <div className="w-3 sm:w-3.5 md:w-4 aspect-square bg-white/90 rounded-full" />
            ) : (
              <div className="w-3 sm:w-3.5 md:w-4 aspect-square rounded-full border-2 sm:border-3 md:border-4 border-white/80 bg-transparent flex items-center justify-center hover:border-white"></div>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
