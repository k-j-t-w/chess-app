import { Piece, Position, samePosition, TeamType } from "../../Constants";
import { tileIsEmptyOrOccupiedByOpponent, tileIsOccupied, tileIsOccupiedByOpponent } from "./GeneralRules";

export const kingMove = (initialPosition: Position, desiredPosition: Position, team: TeamType, boardState: Piece[]): boolean => {
  for(let i = 1; i < 2; i++) {
    //Diagonal
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
  return false;
}

export const getPossibleKingMoves = (king: Piece, boardState: Piece[]): Position[] => {
  const possibleMoves: Position[] = [];

  for(let i = 1; i < 2; i++) {
    // right movement
    const destination: Position = {x: king.position.x + i, y: king.position.y}

    if(!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, king.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }

  // left movement
  for(let i = 1; i < 2; i++) {
    const destination: Position = {x: king.position.x - i, y: king.position.y}

    if(!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, king.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }
  
  // up movement
  for(let i = 1; i < 2; i++) {
    const destination: Position = {x: king.position.x, y: king.position.y - i}

    if(!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, king.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }

  // down movement
  for(let i = 1; i < 2; i++) {
    const destination: Position = {x: king.position.x, y: king.position.y + i}

    if(!tileIsOccupied(destination, boardState)) {
      possibleMoves.push(destination);
    } else if (tileIsOccupiedByOpponent(destination, boardState, king.team)) {
      possibleMoves.push(destination);
      break;
    } else {
      break;
    }
  }

    // bottom right movement
    for(let i = 1; i < 2; i++) {
      const destination: Position = {x: king.position.x + i, y: king.position.y + i}
  
      if(!tileIsOccupied(destination, boardState)) {
        possibleMoves.push(destination);
      } else if (tileIsOccupiedByOpponent(destination, boardState, king.team)) {
        possibleMoves.push(destination);
        break;
      } else {
        break;
      }
    }
  
    // top right movement
    for(let i = 1; i < 2; i++) {
      const destination: Position = {x: king.position.x + i, y: king.position.y - i}
  
      if(!tileIsOccupied(destination, boardState)) {
        possibleMoves.push(destination);
      } else if (tileIsOccupiedByOpponent(destination, boardState, king.team)) {
        possibleMoves.push(destination);
        break;
      } else {
        break;
      }
    }
    
    // top left movement
    for(let i = 1; i < 2; i++) {
      const destination: Position = {x: king.position.x - i, y: king.position.y - i}
  
      if(!tileIsOccupied(destination, boardState)) {
        possibleMoves.push(destination);
      } else if (tileIsOccupiedByOpponent(destination, boardState, king.team)) {
        possibleMoves.push(destination);
        break;
      } else {
        break;
      }
    }
  
    // bottom left movement
    for(let i = 1; i < 2; i++) {
      const destination: Position = {x: king.position.x - i, y: king.position.y + i}
  
      if(!tileIsOccupied(destination, boardState)) {
        possibleMoves.push(destination);
      } else if (tileIsOccupiedByOpponent(destination, boardState, king.team)) {
        possibleMoves.push(destination);
        break;
      } else {
        break;
      }
    }
    


  return possibleMoves;
}