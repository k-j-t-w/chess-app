import { PieceType, TeamType, Piece, Position } from "../Constants";

export default class Referee {
  tileIsOccupied(x: number, y: number, boardState: Piece[]): boolean {

    const piece = boardState.find(p => p.position.x === x && p.position.y === y)
    if (piece) {
      return true;
    } else {
      return false;
    }
  }

  tileIsOccupiedByOppenent(x: number, y: number, boardState: Piece[], team: TeamType): boolean {
    const piece = boardState.find((p) => p.position.x === x && p.position.y === y && p.team !== team)

    if (piece) {
      return true
    } else {
      return false;
    }
  }

  isEnPassantMove(
    initialPosition: Position,
    desiredPosition: Position, 
    type: PieceType, 
    team: TeamType,
    boardState: Piece[]
  ) {
    const pawnDirection = (team === TeamType.WHITE) ? 1 : -1;

    if(type === PieceType.PAWN) {
      if ((desiredPosition.x - initialPosition.x === -1 || desiredPosition.x - initialPosition.x === 1) && initialPosition.y - desiredPosition.y === pawnDirection) {
        const piece = boardState.find(p => p.position.x === desiredPosition.x && p.position.y === desiredPosition.y + pawnDirection && p.enPassant);
        if(piece) {
          return true;
        }
      }  
    }

    return false;
  }


