const baseURL = " https://localhost:7146/api";

// const txtPageSize = document.getElementById("txtPageSize");
// let pageSize = txtPageSize.value;
// let currPage = 1;
// let invoiceId, firstRate;
// let tableData = [];

// const getList = async function (url, errorMsg = "Something went wrong") {
//   return fetch(url).then((response) => {
//     if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);
//     return response.json();
//   });
// };

// const sortOpt = Object.freeze({
//   none: 0,
//   asc: 1,
//   desc: 2,
// });

// Array.prototype.swapFirstTwo = function () {
//   // Ensure the array has at least two elements
//   if (this.length >= 2) {
//     // Swap the first two elements
//     [this[0], this[1]] = [this[1], this[0]];
//   }
//   // Return the modified array for chaining
//   return this;
// };

// const fillTable = function (invoices) {
//   invoiceTBody.innerHTML = "";
//   let html = "";
//   invoices.forEach((el) => {
//     html += `<tr>
//                 <td>${el.invoiceId}</td>
//                  <td>${el.manufacturerName}</td>
//                  <td>${new Date(el.date)
//                    .toLocaleDateString()
//                    .split("/")
//                    .swapFirstTwo()
//                    .join("-")}</td>
//                 <td>
//                 <button class="btn btn-info mx-1 btn-sm view" data-invoice-id="${
//                   el.invoiceId
//                 }" >View Details</button>
//                 <button class="btn btn-danger mx-1 btn-sm delete" data-invoice-id="${
//                   el.invoiceId
//                 }" >Delete</button>
//                 </td>
//                 </tr>`;
//   });

//   invoiceTBody.insertAdjacentHTML("afterbegin", html);
// };

// const paginate = async function () {
//   const totalEntries = await fetch(`${baseURL}/invoices/count`).then(
//     (response) => {
//       if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);
//       return response.json();
//     }
//   );

//   let ulPage = document.getElementById("paginate");
//   let numOfPages = Math.ceil(totalEntries / pageSize);
//   let html = "<a href='#'>&laquo;</a> ";
//   for (let i = 1; i <= numOfPages; i++) {
//     html += `<a href="#" ${i === 1 ? 'class="active"' : ""}>${i}</a>`;
//   }
//   html += "<a href='#'>&raquo;</a>";

//   ulPage.insertAdjacentHTML("afterbegin", html);
// };
// paginate();
// txtPageSize.addEventListener("change", function () {
//   pageSize = txtPageSize.value;
// });

// $(document).ready(function () {
//   $(invoiceTable).on("click", ".delete", function () {
//     var button = $(this);
//     console.log(this);
//     $.ajax({
//       url: `${baseURL}/invoices/` + button.attr("data-invoice-id"),
//       method: "DELETE",
//       success: function () {
//         table.row(button.parents("tr")).remove().draw();
//       },
//     });
//   });

//   $(invoiceTable).on("click", ".view", function () {
//     var button = $(this);
//     var btnId = button.attr("data-invoice-id");

//     window.location.href = `ViewPurchaseHistory.html?id=${btnId}`;
//   });

//   $("#txtSearch").on("change keyup", function () {
//     // console.log($("#txtSearch").val());
//     var search = $("#txtSearch").val();
//     getTableData(search);
//     console.log(search, pageSize);
//   });

//   $("#paginate").on("click", "a", function () {
//     $("#paginate a.active").removeClass("active");
//     console.log(this);
//     $(this).addClass("active");
//     currPage = $(this).text();

//     getTableData();
//   });

//   const getTableData = function (search) {
//     var list;
//     $.ajax({
//       url: `${baseURL}/invoices/search?page=${currPage}&pageSize=${pageSize}&sort=0&subStr=${
//         search ? search : ""
//       }`,
//       method: "GET",
//       async: false,
//       success: function (data) {
//         list = data;
//       },
//     });
//     fillTable(list);
//   };
//   getTableData();
// });

