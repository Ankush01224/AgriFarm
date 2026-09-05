import React, { useState } from "react";
import { MessageSquare, Send, X, Radio, Phone } from "lucide-react";

interface ChatLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  foremanName: string;
  radioChannel: string;
}

export const ChatLeadModal: React.FC<ChatLeadModalProps> = ({
  isOpen,
  onClose,
  foremanName,
  radioChannel,
}) => {
  const [messages, setMessages] = useState([
    {
      id: "m1",
      sender: foremanName,
      text: "Squad Alpha, we need 30 more boxes stacked before the pallet loader arrives at 11:15.",
      time: "10:42 AM",
    },
    {
      id: "m2",
      sender: "You",
      text: "Copy that Manuel, Eduardo and Sofia are clearing Row 12 now.",
      time: "10:44 AM",
    },
  ]);
  const [input, setInput] = useState("");

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newMsg = {
      id: `m-${Date.now()}`,
      sender: "You",
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    // Automated foreman reply simulation
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `m-f-${Date.now()}`,
          sender: foremanName,
          text: "Acknowledged. Water jugs refilled at Canal Staging #2 trailer.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white/85 dark:bg-[#0f141d]/90 backdrop-blur-2xl max-w-md w-full rounded-3xl p-6 shadow-2xl border border-white/80 dark:border-white/15 relative flex flex-col h-[520px]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white bg-white/40 dark:bg-white/5 border border-white/50 dark:border-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-white/40 dark:border-white/10">
          <div className="w-10 h-10 rounded-2xl bg-green-100/80 dark:bg-green-950/60 text-[#008425] dark:text-[#8cfb8b] border border-green-200/60 dark:border-green-800/40 flex items-center justify-center font-bold">
            MR
          </div>
          <div>
            <h3 className="font-['Manrope'] text-base font-bold text-slate-900 dark:text-white">
              {foremanName}
            </h3>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 text-[#008425] dark:text-[#8cfb8b]">
                <Radio className="w-3 h-3" /> Radio: {radioChannel}
              </span>
              <span>•</span>
              <span className="text-[#008425] dark:text-[#8cfb8b] font-semibold">On Field Rig</span>
            </div>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === "You" ? "items-end" : "items-start"}`}
            >
              <span className="text-[10px] font-mono text-slate-400 mb-0.5">
                {m.sender} • {m.time}
              </span>
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  m.sender === "You"
                    ? "bg-[#008425] text-white rounded-br-none shadow-xs"
                    : "bg-white/70 dark:bg-white/10 border border-white/60 dark:border-white/10 text-slate-800 dark:text-white rounded-bl-none backdrop-blur-xs"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="pt-3 border-t border-white/40 dark:border-white/10 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Radio message to foreman..."
            className="flex-1 px-3 py-2 bg-white/50 dark:bg-white/10 rounded-xl border border-white/60 dark:border-white/15 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#008425] backdrop-blur-md"
          />
          <button
            type="submit"
            className="p-2.5 bg-[#008425] text-white rounded-xl hover:bg-[#00681b] transition-colors shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
