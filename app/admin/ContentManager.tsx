"use client";

import { useEffect, useMemo, useState } from "react";
import AdminToast from "./AdminToast";

type ContentLanguage = "id" | "en";

type ContentItem = {
    key: string;
    language: ContentLanguage;
    data: unknown;
};

type SectionKey = "homeProfile" | "aboutProfile" | "sidebarProfile" | "contact" | "github" | "education" | "jobs";

type EducationFormItem = {
    _id: string;
    schoolName: string;
    degree: string;
    fieldOfStudy: string;
    logo: string;
    startDate: string;
    endDate: string;
    organizationExperience: string;
    achievements: string;
};

type JobFormItem = {
    _id: string;
    name: string;
    jobTitle: string;
    logo: string;
    startDate: string;
    endDate: string;
    description: string;
};

const inputClass = "w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-text outline-none focus:border-primary/50";
const sectionKeys: SectionKey[] = ["homeProfile", "aboutProfile", "sidebarProfile", "contact", "github", "education", "jobs"];

const sectionLabel: Record<SectionKey, string> = {
    homeProfile: "Profil Utama",
    aboutProfile: "Tentang Saya",
    sidebarProfile: "Sidebar",
    contact: "Kontak",
    github: "GitHub",
    education: "Pendidikan",
    jobs: "Pengalaman Kerja",
};

const toLineArray = (value: string) =>
    value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);

const toCommaArray = (value: string) =>
    value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const normalizeString = (value: unknown) => String(value || "").trim();
const normalizeImageUrl = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const normalizeLineArray = (value: unknown) => {
    if (Array.isArray(value)) {
        return value.map((item) => normalizeString(item)).filter(Boolean);
    }
    if (typeof value === "string") {
        return toLineArray(value);
    }
    return [] as string[];
};

function normalizeSectionData(section: SectionKey, data: unknown) {
    const source = (data as Record<string, unknown>) || {};

    if (section === "homeProfile") {
        return {
            fullName: normalizeString(source.fullName),
            summary: normalizeString(source.summary),
            hardSkills: toCommaArray(normalizeString(source.hardSkills || (Array.isArray(source.hardSkills) ? (source.hardSkills as string[]).join(",") : ""))),
            softSkills: toCommaArray(normalizeString(source.softSkills || (Array.isArray(source.softSkills) ? (source.softSkills as string[]).join(",") : ""))),
        };
    }

    if (section === "aboutProfile") {
        return { aboutMe: normalizeString(source.aboutMe) };
    }

    if (section === "sidebarProfile") {
        return {
            profileImage: normalizeImageUrl(source.profileImage),
            headline: normalizeString(source.headline),
        };
    }

    if (section === "contact") {
        return {
            email: normalizeString(source.email),
            whatsapp: normalizeString(source.whatsapp),
            linkedin: normalizeString(source.linkedin),
            instagram: normalizeString(source.instagram),
            tiktok: normalizeString(source.tiktok),
            github: normalizeString(source.github),
        };
    }

    if (section === "github") {
        const limit = Number(source.repositoriesLimit || 12);
        return {
            profileUrl: normalizeString(source.profileUrl),
            username: normalizeString(source.username),
            description: normalizeString(source.description),
            contributionsTitle: normalizeString(source.contributionsTitle),
            repositoriesTitle: normalizeString(source.repositoriesTitle),
            showContributions: source.showContributions !== false,
            showRepositories: source.showRepositories !== false,
            repositoriesLimit: Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 12,
        };
    }

    if (section === "education") {
        const rows = Array.isArray(data) ? data : [];
        return rows
            .map((item, index) => {
                const row = (item as Record<string, unknown>) || {};
                return {
                    _id: normalizeString(row._id) || `edu-${index + 1}`,
                    schoolName: normalizeString(row.schoolName),
                    degree: normalizeString(row.degree),
                    fieldOfStudy: normalizeString(row.fieldOfStudy),
                    logo: normalizeImageUrl(row.logo),
                    startDate: normalizeString(row.startDate),
                    endDate: normalizeString(row.endDate),
                    organizationExperience: normalizeLineArray(row.organizationExperience),
                    achievements: normalizeLineArray(row.achievements),
                };
            })
            .filter(
                (item) =>
                    item.schoolName ||
                    item.degree ||
                    item.fieldOfStudy ||
                        item.logo ||
                    item.startDate ||
                    item.endDate ||
                    item.organizationExperience.length > 0 ||
                    item.achievements.length > 0
            );
    }

    const rows = Array.isArray(data) ? data : [];
    return rows
        .map((item, index) => {
            const row = (item as Record<string, unknown>) || {};
            return {
                _id: normalizeString(row._id) || `job-${index + 1}`,
                name: normalizeString(row.name),
                jobTitle: normalizeString(row.jobTitle),
                logo: normalizeImageUrl(row.logo),
                startDate: normalizeString(row.startDate),
                endDate: normalizeString(row.endDate),
                description: normalizeString(row.description),
            };
        })
        .filter((item) => item.name || item.jobTitle || item.logo || item.startDate || item.endDate || item.description);
}

