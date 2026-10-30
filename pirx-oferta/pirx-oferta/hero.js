/* Záložky ZAKRES / METODA / ...: zvýrazní tú, ktorá je práve na obrazovke */
const tabs=[...document.querySelectorAll("#tabs a")];
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)tabs.forEach(t=>t.classList.toggle("active",t.getAttribute("href")==="#"+e.target.id));}),{rootMargin:"-40% 0px -55% 0px"});
tabs.forEach(t=>{const s=document.querySelector(t.getAttribute("href"));if(s)io.observe(s);});
