// Generates the redrawn Penn Golf Club crest as a pure-path SVG.
// Text glyphs are converted to outlines (Arimo Bold, Apache 2.0) so the SVG has no font dependency.
import opentype from 'opentype.js';
import fs from 'fs';

const font = opentype.loadSync(new URL("../../node_modules/@fontsource/arimo/files/arimo-latin-700-normal.woff", import.meta.url).pathname);
const C = 500; // centre
const f = (n) => +n.toFixed(2);
const RIBBON_W = 31;
const GAP = 8;

// ---------- helpers ----------
function catmullRom(pts) {
  // returns array of cubic segments [p0, c1, c2, p1] for an open curve
  const segs = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const t = 1 / 6;
    segs.push([
      p1,
      [p1[0] + (p2[0] - p0[0]) * t, p1[1] + (p2[1] - p0[1]) * t],
      [p2[0] - (p3[0] - p1[0]) * t, p2[1] - (p3[1] - p1[1]) * t],
      p2,
    ]);
  }
  return segs;
}
const segsToD = (segs) =>
  `M${f(segs[0][0][0])} ${f(segs[0][0][1])}` +
  segs.map(([, a, b, p]) => `C${f(a[0])} ${f(a[1])} ${f(b[0])} ${f(b[1])} ${f(p[0])} ${f(p[1])}`).join('');

function glyphPath(ch, size, tx, ty, rotDeg, anchor = 'middle') {
  const g = font.charToGlyph(ch);
  const adv = (g.advanceWidth / font.unitsPerEm) * size;
  const ox = anchor === 'middle' ? -adv / 2 : 0;
  const p = g.getPath(ox, 0, size);
  // bake the rotation + translation into the coordinates
  const r = (rotDeg * Math.PI) / 180;
  const cos = Math.cos(r), sin = Math.sin(r);
  const T = (x, y) => [f(tx + x * cos - y * sin), f(ty + x * sin + y * cos)];
  let d = '';
  for (const c of p.commands) {
    if (c.type === 'M' || c.type === 'L') d += c.type + T(c.x, c.y).join(' ');
    else if (c.type === 'Q') d += 'Q' + [...T(c.x1, c.y1), ...T(c.x, c.y)].join(' ');
    else if (c.type === 'C') d += 'C' + [...T(c.x1, c.y1), ...T(c.x2, c.y2), ...T(c.x, c.y)].join(' ');
    else if (c.type === 'Z') d += 'Z';
  }
  return d;
}
const advance = (ch, size) => (font.charToGlyph(ch).advanceWidth / font.unitsPerEm) * size;

// Text on the top arc, reading clockwise, glyphs upright pointing outward.
function arcTextTop(text, size, r, tracking) {
  const widths = [...text].map((ch) => advance(ch, size) + tracking);
  const total = widths.reduce((a, b) => a + b, 0) - tracking;
  let s = -total / 2;
  let d = '';
  [...text].forEach((ch, i) => {
    const mid = s + (widths[i] - tracking) / 2;
    const th = mid / r;
    d += glyphPath(ch, size, C + r * Math.sin(th), C - r * Math.cos(th), (th * 180) / Math.PI);
    s += widths[i];
  });
  return d;
}
// Text on the bottom arc, reading left-to-right, tops pointing to the centre. r = baseline radius.
function arcTextBottom(text, size, r, tracking) {
  const widths = [...text].map((ch) => advance(ch, size) + tracking);
  const total = widths.reduce((a, b) => a + b, 0) - tracking;
  let s = -total / 2;
  let d = '';
  [...text].forEach((ch, i) => {
    const mid = s + (widths[i] - tracking) / 2;
    const ph = mid / r;
    d += glyphPath(ch, size, C + r * Math.sin(ph), C + r * Math.cos(ph), (-ph * 180) / Math.PI);
    s += widths[i];
  });
  return d;
}

