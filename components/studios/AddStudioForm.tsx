"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, LoaderCircle, MapPin, Plus, X } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthProvider";
import { createStudio } from "@/services/studioService";
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

const errorClass = "mt-2 text-xs font-medium text-red-600 dark:text-red-400";

function isValidJpgUrl(value: string): boolean {
  try {
    const url = new URL(value.trim());
    return (
      (url.protocol === "https:" || url.protocol === "http:") &&
      /\.(jpe?g)$/i.test(url.pathname)
    );
  } catch {
    return false;
  }
}

export default function AddStudioForm() {
  const router = useRouter();
  const { user } = useAuth();

  const formRef = useRef<HTMLFormElement>(null);

  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [customAmenity, setCustomAmenity] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const updateValue = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));

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

    if (amenities.some((item) => item.toLowerCase() === value.toLowerCase())) {
      toast.error("This amenity has already been added.");
      return;
    }

    setAmenities((current) => [...current, value]);
    setCustomAmenity("");
  };

  const validateForm = (): boolean => {
    const nextErrors: FieldErrors = {};

    if (values.title.trim().length < 3) {
      nextErrors.title = "Studio name must contain at least 3 characters.";
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
      nextErrors.hourlyRate = "Enter a valid hourly rate greater than 0.";
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
      nextErrors.capacity = "Capacity must be between 1 and 500 people.";
    }

    if (values.overview.trim().length < 30) {
      nextErrors.overview =
        "Studio overview must contain at least 30 characters.";
    }

    if (!isValidJpgUrl(imageURL)) {
      nextErrors.image = "Please enter a direct JPG or JPEG image URL.";
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

      toast.error("Please review the highlighted fields before publishing.");

      return false;
    }

    return true;
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (saving) return;

    if (!validateForm()) return;

    setSaving(true);

    try {

      const createdStudio = await createStudio({
        title: values.title.trim(),
        category: values.category,
        location: values.location.trim(),
        hourlyRate: Number(values.hourlyRate),
        securityDeposit: Number(values.securityDeposit),
        capacity: Number(values.capacity),
        image: imageURL.trim(),
        amenities,
        overview: values.overview.trim(),
      });

      if (!createdStudio?.id) {
        throw new Error(
          "Your studio may have been saved, but the server did not return its ID."
        );
      }

      toast.success("Your studio has been published successfully.");

      router.push(`/studios/${createdStudio.id}`);
      router.refresh();
    } catch (error) {
      console.error("Studio publishing failed:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to publish your studio. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="space-y-8"
    >
      <section className="border-b border-[#233b35]/10 pb-8 dark:border-white/10">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a45d42]">
            01 / Studio identity
          </p>
          <h2 className="mt-2 font-serif text-2xl sm:text-3xl">
            Tell us about your space
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#66736d] dark:text-[#b3beb8]">
            Start with the essential details people need to discover your
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
                errors.title ? "border-red-500 focus:border-red-500" : ""
              }`}
              placeholder="e.g. The Natural Light Studio"
              value={values.title}
              onChange={(event) => updateValue("title", event.target.value)}
              maxLength={100}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? "title-error" : undefined}
            />
            {errors.title && (
              <p id="title-error" className={errorClass}>
                {errors.title}
              </p>
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
              onChange={(event) => updateValue("category", event.target.value)}
              aria-invalid={Boolean(errors.category)}
              aria-describedby={
                errors.category ? "category-error" : undefined
              }
            >
              <option value="">Choose a category</option>
              {studioCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p id="category-error" className={errorClass}>
                {errors.category}
              </p>
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
                aria-describedby={
                  errors.location ? "location-error" : undefined
                }
              />
            </div>
            {errors.location && (
              <p id="location-error" className={errorClass}>
                {errors.location}
              </p>
            )}
          </div>
        </div>
      </section>

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
              aria-describedby={
                errors.overview ? "overview-error" : undefined
              }
            />
            <div className="mt-2 flex items-center justify-between gap-3">
              {errors.overview ? (
                <p id="overview-error" className={errorClass}>
                  {errors.overview}
                </p>
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
                onChange={(event) => setCustomAmenity(event.target.value)}
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
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-[#233b35]/15 px-4 py-3 text-sm font-medium hover:border-[#a45d42] dark:border-white/15"
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
                  .filter((amenity) => !AMENITY_OPTIONS.includes(amenity))
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
              Hourly rate (à§³) *
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
              aria-describedby={
                errors.hourlyRate ? "hourly-rate-error" : undefined
              }
            />
            {errors.hourlyRate && (
              <p id="hourly-rate-error" className={errorClass}>
                {errors.hourlyRate}
              </p>
            )}
          </div>

          <div data-field="securityDeposit">
            <label className={labelClass} htmlFor="security-deposit">
              Security deposit (à§³)
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
              aria-describedby={
                errors.securityDeposit ? "deposit-error" : undefined
              }
            />
            {errors.securityDeposit && (
              <p id="deposit-error" className={errorClass}>
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
              aria-describedby={
                errors.capacity ? "capacity-error" : undefined
              }
            />
            {errors.capacity && (
              <p id="capacity-error" className={errorClass}>
                {errors.capacity}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="border-b border-[#233b35]/10 pb-8 dark:border-white/10">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a45d42]">
            04 / Cover image
          </p>
          <h2 className="mt-2 font-serif text-2xl sm:text-3xl">
            Make a strong first impression
          </h2>
          <p className="mt-2 text-sm text-[#66736d] dark:text-[#b3beb8]">
            Upload a clear photo that represents your studio. JPG, PNG, or
            WebP, up to 5 MB.
          </p>
        </div>

        <div data-field="image">
          <label htmlFor="studio-image-url" className={labelClass}>
            Direct JPG/JPEG image URL
          </label>
          <input
            id="studio-image-url"
            type="url"
            value={imageURL}
            onChange={(event) => {
              setImageURL(event.target.value);
              setErrors((current) => {
                const updated = { ...current };
                delete updated.image;
                return updated;
              });
            }}
            placeholder="https://example.com/studio-photo.jpg"
            className={inputClass}
          />
          <p className="mt-2 text-xs text-[#66736d] dark:text-[#b3beb8]">
            Paste a direct link ending in .jpg or .jpeg. The image must be publicly accessible.
          </p>
          {isValidJpgUrl(imageURL) && (
            <div className="relative mt-4 aspect-16/8 w-full overflow-hidden rounded-xl border border-[#233b35]/10 dark:border-white/10">
              <Image
                src={imageURL.trim()}
                alt="Studio cover preview"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          )}
          {errors.image && <p className={errorClass}>{errors.image}</p>}
        </div>
      </section>

      <section className="pb-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a45d42]">
          05 / Host information
        </p>
        <h2 className="mt-2 font-serif text-2xl sm:text-3xl">
          Your host profile
        </h2>
        <p className="mt-2 text-sm text-[#66736d] dark:text-[#b3beb8]">
          These details come from your account and cannot be changed here.
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

      <div className="flex flex-col-reverse justify-between gap-4 border-t border-[#233b35]/10 pt-6 dark:border-white/10 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#233b35]/15 px-5 py-3 text-sm font-medium transition hover:border-[#a45d42] disabled:opacity-50 dark:border-white/15"
        >
          <ArrowLeft className="h-4 w-4" />
          Go back
        </button>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-3 rounded-lg bg-[#233b35] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#314d45] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#a45d42] dark:hover:bg-[#b96b4e]"
        >
          {saving ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Publishing studio...
            </>
          ) : (
            <>
              Publish studio
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
