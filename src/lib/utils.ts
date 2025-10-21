import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getEmbedUrl(url: string): string {
  try {
    const u = new URL(url);

    // YouTube long format
    if (u.hostname.includes("youtube.com") && u.searchParams.get("v")) {
      return `https://www.youtube.com/embed/${u.searchParams.get("v")}`;
    }

    // YouTube short format
    if (u.hostname === "youtu.be") {
      return `https://www.youtube.com/embed${u.pathname}`;
    }

    // Vimeo
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      return `https://player.vimeo.com/video/${id}`;
    }

    return url; // fallback
  } catch {
    return url;
  }
}

// ✅ helper slugify function
function generateSlug(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ✅ helper unique suffix
function uniqueSuffix() {
  return Math.random().toString(36).substring(2, 6);
}

export function slugify(name: string) {
  return generateSlug(name) + "-" + uniqueSuffix();
}

export const imageThumbnailUrl = (
  url: string,
  width: number = 100,
  height: number = 100
) => {
  const projectId =
    "https://tivznlumwrtoccouqrnm.supabase.co/storage/v1/render/image/public/ecom/";

  // get the file path after 'public/ecom/ from the url
  const filePath = url.split("public/ecom/")[1];

  if (!filePath) {
    return url; // return original url if file path is not found
  }
  // make it webp
  return `${projectId}${filePath}?width=${width}&height=${height}`;
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};