// ---------- ribbon (Staffordshire-style knot) ----------
const R = [
  [340, 220], [382, 256], [420, 295], [500, 390], [552, 450], [580, 472], [630, 506], [690, 522], [745, 500],
  [776, 442], [765, 372], [705, 305], [605, 265], [500, 254], [395, 265], [295, 305], [235, 372], [224, 442],
  [255, 500], [310, 522], [370, 506], [420, 472], [448, 450], [500, 390], [580, 295], [618, 256], [660, 220],
];
const allSegs = catmullRom(R);
const sub = (a, b) => segsToD(allSegs.slice(a, b));

// ---------- clubs ----------
function leftClub() {
  const B = [240, 176]; // butt
  const u = [0.587, 0.81];
  const n = [0.81, -0.587];
  const at = (s, side) => {
    const w = s < 12 ? 36 : s < 130 ? 34 - ((s - 12) / 118) * 4 : s < 152 ? 30 - ((s - 130) / 22) * 8 : 22 - ((s - 152) / 450) * 8;
    return [B[0] + u[0] * s + side * n[0] * (w / 2), B[1] + u[1] * s + side * n[1] * (w / 2)];
  };
  const P = (p) => `${f(p[0])} ${f(p[1])}`;
  const steps = [0, 12, 14, 130, 152, 602];
  let d = `M${P(at(0, 1))}`;
  for (const s of steps.slice(1)) d += `L${P(at(s, 1))}`;
  const r1 = at(602, 1);
  // neck → top line → toe → sole → heel → back up the shaft
  d += `C${f(r1[0] + 18)} ${f(r1[1] + 24)} ${640} ${716} ${661} ${738}`;
  d += `C${690} ${728} ${728} ${718} ${756} ${718}`;
  d += `C${770} ${718} ${773} ${732} ${771} ${745}`;
  d += `C${768} ${765} ${760} ${786} ${741} ${790}`;
  d += `L${676} ${793}`;
  d += `C${660} ${793} ${650} ${782} ${645} ${770}`;
  const l1 = at(602, -1);
  d += `C${632} ${742} ${f(l1[0] + 10)} ${f(l1[1] + 16)} ${P(l1)}`;
  for (const s of [...steps].reverse().slice(1)) d += `L${P(at(s, -1))}`;
  // rounded butt cap
  d += `A18 18 0 0 1 ${P(at(0, 1))}Z`;
  return d;
}
const mirrorD = (d) =>
  d.replace(/([MLCQA])([^MLCQAZ]*)/g, (m, cmd, args) => {
    const nums = args.trim().split(/[ ,]+/).filter(Boolean).map(Number);
    if (cmd === 'A') {
      // rx ry rot large sweep x y -> flip sweep and x
      const [rx, ry, rot, la, sw, x, y] = nums;
      return `A${rx} ${ry} ${rot} ${la} ${1 - sw} ${f(1000 - x)} ${y}`;
    }
    const out = nums.map((v, i) => (i % 2 === 0 ? f(1000 - v) : v));
    return cmd + out.join(' ');
  });
const LC = leftClub();
const RC = mirrorD(LC);

// ---------- golf ball ----------
function ball(cx, cy, r) {
  const holes = [];
  const pole = [0.3, -0.35]; // highlight offset (normalised)
  const d = 0.17;
  for (let j = -8; j <= 8; j++) {
    for (let i = -8; i <= 8; i++) {
      const x = (i + (j % 2 ? 0.5 : 0)) * d;
      const y = j * d * 0.866;
      const rho = Math.hypot(x, y);
      if (rho > 1.35) continue;
      const th = rho * (Math.PI / 2) * 0.82; // angle from pole
      if (th > 1.33) continue;
      const ang = Math.atan2(y, x);
      // project from a sphere whose pole points at `pole`
      const px = pole[0] + Math.sin(th) * Math.cos(ang);
      const py = pole[1] + Math.sin(th) * Math.sin(ang);
      if (Math.hypot(px, py) > 0.88) continue;
      const rr = 0.07 * Math.max(0.35, Math.cos(th));
      holes.push(`<ellipse cx="${f(cx + px * r)}" cy="${f(cy + py * r)}" rx="${f(rr * r * Math.max(0.55, Math.cos(th)))}" ry="${f(rr * r)}" transform="rotate(${f((ang * 180) / Math.PI)} ${f(cx + px * r)} ${f(cy + py * r)})"/>`);
    }
  }
  return holes.join('');
}

