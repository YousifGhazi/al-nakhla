import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import NewsImage from "@/components/news-image";
import ShareButtons from "@/components/news/share-buttons";
import { News } from "@/types/news";
import {
  Clock,
  Eye,
  User,
  Tag,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

const API_BASE_URL = "https://api.palm-fm.cloud/api";

interface NewsDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

async function getNewsBySlug(slug: string): Promise<News | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/news/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error("Failed to fetch news");
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error("Error fetching news:", error);
    return null;
  }
}

async function getRelatedNews(
  categoryId: number,
  excludeId: number
): Promise<News[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/news?category=${categoryId}&per_page=3&sort=-published_at`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch related news");
    }

    const data = await response.json();
    return (data.data || []).filter((item: News) => item.id !== excludeId);
  } catch (error) {
    console.error("Error fetching related news:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: NewsDetailPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const news = await getNewsBySlug(slug);

  if (!news) {
    return {
      title: "News Not Found",
    };
  }

  const siteName = locale === "ar" ? "النخلة إف إم" : "Al Nakhla FM";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://alnakhlafm.com";
  const pageUrl = `${siteUrl}/${locale}/news/${slug}`;
  
  // Ensure image URL is absolute
  const imageUrl = news.cover_url?.startsWith("http") 
    ? news.cover_url 
    : news.cover_url 
      ? `${siteUrl}${news.cover_url}` 
      : undefined;

  return {
    title: `${news.title} | ${siteName}`,
    description: news.description,
    openGraph: {
      title: news.title,
      description: news.description,
      url: pageUrl,
      siteName,
      images: imageUrl ? [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: news.title,
        },
      ] : [],
      locale: locale === "ar" ? "ar_SA" : "en_US",
      type: "article",
      publishedTime: news.published_at,
      authors: news.author?.name ? [news.author.name] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: news.title,
      description: news.description,
      images: imageUrl ? [imageUrl] : [],
    },
    alternates: {
      canonical: pageUrl,
      languages: {
        ar: `${siteUrl}/ar/news/${slug}`,
        en: `${siteUrl}/en/news/${slug}`,
      },
    },
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug, locale } = await params;
  const t = await getTranslations("NewsDetail");
  const isArabic = locale === "ar";

  const news = await getNewsBySlug(slug);

  if (!news) {
    notFound();
  }

  const relatedNews = news.category
    ? await getRelatedNews(news.category.id, news.id)
    : [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      isArabic ? "ar-SA" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  };

  const formatViews = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section with Cover Image */}
        <div className="relative h-[50vh] md:h-[60vh] bg-gray-900">
          <NewsImage
            src={news.cover_url}
            alt={news.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />

          {/* Back Button */}
          <div className="absolute top-6 left-6 z-10">
            <Link
              href={`/${locale}/news`}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full hover:bg-white/20 transition-colors"
            >
              {isArabic ? (
                <ArrowRight className="w-5 h-5" />
              ) : (
                <ArrowLeft className="w-5 h-5" />
              )}
              <span>{t("backToNews")}</span>
            </Link>
          </div>

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <div className="container mx-auto">
              {/* Category Badge */}
              {news.category && (
                <Link
                  href={`/${locale}/news?category=${news.category.slug}`}
                  className="inline-block px-4 py-1.5 bg-primary-800 text-white text-sm font-semibold rounded-full mb-4 hover:bg-emerald-700 transition-colors"
                >
                  <Tag className="w-4 h-4 inline-block mr-1" />
                  {news.category.name}
                </Link>
              )}

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                {news.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-white/80">
                {news.author && (
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    <span>{news.author.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{formatDate(news.published_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  <span>
                    {formatViews(news.views_count)} {t("views")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 md:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <article className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                {/* Description/Content */}
                <div className="prose prose-lg max-w-none">
                  {news.description && (
                    <p className="text-xl text-gray-600 leading-relaxed mb-8 font-medium">
                      {news.description}
                    </p>
                  )}
                </div>

                {/* Share Section */}
                <ShareButtons
                  title={news.title}
                  translations={{
                    shareArticle: t("shareArticle"),
                    copyLink: t("copyLink"),
                    linkCopied: t("linkCopied"),
                  }}
                />
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              {/* Related News */}
              {relatedNews.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    {t("relatedNews")}
                  </h3>
                  <div className="space-y-6">
                    {relatedNews.map((item) => (
                      <Link
                        key={item.id}
                        href={`/${locale}/news/${item.slug}`}
                        className="group block"
                      >
                        <div className="relative h-40 rounded-xl overflow-hidden mb-3">
                          <NewsImage
                            src={item.cover_url}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <h4 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors line-clamp-2">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDate(item.published_at)}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
