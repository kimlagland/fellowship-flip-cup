export type Faction = "good" | "evil" | "neutral";

export interface Character {
  name: string;
  faction: Faction;
  rules: string[];
  quote?: string;
}

export const characters: Character[] = [
  // De Goda
  { name: "Legolas", faction: "good", rules: [
    "Kastar utan studs.",
    "Måste stå minst 50 cm bakom bordet.",
    "Om Gimli sätter Barad'dur behöver Legolas inte delta.",
  ]},
  { name: "Boromir", faction: "good", rules: [
    "Har 2 liv.",
    "Får använda 2 studsar.",
    "Mot Frodo får han bara använda 1 studs.",
  ]},
  { name: "Gimli", faction: "good", rules: [
    "Måste kasta i ögonhöjd med bordet.",
    "Får gå runt bordet.",
    "Kastar utan studs.",
    "Om Legolas sätter Barad'dur behöver Gimli inte delta.",
  ]},
  { name: "Frodo Baggins", faction: "good", rules: [
    "Kan bli osynlig 1 gång vid Barad'dur och slipper då delta.",
    "Om Sauron är med måste Frodo kasta med sin icke-dominanta hand.",
    "Om Frodo sätter bollen i Saurons glas måste alla onda spelare delta i duellen.",
  ]},
  { name: "Aragorn", faction: "good", rules: [
    "Får hjälpa valfri god spelare i dueller.",
    "Åker inte själv ut vid förlust när han hjälper.",
  ]},
  { name: "Gandalf", faction: "good", rules: [
    "Har två former: Grey och White.",
    "Som Grey får Gandalf göra trickshots.",
    "Startar alltid som Grey. Blir han dödad kan han bli White.",
    "För att bli White måste Gandalf dricka dubbelt.",
    "Som White kastar Gandalf normalt.",
    "Om Balrogen vinner en duell mot Gandalf dör Gandalf direkt.",
  ]},
  { name: "Sam", faction: "good", quote: "Furthest I've ever been.", rules: [
    "Är alltid med i duell tillsammans med Frodo.",
    "Kan inte bli stunnad av Shelob.",
    "Behöver inte delta i Barad'dur om Frodo sätter den.",
    "Kan inte använda \"Sméagol\".",
    "Måste alltid stå bredvid Frodo.",
    "Efter 3 varv får Sam kasta 2 gånger per tur.",
  ]},
  { name: "Treebeard", faction: "good", quote: "The Ents are going to war!", rules: [
    "Måste ta extremt lång tid på sig innan kast.",
    "Får stå valfritt långt från bordet.",
    "Om Treebeard sätter Barad'dur måste alla säga: \"The Ents are going to war!\"",
  ]},
  { name: "Arwen", faction: "good", rules: [
    "Kan hela en spelare tillbaka in i spelet 1 gång.",
    "Den återupplivade spelaren kommer tillbaka med endast 1 liv.",
  ]},

  // De Onda
  { name: "Saruman", faction: "evil", rules: [
    "Får endast kasta på Barad'dur.",
    "Måste kasta med studs.",
    "Behöver inte dricka när han missar.",
  ]},
  { name: "Witch-king of Angmar", faction: "evil", rules: [
    "Får flytta både sig själv och sitt glas 1 gång per runda tillsammans med Nazgûlen.",
    "Kvinnor får 5 sekunders försprång i dueller mot honom.",
    "Får hjälp av Sauron i dueller.",
  ]},
  { name: "Shelob", faction: "evil", rules: [
    "Om Shelob träffar någons glas blir den spelaren stunnad i 1 runda.",
    "En stunnad spelare skippar sitt nästa kast.",
  ]},
  { name: "Oliphaunt", faction: "evil", rules: [
    "Måste kasta med \"elefantnäsa\".",
    "Armen får hållas var som helst.",
  ]},
  { name: "Lurtz", faction: "evil", rules: [
    "Dödar Boromir direkt.",
    "Kastar 2 bollar samtidigt, en i varje hand.",
    "Ingen studs.",
    "Om båda bollarna träffar slipper Lurtz duell.",
  ]},
  { name: "Sauron", faction: "evil", rules: [
    "Måste stå på en stol.",
    "Släpper bollen med rak arm istället för att kasta.",
    "Har 1 gratis Barad'dur-försök.",
    "Kan beordra Witch-king att hjälpa i dueller.",
    "Får inte säga \"Sméagol\" mot Gollum.",
  ]},
  { name: "Balrog", faction: "evil", rules: [
    "Måste alltid gå efter Gandalf.",
    "Får slå bort en boll med sin piska.",
  ]},
  { name: "Gríma Wormtongue", faction: "evil", rules: [
    "Får prata under andras kast för att störa.",
    "Kan övertala två spelare att byta plats 1 gång per match.",
  ]},
  { name: "Mouth of Sauron", faction: "evil", rules: [
    "Måste annonsera alla elimineringar dramatiskt.",
    "Får ge en spelare ett \"ultimatum\": drick dubbelt, eller kasta med stängda ögon nästa runda.",
  ]},
  { name: "Uruk-hai", faction: "evil", rules: [
    "Måste kasta hårdast möjligt.",
    "Om bollen studsar ut från glaset räknas det ändå.",
  ]},
  { name: "Cave Troll", faction: "evil", rules: [
    "Måste kasta med två händer.",
    "Får stå närmare bordet än alla andra.",
    "Om Cave Troll missar två gånger i rad måste den vråla innan nästa kast.",
  ]},

  // Neutral
  { name: "Gollum / Sméagol", faction: "neutral", quote: "Precious.", rules: [
    "Måste alltid stå bredvid Frodo.",
    "Får alltid tillbaka Sméagol.",
    "Måste säga: \"Precious.\"",
    "Växlar varje runda mellan Gollum och Sméagol.",
    "Är neutral och tillhör varken de goda eller onda.",
  ]},
  { name: "Tom Bombadil", faction: "neutral", rules: [
    "Är helt immun mot Barad'dur.",
    "Ingen får attackera Tom två rundor i rad.",
    "Måste sjunga innan varje kast.",
  ]},
];

export const factionLabel: Record<Faction, string> = {
  good: "De Goda",
  evil: "De Onda",
  neutral: "Neutral",
};
