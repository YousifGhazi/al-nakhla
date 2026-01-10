import { getTranslations } from "next-intl/server";
import Link from "next/link";
import {
  TrendingUp,
  Newspaper,
  Globe,
  Gamepad2,
  Clapperboard,
  Landmark,
  Cpu,
  ArrowRight,
  Eye,
  ArrowLeft,
} from "lucide-react";
import { News, NewsListResponse } from "@/types/news";
import NewsImage from "@/components/news-image";

const API_BASE_URL = "http://168.231.101.52:8080/api";

interface CategoryConfig {
  slug: string;
  titleKey: string;
  icon: React.ElementType;
}

const categoryConfigs: CategoryConfig[] = [
  {
    slug: "sports",
    titleKey: "sports",
    icon: Gamepad2,
  },
  {
    slug: "entertainment",
    titleKey: "entertainment",
    icon: Clapperboard,
  },
  {
    slug: "politics",
    titleKey: "politics",
    icon: Landmark,
  },
  {
    slug: "technology",
    titleKey: "technology",
    icon: Cpu,
  },
];

async function getNewsByCategory(
  categorySlug: string,
  limit: number = 2
): Promise<News[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/news?page=1&per_page=${limit}&category=${categorySlug}&sort=-published_at`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      return [];
    }

    const data: NewsListResponse = await response.json();
    return data.data || [];
  } catch (error) {
    console.error(`Error fetching ${categorySlug} news:`, error);
    return [];
  }
}

function formatDate(dateString: string, locale: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatViews(views: number): string {
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`;
  }
  return views.toString();
}

interface NewsCategoriesDynamicProps {
  locale: string;
}

export default async function NewsCategoriesDynamic({
  locale,
}: NewsCategoriesDynamicProps) {
  const t = await getTranslations("NewsCategoriesDynamic");
  const isArabic = locale === "ar";

  // Fetch news for all categories in parallel
  const categoryNewsPromises = categoryConfigs.map(async (config) => {
    const news = await getNewsByCategory(config.slug, 2);
    return {
      ...config,
      news,
    };
  });

  const categoriesWithNews = await Promise.all(categoryNewsPromises);

  // Filter out categories with no news
  const validCategories = categoriesWithNews.filter(
    (cat) => cat.news.length >= 2
  );

  if (validCategories.length === 0) {
    return null;
  }

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
          {validCategories.map((category) => {
            const Icon = category.icon;
            const mainArticle = category.news[0];
            const sideArticle = category.news[1];

            if (!mainArticle || !sideArticle) return null;

            return (
              <div key={category.slug} className="group">
                {/* Category Title Bar */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-2 text-gray-900">
                    <Icon className="w-6 h-6 text-red-600" />
                    <h3 className="text-2xl font-bold">
                      {t(category.titleKey)}
                    </h3>
                  </div>
                  <div className="h-0.5 flex-1 bg-gray-200"></div>
                  <Link
                    href={`/${locale}/news?category=${category.slug}`}
                    className="text-red-600 hover:text-red-700 font-semibold text-sm flex items-center gap-1 transition-colors"
                  >
                    {t("viewAllNews")}
                    {isArabic ? (
                      <ArrowLeft className="w-4 h-4" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
                  </Link>
                </div>

                {/* Articles Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Main Featured Article */}
                  <Link
                    href={`/${locale}/news/${mainArticle.slug}`}
                    className="group/card bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-red-400"
                  >
                    <div className="relative h-80">
                      <NewsImage
                        src={mainArticle.cover_url}
                        alt={mainArticle.title}
                        fill
                        className="object-cover group-hover/card:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent"></div>

                      {/* Content Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="flex items-center gap-4 text-white/90 text-sm mb-3">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {formatViews(mainArticle.views_count)}
                          </span>
                          <span>•</span>
                          <span>
                            {formatDate(mainArticle.published_at, locale)}
                          </span>
                        </div>

                        <h4 className="text-2xl md:text-3xl font-bold text-white mb-2 line-clamp-2 leading-tight">
                          {mainArticle.title}
                        </h4>
                      </div>
                    </div>
                  </Link>

                  {/* Side Article */}
                  <Link
                    href={`/${locale}/news/${sideArticle.slug}`}
                    className="group/card bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-red-400"
                  >
                    <div className="relative h-80">
                      <NewsImage
                        src={sideArticle.cover_url}
                        alt={sideArticle.title}
                        fill
                        className="object-cover group-hover/card:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent"></div>

                      {/* Content Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="flex items-center gap-4 text-white/90 text-sm mb-3">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {formatViews(sideArticle.views_count)}
                          </span>
                          <span>•</span>
                          <span>
                            {formatDate(sideArticle.published_at, locale)}
                          </span>
                        </div>

                        <h4 className="text-2xl md:text-3xl font-bold text-white mb-2 line-clamp-2 leading-tight">
                          {sideArticle.title}
                        </h4>
                      </div>
                    </div>
                  </Link>
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
