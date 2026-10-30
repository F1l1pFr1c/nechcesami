(() => {
  /* ----- záložky ----- */
  const tabs = [...document.querySelectorAll(".faq__tab")];
  const panels = tabs.map((t) => document.getElementById(t.getAttribute("aria-controls")));

  const selectTab = (index) => {
    tabs.forEach((tab, i) => {
      const active = i === index;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      panels[i].hidden = !active;
    });
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => selectTab(i));
    tab.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const next = (i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
      selectTab(next);
      tabs[next].focus();
    });
  });

  /* ----- accordion: naraz je otvorená jedna otázka v paneli ----- */
  document.querySelectorAll(".faq__list").forEach((list) => {
    list.addEventListener("click", (e) => {
      const btn = e.target.closest(".faq-item__q");
      if (!btn) return;
      const open = btn.getAttribute("aria-expanded") !== "true";
      list.querySelectorAll(".faq-item__q").forEach((b) => b.setAttribute("aria-expanded", "false"));
      btn.setAttribute("aria-expanded", String(open));
    });
  });
})();
