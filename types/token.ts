export interface GenerateTokenRequest {
  name: string;
  device_id: string;
}

interface BookMarkedCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  sort_order: number;
  news_count: number;
}
export interface GenerateTokenResponse {
  success: boolean;
  data: {
    token: string;
    name: string;
    bookmarked_categories: BookMarkedCategory[];
  };
  message: string;
}
export interface TokenProfile {
  success: boolean;
  data: {
    name: string;
    bookmarked_categories: BookMarkedCategory[];
    created_at: string;
  };
}

export interface BookmarkedCategoriesResponse {
  success: boolean;
  data: BookMarkedCategory[];
}
