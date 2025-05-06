/**
 * Renk Eşleştirme Oyunu için JavaScript
 */
const ColorMatchGame = (function() {
    // DOM elementleri
    let targetColor;
    let colorGrid;
    let scoreDisplay;
    let bestScoreDisplay;
    let levelDisplay;
    let timeBar;
    let startBtn;
    
    // Oyun değişkenleri
    let score = 0;
    let bestScore = 0;
    let level = 1;
    let isGameActive = false;
    let timer;
    let timeRemaining = 100; // 100% zamanlayıcı
    let timerSpeed = 20; // Ms cinsinden zamanlayıcı azalma hızı
    let currentTargetColor = '';
    let currentGridColors = [];
    let colorSimilarityRange = 40; // Benzer renkler için RGB farkı
    
    // DOM elementlerini başlat
    function initElements() {
        targetColor = document.getElementById('color-match-target');
        colorGrid = document.getElementById('color-match-grid');
        scoreDisplay = document.getElementById('color-match-score');
        bestScoreDisplay = document.getElementById('color-match-best-score');
        levelDisplay = document.getElementById('color-match-level');
        timeBar = document.getElementById('color-match-time-bar');
        startBtn = document.getElementById('color-match-start');
    }
    
    // Hex rengini RGB'ye çevir
    function hexToRgb(hex) {
        hex = hex.replace(/^#/, '');
        
        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        
        return { r, g, b };
    }
    
    // RGB değerlerini hex'e çevir
    function rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    
    // Çok sayıda farklı renk arasından rastgele seç
    function generateRandomColor() {
        // Renk isimlerini ve kodlarını bir nesne olarak tanımlıyoruz (genişletilmiş renk listesi)
        const colorMap = {
            'KIRMIZI': '#FF0000',
            'KOYU KIRMIZI': '#8B0000',
            'AÇIK KIRMIZI': '#FF6347',
            'MAVİ': '#0000FF',
            'AÇIK MAVİ': '#1E90FF',
            'GÖK MAVİSİ': '#87CEEB',
            'DENİZ MAVİSİ': '#4682B4',
            'LACIVERT': '#000080',
            'YEŞİL': '#008000',
            'AÇIK YEŞİL': '#90EE90',
            'KOYU YEŞİL': '#006400',
            'ORMAN YEŞİLİ': '#228B22',
            'ZEYTİN YEŞİLİ': '#808000',
            'MOR': '#800080',
            'AÇIK MOR': '#BA55D3',
            'EFLATUN': '#9370DB',
            'KOYU MOR': '#4B0082',
            'TURUNCU': '#FFA500',
            'KOYU TURUNCU': '#FF8C00',
            'AÇIK TURUNCU': '#FFD700',
            'SARI': '#FFFF00',
            'SARI YEŞİL': '#ADFF2F',
            'PEMBE': '#FFC0CB',
            'AÇIK PEMBE': '#FFB6C1',
            'KOYU PEMBE': '#FF1493',
            'KAHVERENGI': '#A52A2A',
            'AÇIK KAHVE': '#D2691E',
            'KOYU KAHVE': '#8B4513',
            'BEJ': '#F5F5DC',
            'BORDO': '#800000',
            'TURKUAZ': '#40E0D0',
            'AÇIK TURKUAZ': '#AFEEEE',
            'KOYU TURKUAZ': '#008B8B',
            'GRİ': '#808080',
            'AÇIK GRİ': '#D3D3D3',
            'KOYU GRİ': '#696969',
            'SİYAH': '#000000'
        };
        
        // Tüm renk isimlerinden oluşan bir dizi
        const colorNames = Object.keys(colorMap);
        
        // Rastgele bir renk ismi seçip, onun kodunu döndür
        const randomColorName = getRandomElement(colorNames);
        console.log("Seçilen renk: " + randomColorName);
        return colorMap[randomColorName];
    }
    
    // Bir renge benzer bir renk üret
    function generateSimilarColor(baseColor, range) {
        const rgb = hexToRgb(baseColor);
        
        // Her renk kanalı için +-range aralığında değişim
        const r = Math.min(255, Math.max(0, rgb.r + getRandomInt(-range, range)));
        const g = Math.min(255, Math.max(0, rgb.g + getRandomInt(-range, range)));
        const b = Math.min(255, Math.max(0, rgb.b + getRandomInt(-range, range)));
        
        return rgbToHex(r, g, b);
    }
    
    // İki rengin ne kadar benzer olduğunu hesapla (0-765 arası değer, 0 tamamen aynı)
    function calculateColorDifference(color1, color2) {
        const rgb1 = hexToRgb(color1);
        const rgb2 = hexToRgb(color2);
        
        return Math.abs(rgb1.r - rgb2.r) + Math.abs(rgb1.g - rgb2.g) + Math.abs(rgb1.b - rgb2.b);
    }
    
    // Her zaman 5 seçenek olmasını sağla
    function getGridSize() {
        return 5; // Her zaman tam olarak 5 seçenek göster
    }
    
    // Seviye tabanlı benzerlik aralığı - daha belirgin farklar için değeri artırıldı
    function getSimilarityRange() {
        return Math.max(40, 70 - (level * 2)); // Daha yüksek değer = daha farklı renkler
    }
    
    // Renk ızgarasını oluştur
    function createColorGrid() {
        if (!colorGrid) return;
        
        colorGrid.innerHTML = '';
        
        // Tüm renk seçeneklerini renkler fonksiyonundan al
        const colorMap = {
            'KIRMIZI': '#FF0000',
            'KOYU KIRMIZI': '#8B0000',
            'AÇIK KIRMIZI': '#FF6347',
            'MAVİ': '#0000FF',
            'AÇIK MAVİ': '#1E90FF',
            'GÖK MAVİSİ': '#87CEEB',
            'DENİZ MAVİSİ': '#4682B4',
            'LACIVERT': '#000080',
            'YEŞİL': '#008000',
            'AÇIK YEŞİL': '#90EE90',
            'KOYU YEŞİL': '#006400',
            'ORMAN YEŞİLİ': '#228B22',
            'ZEYTİN YEŞİLİ': '#808000',
            'MOR': '#800080',
            'AÇIK MOR': '#BA55D3',
            'EFLATUN': '#9370DB',
            'KOYU MOR': '#4B0082',
            'TURUNCU': '#FFA500',
            'KOYU TURUNCU': '#FF8C00',
            'AÇIK TURUNCU': '#FFD700',
            'SARI': '#FFFF00',
            'SARI YEŞİL': '#ADFF2F',
            'PEMBE': '#FFC0CB',
            'AÇIK PEMBE': '#FFB6C1',
            'KOYU PEMBE': '#FF1493',
            'KAHVERENGI': '#A52A2A',
            'AÇIK KAHVE': '#D2691E',
            'KOYU KAHVE': '#8B4513',
            'BEJ': '#F5F5DC',
            'BORDO': '#800000',
            'TURKUAZ': '#40E0D0',
            'AÇIK TURKUAZ': '#AFEEEE',
            'KOYU TURKUAZ': '#008B8B',
            'GRİ': '#808080',
            'AÇIK GRİ': '#D3D3D3',
            'KOYU GRİ': '#696969',
            'SİYAH': '#000000'
        };
        
        // Kodu hex'ten isim olarak çeviren nesne oluştur
        const allColors = {};
        Object.entries(colorMap).forEach(([name, hex]) => {
            allColors[hex] = name;
        });
        
        // Hedef rengi belirle
        currentTargetColor = generateRandomColor();
        
        // Hedef rengi göster
        if (targetColor) {
            targetColor.style.backgroundColor = currentTargetColor;
            targetColor.innerHTML = ''; // Renk adını gösterme
        }
        
        // Izgara büyüklüğü
        const gridSize = getGridSize();
        
        // Doğru rengin konumunu belirle
        const correctIndex = getRandomInt(0, gridSize - 1);
        
        // Kullanılabilir renklerin bir kopyasını oluştur ve hedef rengi çıkar
        let availableColors = Object.keys(allColors).filter(color => color !== currentTargetColor);
        
        // Renkleri oluştur
        currentGridColors = [];
        for (let i = 0; i < gridSize; i++) {
            let colorHex;
            
            if (i === correctIndex) {
                // Doğru renk
                colorHex = currentTargetColor;
            } else if (availableColors.length > 0) {
                // Tamamen farklı renk kullan
                const randomIndex = getRandomInt(0, availableColors.length - 1);
                colorHex = availableColors[randomIndex];
                // Kullanılan rengi listeden çıkar (tekrarı önle)
                availableColors.splice(randomIndex, 1);
                
                // Eğer tüm farklı renkler bittiyse, benzer renkler üretmeye başla
                if (availableColors.length === 0 && i < gridSize - 1) {
                    // Benzer renkler oluştur (kalan hücreler için)
                    for (let j = 0; j < gridSize - i - 1; j++) {
                        availableColors.push(generateSimilarColor(currentTargetColor, 120)); // Belirgin fark için daha yüksek değer
                    }
                }
            } else {
                // Yedek olarak, belirgin şekilde farklı bir renk oluştur
                colorHex = generateSimilarColor(currentTargetColor, 150);
            }
            
            currentGridColors.push(colorHex);
            
            // Renk kartını oluştur
            const colorItem = document.createElement('div');
            colorItem.className = 'color-match-item';
            colorItem.style.backgroundColor = colorHex;
            colorItem.dataset.index = i;
            
            // Tıklama olayı
            colorItem.addEventListener('click', function() {
                if (!isGameActive) return;
                
                const clickedIndex = parseInt(this.dataset.index);
                checkColorMatch(clickedIndex);
            });
            
            colorGrid.appendChild(colorItem);
        }
    }
    
    // Tıklanan rengi kontrol et
    function checkColorMatch(index) {
        if (!isGameActive) return;
        
        const selectedColor = currentGridColors[index];
        const difference = calculateColorDifference(selectedColor, currentTargetColor);
        
        if (difference === 0) {
            // Doğru eşleşme
            handleCorrectMatch();
        } else {
            // Yanlış eşleşme
            handleWrongMatch();
        }
    }
    
    // Doğru eşleşme
    function handleCorrectMatch() {
        // Skoru artır
        score += level;
        updateScore();
        
        // Zamanlayıcıyı yenile
        timeRemaining = 100;
        updateTimeBar();
        
        // Seviyeyi artır
        level++;
        updateLevel();
        
        // Yeni renk ızgarası oluştur
        createColorGrid();
        
        console.log(`Doğru eşleşme! Skor: ${score}, Seviye: ${level}`);
    }
    
    // Yanlış eşleşme
    function handleWrongMatch() {
        // Zamanı cezalandır
        timeRemaining = Math.max(20, timeRemaining - 20);
        updateTimeBar();
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
            const state = GameState.getColorMatchState();
            GameState.updateColorMatchState({
                ...state,
                highScore: bestScore
            });
        }
    }
    
    // Seviyeyi güncelle
    function updateLevel() {
        if (levelDisplay) {
            levelDisplay.textContent = level;
        }
        
        // En yüksek seviyeyi güncelle
        const state = GameState.getColorMatchState();
        if (level > state.highestLevel) {
            GameState.updateColorMatchState({
                ...state,
                highestLevel: level
            });
        }
        
        // Seviye arttıkça zamanlayıcıyı hızlandır
        timerSpeed = Math.max(5, 20 - (level * 1.5));
    }
    
    // Zaman çubuğunu güncelle
    function updateTimeBar() {
        if (timeBar) {
            timeBar.style.width = `${timeRemaining}%`;
        }
    }
    
    // Zamanlayıcıyı başlat
    function startTimer() {
        if (timer) clearInterval(timer);
        
        timer = setInterval(() => {
            if (!isGameActive) return;
            
            // Daha yavaş azalma oranı - 0.5 yerine 0.2
            timeRemaining -= 0.2;
            updateTimeBar();
            
            if (timeRemaining <= 0) {
                gameOver();
            }
        }, timerSpeed);
    }
    
    // Oyunu başlat
    function startGame() {
        // Varsa önceki oyunu temizle
        clearGame();
        
        // Oyun durumunu başlat
        isGameActive = true;
        score = 0;
        level = 1;
        timeRemaining = 100;
        timerSpeed = 30; // Süreyi uzatmak için timer hızını azalttık (20 yerine 30)
        
        // Arayüzü güncelle
        updateScore();
        updateLevel();
        updateTimeBar();
        
        // Renk ızgarasını oluştur
        createColorGrid();
        
        // Zamanlayıcıyı başlat
        startTimer();
        
        // Buton metnini değiştir
        if (startBtn) {
            startBtn.textContent = 'Yeniden Başlat';
        }
        
        console.log('Renk Eşleştirme Oyunu başlatıldı');
    }
    
    // Oyunu temizle
    function clearGame() {
        isGameActive = false;
        
        // Zamanlayıcıyı temizle
        if (timer) clearInterval(timer);
        
        // Izgara ve hedef rengi temizle
        if (colorGrid) {
            colorGrid.innerHTML = '';
        }
    }
    
    // Oyun sonu
    function gameOver() {
        clearGame();
        
        // GameState'i güncelle
        const state = GameState.getColorMatchState();
        GameState.updateColorMatchState({
            ...state,
            highScore: bestScore,
            highestLevel: Math.max(state.highestLevel, level)
        });
        
        // Oyun sonu mesajını göster - "Süre Bitti" formatında
        const gameInfoEl = document.getElementById('color-match-info');
        if (gameInfoEl) {
            gameInfoEl.innerHTML = `
                <div class="time-up-message">SÜRE BİTTİ!</div>
                <div class="game-results">
                    Skorun: <strong>${score}</strong> | 
                    Seviye: <strong>${level}</strong>
                </div>
            `;
        }
        
        // Başlat butonunu tekrar göster
        if (startBtn) {
            startBtn.style.display = 'block';
            startBtn.textContent = 'Tekrar Oyna';
        }
    }
    
    // Olay dinleyicilerini ayarla
    function setupEventListeners() {
        // Başlatma butonu
        if (startBtn) {
            startBtn.addEventListener('click', startGame);
        }
    }
    
    // Renk Eşleştirme oyununu başlat
    function initColorMatchGame() {
        initElements();
        
        // En yüksek skoru GameState'den al
        const state = GameState.getColorMatchState();
        bestScore = state.highScore || 0;
        
        if (bestScoreDisplay) {
            bestScoreDisplay.textContent = bestScore;
        }
        
        setupEventListeners();
    }
    
    // Sayfa yüklendiğinde oyunu başlat
    onPageLoad(initColorMatchGame);
    
    // Dışa aktarılan fonksiyonlar
    return {
        start: startGame
    };
})();