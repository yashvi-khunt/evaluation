const baseURL = " https://localhost:7146/api";



const productTBody = document.querySelector("#productTbl>tbody");
let productId;

const fillProducts = async function () {
    productTBody.innerHTML = "";
    const products = await getList(`${baseURL}/products`);
  
    let html = "";
  
    products.forEach((el) => {
      html += `<tr>
                <td>${el.name}</td>
                <td>
                <button id="${el.id}" class="btn btn-info mx-1 btn-sm edit" onclick='Edit(this)'>Edit</button>
                <button id="${el.id}" class="btn btn-danger mx-1 btn-sm delete" onclick='Delete(this)'>Delete</button>
                </td>
                </tr>`;
    });
  
    productTBody.insertAdjacentHTML("afterbegin", html);
  };

  const getList = async function (url, errorMsg = "Something went wrong") {
    return fetch(url).then((response) => {
      if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);
      return response.json();
    });
  };

function submitAddForm() {
    // Get form data
    let newName = document.getElementById("product_Name").value;
    // Send a POST request using Fetch API
    fetch(`${baseURL}/products`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "name": newName,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            // Handle the response from the server
            console.log("Success:", data);
            window.location.pathname = "./Product.html";
        })
        .catch((error) => {
            console.error("Error:", error);
        });

    window.location.pathname = "./Product.html";
}


function submitEditForm(){
    let newName = document.getElementById("product_Name").value;
    // Send a POST request using Fetch API
    fetch(`${baseURL}/products/${productId}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "name": newName,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            // Handle the response from the server
            console.log("Success:", data);
            window.location.pathname = "./Product.html";
        })
        .catch((error) => {
            console.error("Error:", error);
        });

    window.location.pathname = "./Product.html";
}


const fillForm = async function(){
    const urlParams = new URLSearchParams(window.location.search);
   productId = urlParams.get('id');

    
    let product = await getList(`${baseURL}/products/${productId}`);
    console.log(product);

    const txtProduct = document.getElementById('product_Name');
    txtProduct.value = product.name;
}