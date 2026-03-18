"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send } from "lucide-react";

const PHONE_NUMBER = "358449503156";
const DEFAULT_MESSAGE = "Hi Emmanuel! I visited your portfolio and would like to connect.";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  const handleSend = () => {
    const encoded = encodeURIComponent(message.trim() || DEFAULT_MESSAGE);
    window.open(
      `https://wa.me/${PHONE_NUMBER}?text=${encoded}`,
      "_blank",
      "noopener,noreferrer"
    );
    setOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50" ref={panelRef}>
      {/* Chat panel */}
      {open && (
        <div className="absolute bottom-16 right-0 w-[340px] rounded-2xl border border-border bg-card shadow-2xl shadow-black/20 overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200">
          {/* Header */}
          <div className="bg-[#075e54] px-4 py-3 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
              <WhatsAppIcon className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm">Emmanuel Safo</p>
              <p className="text-white/70 text-xs">Usually replies within an hour</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/70 hover:text-white transition-colors cursor-pointer"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat body */}
          <div className="bg-[#0b141a] p-4 min-h-[120px]">
            {/* Simulated incoming message */}
            <div className="bg-[#1f2c34] rounded-lg rounded-tl-none px-3 py-2 max-w-[85%] mb-3">
              <p className="text-sm text-white/90 leading-relaxed">
                Hey there! 👋 Thanks for visiting my portfolio. How can I help you?
              </p>
              <p className="text-[10px] text-white/40 mt-1 text-right">
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {/* Message input */}
          <div className="bg-[#1a2228] px-3 py-2 flex items-end gap-2">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type a message..."
              rows={1}
              className="flex-1 bg-[#2a3942] text-white text-sm rounded-lg px-3 py-2 resize-none focus:outline-none placeholder:text-white/40 max-h-24"
            />
            <button
              onClick={handleSend}
              className="h-9 w-9 rounded-full bg-[#00a884] hover:bg-[#00bf96] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
              aria-label="Send on WhatsApp"
            >
              <Send className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="h-14 w-14 rounded-full bg-[#25d366] hover:bg-[#20bd5a] shadow-lg shadow-black/25 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
        aria-label="Chat on WhatsApp"
      >
        {open ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <WhatsAppIcon className="h-7 w-7 text-white" />
        )}
      </button>
    </div>
  );
}
