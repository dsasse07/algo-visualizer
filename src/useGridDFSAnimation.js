import { useState } from "react";
import { sleep } from "./utils/sleep";
import { cloneGrid } from "./utils/cloneGrid";

const useMapAreas = (start, userOptions) => {
  const optionDefaults = { sleep: 0 };
  const options = { ...optionDefaults, ...userOptions };
  const [isRunning, setIsRunning] = useState(false);
  const [gridDisplay, setGridDisplay] = useState(cloneGrid(start));
  const [maxArea, setMaxArea] = useState(0);
  const [currentArea, setCurrentArea] = useState(0);
  const resetGrid = () => {
    setGridDisplay(cloneGrid(start));
    setMaxArea(0);
    setCurrentArea(0);
  };

  const mapIsland = async (i, j) => {
    let size = 0;
    const stack = [[i, j]];
    let cur;
    const directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1]
    ];
    while (stack.length > 0) {
      cur = stack.pop();
      size++;
      gridDisplay[cur[0]][cur[1]] = 2;
      for (let dir of directions) {
        let nRow = cur[0] + dir[0];
        let nCol = cur[1] + dir[1];
        if (
          gridDisplay[nRow] &&
          gridDisplay[nRow][nCol] &&
          gridDisplay[nRow][nCol] === 1
        ) {
          gridDisplay[nRow][nCol] = 3;
          stack.push([nRow, nCol]);
        }
      }
      const newGrid = cloneGrid(gridDisplay);
      setGridDisplay(newGrid);
      setCurrentArea(size);
      await sleep(options.sleep);
    }
    return size;
  };

  const mapAreas = async () => {
    setIsRunning(true);
    setCurrentArea(0);
    let thisMaxArea = 0;
    let curSize;
    for (let i = 0; i < gridDisplay.length; i++) {
      for (let j = 0; j < gridDisplay[0].length; j++) {
        if (gridDisplay[i][j] === 1) {
          curSize = await mapIsland(i, j);
          thisMaxArea = Math.max(curSize, thisMaxArea);
          setMaxArea(thisMaxArea);
        } else if (gridDisplay[i][j] === 0) {
          gridDisplay[i][j] = 4;
          const newGrid = cloneGrid(gridDisplay);
          setGridDisplay(newGrid);
          await sleep(options.sleep);
        }
      }
    }
    setIsRunning(false);
  };
  return {
    maxArea,
    currentArea,
    mapAreas,
    isRunning,
    gridDisplay,
    setGridDisplay,
    resetGrid
  };
};

export default useMapAreas;
