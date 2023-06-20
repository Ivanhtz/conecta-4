import React, { useState, useEffect } from 'react';
import './App.css';

const filas = 6;
const columnas = 7;

const App = () => {
  const [tablero, setTablero] = useState(() => {
    const board = [];
    for (let fila = 0; fila < filas; fila++) {
      board[fila] = Array(columnas).fill('blanco');
    }
    return board;
  });

  const [jugadorActual, setJugadorActual] = useState('roja');
  const [gameOver, setGameOver] = useState(false);
  const [esVsComputadora, setEsVsComputadora] = useState(false);
  const [contador1, setContador1] = useState(0);
  const [contador2, setContador2] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (esVsComputadora && jugadorActual === 'amarilla') {
      setTimeout(hacerJugadaComputadora, 800);
    }
  }, [jugadorActual, esVsComputadora]);

  const pintarTablero = () => {
    const fichas = [];

    for (let fila = 0; fila < filas; fila++) {
      for (let columna = 0; columna < columnas; columna++) {
        const ficha = (
          <div
            key={`${fila}-${columna}`}
            className={`ficha ${tablero[fila][columna]}`}
            onClick={() => hacerJugada(columna)}
          />
        );
        fichas.push(ficha);
      }
    }

    return fichas;
  };

  const hacerJugada = (columna) => {
    if (gameOver) return;

    const fila = obtenerFilaDisponible(columna);
    if (fila === null) return;

    const nuevoTablero = [...tablero];
    nuevoTablero[fila][columna] = jugadorActual;
    setTablero(nuevoTablero);

    if (esVictoria(fila, columna)) {
      setGameOver(true);
      if (jugadorActual === 'roja') {
        setContador1(contador1 + 1);
      } else {
        setContador2(contador2 + 1);
      }
      setShowPopup(true);
    } else if (esEmpate()) {
      setGameOver(true);
      setShowPopup(true);
    } else {
      setJugadorActual(jugadorActual === 'roja' ? 'amarilla' : 'roja');
    }
  };

  const hacerJugadaComputadora = () => {
    if (gameOver) return;

    let columna;
    do {
      columna = Math.floor(Math.random() * columnas);
    } while (obtenerFilaDisponible(columna) === null);

    hacerJugada(columna);
  };

  const obtenerFilaDisponible = (columna) => {
    for (let fila = filas - 1; fila >= 0; fila--) {
      if (tablero[fila][columna] === 'blanco') {
        return fila;
      }
    }
    return null;
  };

  const esVictoria = (fila, columna) => {
    // Comprobar victoria horizontal
    let count = 0;
    for (let col = 0; col < columnas; col++) {
      if (tablero[fila][col] === jugadorActual) {
        count++;
        if (count >= 4) return true;
      } else {
        count = 0;
      }
    }

    // Comprobar victoria vertical
    count = 0;
    for (let row = 0; row < filas; row++) {
      if (tablero[row][columna] === jugadorActual) {
        count++;
        if (count >= 4) return true;
      } else {
        count = 0;
      }
    }

    // Comprobar victoria diagonal hacia abajo
    count = 0;
    let row = fila;
    let col = columna;
    while (row < filas && col < columnas) {
      if (tablero[row][col] === jugadorActual) {
        count++;
        if (count >= 4) return true;
      } else {
        count = 0;
      }
      row++;
      col++;
    }

    // Comprobar victoria diagonal hacia arriba
    count = 0;
    row = fila;
    col = columna;
    while (row >= 0 && col < columnas) {
      if (tablero[row][col] === jugadorActual) {
        count++;
        if (count >= 4) return true;
      } else {
        count = 0;
      }
      row--;
      col++;
    }

    return false;
  };

  const esEmpate = () => {
    for (let fila = 0; fila < filas; fila++) {
      for (let columna = 0; columna < columnas; columna++) {
        if (tablero[fila][columna] === 'blanco') {
          return false;
        }
      }
    }
    return true;
  };

  const reiniciarJuego = () => {
    setTablero(() => {
      const board = [];
      for (let fila = 0; fila < filas; fila++) {
        board[fila] = Array(columnas).fill('blanco');
      }
      return board;
    });
    setJugadorActual('roja');
    setGameOver(false);
    setEsVsComputadora(false);
    setContador1(0);
    setContador2(0);
    setShowPopup(false);
  };

  return (
    <main>
      <header>
        <h1>Conecta 4</h1>
      </header>
      <div className="tablero">{pintarTablero()}</div>

      <div className="jugadores">
        <div className="jugador1">
          <p>Jugador 1: <span> {contador1} </span></p>
        </div>
        <div className="jugador2">
          <p>Jugador 2: <span> {contador2} </span></p>
        </div>
      </div>

      <div className="modo-juego">
        <button
          className={`btn-vs-computadora ${esVsComputadora ? 'active' : ''}`}
          onClick={() => setEsVsComputadora(!esVsComputadora)}
        >
          Jugar contra el ordenador
        </button>
      </div>

      {gameOver && (
        <div className="boton-reiniciar">
          <button className='boton-re' onClick={reiniciarJuego}>Reiniciar</button>
        </div>
      )}

      {showPopup && (
        <div className="popup">
          {jugadorActual === 'roja' ? (
            <p>¡Jugador 1 (Roja) ha ganado!</p>
          ) : (
            <p>¡Jugador 2 (Amarilla) ha ganado!</p>
          )}
          <button onClick={reiniciarJuego}>Aceptar</button>
        </div>
      )}
    </main>
  );
};

export default App;
