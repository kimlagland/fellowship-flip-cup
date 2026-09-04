import { useEffect, useState } from "react";
import { useLanguage } from "@/i18n";
import { Maximize, Minimize, Tv } from "lucide-react";

const STORAGE_KEY = "baraddur:tv";

export function TvToggle() {
  const [tv, setTv] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === "1") setTv(true);
    const onExternal = (e: Event) => setTv((e as CustomEvent<boolean>).detail);
    window.addEventListener("baraddur:tv", onExternal);
    return () => window.removeEventListener("baraddur:tv", onExternal);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("tv", tv);
  }, [tv]);

  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleTv = () => {
    const next = !tv;
    setTv(next);
    localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen?.();
  };

  const base =
    "h-11 w-11 rounded-full border bg-card/80 backdrop-blur flex items-center justify-center transition-colors";

  return (
    <div className="fixed top-4 right-16 z-50 flex gap-2">
      <button
        type="button"
        onClick={toggleFullscreen}
        aria-label={fullscreen ? t.exitFullscreen : t.fullscreen}
        className={`${base} border-border/60 text-foreground hover:border-primary/60`}
      >
        {fullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
      </button>
      <button
        type="button"
        onClick={toggleTv}
        aria-label={tv ? t.tvOff : t.tvOn}
        aria-pressed={tv}
        className={`${base} ${
          tv ? "border-primary text-primary ring-glow" : "border-border/60 text-foreground hover:border-primary/60"
        }`}
      >
        <Tv className="h-5 w-5" />
      </button>
    </div>
  );
}
