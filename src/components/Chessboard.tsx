import React, { MouseEvent, useEffect, useRef, useState } from "react";
import Tile from "./Tile";
import "../styles/Chessboard.css";

const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
interface Piece {
  image: string;
  x: number;
  y: number;
}

const initialBoardState: Piece[] = [];

for (let p = 0; p < 2; p++) {
  const colour = p === 0 ? 'black' : 'white';
  const y = p === 0 ? 0 : 7;
        
  initialBoardState.push({ image: `images/${colour}-rook.png`, x: 0, y });
  initialBoardState.push({ image: `images/${colour}-rook.png`, x: 7, y });
  initialBoardState.push({ image: `images/${colour}-knight.png`, x: 1, y });
  initialBoardState.push({ image: `images/${colour}-knight.png`, x: 6, y });
  initialBoardState.push({ image: `images/${colour}-bishop.png`, x: 2, y });
  initialBoardState.push({ image: `images/${colour}-bishop.png`, x: 5, y });
  initialBoardState.push({ image: `images/${colour}-king.png`, x: 4, y });
  initialBoardState.push({ image: `images/${colour}-queen.png`, x: 3, y });
}

for (let i = 0; i < 8; i++) {
  initialBoardState.push({ image: 'images/black-pawn.png', x: i, y: 1 });
}

for (let i = 0; i < 8; i++) {
  initialBoardState.push({ image: 'images/white-pawn.png', x: i, y: 6 });
}

const Chessboard = () => {
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
  const [gridX, setGridX] = useState(0);
  const [gridY, setGridY] = useState(0);
  const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
  const chessboardRef = useRef<HTMLDivElement>(null);

  function grabPiece(e: React.MouseEvent) {
    const element = e.target as HTMLElement;
    const chessboard = chessboardRef.current;
    if (element.classList.contains("chess-piece") && chessboard) {
      setGridX(Math.floor((e.clientX - chessboard.offsetLeft) / 100));
      setGridY(Math.floor((e.clientY - chessboard.offsetTop) / 100));

      const x = e.clientX - 50;
      const y = e.clientY - 50;
      element.style.position = "absolute";
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;

      setActivePiece(element);
    }
  }

  function movePiece(e: React.MouseEvent) {
    const chessboard = chessboardRef.current;
    if (activePiece && chessboard) {
      const minX = chessboard.offsetLeft - 25;
      const minY = chessboard.offsetTop - 25;
      const maxX = chessboard.offsetLeft + chessboard.clientWidth - 75;
      const maxY = chessboard.offsetTop + chessboard.clientHeight - 75;
      const x = e.clientX - 50;
      const y = e.clientY - 50;
      activePiece.style.position = "absolute";
      //If x is smaller than minimum amount
      if (x < minX) {
        activePiece.style.left = `${minX}px`;
      }
      //If x is bigger than maximum amount
      else if (x > maxX) {
        activePiece.style.left = `${maxX}px`;
      }
      //If x is in the constraints
      else {
        activePiece.style.left = `${x}px`;
      }
      //If y is smaller than minimum amount
      if (y < minY) {
        activePiece.style.top = `${minY}px`;
      }
      //If y is bigger than maximum amount
      else if (y > maxY) {
        activePiece.style.top = `${maxY}px`;
      }
      //If y is in the constraints
      else {
        activePiece.style.top = `${y}px`;
      }
    }
  }
  function dropPiece(e: React.MouseEvent) {
    const chessboard = chessboardRef.current;
    if (activePiece && chessboard) {
      const x = Math.floor((e.clientX - chessboard.offsetLeft) / 100);
      const y = Math.floor((e.clientY - chessboard.offsetTop) / 100);
      setPieces((value) => {
        const pieces = value.map((p) => {
          if (p.x === gridX && p.y === gridY) {
            p.x = x;
            p.y = y;
          }
          return p;
        });
        return pieces;
      });

      setActivePiece(null);
    }
  }

  const board: JSX.Element[] = [];

  for (let i = 0; i < horizontalAxis.length; i++) {
    for (let j = 0; j < verticalAxis.length; j++) {
      const number = j + i + 2;
      let image = '';

      pieces.forEach((p) => {
        if (p.x === j && p.y === i) {
          image = p.image;
        }
      });

      board.push(<Tile key={`${i}${j}`} image={image} number={number} />);
    }
  }

  return (
    <div
      onMouseMove={(e) => movePiece(e)}
      onMouseDown={(e) => grabPiece(e)}
      onMouseUp={(e) => dropPiece(e)}
      id="chessboard"
      ref={chessboardRef}
    >
      {board}
    </div>
  );
}

export default Chessboard;