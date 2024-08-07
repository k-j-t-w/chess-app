import React, { useState, useRef, useEffect } from "react";
import Chessboard from "./Chessboard";
import { initialBoardState, Piece, PieceType, Position, samePosition, TeamType } from "../Constants";
import { bishopMove, getPossibleBishopMoves, getPossibleKingMoves, getPossibleKnightMoves, getPossiblePawnMoves, getPossibleQueenMoves, getPossibleRookMoves, kingMove, knightMove, pawnMove, queenMove, rookMove } from "../arbiter/rules";

function Arbiter() {
  const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
  const [promotionPawn, setPromotionPawn] = useState<Piece>();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    updatePossibleMoves();
  }, [])

  function updatePossibleMoves() {
    setPieces((currentPieces) => {
      return currentPieces.map(p => {
        p.possibleMoves = getValidMoves(p, currentPieces);
        return p;
      });
    });
  }

  function playMove(playedPiece: Piece, destination: Position) : boolean{
    const validMove = isValidMove(
      playedPiece.position, 
      destination, 
      playedPiece.type, 
      playedPiece.team, 
    )

    const enPassantMove = isEnPassantMove(
      playedPiece.position, 
      destination, 
      playedPiece.type, 
      playedPiece.team,
    )

    const pawnDirection = (playedPiece.team === TeamType.WHITE) ? 1 : -1;

    if (enPassantMove) {
      const updatedPieces = pieces.reduce((results, piece) => {
        if(samePosition(piece.position, playedPiece.position)) {
          piece.enPassant = false;
          piece.position.x = destination.x;
          piece.position.y = destination.y;
          results.push(piece)
        } else if (!(samePosition(piece.position, { x: destination.x, y: destination.y+pawnDirection }))) {
          if(piece.type === PieceType.PAWN) {
            piece.enPassant = false;
          }
          results.push(piece)
        }

        return results;
      }, [] as Piece[])

      updatePossibleMoves();
      setPieces(updatedPieces);

    } else if (validMove) {
      // UPDATES THE PIECE POSITIONS
      // IF PIECE IS ATTACKED, REMOVE IT
      const updatedPieces = pieces.reduce((results, piece) => {
        
        if (samePosition(piece.position, playedPiece.position)){
          // SPECIAL MOVE
          piece.enPassant = Math.abs(playedPiece.position.y - destination.y) === 2 && piece.type === PieceType.PAWN;

          piece.position.x = destination.x;
          piece.position.y = destination.y;

          const promotionRow = (piece.team === TeamType.WHITE) ? 0 : 7;

          if (destination.y === promotionRow && piece.type === PieceType.PAWN) {
            // PAWN PROMOTION
            modalRef.current?.classList.remove("hidden");
            setPromotionPawn(piece);
          }
          results.push(piece)
        } else if (!(samePosition(piece.position, { x: destination.x, y: destination.y}))) {
          if(piece.type === PieceType.PAWN) {
            piece.enPassant = false;
          }
          results.push(piece)
        }

        return results;
      }, [] as Piece[]);

      updatePossibleMoves();
      setPieces(updatedPieces);
    } else {
      return false;
    }
    return true;
  }

  function isValidMove(initialPosition: Position, desiredPosition: Position, type: PieceType, team: TeamType) {
    let validMove = false;
    switch(type) {
      case PieceType.PAWN:
        validMove = pawnMove(initialPosition, desiredPosition, team, pieces);
        break;
      case PieceType.KNIGHT:
        validMove = knightMove(initialPosition, desiredPosition, team, pieces);
        break;
      case PieceType.BISHOP:
        validMove = bishopMove(initialPosition, desiredPosition, team, pieces);
        break;
      case PieceType.ROOK:
        validMove = rookMove(initialPosition, desiredPosition, team, pieces);
        break;
      case PieceType.QUEEN:
        validMove = queenMove(initialPosition, desiredPosition, team, pieces);
        break;
      case PieceType.KING:
        validMove = kingMove(initialPosition, desiredPosition, team, pieces);
    }
    return validMove;
  }

  function isEnPassantMove(
    initialPosition: Position,
    desiredPosition: Position,
    type: PieceType,
    team: TeamType,
  ) {
    const pawnDirection = team === TeamType.WHITE ? -1 : 1;

    if (type === PieceType.PAWN) {
      if (
        (desiredPosition.x - initialPosition.x === -1 ||
          desiredPosition.x - initialPosition.x === 1) &&
        desiredPosition.y - initialPosition.y === pawnDirection
      ) {
        const piece = pieces.find(
          (p) =>
            p.position.x === desiredPosition.x &&
            p.position.y === desiredPosition.y - pawnDirection &&
            p.enPassant
        );
        if (piece) {
          return true;
        }
      }
    }

    return false;
  }

  function getValidMoves(piece: Piece, boardState: Piece[]) : Position[] {
    switch(piece.type)
    {
      case PieceType.PAWN:
        return getPossiblePawnMoves(piece, boardState);
      case PieceType.KNIGHT:
        return getPossibleKnightMoves(piece, boardState);
      case PieceType.BISHOP:
        return getPossibleBishopMoves(piece, boardState);
      case PieceType.ROOK:
        return getPossibleRookMoves(piece, boardState);
      case PieceType.QUEEN:
        return getPossibleQueenMoves(piece, boardState);
      case PieceType.KING:
        return getPossibleKingMoves(piece, boardState);
      default:
        return [];
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

    updatePossibleMoves();
    modalRef.current?.classList.add('hidden');
  }

  function promotionTeamType() {
    return (promotionPawn?.team === TeamType.WHITE) ? 'white' : 'black';
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
      <Chessboard 
        playMove={playMove}
        pieces={pieces}
      />
    </>
  )
}

export default Arbiter;