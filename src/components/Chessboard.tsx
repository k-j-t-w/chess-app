import React, { useRef, useState } from "react";
import Tile from "./Tile";
import "../styles/Chessboard.css";
import { 
  VERTICAL_AXIS,
  HORIXONTAL_AXIS,
  GRID_SIZE, 
  Piece,
  Position, 
  samePosition 
} from "../Constants";

interface Props {
  playMove: (piece: Piece, position: Position) => boolean;
  pieces: Piece[];
}

const Chessboard = ({ playMove, pieces} : Props) => {
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
  const [grabPosition, setGrabPosition] = useState<Position>({x: -1, y: -1})
  const chessboardRef = useRef<HTMLDivElement>(null);

  function grabPiece(e: React.MouseEvent) {
    const element = e.target as HTMLElement;
    const chessboard = chessboardRef.current;
    if (element.classList.contains("chess-piece") && chessboard) {
      const grabX = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
      const grabY = Math.floor((e.clientY - chessboard.offsetTop) / GRID_SIZE)
      setGrabPosition({x: grabX, y: grabY})

      const x = e.clientX - GRID_SIZE/2;
      const y = e.clientY - GRID_SIZE/2;
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
      if (x < minX) {
        activePiece.style.left = `${minX}px`;
      }
      else if (x > maxX) {
        activePiece.style.left = `${maxX}px`;
      }
      else {
        activePiece.style.left = `${x}px`;
      }
      if (y < minY) {
        activePiece.style.top = `${minY}px`;
      }
      else if (y > maxY) {
        activePiece.style.top = `${maxY}px`;
      }
      else {
        activePiece.style.top = `${y}px`;
      }
    }
  }
  function dropPiece(e: React.MouseEvent) {
    const chessboard = chessboardRef.current;
    if (activePiece && chessboard) {
      const x = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
      const y = Math.floor((e.clientY - chessboard.offsetTop) / GRID_SIZE);

      const currentPiece = pieces.find(p => samePosition(p.position, grabPosition));

      if (currentPiece){
        const success = playMove(currentPiece, {x, y})

        if (!success) {
          // RESETS THE PIECE POSITION
          activePiece.style.position = 'relative';
          activePiece.style.removeProperty('top');
          activePiece.style.removeProperty('left');
        }
      }

      setActivePiece(null);
    }
  }

  const board: JSX.Element[] = [];

  for (let i = 0; i < HORIXONTAL_AXIS.length; i++) {
    for (let j = 0; j < VERTICAL_AXIS.length; j++) {
      const number = j + i + 2;
      const piece = pieces.find(p => samePosition(p.position, {x: j, y: i}))
      const image = piece ? piece.image : undefined;

      const currentPiece = activePiece !== null ? pieces.find(p => samePosition(p.position, grabPosition)) : undefined;
      const highlight = currentPiece?.possibleMoves ? currentPiece.possibleMoves.some(p => samePosition(p, {x: j, y: i})) : false;

      board.push(<Tile key={`${i}${j}`} image={image} number={number} highlight={highlight} />);
    }
  }

  return (
    <>
      <div
        onMouseMove={(e) => movePiece(e)}
        onMouseDown={(e) => grabPiece(e)}
        onMouseUp={(e) => dropPiece(e)}
        id="chessboard"
        ref={chessboardRef}
      >
        {board}
      </div>
    </>
  );
}

export default Chessboard;