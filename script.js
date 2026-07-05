(() => {
  const appBody = document.getElementById('app-body');
  const timeContainer = document.getElementById('time-container');
  const timeDisplay = document.getElementById('time-display');
  const historyContainer = document.getElementById('history-container');
  const historyList = document.getElementById('history-list');

  const MAX_SECONDS = 99 * 3600 + 59 * 60 + 59; // 99:59:59
  const TICK_INTERVAL_MS = 200;

  const RUNNING_BG_CLASS = 'bg-rose-500';
  const STOPPED_BG_CLASS = 'bg-emerald-500';

  const REFERENCE_FONT_SIZE_PX = 100;
  const WIDTH_MARGIN_RATIO = 0.92;
  const HEIGHT_MARGIN_RATIO = 0.85;

  const STORAGE_KEY = 'sport-timer-records';
  const MAX_RECORDS = 10;

  let state = 'STOPPED'; // 'STOPPED' | 'RUNNING'
  let startTimestamp = null;
  let intervalId = null;
  let records = loadRecords();

  function fitTimeDisplayToWindow() {
    timeDisplay.style.fontSize = `${REFERENCE_FONT_SIZE_PX}px`;
    const { width, height } = timeDisplay.getBoundingClientRect();
    const containerRect = timeContainer.getBoundingClientRect();
    const maxWidth = containerRect.width * WIDTH_MARGIN_RATIO;
    const maxHeight = containerRect.height * HEIGHT_MARGIN_RATIO;
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

  function formatDateTime(epochMs) {
    const pad = (n) => String(n).padStart(2, '0');
    const d = new Date(epochMs);
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const ii = pad(d.getMinutes());
    const ss = pad(d.getSeconds());
    return `${yyyy}/${mm}/${dd} ${hh}:${ii}:${ss}`;
  }

  function updateDisplay(totalSeconds) {
    timeDisplay.textContent = formatTime(totalSeconds);
  }

  function setBackgroundRunning(isRunning) {
    appBody.classList.remove(isRunning ? STOPPED_BG_CLASS : RUNNING_BG_CLASS);
    appBody.classList.add(isRunning ? RUNNING_BG_CLASS : STOPPED_BG_CLASS);
  }

  function loadRecords() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveRecords() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }

  function renderRecords() {
    historyList.innerHTML = '';
    for (const record of records) {
      const li = document.createElement('li');
      li.textContent = `${formatTime(record.seconds)} (${formatDateTime(record.recordedAt)})`;
      historyList.appendChild(li);
    }
    fitTimeDisplayToWindow();
  }

  function addRecord(seconds) {
    records.unshift({ seconds, recordedAt: Date.now() });
    if (records.length > MAX_RECORDS) {
      records.length = MAX_RECORDS;
    }
    saveRecords();
    renderRecords();
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
    const seconds = elapsedSeconds();
    updateDisplay(seconds);
    setBackgroundRunning(false);
    addRecord(seconds);
  }

  appBody.addEventListener('click', (event) => {
    if (event.target.closest('#history-container')) {
      return;
    }
    if (state === 'STOPPED') {
      startTimer();
    } else {
      stopTimer();
    }
  });

  updateDisplay(0);
  setBackgroundRunning(false);
  renderRecords();
})();
