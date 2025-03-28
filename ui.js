import { validateInput } from './validation.js';
import { calculatePrize } from './calculator.js';

// Тексты интерфейса
const translations = {
    title: 'Калькулятор призовых',
    leagueLabel: 'Выберите лигу:',
    winsLabel: 'Количество побед:',
    lossesLabel: 'Количество поражений:',
    wonSetsLabel: 'Выигранные партии в поражениях:',
    placeLabel: 'Занятое место:',
    resetButton: 'Сбросить',
    footer: 'Рассчитайте ваши призовые за турнир по настольному теннису!',
    themeToggle: { light: 'Светлая тема', dark: 'Тёмная тема' },
  history: {
    title: 'История расчетов',
    filterDate: 'Фильтр по дате:',
    filterLeague: 'Фильтр по лиге:',
    clearHistory: 'Очистить историю',
    noRecords: 'Нет сохраненных расчетов',
    showHistory: 'История',
    hideHistory: 'Скрыть историю',
    dateLabel: 'Дата',
    leagueLabel: 'Лига',
    resultLabel: 'Результат',
    detailsLabel: 'Детали',
    saveToHistory: 'Сохранить в историю',
    deleteDay: 'Удалить все расчеты за этот день'
  }
};

// Временное хранилище для текущего расчета
let currentCalculation = null;

// Структура для хранения истории расчетов
let calculationHistory = [];

// Функция для сохранения истории в localStorage
function saveHistory() {
  localStorage.setItem('calculationHistory', JSON.stringify(calculationHistory));
}

// Функция для загрузки истории из localStorage
function loadHistory() {
  const savedHistory = localStorage.getItem('calculationHistory');
  if (savedHistory) {
    calculationHistory = JSON.parse(savedHistory);
  }
}

// Функция для создания кнопки сохранения в историю
function createSaveToHistoryButton() {
  // Проверяем, существует ли уже кнопка
  let saveButton = document.getElementById('saveToHistoryButton');
  
  if (!saveButton) {
    saveButton = document.createElement('button');
    saveButton.id = 'saveToHistoryButton';
    saveButton.innerText = translations.history.saveToHistory;
    saveButton.className = 'save-history-button';
    saveButton.style.display = 'none'; // По умолчанию скрыта
    
    saveButton.addEventListener('click', () => {
      if (currentCalculation) {
        addToHistory(currentCalculation.data, currentCalculation.text);
        // Показываем уведомление о сохранении
        showNotification('Расчет сохранен в историю');
      }
    });
    
    // Вставляем кнопку после блока с результатом
    const resultElement = document.getElementById('result');
    if (resultElement) {
      resultElement.after(saveButton);
    }
  }
  
  return saveButton;
}

// Функция для отображения временного уведомления
function showNotification(message) {
  // Проверяем, существует ли контейнер для уведомлений
  let notificationContainer = document.getElementById('notificationContainer');
  
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.id = 'notificationContainer';
    notificationContainer.className = 'notification-container';
    document.body.appendChild(notificationContainer);
  }
  
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.innerText = message;
  
  notificationContainer.appendChild(notification);
  
  // Анимация появления
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
  }, 10);
  
  // Автоматическое скрытие через 3 секунды
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(-10px)';
    
    // Удаление элемента после анимации
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Добавление нового расчета в историю
export function addToHistory(data, result) {
  const historyEntry = {
    id: Date.now(),
    date: new Date().toLocaleString(),
    league: data.league,
    wins: data.wins,
    losses: data.losses,
    wonSets: data.wonSets,
    place: data.place,
    result: result,
    details: `Победы: ${data.wins}, Поражения: ${data.losses}, Выигр. партии: ${data.wonSets}, Место: ${data.place}`
  };
  
  calculationHistory.unshift(historyEntry); // Добавляем в начало массива
  
  // Ограничиваем количество записей до 50
  if (calculationHistory.length > 50) {
    calculationHistory.pop();
  }
  
  saveHistory();
  updateHistoryUI();
}

// Функция для очистки истории
function clearHistory() {
  if (confirm('Вы уверены, что хотите удалить всю историю расчетов?')) {
    calculationHistory = [];
    saveHistory();
    updateHistoryUI();
    showNotification('Вся история расчетов удалена');
  }
}

