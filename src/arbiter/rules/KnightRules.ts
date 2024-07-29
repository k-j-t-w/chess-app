import { Piece, Position, TeamType } from "../../Constants";
import { tileIsEmptyOrOccupiedByOpponent } from "./GeneralRules";

export const knightMove = (initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean =>{
  if ((Math.abs(initialPosition.x - desiredPosition.x) === 1 && Math.abs(initialPosition.y - desiredPosition.y) === 2 ) || 
      (Math.abs(initialPosition.x - desiredPosition.x) === 2 && Math.abs(initialPosition.y - desiredPosition.y) === 1)) {
    if(tileIsEmptyOrOccupiedByOpponent({x: desiredPosition.x, y: desiredPosition.y}, boardState, team)) {
      return true;
    } 
  } 
  return false;
}