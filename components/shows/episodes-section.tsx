"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  Play,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  Calendar,
  Hash,
} from "lucide-react";
import { ShowEpisode, ShowEpisodesList } from "@/types/shows";

const API_BASE_URL = "https://api.palm-fm.cloud/api";

interface EpisodesSectionProps {
  slug: string;
  translations: {
    episodes: string;
    episode: string;
    noEpisodes: string;
    watchOnYoutube: string;
    description: string;
    episodeNumber: string;
    close: string;
    loadMore: string;
    loading: string;
  };
  isArabic: boolean;
}

export default function EpisodesSection({
  slug,
  translations: t,
  isArabic,
}: EpisodesSectionProps) {
  const [episodes, setEpisodes] = useState<ShowEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEpisode, setSelectedEpisode] = useState<ShowEpisode | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchEpisodes = async (page: number, append: boolean = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const response = await fetch(
        `${API_BASE_URL}/shows/${slug}/episodes?page=${page}&per_page=6`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch episodes");
      }

      const data: ShowEpisodesList = await response.json();

      if (append) {
        setEpisodes((prev) => [...prev, ...data.data]);
      } else {
        setEpisodes(data.data);
      }

      setTotalPages(data.meta.last_page);
      setCurrentPage(data.meta.current_page);
    } catch (error) {
      console.error("Error fetching episodes:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchEpisodes(1);
  }, [slug]);

  const loadMore = () => {
    if (currentPage < totalPages && !loadingMore) {
      fetchEpisodes(currentPage + 1, true);
    }
  };

  const openModal = (episode: ShowEpisode) => {
    setSelectedEpisode(episode);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedEpisode(null);
    document.body.style.overflow = "";
  };

  // Don't render anything if no episodes and not loading
  if (!loading && episodes.length === 0) {
    return null;
  }

  return (
    <>
      {/* Episodes Section */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <PlayCircle className="w-6 h-6 text-red-600" />
          {t.episodes}
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full" />
          </div>
        ) : (
          <>
            {/* Episodes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {episodes.map((episode, index) => (
                <motion.button
                  key={episode.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => openModal(episode)}
                  className="group text-left bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-red-200"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden">
                    {episode.image_url ? (
                      <Image
                        src={episode.image_url}
                        alt={episode.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-linear-to-br from-red-100 to-rose-100 flex items-center justify-center">
                        <Play className="w-12 h-12 text-red-400" />
                      </div>
                    )}

                    {/* Play Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300">
                        <Play className="w-5 h-5 text-white ml-1" />
                      </div>
                    </div>

                    {/* Episode Number Badge */}
                    <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md font-medium">
                      {t.episode} {episode.episode_number}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors">
                      {episode.name}
                    </h3>
                    {episode.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {episode.description}
                      </p>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Load More Button */}
            {currentPage < totalPages && (
              <div className="mt-6 text-center">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMore ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      {t.loading}
                    </>
                  ) : (
                    t.loadMore
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Episode Modal */}
      <AnimatePresence>
        {selectedEpisode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Episode Image/Thumbnail */}
              <div className="relative aspect-video w-full bg-gray-900">
                {selectedEpisode.image_url ? (
                  <Image
                    src={selectedEpisode.image_url}
                    alt={selectedEpisode.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-red-600 to-rose-600 flex items-center justify-center">
                    <Play className="w-20 h-20 text-white/50" />
                  </div>
                )}

                {/* YouTube Play Button Overlay */}
                {selectedEpisode.youtube_url && (
                  <a
                    href={selectedEpisode.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex items-center justify-center group"
                  >
                    <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-10 h-10 text-white ml-1" />
                    </div>
                  </a>
                )}
              </div>

              {/* Content */}
              <div className="p-6 max-h-[40vh] overflow-y-auto">
                {/* Episode Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-sm px-3 py-1 rounded-full font-medium">
                    <Hash className="w-3.5 h-3.5" />
                    {t.episode} {selectedEpisode.episode_number}
                  </span>
                  <span className="inline-flex items-center gap-1 text-gray-500 text-sm">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(selectedEpisode.created_at).toLocaleDateString(
                      isArabic ? "ar-IQ" : "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {selectedEpisode.name}
                </h2>

                {/* Description */}
                {selectedEpisode.description && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                      {t.description}
                    </h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {selectedEpisode.description}
                    </p>
                  </div>
                )}

                {/* YouTube Button */}
                {selectedEpisode.youtube_url && (
                  <a
                    href={selectedEpisode.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-lg hover:shadow-xl"
                  >
                    <Play className="w-5 h-5" />
                    {t.watchOnYoutube}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
