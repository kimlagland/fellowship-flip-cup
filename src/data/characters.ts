export type Faction = "good" | "evil" | "neutral";
export type Lang = "sv" | "en";

export interface Character {
  name: string;
  faction: Faction;
  rules: string[];
  rulesEn: string[];
  quote?: string;
}

export const characters: Character[] = [
  // De Goda
  { name: "Legolas", faction: "good",
    rules: [
      "Måste kasta utan studs.",
      "Måste stå minst 50 cm bakom bordet.",
      "Om Gimli är med behöver Legolas inte delta i Barad'dur om Gimli sätter den.",
    ],
    rulesEn: [
      "Must throw without a bounce.",
      "Must stand at least 50 cm behind the table.",
      "If Gimli is playing, Legolas does not have to join the Barad'dur duel when Gimli sinks it.",
    ]},
  { name: "Boromir", faction: "good",
    rules: [
      "Har 2 liv.",
      "Måste använda 2 studs.",
      "Mot Frodo måste Boromir använda 1 studs.",
    ],
    rulesEn: [
      "Has 2 lives.",
      "Must use 2 bounces.",
      "Against Frodo, Boromir must use 1 bounce.",
    ]},
  { name: "Gimli", faction: "good",
    rules: [
      "Måste kasta i ögonhöjd med bordet.",
      "Får gå runt bordet.",
      "Måste kasta utan studs.",
      "Om Legolas är med behöver Gimli inte delta i Barad'dur om Legolas sätter den.",
    ],
    rulesEn: [
      "Must throw at eye level with the table.",
      "May walk around the table.",
      "Must throw without a bounce.",
      "If Legolas is playing, Gimli does not have to join the Barad'dur duel when Legolas sinks it.",
    ]},
  { name: "Frodo Baggins", faction: "good",
    rules: [
      "Kan bli osynlig 1 gång vid Barad'dur och behöver då inte delta.",
      "Om Sauron är med måste Frodo kasta med sin icke-dominanta hand.",
      "Om Frodo sätter bollen i Saurons glas måste alla onda delta i duellen.",
    ],
    rulesEn: [
      "Can turn invisible once during a Barad'dur duel and skip it.",
      "If Sauron is playing, Frodo must throw with his non-dominant hand.",
      "If Frodo sinks the ball in Sauron's cup, all evil players must join the duel.",
    ]},
  { name: "Aragorn", faction: "good",
    rules: [
      "Får hjälpa valfri god spelare i en duell.",
      "Aragorn åker inte själv ut om spelaren han hjälper förlorar duellen.",
    ],
    rulesEn: [
      "May help any good player in a duel.",
      "Aragorn is not eliminated himself if the player he helps loses the duel.",
    ]},
  { name: "Gandalf", faction: "good",
    rules: [
      "Har två former: Gandalf the Grey och Gandalf the White.",
      "Som Grey får Gandalf göra trickshots.",
      "För att bli White måste Gandalf dricka dubbelt.",
      "Som White kastar Gandalf normalt.",
      "Om Balrog vinner en duell mot Gandalf dör Gandalf direkt.",
    ],
    rulesEn: [
      "Has two forms: Gandalf the Grey and Gandalf the White.",
      "As Grey, Gandalf may perform trick shots.",
      "To become White, Gandalf must drink double.",
      "As White, Gandalf throws normally.",
      "If the Balrog wins a duel against Gandalf, Gandalf dies instantly.",
    ]},
  { name: "Sam", faction: "good", quote: "Furthest I've ever been.",
    rules: [
      "Är alltid med i duell tillsammans med Frodo.",
      "Kan inte bli stunnad av Shelob.",
      "Behöver inte delta i Barad'dur om Frodo sätter den.",
      "Kan inte använda Sméagol.",
      "Måste alltid stå bredvid Frodo.",
      "Efter 3 hela varv får Sam kasta 2 gånger per runda.",
    ],
    rulesEn: [
      "Always joins Frodo in his duels.",
      "Cannot be stunned by Shelob.",
      "Does not have to join the Barad'dur duel when Frodo sinks it.",
      "Cannot use Sméagol.",
      "Must always stand next to Frodo.",
      "After 3 full rounds, Sam may throw twice per turn.",
    ]},
  { name: "Arwen", faction: "good",
    rules: [
      "Kan återuppliva en utslagen spelare 1 gång per match.",
      "Den återupplivade spelaren kommer tillbaka med 1 liv.",
    ],
    rulesEn: [
      "Can revive an eliminated player once per game.",
      "The revived player returns with 1 life.",
    ]},
  { name: "Treebeard", faction: "good", quote: "The Ents are going to war!",
    rules: [
      "Måste vänta 5 sekunder innan han får kasta.",
      "Får stå valfritt långt från bordet.",
      "Om Treebeard sätter Barad'dur måste alla säga: \"The Ents are going to war!\"",
    ],
    rulesEn: [
      "Must wait 5 seconds before throwing.",
      "May stand at any distance from the table.",
      "If Treebeard sinks Barad'dur, everyone must shout: \"The Ents are going to war!\"",
    ]},

  // De Onda
  { name: "Saruman", faction: "evil",
    rules: [
      "Får endast kasta på Barad'dur.",
      "Måste kasta med studs.",
      "Behöver inte dricka om han missar Barad'dur.",
    ],
    rulesEn: [
      "May only throw at Barad'dur.",
      "Must throw with a bounce.",
      "Does not have to drink when he misses Barad'dur.",
    ]},
  { name: "Witch-king of Angmar", faction: "evil",
    rules: [
      "Får flytta sig själv och sitt glas 1 gång per runda tillsammans med Nazgûlen.",
      "Kvinnliga spelare får 5 sekunders försprång mot Witch-king i duell.",
      "Får hjälp av Sauron i duell.",
    ],
    rulesEn: [
      "May move himself and his cup once per round together with the Nazgûl.",
      "Female players get a 5 second head start against the Witch-king in a duel.",
      "Receives help from Sauron in duels.",
    ]},
  { name: "Shelob", faction: "evil",
    rules: [
      "Om Shelob träffar en spelares glas blir spelaren stunnad i 1 runda.",
      "En stunnad spelare måste stå över sitt nästa kast.",
    ],
    rulesEn: [
      "If Shelob hits a player's cup, that player is stunned for 1 round.",
      "A stunned player must skip their next throw.",
    ]},
  { name: "Oliphaunt", faction: "evil",
    rules: [
      "Måste kasta med elefantnäsa.",
      "Armen får placeras fritt.",
    ],
    rulesEn: [
      "Must throw while making an elephant trunk.",
      "The arm may be placed freely.",
    ]},
  { name: "Lurtz", faction: "evil",
    rules: [
      "Dödar Boromir direkt.",
      "Måste kasta 2 bollar samtidigt, en i varje hand.",
      "Måste kasta utan studs.",
      "Om båda bollarna hamnar i samma spelares glas slipper Lurtz duell.",
    ],
    rulesEn: [
      "Kills Boromir instantly.",
      "Must throw 2 balls at once, one in each hand.",
      "Must throw without a bounce.",
      "If both balls land in the same player's cup, Lurtz skips the duel.",
    ]},
  { name: "Sauron", faction: "evil",
    rules: [
      "Måste stå på en stol.",
      "Måste släppa bollen med rak arm istället för att kasta den.",
      "Har 1 gratis Barad'dur-försök.",
      "Kan beordra Witch-king att hjälpa honom i en duell.",
      "Får inte säga \"Sméagol\" mot Gollum.",
    ],
    rulesEn: [
      "Must stand on a chair.",
      "Must drop the ball with a straight arm instead of throwing it.",
      "Has 1 free Barad'dur attempt.",
      "Can order the Witch-king to help him in a duel.",
      "May not say \"Sméagol\" to Gollum.",
    ]},
  { name: "Balrog", faction: "evil",
    rules: [
      "Måste alltid gå efter Gandalf om Gandalf är kvar.",
      "Får slå bort en boll med sin piska.",
    ],
    rulesEn: [
      "Must always target Gandalf while Gandalf is still in the game.",
      "May swat a ball away with his whip.",
    ]},
  { name: "Uruk-hai", faction: "evil",
    rules: [
      "Måste kasta med studs.",
      "Om Uruk-hai träffar en spelares glas får Uruk-hai kasta igen direkt efter vunnen duell.",
    ],
    rulesEn: [
      "Must throw with a bounce.",
      "If Uruk-hai hits a player's cup, he throws again immediately after winning the duel.",
    ]},
  { name: "Cave Troll", faction: "evil",
    rules: [
      "Måste kasta med båda händerna.",
      "Får stå närmare bordet än övriga spelare.",
      "Om Cave Troll missar två kast i rad måste han göra ett trollvrål innan nästa kast.",
    ],
    rulesEn: [
      "Must throw with both hands.",
      "May stand closer to the table than the other players.",
      "If the Cave Troll misses two throws in a row, he must roar before the next throw.",
    ]},
  { name: "Mouth of Sauron", faction: "evil",
    rules: [
      "Måste annonsera varje duell och eliminering dramatiskt.",
      "En gång per match får han ge en spelare ett ultimatum: drick dubbelt, eller kasta sitt nästa kast med icke-dominanta handen.",
    ],
    rulesEn: [
      "Must announce every duel and elimination dramatically.",
      "Once per game he may give a player an ultimatum: drink double, or make the next throw with the non-dominant hand.",
    ]},
  { name: "Gríma Wormtongue", faction: "evil",
    rules: [
      "Får prata och försöka störa andra spelare under deras kast.",
      "1 gång per match får han tvinga två spelare att byta plats.",
    ],
    rulesEn: [
      "May talk and try to distract other players during their throws.",
      "Once per game he may force two players to swap places.",
    ]},

  // Neutrala
  { name: "Gollum / Sméagol", faction: "neutral", quote: "Precious.",
    rules: [
      "Måste alltid stå bredvid Frodo.",
      "Måste säga \"Precious\" innan sitt kast.",
      "Växlar mellan Gollum och Sméagol varje runda.",
      "Är neutral och tillhör varken de goda eller onda.",
      "Gollum får alltid tillbaka Sméagol.",
      "Sméagol får inte använda Gollums specialregler förrän nästa runda.",
    ],
    rulesEn: [
      "Must always stand next to Frodo.",
      "Must say \"Precious\" before every throw.",
      "Switches between Gollum and Sméagol every round.",
      "Is neutral and belongs to neither the good nor the evil side.",
      "Gollum always gets Sméagol back.",
      "Sméagol may not use Gollum's special rules until the next round.",
    ]},
  { name: "Tom Bombadil", faction: "neutral",
    rules: [
      "Är immun mot Barad'dur.",
      "Ingen får rikta ett kast mot Tom två rundor i rad.",
      "Måste sjunga eller nynna innan sitt kast.",
    ],
    rulesEn: [
      "Is immune to Barad'dur.",
      "No one may target Tom two rounds in a row.",
      "Must sing or hum before every throw.",
    ]},
];