// Функция для удаления отдельной записи
function deleteHistoryItem(id) {
  calculationHistory = calculationHistory.filter(item => item.id !== id);
  saveHistory();
  updateHistoryUI();
  showNotification('Запись удалена из истории');
}

// Функция для удаления записей за определенную дату
function deleteDayHistory(dateStr) {
  // Преобразуем строку даты в объект Date и устанавливаем время на начало дня
  const targetDate = new Date(dateStr);
  targetDate.setHours(0, 0, 0, 0);
  
  // Фильтруем историю, оставляя только записи не из выбранного дня
  calculationHistory = calculationHistory.filter(item => {
    const itemDate = new Date(item.date.split(',')[0]);
    itemDate.setHours(0, 0, 0, 0);
    return itemDate.getTime() !== targetDate.getTime();
  });
  
  saveHistory();
  updateHistoryUI();
  
  // Показываем уведомление
  showNotification(`Расчеты за ${dateStr} удалены`);
}

// Функция для получения уникальных дат из истории
function getUniqueDates() {
  const dates = calculationHistory.map(item => {
    const datePart = item.date.split(',')[0];
    return datePart.trim();
  });
  
  // Возвращаем уникальные даты
  return [...new Set(dates)].sort((a, b) => new Date(b) - new Date(a));
}

// Функция для отображения истории с фильтрами
function updateHistoryUI() {
  const historyContainer = document.getElementById('historyContainer');
  if (!historyContainer) return;
  
  const dateFilter = document.getElementById('historyDateFilter').value;
  const leagueFilter = document.getElementById('historyLeagueFilter').value;
  
  const historyList = document.getElementById('historyList');
  historyList.innerHTML = '';
  
  // Применяем фильтры
  let filteredHistory = calculationHistory;
  
  if (dateFilter) {
    const filterDate = new Date(dateFilter).setHours(0, 0, 0, 0);
    filteredHistory = filteredHistory.filter(item => {
      const itemDate = new Date(item.date.split(',')[0]).setHours(0, 0, 0, 0);
      return itemDate === filterDate;
    });
  }
  
  if (leagueFilter !== 'all') {
    filteredHistory = filteredHistory.filter(item => item.league === leagueFilter);
  }
  
  if (filteredHistory.length === 0) {
    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'history-empty';
    emptyMessage.innerText = translations.history.noRecords;
    historyList.appendChild(emptyMessage);
  } else {
    // Создаем карточки для истории
    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'history-cards';
    
    filteredHistory.forEach(item => {
      const card = document.createElement('div');
      card.className = 'history-card';
      card.dataset.id = item.id;
      
      // Добавляем кнопку удаления
      const deleteButton = document.createElement('button');
      deleteButton.className = 'delete-item-button';
      deleteButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
      deleteButton.title = 'Удалить запись';
      
      deleteButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Предотвращаем всплытие события клика
        if (confirm('Вы уверены, что хотите удалить эту запись?')) {
          deleteHistoryItem(parseInt(card.dataset.id));
        }
      });
      
      // Заголовок карточки с датой и лигой
      const cardHeader = document.createElement('div');
      cardHeader.className = 'card-header';
      
      const dateSpan = document.createElement('span');
      dateSpan.className = 'card-date';
      dateSpan.innerText = item.date;
      
      const leagueSpan = document.createElement('span');
      leagueSpan.className = 'card-league';
      const leagueNames = {
        'super': 'Супер лига',
        'a': 'А лига',
        'b': 'Б лига',
        'c': 'С лига'
      };
      leagueSpan.innerText = leagueNames[item.league] || item.league;
      
      cardHeader.appendChild(dateSpan);
      cardHeader.appendChild(leagueSpan);
      
      // Результат расчета
      const resultDiv = document.createElement('div');
      resultDiv.className = 'card-result';
      resultDiv.innerText = item.result;
      
      // Детали расчета
      const detailsDiv = document.createElement('div');
      detailsDiv.className = 'card-details';
      detailsDiv.innerText = item.details;
      
      // Добавляем все элементы в карточку
      card.appendChild(deleteButton);
      card.appendChild(cardHeader);
      card.appendChild(resultDiv);
      card.appendChild(detailsDiv);
      
      // Добавляем возможность восстановить расчет по клику на карточку
      card.addEventListener('click', () => {
        document.getElementById('league').value = item.league;
        document.getElementById('wins').value = item.wins;
        document.getElementById('losses').value = item.losses;
        document.getElementById('wonSets').value = item.wonSets;
        document.getElementById('place').value = item.place;
        
        // Скроллим к форме
        document.querySelector('h1').scrollIntoView({ behavior: 'smooth' });
        
        // Выполняем расчет
        calculatePrize();
      });
      
      cardsContainer.appendChild(card);
    });
    
    historyList.appendChild(cardsContainer);
  }
  
  // Обновляем счетчик записей
  const historyCount = document.getElementById('historyCount');
  if (historyCount) {
    historyCount.innerText = calculationHistory.length;
  }
}

