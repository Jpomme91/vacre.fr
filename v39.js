/* VACRE 3.9 — combat fiscal validé côté serveur */
let v39Active=null,v39Busy=false,v39Done=false;
const v39El=id=>document.getElementById(id);
const v39Say=t=>{v39El('v39-message').textContent=t};
const v39Money=n=>Number(n||0).toLocaleString('fr-FR');
async function v39RefreshShop(){
 if(!currentUser)return;
 for(const [index,qty] of [1,3,5].entries()){
  const article=document.querySelector('.v361-pack-grid article:nth-child('+(index+1)+')');if(!article)continue;
  let label=article.querySelector('.v39-tax-line'),button=article.querySelector('.v39-fraud-button');
  if(!label){label=document.createElement('div');label.className='v39-tax-line';article.append(label)}
  if(!button){button=document.createElement('button');button.type='button';button.className='v39-fraud-button';button.textContent='⚔ FRAUDER LE FISC';button.onclick=()=>v39Start(qty);article.append(button)}
  try{
   const {data,error}=await supabaseClient.rpc('vacre_39_quote',{p_quantity:qty});if(error)throw error;
   label.textContent='🏛 Taxe '+data.rate+' % : +'+v39Money(data.tax)+' U · Total '+v39Money(data.total)+' U';
   button.hidden=!data.can_fraud;button.disabled=Number(data.stock)+qty>10;
  }catch(e){label.textContent='Taxe indisponible';button.hidden=true}
 }
}
async function v39Cards(){
 await v23RefreshInventory();
 const sel=v39El('v39-card'),previous=sel.value;sel.replaceChildren();
 Object.keys(v23Inventory||{}).filter(n=>v23Inventory[n]>0&&cards.some(c=>c.name===n&&c.rarity!=='special'))
 .sort((a,b)=>{const order={common:0,rare:1,epic:2,legendary:3,mythic:4};return (order[cards.find(c=>c.name===b)?.rarity]||0)-(order[cards.find(c=>c.name===a)?.rarity]||0)})
 .forEach(n=>{const c=cards.find(c=>c.name===n),o=document.createElement('option');o.value=n;o.textContent=n+' · '+c.rarity+' ×'+v23Inventory[n];sel.append(o)});
 if([...sel.options].some(o=>o.value===previous))sel.value=previous;
 v39El('v39-attack').disabled=sel.options.length===0||v39Busy||v39Done;
}
function v39Draw(s){
 v39Active=s;v39El('v39-battle').hidden=false;
 const player=Number(s.hp),enemy=Number(s.enemy_hp),max=Number(s.enemy_max_hp);
 v39El('v39-player-hp').textContent='PV '+player+'/100';
 v39El('v39-enemy-hp').textContent='PV '+enemy+'/'+max;
 v39El('v39-player-bar').style.width=player+'%';
 v39El('v39-enemy-bar').style.width=(100*enemy/max)+'%';
 v39El('v39-detail').textContent='Taxe : '+v39Money(s.tax)+' U · '+s.turns+' tour(s) · '+s.enemy_cards.length+'/5 cartes de l’huissier';
 v39Cards();
}
async function v39Start(qty){
 if(v39Busy||!currentUser)return;v39Busy=true;
 try{
  const {data:current,error:err}=await supabaseClient.rpc('vacre_39_battle_state');if(err)throw err;
  if(current.active){v39Done=false;v39Draw(current);return}
  const {data:q,error:qe}=await supabaseClient.rpc('vacre_39_quote',{p_quantity:qty});if(qe)throw qe;
  if(!q.can_fraud)throw Error('Plus de 10 000 U nécessaires');
  if(!confirm('MINISTÈRE DES FINANCES\n\nPour ce combat, '+v39Money(q.price+2*q.tax)+' U seront mis de côté.\nVictoire : taxe annulée et jusqu’à 5 cartes gagnées.\nDéfaite : taxe doublée.\nChaque carte jouée est consommée.\nAbandon : taxe normale.\n\nDéfier l’huissier ?'))return;
  const {data,error}=await supabaseClient.rpc('vacre_39_fight_start',{p_quantity:qty});if(error)throw error;
  v39Done=false;v39Draw(data);v39Say('L’huissier est furieux ! Choisis une carte pour attaquer.');loadMarketWallet();
 }catch(e){alert('Combat impossible : '+e.message)}finally{v39Busy=false}
}
async function v39Attack(){
 if(v39Busy||v39Done||!v39Active)return;const card=v39El('v39-card').value;if(!card)return;
 v39Busy=true;v39El('v39-attack').disabled=true;v39Say('⚔ '+card+' attaque !');
 try{
  const {data,error}=await supabaseClient.rpc('vacre_39_fight_turn',{p_card:card});if(error)throw error;
  v39Draw({...v39Active,hp:data.hp,enemy_hp:data.enemy_hp,enemy_cards:data.enemy_cards,used_cards:data.used_cards,turns:(v39Active.turns||0)+1});
  if(data.status==='won'||data.status==='lost'){
   v39Done=true;
   v39Say(data.status==='won'?'🏆 VICTOIRE ! Taxe annulée et '+data.recovered+' cartes ennemies gagnées !':'💀 DÉFAITE ! Taxe doublée : '+v39Money(data.tax)+' U.');
   v39El('v39-attack').disabled=true;
   v39El('v39-abandon').textContent='FERMER';
   await Promise.allSettled([refreshServerBoosters(),loadMarketWallet(),v23RefreshInventory(),v39RefreshShop()]);
  }else v39Say(card+' : '+data.player_damage+' dégâts'+(data.player_critical?' CRITIQUE !':'')+' · L’huissier réplique : '+data.enemy_damage+' dégâts.');
 }catch(e){v39Say('Attaque refusée : '+e.message)}
 finally{v39Busy=false;if(!v39Done)v39Cards()}
}
async function v39Abandon(){
 if(v39Done){v39El('v39-battle').hidden=true;v39Active=null;v39Done=false;v39El('v39-abandon').textContent='PAYER L’IMPÔT';return}
 if(!v39Active||v39Busy||!confirm('Abandonner ? Tu paieras la taxe normale et conserveras les cartes non utilisées.'))return;
 v39Busy=true;
 try{const {data,error}=await supabaseClient.rpc('vacre_39_fight_abandon');if(error)throw error;v39Done=true;v39Say('Taxe payée : '+v39Money(data.tax)+' U. Achat terminé.');v39El('v39-abandon').textContent='FERMER';v39El('v39-attack').disabled=true;await Promise.allSettled([refreshServerBoosters(),loadMarketWallet(),v39RefreshShop()])}
 catch(e){v39Say('Erreur : '+e.message)}finally{v39Busy=false}
}
async function v39Resume(){if(!currentUser)return;try{const {data,error}=await supabaseClient.rpc('vacre_39_battle_state');if(error)throw error;if(data.active){v39Done=false;v39Draw(data);v39Say('Ton contrôle fiscal reprend là où tu en étais !')}}catch(e){console.warn('Fiscal :',e.message)}}
(function(){const prior=window.v2Navigate;window.v2Navigate=function(page,...a){const result=prior.call(this,page,...a);if(page==='boutique'){v39RefreshShop();v39Resume()}return result};window.v39RefreshShop=v39RefreshShop;setTimeout(()=>{if(currentUser){v39RefreshShop();v39Resume()}},1400);setInterval(()=>{if(currentUser&&document.body.dataset.v2Page==='boutique'&&!v39Busy)v39RefreshShop()},45000)})();

async function v39StartCard(name,price){if(v39Busy||!currentUser)return;v39Busy=true;try{const a=await supabaseClient.rpc('vacre_39_battle_state');if(a.error)throw a.error;if(a.data.active){v39Done=false;v39Draw(a.data);return}if(!confirm('Défier le fisc pour acheter '+name+' ? Chaque carte jouée sera sacrifiée. Une défaite double la taxe.'))return;const r=await supabaseClient.rpc('vacre_39_card_start',{p_card:name});if(r.error)throw r.error;v39Done=false;v39Draw(r.data);v39Say('L’huissier refuse ton achat. À toi de jouer !');loadMarketWallet()}catch(e){alert(e.message)}finally{v39Busy=false}}
