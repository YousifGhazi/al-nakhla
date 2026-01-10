"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { Tv, Clock, Calendar, Play } from "lucide-react";
import { Show } from "@/types/shows";
import NewsImage from "@/components/news-image";

interface FeaturedShowsProps {
  shows: Show[];
}

export default function FeaturedShows({ shows }: FeaturedShowsProps) {
  const locale = useLocale();
  const t = useTranslations("FeaturedShows");

  if (!shows || shows.length === 0) {
    return null;
  }

  // Take only 4 shows
  const displayShows = shows.slice(0, 4);

  return (
    <section className="py-16 bg-linear-to-r from-primary-700 via-primary-800 to-primary-700 text-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Tv className="w-10 h-10 text-white/80" />
            <h2 className="text-4xl md:text-5xl font-bold">{t("title")}</h2>
          </div>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            {t("description")}
          </p>
        </div>

        {/* Shows Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {displayShows.map((show) => (
            <Link
              key={show.id}
              href={`/${locale}/shows/${show.slug}`}
              className="group bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:border-white/50 transition-all duration-300 hover:shadow-2xl hover:shadow-black/20"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Show Image */}
                <div className="relative sm:w-48 h-48 sm:h-auto shrink-0">
                  <NewsImage
                    src={show.cover_url}
                    alt={show.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {show.is_featured && (
                    <div className="absolute top-4 left-4 bg-white text-primary-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary-700 rounded-full"></div>
                      {t("featured")}
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Play className="w-16 h-16 text-white" fill="white" />
                  </div>
                </div>

                {/* Show Info */}
                <div className="p-6 flex-1">
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-white/80 transition-colors">
                    {show.title}
                  </h3>
                  <p className="text-white/70 mb-4 line-clamp-2">
                    {show.about}
                  </p>

                  <div className="space-y-2 text-sm">
                    {show.author && (
                      <div className="flex items-center gap-2 text-white/70">
                        <Tv className="w-4 h-4 text-white/80" />
                        <span className="font-semibold">{t("host")}</span>
                        <span>{show.author.name}</span>
                      </div>
                    )}
                    {show.schedule && show.schedule.length > 0 && (
                      <>
                        <div className="flex items-center gap-2 text-white/70">
                          <Clock className="w-4 h-4 text-white/80" />
                          <span className="font-semibold">{t("time")}</span>
                          <span>{show.schedule[0].steam_time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/80 font-semibold">
                          <Calendar className="w-4 h-4" />
                          <span>{show.schedule[0].human_readable}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link
            href={`/${locale}/shows`}
            className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white hover:bg-white hover:text-primary-700 text-white font-bold rounded-lg text-lg transition-all duration-300 shadow-lg inline-flex items-center gap-3"
          >
            <Tv className="w-6 h-6" />
            {t("viewAllShows")}
          </Link>
        </div>
      </div>
    </section>
  );
}