$(document).ready(function () {
  var table = $("#invoiceTbl").DataTable({
    ajax: {
      url: `${baseURL}/invoices`,
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
        data: "invoiceId",
      },
      {
        data: "manufacturerName",
      },
      {
        data: "date",
        render: function (data) {
          var date = formatDate(data);
          return date;
        },
      },
      {
        data: "grandTotal",
      },
      {
        data: "id",
        render: function (data, type, invoice) {
          return `<button class="btn btn-link edit" data-toggle='modal' data-target='#editInvoiceModal' data-invoice-id="${invoice.invoiceId}" >Edit</button>
            <button class="btn btn-link view" data-invoice-id="${invoice.invoiceId}">View Details</button>
            <button class="btn btn-link delete" data-invoice-id="${invoice.invoiceId}" >Delete</button>`;
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
    deleteId = $(this).attr("data-invoice-id");
    $("#deleteInvoiceModal").modal("show");
  });

  $("#confirmDeleteBtn").on("click", function (e) {
    e.preventDefault();
    $.ajax({
      url: `${baseURL}/invoices/` + deleteId,
      method: "DELETE",
      success: function () {
        $("#deleteInvoiceModal").modal("hide");
        $("#deleteSuccessModal").modal("show");
        table.ajax.reload();
      },
      error: function () {
        console.log(error);
      },
    });
  });

  table.on("click", ".view", function () {
    var button = $(this);
    var btnId = button.attr("data-invoice-id");

    window.location.href = `ViewPurchaseHistory.html?id=${btnId}`;
  });

  const fillPartyDD = function (currId) {
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
        ddParty.val(currId);
      },
      error: function (error) {
        console.error("Error fetching parties:", error);
      },
    });
  };

  const fillProductDD = function (ddId, id, currId) {
    $.ajax({
      url: `${baseURL}/products/byManufacturer/${id}`,
      method: "GET",
      success: function (data) {
        var ddProduct = $(`#ddProduct${ddId}`);
        ddProduct.empty();
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

  function populateEditModal(data) {
    $("#editInvoiceForm").empty();
    const inputField = `<div class="form-group">
    <label for="partyName">Party</label>
    <select class="form-select" id="ddParty" name="party"></select>
</div>`;
    $("#editInvoiceForm").append(inputField);
    fillPartyDD(data[0].manufacturerId);
    data.forEach((item, index) => {
      const inputField = `<div class="form-group">
      <label class="" for="ddProduct">Product</label>
      <select class="form-select product" id="ddProduct${index}" name="product"></select>
                            </div>`;
      $("#editInvoiceForm").append(inputField);
      fillProductDD(index, item.manufacturerId, item.productId);
    });
  }

  table.on("click", ".edit", function () {
    var button = $(this);
    var btnId = button.attr("data-invoice-id");

    $.ajax({
      url: `${baseURL}/invoices/` + btnId,
      method: "GET",
      success: function (data) {
        console.log(data);
        populateEditModal(data);
      },
      error: function () {
        console.log(error);
      },
    });
  });

  // $("#editInvoiceForm").submit(function (e) {
  //   e.preventDefault();
  //   clearFields();
  //   var newParty = $("#ddParty").val();
  //   var newProduct = $("#ddProduct").val();

  //   var dataVar = {
  //     manufacturerId: newParty,
  //     productId: newProduct,
  //   };
  //   $.ajax({
  //     url: `${baseURL}/mappings/${editId}`,
  //     type: "PUT",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     data: JSON.stringify(dataVar),
  //     success: function (response) {
  //       $("#ddParty").addClass("input-validation-success");
  //       $("#ddProduct").addClass("input-validation-success");
  //       $("#msg").after(
  //         `<span class="field-validation-success">Mapping added successfully!</span>`
  //       );
  //       table.ajax.reload();
  //     },
  //     error: function (xhr, textStatus, errorThrown) {
  //       if (xhr.status === 409) {
  //         $("#ddParty").addClass("input-validation-error");
  //         $("#ddProduct").addClass("input-validation-error");

  //         $("#msg").after(
  //           `<span class="field-validation-error">${xhr.responseText}</span>`
  //         );
  //       } else {
  //         alert("An error occurred: " + errorThrown);
  //       }
  //     },
  //   });
  // });
});
