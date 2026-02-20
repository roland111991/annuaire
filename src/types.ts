export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'pro' | 'admin';
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  description?: string;
}

export interface Region {
  id: number;
  name: string;
}

export interface City {
  id: number;
  name: string;
  region_id: number;
  region_name?: string;
}

export interface Listing {
  id: number;
  user_id: number;
  category_id: number;
  city_id: number;
  title: string;
  slug: string;
  description: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  logo: string;
  images: string; // JSON string
  hours: string; // JSON string
  is_featured: number;
  is_verified: number;
  status: 'pending' | 'published' | 'rejected';
  views: number;
  created_at: string;
  category_name?: string;
  city_name?: string;
  owner_name?: string;
}

export interface Review {
  id: number;
  listing_id: number;
  user_id: number;
  rating: number;
  comment: string;
  created_at: string;
  user_name: string;
}
