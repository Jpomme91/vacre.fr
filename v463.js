/* VACRE 4.6.3 — boutique de rareté quotidienne et correctifs de lisibilité.
   Achats disponibles avec le prix fixé et un exemplaire de pack par jour. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const css=document.createElement('style');css.id='v463-corrections';
css.textContent=[
/* Le badge "!" doit obéir au hidden natif, même avec display:inline-grid ailleurs. */
'.v311-collection-dot[hidden],#v38-journal-dot[hidden]{display:none!important}',
/* Bilan des boosters à la place de l’ancienne animation : aucun halo persistant. */
'.reveal-stage.v463-results-active{display:block!important;min-height:0!important;height:auto!important;margin-top:16px!important;padding:0!important;overflow:visible!important;background:transparent!important;border:0!important;box-shadow:none!important;filter:none!important;animation:none!important}',
'.reveal-stage.v463-results-active:before,.reveal-stage.v463-results-active:after{display:none!important}',
'.reveal-stage.v463-results-active .pack-results{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(135px,100%),1fr));align-items:stretch;gap:13px;margin:12px auto!important;width:100%;max-width:1100px}',
'.reveal-stage.v463-results-active .result-card{min-width:0}',
/* La feuille du thème sombre masquait les bordures de rareté sous un !important générique. */
'body.vacre-dark .pack-results .result-card.common{border-color:#777e85!important;box-shadow:none!important}',
'body.vacre-dark .pack-results .result-card.rare{border-color:#418dff!important;box-shadow:0 0 0 1px #418dff55!important}',
'body.vacre-dark .pack-results .result-card.epic{border-color:#b45fff!important;box-shadow:0 0 0 1px #b45fff66,0 0 13px #b45fff44!important}',
'body.vacre-dark .pack-results .result-card.legendary{border-color:#efbe42!important;box-shadow:0 0 0 1px #efbe4277,0 0 18px #e9af3f55!important}',
'body.vacre-dark .pack-results .result-card.mythic{border-color:#ff5576!important;box-shadow:0 0 0 1px #ff557677,0 0 18px #ff557655!important}',
'body.vacre-dark .pack-results .result-card.special{border-color:#25f6ae!important;box-shadow:0 0 14px #13c996,0 0 27px #0dbd7d88!important;background:linear-gradient(135deg,#15362c,#1a6550 55%,#15362c)!important;color:#eafff5!important}',
'body.vacre-dark .collection-card.special{border-color:#25f6ae!important;box-shadow:0 0 15px #13c996,0 0 27px #0dbd7d88!important;background:linear-gradient(135deg,#15362c,#1a6550 55%,#15362c)!important;color:#eafff5!important}',
/* Packs quotidiens : achats sécurisés et monnaie du jeu uniquement. */
'#v463-shop{max-width:1250px;margin:0 auto 36px;padding:23px;border:1px solid #767359;border-radius:20px;background:#202524;color:#f6f4e9;font-family:inherit}',
'#v463-shop h3{font-size:clamp(20px,3vw,26px);margin:0 0 7px;color:#f3e3a4}',
'#v463-shop .v463-subtitle{font-size:13px;color:#d6d6c6;line-height:1.5;margin:5px 0 19px}',
'#v463-shop .v463-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}',
'#v463-shop .v463-pack{display:flex;flex-direction:column;gap:9px;min-width:0;padding:17px 15px;background:#2b312f;border:1px solid #5b635e;border-radius:15px}',
'#v463-shop .v463-pack[data-rarity="common"]{border-top:4px solid #abb1b8}',
'#v463-shop .v463-pack[data-rarity="rare"]{border-top:4px solid #468dfa}',
'#v463-shop .v463-pack[data-rarity="epic"]{border-top:4px solid #b678fd}',
'#v463-shop .v463-pack h4{font-size:18px;margin:0;color:#fff}',
'#v463-shop .v463-pack strong{font-size:35px;line-height:1.1;color:#ead35a}',
'#v463-shop .v463-pack p{font-size:12px;color:#d6ded7;margin:0}',
'#v463-shop .v463-pack details{font-size:12px;color:#efedda;border-top:1px solid #787d7280;padding-top:9px}',
'#v463-shop .v463-pack summary{cursor:pointer;font-weight:850;line-height:1.8}',
'#v463-shop .v463-pack ul{padding-left:20px;margin:7px 0;max-height:230px;overflow-y:auto}',
'#v463-shop .v463-pack li{margin:5px 0;line-height:1.3;overflow-wrap:anywhere}',
'#v463-shop .v463-pack button{width:100%;padding:12px;border-radius:10px;border:1px solid #e8cc7b;background:linear-gradient(120deg,#f7e19a,#cda247);color:#242317;font-weight:900;cursor:pointer;margin-top:auto;transition:filter .2s}',
'#v463-shop .v463-pack button:hover:not(:disabled){filter:brightness(1.08)}',
'#v463-shop .v463-pack button:disabled{cursor:not-allowed;opacity:.58;background:#444c47;color:#f0ece0;border-color:#777}',
'#v463-shop .v464-daily-status{font-size:13px;font-weight:800;padding:10px 0;min-height:24px;color:#f0dc94}',
'#v463-shop .v463-next{font-size:12px;color:#d5d6c7;margin-top:15px}',
'body:not(.vacre-dark) #v463-shop{background:#f7f3e6;color:#272921}',
'body:not(.vacre-dark) #v463-shop h3{color:#282921}',
'body:not(.vacre-dark) #v463-shop .v463-subtitle,body:not(.vacre-dark) #v463-shop .v463-next{color:#454a44}',
'body:not(.vacre-dark) #v463-shop .v463-pack{background:#fff;color:#202420}',
'body:not(.vacre-dark) #v463-shop .v463-pack h4,body:not(.vacre-dark) #v463-shop .v463-pack p,body:not(.vacre-dark) #v463-shop .v463-pack details{color:#282921}',
'@media(max-width:780px){#v463-shop{margin:10px 12px 28px;padding:16px}#v463-shop .v463-grid{grid-template-columns:1fr}#v463-shop .v463-pack{padding:15px}.reveal-stage.v463-results-active .pack-results{grid-template-columns:repeat(auto-fit,minmax(min(120px,100%),1fr));gap:9px}}'
].join('\n');
document.head.append(css);

