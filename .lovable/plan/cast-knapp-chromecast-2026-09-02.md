# Cast-knapp (Chromecast)

## Mål
Lägg till en "Casta"-knapp så spelsidan kan visas på en Chromecast/Chromecast-TV direkt från webbläsaren.

## Teknik — viktigt att veta
- Chromecast-stöd i webbsidor bygger på **Google Cast Web Sender SDK**, som bara fungerar i **Chrome och Edge** (desktop och Android) samt på sidor som serveras över **HTTPS** (Lovable-URL:en är HTTPS, så det är uppfyllt).
- I Safari/Firefox kan knappen inte casta — där döljs knappen, med en kort hjälptext i sammanfattningen att använda Chrome eller telefonens inbyggda skärmspegling.
- Sidan castas som en vanlig "custom receiver"-session (samma sida speglas på TV:n); eftersom hela spelet är localStorage-baserat på den enhet som castar fungerar det direkt utan extra backend.

## Implementation
1. **Ny komponent `src/components/CastButton.tsx`**
   - Laddar Cast SDK (`cast_sender.js`) dynamiskt vid första klick — ingen påverkan på laddtid annars.
   - Knapp med Cast-ikon (lucide `Cast`) i samma stil och placering som befintliga ThemeToggle/TvToggle-knappar.
   - Startar cast-session via `chrome.cast.requestSession()`; knappen visar aktiv status (glöd) när en session är igång, klick igen kopplar från.
   - Visas bara när `window.chrome?.cast` / API:t finns tillgängligt efter SDK-laddning (dvs Chrome/Edge + HTTPS).
   - Bonus: när castning startar aktiveras **TV-läget automatiskt** (stor text passar TV:n) och stängs av när man kopplar från, om det inte redan var påslaget manuellt.
2. **Integrera i `src/routes/index.tsx`** bredvid `TvToggle`.
3. **Hjälptext**: liten notering under knappraden på desktop eller i sammanfattningsmodalen: "Casta fungerar i Chrome/Edge — annars: använd telefonens skärmspegling."

## Verifiering
- Bygg går igenom.
- Knappen syns i Chrome i förhandsvisningen (cast till faktisk enhet kan inte testas i sandlådan, men session-flödet kodas enligt Cast SDK:s standardmönster).
