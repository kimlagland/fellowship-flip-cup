import { useState, useMemo, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { characters, factionLabel, findRelations, type Character, type Faction } from "@/data/characters";
import type { Relation } from "@/data/characters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Plus, X, Sparkles, RotateCcw, ScrollText, Users, Dices, Trash2 } from "lucide-react";


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

const STORAGE_KEY = "baraddur:game";

export function CharacterWheel() {
  const [players, setPlayers] = useState<string[]>([""]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [spinning, setSpinning] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [highlight, setHighlight] = useState<Character | null>(null);
  const [reel, setReel] = useState<Character[]>([]);
  const [winnerIndex, setWinnerIndex] = useState(-1);
  const [showSummary, setShowSummary] = useState(false);
  const [selectedRelation, setSelectedRelation] = useState<Relation | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Assignment | null>(null);
  const [teams, setTeams] = useState<{ good: string[]; evil: string[] } | null>(null);
  const [firstPlayer, setFirstPlayer] = useState<string | null>(null);
  const [hasSaved, setHasSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const controls = useAnimation();

  const validPlayers = players.map((p) => p.trim()).filter(Boolean);

  // Load saved game after hydration
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as {
          players?: string[];
          assignments?: { player: string; character: string }[];
          teams?: { good: string[]; evil: string[] } | null;
          firstPlayer?: string | null;
        };
        if (data.players?.length) setPlayers(data.players);
        if (data.assignments?.length) {
          const restored = data.assignments
            .map((a) => {
              const c = characters.find((ch) => ch.name === a.character);
              return c ? { player: a.player, character: c } : null;
            })
            .filter(Boolean) as Assignment[];
          if (restored.length) {
            setAssignments(restored);
            setHighlight(restored[restored.length - 1].character);
          }
        }
        if (data.teams) setTeams(data.teams);
        if (data.firstPlayer) setFirstPlayer(data.firstPlayer);
        setHasSaved(true);
      }
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  // Persist
  useEffect(() => {
    if (!loaded) return;
    const hasContent = validPlayers.length > 0 || assignments.length > 0;
    if (!hasContent) {
      localStorage.removeItem(STORAGE_KEY);
      setHasSaved(false);
      return;
    }
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        players,
        assignments: assignments.map((a) => ({ player: a.player, character: a.character.name })),
        teams,
        firstPlayer,
      }),
    );
    setHasSaved(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players, assignments, teams, firstPlayer, loaded]);

  const previewChars = useMemo(() => characters.slice(0, VISIBLE_COUNT), []);

  const randomizeTeams = () => {
    const shuffled = [...validPlayers].sort(() => Math.random() - 0.5);
    const half = Math.ceil(shuffled.length / 2);
    setTeams({ good: shuffled.slice(0, half), evil: shuffled.slice(half) });
  };

  const drawFirstPlayer = () => {
    if (validPlayers.length === 0) return;
    setFirstPlayer(validPlayers[Math.floor(Math.random() * validPlayers.length)]);
  };

  const clearSaved = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHasSaved(false);
    setPlayers([""]);
    setAssignments([]);
    setTeams(null);
    setFirstPlayer(null);
    setHighlight(null);
    setReel([]);
    setWinnerIndex(-1);
    setCurrentIdx(0);
    controls.set({ y: 0 });
  };


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
    setTeams(null);
    setFirstPlayer(null);
    controls.set({ y: 0 });
  };


  const currentPlayer = validPlayers[currentIdx];

  const nameToPlayer = useMemo(
    () => new Map(assignments.map((a) => [a.character.name, a.player])),
    [assignments],
  );
  const activeRelations = useMemo(
    () => findRelations(assignments.map((a) => a.character.name)),
    [assignments],
  );

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
        <DialogContent className="w-[95vw] max-w-[1600px] h-[92vh] max-h-[1200px] p-0 overflow-hidden bg-background/95 border-gold/30 flex flex-col">
          <DialogHeader className="shrink-0 px-6 pt-5 pb-3 border-b border-border/40">
            <DialogTitle className="text-3xl text-gradient-gold text-center font-display">
              Tilldelade karaktärer
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground text-sm">
              Här är alla spelare och deras unika regler/förmågor.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {activeRelations.length > 0 && (
              <div className="mb-4 p-3 rounded-lg bg-card/60 border border-gold/25">
                <div className="font-display text-lg text-gradient-gold mb-2">Allianser &amp; fiendskap</div>
                <ul className="flex flex-wrap gap-2">
                  {activeRelations.map((r, i) => (
                    <li key={i}>
                      <button
                        type="button"
                        onClick={() => setSelectedRelation(r)}
                        className="text-xs bg-background/60 rounded-full px-3 py-1.5 border border-border/40 hover:bg-gold/10 hover:border-gold/40 transition-colors text-left"
                      >
                        <span
                          className="inline-block px-1.5 py-0.5 mr-1.5 rounded text-[10px] uppercase tracking-wider align-middle"
                          style={{
                            background: r.kind === "ally" ? "color-mix(in oklab, var(--color-good) 20%, transparent)" : "color-mix(in oklab, var(--color-evil) 20%, transparent)",
                            color: r.kind === "ally" ? "var(--color-good)" : "var(--color-evil)",
                          }}
                        >
                          {r.kind === "ally" ? "Allierade" : "Fiender"}
                        </span>
                        <span className="font-display text-sm">
                          {nameToPlayer.get(r.a) ?? "?"} &amp; {nameToPlayer.get(r.b) ?? "?"}
                        </span>
                        <span className="text-muted-foreground"> — {r.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-5">
              {(["good", "evil", "neutral"] as Faction[]).map((f) => {
                const group = assignments.filter((a) => a.character.faction === f);
                if (group.length === 0) return null;
                return (
                  <div key={f}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: factionColor(f) }} />
                      <h4 className="font-display text-xl shrink-0" style={{ color: factionColor(f) }}>
                        {factionLabel[f]}
                      </h4>
                      <span className="text-[11px] uppercase tracking-widest text-muted-foreground shrink-0">
                        {group.length} spelare
                      </span>
                      <div className="flex-1 h-[1px] bg-border/50 min-w-0" />
                    </div>
                    <div className="grid gap-3 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
                      {group.map((a, i) => {
                        const rels = activeRelations.filter(
                          (r) => r.a === a.character.name || r.b === a.character.name,
                        );
                        return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          whileHover={{ scale: 1.03 }}
                          onClick={() => setSelectedCharacter(a)}
                          className="p-3 rounded-lg bg-card/70 border border-border/60 flex flex-col text-sm cursor-pointer hover:border-gold/40 hover:bg-card/90 transition-colors"
                          style={{ borderLeft: `3px solid ${factionColor(a.character.faction)}` }}
                        >
                          <div className="mb-1.5">
                            <div className="font-display text-xl text-gradient-gold leading-tight">{a.character.name}</div>
                            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                              {factionLabel[a.character.faction]}
                            </div>
                          </div>
                          <div className="mb-2 pb-2 border-b border-border/40">
                            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Spelare</div>
                            <div className="font-display text-base leading-tight">{a.player}</div>
                          </div>
                          <div className="space-y-1 flex-1">
                            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Regler / förmågor</div>
                            <ul className="space-y-0.5 text-xs text-foreground/90 list-disc list-outside pl-3.5 leading-relaxed">
                              {a.character.rules.map((r, idx) => (
                                <li key={idx}>{r}</li>
                              ))}
                            </ul>
                          </div>
                          {rels.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-border/40 space-y-1">
                              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Kopplingar</div>
                              {rels.map((r, idx) => {
                                const other = r.a === a.character.name ? r.b : r.a;
                                return (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedRelation(r);
                                    }}
                                    className="block w-full text-left text-xs leading-snug hover:underline"
                                  >
                                    <span style={{ color: r.kind === "ally" ? "var(--color-good)" : "var(--color-evil)" }}>
                                      {r.kind === "ally" ? "Allierad" : "Fiende"}
                                    </span>{" "}
                                    <span className="font-display">{nameToPlayer.get(other) ?? "?"}</span>
                                    <span className="text-muted-foreground"> — {r.label}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                          {a.character.quote && (
                            <div className="mt-2 pt-2 border-t border-border/40 italic text-xs text-accent leading-snug">
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
          </div>

          <div className="shrink-0 px-6 py-3 border-t border-border/40 flex justify-center bg-background/80">
            <Button onClick={() => setShowSummary(false)} variant="outline" className="border-border/60">
              Stäng
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Relation detail dialog */}
      <Dialog open={selectedRelation !== null} onOpenChange={(open) => !open && setSelectedRelation(null)}>
        <DialogContent className="w-[92vw] max-w-lg bg-background/95 border-gold/30">
          <DialogHeader>
            <DialogTitle className="text-2xl text-gradient-gold text-center font-display">
              {selectedRelation?.kind === "ally" ? "Allians" : "Fiendskap"}
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground text-sm">
              {selectedRelation && (
                <>
                  {nameToPlayer.get(selectedRelation.a) ?? "?"} ({selectedRelation.a}){" "}
                  {selectedRelation.kind === "ally" ? "&" : "vs"}{" "}
                  {nameToPlayer.get(selectedRelation.b) ?? "?"} ({selectedRelation.b})
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="px-2 py-2 text-center">
            {selectedRelation && (
              <>
                <div
                  className="inline-block px-3 py-1 rounded-full text-xs uppercase tracking-wider mb-4"
                  style={{
                    background: selectedRelation.kind === "ally" ? "color-mix(in oklab, var(--color-good) 20%, transparent)" : "color-mix(in oklab, var(--color-evil) 20%, transparent)",
                    color: selectedRelation.kind === "ally" ? "var(--color-good)" : "var(--color-evil)",
                  }}
                >
                  {selectedRelation.kind === "ally" ? "Allierade" : "Fiender"}
                </div>
                <p className="text-foreground/90 leading-relaxed">{selectedRelation.detail}</p>
              </>
            )}
          </div>
          <div className="flex justify-center pb-2">
            <Button onClick={() => setSelectedRelation(null)} variant="outline" className="border-border/60">
              Stäng
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Character detail dialog */}
      <Dialog open={selectedCharacter !== null} onOpenChange={(open) => !open && setSelectedCharacter(null)}>
        <DialogContent className="w-[95vw] max-w-2xl h-[90vh] max-h-[900px] p-0 overflow-hidden bg-background/95 border-gold/30 flex flex-col">
          {selectedCharacter && (
            <>
              <DialogHeader
                className="shrink-0 px-6 pt-6 pb-4 border-b border-border/40"
                style={{ borderLeft: `6px solid ${factionColor(selectedCharacter.character.faction)}` }}
              >
                <DialogTitle className="text-4xl text-gradient-gold font-display">
                  {selectedCharacter.character.name}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground text-sm">
                  {factionLabel[selectedCharacter.character.faction]} — spelas av{" "}
                  <span className="font-display text-foreground">{selectedCharacter.player}</span>
                </DialogDescription>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Regler / förmågor</h4>
                  <ul className="space-y-3 text-base list-disc list-outside pl-5 leading-relaxed">
                    {selectedCharacter.character.rules.map((r, idx) => (
                      <li key={idx} className="text-foreground/90">{r}</li>
                    ))}
                  </ul>
                </div>
                {selectedCharacter.character.quote && (
                  <div className="p-4 rounded-lg bg-card/60 border border-border/40 italic text-lg text-accent leading-snug">
                    "{selectedCharacter.character.quote}"
                  </div>
                )}
                {(() => {
                  const rels = activeRelations.filter(
                    (r) => r.a === selectedCharacter.character.name || r.b === selectedCharacter.character.name,
                  );
                  if (rels.length === 0) return null;
                  return (
                    <div>
                      <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Kopplingar</h4>
                      <div className="space-y-2">
                        {rels.map((r, idx) => {
                          const other = r.a === selectedCharacter.character.name ? r.b : r.a;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setSelectedRelation(r)}
                              className="w-full text-left p-3 rounded-lg bg-card/60 border border-border/40 hover:border-gold/40 hover:bg-card/80 transition-colors"
                            >
                              <span
                                className="inline-block px-2 py-0.5 rounded text-[10px] uppercase tracking-wider mr-2"
                                style={{
                                  background: r.kind === "ally" ? "color-mix(in oklab, var(--color-good) 20%, transparent)" : "color-mix(in oklab, var(--color-evil) 20%, transparent)",
                                  color: r.kind === "ally" ? "var(--color-good)" : "var(--color-evil)",
                                }}
                              >
                                {r.kind === "ally" ? "Allierad" : "Fiende"}
                              </span>
                              <span className="font-display">{nameToPlayer.get(other) ?? "?"}</span>
                              <span className="text-muted-foreground"> — {r.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>
              <div className="shrink-0 px-6 py-3 border-t border-border/40 flex justify-center bg-background/80">
                <Button onClick={() => setSelectedCharacter(null)} variant="outline" className="border-border/60">
                  Stäng
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
