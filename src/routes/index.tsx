import { createFileRoute } from "@tanstack/react-router";
import { CharacterWheel } from "@/components/CharacterWheel";
import { RuleSection } from "@/components/RuleSection";
import { characters, factionLabels, characterRules, type Faction } from "@/data/characters";
import { useLanguage } from "@/i18n";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TvToggle } from "@/components/TvToggle";
import { CastButton } from "@/components/CastButton";
import { LanguageToggle } from "@/components/LanguageToggle";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Barad'dur — Lord of the Beers" },
      { name: "description", content: "Ett episkt dricksspel inspirerat av Sagan om Ringen, beer pong och flip the cup. Regler, karaktärer och slumpgenerator." },
    ],
  }),
});

const factionGroups: Faction[] = ["good", "evil", "neutral"];

function CharacterCard(c: typeof characters[number]) {
  const { lang } = useLanguage();
  const { name, faction, quote } = c;
  const color =
    faction === "good" ? "var(--color-good)" : faction === "evil" ? "var(--color-evil)" : "var(--color-neutral)";
  return (
    <div className="bento p-6 h-full border-t-2 transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_18px_40px_-20px_var(--ember)]">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h3 className="font-display text-3xl text-foreground uppercase">{name}</h3>
        <span
          className="shrink-0 rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.15em]"
          style={{ color, background: `color-mix(in oklab, ${color} 15%, transparent)`, border: `1px solid color-mix(in oklab, ${color} 35%, transparent)` }}
        >
          {factionLabels[lang][faction]}
        </span>
      </div>
      <ul className="space-y-1.5 text-sm text-foreground/80 list-disc list-outside pl-4">
        {characterRules(c, lang).map((r, i) => <li key={i}>{r}</li>)}
      </ul>
      {quote && <div className="mt-4 pt-3 border-t border-border/40 italic text-sm text-accent">"{quote}"</div>}
    </div>
  );
}

