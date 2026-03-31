(function () {
  "use strict";

  var difficultyInput = document.getElementById("difficultyInput");
  var difficultyValue = document.getElementById("difficultyValue");
  var colorInput = document.getElementById("colorInput");
  var speedPreview = document.getElementById("speedPreview");
  var timePreview = document.getElementById("timePreview");
  var distancePreview = document.getElementById("distancePreview");
  var sizePreview = document.getElementById("sizePreview");

  var settingsPanel = document.getElementById("settingsPanel");
  var gamePanel = document.getElementById("gamePanel");

  var startBtn = document.getElementById("startBtn");

  var playfield = document.getElementById("playfield");
  var target = document.getElementById("target");

  var scoreValue = document.getElementById("scoreValue");
  var leftTimeValue = document.getElementById("leftTimeValue");
  var activeDifficulty = document.getElementById("activeDifficulty");

  var gameOverModal = document.getElementById("gameOverModal");
  var finalScoreValue = document.getElementById("finalScoreValue");
  var modalRestartBtn = document.getElementById("modalRestartBtn");
  var modalSettingsBtn = document.getElementById("modalSettingsBtn");
  var modalText = gameOverModal.querySelector(".modal-text");

  var state = {
    running: false,
    gameOver: false,
    score: 0,
    misses: 0,
    config: null,
    clickTimerId: null,
    timerFrameId: null,
    spawnTimerId: null,
    clickDeadline: 0,
  };

  var DIFFICULTY_PRESETS = {
    1: {
      name: "Новачок",
      moveDuration: 500,
      clickWindow: 3000,
      spawnDelay: 820,
      targetSize: 54,
      radiusBand: { min: 0.0, max: 0.16 },
      radiusLabel: "дуже близько до центру",
    },
    2: {
      name: "Легкий",
      moveDuration: 450,
      clickWindow: 2600,
      spawnDelay: 720,
      targetSize: 48,
      radiusBand: { min: 0.16, max: 0.36 },
      radiusLabel: "близько до центру",
    },
    3: {
      name: "Нормальний",
      moveDuration: 390,
      clickWindow: 2250,
      spawnDelay: 620,
      targetSize: 42,
      radiusBand: { min: 0.36, max: 0.58 },
      radiusLabel: "середня дистанція",
    },
    4: {
      name: "Складний",
      moveDuration: 330,
      clickWindow: 1950,
      spawnDelay: 520,
      targetSize: 36,
      radiusBand: { min: 0.58, max: 0.78 },
      radiusLabel: "далеко від центру",
    },
    5: {
      name: "Експерт",
      moveDuration: 280,
      clickWindow: 1650,
      spawnDelay: 430,
      targetSize: 30,
      radiusBand: { min: 0.78, max: 0.98 },
      radiusLabel: "майже біля країв поля",
    },
  };

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function getDifficultyConfig(rawLevel) {
    var level = clamp(parseInt(rawLevel, 10) || 3, 1, 5);
    var preset = DIFFICULTY_PRESETS[level];

    return {
      level: level,
      name: preset.name,
      moveDuration: preset.moveDuration,
      clickWindow: preset.clickWindow,
      spawnDelay: preset.spawnDelay,
      targetSize: preset.targetSize,
      radiusBand: {
        min: preset.radiusBand.min,
        max: preset.radiusBand.max,
      },
      radiusLabel: preset.radiusLabel,
    };
  }

  function updateSettingsPreview() {
    var config = getDifficultyConfig(difficultyInput.value);
    difficultyValue.textContent = config.name;
    speedPreview.textContent = config.moveDuration + " мс";
    timePreview.textContent = config.clickWindow + " мс";
    distancePreview.textContent =
      Math.round(config.radiusBand.min * 100) +
      "% - " +
      Math.round(config.radiusBand.max * 100) +
      "% (" +
      config.radiusLabel +
      ")";
    sizePreview.textContent = config.targetSize + " пкс";
  }

  function setTargetColor(color) {
    document.documentElement.style.setProperty("--target-color", color);
  }

  function applyConfigVisuals(config) {
    document.documentElement.style.setProperty("--target-size", config.targetSize + "px");
    document.documentElement.style.setProperty("--target-move-duration", config.moveDuration + "ms");
  }

  function updateHud() {
    scoreValue.textContent = String(state.score);
    activeDifficulty.textContent = state.config ? state.config.name : "-";
  }

  function clearTimers() {
    if (state.clickTimerId) {
      clearTimeout(state.clickTimerId);
      state.clickTimerId = null;
    }

    if (state.spawnTimerId) {
      clearTimeout(state.spawnTimerId);
      state.spawnTimerId = null;
    }

    if (state.timerFrameId) {
      cancelAnimationFrame(state.timerFrameId);
      state.timerFrameId = null;
    }
  }

  function closeModal() {
    gameOverModal.classList.add("hidden");
    gameOverModal.setAttribute("aria-hidden", "true");
  }

  function showModal(message) {
    modalText.textContent = message;
    finalScoreValue.textContent = String(state.score);
    gameOverModal.classList.remove("hidden");
    gameOverModal.setAttribute("aria-hidden", "false");
  }

  function setGameOver(reasonText) {
    state.running = false;
    state.gameOver = true;
    state.misses += 1;

    clearTimers();
    updateHud();

    leftTimeValue.textContent = "0.00 с";
    target.classList.add("hidden");
    playfield.classList.add("miss-flash");

    setTimeout(function () {
      playfield.classList.remove("miss-flash");
    }, 140);

    showModal(reasonText);
  }

  function showSettingsScreen() {
    clearTimers();
    state.running = false;
    state.gameOver = false;
    target.classList.add("hidden");
    leftTimeValue.textContent = "0.00 с";
    settingsPanel.classList.remove("hidden");
    gamePanel.classList.add("hidden");
    closeModal();
  }

  function getRandomTargetPosition() {
    var width = playfield.clientWidth;
    var height = playfield.clientHeight;
    var targetSize = state.config.targetSize;
    var centerX = width / 2;
    var centerY = height / 2;
    var maxX = Math.max(0, width - targetSize);
    var maxY = Math.max(0, height - targetSize);
    var radiusXMax = Math.max(0, maxX / 2 - 4);
    var radiusYMax = Math.max(0, maxY / 2 - 4);
    var minRatio = state.config.radiusBand.min;
    var maxRatio = state.config.radiusBand.max;

    for (var i = 0; i < 300; i += 1) {
      var angle = Math.random() * Math.PI * 2;
      var ratio = minRatio + Math.random() * Math.max(0, maxRatio - minRatio);
      var targetCenterX = centerX + Math.cos(angle) * radiusXMax * ratio;
      var targetCenterY = centerY + Math.sin(angle) * radiusYMax * ratio;
      var x = targetCenterX - targetSize / 2;
      var y = targetCenterY - targetSize / 2;

      if (x >= 0 && y >= 0 && x <= maxX && y <= maxY) {
        return { x: x, y: y };
      }
    }

    return {
      x: Math.min(maxX, Math.max(0, centerX - targetSize / 2)),
      y: Math.min(maxY, Math.max(0, centerY - targetSize / 2)),
    };
  }

  function updateRemainingTime() {
    if (!state.running) {
      return;
    }

    var leftMs = Math.max(0, state.clickDeadline - performance.now());
    leftTimeValue.textContent = (leftMs / 1000).toFixed(2) + " с";

    if (leftMs <= 0) {
      return;
    }

    state.timerFrameId = requestAnimationFrame(updateRemainingTime);
  }

  function startRound() {
    if (!state.running) {
      return;
    }

    clearTimers();

    var position = getRandomTargetPosition();
    target.style.left = position.x + "px";
    target.style.top = position.y + "px";
    target.classList.remove("hidden");

    state.clickDeadline = performance.now() + state.config.clickWindow;
    state.clickTimerId = setTimeout(function () {
      setGameOver("Ти не встиг натиснути на блок у відведений час.");
    }, state.config.clickWindow);

    updateRemainingTime();
  }

  function startGame() {
    state.config = getDifficultyConfig(difficultyInput.value);
    state.running = true;
    state.gameOver = false;
    state.score = 0;
    state.misses = 0;

    setTargetColor(colorInput.value);
    applyConfigVisuals(state.config);
    updateHud();
    closeModal();

    settingsPanel.classList.add("hidden");
    gamePanel.classList.remove("hidden");

    startRound();
  }

  function restartGame() {
    state.running = true;
    state.gameOver = false;
    state.score = 0;
    state.misses = 0;

    if (!state.config) {
      state.config = getDifficultyConfig(difficultyInput.value);
    }

    applyConfigVisuals(state.config);
    updateHud();
    closeModal();

    settingsPanel.classList.add("hidden");
    gamePanel.classList.remove("hidden");

    startRound();
  }

  startBtn.addEventListener("click", startGame);

  modalRestartBtn.addEventListener("click", restartGame);
  modalSettingsBtn.addEventListener("click", showSettingsScreen);

  difficultyInput.addEventListener("input", updateSettingsPreview);

  colorInput.addEventListener("input", function () {
    setTargetColor(colorInput.value);
  });

  target.addEventListener("click", function (event) {
    event.stopPropagation();

    if (!state.running) {
      return;
    }

    state.score += 1;
    updateHud();

    clearTimers();
    target.classList.add("hidden");
    leftTimeValue.textContent = "0.00 с";
    playfield.classList.add("hit-flash");

    setTimeout(function () {
      playfield.classList.remove("hit-flash");
    }, 120);

    state.spawnTimerId = setTimeout(function () {
      startRound();
    }, state.config.spawnDelay);
  });

  playfield.addEventListener("click", function () {
    if (!state.running) {
      return;
    }
  });

  window.addEventListener("resize", function () {
    if (state.running) {
      startRound();
    }
  });

  updateSettingsPreview();
  setTargetColor(colorInput.value);
  showSettingsScreen();
})();
