import { useAppSelector } from "../store";
import Tile from "./Tile";

function Board() {
  const board: string[] = useAppSelector(({ board: { board } }) => board);
  const boardSize: number = useAppSelector(({ board: { boardSize } }) => boardSize);
  return (
    <div
      className="flex flex-wrap rounded-lg"
      style={{
        width: `${6.25 * boardSize}rem`,
      }}
    >
      {board.map((candy: string, index: number) => (
        <Tile candy={candy} key={index} candyId={index} />
      ))}
    </div>
  );
}

export default Board;
