/**
 * Yılan Oyunu için JavaScript
 */
const SnakeGame = (function() {
    // Ayarlar
    const CELL_SIZE = 20;
    const BOARD_WIDTH = 20;
    const BOARD_HEIGHT = 20;
    const INITIAL_SPEED = 200; // milisaniye başına hareket
    const SPEED_INCREASE = 5; // her yemek için hız artışı
    
    // Görünür oyun alanı boyutları (piksel olarak)
    let visibleBoardWidth = 0;
    let visibleBoardHeight = 0;
    
    // Cihaz ve ekran kontrolü
    let isMobile = false;
    let boardElement = null;
    
    // Mobil cihaz kontrolü
    function checkMobile() {
        return window.innerWidth < 768 || 
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    // Yönler
    const DIRECTIONS = {
        UP: { x: 0, y: -1 },
        DOWN: { x: 0, y: 1 },
        LEFT: { x: -1, y: 0 },
        RIGHT: { x: 1, y: 0 }
    };
    
    // Oyun durumu
    let snake = [];
    let food = {};
    let direction = DIRECTIONS.RIGHT;
    let nextDirection = DIRECTIONS.RIGHT;
    let score = 0;
    let bestScore = 0;
    let gameInterval = null;
    let isGameOver = false;
    let isPaused = false;
    let speed = INITIAL_SPEED;
    
    // Gerçek ekran boyutlarını ölç
    function measureBoardSize() {
        if (!boardElement) return;
        
        visibleBoardWidth = boardElement.clientWidth;
        visibleBoardHeight = boardElement.clientHeight;
        
        console.log(`Ölçülen tahta boyutları: ${visibleBoardWidth}x${visibleBoardHeight} piksel`);
        
        // Görünür hücre sayısını hesapla
        const visibleCellsX = Math.floor(visibleBoardWidth / CELL_SIZE);
        const visibleCellsY = Math.floor(visibleBoardHeight / CELL_SIZE);
        
        console.log(`Görünür hücre sayısı: ${visibleCellsX}x${visibleCellsY}`);
    }
    
    // DOM elementleri
    const snakeBoard = document.getElementById('snake-board');
    const scoreDisplay = document.getElementById('snake-score');
    const bestScoreDisplay = document.getElementById('snake-best-score');
    const startBtn = document.getElementById('snake-start');
    const pauseBtn = document.getElementById('snake-pause');
    const upBtn = document.getElementById('snake-up');
    const downBtn = document.getElementById('snake-down');
    const leftBtn = document.getElementById('snake-left');
    const rightBtn = document.getElementById('snake-right');
    
    // Yılanı başlangıç konumuna ayarla
    function initSnake() {
        snake = [
            { x: 3, y: 10 },
            { x: 2, y: 10 },
            { x: 1, y: 10 }
        ];
        direction = DIRECTIONS.RIGHT;
        nextDirection = DIRECTIONS.RIGHT;
    }
    
    // Yeni yemek oluştur
    function createFood() {
        // Boş hücreleri bul
        const emptyCells = [];
        
        // MOBİL PROBLEM ÇÖZÜMÜ: Sabit bir yem alanı belirleyelim 
        // Bu şekilde mobil cihazlarda da yem hep görünür olacak
        
        // Cihaz tipini kontrol et
        isMobile = checkMobile();
        
        // Ana mantık: sabit bir küçük alan içinde yem oluşturacağız
        // Bu alan hem masaüstünde hem de mobil cihazlarda görünür olacak
        
        // TAMAMEN GÖZDEN GEÇİRİLMİŞ YAKLAŞIM: Sabit bir güvenli bölge
        // Mobilde de masaüstünde de çalışması garantili, çok merkezi bir alan
        
        // Görünür tahtanın orta alanını kullan
        const centerX = Math.floor(BOARD_WIDTH / 2);
        const centerY = Math.floor(BOARD_HEIGHT / 2);
        
        // Sabit ve dar bir güvenli alan belirle (merkez etrafında 5x5 blok)
        // Bu alan çok küçük olduğu için hem masaüstünde hem de en küçük mobil cihazlarda bile görünür olacak
        const safeRadius = isMobile ? 3 : 5; // Mobilde daha küçük bir alan kullan
        
        const MIN_X = Math.max(1, centerX - safeRadius);
        const MIN_Y = Math.max(1, centerY - safeRadius);
        const MAX_X = Math.min(BOARD_WIDTH - 2, centerX + safeRadius);
        const MAX_Y = Math.min(BOARD_HEIGHT - 2, centerY + safeRadius);
        
        console.log(`${isMobile ? 'Mobil' : 'Masaüstü'} için güvenli yem alanı: (${MIN_X},${MIN_Y}) - (${MAX_X},${MAX_Y})`);
            
        // Çok küçük bir alanda çalışacağımızı log ile bildir
        console.log(`Merkez etrafında ${safeRadius*2 + 1}x${safeRadius*2 + 1} boyutunda güvenli bir alan kullanılıyor`)
        
        // Sadece güvenli bölgede boş hücreleri tara
        for (let y = MIN_Y; y <= MAX_Y; y++) {
            for (let x = MIN_X; x <= MAX_X; x++) {
                // Yılanın olmadığı hücreleri bul
                if (!snake.some(segment => segment.x === x && segment.y === y)) {
                    emptyCells.push({ x, y });
                }
            }
        }
        
        // Boş hücre var mı kontrol et
        if (emptyCells.length > 0) {
            // Ortaya yakın bir konum seç - tamamen rastgele değil
            // Orta noktayı bul
            const centerX = Math.floor((MIN_X + MAX_X) / 2);
            const centerY = Math.floor((MIN_Y + MAX_Y) / 2);
            
            // Hücreleri merkeze olan uzaklıklarına göre sırala (en yakından en uzağa)
            emptyCells.sort((a, b) => {
                const distA = Math.sqrt(Math.pow(centerX - a.x, 2) + Math.pow(centerY - a.y, 2));
                const distB = Math.sqrt(Math.pow(centerX - b.x, 2) + Math.pow(centerY - b.y, 2));
                return distA - distB;
            });
            
            // İlk %30'luk kısım arasından rastgele seç (merkeze yakın hücreler)
            const selectIndex = Math.floor(Math.random() * Math.min(emptyCells.length, Math.ceil(emptyCells.length * 0.3)));
            food = emptyCells[selectIndex];
            
            console.log(`Merkeze yakın yemek konumu: (${food.x}, ${food.y})`);
        } else {
            // Boş hücre yoksa, mümkün olduğunca merkeze yakın ve boş bir hücre bul
            const centerX = Math.floor(BOARD_WIDTH / 2);
            const centerY = Math.floor(BOARD_HEIGHT / 2);
            
            // Merkeze en yakın boş hücreyi bul
            let bestDistance = Infinity;
            let bestCell = null;
            
            // Tüm tahtayı tara
            for (let y = 0; y < BOARD_HEIGHT; y++) {
                for (let x = 0; x < BOARD_WIDTH; x++) {
                    if (!snake.some(segment => segment.x === x && segment.y === y)) {
                        const distance = Math.sqrt(Math.pow(centerX - x, 2) + Math.pow(centerY - y, 2));
                        if (distance < bestDistance) {
                            bestDistance = distance;
                            bestCell = { x, y };
                        }
                    }
                }
            }
            
            if (bestCell) {
                food = bestCell;
                console.log(`En uygun yemek konumu: (${food.x}, ${food.y})`);
            } else {
                // Hiç boş hücre bulunamadıysa (neredeyse imkansız) merkezi kullan
                food = { x: centerX, y: centerY };
                console.log(`Son çare merkez konumu: (${food.x}, ${food.y})`);
            }
        }
        
        // Son bir güvenlik kontrolü - yem pozisyonunun geçerli olduğundan emin ol
        if (food.x < 0 || food.x >= BOARD_WIDTH || food.y < 0 || food.y >= BOARD_HEIGHT) {
            // Geçersiz konum bulunduysa merkeze yerleştir
            food = { 
                x: Math.floor(BOARD_WIDTH / 2), 
                y: Math.floor(BOARD_HEIGHT / 2) 
            };
            console.log(`GEÇERSİZ YEM KONUMU DÜZELTİLDİ: (${food.x}, ${food.y})`);
        }
    }
    
    // Yılanı hareket ettir
    function moveSnake() {
        if (isPaused || isGameOver) return;
        
        // Yönü güncelle
        direction = nextDirection;
        
        // Yeni kafa konumu hesapla
        const head = { ...snake[0] };
        head.x += direction.x;
        head.y += direction.y;
        
        // Görünür oyun alanı sınırları (beyaz alanın sınırları)
        const visibleMinX = 0;
        const visibleMinY = 0;
        const visibleMaxX = BOARD_WIDTH - 1;
        const visibleMaxY = BOARD_HEIGHT - 1;
        
        // Sınırlara çarpma kontrolü
        if (head.x < visibleMinX || head.x > visibleMaxX || head.y < visibleMinY || head.y > visibleMaxY) {
            gameOver();
            return;
        }
        
        // Kendine çarpma kontrolü
        if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            gameOver();
            return;
        }
        
        // Yeni kafayı yılanın başına ekle
        snake.unshift(head);
        
        // Yemek kontrolü
        if (head.x === food.x && head.y === food.y) {
            // Yemeği yedi, skor artışı
            score += 10;
            updateScore();
            
            // Yeni yemek oluştur
            createFood();
            
            // Hızı artır (minimum 50ms)
            speed = Math.max(50, INITIAL_SPEED - (score / 10) * SPEED_INCREASE);
            resetInterval();
        } else {
            // Yemek yemediyse kuyruğu kısalt
            snake.pop();
        }
        
        // Ekranı güncelle
        updateBoard();
    }
    
    // Oyun tahtasını güncelle
    function updateBoard() {
        if (!snakeBoard) return;
        
        // Tahta içeriğini temizle
        snakeBoard.innerHTML = '';
        
        // Yılanı çiz
        snake.forEach((segment, index) => {
            const snakeElement = document.createElement('div');
            snakeElement.className = 'snake-cell';
            
            // Baş veya gövde sınıfı ekle
            if (index === 0) {
                snakeElement.classList.add('snake-head');
            } else {
                snakeElement.classList.add('snake-body');
            }
            
            // Konumu ayarla
            snakeElement.style.left = `${segment.x * CELL_SIZE}px`;
            snakeElement.style.top = `${segment.y * CELL_SIZE}px`;
            
            snakeBoard.appendChild(snakeElement);
        });
        
        // Yemeği çiz
        const foodElement = document.createElement('div');
        foodElement.className = 'snake-cell food';
        foodElement.style.left = `${food.x * CELL_SIZE}px`;
        foodElement.style.top = `${food.y * CELL_SIZE}px`;
        
        snakeBoard.appendChild(foodElement);
    }
    
    // Skor güncelleme
    function updateScore() {
        if (scoreDisplay) scoreDisplay.textContent = score;
        
        // En iyi skoru güncelle
        if (score > bestScore) {
            bestScore = score;
            if (bestScoreDisplay) bestScoreDisplay.textContent = bestScore;
            
            // GameState'i güncelle
            GameState.updateSnakeState({ highScore: bestScore });
        }
    }
    
    // Yön değiştirme
    function changeDirection(newDirection) {
        // Zıt yönlere geçişi engelle
        if (
            (newDirection === DIRECTIONS.UP && direction === DIRECTIONS.DOWN) ||
            (newDirection === DIRECTIONS.DOWN && direction === DIRECTIONS.UP) ||
            (newDirection === DIRECTIONS.LEFT && direction === DIRECTIONS.RIGHT) ||
            (newDirection === DIRECTIONS.RIGHT && direction === DIRECTIONS.LEFT)
        ) {
            return;
        }
        
        nextDirection = newDirection;
    }
    
    // Interval'i sıfırla
    function resetInterval() {
        if (gameInterval) {
            clearInterval(gameInterval);
        }
        gameInterval = setInterval(moveSnake, speed);
    }
    
    // Oyunu başlat
    function startGame() {
        // Oyun durumunu sıfırla
        score = 0;
        speed = INITIAL_SPEED;
        isGameOver = false;
        isPaused = false;
        
        // Cihaz tipini tekrar kontrol et
        isMobile = checkMobile();
        console.log(`Oyun başlatılırken algılanan cihaz: ${isMobile ? 'Mobil' : 'Masaüstü'}`);
        
        // Yılanı oluştur
        initSnake();
        
        // Yemeği oluştur
        createFood();
        
        // Skoru güncelle
        updateScore();
        
        // Tahta görünümünü güncelle
        updateBoard();
        
        // Interval'i başlat
        resetInterval();
        
        // Buton görünürlüklerini ayarla
        if (startBtn) startBtn.textContent = 'Yeniden Başlat';
        if (pauseBtn) {
            pauseBtn.style.display = 'block';
            pauseBtn.textContent = 'Duraklat';
        }
    }
    
    // Oyunu duraklat/devam ettir
    function togglePause() {
        if (isGameOver) return;
        
        isPaused = !isPaused;
        
        if (isPaused) {
            // Oyunu duraklat
            clearInterval(gameInterval);
            if (pauseBtn) pauseBtn.textContent = 'Devam Et';
        } else {
            // Oyuna devam et
            gameInterval = setInterval(moveSnake, speed);
            if (pauseBtn) pauseBtn.textContent = 'Duraklat';
        }
    }
    
    // Oyun bitti
    function gameOver() {
        isGameOver = true;
        clearInterval(gameInterval);
        
        // Buton görünürlüklerini ayarla
        if (pauseBtn) pauseBtn.style.display = 'none';
        if (startBtn) startBtn.textContent = 'Yeni Oyun';
        
        // Oyun bitti mesajını göster
        const snakeInfoEl = document.getElementById('snake-game-info');
        if (snakeInfoEl) {
            snakeInfoEl.innerHTML = `
                <div class="time-up-message">OYUN BİTTİ!</div>
                <div class="game-results">
                    Skorun: <strong>${score}</strong>
                </div>
            `;
        }
        
        // En yüksek skoru güncelle
        if (score > bestScore) {
            bestScore = score;
            GameState.updateSnakeState(state => ({
                ...state,
                bestScore: bestScore
            }));
        }
    }
    
    // Olay dinleyicilerini ayarla
    function setupEventListeners() {
        // Klavye kontrolleri
        document.addEventListener('keydown', function(e) {
            if (isPaused || isGameOver) return;
            
            switch(e.key) {
                case 'ArrowUp':
                    changeDirection(DIRECTIONS.UP);
                    break;
                case 'ArrowDown':
                    changeDirection(DIRECTIONS.DOWN);
                    break;
                case 'ArrowLeft':
                    changeDirection(DIRECTIONS.LEFT);
                    break;
                case 'ArrowRight':
                    changeDirection(DIRECTIONS.RIGHT);
                    break;
            }
        });
        
        // Başlat/yeniden başlat butonu
        if (startBtn) {
            startBtn.addEventListener('click', startGame);
        }
        
        // Duraklat/devam et butonu
        if (pauseBtn) {
            pauseBtn.addEventListener('click', togglePause);
            pauseBtn.style.display = 'none'; // Başlangıçta gizli
        }
        
        // Yön butonları
        if (upBtn) {
            upBtn.addEventListener('click', () => changeDirection(DIRECTIONS.UP));
        }
        
        if (downBtn) {
            downBtn.addEventListener('click', () => changeDirection(DIRECTIONS.DOWN));
        }
        
        if (leftBtn) {
            leftBtn.addEventListener('click', () => changeDirection(DIRECTIONS.LEFT));
        }
        
        if (rightBtn) {
            rightBtn.addEventListener('click', () => changeDirection(DIRECTIONS.RIGHT));
        }
    }
    
    // Yılan oyununu başlat
    function initSnakeGame() {
        // GameState'den en iyi skoru al
        bestScore = GameState.getSnakeState().highScore || 0;
        if (bestScoreDisplay) bestScoreDisplay.textContent = bestScore;
        
        // Tahta referansını al
        if (snakeBoard) {
            boardElement = snakeBoard;
            
            // Gerçek görünür boyutları ölç
            measureBoardSize();
            
            // Tahtanın kenar çizgisini belirginleştir (görsel yardım)
            snakeBoard.style.border = "2px solid red";
        }
        
        // Cihaz tipini algıla
        isMobile = checkMobile();
        console.log(`Başlangıçta algılanan cihaz: ${isMobile ? 'Mobil' : 'Masaüstü'}`);
        
        // Pencere yeniden boyutlandırıldığında ekran boyutlarını ve cihaz tipini güncelle
        window.addEventListener('resize', function() {
            const wasOnMobile = isMobile;
            isMobile = checkMobile();
            
            // Ekran boyutlarını yeniden ölç
            measureBoardSize();
            
            // Sadece boyut değişimini logla
            console.log(`Pencere yeniden boyutlandırıldı: ${visibleBoardWidth}x${visibleBoardHeight}`);
            
            // Cihaz tipi değiştiyse veya boyut değiştiyse yemek konumunu güncelle
            if (wasOnMobile !== isMobile || true) { // Her zaman güncelle
                console.log(`Boyut/cihaz değişimi algılandı: ${isMobile ? 'Mobil' : 'Masaüstü'}`);
                
                // Oyun devam ediyorsa, yeni bir yemek oluştur
                // Bu, mobil <-> masaüstü geçişlerinde yemin güvenli bölgede olmasını sağlar
                if (!isGameOver && gameInterval) {
                    createFood();
                    updateBoard();
                }
            }
        });
        
        // İlk yükleme sonrası ekran boyutlarını tekrar kontrol et (CSS yüklenmesi sonrası)
        setTimeout(function() {
            measureBoardSize();
            // Oyun çalışıyorsa yemin konumunu güncelle
            if (!isGameOver && gameInterval) {
                createFood();
                updateBoard();
            }
        }, 1000);
        
        // Olay dinleyicilerini ayarla
        setupEventListeners();
    }
    
    return {
        init: initSnakeGame,
        start: startGame
    };
})();

// Sayfa yüklenince hazırla
onPageLoad(function() {
    const snakePage = document.getElementById('snake-page');
    if (snakePage) {
        SnakeGame.init();
    }
});