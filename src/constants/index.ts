import type {
  UserRole, UserStatus, OrderStatus, NotificationType,
  EventStatus, CheckInMethod, VisitExitSource,
} from "@/types";

// ── Roles ─────────────────────────────────────────────────────────────────────

export const ROLES: Record<UserRole, UserRole> = {
  super_admin:   "super_admin",
  country_rep:   "country_rep",
  company_admin: "company_admin",
  employee:      "employee",
  individual:    "individual",
};

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin:   "Super Admin",
  country_rep:   "Country Rep",
  company_admin: "Company Admin",
  employee:      "Employee",
  individual:    "Individual",
};

/** Roles that can access the admin dashboard */
export const ADMIN_ROLES: UserRole[] = ["super_admin", "country_rep"];

/** Roles with full admin write access (country_rep is read-only) */
export const ADMIN_WRITE_ROLES: UserRole[] = ["super_admin"];

// ── Statuses ──────────────────────────────────────────────────────────────────

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  pending:   "Pending",
  active:    "Active",
  suspended: "Suspended",
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending:   "Pending",
  approved:  "Approved",
  shipped:   "Shipped",
  delivered: "Delivered",
};

// ── Routes ────────────────────────────────────────────────────────────────────

export const ROUTES = {
  home:              "/",
  orgLogin:          "/org/login",
  orgRegister:       "/org/register",
  login:             "/login",
  register:          "/register",
  pending:           "/pending",
  adminDashboard:    "/dashboard/admin",
  companyDashboard:  "/dashboard/company",
  employeeDashboard: "/dashboard/employee",
} as const;

export const DASHBOARD_ROUTE: Record<UserRole, string> = {
  super_admin:   "/dashboard/admin",
  country_rep:   "/dashboard/admin",
  company_admin: "/dashboard/company",
  employee:      "/dashboard/employee",
  individual:    "/dashboard/employee",
};

// ── Card ordering ─────────────────────────────────────────────────────────────

export const MIN_CARD_QUANTITY = 1;
export const MAX_CARD_QUANTITY = 100;

/** Invite link expiry in days */
export const INVITATION_EXPIRY_DAYS = 7;

// ── Card pricing ──────────────────────────────────────────────────────────────

/** 1 USD = 1,500 RWF */
export const USD_TO_RWF_RATE = 1500;

/**
 * Base card prices in USD per card.
 * Sponsored rates thanks to Team Environment Rwanda partnership.
 */
export const CARD_PRICES = {
  individual: 30,   // Personal hardware (was $40, 25% sponsored)
  corporate:  25,   // Corporate bulk hardware (was $28, up to 50% sponsored)
} as const;

/** Original prices before Team Environment Rwanda sponsorship (for display) */
export const CARD_ORIGINAL_PRICES = {
  individual: 40,
  corporate:  35,
} as const;

/** Compute the RWF equivalent of a USD price */
export function usdToRwf(usd: number): number {
  return Math.round(usd * USD_TO_RWF_RATE);
}

// ── MoMo Pay ───────────────────────────────────────────────────────────────────

export const MOMO_PAY = {
  code: "*182*8*1*04404#",
  name: "RDMC Ltd",
  instructions:
    "Dial the USSD code above on your phone to pay via MTN Mobile Money or Airtel Money. Enter the total amount shown below, then upload your payment confirmation screenshot.",
} as const;

// ── Payment status labels ──────────────────────────────────────────────────────

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  unpaid:   "Unpaid",
  paid:     "Paid",
  verified: "Verified",
};

// ── Social links config ───────────────────────────────────────────────────────

export const SOCIAL_LINKS = [
  { key: "linkedin",  label: "LinkedIn",  placeholder: "https://linkedin.com/in/yourname" },
  { key: "twitter",   label: "Twitter/X", placeholder: "https://x.com/yourname"           },
  { key: "whatsapp",  label: "WhatsApp",  placeholder: "+250 7XX XXX XXX"                 },
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/yourname"   },
  { key: "website",   label: "Website",   placeholder: "https://yourwebsite.com"          },
] as const;

/** Company-relevant social links shown in the Organization section */
export const COMPANY_SOCIAL_LINKS = [
  { key: "linkedin", label: "LinkedIn",  placeholder: "https://linkedin.com/company/..." },
  { key: "twitter",  label: "Twitter/X", placeholder: "https://x.com/..."                },
  { key: "website",  label: "Website",   placeholder: "https://..."                      },
] as const;

/** Social links available for card groups (same as company social links) */
export const GROUP_SOCIAL_LINKS = [
  { key: "linkedin", label: "LinkedIn",  placeholder: "https://linkedin.com/in/..." },
  { key: "twitter",  label: "Twitter/X", placeholder: "https://x.com/..."           },
  { key: "website",  label: "Website",   placeholder: "https://..."                 },
] as const;

/** Max number of affiliation groups a card can have */
export const MAX_CARD_GROUPS = 3;

// ── Company size options ──────────────────────────────────────────────────────

export const COMPANY_SIZES = [
  { value: "1-10",    label: "1–10 employees"     },
  { value: "11-50",   label: "11–50 employees"    },
  { value: "51-200",  label: "51–200 employees"   },
  { value: "201-500", label: "201–500 employees"  },
  { value: "500+",    label: "500+ employees"     },
] as const;

// ── Industries ────────────────────────────────────────────────────────────────

export const INDUSTRIES = [
  "Technology", "Finance", "Healthcare", "Education", "Retail",
  "Hospitality", "Real Estate", "Agriculture", "Media", "Logistics",
  "Government", "Non-profit", "Consulting", "Construction", "Other",
] as const;