function Index() {
  const { lang, t } = useLanguage();
  return (
    <main className="min-h-screen">
      <ThemeToggle />
      <LanguageToggle />
      <TvToggle />
      <CastButton />
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-30 blur-3xl"
            style={{ background: "radial-gradient(circle, oklch(0.7 0.25 45), transparent 70%)" }} />
        </div>
        <div className="relative max-w-6xl 2xl:max-w-[90rem] mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-16 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block border-l-2 border-primary pl-3 text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground mb-6">{t.eyebrow}</div>
            <h1 className="text-7xl sm:text-8xl md:text-[10rem] lg:text-[12rem] break-words text-primary uppercase leading-[0.78] mb-8">
              Barad'dur
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto md:mx-0" style={{ fontFamily: "var(--font-body)" }}>
              {t.tagline}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row sm:flex-wrap justify-center md:justify-start gap-3">
              <a href="#wheel" className="ember-pill px-8 py-3.5 font-display text-xl uppercase tracking-wide">
                {t.ctaWheel}
              </a>
              <a href="#rules" className="outline-pill px-8 py-3.5 font-display text-xl uppercase tracking-wide text-foreground">
                {t.ctaRules}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Wheel */}
      <section id="wheel" className="relative py-20 sm:py-28 border-b border-border/40" style={{
        background: "linear-gradient(180deg, transparent, color-mix(in oklab, var(--ember) 8%, transparent), transparent)",
      }}>
        <div className="max-w-6xl 2xl:max-w-[90rem] mx-auto px-4 sm:px-6">
          <div className="text-center md:text-left mb-14 max-w-3xl">
            <div className="inline-block border-l-2 border-primary pl-3 text-xs uppercase tracking-[0.35em] text-muted-foreground mb-5">{t.wheelEyebrow}</div>
            <h2 className="text-5xl sm:text-6xl md:text-7xl text-foreground uppercase mb-3">{t.wheelTitle}</h2>
            <p className="text-lg text-muted-foreground max-w-xl md:mx-0">
              {t.wheelSubtitle}
            </p>
          </div>
          <CharacterWheel />
        </div>
      </section>

      {/* Rules */}
      <div id="rules" className="max-w-6xl 2xl:max-w-[90rem] mx-auto px-4 sm:px-6 py-20 grid lg:grid-cols-2 gap-x-12 gap-y-0">
        <RuleSection eyebrow={t.chapter1} title={t.basicRules}>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl p-6 bg-background/40 border border-border/60">
              <h3 className="font-display text-xl mb-3 text-gradient-gold">{t.setup}</h3>
              <ul className="space-y-2 list-disc list-outside pl-5 text-base">
                {t.setupItems.map((x, i) => <li key={i}>{x}</li>)}
                <li>{t.setupTower} <strong className="text-accent">Barad'dur</strong>.</li>
                <li>{t.setupTowerFill}</li>
              </ul>
            </div>
            <div className="rounded-2xl p-6 bg-background/40 border border-border/60">
              <h3 className="font-display text-xl mb-3 text-gradient-gold">{t.flow}</h3>
              <ul className="space-y-2 list-disc list-outside pl-5 text-base">
                {t.flowItems.map((x, i) => <li key={i}>{x}</li>)}
              </ul>
            </div>
          </div>
        </RuleSection>

        <RuleSection eyebrow={t.important} title={t.bounceTitle}>
          <ul className="space-y-2 list-disc list-outside pl-6">
            {t.bounceItems.map((x, i) => (
              <li key={i}>{x.pre}{x.strong && <strong>{x.strong}</strong>}{x.post}</li>
            ))}
          </ul>
        </RuleSection>

        <RuleSection eyebrow={t.chapter2} title={t.duelsTitle}>
          <p>{t.duelsIntroPre}<strong className="text-accent">{t.duelWord}</strong>:</p>
          <ol className="space-y-2 list-decimal list-outside pl-6">
            {t.duelsItems.map((x, i) => <li key={i}>{x}</li>)}
            <li>{t.duelsFlipPre}<strong className="text-accent">{t.flipTheCup}</strong>.</li>
            {t.duelsItems2.map((x, i) => <li key={i}>{x}</li>)}
          </ol>
        </RuleSection>

        <RuleSection eyebrow={t.chapter3} title={t.towerTitle}>
          <p>{t.towerIntro} <span className="text-accent italic">"Barad'dur!"</span></p>
          <div className="grid md:grid-cols-2 gap-6 pt-2">
            <div className="rounded-2xl p-6 bg-background/40 border border-border/60">
              <h3 className="font-display text-lg mb-2 text-destructive">{t.onMiss}</h3>
              <p className="text-base">{t.onMissText}</p>
            </div>
            <div className="rounded-2xl p-6 bg-background/40 border" style={{ borderColor: "color-mix(in oklab, var(--gold) 40%, transparent)" }}>
              <h3 className="font-display text-lg mb-2 text-gradient-gold">{t.onHit}</h3>
              <p className="text-base">{t.onHitText}</p>
            </div>
          </div>
        </RuleSection>

        <RuleSection eyebrow={t.chapter4} title={t.finalTitle}>
          <p>{t.finalIntro}</p>
          <ul className="space-y-2 list-disc list-outside pl-6">
            {t.finalItems.map((x, i) => (
              <li key={i}>{x.pre}<strong className="text-accent">{x.strong}</strong>{x.post}</li>
            ))}
          </ul>
        </RuleSection>

        <RuleSection eyebrow={t.important} title={t.honorTitle}>
          <ul className="space-y-2 list-disc list-outside pl-6">
            {t.honorItems.map((x, i) => <li key={i}>{x}</li>)}
          </ul>
        </RuleSection>
      </div>

      {/* Characters */}
      <div className="max-w-6xl 2xl:max-w-[90rem] mx-auto px-4 sm:px-6 py-24 space-y-20">
        {factionGroups.map((f) => {
          const list = characters.filter((c) => c.faction === f);
          const color = f === "good" ? "var(--color-good)" : f === "evil" ? "var(--color-evil)" : "var(--color-neutral)";
          return (
            <section key={f}>
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${color}80, transparent)` }} />
                <h2 className="font-display text-2xl md:text-3xl uppercase tracking-[0.25em]" style={{ color }}>
                  {factionLabels[lang][f]}
                </h2>
                <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${color}80, transparent)` }} />
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {list.map((c) => <CharacterCard key={c.name} {...c} />)}
              </div>
            </section>
          );
        })}
      </div>

      <footer className="w-full border-t border-border/40 py-14 text-sm text-muted-foreground">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center px-6 text-center">
          <div className="mb-5 h-0.5 w-20 bg-primary/70" />
          <p className="font-display text-2xl uppercase text-foreground">{t.footerQuote}</p>
          <p className="mt-2">{t.footerNote}</p>
        </div>
      </footer>
    </main>
  );
}
