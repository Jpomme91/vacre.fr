/* VACRE 4.4 — Salle des trésors, 4 objets sur un socle fixe.
   Progression exclusivement issue de l'inventaire Supabase. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const collection=$('collection');
if(!collection)return;
const treasures=[
 {id:'urabot',name:'URABOT',hint:'Le prototype original, conservé avec ses huit pièces légendaires.',parts:['Tête du Vacre Bot','Bras gauche du Vacre Bot','Bras droit du Vacre Bot','Jambe gauche du Vacre Bot','Jambe droite du Vacre Bot','Corps du Vacre Bot','Arme du Vacre Bot','Bite du Vacre Bot']},
 {id:'dragon',name:'DRAGON VACRE',hint:'Deux ailes, une tête, une queue et un torse : reconstitue le dragon.',parts:['Aile gauche du Dragon Vacre','Aile droite du Dragon Vacre','Tête du Dragon Vacre','Queue du Dragon Vacre','Torse du Dragon Vacre']},
 {id:'vfr4000',name:'LANCEUR VACRE THERMONUCLÉAIRE VFR4000',hint:'Une relique de science-fiction VACRE, composée de quatre éléments.',parts:['Socle du VFR4000','Ogive gravée VACRE du VFR4000','Corps central du VFR4000','Arrière du VFR4000']},
 {id:'vacrerie',name:'CADRE DE LA VACRERIE',hint:'Reconstitue les quatre quarts du cadre pour ouvrir le quatrième emplacement du chaudron.',parts:['Cadre de la Vacrerie — haut gauche','Cadre de la Vacrerie — haut droit','Cadre de la Vacrerie — bas gauche','Cadre de la Vacrerie — bas droit']}
];
const art={
 dragon:'<svg viewBox="0 0 560 480" aria-label="Dragon Vacre à reconstruire"><g data-vt44-piece="4"><path class="vt44-shape" d="M339 333 Q408 321 444 371 Q480 412 523 370 Q505 438 449 434 Q385 434 323 371Z"/><path class="vt44-detail" d="M408 365 Q458 403 499 395"/></g><g data-vt44-piece="1"><path class="vt44-shape" d="M278 260 Q215 133 106 119 Q138 169 88 179 Q169 201 130 260 Q205 231 248 320Z"/><path class="vt44-detail" d="M125 146 L239 280 M127 184 L219 285"/></g><g data-vt44-piece="2"><path class="vt44-shape" d="M305 258 Q374 126 481 119 Q453 165 503 183 Q423 203 465 264 Q397 231 338 320Z"/><path class="vt44-detail" d="M471 149 L340 275 M479 190 L357 292"/></g><g data-vt44-piece="5"><path class="vt44-shape" d="M254 235 Q296 221 337 249 L365 341 Q349 385 326 399 L315 426 L282 426 L282 401 L246 407 L214 428 L202 409 L231 369 Q217 311 254 235Z"/><path class="vt44-detail" d="M263 317 L333 318 M246 366 Q296 393 336 363"/></g><g data-vt44-piece="3"><path class="vt44-shape" d="M253 130 L275 98 L289 135 L322 100 L330 149 Q363 164 366 202 L344 235 L301 250 L254 227 L229 190Z"/><path class="vt44-detail" d="M254 180 L273 184 M328 184 L343 180 M267 213 Q301 226 329 213"/></g></svg>',
 vfr4000:'<svg viewBox="0 0 560 480" aria-label="VFR4000 fictif en quatre pièces"><g data-vt44-piece="1"><path class="vt44-shape" d="M233 357 L319 357 L342 418 L205 418Z"/><path class="vt44-detail" d="M227 393 L321 393"/></g><g data-vt44-piece="4"><path class="vt44-shape" d="M236 323 L236 349 L319 349 L319 323 L344 295 L363 332 L340 355 L333 372 L223 372 L217 350 L197 335 L210 295Z"/><path class="vt44-detail" d="M237 344 L319 344"/></g><g data-vt44-piece="3"><path class="vt44-shape" d="M236 203 L319 203 L319 326 L236 326Z"/><path class="vt44-detail" d="M244 219 L311 219 M244 305 L311 305"/><text class="vt44-inscription" x="278" y="276" text-anchor="middle">VFR</text></g><g data-vt44-piece="2"><path class="vt44-shape" d="M236 200 L242 158 Q252 105 278 79 Q303 104 314 157 L319 200Z"/><path class="vt44-detail" d="M242 172 L313 172"/><text class="vt44-inscription" x="277" y="163" text-anchor="middle">V</text></g></svg>',
 vacrerie:'<svg viewBox="0 0 560 480" aria-label="Cadre du chaudron de la Vacrerie en quatre quarts"><g data-vt44-piece="1"><path class="vt44-shape" d="M125 93 H279 V238 H125Z"/><path class="vt44-detail" d="M143 113 H260 V222 H143Z M154 135 Q198 155 247 132"/><path class="vt44-detail" d="M206 184 Q228 158 252 192"/></g><g data-vt44-piece="2"><path class="vt44-shape" d="M282 93 H435 V238 H282Z"/><path class="vt44-detail" d="M299 113 H418 V222 H299Z M305 135 Q354 154 407 132"/><path class="vt44-detail" d="M311 192 Q338 158 355 183"/></g><g data-vt44-piece="3"><path class="vt44-shape" d="M125 241 H279 V386 H125Z"/><path class="vt44-detail" d="M143 258 H260 V367 H143Z M179 293 Q210 343 256 310"/><path class="vt44-detail" d="M193 347 L243 347"/></g><g data-vt44-piece="4"><path class="vt44-shape" d="M282 241 H435 V386 H282Z"/><path class="vt44-detail" d="M299 258 H418 V367 H299Z M308 308 Q361 347 395 289"/><path class="vt44-detail" d="M314 347 L395 347"/></g><path d="M236 220 Q278 244 324 220 L316 309 Q278 336 242 308Z" fill="none" stroke="#e6d3a1" stroke-opacity=".25" stroke-width="3" pointer-events="none"/></svg>'
};
const css=document.createElement('style');css.id='vt44-style';
css.textContent=[
'#vacrebot{display:none!important}',
'#collection .vt44-entry{border:1px solid #e1cb6a;background:linear-gradient(125deg,#272d32,#141b20);color:#f9e5b4;padding:13px 22px;border-radius:14px;font:800 15px Outfit,sans-serif;cursor:pointer;box-shadow:0 5px 21px #0002}',
'#collection .vt44-entry:hover{filter:brightness(1.14)}',
'#vt44-gallery[hidden]{display:none!important}',
'#vt44-gallery{scroll-margin-top:105px;margin:27px 0 35px;background:#10171c;color:#f4ecdf;border:1px solid #8b7546;border-radius:24px;padding:clamp(14px,3vw,27px);font-family:Outfit,sans-serif}',
'#vt44-gallery .vt44-head{display:flex;justify-content:space-between;align-items:start;gap:12px;margin-bottom:16px}',
'#vt44-gallery .vt44-head h3{font:900 clamp(24px,4vw,43px) Outfit,sans-serif;letter-spacing:-1px;color:#f5dfa6;margin:4px 0}',
'#vt44-gallery .vt44-kicker{font-size:10px;letter-spacing:3px;color:#b1a181;font-weight:800}',
'#vt44-gallery button{cursor:pointer;font-family:inherit}',
'#vt44-gallery .vt44-close,#vt44-gallery .vt44-arrow{border:1px solid #a58a57;color:#fbe5a8;background:#252b30;border-radius:50%;width:43px;height:43px;font-size:25px}',
'#vt44-gallery .vt44-layout{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(260px,.85fr);gap:16px}',
'#vt44-gallery .vt44-stage{height:clamp(385px,52vw,610px);border:1px solid #485458;position:relative;overflow:hidden;border-radius:23px;background:radial-gradient(ellipse at 50% 44%,#3b4b4b 0%,#1b242a 49%,#0c1115 95%);isolation:isolate}',
'#vt44-gallery .vt44-stage:before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at 50% 12%,#f9cb6b1b,transparent 49%);pointer-events:none}',
'#vt44-gallery .vt44-art{position:absolute;inset:3% 9% 17%;z-index:2;display:grid;place-items:center}',
'#vt44-gallery .vt44-art svg{height:100%;width:100%;max-width:480px;filter:drop-shadow(0 14px 16px #0007);animation:vt44-appear .3s ease}',
'#vt44-gallery .vt44-art .vb-robot{height:100%;max-height:100%;width:100%}',
'#vt44-gallery .vt44-art .vb-part.vb-owned{fill:url(#vt44-metal)}',
'#vt44-gallery .vt44-part.owned .vt44-shape{fill:var(--vt44-color,#ddb565);stroke:#f9dc9c;filter:drop-shadow(0 0 7px #d5ae5366)}',
'#vt44-gallery .vt44-shape{fill:#69757a;stroke:#a4afb0;stroke-width:4;stroke-linejoin:round;transition:fill .35s,stroke .35s}',
'#vt44-gallery .vt44-detail{fill:none;stroke:#374851;stroke-width:5;stroke-linecap:round;opacity:.65}',
'#vt44-gallery .vt44-part.owned .vt44-detail{stroke:#ffe0a6;opacity:.85}',
'#vt44-gallery .vt44-inscription{fill:#424e53;font:900 28px Outfit,sans-serif;letter-spacing:3px;pointer-events:none}',
'#vt44-gallery .vt44-part.owned .vt44-inscription{fill:#fff2cd}',
'#vt44-gallery .vt44-pedestal{position:absolute;left:50%;transform:translateX(-50%);bottom:4%;width:58%;height:13%;z-index:1;border-radius:50% 50% 17% 17%/45% 45% 23% 23%;background:linear-gradient(#ac8b53 0 22%,#4e4742 29%,#25292c 78%);border:2px solid #bda66e;box-shadow:0 13px 35px #000b,inset 0 7px 13px #edce7159;display:flex;align-items:center;justify-content:center}',
'#vt44-gallery .vt44-pedestal span{font-size:clamp(11px,2vw,18px);font-weight:900;letter-spacing:3px;color:#ffe4ad;margin-top:22px}',
'#vt44-gallery .vt44-arrow{position:absolute;top:45%;transform:translateY(-50%);z-index:5}',
'#vt44-gallery .vt44-prev{left:10px}#vt44-gallery .vt44-next{right:10px}',
'#vt44-gallery .vt44-panel{background:#1c252a;border:1px solid #435058;border-radius:20px;padding:clamp(15px,3vw,23px)}',
'#vt44-gallery .vt44-page{color:#c6b789;font-size:12px;font-weight:800;letter-spacing:2px}',
'#vt44-gallery .vt44-name{font:900 clamp(22px,3vw,30px) Outfit,sans-serif;color:#f8dda1;margin:9px 0;line-height:1.1}',
'#vt44-gallery .vt44-hint{color:#bcc9c4;font-size:13px;line-height:1.6;margin:8px 0 16px}',
'#vt44-gallery .vt44-meter{height:10px;border-radius:20px;background:#465054;overflow:hidden;margin:14px 0}',
'#vt44-gallery .vt44-meter i{display:block;background:linear-gradient(90deg,#a6833f,#f4df89);height:100%;width:0;transition:width .3s}',
'#vt44-gallery .vt44-parts{display:grid;gap:6px;max-height:320px;overflow:auto}',
'#vt44-gallery .vt44-item{display:flex;align-items:center;text-align:left;width:100%;gap:12px;border:1px solid #465557;background:#273237;color:#e9e7dc;padding:10px;border-radius:10px}',
'#vt44-gallery .vt44-item.selected{border-color:#edc573;background:#3d413c}',
'#vt44-gallery .vt44-item .vt44-no{font-size:11px;color:#d7b866}',
'#vt44-gallery .vt44-item .vt44-label{flex:1;font-size:12px;font-weight:750}',
'#vt44-gallery .vt44-item .vt44-qty{font-size:11px;color:#c5d4c8}',
'#vt44-gallery .vt44-item:not(.owned) .vt44-label{color:#8e9a9b}',
'#vt44-gallery .vt44-info{color:#cdd6d0;font-size:12px;line-height:1.6;min-height:40px;margin:13px 0}',
'#vt44-gallery .vt44-claim{width:100%;border:0;background:#f1d57c;color:#251d11;padding:13px;border-radius:12px;font-weight:900}',
'#vt44-gallery .vt44-claim:disabled{opacity:.58;cursor:default}',
'#vt44-gallery .vt44-unlock{color:#b6efcf;font-weight:800;font-size:13px;margin-top:10px}',
'#vacrerie .vx-slot-catalyst{border:1px solid #d6bf70;background:#303626;border-radius:12px;color:#f3db8a;display:flex;justify-content:center;flex-direction:column;align-items:center;gap:4px;font-size:24px;min-height:70px}',
'#vacrerie .vx-slot-catalyst small{font-size:10px;max-width:98%;overflow-wrap:anywhere;text-align:center}',
'@keyframes vt44-appear{from{opacity:.3;transform:scale(.96)}to{opacity:1;transform:scale(1)}}',
'@media(max-width:850px){#vt44-gallery .vt44-layout{grid-template-columns:1fr}#vt44-gallery .vt44-stage{height:420px}}',
'@media(max-width:460px){#vt44-gallery .vt44-stage{height:330px}#vt44-gallery .vt44-art{inset:0 7% 15%}#vt44-gallery .vt44-arrow{width:36px;height:36px}#vt44-gallery .vt44-pedestal span{font-size:10px;letter-spacing:1px}}',
'@media(prefers-reduced-motion:reduce){#vt44-gallery .vt44-art svg{animation:none}}'
].join('\n');
document.head.append(css);

document.querySelector('.v2-drawer-links button[onclick*="vacrebot"]')?.remove();
const tools=collection.querySelector('.v29-collection-tools')||collection;
const opener=document.createElement('button');opener.id='vt44-open';opener.type='button';opener.className='vt44-entry';opener.textContent='✦ VOIR MES TRÉSORS';
tools.append(opener);
const root=document.createElement('section');
root.id='vt44-gallery';root.hidden=true;
root.setAttribute('aria-label','Mes trésors à assembler');
root.innerHTML='<div class="vt44-head"><div><span class="vt44-kicker">COLLECTION • SALLE DES TRÉSORS</span><h3>MES TRÉSORS</h3></div><button type="button" id="vt44-close" class="vt44-close" aria-label="Fermer mes trésors">×</button></div><div class="vt44-layout"><div class="vt44-stage" id="vt44-stage"><div class="vt44-art" id="vt44-art"></div><div class="vt44-pedestal" aria-hidden="true"><span>VACRE.FR</span></div><button type="button" id="vt44-prev" class="vt44-arrow vt44-prev" aria-label="Trésor précédent">‹</button><button type="button" id="vt44-next" class="vt44-arrow vt44-next" aria-label="Trésor suivant">›</button></div><div class="vt44-panel"><span id="vt44-page" class="vt44-page">01 / 04</span><h4 id="vt44-name" class="vt44-name"></h4><p id="vt44-hint" class="vt44-hint"></p><strong id="vt44-count">0 / 8 pièces</strong><div class="vt44-meter"><i id="vt44-bar"></i></div><div class="vt44-parts" id="vt44-parts"></div><p class="vt44-info" id="vt44-info" role="status"></p><button type="button" id="vt44-claim" class="vt44-claim" disabled>ASSEMBLER</button><p id="vt44-unlock" class="vt44-unlock"></p></div></div>';
collection.querySelector('#collection-grid')?.before(root);
if(!root.isConnected)collection.append(root);
let index=0,selected=0,busy=false,loading=false,opened=false;
let state={inventory:{},completed:[],urabot_rewarded:false};
let lastUser=null;
const colors=['#b5d48d','#6ba7a5','#e8bb64','#a2afda','#5bba91','#e7c66b','#c28c6f','#e8da98'];
function ownedCount(s){return s.parts.filter(n=>Number(state.inventory[n]||0)>0).length}
function isClaimed(s){return s.id==='urabot'?!!state.urabot_rewarded:state.completed.includes(s.id)}
function showArt(spec){
 const stage=$('vt44-art');
 stage.replaceChildren();
 if(spec.id==='urabot'){
  const template=document.querySelector('#vacrebot .vb-robot');
  if(!template){stage.textContent='Illustration indisponible.';return}
  const clone=template.cloneNode(true);
  clone.querySelector('#vb-metal')?.setAttribute('id','vt44-metal');
  clone.querySelectorAll('[data-vb-part]').forEach(g=>{
   const n=Number(g.getAttribute('data-vb-part'));
   const active=Number(state.inventory[spec.parts[n-1]]||0)>0;
   g.querySelectorAll('.vb-part,.vb-detail,.vb-eye').forEach(el=>el.classList.toggle('vb-owned',active));
  });
  stage.append(clone);
 }else{
  stage.innerHTML=art[spec.id];
  stage.querySelectorAll('[data-vt44-piece]').forEach(g=>{
   const n=Number(g.dataset.vt44Piece);
   g.classList.add('vt44-part');
   g.classList.toggle('owned',Number(state.inventory[spec.parts[n-1]]||0)>0);
   g.style.setProperty('--vt44-color',colors[(n+index)%colors.length]);
  });
 }
}
function paint(){
 const spec=treasures[index],n=ownedCount(spec),claimed=isClaimed(spec);
 $('vt44-page').textContent=String(index+1).padStart(2,'0')+' / 04';
 $('vt44-name').textContent=spec.name;
 $('vt44-hint').textContent=spec.hint;
 $('vt44-count').textContent=n+' / '+spec.parts.length+' pièces';
 $('vt44-bar').style.width=(100*n/spec.parts.length)+'%';
 showArt(spec);
 const list=$('vt44-parts');list.replaceChildren();
 spec.parts.forEach((name,i)=>{
  const qty=Number(state.inventory[name]||0),item=document.createElement('button');
  item.type='button';item.className='vt44-item'+(qty?' owned':'')+(i===selected?' selected':'');
  const no=document.createElement('span');no.className='vt44-no';no.textContent=String(i+1).padStart(2,'0');
  const label=document.createElement('span');label.className='vt44-label';
  label.textContent=qty?(typeof vacreBotDisplayName==='function'?vacreBotDisplayName(name):name):'Silhouette mystérieuse';
  const amount=document.createElement('span');amount.className='vt44-qty';amount.textContent=qty?'×'+qty:'🔒';
  item.append(no,label,amount);
  item.onclick=()=>{selected=i;paint()};
  list.append(item);
 });
 const selectedName=spec.parts[selected],qty=Number(state.inventory[selectedName]||0);
 $('vt44-info').textContent=loading?'Synchronisation des trésors…':!currentUser?'Connecte-toi pour retrouver tes pièces.':qty?'✦ '+selectedName+' : '+qty+' exemplaire(s) possédé(s).':'Pièce '+(selected+1)+' manquante. Trouve-la dans les boosters légendaires.';
 const button=$('vt44-claim');
 button.disabled=busy||loading||!currentUser||claimed||n!==spec.parts.length;
 button.textContent=claimed?'✓ TRÉSOR DÉJÀ ASSEMBLÉ':n===spec.parts.length?'✦ ASSEMBLER LE TRÉSOR':'ENCORE '+(spec.parts.length-n)+' PIÈCE(S)';
 $('vt44-unlock').textContent=claimed?(spec.id==='vacrerie'?'✓ Quatrième emplacement du chaudron activé.':spec.id==='urabot'?'✓ Carte exclusive URABOT obtenue.':'✓ Trésor conservé définitivement dans ton musée.'):'';
}
async function refresh(){
 if(!currentUser){state={inventory:{},completed:[],urabot_rewarded:false};window.v44VacrerieUnlocked=false;paint();return}
 if(lastUser!==currentUser.id){
  state={inventory:{},completed:[],urabot_rewarded:false};lastUser=currentUser.id;
 }
 if(loading)return;
 loading=true;
 if(opened)paint();
 try{
  const result=await supabaseClient.rpc('vacre_44_treasures_status');
  if(result.error)throw result.error;
  state={inventory:result.data?.inventory||{},completed:result.data?.completed||[],urabot_rewarded:!!result.data?.urabot_rewarded};
  window.v44VacrerieUnlocked=state.completed.includes('vacrerie');
  window.v44RedrawVacrerie?.();
 }catch(e){
  if(opened)$('vt44-info').textContent='Synchronisation indisponible : '+e.message;
  console.warn('Trésors VACRE 4.4',e);
 }finally{loading=false;if(opened)paint()}
}
async function claim(){
 const spec=treasures[index];
 if(busy||!currentUser||isClaimed(spec)||ownedCount(spec)!==spec.parts.length)return;
 busy=true;paint();
 try{
  const rpc=spec.id==='urabot'?'vacre_bot_activate_v30':'vacre_44_treasure_claim';
  const args=spec.id==='urabot'?{}:{p_treasure:spec.id};
  const result=await supabaseClient.rpc(rpc,args);
  if(result.error)throw result.error;
  if(spec.id==='urabot'){if(!result.data?.rewarded)throw Error('Activation non confirmée');}
  else if(!result.data?.unlocked)throw Error('Assemblage non confirmé');
  await refresh();
  $('vt44-stage').classList.remove('vt44-celebrate');
  void $('vt44-stage').offsetWidth;
  $('vt44-stage').classList.add('vt44-celebrate');
  await window.v23RefreshInventory?.();
  if(opened)$('vt44-info').textContent='✦ '+spec.name+' assemblé !';
 }catch(e){$('vt44-info').textContent='Assemblage impossible : '+e.message}
 finally{busy=false;await refresh()}
}
function move(dir){index=(index+treasures.length+dir)%treasures.length;selected=0;paint()}
function open(){
 opened=true;root.hidden=false;paint();refresh();
 root.scrollIntoView({behavior:'smooth',block:'start'});
}
opener.addEventListener('click',open);
$('vt44-close').onclick=()=>{opened=false;root.hidden=true;opener.focus()};
$('vt44-prev').onclick=()=>move(-1);
$('vt44-next').onclick=()=>move(1);
$('vt44-claim').onclick=claim;
let touchX=null;
$('vt44-stage').addEventListener('touchstart',e=>{touchX=e.changedTouches[0]?.screenX??null},{passive:true});
$('vt44-stage').addEventListener('touchend',e=>{if(touchX===null)return;const dx=e.changedTouches[0].screenX-touchX;touchX=null;if(Math.abs(dx)>50)move(dx<0?1:-1)},{passive:true});
const previousNavigate=window.v2Navigate;
window.v2Navigate=function(page,...args){
 if(page==='vacrebot'){const result=previousNavigate.call(this,'collection',...args);open();return result;}
 const result=previousNavigate.call(this,page,...args);
 if(page==='vacrerie'||page==='collection')refresh();
 if(page==='collection'&&opened)paint();
 return result;
};
window.v44RefreshTreasures=refresh;
window.addEventListener('focus',()=>{if(opened||document.body.dataset.v2Page==='vacrerie')refresh()});
window.addEventListener('load',()=>{
 if(location.hash==='#vacrebot'){window.v2Navigate('collection');open()}
 else if(currentUser&&document.body.dataset.v2Page==='vacrerie')refresh();
});
})();
