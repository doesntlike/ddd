// Ortak davranışlar: mobil menü, açılır menü, aktif link, site içi arama, ürün sekmeleri.
function searchSite(event){
  event.preventDefault();
  const el=event.target.querySelector('input');
  const q=(el?.value||'').trim().toLocaleLowerCase('tr-TR');
  if(!q){el?.focus();return false;}
  const routes=[
    {keys:['anasayfa','ana sayfa','başlangıç','ev'],url:'index.html'},
    {keys:['hakkımızda','hikaye','hikâyemiz','biz kimiz'],url:'hakkimizda.html'},
    {keys:['kurumsal','değer','vizyon'],url:'kurumsal.html'},
    {keys:['kalite','hazırlık','üretim','tazelik'],url:'kalite.html'},
    {keys:['ürün','kadayıf','fiyat','tepsi','tatlı','sipariş'],url:'urunler.html'},
    {keys:['soru','sss','saklama','servis','teslimat'],url:'sss.html'},
    {keys:['iletişim','telefon','adres','harita','konum'],url:'iletisim.html'}
  ];
  const found=routes.find(r=>r.keys.some(k=>q.includes(k)));
  window.location.href=found?found.url:'sss.html';
  return false;
}
(function(){
  const current=location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('.nav [data-page]').forEach(a=>{
    if(a.dataset.page===current){a.classList.add('active');a.setAttribute('aria-current','page');}
  });
  if(current==='urun-detay.html')document.querySelector('.nav [data-page="urunler.html"]')?.classList.add('active');

  const header=document.querySelector('.header');
  const btn=document.querySelector('.menu-btn');
  const setMenu=open=>{
    if(open&&header)document.documentElement.style.setProperty('--menu-top',header.getBoundingClientRect().bottom+'px');
    document.body.classList.toggle('menu-open',open);
    btn?.setAttribute('aria-expanded',String(open));
    const label=btn?.querySelector('span');if(label)label.textContent=open?'Kapat':'Menü';
  };
  btn?.addEventListener('click',()=>setMenu(!document.body.classList.contains('menu-open')));
  document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){setMenu(false);document.querySelector('.drop')?.classList.remove('open');}});

  // Ana sayfa slaytı: 3 sn’de bir kendi kendine değişir (azaltılmış hareket tercihinde geçiş animasyonsuz, CSS)
  const slides=[...document.querySelectorAll('.slide')];
  if(slides.length>1){
    const INTERVAL=3000; // ms: geçiş süresi
    const bar=document.querySelector('.slide-bar');
    bar?.style.setProperty('--slide-ms',INTERVAL+'ms');
    const runBar=()=>{if(!bar)return;bar.classList.remove('run');void bar.offsetWidth;bar.classList.add('run');};
    let i=0;runBar();
    setInterval(()=>{
      slides.forEach(s=>s.classList.remove('is-out'));
      slides[i].classList.replace('is-on','is-out');
      i=(i+1)%slides.length;
      slides[i].classList.add('is-on');
      runBar();
    },INTERVAL);
  }

  // Ürün detay sekmeleri (ok tuşlarıyla gezinme)
  const tabs=[...document.querySelectorAll('[role="tab"]')];
  if(tabs.length){
    const panels=tabs.map(t=>document.getElementById(t.getAttribute('aria-controls')));
    const activate=(i,focus)=>{
      tabs.forEach((t,j)=>{const on=i===j;t.setAttribute('aria-selected',String(on));t.tabIndex=on?0:-1;panels[j].hidden=!on;});
      if(focus)tabs[i].focus();
    };
    tabs.forEach((t,i)=>{
      t.addEventListener('click',()=>activate(i,false));
      t.addEventListener('keydown',e=>{
        const n={ArrowRight:(i+1)%tabs.length,ArrowLeft:(i-1+tabs.length)%tabs.length,Home:0,End:tabs.length-1}[e.key];
        if(n===undefined)return;e.preventDefault();activate(n,true);
      });
    });
  }
})();
