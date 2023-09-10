/* eslint-disable no-restricted-globals */

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';
import { Workbox } from 'workbox-window'; // import Workbox library for auto-updates

clientsClaim();

// Precache all of the assets generated by your build process.
// Their URLs are injected into the manifest variable below.
precacheAndRoute(self.__WB_MANIFEST);

// Set up App Shell-style routing, so that all navigation requests
// are fulfilled with your index.html shell.
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
    ({ request, url }) => {
        // If this isn't a navigation, skip.
        if (request.mode !== 'navigate') {
            return false;
        }
        // If this is a URL that starts with /_, skip.
        if (url.pathname.startsWith('/_')) {
            return false;
        }
        // If this looks like a URL for a resource, because it contains
        // a file extension, skip.
        if (url.pathname.match(fileExtensionRegexp)) {
            return false;
        }
        // Return true to signal that we want to use the handler.
        return true;
    },
    createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
);

// An example runtime caching route for requests that aren't handled by the
// precache, in this case same-origin .png requests like those from in public/
registerRoute(
    ({ url }) =>
        url.origin === self.location.origin && url.pathname.endsWith('.png'),
    new StaleWhileRevalidate({
        cacheName: 'images',
        plugins: [
            // Ensure that once this runtime cache reaches a maximum size the
            // least-recently used images are removed.
            new ExpirationPlugin({ maxEntries: 50 }),
        ],
    })
);

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Add event listener for service worker updates using Workbox library
self.addEventListener('load', () => {
    const wb = new Workbox('/service-worker.js');
    wb.addEventListener('waiting', () => {
        // When a new service worker is waiting, prompt the user to update.
        if (window.confirm('A new version is available! Do you want to update?')) {
            wb.addEventListener('controlling', () => {
                window.location.reload();
            });
            // Send a message to the waiting service worker to activate it.
            wb.messageSW({ type: 'SKIP_WAITING' });
        }
    });
    wb.register();
});