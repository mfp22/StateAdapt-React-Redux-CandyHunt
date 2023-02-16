import { useStore } from "@state-adapt/react";
import Tile from "./Tile";
import { boardStore } from "./board.slice";

function Board() {
  const boardStates = useStore(boardStore);
  return (
    <div
      className="flex flex-wrap rounded-lg"
      style={{
        width: `${6.25 * boardStates.boardSize}rem`,
      }}
    >
      {boardStates.board.map((candy: string, index: number) => (
        <Tile candy={candy} key={index} candyId={index} />
      ))}
    </div>
  );
}

export default Board;
