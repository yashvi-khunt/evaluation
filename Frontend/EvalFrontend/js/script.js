const baseURL = " https://localhost:7146/api";
const getList = async function (url, errorMsg = "Something went wrong") {
  return fetch(url).then((response) => {
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);
    return response.json();
  });
};

const init = async function () {
  const partyDD = document.getElementById("ddParty");
  const partyList = await getList(`${baseURL}/manufacturers/forInvoice`);
  let html = "";
  partyList.forEach((party) => {
    html += `
		  <option value="${party.id}">${party.name}</option>
		`;
  });
  partyDD.insertAdjacentHTML("afterbegin", html);

  // fillProducts(partyList[0].id)

  //     document.getElementById('dataDiv').style.display = 'none';
  // document.getElementById('txtRate').disabled = true;
  const productDD = document.getElementById("ddProduct");
  const productList = await getList(
    `${baseURL}/products/byManufacturer/${partyList[0].id}`
  );
  html = "";
  productList.forEach((product) => {
    html += `
		  <option value="${product.id}">${product.name}</option>
		`;
  });
  productDD.insertAdjacentHTML("afterbegin", html);

  const txtRate = document.getElementById("txtRate");
  const rate = await fetch(
    `${baseURL}/rates/byProduct/${productList[0].id}`
  ).then((response) => {
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);
    return response.json();
  });

  txtRate.value = rate.amount;
  firstRate = rate.id;
};

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
