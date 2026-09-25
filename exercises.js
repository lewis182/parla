/* ----------------------------------------------------------------------------
   Parla — exercise bank, built from Lewis's grammar & vocabulary reference sheets
   (Downloads\italian sheets). Each set names the sheet(s) it comes from.

   Item helpers:
     G(q, answers, hint, en, explain)   fill the gap (typed). "___" marks the gap.
     M(q, options, en, explain, say)    multiple choice — FIRST option is correct
                                        (options are shuffled on screen).
     T(english, answers, explain)       translate into Italian (typed).
   Vocab sets list [italian, english] pairs; questions are generated from them.
   "topic" links a set to the matching Giulia conversation in the topic menu.
---------------------------------------------------------------------------- */
const G = (q, a, h, en, x) => ({ t: "gap", q, a: [].concat(a), h, en, x });
const M = (q, o, en, x, s) => ({ t: "mc", q, o, en, x, s });
const T = (en, a, x) => ({ t: "tr", q: en, a: [].concat(a), x });

const EX_SETS = [
/* =========================== VERBS — PRESENT =========================== */
{ id: "essere_avere_fare", group: "Verbs · present tense", level: "A1", topic: "g_presente",
  title: "Essere, avere & fare", sheet: "Essere Fare Avere · Sono Faccio verbs",
  items: [
  G("Io ___ inglese.", "sono", "essere", "I am English."),
  G("Tu ___ molto gentile.", "sei", "essere", "You are very kind."),
  G("Marco ___ a casa.", "è", "essere", "Marco is at home."),
  G("Noi ___ amici.", "siamo", "essere", "We are friends."),
  G("Voi ___ stanchi?", "siete", "essere", "Are you (all) tired?"),
  G("Loro ___ di Bologna.", "sono", "essere", "They are from Bologna."),
  G("Io ___ due fratelli.", "ho", "avere", "I have two brothers."),
  G("Tu ___ fame?", "hai", "avere", "Are you hungry? (lit. do you have hunger?)"),
  G("Lei ___ una macchina rossa.", "ha", "avere", "She has a red car."),
  G("Noi ___ una domanda.", "abbiamo", "avere", "We have a question."),
  G("Voi ___ tempo stasera?", "avete", "avere", "Do you (all) have time this evening?"),
  G("Loro ___ un cane.", "hanno", "avere", "They have a dog."),
  G("Io ___ colazione alle otto.", "faccio", "fare", "I have breakfast at eight."),
  G("Cosa ___ stasera?", "fai", "fare · tu", "What are you doing this evening?"),
  G("Noi ___ una passeggiata.", "facciamo", "fare", "We're going for a walk."),
  G("Voi ___ la spesa oggi?", "fate", "fare", "Are you (all) doing the food shopping today?"),
  G("Loro ___ i compiti.", "fanno", "fare", "They do their homework."),
]},
{ id: "presente_10", group: "Verbs · present tense", level: "A1", topic: "g_presente",
  title: "Present tense — 10 key verbs", sheet: "Present tense (10 Italian verbs)",
  items: [
  G("Io ___ italiano ogni giorno.", "parlo", "parlare", "I speak Italian every day."),
  G("Tu ___ la pizza?", "mangi", "mangiare", "Are you eating the pizza?", "mangiare keeps one i: tu mangi (not mangii)."),
  G("Lei ___ a Londra.", "vive", "vivere", "She lives in London."),
  G("Noi ___ un caffè.", "beviamo", "bere", "We're having (drinking) a coffee.", "bere works from the old stem 'bev-': bevo, bevi, beve, beviamo, bevete, bevono."),
  G("Voi ___ alla festa?", "venite", "venire", "Are you (all) coming to the party?"),
  G("Loro ___ in ufficio.", "lavorano", "lavorare", "They work in the office."),
  G("Io ___ a scuola in autobus.", "vado", "andare", "I go to school by bus."),
  G("Voi ___ al cinema stasera?", "andate", "andare", "Are you (all) going to the cinema tonight?"),
  G("Loro ___ troppo vino.", "bevono", "bere", "They drink too much wine."),
  G("Tu ___ sempre la verità.", "dici", "dire", "You always tell the truth."),
  G("Noi ___ in centro.", "viviamo", "vivere", "We live in the centre."),
  G("Io ___ da Milano.", "vengo", "venire", "I come from Milan."),
  G("Loro ___ inglese molto bene.", "parlano", "parlare", "They speak English very well."),
  G("Lui ___ fino alle sei.", "lavora", "lavorare", "He works until six."),
  G("Noi ___ la verità.", "diciamo", "dire", "We tell the truth."),
]},
{ id: "irregolari", group: "Verbs · present tense", level: "A1–A2", topic: "g_presente",
  title: "Irregular verbs", sheet: "Verbi Irregolari Italiani",
  items: [
  G("Io non ___ la risposta.", "so", "sapere", "I don't know the answer."),
  G("Loro ___ un regalo a Maria.", "danno", "dare", "They give Maria a present."),
  G("Come ___?", "stai", "stare · tu", "How are you?"),
  G("Noi ___ a casa stasera.", "rimaniamo", "rimanere", "We're staying at home tonight."),
  G("Io ___ il vestito blu.", "scelgo", "scegliere", "I choose the blue dress."),
  G("Lei ___ la borsa in mano.", "tiene", "tenere", "She is holding the bag in her hand."),
  G("Io ___ le scale.", "salgo", "salire", "I go up the stairs."),
  G("___ la luce, per favore?", "spegni", "spegnere · tu", "Will you turn off the light, please?"),
  G("Stasera noi ___ con gli amici.", "usciamo", "uscire", "Tonight we're going out with friends."),
  G("Loro ___ alle nove.", "escono", "uscire", "They go out at nine.", "uscire changes stem: esco, esci, esce, usciamo, uscite, escono."),
  G("Voi ___ dov'è la stazione?", "sapete", "sapere", "Do you (all) know where the station is?"),
  G("Loro ___ bene.", "stanno", "stare", "They are well."),
  G("Voi ___ sempre la stessa cosa!", "dite", "dire", "You (all) always say the same thing!"),
  G("___ con noi?", "vieni", "venire · tu", "Are you coming with us?"),
  G("Io ___ la macchina in garage.", "tengo", "tenere", "I keep the car in the garage."),
  M("Which is the 'io' form of salire?", ["salgo", "salo", "salisco"], "I go up", "Like tenere → tengo and rimanere → rimango, salire adds a g: salgo, salgono."),
]},
{ id: "modali", group: "Verbs · present tense", level: "A1", topic: "g_modali",
  title: "Potere, dovere, volere", sheet: "Potere vs Dovere vs Volere",
  items: [
  G("Io ___ parlare italiano.", "posso", "potere", "I can speak Italian."),
  G("___ aiutarmi?", "puoi", "potere · tu", "Can you help me?"),
  G("Noi ___ partire presto.", "dobbiamo", "dovere", "We must leave early."),
  G("Tu ___ essere puntuale.", "devi", "dovere", "You have to be on time."),
  G("Io ___ un caffè.", "voglio", "volere", "I want a coffee."),
  G("___ venire con me?", "vuoi", "volere · tu", "Do you want to come with me?"),
  G("Voi ___ rispettare le regole.", "dovete", "dovere", "You (all) have to respect the rules."),
  G("Loro ___ visitare Roma.", "vogliono", "volere", "They want to visit Rome."),
  G("Voi ___ venire domani?", "potete", "potere", "Can you (all) come tomorrow?"),
  G("Lei non ___ lavorare oggi.", "deve", "dovere", "She doesn't have to work today."),
  G("Loro non ___ venire, sono occupati.", "possono", "potere", "They can't come, they're busy."),
  M("“I can't, I'm busy.”", ["Non posso, sono occupato.", "Non devo, sono occupato.", "Non voglio, sono occupato."], null, "potere = can / be able to.", "Non posso, sono occupato."),
  M("Polite: “I'd like a coffee, please.”", ["Vorrei un caffè, per favore.", "Voglio un caffè, per favore.", "Posso un caffè, per favore."], null, "vorrei (conditional) is the polite form; voglio can sound blunt when ordering.", "Vorrei un caffè, per favore."),
  M("Devo ___ .", ["studiare", "studio", "studiato"], "I must study.", "All three modal verbs are followed by an infinitive."),
]},
{ id: "andare_venire", group: "Verbs · present tense", level: "A1", topic: "indicazioni",
  title: "Andare vs venire", sheet: "Andare vs Venire",
  items: [
  M("___ a scuola.", ["Vado", "Vengo"], "I go to school.", "andare = moving away from the speaker to a place."),
  M("___ qui!", ["Vieni", "Vai"], "Come here!", "venire = moving towards the speaker."),
  M("Stasera ___ da te.", ["vengo", "vado"], "I'm coming to yours tonight.", "Going to the person you're talking to uses venire: vengo da te."),
  M("Noi ___ al mare.", ["andiamo", "veniamo"], "We go to the sea."),
  M("Loro ___ in città.", ["vanno", "vengono"], "They go into town."),
  M("Lui ___ da noi domani.", ["viene", "va"], "He's coming to us tomorrow."),
  M("Vuoi venire con me? – Sì, ___!", ["vengo", "vado"], "Do you want to come with me? – Yes, I'm coming!", "When you join the speaker, Italian uses venire — where English might say 'I'll go with you'."),
  M("___ a Roma.", ["Vado", "Vengo"], "I'm going to Rome.", "Sheet's common mistake: Vengo a Roma ✗ → Vado a Roma ✓ (unless the listener is in Rome)."),
  G("Voi ___ alla festa di Marco?", "andate", "andare", "Are you (all) going to Marco's party?"),
  G("Da dove ___?", "vieni", "venire · tu", "Where do you come from?"),
  G("Loro ___ qui ogni estate.", "vengono", "venire", "They come here every summer."),
]},
{ id: "essere_stare", group: "Verbs · present tense", level: "A1–A2", topic: "g_presente",
  title: "Essere vs stare · stare per", sheet: "Essere vs Stare · Stare per + infinitive",
  items: [
  M("Come ___?", ["stai", "sei"], "How are you?", "Health / how you are → stare."),
  M("Lui ___ medico.", ["è", "sta"], "He is a doctor.", "Profession / identity → essere."),
  M("Lei ___ lavorando.", ["sta", "è"], "She is working.", "stare + gerund (-ando / -endo) = something happening right now."),
  M("Noi ___ studiando.", ["stiamo", "siamo"], "We are studying."),
  M("Loro ___ stanchi.", ["sono", "stanno"], "They are tired.", "Note: the sheet's 'permanent vs temporary' rule is only a rule of thumb — essere is used for many temporary states too (stanco, contento, pronto)."),
  M("Voi ___ pronti?", ["siete", "state"], "Are you (all) ready?"),
  M("Io ___ a casa stasera.", ["sto", "vado"], "I'm staying at home this evening.", "stare a casa = to stay at home."),
  G("Il treno ___ per partire.", "sta", "stare", "The train is about to leave.", "stare per + infinitive = to be about to do something."),
  G("Io ___ per uscire.", "sto", "stare", "I'm about to go out."),
  G("Stiamo per ___ .", "mangiare", "mangiare", "We're about to eat.", "After per use the infinitive directly — no 'a'."),
  G("Attento! Sta per ___!", "cadere", "cadere", "Careful! It's about to fall!"),
  G("Ieri ___ per chiamarti.", "stavo", "stare · imperfetto", "Yesterday I was about to call you."),
  M("“I'm about to leave.”", ["Sto per partire.", "Sto per a partire.", "Vado a partire."], null, "Sheet: 'Vado a partire' isn't the natural way; use stare per + infinitive.", "Sto per partire."),
]},
/* ============================== VERBS — PAST ============================== */
{ id: "pp_ausiliare", group: "Verbs · past tenses", level: "A2", topic: "g_passato",
  title: "Passato prossimo — avere or essere?", sheet: "Avere vs Essere · Passato Prossimo · Past tense",
  items: [
  M("___ mangiato la pizza.", ["Ho", "Sono"], "I ate the pizza.", "Most verbs → avere."),
  M("___ andato a Roma.", ["Sono", "Ho"], "I went to Rome.", "Movement verbs (andare, venire, arrivare, partire…) → essere."),
  M("Maria ___ arrivata tardi.", ["è", "ha"], "Maria arrived late."),
  M("Noi ___ studiato italiano.", ["abbiamo", "siamo"], "We studied Italian."),
  M("Loro ___ usciti con gli amici.", ["sono", "hanno"], "They went out with friends."),
  M("Tu ___ visto quel film?", ["hai", "sei"], "Did you see that film?"),
  M("Io ___ rimasto a casa.", ["sono", "ho"], "I stayed at home."),
  M("Voi ___ fatto i compiti?", ["avete", "siete"], "Have you (all) done your homework?"),
  M("Lei ___ nata nel 2000.", ["è", "ha"], "She was born in 2000.", "nascere, morire, diventare (change of state) → essere."),
  M("Io ___ bevuto l'acqua.", ["ho", "sono"], "I drank the water."),
  G("Ho ___ un libro.", "letto", "leggere", "I read a book.", "Irregular participle: leggere → letto."),
  G("Hai ___ un'email?", "scritto", "scrivere", "Did you write an email?"),
  G("Abbiamo ___ il treno.", "preso", "prendere", "We took the train."),
  G("Hanno ___ il lavoro.", "finito", "finire", "They finished the work."),
  G("Ho ___ la finestra.", "aperto", "aprire", "I opened the window."),
  G("Avete ___ i compiti?", "fatto", "fare", "Have you done the homework?"),
  G("Ho ___ Marco ieri.", "visto", "vedere", "I saw Marco yesterday."),
  G("Hai ___ tutto?", "capito", "capire", "Did you understand everything?"),
  G("Abbiamo ___ troppo.", "bevuto", "bere", "We drank too much."),
]},
{ id: "pp_accordo", group: "Verbs · past tenses", level: "A2", topic: "g_passato",
  title: "Passato prossimo — agreement with essere", sheet: "Passato Prossimo: Essere or Avere?",
  items: [
  G("Maria è ___ a Roma.", "andata", "andare", "Maria went to Rome.", "With essere the participle agrees with the subject: -o / -a / -i / -e."),
  G("Marco e Luca sono ___ tardi.", "arrivati", "arrivare", "Marco and Luca arrived late."),
  G("Maria e Anna sono ___ ieri.", "partite", "partire", "Maria and Anna left yesterday.", "Two females → -e."),
  G("Mia madre è ___ a casa.", "rimasta", "rimanere", "My mother stayed at home."),
  G("Noi siamo ___ dal cinema.", "usciti", "uscire · mixed group", "We came out of the cinema.", "A mixed group takes the masculine plural -i."),
  G("Lei è ___ a Napoli.", "nata", "nascere", "She was born in Naples."),
  G("I ragazzi sono ___ in treno.", "venuti", "venire", "The boys came by train."),
  G("Le ragazze sono ___ al mare.", "andate", "andare", "The girls went to the seaside."),
  M("Which is correct?", ["Maria è arrivata.", "Maria è arrivato.", "Maria ha arrivata."], "Maria arrived.", null, "Maria è arrivata."),
  M("Which is correct?", ["Siamo arrivati tardi.", "Abbiamo arrivato tardi.", "Siamo arrivato tardi."], "We arrived late.", null, "Siamo arrivati tardi."),
  M("Maria: “Ho ___ la pizza.”", ["mangiato", "mangiata"], "Maria: I ate the pizza.", "With avere the participle normally stays in -o, whoever the subject is."),
  T("I went to Rome. (female speaking)", ["Sono andata a Roma."]),
  T("We left on Monday. (two men)", ["Siamo partiti lunedì.", "Lunedì siamo partiti."]),
]},
{ id: "imperfetto", group: "Verbs · past tenses", level: "A2", topic: "g_passato",
  title: "Imperfetto — forms", sheet: "Imperfetto Made Simple · Essere",
  items: [
  G("Da bambino ___ a calcio.", "giocavo", "giocare · io", "As a child I used to play football."),
  G("Mentre ___, ascoltavo musica.", "studiavo", "studiare · io", "While I was studying, I was listening to music."),
  G("La casa ___ grande e bella.", "era", "essere", "The house was big and beautiful."),
  G("Prima noi ___ in campagna.", "vivevamo", "vivere", "We used to live in the countryside."),
  G("Voi ___ la TV la sera?", "guardavate", "guardare", "Did you (all) use to watch TV in the evening?"),
  G("Le persone ___ molto gentili.", "erano", "essere", "The people were very kind."),
  G("Io ___ un cane quando ero bambino.", "avevo", "avere", "I had a dog when I was a child."),
  G("___ sempre caldo.", "faceva", "fare", "It was always hot.", "fare → facevo, facevi, faceva… (from the old stem 'fac-')."),
  G("Tu ___ sempre la verità.", "dicevi", "dire", "You always used to tell the truth.", "dire → dicevo, dicevi, diceva…"),
  G("Noi ___ spesso i nonni.", "vedevamo", "vedere", "We often used to see our grandparents."),
  G("Loro ___ al mare ogni estate.", "andavano", "andare", "They used to go to the seaside every summer."),
  G("Io non ___ la risposta.", "capivo", "capire", "I didn't understand the answer."),
  G("Voi ___ stanchi.", "eravate", "essere", "You (all) were tired."),
  G("Noi ___ molta fame.", "avevamo", "avere", "We were very hungry."),
  G("Loro ___ vino rosso.", "bevevano", "bere", "They used to drink red wine."),
]},
{ id: "imp_vs_pp", group: "Verbs · past tenses", level: "A2", topic: "g_passato",
  title: "Imperfetto vs passato prossimo", sheet: "Imperfetto vs Passato Prossimo",
  items: [
  M("Ieri ___ una pizza.", ["ho mangiato", "mangiavo"], "Yesterday I ate a pizza.", "One completed action → passato prossimo."),
  M("Da bambino ___ sempre a calcio.", ["giocavo", "ho giocato"], "As a child I always played football.", "Repeated habit → imperfetto."),
  M("Mentre guardavo la TV, Marco ___ .", ["è arrivato", "arrivava"], "While I was watching TV, Marco arrived.", "Background (imperfetto) interrupted by an event (passato prossimo)."),
  M("___ una bella giornata.", ["Era", "È stata"], "It was a beautiful day.", "Description / setting the scene → imperfetto."),
  M("Ieri ___ Marco in centro.", ["ho visto", "vedevo"], "Yesterday I saw Marco in the centre."),
  M("Quando ero piccolo, ___ in campagna.", ["vivevo", "ho vissuto"], "When I was little, I lived in the countryside."),
  M("Mentre ___, ho ricevuto una chiamata.", ["cucinavo", "ho cucinato"], "While I was cooking, I got a call."),
  M("Sabato scorso ___ al cinema.", ["sono andato", "andavo"], "Last Saturday I went to the cinema."),
  M("La casa ___ grande e luminosa.", ["era", "è stata"], "The house was big and bright."),
  M("Stamattina ___ alle sette.", ["mi sono svegliato", "mi svegliavo"], "This morning I woke up at seven.", "Reflexive verbs use essere in the passato prossimo."),
  M("Da piccolo ___ ogni estate al mare.", ["andavo", "sono andato"], "When I was small I went to the seaside every summer."),
]},
{ id: "mentre_dopo", group: "Verbs · past tenses", level: "A2", topic: "g_passato",
  title: "Mentre / durante · dopo / dopo che", sheet: "Mentre vs Durante · Dopo vs Dopo Che",
  items: [
  M("___ studio, ascolto musica.", ["Mentre", "Durante"], "While I study, I listen to music.", "mentre + verb."),
  M("___ la lezione, non uso il telefono.", ["Durante", "Mentre"], "During the lesson, I don't use my phone.", "durante + noun."),
  M("Ho dormito ___ il viaggio.", ["durante", "mentre"], "I slept during the journey."),
  M("___ mangiavo, è arrivato Marco.", ["Mentre", "Durante"], "While I was eating, Marco arrived."),
  M("___ la notte ha piovuto.", ["Durante", "Mentre"], "During the night it rained."),
  M("Lei parla ___ guida.", ["mentre", "durante"], "She talks while driving."),
  M("___ la cena, guardo un film.", ["Dopo", "Dopo che"], "After dinner, I watch a film.", "dopo + noun."),
  M("___ aver mangiato, esco.", ["Dopo", "Dopo che"], "After eating, I go out.", "dopo + (aver / esser) + participle."),
  M("___ arriva Marco, iniziamo.", ["Dopo che", "Dopo"], "After Marco arrives, we'll start.", "dopo che + conjugated verb."),
  M("___ hai finito, chiamami.", ["Dopo che", "Dopo"], "After you've finished, call me."),
  G("Dopo aver ___, riposo.", "studiato", "studiare", "After studying, I rest."),
  M("“After eating, I go out.”", ["Dopo aver mangiato, esco.", "Dopo che mangiare, esco.", "Dopo mangio, esco."], null, "Sheet's common mistakes: 'Dopo che mangiare' ✗ and 'Dopo mangio' ✗.", "Dopo aver mangiato, esco."),
]},
/* ========================= VERBS — OTHER TENSES ========================= */
{ id: "futuro_prob", group: "Verbs · future, imperative & more", level: "A2", topic: "g_futuro",
  title: "Futuro — guessing & avere tenses", sheet: "Futuro for guessing · Avere (to have)",
  items: [
  M("Dov'è Maria? – ___ al lavoro.", ["Sarà", "È"], "Where's Maria? – She's probably at work.", "Future used to guess about the present."),
  G("Quanti anni ha Luca? – ___ venticinque anni.", "avrà", "avere · guess", "How old is Luca? – He's probably 25."),
  G("Che ore ___?", "saranno", "essere · guess", "What time could it be?", "Time is plural in Italian (sono le tre) → saranno."),
  G("Non rispondono: ___ già a letto.", "saranno", "essere · guess", "They're not answering: they're probably already in bed."),
  G("___ fame, poverino!", "avrà", "avere · guess", "He's probably hungry, poor thing!"),
  M("Which means “Marco is probably at home”?", ["Marco sarà a casa.", "Marco è a casa.", "Marco era a casa."], null, "Present = I know. Future = I'm guessing.", "Marco sarà a casa."),
  G("Domani ___ più tempo.", "avrò", "avere · futuro", "Tomorrow I'll have more time."),
  G("___ un gatto da piccolo.", "avevo", "avere · imperfetto", "I had a cat when I was little."),
  G("Noi ___ bisogno di una mano.", "avremmo", "avere · condizionale", "We would need a hand.", "Conditional of avere: avrei, avresti, avrebbe, avremmo, avreste, avrebbero."),
  G("Loro ___ avuto un problema.", "hanno", "avere · passato prossimo", "They've had a problem."),
  G("Tu ___ ragione, forse.", "avrai", "avere · futuro", "You're probably right."),
  G("Spero che tu ___ pazienza.", "abbia", "avere · congiuntivo", "I hope you have patience.", "Present subjunctive of avere: abbia, abbia, abbia, abbiamo, abbiate, abbiano."),
]},
{ id: "essere_tempi", group: "Verbs · future, imperative & more", level: "A2", topic: "g_passato",
  title: "Essere through the tenses", sheet: "Verbo Essere — Indicativo",
  items: [
  G("Ieri io ___ a casa tutto il giorno.", "sono stata", "essere · passato prossimo · female", "Yesterday I was at home all day."),
  G("Da bambino ___ molto timido.", "ero", "essere · imperfetto", "As a child I was very shy."),
  G("Domani ___ a Roma.", "saremo", "essere · futuro · noi", "Tomorrow we'll be in Rome."),
  G("Voi ___ mai stati in Italia?", "siete", "essere", "Have you (all) ever been to Italy?"),
  G("Loro ___ felici.", "erano", "essere · imperfetto", "They were happy."),
  G("Tu ___ a Firenze l'anno prossimo?", "sarai", "essere · futuro", "Will you be in Florence next year?"),
  G("Dante ___ un grande poeta.", "fu", "essere · passato remoto", "Dante was a great poet.", "The passato remoto is mostly for history and books."),
  M("noi · imperfetto", ["eravamo", "eravate", "erano"], "we were"),
  G("Quando sono arrivato, loro ___ già partiti.", "erano", "essere · trapassato prossimo", "When I arrived, they had already left."),
  G("Io ___ stanco oggi.", "sono", "essere · presente", "I'm tired today."),
]},
{ id: "imperativo", group: "Verbs · future, imperative & more", level: "A1–A2", topic: "g_imperativo",
  title: "Imperative", sheet: "Italian Imperative Made Simple",
  items: [
  G("___ la porta!", "chiudi", "chiudere · tu", "Close the door!"),
  G("___ attenzione!", ["fai", "fa'"], "fare · tu", "Be careful! (lit. pay attention)"),
  G("___ ogni giorno!", "studia", "studiare · tu", "Study every day!", "tu imperative of -are verbs ends in -a (parla, mangia, studia) — not the present-tense 'studi'."),
  G("___ qui!", "vieni", "venire · tu", "Come here!"),
  G("Non ___!", "parlare", "parlare · negative tu", "Don't speak!", "Correction to the sheet: a negative command to 'tu' is non + INFINITIVE (non parlare, non mangiare). non + subjunctive is only for Lei (non parli)."),
  G("Non ___ in ritardo!", "essere", "essere · negative tu", "Don't be late!"),
  G("Non ___!", "dimenticare", "dimenticare · negative tu", "Don't forget!"),
  G("___ più verdura!", "mangia", "mangiare · tu", "Eat more vegetables!"),
  G("Signora, ___ sempre dritto.", "vada", "andare · Lei", "Madam, go straight on.", "Polite (Lei) form: -are → -i, -ere/-ire → -a; irregular vada, faccia, venga."),
  G("Signore, ___ pure!", "entri", "entrare · Lei", "Sir, do come in!"),
  G("___ domani!", "parliamo", "parlare · noi", "Let's talk tomorrow!"),
  G("___ al cinema!", "andiamo", "andare · noi", "Let's go to the cinema!"),
  M("To a friend: “Don't open the door!”", ["Non aprire la porta!", "Non apri la porta!", "Non apra la porta!"], null, "'Non apra' is the polite Lei form.", "Non aprire la porta!"),
  G("___ pazienza!", "abbi", "avere · tu", "Be patient! (lit. have patience)"),
  G("___ buono!", "sii", "essere · tu", "Be good!"),
  G("___ la verità!", ["di'", "di"], "dire · tu", "Tell the truth!"),
]},
/* ======================== ARTICLES & ADJECTIVES ======================== */
{ id: "articoli", group: "Articles, possessives & ‘there is’", level: "A1", topic: "g_articoli",
  title: "Definite articles — il, lo, la, i, gli, le", sheet: "Italian Articles",
  items: [
  M("___ libro", ["il", "lo", "la"], "the book"),
  M("___ studente", ["lo", "il", "la"], "the student", "lo before s + consonant, z, ps, gn, x, y."),
  M("___ casa", ["la", "il", "lo"], "the house"),
  M("___ zaino", ["lo", "il", "l'"], "the backpack"),
  M("___ psicologo", ["lo", "il", "l'"], "the psychologist"),
  M("___ amico", ["l'", "il", "lo"], "the friend", "Before a vowel: l'."),
  M("___ città", ["la", "il", "le"], "the city", "città is feminine; it doesn't change in the plural (le città)."),
  M("___ ragazzi", ["i", "gli", "le"], "the boys"),
  M("___ studenti", ["gli", "i", "le"], "the students"),
  M("___ amici", ["gli", "i", "l'"], "the friends", "gli before vowels too."),
  M("___ sedie", ["le", "la", "gli"], "the chairs"),
  M("___ gnomi", ["gli", "i", "le"], "the gnomes"),
  M("___ mani", ["le", "i", "gli"], "the hands", "la mano is feminine even though it ends in -o → le mani."),
  M("___ giorni", ["i", "gli", "le"], "the days"),
  M("___ acqua", ["l'", "la", "lo"], "the water"),
  M("___ zio", ["lo", "il", "l'"], "the uncle"),
]},
{ id: "partitivi", group: "Articles, possessives & ‘there is’", level: "A2", topic: "g_partitivo",
  title: "Partitive articles — some / any", sheet: "Italian Partitive Articles",
  items: [
  G("Vorrei ___ pane.", "del", "di + il", "I'd like some bread."),
  G("Compro ___ pasta.", "della", "di + la", "I'm buying some pasta."),
  G("Metto ___ zucchero nel caffè.", "dello", "di + lo", "I put some sugar in the coffee."),
  G("Bevo ___ acqua.", "dell'", "di + l'", "I drink some water."),
  G("Ho ___ amici a Roma.", "degli", "di + gli", "I have some friends in Rome."),
  G("Mangio ___ mele.", "delle", "di + le", "I eat some apples."),
  G("Leggo ___ libri.", "dei", "di + i", "I read some books."),
  G("Vuoi ___ latte?", "del", "di + il", "Do you want some milk?"),
  G("Ci sono ___ studenti in classe.", "degli", "di + gli", "There are some students in class."),
  G("Abbiamo ___ problemi.", "dei", "di + i", "We have some problems."),
  G("Compro ___ olive per il picnic.", "delle", "di + le", "I'm buying some olives for the picnic."),
  M("“some water”", ["dell'acqua", "della acqua", "del acqua"], null, "Sheet's common mistake: 'dei acqua' ✗. acqua is feminine and starts with a vowel → dell'.", "dell'acqua"),
  M("Which one is a partitive (= some)?", ["Mangio delle mele.", "Parlo degli amici.", "Il libro della ragazza."], null, "Heads-up: the sheet's 'Parlo degli amici' isn't a partitive — it's parlare di + gli ('I talk about the friends').", "Mangio delle mele."),
]},
{ id: "possessivi", group: "Articles, possessives & ‘there is’", level: "A1", topic: "g_possessivi",
  title: "Possessive adjectives", sheet: "Gli Aggettivi Possessivi · Possessive Adjectives",
  items: [
  G("Il ___ libro.", "mio", "my", "My book."),
  G("La ___ borsa.", "mia", "my", "My bag."),
  G("I ___ cani.", "tuoi", "your · tu", "Your dogs."),
  G("Le ___ borse.", "sue", "her", "Her bags."),
  G("La ___ casa.", "nostra", "our", "Our house."),
  G("Le ___ macchine.", "loro", "their", "Their cars.", "loro never changes."),
  G("Il ___ telefono.", "suo", "his", "His phone."),
  G("La ___ amica.", "sua", "his", "His (female) friend.", "The possessive agrees with the thing owned, not the owner: la sua amica can mean his or her friend."),
  G("I ___ amici.", "nostri", "our", "Our friends."),
  G("Le ___ idee.", "vostre", "your · voi", "Your ideas."),
  G("I ___ genitori.", "miei", "my", "My parents."),
  G("___ madre è italiana.", "mia", "my", "My mother is Italian.", "No article with a single family member: mia madre, mio fratello (but i miei fratelli, la loro madre)."),
  M("Fix: “Il mio amica”", ["La mia amica", "Il mia amica", "La mio amica"], "My (female) friend", null, "La mia amica"),
]},
{ id: "ce_ci_vuole", group: "Articles, possessives & ‘there is’", level: "A1–A2", topic: "g_cessere",
  title: "C'è / ci sono · ci vuole / ci vogliono", sheet: "C'è vs Ci Sono · Ci Vuole vs Ci Vogliono",
  items: [
  M("___ un libro sul tavolo.", ["C'è", "Ci sono"], "There is a book on the table."),
  M("___ tanti turisti.", ["Ci sono", "C'è"], "There are lots of tourists."),
  M("___ una farmacia qui vicino?", ["C'è", "Ci sono"], "Is there a chemist's near here?"),
  M("___ problemi?", ["Ci sono", "C'è"], "Are there any problems?"),
  M("Non ___ tempo.", ["c'è", "ci sono"], "There isn't time."),
  M("___ molte persone.", ["Ci sono", "C'è"], "There are many people."),
  M("___ un'ora per arrivare.", ["Ci vuole", "Ci vogliono"], "It takes an hour to get there.", "ci vuole + singular amount."),
  M("___ due ore in treno.", ["Ci vogliono", "Ci vuole"], "It takes two hours by train.", "ci vogliono + plural amount — the verb agrees with the time, not the person."),
  M("Quanto ci ___ ?", ["vuole", "vogliono"], "How long does it take?"),
  M("___ cinque minuti.", ["Ci vogliono", "Ci vuole"], "It takes five minutes."),
  M("___ molta pazienza.", ["Ci vuole", "Ci vogliono"], "It takes a lot of patience."),
  M("Da Bologna a Firenze ___ trentacinque minuti.", ["ci vogliono", "ci vuole"], "From Bologna to Florence it takes 35 minutes."),
]},
/* =============================== PRONOUNS =============================== */
{ id: "pron_diretti", group: "Pronouns", level: "A2", topic: "g_clitici",
  title: "Direct object pronouns — lo, la, li, le", sheet: "Lo La Li Le · Direct Object Pronouns · Pronouns",
  items: [
  G("Vedo Marco. → ___ vedo.", "lo", "him", "I see Marco. → I see him."),
  G("Compro la pizza. → ___ compro.", "la", "it (fem.)", "I buy the pizza. → I buy it."),
  G("Vedo i ragazzi. → ___ vedo.", "li", "them (masc.)", "I see the boys. → I see them."),
  G("Vedo le ragazze. → ___ vedo.", "le", "them (fem.)", "I see the girls. → I see them."),
  G("Cerco le chiavi. → ___ cerco.", "le", "them (fem.)", "I'm looking for the keys. → I'm looking for them."),
  G("Conosco i tuoi genitori. → ___ conosco.", "li", "them (masc.)", "I know your parents. → I know them."),
  G("Leggo la rivista. → ___ leggo.", "la", "it (fem.)", "I read the magazine. → I read it."),
  G("Guardo il film. → ___ guardo.", "lo", "it (masc.)", "I watch the film. → I watch it."),
  G("Voglio comprare la borsa. → Voglio comprar___.", "la", "it (fem.)", "I want to buy the bag. → I want to buy it.", "With an infinitive the pronoun joins the end: comprarla."),
  G("Sto leggendo il libro. → ___ sto leggendo.", "lo", "it (masc.)", "I'm reading the book. → I'm reading it.", "Also possible: Sto leggendolo."),
  G("Invito i miei amici. → ___ invito.", "li", "them (masc.)", "I invite my friends. → I invite them.", "Correction to the 'Direct Object Pronouns' sheet: it gives 'Vi invito', which means 'I invite YOU (all)'."),
  G("Vediamo i nostri amici. → ___ vediamo.", "li", "them (masc.)", "We see our friends. → We see them.", "Correction to the sheet: 'Ci vediamo' means 'we see each other / see you!'."),
  M("“I see him.”", ["Lo vedo.", "Vedo lo.", "Gli vedo."], null, "The pronoun goes before the conjugated verb.", "Lo vedo."),
  M("Which is correct?", ["Noi vi vediamo.", "Noi ci vi vediamo.", "Vi noi vediamo."], "We see you (all).", "Correction to the 'Pronouns' sheet: 'Noi vi vediamo' and 'Io mi chiamo Luca' are both correct — the subject pronoun (noi, io) is optional, not wrong.", "Noi vi vediamo."),
]},
{ id: "pron_indiretti", group: "Pronouns", level: "A2", topic: "g_clitici",
  title: "Indirect object pronouns — mi, ti, gli, le…", sheet: "Mi Ti Gli Le Ci Vi · Indirect Object Pronouns",
  items: [
  G("Parlo a Marco. → ___ parlo.", "gli", "to him", "I talk to Marco. → I talk to him."),
  G("Scrivo a Maria. → ___ scrivo.", "le", "to her", "I write to Maria. → I write to her."),
  G("Do un libro a Marco. → ___ do un libro.", "gli", "to him", "I give Marco a book. → I give him a book."),
  G("Porto dei fiori a Lucia. → ___ porto dei fiori.", "le", "to her", "I bring Lucia some flowers. → I bring her flowers."),
  G("Telefono ai ragazzi. → ___ telefono.", "gli", "to them", "I phone the boys. → I phone them.", "gli = to him AND (in everyday Italian) to them."),
  G("Mando un invito alle ragazze. → ___ mando un invito.", "gli", "to them", "I send the girls an invitation. → I send them an invitation.", "Correction to the sheet: gli works for 'to them' of any gender. The formal alternative is loro AFTER the verb: 'Mando loro un invito' — never 'Loro mando'."),
  G("Parli a me? → ___ parli?", "mi", "to me", "Are you talking to me?"),
  G("Scrivete a noi? → ___ scrivete?", "ci", "to us", "Are you writing to us?"),
  G("Spiego a voi. → ___ spiego.", "vi", "to you (plural)", "I explain to you (all)."),
  G("Mando un messaggio a te. → ___ mando un messaggio.", "ti", "to you", "I'll send you a message."),
  M("“I talk to him.”", ["Gli parlo.", "Lo parlo.", "Le parlo."], null, "parlare a qualcuno → indirect pronoun (gli). Compare: Lo vedo = I see him (direct).", "Gli parlo."),
  M("“I tell them the truth.”", ["Gli dico la verità.", "Loro dico la verità.", "Li dico la verità."], null, "Also correct (more formal): Dico loro la verità.", "Gli dico la verità."),
  M("“Ci pensa mio padre” means…", ["My father will take care of it.", "My father thinks about us.", "My father thinks of him."], null, "Correction to the sheet: here ci = 'about it' (pensarci = to see to it), not 'to us'.", "Ci pensa mio padre."),
]},
{ id: "ne_ci", group: "Pronouns", level: "A2", topic: "g_clitici",
  title: "Ne and ci", sheet: "Ne vs Ci",
  items: [
  G("Quanti libri hai? – ___ ho tre.", "ne", "of them", "How many books do you have? – I have three (of them).", "ne is needed with numbers and amounts."),
  G("Vai a Roma? – Sì, ___ vado domani.", "ci", "there", "Are you going to Rome? – Yes, I'm going there tomorrow."),
  G("Parli di Marco? – Sì, ___ parlo spesso.", "ne", "about him", "Are you talking about Marco? – Yes, I often talk about him.", "di → ne."),
  G("Pensi al problema? – Sì, ___ penso.", "ci", "about it", "Are you thinking about the problem? – Yes, I'm thinking about it.", "pensare a → ci."),
  G("Quante mele vuoi? – ___ voglio due.", "ne", "of them", "How many apples do you want? – I want two."),
  G("Sei mai stato a Milano? – Sì, ___ sono stato.", "ci", "there", "Have you ever been to Milan? – Yes, I've been there."),
  G("Vuoi del pane? – Sì, ___ voglio un po'.", "ne", "some of it", "Do you want some bread? – Yes, I want a bit."),
  G("Vai al cinema stasera? – No, non ___ vado.", "ci", "there", "Are you going to the cinema tonight? – No, I'm not going."),
  M("“I talk about it.”", ["Ne parlo.", "Ci parlo."], null, "parlare DI → ne.", "Ne parlo."),
  M("“I'm thinking about it.”", ["Ci penso.", "Ne penso."], null, "pensare A → ci.", "Ci penso."),
  M("“I'm going there.”", ["Ci vado.", "Ne vado."], null, null, "Ci vado."),
]},
/* ============================== PREPOSITIONS ============================== */
{ id: "prep_semplici", group: "Prepositions & time", level: "A1", topic: "g_preposizioni",
  title: "Simple prepositions — di, a, da, in, con, su, per, tra", sheet: "Di A Da In Con · Italian Prepositions Made Simple · In, A, Da",
  items: [
  G("Il libro ___ Marco.", "di", "of", "Marco's book."),
  G("Vado ___ Roma.", "a", "to", "I'm going to Rome."),
  G("Vengo ___ Milano.", "da", "from", "I come from Milan."),
  G("Vivo ___ Italia.", "in", "in", "I live in Italy."),
  G("Esco ___ Marta.", "con", "with", "I'm going out with Marta."),
  G("Ho letto un articolo ___ Roma.", "su", "about", "I read an article about Rome."),
  G("Questo regalo è ___ te.", "per", "for", "This present is for you."),
  G("Parto ___ due ore.", ["tra", "fra"], "in (time)", "I'm leaving in two hours."),
  G("Scrivo ___ una penna.", "con", "with", "I write with a pen."),
  G("Studio ___ imparare.", "per", "in order to", "I study in order to learn."),
  G("Parliamo ___ politica.", "di", "about", "We're talking about politics."),
  G("Cammino ___ la stazione.", "verso", "towards", "I'm walking towards the station."),
  G("Vado ___ fretta.", "senza", "without", "I go without hurrying."),
  G("Lotto ___ le difficoltà.", "contro", "against", "I fight against difficulties."),
  G("Sono ___ Londra.", "di", "from (origin)", "I'm from London.", "essere di = where you're from; venire da = come from."),
  M("“This book is Maria's.”", ["Questo libro è di Maria.", "Questo libro è da Maria.", "Questo libro è a Maria."], null, "Correction to the 'In, A, Da' sheet: possession uses di, not da. 'da Maria' means 'at Maria's (place)'.", "Questo libro è di Maria."),
]},
{ id: "andare_a_in_da", group: "Prepositions & time", level: "A1", topic: "g_preposizioni",
  title: "Andare a / in / da / al", sheet: "Andare a, in, da · Vado a / al / in",
  items: [
  G("Vado ___ Roma.", "a", "city", "I'm going to Rome.", "a with cities and towns."),
  G("Vado ___ Italia.", "in", "country", "I'm going to Italy.", "in with countries and regions."),
  G("Vado ___ Marco.", "da", "person", "I'm going to Marco's.", "da with people."),
  G("Vado ___ medico.", "dal", "da + il", "I'm going to the doctor's."),
  G("Vado ___ supermercato.", "al", "a + il", "I'm going to the supermarket."),
  G("Vado ___ Toscana.", "in", "region", "I'm going to Tuscany."),
  G("Vado ___ ufficio.", "in", "fixed expression", "I'm going to the office."),
  G("Vado ___ macchina.", "in", "transport", "I'm going by car."),
  G("Vado ___ scuola.", "a", "fixed expression", "I'm going to school."),
  G("Vado ___ mia madre.", "da", "person", "I'm going to my mother's."),
  G("Vado ___ dentista.", "dal", "da + il", "I'm going to the dentist's."),
  G("Vado ___ banca.", "in", "fixed expression", "I'm going to the bank."),
  G("Vado ___ cinema.", "al", "a + il", "I'm going to the cinema."),
  G("Vado ___ casa.", "a", "fixed expression", "I'm going home."),
  G("Vado ___ lavorare.", "a", "+ infinitive", "I'm going to work."),
  G("Vado ___ autobus.", "in", "transport", "I'm going by bus."),
  G("Vado ___ parrucchiere.", "dal", "da + il", "I'm going to the hairdresser's."),
]},
{ id: "prep_articolate", group: "Prepositions & time", level: "A1–A2", topic: "g_prepavanzate",
  title: "Prepositions + articles — al, del, nel, sul, dal", sheet: "Prepositions + Articles",
  items: [
  G("Vado ___ stazione.", "alla", "a + la", "I'm going to the station."),
  G("Il gatto è ___ tavolo.", "sul", "su + il", "The cat is on the table."),
  G("Il museo è ___ centro storico.", "nel", "in + il", "The museum is in the old town."),
  G("Veniamo ___ medico.", "dal", "da + il", "We're coming from the doctor's."),
  G("Vivo ___ città più bella d'Italia.", "nella", "in + la", "I live in the most beautiful city in Italy."),
  G("Parlo ___ viaggio.", "del", "di + il", "I'm talking about the trip."),
  G("Sono ___ treno.", "sul", "su + il", "I'm on the train."),
  G("Il telefono è ___ borsa.", "nella", "in + la", "The phone is in the bag."),
  G("Vado ___ ristorante.", "al", "a + il", "I'm going to the restaurant."),
  G("Il prezzo ___ libri.", "dei", "di + i", "The price of the books."),
  G("Le chiavi sono ___ scrivania.", "sulla", "su + la", "The keys are on the desk."),
  G("Telefono ___ amici.", "agli", "a + gli", "I'm phoning the friends."),
  G("Vado ___ zoo.", "allo", "a + lo", "I'm going to the zoo."),
  G("Esco ___ ufficio alle sei.", "dall'", "da + l'", "I leave the office at six."),
  G("Compriamo ___ pane.", "del", "di + il", "We're buying some bread."),
]},
{ id: "avverbi_tempo", group: "Prepositions & time", level: "A1", topic: "g_avverbi",
  title: "Time adverbs & past time expressions", sheet: "16 Avverbi di Tempo · Past tense",
  items: [
  G("___ studio.", ["adesso", "ora"], "now", "Now I'm studying."),
  G("___ fa caldo.", "oggi", "today", "Today it's hot."),
  G("___ partirò per Roma.", "domani", "tomorrow", "Tomorrow I'll leave for Rome."),
  G("___ sono andato al cinema.", "ieri", "yesterday", "Yesterday I went to the cinema."),
  G("___ ero molto stanco.", ["l'altro ieri", "ieri l'altro", "l'altroieri"], "the day before yesterday", "The day before yesterday I was very tired.", "Correction to the sheet: 'anteprima' means 'preview' (e.g. of a film). 'The day before yesterday' is l'altro ieri."),
  G("Torno ___.", "subito", "immediately", "I'll be right back."),
  G("Ti richiamo ___.", "presto", "soon", "I'll call you back soon."),
  G("Sono arrivato ___.", "tardi", "late", "I arrived late."),
  G("Lui è ___ gentile.", "sempre", "always", "He is always kind."),
  G("Vado ___ in palestra.", "spesso", "often", "I often go to the gym."),
  G("Non sono ___ stato a Parigi.", "mai", "never", "I've never been to Paris."),
  G("Non ho ___ finito.", "ancora", "yet", "I haven't finished yet."),
  G("___ è arrivato il weekend!", "finalmente", "finally", "The weekend has finally arrived!"),
  G("___ di uscire, chiudi la porta.", "prima", "before", "Before going out, close the door."),
  G("La settimana ___ sono andato a Bologna.", "scorsa", "last", "Last week I went to Bologna."),
  G("Due giorni ___ ho visto Marco.", "fa", "ago", "Two days ago I saw Marco."),
  G("Il mese ___ ho cominciato a studiare.", "scorso", "last", "Last month I started studying."),
]},
/* ============================ PHRASES & CAFÉ ============================ */
{ id: "frasi_bar", group: "Phrases · bar & restaurant", level: "A1", topic: "bar",
  title: "At the bar", sheet: "Frasi utili quando sei al bar",
  items: [
  T("Good morning!", ["Buongiorno!"]),
  T("Do you have a free table?", ["Avete un tavolo libero?"]),
  T("Can I sit here?", ["Posso sedermi qui?", "Posso sedere qui?"]),
  T("I'd like a coffee, please.", ["Vorrei un caffè, per favore.", "Un caffè, per favore."]),
  T("I'd also like a croissant, please.", ["Vorrei anche un cornetto, per favore."]),
  T("What do you have to eat?", ["Che cosa avete da mangiare?", "Cosa avete da mangiare?"]),
  T("How much does it cost?", ["Quanto costa?"]),
  T("Is it possible to pay by card?", ["È possibile pagare con la carta?", "È possibile pagare con carta?"]),
  T("Can I pay by card?", ["Posso pagare con la carta?", "Posso pagare con carta?"]),
  T("The bill, please.", ["Il conto, per favore."]),
  T("How much do I pay?", ["Quanto pago?"]),
  T("Where is the toilet?", ["Dov'è il bagno?"]),
  T("Thank you, have a nice day!", ["Grazie, buona giornata!"]),
  M("zucchero", ["sugar", "juice", "sweet"], null, null, "zucchero"),
  M("subito", ["right away", "later", "soon"], null, null, "subito"),
  M("At an Italian bar, you usually…", ["order and pay first at the till, then take the receipt to the counter", "sit down and pay at the end", "tip 15% at the counter"], null, "Consiglio from the sheet: al bar si ordina e si paga prima al bancone. Sitting at a table can cost more."),
]},
{ id: "frasi_ristorante", group: "Phrases · bar & restaurant", level: "A1", topic: "ristorante",
  title: "Restaurant & café — 25 phrases", sheet: "25 Phrases for Restaurants & Cafés",
  items: [
  T("A table for two.", ["Un tavolo per due."]),
  T("Can we sit here?", ["Possiamo sederci qui?"]),
  T("The menu, please.", ["Il menù, per favore.", "Il menu, per favore."]),
  T("What do you recommend?", ["Cosa consiglia?", "Che cosa consiglia?", "Cosa mi consiglia?"]),
  T("I would like this.", ["Vorrei questo."]),
  T("This for me.", ["Per me, questo.", "Questo per me."]),
  T("Without onion, please.", ["Senza cipolla, per favore."]),
  T("A bottle of water.", ["Una bottiglia d'acqua.", "Una bottiglia di acqua."]),
  T("Do you have wine?", ["Avete vino?", "Avete del vino?"]),
  T("It's delicious.", ["È delizioso.", "È deliziosa."]),
  T("What's in it?", ["Cosa c'è dentro?", "Che cosa c'è dentro?"]),
  T("Is it spicy?", ["È piccante?"]),
  T("I'm vegetarian.", ["Sono vegetariano.", "Sono vegetariana."]),
  T("Gluten-free.", ["Senza glutine."]),
  T("Anything else?", ["Altro?", "Qualcos'altro?"]),
  T("That's all.", ["È tutto."]),
  T("Do you accept cash?", ["Accettate contanti?"]),
  T("Is service included?", ["Il servizio è incluso?"]),
  T("Thank you, it was very good.", ["Grazie, era molto buono."]),
]},
{ id: "caffe", group: "Phrases · bar & restaurant", level: "A1", topic: "bar",
  title: "How to order coffee", sheet: "How to Order Coffee in Italy",
  items: [
  M("A small, strong espresso", ["Un caffè", "Un americano", "Un caffè lungo"], null, "In Italy, 'un caffè' IS an espresso.", "Un caffè, per favore."),
  M("Espresso with a little milk", ["Un caffè macchiato", "Un latte macchiato", "Un caffè latte"], null, "macchiato = 'stained': coffee stained with milk.", "Un caffè macchiato, per favore."),
  M("Hot milk stained with coffee", ["Un latte macchiato", "Un caffè macchiato", "Un marocchino"], null, "Order 'un latte' alone and you'll get a glass of milk!", "Un latte macchiato, per favore."),
  M("Espresso with a splash of liqueur", ["Un caffè corretto", "Un caffè shakerato", "Un ristretto"], null, "corretto = 'corrected'.", "Un caffè corretto, per favore."),
  M("A double espresso", ["Un doppio", "Un lungo", "Un ristretto"], null, null, "Un doppio, per favore."),
  M("Espresso with hot water", ["Un americano", "Un caffè lungo", "Un orzo"], null, null, "Un americano, per favore."),
  M("A shorter, more concentrated espresso", ["Un ristretto", "Un doppio", "Un lungo"], null, null, "Un ristretto, per favore."),
  M("Espresso with cocoa and milk foam", ["Un marocchino", "Un cappuccino", "Un ginseng"], null, null, "Un marocchino, per favore."),
  M("Chilled, shaken espresso", ["Un caffè shakerato", "Un caffè corretto", "Un caffè freddo lungo"], null, null, "Un caffè shakerato, per favore."),
  M("Barley 'coffee', caffeine-free", ["Un orzo", "Un decaffeinato", "Un ginseng"], null, null, "Un orzo, per favore."),
  M("An espresso pulled longer", ["Un caffè lungo", "Un americano", "Un doppio"], null, null, "Un caffè lungo, per favore."),
  M("A decaf espresso", ["Un decaffeinato", "Un orzo", "Un ristretto"], null, null, "Un decaffeinato, per favore."),
]},
/* =============================== VOCABULARY =============================== */
{ id: "voc_viaggio", group: "Vocabulary", level: "A1", topic: "stazione",
  title: "Travel — hotel, restaurant & transport", sheet: "Common Verbs (Idiomary travel sheet)",
  vocab: [
  ["il conto","the bill"],["la mancia","the tip"],["il tavolo","the table"],["la forchetta","the fork"],["il coltello","the knife"],
  ["il cucchiaio","the spoon"],["il cameriere","the waiter"],["ordinare","to order"],["la prenotazione","the reservation"],["la camera","the room"],
  ["la chiave","the key"],["l'ascensore","the lift"],["l'asciugamano","the towel"],["la coperta","the blanket"],["la macchina","the car"],
  ["il viaggio","the journey / trip"],["il treno","the train"],["l'autobus","the bus"],["la fermata","the stop"],["il biglietto","the ticket"],
  ["il traffico","the traffic"],["la moto","the motorbike"],["la borsa","the bag"],["leggero","light (weight)"],["pesante","heavy"],
  ["il peso","the weight"],["il visto","the visa"],["il modulo","the form"],["la firma","the signature"],["il passaporto","the passport"],
  ["il corridoio","the aisle"],["il sedile","the seat"],["il ritardo","the delay"],["atterrare","to land"],["volare","to fly"],
  ["partire","to leave / depart"],["viaggiare","to travel"],["fare la valigia","to pack"],["prenotare","to book"],["guidare","to drive"],["soggiornare","to stay (at a hotel)"],
]},
{ id: "frasi_viaggio", group: "Vocabulary", level: "A1", topic: "indicazioni",
  title: "Travel — questions & expressions", sheet: "Common Verbs (Idiomary travel sheet)",
  items: [
  T("Is it safe?", ["È sicuro?"]),
  T("How far is it?", ["Quanto dista?"]),
  T("What time?", ["A che ora?"]),
  T("Where is it?", ["Dov'è?"]),
  T("Is it open?", ["È aperto?"]),
  T("Is it closed?", ["È chiuso?"]),
  T("Can you help me? (polite)", ["Può aiutarmi?", "Mi può aiutare?"]),
  T("It's far.", ["È lontano."]),
  T("It's near.", ["È vicino."]),
  T("See you!", ["Ci vediamo!"]),
  T("Hurry up! (to a friend)", ["Sbrigati!"]),
  T("Let's go!", ["Andiamo!"]),
  T("I'm ready. (male)", ["Sono pronto."]),
  T("I'm lost. (male)", ["Mi sono perso.", "Sono perso."]),
  T("Excuse me. (polite)", ["Mi scusi.", "Scusi."]),
]},
{ id: "voc_azioni", group: "Vocabulary", level: "A1", topic: "free",
  title: "Action verbs", sheet: "Action Words",
  vocab: [
  ["dare","to give"],["prendere","to take"],["venire","to come"],["correre","to run"],["camminare","to walk"],["saltare","to jump"],
  ["nuotare","to swim"],["cadere","to fall"],["salire","to go up"],["entrare","to enter"],["uscire","to go out"],["tornare","to return"],
  ["dire","to say"],["chiedere","to ask"],["rispondere","to answer"],["gridare","to shout"],["sussurrare","to whisper"],["spiegare","to explain"],
  ["raccontare","to tell (a story)"],["discutere","to discuss"],["promettere","to promise"],["mentire","to lie"],["ringraziare","to thank"],["salutare","to greet"],
  ["chiamare","to call"],["pensare","to think"],["capire","to understand"],["sapere","to know"],["ricordare","to remember"],["dimenticare","to forget"],
  ["credere","to believe"],["scegliere","to choose"],["decidere","to decide"],["imparare","to learn"],["amare","to love"],["odiare","to hate"],
  ["temere","to fear"],["sperare","to hope"],["ridere","to laugh"],["cambiare","to change"],["crescere","to grow"],["diventare","to become"],
  ["migliorare","to improve"],["creare","to create"],["costruire","to build"],["dipingere","to paint"],["disegnare","to draw"],["svegliarsi","to wake up"],
  ["vestirsi","to get dressed"],["cucinare","to cook"],["comprare","to buy"],["pulire","to clean"],["pagare","to pay"],["dormire","to sleep"],
]},
{ id: "voc_verbi_base", group: "Vocabulary", level: "A1", topic: "g_presente",
  title: "Everyday verbs — 'io' forms", sheet: "500 Verbi Base",
  vocab: [
  ["so","I know"],["vedo","I see"],["sento","I hear"],["dico","I say"],["chiedo","I ask"],["do","I give"],["invio","I send"],["trovo","I find"],
  ["uso","I use"],["leggo","I read"],["aiuto","I help"],["provo","I try"],["apro","I open"],["compro","I buy"],["pago","I pay"],["corro","I run"],
  ["vinco","I win"],["voglio","I want"],["mi piace","I like"],["penso","I think"],["guardo","I watch / look"],["prendo","I take"],["ottengo","I get"],
  ["porto","I bring"],["imparo","I learn"],["scrivo","I write"],["inizio","I start"],["dormo","I sleep"],["parto","I leave"],["spero","I hope"],
  ["guido","I drive"],["mi siedo","I sit down"],["gioco","I play"],["perdo","I lose"],["mostro","I show"],["tengo","I keep"],["ho bisogno","I need"],
  ["ascolto","I listen"],["racconto","I tell"],["rispondo","I answer"],["finisco","I finish"],["chiudo","I close"],["mi sveglio","I wake up"],
  ["rimango","I stay"],["incontro","I meet"],["aspetto","I wait"],["mi sento","I feel"],["ricordo","I remember"],["dimentico","I forget"],
  ["capisco","I understand"],["credo","I believe"],["intendo","I mean"],["cambio","I change"],["mi muovo","I move"],["viaggio","I travel"],
  ["cammino","I walk"],["sto in piedi","I stand"],["seguo","I follow"],["mi godo","I enjoy"],["mi rilasso","I relax"],
]},
{ id: "voc_frutta", group: "Vocabulary", level: "A1", topic: "g_articoli",
  title: "Fruit", sheet: "La Frutta",
  vocab: [
  ["la mela","apple"],["l'arancia","orange"],["la banana","banana"],["l'albicocca","apricot"],["la prugna","plum"],["il limone","lemon"],
  ["la pesca","peach"],["le ciliegie","cherries"],["il kiwi","kiwi"],["l'uva","grapes"],["l'anguria","watermelon"],["le fragole","strawberries"],
  ["i mirtilli","blueberries"],["il frutto del drago","dragon fruit"],["il melone","melon"],["il melograno","pomegranate"],["l'ananas","pineapple"],
  ["il lime","lime"],["il lampone","raspberry"],["il mango","mango"],["il fico","fig"],["il cocco","coconut"],["l'avocado","avocado"],
  ["i datteri","dates"],["l'arancia rossa","blood orange"],["i cachi","persimmons (sharon fruit)"],["la carambola","star fruit"],["la papaia","papaya"],["la guava","guava"],
]},
{ id: "voc_contenitori", group: "Vocabulary", level: "A1", topic: "g_partitivo",
  title: "Containers", sheet: "I Contenitori",
  vocab: [
  ["la bottiglia","bottle"],["il barattolo","jar"],["la scatola","box"],["il sacchetto","small bag"],["la busta","envelope / bag"],
  ["il contenitore","container"],["il vaso","vase / pot"],["la lattina","can (drink)"],["il bicchiere","glass"],["la tazza","cup"],
  ["la ciotola","bowl"],["il secchio","bucket"],["il cestino","basket / bin"],["la tanica","jerrycan"],["il flacone","small bottle (soap, shampoo)"],["il barattolo di vetro","glass jar"],
]},
/* ============================ FOOD & CULTURE ============================ */
{ id: "cultura_cibo", group: "Food, wine & culture", level: "A1–A2", topic: "ristorante",
  title: "Breads, pasta & desserts", sheet: "Breads · Pasta Shapes · Pasta e Sughi · Desserts · Christmas Sweets",
  items: [
  M("Da quale regione viene il pane carasau?", ["Sardegna", "Sicilia", "Puglia"], "Which region does pane carasau come from?"),
  M("Quale pane è senza sale?", ["il pane toscano", "la ciabatta", "la michetta"], "Which bread is saltless?"),
  M("La focaccia genovese viene dalla…", ["Liguria", "Toscana", "Campania"], "Focaccia genovese comes from…"),
  M("La piadina romagnola viene dall'…", ["Emilia-Romagna", "Veneto", "Lazio"], "Piadina comes from…"),
  M("La ciabatta viene dal…", ["Veneto", "Piemonte", "Lazio"], "Ciabatta comes from…"),
  M("Spaghetti alle vongole: vongole sono…", ["clams", "mussels", "prawns"], "Spaghetti alle vongole: vongole are…"),
  M("Pappardelle al cinghiale: il cinghiale è…", ["wild boar", "rabbit", "duck"], "Pappardelle al cinghiale: cinghiale is…"),
  M("Con quale pasta si mangia il pesto (sul foglio)?", ["le trofie", "i bucatini", "i tortellini"], "Which pasta goes with pesto on the sheet?"),
  M("Paccheri allo scoglio: 'allo scoglio' vuol dire…", ["with seafood", "with cheese", "with meat sauce"], "'allo scoglio' means…"),
  M("Cacio e pepe vuol dire…", ["cheese and pepper", "cabbage and peas", "cream and ham"], "Cacio e pepe means…"),
  M("I tortellini in brodo: il brodo è…", ["broth", "butter", "bread"], "Tortellini in brodo: brodo is…"),
  M("Il tiramisù viene dal…", ["Veneto", "Lazio", "Piemonte"], "Tiramisù comes from…"),
  M("I cannoli sono della…", ["Sicilia", "Campania", "Sardegna"], "Cannoli are from…"),
  M("La sfogliatella e la pastiera sono della…", ["Campania", "Puglia", "Liguria"], "Sfogliatella and pastiera are from…"),
  M("I ricciarelli sono biscotti di…", ["Siena", "Napoli", "Torino"], "Ricciarelli are biscuits from…"),
  M("Il pandoro viene da…", ["Verona", "Milano", "Napoli"], "Pandoro comes from…"),
  M("Il panettone è il dolce di Natale di…", ["Milano", "Roma", "Palermo"], "Panettone is the Christmas cake of…"),
  M("Gli struffoli sono…", ["tiny fried dough balls with honey", "almond biscuits", "a chocolate cake"], "Struffoli are…"),
  M("La granita è…", ["a semi-frozen dessert with fresh fruit", "a baked custard tart", "a fried pastry"], "Granita is…"),
]},
{ id: "cultura_vino", group: "Food, wine & culture", level: "A1–A2", topic: "free",
  title: "Wine, olive oil & travel", sheet: "Wines · Olive Oils · Bologna by Train · Tuscan Hilltop Villages",
  items: [
  M("Il Barolo e il Barbaresco vengono dal…", ["Piemonte", "Veneto", "Toscana"], "Barolo and Barbaresco come from…"),
  M("Il Brunello viene da…", ["Montalcino", "Montepulciano", "Pienza"], "Brunello comes from…"),
  M("Il Prosecco viene dal…", ["Veneto", "Piemonte", "Friuli"], "Prosecco comes from…"),
  M("Il Nero d'Avola viene dalla…", ["Sicilia", "Puglia", "Campania"], "Nero d'Avola comes from…"),
  M("Il Lambrusco viene dall'…", ["Emilia-Romagna", "Abruzzo", "Lombardia"], "Lambrusco comes from…"),
  M("Il Vin Santo è…", ["a dessert wine", "a sparkling wine", "a young red"], "Vin Santo is…"),
  M("L'olio Coratina viene dalla…", ["Puglia", "Liguria", "Toscana"], "Coratina olive oil comes from…"),
  M("L'olio Taggiasca viene dalla…", ["Liguria", "Sicilia", "Umbria"], "Taggiasca olive oil comes from…"),
  M("Da Bologna a Firenze in treno ci vogliono…", ["35 minuti", "1 ora e 30", "2 ore"], "Bologna to Florence by train takes…"),
  M("Da Bologna a Modena ci vogliono…", ["20 minuti", "50 minuti", "1 ora"], "Bologna to Modena takes…"),
  M("Da Bologna a Venezia ci vogliono…", ["1 ora e 30", "35 minuti", "3 ore"], "Bologna to Venice takes…"),
  M("Pienza è famosa per il…", ["pecorino", "prosciutto", "parmigiano"], "Pienza is famous for…"),
  M("San Gimignano è famosa per le sue…", ["torri", "spiagge", "chiese moderne"], "San Gimignano is famous for its…"),
  M("Certaldo è il paese di…", ["Boccaccio", "Dante", "Galileo"], "Certaldo is the village of…"),
  M("Per visitare i borghi toscani, è meglio avere…", ["la macchina", "la bicicletta", "il treno"], "To visit the Tuscan villages you'd better have…"),
]},
];

