const dialogue =
    document.getElementById("dialogue");

const dialogueText =
    document.getElementById("dialogueText");

const inventoryBox =
    document.getElementById("inventory");

const inventoryList =
    document.getElementById("inventoryList");

const piecesHUD =
    document.getElementById("pieces");

let duckPieces = 0;

const inventory = [];

let typingInterval = null;


function openDialogue(text) {

    if (!dialogue || !dialogueText)
        return;

    clearInterval(typingInterval);

    dialogue.classList.remove("hidden");

    let html = text.replace(/\n/g, "<br>");

    let plainText =
        html.replace(/<br\s*\/?>/gi, "\n")
            .replace(/<[^>]*>/g, "");

    let index = 0;

    dialogueText.innerHTML = "";

    typingInterval = setInterval(() => {

        if (index >= plainText.length) {

            clearInterval(typingInterval);

            dialogueText.innerHTML = html;

            return;
        }

        const visible =
            plainText.substring(0, index + 1);

        const parts =
            visible.split("\n");

        let result = "";

        for (let i = 0; i < parts.length; i++) {

            if (i > 0)
                result += "<br>";

            result += parts[i];
        }

        dialogueText.innerHTML = result;

        index++;

    }, 20);
}


function closeDialogue() {

    clearInterval(typingInterval);

    if (dialogue)
        dialogue.classList.add("hidden");
}


window.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {
            closeDialogue();
        }

        if (
            event.key === "i" ||
            event.key === "I"
        ) {

            if (!inventoryBox)
                return;

            inventoryBox.classList.toggle(
                "hidden"
            );

            updateInventory();
        }
    }
);


function addItem(item) {

    inventory.push(item);

    updateInventory();
}


function updateInventory() {

    if (!inventoryList)
        return;

    inventoryList.innerHTML = "";

    inventory.forEach(item => {

        const li =
            document.createElement("li");

        li.innerHTML = item;

        inventoryList.appendChild(li);
    });
}


function addDuckPiece(name) {

    duckPieces++;

    if (piecesHUD) {

        piecesHUD.innerHTML =
            "🦆 " +
            duckPieces +
            " / 3";
    }

    addItem(name);
}
