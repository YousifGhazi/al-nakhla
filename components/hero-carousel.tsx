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
  const locale = useLocale();
  const isArabic = locale === "ar";
  const t = useTranslations("HeroCarousel");

  useEffect(() => {
    if (news.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % news.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [news.length]);

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
      <section className="relative w-full h-[calc(100vh-80px)] bg-gray-900 flex items-center justify-center">
        <p className="text-white text-xl">{t("noNews")}</p>
      </section>
    );
  }

  return (
    <section className="relative w-full h-[calc(100vh-80px)] bg-gray-900 overflow-hidden">
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
              <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/30 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative h-full container mx-auto px-8 md:px-12 flex items-center">
              {/* Main Content - Center Left */}
              <div className="max-w-2xl">
                {/* Date and Time - Above Title */}
                <div className="text-white/80 mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span className="text-base">
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

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
                  {item.title}
                </h2>

                {/* Metadata - Comments, Likes, Shares */}
                <div className="flex items-center gap-5 mb-6 text-white/80">
                  <button className="flex items-center gap-1.5 hover:text-white transition-colors">
                    <MessageCircle className="w-5 h-5 fill-current" />
                    <span className="text-sm">
                      {isArabic ? "٣١٥" : "315"} {t("comments")}
                    </span>
                  </button>

                  <button className="flex items-center gap-1.5 hover:text-white transition-colors">
                    <Heart className="w-5 h-5 fill-current" />
                    <span className="text-sm">
                      {isArabic ? "١٤٩٤٠" : "14940"} {t("likes")}
                    </span>
                  </button>

                  <button className="flex items-center gap-1.5 hover:text-white transition-colors">
                    <Share2 className="w-5 h-5 fill-current" />
                    <span className="text-sm">
                      {isArabic ? "٤٠٨" : "408"} {t("shares")}
                    </span>
                  </button>
                </div>

                {/* Read More Button */}
                <Link
                  href={`/${locale}/news/${item.slug}`}
                  className="px-8 py-3 border-2 border-white text-white text-base font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-300"
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
        className="absolute left-8 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-300 z-10"
        aria-label={t("previous")}
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-8 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-300 z-10"
        aria-label={t("next")}
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Dots Navigation - Bottom Center with Thicker Background */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-10 px-9 py-3 bg-black/40 backdrop-blur-xs  rounded-full z-10">
        {news.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="transition-all duration-300"
            aria-label={`${t("slide")} ${index + 1}`}
          >
            {index === currentSlide ? (
              <div className="w-4 aspect-square bg-white/90 rounded-full" />
            ) : (
              <div className="w-4 aspect-square rounded-full border-4 border-white/80 bg-transparent flex items-center justify-center hover:border-white "></div>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
