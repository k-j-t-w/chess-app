import { Piece, Position, samePosition, TeamType } from "../../Constants";
import { tileIsEmptyOrOccupiedByOpponent, tileIsOccupied } from "./GeneralRules";

export const rookMove = (initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean => {
  if (
    (desiredPosition.x !== initialPosition.x && desiredPosition.y === initialPosition.y) ||
    (desiredPosition.x === initialPosition.x && desiredPosition.y !== initialPosition.y)
  ) {
    for(let i = 1; i < 8; i++) {
      const multiplierX = (desiredPosition.x < initialPosition.x) ? -1 : (desiredPosition.x > initialPosition.x) ? 1 : 0;
      const multiplierY = (desiredPosition.y < initialPosition.y) ? -1 : (desiredPosition.y > initialPosition.y) ? 1 : 0;

      const passedPosition: Position = {x: initialPosition.x + (i * multiplierX), y: initialPosition.y + (i * multiplierY)};

      if(samePosition(passedPosition, desiredPosition)) {
        if(tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
          return true;
        }
      } else {
        if(tileIsOccupied(passedPosition, boardState)) {
          break;
        }
      }
    }
  }
  return false;
}
