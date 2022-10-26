(()=>{var a=class{static encodeUrlQuery(n){if(!n)return"";let e=[];for(let i in n)n.hasOwnProperty(i)&&n[i]&&(n[i]===!0?e.push(encodeURIComponent(i)):e.push(encodeURIComponent(i)+"="+encodeURIComponent(n[i])));return e.join("&")}static decodeUrlQuery(n){let e={};if(!n||n.trim()==="")return e;let i=n.split("&");for(let o=0;o<i.length;o++){let t=i[o].split("=");if(t.length>=1&&t[0]){let c=decodeURIComponent(t[0]);t.length===2?e[c]=decodeURIComponent(t[1]):e[c]=""}}return e}static decodeUrl(n){n||(n="");let e=n.split("#"),i=e.length>1?e[1]:"",o=e[0].split("?"),t=o.length>1?o[1]:"";return{path:o[0],query:a.decodeUrlQuery(t),hash:a.decodeUrlQuery(i)}}static addQuery(n,e){return n+(n.contains("?")?"&":"?")+a.encodeUrlQuery(e)}};var u=function(){let s=navigator.appVersion;return s.indexOf("Win")!==-1?"Windows":s.indexOf("Mac")!==-1?"MacOS":s.indexOf("X11")!==-1||s.indexOf("Linux")!==-1?"Linux":"Unknown OS"}(),r={Windows:{buttonName:"Windows",descriptionName:"Windows",downloadLink:"https://github.com/obsidianmd/obsidian-releases/releases/download/v1.0.3/Obsidian.1.0.3.exe"},"Windows-32":{buttonName:"Windows (32-bit)",descriptionName:"Windows (32-bit)",downloadLink:"https://github.com/obsidianmd/obsidian-releases/releases/download/v1.0.3/Obsidian.1.0.3-32.exe"},"Windows-ARM64":{buttonName:"Windows (ARM 64-bit)",descriptionName:"Windows",downloadLink:"https://github.com/obsidianmd/obsidian-releases/releases/download/v1.0.3/Obsidian.1.0.3-arm64.exe"},MacOS:{buttonName:"macOS",descriptionName:"macOS",downloadLink:"https://github.com/obsidianmd/obsidian-releases/releases/download/v1.0.3/Obsidian-1.0.3-universal.dmg"},Linux:{buttonName:"Linux (AppImage)",descriptionName:"Linux (AppImage)",downloadLink:"https://github.com/obsidianmd/obsidian-releases/releases/download/v1.0.3/Obsidian-1.0.3.AppImage"},"Linux-Snap":{buttonName:"Linux",descriptionName:"Linux (Snap)",downloadLink:"https://github.com/obsidianmd/obsidian-releases/releases/download/v1.0.3/obsidian_1.0.3_amd64.snap"},"Linux-Flatpak":{buttonName:"Linux",descriptionName:"Linux (Flatpak)",downloadLink:"https://flathub.org/apps/details/md.obsidian.Obsidian"}},p=["Windows","MacOS","Linux","Linux-Snap","Linux-Flatpak"];if(u!=="Windows"&&u!=="Unknown OS"){let s=r[u];fishAll(".download-os").forEach(e=>e.setText(s.buttonName)),fishAll(".download-button").forEach(e=>e.setAttribute("href",s.downloadLink));let n=p.slice();n.remove(u);for(let e=0;e<n.length;e++){let i=n[e],o=r[i];fishAll(`.alt-os-${e+1}`).forEach(t=>{t.setText(o.descriptionName),t.setAttribute("href",o.downloadLink)})}}var d=a.decodeUrlQuery(location.search.substring(1)),l="";d.os==="mac"?l=r.MacOS.downloadLink:d.os==="win"?d.arch==="x64"?l=r.Windows.downloadLink:d.arch==="ia32"?l=r["Windows-32"].downloadLink:d.arch==="arm64"&&(l=r["Windows-ARM64"].downloadLink):d.os==="linux"&&fish(".card.mod-linux").scrollIntoView();l&&(window.location.href=l);})();
