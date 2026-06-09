/**
 * Seed demo accounts for testing all dashboards.
 * Run with: npx tsx scripts/seed-demo-users.ts
 *
 * Uses the Supabase service role key for admin-level user creation.
 */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

// Load from .env.local
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key  = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ── Password generator ──────────────────────────────────────────────────────

function generatePassword(): string {
  const words = ["Eco", "Tap", "Rwanda", "Green", "Leaf", "Card", "NFC", "QR", "Safe", "Pro"];
  const pick = () => words[Math.floor(Math.random() * words.length)];
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `${pick()}${pick()}${digits}!`;
}

// ── Demo accounts ───────────────────────────────────────────────────────────

const DEMO_USERS = [
  {
    email:    "princeniyibizi4@gmail.com",
    password: "EcoTapRwanda8921!",
    role:     "employee",
    full_name: "Prince Niyibizi",
    username:  "prince-niyibizi",
  },
  {
    email:    "info@rdmc.rw",
    password: "CardQR2144!",
    role:     "super_admin",
    full_name: "RDMC Admin",
    username:  "rdmc-admin",
  },
  {
    email:    "niyibiziivprince@gmail.com",
    password: "GreenLeaf4787!",
    role:     "company_admin",
    full_name: "Prince Niyibizi",
    username:  "prince-rdmc",
  },
];

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding demo users…\n");

  for (const user of DEMO_USERS) {
    console.log(`Creating: ${user.email} (${user.role})`);

    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email:        user.email,
      password:     user.password,
      email_confirm: true,
      user_metadata: {
        full_name: user.full_name,
        username:  user.username,
        role:      user.role,
      },
    });

    if (authError) {
      console.error(`  ❌ Auth error: ${authError.message}`);
      continue;
    }

    const userId = authData.user?.id;
    if (!userId) {
      console.error("  ❌ No user ID returned");
      continue;
    }

    console.log(`  ✅ Auth user created: ${userId}`);

    // 2. Ensure profile exists and has correct role + active status
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id:         userId,
        role:       user.role,
        status:     "active",
        username:   user.username,
        full_name:  user.full_name,
        email:      user.email,
      }, { onConflict: "id" });

    if (profileError) {
      console.error(`  ⚠️  Profile update error: ${profileError.message}`);
    } else {
      console.log(`  ✅ Profile updated — role: ${user.role}, status: active`);
    }

    // 3. Ensure a card exists for the user
    const { data: existingCard } = await supabase
      .from("cards")
      .select("id")
      .eq("profile_id", userId)
      .single();

    if (!existingCard) {
      const { error: cardError } = await supabase
        .from("cards")
        .insert({
          profile_id:   userId,
          slug:         user.username,
          theme_color:  "#064E3B",
          is_public:    true,
          email_public: user.email,
        });

      if (cardError) {
        console.error(`  ⚠️  Card creation error: ${cardError.message}`);
      } else {
        console.log(`  ✅ Card created — slug: ${user.username}`);
      }
    } else {
      console.log(`  ℹ️  Card already exists`);
    }

    console.log("");
  }

  // 4. Create a company for the company_admin if it doesn't exist
  console.log("Creating company for RDMC…");
  const { data: existingCompany } = await supabase
    .from("companies")
    .select("id")
    .eq("slug", "rdmc")
    .single();

  if (!existingCompany) {
    const { data: company, error: companyError } = await supabase
      .from("companies")
      .insert({
        name:        "RDMC Ltd",
        slug:        "rdmc",
        industry:    "Technology",
        size:        "11-50",
        website:     "https://rdmc.rw",
        status:      "active",
        legal_rep_confirmed: true,
      })
      .select("id")
      .single();

    if (companyError) {
      console.error(`  ❌ Company error: ${companyError.message}`);
    } else if (company) {
      console.log(`  ✅ Company created: ${company.id}`);

      // Link the company_admin to this company
      const { data: adminUser } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", "niyibiziivprince@gmail.com")
        .single();

      if (adminUser) {
        // Check if link already exists
        const { data: existingLink } = await supabase
          .from("profile_companies")
          .select("id")
          .eq("profile_id", adminUser.id)
          .eq("company_id", company.id)
          .single();

        if (!existingLink) {
          const { error: linkError } = await supabase
            .from("profile_companies")
            .insert({
              profile_id:  adminUser.id,
              company_id:  company.id,
              job_title:   "CEO",
              is_primary:  true,
            });

          if (linkError) {
            console.error(`  ⚠️  Profile-company link error: ${linkError.message}`);
          } else {
            console.log(`  ✅ Admin linked to RDMC as CEO`);
          }
        } else {
          console.log(`  ℹ️  Admin already linked to RDMC`);
        }
      }
    }
  } else {
    console.log(`  ℹ️  Company RDMC already exists`);

    // Still link admin user
    const { data: adminUser } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", "niyibiziivprince@gmail.com")
      .single();

    if (adminUser) {
      const { data: existingLink } = await supabase
        .from("profile_companies")
        .select("id")
        .eq("profile_id", adminUser.id)
        .eq("company_id", existingCompany.id)
        .single();

      if (!existingLink) {
        await supabase.from("profile_companies").insert({
          profile_id:  adminUser.id,
          company_id:  existingCompany.id,
          job_title:   "CEO",
          is_primary:  true,
        });
        console.log(`  ✅ Admin linked to RDMC`);
      }
    }
  }

  console.log("\n📋 Demo login details:\n");
  console.log("┌────────────────────────────────┬───────────────────────┬──────────────────┐");
  console.log("│ Email                          │ Role                  │ Password         │");
  console.log("├────────────────────────────────┼───────────────────────┼──────────────────┤");
  for (const user of DEMO_USERS) {
    console.log(`│ ${user.email.padEnd(30)} │ ${user.role.padEnd(21)} │ ${user.password.padEnd(16)} │`);
  }
  console.log("└────────────────────────────────┴───────────────────────┴──────────────────┘");
  console.log("\n✅ Done. Use these to log in via /login or /org/login.");
}

main().catch(console.error);
