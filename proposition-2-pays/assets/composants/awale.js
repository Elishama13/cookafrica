// Composant « awalé » : chaque trou est une rubrique, chaque graine un plat. Nécessite Three.js (r128).
// Usage : CookAwale.monter(element, { plats, categories })
// Thème : --ck-titre, --ck-or, --ck-sable, --ck-carte, --ck-bord, --ck-fond-etiquette.
(function () {
  const CSS = `
  .ck-jeu { display: grid; gap: 8px; }
  .ck-plateau { position: relative; height: min(118vw, 64dvh); min-height: 420px; margin: 0 -16px; touch-action: pan-y; }
  .ck-plateau canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
  .ck-trous { position: absolute; inset: 0; pointer-events: none; }
  .ck-trou { position: absolute; left: 0; top: 0; pointer-events: auto; display: grid; justify-items: end; padding: 6px 10px; border: 0; border-radius: 12px; background: var(--ck-fond-etiquette, rgba(36,18,11,.72)); color: inherit; cursor: pointer; text-align: right; backdrop-filter: blur(4px); will-change: transform; transition: background .2s, color .2s; }
  .ck-trou b { font: 700 19px/1 var(--ck-titre, system-ui); text-transform: uppercase; }
  .ck-trou small { font-size: 12px; color: var(--ck-sable, #D9BFA0); }
  .ck-trou[aria-pressed="true"] { background: var(--ck-or, #F1C50E); color: #24120B; }
  .ck-trou[aria-pressed="true"] small { color: #4A2416; }
  .ck-sans3d .ck-trous { position: static; display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; padding: 0 16px; }
  .ck-sans3d .ck-trou { position: static; justify-items: start; text-align: left; transform: none !important; }
  .ck-sans3d.ck-plateau { height: auto; min-height: 0; }
  .ck-recolte { padding: 12px 0 8px; scroll-margin-top: 12px; }
  .ck-recolte h3 { font: 700 30px/1.05 var(--ck-titre, system-ui); text-transform: uppercase; color: var(--ck-or, #F1C50E); }
  .ck-vide { color: var(--ck-sable, #D9BFA0); margin-top: 6px; }
  .ck-graines { list-style: none; padding: 0; margin-top: 12px; display: grid; gap: 10px; }
  .ck-graines li { display: grid; grid-template-columns: auto 1fr auto; gap: 2px 12px; align-items: start; padding: 14px; border-radius: 16px; background: var(--ck-carte, #34190F); border: 1px solid var(--ck-bord, #4A2416); animation: ck-pousse .45s cubic-bezier(.2,.9,.25,1.3) backwards; }
  @keyframes ck-pousse { from { opacity: 0; transform: translateY(-14px) scale(.96); } }
  .ck-grain { width: 14px; height: 11px; margin-top: 6px; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #B8B5A2, #6E6C5C); }
  .ck-grain.ck-or { background: radial-gradient(circle at 35% 35%, #FFE27A, #C99A06); }
  .ck-graines strong { font-weight: 600; font-size: 17px; }
  .ck-graines p { grid-column: 2 / -1; color: var(--ck-sable, #D9BFA0); font-size: 15px; }
  .ck-graines .ck-prix { color: var(--ck-or, #F1C50E); font-weight: 600; white-space: nowrap; }
  @media (min-width: 720px) { .ck-plateau { margin: 0 -32px; } .ck-graines { grid-template-columns: 1fr 1fr; } }
  @media (min-width: 1024px) {
    .ck-jeu { grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr); gap: 32px; align-items: start; }
    .ck-plateau { height: min(52vh, 480px); margin: 0; }
    .ck-trou { justify-items: center; text-align: center; }
    .ck-recolte { padding-top: 40px; max-height: calc(100vh - 40px); overflow: auto; position: sticky; top: 20px; }
    .ck-graines { grid-template-columns: 1fr; }
  }
  @media (prefers-reduced-motion: reduce) { .ck-graines li { animation: none; } }`;

  function monter(hote, o) {
    if (!document.getElementById("ck-awale-css")) { const st = document.createElement("style"); st.id = "ck-awale-css"; st.textContent = CSS; document.head.appendChild(st); }
    const REDUIT = matchMedia("(prefers-reduced-motion: reduce)").matches;
    hote.classList.add("ck-jeu");
    hote.innerHTML = `<div class="ck-plateau"><div class="ck-trous" role="group" aria-label="Rubriques de la carte"></div></div>
      <div class="ck-recolte" aria-live="polite"><h3>Votre récolte</h3><p class="ck-vide">Rien de semé pour l'instant. Choisissez un trou.</p><ul class="ck-graines"></ul></div>`;
    const plateau = hote.querySelector(".ck-plateau"), trousEl = hote.querySelector(".ck-trous"), recolte = hote.querySelector(".ck-recolte"), liste = hote.querySelector(".ck-graines");

    // Six trous de notre côté : cinq rubriques + les signatures de la maison.
    const TROUS = [
      ...o.categories.map(c => ({ id: c.id, nom: c.nom.replace(" maison", "").replace(" du pays", ""), plats: o.plats.filter(p => p.cat === c.id) })),
      { id: "signatures", nom: "Signatures", plats: o.plats.filter(p => p.signature) }
    ].slice(0, 6);
    TROUS.forEach((t, k) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "ck-trou";
      b.innerHTML = `<b>${t.nom}</b><small>${t.plats.length} graine${t.plats.length > 1 ? "s" : ""}</small>`;
      b.addEventListener("click", () => semer(k));
      trousEl.appendChild(b); t.el = b;
    });
    function recolter(k) {
      const t = TROUS[k];
      recolte.querySelector("h3").textContent = t.id === "signatures" ? "Les signatures de la maison" : t.nom;
      recolte.querySelector(".ck-vide").hidden = true; liste.innerHTML = "";
    }
    function pousser(p) {
      liste.insertAdjacentHTML("beforeend", `<li><span class="ck-grain ${p.signature ? "ck-or" : ""}" aria-hidden="true"></span><strong>${p.nom}</strong><span class="ck-prix">${formatPrix(p.prix)}</span><p>${p.desc}${p.accomp ? ` Servi avec ${p.accomp.toLowerCase()}.` : ""}</p></li>`);
    }
    let semer = k => { TROUS.forEach((t, j) => t.el.setAttribute("aria-pressed", j === k)); recolter(k); TROUS[k].plats.forEach(pousser); };

    const webgl = (() => { try { const c = document.createElement("canvas"); return !!(window.THREE && (c.getContext("webgl2") || c.getContext("webgl"))); } catch { return false; } })();
    if (!webgl) { plateau.classList.add("ck-sans3d"); return { semer: k => semer(k) }; }

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    plateau.prepend(renderer.domElement);
    const sc = new THREE.Scene(), cam = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    sc.add(new THREE.HemisphereLight(0xfff1d0, 0x3a1d10, 0.75));
    const soleil = new THREE.DirectionalLight(0xffe2b0, 1.0);
    soleil.position.set(-3, -4, 9); soleil.castShadow = true; soleil.shadow.mapSize.set(1024, 1024);
    Object.assign(soleil.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5 }); sc.add(soleil);

    // Bois : grain dessiné dans un canvas
    const bc = document.createElement("canvas"); bc.width = 1024; bc.height = 256;
    const g = bc.getContext("2d"); g.fillStyle = "#8A5428"; g.fillRect(0, 0, 1024, 256);
    for (let i = 0; i < 90; i++) {
      g.strokeStyle = `rgba(${50 + Math.random() * 40},${25 + Math.random() * 20},10,${.12 + Math.random() * .22})`; g.lineWidth = 1 + Math.random() * 3;
      g.beginPath(); const y = Math.random() * 256; g.moveTo(0, y);
      for (let x = 0; x <= 1024; x += 32) g.lineTo(x, y + Math.sin(x / 90 + i) * 6 + Math.sin(x / 23) * 1.5);
      g.stroke();
    }
    const bois = new THREE.CanvasTexture(bc); bois.encoding = THREE.sRGBEncoding; bois.wrapS = bois.wrapT = THREE.RepeatWrapping;
    bois.repeat.set(.13, .4); bois.offset.set(.5, .5); // évite la couture du motif au centre

    const LX = 6.9, LY = 2.8, EP = 0.45, R = 0.44, PAS = 1.1;
    const cx = k => -2.75 + k * PAS;
    const RANGS = { nous: -0.62, eux: 0.62 };
    const forme = new THREE.Shape(), rr = 1.1;
    forme.moveTo(-LX / 2 + rr, -LY / 2); forme.lineTo(LX / 2 - rr, -LY / 2); forme.quadraticCurveTo(LX / 2, -LY / 2, LX / 2, -LY / 2 + rr);
    forme.lineTo(LX / 2, LY / 2 - rr); forme.quadraticCurveTo(LX / 2, LY / 2, LX / 2 - rr, LY / 2); forme.lineTo(-LX / 2 + rr, LY / 2);
    forme.quadraticCurveTo(-LX / 2, LY / 2, -LX / 2, LY / 2 - rr); forme.lineTo(-LX / 2, -LY / 2 + rr); forme.quadraticCurveTo(-LX / 2, -LY / 2, -LX / 2 + rr, -LY / 2);
    for (let k = 0; k < 6; k++) for (const y of [RANGS.nous, RANGS.eux]) { const h = new THREE.Path(); h.absarc(cx(k), y, R, 0, Math.PI * 2, true); forme.holes.push(h); }
    const jeu = new THREE.Group(); sc.add(jeu);
    const caisse = new THREE.Mesh(new THREE.ExtrudeGeometry(forme, { depth: EP, bevelEnabled: true, bevelThickness: .08, bevelSize: .06, bevelSegments: 4, curveSegments: 40 }), new THREE.MeshStandardMaterial({ map: bois, roughness: .62, metalness: .02 }));
    caisse.castShadow = caisse.receiveShadow = true; jeu.add(caisse);
    const pied = new THREE.Mesh(new THREE.BoxGeometry(LX * .7, LY * .55, .5), new THREE.MeshStandardMaterial({ color: 0x4a2a14, roughness: .9 }));
    pied.position.z = -.25; jeu.add(pied);

    const matCreux = new THREE.MeshStandardMaterial({ color: 0x5A3418, roughness: .9, side: THREE.DoubleSide });
    const creux = [];
    for (let k = 0; k < 6; k++) for (const [rang, y] of Object.entries(RANGS)) {
      const m = new THREE.Mesh(new THREE.SphereGeometry(R, 40, 20, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), matCreux);
      m.rotation.x = Math.PI / 2; m.scale.set(1, .75, 1); m.position.set(cx(k), y, EP + .08);
      m.receiveShadow = true; m.userData = { k, rang }; jeu.add(m); creux.push(m);
    }

    const geoGraine = new THREE.SphereGeometry(.105, 18, 12);
    const matGris = new THREE.MeshStandardMaterial({ color: 0x8C8A78, roughness: .35, metalness: .05 });
    const matOr = new THREE.MeshStandardMaterial({ color: 0xE2B10A, roughness: .3, metalness: .35 });
    const fond = EP + .08 - R * .75 + .12;
    function placeDans(k, rang, n, total) {
      const a = n / Math.max(total, 1) * Math.PI * 2 + k, d = total > 1 ? .17 + (n % 3) * .03 : 0;
      return new THREE.Vector3(cx(k) + Math.cos(a) * d, RANGS[rang] + Math.sin(a) * d, fond + Math.floor(n / 5) * .12 + (n % 2) * .04);
    }
    TROUS.forEach((t, k) => {
      t.graines = t.plats.map((p, n) => {
        const m = new THREE.Mesh(geoGraine, p.signature || t.id === "signatures" ? matOr : matGris);
        m.scale.set(1, .8, .68); m.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
        m.castShadow = true; m.userData = { k };
        m.position.copy(placeDans(k, "nous", n, t.plats.length)); m.userData.maison = m.position.clone();
        jeu.add(m); return m;
      });
    });

    // Semer : les graines sautent une à une dans les trous d'en face
    const vols = [];
    function voler(m, vers, delai, duree, fin) { vols.push({ m, de: m.position.clone(), vers, t0: performance.now() + delai, duree, fin }); lancer(); }
    let jeton = 0;
    semer = k => {
      const j = ++jeton;
      TROUS.forEach((t, i) => t.el.setAttribute("aria-pressed", i === k));
      recolter(k); vols.length = 0;
      TROUS.forEach((t, i) => t.graines.forEach(m => { if (i !== k) { if (REDUIT) m.position.copy(m.userData.maison); else voler(m, m.userData.maison, 0, 320); } }));
      const gr = TROUS[k].graines, parTrou = {};
      gr.forEach((m, n) => {
        // Comme à l'awalé : on sème trou après trou chez l'adversaire.
        const cible = 5 - (n % 6); parTrou[cible] = (parTrou[cible] || 0) + 1;
        const vers = placeDans(cible, "eux", parTrou[cible] - 1, 2), p = TROUS[k].plats[n];
        if (REDUIT) { m.position.copy(vers); pousser(p); }
        else voler(m, vers, 260 + n * 240, 480, () => { if (j === jeton) pousser(p); });
      });
      if (innerWidth < 1024) setTimeout(() => j === jeton && recolte.scrollIntoView({ behavior: REDUIT ? "auto" : "smooth", block: "start" }), REDUIT ? 0 : 260 + gr.length * 240 + 500);
      lancer();
    };

    const ray = new THREE.Raycaster(), ptr = new THREE.Vector2(), incl = { x: 0, y: 0 };
    function viser(e) {
      const r = renderer.domElement.getBoundingClientRect();
      ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ptr, cam);
      const h = ray.intersectObjects([...creux, ...TROUS.flatMap(t => t.graines)])[0];
      return h && h.object.userData.rang !== "eux" ? h.object.userData.k : null;
    }
    renderer.domElement.addEventListener("click", e => { const k = viser(e); if (k != null) semer(k); });
    renderer.domElement.addEventListener("pointermove", e => {
      if (e.pointerType === "mouse") renderer.domElement.style.cursor = viser(e) != null ? "pointer" : "default";
      const r = plateau.getBoundingClientRect(); incl.x = (e.clientX - r.left) / r.width - .5; incl.y = (e.clientY - r.top) / r.height - .5;
    });

    // Plateau horizontal sur grand écran, vertical sur téléphone
    let vertical = false;
    function taille() {
      const w = plateau.clientWidth, h = plateau.clientHeight, a = w / h;
      renderer.setSize(w, h, false); cam.aspect = a;
      vertical = a < 1.05;
      jeu.rotation.z = vertical ? -Math.PI / 2 : 0;
      jeu.position.x = vertical ? 0.75 : 0;
      const d = vertical ? 12.4 * Math.max(1, .8 / a) : Math.max(7.2, 10.4 / a);
      cam.position.set(0, vertical ? -d * .32 : -d * .62, d); cam.lookAt(vertical ? 0.4 : 0, vertical ? -0.1 : 0.1, 0);
      cam.updateProjectionMatrix(); lancer();
    }
    let actif = true, enCours = false;
    function lancer() { if (!enCours) { enCours = true; requestAnimationFrame(boucle); } }
    const v = new THREE.Vector3();
    function boucle(now) {
      enCours = false;
      for (let i = vols.length - 1; i >= 0; i--) {
        const f = vols[i]; if (now < f.t0) continue;
        const t = Math.min((now - f.t0) / f.duree, 1), e = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        f.m.position.lerpVectors(f.de, f.vers, e); f.m.position.z += Math.sin(Math.PI * t) * (.9 + f.de.distanceTo(f.vers) * .15);
        f.m.rotation.x += .15; f.m.rotation.y += .1;
        if (t >= 1) { vols.splice(i, 1); f.fin && f.fin(); }
      }
      if (!REDUIT) { jeu.rotation.x += (incl.y * .1 - jeu.rotation.x) * .05; jeu.rotation.y += (incl.x * .12 - jeu.rotation.y) * .05; }
      renderer.render(sc, cam);
      const w = plateau.clientWidth, h = plateau.clientHeight;
      TROUS.forEach((t, k) => {
        v.set(cx(k), RANGS.nous + (vertical ? 0 : -R - .12), EP).applyMatrix4(jeu.matrixWorld).project(cam);
        const x = (v.x + 1) / 2 * w, y = (1 - v.y) / 2 * h, bw = t.el.offsetWidth, bh = t.el.offsetHeight;
        t.el.style.transform = vertical ? `translate(${Math.round(x - bw - R * w / 9)}px, ${Math.round(y - bh / 2)}px)` : `translate(${Math.round(x - bw / 2)}px, ${Math.round(y + 6)}px)`;
      });
      if (actif && (vols.length || !REDUIT)) lancer();
    }
    new IntersectionObserver(([e]) => { actif = e.isIntersecting; if (actif) lancer(); }).observe(plateau);
    new ResizeObserver(taille).observe(plateau); taille();
    return { semer: k => semer(k) };
  }
  window.CookAwale = { monter };
})();
