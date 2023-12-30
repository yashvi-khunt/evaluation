const baseURL = " https://localhost:7146/api";

// const editForm = document.getElementById('editForm');

// const mappingTBody = document.querySelector("#mappingTbl>tbody");
// let mappingId;

// const fillMappings = async function () {
//     mappingTBody.innerHTML = "";
//     const mappings = await getList(`${baseURL}/mappings`);

//     let html = "";
//     mappings.forEach((el) => {
//       html += `<tr>

//                 <td>${el.manufacturerName}</td>
//                 <td>${el.productName}</td>
//                 <td>
//                 <button id="${el.id}" class="btn btn-info mx-1 btn-sm edit" onclick='Edit(this)'>Edit</button>
//                 <button id="${el.id}" class="btn btn-danger mx-1 btn-sm delete" onclick='Delete(this)'>Delete</button>
//                 </td>
//                 </tr>`;
//     });

//     mappingTBody.insertAdjacentHTML("afterbegin", html);
//   };

//   const getList = async function (url, errorMsg = "Something went wrong") {
//     return fetch(url).then((response) => {
//       if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);
//       return response.json();
//     });
//   };

// function submitAddForm() {
//     // Get form data
//     let newParty = parseInt(document.getElementById("selParty").value);
//     let newProduct = parseInt(document.getElementById("selProduct").value);

//     console.log(typeof(newParty),newProduct);
//     //Send a POST request using Fetch API
//     fetch(`${baseURL}/mappings`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//             "manufacturerId": newParty,
//             "productId":newProduct ,
//         }),
//     })
//         .then((response) => response.json())
//         .then((data) => {
//             // Handle the response from the server
//             console.log("Success:", data);
//             window.location.pathname = "./AssignPage.html";
//         })
//         .catch((error) => {
//             console.error("Error:", error);
//         });

//         window.location.pathname = "./AssignPage.html";
// }

// function submitEditForm(){
//     let newParty = parseInt(document.getElementById("selParty").value);
//     let newProduct = parseInt(document.getElementById("selProduct").value);
//     // Send a POST request using Fetch API
//     fetch(`${baseURL}/mappings/${mappingId}`, {
//         method: 'PUT',
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//             "manufacturerId": newParty,
//             "productId":newProduct ,
//         }),
//     })
//         .then((response) => response.json())
//         .then((data) => {
//             // Handle the response from the server
//             console.log("Success:", data);
//             window.location.pathname = "./AssignPage.html";
//         })
//         .catch((error) => {
//             console.error("Error:", error);
//         });

//         window.location.pathname = "./AssignPage.html";
// }

// const fillForm = async function(){
//     const urlParams = new URLSearchParams(window.location.search);
//    mappingId = urlParams.get('id');

//    await fillDD();
//     let mapping = await getList(`${baseURL}/mappings/${mappingId}`);
//     console.log(mapping);

//     const partyMapping = document.getElementById('selParty');
//     partyMapping.value = mapping.manufacturerId;

//     const productMapping =  document.getElementById('selProduct');
//     productMapping.value = mapping.productId;
// }

// const fillDD = async function(){
//     const partyDD = document.getElementById('selParty');
//     const partyList = await getList(`${baseURL}/manufacturers`)
//     let html = ''
//     partyList.forEach(party => {
//         html += `
//         <option value="${party.id}">${party.name}</option>
//       `
//     })
//     partyDD.insertAdjacentHTML('afterbegin',html);

//     const productDD =  document.getElementById('selProduct');
//     const productList = await getList(`${baseURL}/products`)
//      html = ''
//     productList.forEach(product => {
//         html += `
//         <option value="${product.id}">${product.name}</option>
//       `
//     })
//     productDD.insertAdjacentHTML('afterbegin',html);
// }

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
            "<button class='btn btn-link edit' data-toggle='modal' data-target='#editPartyModal' data-party-id=" +
            data +
            ">Edit</button>" +
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
    deleteId = $(this).attr("data-party-id");
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
});

/*
const baseURL = " https://localhost:7146/api";

$(document).ready(function () {

  let editId;
  table.on("click", ".edit", function () {
    editId = $(this).attr("data-party-id");
    var partyName = $(this).attr("data-party-name");
    var txtParty = $("#partyName");
    txtParty.val(partyName);
  });

  

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
*/
