"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError("Password salah. Coba lagi.");
      } else {
        localStorage.setItem("admin_token", data.token);
        router.push("/admin/dashboard");
      }
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo / Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-lime/10 border border-lime/20 mb-6">
            <Lock size={22} className="text-lime" />
          </div>
          <h1 className="text-3xl font-black tracking-[-0.03em] text-white mb-1">
            ADMIN <span className="text-lime">CMS</span>
          </h1>
          <p className="text-sm text-white/40 tracking-wider">
            ARYA INTARAN PORTFOLIO
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan password admin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-lime/50 focus:bg-white/8 transition-all pr-12"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 rounded-xl px-4 py-3">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-lime text-[#050505] font-bold py-3 rounded-xl text-sm tracking-wider uppercase transition-all hover:bg-lime-dark disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Memverifikasi..." : "Masuk"}
          </button>
        </form>

        <p className="text-center text-white/20 text-xs mt-8 tracking-wider">
          DEFAULT: admin123
        </p>
      </div>
    </div>
  );
}
