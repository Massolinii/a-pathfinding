import React, { useCallback } from "react";
import type { PathfindingConfig, GridState } from "../types";

interface GridRendererProps {
  config: PathfindingConfig;
  gridState: GridState;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  onMouseMoveDrag: (e: React.MouseEvent) => void;
  gridRef: React.RefObject<HTMLDivElement | null>;
}

export const GridRenderer: React.FC<GridRendererProps> = ({
  config,
  gridState,
  onMouseMove,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  onMouseMoveDrag,
  gridRef,
}) => {
  // Render grid cells - optimized with useCallback
  const renderGrid = useCallback(() => {
    const cells = [];
    const cellSize = 100 / config.gridSize;

    for (let y = 0; y < config.gridSize; y++) {
      for (let x = 0; x < config.gridSize; x++) {
        const key = `${x},${y}`;
        const isWall = gridState.walls.has(key);
        const isGoal = gridState.goal.x === x && gridState.goal.y === y;
        const isFollower =
          gridState.follower.x === x && gridState.follower.y === y;
        const isPath = gridState.path.some((p) => p.x === x && p.y === y);

        let className = "grid-cell";
        if (isWall) className += " wall";
        if (isGoal) className += " goal";
        if (isFollower) className += " follower";
        if (isPath && !isGoal && !isFollower) className += " path";

        cells.push(
          <div
            key={key}
            className={className}
            style={{
              left: `${x * cellSize}%`,
              top: `${y * cellSize}%`,
              width: `${cellSize}%`,
              height: `${cellSize}%`,
            }}
          />
        );
      }
    }
    return cells;
  }, [
    config.gridSize,
    gridState.walls,
    gridState.goal,
    gridState.follower,
    gridState.path,
  ]);

  return (
    <div className="grid-container">
      <div
        ref={gridRef}
        className={`grid ${config.showGrid ? "show-grid" : "hide-grid"}`}
        onMouseMove={onMouseMove}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onMouseMoveCapture={onMouseMoveDrag}
        onContextMenu={(e) => e.preventDefault()}
        style={{
          gridTemplateColumns: `repeat(${config.gridSize}, 1fr)`,
          gridTemplateRows: `repeat(${config.gridSize}, 1fr)`,
        }}
      >
        {renderGrid()}
      </div>
    </div>
  );
};
