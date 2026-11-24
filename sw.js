const V='loy-krathong-v4';
const CORE=['./','index.html','css/styles.css','css/enhance.css','js/config.js','js/app.js','js/extras.js','js/more.js','js/river.js','js/krathong.js','js/data.js','js/audio.js','js/storage.js','assets/lotus.svg','manifest.webmanifest'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
 const r=e.request,u=new URL(r.url);
 // Leave audio, range requests and third-party hosts (fonts, Supabase) to the browser.
 if(r.method!=='GET'||u.origin!==location.origin||r.headers.has('range')||u.pathname.endsWith('.mp3'))return;
 e.respondWith(fetch(r).then(res=>{const copy=res.clone();caches.open(V).then(c=>c.put(r,copy));return res;}).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))));
});
