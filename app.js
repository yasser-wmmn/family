// تطبيق عائلة مشعل - النسخة المطورة للأبطال 🚀
// 👦 مشعل (6) - محمد (5) - نايف (1)

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    loadStars();
    setupTabs();
    initializeCodingGame();
    showFeedback('مرحباً بالقادة الصغار! 🚀 منصتكم المتطورة جاهزة', 'success');
});

// إعداد التبويبات للتنقل السلس
function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');

            // تحديث حالة الأزرار
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // عرض المحتوى المناسب
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });

            // العودة لصفحة الدروس الرئيسية إذا كنا في تبويب التعليم
            if (tabId === 'education') {
                hideAllLessons();
            }

            // التمرير للأعلى عند تغيير التبويب
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

// إظهار وإخفاء الدروس
function showLesson(subject) {
    document.getElementById('all-lessons').classList.add('hidden');
    document.querySelectorAll('.lesson-content').forEach(lc => lc.classList.add('hidden'));

    const target = document.getElementById(`${subject}-lesson`);
    if (target) {
        target.classList.remove('hidden');
    }
}

function hideAllLessons() {
    document.getElementById('all-lessons').classList.remove('hidden');
    document.querySelectorAll('.lesson-content').forEach(lc => lc.classList.add('hidden'));

    // إعادة تعيين لعبة البرمجة عند الرجوع
    resetCodingGame();
}

// لعبة البرمجة 💻 المطورة (20 مستويات)
let robotPos = { x: 0, y: 0 };
let goalPos = { x: 2, y: 2 };
let codingLevel = 1;
let gridSize = 3;
let commandQueue = [];
let isExecuting = false;

function initializeCodingGame() {
    codingLevel = 1;
    commandQueue = [];
    isExecuting = false;
    resetLevel();
}

function updateCodingGrid() {
    const grid = document.getElementById('coding-grid');
    const levelDisplay = document.getElementById('coding-level');
    const stageDisplay = document.getElementById('coding-stage');
    
    if (!grid) return;

    // Determine Stage
    let stageText = "التحكم المباشر 🎮";
    if (codingLevel >= 6 && codingLevel <= 15) stageText = "بناء التسلسل 🧩";
    if (codingLevel >= 16) stageText = "المبرمج المحترف 💻";
    
    if (levelDisplay) levelDisplay.innerText = codingLevel;
    if (stageDisplay) stageDisplay.innerText = stageText;

    // Adjust grid size
    gridSize = 3;
    if(codingLevel > 5) gridSize = 4;
    if(codingLevel > 10) gridSize = 5;
    if(codingLevel > 15) gridSize = 6;

    grid.innerHTML = '';
    grid.style.gridTemplateColumns = `repeat(${gridSize}, 60px)`;
    
    // UI Panel handling
    document.getElementById('coding-panel').classList.toggle('hidden', codingLevel < 6 || codingLevel >= 16);
    document.getElementById('text-coding-panel').classList.toggle('hidden', codingLevel < 16);
    document.getElementById('coding-controls-arrows').classList.toggle('hidden', codingLevel >= 16);
    document.getElementById('coding-controls-text').classList.toggle('hidden', codingLevel < 16);
    document.getElementById('run-code-btn').classList.toggle('hidden', codingLevel < 6);

    // Obstacles
    if (!window.codingObstacles || window.lastLevel !== codingLevel) {
        window.codingObstacles = [];
        window.lastLevel = codingLevel;
        let numObstacles = Math.floor((codingLevel - 1) / 3);
        for (let i = 0; i < numObstacles; i++) {
            let ob;
            let attempts = 0;
            do {
                ob = { x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) };
                attempts++;
            } while (attempts < 20 && ((ob.x === robotPos.x && ob.y === robotPos.y) || (ob.x === goalPos.x && ob.y === goalPos.y) || window.codingObstacles.some(o => o.x === ob.x && o.y === ob.y)));
            window.codingObstacles.push(ob);
        }
    }

    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const cell = document.createElement('div');
            cell.style.cssText = `width:60px; height:60px; display:flex; align-items:center; justify-content:center; font-size:2em; background:#2f3542; border-radius:10px; transition:all 0.3s;`;

            const obstacle = window.codingObstacles.find(o => o.x === x && o.y === y);

            if (x === robotPos.x && y === robotPos.y) {
                cell.innerText = '🤖';
                cell.style.background = 'var(--primary)';
                cell.style.boxShadow = '0 0 15px var(--primary)';
                cell.style.transform = 'scale(1.1)';
            } else if (x === goalPos.x && y === goalPos.y) {
                cell.innerText = '⭐';
                cell.style.background = 'var(--accent)';
                cell.style.animation = 'pulse 1.5s infinite';
            } else if (obstacle) {
                cell.innerText = '🧱';
                cell.style.background = '#3a3a3c';
            }
            grid.appendChild(cell);
        }
    }
}

