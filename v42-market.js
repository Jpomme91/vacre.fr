/* VACRE Market — confirmation lisible sur mobile */
(function(){
 const css=document.createElement('style');
 css.textContent=`
 #v33-trade-modal{padding:18px;background:rgba(6,8,12,.83);backdrop-filter:blur(7px)}
 #v33-trade-modal .v33-trade-card{width:min(510px,100%);max-height:calc(100dvh - 28px);overflow:auto;background:linear-gradient(156deg,#292c32 0%,#1b1f25 100%);color:#fafafa;border:1px solid #696e7a;border-radius:26px;padding:clamp(20px,5vw,32px);box-shadow:0 25px 80px rgba(0,0,0,.6);font-family:inherit}
 #v33-trade-modal .v33-trade-card h3{font-size:clamp(21px,5vw,27px);letter-spacing:-.5px;line-height:1.18;margin:0 0 7px}
 #v33-trade-modal .v33-preview-kicker{display:inline-flex;font-size:10px;letter-spacing:2px;color:#eadf4e;font-weight:900;margin:0 0 12px}
 #v33-trade-modal .v33-preview-subtitle{font-size:13px;color:#b8bbc2;margin:0 0 22px;line-height:1.5}
 #v33-trade-modal #v33-preview-body{line-height:normal;margin:0}
 #v33-trade-modal .v42-hero{border-radius:17px;background:#36383e;border:1px solid #51545a;padding:19px;margin-bottom:16px}
 #v33-trade-modal .v42-hero-label{font-size:12px;color:#c3c7ce;letter-spacing:.8px;text-transform:uppercase;font-weight:800}
 #v33-trade-modal .v42-hero-value{font-size:clamp(27px,7vw,38px);font-weight:950;letter-spacing:-1px;color:#efe642;margin:10px 0 2px;line-height:1.1}
 #v33-trade-modal .v42-hero-small{font-size:12px;color:#c5c6ca}
 #v33-trade-modal .v42-section{margin:15px 0 7px;color:#b3b8c3;text-transform:uppercase;letter-spacing:1.4px;font-size:10px;font-weight:900}
 #v33-trade-modal .v42-row{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;padding:13px 0;border-bottom:1px solid rgba(255,255,255,.10);font-size:13px}
 #v33-trade-modal .v42-row span{color:#c5c7d0;line-height:1.4}
 #v33-trade-modal .v42-row strong{text-align:right;font-weight:900;color:#fff;font-size:14px;white-space:nowrap}
 #v33-trade-modal .v42-row strong.v42-positive{color:#78e0aa}
 #v33-trade-modal .v42-row strong.v42-negative{color:#ffb5a5}
 #v33-trade-modal .v42-row:last-child{border-bottom:0}
 #v33-trade-modal .v33-note{display:block;font-size:11px;line-height:1.55;color:#b2b7c3;padding:12px 13px;background:#292f37;border-radius:11px;margin:18px 0 0}
 #v33-trade-modal .v33-trade-actions{gap:12px;margin-top:22px}
 #v33-trade-modal .v33-trade-actions button{min-height:54px;font-size:13px;letter-spacing:.3px;border-radius:12px}
 #v33-trade-modal #v33-cancel{background:#3b3f46;color:#fff}
 #v33-trade-modal #v33-confirm{background:#eee341;color:#22231d}
 @media(max-width:390px){#v33-trade-modal{padding:9px}#v33-trade-modal .v33-trade-card{padding:18px;border-radius:20px}#v33-trade-modal .v42-hero-value{font-size:28px}}
 `;
 document.head.append(css);
 const modal=document.getElementById('v33-trade-modal');
 if(modal){const heading=modal.querySelector('h3');if(heading){const kicker=document.createElement('div');kicker.className='v33-preview-kicker';kicker.textContent='✦ VACRE MARKET · ORDRE DE TRANSACTION';heading.before(kicker);const sub=document.createElement('div');sub.className='v33-preview-subtitle';sub.textContent='Vérifie les détails avant de valider ton échange.';heading.after(sub)}}
 window.v33Preview=function(side,quantity){
  return new Promise(resolve=>{
   const modal=document.getElementById('v33-trade-modal'),body=document.getElementById('v33-preview-body');
   const price=Number(liveMarketPrice),k=.00025,floor=.01;
   const factor=Math.exp((side==='buy'?1:-1)*k*quantity);
   const floorQty=Math.log(Math.max(1,price/floor))/k;
   const next=side==='buy'?price*factor:Math.max(floor,price*factor);
   const subtotal=side==='buy'?price*(factor-1)/k:quantity<=floorQty?price*(1-factor)/k:(price-floor)/k+(quantity-floorQty)*floor;
   const average=subtotal/quantity,fee=subtotal*.005;
   const total=side==='buy'?subtotal+fee:subtotal-fee;
   const impact=Math.abs((next/price-1)*100);
   const fmt=(n,dec=2)=>Number(n).toLocaleString('fr-FR',{maximumFractionDigits:dec,minimumFractionDigits:dec});
   const row=(label,value,style='')=>{const d=document.createElement('div');d.className='v42-row';const l=document.createElement('span');l.textContent=label;const v=document.createElement('strong');v.textContent=value;if(style)v.className=style;d.append(l,v);body.append(d)};
   body.replaceChildren();
   const hero=document.createElement('div');hero.className='v42-hero';
   const label=document.createElement('div');label.className='v42-hero-label';label.textContent=side==='buy'?'Montant total à payer':'Montant total à recevoir';
   const val=document.createElement('div');val.className='v42-hero-value';val.textContent=fmt(total)+' U';
   const detail=document.createElement('div');detail.className='v42-hero-small';detail.textContent=(side==='buy'?'ACHAT':'VENTE')+' DE '+quantity.toLocaleString('fr-FR')+' VACRE'+(quantity>1?'S':'');
   hero.append(label,val,detail);body.append(hero);
   const section=document.createElement('div');section.className='v42-section';section.textContent='Détails du cours';body.append(section);
   row('Cours actuel',fmt(price)+' U');
   row('Cours moyen d’exécution',fmt(average,4)+' U');
   row('Frais du Market (0,5 %)',fmt(fee)+' U');
   row('Impact estimé sur le cours',(side==='buy'?'+':'−')+fmt(impact)+' %',side==='buy'?'v42-positive':'v42-negative');
   row('Cours après transaction',fmt(next,4)+' U');
   const section2=document.createElement('div');section2.className='v42-section';section2.textContent='Après la transaction';body.append(section2);
   row('Solde urabucks estimé',fmt(uracoin+(side==='buy'?-total:total))+' U');
   row('Vacres possédés',fmt(ownedVacre+(side==='buy'?quantity:-quantity),0));
   document.getElementById('v33-preview-note').textContent='Prix moyen progressif et frais inclus dans le total. Le serveur recalcule les montants à la validation ; aucune limite quotidienne.';
   modal.hidden=false;
   const ok=document.getElementById('v33-confirm'),cancel=document.getElementById('v33-cancel');
   const close=approved=>{modal.hidden=true;ok.onclick=null;cancel.onclick=null;resolve(approved)};
   ok.onclick=()=>close(true);cancel.onclick=()=>close(false);
  })
 };
})();