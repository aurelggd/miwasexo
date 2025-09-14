// Authentication System for Miwasexo Admin
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.isInitialized = false;
        this.init();
    }

    init() {
        try {
            this.setDefaultCredentials();
            this.checkAuthStatus();
            this.isInitialized = true;
            console.log('✅ AuthManager initialisé');
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation:', error);
            this.isInitialized = false;
        }
    }

    setDefaultCredentials() {
        try {
            const adminCredentials = localStorage.getItem('miwasexo-admin-credentials');
            if (!adminCredentials) {
                console.log('ℹ️ Aucun identifiant admin trouvé - ils doivent être créés via l\'interface d\'administration');
                // Ne pas créer d'identifiants par défaut - ils seront créés via l'admin
            } else {
                console.log('✅ Identifiants existants trouvés');
                const existing = JSON.parse(adminCredentials);
                console.log('📋 Identifiants existants:', {
                    username: existing.username,
                    email: existing.email,
                    fullName: existing.fullName
                });
            }
        } catch (error) {
            console.error('❌ Erreur lors de la vérification des identifiants:', error);
        }
    }

    checkAuthStatus() {
        try {
            const authToken = localStorage.getItem('miwasexo-auth-token');
            if (authToken) {
                const tokenData = JSON.parse(atob(authToken));
                if (tokenData.expires > Date.now()) {
                    this.currentUser = tokenData.user;
                    this.isAuthenticated = true;
                    console.log('✅ Utilisateur authentifié:', this.currentUser.username);
                    return true;
                } else {
                    console.log('⏰ Token expiré');
                    this.logout();
                }
            }
        } catch (error) {
            console.error('❌ Token invalide:', error);
            this.logout();
        }
        return false;
    }

    login(username, password) {
        try {
            console.log('🔐 Tentative de connexion pour:', username);
            
            // Vérifier d'abord avec les identifiants par défaut
            const defaultUsername = 'admin';
            const defaultPassword = 'Miwasexo@2024!Secure';
            
            // Si les identifiants correspondent aux valeurs par défaut, accepter directement
            if (username === defaultUsername && password === defaultPassword) {
                console.log('✅ Identifiants par défaut acceptés');
                
                // Créer ou mettre à jour les identifiants stockés
                const credentials = {
                    username: defaultUsername,
                    password: defaultPassword,
                    email: 'admin@miwasexo.com',
                    fullName: 'Administrateur Miwasexo',
                    role: 'admin',
                    createdAt: new Date().toISOString()
                };
                
                localStorage.setItem('miwasexo-admin-credentials', JSON.stringify(credentials));
                
                const tokenData = {
                    user: {
                        username: credentials.username,
                        email: credentials.email,
                        fullName: credentials.fullName,
                        role: credentials.role
                    },
                    expires: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
                    createdAt: new Date().toISOString()
                };

                const token = btoa(JSON.stringify(tokenData));
                localStorage.setItem('miwasexo-auth-token', token);
                
                this.currentUser = tokenData.user;
                this.isAuthenticated = true;
                
                console.log('✅ Connexion réussie pour:', this.currentUser.fullName);
                return true;
            }
            
            // Sinon, vérifier avec les identifiants stockés
            const storedCredentials = localStorage.getItem('miwasexo-admin-credentials');
            if (!storedCredentials) {
                console.log('❌ Aucun identifiant stocké et identifiants par défaut incorrects');
                throw new Error('Nom d\'utilisateur ou mot de passe incorrect');
            }

            const credentials = JSON.parse(storedCredentials);
            console.log('📋 Vérification avec identifiants stockés');
            
            if (credentials.username === username && credentials.password === password) {
                console.log('✅ Identifiants stockés corrects');
                
                const tokenData = {
                    user: {
                        username: credentials.username,
                        email: credentials.email,
                        fullName: credentials.fullName,
                        role: credentials.role
                    },
                    expires: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
                    createdAt: new Date().toISOString()
                };

                const token = btoa(JSON.stringify(tokenData));
                localStorage.setItem('miwasexo-auth-token', token);
                
                this.currentUser = tokenData.user;
                this.isAuthenticated = true;
                
                console.log('✅ Connexion réussie pour:', this.currentUser.fullName);
                return true;
            } else {
                console.log('❌ Identifiants incorrects');
                throw new Error('Nom d\'utilisateur ou mot de passe incorrect');
            }
        } catch (error) {
            console.error('❌ Erreur de connexion:', error);
            throw error;
        }
    }

    logout() {
        try {
            console.log('🚪 Déconnexion en cours...');
            localStorage.removeItem('miwasexo-auth-token');
            this.currentUser = null;
            this.isAuthenticated = false;
            console.log('✅ Déconnexion réussie');
        } catch (error) {
            console.error('❌ Erreur lors de la déconnexion:', error);
        }
    }

    requireAuth() {
        if (!this.isAuthenticated) {
            this.showLoginModal();
            return false;
        }
        return true;
    }

    showLoginModal() {
        console.log('🔑 Affichage du modal de connexion');
        const modal = document.getElementById('login-modal');
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.add('show');
            
            // Focus sur le premier champ après l'animation
            setTimeout(() => {
                const usernameInput = document.getElementById('login-username');
                if (usernameInput) {
                    usernameInput.focus();
                }
            }, 300);
        } else {
            console.error('❌ Modal de connexion non trouvé');
        }
    }

    hideLoginModal() {
        console.log('🔒 Fermeture du modal de connexion');
        const modal = document.getElementById('login-modal');
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('show');
        }
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isAdmin() {
        return this.isAuthenticated && this.currentUser && this.currentUser.role === 'admin';
    }

    // Méthode pour créer les identifiants admin
    createAdminCredentials(username, password, email, fullName) {
        try {
            const credentials = {
                username: username,
                password: password,
                email: email,
                fullName: fullName,
                role: 'admin',
                createdAt: new Date().toISOString()
            };
            
            localStorage.setItem('miwasexo-admin-credentials', JSON.stringify(credentials));
            console.log('✅ Identifiants admin créés:', username);
            return true;
        } catch (error) {
            console.error('❌ Erreur lors de la création des identifiants:', error);
            return false;
        }
    }

    // Méthode pour vérifier si des identifiants existent
    hasAdminCredentials() {
        const credentials = localStorage.getItem('miwasexo-admin-credentials');
        return credentials !== null;
    }

    // Méthode pour obtenir les informations des identifiants (sans le mot de passe)
    getAdminInfo() {
        try {
            const credentials = localStorage.getItem('miwasexo-admin-credentials');
            if (credentials) {
                const creds = JSON.parse(credentials);
                return {
                    username: creds.username,
                    email: creds.email,
                    fullName: creds.fullName,
                    createdAt: creds.createdAt
                };
            }
            return null;
        } catch (error) {
            console.error('❌ Erreur lors de la récupération des infos admin:', error);
            return null;
        }
    }

    // Méthode pour mettre à jour les identifiants
    updateAdminCredentials(newPassword, newEmail, newFullName) {
        try {
            const credentials = JSON.parse(localStorage.getItem('miwasexo-admin-credentials'));
            if (credentials) {
                if (newPassword) credentials.password = newPassword;
                if (newEmail) credentials.email = newEmail;
                if (newFullName) credentials.fullName = newFullName;
                credentials.updatedAt = new Date().toISOString();
                
                localStorage.setItem('miwasexo-admin-credentials', JSON.stringify(credentials));
                console.log('✅ Identifiants admin mis à jour');
                return true;
            }
            return false;
        } catch (error) {
            console.error('❌ Erreur lors de la mise à jour des identifiants:', error);
            return false;
        }
    }
}

