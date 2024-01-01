const baseURL = " https://localhost:7146/api";

const txtPageSize = document.getElementById("txtPageSize");
let pageSize = document.getElementById("txtPageSize").value;
let currPage = 1;
let invoiceId, firstRate;
let tableData = [];
const invoiceTBody = document.querySelector("#invoiceTbl tbody");
let totalEntries;
let selectedColumn = 1,
  sortOrder;

const getList = async function (url, errorMsg = "Something went wrong") {
  return fetch(url).then((response) => {
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);
    return response.json();
  });
};

Array.prototype.swapFirstTwo = function () {
  if (this.length >= 2) {
    [this[0], this[1]] = [this[1], this[0]];
  }
  return this;
};
const updateEntriesInfo = async function (search) {
  const startEntry = (currPage - 1) * pageSize + 1;
  const endEntry = Math.min(currPage * pageSize, totalEntries);

  const infoElement = document.getElementById("invoiceTbl_info");
  infoElement.innerHTML = `Showing ${startEntry} to ${endEntry} of ${totalEntries} entries`;
};

updateEntriesInfo();

const fillTable = function (invoices) {
  invoiceTBody.innerHTML = "";
  let html = "";
  invoices.forEach((el, index) => {
    html += `<tr>
    <td>${index + 1}</td>
                <td>${el.invoiceId}</td>
                 <td>${el.manufacturerName}</td>
                 <td>${new Date(el.date)
                   .toLocaleDateString()
                   .split("/")
                   .swapFirstTwo()
                   .join("-")}</td>
                
                <td>${el.grandTotal}</td>
                <td>
                <button class="btn btn-link edit" data-invoice-id="${
                  el.invoiceId
                }" >Edit</button>
                <button class="btn btn-link view" data-invoice-id="${
                  el.invoiceId
                }" >View Details</button>
                <button class="btn btn-link delete" data-invoice-id="${
                  el.invoiceId
                }" >Delete</button>
                </td>
                </tr>`;
  });

  invoiceTBody.insertAdjacentHTML("afterbegin", html);
};

const paginate = async function () {
  let ulPage = document.getElementById("invoiceTbl_paginate");
  let numOfPages = Math.ceil(totalEntries / pageSize);
  let html = `<a
  class="paginate_button previous disabled" aria-controls="invoiceTbl" aria-disabled="true"
  role="link" data-dt-idx="previous" tabindex="-1"
  id="invoiceTbl_previous">Previous</a>`;
  for (let i = 1; i <= numOfPages; i++) {
    html += `<a class="paginate_button ${
      i === 1 ? "current" : ""
    }" aria-controls="invoiceTbl" role="link" data-dt-idx="${
      i - 1
    }" tabindex="${i - 1}">${i}</a>`;
  }
  html += `<a class="paginate_button next disabled"
  aria-controls="invoiceTbl" aria-disabled="true" role="link" data-dt-idx="next" tabindex="-1"
  id="invoiceTbl_next">Next</a></div>`;

  ulPage.innerHTML = html;
};

$(document).ready(function () {
  const invoiceTable = $("#invoiceTbl");

  $("#invoiceTbl_paginate").on("click", "a", function () {
    $("#invoiceTbl_paginate a.current").removeClass("current");
    $(this).addClass("current");
    currPage = $(this).text();
    getTableData();
  });

  txtPageSize.addEventListener("change", function () {
    pageSize = txtPageSize.value;
  });

  $("#txtSearch").on("change keyup", function () {
    // console.log($("#txtSearch").val());
    var search = $("#txtSearch").val();
    console.log(search, pageSize);
    getTableData(search);
  });

  $("#paginate").on("click", "a", function () {
    $("#paginate a.active").removeClass("active");
    console.log(this);
    $(this).addClass("active");
    currPage = $(this).text();

    getTableData();
  });

  const getTableData = function (search) {
    var list;
    $.ajax({
      url: `${baseURL}/invoices/search?page=${currPage}&pageSize=${pageSize}&sortColumn=${selectedColumn}&sortOrder=${
        sortOrder ? sortOrder : 0
      }&subStr=${search ? search : ""}`,
      method: "GET",
      async: false,
      success: function (data) {
        list = data;
      },
    });
    // console.log(list);
    fillTable(list);
    totalEntries = list.length;
    updateEntriesInfo(search);
    paginate();
  };
  getTableData();

  $("#invoiceTbl thead").on("click", "th", function () {
    $("#invoiceTbl thead th").removeClass("sorting_asc sorting_desc");
    var columnIndex = $(this).index();
    console.log(columnIndex);
    if (columnIndex > 0 && columnIndex < 5) selectedColumn = columnIndex;
    console.log(selectedColumn);
    sortOrder = sortOrder === 0 ? 1 : 0;
    sortOrder === 0
      ? $(`#invoiceTbl thead th:eq(${selectedColumn})`).addClass("sorting_asc")
      : $(`#invoiceTbl thead th:eq(${selectedColumn})`).addClass(
          "sorting_desc"
        );
    getTableData();
  });

  let deleteId, deletebtn;
  invoiceTable.on("click", ".delete", function () {
    deletebtn = $(this);
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
        deletebtn.parents("tr").remove();
      },
      error: function () {
        console.log(error);
      },
    });
  });

  invoiceTable.on("click", ".view", function () {
    var button = $(this);
    var btnId = button.attr("data-invoice-id");

    window.location.href = `./ViewPurchaseHistory.html?id=${btnId}`;
  });

  invoiceTable.on("click", ".edit", function () {
    var button = $(this);
    var btnId = button.attr("data-invoice-id");

    // Redirect to the Edit Invoice page with the invoice ID as a parameter
    window.location.href = `./EditPurchaseHistory.html?id=${btnId}`;
  });
});
