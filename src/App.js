import { useState } from "react";

export default function Game() {
  const [history, setHistory] = useState([{
    squares: Array(9).fill(null),
    location: null
  }]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isDescending, setIsDescending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove]?.squares;

  function handleMove(nextSquares, index) {
    const nextHistory = [...history.slice(0, currentMove + 1), {
      squares: nextSquares,
      location: index
    }];

    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(move) {
    setCurrentMove(move);
  }

  function toggleHistoryOrder() {
    setIsDescending(!isDescending);
  }

  const moves = history.map((h, move) => {
    return move === currentMove ? <span key={move}>{`You are on move #${currentMove}`}</span> :
    <button key={move} onClick={() => jumpTo(move)}>{move > 0 ? `Go to move #${move} (${Math.floor(h.location / 3) + 1}, ${(h.location % 3) + 1})` : 'Restart game'}</button>
  });

  // If ascending order, reverse the history
  if (!isDescending) {
    moves.reverse();
  }

  return <>
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handleMove} onToggleHistoryClicked={toggleHistoryOrder}>
        </Board>
      </div>
      <div className="game-info">
        {moves}
      </div>
    </div>
  </>
}

function Board({xIsNext, squares, onPlay, onToggleHistoryClicked}) {

  function onSquareClicked(index) {
    const newSquares = squares.slice() // Create a copy of array using slice
    if (newSquares[index] || calculateWinner(squares)) {
      return;
    }

    newSquares[index] = xIsNext ? 'X' : 'O';
    onPlay(newSquares, index);
  }

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {
          winner: squares[a],
          winningSquares: [a, b, c]
        };
      }
    }
    return null;
  }

  const winner = calculateWinner(squares);
  const winningSquares = winner?.winningSquares ?? [];
  const isDraw = squares.findIndex(square => square === null) === -1 && !winner;
  const status = winner ? `${winner.winner} wins` : isDraw ? `It's a draw!` : `Next player: ${xIsNext ? 'X' : 'O'}`;

  const board = Array(3).fill(null).map((_, row) => {
    const boardRow = Array(3).fill(null).map((_, col) => {
      const index = row * 3 + col;
      return <Square value={squares[index]} highlight={winningSquares.findIndex((square) => square === index) !== -1} onSquareClicked={() => onSquareClicked(index)}></Square>
    });  

    return <div className="board-row">
      {boardRow}
    </div>
  })

  return <>
    <div className="status">{status}</div>
    {board}
    <button className="history-button" onClick={onToggleHistoryClicked}>Toggle History Order</button>
  </>;
}

function Square({value, highlight, onSquareClicked}) {
  return <button className={`square ${highlight ? 'highlight' : ''}`} onClick={onSquareClicked}>{value}</button>
}