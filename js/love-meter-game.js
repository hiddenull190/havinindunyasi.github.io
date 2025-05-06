/**
 * Havin'in Aşk Ölçeri - Love Meter Game
 * İki isim arasındaki aşk uyumunu hesaplayan mini oyun
 */
const LoveMeterGame = (function() {
    // DOM Elementleri
    const name1Input = document.getElementById('name1');
    const name2Input = document.getElementById('name2');
    const calculateButton = document.getElementById('calculate-love');
    const lovePercentage = document.getElementById('love-percentage');
    const loveHeart = document.getElementById('love-heart');
    const resultMessage = document.getElementById('love-result-message');
    
    // Özel isimler (her zaman %100 veya %0 sonuç verecek olanlar)
    const specialNames = {
        havin: 'toprak',  // Havin ve Toprak kombinasyonu her zaman %100
        toprak: 'havin'   // Aynı şekilde Toprak ve Havin de %100
    };
    
    // Olası aşk mesajları
    const loveMessages = {
        perfect: [
            "Mükemmel bir uyum! Birlikteyken yıldızlar parlıyor!",
            "Aşk tanrıları bile bu uyumu kıskanıyor!",
            "Ruh eşinizi buldunuz! Bu aşk ömür boyu sürecek!",
            "Kalbinizin ritmi aynı anda atıyor!"
        ],
        high: [
            "Çok güçlü bir bağınız var! Bu aşk uzun sürebilir!",
            "Birbirinize çok iyi geliyorsunuz!",
            "Kalbiniz aşkla dolu, bu bağı koruyun!",
            "Güzel bir uyum yakaladınız!"
        ],
        medium: [
            "İyi bir uyumunuz var, zamanla daha da güçlenebilir!",
            "Birbirinizi tanıdıkça aşkınız büyüyebilir!",
            "Farklılıklarınız sizi tamamlıyor olabilir!",
            "Bu ilişkide gelişim potansiyeli var!"
        ],
        low: [
            "Biraz daha çaba ile bu ilişki ilerleyebilir!",
            "Henüz kalbiniz birbirine ısınmamış olabilir!",
            "Aşk bazen zaman ister, sabırlı olun!",
            "Daha fazla zaman geçirerek aranızdaki bağı güçlendirebilirsiniz!"
        ],
        zero: [
            "Belki de sadece arkadaş kalmalısınız!",
            "Bazen en güzel arkadaşlıklar böyle başlar!",
            "Her aşk olmayan ilişki de özel olabilir!",
            "Belki başka bir zamanda, başka bir hayatta!"
        ]
    };
    
    // Rastgele mesaj seçme fonksiyonu
    function getRandomMessage(category) {
        const messages = loveMessages[category];
        const randomIndex = Math.floor(Math.random() * messages.length);
        return messages[randomIndex];
    }
    
    // İsimleri normalize etme (küçük harfe çevirme ve boşlukları temizleme)
    function normalizeName(name) {
        return name.toLowerCase().trim();
    }
    
    // İsimlerin özel kombinasyon olup olmadığını kontrol etme
    function checkSpecialNames(name1, name2) {
        name1 = normalizeName(name1);
        name2 = normalizeName(name2);
        
        // Havin, Leman, Toprak ve Rasim isimleri için özel durumlar
        const havinNames = ['havin', 'leman'];
        const toprakNames = ['toprak', 'rasim'];
        
        // İsimlerin Havin/Leman veya Toprak/Rasim olup olmadığını kontrol et
        const isName1Havin = havinNames.includes(name1);
        const isName2Havin = havinNames.includes(name2);
        const isName1Toprak = toprakNames.includes(name1);
        const isName2Toprak = toprakNames.includes(name2);
        
        // Havin/Leman ve Toprak/Rasim (veya tersi) kombinasyonu kontrolü
        if ((isName1Havin && isName2Toprak) || (isName1Toprak && isName2Havin)) {
            return { 
                percentage: 100,
                message: null // Normal yüksek yüzde mesajı kullanılacak
            };
        }
        
        // Havin başka bir isimle eşleştirilirse özel mesaj
        if (name1 === 'havin' && !isName2Toprak) {
            return {
                percentage: 0,
                message: "Havin sadece Toprak'a ait!"
            };
        }
        
        if (name2 === 'havin' && !isName1Toprak) {
            return {
                percentage: 0,
                message: "Havin sadece Toprak'a ait!"
            };
        }
        
        // Leman başka bir isimle eşleştirilirse özel mesaj
        if (name1 === 'leman' && !isName2Toprak) {
            return {
                percentage: 0,
                message: "Leman sadece Toprak'a ait!"
            };
        }
        
        if (name2 === 'leman' && !isName1Toprak) {
            return {
                percentage: 0,
                message: "Leman sadece Toprak'a ait!"
            };
        }
        
        // Toprak başka bir isimle eşleştirilirse özel mesaj
        if (name1 === 'toprak' && !isName2Havin) {
            return {
                percentage: 0,
                message: "Toprak sadece Havin'e ait!"
            };
        }
        
        if (name2 === 'toprak' && !isName1Havin) {
            return {
                percentage: 0,
                message: "Toprak sadece Havin'e ait!"
            };
        }
        
        // Rasim başka bir isimle eşleştirilirse özel mesaj
        if (name1 === 'rasim' && !isName2Havin) {
            return {
                percentage: 0,
                message: "Rasim sadece Havin'e ait!"
            };
        }
        
        if (name2 === 'rasim' && !isName1Havin) {
            return {
                percentage: 0,
                message: "Rasim sadece Havin'e ait!"
            };
        }
        
        // Özel durum yoksa rastgele sonuç döndür
        return null;
    }
    
    // Rastgele bir aşk yüzdesi oluşturma
    function generateRandomPercentage() {
        return Math.floor(Math.random() * 101); // 0-100 arası
    }
    
    // Aşk yüzdesine göre mesaj kategorisi belirleme
    function getMessageCategory(percentage) {
        if (percentage === 100) return 'perfect';
        if (percentage >= 75) return 'high';
        if (percentage >= 50) return 'medium';
        if (percentage > 0) return 'low';
        return 'zero';
    }
    
    // Aşk yüzdesini hesaplama
    function calculateLovePercentage() {
        const name1 = name1Input.value;
        const name2 = name2Input.value;
        
        // İsimler boşsa uyarı ver
        if (!name1 || !name2) {
            resultMessage.textContent = "Lütfen her iki ismi de girin!";
            return;
        }
        
        // Özel kombinasyonları kontrol et
        let result = checkSpecialNames(name1, name2);
        let percentage, customMessage;
        
        // Özel bir kombinasyon değilse rastgele bir yüzde belirle
        if (result === null) {
            percentage = generateRandomPercentage();
        } else {
            // Özel durum
            percentage = result.percentage;
            customMessage = result.message;
        }
        
        // Sonucu göster
        lovePercentage.textContent = `%${percentage}`;
        loveHeart.classList.add('animate-heartbeat');
        
        // Kalp animasyonu bitince sınıfı kaldır
        setTimeout(() => {
            loveHeart.classList.remove('animate-heartbeat');
        }, 1000);
        
        // Özel mesaj varsa onu göster, yoksa normal mesajlardan seç
        if (customMessage) {
            resultMessage.textContent = customMessage;
        } else {
            // Aşk mesajını göster
            const category = getMessageCategory(percentage);
            resultMessage.textContent = getRandomMessage(category);
        }
    }
    
    // Olayları dinleme
    function setupEventListeners() {
        calculateButton.addEventListener('click', calculateLovePercentage);
        
        // Enter tuşuna basılınca da hesaplama yap
        name1Input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                name2Input.focus();
            }
        });
        
        name2Input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateLovePercentage();
            }
        });
    }
    
    // Oyunu başlatma
    function init() {
        setupEventListeners();
    }
    
    return {
        init: init
    };
})();

// Sayfa yüklendiğinde oyunu başlat
onPageLoad(function() {
    LoveMeterGame.init();
});