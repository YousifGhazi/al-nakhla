"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  MessageCircle,
  Send,
  Loader2,
} from "lucide-react";
import {
  Reel,
  PaginationMeta,
  normalizeMeta,
  ReelsResponseRaw,
} from "@/types/reels";
import { Comment, CommentsByReelResponse } from "@/types/comment";
import AuthModal from "@/components/auth-modal";
import {
  getUsername,
  getToken,
  saveUsername as saveUserToStorage,
  saveToken,
} from "@/lib/token-utils";
import { generateDeviceId } from "@/lib/token-utils";

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
    comments: string;
    writeComment: string;
    send: string;
    noComments: string;
    beFirstToComment: string;
    loadMore: string;
    like: string;
    liked: string;
    usernameRequired: string;
    enterUsername: string;
    usernamePlaceholder: string;
    save: string;
    cancel: string;
    authModalTitle: string;
    authModalDescription: string;
    authModalNamePlaceholder: string;
    authModalNameLabel: string;
    authModalSubmit: string;
    authModalGenerating: string;
    authModalSuccess: string;
    authModalError: string;
  };
}

const API_BASE_URL = "https://api.palm-fm.cloud/api";

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
  const commentsEndRef = useRef<HTMLDivElement>(null);

  const [reels, setReels] = useState<Reel[]>(initialReels);
  const [meta, setMeta] = useState<PaginationMeta | null>(initialMeta);
  const [selectedReel, setSelectedReel] = useState<Reel | null>(activeReel);
  const [isModalOpen, setIsModalOpen] = useState(
    !!activeReelId && !!activeReel,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "");
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  // Comments state
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsMeta, setCommentsMeta] = useState<{
    current_page: number;
    last_page: number;
    total: number;
  } | null>(null);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  // Like state
  const [likedReels, setLikedReels] = useState<Set<number>>(new Set());
  const [likingReel, setLikingReel] = useState(false);

  // Auth modal state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<"comment" | "like" | null>(
    null,
  );

  // Comments panel visibility (mobile)
  const [showCommentsPanel, setShowCommentsPanel] = useState(false);

  // Load liked reels from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("liked_reels");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setLikedReels(new Set(parsed));
        } catch {
          // Ignore invalid JSON
        }
      }
    }
  }, []);

  // Save liked reels to localStorage
  const saveLikedReels = (liked: Set<number>) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("liked_reels", JSON.stringify([...liked]));
    }
  };

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
          `${API_BASE_URL}/reels?${params.toString()}`,
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
    [searchQuery, sortBy],
  );

  // Fetch comments for a reel
  const fetchComments = useCallback(
    async (reelId: number, page: number = 1) => {
      setCommentsLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/reels/${reelId}/comments?page=${page}&per_page=10`,
        );
        if (!response.ok) throw new Error("Failed to fetch comments");

        const data: CommentsByReelResponse = await response.json();
        if (page === 1) {
          setComments(data.data);
        } else {
          setComments((prev) => [...prev, ...data.data]);
        }
        setCommentsMeta({
          current_page: data.meta.current_page,
          last_page: data.meta.last_page,
          total: data.meta.total,
        });
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setCommentsLoading(false);
      }
    },
    [],
  );

  // Post a comment
  const postComment = async () => {
    if (!selectedReel || !newComment.trim()) return;

    const username = getUsername();
    if (!username) {
      setPendingAction("comment");
      setShowAuthModal(true);
      return;
    }

    setSubmittingComment(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/reels/${selectedReel.id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            comment: newComment.trim(),
          }),
        },
      );

      if (!response.ok) throw new Error("Failed to post comment");

      // Refresh comments
      await fetchComments(selectedReel.id, 1);
      setNewComment("");

      // Scroll to top of comments
      if (commentsEndRef.current) {
        commentsEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setSubmittingComment(false);
    }
  };

  // Like a reel
  const likeReel = async () => {
    if (!selectedReel) return;

    const username = getUsername();
    if (!username) {
      setPendingAction("like");
      setShowAuthModal(true);
      return;
    }

    setLikingReel(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/reels/${selectedReel.id}/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        },
      );

      if (!response.ok) throw new Error("Failed to like reel");

      // Update local state
      const newLikedReels = new Set(likedReels);
      newLikedReels.add(selectedReel.id);
      setLikedReels(newLikedReels);
      saveLikedReels(newLikedReels);

      // Update reel likes count
      setSelectedReel({
        ...selectedReel,
        likes_count: selectedReel.likes_count + 1,
      });
      setReels((prev) =>
        prev.map((r) =>
          r.id === selectedReel.id
            ? { ...r, likes_count: r.likes_count + 1 }
            : r,
        ),
      );
    } catch (error) {
      console.error("Error liking reel:", error);
    } finally {
      setLikingReel(false);
    }
  };

  // Unlike a reel
  const unlikeReel = async () => {
    if (!selectedReel) return;

    setLikingReel(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/reels/${selectedReel.id}/unlike`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) throw new Error("Failed to unlike reel");

      // Update local state
      const newLikedReels = new Set(likedReels);
      newLikedReels.delete(selectedReel.id);
      setLikedReels(newLikedReels);
      saveLikedReels(newLikedReels);

      // Update reel likes count
      setSelectedReel({
        ...selectedReel,
        likes_count: Math.max(0, selectedReel.likes_count - 1),
      });
      setReels((prev) =>
        prev.map((r) =>
          r.id === selectedReel.id
            ? { ...r, likes_count: Math.max(0, r.likes_count - 1) }
            : r,
        ),
      );
    } catch (error) {
      console.error("Error unliking reel:", error);
    } finally {
      setLikingReel(false);
    }
  };

  // Toggle like
  const toggleLike = () => {
    if (!selectedReel) return;
    if (likedReels.has(selectedReel.id)) {
      unlikeReel();
    } else {
      likeReel();
    }
  };

  // Handle auth success
  const handleAuthSuccess = (token: string, username: string) => {
    setShowAuthModal(false);

    // Execute pending action
    if (pendingAction === "comment") {
      postComment();
    } else if (pendingAction === "like") {
      likeReel();
    }
    setPendingAction(null);
  };

  // Fetch comments when modal opens
  useEffect(() => {
    if (isModalOpen && selectedReel) {
      fetchComments(selectedReel.id, 1);
    } else {
      setComments([]);
      setCommentsMeta(null);
    }
  }, [isModalOpen, selectedReel, fetchComments]);

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
    [locale, router],
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
    setShowCommentsPanel(false);
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
                  ),
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
              className="h-full w-full lg:flex lg:items-center lg:justify-center lg:gap-6 lg:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Video Section - Full screen on mobile, sidebar on desktop */}
              <div className="relative h-full lg:h-auto flex items-center justify-center lg:p-0">
                {/* Video Container */}
                <div className="relative w-full h-full lg:w-80 xl:w-96 lg:aspect-9/16 lg:max-h-[85vh] bg-black lg:rounded-2xl overflow-hidden shadow-2xl">
                  <video
                    key={selectedReel.id}
                    src={selectedReel.stream_url}
                    poster={selectedReel.thumbnail_url || undefined}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                    playsInline
                  />

                  {/* Mobile Overlay Info - Instagram/TikTok Style */}
                  <div className="lg:hidden absolute inset-0 pointer-events-none">
                    {/* Top Info */}
                    <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent pointer-events-auto">
                      <div className="flex items-start gap-3">
                        {selectedReel.author.avatar_url ? (
                          <Image
                            src={selectedReel.author.avatar_url}
                            alt={selectedReel.author.name}
                            width={40}
                            height={40}
                            className="rounded-full border-2 border-white/20"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/20">
                            <User className="w-5 h-5 text-white" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold text-sm">
                            {selectedReel.author.name}
                          </p>
                          <p className="text-white/80 text-xs line-clamp-1">
                            {selectedReel.title}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right Side Actions - Vertical Stack */}
                    <div className="absolute right-3 bottom-20 flex flex-col gap-4 pointer-events-auto">
                      {/* Like Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike();
                        }}
                        disabled={likingReel}
                        className="flex flex-col items-center gap-1 group"
                      >
                        <div className="w-12 h-12 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center">
                          {likingReel ? (
                            <Loader2 className="w-7 h-7 text-white animate-spin" />
                          ) : (
                            <Heart
                              className={`w-7 h-7 transition-all ${
                                likedReels.has(selectedReel.id)
                                  ? "text-red-500 fill-red-500 scale-110"
                                  : "text-white group-hover:scale-110"
                              }`}
                            />
                          )}
                        </div>
                        <span className="text-white text-xs font-bold drop-shadow-lg">
                          {formatNumber(selectedReel.likes_count, locale)}
                        </span>
                      </button>

                      {/* Comments Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowCommentsPanel(true);
                        }}
                        className="flex flex-col items-center gap-1 group"
                      >
                        <div className="w-12 h-12 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <MessageCircle className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
                        </div>
                        <span className="text-white text-xs font-bold drop-shadow-lg">
                          {formatNumber(commentsMeta?.total || 0, locale)}
                        </span>
                      </button>

                      {/* Share Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          shareReel();
                        }}
                        className="flex flex-col items-center gap-1 group"
                      >
                        <div className="w-12 h-12 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <Share2 className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
                        </div>
                      </button>
                    </div>

                    {/* Bottom Left Info - Description & Views */}
                    <div className="absolute bottom-3 left-3 right-20 pointer-events-auto">
                      {selectedReel.description && (
                        <p className="text-white text-sm mb-2 line-clamp-2 drop-shadow-lg">
                          {selectedReel.description}
                        </p>
                      )}
                      <div className="flex items-center gap-1 text-white/90">
                        <Eye className="w-4 h-4 drop-shadow-lg" />
                        <span className="text-xs font-semibold drop-shadow-lg">
                          {formatNumber(selectedReel.views_count, locale)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Sidebar - Desktop Only */}
              <div className="hidden lg:flex w-80 xl:w-96 max-h-[85vh] bg-primary-950/95 backdrop-blur-sm rounded-2xl p-5 flex-col">
                {/* Title & Author Row */}
                <div className="flex items-start gap-3 mb-3">
                  {selectedReel.author.avatar_url ? (
                    <Image
                      src={selectedReel.author.avatar_url}
                      alt={selectedReel.author.name}
                      width={40}
                      height={40}
                      className="rounded-full shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-primary-700 rounded-full flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base lg:text-lg font-bold text-white line-clamp-1">
                      {selectedReel.title}
                    </h2>
                    <p className="text-gray-400 text-xs">
                      {t.by} {selectedReel.author.name}
                    </p>
                  </div>
                </div>

                {/* Description - Collapsible on mobile */}
                {selectedReel.description && (
                  <p className="text-gray-300 text-sm mb-3 leading-relaxed line-clamp-2 lg:line-clamp-3">
                    {selectedReel.description}
                  </p>
                )}

                {/* Stats & Actions Row */}
                <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-primary-800">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="flex items-center gap-1 text-gray-300">
                      <Eye className="w-4 h-4" />
                      {formatNumber(selectedReel.views_count, locale)}
                    </span>
                    <span className="flex items-center gap-1 text-gray-300">
                      <MessageCircle className="w-4 h-4" />
                      {formatNumber(commentsMeta?.total || 0, locale)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleLike}
                      disabled={likingReel}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        likedReels.has(selectedReel.id)
                          ? "bg-red-500 text-white"
                          : "bg-primary-800 text-white hover:bg-primary-700"
                      } disabled:opacity-50`}
                    >
                      {likingReel ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Heart
                          className={`w-4 h-4 ${
                            likedReels.has(selectedReel.id)
                              ? "fill-current"
                              : ""
                          }`}
                        />
                      )}
                      {formatNumber(selectedReel.likes_count, locale)}
                    </button>
                    <button
                      onClick={shareReel}
                      className="p-2 bg-primary-800 text-white rounded-full hover:bg-primary-700 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="flex-1 flex flex-col min-h-0">
                  <h3 className="text-white font-semibold text-sm mb-2 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    {t.comments} (
                    {formatNumber(commentsMeta?.total || 0, locale)})
                  </h3>

                  {/* Comments List - Better mobile height */}
                  <div className="flex-1 overflow-y-auto space-y-3 min-h-[120px] max-h-[200px] sm:max-h-[250px] lg:max-h-[280px] bg-primary-900/50 rounded-lg p-3">
                    <div ref={commentsEndRef} />
                    {commentsLoading && comments.length === 0 ? (
                      <div className="flex items-center justify-center py-6">
                        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                      </div>
                    ) : comments.length === 0 ? (
                      <div className="text-center py-6">
                        <MessageCircle className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">{t.noComments}</p>
                        <p className="text-gray-500 text-xs">
                          {t.beFirstToComment}
                        </p>
                      </div>
                    ) : (
                      <>
                        {comments.map((comment) => (
                          <div key={comment.id} className="text-sm">
                            <div className="flex items-start gap-2">
                              <div className="w-7 h-7 bg-primary-700 rounded-full flex items-center justify-center shrink-0">
                                <User className="w-3.5 h-3.5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-medium text-white text-xs">
                                    {comment.username}
                                  </span>
                                  <span className="text-gray-500 text-xs">
                                    {comment.time_ago}
                                  </span>
                                </div>
                                <p className="text-gray-300 text-xs mt-0.5 break-words">
                                  {comment.comment}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                        {commentsMeta &&
                          commentsMeta.current_page <
                            commentsMeta.last_page && (
                            <button
                              onClick={() =>
                                fetchComments(
                                  selectedReel.id,
                                  commentsMeta.current_page + 1,
                                )
                              }
                              disabled={commentsLoading}
                              className="w-full py-2 text-primary-400 text-xs font-medium hover:text-primary-300 transition-colors disabled:opacity-50"
                            >
                              {commentsLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                              ) : (
                                t.loadMore
                              )}
                            </button>
                          )}
                      </>
                    )}
                  </div>

                  {/* Comment Input */}
                  <div className="flex items-center gap-2 mt-3">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          postComment();
                        }
                      }}
                      placeholder={t.writeComment}
                      className="flex-1 bg-primary-800 text-white text-sm px-3 py-2.5 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600"
                    />
                    <button
                      onClick={postComment}
                      disabled={!newComment.trim() || submittingComment}
                      className="p-2.5 bg-primary-700 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submittingComment ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Bottom Actions - Copy Link & Counter */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-primary-800">
                  <button
                    onClick={copyShareLink}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors text-sm ${
                      linkCopied
                        ? "bg-green-600 text-white"
                        : "bg-primary-800 text-gray-300 hover:bg-primary-700"
                    }`}
                  >
                    {linkCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        {t.linkCopied}
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        {t.copyLink}
                      </>
                    )}
                  </button>
                  <span className="text-gray-500 text-xs">
                    {formatNumber(getCurrentReelIndex() + 1, locale)} {t.of}{" "}
                    {formatNumber(reels.length, locale)}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Comments Panel */}
      <AnimatePresence>
        {showCommentsPanel && selectedReel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCommentsPanel(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 bg-primary-950 rounded-t-3xl max-h-[80vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Handle Bar */}
              <div className="flex justify-center py-3">
                <div className="w-12 h-1 bg-gray-600 rounded-full" />
              </div>

              {/* Header */}
              <div className="px-4 pb-3 border-b border-primary-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    {t.comments} (
                    {formatNumber(commentsMeta?.total || 0, locale)})
                  </h3>
                  <button
                    onClick={() => setShowCommentsPanel(false)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
                {commentsLoading && comments.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                  </div>
                ) : comments.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400 text-base font-medium">
                      {t.noComments}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      {t.beFirstToComment}
                    </p>
                  </div>
                ) : (
                  <>
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-primary-700 rounded-full flex items-center justify-center shrink-0">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-semibold text-white text-sm">
                              {comment.username}
                            </span>
                            <span className="text-gray-500 text-xs">
                              {comment.time_ago}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm leading-relaxed break-words">
                            {comment.comment}
                          </p>
                        </div>
                      </div>
                    ))}
                    {commentsMeta &&
                      commentsMeta.current_page < commentsMeta.last_page && (
                        <button
                          onClick={() =>
                            fetchComments(
                              selectedReel.id,
                              commentsMeta.current_page + 1,
                            )
                          }
                          disabled={commentsLoading}
                          className="w-full py-3 text-primary-400 text-sm font-medium hover:text-primary-300 transition-colors disabled:opacity-50"
                        >
                          {commentsLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                          ) : (
                            t.loadMore
                          )}
                        </button>
                      )}
                  </>
                )}
              </div>

              {/* Comment Input */}
              <div className="p-4 border-t border-primary-800 bg-primary-900">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        postComment();
                      }
                    }}
                    placeholder={t.writeComment}
                    className="flex-1 bg-primary-800 text-white px-4 py-3 rounded-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                  <button
                    onClick={postComment}
                    disabled={!newComment.trim() || submittingComment}
                    className="p-3 bg-primary-700 text-white rounded-full hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingComment ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setPendingAction(null);
        }}
        onSuccess={handleAuthSuccess}
        locale={locale}
        translations={{
          title: t.authModalTitle,
          description: t.authModalDescription,
          namePlaceholder: t.authModalNamePlaceholder,
          nameLabel: t.authModalNameLabel,
          submit: t.authModalSubmit,
          cancel: t.cancel,
          generating: t.authModalGenerating,
          success: t.authModalSuccess,
          error: t.authModalError,
        }}
      />
    </div>
  );
}
