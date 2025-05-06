/**
 * Ana uygulama JavaScript dosyası
 */
const App = (function() {
    // Yükleme ekranı
    const loadingScreen = document.getElementById('loading-screen');
    const appContainer = document.getElementById('app');
    
    // Sayfalar
    const pages = {
        welcome: document.getElementById('welcome-page'),
        xox: document.getElementById('xox-page'),
        memory: document.getElementById('memory-page'),
        reaction: document.getElementById('reaction-page'),
        'game-2048': document.getElementById('game-2048-page'),
        tetris: document.getElementById('tetris-page'),
        snake: document.getElementById('snake-page'),
        // Yeni eklenen oyunlar
        hangman: document.getElementById('hangman-page'),
        bubble: document.getElementById('bubble-page'),
        'color-match': document.getElementById('color-match-page'),
        'click-race': document.getElementById('click-race-page'),
        'love-letters': document.getElementById('love-letters-page'),
        'find-diff': document.getElementById('find-diff-page'),
        'love-meter': document.getElementById('love-meter-page'),
        'bulb-breaker': document.getElementById('bulb-breaker-page')
    };
    
    // Şu anki aktif sayfa
    let activePage = 'welcome';
    
    // Yükleme ekranını göster/gizle
    function toggleLoadingScreen(show, delay = 0) {
        setTimeout(() => {
            if (show) {
                if (loadingScreen) {
                    loadingScreen.style.display = 'flex';
                }
                if (appContainer) {
                    appContainer.style.display = 'none';
                }
            } else {
                if (loadingScreen) {
                    loadingScreen.style.display = 'none';
                }
                if (appContainer) {
                    appContainer.style.display = 'block';
                }
            }
        }, delay);
    }
    
    // Sayfa gösterme/gizleme
    function showPage(pageId) {
        // Önce yükleme ekranını göster
        toggleLoadingScreen(true);
        
        setTimeout(() => {
            // Tüm sayfaları gizle
            Object.values(pages).forEach(page => {
                if (page) page.classList.remove('active');
            });
            
            // Belirtilen sayfayı göster
            if (pages[pageId]) {
                pages[pageId].classList.add('active');
                activePage = pageId;
            }
            
            // Yükleme ekranını gizle
            toggleLoadingScreen(false);
        }, 1500); // Oyuna geçiş için 1.5 saniye bekleme
    }
    
    // Uygulama başlatma
    function initApp() {
        // İlk yükleme ekranını göster ve 7 saniye sonra uygulamayı başlat
        toggleLoadingScreen(true);
        
        setTimeout(() => {
            toggleLoadingScreen(false);
            setupEventListeners();
            animateGameCards();
        }, 7000); // 7 saniye bekleyip ana sayfayı göster
    }
    
    // Oyun kartlarının sırayla görünmesini sağlama
    function animateGameCards() {
        // Yeni oyun kartlarını sırayla görünür yap ve animasyonu başlat
        setTimeout(() => {
            const hangmanCard = document.querySelector('.game-card[data-game="hangman"]');
            if (hangmanCard) {
                hangmanCard.style.opacity = 1;
                hangmanCard.style.visibility = 'visible';
                // Animasyonu yeniden başlatmak için sınıfları tekrar ekleyelim
                hangmanCard.classList.remove('animate__bounceIn');
                void hangmanCard.offsetWidth; // Reflow - animasyonu sıfırla
                hangmanCard.classList.add('animate__bounceIn');
            }
        }, 6000);
        
        setTimeout(() => {
            const bubbleCard = document.querySelector('.game-card[data-game="bubble"]');
            if (bubbleCard) {
                bubbleCard.style.opacity = 1;
                bubbleCard.style.visibility = 'visible';
                // Animasyonu yeniden başlatmak için sınıfları tekrar ekleyelim
                bubbleCard.classList.remove('animate__bounceIn');
                void bubbleCard.offsetWidth; // Reflow - animasyonu sıfırla
                bubbleCard.classList.add('animate__bounceIn');
            }
        }, 7000);
        
        setTimeout(() => {
            const colorMatchCard = document.querySelector('.game-card[data-game="color-match"]');
            if (colorMatchCard) {
                colorMatchCard.style.opacity = 1;
                colorMatchCard.style.visibility = 'visible';
                // Animasyonu yeniden başlatmak için sınıfları tekrar ekleyelim
                colorMatchCard.classList.remove('animate__bounceIn');
                void colorMatchCard.offsetWidth; // Reflow - animasyonu sıfırla
                colorMatchCard.classList.add('animate__bounceIn');
            }
        }, 8000);
        
        setTimeout(() => {
            const clickRaceCard = document.querySelector('.game-card[data-game="click-race"]');
            if (clickRaceCard) {
                clickRaceCard.style.opacity = 1;
                clickRaceCard.style.visibility = 'visible';
                // Animasyonu yeniden başlatmak için sınıfları tekrar ekleyelim
                clickRaceCard.classList.remove('animate__bounceIn');
                void clickRaceCard.offsetWidth; // Reflow - animasyonu sıfırla
                clickRaceCard.classList.add('animate__bounceIn');
            }
        }, 9000);
        
        setTimeout(() => {
            const loveLettersCard = document.querySelector('.game-card[data-game="love-letters"]');
            if (loveLettersCard) {
                loveLettersCard.style.opacity = 1;
                loveLettersCard.style.visibility = 'visible';
                // Animasyonu yeniden başlatmak için sınıfları tekrar ekleyelim
                loveLettersCard.classList.remove('animate__bounceIn');
                void loveLettersCard.offsetWidth; // Reflow - animasyonu sıfırla
                loveLettersCard.classList.add('animate__bounceIn');
            }
        }, 10000);
        
        setTimeout(() => {
            const findDiffCard = document.querySelector('.game-card[data-game="find-diff"]');
            if (findDiffCard) {
                findDiffCard.style.opacity = 1;
                findDiffCard.style.visibility = 'visible';
                // Animasyonu yeniden başlatmak için sınıfları tekrar ekleyelim
                findDiffCard.classList.remove('animate__bounceIn');
                void findDiffCard.offsetWidth; // Reflow - animasyonu sıfırla
                findDiffCard.classList.add('animate__bounceIn');
            }
        }, 11000);
        
        setTimeout(() => {
            const loveMeterCard = document.querySelector('.game-card[data-game="love-meter"]');
            if (loveMeterCard) {
                loveMeterCard.style.opacity = 1;
                loveMeterCard.style.visibility = 'visible';
                // Animasyonu yeniden başlatmak için sınıfları tekrar ekleyelim
                loveMeterCard.classList.remove('animate__bounceIn');
                void loveMeterCard.offsetWidth; // Reflow - animasyonu sıfırla
                loveMeterCard.classList.add('animate__bounceIn');
            }
        }, 12000);
        
        setTimeout(() => {
            const bulbBreakerCard = document.querySelector('.game-card[data-game="bulb-breaker"]');
            if (bulbBreakerCard) {
                bulbBreakerCard.style.opacity = 1;
                bulbBreakerCard.style.visibility = 'visible';
                // Animasyonu yeniden başlatmak için sınıfları tekrar ekleyelim
                bulbBreakerCard.classList.remove('animate__bounceIn');
                void bulbBreakerCard.offsetWidth; // Reflow - animasyonu sıfırla
                bulbBreakerCard.classList.add('animate__bounceIn');
            }
        }, 13000);
    }
    
    // Olay dinleyicilerini kurma
    function setupEventListeners() {
        // Kaydırma butonları
        const scrollDownBtn = document.getElementById('scroll-down-btn');
        const scrollUpBtn = document.getElementById('scroll-up-btn');
        
        // Aşağı kaydırma butonu
        if (scrollDownBtn) {
            scrollDownBtn.addEventListener('click', function() {
                // Sayfayı en aşağıya kaydır
                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: 'smooth'
                });
            });
        }
        
        // Yukarı kaydırma butonu
        if (scrollUpBtn) {
            scrollUpBtn.addEventListener('click', function() {
                // Sayfayı en yukarı kaydır
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
        
        // Sayfa kaydırma olayı - her iki buton için de kontrol
        window.addEventListener('scroll', function() {
            // Scroll pozisyonunu kontrol et
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.body.scrollHeight;
            
            // Aşağı butonunu kontrol et - en aşağıdaysak gizle
            if (scrollDownBtn) {
                if ((windowHeight + scrollPosition) >= documentHeight - 20) {
                    scrollDownBtn.classList.add('hidden');
                } else {
                    scrollDownBtn.classList.remove('hidden');
                }
            }
            
            // Yukarı butonunu kontrol et - en tepedysek gizle ve belli bir aşağı inince göster
            if (scrollUpBtn) {
                if (scrollPosition < 200) {
                    scrollUpBtn.classList.add('hidden');
                } else {
                    scrollUpBtn.classList.remove('hidden');
                }
            }
        });
        
        // Sayfa ilk yüklendiğinde kontrol et
        if (scrollDownBtn) {
            if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight - 20) {
                scrollDownBtn.classList.add('hidden');
            } else {
                scrollDownBtn.classList.remove('hidden');
            }
        }
        
        if (scrollUpBtn) {
            if (window.scrollY < 200) {
                scrollUpBtn.classList.add('hidden');
            } else {
                scrollUpBtn.classList.remove('hidden');
            }
        }
        
        // Oyun kartlarına tıklama
        const gameCards = document.querySelectorAll('.game-card');
        gameCards.forEach(card => {
            card.addEventListener('click', function() {
                const gameId = this.dataset.game;
                if (gameId) {
                    // Yükleme ekranı göster ve sonra oyuna geç
                    toggleLoadingScreen(true);
                    
                    setTimeout(() => {
                        showPage(gameId);
                        
                        // Özel oyun başlatma işlemleri
                        if (gameId === 'memory') {
                            // Memory oyununu başlat
                            if (typeof MemoryGame !== 'undefined' && MemoryGame.start) {
                                MemoryGame.start();
                            }
                        }
                    }, 1500); // 1.5 saniye sonra oyunu göster
                }
            });
        });
        
        // Geri butonlarına tıklama
        const backButtons = document.querySelectorAll('.back-btn');
        backButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Yükleme ekranını göster
                toggleLoadingScreen(true);
                
                setTimeout(() => {
                    // Ana sayfaya dön ve sayfayı yenile
                    showPage('welcome');
                    
                    // Ana sayfayı yenile - kartların animasyonlarını ve görünürlüklerini sıfırla
                    const gameCards = document.querySelectorAll('.game-card');
                    gameCards.forEach(card => {
                        if (card.dataset.game !== 'xox' && 
                            card.dataset.game !== 'memory' && 
                            card.dataset.game !== 'reaction' && 
                            card.dataset.game !== 'game-2048' && 
                            card.dataset.game !== 'tetris' && 
                            card.dataset.game !== 'snake') {
                            // Yeni oyun kartlarını yeniden gizle
                            card.style.opacity = 0;
                            card.style.visibility = 'hidden';
                        }
                    });
                    
                    // Animasyon fonksiyonunu yeniden çağır
                    setTimeout(() => {
                        animateGameCards();
                    }, 100);
                }, 1000);
            });
        });
    }
    
    return {
        init: initApp,
        showPage: showPage,
        toggleLoadingScreen: toggleLoadingScreen
    };
})();

// Sayfa yüklenince uygulamayı başlat
onPageLoad(function() {
    App.init();
});