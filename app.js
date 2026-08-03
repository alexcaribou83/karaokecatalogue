// =======================================
// Alex Karaoke V2
// app.js
// =======================================

const ITEMS_PER_PAGE = 24;

let filteredSongs = [];
let currentPage = 1;

// langues à masquer
const hiddenLanguages = [
    "Arabic",
    "Romanian",
    "Turkish",
    "Finnish"
];

// éléments HTML
const searchInput = document.getElementById("search");
const songsContainer = document.getElementById("songs");
const languageFilter = document.getElementById("languageFilter");
const styleFilter = document.getElementById("styleFilter");
const artistFilter = document.getElementById("artistFilter");
const duoOnly = document.getElementById("duoOnly");
const hideExplicit = document.getElementById("hideExplicit");
const pagination = document.getElementById("pagination");
const songCount = document.getElementById("songCount");

// -----------------------------

function normalize(text){

    if(!text) return "";

    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g,"");

}

// -----------------------------

function unique(field){

    let values=[...new Set(
        songs
        .map(s=>s[field])
        .filter(v=>v)
    )];

    values.sort();

    return values;

}

// -----------------------------

function populateFilters(){

    unique("language")
    .filter(lang=>!hiddenLanguages.includes(lang))
    .forEach(lang=>{

        let option=document.createElement("option");

        option.value=lang;

        option.textContent=lang;

        languageFilter.appendChild(option);

    });

    unique("style").forEach(style=>{

        let option=document.createElement("option");

        option.value=style;

        option.textContent=style;

        styleFilter.appendChild(option);

    });

    unique("artist").forEach(artist=>{

        let option=document.createElement("option");

        option.value=artist;

        option.textContent=artist;

        artistFilter.appendChild(option);

    });

}

// -----------------------------

function filterSongs(){

    const search=normalize(searchInput.value);

    filteredSongs=songs.filter(song=>{

        if(hiddenLanguages.includes(song.language))
            return false;

        if(hideExplicit.checked && song.explicit)
            return false;

        if(duoOnly.checked && !song.duo)
            return false;

        if(languageFilter.value &&
            song.language!==languageFilter.value)
            return false;

        if(styleFilter.value &&
            song.style!==styleFilter.value)
            return false;

        if(artistFilter.value &&
            song.artist!==artistFilter.value)
            return false;

        const title=normalize(song.title);

        const artist=normalize(song.artist);

        return(
            title.includes(search) ||
            artist.includes(search)
        );

    });

    currentPage=1;

    render();

}

// -----------------------------

function render(){

    songsContainer.innerHTML="";

    songCount.textContent=
        filteredSongs.length+" chanson(s)";

    const start=(currentPage-1)*ITEMS_PER_PAGE;

    const end=start+ITEMS_PER_PAGE;

    const pageSongs=
        filteredSongs.slice(start,end);

    pageSongs.forEach(song=>{

        const card=document.createElement("div");

        card.className="song";

        card.innerHTML=`

            <h2>${song.title}</h2>

            <div class="artist">

                👤 ${song.artist}

            </div>

            <div class="info">

                <span class="badge">
                🌍 ${song.language}
                </span>

                <span class="badge">
                🎵 ${song.style}
                </span>

                <span class="badge">
                📅 ${song.year}
                </span>

                ${
                    song.duo
                    ?
                    '<span class="badge">👥 Duo</span>'
                    :
                    ''
                }

            </div>

        `;

        songsContainer.appendChild(card);

    });

    renderPagination();

}

// -----------------------------

function renderPagination(){

    pagination.innerHTML="";

    const pages=
    Math.ceil(
        filteredSongs.length/
        ITEMS_PER_PAGE
    );

    for(let i=1;i<=pages;i++){

        const button=
        document.createElement("button");

        button.textContent=i;

        if(i===currentPage){

            button.style.background="#ff2f55";

        }

        button.onclick=()=>{

            currentPage=i;

            render();

            window.scrollTo({

                top:0,

                behavior:"smooth"

            });

        };

        pagination.appendChild(button);

    }

}

// -----------------------------

searchInput.addEventListener(
    "input",
    filterSongs
);

languageFilter.addEventListener(
    "change",
    filterSongs
);

styleFilter.addEventListener(
    "change",
    filterSongs
);

artistFilter.addEventListener(
    "change",
    filterSongs
);

duoOnly.addEventListener(
    "change",
    filterSongs
);

hideExplicit.addEventListener(
    "change",
    filterSongs
);

// -----------------------------

populateFilters();

filteredSongs=songs;

render();
