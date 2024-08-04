import { useState } from "react";

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handleMove(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(move) {
    setCurrentMove(move);
  }

  const moves = history.map((h, move) => {
    return <button key={move} onClick={() => jumpTo(move)}>{move > 0 ? `Go to move #${move}` : 'Restart game'}</button>
  });

  return <>
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handleMove}>
        </Board>
      </div>
      <div className="game-info">
        {moves}
      </div>
    </div>
  </>
}

function Board({xIsNext, squares, onPlay}) {

  function onSquareClicked(index) {
    const newSquares = squares.slice() // Create a copy of array using slice
    if (newSquares[index] || calculateWinner(squares)) {
      return;
    }

    newSquares[index] = xIsNext ? 'X' : 'O';
    onPlay(newSquares);
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
        return squares[a];
      }
    }
    return null;
  }

  const winner = calculateWinner(squares);
  const status = winner ? `${winner} wins` : `Next player: ${xIsNext ? 'X' : 'O'}`;

  return <>
    <div className="status">{status}</div>
    <div className="board-row">
        <Square value={squares[0]} onSquareClicked={() => onSquareClicked(0)}></Square>
        <Square value={squares[1]} onSquareClicked={() => onSquareClicked(1)}></Square>
        <Square value={squares[2]} onSquareClicked={() => onSquareClicked(2)}></Square>
    </div>
    <div className="board-row">
        <Square value={squares[3]} onSquareClicked={() => onSquareClicked(3)}></Square>
        <Square value={squares[4]} onSquareClicked={() => onSquareClicked(4)}></Square>
        <Square value={squares[5]} onSquareClicked={() => onSquareClicked(5)}></Square>
    </div>
    <div className="board-row">
        <Square value={squares[6]} onSquareClicked={() => onSquareClicked(6)}></Square>
        <Square value={squares[7]} onSquareClicked={() => onSquareClicked(7)}></Square>
        <Square value={squares[8]} onSquareClicked={() => onSquareClicked(8)}></Square>
    </div>
  </>;
}

function Square({value, onSquareClicked}) {
  return <button className="square" onClick={onSquareClicked}>{value}</button>
}