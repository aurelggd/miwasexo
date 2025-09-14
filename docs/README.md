# Documentation Technique - Miwasexo

## 📋 Description

Miwasexo est une plateforme d'information dédiée au décryptage de l'actualité politique, économique et financière du Bénin. La plateforme offre des analyses approfondies et des insights pour aider les citoyens à mieux comprendre les enjeux actuels.

## 🏗️ Architecture Technique

### Technologies Utilisées

- **HTML5** : Structure sémantique et moderne
- **CSS3** : Styles avec variables CSS et design responsive
- **JavaScript ES6+** : Logique interactive et gestion des données
- **PWA** : Application Web Progressive avec Service Worker
- **localStorage** : Stockage des données côté client

### Structure des Fichiers

```
miwasexo/
├── index.html              # Page de redirection
├── src/
│   ├── pages/              # Pages HTML
│   │   ├── index.html      # Page d'accueil
│   │   ├── admin.html      # Interface d'administration
│   │   ├── articles.html   # Page des articles
│   │   └── setup.html      # Configuration initiale
│   ├── assets/             # Ressources statiques
│   │   ├── css/            # Feuilles de style
│   │   │   ├── styles.css              # Styles principaux
│   │   │   ├── admin-styles.css        # Styles administration
│   │   │   ├── article-styles.css      # Styles articles
│   │   │   ├── modal-styles.css        # Styles modales
│   │   │   ├── admin-login-styles.css  # Styles de connexion admin
│   │   │   └── analytics-styles.css    # Styles analytiques
│   │   ├── js/             # Scripts JavaScript
│   │   │   ├── config.js               # Configuration globale
│   │   │   ├── data-manager.js         # Gestionnaire de données
│   │   │   ├── auth.js                 # Authentification
│   │   │   ├── script.js               # Script principal
│   │   │   ├── admin-main.js           # Script administration
│   │   │   ├── admin-script.js         # Scripts admin supplémentaires
│   │   │   ├── articles-page.js        # Script page articles
│   │   │   └── sw.js                   # Service Worker
│   │   └── images/         # Images et médias
│   │       └── logo.png    # Logo Miwasexo
│   └── config/             # Configuration
│       └── manifest.json   # Manifeste PWA
├── docs/                   # Documentation
│   ├── README.md           # Ce fichier
│   └── DATA_ORGANIZATION.md # Organisation des données
└── .gitignore              # Fichiers à ignorer pour Git
```

## 🚀 Fonctionnalités

### 🌐 Interface Publique

- **Page d'accueil** : Présentation de la plateforme
- **Articles** : Affichage des décryptages
- **Navigation** : Menu responsive
- **Newsletter** : Inscription aux notifications

### 🔐 Administration

- **Configuration initiale** : Création du compte administrateur
- **Authentification** : Connexion sécurisée avec gestion des sessions
- **Gestion d'articles** : CRUD complet avec interface intuitive
- **Paramètres admin** : Modification des identifiants et informations
- **Statistiques** : Tableau de bord avec métriques
- **Interface responsive** : Accessible sur tous les appareils

### 📱 Fonctionnalités Avancées

- **PWA** : Application web progressive
- **Mode sombre** : Thème adaptatif
- **Recherche** : Système de recherche avancé
- **Favoris** : Sauvegarde d'articles
- **Analytics** : Suivi des performances

## 🛠️ Installation et Configuration

### Prérequis

- Navigateur moderne avec support ES6+
- Serveur web local (optionnel mais recommandé)

### Installation

1. **Cloner le projet**

   ```bash
   git clone [url-du-repo]
   cd miwasexo
   ```

2. **Ouvrir dans un navigateur**

   ```bash
   # Ouvrir la page d'accueil
   start index.html

   # Ou utiliser un serveur local (recommandé)
   python -m http.server 8000
   # Puis ouvrir http://localhost:8000
   ```

### Configuration Initiale

1. **Premier lancement** : Ouvrir `index.html` → Redirection automatique vers `src/pages/setup.html`
2. **Création du compte** : Remplir le formulaire de configuration initiale
3. **Accès admin** : Utiliser les identifiants créés pour accéder à l'administration

