import { useEffect, useState } from "react";
import { useLanguage } from "@/i18n";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "baraddur:theme";

export function ThemeToggle() {
  const { t } = useLanguage();
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") setTheme(saved);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? t.toLight : t.toDark}
      className="fixed top-4 right-4 z-50 h-11 w-11 rounded-sm border border-border/60 bg-card/90 backdrop-blur flex items-center justify-center text-foreground hover:border-primary transition-colors"
    >
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
