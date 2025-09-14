// Navigation mobile améliorée
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const body = document.body;

// Fonction pour ouvrir/fermer le menu mobile
function toggleMobileMenu() {
    const isActive = hamburger.classList.contains('active');
    
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Empêcher le scroll du body quand le menu est ouvert
    if (!isActive) {
        body.classList.add('no-scroll');
        // Empêcher le scroll sur iOS
        document.addEventListener('touchmove', preventScroll, { passive: false });
    } else {
        body.classList.remove('no-scroll');
        document.removeEventListener('touchmove', preventScroll);
    }
}

// Fonction pour empêcher le scroll
function preventScroll(e) {
    e.preventDefault();
}

// Event listeners pour le menu mobile
if (hamburger && navMenu) {
    hamburger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMobileMenu();
    });
    
    // Fermer le menu en cliquant à l'extérieur
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !hamburger.contains(e.target)) {
            toggleMobileMenu();
        }
    });
    
    // Fermer le menu avec la touche Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
    
    // Fermer le menu mobile quand on clique sur un lien
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    }));
    
    // Gestion des gestes tactiles pour fermer le menu
    let startX = 0;
    let startY = 0;
    
    navMenu.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    navMenu.addEventListener('touchmove', (e) => {
        if (!navMenu.classList.contains('active')) return;
        
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = startX - currentX;
        const diffY = startY - currentY;
        
        // Si le swipe horizontal est plus important que le vertical
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) { // Swipe vers la gauche
                toggleMobileMenu();
            }
        }
    });
}

// Fonction globale pour gérer le clic sur Admin
function handleAdminClick(event) {
    event.preventDefault();
    event.stopPropagation();
    
    console.log('🔐 Admin button clicked!');
    
    // Fermer toute modale de suppression ouverte
    const deleteModal = document.getElementById('delete-modal');
    if (deleteModal) {
        deleteModal.style.display = 'none';
        deleteModal.classList.remove('show');
    }
    
    // Vérifier si des identifiants admin existent
    if (typeof authManager !== 'undefined' && !authManager.hasAdminCredentials()) {
        console.log('⚠️ Aucun identifiant admin configuré, redirection vers la configuration');
        window.location.href = 'setup.html';
        return false;
    }
    
    // Vérifier l'authentification
    if (typeof authManager !== 'undefined' && authManager && authManager.isAuthenticated) {
        console.log('✅ Utilisateur authentifié, redirection vers admin.html');
        window.location.href = 'admin.html';
    } else {
        console.log('🔑 Utilisateur non authentifié, affichage du modal de connexion');
        // Afficher le modal de connexion
        if (authManager && authManager.showLoginModal) {
            authManager.showLoginModal();
        } else {
            console.error('❌ AuthManager non disponible, fallback');
            const modal = document.getElementById('login-modal');
            if (modal) {
                modal.style.display = 'flex';
                modal.classList.add('show');
            }
        }
    }
    
    return false;
}

// Fonction pour basculer la visibilité du mot de passe (définie dans auth.js)
// Cette fonction est maintenant définie dans auth.js pour éviter les conflits

// Protection du lien admin - à exécuter après le chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    // Vérifier si des identifiants admin existent
    setTimeout(() => {
        if (typeof authManager !== 'undefined' && !authManager.hasAdminCredentials()) {
            console.log('⚠️ Aucun identifiant admin configuré, redirection vers la configuration');
            window.location.href = 'setup.html';
            return;
        }
    }, 1000);
    
    const adminLink = document.querySelector('.admin-nav .nav-link');
    
    if (adminLink && !adminLink.onclick) {
        adminLink.addEventListener('click', (e) => {
            handleAdminClick(e);
        });
    }
    
    // Protection globale pour les éléments avec data-prevent-delete
    document.addEventListener('click', (e) => {
        if (e.target.closest('[data-prevent-delete="true"]')) {
            e.stopPropagation();
            
            const deleteModal = document.getElementById('delete-modal');
            if (deleteModal) {
                deleteModal.style.display = 'none';
                deleteModal.classList.remove('show');
            }
        }
    });
});

// Smooth scroll pour les liens d'ancrage
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70; // Compenser la hauteur de la navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Changement de style de la navbar au scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = '#ffffff';
        navbar.style.backdropFilter = 'none';
    }
});

