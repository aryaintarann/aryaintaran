import type { ContactData } from "./types";
import { useMemo, useState, type ReactNode } from "react";

interface ContactTabProps {
    contact: ContactData | null;
    sendEmail: string;
    title: string;
    language: "id" | "en";
}

interface LinkCardProps {
    headline: string;
    actionLabel: string;
    href?: string;
    className: string;
    icon: ReactNode;
    wide?: boolean;
}

function LinkCard({
    headline,
    actionLabel,
    href,
    className,
    icon,
    wide = false,
}: LinkCardProps) {
    const enabled = Boolean(href);

    return (
        <article
            className={`relative overflow-hidden rounded-xl border border-white/10 p-6 ${className} ${wide ? "md:col-span-2" : ""}`}
        >
            <div className="absolute -bottom-14 -left-10 h-40 w-60 rounded-full bg-white/8"></div>
            <div className="relative z-10 flex items-center justify-between gap-4">
                <div>
                    <p className="text-4xl font-semibold text-white">{headline}</p>
                    <a
                        href={href || "#"}
                        target={href ? "_blank" : undefined}
                        rel={href ? "noopener noreferrer" : undefined}
                        className={`mt-5 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-base font-medium ${enabled ? "bg-white/75 text-black hover:bg-white" : "bg-white/30 text-white/70"}`}
                        aria-disabled={!enabled}
                        onClick={(event) => {
                            if (!enabled) {
                                event.preventDefault();
                            }
                        }}
                    >
                        {actionLabel} <span aria-hidden="true">↗</span>
                    </a>
                </div>
                <div className="shrink-0 rounded-2xl border-2 border-white/40 p-2.5">{icon}</div>
            </div>
        </article>
    );
}

