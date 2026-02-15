import { useState } from "react";
import "./assets/styles.css";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
function App() {
  const freshBoard = [
    [
      "black_rook",
      "black_knight",
      "black_bishop",
      "black_queen",
      "black_king",
      "black_bishop",
      "black_knight",
      "black_rook",
    ],
    [
      "black_pawn",
      "black_pawn",
      "black_pawn",
      "black_pawn",
      "black_pawn",
      "black_pawn",
      "black_pawn",
      "black_pawn",
    ],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    [
      "white_pawn",
      "white_pawn",
      "white_pawn",
      "white_pawn",
      "white_pawn",
      "white_pawn",
      "white_pawn",
      "white_pawn",
    ],
    [
      "white_rook",
      "white_knight",
      "white_bishop",
      "white_queen",
      "white_king",
      "white_bishop",
      "white_knight",
      "white_rook",
    ],
  ];
  const [chessBoard, setChessBoard] = useState(freshBoard);
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [movingPiece, setMovingPiece] = useState(null);
  const [movingPiecePossibleMoves, setMovingPiecePossibleMoves] = useState([]);
  const [winner, setWinner] = useState(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const handleClose = () => setShowWinnerModal(false);
  const handleOpen = () => setShowWinnerModal(true);
  const [eatenWhites, setEatenWhites] = useState([]);
  const [eatenBlacks, setEatenBlacks] = useState([]);
  const [selectPiece, setSelectPiece] = useState(false);
  const [possiblePieces, setPossiblePieces] = useState([]);
  const closeSelect = () => setSelectPiece(false);
  const openSelect = () => setSelectPiece(true);
  function replacePiece(newPiece, tile, oldPiece) {
    setChessBoard((prev) => {
      const updatedBoard = prev.map((row) => [...row]);
      updatedBoard[tile.row][tile.col] = newPiece;
      return updatedBoard;
    });
    if (oldPiece.includes("black")) {
      setEatenBlacks((prev) => prev.filter((piece) => piece !== newPiece));
      setEatenBlacks((prev) => [...prev, oldPiece]);
      setPossiblePieces([]);
      closeSelect();
    }
    if (oldPiece.includes("white")) {
      setEatenWhites((prev) => prev.filter((piece) => piece !== newPiece));
      setEatenWhites((prev) => [...prev, oldPiece]);
      setPossiblePieces([]);
      closeSelect();
    }
  }
  function movePiece(from, to) {
    const movingPiece = chessBoard[from.row][from.col] || null;
    if (movingPiece.includes("white_pawn") && to.row === 0) {
      eatenWhites.map((piece) => {
        setPossiblePieces((prev) => [
          ...prev,
          { name: piece, tile: to, eatingPiece: movingPiece },
        ]);
      });
      openSelect();
    }
    if (movingPiece.includes("black_pawn") && to.row === 7) {
      eatenBlacks.map((piece) => {
        setPossiblePieces((prev) => [
          ...prev,
          { name: piece, tile: to, eatingPiece: movingPiece },
        ]);
      });
      openSelect();
    }
    const eatenPiece = chessBoard[to.row][to.col] || null;
    if (eatenPiece?.includes("king")) {
      isWhite(to) ? setWinner("Musta") : setWinner("Valkoinen");
      handleOpen();
    }
    if (isWhite(to))
      setEatenWhites((prev) => [...prev, chessBoard[to.row][to.col]]);
    if (!isWhite(to))
      setEatenBlacks((prev) => [...prev, chessBoard[to.row][to.col]]);
    setChessBoard((prev) => {
      const updatedBoard = prev.map((row) => [...row]);
      updatedBoard[to.row][to.col] = updatedBoard[from.row][from.col];
      updatedBoard[from.row][from.col] = "";
      return updatedBoard;
    });
  }
  function isTileInsideBoard(tile) {
    return tile.row <= 7 && tile.row >= 0 && tile.col <= 7 && tile.col >= 0;
  }
  function isWhite(tile) {
    if (!isTileInsideBoard(tile)) return null;
    const piece = chessBoard[tile.row][tile.col];
    return piece.includes("white") ? true : false;
  }
  function isTileEmpty(tile) {
    return chessBoard[tile.row][tile.col] == "";
  }
  function isOwnPiece(movingTile, destinationTile) {
    if (chessBoard[destinationTile.row][destinationTile.col] == "") return null;
    return isWhite(movingTile) == isWhite(destinationTile);
  }
  function calculatePossibleMoves(tile) {
    const piece = chessBoard[tile.row][tile.col];
    if (piece.includes("pawn")) {
      const direction = isWhite(tile) ? -1 : 1;
      const startRow = isWhite(tile) ? 6 : 1;
      const pawnDirections = [
        {
          row: tile.row + 1 * direction,
          col: tile.col,
        },
        {
          row: tile.row + 2 * direction,
          col: tile.col,
        },
        {
          row: tile.row + 1 * direction,
          col: tile.col + 1,
        },
        {
          row: tile.row + 1 * direction,
          col: tile.col - 1,
        },
      ];
      if (isTileEmpty(pawnDirections[0])) {
        setMovingPiecePossibleMoves((prev) => [...prev, pawnDirections[0]]);
        if (tile.row === startRow && isTileEmpty(pawnDirections[1])) {
          setMovingPiecePossibleMoves((prev) => [...prev, pawnDirections[1]]);
        }
      }
      if (
        !isTileEmpty(pawnDirections[2]) &&
        !isOwnPiece(tile, pawnDirections[2])
      ) {
        setMovingPiecePossibleMoves((prev) => [...prev, pawnDirections[2]]);
      }
      if (
        !isTileEmpty(pawnDirections[3]) &&
        !isOwnPiece(tile, pawnDirections[3])
      ) {
        setMovingPiecePossibleMoves((prev) => [...prev, pawnDirections[3]]);
      }
    }
    if (piece.includes("knight")) {
      const knightDirections = [
        {
          row: tile.row - 2,
          col: tile.col + 1,
        },
        {
          row: tile.row - 2,
          col: tile.col - 1,
        },
        {
          row: tile.row + 2,
          col: tile.col + 1,
        },
        {
          row: tile.row + 2,
          col: tile.col - 1,
        },
        {
          row: tile.row + 1,
          col: tile.col + 2,
        },
        {
          row: tile.row + 1,
          col: tile.col - 2,
        },
        {
          row: tile.row - 1,
          col: tile.col + 2,
        },
        {
          row: tile.row - 1,
          col: tile.col - 2,
        },
      ];
      for (let knightDirection of knightDirections) {
        if (
          isTileInsideBoard(knightDirection) &&
          !isOwnPiece(tile, knightDirection)
        ) {
          setMovingPiecePossibleMoves((prev) => [...prev, knightDirection]);
        }
      }
    }
    if (piece.includes("rook")) {
      const rookDirections = [
        { row: -1, col: 0 },
        { row: 1, col: 0 },
        { row: 0, col: -1 },
        { row: 0, col: 1 },
      ];
      for (let rookDirection of rookDirections) {
        let steps = 1;
        while (steps <= 8) {
          const rookDirectionTile = {
            row: tile.row + rookDirection.row * steps,
            col: tile.col + rookDirection.col * steps,
          };
          if (isTileInsideBoard(rookDirectionTile)) {
            // Laudalla
            if (isOwnPiece(tile, rookDirectionTile)) break;
            if (
              !isTileEmpty(rookDirectionTile) &&
              !isOwnPiece(tile, rookDirectionTile)
            ) {
              setMovingPiecePossibleMoves((prev) => [
                ...prev,
                rookDirectionTile,
              ]);
              break;
            }
            setMovingPiecePossibleMoves((prev) => [...prev, rookDirectionTile]);
          }
          steps++;
        }
      }
    }
    if (piece.includes("bishop")) {
      const bishopDirections = [
        {
          row: 1,
          col: 1,
        },
        {
          row: 1,
          col: -1,
        },
        {
          row: -1,
          col: 1,
        },
        {
          row: -1,
          col: -1,
        },
      ];
      for (let bishopDirection of bishopDirections) {
        let steps = 1;
        while (steps <= 8) {
          const bishopDirectionTile = {
            row: tile.row + bishopDirection.row * steps,
            col: tile.col + bishopDirection.col * steps,
          };
          if (isTileInsideBoard(bishopDirectionTile)) {
            // Laudalla
            if (isOwnPiece(tile, bishopDirectionTile)) break;
            if (
              !isTileEmpty(bishopDirectionTile) &&
              !isOwnPiece(tile, bishopDirectionTile)
            ) {
              setMovingPiecePossibleMoves((prev) => [
                ...prev,
                bishopDirectionTile,
              ]);
              break;
            }
            setMovingPiecePossibleMoves((prev) => [
              ...prev,
              bishopDirectionTile,
            ]);
          }
          steps++;
        }
      }
    }
    if (piece.includes("queen")) {
      const queenDirections = [
        {
          row: 1,
          col: 1,
        },
        {
          row: 1,
          col: -1,
        },
        {
          row: -1,
          col: 1,
        },
        {
          row: -1,
          col: -1,
        },
        { row: -1, col: 0 },
        { row: 1, col: 0 },
        { row: 0, col: -1 },
        { row: 0, col: 1 },
      ];
      for (let queenDirection of queenDirections) {
        let steps = 1;
        while (steps <= 8) {
          const queenDirectionTile = {
            row: tile.row + queenDirection.row * steps,
            col: tile.col + queenDirection.col * steps,
          };
          if (isTileInsideBoard(queenDirectionTile)) {
            if (isOwnPiece(tile, queenDirectionTile)) break;
            if (
              !isTileEmpty(queenDirectionTile) &&
              !isOwnPiece(tile, queenDirectionTile)
            ) {
              setMovingPiecePossibleMoves((prev) => [
                ...prev,
                queenDirectionTile,
              ]);
              break;
            }
            setMovingPiecePossibleMoves((prev) => [
              ...prev,
              queenDirectionTile,
            ]);
          }
          steps++;
        }
      }
    }
    if (piece.includes("king")) {
      const kingDirections = [
        {
          row: 1,
          col: 1,
        },
        {
          row: 1,
          col: -1,
        },
        {
          row: -1,
          col: 1,
        },
        {
          row: -1,
          col: -1,
        },
        { row: -1, col: 0 },
        { row: 1, col: 0 },
        { row: 0, col: -1 },
        { row: 0, col: 1 },
      ];
      for (let kingDirection of kingDirections) {
        const kingDirectionTile = {
          row: tile.row + kingDirection.row,
          col: tile.col + kingDirection.col,
        };
        if (isTileInsideBoard(kingDirectionTile)) {
          if (!isOwnPiece(tile, kingDirectionTile)) {
            setMovingPiecePossibleMoves((prev) => [...prev, kingDirectionTile]);
          }
        }
      }
    }
  }
  function handleClick(event) {
    const clickedTile = {
      row: Number(event.target.dataset.row),
      col: Number(event.target.dataset.col),
    };
    if (!movingPiece) {
      if (!isWhite(clickedTile) && isWhiteTurn) return;
      if (isWhite(clickedTile) && !isWhiteTurn) return;
      setMovingPiece(clickedTile);
      calculatePossibleMoves(clickedTile);
    } else {
      if (
        movingPiecePossibleMoves.some(
          (move) =>
            move.row === clickedTile.row && move.col === clickedTile.col,
        )
      ) {
        movePiece(movingPiece, clickedTile);
        setIsWhiteTurn(!isWhiteTurn);
      }
      setMovingPiecePossibleMoves([]);
      setMovingPiece(null);
    }
  }
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <Modal
        open={selectPiece}
        onClose={closeSelect}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Valitse sotilaan tilalle nappula!
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {possiblePieces &&
              possiblePieces.map((piece, pieceIndex) => (
                <img
                  key={pieceIndex}
                  onClick={() =>
                    replacePiece(piece.name, piece.tile, piece.eatingPiece)
                  }
                  src={`${piece.name}.webp`}
                  alt=""
                ></img>
              ))}
          </Typography>
        </Box>
      </Modal>
      <Modal
        open={showWinnerModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {winner && winner} voitti shakki-pelin!
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <Button
              onClick={() => {
                setChessBoard(freshBoard);
                setWinner(null);
                setShowWinnerModal(false);
                setIsWhiteTurn(true);
                setEatenWhites(null);
                setEatenBlacks(null);
              }}
            >
              Aloita uusi peli
            </Button>
          </Typography>
        </Box>
      </Modal>
      <div className="turn">{!isWhiteTurn && "Mustan vuoro"}</div>
      <div className="board-wrapper">
        <div className="eaten">
          {eatenWhites &&
            eatenWhites.map(
              (piece, pieceIndex) =>
                piece !==
                ""(<img key={pieceIndex} src={`${piece}.webp`} alt="" />),
            )}
        </div>
        <div id="board">
          {chessBoard.map((row, rowIndex) =>
            row.map((col, colIndex) => {
              return (
                <div
                  onClick={(e) => handleClick(e)}
                  data-row={rowIndex}
                  data-col={colIndex}
                  key={`${rowIndex}-${colIndex}`}
                  style={{
                    backgroundColor:
                      movingPiecePossibleMoves &&
                      movingPiecePossibleMoves.some(
                        (move) =>
                          move.row === rowIndex && move.col === colIndex,
                      )
                        ? "#8af3a1"
                        : movingPiece &&
                            movingPiece.row === rowIndex &&
                            movingPiece.col === colIndex
                          ? "#b4f5c2"
                          : (rowIndex + colIndex) % 2 === 1
                            ? "#a8a8a8"
                            : "#ffff",
                  }}
                >
                  {col && <img src={`${col}.webp`} alt="" />}
                </div>
              );
            }),
          )}
        </div>
        <div className="eaten">
          {eatenBlacks &&
            eatenBlacks.map(
              (piece, pieceIndex) =>
                piece !==
                ""(<img key={pieceIndex} src={`${piece}.webp`} alt="" />),
            )}
        </div>
      </div>

      <div className="turn">{isWhiteTurn && "Valkoisen vuoro"}</div>
    </>
  );
}
export default App;
