import {OPTIONS,DEFAULT_DESIGN,PALETTE,TRIM,SAMPLE_WISHES} from './data.js';
import {renderKrathong,choiceIcon} from './krathong.js';
import {LivingRiver} from './river.js';
import {FestivalAudio} from './audio.js';
import {initExtras} from './extras.js';
import {initMore} from './more.js';
import {readOwnWishes,storeOwnWish,onlineEnabled,fetchApproved,submitForModeration} from './storage.js';

const $=s=>document.querySelector(s);
const $$=s=>Array.from(document.querySelectorAll(s));
const scene=$('#river-stage'),river=new LivingRiver(scene,$('#river-canvas'),$('#river-boats'));
const audio=new FestivalAudio();
const design={...DEFAULT_DESIGN};
let category='base',mine=readOwnWishes(),launching=false,messageTimer=0;
const myId=()=>('local-'+(globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+Math.random().toString(36).slice(2)));

function updateCount(){
 const count=river.count;
 $('#river-summary').innerHTML=`กระทงในสายน้ำ <strong>${count}</strong> ใบ`;
}
function showWish(boat){
 const mine=boat.source==='mine',sample=boat.source==='sample';
 $('#wish-sheet-heading').textContent=mine?'คำอธิษฐานของคุณ':sample?'คำอธิษฐานจำลอง · กระทงตัวอย่าง':'คำอธิษฐานจากผู้ร่วมลอยกระทง';
 $('#wish-sheet-text').textContent=boat.message;
 $('#wish-sheet-caption').textContent=mine?'เก็บคำอธิษฐานไว้ในอุปกรณ์นี้':sample?'ข้อความตัวอย่างเพื่อสร้างบรรยากาศ':'คำอธิษฐานที่ผ่านการตรวจสอบแล้ว';
 $('#wish-sheet').hidden=false;
 $('#close-wish').focus({preventScroll:true});
}
river.onSelect=showWish;
$('#close-wish').addEventListener('click',()=>{$('#wish-sheet').hidden=true;});
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#wish-sheet').hidden)$('#wish-sheet').hidden=true;});

function spawnInitial(){
 const positions=[[.16,.61],[.71,.60],[.87,.70],[.30,.71],[.55,.54],[.13,.77],[.78,.79],[.42,.57]];
 const maxSamples=window.matchMedia('(max-width: 560px)').matches?6:8;
 SAMPLE_WISHES.slice(0,mine.length>=12?4:maxSamples).forEach((w,i)=>{
  const [x,y]=positions[i];river.addBoat({id:`sample-${i}`,design:w.design,message:w.message,source:'sample',x,y,scale:.31+(i%4)*.042});
 });
 mine.slice().reverse().forEach((w,i)=>river.addBoat({id:w.id,design:w.design,message:w.message,source:'mine',x:w.x,y:w.y,scale:.34+(i%4)*.019}));
 updateCount();
}
function updatePreview(animated=false){
 const hero=$('#hero-art');hero.innerHTML=renderKrathong(design,'hero');
 if(animated&&hero.animate){hero.animate([{opacity:.72,transform:'scale(.973)'},{opacity:1,transform:'scale(1)'}],{duration:300,easing:'ease-out'});}
}
function switchCategory(next){
 category=next;
 $$('#atelier-tabs [data-category]').forEach(btn=>{const on=btn.dataset.category===next;btn.setAttribute('aria-selected',String(on));btn.tabIndex=on?0:-1;});
 const info=OPTIONS[category];$('#choice-heading').textContent=info.title;$('#choice-counter').textContent=`${info.items.length} แบบ`;
 const host=$('#choices');host.replaceChildren();
 info.items.forEach(([key,label,description])=>{
  const btn=document.createElement('button');btn.type='button';btn.className='choice';
  const active=design[category]===key;btn.classList.toggle('chosen',active);btn.setAttribute('aria-pressed',String(active));
  const icon=document.createElement('div');icon.className='choice-art';icon.innerHTML=choiceIcon(category,key);
  if(category==='flower')icon.style.background=PALETTE[key][1];
  if(category==='trim')icon.style.background=TRIM[key];
  const copy=document.createElement('div');const title=document.createElement('div'),sub=document.createElement('div');
  title.className='choice-label';title.textContent=label;sub.className='choice-desc';sub.textContent=description;
  copy.append(title,sub);btn.append(icon,copy);
  btn.addEventListener('click',()=>{design[category]=key;audio.chime(680);switchCategory(category);updatePreview(true);});
  host.append(btn);
 });
 $('#density-control').hidden=category!=='flower';
}
$$('#atelier-tabs [data-category]').forEach(btn=>{
 btn.addEventListener('click',()=>switchCategory(btn.dataset.category));
 btn.addEventListener('keydown',e=>{
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
  e.preventDefault();const categories=Object.keys(OPTIONS),index=categories.indexOf(category);
  const next=e.key==='Home'?0:e.key==='End'?categories.length-1:(index+(e.key==='ArrowRight'?1:-1)+categories.length)%categories.length;
  switchCategory(categories[next]);$(`#atelier-tabs [data-category="${categories[next]}"]`).focus();
 });
});
$$('[data-density]').forEach(btn=>btn.addEventListener('click',()=>{
 design.density=Number(btn.dataset.density);$$('[data-density]').forEach(b=>b.classList.toggle('chosen',b===btn));
 updatePreview(true);audio.chime(720);
}));

