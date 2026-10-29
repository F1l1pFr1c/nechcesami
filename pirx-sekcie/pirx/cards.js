/* Články – img = cesta k fotke, napr. "img/clanok-1.jpg" */
const PER_PAGE=10,CATS=["zarabianie","prawo","przygotowanie","rynek","poradniki"];
const POSTS=Array.from({length:80},(_,i)=>({cat:CATS[i%5],img:"",
  title:"Lorem ipsum dolor sit amet",
  text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam a rhoncus leo. Phasellus ultrices rhoncus elementum.",
  date:"06.09.26",url:"#"}));
window.renderCards=function(cat,page){
  const list=POSTS.filter(p=>cat==="all"||p.cat===cat);
  const pages=Math.max(1,Math.ceil(list.length/PER_PAGE));page=Math.min(page,pages);
  document.getElementById("cards").innerHTML=list.slice((page-1)*PER_PAGE,page*PER_PAGE).map(p=>`
   <article class="card">
    <div class="card-image">${p.img?`<img src="${p.img}" alt="">`:""}</div>
    <div class="card-text"><h2>${p.title}</h2><p>${p.text}</p>
     <div class="card-meta"><time>${p.date}</time><a href="${p.url}">Czytaj więcej</a></div></div>
   </article>`).join("");
  return{pages,page};};
window.addEventListener("DOMContentLoaded",()=>{if(!window.BLOG_CONTROLLED)renderCards("all",1);});
