/* =====================================================
   Alex Karaoke V2.1
   Service Worker
===================================================== */

"use strict";

const CACHE_NAME = "alex-karaoke-v2.1.0";

const APP_FILES = [
    "./",
    "./index.html",
    "./style.css",
    "./config.js",
    "./search.js",
    "./app.js",
    "./songs.js",
    "./manifest.json",
    "./icons/icon-192.png",
    "./icons/icon-512.png"
];


/* =====================================================
   INSTALLATION
===================================================== */

self.addEventListener("install", event => {

    event.waitUntil(

        caches
            .open(CACHE_NAME)
            .then(cache => cache.addAll(APP_FILES))

    );

    self.skipWaiting();

});


/* =====================================================
   ACTIVATION
===================================================== */

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(keys =>

            Promise.all(

                keys.map(key => {

                    if (key !== CACHE_NAME) {

                        return caches.delete(key);

                    }

                })

            )

        )

    );

    self.clients.claim();

});


/* =====================================================
   FETCH
===================================================== */

self.addEventListener("fetch", event => {

    if (event.request.method !== "GET") return;

    event.respondWith(

        caches.match(event.request)

        .then(response => {

            if (response) {

                return response;

            }

            return fetch(event.request)

                .then(networkResponse => {

                    const copy = networkResponse.clone();

                    caches.open(CACHE_NAME)

                        .then(cache => {

                            cache.put(event.request, copy);

                        });

                    return networkResponse;

                })

                .catch(() => {

                    return caches.match("./index.html");

                });

        })

    );

});