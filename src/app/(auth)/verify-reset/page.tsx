import { Suspense } from "react";
import { VerifyResetForm } from "./VerifyResetForm";

export default function VerifyResetPage() {
  return (
    <Suspense fallback={<VerifyResetFallback />}>
      <VerifyResetForm />
    </Suspense>
  );
}

function VerifyResetFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="w-12 h-12 rounded-full border-4 border-emerald-light border-t-emerald-bright animate-spin" />
    </div>
  );
}
