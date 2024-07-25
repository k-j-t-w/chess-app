import { PieceType, TeamType, Piece } from "../components/Chessboard";

export default class Referee {
  tileIsOccupied(x: number, y: number, boardState: Piece[]): boolean {

    const piece = boardState.find(p => p.x === x && p.y === y)
    if (piece) {
      return true;
    } else {
      return false;
    }
  }

  tileIsOccupiedByOppenent(x: number, y: number, boardState: Piece[], team: TeamType): boolean {
    const piece = boardState.find((p) => p.x === x && p.y === y && p.team !== team)

    if (piece) {
      return true
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
    // console.log('Referee is checking the move...')
    // console.log('Previous Location: ', px, py)
    // console.log('Current Location: ', x, y)
    // console.log('PieceType: ', type)
    // console.log('TeamType: ', team)

    // MOVEMENT LOGIC
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
        // ATTACK LOGIC
      } else if (x - px === -1 && py - y === pawnDirection) {
        // LEFT ATTACK
        console.log('left attack')
        if(this.tileIsOccupiedByOppenent(x, y, boardState, team)) {
          return true;
        }
      }  else if (x - px === 1 && py - y === pawnDirection) {
        // RIGHT ATTACK
        console.log('right attack')
        if(this.tileIsOccupiedByOppenent(x, y, boardState, team)) {
          return true;
        }
      }

    }
    return false;
  }
}