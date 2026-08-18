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
    "Måste kasta utan studs.",
    "Måste stå minst 50 cm bakom bordet.",
    "Om Gimli är med behöver Legolas inte delta i Barad'dur om Gimli sätter den.",
  ]},
  { name: "Boromir", faction: "good", rules: [
    "Har 2 liv.",
    "Måste använda 2 studs.",
    "Mot Frodo måste Boromir använda 1 studs.",
  ]},
  { name: "Gimli", faction: "good", rules: [
    "Måste kasta i ögonhöjd med bordet.",
    "Får gå runt bordet.",
    "Måste kasta utan studs.",
    "Om Legolas är med behöver Gimli inte delta i Barad'dur om Legolas sätter den.",
  ]},
  { name: "Frodo Baggins", faction: "good", rules: [
    "Kan bli osynlig 1 gång vid Barad'dur och behöver då inte delta.",
    "Om Sauron är med måste Frodo kasta med sin icke-dominanta hand.",
    "Om Frodo sätter bollen i Saurons glas måste alla onda delta i duellen.",
  ]},
  { name: "Aragorn", faction: "good", rules: [
    "Får hjälpa valfri god spelare i en duell.",
    "Aragorn åker inte själv ut om spelaren han hjälper förlorar duellen.",
  ]},
  { name: "Gandalf", faction: "good", rules: [
    "Har två former: Gandalf the Grey och Gandalf the White.",
    "Som Grey får Gandalf göra trickshots.",
    "För att bli White måste Gandalf dricka dubbelt.",
    "Som White kastar Gandalf normalt.",
    "Om Balrog vinner en duell mot Gandalf dör Gandalf direkt.",
  ]},
  { name: "Sam", faction: "good", quote: "Furthest I've ever been.", rules: [
    "Är alltid med i duell tillsammans med Frodo.",
    "Kan inte bli stunnad av Shelob.",
    "Behöver inte delta i Barad'dur om Frodo sätter den.",
    "Kan inte använda Sméagol.",
    "Måste alltid stå bredvid Frodo.",
    "Efter 3 hela varv får Sam kasta 2 gånger per runda.",
  ]},
  { name: "Arwen", faction: "good", rules: [
    "Kan återuppliva en utslagen spelare 1 gång per match.",
    "Den återupplivade spelaren kommer tillbaka med 1 liv.",
  ]},
  { name: "Treebeard", faction: "good", quote: "The Ents are going to war!", rules: [
    "Måste vänta 5 sekunder innan han får kasta.",
    "Får stå valfritt långt från bordet.",
    "Om Treebeard sätter Barad'dur måste alla säga: \"The Ents are going to war!\"",
  ]},

  // De Onda
  { name: "Saruman", faction: "evil", rules: [
    "Får endast kasta på Barad'dur.",
    "Måste kasta med studs.",
    "Behöver inte dricka om han missar Barad'dur.",
  ]},
  { name: "Witch-king of Angmar", faction: "evil", rules: [
    "Får flytta sig själv och sitt glas 1 gång per runda tillsammans med Nazgûlen.",
    "Kvinnliga spelare får 5 sekunders försprång mot Witch-king i duell.",
    "Får hjälp av Sauron i duell.",
  ]},
  { name: "Shelob", faction: "evil", rules: [
    "Om Shelob träffar en spelares glas blir spelaren stunnad i 1 runda.",
    "En stunnad spelare måste stå över sitt nästa kast.",
  ]},
  { name: "Oliphaunt", faction: "evil", rules: [
    "Måste kasta med elefantnäsa.",
    "Armen får placeras fritt.",
  ]},
  { name: "Lurtz", faction: "evil", rules: [
    "Dödar Boromir direkt.",
    "Måste kasta 2 bollar samtidigt, en i varje hand.",
    "Måste kasta utan studs.",
    "Om båda bollarna hamnar i samma spelares glas slipper Lurtz duell.",
  ]},
  { name: "Sauron", faction: "evil", rules: [
    "Måste stå på en stol.",
    "Måste släppa bollen med rak arm istället för att kasta den.",
    "Har 1 gratis Barad'dur-försök.",
    "Kan beordra Witch-king att hjälpa honom i en duell.",
    "Får inte säga \"Sméagol\" mot Gollum.",
  ]},
  { name: "Balrog", faction: "evil", rules: [
    "Måste alltid gå efter Gandalf om Gandalf är kvar.",
    "Får slå bort en boll med sin piska.",
  ]},
  { name: "Uruk-hai", faction: "evil", rules: [
    "Måste kasta med studs.",
    "Om Uruk-hai träffar en spelares glas får Uruk-hai kasta igen direkt efter vunnen duell.",
  ]},
  { name: "Cave Troll", faction: "evil", rules: [
    "Måste kasta med båda händerna.",
    "Får stå närmare bordet än övriga spelare.",
    "Om Cave Troll missar två kast i rad måste han göra ett trollvrål innan nästa kast.",
  ]},
  { name: "Mouth of Sauron", faction: "evil", rules: [
    "Måste annonsera varje duell och eliminering dramatiskt.",
    "En gång per match får han ge en spelare ett ultimatum: drick dubbelt, eller kasta sitt nästa kast med icke-dominanta handen.",
  ]},
  { name: "Gríma Wormtongue", faction: "evil", rules: [
    "Får prata och försöka störa andra spelare under deras kast.",
    "1 gång per match får han tvinga två spelare att byta plats.",
  ]},

  // Neutrala
  { name: "Gollum / Sméagol", faction: "neutral", quote: "Precious.", rules: [
    "Måste alltid stå bredvid Frodo.",
    "Måste säga \"Precious\" innan sitt kast.",
    "Växlar mellan Gollum och Sméagol varje runda.",
    "Är neutral och tillhör varken de goda eller onda.",
    "Gollum får alltid tillbaka Sméagol.",
    "Sméagol får inte använda Gollums specialregler förrän nästa runda.",
  ]},
  { name: "Tom Bombadil", faction: "neutral", rules: [
    "Är immun mot Barad'dur.",
    "Ingen får rikta ett kast mot Tom två rundor i rad.",
    "Måste sjunga eller nynna innan sitt kast.",
  ]},
];

