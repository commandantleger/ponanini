#!/usr/bin/env python3
from pathlib import Path
import shutil
import re
import subprocess
import sys

ROOT = Path("/home/paulo/ponanini")

PLAYER = ROOT / "player.js"
NPC = ROOT / "npc.js"
QUEST = ROOT / "quest.js"
MAP = ROOT / "map.js"

PLAYER_CONTENT = 'const player = {\n    x: 21 * Game.tileSize,\n    y: 69 * Game.tileSize,\n\n    w: 40,\n    h: 40,\n\n    speed: 4,\n    direction: "down",\n    moving: false,\n    walkTime: 0\n};\n\nconst keys = {};\nlet portalPressed = false;\nlet portalMessage = false;\n\nconst ARRIVAL_X = 21;\nconst ARRIVAL_Y = 69;\nconst ARRIVAL_Z = 760;\n\nconst playerArrival = {\n    active: false,\n    started: false,\n    timer: 0,\n    z: ARRIVAL_Z,\n    velocity: 0,\n    gravity: 420,\n    impact: 0,\n    particles: []\n};\n\nwindow.addEventListener("keydown", event => {\n    keys[event.key.toLowerCase()] = true;\n});\n\nwindow.addEventListener("keyup", event => {\n    keys[event.key.toLowerCase()] = false;\n\n    if (event.key.toLowerCase() === "e")\n        portalPressed = false;\n});\n\nfunction startPlayerArrival() {\n    if (playerArrival.started || currentMap !== "village")\n        return;\n\n    playerArrival.started = true;\n    playerArrival.active = true;\n    playerArrival.timer = 0;\n    playerArrival.z = ARRIVAL_Z;\n    playerArrival.velocity = 0;\n    playerArrival.impact = 0;\n    playerArrival.particles = [];\n\n    player.x = ARRIVAL_X * Game.tileSize;\n    player.y = ARRIVAL_Y * Game.tileSize;\n    player.direction = "down";\n    player.moving = false;\n    player.walkTime = 0;\n}\n\nfunction updatePlayerArrival(dt) {\n    if (!playerArrival.active)\n        return;\n\n    playerArrival.timer += dt;\n\n    if (playerArrival.timer < 1.0)\n        return;\n\n    if (playerArrival.z > 0) {\n        playerArrival.velocity += playerArrival.gravity * dt;\n        playerArrival.z -= playerArrival.velocity * dt;\n\n        if (playerArrival.z <= 0) {\n            playerArrival.z = 0;\n            playerArrival.velocity = 0;\n            playerArrival.impact = 1;\n            createArrivalImpact();\n\n            if (\n                typeof addItem === "function" &&\n                !playerArrival.itemGiven\n            ) {\n                playerArrival.itemGiven = true;\n                addItem("✦ Fragment résiduel du portail");\n            }\n        }\n\n        return;\n    }\n\n    if (playerArrival.impact > 0) {\n        playerArrival.impact -= dt * 2.2;\n        updateArrivalParticles(dt);\n        return;\n    }\n\n    if (playerArrival.timer > 4.2)\n        playerArrival.active = false;\n}\n\nfunction createArrivalImpact() {\n    playerArrival.particles = [];\n\n    for (let i = 0; i < 30; i++) {\n        playerArrival.particles.push({\n            angle: Math.random() * Math.PI * 2,\n            speed: 40 + Math.random() * 110,\n            life: .4 + Math.random() * .5,\n            distance: 0,\n            size: 2 + Math.random() * 3\n        });\n    }\n}\n\nfunction updateArrivalParticles(dt) {\n    playerArrival.particles.forEach(p => {\n        p.life -= dt;\n        p.distance += p.speed * dt;\n    });\n\n    playerArrival.particles =\n        playerArrival.particles.filter(p => p.life > 0);\n}\n\nfunction updatePlayer() {\n    if (\n        typeof gameFinished !== "undefined" &&\n        gameFinished\n    )\n        return;\n\n    if (\n        !playerArrival.started &&\n        currentMap === "village"\n    )\n        startPlayerArrival();\n\n    if (playerArrival.active) {\n        updatePlayerArrival(1 / 60);\n        return;\n    }\n\n    if (\n        typeof dialogueOpen !== "undefined" &&\n        dialogueOpen\n    )\n        return;\n\n    let nx = player.x;\n    let ny = player.y;\n    let dx = 0;\n    let dy = 0;\n\n    if (\n        keys["z"] ||\n        keys["w"] ||\n        keys["arrowup"]\n    ) {\n        dy--;\n        player.direction = "up";\n    }\n\n    if (\n        keys["s"] ||\n        keys["arrowdown"]\n    ) {\n        dy++;\n        player.direction = "down";\n    }\n\n    if (\n        keys["q"] ||\n        keys["a"] ||\n        keys["arrowleft"]\n    ) {\n        dx--;\n        player.direction = "left";\n    }\n\n    if (\n        keys["d"] ||\n        keys["arrowright"]\n    ) {\n        dx++;\n        player.direction = "right";\n    }\n\n    if (dx && dy) {\n        dx *= Math.SQRT1_2;\n        dy *= Math.SQRT1_2;\n    }\n\n    player.moving = !!(dx || dy);\n\n    if (player.moving)\n        player.walkTime += .15;\n    else\n        player.walkTime = 0;\n\n    nx += dx * player.speed;\n    ny += dy * player.speed;\n\n    if (!collision(nx, player.y, player.w, player.h))\n        player.x = nx;\n\n    if (!collision(player.x, ny, player.w, player.h))\n        player.y = ny;\n\n    const tx = Math.floor(\n        player.x / Game.tileSize\n    );\n\n    const ty = Math.floor(\n        player.y / Game.tileSize\n    );\n\n    let onPortal = false;\n\n    if (\n        ty >= 0 &&\n        ty < WORLD.length &&\n        tx >= 0 &&\n        tx < WORLD[0].length\n    ) {\n        const tile = WORLD[ty][tx];\n\n        if (\n            tile === "D" &&\n            currentMap === "village" &&\n            bridgeOpen\n        ) {\n            onPortal = true;\n\n            if (!portalMessage) {\n                portalMessage = true;\n\n                openDialogue(\n                    "🌲 <b>Passage vers la forêt</b><br><br>" +\n                    "Appuie sur E pour entrer."\n                );\n            }\n\n            if (\n                keys["e"] &&\n                !portalPressed\n            ) {\n                portalPressed = true;\n                closeDialogue();\n                loadForest();\n            }\n        }\n    }\n\n    if (\n        !onPortal &&\n        portalMessage\n    ) {\n        portalMessage = false;\n        closeDialogue();\n    }\n}\n\nfunction drawArrivalPortal(x, y) {\n    const ctx = Game.ctx;\n    const t = playerArrival.timer;\n    const open = Math.min(1, t / 1.0);\n\n    if (open <= 0)\n        return;\n\n    const pulse =\n        1 + Math.sin(t * 4) * .04;\n\n    ctx.save();\n\n    ctx.translate(x, y);\n    ctx.scale(\n        open * pulse,\n        open * pulse\n    );\n\n    const glow =\n        ctx.createRadialGradient(\n            0, 0, 10,\n            0, 0, 125\n        );\n\n    glow.addColorStop(\n        0,\n        "rgba(100,130,255,.42)"\n    );\n\n    glow.addColorStop(\n        1,\n        "rgba(0,0,0,0)"\n    );\n\n    ctx.fillStyle = glow;\n    ctx.beginPath();\n    ctx.arc(\n        0,\n        0,\n        125,\n        0,\n        Math.PI * 2\n    );\n    ctx.fill();\n\n    ctx.strokeStyle =\n        "rgba(160,180,255,.95)";\n\n    ctx.lineWidth = 7;\n\n    ctx.beginPath();\n\n    ctx.ellipse(\n        0,\n        0,\n        55,\n        82,\n        0,\n        0,\n        Math.PI * 2\n    );\n\n    ctx.stroke();\n\n    ctx.strokeStyle =\n        "rgba(225,230,255,.65)";\n\n    ctx.lineWidth = 2;\n\n    ctx.beginPath();\n\n    ctx.ellipse(\n        0,\n        0,\n        42,\n        67,\n        0,\n        0,\n        Math.PI * 2\n    );\n\n    ctx.stroke();\n\n    ctx.restore();\n}\n\nfunction drawArrivalImpact(x, y) {\n    const ctx = Game.ctx;\n\n    if (playerArrival.impact <= 0)\n        return;\n\n    const progress =\n        1 - playerArrival.impact;\n\n    ctx.save();\n\n    ctx.strokeStyle =\n        `rgba(230,235,255,${playerArrival.impact})`;\n\n    ctx.lineWidth = 4;\n\n    ctx.beginPath();\n\n    ctx.ellipse(\n        x,\n        y + 38,\n        25 + progress * 80,\n        8 + progress * 20,\n        0,\n        0,\n        Math.PI * 2\n    );\n\n    ctx.stroke();\n\n    playerArrival.particles.forEach(p => {\n        ctx.globalAlpha =\n            Math.max(0, p.life / .8);\n\n        ctx.fillStyle = "#d8d0bd";\n\n        ctx.fillRect(\n            x + Math.cos(p.angle) * p.distance,\n            y + 38 -\n                Math.sin(p.angle) * p.distance,\n            p.size,\n            p.size\n        );\n    });\n\n    ctx.restore();\n}\n\nfunction drawDuckBody(ctx, cx, cy) {\n    ctx.fillStyle = "#d8b94f";\n\n    ctx.beginPath();\n\n    ctx.ellipse(\n        cx,\n        cy + 10,\n        14,\n        13,\n        0,\n        0,\n        Math.PI * 2\n    );\n\n    ctx.fill();\n\n    ctx.fillStyle = "#e4c65b";\n\n    ctx.beginPath();\n\n    ctx.arc(\n        cx,\n        cy - 6,\n        13,\n        0,\n        Math.PI * 2\n    );\n\n    ctx.fill();\n\n    ctx.fillStyle = "#17130b";\n\n    ctx.fillRect(\n        cx - 7,\n        cy - 10,\n        4,\n        4\n    );\n\n    ctx.fillRect(\n        cx + 3,\n        cy - 10,\n        4,\n        4\n    );\n\n    ctx.fillStyle = "#d88732";\n\n    ctx.beginPath();\n\n    ctx.moveTo(\n        cx - 6,\n        cy - 2\n    );\n\n    ctx.lineTo(\n        cx,\n        cy + 4\n    );\n\n    ctx.lineTo(\n        cx + 6,\n        cy - 2\n    );\n\n    ctx.closePath();\n\n    ctx.fill();\n\n    ctx.fillStyle = "#b89b3e";\n\n    ctx.beginPath();\n\n    ctx.ellipse(\n        cx - 10,\n        cy + 9,\n        6,\n        9,\n        -.2,\n        0,\n        Math.PI * 2\n    );\n\n    ctx.fill();\n\n    ctx.fillStyle = "#d88732";\n\n    ctx.fillRect(\n        cx - 10,\n        cy + 20,\n        7,\n        3\n    );\n\n    ctx.fillRect(\n        cx + 3,\n        cy + 20,\n        7,\n        3\n    );\n}\n\nfunction drawPlayer() {\n    const ctx = Game.ctx;\n\n    const x =\n        player.x -\n        Game.camera.x;\n\n    const groundY =\n        player.y -\n        Game.camera.y;\n\n    const y =\n        groundY -\n        (\n            playerArrival.active ?\n            playerArrival.z :\n            0\n        );\n\n    const cx = x + 20;\n\n    const bob =\n        player.moving ?\n        Math.sin(player.walkTime) * 1.5 :\n        0;\n\n    if (playerArrival.active) {\n        drawArrivalPortal(\n            cx,\n            groundY - ARRIVAL_Z\n        );\n\n        drawArrivalImpact(\n            cx,\n            groundY\n        );\n    }\n\n    ctx.fillStyle =\n        "rgba(0,0,0,.25)";\n\n    ctx.beginPath();\n\n    ctx.ellipse(\n        cx,\n        groundY + 39,\n        17,\n        5,\n        0,\n        0,\n        Math.PI * 2\n    );\n\n    ctx.fill();\n\n    ctx.save();\n\n    if (player.direction === "left") {\n        ctx.translate(\n            cx,\n            y + 20 + bob\n        );\n\n        ctx.scale(-1, 1);\n\n        drawDuckBody(\n            ctx,\n            0,\n            0\n        );\n\n    } else if (player.direction === "up") {\n\n        ctx.fillStyle = "#d8b94f";\n\n        ctx.beginPath();\n\n        ctx.ellipse(\n            cx,\n            y + 30 + bob,\n            14,\n            13,\n            0,\n            0,\n            Math.PI * 2\n        );\n\n        ctx.fill();\n\n        ctx.fillStyle = "#c5a845";\n\n        ctx.beginPath();\n\n        ctx.arc(\n            cx,\n            y + 13 + bob,\n            12,\n            0,\n            Math.PI * 2\n        );\n\n        ctx.fill();\n\n        ctx.fillStyle = "#b89b3e";\n\n        ctx.fillRect(\n            cx - 14,\n            y + 24 + bob,\n            7,\n            14\n        );\n\n        ctx.fillRect(\n            cx + 7,\n            y + 24 + bob,\n            7,\n            14\n        );\n\n    } else {\n        drawDuckBody(\n            ctx,\n            cx,\n            y + 20 + bob\n        );\n    }\n\n    ctx.restore();\n}\n'
NPC_CONTENT = 'const npcs = [\n    {\n        id: "marek",\n        name: "Marek",\n        x: 23 * Game.tileSize,\n        y: 29 * Game.tileSize,\n        type: "oldman",\n        dialogues: [\n            "Tu es tombé du ciel... Je t\'ai vu apparaître près du Grand Lac.",\n            "Ce n\'est pas une façon ordinaire d\'arriver à Ponan.",\n            "Tu affirmes venir d\'un autre monde ?",\n            "Alors écoute-moi bien : ce royaume est peuplé de canards, et ton arrivée n\'est probablement pas un accident.",\n            "Il y a très longtemps, certains anciens étudiaient les passages entre les mondes.",\n            "Ils appelaient ces passages les Portes de l\'Entre-Lac.",\n            "Ton portail a laissé un fragment. Garde-le caché.",\n            "Ponanini III s\'intéressait lui aussi à ces passages avant sa disparition.",\n            "Si tu veux comprendre pourquoi tu es ici, commence par parler à Mila dans le village.",\n            "Et si tu entends une voix dans la forêt... ne lui réponds pas."\n        ]\n    },\n\n    {\n        id: "mila",\n        name: "Mila",\n        x: 47 * Game.tileSize,\n        y: 25 * Game.tileSize,\n        type: "mila",\n        dialogues: [\n            "Tu es donc l\'humain dont Marek parlait.",\n            "Je n\'aurais jamais cru voir un humain de mes propres yeux.",\n            "Ponanini III étudiait les passages entre les mondes.",\n            "Après une découverte dans la forêt, il a interdit l\'accès à toute la région.",\n            "Quelques semaines plus tard, il a disparu.",\n            "La version officielle dit qu\'il a fui. Mais personne ici n\'y croit vraiment.",\n            "Si tu veux la vérité, le garde royal en sait probablement plus qu\'il ne le prétend."\n        ]\n    },\n\n    {\n        id: "guard",\n        name: "Garde royal",\n        x: 48 * Game.tileSize,\n        y: 22 * Game.tileSize,\n        type: "guard",\n        dialogues: [\n            "Halte. Tu n\'as rien à faire près du palais sans autorisation.",\n            "Oui, je sais ce que tu es. Toute la place parle déjà de l\'humain tombé du ciel.",\n            "Tu veux savoir ce qui est arrivé à Ponanini III ?",\n            "Officiellement, il a disparu après avoir été accusé de trahison.",\n            "Officieusement... il cherchait quelque chose dans la forêt.",\n            "Après sa disparition, Ponanini IV a interdit toute recherche sur cette affaire.",\n            "Si tu veux continuer, cherche les anciens symboles dans la forêt."\n        ]\n    },\n\n    {\n        id: "king",\n        name: "Ponanini IV",\n        x: 44 * Game.tileSize,\n        y: 12 * Game.tileSize,\n        type: "king",\n        dialogues: [\n            "Alors c\'est toi. L\'humain venu par le portail.",\n            "Je te conseille de ne pas fouiller dans les affaires de mon frère.",\n            "Ponanini III appartient au passé.",\n            "Si tu veux rester en vie à Ponan, apprends d\'abord à qui tu peux faire confiance."\n        ]\n    }\n];\n\nlet dialogueOpen = false;\nlet activeNPC = null;\nlet dialogueIndex = 0;\nlet dialogueCooldown = false;\nlet gameFinished = false;\n\nconst NPC_INTERACTION_DISTANCE =\n    Game.tileSize * 1.7;\n\nconst DIALOGUE_MAX_DISTANCE =\n    Game.tileSize * 3;\n\nlet npcIdleTime = 0;\n\nfunction getNPCDistance(npc) {\n    const dx =\n        player.x - npc.x;\n\n    const dy =\n        player.y - npc.y;\n\n    return Math.sqrt(\n        dx * dx +\n        dy * dy\n    );\n}\n\nfunction getClosestNPC() {\n    let closest = null;\n    let distance =\n        NPC_INTERACTION_DISTANCE;\n\n    npcs.forEach(npc => {\n        const d =\n            getNPCDistance(npc);\n\n        if (d < distance) {\n            closest = npc;\n            distance = d;\n        }\n    });\n\n    return closest;\n}\n\nfunction startNPCDialogue(npc) {\n    if (\n        !npc ||\n        dialogueOpen ||\n        dialogueCooldown ||\n        (\n            typeof playerArrival !== "undefined" &&\n            playerArrival.active\n        )\n    )\n        return;\n\n    dialogueOpen = true;\n    activeNPC = npc;\n    dialogueIndex = 0;\n    dialogueCooldown = true;\n\n    openDialogue(\n        "<b>" +\n        npc.name +\n        "</b><br><br>" +\n        npc.dialogues[0]\n    );\n\n    setTimeout(() => {\n        dialogueCooldown = false;\n    }, 180);\n}\n\nfunction closeNPCDialogue() {\n    dialogueOpen = false;\n    activeNPC = null;\n    dialogueIndex = 0;\n    dialogueCooldown = true;\n\n    closeDialogue();\n\n    setTimeout(() => {\n        dialogueCooldown = false;\n    }, 180);\n}\n\nfunction finishNPCDialogue(npc) {\n    if (!npc)\n        return;\n\n    if (\n        npc.id === "marek" &&\n        questStage === 0\n    ) {\n        completeObjective("marek");\n        return;\n    }\n\n    if (\n        npc.id === "mila" &&\n        questStage === 1\n    ) {\n        completeObjective("mila");\n        return;\n    }\n\n    if (\n        npc.id === "guard" &&\n        questStage === 2\n    ) {\n        completeObjective("guard");\n    }\n}\n\nwindow.addEventListener(\n    "keydown",\n    event => {\n\n        if (\n            event.code !== "KeyE" ||\n            event.repeat\n        )\n            return;\n\n        event.preventDefault();\n\n        if (dialogueOpen) {\n\n            if (!activeNPC)\n                return;\n\n            if (\n                getNPCDistance(activeNPC) >\n                DIALOGUE_MAX_DISTANCE\n            ) {\n                closeNPCDialogue();\n                return;\n            }\n\n            dialogueIndex++;\n\n            if (\n                dialogueIndex >=\n                activeNPC.dialogues.length\n            ) {\n                finishNPCDialogue(\n                    activeNPC\n                );\n\n                closeNPCDialogue();\n                return;\n            }\n\n            openDialogue(\n                "<b>" +\n                activeNPC.name +\n                "</b><br><br>" +\n                activeNPC.dialogues[\n                    dialogueIndex\n                ]\n            );\n\n            return;\n        }\n\n        const npc =\n            getClosestNPC();\n\n        if (npc)\n            startNPCDialogue(npc);\n    }\n);\n\nwindow.addEventListener(\n    "keydown",\n    event => {\n        if (event.code === "Escape" &&\n            dialogueOpen) {\n            event.preventDefault();\n            closeNPCDialogue();\n        }\n    }\n);\n\nfunction updateNPC() {\n    npcIdleTime += .025;\n\n    if (\n        dialogueOpen &&\n        activeNPC &&\n        getNPCDistance(activeNPC) >\n        DIALOGUE_MAX_DISTANCE\n    ) {\n        closeNPCDialogue();\n    }\n}\n\nfunction shouldShowQuestMarker(npc) {\n\n    if (\n        questStage === 0 &&\n        npc.id === "marek"\n    )\n        return true;\n\n    if (\n        questStage === 1 &&\n        npc.id === "mila"\n    )\n        return true;\n\n    if (\n        questStage === 2 &&\n        npc.id === "guard"\n    )\n        return true;\n\n    return false;\n}\n\nfunction drawDuckNPC(ctx, npc, x, y) {\n    const bob =\n        Math.sin(\n            npcIdleTime +\n            npc.x * .01\n        ) * .8;\n\n    ctx.save();\n\n    if (npc.type === "oldman") {\n\n        ctx.fillStyle = "#77705b";\n        ctx.beginPath();\n        ctx.ellipse(\n            x, y + 22 + bob,\n            16, 18,\n            0, 0, Math.PI * 2\n        );\n        ctx.fill();\n\n        ctx.fillStyle = "#c9b66a";\n        ctx.beginPath();\n        ctx.arc(\n            x, y - 2 + bob,\n            14,\n            0, Math.PI * 2\n        );\n        ctx.fill();\n\n        ctx.fillStyle = "#e7e0c7";\n        ctx.beginPath();\n        ctx.arc(\n            x, y + 3 + bob,\n            10,\n            0, Math.PI\n        );\n        ctx.fill();\n\n        ctx.fillStyle = "#17130b";\n        ctx.fillRect(\n            x - 7, y - 6 + bob, 4, 4\n        );\n        ctx.fillRect(\n            x + 3, y - 6 + bob, 4, 4\n        );\n\n        ctx.fillStyle = "#d88732";\n        ctx.beginPath();\n        ctx.moveTo(x - 6, y + bob);\n        ctx.lineTo(x, y + 5 + bob);\n        ctx.lineTo(x + 6, y + bob);\n        ctx.closePath();\n        ctx.fill();\n\n        ctx.strokeStyle = "#5d4930";\n        ctx.lineWidth = 3;\n        ctx.beginPath();\n        ctx.moveTo(\n            x + 17,\n            y + 5 + bob\n        );\n        ctx.lineTo(\n            x + 20,\n            y + 36 + bob\n        );\n        ctx.stroke();\n\n    } else if (npc.type === "mila") {\n\n        ctx.fillStyle = "#9d6f50";\n        ctx.beginPath();\n        ctx.ellipse(\n            x, y + 22 + bob,\n            16, 18,\n            0, 0, Math.PI * 2\n        );\n        ctx.fill();\n\n        ctx.fillStyle = "#d8b94f";\n        ctx.beginPath();\n        ctx.arc(\n            x, y - 2 + bob,\n            14,\n            0, Math.PI * 2\n        );\n        ctx.fill();\n\n        ctx.fillStyle = "#9b3f4b";\n        ctx.fillRect(\n            x - 13,\n            y + 10 + bob,\n            26,\n            5\n        );\n\n        ctx.fillStyle = "#17130b";\n        ctx.fillRect(\n            x - 7, y - 6 + bob, 4, 4\n        );\n        ctx.fillRect(\n            x + 3, y - 6 + bob, 4, 4\n        );\n\n        ctx.fillStyle = "#d88732";\n        ctx.beginPath();\n        ctx.moveTo(x - 6, y + bob);\n        ctx.lineTo(x, y + 5 + bob);\n        ctx.lineTo(x + 6, y + bob);\n        ctx.closePath();\n        ctx.fill();\n\n    } else if (npc.type === "guard") {\n\n        ctx.fillStyle = "#5e6670";\n        ctx.beginPath();\n        ctx.ellipse(\n            x, y + 22 + bob,\n            17, 19,\n            0, 0, Math.PI * 2\n        );\n        ctx.fill();\n\n        ctx.fillStyle = "#c9ad59";\n        ctx.beginPath();\n        ctx.arc(\n            x, y - 3 + bob,\n            12,\n            0, Math.PI * 2\n        );\n        ctx.fill();\n\n        ctx.fillStyle = "#89939d";\n        ctx.fillRect(\n            x - 14,\n            y - 13 + bob,\n            28,\n            8\n        );\n\n        ctx.fillStyle = "#17130b";\n        ctx.fillRect(\n            x - 7, y - 7 + bob, 4, 4\n        );\n        ctx.fillRect(\n            x + 3, y - 7 + bob, 4, 4\n        );\n\n        ctx.fillStyle = "#d88732";\n        ctx.beginPath();\n        ctx.moveTo(x - 6, y + bob);\n        ctx.lineTo(x, y + 5 + bob);\n        ctx.lineTo(x + 6, y + bob);\n        ctx.closePath();\n        ctx.fill();\n\n        ctx.strokeStyle = "#6d5435";\n        ctx.lineWidth = 3;\n        ctx.beginPath();\n        ctx.moveTo(\n            x + 20,\n            y - 12 + bob\n        );\n        ctx.lineTo(\n            x + 20,\n            y + 38 + bob\n        );\n        ctx.stroke();\n\n    } else {\n\n        ctx.fillStyle = "#702d38";\n        ctx.beginPath();\n        ctx.ellipse(\n            x, y + 22 + bob,\n            18, 20,\n            0, 0, Math.PI * 2\n        );\n        ctx.fill();\n\n        ctx.fillStyle = "#d9bb5b";\n        ctx.beginPath();\n        ctx.arc(\n            x, y - 3 + bob,\n            14,\n            0, Math.PI * 2\n        );\n        ctx.fill();\n\n        ctx.fillStyle = "#d5a932";\n        ctx.beginPath();\n        ctx.moveTo(x - 13, y - 12 + bob);\n        ctx.lineTo(x - 8, y - 25 + bob);\n        ctx.lineTo(x - 2, y - 15 + bob);\n        ctx.lineTo(x + 3, y - 26 + bob);\n        ctx.lineTo(x + 8, y - 15 + bob);\n        ctx.lineTo(x + 13, y - 24 + bob);\n        ctx.lineTo(x + 12, y - 10 + bob);\n        ctx.closePath();\n        ctx.fill();\n\n        ctx.fillStyle = "#17130b";\n        ctx.fillRect(\n            x - 7, y - 8 + bob, 4, 4\n        );\n        ctx.fillRect(\n            x + 3, y - 8 + bob, 4, 4\n        );\n\n        ctx.fillStyle = "#d88732";\n        ctx.beginPath();\n        ctx.moveTo(x - 6, y - 1 + bob);\n        ctx.lineTo(x, y + 4 + bob);\n        ctx.lineTo(x + 6, y - 1 + bob);\n        ctx.closePath();\n        ctx.fill();\n    }\n\n    ctx.restore();\n}\n\nfunction drawQuestMarker(ctx, x, y) {\n    const bounce =\n        Math.sin(npcIdleTime * 2) * 3;\n\n    ctx.textAlign = "center";\n    ctx.font = "bold 24px Arial";\n    ctx.fillStyle = "#e6c54c";\n\n    ctx.fillText(\n        "!",\n        x,\n        y - 50 + bounce\n    );\n}\n\nfunction drawNPC() {\n    const ctx = Game.ctx;\n\n    npcs.forEach(npc => {\n\n        const x =\n            npc.x -\n            Game.camera.x +\n            20;\n\n        const y =\n            npc.y -\n            Game.camera.y;\n\n        const distance =\n            getNPCDistance(npc);\n\n        drawDuckNPC(\n            ctx,\n            npc,\n            x,\n            y\n        );\n\n        if (\n            distance <\n            Game.tileSize * 2.5\n        ) {\n            ctx.textAlign = "center";\n            ctx.font = "bold 13px Arial";\n            ctx.fillStyle = "#f2e7c9";\n\n            ctx.fillText(\n                npc.name,\n                x,\n                y - 48\n            );\n\n            if (\n                !dialogueOpen &&\n                distance <=\n                NPC_INTERACTION_DISTANCE\n            ) {\n                ctx.font = "12px Arial";\n                ctx.fillStyle = "#d4b85c";\n\n                ctx.fillText(\n                    "E — Parler",\n                    x,\n                    y - 64\n                );\n            }\n        }\n\n        if (\n            !dialogueOpen &&\n            shouldShowQuestMarker(npc)\n        )\n            drawQuestMarker(\n                ctx,\n                x,\n                y\n            );\n    });\n}\n'
QUEST_CONTENT = 'const quests = {\n    intro: {\n        name: "Un monde étranger",\n        description:\n            "Trouver quelqu\'un capable de t\'expliquer où tu es.",\n        completed: false,\n        objective: false\n    },\n\n    village: {\n        name: "Les portes de l\'Entre-Lac",\n        description:\n            "Rejoindre Mila et découvrir ce que Ponan cache sur les portails.",\n        completed: false,\n        objective: false\n    },\n\n    king: {\n        name: "L\'ombre de Ponanini III",\n        description:\n            "Découvrir ce qui est réellement arrivé à l\'ancien roi.",\n        completed: false,\n        objective: false\n    }\n};\n\nlet questStage = 0;\n\nfunction updateQuest() {\n    const quest =\n        document.getElementById("quest");\n\n    if (!quest)\n        return;\n\n    if (questStage === 0) {\n        quest.innerHTML =\n            "📜 <b>" +\n            quests.intro.name +\n            "</b><br>" +\n            "□ Parler à Marek, l\'ancien du lac";\n        return;\n    }\n\n    if (questStage === 1) {\n        quest.innerHTML =\n            "📜 <b>" +\n            quests.village.name +\n            "</b><br>" +\n            "□ Retrouver Mila dans le village";\n        return;\n    }\n\n    if (questStage === 2) {\n        quest.innerHTML =\n            "📜 <b>" +\n            quests.king.name +\n            "</b><br>" +\n            "□ Interroger le garde royal sur Ponanini III";\n        return;\n    }\n\n    quest.innerHTML =\n        "❓ <b>Les secrets de Ponan</b><br>" +\n        "Une signature inconnue semble liée à ton arrivée.";\n}\n\nfunction completeObjective(objective) {\n\n    if (\n        questStage === 0 &&\n        objective === "marek"\n    ) {\n        quests.intro.objective = true;\n        quests.intro.completed = true;\n        questStage = 1;\n\n        showQuestMessage(\n            "✓ <b>QUÊTE TERMINÉE</b><br>" +\n            "Tu sais maintenant où tu es."\n        );\n\n        return;\n    }\n\n    if (\n        questStage === 1 &&\n        objective === "mila"\n    ) {\n        quests.village.objective = true;\n        quests.village.completed = true;\n        questStage = 2;\n\n        showQuestMessage(\n            "✓ <b>NOUVELLE PISTE</b><br>" +\n            "Mila t\'a parlé de Ponanini III."\n        );\n\n        return;\n    }\n\n    if (\n        questStage === 2 &&\n        objective === "guard"\n    ) {\n        quests.king.objective = true;\n        quests.king.completed = true;\n        questStage = 3;\n\n        showQuestMessage(\n            "✓ <b>INFORMATION OBTENUE</b><br>" +\n            "La forêt pourrait contenir la réponse."\n        );\n    }\n}\n\nfunction showQuestMessage(message) {\n    const quest =\n        document.getElementById("quest");\n\n    if (!quest)\n        return;\n\n    quest.innerHTML = message;\n\n    setTimeout(\n        updateQuest,\n        2200\n    );\n}\n\nfunction advanceQuest(stage) {\n    if (stage <= questStage)\n        return;\n\n    questStage = stage;\n    updateQuest();\n}\n\nfunction resetQuests() {\n    questStage = 0;\n\n    quests.intro.completed = false;\n    quests.intro.objective = false;\n\n    quests.village.completed = false;\n    quests.village.objective = false;\n\n    quests.king.completed = false;\n    quests.king.objective = false;\n\n    updateQuest();\n}\n\nupdateQuest();\n'

