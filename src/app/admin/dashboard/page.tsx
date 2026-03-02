"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Home, User, Code2, FolderKanban, Mail, LogOut, Save,
  Plus, Trash2, ChevronDown, ChevronUp, CheckCircle, XCircle, Loader2,
  Upload, X, Image as ImageIcon
} from "lucide-react";
import type { SiteContent, EducationItem, CareerItem, SkillItem, ProjectItem, ProjectType } from "@/types/content";
import { getSkillIcon, hasSkillIcon } from "@/lib/skillIcons";

// ─── Types ───────────────────────────────────────────────────────────────────
type Tab = "hero" | "about" | "skills" | "projects" | "contact";
type ToastType = "success" | "error";
interface Toast { message: string; type: ToastType }

const PROJECT_TYPES: { value: ProjectType; label: string }[] = [
  { value: "personal", label: "Personal Project" },
  { value: "freelance", label: "Freelance" },
  { value: "work", label: "Work / Company" },
];

// ─── Small UI helpers ─────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold tracking-widest uppercase text-white/40">{label}</label>
      {children}
    </div>
  );
}
function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-lime/40 transition-colors"
    />
  );
}
function TextArea({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-lime/40 transition-colors resize-none"
    />
  );
}
function SectionCard({ children }: { children: React.ReactNode }) {
  return <div className="bg-white/3 border border-white/8 rounded-2xl p-6 space-y-4">{children}</div>;
}
function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base font-bold tracking-wide text-white mb-2">{children}</h3>;
}
function AddBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-lime hover:text-white transition-colors py-2">
      <Plus size={14} /> {label}
    </button>
  );
}
function RemoveBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="text-red-400/60 hover:text-red-400 transition-colors">
      <Trash2 size={15} />
    </button>
  );
}

// ─── Section Editors ─────────────────────────────────────────────────────────
function HeroEditor({ content, onChange }: { content: SiteContent["hero"]; onChange: (v: SiteContent["hero"]) => void }) {
  return (
    <div className="space-y-6">
      <SectionCard>
        <SectionTitle>Identitas Utama</SectionTitle>
        <Field label="Nama (ditampilkan besar di hero)">
          <TextInput value={content.name} onChange={(v) => onChange({ ...content, name: v })} placeholder="ARYA INTARAN" />
        </Field>
        <Field label="Tagline / Marquee Text">
          <TextInput value={content.tagline} onChange={(v) => onChange({ ...content, tagline: v })} placeholder="Web Developer | IT Support | Data Entry" />
        </Field>
      </SectionCard>
    </div>
  );
}

