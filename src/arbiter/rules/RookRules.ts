import { Piece, Position, samePosition, TeamType } from "../../Constants";
import { tileIsEmptyOrOccupiedByOpponent, tileIsOccupied, tileIsOccupiedByOpponent } from "./GeneralRules";

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

export const getPossibleRookMoves = (rook: Piece, boardState: Piece[]): Position[] => {
  const possibleMoves: Position[] = [];
  
  for(let i = 1; i < 8; i++) {
    // right movement
    const destination: Position = {x: rook.position.x + i, y: rook.position.y}

    if(!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, rook.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }

  // left movement
  for(let i = 1; i < 8; i++) {
    const destination: Position = {x: rook.position.x - i, y: rook.position.y}

    if(!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, rook.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }
  
  // up movement
  for(let i = 1; i < 8; i++) {
    const destination: Position = {x: rook.position.x, y: rook.position.y - i}

    if(!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, rook.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }

  // down movement
  for(let i = 1; i < 8; i++) {
    const destination: Position = {x: rook.position.x, y: rook.position.y + i}

    if(!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, rook.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }

  return possibleMoves;
}