def backup(path):
    if path.exists():
        backup_path = path.with_suffix(path.suffix + ".before_full_fix")
        shutil.copy2(path, backup_path)
        print(f"[BACKUP] {backup_path.name}")

def write(path, content):
    path.write_text(content, encoding="utf-8")
    print(f"[OK] {path.name} remplacé")

def patch_map():
    text = MAP.read_text(encoding="utf-8")

    old_camera = """    Game.camera.x =
        player.x -
        Game.canvas.width / 2;

    Game.camera.y =
        player.y -
        Game.canvas.height / 2;"""

    new_camera = """    const mapWidth =
        WORLD[0].length * Game.tileSize;

    const mapHeight =
        WORLD.length * Game.tileSize;

    const viewWidth =
        Game.canvas.width;

    const viewHeight =
        Game.canvas.height;

    Game.camera.x =
        player.x + 20 -
        viewWidth / 2;

    Game.camera.y =
        player.y + 20 -
        viewHeight / 2;

    Game.camera.x =
        Math.max(
            0,
            Math.min(
                Game.camera.x,
                Math.max(0, mapWidth - viewWidth)
            )
        );

    Game.camera.y =
        Math.max(
            0,
            Math.min(
                Game.camera.y,
                Math.max(0, mapHeight - viewHeight)
            )
        );"""

    if old_camera not in text:
        print("[ERREUR] Bloc caméra introuvable dans map.js.")
        return False

    text = text.replace(old_camera, new_camera, 1)

    if "function drawLakeArrivalDecoration()" not in text:
        marker = """    drawVillageDecoration();

}"""

        addition = """    drawVillageDecoration();
    drawLakeArrivalDecoration();

}

function drawLakeArrivalDecoration() {
    if (currentMap !== "village")
        return;

    const ctx = Game.ctx;
    const T = Game.tileSize;

    const reeds = [
        [20, 68],
        [20, 71],
        [20, 74],
        [21, 66],
        [21, 72]
    ];

    reeds.forEach(pos => {
        const x =
            pos[0] * T -
            Game.camera.x;

        const y =
            pos[1] * T -
            Game.camera.y;

        if (
            x < -T ||
            x > Game.canvas.width + T ||
            y < -T ||
            y > Game.canvas.height + T
        )
            return;

        ctx.strokeStyle = "#467c3f";
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.moveTo(x + 20, y + 50);
        ctx.lineTo(x + 16, y + 20);
        ctx.moveTo(x + 20, y + 50);
        ctx.lineTo(x + 25, y + 16);
        ctx.stroke();
    });

    const sx =
        21 * T -
        Game.camera.x;

    const sy =
        69 * T -
        Game.camera.y;

    ctx.fillStyle =
        "rgba(210,190,130,.18)";

    ctx.beginPath();

    ctx.ellipse(
        sx + 20,
        sy + 48,
        34,
        8,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();
}"""

        if marker not in text:
            print("[ERREUR] Point d'insertion du décor introuvable dans map.js.")
            return False

        text = text.replace(marker, addition, 1)

    MAP.write_text(text, encoding="utf-8")
    print("[OK] map.js caméra + zone d'arrivée améliorées")
    return True

