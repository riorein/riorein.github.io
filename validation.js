export function validateInput(input) {
  const winsInput = document.getElementById('wins');
  const lossesInput = document.getElementById('losses');
  const wonSetsInput = document.getElementById('wonSets');
  let value = input.value;

  // Удаляем всё, кроме цифр
  value = value.replace(/[^0-9]/g, '');
  input.value = value;

  // Проверка на отрицательные значения
  if (value !== '' && parseInt(value) < 0) {
    input.value = '0';
    document.getElementById('error').innerText = "Ошибка: значения не могут быть отрицательными.";
    input.classList.add('invalid');
    return false;
  }

  // Ограничение для wins и losses до 5
  if (input.id === 'wins' || input.id === 'losses') {
    if (value !== '' && parseInt(value) > 5) {
      input.value = '5';
      document.getElementById('error').innerText = "Ошибка: максимум 5 побед или поражений.";
      input.classList.add('invalid');
      return false;
    }
  }

  // Ограничение для wonSets до 15
  if (input.id === 'wonSets') {
    if (value !== '' && parseInt(value) > 15) {
      input.value = '15';
      document.getElementById('error').innerText = "Ошибка: максимум 15 выигранных партий.";
      input.classList.add('invalid');
      return false;
    }
  }

  if (value !== input.value) {
    document.getElementById('error').innerText = "Пожалуйста, вводите только цифры.";
    input.classList.add('invalid');
    return false;
  }

  input.classList.remove('invalid');
  document.getElementById('error').innerText = "";
  return true;
}