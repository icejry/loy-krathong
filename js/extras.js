import {renderKrathong} from './krathong.js';
import {OPTIONS} from './data.js';

const $=s=>document.querySelector(s);
const DEFAULT_WISH='ขอให้ทุกคนพบเจอความสุขและสิ่งดี ๆ';
const WISHES=['ขอให้สุขภาพแข็งแรง','ขอให้ครอบครัวอบอุ่น','ขอให้การงานราบรื่น','ขอให้เจอแต่คนใจดี','ขอให้ความฝันเป็นจริง','ขอบคุณสำหรับปีที่ผ่านมา','ขอให้ใจสงบและเบาสบาย'];
// Full-moon night of the 12th lunar month. Add future dates here (YYYY-MM-DD, Thailand time).
export const FESTIVAL_DATES=['2026-11-24','2027-11-14'];
const pick=a=>a[Math.floor(Math.random()*a.length)];

function festivalPill(){
 const el=$('#festival-pill');if(!el)return;
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Bangkok'}).format(new Date());
 const day=s=>Date.parse(s+'T00:00:00Z')/864e5;
 const next=FESTIVAL_DATES.find(d=>day(d)>=day(today));if(!next)return;
 const left=day(next)-day(today);if(left>120)return;
 const date=new Date(next+'T00:00:00Z').toLocaleDateString('th-TH',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'});
 el.textContent=left===0?'คืนนี้คือคืนลอยกระทง':left===1?`พรุ่งนี้คือวันลอยกระทง · ${date}`:`อีก ${left} วันถึงวันลอยกระทง · ${date}`;
 el.hidden=false;
}

function wrapThai(g,text,maxW,maxLines){
 const words=typeof Intl!=='undefined'&&Intl.Segmenter?Array.from(new Intl.Segmenter('th',{granularity:'word'}).segment(text),s=>s.segment):Array.from(text);
 const lines=[];let line='';
 for(const w of words){
  if(g.measureText(line+w).width>maxW&&line){lines.push(line.trim());line=w;}else line+=w;
 }
 if(line.trim())lines.push(line.trim());
 if(lines.length>maxLines){lines.length=maxLines;lines[maxLines-1]=lines[maxLines-1].replace(/.$/,'…');}
 return lines;
}

async function makeCard(design,wish,name=''){
 const W=1080,H=1350,c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');
 try{await Promise.all([document.fonts.load('600 54px "Noto Serif Thai"'),document.fonts.load('400 28px "Sarabun"')]);}catch{}
 const bg=g.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#071525');bg.addColorStop(.5,'#183b46');bg.addColorStop(.72,'#16404b');bg.addColorStop(1,'#071c2a');
 g.fillStyle=bg;g.fillRect(0,0,W,H);
 let s=7;const rnd=()=>(s=(s*1664525+1013904223)>>>0)/4294967296;
 for(let i=0;i<90;i++){g.fillStyle=`rgba(255,236,198,${.25+rnd()*.5})`;g.beginPath();g.arc(rnd()*W,rnd()*H*.55,.6+rnd()*1.6,0,7);g.fill();}
 const glow=g.createRadialGradient(880,190,10,880,190,380);glow.addColorStop(0,'rgba(251,225,177,.35)');glow.addColorStop(1,'rgba(251,225,177,0)');g.fillStyle=glow;g.fillRect(0,0,W,H);
 const moon=g.createRadialGradient(860,170,4,880,190,84);moon.addColorStop(0,'#fffae8');moon.addColorStop(.7,'#f5dbad');moon.addColorStop(1,'#d3aa78');g.fillStyle=moon;g.beginPath();g.arc(880,190,84,0,7);g.fill();
 g.textAlign='center';g.fillStyle='#f2e5c6';g.font='600 46px "Noto Serif Thai","Sarabun",serif';g.fillText('ลอยกระทงริมสายน้ำ',W/2,150);
 g.font='600 56px "Noto Serif Thai","Sarabun",serif';g.fillStyle='#fff3d6';
 const lines=wrapThai(g,wish,840,4),lh=88,top=400-((lines.length-1)*lh)/2;
 lines.forEach((l,i)=>g.fillText(l,W/2,top+i*lh));
 if(name){g.font='400 34px "Sarabun",sans-serif';g.fillStyle='#e8cf9b';g.fillText('จาก '+name,W/2,top+lines.length*lh+10);g.font='600 56px "Noto Serif Thai","Sarabun",serif';}
 const svg=renderKrathong(design,'card').replace('<svg ','<svg width="500" height="370" ');
 const img=await new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);});
 const kw=760,kh=kw*370/500,ky=680;
 const halo=g.createRadialGradient(W/2,ky+kh*.8,0,W/2,ky+kh*.8,kw*.7);halo.addColorStop(0,'rgba(255,196,103,.35)');halo.addColorStop(1,'rgba(255,196,103,0)');g.fillStyle=halo;g.fillRect(0,ky-100,W,kh+300);
 g.drawImage(img,(W-kw)/2,ky,kw,kh);
 g.font='400 28px "Sarabun",sans-serif';g.fillStyle='#d8c79f';g.fillText('คืนเพ็ญเดือนสิบสอง · แสงจันทร์จะนำทางให้ความปรารถนา',W/2,H-62);
 return new Promise(r=>c.toBlob(r,'image/png'));
}

