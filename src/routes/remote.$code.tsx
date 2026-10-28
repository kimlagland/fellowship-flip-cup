import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Pause, Play, Skull, Undo2, Eye, Crown, Wifi, WifiOff } from "lucide-react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";
import { characters, characterRules, factionLabels, findRelations, relationLabel, relationDetail } from "@/data/characters";
import { roomChannel, type RemoteCommand, type RemoteState } from "@/lib/remote";

export const Route = createFileRoute("/remote/$code")({
  head: () => ({
    meta: [
      { title: "Barad'dur – Fjärrkontroll" },
      { name: "description", content: "Styr Barad'dur-matchen från mobilen och se ditt karaktärskort." },
      { property: "og:title", content: "Barad'dur – Fjärrkontroll" },
      { property: "og:description", content: "Styr matchen från bordet och se dina regler i mobilen." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RemotePage,
});

const S = {
  sv: { title: "Fjärrkontroll", room: "Rum", waiting: "Väntar på matchen på TV:n…", who: "Vem är du?", change: "Byt spelare", pause: "Pausa", resume: "Fortsätt", wrath: "Väck Saurons vrede", eliminate: "Slå ut", undo: "Ångra", out: "Ute", players: "Spelare", yourCard: "Ditt kort", rules: "Regler", relations: "Kopplingar", winner: "Vinnare", connected: "Ansluten", offline: "Ej ansluten" },
  en: { title: "Remote", room: "Room", waiting: "Waiting for the match on the TV…", who: "Who are you?", change: "Change player", pause: "Pause", resume: "Resume", wrath: "Awaken Sauron's Wrath", eliminate: "Knock out", undo: "Undo", out: "Out", players: "Players", yourCard: "Your card", rules: "Rules", relations: "Connections", winner: "Winner", connected: "Connected", offline: "Not connected" },
};

const factionColor = (f: string) =>
  f === "good" ? "var(--color-good)" : f === "evil" ? "var(--color-evil)" : "var(--color-neutral)";

function RemotePage() {
  const { code } = Route.useParams();
  const { lang } = useLanguage();
  const s = S[lang];
  const [state, setState] = useState<RemoteState | null>(null);
  const [connected, setConnected] = useState(false);
  const [me, setMe] = useState<string | null>(null);
  const channel = useRef<RealtimeChannel | null>(null);
  const meKey = `baraddur:remote-me:${code.toUpperCase()}`;

  useEffect(() => { setMe(localStorage.getItem(meKey)); }, [meKey]);

  useEffect(() => {
    const ch = supabase.channel(roomChannel(code), { config: { broadcast: { self: false } } });
    ch.on("broadcast", { event: "state" }, ({ payload }) => setState(payload as RemoteState));
    ch.subscribe((status) => {
      setConnected(status === "SUBSCRIBED");
      if (status === "SUBSCRIBED") ch.send({ type: "broadcast", event: "cmd", payload: { action: "hello" } satisfies RemoteCommand });
    });
    channel.current = ch;
    return () => { supabase.removeChannel(ch); channel.current = null; };
  }, [code]);

  const send = (cmd: RemoteCommand) => channel.current?.send({ type: "broadcast", event: "cmd", payload: cmd });
  const pickMe = (p: string | null) => { setMe(p); p ? localStorage.setItem(meKey, p) : localStorage.removeItem(meKey); };

  const mine = state?.players.find((p) => p.player === me);
  const myChar = mine && characters.find((c) => c.name === mine.character);
  const myRelations = mine && state
    ? findRelations(state.players.map((p) => p.character)).filter((r) => r.a === mine.character || r.b === mine.character)
    : [];
  const playerOf = (name: string) => state?.players.find((p) => p.character === name)?.player ?? "?";
  const fmt = (sec: number) => `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;

  return (
    <main className="min-h-[100dvh] bg-background text-foreground px-4 py-5 max-w-lg mx-auto space-y-4">
      <header className="flex items-center justify-between gap-2">
        <div>
          <h1 className="font-display text-4xl uppercase text-primary leading-none">{s.title}</h1>
          <div className="text-sm text-muted-foreground">{s.room} <span className="font-display text-lg tracking-widest text-foreground">{code.toUpperCase()}</span></div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            {connected ? <Wifi className="h-4 w-4 text-primary" /> : <WifiOff className="h-4 w-4" />}
            {connected ? s.connected : s.offline}
          </span>
          <LanguageToggle />
        </div>
      </header>

      {!state ? (
        <div className="bento p-6 text-center text-muted-foreground">{s.waiting}</div>
      ) : !mine ? (
        <section className="bento p-5 space-y-3">
          <h2 className="font-display text-2xl uppercase">{s.who}</h2>
          <div className="grid grid-cols-2 gap-2">
            {state.players.map((p) => (
              <Button key={p.player} variant="outline" onClick={() => pickMe(p.player)} className="h-14 rounded-sm text-lg" style={{ borderLeft: `4px solid ${factionColor(p.faction)}` }}>
                {p.player}
              </Button>
            ))}
          </div>
        </section>
      ) : (
        <>
          <section className="bento p-4 flex items-center justify-between gap-3">
            <div className="font-display text-5xl tabular-nums">{fmt(state.elapsed)}</div>
            <Button variant="outline" onClick={() => send({ action: "toggle" })} disabled={!!state.winners} className="h-12 rounded-sm">
              {state.running ? <><Pause className="h-4 w-4 mr-1" />{s.pause}</> : <><Play className="h-4 w-4 mr-1" />{s.resume}</>}
            </Button>
          </section>

          {state.winners && (
            <section className="bento p-4 text-center">
              <Crown className="h-8 w-8 mx-auto text-gold" />
              <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{s.winner}</div>
              <div className="font-display text-3xl text-gradient-gold">{state.winners.join(" · ")}</div>
            </section>
          )}

          <Button onClick={() => send({ action: "wrath" })} disabled={!!state.winners} className="w-full h-14 text-lg rounded-sm">
            <Eye className="h-5 w-5 mr-2" />{s.wrath}
          </Button>

          <section className="space-y-2">
            <h2 className="font-display text-2xl uppercase">{s.players}</h2>
            {state.players.map((p) => {
              const isOut = p.player in state.out;
              return (
                <div key={p.player} className={`bento p-3 flex items-center justify-between gap-2 ${isOut ? "opacity-50" : ""}`} style={{ borderLeft: `4px solid ${factionColor(p.faction)}` }}>
                  <div className="min-w-0">
                    <div className="font-display text-xl truncate">{p.player}</div>
                    <div className="text-xs uppercase tracking-widest text-primary truncate">{p.character}</div>
                  </div>
                  {isOut ? (
                    <Button size="lg" variant="ghost" onClick={() => send({ action: "revive", player: p.player })}><Undo2 className="h-4 w-4 mr-1" />{s.undo}</Button>
                  ) : (
                    <Button size="lg" variant="outline" disabled={!!state.winners} onClick={() => send({ action: "eliminate", player: p.player })} className="rounded-sm"><Skull className="h-4 w-4 mr-1" />{s.eliminate}</Button>
                  )}
                </div>
              );
            })}
          </section>

          {myChar && (
            <section className="bento p-5 space-y-3" style={{ borderLeft: `6px solid ${factionColor(myChar.faction)}` }}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{s.yourCard} · {factionLabels[lang][myChar.faction]}</div>
                  <div className="font-display text-3xl uppercase">{myChar.name}</div>
                  <div className="text-sm text-muted-foreground">{mine.player}</div>
                </div>
                <Button size="sm" variant="ghost" onClick={() => pickMe(null)}>{s.change}</Button>
              </div>
              <div>
                <h3 className="font-display text-lg uppercase text-gradient-gold">{s.rules}</h3>
                <ul className="list-disc pl-5 space-y-1">{characterRules(myChar, lang).map((r, i) => <li key={i}>{r}</li>)}</ul>
              </div>
              {myRelations.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-display text-lg uppercase text-gradient-gold">{s.relations}</h3>
                  {myRelations.map((r, i) => {
                    const other = r.a === myChar.name ? r.b : r.a;
                    return (
                      <div key={i} className="rounded-sm bg-background/60 p-3" style={{ borderLeft: `3px solid ${r.kind === "ally" ? "var(--color-good)" : "var(--color-evil)"}` }}>
                        <div className="font-semibold">{relationLabel(r, lang)}: {other} ({playerOf(other)})</div>
                        <div className="text-sm text-muted-foreground">{relationDetail(r, lang)}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}
        </>
      )}
    </main>
  );
}
