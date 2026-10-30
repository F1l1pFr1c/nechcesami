(() => {
  const root = document.getElementById("revenue-chart");
  if (!root) return;

  // TODO: nahradiť skutočnými dátami z kalkulačky (ostrożny / optymistyczny, zł za mesiac)
  const months = ["Sty","Lut","Mar","Kwi","Maj","Cze","Lip","Sie","Wrz","Paź","Lis","Gru"];
  const names  = ["Styczeń","Luty","Marzec","Kwiecień","Maj","Czerwiec","Lipiec","Sierpień","Wrzesień","Październik","Listopad","Grudzień"];
  const base   = [2900,3100,3450,3650,3950,4255,4200,3950,4100,3950,3345,3550];
  const top    = [4450,4700,5250,5500,5950,6325,6150,5800,6050,5800,5000,5025];

  const MAX = 7000, STEP = 1000;
  const fmt = (n) => n.toLocaleString("pl-PL").replace(/\s/g, "\u00A0");
  const ticks = Array.from({ length: MAX / STEP + 1 }, (_, i) => i * STEP);

  root.innerHTML = `
    <div class="chart__axis">${ticks.map((t) => `<span style="bottom:${(t / MAX) * 100}%">${fmt(t)}\u00A0zł</span>`).join("")}</div>
    <div class="chart__plot">
      <div class="chart__grid">${ticks.map((t) => `<i style="bottom:${(t / MAX) * 100}%"></i>`).join("")}</div>
      <div class="chart__cols">
        ${months.map((m, i) => `
          <button type="button" class="chart__col" data-i="${i}" aria-label="${names[i]}: ${fmt(base[i])} – ${fmt(top[i])} zł">
            <span class="chart__bar" style="height:${(top[i] / MAX) * 100}%">
              <span class="chart__bar-base" style="height:${(base[i] / top[i]) * 100}%"></span>
            </span>
          </button>`).join("")}
      </div>
      <div class="chart__tip" role="status"></div>
    </div>
    <div class="chart__months">${months.map((m) => `<span>${m}</span>`).join("")}</div>`;

  const plot = root.querySelector(".chart__plot");
  const tip = root.querySelector(".chart__tip");
  const cols = [...root.querySelectorAll(".chart__col")];

  const show = (i) => {
    cols.forEach((c, k) => c.classList.toggle("is-active", k === i));
    const col = cols[i];
    const x = col.offsetLeft + col.offsetWidth / 2;
    const y = plot.clientHeight * (1 - top[i] / MAX) - 8;
    tip.style.left = `${x}px`;
    tip.style.top = `${Math.max(y, 28)}px`;
    tip.innerHTML = `<small>${names[i]}:</small><strong>${fmt(base[i])} – ${fmt(top[i])} zł</strong>`;
  };

  cols.forEach((col, i) => {
    col.addEventListener("mouseenter", () => show(i));
    col.addEventListener("focus", () => show(i));
    col.addEventListener("click", () => show(i));
  });

  let current = 5; // predvolene Czerwiec, ako v dizajne
  cols.forEach((c, i) => c.addEventListener("mouseenter", () => (current = i)));
  show(current);
  window.addEventListener("resize", () => show(current));
})();
