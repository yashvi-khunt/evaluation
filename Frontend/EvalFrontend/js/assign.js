const baseURL = " https://localhost:7146/api";

$(document).ready(function () {
  var table = $("#mappingTbl").DataTable({
    ajax: {
      url: `${baseURL}/mappings`,
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
        data: "manufacturerName",
      },
      {
        data: "productName",
      },
      {
        data: "id",
        render: function (data, type, party) {
          return (
            "<button class='btn btn-link edit' data-toggle='modal' data-target='#editAssignModal' data-mapping-id=" +
            data +
            ">Edit</button>" +
            "<button class='btn btn-link delete' data-mapping-id=" +
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

  const fillPartyDD = function () {
    $.ajax({
      url: `${baseURL}/manufacturers`,
      method: "GET",
      success: function (data) {
        var ddParty = $("#ddParty");
        ddParty.empty();

        data.forEach(function (party) {
          ddParty.append(
            '<option value="' + party.id + '">' + party.name + "</option>"
          );
        });
      },
      error: function (error) {
        console.error("Error fetching parties:", error);
      },
    });
  };

  const fillProductDD = function () {
    $.ajax({
      url: `${baseURL}/products`,
      method: "GET",
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

  $("#editAssignModal").on("hidden.bs.modal", function () {
    clearFields();
  });

  var clearFields = function () {
    $("#ddParty").removeClass("input-validation-error");
    $("#ddProduct").removeClass("input-validation-error");
    $(".field-validation-error").remove();
    $("#ddParty").removeClass("input-validation-success");
    $("#ddProduct").removeClass("input-validation-success");
    $(".field-validation-success").remove();
  };

  let deleteId;
  table.on("click", ".delete", function () {
    deleteId = $(this).attr("data-mapping-id");
    $("#deleteAssignModal").modal("show");
  });

  $("#confirmDeleteBtn").on("click", function (e) {
    e.preventDefault();
    $.ajax({
      url: `${baseURL}/mappings/` + deleteId,
      method: "DELETE",
      success: function () {
        $("#deleteAssignModal").modal("hide");
        $("#deleteSuccessModal").modal("show");
        table.ajax.reload();
      },
      error: function () {
        console.log(error);
      },
    });
  });

  let editId;
  table.on("click", ".edit", function () {
    fillPartyDD();
    fillProductDD();
    editId = $(this).attr("data-mapping-id");
    $.ajax({
      url: `${baseURL}/mappings/${editId}`,
      method: "GET",
      success: function (data) {
        console.log(data);
        $("#ddParty").val(data.manufacturerId);
        $("#ddProduct").val(data.productId);
      },
      error: function (error) {
        console.error("Something went wrong", error);
      },
    });
  });

  $("#editMappingForm").submit(function (e) {
    e.preventDefault();
    clearFields();

    var newParty = $("#ddParty").val();
    var newProduct = $("#ddProduct").val();

    var dataVar = {
      manufacturerId: newParty,
      productId: newProduct,
    };
    $.ajax({
      url: `${baseURL}/mappings/${editId}`,
      type: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(dataVar),
      success: function (response) {
        $("#ddParty").addClass("input-validation-success");
        $("#ddProduct").addClass("input-validation-success");
        $("#msg").after(
          `<span class="field-validation-success">Mapping added successfully!</span>`
        );
        table.ajax.reload();
      },
      error: function (xhr, textStatus, errorThrown) {
        if (xhr.status === 409) {
          $("#ddParty").addClass("input-validation-error");
          $("#ddProduct").addClass("input-validation-error");

          $("#msg").after(
            `<span class="field-validation-error">${xhr.responseText}</span>`
          );
        } else {
          alert("An error occurred: " + errorThrown);
        }
      },
    });
  });

  fillPartyDD();
  fillProductDD();

  $("#addAssignForm").submit(function (e) {
    e.preventDefault();
    clearFields();
    var newParty = $("#ddParty").val();
    var newProduct = $("#ddProduct").val();
    var dataVar = {
      manufacturerId: newParty,
      productId: newProduct,
    };
    $.ajax({
      url: `${baseURL}/mappings`,
      type: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(dataVar),
      success: function (response) {
        $("#ddParty").addClass("input-validation-success");
        $("#ddProduct").addClass("input-validation-success");
        $("#msg").after(
          `<span class="field-validation-success">Mapping added successfully!</span>`
        );
      },
      error: function (xhr, textStatus, errorThrown) {
        if (xhr.status === 409) {
          $("#ddParty").addClass("input-validation-error");
          $("#ddProduct").addClass("input-validation-error");

          $("#msg").after(
            `<span class="field-validation-error">${xhr.responseText}</span>`
          );
        } else {
          alert("An error occurred: " + errorThrown);
        }
      },
    });
  });
});
