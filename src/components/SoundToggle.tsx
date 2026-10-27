import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useLanguage } from "@/i18n";
import { isSoundOn, setSoundOn } from "@/lib/sound";

export function SoundToggle() {
  const { t } = useLanguage();
  const [on, setOn] = useState(true);
  useEffect(() => setOn(isSoundOn()), []);
  const toggle = () => {
    setSoundOn(!on);
    setOn(!on);
  };
  const label = on ? t.soundOff : t.soundOn;
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="h-11 w-11 rounded-sm border border-border/60 bg-card/90 backdrop-blur flex items-center justify-center text-foreground hover:border-primary transition-colors"
    >
      {on ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
    </button>
  );
}
