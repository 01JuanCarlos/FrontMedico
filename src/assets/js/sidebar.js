$(document).ready(() => {

let arrow = document.querySelectorAll(".arrow");
  for (var i = 0; i < arrow.length; i++) {
    arrow[i].addEventListener("click", (e)=>{
   let arrowParent = e.target.parentElement.parentElement;//selecting main parent of arrow
   arrowParent.classList.toggle("showMenu");
    });
  }
  let containersidebar = document.querySelector(".container-sidebar");
  let contentpage =document.querySelector(".content-page");
  let sidebar = document.querySelector(".sidebar");
  let sidebarBtn = document.querySelector(".bx-menu");
  let navbar = document.querySelector(".navbar-custom");
  console.log(sidebarBtn);
  sidebarBtn.addEventListener("click", ()=>{
    sidebar.classList.toggle("minimized");
    navbar.classList.toggle("minimized");
    containersidebar.classList.toggle("minimized");
    contentpage.classList.toggle("minimized");
  });
});