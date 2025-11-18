// === ДАННЫЕ: Задание 11 (Н/НН) ===
const TASKS = {
  task11: {
    title: "Задание 11: Н и НН",
    questions: [
      {
        text: "Ране__ая птица",
        options: ["раненная", "раненая"],
        correct: 1,
        explanation: "Отглагольное прилагательное (без приставки и зависимых слов) → Н."
      },
      {
        text: "Запута__ый след",
        options: ["запутанный", "запутаный"],
        correct: 0,
        explanation: "Причастие прошедшего времени (приставка + зависимое слово «след») → НН."
      },
      {
        text: "Гуси__ый жир",
        options: ["гусинный", "гусиный"],
        correct: 1,
        explanation: "От существительного «гусь» → прилагательное на -ин- → Н."
      }
    ]
  }
};

// === СОСТОЯНИЕ ИГРОКА ===
let gameState = {
  xp: 0,
  level: 1,
  currentTask: null,
  questionIndex: 0,
  completed: {}
};

// Загрузка прогресса из localStorage
function loadState() {
  const saved = localStorage.getItem('slavoeed_state');
  if (saved) {
    try {
      gameState = JSON.parse(saved);
    } catch (e) {
      console.warn("Ошибка загрузки состояния", e);
    }
  }
  updateUI();
}

// Сохранение в localStorage
function saveState() {
  localStorage.setItem('slavoeed_state', JSON.stringify(gameState));
}

// Обновление XP и уровня
function addXP(amount) {
  gameState.xp += amount;
  // Упрощённый уровень: каждые 30 XP = +1 уровень
  gameState.level = Math.floor(gameState.xp / 30) + 1;
  saveState();
  updateUI();
}

function updateUI() {
  document.getElementById('xp').textContent = gameState.xp;
  document.getElementById('level').textContent = gameState.level;
}

// === НАВИГАЦИЯ ===
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function backToMenu() {
  showScreen('menu');
}

function showAbout() {
  showScreen('about');
}

// === ИГРОВОЙ ПРОЦЕСС ===
function startGame(taskId) {
  const task = TASKS[taskId];
  if (!task) return alert("Задание не найдено");

  gameState.currentTask = taskId;
  gameState.questionIndex = 0;
  showScreen('game');
  document.getElementById('topicTitle').textContent = task.title;
  renderQuestion();
}

function renderQuestion() {
  const task = TASKS[gameState.currentTask];
  const q = task.questions[gameState.questionIndex];

  document.getElementById('questionText').textContent = q.text;
  const optionsEl = document.getElementById('options');
  optionsEl.innerHTML = '';

  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.onclick = () => checkAnswer(i);
    optionsEl.appendChild(btn);
  });

  document.getElementById('feedback').textContent = '';
}

function checkAnswer(selectedIndex) {
  const task = TASKS[gameState.currentTask];
  const q = task.questions[gameState.questionIndex];
  const isCorrect = selectedIndex === q.correct;
  const options = document.querySelectorAll('#options button');
  
  // Блокируем кнопки
  options.forEach(btn => btn.disabled = true);
  
  // Подсвечиваем
  options[q.correct].classList.add('correct');
  if (!isCorrect) {
    options[selectedIndex].classList.add('incorrect');
  }

  // Обратная связь
  const feedbackEl = document.getElementById('feedback');
  if (isCorrect) {
    feedbackEl.innerHTML = `✅ Верно! +10 XP<br><small>${q.explanation}</small>`;
    feedbackEl.className = 'feedback correct';
    addXP(10);
  } else {
    feedbackEl.innerHTML = `❌ Неверно.<br>Правильно: <strong>${q.options[q.correct]}</strong><br><small>${q.explanation}</small>`;
    feedbackEl.className = 'feedback incorrect';
  }

  // Далее (автоматически через 2 сек или вручную)
  setTimeout(() => {
    gameState.questionIndex++;
    if (gameState.questionIndex < task.questions.length) {
      renderQuestion();
    } else {
      // Завершение темы
      alert(`Тема завершена! 🎉\nXP: ${gameState.xp}\nУровень: ${gameState.level}`);
      backToMenu();
    }
  }, 2000);
}

// === ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener('DOMContentLoaded', () => {
  loadState();
});
