"use client";

import { useEffect } from "react";
import type { Locale } from "@/content/schema";

export function LanguageAttribute({ locale }: { locale: Locale }) {
  useEffect(() => { document.documentElement.lang = locale; }, [locale]);
  return null;
}
