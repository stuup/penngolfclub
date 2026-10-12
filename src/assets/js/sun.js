// Sunrise and sunset, worked out in the browser (NOAA's solar equations; within a minute).
// Used to show the course as closed for the night without fetching anything.
const rad = Math.PI / 180;
const sin = (deg) => Math.sin(deg * rad);
const cos = (deg) => Math.cos(deg * rad);
const tan = (deg) => Math.tan(deg * rad);

// `ymd` is a calendar date ("2026-10-12"); returns { rise, set } as Dates.
export function sunTimes(ymd, lat, lng) {
  const t = (Date.parse(`${ymd}T12:00:00Z`) / 864e5 - 10957.5) / 36525; // Julian centuries since J2000
  const L0 = (280.46646 + t * (36000.76983 + 0.0003032 * t)) % 360; // mean longitude
  const M = 357.52911 + t * (35999.05029 - 0.0001537 * t); // mean anomaly
  const e = 0.016708634 - t * (0.000042037 + 0.0000001267 * t);
  const C = sin(M) * (1.914602 - t * (0.004817 + 0.000014 * t)) + sin(2 * M) * (0.019993 - 0.000101 * t) + sin(3 * M) * 0.000289;
  const omega = 125.04 - 1934.136 * t;
  const lambda = L0 + C - 0.00569 - 0.00478 * sin(omega); // apparent longitude
  const eps = 23 + (26 + (21.448 - t * (46.815 + t * (0.00059 - t * 0.001813))) / 60) / 60 + 0.00256 * cos(omega);
  const decl = Math.asin(sin(eps) * sin(lambda)) / rad;
  const y = tan(eps / 2) ** 2;
  const eqTime = (4 / rad) * (y * sin(2 * L0) - 2 * e * sin(M) + 4 * e * y * sin(M) * cos(2 * L0) - 0.5 * y * y * sin(4 * L0) - 1.25 * e * e * sin(2 * M));
  const H = Math.acos(cos(90.833) / (cos(lat) * cos(decl)) - tan(lat) * tan(decl)) / rad; // hour angle at sunrise
  const noon = Date.parse(`${ymd}T00:00:00Z`) + (720 - 4 * lng - eqTime) * 6e4;
  return { rise: new Date(noon - 4 * H * 6e4), set: new Date(noon + 4 * H * 6e4) };
}

// Today's date at the course, whatever time zone the visitor is in.
export const ukDate = (d = new Date()) => d.toLocaleDateString("en-CA", { timeZone: "Europe/London" });
export const ukTime = (d) => d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" });
