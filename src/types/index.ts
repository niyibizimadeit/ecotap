// ── Enums ─────────────────────────────────────────────────────────────────────

export type UserRole        = "super_admin" | "company_admin" | "employee" | "individual";
export type UserStatus      = "pending" | "active" | "suspended";
export type OrderStatus     = "pending" | "approved" | "shipped" | "delivered";
export type BillingCycle    = "monthly" | "annual";
export type SubscriptionStatus = "active" | "inactive" | "cancelled";
export type InvitationStatus   = "pending" | "accepted" | "expired";
export type DeviceType      = "mobile" | "tablet" | "desktop" | "unknown";
export type EventType       =
  | "view"             // card page opened
  | "nfc_tap"          // arrived via NFC chip (?source=nfc)
  | "qr_scan"          // arrived via QR code (?source=qr)
  | "vcf_download"     // Save contact button clicked
  | "contact_exchange" // visitor submitted their contact details
  | "social_click"     // a social link was clicked
  | "share";           // card was shared (future)

// ── Core identity ─────────────────────────────────────────────────────────────

export interface Profile {
  id:           string;
  role:         UserRole;
  status:       UserStatus;
  username:     string;
  full_name:    string;
  email:        string;
  avatar_url:   string | null;
  // profile_companies join determines company context
  created_at:   string;
  updated_at:   string;
}

export interface Company {
  id:          string;
  name:        string;
  slug:        string;
  logo_url:    string | null;
  brand_color: string | null;
  industry:    string | null;
  website:     string | null;
  size:        string | null;
  description: string | null;
  status:      UserStatus;
  created_at:  string;
  updated_at:  string;
}

/** Join table — an employee can belong to multiple companies.
 *  is_primary = true means this company shows in the card top-right badge. */
export interface ProfileCompany {
  id:         string;
  profile_id: string;
  company_id: string;
  department_id: string | null;
  job_title:  string | null;    // can differ per company
  is_primary: boolean;
  created_at: string;
}

export interface Department {
  id:         string;
  company_id: string;
  name:       string;
  color:      string | null;
  created_at: string;
}

// ── Cards ─────────────────────────────────────────────────────────────────────

export interface SocialLinks {
  linkedin?:  string;
  twitter?:   string;
  whatsapp?:  string;
  instagram?: string;
  website?:   string;
}

export interface Card {
  id:           string;
  profile_id:   string;
  slug:         string;
  /** Digital accent colour — independent of physical card design */
  theme_color:  string;
  bio:          string | null;
  job_title:    string | null;   // fallback if no primary company job_title
  phone:        string | null;
  email_public: string | null;   // shown on card (may differ from auth email)
  social_links: SocialLinks;
  qr_url:       string | null;
  is_public:    boolean;
  created_at:   string;
  updated_at:   string;
}

/** Physical NFC card designs — managed by Super Admin */
export interface CardDesign {
  id:          string;
  name:        string;
  description: string | null;
  preview_url: string | null;
  accent_color:string;
  pattern:     string;
  is_active:   boolean;
  created_at:  string;
}

export interface ShippingAddress {
  street:      string;
  city:        string;
  country:     string;
  postal_code?: string;
  notes?:      string;
}

export interface CardOrder {
  id:               string;
  profile_id:       string;
  design_id:        string;
  quantity:         number;
  shipping_address: ShippingAddress;
  status:           OrderStatus;
  tracking_info:    string | null;
  notes:            string | null;   // admin notes on the order
  created_at:       string;
  updated_at:       string;
}

// ── Analytics & ML ────────────────────────────────────────────────────────────

/** Append-only event log — every meaningful visitor action on a card page.
 *  Never deleted. Foundation of all future ML and analytics work. */
export interface CardEvent {
  id:            string;
  card_id:       string;
  event_type:    EventType;
  /** Groups events from one visitor session */
  session_id:    string | null;
  /** Anonymous visitor identifier, persisted in cookie */
  visitor_id:    string | null;
  referrer:      string | null;
  device_type:   DeviceType;
  os:            string | null;
  browser:       string | null;
  country:       string | null;   // from Vercel edge geo headers
  city:          string | null;
  utm_source:    string | null;
  utm_medium:    string | null;
  utm_campaign:  string | null;
  /** Populated for social_click events */
  social_target: string | null;
  /** Time on page in ms — populated when session ends */
  duration_ms:   number | null;
  created_at:    string;
}

