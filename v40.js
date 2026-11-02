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
