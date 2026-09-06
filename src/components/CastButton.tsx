import { useEffect, useState } from "react";
import { useLanguage } from "@/i18n";
import { Cast } from "lucide-react";

const GAME_STORAGE_KEY = "baraddur:game";

interface PresentationRequestLike {
  start(): Promise<unknown>;
  getAvailability(): Promise<{ value: string; onchange: (() => void) | null }>;
}

declare global {
  interface Window {
    PresentationRequest?: new (urls: string | string[]) => PresentationRequestLike;
  }
}

function encodeState(json: string): string {
  return encodeURIComponent(btoa(unescape(encodeURIComponent(json))));
}

export function CastButton() {
  const { t } = useLanguage();
  const [supported, setSupported] = useState(false);
  const [casting, setCasting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!window.PresentationRequest) return;
    // Probe whether any cast-capable display (Chromecast etc.) is available
    try {
      const probe = new window.PresentationRequest(window.location.origin + "/");
      probe
        .getAvailability()
        .then((availability) => {
          setSupported(availability.value === "available");
          availability.onchange = () =>
            setSupported(availability.value === "available");
        })
        .catch(() => setSupported(false));
    } catch {
      setSupported(false);
    }
  }, []);

  const handleClick = () => {
    if (!window.PresentationRequest || loading) return;
    setLoading(true);
    // Bundle the current game state into the URL so the TV shows the same game
    const saved = localStorage.getItem(GAME_STORAGE_KEY);
    const url = saved
      ? `${window.location.origin}/#cast=${encodeState(saved)}`
      : `${window.location.origin}/`;
    const request = new window.PresentationRequest(url);
    request
      .start()
      .then(() => {
        setCasting(true);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      aria-label={casting ? t.casting : t.castTo}
      aria-pressed={casting}
      title={casting ? t.castingTitle : t.castTo}
      className={`fixed top-4 right-28 z-50 h-11 w-11 rounded-sm border bg-card/90 backdrop-blur flex items-center justify-center transition-colors ${
        casting
          ? "border-primary text-primary ring-glow"
          : "border-border/60 text-foreground hover:border-primary/60"
      } ${loading ? "opacity-50" : ""}`}
    >
      <Cast className="h-5 w-5" />
    </button>
  );
}
