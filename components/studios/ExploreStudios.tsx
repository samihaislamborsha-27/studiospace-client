"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownUp,
  ArrowRight,
  MapPin,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import StudioCard from "@/components/studios/StudioCard";
import { studios, studioCategories } from "@/lib/studios";

export default function ExploreStudios() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("All categories");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sortBy, setSortBy] = useState("recommended");
  const [filtersOpen, setFiltersOpen] = useState(false);

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
          amenity.toLowerCase().includes(normalizedSearch),
        );

      const matchesLocation =
        !normalizedLocation ||
        studio.location.toLowerCase().includes(normalizedLocation);

      const matchesCategory =
        category === "All categories" || studio.category === category;

      const matchesPrice = studio.hourlyRate <= maxPrice;

      return (
        matchesSearch && matchesLocation && matchesCategory && matchesPrice
      );
    });

    if (sortBy === "price-low") {
      result.sort((a, b) => a.hourlyRate - b.hourlyRate);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.hourlyRate - a.hourlyRate);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      result.sort(
        (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)),
      );
    }

    return result;
  }, [search, location, category, maxPrice, sortBy]);

  const hasActiveFilters =
    search !== "" ||
    location !== "" ||
    category !== "All categories" ||
    maxPrice !== 5000;

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setCategory("All categories");
    setMaxPrice(5000);
    setSortBy("recommended");
  };

  return (
    <div className="min-h-screen bg-[#f5f1ea] text-[#282725] dark:bg-[#171a18] dark:text-[#f3f0e9]">
      <section className="relative overflow-hidden bg-[#233b35]">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=2000&q=85')",
            }}
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-r from-[#172b25]/95 via-[#233b35]/85 to-[#233b35]/45" />

        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-16 sm:px-8 sm:pb-20 sm:pt-20 lg:px-12 lg:pb-24 lg:pt-24">
          <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#d5a68b]">
            Find a space for your next idea
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-[1.12] tracking-tight text-[#f5f1ea] sm:text-5xl lg:text-6xl">
            The right space
            <span className="block font-normal italic text-[#d5a68b]">
              makes all the difference.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-7 text-white/70 sm:text-base sm:leading-8">
            Discover inspiring spaces made for photography, filmmaking,
            podcasting, music and everything in between.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium text-white/75">
            <span>Discover unique spaces</span>
            <span className="h-1 w-1 rounded-full bg-[#d5a68b]" />
            <span>Find the right atmosphere</span>
            <span className="h-1 w-1 rounded-full bg-[#d5a68b]" />
            <span>Book by the hour</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 pt-12 sm:px-8 sm:pb-24 sm:pt-16 lg:px-12">
        <div className="mb-9 flex flex-col gap-5 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a45d42]">
              Explore the collection
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Find your creative space
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-[#77736d] dark:text-[#aaa99f]">
              From intimate recording rooms to spacious production studios,
              find an environment that fits your vision.
            </p>
          </div>
          <p className="text-sm text-[#77736d] dark:text-[#aaa99f]">
            <span className="font-semibold text-[#282725] dark:text-[#f3f0e9]">
              {filteredStudios.length}
            </span>{" "}
            spaces to explore
          </p>
        </div>

        <div className="mb-8 border-y border-[#ded7cc] py-5 dark:border-[#39413b]">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_auto]">
            <label className="flex min-w-0 items-center gap-3 border border-[#ded7cc] bg-white px-4 py-3.5 dark:border-[#39413b] dark:bg-[#222724]">
              <Search size={18} className="shrink-0 text-[#a45d42]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search studios, categories, amenities..."
                className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-[#99938a] dark:placeholder:text-[#8f968f]"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="text-[#77736d] hover:text-[#a45d42]"
                >
                  <X size={16} />
                </button>
              )}
            </label>

            <label className="flex min-w-0 items-center gap-3 border border-[#ded7cc] bg-white px-4 py-3.5 dark:border-[#39413b] dark:bg-[#222724]">
              <MapPin size={17} className="shrink-0 text-[#a45d42]" />
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Location"
                className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-[#99938a] dark:placeholder:text-[#8f968f]"
              />
            </label>

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              aria-label="Filter by category"
              className="min-w-0 border border-[#ded7cc] bg-white px-4 py-3.5 text-sm outline-none dark:border-[#39413b] dark:bg-[#222724]"
            >
              <option>All categories</option>
              {studioCategories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`inline-flex items-center justify-center gap-2 border px-5 py-3.5 text-sm font-semibold transition-colors ${
                filtersOpen
                  ? "border-[#233b35] bg-[#233b35] text-white dark:border-[#a9c2b3] dark:bg-[#a9c2b3] dark:text-[#171a18]"
                  : "border-[#233b35] text-[#233b35] hover:bg-[#233b35] hover:text-white dark:border-[#a9c2b3] dark:text-[#c0d4c8] dark:hover:bg-[#a9c2b3] dark:hover:text-[#171a18]"
              }`}
            >
              <SlidersHorizontal size={16} />
              Price filter
            </button>
          </div>

          {filtersOpen && (
            <div className="mt-5 flex flex-col gap-4 border border-[#ded7cc] bg-white p-5 dark:border-[#39413b] dark:bg-[#222724] sm:flex-row sm:items-center sm:justify-between">
              <div className="w-full max-w-md">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <label
                    htmlFor="max-price"
                    className="text-sm font-semibold"
                  >
                    Maximum hourly price
                  </label>
                  <span className="text-sm font-semibold text-[#a45d42]">
                    ৳{maxPrice.toLocaleString("en-BD")}
                  </span>
                </div>
                <input
                  id="max-price"
                  type="range"
                  min="500"
                  max="5000"
                  step="100"
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(Number(event.target.value))}
                  className="w-full accent-[#233b35]"
                />
                <div className="mt-1 flex justify-between text-xs text-[#77736d] dark:text-[#aaa99f]">
                  <span>৳500</span>
                  <span>৳5,000+</span>
                </div>
              </div>

              <button
                type="button"
                onClick={clearFilters}
                className="self-start text-sm font-semibold text-[#a45d42] hover:underline sm:self-center"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.13em] text-[#77736d] dark:text-[#aaa99f]">
              Browse by
            </span>
            {["All categories", ...studioCategories].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`px-3 py-2 text-xs font-medium transition-colors ${
                  category === item
                    ? "bg-[#233b35] text-white dark:bg-[#a9c2b3] dark:text-[#171a18]"
                    : "bg-[#eee9e0] text-[#625f58] hover:bg-[#e2d9cc] dark:bg-[#2b312d] dark:text-[#d0d2cb] dark:hover:bg-[#39413b]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-sm text-[#77736d] dark:text-[#aaa99f]">
            <ArrowDownUp size={15} />
            <span className="whitespace-nowrap">Sort by</span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="max-w-47.5 bg-transparent py-2 text-sm font-semibold text-[#282725] outline-none dark:text-[#f3f0e9]"
            >
              <option value="recommended">Recommended</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="rating">Highest rated</option>
            </select>
          </label>
        </div>

        {hasActiveFilters && (
          <div className="mb-6 flex flex-wrap items-center gap-3 text-xs text-[#77736d] dark:text-[#aaa99f]">
            <span>Filters applied</span>
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1 font-semibold text-[#a45d42] hover:underline"
            >
              <X size={13} />
              Reset filters
            </button>
          </div>
        )}

        {filteredStudios.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-7 gap-y-11 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-14">
            {filteredStudios.map((studio) => (
              <StudioCard key={studio.id} studio={studio} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-82.5 flex-col items-center justify-center border border-dashed border-[#d5cbbd] px-5 text-center dark:border-[#39413b]">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#eee9e0] text-[#a45d42] dark:bg-[#2b312d]">
              <Search size={22} />
            </div>
            <h3 className="text-xl font-semibold">No spaces found</h3>
            <p className="mt-2 max-w-sm text-sm leading-7 text-[#77736d] dark:text-[#aaa99f]">
              Try another search or adjust your filters to discover more
              creative spaces.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 inline-flex items-center gap-2 bg-[#233b35] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#304d43] dark:bg-[#a9c2b3] dark:text-[#171a18]"
            >
              Clear filters
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
