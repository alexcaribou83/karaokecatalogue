/*=====================================================
 Alex CARIBOU Karaoké V2.1
 search.js
======================================================*/

/*
---------------------------------------
Supprime accents et majuscules
---------------------------------------
*/

function normalizeText(text){

    if(!text) return "";

    return text

        .toString()

        .toLowerCase()

        .normalize("NFD")

        .replace(/[\u0300-\u036f]/g,"")

        .trim();

}

/*
---------------------------------------
Distance de Levenshtein
---------------------------------------
*/

function levenshtein(a,b){

    a = normalizeText(a);
    b = normalizeText(b);

    const matrix=[];

    for(let i=0;i<=b.length;i++){

        matrix[i]=[i];

    }

    for(let j=0;j<=a.length;j++){

        matrix[0][j]=j;

    }

    for(let i=1;i<=b.length;i++){

        for(let j=1;j<=a.length;j++){

            if(b[i-1]===a[j-1]){

                matrix[i][j]=matrix[i-1][j-1];

            }else{

                matrix[i][j]=Math.min(

                    matrix[i-1][j]+1,

                    matrix[i][j-1]+1,

                    matrix[i-1][j-1]+1

                );

            }

        }

    }

    return matrix[b.length][a.length];

}

/*
---------------------------------------
Calcul du score
---------------------------------------
*/

function computeScore(query,song){

    query=normalizeText(query);

    const title=normalizeText(song.title);

    const artist=normalizeText(song.artist);

    let score=0;

    if(title===query) score+=1000;

    if(artist===query) score+=950;

    if(title.startsWith(query)) score+=800;

    if(artist.startsWith(query)) score+=750;

    if(title.includes(query)) score+=500;

    if(artist.includes(query)) score+=450;

    if(song.style){

        if(normalizeText(song.style).includes(query))

            score+=200;

    }

    const d1=levenshtein(query,title);

    const d2=levenshtein(query,artist);

    const best=Math.min(d1,d2);

    score+=Math.max(0,200-best*25);

    return score;

}

/*
---------------------------------------
Recherche principale
---------------------------------------
*/

function searchSongs(list,query){

    if(query.trim()==="")

        return [...list];

    return list

        .map(song=>({

            song,

            score:computeScore(query,song)

        }))

        .filter(item=>item.score>0)

        .sort((a,b)=>b.score-a.score)

        .map(item=>item.song);

}

/*
---------------------------------------
Suggestions
---------------------------------------
*/

function getSuggestions(list,query,max=8){

    if(query.length<2)

        return [];

    return searchSongs(list,query)

        .slice(0,max);

}

/*
---------------------------------------
Tri
---------------------------------------
*/

function sortSongs(list,mode){

    const data=[...list];

    switch(mode){

        case "titleAsc":

            data.sort((a,b)=>

                a.title.localeCompare(b.title)

            );

        break;

        case "titleDesc":

            data.sort((a,b)=>

                b.title.localeCompare(a.title)

            );

        break;

        case "artistAsc":

            data.sort((a,b)=>

                a.artist.localeCompare(b.artist)

            );

        break;

        case "artistDesc":

            data.sort((a,b)=>

                b.artist.localeCompare(a.artist)

            );

        break;

        case "yearAsc":

            data.sort((a,b)=>

                a.year-b.year

            );

        break;

        case "yearDesc":

            data.sort((a,b)=>

                b.year-a.year

            );

        break;

    }

    return data;

}
