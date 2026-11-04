"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Camera,
  Check,
  ImagePlus,
  LoaderCircle,
  Mail,
  Save,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthProvider";
import {
  updateProfile,
  uploadProfileImage,
} from "@/services/auth";

export default function EditProfilePage() {
  const router = useRouter();
  const { user, loading, setUser } = useAuth();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [previewURL, setPreviewURL] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhotoURL(user.photoURL || "");
      setPreviewURL(user.photoURL || "");
    }
  }, [user]);

  function handleImageSelect(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Please select a JPG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Your image must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreviewURL(localPreview);

    void handleUpload(file);
  }

  async function handleUpload(file: File) {
    try {
      setUploading(true);

      const uploadedURL = await uploadProfileImage(file);

      setPhotoURL(uploadedURL);
      setPreviewURL(uploadedURL);

      toast.success("Profile picture uploaded.");
    } catch (error) {
      setPreviewURL(photoURL);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to upload your profile picture."
      );
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function removePhoto() {
    setPhotoURL("");
    setPreviewURL("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user || saving || uploading) return;

    const cleanName = name.trim();

    if (cleanName.length < 2 || cleanName.length > 80) {
      toast.error("Name must contain between 2 and 80 characters.");
      return;
    }

    const hasChanges =
      cleanName !== user.name ||
      (photoURL || "") !== (user.photoURL || "");

    if (!hasChanges) {
      toast.info("You haven't made any changes.");
      return;
    }

    try {
      setSaving(true);

      const result = await updateProfile({
        name: cleanName,
        photoURL,
      });

      setUser(result.user);

      toast.success(result.message || "Profile updated successfully.");

      router.push("/profile");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading || !user) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f5f1ea] dark:bg-[#171a18]">
        <LoaderCircle className="animate-spin text-[#8f4933]" size={30} />
      </main>
    );
  }

  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <main className="min-h-screen bg-[#f5f1ea] px-4 py-10 dark:bg-[#171a18] sm:px-6 lg:py-14">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/profile"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#77736d] transition hover:text-[#8f4933] dark:text-[#aaa99f] dark:hover:text-[#d59a7e]"
        >
          <ArrowLeft size={17} />
          Back to profile
        </Link>

        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.19em] text-[#a45d42]">
            Account settings
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#282725] dark:text-[#f3f0e9] sm:text-4xl">
            Edit your profile
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-7 text-[#77736d] dark:text-[#aaa99f]">
            Keep your personal information up to date and make your
            StudioSpace account feel like yours.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
            <section className="rounded-2xl border border-[#e7e0d6] bg-white p-6 shadow-[0_8px_35px_rgba(40,39,37,0.035)] dark:border-[#39413b] dark:bg-[#222724] sm:p-8">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f1ea] text-[#8f4933] dark:bg-[#343a35] dark:text-[#d59a7e]">
                  <UserRound size={19} />
                </div>

                <div>
                  <h2 className="font-semibold text-[#282725] dark:text-[#f3f0e9]">
                    Personal information
                  </h2>
                  <p className="mt-1 text-xs text-[#99948b]">
                    Update your account details
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="profile-name"
                    className="mb-2 block text-sm font-medium text-[#403d38] dark:text-[#e5e1d8]"
                  >
                    Full name
                  </label>

                  <input
                    id="profile-name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    minLength={2}
                    maxLength={80}
                    required
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-[#e7e0d6] bg-[#fcfbf9] px-4 py-3.5 text-sm text-[#282725] outline-none transition placeholder:text-[#aaa49a] focus:border-[#a45d42] dark:border-[#39413b] dark:bg-[#171a18] dark:text-[#f3f0e9] dark:focus:border-[#d59a7e]"
                  />
                  <p className="mt-2 text-xs text-[#99948b]">
                    Your name will be visible on your account.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="profile-email"
                    className="mb-2 block text-sm font-medium text-[#403d38] dark:text-[#e5e1d8]"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#99948b]"
                    />

                    <input
                      id="profile-email"
                      type="email"
                      value={user.email}
                      readOnly
                      className="w-full cursor-not-allowed rounded-xl border border-[#e7e0d6] bg-[#f5f1ea]/70 py-3.5 pl-11 pr-4 text-sm text-[#77736d] outline-none dark:border-[#39413b] dark:bg-[#171a18]/70 dark:text-[#aaa99f]"
                    />
                  </div>

                  <p className="mt-2 text-xs text-[#99948b]">
                    Your email address cannot be changed here.
                  </p>
                </div>
              </div>

              <div className="mt-9 border-t border-[#eee8df] pt-6 dark:border-[#39413b]">
                <div className="flex items-center gap-2 text-sm font-medium text-[#403d38] dark:text-[#e5e1d8]">
                  <ShieldCheck size={17} className="text-[#8f4933] dark:text-[#d59a7e]" />
                  Account security
                </div>

                <p className="mt-2 text-sm leading-6 text-[#99948b]">
                  Your login credentials and account security settings
                  remain unchanged when you edit your profile.
                </p>
              </div>
            </section>

            <aside className="h-fit rounded-2xl border border-[#e7e0d6] bg-white p-6 shadow-[0_8px_35px_rgba(40,39,37,0.035)] dark:border-[#39413b] dark:bg-[#222724]">
              <h2 className="font-semibold text-[#282725] dark:text-[#f3f0e9]">
                Profile picture
              </h2>

              <p className="mt-1 text-xs leading-5 text-[#99948b]">
                Choose a clear image that represents you.
              </p>

              <div className="mt-7 flex flex-col items-center">
                <div className="relative flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border-4 border-[#f5f1ea] bg-[#eee6dc] dark:border-[#343a35] dark:bg-[#343a35]">
                  {previewURL ? (
                    <Image
                      src={previewURL}
                      alt="Profile picture preview"
                      fill
                      unoptimized
                      sizes="144px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-semibold text-[#8f4933] dark:text-[#d59a7e]">
                      {initials || <UserRound size={42} />}
                    </span>
                  )}

                  {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                      <LoaderCircle size={28} className="animate-spin" />
                    </div>
                  )}
                </div>

                <p className="mt-4 text-sm font-semibold text-[#282725] dark:text-[#f3f0e9]">
                  {name.trim() || user.name}
                </p>

                <p className="mt-1 text-xs text-[#99948b]">
                  Profile preview
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageSelect}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl border border-[#e7e0d6] px-4 py-3 text-sm font-semibold text-[#403d38] transition hover:border-[#c9a18e] hover:bg-[#fcfbf9] disabled:cursor-wait disabled:opacity-60 dark:border-[#485149] dark:text-[#e5e1d8] dark:hover:bg-[#2b312d]"
              >
                {uploading ? (
                  <LoaderCircle size={17} className="animate-spin" />
                ) : (
                  <Camera size={17} />
                )}
                {uploading ? "Uploading..." : "Choose a picture"}
              </button>

              {previewURL && (
                <button
                  type="button"
                  onClick={removePhoto}
                  disabled={uploading}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-[#a45d42] transition hover:bg-[#f9eee9] disabled:opacity-50 dark:text-[#d59a7e] dark:hover:bg-[#3a2d29]"
                >
                  <X size={16} />
                  Remove picture
                </button>
              )}

              <div className="mt-5 rounded-xl bg-[#f5f1ea] p-3.5 dark:bg-[#171a18]">
                <div className="flex items-start gap-2">
                  <ImagePlus
                    size={16}
                    className="mt-0.5 shrink-0 text-[#8f4933] dark:text-[#d59a7e]"
                  />
                  <p className="text-xs leading-5 text-[#77736d] dark:text-[#aaa99f]">
                    JPG, PNG or WebP. Maximum file size: 5 MB.
                  </p>
                </div>
              </div>
            </aside>
          </div>

          <div className="mt-6 flex flex-col-reverse justify-between gap-3 sm:flex-row sm:items-center">
            <Link
              href="/profile"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#e0d8ce] px-6 text-sm font-semibold text-[#77736d] transition hover:bg-white dark:border-[#39413b] dark:text-[#aaa99f] dark:hover:bg-[#222724]"
            >
              <X size={17} />
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving || uploading}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#8f4933] px-7 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(143,73,51,0.16)] transition hover:bg-[#713824] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : (
                <Save size={17} />
              )}
              {saving ? "Saving changes..." : "Save changes"}
              {!saving && <Check size={16} />}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}