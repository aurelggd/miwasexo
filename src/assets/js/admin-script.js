// Admin Script - Fonctions supplémentaires pour l'administration

function updateAdminStatsDisplay() {
    try {
    const articles = JSON.parse(localStorage.getItem('miwasexo-articles') || '[]');
    const totalViews = articles.reduce((sum, article) => sum + (article.views || 0), 0);
        
        const totalArticlesElement = document.getElementById('total-articles');
        if (totalArticlesElement) {
            totalArticlesElement.textContent = articles.length;
        }
        
        const totalViewsElement = document.getElementById('total-views');
        if (totalViewsElement) {
            totalViewsElement.textContent = totalViews;
        }
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const articlesThisMonth = articles.filter(article => {
        const articleDate = new Date(article.date);
        return articleDate.getMonth() === currentMonth && articleDate.getFullYear() === currentYear;
        });
        
        const articlesThisMonthElement = document.getElementById('articles-this-month');
        if (articlesThisMonthElement) {
            articlesThisMonthElement.textContent = articlesThisMonth.length;
        }
        
    } catch (error) {
        console.error('Erreur lors de la mise à jour des statistiques:', error);
    }
}

function createDemoArticle() {
    const demoArticle = {
        id: 'demo_' + Date.now(),
        title: 'Article de démonstration - Miwasexo',
        category: 'politique',
        author: 'Équipe Miwasexo',
        image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop',
        summary: 'Cet article de démonstration vous permet de tester les fonctionnalités de Miwasexo.',
        content: 'Cet article de démonstration vous permet de découvrir les fonctionnalités de la plateforme Miwasexo.',
        tags: ['démonstration', 'test', 'miwasexo'],
        date: new Date().toISOString(),
        views: 0
    };
    
    try {
        const articles = JSON.parse(localStorage.getItem('miwasexo-articles') || '[]');
        articles.push(demoArticle);
        localStorage.setItem('miwasexo-articles', JSON.stringify(articles));
        
    if (typeof loadArticles === 'function') {
        loadArticles();
        }
        
        updateAdminStatsDisplay();
        alert('Article de démonstration créé avec succès');
    } catch (error) {
        console.error('Erreur lors de la création de l\'article de démonstration:', error);
        alert('Erreur lors de la création de l\'article de démonstration');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (document.getElementById('admin-welcome')) {
            updateAdminStatsDisplay();
        }
    }, 500);
});

window.updateAdminStatsDisplay = updateAdminStatsDisplay;
window.createDemoArticle = createDemoArticle;