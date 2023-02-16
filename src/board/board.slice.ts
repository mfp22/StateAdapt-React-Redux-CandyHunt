import { WritableDraft } from "immer/dist/types/types-external";
import produce from "immer";
import { candies } from "./candyData";
import { getLastIndexForColumnOffset, getInvalidRowMatches } from "./formulas";
import {
  eraseColumnOfThree,
  eraseRowOfFour,
  eraseRowOfThree,
  eraseColumnOfFour,
} from "./moveCheckLogic";
import { adapt, watch } from "../store";
import { createAdapter, joinAdapters } from "@state-adapt/core";
import { createBoard } from "./createBoard";
import { debounceTime } from "rxjs";
import { toSource } from "@state-adapt/rxjs";

const moveBelowReducer = (
  state: WritableDraft<{
    board: string[];
    boardSize: number;
    squareBeingReplaced: CandyData;
    squareBeingDragged: CandyData;
  }>
) => {
  const newBoard: string[] = [...state.board];
  const { boardSize } = state;
  let boardChanges = false;
  const formulaForMove = getLastIndexForColumnOffset(boardSize, 1);
  for (let i = 0; i <= formulaForMove; i++) {
    const firstRow = Array(boardSize)
      .fill(0)
      .map((_value: number, index) => index);

    const isFirstRow = firstRow.includes(i);

    if (isFirstRow && newBoard[i] === "") {
      let randomNumber = Math.floor(Math.random() * candies.length);
      newBoard[i] = candies[randomNumber];
      boardChanges = true;
    }

    if (newBoard[i + boardSize] === "") {
      newBoard[i + boardSize] = newBoard[i];
      newBoard[i] = "";
      boardChanges = true;
    }
    if (boardChanges) state.board = newBoard;
  }
};

const dragEndReducer = (
  state: WritableDraft<{
    board: string[];
    boardSize: number;
    squareBeingReplaced: CandyData;
    squareBeingDragged: CandyData;
  }>
) => {
  const newBoard = [...state.board];
  let { boardSize, squareBeingDragged, squareBeingReplaced } = state;
  newBoard[squareBeingReplaced.id] = squareBeingDragged.src;
  newBoard[squareBeingDragged.id] = squareBeingReplaced.src;

  const validMoves: number[] = [
    squareBeingDragged.id - 1,
    squareBeingDragged.id - boardSize,
    squareBeingDragged.id + 1,
    squareBeingDragged.id + boardSize,
  ];

  const validMove = validMoves.includes(squareBeingReplaced.id);

  const isAColumnOfFour = eraseColumnOfFour(
    newBoard,
    boardSize,
    getLastIndexForColumnOffset(boardSize, 3)
  );

  const isARowOfFour = eraseRowOfFour(newBoard, boardSize, getInvalidRowMatches(boardSize, 3));

  const isAColumnOfThree = eraseColumnOfThree(
    newBoard,
    boardSize,
    getLastIndexForColumnOffset(boardSize, 2)
  );

  const isARowOfThree = eraseRowOfThree(newBoard, boardSize, getInvalidRowMatches(boardSize, 2));

  if (
    squareBeingReplaced.id &&
    validMove &&
    (isARowOfThree || isARowOfFour || isAColumnOfFour || isAColumnOfThree)
  ) {
    // squareBeingDragged = undefined;
    // squareBeingReplaced = undefined;
  } else {
    newBoard[squareBeingReplaced.id] = squareBeingReplaced.src;
    newBoard[squareBeingDragged.id] = squareBeingDragged.src;
  }
  state.board = newBoard;
};

type CandyData = {
  id: number;
  src: string;
};

type State = {
  board: string[];
  boardSize: number;
  squareBeingReplaced: CandyData | undefined;
  squareBeingDragged: CandyData | undefined;
};
const initialState: State = {
  board: createBoard(8),
  boardSize: 8,
  squareBeingDragged: undefined,
  squareBeingReplaced: undefined,
};

const adapter = joinAdapters<State>()({
  board: createAdapter<State["board"]>()({}),
  boardSize: createAdapter<State["boardSize"]>()({}),
  squareBeingDragged: createAdapter<State["squareBeingDragged"]>()({}),
  squareBeingReplaced: createAdapter<State["squareBeingReplaced"]>()({}),
})(() => ({
  dragEnd: state => produce(state, dragEndReducer),
  moveBelow: state => produce(state, moveBelowReducer),
}))(([selectors, reactions]) => ({
  eraseMatchesAndShiftTiles: state => {
    const { board, boardSize } = state;
    const newBoard = [...board];
    eraseColumnOfFour(newBoard, boardSize, getLastIndexForColumnOffset(boardSize, 3));
    eraseRowOfFour(newBoard, boardSize, getInvalidRowMatches(boardSize, 3));
    eraseColumnOfThree(newBoard, boardSize, getLastIndexForColumnOffset(boardSize, 2));
    eraseRowOfThree(newBoard, boardSize, getInvalidRowMatches(boardSize, 2));
    return reactions.moveBelow({
      ...state,
      board: newBoard,
    });
  },
}))();

const boardChangedDebounce150$ = watch("board", adapter).board$.pipe(
  debounceTime(150),
  toSource("boardChangedDebounce150$")
);

export const boardStore = adapt(["board", initialState, adapter], {
  eraseMatchesAndShiftTiles: boardChangedDebounce150$,
});
