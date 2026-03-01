"use client";

import { useRef, useState } from "react";
import { Send, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const mailto = `mailto:hello@aryaintaran.dev?subject=Portfolio Contact from ${formData.name}&body=${formData.message}`;
        window.open(mailto);
    };

    useGSAP(() => {
        gsap.fromTo(
            ".contact-title",
            { opacity: 0, y: 120, clipPath: "inset(100% 0 0 0)" },
            {
                opacity: 1,
                y: 0,
                clipPath: "inset(0% 0 0 0)",
                duration: 1.4,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: ".contact-title",
                    start: "top 80%",
                    toggleActions: "play none none none",
                },
            }
        );

        gsap.fromTo(
            ".contact-info",
            { opacity: 0, x: -60 },
            {
                opacity: 1,
                x: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".contact-info",
                    start: "top 85%",
                    toggleActions: "play none none none",
                },
            }
        );

        gsap.fromTo(
            ".contact-form",
            { opacity: 0, x: 60 },
            {
                opacity: 1,
                x: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".contact-form",
                    start: "top 85%",
                    toggleActions: "play none none none",
                },
            }
        );
        ScrollTrigger.refresh();
    }, { scope: sectionRef, dependencies: [] });

    return (
        <section
            id="contact"
            ref={sectionRef}
            className="min-h-screen flex flex-col justify-center px-8 py-24 max-w-6xl mx-auto"
        >
            <div className="mb-8">
                <span className="section-num block mb-4">07 / GET CONNECTED</span>
            </div>

            <h2 className="display-text mb-16 contact-title">
                LET&apos;S
                <br />
                <span className="text-[#CEF441]">WORK</span>
                <br />
                TOGETHER
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="contact-info">
                    <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
                    <p className="text-muted-foreground leading-relaxed mb-8">
                        Got a project in mind? I&apos;d love to hear about it. Let&apos;s
                        build something amazing together.
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#CEF441]/10 flex items-center justify-center">
                                <Mail size={20} className="text-[#CEF441]" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Email</p>
                                <p className="font-semibold">hello@aryaintaran.dev</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#CEF441]/10 flex items-center justify-center">
                                <MapPin size={20} className="text-[#CEF441]" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Location</p>
                                <p className="font-semibold">Indonesia</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#CEF441]/10 flex items-center justify-center">
                                <Phone size={20} className="text-[#CEF441]" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Phone</p>
                                <p className="font-semibold">Available on request</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mt-2">
                            <div className="w-12 h-12 flex-shrink-0"></div>
                            <div className="flex gap-3">
                                <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center hover:border-[#CEF441] hover:bg-[#CEF441]/10 transition-all text-muted-foreground hover:text-foreground">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                                </a>
                                <a href="https://tiktok.com/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center hover:border-[#CEF441] hover:bg-[#CEF441]/10 transition-all text-muted-foreground hover:text-foreground">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.97a8.21 8.21 0 004.76 1.52V7.04a4.84 4.84 0 01-1-.35z" /></svg>
                                </a>
                                <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center hover:border-[#CEF441] hover:bg-[#CEF441]/10 transition-all text-muted-foreground hover:text-foreground">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg>
                                </a>
                                <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center hover:border-[#CEF441] hover:bg-[#CEF441]/10 transition-all text-muted-foreground hover:text-foreground">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 contact-form">
                    <div>
                        <label className="text-sm font-semibold tracking-wider uppercase text-muted-foreground mb-2 block">
                            Name
                        </label>
                        <Input
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                            placeholder="Your name"
                            className="bg-card border-border h-12 rounded-xl"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold tracking-wider uppercase text-muted-foreground mb-2 block">
                            Email
                        </label>
                        <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                            }
                            placeholder="your@email.com"
                            className="bg-card border-border h-12 rounded-xl"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold tracking-wider uppercase text-muted-foreground mb-2 block">
                            Message
                        </label>
                        <Textarea
                            value={formData.message}
                            onChange={(e) =>
                                setFormData({ ...formData, message: e.target.value })
                            }
                            placeholder="Tell me about your project..."
                            className="bg-card border-border min-h-[140px] rounded-xl resize-none"
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-[#CEF441] text-[#050505] hover:bg-[#b8d93a] h-12 rounded-xl font-bold tracking-wider uppercase"
                    >
                        Send Message <Send size={16} className="ml-2" />
                    </Button>
                </form>
            </div>
        </section>
    );
}
