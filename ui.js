const dialogue = document.getElementById("dialogue");
const dialogueText = document.getElementById("dialogueText");

const inventoryBox = document.getElementById("inventory");
const inventoryList = document.getElementById("inventoryList");

const piecesHUD = document.getElementById("pieces");

let duckPieces = 0;

const inventory = [];

function openDialogue(text) {

    dialogue.classList.remove("hidden");

    dialogueText.innerHTML = text.replace(/\n/g, "<br>");

}

function closeDialogue() {

    dialogue.classList.add("hidden");

}

window.addEventListener("keydown", e => {

    if (e.key === "Escape")
        closeDialogue();

    if (e.key === "i" || e.key === "I") {

        inventoryBox.classList.toggle("hidden");

        updateInventory();

    }

});

function addItem(item) {

    inventory.push(item);

    updateInventory();

}

function updateInventory() {

    inventoryList.innerHTML = "";

    inventory.forEach(item => {

        const li = document.createElement("li");

        li.textContent = item;

        inventoryList.appendChild(li);

    });

}

function addDuckPiece(name) {

    duckPieces++;

    piecesHUD.innerHTML = "🦆 " + duckPieces + " / 3";

    addItem(name);

}
