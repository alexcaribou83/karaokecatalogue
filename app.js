/* =====================================================
   Alex CARIBOU Karaoké
   app.js
   Version simple PWA catalogue
===================================================== */

"use strict";

/* ================================
   Variables globales
================================ */

let allSongs = [];
let filteredSongs = [];

let currentPage = 1;
const songsPerPage = 50;

let favorites = JSON.parse(
    localStorage.getItem("karaokeFavorites") || "[]"
);


/* ================================
   Initialisation
================================ */

document.addEventListener("DOMContentLoaded", () => {

    loadSongs();

    setupEvents();

    displaySongs();

});


/* ================================
   Chargement catalogue
================================ */

function loadSongs() {

    if (typeof songs !== "undefined") {

        allSongs = songs;

        filteredSongs = [...allSongs];

    } else {

        console.error(
            "Le fichier songs.js n'est pas chargé."
        );

    }

}


/* ================================
   Mise en place événements
================================ */

function setupEvents() {


    const searchInput =
        document.getElementById("search");


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            () => {

                currentPage = 1;

                applyFilters();

            }
        );

    }



    const languageFilter =
        document.getElementById("languageFilter");


    if (languageFilter) {

        languageFilter.addEventListener(
            "change",
            applyFilters
        );

    }



    const styleFilter =
        document.getElementById("styleFilter");


    if (styleFilter) {

        styleFilter.addEventListener(
            "change",
            applyFilters
        );

    }



    const duoFilter =
        document.getElementById("duoFilter");


    if (duoFilter) {

        duoFilter.addEventListener(
            "change",
            applyFilters
        );

    }



    const explicitFilter =
        document.getElementById("explicitFilter");


    if (explicitFilter) {

        explicitFilter.addEventListener(
            "change",
            applyFilters
        );

    }


}



/* ================================
   Recherche + filtres
================================ */

function applyFilters() {


    const text =
        document
        .getElementById("search")
        ?.value
        .toLowerCase()
        .trim()
        || "";


    const language =
        document
        .getElementById("languageFilter")
        ?.value
        || "all";


    const style =
        document
        .getElementById("styleFilter")
        ?.value
        || "all";


    const duo =
        document
        .getElementById("duoFilter")
        ?.value
        || "all";


    const explicit =
        document
        .getElementById("explicitFilter")
        ?.value
        || "all";



    filteredSongs = allSongs.filter(song => {


        let searchOK = true;
        let languageOK = true;
        let styleOK = true;
        let duoOK = true;
        let explicitOK = true;



        if (text) {

            const content =
            (
                song.title +
                " " +
                song.artist +
                " " +
                song.style +
                " " +
                song.language
            )
            .toLowerCase();


            searchOK =
                content.includes(text);

        }



        if (language !== "all") {

            languageOK =
                song.language === language;

        }



        if (style !== "all") {

            if (Array.isArray(song.style)) {

                styleOK =
                song.style.includes(style);

            } else {

                styleOK =
                song.style === style;

            }

        }



        if (duo !== "all") {

            duoOK =
                String(song.duo)
                === duo;

        }



        if (explicit !== "all") {

            explicitOK =
                String(song.explicit)
                === explicit;

        }



        return (
            searchOK &&
            languageOK &&
            styleOK &&
            duoOK &&
            explicitOK
        );


    });


    displaySongs();

}

/* ================================
   Affichage des chansons
================================ */

function displaySongs() {


    const container =
        document.getElementById("songList");


    if (!container) {

        console.error(
            "Zone d'affichage songList introuvable."
        );

        return;

    }



    container.innerHTML = "";



    const start =
        (currentPage - 1) * songsPerPage;


    const end =
        start + songsPerPage;


    const pageSongs =
        filteredSongs.slice(start, end);



    if (pageSongs.length === 0) {

        container.innerHTML =
        `
        <div class="no-result">
            Aucun titre trouvé
        </div>
        `;

        updatePagination();

        return;

    }



    pageSongs.forEach(song => {


        const card =
        document.createElement("div");


        card.className =
            "song-card";



        const isFavorite =
            favorites.includes(song.id);



        card.innerHTML =
        `

        <div class="song-info">


            <h3>
                ${escapeHTML(song.title)}
            </h3>


            <p class="artist">
                ${escapeHTML(song.artist || "")}
            </p>


            <div class="tags">


                ${
                    song.language
                    ?
                    `<span class="tag">
                    ${song.language}
                    </span>`
                    :
                    ""
                }



                ${
                    song.style
                    ?
                    `<span class="tag">
                    ${formatstyle(song.style)}
                    </span>`
                    :
                    ""
                }



                ${
                    song.duo === true ||
                    song.duo === "true"
                    ?
                    `<span class="tag duo">
                    DUO
                    </span>`
                    :
                    ""
                }



                ${
                    song.explicit === true ||
                    song.explicit === "true"
                    ?
                    `<span class="tag explicit">
                    EXPLICIT
                    </span>`
                    :
                    ""
                }


            </div>


        </div>



        <button
            class="favorite-btn 
            ${isFavorite ? "active" : ""}"
            onclick="toggleFavorite('${song.id}')"
        >

            ${isFavorite ? "★" : "☆"}

        </button>


        `;



        container.appendChild(card);


    });



    updatePagination();

}



