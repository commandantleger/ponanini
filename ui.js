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

window.dialogueTyping = false;


function cleanDialogueText(value) {

    if (typeof value !== "string")
        return "";

    return value
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<[^>]*>/g, "");
}


function openDialogue(text) {

    if (!dialogue || !dialogueText)
        return;

    clearInterval(typingInterval);

    const source =
        typeof text === "string"
            ? text
            : "";

    dialogue.classList.remove("hidden");

    const titleMatch =
        source.match(/<b>(.*?)<\/b>/i);

    const title =
        titleMatch ? titleMatch[1] : "";

    const body =
        cleanDialogueText(
            source.replace(/<b>.*?<\/b>/i, "")
        ).trim();

    dialogueText.innerHTML = "";

    const titleElement =
        document.createElement("div");

    titleElement.style.fontWeight = "700";
    titleElement.style.marginBottom = "10px";
    titleElement.textContent = title;

    const bodyElement =
        document.createElement("div");

    dialogueText.appendChild(titleElement);
    dialogueText.appendChild(bodyElement);

    window.dialogueTyping = true;

    let index = 0;

    typingInterval = setInterval(() => {

        if (index >= body.length) {

            clearInterval(typingInterval);
            window.dialogueTyping = false;
            bodyElement.textContent = body;
            return;
        }

        bodyElement.textContent =
            body.substring(0, index + 1);

        index++;

    }, 18);
}


function closeDialogue() {

    clearInterval(typingInterval);
    window.dialogueTyping = false;

    if (dialogue)
        dialogue.classList.add("hidden");
}


window.openDialogue = openDialogue;
window.closeDialogue = closeDialogue;


window.addEventListener("keydown", event => {

    if (event.key === "Escape")
        closeDialogue();

    if (
        event.key === "i" ||
        event.key === "I"
    ) {

        if (!inventoryBox)
            return;

        inventoryBox.classList.toggle("hidden");
        updateInventory();
    }
});


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

        li.textContent =
            typeof item === "string"
                ? cleanDialogueText(item)
                : String(item);

        inventoryList.appendChild(li);
    });
}


function addDuckPiece(name) {

    duckPieces++;

    if (piecesHUD) {
        piecesHUD.textContent =
            "🦆 " + duckPieces + " / 3";
    }

    addItem(name);
}


window.addItem = addItem;
window.addDuckPiece = addDuckPiece;
window.updateInventory = updateInventory;
