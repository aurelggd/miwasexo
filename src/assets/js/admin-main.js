// Admin Main Script - Gestion CRUD des articles avec DataManager
let currentEditingId = null;

// Initialiser l'admin au chargement
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM chargé pour admin-main.js');
    
    // Attendre que le DataManager soit prêt
    setTimeout(() => {
        if (window.dataManager) {
            initializeAdmin();
        } else {
            console.error('❌ DataManager non disponible');
            setTimeout(initializeAdmin, 500);
        }
    }, 100);
    
    // Initialiser les onglets
    initializeTabs();
    
    // Initialiser la section articles
    initializeArticlesSection();
    
    // Écouter les changements de données
    setupDataListeners();
});

// Fonction de prévisualisation d'image
function previewImage(input) {
    const preview = document.getElementById('image-preview');
    const previewImg = document.getElementById('preview-img');
    const placeholder = document.querySelector('.upload-placeholder');
    
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            previewImg.src = e.target.result;
            preview.style.display = 'block';
            if (placeholder) {
                placeholder.style.display = 'none';
            }
        };
        
        reader.readAsDataURL(input.files[0]);
    } else {
        preview.style.display = 'none';
        if (placeholder) {
            placeholder.style.display = 'flex';
        }
    }
}

// Fonction pour supprimer l'image
function removeImage() {
    const preview = document.getElementById('image-preview');
    const previewImg = document.getElementById('preview-img');
    const input = document.getElementById('article-image');
    const placeholder = document.querySelector('.upload-placeholder');
    
    preview.style.display = 'none';
    previewImg.src = '';
    input.value = '';
    
    if (placeholder) {
        placeholder.style.display = 'flex';
    }
}

// 🎨 GESTION DES ONGLETS - Interface moderne
function initializeTabs() {
    console.log('🎨 Initialisation des onglets admin');
    
    // Ajouter les sections manquantes si elles n'existent pas
    addMissingTabSections();
    
    // Activer le premier onglet par défaut
    showTab('articles');
}

function addMissingTabSections() {
    const articlesTab = document.getElementById('articles-tab');
    if (!articlesTab) {
        console.log('⚠️ Section articles manquante, création...');
        return;
    }
    
    // Ajouter la section Analytics si elle n'existe pas
    if (!document.getElementById('analytics-tab')) {
        const analyticsTab = document.createElement('div');
        analyticsTab.id = 'analytics-tab';
        analyticsTab.className = 'admin-tab-content';
        analyticsTab.innerHTML = `
            <div class="admin-section-header">
                <h2 class="admin-section-title">
                    <i class="fas fa-chart-line"></i>
                    Analytiques et Statistiques
                </h2>
            </div>
            <div class="analytics-grid">
                <div class="analytics-card">
                    <div class="analytics-icon">
                        <i class="fas fa-eye"></i>
                    </div>
                    <div class="analytics-content">
                        <h3>Vues Total</h3>
                        <p class="analytics-number" id="analytics-total-views">0</p>
                        <p class="analytics-change positive">+12% ce mois</p>
                    </div>
                </div>
                <div class="analytics-card">
                    <div class="analytics-icon">
                        <i class="fas fa-newspaper"></i>
                    </div>
                    <div class="analytics-content">
                        <h3>Articles Publiés</h3>
                        <p class="analytics-number" id="analytics-total-articles">0</p>
                        <p class="analytics-change positive">+3 ce mois</p>
                    </div>
                </div>
                <div class="analytics-card">
                    <div class="analytics-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="analytics-content">
                        <h3>Lecteurs Uniques</h3>
                        <p class="analytics-number" id="analytics-unique-readers">0</p>
                        <p class="analytics-change positive">+8% ce mois</p>
                    </div>
                </div>
            </div>
        `;
        articlesTab.parentNode.appendChild(analyticsTab);
    }
    
    // Ajouter la section Settings si elle n'existe pas
    if (!document.getElementById('settings-tab')) {
        const settingsTab = document.createElement('div');
        settingsTab.id = 'settings-tab';
        settingsTab.className = 'admin-tab-content';
        settingsTab.innerHTML = `
            <div class="admin-section-header">
                <h2 class="admin-section-title">
                    <i class="fas fa-cog"></i>
                    Paramètres Administrateur
                </h2>
            </div>
            <div class="settings-grid">
                <div class="setting-card">
                    <div class="setting-icon">
                        <i class="fas fa-user-shield"></i>
                    </div>
                    <div class="setting-content">
                        <h3>Compte Administrateur</h3>
                        <p>Gérer vos identifiants et informations personnelles</p>
                        <button class="btn btn-secondary" onclick="showAdminSettings()">
                            <i class="fas fa-edit"></i> Modifier
                        </button>
                    </div>
                </div>
                <div class="setting-card">
                    <div class="setting-icon">
                        <i class="fas fa-key"></i>
                    </div>
                    <div class="setting-content">
                        <h3>Mot de passe</h3>
                        <p>Changer votre mot de passe de connexion</p>
                        <button class="btn btn-secondary" onclick="showPasswordChange()">
                            <i class="fas fa-lock"></i> Changer
                        </button>
                    </div>
                </div>
            </div>
        `;
        articlesTab.parentNode.appendChild(settingsTab);
    }
}

