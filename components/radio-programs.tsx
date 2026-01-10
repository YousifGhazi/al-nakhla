"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { Radio, Clock, Users, Play } from "lucide-react";

interface Program {
  id: number;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  hostAr: string;
  hostEn: string;
  timeAr: string;
  timeEn: string;
  image: string;
  listeners: string;
  isLive?: boolean;
}

const programs: Program[] = [
  {
    id: 1,
    titleAr: "صباح النخلة",
    titleEn: "Nakhla Morning",
    descriptionAr: "ابدأ يومك مع الموسيقى الرائعة والطاقة الإيجابية",
    descriptionEn: "Start your day with great music and positive energy",
    hostAr: "أحمد السالم",
    hostEn: "Ahmed Al-Salem",
    timeAr: "٦:٠٠ - ١٠:٠٠ صباحاً",
    timeEn: "6:00 - 10:00 AM",
    image:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&h=600&fit=crop",
    listeners: "15.2K",
    isLive: true,
  },
  {
    id: 2,
    titleAr: "الموسيقى المعاصرة",
    titleEn: "Contemporary Music",
    descriptionAr: "أحدث الأغاني العربية والعالمية بدون توقف",
    descriptionEn: "Latest Arabic and international songs non-stop",
    hostAr: "سارة محمد",
    hostEn: "Sara Mohammed",
    timeAr: "١٠:٠٠ صباحاً - ٢:٠٠ مساءً",
    timeEn: "10:00 AM - 2:00 PM",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
    listeners: "12.8K",
  },
  {
    id: 3,
    titleAr: "ساعة العصر",
    titleEn: "Afternoon Hour",
    descriptionAr: "أفضل المقابلات مع نجوم الفن والمجتمع",
    descriptionEn: "Best interviews with art and society stars",
    hostAr: "خالد العتيبي",
    hostEn: "Khaled Al-Otaibi",
    timeAr: "٢:٠٠ - ٦:٠٠ مساءً",
    timeEn: "2:00 - 6:00 PM",
    image:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&h=600&fit=crop",
    listeners: "18.5K",
  },
  {
    id: 4,
    titleAr: "ليالي النخلة",
    titleEn: "Nakhla Nights",
    descriptionAr: "أمسيات موسيقية رومانسية وهادئة",
    descriptionEn: "Romantic and calm musical evenings",
    hostAr: "ليلى العمري",
    hostEn: "Layla Al-Omari",
    timeAr: "٦:٠٠ - ١٢:٠٠ منتصف الليل",
    timeEn: "6:00 PM - 12:00 AM",
    image:
      "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=600&fit=crop",
    listeners: "21.3K",
  },
];

export default function RadioPrograms() {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const t = useTranslations("RadioPrograms");

  return (
    <section className="py-16 bg-linear-to-br from-gray-900 via-red-950 to-gray-900 text-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-rose-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Radio className="w-10 h-10 text-red-400" />
            <h2 className="text-4xl md:text-5xl font-bold">{t("title")}</h2>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {t("description")}
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {programs.map((program) => (
            <div
              key={program.id}
              className="group bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:border-red-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/20"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Program Image */}
                <div className="relative sm:w-48 h-48 sm:h-auto shrink-0">
                  <Image
                    src={program.image}
                    alt={isArabic ? program.titleAr : program.titleEn}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {program.isLive && (
                    <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2 animate-pulse">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      {t("live")}
                    </div>
                  )}
                  <button className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Play className="w-16 h-16 text-white" fill="white" />
                  </button>
                </div>

                {/* Program Info */}
                <div className="p-6 flex-1">
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-red-400 transition-colors">
                    {isArabic ? program.titleAr : program.titleEn}
                  </h3>
                  <p className="text-gray-300 mb-4 line-clamp-2">
                    {isArabic ? program.descriptionAr : program.descriptionEn}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Users className="w-4 h-4 text-red-400" />
                      <span className="font-semibold">{t("host")}</span>
                      <span>{isArabic ? program.hostAr : program.hostEn}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Clock className="w-4 h-4 text-red-400" />
                      <span className="font-semibold">{t("time")}</span>
                      <span>{isArabic ? program.timeAr : program.timeEn}</span>
                    </div>
                    <div className="flex items-center gap-2 text-red-400 font-semibold">
                      <Radio className="w-4 h-4" />
                      <span>
                        {program.listeners} {t("listeners")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link
            href={`/${locale}/shows`}
            className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white hover:bg-white hover:text-gray-900 text-white font-bold rounded-lg text-lg transition-all duration-300 shadow-lg inline-flex items-center gap-3"
          >
            <Radio className="w-6 h-6" />
            {t("viewFullSchedule")}
          </Link>
        </div>
      </div>
    </section>
  );
}
