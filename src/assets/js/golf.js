// Shared WHS maths.
// Course Handicap = Handicap Index × (Slope ÷ 113) + (Course Rating − Par).
// Since April 2024 the unrounded Course Handicap is used when applying an allowance.
export const courseHandicapRaw = (hi, tee) => hi * (tee.slope / 113) + (tee.rating - tee.par);
export const courseHandicap = (hi, tee) => Math.round(courseHandicapRaw(hi, tee));
export const playingHandicap = (hi, tee, allowance = 1) => Math.round(courseHandicapRaw(hi, tee) * allowance);

// Strokes received on a hole of stroke index `si` for playing handicap `ph`.
// Plus handicaps give strokes back, starting from SI 18.
export function strokesOnHole(ph, si) {
  if (ph >= 0) return Math.floor(ph / 18) + (si <= ph % 18 ? 1 : 0);
  const p = -ph;
  return -(Math.floor(p / 18) + (si > 18 - (p % 18) ? 1 : 0));
}

export const stablefordPoints = (gross, par, strokes) => Math.max(0, 2 + par + strokes - gross);

// Accepts "12.4" or "+1.2" (plus handicap) and returns a number, or NaN.
export function parseIndex(value) {
  const v = String(value).trim();
  if (!v) return NaN;
  const n = v.startsWith("+") ? -parseFloat(v.slice(1)) : parseFloat(v);
  return n >= -10 && n <= 54 ? n : NaN;
}
export const formatHandicap = (n) => (n < 0 ? `+${-n}` : String(n));
