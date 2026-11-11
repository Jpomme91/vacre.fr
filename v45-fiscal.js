/* VACRE 4.5 — interface du Market, ISV et découvert. Toutes les sommes sont fictives. */
(function(){
 'use strict';
 const $=id=>document.getElementById(id);
 const fmt=n=>Number(n||0).toLocaleString('fr-FR',{maximumFractionDigits:2});
 const when=t=>t?new Date(t).toLocaleString('fr-FR',{dateStyle:'medium',timeStyle:'short'}):'—';
 let fiscal=null,loading=false,lastFetch=0;
 function signedIn(){return typeof currentUser!=='undefined'&&!!currentUser?.id}
 const make=(tag,cls)=>{const e=document.createElement(tag);if(cls)e.className=cls;return e};
 const css=make('style');css.id='v45-fiscal-style';
 css.textContent=[
 '.v45-tax-card{margin:16px 0;padding:15px 17px;border-radius:16px;border:1px solid #bfa96b;background:#fff7db;color:#302917;font:inherit;line-height:1.5}',
 '.v45-tax-card h3{font-size:17px;margin:0 0 7px;color:#422e16}.v45-tax-card p{font-size:13px;margin:5px 0}',
 '.v45-tax-card .v45-values{display:flex;gap:8px 18px;flex-wrap:wrap;font-weight:800;margin:8px 0}',
 '.v45-tax-card .v45-tax-title{display:flex;align-items:center;gap:9px}',
 '.v45-tax-card.v45-debt{background:#fff0ec;border-color:#d65b56;color:#472321}',
 '.v45-overdraft,#v45-home-wealth .v45-red,.v45-negative{color:#d52e32!important;font-weight:900!important}',
 '#v34-bank .v45-tax-card{background:#2a2420;color:#f7e6bc;border:1px solid #d8b66b}',
 '#v34-bank .v45-tax-card.v45-debt{border-color:#fa7e7b;background:#352023}',
 '#v34-bank .v45-tax-card h3{color:#f8d879}',
 '.v45-tax-history{margin-top:12px;border-top:1px solid #ffffff45;padding-top:10px}',
 '.v45-tax-history li{padding:4px 0;list-style:none;font-size:12px}',
 '.v45-market-dates{display:flex;flex-wrap:wrap;gap:9px;align-items:end;margin:11px 0;padding:13px;border:1px solid #a9a9a9;border-radius:13px;background:#fff}',
 '.v45-market-dates[hidden]{display:none!important}',
 '.v45-market-dates label{font-size:12px;font-weight:750;display:grid;gap:5px}',
 '.v45-market-dates input{background:white;border:1px solid #888;border-radius:7px;padding:9px;max-width:210px;font:inherit;color:#212121}',
 '.v45-market-dates button{padding:10px 14px;border:0;border-radius:9px;background:#263b35;color:#fff;font-weight:800;cursor:pointer}',
 '#v45-market-status{font-size:12px;min-height:17px;color:#3b5a51;margin:7px 0}',
 '.v45-header-logo{display:block;width:55px;height:55px;object-fit:contain;flex:none;border-radius:10px;background:#000}',
 '.v45-hero-visual{display:block;width:100%;height:100%;object-fit:contain;background:#000;border-radius:17px}',
 '.v45-brand-word{font-family:Georgia,serif;font-size:clamp(15px,2vw,22px);letter-spacing:.7px;font-weight:900}',

 '#v45-home-wealth{box-sizing:border-box;width:min(1280px,calc(100% - 40px));max-width:1280px;margin:14px auto 0;padding:15px 20px;border:1px solid #444d42;border-radius:17px;background:#242a26;color:#f8f6e9;box-shadow:0 8px 26px #0000000f;display:flex;align-items:center;gap:20px;justify-content:space-between;flex-wrap:wrap;line-height:1.35;min-height:84px;font-family:inherit}',
 '#v45-home-wealth[hidden],#v45-bank-isv[hidden],#v45-market-isv[hidden]{display:none!important}',
 '#v45-home-wealth .v45-compact-lead{min-width:185px;flex:1 1 205px;display:flex;flex-direction:column;gap:4px;align-items:flex-start}',
 '#v45-home-wealth .v45-compact-kicker{font-size:10px;font-weight:900;letter-spacing:1.3px;text-transform:uppercase;color:#dfc959}',
 '#v45-home-wealth .v45-compact-title{font-size:15px!important;font-weight:850!important;line-height:1.32!important;color:#fcfaf0!important;margin:0!important;letter-spacing:0!important}',
 '#v45-home-wealth .v45-compact-values{flex:2 1 425px;display:grid;grid-template-columns:repeat(3,minmax(105px,1fr));gap:8px 18px;align-items:center}',
 '#v45-home-wealth .v45-compact-metric{min-width:0;display:flex;flex-direction:column;gap:4px;overflow-wrap:anywhere}',
 '#v45-home-wealth .v45-compact-metric small{font-size:10px;font-weight:750;letter-spacing:.4px;color:#c2c6bb!important;line-height:1.3}',
 '#v45-home-wealth .v45-compact-metric b{font-size:14px;line-height:1.2;font-weight:850;color:#fff!important;font-variant-numeric:tabular-nums}',
 '#v45-home-wealth .v45-compact-metric .v45-amount-emphasis{color:#e7d067!important}',
 '#v45-home-wealth .v45-compact-metric b.v45-negative{color:#ff9b9b!important}',
 '#v45-home-wealth .v45-compact-action{flex:none;border:1px solid #999f86;border-radius:10px;background:transparent;color:#faf5e0;padding:10px 12px;font:inherit;font-size:12px;font-weight:850;line-height:1.2;cursor:pointer;white-space:nowrap}',
 '#v45-home-wealth .v45-compact-action:hover,#v45-home-wealth .v45-compact-action:focus-visible{background:#353c31;outline:2px solid #d9c34e;outline-offset:2px}',
 '#v45-home-wealth.v45-debt{border-color:#b45252;background:#302225}',
 '#v45-home-wealth.v45-debt .v45-compact-kicker,#v45-home-wealth.v45-debt .v45-amount-emphasis{color:#ffa09c!important}',
 '#v45-home-wealth .v45-negative{color:#ffa09c!important}',
 '#v45-bank-isv,#v45-market-isv{font-size:14px;line-height:1.6;overflow-wrap:anywhere}',
 '#v45-bank-isv p,#v45-market-isv p{font-size:13px!important;line-height:1.6!important;font-weight:500!important;letter-spacing:normal!important;color:inherit!important;opacity:1!important;margin:7px 0!important}',
 '#v45-bank-isv h3,#v45-market-isv h3{font-size:17px!important;line-height:1.35!important;letter-spacing:normal!important;margin:0 0 8px!important}',
 '#v45-bank-isv .v45-values,#v45-market-isv .v45-values{font-size:13px!important;line-height:1.4!important}',
 '#v45-bank-isv .v45-negative,#v45-market-isv .v45-negative{color:#ffaaa8!important}',
 '#accueil .v2-hero-art{overflow:visible;isolation:isolate}',
 '#accueil .v45-hero-visual{display:block;width:min(100%,320px);height:100%;max-height:315px;object-fit:contain;background:transparent!important;border:none!important;border-radius:0!important;filter:drop-shadow(0 13px 20px #00000022)}',

 '@media(max-width:900px){#v45-home-wealth{padding:15px 17px;gap:12px}#v45-home-wealth .v45-compact-values{flex-basis:100%}#v45-home-wealth .v45-compact-action{align-self:center}}',
 '@media(max-width:650px){#v45-home-wealth{width:calc(100% - 24px);margin:11px 12px 0;border-radius:14px;gap:13px}#v45-home-wealth .v45-compact-lead{flex-basis:100%}#v45-home-wealth .v45-compact-values{grid-template-columns:repeat(2,minmax(0,1fr));gap:11px}#v45-home-wealth .v45-compact-metric b{font-size:13px}#v45-home-wealth .v45-compact-action{align-self:stretch;width:100%;text-align:center}#accueil .v2-hero-art{height:190px;order:-1}#accueil .v45-hero-visual{max-height:190px}.v45-header-logo{width:32px;height:32px}.v45-brand-word{font-size:15px}.v45-market-dates input{width:100%;max-width:none}}'
 ].join('');
 document.head.append(css);
 function card(where,id){
  if(!where)return null;
  let target=$(id);
  if(!target){target=make('section','v45-tax-card');target.id=id;target.setAttribute('aria-live','polite');
   where.append(target);}
  return target;
 }
 function fill(root,data,full){
  if(!root)return;
  if(!data){root.hidden=true;return;}root.hidden=false;
  const cash=Number(data.cash||0),wealth=Number(data.fortune||0),debt=Number(data.debt||0);
  const estimate=Number(data.estimated_isv||0), due=new Date(data.next_due).getTime();
  const remain=due-Date.now(), soon=remain<=86400000&&remain>0;
  root.classList.toggle('v45-debt',cash<0||debt>0);
  root.replaceChildren();
  const head=make('h3');head.textContent=cash<0?'Ministère : votre compte est à découvert.':
    wealth>5000?'Ministère : vous êtes beaucoup trop riche.':'Ministère : exonération de l’ISV';
  root.append(head);
  const intro=make('p');intro.textContent=wealth>5000?
    'Seule la moitié de vos Vacres du Market compte dans l’ISV. Le ministère compte sur vous pour financer ses prochaines absurdités.':
    'Le ministère juge que votre patrimoine ne permet pas encore de payer le café imaginaire du développeur.';
  root.append(intro);
  const stats=make('div','v45-values');
  const values=[['Patrimoine imposable',fmt(wealth)+' U'],['ISV estimé',fmt(estimate)+' U'],['Prochain contrôle',when(data.next_due)]];
  if(cash<0)values.unshift(['Découvert',fmt(cash)+' U / −1 000 U']);
  if(debt>0)values.push(['Dette fiscale restante',fmt(debt)+' U']);
  for(const item of values){const n=make('span');n.textContent=item[0]+' : '+item[1];if(item[0]==='Découvert')n.classList.add('v45-negative');stats.append(n)}
  root.append(stats);
  if(debt>0){const p=make('p');p.textContent='Les gains futurs rétablissent d’abord le solde ; ensuite 25 % des gains positifs remboursent la dette. Aucun nouvel ISV tant que cette dette subsiste.';root.append(p);}
  else if(soon){const p=make('p');p.textContent='Préavis fiscal : prélèvement dans moins de 24 heures. Les taxes déjà payées sur la période diminuent l’ISV.';root.append(p);}
  else if(wealth>5000){const p=make('p');p.textContent='La taxe minimale est de 2 % tous les 3 jours : solde disponible + 50 % des Vacres du Market valorisés au cours actuel. Les autres taxes sont déduites. Découvert maximal : −1 000 U.';root.append(p);}
  if(full){
   const details=make('p');
   details.textContent='Calcul ISV : solde disponible ('+fmt(cash)+' U) + 50 % des '+fmt(data.market_vacres)+' Vacres du Market, soit '+fmt(data.market_taxable_value)+' U retenus sur '+fmt(data.market_investment_value)+' U investis. Les cartes de collection sont exclues.';
   root.append(details);
   const ul=make('ul','v45-tax-history');
   for(const e of (data.history||[]).slice(0,6)){
    const li=make('li');
    li.textContent=when(e.date)+' · '+(e.kind==='isv'?'ISV prélevé':'Recouvrement de dette')+' · '+fmt(e.amount)+' U'+(e.kind==='isv'&&Number(e.debt_after||0)>0?' · reste '+fmt(e.debt_after)+' U de dette':'');
    ul.append(li);
   }
   if(ul.children.length)root.append(ul);
  }
 }
 function fillHome(root,data){
  if(!root)return;
  const cash=Number(data?.cash||0),wealth=Number(data?.fortune||0),debt=Number(data?.debt||0);
  if(!data||(wealth<=5000&&cash>=0&&debt<=0)){root.hidden=true;root.replaceChildren();return;}
  root.hidden=false;
  root.classList.add('v45-tax-compact');
  root.classList.toggle('v45-debt',cash<0||debt>0);
  root.replaceChildren();
  const head=make('div','v45-compact-lead');
  const kicker=make('span','v45-compact-kicker');
  kicker.textContent='⚖ ministère des finances';
  const heading=make('strong','v45-compact-title');
  heading.textContent=cash<0?'Votre compte est à découvert.':debt>0?'Votre dette intéresse le ministère.':'Vous êtes beaucoup trop riche.';
  head.append(kicker,heading);
  const stats=make('div','v45-compact-values');
  const items=[['Patrimoine imposable',fmt(wealth)+' U'],['ISV estimé',fmt(data.estimated_isv)+' U'],['Prochain contrôle',when(data.next_due)]];
  if(debt>0)items.splice(1,1,['Dette à rembourser',fmt(debt)+' U']);
  if(cash<0)items[0]=['Solde',fmt(cash)+' U'];
  for(const [label,value] of items){
    const item=make('div','v45-compact-metric');
    const caption=make('small');caption.textContent=label;
    const amount=make('b');amount.textContent=value;
    if(label==='ISV estimé'||label==='Dette à rembourser')amount.className='v45-amount-emphasis';
    if(label==='Solde')amount.classList.add('v45-negative');
    item.append(caption,amount);stats.append(item);
  }
  const action=make('button','v45-compact-action');
  action.type='button';action.textContent='Détails à la banque ↗';
  action.addEventListener('click',()=>{if(typeof window.v2Navigate==='function')window.v2Navigate('v34-bank')});
  root.append(head,stats,action);
 }
 function apply(){
  if(!signedIn()){for(const id of ['v45-home-wealth','v45-bank-isv','v45-market-isv']){const e=$(id);if(e)e.hidden=true;}return;}
  const hero=document.getElementById('accueil');
  const bank=document.getElementById('v34-bank');
  const market=document.querySelector('#market .market-dashboard .market-panel:last-child');
  let home=$('v45-home-wealth');
  if(!home&&hero){home=make('aside','v45-tax-card v45-tax-compact');home.id='v45-home-wealth';home.setAttribute('aria-label','Avis du ministère des finances');hero.after(home);}
  fillHome(home,fiscal);
  let target=$('v45-bank-isv');
  if(!target&&bank){target=make('section','v45-tax-card');target.id='v45-bank-isv';const tabs=bank.querySelector('.v35-tabs');if(tabs)tabs.before(target);else bank.append(target);}
  fill(target,fiscal,true);
  fill(card(market,'v45-market-isv'),fiscal,false);
  const isNegative=Number(fiscal?.cash||0)<0;
  for(const id of ['v311-header-coins','v35-balance','urabucks-balance','uracoin-balance','total-wealth']){
   $(id)?.classList.toggle('v45-overdraft',isNegative);
  }
  const b=$('v311-header-coins')?.querySelector('b');
  if(b&&fiscal)b.textContent=fmt(fiscal.cash);
  if($('v35-balance')&&fiscal)$('v35-balance').textContent=fmt(fiscal.cash)+' urabucks';
 }
 async function refreshFiscal(force=false){
  if(!signedIn()){fiscal=null;apply();return;}
  if(loading||(!force&&Date.now()-lastFetch<35000))return;
  loading=true;lastFetch=Date.now();
  try{const uid=currentUser.id;const {data,error}=await supabaseClient.rpc('vacre_45_tax_status');
   if(error)throw error;if(!signedIn()||currentUser.id!==uid)return;
   fiscal=data;apply();
  }catch(e){console.warn('ISV VACRE :',e.message)}
  finally{loading=false}
 }
 window.v45RefreshFiscal=refreshFiscal;

 // Sélecteur de périodes : historique réellement enregistré, sans valeur inventée.
 let allSeries=[],seriesReady=false,periodRequest=0,lastPeriodFetch=0;
 const oldSeries=window.v245Series;
 window.v245Series=function(){
  if(v245Period==='all'||v245Period==='custom')return seriesReady?allSeries:[];
  return oldSeries();
 };
 const oldRender=window.renderMarket;
 window.renderMarket=function(...args){
  const result=oldRender.apply(this,args);
  if((v245Period==='all'||v245Period==='custom')&&seriesReady){
   const vals=allSeries.map(p=>p.value);
   if(vals.length){
    const begin=vals[0],end=vals[vals.length-1],change=(end-begin)/Math.max(.0000001,begin)*100;
    if($('market-change'))$('market-change').textContent=(change>=0?'+':'')+change.toFixed(2).replace('.',',')+' % · '+(v245Period==='custom'?'DATES':'TOUT');
    if($('market-open'))$('market-open').textContent=fmt(begin)+' U';
    if($('market-high'))$('market-high').textContent=fmt(Math.max(...vals))+' U';
    if($('market-low'))$('market-low').textContent=fmt(Math.min(...vals))+' U';
   }else if($('market-change'))$('market-change').textContent='Aucune cotation sur cette période';
  }
  return result;
 };
 const head=document.querySelector('#market .v2-chart-head');
 const periods=head?.querySelector('.v245-periods');
 let range=null;
 if(periods){
  for(const [id,label] of [['all','tout'],['custom','dates']]){
   if(!periods.querySelector('[data-period="'+id+'"]')){
    const button=make('button');button.type='button';button.dataset.period=id;button.textContent=label;
    periods.append(button);
   }
  }
  range=make('div','v45-market-dates');range.id='v45-market-dates';range.hidden=true;
  const startLabel=make('label');startLabel.textContent='Du';
  const start=make('input');start.type='datetime-local';start.id='v45-start';
  const endLabel=make('label');endLabel.textContent='Au';
  const end=make('input');end.type='datetime-local';end.id='v45-end';
  const localDate=date=>new Date(date.getTime()-date.getTimezoneOffset()*60000).toISOString().slice(0,16);
  start.value=localDate(new Date(Date.now()-7*86400000));
  end.value=localDate(new Date());
  startLabel.append(start);endLabel.append(end);
  const btn=make('button');btn.type='button';btn.textContent='analyser';btn.id='v45-analyse';
  range.append(startLabel,endLabel,btn);
  const marketBox=head.closest('.market-panel');
  if(marketBox)head.after(range);
  const info=make('p');info.id='v45-market-status';range.after(info);
  btn.addEventListener('click',()=>loadPeriod());
  periods.addEventListener('click',evt=>{
   const target=evt.target.closest('button[data-period]');
   if(!target)return;
   v245Period=target.dataset.period;
   if(target.dataset.period==='all'){range.hidden=true;seriesReady=false;loadPeriod();}
   else if(target.dataset.period==='custom'){range.hidden=false;seriesReady=false;loadPeriod();}
   else{range.hidden=true;seriesReady=false;periodRequest++;}
  });
 }
 async function loadPeriod(){
  if(!signedIn()||!['all','custom'].includes(v245Period))return;
  let from,to;
  if(v245Period==='all'){from=new Date(Date.now()-4*365*86400000);to=new Date();}
  else{from=new Date($('v45-start').value);to=new Date($('v45-end').value);}
  const status=$('v45-market-status');
  if(!Number.isFinite(from.getTime())||!Number.isFinite(to.getTime())||from>=to||to>Date.now()+3600000){
   if(status)status.textContent='Sélectionne deux dates valides (début avant fin).';
   return;
  }
  const request=++periodRequest;seriesReady=false;
  if(status)status.textContent='Chargement des cotations historiques…';
  try{
   const {data,error}=await supabaseClient.rpc('vacre_45_market_history',{p_start:from.toISOString(),p_end:to.toISOString()});
   if(error)throw error;
   if(request!==periodRequest)return;
   allSeries=(data||[]).map(x=>({date:new Date(x.recorded_at),value:Number(x.price)}))
      .filter(p=>Number.isFinite(p.date.getTime())&&Number.isFinite(p.value));
   if(v245Period==='all'&&to.getTime()>=Date.now()-60000&&Number.isFinite(liveMarketPrice)){
    if(!allSeries.length||allSeries[allSeries.length-1].date.getTime()<Date.now()-120000)
     allSeries.push({date:new Date(),value:liveMarketPrice});
   }
   seriesReady=true;lastPeriodFetch=Date.now();
   if(status)status.textContent=allSeries.length+' cotations affichées sur la période sélectionnée.';
   renderMarket();
  }catch(e){if(status)status.textContent='Historique indisponible : '+e.message;seriesReady=true;allSeries=[];renderMarket();}
 }
 const oldRefresh=window.refreshWorldMarket;
 window.refreshWorldMarket=async function(...args){
  const result=await oldRefresh.apply(this,args);
  if(v245Period==='all'&&seriesReady&&Date.now()-lastPeriodFetch>300000)await loadPeriod();
  return result;
 };
 const prevNav=window.v2Navigate;
 window.v2Navigate=function(page,...args){
  const result=prevNav.call(this,page,...args);
  if(['accueil','market','v34-bank','profil'].includes(page))refreshFiscal(true);
  if(page==='market'&&v245Period==='all'&&!seriesReady)loadPeriod();
  return result;
 };
 const oldWallet=window.loadMarketWallet;
 if(typeof oldWallet==='function')window.loadMarketWallet=async function(...a){
  const r=await oldWallet.apply(this,a);refreshFiscal(true);return r;
 };
 const bankRefresh=window.v35Refresh;
 if(typeof bankRefresh==='function')window.v35Refresh=async function(...a){
  const r=await bankRefresh.apply(this,a);if(fiscal)apply();else refreshFiscal();return r;
 };
 function init(){
  const logo=document.querySelector('.v2-brand');
  if(logo){
   const emblem=logo.querySelector('.v2-brand-emblem');
   if(emblem){const img=make('img','v45-header-logo');img.src='vacre-logo-45.svg';img.alt='VACRE';emblem.replaceWith(img);}
   const word=logo.querySelector('span:last-child');
   if(word){const small=word.querySelector('small');word.firstChild.textContent='VACRE.FR';word.classList.add('v45-brand-word');if(small)small.textContent='trouve le vacre, et le vacre viendra à toi.';}
  }
  const art=document.querySelector('#accueil .v2-hero-art');
  if(art){const image=make('img','v45-hero-visual');image.src='vacre-visual-45.svg';image.alt='';art.replaceChildren(image);}
  refreshFiscal(true);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
 setInterval(()=>{if(signedIn()&&['accueil','market','v34-bank'].includes(document.body.dataset.v2Page))refreshFiscal();},45000);
 window.addEventListener('focus',()=>refreshFiscal(true));
})();