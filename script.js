(() => {
  const timeDisplay = document.getElementById('time-display');
  const toggleBtn = document.getElementById('toggle-btn');

  const MAX_SECONDS = 99 * 3600 + 59 * 60 + 59; // 99:59:59
  const TICK_INTERVAL_MS = 200;

  const RUNNING_BUTTON_CLASSES = ['bg-rose-500', 'hover:bg-rose-600', 'active:bg-rose-700'];
  const STOPPED_BUTTON_CLASSES = ['bg-emerald-500', 'hover:bg-emerald-600', 'active:bg-emerald-700'];

  let state = 'STOPPED'; // 'STOPPED' | 'RUNNING'
  let startTimestamp = null;
  let intervalId = null;

  function formatTime(totalSeconds) {
    const pad = (n) => String(n).padStart(2, '0');
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  function updateDisplay(totalSeconds) {
    timeDisplay.textContent = formatTime(totalSeconds);
  }

  function setButtonRunning(isRunning) {
    toggleBtn.textContent = isRunning ? 'STOP' : 'START';
    toggleBtn.classList.remove(...(isRunning ? STOPPED_BUTTON_CLASSES : RUNNING_BUTTON_CLASSES));
    toggleBtn.classList.add(...(isRunning ? RUNNING_BUTTON_CLASSES : STOPPED_BUTTON_CLASSES));
  }

  function elapsedSeconds() {
    return Math.min(Math.floor((Date.now() - startTimestamp) / 1000), MAX_SECONDS);
  }

  function tick() {
    const seconds = elapsedSeconds();
    updateDisplay(seconds);
    if (seconds >= MAX_SECONDS) {
      stopTimer();
    }
  }

  function startTimer() {
    state = 'RUNNING';
    startTimestamp = Date.now();
    updateDisplay(0);
    setButtonRunning(true);
    intervalId = setInterval(tick, TICK_INTERVAL_MS);
  }

  function stopTimer() {
    clearInterval(intervalId);
    intervalId = null;
    state = 'STOPPED';
    updateDisplay(elapsedSeconds());
    setButtonRunning(false);
  }

  toggleBtn.addEventListener('click', () => {
    if (state === 'STOPPED') {
      startTimer();
    } else {
      stopTimer();
    }
  });

  updateDisplay(0);
  setButtonRunning(false);
})();
