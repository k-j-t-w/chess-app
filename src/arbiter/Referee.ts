import {
  PieceType,
  TeamType,
  Piece,
  Position,
} from "../Constants";

import { 
  pawnMove, 
  bishopMove, 
  rookMove, 
  knightMove, 
  queenMove, 
  kingMove, 
  getPossiblePawnMoves,
  getPossibleKnightMoves,
  getPossibleBishopMoves,
  getPossibleRookMoves,
  getPossibleQueenMoves,
  getPossibleKingMoves,
} from "./rules";


export default class Referee {

  isEnPassantMove(
    initialPosition: Position,
    desiredPosition: Position,
    type: PieceType,
    team: TeamType,
    boardState: Piece[]
  ) {
    const pawnDirection = team === TeamType.WHITE ? -1 : 1;

    if (type === PieceType.PAWN) {
      if (
        (desiredPosition.x - initialPosition.x === -1 ||
          desiredPosition.x - initialPosition.x === 1) &&
        desiredPosition.y - initialPosition.y === pawnDirection
      ) {
        const piece = boardState.find(
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

  isValidMove(initialPosition: Position, desiredPosition: Position, type: PieceType, team: TeamType, boardState: Piece[]) {
    let validMove = false;
    switch(type) {
      case PieceType.PAWN:
        validMove = pawnMove(initialPosition, desiredPosition, team, boardState);
        break;
      case PieceType.KNIGHT:
        validMove = knightMove(initialPosition, desiredPosition, team, boardState);
        break;
      case PieceType.BISHOP:
        validMove = bishopMove(initialPosition, desiredPosition, team, boardState);
        break;
      case PieceType.ROOK:
        validMove = rookMove(initialPosition, desiredPosition, team, boardState);
        break;
      case PieceType.QUEEN:
        validMove = queenMove(initialPosition, desiredPosition, team, boardState);
        break;
      case PieceType.KING:
        validMove = kingMove(initialPosition, desiredPosition, team, boardState);
    }
    return validMove;
  }

  getValidMoves(piece: Piece, boardState: Piece[]) : Position[] {
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
}