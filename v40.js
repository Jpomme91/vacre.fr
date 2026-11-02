(function(){const col=document.getElementById('collection');if(col){const d=document.createElement('div');d.innerHTML="<div id=\"v40-alert\" class=\"v40-alert\" hidden><strong>🚨 ALERTE : VACRE CORROMPU</strong><p>Un Vacre <b id=\"v40-rarity\">INCONNU</b> est infecté. Identifie-le avant la destruction de tous ses exemplaires !</p><div class=\"v40-foot\"><span>⏳ <b id=\"v40-timer\">24 h</b></span><button id=\"v40-open\" onclick=\"v40Open()\">🔬 SCANNER</button></div></div>";col.insertBefore(d.firstElementChild,col.firstChild)}const d=document.createElement('div');d.innerHTML="<div id=\"v40-modal\" hidden role=\"dialog\" aria-modal=\"true\" aria-label=\"Scanner VACRE\"><section class=\"v40-scanner\"><div class=\"v40-heading\"><strong>🔬 LABORATOIRE VACRE — RAYONS X</strong><button onclick=\"v40Close()\">✕ FERMER</button></div><p>Choisis une carte de la rareté annoncée.</p><div class=\"v40-controls\"><select id=\"v40-card\"></select><button id=\"v40-scan-button\" onclick=\"v40Scan()\">LANCER LE SCANNER</button></div><div class=\"v40-body\"><div class=\"v40-canvas\" id=\"v40-canvas\" onpointermove=\"v40Move(event)\" onpointerdown=\"v40Move(event)\"><div id=\"v40-symbol\">?</div><div id=\"v40-scanner-line\"></div><div id=\"v40-points\"></div></div><div class=\"v40-text\"><h3 id=\"v40-xray-name\">CARTE NON ANALYSÉE</h3><strong id=\"v40-progress\">0 anomalie détectée</strong><p id=\"v40-result\" role=\"status\">Passe le scanner sur le Vacre pour faire apparaître les anomalies.</p><p>Déplace le faisceau avec la souris ou le doigt. Clique sur chaque point rouge.</p></div></div></section></div>";document.body.appendChild(d.firstElementChild);const css=document.createElement('style');css.id='v40-style';css.textContent="\n.v40-alert[hidden],#v40-modal[hidden]{display:none!important}.v40-alert{padding:20px;margin:20px 0;border:4px solid #b82835;border-radius:15px;background:#fff0df;color:#421316;box-shadow:5px 5px #512026}.v40-alert>strong{color:#a81928;font-size:21px}.v40-alert p{margin:12px 0;line-height:1.6}.v40-foot{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.v40-foot b{font-size:21px;color:#b82835}.v40-foot button{background:#b82835;color:white;border:2px solid #4c1720;border-radius:8px;padding:12px 20px;font-weight:900;cursor:pointer}\n#v40-modal{position:fixed;inset:0;z-index:1000004;display:grid;place-items:center;background:#06171ced;padding:12px;overflow:auto}.v40-scanner{width:min(870px,98vw);max-height:96vh;overflow:auto;background:#10313a;color:#c9ffef;border:4px solid #5ce6c8;border-radius:13px;padding:20px;font-family:monospace;box-shadow:0 0 45px #43fac45c}.v40-heading{display:flex;gap:15px;align-items:center;justify-content:space-between;color:#9affdf}.v40-heading strong{font-size:18px}.v40-heading button,.v40-controls button{background:#4ce8bc;color:#06352e;border:0;border-radius:8px;padding:12px;cursor:pointer;font-weight:900}.v40-controls{display:flex;gap:12px;margin:18px 0;flex-wrap:wrap}.v40-controls select{flex:1;min-width:150px;padding:12px;background:#dcfff6;border:2px solid #62e7cf;color:#0d343a}.v40-body{display:grid;grid-template-columns:1fr 1fr;gap:20px}.v40-canvas{position:relative;aspect-ratio:4/5;overflow:hidden;cursor:crosshair;touch-action:none;border:3px solid #5ce6c8;background:repeating-linear-gradient(0deg,transparent 0 25px,#74fbe519 26px 27px),radial-gradient(#296c6f,#102e38 80%)}#v40-symbol{position:absolute;inset:0;display:grid;place-items:center;font-size:clamp(80px,15vw,190px);color:#9dffe7;opacity:.6;pointer-events:none;filter:grayscale(1) sepia(1) hue-rotate(100deg)}#v40-scanner-line{position:absolute;left:0;right:0;top:50%;height:35px;background:#80ffe038;border-top:2px solid #a4ffe7;border-bottom:2px solid #a4ffe7;box-shadow:0 0 25px #79ffe7;transform:translateY(-50%);pointer-events:none}#v40-points{position:absolute;inset:0;pointer-events:none}.v40-node{position:absolute;transform:translate(-50%,-50%);width:25px;height:25px;border:3px solid #fff0ed;border-radius:50%;background:#f62444;box-shadow:0 0 0 7px #ff334438,0 0 20px #f62444;cursor:pointer;pointer-events:auto}.v40-text{border:1px solid #4daea0;background:#103640;padding:18px;display:flex;flex-direction:column;gap:14px;line-height:1.55}.v40-text h3{color:#87ffe0;margin:0;overflow-wrap:anywhere}.v40-text strong{color:#ff7584}#v40-result{padding:14px;border-left:4px solid #60e6c5;background:#091e29;font-weight:bold}@media(max-width:640px){.v40-body{grid-template-columns:1fr}.v40-canvas{max-height:48vh;width:min(100%,340px);margin:auto}.v40-heading strong{font-size:14px}}\n";document.head.appendChild(css)})();
/* VACRE 4.0 — Rayons X, le serveur garde la véritable contamination */
let v40Status=null,v40Selected=null,v40ScanData=null,v40Coord={x:50,y:50},v40Busy=false;
const v40El=id=>document.getElementById(id);
const v40Names={common:'COMMUN',rare:'RARE',epic:'ÉPIQUE',legendary:'LÉGENDAIRE',mythic:'MYTHIQUE'};
const v40Rpc=async(name,args)=>{const {data,error}=await supabaseClient.rpc(name,args||{});if(error)throw error;return data};
function v40Message(t){if(v40El('v40-result'))v40El('v40-result').textContent=t}
function v40Deadline(){const panel=v40El('v40-alert');if(!panel||!v40Status?.active)return;const remaining=new Date(v40Status.deadline).getTime()-Date.now();const h=Math.max(0,Math.floor(remaining/3600000)),m=Math.max(0,Math.floor(remaining%3600000/60000)),s=Math.max(0,Math.floor(remaining%60000/1000));v40El('v40-timer').textContent=h+' h '+String(m).padStart(2,'0')+' min '+String(s).padStart(2,'0')+' s';if(remaining<=0){v40El('v40-timer').textContent='DÉLAI EXPIRÉ';v40El('v40-open').disabled=true}}
async function v40Refresh(){
 if(!currentUser){v40Status=null;v40El('v40-alert')?.setAttribute('hidden','');return}
 try{v40Status=await v40Rpc('vacre_40_status');const box=v40El('v40-alert');if(!box)return;
 box.hidden=!v40Status.active;
 if(v40Status.active){v40El('v40-rarity').textContent=v40Names[v40Status.rarity]||v40Status.rarity;v40Deadline()}
 else if(v40Status.last){v40Message(v40Status.last.status==='saved'?'Dernière corruption éliminée. Collection protégée.':'Dernière corruption expirée. '+(v40Status.last.lost||0)+' exemplaire(s) perdu(s).')}
 }catch(e){console.warn('Corruption VACRE :',e.message)}
}
function v40FillList(){
 const sel=v40El('v40-card');sel.replaceChildren();const rarity=v40Status?.rarity;
 const owned=Object.entries(v23Inventory||{}).filter(([name,q])=>Number(q)>0&&cards.some(c=>c.name===name&&c.rarity===rarity));
 owned.sort((a,b)=>a[0].localeCompare(b[0],'fr'));
 for(const [name,q] of owned){const o=document.createElement('option');o.value=name;o.textContent=name+' ×'+q;sel.append(o)}
 if(!owned.length){const o=document.createElement('option');o.textContent='Aucune carte disponible dans cette rareté';sel.append(o)}
 sel.disabled=!owned.length;v40El('v40-scan-button').disabled=!owned.length;
}
async function v40Open(){
 await v40Refresh();if(!v40Status?.active)return;
 try{await v23RefreshInventory()}catch(e){}
 v40El('v40-modal').hidden=false;v40Selected=null;v40ScanData=null;v40FillList();v40Clear();v40Message('Sélectionne un Vacre '+(v40Names[v40Status.rarity]||'')+', puis lance le scanner.')}
