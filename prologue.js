/*
============================================================
PONAN'S LEGACY
PROLOGUE CINÉMATIQUE — DIRECTOR'S CUT
============================================================

Direction artistique :
- Dark fantasy
- Ville contemporaine
- Palais gothique médiéval
- Néons / gratte-ciels / voitures / drones
- Canards anthropomorphes
- Parallaxe
- Zooms cinématiques
- Pluie
- Fumée
- Braises
- Portail dimensionnel
- Nether

AUCUNE IMAGE EXTERNE N'EST NÉCESSAIRE.
Tout est dessiné directement avec Canvas.
============================================================
*/

const Prologue = {

    active: false,

    scene: 0,

    timer: 0,

    textIndex: 0,

    finishedText: false,

    fade: 1,

    fadeDirection: -1,

    visualTime: 0,

    textSpeed: 45,

    scenes: [

        /* ==================================================
           SCÈNE 1
        ================================================== */

        {
            title: "UNE VILLE. UN ROYAUME.",
            text:
                "La ville ne dormait jamais. Les gratte-ciels " +
                "coupaient le ciel, les néons noyaient les rues " +
                "et des milliers de vies défilaient sous la pluie. " +
                "Puis, au centre de cette modernité, demeurait un vestige " +
                "que personne n'avait réussi à faire disparaître.",
            duration: 21000,
            speed: 42,
            visual: "city"
        },

        /* ==================================================
           SCÈNE 2
        ================================================== */

        {
            title: "LE PALAIS DE PONAN",
            text:
                "Un palais vieux de plusieurs siècles. " +
                "Des murailles noires, des tours démesurées, " +
                "des vitraux éclairés au milieu des écrans publicitaires. " +
                "Le monde avait changé. La couronne, elle, refusait de mourir.",
            duration: 20000,
            speed: 43,
            visual: "palace"
        },

        /* ==================================================
           SCÈNE 3
        ================================================== */

        {
            title: "PONANINI III",
            text:
                "À l'intérieur, Ponanini III régnait encore. " +
                "On le disait juste. Certains le trouvaient naïf. " +
                "Mais son peuple n'avait jamais eu à craindre sa colère. " +
                "Il croyait qu'un roi devait servir avant d'être servi.",
            duration: 22000,
            speed: 43,
            visual: "throne"
        },

        /* ==================================================
           SCÈNE 4
        ================================================== */

        {
            title: "UN FRÈRE DANS L'OMBRE",
            text:
                "Son frère pensait autrement. " +
                "Ponanini IV n'enviait pas seulement la couronne. " +
                "Il enviait tout ce qu'elle représentait. " +
                "Le pouvoir. La peur. Le droit de décider qui mérite de vivre.",
            duration: 22000,
            speed: 42,
            visual: "betrayal"
        },

        /* ==================================================
           SCÈNE 5
        ================================================== */

        {
            title: "LE MENSONGE",
            text:
                "Alors le mensonge commença à circuler. " +
                "Une signature falsifiée. Des comptes détournés. " +
                "Des témoins achetés. Et dans les couloirs du palais, " +
                "les gardes cessèrent peu à peu de saluer leur véritable roi.",
            duration: 22000,
            speed: 42,
            visual: "conspiracy"
        },

        /* ==================================================
           SCÈNE 6
        ================================================== */

        {
            title: "LA COURONNE CHANGE DE TÊTE",
            text:
                "En une nuit, la vérité devint inutile. " +
                "Ponanini III fut accusé de trahison devant son propre peuple. " +
                "Ponanini IV se présenta alors comme le sauveur. " +
                "Le royaume applaudit celui qui venait de le voler.",
            duration: 22000,
            speed: 42,
            visual: "falseking"
        },

        /* ==================================================
           SCÈNE 7
        ================================================== */

        {
            title: "LE BANNISSEMENT",
            text:
                "Dans la cour du palais, devant les lumières de la ville, " +
                "Ponanini IV ouvrit une porte qui n'aurait jamais dû exister. " +
                "Ponanini III comprit trop tard. " +
                "Son frère ne voulait pas seulement son trône. " +
                "Il voulait effacer jusqu'à son existence.",
            duration: 23000,
            speed: 41,
            visual: "exile"
        },

        /* ==================================================
           SCÈNE 8
        ================================================== */

        {
            title: "LE NETHER",
            text:
                "De l'autre côté se trouvait le Nether. " +
                "Un monde sans matin, où les montagnes brûlent " +
                "et où quelque chose semble toujours vous observer. " +
                "Ponanini III y passa des années. Seul.",
            duration: 22000,
            speed: 41,
            visual: "nether"
        },

        /* ==================================================
           SCÈNE 9
        ================================================== */

        {
            title: "LES TROIS FRAGMENTS",
            text:
                "Puis il trouva ce que les anciens avaient caché. " +
                "Trois fragments d'un sceau capable de rouvrir la porte. " +
                "Trois morceaux. Trois clés. " +
                "Et une chance de revenir là où son histoire avait été volée.",
            duration: 21000,
            speed: 41,
            visual: "fragments"
        },

        /* ==================================================
           SCÈNE 10
        ================================================== */

        {
            title: "IL TE CHOISIT",
            text:
                "Mais les fragments étaient hors de sa portée. " +
                "Alors Ponanini III attendit. " +
                "Lorsqu'un portail s'ouvrit enfin devant lui, " +
                "il vit un aventurier de l'autre côté. Toi. " +
                "Il avait besoin de quelqu'un pour récupérer les fragments. " +
                "Et il avait déjà préparé son histoire.",
            duration: 24000,
            speed: 40,
            visual: "beginning"
        }

    ],


    /* ======================================================
       START
    ====================================================== */

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

        const hud =
            document.getElementById("hud");

        if (hud)
            hud.style.display = "none";

        const dialogue =
            document.getElementById("dialogue");

        if (dialogue)
            dialogue.classList.add("hidden");

        const inventory =
            document.getElementById("inventory");

        if (inventory)
            inventory.classList.add("hidden");

    },


    /* ======================================================
       UPDATE
    ====================================================== */

    update(dt) {

        if (!this.active)
            return;

        const current =
            this.scenes[this.scene];

        if (!current)
            return;

        this.timer += dt;

        this.visualTime += dt;


        /* -----------------------------------------------
           TEXTE PROGRESSIF
        ------------------------------------------------ */

        if (!this.finishedText) {

            const speed =
                current.speed ||
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


        /* -----------------------------------------------
           FADE
        ------------------------------------------------ */

        if (
            this.fadeDirection === -1
        ) {

            this.fade -=
                dt * 1.15;

            if (this.fade <= 0) {

                this.fade = 0;

                this.fadeDirection = 0;

            }

        }


        /*
        Une scène ne peut passer que lorsque
        le texte est entièrement affiché.
        */

        if (
            this.finishedText &&
            this.timer >=
            current.duration / 1000
        ) {

            this.nextScene();

        }

    },


    /* ======================================================
       NEXT SCENE
    ====================================================== */

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


    /* ======================================================
       SKIP TEXT
    ====================================================== */

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


    /* ======================================================
       FIN
    ====================================================== */

    finish() {

        this.stopAudio();

        this.active = false;

        this.scene = 0;

        this.timer = 0;

        this.textIndex = 0;

        this.finishedText = false;

        this.fade = 0;

        const hud =
            document.getElementById("hud");

        if (hud)
            hud.style.display = "flex";

        if (
            typeof finishPrologue ===
            "function"
        ) {

            finishPrologue();

        } else if (
            typeof Game !==
            "undefined"
        ) {

            Game.running = true;

        }

    },


    /* ======================================================
       AUDIO
    ====================================================== */

    stopAudio() {

        if (this.audio) {

            this.audio.pause();

            this.audio.currentTime = 0;

            this.audio = null;

        }

    },


    /* ======================================================
       DRAW
    ====================================================== */

    draw() {

        const ctx =
            Game.ctx;

        const width =
            Game.canvas.width;

        const height =
            Game.canvas.height;

        const current =
            this.scenes[this.scene];

        if (!current)
            return;

        ctx.save();

        ctx.imageSmoothingEnabled =
            false;


        /*
        ----------------------------------------------------
        SCÈNES
        ----------------------------------------------------
        */

        switch (this.scene) {

            case 0:
                this.drawScene1();
                break;

            case 1:
                this.drawScene2();
                break;

            case 2:
                this.drawScene3();
                break;

            case 3:
                this.drawScene4();
                break;

            case 4:
                this.drawScene5();
                break;

            case 5:
                this.drawScene6();
                break;

            case 6:
                this.drawScene7();
                break;

            case 7:
                this.drawScene8();
                break;

            case 8:
                this.drawScene9();
                break;

            case 9:
                this.drawScene10();
                break;

        }


        /*
        ----------------------------------------------------
        VIGNETTE
        ----------------------------------------------------
        */

        this.drawVignette();


        /*
        ----------------------------------------------------
        BANDES CINÉMA
        ----------------------------------------------------
        */

        ctx.fillStyle =
            "#000";

        ctx.fillRect(
            0,
            0,
            width,
            30
        );

        ctx.fillRect(
            0,
            height - 30,
            width,
            30
        );


        /*
        ----------------------------------------------------
        TITRE
        ----------------------------------------------------
        */

        ctx.textAlign =
            "center";

        ctx.font =
            "bold 28px Georgia";

        ctx.fillStyle =
            "#d9b441";

        ctx.fillText(
            current.title,
            width / 2,
            70
        );


        /*
        ----------------------------------------------------
        NARRATION
        ----------------------------------------------------
        */

        this.drawNarration(
            current
        );


        /*
        ----------------------------------------------------
        FADE
        ----------------------------------------------------
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
        ----------------------------------------------------
        CONTROLES
        ----------------------------------------------------
        */

        ctx.font =
            "14px Arial";

        ctx.fillStyle =
            "rgba(255,255,255,.65)";

        ctx.fillText(
            this.finishedText
                ? "ESPACE : continuer"
                : "ESPACE : afficher le texte",
            width / 2,
            height - 45
        );

        ctx.restore();

    },


    /* ======================================================
       SCÈNE 1
       VILLE MODERNE + PALAIS
    ====================================================== */

    drawScene1() {

        const ctx =
            Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        /*
        ----------------------------------------------------
        CIEL
        ----------------------------------------------------
        */

        const sky =
            ctx.createLinearGradient(
                0,
                0,
                0,
                h
            );

        sky.addColorStop(
            0,
            "#02040a"
        );

        sky.addColorStop(
            .45,
            "#071426"
        );

        sky.addColorStop(
            1,
            "#101c2d"
        );

        ctx.fillStyle =
            sky;

        ctx.fillRect(
            0,
            0,
            w,
            h
        );


        /*
        ----------------------------------------------------
        LUNE
        ----------------------------------------------------
        */

        ctx.fillStyle =
            "#e9d995";

        ctx.beginPath();

        ctx.arc(
            w * .78,
            h * .18,
            52,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /*
        ----------------------------------------------------
        SKYLINE LOINTAINE
        ----------------------------------------------------
        */

        this.drawModernSkyline(
            .18,
            .55
        );


        /*
        ----------------------------------------------------
        SKYLINE INTERMÉDIAIRE
        ----------------------------------------------------
        */

        this.drawModernSkyline(
            .28,
            .67
        );


        /*
        ----------------------------------------------------
        PALAIS
        ----------------------------------------------------
        */

        const zoom =
            1 +
            Math.min(
                .12,
                this.visualTime * .004
            );

        this.drawModernPalace(
            w * .50,
            h * .78,
            .80 * zoom
        );


        /*
        ----------------------------------------------------
        ROUTE
        ----------------------------------------------------
        */

        ctx.fillStyle =
            "#090c12";

        ctx.fillRect(
            0,
            h * .82,
            w,
            h * .18
        );


        /*
        ----------------------------------------------------
        VOITURES
        ----------------------------------------------------
        */

        this.drawCars(
            h * .87,
            1
        );


        /*
        ----------------------------------------------------
        PLUIE
        ----------------------------------------------------
        */

        this.drawRain(
            90
        );


        /*
        ----------------------------------------------------
        DRONES
        ----------------------------------------------------
        */

        this.drawDrones(
            4
        );

    },


    /* ======================================================
       SCÈNE 2
       APPROCHE DU PALAIS
    ====================================================== */

    drawScene2() {

        const ctx =
            Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        /*
        ----------------------------------------------------
        FOND
        ----------------------------------------------------
        */

        ctx.fillStyle =
            "#040811";

        ctx.fillRect(
            0,
            0,
            w,
            h
        );


        /*
        ----------------------------------------------------
        SKYLINE
        ----------------------------------------------------
        */

        this.drawModernSkyline(
            .20,
            .35
        );


        this.drawModernSkyline(
            .35,
            .55
        );


        /*
        ----------------------------------------------------
        ZOOM CINÉMATIQUE
        ----------------------------------------------------
        */

        const progress =
            Math.min(
                1,
                this.visualTime / 13
            );

        const ease =
            progress *
            progress *
            (3 - 2 * progress);

        const zoom =
            .72 +
            ease * .62;


        ctx.save();

        ctx.translate(
            w / 2,
            h * .58
        );

        ctx.scale(
            zoom,
            zoom
        );

        ctx.translate(
            -w / 2,
            -h * .58
        );


        /*
        ----------------------------------------------------
        PALAIS
        ----------------------------------------------------
        */

        this.drawModernPalace(
            w / 2,
            h * .78,
            .95
        );


        /*
        ----------------------------------------------------
        AVENUE
        ----------------------------------------------------
        */

        ctx.fillStyle =
            "#080b10";

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
            h * .63
        );

        ctx.lineTo(
            w * .46,
            h * .63
        );

        ctx.closePath();

        ctx.fill();


        ctx.restore();


        /*
        ----------------------------------------------------
        PANNEAUX NÉONS
        ----------------------------------------------------
        */

        this.drawNeonSign(
            w * .15,
            h * .45,
            "PONAN CITY",
            "#268cff"
        );

        this.drawNeonSign(
            w * .82,
            h * .35,
            "ROYAL DISTRICT",
            "#e7b92f"
        );


        /*
        ----------------------------------------------------
        PLUIE
        ----------------------------------------------------
        */

        this.drawRain(
            120
        );


        /*
        ----------------------------------------------------
        VOITURES
        ----------------------------------------------------
        */

        this.drawCars(
            h * .87,
            1.2
        );

    },


    /* ======================================================
       SCÈNE 3
       SALLE DU TRÔNE
    ====================================================== */

    drawScene3() {

        const ctx =
            Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        /*
        ----------------------------------------------------
        MURS
        ----------------------------------------------------
        */

        const wall =
            ctx.createLinearGradient(
                0,
                0,
                0,
                h
            );

        wall.addColorStop(
            0,
            "#17151c"
        );

        wall.addColorStop(
            1,
            "#090a10"
        );

        ctx.fillStyle =
            wall;

        ctx.fillRect(
            0,
            0,
            w,
            h
        );


        /*
        ----------------------------------------------------
        COLONNES
        ----------------------------------------------------
        */

        for (
            let i = 0;
            i < 7;
            i++
        ) {

            const x =
                i *
                (w / 6);

            ctx.fillStyle =
                "#292630";

            ctx.fillRect(
                x - 25,
                80,
                50,
                h * .65
            );

            ctx.fillStyle =
                "#0b0c11";

            ctx.fillRect(
                x - 14,
                100,
                28,
                h * .61
            );

        }


        /*
        ----------------------------------------------------
        VITRAUX
        ----------------------------------------------------
        */

        this.drawStainedGlass(
            w * .20,
            h * .30,
            100
        );

        this.drawStainedGlass(
            w * .80,
            h * .30,
            100
        );


        /*
        ----------------------------------------------------
        SOL
        ----------------------------------------------------
        */

        ctx.fillStyle =
            "#08090d";

        ctx.fillRect(
            0,
            h * .72,
            w,
            h * .28
        );


        /*
        ----------------------------------------------------
        TAPIS ROUGE
        ----------------------------------------------------
        */

        ctx.fillStyle =
            "#641d2b";

        ctx.beginPath();

        ctx.moveTo(
            w * .42,
            h * .53
        );

        ctx.lineTo(
            w * .58,
            h * .53
        );

        ctx.lineTo(
            w * .76,
            h
        );

        ctx.lineTo(
            w * .24,
            h
        );

        ctx.closePath();

        ctx.fill();


        /*
        ----------------------------------------------------
        TRÔNE
        ----------------------------------------------------
        */

        this.drawGrandThrone(
            w / 2,
            h * .55,
            1.0
        );


        /*
        ----------------------------------------------------
        PONANINI III
        ----------------------------------------------------
        */

        this.drawDuckKing(
            w / 2,
            h * .40,
            1.05
        );


        /*
        ----------------------------------------------------
        GARDES
        ----------------------------------------------------
        */

        this.drawModernGuard(
            w * .23,
            h * .58,
            .95
        );

        this.drawModernGuard(
            w * .77,
            h * .58,
            .95
        );


        /*
        ----------------------------------------------------
        TORCHES
        ----------------------------------------------------
        */

        this.drawTorch(
            w * .08,
            h * .55
        );

        this.drawTorch(
            w * .92,
            h * .55
        );


        /*
        ----------------------------------------------------
        ZOOM SUR LE ROI
        ----------------------------------------------------
        */

        const zoom =
            1 +
            Math.min(
                .10,
                this.visualTime * .008
            );

        if (zoom > 1) {

            ctx.save();

            ctx.translate(
                w / 2,
                h * .40
            );

            ctx.scale(
                zoom,
                zoom
            );

            ctx.translate(
                -w / 2,
                -h * .40
            );

            ctx.restore();

        }

    },


    /* ======================================================
       SCÈNE 4
       TRAHISON
    ====================================================== */

    drawScene4() {

        /*
        On conserve une grande partie
        de la salle du trône.
        */

        this.drawScene3();

        const ctx =
            Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        /*
        ----------------------------------------------------
        OBSCURCISSEMENT
        ----------------------------------------------------
        */

        ctx.fillStyle =
            "rgba(0,0,8,.52)";

        ctx.fillRect(
            0,
            0,
            w,
            h
        );


        /*
        ----------------------------------------------------
        PONANINI IV
        ----------------------------------------------------
        */

        const move =
            Math.sin(
                this.visualTime *
                .7
            ) * 8;

        this.drawDuckVillain(
            w * .72,
            h * .42 + move,
            1.05
        );


        /*
        ----------------------------------------------------
        TABLETTE / DOSSIERS
        ----------------------------------------------------
        */

        ctx.fillStyle =
            "#161a22";

        ctx.fillRect(
            w * .60,
            h * .68,
            250,
            90
        );

        ctx.strokeStyle =
            "#b9973e";

        ctx.strokeRect(
            w * .60,
            h * .68,
            250,
            90
        );


        /*
        ----------------------------------------------------
        DOCUMENTS
        ----------------------------------------------------
        */

        for (
            let i = 0;
            i < 4;
            i++
        ) {

            ctx.fillStyle =
                "#d5d0bf";

            ctx.fillRect(
                w * .63 + i * 45,
                h * .70,
                34,
                45
            );

        }


        /*
        ----------------------------------------------------
        YEUX DE IV
        ----------------------------------------------------
        */

        const eyePulse =
            .7 +
            Math.abs(
                Math.sin(
                    this.visualTime *
                    3
                )
            ) * .3;

        ctx.fillStyle =
            `rgba(255,50,60,${eyePulse})`;

        ctx.fillRect(
            w * .72 - 18,
            h * .40,
            10,
            5
        );

        ctx.fillRect(
            w * .72 + 8,
            h * .40,
            10,
            5
        );

    },


    /* ======================================================
       SCÈNE 5
       CONSPIRATION
    ====================================================== */

    drawScene5() {

        const ctx =
            Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        ctx.fillStyle =
            "#070a10";

        ctx.fillRect(
            0,
            0,
            w,
            h
        );


        /*
        ----------------------------------------------------
        COULOIR DU PALAIS
        ----------------------------------------------------
        */

        ctx.fillStyle =
            "#171b24";

        ctx.fillRect(
            0,
            0,
            w,
            h * .78
        );


        /*
        ----------------------------------------------------
        BAIES VITRÉES
        ----------------------------------------------------
        */

        for (
            let i = 0;
            i < 8;
            i++
        ) {

            const x =
                i *
                w / 7;

            ctx.fillStyle =
                "#10273d";

            ctx.fillRect(
                x,
                100,
                100,
                350
            );

            ctx.strokeStyle =
                "#263b4e";

            ctx.strokeRect(
                x,
                100,
                100,
                350
            );

        }


        /*
        ----------------------------------------------------
        VILLE VISIBLE
        ----------------------------------------------------
        */

        this.drawModernSkyline(
            .45,
            .10
        );


        /*
        ----------------------------------------------------
        GARDES MODERNES + ARMURES
        ----------------------------------------------------
        */

        this.drawModernGuard(
            w * .25,
            h * .47,
            1
        );

        this.drawModernGuard(
            w * .75,
            h * .47,
            1
        );


        /*
        ----------------------------------------------------
        PONANINI IV
        ----------------------------------------------------
        */

        this.drawDuckVillain(
            w / 2,
            h * .38,
            .95
        );


        /*
        ----------------------------------------------------
        DOCUMENT QUI PASSE DE MAIN EN MAIN
        ----------------------------------------------------
        */

        const paperX =
            w * .50 +
            Math.sin(
                this.visualTime * 1.4
            ) * 130;

        ctx.fillStyle =
            "#e4deca";

        ctx.fillRect(
            paperX,
            h * .60,
            65,
            85
        );


        /*
        ----------------------------------------------------
        FLASH DE CAMÉRA
        ----------------------------------------------------
        */

        if (
            Math.sin(
                this.visualTime * 4
            ) > .96
        ) {

            ctx.fillStyle =
                "rgba(255,255,255,.10)";

            ctx.fillRect(
                0,
                0,
                w,
                h
            );

        }


        this.drawRain(
            60
        );

    },


    /* ======================================================
       SCÈNE 6
       FAUX ROI
    ====================================================== */

    drawScene6() {

        const ctx =
            Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        /*
        ----------------------------------------------------
        GRANDE SALLE
        ----------------------------------------------------
        */

        ctx.fillStyle =
            "#08090d";

        ctx.fillRect(
            0,
            0,
            w,
            h
        );


        /*
        ----------------------------------------------------
        FOND DE VILLE
        ----------------------------------------------------
        */

        this.drawModernSkyline(
            .30,
            .20
        );


        /*
        ----------------------------------------------------
        TRÔNE
        ----------------------------------------------------
        */

        this.drawGrandThrone(
            w / 2,
            h * .58,
            1.1
        );


        /*
        ----------------------------------------------------
        PONANINI IV
        ----------------------------------------------------
        */

        this.drawDuckVillain(
            w / 2,
            h * .40,
            1.15
        );


        /*
        ----------------------------------------------------
        COURONNE
        ----------------------------------------------------
        */

        const crownGlow =
            .7 +
            Math.sin(
                this.visualTime * 3
            ) * .2;

        ctx.shadowBlur =
            25;

        ctx.shadowColor =
            "#d9b441";

        ctx.fillStyle =
            `rgba(217,180,65,${crownGlow})`;

        ctx.beginPath();

        ctx.arc(
            w / 2,
            h * .24,
            8,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.shadowBlur =
            0;


        /*
        ----------------------------------------------------
        PONANINI III AU PREMIER PLAN
        ----------------------------------------------------
        */

        this.drawDuckKing(
            w * .28,
            h * .58,
            .85
        );


        /*
        ----------------------------------------------------
        GUARDES
        ----------------------------------------------------
        */

        this.drawModernGuard(
            w * .14,
            h * .60,
            .9
        );

        this.drawModernGuard(
            w * .86,
            h * .60,
            .9
        );


        /*
        ----------------------------------------------------
        TEXTE / ACCUSATION
        ----------------------------------------------------
        */

        ctx.fillStyle =
            "#d9b441";

        ctx.font =
            "bold 20px Georgia";

        ctx.textAlign =
            "center";

        ctx.fillText(
            "TRAÎTRE",
            w * .28,
            h * .78
        );

    },


    /* ======================================================
       SCÈNE 7
       PORTAIL + BANNISSEMENT
    ====================================================== */

    drawScene7() {

        const ctx =
            Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        /*
        ----------------------------------------------------
        COUR DU PALAIS
        ----------------------------------------------------
        */

        ctx.fillStyle =
            "#070a10";

        ctx.fillRect(
            0,
            0,
            w,
            h
        );


        /*
        ----------------------------------------------------
        VILLE EN FOND
        ----------------------------------------------------
        */

        this.drawModernSkyline(
            .32,
            .15
        );


        /*
        ----------------------------------------------------
        PALAIS
        ----------------------------------------------------
        */

        this.drawModernPalace(
            w / 2,
            h * .73,
            .72
        );


        /*
        ----------------------------------------------------
        SOL
        ----------------------------------------------------
        */

        ctx.fillStyle =
            "#101319";

        ctx.fillRect(
            0,
            h * .72,
            w,
            h * .28
        );


        /*
        ----------------------------------------------------
        PORTAIL
        ----------------------------------------------------
        */

        const portalX =
            w * .52;

        const portalY =
            h * .56;

        const opening =
            Math.min(
                1,
                this.visualTime / 4
            );


        this.drawPortal(
            portalX,
            portalY,
            1.0 * opening
        );


        /*
        ----------------------------------------------------
        PONANINI III
        ----------------------------------------------------
        */

        const pushProgress =
            Math.min(
                1,
                Math.max(
                    0,
                    (this.visualTime - 3) / 8
                )
            );


        const eased =
            pushProgress *
            pushProgress *
            (3 - 2 * pushProgress);


        const duckX =
            w * .36 +
            eased * w * .16;


        this.drawDuckKing(
            duckX,
            h * .54,
            .95
        );


        /*
        ----------------------------------------------------
        PONANINI IV
        ----------------------------------------------------
        */

        this.drawDuckVillain(
            w * .22,
            h * .53,
            .95
        );


        /*
        ----------------------------------------------------
        IV POUSSE III
        ----------------------------------------------------
        */

        if (
            pushProgress > .05 &&
            pushProgress < .90
        ) {

            ctx.strokeStyle =
                "#c9c0aa";

            ctx.lineWidth =
                8;

            ctx.beginPath();

            ctx.moveTo(
                w * .28,
                h * .51
            );

            ctx.lineTo(
                duckX - 45,
                h * .51
            );

            ctx.stroke();

        }


        /*
        ----------------------------------------------------
        PORTAIL SE REFERME RAPIDEMENT
        ----------------------------------------------------
        */

        if (
            pushProgress >= .78
        ) {

            const close =
                Math.min(
                    1,
                    (pushProgress - .78) /
                    .22
                );

            this.drawPortal(
                portalX,
                portalY,
                1 - close
            );

        }


        /*
        ----------------------------------------------------
        PARTICULES
        ----------------------------------------------------
        */

        this.drawPortalParticles(
            portalX,
            portalY,
            80
        );


        /*
        ----------------------------------------------------
        PLUIE
        ----------------------------------------------------
        */

        this.drawRain(
            100
        );

    },


    /* ======================================================
       SCÈNE 8
       NETHER
    ====================================================== */

    drawScene8() {

        const ctx =
            Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        /*
        ----------------------------------------------------
        CIEL
        ----------------------------------------------------
        */

        const sky =
            ctx.createLinearGradient(
                0,
                0,
                0,
                h
            );

        sky.addColorStop(
            0,
            "#070009"
        );

        sky.addColorStop(
            .40,
            "#2a0310"
        );

        sky.addColorStop(
            .75,
            "#5d0b0d"
        );

        sky.addColorStop(
            1,
            "#090207"
        );

        ctx.fillStyle =
            sky;

        ctx.fillRect(
            0,
            0,
            w,
            h
        );


        /*
        ----------------------------------------------------
        MONTAGNES DU NETHER
        ----------------------------------------------------
        */

        ctx.fillStyle =
            "#16040b";

        for (
            let i = -1;
            i < 9;
            i++
        ) {

            const offset =
                Math.sin(
                    this.visualTime * .2 +
                    i
                ) * 20;

            ctx.beginPath();

            ctx.moveTo(
                i * 180,
                h * .78
            );

            ctx.lineTo(
                i * 180 + 90 + offset,
                h * .25
            );

            ctx.lineTo(
                i * 180 + 180,
                h * .78
            );

            ctx.closePath();

            ctx.fill();

        }


        /*
        ----------------------------------------------------
        FAILLES
        ----------------------------------------------------
        */

        ctx.strokeStyle =
            "#9c1718";

        ctx.lineWidth =
            4;

        for (
            let i = 0;
            i < 7;
            i++
        ) {

            const x =
                i * 180;

            ctx.beginPath();

            ctx.moveTo(
                x,
                h * .20
            );

            ctx.lineTo(
                x - 25,
                h * .36
            );

            ctx.lineTo(
                x + 20,
                h * .48
            );

            ctx.stroke();

        }


        /*
        ----------------------------------------------------
        LAVE
        ----------------------------------------------------
        */

        ctx.fillStyle =
            "#67140d";

        ctx.fillRect(
            0,
            h * .78,
            w,
            h * .22
        );


        ctx.fillStyle =
            "#ef4d18";

        for (
            let i = 0;
            i < 15;
            i++
        ) {

            const x =
                i * 110 +
                Math.sin(
                    this.visualTime * 2 +
                    i
                ) * 25;

            const y =
                h * .81 +
                Math.sin(
                    this.visualTime * 2.5 +
                    i
                ) * 8;

            ctx.fillRect(
                x,
                y,
                55,
                5
            );

        }


        /*
        ----------------------------------------------------
        BRAISES
        ----------------------------------------------------
        */

        this.drawEmbers(
            120
        );


        /*
        ----------------------------------------------------
        PONANINI III
        ----------------------------------------------------
        */

        const breathing =
            Math.sin(
                this.visualTime * 1.5
            ) * 3;

        this.drawDuckKing(
            w / 2,
            h * .58 + breathing,
            .95
        );


        /*
        ----------------------------------------------------
        PORTAIL ÉTEINT
        ----------------------------------------------------
        */

        ctx.strokeStyle =
            "rgba(50,110,255,.35)";

        ctx.lineWidth =
            5;

        ctx.beginPath();

        ctx.ellipse(
            w / 2,
            h * .50,
            105,
            155,
            0,
            0,
            Math.PI * 2
        );

        ctx.stroke();

    },


    /* ======================================================
       SCÈNE 9
       FRAGMENTS
    ====================================================== */

    drawScene9() {

        this.drawScene8();

        const ctx =
            Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        /*
        ----------------------------------------------------
        AUTEL
        ----------------------------------------------------
        */

        ctx.fillStyle =
            "#181018";

        ctx.fillRect(
            w * .30,
            h * .67,
            w * .40,
            30
        );


        /*
        ----------------------------------------------------
        CERCLE MAGIQUE
        ----------------------------------------------------
        */

        ctx.strokeStyle =
            "#286fff";

        ctx.lineWidth =
            3;

        ctx.beginPath();

        ctx.arc(
            w / 2,
            h * .58,
            180,
            this.visualTime,
            this.visualTime +
            Math.PI * 2
        );

        ctx.stroke();


        /*
        ----------------------------------------------------
        FRAGMENTS
        ----------------------------------------------------
        */

        const fragments = [

            [
                w / 2,
                h * .30,
                "#e5bd39"
            ],

            [
                w * .36,
                h * .56,
                "#347fff"
            ],

            [
                w * .64,
                h * .56,
                "#8a54ff"
            ]

        ];


        fragments.forEach(
            (fragment, index) => {

                const x =
                    fragment[0];

                const y =
                    fragment[1] +
                    Math.sin(
                        this.visualTime * 2 +
                        index
                    ) * 12;


                ctx.save();

                ctx.translate(
                    x,
                    y
                );

                ctx.rotate(
                    this.visualTime *
                    (.25 + index * .1)
                );


                /*
                Halo
                */

                const glow =
                    ctx.createRadialGradient(
                        0,
                        0,
                        5,
                        0,
                        0,
                        80
                    );

                glow.addColorStop(
                    0,
                    fragment[2]
                );

                glow.addColorStop(
                    1,
                    "rgba(0,0,0,0)"
                );

                ctx.fillStyle =
                    glow;

                ctx.fillRect(
                    -90,
                    -90,
                    180,
                    180
                );


                /*
                Cristal
                */

                ctx.fillStyle =
                    fragment[2];

                ctx.beginPath();

                ctx.moveTo(
                    0,
                    -38
                );

                ctx.lineTo(
                    25,
                    0
                );

                ctx.lineTo(
                    0,
                    38
                );

                ctx.lineTo(
                    -25,
                    0
                );

                ctx.closePath();

                ctx.fill();


                ctx.strokeStyle =
                    "#ffffff";

                ctx.lineWidth =
                    2;

                ctx.stroke();

                ctx.restore();

            }
        );


        /*
        ----------------------------------------------------
        PONANINI III OBSERVE
        ----------------------------------------------------
        */

        this.drawDuckKing(
            w / 2,
            h * .76,
            .65
        );


        this.drawEmbers(
            80
        );

    },


    /* ======================================================
       SCÈNE 10
       LE JOUEUR
    ====================================================== */

    drawScene10() {

        const ctx =
            Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        /*
        ----------------------------------------------------
        NETHER
        ----------------------------------------------------
        */

        this.drawScene8();


        /*
        ----------------------------------------------------
        PORTAIL
        ----------------------------------------------------
        */

        const portalX =
            w * .72;

        const portalY =
            h * .48;


        this.drawPortal(
            portalX,
            portalY,
            1
        );


        /*
        ----------------------------------------------------
        SILHOUETTE DU JOUEUR
        ----------------------------------------------------
        */

        const playerX =
            w * .72;

        const playerY =
            h * .66;


        ctx.fillStyle =
            "#020207";

        ctx.fillRect(
            playerX - 28,
            playerY,
            56,
            120
        );


        ctx.beginPath();

        ctx.arc(
            playerX,
            playerY - 30,
            32,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /*
        ----------------------------------------------------
        PONANINI III
        ----------------------------------------------------
        */

        const approach =
            Math.min(
                1,
                this.visualTime / 10
            );

        const duckScale =
            .70 +
            approach * .30;


        this.drawDuckKing(
            w * .42,
            h * .50,
            duckScale
        );


        /*
        ----------------------------------------------------
        REGARD
        ----------------------------------------------------
        */

        ctx.strokeStyle =
            "rgba(220,190,70,.45)";

        ctx.lineWidth =
            2;

        ctx.beginPath();

        ctx.moveTo(
            w * .49,
            h * .45
        );

        ctx.lineTo(
            playerX - 35,
            playerY - 25
        );

        ctx.stroke();


        /*
        ----------------------------------------------------
        PORTAIL
        ----------------------------------------------------
        */

        this.drawPortalParticles(
            portalX,
            portalY,
            60
        );

    },


    /* ======================================================
       ANCIENS NOMS
       Compatibilité avec d'éventuels appels externes
    ====================================================== */

    drawKingdom() {

        this.drawScene1();

    },

    drawCastle() {

        this.drawScene2();

    },

    drawThroneRoom() {

        this.drawScene3();

    },

    drawBetrayal() {

        this.drawScene4();

    },

    drawFalseKing() {

        this.drawScene6();

    },

    drawExile() {

        this.drawScene7();

    },

    drawNether() {

        this.drawScene8();

    },

    drawFragments() {

        this.drawScene9();

    },

    drawProposal() {

        this.drawScene10();

    },

    drawBeginning() {

        this.drawScene10();

    },


    /* ======================================================
       PALAIS MODERNE / GOTHIQUE
    ====================================================== */

    drawModernPalace(
        x,
        y,
        scale
    ) {

        const ctx =
            Game.ctx;

        ctx.save();

        ctx.translate(
            x,
            y
        );

        ctx.scale(
            scale,
            scale
        );


        /*
        ----------------------------------------------------
        OMBRE DU PALAIS
        ----------------------------------------------------
        */

        ctx.fillStyle =
            "#020307";

        ctx.fillRect(
            -310,
            -430,
            620,
            430
        );


        /*
        ----------------------------------------------------
        CORPS CENTRAL
        ----------------------------------------------------
        */

        ctx.fillStyle =
            "#252934";

        ctx.fillRect(
            -180,
            -340,
            360,
            340
        );


        /*
        ----------------------------------------------------
        PIERRES
        ----------------------------------------------------
        */

        ctx.strokeStyle =
            "#353944";

        ctx.lineWidth =
            3;

        for (
            let y2 = -320;
            y2 < -20;
            y2 += 38
        ) {

            ctx.beginPath();

            ctx.moveTo(
                -175,
                y2
            );

            ctx.lineTo(
                175,
                y2
            );

            ctx.stroke();

        }


        /*
        ----------------------------------------------------
        TOURS
        ----------------------------------------------------
        */

        this.drawPalaceTower(
            -280,
            -400,
            150
        );

        this.drawPalaceTower(
            130,
            -400,
            150
        );


        /*
        ----------------------------------------------------
        TOUR CENTRALE
        ----------------------------------------------------
        */

        ctx.fillStyle =
            "#30343e";

        ctx.fillRect(
            -80,
            -470,
            160,
            470
        );


        /*
        ----------------------------------------------------
        TOIT CENTRAL
        ----------------------------------------------------
        */

        ctx.fillStyle =
            "#090b11";

        ctx.beginPath();

        ctx.moveTo(
            -105,
            -470
        );

        ctx.lineTo(
            0,
            -610
        );

        ctx.lineTo(
            105,
            -470
        );

        ctx.closePath();

        ctx.fill();


        /*
        ----------------------------------------------------
        FENÊTRES
        ----------------------------------------------------
        */

        for (
            let i = -2;
            i <= 2;
            i++
        ) {

            ctx.fillStyle =
                i === 0
                    ? "#e2b93e"
                    : "#284d72";

            ctx.fillRect(
                i * 55 - 10,
                -290,
                20,
                55
            );

        }


        /*
        ----------------------------------------------------
        PORTE
        ----------------------------------------------------
        */

        ctx.fillStyle =
            "#07080d";

        ctx.fillRect(
            -45,
            -120,
            90,
            120
        );


        /*
        ----------------------------------------------------
        ARCHE
        ----------------------------------------------------
        */

        ctx.strokeStyle =
            "#9a7831";

        ctx.lineWidth =
            8;

        ctx.strokeRect(
            -52,
            -128,
            104,
            136
        );


        /*
        ----------------------------------------------------
        DRAPEAUX
        ----------------------------------------------------
        */

        this.drawFlag(
            -290,
            -560,
            "#d4ae3a"
        );

        this.drawFlag(
            290,
            -560,
            "#315d8c"
        );


        /*
        ----------------------------------------------------
        ANTENNES / MODERNITÉ
        ----------------------------------------------------
        */

        ctx.strokeStyle =
            "#687381";

        ctx.lineWidth =
            3;

        ctx.beginPath();

        ctx.moveTo(
            0,
            -610
        );

        ctx.lineTo(
            0,
            -680
        );

        ctx.stroke();


        ctx.fillStyle =
            "#39a8ff";

        ctx.beginPath();

        ctx.arc(
            0,
            -685,
            5,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.restore();

    },


    /* ======================================================
       TOUR
    ====================================================== */

    drawPalaceTower(
        x,
        y,
        height
    ) {

        const ctx =
            Game.ctx;

        ctx.fillStyle =
            "#222631";

        ctx.fillRect(
            x,
            y,
            150,
            height
        );


        /*
        Crénelage
        */

        for (
            let i = 0;
            i < 5;
            i++
        ) {

            ctx.fillRect(
                x + i * 32,
                y - 15,
                22,
                18
            );

        }


        /*
        Toit
        */

        ctx.fillStyle =
            "#080a0f";

        ctx.beginPath();

        ctx.moveTo(
            x - 15,
            y
        );

        ctx.lineTo(
            x + 75,
            y - 120
        );

        ctx.lineTo(
            x + 165,
            y
        );

        ctx.closePath();

        ctx.fill();


        /*
        Fenêtres
        */

        for (
            let j = 0;
            j < 4;
            j++
        ) {

            ctx.fillStyle =
                j % 2 === 0
                    ? "#d7ae39"
                    : "#32618e";

            ctx.fillRect(
                x + 68,
                y + 45 + j * 70,
                15,
                30
            );

        }

    },


    /* ======================================================
       SKYLINE
    ====================================================== */

    drawModernSkyline(
        density,
        base
    ) {

        const ctx =
            Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        const count =
            Math.floor(
                w / 65 * density
            ) + 5;


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const x =
                i * 80;

            const buildingHeight =
                100 +
                ((i * 97) % 230);


            ctx.fillStyle =
                i % 3 === 0
                    ? "#111924"
                    : "#0b121c";


            ctx.fillRect(
                x,
                h * base -
                buildingHeight,
                60,
                buildingHeight
            );


            /*
            Structure acier
            */

            ctx.strokeStyle =
                "#263746";

            ctx.lineWidth =
                2;

            ctx.strokeRect(
                x,
                h * base -
                buildingHeight,
                60,
                buildingHeight
            );


            /*
            Fenêtres
            */

            for (
                let wy = h * base -
                    buildingHeight +
                    15;
                wy < h * base - 10;
                wy += 22
            ) {

                for (
                    let wx = x + 8;
                    wx < x + 52;
                    wx += 14
                ) {

                    const blink =
                        Math.sin(
                            this.visualTime *
                            1.5 +
                            i +
                            wx
                        );

                    if (
                        blink > -.35
                    ) {

                        ctx.fillStyle =
                            i % 4 === 0
                                ? "#2b83d5"
                                : "#d7ad38";

                        ctx.fillRect(
                            wx,
                            wy,
                            5,
                            7
                        );

                    }

                }

            }

        }

    },


    /* ======================================================
       VOITURES
    ====================================================== */

    drawCars(
        y,
        scale
    ) {

        const ctx =
            Game.ctx;

        const w =
            Game.canvas.width;


        for (
            let i = 0;
            i < 6;
            i++
        ) {

            const speed =
                90 +
                i * 15;

            let x =
                (
                    this.visualTime *
                    speed +
                    i * 210
                ) %
                (w + 300) -
                150;


            ctx.save();

            ctx.translate(
                x,
                y
            );

            ctx.scale(
                scale,
                scale
            );


            /*
            carrosserie
            */

            ctx.fillStyle =
                i % 2 === 0
                    ? "#263b52"
                    : "#25252b";

            ctx.fillRect(
                -38,
                -15,
                76,
                22
            );


            ctx.fillRect(
                -25,
                -28,
                45,
                16
            );


            /*
            roues
            */

            ctx.fillStyle =
                "#030407";

            ctx.beginPath();

            ctx.arc(
                -24,
                10,
                9,
                0,
                Math.PI * 2
            );

            ctx.arc(
                24,
                10,
                9,
                0,
                Math.PI * 2
            );

            ctx.fill();


            /*
            phares
            */

            ctx.fillStyle =
                "#e9d98b";

            ctx.fillRect(
                35,
                -8,
                6,
                5
            );

            ctx.restore();

        }

    },


    /* ======================================================
       DRONES
    ====================================================== */

    drawDrones(
        count
    ) {

        const ctx =
            Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const x =
                (
                    i * 260 +
                    this.visualTime *
                    (20 + i * 4)
                ) %
                (w + 200) -
                100;

            const y =
                h * .22 +
                Math.sin(
                    this.visualTime +
                    i
                ) * 25;


            ctx.fillStyle =
                "#0a0d13";

            ctx.fillRect(
                x - 12,
                y - 5,
                24,
                10
            );


            ctx.fillStyle =
                "#47aaff";

            ctx.fillRect(
                x - 3,
                y + 5,
                6,
                4
            );


            ctx.strokeStyle =
                "#53616e";

            ctx.lineWidth =
                2;

            ctx.beginPath();

            ctx.moveTo(
                x - 20,
                y
            );

            ctx.lineTo(
                x + 20,
                y
            );

            ctx.stroke();

        }

    },


    /* ======================================================
       PANNEAU NÉON
    ====================================================== */

    drawNeonSign(
        x,
        y,
        text,
        color
    ) {

        const ctx =
            Game.ctx;


        const flicker =
            Math.sin(
                this.visualTime * 7 +
                x
            ) > .94
                ? .25
                : 1;


        ctx.globalAlpha =
            flicker;


        ctx.shadowBlur =
            18;

        ctx.shadowColor =
            color;

        ctx.strokeStyle =
            color;

        ctx.lineWidth =
            2;

        ctx.strokeRect(
            x - 75,
            y - 25,
            150,
            50
        );


        ctx.fillStyle =
            color;

        ctx.font =
            "bold 14px Arial";

        ctx.textAlign =
            "center";

        ctx.fillText(
            text,
            x,
            y + 5
        );


        ctx.shadowBlur =
            0;

        ctx.globalAlpha =
            1;

    },


    /* ======================================================
       VITRAIL
    ====================================================== */

    drawStainedGlass(
        x,
        y,
        size
    ) {

        const ctx =
            Game.ctx;


        ctx.save();

        ctx.translate(
            x,
            y
        );


        ctx.strokeStyle =
            "#8d7433";

        ctx.lineWidth =
            8;


        ctx.beginPath();

        ctx.moveTo(
            -size / 2,
            size / 2
        );

        ctx.lineTo(
            0,
            -size / 2
        );

        ctx.lineTo(
            size / 2,
            size / 2
        );

        ctx.closePath();

        ctx.stroke();


        ctx.fillStyle =
            "rgba(45,105,170,.55)";

        ctx.beginPath();

        ctx.moveTo(
            -size / 2 + 6,
            size / 2
        );

        ctx.lineTo(
            0,
            -size / 2 + 8
        );

        ctx.lineTo(
            size / 2 - 6,
            size / 2
        );

        ctx.closePath();

        ctx.fill();


        ctx.strokeStyle =
            "#c5a944";

        ctx.beginPath();

        ctx.moveTo(
            0,
            -size / 2
        );

        ctx.lineTo(
            0,
            size / 2
        );

        ctx.stroke();

        ctx.restore();

    },


    /* ======================================================
       GRAND TRÔNE
    ====================================================== */

    drawGrandThrone(
        x,
        y,
        scale
    ) {

        const ctx =
            Game.ctx;

        ctx.save();

        ctx.translate(
            x,
            y
        );

        ctx.scale(
            scale,
            scale
        );


        /*
        dossier
        */

        ctx.fillStyle =
            "#80602b";

        ctx.fillRect(
            -120,
            -150,
            240,
            220
        );


        /*
        tissu
        */

        ctx.fillStyle =
            "#501c2d";

        ctx.fillRect(
            -90,
            -125,
            180,
            175
        );


        /*
        ornements
        */

        ctx.strokeStyle =
            "#d1a83d";

        ctx.lineWidth =
            7;

        ctx.strokeRect(
            -105,
            -138,
            210,
            195
        );


        /*
        accoudoirs
        */

        ctx.fillStyle =
            "#9b7730";

        ctx.fillRect(
            -145,
            30,
            45,
            40
        );

        ctx.fillRect(
            100,
            30,
            45,
            40
        );


        /*
        estrade
        */

        ctx.fillStyle =
            "#2a1b15";

        ctx.fillRect(
            -160,
            70,
            320,
            30
        );


        ctx.restore();

    },


    /* ======================================================
       PONANINI III
    ====================================================== */

    drawDuckKing(
        x,
        y,
        scale
    ) {

        const ctx =
            Game.ctx;

        ctx.save();

        ctx.translate(
            x,
            y
        );

        ctx.scale(
            scale,
            scale
        );


        /*
        ----------------------------------------------------
        CAPE
        ----------------------------------------------------
        */

        ctx.fillStyle =
            "#3c1728";

        ctx.beginPath();

        ctx.moveTo(
            -60,
            45
        );

        ctx.lineTo(
            60,
            45
        );

        ctx.lineTo(
            95,
            165
        );

        ctx.lineTo(
            -95,
            165
        );

        ctx.closePath();

        ctx.fill();


        /*
        ----------------------------------------------------
        ARMURE
        ----------------------------------------------------
        */

        ctx.fillStyle =
            "#303844";

        ctx.fillRect(
            -48,
            45,
            96,
            110
        );


        ctx.strokeStyle =
            "#8f7d4c";

        ctx.lineWidth =
            4;

        ctx.strokeRect(
            -48,
            45,
            96,
            110
        );


        /*
        ----------------------------------------------------
        TÊTE
        ----------------------------------------------------
        */

        ctx.fillStyle =
            "#d8d9cf";

        ctx.beginPath();

        ctx.ellipse(
            0,
            0,
            55,
            48,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /*
        ----------------------------------------------------
        PLUMES
        ----------------------------------------------------
        */

        ctx.fillStyle =
            "#bfc2ba";

        for (
            let i = -2;
            i <= 2;
            i++
        ) {

            ctx.beginPath();

            ctx.ellipse(
                i * 18,
                -38,
                19,
                34,
                i * .13,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }


        /*
        ----------------------------------------------------
        YEUX
        ----------------------------------------------------
        */

        ctx.fillStyle =
            "#16171c";

        ctx.beginPath();

        ctx.arc(
            -21,
            -5,
            7,
            0,
            Math.PI * 2
        );

        ctx.arc(
            21,
            -5,
            7,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /*
        ----------------------------------------------------
        REFLET YEUX
        ----------------------------------------------------
        */

        ctx.fillStyle =
            "#ffffff";

        ctx.fillRect(
            -19,
            -7,
            2,
            2
        );

        ctx.fillRect(
            23,
            -7,
            2,
            2
        );


        /*
        ----------------------------------------------------
        BEC
        ----------------------------------------------------
        */

        ctx.fillStyle =
            "#d78929";

        ctx.beginPath();

        ctx.moveTo(
            -30,
            8
        );

        ctx.lineTo(
            0,
            30
        );

        ctx.lineTo(
            30,
            8
        );

        ctx.closePath();

        ctx.fill();


        /*
        ----------------------------------------------------
        COURONNE
        ----------------------------------------------------
        */

        ctx.fillStyle =
            "#d9b13e";

        ctx.beginPath();

        ctx.moveTo(
            -47,
            -40
        );

        ctx.lineTo(
            -35,
            -82
        );

        ctx.lineTo(
            -12,
            -53
        );

        ctx.lineTo(
            0,
            -94
        );

        ctx.lineTo(
            17,
            -53
        );

        ctx.lineTo(
            40,
            -82
        );

        ctx.lineTo(
            46,
            -38
        );

        ctx.closePath();

        ctx.fill();


        /*
        ----------------------------------------------------
        PIERRES DE LA COURONNE
        ----------------------------------------------------
        */

        ctx.fillStyle =
            "#d83a46";

        ctx.beginPath();

        ctx.arc(
            0,
            -70,
            7,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.fillStyle =
            "#3c83d8";

        ctx.beginPath();

        ctx.arc(
            -27,
            -59,
            5,
            0,
            Math.PI * 2
        );

        ctx.arc(
            28,
            -59,
            5,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.restore();

    },


    /* ======================================================
       PONANINI IV
    ====================================================== */

    drawDuckVillain(
        x,
        y,
        scale
    ) {

        const ctx =
            Game.ctx;

        ctx.save();

        ctx.translate(
            x,
            y
        );

        ctx.scale(
            scale,
            scale
        );


        /*
        ----------------------------------------------------
        CAPE NOIRE
        ----------------------------------------------------
        */

        ctx.fillStyle =
            "#100b19";

        ctx.beginPath();

        ctx.moveTo(
            -65,
            40
        );

        ctx.lineTo(
            65,
            40
        );

        ctx.lineTo(
            100,
            170
        );

        ctx.lineTo(
            -100,
            170
        );

        ctx.closePath();

        ctx.fill();


        /*
        ----------------------------------------------------
        ARMURE
        ----------------------------------------------------
        */

        ctx.fillStyle =
            "#242530";

        ctx.fillRect(
            -50,
            42,
            100,
            110
        );


        ctx.strokeStyle =
            "#6d5a34";

        ctx.lineWidth =
            4;

        ctx.strokeRect(
            -50,
            42,
            100,
            110
        );


        /*
        ----------------------------------------------------
        TÊTE
        ----------------------------------------------------
        */

        ctx.fillStyle =
            "#24252b";

        ctx.beginPath();

        ctx.ellipse(
            0,
            0,
            55,
            48,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /*
        ----------------------------------------------------
        PLUMES NOIRES
        ----------------------------------------------------
        */

        ctx.fillStyle =
            "#08080d";

        for (
            let i = -2;
            i <= 2;
            i++
        ) {

            ctx.beginPath();

            ctx.ellipse(
                i * 18,
                -40,
                20,
                34,
                i * .13,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }


        /*
        ----------------------------------------------------
        YEUX
        ----------------------------------------------------
        */

        const pulse =
            .65 +
            Math.abs(
                Math.sin(
                    this.visualTime *
                    2.5
                )
            ) * .35;

        ctx.fillStyle =
            `rgba(235,45,55,${pulse})`;

        ctx.fillRect(
            -28,
            -7,
            15,
            7
        );

        ctx.fillRect(
            13,
            -7,
            15,
            7
        );


        /*
        ----------------------------------------------------
        BEC
        ----------------------------------------------------
        */

        ctx.fillStyle =
            "#a96025";

        ctx.beginPath();

        ctx.moveTo(
            -30,
            8
        );

        ctx.lineTo(
            0,
            30
        );

        ctx.lineTo(
            30,
            8
        );

        ctx.closePath();

        ctx.fill();


        /*
        ----------------------------------------------------
        COURONNE
        ----------------------------------------------------
        */

        ctx.fillStyle =
            "#9d7628";

        ctx.beginPath();

        ctx.moveTo(
            -47,
            -40
        );

        ctx.lineTo(
            -35,
            -82
        );

        ctx.lineTo(
            -12,
            -53
        );

        ctx.lineTo(
            0,
            -94
        );

        ctx.lineTo(
            17,
            -53
        );

        ctx.lineTo(
            40,
            -82
        );

        ctx.lineTo(
            46,
            -38
        );

        ctx.closePath();

        ctx.fill();


        /*
        ----------------------------------------------------
        GEMME ROUGE
        ----------------------------------------------------
        */

        ctx.fillStyle =
            "#d32e3c";

        ctx.beginPath();

        ctx.arc(
            0,
            -70,
            7,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /*
        ----------------------------------------------------
        OMBRE DU VISAGE
        ----------------------------------------------------
        */

        ctx.fillStyle =
            "rgba(0,0,0,.25)";

        ctx.beginPath();

        ctx.arc(
            0,
            12,
            40,
            0,
            Math.PI
        );

        ctx.fill();


        ctx.restore();

    },


    /* ======================================================
       GARDE MODERNE + MÉDIÉVAL
    ====================================================== */

    drawModernGuard(
        x,
        y,
        scale
    ) {

        const ctx =
            Game.ctx;

        ctx.save();

        ctx.translate(
            x,
            y
        );

        ctx.scale(
            scale,
            scale
        );


        /*
        casque
        */

        ctx.fillStyle =
            "#313947";

        ctx.beginPath();

        ctx.arc(
            0,
            -15,
            27,
            Math.PI,
            0
        );

        ctx.fill();


        /*
        corps
        */

        ctx.fillStyle =
            "#171b23";

        ctx.fillRect(
            -25,
            0,
            50,
            100
        );


        /*
        armure
        */

        ctx.strokeStyle =
            "#737c87";

        ctx.lineWidth =
            5;

        ctx.strokeRect(
            -25,
            0,
            50,
            100
        );


        /*
        visière
        */

        ctx.fillStyle =
            "#05060a";

        ctx.fillRect(
            -24,
            -13,
            48,
            8
        );


        /*
        épée
        */

        ctx.strokeStyle =
            "#c2c7d0";

        ctx.lineWidth =
            5;

        ctx.beginPath();

        ctx.moveTo(
            30,
            30
        );

        ctx.lineTo(
            60,
            -60
        );

        ctx.stroke();


        ctx.restore();

    },


    /* ======================================================
       DRAPEAU
    ====================================================== */

    drawFlag(
        x,
        y,
        color
    ) {

        const ctx =
            Game.ctx;

        const wave =
            Math.sin(
                this.visualTime * 3 +
                x
            ) * 10;


        ctx.strokeStyle =
            "#6d6d6d";

        ctx.lineWidth =
            3;

        ctx.beginPath();

        ctx.moveTo(
            x,
            y
        );

        ctx.lineTo(
            x,
            y + 120
        );

        ctx.stroke();


        ctx.fillStyle =
            color;

        ctx.beginPath();

        ctx.moveTo(
            x,
            y
        );

        ctx.quadraticCurveTo(
            x + 45,
            y + wave,
            x + 95,
            y + 20
        );

        ctx.lineTo(
            x + 95,
            y + 75
        );

        ctx.quadraticCurveTo(
            x + 45,
            y + 55 + wave,
            x,
            y + 60
        );

        ctx.closePath();

        ctx.fill();

    },


    /* ======================================================
       TORCHE
    ====================================================== */

    drawTorch(
        x,
        y
    ) {

        const ctx =
            Game.ctx;

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
                110
            );

        glow.addColorStop(
            0,
            "rgba(255,180,50,.30)"
        );

        glow.addColorStop(
            1,
            "rgba(255,80,10,0)"
        );


        ctx.fillStyle =
            glow;

        ctx.fillRect(
            x - 110,
            y - 130,
            220,
            220
        );


        ctx.fillStyle =
            "#ffad2f";

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


    /* ======================================================
       PORTAIL
    ====================================================== */

    drawPortal(
        x,
        y,
        scale
    ) {

        if (scale <= 0)
            return;

        const ctx =
            Game.ctx;


        ctx.save();

        ctx.translate(
            x,
            y
        );

        ctx.scale(
            scale,
            scale
        );


        /*
        ----------------------------------------------------
        HALO
        ----------------------------------------------------
        */

        const glow =
            ctx.createRadialGradient(
                0,
                0,
                20,
                0,
                0,
                260
            );

        glow.addColorStop(
            0,
            "rgba(30,150,255,.35)"
        );

        glow.addColorStop(
            .5,
            "rgba(40,80,255,.15)"
        );

        glow.addColorStop(
            1,
            "rgba(0,0,0,0)"
        );


        ctx.fillStyle =
            glow;

        ctx.fillRect(
            -270,
            -270,
            540,
            540
        );


        /*
        ----------------------------------------------------
        PORTAIL
        ----------------------------------------------------
        */

        const rotation =
            this.visualTime * .8;


        ctx.strokeStyle =
            "#278cff";

        ctx.lineWidth =
            18;

        ctx.shadowBlur =
            25;

        ctx.shadowColor =
            "#147dff";


        ctx.beginPath();

        ctx.ellipse(
            0,
            0,
            125,
            185,
            0,
            rotation,
            rotation +
            Math.PI * 2
        );

        ctx.stroke();


        /*
        ----------------------------------------------------
        SECOND ANNEAU
        ----------------------------------------------------
        */

        ctx.strokeStyle =
            "#8bdcff";

        ctx.lineWidth =
            5;

        ctx.beginPath();

        ctx.ellipse(
            0,
            0,
            100,
            160,
            0,
            -rotation,
            -rotation +
            Math.PI * 2
        );

        ctx.stroke();


        ctx.shadowBlur =
            0;


        /*
        ----------------------------------------------------
        INTÉRIEUR
        ----------------------------------------------------
        */

        const inside =
            ctx.createRadialGradient(
                0,
                0,
                20,
                0,
                0,
                170
            );

        inside.addColorStop(
            0,
            "rgba(20,100,200,.35)"
        );

        inside.addColorStop(
            1,
            "rgba(0,0,30,.85)"
        );


        ctx.fillStyle =
            inside;

        ctx.beginPath();

        ctx.ellipse(
            0,
            0,
            98,
            158,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.restore();

    },


    /* ======================================================
       PARTICULES PORTAIL
    ====================================================== */

    drawPortalParticles(
        x,
        y,
        count
    ) {

        const ctx =
            Game.ctx;


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const angle =
                i * 2.399 +
                this.visualTime *
                (.5 + (i % 3) * .2);

            const radius =
                70 +
                (i * 17) % 130;


            const px =
                x +
                Math.cos(angle) *
                radius;


            const py =
                y +
                Math.sin(angle) *
                radius;


            const size =
                1 +
                (i % 3);


            ctx.fillStyle =
                i % 2 === 0
                    ? "#4aa8ff"
                    : "#8cddff";


            ctx.globalAlpha =
                .25 +
                .65 *
                Math.abs(
                    Math.sin(
                        this.visualTime * 2 +
                        i
                    )
                );


            ctx.fillRect(
                px,
                py,
                size,
                size
            );

        }


        ctx.globalAlpha =
            1;

    },


    /* ======================================================
       BRAISES
    ====================================================== */

    drawEmbers(
        count
    ) {

        const ctx =
            Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const x =
                (i * 91 +
                this.visualTime *
                (20 + i % 5 * 10)) %
                w;

            const y =
                h -
                (
                    (i * 47 +
                    this.visualTime *
                    (15 + i % 4 * 5)) %
                    (h * .65)
                );


            ctx.fillStyle =
                i % 3 === 0
                    ? "#ff8c32"
                    : "#d94321";


            ctx.globalAlpha =
                .25 +
                Math.abs(
                    Math.sin(
                        this.visualTime * 3 +
                        i
                    )
                ) * .75;


            ctx.fillRect(
                x,
                y,
                2 + i % 3,
                2 + i % 3
            );

        }


        ctx.globalAlpha =
            1;

    },


    /* ======================================================
       PLUIE
    ====================================================== */

    drawRain(
        count
    ) {

        const ctx =
            Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        ctx.strokeStyle =
            "rgba(150,190,220,.28)";

        ctx.lineWidth =
            1;


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const x =
                (
                    i * 97 +
                    this.visualTime *
                    90
                ) % w;

            const y =
                (
                    i * 53 +
                    this.visualTime *
                    230
                ) % h;


            ctx.beginPath();

            ctx.moveTo(
                x,
                y
            );

            ctx.lineTo(
                x - 5,
                y + 14
            );

            ctx.stroke();

        }

    },


    /* ======================================================
       NARRATION
    ====================================================== */

    drawNarration(
        scene
    ) {

        const ctx =
            Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        const boxWidth =
            Math.min(
                960,
                w * .82
            );

        const boxHeight =
            185;


        const x =
            (w - boxWidth) / 2;

        const y =
            h - 225;


        /*
        ----------------------------------------------------
        OMBRE
        ----------------------------------------------------
        */

        ctx.fillStyle =
            "rgba(0,0,0,.65)";

        ctx.fillRect(
            x + 8,
            y + 8,
            boxWidth,
            boxHeight
        );


        /*
        ----------------------------------------------------
        BOÎTE
        ----------------------------------------------------
        */

        ctx.fillStyle =
            "rgba(7,10,16,.95)";

        ctx.fillRect(
            x,
            y,
            boxWidth,
            boxHeight
        );


        /*
        ----------------------------------------------------
        BORDURE
        ----------------------------------------------------
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
        ----------------------------------------------------
        DÉCORATION
        ----------------------------------------------------
        */

        ctx.fillStyle =
            "#d9b441";

        ctx.fillRect(
            x + 25,
            y + 22,
            65,
            3
        );


        /*
        ----------------------------------------------------
        NARRATEUR
        ----------------------------------------------------
        */

        ctx.textAlign =
            "left";

        ctx.font =
            "bold 16px Georgia";

        ctx.fillStyle =
            "#d9b441";

        ctx.fillText(
            "NARRATEUR",
            x + 25,
            y + 48
        );


        /*
        ----------------------------------------------------
        TEXTE
        ----------------------------------------------------
        */

        const visibleText =
            scene.text.substring(
                0,
                this.textIndex
            );


        ctx.font =
            "21px Georgia";

        ctx.fillStyle =
            "#f1eee5";


        this.drawWrappedText(
            visibleText,
            x + 25,
            y + 85,
            boxWidth - 50,
            30
        );

    },


    /* ======================================================
       TEXTE RETOUR À LA LIGNE
    ====================================================== */

    drawWrappedText(
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

        let line =
            "";


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
                ctx.measureText(
                    test
                ).width;


            if (
                width > maxWidth &&
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


        if (line) {

            ctx.fillText(
                line,
                x,
                y
            );

        }

    },


    /* ======================================================
       VIGNETTE
    ====================================================== */

    drawVignette() {

        const ctx =
            Game.ctx;

        const w =
            Game.canvas.width;

        const h =
            Game.canvas.height;


        const gradient =
            ctx.createRadialGradient(
                w / 2,
                h / 2,
                h * .18,
                w / 2,
                h / 2,
                h * .78
            );


        gradient.addColorStop(
            0,
            "rgba(0,0,0,0)"
        );

        gradient.addColorStop(
            .65,
            "rgba(0,0,0,.18)"
        );

        gradient.addColorStop(
            1,
            "rgba(0,0,0,.85)"
        );


        ctx.fillStyle =
            gradient;

        ctx.fillRect(
            0,
            0,
            w,
            h
        );

    }

};


/*
============================================================
CONTROLES
============================================================
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
