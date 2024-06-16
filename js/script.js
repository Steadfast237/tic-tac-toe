const Cell = function () {
  let value = 0;

  const setCell = function (player) {
    value = player.marker;
  };

  const getCell = function () {
    return value;
  };

  return { getCell, setCell };
};

const GameBoard = function () {
  const rowSize = 3;
  const columnSize = 3;
  const board = [];

  // SETUP  BOARD
  for (let i = 0; i < rowSize; i++) {
    const row = [];

    for (let y = 0; y < columnSize; y++) {
      row.push(Cell());
    }

    board.push(row);
  }

  const getBoard = function () {
    return board;
  };

  const getCell = function (rowColumn) {
    const row = Number(rowColumn.split('_')[0]);
    const column = Number(rowColumn.split('_')[1]);

    return board[row][column];
  };

  const placeMarker = function (rowColumn, player) {
    getCell(rowColumn).setCell(player);
  };

  return { placeMarker, getBoard, getCell };
};

const GameController = function (
  playerOneName = 'player_one',
  playerTwoName = 'player_two'
) {
  const gameBoard = GameBoard();
  const players = [
    {
      name: playerOneName,
      marker: 1,
    },

    {
      name: playerTwoName,
      marker: 2,
    },
  ];
  let activePlayer = players[0];

  const switchActivePlayer = function () {
    activePlayer =
      activePlayer.marker === players[0].marker ? players[1] : players[0];
  };

  const threeInRow = function (arr) {
    return arr
      .map((row) => {
        const firstCell = row[0].getCell();
        if (firstCell === 0) {
          return false;
        }
        return row.every((cell) => cell.getCell() === firstCell);
      })
      .some((result) => result);
  };

  const isCellTaken = function (rowColumn) {
    return gameBoard.getCell(rowColumn).getCell() === 0 ? false : true;
  };

  const isWinner = function () {
    const board = gameBoard.getBoard();
    const rowBoard = board;
    const columnBoard = [
      [board[0][0], board[1][0], board[2][0]],
      [board[0][1], board[1][1], board[2][1]],
      [board[0][2], board[1][2], board[2][2]],
    ];
    const diagonalBoard = [
      [board[0][0], board[1][1], board[2][2]],
      [board[2][0], board[1][1], board[0][2]],
    ];

    return (
      threeInRow(rowBoard) ||
      threeInRow(columnBoard) ||
      threeInRow(diagonalBoard)
    );
  };

  const isTie = function () {
    return gameBoard
      .getBoard()
      .flat(2)
      .every((cell) => cell.getCell() !== 0);
  };

  const playRound = function (rowColumn) {
    if (isCellTaken(rowColumn)) return;

    gameBoard.placeMarker(rowColumn, activePlayer);

    if (isWinner() || isTie()) return;

    switchActivePlayer();
  };

  const getActivePlayer = function () {
    return activePlayer;
  };

  return {
    playRound,
    getActivePlayer,
    board: gameBoard,
    isWinner,
    isTie,
  };
};

const ScreenController = function () {
  const board = document.querySelector('.board');
  const restart = document.querySelector('.restart');
  const activePlayer = document.querySelector('.active-player');

  let gameController = GameController();

  const clickHandlerBoard = function (e) {
    const target = e.target;

    if (target.tagName !== 'BUTTON') return;

    gameController.playRound(target.dataset.cell);

    if (gameController.isWinner() || gameController.isTie()) {
      updateScreen();

      activePlayer.textContent = gameController.isWinner()
        ? `WINNER IS PLAYER ${gameController.getActivePlayer().marker}`
        : `DRAW, NO WINNER`;

      board.removeEventListener('click', clickHandlerBoard);
      return;
    }

    updateScreen();
  };

  const clickHandlerRestart = function () {
    gameController = GameController();
    board.addEventListener('click', clickHandlerBoard);
    updateScreen();
  };

  const updateScreen = function () {
    activePlayer.textContent = `Current Player: ${
      gameController.getActivePlayer().marker
    }`;

    gameController.board.getBoard().forEach((row, rowIndex) =>
      row.forEach((cell, columnIndex) => {
        const button = document.querySelector(
          `[data-cell="${rowIndex}_${columnIndex}"]`
        );

        switch (cell.getCell()) {
          case 0:
            button.textContent = '';
            break;

          case 1:
            button.textContent = 'x';
            break;

          case 2:
            button.textContent = 'o';
            break;
        }
      })
    );
  };

  board.addEventListener('click', clickHandlerBoard);
  restart.addEventListener('click', clickHandlerRestart);

  updateScreen();
};

ScreenController();
