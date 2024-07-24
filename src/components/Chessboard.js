import React from "react"
import '../styles/Chessboard.css'


const horizontalAxis = [8, 7, 6, 5, 4, 3, 2, 1];
const verticalAxis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

interface Piece {
  image: String
  x: number
  y: number
}

const pieces = []

const Chessboard = (props) => {
  let board = [];

  for (let i = 0; i < horizontalAxis.length; i++) {
    for (let j = 0; j < verticalAxis.length; j++) {
      const number = j + i + 2;

      if (number % 2 === 0) {
          board.push(
           <div className='tile white-tile' id={verticalAxis[j] + horizontalAxis[i]}></div>
          );
      } else {
          board.push(
            <div className='tile black-tile' id={verticalAxis[j] + horizontalAxis[i]}></div>
          );
      }
    }
  };

  return (
    <div  id='chessboard'>
      {board}
    </div>
  )
};

export default Chessboard;