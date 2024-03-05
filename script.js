// TO DO
// ✅ figure out how to get text input from field up top into the list items
// ✅ scroll overflow
// ✅ add delete button
// ✅ format input field and add button
// ✅ make inputField and button sticky
// ✅ figure out how to make text wrap within list-item and not overflow
// ✅ hold items in local storage
// ✅ move checked items to bottom of list
// ✅ figure out why checking to the bottom only works sometimes and doesn't save

// Global variables

const checkbox = document.getElementById("mycheckbox");
const listItemText = document.getElementById("p-container-text");
const listContainer = document.querySelector(".list-container");
const listContainerBody = document.querySelector(".list-container-body");
const inputField = document.getElementById("input-field");
const addButton = document.getElementById("add-button");
const deleteButton = document.getElementById("delete-button");
const listItem = document.querySelector(".list-item");
const clearButton = document.getElementById("clear-button");

// Functions

// Save and load list items to local storage
function saveList() {
  const listItems = document.querySelectorAll(".list-item");
  const items = [];
  listItems.forEach((item) => {
    const text = item.querySelector(".p-container").textContent;
    const isChecked = item.querySelector(".checkbox").checked;
    items.push({ text, isChecked });
  });

  localStorage.setItem("listItems", JSON.stringify(items));
}

function loadList() {
  const savedItems = localStorage.getItem("listItems");
  if (savedItems) {
    const items = JSON.parse(savedItems);

    items.forEach(({ text, isChecked }) => {
      const listContent = ` <!-- start list item -->
      <div class="list-item">
        <div class="input-container">
          <input class="checkbox" type="checkbox" ${
            isChecked ? "checked" : ""
          } />
          <label></label>
        </div>
        <div class="p-container">
          <p class="p-container-text">
            ${text}
          </p>
        </div>
        <div ><i id="delete-button" class="fa-regular fa-circle-xmark delete-button"></i></div>
      </div>
      <!-- end list item -->`;

      listContainer.insertAdjacentHTML("beforeend", listContent);
    });
  }
  inputField.focus();
}

function addItem() {
  let listContent = `  <!-- start list item -->
  <li class="list-container-item">
  <div class="list-item">
  <div class="input-container">
  <input class="checkbox" id="mycheckbox" type="checkbox" />
  <label for="mycheckbox"></label>
  </div>
  
  <div class="p-container">
  <p class="p-container-text">
  ${inputField.value}
  </p>
  </div>
  
  <div>
  <i
  id="delete-button"
  class="fa-regular fa-circle-xmark delete-button"
  ></i>
  </div>
  </div>
  </li>
  <!-- end list item -->`;
  const listItemNew = document.createElement("div");
  listItemNew.innerHTML = listContent;
  listContainerBody.appendChild(listItemNew);
  listContainer.scrollTop = listContainer.scrollHeight;

  saveList();
  inputField.value = "";
  inputField.focus();
  displayLocalStorage();
}

function isChecked(checkbox) {
  if (checkbox.checked) {
    console.log("Checkbox is checked.");
  } else {
    console.log("Checkbox is NOT checked.");
  }
}

function clearList() {
  // Get all list items
  const listItems = document.querySelectorAll(".list-item");

  // Iterate over each list item and remove it
  listItems.forEach((item) => {
    item.remove();
  });

  // Also, clear the list items from local storage
  localStorage.removeItem("listItems");
}

// Event listeners

window.addEventListener("load", loadList);

// Add 'checked' class when box is checked
listContainer.addEventListener("change", (event) => {
  if (event.target.classList.contains("checkbox")) {
    const listItemText = event.target
      .closest(".list-item")
      .querySelector(".p-container-text");
    const isChecked = event.target.checked;
    if (isChecked) {
      listItemText.classList.add("checked");
      const parentItem = listItemText.parentElement.parentElement;
      const parentItemContainer = parentItem.parentElement;
      parentItemContainer.appendChild(parentItem);
    } else {
      listItemText.classList.remove("checked");
    }
  }
});

// Add item with addButton or Enter key
addButton.addEventListener("click", function () {
  if (inputField.value == "") {
    event.preventDefault();
    return;
  } else if (event.shiftKey) {
    return;
  } else {
    addItem();
    event.preventDefault();
    saveList();
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    if (inputField.value == "") {
      event.preventDefault();
      return;
    } else if (event.shiftKey) {
      return;
    } else {
      addItem();
      event.preventDefault();
      saveList();
    }
  }
});

// Delete list item when delete button is clicked
listContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("delete-button")) {
    event.target.closest(".list-item").remove();
    saveList();
  }
});

clearButton.addEventListener("click", clearList);

// Move checked items to bottom and save
function reorderList() {
  const listItems = document.querySelectorAll(".list-item");
  const uncheckedItems = [];
  const checkedItems = [];

  listItems.forEach((item) => {
    const checkbox = item.querySelector(".checkbox");
    const listItemText = item.querySelector(".p-container-text").textContent;

    if (checkbox.checked) {
      checkedItems.push({ text: listItemText, isChecked: true });
    } else {
      uncheckedItems.push({ text: listItemText, isChecked: false });
    }

    item.remove(); // Remove items from the DOM for reordering
  });

  // Concatenate unchecked items first followed by checked items
  const reorderedItems = [...uncheckedItems, ...checkedItems];

  // Append reordered items to the list container
  reorderedItems.forEach(({ text, isChecked }) => {
    const listContent = ` <!-- start list item -->
    <div class="list-item">
      <div class="input-container">
        <input class="checkbox" type="checkbox" ${isChecked ? "checked" : ""} />
        <label></label>
      </div>
      <div class="p-container">
        <p class="p-container-text">${text}</p>
      </div>
      <div ><i id="delete-button" class="fa-regular fa-circle-xmark delete-button"></i></div>
    </div>
    <!-- end list item -->`;

    listContainer.insertAdjacentHTML("beforeend", listContent);
  });

  saveList(); // Update local storage
}

// Event listener to trigger reorderList when checkbox state changes
listContainer.addEventListener("change", (event) => {
  if (event.target.classList.contains("checkbox")) {
    reorderList();
  }
});

// Your existing event listeners here...
