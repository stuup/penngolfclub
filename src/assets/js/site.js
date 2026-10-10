// Penn Golf Club — site behaviour. Progressive enhancement only: every page works without JS.

// ---------------------------------------------------------------------------
// Desktop dropdowns: open on hover (pointer devices) and on click/keyboard.
// ---------------------------------------------------------------------------
const dropdowns = [...document.querySelectorAll("[data-dropdown]")].filter((el) => el.querySelector("[data-menu]"));

function setOpen(dd, open) {
  const btn = dd.querySelector("button");
  const menu = dd.querySelector("[data-menu]");
  btn.setAttribute("aria-expanded", String(open));
  menu.toggleAttribute("data-open", open);
  btn.querySelector("svg")?.classList.toggle("rotate-180", open);
}
const closeAll = (except) => dropdowns.forEach((d) => d !== except && setOpen(d, false));

dropdowns.forEach((dd) => {
  const btn = dd.querySelector("button");
  let timer;
  btn.addEventListener("click", () => {
    const open = btn.getAttribute("aria-expanded") !== "true";
    closeAll(dd);
    setOpen(dd, open);
  });
  dd.addEventListener("pointerenter", (e) => {
    if (e.pointerType !== "mouse") return;
    clearTimeout(timer);
    closeAll(dd);
    setOpen(dd, true);
  });
  dd.addEventListener("pointerleave", (e) => {
    if (e.pointerType !== "mouse") return;
    timer = setTimeout(() => setOpen(dd, false), 150);
  });
  dd.addEventListener("focusout", (e) => {
    if (!dd.contains(e.relatedTarget)) setOpen(dd, false);
  });
});
document.addEventListener("click", (e) => {
  if (!e.target.closest("[data-dropdown]")) closeAll();
});

// ---------------------------------------------------------------------------
// Mobile drawer
// ---------------------------------------------------------------------------
const drawer = document.getElementById("mobile-menu");
const toggle = document.querySelector("[data-menu-toggle]");
function setDrawer(open) {
  drawer.hidden = !open;
  toggle.setAttribute("aria-expanded", String(open));
  document.documentElement.classList.toggle("overflow-hidden", open);
  if (open) drawer.querySelector("[data-menu-close]:not(.absolute)")?.focus();
  else toggle.focus();
}
toggle?.addEventListener("click", () => setDrawer(true));
drawer?.querySelectorAll("[data-menu-close]").forEach((el) => el.addEventListener("click", () => setDrawer(false)));

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (drawer && !drawer.hidden) setDrawer(false);
  closeAll();
});

// ---------------------------------------------------------------------------
// Feature modules, loaded only where needed
// ---------------------------------------------------------------------------
if (document.querySelector("[data-weather]")) import("./weather.js");
if (document.querySelector("[data-scorecard]")) import("./scorecard.js");
if (document.querySelector("[data-handicap]")) import("./handicap.js");
if (document.querySelector("[data-gallery]")) import("./gallery.js");

// "Relative time" labels, e.g. course status "updated 2 hours ago"
const rtf = new Intl.RelativeTimeFormat("en-GB", { numeric: "auto" });
document.querySelectorAll("time[data-relative]").forEach((el) => {
  const mins = Math.round((new Date(el.dateTime) - Date.now()) / 60000);
  const abs = Math.abs(mins);
  el.textContent =
    abs < 60 ? rtf.format(mins, "minute") : abs < 1440 ? rtf.format(Math.round(mins / 60), "hour") : rtf.format(Math.round(mins / 1440), "day");
});
