import { validateInput } from './validation.js';
import { calculatePrize } from './calculator.js';

export function initUI() {
  // Автоматический пересчёт при изменении полей
  document.querySelectorAll('input, select').forEach(element => {
    element.addEventListener('input', () => {
      if (element.tagName === 'INPUT') {
        validateInput(element);
      }
      calculatePrize();
    });
  });

  // Функция сброса формы
  function resetForm() {
    document.getElementById('league').value = 'super';
    document.getElementById('wins').value = '';
    document.getElementById('losses').value = '';
    document.getElementById('wonSets').value = '';
    document.getElementById('place').value = '1';
    document.getElementById('result').innerText = '';
    document.getElementById('error').innerText = '';
    document.getElementById('wins').classList.remove('invalid');
    document.getElementById('losses').classList.remove('invalid');
    document.getElementById('wonSets').classList.remove('invalid');
  }

  // Привязка кнопки сброса
  document.getElementById('resetButton').addEventListener('click', resetForm);

  // Регистрация сервисного worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .then((registration) => {
        console.log('ServiceWorker зарегистрирован:', registration);
      })
      .catch((error) => {
        console.log('Ошибка регистрации ServiceWorker:', error);
      });
  }
}