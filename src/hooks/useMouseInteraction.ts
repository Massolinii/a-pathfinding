import { useState, useRef, useCallback } from "react";
import type { PathfindingConfig } from "../types";

interface UseMouseInteractionProps {
  gridRef: React.RefObject<HTMLDivElement | null>;
  config: PathfindingConfig;
  onGoalUpdate: (goal: { x: number; y: number }) => void;
  onWallCreate: (x: number, y: number) => void;
  onWallRemove: (x: number, y: number) => void;
  onDragStateChange: (isDragging: boolean) => void;
  walls: Set<string>;
}

export const useMouseInteraction = ({
  gridRef,
  config,
  onGoalUpdate,
  onWallCreate,
  onWallRemove,
  onDragStateChange,
  walls,
}: UseMouseInteractionProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<"create" | "remove">("create");
  const lastDragTimeRef = useRef<number>(0);
  const lastProcessedCellRef = useRef<string | null>(null);

  // Get cell position from mouse coordinates
  const getCellPosition = useCallback(
    (e: React.MouseEvent) => {
      if (!gridRef.current) return null;

      const rect = gridRef.current.getBoundingClientRect();
      const cellSize = rect.width / config.gridSize;
      const x = Math.floor((e.clientX - rect.left) / cellSize);
      const y = Math.floor((e.clientY - rect.top) / cellSize);

      if (x >= 0 && x < config.gridSize && y >= 0 && y < config.gridSize) {
        return { x, y };
      }
      return null;
    },
    [gridRef, config.gridSize]
  );

  // Handle mouse movement to update goal position - with throttling
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const position = getCellPosition(e);
      if (position) {
        // Use requestAnimationFrame for smooth goal updates
        requestAnimationFrame(() => {
          onGoalUpdate(position);
        });
      }
    },
    [getCellPosition, onGoalUpdate]
  );

  // Handle mouse down for dragging
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const position = getCellPosition(e);
      if (position) {
        // Reset tracking for new drag
        lastProcessedCellRef.current = null;

        // Determine drag type based on mouse button
        if (e.button === 0) {
          // Left click
          setDragType("create");
          setIsDragging(true);
          onDragStateChange(true);
          onWallCreate(position.x, position.y);
        } else if (e.button === 2) {
          // Right click
          setDragType("remove");
          setIsDragging(true);
          onDragStateChange(true);
          onWallRemove(position.x, position.y);
        }
      }
    },
    [getCellPosition, onWallCreate, onWallRemove, onDragStateChange]
  );

  // Handle mouse up to stop dragging
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    onDragStateChange(false);
  }, [onDragStateChange]);

  // Handle mouse leave to stop dragging
  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
    onDragStateChange(false);
  }, [onDragStateChange]);

  // Handle mouse move during drag with optimized throttling
  const handleMouseMoveDrag = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;

      const position = getCellPosition(e);
      if (!position) return;

      const cellKey = `${position.x},${position.y}`;

      // Skip if we already processed this cell
      if (lastProcessedCellRef.current === cellKey) return;

      const now = Date.now();
      // Reduced throttling to 8ms (120fps) for better responsiveness
      if (now - lastDragTimeRef.current < 8) return;
      lastDragTimeRef.current = now;
      lastProcessedCellRef.current = cellKey;

      // Use appropriate function based on drag type
      if (dragType === "create") {
        onWallCreate(position.x, position.y);
      } else if (dragType === "remove") {
        onWallRemove(position.x, position.y);
      }
    },
    [isDragging, getCellPosition, dragType, onWallCreate, onWallRemove]
  );

  return {
    isDragging,
    dragType,
    handleMouseMove,
    handleMouseDown,
    handleMouseUp,
    handleMouseLeave,
    handleMouseMoveDrag,
  };
};
