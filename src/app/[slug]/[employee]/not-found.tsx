import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: "#ECFDF5" }}
        >
          <span className="font-serif text-2xl text-emerald-deep">?</span>
        </div>
        <h1 className="font-serif text-display-sm text-emerald-deep mb-3">Card not found</h1>
        <p className="text-sm text-ink-light mb-8 leading-relaxed">
          This employee card does not exist or may have been deactivated. The company or username may be incorrect.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-emerald-bright hover:text-emerald-mid underline underline-offset-4 transition-colors"
        >
          ← Back to EcoTap
        </Link>
      </div>
    </div>
  );
}
