import { normalize } from "path";
import { Piece, PieceType, Position, samePosition, TeamType } from "../../Constants";
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

export const getPossiblePawnMoves = (pawn: Piece, boardState: Piece[]) : Position[] => {
  const possibleMoves: Position[] = [];
  const pawnDirection = pawn.team === TeamType.WHITE ? -1 : 1;
  const specialRow = pawn.team === TeamType.WHITE ? 6 : 1;

  const normalMove: Position = {x: pawn.position.x, y: pawn.position.y + pawnDirection}
  const specialMove: Position = {x: normalMove.x, y: normalMove.y + pawnDirection}
  const upperLeftAttack: Position = {x: pawn.position.x -1, y: pawn.position.y + pawnDirection}
  const upperRightAttack: Position = {x: pawn.position.x + 1, y: pawn.position.y + pawnDirection}
  const leftEnPassantPosition: Position = {x: pawn.position.x - 1, y: pawn.position.y}
  const rightEnPassantPosition: Position = {x: pawn.position.x + 1, y: pawn.position.y}



  if (!tileIsOccupied(normalMove, boardState)) {
    possibleMoves.push(normalMove);

    if(pawn.position.y === specialRow && !tileIsOccupied(specialMove, boardState)) {
      possibleMoves.push(specialMove)
    }
  }

  if(tileIsOccupiedByOpponent(upperLeftAttack, boardState, pawn.team)) {
    possibleMoves.push(upperLeftAttack);
  } else if(!tileIsOccupied(upperLeftAttack, boardState)) {
    const leftPiece = boardState.find(p => samePosition(p.position, leftEnPassantPosition))
    if (leftPiece !== null && leftPiece?.enPassant) {
      possibleMoves.push(upperLeftAttack)
    }
  }

  if(tileIsOccupiedByOpponent(upperRightAttack, boardState, pawn.team)) {
    possibleMoves.push(upperRightAttack);
  } else if(!tileIsOccupied(upperRightAttack, boardState)) {
    const rightPiece = boardState.find(p => samePosition(p.position, rightEnPassantPosition))
    if (rightPiece !== null && rightPiece?.enPassant) {
      possibleMoves.push(upperRightAttack)
    }
  }

  return possibleMoves;
}