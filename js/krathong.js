import { PALETTE, TRIM, validateDesign } from './data.js';

const f=n=>Number(n).toFixed(2);
function mainPetal(x,y,h,w,rot,id,isLeaf,kind){
 const className=isLeaf?'leaf':'flowerbase';
 const depth=kind==='woven'?6:kind==='banana'?10:20;
 return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)})">
 <path d="M${-w*.29} 9 Q${-w*.66} ${-h*.36} 0 ${-h} Q${w*.66} ${-h*.36} ${w*.29} 9 Q0 ${depth} ${-w*.29} 9Z" fill="url(#${id}-${className})" stroke="${isLeaf?'#b7ce98':'#f5d6cd'}" stroke-width="1.8" stroke-opacity=".85"/>
 <path d="M0 ${-h+4} Q4 ${-h*.43} 0 12" fill="none" stroke="${isLeaf?'#dfedb1':'#fff7df'}" stroke-width="1.3" stroke-opacity=".59"/>
 <path d="M${f(-w*.20)} -5 Q0 ${f(-h*.3)} ${f(w*.20)} -5" fill="none" stroke="#fff9d9" stroke-width=".8" opacity=".21"/>
 ${kind==='woven'?`<path d="M-15 -6L15 3M-14 6L14 -3" stroke="#e4cf98" stroke-width="1.5" opacity=".7"/>`:''}
 </g>`;
}
function blossom(x,y,scale,i,c){
 const pal=PALETTE[c.flower];let petals='';const type=c.flower;
 if(type==='marigold'){
  for(let j=0;j<17;j++){const a=j*Math.PI*2/17;petals+=`<circle cx="${f(Math.cos(a)*16)}" cy="${f(Math.sin(a)*16)}" r="11" fill="${j%2?pal[1]:pal[0]}" stroke="${pal[2]}" stroke-width=".55"/>`;}
  for(let j=0;j<8;j++){const a=j*Math.PI*2/8;petals+=`<circle cx="${f(Math.cos(a)*8)}" cy="${f(Math.sin(a)*8)}" r="7" fill="${pal[1]}" opacity=".91"/>`;}
 }else if(type==='jasmine'){
  for(let j=0;j<9;j++)petals+=`<ellipse cy="-14" rx="7.7" ry="18.5" transform="rotate(${j*40})" fill="${j%2?pal[1]:pal[0]}" stroke="${pal[2]}" stroke-width=".55"/>`;
 }else if(type==='orchid'){
  for(let j=0;j<5;j++)petals+=`<ellipse cy="-14" rx="12" ry="20" transform="rotate(${j*72})" fill="${j%2?pal[1]:pal[0]}" stroke="${pal[2]}" stroke-width=".85"/>`;
  petals+=`<path d="M-12 1Q-5 20 0 13Q5 20 12 1Q0-8-12 1Z" fill="#d9c17e"/>`;
 }else if(type==='champa'){
  for(let j=0;j<8;j++)petals+=`<ellipse cy="-18" rx="7.5" ry="22" transform="rotate(${j*45})" fill="${j%2?pal[1]:pal[0]}" stroke="${pal[2]}" stroke-width=".7"/>`;
 }else{
  for(let j=0;j<7;j++)petals+=`<path d="M-9 12Q-15 -8 0 -35Q15 -8 9 12Z" transform="rotate(${(j-3)*27})" fill="${j%2?pal[1]:pal[0]}" stroke="${pal[2]}" stroke-width=".9"/>`;
 }
 return `<g transform="translate(${f(x)} ${f(y)}) scale(${f(scale)}) rotate(${i*19%32-16})"><ellipse cy="11" rx="29" ry="12" fill="#08251a" opacity=".26"/>${petals}<circle cy="2" r="5" fill="#e8c97c"/><circle cy="2" r="2" fill="#fff2be"/></g>`;
}
function lamps(c,id){
 const placements={one:[250],two:[228,272],three:[210,250,290],incense:[250],five:[193,222,250,278,307]};
 let result='';
 for(const [i,x] of placements[c.light].entries()){
  const y=132+((i%2)*8);
  result+=`<g><rect x="${x-5.5}" y="${y}" width="11" height="${216-y}" rx="3" fill="url(#${id}-wax)" stroke="#fff0d7" stroke-opacity=".72" stroke-width=".9"/>
  <path d="M${x} ${y}v-8" stroke="#5e503d" stroke-width="1.7"/>
  <g class="river-flame" style="transform-origin:${x}px ${y-21}px">
  <ellipse cx="${x}" cy="${y-22}" rx="34" ry="43" fill="url(#${id}-flameglow)"/>
  <path d="M${x} ${y-6}Q${x-16} ${y-22} ${x} ${y-49}Q${x+16} ${y-24} ${x} ${y-6}Z" fill="#f8ab3a"/>
  <path d="M${x} ${y-11}Q${x-7} ${y-23} ${x} ${y-37}Q${x+8} ${y-24} ${x} ${y-11}Z" fill="#fffde4"/></g></g>`;
 }
 if(c.light==='incense'){
  for(let i=0;i<3;i++){const x=280+i*7;result+=`<path d="M${x} 212L${x+8} ${107+i*3}" stroke="#ba9869" stroke-width="2.6" stroke-linecap="round"/><path d="M${x+8} ${107+i*3}v-11" stroke="#c47355" stroke-width="2.2"/>`;}
 }
 return result;
}
function ornaments(c){
 let result='',tone=TRIM[c.trim];
 if(c.decoration==='simple')return result;
 if(c.decoration==='garland'){
  for(let j=0;j<17;j++){const angle=Math.PI*(j+.3)/17,x=250+136*Math.cos(angle),y=261+39*Math.sin(angle);
   result+=`<circle cx="${f(x)}" cy="${f(y)}" r="4.6" fill="${j%3===0?'#f5e5b2':'#fff9ed'}" stroke="#cba968" stroke-width=".7"/>`;
  }
 }else if(c.decoration==='ribbon'){
  result+='<path d="M102 268Q250 332 398 267" fill="none" stroke="#f6db9e" stroke-width="5" stroke-dasharray="8 8" opacity=".8"/>';
  for(let j=0;j<5;j++){const x=119+j*65;result+=`<path d="M${x} 281l-6 20 9-5 9 9 -3-23" fill="#eac17e" stroke="#997044" stroke-width=".9"/>`;}
 }else if(c.decoration==='dew'){
  for(let j=0;j<18;j++){const angle=j*2*Math.PI/18,r=95+(j%4)*13,x=250+r*Math.cos(angle),y=212+Math.sin(angle)*39;
   result+=`<circle cx="${f(x)}" cy="${f(y)}" r="${j%3===0?3.9:2.5}" fill="#dffcff" opacity=".87"/><circle cx="${f(x-1)}" cy="${f(y-1)}" r=".9" fill="white"/>`;
  }
 }else{
  for(let j=0;j<20;j++){const angle=Math.PI*(j+.2)/20,x=250+140*Math.cos(angle),y=263+45*Math.sin(angle);
   const fill=c.decoration==='beads'?'#fff8e6':'#f2c867';
   result+=`<circle cx="${f(x)}" cy="${f(y)}" r="${c.decoration==='beads'?4.2:3.1}" fill="${fill}" stroke="${tone}" stroke-width="1"/>`;
  }
 }
 return result;
}
export function renderKrathong(input,unique='hero'){
 const c=validateDesign(input),id=`kr-${String(unique).replace(/[^a-zA-Z0-9-]/g,'')}`;
 const lotus=c.base==='lotus'||c.base==='layers';
 const leaf=lotus?['#fce6e0','#d68fa3','#904d69']:['#d0e2ad','#689f70','#22583f'];
 let back='',front='',middle='',flowersBack='',flowersFront='';
 const n=c.base==='woven'?29:c.base==='banana'?16:c.base==='spiral'?25:22;
 const h=c.base==='banana'?104:c.base==='woven'?64:c.base==='spiral'?92:86;
 const w=c.base==='woven'?35:c.base==='banana'?70:c.base==='spiral'?54:59;
 for(let i=0;i<n;i++){
  const a=i*Math.PI*2/n,x=250+148*Math.cos(a),y=245+41*Math.sin(a);
  const rot=Math.cos(a)*17+(c.base==='spiral'?23:0);
  const part=mainPetal(x,y,h,w,rot,id,!lotus,c.base);
  if(Math.sin(a)<0)back+=part;else front+=part;
 }
 if(c.base==='layers'||c.base==='spiral'){
  const m=c.base==='spiral'?21:17;
  for(let i=0;i<m;i++){const a=i*Math.PI*2/m;middle+=mainPetal(250+107*Math.cos(a),219+27*Math.sin(a),c.base==='spiral'?70:65,38,Math.cos(a)*9+(c.base==='spiral'?35:0),id,!lotus,c.base);}
 }
 for(let i=0;i<c.density;i++){
  const a=i*Math.PI*2/c.density,r=91+(i%3)*3;
  const flower=blossom(250+r*Math.cos(a),209+Math.sin(a)*34,.72+(i%4)*.09,i,c);
  if(Math.sin(a)<0)flowersBack+=flower;else flowersFront+=flower;
 }
 const trim=TRIM[c.trim],shine=c.decoration==='gold'?'#f5dc9c':'#e0c58c';
 return `<svg viewBox="0 0 500 370" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
 <defs>
 <linearGradient id="${id}-leaf" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${leaf[0]}"/><stop offset=".48" stop-color="${leaf[1]}"/><stop offset="1" stop-color="${leaf[2]}"/></linearGradient>
 <linearGradient id="${id}-flowerbase" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${PALETTE[c.flower][0]}"/><stop offset=".47" stop-color="${PALETTE[c.flower][1]}"/><stop offset="1" stop-color="${PALETTE[c.flower][2]}"/></linearGradient>
 <linearGradient id="${id}-wax" x1="0" x2="1"><stop stop-color="#bbaa8b"/><stop offset=".5" stop-color="#fff8e0"/><stop offset="1" stop-color="#aa997e"/></linearGradient>
 <radialGradient id="${id}-flameglow"><stop stop-color="#fff8c8" stop-opacity=".95"/><stop offset=".38" stop-color="#ffd284" stop-opacity=".36"/><stop offset="1" stop-color="#ffc26b" stop-opacity="0"/></radialGradient>
 <radialGradient id="${id}-shadow"><stop stop-color="#030e11" stop-opacity=".57"/><stop offset="1" stop-color="#030e11" stop-opacity="0"/></radialGradient>
 </defs>
 <ellipse cx="250" cy="316" rx="181" ry="34" fill="url(#${id}-shadow)"/>
 <ellipse cx="250" cy="260" rx="177" ry="49" fill="#1c5942" stroke="#d6b77a" stroke-width="3"/>
 ${back}
 <ellipse cx="250" cy="231" rx="139" ry="43" fill="#22513e" stroke="#a5b87a" stroke-width="3"/>
 ${middle}${flowersBack}
 <ellipse cx="250" cy="211" rx="63" ry="22" fill="#e1c27a" opacity=".24"/>
 ${lamps(c,id)}
 ${flowersFront}${front}
 <path d="M76 254Q102 307 250 320Q398 307 424 254Q380 290 250 302Q120 290 76 254Z" fill="#296044" stroke="#afc38d" stroke-width="2.4"/>
 <path d="M80 266Q250 336 420 266" fill="none" stroke="${trim}" stroke-width="8"/>
 <path d="M89 278Q250 337 411 278" fill="none" stroke="${shine}" stroke-width="1.4" opacity=".75"/>
 ${ornaments(c)}
 </svg>`;
}
export function choiceIcon(category,key){
 const fill=category==='flower'?(PALETTE[key]?.[1]||'#c5d0b5'):category==='trim'?(TRIM[key]||'#8db87b'):'#8aab7c';
 if(category==='light')return `<svg viewBox="0 0 40 40" aria-hidden="true" fill="none"><path d="M20 10Q13 19 20 23Q27 19 20 10Z" fill="#e5a54e"/><rect x="17" y="22" width="6" height="15" rx="1" fill="#f6edce" stroke="#a88b5d"/></svg>`;
 if(category==='decoration')return `<svg viewBox="0 0 40 40" aria-hidden="true" fill="none"><circle cx="20" cy="20" r="13" stroke="#638b6f" stroke-width="1.4" stroke-dasharray="3 3"/><circle cx="20" cy="7" r="3.5" fill="#e8c485"/><circle cx="33" cy="20" r="3.5" fill="#f6e9c3"/><circle cx="20" cy="33" r="3.5" fill="#e8c485"/><circle cx="7" cy="20" r="3.5" fill="#f6e9c3"/></svg>`;
 return `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 3Q8 17 20 34Q32 17 20 3Z" fill="${fill}" stroke="#54755b" stroke-width="1.2"/><path d="M12 14Q1 17 6 26Q10 33 20 36Q13 23 12 14ZM28 14Q39 17 34 26Q30 33 20 36Q27 23 28 14Z" fill="${fill}" stroke="#54755b" stroke-width="1"/></svg>`;
}
