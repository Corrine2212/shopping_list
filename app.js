import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove, get } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://shopping-list-60e7e-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

// console.log(app)

const cartBtnEl = document.getElementById('add-button')
const inputFieldEl = document.getElementById('input-field')
const shoppingListEl = document.getElementById('shopping-list')



cartBtnEl.addEventListener('click', async function () {
    let inputValue = inputFieldEl.value

    if (inputValue.length === 0) {
        return
    }

    preventDuplicates(inputValue)

    // push(shoppingListInDB, inputValue)
    // console.log(inputValue);
    // renderItemToList(inputValue)
    clearInput()
})

onValue(shoppingListInDB, function (snapshot) {
    let shoppingArray = Object.entries(snapshot.val())

    clearShoppingListEl()

    for (let i = 0; i < shoppingArray.length; i++) {
        let currentItem = shoppingArray[i]
        let currentItemID = currentItem[0] // accesses the item key
        let currentItemValue = currentItem[1] // accesses the item value
        renderItemToList(currentItem)
    }
})

function clearInput() {
    inputFieldEl.value = ""
}

function renderItemToList(item) {
    // shoppingListEl.innerHTML += `<li> ${itemValue} </li>`

    let itemID = item[0]
    let itemValue = item[1]

    let newEl = document.createElement("li")

    newEl.textContent = itemValue

    newEl.addEventListener("dblclick", function () {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        remove(exactLocationOfItemInDB)
    })

    shoppingListEl.append(newEl)
}

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function preventDuplicates(inputValue) {
    const shoppingListRef = ref(database, 'shoppingList');
    const query = get(shoppingListRef);

    query.then((snapshot) => {
        const items = snapshot.val();
        const itemExists = Object.values(items).includes(inputValue);

        if (!itemExists) {
            push(shoppingListInDB, inputValue);
        } else {
            displayWarning('Item already exists in the shopping list.');
        }
    });

}

function displayWarning(message) {
    // Create a warning element
    const warningElement = document.createElement('div');
    warningElement.className = 'input-warning'; // You can style this class in your CSS
    warningElement.textContent = message;

    // Append the warning element to the HTML
    const warningContainer = document.getElementById('warning-container'); // Add a container for warnings in your HTML
    warningContainer.appendChild(warningElement);

    // Remove the warning after a certain time (e.g., 4 seconds)
    setTimeout(() => {
        warningElement.remove();
    }, 4000); // Adjust the time as needed
}