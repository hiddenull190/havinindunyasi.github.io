/**
 * 2048 Oyunu için JavaScript
 */
const Game2048 = (function() {
    // Oyun durumu
    let board = [];
    let score = 0;
    let bestScore = 0;
    let gameOver = false;
    let won = false;
    let size = 5; // 5x5 oyun tahtası (daha kolay olması için)
    
    // DOM elementleri
    const gameBoard = document.getElementById('game-2048-board');
    const scoreElement = document.getElementById('game-2048-score');
    const bestScoreElement = document.getElementById('game-2048-best-score');
    const startBtn = document.getElementById('game-2048-start');
    const statusElement = document.getElementById('game-2048-status');
    
    // Renk paleti
    const tileColors = {
        2: { bg: '#eee4da', text: '#776e65' },
        4: { bg: '#ede0c8', text: '#776e65' },
        8: { bg: '#f2b179', text: '#f9f6f2' },
        16: { bg: '#f59563', text: '#f9f6f2' },
        32: { bg: '#f67c5f', text: '#f9f6f2' },
        64: { bg: '#f65e3b', text: '#f9f6f2' },
        128: { bg: '#edcf72', text: '#f9f6f2' },
        256: { bg: '#edcc61', text: '#f9f6f2' },
        512: { bg: '#edc850', text: '#f9f6f2' },
        1024: { bg: '#edc53f', text: '#f9f6f2' },
        2048: { bg: '#edc22e', text: '#f9f6f2' },
        4096: { bg: '#ed702e', text: '#f9f6f2' },
        8192: { bg: '#ed4c2e', text: '#f9f6f2' },
        16384: { bg: '#ed303e', text: '#f9f6f2' },
        default: { bg: '#3c3a32', text: '#f9f6f2' }
    };
    
    // Oyun tahtasını başlat
    function initBoard() {
        board = [];
        for (let i = 0; i < size; i++) {
            board.push(Array(size).fill(0));
        }
        score = 0;
        gameOver = false;
        won = false;
        
        // Yerel depolamadan en iyi skoru al
        const state = GameState.get2048State();
        bestScore = state.bestScore || 0;
        
        // İlk iki kareyi ekle
        addRandomTile();
        addRandomTile();
        
        updateDisplay();
    }
    
    // Rastgele bir kare ekle
    function addRandomTile() {
        const emptyCells = [];
        
        // Boş hücreleri bul
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (board[i][j] === 0) {
                    emptyCells.push({ row: i, col: j });
                }
            }
        }
        
        // Boş hücre yoksa çık
        if (emptyCells.length === 0) return;
        
        // Rastgele bir boş hücre seç
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        
        // %90 ihtimalle 2, %10 ihtimalle 4 ekle
        board[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
    }
    
    // Oyun tahtasını ekranda güncelle
    function updateDisplay() {
        if (!gameBoard) return;
        
        // Skoru güncelle
        if (scoreElement) scoreElement.textContent = score;
        if (bestScoreElement) bestScoreElement.textContent = bestScore;
        
        // Tahtayı temizle
        gameBoard.innerHTML = '';
        
        // Her hücre için
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const value = board[i][j];
                const cell = document.createElement('div');
                cell.className = 'game-2048-tile';
                
                if (value !== 0) {
                    // Kare değerine göre renk ve stil ayarla
                    const colorInfo = tileColors[value] || tileColors.default;
                    cell.textContent = value;
                    cell.style.backgroundColor = colorInfo.bg;
                    cell.style.color = colorInfo.text;
                    
                    // Büyük sayılar için font boyutunu küçült
                    if (value > 999) cell.style.fontSize = '1.2rem';
                    if (value > 9999) cell.style.fontSize = '1rem';
                }
                
                gameBoard.appendChild(cell);
            }
        }
        
        // Oyun durumunu güncelle
        if (statusElement) {
            if (won) {
                statusElement.textContent = '2048 oluşturdun! Tebrikler!';
                statusElement.className = 'game-status win';
            } else if (gameOver) {
                statusElement.textContent = 'Oyun bitti! Yeniden başlat.';
                statusElement.className = 'game-status lose';
            } else {
                statusElement.textContent = 'Kareleri birleştir ve 2048\'e ulaş!';
                statusElement.className = 'game-status';
            }
        }
    }
    
    // Hamle yapma - sol
    function moveLeft() {
        let changed = false;
        
        for (let i = 0; i < size; i++) {
            // Sıfır olmayan değerleri al
            const row = board[i].filter(value => value !== 0);
            
            // Bitişik aynı değerleri birleştir
            for (let j = 0; j < row.length - 1; j++) {
                if (row[j] === row[j + 1]) {
                    row[j] *= 2;
                    score += row[j];
                    row.splice(j + 1, 1);
                    changed = true;
                    
                    // 2048'i oluşturunca kazandın
                    if (row[j] === 2048 && !won) {
                        won = true;
                        setTimeout(() => GameState.showLoveMessage(), 1000);
                    }
                }
            }
            
            // Kalan boşlukları doldur
            while (row.length < size) {
                row.push(0);
            }
            
            // Tahtayı güncelle
            if (JSON.stringify(board[i]) !== JSON.stringify(row)) {
                board[i] = row;
                changed = true;
            }
        }
        
        return changed;
    }
    
    // Hamle yapma - sağ
    function moveRight() {
        // Tahtayı ters çevir
        for (let i = 0; i < size; i++) {
            board[i].reverse();
        }
        
        // Sol hamle yap
        const changed = moveLeft();
        
        // Tahtayı tekrar ters çevir
        for (let i = 0; i < size; i++) {
            board[i].reverse();
        }
        
        return changed;
    }
    
    // Hamle yapma - yukarı
    function moveUp() {
        // Tahtayı döndür
        board = transposeBoard(board);
        
        // Sol hamle yap
        const changed = moveLeft();
        
        // Tahtayı geri döndür
        board = transposeBoard(board);
        
        return changed;
    }
    
    // Hamle yapma - aşağı
    function moveDown() {
        // Tahtayı döndür
        board = transposeBoard(board);
        
        // Sağ hamle yap
        const changed = moveRight();
        
        // Tahtayı geri döndür
        board = transposeBoard(board);
        
        return changed;
    }
    
    // Tahtayı transpoz et (satırları sütunlara, sütunları satırlara çevir)
    function transposeBoard(board) {
        const newBoard = [];
        
        for (let i = 0; i < size; i++) {
            newBoard.push([]);
            for (let j = 0; j < size; j++) {
                newBoard[i].push(board[j][i]);
            }
        }
        
        return newBoard;
    }
    
    // Hamle var mı kontrolü
    function hasAvailableMoves() {
        // Boş hücre varsa hamle vardır
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (board[i][j] === 0) return true;
            }
        }
        
        // Yatay birleştirme kontrolü
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size - 1; j++) {
                if (board[i][j] === board[i][j + 1]) return true;
            }
        }
        
        // Dikey birleştirme kontrolü
        for (let i = 0; i < size - 1; i++) {
            for (let j = 0; j < size; j++) {
                if (board[i][j] === board[i + 1][j]) return true;
            }
        }
        
        // Hamle yok
        return false;
    }
    
    // Oyunu sıfırla ve başlat
    function startGame() {
        initBoard();
        updateDisplay();
    }
    
    // Hamle işleme
    function handleMove(direction) {
        if (gameOver || won) return;
        
        let moved = false;
        
        switch(direction) {
            case 'left':
                moved = moveLeft();
                break;
            case 'right':
                moved = moveRight();
                break;
            case 'up':
                moved = moveUp();
                break;
            case 'down':
                moved = moveDown();
                break;
        }
        
        if (moved) {
            // Yeni kare ekle
            addRandomTile();
            
            // En iyi skoru güncelle
            if (score > bestScore) {
                bestScore = score;
                GameState.update2048State({ bestScore: bestScore });
            }
            
            // Oyun bitti mi kontrolü
            if (!hasAvailableMoves()) {
                gameOver = true;
            }
            
            // Ekranı güncelle
            updateDisplay();
        }
    }
    
    // Klavye ile hamle yapma
    function handleKeyDown(e) {
        if (gameOver) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                handleMove('left');
                e.preventDefault();
                break;
            case 'ArrowRight':
                handleMove('right');
                e.preventDefault();
                break;
            case 'ArrowUp':
                handleMove('up');
                e.preventDefault();
                break;
            case 'ArrowDown':
                handleMove('down');
                e.preventDefault();
                break;
        }
    }
    
    // Dokunmatik hareketler için değişkenler
    let startX, startY, endX, endY;
    const minSwipeDistance = 30; // Minimum kaydırma mesafesi
    
    // Dokunmatik hamle başlatma
    function handleTouchStart(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }
    
    // Dokunmatik hamle sonu
    function handleTouchEnd(e) {
        if (!startX || !startY) return;
        
        endX = e.changedTouches[0].clientX;
        endY = e.changedTouches[0].clientY;
        
        const diffX = endX - startX;
        const diffY = endY - startY;
        
        // Mesafe yeterince büyükse hamle yap
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
            // Yatay hamle
            if (diffX > 0) {
                handleMove('right');
            } else {
                handleMove('left');
            }
        } else if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > minSwipeDistance) {
            // Dikey hamle
            if (diffY > 0) {
                handleMove('down');
            } else {
                handleMove('up');
            }
        }
        
        startX = null;
        startY = null;
    }
    
    // Oyun kontrol butonları
    function setupControlButtons() {
        const upBtn = document.getElementById('game-2048-up');
        const downBtn = document.getElementById('game-2048-down');
        const leftBtn = document.getElementById('game-2048-left');
        const rightBtn = document.getElementById('game-2048-right');
        
        if (upBtn) upBtn.addEventListener('click', () => handleMove('up'));
        if (downBtn) downBtn.addEventListener('click', () => handleMove('down'));
        if (leftBtn) leftBtn.addEventListener('click', () => handleMove('left'));
        if (rightBtn) rightBtn.addEventListener('click', () => handleMove('right'));
    }
    
    // Olay dinleyicilerini ayarla
    function setupEventListeners() {
        // Klavye dinleyicisi
        document.addEventListener('keydown', handleKeyDown);
        
        // Dokunmatik dinleyicileri
        if (gameBoard) {
            gameBoard.addEventListener('touchstart', handleTouchStart, false);
            gameBoard.addEventListener('touchend', handleTouchEnd, false);
        }
        
        // Başlat butonu
        if (startBtn) {
            startBtn.addEventListener('click', startGame);
        }
        
        // Kontrol butonları
        setupControlButtons();
    }
    
    // Oyunu başlat
    function init2048Game() {
        startGame();
        setupEventListeners();
    }
    
    return {
        init: init2048Game,
        restart: startGame
    };
})();

// Sayfa yüklenince hazırla
onPageLoad(function() {
    const game2048Page = document.getElementById('game-2048-page');
    if (game2048Page) {
        Game2048.init();
    }
});