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
//     const rateAmt = parseInt(document.getElementById('Rate_Amount').value)
//     const date = document.getElementById('Ratedate').value;
//     // Get form data
//     console.log(pName,rateAmt,date);
//     fetch(`${baseURL}/rates`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//             "amount": rateAmt,
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
//     const rateAmt = parseInt(document.getElementById('Rate_Amount').value)
//     const date = document.getElementById('Ratedate').value;
//     // Get form data
//     console.log(pName,rateAmt,date);
//     fetch(`${baseURL}/rates/${rateId}`, {
//         method: "PUT",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//             "amount": rateAmt,
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
//     const rateAmt = document.getElementById('Rate_Amount');
//     rateAmt.value = rateObj.amount;
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
            "<button class='btn btn-link edit' data-customer-id=" +
            data +
            ">Edit</button>" +
            "<button class='btn btn-link delete' data-customer-id=" +
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

  table.on("click", ".delete", function () {
    var button = $(this);
    bootbox.confirm(
      "Are you sure you want to delete this party?",
      function (result) {
        if (!result) {
          return;
        }
        $.ajax({
          url: `${baseURL}/manufacturers/` + button.attr("data-customer-id"),
          method: "DELETE",
          success: function () {
            table.row(button.parents("tr")).remove().draw();
          },
        });
      }
    );
  });

  table.on("click", ".edit", function () {
    // var id = $(this).attr("data - customer - id");
    // window.location.href = `EditManufacturer.html?id=${id}`;
  });
});
