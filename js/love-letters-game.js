/**
 * Havin'e Mektuplar için JavaScript
 */
const LoveLettersGame = (function() {
    // DOM elemanları
    const bigLetterIcon = document.querySelector('.big-letter-icon');
    const letterModal = document.getElementById('letter-modal');
    const letterText = document.getElementById('letter-text');
    const nextLetterBtn = document.getElementById('next-letter-btn');
    
    // Mektupları GameState'den al
    let loveMessages = [];
    
    // Rastgele bir mektup seçip göster
    function showRandomLetter() {
        if (loveMessages.length === 0) {
            // Eğer mesajlar yüklenmemişse, hata mesajı göster
            if (letterText) {
                letterText.textContent = "Aşk mektupları yüklenemedi. Lütfen sayfayı yenileyin.";
            }
            return;
        }
        
        // Rastgele bir mektup seç
        const randomIndex = Math.floor(Math.random() * loveMessages.length);
        const randomMessage = loveMessages[randomIndex];
        
        // Mektubu göster
        if (letterText) {
            letterText.textContent = randomMessage;
        }
        
        // Modal'i göster
        if (letterModal) {
            letterModal.classList.add('active');
        }
    }
    
    // Büyük mektup ikonuna tıklandığında
    function handleIconClick() {
        showRandomLetter();
    }
    
    // "Yeni Mektup" butonuna tıklandığında
    function handleNextLetter() {
        showRandomLetter();
    }
    
    // Event dinleyicilerini kur
    function setupEventListeners() {
        if (bigLetterIcon) {
            bigLetterIcon.addEventListener('click', handleIconClick);
        }
        
        if (nextLetterBtn) {
            nextLetterBtn.addEventListener('click', handleNextLetter);
        }
    }
    
    // Oyunu başlat
    function init() {
        // Aşk mesajlarını GameState'den al
        loveMessages = GameState.DEFAULT_LOVE_MESSAGES || [];
        
        // Event dinleyicilerini kur
        setupEventListeners();
    }
    
    return {
        init
    };
})();

// Sayfa yüklenince başlat
onPageLoad(function() {
    LoveLettersGame.init();
});