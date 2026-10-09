"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement)
      .value;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) throw new Error("Gönderim başarısız");

      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="font-display text-sm uppercase tracking-wide text-navy">
          Ad Soyad
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-2 w-full rounded-xl border border-line bg-surface px-4 py-3 text-ink transition focus:border-teal focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal/20"
        />
      </div>

      <div>
        <label htmlFor="email" className="font-display text-sm uppercase tracking-wide text-navy">
          E-posta
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-2 w-full rounded-xl border border-line bg-surface px-4 py-3 text-ink transition focus:border-teal focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal/20"
        />
      </div>

      <div>
        <label htmlFor="message" className="font-display text-sm uppercase tracking-wide text-navy">
          Mesajınız
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="mt-2 w-full rounded-xl border border-line bg-surface px-4 py-3 text-ink transition focus:border-teal focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal/20"
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-full bg-sun px-7 py-3 font-display text-sm uppercase tracking-wide text-navy-deep shadow-md shadow-sun/30 transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60"
      >
        {status === "sending" ? "Gönderiliyor..." : "Gönder"}
      </button>

      {status === "sent" && (
        <p className="text-sm text-teal-deep">
          Mesajınız gönderildi — en kısa sürede size dönüş yapacağız.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-500">
          Bir şeyler ters gitti, lütfen tekrar deneyin ya da doğrudan bizi arayın.
        </p>
      )}
    </form>
  );
}