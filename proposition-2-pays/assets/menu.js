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
    { cat: "entrees", nom: "Soupe d'escargot", desc: "De gros escargots de forêt, tendres et charnus, qui mijotent longtemps avec l'aubergine et le piment frais. Un bouillon chaud et relevé, qui réveille.", prix: 6000, region: "est", signature: true },
    { cat: "entrees", nom: "Alloco & œuf", desc: "Des rondelles de plantain bien mûr, caramélisées et dorées dans l'huile chaude, avec un œuf dur et une sauce tomate qui pique juste ce qu'il faut.", prix: 2500, region: "abidjan" },
    { cat: "entrees", nom: "Gbofloto", desc: "Des petites boules dorées, croustillantes dehors et toutes moelleuses dedans. Elles arrivent tièdes, et partent vite.", prix: 2000, region: "abidjan" },

    { cat: "plats", nom: "Sauce graine au tikriti", desc: "Une sauce épaisse et veloutée, couleur rouille, où la graine de palme pilée rencontre le tikriti fermenté et la viande fumée : profonde, longue en bouche.", prix: 7500, region: "ouest", signature: true, accomp: "Riz ou foutou" },
    { cat: "plats", nom: "Biokosseu attié", desc: "Un poisson cuit doucement à l'étouffée dans ses épices attié. La chair reste fondante et se gorge d'un jus parfumé, légèrement fumé.", prix: 8000, region: "sud", signature: true, accomp: "Attiéké" },
    { cat: "plats", nom: "Kedjenou de poulet", desc: "Le poulet fermier cuit dans son canari scellé, sans une goutte d'eau, avec tomate, oignon et piment. La viande se détache seule, le jus est concentré.", prix: 7000, region: "centre", accomp: "Attiéké ou riz" },
    { cat: "plats", nom: "Foutou banane, sauce claire", desc: "Un foutou lisse et souple, pilé à la minute, qui plonge dans une sauce claire au mouton, légère, pimentée et parfumée.", prix: 6500, region: "centre", accomp: "Foutou banane" },
    { cat: "plats", nom: "Placali, sauce kopè", desc: "Une pâte de manioc fermenté, brillante et légèrement acidulée, avec une sauce kopè onctueuse qui sent bon le poisson fumé.", prix: 6000, region: "sud", accomp: "Placali" },
    { cat: "plats", nom: "Kabato, sauce gombo", desc: "Le kabato, tô de maïs ferme et doux, accompagné d'une sauce gombo sec bien liée, au goût intense, avec de beaux morceaux de bœuf.", prix: 5500, region: "nord", accomp: "Kabato" },
    { cat: "plats", nom: "Sauce arachide", desc: "Une sauce dorée et généreuse à la pâte d'arachide grillée, où le poulet mijote jusqu'à devenir fondant. Douce, ronde, réconfortante.", prix: 6500, region: "centre", accomp: "Riz blanc" },

    { cat: "grillades", nom: "Attiéké poisson braisé", desc: "Carpe ou capitaine braisé, à la peau croustillante et à la chair fumée, sous une pluie d'oignons, de tomates fraîches et de piment.", prix: 8500, region: "sud", signature: true, accomp: "Attiéké" },
    { cat: "grillades", nom: "Poulet braisé", desc: "Le poulet bicyclette, ferme et goûteux, mariné longtemps puis braisé lentement jusqu'à ce que la peau dore et caramélise.", prix: 7000, region: "abidjan", accomp: "Alloco ou attiéké" },
    { cat: "grillades", nom: "Choukouya de mouton", desc: "Des morceaux de mouton saisis à la braise, roulés dans les épices du Nord et servis avec des oignons crus qui croquent.", prix: 6000, region: "nord" },

    { cat: "desserts", nom: "Dêguê", desc: "Des grains de mil tendres dans un lait caillé sucré, frais et légèrement acidulé. Le dessert qui désaltère.", prix: 2000, region: "nord" },
    { cat: "desserts", nom: "Claclo", desc: "De petites boules de banane très mûre frites minute : croustillantes dehors, fondantes et sucrées dedans.", prix: 2000, region: "centre" },
    { cat: "desserts", nom: "Fruits du marché", desc: "Ananas juteux, papaye fondante, mangue parfumée : le meilleur du marché du jour, coupé à la minute.", prix: 2500, region: "sud" },

    { cat: "boissons", nom: "Bissap", desc: "Une infusion d'hibiscus d'un rouge profond, fruitée et légèrement acidulée, relevée de menthe fraîche et servie glacée.", prix: 1500, region: "abidjan" },
    { cat: "boissons", nom: "Gnamakoudji", desc: "Du gingembre frais pressé, avec un trait de citron vert. Vif, piquant, il réveille dès la première gorgée.", prix: 1500, region: "abidjan" },
    { cat: "boissons", nom: "Tomi", desc: "Le jus de tamarin, doux et acidulé à la fois, avec une petite note de caramel. Très frais.", prix: 1500, region: "nord" },
    { cat: "boissons", nom: "Bangui", desc: "Le vin de palme tiré le matin même, blanc laiteux, légèrement pétillant et doux. À boire frais, le jour même.", prix: 2000, region: "est" }
  ]
};

window.formatPrix = (n) => n.toLocaleString("fr-FR").replace(/ | /g, " ") + " F";
