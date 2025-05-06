/**
 * Tetris Oyunu için JavaScript
 */
const TetrisGame = (function() {
    // Oyun ayarları
    const COLS = 10;
    const ROWS = 20;
    const BLOCK_SIZE = 30;
    const EMPTY = 0;
    
    // Tetris parçaları
    const PIECES = [
        { id: 'i', shape: [[1, 1, 1, 1]], color: 'i' },  // I shape
        { id: 'j', shape: [[1, 0, 0], [1, 1, 1]], color: 'j' },  // J shape
        { id: 'l', shape: [[0, 0, 1], [1, 1, 1]], color: 'l' },  // L shape
        { id: 'o', shape: [[1, 1], [1, 1]], color: 'o' },  // O shape
        { id: 's', shape: [[0, 1, 1], [1, 1, 0]], color: 's' },  // S shape
        { id: 't', shape: [[0, 1, 0], [1, 1, 1]], color: 't' },  // T shape
        { id: 'z', shape: [[1, 1, 0], [0, 1, 1]], color: 'z' }   // Z shape
    ];
    
    // Oyun durumu
    let board = [];
    let currentPiece = null;
    let nextPiece = null;
    let score = 0;
    let level = 1;
    let lines = 0;
    let isGameOver = false;
    let isPaused = false;
    let gameInterval = null;
    let dropSpeed = 1000; // başlangıç hızı (milisaniye)
    
    // DOM elementleri
    const tetrisBoard = document.getElementById('tetris-board');
    const nextPieceDisplay = document.getElementById('tetris-next-piece');
    const scoreDisplay = document.getElementById('tetris-score');
    const levelDisplay = document.getElementById('tetris-level');
    const linesDisplay = document.getElementById('tetris-lines');
    const startBtn = document.getElementById('tetris-start');
    const pauseBtn = document.getElementById('tetris-pause');
    const leftBtn = document.getElementById('tetris-left-btn');
    const rightBtn = document.getElementById('tetris-right-btn');
    const downBtn = document.getElementById('tetris-down-btn');
    const rotateBtn = document.getElementById('tetris-rotate-btn');
    
    // Oyun tahtasını oluştur
    function createBoard() {
        if (!tetrisBoard) return;
        
        // Oyun tahtasını temizle
        tetrisBoard.innerHTML = '';
        
        // Yeni oyun tahtası dizisini oluştur
        board = Array.from({ length: ROWS }, () => Array(COLS).fill(EMPTY));
        
        // Hücreler için DOM elementlerini oluştur
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const cell = document.createElement('div');
                cell.className = 'tetris-cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                tetrisBoard.appendChild(cell);
            }
        }
    }
    
    // Tahtayı güncelle
    function updateBoard() {
        if (!tetrisBoard) return;
        
        // Tüm hücreleri güncelle
        const cells = tetrisBoard.querySelectorAll('.tetris-cell');
        cells.forEach(cell => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            
            // Tüm sınıfları temizle
            cell.className = 'tetris-cell';
            
            // Hücre durumuna göre sınıf ekle
            if (board[row][col] !== EMPTY) {
                cell.classList.add('filled', board[row][col]);
            }
        });
        
        // Mevcut parçayı göster
        if (currentPiece) {
            drawPiece(currentPiece, cells);
        }
    }
    
    // Sonraki parça görüntüsünü güncelle
    function updateNextPiece() {
        if (!nextPieceDisplay || !nextPiece) return;
        
        // Görüntüyü temizle
        nextPieceDisplay.innerHTML = '';
        
        // Parçanın boyutlarını hesapla
        const pieceHeight = nextPiece.shape.length;
        const pieceWidth = nextPiece.shape[0].length;
        
        // Parçayı oluştur
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const cell = document.createElement('div');
                cell.className = 'tetris-cell';
                
                // Merkeze hizala
                const offset_row = Math.floor((4 - pieceHeight) / 2);
                const offset_col = Math.floor((4 - pieceWidth) / 2);
                
                if (row >= offset_row && row < offset_row + pieceHeight && 
                    col >= offset_col && col < offset_col + pieceWidth) {
                    const piece_row = row - offset_row;
                    const piece_col = col - offset_col;
                    
                    if (nextPiece.shape[piece_row][piece_col]) {
                        cell.classList.add('filled', nextPiece.color);
                    }
                }
                
                nextPieceDisplay.appendChild(cell);
            }
        }
    }
    
    // Parçayı ekranda göster
    function drawPiece(piece, cells) {
        const { shape, position, color } = piece;
        
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const boardRow = position.y + row;
                    const boardCol = position.x + col;
                    
                    if (boardRow >= 0 && boardRow < ROWS && boardCol >= 0 && boardCol < COLS) {
                        const cellIndex = boardRow * COLS + boardCol;
                        if (cells[cellIndex]) {
                            cells[cellIndex].classList.add('filled', color);
                        }
                    }
                }
            }
        }
    }
    
    // Rastgele parça oluştur
    function getRandomPiece() {
        const pieceIndex = Math.floor(Math.random() * PIECES.length);
        const piece = PIECES[pieceIndex];
        
        return {
            id: piece.id,
            shape: piece.shape,
            color: piece.color,
            position: { x: Math.floor((COLS - piece.shape[0].length) / 2), y: 0 }
        };
    }
    
    // Parça döndürme
    function rotatePiece(piece) {
        if (!piece) return piece;
        
        // Kare parçalar döndürülmüyor
        if (piece.id === 'o') return piece;
        
        // Parçayı kopyala
        const newPiece = { ...piece };
        
        // Şekli transpoz et (döndür)
        const rows = piece.shape.length;
        const cols = piece.shape[0].length;
        
        // Yeni şekil dizisi oluştur
        const newShape = Array.from({ length: cols }, () => Array(rows).fill(0));
        
        // Transpoz işlemi
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                newShape[col][rows - 1 - row] = piece.shape[row][col];
            }
        }
        
        newPiece.shape = newShape;
        
        // Döndürme sonrası çakışma kontrolu
        if (isCollision(newPiece)) {
            // Çakışma varsa, döndürmeyi iptal et
            return piece;
        }
        
        return newPiece;
    }
    
    // Çakışma kontrolu
    function isCollision(piece) {
        const { shape, position } = piece;
        
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const boardRow = position.y + row;
                    const boardCol = position.x + col;
                    
                    // Tahta dışı kontrolu
                    if (boardCol < 0 || boardCol >= COLS || boardRow >= ROWS) {
                        return true;
                    }
                    
                    // Zaten dolu olan hücre kontrolu
                    if (boardRow >= 0 && board[boardRow][boardCol] !== EMPTY) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }
    
    // Parçayı tahtaya yerleştir
    function placePiece() {
        const { shape, position, color } = currentPiece;
        
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const boardRow = position.y + row;
                    const boardCol = position.x + col;
                    
                    if (boardRow >= 0 && boardRow < ROWS && boardCol >= 0 && boardCol < COLS) {
                        board[boardRow][boardCol] = color;
                    }
                }
            }
        }
    }
    
    // Tamamlanan satırları kontrol et ve temizle
    function clearLines() {
        let linesCleared = 0;
        
        for (let row = ROWS - 1; row >= 0; row--) {
            if (board[row].every(cell => cell !== EMPTY)) {
                // Satırı temizle
                board.splice(row, 1);
                // Başa yeni boş satır ekle
                board.unshift(Array(COLS).fill(EMPTY));
                // Silinecek satırları tekrar kontrol etmek için indeksi artır
                row++;
                linesCleared++;
            }
        }
        
        if (linesCleared > 0) {
            // Skor ve seviye güncelleme
            lines += linesCleared;
            score += calculateScore(linesCleared);
            level = Math.floor(lines / 10) + 1;
            dropSpeed = Math.max(100, 1000 - (level - 1) * 100);
            
            // Görüntüyü güncelle
            updateStats();
            
            // Heyecan verici bir hamleyse özel mesaj
            if (linesCleared >= 4) {
                setTimeout(() => GameState.showLoveMessage(), 500);
            }
        }
    }
    
    // Skoru hesapla
    function calculateScore(linesCleared) {
        const basePoints = [40, 100, 300, 1200]; // 1, 2, 3, 4 satır için puanlar
        return basePoints[linesCleared - 1] * level;
    }
    
    // İstatistikleri güncelle
    function updateStats() {
        if (scoreDisplay) scoreDisplay.textContent = score;
        if (levelDisplay) levelDisplay.textContent = level;
        if (linesDisplay) linesDisplay.textContent = lines;
        
        // GameState'i güncelle
        GameState.updateTetrisState({
            highScore: Math.max(score, GameState.getTetrisState().highScore || 0),
            level
        });
    }
    
    // Parçayı hareket ettir
    function movePiece(dx, dy) {
        if (!currentPiece || isPaused || isGameOver) return;
        
        // Yeni konumu hesapla
        const newPosition = {
            x: currentPiece.position.x + dx,
            y: currentPiece.position.y + dy
        };
        
        // Geçici olarak parçayı taşı
        const prevPosition = { ...currentPiece.position };
        currentPiece.position = newPosition;
        
        // Çakışma kontrolu
        if (isCollision(currentPiece)) {
            // Eğer çakışma varsa, original konuma geri dön
            currentPiece.position = prevPosition;
            
            // Eğer aşağı hareket ederken çakışma varsa, parçayı yerleştir
            if (dy > 0) {
                placePiece();
                clearLines();
                spawnNextPiece();
            }
            
            return false;
        }
        
        // Başarılı hareket
        updateBoard();
        return true;
    }
    
    // Parçayı düşür
    function dropPiece() {
        if (!currentPiece || isPaused || isGameOver) return;
        
        // Mevcut parçayı en aşağıya kadar düşür
        while (movePiece(0, 1)) {}
    }
    
    // Parçayı döndür
    function rotatePieceCW() {
        if (!currentPiece || isPaused || isGameOver) return;
        
        const rotatedPiece = rotatePiece(currentPiece);
        currentPiece = rotatedPiece;
        updateBoard();
    }
    
    // Yeni parça oluştur
    function spawnNextPiece() {
        if (isGameOver) return;
        
        // Sonraki parçayı mevcut parça yap
        if (nextPiece) {
            currentPiece = nextPiece;
        } else {
            currentPiece = getRandomPiece();
        }
        
        // Yeni sonraki parça oluştur
        nextPiece = getRandomPiece();
        updateNextPiece();
        
        // Çakışma varsa oyun bitti
        if (isCollision(currentPiece)) {
            gameOver();
            return;
        }
        
        updateBoard();
    }
    
    // Oyun döngüsü
    function gameLoop() {
        if (isPaused || isGameOver) return;
        
        // Parçayı aşağı hareket ettir
        movePiece(0, 1);
    }
    
    // Oyunu başlat
    function startGame() {
        // Oyun durumunu sıfırla
        score = 0;
        level = 1;
        lines = 0;
        isGameOver = false;
        isPaused = false;
        dropSpeed = 1000;
        
        // Tahtayı oluştur
        createBoard();
        
        // İstatistikleri güncelle
        updateStats();
        
        // İlk parçayı oluştur
        nextPiece = getRandomPiece();
        spawnNextPiece();
        
        // Mevcut interval'i temizle
        if (gameInterval) {
            clearInterval(gameInterval);
        }
        
        // Oyun döngüsünü başlat
        gameInterval = setInterval(gameLoop, dropSpeed);
        
        // Düğme görünürlüklerini güncelle
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
            gameInterval = setInterval(gameLoop, dropSpeed);
            if (pauseBtn) pauseBtn.textContent = 'Duraklat';
        }
    }
    
    // Oyun bitti
    function gameOver() {
        isGameOver = true;
        clearInterval(gameInterval);
        
        // Düğme görünürlüklerini güncelle
        if (pauseBtn) pauseBtn.style.display = 'none';
        if (startBtn) startBtn.textContent = 'Yeni Oyun';
        
        // Oyun bitti mesajını göster
        const tetrisInfoEl = document.getElementById('tetris-game-info');
        if (tetrisInfoEl) {
            tetrisInfoEl.innerHTML = `
                <div class="time-up-message">OYUN BİTTİ!</div>
                <div class="game-results">
                    Skorun: <strong>${score}</strong> | 
                    Çizgi: <strong>${linesCleared}</strong>
                </div>
            `;
        }
    }
    
    // Olay dinleyicilerini ayarla
    function setupEventListeners() {
        // Klavye kontrolleri
        document.addEventListener('keydown', function(e) {
            if (isPaused || isGameOver) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    movePiece(-1, 0);
                    break;
                case 'ArrowRight':
                    movePiece(1, 0);
                    break;
                case 'ArrowDown':
                    movePiece(0, 1);
                    break;
                case 'ArrowUp':
                    rotatePieceCW();
                    break;
                case ' ': // Spacebar
                    dropPiece();
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
        }
        
        // Yön butonları
        if (leftBtn) {
            leftBtn.addEventListener('click', () => movePiece(-1, 0));
        }
        
        if (rightBtn) {
            rightBtn.addEventListener('click', () => movePiece(1, 0));
        }
        
        if (downBtn) {
            downBtn.addEventListener('click', () => movePiece(0, 1));
        }
        
        if (rotateBtn) {
            rotateBtn.addEventListener('click', rotatePieceCW);
        }
    }
    
    // Oyunu başlat
    function initTetrisGame() {
        // Tetris oyun sayfası yüklenince çalış
        createBoard();
        setupEventListeners();
        
        // Yeni oyun başlama butonu görünürlüğünü ayarla
        if (pauseBtn) pauseBtn.style.display = 'none';
    }
    
    return {
        init: initTetrisGame,
        start: startGame
    };
})();

// Sayfa yüklenince hazırla
onPageLoad(function() {
    const tetrisPage = document.getElementById('tetris-page');
    if (tetrisPage) {
        TetrisGame.init();
    }
});