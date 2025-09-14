// Service Worker pour Miwasexo
const CACHE_NAME = 'miwasexo-v1.0.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/articles.html',
    '/admin.html',
    '/css/styles.css',
    '/css/admin-styles.css',
    '/css/article-styles.css',
    '/css/modal-styles.css',
    '/css/admin-login-styles.css',
    '/js/config.js',
    '/js/auth.js',
    '/js/script.js',
    '/js/admin-main.js',
    '/js/admin-script.js',
    '/js/articles-page.js',
    '/assets/images/logo.png',
    '/manifest.json',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker: Installation en cours...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('📦 Service Worker: Cache ouvert');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('✅ Service Worker: Installation terminée');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('❌ Service Worker: Erreur lors de l\'installation:', error);
            })
    );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
    console.log('🚀 Service Worker: Activation en cours...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ Service Worker: Suppression de l\'ancien cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('✅ Service Worker: Activation terminée');
            return self.clients.claim();
        })
    );
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
    // Ignorer les requêtes non-GET
    if (event.request.method !== 'GET') {
        return;
    }
    
    // Ignorer les requêtes vers des domaines externes (sauf CDN)
    const url = new URL(event.request.url);
    if (url.origin !== location.origin && 
        !url.hostname.includes('fonts.googleapis.com') && 
        !url.hostname.includes('cdnjs.cloudflare.com') &&
        !url.hostname.includes('images.unsplash.com')) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Retourner la réponse du cache si disponible
                if (response) {
                    console.log('📦 Service Worker: Ressource servie depuis le cache:', event.request.url);
                    return response;
                }
                
                // Sinon, faire la requête réseau
                console.log('🌐 Service Worker: Requête réseau:', event.request.url);
                return fetch(event.request).then((response) => {
                    // Vérifier si la réponse est valide
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    // Cloner la réponse pour la mettre en cache
                    const responseToCache = response.clone();
                    
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                    
                    return response;
                }).catch((error) => {
                    console.error('❌ Service Worker: Erreur de requête:', error);
                    
                    // Retourner une page d'erreur personnalisée pour les pages HTML
                    if (event.request.destination === 'document') {
                        return caches.match('/index.html');
                    }
                    
                    throw error;
                });
            })
    );
});

// Gestion des messages du client
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
});

// Gestion des notifications push (pour futures fonctionnalités)
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/assets/images/logo.png',
            badge: '/assets/images/logo.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: 1
            },
            actions: [
                {
                    action: 'explore',
                    title: 'Voir l\'article',
                    icon: '/assets/images/logo.png'
                },
                {
                    action: 'close',
                    title: 'Fermer',
                    icon: '/assets/images/logo.png'
                }
            ]
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/articles.html')
        );
    }
});

console.log('🔧 Service Worker: Script chargé');