function v40Close(){v40El('v40-modal').hidden=true;v40ScanData=null;v40Selected=null;v40Refresh()}
function v40Clear(){const points=v40El('v40-points');points?.replaceChildren();v40El('v40-xray-name').textContent='CARTE NON ANALYSÉE';v40El('v40-symbol').textContent='?';v40El('v40-scanner-line').style.top='50%';}
async function v40Scan(){
 if(v40Busy||!v40Status?.active)return;const name=v40El('v40-card').value;if(!name)return;
 v40Busy=true;v40El('v40-scan-button').disabled=true;
 try{
  const result=await v40Rpc('vacre_40_scan',{p_card:name});v40Selected=name;v40ScanData=result;
  const c=cards.find(x=>x.name===name);v40El('v40-xray-name').textContent=name.toUpperCase();v40El('v40-symbol').textContent=c?.symbol||'✦';
  if(!result.infected){v40Message('✅ Aucune corruption détectée sur '+name+'. Continue tes recherches !');v40El('v40-points').replaceChildren();return}
  v40Message('🚨 CONTAMINATION DÉTECTÉE ! Déplace le rayon X sur la carte et clique sur tous les points rouges.');v40DrawPoints();
 }catch(e){v40Message('Scanner indisponible : '+e.message)}finally{v40Busy=false;v40El('v40-scan-button').disabled=false}
}
function v40DrawPoints(){
 const root=v40El('v40-points');root.replaceChildren();if(!v40ScanData?.infected)return;
 const solved=new Set(v40ScanData.resolved||[]);const x=v40Coord.x,y=v40Coord.y;
 for(const p of v40ScanData.points||[]){
  if(solved.has(p.id))continue;
  const dist=Math.hypot(x-p.x,y-p.y);
  if(dist>24)continue;
  const b=document.createElement('button');b.type='button';b.className='v40-node';b.style.left=p.x+'%';b.style.top=p.y+'%';b.title='Éliminer anomalie '+p.id;b.setAttribute('aria-label','Éliminer anomalie '+p.id);
  b.onclick=e=>{e.stopPropagation();v40Fix(p.id)};root.append(b);
 }
 const done=v40ScanData.resolved?.length||0;
 v40El('v40-progress').textContent=done+'/'+(v40ScanData.points?.length||0)+' anomalies éliminées';
}
function v40Move(e){
 const area=v40El('v40-canvas');if(!area||!v40ScanData?.infected)return;
 const r=area.getBoundingClientRect();v40Coord.x=Math.min(100,Math.max(0,100*(e.clientX-r.left)/r.width));v40Coord.y=Math.min(100,Math.max(0,100*(e.clientY-r.top)/r.height));
 v40El('v40-scanner-line').style.top=v40Coord.y+'%';v40DrawPoints();
}
async function v40Fix(id){
 if(v40Busy||!v40ScanData?.infected)return;v40Busy=true;
 try{const response=await v40Rpc('vacre_40_fix',{p_card:v40Selected,p_point:id});
 v40ScanData.resolved=response.resolved;v40DrawPoints();
 if(response.saved){v40Message('✅ CONTAMINATION ÉRADIQUÉE ! Toutes les quantités de '+v40Selected+' sont sauvées !');v40ScanData=null;v40El('v40-points').replaceChildren();v40El('v40-progress').textContent='PURIFIÉ';await v40Refresh();setTimeout(()=>v40Close(),2200)}
 else v40Message('Anomalie neutralisée : '+response.count+'/'+response.total+'. Continue !');
 }catch(e){v40Message('Erreur : '+e.message)}finally{v40Busy=false}
}
(function(){
 const nav=window.v2Navigate;
 window.v2Navigate=function(page,...args){const res=nav.call(this,page,...args);if(page==='collection')v40Refresh();return res};
 setTimeout(()=>v40Refresh(),1600);
 setInterval(()=>{if(currentUser&&document.body.dataset.v2Page==='collection')v40Refresh()},60000);
 setInterval(v40Deadline,1000);
})();
