"use client";
import React from "react";

interface ContactProps {
    email: string;
    contactData?: {
        title?: string;
        description?: string;
        buttonText?: string;
        email?: string;
        whatsapp?: string;
        linkedin?: string;
        github?: string;
        instagram?: string;
    };
}

export default function Contact({ email, contactData }: ContactProps) {
    const displayEmail = contactData?.email || email || 'hello@example.com';
    const title = contactData?.title || 'Get In Touch';
    const description = contactData?.description || "I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!";
    const buttonText = contactData?.buttonText || 'Say Hello';


    const socialLinks = [
        { name: 'Email', value: displayEmail, href: `mailto:${displayEmail}`, label: displayEmail },
        { name: 'WhatsApp', value: contactData?.whatsapp, href: `https://wa.me/${contactData?.whatsapp?.replace(/[^0-9]/g, '')}`, label: contactData?.whatsapp },
        { name: 'LinkedIn', value: contactData?.linkedin, href: contactData?.linkedin, label: 'LinkedIn Profile' },
        { name: 'GitHub', value: contactData?.github, href: contactData?.github, label: 'GitHub Profile' },
        { name: 'Instagram', value: contactData?.instagram, href: contactData?.instagram, label: 'Instagram Profile' },
    ].filter(link => link.value);

    return (
        <section id="contact" className="py-20 bg-surface/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-bold text-text mb-8">{title}</h2>
                <p className="text-secondary max-w-2xl mx-auto mb-10 text-lg">
                    {description}
                </p>

                <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
                    {socialLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            target={link.name !== 'Email' ? '_blank' : undefined}
                            rel={link.name !== 'Email' ? 'noopener noreferrer' : undefined}
                            className="flex items-center gap-2 px-6 py-3 bg-surface border border-white/5 rounded-lg text-secondary hover:text-primary hover:border-primary/50 transition-all group"
                        >
                            <span className="font-medium">{link.name}</span>
                        </a>
                    ))}
                </div>

                <a
                    href={`mailto:${displayEmail}`}
                    className="inline-block px-8 py-4 bg-primary text-background font-bold rounded-lg hover:bg-opacity-90 transition-all transform hover:scale-105"
                >
                    {buttonText}
                </a>
            </div>
        </section>
    );
}
