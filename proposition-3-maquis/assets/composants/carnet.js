// Composant « carnet de recettes » : cahier Seyès dont on tourne les pages.
// Usage : CookCarnet.monter(element, { plats, categories, recits, logo, telHref, tel })
// Thème : variables CSS --ck-bouton, --ck-bouton-txt, --ck-bouton2, --ck-bouton2-txt, --ck-ui, --ck-hauteur.
(function () {
  const CSS = `
  .ck-carnet { --ligne: 32px; --violet: #B4A6DA; --violet-pale: #E2DCF2; --marge: #E0505A; --stylo: #1D2A6B; --stylo-rouge: #B30807;
    display: grid; gap: 12px; font-family: var(--ck-ui, system-ui, sans-serif); outline: none; }
  .ck-livre { position: relative; perspective: 2000px; height: var(--ck-hauteur, min(76dvh, 720px)); touch-action: pan-y; user-select: none; -webkit-user-select: none; }
  .ck-page { position: absolute; inset: 0; border-radius: 4px 14px 14px 4px; overflow: hidden; transform-origin: left center; backface-visibility: hidden; -webkit-backface-visibility: hidden;
    box-shadow: 0 16px 34px rgba(0,0,0,.28), inset 8px 0 14px -10px rgba(0,0,0,.35); will-change: transform; }
  .ck-dessous { visibility: hidden; } .ck-dessous.ck-visible { visibility: visible; }
  .ck-ombre { position: absolute; inset: 0; pointer-events: none; background: linear-gradient(90deg, rgba(0,0,0,.25), transparent 40%); opacity: 0; }
  .ck-feuille { position: relative; height: 100%; overflow-y: auto; background-color: #FDFBF6; color: var(--stylo); font: 400 19px/var(--ligne) "Kalam", cursive;
    background-image: linear-gradient(90deg, transparent 51px, var(--marge) 51px, var(--marge) 53px, transparent 53px), linear-gradient(var(--violet) 1px, transparent 1px), linear-gradient(var(--violet-pale) 1px, transparent 1px), linear-gradient(90deg, var(--violet-pale) 1px, transparent 1px);
    background-size: 100% 100%, 100% var(--ligne), 100% calc(var(--ligne) / 4), var(--ligne) 100%; background-position: 0 0, 0 23px, 0 23px, 21px 0; background-attachment: local;
    padding: 24px 18px 40px 66px; scrollbar-width: none; }
  .ck-feuille::-webkit-scrollbar { display: none; }
  .ck-numero { position: absolute; top: 6px; right: 16px; font: 700 16px "Kalam", cursive; opacity: .7; }
  .ck-titre { margin-bottom: var(--ligne); }
  .ck-feuille h3 { display: inline; font: 700 30px/var(--ligne) "Kalam", cursive; color: var(--stylo); text-decoration: underline var(--stylo-rouge) 3px; text-underline-offset: 6px; }
  .ck-feuille p { margin: 0 0 var(--ligne); }
  .ck-feuille b { font-weight: 700; color: var(--stylo-rouge); }
  .ck-feuille a { color: var(--stylo-rouge); font-weight: 700; }
  .ck-polaroid { float: right; width: 46%; margin: 4px -4px 12px 14px; padding: 8px 8px 0; background: #fff; box-shadow: 0 6px 16px rgba(0,0,0,.22); transform: rotate(3deg); position: relative; }
  .ck-polaroid::before, .ck-polaroid::after { content: ""; position: absolute; width: 56px; height: 20px; background: rgba(241,197,14,.55); top: -9px; }
  .ck-polaroid::before { left: -14px; transform: rotate(-32deg); } .ck-polaroid::after { right: -14px; transform: rotate(32deg); }
  .ck-polaroid svg, .ck-polaroid img { display: block; width: 100%; height: auto; }
  .ck-polaroid figcaption { font: 400 15px/28px "Kalam", cursive; color: #555; text-align: center; }
  .ck-note { color: var(--stylo-rouge); transform: rotate(-1.5deg); transform-origin: left; }
  .ck-prix { display: inline-block; font: 700 24px/1 "Kalam", cursive; color: var(--stylo-rouge); padding: 8px 16px; border: 2.5px solid var(--stylo-rouge); border-radius: 50% 46% 52% 44% / 54% 50% 48% 46%; transform: rotate(-4deg); }
  .ck-sceau { display: inline-block; font: 700 15px/1.2 "Kalam", cursive; color: #fff; background: var(--stylo-rouge); padding: 2px 10px; border-radius: 4px; transform: rotate(-3deg); margin-left: 6px; vertical-align: middle; }
  .ck-couverture { position: relative; height: 100%; display: grid; place-items: center; background: #000; }
  .ck-couverture svg.ck-wax { position: absolute; inset: 0; width: 100%; height: 100%; }
  .ck-etiquette { position: relative; width: min(78%, 360px); background: #fff; border-radius: 10px; padding: 18px 20px; color: var(--stylo); font-family: "Kalam", cursive; box-shadow: 0 10px 30px rgba(0,0,0,.4); border: 2px solid var(--stylo); }
  .ck-etiquette .ck-l { border-bottom: 1.5px solid var(--violet); padding: 2px 0; display: flex; gap: 8px; align-items: baseline; }
  .ck-etiquette .ck-l + .ck-l { margin-top: 6px; }
  .ck-etiquette small { font: 500 13px var(--ck-ui, system-ui); color: #6b6b8a; flex: none; }
  .ck-etiquette strong { font-size: 26px; line-height: 1.1; }
  .ck-etiquette img { height: 34px; display: block; margin: 0 auto 10px; border-radius: 6px; }
  .ck-ouvrir { position: absolute; bottom: 20px; left: 0; right: 0; text-align: center; font: 700 15px var(--ck-ui, system-ui); color: #fff; text-shadow: 0 1px 6px #000; }
  .ck-sommaire ol { list-style: none; padding: 0; }
  .ck-sommaire li { display: flex; align-items: baseline; }
  .ck-sommaire li.ck-cat { margin-top: var(--ligne); font-weight: 700; color: var(--stylo-rouge); }
  .ck-sommaire button { all: unset; cursor: pointer; display: flex; width: 100%; gap: 6px; align-items: baseline; }
  .ck-sommaire button:focus-visible { outline: 2px solid var(--stylo-rouge); }
  .ck-points { flex: 1; border-bottom: 2px dotted var(--violet); transform: translateY(-6px); }
  .ck-commandes { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 8px; }
  .ck-commandes > button { border: var(--ck-bordure, 0); background: var(--ck-bouton2, rgba(0,0,0,.08)); color: var(--ck-bouton2-txt, inherit); border-radius: 999px; padding: 12px 16px; font-weight: 700; font-size: 15px; cursor: pointer; }
  .ck-commandes > button:disabled { opacity: .35; cursor: default; }
  .ck-commandes .ck-prec { justify-self: start; } .ck-commandes .ck-suiv { justify-self: end; background: var(--ck-bouton, #000); color: var(--ck-bouton-txt, #fff); }
  .ck-milieu { display: grid; justify-items: center; font-size: 13px; }
  .ck-milieu button { all: unset; cursor: pointer; font-weight: 700; font-size: 14px; text-decoration: underline; text-underline-offset: 3px; padding: 2px 6px; }
  .ck-milieu button:focus-visible { outline: 2px solid currentColor; border-radius: 4px; }
  @media (min-width: 1000px) { .ck-feuille { font-size: 21px; padding-left: 80px; background-image: linear-gradient(90deg, transparent 63px, var(--marge) 63px, var(--marge) 65px, transparent 65px), linear-gradient(var(--violet) 1px, transparent 1px), linear-gradient(var(--violet-pale) 1px, transparent 1px), linear-gradient(90deg, var(--violet-pale) 1px, transparent 1px); } }`;

  function motifWax(N, taille) {
    let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647, pick = a => a[Math.floor(rnd() * a.length)];
    const T = taille / N, PAL = ["#F1C50E", "#B30807", "#000", "#E8550F", "#FFFDF6"]; let out = "";
    for (let y = 0; y < N * 1.6; y++) for (let x = 0; x < N; x++) {
      const X = x * T, Y = y * T, cx = X + T / 2, cy = Y + T / 2, fond = pick(PAL), pal = PAL.filter(c => c !== fond), type = pick(["cible", "quart", "pois", "cible"]);
      let g = `<rect x="${X}" y="${Y}" width="${T}" height="${T}" fill="${fond}"/>`;
      if (type === "cible") [0.46, 0.34, 0.22, 0.1].forEach((r, i) => g += `<circle cx="${cx}" cy="${cy}" r="${T * r}" fill="${i % 2 ? fond : pal[i % pal.length]}"/>`);
      else if (type === "quart") { const k = pick([[X, Y], [X + T, Y], [X, Y + T], [X + T, Y + T]]); [1, 0.7, 0.4].forEach((r, i) => g += `<circle cx="${k[0]}" cy="${k[1]}" r="${T * r}" fill="${i % 2 ? fond : pal[(i + 1) % pal.length]}"/>`); }
      else for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) g += `<circle cx="${X + T * (i + .5) / 3}" cy="${Y + T * (j + .5) / 3}" r="${T * .1}" fill="${pal[1]}"/>`;
      out += `<clipPath id="ckw${x}_${y}"><rect x="${X}" y="${Y}" width="${T}" height="${T}"/></clipPath><g clip-path="url(#ckw${x}_${y})">${g}</g>`;
    }
    return `<svg class="ck-wax" viewBox="0 0 ${taille} ${taille * 1.6}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${out}</svg>`;
  }

  function monter(hote, o) {
    if (!document.getElementById("ck-carnet-css")) {
      const st = document.createElement("style"); st.id = "ck-carnet-css"; st.textContent = CSS; document.head.appendChild(st);
      const f = document.createElement("link"); f.rel = "stylesheet"; f.href = "https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&display=swap"; document.head.appendChild(f);
    }
    const REDUIT = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const plats = o.categories.flatMap(c => o.plats.filter(p => p.cat === c.id));
    const DEBUT = 2, pages = [];
    pages.push(`<div class="ck-couverture">${motifWax(4, 400)}
      <div class="ck-etiquette"><img src="${o.logo}" alt="">
        <div class="ck-l"><small>Cahier de</small><strong>recettes de la maison</strong></div>
        <div class="ck-l"><small>Classe</small><span>Cuisine de tout le pays</span></div>
        <div class="ck-l"><small>École</small><span>Cook Africa, 2 Plateaux</span></div></div>
      <div class="ck-ouvrir">Glissez ou touchez « Suivante » pour ouvrir</div></div>`);
    pages.push(`<div class="ck-feuille ck-sommaire"><span class="ck-numero">1</span><div class="ck-titre"><h3>Sommaire</h3></div><ol>` +
      o.categories.map(c => `<li class="ck-cat">${c.nom}</li>` + plats.map((p, i) => p.cat === c.id ? `<li><button type="button" data-page="${i + DEBUT}">${p.nom}<span class="ck-points"></span>p. ${i + DEBUT}</button></li>` : "").join("")).join("") + `</ol></div>`);
    plats.forEach((p, i) => {
      const r = o.recits[p.nom] || {};
      pages.push(`<div class="ck-feuille"><span class="ck-numero">${i + DEBUT}</span>
        <div class="ck-titre"><h3>${p.nom}</h3>${p.signature ? ' <span class="ck-sceau">Signature</span>' : ""}</div>
        <figure class="ck-polaroid">${p.photo ? `<img src="${p.photo}" alt="${p.nom}">` : illustration(p)}<figcaption>${p.accomp ? "avec " + p.accomp.toLowerCase() : "fait maison"}</figcaption></figure>
        <p><b>D'où ça vient :</b> ${r.origine || "La maison"}</p>
        <p>${r.recit || p.desc}</p>
        ${r.seMange ? `<p><b>Comment on le mange :</b> ${r.seMange}</p>` : ""}
        ${r.note ? `<p class="ck-note">NB : ${r.note}</p>` : ""}
        <p><span class="ck-prix">${formatPrix(p.prix)}</span></p></div>`);
    });
    pages.push(`<div class="ck-feuille"><span class="ck-numero">${pages.length}</span><div class="ck-titre"><h3>Bon appétit</h3></div>
      <p>Un plat vous fait envie ? Appelez-nous pour réserver ou commander.</p>
      <p><a href="${o.telHref}">${o.tel}</a></p><p class="ck-note">NB : venir avec appétit !</p></div>`);

    hote.classList.add("ck-carnet"); hote.tabIndex = 0;
    hote.setAttribute("aria-roledescription", "carnet");
    hote.innerHTML = `<div class="ck-livre" aria-live="polite"><section class="ck-page ck-dessous"></section><section class="ck-page ck-dessus"></section></div>
      <nav class="ck-commandes" aria-label="Tourner les pages"><button class="ck-prec" type="button">‹ Précédente</button>
      <div class="ck-milieu"><span class="ck-compteur"></span><button type="button" class="ck-vers-sommaire">Sommaire</button></div>
      <button class="ck-suiv" type="button">Suivante ›</button></nav>`;
    const livre = hote.querySelector(".ck-livre"), dessus = hote.querySelector(".ck-dessus"), dessous = hote.querySelector(".ck-dessous");
    const prec = hote.querySelector(".ck-prec"), suiv = hote.querySelector(".ck-suiv"), compteur = hote.querySelector(".ck-compteur");
    let i = 0, occupe = false;
    const remplir = (el, n) => { el.innerHTML = pages[n] + '<div class="ck-ombre"></div>'; };
    function afficher() {
      remplir(dessus, i); dessus.style.transform = ""; dessous.classList.remove("ck-visible");
      prec.disabled = i === 0; suiv.disabled = i === pages.length - 1;
      compteur.textContent = i === 0 ? "Couverture" : `Page ${i} sur ${pages.length - 1}`;
    }
    function feuilleter(de, a, ensuite) {
      occupe = true;
      const fini = () => { occupe = false; ensuite(); };
      if (REDUIT) return fini();
      const anim = dessus.animate([{ transform: `rotateY(${de}deg)` }, { transform: `rotateY(${a}deg)` }], { duration: 520 * Math.abs(a - de) / 180 + 80, easing: "cubic-bezier(.3,.6,.2,1)", fill: "forwards" });
      const ombre = dessous.querySelector(".ck-ombre");
      if (ombre) ombre.animate([{ opacity: a < de ? .9 : 0 }, { opacity: a < de ? 0 : .9 }], { duration: 520 });
      anim.onfinish = () => { anim.cancel(); fini(); };
    }
    function suivante(depuis = 0) { if (occupe || i >= pages.length - 1) return; remplir(dessous, i + 1); dessous.classList.add("ck-visible"); feuilleter(depuis, -180, () => { i++; afficher(); }); }
    function precedente(depuis = -180) { if (occupe || i <= 0) return; remplir(dessous, i); dessous.classList.add("ck-visible"); remplir(dessus, i - 1); feuilleter(depuis, 0, () => { i--; afficher(); }); }
    function allerA(n) {
      if (occupe || n === i) return;
      if (n === i + 1) return suivante(); if (n === i - 1) return precedente();
      remplir(dessous, n); dessous.classList.add("ck-visible");
      if (n > i) feuilleter(0, -180, () => { i = n; afficher(); });
      else { remplir(dessus, n); remplir(dessous, i); feuilleter(-180, 0, () => { i = n; afficher(); }); }
    }
    prec.addEventListener("click", () => precedente());
    suiv.addEventListener("click", () => suivante());
    hote.querySelector(".ck-vers-sommaire").addEventListener("click", () => allerA(1));
    livre.addEventListener("click", e => { const b = e.target.closest("[data-page]"); if (b) allerA(+b.dataset.page); });
    // Flèches du clavier, seulement quand le carnet est à l'écran
    let visible = false;
    new IntersectionObserver(([e]) => visible = e.intersectionRatio > .5, { threshold: [0, .5, 1] }).observe(livre);
    addEventListener("keydown", e => {
      if (!visible || /input|textarea/i.test(document.activeElement?.tagName)) return;
      if (e.key === "ArrowRight") suivante(); if (e.key === "ArrowLeft") precedente();
    });
    // Glisser du doigt : la page suit, puis se tourne ou revient
    let x0 = null, y0 = 0, sens = null, angle = 0;
    livre.addEventListener("pointerdown", e => { if (occupe || e.button > 0) return; x0 = e.clientX; y0 = e.clientY; sens = null; });
    livre.addEventListener("pointermove", e => {
      if (x0 === null || occupe) return;
      const dx = e.clientX - x0, w = livre.clientWidth;
      if (!sens) {
        if (Math.abs(e.clientY - y0) > Math.abs(dx) + 4) { x0 = null; return; } // geste vertical : on laisse défiler
        if (Math.abs(dx) < 12) return;
        if (dx < 0 && i < pages.length - 1) { sens = "suiv"; remplir(dessous, i + 1); }
        else if (dx > 0 && i > 0) { sens = "prec"; remplir(dessous, i); remplir(dessus, i - 1); }
        else { x0 = null; return; }
        dessous.classList.add("ck-visible"); livre.setPointerCapture(e.pointerId);
      }
      angle = sens === "suiv" ? Math.max(-180, Math.min(0, dx / w * 200)) : Math.max(-180, Math.min(0, -180 + dx / w * 200));
      dessus.style.transform = `rotateY(${angle}deg)`;
    });
    const lacher = () => {
      if (x0 === null) return; x0 = null; if (!sens) return;
      const s = sens; sens = null; dessus.style.transform = "";
      if (s === "suiv") { if (angle < -50) feuilleter(angle, -180, () => { i++; afficher(); }); else feuilleter(angle, 0, afficher); }
      else { if (angle > -130) feuilleter(angle, 0, () => { i--; afficher(); }); else feuilleter(angle, -180, afficher); }
    };
    livre.addEventListener("pointerup", lacher); livre.addEventListener("pointercancel", lacher);
    afficher();
    return { allerA };
  }
  window.CookCarnet = { monter };
})();
