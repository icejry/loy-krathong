import {renderKrathong} from './krathong.js';
import {readOwnWishes} from './storage.js';

const $=s=>document.querySelector(s);
const rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
const KEY='moonriver.wishes.v1';
const DEFAULT_WISH='ขอให้ทุกคนพบเจอความสุขและสิ่งดี ๆ';
const LANTERN_WISHES=['ขอให้ทุกวันเต็มไปด้วยรอยยิ้ม','ขอให้คนที่รักปลอดภัย','ขอให้เดินทางไกลได้ถึงฝั่งฝัน','ขอให้ใจเย็นและมีแรงเสมอ','ขอให้ปีหน้าดีกว่าปีนี้','ขอบคุณทุกสิ่งที่ผ่านเข้ามา'];
const REGIONS=[['ยี่เป็ง','ภาคเหนือ'],['ลอยกระทงสาย','จังหวัดตาก'],['เผาเทียนเล่นไฟ','จังหวัดสุโขทัย']];
const pick=a=>a[Math.floor(Math.random()*a.length)];

export function initMore({design,audio,river,stage,toast,updatePreview,switchCategory,getCategory}){
 // ---------- Effects layer: fireworks, fireflies, bats ----------
 const cv=document.createElement('canvas');cv.id='fx-canvas';cv.setAttribute('aria-hidden','true');stage.append(cv);
 const g=cv.getContext('2d');let W=1,H=1;
 const fit=()=>{const r=stage.getBoundingClientRect(),d=Math.min(2,devicePixelRatio||1);W=r.width;H=r.height;cv.width=W*d;cv.height=H*d;g.setTransform(d,0,0,d,0,0);};
 if('ResizeObserver' in window)new ResizeObserver(fit).observe(stage);else addEventListener('resize',fit);fit();
 const sparks=[],bats=[],trail=[],small=matchMedia('(max-width:560px)').matches;
 const flies=Array.from({length:small?8:16},()=>({x:Math.random(),y:.5+Math.random()*.08,p:Math.random()*9}));
 let nextBat=performance.now()+12000;
 function firework(x,y){
  const hue=pick([40,20,340,190,50]),now=performance.now();audio.chime(pick([523,659,784]));
  for(let i=0;i<64;i++){const a=i/64*6.283,s=50+Math.random()*110;sparks.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,t:now,life:1000+Math.random()*700,h:hue+Math.random()*30});}
 }
 const show=n=>{if(rm)return;for(let i=0;i<n;i++)setTimeout(()=>firework(W*(.2+Math.random()*.6),H*(.1+Math.random()*.25)),i*450);};
 let last=0;
 (function loop(now){
  requestAnimationFrame(loop);
  if(document.hidden||!river.enabled||now-last<33)return;last=now;g.clearRect(0,0,W,H);
  for(let i=sparks.length-1;i>=0;i--){
   const p=sparks[i],s=(now-p.t)/1000,a=1-(now-p.t)/p.life;if(a<=0){sparks.splice(i,1);continue;}
   g.fillStyle=`hsla(${p.h},95%,70%,${a})`;g.beginPath();g.arc(p.x+p.vx*s,p.y+p.vy*s+40*s*s,1+a*1.8,0,7);g.fill();
  }
  for(let i=trail.length-1;i>=0;i--){
   const p=trail[i],age=now-p.t,a=Math.min(1,1-age/750);if(a<=0){trail.splice(i,1);continue;}
   const s=Math.max(0,age)/1000;g.fillStyle=`rgba(255,226,166,${a*.85})`;g.beginPath();g.arc(p.x+p.vx*s,p.y+p.vy*s,.8+a*1.7,0,7);g.fill();
  }
  if(rm)return;
  for(const b of river.boats)if(b.launchAt!==null&&Math.random()<.6&&trail.length<140)trail.push({x:b.x*W+(Math.random()-.5)*30,y:b.y*H+10,t:now,vx:(Math.random()-.5)*28,vy:-8-Math.random()*24});
  for(const f of flies){
   const x=(f.x+Math.sin(now/4000+f.p)*.03)*W,y=(f.y+Math.sin(now/1700+f.p)*.025)*H,a=.25+.7*(.5+.5*Math.sin(now/600+f.p));
   g.fillStyle=`rgba(255,240,150,${a*.25})`;g.beginPath();g.arc(x,y,5,0,7);g.fill();g.fillStyle=`rgba(255,248,190,${a})`;g.beginPath();g.arc(x,y,1.4,0,7);g.fill();
  }
  if(now>nextBat){bats.push({start:now,y:.1+Math.random()*.2});nextBat=now+14000+Math.random()*14000;}
  for(let i=bats.length-1;i>=0;i--){
   const b=bats[i],p=(now-b.start)/7000;if(p>1.05){bats.splice(i,1);continue;}
   const x=p*(W+60)-30,y=b.y*H+Math.sin(p*14)*12,f=Math.sin(now/60)*7;
   g.fillStyle='#07131c';g.beginPath();g.moveTo(x,y+3);g.quadraticCurveTo(x-9,y-8-f,x-17,y+1);g.quadraticCurveTo(x-8,y+1,x,y+6);g.quadraticCurveTo(x+8,y+1,x+17,y+1);g.quadraticCurveTo(x+9,y-8-f,x,y+3);g.fill();
  }
 })(0);
 stage.addEventListener('pointerdown',e=>{
  const r=stage.getBoundingClientRect(),mx=r.width*.755,my=r.height*.218,mr=Math.min(r.width,r.height)*.077;
  if(Math.hypot(e.clientX-r.left-mx,e.clientY-r.top-my)<mr*1.6)show(3);
 });
 $('#wish-form')?.addEventListener('submit',()=>setTimeout(()=>show(1),900));

 // Golden sparkles follow the pointer; hovering the water makes ripples (mouse only)
 let lastMove=0,lastRip=0;
 if(!rm&&matchMedia('(pointer:fine)').matches)stage.addEventListener('pointermove',e=>{
  const n=performance.now();if(n-lastMove<45)return;lastMove=n;
  const r=stage.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
  if(trail.length<140)trail.push({x,y,t:n,vx:(Math.random()-.5)*22,vy:-6-Math.random()*16});
  if(y>H*.56&&n-lastRip>280){lastRip=n;river.ripple(x,y,.42);}
 });
 if(!rm){const mist=document.createElement('div');mist.className='mist';mist.setAttribute('aria-hidden','true');stage.append(mist);river.seedLanterns(small?2:4);}

 // ---------- Ritual before launching ----------
 const form=$('#wish-form'),ta=$('#wish-input');let pass=false;
 const ritual=()=>new Promise(res=>{
  const el=document.createElement('div');el.className='ritual';el.dataset.step='0';
  el.innerHTML='<div class="flame" aria-hidden="true"></div><p role="status"></p><button type="button" class="ghost-btn"></button><button type="button" class="ghost-btn skip">ข้ามขั้นตอน</button>';
  const [,p,b,s]=el.children,steps=[['แตะเพื่อจุดเทียน','เทียนสว่างขึ้นแล้ว'],['แตะเพื่อจุดธูป','ควันธูปลอยขึ้นเบา ๆ'],['หลับตา อธิษฐานในใจ','แตะเมื่อพร้อมปล่อยกระทง']];
  let i=0;const paint=()=>{el.dataset.step=i;p.textContent=i?steps[i-1][1]:'ก่อนปล่อยกระทง ลองทำตามพิธีสั้น ๆ';b.textContent=steps[i][0];};
  const done=()=>{el.remove();res();};
  b.onclick=()=>{audio.chime(480+i*140);if(++i>=steps.length)return done();paint();};
  s.onclick=done;stage.append(el);paint();b.focus({preventScroll:true});
 });
 form?.addEventListener('submit',e=>{
  if(pass){pass=false;return;}
  e.preventDefault();e.stopImmediatePropagation();
  ritual().then(()=>{
   const name=($('#wish-name')?.value||'').trim();
   if(name)ta.value=`${ta.value.trim()||DEFAULT_WISH} — ${name}`.slice(0,120);
   pass=true;form.requestSubmit();
  });
 },true);

 // ---------- Music volume ----------
 $('#vol')?.addEventListener('input',e=>{audio.player.volume=Number(e.target.value)/100;});

 // ---------- Yi Peng mode ----------
 const yp=$('#yipeng-btn');
 yp?.addEventListener('click',()=>{
  river.yipeng=!river.yipeng;yp.setAttribute('aria-pressed',String(river.yipeng));
  if(river.yipeng&&!rm)river.seedLanterns(small?10:26);
  if(river.yipeng)toast('โหมดยี่เป็ง: แตะโคมบนท้องฟ้าเพื่ออ่านคำอธิษฐาน');
 });
 river.onLantern=l=>{
  l.wish=l.wish||pick(LANTERN_WISHES);audio.chime(900);
  $('#wish-sheet-heading').textContent='คำอธิษฐานบนโคม';$('#wish-sheet-text').textContent=l.wish;
  $('#wish-sheet-caption').textContent='ข้อความตัวอย่างเพื่อสร้างบรรยากาศ';$('#wish-sheet').hidden=false;
 };

 // ---------- My krathong gallery ----------
 const dlg=document.createElement('dialog');dlg.id='gallery';
 dlg.innerHTML='<div class="gal-top"><h2>กระทงของฉัน</h2><button type="button" class="icon-close" aria-label="ปิด"><svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5 5 19"/></svg></button></div><div class="gal-list"></div>';
 document.body.append(dlg);const list=dlg.querySelector('.gal-list');
 const gallery=()=>{
  const items=readOwnWishes();list.replaceChildren();
  if(!items.length){list.innerHTML='<p class="gal-empty">ยังไม่มีกระทงที่ลอยไว้ ลองแต่งและปล่อยใบแรกลงสายน้ำดูนะ</p>';return;}
  for(const w of items){
   const row=document.createElement('div');row.className='gal-item';
   row.innerHTML=`<div class="gal-art">${renderKrathong(w.design,'gal-'+w.id.replace(/[^a-z0-9]/gi,''))}</div><div class="gal-body"><p></p><small></small><div class="gal-act"><button type="button" class="ghost-btn" data-a="use">ใช้แบบนี้อีกครั้ง</button><button type="button" class="ghost-btn" data-a="del">ลบ</button></div></div>`;
   row.querySelector('p').textContent=w.message;
   row.querySelector('small').textContent=new Date(w.created_at).toLocaleDateString('th-TH',{day:'numeric',month:'short',year:'numeric'});
   row.querySelector('[data-a=use]').onclick=()=>{Object.assign(design,w.design);ta.value=w.message;ta.dispatchEvent(new Event('input',{bubbles:true}));switchCategory(getCategory());updatePreview(true);dlg.close();};
   row.querySelector('[data-a=del]').onclick=()=>{
    try{localStorage.setItem(KEY,JSON.stringify(readOwnWishes().filter(x=>x.id!==w.id)));}catch{}
    river.removeBoat(w.id);const n=$('#river-summary strong');if(n)n.textContent=river.count;gallery();
   };
   list.append(row);
  }
 };
 $('#gallery-btn')?.addEventListener('click',()=>{gallery();dlg.showModal();});
 dlg.querySelector('.icon-close').onclick=()=>dlg.close();
 dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close();});

 // ---------- Tilt parallax (phones) ----------
 if(!rm&&'DeviceOrientationEvent' in window){
  const canvas=$('#river-canvas'),tilt=e=>{
   if(e.gamma==null||e.beta==null||!river.enabled)return;
   const x=Math.max(-1,Math.min(1,e.gamma/30)),y=Math.max(-1,Math.min(1,(e.beta-45)/30));
   canvas.style.transform=`translate(${(-x*9).toFixed(1)}px,${(-y*6).toFixed(1)}px) scale(1.06)`;
  };
  const start=()=>addEventListener('deviceorientation',tilt);
  if(typeof DeviceOrientationEvent.requestPermission==='function'){
   stage.addEventListener('pointerdown',()=>DeviceOrientationEvent.requestPermission().then(s=>{if(s==='granted')start();}).catch(()=>{}),{once:true});
  }else if(matchMedia('(pointer:coarse)').matches)start();
 }

 // ---------- Regional festival cards (story page) ----------
 const anchor=$('.story-sources');
 if(anchor){
  const box=document.createElement('section');box.className='regions';
  box.innerHTML='<h3>ประเพณีแต่ละถิ่น</h3><p>แตะการ์ดเพื่ออ่านรายละเอียด</p><div class="region-grid"></div>';
  for(const [name,place] of REGIONS){
   const b=document.createElement('button');b.type='button';b.className='regcard';b.setAttribute('aria-expanded','false');
   b.innerHTML=`<strong>${name}</strong><span>${place}</span><em>งานประจำถิ่นที่ผสมความเชื่อ ศิลปะ การแสดง และภูมิทัศน์ของพื้นที่เข้าด้วยกัน</em>`;
   b.onclick=()=>b.setAttribute('aria-expanded',String(b.getAttribute('aria-expanded')!=='true'));
   box.querySelector('.region-grid').append(b);
  }
  anchor.before(box);
 }
}
