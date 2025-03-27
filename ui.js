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
    calculatePrize();
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .then(registration => console.log('ServiceWorker зарегистрирован:', registration))
      .catch(error => console.log('Ошибка регистрации ServiceWorker:', error));
  }

  function toggleTheme() {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    document.getElementById('themeToggle').innerText = translations[currentLang].themeToggle[isLight ? 'dark' : 'light'];
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
    const newLang = currentLang === 'ru' ? 'en' : 'ru';
    localStorage.setItem('lang', newLang);
    updateLanguage(newLang);
  }

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light');
    document.getElementById('themeToggle').innerText = translations[currentLang].themeToggle.dark;
  } else {
    document.getElementById('themeToggle').innerText = translations[currentLang].themeToggle.light;
  }
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);

  updateLanguage(currentLang);
  document.getElementById('langToggle').addEventListener('click', toggleLanguage);
}