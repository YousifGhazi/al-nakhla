import Header from "@/components/header";
import HeroCarousel from "@/components/hero-carousel";
import BreakingNews from "@/components/breaking-news";
import NewsCategoriesDynamic from "@/components/news-categories-dynamic";
import FeaturedShows from "@/components/featured-shows";
import Footer from "@/components/footer";
import { News } from "@/types/news";
import { Show, ShowListResponse } from "@/types/shows";

const API_BASE_URL = "http://168.231.101.52:8080/api";

export interface HomeCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  news: News[];
}

interface HomeDataResponse {
  success: boolean;
  data: {
    top_news: News[];
    breaking_news: News[];
    categories: HomeCategory[];
  };
}

async function getHomeData(): Promise<{
  topNews: News[];
  breakingNews: News[];
  categories: HomeCategory[];
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/home`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch home data");
    }

    const data: HomeDataResponse = await response.json();
    return {
      topNews: data.data.top_news || [],
      breakingNews: data.data.breaking_news || [],
      categories: data.data.categories || [],
    };
  } catch (error) {
    console.error("Error fetching home data:", error);
    return { topNews: [], breakingNews: [], categories: [] };
  }
}

async function getFeaturedShows(limit: number = 4): Promise<Show[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/shows?page=1&per_page=${limit}&featured=true`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch featured shows");
    }

    const data: ShowListResponse = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching featured shows:", error);
    return [];
  }
}

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const [homeData, featuredShows] = await Promise.all([
    getHomeData(),
    getFeaturedShows(4),
  ]);

  const { topNews, breakingNews, categories } = homeData;

  return (
    <>
      <Header />
      <main>
        <HeroCarousel news={topNews} />
        <BreakingNews news={breakingNews} />
        <FeaturedShows shows={featuredShows} />
        <NewsCategoriesDynamic locale={locale} categories={categories} />
      </main>
      <Footer />
    </>
  );
}