// Animation d'apparition des articles au scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observer les articles
document.querySelectorAll('.article-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Gestion du formulaire de newsletter
const newsletterForm = document.querySelector('.newsletter-form');
newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input[type="email"]').value;
    
    if (email) {
        // Simulation d'inscription à la newsletter
        const button = newsletterForm.querySelector('.subscribe-btn');
        const originalText = button.textContent;
        
        button.textContent = 'Inscription...';
        button.disabled = true;
        
        setTimeout(() => {
            button.textContent = 'Inscrit !';
            button.style.background = '#28a745';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
                button.style.background = '';
                newsletterForm.reset();
            }, 2000);
        }, 1000);
    }
});

// Animation de typing pour le titre principal
const heroTitle = document.querySelector('.hero-title');
const titleText = heroTitle.textContent;
heroTitle.textContent = '';

let i = 0;
const typeWriter = () => {
    if (i < titleText.length) {
        heroTitle.textContent += titleText.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
    }
};

// Démarrer l'animation après le chargement de la page
window.addEventListener('load', () => {
    setTimeout(typeWriter, 500);
});

// Lazy loading des images
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// Parallax effect pour la section hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const rate = scrolled * -0.5;
    
    if (hero) {
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Compteur d'articles (animation)
const animateCounter = (element, target) => {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 30);
};

// Affichage des statistiques au scroll
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.counter');
            counters.forEach(counter => {
                const target = parseInt(counter.dataset.target);
                animateCounter(counter, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Si des éléments avec la classe .counter existent, les observer
const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Gestion des erreurs de chargement d'images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
        img.src = 'https://via.placeholder.com/400x250/D4AF37/FFFFFF?text=Image+non+disponible';
        img.alt = 'Image non disponible';
    });
});

// Amélioration de l'accessibilité
document.addEventListener('keydown', (e) => {
    // Navigation au clavier
    if (e.key === 'Escape') {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Focus visible pour l'accessibilité
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// Performance: Debounce pour les événements de scroll
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

// Application du debounce aux événements de scroll
const debouncedScroll = debounce(() => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = '#ffffff';
        navbar.style.backdropFilter = 'none';
    }
}, 10);

window.addEventListener('scroll', debouncedScroll);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadDynamicArticles();
    initializeArticlesCounter();
    setupArticlesSync();
});

// Fonction pour synchroniser les articles entre les onglets
function setupArticlesSync() {
    window.addEventListener('storage', (e) => {
        if (e.key === 'miwasexo-articles') {
            loadDynamicArticles();
        }
    });
    
    window.addEventListener('articlesChanged', (e) => {
        loadDynamicArticles();
    });
}

// Load articles from localStorage and display them
function loadDynamicArticles() {
    const articles = JSON.parse(localStorage.getItem('miwasexo-articles') || '[]');
    const articlesContainer = document.querySelector('.articles-grid');
    
    if (!articlesContainer) {
        return;
    }
    
    articlesContainer.innerHTML = '';
    
    if (articles.length === 0) {
        showDefaultArticles();
        return;
    }
    
    const sortedArticles = articles.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedArticles.forEach((article) => {
        const articleCard = createArticleCard(article);
        articlesContainer.appendChild(articleCard);
    });
}

function createArticleCard(article) {
    const card = document.createElement('div');
    card.className = 'article-card';
    
    const categoryNames = {
        'politique': 'Politique',
        'economie': 'Économie', 
        'finance': 'Finance',
        'societe': 'Société',
        'international': 'International'
    };
    
    card.innerHTML = `
        <div class="article-image">
            <img src="${article.image}" alt="${article.title}" onerror="this.src='https://via.placeholder.com/400x250/2C3E50/FFFFFF?text=M'">
            <div class="article-category">${categoryNames[article.category] || article.category}</div>
        </div>
        <div class="article-content">
            <h3 class="article-title">${article.title}</h3>
            <p class="article-summary">${article.summary}</p>
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
            <a href="#" class="read-more" onclick="openArticle('${article.id}')">
                Lire la suite <i class="fas fa-arrow-right"></i>
            </a>
        </div>
    `;
    
    return card;
}

function openArticle(articleId) {
    // Create a new window/tab with the article
    const articlePage = generateArticlePageHTML(articleId);
    const newWindow = window.open('', '_blank');
    newWindow.document.write(articlePage);
    newWindow.document.close();
    
    // Increment view count
    incrementViewCount(articleId);
}

