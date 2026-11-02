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
 try{
  const {data,error}=await supabaseClient.rpc('vacre_41_get_deck');if(error)throw error;
  const available=(data.cards||[]).filter(c=>c.amount>0&&v23Inventory[c.name]>0);
  for(const c of available){
   const option=document.createElement('option');option.value=c.name;
   option.textContent='CASE '+c.slot+' · '+c.name+' · NIV. '+c.level+' · ×'+Math.min(c.amount,v23Inventory[c.name]);sel.append(option);
  }
  if([...sel.options].some(o=>o.value===previous))sel.value=previous;
  if(!available.length&&!v39Done)v39Say('⚠ Ton deck de combat est vide ! Ouvre ton profil, prépare tes 5 emplacements, puis reviens combattre.');
 }catch(e){v39Say('Deck indisponible : '+e.message)}
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
  if(!q.can_fraud)throw Error('5 000 U minimum nécessaires');
  if(!confirm('MINISTÈRE DES FINANCES\n\nPour ce combat, '+v39Money(q.price+2*q.tax)+' U seront mis de côté.\nVictoire : taxe annulée et jusqu’à 5 cartes gagnées.\nDéfaite : taxe doublée.\nChaque carte jouée est consommée.\nAbandon : taxe normale.\n\nDéfier l’huissier ?'))return;
  const {data,error}=await supabaseClient.rpc('vacre_39_fight_start',{p_quantity:qty});if(error)throw error;
  v39Done=false;v39Draw(data);v39Say('L’huissier est furieux ! Choisis une carte pour attaquer.');loadMarketWallet();
 }catch(e){alert('Combat impossible : '+e.message)}finally{v39Busy=false}
}
async function v39Attack(){
 if(v39Busy||v39Done||!v39Active)return;const card=v39El('v39-card').value;if(!card)return;
 v39Busy=true;v39El('v39-attack').disabled=true;v39Say('⚔ Tu utilises '+card+' !');
 try{
  const {data,error}=await supabaseClient.rpc('vacre_39_fight_turn',{p_card:card});if(error)throw error;
  const battle=v39El('v39-battle');
  const world=battle.querySelector('.v39-world');
  const play=world?.querySelector('.v39-sprite.player'),enemy=world?.querySelector('.v39-sprite.enemy');
  const flash=(node,cls)=>{if(!node)return;node.classList.remove(cls);void node.getBoundingClientRect();node.classList.add(cls);setTimeout(()=>node.classList.remove(cls),900)};
  flash(play,'v41-attack-fx');flash(enemy,'v41-hit-fx');
  if(data.player_critical)flash(world,'v41-critical-fx');
  const popup=document.createElement('div');popup.className='v41-float-damage';popup.textContent='−'+data.player_damage+(data.player_critical?' CRITIQUE !':'');world?.append(popup);setTimeout(()=>popup.remove(),1250);
  if(data.enemy_damage>0){setTimeout(()=>{flash(enemy,'v41-attack-fx');flash(play,'v41-hit-fx');const hit=document.createElement('div');hit.className='v41-float-damage v41-player-damage';hit.textContent='−'+data.enemy_damage+(data.enemy_critical?' CRITIQUE !':'');world?.append(hit);setTimeout(()=>hit.remove(),1200)},650)}
  v39Draw({...v39Active,hp:data.hp,enemy_hp:data.enemy_hp,enemy_cards:data.enemy_cards,used_cards:data.used_cards,turns:(v39Active.turns||0)+1});
  const narration='Tu utilises '+card+' (niveau '+(data.player_level||1)+') : '+data.player_damage+' dégâts'+(data.player_critical?' — COUP CRITIQUE !':'')+'. '+(data.enemy_damage>0?'L’huissier utilise '+(data.enemy_play||'un Vacre')+' : '+data.enemy_damage+' dégâts'+(data.enemy_critical?' — CRITIQUE !':'')+'.':'L’huissier ne peut pas riposter.');
  v39Say(narration);
  if(data.status==='won'||data.status==='lost'){
   v39Done=true;
   setTimeout(()=>v39Say(narration+' '+(data.status==='won'?'🏆 VICTOIRE ! Taxe annulée, '+data.recovered+' Vacres gagnés.':'💀 DÉFAITE ! Taxe doublée : '+v39Money(data.tax)+' U.')),850);
   v39El('v39-attack').disabled=true;v39El('v39-abandon').textContent='FERMER';
   await Promise.allSettled([refreshServerBoosters(),loadMarketWallet(),v23RefreshInventory(),v39RefreshShop()]);
  }
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
