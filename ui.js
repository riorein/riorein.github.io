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
  themeToggle: { light: 'Светлая тема', dark: 'Тёмная тема' }
};

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
export function showResult(text) {
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