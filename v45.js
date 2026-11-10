/* VACRE 4.4.1 — maintenance : quêtes, roue, scanner groupé, navigation. */
(function(){
 'use strict';
 const $=id=>document.getElementById(id);

 // Libellés de navigation sobres, sans toucher aux badges de notifications.
 const labels={
  accueil:'accueil',boutique:'boutique',collection:'collection',journal:'quête',
  market:'market','v34-bank':'banque',roue:'roue',vacrerie:'vacrerie',
  amis:'social',assemblee:'communauté',profil:'profil',parametres:'paramètres',
  mentions:'mentions légales','vacre-pet':'vacre pet',arbre:'arbre à vacres',
  surprise:'surprise',convertisseur:'convertisseur',suggestions:'suggestions',
  vacrebot:'collection'
 };
 function simplifyMenu(){
  document.querySelectorAll('.v2-drawer-links button').forEach(button=>{
   const handler=button.getAttribute('onclick')||'';
   const match=handler.match(/v2Navigate\(['"]([^'"]+)['"]\)/);
   if(!match)return;
   const label=labels[match[1]];
   if(!label)return;
   const first=Array.from(button.childNodes).find(n=>n.nodeType===Node.TEXT_NODE);
   if(first)first.textContent=label+' ';
   else button.prepend(document.createTextNode(label+' '));
   for(const span of button.querySelectorAll(':scope > span')){
    if(span.textContent.trim()==='↗' || span.textContent.trim()==='→')span.remove();
   }
  });
  document.querySelectorAll('.v2-drawer-links .v29-menu-group').forEach(group=>{
   group.textContent=group.textContent.toLocaleLowerCase('fr');
  });
 }
 simplifyMenu();

 // Rafraîchir l'état de la roue en revenant dans son onglet, y compris après minuit.
 const prevNavigate=window.v2Navigate;
 window.v2Navigate=function(page,...args){
  const result=prevNavigate.call(this,page,...args);
  if(page==='roue' && typeof refreshWheelStatus==='function'){
   refreshWheelStatus().catch(e=>console.warn('Roue :',e));
  }
  return result;
 };
 setInterval(()=>{
  if(document.body.dataset.v2Page==='roue' && !wheelSpinning && typeof refreshWheelStatus==='function'){
   refreshWheelStatus().catch(e=>console.warn('Roue :',e));
  }
 },60000);

 // Scan d'une rareté entière en un seul appel serveur.
 const scanControls=document.querySelector('#v40-modal .v40-controls');
 if(scanControls){
  const button=document.createElement('button');
  button.type='button';button.id='v45-scan-group';
  button.textContent='analyser toute la rareté';
  button.title='Analyse toutes tes cartes de la rareté annoncée en un seul clic';
  scanControls.append(button);
  const help=document.querySelector('#v40-modal .v40-scanner > p');
  if(help)help.textContent='Analyse toutes les cartes de la rareté en un clic, ou inspecte une carte précise.';
  const style=document.createElement('style');
  style.id='v45-scanner-style';
  style.textContent='#v45-scan-group{background:#e2c96b!important;color:#1a2828!important;border:2px solid #bca049!important;border-radius:8px;padding:12px 15px;font-weight:900;cursor:pointer}#v45-scan-group:disabled{opacity:.6;cursor:wait}.v40-controls #v45-scan-group{flex-basis:100%}';
  document.head.append(style);
 }
 window.v45ScanGroup=async function(){
  const button=$('v45-scan-group');
  if(!currentUser||!v40Status?.active||v40Busy)return;
  v40Busy=true;
  if(button)button.disabled=true;
  try{
   v40Message('Analyse groupée en cours…');
   const {data,error}=await supabaseClient.rpc('vacre_45_scan_group');
   if(error)throw error;
   if(!data?.active){v40Message('Aucune contamination active.');return}
   if(!data.infected){
    v40ScanData=null;v40Selected=null;v40Clear();
    v40Message((data.scanned||0)+' cartes analysées : aucune carte infectée disponible.');
    return;
   }
   v40Selected=data.card;
   v40ScanData=data;
   const dropdown=$('v40-card');
   if(dropdown&&Array.from(dropdown.options).some(x=>x.value===data.card))dropdown.value=data.card;
   $('v40-xray-name').textContent=data.card.toUpperCase();
   const card=cards.find(c=>c.name===data.card);
   $('v40-symbol').textContent=card?.symbol||'✦';
   v40Coord={x:50,y:50};
   v40DrawPoints();
   v40Message('Contamination localisée après '+(data.scanned||0)+' analyses ! Déplace le faisceau sur la carte et élimine les anomalies rouges.');
  }catch(e){v40Message('Analyse groupée impossible : '+e.message)}
  finally{v40Busy=false;if(button)button.disabled=false}
 };
 $('v45-scan-group')?.addEventListener('click',window.v45ScanGroup);

 // Le menu et le scanner sont créés par plusieurs scripts différents.
 // Reste compatible avec les éléments ajoutés au chargement de la page.
 window.addEventListener('load',simplifyMenu);
})();
