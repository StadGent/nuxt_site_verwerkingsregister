"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};!function(e,t){"function"==typeof define&&define.amd?define(t):"object"===("undefined"==typeof exports?"undefined":_typeof(exports))?module.exports=t():e.CheckboxFilter=t()}(window,function(){return function(e,c){if("undefined"!=typeof gent_styleguide){c||(c={});var i=e.querySelector(c.filterfield||".checkbox-filter__filter"),o=e.querySelectorAll(c.checkboxes||"div.checkbox")||[],l=e.querySelector(c.selectedContainer||".checkbox-filter__selected"),t=e.querySelector(c.checkboxContainer||".checkbox-filter__checkboxes"),n=e.querySelector(c.openBtn||".checkbox-filter__open"),r=e.querySelector(c.submitBtn||".checkbox-filter__submit"),a=e.querySelector(c.modal||".checkbox-filter__modal"),s=e.querySelectorAll(c.closeBtns||".checkbox-filter__close"),d=e.querySelector(c.resultSpan||".checkbox-filter__result"),u=e.querySelector(c.resultSpanWrapper||".checkbox-filter__result-wrapper"),f=e.querySelector(c.countSpanWrapper||".checkbox-filter__count-wrapper"),b=e.querySelector(c.countSpan||".checkbox-filter__count"),h=null,p=[],v=!1!==c.makeTags||c.makeTags,y=new gent_styleguide.TabTrap(a),k=function(e){if(i){e&&(i.value="");var c=0;t&&(t.style.display="none"),L(function(e){var t=e.checkboxWrapper,n=e.checkbox,r=e.label;r&&-1!==r.innerText.toUpperCase().indexOf(i.value.toUpperCase())?(t.removeAttribute("hidden"),n.removeAttribute("hidden"),c++):(t.setAttribute("hidden","true"),n.setAttribute("hidden","true"))}),t&&(t.style.display=""),_(c),y.setFocusables()}},x=function(e,t){var n=document.createElement("span");n.className="tag filter",n.innerText=t.innerText,n.setAttribute("data-value",e.value);var r=document.createElement("button");return r.type="button",r.innerHTML='<span class="visually-hidden">'+(c.hiddenTagText||"Remove tag")+"</span>",r.addEventListener("click",function(){e.checked=!1,l.removeChild(n)}),n.appendChild(r),n},m=function(){var e=l.children.length;b&&(b.innerText=e),f&&(0<e?f.classList.remove("hidden"):f.classList.add("hidden"))},_=function(e){d&&(d.innerText=e),u&&(""===i.value?u.classList.add("hidden"):u.classList.remove("hidden"))},S=function(){if(a.classList.contains("visible")){m(),n.setAttribute("aria-expanded","false"),a.setAttribute("aria-hidden","true"),a.classList.remove("visible"),h&&h.focus(),k(!0),document.removeEventListener("keydown",g);for(var e=a;(e=e.parentElement)&&!e.classList.contains("modal"););e&&e.classList.contains("visible")?e.style.overflow="":document.body.style.overflow=""}else{n.setAttribute("aria-expanded","true"),a.removeAttribute("aria-hidden"),document.body.style.overflow="hidden",document.addEventListener("keydown",g),a.classList.add("visible"),a.focus();for(var t=a;(t=t.parentElement)&&!t.classList.contains("modal"););t&&t.classList.contains("visible")&&(t.style.overflow="hidden")}},L=function(e){for(var t=o.length;t--;){var n=o[t],r=n.querySelector("input[type=checkbox]"),c=n.querySelector("label");e({checkboxWrapper:n,checkbox:r,label:c})}},A=function(){v&&(l.innerHTML=""),L(function(e){var t=e.checkbox,n=e.label;-1!==p.indexOf(t)?t.checked=!0:t.checked=!1,t.checked&&v&&l.appendChild(x(t,n))})},g=function(e){if(y&&y.hasFocusables&&e)switch(e.keyCode||e.which){case 9:e.shiftKey?y.back(e):y.next(e);break;case 27:e.preventDefault(),A(),S();break;case 13:e.preventDefault()}};return p=[],a.setAttribute("tabindex","-1"),a.setAttribute("aria-hidden","true"),n.setAttribute("aria-expanded","false"),L(function(e){var t=e.checkbox,n=e.label;t.checked&&v&&l.appendChild(x(t,n))}),m(),k(!0),function(){if(i){var e=null;i.addEventListener("input",function(){e&&clearTimeout(e),e=setTimeout(k,200)})}if(L(function(e){var t=e.checkbox,n=e.label;t.addEventListener("change",function(){t.checked?v&&l.appendChild(x(t,n)):v&&function(e){for(var t=l.querySelectorAll(".filter"),n=t.length;n--;)t[n].getAttribute("data-value")===e.value&&l.removeChild(t[n])}(t)})}),n&&n.addEventListener("click",function(){h=n,p=[],L(function(e){var t=e.checkbox;t.checked&&p.push(t)}),S()}),s)for(var t=s.length;t--;)s[t].addEventListener("click",function(){A(),S()});r&&r.addEventListener("click",S)}(),{}}console.error("You need to include base.js.")}});