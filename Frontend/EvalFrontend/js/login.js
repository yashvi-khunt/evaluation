const baseURL = " https://localhost:7146/api";

$(document).ready(function () {
  function isPasswordValid(password) {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
    return passwordRegex.test(password);
  }

  $("#loginForm").submit(function (e) {
    $("#username").removeClass("input-validation-error");
    $("#password").removeClass("input-validation-error");
    $(".field-validation-error").remove();
    e.preventDefault();

    $("#username").removeClass("input-validation-error");
    $("#password").removeClass("input-validation-error");
    $(".field-validation-error").remove();

    const uname = $("#username").val();
    const pwd = $("#password").val();
    if (!isPasswordValid(pwd)) {
      $("#password").addClass("input-validation-error");
      $("#msg").after(
        "<span class='field-validation-error'>Password must be at least 8-16 characters long and include at least one letter and one number.</span>"
      );
      return;
    }

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

  $("#signupForm").submit(function (e) {
    $(".field-validation-error").remove();
    $(".field-validation-success").remove();
    $("#cfpassword").removeClass("input-validaiton-error");
    $("#password").removeClass("input-validation-error");

    e.preventDefault();
    const uname = $("#username").val();
    const pwd = $("#password").val();
    const cfPwd = $("#cfpassword").val();

    if (!isPasswordValid(pwd)) {
      $("#password").addClass("input-validation-error");
      $("#msg").after(
        "<span class='field-validation-error'>Password must be at least 8-16 characters long and include at least one letter and one number.</span>"
      );
      return;
    }

    if (pwd !== cfPwd) {
      $("#cfpassword").addClass("input-validation-error");
      $("#msg").after(
        "<span class='field-validation-error'>Passwords do not match</span>"
      );
      return;
    }

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
        if (xhr.status === 409) {
          $("#msg").after(
            `<span class="field-validation-error">${xhr.responseText}</span>`
          );
        }
        console.error("Error:", error);
      },
    });
  });
});
