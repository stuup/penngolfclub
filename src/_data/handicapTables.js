// Builds Course Handicap lookup tables (Handicap Index range → Course Handicap)
// for every set of tees, straight from the ratings in scorecard.json.
import { readFileSync } from "node:fs";

const { tees } = JSON.parse(readFileSync(new URL("./scorecard.json", import.meta.url)));

const fmt = (n) => (n < 0 ? `+${(-n).toFixed(1)}` : n.toFixed(1));

export default tees.map((tee) => {
  const rows = [];
  // Work in tenths to avoid floating point drift. Plus 5.0 up to 54.0.
  for (let t = -50; t <= 540; t++) {
    const hi = t / 10;
    const ch = Math.round(hi * (tee.slope / 113) + (tee.rating - tee.par));
    const last = rows[rows.length - 1];
    if (last && last.ch === ch) last.to = hi;
    else rows.push({ ch, from: hi, to: hi });
  }
  return {
    ...tee,
    rows: rows.map((r) => ({ ch: r.ch < 0 ? `+${-r.ch}` : String(r.ch), range: r.from === r.to ? fmt(r.from) : `${fmt(r.from)} – ${fmt(r.to)}`, from: r.from })),
  };
});
