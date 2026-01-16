"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  const [isSwiping, setIsSwiping] = useState(false);
  const locale = useLocale();
  const isArabic = locale === "ar";
  const t = useTranslations("HeroCarousel");

  // Touch handling refs
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const minSwipeDistance = 50;

  useEffect(() => {
    if (news.length === 0 || isHovered || isSwiping) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % news.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [news.length, isHovered, isSwiping]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + news.length) % news.length);
  }, [news.length]);

  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % news.length);
  }, [news.length]);

  // Touch event handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
    const distance = touchStartX.current - touchEndX.current;
    const isSwipe = Math.abs(distance) > minSwipeDistance;

    if (isSwipe) {
      if (distance > 0) {
        // Swiped left - go to next (or previous for RTL)
        isArabic ? goToPrevious() : goToNext();
      } else {
        // Swiped right - go to previous (or next for RTL)
        isArabic ? goToNext() : goToPrevious();
      }
    }
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
      className="relative w-full h-[50vh] sm:h-[60vh] md:h-[calc(100vh-80px)] bg-gray-900 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
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
            <div className="relative h-full container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 flex items-end pb-16 sm:pb-20 md:items-center md:pb-0 z-10">
              {/* Main Content - Center Left */}
              <div className="max-w-2xl pointer-events-auto">
                {/* Date and Time - Above Title */}
                <div className="text-white/80 mb-1 sm:mb-2 md:mb-3 flex items-center gap-1.5 sm:gap-2">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  <span className="text-xs sm:text-sm md:text-base">
                    {new Date(item.published_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    <span className="mx-0.5 sm:mx-1">⊙</span>
                    {new Date().toLocaleTimeString(
                      isArabic ? "ar-SA" : "en-US",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </span>
                </div>

                <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2 sm:mb-3 md:mb-4 leading-tight line-clamp-2 sm:line-clamp-3 md:line-clamp-none">
                  {item.title}
                </h2>

                {/* Metadata - Comments, Likes, Shares - Hidden on very small screens */}
                <div className="hidden xs:flex flex-wrap items-center gap-2 sm:gap-4 md:gap-5 mb-3 sm:mb-4 md:mb-6 text-white/80">
                  <button className="flex items-center gap-1 hover:text-white transition-colors">
                    <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 fill-current" />
                    <span className="text-[10px] sm:text-xs md:text-sm">
                      {isArabic ? "٣١٥" : "315"} {t("comments")}
                    </span>
                  </button>

                  <button className="flex items-center gap-1 hover:text-white transition-colors">
                    <Heart className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 fill-current" />
                    <span className="text-[10px] sm:text-xs md:text-sm">
                      {isArabic ? "١٤٩٤٠" : "14940"} {t("likes")}
                    </span>
                  </button>

                  <button className="flex items-center gap-1 hover:text-white transition-colors">
                    <Share2 className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 fill-current" />
                    <span className="text-[10px] sm:text-xs md:text-sm">
                      {isArabic ? "٤٠٨" : "408"} {t("shares")}
                    </span>
                  </button>
                </div>

                {/* Read More Button */}
                <Link
                  href={`/${locale}/news/${item.slug}`}
                  className="inline-flex items-center justify-center px-4 sm:px-5 md:px-8 py-1.5 sm:py-2 md:py-3 border-2 border-white text-white text-xs sm:text-sm md:text-base font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-300 cursor-pointer touch-manipulation relative z-20"
                >
                  {t("readMore")}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows - Hidden on mobile, visible on md and up */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 hidden md:flex items-center justify-center bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-300 z-[15] pointer-events-auto"
        aria-label={t("previous")}
      >
        <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 hidden md:flex items-center justify-center bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-300 z-[15] pointer-events-auto"
        aria-label={t("next")}
      >
        <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
      </button>

      {/* Dots Navigation - Bottom Center with Thicker Background */}
      <div className="absolute bottom-3 sm:bottom-5 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-4 md:gap-8 px-3 sm:px-5 md:px-8 py-1.5 sm:py-2 md:py-3 bg-black/40 backdrop-blur-xs rounded-full z-[15] pointer-events-auto">
        {news.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="transition-all duration-300"
            aria-label={`${t("slide")} ${index + 1}`}
          >
            {index === currentSlide ? (
              <div className="w-2 sm:w-3 md:w-4 aspect-square bg-white/90 rounded-full" />
            ) : (
              <div className="w-2 sm:w-3 md:w-4 aspect-square rounded-full border sm:border-2 md:border-3 border-white/80 bg-transparent flex items-center justify-center hover:border-white"></div>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