// Initialize auth manager
const authManager = new AuthManager();

// Fonction de connexion principale
function handleLogin(event) {
    event.preventDefault();
    console.log('🔐 handleLogin appelée');
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const errorMessage = document.getElementById('login-error');
    const loginBtn = document.querySelector('.btn-login');
    const loginText = loginBtn.querySelector('span');
    
    console.log('📝 Données saisies:', { username, password: '***' });
    
    // Masquer l'erreur précédente
    errorMessage.style.display = 'none';
    
    // Activer l'état de chargement
    loginBtn.disabled = true;
    loginText.textContent = 'Connexion...';
    
    // Vérifier si des identifiants existent
    if (!authManager.hasAdminCredentials()) {
        console.log('❌ Aucun identifiant admin configuré');
        showError('Aucun compte administrateur configuré. Veuillez d\'abord configurer les identifiants via l\'interface d\'administration.');
        return;
    }
    
    // Utiliser la méthode normale d'authentification
    try {
        if (authManager.login(username, password)) {
            console.log('✅ Authentification réussie, redirection...');
            
            // Succès
            loginText.textContent = 'Connecté !';
            
            // Attendre un peu pour l'effet visuel
            setTimeout(() => {
                // Fermer le modal
                authManager.hideLoginModal();
                
                // Redirection vers admin.html
                console.log('🚀 Redirection vers admin.html');
                window.location.href = 'admin.html';
            }, 500);
            
        } else {
            throw new Error('Échec de l\'authentification');
        }
    } catch (error) {
        console.error('❌ Erreur d\'authentification:', error);
        showError(error.message);
    }
        
    function showError(message) {
        // Désactiver l'état de chargement
        loginBtn.disabled = false;
        loginText.textContent = 'Se connecter';
        
        // Afficher l'erreur
        const errorText = errorMessage.querySelector('.error-text');
        if (errorText) {
            errorText.textContent = message;
        } else {
            errorMessage.textContent = message;
        }
        errorMessage.style.display = 'flex';
    }
}

