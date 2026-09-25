/* Parla — 📚 study cards: one per reference-sheet topic, written from the sheets in
   Downloads\italian sheets (with the sheets' errors corrected). Same ids as the exercise sets,
   so every card links to its exercises. Phrase, vocabulary and culture cards are built
   automatically from the exercise data (see js/cards.js).
   points = key rules · tables = [title, [[Italian, English], …]] · watch = common mistakes
   (classic script; shares globals with the other js/ files, load order matters) */
const CARD_TEXT = {
essere_avere_fare: {
  intro: "The three verbs you'll use most: to be, to have and to do / make.",
  points: [
    "Subject pronouns (io, tu, lui…) are usually left out — the verb ending already tells you who: Sono inglese = I'm English.",
    "avere is used where English says 'to be' for age, hunger, thirst, heat and cold: Ho trent'anni, Ho fame, Ho sete, Ho freddo.",
    "fare is used for the weather and many everyday activities: Fa caldo, fare colazione, fare la spesa, fare una passeggiata.",
    "The h in ho, hai, ha, hanno is silent — it only tells ho (I have) apart from o (or).",
  ],
  tables: [
    ["essere — to be", [["io sono", "I am"], ["tu sei", "you are"], ["lui / lei è", "he / she is"], ["noi siamo", "we are"], ["voi siete", "you (all) are"], ["loro sono", "they are"]]],
    ["avere — to have", [["io ho", "I have"], ["tu hai", "you have"], ["lui / lei ha", "he / she has"], ["noi abbiamo", "we have"], ["voi avete", "you (all) have"], ["loro hanno", "they have"]]],
    ["fare — to do / make", [["io faccio", "I do"], ["tu fai", "you do"], ["lui / lei fa", "he / she does"], ["noi facciamo", "we do"], ["voi fate", "you (all) do"], ["loro fanno", "they do"]]],
  ],
  watch: ["è (is) has an accent; e (and) doesn't.", "sono means both 'I am' and 'they are' — context tells you which.", "Sono trent'anni ✗ → Ho trent'anni ✓"],
},
presente_10: {
  intro: "The present tense: what you do, what's happening now, and often the near future.",
  points: [
    "Regular -are verbs (parlare): -o, -i, -a, -iamo, -ate, -ano.",
    "Regular -ere verbs (vivere): -o, -i, -e, -iamo, -ete, -ono.",
    "Regular -ire verbs (dormire): -o, -i, -e, -iamo, -ite, -ono. Some -ire verbs add -isc-: finisco, finisci, finisce, finiamo, finite, finiscono (also capire, preferire, pulire).",
    "The present also covers the near future: Domani vado a Roma = I'm going to Rome tomorrow.",
  ],
  tables: [
    ["parlare — to speak", [["parlo", "I speak"], ["parli", "you speak"], ["parla", "he / she speaks"], ["parliamo", "we speak"], ["parlate", "you (all) speak"], ["parlano", "they speak"]]],
    ["irregular ones on the sheet", [["bevo, bevi, beve, beviamo, bevete, bevono", "bere — to drink"], ["vengo, vieni, viene, veniamo, venite, vengono", "venire — to come"], ["vado, vai, va, andiamo, andate, vanno", "andare — to go"], ["dico, dici, dice, diciamo, dite, dicono", "dire — to say"]]],
  ],
  watch: ["mangiare / cominciare keep one i: tu mangi, noi mangiamo (not mangii).", "-care / -gare verbs add h to keep the hard sound: cerchi, paghi, cerchiamo.", "The loro form isn't stressed on the ending: PAR-la-no, LA-vo-ra-no."],
},
irregolari: {
  intro: "Common verbs that don't follow the regular pattern — worth learning as a set.",
  points: [
    "Many add a g in the io and loro forms: vengo / vengono, tengo / tengono, rimango / rimangono, salgo / salgono, scelgo / scelgono, spengo / spengono.",
    "uscire changes to esc- except in noi and voi: esco, esci, esce, usciamo, uscite, escono.",
    "dare, stare, fare and andare all end in -anno for loro: danno, stanno, fanno, vanno.",
    "dà (gives) has an accent to tell it apart from da (from).",
  ],
  tables: [
    ["io, tu, lui, noi, voi, loro", [
      ["vado, vai, va, andiamo, andate, vanno", "andare — to go"], ["do, dai, dà, diamo, date, danno", "dare — to give"],
      ["faccio, fai, fa, facciamo, fate, fanno", "fare — to make / do"], ["so, sai, sa, sappiamo, sapete, sanno", "sapere — to know"],
      ["sto, stai, sta, stiamo, state, stanno", "stare — to stay / be"], ["bevo, bevi, beve, beviamo, bevete, bevono", "bere — to drink"],
      ["dico, dici, dice, diciamo, dite, dicono", "dire — to say"], ["rimango, rimani, rimane, rimaniamo, rimanete, rimangono", "rimanere — to remain"],
      ["scelgo, scegli, sceglie, scegliamo, scegliete, scelgono", "scegliere — to choose"], ["tengo, tieni, tiene, teniamo, tenete, tengono", "tenere — to hold / keep"],
      ["salgo, sali, sale, saliamo, salite, salgono", "salire — to go up"], ["spengo, spegni, spegne, spegniamo, spegnete, spengono", "spegnere — to switch off"],
      ["esco, esci, esce, usciamo, uscite, escono", "uscire — to go out"], ["vengo, vieni, viene, veniamo, venite, vengono", "venire — to come"],
    ]],
  ],
  watch: ["Io salo ✗ → Io salgo ✓", "Loro uscono ✗ → Loro escono ✓", "sapere = to know a fact (So dov'è); conoscere = to know a person or place (Conosco Marco)."],
},
modali: {
  intro: "potere (can), dovere (must / have to) and volere (want) — always followed by an infinitive.",
  points: [
    "potere = ability or permission: Posso pagare con la carta? = Can I pay by card?",
    "dovere = obligation: Devo partire presto = I have to leave early.",
    "volere = desire: Voglio visitare Roma = I want to visit Rome.",
    "For polite requests use vorrei (I would like), not voglio: Vorrei un caffè, per favore.",
    "No preposition before the infinitive: Devo studiare (not Devo a studiare).",
  ],
  tables: [
    ["potere", [["posso, puoi, può, possiamo, potete, possono", "I can, you can, …"]]],
    ["dovere", [["devo, devi, deve, dobbiamo, dovete, devono", "I must, you must, …"]]],
    ["volere", [["voglio, vuoi, vuole, vogliamo, volete, vogliono", "I want, you want, …"]]],
    ["examples", [["Posso parlare italiano.", "I can speak Italian."], ["Puoi aiutarmi?", "Can you help me?"], ["Dobbiamo partire presto.", "We must leave early."], ["Non devo lavorare oggi.", "I don't have to work today."], ["Vuoi venire con me?", "Do you want to come with me?"], ["Non posso, sono occupato.", "I can't, I'm busy."]]],
  ],
  watch: ["Posso un caffè? ✗ → Vorrei un caffè / Posso avere un caffè? ✓", "Non devo = I don't have to (not 'I mustn't'). 'You mustn't' is Non si può / Non puoi."],
},
andare_venire: {
  intro: "andare = go (away from the speaker); venire = come (towards the speaker or the listener).",
  points: [
    "Use andare to go somewhere else: Vado a scuola, Andiamo al mare.",
    "Use venire to come where the speaker is: Vieni qui! — or where the listener is: Vengo da te = I'm coming to yours.",
    "When you join someone, Italian uses venire: Vuoi venire? – Sì, vengo! (English often says 'I'll go').",
    "Both are irregular — learn the forms.",
  ],
  tables: [
    ["andare", [["Vado a scuola.", "I go to school."], ["Vai al lavoro.", "You go to work."], ["Noi andiamo al mare.", "We go to the seaside."], ["Loro vanno in città.", "They go into town."]]],
    ["venire", [["Vengo da te.", "I'm coming to yours."], ["Vieni qui.", "Come here."], ["Lui viene da noi.", "He's coming to us."], ["Loro vengono qui.", "They come here."]]],
  ],
  watch: ["Vengo a Roma ✗ (unless the listener is in Rome) → Vado a Roma ✓", "Vado qui ✗ → Vengo qui ✓", "Andiamo da te ✗ → Veniamo da te ✓"],
},
essere_stare: {
  intro: "Both can mean 'to be'. essere says what something is; stare says how you are, where you stay, and what's happening right now.",
  points: [
    "essere: identity, nationality, job, description, time: Lui è medico, Sono inglese, È alta.",
    "stare: how you are (Come stai? Sto bene), staying somewhere (Sto a casa stasera).",
    "stare + gerund = happening right now: Sto lavorando. Gerund: -are → -ando, -ere / -ire → -endo (facendo, bevendo, dicendo).",
    "stare per + infinitive = about to: Il treno sta per partire.",
    "Correction to the sheet: 'permanent vs temporary' is only a rule of thumb — essere is used for many temporary states too: Sono stanco, Siete pronti?",
  ],
  tables: [
    ["examples", [["Io sono italiano.", "I am Italian."], ["Tu sei bravo.", "You are good / clever."], ["Come stai?", "How are you?"], ["Lui sta lavorando.", "He is working."], ["Noi stiamo per mangiare.", "We're about to eat."], ["Stavo per chiamarti.", "I was about to call you."]]],
  ],
  watch: ["Sto per a partire ✗ → Sto per partire ✓", "Sono lavorando ✗ → Sto lavorando ✓", "bravo = good / clever (not 'kind' — that's gentile)."],
},
pp_ausiliare: {
  intro: "Passato prossimo = what happened (a completed action): helper verb (avere or essere) + past participle.",
  points: [
    "Participles: -are → -ato (parlato), -ere → -uto (venduto), -ire → -ito (finito).",
    "Common irregular participles: fatto, letto, scritto, preso, visto, aperto, bevuto, detto, messo, chiuso, risposto, perso, vissuto, rimasto, stato, venuto, nato.",
    "Most verbs use avere: Ho mangiato, Abbiamo studiato.",
    "Use essere with verbs of movement, change or state, and with reflexive verbs: andare, venire, arrivare, partire, uscire, entrare, tornare, rimanere, nascere, morire, diventare, svegliarsi.",
    "Quick test: can the verb take a direct object (eat something, see someone)? → avere.",
  ],
  tables: [
    ["with avere", [["Ho mangiato la pizza.", "I ate the pizza."], ["Hai visto quel film?", "Did you see that film?"], ["Abbiamo preso il treno.", "We took the train."], ["Hanno finito il lavoro.", "They finished the work."]]],
    ["with essere", [["Sono andato a Roma.", "I went to Rome."], ["Sei arrivata tardi.", "You arrived late."], ["Siamo usciti con gli amici.", "We went out with friends."], ["Mi sono svegliato alle sette.", "I woke up at seven."]]],
  ],
  watch: ["Ho andato ✗ → Sono andato ✓", "Sono mangiato ✗ → Ho mangiato ✓", "camminare, viaggiare, ballare are movement but take avere: Ho camminato molto."],
},
pp_accordo: {
  intro: "With essere, the past participle agrees with the subject, like an adjective.",
  points: [
    "Endings: -o (male), -a (female), -i (males or a mixed group), -e (females).",
    "Marco è andato · Maria è andata · Marco e Luca sono andati · Maria e Anna sono andate.",
    "A mixed group takes -i: Marco e Maria sono partiti.",
    "With avere the participle normally doesn't change: Maria ha mangiato.",
  ],
  tables: [
    ["examples", [["Maria è arrivata tardi.", "Maria arrived late."], ["I ragazzi sono venuti in treno.", "The boys came by train."], ["Le ragazze sono andate al mare.", "The girls went to the seaside."], ["Lei è nata a Napoli.", "She was born in Naples."]]],
  ],
  watch: ["Maria è arrivato ✗ → Maria è arrivata ✓", "Abbiamo arrivato ✗ → Siamo arrivati ✓", "Maria ha mangiata ✗ → Maria ha mangiato ✓"],
},
imperfetto: {
  intro: "The imperfetto describes the past: habits, things in progress, and background.",
  points: [
    "Endings: -are → -avo, -avi, -ava, -avamo, -avate, -avano; -ere → -evo…; -ire → -ivo…",
    "essere is irregular: ero, eri, era, eravamo, eravate, erano.",
    "Old stems: fare → facevo, dire → dicevo, bere → bevevo.",
    "Use it for habits (Da bambino giocavo a calcio), actions in progress (Mentre studiavo…), descriptions (Era una bella giornata), age, time and weather in the past.",
    "Signal words: da bambino, sempre, spesso, di solito, ogni estate, mentre.",
  ],
  tables: [
    ["examples", [["Vivevo a Roma.", "I used to live in Rome."], ["Studiavo italiano ogni giorno.", "I studied Italian every day."], ["Faceva sempre caldo.", "It was always hot."], ["Avevo un cane quando ero bambino.", "I had a dog when I was a child."], ["Le persone erano molto gentili.", "The people were very kind."], ["Guardavamo la TV la sera.", "We used to watch TV in the evening."]]],
  ],
  watch: ["Farevo ✗ → Facevo ✓", "Da bambino ho giocato sempre ✗ (a habit) → giocavo sempre ✓"],
},
imp_vs_pp: {
  intro: "Two past tenses: imperfetto = background, habit, in progress; passato prossimo = a completed event.",
  points: [
    "Think of a film: the imperfetto is the scenery, the passato prossimo is what happens.",
    "Mentre guardavo la TV (background), Marco è arrivato (event).",
    "One finished action → passato prossimo: Ieri ho mangiato una pizza.",
    "Repeated habit → imperfetto: Da bambino mangiavo sempre la pizza.",
  ],
  tables: [
    ["compare", [["Ieri ho visto Marco.", "Yesterday I saw Marco. (event)"], ["Vedevo Marco ogni giorno.", "I used to see Marco every day. (habit)"], ["Era una bella giornata.", "It was a beautiful day. (description)"], ["Mentre cucinavo, ho ricevuto una chiamata.", "While I was cooking, I got a call."]]],
  ],
  watch: ["Ieri mangiavo una pizza ✗ (if you mean one meal) → Ieri ho mangiato una pizza ✓", "Da bambino ho giocato a calcio ✗ (habit) → giocavo ✓"],
},
mentre_dopo: {
  intro: "Linking words for time — what follows them decides which one you need.",
  points: [
    "mentre + verb = while: Mentre studio, ascolto musica.",
    "durante + noun = during: Durante la lezione, non uso il telefono.",
    "dopo + noun = after: Dopo la cena, guardo un film.",
    "dopo + aver / esser + participle = after doing: Dopo aver mangiato, esco; Dopo essere arrivato, ho chiamato.",
    "dopo che + conjugated verb = after (someone does): Dopo che arriva Marco, iniziamo.",
  ],
  tables: [
    ["examples", [["Mentre mangiavo, è arrivato Marco.", "While I was eating, Marco arrived."], ["Ho dormito durante il viaggio.", "I slept during the journey."], ["Dopo aver studiato, riposo.", "After studying, I rest."], ["Dopo che hai finito, chiamami.", "After you've finished, call me."]]],
  ],
  watch: ["Durante mangio ✗ → Mentre mangio ✓", "Mentre la lezione ✗ → Durante la lezione ✓", "Dopo che mangiare ✗ → Dopo aver mangiato ✓"],
},
futuro_prob: {
  intro: "The future tense — and its handy second use: guessing about the present.",
  points: [
    "Endings: -ò, -ai, -à, -emo, -ete, -anno. -are verbs change a → e: parlare → parlerò.",
    "Irregular stems: sarò, avrò, farò, andrò, verrò, potrò, dovrò, vorrò, berrò, vedrò, vivrò, rimarrò, terrò.",
    "Future of probability: Sarà a casa = he's probably at home; Avrà trent'anni = he must be about 30; Che ore saranno? = what time could it be?",
    "Present = I know; future = I'm guessing: È a casa vs Sarà a casa.",
  ],
  tables: [
    ["avere in six tenses (io)", [["ho", "I have (presente)"], ["avevo", "I had / used to have (imperfetto)"], ["ho avuto", "I had (passato prossimo)"], ["avrò", "I will have (futuro)"], ["avrei", "I would have (condizionale)"], ["che io abbia", "that I have (congiuntivo)"]]],
    ["guessing", [["Dov'è Maria? – Sarà al lavoro.", "Where's Maria? – She's probably at work."], ["Avrà fame.", "He's probably hungry."], ["Saranno stanchi.", "They're probably tired."]]],
  ],
  watch: ["Andarò ✗ → Andrò ✓", "Mangiarò ✗ → Mangerò ✓"],
},
essere_tempi: {
  intro: "essere across the tenses — it's also the helper verb for many past tenses, so it's worth knowing well.",
  points: [
    "The compound tenses of essere use essere + stato, which agrees: sono stato / stata, siamo stati / state.",
    "Passato remoto (fui, fosti, fu…) is mostly for history and literature — recognise it, don't worry about using it.",
  ],
  tables: [
    ["io / noi", [["sono · siamo", "I am · we are"], ["ero · eravamo", "I was · we were (imperfetto)"], ["sono stato · siamo stati", "I have been · we have been"], ["ero stato · eravamo stati", "I had been · we had been"], ["fui · fummo", "I was · we were (passato remoto)"], ["sarò · saremo", "I will be · we will be"], ["sarò stato · saremo stati", "I will have been · we will have been"]]],
  ],
  watch: ["Ho stato ✗ → Sono stato ✓", "A woman says: Sono stata a Roma."],
},
imperativo: {
  intro: "Commands, instructions and suggestions.",
  points: [
    "tu: -are → -a (parla, mangia), -ere / -ire → -i (prendi, dormi).",
    "noi (let's…) and voi are the same as the present: Andiamo! Parlate!",
    "Lei (polite): -are → -i (parli, giri), -ere / -ire → -a (prenda, senta). Irregular: vada, faccia, venga, dica, sia, abbia.",
    "Irregular tu forms: sii (be), abbi (have), va' / vai, fa' / fai, da' / dai, sta' / stai, di'.",
    "Negative tu = non + INFINITIVE: Non parlare! Non dimenticare! (Correction: the sheet says non + subjunctive — that's only for Lei: Non parli.)",
    "Pronouns join the end of tu / noi / voi commands: Dimmi! Fammi vedere. Andiamoci. With Lei they go before: Mi dica.",
  ],
  tables: [
    ["examples", [["Chiudi la porta!", "Close the door!"], ["Studia ogni giorno!", "Study every day!"], ["Non essere in ritardo!", "Don't be late!"], ["Signora, vada sempre dritto.", "Madam, go straight on."], ["Parliamo domani!", "Let's talk tomorrow!"], ["Abbi pazienza!", "Be patient!"]]],
  ],
  watch: ["Non parla! ✗ (to a friend) → Non parlare! ✓", "Studi ogni giorno! ✗ (to a friend) → Studia! ✓ (studi is the Lei form)"],
},
articoli: {
  intro: "'The' has seven forms in Italian — the noun's gender, number and first letter decide which.",
  points: [
    "Masculine: il (il libro), lo before s + consonant, z, ps, gn, x, y (lo studente, lo zaino), l' before a vowel (l'amico).",
    "Masculine plural: i (i libri), gli before s + consonant, z, ps, gn and vowels (gli studenti, gli amici).",
    "Feminine: la (la casa), l' before a vowel (l'acqua); plural le (le case, le amiche).",
    "'A / an': un (un libro, un amico), uno (uno studente, uno zaino), una (una casa), un' (un'amica).",
  ],
  tables: [
    ["singular → plural", [["il libro → i libri", "the book(s)"], ["lo studente → gli studenti", "the student(s)"], ["l'amico → gli amici", "the friend(s)"], ["la casa → le case", "the house(s)"], ["l'amica → le amiche", "the (female) friend(s)"]]],
  ],
  watch: ["la mano → le mani: feminine despite the -o.", "il problema, il programma: masculine despite the -a.", "la città → le città: words ending in an accent don't change.", "un amico (no apostrophe) but un'amica (apostrophe)."],
},
partitivi: {
  intro: "Partitive articles mean 'some / any': di + the definite article.",
  points: [
    "del (di + il), dello (di + lo), della (di + la), dell' (di + l'), dei (di + i), degli (di + gli), delle (di + le).",
    "Use them for an unspecified amount: Vorrei del pane, Ho degli amici a Roma.",
    "un po' di is a common alternative: un po' di formaggio = a bit of cheese.",
    "In negative sentences leave them out: Non ho pane.",
  ],
  tables: [
    ["examples", [["Vorrei del pane.", "I'd like some bread."], ["Metto dello zucchero nel caffè.", "I put some sugar in the coffee."], ["Bevo dell'acqua.", "I drink some water."], ["Mangio delle mele.", "I eat some apples."], ["Leggo dei libri.", "I read some books."], ["Ho degli amici a Roma.", "I have some friends in Rome."]]],
  ],
  watch: ["del pasta ✗ → della pasta ✓", "dei acqua ✗ → dell'acqua ✓", "Correction to the sheet: 'Parlo degli amici' isn't a partitive — it's parlare di + gli = I talk about the friends."],
},
possessivi: {
  intro: "my, your, his, her… — they agree with the thing owned, not the owner.",
  points: [
    "Forms: mio / mia / miei / mie, tuo / tua / tuoi / tue, suo / sua / suoi / sue, nostro…, vostro…, loro (never changes).",
    "Usually with the article: il mio libro, la tua casa, i nostri amici.",
    "No article with a single family member: mia madre, tuo fratello — but la loro madre, i miei fratelli, la mia sorellina.",
    "suo / sua means his, her, or your (polite Lei): la sua borsa = his / her / your bag.",
  ],
  tables: [
    ["examples", [["il mio libro", "my book"], ["la tua casa", "your house"], ["i suoi telefoni", "his / her phones"], ["le nostre case", "our houses"], ["la vostra auto", "your (plural) car"], ["i loro gatti", "their cats"]]],
  ],
  watch: ["il mio amica ✗ → la mia amica ✓", "le suoi borse ✗ → le sue borse ✓", "la mia madre ✗ → mia madre ✓"],
},
ce_ci_vuole: {
  intro: "'There is / are' and 'it takes (time)'.",
  points: [
    "c'è + singular = there is: C'è una farmacia qui vicino?",
    "ci sono + plural = there are: Ci sono molti turisti.",
    "ci vuole + singular = it takes: Ci vuole un'ora.",
    "ci vogliono + plural = it takes: Ci vogliono due ore. The verb agrees with the time, not the person.",
    "Question: Quanto ci vuole? = How long does it take?",
  ],
  tables: [
    ["examples", [["C'è un problema.", "There's a problem."], ["Ci sono tavoli liberi?", "Are there free tables?"], ["Non c'è tempo.", "There isn't time."], ["Ci vuole molta pazienza.", "It takes a lot of patience."], ["Da Bologna a Firenze ci vogliono 35 minuti.", "Bologna to Florence takes 35 minutes."]]],
  ],
  watch: ["C'è due libri ✗ → Ci sono due libri ✓", "Ci vuole due ore ✗ → Ci vogliono due ore ✓"],
},
pron_diretti: {
  intro: "Direct object pronouns replace the thing or person that receives the action: I see HIM, I buy IT.",
  points: [
    "mi (me), ti (you), lo (him / it), la (her / it), ci (us), vi (you all), li (them, m.), le (them, f.).",
    "They go before a conjugated verb: Lo vedo, La compro.",
    "They join the end of an infinitive: Voglio comprarla. With a gerund either way: La sto leggendo / Sto leggendola.",
    "lo / la become l' before ho, hai, ha, hanno — and the participle agrees: L'ho vista (her), Li ho comprati.",
    "Ce l'hai? = Have you got it? (ci + lo, very common).",
  ],
  tables: [
    ["examples", [["Vedo Marco. → Lo vedo.", "I see him."], ["Compro la pizza. → La compro.", "I buy it."], ["Vedo i ragazzi. → Li vedo.", "I see them."], ["Cerco le chiavi. → Le cerco.", "I'm looking for them."], ["Voglio comprarla.", "I want to buy it."]]],
  ],
  watch: ["Vedo lo ✗ → Lo vedo ✓", "Corrections to the sheets: 'We see our friends' = Li vediamo (Ci vediamo = see you!); 'I invite my friends' = Li invito (Vi invito = I invite YOU); 'Io mi chiamo Luca' and 'Noi vi vediamo' are correct, not mistakes."],
},
pron_indiretti: {
  intro: "Indirect object pronouns replace 'to / for someone' (a + person).",
  points: [
    "mi (to me), ti (to you), gli (to him), le (to her), Le (to you, polite), ci (to us), vi (to you all), gli (to them).",
    "Verbs that take a + person use them: parlare a, telefonare a, dare a, scrivere a, dire a, mandare a.",
    "gli = to him AND to them (any gender) in everyday Italian. Formal 'to them' is loro AFTER the verb: Mando loro un invito.",
    "piacere works this way: Mi piace = it pleases me (I like it); Gli piace il vino = he likes wine.",
  ],
  tables: [
    ["examples", [["Parlo a Marco. → Gli parlo.", "I talk to him."], ["Scrivo a Maria. → Le scrivo.", "I write to her."], ["Ti mando un messaggio.", "I'll send you a message."], ["Telefono ai ragazzi. → Gli telefono.", "I phone them."], ["Mi piace la pizza.", "I like pizza."]]],
  ],
  watch: ["Lo parlo ✗ → Gli parlo ✓ (parlare a → indirect)", "Correction to the sheet: 'Loro mando un invito' ✗ → Gli mando / Mando loro un invito ✓", "Correction: 'Ci pensa mio padre' means 'my father will see to it', not 'thinks about us'."],
},
ne_ci: {
  intro: "Two little pronouns: ne = of it / of them / about it; ci = there / about it (after a).",
  points: [
    "ne replaces di + something, and is needed with numbers and amounts: Quante mele vuoi? – Ne voglio due.",
    "ne for 'about': Parli di Marco? – Sì, ne parlo spesso.",
    "ci replaces a place (there): Vai a Roma? – Sì, ci vado domani.",
    "ci replaces a + thing with verbs like pensare a, credere a: Pensi al problema? – Sì, ci penso.",
    "Memory trick: di → ne, a → ci.",
  ],
  tables: [
    ["examples", [["Quanti libri hai? – Ne ho tre.", "I have three (of them)."], ["Vuoi del pane? – Sì, ne voglio un po'.", "Yes, I want a bit."], ["Sei stato a Milano? – Sì, ci sono stato.", "Yes, I've been there."], ["Ci penso io.", "I'll take care of it."]]],
  ],
  watch: ["Vado a Roma. – Ne vado ✗ → Ci vado ✓", "Parlo di Maria. – Ci parlo ✗ → Ne parlo ✓", "Ho tre ✗ (answering 'how many?') → Ne ho tre ✓"],
},
prep_semplici: {
  intro: "The basic prepositions: di, a, da, in, con, su, per, tra / fra.",
  points: [
    "di = of, about, from (origin with essere): il libro di Marco, Parliamo di politica, Sono di Londra.",
    "a = to / at (cities, many places): Vado a Roma, Sono a casa.",
    "da = from; at / to someone's place: Vengo da Milano, Vado dal dentista.",
    "in = in / to (countries, regions, transport): Vivo in Italia, Vado in macchina.",
    "con = with, su = on / about, per = for / in order to, tra / fra = between / in (time): Parto tra due ore.",
    "Correction to the sheet: possession uses di — Questo libro è di Maria (not da).",
  ],
  tables: [
    ["examples", [["Esco con Marta.", "I'm going out with Marta."], ["Il libro è sul tavolo.", "The book is on the table."], ["Questo regalo è per te.", "This present is for you."], ["Studio per imparare.", "I study in order to learn."], ["Tra Roma e Firenze.", "Between Rome and Florence."], ["Cammino verso la stazione.", "I walk towards the station."]]],
  ],
  watch: ["Questo libro è da Maria ✗ → di Maria ✓", "Sono in Roma ✗ → Sono a Roma ✓", "Vado a Italia ✗ → Vado in Italia ✓"],
},
andare_a_in_da: {
  intro: "Three ways to say 'go to': andare a, andare in, andare da.",
  points: [
    "a → cities and towns, and fixed places: a Roma, a casa, a scuola, a letto, a lavorare.",
    "a + article → most other places: al supermercato, al cinema, alla stazione.",
    "in → countries, regions, rooms and some shops / places, and transport: in Italia, in Toscana, in ufficio, in banca, in macchina, in autobus.",
    "da → people and professionals: da Marco, da mia madre, dal medico, dal parrucchiere.",
  ],
  tables: [
    ["examples", [["Vado a Roma.", "I'm going to Rome."], ["Vado in Italia.", "I'm going to Italy."], ["Vado da Luca.", "I'm going to Luca's."], ["Vado al supermercato.", "I'm going to the supermarket."], ["Vado in banca.", "I'm going to the bank."], ["Vado dal dentista.", "I'm going to the dentist's."]]],
  ],
  watch: ["Vado in Roma ✗ → a Roma ✓", "Vado al Marco ✗ → da Marco ✓", "Vado a Francia ✗ → in Francia ✓"],
},
prep_articolate: {
  intro: "a, di, da, in, su join with the article that follows: a + il = al.",
  points: [
    "a: al, allo, alla, all', ai, agli, alle.",
    "di: del, dello, della, dell', dei, degli, delle.",
    "da: dal, dallo, dalla, dall', dai, dagli, dalle.",
    "in: nel, nello, nella, nell', nei, negli, nelle.",
    "su: sul, sullo, sulla, sull', sui, sugli, sulle.",
    "con and per don't usually join (con il, per la); col is optional.",
  ],
  tables: [
    ["examples", [["Vado al museo.", "I'm going to the museum."], ["Vado alla stazione.", "I'm going to the station."], ["Bevo del caffè.", "I drink (some) coffee."], ["Sono nel centro storico.", "I'm in the old town."], ["Il gatto è sul tavolo.", "The cat is on the table."], ["Veniamo dal medico.", "We're coming from the doctor's."]]],
  ],
  watch: ["a il ✗ → al ✓; in la ✗ → nella ✓", "Fixed expressions have no article: in centro, in ufficio, a casa, a scuola."],
},
avverbi_tempo: {
  intro: "Words that say WHEN — plus the time expressions used with the past.",
  points: [
    "adesso / ora (now), oggi (today), domani (tomorrow), ieri (yesterday), l'altro ieri (the day before yesterday).",
    "dopo (after / later), prima (before), subito (straight away), presto (soon / early), tardi (late).",
    "sempre (always), spesso (often), mai (never — with non: Non sono mai stato…), ancora (still / yet), finalmente (finally).",
    "Past time: la settimana scorsa, il mese scorso, l'anno scorso, due giorni fa (ago), di recente.",
    "Correction to the sheet: anteprima means 'preview' — the day before yesterday is l'altro ieri.",
  ],
  tables: [
    ["examples", [["Adesso studio.", "Now I'm studying."], ["Torno subito.", "I'll be right back."], ["Ti richiamo presto.", "I'll call you back soon."], ["Non sono mai stato a Parigi.", "I've never been to Paris."], ["Non ho ancora finito.", "I haven't finished yet."], ["Due giorni fa ho visto Marco.", "Two days ago I saw Marco."]]],
  ],
  watch: ["Sono mai stato ✗ → Non sono mai stato ✓ (mai needs non before the verb)", "fa goes after the time: due giorni fa (not fa due giorni)."],
},
};
