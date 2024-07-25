import { PieceType, TeamType } from "../components/Chessboard";

export default class Referee {
  isValidMove(px: number, py: number, x: number, y: number, type: PieceType, team: TeamType) {
    console.log('Referee is checking the move...')
    console.log('Previous Location: ', px, py)
    console.log('Current Location: ', x, y)
    console.log('PieceType: ', type)
    console.log('TeamType: ', team)

    if (type === PieceType.PAWN) {
      if (team === TeamType.WHITE) {
        if (py === 6) {
          if (px === x && (py - y === 1 || py - y === 2)) {
            console.log('Valid Move! :)');
            return true;
          }
        } else {
          if (px === x && py - y === 1) {
            console.log('Valid Move! :)');
            return true;
          }
        }
      }
    }

    return false;
  }
}