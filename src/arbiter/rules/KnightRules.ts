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

export const getPossibleKnightMoves = (knight: Piece, boardState: Piece[]): Position[] => {
  const possibleMoves: Position[] = [];

  for (let i = -1; i < 2; i += 2) {
    for (let j = -1; j < 2; j += 2) {
      const verticalMove: Position = {x: knight.position.x + j, y: knight.position.y + i *2};
      const horixontalMove: Position = {x: knight.position.x + i * 2, y: knight.position.y + j };

      if (tileIsEmptyOrOccupiedByOpponent(verticalMove, boardState, knight.team)) {
        possibleMoves.push(verticalMove);
      }

      if (tileIsEmptyOrOccupiedByOpponent(horixontalMove, boardState, knight.team)) {
        possibleMoves.push(horixontalMove);
      }
    }
  }

  return possibleMoves;
}