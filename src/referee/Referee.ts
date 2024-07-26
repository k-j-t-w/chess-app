import { PieceType, TeamType, Piece, Position } from "../Constants";

export default class Referee {
  tileIsOccupied(x: number, y: number, boardState: Piece[]): boolean {

    const piece = boardState.find(p => p.position.x === x && p.position.y === y)
    if (piece) {
      return true;
    } else {
      return false;
    }
  }

  tileIsOccupiedByOppenent(x: number, y: number, boardState: Piece[], team: TeamType): boolean {
    const piece = boardState.find((p) => p.position.x === x && p.position.y === y && p.team !== team)

    if (piece) {
      return true
    } else {
      return false;
    }
  }

  isEnPassantMove(
    initialPosition: Position,
    desiredPosition: Position, 
    type: PieceType, 
    team: TeamType,
    boardState: Piece[]
  ) {
    const pawnDirection = (team === TeamType.WHITE) ? 1 : -1;

    if(type === PieceType.PAWN) {
      if ((desiredPosition.x - initialPosition.x === -1 || desiredPosition.x - initialPosition.x === 1) && initialPosition.y - desiredPosition.y === pawnDirection) {
        const piece = boardState.find(p => p.position.x === desiredPosition.x && p.position.y === desiredPosition.y + pawnDirection && p.enPassant);
        if(piece) {
          return true;
        }
      }  
    }

    return false;
  }


  isValidMove(
    initialPosition: Position,
    desiredPosition: Position,
    type: PieceType, 
    team: TeamType,
    boardState: Piece[]
  ) {

    // PAWN LOGIC
    // MOVEMENT LOGIC
    if (type === PieceType.PAWN) {
      const specialRow = (team === TeamType.WHITE) ? 6 : 1;
      const pawnDirection = (team === TeamType.WHITE) ? 1 : -1

      if(initialPosition.x === desiredPosition.x && initialPosition.y === specialRow && initialPosition.y - desiredPosition.y === 2*pawnDirection) {
        if (!this.tileIsOccupied(desiredPosition.x, desiredPosition.y, boardState) && !this.tileIsOccupied(desiredPosition.x, desiredPosition.y+pawnDirection, boardState)) {
          return true;
        }
      } else if (initialPosition.x === desiredPosition.x && initialPosition.y - desiredPosition.y === pawnDirection) {
        if (!this.tileIsOccupied(desiredPosition.x, desiredPosition.y, boardState)){
          return true;
        }
        // ATTACK LOGIC
      } else if (desiredPosition.x - initialPosition.x === -1 && initialPosition.y - desiredPosition.y === pawnDirection) {
        // LEFT ATTACK

        if(this.tileIsOccupiedByOppenent(desiredPosition.x, desiredPosition.y, boardState, team)) {
          return true;
        }
      }  else if (desiredPosition.x - initialPosition.x === 1 && initialPosition.y - desiredPosition.y === pawnDirection) {
        // RIGHT ATTACK

        if(this.tileIsOccupiedByOppenent(desiredPosition.x, desiredPosition.y, boardState, team)) {
          return true;
        }
      }

    }
    return false;
  }
}