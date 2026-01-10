import { Category } from "./categories";
import {
  Author,
  PaginationLinks,
  PaginationMeta,
  PaginationMetaRaw,
  normalizeMeta,
} from "./reels";

export type News = {
  id: number;
  title: string;
  slug: string;
  description?: string;
  cover_url?: string;
  is_featured: boolean;
  is_published: boolean;
  views_count: number;
  published_at: string;
  category: Category;
  author: Author;
  created_at: string;
  updated_at: string;
};

export type NewsListResponseRaw = {
  data: News[];
  meta: PaginationMetaRaw;
  links: PaginationLinks;
};

export type NewsListResponse = {
  data: News[];
  meta: PaginationMeta;
  links: PaginationLinks;
};

// Re-export normalizeMeta for convenience
export { normalizeMeta };

export type NewsListParams = {
  page?: number;
  per_page?: number;
  category: number | string;
  date_from?: string;
  date_to?: string;
  featured?: boolean;
  q?: string;
  sort:
    | "published_at"
    | "-published_at"
    | "views_count"
    | "-views_count"
    | "title"
    | "-title";
};

export type TodayNewsResponse = {
  success: boolean;
  data: News[];
};
export type TodayNewsParams = {
  limit?: number;
};