function AboutEditor({ content, onChange }: { content: SiteContent["about"]; onChange: (v: SiteContent["about"]) => void }) {
  const [openEdu, setOpenEdu] = useState<number | null>(null);
  const [openCareer, setOpenCareer] = useState<number | null>(null);

  const updateEdu = (i: number, val: Partial<EducationItem>) =>
    onChange({ ...content, education: content.education.map((e, idx) => idx === i ? { ...e, ...val } : e) });
  const removeEdu = (i: number) =>
    onChange({ ...content, education: content.education.filter((_, idx) => idx !== i) });
  const addEdu = () =>
    onChange({ ...content, education: [...content.education, { title: "", school: "", year: "", summary: "", details: [], active: false }] });

  const updateCareer = (i: number, val: Partial<CareerItem>) =>
    onChange({ ...content, career: content.career.map((c, idx) => idx === i ? { ...c, ...val } : c) });
  const removeCareer = (i: number) =>
    onChange({ ...content, career: content.career.filter((_, idx) => idx !== i) });
  const addCareer = () =>
    onChange({ ...content, career: [...content.career, { title: "", company: "", year: "", summary: "", details: [], active: false }] });

  return (
    <div className="space-y-6">
      <SectionCard>
        <SectionTitle>Biografi</SectionTitle>
        <Field label="Paragraf 1">
          <TextArea value={content.bio1} onChange={(v) => onChange({ ...content, bio1: v })} rows={3} />
        </Field>
        <Field label="Paragraf 2">
          <TextArea value={content.bio2} onChange={(v) => onChange({ ...content, bio2: v })} rows={3} />
        </Field>
      </SectionCard>

      {/* Education */}
      <SectionCard>
        <SectionTitle>Pendidikan</SectionTitle>
        {content.education.map((edu, i) => (
          <div key={i} className="border border-white/8 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => setOpenEdu(openEdu === i ? null : i)}>
              <span className="text-sm font-semibold text-white/80">{edu.title || `Pendidikan ${i + 1}`}</span>
              <div className="flex items-center gap-3">
                <div onClick={(e) => { e.stopPropagation(); removeEdu(i); }}>
                  <RemoveBtn onClick={() => removeEdu(i)} />
                </div>
                {openEdu === i ? <ChevronUp size={15} className="text-white/40" /> : <ChevronDown size={15} className="text-white/40" />}
              </div>
            </div>
            {openEdu === i && (
              <div className="p-4 pt-0 space-y-3 border-t border-white/8">
                <Field label="Judul / Gelar"><TextInput value={edu.title} onChange={(v) => updateEdu(i, { title: v })} /></Field>
                <Field label="Nama Sekolah/Universitas"><TextInput value={edu.school} onChange={(v) => updateEdu(i, { school: v })} /></Field>
                <Field label="Tahun (contoh: 2020 — 2024)"><TextInput value={edu.year} onChange={(v) => updateEdu(i, { year: v })} /></Field>
                <Field label="Ringkasan"><TextArea value={edu.summary} onChange={(v) => updateEdu(i, { summary: v })} rows={2} /></Field>
                <Field label="Detail (satu baris = satu poin)">
                  <TextArea value={edu.details.join("\n")} onChange={(v) => updateEdu(i, { details: v.split("\n").filter(Boolean) })} rows={4} />
                </Field>
                <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
                  <input type="checkbox" checked={edu.active} onChange={(e) => updateEdu(i, { active: e.target.checked })} className="accent-lime" />
                  Tandai sebagai aktif (border hijau)
                </label>
              </div>
            )}
          </div>
        ))}
        <AddBtn label="Tambah Pendidikan" onClick={addEdu} />
      </SectionCard>

      {/* Career */}
      <SectionCard>
        <SectionTitle>Karir</SectionTitle>
        {content.career.map((car, i) => (
          <div key={i} className="border border-white/8 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => setOpenCareer(openCareer === i ? null : i)}>
              <span className="text-sm font-semibold text-white/80">{car.title || `Karir ${i + 1}`}</span>
              <div className="flex items-center gap-3">
                <div onClick={(e) => { e.stopPropagation(); removeCareer(i); }}>
                  <RemoveBtn onClick={() => removeCareer(i)} />
                </div>
                {openCareer === i ? <ChevronUp size={15} className="text-white/40" /> : <ChevronDown size={15} className="text-white/40" />}
              </div>
            </div>
            {openCareer === i && (
              <div className="p-4 pt-0 space-y-3 border-t border-white/8">
                <Field label="Jabatan"><TextInput value={car.title} onChange={(v) => updateCareer(i, { title: v })} /></Field>
                <Field label="Nama Perusahaan"><TextInput value={car.company} onChange={(v) => updateCareer(i, { company: v })} /></Field>
                <Field label="Tahun (contoh: 2024 — Present)"><TextInput value={car.year} onChange={(v) => updateCareer(i, { year: v })} /></Field>
                <Field label="Ringkasan"><TextArea value={car.summary} onChange={(v) => updateCareer(i, { summary: v })} rows={2} /></Field>
                <Field label="Detail (satu baris = satu poin)">
                  <TextArea value={car.details.join("\n")} onChange={(v) => updateCareer(i, { details: v.split("\n").filter(Boolean) })} rows={4} />
                </Field>
                <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
                  <input type="checkbox" checked={car.active} onChange={(e) => updateCareer(i, { active: e.target.checked })} className="accent-lime" />
                  Tandai sebagai aktif (border hijau)
                </label>
              </div>
            )}
          </div>
        ))}
        <AddBtn label="Tambah Karir" onClick={addCareer} />
      </SectionCard>
    </div>
  );
}

