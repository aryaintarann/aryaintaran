import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Arya Intaran",
  description:
    "Privacy policy for aryaintaran.dev — how we handle contact form data and what information is collected when you visit this portfolio.",
  alternates: { canonical: "https://aryaintaran.dev/privacy-policy" },
  openGraph: {
    title: "Privacy Policy | Arya Intaran",
    description:
      "Privacy policy for aryaintaran.dev — how contact form data is handled and what information is collected.",
    type: "website",
    url: "https://aryaintaran.dev/privacy-policy",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Arya Intaran Portfolio",
      },
    ],
  },
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "March 2, 2026";

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-4 bg-background/80 backdrop-blur-md border-b border-border">
        <Link
          href="/"
          aria-label="Back to home"
          className="flex items-center gap-2 text-sm font-semibold tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        <div className="w-9 h-9 bg-lime rounded-lg flex items-center justify-center">
          <span className="text-[#050505] font-black text-sm tracking-tight">AI</span>
        </div>
      </header>

      <div className="pt-28 pb-24 px-8">
        <div className="max-w-2xl mx-auto prose prose-invert">
          <h1 className="text-4xl font-black tracking-[-0.02em] mb-2">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-12">Last updated: {lastUpdated}</p>

          <section className="mb-10">
            <h2 className="text-xl font-bold mb-3">Overview</h2>
            <p className="text-muted-foreground leading-relaxed">
              This privacy policy explains how <strong className="text-foreground">aryaintaran.dev</strong> (this portfolio website)
              handles any data you provide. I take your privacy seriously and collect only what
              is necessary for the messaging form to function.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              This is a personal portfolio site operated by Arya Intaran, a Full Stack Developer
              based in Indonesia. The site showcases projects, skills, and professional background.
              No user accounts are required, no tracking pixels are used, and no advertising
              networks have access to this site or its visitors.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold mb-3">Information I Collect</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              When you use the contact form, I collect:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li><strong className="text-foreground">Name</strong> — to address you in my reply</li>
              <li><strong className="text-foreground">Email address</strong> — to reply to your message</li>
              <li><strong className="text-foreground">Message content</strong> — the message you write</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              I do <strong className="text-foreground">not</strong> collect any other personal data.
              This site does not use cookies, analytics trackers, or advertising networks.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold mb-3">How I Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your contact form data is stored securely in a private database (Supabase) and
              is only used to read and respond to your message. It is never sold, shared with
              third parties, or used for marketing purposes.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold mb-3">Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              Messages submitted through the contact form are retained until they are
              manually deleted from the admin dashboard. If you would like your message
              deleted, please contact me directly.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold mb-3">Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              This website uses the following third-party services:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>
                <strong className="text-foreground">Supabase</strong> — for secure database storage of contact submissions.
                See <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-lime hover:underline">Supabase Privacy Policy</a>.
              </li>
              <li>
                <strong className="text-foreground">Google Fonts</strong> — for typography. Fonts are loaded from Google servers.
                See <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-lime hover:underline">Google Privacy Policy</a>.
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold mb-3">Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed">
              You have the right to request deletion of any personal data you have submitted
              via the contact form. To do so, please contact me at the email address listed
              on this site.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold mb-3">Get In Touch</h2>
            <p className="text-muted-foreground leading-relaxed">
              For any privacy-related questions or requests, please use the{" "}
              <Link href="/?scrollTo=contact" className="text-lime hover:underline">
                messaging form
              </Link>{" "}
              on this website, or visit the{" "}
              <Link href="/contact" className="text-lime hover:underline">
                reach out page
              </Link>
              .
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold mb-3">Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              This privacy policy may be updated from time to time to reflect changes in
              how we handle data or to comply with legal requirements. The date at the top
              of this page indicates when the policy was last revised. Continued use of
              this website after changes are posted constitutes your acceptance of the
              updated policy. We recommend reviewing this page periodically.
            </p>
          </section>
        </div>
      </div>

      <footer className="py-8 px-8 text-center border-t border-border">
        <p className="text-sm text-muted-foreground mb-3">
          © {new Date().getFullYear()} Arya Intaran.
        </p>
        <nav aria-label="Footer navigation" className="flex flex-wrap justify-center gap-4 text-sm">
          <a href="/about" className="text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors">About</a>
          <a href="/contact" className="text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors">Contact</a>
          <a href="/" className="text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors">Home</a>
        </nav>
      </footer>
    </main>
  );
}
