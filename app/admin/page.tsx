import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AdminLogoutButton from "./AdminLogoutButton";
import ContentManager from "./ContentManager";
import ProjectsManager from "./ProjectsManager";
import AchievementManager from "./AchievementManager";
import PersonalProjectsManager from "./PersonalProjectsManager";

export default async function AdminDashboardPage() {
    let session = null;
    try {
        session = await getServerSession(authOptions);
    } catch {
        session = null;
    }

    if (!session) {
        redirect("/admin/login");
    }

    return (
        <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8 md:px-6">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-3xl font-bold text-text">Custom Admin Panel</h1>
                    <p className="mt-1 text-sm text-secondary">Selamat datang, {session.user?.email}</p>
                </div>

                <AdminLogoutButton />
            </div>

            <section className="mt-8 rounded-2xl border border-white/10 bg-surface p-6">
                <h2 className="text-xl font-semibold text-text">Dashboard Admin</h2>
                <p className="mt-2 text-sm text-secondary">
                    Kelola konten website melalui formulir sederhana. Anda bisa mengatur profil, kontak, karier, project,
                    achievement, dan personal project.
                </p>
            </section>

            <ContentManager />
            <AchievementManager />
            <ProjectsManager />
            <PersonalProjectsManager />
        </main>
    );
}
