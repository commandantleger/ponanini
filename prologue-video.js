/*
============================================================
 PONAN'S LEGACY
 VIDEO PROLOGUE ENGINE
============================================================

Priorité :

    MP4
     ↓
    PNG fallback

Les scènes 9 à 11 continuent d'utiliser
les anciennes images tant que leurs vidéos
ne sont pas disponibles.
*/

(function () {

    "use strict";


    /* ========================================================
       CONFIGURATION
    ======================================================== */

    const VIDEO_PATH =
        "assets/prologue/scene";


    const videos = [];


    const videoReady = [];


    const videoFailed = [];


    let initialized = false;


    /* ========================================================
       CREATION DES VIDEOS
    ======================================================== */

    function createVideos() {

        if (initialized)
            return;


        initialized = true;


        /*
         * On prépare 11 scènes.
         *
         * Les scènes 1 à 8 disposent actuellement
         * de vidéos.
         *
         * Les scènes 9 à 11 pourront être ajoutées
         * plus tard sans changer le système.
         */

        for (
            let i = 0;
            i < 11;
            i++
        ) {

            const video =
                document.createElement(
                    "video"
                );


            video.preload = "auto";

            video.playsInline = true;

            video.muted = true;

            video.loop = false;


            videoReady[i] = false;

            videoFailed[i] = false;


            const sceneNumber =
                i + 1;


            video.src =
                VIDEO_PATH +
                sceneNumber +
                ".mp4";


            video.addEventListener(
                "canplay",
                function () {

                    videoReady[i] =
                        true;

                    console.log(
                        "🎬 Vidéo scène " +
                        sceneNumber +
                        " prête."
                    );

                }
            );


            video.addEventListener(
                "error",
                function () {

                    videoFailed[i] =
                        true;

                    console.warn(
                        "⚠️ Vidéo scène " +
                        sceneNumber +
                        " indisponible. PNG utilisé."
                    );

                }
            );


            video.addEventListener(
                "ended",
                function () {

                    /*
                     * La durée de la scène reste
                     * contrôlée par Prologue.
                     *
                     * On ne change donc pas automatiquement
                     * de scène ici.
                     */

                }
            );


            videos[i] =
                video;


            /*
             * On ne l'ajoute PAS au DOM.
             *
             * La vidéo sera dessinée directement
             * dans le Canvas.
             */

            video.load();

        }

    }


    /* ========================================================
       ARRETER TOUTES LES VIDEOS
    ======================================================== */

    function stopAllVideos() {

        videos.forEach(
            video => {

                if (!video)
                    return;


                video.pause();


                try {

                    video.currentTime = 0;

                } catch (error) {

                    /*
                     * Rien à faire.
                     */

                }

            }
        );

    }


    /* ========================================================
       LANCER UNE SCENE
    ======================================================== */

    function playScene(index) {

        const video =
            videos[index];


        if (!video)
            return;


        stopAllVideos();


        /*
         * On repart toujours du début.
         */

        try {

            video.currentTime = 0;

        } catch (error) {

        }


        const promise =
            video.play();


        if (promise) {

            promise.catch(
                error => {

                    console.warn(
                        "⚠️ Impossible de lancer la vidéo scène " +
                        (index + 1),
                        error
                    );

                }
            );

        }

    }


    /* ========================================================
       DESSIN DE LA VIDEO
    ======================================================== */

    function drawVideo(
        ctx,
        video,
        width,
        height
    ) {

        if (
            !video ||
            video.readyState <
            2
        ) {

            return false;

        }


        const videoWidth =
            video.videoWidth;


        const videoHeight =
            video.videoHeight;


        if (
            !videoWidth ||
            !videoHeight
        ) {

            return false;

        }


        /*
         * COVER
         *
         * La vidéo remplit exactement
         * le Canvas sans déformation.
         */

        const scale =
            Math.max(
                width / videoWidth,
                height / videoHeight
            );


        const drawWidth =
            videoWidth * scale;


        const drawHeight =
            videoHeight * scale;


        const x =
            (width - drawWidth) / 2;


        const y =
            (height - drawHeight) / 2;


        ctx.drawImage(
            video,
            x,
            y,
            drawWidth,
            drawHeight
        );


        return true;

    }


    /* ========================================================
       INITIALISATION
    ======================================================== */

    function initialize() {

        createVideos();

    }


    /* ========================================================
       ATTENDRE PROLOGUE
    ======================================================== */

    const wait =
        setInterval(
            function () {

                if (
                    typeof Prologue ===
                    "undefined"
                ) {

                    return;

                }


                clearInterval(wait);


                initialize();


                /*
                 * Sauvegarde des fonctions originales.
                 */

                const originalStart =
                    Prologue.start;


                const originalNextScene =
                    Prologue.nextScene;


                const originalFinish =
                    Prologue.finish;


                const originalDraw =
                    Prologue.draw;


                /* ==================================================
                   START
                ================================================== */

                Prologue.start =
                    function () {

                        originalStart.call(
                            Prologue
                        );


                        /*
                         * La première scène
                         * commence avec la vidéo.
                         */

                        setTimeout(
                            function () {

                                playScene(
                                    Prologue.scene
                                );

                            },
                            100
                        );

                    };


                /* ==================================================
                   NEXT SCENE
                ================================================== */

                Prologue.nextScene =
                    function () {

                        /*
                         * Stopper la vidéo précédente.
                         */

                        stopAllVideos();


                        /*
                         * Appeler le système
                         * original de narration/fade.
                         */

                        originalNextScene.call(
                            Prologue
                        );


                        /*
                         * Lancer la nouvelle vidéo
                         * après le changement de scène.
                         */

                        setTimeout(
                            function () {

                                if (
                                    !Prologue.active
                                ) {

                                    return;

                                }


                                playScene(
                                    Prologue.scene
                                );

                            },
                            100
                        );

                    };


                /* ==================================================
                   FIN
                ================================================== */

                Prologue.finish =
                    function () {

                        stopAllVideos();


                        originalFinish.call(
                            Prologue
                        );

                    };


                /* ==================================================
                   DRAW
                ================================================== */

                Prologue.draw =
                    function () {

                        const ctx =
                            Game.ctx;


                        const width =
                            Game.canvas.width;


                        const height =
                            Game.canvas.height;


                        /*
                         * Pendant le chargement,
                         * utiliser le système original.
                         */

                        if (
                            !Prologue.ready
                        ) {

                            originalDraw.call(
                                Prologue
                            );

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
                         * Essayer la vidéo.
                         */

                        const drawn =
                            drawVideo(
                                ctx,
                                video,
                                width,
                                height
                            );


                        /*
                         * Si la vidéo n'est pas disponible,
                         * utiliser le dessin original.
                         */

                        if (!drawn) {

                            originalDraw.call(
                                Prologue
                            );

                            return;

                        }


                        /*
                         * =========================================
                         * VIGNETTE
                         * =========================================
                         */

                        if (
                            typeof Prologue.drawVignette ===
                            "function"
                        ) {

                            Prologue.drawVignette();

                        }


                        /*
                         * =========================================
                         * NARRATION
                         * =========================================
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
                         * =========================================
                         * FADE
                         * =========================================
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
                    "🎬 Prologue vidéo activé."
                );

            },
            100
        );

})();
