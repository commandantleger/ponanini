const dialogue = document.getElementById("dialogue");
const dialogueText = document.getElementById("dialogueText");

const inventoryBox = document.getElementById("inventory");
const inventoryList = document.getElementById("inventoryList");

const piecesHUD = document.getElementById("pieces");

let duckPieces = 0;

const inventory = [];

let typingInterval = null;

function openDialogue(text) {

    dialogue.classList.remove("hidden");

    clearInterval(typingInterval);

    const html = text.replace(/\n/g, "<br>");

    let i = 0;

    dialogueText.innerHTML = "";

    typingInterval = setInterval(() => {

        dialogueText.innerHTML = html.substring(0, i);

        i++;

        if (i > html.length) {

            clearInterval(typingInterval);

        }

    }, 12);

}

function closeDialogue() {

    clearInterval(typingInterval);

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

        li.innerHTML = item;

        inventoryList.appendChild(li);

    });

}

function addDuckPiece(name) {

    duckPieces++;

    piecesHUD.innerHTML = "🦆 " + duckPieces + " / 3";

    addItem(name);

}
