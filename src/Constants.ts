export const VERTICAL_AXIS = ["1", "2", "3", "4", "5", "6", "7", "8"];
export const HORIXONTAL_AXIS = ["a", "b", "c", "d", "e", "f", "g", "h"];

export const GRID_SIZE = 100;

export function samePosition(p1: Position, p2: Position) {
  return p1.x === p2.x && p1.y === p2.y;
}

export interface Position {
  x: number;
  y: number;
}

export enum TeamType {
  BLACK,
  WHITE
}

export enum PieceType {
  PAWN,
  BISHOP,
  KNIGHT,
  ROOK,
  QUEEN,
  KING
}

export interface Piece {
  image: string;
  position: Position;
  type: PieceType;
  team: TeamType;
  enPassant?: boolean;
}

export const initialBoardState: Piece[] = [
  {image: 'images/black-rook.png', position: {x: 0, y: 0}, type: PieceType.ROOK, team: TeamType.BLACK},
  {image: 'images/black-rook.png', position: {x: 7, y: 0}, type: PieceType.ROOK, team: TeamType.BLACK},
  {image: 'images/black-knight.png', position: {x: 1, y: 0}, type: PieceType.KNIGHT, team: TeamType.BLACK},
  {image: 'images/black-knight.png', position: {x: 6, y: 0}, type: PieceType.KNIGHT, team: TeamType.BLACK},
  {image: 'images/black-bishop.png', position: {x: 2, y: 0}, type: PieceType.BISHOP, team: TeamType.BLACK},
  {image: 'images/black-bishop.png', position: {x: 5, y: 0}, type: PieceType.BISHOP, team: TeamType.BLACK},
  {image: 'images/black-queen.png', position: {x: 3, y: 0}, type: PieceType.QUEEN, team: TeamType.BLACK},
  {image: 'images/black-king.png', position: {x: 4, y: 0}, type: PieceType.KING, team: TeamType.BLACK},
  {image: 'images/black-pawn.png', position: {x: 0, y: 1}, type: PieceType.PAWN, team: TeamType.BLACK},
  {image: 'images/black-pawn.png', position: {x: 1, y: 1}, type: PieceType.PAWN, team: TeamType.BLACK},
  {image: 'images/black-pawn.png', position: {x: 2, y: 1}, type: PieceType.PAWN, team: TeamType.BLACK},
  {image: 'images/black-pawn.png', position: {x: 3, y: 1}, type: PieceType.PAWN, team: TeamType.BLACK},
  {image: 'images/black-pawn.png', position: {x: 4, y: 1}, type: PieceType.PAWN, team: TeamType.BLACK},
  {image: 'images/black-pawn.png', position: {x: 5, y: 1}, type: PieceType.PAWN, team: TeamType.BLACK},
  {image: 'images/black-pawn.png', position: {x: 6, y: 1}, type: PieceType.PAWN, team: TeamType.BLACK},
  {image: 'images/black-pawn.png', position: {x: 7, y: 1}, type: PieceType.PAWN, team: TeamType.BLACK},
  {image: 'images/white-rook.png', position: {x: 0, y: 7}, type: PieceType.ROOK, team: TeamType.WHITE},
  {image: 'images/white-rook.png', position: {x: 7, y: 7}, type: PieceType.ROOK, team: TeamType.WHITE},
  {image: 'images/white-knight.png', position: {x: 1, y: 7}, type: PieceType.KNIGHT, team: TeamType.WHITE},
  {image: 'images/white-knight.png', position: {x: 6, y: 7}, type: PieceType.KNIGHT, team: TeamType.WHITE},
  {image: 'images/white-bishop.png', position: {x: 2, y: 7}, type: PieceType.BISHOP, team: TeamType.WHITE},
  {image: 'images/white-bishop.png', position: {x: 5, y: 7}, type: PieceType.BISHOP, team: TeamType.WHITE},
  {image: 'images/white-queen.png', position: {x: 3, y: 7}, type: PieceType.QUEEN, team: TeamType.WHITE},
  {image: 'images/white-king.png', position: {x: 4, y: 7}, type: PieceType.KING, team: TeamType.WHITE},
  {image: 'images/white-pawn.png', position: {x: 0, y: 6}, type: PieceType.PAWN, team: TeamType.WHITE},
  {image: 'images/white-pawn.png', position: {x: 1, y: 6}, type: PieceType.PAWN, team: TeamType.WHITE},
  {image: 'images/white-pawn.png', position: {x: 2, y: 6}, type: PieceType.PAWN, team: TeamType.WHITE},
  {image: 'images/white-pawn.png', position: {x: 3, y: 6}, type: PieceType.PAWN, team: TeamType.WHITE},
  {image: 'images/white-pawn.png', position: {x: 4, y: 6}, type: PieceType.PAWN, team: TeamType.WHITE},
  {image: 'images/white-pawn.png', position: {x: 5, y: 6}, type: PieceType.PAWN, team: TeamType.WHITE},
  {image: 'images/white-pawn.png', position: {x: 6, y: 6}, type: PieceType.PAWN, team: TeamType.WHITE},
  {image: 'images/white-pawn.png', position: {x: 7, y: 6}, type: PieceType.PAWN, team: TeamType.WHITE},
];