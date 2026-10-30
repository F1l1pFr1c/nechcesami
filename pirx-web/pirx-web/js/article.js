/* Spis treści: plynulé posúvanie + zvýraznenie aktuálnej kapitoly */
const links=[...document.querySelectorAll(".toc a")];
links.forEach(a=>a.addEventListener("click",e=>{e.preventDefault();document.querySelector(a.getAttribute("href")).scrollIntoView({behavior:"smooth"});}));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+e.target.id));}),{rootMargin:"-10% 0px -80% 0px"});
document.querySelectorAll(".prose h2").forEach(h=>io.observe(h));
if(links[0])links[0].classList.add("active");