/* ----------------------------------------------------------------------------
   Exercise engine — self-marking, no API calls (free & works offline).
   Relies on helpers from index.html: el, speakParts, makeReplay, saveVocabItem,
   bumpActivity, similarity, normalizePhrase, setStatus.
---------------------------------------------------------------------------- */
(function () {
  const ROUND = 12;                                   // questions per round
  const LS_SCORES = "parla_ex_scores", LS_MISS = "parla_ex_miss", LS_AUTO = "parla_ex_autoread";
  const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
  let scores = load(LS_SCORES, {});                  // { setId: { best, last, when } }
  let misses = load(LS_MISS, []);                    // [ "setId#key" ]
  let autoRead = load(LS_AUTO, true);

  /* ---------- styles ---------- */
  const css = `
  #exPanel { display:flex; flex-direction:column; gap:14px; }
  .ex-top { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
  .ex-top h2 { margin:0; font-family:var(--serif); font-size:20px; font-weight:600; margin-right:auto; }
  .ex-intro { font-size:13px; color:var(--muted); margin:-6px 0 0; }
  .ex-quick { display:flex; gap:8px; flex-wrap:wrap; }
  .ex-group h3 { font-size:12px; text-transform:uppercase; letter-spacing:.5px; color:var(--accent-deep); margin:10px 0 6px; font-weight:600; }
  .ex-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(220px, 1fr)); gap:8px; }
  .ex-card { text-align:left; display:flex; flex-direction:column; gap:3px; padding:10px 12px; border-radius:12px; background:var(--panel); }
  .ex-card .t { font-weight:600; font-size:14px; line-height:1.3; }
  .ex-card .s { font-size:11.5px; color:var(--muted); line-height:1.3; }
  .ex-card .b { font-size:11.5px; color:var(--olive); }
  .ex-card .b.none { color:var(--muted); }
  .ex-q { background:var(--panel); border:1px solid var(--border); border-radius:var(--radius); padding:18px; display:flex; flex-direction:column; gap:12px; box-shadow:0 2px 12px rgba(45,42,32,.05); }
  .ex-meta { display:flex; justify-content:space-between; gap:8px; font-size:12px; color:var(--muted); }
  .ex-bar { height:5px; background:var(--tan); border-radius:3px; overflow:hidden; }
  .ex-bar > div { height:100%; background:var(--accent); transition:width .3s; }
  .ex-prompt { font-family:var(--serif); font-size:21px; line-height:1.45; }
  .ex-prompt .gap { display:inline-block; min-width:64px; border-bottom:2px solid var(--accent); text-align:center; color:var(--accent-deep); padding:0 4px; }
  .ex-hint { font-size:13px; color:var(--muted); }
  .ex-hint b { color:var(--text); font-weight:600; }
  .ex-opts { display:flex; flex-direction:column; gap:8px; }
  .ex-opts button { text-align:left; font-size:15.5px; padding:11px 14px; font-family:var(--serif); }
  .ex-opts button.right { border-color:var(--olive); background:rgba(110,127,82,.12); }
  .ex-opts button.wrong { border-color:var(--danger); background:rgba(179,57,31,.08); }
  .ex-inrow { display:flex; gap:8px; }
  .ex-in { flex:1; font:inherit; font-size:17px; font-family:var(--serif); padding:10px 12px; border-radius:10px; border:1px solid var(--border); background:var(--bg); color:var(--text); min-width:0; }
  .ex-in:focus { outline:none; border-color:var(--accent); box-shadow:0 0 0 3px rgba(217,119,87,.12); }
  .ex-acc { display:flex; gap:5px; flex-wrap:wrap; }
  .ex-acc button { padding:5px 10px; font-size:15px; }
  .ex-fb { border-radius:10px; padding:10px 12px; font-size:14px; line-height:1.5; }
  .ex-fb.ok { background:rgba(110,127,82,.1); border-left:3px solid var(--olive); }
  .ex-fb.no { background:rgba(179,57,31,.07); border-left:3px solid var(--danger); }
  .ex-fb .full { font-family:var(--serif); font-size:16.5px; margin-top:4px; }
  .ex-fb .x { color:var(--muted); font-size:13px; margin-top:5px; }
  .ex-actions { display:flex; gap:8px; justify-content:flex-end; flex-wrap:wrap; }
  .ex-miss { background: rgba(179,57,31,.14); border-bottom: 2px solid var(--danger); border-radius: 3px; padding: 0 2px; }
  .ex-verb { display:inline-flex; gap:0; }
  .ex-verb button { border-top-right-radius:0; border-bottom-right-radius:0; }
  .ex-verb select { border-top-left-radius:0; border-bottom-left-radius:0; border-left:none; }
  .ex-inrow button.rec { border-color: var(--danger); color: var(--danger); animation: pulse 1.2s infinite; }
  .ex-sum ul { margin:6px 0 0; padding-left:18px; font-size:14px; line-height:1.6; }
  .ex-sum .big { font-family:var(--serif); font-size:26px; }
  @media (max-width:520px) { .ex-prompt { font-size:19px; } .ex-grid { grid-template-columns:1fr; } }`;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  /* ---------- helpers ---------- */
  const h = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const stripAcc = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "");
  const norm = (s) => String(s || "").toLowerCase().replace(/[’‘`´]/g, "'").replace(/[“”"«»]/g, "")
    .replace(/[.!?¡¿,;:…]+/g, " ").replace(/\s+/g, " ").trim();
  const ART = /^(il|lo|la|i|gli|le|un|uno|una|l'|un')\s*/;
  const noArt = (s) => s.replace(ART, "").trim();
  const setById = (id) => EX_SETS.find(s => s.id === id);
  const DICT_SET = { id: "dict", title: "🎧 Listening", sheet: "sentences from all your sheets", virtual: true };
  const CONJ_SET = { id: "conj", title: "🔁 Verb drill", sheet: "verb tables (Present tense, Verbi Irregolari, Avere, Essere, Imperfetto, Passato Prossimo…)", virtual: true };
  let heardHandler = null;              // receives the transcript when you answer with 🎤
  const stopMic = () => { heardHandler = null; try { if (recognizing) cancelRecording(); } catch {} };
  const sayable = (s) => String(s || "").replace(/→/g, "…").replace(/___/g, "…");

  // Expand a set into concrete question objects, each with a stable key (for "my mistakes").
  function questionsFor(set) {
    if (set.items) return set.items.map((it, i) => ({ ...it, key: String(i), set }));
    const pairs = set.vocab;
    return pairs.map(([it, en], i) => {
      const others = shuffle(pairs.filter((_, j) => j !== i)).slice(0, 3);
      const r = (i * 7 + 3) % 4;              // stable mix: 2× EN→IT choice, 1× IT→EN choice, 1× typed
      if (r === 3) return { t: "tr", q: en, a: [it], voc: true, s: it, en: null, key: String(i), set, pair: [it, en] };
      if (r === 2) return { t: "mc", q: it, o: [en, ...others.map(p => p[1])], s: it, key: String(i), set, pair: [it, en], ask: "What does this mean?" };
      return { t: "mc", q: en, o: [it, ...others.map(p => p[0])], s: it, key: String(i), set, pair: [it, en], ask: "How do you say…", itOpts: true };
    });
  }
  // The full, correct Italian sentence for an answered question (for audio + notebook).
  function fullSentence(q) {
    const tidy = (t) => t.replace(/\s+([.!?,])/g, "$1").replace(/\b(l|dell|all|dall|nell|sull|un|quest|quell)'\s+/giu, "$1'")
      .replace(/(^|[.!?]\s+|→\s*|–\s+)(\p{Ll})/gu, (m, p, c) => p + c.toUpperCase());
    if (q.s) return q.s;
    if ((q.t === "gap" || q.t === "mc") && q.q.includes("___")) return tidy(q.q.replace("___", q.t === "gap" ? q.a[0] : q.o[0]));
    if (q.t === "tr") return q.a[0];
    return "";
  }
  // Mark a typed answer. Returns {ok, note}.
  function markTyped(q, given) {
    const g = norm(given);
    if (!g) return { ok: false };
    const cands = q.a.map(norm);
    const compare = (fn) => cands.some(c => fn(c) === fn(g));
    if (compare(x => x) || (q.voc && compare(noArt))) return { ok: true };
    if (compare(stripAcc) || (q.voc && compare(x => stripAcc(noArt(x))))) return { ok: true, note: "Watch the accents: " + q.a[0] };
    if ((q.t === "tr" || q.t === "dict") && q.a.some(a => similarity(normalizePhrase(a), normalizePhrase(given)) >= 0.88))
      return { ok: true, note: "Nearly perfect — compare: " + q.a[0] };
    return { ok: false };
  }

  // Mark a spoken answer (🎤). For gaps you say the whole sentence: the right word must be
  // in it and the rest must roughly match. Translations are compared word by word.
  function markSpoken(q, heard) {
    const hs = stripAcc(norm(heard));
    const simTo = (t) => similarity(normalizePhrase(stripAcc(norm(t))), normalizePhrase(hs));
    if (q.t === "tr") {
      const best = Math.max(...q.a.map(simTo));
      return { ok: best >= 0.8, note: best >= 0.8 && best < 1 ? "Close enough — exact answer: " + q.a[0] : null };
    }
    const has = q.a.some(a => { const aw = stripAcc(norm(a)); return /'$/.test(aw) ? hs.includes(aw) : (" " + hs + " ").includes(" " + aw + " ") || hs === aw; });
    if (!has) return { ok: false };
    if (q.a.some(a => stripAcc(norm(a)) === hs)) return { ok: true };        // just the word on its own
    const full = fullSentence(q);
    return { ok: !full || simTo(full) >= 0.6 };
  }
  // Word-by-word comparison for dictation: correct words plain, missed/wrong words highlighted.
  function diffWords(target, given) {
    const tw = target.split(/\s+/), gw = new Set(stripAcc(norm(given)).split(" "));
    const out = h("div", "full");
    tw.forEach((w, i) => { const ok = gw.has(stripAcc(norm(w))); const s = h("span", ok ? null : "ex-miss", w); out.appendChild(s); if (i < tw.length - 1) out.appendChild(document.createTextNode(" ")); });
    return out;
  }
  function dictationItems() {
    const seen = new Set(), out = [];
    EX_SETS.forEach(s => { if (!s.items) return; questionsFor(s).forEach(q => {
      const f = fullSentence(q), en = q.t === "tr" ? q.q : q.en;
      if (!f || !en || /[→–:“]/.test(f) || f.split(" ").length < 3 || seen.has(f)) return;
      seen.add(f);
      out.push({ t: "dict", q: "", a: [f], s: f, en, key: "d" + out.length, set: DICT_SET });
    }); });
    return out;
  }
  const dictRound = () => shuffle(dictationItems()).slice(0, 10);
  let conjTense = load("parla_ex_conjtense", "all");
  const conjRound = () => Array.from({ length: ROUND }, (_, i) => ({ ...conjQuestion(conjTense), key: "c" + i, set: CONJ_SET }));

  /* ---------- state & panel ---------- */
  let round = null;   // { title, set?, qs, i, right, wrong:[], answered }
  const panel = () => el("exPanel");
  const hideMain = (hide) => ["stage", "chat", "micbar"].forEach(id => el(id).classList.toggle("hidden", hide));

  function open() {
    window.exActive = true;
    try { if (typeof recognizing !== "undefined" && recognizing) cancelRecording(); } catch {}
    speechSynthesis.cancel();
    hideMain(true);
    ["progressPanel", "voicePanel", "setup", "cardsPanel"].forEach(id => el(id) && el(id).classList.add("hidden"));
    window.cardsActive = false;
    backToCard = null;
    panel().classList.remove("hidden");
    showMenu();
  }
  function close() {
    stopMic();
    window.exActive = false;
    speechSynthesis.cancel();
    panel().classList.add("hidden");
    hideMain(false);
    if (typeof paintReviewBtn === "function") paintReviewBtn();
  }
  function header(title, backLabel, onBack) {
    const top = h("div", "ex-top");
    top.appendChild(h("h2", null, title));
    const ar = h("button", "ghost" + (autoRead ? " toggle-on" : ""), autoRead ? "🔊 Read answers: On" : "🔇 Read answers: Off");
    ar.title = "Speak the correct Italian after each answer";
    ar.onclick = () => { autoRead = !autoRead; save(LS_AUTO, autoRead); ar.textContent = autoRead ? "🔊 Read answers: On" : "🔇 Read answers: Off"; ar.classList.toggle("toggle-on", autoRead); };
    top.appendChild(ar);
    const b = h("button", "ghost", backLabel); b.onclick = onBack; top.appendChild(b);
    return top;
  }

  /* ---------- menu ---------- */
  function showMenu() {
    round = null;
    const p = panel(); p.innerHTML = "";
    p.appendChild(header("🏋️ Exercises", "← Back to Giulia", close));
    p.appendChild(h("p", "ex-intro", "Built from your reference sheets. Self-marking, no API cost. Wrong answers go into 📇 Your words for spaced review."));
    const quick = h("div", "ex-quick");
    const mix = h("button", "primary", "🎲 Mixed review (" + ROUND + ")");
    mix.onclick = () => {
      const all = EX_SETS.flatMap(questionsFor);
      startRound("🎲 Mixed review", shuffle(all).slice(0, ROUND), null);
    };
    quick.appendChild(mix);
    const valid = misses.map(findMiss).filter(Boolean);
    const mb = h("button", "ghost", "🔁 My mistakes (" + valid.length + ")");
    mb.disabled = !valid.length;
    mb.onclick = () => startRound("🔁 My mistakes", shuffle(valid).slice(0, ROUND), null);
    quick.appendChild(mb);
    const lis = h("button", "ghost", "🎧 Listening (10)");
    lis.title = "Hear a sentence, type what you heard";
    lis.onclick = () => startRound("🎧 Listening", dictRound(), null, dictRound);
    quick.appendChild(lis);
    const vd = h("span", "ex-verb");
    const tsel = h("select");
    [["all", "all tenses"], ["presente", "presente"], ["passato", "passato prossimo"], ["imperfetto", "imperfetto"], ["futuro", "futuro"]]
      .forEach(([v, t]) => tsel.appendChild(new Option(t, v)));
    tsel.value = conjTense;
    tsel.onchange = () => { conjTense = tsel.value; save("parla_ex_conjtense", conjTense); };
    const vb = h("button", "ghost", "🔁 Verb drill");
    vb.title = "Endless conjugation practice — 50 verbs from your sheets";
    vb.onclick = () => startRound("🔁 Verb drill · " + tsel.options[tsel.selectedIndex].text, conjRound(), null, conjRound);
    vd.appendChild(vb); vd.appendChild(tsel);
    quick.appendChild(vd);
    p.appendChild(quick);

    const groups = [...new Set(EX_SETS.map(s => s.group))];
    groups.forEach(g => {
      const box = h("div", "ex-group");
      box.appendChild(h("h3", null, g));
      const grid = h("div", "ex-grid");
      EX_SETS.filter(s => s.group === g).forEach(s => {
        const c = h("button", "ex-card");
        c.appendChild(h("span", "t", s.title));
        const n = (s.items || s.vocab).length;
        c.appendChild(h("span", "s", `${s.level} · ${n} ${s.vocab ? "words" : "questions"} · ${s.sheet}`));
        const sc = scores[s.id];
        c.appendChild(h("span", "b" + (sc ? "" : " none"), sc ? `Best ${sc.best}%  ·  last ${sc.last}%` : "Not tried yet"));
        c.onclick = () => startRound(s.title, shuffle(questionsFor(s)).slice(0, ROUND), s);
        grid.appendChild(c);
      });
      box.appendChild(grid);
      p.appendChild(box);
    });
    window.scrollTo(0, 0);
  }
  function findMiss(k) {
    const [id, key] = k.split("#");
    const s = setById(id);
    return s ? questionsFor(s).find(q => q.key === key) : null;
  }

  /* ---------- a round ---------- */
  function startRound(title, qs, set, regen) {
    if (!qs.length) return;
    round = { title, set, regen, qs, i: 0, right: 0, wrong: [], answered: false };
    showQuestion();
  }
  function showQuestion() {
    const r = round, q = r.qs[r.i];
    r.answered = false;
    stopMic();
    const p = panel(); p.innerHTML = "";
    p.appendChild(header(r.title, "✕ Stop", showMenu));
    const card = h("div", "ex-q");
    const meta = h("div", "ex-meta");
    meta.appendChild(h("span", null, `Question ${r.i + 1} of ${r.qs.length}`));
    meta.appendChild(h("span", null, "📄 " + q.set.sheet));
    card.appendChild(meta);
    const bar = h("div", "ex-bar"); const fill = h("div"); fill.style.width = (r.i / r.qs.length * 100) + "%"; bar.appendChild(fill); card.appendChild(bar);

    // prompt
    if (q.t === "dict") {
      card.appendChild(h("div", "ex-hint", "🎧 Listen, then type exactly what you hear."));
      const lr = h("div", "row");
      const play = h("button", "primary", "▶ Play"); play.onclick = () => speakParts([{ text: q.s }], { autoListen: false });
      const slow = h("button", "ghost", "🐢 Slowly"); slow.onclick = () => speakParts([{ text: q.s, rate: 0.65 }], { autoListen: false });
      lr.appendChild(play); lr.appendChild(slow);
      card.appendChild(lr);
      setTimeout(() => speakParts([{ text: q.s }], { autoListen: false }), 300);
    }
    else if (q.ask) card.appendChild(h("div", "ex-hint", q.ask));
    else if (q.t === "conj") card.appendChild(h("div", "ex-hint", "Conjugate:"));
    else if (q.t === "tr") card.appendChild(h("div", "ex-hint", q.voc ? "Type it in Italian:" : "Say it in Italian (type your answer):"));
    const pr = h("div", "ex-prompt" + (q.t === "dict" ? " hidden" : ""));
    const parts = q.q.split("___");
    parts.forEach((t, i) => { pr.appendChild(document.createTextNode(t)); if (i < parts.length - 1) pr.appendChild(h("span", "gap", "?")); });
    card.appendChild(pr);
    if ((q.h || q.en) && q.t !== "dict") {
      const hint = h("div", "ex-hint");
      if (q.h) { const b = h("b", null, "(" + q.h + ")"); hint.appendChild(b); hint.appendChild(document.createTextNode(q.en ? "  " : "")); }
      if (q.en) hint.appendChild(document.createTextNode(q.en));
      card.appendChild(hint);
    }
    const fb = h("div"); fb.style.display = "none";
    const actions = h("div", "ex-actions");
    const next = h("button", "primary", r.i + 1 < r.qs.length ? "Next →" : "See results");
    next.style.display = "none";
    next.onclick = () => { r.i++; if (r.i < r.qs.length) showQuestion(); else showSummary(); };

    if (q.t === "mc") {
      const opts = h("div", "ex-opts");
      shuffle(q.o.map((o, i) => ({ o, i }))).forEach(({ o, i }) => {
        const b = h("button", null, o);
        b.onclick = () => {
          if (r.answered) return;
          [...opts.children].forEach(x => { x.disabled = true; if (x.dataset.i === "0") x.classList.add("right"); });
          if (i !== 0) b.classList.add("wrong");
          answer(q, i === 0, null, fb, next, o);
        };
        b.dataset.i = i;
        opts.appendChild(b);
      });
      card.appendChild(opts);
    } else {
      const row = h("div", "ex-inrow");
      const inp = h("input", "ex-in");
      Object.assign(inp, { type: "text", autocomplete: "off", spellcheck: false, placeholder: "Scrivi qui…" });
      inp.setAttribute("autocapitalize", "off"); inp.setAttribute("autocorrect", "off"); inp.lang = "it";
      const chk = h("button", "primary", "Check");
      const doCheck = () => {
        if (r.answered) { next.click(); return; }
        if (!inp.value.trim()) { inp.focus(); return; }
        const m = markTyped(q, inp.value);
        inp.disabled = true; chk.disabled = true;
        answer(q, m.ok, m.note, fb, next, inp.value);
      };
      chk.onclick = doCheck;
      inp.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); doCheck(); } });
      row.appendChild(inp); row.appendChild(chk);
      if (q.t !== "dict" && navigator.mediaDevices && window.MediaRecorder) {
        const mic = h("button", "ghost", "🎤");
        mic.title = q.t === "gap" ? "Say the whole sentence instead of typing" : "Say your answer instead of typing";
        mic.onclick = () => {
          if (r.answered) return;
          if (recognizing) { stopRecording(); mic.textContent = "…"; return; }
          speechSynthesis.cancel();
          heardHandler = (text, err) => {
            mic.textContent = "🎤"; mic.classList.remove("rec");
            if (r.answered || round !== r) return;
            if (!text) { micNote.textContent = err ? "⚠️ " + err : "Didn't catch that — tap 🎤 and try again."; return; }
            const m = markSpoken(q, text);
            inp.value = text; inp.disabled = true; chk.disabled = true;
            answer(q, m.ok, m.note, fb, next, text, "🎤 Heard: “" + text + "”");
          };
          micNote.textContent = q.t === "gap" ? "Listening… say the whole sentence." : "Listening…";
          mic.textContent = "■"; mic.classList.add("rec");
          recordMode = "exercise";
          startRecording();
        };
        row.appendChild(mic);
      }
      card.appendChild(row);
      const micNote = h("div", "ex-hint");
      card.appendChild(micNote);
      const acc = h("div", "ex-acc");
      ["à", "è", "é", "ì", "ò", "ù", "'"].forEach(ch => {
        const b = h("button", "ghost", ch);
        b.onclick = () => { const s = inp.selectionStart ?? inp.value.length, e = inp.selectionEnd ?? s; inp.value = inp.value.slice(0, s) + ch + inp.value.slice(e); inp.focus(); inp.setSelectionRange(s + 1, s + 1); };
        acc.appendChild(b);
      });
      card.appendChild(acc);
      const skip = h("button", "ghost", "I don't know");
      skip.onclick = () => { if (r.answered) return; inp.disabled = true; chk.disabled = true; answer(q, false, null, fb, next, ""); };
      actions.appendChild(skip);
      setTimeout(() => inp.focus(), 50);
    }
    card.appendChild(fb);
    actions.appendChild(next);
    card.appendChild(actions);
    p.appendChild(card);
    window.scrollTo(0, 0);
  }

  function answer(q, ok, note, fb, next, given, heardNote) {
    const r = round;
    r.answered = true;
    stopMic();
    const mk = q.set.id + "#" + q.key;
    if (ok) {
      r.right++;
      if (!q.set.virtual) misses = misses.filter(k => k !== mk);
    } else {
      r.wrong.push({ q, given });
      if (!q.set.virtual && !misses.includes(mk)) misses.push(mk);
    }
    save(LS_MISS, misses);
    try { bumpActivity(); } catch {}

    const full = fullSentence(q);
    const correctText = q.t === "mc" ? q.o[0] : q.a[0];
    fb.className = "ex-fb " + (ok ? "ok" : "no");
    fb.innerHTML = "";
    if (heardNote) fb.appendChild(h("div", "x", heardNote));
    const line = h("div", null, ok ? "✓ Giusto!" + (note ? "  " + note : "") : q.t === "dict" ? "✗ Not quite — the words you missed are highlighted:" : (given ? "✗ Not quite — the answer is: " : "The answer is: ") + correctText + " ");
    fb.appendChild(line);
    if (q.t === "dict") { const d = diffWords(full, given || ""); d.appendChild(document.createTextNode(" ")); d.appendChild(makeReplay(full)); fb.appendChild(d); fb.appendChild(h("div", "x", q.en)); }
    else if (full && !ok && full === correctText) line.appendChild(makeReplay(sayable(full)));
    else if (full) { const f = h("div", "full", full + " "); f.appendChild(makeReplay(sayable(full))); fb.appendChild(f); }
    if (q.x) fb.appendChild(h("div", "x", "💡 " + q.x));
    fb.style.display = "";
    next.style.display = "";
    next.focus();

    // Missed items become flashcards in the existing spaced-repetition notebook.
    if (!ok) {
      try {
        if (q.pair) saveVocabItem(q.pair[0], q.pair[1]);
        else if (full && q.en) saveVocabItem(full, q.en);
        else if (full && q.t === "tr") saveVocabItem(full, q.q);
      } catch {}
    }
    if (autoRead && full && q.t !== "dict") speakParts([{ text: sayable(full), rate: 0.9 }], { autoListen: false });
  }

  function showSummary() {
    const r = round;
    const pct = Math.round(r.right / r.qs.length * 100);
    if (r.set) {
      const prev = scores[r.set.id];
      scores[r.set.id] = { best: Math.max(pct, prev ? prev.best : 0), last: pct, when: Date.now() };
      save(LS_SCORES, scores);
    }
    const p = panel(); p.innerHTML = "";
    p.appendChild(header(r.title, "← All exercises", showMenu));
    const card = h("div", "ex-q ex-sum");
    card.appendChild(h("div", "big", `${r.right} / ${r.qs.length}  ·  ${pct}%`));
    card.appendChild(h("div", "ex-hint", pct === 100 ? "Perfetto! Tutto giusto." : pct >= 75 ? "Molto bene!" : pct >= 50 ? "Non male — have another go at the ones you missed." : "Keep at it — try the missed ones again, then re-read the sheet."));
    if (r.wrong.length) {
      card.appendChild(h("div", "ex-hint", "To review (also saved to 📇 Your words):"));
      const ul = h("ul");
      r.wrong.forEach(({ q }) => {
        const li = h("li", null, (fullSentence(q) || (q.t === "mc" ? q.o[0] : q.a[0])) + (q.t === "mc" && !q.q.includes("___") && !q.itOpts && !q.pair ? "  ←  " + q.q : "") + " ");
        const f = fullSentence(q); if (f) li.appendChild(makeReplay(sayable(f)));
        ul.appendChild(li);
      });
      card.appendChild(ul);
    }
    const acts = h("div", "ex-actions");
    if (backToCard) {
      const bc = h("button", "ghost", "📚 Back to the card");
      const fn = backToCard;
      bc.onclick = () => { close(); fn(); };
      acts.appendChild(bc);
    }
    if (r.wrong.length) {
      const again = h("button", "ghost", "🔁 Retry the " + r.wrong.length + " I missed");
      again.onclick = () => startRound(r.title + " — retry", shuffle(r.wrong.map(w => w.q)), null);
      acts.appendChild(again);
    }
    if (r.regen) {
      const more = h("button", "primary", "↻ Another round");
      more.onclick = () => startRound(r.title, r.regen(), null, r.regen);
      acts.appendChild(more);
    }
    if (r.set) {
      const more = h("button", "ghost", "↻ New round");
      more.onclick = () => startRound(r.set.title, shuffle(questionsFor(r.set)).slice(0, ROUND), r.set);
      acts.appendChild(more);
      if (r.set.topic && typeof TOPICS !== "undefined" && TOPICS[r.set.topic]) {
        const talk = h("button", "primary", "🗣 Practise it with Giulia");
        talk.title = "Open the matching conversation topic";
        talk.onclick = () => {
          const sel = el("topicSel");
          close();
          sel.value = r.set.topic;
          sel.dispatchEvent(new Event("change"));
        };
        acts.appendChild(talk);
      }
    }
    card.appendChild(acts);
    p.appendChild(card);
    window.scrollTo(0, 0);
  }

  /* ---------- hook up ---------- */
  const btn = el("exBtn");
  if (btn) btn.addEventListener("click", open);
  let backToCard = null;              // set when a round is started from a 📚 card
  function openSet(id, onBackToCard) {
    const s = setById(id);
    if (!s) return;
    open();
    backToCard = onBackToCard || null;
    startRound(s.title, shuffle(questionsFor(s)).slice(0, ROUND), s);
  }
  window.ParlaExercises = {
    open, close, openSet, sets: EX_SETS, questionsFor, markTyped, markSpoken, fullSentence, dictationItems,
    heard: (text, err) => { const fn = heardHandler; heardHandler = null; if (fn) fn(text, err); },
  };
})();
