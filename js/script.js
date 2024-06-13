const Cell = function () {
  let value = 0;

  const set_cell_value = function (player) {
    value = player.marker;
  };

  const get_cell_value = function () {
    return value;
  };

  return { get_cell_value, set_cell_value };
};

const Game_Board = function () {
  const row_size = 3;
  const column_size = 3;
  const board = [];

  // SETUP  BOARD
  for (let i = 0; i < row_size; i++) {
    const row = [];

    for (let y = 0; y < column_size; y++) {
      row.push(Cell());
    }

    board.push(row);
  }

  const get_board = function () {
    return board;
  };

  const get_cell = function (row_column) {
    const row = Number(row_column.split('_')[0]);
    const column = Number(row_column.split('_')[1]);

    return board[row][column];
  };

  const place_marker = function (row_column, player) {
    get_cell(row_column).set_cell_value(player);
  };

  const print_board = function () {
    console.log(board.map((row) => row.map((cell) => cell.get_cell_value())));
  };

  return { place_marker, get_board, print_board, get_cell };
};

const Game_Controller = function (
  player_one_name = 'player_one',
  player_two_name = 'player_two'
) {
  const game_board = Game_Board();
  const players = [
    {
      name: player_one_name,
      marker: 1,
    },

    {
      name: player_two_name,
      marker: 2,
    },
  ];
  let active_player = players[0];

  const switch_active_player = function () {
    active_player =
      active_player.marker === players[0].marker ? players[1] : players[0];
  };

  const three_in_a_row = function (arr) {
    return arr
      .map((row) => {
        const first_cell = row[0].get_cell_value();
        if (first_cell === 0) {
          return false;
        }
        return row.every((cell) => cell.get_cell_value() === first_cell);
      })
      .some((result) => result);
  };

  const is_cell_taken = function (row_column) {
    return game_board.get_cell(row_column).get_cell_value() === 0
      ? false
      : true;
  };

  const is_winner = function () {
    const board = game_board.get_board();
    const row_board = board;
    const column_board = [
      [board[0][0], board[1][0], board[2][0]],
      [board[0][1], board[1][1], board[2][1]],
      [board[0][2], board[1][2], board[2][2]],
    ];
    const diagonal_board = [
      [board[0][0], board[1][1], board[2][2]],
      [board[2][0], board[1][1], board[0][2]],
    ];

    return (
      three_in_a_row(row_board) ||
      three_in_a_row(column_board) ||
      three_in_a_row(diagonal_board)
    );
  };

  const is_tie = function () {
    return game_board
      .get_board()
      .flat(2)
      .every((cell) => cell.get_cell_value() !== 0);
  };

  const play_round = function (row_column) {
    console.log(`${active_player.name} is placing his mark`);

    if (is_cell_taken(row_column)) {
      return;
    }

    game_board.place_marker(row_column, active_player);

    game_board.print_board();

    if (is_winner()) {
      console.log(`WINNER IS ${active_player.name.toUpperCase()}!!!`);
      return;
    }

    if (is_tie()) {
      console.log('DRAW, NO WINNER');
      return;
    }

    switch_active_player();
  };

  return { play_round, active_player, board: game_board };
};
