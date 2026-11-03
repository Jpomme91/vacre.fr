/* VACRE 4.2 — fiches de cartes, indicateurs d'évolution */
(function(){
 const style=document.createElement('style');
 style.textContent=`
 #collection-grid .v42-evolve-hint{display:block;width:fit-content;max-width:100%;margin:5px auto 0;padding:4px 7px;border-radius:6px;border:1px solid #8888;color:#7d7d80;background:#f4f3ef;font-size:9px;letter-spacing:.5px;font-weight:900;text-align:center;line-height:1.3}
 #collection-grid .v42-evolve-hint.v42-evolve-ready{color:#105a36;background:#e2ffec;border:1px solid #45ac75;box-shadow:0 0 0 1px #d9f7e2}
 #collection-grid .v42-info-button{background:#273c49!important;border:1px solid #6699aa!important;color:#fff!important;letter-spacing:.3px}
 #collection-grid .v37-under-button{margin-top:7px}
 #v42-info-modal[hidden]{display:none!important}
 #v42-info-modal{position:fixed;inset:0;z-index:10000010;display:grid;place-items:center;padding:15px;background:rgba(7,12,21,.78);backdrop-filter:blur(6px)}
 .v42-info-panel{position:relative;width:min(480px,100%);max-height:min(90dvh,750px);overflow:auto;border-radius:19px;background:linear-gradient(140deg,#1e3340,#13242f);color:#f2f8f6;border:2px solid #73bfa8;box-shadow:0 25px 80px #0009;padding:clamp(18px,5vw,29px)}
 .v42-info-heading{display:flex;align-items:center;gap:14px;margin-bottom:18px}
 .v42-info-symbol{font-size:35px;display:grid;place-items:center;flex:0 0 68px;height:76px;border-radius:13px;background:#c6b34b;color:#152d35}
 .v42-info-heading h3{font-size:clamp(19px,4.5vw,25px);line-height:1.2;margin:0 0 8px;color:#fff;overflow-wrap:anywhere}
 .v42-info-subtitle{color:#b2e5d6;font-size:12px;font-weight:900;letter-spacing:.6px}
 .v42-info-section{font-size:11px;font-weight:900;letter-spacing:1.4px;color:#8edcc7;text-transform:uppercase;margin:20px 0 8px}
 .v42-info-row{display:flex;gap:12px;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid #ffffff22}
 .v42-info-row span{color:#becfd1;font-size:13px}.v42-info-row strong{color:#fff;text-align:right;font-size:14px}
 .v42-info-highlight{padding:15px;background:#294b51;border-radius:12px;border:1px solid #417f79;margin-top:16px}
 .v42-info-highlight span{color:#bde4cf;font-size:12px}
 .v42-info-highlight strong{display:block;color:#f1e47c;font-size:18px;margin-top:6px}
 .v42-info-description{line-height:1.6;padding:13px;border:1px dashed #72968d;border-radius:10px;font-size:13px;color:#c2d7d1}
 .v42-info-close{display:block;width:100%;min-height:46px;margin-top:22px;border:0;border-radius:11px;background:#f0df72;color:#132932;font-weight:900;cursor:pointer}
 `;
 document.head.append(style);
 const modal=document.createElement('div');modal.id='v42-info-modal';modal.hidden=true;modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-label','Informations du Vacre');
 const box=document.createElement('section');box.className='v42-info-panel';modal.append(box);document.body.append(modal);
 let restoreFocus=null;
 function close(){modal.hidden=true;box.replaceChildren();if(restoreFocus?.isConnected)restoreFocus.focus()}
 function row(label,val){const el=document.createElement('div');el.className='v42-info-row';const l=document.createElement('span');l.textContent=label;const v=document.createElement('strong');v.textContent=val;el.append(l,v);box.append(el)}
 window.v42ShowCardInfo=function(card){
  if(!card)return;
  restoreFocus=document.activeElement;
  box.replaceChildren();
  const head=document.createElement('div');head.className='v42-info-heading';
  const symbol=document.createElement('div');symbol.className='v42-info-symbol';symbol.textContent=card.symbol||'✦';
  const group=document.createElement('div');const title=document.createElement('h3');title.textContent=typeof vacreBotDisplayName==='function'?vacreBotDisplayName(card.name):card.name;
  const subtitle=document.createElement('div');subtitle.className='v42-info-subtitle';subtitle.textContent=(typeof rarityText==='function'?rarityText(card.rarity):card.rarity).toUpperCase()+' · NIVEAU '+Math.max(1,Math.min(3,Number(v37.levels.get(card.name)||1)));
  group.append(title,subtitle);head.append(symbol,group);box.append(head);
  const rarity=card.rarity,level=Math.max(1,Math.min(3,Number(v37.levels.get(card.name)||1))),owned=Number(v23Inventory?.[card.name]||0);
  const costs={common:50,rare:35,epic:20,legendary:10,mythic:5};
  const damage={common:2,rare:7,epic:12,legendary:17,mythic:23};
  const heading=document.createElement('div');heading.className='v42-info-section';heading.textContent='Statistiques';box.append(heading);
  row('Rareté',(typeof rarityText==='function'?rarityText(rarity):rarity));
  row('Niveau d’évolution',level+' / 3');
  row('Exemplaires possédés',owned.toLocaleString('fr-FR'));
  if(damage[rarity]!=null){
   row('Dégâts de base',damage[rarity]);
   row('Dégâts actuels',damage[rarity]+(level===3?8:level===2?3:0));
   row('Dégâts en coup critique',(damage[rarity]+(level===3?8:level===2?3:0))*2);
   const highlight=document.createElement('div');highlight.className='v42-info-highlight';
   const label=document.createElement('span');label.textContent=level===3?'ÉVOLUTION TERMINÉE':'PROCHAINE ÉVOLUTION';
   const value=document.createElement('strong');value.textContent=level===3?'NIVEAU MAXIMUM':costs[rarity]+' exemplaires nécessaires · '+owned+' possédés';
   highlight.append(label,value);box.append(highlight);
  }
  const sect=document.createElement('div');sect.className='v42-info-section';sect.textContent='Description du Vacre';box.append(sect);
  const description=document.createElement('p');description.className='v42-info-description';description.textContent='La description personnalisée de ce Vacre sera ajoutée dans une prochaine mise à jour.';box.append(description);
  const closeBtn=document.createElement('button');closeBtn.className='v42-info-close';closeBtn.textContent='FERMER';closeBtn.onclick=close;box.append(closeBtn);
  modal.hidden=false;closeBtn.focus();
 };
 modal.addEventListener('click',e=>{if(e.target===modal)close()});
 document.addEventListener('keydown',e=>{if(!modal.hidden&&e.key==='Escape')close()});
})();