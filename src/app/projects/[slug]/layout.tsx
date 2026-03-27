import type { Metadata } from "next";
import { getContent } from "@/lib/content";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aryaintaran.dev";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = await getContent();
  const project = content.projects.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: "Project Not Found | Arya Intaran",
    };
  }

  const title = `${project.title} | Arya Intaran`;
  const description =
    project.longDescription
      ? project.longDescription.slice(0, 160)
      : project.description;
  const url = `${BASE_URL}/projects/${slug}`;
  const ogImage = project.images?.[0] ?? `/opengraph-image`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: "website",
      url,
      images: [{ url: ogImage, width: 1200, height: 630, alt: project.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default function ProjectDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
