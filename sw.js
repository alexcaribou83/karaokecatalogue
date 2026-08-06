/* =====================================================
   Alex CARIBOU Karaoké
   sw.js
===================================================== */


"use strict";


const CACHE_NAME =
    "alex-caribou-karaoke-v2.1";



const FILES_TO_CACHE = [


    "./",

    "./index.html",

    "./style.css",

    "./app.js",

    "./config.js",

    "./songs.js",

    "./manifest.json"



];



/* ================================
   Installation
================================ */

self.addEventListener(
    "install",
    event => {


        event.waitUntil(

            caches.open(
                CACHE_NAME
            )
            .then(cache => {


                return cache.addAll(
                    FILES_TO_CACHE
                );


            })

        );


        self.skipWaiting();


    }

);




/* ================================
   Activation
================================ */

self.addEventListener(
    "activate",
    event => {


        event.waitUntil(

            caches.keys()
            .then(keys => {


                return Promise.all(

                    keys.map(key => {


                        if (
                            key !== CACHE_NAME
                        ) {


                            return caches.delete(
                                key
                            );


                        }


                    })

                );


            })

        );


        self.clients.claim();


    }

);




/* ================================
   Gestion requêtes
================================ */

self.addEventListener(
    "fetch",
    event => {


        event.respondWith(

            caches.match(
                event.request
            )
            .then(response => {


                return response ||

                fetch(
                    event.request
                )
                .then(networkResponse => {


                    return caches.open(
                        CACHE_NAME
                    )
                    .then(cache => {


                        cache.put(

                            event.request,

                            networkResponse.clone()

                        );


                        return networkResponse;


                    });


                });


            })
            .catch(() => {


                return caches.match(
                    "./index.html"
                );


            })


        );


    }

);