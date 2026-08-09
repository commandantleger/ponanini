const Prologue = {
    narratorEnabled: true,
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

    loadingStartTime: 0,
    minLoadingTime: 3200,

    images: [],
    imagesLoaded: 0,
    loading: false,
    ready: false,

    images: [],
    imagesLoaded: 0,
    loading: false,
    ready: false,

    scenes: [
        {
            title: "IL ÉTAIT UNE FOIS...",
            text:
                "Dans une vallée oubliée des hommes, " +
                "un ancien royaume vivait derrière ses murailles. " +
                "Ponan dormait sous la brume, protégé par ses montagnes. " +
                "Au centre du royaume s'élevait le palais royal.",
            duration: 11000,
            speed: 42,
            zoom: 1.00
        },
        {
            title: "LE ROYAUME DE PONAN",
            text:
                "Depuis des générations, la couronne appartenait " +
                "à la lignée des Ponanini. Mais derrière les murs " +
                "du palais, la paix n'était déjà plus qu'un souvenir.",
            duration: 11000,
            speed: 42,
            zoom: 1.08
        },
        {
            title: "PONANINI III, ROI JUSTE",
            text:
                "Ponanini III régnait avec justice. " +
                "Son peuple l'aimait. Son royaume prospérait. " +
                "Et pourtant, dans l'ombre, quelqu'un attendait son heure.",
            duration: 11000,
            speed: 42,
            zoom: 1.04
        },
        {
            title: "LE FRÈRE DANS L'OMBRE",
            text:
                "Son propre frère observait le trône. " +
                "Il ne voulait ni patience, ni héritage. " +
                "Il voulait le pouvoir. Et pour l'obtenir, " +
                "il était prêt à sacrifier son propre sang.",
            duration: 11000,
            speed: 42,
            zoom: 1.08
        },
        {
            title: "LE MENSONGE",
            text:
                "Les rumeurs commencèrent à courir dans les rues. " +
                "Puis vinrent les accusations. " +
                "Un mensonge répété assez longtemps finit toujours " +
                "par ressembler à la vérité.",
            duration: 11000,
            speed: 42,
            zoom: 1.06
        },
        {
            title: "LA PRISE DU POUVOIR",
            text:
                "Ponanini III fut accusé de trahison. " +
                "Des gardes furent achetés. " +
                "La foule se retourna contre lui. " +
                "Et son frère prit enfin la place qu'il convoitait.",
            duration: 12000,
            speed: 42,
            zoom: 1.08
        },
        {
            title: "LE BANNISSEMENT",
            text:
                "Dans la cour du palais, les gardes escortèrent " +
                "Ponanini III jusqu'au portail interdit. " +
                "Il fut jeté dans le Nether. " +
                "Le portail se referma presque aussitôt derrière lui.",
            duration: 12000,
            speed: 40,
            zoom: 1.10
        },
        {
            title: "LE SCEAU",
            text:
                "Mais le Nether ne fut pas sa seule prison. " +
                "Un ancien sceau fut gravé sur les portes du royaume. " +
                "Même si quelqu'un venait le libérer, " +
                "Ponanini III ne pourrait jamais sortir.",
            duration: 12000,
            speed: 40,
            zoom: 1.08
        },
        {
            title: "LES TROIS FRAGMENTS",
            text:
                "Trois fragments furent dispersés à travers les terres. " +
                "Ils sont les seuls capables de briser le sceau. " +
                "Sans eux, aucun chemin ne mène hors du Nether.",
            duration: 12000,
            speed: 40,
            zoom: 1.06
        },
        {
            title: "L'HÉRITAGE",
            text:
                "Alors Ponanini III attendit. " +
                "Il lui fallait quelqu'un du monde des vivants. " +
                "Quelqu'un capable de retrouver les trois fragments. " +
                "Et cette personne... c'est vous.",
            duration: 13000,
            speed: 38,
            zoom: 1.08
        },

                {
            title: "L'ÉTRANGER",

            text:
                "Mais cette histoire ne commence pas à Ponan. " +
                "Elle commence ailleurs, dans un monde où les hommes " +
                "ignorent jusqu'à l'existence de ce royaume. " +
                "Un jour, un homme ordinaire fut arraché à son monde " +
                "et projeté dans une dimension qui n'était pas la sienne. " +
                "Lorsqu'il ouvrit les yeux, il n'était plus humain. " +
                "Son corps avait changé. Son reflet lui était étranger. " +
                "Il était devenu un canard. " +
                "Il ne connaissait ni Ponan, ni ses rois, ni leur guerre. " +
                "Il voulait seulement comprendre où il était... " +
                "et trouver un moyen de rentrer chez lui. " +
                "Mais en cherchant des réponses, il allait découvrir " +
                "l'histoire d'un roi déchu, d'un frère traître... " +
                "et d'un héritage qui allait changer son destin.",

            duration: 30000,

            textSpeed: 42,

            visual: "stranger"
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
        this.scene11Image = null;
        this.scene11ImageLoaded = false;
        this.narratorSpeaking = false;
        this.loadingStartTime = performance.now();
        this.ready = false;
        this.loading = false;
        this.images = [];
        this.imagesLoaded = 0;

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

            console.log(
                "Scene " +
                (i + 1) +
                " chargée."
            );

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
                "ERREUR : assets/prologue/scene" +
                (i + 1) +
                ".png"
            );

            /*
             * On ne bloque pas tout le prologue
             * si une image est absente.
             */

            this.images[i] = null;

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

        this.visualTime +=
            1 / 60;

        this.drawLoading();

        return;
    }


    const current =
        this.scenes[this.scene];


    if (!current)
        return;


    const image =
        this.images[this.scene];


    /*
     * SCÈNE 11
     */

    if (
        this.scene === 10 &&
        image
    ) {

        this.drawImageScene(
            image,
            current
        );

    } else if (image) {

        this.drawImageScene(
            image,
            current
        );

    } else {

        /*
         * Image manquante :
         * on garde un fond noir au lieu
         * de faire disparaître la scène.
         */

        ctx.fillStyle =
            "#050608";

        ctx.fillRect(
            0,
            0,
            width,
            height
        );
    }


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
            height - 215;

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