/* ================================
   Gestion favoris
================================ */

function toggleFavorite(id) {


    const index =
        favorites.indexOf(id);



    if (index === -1) {


        favorites.push(id);


    } else {


        favorites.splice(index, 1);


    }



    localStorage.setItem(
        "karaokeFavorites",
        JSON.stringify(favorites)
    );



    displaySongs();

}



/* ================================
   Affichage uniquement favoris
================================ */

function showFavorites() {


    filteredSongs =
        allSongs.filter(song =>
            favorites.includes(song.id)
        );


    currentPage = 1;


    displaySongs();

}



/* ================================
   Retour catalogue complet
================================ */

function showAllSongs() {


    filteredSongs =
        [...allSongs];


    currentPage = 1;


    displaySongs();

}



/* ================================
   Pagination
================================ */

function updatePagination() {


    const container =
        document.getElementById(
            "pagination"
        );


    if (!container) {

        return;

    }



    const totalPages =
        Math.ceil(
            filteredSongs.length /
            songsPerPage
        );



    if (totalPages <= 1) {


        container.innerHTML =
        "";


        return;

    }



    container.innerHTML =
    `

    <button
        onclick="changePage(${currentPage - 1})"
        ${currentPage === 1 ? "disabled" : ""}
    >
        ◀
    </button>


    <span>
        Page ${currentPage}
        / ${totalPages}
    </span>


    <button
        onclick="changePage(${currentPage + 1})"
        ${currentPage === totalPages ? "disabled" : ""}
    >
        ▶
    </button>

    `;


}



/* ================================
   Changement page
================================ */

function changePage(page) {


    const totalPages =
        Math.ceil(
            filteredSongs.length /
            songsPerPage
        );



    if (
        page < 1 ||
        page > totalPages
    ) {

        return;

    }



    currentPage = page;


    displaySongs();


    window.scrollTo(
        {
            top:0,
            behavior:"smooth"
        }
    );

}



/* ================================
   Sécurité affichage texte
================================ */

function escapeHTML(text) {


    if (!text) {

        return "";

    }


    return String(text)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}



/* ================================
   Gestion styles multiples
================================ */

function formatstyle(style) {


    if (Array.isArray(style)) {


        return style.join(", ");


    }


    return style;

}
/* ================================
   Compteur résultats
================================ */

function updateResultCount() {


    const counter =
        document.getElementById(
            "resultCount"
        );


    if (!counter) {

        return;

    }



    counter.textContent =
        `${filteredSongs.length} titre(s)`;

}



/* ================================
   Mise à jour affichage améliorée
================================ */

const originalDisplaySongs =
    displaySongs;


displaySongs = function() {

    originalDisplaySongs();

    updateResultCount();

};



/* ================================
   Raccourci clavier recherche
================================ */

document.addEventListener(
    "keydown",
    function(event) {


        if (
            event.key === "/" &&
            document.activeElement.tagName !== "INPUT"
        ) {


            event.preventDefault();


            const search =
                document.getElementById(
                    "search"
                );


            if (search) {

                search.focus();

            }


        }


    }
);



/* ================================
   Boutons principaux
================================ */

function setupMainButtons() {


    const allButton =
        document.getElementById(
            "showAll"
        );


    if (allButton) {


        allButton.addEventListener(
            "click",
            showAllSongs
        );


    }



    const favButton =
        document.getElementById(
            "showFavorites"
        );


    if (favButton) {


        favButton.addEventListener(
            "click",
            showFavorites
        );


    }


}



/* ================================
   Chargement interface
================================ */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupMainButtons();

    }
);



/* ================================
   Réinitialisation filtres
================================ */

function resetFilters() {


    const elements = [

        "search",
        "languageFilter",
        "styleFilter",
        "duoFilter",
        "explicitFilter"

    ];



    elements.forEach(id => {


        const element =
            document.getElementById(id);


        if (element) {


            if (
                element.tagName === "SELECT"
            ) {

                element.value =
                    "all";


            } else {


                element.value =
                    "";


            }


        }


    });



    filteredSongs =
        [...allSongs];


    currentPage = 1;


    displaySongs();

}



/* ================================
   Exposition fonctions globales
================================ */

window.toggleFavorite =
    toggleFavorite;


window.changePage =
    changePage;


window.showFavorites =
    showFavorites;


window.showAllSongs =
    showAllSongs;


window.resetFilters =
    resetFilters;



/* ================================
   Fin app.js
   Alex CARIBOU Karaoké
================================ */