function generateArticlePageHTML(articleId) {
    const articles = JSON.parse(localStorage.getItem('miwasexo-articles') || '[]');
    const article = articles.find(a => a.id === articleId);
    
    if (!article) {
        return `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <title>Article non trouvé - Miwasexo</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                h1 { color: #D4AF37; }
            </style>
        </head>
        <body>
            <h1>Article non trouvé</h1>
            <p>L'article que vous recherchez n'existe pas.</p>
            <a href="index.html">Retour à l'accueil</a>
        </body>
        </html>`;
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${article.title} - Miwasexo</title>
        <link rel="stylesheet" href="styles.css">
        <link rel="stylesheet" href="article-styles.css">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    </head>
    <body>
        <nav class="navbar">
            <div class="nav-container">
                <div class="nav-logo">
                    <a href="index.html">
                        <img src="logo.png" alt="Miwasexo" class="logo-img">
                    </a>
                </div>
            </div>
        </nav>

        <main class="article-main">
            <div class="container">
                <article class="article-content">
                    <header class="article-header-content">
                        <div class="article-meta">
                            <span class="article-category category-${article.category}">
                                ${categoryNames[article.category] || article.category}
                            </span>
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
                        
                        <h1 class="article-title">${article.title}</h1>
                        
                        <div class="article-summary">
                            <p>${article.summary}</p>
                        </div>

                        <div class="article-featured-image">
                            <img src="${article.image}" alt="${article.title}" onerror="this.src='https://via.placeholder.com/800x400/2C3E50/FFFFFF?text=Image'">
                        </div>
                    </header>

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

// Système de comptage de vues amélioré
function incrementViewCount(articleId) {
    const articles = JSON.parse(localStorage.getItem('miwasexo-articles') || '[]');
    const articleIndex = articles.findIndex(a => a.id === articleId);
    
    if (articleIndex !== -1) {
        // Initialiser le compteur de vues si inexistant
        if (!articles[articleIndex].views) {
            articles[articleIndex].views = 0;
        }
        
        // Incrémenter le compteur
        articles[articleIndex].views += 1;
        
        // Sauvegarder dans localStorage
        localStorage.setItem('miwasexo-articles', JSON.stringify(articles));
        
        // Mettre à jour les statistiques globales
        updateGlobalViewStats();
        
        console.log(`Article ${articleId} - Vues: ${articles[articleIndex].views}`);
    }
}

// Mettre à jour les statistiques globales de vues
function updateGlobalViewStats() {
    const articles = JSON.parse(localStorage.getItem('miwasexo-articles') || '[]');
    const totalViews = articles.reduce((sum, article) => sum + (article.views || 0), 0);
    
    // Sauvegarder le total des vues
    localStorage.setItem('miwasexo-total-views', totalViews.toString());
    
    // Mettre à jour l'affichage si on est sur la page admin
    if (window.location.pathname.includes('admin.html')) {
        updateAdminStatsDisplay();
    }
}

// Récupérer le total des vues
function getTotalViews() {
    return parseInt(localStorage.getItem('miwasexo-total-views') || '0');
}

// Récupérer le nombre de vues d'un article spécifique
function getArticleViews(articleId) {
    const articles = JSON.parse(localStorage.getItem('miwasexo-articles') || '[]');
    const article = articles.find(a => a.id === articleId);
    return article ? (article.views || 0) : 0;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatContent(content) {
    const paragraphs = content.split('\n\n').filter(p => p.trim());
    return paragraphs.map(paragraph => `<p>${paragraph.trim()}</p>`).join('');
}

function showDefaultArticles() {
    const articlesContainer = document.querySelector('.articles-grid');
    if (articlesContainer) {
        articlesContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 80px 20px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 20px; border: 2px dashed #dee2e6;">
                <i class="fas fa-clock" style="font-size: 5rem; color: #fcd116; margin-bottom: 25px; display: block;"></i>
                <h3 style="color: #2c3e50; margin-bottom: 15px; font-size: 1.8rem; font-weight: 700;">Prochain post bientôt</h3>
                <p style="color: #7f8c8d; margin-bottom: 30px; font-size: 1.1rem; line-height: 1.6; max-width: 400px; margin-left: auto; margin-right: auto;">Nos analystes préparent des contenus exclusifs pour vous tenir informés de l'actualité politique, économique et financière du Bénin.</p>
            </div>
        `;
    }
}

// Fonction pour initialiser le compteur d'articles
function initializeArticlesCounter() {
    const articles = JSON.parse(localStorage.getItem('miwasexo-articles') || '[]');
    window.lastArticlesCount = articles.length;
}
