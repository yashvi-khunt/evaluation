document.addEventListener("DOMContentLoaded", function () {
  const currentActive = document.querySelector(".navbar-nav .nav-link.active");
  currentActive.classList.remove("active");

  const currentPage = window.location.pathname.split("/").pop();
  const currentLink = document.querySelector(
    `.navbar-nav .nav-link[href="./${currentPage}"]`
  );
  if (currentLink) {
    currentLink.classList.add("active");
  }
});

$(document).ready(function () {
  // Add a click event handler to the navbar toggle button
  $(".navbar-toggler").on("click", function () {
    // Toggle the 'navbar-expanded' class on the navbar when the button is clicked
    $(".navbar").toggleClass("navbar-expanded");
  });
});

const formatDate = function (date) {
  var newDate = new Date(date);
  return newDate.toLocaleDateString("en-GB").split("/").join("-");
};
