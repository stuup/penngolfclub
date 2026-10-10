// Course Handicap calculator for every set of tees.
import { courseHandicap, playingHandicap, parseIndex, formatHandicap } from "./golf.js";

const root = document.querySelector("[data-handicap]");
const { tees } = JSON.parse(document.getElementById("scorecard-data").textContent);
const input = root.querySelector("[name=index]");
const out = root.querySelector("[data-results]");
const STORE = "pgc-index";

try { input.value = localStorage.getItem(STORE) || ""; } catch {}

function render() {
  const hi = parseIndex(input.value);
  try { localStorage.setItem(STORE, input.value); } catch {}
  if (Number.isNaN(hi)) {
    out.innerHTML = `<p class="col-span-full text-heath-700">Enter a Handicap Index between +10.0 and 54.0 (use “+” for plus handicaps).</p>`;
    return;
  }
  out.innerHTML = tees
    .map(
      (t) => `<div class="rounded-xl bg-white p-5 ring-1 ring-heath-950/10">
        <p class="flex items-center gap-2 text-sm font-semibold text-heath-800">
          <span class="size-3.5 rounded-full ring-1 ring-heath-950/20" style="background:${t.colour}"></span>${t.name} tees <span class="font-normal text-heath-500">· ${t.label}</span>
        </p>
        <p class="mt-3 font-display text-5xl font-semibold text-heath-900">${formatHandicap(courseHandicap(hi, t))}</p>
        <p class="text-sm text-heath-600">Course Handicap</p>
        <dl class="mt-4 grid grid-cols-3 gap-2 border-t border-heath-950/10 pt-3 text-center text-xs text-heath-600">
          <div><dt>95%</dt><dd class="text-base font-semibold text-heath-900">${formatHandicap(playingHandicap(hi, t, 0.95))}</dd></div>
          <div><dt>90%</dt><dd class="text-base font-semibold text-heath-900">${formatHandicap(playingHandicap(hi, t, 0.9))}</dd></div>
          <div><dt>85%</dt><dd class="text-base font-semibold text-heath-900">${formatHandicap(playingHandicap(hi, t, 0.85))}</dd></div>
        </dl>
      </div>`,
    )
    .join("");
}
input.addEventListener("input", render);
render();
