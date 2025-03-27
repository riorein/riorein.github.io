import { showResult } from './ui.js';

function showError(message) {
  const errorEl = document.getElementById('error');
  
  // Скрываем старую ошибку
  errorEl.style.opacity = '0';
  errorEl.style.transform = 'translateY(10px)';
  
  // Устанавливаем новый текст
  errorEl.innerText = message;
  
  // Показываем с анимацией
  requestAnimationFrame(() => {
    errorEl.style.opacity = '1';
    errorEl.style.transform = 'translateY(0)';
  });
}

export function calculatePrize() {
  console.log('Функция calculatePrize вызвана');
  
  // Проверяем существование элементов
  const leagueEl = document.getElementById('league');
  const winsEl = document.getElementById('wins');
  const lossesEl = document.getElementById('losses');
  const wonSetsEl = document.getElementById('wonSets');
  const placeEl = document.getElementById('place');
  const resultEl = document.getElementById('result');
  const errorEl = document.getElementById('error');
  
  if (!leagueEl || !winsEl || !lossesEl || !wonSetsEl || !placeEl || !resultEl || !errorEl) {
    console.error('Не все DOM элементы найдены', {
      league: !!leagueEl,
      wins: !!winsEl,
      losses: !!lossesEl,
      wonSets: !!wonSetsEl,
      place: !!placeEl,
      result: !!resultEl,
      error: !!errorEl
    });
    return;
  }
  
  const league = leagueEl.value;
  const wins = parseInt(winsEl.value) || 0;
  const losses = parseInt(lossesEl.value) || 0;
  const wonSets = parseInt(wonSetsEl.value) || 0;
  const place = placeEl.value;
  
  console.log('Данные для расчета:', { league, wins, losses, wonSets, place });

  // Очищаем предыдущие сообщения
  errorEl.innerText = "";
  resultEl.innerText = "";
  winsEl.classList.remove('invalid');
  lossesEl.classList.remove('invalid');
  wonSetsEl.classList.remove('invalid');

  // Если поля пустые, не выводим ни ошибку, ни результат
  if (winsEl.value === '' && lossesEl.value === '' && wonSetsEl.value === '') {
    return;
  }
  
  if (wins === 0 && losses === 0 && wonSets === 0) {
    showError("Ошибка: введите данные для расчета.");
    return;
  }

  if (wins === 5 && (place === "2" || place === "3" || place === "4")) {
    showError("Ошибка: при 5 победах нельзя занять 2, 3 или 4 место.");
    winsEl.classList.add('invalid');
    return;
  }

  if (losses === 5 && (place === "1" || place === "2" || place === "3")) {
    showError("Ошибка: при 5 поражениях нельзя занять 1, 2 или 3 место.");
    lossesEl.classList.add('invalid');
    return;
  }

  if (wins > 0 || losses === 5) {
    if (wins + losses > 5) {
      showError("Ошибка: за турнир можно сыграть не более 5 игр.");
      winsEl.classList.add('invalid');
      lossesEl.classList.add('invalid');
      return;
    }

    const maxWonSets = losses * 3;
    if (wonSets > maxWonSets) {
      showError(`Ошибка: количество выигранных партий не может превышать ${maxWonSets} (3 партии за каждое поражение).`);
      wonSetsEl.classList.add('invalid');
      return;
    }

    const leagueRates = {
      super: { win: 1800, loss: 400, wonSet: 300, participation: 500 },
      a: { win: 1500, loss: 400, wonSet: 200 },
      b: { win: 1100, loss: 200, wonSet: 150 },
      c: { win: 800, loss: 100, wonSet: 100 }
    };

    const placePrizes = { 1: 1000, 2: 600, 3: 400, 4: 0 };

    const winPrize = wins * leagueRates[league].win;
    const lossPrize = losses * leagueRates[league].loss;
    const wonSetsPrize = wonSets * leagueRates[league].wonSet;
    const placePrize = placePrizes[place];
    const participationPrize = league === 'super' ? leagueRates[league].participation : 0;
    const totalPrize = winPrize + lossPrize + wonSetsPrize + placePrize + participationPrize;

    console.log('Расчет призовых:', {
      winPrize, lossPrize, wonSetsPrize, placePrize, participationPrize, totalPrize
    });

    // Используем функцию showResult для анимированного отображения
    showResult(`Ваши призовые: ${totalPrize.toFixed(2)} рублей`);
    
    // Добавляем класс visible для анимации
    setTimeout(() => {
      resultEl.classList.add('visible');
    }, 50);
    
    console.log('Результат установлен:', resultEl.innerText);
  } else {
    showError("Ошибка: для расчета должна быть хотя бы одна победа или 5 поражений.");
    console.log('Выведена ошибка:', errorEl.innerText);
  }
}