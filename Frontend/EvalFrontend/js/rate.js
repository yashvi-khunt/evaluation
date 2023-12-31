const baseURL = " https://localhost:7146/api";

// const rateTBody = document.querySelector("#rateTbl>tbody");
// let rateId;

// const getList = async function (url, errorMsg = "Something went wrong") {
//   return fetch(url).then((response) => {
//     if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);
//     return response.json();
//   });
// };

// const fillRates = async function () {
//     rateTBody.innerHTML = "";
//     const rates = await getList(`${baseURL}/rates`);
//     console.log(rates);
//     let html = "";

//     rates.forEach((el) => {
//       html += `<tr>
//                 <td>${el.productName}</td>
//                  <td>${el.amount}</td>
//                  <td>${new Date(el.date).toLocaleDateString()}</td>
//                 <td>
//                 <button id="${
//                   el.id
//                 }" class="btn btn-info mx-1 btn-sm edit" onclick='Edit(this)'>Edit</button>
//                 <button id="${
//                   el.id
//                 }" class="btn btn-danger mx-1 btn-sm delete" onclick='Delete(this)'>Delete</button>
//                 </td>
//                 </tr>`;
//     });

//     rateTBody.insertAdjacentHTML("afterbegin", html);
//   };

// function submitAddForm() {
//     const pName = parseInt(document.getElementById('productName').value);
//     const txtAmount = parseInt(document.getElementById('Rate_Amount').value)
//     const date = document.getElementById('Ratedate').value;
//     // Get form data
//     console.log(pName,txtAmount,date);
//     fetch(`${baseURL}/rates`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//             "amount": txtAmount,
//             "date": date,
//             "productId": pName,
//         }),
//     })
//         .then((response) => response.json())
//         .then((data) => {
//             // Handle the response from the server
//             console.log("Success:", data);
//             window.location.pathname = "./Rate.html";
//         })
//         .catch((error) => {
//             console.error("Error:", error);
//         });

//         window.location.pathname = "./Rate.html";
// }

// function submitEditForm() {
//     const pName = parseInt(document.getElementById('productName').value);
//     const txtAmount = parseInt(document.getElementById('Rate_Amount').value)
//     const date = document.getElementById('Ratedate').value;
//     // Get form data
//     console.log(pName,txtAmount,date);
//     fetch(`${baseURL}/rates/${rateId}`, {
//         method: "PUT",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//             "amount": txtAmount,
//             "date": date,
//             "productId": pName,
//         }),
//     })
//         .then((response) => response.json())
//         .then((data) => {
//             // Handle the response from the server
//             console.log("Success:", data);
//             window.location.pathname = "./Rate.html";
//         })
//         .catch((error) => {
//             console.error("Error:", error);
//         });

//         window.location.pathname = "./Rate.html";
// }

//   const fillDD = async function(){
//     const productDD = document.getElementById("productName");
//     const productList = await getList(`${baseURL}/products`)
//      html = ''
//     productList.forEach(product => {
//         html += `
//         <option value="${product.id}">${product.name}</option>
//       `
//     })
//     productDD.insertAdjacentHTML('afterbegin',html);
//   }

//   const fillForm = async function(){
//     const urlParams = new URLSearchParams(window.location.search);
//    rateId = urlParams.get('id');

//    await fillDD();
//     let rateObj = await getList(`${baseURL}/rates/${rateId}`);
//     console.log(rateObj);

//     const productMapping =  document.getElementById('productName');
//     productMapping.value = rateObj.productId;
//     const txtAmount = document.getElementById('Rate_Amount');
//     txtAmount.value = rateObj.amount;
//     const dateVar = document.getElementById('Ratedate');
//     dateVar.value = rateObj.date.split("T")[0];
// }

$(document).ready(function () {
  var table = $("#rateTbl").DataTable({
    ajax: {
      url: `${baseURL}/rates`,
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
        "Content-Type": "application/json",
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
        "Content-Type": "application/json",
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
