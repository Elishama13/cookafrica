// Illustrations SVG des plats (en attendant les photos). illustration(plat) → <svg>.
// Si un plat a un champ `photo`, les pages l'affichent à la place.
(function () {
  let s = 3;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const BASES = {
    "attiéké": { couleur: "#F6EBC8", grain: "#E3D29E", forme: "grains" },
    "riz":     { couleur: "#FBF7EE", grain: "#E6DED0", forme: "riz" },
    "foutou":  { couleur: "#F2D37A", grain: "#D9B24E", forme: "boule" },
    "placali": { couleur: "#ECE6DA", grain: "#CFC5B3", forme: "boule" },
    "kabato":  { couleur: "#F4DC8C", grain: "#DCBE62", forme: "dome" },
    "alloco":  { couleur: "#E8871E", grain: "#B85A10", forme: "alloco" }
  };
  const SAUCES = {
    "Sauce graine au tikriti": "#A8320C", "Biokosseu attié": "#C9561A", "Kedjenou de poulet": "#C2461C",
    "Sauce arachide": "#B5651D", "Kabato, sauce gombo": "#4E5A1C", "Placali, sauce kopè": "#5B5E1F",
    "Foutou banane, sauce claire": "#D0521B", "Soupe d'escargot": "#9E2B0E"
  };
  const BOISSONS = { "Bissap": "#7A0F2A", "Gnamakoudji": "#E9C46A", "Tomi": "#8B5A2B", "Bangui": "#F3EEDD" };

  function texture(b, cx, cy, R) {
    let o = "";
    if (b.forme === "grains") {
      o += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="${b.couleur}"/>`;
      for (let i = 0; i < R * 2.2; i++) { const a = rnd() * 6.28, d = Math.sqrt(rnd()) * R * .95; o += `<circle cx="${cx + Math.cos(a) * d}" cy="${cy + Math.sin(a) * d}" r="${1.6 + rnd() * 1.6}" fill="${b.grain}"/>`; }
    } else if (b.forme === "riz") {
      o += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="${b.couleur}"/>`;
      for (let i = 0; i < R * 1.4; i++) { const a = rnd() * 6.28, d = Math.sqrt(rnd()) * R * .9, x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d; o += `<ellipse cx="${x}" cy="${y}" rx="5" ry="2" transform="rotate(${rnd() * 180} ${x} ${y})" fill="${b.grain}"/>`; }
    } else if (b.forme === "boule" || b.forme === "dome") {
      o += `<circle cx="${cx}" cy="${cy}" r="${R * .85}" fill="${b.grain}"/><circle cx="${cx - 4}" cy="${cy - 6}" r="${R * .78}" fill="${b.couleur}"/><ellipse cx="${cx - R * .3}" cy="${cy - R * .35}" rx="${R * .22}" ry="${R * .12}" fill="#fff" opacity=".55"/>`;
      if (b.forme === "dome") o += `<path d="M${cx - R * .5} ${cy + R * .2} q ${R * .5} ${-R * .25} ${R} 0" stroke="${b.grain}" stroke-width="3" fill="none"/>`;
    } else {
      for (let i = 0; i < 11; i++) { const a = (i / 11) * 6.28 + rnd() * .3, d = (i % 2 ? .55 : .25) * R, x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d; o += `<rect x="${x - 16}" y="${y - 11}" width="32" height="22" rx="8" transform="rotate(${rnd() * 90} ${x} ${y})" fill="${b.couleur}" stroke="${b.grain}" stroke-width="3"/>`; }
    }
    return o;
  }
  const bord = `<circle cx="200" cy="200" r="196" fill="#FFF8E8"/><circle cx="200" cy="200" r="182" fill="none" stroke="#B30807" stroke-width="5" stroke-dasharray="2 12" stroke-linecap="round"/><circle cx="200" cy="200" r="160" fill="#FCF2DC"/>`;

  function baseDe(p) {
    const a = (p.accomp || "").toLowerCase();
    return Object.keys(BASES).find(k => a.includes(k));
  }

  window.illustration = function (p) {
    s = [...p.nom].reduce((n, c) => n + c.charCodeAt(0), 7);
    let corps;
    if (p.cat === "boissons") {
      const c = BOISSONS[p.nom] || "#C2461C";
      corps = `<ellipse cx="200" cy="356" rx="96" ry="16" fill="#000" opacity=".18"/>
        <path d="M130 70 h140 l-16 270 a14 14 0 0 1 -14 13 h-80 a14 14 0 0 1 -14 -13z" fill="#FFF8E8" opacity=".35" stroke="#FFF8E8" stroke-width="4"/>
        <path d="M138 140 h124 l-11 196 a10 10 0 0 1 -10 9 h-82 a10 10 0 0 1 -10 -9z" fill="${c}"/>
        <ellipse cx="200" cy="140" rx="62" ry="8" fill="#fff" opacity=".25"/>
        <rect x="158" y="170" width="30" height="26" rx="6" fill="#fff" opacity=".35" transform="rotate(-12 173 183)"/>
        <rect x="204" y="200" width="28" height="24" rx="6" fill="#fff" opacity=".3" transform="rotate(14 218 212)"/>
        <path d="M238 40 l-20 150" stroke="#F1C50E" stroke-width="9" stroke-linecap="round"/>`;
    } else if (p.cat === "desserts") {
      const fruits = p.nom === "Fruits du marché";
      let garni = "";
      if (fruits) [["#F1C50E", 160, 180], ["#E8550F", 230, 170], ["#7FB23A", 200, 230], ["#F1C50E", 250, 240], ["#E8550F", 150, 245]].forEach(([c, x, y]) => garni += `<rect x="${x - 24}" y="${y - 20}" width="48" height="40" rx="10" fill="${c}" transform="rotate(${rnd() * 60 - 30} ${x} ${y})"/>`);
      else if (p.nom === "Claclo") for (let i = 0; i < 9; i++) { const a = i / 9 * 6.28, d = i % 3 ? 60 : 0; garni += `<circle cx="${200 + Math.cos(a) * d}" cy="${205 + Math.sin(a) * d}" r="30" fill="#C9701C"/><circle cx="${192 + Math.cos(a) * d}" cy="${196 + Math.sin(a) * d}" r="10" fill="#E8A040"/>`; }
      else { garni = `<circle cx="200" cy="205" r="104" fill="#FBF3E2"/>`; for (let i = 0; i < 70; i++) { const a = rnd() * 6.28, d = Math.sqrt(rnd()) * 96; garni += `<circle cx="${200 + Math.cos(a) * d}" cy="${205 + Math.sin(a) * d}" r="3.4" fill="#E4CFA0"/>`; } }
      corps = bord + garni;
    } else {
      const b = BASES[baseDe(p)];
      const sauce = SAUCES[p.nom] || "#8A3A12";
      const poisson = /poisson|biokosseu/i.test(p.nom), poulet = /poulet/i.test(p.nom);
      let prot = poisson ? `<path d="M212 236 q 46 -34 100 0 l 20 -14 v 28 l -20 -14 q -54 34 -100 0z" fill="#7A3A12"/><circle cx="226" cy="234" r="3.5" fill="#FFF1D0"/><path d="M240 228 l 6 14 M256 224 l 6 18 M272 224 l 6 16" stroke="#5A2508" stroke-width="3"/>`
        : poulet ? `<path d="M232 170 q 40 -14 58 20 q 8 30 -28 40 q -36 4 -40 -26 z" fill="#8A3F12"/><rect x="282" y="160" width="12" height="34" rx="6" fill="#FFF1D0" transform="rotate(35 288 177)"/>`
        : /escargot/i.test(p.nom) ? `<circle cx="245" cy="200" r="22" fill="#5A3A1E"/><path d="M245 200 m -14 0 a 14 14 0 1 1 14 14 a 8 8 0 1 1 -8 -8" fill="none" stroke="#C89A60" stroke-width="3"/><circle cx="290" cy="225" r="18" fill="#5A3A1E"/>`
        : /mouton|choukouya/i.test(p.nom) ? "" : `<circle cx="270" cy="210" r="16" fill="#6E2A0C"/><circle cx="244" cy="214" r="11" fill="#6E2A0C"/>`;
      if (/choukouya/i.test(p.nom)) {
        corps = bord; for (let i = 0; i < 12; i++) { const x = 120 + (i % 4) * 54 + rnd() * 10, y = 140 + Math.floor(i / 4) * 60 + rnd() * 10; corps += `<rect x="${x}" y="${y}" width="46" height="34" rx="8" fill="#7A3410" transform="rotate(${rnd() * 40 - 20} ${x + 23} ${y + 17})"/><path d="M${x + 6} ${y + 10} h30" stroke="#4A1E08" stroke-width="3"/>`; }
        for (let i = 0; i < 8; i++) { const a = rnd() * 6.28, d = 40 + rnd() * 70; corps += `<ellipse cx="${200 + Math.cos(a) * d}" cy="${200 + Math.sin(a) * d}" rx="14" ry="5" fill="#F3E9F0" stroke="#B57AA0" stroke-width="2"/>`; }
      } else if (b) {
        corps = bord + `<g>${texture(b, 150, 200, 92)}<circle cx="262" cy="196" r="70" fill="${sauce}"/><circle cx="250" cy="180" r="18" fill="#000" opacity=".12"/>${prot}<circle cx="290" cy="166" r="7" fill="#F1C50E"/><circle cx="300" cy="178" r="5" fill="#B30807"/></g>`;
      } else {
        // Plat sans accompagnement (soupe, beignets, alloco seul) : un bol ou une portion.
        if (p.nom === "Gbofloto") { corps = bord; for (let i = 0; i < 10; i++) { const a = i / 10 * 6.28, d = i % 3 ? 62 : 8; corps += `<circle cx="${200 + Math.cos(a) * d}" cy="${200 + Math.sin(a) * d}" r="34" fill="#D9963A"/><circle cx="${190 + Math.cos(a) * d}" cy="${190 + Math.sin(a) * d}" r="12" fill="#F0C070"/>`; } }
        else if (/alloco/i.test(p.nom)) corps = bord + texture(BASES.alloco, 170, 200, 100) + `<ellipse cx="262" cy="230" rx="38" ry="30" fill="#fff"/><circle cx="262" cy="230" r="16" fill="#F1C50E"/>`;
        else corps = bord + `<circle cx="200" cy="200" r="120" fill="${sauce}"/><circle cx="185" cy="185" r="40" fill="#000" opacity=".08"/>` + prot.replace(/245/g, "180").replace(/290/g, "235") + `<circle cx="250" cy="150" r="9" fill="#F1C50E"/><circle cx="262" cy="166" r="6" fill="#2E7D32"/>`;
      }
    }
    return `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Illustration : ${p.nom}">${corps}</svg>`;
  };
})();
