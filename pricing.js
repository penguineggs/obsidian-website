(()=>{var e=fishAll(".pricing-card"),i=fish(".js-upgrade-publish"),n=fish(".js-upgrade-sync"),o=fishAll(".js-goto-account"),l=fishAll(".pricing-link");e.forEach(t=>{t.addEventListener("click",()=>{e.forEach(c=>c.addClass("mod-muted")),t.removeClass("mod-muted")})});l.forEach(t=>{t.addEventListener("click",c=>{c.stopPropagation()})});o.forEach(t=>{t.addEventListener("click",c=>{window.location.href="/account"})});i.addEventListener("click",()=>{window.location.href="/account"});n.addEventListener("click",()=>{window.location.href="/account"});})();
