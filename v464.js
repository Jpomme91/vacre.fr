/* VACRE 4.6.4 — Musée immersif, vitrines, salles et sol en parquet.
   Ajout progressif non destructif : conserve les cartes et actions historiques. */
(function () {
'use strict';
const $=id=>document.getElementById(id);
const style=document.createElement('style');
style.id='v464-museum-styles';
style.textContent=[
/* Le musée est volontairement une ambiance autonome, indépendamment du thème général. */
'#collection.v464-museum{position:relative;isolation:isolate;max-width:1450px!important;width:calc(100% - 28px);margin:32px auto 70px!important;padding:0 0 28px!important;overflow:hidden;border-radius:26px;background:#191e1d!important;color:#f4e9d7!important;border:1px solid #786248;box-shadow:0 25px 70px #0007;font-family:inherit}',
'#collection.v464-museum .v464-entrance{position:relative;overflow:hidden;min-height:175px;padding:27px 22px 20px;text-align:center;color:#f6e6c5;background:radial-gradient(ellipse at 50% 0%,#596054 0%,transparent 60%),repeating-linear-gradient(90deg,#343e38 0,#343e38 46px,#29342f 47px,#29342f 53px,#343e38 54px,#343e38 120px),linear-gradient(#222c28,#101816);border-bottom:15px ridge #775838;box-shadow:inset 0 0 0 4px #202c26,0 8px 20px #0007}',
'#collection.v464-museum .v464-entrance:before,#collection.v464-museum .v464-entrance:after{content:"";position:absolute;top:0;bottom:-10px;width:44px;background:linear-gradient(90deg,#1a2723,#647065 20%,#27362f 55%,#121d1a);border-left:3px solid #bda16c;border-right:3px solid #8b7148;box-shadow:0 0 13px #0008}',
'#collection.v464-museum .v464-entrance:before{left:13px}#collection.v464-museum .v464-entrance:after{right:13px}',
'#collection.v464-museum .v464-entrance .v464-kicker{color:#d7b87c;letter-spacing:.32em;font-size:10px;font-weight:900}',
'#collection.v464-museum .v464-entrance .v464-emblem{font-size:27px;color:#eacb89;text-shadow:0 0 18px #edc37888;margin:7px 0}',
'#collection.v464-museum .v464-entrance p{margin:5px auto 0;max-width:720px;font-size:13px;color:#d4cab7}',
'#collection.v464-museum h2{position:relative;z-index:2;margin:12px auto 0!important;padding:0 20px!important;color:#f6e3bd!important;font-family:Georgia,"Times New Roman",serif!important;font-size:clamp(30px,5vw,58px)!important;font-weight:700!important;letter-spacing:.05em!important;line-height:1.05!important;text-transform:none!important;text-shadow:0 3px 1px #0009,0 0 25px #dbad5944;text-align:center}',
'#collection.v464-museum .v29-collection-tools{display:flex;justify-content:flex-end;max-width:none;margin:15px 19px 0;padding:0;position:relative;z-index:2}',
'#collection.v464-museum .v29-collection-tools button{background:#2c3028!important;color:#f4dfa8!important;border:1px solid #ab905e!important;border-radius:9px!important;font-size:12px!important;padding:9px 13px!important}',
'#collection.v464-museum .collection-progress{max-width:680px;margin:17px auto 19px!important;padding:0 22px;text-align:center;color:#ead8b7!important;font-size:15px!important}',
'#collection.v464-museum #collection-count{color:#e8ca88!important}',
'#collection.v464-museum #v24-missing{color:#cfc5b0!important}',
'#collection.v464-museum .progress-background{margin:10px auto!important;max-width:610px!important;height:12px!important;border:2px solid #aa8b59!important;background:#0f1d1b!important;box-shadow:inset 0 2px 8px #000b}',
'#collection.v464-museum #progress-bar{background:linear-gradient(90deg,#6b966a,#d5bd71)!important}',
'#collection.v464-museum .v464-curator{max-width:1200px;margin:8px auto 19px;padding:14px 18px;display:flex;gap:15px;align-items:center;justify-content:center;flex-wrap:wrap;border-radius:14px;border:1px solid #5b5440;background:linear-gradient(110deg,#26312b,#161e1b);box-shadow:0 8px 20px #0003}',
'#collection.v464-museum .v464-curator label{margin:0!important;color:#e9d8b4!important;font-size:12px!important;font-weight:800;display:flex;align-items:center;gap:9px;flex-wrap:wrap}',
'#collection.v464-museum .v464-curator select,#collection.v464-museum .v464-curator input{height:40px;background:#111b1a!important;color:#f5eee1!important;border:1px solid #837355!important;border-radius:9px!important;padding:7px 10px!important;max-width:100%}',
'#collection.v464-museum .v464-curator input{min-width:min(240px,72vw)}',
'#collection.v464-museum .v464-rooms{max-width:1250px;margin:0 auto;padding:4px 14px 16px;display:flex;flex-wrap:wrap;justify-content:center;gap:8px}',
'#collection.v464-museum .v464-room{appearance:none;cursor:pointer;border:1px solid #79654a;border-radius:9px;background:#252c27;color:#d8c5a4;padding:11px 14px;display:flex;align-items:center;gap:6px;font:800 12px inherit;box-shadow:inset 0 1px #ffffff18;transition:background .2s,transform .2s}',
'#collection.v464-museum .v464-room:hover{background:#3d4439;transform:translateY(-2px)}',
'#collection.v464-museum .v464-room[aria-pressed="true"]{background:linear-gradient(#e5ca8d,#b88e49);border-color:#f2dba3;color:#1f271e;box-shadow:0 3px 14px #e7ba6d44}',
'#collection.v464-museum .v464-curatorial-label{text-align:center;color:#c4bb9e;letter-spacing:.15em;font-size:10px;font-weight:800;margin:4px 15px 13px}',
'#collection.v464-museum .v464-scene{position:relative;isolation:isolate;overflow:hidden;margin:0 17px 16px;padding:0 28px 0;background:#32372f;border:3px solid #7a6446;border-radius:14px;box-shadow:inset 0 0 0 7px #1b2420,inset 0 15px 40px #0009,0 14px 30px #0005}',
'#collection.v464-museum .v464-scene:before{content:"";position:absolute;inset:0 0 110px;pointer-events:none;z-index:-1;background:radial-gradient(ellipse at 25% 1%,#e3bf6d20,transparent 24%),radial-gradient(ellipse at 75% 1%,#e3bf6d20,transparent 24%),repeating-linear-gradient(90deg,#272f2a 0,#272f2a 20px,#343b32 22px,#343b32 110px,#2a322a 112px,#2a322a 118px),linear-gradient(#384038,#242d26);border-bottom:15px solid #583e29}',
'#collection.v464-museum .v464-scene-top{position:relative;z-index:1;margin:0 -28px 0;padding:20px 22px 22px;background:linear-gradient(180deg,#1e2b25,#3d463b 45%,#232d26);border-bottom:8px ridge #8c6d46;box-shadow:0 9px 16px #0007;text-align:center}',
'#collection.v464-museum .v464-scene-top:before{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 14% 45%,#fff2b6 0,#f8d98555 4px,transparent 45px),radial-gradient(circle at 50% 45%,#fff2b6 0,#f8d98555 4px,transparent 45px),radial-gradient(circle at 86% 45%,#fff2b6 0,#f8d98555 4px,transparent 45px)}',
'#collection.v464-museum .v464-scene-top strong{position:relative;color:#f0d392;font-family:Georgia,serif;font-size:clamp(15px,2.4vw,23px);letter-spacing:.12em}',
'#collection.v464-museum .v464-scene-top small{position:relative;display:block;margin-top:6px;color:#ded1ba;font-size:11px;letter-spacing:.08em}',
'#collection.v464-museum #collection-grid{position:relative;z-index:1;display:grid!important;grid-template-columns:repeat(auto-fill,minmax(158px,1fr))!important;gap:29px 24px!important;padding:42px 14px 25px!important;align-items:stretch;max-width:1250px;margin:0 auto!important;max-height:none!important;overflow:visible!important;background:transparent!important}',
'#collection.v464-museum #collection-grid>.v361-rarity-heading{grid-column:1/-1!important;text-align:center!important;margin:13px 0 1px!important;padding:10px 16px!important;min-height:auto!important;font-size:clamp(14px,2vw,21px)!important;font-family:Georgia,serif!important;color:#f4dfad!important;letter-spacing:.16em!important;border:0!important;border-top:1px solid #c5ab6e55!important;border-bottom:1px solid #c5ab6e55!important;background:#0e1a17bd!important;text-shadow:0 2px 5px #000c!important}',
'#collection.v464-museum #collection-grid>*[hidden]{display:none!important}',
'#collection.v464-museum #collection-grid .collection-card{--v464-glow:#d0b78a;position:relative!important;isolation:isolate;cursor:pointer;min-width:0!important;min-height:278px!important;height:auto!important;margin:0!important;padding:11px 10px 14px!important;display:flex!important;flex-direction:column!important;justify-content:flex-start!important;align-items:center!important;gap:5px!important;color:#eddfc4!important;background:linear-gradient(120deg,#1e2b2c 0%,#101a1b 36%,#273132 55%,#0b1718 100%)!important;border:7px ridge #755736!important;border-radius:12px 12px 4px 4px!important;outline:2px solid #c3a16a;outline-offset:-9px;box-shadow:inset 0 0 0 2px #1b1712,inset 0 14px 25px #0009,0 14px 10px #0009,0 0 20px color-mix(in srgb,var(--v464-glow),transparent 79%)!important;transition:transform .22s ease,box-shadow .22s ease!important}',
'#collection.v464-museum #collection-grid .collection-card:hover,#collection.v464-museum #collection-grid .collection-card:focus-within{transform:translateY(-6px)!important;box-shadow:inset 0 0 0 2px #34271b,inset 0 15px 26px #0009,0 20px 16px #000a,0 0 25px color-mix(in srgb,var(--v464-glow),transparent 38%)!important}',
'#collection.v464-museum #collection-grid .collection-card:before{content:"";position:absolute;pointer-events:none;z-index:4;inset:7px 7px 34%;border-radius:4px;background:linear-gradient(110deg,#ffffff33 0,#ffffff06 11%,transparent 19%,transparent 59%,#fff9 61%,#ffffff15 64%,transparent 69%);border:1px solid #e3f3e533;box-shadow:inset 2px 0 9px #d6fff714}',
'#collection.v464-museum #collection-grid .collection-card:after{content:"";pointer-events:none;position:absolute;z-index:3;bottom:-18px;left:-11px;right:-11px;height:21px;border:2px solid #392414;border-top:3px solid #b18b58;background:repeating-linear-gradient(90deg,#60402a 0,#784b2e 14px,#412918 30px,#684127 44px);box-shadow:0 8px 9px #0009;border-radius:2px 2px 6px 6px}',
'#collection.v464-museum #collection-grid .collection-card.common{--v464-glow:#bac0c4}',
'#collection.v464-museum #collection-grid .collection-card.rare{--v464-glow:#4c9eff}',
'#collection.v464-museum #collection-grid .collection-card.epic{--v464-glow:#bc72fc}',
'#collection.v464-museum #collection-grid .collection-card.legendary{--v464-glow:#ffd46c}',
'#collection.v464-museum #collection-grid .collection-card.mythic{--v464-glow:#ff709a}',
'#collection.v464-museum #collection-grid .collection-card.special{--v464-glow:#36ffb6;background:linear-gradient(135deg,#0f2826,#153b33 52%,#0d1d1a)!important;outline-color:#44e8b6!important;border-color:#4d7158!important}',
'#collection.v464-museum #collection-grid .collection-card.locked{--v464-glow:#656761;opacity:.68!important;filter:grayscale(.8)!important;background:linear-gradient(#1b2523,#0e1413)!important;color:#90918e!important}',
'#collection.v464-museum #collection-grid .collection-card>.symbol{display:grid!important;place-items:center!important;flex:none!important;width:100%!important;min-height:108px!important;margin:1px 0 7px!important;border:1px solid color-mix(in srgb,var(--v464-glow),transparent 40%)!important;border-radius:5px!important;background:radial-gradient(ellipse at 50% 52%,color-mix(in srgb,var(--v464-glow),transparent 77%),transparent 68%),linear-gradient(180deg,#101e1e,#213130 90%)!important;box-shadow:inset 0 3px 16px #000a,0 1px 9px color-mix(in srgb,var(--v464-glow),transparent 70%)!important;font-size:clamp(36px,4vw,55px)!important;text-shadow:0 5px 12px #0008,0 0 16px color-mix(in srgb,var(--v464-glow),transparent 34%)!important}',
'#collection.v464-museum #collection-grid .collection-card>strong{display:block;width:100%;max-width:100%;margin:1px 0 3px!important;padding:8px 5px!important;text-align:center!important;color:#f8e6b4!important;background:linear-gradient(110deg,#4c361e,#9d7e4d 30%,#46311c 90%)!important;border:1px solid #b69b65!important;border-radius:3px!important;box-shadow:inset 0 1px #ffeab033,0 3px 4px #0008;font:700 12px/1.3 Georgia,serif!important;overflow-wrap:anywhere!important}',
'#collection.v464-museum #collection-grid .collection-card>small{margin:0!important;color:var(--v464-glow)!important;font-size:10px!important;font-weight:900!important;letter-spacing:.07em;text-shadow:0 2px 4px #000}',
'#collection.v464-museum #collection-grid .collection-card .v41-level{font-size:9px!important;padding:3px 6px!important;margin:0!important;border-radius:4px!important;background:#28332e!important;color:#f0d7a5!important;border:1px solid #86704b!important}',
'#collection.v464-museum #collection-grid .collection-card .v23-count{position:absolute!important;top:13px!important;right:13px!important;z-index:5;background:#202820!important;border:1px solid #aa9164!important;color:#f9e0a5!important;border-radius:7px!important;padding:4px 6px!important;font-size:11px!important;transform:none!important}',
'#collection.v464-museum #collection-grid .collection-card .v24-new-collection{position:static!important;z-index:5;display:inline-block!important;margin:2px auto;color:#7bf4ae!important;font-size:10px!important}',
'#collection.v464-museum #collection-grid .collection-card .v42-evolve-hint{z-index:5;font-size:9px!important;margin:1px auto!important;padding:5px 6px!important}',
'#collection.v464-museum #collection-grid .collection-card .v37-under-button{z-index:5;margin-top:4px!important;width:100%!important;min-height:29px!important;padding:5px 7px!important;border:1px solid #ad8d53!important;border-radius:6px!important;background:#4c3c27!important;color:#f7e9c5!important;font-size:10px!important;font-weight:900!important;letter-spacing:.03em;cursor:pointer}',
'#collection.v464-museum #collection-grid .collection-card .v42-info-button{background:#24433e!important;border-color:#68a99e!important}',
'#collection.v464-museum #collection-grid .collection-card .v37-under-button:focus-visible{outline:3px solid #ffda76!important}',
'#collection.v464-museum .v464-floor{height:125px;margin:0 -28px -3px;position:relative;z-index:0;border-top:12px solid #5b3925;border-bottom:10px solid #332317;background:linear-gradient(180deg,#0005,transparent 54%),repeating-linear-gradient(90deg,transparent 0,transparent 71px,#24140b8a 72px,#24140b8a 75px),repeating-linear-gradient(0deg,#7f5230 0,#7f5230 12px,#a57242 13px,#a57242 25px,#53351f 26px,#53351f 28px);box-shadow:inset 0 12px 14px #0007}',
'#collection.v464-museum .v464-floor:before{content:"";position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(115deg,transparent 0,transparent 90px,#deb88333 91px,#deb88333 93px),linear-gradient(180deg,#f4cb8040,#0006)}',
'#collection.v464-museum .v464-footnote{display:block;color:#adac99!important;font-size:11px;text-align:center;margin:12px 15px 0}',
'#collection.v464-museum #v464-room-count{font-weight:900;color:#edc87c}',
'#v37-evolve-modal .v37-evolve-box{background:linear-gradient(155deg,#26362f,#121d1a)!important;border:3px ridge #c8a56c!important;box-shadow:0 20px 65px #000b!important;color:#f6e9c8!important}',
'#v37-evolve-modal .v37-evolve-card{background:radial-gradient(circle,#4a5239,#162823)!important;border:4px ridge #aa8a55!important;box-shadow:inset 0 0 28px #0008!important}',
'#v37-evolve-modal .v37-evolve-box h3{font-family:Georgia,serif!important;color:#f4d48f!important}',
'#v42-info-modal .v42-info-panel{background:linear-gradient(140deg,#293c32,#121e1b)!important;border:2px ridge #caab6a!important;color:#f5e9d2!important}',
'#v42-info-modal .v42-info-symbol{background:linear-gradient(#e4cf9a,#86633c)!important}',
'@media(max-width:790px){#collection.v464-museum{width:calc(100% - 12px);border-radius:15px;margin-top:15px!important}#collection.v464-museum .v464-entrance{min-height:150px;padding:22px 25px}#collection.v464-museum .v464-entrance:before,#collection.v464-museum .v464-entrance:after{width:14px}#collection.v464-museum .v464-entrance:before{left:3px}#collection.v464-museum .v464-entrance:after{right:3px}#collection.v464-museum .v464-scene{margin:0 8px 10px;padding:0 9px}#collection.v464-museum .v464-scene-top{margin:0 -9px}#collection.v464-museum #collection-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:22px 13px!important;padding:30px 7px 22px!important}#collection.v464-museum #collection-grid .collection-card{min-height:245px!important;padding:8px 6px 10px!important}#collection.v464-museum #collection-grid .collection-card>.symbol{min-height:78px!important;font-size:39px!important}#collection.v464-museum #collection-grid .collection-card>strong{font-size:11px!important}#collection.v464-museum .v464-curator{margin:8px 12px 15px;padding:11px}#collection.v464-museum .v464-curator label{width:100%;justify-content:space-between}#collection.v464-museum .v464-curator input{flex:1;min-width:0}#collection.v464-museum .v464-room{font-size:11px;padding:8px 10px}#collection.v464-museum .v464-floor{margin:0 -9px;height:85px}}',
'@media(max-width:365px){#collection.v464-museum #collection-grid{gap:19px 8px!important}#collection.v464-museum #collection-grid .collection-card{border-width:5px!important}#collection.v464-museum #collection-grid .collection-card>.symbol{font-size:31px!important}}',
'@media(prefers-reduced-motion:reduce){#collection.v464-museum .collection-card,#collection.v464-museum .v464-room{transition:none!important}}'
].join('\n');
document.head.append(style);
const roomData=[
 ['all','🏛️','Grand hall'],['common','🪨','Communs'],['rare','💠','Rares'],
 ['epic','🔮','Épiques'],['legendary','👑','Légendaires'],['mythic','✨','Mythiques'],
 ['special','💚','Trésors']
];
let room='all',ownedOnly=false,ready=false;
function element(tag,klass,text){
 const el=document.createElement(tag);
 if(klass)el.className=klass;
 if(text!=null)el.textContent=text;
 return el;
}
function normal(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()}
function refresh(){
 if(!ready)return;
 const grid=$('collection-grid');if(!grid)return;
 const query=normal($('v36-search')?.value.trim());
 let shown=0;
 const byRarity={};
 for(const tile of grid.querySelectorAll(':scope > .collection-card')){
  const rarity=tile.dataset.v464Rarity||['special','mythic','legendary','epic','rare','common'].find(x=>tile.classList.contains(x))||'unknown';
  const name=tile.dataset.v464Name||tile.querySelector('strong')?.textContent||'';
  const n=Number(tile.dataset.v464Qty||0);
  const match=(room==='all'||rarity===room)&&(!ownedOnly||n>0)&&(!query||normal(name).includes(query));
  tile.style.removeProperty('display');
  tile.hidden=!match;
  if(match){shown++;byRarity[rarity]=(byRarity[rarity]||0)+1}
 }
 for(const title of grid.querySelectorAll(':scope > .v361-rarity-heading')){
  const r=roomData.find(x=>title.classList.contains('v361-rarity-'+x[0]));
  title.hidden=!!r&&!byRarity[r[0]];
 }
 const count=$('v464-room-count');if(count)count.textContent=String(shown);
 const roomName=$('v464-scene-room');if(roomName)roomName.textContent=room==='all'?'GRANDE GALERIE':('SALLE DES '+(roomData.find(x=>x[0]===room)?.[2]||'VACRES').toUpperCase());
}
function makeMuseum(){
 if(ready)return;
 const section=$('collection'),grid=$('collection-grid');
 if(!section||!grid)return;
 ready=true;section.classList.add('v464-museum');
 const entrance=element('div','v464-entrance');
 entrance.append(element('div','v464-kicker','RÉPUBLIQUE VACRIENNE · GALERIE NATIONALE'),element('div','v464-emblem','✦ ⚜ ✦'));
 const h2=section.querySelector('h2');if(h2)h2.textContent='Le Musée des Vacres';
 if(h2)entrance.append(h2);
 entrance.append(element('p',null,'Une vitrine pour chaque découverte. Explore les galeries, admire tes trésors et fais évoluer tes œuvres.'));
 section.insertBefore(entrance,section.firstChild);
 const curator=element('div','v464-curator');
 const sort=section.querySelector('.v24-sort-label'),search=section.querySelector('.v36-search-label');
 if(sort)curator.append(sort);if(search)curator.append(search);
 const owned=element('label','v464-only-owned');
 const check=document.createElement('input');check.type='checkbox';check.setAttribute('aria-label','Afficher uniquement les Vacres possédés');
 check.addEventListener('change',()=>{ownedOnly=check.checked;refresh()});
 owned.append(check,document.createTextNode(' Uniquement possédés'));curator.append(owned);
 grid.parentElement.insertBefore(curator,grid);
 const nav=element('nav','v464-rooms');nav.setAttribute('aria-label','Salles du musée');
 for(const [id,emoji,name] of roomData){
  const button=element('button','v464-room',emoji+' '+name);
  button.type='button';button.dataset.room=id;button.setAttribute('aria-pressed',String(room===id));
  button.addEventListener('click',()=>{
   room=id;
   for(const b of nav.querySelectorAll('button'))b.setAttribute('aria-pressed',String(b.dataset.room===room));
   refresh();
  });
  nav.append(button);
 }
 curator.after(nav);
 const note=element('div','v464-curatorial-label');
 note.append(document.createTextNode('✦ '));
 const count=element('span',null,'0');count.id='v464-room-count';
 note.append(count,document.createTextNode(' vitrines visibles · Les vitrines éclairées sont les œuvres de ta collection ✦'));
 nav.after(note);
 const scene=element('div','v464-scene');
 const top=element('div','v464-scene-top');
 const name=element('strong');name.id='v464-scene-room';name.textContent='GRANDE GALERIE';
 top.append(name,element('small',null,'CABINETS DE CURIOSITÉS · VITRINES SOUS VERRE'));
 const floor=element('div','v464-floor');floor.setAttribute('aria-hidden','true');
 scene.append(top);
 grid.parentNode.insertBefore(scene,grid);scene.append(grid,floor);
 section.append(element('small','v464-footnote','Musée VACRE · Pour examiner une œuvre, touche sa vitrine. Les évolutions conservent un exemplaire et rapportent des Urabucks.'));
 grid.addEventListener('input',()=>refresh());
 $('v36-search')?.addEventListener('input',()=>refresh());
 $('v24-own-sort')?.addEventListener('change',()=>queueMicrotask(refresh));
 new MutationObserver(()=>refresh()).observe(grid,{childList:true});
 refresh();
}
window.v464MuseumRefresh=refresh;
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',makeMuseum);
else makeMuseum();
const oldNav=window.v2Navigate;
if(typeof oldNav==='function')window.v2Navigate=function(page,...args){
 const result=oldNav.call(this,page,...args);
 if(page==='collection')queueMicrotask(refresh);
 return result;
};
})();
