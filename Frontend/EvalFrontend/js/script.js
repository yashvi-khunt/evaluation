$(document).ready(function () {
  let tableData = [];
  let isEdit = false;
  let editRowId;

  const fillProducts = function (partyId) {
    $.ajax({
      type: "GET",
      url: `${baseURL}/products/byManufacturer/${partyId}`,
      success: function (data) {
        // console.log(data)
        $("#ddProduct").empty();
        $.each(data, function (index, item) {
          $("#ddProduct").append(
            '<option value="' + item.id + '">' + item.name + "</option>"
          );
        });

        changeRate(data[0].id);
      },
      error: function (error) {
        console.log(error);
      },
    });
  };

  const changeRate = function (productId) {
    $.ajax({
      type: "GET",
      url: `${baseURL}/rates/byProduct/${productId}`,
      success: function (result) {
        // console.log(result);
        $("txtRate").val("");
        $("#txtRate").val(result.amount);
        tempRate = result.id;
        // console.log(tempRate)
      },
      error: function (error) {
        console.log(error);
      },
    });
  };

  //get invoice id
  const getInvoiceId = function () {
    let invId;
    $.ajax({
      type: "GET",
      url: `${baseURL}/invoices/invoiceId`,
      async: false,
      success: function (result) {
        invId = result.invoiceId + 1;
        // console.log(invId);
      },
      error: function (error) {
        console.log(error);
      },
    });
    return invId;
  };

  //initial state of fields

  // $("#divRate").css("display", "none");
  $("#dataDiv").css("display", "none");
  $("#txtRate").prop("disabled", true);
  let tempRate;

  // ---- On Change of Manufacturer DropDown
  $("#ddParty").change(function () {
    let manufacturerId = $(this).val();
    $("#ddProduct").prop("disabled", false);
    fillProducts(manufacturerId);
  });

  //  ----On change of Product DropDown
  $("#ddProduct").change(function () {
    // $("#divRate").css("display", "inline");
    let productId = $(this).val();
    changeRate(productId);
  });

  const postData = function (obj) {
    $.ajax({
      type: "POST",
      url: `${baseURL}/invoices`,
      contentType: "application/json",
      data: JSON.stringify(obj),
      success: function (result) {
        console.log(result, "success");
        // console.log(invId);
      },
      error: function (error) {
        console.log(error);
      },
    });
  };

  const EditData = function () {
    var newData = {
      id: editRowId,
      invoiceId: $("#lblInvoice").val(),
      manufacturerId: $("#ddParty").val(),
      productId: $("#ddProduct").val(),
      rateId: tempRate ? parseInt(tempRate) : firstRate,
      rateAmt: $("#txtRate").val(),
      date: $("#txtDate").val(),
      quantity: parseInt($("#txtQuantity").val()),
    };

    tableData.push(newData);

    let product = $("#ddProduct option:selected").text();
    let total = parseFloat(newData.rateAmt) * parseInt(newData.quantity);
    console.log($("#ddParty"));
    let newRow = $("<tr>");
    newRow.append("<td>" + product + "</td>");
    // newRow.append('<td>' + manufacturer + '</td>');
    newRow.append("<td>" + newData.rateAmt + "</td>");
    newRow.append("<td>" + newData.quantity + "</td>");
    newRow.append("<td>" + total.toFixed(2) + "</td>");
    newRow.append(
      "<td>" +
        ` <button type="button" id="btnEditRow" class="btn text-info row-edit" data-row-id= ${newData.id}>Edit</button>
    		   <button type="button" class="btn text-danger row-delete" data-row-id= ${newData.id}>Delete</button>` +
        "</td>"
    );

    $("#dataTable tbody").append(newRow);

    isEdit = false;
  };

  $("#dataTable").on("click", ".row-edit", function () {
    isEdit = true;
    var button = $(this);
    var rowId = button.attr("data-row-id");
    editRowId = rowId;

    var row = tableData.find((obj) => obj.id == rowId);

    $("#ddParty").val(row.manufacturerId);
    $("#ddProduct").val(row.productId);
    $("#txtRate").val(row.rateAmt);
    $("#txtQuantity").val(row.quantity);

    button.closest("tr").remove();
  });

  $("#dataTable").on("click", ".row-delete", function () {
    var button = $(this);
    var rowId = button.attr("data-row-id");

    var row = tableData.find((obj) => obj.id == rowId);
    tableData = tableData.filter((obj) => obj.id != rowId);
    console.log(tableData);

    button.closest("tr").remove();
  });

  $("#btnCloseInvoice").click(function () {
    $.each(tableData, function (index, item) {
      postData(item);
    });
    window.location.pathname = "./PurchaseHistory.html";
  });

  let count = 0;
  $("#btnGenerateInvoice").click(function () {
    if (isEdit) {
      EditData();
    } else {
      //generate invoiceId
      let invioceNum = getInvoiceId();
      // getInvoiceId();

      //validate all input fields
      if (validateForm()) {
        count++;
        //disable UserName,date field and change btn text to "Add to invoice"
        $("#ddParty").prop("disabled", true);
        $("#txtDate").prop("disabled", true);
        $("#btnGenerateInvoice").html("Add to Invoice");
        $("#dataDiv").css("display", "inline");

        //get values from input
        //let manufacturer = $("#ddParty option:selected").text();
        let product = $("#ddProduct option:selected").text();
        let rate = $("#txtRate").val();
        let date = $("#txtDate").val();
        let quantity = $("#txtQuantity").val();
        let total = parseFloat(rate) * parseInt(quantity);

        //reflect the stored values in table and labels
        //1. create a row

        let rowData = {
          id: count,
          invoiceId: invioceNum,
          manufacturerId: $("#ddParty").val(),
          productId: $("#ddProduct").val(),
          rateId: tempRate ? parseInt(tempRate) : firstRate,
          rateAmt: rate,
          date: $("#txtDate").val(),
          quantity: parseInt($("#txtQuantity").val()),
        };

        //append row to table body
        let newRow = $("<tr>");
        newRow.append("<td>" + product + "</td>");
        // newRow.append('<td>' + manufacturer + '</td>');
        newRow.append("<td>" + rate + "</td>");
        newRow.append("<td>" + quantity + "</td>");
        newRow.append("<td>" + total.toFixed(2) + "</td>");
        newRow.append(
          "<td>" +
            ` <button type="button" id="btnEditRow" class="btn text-info row-edit" data-row-id= ${rowData.id}>Edit</button> 
			   <button type="button" class="btn text-danger row-delete" data-row-id= ${rowData.id}>Delete</button>` +
            "</td>"
        );

        //2. and show labels
        $("#lblInvoice").html(invioceNum.toString());
        $("#lblParty").html($("#ddParty option:selected").text());
        $("#lblDate").html(date);
        $("#dataTable tbody").append(newRow);

        //update hidden field with table data

        //console.log(rowData);
        tableData.push(rowData);

        //change or clear input fields

        fillProducts($("#ddParty").val());
        $("#txtQuantity").val(0);
      }
    }
  });

  function validateForm() {
    $(".field-validation-error").remove();

    let isValid = true;

    // Validation for AspNetUserId
    // let userId = $("#ddUser").val();
    // if (!userId) {
    // 	isValid = false;
    // 	$("#ddUser").addClass("input-validation-error");
    // 	$("#ddUser").after("<span class='field-validation-error'>Please select a user.</span>");
    // }
    // else {
    // 	$("#ddUser").removeClass("input-validation-error");
    // }

    // Validation for ManufacturerId
    let partyId = $("#ddParty").val();
    if (!partyId) {
      isValid = false;
      $("#ddManufacturer").addClass("input-validation-error");
      $("#ddManufacturer").after(
        '<span class="field-validation-error">Please select a party.</span>'
      );
    } else {
      $("#ddParty").removeClass("input-validation-error");
    }

    // Validation for ProductId
    let productId = $("#ddProduct").val();
    if (!productId) {
      isValid = false;
      $("#ddProduct").addClass("input-validation-error");
      $("#ddProduct").after(
        "<span class='field-validation-error'>Please select a product.</span>"
      );
    } else {
      $("#ddProduct").removeClass("input-validation-error");
    }

    // Validation for Rate
    let rate = $("#txtRate").val();
    if (!rate || isNaN(rate)) {
      isValid = false;
      $("#txtRate").addClass("input-validation-error");
      $("#txtRate").after(
        "<span class='field-validation-error'>Please enter a valid rate.</span>"
      );
    } else {
      $("#txtRate").removeClass("input-validation-error");
    }

    // Validation for Date
    let date = $("#txtDate").val();
    if (!date || !isValidDate(date)) {
      isValid = false;
      $("#txtDate").addClass("input-validation-error");
      $("#txtDate").after(
        "<span class='field-validation-error'>Please enter a valid date (dd-MM-yyyy).</span>"
      );
    } else {
      $("#txtDate").removeClass("input-validation-error");
    }

    // Validation for Quantity
    let quantity = $("#txtQuantity").val();
    if (!quantity || isNaN(quantity) || quantity <= 0 || quantity > 100) {
      isValid = false;
      $("#txtQuantity").addClass("input-validation-error");
      $("#txtQuantity").after(
        "<span class='field-validation-error'>Please enter a valid quantity between 1 and 100.</span>"
      );
    } else {
      $("#txtQuantity").removeClass("input-validation-error");
    }

    return isValid;
  }

  function isValidDate(dateString) {
    const newDate = reverseString(dateString);
    // console.log(newDate)
    let regex = /^\d{2}-\d{2}-\d{4}$/;
    if (newDate.match(regex)) {
      return true;
    } else {
      return false;
    }
  }

  const reverseString = function (str) {
    if (typeof str !== "string") {
      throw new Error("reverseString accepts only strings.");
      return;
    }

    let strArr = str.split("-");
    let reversed = strArr.reverse();

    return reversed.join("-");
  };
});

