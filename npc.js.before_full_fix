const npcs = [

    {
        id: "marek",
        name: "Marek",
        x: 23 * Game.tileSize,
        y: 29 * Game.tileSize,
        type: "oldman",
        dialogues: [
            "Tu es tombé du ciel... Je t'ai vu apparaître près du Grand Lac.",
            "Ce n'est pas une façon ordinaire d'arriver à Ponan.",
            "Tu affirmes venir d'un autre monde ?",
            "Alors écoute-moi bien : ce royaume est peuplé de canards, et ton arrivée n'est probablement pas un accident.",
            "Il y a très longtemps, certains anciens étudiaient les passages entre les mondes.",
            "Ils appelaient ces passages les Portes de l'Entre-Lac.",
            "Ton portail a laissé un fragment. Garde-le caché.",
            "Ponanini III s'intéressait lui aussi à ces passages avant sa disparition.",
            "Si tu veux comprendre pourquoi tu es ici, commence par parler à Mila dans le village.",
            "Et si tu entends une voix dans la forêt... ne lui réponds pas."
        ]
    },

    {
        id: "mila",
        name: "Mila",
        x: 47 * Game.tileSize,
        y: 25 * Game.tileSize,
        type: "mila",
        dialogues: [
            "Tu es donc l'humain dont Marek parlait.",
            "Je n'aurais jamais cru voir un humain de mes propres yeux.",
            "Ponanini III étudiait les passages entre les mondes.",
            "Après une découverte dans la forêt, il a interdit l'accès à toute la région.",
            "Quelques semaines plus tard, il a disparu.",
            "La version officielle dit qu'il a fui. Mais personne ici n'y croit vraiment.",
            "Si tu veux la vérité, le garde royal en sait probablement plus qu'il ne le prétend."
        ]
    },

    {
        id: "guard",
        name: "Garde royal",
        x: 48 * Game.tileSize,
        y: 22 * Game.tileSize,
        type: "guard",
        dialogues: [
            "Halte. Tu n'as rien à faire près du palais sans autorisation.",
            "Oui, je sais ce que tu es. Toute la place parle déjà de l'humain tombé du ciel.",
            "Tu veux savoir ce qui est arrivé à Ponanini III ?",
            "Officiellement, il a disparu après avoir été accusé de trahison.",
            "Officieusement... il cherchait quelque chose dans la forêt.",
            "Après sa disparition, Ponanini IV a interdit toute recherche sur cette affaire.",
            "Si tu veux continuer, cherche les anciens symboles dans la forêt."
        ]
    },

    {
        id: "king",
        name: "Ponanini IV",
        x: 44 * Game.tileSize,
        y: 12 * Game.tileSize,
        type: "king",
        dialogues: [
            "Alors c'est toi. L'humain venu par le portail.",
            "Je te conseille de ne pas fouiller dans les affaires de mon frère.",
            "Ponanini III appartient au passé.",
            "Si tu veux rester en vie à Ponan, apprends d'abord à qui tu peux faire confiance."
        ]
    }
];

let dialogueOpen = false;
let activeNPC = null;
let dialogueIndex = 0;
let dialogueCooldown = false;
let gameFinished = false;

const NPC_INTERACTION_DISTANCE = Game.tileSize * 1.7;
const DIALOGUE_MAX_DISTANCE = Game.tileSize * 3;
let npcIdleTime = 0;

