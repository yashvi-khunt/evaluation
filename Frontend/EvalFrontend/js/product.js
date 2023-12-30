const baseURL = " https://localhost:7146/api";

$(document).ready(function () {
  var table = $("#productTbl").DataTable({
    ajax: {
      url: `${baseURL}/products`,
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
        data: "name",
      },
      {
        data: "id",
        render: function (data, type, product) {
          return (
            "<button class='btn btn-link edit' data-toggle='modal' data-target='#editProductModal' data-product-id=" +
            data +
            ' data-product-name="' +
            product.name +
            '">Edit</button>' +
            "<button class='btn btn-link delete' data-product-id=" +
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

  let deleteId;
  table.on("click", ".delete", function () {
    deleteId = $(this).attr("data-product-id");
    $("#deleteProductModal").modal("show");
  });

  $("#confirmDeleteBtn").on("click", function (e) {
    e.preventDefault();
    $.ajax({
      url: `${baseURL}/products/` + deleteId,
      method: "DELETE",
      success: function () {
        $("#deleteProductModal").modal("hide");
        $("#deleteSuccessModal").modal("show");
        // Swal.fire("Deleted!", "Your item has been deleted.", "success");
        table.ajax.reload();
      },
      error: function () {
        console.log(error);
      },
    });
  });
  let editId;
  table.on("click", ".edit", function () {
    editId = $(this).attr("data-product-id");
    var productName = $(this).attr("data-product-name");
    var txtProduct = $("#productName");
    txtProduct.val(productName);
  });

  $("#editProductModal").on("hidden.bs.modal", function () {
    clearFields();
  });

  var clearFields = function () {
    $("#productName").removeClass("input-validation-error");
    $(".field-validation-error").remove();
    $("#productName").removeClass("input-validation-success");
    $(".field-validation-success").remove();
  };

  $("#editProductForm").submit(function (e) {
    e.preventDefault();
    clearFields();
    if (!validate()) {
      return;
    }
    var newProduct = $("#productName").val();
    console.log(newProduct);
    var dataVar = {
      name: newProduct,
    };
    $.ajax({
      url: `${baseURL}/products/${editId}`,
      type: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(dataVar),
      success: function (response) {
        $("#productName").addClass("input-validation-success");
        $("#productName").after(
          `<span class="field-validation-success">Product edited successfully!</span>`
        );
        table.ajax.reload();
      },
      error: function (xhr, textStatus, errorThrown) {
        if (xhr.status === 409) {
          $("#productName").addClass("input-validation-error");
          $("#productName").after(
            `<span class="field-validation-error">${xhr.responseText}</span>`
          );
        } else {
          alert("An error occurred: " + errorThrown);
        }
      },
    });
  });

  $("#addProductForm").submit(function (e) {
    e.preventDefault();
    clearFields();
    if (!validate()) {
      return;
    }
    var newProduct = $("#productName").val();
    console.log(newProduct);
    var dataVar = {
      name: newProduct,
    };
    $.ajax({
      url: `${baseURL}/products`,
      type: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(dataVar),
      success: function (response) {
        $("#productName").addClass("input-validation-success");
        $("#productName").after(
          `<span class="field-validation-success">Product added successfully!</span>`
        );
        table.ajax.reload();
      },
      error: function (xhr, textStatus, errorThrown) {
        if (xhr.status === 409) {
          $("#productName").addClass("input-validation-error");
          $("#productName").after(
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

    let productName = $("#productName").val();
    var regex = /^[A-Za-z0-9\s]+$/;
    if (!productName) {
      isValid = false;
      $("#productName").addClass("input-validation-error");
      $("#productName").after(
        '<span class="field-validation-error">Please enter a name.</span>'
      );
    } else if (!regex.test(productName)) {
      isValid = false;
      $("#productName").addClass("input-validation-error");
      $("#productName").after(
        '<span class="field-validation-error">Name can contain only numbers and alphabets</span>'
      );
    } else {
      $("#ddProduct").removeClass("input-validation-error");
    }

    return isValid;
  };
});
