import React, { useRef, useState } from "react";
import Tile from "./Tile";
import "../styles/Chessboard.css";
import Referee from "../arbiter/Referee"
import { 
  VERTICAL_AXIS,
  HORIXONTAL_AXIS,
  GRID_SIZE, Piece,
  PieceType, TeamType,
  initialBoardState,
  Position, 
  samePosition 
} from "../Constants";

const Chessboard = () => {
  const [promotionPawn, setPromotionPawn] = useState<Piece>();
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
  const [grabPosition, setGrabPosition] = useState<Position>({x: -1, y: -1})
  const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
  const chessboardRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const referee = new Referee;

  function updateValidMoves() {
    setPieces((currentPieces) => {
      return currentPieces.map(p => {
        p.possibleMoves = referee.getValidMoves(p, currentPieces);
        return p;
      });
    });
  }

  function calculateAllMoves() {
    for (const piece of pieces) {
      piece.possibleMoves = referee.getValidMoves(piece, pieces)
    }

    const king = pieces.find(p => p.type === PieceType.KING && p.team === TeamType.BLACK)

    if(king?.possibleMoves === undefined) return;

    const originalKingPosition = king.position;
    for(const move of king.possibleMoves) {
      king.position = move;
    }
    king.position = originalKingPosition;
  }

  function grabPiece(e: React.MouseEvent) {
    updateValidMoves();
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
        const validMove = referee.isValidMove(grabPosition, { x, y }, currentPiece.type, currentPiece.team, pieces)

        const isEnPassantMove = referee.isEnPassantMove(grabPosition, { x, y }, currentPiece.type, currentPiece.team,  pieces)

        const pawnDirection = (currentPiece.team === TeamType.WHITE) ? 1 : -1;
        if (isEnPassantMove) {
          const updatedPieces = pieces.reduce((results, piece) => {
            if(samePosition(piece.position, grabPosition)) {
              piece.enPassant = false;
              piece.position.x = x;
              piece.position.y = y;
              results.push(piece)
            } else if (!(samePosition(piece.position, {x, y: y+pawnDirection}))) {
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
            
            if (samePosition(piece.position, grabPosition)){
              // SPECIAL MOVE
              piece.enPassant = Math.abs(grabPosition.y - y) === 2 && piece.type === PieceType.PAWN;

              piece.position.x = x;
              piece.position.y = y;

              const promotionRow = (piece.team === TeamType.WHITE) ? 0 : 7;

              if (y === promotionRow && piece.type === PieceType.PAWN) {
                // PAWN PROMOTION
                modalRef.current?.classList.remove("hidden");
                setPromotionPawn(piece);
              }
              results.push(piece)
            } else if (!(samePosition(piece.position, {x, y}))) {
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

  function promotePawn(pieceType: PieceType) {
    if (promotionPawn === undefined) {
      return;
    }

    const updatedPieces = pieces.reduce((results, piece) => {
      if(samePosition(piece.position, promotionPawn.position)) {
        piece.type = pieceType
        const teamType = (piece.team === TeamType.WHITE) ? 'white' : 'black';
        let image = '';
        switch(pieceType) {
          case PieceType.ROOK: {
            image = 'rook';
            break;
          }
          case PieceType.BISHOP: {
            image = 'bishop';
            break;
          }
          case PieceType.KNIGHT: {
            image = 'knight';
            break;
          }
          case PieceType.QUEEN: {
            image = 'queen';
            break;
          }
        }
        piece.image = `/images/${teamType}-${image}.png`
      }
      results.push(piece);
      return results;
    }, [] as Piece[])

    setPieces(updatedPieces);

    modalRef.current?.classList.add('hidden');
  }

  function promotionTeamType() {
    return (promotionPawn?.team === TeamType.WHITE) ? 'white' : 'black';
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
    <div id='pawn-promotion-modal' className="hidden" ref={modalRef}>
      <div className="modal-body">
        <img onClick={() => promotePawn(PieceType.QUEEN)} src={`/images/${promotionTeamType()}-queen.png`}/>
        <img onClick={() => promotePawn(PieceType.KNIGHT)} src={`/images/${promotionTeamType()}-knight.png`}/>
        <img onClick={() => promotePawn(PieceType.ROOK)} src={`/images/${promotionTeamType()}-rook.png`}/>
        <img onClick={() => promotePawn(PieceType.BISHOP)} src={`/images/${promotionTeamType()}-bishop.png`}/>
      </div>
    </div>
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