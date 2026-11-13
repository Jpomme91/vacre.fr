/* VACRE 4.6.1 — Gift reveal in the existing booster-opening interface.
   No inventory changes are performed by UI code. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const css=document.createElement('style');
css.id='v461-gift-style';
css.textContent=[
'#v28-overlay.v461-gift-mode{--gift-main:#e7c34e;--gift-shade:#a07e27;--gift-ribbon:#fff6de;--gift-glow:#d2bb55}',
'#v28-overlay.v461-gift-mode[data-gift-color="rose"]{--gift-main:#f39ac4;--gift-shade:#a7447f;--gift-ribbon:#fff5dd;--gift-glow:#ed84b3}',
'#v28-overlay.v461-gift-mode[data-gift-color="bleu"]{--gift-main:#83c8fa;--gift-shade:#3973a2;--gift-ribbon:#f7edc9;--gift-glow:#70baf3}',
'#v28-overlay.v461-gift-mode[data-gift-color="vert"]{--gift-main:#83d7a7;--gift-shade:#2f835d;--gift-ribbon:#fff6dc;--gift-glow:#65d3a0}',
'#v28-overlay.v461-gift-mode[data-gift-color="violet"]{--gift-main:#bc9bf2;--gift-shade:#7054a7;--gift-ribbon:#fff2d1;--gift-glow:#a986fa}',
'#v28-overlay.v461-gift-mode[data-gift-color="jaune"]{--gift-main:#e7c34e;--gift-shade:#a07e27;--gift-ribbon:#fff6de;--gift-glow:#d2bb55}',
'#v28-overlay.v461-gift-mode .v28-overlay-inner{width:min(94vw,540px);padding:27px 20px 30px;border:1px solid #cdb76e;border-radius:24px;background:radial-gradient(ellipse at 50% 20%,#41402c 0%,#1d2423 60%,#111817 100%);box-shadow:0 26px 90px #000a;color:#f7efdc}',
'#v28-overlay.v461-gift-mode #v28-overlay-title{color:#ffeb9e;letter-spacing:.065em;font-size:clamp(20px,5vw,27px);line-height:1.25}',
'#v28-overlay.v461-gift-mode #v33-pack-stack{height:310px;max-width:100%;position:relative}',
'#v28-overlay.v461-gift-mode #v33-pack-stack .v28-pack,#v28-overlay.v461-gift-mode #v33-pack-stack .v33-pack-back{display:none!important}',
'#v28-overlay.v461-gift-mode #v33-pack-stack:before{content:"";position:absolute;width:265px;height:265px;top:18px;left:50%;transform:translateX(-50%);border-radius:50%;background:radial-gradient(circle,var(--gift-glow) 0%,transparent 65%);filter:blur(27px);opacity:.24}',
'#v461-gift-box{position:relative;z-index:10;display:grid;place-items:center;width:215px;height:225px;padding:0;border:0;background:transparent;cursor:pointer;filter:drop-shadow(0 15px 13px #0009);animation:v461-bob 2.6s ease-in-out infinite}',
'#v461-gift-box:hover,#v461-gift-box:focus-visible{transform:scale(1.055);outline:none;filter:drop-shadow(0 13px 24px var(--gift-glow))}',
'#v461-gift-box:focus-visible{outline:2px solid #e7d47d;outline-offset:7px;border-radius:12px}',
'#v461-gift-box .v461-present-body{position:absolute;top:80px;left:19px;width:178px;height:129px;background:linear-gradient(115deg,var(--gift-shade),var(--gift-main) 35%,var(--gift-main) 75%,var(--gift-shade));border:2px solid #0003;border-radius:9px 9px 14px 14px;box-shadow:inset -10px 0 #0002}',
'#v461-gift-box .v461-present-lid{position:absolute;top:60px;left:12px;width:192px;height:39px;background:linear-gradient(110deg,var(--gift-shade),var(--gift-main) 37%,var(--gift-main) 80%,var(--gift-shade));border:2px solid #0003;border-radius:10px;z-index:3;transform-origin:center bottom}',
'#v461-gift-box .v461-present-vertical{position:absolute;top:61px;left:91px;width:34px;height:146px;background:var(--gift-ribbon);box-shadow:inset -5px 0 #0002;z-index:4}',
'#v461-gift-box .v461-present-horizontal{position:absolute;top:94px;left:20px;width:176px;height:28px;background:var(--gift-ribbon);z-index:2;box-shadow:0 3px #0002}',
'#v461-gift-box .v461-present-bow{position:absolute;z-index:5;top:12px;left:57px;width:50px;height:53px;border:14px solid var(--gift-ribbon);border-radius:65% 65% 20% 65%;transform:rotate(-35deg)}',
'#v461-gift-box .v461-present-bow:nth-last-child(1){left:107px;transform:rotate(35deg) scaleX(-1)}',
'#v28-overlay.v461-gift-mode.v461-opening #v461-gift-box{animation:v461-open-pop .65s both;pointer-events:none}',
'#v28-overlay.v461-gift-mode.v461-opening .v461-present-lid{animation:v461-lid .55s ease-out forwards}',
'#v28-overlay.v461-gift-mode .v461-hint{font-size:12px!important;letter-spacing:.13em;color:#f4e4b5;opacity:1!important;margin:8px auto 22px}',
'#v28-overlay.v461-gift-result-mode .v28-overlay-inner{width:min(94vw,460px);padding:28px 23px;border:1px solid #c6b16d;border-radius:24px;background:radial-gradient(circle at top,#364039,#171c20 67%);box-shadow:0 25px 90px #000b;color:#fff}',
'#v28-overlay.v461-gift-result-mode #v33-pack-stack,#v28-overlay.v461-gift-result-mode .v28-overlay-inner > p,#v28-overlay.v461-gift-result-mode .v28-overlay-inner > button:not(#v461-result-close){display:none!important}',
'#v28-overlay.v461-gift-result-mode #v28-overlay-title{font-size:clamp(22px,5vw,30px);color:#f9df83;margin-bottom:16px}',
'#v461-result-card{margin:10px auto 17px;padding:22px 18px;border:2px solid #d9b76f;border-radius:20px;background:linear-gradient(155deg,#39342b,#222c2b);width:min(100%,305px);box-shadow:0 14px 31px #0007;animation:v461-reveal .45s ease-out both}',
'#v461-result-symbol{font-size:67px;min-height:90px;display:grid;place-items:center}',
'#v461-result-name{font-size:20px;font-weight:950;line-height:1.25;margin:10px 0;color:#fff5ce}',
'#v461-result-meta{font-size:13px;letter-spacing:1px;color:#eed98b;font-weight:850}',
'#v461-result-close{width:min(100%,305px);padding:13px 15px;background:#f1d674;border:0;border-radius:12px;color:#21231e;font:900 15px inherit;cursor:pointer}',
'@keyframes v461-bob{0%,100%{translate:0 0}50%{translate:0 -7px}}',
'@keyframes v461-lid{0%{transform:translateY(0) rotate(0)}100%{transform:translateY(-100px) rotate(15deg);opacity:0}}',
'@keyframes v461-open-pop{0%,55%{transform:scale(1)}100%{transform:scale(.74);opacity:0}}',
'@keyframes v461-reveal{from{opacity:0;transform:scale(.88) translateY(14px)}to{opacity:1;transform:none}}',
'@media(prefers-reduced-motion:reduce){#v461-gift-box,#v461-result-card,#v28-overlay.v461-gift-mode.v461-opening #v461-gift-box,.v461-present-lid{animation:none!important}}'
].join('\n');
document.head.append(css);
let requestedColor=null,active=false;
function getGiftButton(){
 const stack=$('v33-pack-stack');
 if(!stack)return null;
 let button=$('v461-gift-box');
 if(button)return button;
 button=document.createElement('button');
 button.type='button';button.id='v461-gift-box';
 button.setAttribute('aria-label','Ouvrir le cadeau');
 button.innerHTML='<span class="v461-present-body"></span><span class="v461-present-horizontal"></span><span class="v461-present-vertical"></span><span class="v461-present-lid"></span><span class="v461-present-bow"></span><span class="v461-present-bow"></span>';
 stack.append(button);
 button.addEventListener('click',()=>{
  if(!active)return;
  const overlay=$('v28-overlay');
  overlay.classList.add('v461-opening');
  button.disabled=true;
  setTimeout(()=>window.v28Rip(),120);
 });
 return button;
}
function cleanGift(){
 active=false;
 const overlay=$('v28-overlay');
 if(!overlay)return;
 overlay.classList.remove('v461-gift-mode','v461-opening');
 delete overlay.dataset.giftColor;
 $('v461-gift-box')?.remove();
 const caption=overlay.querySelector('.v28-overlay-inner > p');
 if(caption?.dataset.v461Previous){caption.textContent=caption.dataset.v461Previous;delete caption.dataset.v461Previous;caption.classList.remove('v461-hint')}
 const cancel=overlay.querySelector('.v28-overlay-inner > button');
 if(cancel)cancel.classList.remove('v461-pack-cancel');
}
const oldIntro=window.v28PackIntro;
if(typeof oldIntro!=='function')throw Error('Interface boosters introuvable');
window.v28PackIntro=function(title,count=1){
 const isGift=/cadeau/i.test(String(title||''));
 if(!isGift)return oldIntro(title,count);
 const promise=oldIntro(title,count);
 const overlay=$('v28-overlay');
 if(!overlay)return promise;
 active=true;
 overlay.classList.add('v461-gift-mode');
 overlay.classList.remove('v461-opening','v461-gift-result-mode');
 overlay.dataset.giftColor=['rose','bleu','vert','violet','jaune'].includes(requestedColor)?requestedColor:'jaune';
 getGiftButton().disabled=false;
 const caption=overlay.querySelector('.v28-overlay-inner > p');
 if(caption){caption.dataset.v461Previous=caption.textContent;caption.textContent='CLIQUE SUR LE CADEAU POUR L’OUVRIR';caption.classList.add('v461-hint')}
 const cancel=overlay.querySelector('.v28-overlay-inner > button');
 if(cancel)cancel.classList.add('v461-pack-cancel');
 return promise.finally(cleanGift);
};
window.v461GiftIntro=async function(title,color='jaune'){
 requestedColor=color;
 try{return await window.v28PackIntro(title,1)}
 finally{requestedColor=null;}
};
window.v461GiftReveal=function(data,color='jaune'){
 const overlay=$('v28-overlay');
 if(!overlay)return Promise.resolve();
 const inner=overlay.querySelector('.v28-overlay-inner');
 if(!inner)return Promise.resolve();
 overlay.classList.remove('v461-gift-mode','v461-opening');
 overlay.classList.add('v461-gift-result-mode');
 overlay.hidden=false;
 const title=$('v28-overlay-title');
 title.textContent='✦ TON CADEAU EST OUVERT ✦';
 const lookup=typeof cards!=='undefined'&&Array.isArray(cards)?cards.find(c=>c.name===data.card):null;
 const box=document.createElement('div');box.id='v461-result-card';
 box.dataset.giftColor=color;
 const symbol=document.createElement('div');symbol.id='v461-result-symbol';
 symbol.textContent=lookup?.symbol||'✦';
 const name=document.createElement('h3');name.id='v461-result-name';
 name.textContent=(typeof vacreBotDisplayName==='function'?vacreBotDisplayName(data.card):data.card)||'Vacre surprise';
 const meta=document.createElement('div');meta.id='v461-result-meta';
 const rarity=lookup?.rarity?lookup.rarity.toUpperCase():'CARTE REÇUE';
 meta.textContent=(Number(data.quantity)||1)+' EXEMPLAIRE(S) · '+rarity;
 box.append(symbol,name,meta);
 const btn=document.createElement('button');btn.id='v461-result-close';btn.type='button';
 btn.textContent='RÉCUPÉRER MON CADEAU';
 inner.append(box,btn);
 return new Promise(resolve=>{
  btn.addEventListener('click',()=>{
   overlay.hidden=true;overlay.classList.remove('v461-gift-result-mode');
   box.remove();btn.remove();resolve();
  },{once:true});
  btn.focus();
 });
};
})();