const dirSymbols = { 'up': '🔼', 'down': '🔽', 'right': '▶️', 'left': '◀️' };
const dirText = { 'up': 'up()', 'down': 'down()', 'right': 'right()', 'left': 'left()' };

function updateQueueDisplay() {
    const queueDiv = document.getElementById('coding-queue');
    const textQueueDiv = document.getElementById('text-coding-queue');
    
    if (codingLevel >= 6 && codingLevel <= 15) {
        queueDiv.innerHTML = '';
        commandQueue.forEach(cmd => {
            const span = document.createElement('span');
            span.innerText = dirSymbols[cmd];
            span.style.cssText = 'background:var(--secondary); padding:5px; border-radius:8px; display:inline-block; animation:zoomIn 0.2s;';
            queueDiv.appendChild(span);
        });
    } else if (codingLevel >= 16) {
        textQueueDiv.innerHTML = commandQueue.map((cmd, i) => `${i+1}. <span style="color:var(--accent)">${dirText[cmd]}</span>;`).join('<br>');
    }
}

function clearCode() {
    if(isExecuting) return;
    commandQueue = [];
    updateQueueDisplay();
}

function addCommand(cmd) {
    if(isExecuting) return;
    
    if (codingLevel < 6) {
        // Direct control
        executeCommand(cmd);
        checkWinCondition();
    } else {
        // Queue command
        if(commandQueue.length < 20) {
            commandQueue.push(cmd);
            updateQueueDisplay();
        } else {
            showFeedback('الذاكرة ممتلئة! أقصى عدد للأوامر هو 20', 'fail');
        }
    }
}

function executeCommand(direction) {
    let nextPos = { ...robotPos };
    switch (direction) {
        case 'up': if (nextPos.y > 0) nextPos.y--; break;
        case 'down': if (nextPos.y < gridSize - 1) nextPos.y++; break;
        case 'right': if (nextPos.x > 0) nextPos.x--; break;
        case 'left': if (nextPos.x < gridSize - 1) nextPos.x++; break;
    }

    const isObstacle = window.codingObstacles.some(o => o.x === nextPos.x && o.y === nextPos.y);
    if (!isObstacle) {
        robotPos = nextPos;
        updateCodingGrid();
        return true;
    } else {
        showFeedback('انتبه! يوجد عائق 🧱', 'fail');
        return false;
    }
}

function checkWinCondition() {
    if (robotPos.x === goalPos.x && robotPos.y === goalPos.y) {
        if (codingLevel < 20) {
            celebrateSuccess(`رائع! أكملت المستوى ${codingLevel} 🤖✨`);
            setTimeout(nextLevel, 1500);
        } else {
            celebrateSuccess('أنت مبرمج خارق! أنهيت كل مستويات اللعبة 🏆💻🚀');
            setTimeout(restartCodingGame, 3000);
        }
        return true;
    }
    return false;
}

