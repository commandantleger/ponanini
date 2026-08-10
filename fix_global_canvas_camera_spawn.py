#!/usr/bin/env python3
from pathlib import Path
import shutil
import subprocess
import sys
import re

ROOT = Path("/home/paulo/ponanini")

FILES = [
    ROOT / "game.js",
    ROOT / "style.css",
    ROOT / "map.js",
    ROOT / "player.js",
]

def backup(path):
    if path.exists():
        dst = path.with_suffix(path.suffix + ".before_visual_fix")
        shutil.copy2(path, dst)
        print(f"[BACKUP] {dst.name}")

def patch_style():
    path = ROOT / "style.css"
    text = path.read_text(encoding="utf-8")

    old = """#game {
    display: block;
    width: 100vw;
    height: 100vh;
    image-rendering: pixelated;
    background: #000;
}"""

    new = """#game {
    position: fixed;
    inset: 0;
    display: block;
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
    border: 0;
    image-rendering: pixelated;
    background: #000;
    z-index: 0;
}"""

    if old in text:
        text = text.replace(old, new, 1)
    else:
        # Idempotent fallback.
        text = re.sub(
            r"#game\\s*\\{.*?\\}",
            new,
            text,
            count=1,
            flags=re.S
        )

    path.write_text(text, encoding="utf-8")
    print("[OK] style.css : canvas fixé à la fenêtre")

def patch_game():
    path = ROOT / "game.js"
    text = path.read_text(encoding="utf-8")

    old = """canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});"""

    new = """function resizeGameCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeGameCanvas();

window.addEventListener("resize", resizeGameCanvas);"""

    if old in text:
        text = text.replace(old, new, 1)
    else:
        print("[INFO] bloc resize game.js déjà modifié ou différent")

    path.write_text(text, encoding="utf-8")
    print("[OK] game.js : resize centralisé")

def patch_map():
    path = ROOT / "map.js"
    text = path.read_text(encoding="utf-8")

    old = """    Game.camera.x =
        player.x -
        Game.canvas.width / 2;

    Game.camera.y =
        player.y -
        Game.canvas.height / 2;"""

    new = """    /*
     * CAMERA STABLE
     * Le centre du joueur est x + 20 / y + 20.
     * La caméra est ensuite limitée aux dimensions réelles
     * de la map pour éviter les zones vides.
     */
    const mapWidth =
        WORLD[0].length * T;

    const mapHeight =
        WORLD.length * T;

    const viewWidth =
        Game.canvas.width;

    const viewHeight =
        Game.canvas.height;

    Game.camera.x =
        player.x + player.w / 2 -
        viewWidth / 2;

    Game.camera.y =
        player.y + player.h / 2 -
        viewHeight / 2;

    Game.camera.x =
        Math.max(
            0,
            Math.min(
                Game.camera.x,
                Math.max(
                    0,
                    mapWidth - viewWidth
                )
            )
        );

    Game.camera.y =
        Math.max(
            0,
            Math.min(
                Game.camera.y,
                Math.max(
                    0,
                    mapHeight - viewHeight
                )
            )
        );"""

    if old not in text:
        print("[ERREUR] caméra map.js introuvable")
        return False

    text = text.replace(old, new, 1)
    path.write_text(text, encoding="utf-8")
    print("[OK] map.js : caméra centrée sur le personnage")
    return True

def patch_player():
    path = ROOT / "player.js"
    text = path.read_text(encoding="utf-8")

    # Restore the reliable player(2) arrival logic by changing only the spawn
    # and portal rendering offset in the current file.
    text = re.sub(
        r'player\\.x\\s*=\\s*25\\s*\\*\\s*Game\\.tileSize;',
        'player.x = 21 * Game.tileSize;',
        text
    )
    text = re.sub(
        r'player\\.y\\s*=\\s*30\\s*\\*\\s*Game\\.tileSize;',
        'player.y = 69 * Game.tileSize;',
        text
    )

    # The portal should be attached to the ground point, not to a fixed
    # unrelated height that can drift from the player's actual arrival z.
    text = text.replace(
        'drawArrivalPortal(cx, groundY - 560);',
        'drawArrivalPortal(cx, groundY - playerArrival.z);'
    )

    # Make the player visibly distinct from NPCs during gameplay.
    # Replace only the neutral body colors used by the player.
    text = text.replace(
        'ctx.fillStyle = "#d8b94f";',
        'ctx.fillStyle = "#f2c94c";',
    )
    text = text.replace(
        'ctx.fillStyle = "#e4c65b";',
        'ctx.fillStyle = "#ffd95a";',
    )

    # Up-facing body gets the same player palette.
    text = text.replace(
        'ctx.fillStyle = "#c5a845";',
        'ctx.fillStyle = "#e4bd3f";',
    )

    path.write_text(text, encoding="utf-8")
    print("[OK] player.js : spawn 21,69 + rendu joueur restauré")

def check_js(path):
    result = subprocess.run(
        ["node", "--check", str(path)],
        capture_output=True,
        text=True
    )
    if result.returncode:
        print(f"[ERREUR SYNTAXE] {path.name}")
        print(result.stderr)
        return False
    print(f"[OK] syntaxe {path.name}")
    return True

def main():
    if not ROOT.exists():
        print(f"Projet introuvable : {ROOT}")
        sys.exit(1)

    for path in FILES:
        backup(path)

    patch_style()
    patch_game()

    if not patch_map():
        sys.exit(1)

    patch_player()

    ok = all(
        check_js(ROOT / name)
        for name in ("game.js", "map.js", "player.js")
    )

    if not ok:
        sys.exit(1)

    print()
    print("==============================================")
    print(" CORRECTION VISUELLE + GAMEPLAY TERMINÉE")
    print("==============================================")
    print()
    print("1. Canvas : plein écran réel, plus de décalage.")
    print("2. Caméra : centrée sur le centre du joueur.")
    print("3. Caméra : bloquée aux limites de la map.")
    print("4. Spawn : 21,69, au bord du lac.")
    print("5. Portail : exactement au-dessus du joueur.")
    print("6. Joueur : rendu jaune distinct des PNJ.")
    print()
    print("Les anciens fichiers sont conservés en .before_visual_fix")
    print("Ne modifie rien manuellement avant le prochain test.")

if __name__ == "__main__":
    main()
