import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Infant John A's portfolio website. Learn how this site handles your data and information.",
  openGraph: {
    title: "Privacy Policy — Infant John A",
    description: "Privacy Policy for Infant John A's portfolio website.",
    url: "/privacy-policy",
  },
  robots: {
    // Privacy policy should not be indexed in search results
    index: false,
    follow: false,
  },
};

const EFFECTIVE_DATE = "28 May 2026";
const CONTACT_EMAIL = "infantjohna@email.com";
const SITE_URL = "https://infantjohna.com";

const Section = ({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) => (
  <section id={id} className="mb-14 scroll-mt-28">
    <h2 className="font-heading text-xl md:text-2xl text-charcoal font-bold tracking-[0.08em] mb-5 pb-3 border-b border-warm-gray/40">
      {title}
    </h2>
    <div className="font-body text-charcoal/70 text-base leading-[1.9] space-y-4">
      {children}
    </div>
  </section>
);

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* ── Page Hero ── */}
      <section className="pt-36 pb-16 px-6 max-w-3xl mx-auto text-center">
        <span className="font-body text-gold text-xs tracking-[0.35em] uppercase mb-6 block">
          Legal
        </span>
        <h1 className="font-heading text-4xl md:text-5xl text-charcoal font-bold leading-tight mb-6">
          Privacy Policy
        </h1>
        <p className="font-body text-charcoal/50 text-sm">
          Effective date: <time dateTime="2026-05-28">{EFFECTIVE_DATE}</time>
        </p>
        <div className="mt-4 h-px w-16 bg-gold mx-auto" />
      </section>

      {/* ── Table of Contents ── */}
      <nav
        aria-label="Privacy policy sections"
        className="max-w-3xl mx-auto px-6 mb-16"
      >
        <div className="bg-beige/40 border border-warm-gray/30 p-7">
          <p className="font-body text-xs tracking-[0.25em] uppercase text-charcoal/40 mb-4">
            Contents
          </p>
          <ol className="font-body text-sm text-charcoal/60 space-y-2 list-decimal list-inside">
            {[
              ["#overview", "Overview"],
              ["#information-collected", "Information We Collect"],
              ["#how-we-use", "How We Use Your Information"],
              ["#cookies", "Cookies & Tracking Technologies"],
              ["#third-party", "Third-Party Services"],
              ["#data-retention", "Data Retention"],
              ["#your-rights", "Your Rights"],
              ["#children", "Children's Privacy"],
              ["#changes", "Changes to This Policy"],
              ["#contact", "Contact"],
            ].map(([href, label]) => (
              <li key={href}>
                <a
                  href={href}
                  className="hover:text-gold transition-colors duration-200"
                >
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </nav>

      {/* ── Policy Body ── */}
      <article className="max-w-3xl mx-auto px-6 pb-32">

        <Section id="overview" title="1. Overview">
          <p>
            This Privacy Policy applies to the portfolio website of{" "}
            <strong className="text-charcoal font-medium">Infant John A</strong>{" "}
            located at{" "}
            <a
              href={SITE_URL}
              className="text-gold hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {SITE_URL}
            </a>{" "}
            (the "Site"). Infant John A is a freelance videographer and photographer
            based in India.
          </p>
          <p>
            This Site is a personal portfolio — its sole purpose is to showcase
            creative work and provide a way for potential clients and collaborators
            to get in touch. We are committed to being transparent about the very
            limited data involved in operating this Site.
          </p>
          <p>
            By visiting or using this Site, you agree to the practices described
            in this policy. If you do not agree, please discontinue use of the
            Site.
          </p>
        </Section>

        <Section id="information-collected" title="2. Information We Collect">
          <p>
            <strong className="text-charcoal font-medium">
              This Site does not operate any contact forms, account systems, or
              user sign-ups.
            </strong>{" "}
            We collect no personal information directly through this website.
          </p>
          <p>The following limited data may be collected passively:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className="text-charcoal font-medium">
                Server / Hosting Logs:
              </strong>{" "}
              Our hosting provider (Vercel) may automatically log standard
              technical information such as your browser type, operating system,
              referring URL, and anonymised IP address. This data is used solely
              for infrastructure security, performance monitoring, and abuse
              prevention. It is not used to identify you personally.
            </li>
            <li>
              <strong className="text-charcoal font-medium">
                Voluntarily Provided Information:
              </strong>{" "}
              If you choose to contact John directly via email, phone, or social
              media — links to which are displayed on this Site — any information
              you share is governed by the privacy policy of that respective
              platform (e.g., Gmail, WhatsApp, Instagram). John will only use
              information you share to respond to your enquiry and will not share
              it with any third party.
            </li>
          </ul>
        </Section>

        <Section id="how-we-use" title="3. How We Use Your Information">
          <p>
            Because this Site collects no personal data directly, there is no
            personal data for us to use, sell, or share.
          </p>
          <p>
            Any contact information you voluntarily provide (via email or
            messaging platforms) is used exclusively to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Respond to your enquiry or project brief.</li>
            <li>Discuss potential collaborations or bookings.</li>
          </ul>
          <p>
            We do not use this information for marketing, profiling, or any other
            purpose, and we will never sell or rent your personal information to
            any third party.
          </p>
        </Section>

        <Section id="cookies" title="4. Cookies & Tracking Technologies">
          <p>
            This Site does not set any first-party cookies and does not use any
            analytics, advertising, or tracking scripts (e.g., Google Analytics,
            Meta Pixel, Hotjar).
          </p>
          <p>
            Third-party services embedded on this Site (see Section 5) may set
            their own cookies when you interact with embedded content. These
            cookies are governed by those services' own privacy policies, which
            we encourage you to review.
          </p>
          <p>
            You can control or disable cookies at any time through your browser
            settings. Disabling cookies will not affect your ability to browse
            this portfolio.
          </p>
        </Section>

        <Section id="third-party" title="5. Third-Party Services">
          <p>
            This Site may embed content from or link to third-party platforms.
            We are not responsible for the privacy practices of these services.
            Please review their respective privacy policies:
          </p>
          <ul className="list-disc pl-6 space-y-3">
            <li>
              <strong className="text-charcoal font-medium">
                YouTube / Google LLC
              </strong>{" "}
              — Video embeds on the Videography page. When you interact with an
              embedded video, YouTube may collect data per their{" "}
              <a
                href="https://policies.google.com/privacy"
                className="text-gold hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
              .
            </li>
            <li>
              <strong className="text-charcoal font-medium">
                Vimeo, Inc.
              </strong>{" "}
              — Alternative video embeds, governed by{" "}
              <a
                href="https://vimeo.com/privacy"
                className="text-gold hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Vimeo's Privacy Policy
              </a>
              .
            </li>
            <li>
              <strong className="text-charcoal font-medium">
                Instagram / Meta Platforms, Inc.
              </strong>{" "}
              — External link only. Governed by{" "}
              <a
                href="https://privacycenter.instagram.com/policy"
                className="text-gold hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Meta's Privacy Policy
              </a>
              .
            </li>
            <li>
              <strong className="text-charcoal font-medium">
                Behance / Adobe Inc.
              </strong>{" "}
              — External link only. Governed by{" "}
              <a
                href="https://www.adobe.com/privacy/policy.html"
                className="text-gold hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Adobe's Privacy Policy
              </a>
              .
            </li>
            <li>
              <strong className="text-charcoal font-medium">
                Vercel, Inc.
              </strong>{" "}
              — Hosting provider. May collect anonymised infrastructure logs per{" "}
              <a
                href="https://vercel.com/legal/privacy-policy"
                className="text-gold hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Vercel's Privacy Policy
              </a>
              .
            </li>
            <li>
              <strong className="text-charcoal font-medium">
                Google Fonts
              </strong>{" "}
              — Typography. Google may log requests for font files. See{" "}
              <a
                href="https://policies.google.com/privacy"
                className="text-gold hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google's Privacy Policy
              </a>
              .
            </li>
          </ul>
        </Section>

        <Section id="data-retention" title="6. Data Retention">
          <p>
            Since this Site does not directly collect or store personal data, there
            is no personal data retained on our end.
          </p>
          <p>
            Any correspondence sent to John via email or social media will be
            retained only for as long as necessary to fulfil the purpose of your
            enquiry or as required by applicable law. You may request deletion of
            such correspondence at any time by contacting John directly (see
            Section 10).
          </p>
        </Section>

        <Section id="your-rights" title="7. Your Rights">
          <p>
            Depending on your jurisdiction, you may have certain rights regarding
            your personal data, including under the{" "}
            <strong className="text-charcoal font-medium">
              General Data Protection Regulation (GDPR)
            </strong>
            ,{" "}
            <strong className="text-charcoal font-medium">
              India's Digital Personal Data Protection Act (DPDPA) 2023
            </strong>
            , or other applicable laws. These rights may include:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>The right to access personal data held about you.</li>
            <li>The right to rectify inaccurate personal data.</li>
            <li>
              The right to erasure ("right to be forgotten") of your personal
              data.
            </li>
            <li>
              The right to restrict or object to processing of your personal data.
            </li>
            <li>The right to data portability.</li>
          </ul>
          <p>
            As this Site does not collect personal data directly, most of these
            rights will apply to data held in third-party services (see Section 5)
            or to correspondence you have sent to John directly. To exercise any
            of these rights, please contact John at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-gold hover:underline">
              {CONTACT_EMAIL}
            </a>
            . We will respond within 30 days.
          </p>
        </Section>

        <Section id="children" title="8. Children's Privacy">
          <p>
            This Site is not directed at children under the age of 13, and we do
            not knowingly collect any personal information from children. If you
            believe a child has provided us with personal information, please
            contact us immediately at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-gold hover:underline">
              {CONTACT_EMAIL}
            </a>{" "}
            and we will take steps to delete such information.
          </p>
        </Section>

        <Section id="changes" title="9. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time to reflect changes
            in our practices or applicable laws. Any updates will be posted on this
            page with a revised effective date. We encourage you to review this
            page periodically.
          </p>
          <p>
            Continued use of the Site following the posting of any changes
            constitutes your acceptance of those changes.
          </p>
        </Section>

        <Section id="contact" title="10. Contact">
          <p>
            If you have any questions, concerns, or requests regarding this Privacy
            Policy or the handling of your data, please contact:
          </p>
          <address className="not-italic bg-beige/40 border border-warm-gray/30 p-6 mt-4 space-y-2">
            <p className="font-heading text-charcoal font-bold tracking-wider">
              Infant John A
            </p>
            <p className="text-charcoal/60 text-sm">
              Freelance Videographer &amp; Photographer
            </p>
            <p className="mt-3">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-gold hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </address>
        </Section>

        {/* Back to Home */}
        <div className="mt-16 pt-10 border-t border-warm-gray/40 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="font-body text-xs text-charcoal/35">
            © {new Date().getFullYear()} Infant John A. All rights reserved.
          </p>
          <Link
            href="/"
            className="font-body text-xs tracking-[0.2em] uppercase text-charcoal/50 hover:text-gold transition-colors duration-300"
          >
            ← Back to Portfolio
          </Link>
        </div>
      </article>
    </>
  );
}
