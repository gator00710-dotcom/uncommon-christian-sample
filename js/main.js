// Demo only: nothing on this site sends any data anywhere.
document.documentElement.classList.add('js');
document.addEventListener('DOMContentLoaded',()=>{
  const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const b=document.querySelector('.burger'),m=document.getElementById('menu');
  if(b)b.addEventListener('click',()=>{const o=m.classList.toggle('open');b.setAttribute('aria-expanded',o)});
  // stagger cards
  document.querySelectorAll('.cards,.steps').forEach(g=>[...g.querySelectorAll('.reveal')].forEach((c,i)=>c.style.setProperty('--d',(i*0.12)+'s')));
  const els=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window&&!RM){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.1,rootMargin:'0px 0px -5% 0px'});els.forEach(el=>io.observe(el))}else els.forEach(el=>el.classList.add('in'));
  // embers
  if(!RM)document.querySelectorAll('.embers').forEach(box=>{const n=box.classList.contains('dense')?34:18;for(let i=0;i<n;i++){const s=document.createElement('span');s.className='ember';s.style.cssText=`left:${Math.random()*100}%;--s:${2+Math.random()*5}px;--t:${7+Math.random()*9}s;--dl:${-Math.random()*14}s;--x:${(Math.random()-.5)*160}px`;box.appendChild(s)}});
  // header shrink, parallax, fire meter
  const h=document.querySelector('header.site'),px=[...document.querySelectorAll('.parallax')],fire=document.querySelector('.fire');
  if(fire&&!RM)fire.style.setProperty('--p',0);
  let tick=false;const upd=()=>{tick=false;const y=scrollY,vh=innerHeight;h&&h.classList.toggle('scrolled',y>40);
    if(!RM){px.forEach(el=>{const r=el.parentElement.getBoundingClientRect();if(r.bottom>0&&r.top<vh)el.style.transform=`translate3d(0,${(r.top+r.height/2-vh/2)*-0.18}px,0)`});
    if(fire){const r=fire.getBoundingClientRect();const p=Math.min(1,Math.max(0,(vh-r.top)/(vh*0.5+r.height*0.6)));fire.style.setProperty('--p',p.toFixed(3))}}};
  addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(upd)}},{passive:true});upd();
  // video lightbox (falls back to the Videos page link without JS)
  const lb=document.getElementById('lightbox'),lv=document.getElementById('lb-video');
  document.querySelectorAll('[data-watch]').forEach(a=>a.addEventListener('click',e=>{if(!lb||!lb.showModal)return;e.preventDefault();
    lv.innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${a.dataset.watch}?rel=0&autoplay=1" title="Faith in Action video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;lb.showModal();lb.querySelector('.lb-close').focus()}));
  if(lb){const close=()=>{lb.close()};lb.querySelector('.lb-close').addEventListener('click',close);lb.addEventListener('click',e=>{if(e.target===lb)close()});lb.addEventListener('close',()=>{lv.innerHTML=''})}
  // demo-only forms and buttons
  document.querySelectorAll('form.demo-form').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();const t=f.querySelector('.toast');if(t){t.classList.add('show');t.focus()}}));
  document.querySelectorAll('[data-demo]').forEach(x=>x.addEventListener('click',e=>{e.preventDefault();const t=document.getElementById(x.dataset.demo);if(t){t.classList.add('show');t.focus()}}));
});
// ===== Demo cart & checkout: everything stays in this browser. No network requests. =====
(function(){
  const KEY='uc_demo_cart',money=n=>'$'+n.toFixed(2);
  const load=()=>{try{return JSON.parse(localStorage.getItem(KEY))||[]}catch(e){return[]}};
  const save=c=>{try{localStorage.setItem(KEY,JSON.stringify(c))}catch(e){}};
  const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const subtotal=c=>c.reduce((s,i)=>s+i.price*i.qty,0);
  document.addEventListener('DOMContentLoaded',()=>{
    const drawer=document.getElementById('cart'),scrim=document.querySelector('.drawer-scrim');
    let last=null;
    function render(bump){const c=load(),n=c.reduce((s,i)=>s+i.qty,0);
      document.querySelectorAll('[data-cart-count]').forEach(b=>{b.textContent=n;if(bump){b.classList.remove('bump');void b.offsetWidth;b.classList.add('bump')}});
      const box=document.getElementById('cart-items');if(box){box.innerHTML=c.length?c.map(i=>`<div class="ci"><img src="${esc(i.img)}" alt=""><div><h4>${esc(i.name)}</h4><div class="muted">${money(i.price)}</div><div class="qty" role="group" aria-label="Quantity for ${esc(i.name)}"><button type="button" data-q="-1" data-id="${esc(i.id)}" aria-label="Decrease">&minus;</button><span>${i.qty}</span><button type="button" data-q="1" data-id="${esc(i.id)}" aria-label="Increase">+</button></div></div><div style="text-align:right"><b>${money(i.price*i.qty)}</b><br><button class="rm" type="button" data-rm="${esc(i.id)}">Remove</button></div></div>`).join(''):'<p class="muted">Your demo cart is empty.</p><p><a href="shop.html">Browse the Shop</a></p>'}
      const sub=document.getElementById('cart-sub');if(sub)sub.textContent=money(subtotal(c));
      const tc=document.getElementById('to-checkout');if(tc)tc.classList.toggle('disabled',!c.length);
      renderCheckout()}
    function open(){if(!drawer)return;last=document.activeElement;drawer.classList.add('open');drawer.setAttribute('aria-hidden','false');scrim.hidden=false;drawer.focus()}
    function close(){if(!drawer)return;drawer.classList.remove('open');drawer.setAttribute('aria-hidden','true');scrim.hidden=true;last&&last.focus&&last.focus()}
    document.addEventListener('click',e=>{const t=e.target.closest('[data-add],[data-open-cart],[data-close-cart],[data-q],[data-rm]');if(!t)return;
      let c=load();
      if(t.dataset.add){const id=t.dataset.add,f=c.find(i=>i.id===id);f?f.qty++:c.push({id,name:t.dataset.name,price:parseFloat(t.dataset.price),img:t.dataset.img,qty:1});save(c);render(true);open();return}
      if(t.hasAttribute('data-open-cart')){open();return}
      if(t.hasAttribute('data-close-cart')){close();return}
      if(t.dataset.q){const f=c.find(i=>i.id===t.dataset.id);if(f){f.qty=Math.max(0,Math.min(99,f.qty+ +t.dataset.q));if(!f.qty)c=c.filter(i=>i!==f)}save(c);render()}
      if(t.dataset.rm){c=c.filter(i=>i.id!==t.dataset.rm);save(c);render()}});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&drawer&&drawer.classList.contains('open'))close()});
    // checkout
    const form=document.getElementById('co-form');
    const shipVal=()=>{const r=document.querySelector('input[name=ship]:checked');return r?parseFloat(r.value):0};
    function renderCheckout(){const box=document.getElementById('co-items');if(!box)return;const c=load(),s=subtotal(c),sh=c.length?shipVal():0;
      box.innerHTML=c.length?c.map(i=>`<div class="ci"><img src="${esc(i.img)}" alt=""><div><h4>${esc(i.name)}</h4><div class="muted">Qty ${i.qty}</div></div><b>${money(i.price*i.qty)}</b></div>`).join(''):'<p class="muted">Your cart is empty. <a href="shop.html">Visit the Shop</a>.</p>';
      document.getElementById('t-sub').textContent=money(s);document.getElementById('t-ship').textContent=sh?money(sh):(c.length?'Free':'$0.00');document.getElementById('t-total').textContent=money(s+sh)}
    if(form){
      const card=form.querySelector('#c-card'),exp=form.querySelector('#c-exp');
      card.addEventListener('input',()=>{card.value=card.value.replace(/\D/g,'').slice(0,16).replace(/(\d{4})(?=\d)/g,'$1 ')});
      exp.addEventListener('input',()=>{let v=exp.value.replace(/\D/g,'').slice(0,4);exp.value=v.length>2?v.slice(0,2)+'/'+v.slice(2):v});
      form.querySelectorAll('input[name=ship]').forEach(r=>r.addEventListener('change',renderCheckout));
      const luhn=n=>{let s=0,a=false;for(let i=n.length-1;i>=0;i--){let d=+n[i];if(a){d*=2;if(d>9)d-=9}s+=d;a=!a}return s%10===0};
      form.addEventListener('submit',e=>{e.preventDefault();const err=document.getElementById('co-err'),bad=[];
        const mark=(id,ok,msg)=>{const el=form.querySelector('#'+id);el.setAttribute('aria-invalid',ok?'false':'true');if(!ok)bad.push(msg)};
        const v=id=>form.querySelector('#'+id).value.trim();
        if(!load().length)bad.push('Your cart is empty.');
        mark('c-name',v('c-name').length>1,'Enter your name.');mark('c-email',/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v('c-email')),'Enter a valid email.');
        mark('c-addr',v('c-addr').length>3,'Enter a street address.');mark('c-city',v('c-city').length>1,'Enter a city.');
        mark('c-state',/^[A-Za-z]{2}$/.test(v('c-state')),'Enter a 2-letter state.');mark('c-zip',/^\d{5}(-\d{4})?$/.test(v('c-zip')),'Enter a valid ZIP.');
        const num=v('c-card').replace(/\s/g,'');mark('c-card',/^\d{16}$/.test(num)&&luhn(num),'Card number is not valid (try 4242 4242 4242 4242).');
        const m=v('c-exp').match(/^(\d{2})\/(\d{2})$/);let expOk=false;if(m){const mo=+m[1],yr=2000+ +m[2],now=new Date();expOk=mo>=1&&mo<=12&&(yr>now.getFullYear()||(yr===now.getFullYear()&&mo>=now.getMonth()+1))}
        mark('c-exp',expOk,'Enter a future expiry date (MM/YY).');mark('c-cvc',/^\d{3,4}$/.test(v('c-cvc')),'Enter a 3 or 4 digit CVC.');
        if(bad.length){err.textContent=bad.join(' ');err.focus();return}
        const c=load(),total=subtotal(c)+shipVal(),no='UC-DEMO-'+Math.floor(100000+Math.random()*900000);
        // Only a non-sensitive summary is kept for the confirmation page. Card fields are wiped and never saved.
        try{sessionStorage.setItem('uc_demo_order',JSON.stringify({no,items:c.map(i=>({name:i.name,qty:i.qty,price:i.price})),total}))}catch(x){}
        form.querySelectorAll('#c-card,#c-exp,#c-cvc').forEach(i=>i.value='');
        localStorage.removeItem(KEY);location.href='confirmation.html'});
    }
    const on=document.getElementById('order-no');
    if(on){let o=null;try{o=JSON.parse(sessionStorage.getItem('uc_demo_order'))}catch(e){}
      if(o){on.textContent=o.no;document.getElementById('conf-items').innerHTML=o.items.map(i=>`<div class="totals"><div><dt>${esc(i.name)} × ${i.qty}</dt><dd>${money(i.price*i.qty)}</dd></div></div>`).join('');document.getElementById('conf-total').textContent=money(o.total)}
      localStorage.removeItem(KEY)}
    render();
  });
})();
document.addEventListener('input',e=>{if(e.target.matches&&e.target.matches('#co-form input'))e.target.removeAttribute('aria-invalid')});
