// Interactive digital scorecard with net and Stableford scoring.
import { playingHandicap, courseHandicap, strokesOnHole, stablefordPoints, parseIndex, formatHandicap } from "./golf.js";

const root = document.querySelector("[data-scorecard]");
const { tees } = JSON.parse(document.getElementById("scorecard-data").textContent);
const STORE = "pgc-scorecard-v1";

const els = {
  tee: root.querySelector("[name=tee]"),
  index: root.querySelector("[name=index]"),
  allowance: root.querySelector("[name=allowance]"),
  body: root.querySelector("tbody"),
  foot: root.querySelector("tfoot"),
  summary: root.querySelector("[data-summary]"),
  reset: root.querySelector("[data-reset]"),
  print: root.querySelector("[data-print]"),
};

let state = { tee: "white", index: "", allowance: "0.95", scores: Array(18).fill("") };
try {
  const saved = JSON.parse(localStorage.getItem(STORE));
  if (saved && Array.isArray(saved.scores)) state = { ...state, ...saved };
} catch {}
const save = () => {
  try { localStorage.setItem(STORE, JSON.stringify(state)); } catch {}
};

els.tee.value = state.tee;
els.index.value = state.index;
els.allowance.value = state.allowance;

const dots = (n) =>
  n > 0 ? `<span class="text-crest-500" aria-label="${n} shot${n > 1 ? "s" : ""}">${"●".repeat(n)}</span>`
  : n < 0 ? `<span class="text-red-600" aria-label="gives ${-n} shot">${"○".repeat(-n)}</span>` : "";

function build() {
  const tee = tees.find((t) => t.id === state.tee) || tees[0];
  const hi = parseIndex(state.index);
  const ph = Number.isNaN(hi) ? 0 : playingHandicap(hi, tee, Number(state.allowance));

  let rows = "";
  const tot = { out: { y: 0, p: 0, g: 0, n: 0, pts: 0, played: 0 }, in: { y: 0, p: 0, g: 0, n: 0, pts: 0, played: 0 } };

  for (let i = 0; i < 18; i++) {
    const half = i < 9 ? tot.out : tot.in;
    const par = tee.pars[i], si = tee.si[i], yards = tee.yards[i];
    const strokes = strokesOnHole(ph, si);
    const g = parseInt(state.scores[i], 10);
    const has = g > 0;
    const net = has ? g - strokes : "";
    const pts = has ? stablefordPoints(g, par, strokes) : "";
    half.y += yards; half.p += par;
    if (has) { half.g += g; half.n += net; half.pts += pts; half.played++; }
    const scoreCls = !has ? "" : g < par ? "bg-emerald-100 text-emerald-800" : g === par ? "" : g === par + 1 ? "bg-amber-50" : "bg-red-50 text-red-800";

    rows += `<tr>
      <th scope="row" class="font-semibold text-heath-900">${i + 1}</th>
      <td>${yards}</td><td>${par}</td><td>${si}</td>
      <td class="text-xs">${dots(strokes)}</td>
      <td class="!p-1"><input inputmode="numeric" pattern="[0-9]*" maxlength="2" aria-label="Gross score hole ${i + 1}" data-hole="${i}" value="${state.scores[i]}" class="w-12 rounded-md border-0 py-1.5 text-center font-semibold ring-1 ring-heath-950/15 ring-inset focus:ring-2 focus:ring-crest-500 ${scoreCls}"></td>
      <td>${net}</td><td class="font-semibold text-heath-900">${pts}</td>
    </tr>`;
    if (i === 8) rows += subtotal("Out", tot.out);
  }
  rows += subtotal("In", tot.in);
  els.body.innerHTML = rows;

  const all = { y: tot.out.y + tot.in.y, p: tot.out.p + tot.in.p, g: tot.out.g + tot.in.g, n: tot.out.n + tot.in.n, pts: tot.out.pts + tot.in.pts, played: tot.out.played + tot.in.played };
  els.foot.innerHTML = `<tr class="bg-heath-900 font-semibold text-white"><th scope="row">Total</th><td>${all.y}</td><td>${all.p}</td><td></td><td></td><td>${all.played ? all.g : ""}</td><td>${all.played ? all.n : ""}</td><td>${all.played ? all.pts : ""}</td></tr>`;

  const ch = Number.isNaN(hi) ? null : courseHandicap(hi, tee);
  els.summary.innerHTML = Number.isNaN(hi)
    ? `<p>Enter your Handicap Index to see the shots you receive on each hole.</p>`
    : `<div class="flex flex-wrap gap-x-8 gap-y-2">
        <p>Course Handicap <strong class="ml-1 font-display text-2xl text-gorse-400">${formatHandicap(ch)}</strong></p>
        <p>Playing Handicap <strong class="ml-1 font-display text-2xl text-gorse-400">${formatHandicap(ph)}</strong></p>
        ${all.played ? `<p>Holes played <strong class="ml-1 font-display text-2xl text-gorse-400">${all.played}</strong></p><p>Stableford <strong class="ml-1 font-display text-2xl text-gorse-400">${all.pts} pts</strong></p>` : ""}
      </div>`;
}

const subtotal = (label, t) =>
  `<tr class="subtotal"><th scope="row">${label}</th><td>${t.y}</td><td>${t.p}</td><td></td><td></td><td>${t.played ? t.g : ""}</td><td>${t.played ? t.n : ""}</td><td>${t.played ? t.pts : ""}</td></tr>`;

root.addEventListener("input", (e) => {
  const t = e.target;
  if (t.dataset.hole !== undefined) {
    state.scores[t.dataset.hole] = t.value.replace(/\D/g, "").slice(0, 2);
    const pos = t.dataset.hole;
    save(); build();
    const next = els.body.querySelector(`[data-hole="${pos}"]`);
    next?.focus();
    // jump to next hole once a score is entered (single digit unless it starts with 1)
    if (state.scores[pos] && !(state.scores[pos] === "1")) els.body.querySelector(`[data-hole="${+pos + 1}"]`)?.focus();
    return;
  }
  state.tee = els.tee.value; state.index = els.index.value; state.allowance = els.allowance.value;
  save(); build();
});
els.reset.addEventListener("click", () => {
  if (!confirm("Clear all scores on this card?")) return;
  state.scores = Array(18).fill("");
  save(); build();
});
els.print.addEventListener("click", () => {
  document.body.dataset.print = "digital";
  window.print();
});
window.addEventListener("afterprint", () => delete document.body.dataset.print);

build();
