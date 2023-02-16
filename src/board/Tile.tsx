import { boardStore } from "./board.slice";

const elementToCandyData = (element: Element) => ({
  id: parseInt(element.getAttribute("candy-id") as string),
  src: element.getAttribute("src") as string,
});

function Tile({ candy, candyId }: { candy: string; candyId: number }) {
  return (
    <div
      className="h-24 w-24 flex justify-center items-center m-0.5 rounded-lg select-none"
      style={{
        boxShadow: "inset 5px 5px 15px #062525,inset -5px -5px 15px #aaaab7bb",
      }}
    >
      {candy && (
        <img
          src={candy}
          alt=""
          className="h-20 w-20"
          draggable={true}
          onDragStart={e =>
            boardStore.setSquareBeingDragged(elementToCandyData(e.target as Element))
          }
          onDragOver={e => e.preventDefault()}
          onDragEnter={e => e.preventDefault()}
          onDragLeave={e => e.preventDefault()}
          onDrop={e => boardStore.setSquareBeingReplaced(elementToCandyData(e.target as Element))}
          onDragEnd={() => boardStore.dragEnd()}
          candy-id={candyId}
        />
      )}
    </div>
  );
}

export default Tile;
