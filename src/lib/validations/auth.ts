import { z } from "zod";

// ── Shared fragments ────────────────────────────────────────────────────────────

const email = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address");

const password = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password must be under 100 characters");

const fullName = z
  .string()
  .min(1, "Full name is required")
  .max(100, "Name must be under 100 characters");

const phone = z
  .string()
  .min(1, "Phone number is required")
  .refine(
    (val) => /^\+?[0-9]{7,15}$/.test(val),
    { message: "Enter a valid phone number (e.g., +250788123456)" }
  );

const age = z
  .number({ message: "Age is required" })
  .int("Age must be a whole number")
  .min(13, "You must be at least 13 years old")
  .max(120, "Please enter a valid age");

// ── Organisation registration (3 steps) ─────────────────────────────────────────

export const orgRegisterStep1Schema = z.object({
  company_name: z
    .string()
    .min(1, "Company name is required")
    .max(100, "Company name must be under 100 characters"),
  industry: z.string().min(1, "Please select an industry"),
  size: z.string().min(1, "Please select company size"),
  website: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^https?:\/\/.+/.test(val) || /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val || ""),
      { message: "Enter a valid URL or domain (e.g., example.com)" }
    ),
});

export const orgRegisterStep2Schema = z.object({
  admin_name: fullName,
  email,
  password,
  confirm_password: password,
  phone,
  age,
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});

export const orgRegisterSchema = orgRegisterStep1Schema.merge(orgRegisterStep2Schema);

export type OrgRegisterStep1Data = z.infer<typeof orgRegisterStep1Schema>;
export type OrgRegisterStep2Data = z.infer<typeof orgRegisterStep2Schema>;
export type OrgRegisterData = z.infer<typeof orgRegisterSchema>;

// ── Individual registration ─────────────────────────────────────────────────────

export const individualRegisterSchema = z.object({
  full_name: fullName,
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be under 30 characters")
    .regex(/^[a-z0-9_-]+$/, "Only lowercase letters, numbers, hyphens, and underscores"),
  email,
  password,
  confirm_password: password,
  phone,
  age,
  company_name: z.string().optional(),
  terms_accepted: z.literal(true, {
    message: "You must accept the Terms and Conditions and Privacy Policy to continue.",
  }),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});

export type IndividualRegisterData = z.infer<typeof individualRegisterSchema>;

// ── Login ───────────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email,
  password,
});

export type LoginData = z.infer<typeof loginSchema>;
