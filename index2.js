// Configuration variables
var APIURL = "https://127.0.0.1:8000/api";
var tagsAPIURL = APIURL + "/tags";

// future DOM interactions
var pageTitleH1 = document.querySelector("#pageTitle")
var infoZoneDiv = document.querySelector("#infoZone");
var tagSelect = document.querySelector("#tags");
var tagNameInput = document.querySelector("#tagName");
var mainSection = document.querySelector("#main");

// Visible button on page startup
var createButton = document.createElement("button");
createButton.innerText = "Créer"
mainSection.appendChild(createButton);
// Hidden buttons on page startup
var updateButton = document.createElement("button");
updateButton.innerText = "Mettre à jour";
var deleteButton = document.createElement("button");
deleteButton.innerText = "Supprimer";

// function when a tag is selected. Not related to the API
var selectTag = function() {
    // rename H1
    pageTitleH1.innerText = "Modification d’un tag";
    // first of all, we fill the input field with the name of the tag
    tagNameInput.value = document.querySelector("#option-" + tagSelect.value).innerHTML;
    // update and delete button are shown
    mainSection.appendChild(updateButton)
    mainSection.appendChild(deleteButton);
    // create button is removed
    mainSection.removeChild(createButton)
}

/// function to reset form
var resetForm = function() {
    // Empty the input field
    tagNameInput.value = "";
    // remove update and delete button
    mainSection.removeChild(updateButton);
    mainSection.removeChild(deleteButton);
    // add create button
    mainSection.appendChild(createButton);
    // reset title
    pageTitleH1.innerText = "Création d’un tag";
}

// function to create a new element
var createTag = function() {
    // if no name is provided, we do nothing
    if (tagNameInput.value == "") {
        return;
    }else if (tagNameInput.value.length < 5) {
        alert('TagName trop court')
    }else if (tagNameInput.value.length > 10) {
        alert('TagName trop long')
    }


    // we prepare the parameters
    var requestParameters = {
            "name": tagNameInput.value
        }
        // we do the request
    fetch(tagsAPIURL, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestParameters)
        })
        .then((response) => {
            if (response.status == 201) {
                infoZoneDiv.textContent = "Création du tag effectuée";
                readTags();
            } else {
                infoZoneDiv.textContent = "⚠ Une erreur est survenue lors de la création du tag";
            }
        })
}


// function to get all tags and filling <select>
var readTags = function() {
    // first we empty the select
    while (tagSelect.firstChild) {
        tagSelect.removeChild(tagSelect.firstChild);
    }
    // then we fetch data and fill the select
    fetch(tagsAPIURL, { method: "GET" })
        .then(function(response) { return response.json() })
        .then((responseJSON) => {
            responseJSON["hydra:member"].forEach(tag => {
                tagOption = document.createElement("option");
                tagOption.innerHTML = tag["name"];
                tagOption.value = tag["id"];
                tagOption.id = "option-" + tag["id"];
                tagSelect.appendChild(tagOption);
            });
        })
}



var updateTag = function() {
    // if no name is provided, we do nothing
    if (tagNameInput.value == "") {
        return;
    }
    // we prepare the parameters
    var requestParameters = {
        "name": tagNameInput.value
    }
    fetch(tagsAPIURL + "/" + tagSelect.value, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestParameters)
        })
        .then((response) => {
            if (response.status == 200) {
                infoZoneDiv.textContent = "Modification du tag effectuée";
                readTags();
            } else {
                infoZoneDiv.textContent = "⚠ Une erreur est survenue lors de la modification du tag";
            }
        })
    resetForm();
}

var deleteTag = function() {
    // it’s quite straigh forward
    fetch(tagsAPIURL + "/" + tagSelect.value, {
            method: "DELETE",
        }).then((response) => {
            if (response.status == 204) {
                infoZoneDiv.textContent = "Tag supprimé";
            } else {
                infoZoneDiv.textContent = "⚠ Une erreur est survenue lors de la création du tag";
            }
            // we reload tags
            readTags();
        })
        // we reset buttons and input form’s content
    resetForm();
}

// Action for create button
createButton.addEventListener("click", createTag);
// Action for update button
updateButton.addEventListener("click", updateTag);
// Action for delete button
deleteButton.addEventListener("click", deleteTag);
// When we select a category, some things happen 
tagSelect.addEventListener("change", selectTag);
// When document DOM is loaded, we fetch the categories
document.addEventListener("DOMContentLoaded", readTags);