export default function ContactTab({ contact, sendEmail, title, language }: ContactTabProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [website, setWebsite] = useState("");
    const [sending, setSending] = useState(false);
    const [feedback, setFeedback] = useState<string | null>(null);

    const ui = useMemo(
        () =>
            language === "en"
                ? {
                      fallbackTitle: "Fallback Contact Form",
                      fallbackDesc: "If quick links fail, send me a direct message here.",
                      name: "Your Name",
                      email: "Your Email",
                      message: "Message",
                      submit: "Send Message",
                      sent: "Message sent successfully. I will get back to you soon.",
                      failed: "Failed to send message. Please try again in a moment.",
                      invalid: "Please complete all fields before sending.",
                  }
                : {
                      fallbackTitle: "Form Kontak Cadangan",
                      fallbackDesc: "Jika link cepat bermasalah, kirim pesan langsung lewat form ini.",
                      name: "Nama Anda",
                      email: "Email Anda",
                      message: "Pesan",
                      submit: "Kirim Pesan",
                      sent: "Pesan berhasil dikirim. Saya akan segera membalas.",
                      failed: "Gagal mengirim pesan. Coba lagi beberapa saat.",
                      invalid: "Lengkapi semua field sebelum mengirim.",
                  },
        [language]
    );

    const contactEmail = contact?.email;

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!name.trim() || !email.trim() || !message.trim()) {
            setFeedback(ui.invalid);
            return;
        }

        setSending(true);
        setFeedback(null);

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                    message: message.trim(),
                    website: website.trim(),
                    language,
                }),
            });

            if (!response.ok) {
                const payload = (await response.json().catch(() => null)) as { error?: string; message?: string } | null;
                setFeedback(payload?.message || ui.failed);
                return;
            }

            setName("");
            setEmail("");
            setMessage("");
            setWebsite("");
            setFeedback(ui.sent);
        } catch {
            setFeedback(ui.failed);
        } finally {
            setSending(false);
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-text">{title}</h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
                <LinkCard
                    headline="Stay in Touch"
                    actionLabel={sendEmail}
                    href={contactEmail ? `mailto:${contactEmail}` : undefined}
                    className="bg-linear-to-r from-rose-700/80 to-red-800/80"
                    wide
                    icon={
                        <svg viewBox="0 0 24 24" fill="none" className="h-12 w-12 text-white" aria-hidden="true">
                            <path d="M4 7h16v10H4z" stroke="currentColor" strokeWidth="1.8" />
                            <path d="M4 8l8 6 8-6" stroke="currentColor" strokeWidth="1.8" />
                        </svg>
                    }
                />

                <LinkCard
                    headline="Follow My Instagram"
                    actionLabel="Go to Instagram"
                    href={contact?.instagram || undefined}
                    className="bg-linear-to-br from-violet-700/85 via-fuchsia-600/85 to-orange-500/85"
                    icon={
                        <svg viewBox="0 0 24 24" fill="none" className="h-12 w-12 text-white" aria-hidden="true">
                            <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
                            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
                            <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
                        </svg>
                    }
                />

                <LinkCard
                    headline="Let&apos;s Connect"
                    actionLabel="Go to LinkedIn"
                    href={contact?.linkedin || undefined}
                    className="bg-linear-to-br from-sky-700/85 to-blue-900/85"
                    icon={
                        <svg viewBox="0 0 24 24" fill="none" className="h-12 w-12 text-white" aria-hidden="true">
                            <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8" />
                            <path d="M8.5 10v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                            <circle cx="8.5" cy="7.5" r="1" fill="currentColor" />
                            <path d="M12.5 16v-3.2c0-1.4.8-2.3 2-2.3s2 .9 2 2.3V16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                    }
                />

                <LinkCard
                    headline="Follow My TikTok"
                    actionLabel="Go to TikTok"
                    href={contact?.tiktok || undefined}
                    className="bg-linear-to-br from-zinc-700/85 via-zinc-800/85 to-black/85"
                    icon={
                        <svg viewBox="0 0 24 24" fill="none" className="h-12 w-12 text-white" aria-hidden="true">
                            <path d="M14 5v8.5a3.5 3.5 0 1 1-2.2-3.25" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
                            <path d="M14 5c1.2 1.6 2.7 2.4 4.5 2.4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
                        </svg>
                    }
                />

                <LinkCard
                    headline="My Repository"
                    actionLabel="Go to GitHub"
                    href={contact?.github || undefined}
                    className="bg-linear-to-br from-blue-950/95 to-indigo-950/95"
                    icon={
                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-12 w-12 text-white" aria-hidden="true">
                            <path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.11.82-.25.82-.57v-2.06c-3.34.73-4.03-1.4-4.03-1.4-.55-1.37-1.34-1.73-1.34-1.73-1.1-.74.08-.73.08-.73 1.21.09 1.85 1.23 1.85 1.23 1.07 1.83 2.8 1.3 3.49 1 .11-.77.42-1.3.77-1.6-2.66-.3-5.47-1.34-5.47-5.92 0-1.3.47-2.37 1.24-3.21-.12-.3-.54-1.52.12-3.16 0 0 1.01-.33 3.3 1.23a11.3 11.3 0 0 1 6 0c2.29-1.56 3.3-1.23 3.3-1.23.66 1.64.24 2.86.12 3.16.77.84 1.24 1.9 1.24 3.21 0 4.59-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22v3.28c0 .32.21.69.82.57A12 12 0 0 0 12 .5Z" />
                        </svg>
                    }
                />
            </div>

            <section className="mt-8 rounded-xl border border-white/10 bg-surface/40 p-5 md:p-6">
                <h3 className="text-xl font-semibold text-text">{ui.fallbackTitle}</h3>
                <p className="mt-1 text-sm text-secondary">{ui.fallbackDesc}</p>

                <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder={ui.name}
                        className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-text outline-none focus:border-primary/50"
                        disabled={sending}
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder={ui.email}
                        className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-text outline-none focus:border-primary/50"
                        disabled={sending}
                    />
                    <textarea
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        placeholder={ui.message}
                        rows={4}
                        className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-text outline-none focus:border-primary/50"
                        disabled={sending}
                    />

                    <input
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={website}
                        onChange={(event) => setWebsite(event.target.value)}
                        className="hidden"
                        aria-hidden="true"
                    />

                    <button
                        type="submit"
                        disabled={sending}
                        className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-60"
                    >
                        {sending ? "..." : ui.submit}
                    </button>

                    {feedback && <p className="text-sm text-secondary">{feedback}</p>}
                </form>
            </section>
        </div>
    );
}
