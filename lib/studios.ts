export type Studio = {
  id: string;
  title: string;
  category: string;
  location: string;
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  capacity: number;
  image: string;
  amenities: string[];
  featured?: boolean;
};

// Temporary development data.
// This will be replaced with real API data from the Express backend.
export const studios: Studio[] = [
  {
    id: "1",
    title: "The Daylight Studio",
    category: "Photography",
    location: "Dhanmondi, Dhaka",
    hourlyRate: 1800,
    rating: 4.9,
    reviewCount: 28,
    capacity: 8,
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85",
    amenities: ["Natural light", "Changing room", "Lighting"],
    featured: true,
  },
  {
    id: "2",
    title: "Frame House Studio",
    category: "Film & Video",
    location: "Gulshan, Dhaka",
    hourlyRate: 2500,
    rating: 4.8,
    reviewCount: 19,
    capacity: 12,
    image:
      "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=1200&q=85",
    amenities: ["Video equipment", "Soundproof", "Green screen"],
    featured: true,
  },
  {
    id: "3",
    title: "The Sound Room",
    category: "Podcast",
    location: "Banani, Dhaka",
    hourlyRate: 1500,
    rating: 4.9,
    reviewCount: 34,
    capacity: 5,
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=85",
    amenities: ["Microphones", "Soundproof", "Audio mixer"],
  },
  {
    id: "4",
    title: "Analog Creative Space",
    category: "Art & Creative",
    location: "Uttara, Dhaka",
    hourlyRate: 1200,
    rating: 4.7,
    reviewCount: 16,
    capacity: 10,
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=85",
    amenities: ["Art supplies", "Natural light", "Open space"],
  },
  {
    id: "5",
    title: "Echo Music Studio",
    category: "Music",
    location: "Mohammadpur, Dhaka",
    hourlyRate: 2000,
    rating: 4.8,
    reviewCount: 22,
    capacity: 6,
    image:
      "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1200&q=85",
    amenities: ["Instruments", "Audio mixer", "Soundproof"],
  },
  {
    id: "6",
    title: "The Portrait Atelier",
    category: "Photography",
    location: "Dhanmondi, Dhaka",
    hourlyRate: 1600,
    rating: 4.6,
    reviewCount: 13,
    capacity: 6,
    image:
      "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1200&q=85",
    amenities: ["Portrait lighting", "Backdrop", "Changing room"],
  },
];

export const studioCategories = [
  "Photography",
  "Film & Video",
  "Podcast",
  "Music",
  "Art & Creative",
];
