import {renderKrathong} from './krathong.js';
import {validateDesign} from './data.js';

export class LivingRiver{
 constructor(stage,canvas,layer){
  this.stage=stage;this.canvas=canvas;this.layer=layer;this.ctx=canvas.getContext('2d',{alpha:false});
  this.boats=[];this.ripples=[];this.particles=[];this.stars=[];this.rng=9274;this.w=1;this.h=1;this.dpr=1;
  this.inView=true;this.enabled=true;this.animation=0;this.lastFrame=0;
  this.reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  this.lanterns=[];this.shooting=[];this.onTap=null;
  const t0=performance.now();this.nextLantern=t0+1200;this.nextStar=t0+5000;
  stage.addEventListener('pointerdown',e=>{
   if(!this.enabled||e.target.closest('button,a,textarea,input,.wish-sheet'))return;
   const r=stage.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
   if(y<this.h*.545&&!this.reduceMotion){
    if(this.yipeng){const hit=this.lanterns.find(l=>Math.hypot((l.cx??-99)-x,(l.cy??-99)-y)<30);if(hit){this.onLantern?.(hit);return;}}this.lantern(x,y,true);this.onTap?.('sky');}
   else{this.ripple(x,y,1.3);this.onTap?.('water');}
  });
  this.resize=this.resize.bind(this);this.animate=this.animate.bind(this);
  if('ResizeObserver' in window){this.ro=new ResizeObserver(this.resize);this.ro.observe(this.stage);}else window.addEventListener('resize',this.resize);
  if('IntersectionObserver' in window){this.io=new IntersectionObserver(e=>{this.inView=e[0]?.isIntersecting??true;},{threshold:.01});this.io.observe(this.stage);}
  this.resize();this.animation=requestAnimationFrame(this.animate);
 }
 random(){this.rng=(1664525*this.rng+1013904223)>>>0;return this.rng/4294967296;}
 resize(){const r=this.stage.getBoundingClientRect();this.w=Math.max(1,r.width);this.h=Math.max(1,r.height);this.dpr=Math.min(1.8,window.devicePixelRatio||1);this.canvas.width=Math.round(this.w*this.dpr);this.canvas.height=Math.round(this.h*this.dpr);this.ctx.setTransform(this.dpr,0,0,this.dpr,0,0);this.stars=[];for(let i=0;i<92;i++)this.stars.push({x:this.random(),y:this.random()*.54,r:.4+this.random()*1.5,phase:this.random()*8});this.render(performance.now());}
 addBoat({id,design,message,source='sample',x,y,launch=false,scale=.40}){
  if(this.boats.some(b=>b.id===id))return;
  const el=document.createElement('button');el.type='button';el.className='floating-boat';
  if(source==='mine')el.classList.add('mine');
  el.setAttribute('aria-label',source==='mine'?'เปิดคำอธิษฐานจากกระทงของฉัน':source==='online'?'เปิดคำอธิษฐานจากกระทงของผู้เข้าร่วม':'เปิดคำอธิษฐานจากกระทงตัวอย่าง');
  el.innerHTML=renderKrathong(validateDesign(design),`float-${id.replace(/[^a-z0-9-]/gi,'')}`);
  if(source==='mine'){
   const tag=document.createElement('span');tag.className='boat-tag';tag.textContent='ของคุณ';el.appendChild(tag);
  }
  const boat={id,el,design:validateDesign(design),message,source,tx:x,ty:y,x:launch?.49:x,y:launch?.79:y,scale,nowScale:launch?1:scale,launchAt:launch?performance.now():null,phase:this.boats.length*1.57+this.random(),lastWake:0};
  el.addEventListener('click',()=>this.onSelect?.(boat));
  this.layer.appendChild(el);this.boats.push(boat);
  // Retain the user's boats while limiting purely decorative instances.
  while(this.boats.length>68){const idx=this.boats.findIndex(b=>b.source==='sample');if(idx<0)break;this.removeBoat(this.boats[idx].id);}
  this.updateBoat(boat,performance.now());
  return boat;
 }
 removeBoat(id){const idx=this.boats.findIndex(b=>b.id===id);if(idx>=0){this.boats[idx].el.remove();this.boats.splice(idx,1);}}
 clearSource(source){[...this.boats].filter(b=>b.source===source).forEach(b=>this.removeBoat(b.id));}
 get count(){return this.boats.length;}
 ripple(x,y,size=1){this.ripples.push({x,y,size,start:performance.now()});if(this.reduceMotion)this.render(performance.now());}
 burst(x,y){const now=performance.now();this.ripple(x,y,1.85);for(let i=0;i<42;i++){const a=i*Math.PI*2/42;this.particles.push({x,y,vx:Math.cos(a)*(18+this.random()*70),vy:Math.sin(a)*(18+this.random()*43)-20,start:now,life:750+this.random()*1100});}}
 updateBoat(b,now){
  const t=now*.001;
  if(b.launchAt!==null){
   const p=Math.min(1,(now-b.launchAt)/(this.reduceMotion?100:6200));
   const ease=1-Math.pow(1-p,3);
   b.x=.49+(b.tx-.49)*ease;b.y=.79+(b.ty-.79)*ease;
   b.nowScale=1+(b.scale-1)*ease;
   if(p>=1)b.launchAt=null;
  }else{
   b.x=b.tx+(this.reduceMotion?0:Math.sin(t*.2+b.phase)*.012);
   b.y=b.ty+(this.reduceMotion?0:Math.sin(t*.7+b.phase)*.005);
   b.nowScale=b.scale;
  }
  const bob=this.reduceMotion?0:Math.sin(t*1.65+b.phase)*2.2;
  b.el.style.left=`${(b.x*100).toFixed(3)}%`;
  b.el.style.top=`calc(${(b.y*100).toFixed(3)}% + ${bob.toFixed(1)}px)`;
  b.el.style.width=`${(Math.min(265,this.w*.58)*b.nowScale).toFixed(1)}px`;
  b.el.style.setProperty('--tilt',`${this.reduceMotion?0:(Math.sin(t*.86+b.phase)*2.4).toFixed(2)}deg`);
  b.el.style.zIndex=String(Math.round(b.y*100));
  if(!this.reduceMotion&&b.launchAt===null&&now-b.lastWake>2500){b.lastWake=now;this.ripple(b.x*this.w,b.y*this.h+9,Math.max(.28,b.nowScale*.65));}
 }
 lantern(x,y,manual=false,t=performance.now()){
  if(this.lanterns.length>(this.yipeng?44:18))this.lanterns.shift();
  const k=this.w<560?.8:1;
  this.lanterns.push({x,y,start:t,speed:(manual?24:12)+this.random()*12,sway:6+this.random()*12,ph:this.random()*6.28,s:(manual?9:5)*k+this.random()*3*k});
 }
 seedLanterns(n){
  const now=performance.now();
  for(let i=0;i<n;i++){this.lantern(this.w*(.04+this.random()*.92),this.h*.54,false,now);const l=this.lanterns[this.lanterns.length-1];l.start=now-this.random()*(this.h*.42/l.speed)*1000;}
 }
 ambient(now){
  if(this.reduceMotion)return;
  const max=this.yipeng?(this.w<560?16:36):(this.w<560?4:8);
  if(now>this.nextLantern&&this.lanterns.length<max){this.lantern(this.w*(.05+this.random()*.9),this.h*.54,false,now);this.nextLantern=now+(this.yipeng?350+this.random()*800:2500+this.random()*4500);}
  if(now>this.nextStar){this.shooting.push({x:this.w*(.05+this.random()*.6),y:this.h*(.04+this.random()*.2),start:now});this.nextStar=now+9000+this.random()*9000;}
 }
 animate(now){this.animation=requestAnimationFrame(this.animate);if(!this.enabled||document.hidden||!this.inView)return;if(now-this.lastFrame<32)return;this.lastFrame=now;for(const b of this.boats)this.updateBoat(b,now);this.ambient(now);this.render(now);}
 render(now){
  const ctx=this.ctx,w=this.w,h=this.h,t=now*.001,water=h*.545,mx=w*.755,my=h*.218,mr=Math.min(w,h)*.077;
  const bg=ctx.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#071525');bg.addColorStop(.45,'#183b46');bg.addColorStop(.56,'#355456');bg.addColorStop(1,'#081d29');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
  let glow=ctx.createRadialGradient(mx,my,mr*.1,mx,my,mr*6.0);glow.addColorStop(0,'rgba(251,225,177,.28)');glow.addColorStop(.37,'rgba(228,186,126,.075)');glow.addColorStop(1,'rgba(228,186,126,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
  for(const star of this.stars){ctx.fillStyle=`rgba(255,236,198,${.22+.48*(.5+.5*Math.sin(t*.75+star.phase))})`;ctx.beginPath();ctx.arc(star.x*w,star.y*h,star.r,0,7);ctx.fill();}
  const moon=ctx.createRadialGradient(mx-mr*.27,my-mr*.35,2,mx,my,mr);moon.addColorStop(0,'#fffae8');moon.addColorStop(.67,'#f5dbad');moon.addColorStop(1,'#d3aa78');ctx.fillStyle=moon;ctx.beginPath();ctx.arc(mx,my,mr,0,7);ctx.fill();
  ctx.save();ctx.beginPath();ctx.arc(mx,my,mr,0,7);ctx.clip();ctx.fillStyle='#af98721c';for(const [x,y,r] of [[-.24,.19,.23],[.35,-.17,.13],[.17,.38,.15],[-.39,-.24,.11]]){ctx.beginPath();ctx.arc(mx+x*mr,my+y*mr,r*mr,0,7);ctx.fill();}ctx.restore();
  // Distant hills in three tonal layers.
  for(let layer=0;layer<3;layer++){
   ctx.fillStyle=['#1c3b42','#132f3a','#0c2932'][layer];const y0=water-42+layer*19;
   ctx.beginPath();ctx.moveTo(0,water);ctx.lineTo(0,y0);
   for(let i=0;i<=42;i++){const x=i*w/42;const y=y0-15*Math.sin(i*.41+layer*2)-24*Math.sin(i*.15+layer);ctx.lineTo(x,y);}
   ctx.lineTo(w,water);ctx.closePath();ctx.fill();
  }
  // Temple silhouette, subtly lit from within.
  const tx=w*.23,ty=water-17,s=Math.max(.62,Math.min(1.25,w/950));ctx.save();ctx.translate(tx,ty);ctx.scale(s,s);
  ctx.fillStyle='#0c202a';ctx.strokeStyle='#a8865b70';ctx.lineWidth=1;
  ctx.fillRect(-75,-49,150,49);ctx.beginPath();ctx.moveTo(-99,-54);ctx.lineTo(0,-88);ctx.lineTo(99,-54);ctx.lineTo(74,-53);ctx.lineTo(0,-73);ctx.lineTo(-74,-53);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillRect(-58,-89,116,14);ctx.beginPath();ctx.moveTo(-69,-91);ctx.lineTo(0,-113);ctx.lineTo(69,-91);ctx.lineTo(50,-91);ctx.lineTo(0,-100);ctx.lineTo(-50,-91);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillRect(-11,-137,22,24);ctx.beginPath();ctx.moveTo(-30,-137);ctx.lineTo(0,-155);ctx.lineTo(30,-137);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#d1a76c77';ctx.fillRect(-38,-32,10,17);ctx.fillRect(28,-32,10,17);ctx.fillRect(-6,-25,12,25);ctx.restore();
  // Sky lanterns drift up from behind the hills.
  this.lanterns=this.lanterns.filter(l=>{
   const age=Math.max(0,(now-l.start)/1000),ly=l.y-age*l.speed,lx=l.x+Math.sin(age*.8+l.ph)*l.sway;
   l.cx=lx;l.cy=ly;let a=Math.min(1,age/1.2)*Math.max(0,Math.min(1,ly/(h*.12)));if(a<=.01)return false;
   const s=l.s,gl=ctx.createRadialGradient(lx,ly,0,lx,ly,s*5);gl.addColorStop(0,`rgba(255,190,100,${.38*a})`);gl.addColorStop(1,'rgba(255,190,100,0)');
   ctx.fillStyle=gl;ctx.fillRect(lx-s*5,ly-s*5,s*10,s*10);
   ctx.fillStyle=`rgba(255,196,118,${.95*a})`;ctx.beginPath();ctx.moveTo(lx-s*.7,ly-s);ctx.lineTo(lx+s*.7,ly-s);ctx.lineTo(lx+s*.95,ly+s*.9);ctx.lineTo(lx-s*.95,ly+s*.9);ctx.closePath();ctx.fill();
   ctx.fillStyle=`rgba(255,244,205,${.9*a})`;ctx.beginPath();ctx.ellipse(lx,ly+s*.35,s*.38,s*.5,0,0,7);ctx.fill();
   return true;
  });
  this.shooting=this.shooting.filter(st=>{
   const p=(now-st.start)/1000/.9;if(p>=1)return false;
   const x=st.x+p*w*.28,y=st.y+p*h*.1,tx=x-w*.07,ty=y-h*.025,gr=ctx.createLinearGradient(x,y,tx,ty);
   gr.addColorStop(0,`rgba(255,244,214,${1-p})`);gr.addColorStop(1,'rgba(255,244,214,0)');
   ctx.strokeStyle=gr;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(tx,ty);ctx.stroke();return true;
  });
  const river=ctx.createLinearGradient(0,water,0,h);river.addColorStop(0,'#31565c');river.addColorStop(.26,'#16404b');river.addColorStop(1,'#071c2a');ctx.fillStyle=river;ctx.fillRect(0,water,w,h-water);
  ctx.fillStyle='#e0d5b128';ctx.fillRect(0,water,w,1);
  const moonReflect=ctx.createRadialGradient(mx,water+25,0,mx,water+85,w*.5);moonReflect.addColorStop(0,'rgba(250,216,157,.28)');moonReflect.addColorStop(1,'rgba(245,205,154,0)');ctx.fillStyle=moonReflect;ctx.fillRect(0,water,w,h-water);
  for(let i=0;i<159;i++){
   const depth=(i+.5)/159,y=water+depth*(h-water),spread=(.045+depth*.44)*w;
   const x=mx+Math.sin(i*15.9)*spread*.52+(this.reduceMotion?0:Math.sin(t*.72+i*.81)*14);
   const length=3+depth*46+(i%5)*2.8;
   const alpha=(.04+(1-depth)*.23)*(i%4===0?1.25:.55);
   ctx.strokeStyle=i%4===0?`rgba(250,215,148,${alpha})`:`rgba(172,222,208,${alpha})`;
   ctx.lineWidth=i%4===0?1.4:.78;ctx.beginPath();ctx.moveTo(x-length*.5,y);ctx.lineTo(x+length*.5,y);ctx.stroke();
  }
  // Water ripples on every floating boat, and light on its wake.
  for(const b of this.boats){
   const x=b.x*w,y=b.y*h+5,r=41*b.nowScale;
   const halo=ctx.createRadialGradient(x,y,0,x,y,r*1.8);halo.addColorStop(0,b.source==='mine'?'rgba(255,199,111,.45)':'rgba(255,196,103,.25)');halo.addColorStop(1,'rgba(255,196,103,0)');ctx.fillStyle=halo;ctx.beginPath();ctx.ellipse(x,y,r*2.4,r*.65,0,0,7);ctx.fill();
   ctx.strokeStyle=b.source==='mine'?'#f2cc8a6b':'#f2cc8a44';ctx.lineWidth=.9;ctx.beginPath();ctx.ellipse(x,y+7,r*1.8,r*.32,0,0,7);ctx.stroke();
  }
  this.ripples=this.ripples.filter(r=>now-r.start<2350);
  for(const r of this.ripples){const age=(now-r.start)/2350;for(let j=0;j<3;j++){const radius=(9+age*85-j*15)*r.size;if(radius<1)continue;ctx.strokeStyle=`rgba(255,226,166,${Math.max(0,(1-age)*(.49-j*.09))})`;ctx.lineWidth=1.1;ctx.beginPath();ctx.ellipse(r.x,r.y,radius,radius*.24,0,0,7);ctx.stroke();}}
  this.particles=this.particles.filter(p=>now-p.start<p.life);
  for(const p of this.particles){const s=(now-p.start)/1000,a=Math.max(0,1-(now-p.start)/p.life),x=p.x+p.vx*s,y=p.y+p.vy*s+34*s*s;ctx.fillStyle=`rgba(255,220,154,${a})`;ctx.beginPath();ctx.arc(x,y,1.1+a*2.1,0,7);ctx.fill();}
 }
 destroy(){cancelAnimationFrame(this.animation);this.ro?.disconnect();this.io?.disconnect();}
}
