/*
=========================================================
PONAN'S LEGACY
PROLOGUE CINÉMATIQUE
=========================================================

10 scènes
- texte progressif
- narration
- transitions
- zoom
- Ponanini III / IV en vrais canards
- portail animé
- bannissement dans le Nether
- HUD masqué pendant la cinématique
=========================================================
*/

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
            duration: 15,
            speed: 45
        },

        {
            title: "LE ROYAUME DE PONAN",
            text:
                "Au-delà des montagnes se dressait Ponan, " +
                "un royaume oublié du monde, protégé par d'immenses murailles.",
            duration: 17,
            speed: 45
        },

        {
            title: "PONANINI III",
            text:
                "À cette époque, la couronne appartenait à Ponanini III. " +
                "Un roi juste, respecté et aimé de son peuple.",
            duration: 18,
            speed: 43
        },

        {
            title: "DERRIÈRE LE TRÔNE",
            text:
                "Mais derrière chaque couronne se cache une ombre. " +
                "Quelqu'un observait le royaume depuis longtemps.",
            duration: 16,
            speed: 43
        },

        {
            title: "PONANINI IV",
            text:
                "Son propre frère, Ponanini IV, désirait la couronne. " +
                "Et pour l'obtenir, il était prêt à sacrifier son propre sang.",
            duration: 18,
            speed: 42
        },

        {
            title: "LA TRAHISON",
            text:
                "De faux témoignages furent fabriqués. Des gardes furent achetés. " +
                "La vérité disparut sous les mensonges de celui qui allait devenir roi.",
            duration: 19,
            speed: 40
        },

        {
            title: "LE BANNISSEMENT",
            text:
                "Ponanini III fut déclaré coupable de crimes qu'il n'avait jamais commis. " +
                "Son frère le condamna à un destin pire que la mort.",
            duration: 18,
            speed: 40
        },

        {
            title: "LE NETHER",
            text:
                "Il fut banni dans le Nether, un monde où le ciel brûle, " +
                "où la terre se déchire et où la lumière semble avoir été condamnée.",
            duration: 19,
            speed: 38
        },

        {
            title: "LES TROIS FRAGMENTS",
            text:
                "Des années passèrent. Puis Ponanini III découvrit une ancienne légende. " +
                "Trois fragments pouvaient ouvrir une porte entre le Nether et Ponan.",
            duration: 19,
            speed: 38
        },

        {
            title: "ET C'EST LÀ QUE TU INTERVIENS",
            text:
                "Il ne pouvait pas quitter le Nether seul. Alors il attendit. " +
                "Jusqu'au jour où quelqu'un apparut devant son portail. Toi.",
            duration: 20,
            speed: 38
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

        const dialogue =
            document.getElementById("dialogue");

        if (dialogue)
            dialogue.classList.add("hidden");

        const inventory =
            document.getElementById("inventory");

        if (inventory)
            inventory.classList.add("hidden");

    },

    showHUD() {

        const hud =
            document.getElementById("hud");

        if (hud)
            hud.style.display = "flex";

    },

    update(dt) {

        if (!this.active)
            return;

        const scene =
            this.scenes[this.scene];

        if (!scene)
            return;

        this.timer += dt;
        this.visualTime += dt;

        if (this.fade > 0) {

            this.fade -= dt * 1.5;

            if (this.fade < 0)
                this.fade = 0;

        }

        if (!this.finishedText) {

            this.textIndex =
                Math.floor(
                    this.timer * 1000 /
                    scene.speed
                );

            if (
                this.textIndex >=
                scene.text.length
            ) {

                this.textIndex =
                    scene.text.length;

                this.finishedText = true;

            }

        }

        /*
        La scène ne passe jamais automatiquement
        tant que le texte n'est pas terminé.
        */

    },

    skipText() {

        if (!this.active)
            return;

        const scene =
            this.scenes[this.scene];

        if (!scene)
            return;

        if (!this.finishedText) {

            this.textIndex =
                scene.text.length;

            this.finishedText = true;

            return;

        }

        this.nextScene();

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

        this.visualTime = 0;

        this.textIndex = 0;

        this.finishedText = false;

        this.fade = 1;

    },

    finish() {

        this.active = false;

        this.showHUD();

        if (
            typeof finishPrologue ===
            "function"
        ) {

            finishPrologue();

        } else if (window.Game) {

            Game.running = true;

        }

    },

    draw() {

        const ctx = Game.ctx;

        const w = Game.canvas.width;

        const h = Game.canvas.height;

        const scene =
            this.scenes[this.scene];

        if (!scene)
            return;

        ctx.clearRect(
            0,
            0,
            w,
            h
        );

        /*
        =================================================
        SCÈNES
        =================================================
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

        this.drawVignette();

        this.drawTitle(
            scene.title
        );

        this.drawDialogue(
            scene
        );

        this.drawFade();

    },

    /*
    =================================================
    SCÈNE 1
    LE ROYAUME
    =================================================
    */

    drawScene1() {

        const ctx = Game.ctx;

        const w = Game.canvas.width;

        const h = Game.canvas.height;

        /*
        Ciel
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
            "#07101f"
        );

        sky.addColorStop(
            .55,
            "#18365a"
        );

        sky.addColorStop(
            1,
            "#36546b"
        );

        ctx.fillStyle = sky;

        ctx.fillRect(
            0,
            0,
            w,
            h
        );

        /*
        Lune
        */

        ctx.fillStyle =
            "#e6d58c";

        ctx.beginPath();

        ctx.arc(
            w * .77,
            h * .20,
            55,
            0,
            Math.PI * 2
        );

        ctx.fill();

        /*
        Montagnes arrière
        */

        this.drawMountainRange(
            0.25,
            "#111c2d",
            0
        );

        /*
        Montagnes proches
        */

        this.drawMountainRange(
            0.38,
            "#0b1422",
            140
        );

        /*
        Vallée
        */

        ctx.fillStyle =
            "#101b24";

        ctx.beginPath();

        ctx.moveTo(
            0,
            h * .73
        );

        ctx.lineTo(
            w * .15,
            h * .61
        );

        ctx.lineTo(
            w * .31,
            h * .69
        );

        ctx.lineTo(
            w * .50,
            h * .57
        );

        ctx.lineTo(
            w * .68,
            h * .68
        );

        ctx.lineTo(
            w * .85,
            h * .59
        );

        ctx.lineTo(
            w,
            h * .72
        );

        ctx.lineTo(
            w,
            h
        );

        ctx.lineTo(
            0,
            h
        );

        ctx.closePath();

        ctx.fill();

        /*
        Rivière
        */

        ctx.fillStyle =
            "#204b63";

        ctx.beginPath();

        ctx.moveTo(
            w * .47,
            h * .60
        );

        ctx.lineTo(
            w * .54,
            h * .60
        );

        ctx.lineTo(
            w * .70,
            h
        );

        ctx.lineTo(
            w * .35,
            h
        );

        ctx.closePath();

        ctx.fill();

        /*
        Royaume placé DANS la vallée
        */

        this.drawKingdomCastle(
            w / 2,
            h * .64,
            .75
        );

        /*
        Village
        */

        this.drawVillage(
            w / 2,
            h * .78
        );

    },

    /*
    =================================================
    SCÈNE 2
    ENTRÉE DANS LE ROYAUME
    =================================================
    */

    drawScene2() {

        const ctx = Game.ctx;

        const w = Game.canvas.width;

        const h = Game.canvas.height;

        ctx.fillStyle =
            "#07101b";

        ctx.fillRect(
            0,
            0,
            w,
            h
        );

        /*
        Progression du zoom
        */

        const p =
            Math.min(
                1,
                this.visualTime / 13
            );

        const scale =
            .65 +
            p * 1.25;

        ctx.save();

        ctx.translate(
            w / 2,
            h * .58
        );

        ctx.scale(
            scale,
            scale
        );

        ctx.translate(
            -w / 2,
            -h * .58
        );

        /*
        Montagnes cohérentes avec
        la scène précédente
        */

        this.drawMountainRange(
            .38,
            "#101b2b",
            0
        );

        /*
        Route
        */

        ctx.fillStyle =
            "#302d2a";

        ctx.beginPath();

        ctx.moveTo(
            w * .38,
            h
        );

        ctx.lineTo(
            w * .62,
            h
        );

        ctx.lineTo(
            w * .54,
            h * .57
        );

        ctx.lineTo(
            w * .46,
            h * .57
        );

        ctx.closePath();

        ctx.fill();

        /*
        Murailles
        */

        this.drawKingdomCastle(
            w / 2,
            h * .64,
            1
        );

        ctx.restore();

        /*
        Mouvement de caméra
        */

        ctx.fillStyle =
            "rgba(255,255,255,.15)";

        for (let i = 0; i < 18; i++) {

            const x =
                (i * 121 +
                this.visualTime * 80) %
                w;

            const y =
                h * .55 +
                Math.sin(
                    i +
                    this.visualTime
                ) * 35;

            ctx.fillRect(
                x,
                y,
                2,
                2
            );

        }

    },

    /*
    =================================================
    SCÈNE 3
    PONANINI III
    =================================================
    */

    drawScene3() {

        const ctx = Game.ctx;

        const w = Game.canvas.width;

        const h = Game.canvas.height;

        ctx.fillStyle =
            "#111521";

        ctx.fillRect(
            0,
            0,
            w,
            h
        );

        /*
        Salle
        */

        ctx.fillStyle =
            "#1e2634";

        ctx.fillRect(
            0,
            0,
            w,
            h * .70
        );

        /*
        Sol
        */

        ctx.fillStyle =
            "#0c1018";

        ctx.fillRect(
            0,
            h * .70,
            w,
            h * .30
        );

        /*
        Tapis
        */

        ctx.fillStyle =
            "#681f2d";

        ctx.beginPath();

        ctx.moveTo(
            w * .45,
            h * .52
        );

        ctx.lineTo(
            w * .55,
            h * .52
        );

        ctx.lineTo(
            w * .72,
            h
        );

        ctx.lineTo(
            w * .28,
            h
        );

        ctx.closePath();

        ctx.fill();

        /*
        TABLE / TRÔNE ALIGNÉS
        */

        const center =
            w / 2;

        const throneY =
            h * .37;

        /*
        Trône
        */

        this.drawThrone(
            center,
            throneY,
            1
        );

        /*
        Table devant le trône
        */

        const tableY =
            h * .64;

        ctx.fillStyle =
            "#5b4024";

        ctx.fillRect(
            center - 170,
            tableY,
            340,
            22
        );

        ctx.fillRect(
            center - 150,
            tableY + 20,
            22,
            100
        );

        ctx.fillRect(
            center + 128,
            tableY + 20,
            22,
            100
        );

        /*
        Assiette / coupe
        */

        ctx.fillStyle =
            "#d3ae43";

        ctx.fillRect(
            center - 55,
            tableY - 12,
            35,
            10
        );

        ctx.fillRect(
            center + 20,
            tableY - 12,
            35,
            10
        );

        /*
        PONANINI III
        */

        /*
        Il est maintenant assis
        correctement entre le trône
        et la table.
        */

        this.drawDuckKing(
            center,
            throneY + 35,
            1
        );

    },

    /*
    =================================================
    SCÈNE 4
    L'OMBRE
    =================================================
    */

    drawScene4() {

        this.drawScene3();

        const ctx = Game.ctx;

        const w = Game.canvas.width;

        const h = Game.canvas.height;

        /*
        Assombrissement
        */

        ctx.fillStyle =
            "rgba(0,0,12,.55)";

        ctx.fillRect(
            0,
            0,
            w,
            h
        );

        /*
        Ponanini IV derrière
        */

        this.drawDuckVillain(
            w * .73,
            h * .43,
            1.05
        );

        /*
        Yeux
        */

        ctx.fillStyle =
            "#e13b42";

        ctx.fillRect(
            w * .70,
            h * .40,
            10,
            5
        );

        ctx.fillRect(
            w * .75,
            h * .40,
            10,
            5
        );

    },

    /*
    =================================================
    SCÈNE 5
    PONANINI IV
    =================================================
    */

    drawScene5() {

        const ctx = Game.ctx;

        const w = Game.canvas.width;

        const h = Game.canvas.height;

        ctx.fillStyle =
            "#08060d";

        ctx.fillRect(
            0,
            0,
            w,
            h
        );

        /*
        Aura violette
        */

        const glow =
            ctx.createRadialGradient(
                w / 2,
                h * .42,
                30,
                w / 2,
                h * .42,
                420
            );

        glow.addColorStop(
            0,
            "rgba(87,37,150,.45)"
        );

        glow.addColorStop(
            1,
            "rgba(0,0,0,0)"
        );

        ctx.fillStyle =
            glow;

        ctx.fillRect(
            0,
            0,
            w,
            h
        );

        /*
        Gros plan du canard
        */

        const p =
            Math.min(
                1,
                this.visualTime / 7
            );

        const scale =
            .9 + p * .5;

        this.drawDuckVillain(
            w / 2,
            h * .42,
            scale
        );

    },

    /*
    =================================================
    SCÈNE 6
    TRAHISON
    =================================================
    */

    drawScene6() {

        const ctx = Game.ctx;

        const w = Game.canvas.width;

        const h = Game.canvas.height;

        ctx.fillStyle =
            "#100b14";

        ctx.fillRect(
            0,
            0,
            w,
            h
        );

        /*
        Ponanini III
        */

        this.drawDuckKing(
            w * .62,
            h * .48,
            .9
        );

        /*
        Ponanini IV
        */

        this.drawDuckVillain(
            w * .28,
            h * .43,
            .95
        );

        /*
        Gardes
        */

        this.drawGuard(
            w * .45,
            h * .45
        );

        this.drawGuard(
            w * .53,
            h * .45
        );

        /*
        Épée
        */

        ctx.strokeStyle =
            "#b9c2ce";

        ctx.lineWidth = 5;

        ctx.beginPath();

        ctx.moveTo(
            w * .38,
            h * .51
        );

        ctx.lineTo(
            w * .50,
            h * .30
        );

        ctx.stroke();

    },

    /*
    =================================================
    SCÈNE 7
    BANNISSEMENT
    =================================================
    */

    drawScene7() {

        const ctx = Game.ctx;

        const w = Game.canvas.width;

        const h = Game.canvas.height;

        ctx.fillStyle =
            "#070811";

        ctx.fillRect(
            0,
            0,
            w,
            h
        );

        /*
        Ponanini IV
        */

        this.drawDuckVillain(
            w * .30,
            h * .43,
            .9
        );

        /*
        PORTAIL BLEU
        */

        const portalX =
            w * .66;

        const portalY =
            h * .47;

        const pulse =
            1 +
            Math.sin(
                this.visualTime * 5
            ) * .04;

        ctx.save();

        ctx.translate(
            portalX,
            portalY
        );

        ctx.scale(
            pulse,
            pulse
        );

        /*
        Halo
        */

        const glow =
            ctx.createRadialGradient(
                0,
                0,
                20,
                0,
                0,
                240
            );

        glow.addColorStop(
            0,
            "rgba(50,150,255,.45)"
        );

        glow.addColorStop(
            1,
            "rgba(0,0,0,0)"
        );

        ctx.fillStyle =
            glow;

        ctx.fillRect(
            -250,
            -250,
            500,
            500
        );

        /*
        Anneau extérieur
        */

        ctx.strokeStyle =
            "#287eff";

        ctx.lineWidth = 18;

        ctx.beginPath();

        ctx.ellipse(
            0,
            0,
            130,
            190,
            0,
            0,
            Math.PI * 2
        );

        ctx.stroke();

        /*
        Anneau intérieur
        */

        ctx.strokeStyle =
            "#83d7ff";

        ctx.lineWidth = 5;

        ctx.beginPath();

        ctx.ellipse(
            0,
            0,
            105,
            165,
            0,
            0,
            Math.PI * 2
        );

        ctx.stroke();

        ctx.restore();

        /*
        PONANINI III
        */

        /*
        Il est poussé vers le portail
        progressivement.
        */

        const progress =
            Math.min(
                1,
                this.visualTime / 9
            );

        const duckX =
            w * .52 +
            progress * w * .10;

        this.drawDuckKing(
            duckX,
            h * .45,
            .9
        );

        /*
        Mouvement des ailes
        */

        ctx.save();

        ctx.translate(
            duckX,
            h * .45
        );

        ctx.rotate(
            Math.sin(
                this.visualTime * 8
            ) * .08
        );

        ctx.fillStyle =
            "#d4d5ca";

        ctx.beginPath();

        ctx.ellipse(
            -55,
            5,
            50,
            20,
            -.35,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.beginPath();

        ctx.ellipse(
            55,
            5,
            50,
            20,
            .35,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.restore();

        /*
        PORTAIL QUI SE REFERME
        après le passage
        */

        if (progress > .72) {

            const close =
                (progress - .72) /
                .28;

            ctx.save();

            ctx.translate(
                portalX,
                portalY
            );

            ctx.scale(
                1 - close,
                1
            );

            ctx.strokeStyle =
                "#287eff";

            ctx.lineWidth = 18;

            ctx.beginPath();

            ctx.ellipse(
                0,
                0,
                130,
                190,
                0,
                0,
                Math.PI * 2
            );

            ctx.stroke();

            ctx.restore();

        }

    },

    /*
    =================================================
    SCÈNE 8
    NETHER
    =================================================
    */

    drawScene8() {

        const ctx = Game.ctx;

        const w = Game.canvas.width;

        const h = Game.canvas.height;

        /*
        Ciel
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
            "#09000d"
        );

        sky.addColorStop(
            .45,
            "#330510"
        );

        sky.addColorStop(
            1,
            "#120307"
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
        Lave
        */

        ctx.fillStyle =
            "#761b0c";

        ctx.fillRect(
            0,
            h * .72,
            w,
            h * .28
        );

        ctx.fillStyle =
            "#ff5a20";

        for (let i = 0; i < 15; i++) {

            const x =
                i * 100 +
                Math.sin(
                    this.visualTime * 2 + i
                ) * 15;

            ctx.fillRect(
                x,
                h * .75,
                55,
                5
            );

        }

        /*
        Montagnes Nether
        */

        ctx.fillStyle =
            "#16040d";

        for (let i = -1; i < 9; i++) {

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

        /*
        Éclairs rouges
        */

        ctx.strokeStyle =
            "#d92d32";

        ctx.lineWidth = 3;

        for (let i = 0; i < 6; i++) {

            const x =
                (i * 170) % w;

            ctx.beginPath();

            ctx.moveTo(
                x,
                h * .15
            );

            ctx.lineTo(
                x - 20,
                h * .30
            );

            ctx.lineTo(
                x + 15,
                h * .43
            );

            ctx.stroke();

        }

        /*
        Ponanini III seul
        */

        this.drawDuckKing(
            w / 2,
            h * .58,
            .9
        );

    },

    /*
    =================================================
    SCÈNE 9
    FRAGMENTS
    =================================================
    */

    drawScene9() {

        this.drawScene8();

        const ctx = Game.ctx;

        const w = Game.canvas.width;

        const h = Game.canvas.height;

        const fragments = [

            [
                w / 2,
                h * .30,
                "#f0c33e"
            ],

            [
                w * .37,
                h * .60,
                "#3c8cff"
            ],

            [
                w * .63,
                h * .60,
                "#3c8cff"
            ]

        ];

        fragments.forEach(
            (fragment, i) => {

                const x =
                    fragment[0];

                const y =
                    fragment[1] +
                    Math.sin(
                        this.visualTime * 2 +
                        i
                    ) * 10;

                ctx.save();

                ctx.translate(
                    x,
                    y
                );

                ctx.rotate(
                    this.visualTime *
                    (.3 + i * .1)
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
                        70
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
                    -80,
                    -80,
                    160,
                    160
                );

                /*
                Cristal
                */

                ctx.fillStyle =
                    fragment[2];

                ctx.beginPath();

                ctx.moveTo(
                    0,
                    -40
                );

                ctx.lineTo(
                    27,
                    0
                );

                ctx.lineTo(
                    0,
                    40
                );

                ctx.lineTo(
                    -27,
                    0
                );

                ctx.closePath();

                ctx.fill();

                ctx.strokeStyle =
                    "#ffffff";

                ctx.lineWidth = 2;

                ctx.stroke();

                ctx.restore();

            }
        );

        /*
        Ponanini III derrière
        */

        this.drawDuckKing(
            w / 2,
            h * .70,
            .7
        );

    },

    /*
    =================================================
    SCÈNE 10
    RENCONTRE
    =================================================
    */

    drawScene10() {

        this.drawScene8();

        const ctx = Game.ctx;

        const w = Game.canvas.width;

        const h = Game.canvas.height;

        /*
        Portail
        */

        const px =
            w * .75;

        const py =
            h * .42;

        ctx.strokeStyle =
            "#3e94ff";

        ctx.lineWidth = 10;

        ctx.beginPath();

        ctx.ellipse(
            px,
            py,
            85,
            130,
            0,
            0,
            Math.PI * 2
        );

        ctx.stroke();

        /*
        Personnage joueur
        */

        ctx.fillStyle =
            "#08090d";

        ctx.fillRect(
            w * .72,
            h * .55,
            45,
            100
        );

        ctx.beginPath();

        ctx.arc(
            w * .742,
            h * .52,
            27,
            0,
            Math.PI * 2
        );

        ctx.fill();

        /*
        Ponanini III
        */

        const p =
            Math.min(
                1,
                this.visualTime / 10
            );

        const scale =
            .75 +
            p * .45;

        this.drawDuckKing(
            w * .43,
            h * .48,
            scale
        );

        /*
        Regard vers le joueur
        */

        ctx.strokeStyle =
            "#e4c54e";

        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.moveTo(
            w * .49,
            h * .43
        );

        ctx.lineTo(
            w * .68,
            h * .51
        );

        ctx.stroke();

    },

    /*
    =================================================
    PERSONNAGE : PONANINI III
    =================================================
    */

    drawDuckKing(
        x,
        y,
        scale
    ) {

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

        /*
        Corps
        */

        ctx.fillStyle =
            "#d7d8cd";

        ctx.beginPath();

        ctx.ellipse(
            0,
            62,
            58,
            70,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();

        /*
        Cape
        */

        ctx.fillStyle =
            "#4c1f32";

        ctx.beginPath();

        ctx.moveTo(
            -55,
            30
        );

        ctx.lineTo(
            55,
            30
        );

        ctx.lineTo(
            82,
            145
        );

        ctx.lineTo(
            -82,
            145
        );

        ctx.closePath();

        ctx.fill();

        /*
        Tête
        */

        ctx.fillStyle =
            "#e1e1d6";

        ctx.beginPath();

        ctx.ellipse(
            0,
            -10,
            52,
            46,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();

        /*
        Plumes
        */

        ctx.fillStyle =
            "#c6c8bf";

        for (
            let i = -2;
            i <= 2;
            i++
        ) {

            ctx.beginPath();

            ctx.ellipse(
                i * 18,
                -48,
                18,
                30,
                i * .15,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }

        /*
        Yeux
        */

        ctx.fillStyle =
            "#15151a";

        ctx.beginPath();

        ctx.arc(
            -20,
            -14,
            7,
            0,
            Math.PI * 2
        );

        ctx.arc(
            20,
            -14,
            7,
            0,
            Math.PI * 2
        );

        ctx.fill();

        /*
        Bec
        */

        ctx.fillStyle =
            "#d98a2c";

        ctx.beginPath();

        ctx.moveTo(
            -28,
            0
        );

        ctx.lineTo(
            0,
            24
        );

        ctx.lineTo(
            28,
            0
        );

        ctx.closePath();

        ctx.fill();

        /*
        Couronne
        */

        ctx.fillStyle =
            "#d8af38";

        ctx.beginPath();

        ctx.moveTo(
            -45,
            -48
        );

        ctx.lineTo(
            -32,
            -88
        );

        ctx.lineTo(
            -10,
            -57
        );

        ctx.lineTo(
            4,
            -91
        );

        ctx.lineTo(
            20,
            -57
        );

        ctx.lineTo(
            40,
            -83
        );

        ctx.lineTo(
            43,
            -42
        );

        ctx.closePath();

        ctx.fill();

        /*
        Gemme
        */

        ctx.fillStyle =
            "#ba3040";

        ctx.beginPath();

        ctx.arc(
            0,
            -62,
            7,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.restore();

    },

    /*
    =================================================
    PERSONNAGE : PONANINI IV
    =================================================
    */

    drawDuckVillain(
        x,
        y,
        scale
    ) {

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

        /*
        Corps
        */

        ctx.fillStyle =
            "#15131b";

        ctx.beginPath();

        ctx.ellipse(
            0,
            60,
            60,
            80,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();

        /*
        Cape
        */

        ctx.fillStyle =
            "#171022";

        ctx.beginPath();

        ctx.moveTo(
            -60,
            30
        );

        ctx.lineTo(
            60,
            30
        );

        ctx.lineTo(
            90,
            155
        );

        ctx.lineTo(
            -90,
            155
        );

        ctx.closePath();

        ctx.fill();

        /*
        Tête
        */

        ctx.fillStyle =
            "#24252b";

        ctx.beginPath();

        ctx.ellipse(
            0,
            -10,
            52,
            46,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();

        /*
        Plumes noires
        */

        ctx.fillStyle =
            "#0a0910";

        for (
            let i = -2;
            i <= 2;
            i++
        ) {

            ctx.beginPath();

            ctx.ellipse(
                i * 18,
                -48,
                20,
                32,
                i * .12,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }

        /*
        Yeux rouges
        */

        ctx.fillStyle =
            "#e33443";

        ctx.fillRect(
            -28,
            -17,
            15,
            7
        );

        ctx.fillRect(
            13,
            -17,
            15,
            7
        );

        /*
        Bec
        */

        ctx.fillStyle =
            "#a96123";

        ctx.beginPath();

        ctx.moveTo(
            -28,
            0
        );

        ctx.lineTo(
            0,
            24
        );

        ctx.lineTo(
            28,
            0
        );

        ctx.closePath();

        ctx.fill();

        /*
        Couronne sombre
        */

        ctx.fillStyle =
            "#a98228";

        ctx.beginPath();

        ctx.moveTo(
            -45,
            -47
        );

        ctx.lineTo(
            -30,
            -86
        );

        ctx.lineTo(
            -10,
            -57
        );

        ctx.lineTo(
            4,
            -91
        );

        ctx.lineTo(
            20,
            -57
        );

        ctx.lineTo(
            40,
            -82
        );

        ctx.lineTo(
            43,
            -42
        );

        ctx.closePath();

        ctx.fill();

        ctx.restore();

    },

    /*
    =================================================
    TRÔNE
    =================================================
    */

    drawThrone(
        x,
        y,
        scale
    ) {

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

        /*
        Dossier
        */

        ctx.fillStyle =
            "#694c25";

        ctx.fillRect(
            -105,
            -125,
            210,
            180
        );

        /*
        Rembourrage
        */

        ctx.fillStyle =
            "#4a1d2d";

        ctx.fillRect(
            -80,
            -105,
            160,
            135
        );

        /*
        Accoudoirs
        */

        ctx.fillStyle =
            "#88672b";

        ctx.fillRect(
            -120,
            15,
            35,
            55
        );

        ctx.fillRect(
            85,
            15,
            35,
            55
        );

        /*
        Assise
        */

        ctx.fillStyle =
            "#694c25";

        ctx.fillRect(
            -100,
            35,
            200,
            25
        );

        /*
        Estrade
        */

        ctx.fillStyle =
            "#39291a";

        ctx.fillRect(
            -135,
            60,
            270,
            25
        );

        ctx.restore();

    },

    /*
    =================================================
    CHÂTEAU
    =================================================
    */

    drawKingdomCastle(
        x,
        y,
        scale
    ) {

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

        /*
        Corps central
        */

        ctx.fillStyle =
            "#303b49";

        ctx.fillRect(
            -180,
            -160,
            360,
            220
        );

        /*
        Tours
        */

        ctx.fillRect(
            -250,
            -190,
            90,
            250
        );

        ctx.fillRect(
            160,
            -190,
            90,
            250
        );

        /*
        Toits
        */

        ctx.fillStyle =
            "#111722";

        this.drawRoof(
            -250,
            -190,
            90
        );

        this.drawRoof(
            160,
            -190,
            90
        );

        /*
        Tour centrale
        */

        ctx.fillStyle =
            "#3d4856";

        ctx.fillRect(
            -70,
            -220,
            140,
            280
        );

        this.drawRoof(
            -70,
            -220,
            140
        );

        /*
        Porte
        */

        ctx.fillStyle =
            "#0b0e14";

        ctx.fillRect(
            -38,
            -70,
            76,
            130
        );

        /*
        Fenêtres
        */

        ctx.fillStyle =
            "#e0bd48";

        for (
            let i = -2;
            i <= 2;
            i++
        ) {

            ctx.fillRect(
                i * 60 - 7,
                -130,
                14,
                25
            );

        }

        ctx.restore();

    },

    /*
    =================================================
    MONTAGNES
    =================================================
    */

    drawMountainRange(
        height,
        color,
        offset
    ) {

        const ctx = Game.ctx;

        const w = Game.canvas.width;

        const h = Game.canvas.height;

        ctx.fillStyle =
            color;

        ctx.beginPath();

        ctx.moveTo(
            0,
            h
        );

        const points = 9;

        for (
            let i = 0;
            i <= points;
            i++
        ) {

            const x =
                i *
                w /
                points;

            const variation =
                Math.sin(
                    i * 2.7 +
                    offset
                ) * 45;

            const peak =
                h *
                height +
                variation;

            ctx.lineTo(
                x,
                peak
            );

        }

        ctx.lineTo(
            w,
            h
        );

        ctx.closePath();

        ctx.fill();

    },

    /*
    =================================================
    VILLAGE
    =================================================
    */

    drawVillage(
        x,
        y
    ) {

        const ctx = Game.ctx;

        ctx.fillStyle =
            "#20252c";

        for (
            let i = -4;
            i <= 4;
            i++
        ) {

            const bx =
                x +
                i * 55;

            ctx.fillRect(
                bx,
                y,
                40,
                35
            );

            ctx.fillStyle =
                "#7d3e27";

            ctx.beginPath();

            ctx.moveTo(
                bx - 5,
                y
            );

            ctx.lineTo(
                bx + 20,
                y - 25
            );

            ctx.lineTo(
                bx + 45,
                y
            );

            ctx.closePath();

            ctx.fill();

            ctx.fillStyle =
                "#20252c";

        }

    },

    /*
    =================================================
    TOIT
    =================================================
    */

    drawRoof(
        x,
        y,
        width
    ) {

        const ctx = Game.ctx;

        ctx.beginPath();

        ctx.moveTo(
            x - 15,
            y
        );

        ctx.lineTo(
            x + width / 2,
            y - 70
        );

        ctx.lineTo(
            x + width + 15,
            y
        );

        ctx.closePath();

        ctx.fill();

    },

    /*
    =================================================
    GARDE
    =================================================
    */

    drawGuard(
        x,
        y
    ) {

        const ctx = Game.ctx;

        ctx.fillStyle =
            "#10141c";

        ctx.fillRect(
            x - 18,
            y,
            36,
            90
        );

        ctx.fillStyle =
            "#354052";

        ctx.beginPath();

        ctx.arc(
            x,
            y - 12,
            23,
            0,
            Math.PI * 2
        );

        ctx.fill();

    },

    /*
    =================================================
    TITRE
    =================================================
    */

    drawTitle(
        title
    ) {

        const ctx = Game.ctx;

        const w = Game.canvas.width;

        ctx.textAlign =
            "center";

        ctx.font =
            "bold 30px Georgia";

        ctx.fillStyle =
            "#e0bd48";

        ctx.fillText(
            title,
            w / 2,
            55
        );

    },

    /*
    =================================================
    DIALOGUE
    =================================================
    */

    drawDialogue(
        scene
    ) {

        const ctx = Game.ctx;

        const w = Game.canvas.width;

        const h = Game.canvas.height;

        const boxW =
            Math.min(
                900,
                w * .82
            );

        const boxH = 175;

        const x =
            (w - boxW) / 2;

        const y =
            h - 225;

        /*
        Fond
        */

        ctx.fillStyle =
            "rgba(3,5,10,.94)";

        ctx.fillRect(
            x,
            y,
            boxW,
            boxH
        );

        /*
        Bordure
        */

        ctx.strokeStyle =
            "#d5ae45";

        ctx.lineWidth = 3;

        ctx.strokeRect(
            x,
            y,
            boxW,
            boxH
        );

        /*
        Nom narrateur
        */

        ctx.textAlign =
            "left";

        ctx.font =
            "bold 18px Georgia";

        ctx.fillStyle =
            "#d5ae45";

        ctx.fillText(
            "NARRATEUR",
            x + 25,
            y + 30
        );

        /*
        Texte progressif
        */

        const text =
            scene.text.substring(
                0,
                this.textIndex
            );

        ctx.font =
            "21px Georgia";

        ctx.fillStyle =
            "#f3f0e6";

        this.wrapText(
            text,
            x + 25,
            y + 72,
            boxW - 50,
            30
        );

        /*
        Contrôle
        */

        ctx.textAlign =
            "center";

        ctx.font =
            "15px Arial";

        ctx.fillStyle =
            "rgba(255,255,255,.65)";

        ctx.fillText(
            this.finishedText
                ? "ESPACE : continuer"
                : "ESPACE : afficher le texte",
            w / 2,
            h - 25
        );

    },

    /*
    =================================================
    WRAP TEXT
    =================================================
    */

    wrapText(
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
                    words[i] + " ";

                y += lineHeight;

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

    },

    /*
    =================================================
    VIGNETTE
    =================================================
    */

    drawVignette() {

        const ctx = Game.ctx;

        const w = Game.canvas.width;

        const h = Game.canvas.height;

        const gradient =
            ctx.createRadialGradient(
                w / 2,
                h / 2,
                h * .15,
                w / 2,
                h / 2,
                h * .80
            );

        gradient.addColorStop(
            0,
            "rgba(0,0,0,0)"
        );

        gradient.addColorStop(
            1,
            "rgba(0,0,0,.82)"
        );

        ctx.fillStyle =
            gradient;

        ctx.fillRect(
            0,
            0,
            w,
            h
        );

    },

    /*
    =================================================
    FADE
    =================================================
    */

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

    }

};


/*
=========================================================
CONTROLES CINÉMATIQUE
=========================================================
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