function showTab(tabName) {
    console.log(`🎨 Changement d'onglet vers: ${tabName}`);
    
    // Désactiver tous les onglets
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Désactiver tout le contenu
    document.querySelectorAll('.admin-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Activer l'onglet sélectionné
    const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Activer le contenu correspondant
    const selectedContent = document.getElementById(`${tabName}-tab`);
    if (selectedContent) {
        selectedContent.classList.add('active');
    }
    
    // Actions spécifiques selon l'onglet
    switch(tabName) {
        case 'articles':
            loadArticles();
            updateArticlesStats();
            break;
        case 'analytics':
            loadAnalytics();
            break;
        case 'settings':
            loadSettings();
            break;
    }
}

function loadAnalytics() {
    console.log('📊 Chargement des analytiques via DataManager');
    
    if (!window.dataManager) {
        console.error('❌ DataManager non disponible');
        return;
    }
    
    const analytics = window.dataManager.getAnalytics();
    const articles = window.dataManager.getArticles();
    const globalStats = window.dataManager.getGlobalStats();
    
    // Mettre à jour les statistiques principales
    updateAnalyticsOverview(analytics, globalStats);
    
    // Mettre à jour les statistiques par catégorie
    updateCategoryStats(globalStats.categories);
    
    // Mettre à jour les articles populaires
    updatePopularArticles(articles);
    
    // Mettre à jour les graphiques temporels
    updateTimeCharts(analytics);
}

function updateAnalyticsOverview(analytics, globalStats) {
    // Vues totales
    const totalViewsElement = document.getElementById('analytics-total-views');
    if (totalViewsElement) {
        totalViewsElement.textContent = globalStats.totalViews.toLocaleString();
    }
    
    // Articles total
    const totalArticlesElement = document.getElementById('analytics-total-articles');
    if (totalArticlesElement) {
        totalArticlesElement.textContent = globalStats.totalArticles;
    }
    
    // Lecteurs uniques
    const uniqueReadersElement = document.getElementById('analytics-unique-readers');
    if (uniqueReadersElement) {
        uniqueReadersElement.textContent = globalStats.uniqueVisitors.toLocaleString();
    }
    
    // Temps moyen (simulé)
    const avgTimeElement = document.getElementById('analytics-avg-time');
    if (avgTimeElement) {
        avgTimeElement.textContent = '3min';
    }
    
    // Calculer les changements mensuels
    updateMonthlyChanges(analytics, globalStats);
}

function updateMonthlyChanges(analytics, globalStats) {
    const monthlyStats = analytics.monthlyStats || {};
    
    // Changement des vues
    const viewsChangeElement = document.getElementById('analytics-views-change');
    if (viewsChangeElement) {
        const change = monthlyStats.views || 0;
        viewsChangeElement.textContent = `+${change} ce mois`;
        viewsChangeElement.className = change > 0 ? 'analytics-change positive' : 'analytics-change neutral';
    }
    
    // Changement des articles
    const articlesChangeElement = document.getElementById('analytics-articles-change');
    if (articlesChangeElement) {
        const change = monthlyStats.articles || 0;
        articlesChangeElement.textContent = `+${change} ce mois`;
        articlesChangeElement.className = change > 0 ? 'analytics-change positive' : 'analytics-change neutral';
    }
    
    // Changement des lecteurs
    const readersChangeElement = document.getElementById('analytics-readers-change');
    if (readersChangeElement) {
        const change = monthlyStats.visitors || 0;
        readersChangeElement.textContent = `+${change} ce mois`;
        readersChangeElement.className = change > 0 ? 'analytics-change positive' : 'analytics-change neutral';
    }
}

function updateCategoryStats(categoryStats) {
    const categoryGrid = document.getElementById('category-stats-grid');
    if (!categoryGrid) return;
    
    categoryGrid.innerHTML = '';
    
    const categoryNames = {
        'politique': 'Politique',
        'economie': 'Économie',
        'societe': 'Société',
        'international': 'International',
        'finance': 'Finance'
    };
    
    Object.entries(categoryStats).forEach(([category, stats]) => {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'category-stat-card';
        
        const categoryName = categoryNames[category] || category;
        const totalViews = stats.views || 0;
        const totalArticles = stats.articles || 0;
        const avgViews = totalArticles > 0 ? Math.round(totalViews / totalArticles) : 0;
        
        categoryCard.innerHTML = `
            <div class="category-stat-header">
                <h4>${categoryName}</h4>
                <span class="category-stat-icon">
                    <i class="fas fa-${getCategoryIcon(category)}"></i>
                </span>
            </div>
            <div class="category-stat-content">
                <div class="category-stat-item">
                    <span class="stat-label">Articles</span>
                    <span class="stat-value">${totalArticles}</span>
                </div>
                <div class="category-stat-item">
                    <span class="stat-label">Vues</span>
                    <span class="stat-value">${totalViews.toLocaleString()}</span>
                </div>
                <div class="category-stat-item">
                    <span class="stat-label">Moyenne</span>
                    <span class="stat-value">${avgViews} vues/article</span>
                </div>
            </div>
        `;
        
        categoryGrid.appendChild(categoryCard);
    });
}

function getCategoryIcon(category) {
    const icons = {
        'politique': 'landmark',
        'economie': 'chart-line',
        'societe': 'users',
        'international': 'globe',
        'finance': 'coins'
    };
    return icons[category] || 'newspaper';
}

function updatePopularArticles(articles) {
    const popularList = document.getElementById('popular-articles-list');
    if (!popularList) return;
    
    // Trier les articles par nombre de vues
    const sortedArticles = articles
        .filter(article => article.status === 'published')
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 5); // Top 5
    
    popularList.innerHTML = '';
    
    if (sortedArticles.length === 0) {
        popularList.innerHTML = `
            <div class="no-popular-articles">
                <i class="fas fa-newspaper"></i>
                <p>Aucun article publié pour le moment</p>
            </div>
        `;
        return;
    }
    
    sortedArticles.forEach((article, index) => {
        const articleItem = document.createElement('div');
        articleItem.className = 'popular-article-item';
        
        articleItem.innerHTML = `
            <div class="popular-article-rank">
                <span class="rank-number">${index + 1}</span>
            </div>
            <div class="popular-article-content">
                <h4 class="popular-article-title">${article.title}</h4>
                <div class="popular-article-meta">
                    <span class="article-category">${getCategoryName(article.category)}</span>
                    <span class="article-date">${formatDate(article.date)}</span>
                </div>
            </div>
            <div class="popular-article-stats">
                <div class="views-count">
                    <i class="fas fa-eye"></i>
                    <span>${article.views || 0}</span>
                </div>
            </div>
        `;
        
        popularList.appendChild(articleItem);
    });
}

