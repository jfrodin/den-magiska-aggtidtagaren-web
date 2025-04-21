document.addEventListener("DOMContentLoaded", function () {
  const weightSlider = document.getElementById('weight');
  const weightValue = document.getElementById('weight-value');
  const timerDisplay = document.getElementById('timer-display');
  const controlBtn = document.getElementById('control-btn');

  const softnessButtons = document.querySelectorAll('#softness-selector button');
  const tempButtons = document.querySelectorAll('#temp-selector button');

  let weight = 50;
  let softness = 'soft';
  let temp = 'room';
  let totalTime = calculateTime(weight, softness, temp);
  let remainingTime = totalTime;
  let timerInterval = null;
  let hasRun = false;

  // Format mm:ss
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  // Koktidsberäkning
  function calculateTime(weight, softness, temp) {
    let base;
    switch (softness) {
      case 'soft': base = 4 * 60; break;
      case 'medium': base = 6 * 60; break;
      case 'hard': base = 9 * 60; break;
      default: base = 6 * 60;
    }
    const adjustment = weight - 50;
    const tempFactor = temp === 'fridge' ? 30 : 0;
    return base + adjustment + tempFactor;
  }

  function updateDisplay() {
    const timeToShow = timerInterval ? remainingTime : totalTime;
    timerDisplay.textContent = `Koka ägget i ${formatTime(timeToShow)}`;
  }

  function updateButtonText() {
    controlBtn.classList.remove('start-mode', 'stop-mode', 'reset-mode');

    if (timerInterval) {
      controlBtn.textContent = 'Stoppa';
      controlBtn.classList.add('stop-mode');
    } else if (hasRun) {
      controlBtn.textContent = 'Återställ';
      controlBtn.classList.add('reset-mode');
    } else {
      controlBtn.textContent = 'Starta';
      controlBtn.classList.add('start-mode');
    }
  }

  function updateUIState() {
    weightSlider.disabled = hasRun;
    softnessButtons.forEach(btn => btn.disabled = hasRun);
    tempButtons.forEach(btn => btn.disabled = hasRun);
  }

  // Event: vikt
  weightSlider.addEventListener('input', (e) => {
    weight = parseInt(e.target.value);
    weightValue.textContent = weight;
    totalTime = calculateTime(weight, softness, temp);
    updateDisplay();
  });

  // Event: kokgrad
  softnessButtons.forEach(button => {
    button.addEventListener('click', () => {
      softnessButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      softness = button.dataset.softness;
      totalTime = calculateTime(weight, softness, temp);
      updateDisplay();
    });
  });

  // Event: temperatur
  tempButtons.forEach(button => {
    button.addEventListener('click', () => {
      tempButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      temp = button.dataset.temp;
      totalTime = calculateTime(weight, softness, temp);
      updateDisplay();
    });
  });

  // Event: kontrollknapp
  controlBtn.addEventListener('click', () => {
    if (!hasRun) {
      // START
      remainingTime = totalTime;
      hasRun = true;
      timerInterval = setInterval(() => {
        remainingTime--;
        updateDisplay();
        if (remainingTime <= 0) {
          clearInterval(timerInterval);
          timerInterval = null;
          alert("🐣 Ägget är klart!");
          updateButtonText();
        }
      }, 1000);
    } else if (timerInterval) {
      // STOPPA
      clearInterval(timerInterval);
      timerInterval = null;
    } else {
      // ÅTERSTÄLL
      resetApp();
    }

    updateButtonText();
    updateUIState();
  });

  // Återställ hela appen
  function resetApp() {
    clearInterval(timerInterval);
    timerInterval = null;
    hasRun = false;
    weight = 50;
    softness = 'soft';
    temp = 'room';

    weightSlider.value = 50;
    weightValue.textContent = 50;

    softnessButtons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.softness === 'soft') btn.classList.add('active');
    });

    tempButtons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.temp === 'room') btn.classList.add('active');
    });

    totalTime = calculateTime(weight, softness, temp);
    remainingTime = totalTime;

    updateDisplay();
    updateButtonText();
    updateUIState();
  }

  // Init
  updateDisplay();
  updateButtonText();
  updateUIState();
});
