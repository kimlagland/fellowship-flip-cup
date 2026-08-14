import { useState, useMemo, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { characters, factionLabel, type Character } from "@/data/characters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Sparkles, RotateCcw } from "lucide-react";

interface Assignment {
  player: string;
  character: Character;
}

const factionColor = (f: Character["faction"]) =>
  f === "good" ? "var(--color-good)" : f === "evil" ? "var(--color-evil)" : "var(--color-neutral)";

export function CharacterWheel() {
  const [players, setPlayers] = useState<string[]>([""]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [spinning, setSpinning] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [highlight, setHighlight] = useState<Character | null>(null);
  const controls = useAnimation();
  const rotationRef = useRef(0);

  const validPlayers = players.map((p) => p.trim()).filter(Boolean);

  const wheelChars = useMemo(() => characters, []);
  const slice = 360 / wheelChars.length;

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
    const available = wheelChars
      .map((c, i) => ({ c, i }))
      .filter(({ c }) => !used.has(c.name));
    const pick = available[Math.floor(Math.random() * available.length)];

    const targetSliceCenter = pick.i * slice + slice / 2;
    const fullSpins = 6 + Math.floor(Math.random() * 3);
    const currentMod = ((rotationRef.current % 360) + 360) % 360;
    const desiredMod = (((90 - targetSliceCenter) % 360) + 360) % 360;
    const delta = ((desiredMod - currentMod) + 360) % 360;
    const finalRotation = rotationRef.current + fullSpins * 360 + delta;
    rotationRef.current = finalRotation;

    await controls.start({
      rotate: finalRotation,
      transition: { duration: 4.5, ease: [0.17, 0.67, 0.21, 0.99] },
    });

    const newAssignment = { player: list[idx], character: pick.c };
    const nextAcc = [...acc, newAssignment];
    setAssignments(nextAcc);
    setHighlight(pick.c);
    setSpinning(false);

    if (idx + 1 < list.length) {
      setCurrentIdx(idx + 1);
      await new Promise((r) => setTimeout(r, 1800));
      await spinOnce(list, idx + 1, nextAcc);
    }
  };

  const reset = () => {
    setAssignments([]);
    setHighlight(null);
    setCurrentIdx(0);
  };

  const currentPlayer = validPlayers[currentIdx];

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
            <Button onClick={reset} variant="outline" className="border-border/60">
              <RotateCcw className="h-4 w-4 mr-2" /> Börja om
            </Button>
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

      {/* Wheel */}
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
            <div className="font-display text-2xl text-muted-foreground">One Wheel to rule them all</div>
          </div>
        )}

        <div className="relative w-[min(90vw,520px)] aspect-square">
          {/* Pointer */}
          <div className="absolute top-1/2 -right-2 -translate-y-1/2 z-20">
            <div
              className="w-0 h-0"
              style={{
                borderTop: "14px solid transparent",
                borderBottom: "14px solid transparent",
                borderRight: "26px solid var(--color-gold)",
                filter: "drop-shadow(0 0 10px var(--color-gold))",
              }}
            />
          </div>

          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full ring-glow" style={{
            background: "conic-gradient(from 0deg, oklch(0.55 0.22 35), oklch(0.82 0.17 80), oklch(0.55 0.22 35))",
            padding: "8px",
          }}>
            <div className="w-full h-full rounded-full bg-background" />
          </div>

          {/* Wheel */}
          <motion.div
            animate={controls}
            className="absolute inset-3 rounded-full overflow-hidden"
            style={{ transformOrigin: "50% 50%" }}
          >
            <svg viewBox="-100 -100 200 200" className="w-full h-full">
              {wheelChars.map((c, i) => {
                const startA = (i * slice - 90) * (Math.PI / 180);
                const endA = ((i + 1) * slice - 90) * (Math.PI / 180);
                const r = 100;
                const x1 = Math.cos(startA) * r;
                const y1 = Math.sin(startA) * r;
                const x2 = Math.cos(endA) * r;
                const y2 = Math.sin(endA) * r;
                const largeArc = slice > 180 ? 1 : 0;
                const path = `M 0 0 L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
                const midA = (startA + endA) / 2;
                const tx = Math.cos(midA) * 62;
                const ty = Math.sin(midA) * 62;
                const rot = (i * slice) + slice / 2;
                const fill = c.faction === "good"
                  ? (i % 2 ? "oklch(0.32 0.06 220)" : "oklch(0.38 0.08 215)")
                  : c.faction === "evil"
                  ? (i % 2 ? "oklch(0.28 0.10 25)" : "oklch(0.33 0.13 28)")
                  : "oklch(0.32 0.06 130)";
                return (
                  <g key={c.name}>
                    <path d={path} fill={fill} stroke="oklch(0.82 0.17 80 / 0.4)" strokeWidth="0.4" />
                    <text
                      x={tx}
                      y={ty}
                      transform={`rotate(${rot} ${tx} ${ty})`}
                      fontSize="4.2"
                      fill="oklch(0.95 0.05 80)"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontFamily="Cinzel, serif"
                      fontWeight={600}
                    >
                      {c.name.length > 14 ? c.name.slice(0, 12) + "…" : c.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </motion.div>

          {/* Center eye */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{
              background: "radial-gradient(circle, oklch(0.92 0.18 75) 0%, oklch(0.55 0.22 35) 50%, oklch(0.2 0.05 30) 100%)",
              boxShadow: "0 0 30px oklch(0.78 0.2 50), inset 0 0 20px oklch(0.2 0.05 20)",
            }}>
              <div className="w-3 h-12 bg-background rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
