"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import {
  Radio,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Clock,
  Newspaper,
  Mic,
} from "lucide-react";
import { Category } from "@/types/categories";
import { useEffect, useState } from "react";

export default function Footer() {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const t = useTranslations("Footer");
  const [categoriesData, setCategoriesData] = useState<Category[]>([]);
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch(
          `https://api.palm-fm.cloud/api/categories`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategoriesData(data.data || []);
      } catch (error) {
        console.error("حصل خطأ:", error);
      }
    }
    fetchCategories();
  }, []);
  const quickLinks = [
    {
      titleKey: "home",
      href: `/${locale}`,
    },
    {
      titleKey: "news",
      href: `/${locale}/news`,
    },
    {
      titleKey: "programs",
      href: `/${locale}/programs`,
    },
    {
      titleKey: "aboutUs",
      href: `/${locale}/about`,
    },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      href: "https://facebook.com/alnakhlafm",
      color: "hover:text-blue-500",
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: "https://twitter.com/alnakhlafm",
      color: "hover:text-sky-400",
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: "https://instagram.com/alnakhlafm",
      color: "hover:text-pink-500", 
    },
    {
      name: "Youtube",
      icon: Youtube,
      href: "https://www.youtube.com/@alnakhlafm",
      color: "hover:text-primary-600",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: "https://linkedin.com/company/alnakhlafm",
      color: "hover:text-blue-600",
    },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ">
          {/* About Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary-500 p-2 rounded-lg">
                <Radio className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {t("radioStation")}
                </h3>
                <p className="text-sm text-primary-400">{t("tagline")}</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              {t("description")}
            </p>

            {/* Social Media Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`bg-gray-800 p-2.5 rounded-lg transition-all duration-300 hover:scale-110 ${social.color}`}
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-primary-400" />
              {t("quickLinks")}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-primary-400 transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="text-primary-400 group-hover:translate-x-1 transition-transform">
                      {isArabic ? "←" : "→"}
                    </span>
                    {t(link.titleKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Mic className="w-5 h-5 text-primary-400" />
              {t("categories")}
            </h4>
            <ul className="space-y-3">
              {categoriesData.map((category, index) => {
                if (index + 1 > 4) return null; // Limit to 4 categories
                return (
                  <li key={index}>
                    <Link
                      href={`/${locale}/news?category=${category.slug}`}
                      className="text-gray-400 hover:text-primary-400 transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <span className="text-primary-400 group-hover:translate-x-1 transition-transform">
                        {isArabic ? "←" : "→"}
                      </span>
                      {category.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary-400" />
              {t("contactUs")}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-400 flex-shrink-0 mt-1" />
                <span className="text-gray-400">{t("address")}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a
                  href="tel:+966123456789"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                >
                  +966 12 345 6789
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a
                  href="mailto:info@alnakhlafm.com"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                >
                  info@alnakhlafm.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-white font-semibold">
                    {t("liveBroadcasting")}
                  </p>
                  <p className="text-gray-400 text-sm">{t("allDay")}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
