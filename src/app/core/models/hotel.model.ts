export interface Hotel {
  uniqId: string;
  crawlTimestamp?: string;
  pageUrl?: string;
  name: string;
  hotelId?: string;
  area?: string;
  city: string;
  address?: string;
  lat?: string;
  long?: string;
  amenities?: string;
  hotelStarRating?: string;
  hotelType?: string;
  averageRating?: number;
  reviewCount?: number;
  photoCount?: number;
  cleanliness?: number;
  facilities?: number;
  location?: number;
  staff?: number;
  wifi?: number;
  comfort?: number;
  valueForMoney?: number;
}

export interface CreateHotelInput {
  name: string;
  city: string;
  address?: string;
  hotelStarRating?: string;
  averageRating?: number;
  photoCount?: number;
  amenities?: string;
}

export interface PagedHotelsResponse {
  items: Hotel[];
  totalCount: number;
}
