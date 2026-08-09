import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BotIcon,
  X,
  Send,
  Loader2,
  Home,
  MapPin,
  Users,
  Bed,
  Bath,
  ImageOff,
  Tag,

} from "lucide-react";
import { useChatbotSearch } from "../hooks/usechatbot";
import type { ApartmentResult } from "../types/chatbot.types";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  apartments?: ApartmentResult[];
};

export default function ChatbotFloating() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Bonjour ! Je suis votre assistant. Posez-moi une question sur les appartements disponibles.",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { mutate, isPending } = useChatbotSearch();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isPending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    mutate(trimmed, {
      onSuccess: (response) => {
        // response is ChatbotSearchResponse
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response.message || "Voici les appartements correspondants :",
          apartments: response.data || [],
        };
        setMessages((prev) => [...prev, assistantMessage]);
      },
     
      onError: (err) => {
const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: axios.isAxiosError(err)
            ? err.response?.data?.message ||
              err.message ||
              "Impossible de traiter votre demande."
            : "Impossible de traiter votre demande.",
        };
        setMessages((prev) => [...prev, errorMessage]);
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/30 transition hover:bg-orange-600 hover:shadow-orange-500/50 active:scale-95"
        aria-label="Ouvrir le chat"
      >
        {isOpen ? <X size={24} /> : <BotIcon size={30} />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[9999] flex h-[min(600px,80vh)] w-[420px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/50 dark:border-slate-700 dark:bg-slate-800 dark:shadow-slate-900/50">
          <div className="flex items-center justify-between border-b border-slate-200 bg-orange-50 px-5 py-3 dark:border-slate-700 dark:bg-orange-900/20">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white">
                <BotIcon size={19} />
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">
                Assistant Smart Syndic
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                    msg.role === "user"
                      ? "bg-orange-500 text-white"
                      : "bg-slate-100 text-slate-900 dark:bg-slate-700 dark:text-white"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>

                  {msg.apartments && msg.apartments.length > 0 && (
                    <div className="mt-3">
                      <p className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                        {msg.apartments.length} appartement
                        {msg.apartments.length > 1 ? "s" : ""} trouvé
                        {msg.apartments.length > 1 ? "s" : ""}
                      </p>
                      <div className="space-y-2">
                        {msg.apartments.map((apt) => (
                          <ApartmentPreviewCard
                            key={apt.id}
                            apartment={apt}
                            onClick={() => navigate(`/apartments/${apt.id}`)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isPending && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                  <Loader2 size={16} className="animate-spin" />
                  En cours de réflexion…
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-slate-200 p-3 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Posez une question..."
                className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-orange-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
                disabled={isPending}
              />
              <button
                onClick={sendMessage}
                disabled={isPending || !inputValue.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white transition hover:bg-orange-600 disabled:opacity-50"
                aria-label="Envoyer"
              >
                {isPending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Carte d’aperçu (utilise les champs de la réponse Postman) ──────────

function ApartmentPreviewCard({
  apartment,
  onClick,
}: {
  apartment: ApartmentResult;
  onClick: () => void;
}) {
  const {
    apartment_number,
    residence_name,
    city,
    capacity,
    bedrooms,
    bathrooms,
    price_per_night,
    photo_url,
    status,
    view_type,
  } = apartment;

  return (
    <div
      onClick={onClick}
      className="group flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white p-2 transition hover:border-orange-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
    >
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-700">
        {photo_url ? (
          <img
            src={photo_url}
            alt={`Appartement ${apartment_number}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-400">
            <ImageOff size={20} />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold text-slate-900 dark:text-white">
            Appartement {apartment_number}
          </span>
          {status && (
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                status === "available"
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : status === "occupied"
                  ? "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
              }`}
            >
              {status === "available" ? "Disponible" : status}
            </span>
          )}
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500 dark:text-slate-400">
          {residence_name && (
            <span className="flex items-center gap-0.5">
              <Home size={12} />
              {residence_name}
            </span>
          )}
          {city && (
            <span className="flex items-center gap-0.5">
              <MapPin size={12} />
              {city}
            </span>
          )}
          {view_type && (
            <span className="flex items-center gap-0.5">
              <Tag size={12} />
              {view_type}
            </span>
          )}
          {capacity && (
            <span className="flex items-center gap-0.5">
              <Users size={12} />
              {capacity}
            </span>
          )}
          {bedrooms && (
            <span className="flex items-center gap-0.5">
              <Bed size={12} />
              {bedrooms}
            </span>
          )}
          {bathrooms && (
            <span className="flex items-center gap-0.5">
              <Bath size={12} />
              {bathrooms}
            </span>
          )}
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
            {price_per_night ? `${parseFloat(price_per_night).toFixed(0)} MAD` : "Prix non défini"}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="rounded-lg bg-orange-50 px-2 py-0.5 text-xs font-semibold text-orange-600 transition hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400"
          >
            Voir
          </button>
        </div>
      </div>
    </div>
  );
}