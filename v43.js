/* VACRE 4.3 — Anniversaires, présence et Arbre à Vacres */
(function(){
 const $=id=>document.getElementById(id);
 const call=async(fn,args={})=>{const {data,error}=await supabaseClient.rpc(fn,args);if(error)throw error;return data};
 const css=document.createElement('style');
 css.textContent=`
 #v43-birthday{border:2px solid #d8b655;background:linear-gradient(140deg,#fffbe5,#eee9d3);padding:19px;border-radius:20px;margin:20px 0;color:#292621}
 #v43-birthday h3{font-size:21px;margin:0 0 9px}
 #v43-birthday p{font-size:13px;line-height:1.5;margin:6px 0 12px}
 .v43-birth-form{display:flex;flex-wrap:wrap;gap:9px;align-items:center}.v43-birth-form input{padding:11px;border:1px solid #c7bb8f;border-radius:10px;min-width:180px;font:inherit}
 .v43-primary{border:0;background:#e4d545;color:#222;border-radius:12px;padding:11px 16px;font:800 13px inherit;cursor:pointer}
 .v43-status{min-height:18px;margin-top:10px;font-size:13px}
 .v43-activity{display:inline-block;vertical-align:middle;margin-left:8px;font-size:11px;font-weight:650;letter-spacing:0;color:#597b76;background:#e5f5ec;border-radius:7px;padding:5px 8px;white-space:nowrap}
 body.vacre-dark .v43-activity{color:#c8ffdd;background:#234d42}
 #arbre{display:none;padding:35px max(16px,6vw);max-width:1350px;margin:0 auto}
 body[data-v2-page="arbre"] #arbre{display:block}
 .v43-tree-wrap{max-width:920px;margin:0 auto;color:#f3f9ee;background:linear-gradient(#1a3834,#152a29);border:2px solid #6fc79f;border-radius:25px;padding:clamp(14px,4vw,30px);box-shadow:0 18px 45px #0002}
 .v43-tree-wrap h2{font-size:clamp(26px,5vw,42px);margin:0 0 8px;color:#d6ffba}
 .v43-tree-wrap p{font-size:14px;line-height:1.5;color:#d5e9df}
 .v43-tree-stats{display:flex;gap:10px;flex-wrap:wrap;margin:15px 0}
 .v43-tree-stat{border:1px solid #82a49e;background:#233f39;padding:10px 14px;border-radius:12px;font-size:13px}
 .v43-tree-stage{position:relative;height:clamp(320px,52vw,510px);width:100%;max-width:650px;margin:10px auto 22px;overflow:hidden;border-radius:22px;background:linear-gradient(#527f87 0%,#8fb9af 63%,#547e4b 64%,#355b3a 100%);isolation:isolate}
 .v43-tree-stage:after{content:"";position:absolute;z-index:0;bottom:0;left:-10%;width:120%;height:24%;border-radius:50% 50% 0 0;background:#42794f}
 .v43-tree-svg{position:absolute;inset:0;z-index:1;width:100%;height:100%;overflow:visible;filter:drop-shadow(0 10px 10px #233b2b88)}
 .v43-fruit{position:absolute;z-index:5;top:24%;left:64%;transform:translate(-50%,-50%);width:70px;height:70px;border:3px solid #ffeec1;background:linear-gradient(145deg,#f9d85e,#c17b19);border-radius:50%;box-shadow:0 0 0 9px #e6b53655,0 5px 20px #352a15aa;color:#30210a;font-size:29px;cursor:pointer;animation:v43-bob 2s ease-in-out infinite}
 .v43-fruit:after{content:"CUEILLIR";position:absolute;left:50%;bottom:-30px;transform:translateX(-50%);font:900 11px Arial;background:#f9e9b0;border-radius:9px;padding:4px 9px;color:#382b12}
 @keyframes v43-bob{0%,100%{transform:translate(-50%,-50%)}50%{transform:translate(-50%,-61%)}}
 .v43-tree-control{display:flex;justify-content:center;flex-wrap:wrap;gap:10px}
 .v43-tree-control button{padding:13px 23px;border:0;border-radius:12px;background:#d9ef80;color:#263c25;font-weight:900;cursor:pointer}
 .v43-tree-control button:disabled{opacity:.65;cursor:default}
 .v43-tree-feedback{text-align:center;font-weight:700;min-height:23px;margin-top:15px}
 @media(max-width:480px){.v43-fruit{width:56px;height:56px}.v43-birth-form input{max-width:100%;width:100%}}
 `;
 document.head.append(css);
 const birthday=document.createElement('section');birthday.id='v43-birthday';
 birthday.innerHTML='<h3>🎂 Ton anniversaire VACRE</h3><p>Le jour de ton anniversaire, reçois un God Pack offert : 15 Vacres légendaires et 15 mythiques. Ta date de naissance reste privée et ne peut être enregistrée qu’une seule fois.</p><div id="v43-birth-body">Chargement…</div><p class="v43-status" id="v43-birth-status" role="status"></p>';
 $('profil')?.insertBefore(birthday,$('profil')?.querySelector('.vp-card')||null);
 const page=document.createElement('section');page.id='arbre';page.className='v2-extra-page';
 page.innerHTML='<div class="v43-tree-wrap"><div class="v2-section-kicker">NATURE & COLLECTION</div><h2>🌳 L’ARBRE À VACRES</h2><p>Arrose ton arbuste une fois par jour pour le faire grandir. Chaque arrosage peut faire pousser un fruit-Vacre à cueillir. Plus il grandit, plus les Vacres rares deviennent fréquents.</p><div class="v43-tree-stats"><div class="v43-tree-stat" id="v43-tree-level">🌿 Stade 1</div><div class="v43-tree-stat" id="v43-tree-days">💧 0 jour arrosé</div><div class="v43-tree-stat" id="v43-tree-picked">🍎 0 Vacre récolté</div></div><div class="v43-tree-stage" id="v43-tree-stage"><svg class="v43-tree-svg" viewBox="0 0 600 500" preserveAspectRatio="xMidYMax meet" aria-label="Arbre VACRE"><g id="v43-tree-drawing"></g></svg><button type="button" class="v43-fruit" id="v43-fruit" hidden aria-label="Cueillir le Vacre sur la branche">✦</button></div><div class="v43-tree-control"><button id="v43-water" type="button">💧 ARROSER MON ARBRE</button></div><p id="v43-tree-feedback" class="v43-tree-feedback" role="status"></p></div>';
 document.querySelector('main')?.append(page);if(!page.isConnected)document.body.append(page);
 const navs=document.querySelector('.v2-drawer-links');if(navs){const b=document.createElement('button');b.type='button';b.innerHTML='🌳 Arbre à Vacres <span>↗</span>';b.onclick=()=>window.v2Navigate('arbre');const existing=[...navs.querySelectorAll('button')].find(x=>x.textContent.includes('Ma collection'));if(existing)existing.after(b);else navs.append(b)}
 const drawing=$('v43-tree-drawing'),fruit=$('v43-fruit'),water=$('v43-water');
 let treeStatus=null,treeBusy=false;
 function drawTree(stage){
  const ns='http://www.w3.org/2000/svg';drawing.replaceChildren();
  const add=(name,props)=>{const el=document.createElementNS(ns,name);Object.entries(props).forEach(([k,v])=>el.setAttribute(k,v));drawing.append(el);return el};
  const height=stage===0?90:125+stage*42;
  const startY=420,endY=startY-height;
  add('ellipse',{cx:300,cy:420,rx:110,ry:20,fill:'#244f34'});
  add('path',{d:'M300 425 Q289 324 300 '+endY,stroke:'#725038','stroke-width':Math.max(10,12+stage*5),fill:'none','stroke-linecap':'round'});
  if(stage===0){add('ellipse',{cx:300,cy:320,rx:24,ry:34,fill:'#78bf60'});return}
  let branches=3+stage*2;
  for(let i=0;i<branches;i++){
   const frac=(i+1)/(branches+1),y=startY-height*frac,dir=i%2===0?-1:1,len=34+stage*12+((i*13)%25);
   const x2=300+dir*len,y2=y-(22+stage*4);
   add('path',{d:'M300 '+(y+10)+' Q'+(300+dir*len*.55)+' '+(y-8)+' '+x2+' '+y2,stroke:'#70503a','stroke-width':Math.max(4,stage+4),fill:'none','stroke-linecap':'round'});
   add('ellipse',{cx:x2,cy:y2,rx:Math.max(15,10+stage*6),ry:Math.max(18,16+stage*6),fill:i%3===0?'#77b76e':'#4fa66b',opacity:'.95'});
  }
  add('ellipse',{cx:300,cy:endY,rx:16+stage*12,ry:22+stage*9,fill:'#78bd6a',opacity:'.92'});
  if(stage>=4){for(let j=0;j<stage*3;j++){let angle=j*2.39996,rad=18+(j%5)*11;add('circle',{cx:300+Math.cos(angle)*rad,cy:endY+Math.sin(angle)*rad,r:6,fill:'#b4d67b'})}}
 }
 async function loadTree(){
  if(!currentUser){$('v43-tree-feedback').textContent='Connecte-toi pour cultiver ton arbre.';water.disabled=true;drawTree(0);fruit.hidden=true;return}
  try{
   treeStatus=await call('vacre_43_tree_status');
   drawTree(Number(treeStatus.stage||0));
   $('v43-tree-level').textContent='🌿 Stade '+treeStatus.stage+' / 6';
   $('v43-tree-days').textContent='💧 '+treeStatus.water_days+' arrosage(s)';
   $('v43-tree-picked').textContent='🍎 '+treeStatus.picked_total+' Vacre(s) cueilli(s)';
   water.disabled=!treeStatus.can_water;water.textContent=treeStatus.can_water?'💧 ARROSER MON ARBRE':'✓ ARROSÉ AUJOURD’HUI';
   fruit.hidden=!treeStatus.fruit_ready;
   fruit.style.left=(Number(treeStatus.stage)>=4?'70%':'61%');
   fruit.style.top=(Number(treeStatus.stage)>=4?'26%':'46%');
   fruit.title=treeStatus.fruit_ready?'Cueillir '+treeStatus.fruit_card:'';
   $('v43-tree-feedback').textContent=treeStatus.fruit_ready?'✦ Un Vacre a poussé ! Appuie sur le fruit pour le récolter.':treeStatus.can_water?'Ton arbre attend son arrosage.':'Reviens demain pour le prochain arrosage.';
  }catch(e){$('v43-tree-feedback').textContent='Arbre indisponible : '+e.message}
 }
 water.onclick=async()=>{if(treeBusy||!currentUser)return;treeBusy=true;water.disabled=true;try{await call('vacre_43_tree_water');await loadTree()}catch(e){$('v43-tree-feedback').textContent=e.message}finally{treeBusy=false}};
 fruit.onclick=async()=>{if(treeBusy||!currentUser)return;treeBusy=true;fruit.disabled=true;try{const data=await call('vacre_43_tree_pick');await Promise.allSettled([window.v23RefreshInventory?.(),window.v24RenderOwn?.()]);await loadTree();$('v43-tree-feedback').textContent='🎉 Récolte : '+data.name+' ('+data.rarity+') ajouté à ta collection !'}catch(e){$('v43-tree-feedback').textContent=e.message}finally{treeBusy=false;fruit.disabled=false}};
 async function loadBirthday(){
  if(!currentUser){$('v43-birth-body').textContent='Connecte-toi pour enregistrer ton anniversaire.';return}
  try{
   let state=await call('vacre_43_birthday_status');
   const pending=currentUser.user_metadata?.birthday;
   if(!state.configured&&pending){try{state=await call('vacre_43_birthday_set',{p_birthday:pending})}catch(e){console.warn('Date de naissance :',e.message)}}
   const body=$('v43-birth-body');body.replaceChildren();
   if(!state.configured){
    const form=document.createElement('form');form.className='v43-birth-form';
    const input=document.createElement('input');input.type='date';input.max=new Date().toISOString().slice(0,10);input.required=true;input.setAttribute('aria-label','Date de naissance');
    const btn=document.createElement('button');btn.type='submit';btn.className='v43-primary';btn.textContent='ENREGISTRER MA DATE';
    form.append(input,btn);body.append(form);
    form.onsubmit=async e=>{e.preventDefault();btn.disabled=true;try{await call('vacre_43_birthday_set',{p_birthday:input.value});$('v43-birth-status').textContent='Date enregistrée !';await loadBirthday()}catch(err){$('v43-birth-status').textContent=err.message}finally{btn.disabled=false}};
    return
   }
   const p=document.createElement('p');const [y,m,d]=state.birthday.split('-');p.textContent='🎂 Anniversaire enregistré : '+d+'/'+m+'/'+y+'. Cette date reste privée.';body.append(p);
   if(state.claimable){
    const button=document.createElement('button');button.className='v43-primary';button.textContent='🎁 RÉCUPÉRER MON GOD PACK (30 CARTES)';body.append(button);
    button.onclick=async()=>{button.disabled=true;try{const gift=await call('vacre_43_birthday_claim');$('v43-birth-status').textContent='🎉 Joyeux anniversaire ! 15 légendaires et 15 mythiques ont été ajoutés à ta collection.';await window.v23RefreshInventory?.();window.v24RenderOwn?.();await loadBirthday()}catch(err){$('v43-birth-status').textContent=err.message;button.disabled=false}};
   }else{const done=document.createElement('p');done.textContent=state.last_claim_year===new Date().getFullYear()?'✓ God Pack annuel déjà récupéré.':'Reviens le jour de ton anniversaire pour récupérer ton God Pack !';body.append(done)}
  }catch(e){$('v43-birth-status').textContent='Anniversaire indisponible : '+e.message}
 }
 async function showPresence(id,container){
  if(!id||!container)return;
  const title=container.querySelector('h3');if(!title)return;
  let badge=title.querySelector('.v43-activity');
  if(!badge){badge=document.createElement('small');badge.className='v43-activity';title.append(badge)}
  badge.textContent='Activité…';
  try{const data=await call('vacre_361_profile_activity',{p_user:id});if(badge.isConnected)badge.textContent=data.is_online?'🟢 En ligne':data.last_seen_at?'Dernière activité : '+new Date(data.last_seen_at).toLocaleString('fr-FR',{dateStyle:'short',timeStyle:'short'}):'Aucune activité récente'}
  catch(e){if(badge.isConnected)badge.textContent='Activité indisponible'}
 }
 const oldShow=window.vpShowPublic;
 if(typeof oldShow==='function')window.vpShowPublic=function(p){const value=oldShow.apply(this,arguments);const root=$('vp-search-results');showPresence(p.user_id||p.id,root);return value};
 function ownPresence(){const own=$('vp-profile-body')?.querySelector('.vp-hero');if(own&&currentUser)showPresence(currentUser.id,own)}
 function initProfile(){if(!currentUser)return;loadBirthday();setTimeout(ownPresence,350)}
 const ownRoot=$('vp-profile-body');
 if(ownRoot){new MutationObserver(()=>{
   const name=ownRoot.querySelector('.vp-hero h3');
   if(currentUser&&name&&!name.querySelector('.v43-activity'))ownPresence();
 }).observe(ownRoot,{childList:true,subtree:true})}
 const oldNav=window.v2Navigate;
 window.v2Navigate=function(page,...args){const result=oldNav.apply(this,[page,...args]);if(page==='arbre')loadTree();if(page==='profil')setTimeout(initProfile,500);return result};
 window.addEventListener('load',()=>{if(currentUser){if(document.body.dataset.v2Page==='profil')setTimeout(initProfile,900);if(document.body.dataset.v2Page==='arbre')setTimeout(loadTree,500)}});
 setInterval(()=>{if(currentUser&&document.body.dataset.v2Page==='profil')ownPresence()},60000);
})();