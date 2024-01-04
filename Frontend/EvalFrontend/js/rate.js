const baseURL = " https://localhost:7146/api";
$(document).ready(function () {
  var table = $("#rateTbl").DataTable({
    ajax: {
      url: `${baseURL}/rates`,
      headers:{
        "Authorization":"Bearer "+localStorage.getItem("token")
      },
      dataSrc: "",
    },
    columns: [
      {
        data: null,
        render: function (data, type, row, meta) {
          return meta.row + 1;
        },
      },
      {
        data: "productName",
      },
      {
        data: "amount",
      },
      {
        data: "date",
        render: function (data) {
          var date = formatDate(data);
          return date;
        },
      },
      {
        data: "id",
        render: function (data) {
          return (
            "<button class='btn btn-link edit' data-toggle='modal' data-target='#editRateModal' data-rate-id=" +
            data +
            ">Edit</button>" +
            "<button class='btn btn-link delete' data-rate-id=" +
            data +
            ">Delete</button>"
          );
        },
      },
    ],
    columnDefs: [{ targets: [0, -1], searchable: false }],
    paging: true,
    info: true,
    language: {
      emptyTable: "No data available",
    },
    responsive: true,
    autoWidth: false,
  });

  const fillProductDD = function () {
    $.ajax({
      url: `${baseURL}/products`,
      method: "GET",
      headers:{
        "Authorization":"Bearer "+localStorage.getItem("token")
      },
      success: function (data) {
        var ddProduct = $("#ddProduct");
        ddProduct.empty(); // Clear existing options

        data.forEach(function (product) {
          ddProduct.append(
            '<option value="' + product.id + '">' + product.name + "</option>"
          );
        });
      },
      error: function (error) {
        console.error("Error fetching products:", error);
      },
    });
  };

  let deleteId;
  table.on("click", ".delete", function () {
    deleteId = $(this).attr("data-rate-id");
    $("#deleteRateModal").modal("show");
  });

  $("#confirmDeleteBtn").on("click", function (e) {
    e.preventDefault();
    $.ajax({
      url: `${baseURL}/rates/` + deleteId,
      method: "DELETE",
      headers:{
        "Authorization":"Bearer "+localStorage.getItem("token")
      },
      success: function () {
        $("#deleteRateModal").modal("hide");
        $("#deleteSuccessModal").modal("show");
        table.ajax.reload();
      },
      error: function () {
        console.log(error);
      },
    });
  });

  $("#editRateModal").on("hidden.bs.modal", function () {
    clearFields();
  });

  var clearFields = function () {
    $("#ddProduct").removeClass("input-validation-error");
    $("#txtAmount").removeClass("input-validation-error");
    $("#rateDate").removeClass("input-validation-error");
    $(".field-validation-error").remove();
    $("#ddProduct").removeClass("input-validation-success");
    $("#txtAmount").removeClass("input-validation-success");
    $("#rateDate").removeClass("input-validation-success");
    $(".field-validation-success").remove();
  };

  table.on("click", ".edit", function () {
    fillProductDD();
    editId = $(this).attr("data-rate-id");
    console.log(editId);
    $.ajax({
      url: `${baseURL}/rates/${editId}`,
      method: "GET",
      headers:{
        "Authorization":"Bearer "+localStorage.getItem("token")
      },
      success: function (data) {
        console.log(data);
        $("#ddProduct").val(data.productId);
        $("#txtAmount").val(data.amount);
        $("#rateDate").val(data.date.substring(0, 10));
      },
      error: function (error) {
        console.error("Something went wrong", error);
      },
    });
  });
  $("#editRateForm").submit(function (e) {
    e.preventDefault();
    clearFields();
    if (!validate()) {
      return;
    }
    var newProduct = $("#ddProduct").val();
    var newDate = $("#rateDate").val();

    var dataVar = {
      productId: newProduct,
      date: newDate,
      amount: $("#txtAmount").val(),
    };
    console.log(dataVar);
    $.ajax({
      url: `${baseURL}/rates/${editId}`,
      type: "PUT",
      headers: {
        "Content-Type": "application/json", "Authorization":"Bearer "+localStorage.getItem("token")
      },
      data: JSON.stringify(dataVar),
      success: function (response) {
        $("#ddProduct").addClass("input-validation-success");
        $("#txtAmount").addClass("input-validation-success");
        $("#rateDate").addClass("input-validation-success");
        $("#msg").after(
          `<span class="field-validation-success">Rate edited successfully!</span>`
        );
        table.ajax.reload();
      },
      error: function (xhr, textStatus, errorThrown) {
        if (xhr.status === 409) {
          $("#ddProduct").addClass("input-validation-error");
          $("#txtAmount").addClass("input-validation-error");
          $("#rateDate").addClass("input-validation-error");
          $("#msg").after(
            `<span class="field-validation-error">${xhr.responseText}</span>`
          );
        } else {
          alert("An error occurred: " + errorThrown);
        }
      },
    });
  });
  fillProductDD();

  $("#addRateForm").submit(function (e) {
    e.preventDefault();
    clearFields();
    if (!validate()) {
      return;
    }
    var newProduct = $("#ddProduct").val();
    var newDate = $("#rateDate").val();

    var dataVar = {
      productId: newProduct,
      date: newDate,
      amount: $("#txtAmount").val(),
    };
    console.log(dataVar);
    $.ajax({
      url: `${baseURL}/rates`,
      type: "POST",
      headers: {
        "Content-Type": "application/json", "Authorization":"Bearer "+localStorage.getItem("token")
      },
      data: JSON.stringify(dataVar),
      success: function (response) {
        $("#ddProduct").addClass("input-validation-success");
        $("#txtAmount").addClass("input-validation-success");
        $("#rateDate").addClass("input-validation-success");
        $("#msg").after(
          `<span class="field-validation-success">Rate added successfully!</span>`
        );
        table.ajax.reload();
      },
      error: function (xhr, textStatus, errorThrown) {
        if (xhr.status === 409) {
          $("#ddProduct").addClass("input-validation-error");
          $("#txtAmount").addClass("input-validation-error");
          $("#rateDate").addClass("input-validation-error");
          $("#msg").after(
            `<span class="field-validation-error">${xhr.responseText}</span>`
          );
        } else {
          alert("An error occurred: " + errorThrown);
        }
      },
    });
  });

  const validate = function () {
    $(".field-validation-error").remove();

    let isValid = true;

    let amount = $("#txtAmount").val();
    console.log(amount == 0);
    var regex = /^(0*[1-9]\d*(\.\d+)?|0*\.\d*[1-9]\d*)$/;
    if (!amount) {
      isValid = false;
      $("#txtAmount").addClass("input-validation-error");
      $("#txtAmount").after(
        '<span class="field-validation-error">Please enter a rate.</span>'
      );
    } else if (!regex.test(amount) || amount == 0) {
      isValid = false;
      $("#txtAmount").addClass("input-validation-error");
      $("#txtAmount").after(
        '<span class="field-validation-error">Rate should be greater than zero</span>'
      );
    } else {
      $("#txtAmount").removeClass("input-validation-error");
    }

    return isValid;
  };
});
