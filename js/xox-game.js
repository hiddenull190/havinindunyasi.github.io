/**
 * XOX Oyunu için JavaScript
 */
const XOXGame = (function() {
    // Oyun değişkenleri
    let board;
    let currentPlayer;
    let scores;
    let winningCells = [];
    let isLocked = false;
    
    // DOM elementleri
    const xoxBoard = document.getElementById('xox-board');
    const xoxScoreX = document.getElementById('xox-score-x');
    const xoxScoreO = document.getElementById('xox-score-o');
    const xoxTurn = document.getElementById('xox-turn');
    const xoxReset = document.getElementById('xox-reset');
    
    // Oyunu başlat
    function initGame() {
        // GameState'den veriler yükleniyor
        const state = GameState.getXOXState();
        board = [...state.board];
        currentPlayer = state.currentPlayer;
        scores = { ...state.scores };
        winningCells = [];
        isLocked = false;
        
        // Skor ve sıra bilgilerini güncelle
        updateScoreDisplay();
        updateTurnDisplay();
        
        // XOX tahtasını oluştur
        createBoard();
    }
    
    // XOX tahtasını DOM'a oluştur
    function createBoard() {
        if (!xoxBoard) return;
        
        // Önceki tahta içeriğini temizle
        xoxBoard.innerHTML = '';
        
        // Yeni hücreleri oluştur
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.className = `xox-cell ${board[i] === 'X' ? 'x' : (board[i] === 'O' ? 'o' : '')}`;
            cell.textContent = board[i];
            cell.dataset.index = i;
            
            // Eğer bu hücre kazanan çizgide ise vurgula
            if (winningCells.includes(i)) {
                cell.classList.add('winning');
            }
            
            // Hücre tıklama olayını ekle
            cell.addEventListener('click', () => handleCellClick(i));
            
            // Hücreyi tahtaya ekle
            xoxBoard.appendChild(cell);
        }
    }
    
    // Hücre tıklama işleme
    function handleCellClick(index) {
        // Hücre dolu, oyun kilitli veya kazanan varsa işlem yapma
        if (board[index] || isLocked || winningCells.length > 0 || currentPlayer !== 'X') {
            return;
        }
        
        // Kilit koy (çift tıklama engelleme)
        isLocked = true;
        
        // Oyuncu hamlesini yap
        makeMove(index);
        
        // Kazanan kontrolü
        const winResult = checkXOXWinner(board);
        if (winResult) {
            handleWin(winResult.winner, winResult.line);
            return;
        }
        
        // Beraberlik kontrolü
        if (checkXOXDraw(board)) {
            handleDraw();
            return;
        }
        
        // Oyuncu sırasını bilgisayara geçir
        currentPlayer = 'O';
        updateGameState();
        updateTurnDisplay();
        
        // Bilgisayar hamlesi
        setTimeout(() => {
            makeComputerMove();
            isLocked = false;
        }, 600);
    }
    
    // Hamle yapma (tahta güncelleme)
    function makeMove(index) {
        board[index] = currentPlayer;
        updateGameState();
        createBoard(); // Tahtayı güncelle
    }
    
    // Bilgisayar hamlesi
    function makeComputerMove() {
        // Kazanan varsa hamle yapma
        if (winningCells.length > 0) return;
        
        // Tahtanın kopyasını al
        const newBoard = [...board];
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];
        
        let bestMove = -1;
        
        // 1. Bilgisayar kazanabilir mi?
        for (const line of winPatterns) {
            const [a, b, c] = line;
            
            if (newBoard[a] === "O" && newBoard[b] === "O" && newBoard[c] === "") {
                bestMove = c;
                break;
            } else if (newBoard[a] === "O" && newBoard[c] === "O" && newBoard[b] === "") {
                bestMove = b;
                break;
            } else if (newBoard[b] === "O" && newBoard[c] === "O" && newBoard[a] === "") {
                bestMove = a;
                break;
            }
        }
        
        // 2. Oyuncuyu blokla
        if (bestMove === -1) {
            for (const line of winPatterns) {
                const [a, b, c] = line;
                
                if (newBoard[a] === "X" && newBoard[b] === "X" && newBoard[c] === "") {
                    bestMove = c;
                    break;
                } else if (newBoard[a] === "X" && newBoard[c] === "X" && newBoard[b] === "") {
                    bestMove = b;
                    break;
                } else if (newBoard[b] === "X" && newBoard[c] === "X" && newBoard[a] === "") {
                    bestMove = a;
                    break;
                }
            }
        }
        
        // 3. Orta boşsa orta al
        if (bestMove === -1 && newBoard[4] === "") {
            bestMove = 4;
        }
        
        // 4. Rastgele boş hücre
        if (bestMove === -1) {
            const emptyCells = newBoard.map((cell, i) => cell === "" ? i : -1).filter(i => i !== -1);
            
            if (emptyCells.length > 0) {
                const randomIndex = Math.floor(Math.random() * emptyCells.length);
                bestMove = emptyCells[randomIndex];
            }
        }
        
        // Bilgisayar hamlesini yap
        if (bestMove !== -1) {
            board[bestMove] = "O";
            currentPlayer = "X";
            updateGameState();
            createBoard();
            updateTurnDisplay();
            
            // Kazanan kontrolü
            const winResult = checkXOXWinner(board);
            if (winResult) {
                handleWin(winResult.winner, winResult.line);
                return;
            }
            
            // Beraberlik kontrolü
            if (checkXOXDraw(board)) {
                handleDraw();
                return;
            }
        }
    }
    
    // Kazanma durumunu işle
    function handleWin(winner, line) {
        winningCells = [...line];
        updateScores(winner);
        createBoard(); // Kazananları vurgulamak için
        
        // Oyuncu kazandıysa aşk mesajı göster
        if (winner === 'X') {
            setTimeout(() => {
                GameState.showLoveMessage();
            }, 500);
        }
        
        // Kısa bir süre sonra oyunu sıfırla
        setTimeout(() => {
            resetBoard();
        }, 1800);
    }
    
    // Beraberlik durumunu işle
    function handleDraw() {
        setTimeout(() => {
            resetBoard();
        }, 1000);
    }
    
    // Skor güncelleme
    function updateScores(winner) {
        scores[winner]++;
        updateGameState();
        updateScoreDisplay();
    }
    
    // Skor görüntüsünü güncelle
    function updateScoreDisplay() {
        if (xoxScoreX) xoxScoreX.textContent = scores.X;
        if (xoxScoreO) xoxScoreO.textContent = scores.O;
    }
    
    // Sıra görüntüsünü güncelle
    function updateTurnDisplay() {
        if (xoxTurn) {
            xoxTurn.textContent = currentPlayer;
            xoxTurn.className = currentPlayer === 'X' ? 'x-color' : 'o-color';
        }
    }
    
    // Oyun durumunu güncelle
    function updateGameState() {
        GameState.updateXOXState({
            board: board,
            currentPlayer: currentPlayer,
            scores: scores
        });
    }
    
    // Sadece tahta sıfırlama (skorlar korunur)
    function resetBoard() {
        board = Array(9).fill("");
        currentPlayer = "X";
        winningCells = [];
        isLocked = false;
        updateGameState();
        updateTurnDisplay();
        createBoard();
    }
    
    // Tüm oyunu sıfırlama
    function resetGame() {
        board = Array(9).fill("");
        currentPlayer = "X";
        scores = { X: 0, O: 0 };
        winningCells = [];
        isLocked = false;
        updateGameState();
        updateScoreDisplay();
        updateTurnDisplay();
        createBoard();
    }
    
    // Olay dinleyicilerini ekle
    function setupEventListeners() {
        if (xoxReset) {
            xoxReset.addEventListener('click', resetGame);
        }
    }
    
    // XOX sayfası yüklenince çalışacak fonksiyon
    function initXOXGame() {
        initGame();
        setupEventListeners();
        createBoard();
    }
    
    return {
        init: initXOXGame,
        resetBoard,
        resetGame
    };
})();

// Sayfa yüklenince hazırla
onPageLoad(function() {
    const xoxPage = document.getElementById('xox-page');
    if (xoxPage) {
        XOXGame.init();
    }
});