// ---------- assemble ----------
const ink = 'white', cut = 'black';
const halo = RIBBON_W + GAP * 2;
const ribbon = (d, haloD = d) =>
  `<path d="${haloD}" fill="none" stroke="${cut}" stroke-width="${halo}" stroke-linecap="butt"/>` +
  `<path d="${d}" fill="none" stroke="${ink}" stroke-width="${RIBBON_W}" stroke-linecap="round"/>`;
const shape = (d) =>
  `<path d="${d}" fill="${cut}" stroke="${cut}" stroke-width="${GAP * 2}" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="${ink}"/>`;

const penn = arcTextTop('PENN', 110, 347, 12);
const est = arcTextBottom('Est. 1908', 92, 414, 2);
const G = glyphPath('G', 124, 266, 668, 0);
const Cc = glyphPath('C', 124, 736, 668, 0);

const art = [
  `<rect width="1000" height="1000" fill="${cut}"/>`,
  `<circle cx="500" cy="500" r="467" fill="none" stroke="${ink}" stroke-width="37"/>`,
  `<path d="${penn}${est}${G}${Cc}" fill="${ink}"/>`,
  // weave, bottom to top
  ribbon(sub(17, 26)),
  ribbon(sub(0, 9)),
  shape(RC),
  shape(LC),
  ribbon(sub(9, 17), sub(10, 16)),
  `<circle cx="500" cy="782" r="46" fill="${ink}"/>`,
  `<g fill="${cut}">${ball(500, 782, 46)}</g>`,
].join('\n');

function svg(fill, { id = 'pgc-crest', title = 'Penn Golf Club crest', bg } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" role="img" aria-labelledby="${id}-t">
<title id="${id}-t">${title}</title>
<defs><mask id="${id}-m" maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="1000">
${art}
</mask></defs>
${bg ? `<circle cx="500" cy="500" r="486" fill="${bg}"/>` : ''}<rect width="1000" height="1000" fill="${fill}" mask="url(#${id}-m)"/>
</svg>
`;
}

const out = process.argv[2] || '.';
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(`${out}/penn-golf-club-crest.svg`, svg('#6B9FA3'));
fs.writeFileSync(`${out}/penn-golf-club-crest-heath.svg`, svg('#1E3A34'));
fs.writeFileSync(`${out}/penn-golf-club-crest-white.svg`, svg('#FFFFFF'));
fs.writeFileSync(`${out}/penn-golf-club-crest-mono.svg`, svg('currentColor'));
fs.writeFileSync(`${out}/penn-golf-club-crest-badge.svg`, svg('#6B9FA3', { bg: '#FFFFFF' }));
console.log('written to', out);

// Simplified mark for favicons / app icons: crossed clubs + ball on a disc.
fs.writeFileSync(`${out}/favicon.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
<circle cx="500" cy="500" r="500" fill="#1E3A34"/>
<circle cx="500" cy="500" r="440" fill="#6B9FA3"/>
<g transform="translate(500 500) scale(1.02) translate(-500 -485)">
<path d="${RC}" fill="#fff"/>
<path d="${LC}" fill="#6B9FA3" stroke="#6B9FA3" stroke-width="${GAP * 3}" stroke-linejoin="round"/>
<path d="${LC}" fill="#fff"/>
<circle cx="500" cy="770" r="56" fill="#fff"/>
</g>
</svg>
`);
