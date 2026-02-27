"use client";

type AdminToastProps = {
    message: string | null;
    type?: "success" | "error";
};

export default function AdminToast({ message, type = "success" }: AdminToastProps) {
    if (!message) return null;

    const toneClass =
        type === "error"
            ? "border-red-400/50 bg-red-500/15 text-red-200"
            : "border-emerald-400/50 bg-emerald-500/15 text-emerald-200";

    return (
        <div className={`fixed right-4 top-4 z-100 max-w-sm rounded-lg border px-4 py-3 text-sm shadow-lg ${toneClass}`}>
            {message}
        </div>
    );
}
