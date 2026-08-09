const npcs = [

    /*
    =====================================================
    ANCIEN
    =====================================================
    */

    {
        id: "oldman",

        name: "L'Ancien",

        icon: "👴",

        x: 8 * Game.tileSize,
        y: 8 * Game.tileSize,

        dialogues: [

            "Étranger... Tu n'es pas d'ici, n'est-ce pas ?",

            "Ton regard me le confirme. Tu ne connais rien de Ponan.",

            "Tu es dans le royaume de Ponan.",

            "Un royaume de canards qui existe depuis bien plus longtemps " +
            "que les histoires racontées aux jeunes générations.",

            "Si tu veux comprendre où tu es, commence par observer " +
            "les habitants du village.",

            "Mais souviens-toi d'une chose : " +
            "à Ponan, tout le monde ne raconte pas la même histoire."

        ]
    },


    /*
    =====================================================
    MILA — VILLAGEOISE
    =====================================================
    */

    {
        id: "mila",

        name: "Mila",

        icon: "🦆",

        x: 30 * Game.tileSize,
        y: 11 * Game.tileSize,

        dialogues: [

            "Oh ! Tu es le nouveau dont tout le monde parle.",

            "Tu es vraiment étrange... " +
            "Je n'ai jamais vu un canard comme toi.",

            "Tu veux connaître l'histoire de Ponan ?",

            "Notre roi actuel est Ponanini IV.",

            "Il règne depuis la chute de son frère, " +
            "Ponanini III.",

            "Mais les anciens disent que les choses " +
            "ne se sont pas passées comme on nous l'enseigne.",

            "Personnellement... je préfère ne pas parler de ça."

        ]
    },


    /*
    =====================================================
    GARDE ROYAL
    =====================================================
    */

    {
        id: "guard",

        name: "Garde royal",

        icon: "🛡️",

        x: 47 * Game.tileSize,
        y: 16 * Game.tileSize,

        dialogues: [

            "Halte !",

            "Tu n'as rien à faire près du palais sans autorisation.",

            "Oui, Ponanini IV est notre roi.",

            "Et je te conseille de ne pas poser de questions " +
            "sur celui qui occupait le trône avant lui.",

            "Les affaires de la famille royale ne concernent pas " +
            "les étrangers.",

            "Si tu veux rencontrer le roi, " +
            "présente-toi devant le palais."

        ]
    },


    /*
    =====================================================
    PONANINI IV
    =====================================================
    */

    {
        id: "king",

        name: "Ponanini IV",

        icon: "👑",

        x: 55 * Game.tileSize,
        y: 17 * Game.tileSize,

        dialogues: [

            "Alors... c'est toi.",

            "L'étranger qui serait apparu aux abords du royaume.",

            "Bienvenue à Ponan.",

            "Je suis Ponanini IV, roi de ce royaume.",

            "On m'a raconté que tu cherchais un moyen " +
            "de comprendre ce qui t'était arrivé.",

            "Malheureusement, je crains que personne ici " +
            "ne puisse t'aider à retourner dans ton monde.",

            "Mais tu peux rester à Ponan.",

            "Nous avons connu des temps difficiles, " +
            "mais le royaume est désormais en paix.",

            "Quant à mon frère, Ponanini III...",

            "Il appartient au passé.",

            "Je te conseille de ne pas écouter " +
            "les vieilles histoires racontées par les anciens."

        ]
    }

];


let dialogueOpen = false;

let activeNPC = null;

let dialogueIndex = 0;

let dialogueCooldown = false;

let gameFinished = false;


/*
=========================================================
QUESTIONS / AVANCEMENT
=========================================================
*/

function finishNPCDialogue(npc) {

    if (npc.id === "oldman") {

        if (questStage === 0)
            advanceQuest(1);

        return;
    }


    if (npc.id === "mila") {

        if (questStage === 1)
            advanceQuest(2);

        return;
    }


    if (npc.id === "king") {

        if (questStage === 2)
            advanceQuest(3);

        return;
    }

    
if (npc.id === "guard") {

    if (questStage === 1) {

        completeObjective(
            "guard"
        );
    }

    return;
}

}


/*
=========================================================
OUVRIR UN DIALOGUE
=========================================================
*/

function startDialogue(npc) {

    if (dialogueOpen)
        return;

    dialogueOpen = true;

    activeNPC = npc;

    dialogueIndex = 0;

    dialogueCooldown = true;
}


/*
=========================================================
FERMER LE DIALOGUE
=========================================================
*/

function closeDialogue() {

    dialogueOpen = false;

    activeNPC = null;

    dialogueIndex = 0;

    dialogueCooldown = true;

    setTimeout(() => {

        dialogueCooldown = false;

    }, 150);
}


/*
=========================================================
TOUCHE E
=========================================================
*/

window.addEventListener(
    "keydown",
    event => {

        if (event.code !== "KeyE")
            return;

        event.preventDefault();


        /*
        ==============================================
        DIALOGUE DÉJÀ OUVERT
        ==============================================
        */

        if (dialogueOpen) {

            if (!activeNPC)
                return;


            dialogueIndex++;


            /*
            Dernière réplique
            */

            if (
                dialogueIndex >=
                activeNPC.dialogues.length
            ) {

                finishNPCDialogue(
                    activeNPC
                );

                closeDialogue();

                return;
            }

            return;
        }


        /*
        ==============================================
        NOUVEAU DIALOGUE
        ==============================================
        */

        if (dialogueCooldown)
            return;


        let closestNPC = null;

        let closestDistance = 90;


        npcs.forEach(npc => {

            const dx =
                player.x - npc.x;

            const dy =
                player.y - npc.y;

            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            if (
                distance < closestDistance
            ) {

                closestNPC = npc;

                closestDistance =
                    distance;
            }

        });


        if (closestNPC)
            startDialogue(
                closestNPC
            );
    }
);


