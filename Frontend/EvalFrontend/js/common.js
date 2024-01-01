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

  //login-signup
  if (!localStorage.getItem("token")) {
    window.location.href = "./Login.html";
  }
});
function login() {
  // Perform authentication logic (you'll need to replace this with your actual authentication logic)
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Assume a successful login for simplicity (you should handle errors in a real implementation)
  const token = "your_generated_token";

  // Store the token in local storage
  localStorage.setItem("token", token);

  // Show authenticated content
  showAuthenticatedContent();
}

$(document).ready(function () {
  $(".navbar-toggler").on("click", function () {
    $(".navbar").toggleClass("navbar-expanded");
  });
});

const formatDate = function (date) {
  var newDate = new Date(date);
  return newDate.toLocaleDateString("en-GB").split("/").join("-");
};

$("#signOutBtn").on("click", function () {
  localStorage.removeItem("token");
  window.location.href = "./Login.html";
});
