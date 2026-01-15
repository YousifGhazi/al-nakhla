"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%231f2937' width='200' height='200'/%3E%3Ccircle cx='100' cy='80' r='35' fill='%234b5563'/%3E%3Cpath d='M100 60 L100 100 M80 80 L120 80' stroke='%236b7280' stroke-width='6' stroke-linecap='round'/%3E%3Crect x='50' y='140' width='100' height='8' rx='4' fill='%234b5563'/%3E%3Crect x='65' y='155' width='70' height='6' rx='3' fill='%23374151'/%3E%3C/svg%3E";

// Pre-computed heights to avoid hydration mismatch
const SOUNDWAVE_HEIGHTS = Array.from({ length: 80 }, (_, i) =>
  Math.round(Math.sin(i * 0.2) * 30 + 40)
);

interface RadioCardProps {
  title: string;
  description: string;
  imageUrl: string;
  isLive?: boolean;
}

function RadioCard({
  title,
  description,
  imageUrl,
  isLive = true,
}: RadioCardProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [imageError, setImageError] = useState(false);
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);
  return (
    <div className="w-full max-w-7xl mx-auto ">
      {/* Main Card Container - Wide horizontal layout */}
      <div className="relative bg-linear-to-br rounded-2xl from-primary-900 via-primary-800 to-primary-950 overflow-hidden shadow-2xl border border-primary-700/50">
        {/* Soundwave Animation - Background of entire card */}
        <div className="absolute inset-0 flex items-center justify-center gap-1 z-0 overflow-hidden">
          {SOUNDWAVE_HEIGHTS.map((height, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-150 ${
                isPlaying ? "bg-primary-400/40" : "bg-primary-600/30"
              }`}
              style={{
                height: `${height}%`,
                animation: isPlaying
                  ? `soundWave 0.6s ease-in-out ${i * 0.02}s infinite alternate`
                  : undefined,
              }}
            />
          ))}
        </div>
        <audio
          ref={audioRef}
          src="https://a4.asurahosting.com:6970/radio.mp3"
          preload="metadata"
        />
        {/* Content wrapper - flex row on large, column on small */}
        <div className="relative z-10 flex flex-col md:flex-row-reverse p-8 md:py-32 md:px-24 gap-10 md:gap-16">
          {/* Square Image - Small and fixed size */}
          <div className="relative shrink-0 w-52 h-52 md:w-80 md:h-80 mx-auto md:mx-0">
            <Image
              src={imageError ? FALLBACK_IMAGE : imageUrl}
              alt={title}
              className="w-full h-full object-cover "
              onError={() => setImageError(true)}
              width={320}
              height={320}
              priority
            />
            {/* Live Badge on image */}
            {isLive && (
              <div className="absolute -top-2 -left-2 flex items-center gap-1.5 bg-red-600 px-2 py-1 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                <span className="text-white text-xs font-bold uppercase tracking-wider">
                  Live
                </span>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="flex-1 flex flex-col justify-between text-center md:text-start">
            {/* Top - Title, Description, Listeners */}
            <div>
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <h3 className="text-white text-2xl md:text-4xl font-bold leading-tight">
                  {title}
                </h3>
              </div>
              <p className="text-white text-sm md:text-lg mb-6 line-clamp-3">
                {description}
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-center md:justify-start gap-6">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 ${
                  isPlaying
                    ? "bg-primary-600 text-white hover:bg-primary-700"
                    : "bg-white text-gray-900 hover:bg-gray-100"
                }`}
              >
                {isPlaying ? (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Pause
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Play
                  </>
                )}
              </button>

              {/* Save Button */}
              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`p-3 rounded-full transition-all duration-300 ${
                  isSaved
                    ? "bg-primary-600/30 text-white"
                    : "bg-primary-700/50 text-white hover:bg-primary-700 hover:text-white"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill={isSaved ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for soundwave animation */}
      <style jsx>{`
        @keyframes soundWave {
          0% {
            height: 20%;
          }
          100% {
            height: 80%;
          }
        }
      `}</style>
    </div>
  );
}

export default RadioCard;
