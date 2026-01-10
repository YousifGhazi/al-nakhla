"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

const navigationLinks = [
  { href: "/", label: "home" },
  { href: "/news", label: "news" },
  { href: "/radio", label: "radio" },
  { href: "/reels", label: "reels" },
  { href: "/shows", label: "ourShows" },
  { href: "/about", label: "aboutUs" },
  { href: "/contact", label: "contactUs" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const locale = useLocale();
  const isArabic = locale === "ar";
  const t = useTranslations("Header");

  return (
    <header className="bg-linear-to-r from-primary-700 via-primary-800 to-primary-700 shadow-lg -lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center">
            <Image
              src="/images/full-logo.svg"
              alt="Al Nakhla FM"
              width={180}
              height={60}
              className="h-14 w-auto"
              priority
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={`/${locale}${link.href}`}
                className="px-4 py-2 text-white hover:bg-white/20 rounded-lg transition-all duration-300 font-medium text-sm"
              >
                {t(link.label)}
              </Link>
            ))}
          </nav>

          {/* Language Switcher & Mobile Menu Button */}
          <div className="flex items-center gap-2">
            <Link
              href={`/${isArabic ? "en" : "ar"}`}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300 font-medium text-sm"
            >
              {t("languageSwitch")}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-white hover:bg-white/20 rounded-lg transition-all"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/20">
            <nav className="py-4 px-4 space-y-2">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={`/${locale}${link.href}`}
                  className="block px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-all duration-300 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t(link.label)}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
