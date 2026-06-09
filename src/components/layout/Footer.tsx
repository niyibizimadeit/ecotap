import Link from "next/link";

const FOOTER_LINKS = {
  Product: [
    { label: "How it works", href: "#how-it-works" },
    { label: "Features",     href: "#features" },
    { label: "Pricing",      href: "#pricing" },
  ],
  Company: [
    { label: "About",   href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy policy",    href: "#" },
    { label: "Terms of service",  href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-emerald-deep text-ivory/80">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-ivory/10 border border-ivory/20 rounded-lg flex items-center justify-center">
                <NfcIcon />
              </div>
              <span className="font-serif text-xl font-semibold text-ivory tracking-tight">EcoTap</span>
            </div>
            <p className="text-sm text-ivory/60 leading-relaxed max-w-xs">
              Smart NFC and QR digital business cards for companies and individuals across Rwanda.
            </p>
            <p className="text-xs text-ivory/40 mt-6 font-mono tracking-wide">
              Built in Kigali, Rwanda
            </p>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-xs font-mono tracking-widest uppercase text-ivory/40 mb-4">{section}</h3>
              <ul className="space-y-3">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-ivory/60 hover:text-ivory transition-colors duration-150"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-ivory/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ivory/40">
            © {new Date().getFullYear()} EcoTap. All rights reserved.
          </p>
          <p className="text-xs text-ivory/40">
            Built by{" "}
            <a
              href="https://rdmc.rw"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-light hover:text-ivory transition-colors"
            >
              RDMC Ltd
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function NfcIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="5" height="5" rx="1.5" fill="white" opacity=".9" />
      <rect x="9" y="2" width="5" height="5" rx="1.5" fill="white" opacity=".5" />
      <rect x="2" y="9" width="5" height="5" rx="1.5" fill="white" opacity=".5" />
      <rect x="9" y="9" width="5" height="5" rx="1.5" fill="white" opacity=".2" />
    </svg>
  );
}
