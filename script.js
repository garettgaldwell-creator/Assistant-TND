// ===================================
// SCRIPT GLOBAL - SESSAD PETIT PRINCE
// ===================================

// GESTION DU MENU MOBILE
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Fermer le menu si on clique ailleurs
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.main-nav')) {
            navMenu?.classList.remove('active');
        }
    });
});

// GESTION DU BOUTON RETOUR EN HAUT
const backToTop = document.querySelector('.back-to-top');

if (backToTop) {
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// GESTION DE L'ACCESSIBILITÉ
class AccessibilityManager {
    constructor() {
        this.fontSize = localStorage.getItem('fontSize') || 'normal';
        this.highContrast = localStorage.getItem('highContrast') === 'true';
        this.dyslexicFont = localStorage.getItem('dyslexicFont') === 'true';
        this.init();
    }
    
    init() {
        this.applySettings();
        this.setupButtons();
    }
    
    applySettings() {
        const body = document.body;
        
        // Taille de police
        body.classList.remove('text-normal', 'text-large', 'text-xlarge');
        body.classList.add(`text-${this.fontSize}`);
        
        // Contraste élevé
        if (this.highContrast) {
            body.classList.add('high-contrast');
        } else {
            body.classList.remove('high-contrast');
        }
        
        // Police dyslexique
        if (this.dyslexicFont) {
            body.style.fontFamily = "'OpenDyslexic', 'Comic Sans MS', sans-serif";
        } else {
            body.style.fontFamily = "'Poppins', sans-serif";
        }
    }
    
    setupButtons() {
        // Bouton taille de texte
        const textSizeBtn = document.getElementById('textSizeBtn');
        if (textSizeBtn) {
            textSizeBtn.addEventListener('click', () => this.cycleTextSize());
        }
        
        // Bouton contraste
        const contrastBtn = document.getElementById('contrastBtn');
        if (contrastBtn) {
            contrastBtn.addEventListener('click', () => this.toggleContrast());
        }
        
        // Bouton police dyslexique
        const dyslexicBtn = document.getElementById('dyslexicBtn');
        if (dyslexicBtn) {
            dyslexicBtn.addEventListener('click', () => this.toggleDyslexicFont());
        }
    }
    
    cycleTextSize() {
        const sizes = ['normal', 'large', 'xlarge'];
        const currentIndex = sizes.indexOf(this.fontSize);
        this.fontSize = sizes[(currentIndex + 1) % sizes.length];
        localStorage.setItem('fontSize', this.fontSize);
        this.applySettings();
        
        // Message de confirmation
        this.showMessage(`Taille de texte : ${this.fontSize === 'normal' ? 'Normal' : this.fontSize === 'large' ? 'Grand' : 'Très grand'}`);
    }
    
    toggleContrast() {
        this.highContrast = !this.highContrast;
        localStorage.setItem('highContrast', this.highContrast);
        this.applySettings();
        
        this.showMessage(`Contraste élevé : ${this.highContrast ? 'Activé' : 'Désactivé'}`);
    }
    
    toggleDyslexicFont() {
        this.dyslexicFont = !this.dyslexicFont;
        localStorage.setItem('dyslexicFont', this.dyslexicFont);
        this.applySettings();
        
        this.showMessage(`Police dyslexique : ${this.dyslexicFont ? 'Activée' : 'Désactivée'}`);
    }
    
    showMessage(text) {
        // Créer un toast message
        const toast = document.createElement('div');
        toast.className = 'accessibility-toast';
        toast.textContent = text;
        toast.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 30px;
            background: #333;
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideUp 0.3s ease-out;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideDown 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }
}

// Initialiser l'accessibilité
const accessibilityManager = new AccessibilityManager();

// LECTURE AUDIO (Text-to-Speech)
class TextToSpeech {
    constructor() {
        this.synth = window.speechSynthesis;
        this.utterance = null;
    }
    
    read(text) {
        // Arrêter toute lecture en cours
        this.synth.cancel();
        
        this.utterance = new SpeechSynthesisUtterance(text);
        this.utterance.lang = 'fr-FR';
        this.utterance.rate = 0.9; // Vitesse légèrement réduite
        this.utterance.pitch = 1;
        
        this.synth.speak(this.utterance);
    }
    
    stop() {
        this.synth.cancel();
    }
    
    pause() {
        this.synth.pause();
    }
    
    resume() {
        this.synth.resume();
    }
}

const tts = new TextToSpeech();

// Ajouter des boutons de lecture sur les cartes
document.querySelectorAll('.card').forEach(card => {
    const readBtn = document.createElement('button');
    readBtn.className = 'read-aloud-btn';
    readBtn.innerHTML = '🔊 Lire';
    readBtn.style.cssText = `
        position: absolute;
        top: 15px;
        right: 15px;
        padding: 8px 15px;
        background: var(--info);
        color: white;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        font-size: 0.85rem;
        font-weight: 600;
        transition: all 0.3s;
    `;
    
    readBtn.addEventListener('click', function() {
        const text = card.textContent;
        tts.read(text);
        
        readBtn.innerHTML = '⏸️ Pause';
        readBtn.onclick = function() {
            tts.stop();
            readBtn.innerHTML = '🔊 Lire';
            readBtn.onclick = function() {
                tts.read(text);
            };
        };
    });
    
    card.style.position = 'relative';
    card.appendChild(readBtn);
});

// SAUVEGARDE AUTOMATIQUE
class AutoSave {
    constructor(storageKey) {
        this.storageKey = storageKey;
    }
    
    save(data) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            this.showSaveIndicator();
        } catch (e) {
            console.error('Erreur sauvegarde:', e);
        }
    }
    
    load() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Erreur chargement:', e);
            return null;
        }
    }
    
    clear() {
        localStorage.removeItem(this.storageKey);
    }
    
    showSaveIndicator() {
        const indicator = document.createElement('div');
        indicator.textContent = '✓ Sauvegardé';
        indicator.style.cssText = `
            position: fixed;
            top: 70px;
            right: 30px;
            background: var(--success);
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            font-weight: 600;
            font-size: 0.9rem;
            z-index: 10000;
            animation: slideDown 0.3s ease-out;
        `;
        
        document.body.appendChild(indicator);
        
        setTimeout(() => {
            indicator.style.animation = 'slideUp 0.3s ease-out';
            setTimeout(() => indicator.remove(), 300);
        }, 1500);
    }
}

