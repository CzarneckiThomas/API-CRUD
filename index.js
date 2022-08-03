var pageTitleH1       = document.querySelector("#pageTitle")
var infoZoneDiv       = document.querySelector("#infoZone");
var createButton      = document.querySelector("#createButton");
var categorySelect    = document.querySelector("#categories");
var categoryNameInput = document.querySelector("#categoryName");
var APIURL            = "https://127.0.0.1:8000/api";
var categoriesAPIURL  = APIURL + "/categories";

// Hidden buttons on page startup
var updateButton       = document.createElement("button");
updateButton.innerText = "Mettre à jour";
var deleteButton       = document.createElement("button");
deleteButton.innerText = "Supprimer";

// function when a category is selected. Not related to the API
var selectCategory = function() {
    // rename H1
    pageTitleH1.innerText = "Modification d’une catégorie";
    // first of all, we fill the input field with the name of the category
    categoryNameInput.value = document.querySelector("#option-" + categorySelect.value).innerHTML;
    // update and delete button are shown
    document.body.appendChild(updateButton)
    document.body.appendChild(deleteButton);
    // create button is removed
    createButton.remove()
}

// function to create a new element
var createCategory = function() {
    // if no name is provided, we do nothing
    if(categoryNameInput.value == "") {
        return;
    }
    // we prepare the parameters
    var requestParameters = {
        "name": categoryNameInput.value
    }
    // we do the request
    fetch(categoriesAPIURL, { 
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestParameters)
    })
    .then((response) => {
        if(response.status == 201) {
            infoZoneDiv.textContent = "Création de la catégorie effectuée";
            readCategories();
        }
        else {
            infoZoneDiv.textContent = "⚠ Une erreur est survenue lors de la création de la catégorie";
        }
    }
    )
}


// function to get all categories and filling <select>
var readCategories = function() {
    // first we empty the select
    while(categorySelect.firstChild) {
        categorySelect.removeChild(categorySelect.firstChild);
    }
    // then we fetch data and fill the select
    fetch(categoriesAPIURL, { method: "GET" })
        .then(function(response) { return response.json() })
        .then((responseJSON) => {
            responseJSON["hydra:member"].forEach(category => {
                categoryOption = document.createElement("option");
                categoryOption.innerHTML = category["name"];
                categoryOption.value     = category["id"];
                categoryOption.id        = "option-" + category["id"];
                categorySelect.appendChild(categoryOption);
            });
        })
}

var updateCategory = function() {

}

var deleteCategory = function() {
    // it’s quite straigh forward
    fetch(categoriesAPIURL + "/" + categorySelect.value, {
        method: "DELETE",   
    }).then((response) => {
        if(response.status == 204) {
            infoZoneDiv.textContent = "Catégorie supprimée";
        }
        else {
            infoZoneDiv.textContent = "⚠ Une erreur est survenue lors de la création de la catégorie";
        }
        // we reload categories
        readCategories();
    })
}

// Action for create button
createButton.addEventListener("click", createCategory);
// Action for update button
updateButton.addEventListener("clic", updateCategory);
// Action for delete button
deleteButton.addEventListener("click", deleteCategory);
// When we select a category, some things happen 
categorySelect.addEventListener("change", selectCategory);
// When document DOM is loaded, we fetch the categories
document.addEventListener("DOMContentLoaded",readCategories);
