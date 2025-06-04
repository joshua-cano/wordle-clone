"use client";

import { Keyboard } from "@/components/keyboard";
import { Grid } from "@/components/wordle-grid";
import { useEffect, useRef, useState } from "react";
import type { LetterGuessState, GridCell, GameState } from "./types";
import { WORDS } from "./words";
import { GameResult } from "@/components/GameResult";
import { Confetti, ConfettiRef } from "@/components/confetti";

const LETTER_GUESS_STATE_PRIORITY = {
  empty: 0,
  tbd: 1,
  absent: 2,
  present: 3,
  correct: 4,
};

function getInitialGridState(
  maxAttempts: number,
  lettersPerWord: number
): GridCell[][] {
  return Array.from({ length: maxAttempts }, () =>
    Array.from({ length: lettersPerWord }, () => ({
      char: "",
      state: "empty",
    }))
  );
}

// Count the frequency of letters in a word.
function countLetterFreqInWord(word: string) {
  const freq = new Map();

  for (let i = 0; i < word.length; ++i) {
    if (!freq.has(word[i])) {
      freq.set(word[i], 0);
    }

    freq.set(word[i], freq.get(word[i]) + 1);
  }

  return freq;
}

function generateRandomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

export default function Home() {
  const confettiRef = useRef<ConfettiRef>(null);
  const [wordOfTheGame, setWordOfTheGame] = useState(() =>
    generateRandomWord()
  );
  const [gameState, setGameState] = useState<GameState>("IN_PROGRESS");
  const [gridState, setGridState] = useState(() => getInitialGridState(6, 5));
  const [position, setPosition] = useState([0, -1]);
  const [letterGuessState, setLetterGuessState] = useState<
    Record<string, LetterGuessState>
  >({});

  useEffect(() => {
    console.log(`[DEBUG]: Word of the day is: ${wordOfTheGame}`);
  }, [wordOfTheGame]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
        return;
      }

      if (
        event.target !== document.body &&
        (event.key === "Enter" || event.key === " ")
      ) {
        return;
      }

      onPressKey(event.key);
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  });

  useEffect(() => {
    if (gameState === "GUESSED_CORRECTLY") {
      confettiRef.current?.fire({
        particleCount: 200,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [gameState]);

  function addLetter(char: string) {
    const [row, col] = position;
    const nextCell = col + 1;

    if (nextCell === 5) {
      return;
    }

    const newGridState = [...gridState];
    const newRow = [...newGridState[row]];
    newRow[nextCell] = { state: "tbd", char: char.toUpperCase() };
    newGridState[row] = newRow;

    setGridState(newGridState);
    setPosition([row, nextCell]);
  }

  function deleteLetter() {
    const [row, col] = position;

    if (col === -1) {
      return;
    }

    const newGridState = [...gridState];
    const newRow = [...newGridState[row]];
    newRow[col] = { state: "empty", char: "" };
    newGridState[row] = newRow;

    setGridState(newGridState);
    setPosition([row, col - 1]);
  }

  function checkWord() {
    const [row, col] = position;

    if (col + 1 < 5) return;

    const newGridState = [...gridState];
    const newRow = [...newGridState[row]];
    const newLetterGuessState = { ...letterGuessState };
    const word = gridState[row].map(({ char }) => char).join("");

    const letterFreq = countLetterFreqInWord(wordOfTheGame);

    const nonMatchingIndices = [];
    let matchCount = 0;

    for (let i = 0; i < word.length; i++) {
      const currentChar = word[i];
      const currentActualChar = wordOfTheGame[i];

      if (currentChar === currentActualChar) {
        newRow[i] = { ...newRow[i], state: "correct" };
        newGridState[row] = newRow;

        newLetterGuessState[currentChar] = "correct";

        letterFreq.set(currentChar, letterFreq.get(currentChar) - 1);

        matchCount++;
      } else {
        nonMatchingIndices.push(i);
      }
    }

    if (matchCount === 5) {
      setLetterGuessState(newLetterGuessState);
      setGridState(newGridState);
      setGameState("GUESSED_CORRECTLY");
      return;
    }

    // Update state for rest of the chars.
    nonMatchingIndices.forEach((idx) => {
      const char = word[idx];
      if (letterFreq.has(char) && letterFreq.get(char) > 0) {
        letterFreq.set(char, letterFreq.get(char) - 1);
        newRow[idx] = { ...newRow[idx], state: "present" };
        newGridState[row] = newRow;
        // Only change state if the new state is higher priority
        // than the current state.
        if (
          LETTER_GUESS_STATE_PRIORITY["present"] >
          LETTER_GUESS_STATE_PRIORITY[newLetterGuessState[char] ?? "empty"]
        ) {
          newLetterGuessState[char] = "present";
        }
      } else {
        newRow[idx] = { ...newRow[idx], state: "absent" };
        newGridState[row] = newRow;
        // Only change state if the new state is higher priority
        // than the current state.
        if (
          LETTER_GUESS_STATE_PRIORITY["absent"] >
          LETTER_GUESS_STATE_PRIORITY[newLetterGuessState[char] ?? "empty"]
        ) {
          newLetterGuessState[char] = "absent";
        }
      }
    });

    setLetterGuessState(newLetterGuessState);
    setGridState(newGridState);

    // User did not manage to guess the correct answer.
    if (row + 1 === 6) {
      setGameState("NO_MORE_GUESSES");
      return;
    }

    setPosition([row + 1, -1]);
  }

  const resetGame = () => {
    console.trace("[RESET GAME CALLED]");
    setWordOfTheGame(generateRandomWord());
    setGridState(getInitialGridState(6, 5));
    setPosition([0, -1]);
    setGameState("IN_PROGRESS");
    setLetterGuessState({});
  };

  const isValidKey = (key: string) => {
    return key === "Enter" || key === "Backspace" || /^[a-zA-Z]$/.test(key);
  };

  const onPressKey = (key: string) => {
    if (gameState !== "IN_PROGRESS") return;

    if (!isValidKey(key)) return;

    switch (key) {
      case "Enter":
        checkWord();
        break;
      case "Backspace":
        deleteLetter();
        break;
      default:
        addLetter(key);
        break;
    }
  };

  return (
    <div className="max-w-xl mx-auto flex flex-col items-center relative">
      <GameResult
        gameState={gameState}
        wordOfTheGame={wordOfTheGame}
        onReset={resetGame}
      />

      <Confetti
        ref={confettiRef}
        manualstart
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 9990,
        }}
      />
      <Grid letters={gridState} />
      <Keyboard onPressKey={onPressKey} letterGuessState={letterGuessState} />
    </div>
  );
}
