/* Akordeón: klik otvorí/zatvorí odpoveď */
document.querySelectorAll(".faq-q").forEach(b=>b.addEventListener("click",()=>{
  const it=b.parentElement,open=it.classList.toggle("open");b.setAttribute("aria-expanded",open);}));