function toast(text){
 const el=$('#launch-message');el.textContent=text;el.hidden=false;
 clearTimeout(messageTimer);messageTimer=setTimeout(()=>{el.hidden=true;},3600);
}
function launch(e){
 e.preventDefault();if(launching)return;launching=true;
 const btn=$('#launch-button');btn.disabled=true;
 const message=$('#wish-input').value.trim()||'ขอให้ทุกคนพบเจอความสุขและสิ่งดี ๆ';
 const id=myId(),count=mine.length;
 const x=Math.min(.88,.14+(count%6)*.139),y=.596+(count%4)*.055;
 const own={id,message,design:{...design},created_at:new Date().toISOString(),x,y};
 mine.unshift(own);mine=mine.slice(0,24);const saved=storeOwnWish(own);
 river.addBoat({id,design:own.design,message,source:'mine',x,y,launch:true,scale:.36+(count%3)*.036});
 river.burst(river.w*.49,river.h*.80);
 audio.release();$('#hero-boat').style.opacity='.09';
 $('#wish-input').value='';$('#wish-length').textContent='0/120';
 $('#wish-sheet').hidden=true;
 toast('กระทงของคุณออกเดินทางแล้ว ✦');
 $('#form-feedback').textContent=onlineEnabled?'กระทงของคุณอยู่ในแม่น้ำแล้ว • ข้อความจะเผยแพร่หลังตรวจสอบ':saved?'บันทึกกระทงบนอุปกรณ์นี้แล้ว':'ลอยแล้ว (อุปกรณ์นี้ไม่อนุญาตให้บันทึกถาวร)';
 updateCount();
 if(onlineEnabled){submitForModeration(own).catch(()=>{$('#form-feedback').textContent='กระทงลอยในเครื่องนี้แล้ว แต่ส่งไปยังระบบออนไลน์ไม่สำเร็จ';});}
 setTimeout(()=>{$('#hero-boat').style.opacity='1';btn.disabled=false;launching=false;},1700);
}
$('#wish-form').addEventListener('submit',launch);
$('#wish-input').addEventListener('input',e=>{$('#wish-length').textContent=`${e.currentTarget.value.length}/120`;});

async function refreshCommunity(){
 if(!onlineEnabled)return;
 try{
  const rows=await fetchApproved();
  const maxOnline=window.matchMedia('(max-width: 560px)').matches?14:28;
  const selected=rows.slice(0,maxOnline);
  const expected=new Set(selected.map(item=>`remote-${item.id}`));
  // Reconcile instead of deleting and rebuilding each refresh; water stays continuous.
  river.boats.filter(b=>b.source==='online'&&!expected.has(b.id)).forEach(b=>river.removeBoat(b.id));
  selected.forEach((item,i)=>{
   const hash=[...item.id].reduce((a,ch)=>((a*31+ch.charCodeAt(0))>>>0),29);
   const x=.13+(hash%73)/100,y=.57+((hash>>>8)%24)/100;
   river.addBoat({id:`remote-${item.id}`,design:item.design,message:item.message,source:'online',x,y,scale:.30+(i%4)*.03});
  });
  updateCount();
 }catch(err){console.warn('Online community unavailable; keeping local and sample boats.',err);}
}

function showPage(){
 const story=location.hash==='#story';$('#river-page').hidden=story;$('#story-page').hidden=!story;
 $$('[data-page-link]').forEach(link=>{
  const active=link.dataset.pageLink===(story?'story':'river');link.classList.toggle('active',active);
  if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');
 });
 river.enabled=!story;
 if(!story)river.resize();
 window.scrollTo({top:0,behavior:'instant'});
}
window.addEventListener('hashchange',showPage);

updatePreview();switchCategory('base');spawnInitial();showPage();
initMore({design,audio,river,stage:scene,toast,updatePreview,switchCategory,getCategory:()=>category});
initExtras({design,audio,river,updatePreview,switchCategory,getCategory:()=>category,getWish:()=>$('#wish-input').value.trim(),toast});
refreshCommunity();if(onlineEnabled)setInterval(refreshCommunity,20000);
