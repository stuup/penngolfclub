// Live forecast for the course from Open-Meteo (free, no API key, no cookies).
const WMO = {
  0: ["Clear sky", "sun"], 1: ["Mainly clear", "sun"], 2: ["Partly cloudy", "partly"], 3: ["Overcast", "cloud"],
  45: ["Fog", "fog"], 48: ["Freezing fog", "fog"],
  51: ["Light drizzle", "drizzle"], 53: ["Drizzle", "drizzle"], 55: ["Heavy drizzle", "drizzle"],
  56: ["Freezing drizzle", "drizzle"], 57: ["Freezing drizzle", "drizzle"],
  61: ["Light rain", "rain"], 63: ["Rain", "rain"], 65: ["Heavy rain", "rain"], 66: ["Freezing rain", "rain"], 67: ["Freezing rain", "rain"],
  71: ["Light snow", "snow"], 73: ["Snow", "snow"], 75: ["Heavy snow", "snow"], 77: ["Snow grains", "snow"],
  80: ["Light showers", "rain"], 81: ["Showers", "rain"], 82: ["Heavy showers", "rain"],
  85: ["Snow showers", "snow"], 86: ["Snow showers", "snow"],
  95: ["Thunderstorms", "storm"], 96: ["Thunderstorms", "storm"], 99: ["Thunderstorms", "storm"],
};
const ICONS = {
  sun: '<circle cx="12" cy="12" r="4.5" fill="#ecc451" stroke="#c8921f"/><path stroke="#c8921f" d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4"/>',
  partly: '<circle cx="9" cy="8" r="3.5" fill="#ecc451" stroke="#c8921f"/><path fill="#fff" stroke="#548488" d="M17.5 20H9a5 5 0 1 1 4.8-6.5h.7a3.25 3.25 0 1 1 3 6.5z"/>',
  cloud: '<path fill="#dceaeb" stroke="#548488" d="M17.5 19H9a7 7 0 1 1 6.7-9h1.8a4.5 4.5 0 1 1 0 9z"/>',
  fog: '<path stroke="#548488" d="M4 9h16M3 13h18M5 17h14"/>',
  drizzle: '<path fill="#dceaeb" stroke="#548488" d="M17.5 14H9a5.5 5.5 0 1 1 5.2-7h1.3a3.5 3.5 0 1 1 2 7z"/><path stroke="#446b6f" d="M9 18v1M13 18v1M17 18v1"/>',
  rain: '<path fill="#dceaeb" stroke="#548488" d="M17.5 14H9a5.5 5.5 0 1 1 5.2-7h1.3a3.5 3.5 0 1 1 2 7z"/><path stroke="#446b6f" d="M8 17l-1 3M12 17l-1 3M16 17l-1 3"/>',
  snow: '<path fill="#fff" stroke="#548488" d="M17.5 14H9a5.5 5.5 0 1 1 5.2-7h1.3a3.5 3.5 0 1 1 2 7z"/><path stroke="#446b6f" d="M8 18h.01M12 20h.01M16 18h.01"/>',
  moon: '<path fill="#dceaeb" stroke="#548488" d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
  moonCloud: '<path fill="#dceaeb" stroke="#548488" transform="translate(1.5 1) scale(.6)" vector-effect="non-scaling-stroke" d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/><path fill="#fff" stroke="#548488" d="M17.5 20H9a5 5 0 1 1 4.8-6.5h.7a3.25 3.25 0 1 1 3 6.5z"/>',
  storm: '<path fill="#bcd7d9" stroke="#446b6f" d="M17.5 14H9a5.5 5.5 0 1 1 5.2-7h1.3a3.5 3.5 0 1 1 2 7z"/><path fill="#ecc451" stroke="#c8921f" d="m13 14-3 4h3l-2 4"/>',
};
const icon = (key, cls = "size-10") =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[key] || ICONS.cloud}</svg>`;
const NIGHT = { sun: "moon", partly: "moonCloud" };
const COLS = { 3: "grid-cols-3", 4: "grid-cols-4", 5: "grid-cols-5" };
const compass = (deg) => ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.round(deg / 45) % 8];
const time = (iso) => iso.slice(11, 16);
const day = (iso, i) => (i === 0 ? "Today" : i === 1 ? "Tomorrow" : new Date(iso).toLocaleDateString("en-GB", { weekday: "short" }));

function verdict(code, rainPct, wind) {
  if (code >= 95) return ["Thunderstorms forecast — please check with the Golf Shop before travelling.", "text-red-700"];
  if (code >= 71 && code <= 86 && code !== 80 && code !== 81 && code !== 82) return ["Snow forecast — call the Golf Shop to check the course is open.", "text-red-700"];
  if (rainPct >= 70) return ["Waterproofs on — a wet one is likely.", "text-amber-700"];
  if (wind >= 25) return ["Blustery out there — club up into the wind.", "text-amber-700"];
  if (rainPct <= 25 && wind < 15) return ["A cracking day for golf.", "text-emerald-700"];
  return ["Playable conditions — pack a layer.", "text-heath-700"];
}

async function render(el) {
  const { lat, lng } = el.dataset;
  const days = Number(el.dataset.days || 5);
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
    `&current=temperature_2m,apparent_temperature,weather_code,is_day,wind_speed_10m,wind_direction_10m,wind_gusts_10m` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,sunrise,sunset` +
    `&timezone=Europe%2FLondon&wind_speed_unit=mph&forecast_days=${days + 1}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.status);
    const w = await res.json();
    const c = w.current, d = w.daily;
    // After sunset today is over: the verdict, rain chance and forecast move on to tomorrow.
    // (Both times are local "YYYY-MM-DDTHH:MM" strings, so they compare as text.)
    const o = c.time >= d.sunset[0] ? 1 : 0;
    const [label, dayKey] = WMO[c.weather_code] || ["—", "cloud"];
    const key = c.is_day ? dayKey : NIGHT[dayKey] || dayKey;
    let [say, sayCls] = o
      ? verdict(d.weather_code[1], d.precipitation_probability_max[1], d.wind_speed_10m_max[1])
      : verdict(c.weather_code, d.precipitation_probability_max[0], c.wind_speed_10m);
    if (o) say = `Tomorrow: ${say}`;
    const compact = el.dataset.compact !== undefined;

    const now = `
      <div class="flex items-center gap-4">
        ${icon(key, compact ? "size-12" : "size-16")}
        <div>
          <p class="font-display ${compact ? "text-3xl" : "text-5xl"} font-semibold text-heath-900">${Math.round(c.temperature_2m)}°</p>
          <p class="text-sm text-heath-700">${label} · feels ${Math.round(c.apparent_temperature)}°</p>
        </div>
      </div>
      <dl class="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-heath-700">
        <div class="rounded-lg bg-heath-50 p-2"><dt>Wind</dt><dd class="mt-0.5 text-sm font-semibold text-heath-900">${Math.round(c.wind_speed_10m)} mph ${compass(c.wind_direction_10m)}</dd></div>
        <div class="rounded-lg bg-heath-50 p-2"><dt>${o ? "Rain tomorrow" : "Rain chance"}</dt><dd class="mt-0.5 text-sm font-semibold text-heath-900">${d.precipitation_probability_max[o]}%</dd></div>
        <div class="rounded-lg bg-heath-50 p-2"><dt>${o ? "Sunrise" : "Sunset"}</dt><dd class="mt-0.5 text-sm font-semibold text-heath-900">${time(o ? d.sunrise[1] : d.sunset[0])}</dd></div>
      </dl>
      <p class="mt-3 text-sm font-medium ${sayCls}">${say}</p>`;

    const forecast = compact
      ? ""
      : `<ol class="mt-6 grid ${COLS[Math.min(days, 5)]} gap-2 border-t border-heath-950/10 pt-5 text-center">
          ${d.time
            .map(
              (t, i) => i < o || i >= o + days ? "" : `<li class="rounded-xl p-2 ${i === o ? "bg-crest-50" : ""}">
                <p class="text-xs font-semibold text-heath-800">${day(t, i)}</p>
                <div class="my-1 flex justify-center">${icon((WMO[d.weather_code[i]] || [])[1], "size-9")}</div>
                <p class="text-sm"><span class="font-semibold text-heath-900">${Math.round(d.temperature_2m_max[i])}°</span> <span class="text-heath-500">${Math.round(d.temperature_2m_min[i])}°</span></p>
                <p class="mt-0.5 text-[11px] text-heath-600">${d.precipitation_probability_max[i]}% · ${Math.round(d.wind_speed_10m_max[i])}mph</p>
              </li>`,
            )
            .join("")}
        </ol>
        <p class="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-heath-600">
          <span>Sunrise ${time(d.sunrise[o])}</span><span>Sunset ${time(d.sunset[o])}</span><span>Gusts to ${Math.round(c.wind_gusts_10m)} mph</span>
        </p>`;

    el.innerHTML = now + forecast + `<p class="mt-3 text-[11px] text-heath-500">Forecast by <a class="underline" href="https://open-meteo.com/" rel="noopener">Open-Meteo</a></p>`;
    el.setAttribute("aria-busy", "false");
  } catch {
    el.innerHTML = `<p class="text-sm text-heath-700">The forecast is unavailable right now. For course conditions call the Golf Shop on <a class="link" href="tel:+441902330472">01902 330472</a>.</p>`;
  }
}

document.querySelectorAll("[data-weather]").forEach(render);