// GESTION DES ONGLETS
function switchTab(tabName) {
    // Masquer tous les contenus
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Désactiver tous les boutons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Activer le contenu sélectionné
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Activer le bouton cliqué
    const selectedBtn = document.querySelector(`[onclick="switchTab('${tabName}')"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('active');
    }
    
    // Scroller en haut
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// UTILITAIRES
const Utils = {
    // Formater une date
    formatDate(date) {
        return new Date(date).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    },
    
    // Générer un ID unique
    generateId() {
        return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    },
    
    // Copier dans le presse-papiers
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showToast('✓ Copié !', 'success');
            return true;
        } catch (e) {
            console.error('Erreur copie:', e);
            this.showToast('❌ Erreur de copie', 'error');
            return false;
        }
    },
    
    // Afficher un toast
    showToast(message, type = 'info') {
        const colors = {
            success: '#51CF66',
            error: '#FF6B6B',
            info: '#4ECDC4',
            warning: '#FFB84D'
        };
        
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: ${colors[type] || colors.info};
            color: white;
            padding: 15px 30px;
            border-radius: 25px;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideUp 0.3s ease-out;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideDown 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    },
    
    // Télécharger un fichier
    downloadFile(content, filename, type = 'text/plain') {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};

// Rendre les utilitaires globaux
window.Utils = Utils;
window.AutoSave = AutoSave;
window.TextToSpeech = tts;

// Initialisation au chargement
console.log('✓ Script global chargé - SESSAD Petit Prince');
