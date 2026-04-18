(function () {
  "use strict";

  var difficultyInput = document.getElementById("difficultyInput");
  var colorInput = document.getElementById("colorInput");
  var startBtn = document.getElementById("startBtn");

  var scoreValue = document.getElementById("scoreValue");
  var leftTimeValue = document.getElementById("leftTimeValue");
  var activeDifficulty = document.getElementById("activeDifficulty");
  var statusText = document.getElementById("statusText");

  var playfield = document.getElementById("playfield");
  var target = document.getElementById("target");

  var DIFFICULTIES = {
    easy: {
      name: "Легка",
      clickWindow: 2600,
      targetSize: 46,
      radiusMin: 0.0,
      radiusMax: 0.3,
    },
    normal: {
      name: "Середня",
      clickWindow: 1900,
      targetSize: 38,
      radiusMin: 0.3,
      radiusMax: 0.65,
    },
    hard: {
      name: "Складна",
      clickWindow: 1300,
      targetSize: 30,
      radiusMin: 0.65,
      radiusMax: 0.98,
    },
  };

  var state = {
    running: false,
    score: 0,
    config: DIFFICULTIES.normal,
    clickTimerId: null,
    timerFrameId: null,
    clickDeadline: 0,
  };

  function getSelectedConfig() {
    return DIFFICULTIES[difficultyInput.value] || DIFFICULTIES.normal;
  }

  function setTargetColor() {
    document.documentElement.style.setProperty("--target-color", colorInput.value);
  }

  function applyConfig(config) {
    document.documentElement.style.setProperty("--target-size", config.targetSize + "px");
    activeDifficulty.textContent = config.name;
  }

  function clearTimers() {
    if (state.clickTimerId) {
      clearTimeout(state.clickTimerId);
      state.clickTimerId = null;
    }

    if (state.timerFrameId) {
      cancelAnimationFrame(state.timerFrameId);
      state.timerFrameId = null;
    }
  }

  function updateScore() {
    scoreValue.textContent = String(state.score);
  }

  function updateRemainingTime() {
    if (!state.running) {
      return;
    }

    var leftMs = Math.max(0, state.clickDeadline - performance.now());
    leftTimeValue.textContent = (leftMs / 1000).toFixed(2) + " с";

    if (leftMs > 0) {
      state.timerFrameId = requestAnimationFrame(updateRemainingTime);
    }
  }

  function getRandomPosition() {
    var width = playfield.clientWidth;
    var height = playfield.clientHeight;
    var targetSize = state.config.targetSize;
    var maxX = Math.max(0, playfield.clientWidth - state.config.targetSize);
    var maxY = Math.max(0, playfield.clientHeight - state.config.targetSize);
    var centerX = width / 2;
    var centerY = height / 2;
    var radiusXMax = Math.max(0, maxX / 2);
    var radiusYMax = Math.max(0, maxY / 2);
    var minRatio = state.config.radiusMin;
    var maxRatio = state.config.radiusMax;

    for (var i = 0; i < 200; i += 1) {
      var angle = Math.random() * Math.PI * 2;
      var ratio = minRatio + Math.random() * Math.max(0, maxRatio - minRatio);
      var centerTargetX = centerX + Math.cos(angle) * radiusXMax * ratio;
      var centerTargetY = centerY + Math.sin(angle) * radiusYMax * ratio;
      var x = centerTargetX - targetSize / 2;
      var y = centerTargetY - targetSize / 2;

      if (x >= 0 && y >= 0 && x <= maxX && y <= maxY) {
        return { x: x, y: y };
      }
    }

    return {
      x: Math.max(0, (width - targetSize) / 2),
      y: Math.max(0, (height - targetSize) / 2),
    };
  }

  function endGame(message) {
    state.running = false;
    clearTimers();
    target.classList.add("hidden");
    leftTimeValue.textContent = "0.00 с";
    statusText.textContent = message + " Рахунок: " + state.score + ".";
  }

  function spawnTarget() {
    if (!state.running) {
      return;
    }

    clearTimers();

    var position = getRandomPosition();
    target.style.left = position.x + "px";
    target.style.top = position.y + "px";
    target.classList.remove("hidden");

    state.clickDeadline = performance.now() + state.config.clickWindow;
    state.clickTimerId = setTimeout(function () {
      endGame("Час вийшов.");
    }, state.config.clickWindow);

    updateRemainingTime();
  }

  function startGame() {
    state.running = true;
    state.score = 0;
    state.config = getSelectedConfig();

    setTargetColor();
    applyConfig(state.config);
    updateScore();

    statusText.textContent = "Гра запущена.";
    spawnTarget();
  }

  target.addEventListener("click", function (event) {
    event.stopPropagation();

    if (!state.running) {
      return;
    }

    state.score += 1;
    updateScore();
    spawnTarget();
  });

  startBtn.addEventListener("click", startGame);

  difficultyInput.addEventListener("change", function () {
    var config = getSelectedConfig();
    if (!state.running) {
      applyConfig(config);
      leftTimeValue.textContent = (config.clickWindow / 1000).toFixed(2) + " с";
    }
  });

  colorInput.addEventListener("input", setTargetColor);

  window.addEventListener("resize", function () {
    if (state.running) {
      spawnTarget();
    }
  });

  setTargetColor();
  applyConfig(state.config);
  leftTimeValue.textContent = (state.config.clickWindow / 1000).toFixed(2) + " с";
})();
