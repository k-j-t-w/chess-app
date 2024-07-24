import React from "react"
import '../styles/Chessboard.css'
import Tile from "./Tile";

const horizontalAxis = [8, 7, 6, 5, 4, 3, 2, 1];
const verticalAxis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

interface Piece {
  image: string
  x: number
  y: number
}

const pieces: Piece[] = [];

for (let p = 0; p < 2; p++) {
  const colour = p === 0 ? 'black' : 'white';
  const y = p === 0 ? 0 : 7;

  pieces.push({image: `images/${colour}-rook.png`, x: 0, y})
  pieces.push({image: `images/${colour}-rook.png`, x: 7, y})
  pieces.push({image: `images/${colour}-knight.png`, x: 1, y})
  pieces.push({image: `images/${colour}-knight.png`, x: 6, y})
  pieces.push({image: `images/${colour}-bishop.png`, x: 2, y})
  pieces.push({image: `images/${colour}-bishop.png`, x: 5, y})
  pieces.push({image: `images/${colour}-king.png`, x: 4, y})
  pieces.push({image: `images/${colour}-queen.png`, x: 3, y})
}

for (let i = 0; i < 8; i++) {
  pieces.push({image: 'images/black-pawn.png', x: i, y: 1})
}

for (let i = 0; i < 8; i++) {
  pieces.push({image: 'images/white-pawn.png', x: i, y: 6})
}

const Chessboard = () => {
  const board: JSX.Element[] = [];

  for (let i = 0; i < horizontalAxis.length; i++) {
    for (let j = 0; j < verticalAxis.length; j++) {
      const number = j + i + 2;
      let image = '';

      pieces.forEach(p => {
        if (p.x === j && p.y === i) {
          image = p.image;
        }
      })

      board.push(<Tile image={image} number={number}/>)

    }
  }

  return (
    <div  id='chessboard'>
      {board}
    </div>
  )
};

export default Chessboard;