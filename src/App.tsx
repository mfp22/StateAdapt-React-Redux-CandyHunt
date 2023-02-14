import { useEffect } from "react";
import Board from "./components/Board";
import { moveBelow, updateBoard } from "./store";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { createBoard } from "./board/createBoard";
import { getLastIndexForColumnOffset, getInvalidRowMatches } from "./board/formulas";
import {
  eraseColumnOfFour,
  eraseRowOfFour,
  eraseColumnOfThree,
  eraseRowOfThree,
} from "./board/moveCheckLogic";

function App() {
  const dispatch = useAppDispatch();
  const board = useAppSelector(({ candyCrush: { board } }) => board);
  const boardSize = useAppSelector(({ candyCrush: { boardSize } }) => boardSize);

  useEffect(() => {
    dispatch(updateBoard(createBoard(boardSize)));
  }, [dispatch, boardSize]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const newBoard = [...board];
      eraseColumnOfFour(newBoard, boardSize, getLastIndexForColumnOffset(boardSize, 3));
      eraseRowOfFour(newBoard, boardSize, getInvalidRowMatches(boardSize, 3));
      dispatch(moveBelow());
      eraseColumnOfThree(newBoard, boardSize, getLastIndexForColumnOffset(boardSize, 2));
      eraseRowOfThree(newBoard, boardSize, getInvalidRowMatches(boardSize, 2));
      dispatch(updateBoard(newBoard));
    }, 150);
    return () => clearInterval(timeout);
  }, [board, dispatch, boardSize]);

  return (
    <div className="flex items-center justify-center h-screen">
      <Board />
    </div>
  );
}

export default App;
