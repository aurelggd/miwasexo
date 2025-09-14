# Miwasexo 📰

> Décryptage de l'actualité politique, économique et financière du Bénin

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/votre-username/miwasexo)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## 🎯 À Propos

Miwasexo est une plateforme d'information moderne dédiée au décryptage de l'actualité politique, économique et financière du Bénin. Elle offre une interface intuitive pour la publication d'articles et un système d'administration complet, entièrement développée en HTML, CSS et JavaScript.

## ✨ Fonctionnalités

### 📰 Gestion de Contenu

- **CRUD Articles** : Création, modification, suppression d'articles
- **Catégories** : Politique, Économie, Société, International, Finance
- **Images** : Upload et gestion d'images avec redimensionnement automatique
- **Statuts** : Brouillon, Publié, Archivé
- **Recherche** : Recherche avancée dans le contenu

### 📊 Analytiques

- **Statistiques globales** : Vues, articles, lecteurs uniques
- **Performance par catégorie** : Métriques détaillées
- **Articles populaires** : Top des articles les plus lus
- **Export de données** : Export en JSON/CSV

### ⚙️ Administration

- **Interface moderne** : Dashboard responsive et intuitif
- **Gestion des paramètres** : Configuration complète du site
- **Sécurité** : Authentification sécurisée avec limitation des tentatives
- **Sauvegarde** : Export/Import des données

### 🔒 Sécurité

- **Authentification** : Système de connexion sécurisé
- **Protection des données** : Chiffrement des informations sensibles
- **Validation** : Validation stricte des données d'entrée
- **localStorage sécurisé** : Gestion des données côté client

### 📱 Mobile-First

- **Design responsive** : Optimisé pour tous les appareils
- **Interface tactile** : Zones de clic de 44px minimum
- **Navigation mobile** : Menu hamburger avec gestes tactiles
- **Modales optimisées** : Pleine largeur sur mobile
- **Tableaux adaptatifs** : Conversion automatique en cartes
- **Performance mobile** : Chargement rapide et fluide

## 🚀 Installation

### Prérequis

- Navigateur moderne avec support ES6+
- Serveur web local (optionnel mais recommandé)

### Installation Rapide

```bash
# Cloner le repository
git clone https://github.com/votre-username/miwasexo.git
cd miwasexo

# Ouvrir directement dans le navigateur
open index.html
# ou
start index.html
```

### Installation avec Serveur Local (Recommandé)

```bash
# Avec Python
python -m http.server 8000
# Puis ouvrir http://localhost:8000

# Avec Node.js (si installé)
npx http-server -p 8000

# Avec PHP
php -S localhost:8000
```

## 📁 Structure du Projet

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
│   │   │   ├── mobile-responsive.css   # Styles responsive mobile
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
│   ├── README.md           # Documentation technique
│   └── DATA_ORGANIZATION.md # Organisation des données
├── RESPONSIVE_TEST.md      # Guide de test responsive
└── .gitignore              # Fichiers à ignorer pour Git
```

## 🔧 Configuration

### Configuration Initiale

1. **Premier lancement** : Ouvrir `index.html` → Redirection automatique vers `src/pages/setup.html`
2. **Création du compte** : Remplir le formulaire de configuration initiale
3. **Accès admin** : Utiliser les identifiants créés pour accéder à l'administration

### Configuration des Données

Les données sont stockées dans le `localStorage` du navigateur :

- **Articles** : `miwasexo-articles`
- **Analytiques** : `miwasexo-analytics`
- **Paramètres** : `miwasexo-settings`
- **Identifiants admin** : `miwasexo-admin-credentials`

## 📖 Utilisation

### Interface Publique

- **Accueil** : Page d'accueil avec articles récents
- **Articles** : Liste complète des articles avec filtres
- **Recherche** : Recherche dans le contenu

### Interface d'Administration

- **Connexion** : `src/pages/admin.html`
- **Articles** : Gestion du contenu
- **Analytiques** : Statistiques et métriques
- **Paramètres** : Configuration du site

### Utilisation des Données

```javascript
// Accès aux données via le DataManager
const articles = window.dataManager.getArticles();
const analytics = window.dataManager.getAnalytics();
const settings = window.dataManager.getSettings();
```

## 🛡️ Sécurité

### Protection des Données Sensibles

- ✅ Fichiers sensibles dans `.gitignore`
- ✅ Chiffrement des mots de passe côté client
- ✅ Validation des données d'entrée
- ✅ Gestion sécurisée du localStorage
- ✅ Limitation des tentatives de connexion

### Bonnes Pratiques

1. **Ne jamais commiter** les fichiers de configuration sensibles
2. **Changer les mots de passe par défaut** après installation
3. **Utiliser HTTPS** en production
4. **Effectuer des sauvegardes** régulières des données
5. **Valider toutes les entrées utilisateur**

## 🚀 Déploiement

### Déploiement Simple

```bash
# Cloner le repository
git clone https://github.com/votre-username/miwasexo.git
cd miwasexo

# Déployer sur un serveur web
# Copier tous les fichiers vers le répertoire web de votre serveur
```

### Déploiement avec GitHub Pages

1. **Activer GitHub Pages** dans les paramètres du repository
2. **Choisir la branche** `main` comme source
3. **Accéder au site** via `https://votre-username.github.io/miwasexo`

### Déploiement sur Serveur Web

```bash
# Copier les fichiers vers le serveur
scp -r miwasexo/ user@server:/var/www/html/

# Ou avec rsync
rsync -av miwasexo/ user@server:/var/www/html/miwasexo/
```

## 📊 Monitoring

### Données Disponibles

- **Articles** : Nombre total, par catégorie, par statut
- **Vues** : Statistiques de consultation
- **Utilisateurs** : Sessions administrateur
- **Performance** : Temps de chargement des pages

## 🤝 Contribution

### Développement

```bash
# Fork du repository
git clone https://github.com/votre-username/miwasexo.git
cd miwasexo

# Ouvrir dans un navigateur pour tester
open index.html
```

### Guidelines

1. **Code** : Suivre les conventions JavaScript ES6+
2. **Commits** : Messages clairs et descriptifs
3. **Tests** : Tester les nouvelles fonctionnalités dans le navigateur
4. **Documentation** : Mettre à jour la documentation

### Issues et Pull Requests

- **Issues** : Signaler les bugs et demander des fonctionnalités
- **Pull Requests** : Proposer des améliorations
- **Discussions** : Participer aux discussions communautaires

## 📄 Licence

Ce projet est sous licence MIT. Voir [LICENSE](LICENSE) pour plus de détails.

## 📞 Support

- **Documentation** : [docs/](docs/)
- **Issues** : [GitHub Issues](https://github.com/votre-username/miwasexo/issues)
- **Email** : support@miwasexo.com

## 🙏 Remerciements

- **Équipe Miwasexo** : Pour la vision et le développement
- **Communauté** : Pour les contributions et le feedback
- **Technologies** : HTML5, CSS3, JavaScript ES6+

---

**Miwasexo** - Décryptage de l'actualité béninoise 🇧🇯
