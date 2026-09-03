import { createFileRoute } from "@tanstack/react-router";
import { CharacterWheel } from "@/components/CharacterWheel";
import { RuleSection } from "@/components/RuleSection";
import { characters, factionLabel, type Faction } from "@/data/characters";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TvToggle } from "@/components/TvToggle";
import { CastButton } from "@/components/CastButton";

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

function CharacterCard({ name, faction, rules, quote }: typeof characters[number]) {
  const color =
    faction === "good" ? "var(--color-good)" : faction === "evil" ? "var(--color-evil)" : "var(--color-neutral)";
  return (
    <div className="bento p-6 h-full transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_18px_40px_-20px_var(--ember)]">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h3 className="font-display text-xl text-gradient-gold">{name}</h3>
        <span
          className="shrink-0 rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.15em]"
          style={{ color, background: `color-mix(in oklab, ${color} 15%, transparent)`, border: `1px solid color-mix(in oklab, ${color} 35%, transparent)` }}
        >
          {factionLabel[faction]}
        </span>
      </div>
      <ul className="space-y-1.5 text-sm text-foreground/80 list-disc list-outside pl-4">
        {rules.map((r, i) => <li key={i}>{r}</li>)}
      </ul>
      {quote && <div className="mt-4 pt-3 border-t border-border/40 italic text-sm text-accent">"{quote}"</div>}
    </div>
  );
}

