/* =====================================================
   Alex Karaoke V2.1
   search.js
===================================================== */

/*
    Supprime les accents
*/
function normalizeText(text) {

    if (!text) return "";

    return text
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

}

/*
    Distance de Levenshtein
    Permet de trouver "beatl"
    -> Beatles
*/

function levenshtein(a, b) {

    a = normalizeText(a);
    b = normalizeText(b);

    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {

        for (let j = 1; j <= a.length; j++) {

            if (b.charAt(i - 1) === a.charAt(j - 1)) {

                matrix[i][j] = matrix[i - 1][j - 1];

            } else {

                matrix[i][j] = Math.min(

                    matrix[i - 1][j] + 1,

                    matrix[i][j - 1] + 1,

                    matrix[i - 1][j - 1] + 1

                );

            }

        }

    }

    return matrix[b.length][a.length];

}

/*
    Score de pertinence
*/

function getScore(query, song) {

    query = normalizeText(query);

    const title = normalizeText(song.title);

    const artist = normalizeText(song.artist);

    // Correspondance parfaite

    if (title === query) return 1000;

    if (artist === query) return 950;

    // Début du titre

    if (title.startsWith(query)) return 900;

    // Début artiste

    if (artist.startsWith(query)) return 850;

    // Contient

    if (title.includes(query)) return 800;

    if (artist.includes(query)) return 750;

    // Recherche approximative

    const d1 = levenshtein(query, title);

    const d2 = levenshtein(query, artist);

    const best = Math.min(d1, d2);

    return Math.max(0, 500 - best * 50);

}

/*
    Trie les résultats
*/

function searchSongs(list, query) {

    if (!query || query.trim() === "")
        return list;

    return list

        .map(song => ({

            song,

            score: getScore(query, song)

        }))

        .filter(item => item.score > 0)

        .sort((a, b) => b.score - a.score)

        .map(item => item.song);

}