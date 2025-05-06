/**
 * Tıklama Yarışı Oyunu için JavaScript
 */
const ClickRaceGame = (function() {
    // Oyun değişkenleri
    let gameActive = false;
    let countdownInterval = null;
    let clickCount = 0;
    let timeLeft = 10; // 10 saniye
    let highScore = 0;
    
    // DOM elementleri
    const clickContainer = document.getElementById('click-race-container');
    const clickTarget = document.getElementById('click-race-target');
    const clickStatus = document.getElementById('click-race-status');
    const clickCountDisplay = document.getElementById('click-race-count');
    const clickTimeDisplay = document.getElementById('click-race-time');
    const clickBestScoreDisplay = document.getElementById('click-race-best-score');
    const clickStartButton = document.getElementById('click-race-start');
    
    // Oyun durumları
    const STATUS = {
        IDLE: 'idle',
        ACTIVE: 'active',
        COMPLETE: 'complete'
    };
    
    let currentStatus = STATUS.IDLE;
    
    // Oyunu başlat
    function startGame() {
        // Eğer oyun zaten aktifse, bir şey yapma
        if (currentStatus === STATUS.ACTIVE) return;
        
        // Oyun durumunu sıfırla
        clickCount = 0;
        timeLeft = 10;
        currentStatus = STATUS.ACTIVE;
        gameActive = true;
        
        // Ekranı güncelle
        updateDisplay();
        
        // Tıklama hedefini aktifleştir
        if (clickTarget) {
            clickTarget.classList.add('active');
            clickTarget.classList.remove('disabled');
        }
        
        // Başlat/yeniden başlat butonunu gizle
        if (clickStartButton) {
            clickStartButton.style.display = 'none';
        }
        
        // Durum mesajını güncelle
        if (clickStatus) {
            clickStatus.textContent = 'Hızlıca tıkla!';
            clickStatus.className = 'game-status';
        }
        
        // Geri sayımı başlat
        countdownInterval = setInterval(updateTimer, 100); // Her 100ms'de bir güncelle (0.1 saniye)
        
        // Oyun durumunu GameState'e kaydet
        GameState.updateClickRaceState(state => ({
            ...state,
            inProgress: true
        }));
    }
    
    // Oyunu bitir
    function endGame() {
        // Interval'ı temizle
        clearInterval(countdownInterval);
        
        // Oyun durumunu güncelle
        currentStatus = STATUS.COMPLETE;
        gameActive = false;
        
        // Tıklama hedefini pasifleştir
        if (clickTarget) {
            clickTarget.classList.remove('active');
            clickTarget.classList.add('disabled');
        }
        
        // Süre bitti mesajını göster
        if (clickStatus) {
            clickStatus.innerHTML = `
                <div class="time-up-message">SÜRE BİTTİ!</div>
                <div class="game-results">
                    Toplam Tıklama: <strong>${clickCount}</strong>
                </div>
            `;
        }
        
        // Başlat/yeniden başlat butonunu göster
        if (clickStartButton) {
            clickStartButton.textContent = 'Tekrar Oyna';
            clickStartButton.style.display = 'block';
        }
        
        // En yüksek skoru güncelle
        if (clickCount > highScore) {
            highScore = clickCount;
            
            // En yüksek skoru GameState'e kaydet
            GameState.updateClickRaceState(state => ({
                ...state,
                highScore: highScore,
                inProgress: false
            }));
            
            // Durum mesajını güncelle - süre bitti mesajını koruyarak
            if (clickStatus) {
                clickStatus.innerHTML = `
                    <div class="time-up-message">SÜRE BİTTİ!</div>
                    <div class="game-results">
                        Toplam Tıklama: <strong>${clickCount}</strong>
                        <span class="win-message">Yeni Rekor!</span>
                    </div>
                `;
                clickStatus.className = 'game-status win';
            }
        } else {
            // Oyun durumunu GameState'e kaydet - süre bitti mesajı yukarıda eklendiği için burada güncellemeye gerek yok
            GameState.updateClickRaceState(state => ({
                ...state,
                inProgress: false
            }));
        }
        
        // Ekranı güncelle
        updateDisplay();
    }
    
    // Zamanlayıcıyı güncelle
    function updateTimer() {
        timeLeft -= 0.1; // Her seferinde 0.1 saniye azalt
        timeLeft = Math.max(0, timeLeft); // 0'dan küçük olamaz
        
        // Ekranı güncelle
        updateDisplay();
        
        // Süre bittiyse oyunu sonlandır
        if (timeLeft <= 0) {
            endGame();
        }
    }
    
    // Ekranı güncelle
    function updateDisplay() {
        // Tıklama sayacını güncelle
        if (clickCountDisplay) {
            clickCountDisplay.textContent = clickCount;
        }
        
        // Kalan zamanı güncelle (bir ondalık basamak göster)
        if (clickTimeDisplay) {
            clickTimeDisplay.textContent = timeLeft.toFixed(1);
        }
        
        // En yüksek skoru güncelle
        if (clickBestScoreDisplay) {
            clickBestScoreDisplay.textContent = highScore;
        }
    }
    
    // Tıklamayı işle
    function handleClick() {
        // Eğer oyun aktif değilse, bir şey yapma
        if (!gameActive) return;
        
        // Tıklama sayısını artır
        clickCount++;
        
        // Tıklama animasyonu
        if (clickTarget) {
            // Animasyonu sıfırla ve yeniden başlat
            clickTarget.classList.remove('active');
            void clickTarget.offsetWidth; // Reflow - animasyonu sıfırla
            clickTarget.classList.add('active');
        }
        
        // Ekranı güncelle
        updateDisplay();
    }
    
    // Olay dinleyicilerini kurma
    function setupEventListeners() {
        // Başlat butonuna tıklama
        if (clickStartButton) {
            clickStartButton.addEventListener('click', startGame);
        }
        
        // Hedefe tıklama
        if (clickTarget) {
            clickTarget.addEventListener('click', handleClick);
        }
    }
    
    // Oyunu başlat
    function init() {
        // Oyun durumunu GameState'den al
        const state = GameState.getClickRaceState();
        highScore = state.highScore || 0;
        
        // Ekranı güncelle
        updateDisplay();
        
        // Olay dinleyicilerini kur
        setupEventListeners();
    }
    
    return {
        init,
        startGame,
        endGame
    };
})();

// Sayfa yüklenince oyunu başlat
onPageLoad(function() {
    ClickRaceGame.init();
});