function getCategoryName(category) {
    const names = {
        'politique': 'Politique',
        'economie': 'Économie',
        'societe': 'Société',
        'international': 'International',
        'finance': 'Finance'
    };
    return names[category] || 'Général';
}

function updateTimeCharts(analytics) {
    // Pour l'instant, afficher des messages de développement
    // Dans une version future, on pourrait intégrer Chart.js ou D3.js
    console.log('📊 Mise à jour des graphiques temporels');
}

function refreshAnalytics() {
    console.log('🔄 Actualisation des analytiques');
    loadAnalytics();
}

function exportAnalytics() {
    if (!window.dataManager) {
        alert('Erreur: Système de données non disponible');
        return;
    }
    
    const analytics = window.dataManager.getAnalytics();
    const articles = window.dataManager.getArticles();
    
    const exportData = {
        analytics: analytics,
        articles: articles,
        exportDate: new Date().toISOString(),
        type: 'analytics'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `miwasexo-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('Données analytiques exportées avec succès');
}

function loadSettings() {
    console.log('⚙️ Chargement des paramètres via DataManager');
    
    if (!window.dataManager) {
        console.error('❌ DataManager non disponible');
        return;
    }
    
    const settings = window.dataManager.getSettings();
    console.log('⚙️ Paramètres chargés:', settings);
}

// Fonctions pour les paramètres
function showThemeSettings() {
    alert('Configuration du thème - Fonctionnalité en développement');
}

function showLanguageSettings() {
    alert('Configuration de la langue - Fonctionnalité en développement');
}

function showCategorySettings() {
    alert('Gestion des catégories - Fonctionnalité en développement');
}

function showMediaSettings() {
    alert('Configuration des médias - Fonctionnalité en développement');
}

function exportAllData() {
    if (!window.dataManager) {
        alert('Erreur: Système de données non disponible');
        return;
    }
    
    window.dataManager.exportData();
    alert('Toutes les données ont été exportées avec succès');
}

function importData() {
    if (!window.dataManager) {
        alert('Erreur: Système de données non disponible');
        return;
    }
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            window.dataManager.importData(file)
                .then(() => {
                    alert('Données importées avec succès');
                    // Recharger toutes les données
                    loadArticles();
                    loadAnalytics();
                    loadSettings();
                })
                .catch((error) => {
                    alert('Erreur lors de l\'importation: ' + error.message);
                });
        }
    };
    input.click();
}

// 🎨 GESTION DES ARTICLES - Fonctionnalités améliorées
function initializeArticlesSection() {
    console.log('📰 Initialisation de la section articles');
    
    // Initialiser les événements de recherche et filtres
    const searchInput = document.getElementById('article-search');
    const categoryFilter = document.getElementById('category-filter');
    const statusFilter = document.getElementById('status-filter');
    const sortFilter = document.getElementById('sort-filter');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(filterArticles, 300));
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterArticles);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', filterArticles);
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', sortArticles);
    }
    
    // Charger les articles
    loadArticles();
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function filterArticles() {
    console.log('🔍 Filtrage des articles');
    
    const searchTerm = document.getElementById('article-search')?.value.toLowerCase() || '';
    const category = document.getElementById('category-filter')?.value || '';
    const status = document.getElementById('status-filter')?.value || '';
    
    const articles = document.querySelectorAll('.article-card');
    let visibleCount = 0;
    
    articles.forEach(article => {
        const title = article.querySelector('.article-card-title')?.textContent.toLowerCase() || '';
        const summary = article.querySelector('.article-card-summary')?.textContent.toLowerCase() || '';
        const articleCategory = article.dataset.category || '';
        const articleStatus = article.dataset.status || '';
        
        const matchesSearch = !searchTerm || title.includes(searchTerm) || summary.includes(searchTerm);
        const matchesCategory = !category || articleCategory === category;
        const matchesStatus = !status || articleStatus === status;
        
        if (matchesSearch && matchesCategory && matchesStatus) {
            article.style.display = 'block';
            visibleCount++;
        } else {
            article.style.display = 'none';
        }
    });
    
    // Afficher/masquer le message "aucun article"
    const noArticles = document.getElementById('no-articles');
    const articlesGrid = document.getElementById('articles-grid');
    
    if (visibleCount === 0) {
        if (noArticles) noArticles.style.display = 'block';
        if (articlesGrid) articlesGrid.style.display = 'none';
    } else {
        if (noArticles) noArticles.style.display = 'none';
        if (articlesGrid) articlesGrid.style.display = 'grid';
    }
}

function sortArticles() {
    console.log('📊 Tri des articles');
    
    const sortBy = document.getElementById('sort-filter')?.value || 'newest';
    const articlesGrid = document.getElementById('articles-grid');
    
    if (!articlesGrid) return;
    
    const articles = Array.from(articlesGrid.children);
    
    articles.sort((a, b) => {
        switch (sortBy) {
            case 'newest':
                return new Date(b.dataset.date || 0) - new Date(a.dataset.date || 0);
            case 'oldest':
                return new Date(a.dataset.date || 0) - new Date(b.dataset.date || 0);
            case 'title':
                const titleA = a.querySelector('.article-card-title')?.textContent || '';
                const titleB = b.querySelector('.article-card-title')?.textContent || '';
                return titleA.localeCompare(titleB);
            case 'views':
                const viewsA = parseInt(a.dataset.views || 0);
                const viewsB = parseInt(b.dataset.views || 0);
                return viewsB - viewsA;
            default:
                return 0;
        }
    });
    
    // Réorganiser les articles dans le DOM
    articles.forEach(article => articlesGrid.appendChild(article));
}

function updateArticlesStats() {
    console.log('📈 Mise à jour des statistiques des articles');
    
    const articles = document.querySelectorAll('.article-card');
    let totalArticles = articles.length;
    let totalViews = 0;
    let publishedCount = 0;
    let draftsCount = 0;
    
    articles.forEach(article => {
        const views = parseInt(article.dataset.views || 0);
        const status = article.dataset.status || '';
        
        totalViews += views;
        
        if (status === 'published') {
            publishedCount++;
        } else if (status === 'draft') {
            draftsCount++;
        }
    });
    
    // Mettre à jour les éléments d'affichage
    const countElement = document.getElementById('articles-count');
    const viewsElement = document.getElementById('articles-views');
    const publishedElement = document.getElementById('articles-published');
    const draftsElement = document.getElementById('articles-drafts');
    
    if (countElement) countElement.textContent = totalArticles;
    if (viewsElement) viewsElement.textContent = totalViews.toLocaleString();
    if (publishedElement) publishedElement.textContent = publishedCount;
    if (draftsElement) draftsElement.textContent = draftsCount;
}

// Fonction pour mettre à jour le compteur de caractères
function updateCharCounter() {
    const summaryInput = document.getElementById('article-summary');
    const counter = document.getElementById('summary-counter');
    
    if (summaryInput && counter) {
        summaryInput.addEventListener('input', function() {
            const length = this.value.length;
            counter.textContent = length;
            
            if (length > 200) {
                counter.style.color = '#e8112d';
            } else if (length > 150) {
                counter.style.color = '#fcd116';
            } else {
                counter.style.color = '#7f8c8d';
            }
        });
    }
}

function initializeAdmin() {
    console.log('🔧 Initialisation de l\'admin...');
    
    if (!authManager) {
        console.error('❌ AuthManager non disponible');
        return;
    }
    
    if (!authManager.isAuthenticated) {
        console.log('❌ Non authentifié, affichage du modal de connexion');
        authManager.showLoginModal();
        return;
    }
    
    console.log('✅ Authentification confirmée, initialisation de l\'admin');
    
    try {
        updateWelcomeMessage();
        setupEventListeners();
        loadArticles();
        
        if (typeof updateAdminStatsDisplay === 'function') {
            updateAdminStatsDisplay();
        }
        
        console.log('✅ Initialisation de l\'admin terminée avec succès');
    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation de l\'admin:', error);
    }
}

function updateWelcomeMessage() {
    const welcomeElement = document.getElementById('admin-welcome');
    if (welcomeElement) {
        const now = new Date();
        const timeOfDay = now.getHours() < 12 ? 'matin' : now.getHours() < 18 ? 'après-midi' : 'soir';
        welcomeElement.textContent = `Bienvenue, Administrateur Miwasexo. Bon ${timeOfDay} !`;
    }
}

function setupEventListeners() {
    // Formulaire d'article
    const form = document.getElementById('article-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // Bouton actualiser
    const refreshBtn = document.querySelector('.btn-secondary');
    if (refreshBtn && refreshBtn.textContent.includes('Actualiser')) {
        refreshBtn.addEventListener('click', loadArticles);
    }
}

function loadArticles() {
    console.log('📰 Chargement des articles via DataManager');
    
    if (!window.dataManager) {
        console.error('❌ DataManager non disponible');
        return;
    }
    
    const articles = window.dataManager.getArticles();
    const articlesGrid = document.getElementById('articles-grid');
    const noArticles = document.getElementById('no-articles');
    
    if (!articlesGrid) return;
    
    // Vider la grille
    articlesGrid.innerHTML = '';
    
    if (articles.length === 0) {
        // Afficher le message "aucun article"
        if (noArticles) noArticles.style.display = 'block';
        articlesGrid.style.display = 'none';
        return;
    }
    
    // Masquer le message "aucun article"
    if (noArticles) noArticles.style.display = 'none';
    articlesGrid.style.display = 'grid';
    
    // Créer les cartes d'articles
    articles.forEach(article => {
        const articleCard = createArticleCard(article);
        articlesGrid.appendChild(articleCard);
    });
    
    // Mettre à jour les statistiques
    updateArticlesStats();
}

function createArticleCard(article) {
    const card = document.createElement('div');
    card.className = `article-card ${article.status || 'draft'}`;
    card.dataset.id = article.id;
    card.dataset.category = article.category || '';
    card.dataset.status = article.status || 'draft';
    card.dataset.date = article.date || new Date().toISOString();
    card.dataset.views = article.views || 0;
    
    const statusText = {
        'published': 'Publié',
        'draft': 'Brouillon',
        'archived': 'Archivé'
    };
    
    const categoryText = {
        'politique': 'Politique',
        'economie': 'Économie',
        'societe': 'Société',
        'international': 'International'
    };
    
    card.innerHTML = `
        <div class="article-card-header">
            <img src="${article.image || '../assets/images/logo.png'}" alt="${article.title}" class="article-card-image">
            <div class="article-card-overlay">
                <div class="article-card-actions">
                    <button class="btn btn-primary" onclick="editArticle('${article.id}')">
                        <i class="fas fa-edit"></i>
                        <span>Modifier</span>
                    </button>
                    <button class="btn btn-secondary" onclick="deleteArticle('${article.id}')">
                        <i class="fas fa-trash"></i>
                        <span>Supprimer</span>
                    </button>
                </div>
            </div>
        </div>
        <div class="article-card-content">
            <h3 class="article-card-title">${article.title || 'Sans titre'}</h3>
            <div class="article-card-meta">
                <span class="article-card-category">${categoryText[article.category] || 'Général'}</span>
                <span class="article-card-status ${article.status || 'draft'}">${statusText[article.status] || 'Brouillon'}</span>
                <span class="article-date">${new Date(article.date).toLocaleDateString('fr-FR')}</span>
            </div>
            <p class="article-card-summary">${article.summary || 'Aucun résumé disponible.'}</p>
            <div class="article-card-footer">
                <div class="article-card-stats">
                    <div class="article-card-stat">
                        <i class="fas fa-eye"></i>
                        <span>${article.views || 0}</span>
                    </div>
                    <div class="article-card-stat">
                        <i class="fas fa-comment"></i>
                        <span>0</span>
                    </div>
                </div>
                <div class="article-card-actions-mini">
                    <button class="btn btn-sm btn-outline" onclick="previewArticle('${article.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="editArticle('${article.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// Fonctions utilitaires pour les articles
function previewArticle(id) {
    console.log(`👁️ Prévisualisation de l'article ${id}`);
    // TODO: Implémenter la prévisualisation
}

function editArticle(id) {
    console.log(`✏️ Édition de l'article ${id}`);
    // TODO: Implémenter l'édition
}

function deleteArticle(id) {
    console.log(`🗑️ Suppression de l'article ${id}`);
    // TODO: Implémenter la suppression
}

// 🎨 GESTION DES VUES - Basculement entre grille et tableau
function toggleView(viewType) {
    console.log(`🔄 Basculement vers la vue: ${viewType}`);
    
    const articlesGrid = document.getElementById('articles-grid');
    const tableColumnsHeader = document.getElementById('table-columns-header');
    const gridBtn = document.querySelector('[onclick="toggleView(\'grid\')"]');
    const tableBtn = document.querySelector('[onclick="toggleView(\'table\')"]');
    
    if (!articlesGrid || !tableColumnsHeader) return;
    
    // Mettre à jour les boutons
    if (gridBtn && tableBtn) {
        gridBtn.className = viewType === 'grid' ? 'btn btn-accent' : 'btn btn-outline';
        tableBtn.className = viewType === 'table' ? 'btn btn-accent' : 'btn btn-outline';
    }
    
    if (viewType === 'grid') {
        // Vue grille
        articlesGrid.style.display = 'grid';
        articlesGrid.className = 'articles-grid';
        tableColumnsHeader.style.display = 'none';
        
        // Recharger les articles en mode grille
        loadArticles();
    } else {
        // Vue tableau
        articlesGrid.style.display = 'block';
        articlesGrid.className = 'articles-table';
        tableColumnsHeader.style.display = 'grid';
        
        // Recharger les articles en mode tableau
        loadArticlesTable();
    }
}

function loadArticlesTable() {
    console.log('📋 Chargement des articles en mode tableau');
    const articles = JSON.parse(localStorage.getItem('miwasexo-articles') || '[]');
    const articlesContainer = document.getElementById('articles-grid');
    const noArticles = document.getElementById('no-articles');
    
    if (!articlesContainer) return;
    
    // Vider le conteneur
    articlesContainer.innerHTML = '';
    
    if (articles.length === 0) {
        // Afficher le message "aucun article"
        if (noArticles) noArticles.style.display = 'block';
        articlesContainer.style.display = 'none';
        return;
    }
    
    // Masquer le message "aucun article"
    if (noArticles) noArticles.style.display = 'none';
    articlesContainer.style.display = 'block';
    
    // Créer les lignes du tableau
    articles.forEach(article => {
        const tableRow = createArticleTableRow(article);
        articlesContainer.appendChild(tableRow);
    });
    
    // Mettre à jour les statistiques
    updateArticlesStats();
}

function createArticleTableRow(article) {
    const row = document.createElement('div');
    row.className = 'article-table-row';
    row.dataset.id = article.id;
    row.dataset.category = article.category || '';
    row.dataset.status = article.status || 'draft';
    row.dataset.date = article.date || new Date().toISOString();
    row.dataset.views = article.views || 0;
    
    const categoryText = {
        'politique': 'Politique',
        'economie': 'Économie',
        'societe': 'Société',
        'international': 'International'
    };
    
    const statusText = {
        'published': 'Publié',
        'draft': 'Brouillon',
        'archived': 'Archivé'
    };
    
    row.innerHTML = `
        <div class="table-cell table-cell-image">
            <img src="${article.image || '../assets/images/logo.png'}" alt="${article.title}" class="article-thumbnail">
        </div>
        <div class="table-cell table-cell-title">
            <h4 class="article-title">${article.title || 'Sans titre'}</h4>
            <p class="article-author">Par ${article.author || 'Admin'}</p>
        </div>
        <div class="table-cell table-cell-category">
            <span class="category-badge">${categoryText[article.category] || 'Général'}</span>
        </div>
        <div class="table-cell table-cell-date">
            <span class="article-date">${new Date(article.date).toLocaleDateString('fr-FR')}</span>
        </div>
        <div class="table-cell table-cell-views">
            <span class="views-count">
                <i class="fas fa-eye"></i>
                ${article.views || 0}
            </span>
        </div>
        <div class="table-cell table-cell-actions">
            <div class="action-buttons">
                <button class="btn btn-sm btn-outline" onclick="previewArticle('${article.id}')" title="Prévisualiser">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-primary" onclick="editArticle('${article.id}')" title="Modifier">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-error" onclick="deleteArticle('${article.id}')" title="Supprimer">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    
    return row;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Fonctions CRUD
function showAddForm() {
    currentEditingId = null;
    document.getElementById('modal-title').textContent = 'Nouvel Article';
    document.getElementById('modal-subtitle').textContent = 'Créez un nouvel article pour Miwasexo';
    
    // Vider le formulaire
    document.getElementById('article-form').reset();
    
    // Réinitialiser l'image
    removeImage();
    
    // Initialiser le compteur de caractères
    updateCharCounter();
    
    // Afficher le modal
    document.getElementById('article-modal').style.display = 'flex';
    document.getElementById('article-modal').classList.add('show');
}

function editArticle(articleId) {
    const articles = JSON.parse(localStorage.getItem('miwasexo-articles') || '[]');
    const article = articles.find(a => a.id === articleId);
    
    if (!article) {
        alert('Article non trouvé');
        return;
    }
    
    currentEditingId = articleId;
    document.getElementById('modal-title').textContent = 'Modifier l\'Article';
    document.getElementById('modal-subtitle').textContent = 'Modifiez les informations de cet article';
    
    // Remplir le formulaire
    document.getElementById('article-title').value = article.title;
    document.getElementById('article-category').value = article.category;
    document.getElementById('article-author').value = article.author;
    document.getElementById('article-summary').value = article.summary;
    document.getElementById('article-content').value = article.content;
    document.getElementById('article-tags').value = article.tags.join(', ');
    
    // Afficher l'image existante si disponible
    if (article.image) {
        const preview = document.getElementById('image-preview');
        const previewImg = document.getElementById('preview-img');
        const placeholder = document.querySelector('.upload-placeholder');
        
        previewImg.src = article.image;
        preview.style.display = 'block';
        if (placeholder) {
            placeholder.style.display = 'none';
        }
    } else {
        removeImage();
    }
    
    // Initialiser le compteur de caractères
    updateCharCounter();
    
    // Afficher le modal
    document.getElementById('article-modal').style.display = 'flex';
    document.getElementById('article-modal').classList.add('show');
}

function deleteArticle(articleId) {
    // Trouver l'article pour afficher son titre dans la confirmation
    const articles = JSON.parse(localStorage.getItem('miwasexo-articles') || '[]');
    const article = articles.find(a => a.id === articleId);
    
    if (!article) {
        alert('Article non trouvé');
        return;
    }
    
    // Stocker l'ID de l'article à supprimer
    window.currentDeleteId = articleId;
    
    // Afficher le titre de l'article dans la modale
    const titleElement = document.querySelector('.delete-article-title');
    if (titleElement) {
        titleElement.textContent = `"${article.title}"`;
    }
    
    // Ouvrir la modale de confirmation
    const modal = document.getElementById('delete-modal');
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('show');
    }
}

function executeDelete() {
    const articleId = window.currentDeleteId;
    if (!articleId) return;
    
    if (!window.dataManager) {
        console.error('❌ DataManager non disponible');
        alert('Erreur: Système de données non disponible');
        return;
    }
    
    const success = window.dataManager.deleteArticle(articleId);
    
    if (success) {
        // Recharger la liste
        loadArticles();
        
        // Mettre à jour les statistiques
        if (typeof updateAdminStatsDisplay === 'function') {
            updateAdminStatsDisplay();
        }
        
        // Fermer la modale
        closeDeleteModal();
        window.currentDeleteId = null;
        
        // Afficher un message de succès
        alert('Article supprimé avec succès');
    } else {
        alert('Erreur lors de la suppression de l\'article');
    }
}

function viewArticle(articleId) {
    const articles = JSON.parse(localStorage.getItem('miwasexo-articles') || '[]');
    const article = articles.find(a => a.id === articleId);
    
    if (!article) {
        alert('Article non trouvé');
        return;
    }
    
    // Incrémenter les vues
    if (typeof incrementViewCount === 'function') {
        incrementViewCount(articleId);
    }
    
    // Ouvrir l'article
    if (typeof generateArticlePageHTML === 'function') {
        const articlePage = generateArticlePageHTML(articleId);
        const newWindow = window.open('', '_blank');
        newWindow.document.write(articlePage);
        newWindow.document.close();
    }
}

function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    
    // Gérer l'image (fichier local)
    let imageData = null;
    const imageFile = formData.get('image');
    
    if (imageFile && imageFile.size > 0) {
        // Convertir le fichier en base64 pour le stockage
        const reader = new FileReader();
        reader.onload = function(e) {
            imageData = e.target.result;
            saveArticleWithImage(imageData);
        };
        reader.readAsDataURL(imageFile);
    } else {
        // Pas d'image sélectionnée, utiliser l'image existante ou une par défaut
        const articles = JSON.parse(localStorage.getItem('miwasexo-articles') || '[]');
        const existingArticle = articles.find(a => a.id === currentEditingId);
        const defaultImage = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop';
        
        imageData = existingArticle ? existingArticle.image : defaultImage;
        saveArticleWithImage(imageData);
    }
}

function saveArticleWithImage(imageData) {
    if (!window.dataManager) {
        console.error('❌ DataManager non disponible');
        alert('Erreur: Système de données non disponible');
        return;
    }
    
    const form = document.getElementById('article-form');
    const formData = new FormData(form);
    
    const articleData = {
        title: formData.get('title'),
        category: formData.get('category'),
        author: formData.get('author'),
        image: imageData,
        summary: formData.get('summary'),
        content: formData.get('content'),
        tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag),
        date: new Date().toISOString(),
        views: currentEditingId ? (getArticleViews(currentEditingId)) : 0,
        status: 'draft', // Par défaut en brouillon
        featured: formData.get('featured') === 'on'
    };
    
    // Validation
    if (!articleData.title || !articleData.category || !articleData.author || !articleData.content) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
    }
    
    let success = false;
    
    if (currentEditingId) {
        // Modifier un article existant
        success = window.dataManager.updateArticle(currentEditingId, articleData);
    } else {
        // Créer un nouvel article
        success = window.dataManager.addArticle(articleData);
    }
    
    if (success) {
        // Fermer le modal
        closeModal();
        
        // Recharger la liste
        loadArticles();
        
        // Mettre à jour les statistiques
        if (typeof updateAdminStatsDisplay === 'function') {
            updateAdminStatsDisplay();
        }
        
        alert(currentEditingId ? 'Article modifié avec succès' : 'Article créé avec succès');
    } else {
        alert('Erreur lors de la sauvegarde de l\'article');
    }
}

function closeModal() {
    const modal = document.getElementById('article-modal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Fonction pour générer la page HTML d'un article
function generateArticlePageHTML(articleId) {
    const articles = JSON.parse(localStorage.getItem('miwasexo-articles') || '[]');
    const article = articles.find(a => a.id === articleId);
    
    if (!article) {
        return `<!DOCTYPE html><html><head><title>Article non trouvé</title></head><body><h1>Article non trouvé</h1></body></html>`;
    }
    
    const categoryNames = {
        'politique': 'Politique',
        'economie': 'Économie',
        'finance': 'Finance', 
        'societe': 'Société',
        'international': 'International'
    };
    
    return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <title>${article.title} - Miwasexo</title>
        <link rel="stylesheet" href="article-styles.css">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    </head>
    <body>
        <header class="article-header">
            <div class="container">
                <div class="header-content">
                    <a href="index.html" class="back-link">
                        <i class="fas fa-arrow-left"></i> Retour à l'accueil
                    </a>
                    <div class="header-logo">
                        <img src="logo.png" alt="Miwasexo" class="logo-img">
                    </div>
                </div>
            </div>
        </header>
        <main class="article-main">
            <div class="container">
                <article class="article-content">
                    <header class="article-header-content">
                        <div class="article-category">${categoryNames[article.category] || article.category}</div>
                        <h1 class="article-title">${article.title}</h1>
                        <div class="article-meta">
                            <span class="article-date">
                                <i class="fas fa-calendar"></i>
                                ${formatDate(article.date)}
                            </span>
                            <span class="article-author">
                                <i class="fas fa-user"></i>
                                ${article.author}
                            </span>
                            <span class="article-views">
                                <i class="fas fa-eye"></i>
                                ${article.views || 0} vues
                            </span>
                        </div>
                    </header>
                    <div class="article-image">
                        <img src="${article.image}" alt="${article.title}">
                    </div>
                    <div class="article-body">
                        ${formatContent(article.content)}
                    </div>
                    <footer class="article-footer">
                        <div class="article-tags">
                            <h3>Tags :</h3>
                            <div class="tags-list">
                                ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                            </div>
                        </div>
                    </footer>
                </article>
            </div>
        </main>
        <footer class="footer">
            <div class="container">
                <div class="footer-content">
                    <div class="footer-section">
                        <div class="footer-logo-img">
                            <img src="logo.png" alt="Miwasexo" class="footer-logo-image">
                        </div>
                        <p>Décryptage de l'actualité politique, économique et financière du Bénin.</p>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>&copy; 2024 Miwasexo. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    </body>
    </html>`;
}

function formatContent(content) {
    const paragraphs = content.split('\n\n').filter(p => p.trim());
    return paragraphs.map(paragraph => `<p>${paragraph.trim()}</p>`).join('');
}

function getArticleViews(articleId) {
    const articles = JSON.parse(localStorage.getItem('miwasexo-articles') || '[]');
    const article = articles.find(a => a.id === articleId);
    return article ? (article.views || 0) : 0;
}

// Fonction pour actualiser les articles (appelée par le bouton Actualiser)
function refreshArticles() {
    loadArticles();
    if (typeof updateAdminStatsDisplay === 'function') {
        updateAdminStatsDisplay();
    }
    console.log('Articles actualisés');
}


// Gestionnaire de fermeture du modal
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal') || e.target.classList.contains('close')) {
        closeModal();
    }
});

