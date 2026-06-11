export default function TermsPage() {
  return (
    <div className="bg-ivory">
      <section className="pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-mono tracking-widest uppercase mb-4 text-emerald-bright">Legal</p>
            <h1 className="font-serif text-display-md text-emerald-deep">Terms and Conditions</h1>
            <p className="text-sm text-ink-light mt-3">Last Updated: June 10, 2026</p>
          </div>

          <div className="bg-emerald-pale/30 border border-emerald-light/50 rounded-3xl p-8 md:p-10 shadow-card space-y-8 text-ink-mid leading-relaxed">
            <p>
              Welcome to EcoTap! These Terms and Conditions (&quot;Terms&quot;) govern your use of the website (ecotap.rw), the purchasing of our physical NFC Smart Cards, and the use of our digital networking platform. By accessing our platform or making a purchase, you agree to comply with and be bound by these Terms.
            </p>

            <Section title="2.1 Services & Pricing Structure">
              <div className="bg-cream border border-cream-dark rounded-xl p-4 mb-4">
                <p className="text-sm font-semibold text-emerald-deep">
                  CRITICAL NOTICE: All services and products listed on our platform are provided exactly &quot;as they are&quot; on the pricing section at the time of your interaction. Please read the specific definitions below prior to committing to any order.
                </p>
              </div>
              <p className="font-semibold">As-Is Presentation & Inquiries:</p>
              <p>All service elements and pricing are delivered literally as depicted on the matrix. If you have any questions, uncertainties, or require structural clarification regarding what is included in a specific package, <strong>you must contact us before making a purchase.</strong></p>
              <p className="font-semibold mt-3">The &quot;$0&quot; Feature Clarification:</p>
              <p>Please note that the <strong>$0 amount represents exclusively the active digital link</strong> provided to establish and host your live profile on our platform. The physical EcoTap Smart Cards themselves are separate tangible goods; <strong>you need to buy the physical cards</strong> to utilize the offline tap and share functionality.</p>
              <p className="font-semibold mt-3">No Speculative Liability:</p>
              <p>EcoTap explicitly states that we are not liable for any purchase based on pure speculation, assumptions, or arbitrary misunderstandings of our structural pricing model by the buyer. All sales are final based on the written terms presented natively on the pricing dashboard.</p>
              <p className="font-semibold mt-3">Local Taxation:</p>
              <p>Every single transaction executed on the platform is <strong>subject to applicable local taxes,</strong> which will be structurally calculated and automatically applied at checkout based on your statutory local jurisdiction.</p>
            </Section>

            <Section title="2.2 Shipping, Delivery, and Risk of Loss">
              <p><strong>Courier Services & Transfer of Risk:</strong> Physical card fulfillment is handled by third-party logistics and courier companies. Risk of loss and title for all physical products purchased pass to you, the buyer, the moment we hand over the package to the shipping carrier. EcoTap is not responsible for postal delays, transit damage, or packages stolen post-delivery.</p>
            </Section>

            <Section title='2.3 The "1 Card = 1 Tree" Campaign Rules'>
              <p>For every physical EcoTap Smart Card purchased and successfully activated, EcoTap pledges to plant one (1) tree through our joint initiatives with Team Environment Rwanda and the RDMC.</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><strong>Campaign Validity:</strong> This environmental initiative runs strictly within specific, designated time periods. Only physical cards purchased during an active, officially announced campaign period will be considered.</li>
                <li><strong>Fulfillment Schedule:</strong> Tree planting occurs in scheduled seasonal batches rather than immediately upon transaction.</li>
                <li><strong>Verification:</strong> The planting pledge is bound exclusively to verified, completed card purchases and successful digital activation. Canceled orders, returned items, or unactivated cards do not qualify for the tree-planting program.</li>
              </ul>
            </Section>

            <Section title="2.4 User Conduct & Content">
              <p>You are entirely responsible for the content you choose to display on your active digital profile link. You agree not to post, upload, or share any material that is illegal, defamatory, fraudulent, or infringing on intellectual property. EcoTap reserves the right to suspend or terminate any digital profile link that violates these standards or misrepresents corporate credentials.</p>
            </Section>

            <Section title="2.5 Intellectual Property">
              <p>All intellectual property rights related to EcoTap technology, card designs, website interface, trademarks, and branding materials belong solely to EcoTap. We grant you a limited, non-exclusive license to use our platform and tap technology for professional networking purposes.</p>
            </Section>

            <Section title="2.6 Limitation of Liability">
              <p>EcoTap cards use advanced NFC and digital profile technology designed to withstand standard commercial wear and tear (up to 100k+ taps). However, EcoTap is provided &quot;as is&quot; without warranties of any kind. Beyond our strict policy against liability for speculative purchases, we are not liable for network outages, unreadable chips on incompatible legacy hardware, or any loss of business opportunities resulting from platform downtime.</p>
            </Section>

            <Section title="2.7 Governing Law">
              <p>These Terms and any disputes arising out of your transactions with EcoTap shall be governed by, and construed in accordance with, the laws of the Republic of Rwanda. Any legal actions must be brought before the competent courts of Kigali, Rwanda.</p>
            </Section>

            <Section title="2.8 Changes to Terms">
              <p>We may modify these Terms at any time to reflect platform upgrades, tax adjustments, or legal requirements. Continued use of the platform after updates constitutes acceptance of the new Terms.</p>
            </Section>

            <Section title="3. Contact Information">
              <p>If you have any questions regarding our pricing, what a package entails, or these legal documents, please contact us explicitly before making a final purchase:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><strong>Email Contact:</strong> <a href="mailto:info@ecotap.rw" className="text-emerald-bright hover:text-emerald-mid underline">info@ecotap.rw</a> / <a href="mailto:support@ecotap.rw" className="text-emerald-bright hover:text-emerald-mid underline">support@ecotap.rw</a></li>
                <li><strong>Website Contact:</strong> ecotap.rw</li>
              </ul>
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
