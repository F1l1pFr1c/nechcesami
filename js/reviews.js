(() => {
  const track = document.querySelector(".reviews__track");
  const buttons = document.querySelectorAll(".reviews__arrow");
  if (!track || !buttons.length) return;

  const [prev, next] = buttons;
  const step = () => {
    const card = track.querySelector(".review-card");
    return card ? card.getBoundingClientRect().width + 24 : track.clientWidth;
  };

  const update = () => {
    prev.disabled = track.scrollLeft <= 4;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
  };

  buttons.forEach((btn) =>
    btn.addEventListener("click", () =>
      track.scrollBy({ left: Number(btn.dataset.dir) * step(), behavior: "smooth" })
    )
  );
  track.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
})();
