import type { UserRole, UserStatus, OrderStatus } from "@/types";

// ── Roles ─────────────────────────────────────────────────────────────────────

export const ROLES: Record<UserRole, UserRole> = {
  super_admin:   "super_admin",
  company_admin: "company_admin",
  employee:      "employee",
  individual:    "individual",
};

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin:   "Super Admin",
  company_admin: "Company Admin",
  employee:      "Employee",
  individual:    "Individual",
};

// ── Statuses ──────────────────────────────────────────────────────────────────

export const USER_STATUSES: Record<UserStatus, UserStatus> = {
  pending:   "pending",
  active:    "active",
  suspended: "suspended",
};

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  pending:   "Pending",
  active:    "Active",
  suspended: "Suspended",
};

export const ORDER_STATUSES: Record<OrderStatus, OrderStatus> = {
  pending:   "pending",
  approved:  "approved",
  shipped:   "shipped",
  delivered: "delivered",
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

// ── Dashboard routes by role ──────────────────────────────────────────────────

export const DASHBOARD_ROUTE: Record<string, string> = {
  super_admin:   "/dashboard/admin",
  company_admin: "/dashboard/company",
  employee:      "/dashboard/employee",
  individual:    "/dashboard/employee",
};

// ── Card ordering ─────────────────────────────────────────────────────────────

export const MIN_CARD_QUANTITY = 1;
export const MAX_CARD_QUANTITY = 100;

// ── Brand colors (matches tailwind.config.ts) ─────────────────────────────────

export const COLORS = {
  emeraldDeep:   "#064E3B",
  emeraldMid:    "#065F46",
  emeraldBright: "#059669",
  emeraldLight:  "#D1FAE5",
  emeraldPale:   "#ECFDF5",
  ivory:         "#FEFCE8",
  cream:         "#FEF9EF",
  creamDark:     "#F5EDD8",
  gold:          "#92400E",
  goldLight:     "#D97706",
  goldPale:      "#FEF3C7",
} as const;

// ── Social link config ────────────────────────────────────────────────────────

export const SOCIAL_LINKS = [
  { key: "linkedin",  label: "LinkedIn",  placeholder: "https://linkedin.com/in/yourname" },
  { key: "twitter",   label: "Twitter/X", placeholder: "https://x.com/yourname" },
  { key: "whatsapp",  label: "WhatsApp",  placeholder: "+250 7XX XXX XXX" },
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/yourname" },
  { key: "website",   label: "Website",   placeholder: "https://yourwebsite.com" },
] as const;

// ── Company size options ──────────────────────────────────────────────────────

export const COMPANY_SIZES = [
  { value: "1-10",    label: "1–10 employees" },
  { value: "11-50",   label: "11–50 employees" },
  { value: "51-200",  label: "51–200 employees" },
  { value: "201-500", label: "201–500 employees" },
  { value: "500+",    label: "500+ employees" },
] as const;

// ── Industries ────────────────────────────────────────────────────────────────

export const INDUSTRIES = [
  "Technology", "Finance", "Healthcare", "Education", "Retail",
  "Hospitality", "Real Estate", "Agriculture", "Media", "Logistics",
  "Government", "Non-profit", "Consulting", "Construction", "Other",
] as const;
