import { Suspense } from "react";
import VerifyEmailForm from "./VerifyEmailForm";

export default function VerifyPage() {
  return (
    <Suspense fallback={<VerifyFallback />}>
      <VerifyEmailForm />
    </Suspense>
  );
}

function VerifyFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="w-12 h-12 rounded-full border-4 border-emerald-light border-t-emerald-bright animate-spin" />
    </div>
  );
}
