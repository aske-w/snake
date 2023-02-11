import React, { useImperativeHandle, useState } from "react";
import { Coords } from "./Snake";

interface GridProps {
  initialPlayerPos: Coords;
  initialObjectivePos: Coords;
  columns: number;
  rows: number;
}

export interface GridHandles {
  updatePlayerPos: (pos: Coords) => void;
  updateObjectivePos: (pos: Coords) => void;
  updatePreviousPos: (poss: Coords[]) => void;
}

const Grid = React.forwardRef<GridHandles, GridProps>(({ initialPlayerPos, initialObjectivePos, columns, rows }, ref) => {
  const [playerPos, setPlayerPos] = useState<Coords>(initialPlayerPos);
  const [objectivePos, setObjectivePos] = useState<Coords>(initialObjectivePos)
  const [previousPos, setPreviousPos] = useState<Coords[]>([])
  useImperativeHandle(
    ref,
    () => ({
      updatePlayerPos: (pos: Coords) => {
        setPlayerPos(pos);
      },
      updateObjectivePos: (pos: Coords) => {
        setObjectivePos(pos);
      },
      updatePreviousPos: (poss: Coords[]) => {
        setPreviousPos(poss);
      }
    })
  );
  
  const generateGrid = (cols: number, rows: number): JSX.Element => {
    const rowHtml: JSX.Element[] = [];
    for (let i = 0; i < rows; i++) {
      const colHtml: JSX.Element[] = [];
      for (let j = 0; j < cols; j++) {
        let bgColor = "bg-gray-800";
        if (previousPos.some(coord => coord.y === i && coord.x === j))
          bgColor = "bg-gray-300";
        if (playerPos.y === i && playerPos.x === j)
          bgColor = "bg-red-400";
        if (objectivePos.y === i && objectivePos.x === j)
          bgColor = "bg-green-300";
        colHtml.push(<td key={`${j},${i}`} className={`w-12 h-12 text-white border-4 border-black p-1 ${bgColor}`}></td>);
      }
      rowHtml.push(<tr key={i}>{colHtml}</tr>);
    }
    return <table className="flex justify-center items-center">
      <tbody>
        {rowHtml}
      </tbody>
    </table>;
  };
  return <div className="bg-black h-screen w-screen flex justify-center">
    {generateGrid(columns, rows)}
  </div>;
});

export default Grid;
