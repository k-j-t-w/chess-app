import { Piece, Position, TeamType } from "../../Constants";
import { tileIsOccupied, tileIsOccupiedByOpponent } from "./GeneralRules";

export const pawnMove = (initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean => {
  const specialRow = team === TeamType.WHITE ? 6 : 1;
  const pawnDirection = team === TeamType.WHITE ? -1 : 1;

  //MOVEMENT LOGIC
  if (
    initialPosition.x === desiredPosition.x &&
    initialPosition.y === specialRow &&
    desiredPosition.y - initialPosition.y === 2 * pawnDirection
  ) {
    if (
      !tileIsOccupied(desiredPosition, boardState) &&
      !tileIsOccupied(
        { x: desiredPosition.x, y: desiredPosition.y - pawnDirection },
        boardState
      )
    ) {
      return true;
    }
  } else if (
    initialPosition.x === desiredPosition.x &&
    desiredPosition.y - initialPosition.y === pawnDirection
  ) {
    if (!tileIsOccupied(desiredPosition, boardState)) {
      return true;
    }
  }
  //ATTACK LOGIC
  else if ( Math.abs(desiredPosition.x - initialPosition.x) === 1 && desiredPosition.y - initialPosition.y === pawnDirection) {
    if (tileIsOccupiedByOpponent(desiredPosition, boardState, team)) {
      return true;
    }
  }

  return false;
}

export const GetPossiblePawnMoves = (pawn: Piece, boardState: Piece[]) : Position[] => {
  const possibleMoves: Position[] = [];
  const pawnDirection = pawn.team === TeamType.WHITE ? -1 : 1;
  const specialRow = pawn.team === TeamType.WHITE ? 6 : 1;

  if (!tileIsOccupied({x: pawn.position.x, y: pawn.position.y + pawnDirection}, boardState)) {
    possibleMoves.push({x: pawn.position.x, y: pawn.position.y + pawnDirection});

    if(pawn.position.y === specialRow && !tileIsOccupied({x: pawn.position.x, y: pawn.position.y + pawnDirection * 2}, boardState)) {
      possibleMoves.push({x: pawn.position.x, y: pawn.position.y + pawnDirection * 2})
    }
  }

  return possibleMoves;
}