export function initExtras({design,audio,river,updatePreview,switchCategory,getCategory,getWish,toast}){
 festivalPill();

 // Sound toggle
 const snd=$('#sound-toggle');
 if(snd){
  const sync=()=>{snd.setAttribute('aria-pressed',String(!audio.muted));snd.setAttribute('aria-label',audio.muted?'เปิดเสียงเพลง':'ปิดเสียงเพลง');};
  sync();snd.addEventListener('click',()=>{audio.toggle();sync();});
 }

 // Random design
 $('#random-btn')?.addEventListener('click',()=>{
  for(const cat of Object.keys(OPTIONS))design[cat]=pick(OPTIONS[cat].items)[0];
  design.density=pick([6,9,13]);
  document.querySelectorAll('[data-density]').forEach(b=>b.classList.toggle('chosen',Number(b.dataset.density)===design.density));
  switchCategory(getCategory());updatePreview(true);audio.chime(740);
 });

 // Wish suggestions
 const chips=$('#wish-chips'),input=$('#wish-input');
 if(chips&&input){
  WISHES.forEach(text=>{
   const b=document.createElement('button');b.type='button';b.textContent=text;
   b.addEventListener('click',()=>{input.value=text;input.dispatchEvent(new Event('input',{bubbles:true}));audio.chime(620);});
   chips.append(b);
  });
 }

 // Save / share card
 const save=$('#save-card');
 if(save){
  save.addEventListener('click',async()=>{
   save.disabled=true;
   try{
    const blob=await makeCard({...design},getWish()||DEFAULT_WISH,($('#wish-name')?.value||'').trim().slice(0,24));
    const file=new File([blob],'loy-krathong.png',{type:'image/png'});
    if(navigator.canShare?.({files:[file]})){
     try{await navigator.share({files:[file],title:'ลอยกระทงริมสายน้ำ'});}catch(e){if(e.name!=='AbortError')throw e;}
    }else{
     const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='loy-krathong.png';document.body.append(a);a.click();a.remove();
     setTimeout(()=>URL.revokeObjectURL(a.href),4000);toast('บันทึกการ์ดกระทงแล้ว');
    }
   }catch{toast('สร้างการ์ดไม่สำเร็จ ลองอีกครั้ง');}
   save.disabled=false;
  });
 }

 // Tap the sky for a lantern, the water for ripples
 river.onTap=kind=>audio.chime(kind==='sky'?880:520);

 // Offline support
 if('serviceWorker' in navigator&&/^https?:$/.test(location.protocol)){
  window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
 }
}
