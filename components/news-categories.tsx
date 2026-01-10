"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import {
  TrendingUp,
  Newspaper,
  Globe,
  Users,
  ArrowRight,
  Eye,
  ArrowLeft,
} from "lucide-react";

interface NewsCategory {
  id: number;
  titleAr: string;
  titleEn: string;
  titleKey: string;
  icon: React.ElementType;
  color: string;
  bgGradient: string;
  articles: {
    titleAr: string;
    titleEn: string;
    image: string;
    dateAr: string;
    dateEn: string;
    views?: string;
  }[];
}

const categories: NewsCategory[] = [
  {
    id: 1,
    titleAr: "الأخبار الرائجة",
    titleEn: "Trending News",
    titleKey: "trendingNews",
    icon: TrendingUp,
    color: "emerald",
    bgGradient: "from-emerald-600 to-teal-700",
    articles: [
      {
        titleAr: "أحدث التطورات في السياسة العالمية وتأثيرها على المنطقة",
        titleEn: "Latest developments in global politics and regional impact",
        image:
          "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&h=600&fit=crop",
        dateAr: "منذ ساعتين",
        dateEn: "2 hours ago",
        views: "12.3K",
      },
      {
        titleAr: "اختراق تكنولوجي جديد في مجال الذكاء الاصطناعي",
        titleEn: "New breakthrough in artificial intelligence technology",
        image:
          "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
        dateAr: "منذ ٤ ساعات",
        dateEn: "4 hours ago",
        views: "8.7K",
      },
    ],
  },
  {
    id: 2,
    titleAr: "أخبار محلية",
    titleEn: "Local News",
    titleKey: "localNews",
    icon: Newspaper,
    color: "teal",
    bgGradient: "from-slate-600 to-slate-700",
    articles: [
      {
        titleAr: "افتتاح مشروع تنموي جديد في المدينة",
        titleEn: "Opening of new development project in the city",
        image:
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
        dateAr: "منذ ٣ ساعات",
        dateEn: "3 hours ago",
        views: "15.1K",
      },
      {
        titleAr: "فعاليات ثقافية متنوعة تنطلق نهاية الأسبوع",
        titleEn: "Various cultural events launching this weekend",
        image:
          "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop",
        dateAr: "منذ ٥ ساعات",
        dateEn: "5 hours ago",
        views: "9.4K",
      },
    ],
  },
  {
    id: 3,
    titleAr: "أخبار عالمية",
    titleEn: "World News",
    titleKey: "worldNews",
    icon: Globe,
    color: "sky",
    bgGradient: "from-slate-500 to-gray-600",
    articles: [
      {
        titleAr: "قمة دولية تناقش التغير المناخي والحلول المستدامة",
        titleEn:
          "International summit discusses climate change and sustainable solutions",
        image:
          "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop",
        dateAr: "منذ ساعة",
        dateEn: "1 hour ago",
        views: "18.9K",
      },
      {
        titleAr: "إنجازات رياضية عالمية في بطولات هذا الأسبوع",
        titleEn: "Global sports achievements in this week's championships",
        image:
          "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop",
        dateAr: "منذ ٦ ساعات",
        dateEn: "6 hours ago",
        views: "22.5K",
      },
    ],
  },
  {
    id: 4,
    titleAr: "مجتمع وثقافة",
    titleEn: "Society & Culture",
    titleKey: "societyCulture",
    icon: Users,
    color: "amber",
    bgGradient: "from-slate-600 to-gray-700",
    articles: [
      {
        titleAr: "معرض فني يحتفي بالتراث والفن المعاصر",
        titleEn: "Art exhibition celebrates heritage and contemporary art",
        image:
          "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=600&fit=crop",
        dateAr: "منذ ٧ ساعات",
        dateEn: "7 hours ago",
        views: "11.2K",
      },
      {
        titleAr: "مبادرة مجتمعية تدعم الشباب والابتكار",
        titleEn: "Community initiative supports youth and innovation",
        image:
          "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop",
        dateAr: "منذ ٨ ساعات",
        dateEn: "8 hours ago",
        views: "7.8K",
      },
    ],
  },
];

export default function NewsCategories() {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const t = useTranslations("NewsCategories");

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Newspaper className="w-10 h-10 text-red-600" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              {t("title")}
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t("description")}
          </p>
        </div>

        {/* Categories Grid - Magazine Style */}
        <div className="space-y-12">
          {categories.map((category) => {
            const Icon = category.icon;
            const mainArticle = category.articles[0];
            const sideArticle = category.articles[1];

            return (
              <div key={category.id} className="group">
                {/* Category Title Bar */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-2 text-gray-900">
                    <Icon className="w-6 h-6 text-red-600" />
                    <h3 className="text-2xl font-bold">
                      {t(category.titleKey)}
                    </h3>
                  </div>
                  <div className="h-0.5 flex-1 bg-gray-200"></div>
                  <button className="text-red-600 hover:text-red-700 font-semibold text-sm flex items-center gap-1 transition-colors">
                    {t("viewAllNews")}
                    {isArabic ? (
                      <ArrowLeft className="w-4 h-4" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Articles Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Main Featured Article */}
                  <div className="group/card bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-red-400">
                    <div className="relative h-80">
                      <Image
                        src={mainArticle.image}
                        alt={
                          isArabic ? mainArticle.titleAr : mainArticle.titleEn
                        }
                        fill
                        className="object-cover group-hover/card:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent"></div>

                      {/* Content Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="flex items-center gap-4 text-white/90 text-sm mb-3">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {mainArticle.views}
                          </span>
                          <span>•</span>
                          <span>
                            {isArabic ? mainArticle.dateAr : mainArticle.dateEn}
                          </span>
                        </div>

                        <h4 className="text-2xl md:text-3xl font-bold text-white mb-2 line-clamp-2 leading-tight">
                          {isArabic ? mainArticle.titleAr : mainArticle.titleEn}
                        </h4>
                      </div>
                    </div>
                  </div>

                  {/* Side Article */}
                  <div className="group/card bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-red-400">
                    <div className="relative h-80">
                      <Image
                        src={sideArticle.image}
                        alt={
                          isArabic ? sideArticle.titleAr : sideArticle.titleEn
                        }
                        fill
                        className="object-cover group-hover/card:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent"></div>

                      {/* Content Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="flex items-center gap-4 text-white/90 text-sm mb-3">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {sideArticle.views}
                          </span>
                          <span>•</span>
                          <span>
                            {isArabic ? sideArticle.dateAr : sideArticle.dateEn}
                          </span>
                        </div>

                        <h4 className="text-2xl md:text-3xl font-bold text-white mb-2 line-clamp-2 leading-tight">
                          {isArabic ? sideArticle.titleAr : sideArticle.titleEn}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Link
            href={`/${locale}/news`}
            className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-red-600 hover:bg-red-600 text-red-600 hover:text-white font-bold rounded-lg text-lg transition-all duration-300 shadow-lg inline-flex items-center gap-3"
          >
            <Newspaper className="w-6 h-6" />
            {t("exploreAllCategories")}
          </Link>
        </div>
      </div>
    </section>
  );
}
