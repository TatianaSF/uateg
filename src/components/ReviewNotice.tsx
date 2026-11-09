import type { Locale } from "@/content/schema";
import { t } from "@/lib/i18n";

export function ReviewNotice({ locale, children, className = "" }: { locale: Locale; children?: React.ReactNode; className?: string }) {
  return <p className={`review-notice ${className}`.trim()}><span aria-hidden="true">◌</span> {children ?? t(locale, "reviewBanner")}</p>;
}
