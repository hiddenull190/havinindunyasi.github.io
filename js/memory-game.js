/**
 * Hafıza Oyunu için JavaScript
 */
const MemoryGame = (function() {
    // Zorluk seviyesi tanımları
    const DIFFICULTY = {
        EASY: { id: 'easy', pairs: 6, cols: 3 },
        MEDIUM: { id: 'medium', pairs: 12, cols: 4 },
        HARD: { id: 'hard', pairs: 24, cols: 6 }
    };
    
    // Oyun değişkenleri
    let cards = [];
    let selectedCards = [];
    let matchedPairs = 0;
    let totalPairs = DIFFICULTY.EASY.pairs;
    let moves = 0;
    let isLocked = false;
    let currentDifficulty = DIFFICULTY.EASY;
    
    // DOM elementleri
    const memoryBoard = document.getElementById('memory-board');
    const memoryMatches = document.getElementById('memory-matches');
    const memoryMoves = document.getElementById('memory-moves');
    const memoryStartBtn = document.getElementById('memory-start');
    const difficultyBtns = document.querySelectorAll('.difficulty-btn');
    
    // Kart oluşturma
    function createCard(id, value) {
        // Kart bilgilerini al
        const cardInfo = getCardInfo(value);
        
        // Kart HTML'i oluştur
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.id = id;
        card.dataset.value = value;
        
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <span>?</span>
                </div>
                <div class="card-back" style="color: ${cardInfo.color};">
                    <span>${cardInfo.icon}</span>
                </div>
            </div>
        `;
        
        // Kart tıklama olayını ekle
        card.addEventListener('click', () => handleCardClick(card));
        
        return card;
    }
    
    // Kart tıklama işleme
    function handleCardClick(card) {
        // Kilit kontrolü, seçilen veya eşleşen kartları pas geç
        if (isLocked || selectedCards.includes(card) || card.classList.contains('matched')) {
            return;
        }
        
        // Kartı çevir
        flipCard(card, true);
        
        // Seçilen kart listesine ekle
        selectedCards.push(card);
        
        // İki kart seçildi mi kontrol et
        if (selectedCards.length === 2) {
            // Hamle sayısını artır
            moves++;
            updateStats();
            
            // Kilit koy (hızlı tıklamaları engelle)
            isLocked = true;
            
            // Kartların eşleşip eşleşmediğini kontrol et
            const [card1, card2] = selectedCards;
            const isMatch = card1.dataset.value === card2.dataset.value;
            
            if (isMatch) {
                // Eşleşme var
                handleMatch();
            } else {
                // Eşleşme yok, kartları geri çevir
                setTimeout(() => {
                    flipCard(card1, false);
                    flipCard(card2, false);
                    resetSelectedCards();
                }, 1000);
            }
        }
    }
    
    // Kart eşleşme işleme
    function handleMatch() {
        matchedPairs++;
        
        // Eşleşen kartları işaretle
        selectedCards.forEach(card => {
            card.classList.add('matched');
        });
        
        // Skorları güncelle
        updateStats();
        
        // Eşleştirilen kartları sıfırla
        resetSelectedCards();
        
        // Oyun bitti mi kontrol et
        if (matchedPairs === totalPairs) {
            setTimeout(() => {
                handleGameComplete();
            }, 500);
        }
    }
    
    // Seçilen kartları sıfırla
    function resetSelectedCards() {
        selectedCards = [];
        isLocked = false;
    }
    
    // Kart çevirme
    function flipCard(card, flipped) {
        if (flipped) {
            card.classList.add('flipped');
        } else {
            card.classList.remove('flipped');
        }
    }
    
    // İstatistikleri güncelle
    function updateStats() {
        if (memoryMatches) memoryMatches.textContent = `${matchedPairs}/${totalPairs}`;
        if (memoryMoves) memoryMoves.textContent = moves;
        
        // GameState güncelle
        GameState.updateMemoryState({
            matchedPairs: matchedPairs,
            moves: moves,
            totalPairs: totalPairs
        });
    }
    
    // Oyun tamamlama işleme
    function handleGameComplete() {
        // Tebrik mesajı göster
        GameState.showLoveMessage();
        
        // Yeni oyun başlat
        setTimeout(() => {
            startGame();
        }, 1500);
    }
    
    // Tahtayı oluştur
    function createBoard() {
        if (!memoryBoard) return;
        
        // Tahtayı temizle
        memoryBoard.innerHTML = '';
        memoryBoard.style.gridTemplateColumns = `repeat(${currentDifficulty.cols}, 1fr)`;
        
        // Kartları ekle
        cards.forEach(card => {
            memoryBoard.appendChild(card);
        });
    }
    
    // Kartları karıştır ve oluştur
    function generateCards() {
        cards = [];
        
        // Kart değerleri oluştur (eşleşecek çiftler için aynı değerler)
        const values = [];
        for (let i = 0; i < totalPairs; i++) {
            values.push(i, i); // Her değerden iki tane (çift oluşturmak için)
        }
        
        // Değerleri karıştır
        const shuffledValues = shuffleArray(values);
        
        // Kartları oluştur
        shuffledValues.forEach((value, index) => {
            cards.push(createCard(index, value));
        });
    }
    
    // Oyunu başlat
    function startGame() {
        // Oyun değişkenlerini sıfırla
        matchedPairs = 0;
        moves = 0;
        totalPairs = currentDifficulty.pairs;
        selectedCards = [];
        isLocked = false;
        
        // Kartları oluştur
        generateCards();
        
        // Tahtayı güncelle
        createBoard();
        
        // İstatistikleri güncelle
        updateStats();
    }
    
    // Zorluk seviyesini ayarla
    function setDifficulty(difficultyId) {
        // Zorluk seviyesini güncelle
        switch(difficultyId) {
            case DIFFICULTY.EASY.id:
                currentDifficulty = DIFFICULTY.EASY;
                break;
            case DIFFICULTY.MEDIUM.id:
                currentDifficulty = DIFFICULTY.MEDIUM;
                break;
            case DIFFICULTY.HARD.id:
                currentDifficulty = DIFFICULTY.HARD;
                break;
            default:
                currentDifficulty = DIFFICULTY.EASY;
        }
        
        // Zorluk butonlarını güncelle
        difficultyBtns.forEach(btn => {
            if (btn.dataset.difficulty === difficultyId) {
                btn.classList.add('selected');
            } else {
                btn.classList.remove('selected');
            }
        });
    }
    
    // Olay dinleyicilerini kur
    function setupEventListeners() {
        if (memoryStartBtn) {
            memoryStartBtn.addEventListener('click', startGame);
        }
        
        // Zorluk seviyesi butonları
        difficultyBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const difficulty = this.dataset.difficulty;
                setDifficulty(difficulty);
            });
        });
    }
    
    // Hafıza oyunu sayfası yüklenince çalışacak fonksiyon
    function initMemoryGame() {
        setupEventListeners();
    }
    
    return {
        init: initMemoryGame,
        start: startGame
    };
})();

// Sayfa yüklenince hazırla
onPageLoad(function() {
    const memoryPage = document.getElementById('memory-page');
    if (memoryPage) {
        MemoryGame.init();
    }
});