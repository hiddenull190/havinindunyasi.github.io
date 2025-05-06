/**
 * Refleks Testi Oyunu için JavaScript
 */
const ReactionGame = (function() {
    // Oyun durumları
    const STATUS = {
        IDLE: 'idle',
        WAITING: 'waiting',
        MEASURING: 'measuring',
        RESULT: 'result',
        EARLY: 'early'
    };
    
    // Oyun değişkenleri
    let status = STATUS.IDLE;
    let startTime = 0;
    let currentTime = null;
    let bestTime = null;
    let lastTime = null;
    let timeoutId = null;
    
    // DOM elementleri
    const reactionContainer = document.getElementById('reaction-container');
    const reactionContent = document.getElementById('reaction-content');
    const reactionBestTime = document.getElementById('reaction-best-time');
    const reactionLastTime = document.getElementById('reaction-last-time');
    const reactionStartBtn = document.getElementById('reaction-start');
    
    // HTML şablonları
    const idleTemplate = document.getElementById('reaction-idle').outerHTML;
    
    const waitingTemplate = `
        <div id="reaction-waiting" class="text-center">
            <div class="animate-spin-slow" style="font-size: 2.5rem; margin-bottom: 0.5rem;">⏳</div>
            <p>Bekle...</p>
        </div>
    `;
    
    const targetTemplate = `
        <div id="reaction-target" class="text-center">
            <div class="reaction-target animate-pulse">
                <span class="target-icon">❤️</span>
            </div>
            <p>ŞİMDİ TIKLA!</p>
        </div>
    `;
    
    const earlyTemplate = `
        <div id="reaction-early" class="text-center">
            <div style="font-size: 2.5rem; margin-bottom: 1rem; color: var(--accent);">⚠️</div>
            <p style="font-size: 1.5rem; margin-bottom: 1rem;">Çok erken tıkladın!</p>
        </div>
    `;
    
    // Fonksiyonlar
    
    // Oyunu başlat
    function initGame() {
        // GameState'den verileri al
        const state = GameState.getReactionState();
        bestTime = state.bestTime;
        lastTime = state.lastTime;
        
        // Skorları güncelle
        updateTimeDisplay();
        
        // Başlangıç durumuna geç
        setStatus(STATUS.IDLE);
        
        // Tekrar Dene butonunu sakğla
        const tryAgainBtn = document.getElementById('reaction-try-again');
        if (tryAgainBtn) tryAgainBtn.style.display = 'none';
    }
    
    // Durum güncelleme
    function setStatus(newStatus) {
        status = newStatus;
        updateContent();
    }
    
    // İçerik güncelleme
    function updateContent() {
        if (!reactionContent) return;
        
        // İçeriği güncelle
        switch(status) {
            case STATUS.IDLE:
                reactionContainer.style.backgroundColor = '';
                reactionContent.innerHTML = idleTemplate;
                if (reactionStartBtn) reactionStartBtn.style.display = 'block';
                
                // Tekrar Dene butonunu gizle
                const tryAgainBtnIdle = document.getElementById('reaction-try-again');
                if (tryAgainBtnIdle) tryAgainBtnIdle.style.display = 'none';
                break;
                
            case STATUS.WAITING:
                reactionContainer.style.backgroundColor = 'var(--secondary)';
                reactionContent.innerHTML = waitingTemplate;
                if (reactionStartBtn) reactionStartBtn.style.display = 'none';
                
                // Tekrar Dene butonunu gizle
                const tryAgainBtnWaiting = document.getElementById('reaction-try-again');
                if (tryAgainBtnWaiting) tryAgainBtnWaiting.style.display = 'none';
                break;
                
            case STATUS.MEASURING:
                reactionContainer.style.backgroundColor = 'var(--primary)';
                reactionContent.innerHTML = targetTemplate;
                if (reactionStartBtn) reactionStartBtn.style.display = 'none';
                
                // Tekrar Dene butonunu gizle
                const tryAgainBtnMeasuring = document.getElementById('reaction-try-again');
                if (tryAgainBtnMeasuring) tryAgainBtnMeasuring.style.display = 'none';
                break;
                
            case STATUS.RESULT:
                // Reaksiyon süresine göre arkaplan rengini belirle
                const animalReaction = getAnimalReaction(currentTime);
                reactionContainer.className = `reaction-container ${animalReaction.className}`;
                
                // Sonuç template'i oluştur
                const resultTemplate = `
                    <div id="reaction-result" class="text-center">
                        <p style="font-size: 1.5rem; margin-bottom: 0.5rem;">Süren:</p>
                        <p class="reaction-result-time">${formatTime(currentTime)}</p>
                        <div style="margin-bottom: 1rem;">
                            <p class="animal-name">${animalReaction.name}</p>
                            <p class="animal-message">${animalReaction.message}</p>
                        </div>
                    </div>
                `;
                
                reactionContent.innerHTML = resultTemplate;
                if (reactionStartBtn) reactionStartBtn.style.display = 'none';
                
                // Alt tekrar deneme butonunu göster ve olay dinleyicisi ekle
                const tryAgainBtn = document.getElementById('reaction-try-again');
                if (tryAgainBtn) {
                    tryAgainBtn.style.display = 'block';
                    tryAgainBtn.addEventListener('click', startTest);
                }
                break;
                
            case STATUS.EARLY:
                reactionContainer.style.backgroundColor = 'var(--warning)';
                reactionContent.innerHTML = earlyTemplate;
                if (reactionStartBtn) reactionStartBtn.style.display = 'none';
                
                // Alt tekrar deneme butonunu göster
                const tryAgainBtnEarly = document.getElementById('reaction-try-again');
                if (tryAgainBtnEarly) {
                    tryAgainBtnEarly.style.display = 'block';
                    tryAgainBtnEarly.addEventListener('click', startTest);
                }
                
                // Erken tıklama sonrası dış tekrar deneme butonu kullanılacak
                break;
        }
    }
    
    // Süre görüntüsünü güncelleme
    function updateTimeDisplay() {
        if (reactionBestTime) reactionBestTime.textContent = formatTime(bestTime);
        if (reactionLastTime) reactionLastTime.textContent = formatTime(lastTime);
    }
    
    // Refleks testini başlat
    function startTest() {
        // Mevcut timeout'u temizle
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
        
        // Bekleme durumuna geç
        setStatus(STATUS.WAITING);
        currentTime = null;
        
        // Rastgele bekleme süresi (2-6 saniye)
        const waitTime = 2000 + getRandomInt(0, 4000);
        
        // Bekleme süresinden sonra ölçüm durumuna geç
        timeoutId = setTimeout(() => {
            setStatus(STATUS.MEASURING);
            startTime = Date.now();
        }, waitTime);
    }
    
    // Konteyner tıklama işleme
    function handleContainerClick() {
        if (status === STATUS.WAITING) {
            // Çok erken tıklama
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
            setStatus(STATUS.EARLY);
        } 
        else if (status === STATUS.MEASURING) {
            // Reaksiyon süresini ölç
            const endTime = Date.now();
            currentTime = endTime - startTime;
            
            // Skoru güncelle
            lastTime = currentTime;
            if (bestTime === null || currentTime < bestTime) {
                bestTime = currentTime;
            }
            
            // GameState güncelle
            GameState.updateReactionState({
                bestTime: bestTime,
                lastTime: lastTime
            });
            
            // Görüntü güncelle
            updateTimeDisplay();
            
            // Sonuç ekranına geç
            setStatus(STATUS.RESULT);
            
            // Hızlı reaksiyon gösterirse sevgi mesajı göster
            if (currentTime <= 300 && Math.random() < 0.9) {
                setTimeout(() => GameState.showLoveMessage(), 500);
            } 
            // Orta hızlıysa %40 ihtimalle göster
            else if (currentTime <= 600 && Math.random() < 0.4) {
                setTimeout(() => GameState.showLoveMessage(), 500);
            }
            // Yavaşsa %10 ihtimalle göster
            else if (Math.random() < 0.1) {
                setTimeout(() => GameState.showLoveMessage(), 500);
            }
        }
    }
    
    // Olay dinleyicilerini kurma
    function setupEventListeners() {
        if (reactionContainer) {
            reactionContainer.addEventListener('click', handleContainerClick);
        }
        
        if (reactionStartBtn) {
            reactionStartBtn.addEventListener('click', startTest);
        }
    }
    
    // Refleks oyunu sayfası yüklenince çalış
    function initReactionGame() {
        initGame();
        setupEventListeners();
    }
    
    return {
        init: initReactionGame,
        start: startTest
    };
})();

// Sayfa yüklenince hazırla
onPageLoad(function() {
    const reactionPage = document.getElementById('reaction-page');
    if (reactionPage) {
        ReactionGame.init();
    }
});