const emptyEducationItem = (): EducationFormItem => ({
    _id: `edu-${uid()}`,
    schoolName: "",
    degree: "",
    fieldOfStudy: "",
    logo: "",
    startDate: "",
    endDate: "",
    organizationExperience: "",
    achievements: "",
});

const emptyJobItem = (): JobFormItem => ({
    _id: `job-${uid()}`,
    name: "",
    jobTitle: "",
    logo: "",
    startDate: "",
    endDate: "",
    description: "",
});

export default function ContentManager() {
    const [language, setLanguage] = useState<ContentLanguage>("id");
    const [items, setItems] = useState<ContentItem[]>([]);
    const [activeSection, setActiveSection] = useState<SectionKey>("homeProfile");

    const [homeProfile, setHomeProfile] = useState({
        fullName: "",
        summary: "",
        hardSkills: "",
        softSkills: "",
    });
    const [aboutProfile, setAboutProfile] = useState({ aboutMe: "" });
    const [sidebarProfile, setSidebarProfile] = useState({ profileImage: "", headline: "" });
    const [contact, setContact] = useState({
        email: "",
        whatsapp: "",
        linkedin: "",
        instagram: "",
        tiktok: "",
        github: "",
    });
    const [github, setGithub] = useState({
        profileUrl: "",
        username: "",
        description: "",
        contributionsTitle: "",
        repositoriesTitle: "",
        showContributions: true,
        showRepositories: true,
        repositoriesLimit: 12,
    });
    const [education, setEducation] = useState<EducationFormItem[]>([]);
    const [jobs, setJobs] = useState<JobFormItem[]>([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [savedSnapshot, setSavedSnapshot] = useState("{}");

    const itemByKey = useMemo(() => {
        const map = new Map<string, unknown>();
        for (const item of items) {
            map.set(item.key, item.data);
        }
        return map;
    }, [items]);

    const hydrateFormStates = (nextItems: ContentItem[]) => {
        const getData = (key: SectionKey) => nextItems.find((item) => item.key === key)?.data;

        const home = normalizeSectionData("homeProfile", getData("homeProfile")) as {
            fullName: string;
            summary: string;
            hardSkills: string[];
            softSkills: string[];
        };
        setHomeProfile({
            fullName: home.fullName,
            summary: home.summary,
            hardSkills: home.hardSkills.join(", "),
            softSkills: home.softSkills.join(", "),
        });

        const about = normalizeSectionData("aboutProfile", getData("aboutProfile")) as { aboutMe: string };
        setAboutProfile({ aboutMe: about.aboutMe });

        const sidebar = normalizeSectionData("sidebarProfile", getData("sidebarProfile")) as {
            profileImage: string;
            headline: string;
        };
        setSidebarProfile({
            profileImage: sidebar.profileImage,
            headline: sidebar.headline,
        });

        const contactData = normalizeSectionData("contact", getData("contact")) as {
            email: string;
            whatsapp: string;
            linkedin: string;
            instagram: string;
            tiktok: string;
            github: string;
        };
        setContact({
            email: contactData.email,
            whatsapp: contactData.whatsapp,
            linkedin: contactData.linkedin,
            instagram: contactData.instagram,
            tiktok: contactData.tiktok,
            github: contactData.github,
        });

        const githubData = normalizeSectionData("github", getData("github")) as {
            profileUrl: string;
            username: string;
            description: string;
            contributionsTitle: string;
            repositoriesTitle: string;
            showContributions: boolean;
            showRepositories: boolean;
            repositoriesLimit: number;
        };
        setGithub({
            profileUrl: githubData.profileUrl,
            username: githubData.username,
            description: githubData.description,
            contributionsTitle: githubData.contributionsTitle,
            repositoriesTitle: githubData.repositoriesTitle,
            showContributions: githubData.showContributions,
            showRepositories: githubData.showRepositories,
            repositoriesLimit: githubData.repositoriesLimit,
        });

        const educationData = normalizeSectionData("education", getData("education")) as Array<{
            _id: string;
            schoolName: string;
            degree: string;
            fieldOfStudy: string;
            logo: string;
            startDate: string;
            endDate: string;
            organizationExperience: string[];
            achievements: string[];
        }>;
        setEducation(
            educationData.length > 0
                ? educationData.map((item) => ({
                      _id: item._id,
                      schoolName: item.schoolName,
                      degree: item.degree,
                      fieldOfStudy: item.fieldOfStudy,
                      logo: item.logo,
                      startDate: item.startDate,
                      endDate: item.endDate,
                      organizationExperience: item.organizationExperience.join("\n"),
                      achievements: item.achievements.join("\n"),
                  }))
                : [emptyEducationItem()]
        );

        const jobsData = normalizeSectionData("jobs", getData("jobs")) as Array<{
            _id: string;
            name: string;
            jobTitle: string;
            logo: string;
            startDate: string;
            endDate: string;
            description: string;
        }>;
        setJobs(
            jobsData.length > 0
                ? jobsData.map((item) => ({
                      _id: item._id,
                      name: item.name,
                      jobTitle: item.jobTitle,
                      logo: item.logo,
                      startDate: item.startDate,
                      endDate: item.endDate,
                      description: item.description,
                  }))
                : [emptyJobItem()]
        );

        const activeItemData = nextItems.find((item) => item.key === activeSection)?.data;
        setSavedSnapshot(JSON.stringify(normalizeSectionData(activeSection, activeItemData)));
    };

    const getSectionPayload = (section: SectionKey): unknown => {
        if (section === "homeProfile") {
            return normalizeSectionData(section, {
                fullName: homeProfile.fullName,
                summary: homeProfile.summary,
                hardSkills: toCommaArray(homeProfile.hardSkills),
                softSkills: toCommaArray(homeProfile.softSkills),
            });
        }
        if (section === "aboutProfile") {
            return normalizeSectionData(section, { aboutMe: aboutProfile.aboutMe });
        }
        if (section === "sidebarProfile") {
            return normalizeSectionData(section, { profileImage: sidebarProfile.profileImage, headline: sidebarProfile.headline });
        }
        if (section === "contact") {
            return normalizeSectionData(section, contact);
        }
        if (section === "github") {
            return normalizeSectionData(section, github);
        }
        if (section === "education") {
            return normalizeSectionData(section, education.map((item) => ({
                _id: item._id,
                schoolName: item.schoolName,
                degree: item.degree,
                fieldOfStudy: item.fieldOfStudy,
                logo: item.logo,
                startDate: item.startDate,
                endDate: item.endDate,
                organizationExperience: toLineArray(item.organizationExperience),
                achievements: toLineArray(item.achievements),
            })));
        }
        return normalizeSectionData(section, jobs.map((item) => ({
            _id: item._id,
            name: item.name,
            jobTitle: item.jobTitle,
            logo: item.logo,
            startDate: item.startDate,
            endDate: item.endDate,
            description: item.description,
        })));
    };

    const isDirty = useMemo(() => {
        try {
            return JSON.stringify(getSectionPayload(activeSection)) !== savedSnapshot;
        } catch {
            return false;
        }
    }, [
        activeSection,
        homeProfile,
        aboutProfile,
        sidebarProfile,
        contact,
        github,
        education,
        jobs,
        savedSnapshot,
    ]);

    useEffect(() => {
        const onBeforeUnload = (event: BeforeUnloadEvent) => {
            if (!isDirty) return;
            event.preventDefault();
            event.returnValue = "";
        };

        window.addEventListener("beforeunload", onBeforeUnload);
        return () => window.removeEventListener("beforeunload", onBeforeUnload);
    }, [isDirty]);

    useEffect(() => {
        if (!success && !error) return;
        const timer = window.setTimeout(() => {
            setSuccess(null);
            setError(null);
        }, 2600);
        return () => window.clearTimeout(timer);
    }, [success, error]);

    const loadContent = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/admin/content?language=${language}`, { cache: "no-store" });
            const payload = (await response.json()) as {
                error?: string;
                items?: ContentItem[];
            };

            if (!response.ok) {
                throw new Error(payload.error || "Gagal memuat konten");
            }

            const fetchedItems = payload.items || [];
            setItems(fetchedItems);
            hydrateFormStates(fetchedItems);
        } catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : "Gagal memuat konten");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadContent();
    }, [language]);

    const saveSection = async (key: SectionKey, data: unknown) => {
        setSaving(true);
        setError(null);
        setSuccess(null);
        const normalizedData = normalizeSectionData(key, data);
        let englishAutoUpdated = false;

        try {
            const response = await fetch("/api/admin/content", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    language,
                    key,
                    data: normalizedData,
                }),
            });

            const payload = (await response.json()) as { error?: string };
            if (!response.ok) {
                throw new Error(payload.error || "Gagal menyimpan konten");
            }

            if (language === "id") {
                const translateResponse = await fetch("/api/translate-to-en", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id: `${key}-id`,
                        type: key,
                        document: normalizedData,
                    }),
                });

                if (translateResponse.ok) {
                    const translatePayload = (await translateResponse.json()) as {
                        translated?: unknown;
                    };

                    if (translatePayload.translated) {
                        const upsertEnResponse = await fetch("/api/admin/content", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                language: "en",
                                key,
                                data: translatePayload.translated,
                            }),
                        });

                        if (upsertEnResponse.ok) {
                            englishAutoUpdated = true;
                        } else {
                            const upsertEnPayload = (await upsertEnResponse.json().catch(() => null)) as { error?: string } | null;
                            throw new Error(upsertEnPayload?.error || "Gagal menyimpan versi English otomatis");
                        }
                    }
                } else {
                    const translateErrorPayload = (await translateResponse.json().catch(() => null)) as { error?: string } | null;
                    throw new Error(translateErrorPayload?.error || "Auto translate ke English gagal");
                }
            }

            await loadContent();
            setSuccess(
                language === "id" && englishAutoUpdated
                    ? `${sectionLabel[key]} berhasil disimpan. Versi English diperbarui otomatis.`
                    : `${sectionLabel[key]} berhasil disimpan.`
            );
            setSavedSnapshot(JSON.stringify(normalizedData));
        } catch (saveError) {
            setError(saveError instanceof Error ? saveError.message : "Gagal menyimpan konten");
        } finally {
            setSaving(false);
        }
    };

    const handleProfileImageUpload = async (file: File | null) => {
        if (!file) return;

        setUploadingImage(true);
        setError(null);
        setSuccess(null);

        try {
            const formData = new FormData();
            formData.append("file", file);
            if (sidebarProfile.profileImage) {
                formData.append("previousUrl", sidebarProfile.profileImage);
            }

            const response = await fetch("/api/admin/upload-image", {
                method: "POST",
                body: formData,
            });

            const payload = (await response.json()) as { error?: string; url?: string };
            if (!response.ok || !payload.url) {
                throw new Error(payload.error || "Gagal upload gambar");
            }

            setSidebarProfile((prev) => ({ ...prev, profileImage: payload.url || "" }));
            setSuccess("Foto profil berhasil diupload.");
        } catch (uploadError) {
            setError(uploadError instanceof Error ? uploadError.message : "Gagal upload gambar");
        } finally {
            setUploadingImage(false);
        }
    };

    const handleEducationLogoUpload = async (educationId: string, file: File | null) => {
        if (!file) return;

        setUploadingImage(true);
        setError(null);
        setSuccess(null);

        try {
            const target = education.find((item) => item._id === educationId);
            if (!target) {
                throw new Error("Data pendidikan tidak ditemukan");
            }

            const formData = new FormData();
            formData.append("file", file);
            formData.append("target", "education");
            if (target.logo) {
                formData.append("previousUrl", target.logo);
            }

            const response = await fetch("/api/admin/upload-image", {
                method: "POST",
                body: formData,
            });

            const payload = (await response.json()) as { error?: string; url?: string };
            if (!response.ok || !payload.url) {
                throw new Error(payload.error || "Gagal upload logo pendidikan");
            }

            setEducation((prev) =>
                prev.map((item) => (item._id === educationId ? { ...item, logo: payload.url || "" } : item))
            );
            setSuccess("Logo pendidikan berhasil diupload.");
        } catch (uploadError) {
            setError(uploadError instanceof Error ? uploadError.message : "Gagal upload logo pendidikan");
        } finally {
            setUploadingImage(false);
        }
    };

    const handleJobLogoUpload = async (jobId: string, file: File | null) => {
        if (!file) return;

        setUploadingImage(true);
        setError(null);
        setSuccess(null);

        try {
            const target = jobs.find((item) => item._id === jobId);
            if (!target) {
                throw new Error("Data karier tidak ditemukan");
            }

            const formData = new FormData();
            formData.append("file", file);
            formData.append("target", "career");
            if (target.logo) {
                formData.append("previousUrl", target.logo);
            }

            const response = await fetch("/api/admin/upload-image", {
                method: "POST",
                body: formData,
            });

            const payload = (await response.json()) as { error?: string; url?: string };
            if (!response.ok || !payload.url) {
                throw new Error(payload.error || "Gagal upload logo karier");
            }

            setJobs((prev) =>
                prev.map((item) => (item._id === jobId ? { ...item, logo: payload.url || "" } : item))
            );
            setSuccess("Logo karier berhasil diupload.");
        } catch (uploadError) {
            setError(uploadError instanceof Error ? uploadError.message : "Gagal upload logo karier");
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSectionSwitch = (nextSection: SectionKey) => {
        if (nextSection === activeSection) return;
        if (isDirty) {
            const confirmed = window.confirm("Perubahan belum disimpan. Pindah bagian tanpa menyimpan?");
            if (!confirmed) return;
        }
        setActiveSection(nextSection);
        setError(null);
        setSuccess(null);
        const nextData = normalizeSectionData(nextSection, itemByKey.get(nextSection));
        setSavedSnapshot(JSON.stringify(nextData));
    };

    const handleLanguageChange = (nextLanguage: ContentLanguage) => {
        if (nextLanguage === language) return;
        if (isDirty) {
            const confirmed = window.confirm("Perubahan belum disimpan. Ganti bahasa tanpa menyimpan?");
            if (!confirmed) return;
        }
        setLanguage(nextLanguage);
    };

    const resetSection = async (key: SectionKey) => {
        const confirmed = window.confirm(`Reset data ${sectionLabel[key]} (${language})?`);
        if (!confirmed) return;

        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch("/api/admin/content", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ language, key }),
            });

            const payload = (await response.json()) as { error?: string };
            if (!response.ok) {
                throw new Error(payload.error || "Gagal reset konten");
            }

            await loadContent();
            setSuccess(`${sectionLabel[key]} berhasil direset.`);
        } catch (deleteError) {
            setError(deleteError instanceof Error ? deleteError.message : "Gagal reset konten");
        } finally {
            setSaving(false);
        }
    };

    const renderSectionForm = () => {
        if (activeSection === "homeProfile") {
            return (
                <div className="space-y-3">
                    <input className={inputClass} placeholder="Nama Lengkap" value={homeProfile.fullName} onChange={(e) => setHomeProfile((s) => ({ ...s, fullName: e.target.value }))} disabled={saving} />
                    <textarea className={inputClass} rows={4} placeholder="Ringkasan Profil" value={homeProfile.summary} onChange={(e) => setHomeProfile((s) => ({ ...s, summary: e.target.value }))} disabled={saving} />
                    <input className={inputClass} placeholder="Hard Skills (pisahkan dengan koma)" value={homeProfile.hardSkills} onChange={(e) => setHomeProfile((s) => ({ ...s, hardSkills: e.target.value }))} disabled={saving} />
                    <input className={inputClass} placeholder="Soft Skills (pisahkan dengan koma)" value={homeProfile.softSkills} onChange={(e) => setHomeProfile((s) => ({ ...s, softSkills: e.target.value }))} disabled={saving} />
                    <div className="flex items-center gap-2">
                        <button type="button" onClick={() => void saveSection("homeProfile", { fullName: homeProfile.fullName, summary: homeProfile.summary, hardSkills: toCommaArray(homeProfile.hardSkills), softSkills: toCommaArray(homeProfile.softSkills) })} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-background" disabled={saving}>Simpan</button>
                        <button type="button" onClick={() => void resetSection("homeProfile")} className="rounded-lg border border-red-400/50 px-4 py-2 text-sm text-red-300" disabled={saving}>Reset</button>
                    </div>
                </div>
            );
        }

        if (activeSection === "aboutProfile") {
            return (
                <div className="space-y-3">
                    <textarea className={inputClass} rows={8} placeholder="Isi Tentang Saya" value={aboutProfile.aboutMe} onChange={(e) => setAboutProfile({ aboutMe: e.target.value })} disabled={saving} />
                    <div className="flex items-center gap-2">
                        <button type="button" onClick={() => void saveSection("aboutProfile", { aboutMe: aboutProfile.aboutMe })} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-background" disabled={saving}>Simpan</button>
                        <button type="button" onClick={() => void resetSection("aboutProfile")} className="rounded-lg border border-red-400/50 px-4 py-2 text-sm text-red-300" disabled={saving}>Reset</button>
                    </div>
                </div>
            );
        }

        if (activeSection === "sidebarProfile") {
            return (
                <div className="space-y-3">
                    <div className="rounded-xl border border-white/10 bg-background p-3">
                        <p className="text-xs uppercase tracking-wide text-secondary">Foto Profil</p>

                        {sidebarProfile.profileImage ? (
                            <div className="mt-2 h-24 w-24 overflow-hidden rounded-full border border-white/20">
                                <img src={sidebarProfile.profileImage} alt="Preview foto profil" className="h-full w-full object-cover" />
                            </div>
                        ) : (
                            <p className="mt-2 text-sm text-secondary">Belum ada foto profil.</p>
                        )}

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/webp,image/gif"
                                onChange={(event) => void handleProfileImageUpload(event.target.files?.[0] || null)}
                                disabled={saving || uploadingImage}
                                className="text-sm text-secondary file:mr-3 file:rounded-lg file:border file:border-white/15 file:bg-surface file:px-3 file:py-1.5 file:text-xs file:text-text"
                            />
                            <span className="text-xs text-secondary">Maksimal 3MB</span>
                        </div>

                        <input
                            className="mt-3 w-full rounded-lg border border-white/10 bg-surface px-3 py-2 text-sm text-text outline-none focus:border-primary/50"
                            placeholder="Atau masukkan URL foto manual"
                            value={sidebarProfile.profileImage}
                            onChange={(e) => setSidebarProfile((s) => ({ ...s, profileImage: e.target.value }))}
                            disabled={saving || uploadingImage}
                        />
                    </div>

                    <input className={inputClass} placeholder="Headline (contoh: Web Developer)" value={sidebarProfile.headline} onChange={(e) => setSidebarProfile((s) => ({ ...s, headline: e.target.value }))} disabled={saving || uploadingImage} />
                    <div className="flex items-center gap-2">
                        <button type="button" onClick={() => void saveSection("sidebarProfile", { profileImage: sidebarProfile.profileImage, headline: sidebarProfile.headline })} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-background" disabled={saving || uploadingImage}>{uploadingImage ? "Upload..." : "Simpan"}</button>
                        <button type="button" onClick={() => void resetSection("sidebarProfile")} className="rounded-lg border border-red-400/50 px-4 py-2 text-sm text-red-300" disabled={saving || uploadingImage}>Reset</button>
                    </div>
                </div>
            );
        }

        if (activeSection === "contact") {
            return (
                <div className="grid gap-3 md:grid-cols-2">
                    <input className={inputClass} placeholder="Email" value={contact.email} onChange={(e) => setContact((s) => ({ ...s, email: e.target.value }))} disabled={saving} />
                    <input className={inputClass} placeholder="WhatsApp" value={contact.whatsapp} onChange={(e) => setContact((s) => ({ ...s, whatsapp: e.target.value }))} disabled={saving} />
                    <input className={inputClass} placeholder="LinkedIn URL" value={contact.linkedin} onChange={(e) => setContact((s) => ({ ...s, linkedin: e.target.value }))} disabled={saving} />
                    <input className={inputClass} placeholder="Instagram URL" value={contact.instagram} onChange={(e) => setContact((s) => ({ ...s, instagram: e.target.value }))} disabled={saving} />
                    <input className={inputClass} placeholder="TikTok URL" value={contact.tiktok} onChange={(e) => setContact((s) => ({ ...s, tiktok: e.target.value }))} disabled={saving} />
                    <input className={inputClass} placeholder="GitHub URL" value={contact.github} onChange={(e) => setContact((s) => ({ ...s, github: e.target.value }))} disabled={saving} />
                    <div className="md:col-span-2 flex items-center gap-2">
                        <button type="button" onClick={() => void saveSection("contact", contact)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-background" disabled={saving}>Simpan</button>
                        <button type="button" onClick={() => void resetSection("contact")} className="rounded-lg border border-red-400/50 px-4 py-2 text-sm text-red-300" disabled={saving}>Reset</button>
                    </div>
                </div>
            );
        }

        if (activeSection === "github") {
            return (
                <div className="space-y-3">
                    <input className={inputClass} placeholder="GitHub Profile URL" value={github.profileUrl} onChange={(e) => setGithub((s) => ({ ...s, profileUrl: e.target.value }))} disabled={saving} />
                    <input className={inputClass} placeholder="Username GitHub" value={github.username} onChange={(e) => setGithub((s) => ({ ...s, username: e.target.value }))} disabled={saving} />
                    <textarea className={inputClass} rows={3} placeholder="Deskripsi" value={github.description} onChange={(e) => setGithub((s) => ({ ...s, description: e.target.value }))} disabled={saving} />
                    <input className={inputClass} placeholder="Judul Contributions" value={github.contributionsTitle} onChange={(e) => setGithub((s) => ({ ...s, contributionsTitle: e.target.value }))} disabled={saving} />
                    <input className={inputClass} placeholder="Judul Repositories" value={github.repositoriesTitle} onChange={(e) => setGithub((s) => ({ ...s, repositoriesTitle: e.target.value }))} disabled={saving} />
                    <input className={inputClass} type="number" placeholder="Maksimal Repository" value={github.repositoriesLimit} onChange={(e) => setGithub((s) => ({ ...s, repositoriesLimit: Number(e.target.value || 12) }))} disabled={saving} />
                    <label className="flex items-center gap-2 text-sm text-secondary"><input type="checkbox" checked={github.showContributions} onChange={(e) => setGithub((s) => ({ ...s, showContributions: e.target.checked }))} />Tampilkan Contributions</label>
                    <label className="flex items-center gap-2 text-sm text-secondary"><input type="checkbox" checked={github.showRepositories} onChange={(e) => setGithub((s) => ({ ...s, showRepositories: e.target.checked }))} />Tampilkan Repositories</label>
                    <div className="flex items-center gap-2">
                        <button type="button" onClick={() => void saveSection("github", github)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-background" disabled={saving}>Simpan</button>
                        <button type="button" onClick={() => void resetSection("github")} className="rounded-lg border border-red-400/50 px-4 py-2 text-sm text-red-300" disabled={saving}>Reset</button>
                    </div>
                </div>
            );
        }

        if (activeSection === "education") {
            return (
                <div className="space-y-4">
                    {education.map((item, index) => (
                        <div key={item._id} className="rounded-xl border border-white/10 bg-background p-4 space-y-2">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold text-text">Data Pendidikan #{index + 1}</p>
                                <button type="button" className="text-xs text-red-300" onClick={() => setEducation((prev) => prev.filter((entry) => entry._id !== item._id))}>Hapus</button>
                            </div>
                            <input className={inputClass} placeholder="Nama Sekolah / Kampus" value={item.schoolName} onChange={(e) => setEducation((prev) => prev.map((entry) => entry._id === item._id ? { ...entry, schoolName: e.target.value } : entry))} />
                            <input className={inputClass} placeholder="Gelar" value={item.degree} onChange={(e) => setEducation((prev) => prev.map((entry) => entry._id === item._id ? { ...entry, degree: e.target.value } : entry))} />
                            <input className={inputClass} placeholder="Jurusan" value={item.fieldOfStudy} onChange={(e) => setEducation((prev) => prev.map((entry) => entry._id === item._id ? { ...entry, fieldOfStudy: e.target.value } : entry))} />
                            <div className="rounded-xl border border-white/10 bg-surface p-3">
                                <p className="text-xs uppercase tracking-wide text-secondary">Logo Pendidikan</p>
                                {item.logo ? (
                                    <div className="mt-2 h-16 w-16 overflow-hidden rounded-xl border border-white/20 bg-background">
                                        <img src={item.logo} alt={item.schoolName ? `Logo ${item.schoolName}` : "Logo pendidikan"} className="h-full w-full object-cover" />
                                    </div>
                                ) : (
                                    <p className="mt-2 text-sm text-secondary">Belum ada logo.</p>
                                )}

                                <div className="mt-3 flex flex-wrap items-center gap-2">
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp,image/gif"
                                        onChange={(event) => void handleEducationLogoUpload(item._id, event.target.files?.[0] || null)}
                                        disabled={saving || uploadingImage}
                                        className="text-sm text-secondary file:mr-3 file:rounded-lg file:border file:border-white/15 file:bg-surface file:px-3 file:py-1.5 file:text-xs file:text-text"
                                    />
                                    <span className="text-xs text-secondary">Maksimal 3MB</span>
                                    {item.logo ? (
                                        <button
                                            type="button"
                                            className="rounded-lg border border-red-400/50 px-3 py-1.5 text-xs text-red-300"
                                            onClick={() =>
                                                setEducation((prev) =>
                                                    prev.map((entry) =>
                                                        entry._id === item._id ? { ...entry, logo: "" } : entry
                                                    )
                                                )
                                            }
                                            disabled={saving || uploadingImage}
                                        >
                                            Hapus Logo
                                        </button>
                                    ) : null}
                                </div>

                                <input
                                    className="mt-3 w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-text outline-none focus:border-primary/50"
                                    placeholder="Atau masukkan URL logo manual"
                                    value={item.logo}
                                    onChange={(e) => setEducation((prev) => prev.map((entry) => entry._id === item._id ? { ...entry, logo: e.target.value } : entry))}
                                    disabled={saving || uploadingImage}
                                />
                            </div>
                            <div className="grid gap-2 md:grid-cols-2">
                                <input className={inputClass} type="date" value={item.startDate} onChange={(e) => setEducation((prev) => prev.map((entry) => entry._id === item._id ? { ...entry, startDate: e.target.value } : entry))} />
                                <input className={inputClass} type="date" value={item.endDate} onChange={(e) => setEducation((prev) => prev.map((entry) => entry._id === item._id ? { ...entry, endDate: e.target.value } : entry))} />
                            </div>
                            <textarea className={inputClass} rows={3} placeholder="Pengalaman organisasi (satu baris satu item)" value={item.organizationExperience} onChange={(e) => setEducation((prev) => prev.map((entry) => entry._id === item._id ? { ...entry, organizationExperience: e.target.value } : entry))} />
                            <textarea className={inputClass} rows={3} placeholder="Prestasi (satu baris satu item)" value={item.achievements} onChange={(e) => setEducation((prev) => prev.map((entry) => entry._id === item._id ? { ...entry, achievements: e.target.value } : entry))} />
                        </div>
                    ))}
                    <div className="flex items-center gap-2">
                        <button type="button" onClick={() => setEducation((prev) => [...prev, emptyEducationItem()])} className="rounded-lg border border-white/15 px-4 py-2 text-sm text-text">+ Tambah Pendidikan</button>
                        <button type="button" onClick={() => void saveSection("education", education.map((item) => ({ _id: item._id, schoolName: item.schoolName, degree: item.degree, fieldOfStudy: item.fieldOfStudy, logo: item.logo, startDate: item.startDate, endDate: item.endDate, organizationExperience: toLineArray(item.organizationExperience), achievements: toLineArray(item.achievements) })))} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-background" disabled={saving || uploadingImage}>Simpan</button>
                        <button type="button" onClick={() => void resetSection("education")} className="rounded-lg border border-red-400/50 px-4 py-2 text-sm text-red-300" disabled={saving}>Reset</button>
                    </div>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                {jobs.map((item, index) => (
                    <div key={item._id} className="rounded-xl border border-white/10 bg-background p-4 space-y-2">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-text">Data Karier #{index + 1}</p>
                            <button type="button" className="text-xs text-red-300" onClick={() => setJobs((prev) => prev.filter((entry) => entry._id !== item._id))}>Hapus</button>
                        </div>
                        <input className={inputClass} placeholder="Nama Perusahaan" value={item.name} onChange={(e) => setJobs((prev) => prev.map((entry) => entry._id === item._id ? { ...entry, name: e.target.value } : entry))} />
                        <input className={inputClass} placeholder="Posisi" value={item.jobTitle} onChange={(e) => setJobs((prev) => prev.map((entry) => entry._id === item._id ? { ...entry, jobTitle: e.target.value } : entry))} />
                        <div className="rounded-xl border border-white/10 bg-surface p-3">
                            <p className="text-xs uppercase tracking-wide text-secondary">Logo Karier</p>
                            {item.logo ? (
                                <div className="mt-2 h-16 w-16 overflow-hidden rounded-xl border border-white/20 bg-background">
                                    <img src={item.logo} alt={item.name ? `Logo ${item.name}` : "Logo karier"} className="h-full w-full object-cover" />
                                </div>
                            ) : (
                                <p className="mt-2 text-sm text-secondary">Belum ada logo.</p>
                            )}

                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp,image/gif"
                                    onChange={(event) => void handleJobLogoUpload(item._id, event.target.files?.[0] || null)}
                                    disabled={saving || uploadingImage}
                                    className="text-sm text-secondary file:mr-3 file:rounded-lg file:border file:border-white/15 file:bg-surface file:px-3 file:py-1.5 file:text-xs file:text-text"
                                />
                                <span className="text-xs text-secondary">Maksimal 3MB</span>
                                {item.logo ? (
                                    <button
                                        type="button"
                                        className="rounded-lg border border-red-400/50 px-3 py-1.5 text-xs text-red-300"
                                        onClick={() =>
                                            setJobs((prev) =>
                                                prev.map((entry) =>
                                                    entry._id === item._id ? { ...entry, logo: "" } : entry
                                                )
                                            )
                                        }
                                        disabled={saving || uploadingImage}
                                    >
                                        Hapus Logo
                                    </button>
                                ) : null}
                            </div>

                            <input
                                className="mt-3 w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-text outline-none focus:border-primary/50"
                                placeholder="Atau masukkan URL logo manual"
                                value={item.logo}
                                onChange={(e) => setJobs((prev) => prev.map((entry) => entry._id === item._id ? { ...entry, logo: e.target.value } : entry))}
                                disabled={saving || uploadingImage}
                            />
                        </div>
                        <div className="grid gap-2 md:grid-cols-2">
                            <input className={inputClass} type="date" value={item.startDate} onChange={(e) => setJobs((prev) => prev.map((entry) => entry._id === item._id ? { ...entry, startDate: e.target.value } : entry))} />
                            <input className={inputClass} type="date" value={item.endDate} onChange={(e) => setJobs((prev) => prev.map((entry) => entry._id === item._id ? { ...entry, endDate: e.target.value } : entry))} />
                        </div>
                        <textarea className={inputClass} rows={4} placeholder="Deskripsi pekerjaan" value={item.description} onChange={(e) => setJobs((prev) => prev.map((entry) => entry._id === item._id ? { ...entry, description: e.target.value } : entry))} />
                    </div>
                ))}
                <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setJobs((prev) => [...prev, emptyJobItem()])} className="rounded-lg border border-white/15 px-4 py-2 text-sm text-text">+ Tambah Karier</button>
                    <button type="button" onClick={() => void saveSection("jobs", jobs.map((item) => ({ _id: item._id, name: item.name, jobTitle: item.jobTitle, logo: item.logo, startDate: item.startDate, endDate: item.endDate, description: item.description })))} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-background" disabled={saving || uploadingImage}>Simpan</button>
                    <button type="button" onClick={() => void resetSection("jobs")} className="rounded-lg border border-red-400/50 px-4 py-2 text-sm text-red-300" disabled={saving || uploadingImage}>Reset</button>
                </div>
            </div>
        );
    };

    return (
        <section className="mt-8 rounded-2xl border border-white/10 bg-surface p-6">
            <AdminToast message={success} type="success" />
            <AdminToast message={error} type="error" />
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-text">Kelola Konten Website</h2>

                <div className="flex items-center gap-2">
                    <label className="text-sm text-secondary" htmlFor="admin-content-language">
                        Language
                    </label>
                    <select
                        id="admin-content-language"
                        className="rounded-lg border border-white/15 bg-background px-2 py-1 text-sm text-text"
                        value={language}
                        onChange={(event) => handleLanguageChange(event.target.value === "en" ? "en" : "id")}
                        disabled={loading || saving}
                    >
                        <option value="id">Indonesia</option>
                        <option value="en">English</option>
                    </select>
                </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-[260px_1fr]">
                <div className="rounded-xl border border-white/10 bg-background p-3">
                    <p className="mb-2 text-xs uppercase tracking-wide text-secondary">Bagian Konten</p>
                    <div className="space-y-1">
                        {sectionKeys.map((key) => {
                            const isSelected = key === activeSection;
                            const hasData = itemByKey.has(key);

                            return (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => handleSectionSwitch(key)}
                                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${
                                        isSelected
                                            ? "border border-primary/40 bg-primary/15 text-text"
                                            : "border border-transparent bg-surface text-secondary hover:text-text"
                                    }`}
                                >
                                    <span>{sectionLabel[key]}</span>
                                    <span className={`h-2 w-2 rounded-full ${hasData ? "bg-emerald-400" : "bg-zinc-500"}`}></span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-background p-3">
                    <p className="mb-2 text-xs uppercase tracking-wide text-secondary">
                        Form Input: {sectionLabel[activeSection]} ({language.toUpperCase()})
                    </p>
                    {isDirty && <p className="mb-2 text-xs text-amber-300">Ada perubahan belum disimpan.</p>}

                    {loading ? (
                        <p className="text-sm text-secondary">Memuat konten...</p>
                    ) : (
                        <>
                            {renderSectionForm()}

                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
