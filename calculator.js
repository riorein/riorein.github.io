export function calculatePrize() {
  const league = document.getElementById('league').value;
  const wins = parseInt(document.getElementById('wins').value) || 0;
  const losses = parseInt(document.getElementById('losses').value) || 0;
  const wonSets = parseInt(document.getElementById('wonSets').value) || 0;
  const place = document.getElementById('place').value;

  const winsInput = document.getElementById('wins');
  const lossesInput = document.getElementById('losses');
  const wonSetsInput = document.getElementById('wonSets');

  document.getElementById('error').innerText = "";
  document.getElementById('result').innerText = "";
  winsInput.classList.remove('invalid');
  lossesInput.classList.remove('invalid');
  wonSetsInput.classList.remove('invalid');

  if (wins === 0 && losses === 0 && wonSets === 0) {
    document.getElementById('error').innerText = "Ошибка: введите данные для расчета.";
    return;
  }

  if (wins === 5 && (place === "2" || place === "3" || place === "4")) {
    document.getElementById('error').innerText = "Ошибка: при 5 победах нельзя занять 2, 3 или 4 место.";
    winsInput.classList.add('invalid');
    return;
  }

  if (losses === 5 && (place === "1" || place === "2" || place === "3")) {
    document.getElementById('error').innerText = "Ошибка: при 5 поражениях нельзя занять 1, 2 или 3 место.";
    lossesInput.classList.add('invalid');
    return;
  }

  if (wins > 0 || losses === 5) {
    if (wins + losses > 5) {
      document.getElementById('error').innerText = "Ошибка: за турнир можно сыграть не более 5 игр.";
      winsInput.classList.add('invalid');
      lossesInput.classList.add('invalid');
      return;
    }

    const maxWonSets = losses * 3;
    if (wonSets > maxWonSets) {
      document.getElementById('error').innerText = `Ошибка: количество выигранных партий не может превышать ${maxWonSets} (3 партии за каждое поражение).`;
      wonSetsInput.classList.add('invalid');
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

    const resultElement = document.getElementById('result');
    resultElement.innerText = `Ваши призовые: ${totalPrize.toFixed(2)} рублей`;
    resultElement.classList.remove('visible');
    setTimeout(() => resultElement.classList.add('visible'), 10);
  } else {
    document.getElementById('error').innerText = "Ошибка: для расчета должна быть хотя бы одна победа или 5 поражений.";
  }
}