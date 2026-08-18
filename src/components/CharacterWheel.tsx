import { useState, useMemo } from "react";
import { motion, useAnimation } from "framer-motion";
import { characters, factionLabel, findRelations, type Character, type Faction } from "@/data/characters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Plus, X, Sparkles, RotateCcw, ScrollText } from "lucide-react";

interface Assignment {
  player: string;
  character: Character;
}

const ITEM_HEIGHT = 92; // px
const VISIBLE_COUNT = 5;
const CENTER_INDEX = Math.floor(VISIBLE_COUNT / 2);
const SPIN_DURATION = 6.5; // seconds

const factionColor = (f: Character["faction"]) =>
  f === "good" ? "var(--color-good)" : f === "evil" ? "var(--color-evil)" : "var(--color-neutral)";

function generateReel(
  available: Character[],
  winner: Character,
  spinCount = 30,
  tailCount = 8,
): { reel: Character[]; winnerIndex: number } {
  const reel: Character[] = [];
  for (let i = 0; i < spinCount; i++) {
    reel.push(available[Math.floor(Math.random() * available.length)]);
  }
  const winnerIndex = reel.length;
  reel.push(winner);
  for (let i = 0; i < tailCount; i++) {
    reel.push(available[Math.floor(Math.random() * available.length)]);
  }
  return { reel, winnerIndex };
}

