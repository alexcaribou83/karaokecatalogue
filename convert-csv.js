/* =====================================================
   Alex CARIBOU Karaoké V2.1
   Convertisseur CSV -> songs.js
===================================================== */

"use strict";

const fs = require("fs");
const path = require("path");


const INPUT_FILE = "karaoke catalogue.csv";
const OUTPUT_FILE = "songs.js";



/*
=====================================================
Lecture CSV
=====================================================
*/

function parseCSV(text) {

    const lines = text.split(/\r?\n/);

    const headers = lines.shift()
        .split(";")
        .map(h => h.trim());


    return lines
        .filter(line => line.trim() !== "")
        .map(line => {

            const values = line.split(";");

            let obj = {};

            headers.forEach((header,index)=>{

                obj[header] = values[index]
                    ? values[index].trim()
                    : "";

            });


            return obj;

        });

}



/*
=====================================================
Nettoyage texte
=====================================================
*/

function clean(text){

    if(!text) return "";

    return text
        .replace(/"/g,"'")
        .replace(/\r/g,"")
        .replace(/\n/g," ")
        .trim();

}



/*
=====================================================
Conversion
=====================================================
*/

console.log("Conversion du catalogue...");



const csv = fs.readFileSync(INPUT_FILE,"utf8");


const rows = parseCSV(csv);



const songs = rows.map((song,index)=>{


    return {


        id:index+1,


        title:
            clean(
                song.Titre ||
                song.Title ||
                song.titre
            ),


        artist:
            clean(
                song.Artiste ||
                song.Artist ||
                song.artiste
            ),


        year:
            clean(
                song.Annee ||
                song.Year ||
                song.annee
            ),

language:
    clean(
        song.Languages ||
        song.Languages ||
        song.Language ||
        song.Langue ||
        "FR"
    ),

category:
    clean(
        song.Style ||
        song.Category ||
        ""
    ),


duo:
    (
        song.Duo === "1" ||
        song.DUO === "1" ||
        song.duo === "1"
    ),


favorite:false
    };


});



/*
=====================================================
Création songs.js
=====================================================
*/


const output =
`/* =====================================================
   Alex CARIBOU Karaoké V2.1
   Catalogue chansons
   Généré automatiquement
===================================================== */


const songs = ${JSON.stringify(
    songs,
    null,
    4
)};


`;



fs.writeFileSync(
    OUTPUT_FILE,
    output,
    "utf8"
);



console.log(
    "✅ Conversion terminée : songs.js créé"
);

console.log(
    "🎤 Nombre de titres :",
    songs.length
);
