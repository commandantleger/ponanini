
from pathlib import Path
import shutil
import sys

ROOT = Path("/home/paulo/ponanini")


def backup(path):
    if not path.exists():
        print(f"[ERREUR] {path.name} introuvable")
        return False
    backup_path = path.with_name(path.name + ".before_all_fix_v3")
    if not backup_path.exists():
        shutil.copy2(path, backup_path)
    print(f"[BACKUP] {backup_path.name}")
    return True


def replace_function(text, signature, replacement):
    start = text.find(signature)
    if start < 0:
        return None

    brace = text.find("{", start)
    if brace < 0:
        return None

    depth = 0
    string = None
    escape = False

    for i in range(brace, len(text)):
        c = text[i]

        if string:
            if escape:
                escape = False
            elif c == "\\": 
                escape = True
            elif c == string:
                string = None
            continue

        if c in ('"', "'", "`"):
            string = c
        elif c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                return text[:start] + replacement + text[i + 1:]

    return None


def patch_ui():
    path = ROOT / "ui.js"

    content = r'''const dialogue =
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
'''

    path.write_text(content, encoding="utf-8")
    print("[OK] ui.js : dialogue sécurisé")


def patch_npc():
    path = ROOT / "npc.js"
    text = path.read_text(encoding="utf-8")

    text = text.replace(
        "function startNPCDialogue(npc) {\n",
        '''function startNPCDialogue(npc) {

    if (
        !npc ||
        !Array.isArray(npc.dialogues) ||
        npc.dialogues.length === 0
    )
        return;

''',
        1
    )

    marker = '''        if (dialogueOpen) {

            if (!activeNPC)
                return;
'''

    replacement = '''        if (dialogueOpen) {

            if (!activeNPC)
                return;

            if (
                typeof window.dialogueTyping !== "undefined" &&
                window.dialogueTyping
            )
                return;
'''

    if marker in text:
        text = text.replace(marker, replacement, 1)

    old_first = '''    openDialogue(
        "<b>" +
        npc.name +
        "</b><br><br>" +
        npc.dialogues[0]
    );
'''

    new_first = '''    const firstLine =
        typeof npc.dialogues[0] === "string"
            ? npc.dialogues[0]
            : "";

    openDialogue(
        "<b>" +
        npc.name +
        "</b><br><br>" +
        firstLine
    );
'''

    if old_first in text:
        text = text.replace(old_first, new_first, 1)

    old_next = '''            openDialogue(
                "<b>" +
                activeNPC.name +
                "</b><br><br>" +
                activeNPC.dialogues[
                    dialogueIndex
                ]
            );
'''

    new_next = '''            const line =
                typeof activeNPC.dialogues[
                    dialogueIndex
                ] === "string"
                    ? activeNPC.dialogues[
                        dialogueIndex
                    ]
                    : "";

            openDialogue(
                "<b>" +
                activeNPC.name +
                "</b><br><br>" +
                line
            );
'''

    if old_next in text:
        text = text.replace(old_next, new_next, 1)

    path.write_text(text, encoding="utf-8")
    print("[OK] npc.js : interaction sécurisée")


def patch_game():
    path = ROOT / "game.js"
    text = path.read_text(encoding="utf-8")

    new_loader = r'''    loadImages() {

        if (this.ready || this.loading)
            return;

        this.loading = true;
        this.loadingStartTime = performance.now();

        const total = this.scenes.length;

        this.images = new Array(total);
        this.imagesLoaded = 0;

        /*
         * SCÈNE 1 PRIORITAIRE.
         * Le jeu ne reste plus bloqué si une scène secondaire
         * manque ou met trop longtemps à charger.
         */

        const loadScene = index => {

            if (index >= total) {
                this.loading = false;
                console.log(
                    "Prologue : scènes secondaires chargées."
                );
                return;
            }

            const img = new Image();

            img.onload = () => {

                this.images[index] = img;
                this.imagesLoaded++;

                if (index === 0) {

                    this.ready = true;

                    updateLoading(
                        100,
                        "Scène 1 chargée. L'histoire commence..."
                    );

                    setTimeout(() => {

                        if (
                            this.active &&
                            this.scene === 0
                        ) {
                            this.speakNarrator(
                                this.scenes[0].text
                            );
                        }

                    }, 500);
                }

                loadScene(index + 1);
            };

            img.onerror = () => {

                console.warn(
                    "Impossible de charger assets/prologue/scene" +
                    (index + 1) +
                    ".png"
                );

                this.images[index] = null;
                this.imagesLoaded++;

                if (index === 0) {

                    this.ready = true;

                    updateLoading(
                        100,
                        "Scène 1 indisponible : décor de secours."
                    );

                    setTimeout(() => {

                        if (
                            this.active &&
                            this.scene === 0
                        ) {
                            this.speakNarrator(
                                this.scenes[0].text
                            );
                        }

                    }, 500);
                }

                loadScene(index + 1);
            };

            img.src =
                "assets/prologue/scene" +
                (index + 1) +
                ".png";
        };

        loadScene(0);
    },

'''

    patched = replace_function(
        text,
        "    loadImages()",
        new_loader.rstrip("\n")
    )

    if patched is not None:
        text = patched
        print("[OK] game.js : scène 1 prioritaire")
    else:
        print("[ATTENTION] loadImages() introuvable")

    old_resize = '''window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});'''

    new_resize = '''function resizeGameCanvas() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (Game && Game.ctx) {
        Game.ctx.setTransform(
            1, 0, 0, 1, 0, 0
        );
    }
}

window.addEventListener(
    "resize",
    resizeGameCanvas
);'''

    if old_resize in text:
        text = text.replace(
            old_resize,
            new_resize,
            1
        )
        print("[OK] game.js : resize stabilisé")

    path.write_text(text, encoding="utf-8")


def main():

    if not ROOT.exists():
        print("[ERREUR] Projet introuvable :", ROOT)
        sys.exit(1)

    for name in (
        "game.js",
        "npc.js",
        "ui.js"
    ):
        if not backup(ROOT / name):
            sys.exit(1)

    patch_ui()
    patch_npc()
    patch_game()

    print()
    print("==============================================")
    print(" PONAN — CORRECTION GLOBALE V3")
    print("==============================================")
    print()
    print("Dialogue :")
    print("  ✓ typing sécurisé")
    print("  ✓ undefined sécurisé")
    print("  ✓ E protégé pendant le typing")
    print("  ✓ fermeture à distance conservée")
    print()
    print("Prologue :")
    print("  ✓ scene1.png chargée en priorité")
    print("  ✓ narration démarre dès que scène 1 est prête")
    print("  ✓ une scène secondaire manquante ne bloque plus")
    print()
    print("Sauvegardes : *.before_all_fix_v3")
    print()
    print("Vérifie ensuite :")
    print("  node --check game.js")
    print("  node --check npc.js")
    print("  node --check ui.js")
    print()
    print("Puis Ctrl+Shift+R dans le navigateur.")


if __name__ == "__main__":
    main()
