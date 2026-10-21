import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/-+/g, "-")        // collapse consecutive hyphens
    .replace(/^-+|-+$/g, "");
}

export function formatDate(dateString: string, locale = "en-RW"): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/**
 * Whether a sidebar nav item should render as active for the current path.
 *
 * Exact matches always count. Deeper sections also stay active on their
 * nested pages (e.g. /dashboard/employee/orders on /orders/new), but a
 * dashboard root like /dashboard/employee is the Overview page only — it must
 * not stay lit on /dashboard/employee/profile.
 *
 * The `href + "/"` boundary additionally stops /dashboard/adminX from
 * matching /dashboard/admin.
 */
export function isNavActive(pathname: string, href: string): boolean {
  if (pathname === href) return true;
  // Dashboard roots are Overview pages, not parent sections.
  if (/^\/dashboard\/[^/]+$/.test(href)) return false;
  return pathname.startsWith(href + "/");
}

/** Relative luminance of a hex colour, 0 (black) to 1 (white). */
export function getLuminance(hex: string): number {
  const clean = hex.replace("#", "");
  const full = clean.length === 3
    ? clean.split("").map((c) => c + c).join("")
    : clean;
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;

  const channel = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/**
 * Black or white — whichever stays readable on this background.
 *
 * Pure black/white, matching the two copies this replaced in SocialIconRow
 * and CardPreview, so extracting it changed no rendered colour. Falls back to
 * white rather than throwing on a malformed value.
 */
export function contrastColor(hex: string): string {
  try {
    return getLuminance(hex) > 0.5 ? "#000000" : "#FFFFFF";
  } catch {
    return "#FFFFFF";
  }
}

/** "1h 12m" / "12m" / "45s" — for visit durations and elapsed-time chips. */
export function formatDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) return "—";
  const totalSeconds = Math.floor(ms / 1000);
  const hours   = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m`;
  return `${seconds}s`;
}

/** Wall-clock time for the door screen, in the host's own locale. */
export function formatClockTime(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).format(d);
}