export function CharacterWheel() {
  const [players, setPlayers] = useState<string[]>([""]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [spinning, setSpinning] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [highlight, setHighlight] = useState<Character | null>(null);
  const [reel, setReel] = useState<Character[]>([]);
  const [winnerIndex, setWinnerIndex] = useState(-1);
  const [showSummary, setShowSummary] = useState(false);
  const controls = useAnimation();

  const validPlayers = players.map((p) => p.trim()).filter(Boolean);

  const previewChars = useMemo(() => characters.slice(0, VISIBLE_COUNT), []);

  const updatePlayer = (i: number, v: string) => {
    const next = [...players];
    next[i] = v;
    setPlayers(next);
  };
  const addPlayer = () => setPlayers([...players, ""]);
  const removePlayer = (i: number) => setPlayers(players.filter((_, idx) => idx !== i));

  const startSpin = async () => {
    if (validPlayers.length === 0 || spinning) return;
    setAssignments([]);
    setCurrentIdx(0);
    await spinOnce(validPlayers, 0, []);
  };

  const spinOnce = async (
    list: string[],
    idx: number,
    acc: Assignment[],
  ) => {
    setSpinning(true);
    setHighlight(null);

    const used = new Set(acc.map((a) => a.character.name));
    const available = characters.filter((c) => !used.has(c.name));
    const pick = available[Math.floor(Math.random() * available.length)];

    const { reel: reelSequence, winnerIndex: wIdx } = generateReel(available, pick);
    setReel(reelSequence);
    setWinnerIndex(wIdx);

    // Reset reel to the top so the new sequence starts from the beginning.
    controls.set({ y: 0 });

    const finalY = -(wIdx * ITEM_HEIGHT) + CENTER_INDEX * ITEM_HEIGHT;

    await controls.start({
      y: finalY,
      transition: { duration: SPIN_DURATION, ease: [0.15, 0.8, 0.25, 1] },
    });

    const newAssignment = { player: list[idx], character: pick };
    const nextAcc = [...acc, newAssignment];
    setAssignments(nextAcc);
    setHighlight(pick);
    setSpinning(false);

    if (idx + 1 < list.length) {
      setCurrentIdx(idx + 1);
      await new Promise((r) => setTimeout(r, 2000));
      await spinOnce(list, idx + 1, nextAcc);
    } else {
      await new Promise((r) => setTimeout(r, 1200));
      setShowSummary(true);
    }
  };

  const reset = () => {
    setAssignments([]);
    setHighlight(null);
    setCurrentIdx(0);
    setReel([]);
    setWinnerIndex(-1);
    setShowSummary(false);
    controls.set({ y: 0 });
  };

  const currentPlayer = validPlayers[currentIdx];

  const displayedReel = reel.length > 0 ? reel : previewChars;
  const isResultLocked = !spinning && highlight && reel.length > 0;

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] items-start">
      {/* Players panel */}
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl text-gradient-gold mb-1">Sällskapet</h3>
          <p className="text-muted-foreground text-sm">Lägg till alla spelare som ska tilldelas en karaktär.</p>
        </div>

        <div className="space-y-3">
          {players.map((p, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={p}
                data-player-index={i}
                onChange={(e) => updatePlayer(i, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  e.preventDefault();
                  if (!p.trim()) return;
                  const focusNext = (idx: number) => {
                    requestAnimationFrame(() => {
                      const el = document.querySelector<HTMLInputElement>(
                        `input[data-player-index="${idx}"]`,
                      );
                      el?.focus();
                    });
                  };
                  if (i === players.length - 1) {
                    setPlayers([...players, ""]);
                    focusNext(i + 1);
                  } else {
                    focusNext(i + 1);
                  }
                }}
                placeholder={`Spelare ${i + 1}`}
                className="bg-input/60 border-border/60 font-body text-base h-11"
                disabled={spinning || assignments.length > 0}
              />
              {players.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removePlayer(i)}
                  disabled={spinning || assignments.length > 0}
                  className="h-11 w-11 shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={addPlayer}
            disabled={spinning || assignments.length > 0}
            className="border-border/60"
          >
            <Plus className="h-4 w-4 mr-2" /> Lägg till spelare
          </Button>
          {assignments.length === 0 ? (
            <Button
              onClick={startSpin}
              disabled={validPlayers.length === 0 || spinning}
              className="bg-gradient-to-b from-[oklch(0.82_0.17_80)] to-[oklch(0.55_0.18_45)] text-primary-foreground font-display tracking-wider hover:opacity-90 ring-glow"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Snurra Eye of Sauron
            </Button>
          ) : (
            <>
              <Button
                onClick={() => setShowSummary(true)}
                className="bg-gradient-to-b from-[oklch(0.82_0.17_80)] to-[oklch(0.55_0.18_45)] text-primary-foreground font-display tracking-wider hover:opacity-90 ring-glow"
              >
                <ScrollText className="h-4 w-4 mr-2" /> Visa sammanfattning
              </Button>
              <Button onClick={reset} variant="outline" className="border-border/60">
                <RotateCcw className="h-4 w-4 mr-2" /> Börja om
              </Button>
            </>
          )}
        </div>

        {/* Assignments */}
        {assignments.length > 0 && (
          <div className="pt-4 space-y-3">
            <h4 className="text-xl text-gradient-gold">Tilldelningar</h4>
            {assignments.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-4 rounded-lg bg-card/70 border border-border/60"
                style={{ borderLeft: `4px solid ${factionColor(a.character.faction)}` }}
              >
                <div>
                  <div className="font-display text-lg">{a.player}</div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">
                    {factionLabel[a.character.faction]}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display text-xl text-gradient-gold">{a.character.name}</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Reel */}
      <div className="flex flex-col items-center gap-6">
        {currentPlayer && spinning && (
          <div className="text-center">
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Snurrar för</div>
            <div className="font-display text-3xl text-gradient-gold">{currentPlayer}</div>
          </div>
        )}
        {!spinning && highlight && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              {assignments[assignments.length - 1]?.player} fick
            </div>
            <div className="font-display text-3xl text-gradient-gold">{highlight.name}</div>
          </motion.div>
        )}
        {!currentPlayer && !highlight && (
          <div className="text-center">
            <div className="font-display text-2xl text-muted-foreground">One Reel to rule them all</div>
          </div>
        )}

        <div className="relative w-full max-w-md">
          {/* Pointers */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 z-20">
            <div
              className="w-0 h-0"
              style={{
                borderTop: "12px solid transparent",
                borderBottom: "12px solid transparent",
                borderLeft: "22px solid var(--color-gold)",
                filter: "drop-shadow(0 0 10px var(--color-gold))",
              }}
            />
          </div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 z-20">
            <div
              className="w-0 h-0"
              style={{
                borderTop: "12px solid transparent",
                borderBottom: "12px solid transparent",
                borderRight: "22px solid var(--color-gold)",
                filter: "drop-shadow(0 0 10px var(--color-gold))",
              }}
            />
          </div>

          {/* Window */}
          <div
            className="relative overflow-hidden rounded-2xl ring-glow border border-gold/30 bg-background/80 backdrop-blur-sm"
            style={{ height: VISIBLE_COUNT * ITEM_HEIGHT }}
          >
            {/* Center marker */}
            <div
              className="absolute left-0 right-0 z-10 pointer-events-none"
              style={{ top: CENTER_INDEX * ITEM_HEIGHT, height: ITEM_HEIGHT }}
            >
              <div className="absolute inset-0 bg-gold/5" />
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gold/50" />
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gold/50" />
            </div>

            <motion.div animate={controls} className="absolute left-0 right-0">
              {displayedReel.map((c, i) => {
                const isWinner = isResultLocked && i === winnerIndex;
                return (
                  <div
                    key={`${c.name}-${i}`}
                    className="flex items-center justify-center px-10 border-b border-border/30 transition-colors"
                    style={{
                      height: ITEM_HEIGHT,
                      borderLeft: `5px solid ${factionColor(c.faction)}`,
                    }}
                  >
                    <div className="text-center">
                      <div
                        className={`font-display leading-tight ${
                          isWinner ? "text-3xl text-gradient-gold" : "text-2xl text-foreground/90"
                        }`}
                      >
                        {c.name}
                      </div>
                      <div
                        className={`text-xs uppercase tracking-widest ${
                          isWinner ? "text-gold/80" : "text-muted-foreground"
                        }`}
                      >
                        {factionLabel[c.faction]}
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>

        </div>

        {/* Eye of Sauron — placed below the reel so it never covers the names */}
        <div className="flex justify-center pt-2">
          <motion.div
            animate={spinning ? { scale: [1, 1.12, 1] } : { scale: 1 }}
            transition={spinning ? { duration: 1.6, repeat: Infinity } : { duration: 0.4 }}
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background:
                "radial-gradient(circle, oklch(0.92 0.18 75) 0%, oklch(0.55 0.22 35) 50%, oklch(0.2 0.05 30) 100%)",
              boxShadow: "0 0 24px oklch(0.78 0.2 50), inset 0 0 12px oklch(0.2 0.05 20)",
            }}
          >
            <div className="w-1.5 h-6 bg-background rounded-full" />
          </motion.div>
        </div>
      </div>

      {/* Summary modal */}
      <Dialog open={showSummary} onOpenChange={setShowSummary}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-background/95 border-gold/30">
          <DialogHeader>
            <DialogTitle className="text-3xl text-gradient-gold text-center font-display">
              Tilldelade karaktärer
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              Här är alla spelare och deras unika regler/förmågor.
            </DialogDescription>
          </DialogHeader>

          {activeRelations.length > 0 && (
            <div className="mt-4 p-4 rounded-xl bg-card/60 border border-gold/25">
              <div className="font-display text-xl text-gradient-gold mb-3">Allianser &amp; fiendskap</div>
              <ul className="space-y-2">
                {activeRelations.map((r, i) => (
                  <li key={i} className="text-sm">
                    <span
                      className="inline-block px-2 py-0.5 mr-2 rounded text-[10px] uppercase tracking-widest align-middle"
                      style={{
                        background: r.kind === "ally" ? "color-mix(in oklab, var(--color-good) 20%, transparent)" : "color-mix(in oklab, var(--color-evil) 20%, transparent)",
                        color: r.kind === "ally" ? "var(--color-good)" : "var(--color-evil)",
                      }}
                    >
                      {r.kind === "ally" ? "Allierade" : "Fiender"}
                    </span>
                    <span className="font-display text-base">
                      {nameToPlayer.get(r.a) ?? "?"} ({r.a}) &amp; {nameToPlayer.get(r.b) ?? "?"} ({r.b})
                    </span>
                    <span className="text-muted-foreground"> — {r.label}: {r.detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-8 pt-4">
            {(["good", "evil", "neutral"] as Faction[]).map((f) => {
              const group = assignments.filter((a) => a.character.faction === f);
              if (group.length === 0) return null;
              return (
                <div key={f}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="h-3 w-3 rounded-full" style={{ background: factionColor(f) }} />
                    <h4 className="font-display text-2xl" style={{ color: factionColor(f) }}>
                      {factionLabel[f]}
                    </h4>
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">
                      {group.length} spelare
                    </span>
                    <div className="flex-1 h-[1px] bg-border/50" />
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {group.map((a, i) => {
                      const rels = activeRelations.filter(
                        (r) => r.a === a.character.name || r.b === a.character.name,
                      );
                      return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="p-5 rounded-xl bg-card/70 border border-border/60 flex flex-col"
                        style={{ borderTop: `4px solid ${factionColor(a.character.faction)}` }}
                      >
                        <div className="mb-3">
                          <div className="font-display text-2xl text-gradient-gold">{a.character.name}</div>
                          <div className="text-xs uppercase tracking-widest text-muted-foreground">
                            {factionLabel[a.character.faction]}
                          </div>
                        </div>
                        <div className="mb-4 pb-3 border-b border-border/40">
                          <div className="text-sm text-muted-foreground uppercase tracking-wider">Spelare</div>
                          <div className="font-display text-xl">{a.player}</div>
                        </div>
                        <div className="space-y-2 flex-1">
                          <div className="text-sm text-muted-foreground uppercase tracking-wider">Regler / förmågor</div>
                          <ul className="space-y-1.5 text-sm text-foreground/90 list-disc list-outside pl-4">
                            {a.character.rules.map((r, idx) => (
                              <li key={idx}>{r}</li>
                            ))}
                          </ul>
                        </div>
                        {rels.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-border/40 space-y-1.5">
                            <div className="text-sm text-muted-foreground uppercase tracking-wider">Kopplingar</div>
                            {rels.map((r, idx) => {
                              const other = r.a === a.character.name ? r.b : r.a;
                              return (
                                <div key={idx} className="text-sm">
                                  <span style={{ color: r.kind === "ally" ? "var(--color-good)" : "var(--color-evil)" }}>
                                    {r.kind === "ally" ? "Allierad" : "Fiende"}
                                  </span>{" "}
                                  <span className="font-display">{nameToPlayer.get(other) ?? "?"} ({other})</span>
                                  <div className="text-muted-foreground text-xs">{r.label} — {r.detail}</div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        {a.character.quote && (
                          <div className="mt-4 pt-3 border-t border-border/40 italic text-sm text-accent">
                            "{a.character.quote}"
                          </div>
                        )}
                      </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>


          <div className="pt-2 flex justify-center">
            <Button onClick={() => setShowSummary(false)} variant="outline" className="border-border/60">
              Stäng
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
