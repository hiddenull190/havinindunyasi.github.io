/**
 * Havin'in Farkları Bul Oyunu için JavaScript
 */

(function() {
    // DOM Elemanları
    let diffGrid = null;
    let diffScore = null;
    let diffTime = null;
    let diffLevel = null;
    let diffMessage = null;
    let diffStartBtn = null;
    let diffDifficultyBtns = null;
    
    // Oyun Durumu
    let timer = null;
    let timeLeft = 60;
    let score = 0;
    let level = 1;
    let isPlaying = false;
    
    // Kayıtlı zorluk seviyesini kontrol et, yoksa varsayılan 'easy' olsun
    let currentDifficulty = localStorage.getItem('findDiffDifficulty') || 'easy';
    
    // Verileri tutacak değişkenler
    let currentCharacter = null;
    let differentCharacter = null;
    
    // Izgara boyutları
    let rows = 6; // Başlangıç satır sayısı (kolay mod)
    let cols = 4; // Başlangıç sütun sayısı (kolay mod)
    
    // Karakter Setleri
    const characterSets = {
        numbers: [
            { main: '8', different: 'B', similarity: 'high' },
            { main: '0', different: 'O', similarity: 'high' },
            { main: '5', different: 'S', similarity: 'medium' },
            { main: '1', different: 'I', similarity: 'high' },
            { main: '3', different: '8', similarity: 'medium' },
            { main: '6', different: '9', similarity: 'medium' },
            { main: '2', different: 'Z', similarity: 'medium' },
            { main: '7', different: '1', similarity: 'low' },
            { main: '4', different: 'A', similarity: 'medium' },
            { main: '6', different: 'G', similarity: 'medium' },
            { main: '9', different: 'g', similarity: 'high' },
            { main: '3', different: 'E', similarity: 'medium' }
        ],
        letters: [
            { main: 'O', different: '0', similarity: 'high' },
            { main: 'I', different: '1', similarity: 'high' }, // l yerine 1 yapıldı
            { main: 'S', different: '5', similarity: 'medium' },
            { main: 'Z', different: '2', similarity: 'medium' },
            { main: 'B', different: '8', similarity: 'medium' },
            { main: 'G', different: 'C', similarity: 'medium' },
            { main: 'D', different: 'O', similarity: 'medium' },
            { main: 'Q', different: 'O', similarity: 'medium' },
            { main: 'M', different: 'N', similarity: 'medium' },
            { main: 'W', different: 'V', similarity: 'medium' },
            { main: 'P', different: 'R', similarity: 'medium' },
            { main: 'X', different: 'K', similarity: 'medium' },
            { main: 'H', different: 'N', similarity: 'medium' },
            { main: 'F', different: 'E', similarity: 'medium' },
            { main: 'Y', different: 'V', similarity: 'medium' }
        ],
        emojis: [
            { main: '😊', different: '🙂', similarity: 'high' },
            { main: '😍', different: '🥰', similarity: 'high' },
            { main: '😘', different: '😗', similarity: 'high' },
            { main: '😮', different: '😯', similarity: 'high' },
            { main: '😐', different: '😑', similarity: 'high' },
            { main: '🙄', different: '😒', similarity: 'medium' },
            { main: '😕', different: '🙁', similarity: 'medium' },
            { main: '🤔', different: '🤨', similarity: 'medium' },
            { main: '😳', different: '😮', similarity: 'medium' },
            { main: '❤️', different: '💗', similarity: 'medium' },
            { main: '👍', different: '👌', similarity: 'medium' },
            { main: '🌟', different: '⭐', similarity: 'high' },
            { main: '🎉', different: '🎊', similarity: 'high' },
            { main: '🔥', different: '💥', similarity: 'medium' },
            { main: '🌸', different: '🌺', similarity: 'high' }
        ]
    };
    
    /**
     * Oyunu başlatan fonksiyon
     */
    function startGame() {
        updateDifficultySettings();
        resetGame();
        generateGrid();
        startTimer();
        isPlaying = true;
        
        diffStartBtn.textContent = "Yeniden Başla";
        showMessage("Farklı olan karakteri bul!");
    }
    
    /**
     * Zorluk seviyesine göre ayarları günceller
     */
    function updateDifficultySettings() {
        diffDifficultyBtns.forEach(btn => {
            btn.classList.remove('selected');
            if (btn.dataset.difficulty === currentDifficulty) {
                btn.classList.add('selected');
            }
        });
        
        switch (currentDifficulty) {
            case 'easy':
                rows = 6; // Kolay: 6 satır
                cols = 4; // Kolay: 4 sütun
                timeLeft = 60;
                break;
            case 'medium':
                rows = 7; // Orta: 7 satır
                cols = 5; // Orta: 5 sütun
                timeLeft = 45;
                break;
            case 'hard':
                rows = 8; // Zor: 8 satır
                cols = 6; // Zor: 6 sütun
                timeLeft = 30;
                break;
        }
        
        diffTime.textContent = timeLeft + 's';
        diffGrid.className = `find-diff-grid ${currentDifficulty}`;
    }
    
    /**
     * Oyunu sıfırlar
     */
    function resetGame() {
        clearInterval(timer);
        score = 0;
        level = 1;
        timeLeft = currentDifficulty === 'easy' ? 60 : (currentDifficulty === 'medium' ? 45 : 30);
        
        diffScore.textContent = score;
        diffLevel.textContent = level;
        diffTime.textContent = timeLeft + 's';
    }
    
    /**
     * Zamanlayıcıyı başlatır
     */
    function startTimer() {
        clearInterval(timer);
        timer = setInterval(() => {
            timeLeft--;
            diffTime.textContent = timeLeft + 's';
            
            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
    }
    
    /**
     * Oyunu bitirir
     */
    function endGame() {
        clearInterval(timer);
        isPlaying = false;
        diffStartBtn.textContent = "Oyunu Başlat";
        
        // Oyun sonucu mesajı
        const resultMessage = `
            <div class="finish-message">SÜRE BİTTİ!</div>
            <div class="result-stats">
                Puanın: <strong>${score}</strong><br>
                Ulaştığın seviye: <strong>${level}</strong>
            </div>
        `;
        showMessage(resultMessage);
        
        // Izgara üzerinde görsel efekt
        const items = diffGrid.querySelectorAll('.find-diff-item');
        items.forEach(item => {
            if (item.textContent === differentCharacter) {
                item.classList.add('highlight');
                setTimeout(() => {
                    item.classList.remove('highlight');
                    item.classList.add('correct');
                }, 500);
            }
        });
        
        // Oyun durumunu güncelle
        updateGameState();
    }
    
    /**
     * Görüntülenecek mesajı ayarlar
     */
    function showMessage(message) {
        diffMessage.innerHTML = message;
    }
    
    /**
     * Izgarayı oluşturur
     */
    function generateGrid() {
        // Önce ızgarayı temizle
        diffGrid.innerHTML = '';
        
        // Rastgele bir karakter seti seç
        const characterTypes = ['numbers', 'letters', 'emojis'];
        const randomType = characterTypes[Math.floor(Math.random() * characterTypes.length)];
        const characterSet = characterSets[randomType];
        
        // Uygun zorluk seviyesine göre karakterleri filtrele
        let filteredCharacters;
        if (level <= 3) {
            filteredCharacters = characterSet.filter(char => char.similarity === 'low' || char.similarity === 'medium');
        } else if (level <= 6) {
            filteredCharacters = characterSet.filter(char => char.similarity === 'medium');
        } else {
            filteredCharacters = characterSet.filter(char => char.similarity === 'high');
        }
        
        // Eğer filtreleme sonucu yeterli karakter yoksa, tüm seti kullan
        if (filteredCharacters.length < 2) {
            filteredCharacters = characterSet;
        }
        
        // Rastgele bir karakter çifti seç
        const randomCharPair = filteredCharacters[Math.floor(Math.random() * filteredCharacters.length)];
        currentCharacter = randomCharPair.main;
        differentCharacter = randomCharPair.different;
        
        // Izgaranın toplam hücre sayısı
        const totalCells = rows * cols;
        
        // Farklı karakterin pozisyonunu rastgele belirle
        const differentPosition = Math.floor(Math.random() * totalCells);
        
        // Izgarayı oluştur
        for (let i = 0; i < totalCells; i++) {
            const item = document.createElement('div');
            item.className = 'find-diff-item';
            item.textContent = i === differentPosition ? differentCharacter : currentCharacter;
            item.dataset.position = i;
            
            item.addEventListener('click', handleItemClick);
            
            diffGrid.appendChild(item);
        }
    }
    
    /**
     * Izgaradaki bir öğeye tıklandığında çalışır
     */
    function handleItemClick(event) {
        if (!isPlaying) return;
        
        const clickedItem = event.target;
        const isCorrect = clickedItem.textContent === differentCharacter;
        
        if (isCorrect) {
            // Doğru cevap
            clickedItem.classList.add('correct');
            score += level;
            diffScore.textContent = score;
            
            // Yeni seviye
            setTimeout(() => {
                level++;
                diffLevel.textContent = level;
                
                // Belirli seviyelerde zorluk arttır
                if (level % 5 === 0) {
                    timeLeft += 10; // Bonus süre
                    diffTime.textContent = timeLeft + 's';
                    showMessage(`Tebrikler! ${level}. seviyeye ulaştın. +10 saniye bonus kazandın!`);
                } else {
                    showMessage("Doğru! Devam et!");
                }
                
                generateGrid();
            }, 500);
        } else {
            // Yanlış cevap
            clickedItem.classList.add('wrong');
            
            // 1 saniye sonra sınıfı kaldır
            setTimeout(() => {
                clickedItem.classList.remove('wrong');
            }, 1000);
            
            // Ceza olarak 3 saniye azalt (0'ın altına düşemez)
            timeLeft = Math.max(0, timeLeft - 3);
            diffTime.textContent = timeLeft + 's';
            
            if (timeLeft <= 0) {
                endGame();
            } else {
                showMessage("Yanlış! Tekrar dene! -3 saniye");
            }
        }
    }
    
    /**
     * Oyun durumunu güncelleyen fonksiyon
     */
    function updateGameState() {
        const gameState = {
            score: score,
            level: level
        };
        
        // game-state.js içindeki fonksiyonu çağır
        updateFindDiffState(gameState);
    }
    
    /**
     * Olay dinleyicilerini ayarlar
     */
    function setupEventListeners() {
        // Oyunu başlatma butonu
        diffStartBtn.addEventListener('click', () => {
            startGame();
        });
        
        // Zorluk seviyesi butonları
        diffDifficultyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (isPlaying) return; // Oyun sırasında zorluk değiştirilemez
                
                currentDifficulty = btn.dataset.difficulty;
                updateDifficultySettings();
                
                // Zorluğu değiştirdikten sonra hemen bir ızgara göster
                if (!isPlaying) {
                    // Eğer oyun henüz başlamamışsa, örnek bir ızgara göster
                    generateGrid();
                }
                
                // Zorluğu localStorage'a kaydet
                localStorage.setItem('findDiffDifficulty', currentDifficulty);
            });
        });
    }
    
    /**
     * DOM elemanlarını başlatır
     */
    function initElements() {
        diffGrid = document.getElementById('find-diff-grid');
        diffScore = document.getElementById('find-diff-score');
        diffTime = document.getElementById('find-diff-time');
        diffLevel = document.getElementById('find-diff-level');
        diffMessage = document.getElementById('find-diff-message');
        diffStartBtn = document.getElementById('find-diff-start');
        diffDifficultyBtns = document.querySelectorAll('#find-diff-difficulty .difficulty-btn');
    }
    
    /**
     * Oyun sayfası açıldığında çalışır
     */
    function initFindDiffGame() {
        // DOM elemanlarını başlat
        initElements();
        
        // Kaydedilmiş zorluk seviyesini kontrol et
        const savedDifficulty = localStorage.getItem('findDiffDifficulty');
        if (savedDifficulty) {
            currentDifficulty = savedDifficulty;
            
            // Doğru zorluk düğmesini seç
            diffDifficultyBtns.forEach(btn => {
                btn.classList.remove('selected');
                if (btn.dataset.difficulty === currentDifficulty) {
                    btn.classList.add('selected');
                }
            });
        }
        
        // Olay dinleyicilerini ayarla
        setupEventListeners();
        
        // Zorluk ayarlarını uygula
        updateDifficultySettings();
        
        // Başlangıçta bir ızgara göster (oyun başlamadan önce)
        generateGrid();
    }
    
    // Sayfa yüklendiğinde oyunu başlat
    onPageLoad(() => {
        const page = document.getElementById('find-diff-page');
        if (!page) return;
        
        // Oyun sayfası görünür olduğunda başlat
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class' && page.classList.contains('active')) {
                    initFindDiffGame();
                }
            });
        });
        
        observer.observe(page, { attributes: true });
        
        // Geri butonuna tıklandığında temizleme işlemleri
        const backBtn = page.querySelector('.back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                clearInterval(timer);
                isPlaying = false;
                updateGameState();
            });
        }
    });
})();