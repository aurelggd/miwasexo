// Configuration de l'application Miwasexo
// Ce fichier contient la configuration publique (non sensible)

const appConfig = {
    // Informations de l'application
    app: {
        name: 'Miwasexo',
        version: '1.0.0',
        description: 'Décryptage de l\'actualité politique, économique et financière',
        author: 'Équipe Miwasexo',
        url: window.location.origin,
        environment: 'production' // development, staging, production
    },

    // Configuration des articles
    articles: {
        // Catégories disponibles
        categories: {
            'politique': {
                name: 'Politique',
                icon: 'landmark',
                color: '#3b82f6',
                description: 'Actualités et analyses politiques'
            },
            'economie': {
                name: 'Économie',
                icon: 'chart-line',
                color: '#10b981',
                description: 'Économie et finances publiques'
            },
            'societe': {
                name: 'Société',
                icon: 'users',
                color: '#f59e0b',
                description: 'Questions sociales et sociétales'
            },
            'international': {
                name: 'International',
                icon: 'globe',
                color: '#8b5cf6',
                description: 'Actualités internationales'
            },
            'finance': {
                name: 'Finance',
                icon: 'coins',
                color: '#ef4444',
                description: 'Marchés financiers et investissements'
            }
        },

        // Configuration des articles
        settings: {
            maxTitleLength: 100,
            maxSummaryLength: 200,
            maxContentLength: 10000,
            maxTagsCount: 10,
            maxImageSize: 5 * 1024 * 1024, // 5MB
            allowedImageTypes: ['jpg', 'jpeg', 'png', 'webp'],
            autoSaveInterval: 30000, // 30 secondes
            defaultStatus: 'draft'
        },

        // Configuration de l'affichage
        display: {
            itemsPerPage: 12,
            maxExcerptLength: 150,
            showAuthor: true,
            showDate: true,
            showViews: true,
            showTags: true
        }
    },

    // Configuration de l'interface utilisateur
    ui: {
        // Thème
        theme: {
            primary: '#3b82f6',
            secondary: '#64748b',
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#06b6d4'
        },

        // Configuration responsive
        breakpoints: {
            mobile: 768,
            tablet: 1024,
            desktop: 1200
        },

        // Configuration des animations
        animations: {
            duration: 300,
            easing: 'ease-in-out',
            enabled: true
        },

        // Configuration des notifications
        notifications: {
            duration: 5000,
            position: 'top-right',
            maxVisible: 5
        }
    },

    // Configuration de l'administration
    admin: {
        // Configuration des sessions
        session: {
            timeout: 24 * 60 * 60 * 1000, // 24 heures
            maxLoginAttempts: 5,
            lockoutDuration: 15 * 60 * 1000 // 15 minutes
        },

        // Configuration des statistiques
        analytics: {
            refreshInterval: 60000, // 1 minute
            maxDataPoints: 30,
            chartColors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
        },

        // Configuration des exports
        export: {
            formats: ['json', 'csv'],
            maxFileSize: 10 * 1024 * 1024, // 10MB
            compression: true
        }
    },

    // Configuration des médias
    media: {
        // Configuration des images
        images: {
            maxWidth: 1920,
            maxHeight: 1080,
            quality: 85,
            generateThumbnails: true,
            thumbnailSize: 300,
            placeholder: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vbiBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg=='
        },

        // Configuration des fichiers
        files: {
            maxSize: 10 * 1024 * 1024, // 10MB
            allowedTypes: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'pdf', 'doc', 'docx'],
            uploadPath: '/uploads/'
        }
    },

    // Configuration de la sécurité
    security: {
        // Configuration CORS
        cors: {
            allowedOrigins: [
                window.location.origin,
                'http://localhost:3000',
                'https://miwasexo.com'
            ]
        },

        // Configuration des headers de sécurité
        headers: {
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block'
        },

        // Configuration de la validation
        validation: {
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            url: /^https?:\/\/.+/,
            phone: /^[\+]?[1-9][\d]{0,15}$/
        }
    },

    // Configuration des fonctionnalités
    features: {
        // Fonctionnalités activées
        enabled: {
            analytics: true,
            search: true,
            filters: true,
            comments: false,
            newsletter: true,
            socialSharing: true,
            darkMode: false,
            offlineMode: true
        },

        // Configuration des fonctionnalités
        settings: {
            search: {
                minQueryLength: 2,
                maxResults: 50,
                highlightMatches: true
            },
            newsletter: {
                doubleOptIn: true,
                confirmationEmail: true
            },
            socialSharing: {
                platforms: ['facebook', 'twitter', 'linkedin', 'whatsapp']
            }
        }
    },

    // Configuration des erreurs
    errors: {
        // Messages d'erreur
        messages: {
            network: 'Erreur de connexion. Vérifiez votre connexion internet.',
            server: 'Erreur du serveur. Veuillez réessayer plus tard.',
            notFound: 'Ressource non trouvée.',
            unauthorized: 'Accès non autorisé.',
            forbidden: 'Accès interdit.',
            validation: 'Données invalides.',
            timeout: 'Délai d\'attente dépassé.'
        },

        // Configuration du retry
        retry: {
            maxAttempts: 3,
            delay: 1000,
            backoff: 2
        }
    },

    // Configuration du cache
    cache: {
        // Configuration du cache local
        local: {
            enabled: true,
            maxSize: 50 * 1024 * 1024, // 50MB
            ttl: 24 * 60 * 60 * 1000 // 24 heures
        },

        // Configuration du cache des articles
        articles: {
            ttl: 60 * 60 * 1000, // 1 heure
            maxItems: 100
        },

        // Configuration du cache des images
        images: {
            ttl: 7 * 24 * 60 * 60 * 1000, // 7 jours
            maxSize: 10 * 1024 * 1024 // 10MB
        }
    }
};

// Fonction pour obtenir une valeur de configuration
function getConfig(path, defaultValue = null) {
    return path.split('.').reduce((obj, key) => {
        return obj && obj[key] !== undefined ? obj[key] : defaultValue;
    }, appConfig);
}

// Fonction pour vérifier si une fonctionnalité est activée
function isFeatureEnabled(feature) {
    return getConfig(`features.enabled.${feature}`, false);
}

// Fonction pour obtenir la configuration d'une catégorie
function getCategoryConfig(category) {
    return getConfig(`articles.categories.${category}`, {
        name: category,
        icon: 'newspaper',
        color: '#64748b',
        description: 'Catégorie générale'
    });
}

// Export de la configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { appConfig, getConfig, isFeatureEnabled, getCategoryConfig };
} else {
    window.appConfig = appConfig;
    window.getConfig = getConfig;
    window.isFeatureEnabled = isFeatureEnabled;
    window.getCategoryConfig = getCategoryConfig;
}