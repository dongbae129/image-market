import { z } from 'zod';

export const getPostsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(7) // Limit 상한선 설정
});

export type GetPostsQuery = z.infer<typeof getPostsQuerySchema>;

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PostListItem {
  id: number;
  title: string;
  viewCount: number;
  createdAt: string;
}

export interface PaginatedPostsResponse {
  data: PostListItem[];
  meta: PaginationMeta;
}