function Index() {
  return (
    <main className="min-h-screen">
      <ThemeToggle />
      <TvToggle />
      <CastButton />
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-30 blur-3xl"
            style={{ background: "radial-gradient(circle, oklch(0.7 0.25 45), transparent 70%)" }} />
        </div>
        <div className="relative max-w-5xl 2xl:max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block outline-pill px-4 py-1.5 text-xs uppercase tracking-[0.4em] text-muted-foreground mb-8">Lord of the Beers</div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl break-words text-gradient-gold leading-none mb-6">
              Barad'dur
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto" style={{ fontFamily: "var(--font-body)" }}>
              "One game to rule them all" — Ett dricksspel inspirerat av Sagan om Ringen,
              beer pong och flip the cup.
            </p>
            <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row sm:flex-wrap justify-center gap-3 sm:gap-4">
              <a href="#wheel" className="ember-pill px-8 py-3.5 font-display text-sm font-semibold tracking-wide">
                Tilldela karaktärer
              </a>
              <a href="#rules" className="outline-pill px-8 py-3.5 font-display text-sm font-semibold tracking-wide text-foreground">
                Läs reglerna
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Rules */}
      <div id="rules" className="max-w-5xl 2xl:max-w-6xl mx-auto px-4 sm:px-6 py-20 grid gap-6">
        <RuleSection eyebrow="Kapitel I" title="Grundregler">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl p-6 bg-background/40 border border-border/60">
              <h3 className="font-display text-xl mb-3 text-gradient-gold">Setup</h3>
              <ul className="space-y-2 list-disc list-outside pl-5 text-base">
                <li>Alla spelare har ett eget glas runt bordet.</li>
                <li>Varje glas fylls med ca 2 klunkar valfri dryck.</li>
                <li>Ett större glas eller torn placeras i mitten: <strong className="text-accent">Barad'dur</strong>.</li>
                <li>Barad'dur fylls med ca 2 klunkar valfri dryck.</li>
              </ul>
            </div>
            <div className="rounded-2xl p-6 bg-background/40 border border-border/60">
              <h3 className="font-display text-xl mb-3 text-gradient-gold">Spelets gång</h3>
              <ul className="space-y-2 list-disc list-outside pl-5 text-base">
                <li>På sin tur kastar spelaren en pingisboll mot en annan spelares glas eller Barad'dur.</li>
                <li>Alltid med studs, om inte annat anges.</li>
              </ul>
            </div>
          </div>
        </RuleSection>

        <RuleSection eyebrow="Viktigt" title="Regel om studs">
          <ul className="space-y-2 list-disc list-outside pl-6">
            <li>När en karaktär <strong>måste kasta med studs</strong> är studs obligatoriskt.</li>
            <li>När en karaktär har <strong>1 studs</strong> måste bollen studsa exakt 1 gång innan den får träffa ett glas.</li>
            <li>När en karaktär har <strong>2 studs</strong> måste bollen studsa exakt 2 gånger innan den får träffa ett glas.</li>
            <li>När en karaktär <strong>måste kasta utan studs</strong> får bollen inte studsa innan den träffar glaset.</li>
            <li>Om en karaktär inte har någon särskild regel om studs gäller spelets vanliga kastregler.</li>
          </ul>
        </RuleSection>

        <RuleSection eyebrow="Kapitel II" title="Dueller">
          <p>När bollen landar i en spelares glas startar en <strong className="text-accent">duell</strong>:</p>
          <ol className="space-y-2 list-decimal list-outside pl-6">
            <li>Den som kastade börjar dricka direkt.</li>
            <li>Den träffade spelaren plockar först upp bollen ur glaset.</li>
            <li>Därefter får den träffade börja dricka.</li>
            <li>När en spelare druckit upp måste den göra <strong className="text-accent">Flip the Cup</strong>.</li>
            <li>Först att lyckas flippa glaset vinner duellen.</li>
            <li>Förloraren åker ut ur spelet.</li>
          </ol>
        </RuleSection>

        <RuleSection eyebrow="Kapitel III" title="Barad'dur">
          <p>För att få kasta mot tornet i mitten måste spelaren ropa: <span className="text-accent italic">"Barad'dur!"</span></p>
          <div className="grid md:grid-cols-2 gap-6 pt-2">
            <div className="rounded-2xl p-6 bg-background/40 border border-border/60">
              <h3 className="font-display text-lg mb-2 text-destructive">Vid miss</h3>
              <p className="text-base">Spelaren dricker upp innehållet i Barad'dur. Tornet fylls sedan på igen.</p>
            </div>
            <div className="rounded-2xl p-6 bg-background/40 border" style={{ borderColor: "color-mix(in oklab, var(--gold) 40%, transparent)" }}>
              <h3 className="font-display text-lg mb-2 text-gradient-gold">Vid träff</h3>
              <p className="text-base">Alla andra spelare deltar i en gemensam duell. Den som satte bollen slipper. Sista att lyckas med Flip the Cup åker ut.</p>
            </div>
          </div>
        </RuleSection>

        <RuleSection eyebrow="Kapitel IV" title="Finalen">
          <p>När endast två spelare återstår börjar finalen.</p>
          <ul className="space-y-2 list-disc list-outside pl-6">
            <li>De första 5 rundorna spelas <strong className="text-accent">med studs</strong>.</li>
            <li>Därefter spelas resten <strong className="text-accent">utan studs</strong>.</li>
          </ul>
        </RuleSection>

        <RuleSection eyebrow="Viktigt" title="Hederskodex">
          <ul className="space-y-2 list-disc list-outside pl-6">
            <li>Den som hjälper någon i en duell åker inte själv ut vid förlust.</li>
            <li>Alla måste alltid göra sitt bästa.</li>
            <li>Om gruppen anser att någon medvetet kastar eller flippar dåligt kan spelaren röstas ut.</li>
          </ul>
        </RuleSection>
      </div>

      {/* Wheel */}
      <section id="wheel" className="relative py-24 border-y border-border/40" style={{
        background: "linear-gradient(180deg, transparent, color-mix(in oklab, var(--ember) 8%, transparent), transparent)",
      }}>
        <div className="max-w-6xl 2xl:max-w-[90rem] mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-block outline-pill px-4 py-1.5 text-xs uppercase tracking-[0.4em] text-muted-foreground mb-6">The Eye is upon you</div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl text-gradient-gold mb-4">Tilldela karaktärer</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Skriv in alla spelare och låt Eye of Sauron avgöra ert öde.
            </p>
          </div>
          <CharacterWheel />
        </div>
      </section>

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
                  {factionLabel[f]}
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

      <footer className="border-t border-border/40 py-10 text-center text-sm text-muted-foreground">
        <p className="italic">"Even the smallest person can change the course of the future."</p>
        <p className="mt-2">Drick ansvarsfullt. 18+.</p>
      </footer>
    </main>
  );
}
