// Articles Page Manager - Miwasexo
class ArticlesPageManager {
    constructor() {
        this.articles = [];
        this.currentFilter = 'all';
        this.currentSort = 'date';
        this.init();
    }

    init() {
        this.loadArticles();
        this.setupEventListeners();
        this.updateStats();
        this.setupSearch();
        this.setupFilters();
        this.checkAdminAccess();
    }

    setupEventListeners() {
        // Écouter les changements dans localStorage pour les articles
        window.addEventListener('storage', (e) => {
            if (e.key === 'miwasexo-articles' || e.key === 'miwasexo-articles-updated') {
                this.loadArticles();
            }
        });

        // Écouter les événements personnalisés pour les mises à jour
        window.addEventListener('articlesUpdated', () => {
            this.loadArticles();
        });

        // Écouter les changements de données via DataManager
        window.addEventListener('dataChanged', (event) => {
            const { type } = event.detail;
            if (type === 'miwasexo-articles') {
                this.loadArticles();
            }
        });

        // Newsletter form
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterSubscription(e);
            });
        }
    }

    setupSearch() {
        // Créer la barre de recherche si elle n'existe pas
        const articlesHeader = document.querySelector('.articles-header');
        if (articlesHeader && !document.getElementById('search-container')) {
            const searchHTML = `
                <div id="search-container" class="search-container">
                    <div class="search-input-group">
                        <input type="text" id="search-input" placeholder="Rechercher un article...">
                        <button type="button" id="search-btn" class="search-btn">
                            <i class="fas fa-search"></i>
                        </button>
                        <button type="button" id="clear-search" class="clear-btn" style="display: none;">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            `;
            articlesHeader.insertAdjacentHTML('afterend', searchHTML);

            // Event listeners pour la recherche
            const searchInput = document.getElementById('search-input');
            const searchBtn = document.getElementById('search-btn');
            const clearBtn = document.getElementById('clear-search');

            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    this.handleSearch(e.target.value);
                });
            }

            if (searchBtn) {
                searchBtn.addEventListener('click', () => {
                    this.handleSearch(searchInput.value);
                });
            }

            if (clearBtn) {
                clearBtn.addEventListener('click', () => {
                    searchInput.value = '';
                    this.handleSearch('');
                    clearBtn.style.display = 'none';
                });
            }
        }
    }

    setupFilters() {
        // Créer les filtres si ils n'existent pas
        const searchContainer = document.getElementById('search-container');
        if (searchContainer && !document.getElementById('filters-container')) {
            const filtersHTML = `
                <div id="filters-container" class="filters-container">
                    <div class="filter-group">
                        <label for="category-filter">Catégorie:</label>
                        <select id="category-filter" class="filter-select">
                            <option value="all">Toutes les catégories</option>
                            <option value="politique">Politique</option>
                            <option value="economie">Économie</option>
                            <option value="finance">Finance</option>
                            <option value="societe">Société</option>
                            <option value="international">International</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label for="sort-filter">Trier par:</label>
                        <select id="sort-filter" class="filter-select">
                            <option value="date">Date (récent)</option>
                            <option value="date-old">Date (ancien)</option>
                            <option value="title">Titre (A-Z)</option>
                            <option value="views">Vues (plus vus)</option>
                        </select>
                    </div>
                    <button type="button" id="reset-filters" class="reset-filters-btn">
                        <i class="fas fa-refresh"></i> Réinitialiser
                    </button>
                </div>
            `;
            searchContainer.insertAdjacentHTML('afterend', filtersHTML);

            // Event listeners pour les filtres
            const categoryFilter = document.getElementById('category-filter');
            const sortFilter = document.getElementById('sort-filter');
            const resetBtn = document.getElementById('reset-filters');

            if (categoryFilter) {
                categoryFilter.addEventListener('change', (e) => {
                    this.currentFilter = e.target.value;
                    this.renderArticles();
                });
            }

            if (sortFilter) {
                sortFilter.addEventListener('change', (e) => {
                    this.currentSort = e.target.value;
                    this.renderArticles();
                });
            }

            if (resetBtn) {
                resetBtn.addEventListener('click', () => {
                    this.resetFilters();
                });
            }
        }
    }

    loadArticles() {
        try {
            if (window.dataManager) {
                // Utiliser le DataManager si disponible
                this.articles = window.dataManager.getArticles();
            } else {
                // Fallback vers localStorage direct
                const storedArticles = localStorage.getItem('miwasexo-articles');
                this.articles = storedArticles ? JSON.parse(storedArticles) : [];
            }
            
            this.renderArticles();
            this.updateStats();
        } catch (error) {
            console.error('Erreur lors du chargement des articles:', error);
            this.articles = [];
            this.showNoArticlesAnimation();
        }
    }

    renderArticles() {
        const container = document.getElementById('articles-container');
        const noArticlesAnimation = document.getElementById('no-articles-animation');

        if (!container) return;

        let filteredArticles = this.filterArticles(this.articles);
        filteredArticles = this.sortArticles(filteredArticles);

        if (filteredArticles.length === 0) {
            container.innerHTML = '';
            noArticlesAnimation.style.display = 'flex';
            return;
        }

        noArticlesAnimation.style.display = 'none';
        container.innerHTML = filteredArticles.map(article => this.createArticleCard(article)).join('');
    }

    filterArticles(articles) {
        if (this.currentFilter === 'all') {
            return articles;
        }
        return articles.filter(article => 
            article.category && article.category.toLowerCase() === this.currentFilter.toLowerCase()
        );
    }

    sortArticles(articles) {
        switch (this.currentSort) {
            case 'date':
                return articles.sort((a, b) => new Date(b.date) - new Date(a.date));
            case 'date-old':
                return articles.sort((a, b) => new Date(a.date) - new Date(b.date));
            case 'title':
                return articles.sort((a, b) => a.title.localeCompare(b.title));
            case 'views':
                return articles.sort((a, b) => (b.views || 0) - (a.views || 0));
            default:
                return articles;
        }
    }

    handleSearch(query) {
        const clearBtn = document.getElementById('clear-search');
        if (clearBtn) {
            clearBtn.style.display = query ? 'block' : 'none';
        }

        if (!query.trim()) {
            this.renderArticles();
            return;
        }

        const container = document.getElementById('articles-container');
        const noArticlesAnimation = document.getElementById('no-articles-animation');

        if (!container) return;

        const filteredArticles = this.articles.filter(article => 
            article.title.toLowerCase().includes(query.toLowerCase()) ||
            article.content.toLowerCase().includes(query.toLowerCase()) ||
            (article.tags && article.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())))
        );

        if (filteredArticles.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>Aucun résultat trouvé</h3>
                    <p>Essayez avec d'autres mots-clés</p>
                </div>
            `;
            noArticlesAnimation.style.display = 'none';
        } else {
            noArticlesAnimation.style.display = 'none';
            container.innerHTML = filteredArticles.map(article => this.createArticleCard(article)).join('');
        }
    }

    resetFilters() {
        this.currentFilter = 'all';
        this.currentSort = 'date';
        
        const categoryFilter = document.getElementById('category-filter');
        const sortFilter = document.getElementById('sort-filter');
        const searchInput = document.getElementById('search-input');
        const clearBtn = document.getElementById('clear-search');

        if (categoryFilter) categoryFilter.value = 'all';
        if (sortFilter) sortFilter.value = 'date';
        if (searchInput) searchInput.value = '';
        if (clearBtn) clearBtn.style.display = 'none';

        this.renderArticles();
    }

    createArticleCard(article) {
        const formattedDate = new Date(article.date).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const truncatedContent = article.content.length > 150 
            ? article.content.substring(0, 150) + '...' 
            : article.content;

        return `
            <article class="article-card" data-article-id="${article.id}">
                <div class="article-image">
                    <img src="${article.image || 'logo.png'}" 
                         alt="${article.title}" 
                         onerror="this.src='logo.png'">
                    <div class="article-category">${article.category || 'Actualité'}</div>
                </div>
                <div class="article-content">
                    <h3 class="article-title">${article.title}</h3>
                    <p class="article-summary">${truncatedContent}</p>
                    <div class="article-meta">
                        <div class="article-date">
                            <i class="fas fa-calendar"></i>
                            ${formattedDate}
                        </div>
                        <div class="article-author">
                            <i class="fas fa-user"></i>
                            ${article.author || 'Miwasexo'}
                        </div>
                        <div class="article-views">
                            <i class="fas fa-eye"></i>
                            ${article.views || 0} vues
                        </div>
                    </div>
                    <div class="article-tags">
                        ${(article.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <button class="read-more-btn" onclick="articlesPageManager.showArticleDetails('${article.id}')">
                        Lire la suite <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </article>
        `;
    }

    showArticleDetails(articleId) {
        const article = this.articles.find(a => a.id === articleId);
        if (!article) return;

        // Créer une modal pour afficher l'article complet
        const modal = document.createElement('div');
        modal.className = 'modal article-modal';
        modal.style.display = 'flex';
        
        modal.innerHTML = `
            <div class="modal-content article-modal-content">
                <div class="modal-header">
                    <h2>${article.title}</h2>
                    <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="article-full-image">
                        <img src="${article.image || 'logo.png'}" 
                             alt="${article.title}"
                             onerror="this.src='logo.png'">
                    </div>
                    <div class="article-full-meta">
                        <span class="article-category">${article.category || 'Actualité'}</span>
                        <span class="article-date">
                            <i class="fas fa-calendar"></i>
                            ${new Date(article.date).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </span>
                        <span class="article-author">
                            <i class="fas fa-user"></i>
                            ${article.author || 'Miwasexo'}
                        </span>
                        <span class="article-views">
                            <i class="fas fa-eye"></i>
                            ${article.views || 0} vues
                        </span>
                    </div>
                    <div class="article-full-content">
                        ${article.content.replace(/\n/g, '<br>')}
                    </div>
                    <div class="article-full-tags">
                        ${(article.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Fermer la modal en cliquant à l'extérieur
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Incrémenter le compteur de vues
        this.incrementArticleViews(articleId);
    }

    incrementArticleViews(articleId) {
        if (window.dataManager) {
            // Utiliser le DataManager pour incrémenter les vues
            window.dataManager.incrementArticleViews(articleId);
            // Recharger les articles pour avoir les données mises à jour
            this.loadArticles();
        } else {
            // Fallback vers localStorage direct
            const article = this.articles.find(a => a.id === articleId);
            if (article) {
                article.views = (article.views || 0) + 1;
                this.saveArticles();
            }
        }
    }

    saveArticles() {
        try {
            if (window.dataManager) {
                // Utiliser le DataManager pour sauvegarder
                window.dataManager.saveArticles(this.articles);
            } else {
                // Fallback vers localStorage direct
                localStorage.setItem('miwasexo-articles', JSON.stringify(this.articles));
            }
            this.updateStats();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des articles:', error);
        }
    }

    updateStats() {
        const totalArticlesElement = document.getElementById('total-articles');
        if (totalArticlesElement) {
            totalArticlesElement.textContent = this.articles.length;
        }
    }

    showNoArticlesAnimation() {
        const container = document.getElementById('articles-container');
        const noArticlesAnimation = document.getElementById('no-articles-animation');
        
        if (container) container.innerHTML = '';
        if (noArticlesAnimation) noArticlesAnimation.style.display = 'flex';
    }

    handleNewsletterSubscription(event) {
        const email = event.target.querySelector('input[type="email"]').value;
        
        if (!email) {
            alert('Veuillez saisir une adresse email valide.');
            return;
        }

        // Simuler l'inscription à la newsletter
        const subscribers = JSON.parse(localStorage.getItem('miwasexo-newsletter') || '[]');
        
        if (subscribers.includes(email)) {
            alert('Cette adresse email est déjà inscrite à notre newsletter.');
            return;
        }

        subscribers.push(email);
        localStorage.setItem('miwasexo-newsletter', JSON.stringify(subscribers));
        
        // Afficher un message de succès
        const button = event.target.querySelector('.subscribe-btn');
        const originalText = button.textContent;
        button.textContent = 'Inscrit !';
        button.style.background = '#28a745';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
            event.target.reset();
        }, 2000);

        alert('Merci ! Vous êtes maintenant inscrit à notre newsletter.');
    }
}

// Initialisation quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    // Vérifier si nous sommes sur la page articles
    if (document.getElementById('articles-container')) {
        window.articlesPageManager = new ArticlesPageManager();
    }
});

// Fonction globale pour afficher les détails d'un article
window.showArticleDetails = function(articleId) {
    if (window.articlesPageManager) {
        window.articlesPageManager.showArticleDetails(articleId);
    }
};

// Fonction pour vérifier l'accès admin et afficher le bouton
ArticlesPageManager.prototype.checkAdminAccess = function() {
    // Attendre que authManager soit disponible
    const checkAuth = () => {
        if (window.authManager && window.authManager.isInitialized) {
            const adminButtonContainer = document.getElementById('admin-button-container');
            if (adminButtonContainer) {
                if (window.authManager.isAuthenticated) {
                    adminButtonContainer.style.display = 'block';
                    console.log('✅ Bouton admin affiché pour utilisateur connecté');
                } else {
                    adminButtonContainer.style.display = 'none';
                    console.log('ℹ️ Bouton admin masqué - utilisateur non connecté');
                }
            }
        } else {
            // Réessayer après un court délai
            setTimeout(checkAuth, 200);
        }
    };
    
    checkAuth();
};