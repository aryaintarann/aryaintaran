"use client";

export default function TopBar() {
    return (
        <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-4">
            <div className="w-10 h-10 bg-[#CEF441] rounded-lg flex items-center justify-center">
                <span className="text-[#050505] font-black text-sm tracking-tight">
                    AI
                </span>
            </div>

            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-foreground/50">
                WEB DEVELOPER | IT SUPPORT | DATA ENTRY
            </span>
        </header>
    );
}
