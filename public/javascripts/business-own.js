// (function($) {
//   "use strict"; // Start of use strict
//   // Configure tooltips for collapsed side navigation
//   $('.navbar-sidenav [data-toggle="tooltip"]').tooltip({
//     template: '<div class="tooltip navbar-sidenav-tooltip" role="tooltip" style="pointer-events: none;"><div class="arrow"></div><div class="tooltip-inner"></div></div>'
//   })
//   // Toggle the side navigation
//   $("#sidenavToggler").click(function(e) {
//     e.preventDefault();
//     $("body").toggleClass("sidenav-toggled");
//     $(".navbar-sidenav .nav-link-collapse").addClass("collapsed");
//     $(".navbar-sidenav .sidenav-second-level, .navbar-sidenav .sidenav-third-level").removeClass("show");
//   });
//   // Force the toggled class to be removed when a collapsible nav link is clicked
//   $(".navbar-sidenav .nav-link-collapse").click(function(e) {
//     e.preventDefault();
//     $("body").removeClass("sidenav-toggled");
//   });
//   // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
//   $('body.fixed-nav .navbar-sidenav, body.fixed-nav .sidenav-toggler, body.fixed-nav .navbar-collapse').on('mousewheel DOMMouseScroll', function(e) {
//     var e0 = e.originalEvent,
//       delta = e0.wheelDelta || -e0.detail;
//     this.scrollTop += (delta < 0 ? 1 : -1) * 30;
//     e.preventDefault();
//   });
//   // Scroll to top button appear
//   $(document).scroll(function() {
//     var scrollDistance = $(this).scrollTop();
//     if (scrollDistance > 100) {
//       $('.scroll-to-top').fadeIn();
//     } else {
//       $('.scroll-to-top').fadeOut();
//     }
//   });
//   // Configure tooltips globally
//   $('[data-toggle="tooltip"]').tooltip()
//   // Smooth scrolling using jQuery easing
//   $(document).on('click', 'a.scroll-to-top', function(event) {
//     var $anchor = $(this);
//     $('html, body').stop().animate({
//       scrollTop: ($($anchor.attr('href')).offset().top)
//     }, 1000, 'easeInOutExpo');
//     event.preventDefault();
//   });
// })(jQuery); // End of use strict

// // Get the container element
// var btnContainer = document.getElementById("exampleAccordion");

// // Get all buttons with class="btn" inside the container
// var btns = btnContainer.getElementsByClassName("nav-item");

// // Loop through the buttons and add the active class to the current/clicked button
// for (var i = 0; i < btns.length; i++) {
//   btns[i].addEventListener("click", function() {
//     var current = document.getElementsByClassName("active");
//     current[0].className = current[0].className.replace(" active", "");
//     this.className += " active";
//   });
// }

// $(document).ready(function(){
//   $('#mainNav ul li a').click(function(){
//     $(this).addClass("active");
//     $('#mainNav li').removeClass("active");
// });
// });

  // $('#mainNav ul li a').on('click', function(){
  //   $(this).addClass("active");
  //   $('#mainNav li').removeClass("active");
  // })

// $(document).ready(function(){
//   $(this).addClass("active");
//     $('#mainNav ul li a').on('click', function(){
//       $(this).addClass("active");
//       $('#mainNav li').removeClass("active");
//     })
    // $('#mainNav li').removeClass("active");
// });

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

$(document).ready(function() {
  $('#dataTable1').DataTable({
    responsive: true,
    "searching": false,
    "paging" : false,
    "columnDefs": [{
      "targets": 3,
      "orderable": false
      }]
  });

  $('#dataTable2').DataTable({
    responsive: true,
    "searching": false,
    "paging" : false,
    "columnDefs": [{
      "targets": 3,
      "orderable": false
      }]
  });

  $('#dataTable8').DataTable({
    responsive: true,
    "searching": false,
    "paging" : false,
    "columnDefs": [{
      "targets": 3,
      "orderable": false
      }]
  });

  $('#dataTable3').DataTable({
    responsive: true,
    "searching": false,
    "lengthChange": false,
    "columnDefs": [{
      "targets": 2,
      "orderable": false
      }]
  });

  $('#dataTable4').DataTable({
    responsive: true,
    "searching": false,
    "lengthChange": false,
    "columnDefs": [{
      "targets": 3,
      "orderable": false
      }]
  });

  $('#dataTable5').DataTable({
    responsive: true,
    "searching": false,
    "lengthChange": false
  });

  $('#dataTable6').DataTable({
    responsive: true,
    "searching": false,
    "lengthChange": false,
    "columnDefs": [{
      "targets": 4,
      "orderable": false
      }]
  });

  $('#dataTable7').DataTable({
    responsive: true,
    "searching": false,
    "lengthChange": false,
    "columnDefs": [{
      "targets": 6,
      "orderable": false
      }]
  });
});

// $(document).ready(function(){
//   $('#gridCheck1').on('click',function(){
//     if ($('#gridCheck1').is(':checked')) {
//       $('input(type="time")').attr('disabled' , true);
//     } else {
//       $('input(type="time")').attr('disabled' , false);
//     }
//   });
// });  