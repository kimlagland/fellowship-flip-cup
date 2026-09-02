import { useEffect, useRef, useState } from "react";
import { Cast } from "lucide-react";

const SDK_URL =
  "https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1";
const TV_STORAGE_KEY = "baraddur:tv";

declare global {
  interface Window {
    chrome?: {
      cast?: {
        isAvailable?: boolean;
        requestSession?: (
          onSuccess: (session: CastSession) => void,
          onError: (err: unknown) => void,
        ) => void;
        SessionRequest?: new (appId: string) => unknown;
        ApiConfig?: new (
          sessionRequest: unknown,
          sessionListener: (session: CastSession) => void,
          receiverListener: (availability: string) => void,
        ) => unknown;
        AutoJoinPolicy?: { ORIGIN_SCOPED: string };
        initialize?: (
          apiConfig: unknown,
          onSuccess: () => void,
          onError: (err: unknown) => void,
        ) => void;
      };
    };
    __onGCastApiAvailable?: (isAvailable: boolean) => void;
  }
}

interface CastSession {
  stop: (onSuccess?: () => void, onError?: (err: unknown) => void) => void;
}

// Default Media Receiver app ID (mirrors the current page to the TV)
const DEFAULT_APP_ID = "CC1AD845";

export function CastButton() {
  const [supported, setSupported] = useState(false);
  const [casting, setCasting] = useState(false);
  const [loading, setLoading] = useState(false);
  const sessionRef = useRef<CastSession | null>(null);

  useEffect(() => {
    // The Cast SDK calls this global callback once loaded
    window.__onGCastApiAvailable = (isAvailable: boolean) => {
      if (!isAvailable) return;
      initCast();
    };
    loadSdk();
    return () => {
      window.__onGCastApiAvailable = undefined;
    };
  }, []);

  const loadSdk = () => {
    if (document.querySelector(`script[src^="${SDK_URL.split("?")[0]}"]`)) {
      // Script tag exists; availability callback may have fired before mount
      if (window.chrome?.cast?.isAvailable) initCast();
      return;
    }
    const script = document.createElement("script");
    script.src = SDK_URL;
    script.async = true;
    document.head.appendChild(script);
  };

  const initCast = () => {
    const cast = window.chrome?.cast;
    if (!cast?.SessionRequest || !cast.ApiConfig || !cast.initialize) return;
    try {
      const sessionRequest = new cast.SessionRequest(DEFAULT_APP_ID);
      const apiConfig = new cast.ApiConfig(
        sessionRequest,
        () => setCasting(true),
        (availability: string) => setSupported(availability === "available"),
      );
      cast.initialize(
        apiConfig,
        () => setSupported(true),
        () => setSupported(false),
      );
    } catch {
      setSupported(false);
    }
  };

  const setTvMode = (on: boolean) => {
    document.documentElement.classList.toggle("tv", on);
    localStorage.setItem(TV_STORAGE_KEY, on ? "1" : "0");
    window.dispatchEvent(new CustomEvent("baraddur:tv", { detail: on }));
  };

  const handleClick = () => {
    const cast = window.chrome?.cast;
    if (!cast?.requestSession || loading) return;
    setLoading(true);
    cast.requestSession(
      (session) => {
        setLoading(false);
        setCasting(true);
        sessionRef.current = session;
        // Big text suits the TV — enable TV mode while casting
        if (!document.documentElement.classList.contains("tv")) setTvMode(true);
      },
      () => setLoading(false),
    );
  };

  const stopCasting = () => {
    sessionRef.current?.stop(
      () => {
        sessionRef.current = null;
        setCasting(false);
      },
      () => {
        sessionRef.current = null;
        setCasting(false);
      },
    );
  };

  if (!supported && !casting) return null;

  return (
    <button
      type="button"
      onClick={casting ? stopCasting : handleClick}
      disabled={loading}
      aria-label={casting ? "Koppla från Chromecast" : "Casta till Chromecast"}
      aria-pressed={casting}
      className={`fixed top-4 right-28 z-50 h-11 w-11 rounded-full border bg-card/80 backdrop-blur flex items-center justify-center transition-colors ${
        casting
          ? "border-primary text-primary ring-glow"
          : "border-border/60 text-foreground hover:border-primary/60"
      } ${loading ? "opacity-50" : ""}`}
    >
      <Cast className="h-5 w-5" />
    </button>
  );
}
