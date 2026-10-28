export interface WrathCard {
  sv: { title: string; text: string };
  en: { title: string; text: string };
}

export const wrathCards: WrathCard[] = [
  { sv: { title: "Saurons blick", text: "Nästa kast måste kastas med icke-dominant hand." }, en: { title: "Sauron's Gaze", text: "The next throw must be made with your non-dominant hand." } },
  { sv: { title: "Ringens frestelse", text: "Alla tar 1 klunk — eller så tar den som leder 3 klunkar." }, en: { title: "Temptation of the Ring", text: "Everyone drinks 1 sip — or the leader drinks 3." } },
  { sv: { title: "Morias eko", text: "Den som pratar högre än en viskning under nästa runda dricker en straffklunk." }, en: { title: "Echoes of Moria", text: "Anyone speaking louder than a whisper next round drinks a penalty sip." } },
  { sv: { title: "Gollums förräderi", text: "Vänd! Turordningen byter håll direkt." }, en: { title: "Gollum's Betrayal", text: "Reverse! Turn order switches direction immediately." } },
  { sv: { title: "Orcher i bakhåll", text: "Studsträffar räknas dubbelt under nästa runda." }, en: { title: "Orc Ambush", text: "Bounce hits count double during the next round." } },
  { sv: { title: "Entarnas marsch", text: "Spelet pausas — alla tar en långsam klunk tillsammans." }, en: { title: "March of the Ents", text: "Game pauses — everyone takes one slow sip together." } },
  { sv: { title: "Palantírens förbannelse", text: "Motståndarna väljer en spelare som måste blunda vid nästa kast." }, en: { title: "Curse of the Palantír", text: "Opponents pick a player who must throw their next shot eyes closed." } },
  { sv: { title: "Nazgûlens skri", text: "Senast träffade spelare håller för ett öga under hela sin nästa tur." }, en: { title: "Cry of the Nazgûl", text: "The last player hit covers one eye for their whole next turn." } },
  { sv: { title: "Mithrilbrynjan", text: "Nästa träffade glas räddas om spelaren klarar flip-the-cup på första försöket." }, en: { title: "Mithril Coat", text: "The next hit cup is saved if its owner flips it on the first try." } },
  { sv: { title: "Domedagsberget skälver", text: "Alla skålar och dricker tillsammans." }, en: { title: "Mount Doom Trembles", text: "Everyone toasts and drinks together." } },
  { sv: { title: "Gandalfs stav", text: "\"Du kommer inte förbi!\" Nästa träff på Barad'dur räknas inte." }, en: { title: "Gandalf's Staff", text: "\"You shall not pass!\" The next hit on Barad'dur doesn't count." } },
  { sv: { title: "Lembas-paus", text: "Den med minst kvar i glaset får fylla på en klunk från någon annans glas." }, en: { title: "Lembas Break", text: "The player with the least left may pour one sip from someone else's cup." } },
  { sv: { title: "Sarumans röst", text: "Nästa spelare måste prata som en trollkarl tills nästa träff. Annars: klunk." }, en: { title: "Voice of Saruman", text: "The next player must talk like a wizard until the next hit. Fail: sip." } },
  { sv: { title: "Ringvålnadernas jakt", text: "Alla onda karaktärer får ett extrakast denna runda." }, en: { title: "Hunt of the Ringwraiths", text: "All evil characters get one extra throw this round." } },
  { sv: { title: "Rohans horn", text: "Alla goda karaktärer får ett extrakast denna runda." }, en: { title: "Horns of Rohan", text: "All good characters get one extra throw this round." } },
  { sv: { title: "Shelobs nät", text: "Nästa kast måste gå med båge — bollen ska nå högre än huvudhöjd." }, en: { title: "Shelob's Web", text: "Next throw must arc higher than head height." } },
  { sv: { title: "Den Ene Ringen", text: "Den som kastar härnäst bestämmer en ny regel som gäller resten av matchen." }, en: { title: "The One Ring", text: "The next thrower invents a rule that lasts the rest of the match." } },
  { sv: { title: "Hobbitfest", text: "Kortaste spelaren delar ut 2 klunkar valfritt." }, en: { title: "Hobbit Feast", text: "The shortest player hands out 2 sips to anyone." } },
  { sv: { title: "Ödets klyfta", text: "Byt plats med spelaren mittemot dig." }, en: { title: "Crack of Doom", text: "Swap seats with the player across from you." } },
  { sv: { title: "Elbereth!", text: "Nästa spelare som träffas får skydd — någon annan valfri dricker istället." }, en: { title: "Elbereth!", text: "The next player hit is protected — they choose someone else to drink." } },
  { sv: { title: "Saruman dränker Isengård", text: "Den som har mest kvar i sin mugg sveper den till botten och fyller på igen." }, en: { title: "Isengard Unleashed", text: "Whoever has the most left in their cup chugs it and refills." } },
  { sv: { title: "Morgul-klingan", text: "Senast utslagna spelare utser en kvarvarande spelare som tar en shot. Har ingen åkt ut tar nästa kastare shoten." }, en: { title: "The Morgul Blade", text: "The last eliminated player picks a remaining player to take a shot. If nobody is out, the next thrower takes it." } },
  { sv: { title: "Domedagsbergets hetta", text: "Nästa kastare väljer: ta en shot och få två kast — eller kasta som vanligt men svep muggen vid miss på bordet." }, en: { title: "Fires of Doom", text: "Next thrower chooses: take a shot for two throws — or throw normally but chug your cup if you miss the table." } },
  { sv: { title: "Gift i Barad'dur", text: "Häll en shot i Barad'dur. Nästa som missar ett kast mot tornet dricker upp det." }, en: { title: "Poisoned Tower", text: "Pour a shot into Barad'dur. The next player to miss a throw at the tower drinks it all." } },
  { sv: { title: "Balrogens piska", text: "\"Fly, era dårar!\" Den som senast missade ett kast tar en shot." }, en: { title: "Whip of the Balrog", text: "\"Fly, you fools!\" Whoever missed the last throw takes a shot." } },
  { sv: { title: "Ringens förbannelse", text: "Den som slagit ut flest hittills tar en shot. Vid lika tar nästa kastare den." }, en: { title: "Curse of the One Ring", text: "Whoever has knocked out the most players takes a shot. On a tie, the next thrower takes it." } },
  { sv: { title: "Svarta porten", text: "En god och en ond spelare kör sten-sax-påse. Förloraren sveper sin mugg." }, en: { title: "The Black Gate", text: "One good and one evil player play rock-paper-scissors. The loser chugs their cup." } },
  { sv: { title: "Stegrande Ponnyn bjuder", text: "Alla runt bordet — även utslagna — tar en shot tillsammans. Skål för Ringbäraren!" }, en: { title: "The Prancing Pony", text: "Everyone at the table — even those out — takes a shot together. To the Ring-bearer!" } },
];
