const baseURL = " https://localhost:7146/api";



const manufacturerTBody = document.querySelector("#manufacturerTbl>tbody");
let manufacturerId;

const fillManufacturers = async function () {
    manufacturerTBody.innerHTML = "";
    const manufacturers = await getList(`${baseURL}/manufacturers`);
  
    let html = "";
    manufacturers.forEach((el) => {
      html += `<tr>
                <td>${el.name}</td>
                <td>
                <button id="${el.id}" class="btn btn-info mx-1 btn-sm edit" onclick='Edit(this)'>Edit</button>
                <button id="${el.id}" class="btn btn-danger mx-1 btn-sm delete" onclick='Delete(this)'>Delete</button>
                </td>
                </tr>`;
    });
  
    manufacturerTBody.insertAdjacentHTML("afterbegin", html);
  };

  const getList = async function (url, errorMsg = "Something went wrong") {
    return fetch(url).then((response) => {
      if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);
      return response.json();
    });
  };

function submitAddForm() {
   
    //Get form data
    let newName = document.getElementById("manName").value;
    // Send a POST request using Fetch API
    fetch(`${baseURL}/manufacturers`, {
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
            window.location.pathname = "./Index.html";
        })
        .catch((error) => {
            console.error("Error:", error);
        });

     window.location.pathname = "./Index.html";
}


 function submitEditForm(){
    
    console.log("edit function");
    let newName = document.getElementById("manName").value;
    // Send a POST request using Fetch API
     fetch(`${baseURL}/manufacturers/${manufacturerId}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "name": newName,
        }),
    })
        .then((response) => {
            console.log(response);
        })
        .then((data) => {
            // Handle the response from the server
            console.log("Success:", data);
            window.location.pathname="./Index.html";
        })
        .catch((error) => {
            console.error("Error:", error);
        });
        window.location.pathname="./Index.html";
}


const fillForm = async function(){
    const urlParams = new URLSearchParams(window.location.search);
   manufacturerId = urlParams.get('id');

    
    let manufacturer = await getList(`${baseURL}/manufacturers/${manufacturerId}`);
    console.log(manufacturer);

    const txtManufacturer = document.getElementById('manName');
    txtManufacturer.value = manufacturer.name;
}