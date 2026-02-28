"use client";

import { useEffect, useMemo, useState } from "react";
import AdminToast from "./AdminToast";

type Category = "project" | "personal-project";

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
    category: Category;
    isFeatured: boolean;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
};

type FormState = {
    title: string;
    slug: string;
    shortDescription: string;
    description: string;
    imageUrl: string;
    logoUrl: string;
    projectUrl: string;
    githubUrl: string;
    stacks: string;
    tags: string;
    isFeatured: boolean;
    isPublished: boolean;
};

const initialForm: FormState = {
    title: "",
    slug: "",
    shortDescription: "",
    description: "",
    imageUrl: "",
    logoUrl: "",
    projectUrl: "",
    githubUrl: "",
    stacks: "",
    tags: "",
    isFeatured: false,
    isPublished: true,
};

const inputClassName =
    "w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-text outline-none focus:border-primary/50";

const achievementTagRegex = /(certificate|certification|sertifikat|piagam)/i;

function toPayload(form: FormState) {
    const additionalTags = form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
        .filter((tag) => !/^personal$/i.test(tag));

    const stackTags = form.stacks
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

    const tags = ["personal", ...stackTags, ...additionalTags].filter(
        (tag, index, array) => tag && array.findIndex((item) => item.toLowerCase() === tag.toLowerCase()) === index
    );

    return {
        title: form.title,
        slug: form.slug,
        shortDescription: form.shortDescription,
        description: form.description,
        imageUrl: form.imageUrl,
        logoUrl: form.logoUrl,
        projectUrl: form.projectUrl,
        githubUrl: form.githubUrl,
        tags,
        category: "personal-project" as const,
        isFeatured: form.isFeatured,
        isPublished: form.isPublished,
    };
}

function toForm(project: ProjectRecord): FormState {
    const tags = (project.tags || []).filter((tag) => !/^personal$/i.test(tag));

    return {
        title: project.title || "",
        slug: project.slug || "",
        shortDescription: project.shortDescription || "",
        description: project.description || "",
        imageUrl: project.imageUrl || "",
        logoUrl: project.logoUrl || "",
        projectUrl: project.projectUrl || "",
        githubUrl: project.githubUrl || "",
        stacks: tags.join(", "),
        tags: "",
        isFeatured: Boolean(project.isFeatured),
        isPublished: Boolean(project.isPublished),
    };
}

