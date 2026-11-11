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
 '.v45-brand-word{font-family:Georgia,serif;font-size:clamp(15px,2vw,23px);letter-spacing:1.1px;font-weight:900}',
 '@media(max-width:800px){.v45-header-logo{width:32px;height:32px}.v45-brand-word{font-size:15px}.v45-market-dates input{width:100%;max-width:none}}'
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
    'Votre fortune virtuelle pourrait financer les futures mises à jour et les bugs que le développeur n’a pas encore inventés.':
    'Le ministère juge que votre patrimoine ne permet pas encore de payer le café imaginaire du développeur.';
  root.append(intro);
  const stats=make('div','v45-values');
  const values=[['Patrimoine',fmt(wealth)+' U'],['ISV estimé',fmt(estimate)+' U'],['Prochain contrôle',when(data.next_due)]];
  if(cash<0)values.unshift(['Découvert',fmt(cash)+' U / −1 000 U']);
  if(debt>0)values.push(['Dette fiscale restante',fmt(debt)+' U']);
  for(const item of values){const n=make('span');n.textContent=item[0]+' : '+item[1];if(item[0]==='Découvert')n.classList.add('v45-negative');stats.append(n)}
  root.append(stats);
  if(debt>0){const p=make('p');p.textContent='Les gains futurs rétablissent d’abord le solde ; ensuite 25 % des gains positifs remboursent la dette. Aucun nouvel ISV tant que cette dette subsiste.';root.append(p);}
  else if(soon){const p=make('p');p.textContent='Préavis fiscal : prélèvement dans moins de 24 heures. Les taxes déjà payées sur la période diminuent l’ISV.';root.append(p);}
  else if(wealth>5000){const p=make('p');p.textContent='La taxe minimale est de 2 % tous les 3 jours, après déduction des autres taxes. Le découvert autorisé ne peut pas dépasser −1 000 U.';root.append(p);}
  if(full){
   const ul=make('ul','v45-tax-history');
   for(const e of (data.history||[]).slice(0,6)){
    const li=make('li');
    li.textContent=when(e.date)+' · '+(e.kind==='isv'?'ISV prélevé':'Recouvrement de dette')+' · '+fmt(e.amount)+' U'+(e.kind==='isv'&&Number(e.debt_after||0)>0?' · reste '+fmt(e.debt_after)+' U de dette':'');
    ul.append(li);
   }
   if(ul.children.length)root.append(ul);
  }
 }
 function apply(){
  if(!signedIn()){for(const id of ['v45-home-wealth','v45-bank-isv','v45-market-isv']){const e=$(id);if(e)e.hidden=true;}return;}
  const hero=document.querySelector('#accueil .v2-hero-content');
  const bank=document.getElementById('v34-bank');
  const market=document.querySelector('#market .market-dashboard .market-panel:last-child');
  fill(card(hero,'v45-home-wealth'),fiscal,false);
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