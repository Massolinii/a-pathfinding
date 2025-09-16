import { BinaryHeap } from "./BinaryHeap";
import type { Position, Node, PathfindingConfig } from "../types";

export class AStar {
  private config: PathfindingConfig;

  constructor(config: PathfindingConfig) {
    this.config = config;
  }

  findPath(start: Position, goal: Position, walls: Set<string>): Position[] {
    // Quick check if start and goal are the same
    if (start.x === goal.x && start.y === goal.y) {
      return [start];
    }

    // Quick check if goal is a wall
    const goalKey = this.getKey(goal);
    if (walls.has(goalKey)) {
      return [];
    }

    const openSet = new BinaryHeap<Node>((a, b) => a.f - b.f);
    const closedSet = new Set<string>();
    const nodes: Map<string, Node> = new Map();

    // Create start node
    const startNode: Node = {
      x: start.x,
      y: start.y,
      g: 0,
      h: this.heuristic(start, goal),
      f: 0,
      parent: null,
      isWall: false,
    };
    startNode.f = startNode.g + startNode.h;

    openSet.push(startNode);
    nodes.set(this.getKey(start), startNode);

    let iterations = 0;
    const maxIterations = this.config.gridSize * this.config.gridSize; // Prevent infinite loops

    while (!openSet.isEmpty() && iterations < maxIterations) {
      iterations++;
      const current = openSet.pop()!;
      const currentKey = this.getKey(current);

      if (currentKey === goalKey) {
        return this.reconstructPath(current);
      }

      closedSet.add(currentKey);

      const neighbors = this.getNeighbors(current, walls);

      for (const neighbor of neighbors) {
        const neighborKey = this.getKey(neighbor);

        if (closedSet.has(neighborKey)) continue;

        const tentativeG = current.g + this.getDistance(current, neighbor);

        let neighborNode = nodes.get(neighborKey);
        if (!neighborNode) {
          neighborNode = {
            x: neighbor.x,
            y: neighbor.y,
            g: Infinity,
            h: this.heuristic(neighbor, goal),
            f: Infinity,
            parent: null,
            isWall: walls.has(neighborKey),
          };
          nodes.set(neighborKey, neighborNode);
        }

        if (tentativeG < neighborNode.g) {
          neighborNode.g = tentativeG;
          neighborNode.f = neighborNode.g + neighborNode.h;
          neighborNode.parent = current;
          openSet.push(neighborNode);
        }
      }
    }

    return []; // No path found
  }

  private getNeighbors(node: Node, walls: Set<string>): Position[] {
    const neighbors: Position[] = [];
    const directions = this.config.allowDiagonal
      ? [
          { x: -1, y: -1 },
          { x: 0, y: -1 },
          { x: 1, y: -1 },
          { x: -1, y: 0 },
          { x: 1, y: 0 },
          { x: -1, y: 1 },
          { x: 0, y: 1 },
          { x: 1, y: 1 },
        ]
      : [
          { x: 0, y: -1 }, // Up
          { x: 1, y: 0 }, // Right
          { x: 0, y: 1 }, // Down
          { x: -1, y: 0 }, // Left
        ];

    for (const dir of directions) {
      const x = node.x + dir.x;
      const y = node.y + dir.y;

      if (
        x >= 0 &&
        x < this.config.gridSize &&
        y >= 0 &&
        y < this.config.gridSize
      ) {
        const key = this.getKey({ x, y });
        if (!walls.has(key)) {
          neighbors.push({ x, y });
        }
      }
    }

    return neighbors;
  }

  private heuristic(a: Position, b: Position): number {
    if (this.config.allowDiagonal) {
      // Euclidean distance
      const dx = Math.abs(a.x - b.x);
      const dy = Math.abs(a.y - b.y);
      return Math.sqrt(dx * dx + dy * dy);
    } else {
      // Manhattan distance
      return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }
  }

  private getDistance(a: Node, b: Position): number {
    const dx = Math.abs(a.x - b.x);
    const dy = Math.abs(a.y - b.y);

    if (this.config.allowDiagonal) {
      return Math.sqrt(dx * dx + dy * dy);
    } else {
      return dx + dy;
    }
  }

  private getKey(pos: Position): string {
    return `${pos.x},${pos.y}`;
  }

  private reconstructPath(node: Node): Position[] {
    const path: Position[] = [];
    let current: Node | null = node;

    while (current) {
      path.unshift({ x: current.x, y: current.y });
      current = current.parent;
    }

    return path;
  }
}