// Функция для обновления выпадающего списка дат для удаления
function updateDeleteDaySelector() {
  const deleteDaySelector = document.getElementById('deleteDaySelector');
  if (!deleteDaySelector) return;
  
  // Сохраняем текущее выбранное значение
  const currentValue = deleteDaySelector.value;
  
  // Очищаем список
  deleteDaySelector.innerHTML = '';
  
  // Добавляем пустой пункт
  const emptyOption = document.createElement('option');
  emptyOption.value = '';
  emptyOption.innerText = 'Выберите дату для удаления...';
  deleteDaySelector.appendChild(emptyOption);
  
  // Получаем уникальные даты
  const uniqueDates = getUniqueDates();
  
  // Если нет дат, делаем селектор неактивным
  if (uniqueDates.length === 0) {
    deleteDaySelector.disabled = true;
    return;
  }
  
  // Иначе добавляем опции и делаем активным
  deleteDaySelector.disabled = false;
  
  uniqueDates.forEach(date => {
    const option = document.createElement('option');
    option.value = date;
    option.innerText = date;
    deleteDaySelector.appendChild(option);
  });
  
  // Восстанавливаем выбранное значение, если оно есть в новом списке
  if (currentValue && uniqueDates.includes(currentValue)) {
    deleteDaySelector.value = currentValue;
  } else {
    deleteDaySelector.value = '';
  }
}

function toggleTheme() {
  console.log('Функция toggleTheme вызвана');
  try {
    // Добавляем класс для плавного перехода
    document.body.classList.add('theme-transition');
    
    // Переключаем тему
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    console.log('Тема переключена на:', isLight ? 'светлую' : 'темную');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    
    // Обновляем текст кнопки
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.innerText = translations.themeToggle[isLight ? 'dark' : 'light'];
    console.log('Текст кнопки установлен:', themeToggle.innerText);
    
    // Применяем анимацию для контейнера
    const container = document.querySelector('.container');
    container.style.transform = 'scale(0.98)';
    
    // Через небольшую задержку возвращаем в исходное состояние
    setTimeout(() => {
      container.style.transform = 'scale(1)';
      // Убираем класс перехода после завершения анимации
      setTimeout(() => {
        document.body.classList.remove('theme-transition');
        console.log('Анимация перехода темы завершена');
      }, 500);
    }, 50);
  } catch (error) {
    console.error('Ошибка при переключении темы:', error);
  }
}