// Fermer avec la touche Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Fonctions pour la gestion des modales de suppression
function closeDeleteModal() {
    const modal = document.getElementById('delete-modal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('show');
    }
}

function confirmDelete() {
    executeDelete();
}

// Fonction pour notifier les changements d'articles aux autres onglets
function notifyArticlesChanged() {
    // Utiliser localStorage event pour notifier les autres onglets
    const event = new Event('storage');
    event.key = 'miwasexo-articles';
    event.newValue = localStorage.getItem('miwasexo-articles');
    window.dispatchEvent(event);
    
    // Alternative: utiliser un événement personnalisé
    window.dispatchEvent(new CustomEvent('articlesChanged', {
        detail: { timestamp: Date.now() }
    }));
}


// Fonctions pour la gestion des paramètres admin
function showAdminSettings() {
    const modal = document.getElementById('admin-settings-modal');
    const adminInfo = authManager.getAdminInfo();
    
    if (adminInfo) {
        document.getElementById('settings-username').value = adminInfo.username;
        document.getElementById('settings-email').value = adminInfo.email;
        document.getElementById('settings-fullname').value = adminInfo.fullName;
    }
    
    modal.style.display = 'flex';
}

function closeAdminSettings() {
    const modal = document.getElementById('admin-settings-modal');
    modal.style.display = 'none';
}

