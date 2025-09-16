export interface Position {
  x: number;
  y: number;
}

export interface Node {
  x: number;
  y: number;
  g: number; // Cost from start
  h: number; // Heuristic cost to goal
  f: number; // Total cost (g + h)
  parent: Node | null;
  isWall: boolean;
}

export interface PathfindingConfig {
  allowDiagonal: boolean;
  followerSpeed: number; // milliseconds between moves
  gridSize: number;
  showGrid: boolean;
  theme: "modern"; // Keep for compatibility but only use one theme
}

export interface GridState {
  walls: Set<string>; // Set of "x,y" strings
  goal: Position;
  follower: Position;
  path: Position[];
}
