# A\* Pathfinding Demo

A real-time pathfinding visualization built with React and TypeScript. The red dot follows your mouse using the A\* algorithm while you can draw walls to block its path.

## What it does

- **Blue dot**: Follows your mouse cursor
- **Red dot**: Uses A\* to find the shortest path to the blue dot
- **Walls**: Left-click to build, right-click to destroy
- **Live path**: Red line shows the calculated route

## Features

### Grid Controls

- Grid size: 10×10 to 60×60 (default 30×30)
- Movement speed: 100ms to 500ms per step
- Diagonal movement: on/off toggle
- Grid lines: show/hide with animation

### Performance

- Binary heap for A\* optimization
- Debounced path recalculation
- Smooth 120fps mouse tracking
- Continuous movement during wall drawing

## How it works

### A\* Algorithm

- Uses Manhattan distance heuristic
- Binary heap for efficient open set management
- Handles edge cases (goal on wall, unreachable targets)
- Recalculates path when goal or walls change

### Movement System

- Continuous movement every X milliseconds
- Path updates with debouncing to avoid lag
- Smart recalculation during drag operations
- Smooth following even while drawing walls

### Mouse Interaction

- Drag detection for wall creation/removal
- Throttled mouse events for smooth drawing
- Context menu prevention on right-click
- Real-time grid cell updates

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173 and start moving your mouse around.

## Technical Details

### Performance Optimizations

- Binary heap reduces A\* open set operations to O(log n)
- Debounced path recalculation prevents excessive computation
- Mouse event throttling at 120fps for smooth wall drawing
- Smart path updates only when necessary

### State Management

- React hooks for all state management
- Custom hooks encapsulate complex logic
- TypeScript for type safety
- Modular component architecture

## Algorithm Implementation

The A\* algorithm uses:

- **g(n)**: Actual cost from start to current node
- **h(n)**: Heuristic estimate from current to goal (Manhattan distance)
- **f(n)**: Total cost = g(n) + h(n)

The binary heap keeps the open set sorted by f(n), making it efficient to always pick the best node to explore next.

## References

### A\* Algorithm

- [A\* Pathfinding for Beginners](https://www.redblobgames.com/pathfinding/a-star/introduction.html) - Red Blob Games
- [A\* Search Algorithm](https://en.wikipedia.org/wiki/A*_search_algorithm) - Wikipedia
- [Introduction to A\*](https://theory.stanford.edu/~amitp/GameProgramming/AStarComparison.html) - Amit Patel

### Binary Heap

- [Binary Heap](https://en.wikipedia.org/wiki/Binary_heap) - Wikipedia
- [Heap Data Structure](https://www.geeksforgeeks.org/heap-data-structure/) - GeeksforGeeks

## License

MIT - use it for whatever you want.
