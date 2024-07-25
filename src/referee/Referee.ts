import { PieceType, TeamType, Piece } from "../components/Chessboard";

export default class Referee {
  tileIsOccupied(x: number, y: number, boardState: Piece[]): boolean {
    console.log("Checking if tile is occupied...")

    const piece = boardState.find(p => p.x === x && p.y === y)
    if (piece) {
      return true;
    } else {
      return false;
    }
  }

  isValidMove(
    px: number, 
    py: number, 
    x: number, 
    y: number, 
    type: PieceType, 
    team: TeamType,
    boardState: Piece[]
  ) {
    console.log('Referee is checking the move...')
    console.log('Previous Location: ', px, py)
    console.log('Current Location: ', x, y)
    console.log('PieceType: ', type)
    console.log('TeamType: ', team)

    if (type === PieceType.PAWN) {
      const specialRow = (team === TeamType.WHITE) ? 6 : 1;
      const pawnDirection =(team === TeamType.WHITE) ? 1 : -1

      if(px === x &&py === specialRow && py - y === 2*pawnDirection) {
        if (!this.tileIsOccupied(x, y, boardState) && !this.tileIsOccupied(x, y+pawnDirection, boardState)) {
          return true;
        }
      } else if (px === x && py - y === pawnDirection) {
        if (!this.tileIsOccupied(x, y, boardState)){
          return true;
        }
      }
    }
    return false;
  }
}