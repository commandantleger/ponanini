const pieces = [

    {
        x: 6 * Game.tileSize,
        y: 2 * Game.tileSize,
        name: "🎩 Chapeau",
        opened: false
    },

    {
        x: 20 * Game.tileSize,
        y: 18 * Game.tileSize,
        name: "👔 Veste",
        opened: false
    },

    {
        x: 50 * Game.tileSize,
        y: 5 * Game.tileSize,
        name: "👞 Chaussures",
        opened: false
    }

];

let chestPressed = false;

function drawItems() {

    const ctx = Game.ctx;

    ctx.font = "34px serif";

    pieces.forEach(piece => {

        if (piece.opened)
            return;

        ctx.fillText(
            "📦",
            piece.x - Game.camera.x,
            piece.y - Game.camera.y + 36
        );

    });

}

function updateItems() {

    pieces.forEach(piece => {

        if (piece.opened)
            return;

        const dx = player.x - piece.x;
        const dy = player.y - piece.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 70) {

            openDialogue(
                "📦 Coffre trouvé !<br><br>Appuie sur E pour ouvrir."
            );

            if (keys["e"] && !chestPressed) {

                chestPressed = true;

                piece.opened = true;

                addDuckPiece(piece.name);

                openDialogue(
                    "🎉 " + piece.name + "<br><br>Ajouté à l'inventaire !"
                );

            }

        }

    });

    if (!keys["e"])
        chestPressed = false;

}