let latestDay=null,fetching=false;
const parisDay=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Paris',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
function element(tag,cls,text){
 const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=String(text);return el;
}
function mountShop(){
 const shop=$('boutique'),daily=$('v30-daily');
 if(!shop||!daily)return null;
 let root=$('v463-shop');
 if(!root){
  root=element('section');root.id='v463-shop';root.setAttribute('aria-label','Packs quotidiens de rareté');
  daily.after(root);
 }
 return root;
}
async function refreshShop(force=false){
 const root=mountShop();
 if(!root)return;
 const day=parisDay();
 if(!force&&latestDay===day)return;
 if(fetching)return;
 if(!currentUser){
  root.replaceChildren();
  root.append(element('h3',null,'Packs quotidiens de rareté'));
  root.append(element('p','v463-subtitle','Connecte-toi pour découvrir la sélection quotidienne et acheter tes packs en Urabucks.'));
  latestDay=null;return;
 }
 fetching=true;
 try{
  const {data,error}=await supabaseClient.rpc('vacre_463_daily_packs');
  if(error)throw error;
  latestDay=String(data.day||day);
  root.replaceChildren();
  root.append(element('h3',null,'Packs quotidiens de rareté'));
  root.append(element('p','v463-subtitle','Trois sélections renouvelées chaque jour à minuit (Paris). Un achat possible par type de pack et par jour. Les cartes niveau 3 sont exclues de tes sélections.'));
  const grid=element('div','v463-grid');
  for(const pack of data.packs||[]){
   const card=element('article','v463-pack');card.dataset.rarity=pack.id;
   const title=element('h4',null,pack.title||pack.id);
   const qty=element('strong',null,pack.quantity+' VACRES');
   const desc=element('p',null,'Une sélection quotidienne de '+pack.quantity+' Vacres '+({common:'communs',rare:'rares',epic:'épiques'}[pack.id]||pack.id)+'.');
   const details=element('details');const summary=element('summary',null,'Voir les cartes du jour');
   const list=element('ul');for(const c of pack.cards||[])list.append(element('li',null,c.name));
   details.append(summary,list);
   const label=pack.purchased?'DÉJÀ ACHETÉ AUJOURD’HUI':!pack.purchase_enabled?'INDISPONIBLE':'ACHETER · '+Number(pack.price||0).toLocaleString('fr-FR')+' U';
   const purchase=element('button',null,label);purchase.type='button';
   purchase.disabled=!pack.purchase_enabled;
   purchase.title=pack.purchased?'Reviens après minuit pour acheter ce pack à nouveau':!pack.purchase_enabled?'Sélection indisponible ou toutes les cartes sont déjà au niveau maximum':'Payer exactement '+pack.price+' Urabucks';
   purchase.addEventListener('click',()=>buyDailyPack(pack,purchase));
   card.append(title,qty,desc,details,purchase);grid.append(card);
  }
  root.append(grid);
  const status=element('p','v464-daily-status');status.id='v464-daily-status';status.setAttribute('role','status');root.append(status);
  const foot=element('p','v463-next','Prochaine rotation : '+new Date(data.next_rotation).toLocaleString('fr-FR',{dateStyle:'full',timeStyle:'short',timeZone:'Europe/Paris'})+' (heure de Paris).');
  root.append(foot);
 }catch(e){
  latestDay=null;root.replaceChildren(element('h3',null,'Packs quotidiens de rareté'),element('p','v463-subtitle','Sélection temporairement indisponible : '+e.message));
 }finally{fetching=false}
}
async function buyDailyPack(pack,button){
 if(!currentUser||button.disabled)return;
 if(!confirm('Acheter '+pack.quantity+' Vacres '+({common:'communs',rare:'rares',epic:'épiques'}[pack.id]||'')+' pour '+pack.price+' Urabucks ? Achat disponible une fois par jour.'))return;
 button.disabled=true;button.textContent='ACHAT EN COURS…';
 const notice=$('v464-daily-status');
 try{
  const {data,error}=await supabaseClient.rpc('vacre_464_buy_daily_pack',{p_rarity:pack.id});
  if(error)throw error;
  await Promise.allSettled([window.v23RefreshInventory?.(),window.loadMarketWallet?.()]);
  await refreshShop(true);
  const message='Pack '+pack.title+' acheté ! '+data.quantity+' Vacres ajoutés à la collection pour '+Number(data.paid).toLocaleString('fr-FR')+' U.';
  const current=$('v464-daily-status');
  if(current)current.textContent=message;
 }catch(err){
  button.disabled=false;button.textContent='RÉESSAYER · '+pack.price+' U';
  if(notice?.isConnected)notice.textContent='Achat impossible : '+err.message;
  else if($('v464-daily-status'))$('v464-daily-status').textContent='Achat impossible : '+err.message;
 }
}
window.v463RefreshShop=refreshShop;
const oldNav=window.v2Navigate;
if(typeof oldNav==='function')window.v2Navigate=function(page,...args){
 const result=oldNav.call(this,page,...args);
 if(page==='boutique')refreshShop();
 return result;
};
const init=()=>{mountShop();refreshShop(true)};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
setInterval(()=>{if(document.body.dataset.v2Page==='boutique'&&parisDay()!==latestDay)refreshShop(true)},45000);
window.addEventListener('focus',()=>{if(document.body.dataset.v2Page==='boutique')refreshShop(true)});
})();