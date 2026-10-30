/* Posuvník fotiek: bodky pod obrázkom prepínajú snímky */
const slides=[...document.querySelectorAll("#slider .slide")],dots=[...document.querySelectorAll("#dots button")];
dots.forEach((d,i)=>d.addEventListener("click",()=>{slides.forEach((s,j)=>s.classList.toggle("active",i===j));dots.forEach((x,j)=>x.classList.toggle("active",i===j));}));
