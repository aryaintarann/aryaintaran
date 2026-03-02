import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin CMS | Arya Intaran",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
