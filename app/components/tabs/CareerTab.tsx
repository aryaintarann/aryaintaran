import { useState } from "react";
import type { JobData, TranslationText } from "./types";

interface CareerTabProps {
    jobs: JobData[];
    t: TranslationText;
}

const formatMonthYear = (value?: string) => {
    if (!value) return "Present";
    return new Date(value).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
    });
};

const getCompanyInitials = (companyName: string) => {
    const normalized = (companyName || "").trim();
    if (!normalized) return "JR";
    const parts = normalized.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
};

const getCompanyLogoUrl = (value: unknown) => {
    if (typeof value !== "string") return "";
    return value.trim();
};

const getWorkItems = (description?: string) => {
    if (!description) return [];

    const normalized = description
        .split(/\r?\n|•/)
        .map((item) => item.trim())
        .filter(Boolean);

    return normalized.length ? normalized : [description.trim()];
};

export default function CareerTab({ jobs, t }: CareerTabProps) {
    const [openDetailIds, setOpenDetailIds] = useState<Record<string, boolean>>({});

    const toggleDetail = (id: string) => {
        setOpenDetailIds((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-text">{t.careerTitle}</h2>

            {!jobs?.length ? (
                <p className="mt-6 text-secondary">{t.careerEmpty}</p>
            ) : (
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {jobs.map((job) => {
                        const companyLogoUrl = getCompanyLogoUrl(job.logo);

                        return (
                        <article
                            key={job._id}
                            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-surface/70 p-4 [--mouse-x:50%] [--mouse-y:50%]"
                            onMouseMove={(event) => {
                                const bounds = event.currentTarget.getBoundingClientRect();
                                const x = event.clientX - bounds.left;
                                const y = event.clientY - bounds.top;
                                event.currentTarget.style.setProperty("--mouse-x", `${x}px`);
                                event.currentTarget.style.setProperty("--mouse-y", `${y}px`);
                            }}
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
                                    {companyLogoUrl ? (
                                        <img
                                            src={companyLogoUrl}
                                            alt={job.name ? `Logo ${job.name}` : "Logo perusahaan"}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        getCompanyInitials(job.name || "")
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h3 className="truncate text-lg font-semibold text-text">{job.name || "Company"}</h3>
                                    <p className="mt-1 text-sm text-secondary">{job.jobTitle || "-"}</p>
                                    <p className="mt-2 text-sm text-secondary">
                                        {formatMonthYear(job.startDate)} - {formatMonthYear(job.endDate)}
                                    </p>

                                    <div className="mt-3">
                                        <button
                                            type="button"
                                            onClick={() => toggleDetail(job._id)}
                                            className="flex items-center gap-2 text-sm text-secondary transition-colors hover:text-text"
                                            aria-expanded={!!openDetailIds[job._id]}
                                        >
                                            <svg
                                                aria-hidden="true"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${openDetailIds[job._id] ? "rotate-90" : "rotate-0"}`}
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M7.21 14.77a.75.75 0 010-1.06L10.94 10 7.21 6.29a.75.75 0 111.06-1.06l4.25 4.24a.75.75 0 010 1.06l-4.25 4.24a.75.75 0 01-1.06 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            <span>{openDetailIds[job._id] ? t.hideDetailLabel : t.educationDetailLabel}</span>
                                        </button>

                                        <div
                                            className={`grid overflow-hidden transition-all duration-300 ease-out ${
                                                openDetailIds[job._id] ? "mt-3 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"
                                            }`}
                                        >
                                            <div className="overflow-hidden">
                                                <div className="rounded-lg bg-background/40 p-4">
                                                    <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
                                                        <span aria-hidden="true">🛠️</span>
                                                        {t.careerWorkedOnTitle}
                                                    </p>

                                                    {getWorkItems(job.description).length > 0 ? (
                                                        <ul className="mt-2 space-y-1.5 text-sm text-secondary">
                                                            {getWorkItems(job.description).map((item, index) => (
                                                                <li key={`${job._id}-work-${index}`} className="flex items-start gap-2">
                                                                    <span aria-hidden="true" className="mt-0.5 text-xs text-text">
                                                                        ✓
                                                                    </span>
                                                                    <span>{item}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p className="mt-2 text-sm text-secondary">{t.careerNoWorkedOn}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