def check(path):
    result = subprocess.run(
        ["node", "--check", str(path)],
        capture_output=True,
        text=True
    )

    if result.returncode:
        print(f"[ERREUR SYNTAXE] {path.name}")
        print(result.stderr)
        return False

    print(f"[OK] syntaxe {path.name}")
    return True

def main():
    if not ROOT.exists():
        print(f"Projet introuvable : {ROOT}")
        sys.exit(1)

    for path in (PLAYER, NPC, QUEST, MAP):
        backup(path)

    write(PLAYER, PLAYER_CONTENT)
    write(NPC, NPC_CONTENT)
    write(QUEST, QUEST_CONTENT)

    if not patch_map():
        sys.exit(1)

    ok = all(check(path) for path in
             (PLAYER, NPC, QUEST, MAP))

    if not ok:
        sys.exit(1)

    print()
    print("======================================")
    print(" CORRECTION GLOBALE TERMINÉE")
    print("======================================")
    print()
    print("Spawn : rive du Grand Lac")
    print("Marek : village, loin du spawn")
    print("Portail : au-dessus du joueur")
    print("Chute : ralentie")
    print("Caméra : centrée + limitée à la map")
    print("Dialogue : fermeture à distance + E + ESC")
    print("Quêtes : Marek -> Mila -> Garde -> secrets")
    print()
    print("Lance maintenant le jeu sans modifier les fichiers.")

if __name__ == "__main__":
    main()
