"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type SidebarSnapshot = {
  fullName: string;
  headline: string;
  profileImageUrl: string;
};

export default function PageLoading() {
  const pathname = usePathname();
  const [snapshot, setSnapshot] = useState<SidebarSnapshot | null>(null);
  const segments = pathname.split("/").filter(Boolean);
  const language = segments[0] === "en" ? "en" : "id";
  const currentMenu = segments[1] || "home";

  useEffect(() => {
    if (typeof window === "undefined") return;

    const raw = window.localStorage.getItem("portfolio-sidebar-snapshot");
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as Partial<SidebarSnapshot>;
      setSnapshot({
        fullName: parsed.fullName || "",
        headline: parsed.headline || "",
        profileImageUrl: parsed.profileImageUrl || "",
      });
    } catch {
      setSnapshot(null);
    }
  }, []);

  const menuLabels =
    language === "en"
      ? {
          home: "Home",
          about: "About",
          career: "Career",
          achievement: "Achievement & Certification",
          project: "Project",
          "personal-project": "Personal Project",
          github: "GitHub",
          contact: "Contact",
        }
      : {
          home: "Home",
          about: "About",
          career: "Karir",
          achievement: "Achievement & Certification",
          project: "Project",
          "personal-project": "Personal Project",
          github: "GitHub",
          contact: "Contact",
        };

  const menuItems = [
    "home",
    "about",
    "career",
    "achievement",
    "project",
    "personal-project",
    "github",
    "contact",
  ] as const;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 md:flex-row md:gap-0 md:px-6 lg:px-8">
      <div className="mb-2 flex items-center justify-between rounded-xl border border-white/10 bg-surface/95 px-3 py-2.5 md:hidden">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative h-11 w-11 overflow-hidden rounded-full border border-white/20 bg-background">
            {snapshot?.profileImageUrl ? (
              <img
                src={snapshot.profileImageUrl}
                alt={snapshot.fullName || "Profile"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[10px] text-secondary">No Photo</div>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center">
              <p className="truncate text-base font-semibold text-text">{snapshot?.fullName || "Portfolio"}</p>
            </div>
            <p className="truncate text-[11px] text-secondary">{snapshot?.headline || menuLabels[currentMenu as keyof typeof menuLabels] || "Portfolio"}</p>
          </div>
        </div>

        <div className="ml-3 flex shrink-0 items-center gap-2">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-primary text-background">
            <span className="text-[11px] font-bold uppercase">{language === "id" ? "ID" : "EN"}</span>
          </div>
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-background text-text">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </div>
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-background text-text">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </div>
        </div>
      </div>

      <aside className="hidden md:sticky md:top-6 md:h-[calc(100vh-3rem)] md:w-80 md:shrink-0 md:block">
        <div className="flex h-full flex-col rounded-2xl bg-surface p-5">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border border-white/20 bg-background">
              {snapshot?.profileImageUrl ? (
                <img
                  src={snapshot.profileImageUrl}
                  alt={snapshot.fullName || "Profile"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-text">
                  Profile
                </div>
              )}
            </div>
            <p className="mt-4 text-base font-semibold text-text">{snapshot?.fullName || "Your Name"}</p>
            <p className="mt-1 text-xs text-secondary">{snapshot?.headline || "Portfolio"}</p>

            <button
              type="button"
              aria-label={language === "en" ? "Settings" : "Pengaturan"}
              className="mt-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-background text-text"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.572c-.94-1.544.826-3.31 2.37-2.37.996.608 2.296.07 2.573-1.066z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>
          <div className="mb-4 border-t border-white/10" />
          <div className="space-y-2 pl-3">
            {menuItems.map((menuKey) => {
              const isActive = currentMenu === menuKey;
              return (
                <div
                  key={menuKey}
                  className={`rounded-lg border px-4 py-3 text-left text-sm ${
                    isActive
                      ? "border-primary/40 bg-primary/20 font-semibold text-primary"
                      : "border-transparent bg-background text-text"
                  }`}
                >
                  {menuLabels[menuKey]}
                </div>
              );
            })}
          </div>
        </div>
      </aside>

      <div className="mx-4 hidden w-px self-stretch bg-white/10 md:block lg:mx-6" aria-hidden="true"></div>

      <section className="min-w-0 flex-1 rounded-2xl bg-background p-5 md:p-8">
        <div className="mt-8 space-y-3">
          <div className="h-3 w-3/4 animate-pulse rounded bg-white/10" />
          <div className="h-3 w-full animate-pulse rounded bg-white/10" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-white/10" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-white/10" />
        </div>
      </section>
    </div>
  );
}
