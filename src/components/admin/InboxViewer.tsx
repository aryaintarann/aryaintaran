"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Loader2, Inbox, RefreshCw, MailOpen, Circle, Mail, Trash,
} from "lucide-react";

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
}

export default function InboxViewer({
  token,
  onUnreadChange,
}: {
  token: string;
  onUnreadChange: (n: number) => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/messages", { headers: { "x-admin-token": token } });
    if (res.ok) {
      const data: Message[] = await res.json();
      setMessages(data);
      onUnreadChange(data.filter((m) => !m.read).length);
    }
    setLoading(false);
  }, [token, onUnreadChange]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const toggleRead = async (msg: Message) => {
    await fetch("/api/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ id: msg.id, read: !msg.read }),
    });
    setMessages((prev) => {
      const updated = prev.map((m) => m.id === msg.id ? { ...m, read: !msg.read } : m);
      onUnreadChange(updated.filter((m) => !m.read).length);
      return updated;
    });
  };

  const deleteMessage = async (id: string) => {
    await fetch("/api/messages", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ id }),
    });
    if (expanded === id) setExpanded(null);
    setMessages((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      onUnreadChange(updated.filter((m) => !m.read).length);
      return updated;
    });
  };

  const handleExpand = async (msg: Message) => {
    const isOpening = expanded !== msg.id;
    setExpanded(isOpening ? msg.id : null);
    if (isOpening && !msg.read) {
      await fetch("/api/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ id: msg.id, read: true }),
      });
      setMessages((prev) => {
        const updated = prev.map((m) => m.id === msg.id ? { ...m, read: true } : m);
        onUnreadChange(updated.filter((m) => !m.read).length);
        return updated;
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="text-lime animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-white/30">
          {messages.length} pesan · {messages.filter((m) => !m.read).length} belum dibaca
        </p>
        <button
          onClick={fetchMessages}
          className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/70 transition-colors"
        >
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-white/20">
          <Inbox size={40} className="mb-4" />
          <p className="text-sm">Belum ada pesan masuk</p>
        </div>
      ) : null}

      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`border rounded-xl overflow-hidden transition-all ${
            msg.read ? "border-white/8" : "border-lime/30 bg-lime/5"
          }`}
        >
          <div
            className="flex items-center gap-3 p-4 cursor-pointer hover:bg-white/5 transition-colors"
            onClick={() => handleExpand(msg)}
          >
            <div className="shrink-0">
              {msg.read
                ? <MailOpen size={16} className="text-white/30" />
                : <Circle size={8} className="text-lime fill-lime mt-1" />
              }
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className={`text-sm font-semibold truncate ${msg.read ? "text-white/60" : "text-white"}`}>
                  {msg.name}
                </span>
                <span className="text-xs text-white/25 shrink-0">{msg.email}</span>
              </div>
              <p className="text-xs text-white/30 truncate">{msg.message}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[10px] text-white/25 whitespace-nowrap">
                {new Date(msg.created_at).toLocaleDateString("id-ID", {
                  day: "numeric", month: "short", year: "numeric",
                })}
              </p>
              <p className="text-[10px] text-white/20">
                {new Date(msg.created_at).toLocaleTimeString("id-ID", {
                  hour: "2-digit", minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {expanded === msg.id ? (
            <div className="px-4 pb-4 border-t border-white/8">
              <p className="text-sm text-white/70 leading-relaxed mt-4 whitespace-pre-wrap">
                {msg.message}
              </p>
              <div className="flex items-center gap-3 mt-5">
                <a
                  href={`mailto:${msg.email}?subject=Re: Message from ${msg.name}`}
                  className="flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase bg-lime text-[#050505] px-4 py-2 rounded-lg hover:bg-lime-dark transition-colors"
                >
                  <Mail size={12} /> Balas
                </a>
                <button
                  onClick={() => toggleRead(msg)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-white/40 hover:text-white/70 transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
                >
                  {msg.read ? "Tandai Belum Dibaca" : "Tandai Telah Dibaca"}
                </button>
                <button
                  onClick={() => deleteMessage(msg.id)}
                  className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-red-400/50 hover:text-red-400 transition-colors px-3 py-2 rounded-lg hover:bg-red-400/10"
                >
                  <Trash size={13} /> Hapus
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
