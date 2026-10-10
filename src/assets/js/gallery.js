// Accessible lightbox for [data-gallery] groups of <a href="large.jpg"><img></a>.
const dialog = document.createElement("dialog");
dialog.className = "m-auto max-h-[92vh] max-w-[min(92vw,1400px)] overflow-visible bg-transparent p-0 backdrop:bg-heath-950/90";
dialog.innerHTML = `
  <figure class="relative">
    <img class="max-h-[85vh] w-auto rounded-lg object-contain shadow-2xl" alt="">
    <figcaption class="mt-3 text-center text-sm text-white/80"></figcaption>
  </figure>
  <button type="button" data-act="close" class="fixed top-4 right-4 inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20" aria-label="Close">×</button>
  <button type="button" data-act="prev" class="fixed top-1/2 left-3 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20" aria-label="Previous image">‹</button>
  <button type="button" data-act="next" class="fixed top-1/2 right-3 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20" aria-label="Next image">›</button>`;
document.body.append(dialog);
const img = dialog.querySelector("img");
const cap = dialog.querySelector("figcaption");
let items = [], idx = 0;

function show(i) {
  idx = (i + items.length) % items.length;
  const a = items[idx];
  img.src = a.href;
  img.alt = a.querySelector("img")?.alt || "";
  cap.textContent = img.alt;
}
document.querySelectorAll("[data-gallery]").forEach((g) => {
  const links = [...g.querySelectorAll("a")];
  links.forEach((a, i) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      items = links;
      show(i);
      dialog.showModal();
    }),
  );
});
dialog.addEventListener("click", (e) => {
  const act = e.target.closest("[data-act]")?.dataset.act;
  if (act === "close" || e.target === dialog) dialog.close();
  if (act === "prev") show(idx - 1);
  if (act === "next") show(idx + 1);
});
dialog.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") show(idx - 1);
  if (e.key === "ArrowRight") show(idx + 1);
});
