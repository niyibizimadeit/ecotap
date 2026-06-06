// ── Enums ────────────────────────────────────────────────────────────────────

export type UserRole = "super_admin" | "company_admin" | "employee" | "individual";

export type UserStatus = "pending" | "active" | "suspended";

export type OrderStatus = "pending" | "approved" | "shipped" | "delivered";

export type BillingCycle = "monthly" | "annual";

export type SubscriptionStatus = "active" | "inactive" | "cancelled";

// ── Core entities ─────────────────────────────────────────────────────────────

export interface Profile {
  id: string;
  role: UserRole;
  status: UserStatus;
  username: string;
  full_name: string;
  email: string;
  company_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  brand_color: string | null;
  industry: string | null;
  website: string | null;
  size: string | null;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  company_id: string;
  name: string;
  created_at: string;
}

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  whatsapp?: string;
  instagram?: string;
  website?: string;
}

export interface Card {
  id: string;
  profile_id: string;
  slug: string;
  theme: string;
  accent_color: string | null;
  bio: string | null;
  job_title: string | null;
  phone: string | null;
  social_links: SocialLinks;
  qr_url: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface CardDesign {
  id: string;
  name: string;
  preview_url: string;
  is_active: boolean;
  created_at: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  country: string;
  postal_code?: string;
  notes?: string;
}

export interface CardOrder {
  id: string;
  profile_id: string;
  design_id: string;
  quantity: number;
  shipping_address: ShippingAddress;
  status: OrderStatus;
  tracking_info: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactExchange {
  id: string;
  card_id: string;
  visitor_name: string;
  visitor_email: string | null;
  visitor_phone: string | null;
  created_at: string;
}

export interface BillingPlan {
  id: string;
  name: string;
  billing_cycle: BillingCycle;
  price_per_employee: number;
  is_active: boolean;
  created_at: string;
}

export interface CompanySubscription {
  id: string;
  company_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  employee_count: number;
  next_billing_date: string | null;
  created_at: string;
}

// ── Joined / enriched types ───────────────────────────────────────────────────

export interface PublicCard extends Card {
  profile: Pick<Profile, "id" | "username" | "full_name" | "email" | "role">;
  company: Pick<Company, "id" | "name" | "slug" | "logo_url" | "brand_color"> | null;
}

export interface CardOrderWithDesign extends CardOrder {
  design: CardDesign;
}

// ── Form types ────────────────────────────────────────────────────────────────

export interface OrgRegisterForm {
  company_name: string;
  industry: string;
  size: string;
  website: string;
  admin_name: string;
  email: string;
  password: string;
}

export interface IndividualRegisterForm {
  full_name: string;
  email: string;
  password: string;
  username: string;
  company_name?: string;
}

export interface CardProfileForm {
  full_name: string;
  job_title: string;
  phone: string;
  bio: string;
  social_links: SocialLinks;
}

export interface OrderForm {
  design_id: string;
  quantity: number;
  shipping_address: ShippingAddress;
}

// ── Server action response ────────────────────────────────────────────────────

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}
