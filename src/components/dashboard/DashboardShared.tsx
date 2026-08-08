interface StatCardProps {
    label: string;
    value: string | number;
    sub?: string;
    icon: React.ReactNode;
    accent?: string;
  }
  
  export function StatCard({ label, value, sub, icon, accent = "#064E3B" }: StatCardProps) {
    return (
      <div
        className="rounded-2xl border p-4 sm:p-5 flex items-start gap-3 sm:gap-4"
        style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}
      >
        <div
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${accent}15` }}
        >
          <span style={{ color: accent }}>{icon}</span>
        </div>
        <div className="min-w-0">
          <p className="text-[10px] sm:text-xs font-mono tracking-widest text-ink-light uppercase mb-0.5 sm:mb-1">{label}</p>
          <p className="font-serif text-xl sm:text-2xl font-semibold text-emerald-deep leading-none truncate">{value}</p>
          {sub && <p className="text-[10px] sm:text-xs text-ink-light mt-0.5 sm:mt-1 truncate">{sub}</p>}
        </div>
      </div>
    );
  }
  
  interface PageHeaderProps {
    eyebrow?: string;
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
  }
  
  export function PageHeader({ eyebrow, title, subtitle, action }: PageHeaderProps) {
    return (
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          {eyebrow && (
            <p className="text-xs font-mono tracking-widest text-emerald-bright uppercase mb-1">{eyebrow}</p>
          )}
          <h1 className="font-serif text-display-sm text-emerald-deep">{title}</h1>
          {subtitle && <p className="text-sm text-ink-light mt-1">{subtitle}</p>}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    );
  }
  
  // ── Loading skeleton ────────────────────────────────────────────────────

  export function StatCardSkeleton() {
    return (
      <div
        className="rounded-2xl border p-5 flex items-start gap-4 animate-pulse"
        style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}
      >
        <div className="w-10 h-10 rounded-xl flex-shrink-0" style={{ backgroundColor: "#D1FAE5" }} />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-20 rounded" style={{ backgroundColor: "#D1FAE5" }} />
          <div className="h-7 w-12 rounded" style={{ backgroundColor: "#D1FAE5" }} />
        </div>
      </div>
    );
  }

  export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
      <div className="animate-pulse space-y-3 p-6">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="h-5 flex-1 rounded" style={{ backgroundColor: "#D1FAE5" }} />
            <div className="h-5 w-24 rounded" style={{ backgroundColor: "#D1FAE5" }} />
            <div className="h-5 w-20 rounded" style={{ backgroundColor: "#D1FAE5" }} />
            <div className="h-5 w-16 rounded" style={{ backgroundColor: "#D1FAE5" }} />
          </div>
        ))}
      </div>
    );
  }

  // ── Empty state ─────────────────────────────────────────────────────────

  export function EmptyState({
    icon,
    title = "Nothing here yet",
    description,
  }: {
    icon?: React.ReactNode;
    title?: string;
    description?: string;
  }) {
    return (
      <div className="py-16 text-center">
        <div className="mb-4 flex justify-center">{icon ?? <InboxIcon />}</div>
        <p className="font-serif text-lg font-semibold text-emerald-deep mb-1">{title}</p>
        {description && <p className="text-sm text-ink-light max-w-xs mx-auto">{description}</p>}
      </div>
    );
  }

  function InboxIcon() {
    return (
      <svg className="h-8 w-8 text-ink-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M2.25 8.25h19.5M3 8.25l1.32 9.9A2.25 2.25 0 006.56 20.25h10.88a2.25 2.25 0 002.24-2.1L21 8.25" />
      </svg>
    );
  }

  // ── Section card ────────────────────────────────────────────────────────

  export function SectionCard({
    title,
    subtitle,
    children,
    className = "",
  }: {
    title?: string;
    subtitle?: string;
    children: React.ReactNode;
    className?: string;
  }) {
    return (
      <div
        className={`rounded-2xl border ${className}`}
        style={{ backgroundColor: "#FEF9EF", borderColor: "rgba(6,78,59,0.08)" }}
      >
        {(title || subtitle) && (
          <div className="px-6 py-4 border-b" style={{ borderColor: "rgba(6,78,59,0.08)" }}>
            {title && <h2 className="font-serif text-lg font-semibold text-emerald-deep">{title}</h2>}
            {subtitle && <p className="text-xs text-ink-light mt-0.5">{subtitle}</p>}
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    );
  }