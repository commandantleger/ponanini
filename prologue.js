const Prologue = {

    active: false,

    scene: 0,

    timer: 0,

    textIndex: 0,

    finishedText: false,

    fade: 0,

    fadeDirection: -1,

    visualTime: 0,

    textSpeed: 55,

    scenes: [

        {
            title: "IL ÉTAIT UNE FOIS...",

            text:
                "Il existe des royaumes dont l'histoire " +
                "est écrite par les vainqueurs.",

            duration: 11000,

            textSpeed: 65,

            visual: "kingdom"
        },


        {
            title: "LE ROYAUME DE PONAN",

            text:
                "Au cœur de ces terres s'élevait le royaume " +
                "de Ponan, protégé depuis des générations " +
                "par une famille royale.",

            duration: 12000,

            textSpeed: 60,

            visual: "castle"
        },


        {
            title: "PONANINI III",

            text:
                "À cette époque, le royaume était dirigé " +
                "par Ponanini III. Un roi respecté. " +
                "Un roi aimé.",

            duration: 20000,

            textSpeed: 65,

            visual: "throne"
        },


        {
            title: "LA TRAHISON",

            text:
                "Mais dans l'ombre du palais, quelqu'un " +
                "convoitait déjà la couronne.",

            duration: 13000,

            textSpeed: 65,

            visual: "betrayal"
        },


        {
            title: "PONANINI IV",

            text:
                "Son propre frère, Ponanini IV, complota " +
                "contre lui. Il fabriqua des preuves, " +
                "corrompit les gardes et retourna la cour.",

            duration: 15000,

            textSpeed: 60,

            visual: "falseking"
        },


        {
            title: "LE BANNISSEMENT",

            text:
                "Ponanini III fut accusé de crimes qu'il " +
                "n'avait jamais commis. Déchu de son titre, " +
                "il fut condamné à l'exil.",

            duration: 15000,

            textSpeed: 60,

            visual: "exile"
        },


        {
            title: "LE NETHER",

            text:
                "Les portes du Nether se refermèrent derrière " +
                "lui. Un monde sans lumière, où nul vivant " +
                "ne devait pouvoir revenir.",

            duration: 15000,

            textSpeed: 60,

            visual: "nether"
        },


        {
            title: "LES TROIS FRAGMENTS",

            text:
                "Mais au cœur des ténèbres, Ponanini III " +
                "découvrit trois fragments capables d'ouvrir " +
                "un passage entre les mondes.",

            duration: 15000,

            textSpeed: 60,

            visual: "fragments"
        },


        {
            title: "UNE PROPOSITION",

            text:
                "Il ne pouvait pas les récupérer seul. " +
                "Alors il attendit... jusqu'à ce qu'un aventurier " +
                "apparaisse de l'autre côté du portail.",

            duration: 15000,

            textSpeed: 60,

            visual: "proposal"
        },


        {
            title: "L'HISTOIRE COMMENCE",

            text:
                "Il te raconta une histoire. Une histoire " +
                "où il était la victime, où son frère était " +
                "le véritable monstre.",

            duration: 13000,

            textSpeed: 60,

            visual: "beginning"
        }

    ],


    start() {

        this.active = true;

        this.scene = 0;

        this.timer = 0;

        this.textIndex = 0;

        this.finishedText = false;

        this.fade = 1;

        this.fadeDirection = -1;

        this.visualTime = 0;

        this.stopAudio();

    },


    update(dt) {

        if (!this.active)
            return;


        const current =
            this.scenes[this.scene];


        if (!current)
            return;


        this.timer += dt;

        this.visualTime += dt;


        /*
         * Texte progressif
         */

        if (!this.finishedText) {

            const speed =
                current.textSpeed ||
                this.textSpeed;

            this.textIndex =
                Math.floor(
                    this.timer * 1000 / speed
                );


            if (
                this.textIndex >=
                current.text.length
            ) {

                this.textIndex =
                    current.text.length;

                this.finishedText = true;

            }

        }


        /*
         * Fade d'entrée
         */

        if (this.fadeDirection === -1) {

            this.fade -=
                dt * 1.5;

            if (this.fade <= 0) {

                this.fade = 0;

                this.fadeDirection = 0;

            }

        }


        /*
         * Passage automatique
         */

        if (
            this.timer >=
            current.duration / 1000
        ) {

            this.nextScene();

        }

    },


    nextScene() {

        if (
            this.scene >=
            this.scenes.length - 1
        ) {

            this.finish();

            return;

        }


        this.scene++;

        this.timer = 0;

        this.textIndex = 0;

        this.finishedText = false;

        this.visualTime = 0;

        this.fade = 1;

        this.fadeDirection = -1;

    },


    skipText() {

        const current =
            this.scenes[this.scene];

        if (!current)
            return;


        if (!this.finishedText) {

            this.textIndex =
                current.text.length;

            this.finishedText = true;

            return;

        }


        this.nextScene();

    },


    finish() {

        this.stopAudio();

        this.active = false;

        this.scene = 0;

        this.timer = 0;

        this.textIndex = 0;

        this.finishedText = false;

        this.fade = 0;


        if (
            typeof finishPrologue ===
            "function"
        ) {

            finishPrologue();

        } else {

            Game.running = true;

        }

    },


    stopAudio() {

        if (this.audio) {

            this.audio.pause();

            this.audio.currentTime = 0;

            this.audio = null;

        }

    },


    draw() {

        const ctx = Game.ctx;

        const width =
            Game.canvas.width;

        const height =
            Game.canvas.height;


        const current =
            this.scenes[this.scene];


        if (!current)
            return;


        /*
         * ==========================
         * DÉCOR
         * ==========================
         */

        switch (current.visual) {

            case "kingdom":
                this.drawKingdom();
                break;

            case "castle":
                this.drawCastle();
                break;

            case "throne":
                this.drawThroneRoom();
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

            default:

                ctx.fillStyle =
                    "#000";

                ctx.fillRect(
                    0,
                    0,
                    width,
                    height
                );

        }


        /*
         * ==========================
         * VIGNETTE
         * ==========================
         */

        const vignette =
            ctx.createRadialGradient(
                width / 2,
                height / 2,
                height * .20,
                width / 2,
                height / 2,
                height * .75
            );

        vignette.addColorStop(
            0,
            "rgba(0,0,0,0)"
        );

        vignette.addColorStop(
            1,
            "rgba(0,0,0,.75)"
        );

        ctx.fillStyle =
            vignette;

        ctx.fillRect(
            0,
            0,
            width,
            height
        );


        /*
         * ==========================
         * TITRE
         * ==========================
         */

        ctx.textAlign = "center";

        ctx.font =
            "bold 30px Arial";

        ctx.fillStyle =
            "#d9b441";

        ctx.fillText(
            current.title,
            width / 2,
            70
        );


        /*
         * ==========================
         * NARRATION
         * ==========================
         */

        this.drawNarration(
            current
        );


        /*
         * ==========================
         * FONDU
         * ==========================
         */

        if (this.fade > 0) {

            ctx.fillStyle =
                `rgba(0,0,0,${this.fade})`;

            ctx.fillRect(
                0,
                0,
                width,
                height
            );

        }


        /*
         * INSTRUCTIONS
         */

        ctx.font =
            "16px Arial";

        ctx.fillStyle =
            "rgba(255,255,255,.65)";

        ctx.fillText(
            "ESPACE : continuer",
            width / 2,
            height - 25
        );

    },


    drawNarration(scene) {

        const ctx = Game.ctx;

        const width =
            Game.canvas.width;

        const height =
            Game.canvas.height;


        const boxWidth =
            Math.min(
                900,
                width * .78
            );

        const boxHeight =
            170;

        const x =
            (width - boxWidth) / 2;

        const y =
            height - 235;


        /*
         * boîte
         */

        ctx.fillStyle =
            "rgba(4,7,12,.88)";

        ctx.fillRect(
            x,
            y,
            boxWidth,
            boxHeight
        );


        ctx.strokeStyle =
            "#b9973e";

        ctx.lineWidth = 2;

        ctx.strokeRect(
            x,
            y,
            boxWidth,
            boxHeight
        );


        /*
         * Narrateur
         */

        ctx.textAlign = "left";

        ctx.font =
            "bold 18px Arial";

        ctx.fillStyle =
            "#d9b441";

        ctx.fillText(
            "NARRATEUR",
            x + 25,
            y + 32
        );


        /*
         * texte
         */

        const visibleText =
            scene.text.substring(
                0,
                this.textIndex
            );


        ctx.font =
            "22px Georgia";

        ctx.fillStyle =
            "#f1eee5";


        this.drawWrappedText(
            visibleText,
            x + 25,
            y + 75,
            boxWidth - 50,
            32
        );

    },


    drawWrappedText(
        text,
        x,
        y,
        maxWidth,
        lineHeight
    ) {

        const ctx = Game.ctx;

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

            const width =
                ctx.measureText(test)
                    .width;


            if (
                width > maxWidth &&
                i > 0
            ) {

                ctx.fillText(
                    line,
                    x,
                    y
                );

                line =
                    words[i] + " ";

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


    /*
     * ==================================================
     * SCÈNE 1 — ROYAUME
     * ==================================================
     */

    drawKingdom() {

        const ctx = Game.ctx;

        const width =
            Game.canvas.width;

        const height =
            Game.canvas.height;


        const sky =
            ctx.createLinearGradient(
                0,
                0,
                0,
                height
            );

        sky.addColorStop(
            0,
            "#02040d"
        );

        sky.addColorStop(
            .55,
            "#091a31"
        );

        sky.addColorStop(
            1,
            "#172c45"
        );

        ctx.fillStyle = sky;

        ctx.fillRect(
            0,
            0,
            width,
            height
        );


        /*
         * lune
         */

        ctx.fillStyle =
            "#e8d28b";

        ctx.beginPath();

        ctx.arc(
            width * .78,
            height * .18,
            55,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /*
         * nuages
         */

        ctx.fillStyle =
            "rgba(10,18,32,.8)";

        const cloudX =
            (this.visualTime * 15) %
            (width + 400) - 200;

        this.drawCloud(
            cloudX,
            130,
            1
        );

        this.drawCloud(
            cloudX - 500,
            210,
            .7
        );


        /*
         * montagnes
         */

        ctx.fillStyle =
            "#081221";

        ctx.beginPath();

        ctx.moveTo(
            0,
            height * .65
        );

        ctx.lineTo(
            width * .18,
            height * .37
        );

        ctx.lineTo(
            width * .32,
            height * .65
        );

        ctx.lineTo(
            width * .52,
            height * .34
        );

        ctx.lineTo(
            width * .72,
            height * .65
        );

        ctx.lineTo(
            width * .90,
            height * .42
        );

        ctx.lineTo(
            width,
            height * .65
        );

        ctx.lineTo(
            width,
            height
        );

        ctx.lineTo(
            0,
            height
        );

        ctx.closePath();

        ctx.fill();


        /*
         * château
         */

        this.drawCastleSilhouette(
            width / 2,
            height * .67,
            .8
        );


        /*
         * village
         */

        ctx.fillStyle =
            "#0b1018";

        for (
            let i = 0;
            i < 12;
            i++
        ) {

            const x =
                i *
                (width / 11);

            const h =
                35 + (i % 3) * 20;

            ctx.fillRect(
                x,
                height * .70 - h,
                55,
                h
            );

        }

    },


    /*
     * ==================================================
     * SCÈNE 2 — CHÂTEAU
     * ==================================================
     */

    drawCastle() {

        const ctx = Game.ctx;

        const width =
            Game.canvas.width;

        const height =
            Game.canvas.height;


        ctx.fillStyle =
            "#07101c";

        ctx.fillRect(
            0,
            0,
            width,
            height
        );


        /*
         * lune
         */

        ctx.fillStyle =
            "#e4d18c";

        ctx.beginPath();

        ctx.arc(
            width * .78,
            height * .18,
            48,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /*
         * château zoom progressif
         */

        const progress =
            Math.min(
                this.visualTime / 10,
                1
            );


        const scale =
            .65 +
            progress * .35;


        this.drawCastleSilhouette(
            width / 2,
            height * .75,
            scale
        );


        /*
         * route
         */

        ctx.fillStyle =
            "#171820";

        ctx.beginPath();

        ctx.moveTo(
            width * .43,
            height
        );

        ctx.lineTo(
            width * .57,
            height
        );

        ctx.lineTo(
            width * .52,
            height * .68
        );

        ctx.lineTo(
            width * .48,
            height * .68
        );

        ctx.closePath();

        ctx.fill();

    },


    drawCastleSilhouette(
        x,
        y,
        scale
    ) {

        const ctx = Game.ctx;

        const w =
            420 * scale;

        const h =
            260 * scale;


        ctx.fillStyle =
            "#171d29";

        ctx.fillRect(
            x - w / 2,
            y - h,
            w,
            h
        );


        /*
         * tours
         */

        ctx.fillRect(
            x - w / 2 - 45 * scale,
            y - h - 30 * scale,
            90 * scale,
            h + 30 * scale
        );

        ctx.fillRect(
            x + w / 2 - 45 * scale,
            y - h - 30 * scale,
            90 * scale,
            h + 30 * scale
        );


        /*
         * toits
         */

        ctx.fillStyle =
            "#080b11";

        this.drawRoof(
            x - w / 2 - 45 * scale,
            y - h - 30 * scale,
            90 * scale
        );

        this.drawRoof(
            x + w / 2 - 45 * scale,
            y - h - 30 * scale,
            90 * scale
        );


        /*
         * fenêtres
         */

        ctx.fillStyle =
            "#d5a82e";

        for (
            let i = -2;
            i <= 2;
            i++
        ) {

            ctx.fillRect(
                x + i * 60 * scale - 6,
                y - h * .55,
                12,
                20
            );

        }


        /*
         * porte
         */

        ctx.fillStyle =
            "#06080c";

        ctx.fillRect(
            x - 30 * scale,
            y - 90 * scale,
            60 * scale,
            90 * scale
        );

    },


    drawRoof(x, y, w) {

        const ctx = Game.ctx;

        ctx.beginPath();

        ctx.moveTo(
            x - 12,
            y
        );

        ctx.lineTo(
            x + w / 2,
            y - 65
        );

        ctx.lineTo(
            x + w + 12,
            y
        );

        ctx.closePath();

        ctx.fill();

    },


    drawCloud(x, y, scale) {

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

    },


    /*
     * ==================================================
     * SCÈNE 3 — PONANINI III
     * ==================================================
     */

    drawThroneRoom() {

        const ctx = Game.ctx;

        const width =
            Game.canvas.width;

        const height =
            Game.canvas.height;


        /*
         * zoom
         */

        const zoom =
            Math.min(
                1.25,
                1 +
                this.visualTime * .012
            );


        const focusX =
            width / 2;

        const focusY =
            height * .38;


        ctx.save();

        ctx.translate(
            focusX,
            focusY
        );

        ctx.scale(
            zoom,
            zoom
        );

        ctx.translate(
            -focusX,
            -focusY
        );


        /*
         * murs
         */

        ctx.fillStyle =
            "#151c29";

        ctx.fillRect(
            0,
            0,
            width,
            height
        );


        /*
         * pierres
         */

        ctx.strokeStyle =
            "#293445";

        ctx.lineWidth = 2;

        for (
            let y = 0;
            y < height * .75;
            y += 65
        ) {

            for (
                let x = 0;
                x < width;
                x += 70
            ) {

                ctx.strokeRect(
                    x,
                    y,
                    70,
                    65
                );

            }

        }


        /*
         * sol
         */

        ctx.fillStyle =
            "#0a0d13";

        ctx.fillRect(
            0,
            height * .72,
            width,
            height * .28
        );


        /*
         * tapis
         */

        ctx.fillStyle =
            "#641d27";

        ctx.beginPath();

        ctx.moveTo(
            width * .43,
            height * .55
        );

        ctx.lineTo(
            width * .57,
            height * .55
        );

        ctx.lineTo(
            width * .73,
            height
        );

        ctx.lineTo(
            width * .27,
            height
        );

        ctx.closePath();

        ctx.fill();


        /*
         * trône
         */

        this.drawThrone(
            width / 2,
            height * .47
        );


        /*
         * roi
         */

        this.drawDuckKing(
            width / 2,
            height * .37
        );


        /*
         * gardes
         */

        this.drawGuard(
            width * .23,
            height * .58
        );

        this.drawGuard(
            width * .77,
            height * .58
        );


        /*
         * torches
         */

        this.drawTorch(
            width * .08,
            height * .52
        );

        this.drawTorch(
            width * .92,
            height * .52
        );


        ctx.restore();

    },


    drawThrone(x, y) {

        const ctx = Game.ctx;

        ctx.fillStyle =
            "#8d6c2c";

        ctx.fillRect(
            x - 85,
            y - 110,
            170,
            160
        );

        ctx.fillStyle =
            "#571d28";

        ctx.fillRect(
            x - 65,
            y - 90,
            130,
            115
        );

        ctx.fillStyle =
            "#b9973e";

        ctx.fillRect(
            x - 105,
            y + 15,
            35,
            25
        );

        ctx.fillRect(
            x + 70,
            y + 15,
            35,
            25
        );

    },


    drawDuckKing(x, y) {

        const ctx = Game.ctx;


        /*
         * cape
         */

        ctx.fillStyle =
            "#14131a";

        ctx.beginPath();

        ctx.moveTo(
            x - 60,
            y + 35
        );

        ctx.lineTo(
            x + 60,
            y + 35
        );

        ctx.lineTo(
            x + 78,
            y + 130
        );

        ctx.lineTo(
            x - 78,
            y + 130
        );

        ctx.closePath();

        ctx.fill();


        /*
         * corps
         */

        ctx.fillStyle =
            "#242d39";

        ctx.fillRect(
            x - 42,
            y + 35,
            84,
            85
        );


        /*
         * tête
         */

        ctx.fillStyle =
            "#d8ba4b";

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            43,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /*
         * plumage
         */

        ctx.fillStyle =
            "#202027";

        ctx.beginPath();

        ctx.arc(
            x,
            y - 10,
            39,
            Math.PI,
            Math.PI * 2
        );

        ctx.fill();


        /*
         * yeux
         */

        ctx.fillStyle =
            "#f2e5ad";

        ctx.fillRect(
            x - 22,
            y - 5,
            12,
            9
        );

        ctx.fillRect(
            x + 10,
            y - 5,
            12,
            9
        );


        /*
         * bec
         */

        ctx.fillStyle =
            "#d58b27";

        ctx.beginPath();

        ctx.moveTo(
            x - 25,
            y + 10
        );

        ctx.lineTo(
            x,
            y + 27
        );

        ctx.lineTo(
            x + 25,
            y + 10
        );

        ctx.closePath();

        ctx.fill();


        /*
         * couronne
         */

        ctx.fillStyle =
            "#d9ac30";

        ctx.beginPath();

        ctx.moveTo(
            x - 40,
            y - 38
        );

        ctx.lineTo(
            x - 25,
            y - 75
        );

        ctx.lineTo(
            x - 8,
            y - 48
        );

        ctx.lineTo(
            x + 5,
            y - 78
        );

        ctx.lineTo(
            x + 20,
            y - 48
        );

        ctx.lineTo(
            x + 40,
            y - 70
        );

        ctx.lineTo(
            x + 38,
            y - 30
        );

        ctx.closePath();

        ctx.fill();


        /*
         * gemme
         */

        ctx.fillStyle =
            "#a72f36";

        ctx.beginPath();

        ctx.arc(
            x,
            y - 52,
            6,
            0,
            Math.PI * 2
        );

        ctx.fill();

    },


    drawGuard(x, y) {

        const ctx = Game.ctx;

        ctx.fillStyle =
            "#080b10";

        ctx.fillRect(
            x - 20,
            y,
            40,
            90
        );

        ctx.fillStyle =
            "#303847";

        ctx.beginPath();

        ctx.arc(
            x,
            y - 10,
            25,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.fillStyle =
            "#08090c";

        ctx.fillRect(
            x - 20,
            y - 5,
            40,
            10
        );

    },


    drawTorch(x, y) {

        const ctx = Game.ctx;

        const flicker =
            Math.sin(
                this.visualTime * 8
            ) * 4;


        const glow =
            ctx.createRadialGradient(
                x,
                y - 15,
                5,
                x,
                y - 15,
                100
            );

        glow.addColorStop(
            0,
            "rgba(255,180,40,.25)"
        );

        glow.addColorStop(
            1,
            "rgba(255,120,20,0)"
        );

        ctx.fillStyle =
            glow;

        ctx.fillRect(
            x - 100,
            y - 115,
            200,
            200
        );


        ctx.fillStyle =
            "#f0a42a";

        ctx.beginPath();

        ctx.arc(
            x,
            y - 15 + flicker,
            14,
            0,
            Math.PI * 2
        );

        ctx.fill();

    },


    /*
     * ==================================================
     * SCÈNE 4 — TRAHISON
     * ==================================================
     */

    drawBetrayal() {

        this.drawThroneRoom();


        const ctx = Game.ctx;

        const width =
            Game.canvas.width;

        const height =
            Game.canvas.height;


        /*
         * obscurité progressive
         */

        const darkness =
            Math.min(
                .72,
                this.visualTime * .06
            );

        ctx.fillStyle =
            `rgba(0,0,10,${darkness})`;

        ctx.fillRect(
            0,
            0,
            width,
            height
        );


        /*
         * silhouette de Ponanini IV
         */

        const x =
            width * .70;

        const y =
            height * .34;


        ctx.fillStyle =
            "#050609";

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            40,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.fillRect(
            x - 45,
            y + 30,
            90,
            120
        );


        /*
         * yeux rouges
         */

        ctx.fillStyle =
            "#b52e38";

        ctx.fillRect(
            x - 18,
            y - 5,
            10,
            5
        );

        ctx.fillRect(
            x + 8,
            y - 5,
            10,
            5
        );

    },


    /*
     * ==================================================
     * SCÈNE 5 — FAUX ROI
     * ==================================================
     */

    drawFalseKing() {

        const ctx = Game.ctx;

        const width =
            Game.canvas.width;

        const height =
            Game.canvas.height;


        ctx.fillStyle =
            "#10090e";

        ctx.fillRect(
            0,
            0,
            width,
            height
        );


        /*
         * trône
         */

        this.drawThrone(
            width / 2,
            height * .55
        );


        /*
         * Ponanini IV
         */

        ctx.fillStyle =
            "#bd9e39";

        ctx.beginPath();

        ctx.arc(
            width / 2,
            height * .40,
            43,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /*
         * ombre sur le visage
         */

        ctx.fillStyle =
            "#17141b";

        ctx.beginPath();

        ctx.arc(
            width / 2,
            height * .38,
            41,
            Math.PI,
            Math.PI * 2
        );

        ctx.fill();


        /*
         * couronne
         */

        ctx.fillStyle =
            "#d7a928";

        ctx.beginPath();

        ctx.moveTo(
            width / 2 - 40,
            height * .34
        );

        ctx.lineTo(
            width / 2 - 25,
            height * .28
        );

        ctx.lineTo(
            width / 2 - 5,
            height * .33
        );

        ctx.lineTo(
            width / 2 + 10,
            height * .27
        );

        ctx.lineTo(
            width / 2 + 28,
            height * .33
        );

        ctx.lineTo(
            width / 2 + 40,
            height * .29
        );

        ctx.lineTo(
            width / 2 + 38,
            height * .36
        );

        ctx.lineTo(
            width / 2 - 40,
            height * .36
        );

        ctx.closePath();

        ctx.fill();

    },


    /*
     * ==================================================
     * SCÈNE 6 — EXIL
     * ==================================================
     */

    drawExile() {

        const ctx = Game.ctx;

        const width =
            Game.canvas.width;

        const height =
            Game.canvas.height;


        ctx.fillStyle =
            "#090b12";

        ctx.fillRect(
            0,
            0,
            width,
            height
        );


        /*
         * château derrière
         */

        ctx.globalAlpha = .3;

        this.drawCastleSilhouette(
            width / 2,
            height * .75,
            .8
        );

        ctx.globalAlpha = 1;


        /*
         * route
         */

        ctx.fillStyle =
            "#171820";

        ctx.beginPath();

        ctx.moveTo(
            width * .45,
            height
        );

        ctx.lineTo(
            width * .55,
            height
        );

        ctx.lineTo(
            width * .51,
            height * .55
        );

        ctx.lineTo(
            width * .49,
            height * .55
        );

        ctx.closePath();

        ctx.fill();


        /*
         * Ponanini III seul
         */

        const x =
            width / 2;

        const y =
            height * .60;


        ctx.fillStyle =
            "#151820";

        ctx.fillRect(
            x - 35,
            y,
            70,
            110
        );


        ctx.fillStyle =
            "#c7aa45";

        ctx.beginPath();

        ctx.arc(
            x,
            y - 15,
            32,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /*
         * couronne tombée
         */

        ctx.strokeStyle =
            "#b9912e";

        ctx.lineWidth = 5;

        ctx.beginPath();

        ctx.moveTo(
            x + 55,
            y + 100
        );

        ctx.lineTo(
            x + 90,
            y + 85
        );

        ctx.lineTo(
            x + 120,
            y + 105
        );

        ctx.stroke();

    },


    /*
     * ==================================================
     * SCÈNE 7 — NETHER
     * ==================================================
     */

    drawNether() {

        const ctx = Game.ctx;

        const width =
            Game.canvas.width;

        const height =
            Game.canvas.height;


        const gradient =
            ctx.createLinearGradient(
                0,
                0,
                0,
                height
            );

        gradient.addColorStop(
            0,
            "#120308"
        );

        gradient.addColorStop(
            .5,
            "#35070b"
        );

        gradient.addColorStop(
            1,
            "#080308"
        );

        ctx.fillStyle =
            gradient;

        ctx.fillRect(
            0,
            0,
            width,
            height
        );


        /*
         * lave
         */

        ctx.fillStyle =
            "#a83224";

        ctx.fillRect(
            0,
            height * .78,
            width,
            height * .22
        );


        /*
         * montagnes
         */

        ctx.fillStyle =
            "#16050a";

        for (
            let i = 0;
            i < 7;
            i++
        ) {

            ctx.beginPath();

            ctx.moveTo(
                i * 180,
                height * .78
            );

            ctx.lineTo(
                i * 180 + 90,
                height * .30
            );

            ctx.lineTo(
                i * 180 + 180,
                height * .78
            );

            ctx.closePath();

            ctx.fill();

        }


        /*
         * Ponanini III
         */

        const x =
            width / 2;

        const y =
            height * .62;


        ctx.fillStyle =
            "#08080d";

        ctx.fillRect(
            x - 40,
            y,
            80,
            120
        );


        ctx.fillStyle =
            "#c4a43c";

        ctx.beginPath();

        ctx.arc(
            x,
            y - 20,
            35,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /*
         * portail derrière lui
         */

        ctx.strokeStyle =
            "#6e2cff";

        ctx.lineWidth = 12;

        ctx.beginPath();

        ctx.ellipse(
            x,
            y + 10,
            130,
            190,
            0,
            0,
            Math.PI * 2
        );

        ctx.stroke();

    },


    /*
     * ==================================================
     * SCÈNE 8 — FRAGMENTS
     * ==================================================
     */

    drawFragments() {

        const ctx = Game.ctx;

        const width =
            Game.canvas.width;

        const height =
            Game.canvas.height;


        ctx.fillStyle =
            "#060711";

        ctx.fillRect(
            0,
            0,
            width,
            height
        );


        /*
         * cercle magique
         */

        ctx.strokeStyle =
            "#2363d1";

        ctx.lineWidth = 3;

        ctx.beginPath();

        ctx.arc(
            width / 2,
            height * .45,
            180,
            0,
            Math.PI * 2
        );

        ctx.stroke();


        /*
         * trois fragments
         */

        const positions = [

            [width / 2, height * .25],

            [width * .36, height * .60],

            [width * .64, height * .60]

        ];


        positions.forEach(
            (pos, index) => {

                const x = pos[0];

                const y =
                    pos[1] +
                    Math.sin(
                        this.visualTime * 2 +
                        index
                    ) * 8;


                ctx.fillStyle =
                    index === 0
                        ? "#e1bd45"
                        : "#3275d4";


                ctx.beginPath();

                ctx.moveTo(
                    x,
                    y - 30
                );

                ctx.lineTo(
                    x + 22,
                    y
                );

                ctx.lineTo(
                    x,
                    y + 30
                );

                ctx.lineTo(
                    x - 22,
                    y
                );

                ctx.closePath();

                ctx.fill();


                ctx.strokeStyle =
                    "#ffffff";

                ctx.stroke();

            }
        );

    },


    /*
     * ==================================================
     * SCÈNE 9 — PROPOSITION
     * ==================================================
     */

    drawProposal() {

        const ctx = Game.ctx;

        const width =
            Game.canvas.width;

        const height =
            Game.canvas.height;


        /*
         * Nether
         */

        this.drawNether();


        /*
         * portail
         */

        const pulse =
            1 +
            Math.sin(
                this.visualTime * 3
            ) * .05;


        ctx.save();

        ctx.translate(
            width / 2,
            height * .48
        );

        ctx.scale(
            pulse,
            pulse
        );


        ctx.strokeStyle =
            "#36a9ff";

        ctx.lineWidth = 10;

        ctx.beginPath();

        ctx.ellipse(
            0,
            0,
            170,
            220,
            0,
            0,
            Math.PI * 2
        );

        ctx.stroke();

        ctx.restore();


        /*
         * joueur en silhouette
         */

        ctx.fillStyle =
            "#020308";

        ctx.fillRect(
            width * .70,
            height * .60,
            55,
            110
        );

        ctx.beginPath();

        ctx.arc(
            width * .727,
            height * .56,
            30,
            0,
            Math.PI * 2
        );

        ctx.fill();

    },


    /*
     * ==================================================
     * SCÈNE 10 — DÉBUT
     * ==================================================
     */

    drawBeginning() {

        const ctx = Game.ctx;

        const width =
            Game.canvas.width;

        const height =
            Game.canvas.height;


        ctx.fillStyle =
            "#03050b";

        ctx.fillRect(
            0,
            0,
            width,
            height
        );


        /*
         * visage dans l'ombre
         */

        const x =
            width / 2;

        const y =
            height * .38;


        ctx.fillStyle =
            "#11141c";

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            100,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /*
         * yeux
         */

        ctx.fillStyle =
            "#d9b441";

        ctx.fillRect(
            x - 42,
            y - 10,
            22,
            8
        );

        ctx.fillRect(
            x + 20,
            y - 10,
            22,
            8
        );


        /*
         * sourire
         */

        ctx.strokeStyle =
            "#d9b441";

        ctx.lineWidth = 4;

        ctx.beginPath();

        ctx.arc(
            x,
            y + 15,
            48,
            0.15,
            Math.PI - 0.15
        );

        ctx.stroke();


        /*
         * fondu progressif
         */

        const darkness =
            Math.min(
                .55,
                this.visualTime * .04
            );

        ctx.fillStyle =
            `rgba(0,0,0,${darkness})`;

        ctx.fillRect(
            0,
            0,
            width,
            height
        );

    }

};


/*
 * ==========================================
 * CONTRÔLES CINÉMATIQUE
 * ==========================================
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
