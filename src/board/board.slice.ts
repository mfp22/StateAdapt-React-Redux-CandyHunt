import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/types/types-external";
import { candies } from "./candyData";
import { getLastIndexForColumnOffset, getInvalidRowMatches } from "./formulas";
import {
  eraseColumnOfThree,
  eraseRowOfFour,
  eraseRowOfThree,
  eraseColumnOfFour,
} from "./moveCheckLogic";

const moveBelowReducer = (
  state: WritableDraft<{
    board: string[];
    boardSize: number;
    squareBeingReplaced: Element | undefined;
    squareBeingDragged: Element | undefined;
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
    console.log("isFirstRow", isFirstRow);

    if (isFirstRow && newBoard[i] === "") {
      let randomNumber = Math.floor(Math.random() * candies.length);
      newBoard[i] = candies[randomNumber];
      boardChanges = true;
      console.log("board changes 1");
    }

    if (newBoard[i + boardSize] === "") {
      newBoard[i + boardSize] = newBoard[i];
      newBoard[i] = "";
      boardChanges = true;
      console.log("board changes 2");
    }
    if (boardChanges) state.board = newBoard;
  }
};

const dragEndReducer = (
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

  const validMove = validMoves.includes(squareBeingReplacedId);

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

const initialState: {
  board: string[];
  boardSize: number;
  squareBeingReplaced: Element | undefined;
  squareBeingDragged: Element | undefined;
} = {
  board: [],
  boardSize: 8,
  squareBeingDragged: undefined,
  squareBeingReplaced: undefined,
};

export const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    updateBoard: (state, action: PayloadAction<string[]>) => {
      state.board = action.payload;
    },
    dragStart: (state, action: PayloadAction<any>) => {
      state.squareBeingDragged = action.payload;
    },
    dragDrop: (state, action: PayloadAction<any>) => {
      state.squareBeingReplaced = action.payload;
    },
    dragEnd: dragEndReducer,
    moveBelow: moveBelowReducer,
  },
});
