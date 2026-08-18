export interface Author {
  name: string;
  avatar: string;
  isPro?: boolean;
}

export interface Post {
  id: string;
  category: string;
  categoryColor: string;
  title: string;
  summary: string;
  thumbnailUrl?: string;
  author: Author;
  timeAgo: string;
  views: number;
  comments: number;
  likes: number;
  isPinned?: boolean;
}

export interface BestPost {
  id: string;
  rank: number;
  title: string;
  author: string;
  likes: number;
}
