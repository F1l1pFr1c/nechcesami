/* Filtre + číslovanie. Ak je načítané cards.js, vykreslí karty; inak ukáže len ukážkových 8 strán. */
window.BLOG_CONTROLLED=true;
let category="all",page=1;
const pagEl=document.getElementById("pagination");
function update(){
  let pages=8;
  if(window.renderCards){const r=renderCards(category,page);pages=r.pages;page=r.page;}
  const nums=[];
  if(pages<=4)for(let i=1;i<=pages;i++)nums.push(i);
  else{const s=Math.min(Math.max(page-1,1),pages-3);for(let i=s;i<s+3;i++)nums.push(i);if(s+3<pages)nums.push("…");nums.push(pages);}
  pagEl.innerHTML=`<button data-dir="prev" aria-label="Poprzednia" ${page===1?"disabled":""}><i class="arrow"></i></button>`+
   nums.map(n=>n==="…"?`<span class="dots">…</span>`:`<button data-page="${n}" class="${n===page?"active":""}">${n}</button>`).join("")+
   `<button data-dir="next" aria-label="Następna" ${page===pages?"disabled":""}><i class="arrow"></i></button>`;
}
document.getElementById("filters").addEventListener("click",e=>{
  const b=e.target.closest("button");if(!b)return;
  document.querySelectorAll("#filters button").forEach(x=>x.classList.toggle("active",x===b));
  category=b.dataset.cat;page=1;update();});
pagEl.addEventListener("click",e=>{
  const b=e.target.closest("button");if(!b||b.disabled)return;
  page=b.dataset.page?+b.dataset.page:page+(b.dataset.dir==="next"?1:-1);
  update();document.querySelector(".blog-hero").scrollIntoView({behavior:"smooth"});});
const qc=new URLSearchParams(location.search).get("cat");
const qb=qc&&document.querySelector('#filters [data-cat="'+qc+'"]');
if(qb)qb.click();else update();