function saveAdminSettings() {
    const username = document.getElementById('settings-username').value;
    const email = document.getElementById('settings-email').value;
    const fullName = document.getElementById('settings-fullname').value;
    
    if (!username || !email || !fullName) {
        alert('Veuillez remplir tous les champs');
        return;
    }
    
    const success = authManager.updateAdminCredentials(null, email, fullName);
    
    if (success) {
        alert('Paramètres mis à jour avec succès');
        closeAdminSettings();
        updateWelcomeMessage();
    } else {
        alert('Erreur lors de la mise à jour des paramètres');
    }
}

function showPasswordChange() {
    const modal = document.getElementById('password-change-modal');
    modal.style.display = 'flex';
}

function closePasswordChange() {
    const modal = document.getElementById('password-change-modal');
    modal.style.display = 'none';
}

function savePasswordChange() {
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-new-password').value;
    
    if (!currentPassword || !newPassword || !confirmPassword) {
        alert('Veuillez remplir tous les champs');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        alert('Les nouveaux mots de passe ne correspondent pas');
        return;
    }
    
    if (newPassword.length < 6) {
        alert('Le nouveau mot de passe doit contenir au moins 6 caractères');
        return;
    }
    
    // Vérifier le mot de passe actuel
    try {
        const storedCredentials = JSON.parse(localStorage.getItem('miwasexo-admin-credentials'));
        if (storedCredentials.password !== currentPassword) {
            alert('Le mot de passe actuel est incorrect');
            return;
        }
        
        const success = authManager.updateAdminCredentials(newPassword, null, null);
        
        if (success) {
            alert('Mot de passe changé avec succès');
            closePasswordChange();
            // Vider les champs
            document.getElementById('current-password').value = '';
            document.getElementById('new-password').value = '';
            document.getElementById('confirm-new-password').value = '';
        } else {
            alert('Erreur lors du changement de mot de passe');
        }
    } catch (error) {
        alert('Erreur: ' + error.message);
    }
}