/*
=========================================================
UPDATE PNJ
=========================================================
*/

function updateNPC() {

    /*
    Quand un dialogue est ouvert,
    on empêche les déplacements.
    */

    if (dialogueOpen) {

        freezePlayer();

        return;
    }
}


/*
=========================================================
BLOQUER LE JOUEUR
=========================================================
*/

function freezePlayer() {

    if (
        typeof keys ===
        "undefined"
    )
        return;


    keys["z"] = false;
    keys["q"] = false;
    keys["s"] = false;
    keys["d"] = false;

    keys["w"] = false;
    keys["a"] = false;

    keys["ArrowUp"] = false;
    keys["ArrowDown"] = false;
    keys["ArrowLeft"] = false;
    keys["ArrowRight"] = false;
}


/*
=========================================================
DESSIN PNJ
=========================================================
*/

function drawNPC() {

    const ctx =
        Game.ctx;


    npcs.forEach(npc => {

        const x =
            npc.x -
            Game.camera.x;

        const y =
            npc.y -
            Game.camera.y;


        /*
        Ombre
        */

        ctx.fillStyle =
            "rgba(0,0,0,.25)";

        ctx.beginPath();

        ctx.ellipse(
            x,
            y + 30,
            17,
            5,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /*
        Personnage
        */

        ctx.font =
            "38px serif";

        ctx.textAlign =
            "center";

        ctx.textBaseline =
            "middle";

        ctx.fillText(
            npc.icon,
            x,
            y
        );


        /*
        Distance joueur / PNJ
        */

        const dx =
            player.x - npc.x;

        const dy =
            player.y - npc.y;

        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        /*
        Nom
        */

        if (distance < 110) {

            ctx.font =
                "bold 13px Arial";

            ctx.fillStyle =
                "#f2e7c9";

            ctx.fillText(
                npc.name,
                x,
                y - 32
            );


            /*
            Interaction
            */

            if (!dialogueOpen) {

                ctx.font =
                    "12px Arial";

                ctx.fillStyle =
                    "#d4b85c";

                ctx.fillText(
                    "E — Parler",
                    x,
                    y - 50
                );
            }
        }
    });


    /*
    =====================================================
    DIALOGUE
    =====================================================
    */

    if (
        dialogueOpen &&
        activeNPC
    ) {

        drawDialogue(
            activeNPC
        );
    }


    /*
    =====================================================
    FIN DU JEU
    =====================================================
    */

    if (gameFinished) {

        ctx.fillStyle =
            "rgba(0,0,0,.75)";

        ctx.fillRect(
            0,
            0,
            Game.canvas.width,
            Game.canvas.height
        );

        ctx.fillStyle =
            "#ffffff";

        ctx.font =
            "50px Arial";

        ctx.textAlign =
            "center";

        ctx.fillText(
            "CHAUDDDD PONANN !",
            Game.canvas.width / 2,
            Game.canvas.height / 2
        );
    }
}


/*
=========================================================
BOÎTE DE DIALOGUE
=========================================================
*/

function drawDialogue(npc) {

    const ctx =
        Game.ctx;

    const width =
        Game.canvas.width;

    const height =
        Game.canvas.height;


    /*
    Assombrissement
    */

    ctx.fillStyle =
        "rgba(0,0,0,.25)";

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    /*
    Boîte
    */

    const boxWidth =
        Math.min(
            900,
            width * .82
        );

    const boxHeight =
        190;

    const x =
        (width - boxWidth) / 2;

    const y =
        height - 235;


    ctx.fillStyle =
        "rgba(7,8,12,.96)";

    ctx.fillRect(
        x,
        y,
        boxWidth,
        boxHeight
    );


    /*
    Bordure
    */

    ctx.strokeStyle =
        "#b9973e";

    ctx.lineWidth =
        2;

    ctx.strokeRect(
        x,
        y,
        boxWidth,
        boxHeight
    );


    /*
    Nom
    */

    ctx.textAlign =
        "left";

    ctx.font =
        "bold 20px Georgia";

    ctx.fillStyle =
        "#d9b441";

    ctx.fillText(
        npc.icon +
        "  " +
        npc.name,
        x + 25,
        y + 32
    );


    /*
    Texte
    */

    ctx.font =
        "21px Georgia";

    ctx.fillStyle =
        "#eee9dc";


    drawDialogueText(
        npc.dialogues[
            dialogueIndex
        ],
        x + 25,
        y + 72,
        boxWidth - 50,
        30
    );


    /*
    Indication
    */

    ctx.textAlign =
        "right";

    ctx.font =
        "14px Arial";

    ctx.fillStyle =
        "rgba(255,255,255,.55)";


    ctx.fillText(
        "E — continuer",
        x + boxWidth - 25,
        y + boxHeight - 18
    );
}


/*
=========================================================
TEXTE RETOUR À LA LIGNE
=========================================================
*/

function drawDialogueText(
    text,
    x,
    y,
    maxWidth,
    lineHeight
) {

    const ctx =
        Game.ctx;

    const words =
        text.split(" ");

    let line = "";


    for (
        let i = 0;
        i < words.length;
        i++
    ) {

        const test =
            line +
            words[i] +
            " ";


        if (
            ctx.measureText(test).width >
            maxWidth &&
            line !== ""
        ) {

            ctx.fillText(
                line,
                x,
                y
            );

            line =
                words[i] +
                " ";

            y +=
                lineHeight;

        } else {

            line =
                test;
        }
    }


    ctx.fillText(
        line,
        x,
        y
    );
}
