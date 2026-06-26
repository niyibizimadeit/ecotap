// Pure static page — no data dependencies.
export const dynamic = "force-static";

export default function PrivacyPage() {
  return (
    <div className="bg-ivory">
      <section className="pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-mono tracking-widest uppercase mb-4 text-emerald-bright">Legal</p>
            <h1 className="font-serif text-display-md text-emerald-deep">Privacy Policy</h1>
            <p className="text-sm text-ink-light mt-3">Effective Date: June 01, 2026</p>
          </div>

          <div className="bg-emerald-pale/30 border border-emerald-light/50 rounded-3xl p-8 md:p-10 shadow-card space-y-8 text-ink-mid leading-relaxed">
            <p>
              At EcoTap (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), we are committed to protecting your privacy while delivering innovative, sustainable, and eco-friendly networking solutions. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you use our website (ecotap.rw), access our digital platform, and purchase our smart business cards.
            </p>

            <Section title="1.1 Information We Collect">
              <p>We collect information that you voluntarily provide to us when you create an account, design your live digital profile, or place an order for an EcoTap Smart Card.</p>
              <p>Additionally, we collect information from third parties who interact with an EcoTap user and voluntarily choose to share their own contact details during that interaction. By accessing this platform, all interacting parties acknowledge and agree to the following terms regarding peer-to-peer data transmission:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><strong>Voluntary Peer-to-Peer Transfer:</strong> In the event of an interaction between an EcoTap cardholder and an external party (the &quot;successor&quot;), any data or contact details exchanged are transferred directly to the successor by mutual agreement of those individuals.</li>
                <li><strong>Indemnification of Platform:</strong> Because EcoTap cannot determine or monitor the intent, context, or reason for any physical or digital exchange, EcoTap is entirely absolved of liability in any subsequent legal disputes or data misuse cases. All parties acknowledge they are fully aware of this operational boundary upon reading this paragraph.</li>
              </ul>
              <p className="mt-3 font-semibold">Data Categories Covered:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><strong>Contact & Account Data:</strong> Full name, email address, phone number, job title, company name, and social media or professional links you choose to add to your profile or share during an interaction.</li>
                <li><strong>Shipping & Billing Information:</strong> Mailing and delivery addresses required to ship physical items, and financial data required to process transaction fees and product purchases.</li>
                <li><strong>Usage & System Analytics Data:</strong> Information regarding how you interact with our website, how others interact with your live digital profile (e.g., number of taps, general traffic analytics), and technical diagnostic data. This data is collected to better improve our systems, optimize platform performance, and refine user experience.</li>
              </ul>
            </Section>

            <Section title="1.2 Cookies and Tracking Technologies">
              <p>We use cookies, web beacons, and similar tracking technologies to operate our platform, maintain active user sessions, and analyze website traffic.</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><strong>Essential Cookies:</strong> Necessary for account login security and saving your profile modifications.</li>
                <li><strong>Analytics Cookies:</strong> Used to observe how users navigate ecotap.rw so we can optimize performance. You can control or disable cookies through your browser settings; however, doing so may impact the functionality of certain platform features.</li>
              </ul>
            </Section>

            <Section title="1.3 How We Use Your Information">
              <p>We use your information to operate, maintain, and improve our services, specifically to:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Fulfill, process, and ship your EcoTap Smart Card orders.</li>
                <li>Host, secure, and maintain your live digital profile link.</li>
                <li>Analyze platform diagnostics and aggregate user trends to continually update and improve our backend systems and software infrastructure.</li>
                <li>Generate aggregated, anonymous environmental impact metrics for our Corporate ESG Dashboard (e.g., tracking total trees planted and CO₂ saved).</li>
                <li>Communicate with you regarding order updates, customer support inquiries, and platform enhancements.</li>
              </ul>
            </Section>

            <Section title="1.4 Data Sharing & Third Parties">
              <p>We do not sell your personal data. We only share data with trusted third parties strictly necessary to operate our service:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><strong>Reforestation Partners:</strong> We share aggregated, non-personally identifiable volume data with our partners (e.g., Team Environment Rwanda and RDMC) to verify and fulfill our &quot;1 Card = 1 Tree Planted&quot; commitment.</li>
                <li><strong>Logistics & Payment Vendors:</strong> Essential contact, shipping, and payment processing data shared with secure financial institutions and courier services to deliver your physical cards.</li>
              </ul>
            </Section>

            <Section title="1.5 Data Security & Storage">
              <p>As a Proudly Made in Rwanda initiative, your data is securely stored and handled in compliance with applicable Rwandan law, including Law No. 058/2021 of 13/10/2021 relating to the protection of personal data and privacy. We implement robust technical security measures to protect your information against unauthorized access.</p>
            </Section>

            <Section title="1.6 Your Rights">
              <p>You can update or delete your live digital profile content at any time through your account dashboard. To request total account deletion or data removal under local regulations, please contact us at <a href="mailto:support@ecotap.rw" className="text-emerald-bright hover:text-emerald-mid underline">support@ecotap.rw</a>.</p>
            </Section>
          </div>
        </div>
      </section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-serif text-lg font-semibold text-emerald-deep mb-3">{title}</h2>
      <div className="text-sm text-ink-light space-y-2">{children}</div>
    </div>
  );
}
