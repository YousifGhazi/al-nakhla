"use client";

import { useState } from "react";
import { Share2, Facebook, Link as LinkIcon, Check } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  translations: {
    shareArticle: string;
    copyLink: string;
    linkCopied: string;
  };
}

export default function ShareButtons({
  title,
  translations: t,
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      window.location.href
    )}`;
    window.open(facebookUrl, "_blank", "width=600,height=400");
  };

  const handleXShare = () => {
    const xUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      window.location.href
    )}&text=${encodeURIComponent(title)}`;
    window.open(xUrl, "_blank", "width=600,height=400");
  };

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Share2 className="w-5 h-5 text-primary-700" />
        {t.shareArticle}
      </h3>
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleFacebookShare}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
        >
          <Facebook className="w-5 h-5" />
          <span>Facebook</span>
        </button>

        <button
          onClick={handleXShare}
          className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span>X</span>
        </button>

        <button
          onClick={handleCopyLink}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg ${
            copied
              ? "bg-green-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {copied ? (
            <>
              <Check className="w-5 h-5" />
              <span>{t.linkCopied}</span>
            </>
          ) : (
            <>
              <LinkIcon className="w-5 h-5" />
              <span>{t.copyLink}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
