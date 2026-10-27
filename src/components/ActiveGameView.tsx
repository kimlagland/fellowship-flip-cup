import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pause, Play, RotateCcw, Skull, Undo2, Crown, Flame, BarChart3, Trash2, Eye } from "lucide-react";
import { useLanguage } from "@/i18n";
import type { Character } from "@/data/characters";
import { wrathCards, type WrathCard } from "@/data/sauronsWrath";
import { playEliminate, playRumble, playVictory } from "@/lib/sound";
import { SoundToggle } from "@/components/SoundToggle";

interface Assignment { player: string; character: Character }

export interface MatchRecord {
  date: number;
  durationSec: number;
  winner: string;
  winnerCharacter: string;
  firstOut: string | null;
  players: { player: string; character: string; faction: string; outAt: number | null }[];
  /** Set when a whole team won; older records only have `winner`. */
  winners?: string[];
  winningTeam?: "good" | "evil";
}

type Teams = { good: string[]; evil: string[] } | null;

/** Seconds until the next automatic wrath card: 4–8 minutes. */
const randInterval = () => 240 + Math.floor(Math.random() * 240);

const STATS_KEY = "baraddur:stats";

export function loadStats(): MatchRecord[] {
  try { return JSON.parse(localStorage.getItem(STATS_KEY) || "[]"); } catch { return []; }
}

