// Composant « stories » : un plat par écran, on glisse ou on touche à gauche / à droite.
// Usage : const s = CookStories.monter(element, { categories, recits, telHref });
//         s.afficher(plats, titre, texte)  — remplace le contenu (ex. après un filtre).
// Option : regions { id: nom } affiche un badge « Région » distinct du nom du plat.
// Thème : --ck-titre (police des titres), --ck-titre-plat (nom des plats), --ck-texte, --ck-hauteur.
(function () {
  const CSS = `
  .ck-stories { position: relative; container-type: size; height: var(--ck-hauteur, min(82dvh, 760px)); border-radius: 28px; overflow: hidden; background: #000; color: #fff; font-family: var(--ck-texte, system-ui, sans-serif); box-shadow: 0 24px 60px rgba(0,0,0,.4); }
  .ck-fil { display: flex; height: 100%; overflow-x: auto; overflow-y: hidden; scroll-snap-type: x mandatory; overscroll-behavior-x: contain; scrollbar-width: none; }
  .ck-fil::-webkit-scrollbar { display: none; }
  .ck-story { position: relative; flex: 0 0 100%; height: 100%; scroll-snap-align: start; scroll-snap-stop: always; display: grid; grid-template-rows: minmax(0, 1fr) auto; padding: 96px 20px 22px; background: var(--fond); color: var(--txt); overflow: hidden; }
  .ck-story::before { content: ""; position: absolute; inset: 0; background: radial-gradient(70% 45% at 50% 36%, rgba(255,255,255,.16), transparent 70%); pointer-events: none; }
  .ck-visuel { position: relative; display: grid; place-items: center; min-height: 0; }
  .ck-plat { width: min(70cqw, 34cqh, 360px); aspect-ratio: 1; filter: drop-shadow(0 22px 30px rgba(0,0,0,.4)); transition: transform .55s cubic-bezier(.2,.8,.2,1), opacity .4s; transform: rotate(-12deg) scale(.9); opacity: 0; }
  .ck-plat svg, .ck-plat img { width: 100%; height: 100%; display: block; object-fit: cover; border-radius: 50%; }
  .ck-story.ck-vue .ck-plat { transform: none; opacity: 1; }
  .ck-vapeur { position: absolute; top: 2%; left: 50%; width: 120px; height: 110px; transform: translateX(-50%); pointer-events: none; opacity: 0; transition: opacity .6s .3s; }
  .ck-story.ck-vue .ck-vapeur { opacity: 1; }
  .ck-vapeur i { position: absolute; bottom: 0; width: 26px; height: 64px; border-radius: 50%; background: rgba(255,255,255,.5); filter: blur(10px); animation: ck-monte 3.4s ease-in infinite; }
  .ck-vapeur i:nth-child(1) { left: 20px; } .ck-vapeur i:nth-child(2) { left: 48px; animation-delay: 1.1s; } .ck-vapeur i:nth-child(3) { left: 76px; animation-delay: 2.2s; }
  @keyframes ck-monte { 0% { transform: translateY(30px) scaleX(.6); opacity: 0; } 30% { opacity: .9; } 100% { transform: translateY(-60px) scaleX(1.4); opacity: 0; } }
  .ck-texte { position: relative; display: grid; gap: 6px; }
  .ck-lieu { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; }
  .ck-region { display: inline-flex; align-items: center; gap: 6px; padding: 4px 11px 4px 8px; border-radius: 999px; background: var(--txt); color: var(--fond); font-size: 13px; font-weight: 500; }
  .ck-region b { font-weight: 700; }
  .ck-region svg { width: 14px; height: 14px; flex: none; }
  .ck-terroir { font-size: 13px; font-style: italic; opacity: .85; }
  .ck-kicker { font-size: 13px; font-weight: 600; opacity: .8; }
  .ck-details { display: grid; grid-template-columns: auto 1fr; gap: 3px 10px; margin-top: 4px; padding-top: 8px; border-top: 1px solid color-mix(in srgb, var(--txt) 30%, transparent); font-size: 14px; }
  .ck-details dt { font-weight: 700; }
  .ck-details dd { margin: 0; opacity: .92; }
  .ck-origine { font-size: 14px; font-weight: 500; opacity: .85; }
  .ck-story h3 { font: 800 clamp(30px, 9cqw, 50px)/1 var(--ck-titre, system-ui); letter-spacing: -0.015em; }
  .ck-story h3.ck-nom { font: 400 clamp(32px, 10cqw, 54px)/1.02 var(--ck-titre-plat, var(--ck-titre, system-ui)); margin: 2px 0; }
  .ck-desc { font-size: 16px; line-height: 1.45; }
  .ck-pied { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 10px; }
  .ck-prix { font: 800 24px var(--ck-titre, system-ui); }
  .ck-commander { display: inline-flex; align-items: center; gap: 8px; padding: 12px 18px; border-radius: 999px; background: var(--txt); color: var(--fond); text-decoration: none; font-weight: 600; }
  .ck-commander svg { width: 18px; height: 18px; }
  .ck-sceau { justify-self: start; font-size: 13px; font-weight: 600; padding: 3px 10px; border-radius: 999px; border: 1.5px solid currentColor; }
  .ck-couv { grid-template-rows: 1fr auto; }
  .ck-couv h3 { font-size: clamp(34px, 11cqw, 60px); }
  .ck-eventail { position: relative; align-self: center; height: 40cqh; }
  .ck-eventail div { position: absolute; top: 50%; left: 50%; width: min(40cqw, 24cqh, 190px); aspect-ratio: 1; filter: drop-shadow(0 14px 22px rgba(0,0,0,.35)); }
  .ck-eventail div:nth-child(1) { transform: translate(-108%, -44%) rotate(-14deg); }
  .ck-eventail div:nth-child(2) { transform: translate(-50%, -58%); z-index: 1; }
  .ck-eventail div:nth-child(3) { transform: translate(8%, -42%) rotate(12deg); }
  .ck-eventail div:only-child { transform: translate(-50%, -50%); width: min(60cqw, 36cqh, 260px); }
  .ck-glisser { font-weight: 600; font-size: 14px; margin-top: 14px; opacity: .9; }
  .ck-haut { position: absolute; z-index: 3; top: 0; left: 0; right: 0; padding: 12px 12px 10px; background: linear-gradient(rgba(0,0,0,.35), transparent); }
  .ck-barres { display: flex; gap: 3px; }
  .ck-barres span { flex: 1; height: 3px; border-radius: 3px; background: rgba(255,255,255,.35); overflow: hidden; }
  .ck-barres i { display: block; height: 100%; background: #fff; transform-origin: left; transform: scaleX(0); }
  .ck-chips { display: flex; gap: 6px; margin: 10px -12px 0; padding: 0 12px; overflow-x: auto; scrollbar-width: none; }
  .ck-chips::-webkit-scrollbar { display: none; }
  .ck-chips button { flex: none; padding: 7px 13px; border-radius: 999px; border: 0; background: rgba(0,0,0,.3); color: #fff; font: 600 13px var(--ck-texte, system-ui); cursor: pointer; backdrop-filter: blur(6px); }
  .ck-chips button[aria-current="true"] { background: #fff; color: #000; }
  .ck-chips button, .ck-fleche, .ck-commander { transition: scale .12s ease-out; }
  .ck-chips button:active, .ck-fleche:active, .ck-commander:active { scale: .95; }
  .ck-fleche { position: absolute; z-index: 3; top: 50%; width: 44px; height: 44px; margin-top: -22px; border-radius: 50%; border: 0; background: rgba(255,255,255,.85); color: #000; font: 700 22px/1 system-ui; cursor: pointer; display: none; }
  .ck-fleche:disabled { opacity: 0; pointer-events: none; }
  .ck-fleche.ck-g { left: 10px; } .ck-fleche.ck-d { right: 10px; }
  @media (hover: hover) { .ck-fleche { display: block; } }
  @media (prefers-reduced-motion: reduce) { .ck-plat { transition: opacity .2s; transform: none; } .ck-vapeur { display: none; } .ck-chips button:active, .ck-fleche:active, .ck-commander:active { scale: none; opacity: .8; } }`;

  const TEINTES = {
    entrees: { fond: "#E8550F", txt: "#FFF8E6" }, plats: { fond: "#B30807", txt: "#FFF8E6" }, grillades: { fond: "#24120B", txt: "#F1C50E" },
    desserts: { fond: "#F1C50E", txt: "#3A0A04" }, boissons: { fond: "#6E0703", txt: "#F7E3A1" }
  };
  const CHAUD = new Set(["entrees", "plats", "grillades"]);
  const REPERE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>`;
  const TEL = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2"/></svg>`;

  function monter(hote, o) {
    if (!document.getElementById("ck-stories-css")) { const st = document.createElement("style"); st.id = "ck-stories-css"; st.textContent = CSS; document.head.appendChild(st); }
    hote.classList.add("ck-stories");
    hote.setAttribute("aria-roledescription", "stories");
    hote.innerHTML = `<div class="ck-haut"><div class="ck-barres" aria-hidden="true"></div><nav class="ck-chips" aria-label="Rubriques"></nav></div>
      <div class="ck-fil" tabindex="0"></div>
      <button class="ck-fleche ck-g" type="button" aria-label="Plat précédent">‹</button><button class="ck-fleche ck-d" type="button" aria-label="Plat suivant">›</button>`;
    const fil = hote.querySelector(".ck-fil"), barres = hote.querySelector(".ck-barres"), chips = hote.querySelector(".ck-chips");
    const fg = hote.querySelector(".ck-g"), fd = hote.querySelector(".ck-d");
    const REDUIT = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let stories = [], liste = [], courant = 0;

    function aller(n) { n = Math.max(0, Math.min(stories.length - 1, n)); fil.scrollTo({ left: n * fil.clientWidth, behavior: REDUIT ? "auto" : "smooth" }); }
    let traits = [];
    function maj() {
      const pos = fil.scrollLeft / Math.max(fil.clientWidth, 1), n = Math.round(pos);
      // La progression suit le doigt en continu, pas story par story.
      traits.forEach((t, k) => t.style.transform = `scaleX(${Math.max(0, Math.min(1, pos - k))})`);
      if (n === courant && stories[n]?.classList.contains("ck-vue")) return;
      stories.forEach((s, k) => s.classList.toggle("ck-vue", k === n));
      courant = n;
      const cat = stories[n]?.dataset.cat;
      chips.querySelectorAll("button").forEach(b => b.setAttribute("aria-current", b.dataset.cat === cat));
      fg.disabled = n === 0; fd.disabled = n === stories.length - 1;
    }
    let raf; fil.addEventListener("scroll", () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(maj); }, { passive: true });
    addEventListener("resize", () => { fil.scrollLeft = courant * fil.clientWidth; });
    fg.addEventListener("click", () => aller(courant - 1)); fd.addEventListener("click", () => aller(courant + 1));
    fil.addEventListener("keydown", e => { if (e.key === "ArrowRight") { e.preventDefault(); aller(courant + 1); } if (e.key === "ArrowLeft") { e.preventDefault(); aller(courant - 1); } });
    // Toucher à droite = suivant, à gauche = précédent
    let x0 = 0; fil.addEventListener("pointerdown", e => x0 = e.clientX);
    fil.addEventListener("click", e => {
      if (e.target.closest("a, button") || Math.abs(e.clientX - x0) > 8) return;
      const r = fil.getBoundingClientRect(), x = (e.clientX - r.left) / r.width;
      if (x > .6) aller(courant + 1); else if (x < .3) aller(courant - 1);
    });

    function afficher(plats, titre, texte) {
      liste = o.categories.flatMap(c => plats.filter(p => p.cat === c.id));
      const sig = (liste.filter(p => p.signature).length ? liste.filter(p => p.signature) : liste).slice(0, 3);
      let h = `<article class="ck-story ck-couv" style="--fond:var(--ck-couv-fond, #F1C50E);--txt:var(--ck-couv-txt, #3A0A04)" aria-label="${titre}">
        <div class="ck-eventail" aria-hidden="true">${sig.map(p => `<div>${p.photo ? `<img src="${p.photo}" alt="">` : illustration(p)}</div>`).join("")}</div>
        <div class="ck-texte">${typeof texte === "object"
          ? `<span class="ck-kicker">Région · ${liste.length} plat${liste.length > 1 ? "s" : ""}</span><h3>${titre}</h3>
             <p class="ck-desc">${texte.texte}</p><dl class="ck-details"><dt>Peuples</dt><dd>${texte.peuple}</dd></dl>`
          : `<span class="ck-origine">${liste.length} plat${liste.length > 1 ? "s" : ""}</span><h3>${titre}</h3><p class="ck-desc">${texte}</p>`}
        <p class="ck-glisser">Glissez vers la gauche ou touchez à droite pour voir les plats.</p></div></article>`;
      liste.forEach(p => {
        const t = TEINTES[p.cat] || TEINTES.plats, r = o.recits[p.nom] || {};
        const region = o.regions && o.regions[p.region];
        const lieu = region
          ? `<div class="ck-lieu"><span class="ck-region">${REPERE}Région <b>${region}</b></span>${r.origine ? `<span class="ck-terroir">${r.origine}</span>` : ""}</div>`
          : `<span class="ck-origine">${r.origine || ""}${p.accomp ? `, servi avec ${p.accomp.toLowerCase()}` : ""}</span>`;
        const details = region ? [["Servi avec", p.accomp], ["Se mange", r.seMange]].filter(d => d[1]) : [];
        h += `<article class="ck-story" style="--fond:${t.fond};--txt:${t.txt}" data-cat="${p.cat}" aria-label="${p.nom}, ${formatPrix(p.prix)}">
          <div class="ck-visuel">${CHAUD.has(p.cat) ? '<div class="ck-vapeur" aria-hidden="true"><i></i><i></i><i></i></div>' : ""}
            <div class="ck-plat">${p.photo ? `<img src="${p.photo}" alt="${p.nom}" loading="lazy">` : illustration(p)}</div></div>
          <div class="ck-texte">${p.signature ? '<span class="ck-sceau">Signature de la maison</span>' : ""}
            ${lieu}
            <h3 class="ck-nom">${p.nom}</h3><p class="ck-desc">${p.desc}</p>
            ${details.length ? `<dl class="ck-details">${details.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("")}</dl>` : ""}
            <div class="ck-pied"><span class="ck-prix">${formatPrix(p.prix)}</span><a class="ck-commander" href="${o.telHref}">${TEL}Commander</a></div></div></article>`;
      });
      fil.innerHTML = h;
      stories = [...fil.querySelectorAll(".ck-story")];
      barres.innerHTML = liste.map(() => "<span><i></i></span>").join("");
      traits = [...barres.querySelectorAll("i")]; courant = -1;
      const cats = o.categories.filter(c => liste.some(p => p.cat === c.id));
      chips.innerHTML = cats.length > 1 ? cats.map(c => `<button type="button" data-cat="${c.id}">${c.nom}</button>`).join("") : "";
      chips.querySelectorAll("button").forEach(b => b.addEventListener("click", () => aller(stories.findIndex(s => s.dataset.cat === b.dataset.cat))));
      fil.scrollLeft = 0; maj();
    }
    return { afficher, aller };
  }
  window.CookStories = { monter };
})();
