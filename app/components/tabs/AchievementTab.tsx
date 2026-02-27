"use client";

import { useState } from "react";
import type { ProjectData, TranslationText } from "./types";

interface AchievementTabProps {
    achievementItems: ProjectData[];
    t: TranslationText;
}

const MODAL_TRANSITION_MS = 240;

const toIssuedLabel = (value?: string) => {
    if (!value) return "Issued recently";
    const date = new Date(value);
    return `Issued on ${date.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`;
};

const getIssuedDate = (value?: string) => {
    if (!value) return "Not specified";
    return new Date(value).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });
};

const getPlainTextFromValue = (value: ProjectData["description"]): string => {
    if (!value) return "";
    if (typeof value === "string") return value.trim();
    if (!Array.isArray(value)) return "";

    return value
        .map((block) => {
            if (!block || typeof block !== "object" || !("children" in block)) return "";
            const children = (block as { children?: unknown }).children;
            if (!Array.isArray(children)) return "";

            return children
                .map((child) => {
                    if (!child || typeof child !== "object" || !("text" in child)) return "";
                    const text = (child as { text?: unknown }).text;
                    return typeof text === "string" ? text : "";
                })
                .join("");
        })
        .filter(Boolean)
        .join("\n")
        .trim();
};

const getImageUrl = (image: ProjectData["image"]) => {
    if (!image) return "";
    if (typeof image === "string") return image;
    return "";
};

const achievementCategoryConfig = {
    sertifikat: "Sertifikat",
    badge: "Badge",
    penghargaan: "Penghargaan",
} as const;

type AchievementCategoryKey = keyof typeof achievementCategoryConfig;

const getAchievementCategory = (tags?: string[]): AchievementCategoryKey | null => {
    if (!Array.isArray(tags) || tags.length === 0) return null;

    const normalized = tags.map((tag) => tag.toLowerCase().trim());
    if (normalized.includes("badge")) return "badge";
    if (normalized.includes("penghargaan")) return "penghargaan";
    if (normalized.includes("sertifikat")) return "sertifikat";
    if (normalized.includes("certificate") || normalized.includes("certification")) return "sertifikat";

    return null;
};

const getAchievementCategoryLabel = (tags?: string[]) => {
    const category = getAchievementCategory(tags);
    if (!category) return "General";
    return achievementCategoryConfig[category];
};

export default function AchievementTab({ achievementItems, t }: AchievementTabProps) {
    const [activeCertificate, setActiveCertificate] = useState<ProjectData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (item: ProjectData) => {
        setActiveCertificate(item);
        requestAnimationFrame(() => {
            setIsModalOpen(true);
        });
    };

    const closeModal = () => {
        setIsModalOpen(false);
        window.setTimeout(() => {
            setActiveCertificate(null);
        }, MODAL_TRANSITION_MS);
    };

    const certificateDescription = activeCertificate
        ? getPlainTextFromValue(activeCertificate.description) || activeCertificate.shortDescription || ""
        : "";

    const activeCertificateCategory = activeCertificate
        ? getAchievementCategoryLabel(activeCertificate.tags)
        : "General";

    return (
        <div>
            <h2 className="text-3xl font-bold text-text">{t.achievementTitle}</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {achievementItems.map((item) => (
                    <article
                        key={item._id}
                        className="cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-surface transition-colors hover:border-primary/35"
                        onClick={() => openModal(item)}
                    >
                        <div className="relative h-48 w-full bg-background">
                            {item.image ? (
                                <div
                                    role="img"
                                    aria-label={item.title || "Certificate image"}
                                    className="h-full w-full bg-cover bg-center"
                                    style={{ backgroundImage: `url(${getImageUrl(item.image)})` }}
                                ></div>
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-sm text-secondary">
                                    No preview
                                </div>
                            )}
                        </div>

                        <div className="p-4">
                            <h3 className="line-clamp-2 text-2xl font-semibold text-text">{item.title}</h3>
                            <p className="mt-2 text-base text-secondary">{item.shortDescription || "Certificate / Piagam"}</p>

                            <div className="mt-3 flex flex-wrap gap-2">
                                <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-secondary">
                                    {getAchievementCategoryLabel(item.tags)}
                                </span>
                            </div>

                            <div className="mt-4 border-t border-white/10 pt-3">
                                <p className="text-xs uppercase tracking-wide text-secondary">{toIssuedLabel(item._createdAt)}</p>
                            </div>
                        </div>
                    </article>
                ))}

                {achievementItems.length === 0 && <p className="text-secondary">{t.achievementEmpty}</p>}
            </div>

            {activeCertificate && (
                <div
                    className={`fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-3 transition-opacity duration-300 md:items-center md:p-6 no-scrollbar ${
                        isModalOpen ? "bg-black/60 backdrop-blur-sm opacity-100" : "bg-black/0 opacity-0"
                    }`}
                    role="dialog"
                    aria-modal="true"
                    aria-label={activeCertificate.title || "Certificate detail"}
                    onClick={closeModal}
                >
                    <div
                        className={`relative mt-3 w-full max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-background shadow-2xl transition-all duration-300 md:mt-0 ${
                            isModalOpen ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-95 opacity-0"
                        }`}
                        style={{ backgroundColor: "rgb(var(--color-background))" }}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="bg-background md:mr-[38%]">
                            {activeCertificate.image ? (
                                <img
                                    src={getImageUrl(activeCertificate.image)}
                                    alt={activeCertificate.title || "Certificate preview"}
                                    className="block max-h-[52vh] w-full object-contain object-top md:max-h-[92vh]"
                                />
                            ) : (
                                <div className="flex min-h-52 w-full items-center justify-center text-secondary md:min-h-[70vh]">
                                    No certificate preview
                                </div>
                            )}
                        </div>

                        <div
                            className="relative max-h-[42vh] overflow-y-auto overflow-x-hidden bg-background p-5 md:absolute md:inset-y-0 md:right-0 md:w-[38%] md:max-h-none md:p-6 no-scrollbar"
                            style={{ backgroundColor: "rgb(var(--color-background))" }}
                        >
                            <button
                                type="button"
                                aria-label="Close"
                                onClick={closeModal}
                                className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-background text-text"
                            >
                                ×
                            </button>

                            <div className="pr-10">
                                <h3 className="text-2xl font-semibold text-text md:text-3xl">{activeCertificate.title}</h3>
                                <p className="mt-2 text-base text-secondary md:text-lg">
                                    {activeCertificate.shortDescription || "Certificate Issuer"}
                                </p>

                                {certificateDescription && (
                                    <p className="mt-5 whitespace-pre-line text-base text-secondary">{certificateDescription}</p>
                                )}

                                <div className="mt-6 space-y-5 text-base">
                                    <div>
                                        <p className="text-sm uppercase tracking-wide text-secondary">Category</p>
                                        <p className="mt-1 font-semibold text-text">{activeCertificateCategory}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm uppercase tracking-wide text-secondary">Issue Date</p>
                                        <p className="mt-1 font-semibold text-text">{getIssuedDate(activeCertificate._createdAt)}</p>
                                    </div>
                                </div>

                                <div className="mt-6 flex flex-wrap items-center gap-2">
                                    <span className="rounded-full border border-white/15 px-2.5 py-1 text-[11px] text-secondary">
                                        {activeCertificateCategory}
                                    </span>
                                </div>

                                {activeCertificate.link && (
                                    <a
                                        href={activeCertificate.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-background"
                                    >
                                        Credential URL
                                        <span aria-hidden="true">→</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
