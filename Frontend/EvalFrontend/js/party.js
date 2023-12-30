const baseURL = " https://localhost:7146/api";

$(document).ready(function () {
  var table = $("#partyTbl").DataTable({
    ajax: {
      url: `${baseURL}/manufacturers`,
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
        render: function (data, type, party) {
          return (
            "<button class='btn btn-link edit' data-toggle='modal' data-target='#editPartyModal' data-party-id=" +
            data +
            ' data-party-name="' +
            party.name +
            '">Edit</button>' +
            "<button class='btn btn-link delete' data-party-id=" +
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
    deleteId = $(this).attr("data-party-id");
    $("#deletePartyModal").modal("show");
  });

  $("#confirmDeleteBtn").on("click", function (e) {
    e.preventDefault();
    $.ajax({
      url: `${baseURL}/manufacturers/` + deleteId,
      method: "DELETE",
      success: function () {
        $("#deletePartyModal").modal("hide");
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
    editId = $(this).attr("data-party-id");
    var partyName = $(this).attr("data-party-name");
    var txtParty = $("#partyName");
    txtParty.val(partyName);
  });

  $("#editPartyModal").on("hidden.bs.modal", function () {
    clearFields();
  });

  var clearFields = function () {
    $("#partyName").removeClass("input-validation-error");
    $(".field-validation-error").remove();
    $("#partyName").removeClass("input-validation-success");
    $(".field-validation-success").remove();
  };

  $("#editPartyForm").submit(function (e) {
    e.preventDefault();
    clearFields();
    if (!validate()) {
      return;
    }
    var newParty = $("#partyName").val();
    console.log(newParty);
    var dataVar = {
      name: newParty,
    };
    $.ajax({
      url: `${baseURL}/manufacturers/${editId}`,
      type: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(dataVar),
      success: function (response) {
        $("#partyName").addClass("input-validation-success");
        $("#partyName").after(
          `<span class="field-validation-success">Party edited successfully!</span>`
        );
        table.ajax.reload();
      },
      error: function (xhr, textStatus, errorThrown) {
        if (xhr.status === 409) {
          $("#partyName").addClass("input-validation-error");
          $("#partyName").after(
            `<span class="field-validation-error">${xhr.responseText}</span>`
          );
        } else {
          alert("An error occurred: " + errorThrown);
        }
      },
    });
  });

  $("#addPartyForm").submit(function (e) {
    e.preventDefault();
    clearFields();
    if (!validate()) {
      return;
    }
    var newParty = $("#partyName").val();
    console.log(newParty);
    var dataVar = {
      name: newParty,
    };
    $.ajax({
      url: `${baseURL}/manufacturers`,
      type: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(dataVar),
      success: function (response) {
        $("#partyName").addClass("input-validation-success");
        $("#partyName").after(
          `<span class="field-validation-success">Party added successfully!</span>`
        );
        table.ajax.reload();
      },
      error: function (xhr, textStatus, errorThrown) {
        if (xhr.status === 409) {
          $("#partyName").addClass("input-validation-error");
          $("#partyName").after(
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

    let partyName = $("#partyName").val();
    var regex = /^[A-Za-z0-9\s]+$/;

    if (!partyName) {
      isValid = false;
      $("#partyName").addClass("input-validation-error");
      $("#partyName").after(
        '<span class="field-validation-error">Please enter a name.</span>'
      );
    } else if (!regex.test(partyName)) {
      isValid = false;
      $("#partyName").addClass("input-validation-error");
      $("#partyName").after(
        '<span class="field-validation-error">Name can contain only numbers and alphabets</span>'
      );
    } else {
      $("#ddParty").removeClass("input-validation-error");
    }

    return isValid;
  };
});
