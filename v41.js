/* VACRE 4.1 — deck de combat, profil et visibilité */
const v41El=id=>document.getElementById(id);
const v41Rpc=async(name,args={})=>{const {data,error}=await supabaseClient.rpc(name,args);if(error)throw error;return data};
let v41Deck=null,v41Loading=false;
function v41Message(msg){const el=v41El('v41-status');if(el)el.textContent=msg}
async function v41Render(){
 if(!currentUser)return;
 const mount=v41El('v41-deck-root');if(!mount||v41Loading)return;
 v41Loading=true;
 try{
  await v23RefreshInventory();
  v41Deck=await v41Rpc('vacre_41_get_deck');
  mount.replaceChildren();
  const head=document.createElement('div');head.className='v41-head';
  const title=document.createElement('h3');title.textContent='⚔️ MON DECK DE COMBAT';
  const subtitle=document.createElement('p');subtitle.textContent='5 Vacres différents · 10 exemplaires maximum par case · Les cartes restent dans ta collection.';
  head.append(title,subtitle);mount.append(head);
  const control=document.createElement('label');control.className='v41-visibility';
  const check=document.createElement('input');check.type='checkbox';check.checked=!!v41Deck.public;check.onchange=async()=>{check.disabled=true;try{v41Deck=await v41Rpc('vacre_41_set_visibility',{p_public:check.checked});v41Message('Visibilité du deck mise à jour.')}catch(e){check.checked=!check.checked;v41Message('Erreur : '+e.message)}finally{check.disabled=false}};
  control.append(check,document.createTextNode(' Deck public (visible sur les profils des autres joueurs)'));mount.append(control);
  const grid=document.createElement('div');grid.className='v41-grid';mount.append(grid);
  for(let slot=1;slot<=5;slot++){
   const existing=v41Deck.cards.find(x=>x.slot===slot);
   const card=document.createElement('div');card.className='v41-slot';card.dataset.rarity=existing?.rarity||'none';
   const heading=document.createElement('div');heading.className='v41-slot-title';heading.textContent='EMPLACEMENT '+slot;card.append(heading);
   const select=document.createElement('select');select.setAttribute('aria-label','Vacre emplacement '+slot);
   const none=document.createElement('option');none.value='';none.textContent='— Emplacement libre —';select.append(none);
   const used=new Set(v41Deck.cards.filter(c=>c.slot!==slot).map(c=>c.name));
   for(const [name,qty] of Object.entries(v23Inventory||{}).filter(([name,q])=>q>0&&!used.has(name)&&cards.some(c=>c.name===name&&c.rarity!=='special')).sort((a,b)=>a[0].localeCompare(b[0],'fr'))){
    const opt=document.createElement('option');opt.value=name;opt.textContent=name+' (×'+qty+')';select.append(opt);
   }
   select.value=existing?.name||'';card.append(select);
   const foot=document.createElement('div');foot.className='v41-slot-foot';
   const count=document.createElement('input');count.type='number';count.min=1;count.max=10;count.value=existing?.amount||1;count.setAttribute('aria-label','Nombre de Vacres');foot.append(count);
   const save=document.createElement('button');save.textContent='ENREGISTRER';foot.append(save);
   save.onclick=async()=>{save.disabled=true;try{const num=select.value?Number(count.value):0;v41Deck=await v41Rpc('vacre_41_set_deck',{p_slot:slot,p_card:select.value||null,p_amount:num});v41Message('Deck enregistré !');await v41Render()}catch(e){v41Message('Erreur : '+e.message)}finally{save.disabled=false}};
   card.append(foot);
   const detail=document.createElement('small');detail.textContent=existing?'Niveau '+existing.level+' · '+existing.amount+' sélectionné(s) · '+existing.owned+' possédé(s)':'Choisis un Vacre de ta collection';card.append(detail);grid.append(card);
  }
  const info=document.createElement('p');info.className='v41-caption';info.textContent='Combat fiscal : chaque attaque consomme un exemplaire sélectionné dans ton deck. L’évolution est conservée.';mount.append(info);
  const status=document.createElement('p');status.id='v41-status';status.setAttribute('role','status');mount.append(status);
 }catch(e){mount.textContent='Deck indisponible : '+e.message}finally{v41Loading=false}
}
async function v41ShowPublicDeck(userId,place){
 if(!userId||!place)return;const panel=document.createElement('section');panel.className='v41-public';panel.textContent='Chargement du deck…';place.append(panel);
 try{const result=await v41Rpc('vacre_41_get_deck',{p_user:userId});panel.replaceChildren();
  const title=document.createElement('h4');title.textContent='⚔️ Deck de combat';panel.append(title);
  if(!result.visible){const p=document.createElement('p');p.textContent='🔒 Ce joueur garde son deck privé.';panel.append(p);return}
  if(!result.cards.length){const p=document.createElement('p');p.textContent='Ce joueur ne possède pas encore de deck.';panel.append(p);return}
  for(const c of result.cards){const item=document.createElement('div');item.className='v41-public-row';item.textContent='CASE '+c.slot+' · '+c.name+' ×'+c.amount+' · NIVEAU '+c.level;panel.append(item)}
 }catch(e){panel.textContent='Deck indisponible'}
}
(function(){
 const s=document.createElement('style');s.textContent='.v41-deck{padding:22px;margin:22px 0;background:linear-gradient(135deg,#182c39,#234e59);color:#e9fff4;border:3px solid #64e6bf;border-radius:18px;box-shadow:5px 5px #17352d}.v41-deck h3{margin:0;color:#adffda}.v41-head p{opacity:.86;margin:8px 0 17px}.v41-visibility{display:flex;gap:9px;align-items:center;margin:14px 0 18px;font-weight:bold}.v41-visibility input{width:18px;height:18px;accent-color:#39d6ad}.v41-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(185px,1fr));gap:12px}.v41-slot{border:2px solid #66cfb9;border-radius:13px;padding:12px;background:#0f2632;min-height:158px;display:flex;flex-direction:column;gap:10px}.v41-slot-title{font-weight:900;color:#a7ffe0;font-size:12px;letter-spacing:1px}.v41-slot select{width:100%;font:inherit;min-width:0;padding:9px;background:#e7fff8;border:0;border-radius:6px;color:#17333b}.v41-slot-foot{display:flex;gap:7px}.v41-slot-foot input{width:60px;padding:7px;border-radius:6px;background:white;color:#123}.v41-slot-foot button{flex:1;font-size:11px;border:0;background:#57e5b9;color:#10342c;border-radius:6px;font-weight:900;cursor:pointer}.v41-slot small{opacity:.8}.v41-caption{font-size:12px;opacity:.8;margin:14px 0 2px}.v41-public{border:1px solid #9bd9be;padding:12px;border-radius:10px;margin-top:14px;background:#e3f9ee;color:#12362e}.v41-public-row{padding:6px 0;border-bottom:1px solid #bbd9cd}.v41-level{display:inline-flex;align-self:center;font-size:10px;letter-spacing:.5px;font-weight:900;border:1px solid #444;padding:4px 7px;border-radius:5px;color:white;background:#737373}.v41-level[data-level="2"]{background:#277ded}.v41-level[data-level="3"]{background:#b18a23}';s.textContent+=`\n.v39-world .v39-sprite{transform-origin:center bottom;will-change:transform,filter}.v39-sprite.player.v41-attack-fx{animation:v41-player-attack .68s steps(5,end)}.v39-sprite.enemy.v41-attack-fx{animation:v41-enemy-attack .68s steps(5,end)}.v39-sprite.v41-hit-fx{animation:v41-hit .75s steps(4,end)}.v39-world.v41-critical-fx{animation:v41-critical .5s steps(4,end)}@keyframes v41-player-attack{0%{transform:translate(0,0)}45%{transform:translate(94px,-38px) scale(1.09)}70%{transform:translate(75px,-20px)}100%{transform:translate(0,0)}}@keyframes v41-enemy-attack{0%{transform:translate(0,0)}45%{transform:translate(-88px,42px) scale(1.08)}70%{transform:translate(-65px,28px)}100%{transform:translate(0,0)}}@keyframes v41-hit{0%,40%,80%{filter:brightness(1)}25%,65%{filter:brightness(4) sepia(1) saturate(5) hue-rotate(300deg);transform:translateX(8px)}50%{transform:translateX(-8px)}100%{filter:none;transform:none}}@keyframes v41-critical{0%,100%{filter:none}40%{filter:brightness(2.3) contrast(1.4)}}.v41-float-damage{position:absolute;right:13%;top:28%;z-index:20;color:#b90f22;font:900 25px monospace;text-shadow:2px 2px #fff;background:#fffbe3d9;padding:4px;animation:v41-damage 1.2s ease-out forwards;pointer-events:none}.v41-player-damage{left:14%;right:auto;top:67%}@keyframes v41-damage{0%{opacity:0;transform:translateY(15px) scale(.6)}25%{opacity:1;transform:translateY(-8px) scale(1.3)}100%{opacity:0;transform:translateY(-46px) scale(1)}}@media(prefers-reduced-motion:reduce){.v39-sprite.v41-attack-fx,.v39-sprite.v41-hit-fx,.v39-world.v41-critical-fx,.v41-float-damage{animation:none!important}}\n`;document.head.append(s);
 const root=document.createElement('section');root.id='v41-deck-root';root.className='v41-deck';
 const page=v41El('profil');if(page)page.append(root);
 const nav=window.v2Navigate;window.v2Navigate=function(page,...a){const result=nav.call(this,page,...a);if(page==='profil')setTimeout(v41Render,450);return result};
 const show=window.vpShowPublic;if(typeof show==='function')window.vpShowPublic=function(p){const result=show(p);const dest=document.querySelector('#vp-search-results .vp-card');if(dest)v41ShowPublicDeck(p.user_id||p.id,dest);return result};
 window.addEventListener('load',()=>{if(document.body.dataset.v2Page==='profil')setTimeout(v41Render,900)});
})();
