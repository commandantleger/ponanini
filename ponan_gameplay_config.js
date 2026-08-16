/* =========================================================
   PONAN'S LEGACY — GAMEPLAY CONFIGURATION
   Source unique des paramètres RPG.
========================================================= */

window.PonanGameplayConfig = Object.freeze({
    version: "3.0",

    player: {
        baseSpeed: 3.2,
        sprintMultiplier: 1.55,
        maxHP: 100,
        maxStamina: 100,
        staminaRegen: 22,
        sprintCost: 24,
        dodgeCost: 30,
        dodgeDuration: 0.18,
        attackCooldown: 0.32
    },

    combat: {
        enabled: true,
        attackKey: "KeyJ",
        heavyAttackKey: "KeyK",
        dodgeKey: "Space",
        interactKey: "KeyE",
        attackRange: 82,
        attackDamage: 18,
        heavyDamage: 34,
        comboWindow: 0.55
    },

    progression: {
        level: 1,
        xp: 0,
        xpBase: 100,
        xpGrowth: 1.35,
        gold: 0,
        fragments: 0,
        maxFragments: 3
    },

    camera: {
        follow: true,
        smooth: 0.14,
        clampToWorld: true
    },

    world: {
        startingZone: "village_ponan",
        zones: [
            { id: "village_ponan", name: "Village de Ponan", objective: "Parler à Marek, l'ancien du lac" },
            { id: "grand_lac", name: "Grand Lac", objective: "Découvrir les traces de Ponanini III" },
            { id: "foret_murmures", name: "Forêt des Murmures", objective: "Trouver le premier fragment" },
            { id: "ruines_royales", name: "Ruines de l'ancien roi", objective: "Révéler la vérité sur le bannissement" },
            { id: "sanctuaire_fragment", name: "Sanctuaire des Fragments", objective: "Réunir les trois fragments" }
        ]
    },

    story: {
        protagonist: "Ponan",
        fallenKing: "Ponanini III",
        usurper: "Ponanini IV",
        mainQuest: "Découvrir la vérité sur l'héritage de Ponan"
    },

    audio: {
        menu: "assets/audio/menu.wav",
        gameplay: "assets/audio/gameplay.mp3",
        intro: "assets/audio/intro.mp3",
        menuVolume: 0.42,
        gameplayVolume: 0.34,
        introVolume: 0.45
    }
});
