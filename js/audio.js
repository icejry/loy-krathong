// The loop is an original composition shipped with this project (not an existing festival recording).
const MUTE_KEY='moonriver.muted';
export class FestivalAudio{
 constructor(){
  this.player=new Audio('assets/moonriver-original.mp3');
  this.player.loop=true;this.player.preload='auto';this.player.volume=.58;
  this.started=false;this.ctx=null;
  try{this.muted=localStorage.getItem(MUTE_KEY)==='1';}catch{this.muted=false;}
  this.player.muted=this.muted;
  this.unlock=this.unlock.bind(this);
  window.addEventListener('pointerdown',this.unlock,{passive:true});
  window.addEventListener('keydown',this.unlock);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){this.player.pause();}else if(this.started){this.player.play().catch(()=>{});}});
 }
 toggle(){
  this.muted=!this.muted;this.player.muted=this.muted;
  try{localStorage.setItem(MUTE_KEY,this.muted?'1':'0');}catch{}
  if(!this.muted&&this.player.paused&&this.started)this.player.play().catch(()=>{});
  return !this.muted;
 }
 unlock(){
  if(this.started){if(this.player.paused&&!document.hidden)this.player.play().catch(()=>{});return;}
  this.player.play().then(()=>{this.started=true;document.documentElement.classList.add('music-started');}).catch(()=>{});
 }
 chime(freq=660){
  if(this.muted)return;
  try{
   const C=window.AudioContext||window.webkitAudioContext;
   if(!C)return;this.ctx=this.ctx||new C();if(this.ctx.state==='suspended')this.ctx.resume().catch(()=>{});
   const now=this.ctx.currentTime,o=this.ctx.createOscillator(),g=this.ctx.createGain();
   o.type='sine';o.frequency.setValueAtTime(freq,now);o.frequency.exponentialRampToValueAtTime(freq*.75,now+.6);
   g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(.07,now+.018);g.gain.exponentialRampToValueAtTime(.0001,now+1.1);
   o.connect(g);g.connect(this.ctx.destination);o.start(now);o.stop(now+1.12);
  }catch{}
 }
 release(){this.chime(783.99);setTimeout(()=>this.chime(587.33),240);}
}