// let tableData = [];
// const baseURL = " https://localhost:7146/api";

// const fillProducts = function (partyId) {
//   fetch(`${baseURL}/products/byManufacturer/${partyId}`)
//     .then(response => response.json())
//     .then(data => {
//       document.getElementById('ddProduct').innerHTML = '';
//       data.forEach(item => {
//         document.getElementById('ddProduct').innerHTML +=
//           '<option value="' + item.id + '">' + item.name + '</option>';
//       });

//       changeRate(data[0].id);
//     })
//     .catch(error => {
//       console.log(error);
//     });
// };

// const changeRate = function (productId) {
//   fetch(`${baseURL}/rates/byProduct/${productId}`)
//     .then(response => response.json())
//     .then(result => {
//       document.getElementById('txtRate').value = result.amount;
//       tempRate = result.id;
//     })
//     .catch(error => {
//       console.log(error);
//     });
// };

// const getInvoiceId =  async function () {
//   let invId;
//   fetch(`${baseURL}/invoices/invoiceId`)
//     .then(response => response.json())
//     .then(result => {
//       invId = result.invoiceId + 1;
//     })
//     .catch(error => {
//       console.log(error);
//     });
//   return invId;
// };

// document.getElementById('dataDiv').style.display = 'none';
// document.getElementById('txtRate').disabled = true;
// let tempRate;

