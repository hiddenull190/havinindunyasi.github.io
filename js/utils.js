/**
 * Fayda fonksiyonlarını içeren dosya
 */

// Rastgele bir sayı üretir (min ve max dahil)
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Bir diziden rastgele eleman seçer
function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Bir diziyi karıştırır
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Milisaniye cinsinden bekleme fonksiyonu
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// LocalStorage'a veri kaydeder
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('LocalStorage save error:', error);
    }
}

// LocalStorage'dan veri okur
function getFromLocalStorage(key, defaultValue) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error('LocalStorage read error:', error);
        return defaultValue;
    }
}

// Zaman formatı (300 -> "300ms")
function formatTime(time) {
    return time !== null ? `${time}ms` : "-";
}

// Sayfa yüklenme fonksiyonu
function onPageLoad(fn) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fn);
    } else {
        fn();
    }
}

// Arkaplan parçacıkları efekti (kalpler, vb.)
function createBackgroundEffects() {
    const particles = document.getElementById('particles');
    const symbols = ['❤️', '✨', '💕', '💞', '💜', '💝', '💛'];
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'heart-particle';
        particle.textContent = getRandomElement(symbols);
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.fontSize = `${getRandomInt(20, 40)}px`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particle.style.animationDuration = `${getRandomInt(10, 20)}s`;
        particles.appendChild(particle);
    }
}

// Anime.js ile yüzen animasyon oluşturmak için yardımcı fonksiyon
function createFloatingAnimation(element, options = {}) {
    if (typeof anime !== 'undefined') {
        anime({
            targets: element,
            translateY: [
                { value: -10, duration: 1500, easing: 'easeInOutSine' },
                { value: 0, duration: 1500, easing: 'easeInOutSine' }
            ],
            loop: true,
            direction: 'alternate',
            ...options
        });
    }
}

// XOX Oyunu için kazanan kontrolü
function checkXOXWinner(board) {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Yatay
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Dikey
        [0, 4, 8], [2, 4, 6]               // Çapraz
    ];
    
    for (const [a, b, c] of lines) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return {
                winner: board[a],
                line: [a, b, c]
            };
        }
    }
    
    return null;
}

// XOX Oyunu için beraberlik kontrolü
function checkXOXDraw(board) {
    return !board.includes("") && !checkXOXWinner(board);
}

// Memory Card oyunu için kart bilgileri
function getCardInfo(value) {
    const icons = [
        '💕', '💖', '💞', '💘', '💗', '💙', '💚', '💛',
        '💜', '💝', '🐶', '🐱', '🐭', '🐹', '🐰', '🐻',
        '🌸', '🌷', '🍀', '🌻', '🌹', '🌺', '🍁', '🍃'
    ];
    
    const colors = [
        '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688',
        '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#795548',
        '#f44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4'
    ];
    
    return {
        icon: icons[value % icons.length],
        color: colors[value % colors.length]
    };
}

