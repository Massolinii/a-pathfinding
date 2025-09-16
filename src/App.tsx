import { useState } from "react";
import { Grid } from "./components/Grid";
import type { PathfindingConfig } from "./types";
import "./styles/App.css";
import { ConfigPanel } from "./components/ConfigPanel";

function App() {
  const [config, setConfig] = useState<PathfindingConfig>({
    allowDiagonal: false,
    followerSpeed: 200,
    gridSize: 30,
    showGrid: true,
    theme: "modern",
  });

  return (
    <div className="app">
      <div className="left-panel">
        <ConfigPanel config={config} onConfigChange={setConfig} />
      </div>
      <div className="center-panel">
        <div className="center-title-section">
          <h2>A* Pathfinding</h2>
          <hr />
        </div>
        <Grid config={config} />
      </div>
      <div className="right-panel">
        <div className="controls">
          <h3>Controls</h3>
          <div className="control-item">
            <div className="control-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
                <path d="M13 13l6 6" />
              </svg>
            </div>
            <span>Move mouse to control blue target</span>
          </div>
          <div className="control-item">
            <div className="control-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 2l6 6-9 9-6-6 9-9z" />
                <path d="M9 8l6 6" />
                <path d="M21 2l-5 5" />
                <path d="M3 21l3-3" />
              </svg>
            </div>
            <span>Left click and drag to create walls</span>
          </div>
          <div className="control-item">
            <div className="control-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
              </svg>
            </div>
            <span>Right click and drag to remove walls</span>
          </div>
        </div>
        <div className="instructions">
          <h3>Instructions</h3>
          <ul>
            <li>The red dot follows using A* pathfinding</li>
            <li>Red path shows the calculated route</li>
            <li>Adjust grid size and speed in settings</li>
            <li>Toggle diagonal movement as needed</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
