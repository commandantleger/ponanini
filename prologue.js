const Prologue = {

    active: false,
    scene: 0,
    timer: 0,
    textIndex: 0,
    finishedText: false,
    visualTime: 0,
    fade: 1,

    scenes: [

        {
            title: "IL ÉTAIT UNE FOIS...",
            text:
                "On raconte que certains royaumes naissent dans la gloire... " +
                "et meurent dans le mensonge.",
            duration: 15000,
            speed: 52,
            visual: "kingdom"
        },

        {
            title: "LE ROYAUME DE PONAN",
            text:
                "Au-delà des montagnes se dressait Ponan, " +
                "un royaume gouverné depuis des générations par une ancienne lignée de canards.",
            duration: 18000,
            speed: 48,
            visual: "castle"
        },

        {
            title: "PONANINI III",
            text:
                "À cette époque, la couronne appartenait à Ponanini III. " +
                "Un roi respecté, aimé de son peuple... et convaincu que son royaume était en sécurité.",
            duration: 22000,
            speed: 48,
            visual: "throne"
        },

        {
            title: "DERRIÈRE LE TRÔNE",
            text:
                "Mais derrière chaque couronne se cache une ombre. " +
                "Dans le palais, quelqu'un attendait patiemment son heure.",
            duration: 18000,
            speed: 50,
            visual: "betrayal"
        },

        {
            title: "PONANINI IV",
            text:
                "Son propre frère, Ponanini IV, avait compris une chose : " +
                "il ne suffisait pas de prendre le trône. Il fallait convaincre le royaume qu'il le méritait.",
            duration: 22000,
            speed: 46,
            visual: "falseking"
        },

        {
            title: "LA CHUTE",
            text:
                "De faux témoignages furent fabriqués. Des gardes furent achetés. " +
                "Et bientôt, Ponanini III fut accusé de crimes qu'il n'avait jamais commis.",
            duration: 21000,
            speed: 46,
            visual: "exile"
        },

        {
            title: "LE NETHER",
            text:
                "Son châtiment fut pire que la mort. " +
                "Ponanini III fut banni dans le Nether, un monde oublié où la lumière elle-même semblait avoir été condamnée.",
            duration: 23000,
            speed: 44,
            visual: "nether"
        },

        {
            title: "LES TROIS FRAGMENTS",
            text:
                "Des années passèrent. Puis il découvrit une ancienne légende : " +
                "trois fragments permettaient d'ouvrir une porte entre le Nether et Ponan.",
            duration: 21000,
            speed: 45,
            visual: "fragments"
        },

        {
            title: "UNE PROPOSITION",
            text:
                "Mais il ne pouvait pas quitter le Nether seul. " +
                "Alors il attendit. Jusqu'au jour où quelqu'un apparut devant son portail.",
            duration: 19000,
            speed: 48,
            visual: "proposal"
        },

        {
            title: "ET C'EST LÀ QUE TU INTERVIENS",
            text:
                "Ponanini III te raconta son histoire. Il se présenta comme une victime. " +
                "Il te demanda de retrouver les trois fragments. " +
                "Mais une question demeure...",
            duration: 22000,
            speed: 45,
            visual: "beginning"
        }

    ],

    start() {

        this.active = true;
        this.scene = 0;
        this.timer = 0;
        this.textIndex = 0;
        this.finishedText = false;
        this.visualTime = 0;
        this.fade = 1;

        this.hideHUD();

    },

    hideHUD() {

        const hud = document.getElementById("hud");

        if (hud)
            hud.style.display = "none";

        const dialogue = document.getElementById("dialogue");

        if (dialogue)
            dialogue.classList.add("hidden");

        const inventory = document.getElementById("inventory");

        if (inventory)
            inventory.classList.add("hidden");

    },

    showHUD() {

        const hud = document.getElementById("hud");

        if (hud)
            hud.style.display = "flex";

    },

    update(dt) {

        if (!this.active)
            return;

        const scene = this.scenes[this.scene];

        if (!scene)
            return;

        this.timer += dt;
        this.visualTime += dt;

        if (this.fade > 0) {

            this.fade -= dt * 1.2;

            if (this.fade < 0)
                this.fade = 0;

        }

        if (!this.finishedText) {

            this.textIndex = Math.floor(
                this.timer * 1000 / scene.speed
            );

            if (this.textIndex >= scene.text.length) {

                this.textIndex = scene.text.length;
                this.finishedText = true;

            }

        }

        if (
            this.finishedText &&
            this.timer > scene.duration / 1000
        ) {

            this.nextScene();

        }

    },

    nextScene() {

        if (this.scene >= this.scenes.length - 1) {

            this.finish();
            return;

        }

        this.scene++;
        this.timer = 0;
        this.textIndex = 0;
        this.finishedText = false;
        this.visualTime = 0;
        this.fade = 1;

    },

    skipText() {

        const scene = this.scenes[this.scene];

        if (!scene)
            return;

        if (!this.finishedText) {

            this.textIndex = scene.text.length;
            this.finishedText = true;

            return;

        }

        this.nextScene();

    },

    finish() {

        this.active = false;

        this.scene = 0;
        this.timer = 0;
        this.textIndex = 0;
        this.finishedText = false;

        this.showHUD();

        if (typeof finishPrologue === "function") {

            finishPrologue();

        } else if (window.Game) {

            Game.running = true;

        }

    },

    draw() {

        const ctx = Game.ctx;
        const w = Game.canvas.width;
        const h = Game.canvas.height;

        const scene = this.scenes[this.scene];

        if (!scene)
            return;

        ctx.clearRect(0, 0, w, h);

        switch (scene.visual) {

            case "kingdom":
                this.drawKingdom();
                break;

            case "castle":
                this.drawCastle();
                break;

            case "throne":
                this.drawThrone();
                break;

            case "betrayal":
                this.drawBetrayal();
                break;

            case "falseking":
                this.drawFalseKing();
                break;

            case "exile":
                this.drawExile();
                break;

            case "nether":
                this.drawNether();
                break;

            case "fragments":
                this.drawFragments();
                break;

            case "proposal":
                this.drawProposal();
                break;

            case "beginning":
                this.drawBeginning();
                break;

        }

        this.drawVignette();
        this.drawTitle(scene);
        this.drawDialogue(scene);
        this.drawFade();

    },

    drawVignette() {

        const ctx = Game.ctx;
        const w = Game.canvas.width;
        const h = Game.canvas.height;

        const gradient = ctx.createRadialGradient(
            w / 2,
            h / 2,
            h * 0.15,
            w / 2,
            h / 2,
            h * 0.8
        );

        gradient.addColorStop(
            0,
            "rgba(0,0,0,0)"
        );

        gradient.addColorStop(
            1,
            "rgba(0,0,0,.8)"
        );

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);

    },

    drawTitle(scene) {

        const ctx = Game.ctx;
        const w = Game.canvas.width;

        ctx.textAlign = "center";

        ctx.font = "bold 30px Georgia";
        ctx.fillStyle = "#e2bd52";

        ctx.fillText(
            scene.title,
            w / 2,
            60
        );

    },

    drawDialogue(scene) {

        const ctx = Game.ctx;

        const w = Game.canvas.width;
        const h = Game.canvas.height;

        const boxW = Math.min(
            900,
            w * .82
        );

        const boxH = 170;

        const x = (w - boxW) / 2;
        const y = h - 220;

        ctx.fillStyle = "rgba(3,5,10,.92)";

        ctx.fillRect(
            x,
            y,
            boxW,
            boxH
        );

        ctx.strokeStyle = "#d5ae45";
        ctx.lineWidth = 3;

        ctx.strokeRect(
            x,
            y,
            boxW,
            boxH
        );

        ctx.textAlign = "left";

        ctx.font = "bold 18px Georgia";
        ctx.fillStyle = "#d5ae45";

        ctx.fillText(
            "NARRATEUR",
            x + 25,
            y + 30
        );

        const text = scene.text.substring(
            0,
            this.textIndex
        );

        ctx.font = "21px Georgia";
        ctx.fillStyle = "#f3f0e6";

        this.wrapText(
            text,
            x + 25,
            y + 70,
            boxW - 50,
            30
        );

        ctx.textAlign = "center";

        ctx.font = "15px Arial";
        ctx.fillStyle = "rgba(255,255,255,.65)";

        ctx.fillText(
            this.finishedText
                ? "ESPACE : continuer"
                : "ESPACE : afficher le texte",
            w / 2,
            h - 25
        );

    },

    wrapText(text, x, y, maxWidth, lineHeight) {

        const ctx = Game.ctx;

        const words = text.split(" ");

        let line = "";

        for (let i = 0; i < words.length; i++) {

            const test = line + words[i] + " ";

            if (
                ctx.measureText(test).width > maxWidth &&
                line !== ""
            ) {

                ctx.fillText(
                    line,
                    x,
                    y
                );

                line = words[i] + " ";
                y += lineHeight;

            } else {

                line = test;

            }

        }

        ctx.fillText(
            line,
            x,
            y
        );

    },

    drawFade() {

        if (this.fade <= 0)
            return;

        const ctx = Game.ctx;

        ctx.fillStyle =
            `rgba(0,0,0,${this.fade})`;

        ctx.fillRect(
            0,
            0,
            Game.canvas.width,
            Game.canvas.height
        );

    },

    /*
    ========================================
    SCÈNE 1
    ========================================
    */

    drawKingdom() {

        const ctx = Game.ctx;
        const w = Game.canvas.width;
        const h = Game.canvas.height;

        const sky = ctx.createLinearGradient(
            0,
            0,
            0,
            h
        );

        sky.addColorStop(
            0,
            "#030611"
        );

        sky.addColorStop(
            .55,
            "#10294b"
        );

        sky.addColorStop(
            1,
            "#1b3550"
        );

        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, w, h);

        /* Lune */

        ctx.fillStyle = "#e8d79b";

        ctx.beginPath();

        ctx.arc(
            w * .78,
            h * .18,
            55,
            0,
            Math.PI * 2
        );

        ctx.fill();

        /* Nuages */

        ctx.fillStyle =
            "rgba(5,10,20,.7)";

        const cloud =
            (this.visualTime * 15) %
            (w + 400) - 200;

        this.cloud(
            cloud,
            130,
            1
        );

        this.cloud(
            cloud - 450,
            210,
            .7
        );

        /* Montagnes */

        ctx.fillStyle = "#08111f";

        ctx.beginPath();

        ctx.moveTo(0, h * .65);

        ctx.lineTo(
            w * .18,
            h * .38
        );

        ctx.lineTo(
            w * .32,
            h * .65
        );

        ctx.lineTo(
            w * .50,
            h * .32
        );

        ctx.lineTo(
            w * .70,
            h * .65
        );

        ctx.lineTo(
            w * .88,
            h * .40
        );

        ctx.lineTo(w, h * .65);

        ctx.lineTo(w, h);

        ctx.lineTo(0, h);

        ctx.closePath();

        ctx.fill();

        /* Royaume */

        this.castle(
            w / 2,
            h * .70,
            .85
        );

    },

    /*
    ========================================
    SCÈNE 2
    ========================================
    */

    drawCastle() {

        const ctx = Game.ctx;
        const w = Game.canvas.width;
        const h = Game.canvas.height;

        ctx.fillStyle = "#06101d";
        ctx.fillRect(0, 0, w, h);

        /* étoiles */

        ctx.fillStyle = "#d8c77f";

        for (let i = 0; i < 40; i++) {

            const x =
                (i * 137) % w;

            const y =
                (i * 71) % (h * .55);

            ctx.fillRect(
                x,
                y,
                2,
                2
            );

        }

        /*
        Zoom progressif.
        On donne l'impression de pénétrer
        dans le royaume.
        */

        const progress =
            Math.min(
                1,
                this.visualTime / 14
            );

        const scale =
            .65 +
            progress * .9;

        const centerX = w / 2;
        const centerY = h * .62;

        ctx.save();

        ctx.translate(
            centerX,
            centerY
        );

        ctx.scale(
            scale,
            scale
        );

        ctx.translate(
            -centerX,
            -centerY
        );

        this.castle(
            centerX,
            centerY,
            1
        );

        ctx.restore();

        /* Route vers le château */

        ctx.fillStyle = "#171b24";

        ctx.beginPath();

        ctx.moveTo(
            w * .35,
            h
        );

        ctx.lineTo(
            w * .65,
            h
        );

        ctx.lineTo(
            w * .54,
            h * .58
        );

        ctx.lineTo(
            w * .46,
            h * .58
        );

        ctx.closePath();

        ctx.fill();

        /* particules de voyage */

        ctx.fillStyle =
            "rgba(220,190,80,.5)";

        for (let i = 0; i < 15; i++) {

            const x =
                (i * 97 +
                this.visualTime * 25) %
                w;

            const y =
                h * .55 +
                Math.sin(
                    this.visualTime + i
                ) * 30;

            ctx.fillRect(
                x,
                y,
                2,
                2
            );

        }

    },

    /*
    ========================================
    SCÈNE 3
    ========================================
    */

    drawThrone() {

        const ctx = Game.ctx;
        const w = Game.canvas.width;
        const h = Game.canvas.height;

        ctx.fillStyle = "#121a27";
        ctx.fillRect(0, 0, w, h);

        /* murs */

        ctx.strokeStyle = "#29384b";
        ctx.lineWidth = 2;

        for (let y = 0; y < h * .7; y += 55) {

            for (let x = 0; x < w; x += 70) {

                ctx.strokeRect(
                    x,
                    y,
                    70,
                    55
                );

            }

        }

        /* sol */

        ctx.fillStyle = "#080b12";

        ctx.fillRect(
            0,
            h * .7,
            w,
            h * .3
        );

        /* tapis */

        ctx.fillStyle = "#63202b";

        ctx.beginPath();

        ctx.moveTo(
            w * .43,
            h * .55
        );

        ctx.lineTo(
            w * .57,
            h * .55
        );

        ctx.lineTo(
            w * .75,
            h
        );

        ctx.lineTo(
            w * .25,
            h
        );

        ctx.closePath();

        ctx.fill();

        /*
        Trône plus cohérent :
        dossier + assise + accoudoirs
        */

        const tx = w / 2;
        const ty = h * .43;

        ctx.fillStyle = "#6e5427";

        ctx.fillRect(
            tx - 105,
            ty - 125,
            210,
            180
        );

        ctx.fillStyle = "#321923";

        ctx.fillRect(
            tx - 80,
            ty - 100,
            160,
            130
        );

        ctx.fillStyle = "#b9973e";

        ctx.fillRect(
            tx - 115,
            ty + 10,
            35,
            45
        );

        ctx.fillRect(
            tx + 80,
            ty + 10,
            35,
            45
        );

        ctx.fillRect(
            tx - 105,
            ty + 42,
            210,
            15
        );

        /* Roi */

        this.duckKing(
            tx,
            h * .36,
            1.1
        );

        /* gardes */

        this.guard(
            w * .20,
            h * .57
        );

        this.guard(
            w * .80,
            h * .57
        );

        /* torches */

        this.torch(
            w * .08,
            h * .50
        );

        this.torch(
            w * .92,
            h * .50
        );

    },

    /*
    ========================================
    SCÈNE 4
    ========================================
    */

    drawBetrayal() {

        this.drawThrone();

        const ctx = Game.ctx;
        const w = Game.canvas.width;
        const h = Game.canvas.height;

        /* obscurité progressive */

        const dark =
            Math.min(
                .72,
                this.visualTime * .06
            );

        ctx.fillStyle =
            `rgba(0,0,10,${dark})`;

        ctx.fillRect(
            0,
            0,
            w,
            h
        );

        /*
        Ponanini IV apparaît comme
        un vrai canard dans l'ombre.
        */

        this.darkDuck(
            w * .72,
            h * .36,
            1.2
        );

        /* sourire */

        ctx.strokeStyle = "#a92d38";
        ctx.lineWidth = 3;

        ctx.beginPath();

        ctx.arc(
            w * .72,
            h * .40,
            25,
            .15,
            Math.PI - .15
        );

        ctx.stroke();

    },

    /*
    ========================================
    SCÈNE 5
    ========================================
    */

    drawFalseKing() {

        const ctx = Game.ctx;
        const w = Game.canvas.width;
        const h = Game.canvas.height;

        ctx.fillStyle = "#10080d";

        ctx.fillRect(
            0,
            0,
            w,
            h
        );

        /* murs */

        ctx.fillStyle = "#17111a";

        ctx.fillRect(
            0,
            0,
            w,
            h * .72
        );

        /* trône */

        const x = w / 2;
        const y = h * .55;

        ctx.fillStyle = "#6e5427";

        ctx.fillRect(
            x - 110,
            y - 135,
            220,
            190
        );

        ctx.fillStyle = "#321923";

        ctx.fillRect(
            x - 82,
            y - 108,
            164,
            130
        );

        /* Ponanini IV */

        this.duckKing(
            x,
            h * .39,
            1.15
        );

        /* ombre */

        ctx.fillStyle =
            "rgba(0,0,0,.45)";

        ctx.fillRect(
            x - 65,
            h * .38,
            130,
            55
        );

        /* yeux */

        ctx.fillStyle = "#c83a42";

        ctx.fillRect(
            x - 25,
            h * .395,
            12,
            6
        );

        ctx.fillRect(
            x + 13,
            h * .395,
            12,
            6
        );

    },

    /*
    ========================================
    SCÈNE 6
    ========================================
    */

    drawExile() {

        const ctx = Game.ctx;
        const w = Game.canvas.width;
        const h = Game.canvas.height;

        ctx.fillStyle = "#070a11";

        ctx.fillRect(
            0,
            0,
            w,
            h
        );

        /* château éloigné */

        ctx.globalAlpha = .25;

        this.castle(
            w / 2,
            h * .72,
            .7
        );

        ctx.globalAlpha = 1;

        /* route */

        ctx.fillStyle = "#181a22";

        ctx.beginPath();

        ctx.moveTo(
            w * .40,
            h
        );

        ctx.lineTo(
            w * .60,
            h
        );

        ctx.lineTo(
            w * .52,
            h * .55
        );

        ctx.lineTo(
            w * .48,
            h * .55
        );

        ctx.closePath();

        ctx.fill();

        /* Ponanini III exilé */

        this.duckKing(
            w / 2,
            h * .59,
            .85
        );

        /* couronne abandonnée */

        ctx.strokeStyle = "#b9973e";
        ctx.lineWidth = 4;

        ctx.beginPath();

        ctx.moveTo(
            w * .65,
            h * .75
        );

        ctx.lineTo(
            w * .69,
            h * .72
        );

        ctx.lineTo(
            w * .72,
            h * .75
        );

        ctx.stroke();

    },

    /*
    ========================================
    SCÈNE 7 — NETHER
    ========================================
    */

    drawNether() {

        const ctx = Game.ctx;
        const w = Game.canvas.width;
        const h = Game.canvas.height;

        /* ciel */

        const sky =
            ctx.createLinearGradient(
                0,
                0,
                0,
                h
            );

        sky.addColorStop(
            0,
            "#050009"
        );

        sky.addColorStop(
            .45,
            "#24050f"
        );

        sky.addColorStop(
            1,
            "#09030b"
        );

        ctx.fillStyle = sky;

        ctx.fillRect(
            0,
            0,
            w,
            h
        );

        /* lune rouge */

        ctx.fillStyle = "#b52632";

        ctx.beginPath();

        ctx.arc(
            w * .78,
            h * .20,
            75,
            0,
            Math.PI * 2
        );

        ctx.fill();

        /* montagnes */

        ctx.fillStyle = "#12030a";

        for (let i = -1; i < 8; i++) {

            ctx.beginPath();

            ctx.moveTo(
                i * 180,
                h * .78
            );

            ctx.lineTo(
                i * 180 + 90,
                h * .30
            );

            ctx.lineTo(
                i * 180 + 180,
                h * .78
            );

            ctx.closePath();

            ctx.fill();

        }

        /* lave */

        const lava =
            ctx.createLinearGradient(
                0,
                h * .72,
                0,
                h
            );

        lava.addColorStop(
            0,
            "#ff4b22"
        );

        lava.addColorStop(
            1,
            "#64120e"
        );

        ctx.fillStyle = lava;

        ctx.fillRect(
            0,
            h * .76,
            w,
            h * .24
        );

        /* fissures */

        ctx.strokeStyle = "#ff7b32";
        ctx.lineWidth = 4;

        for (let i = 0; i < 12; i++) {

            const x =
                i * 110 +
                Math.sin(i) * 30;

            ctx.beginPath();

            ctx.moveTo(
                x,
                h * .76
            );

            ctx.lineTo(
                x + 25,
                h * .84
            );

            ctx.lineTo(
                x - 10,
                h * .91
            );

            ctx.stroke();

        }

        /* portail */

        const px = w / 2;
        const py = h * .48;

        ctx.strokeStyle = "#7135ff";
        ctx.lineWidth = 14;

        ctx.beginPath();

        ctx.ellipse(
            px,
            py,
            145,
            210,
            0,
            0,
            Math.PI * 2
        );

        ctx.stroke();

        ctx.strokeStyle =
            "rgba(80,180,255,.65)";

        ctx.lineWidth = 4;

        ctx.beginPath();

        ctx.ellipse(
            px,
            py,
            125,
            190,
            0,
            0,
            Math.PI * 2
        );

        ctx.stroke();

        /* particules */

        ctx.fillStyle = "#ff6b32";

        for (let i = 0; i < 30; i++) {

            const x =
                (i * 97 +
                this.visualTime * 30) % w;

            const y =
                h * .25 +
                ((i * 43) % (h * .55));

            ctx.fillRect(
                x,
                y,
                3,
                5
            );

        }

        /* Ponanini III */

        this.duckKing(
            w / 2,
            h * .60,
            .95
        );

    },

    /*
    ========================================
    SCÈNE 8
    ========================================
    */

    drawFragments() {

        const ctx = Game.ctx;
        const w = Game.canvas.width;
        const h = Game.canvas.height;

        ctx.fillStyle = "#03050d";

        ctx.fillRect(
            0,
            0,
            w,
            h
        );

        /* cercle magique */

        ctx.strokeStyle = "#2768df";
        ctx.lineWidth = 3;

        ctx.beginPath();

        ctx.arc(
            w / 2,
            h * .45,
            190,
            0,
            Math.PI * 2
        );

        ctx.stroke();

        ctx.beginPath();

        ctx.arc(
            w / 2,
            h * .45,
            120,
            0,
            Math.PI * 2
        );

        ctx.stroke();

        const fragments = [

            [w / 2, h * .25],
            [w * .36, h * .60],
            [w * .64, h * .60]

        ];

        fragments.forEach(
            (p, i) => {

                const x = p[0];

                const y =
                    p[1] +
                    Math.sin(
                        this.visualTime * 2 + i
                    ) * 10;

                ctx.save();

                ctx.translate(
                    x,
                    y
                );

                ctx.rotate(
                    this.visualTime * .4
                );

                ctx.fillStyle =
                    i === 0
                        ? "#e1bc43"
                        : "#3278df";

                ctx.beginPath();

                ctx.moveTo(
                    0,
                    -35
                );

                ctx.lineTo(
                    25,
                    0
                );

                ctx.lineTo(
                    0,
                    35
                );

                ctx.lineTo(
                    -25,
                    0
                );

                ctx.closePath();

                ctx.fill();

                ctx.strokeStyle = "#fff";

                ctx.stroke();

                ctx.restore();

            }
        );

    },

    /*
    ========================================
    SCÈNE 9
    ========================================
    */

    drawProposal() {

        this.drawNether();

        const ctx = Game.ctx;
        const w = Game.canvas.width;
        const h = Game.canvas.height;

        /* portail grandissant */

        const pulse =
            1 +
            Math.sin(
                this.visualTime * 3
            ) * .08;

        ctx.save();

        ctx.translate(
            w * .50,
            h * .48
        );

        ctx.scale(
            pulse,
            pulse
        );

        ctx.strokeStyle = "#39b5ff";
        ctx.lineWidth = 12;

        ctx.beginPath();

        ctx.ellipse(
            0,
            0,
            175,
            225,
            0,
            0,
            Math.PI * 2
        );

        ctx.stroke();

        ctx.restore();

        /*
        silhouette du joueur
        */

        ctx.fillStyle = "#020308";

        ctx.fillRect(
            w * .72,
            h * .58,
            50,
            120
        );

        ctx.beginPath();

        ctx.arc(
            w * .745,
            h * .54,
            30,
            0,
            Math.PI * 2
        );

        ctx.fill();

    },

    /*
    ========================================
    SCÈNE 10
    ========================================
    */

    drawBeginning() {

        const ctx = Game.ctx;
        const w = Game.canvas.width;
        const h = Game.canvas.height;

        ctx.fillStyle = "#020308";

        ctx.fillRect(
            0,
            0,
            w,
            h
        );

        /*
        Gros plan progressif sur
        Ponanini III.
        */

        const progress =
            Math.min(
                1,
                this.visualTime / 12
            );

        const scale =
            .7 +
            progress * .8;

        ctx.save();

        ctx.translate(
            w / 2,
            h * .40
        );

        ctx.scale(
            scale,
            scale
        );

        ctx.translate(
            -w / 2,
            -h * .40
        );

        this.darkDuck(
            w / 2,
            h * .40,
            1.5
        );

        ctx.restore();

        /*
        sourire ambigu
        */

        ctx.strokeStyle = "#d9b441";
        ctx.lineWidth = 4;

        ctx.beginPath();

        ctx.arc(
            w / 2,
            h * .43,
            45 * scale,
            .15,
            Math.PI - .15
        );

        ctx.stroke();

        /*
        lumière du portail
        */

        const glow =
            ctx.createRadialGradient(
                w / 2,
                h * .40,
                20,
                w / 2,
                h * .40,
                300
            );

        glow.addColorStop(
            0,
            "rgba(70,130,255,.18)"
        );

        glow.addColorStop(
            1,
            "rgba(0,0,0,0)"
        );

        ctx.fillStyle = glow;

        ctx.fillRect(
            0,
            0,
            w,
            h
        );

    },

    /*
    ========================================
    PERSONNAGES
    ========================================
    */

    duckKing(x, y, scale) {

        const ctx = Game.ctx;

        ctx.save();

        ctx.translate(
            x,
            y
        );

        ctx.scale(
            scale,
            scale
        );

        /* cape */

        ctx.fillStyle = "#17141d";

        ctx.beginPath();

        ctx.moveTo(
            -65,
            45
        );

        ctx.lineTo(
            65,
            45
        );

        ctx.lineTo(
            85,
            150
        );

        ctx.lineTo(
            -85,
            150
        );

        ctx.closePath();

        ctx.fill();

        /* corps */

        ctx.fillStyle = "#263142";

        ctx.fillRect(
            -45,
            35,
            90,
            100
        );

        /* tête de canard */

        ctx.fillStyle = "#d7b94f";

        ctx.beginPath();

        ctx.ellipse(
            0,
            0,
            48,
            42,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();

        /* plumage */

        ctx.fillStyle = "#292a30";

        ctx.beginPath();

        ctx.arc(
            0,
            -13,
            42,
            Math.PI,
            Math.PI * 2
        );

        ctx.fill();

        /* yeux */

        ctx.fillStyle = "#f5edbd";

        ctx.fillRect(
            -24,
            -7,
            14,
            10
        );

        ctx.fillRect(
            10,
            -7,
            14,
            10
        );

        /* pupilles */

        ctx.fillStyle = "#111";

        ctx.fillRect(
            -19,
            -5,
            5,
            6
        );

        ctx.fillRect(
            15,
            -5,
            5,
            6
        );

        /* bec */

        ctx.fillStyle = "#d88925";

        ctx.beginPath();

        ctx.moveTo(
            -26,
            10
        );

        ctx.lineTo(
            0,
            30
        );

        ctx.lineTo(
            26,
            10
        );

        ctx.closePath();

        ctx.fill();

        /* couronne */

        ctx.fillStyle = "#d9ae31";

        ctx.beginPath();

        ctx.moveTo(
            -42,
            -37
        );

        ctx.lineTo(
            -27,
            -75
        );

        ctx.lineTo(
            -8,
            -48
        );

        ctx.lineTo(
            5,
            -78
        );

        ctx.lineTo(
            21,
            -48
        );

        ctx.lineTo(
            40,
            -72
        );

        ctx.lineTo(
            40,
            -30
        );

        ctx.closePath();

        ctx.fill();

        /* gemme */

        ctx.fillStyle = "#a72e39";

        ctx.beginPath();

        ctx.arc(
            0,
            -52,
            7,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.restore();

    },

    darkDuck(x, y, scale) {

        const ctx = Game.ctx;

        ctx.save();

        ctx.translate(
            x,
            y
        );

        ctx.scale(
            scale,
            scale
        );

        /* cape */

        ctx.fillStyle = "#050509";

        ctx.beginPath();

        ctx.moveTo(
            -55,
            35
        );

        ctx.lineTo(
            55,
            35
        );

        ctx.lineTo(
            75,
            150
        );

        ctx.lineTo(
            -75,
            150
        );

        ctx.closePath();

        ctx.fill();

        /* tête */

        ctx.fillStyle = "#a78b35";

        ctx.beginPath();

        ctx.ellipse(
            0,
            0,
            45,
            40,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();

        /* ombre */

        ctx.fillStyle = "#09090e";

        ctx.beginPath();

        ctx.arc(
            0,
            -10,
            43,
            Math.PI,
            Math.PI * 2
        );

        ctx.fill();

        /* yeux rouges */

        ctx.fillStyle = "#d52e3d";

        ctx.fillRect(
            -23,
            -5,
            13,
            6
        );

        ctx.fillRect(
            10,
            -5,
            13,
            6
        );

        /* bec */

        ctx.fillStyle = "#9c5e22";

        ctx.beginPath();

        ctx.moveTo(
            -25,
            10
        );

        ctx.lineTo(
            0,
            28
        );

        ctx.lineTo(
            25,
            10
        );

        ctx.closePath();

        ctx.fill();

        ctx.restore();

    },

    guard(x, y) {

        const ctx = Game.ctx;

        ctx.fillStyle = "#0b0e14";

        ctx.fillRect(
            x - 20,
            y,
            40,
            90
        );

        ctx.fillStyle = "#303a4a";

        ctx.beginPath();

        ctx.arc(
            x,
            y - 10,
            25,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.fillStyle = "#090a0e";

        ctx.fillRect(
            x - 20,
            y - 5,
            40,
            10
        );

    },

    torch(x, y) {

        const ctx = Game.ctx;

        const flicker =
            Math.sin(
                this.visualTime * 9
            ) * 5;

        const glow =
            ctx.createRadialGradient(
                x,
                y - 20,
                5,
                x,
                y - 20,
                100
            );

        glow.addColorStop(
            0,
            "rgba(255,180,40,.35)"
        );

        glow.addColorStop(
            1,
            "rgba(255,100,20,0)"
        );

        ctx.fillStyle = glow;

        ctx.fillRect(
            x - 100,
            y - 120,
            200,
            200
        );

        ctx.fillStyle = "#ffae30";

        ctx.beginPath();

        ctx.arc(
            x,
            y - 20 + flicker,
            14,
            0,
            Math.PI * 2
        );

        ctx.fill();

    },

    castle(x, y, scale) {

        const ctx = Game.ctx;

        const w = 430 * scale;
        const h = 260 * scale;

        ctx.fillStyle = "#151d2a";

        ctx.fillRect(
            x - w / 2,
            y - h,
            w,
            h
        );

        /* tours */

        ctx.fillRect(
            x - w / 2 - 45 * scale,
            y - h - 35 * scale,
            90 * scale,
            h + 35 * scale
        );

        ctx.fillRect(
            x + w / 2 - 45 * scale,
            y - h - 35 * scale,
            90 * scale,
            h + 35 * scale
        );

        /* toits */

        ctx.fillStyle = "#080a0e";

        this.roof(
            x - w / 2 - 45 * scale,
            y - h - 35 * scale,
            90 * scale
        );

        this.roof(
            x + w / 2 - 45 * scale,
            y - h - 35 * scale,
            90 * scale
        );

        /* fenêtres */

        ctx.fillStyle = "#d5a72f";

        for (let i = -2; i <= 2; i++) {

            ctx.fillRect(
                x + i * 60 * scale - 6,
                y - h * .55,
                12,
                20
            );

        }

        /* porte */

        ctx.fillStyle = "#05070a";

        ctx.fillRect(
            x - 30 * scale,
            y - 90 * scale,
            60 * scale,
            90 * scale
        );

    },

    roof(x, y, width) {

        const ctx = Game.ctx;

        ctx.beginPath();

        ctx.moveTo(
            x - 12,
            y
        );

        ctx.lineTo(
            x + width / 2,
            y - 65
        );

        ctx.lineTo(
            x + width + 12,
            y
        );

        ctx.closePath();

        ctx.fill();

    },

    cloud(x, y, scale) {

        const ctx = Game.ctx;

        ctx.beginPath();

        ctx.ellipse(
            x,
            y,
            100 * scale,
            30 * scale,
            0,
            0,
            Math.PI * 2
        );

        ctx.ellipse(
            x + 80 * scale,
            y - 12,
            80 * scale,
            35 * scale,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

};


/*
========================================
CONTROLES
========================================
*/

window.addEventListener(
    "keydown",
    event => {

        if (!Prologue.active)
            return;

        if (
            event.code === "Space" ||
            event.key === "Enter"
        ) {

            event.preventDefault();

            Prologue.skipText();

        }

    }
);
