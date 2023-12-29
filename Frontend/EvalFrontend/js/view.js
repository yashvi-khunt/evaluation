const baseURL = " https://localhost:7146/api";

const lblInvoice = document.getElementById("lblInvoice");
const lblParty = document.getElementById("lblParty");
const lblDate = document.getElementById("lblDate");
const tableBody = document.querySelector("#dataTable tbody");

const btnPrint = document.getElementById("btnPrintInvoice");
const btnClose = document.getElementById("btnClose");
const getList = async function (url, errorMsg = "Something went wrong") {
  return fetch(url).then((response) => {
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);
    return response.json();
  });
};

const init = async function () {
  const urlParams = new URLSearchParams(window.location.search);
  invoiceId = urlParams.get("id");
  const invoices = await getList(`${baseURL}/invoices/${invoiceId}`);

  lblInvoice.innerHTML = invoices[0].invoiceId;
  lblParty.innerHTML = invoices[0].manufacturerName;
  const dt = new Date(invoices[0].date);
  lblDate.innerHTML = dt.toLocaleDateString();
  console.log(tableBody);
  invoices.forEach((element) => {
    const total = element.rateAmount * element.quantity;
    let html = `<tr>
    <td>  ${element.productName}  </td>
    <td>  ${element.rateAmount}  </td>
     <td>  ${element.quantity}  </td>
    <td>  ${total.toFixed(2)} </td>
    </tr>`;

    tableBody.insertAdjacentHTML("afterbegin", html);
    console.log(html);
  });
};
const createDocName = function () {
  const party = lblParty.innerHTML;
  const date = new Date();
  return party + "-" + date.toLocaleDateString().split("/").join("");
};

btnPrint.addEventListener("click", function () {
  const body = document.getElementById("body").cloneNode(true);
  // const btnPrint = body.querySelector("#btnPrintInvoice");
  // const btnClose = body.querySelector("#btnClose");

  const docName = createDocName();
  // console.log(body);
  html2pdf().from(body).save(`${docName}.pdf`);
});

init();
