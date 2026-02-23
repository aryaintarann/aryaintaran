"use client";

import { urlForImage } from "@/sanity/lib/image";
import { useState } from "react";
import type { ProjectData, TranslationText } from "./types";

interface AchievementTabProps {
    achievementItems: ProjectData[];
    t: TranslationText;
}

const toIssuedLabel = (value?: string) => {
    if (!value) return "Issued recently";
    const date = new Date(value);
    return `Issued on ${date.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`;
};

const getCredentialCode = (item: ProjectData) => {
    return (item._id || "").replace(/[^a-zA-Z0-9]/g, "").slice(0, 14).toUpperCase();
};

const getIssuedDate = (value?: string) => {
    if (!value) return "Not specified";
    return new Date(value).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });
};

export default function AchievementTab({ achievementItems, t }: AchievementTabProps) {
    const [activeCertificate, setActiveCertificate] = useState<ProjectData | null>(null);

    const closeModal = () => setActiveCertificate(null);

    return (
        <div>
            <h2 className="text-3xl font-bold text-text">{t.achievementTitle}</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {achievementItems.map((item) => (
                    <article
                        key={item._id}
                        className="cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-surface transition-colors hover:border-primary/35"
                        onClick={() => setActiveCertificate(item)}
                    >
                        <div className="relative h-48 w-full bg-background">
                            {item.image ? (
                                <div
                                    role="img"
                                    aria-label={item.title || "Certificate image"}
                                    className="h-full w-full bg-cover bg-center"
                                    style={{ backgroundImage: `url(${urlForImage(item.image).width(800).height(500).url()})` }}
                                ></div>
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-sm text-secondary">
                                    No preview
                                </div>
                            )}
                        </div>

                        <div className="p-4">
                            <p className="text-xs uppercase tracking-wider text-secondary">{getCredentialCode(item)}</p>
                            <h3 className="mt-2 line-clamp-2 text-2xl font-semibold text-text">{item.title}</h3>
                            <p className="mt-2 text-base text-secondary">{item.shortDescription || "Certificate / Piagam"}</p>

                            <div className="mt-3 flex flex-wrap gap-2">
                                {(item.tags || []).slice(0, 3).map((tag, index) => (
                                    <span key={`${item._id}-tag-${index}`} className="rounded-full border border-white/15 px-3 py-1 text-xs text-secondary">
                                        {tag}
                                    </span>
                                ))}
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
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 md:p-6"
                    onClick={closeModal}
                >
                    <div
                        className="relative grid max-h-[94vh] w-full max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-surface md:grid-cols-[1.6fr_1fr]"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="min-h-65 bg-background">
                            {activeCertificate.image ? (
                                <div
                                    role="img"
                                    aria-label={activeCertificate.title || "Certificate preview"}
                                    className="h-full w-full bg-contain bg-center bg-no-repeat"
                                    style={{ backgroundImage: `url(${urlForImage(activeCertificate.image).width(1600).height(1000).url()})` }}
                                ></div>
                            ) : (
                                <div className="flex h-full min-h-65 items-center justify-center text-secondary">
                                    No certificate preview
                                </div>
                            )}
                        </div>

                        <div className="relative overflow-y-auto bg-surface p-6">
                            <button
                                type="button"
                                aria-label="Close certificate detail"
                                onClick={closeModal}
                                className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-background text-text"
                            >
                                ×
                            </button>

                            <div className="pr-10">
                                <h3 className="text-3xl font-semibold text-text">{activeCertificate.title}</h3>
                                <p className="mt-2 text-xl text-secondary">
                                    {activeCertificate.shortDescription || "Certificate Issuer"}
                                </p>

                                <div className="mt-6 space-y-5 text-base">
                                    <div>
                                        <p className="text-sm uppercase tracking-wide text-secondary">Credential ID</p>
                                        <p className="mt-1 font-semibold text-text">{getCredentialCode(activeCertificate)}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm uppercase tracking-wide text-secondary">Type</p>
                                        <p className="mt-1 font-semibold text-text">{(activeCertificate.tags || ["Certificate"])[0]}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm uppercase tracking-wide text-secondary">Category</p>
                                        <p className="mt-1 font-semibold text-text">{(activeCertificate.tags || ["General"])[1] || "General"}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm uppercase tracking-wide text-secondary">Issue Date</p>
                                        <p className="mt-1 font-semibold text-text">{getIssuedDate(activeCertificate._createdAt)}</p>
                                    </div>
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
