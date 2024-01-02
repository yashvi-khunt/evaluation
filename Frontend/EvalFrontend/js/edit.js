const baseURL = " https://localhost:7146/api";
let isAdd = false;
let partyId, invId, date, rateId;

$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const invoiceId = urlParams.get("id");

  // const getEditList = function (id) {
  //   $.ajax({
  //     type: "GET",
  //     url: `${baseURL}/invoices/${id}`,
  //     success: function (data) {
  //       // console.log(data)
  //       $("#dataTable tbody").empty();
  //       fillEditTable(data);
  //       fillProducts(data[0].manufacturerId);
  //     },
  //     error: function (error) {
  //       console.log(error);
  //     },
  //   });
  // };

  // const fillEditTable = function (invoices) {
  //   $.each(invoices, function (i, el) {
  //     const total = el.rateAmount * el.quantity;
  //     let newRow = $("<tr>");
  //     newRow.append("<td>" + el.productName + "</td>");
  //     // newRow.append('<td>' + manufacturer + '</td>');
  //     newRow.append("<td>" + el.rateAmount + "</td>");
  //     newRow.append("<td>" + el.quantity + "</td>");
  //     newRow.append("<td>" + total.toFixed(2) + "</td>");
  //     newRow.append(
  //       "<td>" +
  //         ` <button type="button" id="btnEditRow" class="btn text-info row-edit" data-row-id= ${el.id} data-row-product=${el.productId} data-quantity=${el.quantity}>Edit</button>
  //            <button type="button" class="btn text-danger row-delete" data-row-id= ${el.id}>Delete</button>` +
  //         "</td>"
  //     );

  //     $("#dataTable tbody").append(newRow);
  //     $("#lblInvoice").text(invoices[0].invoiceId);
  //     invId = invoices[0].invoiceId;
  //     $("#lblParty").text(invoices[0].manufacturerName);
  //     partyId = invoices[0].manufacturerId;
  //     $("#lblDate").text(formatDate(invoices[0].date));
  //     date = invoices[0].date;
  //   });
  // };
  // getEditList(invoiceId);
  // $("#editInvoiceForm").css("display", "none");
  // $("#btnSaveEdit").css("display", "none");

  let deleteInlineId, deleteInlinebtn;
  $("#dataTable").on("click", ".row-delete", function () {
    deleteInlinebtn = $(this);
    deleteInlineId = $(this).attr("data-row-id");
    $("#deleteEditInvoiceModal").modal("show");
  });

  $("#confirmEditDeleteBtn").on("click", function (e) {
    e.preventDefault();
    $.ajax({
      url: `${baseURL}/invoices/` + deleteId,
      method: "DELETE",
      success: function () {
        $("#deleteEditInvoiceModal").modal("hide");
        $("#deleteEditSuccessModal").modal("show");
        deletebtn.parents("tr").remove();
      },
      error: function () {
        console.log(error);
      },
    });
  });

  // const fillProducts = function (partyId) {
  //   $.ajax({
  //     type: "GET",
  //     url: `${baseURL}/products/byInvoice/${partyId}`,
  //     success: function (data) {
  //       // console.log(data)
  //       $("#ddProduct").empty();
  //       $.each(data, function (index, item) {
  //         $("#ddProduct").append(
  //           '<option value="' + item.id + '">' + item.name + "</option>"
  //         );
  //       });
  //       console.log(data[0].id);
  //       changeRate(data[0].id);
  //     },
  //     error: function (error) {
  //       console.log(error);
  //     },
  //   });
  // };

  // $("#ddProduct").on("change", function () {
  //   const productId = $("#ddProduct").val();
  //   changeRate(productId);
  // });

  // const changeRate = function (productId) {
  //   $.ajax({
  //     type: "GET",
  //     url: `${baseURL}/rates/byProduct/${productId}`,
  //     success: function (result) {
  //       console.log(result);
  //       $("#txtRate").val("");
  //       $("#txtRate").val(result.amount);
  //       rateId = result.id;
  //     },
  //     error: function (error) {
  //       console.log(error);
  //     },
  //   });
  // };

  // let editInlineId;
  // $("#dataTable").on("click", ".row-edit", function () {
  //   editInlineId = $(this).attr("data-row-id");
  //   $("#editInvoiceForm").css("display", "inline");
  //   $("#btnSaveEdit").css("display", "inline");
  //   const product = $(this).attr("data-row-product");
  //   console.log(product);

  //   $("#ddProduct").val(product);
  //   $("#txtQuantity").val($(this).attr("data-quantity"));
  // });

  // $("#btnSaveEdit").on("click", function () {
  //   let dataVar = {
  //     invoiceId: invId,
  //     manufacturerId: partyId,
  //     productId: parseInt($("#ddProduct").val()),
  //     rateId: rateId,
  //     quantity: parseInt($("#txtQuantity").val()),
  //     date: date,
  //   };
  //   console.log(dataVar);
  //   $.ajax({
  //     url: `${baseURL}/invoices/${isAdd ? "" : editInlineId}`,
  //     type: `${isAdd ? "POST" : "PUT"}`,
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     data: JSON.stringify(dataVar),
  //     success: function (response) {
  //       getList(invoiceId);
  //       if (isAdd) {
  //         $("#addEditSuccessModal").modal("show");
  //       } else {
  //         $("#editEditSuccessModal").modal("show");
  //       }
  //       $("#editInvoiceForm").css("display", "none");
  //       $("#btnSaveEdit").css("display", "none");
  //       isAdd = false;
  //     },
  //     error: function (xhr, textStatus, errorThrown) {
  //       console.log("An error occurred: " + errorThrown);
  //     },
  //   });
  // });

  // $("#btnAddProduct").on("click", function () {
  //   $("#editInvoiceForm").css("display", "inline");
  //   $("#btnSaveEdit").css("display", "inline");
  //   isAdd = true;
  // });
});
