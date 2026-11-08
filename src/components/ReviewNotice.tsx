import type { Locale } from "@/content/schema";
import { t } from "@/lib/i18n";

export function ReviewNotice({ locale, children }: { locale: Locale; children?: React.ReactNode }) {
  return <p className="review-notice"><span aria-hidden="true">◌</span> {children ?? t(locale, "reviewBanner")}</p>;
}