// document.getElementById('ddParty').addEventListener('change', function () {
//   let manufacturerId = this.value;
//   document.getElementById('ddProduct').disabled = false;
//   fillProducts(manufacturerId);
// });

// document.getElementById('ddProduct').addEventListener('change', function () {
//   let productId = this.value;
//   changeRate(productId);
// });

// document.getElementById('btnCloseInvoice').addEventListener('click', function () {
//   console.log(tableData);
// });

// document.getElementById('btnGenerateInvoice').addEventListener('click',  function () {
//   const invioceNum =  getInvoiceId();

//   if (validateForm()) {
//     document.getElementById('ddParty').disabled = true;
//     document.getElementById('txtDate').disabled = true;
//     document.getElementById('btnGenerateInvoice').innerHTML = 'Add to Invoice';
//     document.getElementById('dataDiv').style.display = 'inline';

//     let product = document.getElementById('ddProduct').options[document.getElementById('ddProduct').selectedIndex].text;
//     let rate = document.getElementById('txtRate').value;
//     let date = document.getElementById('txtDate').value;
//     let quantity = document.getElementById('txtQuantity').value;
//     let total = parseFloat(rate) * parseInt(quantity);

//     let newRow = document.createElement('tr');
//     newRow.innerHTML =
//       '<td>' +
//       product +
//       '</td><td>' +
//       rate +
//       '</td><td>' +
//       quantity +
//       '</td><td>' +
//       total.toFixed(2) +
//       '</td><td> <button type="button" id="btnEditRow" class="btn text-info">Edit</button>' +
//       '<button type="button" id="btnDeleteRow" class="btn text-danger">Delete</button>' +
//       '</td>';

