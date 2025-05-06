/**
 * Kelime Tahmin (Hangman) Oyunu için JavaScript
 */
const HangmanGame = (function() {
    // DOM elementleri
    let hangmanWord;
    let hangmanDrawing;
    let hangmanKeyboard;
    let categoryDisplay;
    let attemptsDisplay;
    let correctDisplay;
    let startBtn;
    
    // Oyun değişkenleri
    let currentWord = "";
    let category = "";
    let guessedLetters = [];
    let remainingAttempts = 6;
    let correctGuesses = 0;
    let isGameOver = false;
    
    // Kategorilere ayrılmış kelimeler
    const wordCategories = {
        "Hayvanlar": [
            "ASLAN", "KAPLAN", "ZEBRA", "PENGUEN", "GEYİK", "ZÜRAFA", "KAPLUMBAĞA", "KARTAL", "MAYMUN", "KOALA", "PANDA", "JAGUAR", 
            "TİMSAH", "BALIK", "KUNDUZ", "TAVŞAN", "SİNCAP", "KUNDUZ", "KEDİ", "KÖPEK", "AT", "EŞEK", "TAVUK", "HOROZ", "İNEK", "KEKLİK", 
            "HİNDİ", "YILAN", "ÇIYAN", "KİRPİ", "AYI", "KURT", "TİLKİ", "AKREP", "KARINCA", "ARI", "YARASA", "KOYUN", "KEÇİ", "DOMUZ", 
            "YUNUS", "BALİNA", "DENİZATI", "VATOZ", "GERGEDAN", "FİL", "SIRTLAN", "CEYLAN", "ANTİLOP", "KANGURU", "KOALA", "HİPOPOTAM", 
            "ORANGUTAN", "LEMUR", "SAMUR", "VARİL", "LAMA", "ALPAKA", "GERGEDAN", "YENGEÇ", "İSTAKOZ", "MİDYE", "TIRTIL", "KELEBEK", 
            "AHTAPOT", "MİDYE", "DENİZYILDIZI", "DENİZKESTANESİ", "AĞAÇKAKAN", "PAPAĞAN", "KANARYA", "MUHABBET", "SIĞIRCIK", "BAYKUŞ", 
            "KARTAL", "ŞAHİN", "GÜVERCİN", "KUMRU", "SERÇE", "LEYLEK", "FLAMİNGO", "PELİKAN", "ALBATROS", "KİRPİ", "BAYKUŞ"
        ],
        "Meyveler": [
            "ELMA", "ARMUT", "PORTAKAL", "MANDALİNA", "KARPUZ", "KAVUN", "KİRAZ", "ÇİLEK", "MUZ", "ANANAS", "ÜZÜM", "ŞEFTALİ", 
            "KAYISI", "İNCİR", "AVOKADO", "KİVİ", "MANGO", "PAPAYA", "EJDER", "GREYFURT", "LİMON", "NAR", "MÜRVER", "ARMUT", "AYVA", 
            "VİŞNE", "DÜNYA", "CENNET", "KESTANE", "CEVİZ", "BADEM", "FINDIK", "ANTEP", "FISTIK", "HURMA", "YABAN", "BÖĞÜRTLEN", 
            "AHUDUDU", "DEMİRHİNDİ", "BALKABAĞI", "KAVUN", "KUMKUAT", "MALTA", "LİÇİMA", "PİTAYA", "PERSİMMON", "KARAMBOLA", "GUAVA", 
            "POMELO", "DURİAN", "LİÇİ", "LONGKİN", "PASSİONFRUT", "FEİJOA", "PHYSALİS", "SALAK", "JACKFRUİT", "KUMKVAT"
        ],
        "Şehirler": [
            "İSTANBUL", "ANKARA", "İZMİR", "ANTALYA", "BURSA", "KONYA", "ADANA", "TRABZON", "GAZİANTEP", "ESKİŞEHİR", "SAMSUN", 
            "KAYSERİ", "MERSİN", "DİYARBAKIR", "MARDİN", "BALIKESİR", "MANİSA", "HATAY", "MALATYA", "KÜTAHYA", "ORDU", "ERZURUM", 
            "TOKAT", "SİVAS", "AFYON", "UŞAK", "DENİZLİ", "ISPARTA", "KIRŞEHİR", "KARAMAN", "NEVŞEHİR", "AMASYA", "SİNOP", "TUNCELİ", 
            "BOLU", "KARABÜK", "ÇORUM", "KIRKLARELİ", "EDİRNE", "TEKİRDAĞ", "ÇANAKKALE", "BİLECİK", "SAKARYA", "KOCAELİ", "YALOVA", 
            "RİZE", "ARTVİN", "GÜMÜŞHANE", "KAHRAMANMARAŞ", "ŞANLIURFA", "SİİRT", "MUŞ", "BATMAN", "ŞIRNAK", "HAKKARİ", "BİTLİS", 
            "BİNGÖL", "ELAZIĞ", "AĞRI", "ARDAHAN", "KARS", "IĞDIR", "VAN", "YOZGAT", "KIRŞEHİR", "ADIYAMAN", "OSMANİYE", "KİLİS", 
            "NEWYORK", "PARİS", "LONDRA", "TOKYO", "ROMA", "BARSELONA", "BERLİN", "MADRİD", "MOSKOVA", "DUBAİ"
        ],
        "Meslekler": [
            "ÖĞRETMEN", "DOKTOR", "MÜHENDİS", "AVUKAT", "AŞÇI", "BERBER", "HEMŞİRE", "POLİS", "İTFAİYECİ", "GARSON", "TERZİ", 
            "KASAP", "MARANGOZ", "MUHASEBECİ", "MÜZİSYEN", "FOTOĞRAFÇI", "TESİSATÇI", "BOYACI", "CERRAH", "DİŞÇİ", "ECZACI", "GÜMRÜK", 
            "HAKİM", "MALİ", "PSİKOLOG", "SOSYAL", "SOSYOLOG", "REHBER", "SANATÇI", "OYUNCU", "YAZAR", "YAZILIM", "AVCI", "BALIKÇI", 
            "ÇİFTÇİ", "MADENCİ", "ORMANCI", "ARKEOLOG", "BİYOLOG", "FİZİKÇİ", "GENETİK", "JEOLOG", "KİMYAGER", "MATEMATİKÇİ", "ASTRONOM",
            "PİLOT", "KAPTAN", "HOSTES", "KONDÜKTÖR", "MAKİNİST", "TAKSİCİ", "VETERİNER", "ANTRENÖR", "DİYETİSYEN", "FİZYOTERAPİST", 
            "GAZETECİ", "SUNUCU", "KOMEDYEN", "TASARIMCI", "MİMAR", "REKLAMCI", "PAZARLAMACI", "BANKER", "EMLAKÇI", "SİGORTACI"
        ],
        "Renkler": [
            "KIRMIZI", "MAVİ", "SARI", "YEŞİL", "TURUNCU", "MOR", "PEMBE", "KAHVERENGİ", "LACİVERT", "TURKUAZ", "BORDO", "EFLATUN", 
            "MOR", "SİYAH", "BEYAZ", "GRİ", "BONCUKMAVİ", "CAMGÖBEĞİ", "ÇİNGENE", "ÇAĞLA", "ÇİVİT", "DEVETÜYÜ", "ELA", "FINDIK", "FÜME", 
            "GÜLKURUSU", "HAVUÇ", "İNDİGO", "KAVUNİÇİ", "KIRKIZILl", "KOBALT", "LEYLAK", "LİME", "LİLA", "MAGENTA", "MENEKŞE", "MİNTGRE", 
            "MÜRDÜM", "OLİVE", "PETROL", "SAFRAN", "ŞAMPANYA", "SANDAL", "SOMON", "TABA", "VİZON", "VİŞNE", "YAVRUAĞZI", "ZEYTİN", "AKİK", 
            "ATEŞ", "BAKIR", "BRONZ", "DUMAN", "FISTIK", "GÜMÜŞ", "HAKİ", "HARDAL", "KAVUN", "KİREMİT", "NAR", "SARI"
        ],
        "Spor": [
            "FUTBOL", "BASKETBOL", "VOLEYBOL", "TENİS", "HENTBOL", "YÜZME", "KOŞU", "ATLAMA", "GOLF", "HOKEYİ", "RUGBY", "BOKS", 
            "GÜREŞ", "KARATE", "JİMNASTİK", "BİLARDO", "BOWLİNG", "KAYAK", "DAĞCILIK", "DALGA", "KANO", "YOGA", "PİLATES", "BEYZBOL", 
            "BADMİNTON", "BİSİKLET", "BİNİCİLİK", "HALTER", "HALI", "AİKİDO", "WİNG", "JUDO", "TAEKWONDO", "ESKRİM", "MARATON", "OKÇULUK", 
            "POLO", "CURLİNG", "KRİKET", "BOCCE", "RAFTİNG", "VUŞU", "SNOWBOARD", "RAGBİ", "LAKROS", "ZORBİNG", "PARKOUR", "TRİATLON", 
            "MASA", "SQUASH", "DART", "SAVATE", "TAKRAW", "SEPAK", "PAİNTBALL", "SOFTBOL", "KABADDİ", "GUNGDO", "NİNJUTSU"
        ],
        "Ülkeler": [
            "TÜRKİYE", "ALMANYA", "FRANSA", "İTALYA", "HOLLANDA", "İNGİLTERE", "İSVEÇ", "NORVEÇ", "DANİMARKA", "FİNLANDİYA", "RUSYA", 
            "İSPANYA", "POLONYA", "PORTEKİZ", "SLOVENYA", "MACARİSTAN", "SLOVAKYA", "HIRVATİSTAN", "YUNANİSTAN", "BULGARİSTAN", "ROMANYA", 
            "SIRBİSTAN", "MAKEDONYA", "ARNAVUTLUK", "KOSOVA", "KARADAĞ", "BOSNAHERSEK", "BELÇİKA", "AVUSTURYA", "İSVİÇRE", "LİHTENŞTAYN", 
            "ÇEKCUMHURIYETI", "ESTONYA", "LETONYA", "LİTVANYA", "UKRAYNA", "MOLDOVA", "BELARUS", "ABD", "KANADA", "MEKSİKA", "BREZİLYA", 
            "ARJANTİN", "KOLOMBİYA", "PERU", "BOLİVYA", "ŞİLİ", "EKVADOR", "VENEZUELA", "PANAMA", "KOSTA", "RİKA", "NİKARAGUA", "HONDURAS", 
            "ELSALVADOR", "GUATEMALA", "KÜBA", "JAMAİKA", "BAHAMALAR", "BARBADOS", "ÇİN", "JAPONYA", "HİNDİSTAN", "PAKİSTAN", "İRAN", "IRAK", 
            "SURİYE", "MISIR", "CEZAYİR", "LİBYA", "TUNUS", "FAS", "SENEGAL", "NİJERYA", "KENYA", "UGANDA", "TANZANYA", "AVUSTRALYA", "YENİZELLANDA"
        ]
    };
    
    // Adam çizimi için SVG parçaları
    const hangmanParts = [
        '<circle cx="100" cy="60" r="20" fill="none" stroke="var(--primary)" stroke-width="4" />', // Kafa
        '<line x1="100" y1="80" x2="100" y2="140" stroke="var(--primary)" stroke-width="4" />', // Gövde
        '<line x1="100" y1="90" x2="70" y2="120" stroke="var(--primary)" stroke-width="4" />', // Sol kol
        '<line x1="100" y1="90" x2="130" y2="120" stroke="var(--primary)" stroke-width="4" />', // Sağ kol
        '<line x1="100" y1="140" x2="70" y2="180" stroke="var(--primary)" stroke-width="4" />', // Sol bacak
        '<line x1="100" y1="140" x2="130" y2="180" stroke="var(--primary)" stroke-width="4" />' // Sağ bacak
    ];
    
    // Darağacı çizimi (her zaman görünür)
    const gallows = '<line x1="40" y1="200" x2="160" y2="200" stroke="var(--foreground)" stroke-width="4" />' + // Taban
                   '<line x1="60" y1="200" x2="60" y2="30" stroke="var(--foreground)" stroke-width="4" />' + // Direk
                   '<line x1="60" y1="30" x2="100" y2="30" stroke="var(--foreground)" stroke-width="4" />' + // Üst çubuk
                   '<line x1="100" y1="30" x2="100" y2="40" stroke="var(--foreground)" stroke-width="4" />'; // İp
    
    // DOM elementlerini başlat
    function initElements() {
        hangmanWord = document.getElementById('hangman-word');
        hangmanDrawing = document.getElementById('hangman-drawing');
        hangmanKeyboard = document.getElementById('hangman-keyboard');
        categoryDisplay = document.getElementById('current-category');
        attemptsDisplay = document.getElementById('hangman-attempts');
        correctDisplay = document.getElementById('hangman-correct');
        startBtn = document.getElementById('hangman-start');
    }
    
    // Oyun tahtasını oluştur
    function createBoard() {
        if (!hangmanWord || !hangmanDrawing || !hangmanKeyboard) return;
        
        // Adam çizimini sıfırla
        hangmanDrawing.innerHTML = '<svg width="100%" height="100%" viewBox="0 0 200 240">' + gallows + '</svg>';
        
        // Kelime alanını temizle
        hangmanWord.innerHTML = '';
        
        // Klavyeyi oluştur
        createKeyboard();
        
        // İstatistikleri güncelle
        updateStats();
    }
    
    // Klavyeyi oluştur
    function createKeyboard() {
        if (!hangmanKeyboard) return;
        
        hangmanKeyboard.innerHTML = '';
        const alphabet = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ';
        
        for (let i = 0; i < alphabet.length; i++) {
            const letter = alphabet[i];
            const key = document.createElement('div');
            key.className = 'keyboard-key';
            key.textContent = letter;
            key.dataset.letter = letter;
            
            // Eğer harf tahmin edildiyse uygun sınıfı ekle
            if (guessedLetters.includes(letter)) {
                if (currentWord.includes(letter)) {
                    key.classList.add('correct');
                } else {
                    key.classList.add('wrong');
                }
                key.classList.add('used');
            } else {
                // Harfe tıklama olayı ekle
                key.addEventListener('click', function() {
                    if (!isGameOver && !guessedLetters.includes(letter)) {
                        guessLetter(letter);
                    }
                });
            }
            
            hangmanKeyboard.appendChild(key);
        }
    }
    
    // Rastgele bir kelime seç
    function selectRandomWord() {
        // Rastgele bir kategori seç
        const categories = Object.keys(wordCategories);
        category = getRandomElement(categories);
        
        // Seçilen kategoriden rastgele bir kelime seç
        const words = wordCategories[category];
        currentWord = getRandomElement(words);
        
        // Kategori görüntüsünü güncelle
        if (categoryDisplay) {
            categoryDisplay.textContent = category;
        }
        
        // Kelime alanını oluştur
        if (hangmanWord) {
            hangmanWord.innerHTML = '';
            
            for (let i = 0; i < currentWord.length; i++) {
                const letterBox = document.createElement('div');
                letterBox.className = 'hangman-letter';
                letterBox.dataset.index = i;
                hangmanWord.appendChild(letterBox);
            }
        }
    }
    
    // Tahmin edilen harfle ilgili işlemler
    function guessLetter(letter) {
        if (guessedLetters.includes(letter) || isGameOver) return;
        
        // Harfi tahmin edilenler listesine ekle
        guessedLetters.push(letter);
        
        if (currentWord.includes(letter)) {
            // Doğru tahmin - kelimeyi güncelle
            updateWordDisplay(letter);
            
            // Oyunu kazandı mı kontrol et
            checkWin();
        } else {
            // Yanlış tahmin - kalan hakkı azalt
            remainingAttempts--;
            updateHangman();
            
            // Oyun bitti mi kontrol et
            if (remainingAttempts <= 0) {
                gameOver(false);
            }
        }
        
        // Klavyeyi güncelle
        createKeyboard();
        
        // İstatistikleri güncelle
        updateStats();
    }
    
    // Kelime görüntüsünü güncelle
    function updateWordDisplay(letter) {
        if (!hangmanWord) return;
        
        // Harfin göründüğü tüm yerleri güncelle
        for (let i = 0; i < currentWord.length; i++) {
            if (currentWord[i] === letter) {
                const letterBox = hangmanWord.querySelector(`[data-index="${i}"]`);
                if (letterBox) {
                    letterBox.textContent = letter;
                }
            }
        }
    }
    
    // Adam çizimini güncelle
    function updateHangman() {
        if (!hangmanDrawing) return;
        
        // Hak sayısı kadar adam parçası görüntüle
        const partIndex = 6 - remainingAttempts - 1;
        
        if (partIndex >= 0 && partIndex < hangmanParts.length) {
            const svg = hangmanDrawing.querySelector('svg');
            if (svg) {
                svg.innerHTML = gallows + hangmanParts.slice(0, partIndex + 1).join('');
            }
        }
    }
    
    // Kazandı mı kontrol et
    function checkWin() {
        let allLettersGuessed = true;
        
        for (let i = 0; i < currentWord.length; i++) {
            if (!guessedLetters.includes(currentWord[i])) {
                allLettersGuessed = false;
                break;
            }
        }
        
        if (allLettersGuessed) {
            gameOver(true);
        }
    }
    
    // İstatistikleri güncelle
    function updateStats() {
        if (attemptsDisplay) {
            attemptsDisplay.textContent = remainingAttempts;
        }
        
        const state = GameState.getHangmanState();
        if (correctDisplay && state) {
            correctDisplay.textContent = state.correctWords;
        }
    }
    
    // Oyun sonu
    function gameOver(isWin) {
        isGameOver = true;
        
        if (isWin) {
            // Kazandı - tüm harfleri göster
            revealWord();
            
            // istatistikleri güncelle
            const state = GameState.getHangmanState();
            GameState.updateHangmanState({
                ...state,
                correctWords: state.correctWords + 1,
                totalGames: state.totalGames + 1,
                currentStreak: state.currentStreak + 1,
                bestStreak: Math.max(state.bestStreak, state.currentStreak + 1)
            });
            
            // Oyun kazanıldı bildirimi
            setTimeout(() => {
                alert(`Tebrikler! "${currentWord}" kelimesini doğru buldun!`);
            }, 500);
        } else {
            // Kaybetti - doğru kelimeyi göster
            revealWord();
            
            // istatistikleri güncelle
            const state = GameState.getHangmanState();
            GameState.updateHangmanState({
                ...state,
                totalGames: state.totalGames + 1,
                currentStreak: 0
            });
            
            // Oyun kaybedildi bildirimi
            setTimeout(() => {
                alert(`Maalesef kaybettin. Doğru kelime: "${currentWord}"`);
            }, 500);
        }
        
        // Buton metnini güncelle
        if (startBtn) {
            startBtn.textContent = 'Yeni Oyun';
        }
    }
    
    // Kelimeyi göster
    function revealWord() {
        if (!hangmanWord) return;
        
        const letterBoxes = hangmanWord.querySelectorAll('.hangman-letter');
        for (let i = 0; i < letterBoxes.length; i++) {
            letterBoxes[i].textContent = currentWord[i];
        }
    }
    
    // Oyunu başlat
    function startGame() {
        // Oyun durumunu sıfırla
        isGameOver = false;
        guessedLetters = [];
        remainingAttempts = 6;
        
        // Yeni kelime seç
        selectRandomWord();
        
        // Tahtayı oluştur
        createBoard();
        
        console.log("Kelime Tahmin Oyunu başlatıldı. Gizli kelime:", currentWord);
    }
    
    // Olay dinleyicilerini ayarla
    function setupEventListeners() {
        // Başlatma butonu
        if (startBtn) {
            startBtn.addEventListener('click', startGame);
        }
        
        // Klavye olayları
        document.addEventListener('keydown', function(e) {
            if (isGameOver) return;
            
            // Türkçe karakterleri de içeren bir kontrol
            const alphabet = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ';
            const key = e.key.toUpperCase();
            
            if (alphabet.includes(key) && !guessedLetters.includes(key)) {
                guessLetter(key);
            }
        });
    }
    
    // Kelime Tahmin oyununu başlat
    function initHangmanGame() {
        initElements();
        setupEventListeners();
        
        // İlk oyunu otomatik başlatma
        startGame();
    }
    
    // Sayfa yüklendiğinde oyunu başlat
    onPageLoad(initHangmanGame);
    
    // Dışa aktarılan fonksiyonlar
    return {
        start: startGame
    };
})();