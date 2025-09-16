import React from "react";
import type { PathfindingConfig } from "../types";
import "../styles/ConfigPanel.css";

interface ConfigPanelProps {
  config: PathfindingConfig;
  onConfigChange: (config: PathfindingConfig) => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  config,
  onConfigChange,
}) => {
  const handleAllowDiagonalChange = (allowDiagonal: boolean) => {
    onConfigChange({ ...config, allowDiagonal });
  };

  const handleSpeedChange = (followerSpeed: number) => {
    onConfigChange({ ...config, followerSpeed });
  };

  const handleGridSizeChange = (gridSize: number) => {
    onConfigChange({ ...config, gridSize });
  };

  const handleShowGridChange = (showGrid: boolean) => {
    onConfigChange({ ...config, showGrid });
  };

  return (
    <div className="config-panel">
      <h3>Settings</h3>

      <div className="control-group">
        <label>
          <input
            type="checkbox"
            checked={config.allowDiagonal}
            onChange={(e) => handleAllowDiagonalChange(e.target.checked)}
          />
          Allow diagonal movement
        </label>
      </div>

      <div className="control-group">
        <label>
          Movement speed: {config.followerSpeed}ms
          <input
            type="range"
            min="100"
            max="500"
            step="25"
            value={config.followerSpeed}
            onChange={(e) => handleSpeedChange(Number(e.target.value))}
          />
        </label>
      </div>

      <div className="control-group">
        <label>
          Grid size: {config.gridSize}×{config.gridSize}
          <input
            type="range"
            min="10"
            max="60"
            step="5"
            value={config.gridSize}
            onChange={(e) => handleGridSizeChange(Number(e.target.value))}
          />
        </label>
      </div>

      <div className="control-group">
        <label>
          <input
            type="checkbox"
            checked={config.showGrid}
            onChange={(e) => handleShowGridChange(e.target.checked)}
          />
          Show grid lines
        </label>
      </div>
    </div>
  );
};
