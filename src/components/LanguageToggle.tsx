import { Languages } from "lucide-react";
import { useLanguage } from "@/i18n";

export function LanguageToggle() {
  const { lang, setLang, t } = useLanguage();

  return (
    <button
      type="button"
      onClick={() => setLang(lang === "sv" ? "en" : "sv")}
      aria-label={t.switchLang}
      title={t.switchLang}
      className="fixed top-4 right-40 z-50 h-11 gap-1.5 px-3 rounded-full border border-border/60 bg-card/80 backdrop-blur flex items-center justify-center text-foreground hover:border-primary/60 transition-colors"
    >
      <Languages className="h-5 w-5" />
      <span className="text-xs font-semibold uppercase tracking-wider">
        {lang === "sv" ? "EN" : "SV"}
      </span>
    </button>
  );
}
