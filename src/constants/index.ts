import type { UserRole, UserStatus, OrderStatus, NotificationType } from "@/types";

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
  country_rep:   "Country Representative",
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

/** Base card prices in USD per card */
export const CARD_PRICES = {
  individual: 40,   // Personal hardware
  corporate:  28,   // Corporate bulk hardware
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