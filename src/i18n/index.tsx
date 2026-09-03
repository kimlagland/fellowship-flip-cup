import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Lang } from "@/data/characters";

export type { Lang };

const STORAGE_KEY = "baraddur:lang";

export const strings = {
  sv: {
    // Hero
    eyebrow: "Lord of the Beers",
    tagline:
      "\"One game to rule them all\" — Ett dricksspel inspirerat av Sagan om Ringen, beer pong och flip the cup.",
    ctaWheel: "Tilldela karaktärer",
    ctaRules: "Läs reglerna",
    metaDescription:
      "Ett episkt dricksspel inspirerat av Sagan om Ringen, beer pong och flip the cup. Regler, karaktärer och slumpgenerator.",

    // Rules
    chapter1: "Kapitel I",
    chapter2: "Kapitel II",
    chapter3: "Kapitel III",
    chapter4: "Kapitel IV",
    important: "Viktigt",
    basicRules: "Grundregler",
    setup: "Setup",
    setupItems: [
      "Alla spelare har ett eget glas runt bordet.",
      "Varje glas fylls med ca 2 klunkar valfri dryck.",
    ],
    setupTower: "Ett större glas eller torn placeras i mitten:",
    setupTowerFill: "Barad'dur fylls med ca 2 klunkar valfri dryck.",
    flow: "Spelets gång",
    flowItems: [
      "På sin tur kastar spelaren en pingisboll mot en annan spelares glas eller Barad'dur.",
      "Alltid med studs, om inte annat anges.",
    ],
    bounceTitle: "Regel om studs",
    bounceItems: [
      { pre: "När en karaktär ", strong: "måste kasta med studs", post: " är studs obligatoriskt." },
      { pre: "När en karaktär har ", strong: "1 studs", post: " måste bollen studsa exakt 1 gång innan den får träffa ett glas." },
      { pre: "När en karaktär har ", strong: "2 studs", post: " måste bollen studsa exakt 2 gånger innan den får träffa ett glas." },
      { pre: "När en karaktär ", strong: "måste kasta utan studs", post: " får bollen inte studsa innan den träffar glaset." },
      { pre: "Om en karaktär inte har någon särskild regel om studs gäller spelets vanliga kastregler.", strong: "", post: "" },
    ],
    duelsTitle: "Dueller",
    duelsIntroPre: "När bollen landar i en spelares glas startar en ",
    duelWord: "duell",
    duelsItems: [
      "Den som kastade börjar dricka direkt.",
      "Den träffade spelaren plockar först upp bollen ur glaset.",
      "Därefter får den träffade börja dricka.",
    ],
    duelsFlipPre: "När en spelare druckit upp måste den göra ",
    flipTheCup: "Flip the Cup",
    duelsItems2: [
      "Först att lyckas flippa glaset vinner duellen.",
      "Förloraren åker ut ur spelet.",
    ],
    towerTitle: "Barad'dur",
    towerIntro: "För att få kasta mot tornet i mitten måste spelaren ropa:",
    onMiss: "Vid miss",
    onMissText: "Spelaren dricker upp innehållet i Barad'dur. Tornet fylls sedan på igen.",
    onHit: "Vid träff",
    onHitText:
      "Alla andra spelare deltar i en gemensam duell. Den som satte bollen slipper. Sista att lyckas med Flip the Cup åker ut.",
    finalTitle: "Finalen",
    finalIntro: "När endast två spelare återstår börjar finalen.",
    finalItems: [
      { pre: "De första 5 rundorna spelas ", strong: "med studs", post: "." },
      { pre: "Därefter spelas resten ", strong: "utan studs", post: "." },
    ],
    honorTitle: "Hederskodex",
    honorItems: [
      "Den som hjälper någon i en duell åker inte själv ut vid förlust.",
      "Alla måste alltid göra sitt bästa.",
      "Om gruppen anser att någon medvetet kastar eller flippar dåligt kan spelaren röstas ut.",
    ],

    // Wheel section
    wheelEyebrow: "The Eye is upon you",
    wheelTitle: "Tilldela karaktärer",
    wheelSubtitle: "Skriv in alla spelare och låt Eye of Sauron avgöra ert öde.",
    fellowship: "Sällskapet",
    fellowshipHint: "Lägg till alla spelare som ska tilldelas en karaktär.",
    playerPlaceholder: (n: number) => `Spelare ${n}`,
    addPlayer: "Lägg till spelare",
    spin: "Snurra Eye of Sauron",
    showSummary: "Visa sammanfattning",
    restart: "Börja om",
    randomTeams: "Slumpa lag",
    drawFirst: "Dra lott: vem börjar",
    redraw: "Dra om lott",
    clearSaved: "Rensa sparat",
    startsGame: "Börjar spelet",
    assignments: "Tilldelningar",
    spinningFor: "Snurrar för",
    got: "fick",
    idleReel: "One Reel to rule them all",

    // Summary
    summaryTitle: "Tilldelade karaktärer",
    summaryDesc: "Här är alla spelare och deras unika regler/förmågor.",
    alliancesTitle: "Allianser & fiendskap",
    allies: "Allierade",
    enemies: "Fiender",
    ally: "Allierad",
    enemy: "Fiende",
    playersCount: "spelare",
    playerLabel: "Spelare",
    rulesLabel: "Regler / förmågor",
    connections: "Kopplingar",
    close: "Stäng",
    alliance: "Allians",
    enmity: "Fiendskap",
    playedBy: "spelas av",

    // Footer + toggles
    footerQuote: "\"Even the smallest person can change the course of the future.\"",
    footerNote: "Drick ansvarsfullt. 18+.",
    toLight: "Byt till ljust tema",
    toDark: "Byt till mörkt tema",
    exitFullscreen: "Avsluta fullskärm",
    fullscreen: "Fullskärm",
    tvOff: "Stäng TV-läge",
    tvOn: "Slå på TV-läge",
    casting: "Castar till TV",
    castTo: "Casta till Chromecast/TV",
    castingTitle: "Spelet visas på TV:n (stäng fliken på TV:n för att sluta)",
    switchLang: "Switch to English",
  },
  en: {
    eyebrow: "Lord of the Beers",
    tagline:
      "\"One game to rule them all\" — A drinking game inspired by The Lord of the Rings, beer pong and flip the cup.",
    ctaWheel: "Assign characters",
    ctaRules: "Read the rules",
    metaDescription:
      "An epic drinking game inspired by The Lord of the Rings, beer pong and flip the cup. Rules, characters and a random character generator.",

    chapter1: "Chapter I",
    chapter2: "Chapter II",
    chapter3: "Chapter III",
    chapter4: "Chapter IV",
    important: "Important",
    basicRules: "Basic rules",
    setup: "Setup",
    setupItems: [
      "Every player has their own cup around the table.",
      "Each cup is filled with about 2 sips of any drink.",
    ],
    setupTower: "A bigger glass or tower is placed in the middle:",
    setupTowerFill: "Barad'dur is filled with about 2 sips of any drink.",
    flow: "How to play",
    flowItems: [
      "On your turn you throw a ping pong ball at another player's cup or at Barad'dur.",
      "Always with a bounce, unless stated otherwise.",
    ],
    bounceTitle: "The bounce rule",
    bounceItems: [
      { pre: "When a character ", strong: "must throw with a bounce", post: ", bouncing is mandatory." },
      { pre: "When a character has ", strong: "1 bounce", post: ", the ball must bounce exactly once before it may hit a cup." },
      { pre: "When a character has ", strong: "2 bounces", post: ", the ball must bounce exactly twice before it may hit a cup." },
      { pre: "When a character ", strong: "must throw without a bounce", post: ", the ball may not bounce before hitting the cup." },
      { pre: "If a character has no special bounce rule, the normal throwing rules apply.", strong: "", post: "" },
    ],
    duelsTitle: "Duels",
    duelsIntroPre: "When the ball lands in a player's cup, a ",
    duelWord: "duel",
    duelsItems: [
      "The thrower starts drinking immediately.",
      "The player who was hit first picks the ball out of the cup.",
      "After that, the player who was hit may start drinking.",
    ],
    duelsFlipPre: "When a player has finished drinking they must do a ",
    flipTheCup: "Flip the Cup",
    duelsItems2: [
      "First one to flip the cup wins the duel.",
      "The loser is out of the game.",
    ],
    towerTitle: "Barad'dur",
    towerIntro: "To throw at the tower in the middle, the player must shout:",
    onMiss: "On a miss",
    onMissText: "The player drinks the contents of Barad'dur. The tower is then refilled.",
    onHit: "On a hit",
    onHitText:
      "All other players join one big duel. The thrower is exempt. The last one to flip their cup is out.",
    finalTitle: "The final",
    finalIntro: "When only two players remain, the final begins.",
    finalItems: [
      { pre: "The first 5 rounds are played ", strong: "with bounces", post: "." },
      { pre: "After that the rest is played ", strong: "without bounces", post: "." },
    ],
    honorTitle: "Code of honour",
    honorItems: [
      "Whoever helps someone in a duel is not eliminated when they lose.",
      "Everyone must always do their best.",
      "If the group thinks someone is throwing or flipping badly on purpose, that player can be voted out.",
    ],

    wheelEyebrow: "The Eye is upon you",
    wheelTitle: "Assign characters",
    wheelSubtitle: "Enter all players and let the Eye of Sauron decide your fate.",
    fellowship: "The fellowship",
    fellowshipHint: "Add everyone who should be assigned a character.",
    playerPlaceholder: (n: number) => `Player ${n}`,
    addPlayer: "Add player",
    spin: "Spin the Eye of Sauron",
    showSummary: "Show summary",
    restart: "Start over",
    randomTeams: "Random teams",
    drawFirst: "Draw lots: who starts",
    redraw: "Draw again",
    clearSaved: "Clear saved game",
    startsGame: "Starts the game",
    assignments: "Assignments",
    spinningFor: "Spinning for",
    got: "got",
    idleReel: "One Reel to rule them all",

    summaryTitle: "Assigned characters",
    summaryDesc: "Here are all players and their unique rules/abilities.",
    alliancesTitle: "Alliances & rivalries",
    allies: "Allies",
    enemies: "Enemies",
    ally: "Ally",
    enemy: "Enemy",
    playersCount: "players",
    playerLabel: "Player",
    rulesLabel: "Rules / abilities",
    connections: "Connections",
    close: "Close",
    alliance: "Alliance",
    enmity: "Rivalry",
    playedBy: "played by",

    footerQuote: "\"Even the smallest person can change the course of the future.\"",
    footerNote: "Drink responsibly. 18+.",
    toLight: "Switch to light theme",
    toDark: "Switch to dark theme",
    exitFullscreen: "Exit fullscreen",
    fullscreen: "Fullscreen",
    tvOff: "Turn off TV mode",
    tvOn: "Turn on TV mode",
    casting: "Casting to TV",
    castTo: "Cast to Chromecast/TV",
    castingTitle: "The game is showing on the TV (close the tab on the TV to stop)",
    switchLang: "Byt till svenska",
  },
} as const;

export type Strings = (typeof strings)["sv"];

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Strings;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "sv",
  setLang: () => {},
  t: strings.sv,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("sv");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "sv" || saved === "en") setLangState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: strings[lang] as Strings }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
