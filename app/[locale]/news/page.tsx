import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import NewsImage from "@/components/news-image";
import SortSelect from "@/components/news/sort-select";
import {
  NewsListResponse,
  NewsListResponseRaw,
  normalizeMeta,
} from "@/types/news";
import { Category } from "@/types/categories";
import {
  Search,
  Eye,
  Clock,
  ChevronLeft,
  ChevronRight,
  Tag,
  TrendingUp,
  Filter,
} from "lucide-react";

const API_BASE_URL = "http://168.231.101.52:8080/api";

interface NewsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    page?: string;
    per_page?: string;
    category?: string;
    date_from?: string;
    date_to?: string;
    featured?: string;
    q?: string;
    sort?: string;
  }>;
}

type SortOption =
  | "published_at"
  | "-published_at"
  | "views_count"
  | "-views_count"
  | "title"
  | "-title";

async function getNewsList(params: {
  page?: number;
  per_page?: number;
  category?: string;
  date_from?: string;
  date_to?: string;
  featured?: boolean;
  q?: string;
  sort?: SortOption;
}): Promise<NewsListResponse | null> {
  try {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.set("page", params.page.toString());
    if (params.per_page)
      searchParams.set("per_page", params.per_page.toString());
    if (params.category) searchParams.set("category", params.category);
    if (params.date_from) searchParams.set("date_from", params.date_from);
    if (params.date_to) searchParams.set("date_to", params.date_to);
    if (params.featured !== undefined)
      searchParams.set("featured", params.featured.toString());
    if (params.q) searchParams.set("q", params.q);
    if (params.sort) searchParams.set("sort", params.sort);

    const response = await fetch(
      `${API_BASE_URL}/news?${searchParams.toString()}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch news list");
    }

    const rawData: NewsListResponseRaw = await response.json();
    // Normalize the meta data (API returns arrays, we need single values)
    return {
      data: rawData.data,
      links: rawData.links,
      meta: normalizeMeta(rawData.meta),
    };
  } catch (error) {
    console.error("Error fetching news list:", error);
    return null;
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: NewsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "News" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function NewsPage({
  params,
  searchParams,
}: NewsPageProps) {
  const { locale } = await params;
  const search = await searchParams;
  const t = await getTranslations("News");
  const isArabic = locale === "ar";

  const page = parseInt(search.page || "1", 10);
  const perPage = parseInt(search.per_page || "12", 10);
  const sort = (search.sort as SortOption) || "-published_at";

  const [newsResponse, categories] = await Promise.all([
    getNewsList({
      page,
      per_page: perPage,
      category: search.category,
      date_from: search.date_from,
      date_to: search.date_to,
      featured: search.featured === "true" ? true : undefined,
      q: search.q,
      sort,
    }),
    getCategories(),
  ]);

  const news = newsResponse?.data || [];
  const meta = newsResponse?.meta;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      isArabic ? "ar-SA" : "en-US",
      {
        year: "numeric",
        month: "short",
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

  // Build URL with params
  const buildUrl = (newParams: Record<string, string | undefined>) => {
    const urlParams = new URLSearchParams();
    const merged = {
      page: search.page,
      category: search.category,
      date_from: search.date_from,
      date_to: search.date_to,
      featured: search.featured,
      q: search.q,
      sort: search.sort,
      ...newParams,
    };

    Object.entries(merged).forEach(([key, value]) => {
      if (value && value !== "1" && key !== "page") {
        urlParams.set(key, value);
      } else if (key === "page" && value && value !== "1") {
        urlParams.set(key, value);
      }
    });

    const queryString = urlParams.toString();
    return `/${locale}/news${queryString ? `?${queryString}` : ""}`;
  };

  const sortOptions = [
    { value: "-published_at", labelKey: "sortNewest" },
    { value: "published_at", labelKey: "sortOldest" },
    { value: "-views_count", labelKey: "sortMostViewed" },
    { value: "views_count", labelKey: "sortLeastViewed" },
    { value: "title", labelKey: "sortTitleAZ" },
    { value: "-title", labelKey: "sortTitleZA" },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <div className="bg-linear-to-r from-primary-700 via-primary-800 to-primary-700 py-16">
          <div className="container mx-auto px-4 md:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t("title")}
            </h1>
            <p className="text-xl text-white/80">{t("subtitle")}</p>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Categories Sidebar */}
            {categories.length > 0 && (
              <aside className="lg:w-64 shrink-0">
                <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-primary-800" />
                    {t("categories")}
                  </h2>
                  <div className="flex flex-col gap-2">
                    <Link
                      href={buildUrl({ category: undefined, page: "1" })}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        !search.category
                          ? "bg-primary-800 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {t("allCategories")}
                    </Link>
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={buildUrl({ category: cat.slug, page: "1" })}
                        className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
                          search.category === cat.slug
                            ? "bg-primary-800 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        <span>{cat.name}</span>
                        <span className="text-xs opacity-70">
                          {cat.news_count}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </aside>
            )}

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Filters Section */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <div className="flex flex-wrap items-center gap-4">
                  {/* Search Form */}
                  <form
                    action={`/${locale}/news`}
                    method="GET"
                    className="flex-1 min-w-[200px]"
                  >
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="q"
                        defaultValue={search.q}
                        placeholder={t("searchPlaceholder")}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-800 focus:border-transparent"
                      />
                      {search.category && (
                        <input
                          type="hidden"
                          name="category"
                          value={search.category}
                        />
                      )}
                      {search.sort && (
                        <input type="hidden" name="sort" value={search.sort} />
                      )}
                    </div>
                  </form>

                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-gray-500" />
                    <SortSelect
                      currentSort={sort}
                      sortOptions={sortOptions.map((opt) => ({
                        value: opt.value,
                        label: t(opt.labelKey),
                      }))}
                      baseUrl={`/${locale}/news`}
                      preserveParams={{
                        category: search.category,
                        q: search.q,
                        date_from: search.date_from,
                        date_to: search.date_to,
                        featured: search.featured,
                      }}
                    />
                  </div>

                  {/* Featured Toggle */}
                  <Link
                    href={buildUrl({
                      featured: search.featured === "true" ? undefined : "true",
                      page: "1",
                    })}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-colors ${
                      search.featured === "true"
                        ? "bg-primary-800 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <Filter className="w-5 h-5" />
                    {t("featuredOnly")}
                  </Link>
                </div>
              </div>

              {/* Results Info */}
              {meta && (
                <div className="flex items-center justify-between mb-6">
                  <p className="text-gray-600">
                    {t("showingResults", {
                      from: meta.from || 0,
                      to: meta.to || 0,
                      total: meta.total || 0,
                    })}
                  </p>
                </div>
              )}

              {/* News Grid */}
              {news.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {news.map((item) => (
                    <Link
                      key={item.id}
                      href={`/${locale}/news/${item.slug}`}
                      className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                      {/* Image */}
                      <div className="relative h-56 overflow-hidden">
                        <NewsImage
                          src={item.cover_url}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {item.is_featured && (
                          <div className="absolute top-4 left-4 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
                            {t("featured")}
                          </div>
                        )}
                        {item.category && (
                          <div className="absolute bottom-4 left-4 px-3 py-1 bg-primary-800 text-white text-xs font-semibold rounded-full">
                            <Tag className="w-3 h-3 inline-block mr-1" />
                            {item.category.name}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-700 transition-colors">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {item.description}
                          </p>
                        )}

                        {/* Meta */}
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatDate(item.published_at)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{formatViews(item.views_count)}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">📰</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {t("noNewsFound")}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {t("tryDifferentFilters")}
                  </p>
                  <Link
                    href={`/${locale}/news`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-800 text-white rounded-xl hover:bg-emerald-700 transition-colors"
                  >
                    {t("clearFilters")}
                  </Link>
                </div>
              )}

              {/* Pagination */}
              {meta && meta.last_page > 1 && (
                <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-2">
                  {/* Previous Button */}
                  {page > 1 ? (
                    <Link
                      href={buildUrl({ page: (page - 1).toString() })}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                    >
                      {isArabic ? (
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                      {t("previous")}
                    </Link>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed text-sm sm:text-base">
                      {isArabic ? (
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                      {t("previous")}
                    </div>
                  )}

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from(
                      { length: Math.min(5, meta.last_page) },
                      (_, i) => {
                        let pageNum: number;
                        if (meta.last_page <= 5) {
                          pageNum = i + 1;
                        } else if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page >= meta.last_page - 2) {
                          pageNum = meta.last_page - 4 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }

                        return (
                          <Link
                            key={pageNum}
                            href={buildUrl({ page: pageNum.toString() })}
                            className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg transition-colors text-sm sm:text-base ${
                              pageNum === page
                                ? "bg-primary-800 text-white"
                                : "bg-white border border-gray-200 hover:bg-gray-50"
                            }`}
                          >
                            {pageNum}
                          </Link>
                        );
                      }
                    )}
                  </div>

                  {/* Next Button */}
                  {page < meta.last_page ? (
                    <Link
                      href={buildUrl({ page: (page + 1).toString() })}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                    >
                      {t("next")}
                      {isArabic ? (
                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </Link>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed text-sm sm:text-base">
                      {t("next")}
                      {isArabic ? (
                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
