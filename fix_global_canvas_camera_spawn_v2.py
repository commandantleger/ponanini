from pathlib import Path
import re
import subprocess
import sys

ROOT = Path("/home/paulo/ponanini")
FILES = [
    ROOT / "game.js",
    ROOT / "style.css",
    ROOT / "map.js",
    ROOT / "player.js",
]

def backup(path):
    if not path.exists():
        print(f"[ERREUR] fichier introuvable : {path}")
        return False

    backup_path = path.with_name(path.name + ".before_visual_fix_v2")
    if not backup_path.exists():
        backup_path.write_text(path.read_text(encoding="utf-8"), encoding="utf-8")
    print(f"[BACKUP] {backup_path.name}")
    return True


def patch_map():
    path = ROOT / "map.js"
    if not path.exists():
        print("[ERREUR] map.js introuvable")
        return False

    text = path.read_text(encoding="utf-8")

    camera = """    /*
     * CAMERA STABLE
     * Centre réel du joueur + limites de la map.
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
        );
"""

    # On travaille uniquement dans drawMap().
    start = text.find("function drawMap()")
    if start == -1:
        print("[ERREUR] function drawMap() introuvable dans map.js")
        return False

    end = text.find("    for (", start)
    if end == -1:
        print("[ERREUR] boucle de dessin introuvable dans drawMap()")
        return False

    section = text[start:end]

    # Cas 1 : ancienne caméra présente.
    old_pattern = re.compile(
        r"Game\.camera\.x\s*=\s*player\.x\s*-\s*Game\.canvas\.width\s*/\s*2\s*;"
        r"\s*Game\.camera\.y\s*=\s*player\.y\s*-\s*Game\.canvas\.height\s*/\s*2\s*;",
        re.S,
    )

    if old_pattern.search(section):
        section = old_pattern.sub(camera.rstrip(), section, count=1)
        text = text[:start] + section + text[end:]
        path.write_text(text, encoding="utf-8")
        print("[OK] map.js : ancienne caméra remplacée")
        return True

    # Cas 2 : caméra déjà modifiée par une tentative précédente.
    if "const mapWidth" in section and "Game.camera.x" in section:
        print("[OK] map.js : caméra déjà corrigée")
        return True

    # Cas 3 : aucune caméra reconnue -> insertion propre après T.
    marker = "    const T = Game.tileSize;"
    pos = section.find(marker)
    if pos == -1:
        print("[ERREUR] point d'insertion de la caméra introuvable")
        return False

    insert_at = pos + len(marker)
    section = section[:insert_at] + "\n\n" + camera + section[insert_at:]
    text = text[:start] + section + text[end:]
    path.write_text(text, encoding="utf-8")
    print("[OK] map.js : caméra insérée proprement")
    return True


def patch_player():
    path = ROOT / "player.js"
    if not path.exists():
        print("[ERREUR] player.js introuvable")
        return False

    text = path.read_text(encoding="utf-8")

    # Spawn initial.
    text = re.sub(
        r"(x\s*:\s*)25\s*\*\s*Game\.tileSize\s*,",
        r"\g<1>21 * Game.tileSize,",
        text,
        count=1,
    )
    text = re.sub(
        r"(y\s*:\s*)30\s*\*\s*Game\.tileSize\s*,",
        r"\g<1>69 * Game.tileSize,",
        text,
        count=1,
    )

    # Spawn lors de l'arrivée du joueur.
    text = re.sub(
        r"player\.x\s*=\s*25\s*\*\s*Game\.tileSize\s*;",
        "player.x = 21 * Game.tileSize;",
        text,
    )
    text = re.sub(
        r"player\.y\s*=\s*30\s*\*\s*Game\.tileSize\s*;",
        "player.y = 69 * Game.tileSize;",
        text,
    )

    # Portail attaché à la position réelle du joueur pendant la chute.
    text = text.replace(
        "drawArrivalPortal(cx, groundY - 560);",
        "drawArrivalPortal(cx, groundY - playerArrival.z);",
    )

    # Palette du joueur.
    text = text.replace(
        'ctx.fillStyle = "#d8b94f";',
        'ctx.fillStyle = "#f2c94c";',
    )
    text = text.replace(
        'ctx.fillStyle = "#e4c65b";',
        'ctx.fillStyle = "#ffd95a";',
    )
    text = text.replace(
        'ctx.fillStyle = "#c5a845";',
        'ctx.fillStyle = "#e4bd3f";',
    )

    path.write_text(text, encoding="utf-8")
    print("[OK] player.js : spawn 21,69 + joueur restauré")
    return True


def check_js(name):
    path = ROOT / name
    result = subprocess.run(
        ["node", "--check", str(path)],
        capture_output=True,
        text=True,
    )

    if result.returncode != 0:
        print(f"[ERREUR SYNTAXE] {name}")
        print(result.stderr)
        return False

    print(f"[OK] syntaxe {name}")
    return True


def main():
    if not ROOT.exists():
        print(f"[ERREUR] projet introuvable : {ROOT}")
        sys.exit(1)

    for path in FILES:
        if not backup(path):
            sys.exit(1)

    if not patch_map():
        sys.exit(1)

    if not patch_player():
        sys.exit(1)

    if not all(check_js(name) for name in ("game.js", "map.js", "player.js")):
        sys.exit(1)

    print()
    print("==============================================")
    print(" CORRECTION V2 TERMINÉE")
    print("==============================================")
    print("Canvas      : plein écran")
    print("Caméra      : centrée sur le centre du joueur")
    print("Caméra      : limitée aux dimensions de la map")
    print("Spawn       : 21,69")
    print("Portail     : attaché au joueur")
    print("Joueur      : palette jaune distincte")
    print()
    print("Teste maintenant le jeu sans modifier d'autres fichiers.")


if __name__ == "__main__":
    main()
