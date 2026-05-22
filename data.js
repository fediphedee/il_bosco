const DIRECTORY = [
  {
    id: "firefox",
    name: "Firefox",
    category: "browser",
    categoryLabel: "Browser",
    country: "USA",
    altFor: ["google chrome", "chrome", "safari", "edge"],
    businessModel: "Donazioni e partnership, principalmente Mozilla Foundation.",
    description: "È una fondazione no-profit. Lo usiamo da anni, e non per abitudine. Firefox esiste perché esiste Mozilla Foundation, una delle poche organizzazioni al mondo che si batte seriamente per un internet aperto, e che lo fa senza venderti niente. Ogni volta che scegli Firefox, stai finanziando quella missione.",
    caveat: "Il 2025 è stato un anno complicato per Mozilla. Un nuovo CEO ha annunciato di voler trasformare Firefox in un \"browser AI\", e la community ha protestato rumorosamente. La risposta di Mozilla? Hanno promesso un kill switch per disattivare tutto ciò che è AI, e si sono impegnati a rendere ogni funzione opt-in. Comunque lo raccomandiamo perché ci fidiamo della direzione, anche quando inciampa.",
    url: "https://firefox.com"
  },
  {
    id: "brave",
    name: "Brave",
    category: "browser",
    categoryLabel: "Browser",
    country: "USA",
    altFor: ["google chrome", "chrome", "safari", "edge"],
    businessModel: "Pubblicità opt-in e abbonamenti premium, non vende i tuoi dati.",
    description: "Brave è la scelta più indolore per chi viene da Chrome. Stessa interfaccia, stesse estensioni, ma blocca pubblicità e tracker di default. È più veloce, usa meno memoria, e in test indipendenti è risultato il browser che trasmette meno dati identificativi. Dal primo giorno funziona meglio di quello che stai usando adesso.",
    caveat: "Brave ha un sistema pubblicitario interno con un token crypto chiamato BAT. Puoi disattivarlo completamente nelle impostazioni. Il fondatore di Brave, Brendan Eich, è uno dei fondatori di Mozilla, ma ha dato le dimissioni dopo critiche pubbliche per il suo sostegno a una legge contro il matrimonio tra persone dello stesso sesso. Ci sembra importante menzionarlo.",
    url: "https://brave.com"
  },
  {
    id: "protonmail",
    name: "Proton Mail",
    category: "email",
    categoryLabel: "Email",
    country: "SVIZZERA",
    altFor: ["gmail", "apple mail", "outlook"],
    businessModel: "Abbonamenti — gratuito con limiti, a pagamento per uso serio.",
    description: "Proton non può leggere le tue email. Non perché lo promette ma perché tecnicamente non ci riesce. La crittografia avviene sul tuo dispositivo, prima che i dati arrivino ai loro server. Questo si chiama zero-access encryption. Nata da un gruppo di scienziati del CERN, Proton è rimasta fedele alla sua missione per oltre dieci anni.\n\nMa Proton è molto più di un servizio email. Con un abbonamento Proton hai accesso a una suite completa: Drive per i file e le foto sincronizzate dal telefono (come Google Foto), Docs e Spreadsheet per lavorare su documenti condivisi, un Password Manager, una VPN e un Authenticator per il doppio fattore. Tutto sotto lo stesso tetto, tutto con la stessa logica di crittografia. Per chi vuole uscire dall'orbita Google o Microsoft, è l'alternativa più completa che abbiamo trovato.",
    caveat: "Nel 2021 è stata costretta legalmente a consegnare l'IP di un attivista francese. Non ha violato la crittografia, ha consegnato metadati che per legge non poteva rifiutarsi di dare. È un limite reale dell'email come protocollo, non di Proton.",
    url: "https://proton.me"
  },
  {
    id: "tuta",
    name: "Tuta",
    category: "email",
    categoryLabel: "Email",
    country: "GERMANIA",
    altFor: ["gmail", "apple mail", "outlook"],
    businessModel: "Abbonamenti. Gratuito con limiti.",
    description: "Più radicale di Proton nella privacy, cifra anche l'oggetto delle email, non solo il corpo. Completamente europea, completamente open source, completamente focalizzata. Se vuoi l'alternativa più pulita senza compromessi, Tuta è la risposta.",
    caveat: null,
    url: "https://tuta.com"
  },
  {
    id: "ecosia",
    name: "Ecosia",
    category: "ricerca",
    categoryLabel: "Ricerca",
    country: "GERMANIA",
    altFor: ["google", "google search", "bing"],
    businessModel: "Pubblicità contestuale. I ricavi vanno a rimboschimento e infrastruttura propria.",
    description: "Nel 2025 ha lanciato insieme a Qwant un indice europeo indipendente chiamato Staan. Per la prima volta in 16 anni, Ecosia fornisce risultati propri, senza passare per Big Tech. Pianta alberi con i ricavi pubblicitari. Non traccia. E sta costruendo qualcosa di proprio.",
    caveat: null,
    url: "https://ecosia.org"
  },
  {
    id: "kagi",
    name: "Kagi",
    category: "ricerca",
    categoryLabel: "Ricerca",
    country: "USA",
    altFor: ["google", "google search", "bing"],
    businessModel: "Abbonamento — da 5€/mese. Nessuna pubblicità, nessun dato venduto.",
    description: "Kagi non ha pubblicità, non traccia le ricerche, e ha costruito un sistema tecnico per cui non può identificarti anche se volesse. Paghi, e in cambio hai risultati che lavorano per te, non per chi compra spazi pubblicitari. È il modello più coerente disponibile.",
    caveat: "Non tanto, ma costa. E non è europeo. Per chi vuole tenere tutto in Europa, Ecosia è la scelta più coerente.",
    url: "https://kagi.com"
  },
  {
    id: "signal",
    name: "Signal",
    category: "messaggi",
    categoryLabel: "Messaggi",
    country: "USA",
    altFor: ["whatsapp"],
    businessModel: "Donazioni: nessun investitore, nessuna pubblicità.",
    description: "Signal è lo standard. Il protocollo che usa per la crittografia è lo stesso che WhatsApp ha adottato, ma Signal non è di Meta, non ti traccia, e non ha un modello di business basato sui tuoi dati. Funziona come WhatsApp: messaggi, chiamate, gruppi, file. Il passaggio richiede dieci minuti.",
    caveat: null,
    url: "https://signal.org"
  },
  {
    id: "threema",
    name: "Threema",
    category: "messaggi",
    categoryLabel: "Messaggi",
    country: "SVIZZERA",
    altFor: ["whatsapp"],
    businessModel: "Acquisto unico (circa 5€) una volta sola.",
    description: "L'unica app di messaggistica che non richiede un numero di telefono. Crei un ID anonimo e sei a posto. Svizzera, open source, pagamento una tantum senza abbonamenti. Meno conosciuta di Signal, ma per chi vuole il massimo dell'anonimato è la scelta più coerente.",
    caveat: null,
    url: "https://threema.com"
  },
  {
    id: "mastodon",
    name: "Mastodon",
    category: "social",
    categoryLabel: "Social",
    country: "GERMANIA",
    altFor: ["twitter", "x", "x (twitter)", "threads", "facebook"],
    businessModel: "Donazioni. Nessuna pubblicità.",
    description: "Mastodon non è un'azienda. È una rete di server indipendenti, ognuno gestito da persone reali, con regole proprie, che parlano tutti la stessa lingua. Nessun algoritmo che decide cosa vedi. Nessuna pubblicità.",
    caveat: "Scegliere un server all'inizio è disorientante. Ma nel 2025 l'onboarding è migliorato molto, e chi arriva da Twitter di solito si trova a casa entro una settimana. L'attrito iniziale vale la pena.",
    url: "https://mastodon.social"
  },
  {
    id: "bandcamp",
    name: "Bandcamp",
    category: "musica",
    categoryLabel: "Musica",
    country: "USA",
    altFor: ["spotify", "apple music"],
    businessModel: "Commissione sulle vendite: gli artisti ricevono l'85% di ogni acquisto.",
    description: "Bandcamp ribalta il modello. Compri musica, la possiedi, e la maggior parte dei soldi va direttamente all'artista. Nessun algoritmo che decide cosa ascolti. Il primo venerdì del mese Bandcamp azzera la sua commissione. Tutto va all'artista.",
    caveat: "Bandcamp è stato acquisito da Epic Games nel 2022, poi rivenduto a Songtradr nel 2023, che ha licenziato metà del team. Continuiamo a raccomandarlo perché il modello diretto artista-fan rimane il migliore disponibile, ma teniamo d'occhio la direzione.",
    url: "https://bandcamp.com"
  },
  {
    id: "subvert",
    name: "Subvert",
    category: "musica",
    categoryLabel: "Musica",
    country: "USA",
    altFor: ["spotify", "apple music"],
    businessModel: "Marketplace con commissioni 0%. I compratori possono aggiungere un contributo volontario al momento del pagamento per sostenere la piattaforma.",
    description: "Subvert parte da una domanda semplice: e se la piattaforma fosse di proprietà di chi la usa?\n\nSubvert è una cooperativa che sta costruendo un marketplace dove artisti e label vendono musica e merchandise direttamente ai propri sostenitori. La differenza rispetto a Bandcamp non è nelle funzionalità, è nella struttura: artisti, label, lavoratori e sostenitori sono co-proprietari. Votano le decisioni, eleggono il consiglio, definiscono la direzione della piattaforma. Non è uno slogan di marketing, è una struttura legale.\n\nIl modello economico riflette la stessa logica: commissioni allo 0% sulle vendite. Chi compra può scegliere di aggiungere un contributo volontario per sostenere i costi operativi.",
    caveat: "La piattaforma è in alpha dal 2025, funzionante ma ancora in crescita. La scoperta è limitata e il valore reale arriva quando ci saranno migliaia di pagine artisti attive. Le cooperative hanno i loro limiti: governance più lenta, vincoli di finanziamento. Vale la pena seguirla, non necessariamente aspettarsi che sia già matura.",
    url: "https://subvert.fm"
  },
  {
    id: "qobuz",
    name: "Qobuz",
    category: "musica",
    categoryLabel: "Musica",
    country: "FRANCIA",
    altFor: ["spotify", "apple music"],
    businessModel: "Abbonamento a pagamento, nessun tier gratuito. Streaming più acquisto di file in alta risoluzione.",
    description: "Qobuz è nata in Francia nel 2007 e non ha mai smesso di fare una cosa sola, molto bene: musica come la registrava chi l'ha fatta. Streaming lossless dalla qualità CD fino a 24-bit/192kHz, formati che Spotify ha iniziato ad avvicinare solo nel 2025, dopo anni di compressione.\n\nMa la qualità audio è solo una parte. Nel marzo 2025 Qobuz è diventata la prima piattaforma di streaming a pubblicare i propri tassi di royalty verificati e certificati, un gesto che nel settore non aveva precedenti. Il risultato: Qobuz paga in media cinque volte di più per stream rispetto a Spotify. Nessun algoritmo opaco, nessun tier ad-supported che diluisce i compensi.\n\nÈ un'azienda familiare indipendente, fuori da qualsiasi conglomerato multinazionale, e tutti i dipendenti sono azionisti. La cura editoriale è umana, playlist costruite da persone, recensioni, interviste, in un momento in cui la maggior parte delle piattaforme ha smontato le proprie redazioni.",
    caveat: "Non è per tutti. Senza tier gratuito richiede un impegno economico da subito. L'app mobile ha qualche lentezza segnalata. E se ascolti principalmente hip-hop o pop mainstream su casse Bluetooth, probabilmente non sentirai la differenza con Spotify. Qobuz dà il meglio su un impianto hi-fi decente.",
    url: "https://qobuz.com"
  },
  {
    id: "mymovies",
    name: "MyMovies",
    category: "cinema",
    categoryLabel: "Cinema e TV",
    country: "ITALIA",
    altFor: ["netflix", "prime", "prime video", "disney+", "disney plus"],
    businessModel: "Il sito di database e critica è gratuito. La piattaforma streaming MYmovies ONE è in abbonamento.",
    description: "È il punto di riferimento italiano per il cinema d'autore e da festival. Non è un aggregatore generalista.",
    caveat: "GEDI, il gruppo editoriale italiano che controllava il servizio, è stato appena acquisito dal gruppo greco Antenna. Non è più sotto Exor (Agnelli). Da monitorare.",
    url: "https://mymovies.it"
  },
  {
    id: "letterboxd",
    name: "Letterboxd",
    category: "cinema",
    categoryLabel: "Cinema e TV",
    country: "NEW ZEALAND",
    altFor: ["netflix", "prime", "prime video", "disney+", "disney plus"],
    businessModel: "Noleggio a pagamento.",
    description: "Letterboxd è la community cinematografica più amata del mondo. Puoi noleggiare direttamente i film che la community ama, festival, gemme dimenticate, restauri. Paghi solo quello che guardi. Niente autoplay, niente algoritmo. Ogni visione è una scelta.",
    caveat: "Non ha il catalogo di Netflix, per ora in Italia esiste solo un titolo disponibile, ma è anche un socialino divertente per gli amanti del cinema (noi!).",
    url: "https://letterboxd.com"
  },
  {
    id: "mistral",
    name: "Le Chat — Mistral",
    category: "ai",
    categoryLabel: "Intelligenza Artificiale",
    country: "FRANCIA",
    altFor: ["chatgpt", "chat gpt", "gemini", "claude", "ai", "ia", "intelligenza artificiale", "llm"],
    businessModel: "Modello freemium, abbonamento Pro disponibile.",
    description: "Le Chat è l'interfaccia consumer di Mistral, una delle poche aziende europee che sta sviluppando modelli linguistici propri, addestrati in Europa, con sede a Parigi, sotto giurisdizione europea.\n\nLo usiamo perché funziona bene per la maggior parte delle cose che chiediamo a un assistente AI: scrivere, riassumere, ragionare su un testo, rispondere a domande. Non senti la differenza nei casi d'uso quotidiani.\n\nI modelli di Mistral sono in larga parte open weight: chiunque può scaricarli, studiarli, usarli. È una scelta che dice qualcosa di chi li ha fatti.",
    caveat: "Mistral ha ricevuto investimenti significativi e cresce in fretta. Le aziende cambiano quando crescono. Teniamo d'occhio come evolve il rapporto tra la versione gratuita e quella a pagamento, e se le scelte sui dati restano coerenti con le promesse attuali.",
    url: "https://chat.mistral.ai"
  },
  {
    id: "lumo",
    name: "Lumo",
    category: "ai",
    categoryLabel: "Intelligenza Artificiale",
    country: "FINLANDIA",
    altFor: ["chatgpt", "chat gpt", "gemini", "claude", "ai", "ia", "intelligenza artificiale", "llm"],
    businessModel: "Abbonamento mensile, nessun piano gratuito con raccolta dati.",
    description: "Lumo è un assistente AI finlandese, costruito con un'attenzione esplicita alla privacy. Non esiste un piano gratuito finanziato dai tuoi dati: paghi un abbonamento, e in cambio sai esattamente come funziona il rapporto.\n\nÈ pensato per l'uso quotidiano, non per sviluppatori. Si usa come si usa qualsiasi altra app. Per chi vuole un'alternativa a ChatGPT senza dover capire cosa siano i parametri o i pesi di un modello, Lumo è probabilmente il punto d'ingresso più onesto.\n\nViene dalla Finlandia, un paese con una cultura della privacy seria e una tradizione di servizi pubblici digitali ben fatti. Non è una garanzia, ma è un contesto che ci dice qualcosa.",
    caveat: "Lumo è un prodotto più piccolo di Mistral, alcune funzionalità avanzate non ci sono ancora, e la community intorno è più limitata.",
    url: "https://lumo.ai"
  }
];

