// Carte indicative (à remplacer par la vraie carte du restaurant).
// Prix en FCFA. `region` sert à la proposition 2 (carte du pays).
window.COOKAFRICA = {
  infos: {
    adresse: "2 Plateaux, 7e tranche, cité Zinsou, près du rond-point — Abidjan",
    tel: "01 51 45 91 34",
    telHref: "tel:+2250151459134",
    email: "cook@cookafricavip.com",
    itineraire: "https://www.google.com/maps/search/?api=1&query=Cook+Africa+2+Plateaux+7e+tranche+Abidjan",
    horaires: [
      { jours: "Lundi au samedi", heures: "12h – 22h" },
      { jours: "Dimanche", heures: "12h – 20h" }
    ]
  },
  categories: [
    { id: "entrees", nom: "Entrées" },
    { id: "plats", nom: "Plats du pays" },
    { id: "grillades", nom: "Braise" },
    { id: "desserts", nom: "Douceurs" },
    { id: "boissons", nom: "Boissons maison" }
  ],
  plats: [
    { cat: "entrees", nom: "Soupe d'escargot", desc: "Escargots géants mijotés, piment frais, aubergine.", prix: 6000, region: "est", signature: true },
    { cat: "entrees", nom: "Alloco & œuf", desc: "Banane plantain mûre frite, œuf dur, sauce tomate pimentée.", prix: 2500, region: "abidjan" },
    { cat: "entrees", nom: "Gbofloto", desc: "Petits beignets moelleux, servis tièdes.", prix: 2000, region: "abidjan" },

    { cat: "plats", nom: "Sauce graine au tikriti", desc: "Graine de palme, tikriti fermenté, viande fumée. Recette du pays bété.", prix: 7500, region: "ouest", signature: true, accomp: "Riz ou foutou" },
    { cat: "plats", nom: "Biokosseu attié", desc: "Poisson mijoté à l'étouffée aux épices attié.", prix: 8000, region: "sud", signature: true, accomp: "Attiéké" },
    { cat: "plats", nom: "Kedjenou de poulet", desc: "Poulet fermier cuit dans son jus en canari, sans eau ajoutée.", prix: 7000, region: "centre", accomp: "Attiéké ou riz" },
    { cat: "plats", nom: "Foutou banane, sauce claire", desc: "Foutou pilé minute, sauce claire au mouton.", prix: 6500, region: "centre", accomp: "Foutou banane" },
    { cat: "plats", nom: "Placali, sauce kopè", desc: "Pâte de manioc fermenté, sauce gluante au poisson fumé.", prix: 6000, region: "sud", accomp: "Placali" },
    { cat: "plats", nom: "Kabato, sauce gombo", desc: "Tô de maïs, sauce gombo sec à la viande de bœuf.", prix: 5500, region: "nord", accomp: "Kabato" },
    { cat: "plats", nom: "Sauce arachide", desc: "Pâte d'arachide grillée, poulet, piment doux.", prix: 6500, region: "centre", accomp: "Riz blanc" },

    { cat: "grillades", nom: "Attiéké poisson braisé", desc: "Carpe ou capitaine à la braise, oignons, tomate, piment.", prix: 8500, region: "sud", signature: true, accomp: "Attiéké" },
    { cat: "grillades", nom: "Poulet braisé", desc: "Poulet bicyclette mariné, braisé lentement.", prix: 7000, region: "abidjan", accomp: "Alloco ou attiéké" },
    { cat: "grillades", nom: "Choukouya de mouton", desc: "Mouton grillé, épices du nord, oignons crus.", prix: 6000, region: "nord" },

    { cat: "desserts", nom: "Dêguê", desc: "Mil et lait caillé sucré, frais.", prix: 2000, region: "nord" },
    { cat: "desserts", nom: "Claclo", desc: "Beignets de banane très mûre, croustillants.", prix: 2000, region: "centre" },
    { cat: "desserts", nom: "Fruits du marché", desc: "Ananas, papaye, mangue selon la saison.", prix: 2500, region: "sud" },

    { cat: "boissons", nom: "Bissap", desc: "Fleurs d'hibiscus, menthe, servi glacé.", prix: 1500, region: "abidjan" },
    { cat: "boissons", nom: "Gnamakoudji", desc: "Jus de gingembre pressé, citron vert.", prix: 1500, region: "abidjan" },
    { cat: "boissons", nom: "Tomi", desc: "Jus de tamarin, légèrement acidulé.", prix: 1500, region: "nord" },
    { cat: "boissons", nom: "Bangui", desc: "Vin de palme frais du jour.", prix: 2000, region: "est" }
  ]
};

window.formatPrix = (n) => n.toLocaleString("fr-FR").replace(/ | /g, " ") + " F";
