const C="english-v171",M="english-media";
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","icon-180.png"])));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C&&k!==M).map(k=>caches.delete(k)))));self.clients.claim()});
const net=(req,ms)=>new Promise((ok,no)=>{const t=setTimeout(no,ms);fetch(req,{cache:"no-cache"}).then(r=>{clearTimeout(t);ok(r)},e=>{clearTimeout(t);no(e)})});
self.addEventListener("fetch",e=>{const req=e.request;if(req.method!=="GET"||req.headers.has("range"))return;const u=new URL(req.url);
  const media=(u.origin===location.origin&&/\/(audio|img)\//.test(u.pathname))||/fonts\.(googleapis|gstatic)\.com/.test(u.host);
  if(media){e.respondWith(caches.match(req).then(m=>m||fetch(req).then(r=>{if(r.ok&&!/\/audio\//.test(u.pathname)){const cp=r.clone();caches.open(M).then(c=>c.put(req,cp))}return r})));return}
  if(u.origin!==location.origin)return;
  e.respondWith(net(req,5000).then(r=>{if(r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(req,cp))}return r}).catch(()=>caches.match(req,{ignoreSearch:true}).then(m=>m||(req.mode==="navigate"?caches.match("index.html"):Response.error()))))});
