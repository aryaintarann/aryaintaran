"use client";

import { useEffect, useMemo, useState } from "react";
import AdminToast from "./AdminToast";

type ProjectRecord = {
    id: number;
    title: string;
    slug: string;
    shortDescription: string;
    description: string;
    imageUrl: string;
    logoUrl: string;
    projectUrl: string;
    githubUrl: string;
    tags: string[];
    category: "project" | "personal-project";
    isFeatured: boolean;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
};

type FormState = {
    title: string;
    slug: string;
    issuer: string;
    category: "sertifikat" | "badge" | "penghargaan";
    description: string;
    imageUrl: string;
    credentialUrl: string;
    tags: string;
    isPublished: boolean;
};

const inputClassName =
    "w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-text outline-none focus:border-primary/50";

const achievementTagRegex = /(certificate|certification|sertifikat|piagam)/i;

const initialForm: FormState = {
    title: "",
    slug: "",
    issuer: "",
    category: "sertifikat",
    description: "",
    imageUrl: "",
    credentialUrl: "",
    tags: "",
    isPublished: true,
};

function normalizeAchievementTags(tagsText: string, category: FormState["category"]) {
    const tags = tagsText
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

    const categoryRegex = /^(sertifikat|badge|penghargaan)$/i;
    const cleanedTags = tags.filter((tag) => !categoryRegex.test(tag) && !achievementTagRegex.test(tag));

    return ["certificate", category, ...cleanedTags];
}

function parseAchievementCategory(tags: string[]): FormState["category"] {
    const normalized = (tags || []).map((tag) => tag.toLowerCase());
    if (normalized.includes("badge")) return "badge";
    if (normalized.includes("penghargaan")) return "penghargaan";
    return "sertifikat";
}

function toAchievementForm(project: ProjectRecord): FormState {
    const category = parseAchievementCategory(project.tags || []);
    const tags = (project.tags || []).filter(
        (tag) => !achievementTagRegex.test(tag) && !/^(sertifikat|badge|penghargaan)$/i.test(tag)
    );

    return {
        title: project.title || "",
        slug: project.slug || "",
        issuer: project.shortDescription || "",
        category,
        description: project.description || "",
        imageUrl: project.imageUrl || "",
        credentialUrl: project.projectUrl || "",
        tags: tags.join(", "),
        isPublished: Boolean(project.isPublished),
    };
}

