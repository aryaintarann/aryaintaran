import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";

type LoginPageProps = {
    searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
    let session = null;
    try {
        session = await getServerSession(authOptions);
    } catch {
        session = null;
    }

    if (session) {
        redirect("/admin");
    }

    const { callbackUrl } = await searchParams;

    return (
        <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
            <section className="w-full rounded-2xl border border-white/10 bg-surface p-6 md:p-7">
                <h1 className="text-2xl font-bold text-text">Admin Login</h1>
                <p className="mt-1 text-sm text-secondary">Masuk untuk mengakses admin panel custom.</p>

                <LoginForm callbackUrl={callbackUrl} />
            </section>
        </main>
    );
}
