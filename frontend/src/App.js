import { useState } from "react";
import * as ChessJS from "chess.js"; // import { Chess } from 'chess.js' gives an error
import { Chessboard } from "react-chessboard";
import axios from "axios";

const App = () => {
  const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess; // For VS code intellisence to work
  const [game, setGame] = useState(
    new Chess("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
  );
  const [fen, setfen] = useState(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  );
  const setCurrentTimeout = useState()[1];

  function makeRandomMove() {
    const url = "http://localhost:8000/play";
    const data = {};
    const headers = { strange_header: game.fen() };

    console.log(fen);
    axios
      .post(url, data, { headers })
      .then((response) => {
        console.log(response);
        game.move(response.data.move);
        setGame(game);
        setfen(game.fen());
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function onDrop(sourceSquare, targetSquare) {
    // const copy = new Chess(game.fen());
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for example simplicity
    });
    setGame(game);
    setfen(game.fen());
    // illegal move
    if (move === null) return false;

    // store timeout so it can be cleared on undo/reset so computer doesn't execute move
    const newTimeout = setTimeout(makeRandomMove, 200);
    setCurrentTimeout(newTimeout);
    return true;
  }

  // const pieces = [
  //   "wP",
  //   "wN",
  //   "wB",
  //   "wR",
  //   "wQ",
  //   "wK",
  //   "bP",
  //   "bN",
  //   "bB",
  //   "bR",
  //   "bQ",
  //   "bK",
  // ];
  // const customPieces = () => {
  //   const returnPieces = {};
  //   pieces.map((p) => {
  //     returnPieces[p] = ({ squareWidth }) => (
  //       <div
  //         style={{
  //           width: squareWidth,
  //           height: squareWidth,
  //           backgroundImage: `url(/${p}.png)`,
  //           backgroundSize: "100%",
  //         }}
  //       />
  //     );
  //     return null;
  //   });
  //   return returnPieces;
  // };

  return (
    <div
      style={{
        height: "50%",
        width: "50%",
      }}
    >
      <Chessboard
        id="PlayVsRandom"
        position={fen}
        onPieceDrop={onDrop}
        customBoardStyle={{
          borderRadius: "4px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
        }}
        customDarkSquareStyle={{ backgroundColor: "#779952" }}
        customLightSquareStyle={{ backgroundColor: "#edeed1" }}
        // customPieces={customPieces()}
        // size
      />
    </div>
  );
};
export default App;
