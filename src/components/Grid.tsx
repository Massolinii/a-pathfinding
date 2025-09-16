import React, { useRef } from "react";
import type { PathfindingConfig } from "../types";
import { usePathfinding } from "../hooks/usePathfinding";
import { useMouseInteraction } from "../hooks/useMouseInteraction";
import { GridRenderer } from "./GridRenderer";
import "../styles/Grid.css";

interface GridProps {
  config: PathfindingConfig;
}

export const Grid: React.FC<GridProps> = ({ config }) => {
  const gridRef = useRef<HTMLDivElement | null>(null);

  // Use custom hooks for pathfinding and mouse interaction
  const { gridState, updateGoal, createWall, removeWall, setDragging } =
    usePathfinding(config);

  const {
    handleMouseMove,
    handleMouseDown,
    handleMouseUp,
    handleMouseLeave,
    handleMouseMoveDrag,
  } = useMouseInteraction({
    gridRef,
    config,
    onGoalUpdate: updateGoal,
    onWallCreate: createWall,
    onWallRemove: removeWall,
    onDragStateChange: setDragging,
    walls: gridState.walls,
  });

  return (
    <GridRenderer
      config={config}
      gridState={gridState}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onMouseMoveDrag={handleMouseMoveDrag}
      gridRef={gridRef}
    />
  );
};
