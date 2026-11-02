export type Studio = {
  id: string;
  title: string;
  category: string;
  location: string;
  hourlyRate: number;
  securityDeposit: number;
  rating: number;
  reviewCount: number;
  capacity: number;
  image: string;
  amenities: string[];
  overview: string;
  featured?: boolean;
  ownerName?: string;
  ownerEmail?: string;
  ownerPhotoURL?: string;
  status?: string;
};

export const studioCategories = [
  "Photography",
  "Film & Video",
  "Podcast",
  "Music",
  "Art & Creative",
  "Workshop",
  "Other",
];