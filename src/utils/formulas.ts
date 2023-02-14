export const getLastIndexForColumnOffset = (boardSize: number, offset: number) =>
  boardSize * (boardSize - offset) - 1;

export const getInvalidRowMatches = (boardSize: number, offset: number) => {
  const invalidMoves: Array<number> = [];
  for (let i: number = boardSize; i <= boardSize * boardSize; i += boardSize) {
    if (offset === 3) invalidMoves.push(i - 3);
    invalidMoves.push(i - 2);
    invalidMoves.push(i - 1);
  }
  return invalidMoves;
};
