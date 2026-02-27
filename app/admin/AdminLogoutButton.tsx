"use client";

import { signOut } from "next-auth/react";

export default function AdminLogoutButton() {
    return (
        <button
            type="button"
            onClick={() => void signOut({ callbackUrl: "/admin/login" })}
            className="rounded-lg border border-white/15 bg-surface px-4 py-2 text-sm font-medium text-text hover:border-white/30"
        >
            Logout
        </button>
    );
}