export const factionLabels: Record<Lang, Record<Faction, string>> = {
  sv: { good: "De Goda", evil: "De Onda", neutral: "Neutrala" },
  en: { good: "The Good", evil: "The Evil", neutral: "Neutral" },
};

/** Kept for backwards compatibility (Swedish labels). */
export const factionLabel: Record<Faction, string> = factionLabels.sv;

export function characterRules(c: Character, lang: Lang): string[] {
  return lang === "en" ? c.rulesEn : c.rules;
}

export type RelationKind = "ally" | "rival";

export interface Relation {
  a: string;
  b: string;
  kind: RelationKind;
  label: string;
  detail: string;
  labelEn: string;
  detailEn: string;
}

export const relations: Relation[] = [
  {
    a: "Legolas", b: "Gimli", kind: "ally",
    label: "Vänskapspakt",
    detail: "Om den ene sätter Barad'dur behöver den andre inte delta.",
    labelEn: "Pact of friendship",
    detailEn: "If one of them sinks Barad'dur, the other does not have to join the duel.",
  },
  {
    a: "Frodo Baggins", b: "Sam", kind: "ally",
    label: "Trogna följeslagare",
    detail: "Sam är alltid med i duell tillsammans med Frodo, står bredvid honom och slipper Barad'dur om Frodo sätter den.",
    labelEn: "Loyal companions",
    detailEn: "Sam always joins Frodo's duels, stands next to him and skips Barad'dur when Frodo sinks it.",
  },
  {
    a: "Frodo Baggins", b: "Gollum / Sméagol", kind: "rival",
    label: "Ringens börda",
    detail: "Gollum måste alltid stå bredvid Frodo.",
    labelEn: "Burden of the Ring",
    detailEn: "Gollum must always stand next to Frodo.",
  },
  {
    a: "Sam", b: "Gollum / Sméagol", kind: "rival",
    label: "Misstro",
    detail: "Sam kan inte använda Sméagol.",
    labelEn: "Distrust",
    detailEn: "Sam cannot use Sméagol.",
  },
  {
    a: "Gandalf", b: "Balrog", kind: "rival",
    label: "Dödsfiender",
    detail: "Balrog måste alltid gå efter Gandalf. Vinner Balrog duellen dör Gandalf direkt.",
    labelEn: "Mortal enemies",
    detailEn: "The Balrog must always target Gandalf. If the Balrog wins the duel, Gandalf dies instantly.",
  },
  {
    a: "Boromir", b: "Lurtz", kind: "rival",
    label: "Ödesduell",
    detail: "Lurtz dödar Boromir direkt.",
    labelEn: "Duel of fate",
    detailEn: "Lurtz kills Boromir instantly.",
  },
  {
    a: "Boromir", b: "Frodo Baggins", kind: "rival",
    label: "Ringens frestelse",
    detail: "Mot Frodo måste Boromir använda 1 studs.",
    labelEn: "Temptation of the Ring",
    detailEn: "Against Frodo, Boromir must use 1 bounce.",
  },
  {
    a: "Frodo Baggins", b: "Sauron", kind: "rival",
    label: "Ögats blick",
    detail: "Om Sauron är med måste Frodo kasta med sin icke-dominanta hand. Sätter Frodo bollen i Saurons glas måste alla onda delta i duellen.",
    labelEn: "Gaze of the Eye",
    detailEn: "If Sauron is playing, Frodo must throw with his non-dominant hand. If Frodo sinks the ball in Sauron's cup, all evil players must join the duel.",
  },
  {
    a: "Sauron", b: "Witch-king of Angmar", kind: "ally",
    label: "Herre och tjänare",
    detail: "Sauron kan beordra Witch-king att hjälpa honom i duell — och Witch-king får hjälp av Sauron.",
    labelEn: "Master and servant",
    detailEn: "Sauron can order the Witch-king to help him in a duel — and the Witch-king receives Sauron's help.",
  },
  {
    a: "Sauron", b: "Gollum / Sméagol", kind: "rival",
    label: "Förbjudet ord",
    detail: "Sauron får inte säga \"Sméagol\" mot Gollum.",
    labelEn: "Forbidden word",
    detailEn: "Sauron may not say \"Sméagol\" to Gollum.",
  },
  {
    a: "Shelob", b: "Sam", kind: "rival",
    label: "Spindelns nät",
    detail: "Sam kan inte bli stunnad av Shelob.",
    labelEn: "The spider's web",
    detailEn: "Sam cannot be stunned by Shelob.",
  },
];

export function relationLabel(r: Relation, lang: Lang): string {
  return lang === "en" ? r.labelEn : r.label;
}

export function relationDetail(r: Relation, lang: Lang): string {
  return lang === "en" ? r.detailEn : r.detail;
}

export function findRelations(names: string[]): Relation[] {
  const set = new Set(names);
  return relations.filter((r) => set.has(r.a) && set.has(r.b));
}