const CATEGORY_META = {
  browser: {
    label: "BROWSER",
    altFor: "Google Chrome · Safari · Edge",
    percheCambiare: "I browser più diffusi appartengono alle tre aziende che controllano la maggior parte della tua vita digitale: Google, Apple, Microsoft. Chrome ti osserva, Google sa dove sei stato, quanto ci sei rimasto e cosa ti ha interessato. Safari ti tiene nell'ecosistema Apple. Edge fa di tutto per rimanere installato nel tuo sistema operativo e ti reindirizza verso Bing.",
    updated: "marzo 2026"
  },
  email: {
    label: "EMAIL",
    altFor: "Gmail · Apple Mail · Outlook",
    percheCambiare: "Gmail è gratis. Significa che Google legge le tue email per capire cosa ti interessa, cosa compri, cosa stai pianificando. La tua casella di posta è il documento più personale che esiste. E non è tuo.",
    updated: "marzo 2026"
  },
  ricerca: {
    label: "RICERCA",
    altFor: "Google",
    percheCambiare: "Google registra ogni ricerca che fai e la collega a te. Sa cosa ti preoccupa, cosa stai per comprare, cosa ti vergogni a chiedere ad alta voce. Glielo hai detto tu, per anni.",
    updated: "marzo 2026"
  },
  messaggi: {
    label: "MESSAGGI",
    altFor: "WhatsApp",
    percheCambiare: "WhatsApp è di Meta. I messaggi sono cifrati, i metadati no. Meta sa con chi parli, quando, e quanto spesso, e lo collega al tuo profilo Instagram e Facebook. Convincere la zia a cambiare è un altro discorso. Ma tu puoi iniziare.",
    updated: "marzo 2026"
  },
  social: {
    label: "SOCIAL",
    altFor: "X (che è Twitter. Inutile continuare a chiamarlo X) · Threads · facebook",
    percheCambiare: "X è di Elon Musk. Threads e facebook sono di Meta.",
    updated: "marzo 2026"
  },
  musica: {
    label: "MUSICA",
    altFor: "Spotify · Apple Music",
    percheCambiare: "Spotify paga gli artisti frazioni di centesimo per ogni ascolto. Significa che un artista indipendente ha bisogno di milioni di stream per guadagnare quanto costerebbe un caffè. E la musica che ascolti non è tua: è in affitto, e l'algoritmo decide cosa ti viene mostrato.",
    updated: "marzo 2026"
  },
  cinema: {
    label: "CINEMA E TV",
    altFor: "Netflix · Prime Video · Disney+",
    percheCambiare: "Netflix, Prime Video, Disney+ ti fanno pagare ogni mese per accedere a contenuti che non possiedi. Significa che non stai comprando film, stai affittando il permesso di guardarli.",
    updated: "marzo 2026"
  },
  ai: {
    label: "INTELLIGENZA ARTIFICIALE",
    altFor: "ChatGPT · Gemini · Claude",
    percheCambiare: "I modelli più diffusi consumano quantità insostenibili di energia e acqua, e i dati su cui sono stati addestrati includono lavoro umano non riconosciuto e spesso mal pagato, svolto in paesi dove le tutele sono poche. Ci sarebbe molto altro da dire, ma per ora preferiamo suggerire alternative valide.",
    updated: "aprile 2026"
  }
};
