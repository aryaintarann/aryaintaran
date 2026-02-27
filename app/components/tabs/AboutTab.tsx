import { useState } from "react";
import type { AboutProfileData, EducationData, TranslationText } from "./types";

interface AboutTabProps {
    profile?: AboutProfileData;
    education: EducationData[];
    t: TranslationText;
}

const formatMonthYear = (value?: string) => {
    if (!value) return "Present";
    return new Date(value).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
    });
};

const getSchoolInitials = (schoolName: string) => {
    const normalized = (schoolName || "").trim();
    if (!normalized) return "ED";
    const parts = normalized.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
};

const getEducationLogoUrl = (value: unknown) => {
    if (typeof value !== "string") return "";
    return value.trim();
};

export default function AboutTab({ profile, education, t }: AboutTabProps) {
    const [openDetailIds, setOpenDetailIds] = useState<Record<string, boolean>>({});

    const bioText = profile?.aboutMe || "";

    const toggleDetail = (id: string) => {
        setOpenDetailIds((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-text">{t.aboutTitle}</h2>

            <div className="prose prose-invert mt-5 max-w-none text-secondary">
                <p className="whitespace-pre-line">{bioText}</p>
            </div>

            {!!education?.length && (
                <div className="mt-8">
                    <div className="border-t border-white/10" aria-hidden="true"></div>
                    <h3 className="mt-6 text-2xl font-semibold text-text">{t.educationTitle}</h3>

                    <div className="mt-4 space-y-4">
                        {education.map((edu) => {
                            const educationLogoUrl = getEducationLogoUrl(edu.logo);
                            return (
                                <div
                                    key={edu._id}
                                    onMouseMove={(event) => {
                                        const bounds = event.currentTarget.getBoundingClientRect();
                                        const x = event.clientX - bounds.left;
                                        const y = event.clientY - bounds.top;
                                        event.currentTarget.style.setProperty("--mouse-x", `${x}px`);
                                        event.currentTarget.style.setProperty("--mouse-y", `${y}px`);
                                    }}
                                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-surface/70 p-4 [--mouse-x:50%] [--mouse-y:50%]"
                                >
                                <div
                                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                    style={{
                                        background:
                                            "radial-gradient(420px circle at var(--mouse-x) var(--mouse-y), rgb(255 255 255 / 0.15), transparent 45%)",
                                    }}
                                ></div>

                                <div className="relative z-10 flex items-start gap-4">
                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-background text-sm font-semibold text-text">
                                        {educationLogoUrl ? (
                                            <img
                                                src={educationLogoUrl}
                                                alt={edu.schoolName ? `Logo ${edu.schoolName}` : "Logo pendidikan"}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            getSchoolInitials(edu.schoolName || "")
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h3 className="truncate text-lg font-semibold text-text">{edu.schoolName}</h3>
                                        <p className="mt-1 text-sm text-secondary">
                                            {edu.degree}
                                            {edu.fieldOfStudy ? ` • ${edu.fieldOfStudy}` : ""}
                                        </p>
                                        <p className="mt-2 text-sm text-secondary">
                                            {formatMonthYear(edu.startDate)} - {formatMonthYear(edu.endDate)}
                                        </p>

                                        <div className="mt-3">
                                            <button
                                                type="button"
                                                onClick={() => toggleDetail(edu._id)}
                                                className="flex items-center gap-2 text-sm text-secondary transition-colors hover:text-text"
                                                aria-expanded={!!openDetailIds[edu._id]}
                                            >
                                                <svg
                                                    aria-hidden="true"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                    className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${openDetailIds[edu._id] ? "rotate-90" : "rotate-0"}`}
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M7.21 14.77a.75.75 0 010-1.06L10.94 10 7.21 6.29a.75.75 0 111.06-1.06l4.25 4.24a.75.75 0 010 1.06l-4.25 4.24a.75.75 0 01-1.06 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                <span>{openDetailIds[edu._id] ? t.hideDetailLabel : t.educationDetailLabel}</span>
                                            </button>

                                            <div
                                                className={`grid overflow-hidden transition-all duration-300 ease-out ${
                                                    openDetailIds[edu._id] ? "mt-3 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"
                                                }`}
                                            >
                                                <div className="overflow-hidden">
                                                    <div className="rounded-lg bg-background/40 p-4">
                                                        <div className="grid gap-4 md:grid-cols-2">
                                                            <div>
                                                                <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
                                                                    <span aria-hidden="true">☰</span>
                                                                    {t.organizationExperienceTitle}
                                                                </p>
                                                                {edu.organizationExperience && edu.organizationExperience.length > 0 ? (
                                                                    <ul className="mt-2 space-y-1.5 text-sm text-secondary">
                                                                        {edu.organizationExperience.map((item, index) => (
                                                                            <li key={`${edu._id}-org-${index}`} className="flex items-start gap-2">
                                                                                <span aria-hidden="true" className="mt-0.5 text-xs text-text">✓</span>
                                                                                <span>{item}</span>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                ) : (
                                                                    <p className="mt-2 text-sm text-secondary">{t.noOrganizationExperience}</p>
                                                                )}
                                                            </div>

                                                            <div>
                                                                <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
                                                                    <span aria-hidden="true">🚀</span>
                                                                    {t.achievementsTitle}
                                                                </p>
                                                                {edu.achievements && edu.achievements.length > 0 ? (
                                                                    <ul className="mt-2 space-y-1.5 text-sm text-secondary">
                                                                        {edu.achievements.map((item, index) => (
                                                                            <li key={`${edu._id}-ach-${index}`} className="flex items-start gap-2">
                                                                                <span aria-hidden="true" className="mt-0.5 text-xs text-text">✓</span>
                                                                                <span>{item}</span>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                ) : (
                                                                    <p className="mt-2 text-sm text-secondary">{t.noAchievements}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