// Функция для создания UI истории расчетов
function createHistoryUI() {
  // Проверяем, существует ли уже контейнер истории
  let historyContainer = document.getElementById('historyContainer');
  
  if (!historyContainer) {
    // Создаем контейнер для истории
    historyContainer = document.createElement('div');
    historyContainer.id = 'historyContainer';
    historyContainer.className = 'history-container';
    historyContainer.style.display = 'none'; // Изначально скрыт
    
    // Заголовок с количеством записей
    const historyHeaderContainer = document.createElement('div');
    historyHeaderContainer.className = 'history-header-container';
    
    const historyHeader = document.createElement('h2');
    historyHeader.innerText = translations.history.title;
    
    const historyCountBadge = document.createElement('span');
    historyCountBadge.className = 'history-count-badge';
    historyCountBadge.id = 'historyCount';
    historyCountBadge.innerText = '0';
    
    historyHeaderContainer.appendChild(historyHeader);
    historyHeaderContainer.appendChild(historyCountBadge);
    
    historyContainer.appendChild(historyHeaderContainer);
    
    // Фильтры
    const filtersContainer = document.createElement('div');
    filtersContainer.className = 'history-filters';
    
    // Фильтр по дате
    const dateFilterLabel = document.createElement('label');
    dateFilterLabel.innerText = translations.history.filterDate;
    dateFilterLabel.htmlFor = 'historyDateFilter';
    
    const dateFilter = document.createElement('input');
    dateFilter.type = 'date';
    dateFilter.id = 'historyDateFilter';
    dateFilter.addEventListener('change', updateHistoryUI);
    
    // Фильтр по лиге
    const leagueFilterLabel = document.createElement('label');
    leagueFilterLabel.innerText = translations.history.filterLeague;
    leagueFilterLabel.htmlFor = 'historyLeagueFilter';
    
    const leagueFilter = document.createElement('select');
    leagueFilter.id = 'historyLeagueFilter';
    
    const leagueOptions = [
      { value: 'all', text: 'Все лиги' },
      { value: 'super', text: 'Супер лига' },
      { value: 'a', text: 'А лига' },
      { value: 'b', text: 'Б лига' },
      { value: 'c', text: 'С лига' }
    ];
    
    leagueOptions.forEach(option => {
      const optEl = document.createElement('option');
      optEl.value = option.value;
      optEl.innerText = option.text;
      leagueFilter.appendChild(optEl);
    });
    
    leagueFilter.addEventListener('change', updateHistoryUI);
    
    // Кнопка очистки истории
    const clearButton = document.createElement('button');
    clearButton.innerText = translations.history.clearHistory;
    clearButton.className = 'clear-history-button';
    clearButton.addEventListener('click', clearHistory);
    
    // Добавляем фильтры в контейнер
    filtersContainer.appendChild(dateFilterLabel);
    filtersContainer.appendChild(dateFilter);
    filtersContainer.appendChild(leagueFilterLabel);
    filtersContainer.appendChild(leagueFilter);
    filtersContainer.appendChild(clearButton);
    
    historyContainer.appendChild(filtersContainer);
    
    // Контейнер для списка истории
    const historyList = document.createElement('div');
    historyList.id = 'historyList';
    historyList.className = 'history-list';
    
    historyContainer.appendChild(historyList);
    
    // Добавляем в DOM после основного контейнера
    document.querySelector('.container').after(historyContainer);
    
    // Создаем кнопку для переключения отображения истории
    const toggleHistoryButton = document.createElement('button');
    toggleHistoryButton.id = 'toggleHistoryButton';
    toggleHistoryButton.innerText = translations.history.showHistory;
    toggleHistoryButton.className = 'toggle-history-button';
    
    toggleHistoryButton.addEventListener('click', () => {
      const isVisible = historyContainer.style.display !== 'none';
      historyContainer.style.display = isVisible ? 'none' : 'block';
      toggleHistoryButton.innerText = isVisible ? 
        translations.history.showHistory : 
        translations.history.hideHistory;
      
      if (!isVisible) {
        updateHistoryUI();
        // Плавно скроллим к истории
        historyContainer.scrollIntoView({ behavior: 'smooth' });
      }
    });
    
    // Добавляем кнопку в нижнюю часть основного контейнера
    const footer = document.querySelector('.footer');
    footer.before(toggleHistoryButton);
  }
}

