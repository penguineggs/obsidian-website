(()=>{var p=(e,t,u)=>new Promise((r,i)=>{var a=l=>{try{n(u.next(l))}catch(c){i(c)}},o=l=>{try{n(u.throw(l))}catch(c){i(c)}},n=l=>l.done?r(l.value):Promise.resolve(l.value).then(a,o);n((u=u.apply(e,t)).next())});var M=(e,t)=>e[0]-t[0];function x(e){if(e.length===0)return e;e.sort(M);let t=[e[0]];for(let u=1;u<e.length;u++){let r=t.last();r[1]<e[u][0]?t.push(e[u]):r[1]<e[u][1]&&(r[1]=e[u][1])}return t}function L(e,t,u,r){if(e.length===0)return 0;let i=0;i-=Math.max(0,e.length-1),i-=r/10;let a=e[0][0];return i-=(e[e.length-1][1]-a+1-t)/100,i-=a/1e3,i-=u/1e4,i}function S(e,t){let u=t.toLowerCase(),r=[];for(let i of e){if(!i)continue;let a=!1,o=-1,n=i.length;for(;(o=u.indexOf(i,o))!==-1;)a=!0,r.push([o,o+n]),o+=n+1;if(!a)return null}return x(r)}function D(e,t,u){let r=S(e,u);return r?{score:L(r,t.length,u.length,0),matches:r}:null}function E(e,t,u=0){let r=document.createDocumentFragment();if(!t)return r.appendText(e),r;let i=0;for(let a=0;i<e.length&&a<t.length;a++){let o=t[a],n=o[0]+u,l=o[1]+u;if(!(l<=0)){if(n>=e.length)break;n<0&&(n=0),n!==i&&r.appendText(e.substring(i,n)),r.createSpan({cls:"suggestion-highlight",text:e.substring(n,l)}),i=l}}return i<e.length&&r.appendText(e.substring(i)),r}function C(e,t=0,u=!1){let r=null,i=null,a=null,o=0,n=function(){if(o){let d=Date.now();if(d<o){r=window.setTimeout(n,o-d),o=0;return}}r=null;let c=i,s=a;i=null,a=null,e.apply(c,s)},l=function(...c){i=this,a=c,r?u&&(o=Date.now()+t):r=window.setTimeout(n,t)};return l.cancel=function(){return r&&(clearTimeout(r),r=null),l},l}function v(e){if(!navigator.clipboard||!navigator.permissions){let t=document.createElement("textarea");t.value=e,t.style.top="0",t.style.left="0",t.style.position="fixed",document.body.appendChild(t);try{t.focus(),t.select(),document.execCommand("copy")}catch(u){}document.body.removeChild(t);return}navigator.clipboard.writeText(e)}var X=window.requestIdleCallback;var k=/bot|crawl|spider/i.test(navigator.userAgent);function P(e){return e.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")}function b(e,t,u){return u||(u=t+"s"),e===1?e+" "+t:P(e)+" "+u}function F(e,t,u){return"https://raw.githubusercontent.com/"+e+"/"+(u||"HEAD")+"/"+t}var B=F("obsidianmd/obsidian-releases","community-plugins.json");function T(){return p(this,null,function*(){let e=yield ajaxPromise({url:B}),t=JSON.parse(e);if(!Array.isArray(t))throw new Error("Failed to parse community plugins.");return t})}var R=F("obsidianmd/obsidian-releases","community-plugin-stats.json");function A(){return p(this,null,function*(){let e=yield ajaxPromise({url:R});try{return JSON.parse(e)}catch(t){throw t}})}var q=F("obsidianmd/obsidian-releases","community-css-themes.json");var h="";try{let e=new URLSearchParams(location.search);h=e.get("id"),h?setTimeout(()=>{location.href="obsidian://show-plugin?id="+encodeURIComponent(h)},0):h=e.get("search")}catch(e){console.error(e)}h=h||"";p(void 0,null,function*(){let e=n=>{let l=n.length,c;for(;l!==0;)c=Math.floor(Math.random()*l),l--,[n[l],n[c]]=[n[c],n[l]];return n},t=fish(".plugins-container"),u=fish(".plugin-count"),r=fish(".plugin-search"),i=yield T(),a=yield A();u.setText(String(i.length)),e(i);function o(n){n=(n||"").trim();let l=n.toLowerCase().split(" ");t.empty();let c=[];for(let s of i){let d=-1/0,f,m,g;if(n){if(f=D(l,n,s.name),m=D(l,n,s.description),g=D(l,n,s.author),!f&&!m&&!g&&n!==s.id.toLowerCase())continue;f&&(d=Math.max(f.score,d)),m&&(d=Math.max(m.score,d)),g&&(d=Math.max(g.score,d))}let y=a.hasOwnProperty(s.id)?a[s.id].downloads:0,w=jsx("div",{className:"subfeature"},jsx("div",{className:"subfeature-title u-center-text"},E(s.name,f?f.matches:null)),jsx("p",{className:"author-container u-center-text"},"By\xA0",jsx("span",{className:"author-name"},E(s.author,g?g.matches:null))),jsx("p",{className:"u-muted"},E(s.description,m?m.matches:null)),jsx("div",{className:"u-center-text"},jsx("button",{className:"mod-cta",onclick:()=>window.open("https://github.com/"+s.repo,"_blank")},"Learn more"),y?jsx("p",{className:"u-muted"},b(y,"download")):"",jsx("p",null,jsx("a",{className:"u-muted",href:"#",onclick:()=>location.href="obsidian://show-plugin?id="+encodeURIComponent(s.id)},"Open in Obsidian"),"\xA0",jsx("a",{className:"u-muted",href:"#",onclick:()=>v("https://obsidian.md/plugins?id="+encodeURIComponent(s.id))},"Copy link to share"))));c.push({score:d,el:w})}c.sort(function(s,d){return s.score-d.score});for(let s of c)t.appendChild(s.el)}r.value=h,o(h),r.addEventListener("input",C(()=>{let n=r.value;o(n),n!==""?window.history.replaceState(null,null,`?search=${n}`):window.history.replaceState(null,null,window.location.pathname)},100))});})();
