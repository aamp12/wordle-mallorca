import React, { useState, useEffect } from 'react';

const WORD_LENGTH = 8;
const MAX_GUESSES = 6;
const TARGET_WORD = 'MALLORCA';

const WordleMallorca = () => {
  const [guesses, setGuesses] = useState(Array(MAX_GUESSES).fill(''));
  const [currentGuess, setCurrentGuess] = useState('');
  const [currentRow, setCurrentRow] = useState(0);
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'
  const [keyboardStatus, setKeyboardStatus] = useState({});

  const keyboard = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
  ];

  const getLetterStatus = (letter, position, word) => {
    if (TARGET_WORD[position] === letter) {
      return 'correct';
    } else if (TARGET_WORD.includes(letter)) {
      return 'present';
    } else {
      return 'absent';
    }
  };

  const updateKeyboardStatus = (word) => {
    const newKeyboardStatus = { ...keyboardStatus };
    
    for (let i = 0; i < word.length; i++) {
      const letter = word[i];
      const status = getLetterStatus(letter, i, word);
      
      if (!newKeyboardStatus[letter] || 
          (newKeyboardStatus[letter] !== 'correct' && status === 'correct') ||
          (newKeyboardStatus[letter] === 'absent' && status === 'present')) {
        newKeyboardStatus[letter] = status;
      }
    }
    
    setKeyboardStatus(newKeyboardStatus);
  };

  const handleKeyPress = (key) => {
    if (gameStatus !== 'playing') return;

    if (key === 'ENTER') {
      if (currentGuess.length !== WORD_LENGTH) {
        alert(`La palabra debe tener ${WORD_LENGTH} letras`);
        return;
      }
      
      const newGuesses = [...guesses];
      newGuesses[currentRow] = currentGuess;
      setGuesses(newGuesses);
      
      updateKeyboardStatus(currentGuess);
      
      if (currentGuess === TARGET_WORD) {
        setGameStatus('won');
      } else if (currentRow === MAX_GUESSES - 1) {
        setGameStatus('lost');
      } else {
        setCurrentRow(currentRow + 1);
        setCurrentGuess('');
      }
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (currentGuess.length < WORD_LENGTH && /^[A-Z]$/.test(key)) {
      setCurrentGuess(currentGuess + key);
    }
  };

  const handlePhysicalKeyPress = (e) => {
    const key = e.key.toUpperCase();
    if (key === 'ENTER') {
      handleKeyPress('ENTER');
    } else if (key === 'BACKSPACE') {
      handleKeyPress('BACKSPACE');
    } else if (/^[A-Z]$/.test(key)) {
      handleKeyPress(key);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handlePhysicalKeyPress);
    return () => window.removeEventListener('keydown', handlePhysicalKeyPress);
  }, [handlePhysicalKeyPress, currentGuess, currentRow, gameStatus]);

  const resetGame = () => {
    setGuesses(Array(MAX_GUESSES).fill(''));
    setCurrentGuess('');
    setCurrentRow(0);
    setGameStatus('playing');
    setKeyboardStatus({});
  };

  const renderGrid = () => {
    return (
      <div className="grid gap-1 mb-6">
        {guesses.map((guess, rowIndex) => (
          <div key={rowIndex} className="flex gap-1 justify-center">
            {Array(WORD_LENGTH).fill('').map((_, colIndex) => {
              const letter = rowIndex === currentRow ? 
                (currentGuess[colIndex] || '') : 
                (guess[colIndex] || '');
              
              let cellClass = 'w-12 h-12 border-2 flex items-center justify-center text-xl font-bold uppercase';
              
              if (rowIndex < currentRow && guess) {
                const status = getLetterStatus(guess[colIndex], colIndex, guess);
                if (status === 'correct') {
                  cellClass += ' bg-green-500 text-white border-green-500';
                } else if (status === 'present') {
                  cellClass += ' bg-yellow-500 text-white border-yellow-500';
                } else {
                  cellClass += ' bg-gray-500 text-white border-gray-500';
                }
              } else if (letter) {
                cellClass += ' border-gray-500 bg-white';
              } else {
                cellClass += ' border-gray-300 bg-white';
              }
              
              return (
                <div key={colIndex} className={cellClass}>
                  {letter}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  const renderKeyboard = () => {
    return (
      <div className="space-y-1">
        {keyboard.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1">
            {row.map((key) => {
              let keyClass = 'px-3 py-2 rounded font-bold text-sm cursor-pointer select-none';
              
              if (key === 'ENTER' || key === 'BACKSPACE') {
                keyClass += ' bg-gray-400 text-white px-4';
              } else {
                const status = keyboardStatus[key];
                if (status === 'correct') {
                  keyClass += ' bg-green-500 text-white';
                } else if (status === 'present') {
                  keyClass += ' bg-yellow-500 text-white';
                } else if (status === 'absent') {
                  keyClass += ' bg-gray-500 text-white';
                } else {
                  keyClass += ' bg-gray-200 hover:bg-gray-300';
                }
              }
              
              return (
                <button
                  key={key}
                  className={keyClass}
                  onClick={() => handleKeyPress(key)}
                >
                  {key === 'BACKSPACE' ? '⌫' : key}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white min-h-screen">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">Adivina el destino...</h1>
        <p className="text-gray-600">¡Adivina la palabra en {MAX_GUESSES} intentos!</p>
        <div className="text-sm text-gray-500 mt-2">
          <div className="flex justify-center gap-4">
            <span className="flex items-center gap-1">
              <div className="w-4 h-4 bg-green-500"></div>
              Correcto
            </span>
            <span className="flex items-center gap-1">
              <div className="w-4 h-4 bg-yellow-500"></div>
              Presente
            </span>
            <span className="flex items-center gap-1">
              <div className="w-4 h-4 bg-gray-500"></div>
              Ausente
            </span>
          </div>
        </div>
      </div>

      {renderGrid()}

      {gameStatus === 'won' && (
        <div className="text-center mb-4 p-4 bg-green-100 rounded-lg">
          <h2 className="text-2xl font-bold text-green-700">¡Felicidades!, nos vamos a.. </h2>
          <p className="text-green-600">MALLORCA🎉 ¡Prepara la mochila para este viernes!</p>
        </div>
      )}

      {gameStatus === 'lost' && (
        <div className="text-center mb-4 p-4 bg-red-100 rounded-lg">
          <h2 className="text-2xl font-bold text-red-700">¡Juego terminado! 😔</h2>
          <p className="text-red-600">El destino es: <strong>MALLORCA</strong></p>
        </div>
      )}

      {gameStatus !== 'playing' && (
        <div className="text-center mb-4">
          <button
            onClick={resetGame}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-600"
          >
            Jugar de nuevo
          </button>
        </div>
      )}

      {renderKeyboard()}
    </div>
  );
};

export default WordleMallorca;