export default function AchievementManager() {
    const [allProjects, setAllProjects] = useState<ProjectRecord[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [form, setForm] = useState<FormState>(initialForm);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const submitLabel = useMemo(() => (editingId ? "Update Achievement" : "Create Achievement"), [editingId]);

    const achievements = useMemo(
        () =>
            (allProjects || []).filter((project) =>
                (project.tags || []).some((tag) => achievementTagRegex.test(tag))
            ),
        [allProjects]
    );

    const filteredAchievements = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return achievements;

        return achievements.filter((item) => {
            const searchable = [item.title, item.slug, item.shortDescription, ...(item.tags || [])]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return searchable.includes(query);
        });
    }, [achievements, searchQuery]);

    useEffect(() => {
        if (!success && !error) return;
        const timer = window.setTimeout(() => {
            setSuccess(null);
            setError(null);
        }, 2600);
        return () => window.clearTimeout(timer);
    }, [success, error]);

    const loadProjects = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/admin/projects", { cache: "no-store" });
            const payload = (await response.json()) as { error?: string; projects?: ProjectRecord[] };
            if (!response.ok) {
                throw new Error(payload.error || "Failed to load achievements");
            }
            setAllProjects(payload.projects || []);
        } catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : "Failed to load achievements");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadProjects();
    }, []);

    const resetForm = () => {
        setForm(initialForm);
        setEditingId(null);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            const endpoint = editingId ? `/api/admin/projects/${editingId}` : "/api/admin/projects";
            const method = editingId ? "PUT" : "POST";

            const response = await fetch(endpoint, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: form.title,
                    slug: form.slug,
                    shortDescription: form.issuer,
                    description: form.description,
                    imageUrl: form.imageUrl,
                    logoUrl: "",
                    projectUrl: form.credentialUrl,
                    githubUrl: "",
                    tags: normalizeAchievementTags(form.tags, form.category),
                    category: "project",
                    isFeatured: false,
                    isPublished: form.isPublished,
                }),
            });

            const payload = (await response.json()) as { error?: string; project?: ProjectRecord };
            if (!response.ok) {
                throw new Error(payload.error || "Failed to save achievement");
            }

            const savedProjectId = editingId || payload.project?.id;
            if (!savedProjectId) {
                throw new Error("Data achievement tersimpan, tetapi ID project tidak ditemukan untuk auto translate.");
            }

            const sourceDocument = {
                title: form.title,
                shortDescription: form.issuer,
                description: form.description,
            };

            const translateResponse = await fetch("/api/translate-to-en", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: `achievement-${savedProjectId}-id`,
                    type: "project",
                    document: sourceDocument,
                }),
            });

            if (!translateResponse.ok) {
                const translateError = (await translateResponse.json().catch(() => null)) as { error?: string } | null;
                throw new Error(translateError?.error || "Auto translate ke English untuk achievement gagal.");
            }

            const translatePayload = (await translateResponse.json()) as {
                translated?: {
                    title?: string;
                    shortDescription?: string;
                    description?: string;
                };
            };

            const translated = translatePayload.translated;
            if (!translated) {
                throw new Error("Auto translate tidak menghasilkan data English.");
            }

            const syncEnglishResponse = await fetch(`/api/admin/projects/${savedProjectId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: form.title,
                    titleEn: translated.title || form.title,
                    slug: form.slug,
                    shortDescription: form.issuer,
                    shortDescriptionEn: translated.shortDescription || form.issuer,
                    description: form.description,
                    descriptionEn: translated.description || form.description,
                    imageUrl: form.imageUrl,
                    logoUrl: "",
                    projectUrl: form.credentialUrl,
                    githubUrl: "",
                    tags: normalizeAchievementTags(form.tags, form.category),
                    category: "project",
                    isFeatured: false,
                    isPublished: form.isPublished,
                }),
            });

            if (!syncEnglishResponse.ok) {
                const syncError = (await syncEnglishResponse.json().catch(() => null)) as { error?: string } | null;
                throw new Error(syncError?.error || "Gagal menyimpan hasil translate English untuk achievement.");
            }

            await loadProjects();
            resetForm();
            setSuccess(
                editingId
                    ? "Achievement berhasil diupdate. Versi English diperbarui otomatis."
                    : "Achievement berhasil dibuat. Versi English dibuat otomatis."
            );
        } catch (submitError) {
            setError(submitError instanceof Error ? submitError.message : "Failed to save achievement");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (item: ProjectRecord) => {
        setForm(toAchievementForm(item));
        setEditingId(item.id);
        setSuccess(null);
        setError(null);
    };

    const handleDelete = async (id: number) => {
        const confirmed = window.confirm("Hapus achievement/certification ini?");
        if (!confirmed) return;

        setError(null);
        setSuccess(null);

        try {
            const response = await fetch(`/api/admin/projects/${id}`, {
                method: "DELETE",
            });
            const payload = (await response.json()) as { error?: string };
            if (!response.ok) {
                throw new Error(payload.error || "Failed to delete achievement");
            }

            if (editingId === id) {
                resetForm();
            }

            await loadProjects();
            setSuccess("Achievement berhasil dihapus.");
        } catch (deleteError) {
            setError(deleteError instanceof Error ? deleteError.message : "Failed to delete achievement");
        }
    };

    const handleAchievementImageUpload = async (file: File | null) => {
        if (!file) return;

        setUploadingImage(true);
        setError(null);
        setSuccess(null);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("target", "achievement");
            if (form.imageUrl) {
                formData.append("previousUrl", form.imageUrl);
            }

            const response = await fetch("/api/admin/upload-image", {
                method: "POST",
                body: formData,
            });

            const payload = (await response.json()) as { error?: string; url?: string };
            if (!response.ok || !payload.url) {
                throw new Error(payload.error || "Gagal upload gambar achievement");
            }

            setForm((current) => ({ ...current, imageUrl: payload.url || "" }));
            setSuccess("Gambar achievement berhasil diupload.");
        } catch (uploadError) {
            setError(uploadError instanceof Error ? uploadError.message : "Gagal upload gambar achievement");
        } finally {
            setUploadingImage(false);
        }
    };

    return (
        <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <AdminToast message={success} type="success" />
            <AdminToast message={error} type="error" />

            <div className="rounded-2xl border border-white/10 bg-surface p-6">
                <div className="flex items-center justify-between gap-3">
                    <h2 className="text-xl font-semibold text-text">Achievement & Certification</h2>
                    <button
                        type="button"
                        onClick={() => {
                            resetForm();
                            setError(null);
                            setSuccess(null);
                        }}
                        className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-text hover:border-white/30"
                    >
                        New
                    </button>
                </div>

                <p className="mt-2 text-sm text-secondary">
                    Data di sini otomatis muncul di tab Achievement website.
                </p>

                <input
                    className="mt-3 w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-text outline-none focus:border-primary/50"
                    placeholder="Cari achievement..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                />

                <div className="mt-4 space-y-3">
                    {loading && <p className="text-sm text-secondary">Memuat achievement...</p>}
                    {!loading && filteredAchievements.length === 0 && (
                        <p className="text-sm text-secondary">Belum ada achievement/certification.</p>
                    )}

                    {!loading &&
                        filteredAchievements.map((item) => (
                            <article key={item.id} className="rounded-xl border border-white/10 bg-background p-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <p className="truncate text-base font-semibold text-text">{item.title}</p>
                                        <p className="truncate text-xs text-secondary">/{item.slug}</p>
                                        <p className="mt-1 text-xs text-secondary">
                                            {item.shortDescription || "Issuer belum diisi"}
                                            {!item.isPublished ? " • Draft" : ""}
                                        </p>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleEdit(item)}
                                            className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-text hover:border-primary/40"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => void handleDelete(item.id)}
                                            className="rounded-lg border border-red-400/50 px-3 py-1.5 text-xs text-red-300 hover:border-red-300"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-surface p-6">
                <h2 className="text-xl font-semibold text-text">{editingId ? "Edit Achievement" : "Create Achievement"}</h2>

                <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
                    <input
                        className={inputClassName}
                        placeholder="Judul Sertifikasi / Achievement"
                        value={form.title}
                        onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                        required
                        disabled={submitting}
                    />

                    <input
                        className={inputClassName}
                        placeholder="Slug (opsional, auto-generate jika kosong)"
                        value={form.slug}
                        onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
                        disabled={submitting}
                    />

                    <input
                        className={inputClassName}
                        placeholder="Issuer (contoh: Google, Dicoding)"
                        value={form.issuer}
                        onChange={(event) => setForm((current) => ({ ...current, issuer: event.target.value }))}
                        disabled={submitting}
                    />

                    <select
                        className={inputClassName}
                        value={form.category}
                        onChange={(event) =>
                            setForm((current) => ({
                                ...current,
                                category:
                                    event.target.value === "badge"
                                        ? "badge"
                                        : event.target.value === "penghargaan"
                                          ? "penghargaan"
                                          : "sertifikat",
                            }))
                        }
                        disabled={submitting || uploadingImage}
                    >
                        <option value="sertifikat">Kategori: Sertifikat</option>
                        <option value="badge">Kategori: Badge</option>
                        <option value="penghargaan">Kategori: Penghargaan</option>
                    </select>

                    <textarea
                        className={inputClassName}
                        placeholder="Deskripsi"
                        rows={4}
                        value={form.description}
                        onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                        disabled={submitting}
                    />

                    <div className="rounded-xl border border-white/10 bg-background p-3">
                        <p className="text-xs uppercase tracking-wide text-secondary">Gambar Achievement</p>

                        {form.imageUrl ? (
                            <div className="mt-2 h-24 w-full overflow-hidden rounded-lg border border-white/20 bg-surface">
                                <img src={form.imageUrl} alt="Preview achievement" className="h-full w-full object-cover" />
                            </div>
                        ) : (
                            <p className="mt-2 text-sm text-secondary">Belum ada gambar.</p>
                        )}

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/webp,image/gif"
                                onChange={(event) => void handleAchievementImageUpload(event.target.files?.[0] || null)}
                                disabled={submitting || uploadingImage}
                                className="text-sm text-secondary file:mr-3 file:rounded-lg file:border file:border-white/15 file:bg-surface file:px-3 file:py-1.5 file:text-xs file:text-text"
                            />
                            <span className="text-xs text-secondary">Maksimal 3MB</span>
                            {form.imageUrl ? (
                                <button
                                    type="button"
                                    className="rounded-lg border border-red-400/50 px-3 py-1.5 text-xs text-red-300"
                                    onClick={() => setForm((current) => ({ ...current, imageUrl: "" }))}
                                    disabled={submitting || uploadingImage}
                                >
                                    Hapus Gambar
                                </button>
                            ) : null}
                        </div>

                        <input
                            className="mt-3 w-full rounded-lg border border-white/10 bg-surface px-3 py-2 text-sm text-text outline-none focus:border-primary/50"
                            placeholder="Atau masukkan URL gambar manual"
                            value={form.imageUrl}
                            onChange={(event) => setForm((current) => ({ ...current, imageUrl: event.target.value }))}
                            disabled={submitting || uploadingImage}
                        />
                    </div>

                    <input
                        className={inputClassName}
                        placeholder="Credential URL"
                        value={form.credentialUrl}
                        onChange={(event) => setForm((current) => ({ ...current, credentialUrl: event.target.value }))}
                        disabled={submitting}
                    />

                    <input
                        className={inputClassName}
                        placeholder="Tags (opsional, pisahkan dengan koma)"
                        value={form.tags}
                        onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))}
                        disabled={submitting}
                    />

                    <label className="flex items-center gap-2 text-sm text-secondary">
                        <input
                            type="checkbox"
                            checked={form.isPublished}
                            onChange={(event) => setForm((current) => ({ ...current, isPublished: event.target.checked }))}
                            disabled={submitting}
                        />
                        Published
                    </label>

                    <div className="flex items-center gap-2">
                        <button
                            type="submit"
                            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-background disabled:opacity-60"
                            disabled={submitting || uploadingImage}
                        >
                            {submitting ? "Menyimpan..." : submitLabel}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="rounded-lg border border-white/15 px-4 py-2 text-sm text-text hover:border-white/30"
                                disabled={submitting || uploadingImage}
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </section>
    );
}