export default function PersonalProjectsManager() {
    const [projects, setProjects] = useState<ProjectRecord[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [form, setForm] = useState<FormState>(initialForm);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [uploadingMedia, setUploadingMedia] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const submitLabel = useMemo(() => (editingId ? "Update Personal Project" : "Create Personal Project"), [editingId]);
    const filteredProjects = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return projects;
        return projects.filter((project) => {
            const searchable = [project.title, project.slug, project.shortDescription, ...(project.tags || [])]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();
            return searchable.includes(query);
        });
    }, [projects, searchQuery]);

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
                throw new Error(payload.error || "Failed to load personal projects");
            }

            setProjects(
                (payload.projects || []).filter((project) => {
                    const tags = project.tags || [];
                    const isAchievement = tags.some((tag) => achievementTagRegex.test(tag));
                    const isPersonal = project.category === "personal-project" || tags.some((tag) => /personal/i.test(tag));
                    return isPersonal && !isAchievement;
                })
            );
        } catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : "Failed to load personal projects");
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
            const normalizedPayload = toPayload(form);

            const response = await fetch(endpoint, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(normalizedPayload),
            });

            const payload = (await response.json()) as { error?: string; project?: ProjectRecord };
            if (!response.ok) {
                throw new Error(payload.error || "Failed to save personal project");
            }

            const savedProjectId = editingId || payload.project?.id;
            if (!savedProjectId) {
                throw new Error("Personal project tersimpan, tetapi ID project tidak ditemukan untuk auto translate.");
            }

            const sourceDocument = {
                title: form.title,
                shortDescription: form.shortDescription,
                description: form.description,
            };

            const translateResponse = await fetch("/api/translate-to-en", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: `personal-project-${savedProjectId}-id`,
                    type: "project",
                    document: sourceDocument,
                }),
            });

            if (!translateResponse.ok) {
                const translateError = (await translateResponse.json().catch(() => null)) as { error?: string } | null;
                throw new Error(translateError?.error || "Auto translate ke English untuk personal project gagal.");
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
                throw new Error("Auto translate tidak menghasilkan data English untuk personal project.");
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
                    shortDescription: form.shortDescription,
                    shortDescriptionEn: translated.shortDescription || form.shortDescription,
                    description: form.description,
                    descriptionEn: translated.description || form.description,
                    imageUrl: form.imageUrl,
                    logoUrl: form.logoUrl,
                    projectUrl: form.projectUrl,
                    githubUrl: form.githubUrl,
                    tags: normalizedPayload.tags,
                    category: normalizedPayload.category,
                    isFeatured: form.isFeatured,
                    isPublished: form.isPublished,
                }),
            });

            if (!syncEnglishResponse.ok) {
                const syncError = (await syncEnglishResponse.json().catch(() => null)) as { error?: string } | null;
                throw new Error(syncError?.error || "Gagal menyimpan hasil translate English untuk personal project.");
            }

            await loadProjects();
            resetForm();
            setSuccess(
                editingId
                    ? "Personal project berhasil diupdate. Versi English diperbarui otomatis."
                    : "Personal project berhasil dibuat. Versi English dibuat otomatis."
            );
        } catch (submitError) {
            setError(submitError instanceof Error ? submitError.message : "Failed to save personal project");
        } finally {
            setSubmitting(false);
        }
    };

    const startEdit = (project: ProjectRecord) => {
        setForm(toForm(project));
        setEditingId(project.id);
        setSuccess(null);
        setError(null);
    };

    const handleDelete = async (id: number) => {
        const isConfirmed = window.confirm("Hapus personal project ini?");
        if (!isConfirmed) {
            return;
        }

        setError(null);
        setSuccess(null);

        try {
            const response = await fetch(`/api/admin/projects/${id}`, {
                method: "DELETE",
            });
            const payload = (await response.json()) as { error?: string };
            if (!response.ok) {
                throw new Error(payload.error || "Failed to delete personal project");
            }

            if (editingId === id) {
                resetForm();
            }

            await loadProjects();
            setSuccess("Personal project berhasil dihapus.");
        } catch (deleteError) {
            setError(deleteError instanceof Error ? deleteError.message : "Failed to delete personal project");
        }
    };

    const handleProjectMediaUpload = async (field: "imageUrl" | "logoUrl", target: "project-image" | "project-logo", file: File | null) => {
        if (!file) return;

        setUploadingMedia(true);
        setError(null);
        setSuccess(null);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("target", target);

            const previousUrl = form[field];
            if (previousUrl) {
                formData.append("previousUrl", previousUrl);
            }

            const response = await fetch("/api/admin/upload-image", {
                method: "POST",
                body: formData,
            });

            const payload = (await response.json()) as { error?: string; url?: string };
            if (!response.ok || !payload.url) {
                throw new Error(payload.error || "Gagal upload media project");
            }

            setForm((current) => ({ ...current, [field]: payload.url || "" }));
            setSuccess(field === "imageUrl" ? "Gambar project berhasil diupload." : "Logo project berhasil diupload.");
        } catch (uploadError) {
            setError(uploadError instanceof Error ? uploadError.message : "Gagal upload media project");
        } finally {
            setUploadingMedia(false);
        }
    };

    return (
        <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <AdminToast message={success} type="success" />
            <AdminToast message={error} type="error" />
            <div className="rounded-2xl border border-white/10 bg-surface p-6">
                <div className="flex items-center justify-between gap-3">
                    <h2 className="text-xl font-semibold text-text">Personal Projects</h2>
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

                <input
                    className="mt-3 w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-text outline-none focus:border-primary/50"
                    placeholder="Cari personal project..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                />

                <div className="mt-4 space-y-3">
                    {loading && <p className="text-sm text-secondary">Memuat personal project...</p>}
                    {!loading && filteredProjects.length === 0 && <p className="text-sm text-secondary">Belum ada personal project.</p>}

                    {!loading &&
                        filteredProjects.map((project) => (
                            <article key={project.id} className="rounded-xl border border-white/10 bg-background p-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <p className="truncate text-base font-semibold text-text">{project.title}</p>
                                        <p className="truncate text-xs text-secondary">/{project.slug}</p>
                                        <p className="mt-1 text-xs text-secondary">
                                            Personal Project
                                            {!project.isPublished ? " • Draft" : ""}
                                        </p>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => startEdit(project)}
                                            className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-text hover:border-primary/40"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => void handleDelete(project.id)}
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
                <h2 className="text-xl font-semibold text-text">{editingId ? "Edit Personal Project" : "Create Personal Project"}</h2>

                <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
                    <input
                        className={inputClassName}
                        placeholder="Title"
                        value={form.title ?? ""}
                        onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                        required
                        disabled={submitting}
                    />
                    <input
                        className={inputClassName}
                        placeholder="Slug (opsional, auto-generate jika kosong)"
                        value={form.slug ?? ""}
                        onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
                        disabled={submitting}
                    />
                    <input
                        className={inputClassName}
                        placeholder="Short Description"
                        value={form.shortDescription ?? ""}
                        onChange={(event) => setForm((current) => ({ ...current, shortDescription: event.target.value }))}
                        disabled={submitting || uploadingMedia}
                    />
                    <textarea
                        className={inputClassName}
                        placeholder="Description"
                        rows={4}
                        value={form.description ?? ""}
                        onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                        disabled={submitting || uploadingMedia}
                    />

                    <div className="rounded-xl border border-white/10 bg-background p-3">
                        <p className="text-xs uppercase tracking-wide text-secondary">IMG Project</p>
                        {form.imageUrl ? (
                            <div className="mt-2 h-24 w-full overflow-hidden rounded-lg border border-white/20 bg-surface">
                                <img src={form.imageUrl} alt="Preview image project" className="h-full w-full object-cover" />
                            </div>
                        ) : (
                            <p className="mt-2 text-sm text-secondary">Belum ada image.</p>
                        )}

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/webp,image/gif"
                                onChange={(event) => void handleProjectMediaUpload("imageUrl", "project-image", event.target.files?.[0] || null)}
                                disabled={submitting || uploadingMedia}
                                className="text-sm text-secondary file:mr-3 file:rounded-lg file:border file:border-white/15 file:bg-surface file:px-3 file:py-1.5 file:text-xs file:text-text"
                            />
                            <span className="text-xs text-secondary">Maksimal 3MB</span>
                            {form.imageUrl ? (
                                <button
                                    type="button"
                                    className="rounded-lg border border-red-400/50 px-3 py-1.5 text-xs text-red-300"
                                    onClick={() => setForm((current) => ({ ...current, imageUrl: "" }))}
                                    disabled={submitting || uploadingMedia}
                                >
                                    Hapus Image
                                </button>
                            ) : null}
                        </div>

                        <input
                            className="mt-3 w-full rounded-lg border border-white/10 bg-surface px-3 py-2 text-sm text-text outline-none focus:border-primary/50"
                            placeholder="Atau masukkan URL image manual"
                            value={form.imageUrl ?? ""}
                            onChange={(event) => setForm((current) => ({ ...current, imageUrl: event.target.value }))}
                            disabled={submitting || uploadingMedia}
                        />
                    </div>

                    <div className="rounded-xl border border-white/10 bg-background p-3">
                        <p className="text-xs uppercase tracking-wide text-secondary">Logo Project</p>
                        {form.logoUrl ? (
                            <div className="mt-2 h-20 w-20 overflow-hidden rounded-lg border border-white/20 bg-surface">
                                <img src={form.logoUrl} alt="Preview logo project" className="h-full w-full object-cover" />
                            </div>
                        ) : (
                            <p className="mt-2 text-sm text-secondary">Belum ada logo.</p>
                        )}

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/webp,image/gif"
                                onChange={(event) => void handleProjectMediaUpload("logoUrl", "project-logo", event.target.files?.[0] || null)}
                                disabled={submitting || uploadingMedia}
                                className="text-sm text-secondary file:mr-3 file:rounded-lg file:border file:border-white/15 file:bg-surface file:px-3 file:py-1.5 file:text-xs file:text-text"
                            />
                            <span className="text-xs text-secondary">Maksimal 3MB</span>
                            {form.logoUrl ? (
                                <button
                                    type="button"
                                    className="rounded-lg border border-red-400/50 px-3 py-1.5 text-xs text-red-300"
                                    onClick={() => setForm((current) => ({ ...current, logoUrl: "" }))}
                                    disabled={submitting || uploadingMedia}
                                >
                                    Hapus Logo
                                </button>
                            ) : null}
                        </div>

                        <input
                            className="mt-3 w-full rounded-lg border border-white/10 bg-surface px-3 py-2 text-sm text-text outline-none focus:border-primary/50"
                            placeholder="Atau masukkan URL logo manual"
                            value={form.logoUrl ?? ""}
                            onChange={(event) => setForm((current) => ({ ...current, logoUrl: event.target.value }))}
                            disabled={submitting || uploadingMedia}
                        />
                    </div>

                    <input
                        className={inputClassName}
                        placeholder="Project URL"
                        value={form.projectUrl ?? ""}
                        onChange={(event) => setForm((current) => ({ ...current, projectUrl: event.target.value }))}
                        disabled={submitting || uploadingMedia}
                    />
                    <input
                        className={inputClassName}
                        placeholder="GitHub URL"
                        value={form.githubUrl ?? ""}
                        onChange={(event) => setForm((current) => ({ ...current, githubUrl: event.target.value }))}
                        disabled={submitting || uploadingMedia}
                    />
                    <input
                        className={inputClassName}
                        placeholder="Stack (pisahkan dengan koma, contoh: Next.js, TypeScript)"
                        value={form.stacks ?? ""}
                        onChange={(event) => setForm((current) => ({ ...current, stacks: event.target.value }))}
                        disabled={submitting || uploadingMedia}
                    />
                    <input
                        className={inputClassName}
                        placeholder="Tags tambahan (pisahkan dengan koma)"
                        value={form.tags ?? ""}
                        onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))}
                        disabled={submitting || uploadingMedia}
                    />

                    <label className="flex items-center gap-2 text-sm text-secondary">
                        <input
                            type="checkbox"
                            checked={Boolean(form.isFeatured)}
                            onChange={(event) => setForm((current) => ({ ...current, isFeatured: event.target.checked }))}
                            disabled={submitting || uploadingMedia}
                        />
                        Featured
                    </label>

                    <label className="flex items-center gap-2 text-sm text-secondary">
                        <input
                            type="checkbox"
                            checked={Boolean(form.isPublished)}
                            onChange={(event) => setForm((current) => ({ ...current, isPublished: event.target.checked }))}
                            disabled={submitting || uploadingMedia}
                        />
                        Published
                    </label>

                    <div className="flex items-center gap-2">
                        <button
                            type="submit"
                            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-background disabled:opacity-60"
                            disabled={submitting || uploadingMedia}
                        >
                            {uploadingMedia ? "Upload..." : submitting ? "Menyimpan..." : submitLabel}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="rounded-lg border border-white/15 px-4 py-2 text-sm text-text hover:border-white/30"
                                disabled={submitting || uploadingMedia}
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
