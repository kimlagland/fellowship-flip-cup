# Omdesign: Barad'dur → "Ember bento grid"

Modern, fräsch redesign av hela sidan enligt vald riktning (Ember bento grid). All spel-logik, alla regler och karaktärsdata behålls exakt som de är — detta är enbart en visuell omgörning.

## Designval (låsta)

- **Färger:** Ember & Night — bakgrund `#0b0b0f`, paneler `#17171f`, guld `#f0d78c`, glöd-orange `#e85d3a`
- **Typsnitt:** Sora (rubriker, uppercase, tight tracking) + Manrope (brödtext)
- **Layout:** Bento-grid — rundade paneler (rounded-3xl), tunna guldkanter, ember-glöd på interaktiva element

## Ändringar

### 1. Design-tokens — `src/styles.css`
- Byt ut hela paletten mot Ember & Night (både mörkt och ljust tema, så light mode fortsätter fungera)
- Byt fonter: Cinzel/Cormorant → Sora/Manrope (laddas via `<link>` i `__root.tsx`)
- Större rundningsradie (`--radius: 1rem`) för bento-känslan
- Ny hero-gradient: guld → ember (ersätter nuvarande `text-gradient-gold`)
- Behåll fluid typography + TV-läget, men justera skalning

### 2. Hero — `src/routes/index.tsx`
- Centrerad rubrik "BARAD'DUR" i stor Sora med guld-till-ember-gradient
- Kicker-text med bred letter-spacing, moderna pill-knappar (primär ember-orange med skugga/glöd, sekundär med tunn kant)
- Ta bort medeltida dekor, behåll subtil radial glöd

### 3. Regler → bento-paneler
- Varje regelsektion (Grundregler, Studs, Dueller, Barad'dur, Finalen, Hederskodex) blir rundade paneler på `#17171f` med `border-gold/10`
- Numrerade regelpunkter med ember-orange siffror ("01", "02"…) där det passar
- Eyebrow-texter moderniseras (liten uppercase, muted)

### 4. Snurran — `src/components/CharacterWheel.tsx`
- Bara stil, ingen logikförändring: paneler i bento-stil, rundade karaktärsrader, markerad mitt-slot med guldkant + ember-glöd (`shadow` + `ring`)
- Knappar: primär "Snurra" som ember-pill, övriga som tunna outline-knappar
- Sammanfattningsdialogen (Dialog) stylas om i samma bento-språk

### 5. Karaktärskort
- Rundade kort (rounded-2xl), faktionsfärgad indikator som chip/pill (t.ex. "DE GODA" i färgad pill) istället för fri svävande text
- Hover: lyft + färgad kant, subtil glöd

### 6. Detaljer
- Uppdatera `RuleSection`, `ThemeToggle`, `TvToggle`, `CastButton` till samma formspråk
- Footer i samma stil

## Tekniskt
- Inga nya dependencies (Sora + Manrope via Google Fonts-länk i `__root.tsx`)
- Semantiska tokens används överallt — inga hårdkodade färger i komponenter (nya färger läggs till som tokens)
- Verifiera: `bun run build` + Playwright-screenshots (desktop, mobil, TV-läge, light mode)