// ── Notification types ────────────────────────────────────────────────────────

export const NOTIFICATION_LABELS: Record<NotificationType, string> = {
  pending_approval_company:    "New company registration pending",
  pending_approval_individual: "New individual registration pending",
  card_order_placed:           "New card order placed",
  order_status_update:         "Card order status updated",
};

// ── Environmental impact constants ────────────────────────────────────────────
// Industry-standard figures used in monthly company environmental reports.
// Sources documented in INSTRUCTIONS.md.

export const ENV = {
  /** Weight of one standard paper business card in grams (HiHello / Statistic Brain) */
  PAPER_CARD_WEIGHT_GRAMS: 1.35,

  /** CO₂ equivalent per paper card full lifecycle in grams (NexaLink industry analysis) */
  CO2_PER_PAPER_CARD_GRAMS: 9,

  /** Water required to produce 1kg of paper in litres (ShareEcard / EPA) */
  WATER_PER_KG_PAPER_LITRES: 324,

  /** Trees saved per paper card avoided (industry: ~1 tree per 250 cards) */
  TREES_PER_CARD: 0.004,

  /** % of paper cards thrown away within one week */
  PAPER_CARD_DISCARD_RATE: 0.88,

  /**
   * Estimated paper reprints one EcoTap NFC card replaces over its lifetime.
   * Based on Cardynale / TapiLink research: ~30 reprints per person over card lifespan.
   */
  PAPER_REPRINTS_REPLACED_PER_CARD_LIFETIME: 30,

  /** Conservative NFC card lifespan in years (recycled PVC, industry standard) */
  NFC_CARD_LIFESPAN_YEARS: 7,

  /**
   * Monthly paper cards avoided per active EcoTap card.
   * = 30 reprints ÷ 7 years ÷ 12 months ≈ 0.357 per month
   */
  MONTHLY_PAPER_CARDS_AVOIDED_PER_CARD: 30 / 7 / 12,
} as const;

/**
 * Calculate monthly environmental impact for a company.
 * Used by the environmental report service.
 */
export function calcMonthlyImpact(activeCards: number) {
  const avoided       = activeCards * ENV.MONTHLY_PAPER_CARDS_AVOIDED_PER_CARD;
  const co2Grams      = avoided * ENV.CO2_PER_PAPER_CARD_GRAMS;
  const paperKg       = (avoided * ENV.PAPER_CARD_WEIGHT_GRAMS) / 1000;
  const waterLitres   = paperKg * ENV.WATER_PER_KG_PAPER_LITRES;
  const wasteGrams    = avoided * ENV.PAPER_CARD_WEIGHT_GRAMS;
  const trees         = avoided * ENV.TREES_PER_CARD;

  return {
    paper_cards_avoided:  Math.round(avoided * 100) / 100,
    co2_saved_grams:      Math.round(co2Grams),
    water_saved_litres:   Math.round(waterLitres * 10) / 10,
    waste_avoided_grams:  Math.round(wasteGrams * 100) / 100,
    trees_saved:          Math.round(trees * 10000) / 10000,
  };
}

// ── Brand colours (mirror globals.css) ───────────────────────────────────────

export const COLORS = {
  emeraldDeep:   "#064E3B",
  emeraldMid:    "#065F46",
  emeraldBright: "#059669",
  emeraldLight:  "#D1FAE5",
  emeraldPale:   "#ECFDF5",
  ivory:         "#FEFCE8",
  cream:         "#FEF9EF",
  creamDark:     "#F0E6D3",
  gold:          "#92400E",
  goldLight:     "#D97706",
  goldPale:      "#FEF3C7",
} as const;

// ── Events ───────────────────────────────────────────────────────────────────

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  scheduled: "Scheduled",
  live:      "Live",
  closed:    "Closed",
  cancelled: "Cancelled",
};

export const CHECK_IN_METHOD_LABELS: Record<CheckInMethod, string> = {
  nfc: "NFC tap",
  qr:  "QR scan",
};

export const VISIT_EXIT_SOURCE_LABELS: Record<VisitExitSource, string> = {
  manual:      "Recorded",
  auto_close:  "Auto — event closed",
  auto_cancel: "Auto — event cancelled",
};

/**
 * A second tap within this window of entry is ambiguous: nobody genuinely
 * checks in and leaves this fast, so the host is asked whether the person
 * is leaving or the card double-tapped. At or beyond this, the exit is
 * recorded automatically with no prompt.
 */
export const AMBIGUOUS_EXIT_WINDOW_MS = 5 * 60 * 1000;

/** Event titles are a display label; keep them short enough for a phone row. */
export const MAX_EVENT_TITLE_LENGTH = 120;

/**
 * All export timestamps render in this zone. Vercel runs UTC, so writing
 * raw Date objects would show hosts times two hours behind what they saw
 * at the door. Everything is formatted as a string in this zone instead.
 */
export const EVENT_EXPORT_TIMEZONE = "Africa/Kigali";

/** Column headers for the attendance spreadsheet, in order. */
export const EVENT_EXPORT_COLUMNS = [
  "Full name",
  "Phone",
  "Email",
  "Company",
  "Department",
  "Role/Position",
  "Entry time",
  "Exit time",
] as const;

/**
 * Hard caps on a bulk export. A platform-wide zip is generated in memory,
 * so these keep the request inside the function's memory and time budget.
 * Exceeding either returns 413 with a clear message rather than timing out.
 */
export const MAX_EVENTS_PER_ZIP = 500;
export const MAX_VISITS_PER_ZIP = 100_000;
