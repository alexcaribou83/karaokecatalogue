//* =====================================================
   Alex Karaoke V2.1
   app.js
===================================================== *//

"use strict";

//* =====================================================
   VARIABLES
===================================================== *//

let allSongs = [];
let filteredSongs = [];

let currentPage = 1;

const favorites = new Set(
    JSON.parse(localStorage.getItem("favorites") || "[]")
);

//* =====================================================
   ELEMENTS HTML
===================================================== *//

const searchInput      = document.getElementById("search");
const languageFilter   = document.getElementById("languageFilter");
const styleFilter      = document.getElementById("styleFilter");
const artistFilter     = document.getElementById("artistFilter");

const duoOnly          = document.getElementById("duoOnly");
const hideExplicit     = document.getElementById("hideExplicit");

const songsContainer   = document.getElementById("songs");
const pagination       = document.getElementById("pagination");
const songCount        = document.getElementById("songCount");

//* =====================================================
   CONFIGURATION
===================================================== *//

const ITEMS_PER_PAGE = CONFIG.songsPerPage;

//* =====================================================
   DRAPEAUX
===================================================== *//

function getFlag(language){

    return CONFIG.flags[language] || "🌍";

}

//* =====================================================
   NORMALISATION
===================================================== *//

function normalize(text){

    if(!text) return "";

    return text

        .toLowerCase()

        .normalize("NFD")

        .replace(/[\u0300-\u036f]/g,"")

        .trim();

}

//* =====================================================
   FAVORIS
===================================================== *//

function isFavorite(song){

    return favorites.has(

        song.artist + "|" + song.title

    );

}

function toggleFavorite(song){

    const id = song.artist + "|" + song.title;

    if(favorites.has(id))

        favorites.delete(id);

    else

        favorites.add(id);

    localStorage.setItem(

        "favorites",

        JSON.stringify([...favorites])

    );

}

//* =====================================================
   INITIALISATION
===================================================== *//

function init(){

    document.title = CONFIG.appName;

    allSongs = songs.filter(song=>{

        return CONFIG.allowedLanguages.includes(

            song.language

        );

    });

    filteredSongs = [...allSongs];

    populateFilters();

    render();

}

//* =====================================================
   LISTES UNIQUES
===================================================== *//

function unique(field){

    return [...new Set(

        allSongs

        .map(s=>s[field])

        .filter(Boolean)

    )]

    .sort();

}

//* =====================================================
   REMPLISSAGE DES FILTRES
===================================================== *//

function populateFilters(){

    unique("language")

    .forEach(lang=>{

        const option = document.createElement("option");

        option.value = lang;

        option.textContent =

            getFlag(lang) + " " + lang;

        languageFilter.appendChild(option);

    });

    unique("style")

    .forEach(style=>{

        const option = document.createElement("option");

        option.value = style;

        option.textContent = style;

        styleFilter.appendChild(option);

    });

    unique("artist")

    .forEach(artist=>{

        const option = document.createElement("option");

        option.value = artist;

        option.textContent = artist;

        artistFilter.appendChild(option);

    });

}

//* =====================================================
   EVENEMENTS
===================================================== *//

searchInput.addEventListener("input",applyFilters);

languageFilter.addEventListener("change",applyFilters);

styleFilter.addEventListener("change",applyFilters);

artistFilter.addEventListener("change",applyFilters);

duoOnly.addEventListener("change",applyFilters);

hideExplicit.addEventListener("change",applyFilters);

//* =====================================================
   LANCEMENT
===================================================== *//

init();
