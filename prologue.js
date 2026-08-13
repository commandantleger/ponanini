const Prologue = {
    narratorEnabled: false,
    narratorSpeaking: false,
    narratorVoice: null,

    active: false,
    scene: 0,
    timer: 0,
    textIndex: 0,
    finishedText: false,

    fade: 1,
    fadeDirection: -1,

    visualTime: 0,

    scene11Image: null,
    scene11ImageLoaded: false,

    loadingStartTime: 0,
    minLoadingTime: 3200,

    images: [],
    imagesLoaded: 0,
    loading: false,
    ready: false,


    scenes: [

    /* =====================================================
       SCÈNE 1
    ===================================================== */

    {
        title: "IL ÉTAIT UNE FOIS...",

        text:
            "Dans une vallée oubliée, entre les montagnes " +
            "et la brume, s'étendait un royaume nommé Ponan. " +
            "Un royaume ancien, paisible en apparence... " +
            "où les histoires de la couronne se transmettaient " +
            "depuis des générations.",

        duration: 11000
    },


    /* =====================================================
       SCÈNE 2
    ===================================================== */

    {
        title: "PONAN",

        text:
            "Au cœur de Ponan s'élevait le palais royal. " +
            "Sous ses tours vivaient des générations de canards, " +
            "protégées par les montagnes et les eaux sacrées. " +
            "Mais derrière les murs du palais, quelque chose " +
            "avait commencé à changer.",

        duration: 11000
    },


    /* =====================================================
       SCÈNE 3
    ===================================================== */

    {
        title: "LE ROI",

        text:
            "Ponanini III était le roi de Ponan. " +
            "Un souverain respecté, attaché à son peuple " +
            "et à la paix du royaume. " +
            "Il ignorait encore que la plus grande menace " +
            "ne viendrait pas de ses ennemis... " +
            "mais de sa propre famille.",

        duration: 12000
    },


    /* =====================================================
       SCÈNE 4
    ===================================================== */

    {
        title: "L'OMBRE",

        text:
            "Ponanini IV observait le trône depuis longtemps. " +
            "Il attendait son heure, silencieux, patient. " +
            "Chaque jour qui passait rapprochait un peu plus " +
            "le royaume d'un changement que nul ne pourrait arrêter.",

        duration: 10500
    },


    /* =====================================================
       SCÈNE 5
    ===================================================== */

    {
        title: "LE MENSONGE",

        text:
            "Puis les murmures commencèrent. " +
            "Des rumeurs circulèrent dans les rues. " +
            "Les doutes gagnèrent la cour. " +
            "Et peu à peu, la vérité devint impossible " +
            "à distinguer du mensonge.",

        duration: 10000
    },


    /* =====================================================
       SCÈNE 6
    ===================================================== */

    {
        title: "LA COURONNE",

        text:
            "Une nuit, tout bascula. " +
            "La couronne changea de tête. " +
            "En quelques instants, l'ordre ancien disparut... " +
            "et Ponanini IV s'empara du pouvoir.",

        duration: 9500
    },


    /* =====================================================
       SCÈNE 7
    ===================================================== */

    {
        title: "L'EXIL",

        text:
            "Pour Ponanini III, il ne restait plus de place " +
            "à Ponan. " +
            "Un ancien portail fut réveillé dans la cour du palais. " +
            "Il franchit une dernière fois les portes de son royaume... " +
            "sans savoir s'il reverrait un jour les terres " +
            "qu'il avait juré de protéger.",

        duration: 12000
    },


    /* =====================================================
       SCÈNE 8
    ===================================================== */

    {
        title: "LE NETHER",

        text:
            "De l'autre côté du portail, il n'y avait ni royaume... " +
            "ni lumière. " +
            "Seulement une terre inconnue, brûlée par les flammes " +
            "et enveloppée de ténèbres. " +
            "Ponanini III venait d'être condamné à l'exil.",

        duration: 11500
    },


    /* =====================================================
       SCÈNE 9
    ===================================================== */

    {
        title: "LES FRAGMENTS",

        text:
            "Pourtant, au cœur de ces terres oubliées, " +
            "il découvrit quelque chose. " +
            "Trois fragments anciens, porteurs d'une magie " +
            "qu'il ne comprenait pas encore. " +
            "Peut-être n'était-il pas arrivé ici par hasard.",

        duration: 11500
    },


    /* =====================================================
       SCÈNE 10
    ===================================================== */

    {
        title: "LE PORTAIL",

        text:
            "Les fragments réveillèrent une ancienne porte " +
            "entre les mondes. " +
            "Derrière elle se trouvait une présence inconnue. " +
            "Un être qui ne ressemblait à aucun habitant de Ponan. " +
            "Et pourtant... son arrivée semblait écrite " +
            "depuis longtemps.",

        duration: 12000
    },


    /* =====================================================
       SCÈNE 11
    ===================================================== */

    {
        title: "L'ÉTRANGER",

        text:
            "Un homme venu d'un autre monde franchit alors le portail. " +
            "Il ne connaissait ni Ponan, ni sa couronne, " +
            "ni les secrets de ses anciens royaumes. " +
            "Mais son arrivée allait changer le destin " +
            "de tous ceux qui vivaient derrière le portail.",

        duration: 13000
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
        this.narratorSpeaking = false;
        this.loadingStartTime = performance.now();
        this.ready = false;
        this.loading = false;
        this.images = [];
        this.imagesLoaded = 0;

        /*
         * SCENE 11
         */
        this.scene11Image =
            new Image();

        this.scene11Image.onload = () => {

            this.scene11ImageLoaded =
                true;

            console.log(
                "Scene 11 chargee."
            );
        };

        this.scene11Image.onerror = () => {

            this.scene11ImageLoaded =
                false;

            console.error(
                "Impossible de charger " +
                "assets/prologue/scene11.png"
            );
        };

        this.scene11Image.src =
            "assets/prologue/scene11.png";

        this.hideHUD();

        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
        }

        this.loadImages();
    },

    speakNarrator(text) {
        if (!this.narratorEnabled)
            return;

        if (!("speechSynthesis" in window))
            return;

        window.speechSynthesis.cancel();

        const voices = window.speechSynthesis.getVoices();

        const frenchVoices = voices.filter(voice =>
            voice.lang &&
            voice.lang.toLowerCase().startsWith("fr")
        );

        const preferredNames = [
            "Google français",
            "Google French",
            "Microsoft Paul",
            "Microsoft Henri",
            "Microsoft Claude",
            "Thomas",
            "Daniel",
            "French"
        ];

        let voice = null;

        for (let i = 0; i < preferredNames.length; i++) {
            voice = frenchVoices.find(v =>
                v.name
                    .toLowerCase()
                    .includes(
                        preferredNames[i].toLowerCase()
                    )
            );

            if (voice)
                break;
        }

        if (!voice && frenchVoices.length > 0) {
            voice = frenchVoices.find(v =>
                !/espeak|festival|robot/i.test(v.name)
            );
        }

        if (!voice && frenchVoices.length > 0)
            voice = frenchVoices[0];

        this.narratorVoice = voice || null;

        const utterance =
            new SpeechSynthesisUtterance(text);

        utterance.lang = "fr-FR";
        utterance.rate = 0.72;
        utterance.pitch = 0.78;
        utterance.volume = 1;

        if (this.narratorVoice)
            utterance.voice = this.narratorVoice;

        this.narratorSpeaking = true;

        utterance.onstart = () => {
            this.narratorSpeaking = true;
        };

        utterance.onend = () => {
            this.narratorSpeaking = false;
        };

        utterance.onerror = () => {
            this.narratorSpeaking = false;
        };

        window.speechSynthesis.speak(utterance);
    },

    loadImages() {
        if (this.ready || this.loading)
            return;

        this.loading = true;

        this.images =
            new Array(this.scenes.length);

        this.imagesLoaded = 0;

        this.scenes.forEach((scene, i) => {
            const img = new Image();

            img.onload = () => {
                this.images[i] = img;
                this.imagesLoaded++;

                if (
                    this.imagesLoaded ===
                    this.scenes.length
                ) {
                    const elapsed =
                        performance.now() -
                        this.loadingStartTime;

                    const remaining =
                        Math.max(
                            0,
                            this.minLoadingTime -
                            elapsed
                        );

                    setTimeout(() => {
                        if (!this.active)
                            return;

                        this.ready = true;
                        this.loading = false;

                        setTimeout(() => {
                            if (
                                this.active &&
                                this.scene === 0
                            ) {
                                this.speakNarrator(
                                    this.scenes[0].text
                                );
                            }
                        }, 900);
                    }, remaining);
                }
            };

            img.onerror = () => {
                console.error(
                    "Erreur scene" +
                    (i + 1) +
                    ".png"
                );
            };

            img.src =
                "assets/prologue/scene" +
                (i + 1) +
                ".png";
        });
    },

    hideHUD() {
        [
            "hud",
            "life",
            "quest",
            "pieces",
            "inventory",
            "dialogue"
        ].forEach(id => {
            const element =
                document.getElementById(id);

            if (element)
                element.style.display = "none";
        });
    },

    update(dt) {
        if (
            !this.active ||
            !this.ready
        )
            return;

        const current =
            this.scenes[this.scene];

        /*
         * La scène 11 utilise son image
         * chargée explicitement.
         */

        if (
            this.scene === 10 &&
            this.scene11ImageLoaded
        ) {
            this.drawScene11();
            return;
        }

        if (!current)
            return;

        this.timer += dt;
        this.visualTime += dt;

        if (!this.finishedText) {
            this.textIndex =
                Math.floor(
                    this.timer * 1000 /
                    current.speed
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

        if (
            this.fadeDirection === -1
        ) {
            this.fade -=
                dt * 1.8;

            if (this.fade <= 0) {
                this.fade = 0;
                this.fadeDirection = 0;
            }
        }

        if (
            this.finishedText &&
            !this.narratorSpeaking &&
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

        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
        }

        this.narratorSpeaking = false;

        this.scene++;

        this.timer = 0;
        this.textIndex = 0;
        this.finishedText = false;

        this.fade = 1;
        this.fadeDirection = -1;

        this.visualTime = 0;

        setTimeout(() => {
            if (
                this.active &&
                this.scenes[this.scene]
            ) {
                this.speakNarrator(
                    this.scenes[this.scene].text
                );
            }
        }, 700);
    },

    skipText() {
        if (
            !this.active ||
            !this.ready
        )
            return;

        const current =
            this.scenes[this.scene];

        if (!this.finishedText) {
            this.textIndex =
                current.text.length;

            this.finishedText = true;

            if ("speechSynthesis" in window) {
                window.speechSynthesis.cancel();
                this.narratorSpeaking = false;
            }

            return;
        }

        this.nextScene();
    },

    finish() {
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
        }

        this.narratorSpeaking = false;
        this.active = false;

        this.scene = 0;
        this.timer = 0;
        this.textIndex = 0;
        this.finishedText = false;
        this.fade = 0;

        const hud =
            document.getElementById("hud");

        if (hud)
            hud.style.display = "";

        if (
            typeof finishPrologue ===
            "function"
        ) {
            finishPrologue();
        } else {
            Game.running = true;
        }
    },

    draw() {
        const ctx =
            Game.ctx;

        const width =
            Game.canvas.width;

        const height =
            Game.canvas.height;

        ctx.clearRect(
            0,
            0,
            width,
            height
        );

        if (!this.ready) {
            this.visualTime += 1 / 60;
            this.drawLoading();
            return;
        }

        const current =
            this.scenes[this.scene];

        const image =
            this.images[this.scene];

        if (
            !current ||
            !image
        )
            return;

        this.drawImageScene(
            image,
            current
        );

        this.drawVignette();

        this.drawNarration(
            current
        );

        if (this.fade > 0) {
            ctx.fillStyle =
                "rgba(0,0,0," +
                this.fade +
                ")";

            ctx.fillRect(
                0,
                0,
                width,
                height
            );
        }
    },

    drawScene11() {

        const ctx =
            Game.ctx;

        const width =
            Game.canvas.width;

        const height =
            Game.canvas.height;

        /*
         * Fond de secours.
         */

        ctx.fillStyle =
            "#050608";

        ctx.fillRect(
            0,
            0,
            width,
            height
        );


        const image =
            this.scene11Image;

        if (
            !image ||
            !this.scene11ImageLoaded
        ) {
            return;
        }


        /*
         * Affichage COVER
         */

        const imageRatio =
            image.width /
            image.height;

        const screenRatio =
            width /
            height;

        let drawWidth;
        let drawHeight;

        if (
            imageRatio >
            screenRatio
        ) {

            drawHeight =
                height;

            drawWidth =
                height *
                imageRatio;

        } else {

            drawWidth =
                width;

            drawHeight =
                width /
                imageRatio;
        }


        /*
         * Petit mouvement cinématique.
         */

        const moveY =
            Math.sin(
                this.visualTime * 0.35
            ) * 8;


        const x =
            (width - drawWidth) / 2;

        const y =
            (height - drawHeight) /
            2 +
            moveY;


        ctx.drawImage(
            image,
            x,
            y,
            drawWidth,
            drawHeight
        );
    },

    drawLoading() {
        const ctx =
            Game.ctx;

        const width =
            Game.canvas.width;

        const height =
            Game.canvas.height;

        ctx.fillStyle =
            "#050608";

        ctx.fillRect(
            0,
            0,
            width,
            height
        );

        const gradient =
            ctx.createRadialGradient(
                width / 2,
                height / 2,
                10,
                width / 2,
                height / 2,
                Math.min(width, height) * 0.55
            );

        gradient.addColorStop(
            0,
            "rgba(155,120,45,0.10)"
        );

        gradient.addColorStop(
            0.5,
            "rgba(80,60,25,0.04)"
        );

        gradient.addColorStop(
            1,
            "rgba(0,0,0,0)"
        );

        ctx.fillStyle = gradient;

        ctx.fillRect(
            0,
            0,
            width,
            height
        );

        for (
            let i = 0;
            i < 45;
            i++
        ) {
            const x =
                (
                    i * 137 +
                    this.visualTime * 12
                ) % width;

            const y =
                (
                    i * 73 +
                    this.visualTime * 7
                ) % height;

            const alpha =
                0.12 +
                Math.abs(
                    Math.sin(
                        this.visualTime * 1.5 +
                        i
                    )
                ) * 0.20;

            ctx.fillStyle =
                "rgba(190,155,70," +
                alpha +
                ")";

            ctx.fillRect(
                x,
                y,
                2,
                2
            );
        }

        const cx =
            width / 2;

        const crownY =
            height / 2 - 115;

        ctx.save();

        ctx.translate(
            cx,
            crownY
        );

        const pulse =
            1 +
            Math.sin(
                this.visualTime * 2
            ) * 0.025;

        ctx.scale(
            pulse,
            pulse
        );

        ctx.strokeStyle =
            "#b9973e";

        ctx.fillStyle =
            "rgba(185,151,62,0.08)";

        ctx.lineWidth = 3;

        ctx.beginPath();

        ctx.moveTo(-55, 18);
        ctx.lineTo(-45, -30);
        ctx.lineTo(-15, -5);
        ctx.lineTo(0, -42);
        ctx.lineTo(18, -5);
        ctx.lineTo(48, -30);
        ctx.lineTo(58, 18);

        ctx.closePath();

        ctx.fill();
        ctx.stroke();

        ctx.beginPath();

        ctx.moveTo(
            -58,
            18
        );

        ctx.lineTo(
            58,
            18
        );

        ctx.stroke();

        ctx.restore();

        ctx.textAlign =
            "center";

        ctx.font =
            "bold 46px Georgia";

        ctx.fillStyle =
            "#eee6d2";

        ctx.shadowColor =
            "rgba(185,151,62,0.35)";

        ctx.shadowBlur = 18;

        ctx.fillText(
            "PONAN'S LEGACY",
            cx,
            height / 2 - 35
        );

        ctx.shadowBlur = 0;

        ctx.font =
            "italic 18px Georgia";

        ctx.fillStyle =
            "#b9973e";

        ctx.fillText(
            "L'HÉRITAGE DES PLUMES",
            cx,
            height / 2 + 5
        );

        const lineWidth =
            Math.min(
                420,
                width * 0.55
            );

        ctx.strokeStyle =
            "rgba(185,151,62,0.55)";

        ctx.lineWidth = 1;

        ctx.beginPath();

        ctx.moveTo(
            cx - lineWidth / 2,
            height / 2 + 30
        );

        ctx.lineTo(
            cx + lineWidth / 2,
            height / 2 + 30
        );

        ctx.stroke();

        ctx.font =
            "16px Georgia";

        ctx.fillStyle =
            "rgba(238,230,210,0.75)";

        ctx.fillText(
            "Les chroniques de Ponan commencent...",
            cx,
            height / 2 + 70
        );

        const barWidth =
            Math.min(
                520,
                width * 0.62
            );

        const barHeight = 5;

        const barX =
            cx -
            barWidth / 2;

        const barY =
            height / 2 + 105;

        ctx.fillStyle =
            "rgba(255,255,255,0.08)";

        ctx.fillRect(
            barX,
            barY,
            barWidth,
            barHeight
        );

        const progress =
            this.imagesLoaded /
            this.scenes.length;

        ctx.fillStyle =
            "#b9973e";

        ctx.fillRect(
            barX,
            barY,
            barWidth * progress,
            barHeight
        );

        ctx.font =
            "13px Arial";

        ctx.fillStyle =
            "rgba(238,230,210,0.55)";

        ctx.fillText(
            Math.floor(progress * 100) +
            "%",
            cx,
            barY + 30
        );

        ctx.font =
            "12px Arial";

        ctx.fillStyle =
            "rgba(255,255,255,0.28)";

        ctx.fillText(
            "CHARGEMENT DU ROYAUME",
            cx,
            height - 35
        );

        ctx.textAlign =
            "left";
    },

    drawImageScene(
        image,
        scene
    ) {
        const ctx =
            Game.ctx;

        const width =
            Game.canvas.width;

        const height =
            Game.canvas.height;

        const ratio =
            image.width /
            image.height;

        const screenRatio =
            width /
            height;

        let drawWidth;
        let drawHeight;

        if (
            ratio >
            screenRatio
        ) {
            drawHeight =
                height *
                scene.zoom;

            drawWidth =
                drawHeight *
                ratio;
        } else {
            drawWidth =
                width *
                scene.zoom;

            drawHeight =
                drawWidth /
                ratio;
        }

        const progress =
            Math.min(
                1,
                this.visualTime /
                Math.max(
                    1,
                    scene.duration / 1000
                )
            );

        const ease =
            progress *
            progress *
            (3 - 2 * progress);

        let moveX = 0;
        let moveY = 0;

        if (this.scene === 0) {
            moveY =
                ease * 35;
        } else if (this.scene === 1) {
            moveY =
                ease * -35;
        } else if (this.scene === 2) {
            moveY =
                Math.sin(
                    ease * Math.PI
                ) * -18;
        } else if (this.scene === 3) {
            moveX =
                Math.sin(
                    ease * Math.PI
                ) * 28;
        } else if (this.scene === 4) {
            moveX =
                ease * -28;
        } else if (this.scene === 5) {
            moveY =
                ease * 22;
        } else if (this.scene === 6) {
            moveX =
                ease * 22;
        } else if (this.scene === 7) {
            moveY =
                ease * -20;
        } else if (this.scene === 8) {
            moveX =
                Math.sin(
                    ease * Math.PI
                ) * 16;
        } else {
            moveX =
                ease * -25;
        }

        ctx.save();

        ctx.imageSmoothingEnabled =
            false;

        ctx.drawImage(
            image,
            (width - drawWidth) / 2 +
                moveX,
            (height - drawHeight) / 2 +
                moveY,
            drawWidth,
            drawHeight
        );

        ctx.restore();

        this.drawParticles();
    },

    drawParticles() {
        const ctx =
            Game.ctx;

        const width =
            Game.canvas.width;

        const height =
            Game.canvas.height;

        ctx.save();

        if (
            [
                0,
                1,
                3,
                4
            ].includes(this.scene)
        ) {
            ctx.strokeStyle =
                "rgba(190,205,220,.16)";

            ctx.lineWidth = 1;

            for (
                let i = 0;
                i < 35;
                i++
            ) {
                const x =
                    (
                        i * 113 +
                        this.visualTime * 28
                    ) % width;

                const y =
                    (
                        i * 67 +
                        this.visualTime * 95
                    ) % height;

                ctx.beginPath();

                ctx.moveTo(
                    x,
                    y
                );

                ctx.lineTo(
                    x - 4,
                    y + 13
                );

                ctx.stroke();
            }
        }

        if (
            [
                6,
                7,
                8,
                9
            ].includes(this.scene)
        ) {
            for (
                let i = 0;
                i < 55;
                i++
            ) {
                const x =
                    (
                        i * 79 +
                        this.visualTime * 22
                    ) % width;

                const y =
                    height -
                    (
                        (
                            i * 43 +
                            this.visualTime * 25
                        ) %
                        (height * 0.75)
                    );

                ctx.fillStyle =
                    i % 3 === 0
                        ? "#ffb33b"
                        : "#c94325";

                ctx.globalAlpha =
                    0.20 +
                    Math.abs(
                        Math.sin(
                            this.visualTime * 3 +
                            i
                        )
                    ) * 0.55;

                ctx.fillRect(
                    x,
                    y,
                    2 + i % 3,
                    2 + i % 3
                );
            }
        }

        ctx.globalAlpha = 1;

        ctx.restore();
    },

    drawVignette() {
        const ctx =
            Game.ctx;

        const width =
            Game.canvas.width;

        const height =
            Game.canvas.height;

        const vignette =
            ctx.createRadialGradient(
                width / 2,
                height / 2,
                height * 0.20,
                width / 2,
                height / 2,
                height * 0.78
            );

        vignette.addColorStop(
            0,
            "rgba(0,0,0,0)"
        );

        vignette.addColorStop(
            1,
            "rgba(0,0,0,.78)"
        );

        ctx.fillStyle =
            vignette;

        ctx.fillRect(
            0,
            0,
            width,
            height
        );
    },

    drawNarration(scene) {
        const ctx =
            Game.ctx;

        const width =
            Game.canvas.width;

        const height =
            Game.canvas.height;

        const boxWidth =
            Math.min(
                900,
                width * 0.82
            );

        const boxHeight = 165;

        const x =
            (width - boxWidth) / 2;

        const y =
            height - boxHeight - 55;

        ctx.fillStyle =
            "rgba(0,0,0,.78)";

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

        ctx.textAlign =
            "left";

        ctx.font =
            "bold 18px Georgia";

        ctx.fillStyle =
            "#d9b441";

        ctx.fillText(
            scene.title,
            x + 24,
            y + 30
        );

        ctx.font =
            "22px Georgia";

        ctx.fillStyle =
            "#f1eee5";

        this.drawWrappedText(
            scene.text.substring(
                0,
                this.textIndex
            ),
            x + 24,
            y + 72,
            boxWidth - 48,
            31
        );

        ctx.textAlign =
            "center";

        ctx.font =
            "15px Arial";

        ctx.fillStyle =
            "rgba(255,255,255,.65)";

        ctx.fillText(
            "ESPACE / ENTRÉE : continuer",
            width / 2,
            height - 25
        );

        ctx.textAlign =
            "left";

        ctx.fillStyle =
            "rgba(255,255,255,.45)";

        ctx.fillText(
            "PROLOGUE " +
            (this.scene + 1) +
            " / " +
            this.scenes.length,
            22,
            28
        );
    },

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
    }
};

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