/** Pre-aggregated daily rollup per card — computed nightly.
 *  Makes dashboard queries instant at scale. */
export interface DailyCardStat {
  id:              string;
  card_id:         string;
  date:            string;         // YYYY-MM-DD
  views:           number;
  nfc_taps:        number;
  qr_scans:        number;
  vcf_downloads:   number;
  exchanges:       number;
  social_clicks:   number;
  unique_visitors: number;
  avg_duration_ms: number | null;
  created_at:      string;
}

/** A visitor who submitted their contact details on a card page */
export interface ContactExchange {
  id:            string;
  card_id:       string;
  visitor_name:  string;
  visitor_email: string | null;
  visitor_phone: string | null;
  /** Which event row this exchange is linked to */
  event_id:      string | null;
  device_type:   DeviceType;
  referrer:      string | null;
  country:       string | null;
  created_at:    string;
}

// ── Platform operations ───────────────────────────────────────────────────────

/** One-time-use invite link generated by a company admin */
export interface Invitation {
  id:         string;
  company_id: string;
  created_by: string;          // profile_id of the company admin
  email:      string | null;   // optional pre-fill
  token:      string;          // the unique one-time token in the URL
  status:     InvitationStatus;
  expires_at: string;
  accepted_by:string | null;   // profile_id of the employee who accepted
  created_at: string;
}

export interface BillingPlan {
  id:                 string;
  name:               string;
  billing_cycle:      BillingCycle;
  price_per_employee: number;          // in RWF
  is_active:          boolean;
  created_at:         string;
}

export interface CompanySubscription {
  id:               string;
  company_id:       string;
  plan_id:          string;
  status:           SubscriptionStatus;
  employee_count:   number;
  next_billing_date:string | null;
  created_at:       string;
  updated_at:       string;
}

/** Notification log — currently used for Super Admin approval alerts via email */
export interface Notification {
  id:         string;
  profile_id: string;         // recipient
  type:       string;         // 'pending_approval' | 'order_update' | ...
  title:      string;
  body:       string;
  is_read:    boolean;
  email_sent: boolean;
  metadata:   Record<string, unknown>;
  created_at: string;
}

// ── Joined / enriched types ───────────────────────────────────────────────────

/** Full public card data — everything needed to render the card page */
export interface PublicCard extends Card {
  profile: Pick<Profile, "id" | "username" | "full_name" | "email" | "avatar_url" | "role">;
  /** The primary company for this card */
  primary_company: Pick<Company, "id" | "name" | "slug" | "logo_url" | "brand_color"> | null;
  primary_job_title: string | null;   // from profile_companies where is_primary = true
}

export interface CardOrderWithDesign extends CardOrder {
  design: CardDesign;
}

export interface ProfileWithCompanies extends Profile {
  companies: Array<ProfileCompany & { company: Company; department: Department | null }>;
}

// ── Form types ────────────────────────────────────────────────────────────────

export interface OrgRegisterForm {
  company_name: string;
  industry:     string;
  size:         string;
  website:      string;
  admin_name:   string;
  email:        string;
  password:     string;
}

export interface IndividualRegisterForm {
  full_name:    string;
  email:        string;
  password:     string;
  username:     string;
  company_name?: string;
}

export interface CardProfileForm {
  job_title:    string;
  phone:        string;
  email_public: string;
  bio:          string;
  theme_color:  string;
  social_links: SocialLinks;
}

export interface OrderForm {
  design_id:        string;
  quantity:         number;
  shipping_address: ShippingAddress;
}

export interface RecordEventPayload {
  card_id:       string;
  event_type:    EventType;
  session_id?:   string;
  visitor_id?:   string;
  referrer?:     string;
  device_type?:  DeviceType;
  os?:           string;
  browser?:      string;
  country?:      string;
  city?:         string;
  utm_source?:   string;
  utm_medium?:   string;
  utm_campaign?: string;
  social_target?:string;
}

// ── Server action response ────────────────────────────────────────────────────

export interface ActionResult<T = void> {
  success: boolean;
  data?:   T;
  error?:  string;
}