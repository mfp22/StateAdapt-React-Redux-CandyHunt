export const eraseColumnOfFour = (newBoard: string[], boardSize: number, offset: number) => {
  for (let i = 0; i <= offset; i++) {
    const columnOfFour = [i, i + boardSize, i + boardSize * 2, i + boardSize * 3];
    const decidedColor = newBoard[i];

    const isBlank = newBoard[i] === "";

    if (columnOfFour.every(square => newBoard[square] === decidedColor && !isBlank)) {
      columnOfFour.forEach(square => (newBoard[square] = ""));
      return true;
    }
  }
};

export const eraseRowOfFour = (
  newBoard: String[],
  boardSize: number,
  invalidRowMatches: number[]
) => {
  for (let i = 0; i < boardSize * boardSize; i++) {
    const rowOfFour = [i, i + 1, i + 2, i + 3];
    const decidedColor = newBoard[i];

    const isBlank = newBoard[i] === "";

    if (invalidRowMatches.includes(i)) continue;
    if (rowOfFour.every(square => newBoard[square] === decidedColor && !isBlank)) {
      rowOfFour.forEach(square => (newBoard[square] = ""));
      return true;
    }
  }
};

export const eraseColumnOfThree = (newBoard: string[], boardSize: number, offset: number) => {
  for (let i = 0; i <= offset; i++) {
    const columnOfThree = [i, i + boardSize, i + boardSize * 2];
    const decidedColor = newBoard[i];
    const isBlank = newBoard[i] === "";

    if (columnOfThree.every(square => newBoard[square] === decidedColor && !isBlank)) {
      columnOfThree.forEach(square => (newBoard[square] = ""));
      return true;
    }
  }
};

export const eraseRowOfThree = (
  newBoard: string[],
  boardSize: number,
  invalidRowMatches: number[]
) => {
  for (let i = 0; i < boardSize * boardSize; i++) {
    const rowOfThree = [i, i + 1, i + 2];
    const decidedColor = newBoard[i];

    const isBlank = newBoard[i] === "";

    if (invalidRowMatches.includes(i)) continue;

    if (rowOfThree.every(square => newBoard[square] === decidedColor && !isBlank)) {
      rowOfThree.forEach(square => (newBoard[square] = ""));
      return true;
    }
  }
};
