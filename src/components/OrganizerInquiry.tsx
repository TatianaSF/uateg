"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import type { Locale } from "@/content/schema";
import { OrganizerRequestSchema, organizerAdapterFromConfig, FORM_NOT_CONFIGURED } from "@/lib/organizer";
import { t } from "@/lib/i18n";

const endpoint = process.env.NEXT_PUBLIC_ORGANIZER_FORM_ENDPOINT;
const provider = process.env.NEXT_PUBLIC_ORGANIZER_FORM_PROVIDER;

export function OrganizerInquiry({ locale }: { locale: Locale }) {
  const [message, setMessage] = useState("");
  const adapter = organizerAdapterFromConfig(endpoint, provider);
  if (!adapter) return <section className="form-not-configured" aria-labelledby="form-state" data-form-state={FORM_NOT_CONFIGURED}>
    <span className="form-status-kicker">{locale === "en" ? "Inquiry status" : "Статус звернень"}</span>
    <h2 id="form-state">{t(locale, "formOff")}</h2>
    <p>{t(locale, "noContact")}</p>
    <Link prefetch={false} className="text-link organize-contact-link" href={`/${locale}/contact/`}>{locale === "en" ? "View historical contact details" : "Переглянути історичні контакти"} <span aria-hidden="true">→</span></Link>
  </section>;
  const activeAdapter = adapter;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const result = OrganizerRequestSchema.safeParse(Object.fromEntries(data.entries()));
    if (!result.success) { setMessage(locale === "en" ? "Please check the required fields." : "Перевірте обов’язкові поля."); return; }
    try {
      await activeAdapter.submit(result.data);
      setMessage(locale === "en" ? "Your inquiry was sent." : "Ваше звернення надіслано.");
      form.reset();
    } catch {
      setMessage(locale === "en" ? "The provider could not receive this inquiry. Please try again later." : "Сервіс не зміг отримати звернення. Спробуйте пізніше.");
    }
  }

  return <form className="organizer-form" onSubmit={submit}>
    <label>{locale === "en" ? "Name" : "Ім’я"}<input name="fullName" autoComplete="name" required minLength={2} /></label>
    <label>Email<input name="email" type="email" autoComplete="email" required /></label>
    <label>{t(locale, "country")}<input name="country" required /></label>
    <label>{t(locale, "city")}<input name="city" required /></label>
    <label>{locale === "en" ? "Planned date (optional)" : "Запланована дата (необов’язково)"}<input name="plannedDate" type="date" /></label>
    <label>{locale === "en" ? "Message" : "Повідомлення"}<textarea name="message" required minLength={10} rows={5} /></label>
    <label className="consent-row"><input name="privacyConsent" type="checkbox" value="true" required />{t(locale, "privacyConsent")}</label>
    <button className="button button-primary" type="submit">{locale === "en" ? "Send inquiry" : "Надіслати звернення"}</button>
    <p aria-live="polite">{message}</p>
  </form>;
}
