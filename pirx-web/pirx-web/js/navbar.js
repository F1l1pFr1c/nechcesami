const burger=document.getElementById("burger"),nav=document.getElementById("nav");
burger.addEventListener("click",()=>burger.setAttribute("aria-expanded",nav.classList.toggle("open")));
document.querySelectorAll(".nav-item>button").forEach(b=>b.addEventListener("click",()=>b.parentElement.classList.toggle("open")));
