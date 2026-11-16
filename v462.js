/* VACRE 4.6.2 — UI housekeeping, bank loan marker, latest news only */
(function(){
 'use strict';
 const $=id=>document.getElementById(id);
 const css=document.createElement('style');css.id='v462-style';
 css.textContent=[
 '.v462-history-fold{max-width:100%;margin:18px 0 25px;border:1px solid #70756a;border-radius:16px;overflow:hidden;background:var(--surface,#292d2b);color:var(--text,#f4f0e2)}',
 '.v462-history-fold>summary{padding:17px 19px;cursor:pointer;font-weight:900;font-size:15px;list-style-position:inside;outline-offset:-3px}',
 '.v462-history-fold>summary:hover{background:#bdad4422}',
 '.v462-history-fold[open]>summary{border-bottom:1px solid #7777}',
 '.v462-history-fold>.vp-card{margin:0!important;max-width:100%;border:0!important;border-radius:0!important;box-shadow:none!important}',
 '.v462-history-fold .vp-log-wrap{overflow:auto;max-height:380px;max-width:100%;overscroll-behavior:contain;scrollbar-width:thin}',
 '.v462-history-fold table{min-width:560px}',
 '#v462-friend-profile-panel[hidden]{display:none!important}',
 '#pet-restart{margin:12px auto 18px;display:block;max-width:100%;background:#e7d676;border:2px solid #4d4730;color:#24261f;border-radius:13px;padding:12px 19px;font-weight:900;cursor:pointer}',
 '#pet-restart[hidden]{display:none!important}',
 '.v462-reaction{background:#343b35!important;color:#fff!important;border:1px solid #9ea18b!important;border-radius:13px!important;padding:8px 14px!important;font:inherit;font-weight:800!important;font-size:13px!important;cursor:pointer}',
 '.v462-reaction[aria-pressed="true"]{background:#f0d86f!important;color:#161d18!important;border-color:#e7c653!important}',
 '.v462-replies[hidden]{display:none!important}',
 '.v462-replies{margin-top:15px;padding:13px;background:#202724;border:1px solid #5b695f;border-radius:13px;color:#f5eee4}',
 '.v462-thread{max-height:330px;overflow-y:auto;display:grid;gap:8px}',
 '.v462-reply{background:#2e3934;border-radius:10px;border-left:3px solid #d5c262;padding:10px 13px;color:#f4f5ee}',
 '.v462-reply strong{font-size:13px}.v462-reply small{font-size:11px;color:#c5c7b6}',
 '.v462-reply p{font-size:13px;line-height:1.5;white-space:pre-wrap;margin:5px 0!important}',
 '.v462-reply button{font-size:11px!important;padding:6px 9px!important;background:transparent!important;border:1px solid #858e82!important;color:#fff!important}',
 '.v462-reply-form{display:flex;gap:8px;align-items:end;flex-wrap:wrap;margin-top:12px}',
 '.v462-reply-form textarea{flex:1 1 210px;min-height:65px;resize:vertical;color:#fff!important;background:#303832!important;border:1px solid #8b967f!important;border-radius:9px;padding:10px;font:inherit;font-size:13px}',
 '.v462-reply-form button{flex:none;min-height:39px}',
 'body.v462-loan-active #v311-header-coins:not(.v45-overdraft),body.v462-loan-active #urabucks-balance:not(.v45-overdraft),body.v462-loan-active #v35-balance:not(.v45-overdraft){color:#68bfff!important;-webkit-text-fill-color:#68bfff!important;text-shadow:0 0 9px #2598fa22}',
 'body.v462-loan-active #v311-header-coins:not(.v45-overdraft){border-color:#68bfff!important;background:#1c3750!important}',
 'body.v462-loan-active #v311-header-coins:not(.v45-overdraft) b,body.v462-loan-active #v311-header-coins:not(.v45-overdraft) span{color:#68bfff!important;-webkit-text-fill-color:#68bfff!important}',
 'body.v462-loan-active .wallet-balance,body.v462-loan-active .v35-balance{border-color:#579fe3!important}',
 '.v462-loan-indicator{padding:10px 14px;margin:12px 0;border-radius:12px;border:1px solid #439fea;background:#19364c;color:#b1dbff;font-size:13px;font-weight:800}',
 '@media(max-width:650px){.v462-reply-form button{width:100%}.v462-history-fold .vp-log-wrap{max-height:320px}.v462-reaction{font-size:12px!important}}'
 ].join('\n');
 document.head.append(css);

 function latestNews(){
  const root=$('v23-news-details');if(!root||root.dataset.v462Done)return;
  root.dataset.v462Done='1';
  const blocks=[...root.children];
  const last=blocks[0];
  // Conservons uniquement cette MAJ et la précédente, sans archives depuis la création.
  for(const el of blocks.slice(1))el.remove();
  const b=document.createElement('div');b.className='v361-news';
  const h=document.createElement('b');h.textContent='VACRE 4.6.2 — COMMUNAUTÉ ET CORRECTIFS';
  const p=document.createElement('p');
  p.textContent='Réponses, pouces levés et baissés sous les publications. ISV uniquement à partir de 1,5 million U de patrimoine imposable, chaque lundi à minuit (Paris). Crédits bancaires réparés et solde bleu durant le crédit ; adoption de nouveau possible après le décès d’un Vacre Pet. Historique personnel du Market repliable, panneaux inutiles retirés et suggestions remises à zéro le lundi.';
  b.append(h,p);
  if(last)root.insertBefore(b,last);else root.append(b);
 }
 latestNews();

 // Le panneau de profil d’ami n’occupe plus la page tant qu’aucun ami n’a été choisi.
 const previousFriend=window.v32OpenFriendProfile;
 if(typeof previousFriend==='function'){
  window.v32OpenFriendProfile=async function(...args){
   const panel=$('v462-friend-profile-panel');if(panel)panel.hidden=false;
   return previousFriend.apply(this,args);
  };
 }

 let loanLoading=false,lastLoan=0;
 async function updateLoan(force=false){
  if(!currentUser){
   document.body.classList.remove('v462-loan-active');
   $('v462-loan-indicator')?.remove();
   return;
  }
  if(loanLoading||(!force&&Date.now()-lastLoan<60000))return;
  loanLoading=true;lastLoan=Date.now();
  const uid=currentUser.id;
  try{
   const {data,error}=await supabaseClient.rpc('vacre_34_status');
   if(error)throw error;
   if(!currentUser||currentUser.id!==uid)return;
   const active=!!data?.loan;
   document.body.classList.toggle('v462-loan-active',active);
   const root=$('v34-content');let banner=$('v462-loan-indicator');
   if(active&&root){
    if(!banner){banner=document.createElement('div');banner.id='v462-loan-indicator';banner.className='v462-loan-indicator';root.prepend(banner)}
    banner.textContent='🔵 Crédit actif : '+Number(data.loan.remaining||0).toLocaleString('fr-FR',{maximumFractionDigits:2})+' U à rembourser. Ton solde s’affiche en bleu tant que le crédit est actif.';
   }else banner?.remove();
   const wallet=$('urabucks-balance');if(wallet)wallet.title=active?'Crédit bancaire VACRE actif':'';
  }catch(e){console.warn('VACRE crédit :',e.message)}
  finally{loanLoading=false}
 }
 window.v462RefreshLoan=updateLoan;
 const oldRefresh=window.v34Refresh;
 if(typeof oldRefresh==='function')window.v34Refresh=async function(...args){const result=await oldRefresh.apply(this,args);await updateLoan(true);return result;};
 const oldNav=window.v2Navigate;
 if(typeof oldNav==='function')window.v2Navigate=function(page,...args){const x=oldNav.call(this,page,...args);if(['accueil','market','profil','v34-bank'].includes(page))updateLoan();return x};
 function init(){latestNews();updateLoan(true)}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
 else init();
 setInterval(()=>{if(currentUser)updateLoan();},65000);
 window.addEventListener('focus',()=>updateLoan(true));
})();