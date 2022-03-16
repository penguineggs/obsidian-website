(()=>{var y=(n,l,p)=>new Promise((L,M)=>{var G=c=>{try{S(p.next(c))}catch(g){M(g)}},A=c=>{try{S(p.throw(c))}catch(g){M(g)}},S=c=>c.done?L(c.value):Promise.resolve(c.value).then(G,A);S((p=p.apply(n,l)).next())});function E(n,l,p){return"https://raw.githubusercontent.com/"+n+"/"+(p||"HEAD")+"/"+l}var $=E("obsidianmd/obsidian-releases","community-plugins.json");function Y(){return y(this,null,function*(){let n=yield ajaxPromise({url:$}),l=JSON.parse(n);if(!Array.isArray(l))throw new Error("Failed to parse community plugins.");return l})}var K=E("obsidianmd/obsidian-releases","community-plugin-stats.json");var Q=E("obsidianmd/obsidian-releases","community-css-themes.json");function C(){return y(this,null,function*(){let n=yield ajaxPromise({url:Q}),l=JSON.parse(n);if(!Array.isArray(l))throw new Error("Failed to parse community themes.");return l})}y(void 0,null,function*(){function n(U){return Math.floor(Math.random()*U.length)}let l=E("obsidianmd/obsidian-releases","community-plugins.json"),p=E("obsidianmd/obsidian-releases","community-css-themes.json"),L="GUESS_NAME_BY_DESC",M="GUESS_DESC_BY_NAME",G="GUESS_AUTHOR_BY_NAME",A="GUESS_AUTHOR_BY_DESC",S=[L,M,G,A],c="GUESS_NAME_BY_IMAGE",g="GUESS_DARK_MODE_BY_NAME",D="GUESS_LIGHT_MODE_BY_NAME",H="GUESS_AUTHOR_BY_IMAGE",I=[c,g,D,H],z=fish(".quiz-area"),_=fish(".quiz-question"),r=fish(".quiz-options"),o=fish(".quiz-result"),q=fish(".quiz-result-text"),R=fish(".current-score"),k=fish(".current-question"),b=0,w=0,B=15;o.addEventListener("click",()=>{O()});let P=fish(".js-start-quiz");P.addEventListener("click",()=>{O()});let T=yield Y(),N=yield C(),u=()=>{q.setText("\u{1F389} Correct! You mined 1 crystal!"),o.removeClasses(["mod-error","mod-end"]),o.addClass("mod-success"),o.show(),b+=1},h=(U,d)=>{q.setText(`\u{1F645} Wrong! The correct answer is "${U}".`),o.removeClasses(["mod-success","mod-end"]),o.addClass("mod-error"),o.show()},j=()=>{q.innerHTML=`That was the last question! Your final score is ${b}.<br>Click to play again!`,o.removeClasses(["mod-error","mod-success"]),o.addClass("mod-end"),o.show()},O=()=>{if(w++,k.setText(String(w)),R.setText(String(b)),w>B){j(),b=0,w=0;return}z.show(),P.hide(),o.hide();let U=Math.random()>.5;if(r.empty(),U){let d=S[n(S)],s=[],f=4,x=4;for(;x>0;){let e=n(T);s.contains(e)||(s.push(e),x-=1)}let m=n(s),i=T[s[m]];if(d===A){_.innerHTML=`Who is the author of the plugin that does this?<br>"${i.description}"`;for(let e=0;e<f;e++){let t=s[e];r.createDiv({cls:"quiz-option",text:T[t].author},a=>{a.addEventListener("click",()=>{e===m?u():h(i.author,1)})})}}else if(d===G){_.innerHTML=`Who is the author of the "${i.name}" plugin?`;for(let e=0;e<f;e++){let t=s[e];r.createDiv({cls:"quiz-option",text:T[t].author},a=>{a.addEventListener("click",()=>{e===m?u():h(i.author,1)})})}}else if(d===M){_.innerHTML=`What does the "${i.name}" plugin do?`;for(let e=0;e<f;e++){let t=s[e];r.createDiv({cls:"quiz-option",text:T[t].description},a=>{a.addEventListener("click",()=>{e===m?u():h(i.description,3)})})}}else if(d===L){_.innerHTML=`What's the name of the plugin that does this?<br>"${i.description}"`;for(let e=0;e<f;e++){let t=s[e];r.createDiv({cls:"quiz-option",text:T[t].name},a=>{a.addEventListener("click",()=>{e===m?u():h(i.name,3)})})}}}else{let d=I[n(I)],s=[],f=4,x=4;for(;x>0;){let e=n(N);s.contains(e)||(s.push(e),x-=1)}let m=n(s),i=N[s[m]];if(d===H){let e=E(i.repo,i.screenshot,i.branch);_.innerHTML=`Who is the author of this theme?<br><img src="${e}">`;for(let t=0;t<f;t++){let a=s[t];r.createDiv({cls:"quiz-option",text:N[a].author},v=>{v.addEventListener("click",()=>{t===m?u():h(i.author,1)})})}}else if(d===g){_.innerHTML=`Does the "${i.name}" theme have a dark mode?`;let e=i.modes.contains("dark");r.createDiv({cls:"quiz-option",text:"Yes"},t=>{t.addEventListener("click",()=>{e?u():h("no",2)})}),r.createDiv({cls:"quiz-option",text:"No"},t=>{t.addEventListener("click",()=>{e?h("yes",2):u()})})}else if(d===D){_.innerHTML=`Does the "${i.name}" theme have a light mode?`;let e=i.modes.contains("light");r.createDiv({cls:"quiz-option",text:"Yes"},t=>{t.addEventListener("click",()=>{e?u():h("no",2)})}),r.createDiv({cls:"quiz-option",text:"No"},t=>{t.addEventListener("click",()=>{e?h("yes",2):u()})})}else if(d===c){let e=E(i.repo,i.screenshot,i.branch);_.innerHTML=`What's the name of this theme?<br><img src="${e}">`;for(let t=0;t<f;t++){let a=s[t];r.createDiv({cls:"quiz-option",text:N[a].name},v=>{v.addEventListener("click",()=>{t===m?u():h(i.name,3)})})}}}}});})();
