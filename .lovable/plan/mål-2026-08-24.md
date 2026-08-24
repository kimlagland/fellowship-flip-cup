Gör knappen "Dra lott: vem börjar" tillgänglig i sammanfattningen

## Mål
Användaren ska kunna dra lott om vem som börjar direkt inifrån sammanfattningsmodalen, utan att behöva stänga den.

## Ändringar
- Lägg till en knapp "Dra lott: vem börjar" i sammanfattningsmodalens sidfot (bredvid "Stäng").
- Anslut knappen till den befintliga `drawFirstPlayer()`-funktionen.
- Visa det dragna resultatet direkt i modalen, t.ex. som ett guldmarkerat kort ovanför knapparna eller i modalens header.
- Resultatet ska använda befintlig `firstPlayer`-state så det också sparas i `localStorage` tillsammans med spelkonfigurationen.
- Uppdatera stäng-knappens layout så båda knapparna får plats (t.ex. `flex justify-center gap-3`).

## Fil som ändras
- `src/components/CharacterWheel.tsx`

## Verifiering
- Öppna sammanfattningen efter alla karaktärer tilldelats.
- Klicka på "Dra lott: vem börjar" inuti modalen.
- Bekräfta att en slumpad spelare visas och att modalen förblir öppen.
- Ladda om sidan och bekräfta att resultatet fortfarande visas (sparat i localStorage).