// Fonction pour afficher le modal de connexion
function showLoginModal() {
    console.log('🔑 showLoginModal appelée');
    if (authManager && authManager.showLoginModal) {
        authManager.showLoginModal();
    } else {
        console.error('❌ AuthManager non disponible');
        const modal = document.getElementById('login-modal');
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.add('show');
        }
    }
}

// Fonction pour masquer le modal de connexion
function hideLoginModal() {
    console.log('🔒 hideLoginModal appelée');
    if (authManager && authManager.hideLoginModal) {
        authManager.hideLoginModal();
    } else {
        const modal = document.getElementById('login-modal');
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('show');
        }
    }
}

// Fonction pour gérer la déconnexion
function handleLogout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        try {
            authManager.logout();
            window.location.href = 'index.html';
        } catch (error) {
            console.error('❌ Erreur lors de la déconnexion:', error);
            alert('Erreur lors de la déconnexion. Veuillez rafraîchir la page.');
        }
    }
}

// Fonction pour basculer la visibilité du mot de passe
function togglePassword() {
    const passwordInput = document.getElementById('login-password');
    const passwordEye = document.getElementById('password-eye');
    
    if (passwordInput && passwordEye) {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            passwordEye.classList.remove('fa-eye');
            passwordEye.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            passwordEye.classList.remove('fa-eye-slash');
            passwordEye.classList.add('fa-eye');
        }
    }
}

// Protection des routes admin
function protectAdminRoute() {
    if (!authManager.requireAuth()) {
        return false;
    }
    
    // Update UI with user info
    updateAdminUI();
    return true;
}

function updateAdminUI() {
    const user = authManager.getCurrentUser();
    if (user) {
        // Update welcome message
        const welcomeElement = document.getElementById('admin-welcome');
        if (welcomeElement) {
            welcomeElement.textContent = `Bienvenue, ${user.fullName}`;
        }
        
        // Add logout button if not exists
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu && !document.querySelector('.logout-btn')) {
            const logoutLi = document.createElement('li');
            logoutLi.className = 'nav-item logout-item';
            logoutLi.innerHTML = `
                <a href="#" class="nav-link logout-btn" onclick="handleLogout()">
                    <i class="fas fa-sign-out-alt"></i> Déconnexion
                </a>
            `;
            navMenu.appendChild(logoutLi);
        }
    }
}

// Auto-protect admin page
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔍 Vérification de la protection des routes admin...');
    console.log('📍 Chemin actuel:', window.location.pathname);
    
    if (window.location.pathname.includes('admin.html')) {
        console.log('🛡️ Page admin détectée');
        
        if (!authManager.isAuthenticated) {
            console.log('❌ Non authentifié, affichage du modal');
            authManager.showLoginModal();
        } else {
            console.log('✅ Accès autorisé à la page admin');
            updateAdminUI();
        }
    }
});

// Fonction pour forcer la recréation des identifiants
function forceRecreateCredentials() {
    console.log('🔧 Forçage de la recréation des identifiants...');
    
    // Supprimer les anciens identifiants
    localStorage.removeItem('miwasexo-admin-credentials');
    localStorage.removeItem('miwasexo-auth-token');
    
    // Recréer les identifiants
    authManager.setDefaultCredentials();
    
    console.log('✅ Identifiants recréés');
    return true;
}

// Fonction pour tester l'authentification avec debug
function debugLogin(username, password) {
    console.log('🧪 Debug login avec:', username, password);
    
    try {
        const storedCredentials = localStorage.getItem('miwasexo-admin-credentials');
        console.log('📋 Identifiants stockés:', storedCredentials);
        
        if (storedCredentials) {
            const credentials = JSON.parse(storedCredentials);
            console.log('🔍 Comparaison détaillée:');
            console.log('  - Username stocké:', credentials.username);
            console.log('  - Username fourni:', username);
            console.log('  - Username match:', credentials.username === username);
            console.log('  - Password stocké:', credentials.password);
            console.log('  - Password fourni:', password);
            console.log('  - Password match:', credentials.password === password);
        }
        
        return authManager.login(username, password);
    } catch (error) {
        console.error('❌ Erreur debug login:', error);
        throw error;
    }
}

// Expose functions to global scope
window.authManager = authManager;
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;
window.showLoginModal = showLoginModal;
window.hideLoginModal = hideLoginModal;
window.togglePassword = togglePassword;
window.protectAdminRoute = protectAdminRoute;
window.forceRecreateCredentials = forceRecreateCredentials;
window.debugLogin = debugLogin;