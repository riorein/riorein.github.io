import { validateInput } from './validation.js';
import { calculatePrize } from './calculator.js';

export function initUI() {
  document.querySelectorAll('input, select').forEach(element => {
    element.addEventListener('input', () => {
      if (element.tagName === 'INPUT') validateInput(element);
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
  // ... остальной код без изменений ...
}
console.log('Adding reset listener');
  document.getElementById('resetButton').addEventListener('click', resetForm);
}
  // Привязка кнопки сброса
  document.getElementById('resetButton').addEventListener('click', resetForm);

  // Регистрация сервисного worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .then(registration => console.log('ServiceWorker зарегистрирован:', registration))
      .catch(error => console.log('Ошибка регистрации ServiceWorker:', error));
  }

  // Функция переключения тем
  function toggleTheme() {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    document.getElementById('themeToggle').innerText = translations[currentLang].themeToggle[isLight ? 'dark' : 'light'];
  }

  // Словарь переводов
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

  // Функция обновления текстов
  let currentLang = localStorage.getItem('lang') || 'ru';
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

  // Функция переключения языка
  function toggleLanguage() {
    const newLang = currentLang === 'ru' ? 'en' : 'ru';
    localStorage.setItem('lang', newLang);
    updateLanguage(newLang);
  }

  // Инициализация тем
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light');
    document.getElementById('themeToggle').innerText = translations[currentLang].themeToggle.dark;
  } else {
    document.getElementById('themeToggle').innerText = translations[currentLang].themeToggle.light;
  }
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);

  // Инициализация языка
  updateLanguage(currentLang);
  document.getElementById('langToggle').addEventListener('click', toggleLanguage);
} // Закрывающая скобка функции initUI