(() => {
  const burger = document.querySelector(".navbar__burger");
  const menu = document.getElementById("main-menu");
  if (!burger || !menu) return;

  const setOpen = (open) => {
    menu.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Zamknij menu" : "Otwórz menu");
  };

  burger.addEventListener("click", () => setOpen(!menu.classList.contains("is-open")));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
})();
