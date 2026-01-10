"use client";

import Image from "next/image";
import { useState } from "react";
import { Radio } from "lucide-react";

interface ShowImageProps {
  src?: string | null;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export default function ShowImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className = "",
  priority = false,
}: ShowImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const showFallback = !src || hasError;

  if (showFallback) {
    // For fill mode, use absolute positioning to fill the parent
    const baseClasses = fill ? "absolute inset-0 w-full h-full" : "";

    return (
      <div
        className={`${baseClasses} bg-linear-to-br from-primary-600 via-primary-700 to-primary-800 flex items-center justify-center ${className}`}
        style={!fill ? { width, height } : undefined}
      >
        <div className="flex flex-col items-center justify-center gap-2 text-white/80 p-4">
          <Radio className="w-10 h-10 md:w-14 md:h-14" />
          <span className="text-xs md:text-sm font-medium text-center text-white/60">
            Al Nakhla FM
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div
          className={`${
            fill ? "absolute inset-0" : ""
          } bg-linear-to-br from-primary-600 via-primary-700 to-primary-800 animate-pulse ${className}`}
          style={!fill ? { width, height } : undefined}
        />
      )}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        className={`${className} ${
          isLoading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-300`}
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
