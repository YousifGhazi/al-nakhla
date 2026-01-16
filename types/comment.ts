export interface Comment {
  id: number;
  reel_id: number;
  username: string;
  comment: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  time_ago: string;
}
export interface CommentRequest {
  username: string;
  comment: string;
  id: number;
}
export interface CommentsByReelParams {
  id: number;
  page?: number;
  per_page?: number;
}
export interface CommentsByReelResponse {
  success: boolean;
  data: Comment[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    comments_count: number;
  };
}
export interface LikeRequest {
  id: number;
  username: string;
}
export interface UnlikeRequest {
  id: number;
}
