// Between sunset and sunrise the course is closed, whatever the morning's status says.
// A closure set by staff in the CMS always wins, so only "open" and "restricted" are changed.
import { sunTimes, ukDate, ukTime } from "./sun.js";

const { lat, lng } = document.body.dataset;
const now = new Date();
const today = sunTimes(ukDate(now), +lat, +lng);
const tomorrow = sunTimes(ukDate(new Date(now.getTime() + 864e5)), +lat, +lng);
const night = now < today.rise || now >= today.set;

if (night) {
  const opens = ukTime(now < today.rise ? today.rise : tomorrow.rise);
  const headline = `Closed for the night, open from sunrise ${opens}`;
  // Swap the open/restricted colours for a neutral night-time look.
  const retone = (el, cls) => {
    if (!el) return;
    el.classList.remove(...[...el.classList].filter((c) => /^(bg|text)-(emerald|amber|red)-/.test(c)));
    el.classList.add(...cls);
  };

  document.querySelectorAll("[data-course-status]").forEach((el) => {
    if (el.dataset.courseStatus === "closed") return;
    const note = el.querySelector("[data-status-night]");
    // The status page spells out the sunrise time in a note, so its headline stays short.
    el.querySelector("[data-status-headline]").textContent = note ? "Closed for the night" : headline;
    el.querySelector("[data-status-ping]")?.remove();
    retone(el.querySelector("[data-status-dot]"), ["bg-white/40"]);
    retone(el.querySelector("[data-status-icon]"), ["bg-heath-100", "text-heath-700"]);
    const badge = el.querySelector("[data-status-badge]");
    if (badge) {
      retone(badge, ["bg-heath-100", "text-heath-800"]);
      badge.lastChild.textContent = "Closed";
    }
    if (note) {
      note.textContent = `It's after dark, so the course is closed until sunrise at ${opens}. The latest update from the Golf Shop is below.`;
      note.hidden = false;
    }
  });
}
