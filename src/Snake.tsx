import React, { useCallback, useEffect, useMemo, useRef } from "react";
import Grid, { GridHandles } from "./Grid";

interface SnakeProps { }

export interface Coords {
  x: number;
  y: number;
}

type Direction = "left" | "right" | "up" | "down"

const Snake: React.FC<SnakeProps> = () => {
  const initialDirection: Direction = "left";
  const gameLoopTime = 400;
  const rows = 7;
  const cols = 15;

  const initialPlayerPos: Coords = { x: Math.floor(cols / 2), y: Math.floor(rows / 2) };

  const randomCoords = (): Coords => { return { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) } };

  const initialObjectivePos: Coords = randomCoords();
  const playerPos = useRef<Coords>(initialPlayerPos);
  const objectivePos = useRef<Coords>(initialObjectivePos);
  let previousPositions: Coords[] = useMemo(() => [],[]);
  const length = useCallback(() => previousPositions.length + 1, [previousPositions]);
  let dir: Direction = initialDirection;
  const gridRef = useRef<GridHandles>(null);

  const reset = () => {
    playerPos.current = initialPlayerPos;
    gridRef.current?.updatePlayerPos(initialPlayerPos);
    dir = initialDirection;
    previousPositions = [];
    gridRef.current?.updatePreviousPos([]);
  }

  const getOppositeDirection = (dir: Direction): Direction => {
    switch (dir) {
      case "left":
        return "right";
      case "right":
        return "left";
      case "up":
        return "down";
      case "down":
        return "up";
    }
  }

  const keyDownListener = (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowLeft":
        if("left" !== getOppositeDirection(dir) || length() === 1)
          dir = "left";
        break;
      case "ArrowRight":
        if("right" !== getOppositeDirection(dir) || length() === 1)
          dir = "right";
        break;
      case "ArrowUp":
        if("up" !== getOppositeDirection(dir) || length() === 1)
          dir = "up";
        break;
      case "ArrowDown":
        if("down" !== getOppositeDirection(dir) || length() === 1)
          dir = "down";
        break;
    }
  }
  useEffect(() => {
    document.addEventListener("keydown", keyDownListener, false);
    return () => {
      document.removeEventListener("keydown", keyDownListener);
    }
  }, [])

  const nextPos = (currentPos: Coords, direction: Direction): Coords => {
    switch (direction) {
      case "left":
        return { x: (currentPos.x + cols - 1) % cols, y: currentPos.y };
      case "right":
        return { x: (currentPos.x + cols + 1) % cols, y: currentPos.y };
      case "up":
        return { x: currentPos.x, y: (currentPos.y + rows - 1) % rows };
      case "down":
        return { x: currentPos.x, y: (currentPos.y + rows + 1) % rows };
    }
  }


  useEffect(() => {
    if (gridRef.current !== undefined)
      setInterval(() => {
        previousPositions.unshift(playerPos.current);
        const newPos = nextPos(playerPos.current, dir)
        if((playerPos.current.y === newPos.y && playerPos.current.x === newPos.x) ||
          previousPositions.some(coord => coord.y === newPos.y && coord.x === newPos.x)
        ) {
          reset();
        } else {
          playerPos.current = newPos;
          if (newPos.x === objectivePos.current.x && newPos.y === objectivePos.current.y) {
            let newObjectivePos = randomCoords();
            while ((playerPos.current.y === newObjectivePos.y && playerPos.current.x === newObjectivePos.x) ||
              previousPositions.some(coord => coord.y === newObjectivePos.y && coord.x === newObjectivePos.x)
            ) {
              newObjectivePos = randomCoords();  
            }
            objectivePos.current = newObjectivePos
            gridRef.current?.updateObjectivePos(newObjectivePos)
          } else {
            previousPositions.pop();
          }
          gridRef.current?.updatePreviousPos(previousPositions);
          gridRef.current?.updatePlayerPos(newPos);
        }
      }, gameLoopTime); 
  },[playerPos, dir]);

  return <Grid initialPlayerPos={initialPlayerPos}
    initialObjectivePos={initialObjectivePos}
    columns={cols}
    rows={rows}
    ref={gridRef}
  />;
};

export default Snake;
