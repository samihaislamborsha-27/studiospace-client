"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ImagePlus,
  LoaderCircle,
  MapPin,
  Plus,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthProvider";
import { uploadProfileImage } from "@/services/auth";
import {
  getStudioById,
  updateStudio,
} from "@/services/studioService";
import { studioCategories } from "@/lib/studios";

const AMENITY_OPTIONS = [
  "Natural light",
  "Lighting equipment",
  "Soundproof",
  "Changing room",
  "Air conditioning",
  "Wi-Fi",
  "Parking",
  "Green screen",
  "Backdrop",
  "Audio mixer",
  "Microphones",
  "Instruments",
  "Art supplies",
  "Furniture",
  "Restroom",
];

type FormValues = {
  title: string;
  category: string;
  location: string;
  hourlyRate: string;
  securityDeposit: string;
  capacity: string;
  overview: string;
};

type FieldErrors = Partial<
  Record<keyof FormValues | "image", string>
>;

const INITIAL_VALUES: FormValues = {
  title: "",
  category: "",
  location: "",
  hourlyRate: "",
  securityDeposit: "0",
  capacity: "1",
  overview: "",
};

const inputClass =
  "w-full rounded-lg border border-[#233b35]/15 bg-white px-4 py-3 text-sm text-[#233b35] outline-none transition placeholder:text-[#9ba49e] focus:border-[#a45d42] focus:ring-0 dark:border-white/15 dark:bg-[#202622] dark:text-[#f5f1ea]";

const labelClass =
  "mb-2 block text-sm font-medium text-[#233b35] dark:text-[#e8eee9]";

const errorClass =
  "mt-2 text-xs font-medium text-red-600 dark:text-red-400";

