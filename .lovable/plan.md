# Uppdateringar: spel & hemsida

Ett paket med förbättringar som inte kräver backend — allt sparas i localStorage som idag.

## 1. Poäng-/livsräknare
- Ny sektion under snurran: varje spelare får en rad med namn, karaktärsikon/färg och en livsräknare (start 3, +/- knappar, stora tryckytor för mobil).
- Väljbart startantal liv (3/5/10).
- Sparas i localStorage tillsammans med resten av spelet.

## 2. Elimineringsläge
- När en spelare når 0 liv markeras den som "fallen": kortet tonas ner, får ett mörkt skimmer och texten "Har fallit i Moria".
- Eliminerade spelare räknas inte längre i "dra lott om vem som börjar"-funktioner.
- Möjlighet att återuppliva en spelare (återställ-knapp per rad).

## 3. Ljud & effekter
- Diskreta ljudeffekter via Web Audio API (inga externa filer): djup dånande ton under snurret, guldaktigt "klirr" när karaktären landar, mörk stämma vid eliminering.
- På/av-knapp för ljud uppe bland de andra knapparna (standard av, sparas i localStorage).

## 4. Utskriftsvänlig regelvy
- Knapp "Skriv ut regler" som öppnar utskriftsdialogen med en egen @media print-stil: vitt papper, svart text, kompakt typografi, döljer knappar/snurra/dekorationer.

## Tekniskt
- Livsräknare/elimineringsstatus byggs in i CharacterWheel (utökar befintligt sparat state i `baraddur:game`).
- Ljud genereras med OscillatorNode/GainNode — inga nya beroenden eller mediefiler.
- Print-stilar läggs i src/styles.css som `@media print`.
- Verifiering: bygg + snabb Playwright-koll av räknare, eliminering och utskriftsläge.
