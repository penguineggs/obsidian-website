(()=>{function f(e,t,n){Object.defineProperty(e,t,{value:n,enumerable:!1,configurable:!0,writable:!0})}var h=window;for(let e of["TouchEvent"])typeof h[e]=="undefined"&&(h[e]=function(){});Object.isEmpty||f(Object,"isEmpty",function(e){for(let t in e)if(e.hasOwnProperty(t))return!1;return!0});Object.each||(Object.each=function(e,t,n){for(let r in e)if(e.hasOwnProperty(r)&&t.call(n,e[r],r)===!1)return!1;return!0});Array.prototype.first||f(Array.prototype,"first",function(){if(this.length!==0)return this[0]});Array.prototype.last||f(Array.prototype,"last",function(){if(this.length!==0)return this[this.length-1]});Array.prototype.contains||f(Array.prototype,"contains",function(e){return this.indexOf(e)!==-1});Array.prototype.remove||f(Array.prototype,"remove",function(e){for(let t=this.length-1;t>=0;t--)this[t]===e&&this.splice(t,1)});Array.prototype.shuffle||f(Array.prototype,"shuffle",function(){let e=this.length,t,n;for(;e!==0;)n=Math.floor(Math.random()*e),e-=1,t=this[e],this[e]=this[n],this[n]=t;return this});Math.clamp||(Math.clamp=function(e,t,n){return Math.min(Math.max(e,t),n)});Math.square||(Math.square=function(e){return e*e});String.isString||(String.isString=function(e){return typeof e=="string"||e instanceof String});String.prototype.contains||(String.prototype.contains=function(e){return this.indexOf(e)!==-1});String.prototype.startsWith||(String.prototype.startsWith=function(e,t){return this.substr(!t||t<0?0:+t,e.length)===e});String.prototype.endsWith||(String.prototype.endsWith=function(e,t){let n=t===void 0||t>this.length?this.length:t;return this.substring(n-e.length,n)===e});String.prototype.format||(String.prototype.format=function(...e){return this.replace(/{(\d+)}/g,function(t,n){return typeof e[n]!="undefined"?e[n]:t})});Number.isNumber||f(Number,"isNumber",function(e){return typeof e=="number"});f(window,"isBoolean",function(e){return typeof e=="boolean"});var E=function(e){let t=e.nodeType;if(t===1||t===9||t===11){if(typeof e.textContent=="string")return e.textContent;{let n=[];for(let r=e.firstChild;r;r=r.nextSibling)n.push(E(r));return n.join("")}}else if(t===3||t===4)return e.nodeValue||"";return""},N=function(e,t){if(t instanceof DocumentFragment||t instanceof Node){e.empty(),e.appendChild(t);return}String.isString(t)||(t=String(t));let n=e.nodeType;(n===1||n===9||n===11)&&(e.textContent=t)};Element.prototype.getText=function(){return E(this)};Element.prototype.setText=function(e){N(this,e)};Element.prototype.addClass=function(...e){this.addClasses(e)};Element.prototype.addClasses=function(e){for(let t=0;t<e.length;t++)this.classList.add(e[t])};Element.prototype.removeClass=function(...e){this.removeClasses(e)};Element.prototype.removeClasses=function(e){for(let t=0;t<e.length;t++)this.classList.remove(e[t])};Element.prototype.toggleClass=function(e,t){e instanceof Array||(e=[e]),t?this.addClasses(e):this.removeClasses(e)};Element.prototype.hasClass=function(e){return this.classList.contains(e)};[Element.prototype,Document.prototype,DocumentFragment.prototype].forEach(e=>{f(e,"prepend",function(...n){let r=document.createDocumentFragment();for(let i of n)r.appendChild(i instanceof Node?i:document.createTextNode(String(i)));this.insertBefore(r,this.firstChild)})});Node.prototype.detach=function(){this.parentNode&&this.parentNode.removeChild(this)};Node.prototype.empty=function(){for(;this.lastChild;)this.removeChild(this.lastChild)};Node.prototype.insertAfter=function(e){e.parentNode&&e.parentNode.insertBefore(this,e.nextSibling)};Node.prototype.indexOf=function(e){return Array.prototype.indexOf.call(this.childNodes,e)};Node.prototype.setChildrenInPlace=function(e){let t=this.firstChild,n=new Set(e);for(let r of e){for(;t&&!n.has(t);){let i=t;t=t.nextSibling,this.removeChild(i)}r!==t?this.insertBefore(r,t):t=t.nextSibling}for(;t;){let r=t;t=t.nextSibling,this.removeChild(r)}};Node.prototype.appendText=function(e){this.appendChild(document.createTextNode(e))};Element.prototype.setAttr=function(e,t){t===null?this.removeAttribute(e):this.setAttribute(e,String(t))};Element.prototype.setAttrs=function(e){for(let t in e)if(e.hasOwnProperty(t)){let n=e[t];this.setAttr(t,n)}};Element.prototype.getAttr=Element.prototype.getAttribute;f(Element.prototype,"matchParent",function(e,t){if(this.matches(e))return this;if(this===t)return null;let n=this.parentElement;return n?n.matchParent(e,t):null});Element.prototype.getCssPropertyValue=function(e,t){return getComputedStyle(this,t).getPropertyValue(e).trim()};HTMLElement.prototype.show||(HTMLElement.prototype.show=function(){this.style.display==="none"&&(this.style.display=this.getAttribute("data-display")||"",this.removeAttribute("data-display"))});HTMLElement.prototype.hide||(HTMLElement.prototype.hide=function(){let e=this.style.display;e!=="none"&&(this.style.display="none",e?this.setAttribute("data-display",e):this.removeAttribute("data-display"))});HTMLElement.prototype.toggle||(HTMLElement.prototype.toggle=function(e){e?this.show():this.hide()});HTMLElement.prototype.toggleVisibility||(HTMLElement.prototype.toggleVisibility=function(e){e?this.style.visibility="":this.style.visibility="hidden"});f(HTMLElement.prototype,"isShown",function(){return!!this.offsetParent});window.fish=function(e){return document.querySelector(e)};window.fishAll=function(e){return Array.prototype.slice.call(document.querySelectorAll(e))};Element.prototype.find=function(e){return this.querySelector(e)};Element.prototype.findAll=function(e){return Array.prototype.slice.call(this.querySelectorAll(e))};Element.prototype.findAllSelf=function(e){let t=Array.prototype.slice.call(this.querySelectorAll(e));return this.matches(e)&&t.unshift(this),t};Node.prototype.createEl=function(e,t,n){return typeof t=="string"&&(t={cls:t}),t=t||{},t.parent=this,createEl(e,t,n)};Node.prototype.createDiv=function(e,t){return this.createEl("div",e,t)};Node.prototype.createSpan=function(e,t){return this.createEl("span",e,t)};window.createEl=function(t,n,r){let i=document.createElement(t);typeof n=="string"&&(n={cls:n});let{cls:o,text:l,attr:d,title:s,value:a,placeholder:m,type:u,parent:p,prepend:H,href:g}=n||{};return o&&(Array.isArray(o)?i.className=o.join(" "):i.className=o),l&&i.setText(l),d&&i.setAttrs(d),s&&(i.title=s),a&&(i instanceof HTMLInputElement||i instanceof HTMLSelectElement||i instanceof HTMLOptionElement)&&(i.value=a),u&&i instanceof HTMLInputElement&&(i.type=u),u&&i instanceof HTMLStyleElement&&i.setAttribute("type",u),m&&i instanceof HTMLInputElement&&(i.placeholder=m),g&&(i instanceof HTMLAnchorElement||i instanceof HTMLLinkElement)&&(i.href=g),r&&r(i),p&&(H?p.insertBefore(i,p.firstChild):p.appendChild(i)),i};window.createDiv=function(t,n){return createEl("div",t,n)};window.createSpan=function(t,n){return createEl("span",t,n)};window.createFragment=function(t){let n=document.createDocumentFragment();return t&&t(n),n};var y=function(e,t,n,r){let i=this._EVENTS;i||(i={},this._EVENTS=i);let o=i[e];o||(o=[],i[e]=o);let l=function(d){let s=d.target;if(s instanceof Element){let a=s.matchParent(t,d.currentTarget);a&&n.call(this,d,a)}};o.push({selector:t,listener:n,options:r,callback:l}),this.addEventListener(e,l,r)},A=function(e,t){this.addEventListener("click",e,t),this.addEventListener("auxclick",e,t)},T=function(e,t,n,r){let i=this._EVENTS;if(!i)return;let o=i[e];!o||(i[e]=o.filter(l=>{if(l.selector===t&&l.listener===n&&l.options===r){let d=l.callback;return this.removeEventListener(e,d,r),!1}return!0}))},x=function(e){let t=document.createEvent("HTMLEvents");t.initEvent(e,!0,!1),this.dispatchEvent(t)};HTMLElement.prototype.on=y;HTMLElement.prototype.off=T;Document.prototype.on=y;Document.prototype.off=T;HTMLElement.prototype.onClickEvent=A;HTMLElement.prototype.trigger=x;var c=new WeakMap;HTMLElement.prototype.onNodeInserted=function(e,t){let n=i=>{!this.isShown()||(t&&r(),i.animationName==="node-inserted"&&e())},r=()=>{this.removeEventListener("animationstart",n);let i=(c.get(this)||0)-1;i<=0?(c.delete(this),this.removeClass("node-insert-event")):c.set(this,i)};return c.set(this,(c.get(this)||0)+1),this.addClass("node-insert-event"),this.addEventListener("animationstart",n),r};function v(e){let{method:t,url:n,success:r,error:i,data:o,headers:l,withCredentials:d}=e;t=t||"GET";let s=new XMLHttpRequest;if(e.req=s,s.open(t,n,!0),s.onload=()=>{let a=s.status,m=s.response;a>=200&&a<400?r&&r(m,s):i&&i(m,s)},s.onerror=a=>{i&&i(a,s)},l)for(let a in l)l.hasOwnProperty(a)&&s.setRequestHeader(a,l[a]);s.withCredentials=d||!1,o?(d===void 0&&(s.withCredentials=!0),String.isString(o)?s.send(o):o instanceof ArrayBuffer?(s.setRequestHeader("Content-Type","application/octet-stream"),s.send(o)):(s.setRequestHeader("Content-Type","application/json; charset=utf-8"),s.send(JSON.stringify(o)))):s.send()}function S(e){return new Promise((t,n)=>{e.success=t,e.error=(r,i)=>n(i),v(e)})}window.ajax=v;window.ajaxPromise=S;function w(e){document.readyState!=="loading"?e():document.addEventListener("DOMContentLoaded",e)}window.ready=w;window.sleep=function(e){return new Promise(t=>setTimeout(t,e))};window.jsx=function(e,t,...n){if(typeof e=="function")return e(t!=null?t:{},n);let r=createEl(e);if(t)for(let i in t){if(!t.hasOwnProperty(i))continue;let o=t[i];!o||(i==="class"?r.className=o:i==="style"?r.setAttr("style",o):i.startsWith("on")&&typeof o=="function"?r.addEventListener(i.substr(2).toLowerCase(),o):r[i]=t[i])}if(n)for(let i of n)String.isString(i)?r.appendText(i):Array.isArray(i)?r.append(...i):r.appendChild(i);return r};window.jsxFragment=function(e,...t){let n=document.createDocumentFragment();if(t)for(let r of t)String.isString(r)?n.appendText(r):Array.isArray(r)?n.append(...r):n.appendChild(r);return n};var M=fish(".static-header-menu"),b=fish(".static-header-pop-up-nav-container"),L=fish(".static-header-pop-up-nav-close-button");M&&M.addEventListener("click",e=>{e.preventDefault(),b.addClass("is-active")});L&&L.addEventListener("click",e=>{e.preventDefault(),b.removeClass("is-active")});for(let e of fishAll(".js-lightbox-navigate"))e.addEventListener("click",()=>{let t=e.getAttribute("href");history.replaceState(void 0,void 0,t)});})();