function SkillsEditor({ content, onChange }: { content: SkillItem[]; onChange: (v: SkillItem[]) => void }) {
  const update = (i: number, name: string) => {
    const icon = getSkillIcon(name);
    onChange(content.map((s, idx) => idx === i ? { name, icon } : s));
  };
  const remove = (i: number) => onChange(content.filter((_, idx) => idx !== i));
  const add = () => onChange([...content, { name: "", icon: "" }]);

  return (
    <SectionCard>
      <SectionTitle>Daftar Skill</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {content.map((skill, i) => {
          const resolvedIcon = skill.icon || getSkillIcon(skill.name);
          const found = hasSkillIcon(skill.name);
          return (
            <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-2.5 border border-white/8">
              <div className="w-8 h-8 shrink-0 flex items-center justify-center rounded bg-white/10 p-1">
                {resolvedIcon ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={resolvedIcon} alt={skill.name} className="w-full h-full object-contain" />
                ) : (
                  <span className="text-white/20 text-lg">?</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) => update(i, e.target.value)}
                  placeholder="Nama skill (contoh: React)"
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/25 focus:outline-none"
                />
                <p className={`text-[10px] mt-0.5 ${found ? "text-lime/50" : skill.name ? "text-red-400/50" : "text-white/20"}`}>
                  {found ? "✓ Icon ditemukan" : skill.name ? "✗ Icon tidak tersedia" : "Ketik nama skill..."}
                </p>
              </div>
              <RemoveBtn onClick={() => remove(i)} />
            </div>
          );
        })}
      </div>
      <AddBtn label="Tambah Skill" onClick={add} />
      <p className="text-xs text-white/25 mt-1 leading-relaxed">
        Icon otomatis terdeteksi dari nama. Coba: React, TypeScript, Docker, PostgreSQL, Figma, dll.
      </p>
    </SectionCard>
  );
}