// Reaksiyon sürelerine göre sıralanmış hayvanlar
const ANIMAL_REACTIONS = [
    {
        name: "Çita",
        minTime: 0,
        maxTime: 150,
        message: "İnanılmaz! Çita kadar hızlısın! Süper refleksler!",
        className: "bg-yellow-400"
    },
    {
        name: "Jaguar",
        minTime: 151,
        maxTime: 180,
        message: "Jaguar gibi hızlı ve ölümcülsün! Olağanüstü!",
        className: "bg-yellow-600"
    },
    {
        name: "Şahin",
        minTime: 181,
        maxTime: 200,
        message: "Etkileyici! Şahin gibi keskin reflekslerin var!",
        className: "bg-amber-500"
    },
    {
        name: "Panter",
        minTime: 201,
        maxTime: 250,
        message: "Süper hızlı! Panter çevikliğine sahipsin, inanılmazsın!",
        className: "bg-orange-500"
    },
    {
        name: "Kartal",
        minTime: 251,
        maxTime: 300,
        message: "Kartal bakışı! Hedefi asla kaçırmıyorsun, çok başarılısın!",
        className: "bg-red-500"
    },
    {
        name: "Kaplan",
        minTime: 301,
        maxTime: 325,
        message: "Kaplan gücündesin! Çevik ve güçlü, harika bir performans!",
        className: "bg-red-600"
    },
    {
        name: "Kurt",
        minTime: 326,
        maxTime: 350,
        message: "Kurt gibi hızlı ve dikkatlisin! Muhteşem bir performans!",
        className: "bg-indigo-500"
    },
    {
        name: "Tilki",
        minTime: 351,
        maxTime: 400,
        message: "Tilki gibi kıvrak zekan ve reflekslerin var! Beğendim!",
        className: "bg-purple-500"
    },
    {
        name: "Yarasa",
        minTime: 401,
        maxTime: 450,
        message: "Yarasa gibi keskin duyulara sahipsin! Etkileyici!",
        className: "bg-purple-800"
    },
    {
        name: "Tavşan",
        minTime: 451,
        maxTime: 500,
        message: "Tavşan gibi zıplıyorsun! Hala çok hızlısın, aferin!",
        className: "bg-pink-500"
    },
    {
        name: "Geyik",
        minTime: 501,
        maxTime: 550,
        message: "Geyik gibi çevik ve temkinlisin! İyi iş çıkardın!",
        className: "bg-pink-700"
    },
    {
        name: "Sincap",
        minTime: 551,
        maxTime: 600,
        message: "Sincap gibi hareketlisin, güzel! Biraz daha pratikle gelişebilir!",
        className: "bg-teal-500"
    },
    {
        name: "Kedi",
        minTime: 601,
        maxTime: 700,
        message: "Kedi reflekslerin var! Fena değil, daha da iyileştirebilirsin!",
        className: "bg-cyan-500"
    },
    {
        name: "Rakun",
        minTime: 701,
        maxTime: 775,
        message: "Rakun gibi meraklı ve dikkatlisin! Biraz daha pratik yapabilirsin!",
        className: "bg-cyan-700"
    },
    {
        name: "Koala",
        minTime: 776,
        maxTime: 850,
        message: "Koala gibi tatlı ama biraz yavaşsın! Bir kahve molası vermelisin!",
        className: "bg-green-500"
    },
    {
        name: "Kirpi",
        minTime: 851,
        maxTime: 925,
        message: "Kirpi gibi temkinli ama yavaşsın! Biraz uyanık olman gerek!",
        className: "bg-green-700"
    },
    {
        name: "Panda",
        minTime: 926,
        maxTime: 1000,
        message: "Panda modundasın! Sevimli ama yavaş... Daha dikkatli olmalısın!",
        className: "bg-lime-500"
    },
    {
        name: "Su Aygırı",
        minTime: 1001,
        maxTime: 1200,
        message: "Su aygırı gibi ağır hareket ediyorsun! Biraz daha hızlı olabilirsin!",
        className: "bg-gray-600"
    },
    {
        name: "Tembel Hayvan",
        minTime: 1201,
        maxTime: 1500,
        message: "Tembel hayvan modundasın! Bugün çok yavaş bir günün var!",
        className: "bg-gray-500"
    },
    {
        name: "Kaplumbağa",
        minTime: 1501,
        maxTime: Number.MAX_SAFE_INTEGER,
        message: "Kaplumbağa modundasın! Bugün yeteri kadar dinlenmedin mi? 😴",
        className: "bg-gray-400"
    }
];

// Reaksiyon süresine göre hayvan bilgisi döndür
function getAnimalReaction(time) {
    return ANIMAL_REACTIONS.find(animal => 
        time >= animal.minTime && time <= animal.maxTime
    ) || ANIMAL_REACTIONS[ANIMAL_REACTIONS.length - 1];
}