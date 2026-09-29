/* Parla — content merged from Grammatica (E:\\Italia Grammar, v1.6): verb tables checked against
   Wiktionary, ending patterns, the 15 grammar lessons, the Start-here guide, the charts list and the
   four vocabulary situations (source of truth: Vocab-Sheets.xlsx). Copied verbatim — edit here.
   (classic script; everything lives inside GRAM so nothing clashes with Parla's own names) */
const GRAM = (() => {
const PRONOUNS = ["io","tu","lui / lei","noi","voi","loro"];

const REGULAR = [
  {inf:"parlare", gloss:"to speak", badge:"-are", aux:"avere", part:"parlato",
    presente:["parlo","parli","parla","parliamo","parlate","parlano"],
    imperfetto:["parlavo","parlavi","parlava","parlavamo","parlavate","parlavano"],
    futuro:["parlerò","parlerai","parlerà","parleremo","parlerete","parleranno"],
    condizionale:["parlerei","parleresti","parlerebbe","parleremmo","parlereste","parlerebbero"],
    congiuntivo:["parli","parli","parli","parliamo","parliate","parlino"]},
  {inf:"credere", gloss:"to believe", badge:"-ere", aux:"avere", part:"creduto",
    presente:["credo","credi","crede","crediamo","credete","credono"],
    imperfetto:["credevo","credevi","credeva","credevamo","credevate","credevano"],
    futuro:["crederò","crederai","crederà","crederemo","crederete","crederanno"],
    condizionale:["crederei","crederesti","crederebbe","crederemmo","credereste","crederebbero"],
    congiuntivo:["creda","creda","creda","crediamo","crediate","credano"]},
  {inf:"dormire", gloss:"to sleep", badge:"-ire", aux:"avere", part:"dormito",
    presente:["dormo","dormi","dorme","dormiamo","dormite","dormono"],
    imperfetto:["dormivo","dormivi","dormiva","dormivamo","dormivate","dormivano"],
    futuro:["dormirò","dormirai","dormirà","dormiremo","dormirete","dormiranno"],
    condizionale:["dormirei","dormiresti","dormirebbe","dormiremmo","dormireste","dormirebbero"],
    congiuntivo:["dorma","dorma","dorma","dormiamo","dormiate","dormano"]},
  {inf:"capire", gloss:"to understand", badge:"-ire (isc)", aux:"avere", part:"capito",
    presente:["capisco","capisci","capisce","capiamo","capite","capiscono"],
    imperfetto:["capivo","capivi","capiva","capivamo","capivate","capivano"],
    futuro:["capirò","capirai","capirà","capiremo","capirete","capiranno"],
    condizionale:["capirei","capiresti","capirebbe","capiremmo","capireste","capirebbero"],
    congiuntivo:["capisca","capisca","capisca","capiamo","capiate","capiscano"]}
];

const IRREGULAR = [
  {inf:"essere", gloss:"to be", aux:"essere", part:"stato",
    presente:["sono","sei","è","siamo","siete","sono"],
    imperfetto:["ero","eri","era","eravamo","eravate","erano"],
    futuro:["sarò","sarai","sarà","saremo","sarete","saranno"],
    condizionale:["sarei","saresti","sarebbe","saremmo","sareste","sarebbero"],
    congiuntivo:["sia","sia","sia","siamo","siate","siano"]},
  {inf:"avere", gloss:"to have", aux:"avere", part:"avuto",
    presente:["ho","hai","ha","abbiamo","avete","hanno"],
    imperfetto:["avevo","avevi","aveva","avevamo","avevate","avevano"],
    futuro:["avrò","avrai","avrà","avremo","avrete","avranno"],
    condizionale:["avrei","avresti","avrebbe","avremmo","avreste","avrebbero"],
    congiuntivo:["abbia","abbia","abbia","abbiamo","abbiate","abbiano"]},
  {inf:"fare", gloss:"to do / make", aux:"avere", part:"fatto",
    presente:["faccio","fai","fa","facciamo","fate","fanno"],
    imperfetto:["facevo","facevi","faceva","facevamo","facevate","facevano"],
    futuro:["farò","farai","farà","faremo","farete","faranno"],
    condizionale:["farei","faresti","farebbe","faremmo","fareste","farebbero"],
    congiuntivo:["faccia","faccia","faccia","facciamo","facciate","facciano"]},
  {inf:"andare", gloss:"to go", aux:"essere", part:"andato",
    presente:["vado","vai","va","andiamo","andate","vanno"],
    imperfetto:["andavo","andavi","andava","andavamo","andavate","andavano"],
    futuro:["andrò","andrai","andrà","andremo","andrete","andranno"],
    condizionale:["andrei","andresti","andrebbe","andremmo","andreste","andrebbero"],
    congiuntivo:["vada","vada","vada","andiamo","andiate","vadano"]},
  {inf:"stare", gloss:"to stay / be", aux:"essere", part:"stato",
    presente:["sto","stai","sta","stiamo","state","stanno"],
    imperfetto:["stavo","stavi","stava","stavamo","stavate","stavano"],
    futuro:["starò","starai","starà","staremo","starete","staranno"],
    condizionale:["starei","staresti","starebbe","staremmo","stareste","starebbero"],
    congiuntivo:["stia","stia","stia","stiamo","stiate","stiano"]},
  {inf:"dare", gloss:"to give", aux:"avere", part:"dato",
    presente:["do","dai","dà","diamo","date","danno"],
    imperfetto:["davo","davi","dava","davamo","davate","davano"],
    futuro:["darò","darai","darà","daremo","darete","daranno"],
    condizionale:["darei","daresti","darebbe","daremmo","dareste","darebbero"],
    congiuntivo:["dia","dia","dia","diamo","diate","diano"]},
  {inf:"dire", gloss:"to say / tell", aux:"avere", part:"detto",
    presente:["dico","dici","dice","diciamo","dite","dicono"],
    imperfetto:["dicevo","dicevi","diceva","dicevamo","dicevate","dicevano"],
    futuro:["dirò","dirai","dirà","diremo","direte","diranno"],
    condizionale:["direi","diresti","direbbe","diremmo","direste","direbbero"],
    congiuntivo:["dica","dica","dica","diciamo","diciate","dicano"]},
  {inf:"potere", gloss:"to be able / can", aux:"avere", part:"potuto",
    presente:["posso","puoi","può","possiamo","potete","possono"],
    imperfetto:["potevo","potevi","poteva","potevamo","potevate","potevano"],
    futuro:["potrò","potrai","potrà","potremo","potrete","potranno"],
    condizionale:["potrei","potresti","potrebbe","potremmo","potreste","potrebbero"],
    congiuntivo:["possa","possa","possa","possiamo","possiate","possano"]},
  {inf:"volere", gloss:"to want", aux:"avere", part:"voluto",
    presente:["voglio","vuoi","vuole","vogliamo","volete","vogliono"],
    imperfetto:["volevo","volevi","voleva","volevamo","volevate","volevano"],
    futuro:["vorrò","vorrai","vorrà","vorremo","vorrete","vorranno"],
    condizionale:["vorrei","vorresti","vorrebbe","vorremmo","vorreste","vorrebbero"],
    congiuntivo:["voglia","voglia","voglia","vogliamo","vogliate","vogliano"]},
  {inf:"dovere", gloss:"to have to / must", aux:"avere", part:"dovuto",
    presente:["devo","devi","deve","dobbiamo","dovete","devono"],
    imperfetto:["dovevo","dovevi","doveva","dovevamo","dovevate","dovevano"],
    futuro:["dovrò","dovrai","dovrà","dovremo","dovrete","dovranno"],
    condizionale:["dovrei","dovresti","dovrebbe","dovremmo","dovreste","dovrebbero"],
    congiuntivo:["debba","debba","debba","dobbiamo","dobbiate","debbano"]},
  {inf:"sapere", gloss:"to know", aux:"avere", part:"saputo",
    presente:["so","sai","sa","sappiamo","sapete","sanno"],
    imperfetto:["sapevo","sapevi","sapeva","sapevamo","sapevate","sapevano"],
    futuro:["saprò","saprai","saprà","sapremo","saprete","sapranno"],
    condizionale:["saprei","sapresti","saprebbe","sapremmo","sapreste","saprebbero"],
    congiuntivo:["sappia","sappia","sappia","sappiamo","sappiate","sappiano"]},
  {inf:"venire", gloss:"to come", aux:"essere", part:"venuto",
    presente:["vengo","vieni","viene","veniamo","venite","vengono"],
    imperfetto:["venivo","venivi","veniva","venivamo","venivate","venivano"],
    futuro:["verrò","verrai","verrà","verremo","verrete","verranno"],
    condizionale:["verrei","verresti","verrebbe","verremmo","verreste","verrebbero"],
    congiuntivo:["venga","venga","venga","veniamo","veniate","vengano"]},
  {inf:"uscire", gloss:"to go out", aux:"essere", part:"uscito",
    presente:["esco","esci","esce","usciamo","uscite","escono"],
    imperfetto:["uscivo","uscivi","usciva","uscivamo","uscivate","uscivano"],
    futuro:["uscirò","uscirai","uscirà","usciremo","uscirete","usciranno"],
    condizionale:["uscirei","usciresti","uscirebbe","usciremmo","uscireste","uscirebbero"],
    congiuntivo:["esca","esca","esca","usciamo","usciate","escano"]},
  {inf:"bere", gloss:"to drink", aux:"avere", part:"bevuto",
    presente:["bevo","bevi","beve","beviamo","bevete","bevono"],
    imperfetto:["bevevo","bevevi","beveva","bevevamo","bevevate","bevevano"],
    futuro:["berrò","berrai","berrà","berremo","berrete","berranno"],
    condizionale:["berrei","berresti","berrebbe","berremmo","berreste","berrebbero"],
    congiuntivo:["beva","beva","beva","beviamo","beviate","bevano"]}
];

const ALL = REGULAR.concat(IRREGULAR);
const AVERE = ["ho","hai","ha","abbiamo","avete","hanno"];
const ESSERE = ["sono","sei","è","siamo","siete","sono"];
function passato(v){
  const aux = v.aux === "essere" ? ESSERE : AVERE;
  return aux.map((a,i)=>{
    let p = v.part;
    if(v.aux === "essere")
      p = (i<3) ? v.part + " / " + v.part.slice(0,-1)+"a"
                : v.part.slice(0,-1)+"i / " + v.part.slice(0,-1)+"e";
    return a + " " + p;
  });
}
function formsFor(v, tense){ return tense === "passato" ? passato(v) : v[tense]; }

const ENDINGS = {
  presente:{cols:["-are","-ere","-ire","-ire (isc)"], rows:[
    ["-o","-o","-o","-isco"],["-i","-i","-i","-isci"],["-a","-e","-e","-isce"],
    ["-iamo","-iamo","-iamo","-iamo"],["-ate","-ete","-ite","-ite"],["-ano","-ono","-ono","-iscono"]]},
  imperfetto:{cols:["-are","-ere","-ire"], rows:[
    ["-avo","-evo","-ivo"],["-avi","-evi","-ivi"],["-ava","-eva","-iva"],
    ["-avamo","-evamo","-ivamo"],["-avate","-evate","-ivate"],["-avano","-evano","-ivano"]]},
  futuro:{cols:["-are","-ere","-ire"], rows:[
    ["-erò","-erò","-irò"],["-erai","-erai","-irai"],["-erà","-erà","-irà"],
    ["-eremo","-eremo","-iremo"],["-erete","-erete","-irete"],["-eranno","-eranno","-iranno"]]},
  condizionale:{cols:["-are","-ere","-ire"], rows:[
    ["-erei","-erei","-irei"],["-eresti","-eresti","-iresti"],["-erebbe","-erebbe","-irebbe"],
    ["-eremmo","-eremmo","-iremmo"],["-ereste","-ereste","-ireste"],["-erebbero","-erebbero","-irebbero"]]},
  congiuntivo:{cols:["-are","-ere","-ire","-ire (isc)"], rows:[
    ["-i","-a","-a","-isca"],["-i","-a","-a","-isca"],["-i","-a","-a","-isca"],
    ["-iamo","-iamo","-iamo","-iamo"],["-iate","-iate","-iate","-iate"],["-ino","-ano","-ano","-iscano"]]}
};
const TENSE_INTRO = {
  presente:"Endings added to the stem. io, tu and noi are identical in all three families.",
  imperfetto:"Very regular — theme vowel (a / e / i) then -vo, -vi, -va, -vamo, -vate, -vano.",
  futuro:"Infinitive minus final -e + shared endings -ò -ai -à -emo -ete -anno. capire → capirò. -are/-ere match; -ire swaps the vowel.",
  condizionale:"The 'would' form — same stem as the futuro + endings -ei -esti -ebbe -emmo -este -ebbero. -are/-ere match; -ire swaps the vowel.",
  congiuntivo:"Subjunctive (after penso che, voglio che…). io, tu and lui/lei are identical within each verb; noi -iamo and voi -iate are shared by all families."
};
const TENSE_TITLE = {presente:"Present",imperfetto:"Imperfetto",futuro:"Futuro",condizionale:"Condizionale",congiuntivo:"Congiuntivo"};
const tenseLabels = {presente:"Present", passato:"Passato prossimo", imperfetto:"Imperfetto", futuro:"Futuro", condizionale:"Condizionale", congiuntivo:"Congiuntivo"};

const CHARTS=[
  {g:"Everyday vocabulary", it:"I contenitori", en:"Containers", f:"charts/Containers Vocab.jpg"},
  {g:"Food & drink", it:"La frutta", en:"Fruit", f:"charts/La Frutta.jpg"},
  {g:"Food & drink", it:"Il caff\u00e8", en:"Coffee", f:"charts/Italian Coffee.jpg"},
  {g:"Food & drink", it:"I dolci", en:"Desserts", f:"charts/Italian deserts.jpg"},
  {g:"Food & drink", it:"Piatti di pasta", en:"Pasta dishes", f:"charts/Pasta Dishes.jpg"},
  {g:"Food & drink", it:"Formati di pasta", en:"Pasta shapes", f:"charts/Pasta Shapes.jpg"},
  {g:"Food & drink", it:"L'olio d'oliva", en:"Olive oil", f:"charts/Italian Olive Oil.jpg"},
  {g:"Food & drink", it:"I vini", en:"Wines", f:"charts/Itialian Vines.jpg"},
  {g:"Culture & travel", it:"Borghi toscani", en:"Tuscan hilltop villages", f:"charts/Italian Villages.jpg"},
  {g:"Culture & travel", it:"In treno da Bologna", en:"Train trips from Bologna", f:"charts/Bologna Train Journeys.jpg"},
  {g:"Verbs", it:"I verbi", en:"Italian verbs", f:"charts/Italian Verbs.jpg"},
  {g:"Verbs", it:"Verbi d'azione", en:"Action verbs", f:"charts/Action Words.jpg"},
  {g:"Verbs", it:"Essere, fare, avere", en:"three key verbs", f:"charts/Essere Fare Avere.jpg"},
  {g:"Verbs", it:"Essere e avere", en:"to be / to have", f:"charts/Essere and Avere.jpg"},
  {g:"Verbs", it:"Essere vs stare", en:"two ways to say 'to be'", f:"charts/Essere Vs Stare.jpg"},
  {g:"Verbs", it:"Stare", en:"to stay / to be", f:"charts/Stare.jpg"},
  {g:"Grammar", it:"Gli articoli", en:"Articles", f:"charts/Italian articles.jpg"},
  {g:"Grammar", it:"Le preposizioni", en:"Prepositions", f:"charts/Propositions.jpg"},
  {g:"Grammar", it:"Di, a, da, in, con", en:"prepositions in use", f:"charts/Di A Da In Con.jpg"},
  {g:"Grammar", it:"Lo, la, li, le", en:"direct object pronouns", f:"charts/Lo La Li Le.jpg"},
  {g:"Grammar", it:"Mi, ti, gli", en:"object pronouns", f:"charts/Mi Ti Gli.jpg"},
  {g:"Grammar", it:"Ne e ci", en:"ne and ci", f:"charts/Ne And Ce.jpg"},
  {g:"Grammar", it:"C'\u00e8 vs ci sono", en:"there is / there are", f:"charts/Ce Vs Ci Sono.jpg"},
  {g:"Grammar", it:"Aggettivi possessivi", en:"Possessive adjectives", f:"charts/Possesive Adjectives.jpg"},
  {g:"Grammar", it:"Dopo vs dopo che", en:"'after'", f:"charts/Dopo Vs Dopo Che.jpg"},
  {g:"Grammar", it:"Mentre vs durante", en:"'while / during'", f:"charts/Mentre Durante.jpg"},
  {g:"Grammar", it:"Imperfetto e passato prossimo", en:"past tenses", f:"charts/Imperfect and Perfect tense.jpg"},
  {g:"Grammar", it:"Vado a / al / in", en:"going places", f:"charts/Vado.PNG"},
  {g:"Food & drink", it:"Il pane", en:"Bread", f:"charts/Italian Bread.jpg"},
  {g:"Verbs", it:"Essere — indicativo", en:"'to be', all tenses", f:"charts/essere.jpg"},
  {g:"Verbs", it:"Verbi comuni", en:"key verbs conjugated", f:"charts/Sono Faccio verbs.jpg"},
  {g:"Verbs", it:"Sarà, avrà…", en:"future for guessing", f:"charts/Sara verbs.jpg"},
  {g:"Grammar", it:"Ci vuole vs ci vogliono", en:"how long it takes", f:"charts/Voule Voglinono Verbs.jpg"},
  {g:"Verbs", it:"Verbi al presente", en:"12 regular verbs in the present", f:"charts/Present tenses.jpg"},
  {g:"Verbs", it:"Congiuntivo presente", en:"present subjunctive", f:"charts/present subjective.jpg"}
];
const V_ORDER = ["directions", "shopping", "meeting", "cafe"];
const VOCAB = {"directions": {"menu": "Directions","desc": "Getting around · station & train","short": "Directions / station","words": [{"it": "la strada","en": "the road / street"},{"it": "la via","en": "the street"},{"it": "la piazza","en": "the square"},{"it": "l'incrocio","en": "the crossroads / junction"},{"it": "il semaforo","en": "the traffic light"},{"it": "l'angolo","en": "the corner"},{"it": "il marciapiede","en": "the pavement"},{"it": "il ponte","en": "the bridge"},{"it": "la rotonda","en": "the roundabout"},{"it": "la mappa","en": "the map"},{"it": "la cartina","en": "the (street) map"},{"it": "la destra","en": "the right"},{"it": "la sinistra","en": "the left"},{"it": "dritto","en": "straight on"},{"it": "il centro","en": "the centre"},{"it": "il centro città","en": "the city centre"},{"it": "la periferia","en": "the outskirts"},{"it": "il quartiere","en": "the neighbourhood"},{"it": "vicino","en": "near"},{"it": "lontano","en": "far"},{"it": "qui","en": "here"},{"it": "lì","en": "there"},{"it": "la fermata","en": "the (bus/tram) stop"},{"it": "l'autobus","en": "the bus"},{"it": "il tram","en": "the tram"},{"it": "la metropolitana","en": "the underground"},{"it": "la metro","en": "the metro (short)"},{"it": "il taxi","en": "the taxi"},{"it": "il parcheggio","en": "the car park"},{"it": "l'uscita","en": "the exit"},{"it": "l'entrata","en": "the entrance"},{"it": "il nord","en": "the north"},{"it": "il sud","en": "the south"},{"it": "l'est","en": "the east"},{"it": "l'ovest","en": "the west"},{"it": "la chiesa","en": "the church"},{"it": "il duomo","en": "the cathedral"},{"it": "il museo","en": "the museum"},{"it": "la banca","en": "the bank"},{"it": "la posta","en": "the post office"},{"it": "la farmacia","en": "the pharmacy"},{"it": "l'ospedale","en": "the hospital"},{"it": "il negozio","en": "the shop"},{"it": "il supermercato","en": "the supermarket"},{"it": "il ristorante","en": "the restaurant"},{"it": "il bar","en": "the café / bar"},{"it": "l'albergo","en": "the hotel"},{"it": "il bagno","en": "the toilet"},{"it": "l'indirizzo","en": "the address"},{"it": "la direzione","en": "the direction"},{"it": "la stazione","en": "the station"},{"it": "la stazione ferroviaria","en": "the railway station"},{"it": "il treno","en": "the train"},{"it": "il binario","en": "the platform / track"},{"it": "il biglietto","en": "the ticket"},{"it": "la biglietteria","en": "the ticket office"},{"it": "il biglietto di andata","en": "the single ticket"},{"it": "il biglietto di andata e ritorno","en": "the return ticket"},{"it": "la macchinetta","en": "the ticket machine"},{"it": "l'orario","en": "the timetable"},{"it": "la partenza","en": "the departure"},{"it": "l'arrivo","en": "the arrival"},{"it": "il ritardo","en": "the delay"},{"it": "la coincidenza","en": "the connection"},{"it": "il posto","en": "the seat"},{"it": "la prenotazione","en": "the reservation"},{"it": "la prima classe","en": "first class"},{"it": "la seconda classe","en": "second class"},{"it": "la carrozza","en": "the carriage"},{"it": "il capotreno","en": "the train guard"},{"it": "il controllore","en": "the ticket inspector"},{"it": "il passeggero","en": "the passenger"},{"it": "il bagaglio","en": "the luggage"},{"it": "la valigia","en": "the suitcase"},{"it": "lo zaino","en": "the rucksack"},{"it": "la sala d'attesa","en": "the waiting room"},{"it": "il deposito bagagli","en": "the left-luggage office"},{"it": "l'ascensore","en": "the lift"},{"it": "le scale","en": "the stairs"},{"it": "la scala mobile","en": "the escalator"},{"it": "il regionale","en": "the regional train"},{"it": "l'alta velocità","en": "the high-speed train"},{"it": "il percorso","en": "the route"},{"it": "la distanza","en": "the distance"},{"it": "andare","en": "to go"},{"it": "venire","en": "to come"},{"it": "girare","en": "to turn"},{"it": "continuare","en": "to continue"},{"it": "attraversare","en": "to cross"},{"it": "tornare","en": "to go back"},{"it": "prendere","en": "to take / catch"},{"it": "scendere","en": "to get off"},{"it": "salire","en": "to get on"},{"it": "cambiare","en": "to change"},{"it": "arrivare","en": "to arrive"},{"it": "partire","en": "to depart / leave"},{"it": "aspettare","en": "to wait"},{"it": "perdere","en": "to miss (a train)"},{"it": "perdersi","en": "to get lost"},{"it": "chiedere","en": "to ask"}],"phrases": [{"it": "Mi scusi, dov'è la stazione / il bagno / la fermata dell'autobus?","en": "Excuse me, where is the station / the toilet / the bus stop?"},{"it": "Come si arriva al centro / al duomo / all'albergo?","en": "How do I get to the centre / the cathedral / the hotel?"},{"it": "È lontano / vicino da qui?","en": "Is it far / near from here?"},{"it": "Quanto tempo ci vuole a piedi / in autobus / in treno?","en": "How long does it take on foot / by bus / by train?"},{"it": "Posso andare a piedi?","en": "Can I go on foot?"},{"it": "Vada sempre dritto.","en": "Go straight on."},{"it": "Giri a destra / a sinistra.","en": "Turn right / left."},{"it": "Al semaforo / All'incrocio giri a destra.","en": "At the traffic light / crossroads, turn right."},{"it": "Attraversi la strada / il ponte / la piazza.","en": "Cross the road / the bridge / the square."},{"it": "È in fondo alla strada / alla via.","en": "It's at the end of the street / road."},{"it": "È sulla destra / sulla sinistra.","en": "It's on the right / left."},{"it": "È qui vicino.","en": "It's nearby."},{"it": "C'è una banca / una farmacia / un supermercato qui vicino?","en": "Is there a bank / pharmacy / supermarket nearby?"},{"it": "Sto cercando questo indirizzo / questo museo / questo albergo.","en": "I'm looking for this address / museum / hotel."},{"it": "Può mostrarmelo sulla mappa?","en": "Can you show me on the map?"},{"it": "Mi sono perso. / Mi sono persa.","en": "I'm lost. (m / f)"},{"it": "Prendo l'autobus / il tram / la metro?","en": "Do I take the bus / the tram / the metro?"},{"it": "Dove devo scendere / salire / cambiare?","en": "Where do I get off / get on / change?"},{"it": "A che ora parte / arriva il treno?","en": "What time does the train leave / arrive?"},{"it": "A che ora parte il treno per Firenze / Roma / Napoli?","en": "What time is the train to Florence / Rome / Naples?"},{"it": "Da quale binario parte?","en": "Which platform does it leave from?"},{"it": "Un biglietto / Due biglietti per Roma, per favore.","en": "One ticket / Two tickets to Rome, please."},{"it": "Andata e ritorno / Solo andata, per favore.","en": "Return / Single only, please."},{"it": "Vorrei un biglietto di prima / seconda classe.","en": "I'd like a first- / second-class ticket."},{"it": "Quanto costa il biglietto?","en": "How much is the ticket?"},{"it": "Devo cambiare treno?","en": "Do I have to change trains?"},{"it": "Questo treno ferma a Pisa / a Bologna?","en": "Does this train stop at Pisa / Bologna?"},{"it": "È in orario?","en": "Is it on time?"},{"it": "Il treno è in ritardo.","en": "The train is late."},{"it": "Ho perso il treno / la coincidenza.","en": "I've missed the train / the connection."},{"it": "È libero questo posto?","en": "Is this seat free?"},{"it": "Questo è il mio posto.","en": "This is my seat."},{"it": "Scusi, è questo il treno per Napoli?","en": "Excuse me, is this the train to Naples?"},{"it": "Dove posso comprare i biglietti?","en": "Where can I buy tickets?"},{"it": "Vorrei prenotare un posto.","en": "I'd like to reserve a seat."},{"it": "Dov'è la sala d'attesa / il deposito bagagli?","en": "Where is the waiting room / the left-luggage office?"},{"it": "Dove sono le scale / l'ascensore / la scala mobile?","en": "Where are the stairs / the lift / the escalator?"},{"it": "Può ripetere, per favore?","en": "Can you repeat that, please?"},{"it": "Può parlare più lentamente?","en": "Can you speak more slowly?"},{"it": "Grazie mille, molto gentile.","en": "Thank you very much, very kind."}]},"shopping": {"menu": "Shopping","desc": "Clothes & food","short": "Shopping","words": [{"it": "il negozio","en": "the shop"},{"it": "il commesso / la commessa","en": "the shop assistant"},{"it": "il/la cliente","en": "the customer"},{"it": "la vetrina","en": "the shop window"},{"it": "il camerino","en": "the fitting room"},{"it": "la cassa","en": "the till / checkout"},{"it": "lo scontrino","en": "the receipt"},{"it": "il prezzo","en": "the price"},{"it": "i saldi","en": "the sales"},{"it": "lo sconto","en": "the discount"},{"it": "l'offerta","en": "the offer"},{"it": "i contanti","en": "cash"},{"it": "la carta di credito","en": "the credit card"},{"it": "il bancomat","en": "the debit card / cashpoint"},{"it": "la borsa","en": "the bag / handbag"},{"it": "il sacchetto","en": "the carrier bag"},{"it": "la taglia","en": "the size (clothes)"},{"it": "il numero","en": "the size (shoes)"},{"it": "il colore","en": "the colour"},{"it": "lo stile","en": "the style"},{"it": "bianco","en": "white"},{"it": "nero","en": "black"},{"it": "rosso","en": "red"},{"it": "blu","en": "blue"},{"it": "verde","en": "green"},{"it": "giallo","en": "yellow"},{"it": "rosa","en": "pink"},{"it": "grigio","en": "grey"},{"it": "marrone","en": "brown"},{"it": "azzurro","en": "light blue"},{"it": "i vestiti","en": "clothes"},{"it": "l'abito","en": "the suit / dress"},{"it": "il vestito","en": "the dress"},{"it": "la maglietta","en": "the T-shirt"},{"it": "il maglione","en": "the jumper"},{"it": "la camicia","en": "the shirt"},{"it": "la camicetta","en": "the blouse"},{"it": "i pantaloni","en": "the trousers"},{"it": "i jeans","en": "the jeans"},{"it": "la gonna","en": "the skirt"},{"it": "la giacca","en": "the jacket"},{"it": "il cappotto","en": "the coat"},{"it": "il giubbotto","en": "the (casual) jacket"},{"it": "le scarpe","en": "the shoes"},{"it": "gli stivali","en": "the boots"},{"it": "le scarpe da ginnastica","en": "the trainers"},{"it": "i calzini","en": "the socks"},{"it": "la cintura","en": "the belt"},{"it": "il cappello","en": "the hat"},{"it": "la sciarpa","en": "the scarf"},{"it": "i guanti","en": "the gloves"},{"it": "gli occhiali","en": "the glasses"},{"it": "il costume da bagno","en": "the swimsuit"},{"it": "il cibo","en": "the food"},{"it": "il pane","en": "the bread"},{"it": "il latte","en": "the milk"},{"it": "il formaggio","en": "the cheese"},{"it": "il burro","en": "the butter"},{"it": "le uova","en": "the eggs"},{"it": "la carne","en": "the meat"},{"it": "il pollo","en": "the chicken"},{"it": "il pesce","en": "the fish"},{"it": "il prosciutto","en": "the ham"},{"it": "la pasta","en": "the pasta"},{"it": "il riso","en": "the rice"},{"it": "la frutta","en": "the fruit"},{"it": "la verdura","en": "the vegetables"},{"it": "la mela","en": "the apple"},{"it": "la banana","en": "the banana"},{"it": "l'arancia","en": "the orange"},{"it": "il pomodoro","en": "the tomato"},{"it": "la patata","en": "the potato"},{"it": "l'insalata","en": "the salad / lettuce"},{"it": "la cipolla","en": "the onion"},{"it": "l'aglio","en": "the garlic"},{"it": "il limone","en": "the lemon"},{"it": "l'olio","en": "the oil"},{"it": "il sale","en": "the salt"},{"it": "lo zucchero","en": "the sugar"},{"it": "il caffè","en": "the coffee"},{"it": "il tè","en": "the tea"},{"it": "l'acqua","en": "the water"},{"it": "il vino","en": "the wine"},{"it": "la birra","en": "the beer"},{"it": "il succo","en": "the juice"},{"it": "la bottiglia","en": "the bottle"},{"it": "il chilo","en": "the kilo"},{"it": "l'etto","en": "the 100 grams"},{"it": "la fetta","en": "the slice"},{"it": "il pacco","en": "the packet"},{"it": "la scatola","en": "the box / tin"},{"it": "il mercato","en": "the market"},{"it": "comprare","en": "to buy"},{"it": "pagare","en": "to pay"},{"it": "costare","en": "to cost"},{"it": "provare","en": "to try on"},{"it": "cercare","en": "to look for"},{"it": "portare","en": "to wear / carry"},{"it": "prendere","en": "to take / have"},{"it": "vendere","en": "to sell"}],"phrases": [{"it": "Sto solo guardando, grazie.","en": "I'm just looking, thanks. (io)"},{"it": "Vorrei comprare una giacca.","en": "I'd like to buy a jacket. (io)"},{"it": "Quanto costa? / Quanto costano?","en": "How much is it? / How much are they? (costare, sing/plur)"},{"it": "Avete questo in un'altra taglia / un altro colore / un altro stile?","en": "Do you have this in another size / colour / style? (voi)"},{"it": "Che taglia porta?","en": "What size do you take? (lei — assistant asks)"},{"it": "Porto la taglia media.","en": "I take the medium size. (io)"},{"it": "Posso provarlo? / Posso provarli?","en": "Can I try it on? / Can I try them on?"},{"it": "Dov'è il camerino?","en": "Where is the fitting room?"},{"it": "Mi sta bene?","en": "Does it suit / fit me?"},{"it": "È troppo stretto / largo / corto / lungo.","en": "It's too tight / loose / short / long."},{"it": "Lo vedo in vetrina. / L'ho visto in vetrina.","en": "I see it in the window. / I saw it in the window. (present vs past)"},{"it": "Lo prendo. / Li prendo tutti e due.","en": "I'll take it. / I'll take both. (io)"},{"it": "Prende qualcos'altro?","en": "Anything else? (lei — assistant)"},{"it": "No, grazie, basta così.","en": "No thanks, that's all."},{"it": "Cerco un regalo per mia moglie / mio marito.","en": "I'm looking for a present for my wife / husband. (io)"},{"it": "Avete i saldi? C'è uno sconto?","en": "Do you have the sales on? Is there a discount? (voi)"},{"it": "Posso pagare con la carta / in contanti?","en": "Can I pay by card / in cash? (io)"},{"it": "Dov'è la cassa?","en": "Where is the till?"},{"it": "Mi dà lo scontrino, per favore?","en": "Could you give me the receipt, please? (lei)"},{"it": "Prendiamo due chili di mele.","en": "We'll take two kilos of apples. (noi)"},{"it": "Vorrei un etto di prosciutto.","en": "I'd like 100g of ham. (io)"},{"it": "Mi dia mezzo chilo di pomodori.","en": "Give me half a kilo of tomatoes. (lei — command)"},{"it": "Quanto viene in tutto?","en": "How much is it altogether?"},{"it": "Avete del pane fresco?","en": "Do you have any fresh bread? (voi)"},{"it": "Vendete anche il formaggio?","en": "Do you sell cheese too? (voi)"},{"it": "Questi pomodori sono maturi?","en": "Are these tomatoes ripe? (loro)"},{"it": "Le arance sono buone oggi.","en": "The oranges are good today. (loro)"},{"it": "Cosa mi consiglia?","en": "What do you recommend? (lei)"},{"it": "Compriamo qualcosa per cena.","en": "Let's buy something for dinner. (noi)"},{"it": "I bambini vogliono la frutta.","en": "The children want fruit. (loro)"},{"it": "Vengo qui ogni sabato.","en": "I come here every Saturday. (io)"},{"it": "Hai preso il latte?","en": "Did you get the milk? (tu, past)"},{"it": "Prendi tu il pane?","en": "Will you get the bread? (tu)"},{"it": "Non ho contanti, solo la carta.","en": "I don't have cash, only card. (io)"},{"it": "Costa troppo, è caro.","en": "It costs too much, it's expensive."},{"it": "Me ne dia due, per favore.","en": "Give me two (of them), please. (lei)"},{"it": "Ci vediamo alla cassa.","en": "See you at the till. (noi)"},{"it": "Posso cambiarlo? Non mi sta bene.","en": "Can I exchange it? It doesn't fit me. (io)"},{"it": "Avete un sacchetto, per favore?","en": "Do you have a bag, please? (voi)"},{"it": "Torno più tardi, grazie.","en": "I'll come back later, thanks. (io)"}]},"meeting": {"menu": "Greeting","desc": "Meeting people · family · plans","short": "Greeting","words": [{"it": "ciao","en": "hi / bye"},{"it": "salve","en": "hello (neutral)"},{"it": "buongiorno","en": "good morning"},{"it": "buonasera","en": "good evening"},{"it": "buonanotte","en": "good night"},{"it": "arrivederci","en": "goodbye"},{"it": "piacere","en": "pleased to meet you"},{"it": "il nome","en": "the (first) name"},{"it": "il cognome","en": "the surname"},{"it": "il signore","en": "the gentleman / sir"},{"it": "la signora","en": "the lady / madam"},{"it": "la signorina","en": "the young lady / miss"},{"it": "l'amico / l'amica","en": "the friend (m/f)"},{"it": "il ragazzo","en": "the boy / boyfriend"},{"it": "la ragazza","en": "the girl / girlfriend"},{"it": "la famiglia","en": "the family"},{"it": "i genitori","en": "the parents"},{"it": "il padre / il papà","en": "the father / dad"},{"it": "la madre / la mamma","en": "the mother / mum"},{"it": "il figlio","en": "the son"},{"it": "la figlia","en": "the daughter"},{"it": "i figli","en": "the children"},{"it": "il fratello","en": "the brother"},{"it": "la sorella","en": "the sister"},{"it": "il marito","en": "the husband"},{"it": "la moglie","en": "the wife"},{"it": "il nonno","en": "the grandfather"},{"it": "la nonna","en": "the grandmother"},{"it": "i nonni","en": "the grandparents"},{"it": "il nipote","en": "the grandson / nephew"},{"it": "la nipote","en": "the granddaughter / niece"},{"it": "lo zio","en": "the uncle"},{"it": "la zia","en": "the aunt"},{"it": "il cugino / la cugina","en": "the cousin"},{"it": "il fidanzato / la fidanzata","en": "the fiancé(e) / partner"},{"it": "il/la parente","en": "the relative"},{"it": "il bambino / la bambina","en": "the child (m/f)"},{"it": "il/la collega","en": "the colleague"},{"it": "il vicino / la vicina","en": "the neighbour"},{"it": "il lavoro","en": "the job / work"},{"it": "la casa","en": "the house / home"},{"it": "la città","en": "the city / town"},{"it": "il paese","en": "the country / village"},{"it": "la vacanza","en": "the holiday"},{"it": "l'età","en": "the age"},{"it": "l'anno","en": "the year"},{"it": "il compleanno","en": "the birthday"},{"it": "sposato / sposata","en": "married"},{"it": "single","en": "single"},{"it": "giovane","en": "young"},{"it": "anziano","en": "elderly"},{"it": "simpatico","en": "nice / likeable"},{"it": "gentile","en": "kind"},{"it": "felice","en": "happy"},{"it": "stanco","en": "tired"},{"it": "impegnato","en": "busy"},{"it": "libero","en": "free (available)"},{"it": "oggi","en": "today"},{"it": "domani","en": "tomorrow"},{"it": "dopodomani","en": "the day after tomorrow"},{"it": "ieri","en": "yesterday"},{"it": "stamattina","en": "this morning"},{"it": "stasera","en": "this evening"},{"it": "il fine settimana","en": "the weekend"},{"it": "la settimana","en": "the week"},{"it": "il mese","en": "the month"},{"it": "l'ora","en": "the hour / time"},{"it": "il momento","en": "the moment"},{"it": "lunedì","en": "Monday"},{"it": "martedì","en": "Tuesday"},{"it": "mercoledì","en": "Wednesday"},{"it": "giovedì","en": "Thursday"},{"it": "venerdì","en": "Friday"},{"it": "sabato","en": "Saturday"},{"it": "domenica","en": "Sunday"},{"it": "il numero di telefono","en": "the phone number"},{"it": "l'indirizzo","en": "the address"},{"it": "l'email","en": "the email"},{"it": "l'appuntamento","en": "the appointment / date"},{"it": "il messaggio","en": "the message / text"},{"it": "chiamarsi","en": "to be called"},{"it": "essere","en": "to be"},{"it": "avere","en": "to have"},{"it": "abitare","en": "to live"},{"it": "lavorare","en": "to work"},{"it": "stare","en": "to stay / be"},{"it": "conoscere","en": "to know (a person)"},{"it": "presentare","en": "to introduce"},{"it": "incontrare","en": "to meet"},{"it": "incontrarsi","en": "to meet (each other)"},{"it": "vedersi","en": "to see each other"},{"it": "sentirsi","en": "to be in touch"},{"it": "venire","en": "to come"},{"it": "rimanere","en": "to stay"},{"it": "tornare","en": "to return"},{"it": "piacere (a)","en": "to like / to please [verb]"},{"it": "parlare","en": "to speak"},{"it": "capire","en": "to understand"},{"it": "scrivere","en": "to write"},{"it": "telefonare","en": "to phone"}],"phrases": [{"it": "Ciao, come ti chiami?","en": "Hi, what's your name? (tu)"},{"it": "Come si chiama?","en": "What's your name? (lei — formal)"},{"it": "Mi chiamo Lewis, e tu? / e lei?","en": "My name is Lewis, and you? (informal / formal)"},{"it": "Piacere di conoscerti / conoscerla.","en": "Pleased to meet you. (tu / lei)"},{"it": "Come stai? / Come sta?","en": "How are you? (tu / lei)"},{"it": "Sto bene, grazie, e tu?","en": "I'm well, thanks, and you? (io / tu)"},{"it": "Di dove sei? / Di dov'è?","en": "Where are you from? (tu / lei)"},{"it": "Sono inglese, vengo da Londra.","en": "I'm English, I come from London. (io)"},{"it": "Parli inglese?","en": "Do you speak English? (tu)"},{"it": "Non capisco, può ripetere?","en": "I don't understand, can you repeat? (io / lei)"},{"it": "Siamo a Firenze in vacanza.","en": "We're in Florence on holiday. (noi)"},{"it": "Sei in vacanza a Firenze? / È in vacanza a Firenze?","en": "Are you on holiday in Florence? (tu / lei)"},{"it": "Rimaniamo qui una settimana.","en": "We're staying here a week. (noi)"},{"it": "Quanto tempo rimani / rimane qui?","en": "How long are you staying here? (tu / lei)"},{"it": "Abito a Firenze. Abiti qui?","en": "I live in Florence. Do you live here? (io / tu)"},{"it": "Hai fratelli o sorelle?","en": "Do you have brothers or sisters? (tu)"},{"it": "Ho un fratello e due sorelle.","en": "I have a brother and two sisters. (io)"},{"it": "Sei sposato / sposata?","en": "Are you married? (tu, m / f)"},{"it": "Siamo sposati da dieci anni.","en": "We've been married for ten years. (noi)"},{"it": "Avete figli?","en": "Do you have children? (voi)"},{"it": "Abbiamo due figli.","en": "We have two children. (noi)"},{"it": "Questa è mia moglie. / Questo è mio marito.","en": "This is my wife. / This is my husband."},{"it": "Ti presento un amico.","en": "Let me introduce a friend (to you). (tu)"},{"it": "Le presento mia moglie.","en": "May I introduce my wife. (lei)"},{"it": "I miei genitori vivono in Inghilterra.","en": "My parents live in England. (loro)"},{"it": "Mia sorella lavora a Roma.","en": "My sister works in Rome. (lei / 3rd person)"},{"it": "Quanti anni hai? / Quanti anni ha?","en": "How old are you? (tu / lei)"},{"it": "Che lavoro fai? / Che lavoro fa?","en": "What do you do (for work)? (tu / lei)"},{"it": "Ci vediamo domani?","en": "Shall we meet tomorrow? (noi)"},{"it": "Ci possiamo vedere sabato.","en": "We can meet on Saturday. (noi)"},{"it": "Sei libero / libera stasera?","en": "Are you free tonight? (tu, m / f)"},{"it": "Vieni con noi?","en": "Are you coming with us? (tu)"},{"it": "Andiamo a bere qualcosa?","en": "Shall we go for a drink? (noi)"},{"it": "A che ora ci vediamo?","en": "What time shall we meet? (noi)"},{"it": "Ci vediamo alle otto davanti al bar.","en": "See you at eight in front of the café. (noi)"},{"it": "Mi dai il tuo numero?","en": "Will you give me your number? (tu)"},{"it": "Ti scrivo un messaggio.","en": "I'll text you. (io → tu)"},{"it": "Ci sentiamo presto!","en": "We'll be in touch soon! (noi)"},{"it": "È stato un piacere.","en": "It's been a pleasure. (past)"},{"it": "Spero di rivederti / rivederla.","en": "I hope to see you again. (tu / lei)"}]},"cafe": {"menu": "Restaurant","desc": "Café, bar & restaurant","short": "Restaurant","words": [{"it": "il ristorante","en": "the restaurant"},{"it": "la trattoria","en": "the trattoria"},{"it": "la pizzeria","en": "the pizzeria"},{"it": "il bar","en": "the café / bar"},{"it": "il cameriere / la cameriera","en": "the waiter / waitress"},{"it": "il cuoco","en": "the cook / chef"},{"it": "il conto","en": "the bill"},{"it": "la mancia","en": "the tip"},{"it": "il tavolo","en": "the table"},{"it": "la prenotazione","en": "the reservation"},{"it": "il menù","en": "the menu"},{"it": "la carta dei vini","en": "the wine list"},{"it": "il coperto","en": "the cover charge"},{"it": "il piatto","en": "the dish / plate"},{"it": "la portata","en": "the course"},{"it": "il bicchiere","en": "the glass"},{"it": "la tazza","en": "the cup"},{"it": "la forchetta","en": "the fork"},{"it": "il coltello","en": "the knife"},{"it": "il cucchiaio","en": "the spoon"},{"it": "il cucchiaino","en": "the teaspoon"},{"it": "il tovagliolo","en": "the napkin"},{"it": "la bottiglia","en": "the bottle"},{"it": "la caraffa","en": "the carafe"},{"it": "l'antipasto","en": "the starter"},{"it": "il primo","en": "the first course"},{"it": "il secondo","en": "the main course"},{"it": "il contorno","en": "the side dish"},{"it": "il dolce","en": "the dessert"},{"it": "la pizza","en": "the pizza"},{"it": "la pasta","en": "the pasta"},{"it": "gli spaghetti","en": "the spaghetti"},{"it": "il risotto","en": "the risotto"},{"it": "la zuppa","en": "the soup"},{"it": "la minestra","en": "the soup"},{"it": "l'insalata","en": "the salad"},{"it": "la bistecca","en": "the steak"},{"it": "il panino","en": "the sandwich / roll"},{"it": "il tramezzino","en": "the (soft) sandwich"},{"it": "la bruschetta","en": "the bruschetta"},{"it": "il gelato","en": "the ice cream"},{"it": "la torta","en": "the cake"},{"it": "il pane","en": "the bread"},{"it": "l'acqua naturale","en": "still water"},{"it": "l'acqua frizzante","en": "sparkling water"},{"it": "il vino rosso","en": "red wine"},{"it": "il vino bianco","en": "white wine"},{"it": "la birra","en": "the beer"},{"it": "l'espresso","en": "the espresso"},{"it": "il cappuccino","en": "the cappuccino"},{"it": "il cornetto","en": "the croissant"},{"it": "il tè","en": "the tea"},{"it": "il latte","en": "the milk"},{"it": "la spremuta","en": "the fresh juice"},{"it": "l'aperitivo","en": "the aperitif"},{"it": "il digestivo","en": "the after-dinner drink"},{"it": "il sale","en": "the salt"},{"it": "il pepe","en": "the pepper"},{"it": "l'olio","en": "the oil"},{"it": "l'aceto","en": "the vinegar"},{"it": "il formaggio","en": "the cheese"},{"it": "il prosciutto","en": "the ham"},{"it": "il pomodoro","en": "the tomato"},{"it": "il pollo","en": "the chicken"},{"it": "il pesce","en": "the fish"},{"it": "la carne","en": "the meat"},{"it": "le verdure","en": "the vegetables"},{"it": "le patate fritte","en": "the chips"},{"it": "lo zucchero","en": "the sugar"},{"it": "il ghiaccio","en": "the ice"},{"it": "buono","en": "good / tasty"},{"it": "buonissimo","en": "delicious"},{"it": "caldo","en": "hot"},{"it": "freddo","en": "cold"},{"it": "dolce","en": "sweet"},{"it": "salato","en": "salty"},{"it": "piccante","en": "spicy"},{"it": "fresco","en": "fresh"},{"it": "squisito","en": "exquisite"},{"it": "la fame","en": "hunger"},{"it": "la sete","en": "thirst"},{"it": "la colazione","en": "breakfast"},{"it": "il pranzo","en": "lunch"},{"it": "la cena","en": "dinner"},{"it": "la merenda","en": "the snack"},{"it": "l'ordine","en": "the order"},{"it": "vegetariano / vegetariana","en": "vegetarian"},{"it": "l'allergia","en": "the allergy"},{"it": "il resto","en": "the change"},{"it": "la specialità","en": "the speciality"},{"it": "ordinare","en": "to order"},{"it": "mangiare","en": "to eat"},{"it": "bere","en": "to drink"},{"it": "prendere","en": "to have (order)"},{"it": "volere","en": "to want"},{"it": "consigliare","en": "to recommend"},{"it": "pagare","en": "to pay"},{"it": "prenotare","en": "to book"},{"it": "l'acqua","en": "the water"},{"it": "il caffè","en": "the coffee"}],"phrases": [{"it": "Un tavolo per due, per favore.","en": "A table for two, please."},{"it": "Ho prenotato un tavolo per stasera.","en": "I've booked a table for tonight. (io, past)"},{"it": "Avete un tavolo libero?","en": "Do you have a free table? (voi)"},{"it": "Vorrei vedere il menù.","en": "I'd like to see the menu. (io)"},{"it": "Cosa ci consiglia?","en": "What do you recommend (for us)? (lei)"},{"it": "Che cosa prende?","en": "What will you have? (lei — waiter asks)"},{"it": "Io prendo la pasta, e tu?","en": "I'll have the pasta, and you? (io / tu)"},{"it": "Prendiamo una bottiglia di vino rosso.","en": "We'll have a bottle of red wine. (noi)"},{"it": "Per me un caffè, per favore.","en": "For me a coffee, please."},{"it": "Un caffè, per favore. / Due caffè, per favore.","en": "A coffee, please. / Two coffees, please."},{"it": "Cosa prendete da bere?","en": "What will you have to drink? (voi — to a group)"},{"it": "Prendo solo un primo.","en": "I'll have just a first course. (io)"},{"it": "È tutto buonissimo!","en": "It's all delicious!"},{"it": "Vorrei l'acqua naturale / frizzante.","en": "I'd like still / sparkling water. (io)"},{"it": "Posso avere il pane, per favore?","en": "Can I have some bread, please? (io)"},{"it": "Il conto, per favore.","en": "The bill, please."},{"it": "Possiamo pagare separatamente?","en": "Can we pay separately? (noi)"},{"it": "Accettate la carta?","en": "Do you take card? (voi)"},{"it": "Sono vegetariano / vegetariana.","en": "I'm vegetarian. (m / f)"},{"it": "Ho un'allergia alle noci.","en": "I have a nut allergy. (io)"},{"it": "Cosa c'è in questo piatto?","en": "What's in this dish?"},{"it": "Com'è? / Com'era?","en": "How is it? / How was it? (present vs imperfect)"},{"it": "Il pesce era squisito.","en": "The fish was exquisite. (imperfect)"},{"it": "Mangiamo fuori stasera?","en": "Shall we eat out tonight? (noi)"},{"it": "I bambini prendono la pizza.","en": "The children will have pizza. (loro)"},{"it": "Loro vogliono il dolce.","en": "They want dessert. (loro)"},{"it": "Volete un dolce o un caffè?","en": "Would you like dessert or coffee? (voi)"},{"it": "Prendi un aperitivo con noi?","en": "Will you have an aperitif with us? (tu)"},{"it": "Vengo spesso in questo ristorante.","en": "I often come to this restaurant. (io)"},{"it": "Torniamo qui domani?","en": "Shall we come back here tomorrow? (noi)"},{"it": "Mi porta il conto, per favore?","en": "Will you bring me the bill? (lei)"},{"it": "Manca una forchetta.","en": "There's a fork missing."},{"it": "È libero questo posto?","en": "Is this seat free?"},{"it": "Vorrei prenotare per quattro persone.","en": "I'd like to book for four people. (io)"},{"it": "A che ora aprite / chiudete?","en": "What time do you open / close? (voi)"},{"it": "Buon appetito!","en": "Enjoy your meal!"},{"it": "Complimenti al cuoco, era ottimo.","en": "Compliments to the chef, it was excellent. (past)"},{"it": "Posso avere ancora un po' di vino?","en": "Can I have a bit more wine? (io)"},{"it": "Tenga il resto.","en": "Keep the change. (lei — command)"},{"it": "Ci vediamo al bar alle undici.","en": "See you at the café at eleven. (noi)"}]}};

/* ============================================================ VOCAB */
const START_HTML = "<h2>Start here</h2>\n<p>New to Italian, or to grammar in general? This page explains everything in plain English, one small step at a time. Read it once, then explore the other tabs. Nothing here assumes you already know the words.</p>\n<h3>1. What is a verb?</h3>\n<p>A verb is a \"doing\" or \"being\" word — <em>to speak, to eat, to sleep, to be</em>. In Italian, \"to speak\" is <strong>parlare</strong>.</p>\n<h3>2. What does \"conjugating\" mean?</h3>\n<p>It simply means changing the verb to match <strong>who</strong> is doing the action. In English the verb barely changes — <em>I speak, you speak, we speak</em>. In Italian the <strong>ending</strong> changes for each person: <em>io parl<span class=\"hl\">o</span>, tu parl<span class=\"hl\">i</span>, noi parl<span class=\"hl\">iamo</span></em>. Learning those endings is what this app is for.</p>\n<h3>3. Every verb is one of three types</h3>\n<p>Look at the last three letters of the verb. Italian verbs end in <span class=\"fam-pill are\">-are</span>, <span class=\"fam-pill ere\">-ere</span> or <span class=\"fam-pill ire\">-ire</span>:</p>\n<ul>\n<li><strong>parlare</strong> (to speak) — an <span class=\"fam-pill are\">-are</span> verb</li>\n<li><strong>credere</strong> (to believe) — an <span class=\"fam-pill ere\">-ere</span> verb</li>\n<li><strong>dormire</strong> (to sleep) — an <span class=\"fam-pill ire\">-ire</span> verb</li>\n</ul>\n<p>Each type follows its own regular pattern. Throughout the app these three colours always mean the same three families, so you can tell them apart at a glance.</p>\n<h3>4. How a verb is built: stem + ending</h3>\n<p>Take off the last three letters to get the <strong>stem</strong>, then add a new ending for each person:</p>\n<div class=\"callout\">parlare → drop <em>-are</em> → stem <strong>parl-</strong> → io <strong>parl</strong><span class=\"hl\">o</span>, tu <strong>parl</strong><span class=\"hl\">i</span>, noi <strong>parl</strong><span class=\"hl\">iamo</span>.<br/>The stem stays the same; only the ending changes.</div>\n<h3>5. Who is doing it</h3>\n<p>Every verb has six forms — one for each \"person\". They always appear in this order:</p>\n<table class=\"gtable\">\n<tr><th>Italian</th><th>English</th></tr>\n<tr><td>io</td><td>I</td></tr>\n<tr><td>tu</td><td>you (one person)</td></tr>\n<tr><td>lui / lei</td><td>he / she</td></tr>\n<tr><td>noi</td><td>we</td></tr>\n<tr><td>voi</td><td>you (more than one)</td></tr>\n<tr><td>loro</td><td>they</td></tr>\n</table>\n<p>Tip: Italian usually <strong>leaves out</strong> these words, because the ending already tells you who — <em>parlo</em> on its own means \"I speak\".</p>\n<h3>6. When it happens: tenses</h3>\n<p>A \"tense\" is just <strong>when</strong> the action happens:</p>\n<ul>\n<li><strong>Present</strong> — now: <em>I speak</em></li>\n<li><strong>Past</strong> — before: <em>I spoke</em></li>\n<li><strong>Future</strong> — later: <em>I will speak</em></li>\n</ul>\n<p>Start with the present. The other tenses build on the same idea once it feels comfortable.</p>\n<h3>7. How to use this app</h3>\n<ul>\n<li><strong>Grammar</strong> — short, simple lessons. Start here if it's all new: begin with \"Masculine &amp; feminine\", then work down to the verb sections.</li>\n<li><strong>Reference</strong> — see verbs fully conjugated. Pick a tense along the top; each card shows one verb, and the tense you're viewing is labelled on every card.</li>\n<li><strong>Course</strong> — step-by-step verb exercises, one section at a time; pass one to unlock the next.</li><li><strong>Charts</strong> and <strong>Vocab</strong> — your picture guides, and everyday words and phrases for four situations.</li><li><strong>💬 Ask Giulia</strong> — on any lesson or course section, ask a question by typing or speaking.</li>\n</ul>\n<div class=\"start-btns\">\n<button class=\"goto\" data-view=\"grammar\">Start with the basics →</button>\n<button class=\"goto alt\" data-view=\"reference\">See the verbs →</button><button class=\"goto alt\" data-view=\"course\">Start the verb course →</button>\n</div>";
const LESSONS = [
{
"id": "g-gender",
"n": 1,
"title": "Masculine & feminine",
"group": "Foundations",
"tier": "t-found",
"html": "<h2>Masculine &amp; feminine — start here</h2>\n<p>This is the foundation English does not have, and everything builds on it. <strong>Every noun has a gender</strong>, and its ending signals gender and number. Get this and sentence construction follows; miss it and articles, adjectives and prepositions won't make sense.</p>\n<div class=\"callout\">Throughout this app, <span class=\"gm\">masculine is shown in violet</span> and <span class=\"gf\">feminine in pink</span> (kept separate from the verb-family colours).</div>\n<table class=\"gtable\">\n<tr><th>Ending</th><th>Usually</th><th>Singular</th><th>Plural</th></tr>\n<tr><td class=\"gm\">-o</td><td class=\"gm\">masculine</td><td>libr<span class=\"gm\">o</span></td><td>libr<span class=\"gm\">i</span></td></tr>\n<tr><td class=\"gf\">-a</td><td class=\"gf\">feminine</td><td>cas<span class=\"gf\">a</span></td><td>cas<span class=\"gf\">e</span></td></tr>\n<tr><td>-e</td><td>either</td><td>cane (m) · chiave (f)</td><td>can<span class=\"hl\">i</span> · chiav<span class=\"hl\">i</span></td></tr>\n</table>\n<p>Plural rule: <span class=\"gm\">-o → -i</span>, <span class=\"gf\">-a → -e</span>, and <code>-e</code> words (either gender) → <code>-i</code>. This is a <strong>strong tendency, not a law</strong> — see the next panel for the exceptions and the endings that predict gender reliably.</p>"
},
{
"id": "g-genex",
"n": 2,
"title": "Gender: exceptions & clues",
"group": "Foundations",
"tier": "t-found",
"html": "<h2>Gender: exceptions &amp; reliable clues</h2>\n<p>The -o/-a rule fails often enough to catch you out. Learn these early so you don't build the wrong habit.</p>\n<h3>Common exceptions</h3>\n<table class=\"gtable\">\n<tr><th>Looks like…</th><th>But is…</th><th>Examples</th></tr>\n<tr><td>-a</td><td class=\"gm\">masculine</td><td>il problema, il tema, il programma, il sistema, il clima, il cinema, il papa, il poeta</td></tr>\n<tr><td>-o</td><td class=\"gf\">feminine</td><td>la mano, la foto, la radio, la moto, la biro</td></tr>\n</table>\n<p>Many words ending <code>-ma</code> (from Greek) are masculine.</p>\n<h3>Endings that DO predict gender</h3>\n<table class=\"gtable\">\n<tr><th>Ending</th><th>Gender</th><th>Examples</th></tr>\n<tr><td>-zione, -sione, -tà, -tù, -i</td><td class=\"gf\">feminine</td><td>la stazione, la città, la virtù, la crisi</td></tr>\n<tr><td>-ore, -ale, -ile, -ame</td><td class=\"gm\">masculine</td><td>il colore, il giornale, il fiume</td></tr>\n</table>\n<p>For people, gender is natural; nouns in <code>-ista</code> or <code>-e</code> can be both: <em>il / la turista, il / la cantante</em>. For any <code>-e</code> noun, learn it <strong>with its article</strong>.</p>"
},
{
"id": "g-articles",
"n": 3,
"title": "Articles (the / a)",
"group": "Foundations",
"tier": "t-found",
"html": "<h2>Articles — \"the\" and \"a\"</h2>\n<p>The article matches the noun's gender, number and first letter.</p>\n<h3>Definite (\"the\")</h3>\n<table class=\"gtable\">\n<tr><th>Gender</th><th>Singular</th><th>Plural</th><th>Before</th></tr>\n<tr><td class=\"gm\">masc.</td><td class=\"gm\">il</td><td class=\"gm\">i</td><td>most consonants (il gatto → i gatti)</td></tr>\n<tr><td class=\"gm\">masc.</td><td class=\"gm\">lo</td><td class=\"gm\">gli</td><td>s+cons., z, gn, ps, x, y (lo studente → gli studenti)</td></tr>\n<tr><td>m./f.</td><td>l’</td><td><span class=\"gm\">gli</span> / <span class=\"gf\">le</span></td><td>a vowel (l’amico → gli amici)</td></tr>\n<tr><td class=\"gf\">fem.</td><td class=\"gf\">la</td><td class=\"gf\">le</td><td>consonants (la casa → le case)</td></tr>\n</table>\n<h3>Indefinite (\"a / an\")</h3>\n<table class=\"gtable\">\n<tr><th>Gender</th><th>Form</th><th>Before</th></tr>\n<tr><td class=\"gm\">masc.</td><td class=\"gm\">un</td><td>vowels &amp; most consonants (un amico, un gatto)</td></tr>\n<tr><td class=\"gm\">masc.</td><td class=\"gm\">uno</td><td>s+cons., z, gn, ps (uno studente)</td></tr>\n<tr><td class=\"gf\">fem.</td><td class=\"gf\">una</td><td>consonants (una casa)</td></tr>\n<tr><td class=\"gf\">fem.</td><td class=\"gf\">un’</td><td>a vowel (un’amica)</td></tr>\n</table>"
},
{
"id": "g-agree",
"n": 4,
"title": "Agreement",
"group": "Foundations",
"tier": "t-found",
"html": "<h2>Agreement in a sentence</h2>\n<p>Adjectives — and many past participles — must <strong>match</strong> the noun in gender and number, echoing the o/a rule.</p>\n<table class=\"gtable\">\n<tr><th></th><th class=\"gm\">Masculine</th><th class=\"gf\">Feminine</th></tr>\n<tr><td>Singular</td><td>il ragazz<span class=\"gm\">o</span> alt<span class=\"gm\">o</span></td><td>la ragazz<span class=\"gf\">a</span> alt<span class=\"gf\">a</span></td></tr>\n<tr><td>Plural</td><td>i ragazz<span class=\"gm\">i</span> alt<span class=\"gm\">i</span></td><td>le ragazz<span class=\"gf\">e</span> alt<span class=\"gf\">e</span></td></tr>\n</table>\n<p>This drives the passato prossimo of <strong>essere</strong>-verbs: <em>Marco è andat<span class=\"gm\">o</span></em>, <em>Anna è andat<span class=\"gf\">a</span></em>, <em>sono andat<span class=\"gm\">i</span></em>, <em>sono andat<span class=\"gf\">e</span></em>.</p>"
},
{
"id": "g-adjpos",
"n": 5,
"title": "Adjective position",
"group": "Foundations",
"tier": "t-found",
"html": "<h2>Adjective position</h2>\n<p>Unlike English, most descriptive adjectives come <strong>after</strong> the noun.</p>\n<ul>\n<li><strong>After</strong> (the norm): una macchina ross<span class=\"gf\">a</span>, un libro interessante, un vino italiano.</li>\n<li><strong>Before</strong> (a small common set): bello, buono, brutto, grande, piccolo, nuovo, vecchio, giovane, bravo — <em>una bella casa, un buon amico</em>.</li>\n</ul>\n<p>A few change meaning by position:</p>\n<table class=\"gtable\">\n<tr><th>Before</th><th>After</th></tr>\n<tr><td>un <strong>grande</strong> uomo — a great man</td><td>un uomo <strong>grande</strong> — a big / tall man</td></tr>\n<tr><td>una <strong>vecchia</strong> amica — a long-standing friend</td><td>un’amica <strong>vecchia</strong> — an elderly friend</td></tr>\n</table>\n<p>Either way, the adjective still agrees in gender and number.</p>"
},
{
"id": "g-pronouns",
"n": 6,
"title": "Subject pronouns",
"group": "Building blocks",
"tier": "t-build",
"html": "<h2>Subject pronouns</h2>\n<p>They mark the person but are usually <strong>dropped</strong>, because the verb ending already shows who (<em>parlo</em> = \"I speak\"). Learn them in the order every table here uses.</p>\n<table class=\"gtable\">\n<tr><th>Person</th><th>Italian</th><th>English</th></tr>\n<tr><td>1 sing.</td><td class=\"hl\">io</td><td>I</td></tr>\n<tr><td>2 sing.</td><td class=\"hl\">tu</td><td>you (informal)</td></tr>\n<tr><td>3 sing.</td><td class=\"hl\">lui / lei</td><td>he / she (Lei = formal you)</td></tr>\n<tr><td>1 plur.</td><td class=\"hl\">noi</td><td>we</td></tr>\n<tr><td>2 plur.</td><td class=\"hl\">voi</td><td>you (all)</td></tr>\n<tr><td>3 plur.</td><td class=\"hl\">loro</td><td>they</td></tr>\n</table>"
},
{
"id": "g-objposs",
"n": 7,
"title": "Object & possessive pronouns",
"group": "Building blocks",
"tier": "t-build",
"html": "<h2>Object &amp; possessive pronouns</h2>\n<h3>Direct object — \"whom / what\"</h3>\n<p>They replace the thing acted on and sit <strong>before</strong> the verb: mi, ti, <span class=\"gm\">lo</span> / <span class=\"gf\">la</span>, ci, vi, <span class=\"gm\">li</span> / <span class=\"gf\">le</span>.</p>\n<p><em><span class=\"gm\">Lo</span> vedo</em> = I see him / it.   <em><span class=\"gf\">La</span> compro</em> = I'm buying it (fem.).</p>\n<h3>Indirect object — \"to whom\"</h3>\n<p>mi, ti, gli / le, ci, vi, gli: <em>Gli parlo</em> = I speak to him; <em>Le scrivo</em> = I write to her.</p>\n<h3>Possessives</h3>\n<p>Normally used <strong>with the article</strong> and they agree with the thing owned, not the owner — so <em>la sua casa</em> is \"his <em>or</em> her house\".</p>\n<table class=\"gtable\">\n<tr><th>Owner</th><th class=\"gm\">m. sing.</th><th class=\"gf\">f. sing.</th><th class=\"gm\">m. plur.</th><th class=\"gf\">f. plur.</th></tr>\n<tr><td>my</td><td>il mio</td><td>la mia</td><td>i miei</td><td>le mie</td></tr>\n<tr><td>your</td><td>il tuo</td><td>la tua</td><td>i tuoi</td><td>le tue</td></tr>\n<tr><td>his / her</td><td>il suo</td><td>la sua</td><td>i suoi</td><td>le sue</td></tr>\n</table>"
},
{
"id": "g-prep",
"n": 8,
"title": "Prepositions (nel / nella)",
"group": "Building blocks",
"tier": "t-build",
"html": "<h2>Articulated prepositions — <em>nel</em>, <em>nella</em></h2>\n<p>When a preposition meets a definite article, the two <strong>fuse</strong>. That's why <em>in + <span class=\"gm\">il</span></em> → <span class=\"gm\">nel</span> but <em>in + <span class=\"gf\">la</span></em> → <span class=\"gf\">nella</span> — the ending follows the article's gender and number.</p>\n<table class=\"gtable\">\n<tr><th></th><th class=\"gm\">+ il</th><th class=\"gm\">+ lo</th><th>+ l’</th><th class=\"gf\">+ la</th><th class=\"gm\">+ i</th><th class=\"gm\">+ gli</th><th class=\"gf\">+ le</th></tr>\n<tr><td>di</td><td>del</td><td>dello</td><td>dell’</td><td>della</td><td>dei</td><td>degli</td><td>delle</td></tr>\n<tr><td>a</td><td>al</td><td>allo</td><td>all’</td><td>alla</td><td>ai</td><td>agli</td><td>alle</td></tr>\n<tr><td>da</td><td>dal</td><td>dallo</td><td>dall’</td><td>dalla</td><td>dai</td><td>dagli</td><td>dalle</td></tr>\n<tr><td>in</td><td class=\"gm\">nel</td><td>nello</td><td>nell’</td><td class=\"gf\">nella</td><td>nei</td><td>negli</td><td>nelle</td></tr>\n<tr><td>su</td><td>sul</td><td>sullo</td><td>sull’</td><td>sulla</td><td>sui</td><td>sugli</td><td>sulle</td></tr>\n</table>\n<p><em>Vado <span class=\"gm\">nel</span> giardino</em> but <em>Vado <span class=\"gf\">nella</span> cucina</em>. <code>con</code> and <code>per</code> are normally left uncontracted.</p>"
},
{
"id": "g-families",
"n": 9,
"title": "The three families",
"group": "Verbs & tenses",
"tier": "t-verb",
"html": "<h2>The three verb families</h2>\n<p>Every verb belongs to one group by its infinitive ending. Drop the ending for the <strong>stem</strong>, then add the endings for each person and tense.</p>\n<p><span class=\"fam-pill are\">-are</span> parlare   <span class=\"fam-pill ere\">-ere</span> credere   <span class=\"fam-pill ire\">-ire</span> dormire</p>\n<p>These colours follow the verb through the app — each card in <strong>Reference</strong> carries a matching stripe. A large subset of <span class=\"fam-pill ire\">-ire</span> verbs (capire, finire, preferire…) inserts <code>-isc-</code> in the present tense only.</p>"
},
{
"id": "g-endings",
"n": 10,
"title": "Endings that repeat",
"group": "Verbs & tenses",
"tier": "t-verb",
"html": "<h2>Endings that repeat</h2>\n<p>The shortcut that saves memorising three full sets. In the <strong>present</strong>, three persons take an identical ending in all families:</p>\n<ul>\n<li><strong>io</strong> → always <code>-o</code> (parlo, credo, dormo)</li>\n<li><strong>tu</strong> → always <code>-i</code> (parli, credi, dormi)</li>\n<li><strong>noi</strong> → always <code>-iamo</code> (parliamo, crediamo, dormiamo)</li>\n</ul>\n<p><span class=\"fam-pill ere\">-ere</span> and <span class=\"fam-pill ire\">-ire</span> also share the <strong>loro</strong> ending <code>-ono</code>. In the <strong>futuro</strong> and <strong>condizionale</strong>, <span class=\"fam-pill are\">-are</span> and <span class=\"fam-pill ere\">-ere</span> are identical and <span class=\"fam-pill ire\">-ire</span> only swaps a vowel. Open any tense in <strong>Reference</strong>: shared-by-all cells are bold, shared-by-two are underlined.</p>"
},
{
"id": "g-tenses",
"n": 11,
"title": "Past · present · future",
"group": "Verbs & tenses",
"tier": "t-verb",
"html": "<h2>Past · present · future</h2>\n<div class=\"callout\"><b>Passato prossimo</b> and <b>imperfetto</b> are both <b>past</b>; <b>futuro</b> is the future. <b>Condizionale</b> (\"would\") and <b>congiuntivo</b> (subjunctive) are <b>moods</b>, not tenses — grouped after the \"mood\" divider in Reference.</div>\n<ul>\n<li><strong>Presente</strong> — <em>parlo</em> \"I speak\".</li>\n<li><strong>Passato prossimo</strong> — <em>ho parlato</em>. Present of <strong>avere/essere</strong> + participle (-are→<code>-ato</code>, -ere→<code>-uto</code>, -ire→<code>-ito</code>). The participle stays fixed; the auxiliary changes: ho / hai / ha / abbiamo / avete / hanno capito.</li>\n<li><strong>Imperfetto</strong> — <em>parlavo</em> \"I was speaking / used to speak\".</li>\n<li><strong>Futuro</strong> — <em>parlerò</em> \"I will speak\".</li>\n<li><strong>Condizionale</strong> — <em>parlerei</em> \"I would speak\" (vorrei = \"I would like\").</li>\n<li><strong>Congiuntivo</strong> — after <em>penso che, voglio che…</em>: <em>che io parli</em>.</li>\n</ul>"
},
{
"id": "g-continuous",
"n": 12,
"title": "Present continuous",
"group": "Verbs & tenses",
"tier": "t-verb",
"html": "<h2>Present continuous — <em>stare</em> + gerund</h2>\n<p>For \"I am (right now) doing\", use the present of <strong>stare</strong> + the gerund: -are → <code>-ando</code>, -ere &amp; -ire → <code>-endo</code>.</p>\n<table class=\"gtable\">\n<tr><th>stare</th><th>+ gerund</th><th>meaning</th></tr>\n<tr><td>sto</td><td class=\"hl\">parlando</td><td>I am speaking</td></tr>\n<tr><td>stai</td><td class=\"hl\">scrivendo</td><td>you are writing</td></tr>\n<tr><td>sta</td><td class=\"hl\">dormendo</td><td>he / she is sleeping</td></tr>\n<tr><td>stiamo / state / stanno</td><td>mangiando…</td><td>we / you / they are eating</td></tr>\n</table>"
},
{
"id": "g-essere",
"n": 13,
"title": "Which verbs take essere",
"group": "Verbs & tenses",
"tier": "t-verb",
"html": "<h2>Which verbs take <em>essere</em></h2>\n<p>Most verbs form the past with <strong>avere</strong>. A limited set uses <strong>essere</strong> — and then the participle <strong>agrees</strong> with the subject. Learn the groups:</p>\n<table class=\"gtable\">\n<tr><th>Group</th><th>Verbs</th></tr>\n<tr><td>Movement</td><td>andare, venire, arrivare, partire, uscire, entrare, tornare, salire, scendere, cadere</td></tr>\n<tr><td>Staying</td><td>stare, restare, rimanere</td></tr>\n<tr><td>Being / becoming</td><td>essere, diventare, nascere, morire, crescere</td></tr>\n<tr><td>All reflexives</td><td>lavarsi, alzarsi, svegliarsi… (mi sono lavato)</td></tr>\n</table>\n<p>Examples: <em>sono andat<span class=\"gm\">o</span></em>, <em>è nat<span class=\"gf\">a</span></em>, <em>siamo rimast<span class=\"gm\">i</span></em>. Everything else: <em>ho mangiato, ho visto, ho parlato</em>.</p>"
},
{
"id": "g-reflexive",
"n": 14,
"title": "Reflexive verbs",
"group": "Harder concepts",
"tier": "t-adv",
"html": "<h2>Reflexive verbs</h2>\n<p>Verbs like <em>lavarsi</em> (to wash oneself) take a reflexive pronoun before the verb: <strong>mi, ti, si, ci, vi, si</strong>. The verb conjugates as normal.</p>\n<table class=\"gtable\">\n<tr><th>Pronoun</th><th>lavarsi</th><th>English</th></tr>\n<tr><td class=\"hl\">mi</td><td>mi lavo</td><td>I wash (myself)</td></tr>\n<tr><td class=\"hl\">ti</td><td>ti lavi</td><td>you wash</td></tr>\n<tr><td class=\"hl\">si</td><td>si lava</td><td>he / she washes</td></tr>\n<tr><td class=\"hl\">ci</td><td>ci laviamo</td><td>we wash</td></tr>\n<tr><td class=\"hl\">vi</td><td>vi lavate</td><td>you (all) wash</td></tr>\n<tr><td class=\"hl\">si</td><td>si lavano</td><td>they wash</td></tr>\n</table>\n<p>In the passato prossimo, reflexives always use <strong>essere</strong>, so the participle agrees: <em>mi sono lavat<span class=\"gm\">o</span> / lavat<span class=\"gf\">a</span></em>.</p>"
},
{
"id": "g-ppimp",
"n": 15,
"title": "Passato vs imperfetto",
"group": "Harder concepts",
"tier": "t-adv",
"html": "<h2>Passato prossimo vs imperfetto</h2>\n<p>Both are past, but they answer different questions — the distinction that trips up most learners, so tackle it once the individual tenses feel comfortable.</p>\n<table class=\"gtable\">\n<tr><th>Passato prossimo — <em>what happened</em></th><th>Imperfetto — <em>the background</em></th></tr>\n<tr><td>A finished, one-off action</td><td>Ongoing, habitual or repeated</td></tr>\n<tr><td>Ieri <span class=\"hl\">ho mangiato</span> la pizza.<br/><small>Yesterday I ate pizza.</small></td><td>Da bambino <span class=\"hl\">mangiavo</span> sempre la pizza.<br/><small>As a child I always ate pizza.</small></td></tr>\n<tr><td>The event that happens</td><td>Descriptions, time, weather, age, feelings</td></tr>\n<tr><td>…<span class=\"hl\">è arrivato</span> Marco.<br/><small>Marco arrived.</small></td><td><span class=\"hl\">Mentre leggevo</span>…<br/><small>While I was reading…</small></td></tr>\n</table>\n<div class=\"callout\">Rule of thumb: <b>imperfetto</b> sets the scene (\"was doing / used to\"); <b>passato prossimo</b> is the thing that then happened.</div>"
}
];
return { passato, formsFor, tenseLabels, PRONOUNS, REGULAR, IRREGULAR, ALL, AVERE, ESSERE, ENDINGS, TENSE_INTRO, TENSE_TITLE, CHARTS, V_ORDER, VOCAB, START_HTML, LESSONS };
})();
