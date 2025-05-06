/**
 * Baloncuk Patlatma Oyunu için JavaScript
 */
const BubbleGame = (function() {
    // DOM elementleri
    let bubbleContainer;
    let scoreDisplay;
    let bestScoreDisplay;
    let timeDisplay;
    let startBtn;
    let difficultyButtons;
    
    // Oyun değişkenleri
    let score = 0;
    let bestScore = 0;
    let remainingTime = 60;
    let isGameActive = false;
    let gameTimer;
    let bubbles = [];
    let bubbleCreationInterval;
    let difficulty = 'easy'; // 'easy', 'medium', 'hard'
    
    // Zorluk seviyesi ayarları
    const difficultySettings = {
        easy: {
            bubbleInterval: 2000,  // Her 2 saniyede bir balon (daha yavaş)
            maxBubbles: 8,         // Ekranda maksimum 8 balon
            bubbleSpeed: 0.8,      // Balonların hareket hızı (çok yavaş)
            minSize: 70,           // Daha büyük balon boyutu
            maxSize: 100,          // Daha büyük maksimum boyut
            timeBonus: 1,          // Patlattığında +1 saniye
            points: 1              // Her balon 1 puan
        },
        medium: {
            bubbleInterval: 1500,  // Her 1.5 saniyede bir balon
            maxBubbles: 12,        // Ekranda maksimum 12 balon
            bubbleSpeed: 1.8,      // Balonların hareket hızı (orta)
            minSize: 50,           // Orta balon boyutu
            maxSize: 80,           // Orta maksimum boyut
            timeBonus: 1,          // Patlattığında +1 saniye
            points: 2              // Her balon 2 puan
        },
        hard: {
            bubbleInterval: 1000,  // Her 1 saniyede bir balon
            maxBubbles: 15,        // Ekranda maksimum 15 balon
            bubbleSpeed: 3.5,      // Daha hızlı hareket (çok hızlı)
            minSize: 40,           // Daha küçük balon boyutu
            maxSize: 70,           // Daha küçük maksimum boyut
            timeBonus: 2,          // Patlattığında +2 saniye
            points: 3              // Her balon 3 puan
        }
    };
    
    // Balon renkleri
    const bubbleColors = [
        '#FF5252', // Kırmızı
        '#FFAB40', // Turuncu
        '#FFEB3B', // Sarı
        '#66BB6A', // Yeşil
        '#42A5F5', // Mavi
        '#7E57C2', // Mor
        '#EC407A', // Pembe
        '#26A69A', // Turkuaz
        '#78909C'  // Gri-Mavi
    ];
    
    // DOM elementlerini başlat
    function initElements() {
        bubbleContainer = document.getElementById('bubble-container');
        scoreDisplay = document.getElementById('bubble-score');
        bestScoreDisplay = document.getElementById('bubble-best-score');
        timeDisplay = document.getElementById('bubble-time');
        startBtn = document.getElementById('bubble-start');
        difficultyButtons = document.querySelectorAll('#bubble-controls .difficulty-btn');
    }
    
    // Rasgele konumda balon oluştur
    function createBubble() {
        if (!isGameActive || !bubbleContainer) return;
        if (bubbles.length >= difficultySettings[difficulty].maxBubbles) return;
        
        const size = getRandomInt(difficultySettings[difficulty].minSize, difficultySettings[difficulty].maxSize);
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.backgroundColor = getRandomElement(bubbleColors);
        
        // Balona sadece H harfi ekle
        bubble.textContent = "H";
        
        // Rastgele konum belirle (taşmayı önle)
        const containerWidth = bubbleContainer.clientWidth;
        const containerHeight = bubbleContainer.clientHeight;
        const maxX = containerWidth - size;
        const maxY = containerHeight - size;
        
        const x = getRandomInt(0, maxX);
        const y = getRandomInt(0, maxY);
        
        bubble.style.left = `${x}px`;
        bubble.style.top = `${y}px`;
        
        // Balonu patlatma olayı
        bubble.addEventListener('click', function() {
            popBubble(bubble);
        });
        
        bubbleContainer.appendChild(bubble);
        bubbles.push(bubble);
        
        // Hareket ettirme
        moveBubble(bubble);
    }
    
    // Rasgele emoji döndür
    function getRandomEmoji() {
        const emojis = ['💖', '💕', '😊', '🌟', '✨', '🎈', '🎁', '🎵', '🍭', '🍬', '🌈'];
        return getRandomElement(emojis);
    }
    
    // Balonu hareket ettir
    function moveBubble(bubble) {
        if (!isGameActive) return;
        
        const containerWidth = bubbleContainer.clientWidth;
        const containerHeight = bubbleContainer.clientHeight;
        const bubbleWidth = bubble.offsetWidth;
        const bubbleHeight = bubble.offsetHeight;
        
        // Rastgele x ve y değişim değerleri
        const dx = (Math.random() - 0.5) * 2 * difficultySettings[difficulty].bubbleSpeed;
        const dy = (Math.random() - 0.5) * 2 * difficultySettings[difficulty].bubbleSpeed;
        
        let x = parseInt(bubble.style.left);
        let y = parseInt(bubble.style.top);
        
        // Hareket fonksiyonu
        function animate() {
            if (!isGameActive || !bubbles.includes(bubble)) return;
            
            x += dx;
            y += dy;
            
            // Sınırları kontrol et - ekrandan çıkınca karşıdan girsin
            if (x < -bubbleWidth) {
                x = containerWidth; // Soldan çıkınca sağdan gir
            } else if (x > containerWidth) {
                x = -bubbleWidth; // Sağdan çıkınca soldan gir
            }
            
            if (y < -bubbleHeight) {
                y = containerHeight; // Üstten çıkınca alttan gir
            } else if (y > containerHeight) {
                y = -bubbleHeight; // Alttan çıkınca üstten gir
            }
            
            bubble.style.left = `${x}px`;
            bubble.style.top = `${y}px`;
            
            requestAnimationFrame(animate);
        }
        
        requestAnimationFrame(animate);
    }
    
    // Balonu patlat
    function popBubble(bubble) {
        // Skoru artır
        score += difficultySettings[difficulty].points;
        updateScore();
        
        // Zamanı artır
        remainingTime += difficultySettings[difficulty].timeBonus;
        updateTime();
        
        // Patlatma animasyonu
        bubble.style.transform = 'scale(1.5)';
        bubble.style.opacity = '0';
        
        // Balonları listeden çıkar
        const index = bubbles.indexOf(bubble);
        if (index > -1) {
            bubbles.splice(index, 1);
        }
        
        // Balonu kaldır
        setTimeout(() => {
            if (bubble.parentNode) {
                bubble.parentNode.removeChild(bubble);
            }
            
            // Bir balon patlatıldığında yeni balon oluştur
            if (isGameActive) {
                createBubble();
            }
        }, 300);
    }
    
    // Skoru güncelle
    function updateScore() {
        if (scoreDisplay) {
            scoreDisplay.textContent = score;
        }
        
        // En yüksek skoru güncelle
        if (score > bestScore) {
            bestScore = score;
            
            if (bestScoreDisplay) {
                bestScoreDisplay.textContent = bestScore;
            }
            
            // GameState'i güncelle
            const state = GameState.getBubbleState();
            GameState.updateBubbleState({
                ...state,
                highScore: bestScore
            });
        }
    }
    
    // Zamanı güncelle
    function updateTime() {
        if (timeDisplay) {
            timeDisplay.textContent = Math.max(0, Math.floor(remainingTime));
        }
    }
    
    // Oyunu başlat
    function startGame() {
        // Varsa önceki oyunu temizle
        clearGame();
        
        // Oyun durumunu başlat
        isGameActive = true;
        score = 0;
        remainingTime = 60;
        bubbles = [];
        
        // Skoru güncelle
        updateScore();
        updateTime();
        
        // Buton metnini değiştir
        if (startBtn) {
            startBtn.textContent = 'Yeniden Başlat';
        }
        
        // İlk balonu oluştur
        createBubble();
        
        // Zaman sayacını başlat
        gameTimer = setInterval(() => {
            remainingTime -= 0.1;
            updateTime();
            
            if (remainingTime <= 0) {
                gameOver();
            }
        }, 100);
        
        console.log(`Baloncuk Patlatma Oyunu başlatıldı. Zorluk: ${difficulty}`);
    }
    
    // Oyunu temizle
    function clearGame() {
        isGameActive = false;
        
        // Zamanlayıcıları temizle
        if (gameTimer) clearInterval(gameTimer);
        if (bubbleCreationInterval) clearInterval(bubbleCreationInterval);
        
        // Tüm balonları temizle
        if (bubbleContainer) {
            bubbleContainer.innerHTML = '';
        }
        
        bubbles = [];
    }
    
    // Oyun sonu
    function gameOver() {
        clearGame();
        
        // GameState'i güncelle
        const state = GameState.getBubbleState();
        GameState.updateBubbleState({
            ...state,
            highScore: bestScore,
            lastLevel: difficultyToLevel(difficulty)
        });
        
        // Oyun sonu mesajını göster - "Süre Bitti" formatında
        const gameInfoEl = document.getElementById('bubble-game-info');
        if (gameInfoEl) {
            gameInfoEl.innerHTML = `
                <div class="time-up-message">SÜRE BİTTİ!</div>
                <div class="game-results">
                    Skorun: <strong>${score}</strong>
                    ${score > bestScore ? '<span class="win-message">Yeni Rekor!</span>' : ''}
                </div>
            `;
        }
        
        // Zorluk seçeneklerini ve başlatma butonunu tekrar göster
        const difficultySelector = document.getElementById('bubble-difficulty');
        if (difficultySelector) {
            difficultySelector.style.display = 'flex';
        }
        
        // Başlat butonunu göster
        const startBtn = document.getElementById('bubble-start-btn');
        if (startBtn) {
            startBtn.style.display = 'inline-block';
            startBtn.textContent = 'Tekrar Oyna';
        }
    }
    
    // Zorluk seviyesini sayıya çevir
    function difficultyToLevel(diff) {
        switch(diff) {
            case 'easy': return 1;
            case 'medium': return 2;
            case 'hard': return 3;
            default: return 1;
        }
    }
    
    // Zorluk seviyesini ayarla
    function setDifficulty(newDifficulty) {
        difficulty = newDifficulty;
        
        // UI'da seçili göster
        if (difficultyButtons) {
            difficultyButtons.forEach(btn => {
                btn.classList.remove('selected');
                if (btn.dataset.difficulty === newDifficulty) {
                    btn.classList.add('selected');
                }
            });
        }
        
        console.log(`Zorluk seviyesi değiştirildi: ${difficulty}`);
    }
    
    // Olay dinleyicilerini ayarla
    function setupEventListeners() {
        // Başlatma butonu
        if (startBtn) {
            startBtn.addEventListener('click', startGame);
        }
        
        // Zorluk seviyesi butonları
        if (difficultyButtons) {
            difficultyButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    setDifficulty(this.dataset.difficulty);
                });
            });
        }
        
        // Pencere boyutu değiştiğinde balonları temizle
        window.addEventListener('resize', () => {
            if (isGameActive) {
                clearGame();
                startGame();
            }
        });
    }
    
    // Baloncuk Patlatma oyununu başlat
    function initBubbleGame() {
        initElements();
        
        // En yüksek skoru GameState'den al
        const state = GameState.getBubbleState();
        bestScore = state.highScore || 0;
        
        if (bestScoreDisplay) {
            bestScoreDisplay.textContent = bestScore;
        }
        
        // Son zorluk seviyesini ayarla
        if (state.lastLevel) {
            switch(state.lastLevel) {
                case 1: setDifficulty('easy'); break;
                case 2: setDifficulty('medium'); break;
                case 3: setDifficulty('hard'); break;
                default: setDifficulty('easy');
            }
        }
        
        setupEventListeners();
    }
    
    // Sayfa yüklendiğinde oyunu başlat
    onPageLoad(initBubbleGame);
    
    // Dışa aktarılan fonksiyonlar
    return {
        start: startGame,
        setDifficulty: setDifficulty
    };
})();