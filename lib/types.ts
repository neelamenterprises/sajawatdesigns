export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  description: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  category_id: string;
  price: number;
  mrp: number;
  images: string[];
  tags: string[];
  amazon_url: string | null;
  flipkart_url: string | null;
  meesho_url: string | null;
  is_featured: boolean;
  is_trending: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductWithCategory extends Product {
  category: Category;
}

export type SortOption = "newest" | "price-low-high" | "price-high-low" | "popularity";

export interface ProductFilters {
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  platforms?: ("amazon" | "flipkart" | "meesho")[];
  tags?: string[];
  search?: string;
  sort?: SortOption;
  page?: number;
  limit?: number;
}
