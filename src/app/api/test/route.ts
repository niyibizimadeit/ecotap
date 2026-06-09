// ─────────────────────────────────────────────────────────────────────────────
// Dev-only test route — exercises every repository and service function.
// DELETE this file before Phase 15 (production launch).
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";

// Repositories
import * as profilesRepo from "@/lib/supabase/profiles.repo";
import * as companiesRepo from "@/lib/supabase/companies.repo";
import * as departmentsRepo from "@/lib/supabase/departments.repo";
import * as cardsRepo from "@/lib/supabase/cards.repo";
import * as designsRepo from "@/lib/supabase/card_designs.repo";
import * as ordersRepo from "@/lib/supabase/card_orders.repo";
import * as exchangesRepo from "@/lib/supabase/contact_exchanges.repo";
import * as billingRepo from "@/lib/supabase/billing.repo";
import * as analyticsRepo from "@/lib/supabase/analytics.repo";

// Services
import * as onboardingService from "@/lib/services/onboarding.service";
import * as cardsService from "@/lib/services/cards.service";
import * as ordersService from "@/lib/services/orders.service";
import * as contactsService from "@/lib/services/contacts.service";
import * as adminService from "@/lib/services/admin.service";
import * as analyticsService from "@/lib/services/analytics.service";

interface TestResult {
  name: string;
  status: "pass" | "fail" | "skip";
  error?: string;
}

export async function GET() {
  const results: TestResult[] = [];

  // ── Repositories: verify exports ───────────────────────────────────────────

  const repoModules = [
    { name: "profilesRepo",      mod: profilesRepo,      fns: ["getProfileById", "getProfileByUsername", "getProfileByEmail", "getAllProfiles", "getAllPending", "createProfile", "updateProfile", "updateProfileStatus", "updateProfileRole", "deleteProfile"] },
    { name: "companiesRepo",     mod: companiesRepo,     fns: ["getCompanyById", "getCompanyBySlug", "getAllCompanies", "getAllPendingCompanies", "createCompany", "updateCompany", "updateCompanyStatus", "deleteCompany"] },
    { name: "departmentsRepo",   mod: departmentsRepo,   fns: ["getDepartmentsByCompany", "getDepartmentById", "createDepartment", "updateDepartment", "deleteDepartment"] },
    { name: "cardsRepo",         mod: cardsRepo,         fns: ["getCardById", "getCardBySlug", "getCardByProfileId", "getPublicCard", "createCard", "updateCard", "deleteCard"] },
    { name: "designsRepo",       mod: designsRepo,       fns: ["getActiveDesigns", "getAllDesigns", "getDesignById", "createDesign", "updateDesign", "deleteDesign"] },
    { name: "ordersRepo",        mod: ordersRepo,        fns: ["getOrdersByProfileId", "getAllOrders", "getOrderById", "createOrder", "updateOrderStatus", "deleteOrder"] },
    { name: "exchangesRepo",     mod: exchangesRepo,     fns: ["getExchangesByCardId", "getExchangeById", "getExchangesByProfileId", "createExchange", "deleteExchange"] },
    { name: "billingRepo",       mod: billingRepo,       fns: ["getActivePlans", "getAllPlans", "getPlanById", "upsertPlan", "deletePlan", "getSubscriptionByCompanyId", "getAllSubscriptions", "createSubscription", "updateSubscription", "cancelSubscription"] },
    { name: "analyticsRepo",     mod: analyticsRepo,     fns: ["recordEvent", "getEventsByCardId", "getEventCountByType", "getDailyStats", "getStatsByDateRange", "getProfileActivity", "recordProfileActivity", "getRecentLoginCount", "getCardScores", "getLatestCardScore", "upsertCardScores", "assignTestVariant", "getTestAssignments", "recordTestConversion", "getEnvironmentalReports", "getLatestEnvironmentalReport", "createEnvironmentalReport"] },
  ];

  for (const { name, mod, fns } of repoModules) {
    for (const fn of fns) {
      const exists = typeof (mod as Record<string, unknown>)[fn] === "function";
      results.push({
        name:   `${name}.${fn}`,
        status: exists ? "pass" : "fail",
        error:  exists ? undefined : `Function '${fn}' not exported from ${name}`,
      });
    }
  }

  // ── Services: verify exports ───────────────────────────────────────────────

  const serviceModules = [
    { name: "onboardingService", mod: onboardingService, fns: ["registerCompany", "registerIndividual", "approveCompany", "approveIndividual", "rejectUser", "suspendUser"] },
    { name: "cardsService",      mod: cardsService,      fns: ["createCardForProfile", "updateCard", "getPublicCard"] },
    { name: "ordersService",     mod: ordersService,     fns: ["placeOrder", "approveOrder", "markShipped", "markDelivered", "getUserOrders", "getAllOrders"] },
    { name: "contactsService",   mod: contactsService,   fns: ["recordExchange", "getInbox", "getCardExchanges", "deleteExchange"] },
    { name: "adminService",      mod: adminService,      fns: ["getPendingQueue", "getAllUsers", "getUserById", "getAllOrdersAdmin", "getAllDesignsAdmin", "createDesign", "updateDesign", "deleteDesign", "getAllPlansAdmin", "upsertPlan", "deletePlan", "getAllSubscriptionsAdmin", "getAdminOverview"] },
    { name: "analyticsService",  mod: analyticsService,  fns: ["recordCardEvent", "getCardEvents", "getCardEventCounts", "getCardStats", "computeCardScores", "getLatestCardScores", "getCardScoreHistory", "getUserActivity", "logUserActivity", "generateMonthlyReport", "getCompanyReports", "getLatestCompanyReport", "assignVisitorToTest", "getTestResults"] },
  ];

  for (const { name, mod, fns } of serviceModules) {
    for (const fn of fns) {
      const exists = typeof (mod as Record<string, unknown>)[fn] === "function";
      results.push({
        name:   `${name}.${fn}`,
        status: exists ? "pass" : "fail",
        error:  exists ? undefined : `Function '${fn}' not exported from ${name}`,
      });
    }
  }

  // ── Verify types are importable ─────────────────────────────────────────────

  const passed = results.filter((r) => r.status === "pass").length;
  const failed = results.filter((r) => r.status === "fail").length;

  return NextResponse.json({
    summary: {
      total:  results.length,
      passed,
      failed,
      allPassed: failed === 0,
    },
    failures: results.filter((r) => r.status === "fail"),
    timestamp: new Date().toISOString(),
    note: "This test verifies that all repo and service functions are correctly exported and importable. It does NOT test runtime behavior — that requires a live Supabase instance.",
  });
}