const fmt = (s: number) => {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return `${h > 0 ? `${h}:` : ""}${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

const factionColor = (f: string) =>
  f === "good" ? "var(--color-good)" : f === "evil" ? "var(--color-evil)" : "var(--color-neutral)";

const S = {
  sv: {
    title: "Striden pågår", desc: "Markera vem som åker ut. Sista som står vinner.",
    pause: "Pausa", resume: "Fortsätt", resetTimer: "Nollställ", out: "Ute", eliminate: "Slå ut", undo: "Ångra",
    wrath: "Väck Saurons vrede", auto: "Automatisk vrede", autoHint: "Slumpas var 4–8 min", next: "Nästa vrede om",
    winner: "Vinnare", pickWinner: "Välj vinnare för att avsluta", finish: "Avsluta & spara match", close: "Stäng",
    stats: "Kvällens statistik", matches: "Matcher", totalTime: "Total tid", avgTime: "Snittid",
    leaderboard: "Segerliga", wins: "vinster", bestChar: "Dödligaste karaktär", firstOut: "Oftast först ute", firstOutChar: "Första offret (karaktär)", teamWins: "vinner",
    factionWins: "Goda vs Onda", good: "Goda", evil: "Onda", neutral: "Neutrala", clear: "Rensa statistik",
    noStats: "Inga matcher spelade än i kväll.", saved: "Matchen sparad!", dismiss: "Uppfattat", history: "Matcher i kväll", outAt: "ute",
  },
  en: {
    title: "Battle in progress", desc: "Mark who gets knocked out. Last one standing wins.",
    pause: "Pause", resume: "Resume", resetTimer: "Reset", out: "Out", eliminate: "Knock out", undo: "Undo",
    wrath: "Awaken Sauron's Wrath", auto: "Automatic wrath", autoHint: "Random every 4–8 min", next: "Next wrath in",
    winner: "Winner", pickWinner: "Pick a winner to finish", finish: "Finish & save match", close: "Close",
    stats: "Tonight's stats", matches: "Matches", totalTime: "Total time", avgTime: "Average",
    leaderboard: "Leaderboard", wins: "wins", bestChar: "Deadliest character", firstOut: "Most often first out", firstOutChar: "First victim (character)", teamWins: "win",
    factionWins: "Good vs Evil", good: "Good", evil: "Evil", neutral: "Neutral", clear: "Clear stats",
    noStats: "No matches played tonight yet.", saved: "Match saved!", dismiss: "Got it", history: "Tonight's matches", outAt: "out",
  },
};

export function ActiveGameView({ open, onOpenChange, assignments, teams = null }: { open: boolean; onOpenChange: (o: boolean) => void; assignments: Assignment[]; teams?: Teams }) {
  const { lang } = useLanguage();
  const s = S[lang];
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(true);
  const [out, setOut] = useState<Record<string, number>>({});
  const [winners, setWinners] = useState<string[] | null>(null);
  const winner = winners?.[0] ?? null;
  const [card, setCard] = useState<WrathCard | null>(null);
  const [auto, setAuto] = useState(true);
  // Must start above 0, otherwise the countdown fires a card the instant the view opens
  const [nextWrath, setNextWrath] = useState(() => randInterval());
  const [stats, setStats] = useState<MatchRecord[]>([]);
  const [tab, setTab] = useState<"game" | "stats">("game");
  const [savedMsg, setSavedMsg] = useState(false);
  const deck = useRef<number[]>([]);

  // Fresh match on open
  useEffect(() => {
    if (!open) return;
    setStats(loadStats());
    setElapsed(0); setRunning(true); setOut({}); setWinners(null); setCard(null); setTab("game"); setSavedMsg(false);
    setNextWrath(randInterval());
  }, [open]);

  useEffect(() => {
    if (!open || !running || winner) return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [open, running, winner]);

  const drawWrath = () => {
    if (deck.current.length === 0) deck.current = [...wrathCards.keys()].sort(() => Math.random() - 0.5);
    setCard(wrathCards[deck.current.pop()!]);
    playRumble();
  };

  // Automatic wrath countdown
  useEffect(() => {
    if (!open || !auto || !running || winner || tab !== "game") return;
    if (nextWrath <= 0) { drawWrath(); setNextWrath(randInterval()); return; }
    const id = setTimeout(() => setNextWrath((n) => n - 1), 1000);
    return () => clearTimeout(id);
  }, [open, auto, running, winner, nextWrath, tab]);

  const alive = assignments.filter((a) => !(a.player in out));
  const teamOf = (p: string) => (teams?.good.includes(p) ? "good" : teams?.evil.includes(p) ? "evil" : null);
  const winningTeam = winners && winners.length > 1 ? teamOf(winners[0]) : null;

  // Auto-crown last standing player, or the last team standing when teams are drawn
  useEffect(() => {
    if (!open || winners || assignments.length < 2) return;
    if (alive.length === 1) { setWinners([alive[0].player]); playVictory(); return; }
    const side = alive.length > 0 ? teamOf(alive[0].player) : null;
    if (side && alive.every((a) => teamOf(a.player) === side)) {
      setWinners(assignments.filter((a) => teamOf(a.player) === side).map((a) => a.player));
      playVictory();
    }
  }, [alive.length, open]);

  const eliminate = (p: string) => { setOut({ ...out, [p]: elapsed }); playEliminate(); };
  const revive = (p: string) => { const n = { ...out }; delete n[p]; setOut(n); if (winners) setWinners(null); };

  const finish = () => {
    if (!winners || !winner) return;
    const w = assignments.find((a) => a.player === winner)!;
    const outs = Object.entries(out).sort((a, b) => a[1] - b[1]);
    const rec: MatchRecord = {
      date: Date.now(), durationSec: elapsed, winner, winnerCharacter: w.character.name,
      firstOut: outs[0]?.[0] ?? null,
      players: assignments.map((a) => ({ player: a.player, character: a.character.name, faction: a.character.faction, outAt: out[a.player] ?? null })),
      winners, winningTeam: winningTeam ?? undefined,
    };
    const next = [...loadStats(), rec];
    localStorage.setItem(STATS_KEY, JSON.stringify(next));
    setStats(next); setSavedMsg(true); setTab("stats"); setRunning(false);
  };

  const clearStats = () => { localStorage.removeItem(STATS_KEY); setStats([]); };

  const summary = useMemo(() => {
    const count = <T extends string>(arr: T[]) => {
      const m = new Map<T, number>(); arr.forEach((x) => m.set(x, (m.get(x) ?? 0) + 1));
      return [...m.entries()].sort((a, b) => b[1] - a[1]);
    };
    const total = stats.reduce((n, r) => n + r.durationSec, 0);
    const winnersOf = (r: MatchRecord) => r.winners ?? [r.winner];
    const factionOf = (r: MatchRecord) => r.winningTeam ?? r.players.find((p) => p.player === r.winner)?.faction ?? "neutral";
    // Deadliest character = highest win rate over the matches it was played in
    const played = count(stats.flatMap((r) => r.players.map((p) => p.character)));
    const charWins = new Map(count(stats.flatMap((r) => r.players.filter((p) => winnersOf(r).includes(p.player)).map((p) => p.character))));
    const chars = played
      .map(([c, n]) => ({ c, wins: charWins.get(c) ?? 0, played: n }))
      .filter((x) => x.wins > 0)
      .sort((a, b) => b.wins / b.played - a.wins / a.played || b.wins - a.wins);
    const firstOutChar = (r: MatchRecord) => r.players.find((p) => p.player === r.firstOut)?.character;
    return {
      total, avg: stats.length ? Math.round(total / stats.length) : 0,
      leaders: count(stats.flatMap(winnersOf)),
      chars,
      firstOut: count(stats.map((r) => r.firstOut).filter(Boolean) as string[]),
      firstOutChars: count(stats.map(firstOutChar).filter(Boolean) as string[]),
      factions: count(stats.map(factionOf)),
    };
  }, [stats]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-screen max-w-none h-[100dvh] rounded-none sm:w-[95vw] sm:max-w-[1400px] sm:h-[92vh] sm:rounded-sm p-0 overflow-hidden bg-background/95 border-primary/30 flex flex-col">
        <DialogHeader className="shrink-0 px-6 pt-5 pb-3 border-b border-border/40">
          <DialogTitle className="text-center font-display text-5xl uppercase text-primary">{tab === "game" ? s.title : s.stats}</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">{s.desc}</DialogDescription>
          <div className="flex justify-center gap-2 pt-2">
            <Button size="sm" variant={tab === "game" ? "default" : "outline"} onClick={() => setTab("game")} className="rounded-sm"><Flame className="h-4 w-4 mr-1" />{s.title}</Button>
            <Button size="sm" variant={tab === "stats" ? "default" : "outline"} onClick={() => { setStats(loadStats()); setTab("stats"); }} className="rounded-sm"><BarChart3 className="h-4 w-4 mr-1" />{s.stats}</Button>
            <SoundToggle />
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {tab === "game" ? (
            <div className="grid gap-6 lg:grid-cols-12">
              <div className="lg:col-span-4 space-y-4">
                <div className="bento p-5 text-center">
                  <div className="font-display text-7xl tabular-nums text-foreground">{fmt(elapsed)}</div>
                  <div className="flex justify-center gap-2 mt-3">
                    <Button variant="outline" onClick={() => setRunning(!running)} disabled={!!winner} className="rounded-sm">
                      {running ? <><Pause className="h-4 w-4 mr-1" />{s.pause}</> : <><Play className="h-4 w-4 mr-1" />{s.resume}</>}
                    </Button>
                    <Button variant="outline" onClick={() => setElapsed(0)} className="rounded-sm"><RotateCcw className="h-4 w-4 mr-1" />{s.resetTimer}</Button>
                  </div>
                </div>
                <div className="bento p-5 space-y-3">
                  <Button onClick={drawWrath} disabled={!!winner} className="w-full h-14 text-lg rounded-sm whitespace-normal"><Eye className="h-5 w-5 mr-2" />{s.wrath}</Button>
                  <label className="flex items-center justify-between gap-3 text-sm cursor-pointer">
                    <span><span className="font-semibold">{s.auto}</span><br /><span className="text-muted-foreground">{s.autoHint}</span></span>
                    <input type="checkbox" checked={auto} onChange={(e) => setAuto(e.target.checked)} className="h-5 w-5 accent-[var(--color-primary)]" />
                  </label>
                  {auto && !winner && <div className="text-sm text-muted-foreground">{s.next} <span className="tabular-nums text-foreground">{fmt(nextWrath)}</span></div>}
                </div>
              </div>

              <div className="lg:col-span-8 space-y-4">
                {winner && (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bento p-5 text-center border-primary">
                    <Crown className="h-10 w-10 mx-auto text-gold" />
                    <div className="text-sm uppercase tracking-[0.3em] text-muted-foreground">{s.winner}</div>
                    {winningTeam ? (
                      <>
                        <div className="font-display text-5xl uppercase" style={{ color: factionColor(winningTeam) }}>{s[winningTeam]} {s.teamWins}</div>
                        <div className="font-display text-2xl text-gradient-gold">{winners!.join(" · ")}</div>
                      </>
                    ) : (
                      <div className="font-display text-5xl text-gradient-gold">{winner}</div>
                    )}
                    <Button onClick={finish} disabled={savedMsg} className="mt-3 rounded-sm">{savedMsg ? s.saved : s.finish}</Button>
                  </motion.div>
                )}
                {!winner && alive.length > 1 && Object.keys(out).length > 0 && (
                  <p className="text-sm text-muted-foreground">{s.pickWinner}: <Crown className="inline h-4 w-4" /></p>
                )}
                <div className="grid gap-3 sm:grid-cols-2">
                  {assignments.map((a) => {
                    const isOut = a.player in out;
                    return (
                      <div key={a.player} className={`bento p-4 flex items-center justify-between gap-3 transition-opacity ${isOut ? "opacity-45" : ""}`} style={{ borderLeft: `4px solid ${factionColor(a.character.faction)}` }}>
                        <div className="min-w-0">
                          <div className="font-display text-2xl truncate">{a.player}</div>
                          <div className="text-sm uppercase tracking-widest text-primary truncate">{a.character.name}</div>
                          {isOut && <div className="text-sm text-muted-foreground"><Skull className="inline h-4 w-4 mr-1" />{s.out} {fmt(out[a.player])}</div>}
                        </div>
                        <div className="flex gap-1 shrink-0">
                          {isOut ? (
                            <Button size="sm" variant="ghost" onClick={() => revive(a.player)}><Undo2 className="h-4 w-4 mr-1" />{s.undo}</Button>
                          ) : (
                            <>
                              {!winner && <Button size="sm" variant="ghost" title={s.winner} aria-label={s.winner} onClick={() => { setWinners([a.player]); playVictory(); }}><Crown className="h-4 w-4" /></Button>}
                              <Button size="sm" variant="outline" onClick={() => eliminate(a.player)} disabled={!!winner} className="rounded-sm"><Skull className="h-4 w-4 mr-1" />{s.eliminate}</Button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <StatsPanel s={s} stats={stats} summary={summary} clear={clearStats} />
          )}
        </div>

        <div className="shrink-0 px-6 py-3 border-t border-border/40 flex justify-center">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-sm">{s.close}</Button>
        </div>

        <AnimatePresence>
          {card && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur p-6" onClick={() => setCard(null)}>
              <motion.div initial={{ scale: 0.7, rotate: -3 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0.8, opacity: 0 }} className="bento ring-glow max-w-xl w-full p-8 text-center border-primary" onClick={(e) => e.stopPropagation()}>
                <div className="mx-auto mb-4 h-16 w-16 rounded-full animate-pulse" style={{ background: "radial-gradient(circle, var(--color-gold), var(--color-primary) 45%, transparent 70%)" }} />
                <div className="text-sm uppercase tracking-[0.3em] text-muted-foreground">{lang === "sv" ? "Saurons vrede" : "Sauron's Wrath"}</div>
                <div className="font-display text-5xl uppercase text-primary my-2">{card[lang].title}</div>
                <p className="text-xl leading-relaxed text-foreground">{card[lang].text}</p>
                <Button onClick={() => setCard(null)} className="mt-6 rounded-sm h-12 px-8">{s.dismiss}</Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

function StatsPanel({ s, stats, summary, clear }: { s: (typeof S)["sv"]; stats: MatchRecord[]; summary: { total: number; avg: number; leaders: [string, number][]; chars: { c: string; wins: number; played: number }[]; firstOut: [string, number][]; firstOutChars: [string, number][]; factions: [string, number][] }; clear: () => void }) {
  if (stats.length === 0) return <p className="text-center text-muted-foreground py-10 text-lg">{s.noStats}</p>;
  const fLabel = (f: string) => (f === "good" ? s.good : f === "evil" ? s.evil : s.neutral);
  return (
    <div className="space-y-5">
      <div className="grid gap-3 grid-cols-3">
        {[[s.matches, String(stats.length)], [s.totalTime, fmt(summary.total)], [s.avgTime, fmt(summary.avg)]].map(([k, v]) => (
          <div key={k} className="bento p-4 text-center"><div className="text-sm uppercase tracking-widest text-muted-foreground">{k}</div><div className="font-display text-4xl tabular-nums">{v}</div></div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="bento p-4"><h4 className="font-display text-2xl uppercase text-primary mb-2">{s.leaderboard}</h4>
          <ol className="space-y-1">{summary.leaders.map(([p, n], i) => <li key={p} className="flex justify-between"><span>{i === 0 && <Crown className="inline h-4 w-4 mr-1 text-gold" />}{p}</span><span className="tabular-nums text-muted-foreground">{n} {s.wins}</span></li>)}</ol></div>
        <div className="bento p-4"><h4 className="font-display text-2xl uppercase text-primary mb-2">{s.bestChar}</h4>
          <ol className="space-y-1">{summary.chars.slice(0, 5).map((x) => <li key={x.c} className="flex justify-between gap-2"><span>{x.c}</span><span className="tabular-nums text-muted-foreground">{Math.round((x.wins / x.played) * 100)}% ({x.wins}/{x.played})</span></li>)}</ol></div>
        <div className="bento p-4"><h4 className="font-display text-2xl uppercase text-primary mb-2">{s.firstOut}</h4>
          <ol className="space-y-1">{summary.firstOut.slice(0, 5).map(([p, n]) => <li key={p} className="flex justify-between"><span><Skull className="inline h-4 w-4 mr-1" />{p}</span><span className="tabular-nums text-muted-foreground">{n}</span></li>)}</ol></div>
        <div className="bento p-4"><h4 className="font-display text-2xl uppercase text-primary mb-2">{s.firstOutChar}</h4>
          <ol className="space-y-1">{summary.firstOutChars.slice(0, 5).map(([c, n]) => <li key={c} className="flex justify-between"><span><Skull className="inline h-4 w-4 mr-1" />{c}</span><span className="tabular-nums text-muted-foreground">{n}</span></li>)}</ol></div>
        <div className="bento p-4"><h4 className="font-display text-2xl uppercase text-primary mb-2">{s.factionWins}</h4>
          <ol className="space-y-1">{summary.factions.map(([f, n]) => <li key={f} className="flex justify-between"><span style={{ color: factionColor(f) }}>{fLabel(f)}</span><span className="tabular-nums text-muted-foreground">{n} {s.wins}</span></li>)}</ol></div>
      </div>
      <div className="bento p-4"><h4 className="font-display text-2xl uppercase text-primary mb-2">{s.history}</h4>
        <ul className="space-y-1">{[...stats].reverse().map((r) => (
          <li key={r.date} className="flex flex-wrap justify-between gap-2 border-b border-border/30 py-1 last:border-0">
            <span className="tabular-nums text-muted-foreground">{new Date(r.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            <span><Crown className="inline h-4 w-4 mr-1 text-gold" />{r.winningTeam ? `${fLabel(r.winningTeam)}: ${(r.winners ?? []).join(", ")}` : `${r.winner} (${r.winnerCharacter})`}</span>
            <span className="tabular-nums">{fmt(r.durationSec)}</span>
          </li>))}</ul></div>
      <div className="flex justify-center"><Button variant="ghost" onClick={clear}><Trash2 className="h-4 w-4 mr-1" />{s.clear}</Button></div>
    </div>
  );
}
