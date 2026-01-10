"use client";

import Link from "next/link";
import { Clock, User, Radio, Sparkles, Play } from "lucide-react";
import ShowImage from "@/components/shows/show-image";
import { Show, DayOfWeek } from "@/types/shows";

interface TodayShowsProps {
  shows: Show[];
  day: DayOfWeek;
  date: string;
  locale: string;
  translations: {
    todayShows: string;
    onAirToday: string;
    viewDetails: string;
    hostedBy: string;
    noShowsToday: string;
    live: string;
  };
}

export default function TodayShows({
  shows,
  day,
  date,
  locale,
  translations,
}: TodayShowsProps) {
  if (shows.length === 0) {
    return (
      <div className="bg-linear-to-r from-red-50 to-rose-50 rounded-2xl p-8 text-center">
        <Radio className="w-16 h-16 text-red-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          {translations.noShowsToday}
        </h3>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <Sparkles className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              {translations.todayShows}
            </h2>
            <p className="text-sm text-gray-500">{translations.onAirToday}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-primary-600 capitalize">
            {day}
          </p>
          <p className="text-xs text-gray-500">{date}</p>
        </div>
      </div>

      {/* Shows Horizontal Scroll */}
      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
          {shows.map((show, index) => (
            <Link
              key={show.id}
              href={`/${locale}/shows/${show.slug}`}
              className="group shrink-0 w-72 md:w-80 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all snap-start border border-gray-100 hover:border-primary-400"
            >
              {/* Image */}
              <div className="relative h-40 overflow-hidden">
                <ShowImage
                  src={show.cover_url}
                  alt={show.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />

                {/* Order Badge */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-primary-600 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>

                {/* Featured/Live Badge */}
                {show.is_featured && (
                  <div className="absolute top-3 right-3 bg-primary-600 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 animate-pulse">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    {translations.live}
                  </div>
                )}

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                    <Play
                      className="w-6 h-6 text-primary-600"
                      fill="currentColor"
                    />
                  </div>
                </div>

                {/* Title */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-bold text-white truncate">
                    {show.title}
                  </h3>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-center justify-between text-sm">
                  {show.author && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="w-4 h-4 text-primary-500" />
                      <span className="truncate">{show.author.name}</span>
                    </div>
                  )}
                  {show.schedule && show.schedule.length > 0 && (
                    <div className="flex items-center gap-1 text-primary-600 font-medium">
                      <Clock className="w-4 h-4" />
                      <span>{show.schedule[0].steam_time}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
