(function () {
  "use strict";

  var SIZE = 5;
  var board = [];
  var moves = 0;

  var boardEl = document.getElementById("board");
  var statusText = document.getElementById("statusText");
  var newGameBtn = document.getElementById("newGameBtn");

  function idx(row, col) {
    return row * SIZE + col;
  }

  function isInside(row, col) {
    return row >= 0 && row < SIZE && col >= 0 && col < SIZE;
  }

  function isSolved() {
    return board.every(function (isOn) {
      return !isOn;
    });
  }

  function toggleCell(row, col) {
    if (!isInside(row, col)) {
      return;
    }

    var index = idx(row, col);
    board[index] = !board[index];
  }

  function applyMove(row, col) {
    toggleCell(row, col);
    toggleCell(row - 1, col);
    toggleCell(row + 1, col);
    toggleCell(row, col - 1);
    toggleCell(row, col + 1);
  }

  function render() {
    var cells = boardEl.querySelectorAll(".cell");

    cells.forEach(function (cell, index) {
      cell.classList.toggle("on", board[index]);
    });
  }

  function buildBoard() {
    var fragment = document.createDocumentFragment();

    for (var row = 0; row < SIZE; row += 1) {
      for (var col = 0; col < SIZE; col += 1) {
        var cell = document.createElement("button");
        cell.type = "button";
        cell.className = "cell";
        cell.setAttribute("aria-label", "Клітинка");
        cell.dataset.row = String(row);
        cell.dataset.col = String(col);
        fragment.appendChild(cell);
      }
    }

    boardEl.innerHTML = "";
    boardEl.appendChild(fragment);
  }

  function randomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function newGame() {
    board = new Array(SIZE * SIZE).fill(false);
    moves = 0;

    for (var i = 0; i < 14; i += 1) {
      applyMove(randomInt(SIZE), randomInt(SIZE));
    }

    if (isSolved()) {
      applyMove(randomInt(SIZE), randomInt(SIZE));
    }

    render();
    statusText.textContent = "Ходи: 0";
  }

  boardEl.addEventListener("click", function (event) {
    var target = event.target;

    if (!(target instanceof HTMLButtonElement)) {
      return;
    }

    var row = Number(target.dataset.row);
    var col = Number(target.dataset.col);

    applyMove(row, col);
    moves += 1;
    render();

    if (isSolved()) {
      statusText.textContent = "Перемога за " + moves + " ходів.";
      return;
    }

    statusText.textContent = "Ходи: " + moves;
  });

  newGameBtn.addEventListener("click", newGame);

  buildBoard();
  newGame();
})();
