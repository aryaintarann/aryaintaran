"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type LoginFormProps = {
    callbackUrl?: string;
};

export default function LoginForm({ callbackUrl }: LoginFormProps) {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const result = await signIn("credentials", {
                email,
                password,
                callbackUrl: callbackUrl || "/admin",
                redirect: false,
            });

            if (!result || result.error) {
                setError("Email atau password salah.");
                return;
            }

            router.push(result.url || "/admin");
            router.refresh();
        } catch {
            setError("Terjadi kesalahan. Coba lagi.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
            <label className="block space-y-1">
                <span className="text-sm text-secondary">Email</span>
                <input
                    type="email"
                    className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-text outline-none focus:border-primary/50"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    disabled={isSubmitting}
                />
            </label>

            <label className="block space-y-1">
                <span className="text-sm text-secondary">Password</span>
                <input
                    type="password"
                    className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-text outline-none focus:border-primary/50"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    disabled={isSubmitting}
                />
            </label>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-60"
            >
                {isSubmitting ? "Memproses..." : "Masuk"}
            </button>
        </form>
    );
}