export function initUI() {
  // Определение мобильного устройства
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  console.log('Мобильное устройство:', isMobile);
  
  // Настройка для мобильных устройств
  if (isMobile) {
    // Обработчик изменения ориентации
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Улучшаем отклик на сенсорных устройствах
    document.querySelectorAll('button').forEach(button => {
      button.addEventListener('touchstart', () => {
        button.style.opacity = '0.8';
      }, { passive: true });
      
      button.addEventListener('touchend', () => {
        button.style.opacity = '1';
      }, { passive: true });
    });
  }
  
  function handleResize() {
    // Подстраиваем высоту контейнера под экран
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  // Обработчики для input элементов
  document.querySelectorAll('input').forEach(element => {
    element.addEventListener('input', () => {
      validateInput(element);
      calculatePrize();
    });
  });

  // Добавим отдельные обработчики для select
  document.querySelectorAll('select').forEach(element => {
    element.addEventListener('change', () => {
      calculatePrize();
    });
  });

  function resetForm() {
    document.getElementById('league').value = 'super';
    document.getElementById('wins').value = '';
    document.getElementById('losses').value = '';
    document.getElementById('wonSets').value = '';
    document.getElementById('place').value = '1';
    const resultElement = document.getElementById('result');
    resultElement.classList.remove('visible');
    document.getElementById('error').innerText = '';
    document.getElementById('wins').classList.remove('invalid');
    document.getElementById('losses').classList.remove('invalid');
    document.getElementById('wonSets').classList.remove('invalid');
    
    // Скрываем кнопку сохранения в историю
    const saveButton = document.getElementById('saveToHistoryButton');
    if (saveButton) {
      saveButton.style.display = 'none';
    }
    
    // Обнуляем текущий расчет
    currentCalculation = null;
    
    calculatePrize();
  }

  document.getElementById('resetButton').addEventListener('click', resetForm);

  // Обработчик для кнопки расчета
  document.getElementById('calculateButton').addEventListener('click', () => {
    console.log('Расчет начат...');
    try {
      calculatePrize();
      console.log('Расчет успешно завершен');
    } catch (error) {
      console.error('Ошибка при расчете:', error);
      document.getElementById('error').innerText = "Произошла ошибка при расчете. Попробуйте обновить страницу.";
    }
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .then(registration => console.log('ServiceWorker зарегистрирован:', registration))
      .catch(error => console.log('Ошибка регистрации ServiceWorker:', error));
  }

  // Инициализация темы
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light');
    document.getElementById('themeToggle').innerText = translations.themeToggle.dark;
  } else {
    document.getElementById('themeToggle').innerText = translations.themeToggle.light;
  }
  
  // Загружаем историю расчетов
  loadHistory();
  
  // Создаем UI для истории и кнопку сохранения
  createHistoryUI();
  createSaveToHistoryButton();
  
  // Устанавливаем обработчики событий для кнопок
  setupThemeButton();
  
  // Обновляем тексты интерфейса
  updateUITexts();
  
  // Добавляем эффект волны для кнопок
  addRippleEffect();
  
  // Обеспечиваем плавное появление контента при загрузке
  document.querySelector('.container').style.opacity = '1';
}

// Обновление текстов интерфейса
function updateUITexts() {
  try {
    document.querySelector('h1').innerText = translations.title;
    document.querySelector('label[for="league"]').innerText = translations.leagueLabel;
    document.querySelector('label[for="wins"]').innerText = translations.winsLabel;
    document.querySelector('label[for="losses"]').innerText = translations.lossesLabel;
    document.querySelector('label[for="wonSets"]').innerText = translations.wonSetsLabel;
    document.querySelector('label[for="place"]').innerText = translations.placeLabel;
    document.getElementById('resetButton').innerText = translations.resetButton;
    document.querySelector('.footer p').innerText = translations.footer;
    
    const isLight = document.body.classList.contains('light');
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.innerText = translations.themeToggle[isLight ? 'dark' : 'light'];
  } catch (error) {
    console.error('Ошибка при обновлении текстов интерфейса:', error);
  }
}

// Улучшенный эффект нажатия кнопок с эффектом волны
function addRippleEffect() {
  const buttons = document.querySelectorAll('button');
  
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const circle = document.createElement('span');
      circle.classList.add('ripple-effect');
      circle.style.top = y + 'px';
      circle.style.left = x + 'px';
      
      button.appendChild(circle);
      
      setTimeout(() => {
        circle.remove();
      }, 600);
    });
  });
}

// Плавная анимация результата
export function showResult(text, data) {
  const resultElement = document.getElementById('result');
  
  // Сначала скрываем результат
  resultElement.style.opacity = '0';
  resultElement.style.transform = 'translateY(20px)';
  
  // Устанавливаем текст
  resultElement.innerText = text;
  
  // Затем показываем с анимацией
  requestAnimationFrame(() => {
    resultElement.classList.add('visible');
  });
  
  // Сохраняем текущий расчет для возможного добавления в историю
  if (data) {
    currentCalculation = { data, text };
    
    // Показываем кнопку сохранения в историю
    const saveButton = document.getElementById('saveToHistoryButton');
    if (saveButton) {
      saveButton.style.display = 'block';
    }
  }
}

// Настройка кнопки переключения темы
function setupThemeButton() {
  console.log('Устанавливаем обработчик для кнопки темы');
  
  const themeButton = document.getElementById('themeToggle');
  
  if (themeButton) {
    console.log('Найдена кнопка темы:', themeButton);
    themeButton.addEventListener('click', function(e) {
      console.log('Нажата кнопка темы');
      toggleTheme();
    });
  } else {
    console.error('Не найдена кнопка переключения темы!');
  }
}