function getNPCDistance(npc) {
    const dx = player.x - npc.x;
    const dy = player.y - npc.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function getClosestNPC() {
    let closest = null;
    let distance = NPC_INTERACTION_DISTANCE;

    npcs.forEach(npc => {
        const d = getNPCDistance(npc);
        if (d < distance) {
            closest = npc;
            distance = d;
        }
    });

    return closest;
}

function startNPCDialogue(npc) {
    if (!npc || dialogueOpen || dialogueCooldown)
        return;

    dialogueOpen = true;
    activeNPC = npc;
    dialogueIndex = 0;
    dialogueCooldown = true;

    openDialogue(
        "<b>" + npc.name + "</b><br><br>" +
        npc.dialogues[dialogueIndex]
    );

    setTimeout(() => {
        dialogueCooldown = false;
    }, 180);
}

function closeNPCDialogue() {
    dialogueOpen = false;
    activeNPC = null;
    dialogueIndex = 0;
    dialogueCooldown = true;
    closeDialogue();

    setTimeout(() => {
        dialogueCooldown = false;
    }, 180);
}

function finishNPCDialogue(npc) {

    if (!npc)
        return;

    if (npc.id === "marek" && questStage === 0) {
        completeObjective("marek");
        return;
    }

    if (npc.id === "mila" && questStage === 1) {
        completeObjective("mila");
        return;
    }

    if (npc.id === "guard" && questStage === 2) {
        completeObjective("guard");
        return;
    }
}

window.addEventListener("keydown", event => {

    if (event.code !== "KeyE" || event.repeat)
        return;

    event.preventDefault();

    if (dialogueOpen) {

        if (!activeNPC)
            return;

        if (getNPCDistance(activeNPC) > DIALOGUE_MAX_DISTANCE) {
            closeNPCDialogue();
            return;
        }

        dialogueIndex++;

        if (dialogueIndex >= activeNPC.dialogues.length) {
            finishNPCDialogue(activeNPC);
            closeNPCDialogue();
            return;
        }

        openDialogue(
            "<b>" + activeNPC.name + "</b><br><br>" +
            activeNPC.dialogues[dialogueIndex]
        );

        return;
    }

    const npc = getClosestNPC();
    if (npc)
        startNPCDialogue(npc);
});

function updateNPC() {

    npcIdleTime += .025;

    if (dialogueOpen && activeNPC) {
        if (getNPCDistance(activeNPC) > DIALOGUE_MAX_DISTANCE)
            closeNPCDialogue();
    }
}

function shouldShowQuestMarker(npc) {

    if (questStage === 0 && npc.id === "marek")
        return true;

    if (questStage === 1 && npc.id === "mila")
        return true;

    if (questStage === 2 && npc.id === "guard")
        return true;

    return false;
}

function drawDuckNPC(ctx, npc, x, y) {

    const bob = Math.sin(npcIdleTime + npc.x * .01) * .8;

    ctx.save();

    if (npc.type === "oldman") {
        ctx.fillStyle = "#77705b";
        ctx.beginPath();
        ctx.ellipse(x, y + 22 + bob, 16, 18, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#c9b66a";
        ctx.beginPath();
        ctx.arc(x, y - 2 + bob, 14, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#e7e0c7";
        ctx.beginPath();
        ctx.arc(x, y + 3 + bob, 10, 0, Math.PI);
        ctx.fill();

        ctx.fillStyle = "#17130b";
        ctx.fillRect(x - 7, y - 6 + bob, 4, 4);
        ctx.fillRect(x + 3, y - 6 + bob, 4, 4);

        ctx.fillStyle = "#d88732";
        ctx.beginPath();
        ctx.moveTo(x - 6, y + bob);
        ctx.lineTo(x, y + 5 + bob);
        ctx.lineTo(x + 6, y + bob);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = "#5d4930";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x + 17, y + 5 + bob);
        ctx.lineTo(x + 20, y + 36 + bob);
        ctx.stroke();

    } else if (npc.type === "mila") {
        ctx.fillStyle = "#9d6f50";
        ctx.beginPath();
        ctx.ellipse(x, y + 22 + bob, 16, 18, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#d8b94f";
        ctx.beginPath();
        ctx.arc(x, y - 2 + bob, 14, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#9b3f4b";
        ctx.fillRect(x - 13, y + 10 + bob, 26, 5);

        ctx.fillStyle = "#17130b";
        ctx.fillRect(x - 7, y - 6 + bob, 4, 4);
        ctx.fillRect(x + 3, y - 6 + bob, 4, 4);

        ctx.fillStyle = "#d88732";
        ctx.beginPath();
        ctx.moveTo(x - 6, y + bob);
        ctx.lineTo(x, y + 5 + bob);
        ctx.lineTo(x + 6, y + bob);
        ctx.closePath();
        ctx.fill();

    } else if (npc.type === "guard") {
        ctx.fillStyle = "#5e6670";
        ctx.beginPath();
        ctx.ellipse(x, y + 22 + bob, 17, 19, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#c9ad59";
        ctx.beginPath();
        ctx.arc(x, y - 3 + bob, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#89939d";
        ctx.fillRect(x - 14, y - 13 + bob, 28, 8);

        ctx.fillStyle = "#17130b";
        ctx.fillRect(x - 7, y - 7 + bob, 4, 4);
        ctx.fillRect(x + 3, y - 7 + bob, 4, 4);

        ctx.fillStyle = "#d88732";
        ctx.beginPath();
        ctx.moveTo(x - 6, y + bob);
        ctx.lineTo(x, y + 5 + bob);
        ctx.lineTo(x + 6, y + bob);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = "#6d5435";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x + 20, y - 12 + bob);
        ctx.lineTo(x + 20, y + 38 + bob);
        ctx.stroke();

    } else {
        ctx.fillStyle = "#702d38";
        ctx.beginPath();
        ctx.ellipse(x, y + 22 + bob, 18, 20, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#d9bb5b";
        ctx.beginPath();
        ctx.arc(x, y - 3 + bob, 14, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#d5a932";
        ctx.beginPath();
        ctx.moveTo(x - 13, y - 12 + bob);
        ctx.lineTo(x - 8, y - 25 + bob);
        ctx.lineTo(x - 2, y - 15 + bob);
        ctx.lineTo(x + 3, y - 26 + bob);
        ctx.lineTo(x + 8, y - 15 + bob);
        ctx.lineTo(x + 13, y - 24 + bob);
        ctx.lineTo(x + 12, y - 10 + bob);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#17130b";
        ctx.fillRect(x - 7, y - 8 + bob, 4, 4);
        ctx.fillRect(x + 3, y - 8 + bob, 4, 4);

        ctx.fillStyle = "#d88732";
        ctx.beginPath();
        ctx.moveTo(x - 6, y - 1 + bob);
        ctx.lineTo(x, y + 4 + bob);
        ctx.lineTo(x + 6, y - 1 + bob);
        ctx.closePath();
        ctx.fill();
    }

    ctx.restore();
}

function drawQuestMarker(ctx, x, y) {
    const bounce = Math.sin(npcIdleTime * 2) * 3;
    ctx.textAlign = "center";
    ctx.font = "bold 24px Arial";
    ctx.fillStyle = "#e6c54c";
    ctx.fillText("!", x, y - 50 + bounce);
}

function drawNPC() {

    const ctx = Game.ctx;

    npcs.forEach(npc => {
        const x = npc.x - Game.camera.x + 20;
        const y = npc.y - Game.camera.y;
        const distance = getNPCDistance(npc);

        drawDuckNPC(ctx, npc, x, y);

        if (distance < Game.tileSize * 2.5) {
            ctx.textAlign = "center";
            ctx.font = "bold 13px Arial";
            ctx.fillStyle = "#f2e7c9";
            ctx.fillText(npc.name, x, y - 48);

            if (!dialogueOpen && distance <= NPC_INTERACTION_DISTANCE) {
                ctx.font = "12px Arial";
                ctx.fillStyle = "#d4b85c";
                ctx.fillText("E — Parler", x, y - 64);
            }
        }

        if (!dialogueOpen && shouldShowQuestMarker(npc))
            drawQuestMarker(ctx, x, y);
    });
}

