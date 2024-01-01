const baseURL = " https://localhost:7146/api";

const getInvoiceDetails = async function (invoiceId) {
  const url = `${baseURL}/invoices/${invoiceId}`;
  return fetch(url).then((response) => {
    if (!response.ok)
      throw new Error(`Failed to fetch invoice details (${response.status})`);
    return response.json();
  });
};

$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const invoiceId = urlParams.get("id");

  $("#btnSaveEdit").on("click", function () {});
});

const fillPartyDD = function (selectedPartyId) {
  // Implement logic to fill the party dropdown
  // ...
};

const fillProductDD = function (selectedProductId) {
  // Implement logic to fill the product dropdown
  // ...
};

const populateEditModal = async function (invoiceId) {
  // Fetch invoice details
  const invoiceDetails = await getInvoiceDetails(invoiceId);

  // Populate the form fields
  $("#ddParty").val(invoiceDetails.manufacturerId);
  fillPartyDD(invoiceDetails.manufacturerId);

  // Iterate through invoice items and populate the form accordingly
  invoiceDetails.items.forEach((item, index) => {
    // Populate product dropdown for each item
    $(`#ddProduct${index}`).val(item.productId);
    fillProductDD(item.productId);

    // Populate other fields as needed (e.g., rate, quantity)
    // ...
  });
};
