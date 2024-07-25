import React, { useRef } from "react";
import '../styles/Chessboard.css';
import Tile from "./Tile";

const horizontalAxis = [8, 7, 6, 5, 4, 3, 2, 1];
const verticalAxis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

interface Piece {
  image: string;
  x: number;
  y: number;
}

const pieces: Piece[] = [];

for (let p = 0; p < 2; p++) {
  const colour = p === 0 ? 'black' : 'white';
  const y = p === 0 ? 0 : 7;

  pieces.push({ image: `images/${colour}-rook.png`, x: 0, y });
  pieces.push({ image: `images/${colour}-rook.png`, x: 7, y });
  pieces.push({ image: `images/${colour}-knight.png`, x: 1, y });
  pieces.push({ image: `images/${colour}-knight.png`, x: 6, y });
  pieces.push({ image: `images/${colour}-bishop.png`, x: 2, y });
  pieces.push({ image: `images/${colour}-bishop.png`, x: 5, y });
  pieces.push({ image: `images/${colour}-king.png`, x: 4, y });
  pieces.push({ image: `images/${colour}-queen.png`, x: 3, y });
}

for (let i = 0; i < 8; i++) {
  pieces.push({ image: 'images/black-pawn.png', x: i, y: 1 });
}

for (let i = 0; i < 8; i++) {
  pieces.push({ image: 'images/white-pawn.png', x: i, y: 6 });
}

const Chessboard = () => {
  const chessboardRef = useRef<HTMLDivElement>(null);
  let activePiece: HTMLElement | null = null;

  function grabPiece(e: React.MouseEvent) {
    const element = e.target as HTMLElement;
    if (element.classList.contains("chess-piece")) {
      const x = e.clientX - 50;
      const y = e.clientY - 50;
      element.style.position = 'absolute';
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;

      activePiece = element;

      // Add event listeners to document
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", dropPiece);
    }
  }

  function handleMouseMove(e: MouseEvent) {
    movePiece(e);
  }

  function movePiece(e: MouseEvent) {
    const chessboard = chessboardRef.current;
    if (activePiece && chessboard) {
      const minX = chessboard.offsetLeft - 25;
      const minY = chessboard.offsetTop - 20;
      const maxX = chessboard.offsetLeft + chessboard.clientWidth - 75;
      const maxY = chessboard.offsetTop + chessboard.clientHeight - 85;
      const x = e.clientX - 50;
      const y = e.clientY - 50;

      activePiece.style.position = 'absolute';

      // Update x position with boundary checks
      if (x < minX) {
        activePiece.style.left = `${minX}px`;
      } else if (x > maxX) {
        activePiece.style.left = `${maxX}px`;
      } else {
        activePiece.style.left = `${x}px`;
      }

      // Update y position independently
      if (y < minY) {
        activePiece.style.top = `${minY}px`;
      } else if (y > maxY) {
        activePiece.style.top = `${maxY}px`;
      } else {
        activePiece.style.top = `${y}px`;
      }
    }
  }

  function dropPiece() {
    if (activePiece) {
      activePiece = null;

      // Remove event listeners from document
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", dropPiece);
    }
  }

  const board: JSX.Element[] = [];

  for (let i = 0; i < horizontalAxis.length; i++) {
    for (let j = 0; j < verticalAxis.length; j++) {
      const number = j + i + 2;
      let image = '';

      pieces.forEach(p => {
        if (p.x === j && p.y === i) {
          image = p.image;
        }
      });

      board.push(<Tile key={`${i}${j}`} image={image} number={number} />);
    }
  }

  return (
    <div
      id='chessboard'
      onMouseDown={(e) => grabPiece(e)}
      ref={chessboardRef}
    >
      {board}
    </div>
  );
};

export default Chessboard;