// Fonctions de gestion des données et synchronisation
function setupDataListeners() {
    // Écouter les changements de données
    window.addEventListener('dataChanged', (event) => {
        console.log('📊 Données mises à jour:', event.detail);
        handleDataChange(event.detail);
    });
    
    // Écouter les mises à jour d'articles
    window.addEventListener('articlesUpdated', (event) => {
        console.log('📰 Articles mis à jour');
        loadArticles();
        updateArticlesStats();
    });
    
    // Écouter les mises à jour d'analytiques
    window.addEventListener('analyticsUpdated', (event) => {
        console.log('📈 Analytiques mises à jour');
        if (typeof loadAnalytics === 'function') {
            loadAnalytics();
        }
    });
}

function handleDataChange(changeDetail) {
    const { type, data, timestamp } = changeDetail;
    
    switch (type) {
        case 'miwasexo-articles':
            loadArticles();
            updateArticlesStats();
            break;
        case 'miwasexo-analytics':
            if (typeof loadAnalytics === 'function') {
                loadAnalytics();
            }
            break;
        case 'miwasexo-settings':
            if (typeof loadSettings === 'function') {
                loadSettings();
            }
            break;
    }
}

function getArticleViews(articleId) {
    if (!window.dataManager) {
        return 0;
    }
    
    const article = window.dataManager.getArticle(articleId);
    return article ? (article.views || 0) : 0;
}

