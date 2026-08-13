/*
============================================================
 PONAN'S LEGACY
 PROLOGUE VIDEO SYSTEM
============================================================
 MP4 prioritaire
 PNG fallback
============================================================
*/

(function () {

    "use strict";


    const VIDEO_COUNT = 11;

    const VIDEO_PATH =
        "assets/prologue/scene";


    const videos = [];

    let installed = false;


    /* ========================================================
       CREATION DES VIDEOS
    ======================================================== */

    function createVideos() {

        for (
            let i = 0;
            i < VIDEO_COUNT;
            i++
        ) {

            const video =
                document.createElement("video");


            video.preload = "auto";

            video.muted = true;

            video.playsInline = true;

            video.setAttribute(
                "playsinline",
                ""
            );

            video.setAttribute(
                "webkit-playsinline",
                ""
            );


            video.src =
                VIDEO_PATH +
                (i + 1) +
                ".mp4";


            video.addEventListener(
                "loadeddata",
                function () {

                    console.log(
                        "🎬 Scene " +
                        (i + 1) +
                        " vidéo chargée."
                    );

                }
            );


            video.addEventListener(
                "error",
                function () {

                    /*
                     * Normal pour les scènes
                     * dont le MP4 n'existe pas encore.
                     */

                    if (i < 8) {

                        console.error(
                            "❌ ERREUR VIDEO SCENE " +
                            (i + 1),
                            video.error
                        );

                    }

                }
            );


            videos[i] = video;


            /*
             * Important :
             * on lance immédiatement le chargement.
             */

            video.load();

        }

    }


    /* ========================================================
       STOPPER TOUTES LES VIDEOS
    ======================================================== */

    function stopVideos() {

        videos.forEach(
            video => {

                if (!video)
                    return;


                video.pause();


                try {

                    video.currentTime = 0;

                } catch (error) {

                }

            }
        );

    }


    /* ========================================================
       LANCER UNE VIDEO
    ======================================================== */

    function playVideo(sceneIndex) {

        const video =
            videos[sceneIndex];


        if (!video) {

            console.warn(
                "⚠️ Pas de vidéo pour la scène " +
                (sceneIndex + 1)
            );

            return;

        }


        /*
         * Arrêter les autres vidéos.
         */

        videos.forEach(
            (other, index) => {

                if (
                    other &&
                    index !== sceneIndex
                ) {

                    other.pause();

                }

            }
        );


        try {

            video.currentTime = 0;

        } catch (error) {

        }


        /*
         * muted = true permet à la vidéo
         * de démarrer automatiquement.
         */

        video.muted = true;


        const promise =
            video.play();


        if (promise) {

            promise
                .then(
                    () => {

                        console.log(
                            "▶️ Lecture scene " +
                            (sceneIndex + 1)
                        );

                    }
                )
                .catch(
                    error => {

                        console.warn(
                            "⚠️ Autoplay vidéo bloqué pour scene " +
                            (sceneIndex + 1),
                            error
                        );

                    }
                );

        }

    }


    /* ========================================================
       VIDEO DISPONIBLE ?
    ======================================================== */

    function videoIsReady(index) {

        const video =
            videos[index];


        if (!video)
            return false;


        return (
            video.readyState >= 2 &&
            video.videoWidth > 0 &&
            video.videoHeight > 0
        );

    }


    /* ========================================================
       DESSIN VIDEO
    ======================================================== */

    function drawVideo(
        ctx,
        video,
        width,
        height
    ) {

        if (!videoIsReady(
            videos.indexOf(video)
        )) {

            return false;

        }


        const vw =
            video.videoWidth;


        const vh =
            video.videoHeight;


        /*
         * COVER :
         * la vidéo remplit entièrement
         * le Canvas sans déformation.
         */

        const scale =
            Math.max(
                width / vw,
                height / vh
            );


        const dw =
            vw * scale;


        const dh =
            vh * scale;


        const x =
            (width - dw) / 2;


        const y =
            (height - dh) / 2;


        ctx.drawImage(
            video,
            x,
            y,
            dw,
            dh
        );


        return true;

    }


    /* ========================================================
       INSTALLATION
    ======================================================== */

    function install() {

        if (installed)
            return;


        if (
            typeof Prologue ===
            "undefined"
        ) {

            return;

        }


        installed = true;


        createVideos();


        /*
         * Sauvegarde des fonctions originales.
         */

        const originalStart =
            Prologue.start.bind(
                Prologue
            );


        const originalNextScene =
            Prologue.nextScene.bind(
                Prologue
            );


        const originalFinish =
            Prologue.finish.bind(
                Prologue
            );


        const originalDraw =
            Prologue.draw.bind(
                Prologue
            );


        /* ====================================================
           START PROLOGUE
        ==================================================== */

        Prologue.start =
            function () {

                console.log(
                    "🎬 Démarrage du prologue vidéo..."
                );


                /*
                 * COUPURE MUSIQUE MENU
                 */

                const menuMusic =
                    document.getElementById(
                        "menuMusic"
                    );


                if (menuMusic) {

                    menuMusic.pause();

                    menuMusic.currentTime = 0;

                    menuMusic.volume = 0;

                    console.log(
                        "🔇 Musique du menu arrêtée."
                    );

                }


                /*
                 * Arrêter toutes les anciennes vidéos.
                 */

                stopVideos();


                /*
                 * Lancer le prologue original.
                 */

                originalStart();


                /*
                 * Laisser Prologue s'initialiser.
                 */

                setTimeout(
                    function () {

                        if (
                            Prologue.active
                        ) {

                            playVideo(
                                Prologue.scene
                            );

                        }

                    },
                    300
                );

            };


        /* ====================================================
           SCENE SUIVANTE
        ==================================================== */

        Prologue.nextScene =
            function () {

                console.log(
                    "➡️ Passage scène suivante"
                );


                /*
                 * Stopper la vidéo actuelle.
                 */

                stopVideos();


                /*
                 * Faire fonctionner la logique
                 * originale du prologue.
                 */

                originalNextScene();


                /*
                 * Attendre que le fade
                 * commence puis lancer la vidéo.
                 */

                setTimeout(
                    function () {

                        if (
                            !Prologue.active
                        ) {

                            return;

                        }


                        playVideo(
                            Prologue.scene
                        );

                    },
                    150
                );

            };


        /* ====================================================
           FIN
        ==================================================== */

        Prologue.finish =
            function () {

                stopVideos();


                originalFinish();

            };


        /* ====================================================
           DRAW
        ==================================================== */

        Prologue.draw =
            function () {

                const ctx =
                    Game.ctx;


                const width =
                    Game.canvas.width;


                const height =
                    Game.canvas.height;


                /*
                 * Pendant le chargement :
                 * utiliser le système original.
                 */

                if (
                    !Prologue.ready
                ) {

                    originalDraw();

                    return;

                }


                const current =
                    Prologue.scenes[
                        Prologue.scene
                    ];


                if (!current)
                    return;


                const video =
                    videos[
                        Prologue.scene
                    ];


                /*
                 * Essayer d'afficher la vidéo.
                 */

                const displayed =
                    drawVideo(
                        ctx,
                        video,
                        width,
                        height
                    );


                /*
                 * Si la vidéo n'est pas prête,
                 * on utilise temporairement
                 * l'ancien PNG.
                 */

                if (!displayed) {

                    originalDraw();

                    return;

                }


                /*
                 * VIGNETTE
                 */

                if (
                    typeof Prologue.drawVignette ===
                    "function"
                ) {

                    Prologue.drawVignette();

                }


                /*
                 * NARRATION
                 */

                if (
                    typeof Prologue.drawNarration ===
                    "function"
                ) {

                    Prologue.drawNarration(
                        current
                    );

                }


                /*
                 * FADE
                 */

                if (
                    Prologue.fade > 0
                ) {

                    ctx.fillStyle =
                        "rgba(0,0,0," +
                        Prologue.fade +
                        ")";


                    ctx.fillRect(
                        0,
                        0,
                        width,
                        height
                    );

                }

            };


        console.log(
            "✅ PROLOGUE VIDEO SYSTEM INSTALLÉ"
        );

    }


    /* ========================================================
       ATTENDRE PROLOGUE
    ======================================================== */

    const timer =
        setInterval(
            function () {

                if (
                    typeof Prologue ===
                    "undefined"
                ) {

                    return;

                }


                clearInterval(timer);


                install();

            },
            50
        );

})();