export const factionLabel: Record<Faction, string> = {
  good: "De Goda",
  evil: "De Onda",
  neutral: "Neutrala",
};

export type RelationKind = "ally" | "rival";

export interface Relation {
  a: string;
  b: string;
  kind: RelationKind;
  label: string;
  detail: string;
}

export const relations: Relation[] = [
  {
    a: "Legolas", b: "Gimli", kind: "ally",
    label: "Vänskapspakt",
    detail: "Om den ene sätter Barad'dur behöver den andre inte delta.",
  },
  {
    a: "Frodo Baggins", b: "Sam", kind: "ally",
    label: "Trogna följeslagare",
    detail: "Sam är alltid med i duell tillsammans med Frodo, står bredvid honom och slipper Barad'dur om Frodo sätter den.",
  },
  {
    a: "Frodo Baggins", b: "Gollum / Sméagol", kind: "rival",
    label: "Ringens börda",
    detail: "Gollum måste alltid stå bredvid Frodo.",
  },
  {
    a: "Sam", b: "Gollum / Sméagol", kind: "rival",
    label: "Misstro",
    detail: "Sam kan inte använda Sméagol.",
  },
  {
    a: "Gandalf", b: "Balrog", kind: "rival",
    label: "Dödsfiender",
    detail: "Balrog måste alltid gå efter Gandalf. Vinner Balrog duellen dör Gandalf direkt.",
  },
  {
    a: "Boromir", b: "Lurtz", kind: "rival",
    label: "Ödesduell",
    detail: "Lurtz dödar Boromir direkt.",
  },
  {
    a: "Boromir", b: "Frodo Baggins", kind: "rival",
    label: "Ringens frestelse",
    detail: "Mot Frodo måste Boromir använda 1 studs.",
  },
  {
    a: "Frodo Baggins", b: "Sauron", kind: "rival",
    label: "Ögats blick",
    detail: "Om Sauron är med måste Frodo kasta med sin icke-dominanta hand. Sätter Frodo bollen i Saurons glas måste alla onda delta i duellen.",
  },
  {
    a: "Sauron", b: "Witch-king of Angmar", kind: "ally",
    label: "Herre och tjänare",
    detail: "Sauron kan beordra Witch-king att hjälpa honom i duell — och Witch-king får hjälp av Sauron.",
  },
  {
    a: "Sauron", b: "Gollum / Sméagol", kind: "rival",
    label: "Förbjudet ord",
    detail: "Sauron får inte säga \"Sméagol\" mot Gollum.",
  },
  {
    a: "Shelob", b: "Sam", kind: "rival",
    label: "Spindelns nät",
    detail: "Sam kan inte bli stunnad av Shelob.",
  },
];

export function findRelations(names: string[]): Relation[] {
  const set = new Set(names);
  return relations.filter((r) => set.has(r.a) && set.has(r.b));
}