function runCode() {
    if(isExecuting || commandQueue.length === 0) return;
    isExecuting = true;
    
    // Save start position in case of failure
    let startPos = {...robotPos};
    let step = 0;

    function nextStep() {
        if (step < commandQueue.length) {
            let success = executeCommand(commandQueue[step]);
            if (!success) {
                // Hit obstacle, stop execution and reset
                showFeedback('اصطدام! حاول كتابة كود بديل 🔄', 'fail');
                setTimeout(() => {
                    robotPos = startPos;
                    updateCodingGrid();
                    isExecuting = false;
                }, 1000);
                return;
            }
            if(checkWinCondition()) {
                isExecuting = false;
                commandQueue = []; // clear code on win
                return; // Won!
            }
            step++;
            setTimeout(nextStep, 500); // 500ms delay between steps
        } else {
            // Reached end of code without winning
            showFeedback('لم تصل للهدف! راجع الأوامر وحاول مجدداً 🤔', 'fail');
            setTimeout(() => {
                robotPos = startPos;
                updateCodingGrid();
                isExecuting = false;
            }, 1000);
        }
    }
    
    nextStep();
}

function nextLevel() {
    codingLevel++;
    resetLevel();
}

function resetLevel() {
    robotPos = { x: 0, y: 0 };
    commandQueue = [];
    isExecuting = false;
    
    // Update grid size before checking goal pos
    gridSize = 3;
    if(codingLevel > 5) gridSize = 4;
    if(codingLevel > 10) gridSize = 5;
    if(codingLevel > 15) gridSize = 6;
    
    // Goal at opposite end for advanced levels
    if(codingLevel >= 6) {
        goalPos = { x: gridSize - 1, y: gridSize - 1 };
    } else {
        do {
            goalPos = {
                x: Math.floor(Math.random() * gridSize),
                y: Math.floor(Math.random() * gridSize)
            };
        } while (goalPos.x === 0 && goalPos.y === 0);
    }

    updateCodingGrid();
    updateQueueDisplay();
}

function restartCodingGame() {
    codingLevel = 1;
    resetLevel();
}

function resetCodingGame() {
    robotPos = { x: 0, y: 0 };
    commandQueue = [];
    isExecuting = false;    
}

// لعبة الإنجليزية 🇺🇸
let currentEnglishLetter = 'A';
function changeEnglishLetter(letter) {
    currentEnglishLetter = letter;
    document.getElementById('english-display').innerText = letter;
    document.getElementById('english-input').value = '';
}

function checkEnglishResult() {
    const input = document.getElementById('english-input').value.trim().toUpperCase();
    if (input === currentEnglishLetter) {
        celebrateSuccess('Excellent! Great job! 🌟');
        document.getElementById('english-input').value = '';
    } else {
        showFeedback('Try again! You can do it! 💪', 'fail');
    }
}

// التربية الإسلامية 🕌
const dhikrList = [
    'سبحان الله',
    'الحمد لله',
    'لا إله إلا الله',
    'الله أكبر',
    'أستغفر الله',
    'اللهم صلِّ على محمد'
];
let currentDhikrIndex = 0;

function nextDhikr() {
    currentDhikrIndex = (currentDhikrIndex + 1) % dhikrList.length;
    document.getElementById('dhikr-text').innerText = dhikrList[currentDhikrIndex];
    celebrateSmall();
}

// تحدي الأبطال الرياضي ⚽
const sportsTasks = [
    { text: "اقفز 5 مرات في مكانك! 🤸", img: "assets/jump.png" },
    { text: "افتح ذراعيك كأنك طيار بطل! ✈️", img: "assets/stretch.png" },
    { text: "المس أطراف أصابع قدميك! 🦶", img: "assets/stretch.png" },
    { text: "اجلس وقم 3 مرات بسرعة! 🔥", img: "assets/jump.png" },
    { text: "حاول الوقوف على قدم واحدة! 🧘", img: "assets/stretch.png" }
];
let currentSportIndex = 0;

function nextSportsChallenge() {
    currentSportIndex = (currentSportIndex + 1) % sportsTasks.length;
    const task = sportsTasks[currentSportIndex];
    document.getElementById('sports-task').innerText = task.text;
    document.getElementById('sports-img').src = task.img;
    celebrateSmall();
}

