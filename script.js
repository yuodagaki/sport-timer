(() => {
  const appBody = document.getElementById('app-body');
  const timeDisplay = document.getElementById('time-display');

  const MAX_SECONDS = 99 * 3600 + 59 * 60 + 59; // 99:59:59
  const TICK_INTERVAL_MS = 200;

  const RUNNING_BG_CLASS = 'bg-rose-500';
  const STOPPED_BG_CLASS = 'bg-emerald-500';

  const REFERENCE_FONT_SIZE_PX = 100;
  const WIDTH_MARGIN_RATIO = 0.92;
  const HEIGHT_MARGIN_RATIO = 0.85;

  let state = 'STOPPED'; // 'STOPPED' | 'RUNNING'
  let startTimestamp = null;
  let intervalId = null;

  function fitTimeDisplayToWindow() {
    timeDisplay.style.fontSize = `${REFERENCE_FONT_SIZE_PX}px`;
    const { width, height } = timeDisplay.getBoundingClientRect();
    const maxWidth = window.innerWidth * WIDTH_MARGIN_RATIO;
    const maxHeight = window.innerHeight * HEIGHT_MARGIN_RATIO;
    const scale = Math.min(maxWidth / width, maxHeight / height);
    timeDisplay.style.fontSize = `${REFERENCE_FONT_SIZE_PX * scale}px`;
  }

  window.addEventListener('resize', fitTimeDisplayToWindow);

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

  function setBackgroundRunning(isRunning) {
    appBody.classList.remove(isRunning ? STOPPED_BG_CLASS : RUNNING_BG_CLASS);
    appBody.classList.add(isRunning ? RUNNING_BG_CLASS : STOPPED_BG_CLASS);
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
    setBackgroundRunning(true);
    intervalId = setInterval(tick, TICK_INTERVAL_MS);
  }

  function stopTimer() {
    clearInterval(intervalId);
    intervalId = null;
    state = 'STOPPED';
    updateDisplay(elapsedSeconds());
    setBackgroundRunning(false);
  }

  appBody.addEventListener('click', () => {
    if (state === 'STOPPED') {
      startTimer();
    } else {
      stopTimer();
    }
  });

  updateDisplay(0);
  setBackgroundRunning(false);
  fitTimeDisplayToWindow();
})();
