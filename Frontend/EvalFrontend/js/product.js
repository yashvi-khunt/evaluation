const baseURL = " https://localhost:7146/api";

// const productTBody = document.querySelector("#productTbl>tbody");
// let productId;

// const fillProducts = async function () {
//     productTBody.innerHTML = "";
//     const products = await getList(`${baseURL}/products`);

//     let html = "";

//     products.forEach((el) => {
//       html += `<tr>
//                 <td>${el.name}</td>
//                 <td>
//                 <button id="${el.id}" class="btn btn-info mx-1 btn-sm edit" onclick='Edit(this)'>Edit</button>
//                 <button id="${el.id}" class="btn btn-danger mx-1 btn-sm delete" onclick='Delete(this)'>Delete</button>
//                 </td>
//                 </tr>`;
//     });

//     productTBody.insertAdjacentHTML("afterbegin", html);
//   };

//   const getList = async function (url, errorMsg = "Something went wrong") {
//     return fetch(url).then((response) => {
//       if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);
//       return response.json();
//     });
//   };

// function submitAddForm() {
//     // Get form data
//     let newName = document.getElementById("product_Name").value;
//     // Send a POST request using Fetch API
//     fetch(`${baseURL}/products`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//             "name": newName,
//         }),
//     })
//         .then((response) => response.json())
//         .then((data) => {
//             // Handle the response from the server
//             console.log("Success:", data);
//             window.location.pathname = "./Product.html";
//         })
//         .catch((error) => {
//             console.error("Error:", error);
//         });

//     window.location.pathname = "./Product.html";
// }

// function submitEditForm(){
//     let newName = document.getElementById("product_Name").value;
//     // Send a POST request using Fetch API
//     fetch(`${baseURL}/products/${productId}`, {
//         method: 'PUT',
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//             "name": newName,
//         }),
//     })
//         .then((response) => response.json())
//         .then((data) => {
//             // Handle the response from the server
//             console.log("Success:", data);
//             window.location.pathname = "./Product.html";
//         })
//         .catch((error) => {
//             console.error("Error:", error);
//         });

//     window.location.pathname = "./Product.html";
// }

// const fillForm = async function(){
//     const urlParams = new URLSearchParams(window.location.search);
//    productId = urlParams.get('id');

//     let product = await getList(`${baseURL}/products/${productId}`);
//     console.log(product);

//     const txtProduct = document.getElementById('product_Name');
//     txtProduct.value = product.name;
// }

// $(document).ready(function () {
//   var table = $("#productTbl").DataTable({
//     ajax: {
//       url: `${baseURL}/products`,
//       dataSrc: "",
//     },
//     columns: [
//       {
//         data: null,
//         render: function (data, type, row, meta) {
//           return meta.row + 1;
//         },
//       },
//       {
//         data: "name",
//       },
//       {
//         data: "id",
//         render: function (data) {
//           return (
//             "<button class='btn btn-link edit' data-customer-id=" +
//             data +
//             ">Edit</button>" +
//             "<button class='btn btn-link delete' data-customer-id=" +
//             data +
//             ">Delete</button>"
//           );
//         },
//       },
//     ],
//     columnDefs: [{ targets: [0, -1], searchable: false }],
//     paging: true,
//     info: true,
//     language: {
//       emptyTable: "No data available",
//     },
//     responsive: true,
//     autoWidth: false,
//   });

//   table.on("click", ".delete", function () {
//     var button = $(this);
//     bootbox.confirm(
//       "Are you sure you want to delete this product?",
//       function (result) {
//         if (!result) {
//           return;
//         }
//         $.ajax({
//           url: `${baseURL}/products/` + button.attr("data-customer-id"),
//           method: "DELETE",
//           success: function () {
//             table.row(button.parents("tr")).remove().draw();
//           },
//         });
//       }
//     );
//   });

//   table.on("click", ".edit", function () {
//     // var id = $(this).attr("data - customer - id");
//     // window.location.href = `EditManufacturer.html?id=${id}`;
//   });
// });

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
