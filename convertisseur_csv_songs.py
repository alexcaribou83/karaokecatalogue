# ==========================================
# Alex Karaoke V2
# Convertisseur CSV -> songs.js
# ==========================================

import csv
import json
import unicodedata
from pathlib import Path


# -------------------------------
# Configuration
# -------------------------------

CSV_FILE = "karoke catalogue.csv"

OUTPUT_FILE = "songs.js"


LANGUES_INTERDITES = [
    "arabe",
    "arabic",
    "roumain",
    "romanian",
    "turc",
    "turkish",
    "finnois",
    "finnish"
]


# -------------------------------
# Nettoyage texte
# -------------------------------

def clean(text):

    if not text:
        return ""

    return (
        text
        .strip()
    )


def normalize(text):

    if not text:
        return ""

    text = (
        unicodedata
        .normalize("NFD", text)
        .encode("ascii", "ignore")
        .decode("utf-8")
        .lower()
    )

    return text


# -------------------------------
# Vérification langue
# -------------------------------

def langue_interdite(langue):

    langue = normalize(langue)

    for l in LANGUES_INTERDITES:

        if l in langue:
            return True

    return False


# -------------------------------
# Lecture CSV
# -------------------------------

songs = []

seen = set()


with open(
    CSV_FILE,
    "r",
    encoding="utf-8-sig"
) as file:


    reader = csv.DictReader(file)


    for row in reader:


        titre = clean(
            row.get("title")
            or row.get("Titre")
        )


        artiste = clean(
            row.get("artist")
            or row.get("Artiste")
        )


        langue = clean(
            row.get("language")
            or row.get("Langue")
        )


        style = clean(
            row.get("style")
            or row.get("Style")
        )


        annee = clean(
            row.get("year")
            or row.get("Année")
        )


        duo = clean(
            row.get("duo")
            or row.get("Duo")
        )


        explicite = clean(
            row.get("explicit")
            or row.get("Explicite")
        )



        # suppression langues interdites

        if langue_interdite(langue):
            continue



        # suppression doublons

        key = (
            normalize(titre),
            normalize(artiste)
        )


        if key in seen:
            continue


        seen.add(key)



        song = {


            "id": len(songs)+1,


            "title": titre,


            "artist": artiste,


            "language": langue,


            "style": style,


            "year": int(annee)
            if annee.isdigit()
            else "",


            "duo":
                normalize(duo)
                in [
                    "oui",
                    "yes",
                    "true",
                    "1"
                ],


            "explicit":
                normalize(explicite)
                in [
                    "oui",
                    "yes",
                    "true",
                    "1"
                ]

        }


        songs.append(song)



# -------------------------------
# Tri
# -------------------------------

songs.sort(
    key=lambda x:
    normalize(x["title"])
)



# -------------------------------
# Création songs.js
# -------------------------------


content = """

// =======================================
// Alex Karaoke V2
// Catalogue chansons généré automatiquement
// =======================================


const songs = 

"""


content += json.dumps(
    songs,
    ensure_ascii=False,
    indent=4
)


content += ";\n"



Path(
    OUTPUT_FILE
).write_text(
    content,
    encoding="utf-8"
)



print(
    "Conversion terminée !"
)

print(
    len(songs),
    "chansons générées."
)

print(
    "Fichier créé :",
    OUTPUT_FILE
)
