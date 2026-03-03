import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail, MapPin, Phone } from "lucide-react";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact | Arya Intaran",
  description:
    "Get in touch with Arya Intaran — Full Stack Developer based in Indonesia. Available for freelance projects, full-time roles, and collaborations.",
  alternates: { canonical: "https://aryaintaran.com/contact" },
  openGraph: {
    title: "Contact Arya Intaran",
    description:
      "Available for freelance projects, full-time roles, and collaborations. Based in Indonesia.",
    type: "website",
    url: "https://aryaintaran.com/contact",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Contact Arya Intaran" }],
  },
};

export default function ContactPage() {
  const content = getContent();
  const { email, location, phone } = content.contact;

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
        <div className="max-w-2xl mx-auto">

          {/* Heading */}
          <div className="mb-16">
            <span className="section-num mb-6 block">CONTACT</span>
            <h1 className="text-[clamp(3rem,8vw,7rem)] font-black leading-[0.9] tracking-[-0.03em] mb-8">
              GET IN
              <br />
              <span className="text-lime">TOUCH</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              I&apos;m available for freelance projects, full-time roles, and interesting
              collaborations. Don&apos;t hesitate to reach out &mdash; I&apos;d love to hear
              about what you&apos;re building.
            </p>
          </div>

          {/* Contact info cards */}
          <section className="space-y-4 mb-12">
            <h2 className="text-lg font-bold tracking-wider uppercase text-muted-foreground mb-6">Contact Details</h2>

            <div className="flex items-center gap-4 border border-border rounded-2xl p-5 bg-card">
              <div className="w-12 h-12 rounded-xl bg-lime/10 flex items-center justify-center shrink-0">
                <Mail size={20} className="text-lime" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-0.5">Email</p>
                <a
                  href={`mailto:${email}`}
                  className="font-semibold hover:text-lime transition-colors"
                >
                  {email}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4 border border-border rounded-2xl p-5 bg-card">
              <div className="w-12 h-12 rounded-xl bg-lime/10 flex items-center justify-center shrink-0">
                <MapPin size={20} className="text-lime" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-0.5">Location</p>
                <p className="font-semibold">{location}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 border border-border rounded-2xl p-5 bg-card">
              <div className="w-12 h-12 rounded-xl bg-lime/10 flex items-center justify-center shrink-0">
                <Phone size={20} className="text-lime" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-0.5">Phone</p>
                <p className="font-semibold">{phone}</p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-lg font-bold tracking-wider uppercase text-muted-foreground mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                {
                  q: "Are you available for freelance work?",
                  a: "Yes, I am open to freelance projects on a case-by-case basis. Whether you need a complete web application, specific feature development, or technical consulting, I am happy to discuss your needs.",
                },
                {
                  q: "What is your typical project timeline?",
                  a: "Timelines depend on the scope and complexity of the project. Simple landing pages can be delivered in one to two weeks, while complex full-stack applications may take several months. I always provide a realistic timeline estimate after understanding your requirements.",
                },
                {
                  q: "Do you work with international clients?",
                  a: "Absolutely. I work with clients remotely from around the world. Communication is primarily via email, messaging apps, or video calls, depending on your preference.",
                },
              ].map((item) => (
                <div key={item.q} className="border border-border rounded-2xl p-5 bg-card">
                  <h3 className="font-bold mb-2">{item.q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* What I can help with */}
          <section className="mb-12">
            <h2 className="text-lg font-bold tracking-wider uppercase text-muted-foreground mb-6">What I Can Help With</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "Web Development", desc: "Full-stack web applications built with React, Next.js, TypeScript, and Node.js. From landing pages to complex SaaS products." },
                { title: "IT Support", desc: "Hardware troubleshooting, network setup, software installation, system maintenance, and technical problem-solving for individuals and teams." },
                { title: "Data Entry", desc: "Accurate, efficient data entry and processing. Spreadsheet management, database population, and document digitization." },
                { title: "Freelance Projects", desc: "Open to short-term and long-term freelance engagements. Let&apos;s discuss your timeline and requirements." },
              ].map((item) => (
                <div key={item.title} className="border border-border rounded-2xl p-5 bg-card">
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: item.desc }} />
                </div>
              ))}
            </div>
          </section>

          {/* Collaboration approach */}
          <section className="mb-12">
            <h2 className="text-lg font-bold tracking-wider uppercase text-muted-foreground mb-6">How I Work</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Every engagement starts with understanding your goals. Before writing a single
                line of code, I take time to ask the right questions, map out the requirements,
                and make sure we are aligned on what success looks like. This upfront investment
                saves time and avoids costly revisions later.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                I believe in transparent, regular communication throughout a project. You will
                never be left wondering about progress. I provide status updates, flag risks
                early, and keep feedback cycles short so we can iterate quickly and confidently.
              </p>
            </div>
          </section>

          {/* Response time */}
          <section className="mb-12 border border-border rounded-2xl p-6 bg-card">
            <h2 className="text-lg font-bold mb-3">Response Time</h2>
            <p className="text-muted-foreground leading-relaxed">
              I typically respond to messages within 24 hours on business days.
              For urgent matters, please mention it in your message and I will prioritize
              getting back to you as quickly as possible.
            </p>
          </section>

          {/* CTA to contact form */}
          <div className="border border-dashed border-border rounded-2xl p-8 text-center">
            <h2 className="text-xl font-bold mb-3">Send a Message</h2>
            <p className="text-muted-foreground mb-6">
              Use the contact form to send a message directly. I read every message and
              will get back to you as soon as possible.
            </p>
            <Link
              href="/?scrollTo=contact"
              className="inline-flex items-center gap-2 bg-lime text-[#050505] font-bold py-3 px-8 rounded-xl hover:bg-lime-dark transition-colors text-sm tracking-wider uppercase"
            >
              Open Contact Form
            </Link>
          </div>

        </div>
      </div>

      <footer className="py-8 px-8 text-center border-t border-border">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Arya Intaran.{" "}
          <a href="/privacy-policy" className="underline underline-offset-2 hover:text-foreground transition-colors">
            Privacy Policy
          </a>
        </p>
      </footer>
    </main>
  );
}