// إظهار الهوايات
function revealHobby(member) {
    const revealEl = document.getElementById(`hobby-${member}`);
    if (revealEl) {
        if (revealEl.classList.contains('hidden')) {
            revealEl.classList.remove('hidden');
            const iconEl = revealEl.parentElement.querySelector('.hobby-icon');
            const icons = {
                father: '💻', mother: '📚', mashal: '✈️', mohamed: '🚀', naif: '🩺'
            };
            iconEl.innerText = icons[member];
            celebrateSuccess('تم كشف الهواية! 🎉');
        } else {
            revealEl.classList.add('hidden');
            revealEl.parentElement.querySelector('.hobby-icon').innerText = '❓';
        }
    }
}

// لعبة الرياضيات
let count = 0;
function countUp() {
    count++;
    updateCounterDisplay();
}

function countDown() {
    if (count > 0) {
        count--;
        updateCounterDisplay();
    }
}

function updateCounterDisplay() {
    document.getElementById('counter').innerText = count;
}

function checkMathResult(correctAnswer) {
    const input = document.getElementById('answer1');
    if (parseInt(input.value) === correctAnswer) {
        celebrateSuccess('إجابة عبقرية يا بطل! 🧠🎉');
        input.value = '';
    } else {
        showFeedback('حاول مرة أخرى، أنت تستطيع! 💪', 'fail');
    }
}

// لعبة الحروف
let currentLetter = 'أ';
function changeLetter(letter) {
    currentLetter = letter;
    document.getElementById('letter-display').innerText = letter;
    document.getElementById('letter-input').value = '';
}

function checkLetterResult() {
    const input = document.getElementById('letter-input').value.trim();
    if (input === currentLetter) {
        celebrateSuccess('يا لك من ذكي! 📖💖');
    } else {
        showFeedback('جرب مرة ثانية! ✨', 'fail');
    }
}

// لعبة الحيوانات
let currentAnimalName = 'lion';
const animals = {
    lion: { icon: '🦁', name: 'أسد' },
    cat: { icon: '🐱', name: 'قطة' },
    dog: { icon: '🐶', name: 'كلب' },
    rabbit: { icon: '🐰', name: 'أرنب' }
};

function changeAnimal(key) {
    currentAnimalName = key;
    document.getElementById('animal-display').innerText = animals[key].icon;
    document.getElementById('animal-input').value = '';
}

function checkAnimalResult() {
    const input = document.getElementById('animal-input').value.trim();
    const correctName = animals[currentAnimalName].name;

    if (input === correctName) {
        celebrateSuccess(`أحسنت! هذا ${correctName} جميل! 🦁`);
    } else {
        showFeedback(`ليس تماماً، حاول مرة أخرى 🐾`, 'fail');
    }
}

// لعبة صيد النجوم الفضائية 🚀
let gameActive = false;
let gameScore = 0;
let gameTimeLeft = 30;
let gameInterval;

function startGame() {
    if (gameActive) return;

    // تنظيف النجوم السابقة إن وجدت
    const canvas = document.getElementById('game-canvas');
    const existingStars = canvas.querySelectorAll('.space-star');
    existingStars.forEach(s => s.remove());

    gameScore = 0;
    gameTimeLeft = 30;
    gameActive = true;

    document.getElementById('game-score').innerText = gameScore;
    document.getElementById('game-time').innerText = gameTimeLeft;
    document.getElementById('start-game-btn').classList.add('hidden');

    gameInterval = setInterval(() => {
        gameTimeLeft--;
        document.getElementById('game-time').innerText = gameTimeLeft;

        if (gameTimeLeft <= 0) {
            endGame();
        } else {
            createSpaceStar();
        }
    }, 1000);

    // أول نجمة فورا
    createSpaceStar();
}

