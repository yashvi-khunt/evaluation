
const invoiceTBody = document.querySelector("#invoiceTbl>tbody");

let invoiceId;

const getList = async function (url, errorMsg = "Something went wrong") {
  return fetch(url).then((response) => {
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);
    return response.json();
  });
};

const fillInvoices = async function () {
    invoiceTBody.innerHTML = "";
    const rates = await getList(`${baseURL}/invoices`);
    console.log(rates);
    let html = "";
  
    rates.forEach((el) => {
      html += `<tr>
                <td>${el.invoiceId}</td>
                 <td>${el.manufacturerName}</td>
                 <td>${new Date(el.date).toLocaleDateString()}</td>
                <td>
                <button id="${
                  el.invoiceId
                }" class="btn btn-info mx-1 btn-sm view" onclick='View(this)'>View Details</button>
                <button id="${
                  el.invoiceId
                }" class="btn btn-danger mx-1 btn-sm delete" onclick='Delete(this)'>Delete</button>
                </td>
                </tr>`;
    });
  
    invoiceTBody.insertAdjacentHTML("afterbegin", html);
  };
  
  const init = async function(){
  const partyDD = document.getElementById('ddParty');
    const partyList = await getList(`${baseURL}/manufacturers`)
    let html = ''
    partyList.forEach(party => {
        html += `
        <option value="${party.id}">${party.name}</option>
      `
    })
    partyDD.insertAdjacentHTML('afterbegin',html);

    fillProducts(partyList[0].id)

    document.getElementById('dataDiv').style.display = 'none';
document.getElementById('txtRate').disabled = true;
    // const productDD =  document.getElementById('ddProduct');
    // const productList = await getList(`${baseURL}/products/byManufacturer/${partyList[0].id}`)
    //  html = ''
    // productList.forEach(product => {
    //     html += `
    //     <option value="${product.id}">${product.name}</option>
    //   `
    // })
    // productDD.insertAdjacentHTML('afterbegin',html);

    // const txtRate = document.getElementById('txtRate');
    // const rate = await fetch(`${baseURL}/rates/byProduct/${productList[0].id}`).then((response) => {
    //     if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);
    //     return response.json();
    //   });

    //  txtRate.value = rate.amount;
}