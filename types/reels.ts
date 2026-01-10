export type Author = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "editor";
  is_active: boolean;
  avatar_url: string | null;
  email_verified_at: string; // ISO date
  created_at: string;
  updated_at: string;
};

export type Reel = {
  id: number;
  title: string;
  description: string | null;
  stream_url: string;
  thumbnail_url: string | null;
  duration: number;
  duration_formatted: string;
  file_size: number;
  file_size_formatted: string;
  mime_type: string;
  is_published: boolean;
  views_count: number;
  likes_count: number;
  author: Author;
  created_at: string;
  updated_at: string;
};

export type PaginationLinks = {
  first: string | string[];
  last: string | string[];
  prev: string | string[] | null;
  next: string | string[] | null;
};

export type MetaLink = {
  url: string | null;
  label: string;
  active: boolean;
};

// API returns arrays for these values, we'll normalize them
export type PaginationMetaRaw = {
  current_page: number | number[];
  from: number | number[];
  last_page: number | number[];
  per_page: number | number[];
  to: number | number[];
  total: number | number[];
  path: string;
  links: MetaLink[];
};

// Normalized meta type for easier use
export type PaginationMeta = {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
  path: string;
  links: MetaLink[];
};

export type ReelsResponseRaw = {
  data: Reel[];
  links: PaginationLinks;
  meta: PaginationMetaRaw;
};

export type ReelsResponse = {
  data: Reel[];
  links: PaginationLinks;
  meta: PaginationMeta;
};

// Helper to normalize meta values (extract first element if array)
export function normalizeMeta(meta: PaginationMetaRaw): PaginationMeta {
  const getValue = <T>(val: T | T[]): T => (Array.isArray(val) ? val[0] : val);
  return {
    current_page: getValue(meta.current_page),
    from: getValue(meta.from),
    last_page: getValue(meta.last_page),
    per_page: getValue(meta.per_page),
    to: getValue(meta.to),
    total: getValue(meta.total),
    path: meta.path,
    links: meta.links,
  };
}

export interface ReelRequestParams {
  page?: number;
  per_page?: number;
  q?: string;
  sort?:
    | "-created_at"
    | "created_at"
    | "-views_count"
    | "views_count"
    | "-likes_count"
    | "likes_count";
}