function createSpaceStar() {
    if (!gameActive) return;

    const canvas = document.getElementById('game-canvas');
    const star = document.createElement('div');
    star.className = 'space-star';
    const starTypes = ['⭐', '🌟', '💎', '✨'];
    star.innerText = starTypes[Math.floor(Math.random() * starTypes.length)];

    const size = Math.random() * 20 + 30; // 30px to 50px
    star.style.fontSize = size + 'px';

    const maxX = canvas.clientWidth - 60;
    const maxY = canvas.clientHeight - 60;
    star.style.left = Math.random() * maxX + 'px';
    star.style.top = Math.random() * maxY + 'px';
    star.style.transform = `rotate(${Math.random() * 360}deg)`;

    star.onclick = (e) => {
        e.stopPropagation();
        if (!gameActive) return;
        gameScore++;
        document.getElementById('game-score').innerText = gameScore;
        star.style.transform = 'scale(0) rotate(180deg)';
        star.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        setTimeout(() => star.remove(), 300);
        celebrateSmall();
    };

    canvas.appendChild(star);

    setTimeout(() => {
        if (star.parentElement) {
            star.style.opacity = '0';
            star.style.transition = 'opacity 0.5s';
            setTimeout(() => star.remove(), 500);
        }
    }, 1200);
}

function endGame() {
    gameActive = false;
    clearInterval(gameInterval);
    const startBtn = document.getElementById('start-game-btn');
    startBtn.classList.remove('hidden');
    startBtn.innerText = 'العب مرة أخرى';

    const finalScore = gameScore;
    if (finalScore >= 15) {
        celebrateSuccess(`أسطوري! جمعت ${finalScore} نجوم! 🏆`);
        addStar(); addStar(); addStar(); // مكافأة 3 نجوم
    } else if (finalScore >= 5) {
        celebrateSuccess(`رائع! جمعت ${finalScore} نجوم! ✨`);
        addStar();
    } else {
        showFeedback(`انتهى الوقت! جمعت ${finalScore} نجوم. حاول مرة أخرى!`, 'success');
    }
}

function celebrateSmall() {
    confetti({
        particleCount: 15,
        spread: 40,
        origin: { y: 0.7 },
        colors: ['#FFE66D', '#74b9ff']
    });
}

// الاحتفال بالنجاح
function celebrateSuccess(message) {
    addStar();
    showFeedback(message, 'success');
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0984e3', '#00cec9', '#fdcb6e']
    });
}

// نظام النجوم
let stars = 0;
function addStar() {
    stars++;
    localStorage.setItem('family_stars', stars);
    updateStarDisplay();
}

function loadStars() {
    stars = parseInt(localStorage.getItem('family_stars') || '0');
    updateStarDisplay();
}

function updateStarDisplay() {
    const el = document.getElementById('star-counter');
    if (el) el.innerText = `⭐ ${stars} نجوم`;
}

// نظام التنبيهات البصري
function showFeedback(text, type) {
    const feedback = document.getElementById('feedback-msg');
    if (!feedback) return;

    feedback.innerText = text;
    feedback.classList.remove('hidden');
    feedback.style.display = 'block';

    if (type === 'success') {
        feedback.style.background = 'var(--secondary)';
    } else {
        feedback.style.background = 'var(--primary)';
    }

    setTimeout(() => {
        feedback.classList.add('hidden');
        feedback.style.display = 'none';
    }, 3000);
}

// نظام المهام
function addTask() {
    const input = document.getElementById('task-input');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    const task = { id: Date.now(), text: text };
    const tasks = JSON.parse(localStorage.getItem('family_tasks') || '[]');
    tasks.push(task);
    localStorage.setItem('family_tasks', JSON.stringify(tasks));

    input.value = '';
    renderTasks();
    showFeedback('تمت إضافة المهمة! ✅', 'success');
}

function handleEnter(e) {
    if (e.key === 'Enter') addTask();
}

function renderTasks() {
    const list = document.getElementById('tasks-list');
    if (!list) return;
    const tasks = JSON.parse(localStorage.getItem('family_tasks') || '[]');
    list.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${task.text}</span><button onclick="deleteTask(${task.id})">❌</button>`;
        list.appendChild(li);
    });
}

function loadTasks() {
    renderTasks();
}

function deleteTask(id) {
    let tasks = JSON.parse(localStorage.getItem('family_tasks') || '[]');
    tasks = tasks.filter(t => t.id !== id);
    localStorage.setItem('family_tasks', JSON.stringify(tasks));
    renderTasks();
}
