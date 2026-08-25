# Barad'dur på TV, telefon och dator

Målet: samma sida ska fungera bra på tre väldigt olika skärmar — en telefon i handen, en laptop, och en TV som står 3 meter bort. Nedan är förbättringarna jag föreslår, ordnade efter effekt.

## 1. Skalbar typografi (störst effekt)

Idag är alla textstorlekar fasta (t.ex. `text-2xl`). På en TV blir reglerna små, på telefon blir rubrikerna för stora.

- Byt till flytande storlekar med `clamp()` så text växer med skärmbredden.
- Lägg till ett "TV-läge"-steg: från ca 1600px och uppåt ökar bas-fontstorleken märkbart (regeltext ~22–24px istället för 17px).
- Radlängd maxas så regeltexten inte blir en enda lång rad på bred skärm.

## 2. TV-läge / presentationsläge

En knapp "TV-läge" som:
- förstorar all text ytterligare ett steg,
- döljer inmatningsfält och småknappar under snurrandet,
- visar snurran och den valda karaktären stort och centrerat,
- ökar kontrasten (mörk bakgrund, kraftigare guld) för att synas på håll.

## 3. Sammanfattningen anpassad per skärm

- **Telefon:** ett kort i taget i en swipe-/stegvy istället för en tät grid — dagens 4-kolumnsgrid blir oläsbar i mobil.
- **TV:** 2–3 stora kort per rad med rejäl text, inte 4 små.
- Modalen fyller hela skärmen på telefon (inga marginaler som stjäl plats).

## 4. Mobilspecifika fixar

- Spelarlistan: större träffytor (minst 44px) på ta bort/lägg till.
- Knappraden "Snurra / Slumpa lag / Dra lott" staplas i mobil istället för att tryckas ihop.
- Hero-rubriken skalas ner så den inte bryts konstigt på små telefoner.
- Rubrikrader med både text och ikon får grid + `min-w-0` så inget klipps.

## 5. Reglerna i två kolumner på bred skärm

På desktop/TV läses reglerna bättre i två kolumner med tydliga kapitelrubriker än som en lång smal spalt.

## 6. Övrigt jag rekommenderar

- **Fullskärmsknapp** (Fullscreen API) — praktiskt när sidan visas på TV via Chromecast/HDMI.
- **Ingen text under 14px** någonstans; flera etiketter är 10–11px idag och är omöjliga på TV.
- **Bakgrundsglöden** dämpas i TV-storlek så den inte blir en stor suddig fläck.

## Teknisk sammanfattning

- `src/styles.css`: flytande typskala via `clamp()`, ny `.tv` klass som höjer `--font-scale`, tokens för brytpunkter.
- `src/routes/index.tsx`: responsiva rubrikstorlekar, tvåkolumns-regelgrid från `xl:`, större `max-w` på TV.
- `src/components/CharacterWheel.tsx`: responsiv reel-höjd och kortstorlek, staplade knappar i mobil, sammanfattningsgrid ändras till 1 kolumn (mobil) / 2–3 (desktop) / 2 stora (TV), fullskärms- och TV-lägesknapp.
- Inga ändringar i spel-logik, tilldelning eller sparade data.

Säg till om du vill ha allt eller bara vissa punkter.
