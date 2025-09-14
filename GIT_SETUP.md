# Guide de Mise en Place Git - Miwasexo

## 🚀 Démarche Complète pour Mettre le Projet sur Git

### 1. Préparation du Projet

#### ✅ Vérification des Fichiers

Le projet est maintenant prêt avec :

- ✅ Structure HTML/CSS/JS uniquement
- ✅ Fichier `.gitignore` configuré
- ✅ Documentation mise à jour
- ✅ Fichiers sensibles supprimés
- ✅ Licence MIT ajoutée

#### 📁 Structure Finale

```
miwasexo/
├── index.html              # Page de redirection
├── README.md               # Documentation principale
├── LICENSE                 # Licence MIT
├── .gitignore              # Fichiers à ignorer
├── GIT_SETUP.md            # Ce guide
├── src/
│   ├── pages/              # Pages HTML
│   ├── assets/             # CSS, JS, Images
│   └── config/             # Configuration PWA
└── docs/                   # Documentation technique
```

### 2. Initialisation du Repository Git

#### 🔧 Commandes de Base

```bash
# 1. Initialiser Git dans le projet
git init

# 2. Ajouter tous les fichiers (sauf ceux dans .gitignore)
git add .

# 3. Premier commit
git commit -m "Initial commit: Miwasexo - Plateforme d'information béninoise

- Interface publique avec articles et recherche
- Administration complète avec CRUD
- Système d'analytiques intégré
- PWA avec Service Worker
- Design responsive et moderne
- Gestion des données via localStorage"

# 4. Vérifier le statut
git status
```

### 3. Configuration de Git (Première fois)

```bash
# Configuration globale (une seule fois)
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@example.com"

# Configuration pour ce projet uniquement
git config user.name "Votre Nom"
git config user.email "votre.email@example.com"
```

### 4. Création du Repository sur GitHub

#### 🌐 Étapes sur GitHub

1. **Aller sur GitHub.com** et se connecter
2. **Cliquer sur "New repository"** (bouton vert)
3. **Remplir les informations** :
   - Repository name: `miwasexo`
   - Description: `Plateforme d'information dédiée au décryptage de l'actualité politique, économique et financière du Bénin`
   - Visibilité: Public ou Private (selon votre choix)
   - **NE PAS** cocher "Add a README file" (déjà présent)
   - **NE PAS** cocher "Add .gitignore" (déjà présent)
   - **NE PAS** cocher "Choose a license" (déjà présent)
4. **Cliquer sur "Create repository"**

### 5. Liaison avec le Repository Distant

```bash
# Ajouter le repository distant (remplacer par votre URL)
git remote add origin https://github.com/VOTRE-USERNAME/miwasexo.git

# Vérifier la liaison
git remote -v

# Pousser le code vers GitHub
git push -u origin main
```

### 6. Vérification et Test

#### ✅ Vérifications

```bash
# Vérifier que tout est bien poussé
git log --oneline

# Vérifier les branches
git branch -a

# Vérifier le statut
git status
```

#### 🌐 Test sur GitHub

1. **Aller sur votre repository** : `https://github.com/VOTRE-USERNAME/miwasexo`
2. **Vérifier que tous les fichiers sont présents**
3. **Tester le README** : Il doit s'afficher correctement
4. **Vérifier la licence** : Le badge MIT doit apparaître

### 7. Configuration GitHub Pages (Optionnel)

#### 📱 Activer GitHub Pages

1. **Aller dans Settings** du repository
2. **Scroller vers "Pages"** dans le menu de gauche
3. **Source** : Choisir "Deploy from a branch"
4. **Branch** : Sélectionner "main"
5. **Folder** : "/ (root)"
6. **Cliquer sur "Save"**

#### 🌐 Accès au Site

- **URL du site** : `https://VOTRE-USERNAME.github.io/miwasexo`
- **Temps de déploiement** : 5-10 minutes

### 8. Workflow de Développement

#### 🔄 Commandes Quotidiennes

```bash
# Voir les modifications
git status

# Ajouter les fichiers modifiés
git add .

# Ou ajouter des fichiers spécifiques
git add src/pages/admin.html

# Commiter avec un message descriptif
git commit -m "feat: Ajout de la fonctionnalité de recherche avancée"

# Pousser vers GitHub
git push origin main
```

