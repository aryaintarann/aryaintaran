"use client";

import dynamic from "next/dynamic";

const ContactSection = dynamic(() => import("@/components/sections/ContactSection"), { ssr: false, loading: () => null });

export default function ClientContactSection() {
  return <ContactSection />;
}
