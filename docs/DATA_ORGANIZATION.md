# Organisation des Données - Miwasexo

## Vue d'ensemble

Le système Miwasexo utilise une architecture de gestion des données centralisée pour organiser efficacement les informations entre les sessions Articles, Analytiques et Paramètres.

## Architecture des Données

### 1. DataManager (Gestionnaire Central)

Le `DataManager` est la classe principale qui gère toutes les données de l'application :

```javascript
// Instance globale
window.dataManager = new DataManager();
```

#### Clés de stockage :

- `miwasexo-articles` : Articles et contenu
- `miwasexo-analytics` : Statistiques et métriques
- `miwasexo-settings` : Configuration et paramètres
- `miwasexo-admin-credentials` : Identifiants administrateur
- `miwasexo-session-data` : Données de session utilisateur

### 2. Structure des Articles

```javascript
{
    id: "article_1234567890",
    title: "Titre de l'article",
    category: "politique", // politique, economie, societe, international, finance
    author: "Nom de l'auteur",
    image: "URL ou base64 de l'image",
    summary: "Résumé court",
    content: "Contenu complet",
    tags: ["tag1", "tag2"],
    date: "2024-01-01T00:00:00.000Z",
    views: 0,
    status: "published", // published, draft, archived
    featured: false
}
```

### 3. Structure des Analytiques

```javascript
{
    totalViews: 0,
    totalArticles: 0,
    uniqueVisitors: 0,
    monthlyStats: {
        views: 0,
        articles: 0,
        visitors: 0
    },
    categoryStats: {
        politique: { articles: 0, views: 0 },
        economie: { articles: 0, views: 0 },
        societe: { articles: 0, views: 0 },
        international: { articles: 0, views: 0 }
    },
    dailyStats: {},
    lastUpdated: "2024-01-01T00:00:00.000Z"
}
```

### 4. Structure des Paramètres

```javascript
{
    site: {
        name: "Miwasexo",
        description: "Description du site",
        logo: "URL du logo",
        theme: "default",
        language: "fr"
    },
    admin: {
        notifications: true,
        autoSave: true,
        backupFrequency: "daily",
        analyticsEnabled: true
    },
    articles: {
        defaultCategory: "politique",
        autoPublish: false,
        maxImageSize: 5, // MB
        allowedImageTypes: ["jpg", "jpeg", "png", "webp"]
    },
    analytics: {
        trackViews: true,
        trackVisitors: true,
        retentionDays: 365
    }
}
```

## Sessions et Navigation

### 1. Session Articles

- **Fichier principal** : `admin-main.js`
- **Fonctionnalités** :
  - CRUD des articles (Créer, Lire, Modifier, Supprimer)
  - Filtrage et recherche
  - Gestion des images
  - Statistiques en temps réel

### 2. Session Analytiques

- **Fichier principal** : `admin-main.js` (fonctions analytiques)
- **Fonctionnalités** :
  - Statistiques globales
  - Performance par catégorie
  - Articles les plus populaires
  - Graphiques temporels (en développement)
  - Export des données

### 3. Session Paramètres

- **Fichier principal** : `admin-main.js` (fonctions paramètres)
- **Fonctionnalités** :
  - Configuration du site
  - Paramètres des articles
  - Gestion du compte administrateur
  - Sauvegarde et restauration

## Synchronisation entre Sessions

### 1. Événements de Données

Le système utilise des événements personnalisés pour synchroniser les données :

```javascript
// Événement déclenché lors de changements
window.dispatchEvent(
  new CustomEvent("dataChanged", {
    detail: { type, data, timestamp },
  })
);

// Événements spécifiques
window.dispatchEvent(new CustomEvent("articlesUpdated"));
window.dispatchEvent(new CustomEvent("analyticsUpdated"));
window.dispatchEvent(new CustomEvent("settingsUpdated"));
```

### 2. Écoute des Changements

Chaque session écoute les changements de données :

```javascript
// Dans admin-main.js
window.addEventListener("dataChanged", (event) => {
  handleDataChange(event.detail);
});

// Dans articles-page.js
window.addEventListener("dataChanged", (event) => {
  const { type } = event.detail;
  if (type === "miwasexo-articles") {
    this.loadArticles();
  }
});
```

### 3. Persistance des Données

- **localStorage** : Stockage principal des données
- **Synchronisation** : Mise à jour automatique entre onglets
- **Sauvegarde** : Export/Import des données complètes

## Fonctionnalités Avancées

### 1. Gestion des Vues

```javascript
// Incrémentation automatique des vues
dataManager.incrementArticleViews(articleId);
```

### 2. Statistiques en Temps Réel

```javascript
// Mise à jour automatique des statistiques
const globalStats = dataManager.getGlobalStats();
```

### 3. Export/Import

```javascript
// Export complet des données
dataManager.exportData();

// Import depuis un fichier
dataManager.importData(file);
```

## Utilisation

### 1. Initialisation

```javascript
// Le DataManager s'initialise automatiquement
// Vérification de disponibilité
if (window.dataManager) {
  // Utiliser le DataManager
} else {
  // Fallback vers localStorage direct
}
```

### 2. Opérations CRUD

```javascript
// Créer un article
dataManager.addArticle(articleData);

// Lire un article
const article = dataManager.getArticle(articleId);

// Modifier un article
dataManager.updateArticle(articleId, updates);

// Supprimer un article
dataManager.deleteArticle(articleId);
```

### 3. Gestion des Paramètres

```javascript
// Lire un paramètre
const value = dataManager.getSetting("site.name");

// Modifier un paramètre
dataManager.setSetting("site.name", "Nouveau nom");
```

## Avantages de cette Architecture

1. **Centralisation** : Toutes les données sont gérées par un seul système
2. **Cohérence** : Structure uniforme des données
3. **Synchronisation** : Mise à jour automatique entre sessions
4. **Persistance** : Sauvegarde et restauration des données
5. **Extensibilité** : Facile d'ajouter de nouvelles fonctionnalités
6. **Performance** : Gestion optimisée des données
7. **Maintenance** : Code organisé et modulaire

## Évolutions Futures

1. **Graphiques** : Intégration de Chart.js ou D3.js
2. **Base de données** : Migration vers une base de données réelle
3. **API** : Interface REST pour les données
4. **Cache** : Système de cache avancé
5. **Analytics** : Métriques plus détaillées
6. **Notifications** : Système de notifications en temps réel
