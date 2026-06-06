"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, ArrowRight } from "lucide-react";

interface ContactExchangeFormProps {
  cardId: string;
  accentColor: string;
  ownerName: string;
}

export function ContactExchangeForm({ cardId, accentColor, ownerName }: ContactExchangeFormProps) {
  const [form, setForm]       = useState({ name: "", email: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen]       = useState(false);

  const set = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setLoading(true);
    // Wired to real action in Phase 12
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div
        className="rounded-2xl p-6 text-center border"
        style={{ backgroundColor: "#ECFDF5", borderColor: "rgba(5,150,105,0.2)" }}
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: accentColor }}
        >
          <CheckCircle2 className="h-6 w-6" style={{ color: "#FEFCE8" }} />
        </div>
        <p className="font-serif text-lg font-semibold text-emerald-deep mb-1">Contact shared!</p>
        <p className="text-sm text-ink-light">
          {ownerName} will receive your details.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ borderColor: "rgba(6,78,59,0.1)", backgroundColor: "#FEF9EF" }}
    >
      {/* Header — always visible toggle */}
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors hover:bg-emerald-pale/40"
        onClick={() => setOpen((v) => !v)}
      >
        <div>
          <p className="text-sm font-semibold text-emerald-deep">Share your contact</p>
          <p className="text-xs text-ink-light mt-0.5">Let {ownerName.split(" ")[0]} know who you are</p>
        </div>
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200"
          style={{
            backgroundColor: accentColor,
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
          }}
        >
          <ArrowRight className="h-3.5 w-3.5" style={{ color: "#FEFCE8" }} />
        </div>
      </button>

      {/* Form — revealed on open */}
      {open && (
        <form onSubmit={submit} className="px-5 pb-5 space-y-3 border-t border-cream-dark animate-fade-up">
          <div className="pt-3" />
          <Input
            label="Your name"
            placeholder="Jane Doe"
            required
            value={form.name}
            onChange={set("name")}
          />
          <Input
            label="Email"
            placeholder="you@email.com"
            type="email"
            value={form.email}
            onChange={set("email")}
            hint="Optional"
          />
          <Input
            label="Phone"
            placeholder="+250 7XX XXX XXX"
            type="tel"
            value={form.phone}
            onChange={set("phone")}
            hint="Optional"
          />
          <Button
            type="submit"
            size="lg"
            className="w-full mt-1"
            loading={loading}
            rightIcon={!loading ? <ArrowRight className="h-4 w-4" /> : undefined}
            style={{ backgroundColor: accentColor, color: "#FEFCE8" }}
          >
            Send my contact
          </Button>
        </form>
      )}
    </div>
  );
}