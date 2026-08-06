const quests = {

    intro: {

        name: "Le costume perdu",

        description:
            "Retrouver les 3 morceaux du costume de Ponanini IV.",

        completed: false

    }

};

function updateQuest() {

    if (
        !quests.intro.completed &&
        duckPieces >= 3
    ) {

        quests.intro.completed = true;

        openDialogue(
            "📜 Quête terminée !<br><br>Retourne voir Ponanini IV."
        );

       document.getElementById("quest").innerHTML =
    "👑 Retourner parler à Ponanini IV";
    }

}
