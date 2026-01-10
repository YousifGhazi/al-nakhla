"use client";

import Link from "next/link";
import { Radio, Clock, User, Play } from "lucide-react";
import ShowImage from "@/components/shows/show-image";
import { Show } from "@/types/shows";

interface ShowsGridProps {
  shows: Show[];
  locale: string;
  translations: {
    live: string;
    liveNow: string;
    viewDetails: string;
    hostedBy: string;
    airTime: string;
    days: string;
    aboutShow: string;
    contactInfo: string;
    callUs: string;
    whatsapp: string;
    favorite: string;
    share: string;
    noShows: string;
    noShowsDescription: string;
  };
}

export default function ShowsGrid({
  shows,
  locale,
  translations,
}: ShowsGridProps) {
  if (shows.length === 0) {
    return (
      <div className="text-center py-16">
        <Radio className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          {translations.noShows}
        </h3>
        <p className="text-gray-500">{translations.noShowsDescription}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {shows.map((show) => (
        <Link
          key={show.id}
          href={`/${locale}/shows/${show.slug}`}
          className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary-400 cursor-pointer hover:-translate-y-1"
        >
          {/* Show Image */}
          <div className="relative h-56 overflow-hidden">
            <ShowImage
              src={show.cover_url}
              alt={show.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

            {/* Featured Badge */}
            {show.is_featured && (
              <div className="absolute top-3 left-3 bg-primary-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5">
                <div className="w-2 h-2 bg-white rounded-full" />
                {translations.live}
              </div>
            )}

            {/* Play Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
              <div className="bg-white rounded-full p-4 transform group-hover:scale-110 transition-transform duration-300">
                <Play
                  className="w-8 h-8 text-primary-600"
                  fill="currentColor"
                />
              </div>
            </div>

            {/* Show Title on Image */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                {show.title}
              </h3>
            </div>
          </div>

          {/* Show Info */}
          <div className="p-5">
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {show.about}
            </p>

            <div className="space-y-2 text-sm mb-4">
              {show.author && (
                <div className="flex items-center gap-2 text-gray-700">
                  <User className="w-4 h-4 text-primary-600" />
                  <span className="font-semibold">{show.author.name}</span>
                </div>
              )}
              {show.schedule && show.schedule.length > 0 && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4 text-primary-600" />
                  <span>{show.schedule[0].human_readable}</span>
                </div>
              )}
            </div>

            <div className="w-full py-2.5 bg-primary-600 group-hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
              {translations.viewDetails}
              <Radio className="w-4 h-4" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
