"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  User,
  Radio,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import ShowImage from "@/components/shows/show-image";
import { Show, DayOfWeek, ShowScheduleResponse } from "@/types/shows";

interface DaySchedulePickerProps {
  schedule: ShowScheduleResponse["data"];
  locale: string;
  translations: {
    selectDay: string;
    showsFor: string;
    noShowsForDay: string;
    viewDetails: string;
    hostedBy: string;
    days: Record<DayOfWeek, string>;
  };
}

const DAYS_ORDER: DayOfWeek[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export default function DaySchedulePicker({
  schedule,
  locale,
  translations,
}: DaySchedulePickerProps) {
  const isArabic = locale === "ar";

  // Get current day
  const today = new Date()
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase() as DayOfWeek;

  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(today);

  const selectedShows = schedule[selectedDay] || [];

  const ArrowLeft = isArabic ? ChevronRight : ChevronLeft;
  const ArrowRight = isArabic ? ChevronLeft : ChevronRight;

  return (
    <div className="space-y-6">
      {/* Day Selector */}
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          {translations.selectDay}
        </h3>
      </div>

      {/* Day Pills */}
      <div className="flex flex-wrap gap-2">
        {DAYS_ORDER.map((day) => {
          const showCount = schedule[day]?.length || 0;
          const isSelected = selectedDay === day;
          const isToday = day === today;

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all border-2 ${
                isSelected
                  ? "bg-primary-600 text-white border-primary-600 shadow-md"
                  : "bg-white text-gray-700 border-gray-200 hover:border-red-300 hover:bg-red-50"
              }`}
            >
              <span className="flex items-center gap-2">
                {translations.days[day]}
                {isToday && !isSelected && (
                  <span className="w-2 h-2 bg-primary-600 rounded-full" />
                )}
              </span>
              {showCount > 0 && (
                <span
                  className={`absolute -top-2 -right-2 w-5 h-5 rounded-full text-xs flex items-center justify-center ${
                    isSelected
                      ? "bg-white text-primary-600"
                      : "bg-primary-600 text-white"
                  }`}
                >
                  {showCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Shows for Selected Day */}
      <div className="mt-6">
        <h4 className="text-md font-semibold text-gray-700 mb-4">
          {translations.showsFor} {translations.days[selectedDay]}
        </h4>

        {selectedShows.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-xl">
            <Radio className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">{translations.noShowsForDay}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedShows.map((show) => (
              <Link
                key={show.id}
                href={`/${locale}/shows/${show.slug}`}
                className="group flex gap-4 bg-white p-4 rounded-xl border border-gray-100 hover:border-red-300 hover:shadow-md transition-all"
              >
                {/* Thumbnail */}
                <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                  <ShowImage
                    src={show.cover_url}
                    alt={show.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h5 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                    {show.title}
                  </h5>
                  {show.author && (
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <User className="w-3 h-3" />
                      {show.author.name}
                    </p>
                  )}
                  {show.schedule && show.schedule.length > 0 && (
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {show.schedule[0].steam_time}
                    </p>
                  )}
                </div>

                {/* Arrow */}
                <div className="self-center">
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