//     document.getElementById('lblInvoice').innerHTML = invioceNum;
//     document.getElementById('lblParty').innerHTML = document.getElementById('ddParty').options[
//       document.getElementById('ddParty').selectedIndex
//     ].text;
//     document.getElementById('lblDate').innerHTML = date;
//     document.getElementById('dataTable').appendChild(newRow);

//     let rowData = {
//       id: tableData.length,
//       invoiceId: invioceNum,
//       partyId: document.getElementById('ddParty').value,
//       productId: document.getElementById('ddProduct').value,
//       rateId: parseInt(tempRate),
//       date: date,
//       Quantity: parseInt(quantity),
//     };
//     tableData.push(rowData);

//     fillProducts(document.getElementById('ddParty').value);
//     document.getElementById('txtQuantity').value = 0;
//   }
// });

// function validateForm() {
//   $(".field-validation-error").remove();
// 		let isValid = true;

// 		// Validation for AspNetUserId
// 		// let userId = $("#ddUser").val();
// 		// if (!userId) {
// 		// 	isValid = false;
// 		// 	$("#ddUser").addClass("input-validation-error");
// 		// 	$("#ddUser").after("<span class='field-validation-error'>Please select a user.</span>");
// 		// }
// 		// else {
// 		// 	$("#ddUser").removeClass("input-validation-error");
// 		// }

// 		// Validation for ManufacturerId
// 		let partyId = $("#ddParty").val();
// 		if (!partyId) {
// 			isValid = false;
// 			$("#ddManufacturer").addClass("input-validation-error");
// 			$("#ddManufacturer").after('<span class="field-validation-error">Please select a party.</span>');
// 		}
// 		else {
// 			$("#ddParty").removeClass("input-validation-error");
// 		}

// 		// Validation for ProductId
// 		let productId = $("#ddProduct").val();
// 		if (!productId) {
// 			isValid = false;
// 			$("#ddProduct").addClass("input-validation-error");
// 			$("#ddProduct").after("<span class='field-validation-error'>Please select a product.</span>");
// 		}
// 		else {
// 			$("#ddProduct").removeClass("input-validation-error");
// 		}

// 		// Validation for Rate
// 		let rate = $("#txtRate").val();
// 		if (!rate || isNaN(rate)) {
// 			isValid = false;
// 			$("#txtRate").addClass("input-validation-error");
// 			$("#txtRate").after("<span class='field-validation-error'>Please enter a valid rate.</span>");
// 		}
// 		else {
// 			$("#txtRate").removeClass("input-validation-error");
// 		}

// 		// Validation for Date
// 		let date = $("#txtDate").val();
// 		if (!date || !isValidDate(date)) {
// 			isValid = false;
// 			$("#txtDate").addClass("input-validation-error");
// 			$("#txtDate").after("<span class='field-validation-error'>Please enter a valid date (dd-MM-yyyy).</span>");
// 		} else {
// 			$("#txtDate").removeClass("input-validation-error");
// 		}

// 		// Validation for Quantity
// 		let quantity = $("#txtQuantity").val();
// 		if (!quantity || isNaN(quantity) || quantity <= 0 || quantity > 100) {
// 			isValid = false;
// 			$("#txtQuantity").addClass("input-validation-error");
// 			$("#txtQuantity").after("<span class='field-validation-error'>Please enter a valid quantity between 1 and 100.</span>");
// 		}
// 		else {
// 			$("#txtQuantity").removeClass("input-validation-error");
// 		}

// 		return isValid;
// //
// }

// function isValidDate(dateString) {
//   const newDate = reverseString(dateString);
//      // console.log(newDate)
//   		let regex = /^\d{2}-\d{2}-\d{4}$/;
//   		if( newDate.match(regex)){
//         return true;
//       }else{
//         return false;
//       };
// }

// const reverseString = function (str) {
//   if(typeof str !== 'string') {
//           throw new Error('reverseString accepts only strings.');
//           return;
//         }

//         let strArr = str.split('-');
//         let reversed = strArr.reverse();

//         return reversed.join('-');
// };
