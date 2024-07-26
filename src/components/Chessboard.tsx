import React, { useRef, useState } from "react";
import Tile from "./Tile";
import "../styles/Chessboard.css";
import Referee from "../referee/Referee"

const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];

export interface Piece {
  image: string;
  x: number;
  y: number;
  type: PieceType;
  team: TeamType;
  enPassant?: boolean;
}

export enum TeamType {
  BLACK,
  WHITE
}

export enum PieceType {
  PAWN,
  BISHOP,
  KNIGHT,
  ROOK,
  QUEEN,
  KING
}

const initialBoardState: Piece[] = [];

for (let p = 0; p < 2; p++) {
  const teamType = p === 0 ? TeamType.BLACK : TeamType.WHITE;
  const colour = p === 0 ? 'black' : 'white';
  const y = p === 0 ? 0 : 7;
        
  initialBoardState.push({ image: `images/${colour}-rook.png`, x: 0, y, type: PieceType.ROOK, team: teamType });
  initialBoardState.push({ image: `images/${colour}-rook.png`, x: 7, y, type: PieceType.ROOK, team: teamType });
  initialBoardState.push({ image: `images/${colour}-knight.png`, x: 1, y, type: PieceType.KNIGHT, team: teamType });
  initialBoardState.push({ image: `images/${colour}-knight.png`, x: 6, y, type: PieceType.KNIGHT, team: teamType });
  initialBoardState.push({ image: `images/${colour}-bishop.png`, x: 2, y, type: PieceType.BISHOP, team: teamType });
  initialBoardState.push({ image: `images/${colour}-bishop.png`, x: 5, y, type: PieceType.BISHOP, team: teamType });
  initialBoardState.push({ image: `images/${colour}-king.png`, x: 4, y, type: PieceType.KING, team: teamType });
  initialBoardState.push({ image: `images/${colour}-queen.png`, x: 3, y, type: PieceType.QUEEN, team: teamType });
}

for (let i = 0; i < 8; i++) {
  initialBoardState.push({ image: 'images/black-pawn.png', x: i, y: 1, type: PieceType.PAWN, team: TeamType.BLACK });
}

for (let i = 0; i < 8; i++) {
  initialBoardState.push({ image: 'images/white-pawn.png', x: i, y: 6, type: PieceType.PAWN, team: TeamType.WHITE });
}

const Chessboard = () => {
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
  const [gridX, setGridX] = useState(0);
  const [gridY, setGridY] = useState(0);
  const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
  const chessboardRef = useRef<HTMLDivElement>(null);
  const referee = new Referee;

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

      const currentPiece = pieces.find(p => p.x === gridX && p.y === gridY);
      const attackedPiece = pieces.find(p => p.x === x && p.y === y);


      if (currentPiece){
        const validMove = referee.isValidMove(gridX, gridY, x, y, currentPiece.type, currentPiece.team, pieces)

        const isEnPassantMove = referee.isEnPassantMove(gridX, gridY, x, y, currentPiece.type, currentPiece.team,  pieces)

        const pawnDirection = (currentPiece.team === TeamType.WHITE) ? 1 : -1;
        if (isEnPassantMove) {
          const updatedPieces = pieces.reduce((results, piece) => {
            if(piece.x === gridX && piece.y === gridY) {
              piece.enPassant = false;
              piece.x = x;
              piece.y = y;
              results.push(piece)
            } else if (!(piece.x === x && piece.y === y + pawnDirection)) {
              if(piece.type === PieceType.PAWN) {
                piece.enPassant = false;
              }
              results.push(piece)
            }

            return results;
          }, [] as Piece[])

          setPieces(updatedPieces);
          
        } else if (validMove) {
          // UPDATES THE PIECE POSITIONS
          // IF PIECE IS ATTACKED, REMOVE IT

          const updatedPieces = pieces.reduce((results, piece) => {
            if (piece.x === gridX && piece.y === gridY){
              if(Math.abs(gridY - y) === 2 && piece.type === PieceType.PAWN){
                //SPECIAL PAWN MOVE
                piece.enPassant = true;
              } else {
                piece.enPassant = false;
              }
              piece.x = x;
              piece.y = y;
              results.push(piece)
            } else if (!(piece.x === x && piece.y === y)) {
              if(piece.type === PieceType.PAWN) {
                piece.enPassant = false;
              }
              results.push(piece)
            }

            return results;
          }, [] as Piece[]);
          setPieces(updatedPieces);

        } else {
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