(()=>{function d(e,t,s){return"https://raw.githubusercontent.com/"+e+"/"+(s||"HEAD")+"/"+t}function a(e,t,s){ajax({method:"POST",url:e,data:t,success:r=>{if(r=JSON.parse(r),r.error){s(r.error);return}s(null,r)},error:r=>{if(r.error){s(r.error);return}s(r)}})}var B=d("obsidianmd/obsidian-releases","community-plugins.json");var j=d("obsidianmd/obsidian-releases","community-css-themes.json");var i=class{static encodeUrlQuery(t){if(!t)return"";let s=[];for(let r in t)t.hasOwnProperty(r)&&t[r]&&(t[r]===!0?s.push(encodeURIComponent(r)):s.push(encodeURIComponent(r)+"="+encodeURIComponent(t[r])));return s.join("&")}static decodeUrlQuery(t){let s={};if(!t||t.trim()==="")return s;let r=t.split("&");for(let n=0;n<r.length;n++){let o=r[n].split("=");if(o.length>=1&&o[0]){let u=decodeURIComponent(o[0]);o.length===2?s[u]=decodeURIComponent(o[1]):s[u]=""}}return s}static decodeUrl(t){t||(t="");let s=t.split("#"),r=s.length>1?s[1]:"",n=s[0].split("?"),o=n.length>1?n[1]:"";return{path:n[0],query:i.decodeUrlQuery(o),hash:i.decodeUrlQuery(r)}}};function S(){history.pushState?history.pushState("",document.title,window.location.pathname+window.location.search):location.hash=""}var m=fishAll(".pricing-card"),w=fish(".modal-container.mod-choose-plan"),f=fishAll(".modal-container.mod-choose-plan .card"),b=fishAll(".js-close-modal, .modal-close-button, .modal-bg"),h=fish(".js-upgrade-publish"),g=fish(".js-upgrade-sync"),R=fishAll(".js-goto-account"),U=fishAll(".pricing-link"),c="https://api.obsidian.md",I=c+"/user/info",_=c+"/subscription/list",L=c+"/subscription/start",Q=c+"/subscription/stripe/start",P=c+"/subscription/stripe/finish",T=!1,y=!1,E=!1,x="";m.forEach(e=>{e.addEventListener("click",t=>{m.forEach(s=>s.addClass("mod-muted")),e.removeClass("mod-muted")})});U.forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation()})});R.forEach(e=>{e.addEventListener("click",t=>{window.location.href="/account"})});b.forEach(e=>{e.addEventListener("click",()=>{w.hide()})});f.forEach(e=>{e.addEventListener("click",()=>{f.forEach(t=>t.removeClass("is-selected")),e.addClass("is-selected"),x=e.getAttribute("data-renew")})});var C=async()=>{a(I,{},(e,t)=>{e||(T=!0)})},A=()=>{a(_,{},(e,t)=>{if(e)return;let s=t.subscriptions;y=s.some(r=>r.type==="sync"&&r.expiry_ts>Date.now()),E=s.some(r=>r.type==="publish"&&r.expiry_ts>Date.now()),y&&(g.setText("Your plan"),g.style.cursor="default"),E&&(h.setText("Your plan"),h.style.cursor="default")})},O=e=>{a(P,{session:e},(t,s)=>{S(),t?console.error("Something went wrong. "+t):v()})},v=()=>{a(L,{type:"sync"},(e,t)=>{e?console.error("Something went wrong. "+e):window.location.href="/account"})};C();A();var l=location.hash;l&&l.length>1&&(l=l.substr(1));var p=i.decodeUrlQuery(l);if(p.stripe&&p.stripe==="complete"){let e=p.session;e&&String.isString(e)&&O(e)}h.addEventListener("click",()=>{window.location.href="/account"});g.addEventListener("click",()=>{window.location.href="/account"});})();