#### 📝 Types de Commits (Convention)

```bash
# Nouvelles fonctionnalités
git commit -m "feat: Ajout du système de notifications"

# Corrections de bugs
git commit -m "fix: Correction du bug de connexion admin"

# Améliorations
git commit -m "improve: Optimisation des performances de recherche"

# Documentation
git commit -m "docs: Mise à jour du README"

# Styles
git commit -m "style: Amélioration du design responsive"

# Refactoring
git commit -m "refactor: Réorganisation du code JavaScript"
```

### 9. Gestion des Branches (Avancé)

#### 🌿 Créer une Branche

```bash
# Créer et basculer sur une nouvelle branche
git checkout -b feature/nouvelle-fonctionnalite

# Ou avec la nouvelle syntaxe
git switch -c feature/nouvelle-fonctionnalite

# Travailler sur la branche
# ... faire des modifications ...

# Commiter sur la branche
git add .
git commit -m "feat: Implémentation de la nouvelle fonctionnalité"

# Pousser la branche
git push origin feature/nouvelle-fonctionnalite
```

#### 🔀 Fusionner une Branche

```bash
# Retourner sur main
git checkout main

# Fusionner la branche
git merge feature/nouvelle-fonctionnalite

# Pousser les changements
git push origin main

# Supprimer la branche locale
git branch -d feature/nouvelle-fonctionnalite

# Supprimer la branche distante
git push origin --delete feature/nouvelle-fonctionnalite
```

### 10. Sauvegarde et Sécurité

#### 💾 Sauvegarde Locale

```bash
# Cloner le repository sur un autre ordinateur
git clone https://github.com/VOTRE-USERNAME/miwasexo.git

# Récupérer les dernières modifications
git pull origin main
```

#### 🔒 Sécurité

- ✅ **Aucun fichier sensible** dans le repository
- ✅ **Mots de passe** stockés uniquement dans localStorage
- ✅ **Données utilisateur** restent locales
- ✅ **Configuration** via l'interface d'administration

### 11. Déploiement en Production

#### 🌐 Serveur Web

```bash
# Cloner sur le serveur
git clone https://github.com/VOTRE-USERNAME/miwasexo.git

# Copier vers le répertoire web
cp -r miwasexo/* /var/www/html/

# Ou avec rsync
rsync -av miwasexo/ /var/www/html/miwasexo/
```

#### 🔄 Mise à Jour

```bash
# Sur le serveur
cd /var/www/html/miwasexo
git pull origin main
```

### 12. Commandes Utiles

#### 🔍 Diagnostic

```bash
# Voir l'historique des commits
git log --oneline --graph

# Voir les différences
git diff

# Voir les fichiers suivis
git ls-files

# Voir la configuration
git config --list
```

#### 🛠️ Maintenance

```bash
# Nettoyer les fichiers non suivis
git clean -fd

# Réinitialiser les modifications non commitées
git reset --hard HEAD

# Voir l'espace utilisé
du -sh .git
```

## ✅ Checklist Finale

- [ ] Repository Git initialisé
- [ ] Premier commit effectué
- [ ] Repository GitHub créé
- [ ] Code poussé vers GitHub
- [ ] README affiché correctement
- [ ] Licence MIT visible
- [ ] GitHub Pages activé (optionnel)
- [ ] Site accessible (si Pages activé)
- [ ] Workflow de développement configuré

## 🆘 En Cas de Problème

### Erreur de Push

```bash
# Si le repository distant existe déjà
git pull origin main --allow-unrelated-histories
git push origin main
```

### Fichiers Non Ajoutés

```bash
# Vérifier le .gitignore
cat .gitignore

# Forcer l'ajout d'un fichier ignoré
git add -f fichier-ignore.js
```

### Conflits de Merge

```bash
# Résoudre les conflits manuellement
# Puis
git add .
git commit -m "resolve: Résolution des conflits de merge"
```

---

**🎉 Félicitations !** Votre projet Miwasexo est maintenant sur Git et prêt pour le développement collaboratif !
