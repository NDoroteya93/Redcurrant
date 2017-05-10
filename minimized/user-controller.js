"use strict";import{UserModel}from"userModel";import{loadTemplate}from"templates";import{TicketsController}from"ticketsController";import{CategoryModel}from"categoryModel";import{CategoryController}from"categoryController";import{Helpers}from"helpers";const LOCAL_STORAGE_USERNAME_KEY="signed-in-user-username",LOCAL_STORAGE_AUTHKEY_KEY="signed-in-user-auth-key";class UserController{constructor(){this._userModel=new UserModel,this._container=$("#container"),this._tickets=new TicketsController,this._categories=new CategoryModel,this._categoryController=new CategoryController,this._helpers=new Helpers}get userModel(){return this._userModel}get container(){return this._container}get tickets(){return this._tickets}get helpers(){return this._helpers}get categories(){return this._categories}get categoryController(){return this._categoryController}loadTemplate(a,b){b=b||"";let c=this;new loadTemplate(a).getTemplate().then(a=>{c.container.html(a(b))})}login(a){$(".signed-user").removeClass("hidden"),$(".unsigned-user").addClass("hidden"),a.signinPopup()}logout(a){$(".signed-user").addClass("hidden"),$(".unsigned-user").removeClass("hidden"),a.signoutRedirect().catch(function(a){console.error("error while signing out user",a)})}register(){let a=this;const b=$("#emailaddr").val(),c=$("#reg-username").val(),d=$("#fname-user").val(),e=$("#lname-user").val(),f=$("#reg-password").val(),g=$("#confirmpass").val();a.userModel.register(b,c,d,e,f,g).then(a=>{toastr.success(`User ${c} registered successfully`);location.href="#/tickets"},a=>{location.href="#/register"})}allUsers(){let b;new loadTemplate("users").getTemplate().then(a=>{b=this.userModel.getUsers();return a}).then(a=>{setTimeout(function(){$("#users").html(a(b))},1e3)})}getUser(){let e,a=this,b=[],c=a._container[0].baseURI,d="/user/:username";d=d.replace(/([:*])(\w+)/g,function(a,c,d){return b.push(d),"([^/]+)"})+"(?:/|$)";let f=c.match(new RegExp(d))[1];new loadTemplate("user").getTemplate().then(a=>{e=this.userModel.getUser(f);return a}).then(a=>{setTimeout(function(){$("#users").html(a(e))},1e3)})}viewUserProfile(){this.helpers.loadCanvas();let a=this,b=[],c=[],d=0,e=0,f=0;this.tickets.getTicketForCurrentUser().then(a=>{a.forEach(a=>{0===a.taskState?d++:1===a.taskState?f++:2===a.taskState&&e++;b.push(a)});c.push(d,f,e);return b}).then(b=>{a.loadTemplate("admin",{data:b})}).then(()=>{setTimeout(function(){a.createChart(c)},1500)}),this.filter(),$(document).on("shown.bs.tab",'a[data-toggle="tab"]',function(a){let b=a.target.href.split("#")[1];"dashboard"!==b&&(location.href="#/admin/"+b)}),$(document).on("click",".sidebar-toggle",function(){$(".wrapper").toggleClass("toggled")})}createChart(a){let b={labels:["ToDo","In Progress","Done"],datasets:[{data:a,backgroundColor:["#ec971f","#ff0000","#4cae4c"],hoverBackgroundColor:["#ce8621","#d80202","#53b353"]}]},c=$("#pieChart")[0].getContext("2d");new Chart(c,{type:"pie",data:b,options:{animation:{animateScale:!0}}})}filter(){$(".table-user-ticket span.filter").unbind(),$(document).on("keyup",'[data-action="filter"]',function(a){$(".filterTable_no_results").remove();var b=$(this),c=b.val().toLowerCase(),d=b.attr("data-filters"),e=$(d),f=e.find("tbody tr");if(""==c)f.show();else if(f.each(function(){var a=$(this);-1===a.text().toLowerCase().indexOf(c)?a.hide():a.show()}),0===e.find("tbody tr:visible").length){var g=e.find("tr").first().find("td").size(),h=$('<tr class="filterTable_no_results"><td colspan="'+g+'">No results found</td></tr>');e.find("tbody").append(h)}}),$(document).on("click",".table-user-tickets span.filter",function(a){var b=$(this),c=b.parents(".panel");c.find(".panel-body").slideToggle(),"none"!=b.css("display")&&c.find(".panel-body input").focus()}),$('[data-toggle="tooltip"]').tooltip()}changePass(){new loadTemplate("changepass").getTemplate().then(a=>{$("#configuration").html(a())})}getCategories(){let a=this;const b=new loadTemplate("categories");let c=this.categories.getCategories();b.getTemplate().then(b=>{setTimeout(function(){$("#categories").html(b({data:c})),a.categoryEvents()},500)})}categoryEvents(){let a=this;$("#add-category-btn").on("click",function(){a.categoryController.addCategory(),$("#addCategory").modal("hide")}),$(".delete-category-btn").on("click",function(){let a=$(this),b=a.parents("tr").data("id");$("#delete-category-btn").attr("data-id",b),$("#deleteCategory").modal("show")}),$("#delete-category-btn").on("click",function(){let b=$(this),c=b.attr("data-id");a.categoryController.deleteCategory(c),$("#deleteCategory").modal("hide")})}}export{UserController};