function ProjectsEditor({ content, onChange, token }: { content: ProjectItem[]; onChange: (v: ProjectItem[]) => void; token: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const [uploading, setUploading] = useState<number | null>(null);
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  const update = (i: number, val: Partial<ProjectItem>) =>
    onChange(content.map((p, idx) => idx === i ? { ...p, ...val } : p));
  const remove = (i: number) => onChange(content.filter((_, idx) => idx !== i));
  const add = () => {
    const next = String(content.length + 1).padStart(2, "0");
    onChange([...content, {
      index: next,
      title: "",
      slug: "",
      description: "",
      longDescription: "",
      type: "personal",
      images: [],
      stack: [],
      link: "#",
    }]);
  };

  const autoSlug = (title: string) =>
    title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const handleImageUpload = async (i: number, files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(i);
    const project = content[i];
    const slug = project.slug || autoSlug(project.title) || `project-${i + 1}`;

    const newUrls: string[] = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("slug", slug);
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "x-admin-token": token },
          body: fd,
        });
        const data = await res.json();
        if (data.url) newUrls.push(data.url);
      } catch { /* skip failed uploads */ }
    }
    update(i, { images: [...(project.images || []), ...newUrls] });
    setUploading(null);
  };

  const removeImage = (projectIdx: number, imgIdx: number) => {
    const imgs = [...(content[projectIdx].images || [])];
    imgs.splice(imgIdx, 1);
    update(projectIdx, { images: imgs });
  };

  return (
    <SectionCard>
      <SectionTitle>Daftar Proyek</SectionTitle>
      {content.map((project, i) => (
        <div key={i} className="border border-white/8 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => setOpen(open === i ? null : i)}>
            <span className="text-sm font-semibold text-white/80">{project.title || `Proyek ${i + 1}`}</span>
            <div className="flex items-center gap-3">
              <div onClick={(e) => { e.stopPropagation(); remove(i); }}>
                <RemoveBtn onClick={() => remove(i)} />
              </div>
              {open === i ? <ChevronUp size={15} className="text-white/40" /> : <ChevronDown size={15} className="text-white/40" />}
            </div>
          </div>
          {open === i && (
            <div className="p-4 pt-0 space-y-3 border-t border-white/8">
              {/* Row 1 */}
              <div className="grid grid-cols-2 gap-3">
                <Field label="Nomor (contoh: 01)">
                  <TextInput value={project.index} onChange={(v) => update(i, { index: v })} />
                </Field>
                <Field label="Tipe Project">
                  <select
                    value={project.type || "personal"}
                    onChange={(e) => update(i, { type: e.target.value as ProjectType })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-lime/40 transition-colors"
                  >
                    {PROJECT_TYPES.map(t => (
                      <option key={t.value} value={t.value} className="bg-[#111]">{t.label}</option>
                    ))}
                  </select>
                </Field>
              </div>

              {/* Row 2 */}
              <Field label="Judul Proyek">
                <TextInput
                  value={project.title}
                  onChange={(v) => update(i, {
                    title: v,
                    slug: project.slug || autoSlug(v),
                  })}
                />
              </Field>

              {/* Slug */}
              <Field label="Slug URL (otomatis dari judul)">
                <TextInput
                  value={project.slug || ""}
                  onChange={(v) => update(i, { slug: autoSlug(v) })}
                  placeholder="contoh: e-commerce-platform"
                />
              </Field>

              {/* Descriptions */}
              <Field label="Deskripsi Singkat (ditampilkan di card)">
                <TextArea value={project.description} onChange={(v) => update(i, { description: v })} rows={2} />
              </Field>
              <Field label="Deskripsi Panjang (ditampilkan di halaman detail)">
                <TextArea
                  value={project.longDescription || ""}
                  onChange={(v) => update(i, { longDescription: v })}
                  rows={6}
                  placeholder="Tulis deskripsi lengkap proyek di sini. Pisahkan paragraf dengan baris kosong."
                />
              </Field>

              {/* Stack & Link */}
              <Field label="Tech Stack (pisahkan dengan koma)">
                <TextInput value={project.stack.join(", ")} onChange={(v) => update(i, { stack: v.split(",").map((s) => s.trim()).filter(Boolean) })} placeholder="React, Next.js, TypeScript" />
              </Field>
              <Field label="Link Proyek (live URL)">
                <TextInput value={project.link} onChange={(v) => update(i, { link: v })} placeholder="https://..." />
              </Field>
              <Field label="Link GitHub (opsional)">
                <TextInput value={project.github || ""} onChange={(v) => update(i, { github: v })} placeholder="https://github.com/username/repo" />
              </Field>

              {/* Image upload */}
              <div className="space-y-2">
                <label className="text-xs font-semibold tracking-widest uppercase text-white/40">Foto Project</label>

                {/* Existing images */}
                {project.images && project.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {project.images.map((url, imgIdx) => (
                      <div key={imgIdx} className="relative group aspect-video rounded-lg overflow-hidden border border-white/10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt={`Project image ${imgIdx + 1}`} className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeImage(i, imgIdx)}
                          className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-500 text-white p-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload button */}
                <input
                  ref={(el) => { fileRefs.current[i] = el; }}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="hidden"
                  onChange={(e) => handleImageUpload(i, e.target.files)}
                />
                <button
                  onClick={() => fileRefs.current[i]?.click()}
                  disabled={uploading === i}
                  className="flex items-center gap-2 w-full justify-center border border-dashed border-white/15 hover:border-lime/40 rounded-xl py-3 text-xs font-semibold text-white/40 hover:text-white/70 transition-all disabled:opacity-50"
                >
                  {uploading === i
                    ? <><Loader2 size={14} className="animate-spin" /> Mengupload...</>
                    : <><Upload size={14} /> <ImageIcon size={14} /> Upload Foto Project</>
                  }
                </button>
                <p className="text-[10px] text-white/20">JPEG, PNG, WebP • Maks 10MB • Bisa upload banyak</p>
              </div>
            </div>
          )}
        </div>
      ))}
      <AddBtn label="Tambah Proyek" onClick={add} />
    </SectionCard>
  );
}

function ContactEditor({ content, onChange }: { content: SiteContent["contact"]; onChange: (v: SiteContent["contact"]) => void }) {
  return (
    <div className="space-y-6">
      <SectionCard>
        <SectionTitle>Info Kontak</SectionTitle>
        <Field label="Email"><TextInput value={content.email} onChange={(v) => onChange({ ...content, email: v })} placeholder="hello@example.com" /></Field>
        <Field label="Lokasi"><TextInput value={content.location} onChange={(v) => onChange({ ...content, location: v })} placeholder="Indonesia" /></Field>
        <Field label="Telepon"><TextInput value={content.phone} onChange={(v) => onChange({ ...content, phone: v })} placeholder="Available on request" /></Field>
      </SectionCard>
      <SectionCard>
        <SectionTitle>Sosial Media</SectionTitle>
        <Field label="Instagram URL"><TextInput value={content.social.instagram} onChange={(v) => onChange({ ...content, social: { ...content.social, instagram: v } })} placeholder="https://instagram.com/username" /></Field>
        <Field label="TikTok URL"><TextInput value={content.social.tiktok} onChange={(v) => onChange({ ...content, social: { ...content.social, tiktok: v } })} placeholder="https://tiktok.com/@username" /></Field>
        <Field label="GitHub URL"><TextInput value={content.social.github} onChange={(v) => onChange({ ...content, social: { ...content.social, github: v } })} placeholder="https://github.com/username" /></Field>
        <Field label="LinkedIn URL"><TextInput value={content.social.linkedin} onChange={(v) => onChange({ ...content, social: { ...content.social, linkedin: v } })} placeholder="https://linkedin.com/in/username" /></Field>
      </SectionCard>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const NAV: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "hero", label: "Hero", icon: Home },
  { id: "about", label: "About", icon: User },
  { id: "skills", label: "Skills", icon: Code2 },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "contact", label: "Contact", icon: Mail },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("hero");
  const [content, setContent] = useState<SiteContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [token, setToken] = useState("");

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  useEffect(() => {
    const t = localStorage.getItem("admin_token") || "";
    if (!t) { router.replace("/admin"); return; }
    setToken(t);
    fetch("/api/content")
      .then((r) => r.json())
      .then(setContent)
      .catch(() => showToast("Gagal memuat konten", "error"));
  }, [router, showToast]);

  const handleSave = async () => {
    if (!content) return;
    setSaving(true);
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify(content),
      });
      if (res.ok) { showToast("Konten berhasil disimpan!", "success"); }
      else { showToast("Gagal menyimpan. Cek token.", "error"); }
    } catch {
      showToast("Terjadi kesalahan jaringan.", "error");
    } finally {
      setSaving(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    router.replace("/admin");
  };

  if (!content) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 size={32} className="text-lime animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-white/8 flex flex-col py-6 px-4 sticky top-0 h-screen">
        <div className="mb-8 px-2">
          <h1 className="text-lg font-black tracking-[-0.02em] text-white">
            ADMIN <span className="text-lime">CMS</span>
          </h1>
          <p className="text-[10px] tracking-widest text-white/30 uppercase mt-0.5">Arya Intaran</p>
        </div>

        <nav className="flex-1 space-y-1">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === id
                  ? "bg-lime text-[#050505]"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        <div className="space-y-2 pt-4 border-t border-white/8">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs text-white/40 hover:text-white/70 hover:bg-white/5 transition-all font-medium"
          >
            ↗ Lihat Website
          </a>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs text-red-400/60 hover:text-red-400 hover:bg-red-400/10 transition-all font-medium"
          >
            <LogOut size={14} /> Keluar
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 bg-[#050505]/80 backdrop-blur border-b border-white/8 flex items-center justify-between px-8 py-4">
          <div>
            <h2 className="text-base font-bold tracking-wide text-white capitalize">{activeTab}</h2>
            <p className="text-xs text-white/30">Edit konten section ini</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-lime text-[#050505] font-bold px-5 py-2.5 rounded-xl text-sm tracking-wider uppercase hover:bg-lime-dark disabled:opacity-50 transition-all"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto px-8 py-8 max-w-3xl">
          {activeTab === "hero" && (
            <HeroEditor content={content.hero} onChange={(v) => setContent({ ...content, hero: v })} />
          )}
          {activeTab === "about" && (
            <AboutEditor content={content.about} onChange={(v) => setContent({ ...content, about: v })} />
          )}
          {activeTab === "skills" && (
            <SkillsEditor content={content.skills} onChange={(v) => setContent({ ...content, skills: v })} />
          )}
          {activeTab === "projects" && (
            <ProjectsEditor content={content.projects} onChange={(v) => setContent({ ...content, projects: v })} token={token} />
          )}
          {activeTab === "contact" && (
            <ContactEditor content={content.contact} onChange={(v) => setContent({ ...content, contact: v })} />
          )}
        </main>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-semibold shadow-2xl transition-all z-50 ${
          toast.type === "success" ? "bg-lime text-[#050505]" : "bg-red-500 text-white"
        }`}>
          {toast.type === "success" ? <CheckCircle size={16} /> : <XCircle size={16} />}
          {toast.message}
        </div>
      )}
    </div>
  );
}