  isValidMove(
    initialPosition: Position,
    desiredPosition: Position,
    type: PieceType, 
    team: TeamType,
    boardState: Piece[]
  ) {

    // PAWN LOGIC
    // MOVEMENT LOGIC
    if (type === PieceType.PAWN) {
      const specialRow = (team === TeamType.WHITE) ? 6 : 1;
      const pawnDirection = (team === TeamType.WHITE) ? 1 : -1

      if(initialPosition.x === desiredPosition.x && initialPosition.y === specialRow && initialPosition.y - desiredPosition.y === 2*pawnDirection) {
        if (!this.tileIsOccupied(desiredPosition.x, desiredPosition.y, boardState) && !this.tileIsOccupied(desiredPosition.x, desiredPosition.y+pawnDirection, boardState)) {
          return true;
        }
      } else if (initialPosition.x === desiredPosition.x && initialPosition.y - desiredPosition.y === pawnDirection) {
        if (!this.tileIsOccupied(desiredPosition.x, desiredPosition.y, boardState)){
          return true;
        }
        // ATTACK LOGIC
      } else if (Math.abs(desiredPosition.x - initialPosition.x) === 1 && initialPosition.y - desiredPosition.y === pawnDirection) {

        if(this.tileIsOccupiedByOppenent(desiredPosition.x, desiredPosition.y, boardState, team)) {
          return true;
        }
      } 

      // KNIGHT LOGIC
    } else if (type === PieceType.KNIGHT) {
      if ((Math.abs(initialPosition.x - desiredPosition.x) === 1 && Math.abs(initialPosition.y - desiredPosition.y) === 2 ) || 
          (Math.abs(initialPosition.x - desiredPosition.x) === 2 && Math.abs(initialPosition.y - desiredPosition.y) === 1)) {
        if(!this.tileIsOccupied(desiredPosition.x, desiredPosition.y, boardState)) {
          return true;
        } else if (this.tileIsOccupiedByOppenent(desiredPosition.x, desiredPosition.y, boardState, team)) {
          return true;
        }
      } 
      // BISHOP LOGIC
    } else if (type === PieceType.BISHOP) {

      if (Math.abs(desiredPosition.x - initialPosition.x) === Math.abs(desiredPosition.y - initialPosition.y))  {
        // bottom right logic
        if (desiredPosition.x > initialPosition.x && desiredPosition.y > initialPosition.y ) {
          for(let i = 0; i < desiredPosition.x - initialPosition.x - 1; i++) {
            if (this.tileIsOccupied(initialPosition.x + 1 + i, initialPosition.y + 1 + i, boardState)) {
              return false;
            }
          }
          if(!this.tileIsOccupied(desiredPosition.x, desiredPosition.y, boardState)) {
            return true;
          } else if (this.tileIsOccupiedByOppenent(desiredPosition.x, desiredPosition.y, boardState, team)) {
            return true;
          }
          // top right logic
        } else if (desiredPosition.x > initialPosition.x && desiredPosition.y < initialPosition.y) {
          for(let i = 0; i < desiredPosition.x - initialPosition.x - 1; i++) {
            if (this.tileIsOccupied(initialPosition.x + 1 + i, initialPosition.y - 1 - i, boardState)) {
              return false;
            }
          }
          if(!this.tileIsOccupied(desiredPosition.x, desiredPosition.y, boardState)) {
            return true;
          } else if (this.tileIsOccupiedByOppenent(desiredPosition.x, desiredPosition.y, boardState, team)) {
            return true;
          }
          // top left
        } else if (desiredPosition.x < initialPosition.x && desiredPosition.y < initialPosition.y) {
          for(let i = 0; i < initialPosition.x - desiredPosition.x - 1; i++) {
            if (this.tileIsOccupied(initialPosition.x - 1 - i, initialPosition.y - 1 - i, boardState)) {
              return false;
            }
          }
          if(!this.tileIsOccupied(desiredPosition.x, desiredPosition.y, boardState)) {
            return true;
          } else if (this.tileIsOccupiedByOppenent(desiredPosition.x, desiredPosition.y, boardState, team)) {
            return true;
          }
          //bottom left
        } else if (desiredPosition.x < initialPosition.x && desiredPosition.y > initialPosition.y) {
          for(let i = 0; i < initialPosition.x - desiredPosition.x - 1; i++) {
            if (this.tileIsOccupied(initialPosition.x - 1 - i, initialPosition.y + 1 + i, boardState)) {
              return false;
            }
          }
          if(!this.tileIsOccupied(desiredPosition.x, desiredPosition.y, boardState)) {
            return true;
          } else if (this.tileIsOccupiedByOppenent(desiredPosition.x, desiredPosition.y, boardState, team)) {
            return true;
          }
        }
      }
    // ROOK LOGIC
    } else if (type === PieceType.ROOK) {
      if ((desiredPosition.x - initialPosition.x !== 0 && desiredPosition.y === initialPosition.y ) || (desiredPosition.y - initialPosition.y !== 0 && desiredPosition.x === initialPosition.x))  {
        // left logic
        if (desiredPosition.x < initialPosition.x && desiredPosition.y === initialPosition.y) {
          for(let i = 0; i < initialPosition.x - desiredPosition.x - 1; i++) {
            if (this.tileIsOccupied(initialPosition.x - 1 - i, initialPosition.y, boardState)) {
              return false;
            }
          }
          if(!this.tileIsOccupied(desiredPosition.x, desiredPosition.y, boardState)) {
            return true;
          } else if (this.tileIsOccupiedByOppenent(desiredPosition.x, desiredPosition.y, boardState, team)) {
            return true;
          }
          // right logic
        } else if (desiredPosition.x > initialPosition.x && desiredPosition.y === initialPosition.y) {
          for(let i = 0; i < desiredPosition.x - initialPosition.x - 1; i++) {
            if (this.tileIsOccupied(initialPosition.x + 1 + i, initialPosition.y, boardState)) {
              return false;
            }
          }
          if(!this.tileIsOccupied(desiredPosition.x, desiredPosition.y, boardState)) {
            return true;
          } else if (this.tileIsOccupiedByOppenent(desiredPosition.x, desiredPosition.y, boardState, team)) {
            return true;
          }
          // up logic
        } else if (desiredPosition.x === initialPosition.x && desiredPosition.y < initialPosition.y) {
          for(let i = 0; i < initialPosition.y - desiredPosition.y - 1; i++) {
            if (this.tileIsOccupied(initialPosition.x, initialPosition.y - 1 - i, boardState)) {
              return false;
            }
          }
          if(!this.tileIsOccupied(desiredPosition.x, desiredPosition.y, boardState)) {
            return true;
          } else if (this.tileIsOccupiedByOppenent(desiredPosition.x, desiredPosition.y, boardState, team)) {
            return true;
          }
          // down logic
        } else if (desiredPosition.x === initialPosition.x && desiredPosition.y > initialPosition.y) {
          for(let i = 0; i < desiredPosition.y - initialPosition.y - 1; i++) {
            if (this.tileIsOccupied(initialPosition.x, initialPosition.y + 1 + i, boardState)) {
              return false;
            }
          }
          if(!this.tileIsOccupied(desiredPosition.x, desiredPosition.y, boardState)) {
            return true;
          } else if (this.tileIsOccupiedByOppenent(desiredPosition.x, desiredPosition.y, boardState, team)) {
            return true;
          }
        }
      }
      // QUEEN LOGIC
    } else if (type === PieceType.QUEEN) {
      if ((desiredPosition.x - initialPosition.x !== 0 && desiredPosition.y === initialPosition.y ) || (desiredPosition.y - initialPosition.y !== 0 && desiredPosition.x === initialPosition.x))  {
        // left logic
        if (desiredPosition.x < initialPosition.x && desiredPosition.y === initialPosition.y) {
          for(let i = 0; i < initialPosition.x - desiredPosition.x - 1; i++) {
            if (this.tileIsOccupied(initialPosition.x - 1 - i, initialPosition.y, boardState)) {
              return false;
            }
          }
          if(!this.tileIsOccupied(desiredPosition.x, desiredPosition.y, boardState)) {
            return true;
          } else if (this.tileIsOccupiedByOppenent(desiredPosition.x, desiredPosition.y, boardState, team)) {
            return true;
          }
          // right logic
        } else if (desiredPosition.x > initialPosition.x && desiredPosition.y === initialPosition.y) {
          for(let i = 0; i < desiredPosition.x - initialPosition.x - 1; i++) {
            if (this.tileIsOccupied(initialPosition.x + 1 + i, initialPosition.y, boardState)) {
              return false;
            }
          }
          if(!this.tileIsOccupied(desiredPosition.x, desiredPosition.y, boardState)) {
            return true;
          } else if (this.tileIsOccupiedByOppenent(desiredPosition.x, desiredPosition.y, boardState, team)) {
            return true;
          }
          // up logic
        } else if (desiredPosition.x === initialPosition.x && desiredPosition.y < initialPosition.y) {
          for(let i = 0; i < initialPosition.y - desiredPosition.y - 1; i++) {
            if (this.tileIsOccupied(initialPosition.x, initialPosition.y - 1 - i, boardState)) {
              return false;
            }
          }
          if(!this.tileIsOccupied(desiredPosition.x, desiredPosition.y, boardState)) {
            return true;
          } else if (this.tileIsOccupiedByOppenent(desiredPosition.x, desiredPosition.y, boardState, team)) {
            return true;
          }
          // down logic
        } else if (desiredPosition.x === initialPosition.x && desiredPosition.y > initialPosition.y) {
          for(let i = 0; i < desiredPosition.y - initialPosition.y - 1; i++) {
            if (this.tileIsOccupied(initialPosition.x, initialPosition.y + 1 + i, boardState)) {
              return false;
            }
          }
          if(!this.tileIsOccupied(desiredPosition.x, desiredPosition.y, boardState)) {
            return true;
          } else if (this.tileIsOccupiedByOppenent(desiredPosition.x, desiredPosition.y, boardState, team)) {
            return true;
          }
        }
      } else       if (Math.abs(desiredPosition.x - initialPosition.x) === Math.abs(desiredPosition.y - initialPosition.y))  {
        // bottom right logic
        if (desiredPosition.x > initialPosition.x && desiredPosition.y > initialPosition.y ) {
          for(let i = 0; i < desiredPosition.x - initialPosition.x - 1; i++) {
            if (this.tileIsOccupied(initialPosition.x + 1 + i, initialPosition.y + 1 + i, boardState)) {
              return false;
            }
          }
          if(!this.tileIsOccupied(desiredPosition.x, desiredPosition.y, boardState)) {
            return true;
          } else if (this.tileIsOccupiedByOppenent(desiredPosition.x, desiredPosition.y, boardState, team)) {
            return true;
          }
          // top right logic
        } else if (desiredPosition.x > initialPosition.x && desiredPosition.y < initialPosition.y) {
          for(let i = 0; i < desiredPosition.x - initialPosition.x - 1; i++) {
            if (this.tileIsOccupied(initialPosition.x + 1 + i, initialPosition.y - 1 - i, boardState)) {
              return false;
            }
          }
          if(!this.tileIsOccupied(desiredPosition.x, desiredPosition.y, boardState)) {
            return true;
          } else if (this.tileIsOccupiedByOppenent(desiredPosition.x, desiredPosition.y, boardState, team)) {
            return true;
          }
          // top left
        } else if (desiredPosition.x < initialPosition.x && desiredPosition.y < initialPosition.y) {
          for(let i = 0; i < initialPosition.x - desiredPosition.x - 1; i++) {
            if (this.tileIsOccupied(initialPosition.x - 1 - i, initialPosition.y - 1 - i, boardState)) {
              return false;
            }
          }
          if(!this.tileIsOccupied(desiredPosition.x, desiredPosition.y, boardState)) {
            return true;
          } else if (this.tileIsOccupiedByOppenent(desiredPosition.x, desiredPosition.y, boardState, team)) {
            return true;
          }
          //bottom left
        } else if (desiredPosition.x < initialPosition.x && desiredPosition.y > initialPosition.y) {
          for(let i = 0; i < initialPosition.x - desiredPosition.x - 1; i++) {
            if (this.tileIsOccupied(initialPosition.x - 1 - i, initialPosition.y + 1 + i, boardState)) {
              return false;
            }
          }
          if(!this.tileIsOccupied(desiredPosition.x, desiredPosition.y, boardState)) {
            return true;
          } else if (this.tileIsOccupiedByOppenent(desiredPosition.x, desiredPosition.y, boardState, team)) {
            return true;
          }
        }
      }
    // KING LOGIC
    } else if (type === PieceType.KING) {
      if (
        (Math.abs(desiredPosition.x - initialPosition.x) === 1 && Math.abs(desiredPosition.y - initialPosition.y) === 1) ||
        (Math.abs(desiredPosition.x - initialPosition.x) === 1 && desiredPosition.y === initialPosition.y) ||
        (Math.abs(desiredPosition.y - initialPosition.y) === 1 && desiredPosition.x === initialPosition.x)
      ) {
        if(!this.tileIsOccupied(desiredPosition.x, desiredPosition.y, boardState)) {
          return true;
        } else if (this.tileIsOccupiedByOppenent(desiredPosition.x, desiredPosition.y, boardState, team)) {
          return true;
        }
      }
    }

    return false;
  }
}