function EditStudioContent() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const studioId = params.id;

  const { user, loading: authLoading } = useAuth();

  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [amenities, setAmenities] = useState<string[]>([]);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [existingImage, setExistingImage] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);

  const [customAmenity, setCustomAmenity] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace(
        `/login?next=${encodeURIComponent(`/studios/edit/${studioId}`)}`
      );
    }
  }, [authLoading, user, router, studioId]);

  useEffect(() => {
    if (authLoading || !user || !studioId) return;

    let cancelled = false;

    const loadStudio = async () => {
      setLoading(true);
      setLoadError("");

      try {
        const studio = await getStudioById(studioId);

        if (cancelled) return;

        if (!studio) {
          setLoadError(
            "This studio could not be found. It may have been removed."
          );
          return;
        }

        setValues({
          title: studio.title ?? "",
          category: studio.category ?? "",
          location: studio.location ?? "",
          hourlyRate: String(studio.hourlyRate ?? ""),
          securityDeposit: String(studio.securityDeposit ?? 0),
          capacity: String(studio.capacity ?? 1),
          overview: studio.overview ?? "",
        });

        setAmenities(studio.amenities ?? []);
        setExistingImage(studio.image ?? "");
      } catch (error) {
        console.error("Unable to load studio for editing:", error);

        if (!cancelled) {
          setLoadError("Unable to load this studio. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadStudio();

    return () => {
      cancelled = true;
    };
  }, [authLoading, user, studioId]);

  const updateValue = (field: keyof FormValues, value: string) => {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => {
      if (!current[field]) return current;

      const updated = { ...current };
      delete updated[field];

      return updated;
    });
  };

  const toggleAmenity = (amenity: string) => {
    setAmenities((current) =>
      current.includes(amenity)
        ? current.filter((item) => item !== amenity)
        : [...current, amenity]
    );
  };

  const addCustomAmenity = () => {
    const value = customAmenity.trim();

    if (!value) return;

    if (
      amenities.some(
        (item) => item.toLowerCase() === value.toLowerCase()
      )
    ) {
      toast.error("This amenity has already been added.");
      return;
    }

    setAmenities((current) => [...current, value]);
    setCustomAmenity("");
  };

  const selectImage = (file?: File) => {
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Choose a JPG, PNG, or WebP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be 5 MB or less.");
      return;
    }

    setImageFile(file);

    setErrors((current) => {
      const updated = { ...current };
      delete updated.image;
      return updated;
    });

    const reader = new FileReader();

    reader.onload = () => {
      setImagePreview(String(reader.result ?? ""));
    };

    reader.onerror = () => {
      toast.error("Unable to preview this image. Please choose another one.");
    };

    reader.readAsDataURL(file);
  };

  const removeNewImage = () => {
    setImageFile(null);
    setImagePreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeExistingImage = () => {
    setExistingImage("");
    setImagePreview("");
    setImageFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = (): boolean => {
    const nextErrors: FieldErrors = {};

    if (values.title.trim().length < 3) {
      nextErrors.title =
        "Studio name must contain at least 3 characters.";
    }

    if (!values.category) {
      nextErrors.category = "Please select a studio category.";
    }

    if (values.location.trim().length < 3) {
      nextErrors.location = "Please enter a valid studio location.";
    }

    const hourlyRate = Number(values.hourlyRate);

    if (
      !values.hourlyRate.trim() ||
      !Number.isFinite(hourlyRate) ||
      hourlyRate <= 0
    ) {
      nextErrors.hourlyRate =
        "Enter a valid hourly rate greater than 0.";
    }

    const securityDeposit = Number(values.securityDeposit);

    if (
      values.securityDeposit.trim() === "" ||
      !Number.isFinite(securityDeposit) ||
      securityDeposit < 0
    ) {
      nextErrors.securityDeposit =
        "Security deposit must be 0 or greater.";
    }

    const capacity = Number(values.capacity);

    if (
      !values.capacity.trim() ||
      !Number.isInteger(capacity) ||
      capacity < 1 ||
      capacity > 500
    ) {
      nextErrors.capacity =
        "Capacity must be between 1 and 500 people.";
    }

    if (values.overview.trim().length < 30) {
      nextErrors.overview =
        "Studio overview must contain at least 30 characters.";
    }

    if (!imageFile && !existingImage) {
      nextErrors.image = "Please upload a studio cover image.";
    }

    setErrors(nextErrors);

    const firstInvalidField = Object.keys(nextErrors)[0];

    if (firstInvalidField) {
      const target = formRef.current?.querySelector<HTMLElement>(
        `[data-field="${firstInvalidField}"]`
      );

      target?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      window.setTimeout(() => {
        target?.focus({ preventScroll: true });
      }, 350);

      toast.error(
        "Please review the highlighted fields before saving."
      );

      return false;
    }

    return true;
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (saving || !studioId) return;

    if (!validateForm()) return;

    setSaving(true);

    try {
      let imageURL = existingImage;

      if (imageFile) {
        const uploadedImage = await uploadProfileImage(imageFile);

        if (
          !uploadedImage ||
          typeof uploadedImage !== "string"
        ) {
          throw new Error(
            "Image upload failed. Please upload your image again."
          );
        }

        imageURL = uploadedImage;
      }

      if (!imageURL) {
        throw new Error("Please select a studio cover image.");
      }

      const updatedStudio = await updateStudio(studioId, {
        title: values.title.trim(),
        category: values.category,
        location: values.location.trim(),
        hourlyRate: Number(values.hourlyRate),
        securityDeposit: Number(values.securityDeposit),
        capacity: Number(values.capacity),
        image: imageURL,
        amenities,
        overview: values.overview.trim(),
      });

      if (!updatedStudio?.id) {
        throw new Error(
          "The studio could not be updated. Please try again."
        );
      }

      toast.success("Your studio has been updated successfully.");

      router.push(`/studios/${updatedStudio.id}`);
      router.refresh();
    } catch (error) {
      console.error("Studio update failed:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update your studio. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !user || loading) {
    return (
      <main className="min-h-screen bg-[#f5f1ea] px-5 py-16 dark:bg-[#171d19]">
        <div className="mx-auto max-w-5xl animate-pulse">
          <div className="h-4 w-28 rounded bg-[#233b35]/10 dark:bg-white/10" />
          <div className="mt-8 h-10 w-72 max-w-full rounded bg-[#233b35]/10 dark:bg-white/10" />
          <div className="mt-4 h-4 w-96 max-w-full rounded bg-[#233b35]/10 dark:bg-white/10" />

          <div className="mt-12 space-y-6">
            <div className="h-64 rounded-xl bg-white/70 dark:bg-white/5" />
            <div className="h-72 rounded-xl bg-white/70 dark:bg-white/5" />
            <div className="h-52 rounded-xl bg-white/70 dark:bg-white/5" />
          </div>
        </div>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f5f1ea] px-5 py-16 dark:bg-[#171d19]">
        <div className="w-full max-w-lg rounded-2xl border border-[#233b35]/10 bg-white p-8 text-center dark:border-white/10 dark:bg-[#202622]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a45d42]">
            Studio unavailable
          </p>

          <h1 className="mt-3 font-serif text-2xl text-[#233b35] dark:text-[#f5f1ea]">
            We couldn&apos;t open this studio
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#66736d] dark:text-[#b3beb8]">
            {loadError}
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => router.refresh()}
              className="rounded-lg bg-[#233b35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#314d45] dark:bg-[#a45d42]"
            >
              Try again
            </button>

            <Link
              href="/my-listings"
              className="rounded-lg border border-[#233b35]/15 px-5 py-3 text-sm font-semibold text-[#233b35] transition hover:border-[#a45d42] dark:border-white/15 dark:text-[#f5f1ea]"
            >
              Back to my listings
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const displayedImage = imagePreview || existingImage;

  return (
    <main className="min-h-screen bg-[#f5f1ea] px-5 py-12 text-[#233b35] dark:bg-[#171d19] dark:text-[#f5f1ea] sm:py-16">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/my-listings"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#66736d] transition hover:text-[#a45d42] dark:text-[#b3beb8]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to my listings
        </Link>

        <div className="mt-8 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a45d42]">
            Studio management / Edit listing
          </p>

          <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
            Refine your space.
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#66736d] dark:text-[#b3beb8] sm:text-base">
            Keep your studio details accurate and up to date. Changes will
            be reflected in your public listing once saved.
          </p>
        </div>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          noValidate
          className="mt-12 space-y-8"
        >
          {/* Studio identity */}
          <section className="border-b border-[#233b35]/10 pb-8 dark:border-white/10">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a45d42]">
                01 / Studio identity
              </p>

              <h2 className="mt-2 font-serif text-2xl sm:text-3xl">
                Tell us about your space
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#66736d] dark:text-[#b3beb8]">
                Update the essential details people use to discover your
                studio.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2" data-field="title">
                <label className={labelClass} htmlFor="studio-title">
                  Studio name *
                </label>

                <input
                  id="studio-title"
                  name="title"
                  className={`${inputClass} ${
                    errors.title ? "border-red-500" : ""
                  }`}
                  placeholder="e.g. The Natural Light Studio"
                  value={values.title}
                  onChange={(event) =>
                    updateValue("title", event.target.value)
                  }
                  maxLength={100}
                  aria-invalid={Boolean(errors.title)}
                />

                {errors.title && (
                  <p className={errorClass}>{errors.title}</p>
                )}
              </div>

              <div data-field="category">
                <label className={labelClass} htmlFor="studio-category">
                  Category *
                </label>

                <select
                  id="studio-category"
                  name="category"
                  className={`${inputClass} ${
                    errors.category ? "border-red-500" : ""
                  }`}
                  value={values.category}
                  onChange={(event) =>
                    updateValue("category", event.target.value)
                  }
                  aria-invalid={Boolean(errors.category)}
                >
                  <option value="">Choose a category</option>

                  {studioCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                {errors.category && (
                  <p className={errorClass}>{errors.category}</p>
                )}
              </div>

              <div data-field="location">
                <label className={labelClass} htmlFor="studio-location">
                  Location / Address *
                </label>

                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a45d42]" />

                  <input
                    id="studio-location"
                    name="location"
                    className={`${inputClass} pl-10 ${
                      errors.location ? "border-red-500" : ""
                    }`}
                    placeholder="Area, city"
                    value={values.location}
                    onChange={(event) =>
                      updateValue("location", event.target.value)
                    }
                    maxLength={180}
                    aria-invalid={Boolean(errors.location)}
                  />
                </div>

                {errors.location && (
                  <p className={errorClass}>{errors.location}</p>
                )}
              </div>
            </div>
          </section>

          {/* Space details */}
          <section className="border-b border-[#233b35]/10 pb-8 dark:border-white/10">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a45d42]">
                02 / Space details
              </p>

              <h2 className="mt-2 font-serif text-2xl sm:text-3xl">
                Help guests picture the experience
              </h2>
            </div>

            <div className="space-y-5">
              <div data-field="overview">
                <label className={labelClass} htmlFor="studio-overview">
                  Studio overview *
                </label>

                <textarea
                  id="studio-overview"
                  name="overview"
                  className={`${inputClass} min-h-36 resize-y leading-7 ${
                    errors.overview ? "border-red-500" : ""
                  }`}
                  placeholder="Describe the space, its atmosphere, equipment, ideal projects, and what makes it special..."
                  value={values.overview}
                  onChange={(event) =>
                    updateValue("overview", event.target.value)
                  }
                  maxLength={3000}
                  aria-invalid={Boolean(errors.overview)}
                />

                <div className="mt-2 flex items-center justify-between gap-3">
                  {errors.overview ? (
                    <p className={errorClass}>{errors.overview}</p>
                  ) : (
                    <p className="text-xs text-[#89938d]">
                      Minimum 30 characters
                    </p>
                  )}

                  <p className="text-right text-xs text-[#89938d]">
                    {values.overview.length}/3000
                  </p>
                </div>
              </div>

              <div>
                <label className={labelClass}>Available amenities</label>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {AMENITY_OPTIONS.map((amenity) => {
                    const selected = amenities.includes(amenity);

                    return (
                      <button
                        type="button"
                        key={amenity}
                        onClick={() => toggleAmenity(amenity)}
                        className={`flex min-h-11 items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs transition ${
                          selected
                            ? "border-[#a45d42] bg-[#a45d42]/10 text-[#a45d42]"
                            : "border-[#233b35]/10 text-[#66736d] hover:border-[#a45d42]/50 dark:border-white/10 dark:text-[#b3beb8]"
                        }`}
                      >
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                            selected
                              ? "border-[#a45d42] bg-[#a45d42] text-white"
                              : "border-current"
                          }`}
                        >
                          {selected && <Check className="h-3 w-3" />}
                        </span>

                        {amenity}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <input
                    value={customAmenity}
                    onChange={(event) =>
                      setCustomAmenity(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addCustomAmenity();
                      }
                    }}
                    placeholder="Add another amenity"
                    className={inputClass}
                  />

                  <button
                    type="button"
                    onClick={addCustomAmenity}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-[#233b35]/15 px-4 py-3 text-sm font-medium transition hover:border-[#a45d42] dark:border-white/15"
                  >
                    <Plus className="h-4 w-4" />
                    Add amenity
                  </button>
                </div>

                {amenities.filter(
                  (amenity) => !AMENITY_OPTIONS.includes(amenity)
                ).length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {amenities
                      .filter(
                        (amenity) => !AMENITY_OPTIONS.includes(amenity)
                      )
                      .map((amenity) => (
                        <span
                          key={amenity}
                          className="inline-flex items-center gap-2 rounded-full bg-[#a45d42]/10 px-3 py-1.5 text-xs text-[#a45d42]"
                        >
                          {amenity}

                          <button
                            type="button"
                            aria-label={`Remove ${amenity}`}
                            onClick={() => toggleAmenity(amenity)}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section className="border-b border-[#233b35]/10 pb-8 dark:border-white/10">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a45d42]">
                03 / Pricing and capacity
              </p>

              <h2 className="mt-2 font-serif text-2xl sm:text-3xl">
                Set your booking details
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <div data-field="hourlyRate">
                <label className={labelClass} htmlFor="hourly-rate">
                  Hourly rate (৳) *
                </label>

                <input
                  id="hourly-rate"
                  name="hourlyRate"
                  type="number"
                  min="1"
                  className={`${inputClass} ${
                    errors.hourlyRate ? "border-red-500" : ""
                  }`}
                  placeholder="1500"
                  value={values.hourlyRate}
                  onChange={(event) =>
                    updateValue("hourlyRate", event.target.value)
                  }
                  aria-invalid={Boolean(errors.hourlyRate)}
                />

                {errors.hourlyRate && (
                  <p className={errorClass}>{errors.hourlyRate}</p>
                )}
              </div>

              <div data-field="securityDeposit">
                <label className={labelClass} htmlFor="security-deposit">
                  Security deposit (৳)
                </label>

                <input
                  id="security-deposit"
                  name="securityDeposit"
                  type="number"
                  min="0"
                  className={`${inputClass} ${
                    errors.securityDeposit ? "border-red-500" : ""
                  }`}
                  placeholder="0"
                  value={values.securityDeposit}
                  onChange={(event) =>
                    updateValue("securityDeposit", event.target.value)
                  }
                  aria-invalid={Boolean(errors.securityDeposit)}
                />

                {errors.securityDeposit && (
                  <p className={errorClass}>
                    {errors.securityDeposit}
                  </p>
                )}
              </div>

              <div data-field="capacity">
                <label className={labelClass} htmlFor="capacity">
                  Guest capacity *
                </label>

                <input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="1"
                  max="500"
                  step="1"
                  className={`${inputClass} ${
                    errors.capacity ? "border-red-500" : ""
                  }`}
                  placeholder="8"
                  value={values.capacity}
                  onChange={(event) =>
                    updateValue("capacity", event.target.value)
                  }
                  aria-invalid={Boolean(errors.capacity)}
                />

                {errors.capacity && (
                  <p className={errorClass}>{errors.capacity}</p>
                )}
              </div>
            </div>
          </section>

          {/* Cover image */}
          <section className="border-b border-[#233b35]/10 pb-8 dark:border-white/10">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a45d42]">
                04 / Cover image
              </p>

              <h2 className="mt-2 font-serif text-2xl sm:text-3xl">
                Make a strong first impression
              </h2>

              <p className="mt-2 text-sm text-[#66736d] dark:text-[#b3beb8]">
                Keep your current photo or upload a replacement. JPG, PNG,
                or WebP, up to 5 MB.
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              name="image"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(event) =>
                selectImage(event.target.files?.[0])
              }
            />

            <div data-field="image">
              {displayedImage ? (
                <div className="overflow-hidden rounded-xl border border-[#233b35]/10 dark:border-white/10">
                  <div className="relative aspect-16/8 w-full">
                    <Image
                      src={displayedImage}
                      alt="Studio cover preview"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">
                        {imageFile?.name ??
                          (imagePreview
                            ? "New studio image"
                            : "Current studio cover image")}
                      </p>

                      <p className="mt-1 text-xs text-[#66736d] dark:text-[#b3beb8]">
                        {imageFile
                          ? `${(imageFile.size / 1024 / 1024).toFixed(2)} MB`
                          : "Your current image is preserved unless replaced."}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#233b35]/15 px-3 py-2 text-xs font-medium transition hover:border-[#a45d42] dark:border-white/15"
                      >
                        <UploadCloud className="h-3.5 w-3.5" />
                        Replace image
                      </button>

                      <button
                        type="button"
                        onClick={
                          imageFile
                            ? removeNewImage
                            : removeExistingImage
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/20 px-3 py-2 text-xs text-red-600 transition hover:bg-red-500/5"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex min-h-52 w-full flex-col items-center justify-center rounded-xl border border-dashed bg-white/40 px-5 py-8 text-center transition hover:border-[#a45d42] hover:bg-[#a45d42]/5 dark:bg-white/2 ${
                    errors.image
                      ? "border-red-500"
                      : "border-[#233b35]/25 dark:border-white/20"
                  }`}
                >
                  <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#a45d42]/10 text-[#a45d42]">
                    <ImagePlus className="h-6 w-6" />
                  </span>

                  <span className="text-sm font-semibold">
                    Upload studio image
                  </span>

                  <span className="mt-2 text-xs text-[#66736d] dark:text-[#b3beb8]">
                    Browse your device or choose an image
                  </span>

                  <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#a45d42]">
                    <UploadCloud className="h-4 w-4" />
                    Choose image
                  </span>
                </button>
              )}

              {errors.image && (
                <p className={errorClass}>{errors.image}</p>
              )}
            </div>
          </section>

          {/* Host information */}
          <section className="pb-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a45d42]">
              05 / Host information
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl">
              Your host profile
            </h2>

            <p className="mt-2 text-sm text-[#66736d] dark:text-[#b3beb8]">
              These details come from your account and cannot be changed
              here.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Host name</label>

                <input
                  value={user?.name ?? ""}
                  readOnly
                  className={`${inputClass} cursor-not-allowed opacity-70`}
                />
              </div>

              <div>
                <label className={labelClass}>Host email</label>

                <input
                  value={user?.email ?? ""}
                  readOnly
                  className={`${inputClass} cursor-not-allowed opacity-70`}
                />
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col-reverse justify-between gap-4 border-t border-[#233b35]/10 pt-6 dark:border-white/10 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => router.push("/my-listings")}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#233b35]/15 px-5 py-3 text-sm font-medium transition hover:border-[#a45d42] disabled:opacity-50 dark:border-white/15"
            >
              <ArrowLeft className="h-4 w-4" />
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-3 rounded-lg bg-[#233b35] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#314d45] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#a45d42] dark:hover:bg-[#b96b4e]"
            >
              {saving ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Saving changes...
                </>
              ) : (
                <>
                  Save changes
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default function EditStudioPage() {
  return (
    <Suspense fallback={null}>
      <EditStudioContent />
    </Suspense>
  );
}