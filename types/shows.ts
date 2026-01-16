import { Author, PaginationLinks, PaginationMeta } from "./reels";

export type Show = {
  id: number;
  title: string;
  slug: string;
  about: string;
  schedule: {
    steam_time: string;
    days_of_week:
      | "monday"
      | "tuesday"
      | "wednesday"
      | "thursday"
      | "friday"
      | "saturday"
      | "sunday"[];
    human_readable: string;
  }[];
  stream_url: string;
  files_url: string;
  cover_url: string;
  contacts: {
    phone?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    whatsapp?: string;
    telegram?: string;
    viber?: string;
    email?: string;
    website?: string;
    other: string[];
  };
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  author: Author;
  created_at: string;
  updated_at: string;
};

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type ShowListParams = {
  page?: number;
  per_page?: number;
  day?: DayOfWeek;
  featured?: boolean;
};

export type ShowListResponse = {
  data: Show[];
  meta: PaginationMeta;
  links: PaginationLinks;
};

export type ShowTodayResponse = {
  data: Show[];
  meta: {
    day: DayOfWeek;
    date: string;
  };
};

export type ShowScheduleResponse = {
  data: {
    monday: Show[];
    tuesday: Show[];
    wednesday: Show[];
    thursday: Show[];
    friday: Show[];
    saturday: Show[];
    sunday: Show[];
  };
};

export type ShowlugParam = {
  slug: string;
};

export type ShowlugResponse = {
  success: boolean;
  data: Show;
};

export interface ShowEpisode {
  id: number;
  show_id: number;
  name: string;
  description: string;
  image_url: string;
  youtube_url: string;
  episode_number: number;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ShowEpisodesList {
  success: boolean;
  data: ShowEpisode[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface ShowEpisodesParam {
  show_slug: string;
  page?: number;
  per_page?: number;
}
