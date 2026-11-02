"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X, RotateCcw } from "lucide-react";
import StudioCard from "@/components/studios/StudioCard";
import { studioCategories, type Studio } from "@/lib/studios";
import { getStudios } from "@/services/studioService";

type SortOption = "recommended" | "price-low" | "price-high" | "rating";

export default function ExploreStudios() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("All categories");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadStudios() {
      try {
        setLoading(true);
        setError("");

        const data = await getStudios({ limit: 100 });

        if (!controller.signal.aborted) {
          setStudios(data);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong while loading studios."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadStudios();

    return () => controller.abort();
  }, []);

  const filteredStudios = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const normalizedLocation = location.trim().toLowerCase();

    const result = studios.filter((studio) => {
      const matchesSearch =
        !normalizedSearch ||
        studio.title.toLowerCase().includes(normalizedSearch) ||
        studio.category.toLowerCase().includes(normalizedSearch) ||
        studio.location.toLowerCase().includes(normalizedSearch) ||
        studio.amenities.some((amenity) =>
          amenity.toLowerCase().includes(normalizedSearch)
        );

      const matchesLocation =
        !normalizedLocation ||
        studio.location.toLowerCase().includes(normalizedLocation);

      const matchesCategory =
        category === "All categories" || studio.category === category;

      const matchesPrice = studio.hourlyRate <= maxPrice;

      return (
        matchesSearch &&
        matchesLocation &&
        matchesCategory &&
        matchesPrice
      );
    });

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.hourlyRate - b.hourlyRate);
        break;
      case "price-high":
        result.sort((a, b) => b.hourlyRate - a.hourlyRate);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        result.sort(
          (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured))
        );
    }

    return result;
  }, [studios, search, location, category, maxPrice, sortBy]);

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setCategory("All categories");
    setMaxPrice(5000);
    setSortBy("recommended");
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    location.trim() !== "" ||
    category !== "All categories" ||
    maxPrice !== 5000;

  return (
    <main className="min-h-screen bg-[#f5f1ea] text-[#233b35] dark:bg-[#171a18] dark:text-[#f5f1ea]">
      <section className="border-b border-[#233b35]/10 px-5 py-14 dark:border-white/10 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#a45d42]">
            Find your creative space
          </p>

          <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <h1 className="font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
                Spaces that bring
                <br className="hidden sm:block" /> your ideas to life.
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-7 text-[#66736d] dark:text-[#b3beb8] sm:text-base">
                Discover and book inspiring creative studios for photography,
                filmmaking, music, podcasting, and everything in between.
              </p>
            </div>

            <p className="text-sm text-[#66736d] dark:text-[#b3beb8]">
              {loading ? "Loading spaces..." : `${filteredStudios.length} spaces found`}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12">
        <div className="mb-8 grid gap-3 rounded-xl border border-[#233b35]/10 bg-white/70 p-4 dark:border-white/10 dark:bg-white/3 md:grid-cols-[1.5fr_1fr_1fr_auto] md:p-5">
          <label className="flex items-center gap-3 border-b border-[#233b35]/10 pb-3 md:border-b-0 md:border-r md:pb-0 md:pr-4 dark:border-white/10">
            <Search className="h-4 w-4 shrink-0 text-[#a45d42]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search studios or amenities"
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#89938d] focus:ring-0"
            />
          </label>

          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Location"
            aria-label="Filter by location"
            className="w-full border-b border-[#233b35]/10 bg-transparent px-1 py-3 text-sm outline-none focus:ring-0 md:border-b-0 md:border-r md:px-4 md:py-0 dark:border-white/10"
          />

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label="Filter by category"
            className="w-full border-b border-[#233b35]/10 bg-transparent px-1 py-3 text-sm outline-none focus:ring-0 md:border-b-0 md:border-r md:px-4 md:py-0 dark:border-white/10 dark:bg-[#171a18]"
          >
            <option>All categories</option>
            {studioCategories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setFiltersOpen((current) => !current)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#233b35] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#314d45] dark:bg-[#a45d42] dark:hover:bg-[#b96b4e]"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Price filter
          </button>
        </div>

        {filtersOpen && (
          <div className="mb-8 flex flex-col gap-4 rounded-xl border border-[#233b35]/10 bg-white/70 p-5 dark:border-white/10 dark:bg-white/3 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full max-w-md">
              <div className="mb-3 flex items-center justify-between text-sm">
                <label htmlFor="max-price" className="font-medium">
                  Maximum hourly rate
                </label>
                <span className="font-semibold">
                  ৳{maxPrice.toLocaleString("en-BD")}
                </span>
              </div>
              <input
                id="max-price"
                type="range"
                min={500}
                max={5000}
                step={100}
                value={maxPrice}
                onChange={(event) => setMaxPrice(Number(event.target.value))}
                className="w-full accent-[#a45d42]"
              />
            </div>

            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-2 text-sm text-[#a45d42] hover:underline"
            >
              <RotateCcw className="h-4 w-4" />
              Clear filters
            </button>
          </div>
        )}

        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl">
              Explore creative spaces
            </h2>
            <p className="mt-1 text-sm text-[#66736d] dark:text-[#b3beb8]">
              Find a space that fits your next project.
            </p>
          </div>

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortOption)}
            aria-label="Sort studios"
            className="w-full rounded-lg border border-[#233b35]/15 bg-transparent px-4 py-3 text-sm outline-none focus:ring-0 sm:w-auto dark:border-white/15 dark:bg-[#171a18]"
          >
            <option value="recommended">Recommended</option>
            <option value="price-low">Price: Low to high</option>
            <option value="price-high">Price: High to low</option>
            <option value="rating">Top rated</option>
          </select>
        </div>

        {hasActiveFilters && (
          <div className="mb-5 flex items-center justify-between">
            <p className="text-xs text-[#66736d] dark:text-[#b3beb8]">
              Showing filtered results
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-xs text-[#a45d42] hover:underline"
            >
              <X className="h-3 w-3" />
              Reset
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-[#233b35]/10 dark:border-white/10"
              >
                <div className="aspect-4/3 animate-pulse bg-[#233b35]/10 dark:bg-white/10" />
                <div className="space-y-3 p-5">
                  <div className="h-3 w-1/3 animate-pulse rounded bg-[#233b35]/10 dark:bg-white/10" />
                  <div className="h-5 w-3/4 animate-pulse rounded bg-[#233b35]/10 dark:bg-white/10" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-[#233b35]/10 dark:bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="border-y border-[#233b35]/10 py-16 text-center dark:border-white/10">
            <h3 className="font-serif text-2xl">We couldn’t load the studios</h3>
            <p className="mx-auto mt-3 max-w-md text-sm text-[#66736d] dark:text-[#b3beb8]">
              {error}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-lg bg-[#233b35] px-5 py-3 text-sm text-white hover:bg-[#314d45] dark:bg-[#a45d42]"
            >
              Try again
            </button>
          </div>
        ) : filteredStudios.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredStudios.map((studio) => (
              <StudioCard key={studio.id} studio={studio} />
            ))}
          </div>
        ) : (
          <div className="border-y border-[#233b35]/10 py-20 text-center dark:border-white/10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#a45d42]">
              No matching spaces
            </p>
            <h3 className="font-serif text-2xl sm:text-3xl">
              Try a different search.
            </h3>
            <p className="mt-3 text-sm text-[#66736d] dark:text-[#b3beb8]">
              Adjust your filters to discover more creative spaces.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 text-sm font-semibold text-[#a45d42] hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
}