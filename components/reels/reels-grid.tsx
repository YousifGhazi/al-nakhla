"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import {
  Play,
  Eye,
  Heart,
  Share2,
  X,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Film,
  Clock,
  User,
} from "lucide-react";
import {
  Reel,
  PaginationMeta,
  normalizeMeta,
  ReelsResponseRaw,
} from "@/types/reels";

interface ReelsGridProps {
  initialReels: Reel[];
  initialMeta: PaginationMeta | null;
  activeReelId: string | null;
  activeReel: Reel | null;
  locale: string;
  translations: {
    views: string;
    likes: string;
    share: string;
    copyLink: string;
    linkCopied: string;
    close: string;
    noReels: string;
    noReelsDescription: string;
    loading: string;
    sortBy: string;
    newest: string;
    oldest: string;
    mostViewed: string;
    mostLiked: string;
    searchPlaceholder: string;
    by: string;
    page: string;
    of: string;
    previous: string;
    next: string;
    duration: string;
    fileSize: string;
  };
}

const API_BASE_URL = "http://168.231.101.52:8080/api";

// Format number with explicit locale to avoid hydration mismatch
function formatNumber(num: number, locale: string): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US").format(num);
}

export default function ReelsGrid({
  initialReels,
  initialMeta,
  activeReelId,
  activeReel,
  locale,
  translations: t,
}: ReelsGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRTL = locale === "ar";

  const [reels, setReels] = useState<Reel[]>(initialReels);
  const [meta, setMeta] = useState<PaginationMeta | null>(initialMeta);
  const [selectedReel, setSelectedReel] = useState<Reel | null>(activeReel);
  const [isModalOpen, setIsModalOpen] = useState(
    !!activeReelId && !!activeReel
  );
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "");
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const sortOptions = [
    { value: "", label: t.newest },
    { value: "created_at", label: t.oldest },
    { value: "-views_count", label: t.mostViewed },
    { value: "-likes_count", label: t.mostLiked },
  ];

  const fetchReels = useCallback(
    async (page: number = 1) => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("per_page", "12");
        if (searchQuery) params.set("q", searchQuery);
        if (sortBy) params.set("sort", sortBy);

        const response = await fetch(
          `${API_BASE_URL}/reels?${params.toString()}`
        );
        if (!response.ok) throw new Error("Failed to fetch reels");

        const rawData: ReelsResponseRaw = await response.json();
        setReels(rawData.data);
        setMeta(normalizeMeta(rawData.meta));
      } catch (error) {
        console.error("Error fetching reels:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [searchQuery, sortBy]
  );

  // Update URL when filters change
  const updateUrl = useCallback(
    (query?: string, sort?: string, reelId?: string | null, page?: number) => {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (sort) params.set("sort", sort);
      if (reelId) params.set("reel", reelId);
      if (page && page > 1) params.set("page", page.toString());

      const queryString = params.toString();
      router.push(`/${locale}/reels${queryString ? `?${queryString}` : ""}`, {
        scroll: false,
      });
    },
    [locale, router]
  );

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl(searchQuery, sortBy);
    fetchReels(1);
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value);
    setIsSortDropdownOpen(false);
    updateUrl(searchQuery, value);
  };

  // Fetch new reels when sort changes
  useEffect(() => {
    fetchReels(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  // Open reel modal
  const openReel = (reel: Reel) => {
    setSelectedReel(reel);
    setIsModalOpen(true);
    updateUrl(searchQuery, sortBy, reel.id.toString());
    document.body.style.overflow = "hidden";
  };

  // Close reel modal
  const closeReel = () => {
    setSelectedReel(null);
    setIsModalOpen(false);
    updateUrl(searchQuery, sortBy, null);
    document.body.style.overflow = "auto";
  };

  // Copy share link
  const copyShareLink = async () => {
    if (!selectedReel) return;

    const shareUrl = `${window.location.origin}/${locale}/reels?reel=${selectedReel.id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  // Share reel using Web Share API
  const shareReel = async () => {
    if (!selectedReel) return;

    const shareUrl = `${window.location.origin}/${locale}/reels?reel=${selectedReel.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: selectedReel.title,
          text: selectedReel.description || "",
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled or error
        console.error("Error sharing:", error);
      }
    } else {
      copyShareLink();
    }
  };

  // Go to specific page
  const goToPage = (page: number) => {
    if (page < 1 || (meta && page > meta.last_page)) return;
    updateUrl(searchQuery, sortBy, null, page);
    fetchReels(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Navigate to next/previous reel in modal
  const getCurrentReelIndex = () => {
    if (!selectedReel) return -1;
    return reels.findIndex((r) => r.id === selectedReel.id);
  };

  const goToNextReel = () => {
    const currentIndex = getCurrentReelIndex();
    if (currentIndex < reels.length - 1) {
      const nextReel = reels[currentIndex + 1];
      setSelectedReel(nextReel);
      updateUrl(searchQuery, sortBy, nextReel.id.toString());
    }
  };

  const goToPreviousReel = () => {
    const currentIndex = getCurrentReelIndex();
    if (currentIndex > 0) {
      const prevReel = reels[currentIndex - 1];
      setSelectedReel(prevReel);
      updateUrl(searchQuery, sortBy, prevReel.id.toString());
    }
  };

  const hasNextReel = () => {
    const currentIndex = getCurrentReelIndex();
    return currentIndex < reels.length - 1;
  };

  const hasPreviousReel = () => {
    const currentIndex = getCurrentReelIndex();
    return currentIndex > 0;
  };

  // Generate pagination numbers
  const getPaginationNumbers = () => {
    if (!meta) return [];
    const pages: (number | string)[] = [];
    const current = meta.current_page;
    const last = meta.last_page;

    if (last <= 7) {
      for (let i = 1; i <= last; i++) pages.push(i);
    } else {
      if (current <= 3) {
        pages.push(1, 2, 3, 4, "...", last);
      } else if (current >= last - 2) {
        pages.push(1, "...", last - 3, last - 2, last - 1, last);
      } else {
        pages.push(1, "...", current - 1, current, current + 1, "...", last);
      }
    }
    return pages;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setIsSortDropdownOpen(false);
    if (isSortDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isSortDropdownOpen]);

  // Handle escape key to close modal and arrow keys to navigate
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;

      if (e.key === "Escape") {
        closeReel();
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        if (isRTL) {
          goToPreviousReel();
        } else {
          goToNextReel();
        }
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        if (isRTL) {
          goToNextReel();
        } else {
          goToPreviousReel();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen, selectedReel, reels, isRTL]);

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Search
              className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ${
                isRTL ? "right-4" : "left-4"
              }`}
            />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-700 focus:border-transparent ${
                isRTL ? "pr-12 pl-4" : "pl-12 pr-4"
              }`}
            />
          </div>
        </form>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsSortDropdownOpen(!isSortDropdownOpen);
            }}
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors min-w-[180px] justify-between"
          >
            <span className="text-gray-600">{t.sortBy}:</span>
            <span className="font-medium">
              {sortOptions.find((o) => o.value === sortBy)?.label}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                isSortDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isSortDropdownOpen && (
            <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`w-full px-4 py-3 text-start hover:bg-gray-50 transition-colors ${
                    sortBy === option.value
                      ? "bg-primary-700/10 text-primary-700 font-medium"
                      : ""
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reels Grid */}
      {reels.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {reels.map((reel) => (
              <button
                key={reel.id}
                onClick={() => openReel(reel)}
                className="group relative aspect-9/16 rounded-xl overflow-hidden bg-gray-200 cursor-pointer hover:ring-2 hover:ring-primary-700 transition-all duration-300"
              >
                {/* Thumbnail */}
                {reel.thumbnail_url ? (
                  <Image
                    src={reel.thumbnail_url}
                    alt={reel.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-linear-to-br from-primary-700 to-primary-800 flex items-center justify-center">
                    <Film className="w-12 h-12 text-white/50" />
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Play className="w-6 h-6 text-white fill-white" />
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute top-2 end-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {reel.duration_formatted}
                </div>

                {/* Stats */}
                <div className="absolute bottom-0 start-0 end-0 p-3 bg-linear-to-t from-black/80 to-transparent">
                  <h3 className="text-white text-sm font-medium line-clamp-2 mb-2">
                    {reel.title}
                  </h3>
                  <div className="flex items-center gap-3 text-white/80 text-xs">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {formatNumber(reel.views_count, locale)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {formatNumber(reel.likes_count, locale)}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Pagination */}
          {meta && meta.last_page > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-2 mt-8">
              {/* Previous Button */}
              <button
                onClick={() => goToPage(meta.current_page - 1)}
                disabled={meta.current_page === 1 || isLoading}
                className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                aria-label={t.previous}
              >
                {isRTL ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronLeft className="w-4 h-4" />
                )}
                <span>{t.previous}</span>
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {getPaginationNumbers().map((page, index) =>
                  page === "..." ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-2 sm:px-3 py-2 text-gray-400 text-sm sm:text-base"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => goToPage(page as number)}
                      disabled={isLoading}
                      className={`min-w-8 sm:min-w-10 px-2 sm:px-3 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                        meta.current_page === page
                          ? "bg-primary-700 text-white"
                          : "bg-white border border-gray-200 hover:bg-gray-50"
                      } disabled:opacity-50`}
                    >
                      {formatNumber(page as number, locale)}
                    </button>
                  )
                )}
              </div>

              {/* Next Button */}
              <button
                onClick={() => goToPage(meta.current_page + 1)}
                disabled={meta.current_page === meta.last_page || isLoading}
                className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                aria-label={t.next}
              >
                <span>{t.next}</span>
                {isRTL ? (
                  <ChevronLeft className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Film className="w-20 h-20 text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {t.noReels}
          </h3>
          <p className="text-gray-400">{t.noReelsDescription}</p>
        </div>
      )}

      {/* Reel Modal */}
      <AnimatePresence>
        {isModalOpen && selectedReel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
            onClick={closeReel}
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.1 }}
              onClick={closeReel}
              className="absolute top-4 end-4 p-3 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors z-20"
              aria-label={t.close}
            >
              <X className="w-6 h-6" />
            </motion.button>

            {/* Navigation Arrows */}
            {hasPreviousReel() && (
              <motion.button
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
                transition={{ delay: 0.15 }}
                onClick={(e) => {
                  e.stopPropagation();
                  goToPreviousReel();
                }}
                className={`absolute top-1/2 -translate-y-1/2 ${
                  isRTL ? "right-4" : "left-4"
                } p-3 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors z-20`}
                aria-label={t.previous}
              >
                {isRTL ? (
                  <ChevronRight className="w-6 h-6" />
                ) : (
                  <ChevronLeft className="w-6 h-6" />
                )}
              </motion.button>
            )}

            {hasNextReel() && (
              <motion.button
                initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRTL ? -20 : 20 }}
                transition={{ delay: 0.15 }}
                onClick={(e) => {
                  e.stopPropagation();
                  goToNextReel();
                }}
                className={`absolute top-1/2 -translate-y-1/2 ${
                  isRTL ? "left-4" : "right-4"
                } p-3 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors z-20`}
                aria-label={t.next}
              >
                {isRTL ? (
                  <ChevronLeft className="w-6 h-6" />
                ) : (
                  <ChevronRight className="w-6 h-6" />
                )}
              </motion.button>
            )}

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full flex flex-col lg:flex-row lg:items-center lg:justify-center lg:gap-6 lg:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Video Section */}
              <div className="flex-1 lg:flex-none flex items-center justify-center p-4 lg:p-0">
                <div className="relative w-full max-w-md lg:w-80 xl:w-96 h-full max-h-[60vh] lg:max-h-[85vh] aspect-9/16 bg-primary-950 rounded-2xl overflow-hidden shadow-2xl">
                  <video
                    key={selectedReel.id}
                    src={selectedReel.stream_url}
                    poster={selectedReel.thumbnail_url || undefined}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                    playsInline
                  />
                </div>
              </div>

              {/* Info Sidebar - Compact on large screens */}
              <div className="w-full lg:w-72 xl:w-80 lg:max-h-[85vh] bg-primary-950 lg:bg-primary-950/95 lg:backdrop-blur-sm lg:rounded-2xl p-4 lg:p-5 overflow-y-auto flex flex-col">
                {/* Title */}
                <h2 className="text-lg lg:text-xl font-bold text-white mb-2">
                  {selectedReel.title}
                </h2>

                {/* Description */}
                {selectedReel.description && (
                  <p className="text-gray-300 text-sm mb-3 leading-relaxed line-clamp-3 lg:line-clamp-4">
                    {selectedReel.description}
                  </p>
                )}

                {/* Author Section */}
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-primary-800">
                  {selectedReel.author.avatar_url ? (
                    <Image
                      src={selectedReel.author.avatar_url}
                      alt={selectedReel.author.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-primary-700 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div>
                    <p className="text-white font-medium text-sm">
                      {selectedReel.author.name}
                    </p>
                    <p className="text-gray-400 text-xs">{t.by}</p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-primary-900 rounded-lg p-3 text-center">
                    <Eye className="w-5 h-5 text-primary-700 mx-auto mb-1" />
                    <p className="text-white font-bold text-sm">
                      {formatNumber(selectedReel.views_count, locale)}
                    </p>
                    <p className="text-gray-400 text-xs">{t.views}</p>
                  </div>
                  <div className="bg-primary-900 rounded-lg p-3 text-center">
                    <Heart className="w-5 h-5 text-red-500 mx-auto mb-1" />
                    <p className="text-white font-bold text-sm">
                      {formatNumber(selectedReel.likes_count, locale)}
                    </p>
                    <p className="text-gray-400 text-xs">{t.likes}</p>
                  </div>
                </div>

                {/* Video Info */}
                {(selectedReel.duration_formatted ||
                  selectedReel.file_size_formatted) && (
                  <div className="bg-primary-900 rounded-lg p-3 mb-4 space-y-1.5">
                    {selectedReel.duration_formatted && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {t.duration}
                        </span>
                        <span className="text-white font-medium">
                          {selectedReel.duration_formatted}
                        </span>
                      </div>
                    )}
                    {selectedReel.file_size_formatted && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400 flex items-center gap-1.5">
                          <Film className="w-3.5 h-3.5" />
                          {t.fileSize}
                        </span>
                        <span className="text-white font-medium">
                          {selectedReel.file_size_formatted}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Share Buttons */}
                <div className="mt-auto space-y-2">
                  <button
                    onClick={shareReel}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary-700 text-white rounded-lg hover:bg-primary-800 transition-colors font-medium text-sm"
                  >
                    <Share2 className="w-4 h-4" />
                    {t.share}
                  </button>
                  <button
                    onClick={copyShareLink}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg transition-colors font-medium text-sm ${
                      linkCopied
                        ? "bg-green-600 text-white"
                        : "bg-primary-800 text-white hover:bg-primary-700"
                    }`}
                  >
                    {linkCopied ? (
                      <>
                        <Check className="w-4 h-4" />
                        {t.linkCopied}
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        {t.copyLink}
                      </>
                    )}
                  </button>
                </div>

                {/* Reel Counter */}
                <div className="mt-3 text-center text-gray-500 text-xs">
                  {formatNumber(getCurrentReelIndex() + 1, locale)} {t.of}{" "}
                  {formatNumber(reels.length, locale)}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
