"use strict";class Helpers{console(){}priorityHelper(){Handlebars.registerHelper("enum",function(a){return 0===a?new Handlebars.SafeString("Low"):1===a?new Handlebars.SafeString("Medium"):2===a?new Handlebars.SafeString("High"):void 0})}loadCanvas(){Handlebars.registerHelper("dataUrl",function(){let a=document.getElementById("pieChart");return a.classList.remove("hidden"),a.toDataURL()})}}export{Helpers};