import { WritableDraft } from "immer/dist/types/types-external";
import { getLastIndexForColumnOffset, getInvalidRowMatches } from "../../board/formulas";
import {
  eraseColumnOfThree,
  eraseRowOfFour,
  eraseRowOfThree,
  eraseColumnOfFour,
} from "../../board/moveCheckLogic";

export const dragEndReducer = (
  state: WritableDraft<{
    board: string[];
    boardSize: number;
    squareBeingReplaced: Element | undefined;
    squareBeingDragged: Element | undefined;
  }>
) => {
  const newBoard = [...state.board];
  let { boardSize, squareBeingDragged, squareBeingReplaced } = state;
  const squareBeingDraggedId: number = parseInt(
    squareBeingDragged?.getAttribute("candy-id") as string
  );
  const squareBeingReplacedId: number = parseInt(
    squareBeingReplaced?.getAttribute("candy-id") as string
  );

  newBoard[squareBeingReplacedId] = squareBeingDragged?.getAttribute("src") as string;
  newBoard[squareBeingDraggedId] = squareBeingReplaced?.getAttribute("src") as string;

  const validMoves: number[] = [
    squareBeingDraggedId - 1,
    squareBeingDraggedId - boardSize,
    squareBeingDraggedId + 1,
    squareBeingDraggedId + boardSize,
  ];

  const validMove: boolean = validMoves.includes(squareBeingReplacedId);

  const isAColumnOfFour: boolean | undefined = eraseColumnOfFour(
    newBoard,
    boardSize,
    getLastIndexForColumnOffset(boardSize, 3)
  );

  const isARowOfFour: boolean | undefined = eraseRowOfFour(
    newBoard,
    boardSize,
    getInvalidRowMatches(boardSize, 3)
  );

  const isAColumnOfThree: boolean | undefined = eraseColumnOfThree(
    newBoard,
    boardSize,
    getLastIndexForColumnOffset(boardSize, 2)
  );

  const isARowOfThree: boolean | undefined = eraseRowOfThree(
    newBoard,
    boardSize,
    getInvalidRowMatches(boardSize, 2)
  );

  if (
    squareBeingReplacedId &&
    validMove &&
    (isARowOfThree || isARowOfFour || isAColumnOfFour || isAColumnOfThree)
  ) {
    squareBeingDragged = undefined;
    squareBeingReplaced = undefined;
  } else {
    newBoard[squareBeingReplacedId] = squareBeingReplaced?.getAttribute("src") as string;
    newBoard[squareBeingDraggedId] = squareBeingDragged?.getAttribute("src") as string;
  }
  state.board = newBoard;
};
