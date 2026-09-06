# Renare design för ”Tilldela karaktärer”

## Mål
Göra spelsektionen mer stilren genom att ta bort den turkosa kanten och minska de linjer som visuellt delar upp spelarfältet, snurran och tilldelningarna.

## Ändringar
1. **Snurran**
   - Ta bort den turkosa vänsterkanten från karaktärsraderna.
   - Behåll den valda mittenraden tydlig med den befintliga guldmarkeringen och pilarna.
   - Tona ned de horisontella radavdelarna så att namnen fortfarande är läsbara utan ett rutnätsliknande uttryck.

2. **Hela tilldelningssektionen**
   - Ta bort eller tona ned kantlinjer som inte behövs för struktur.
   - Använd luft, bakgrundstoner och rubrikhierarki i stället för linjer för att skilja spelarkontroller, snurra och resultat åt.
   - Behåll nuvarande placering där nya tilldelningar visas under snurran.

3. **Kontroll**
   - Kontrollera grundläge och tilldelat läge på dator och telefon.
   - Säkerställ att snurrans mittposition, animation och tilldelningslogik är oförändrade.

## Tekniskt
- Ändringarna begränsas till presentationsklasser och visuell styling i `CharacterWheel` och vid behov sektionens befintliga stilregler.
- Ingen speldata, översättning, slumpning eller sparning ändras.
