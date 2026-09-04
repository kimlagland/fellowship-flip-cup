# Plan: Flytta snurran före reglerna

## Mål
Göra det snabbare att starta ett spel genom att lägga karaktärssnurran direkt under hero-sektionen, följt av reglerna längre ner på sidan.

## Ändringar
1. **Byt ordning i `src/routes/index.tsx`**
   - Flytta sektionen med `id="wheel"` och `<CharacterWheel />` så den renderas direkt efter hero-sektionen.
   - Flytta regelsektionen (`id="rules"`) nedanför snurran.
   - Behåll karaktärskorten (`id` saknas idag, men sektionen med factionGroups) efter reglerna som referens.

2. **Uppdatera hero-CTA:er**
   - "Snurra hjulet"-knappen (`href="#wheel"`) behåller sin funktion men pekar nu på snurran som kommer först.
   - "Läs reglerna"-knappen (`href="#rules"`) behåller sin funktion.
   - Se till att lokaliserade texterna (`t.ctaWheel`, `t.ctaRules`) fortfarande matchar.

3. **Visuell separation**
   - Behåll snurrans nuvarande bakgradsgradient och regelsektionens bento-grid.
   - Lägg till en liten visuell avdelare eller justera padding om det behövs för att sektionerna ska flöda naturligt.

## Tekniska detaljer
- Endast `src/routes/index.tsx` behöver ändras.
- Ingen logik i `CharacterWheel.tsx`, reglerna eller karaktärsdatan påverkas.
- Verifiering: bygg projektet och öppna startsidan. Kontrollera att snurran visas direkt under hero, att länkarna hoppar till rätt sektion, och att reglerna fortfarande visas nedanför.
