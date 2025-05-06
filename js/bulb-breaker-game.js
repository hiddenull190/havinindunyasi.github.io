/**
 * Havin'in Ampul Kırma Oyunu için JavaScript
 */
const BulbBreakerGame = (function() {
    // DOM elemanları
    let container;
    let scoreDisplay;
    let bestScoreDisplay;
    let levelDisplay;
    let startButton;
    
    // DOM elemanlarını başlat
    function initElements() {
        container = document.getElementById('bulb-breaker-container');
        scoreDisplay = document.getElementById('bulb-breaker-score');
        bestScoreDisplay = document.getElementById('bulb-breaker-best-score');
        levelDisplay = document.getElementById('bulb-breaker-level');
        startButton = document.getElementById('bulb-breaker-start');
    }
    
    // Oyun değişkenleri
    let gameActive = false;
    let score = 0;
    let level = 1;
    let bulbs = [];
    let animationFrameId = null;
    let lastBulbTime = 0;
    let bulbInterval = 2000; // İlk seviyede 2 saniyede bir ampul
    let gameHeight = 0;
    
    // Oyun başlangıç fonksiyonu
    function startGame() {
        if (gameActive) return;
        
        // Oyun durumunu sıfırla
        resetGame();
        
        // Oyun bilgi alanını temizle
        const gameInfoEl = document.getElementById('bulb-breaker-info');
        if (gameInfoEl) {
            gameInfoEl.innerHTML = '';
        }
        
        // "Başlat" butonunu güncelle
        startButton.textContent = 'Yeniden Başlat';
        
        // Oyunu etkinleştir
        gameActive = true;
        
        // İlk ampulü oluştur
        createBulb();
        
        // Oyun döngüsünü başlat
        animationFrameId = requestAnimationFrame(gameLoop);
    }
    
    // Oyun döngüsü
    function gameLoop(timestamp) {
        if (!gameActive) return;
        
        // Yeni ampul oluştur
        if (timestamp - lastBulbTime > bulbInterval) {
            createBulb();
            lastBulbTime = timestamp;
        }
        
        // Ampulleri hareket ettir
        moveBulbs();
        
        // Oyun döngüsünü devam ettir
        animationFrameId = requestAnimationFrame(gameLoop);
    }
    
    // Oyunu sıfırla
    function resetGame() {
        // Skoru sıfırla
        score = 0;
        updateScore();
        
        // Seviyeyi sıfırla
        level = 1;
        updateLevel();
        
        // Ampul aralığını sıfırla
        bulbInterval = 2000;
        
        // Tüm ampulleri temizle
        clearBulbs();
        
        // Container yüksekliğini güncelle
        gameHeight = container.clientHeight;
        
        // Son ampul zamanını sıfırla
        lastBulbTime = 0;
    }
    
    // Ampul oluştur
    function createBulb() {
        // Rastgele bir x pozisyonu seç
        const bulbSize = 60; // Ampul boyutu - 2 katına çıkarıldı
        const maxX = container.clientWidth - bulbSize;
        const x = Math.random() * maxX;
        
        // Ampul elementi oluştur
        const bulb = document.createElement('div');
        bulb.className = 'bulb-bulb bulb-on';
        bulb.innerHTML = '<i class="fa-solid fa-lightbulb"></i>';
        bulb.style.left = `${x}px`;
        bulb.style.top = '0px';
        
        // Ampule tıklama işlevi ekle
        bulb.addEventListener('click', () => breakBulb(bulb));
        
        // Ampulü container'a ekle
        container.appendChild(bulb);
        
        // Ampulü diziye ekle
        bulbs.push({
            element: bulb,
            x: x,
            y: 0,
            speed: 1 + Math.random() * level * 0.5 // Seviyeye göre hız artar
        });
    }
    
    // Ampulleri hareket ettir
    function moveBulbs() {
        for (let i = 0; i < bulbs.length; i++) {
            const bulb = bulbs[i];
            
            // Ampulu aşağı doğru hareket ettir
            bulb.y += bulb.speed;
            bulb.element.style.top = `${bulb.y}px`;
            
            // Ampul yere değdiyse ve hala yanıyorsa oyunu bitir
            if (bulb.y >= gameHeight - 60 && bulb.element.classList.contains('bulb-on')) {
                gameOver();
                return;
            }
            
            // Ampul ekrandan çıktıysa kaldır (sönmüş ampuller için)
            if (bulb.y >= gameHeight && !bulb.element.classList.contains('bulb-on')) {
                container.removeChild(bulb.element);
                bulbs.splice(i, 1);
                i--; // Diziden eleman çıkardık, i'yi azalt
            }
        }
    }
    
    // Ampulü kır (tıklama işlevi)
    function breakBulb(bulbElement) {
        // Ampul zaten kırık mı kontrol et
        if (!bulbElement.classList.contains('bulb-on')) return;
        
        // Ampulü kırık hale getir
        bulbElement.classList.remove('bulb-on');
        bulbElement.classList.add('bulb-off');
        
        // İkonu değiştir
        bulbElement.innerHTML = '<i class="fa-regular fa-lightbulb"></i>';
        
        // Skoru artır
        score += 10 * level;
        updateScore();
        
        // Belirli skor aralıklarında seviyeyi artır
        // Level 1: Başlangıç
        // Level 2: 50 puan
        // Level 3: 150 puan (50+100)
        // Level 4: 300 puan (50+100+150)
        // Level 5: 500 puan (50+100+150+200)
        if (level === 1 && score >= 50) levelUp();
        else if (level === 2 && score >= 150) levelUp();
        else if (level === 3 && score >= 300) levelUp();
        else if (level === 4 && score >= 500) levelUp();
    }
    
    // Seviyeyi artır
    function levelUp() {
        // Maksimum düzey 5 olsun
        if (level < 5) {
            level++;
            updateLevel();
            
            // Ampul oluşturma aralığını azalt (daha sık ampul)
            bulbInterval = Math.max(500, 2000 - (level - 1) * 300);
        }
    }
    
    // Skoru güncelle
    function updateScore() {
        scoreDisplay.textContent = score;
        
        // En yüksek skoru güncelle
        const gameState = GameState.getBulbBreakerState();
        if (score > gameState.highScore) {
            GameState.updateBulbBreakerState({
                highScore: score,
                level: level
            });
            bestScoreDisplay.textContent = score;
        }
    }
    
    // Seviyeyi güncelle
    function updateLevel() {
        levelDisplay.textContent = level;
    }
    
    // Tüm ampulleri temizle
    function clearBulbs() {
        bulbs.forEach(bulb => {
            if (bulb.element.parentNode === container) {
                container.removeChild(bulb.element);
            }
        });
        bulbs = [];
    }
    
    // Oyun bitti
    function gameOver() {
        gameActive = false;
        cancelAnimationFrame(animationFrameId);
        
        // Yüksek skoru güncelle
        const gameState = GameState.getBulbBreakerState();
        if (score > gameState.highScore) {
            GameState.updateBulbBreakerState({
                highScore: score,
                level: level
            });
        }
        
        // Oyun bitti mesajını göster - "Süre Bitti" formatında
        const gameInfoEl = document.getElementById('bulb-breaker-info');
        if (gameInfoEl) {
            gameInfoEl.innerHTML = `
                <div class="time-up-message">OYUN BİTTİ!</div>
                <div class="game-results">
                    Skorun: <strong>${score}</strong> | 
                    Seviye: <strong>${level}</strong>
                </div>
            `;
        }
    }
    
    // Event Listeners
    function setupEventListeners() {
        if (startButton) {
            startButton.addEventListener('click', startGame);
        }
        
        // Sayfa boyutu değiştiğinde container boyutunu güncelle
        window.addEventListener('resize', function() {
            gameHeight = container.clientHeight;
        });
    }
    
    // Oyunu başlat
    function init() {
        // DOM elemanlarını başlat
        initElements();
        
        // GameState'ten en yüksek skoru al
        const gameState = GameState.getBulbBreakerState();
        
        if (bestScoreDisplay) {
            bestScoreDisplay.textContent = gameState.highScore;
        }
        
        // Container varsa yüksekliğini al
        if (container) {
            gameHeight = container.clientHeight;
        }
        
        // Event listener'ları ayarla
        setupEventListeners();
    }
    
    return {
        init
    };
})();

// Sayfa yüklenince başlat
onPageLoad(function() {
    BulbBreakerGame.init();
});