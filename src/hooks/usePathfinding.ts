import { useState, useEffect, useRef, useCallback } from "react";
import { AStar } from "../utils/AStar";
import type { Position, PathfindingConfig, GridState } from "../types";

export const usePathfinding = (config: PathfindingConfig) => {
  const [gridState, setGridState] = useState<GridState>({
    walls: new Set(),
    goal: { x: 15, y: 15 },
    follower: { x: 5, y: 5 },
    path: [],
  });

  const aStarRef = useRef<AStar | null>(null);
  const moveIntervalRef = useRef<number | undefined>(undefined);
  const isDraggingRef = useRef<boolean>(false);

  // Update A* instance when config changes
  useEffect(() => {
    aStarRef.current = new AStar(config);

    // Reset positions when grid size changes
    setGridState((prev) => ({
      ...prev,
      goal: {
        x: Math.min(prev.goal.x, config.gridSize - 1),
        y: Math.min(prev.goal.y, config.gridSize - 1),
      },
      follower: {
        x: Math.min(prev.follower.x, config.gridSize - 1),
        y: Math.min(prev.follower.y, config.gridSize - 1),
      },
    }));
  }, [config]);

  // Smart goal handling - find nearest reachable position if goal is on wall
  const findNearestReachableGoal = useCallback(
    (goal: Position, walls: Set<string>): Position => {
      const goalKey = `${goal.x},${goal.y}`;

      // If goal is not on a wall, return it as is
      if (!walls.has(goalKey)) {
        return goal;
      }

      // Find nearest reachable position
      const maxRadius = Math.min(config.gridSize, 10); // Limit search radius for performance

      for (let radius = 1; radius <= maxRadius; radius++) {
        for (let dx = -radius; dx <= radius; dx++) {
          for (let dy = -radius; dy <= radius; dy++) {
            // Only check positions on the perimeter of the current radius
            if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) continue;

            const x = goal.x + dx;
            const y = goal.y + dy;

            if (
              x >= 0 &&
              x < config.gridSize &&
              y >= 0 &&
              y < config.gridSize
            ) {
              const key = `${x},${y}`;
              if (!walls.has(key)) {
                return { x, y };
              }
            }
          }
        }
      }

      // Fallback: return original goal if no reachable position found
      return goal;
    },
    [config.gridSize]
  );

  // Calculate path with smart goal handling
  const calculatePath = useCallback(
    (start: Position, goal: Position, walls: Set<string>): Position[] => {
      if (!aStarRef.current) return [];

      const effectiveGoal = findNearestReachableGoal(goal, walls);
      return aStarRef.current.findPath(start, effectiveGoal, walls);
    },
    [findNearestReachableGoal]
  );

  // Update goal position
  const updateGoal = useCallback((goal: Position) => {
    setGridState((prev) => ({ ...prev, goal }));
  }, []);

  // Update walls
  const updateWalls = useCallback((walls: Set<string>) => {
    setGridState((prev) => ({ ...prev, walls }));
  }, []);

  // Toggle wall at position
  const toggleWall = useCallback((x: number, y: number) => {
    const key = `${x},${y}`;
    setGridState((prev) => {
      const newWalls = new Set(prev.walls);
      if (newWalls.has(key)) {
        newWalls.delete(key);
      } else {
        newWalls.add(key);
      }
      return { ...prev, walls: newWalls };
    });
  }, []);

  // Create wall at position
  const createWall = useCallback((x: number, y: number) => {
    const key = `${x},${y}`;
    setGridState((prev) => {
      const newWalls = new Set(prev.walls);
      newWalls.add(key);
      return { ...prev, walls: newWalls };
    });
  }, []);

  // Remove wall at position
  const removeWall = useCallback((x: number, y: number) => {
    const key = `${x},${y}`;
    setGridState((prev) => {
      const newWalls = new Set(prev.walls);
      newWalls.delete(key);
      return { ...prev, walls: newWalls };
    });
  }, []);

  // Initialize path on mount
  useEffect(() => {
    if (aStarRef.current) {
      const initialPath = calculatePath(
        gridState.follower,
        gridState.goal,
        gridState.walls
      );
      setGridState((prev) => ({ ...prev, path: initialPath }));
    }
  }, [calculatePath]);

  // Recalculate path when goal or walls change
  useEffect(() => {
    if (aStarRef.current) {
      const delay = isDraggingRef.current ? 100 : 30; // Moderate delay during drag
      const timeoutId = setTimeout(() => {
        const path = calculatePath(
          gridState.follower,
          gridState.goal,
          gridState.walls
        );
        setGridState((prev) => ({ ...prev, path }));
      }, delay);

      return () => clearTimeout(timeoutId);
    }
  }, [gridState.goal, gridState.walls, config, calculatePath]);

  // Recalculate path when follower moves - with smart debouncing
  useEffect(() => {
    if (aStarRef.current) {
      const delay = isDraggingRef.current ? 150 : 100; // Moderate delay during drag
      const timeoutId = setTimeout(() => {
        const path = calculatePath(
          gridState.follower,
          gridState.goal,
          gridState.walls
        );
        setGridState((prev) => ({ ...prev, path }));
      }, delay);

      return () => clearTimeout(timeoutId);
    }
  }, [gridState.follower, calculatePath]);

  // Continuous movement system - independent of mouse movement
  useEffect(() => {
    if (moveIntervalRef.current) {
      window.clearInterval(moveIntervalRef.current);
    }

    moveIntervalRef.current = window.setInterval(() => {
      setGridState((prev) => {
        // If we have a path, move along it
        if (prev.path.length > 1) {
          const newFollower = prev.path[1];
          if (
            newFollower.x !== prev.follower.x ||
            newFollower.y !== prev.follower.y
          ) {
            // Update follower position
            return { ...prev, follower: newFollower };
          }
        }

        // If we're at the goal or have no path, try to recalculate
        if (prev.path.length <= 1 && aStarRef.current) {
          const newPath = calculatePath(prev.follower, prev.goal, prev.walls);
          if (newPath.length > 1) {
            return { ...prev, path: newPath };
          }
        }

        return prev;
      });
    }, config.followerSpeed);

    return () => {
      if (moveIntervalRef.current) {
        window.clearInterval(moveIntervalRef.current);
      }
    };
  }, [config.followerSpeed, calculatePath]);

  // Function to set drag state
  const setDragging = useCallback((dragging: boolean) => {
    isDraggingRef.current = dragging;
  }, []);

  return {
    gridState,
    updateGoal,
    updateWalls,
    toggleWall,
    createWall,
    removeWall,
    calculatePath,
    setDragging,
  };
};
