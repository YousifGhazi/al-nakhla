"use client";

import Image from "next/image";
import { useState } from "react";

interface NewsImageProps {
  src?: string | null;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export default function NewsImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className = "",
  priority = false,
}: NewsImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const showFallback = !src || hasError;

  if (showFallback) {
    // For fill mode, use absolute positioning to fill the parent
    const baseClasses = fill
      ? "absolute inset-0 w-full h-full"
      : "";
    
    return (
      <div
        className={`${baseClasses} bg-gray-800 flex items-center justify-center ${className}`}
        style={!fill ? { width, height } : undefined}
      >
        <div className="flex flex-col items-center justify-center gap-2 text-gray-400 p-4">
          <svg
            className="w-12 h-12 md:w-16 md:h-16"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-xs md:text-sm font-medium text-center">Al Nakhla FM</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div
          className={`${fill ? "absolute inset-0" : ""} bg-gray-700 animate-pulse ${className}`}
          style={!fill ? { width, height } : undefined}
        />
      )}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        className={`${className} ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
        priority={priority}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
      />
    </>
  );
}
