const baseURL = " https://localhost:7146/api";

$(document).ready(function () {
  $("#username").removeClass("input-validation-error");
  $("#password").removeClass("input-validation-error");
  $(".field-validation-error").remove();

  $("#loginForm").submit(function (e) {
    e.preventDefault();

    $("#username").removeClass("input-validation-error");
    $("#password").removeClass("input-validation-error");
    $(".field-validation-error").remove();

    const uname = $("#username").val();
    const pwd = $("#password").val();

    const dataVar = {
      userName: uname,
      passwordHash: pwd,
    };

    $.ajax({
      type: "POST",
      url: `${baseURL}/login`,
      contentType: "application/json",
      data: JSON.stringify(dataVar),
      success: function (response) {
        const token = response.token;

        localStorage.setItem("token", token);
        localStorage.setItem("userName", dataVar.userName);
        location.href = "index.html";
        console.log("localstorage", localStorage.getItem("token"));
        console.log("localstorage", localStorage.getItem("userName"));
      },
      error: function (xhr, status, error) {
        if (xhr.status === 401) {
          $("#username").addClass("input-validation-error");
          $("#password").addClass("input-validation-error");
          $("#msg").after(
            `<span class="field-validation-error">Invalid Credentials</span>`
          );
        }
      },
    });
  });

  $(document).ready(function () {
    $("#signupForm").submit(function (event) {
      event.preventDefault();
      const uname = $("#username").val();
      const pwd = $("#password").val();

      const dataVar = {
        userName: uname,
        passwordHash: pwd,
      };
      $.ajax({
        type: "POST",
        url: `${baseURL}/register`,
        contentType: "application/json",
        data: JSON.stringify(dataVar),
        success: function (response) {
          window.location.href = "./Login.html";
        },
        error: function (xhr, status, error) {
          console.error("Error:", error);
        },
      });
    });
  });
});
