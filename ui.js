import { validateInput } from './validation.js';
import { calculatePrize } from './calculator.js';

// Перемещаем translations и currentLang наружу
const translations = {
  ru: {
    title: 'Калькулятор призовых',
    leagueLabel: 'Выберите лигу:',
    winsLabel: 'Количество побед:',
    lossesLabel: 'Количество поражений:',
    wonSetsLabel: 'Выигранные партии в поражениях:',
    placeLabel: 'Занятое место:',
    resetButton: 'Сбросить',
    footer: 'Рассчитайте ваши призовые за турнир по настольному теннису!',
    themeToggle: { light: 'Светлая тема', dark: 'Тёмная тема' },
    langToggle: 'EN'
  },
  en: {
    title: 'Prize Calculator',
    leagueLabel: 'Select league:',
    winsLabel: 'Number of wins:',
    lossesLabel: 'Number of losses:',
    wonSetsLabel: 'Won sets in losses:',
    placeLabel: 'Place taken:',
    resetButton: 'Reset',
    footer: 'Calculate your prizes for the table tennis tournament!',
    themeToggle: { light: 'Light theme', dark: 'Dark theme' },
    langToggle: 'RU'
  }
};

let currentLang = localStorage.getItem('lang') || 'ru';

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
      themeToggle.innerText = translations[currentLang].themeToggle[isLight ? 'dark' : 'light'];
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

  function updateLanguage(lang) {
    document.querySelector('h1').innerText = translations[lang].title;
    document.querySelector('label[for="league"]').innerText = translations[lang].leagueLabel;
    document.querySelector('label[for="wins"]').innerText = translations[lang].winsLabel;
    document.querySelector('label[for="losses"]').innerText = translations[lang].lossesLabel;
    document.querySelector('label[for="wonSets"]').innerText = translations[lang].wonSetsLabel;
    document.querySelector('label[for="place"]').innerText = translations[lang].placeLabel;
    document.getElementById('resetButton').innerText = translations[lang].resetButton;
    document.querySelector('.footer p').innerText = translations[lang].footer;
    const isLight = document.body.classList.contains('light');
    document.getElementById('themeToggle').innerText = translations[lang].themeToggle[isLight ? 'dark' : 'light'];
    document.getElementById('langToggle').innerText = translations[lang].langToggle;
    currentLang = lang;
  }

  function toggleLanguage() {
    console.log('Функция toggleLanguage вызвана');
    try {
      // Сначала добавляем класс для анимации скрытия
      const container = document.querySelector('.container');
      container.style.opacity = '0.8';
      container.style.transform = 'translateY(10px)';
      
      // Через небольшую задержку меняем язык и проявляем контент
      setTimeout(() => {
        const newLang = currentLang === 'ru' ? 'en' : 'ru';
        console.log('Язык меняется с', currentLang, 'на', newLang);
        localStorage.setItem('lang', newLang);
        updateLanguage(newLang);
        
        // Возвращаем контейнер в исходное состояние с анимацией
        requestAnimationFrame(() => {
          container.style.opacity = '1';
          container.style.transform = 'translateY(0)';
          console.log('Анимация перехода языка завершена');
        });
      }, 150);
    } catch (error) {
      console.error('Ошибка при переключении языка:', error);
    }
  }

  // Инициализация темы и языка
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light');
    document.getElementById('themeToggle').innerText = translations[currentLang].themeToggle.dark;
  } else {
    document.getElementById('themeToggle').innerText = translations[currentLang].themeToggle.light;
  }
  
  // Обновляем язык интерфейса
  updateLanguage(currentLang);
  
  // Устанавливаем обработчики событий для кнопок
  setupThemeAndLanguageButtons();
  
  // Добавляем эффект волны для кнопок
  addRippleEffect();
  
  // Обеспечиваем плавное появление контента при загрузке
  document.querySelector('.container').style.opacity = '1';
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

// Прямое назначение обработчиков событий для кнопок
function setupThemeAndLanguageButtons() {
  console.log('Устанавливаем обработчики для кнопок темы и языка');
  
  const themeButton = document.getElementById('themeToggle');
  const langButton = document.getElementById('langToggle');
  
  if (themeButton) {
    console.log('Найдена кнопка темы:', themeButton);
    themeButton.onclick = function(e) {
      console.log('Нажата кнопка темы');
      toggleTheme();
      e.preventDefault(); // Предотвращаем стандартное поведение
      return false;
    };
  } else {
    console.error('Не найдена кнопка переключения темы!');
  }
  
  if (langButton) {
    console.log('Найдена кнопка языка:', langButton);
    langButton.onclick = function(e) {
      console.log('Нажата кнопка языка');
      toggleLanguage();
      e.preventDefault(); // Предотвращаем стандартное поведение
      return false;
    };
  } else {
    console.error('Не найдена кнопка переключения языка!');
  }
}