## 🔧 Gestion des Données

### DataManager

Le système utilise un gestionnaire de données centralisé (`data-manager.js`) qui gère :

- **Articles** : CRUD complet avec validation
- **Analytiques** : Suivi des statistiques
- **Paramètres** : Configuration de l'application
- **Sessions** : Gestion des utilisateurs connectés

### Stockage Local

Les données sont stockées dans le `localStorage` du navigateur :

```javascript
// Clés de stockage
const STORAGE_KEYS = {
  ARTICLES: "miwasexo-articles",
  ANALYTICS: "miwasexo-analytics",
  SETTINGS: "miwasexo-settings",
  ADMIN_CREDENTIALS: "miwasexo-admin-credentials",
};
```

### Structure des Données

#### Articles

```javascript
{
    id: "unique-id",
    title: "Titre de l'article",
    summary: "Résumé court",
    content: "Contenu complet",
    category: "politique|economie|societe|international|finance",
    status: "draft|published|archived",
    author: "Nom de l'auteur",
    publishDate: "2024-01-01",
    views: 0,
    tags: ["tag1", "tag2"],
    image: "url-de-l-image"
}
```

#### Analytiques

```javascript
{
    totalViews: 0,
    totalArticles: 0,
    categoryStats: {
        politique: { count: 0, views: 0 },
        economie: { count: 0, views: 0 },
        // ...
    },
    popularArticles: [],
    monthlyData: []
}
```

## 🔒 Sécurité

### Authentification

- **Chiffrement des mots de passe** : Hachage côté client
- **Sessions sécurisées** : Gestion des timeouts
- **Limitation des tentatives** : Protection contre les attaques par force brute

### Validation des Données

- **Validation côté client** : Vérification des entrées utilisateur
- **Sanitisation** : Nettoyage des données avant stockage
- **Contrôles d'accès** : Vérification des permissions

## 📱 PWA (Progressive Web App)

### Service Worker

Le service worker (`sw.js`) gère :

- **Cache des ressources** : Mise en cache des fichiers statiques
- **Mode hors ligne** : Fonctionnement sans connexion
- **Notifications** : Alertes push (si configurées)

### Manifest

Le fichier `manifest.json` définit :

- **Nom et icônes** : Métadonnées de l'application
- **Thème** : Couleurs et apparence
- **Mode d'affichage** : Comportement de l'application

## 🎨 Design et UX

### Système de Design

- **Variables CSS** : Couleurs et espacements centralisés
- **Responsive Design** : Adaptation à tous les écrans
- **Accessibilité** : Respect des standards WCAG
- **Performance** : Optimisation des temps de chargement

### Composants

- **Modales** : Fenêtres popup pour les actions
- **Formulaires** : Validation en temps réel
- **Navigation** : Menu responsive et intuitif
- **Cartes** : Affichage des articles

## 🚀 Déploiement

### Déploiement Simple

1. **Copier les fichiers** vers le serveur web
2. **Configurer HTTPS** (recommandé)
3. **Tester** toutes les fonctionnalités

### GitHub Pages

1. **Activer GitHub Pages** dans les paramètres
2. **Choisir la branche** `main`
3. **Accéder** via l'URL générée

## 🔍 Maintenance

### Sauvegarde des Données

- **Export automatique** : Fonction d'export dans l'admin
- **Import de données** : Restauration depuis un fichier
- **Sauvegarde manuelle** : Copie du localStorage

### Mise à Jour

- **Versioning** : Suivi des versions dans le code
- **Migration** : Gestion des changements de structure
- **Tests** : Vérification après chaque mise à jour

## 📊 Performance

### Optimisations

- **Lazy Loading** : Chargement différé des images
- **Minification** : Compression des fichiers CSS/JS
- **Cache** : Mise en cache des ressources statiques
- **CDN** : Utilisation d'un CDN pour les assets

### Monitoring

- **Analytics intégrés** : Suivi des performances
- **Logs d'erreur** : Gestion des erreurs JavaScript
- **Métriques** : Temps de chargement et interactions

---

**Note** : Cette documentation est mise à jour régulièrement. Pour toute question technique, consultez le code source ou créez une issue sur GitHub.
