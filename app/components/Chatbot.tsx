"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";

interface Message {
    role: "user" | "assistant";
    content: string;
}

const QUICK_ACTIONS = [
    { label: "👋 Siapa Arya?", message: "Siapa Arya Intaran?" },
    { label: "💼 Pengalaman", message: "Apa saja pengalaman kerja Arya?" },
    { label: "🛠️ Skills", message: "Skills apa saja yang dimiliki?" },
    { label: "🚀 Proyek", message: "Apa saja proyek yang pernah dibuat?" },
    { label: "📬 Kontak", message: "Bagaimana cara menghubungi Arya?" },
];

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showQuickActions, setShowQuickActions] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const sendMessage = async (messageText: string) => {
        if (!messageText.trim() || isLoading) return;

        const userMessage: Message = { role: "user", content: messageText.trim() };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);
        setShowQuickActions(false);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: newMessages }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const errorMsg = errorData?.message || "Terjadi kesalahan, silakan coba lagi.";
                setMessages((prev) => [...prev, { role: "assistant", content: errorMsg }]);
                setIsLoading(false);
                return;
            }

            const data = await response.json();
            setMessages((prev) => [...prev, { role: "assistant", content: data.text || "Maaf, tidak ada respons." }]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        "Maaf, terjadi kesalahan. Silakan coba lagi atau hubungi langsung melalui halaman Contact 😊",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(input);
    };

    const handleQuickAction = (message: string) => {
        sendMessage(message);
    };

    const formatMessage = (text: string): string => {
        const lines = text.split("\n");
        let html = "";
        let inList = false;
        let listType = ""; // "ul" or "ol"

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            const formatInline = (s: string) =>
                s
                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                    .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<em>$1</em>")
                    .replace(
                        /`(.*?)`/g,
                        '<code style="background:rgba(255,255,255,0.1);padding:1px 5px;border-radius:4px;font-size:0.8em">$1</code>'
                    );

            const headingMatch = line.match(/^(#{1,3})\s+(.+)/);
            if (headingMatch) {
                if (inList) { html += `</${listType}>`; inList = false; }
                const level = headingMatch[1].length;
                const sizes: Record<number, string> = { 1: "font-size:1.1em", 2: "font-size:1em", 3: "font-size:0.95em" };
                html += `<div style="${sizes[level] || sizes[3]};font-weight:700;margin:8px 0 4px">${formatInline(headingMatch[2])}</div>`;
                continue;
            }

            const bulletMatch = line.match(/^[\s]*[-*]\s+(.+)/);
            if (bulletMatch) {
                if (!inList || listType !== "ul") {
                    if (inList) html += `</${listType}>`;
                    html += '<ul style="margin:4px 0;padding-left:18px;list-style:disc">';
                    inList = true;
                    listType = "ul";
                }
                html += `<li style="margin:2px 0">${formatInline(bulletMatch[1])}</li>`;
                continue;
            }

            const numMatch = line.match(/^[\s]*(\d+)[.)]\s+(.+)/);
            if (numMatch) {
                if (!inList || listType !== "ol") {
                    if (inList) html += `</${listType}>`;
                    html += '<ol style="margin:4px 0;padding-left:18px;list-style:decimal">';
                    inList = true;
                    listType = "ol";
                }
                html += `<li style="margin:2px 0">${formatInline(numMatch[2])}</li>`;
                continue;
            }

            if (inList) {
                html += `</${listType}>`;
                inList = false;
            }

            if (line.trim() === "") {
                html += '<div style="height:6px"></div>';
                continue;
            }

            html += `<div style="margin:2px 0">${formatInline(line)}</div>`;
        }

        if (inList) html += `</${listType}>`;

        return html;
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-9999 w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-110 ${isOpen
                    ? "bg-surface text-secondary rotate-0"
                    : "bg-primary text-background"
                    }`}
                aria-label="Toggle chatbot"
            >
                {isOpen ? (
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                ) : (
                    <>
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                        </svg>
                        <span className="absolute w-full h-full rounded-full bg-primary animate-ping opacity-20"></span>
                    </>
                )}
            </button>

            <div
                className={`fixed bottom-24 right-6 z-9998 w-95 max-w-[calc(100vw-2rem)] transition-all duration-300 origin-bottom-right ${isOpen
                    ? "scale-100 opacity-100 pointer-events-auto"
                    : "scale-95 opacity-0 pointer-events-none"
                    }`}
            >
                <div className="bg-background/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col h-130 max-h-[70vh]">
                    <div className="bg-surface/80 backdrop-blur-sm px-5 py-4 border-b border-white/5 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                    <svg
                                        className="w-5 h-5 text-primary"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-2.47 2.47a2.25 2.25 0 01-1.59.659H9.06a2.25 2.25 0 01-1.591-.659L5 14.5m14 0V17a2.25 2.25 0 01-2.25 2.25H7.25A2.25 2.25 0 015 17v-2.5"
                                        />
                                    </svg>
                                </div>
                                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-surface"></span>
                            </div>
                            <div>
                                <h3 className="text-text font-semibold text-sm">
                                    AI Assistant
                                </h3>
                                <p className="text-secondary/70 text-xs">
                                    Tanya apa saja tentang Arya ✨
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                        {messages.length === 0 && (
                            <div className="text-center py-6">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                                    <svg
                                        className="w-8 h-8 text-primary"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                        />
                                    </svg>
                                </div>
                                <h4 className="text-text font-semibold mb-1">
                                    Halo! 👋
                                </h4>
                                <p className="text-secondary text-sm mb-6 max-w-65 mx-auto">
                                    Saya AI assistant untuk portfolio Arya. Tanya apa saja!
                                </p>

                                {showQuickActions && (
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {QUICK_ACTIONS.map((action) => (
                                            <button
                                                key={action.label}
                                                onClick={() => handleQuickAction(action.message)}
                                                className="px-3 py-1.5 bg-surface border border-white/5 rounded-full text-xs text-secondary hover:text-primary hover:border-primary/30 transition-all"
                                            >
                                                {action.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.role === "user"
                                        ? "bg-primary text-background rounded-br-md"
                                        : "bg-surface/80 text-text rounded-bl-md border border-white/5"
                                        }`}
                                    dangerouslySetInnerHTML={{
                                        __html: formatMessage(msg.content),
                                    }}
                                />
                            </div>
                        ))}

                        {isLoading &&
                            messages[messages.length - 1]?.role !== "assistant" && (
                                <div className="flex justify-start">
                                    <div className="bg-surface/80 border border-white/5 px-4 py-3 rounded-2xl rounded-bl-md">
                                        <div className="flex gap-1.5">
                                            <span className="w-2 h-2 bg-secondary/50 rounded-full animate-bounce [animation-delay:0ms]"></span>
                                            <span className="w-2 h-2 bg-secondary/50 rounded-full animate-bounce [animation-delay:150ms]"></span>
                                            <span className="w-2 h-2 bg-secondary/50 rounded-full animate-bounce [animation-delay:300ms]"></span>
                                        </div>
                                    </div>
                                </div>
                            )}

                        <div ref={messagesEndRef} />
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="p-3 border-t border-white/5 bg-surface/30 shrink-0"
                    >
                        <div className="flex gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ketik pesan..."
                                disabled={isLoading}
                                className="flex-1 bg-surface border border-white/10 rounded-xl px-4 py-2.5 text-sm text-text placeholder-secondary/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all disabled:opacity-50"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="w-10 h-10 rounded-xl bg-primary text-background flex items-center justify-center hover:bg-primary/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                    />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
