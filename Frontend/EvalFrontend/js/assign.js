const baseURL = " https://localhost:7146/api";

// const editForm = document.getElementById('editForm');

// const mappingTBody = document.querySelector("#mappingTbl>tbody");
// let mappingId;

// const fillMappings = async function () {
//     mappingTBody.innerHTML = "";
//     const mappings = await getList(`${baseURL}/mappings`);

//     let html = "";
//     mappings.forEach((el) => {
//       html += `<tr>

//                 <td>${el.manufacturerName}</td>
//                 <td>${el.productName}</td>
//                 <td>
//                 <button id="${el.id}" class="btn btn-info mx-1 btn-sm edit" onclick='Edit(this)'>Edit</button>
//                 <button id="${el.id}" class="btn btn-danger mx-1 btn-sm delete" onclick='Delete(this)'>Delete</button>
//                 </td>
//                 </tr>`;
//     });

//     mappingTBody.insertAdjacentHTML("afterbegin", html);
//   };

//   const getList = async function (url, errorMsg = "Something went wrong") {
//     return fetch(url).then((response) => {
//       if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);
//       return response.json();
//     });
//   };

// function submitAddForm() {
//     // Get form data
//     let newParty = parseInt(document.getElementById("selParty").value);
//     let newProduct = parseInt(document.getElementById("selProduct").value);

//     console.log(typeof(newParty),newProduct);
//     //Send a POST request using Fetch API
//     fetch(`${baseURL}/mappings`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//             "manufacturerId": newParty,
//             "productId":newProduct ,
//         }),
//     })
//         .then((response) => response.json())
//         .then((data) => {
//             // Handle the response from the server
//             console.log("Success:", data);
//             window.location.pathname = "./AssignPage.html";
//         })
//         .catch((error) => {
//             console.error("Error:", error);
//         });

//         window.location.pathname = "./AssignPage.html";
// }

// function submitEditForm(){
//     let newParty = parseInt(document.getElementById("selParty").value);
//     let newProduct = parseInt(document.getElementById("selProduct").value);
//     // Send a POST request using Fetch API
//     fetch(`${baseURL}/mappings/${mappingId}`, {
//         method: 'PUT',
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//             "manufacturerId": newParty,
//             "productId":newProduct ,
//         }),
//     })
//         .then((response) => response.json())
//         .then((data) => {
//             // Handle the response from the server
//             console.log("Success:", data);
//             window.location.pathname = "./AssignPage.html";
//         })
//         .catch((error) => {
//             console.error("Error:", error);
//         });

//         window.location.pathname = "./AssignPage.html";
// }

// const fillForm = async function(){
//     const urlParams = new URLSearchParams(window.location.search);
//    mappingId = urlParams.get('id');

//    await fillDD();
//     let mapping = await getList(`${baseURL}/mappings/${mappingId}`);
//     console.log(mapping);

//     const partyMapping = document.getElementById('selParty');
//     partyMapping.value = mapping.manufacturerId;

//     const productMapping =  document.getElementById('selProduct');
//     productMapping.value = mapping.productId;
// }

// const fillDD = async function(){
//     const partyDD = document.getElementById('selParty');
//     const partyList = await getList(`${baseURL}/manufacturers`)
//     let html = ''
//     partyList.forEach(party => {
//         html += `
//         <option value="${party.id}">${party.name}</option>
//       `
//     })
//     partyDD.insertAdjacentHTML('afterbegin',html);

//     const productDD =  document.getElementById('selProduct');
//     const productList = await getList(`${baseURL}/products`)
//      html = ''
//     productList.forEach(product => {
//         html += `
//         <option value="${product.id}">${product.name}</option>
//       `
//     })
//     productDD.insertAdjacentHTML('afterbegin',html);
// }

$(document).ready(function () {
  var table = $("#mappingTbl").DataTable({
    ajax: {
      url: `${baseURL}/mappings`,
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
        data: "manufacturerName",
      },
      {
        data: "productName",
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
