const npcs = [

    {
        id: "king",

        name: "Ponanini IV",

        icon: "🦆",

        x: 55 * Game.tileSize,
        y: 17 * Game.tileSize,

        dialogue: [
            "🦆 Bonjour aventurier !<br><br>Retrouve les 3 morceaux de mon costume.",
            "🦆 Il te manque encore des morceaux.",
            "🎉 Merci !<br><br>Tu as retrouvé mon costume !<br><br>Le pont vers la forêt est maintenant réparé !"
        ]
    },

    {
        id: "oldman",

        name: "Ancien",

        icon: "👴",

        x: 8 * Game.tileSize,
        y: 8 * Game.tileSize,

        dialogue: [
            "👴 Bienvenue dans le royaume des canards ponansseurs.",
            "👴 Les coffres du village contiennent des objets importants.",
            "👴 Va maintenant explorer la forêt."
        ]
    }

];

let dialogueOpen = false;
let gameFinished = false;

function updateNPC() {

    npcs.forEach(npc => {

        const dx = player.x - npc.x;
        const dy = player.y - npc.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 90)
            return;

        if (!keys["e"])
            return;

        if (dialogueOpen)
            return;

        dialogueOpen = true;

        switch (npc.id) {

            case "king":

                if (duckPieces == 0) {

                    openDialogue(npc.dialogue[0]);

                } else if (duckPieces < 3) {

                    openDialogue(
                        "🦆 Il te manque encore " +
                        (3 - duckPieces) +
                        " morceau(x)."
                    );

                } else {

                    bridgeOpen = true;

                    openDialogue(npc.dialogue[2]);

                }

                break;

            case "oldman":

                if (!bridgeOpen) {

                    openDialogue(npc.dialogue[1]);

                } else {

                    openDialogue(npc.dialogue[2]);

                }

                break;

        }

    });

    if (!keys["e"])
        dialogueOpen = false;

}

function drawNPC() {

    const ctx = Game.ctx;

    ctx.font = "48px serif";

    npcs.forEach(npc => {

        ctx.fillText(

            npc.icon,

            npc.x - Game.camera.x,

            npc.y - Game.camera.y + 48

        );

    });

    // On garde ce bloc pour plus tard,
    // lorsque le boss final sera vaincu.

    if (gameFinished) {

        ctx.fillStyle = "rgba(0,0,0,.7)";

        ctx.fillRect(
            0,
            0,
            Game.canvas.width,
            Game.canvas.height
        );

        ctx.fillStyle = "white";

        ctx.font = "50px Arial";

        ctx.fillText(
            "CHAUDDDD PONANN !",
            Game.canvas.width / 2 - 130,
            Game.canvas.height / 2
        );

    }

}