function updateArticlesStats() {
    console.log('📈 Mise à jour des statistiques des articles');
    
    if (!window.dataManager) {
        console.error('❌ DataManager non disponible');
        return;
    }
    
    const articles = window.dataManager.getArticles();
    let totalArticles = articles.length;
    let totalViews = 0;
    let publishedCount = 0;
    let draftsCount = 0;
    
    articles.forEach(article => {
        const views = parseInt(article.views || 0);
        const status = article.status || '';
        
        totalViews += views;
        
        if (status === 'published') {
            publishedCount++;
        } else if (status === 'draft') {
            draftsCount++;
        }
    });
    
    // Mettre à jour les éléments d'affichage
    const countElement = document.getElementById('articles-count');
    const viewsElement = document.getElementById('articles-views');
    const publishedElement = document.getElementById('articles-published');
    const draftsElement = document.getElementById('articles-drafts');
    
    if (countElement) countElement.textContent = totalArticles;
    if (viewsElement) viewsElement.textContent = totalViews.toLocaleString();
    if (publishedElement) publishedElement.textContent = publishedCount;
    if (draftsElement) draftsElement.textContent = draftsCount;
}

// Exposer les fonctions globalement pour admin-script.js
window.editArticleFromMain = editArticle;
window.deleteArticleFromMain = deleteArticle;
window.showAddFormFromMain = showAddForm;
window.viewArticleFromMain = viewArticle;
window.closeDeleteModal = closeDeleteModal;
window.confirmDelete = confirmDelete;
window.showAdminSettings = showAdminSettings;
window.closeAdminSettings = closeAdminSettings;
window.saveAdminSettings = saveAdminSettings;
window.showPasswordChange = showPasswordChange;
window.closePasswordChange = closePasswordChange;
window.savePasswordChange = savePasswordChange;
window.setupDataListeners = setupDataListeners;
window.updateArticlesStats = updateArticlesStats;

// Fonctions d'analytiques
window.loadAnalytics = loadAnalytics;
window.refreshAnalytics = refreshAnalytics;
window.exportAnalytics = exportAnalytics;

// Fonctions de paramètres
window.loadSettings = loadSettings;
window.showThemeSettings = showThemeSettings;
window.showLanguageSettings = showLanguageSettings;
window.showCategorySettings = showCategorySettings;
window.showMediaSettings = showMediaSettings;
window.exportAllData = exportAllData;
window.importData = importData;
