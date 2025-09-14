// Data Manager - Gestion centralisée des données pour Miwasexo
// Organise les données entre les sessions Articles, Analytiques et Paramètres

class DataManager {
    constructor() {
        this.storageKeys = {
            articles: 'miwasexo-articles',
            analytics: 'miwasexo-analytics',
            settings: 'miwasexo-settings',
            adminCredentials: 'miwasexo-admin-credentials',
            sessionData: 'miwasexo-session-data'
        };
        
        this.initializeData();
        this.setupEventListeners();
    }

    // Initialisation des données
    initializeData() {
        console.log('📊 Initialisation du DataManager');
        
        // Initialiser les données par défaut si elles n'existent pas
        this.initializeDefaultData();
        
        // Charger les données existantes
        this.loadAllData();
    }

    initializeDefaultData() {
        // Articles par défaut
        if (!localStorage.getItem(this.storageKeys.articles)) {
            const defaultArticles = [
                {
                    id: 'welcome_article',
                    title: 'Bienvenue sur Miwasexo',
                    category: 'politique',
                    author: 'Équipe Miwasexo',
                    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop',
                    summary: 'Découvrez notre plateforme de décryptage de l\'actualité politique, économique et financière du Bénin.',
                    content: 'Miwasexo est votre source d\'information privilégiée pour comprendre les enjeux politiques, économiques et financiers du Bénin. Notre équipe d\'analystes vous propose des décryptages approfondis et des analyses pertinentes.',
                    tags: ['bienvenue', 'miwasexo', 'actualité'],
                    date: new Date().toISOString(),
                    views: 0,
                    status: 'published',
                    featured: true
                }
            ];
            localStorage.setItem(this.storageKeys.articles, JSON.stringify(defaultArticles));
        }

        // Analytiques par défaut
        if (!localStorage.getItem(this.storageKeys.analytics)) {
            const defaultAnalytics = {
                totalViews: 0,
                totalArticles: 1,
                uniqueVisitors: 0,
                monthlyStats: {
                    views: 0,
                    articles: 1,
                    visitors: 0
                },
                categoryStats: {
                    politique: { articles: 1, views: 0 },
                    economie: { articles: 0, views: 0 },
                    societe: { articles: 0, views: 0 },
                    international: { articles: 0, views: 0 }
                },
                dailyStats: {},
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem(this.storageKeys.analytics, JSON.stringify(defaultAnalytics));
        }

        // Paramètres par défaut
        if (!localStorage.getItem(this.storageKeys.settings)) {
            const defaultSettings = {
                site: {
                    name: 'Miwasexo',
                    description: 'Décryptage de l\'actualité politique, économique et financière',
                    logo: '../assets/images/logo.png',
                    theme: 'default',
                    language: 'fr'
                },
                admin: {
                    notifications: true,
                    autoSave: true,
                    backupFrequency: 'daily',
                    analyticsEnabled: true
                },
                articles: {
                    defaultCategory: 'politique',
                    autoPublish: false,
                    maxImageSize: 5, // MB
                    allowedImageTypes: ['jpg', 'jpeg', 'png', 'webp']
                },
                analytics: {
                    trackViews: true,
                    trackVisitors: true,
                    retentionDays: 365
                }
            };
            localStorage.setItem(this.storageKeys.settings, JSON.stringify(defaultSettings));
        }

        // Données de session par défaut
        if (!localStorage.getItem(this.storageKeys.sessionData)) {
            const defaultSessionData = {
                currentTab: 'articles',
                lastActiveTab: 'articles',
                userPreferences: {
                    viewMode: 'grid', // grid ou table
                    itemsPerPage: 12,
                    sortBy: 'newest'
                },
                filters: {
                    category: '',
                    status: '',
                    search: ''
                },
                lastLogin: null,
                sessionStart: new Date().toISOString()
            };
            localStorage.setItem(this.storageKeys.sessionData, JSON.stringify(defaultSessionData));
        }
    }

    // Gestion des articles
    getArticles() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKeys.articles) || '[]');
        } catch (error) {
            console.error('Erreur lors de la récupération des articles:', error);
            return [];
        }
    }

    saveArticles(articles) {
        try {
            localStorage.setItem(this.storageKeys.articles, JSON.stringify(articles));
            this.updateAnalytics('articles', articles.length);
            this.notifyDataChange('articles', articles);
            return true;
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des articles:', error);
            return false;
        }
    }

    addArticle(article) {
        const articles = this.getArticles();
        article.id = article.id || 'article_' + Date.now();
        article.date = article.date || new Date().toISOString();
        article.views = article.views || 0;
        article.status = article.status || 'draft';
        
        articles.push(article);
        return this.saveArticles(articles);
    }

    updateArticle(articleId, updates) {
        const articles = this.getArticles();
        const index = articles.findIndex(a => a.id === articleId);
        
        if (index !== -1) {
            articles[index] = { ...articles[index], ...updates };
            return this.saveArticles(articles);
        }
        return false;
    }

    deleteArticle(articleId) {
        const articles = this.getArticles();
        const filteredArticles = articles.filter(a => a.id !== articleId);
        return this.saveArticles(filteredArticles);
    }

    getArticle(articleId) {
        const articles = this.getArticles();
        return articles.find(a => a.id === articleId);
    }

    // Gestion des analytiques
    getAnalytics() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKeys.analytics) || '{}');
        } catch (error) {
            console.error('Erreur lors de la récupération des analytiques:', error);
            return {};
        }
    }

    updateAnalytics(type, data) {
        const analytics = this.getAnalytics();
        
        switch (type) {
            case 'articles':
                analytics.totalArticles = data;
                break;
            case 'views':
                analytics.totalViews += data;
                analytics.monthlyStats.views += data;
                break;
            case 'visitor':
                analytics.uniqueVisitors += data;
                analytics.monthlyStats.visitors += data;
                break;
        }
        
        analytics.lastUpdated = new Date().toISOString();
        
        try {
            localStorage.setItem(this.storageKeys.analytics, JSON.stringify(analytics));
            this.notifyDataChange('analytics', analytics);
            return true;
        } catch (error) {
            console.error('Erreur lors de la mise à jour des analytiques:', error);
            return false;
        }
    }

    incrementArticleViews(articleId) {
        const article = this.getArticle(articleId);
        if (article) {
            article.views = (article.views || 0) + 1;
            this.updateArticle(articleId, { views: article.views });
            this.updateAnalytics('views', 1);
            return true;
        }
        return false;
    }

    getCategoryStats() {
        const articles = this.getArticles();
        const stats = {};
        
        articles.forEach(article => {
            const category = article.category || 'general';
            if (!stats[category]) {
                stats[category] = { articles: 0, views: 0 };
            }
            stats[category].articles++;
            stats[category].views += article.views || 0;
        });
        
        return stats;
    }

    // Gestion des paramètres
    getSettings() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKeys.settings) || '{}');
        } catch (error) {
            console.error('Erreur lors de la récupération des paramètres:', error);
            return {};
        }
    }

    updateSettings(settings) {
        try {
            const currentSettings = this.getSettings();
            const updatedSettings = { ...currentSettings, ...settings };
            localStorage.setItem(this.storageKeys.settings, JSON.stringify(updatedSettings));
            this.notifyDataChange('settings', updatedSettings);
            return true;
        } catch (error) {
            console.error('Erreur lors de la mise à jour des paramètres:', error);
            return false;
        }
    }

    getSetting(path) {
        const settings = this.getSettings();
        return this.getNestedValue(settings, path);
    }

    setSetting(path, value) {
        const settings = this.getSettings();
        this.setNestedValue(settings, path, value);
        return this.updateSettings(settings);
    }

    // Gestion des données de session
    getSessionData() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKeys.sessionData) || '{}');
        } catch (error) {
            console.error('Erreur lors de la récupération des données de session:', error);
            return {};
        }
    }

    updateSessionData(data) {
        try {
            const currentSession = this.getSessionData();
            const updatedSession = { ...currentSession, ...data };
            localStorage.setItem(this.storageKeys.sessionData, JSON.stringify(updatedSession));
            return true;
        } catch (error) {
            console.error('Erreur lors de la mise à jour des données de session:', error);
            return false;
        }
    }

    setCurrentTab(tabName) {
        const sessionData = this.getSessionData();
        sessionData.lastActiveTab = sessionData.currentTab;
        sessionData.currentTab = tabName;
        return this.updateSessionData(sessionData);
    }

    getCurrentTab() {
        const sessionData = this.getSessionData();
        return sessionData.currentTab || 'articles';
    }

    // Utilitaires
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current && current[key], obj);
    }

    setNestedValue(obj, path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((current, key) => {
            if (!current[key]) current[key] = {};
            return current[key];
        }, obj);
        target[lastKey] = value;
    }

    // Chargement de toutes les données
    loadAllData() {
        this.articles = this.getArticles();
        this.analytics = this.getAnalytics();
        this.settings = this.getSettings();
        this.sessionData = this.getSessionData();
        
        console.log('📊 Données chargées:', {
            articles: this.articles.length,
            analytics: Object.keys(this.analytics).length,
            settings: Object.keys(this.settings).length
        });
    }

    // Notifications de changement
    setupEventListeners() {
        // Écouter les changements de localStorage
        window.addEventListener('storage', (e) => {
            if (Object.values(this.storageKeys).includes(e.key)) {
                this.loadAllData();
                this.notifyDataChange(e.key, e.newValue);
            }
        });
    }

    notifyDataChange(type, data) {
        // Déclencher des événements personnalisés
        const event = new CustomEvent('dataChanged', {
            detail: { type, data, timestamp: Date.now() }
        });
        window.dispatchEvent(event);
        
        // Notifications spécifiques
        switch (type) {
            case this.storageKeys.articles:
                window.dispatchEvent(new CustomEvent('articlesUpdated', { detail: data }));
                break;
            case this.storageKeys.analytics:
                window.dispatchEvent(new CustomEvent('analyticsUpdated', { detail: data }));
                break;
            case this.storageKeys.settings:
                window.dispatchEvent(new CustomEvent('settingsUpdated', { detail: data }));
                break;
        }
    }

    // Sauvegarde et restauration
    exportData() {
        const data = {
            articles: this.getArticles(),
            analytics: this.getAnalytics(),
            settings: this.getSettings(),
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `miwasexo-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    if (data.articles) {
                        localStorage.setItem(this.storageKeys.articles, JSON.stringify(data.articles));
                    }
                    if (data.analytics) {
                        localStorage.setItem(this.storageKeys.analytics, JSON.stringify(data.analytics));
                    }
                    if (data.settings) {
                        localStorage.setItem(this.storageKeys.settings, JSON.stringify(data.settings));
                    }
                    
                    this.loadAllData();
                    resolve(true);
                } catch (error) {
                    reject(error);
                }
            };
            reader.readAsText(file);
        });
    }

    // Statistiques globales
    getGlobalStats() {
        const articles = this.getArticles();
        const analytics = this.getAnalytics();
        
        return {
            totalArticles: articles.length,
            publishedArticles: articles.filter(a => a.status === 'published').length,
            draftArticles: articles.filter(a => a.status === 'draft').length,
            totalViews: analytics.totalViews || 0,
            uniqueVisitors: analytics.uniqueVisitors || 0,
            categories: this.getCategoryStats(),
            lastUpdated: analytics.lastUpdated
        };
    }
}

// Instance globale du DataManager
window.dataManager = new DataManager();

// Exporter pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataManager;
}
