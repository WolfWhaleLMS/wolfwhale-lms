'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, RotateCcw, Sparkles } from 'lucide-react'

// Types
type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king'
type Color = 'white' | 'black'

interface Piece {
  type: PieceType
  color: Color
}

type Board = (Piece | null)[][]

interface Position {
  row: number
  col: number
}

interface Move {
  from: Position
  to: Position
  piece: Piece
  captured?: Piece
  notation: string
}

type Difficulty = 'easy' | 'medium' | 'hard'

// Unicode chess pieces
const PIECE_SYMBOLS: Record<Color, Record<PieceType, string>> = {
  white: {
    king: '♔',
    queen: '♕',
    rook: '♖',
    bishop: '♗',
    knight: '♘',
    pawn: '♙',
  },
  black: {
    king: '♚',
    queen: '♛',
    rook: '♜',
    bishop: '♝',
    knight: '♞',
    pawn: '♟',
  },
}

// Piece values for AI evaluation
const PIECE_VALUES: Record<PieceType, number> = {
  pawn: 1,
  knight: 3,
  bishop: 3,
  rook: 5,
  queen: 9,
  king: 100,
}

// Center squares bonus for AI
const CENTER_SQUARES = [
  [3, 3], [3, 4], [4, 3], [4, 4],
]

// Initialize the chess board
function createInitialBoard(): Board {
  const board: Board = Array(8).fill(null).map(() => Array(8).fill(null))

  // Black pieces (top)
  board[0] = [
    { type: 'rook', color: 'black' },
    { type: 'knight', color: 'black' },
    { type: 'bishop', color: 'black' },
    { type: 'queen', color: 'black' },
    { type: 'king', color: 'black' },
    { type: 'bishop', color: 'black' },
    { type: 'knight', color: 'black' },
    { type: 'rook', color: 'black' },
  ]
  board[1] = Array(8).fill(null).map(() => ({ type: 'pawn' as PieceType, color: 'black' as Color }))

  // White pieces (bottom)
  board[6] = Array(8).fill(null).map(() => ({ type: 'pawn' as PieceType, color: 'white' as Color }))
  board[7] = [
    { type: 'rook', color: 'white' },
    { type: 'knight', color: 'white' },
    { type: 'bishop', color: 'white' },
    { type: 'queen', color: 'white' },
    { type: 'king', color: 'white' },
    { type: 'bishop', color: 'white' },
    { type: 'knight', color: 'white' },
    { type: 'rook', color: 'white' },
  ]

  return board
}

// Get valid moves for a piece
function getValidMoves(board: Board, pos: Position, piece: Piece): Position[] {
  const moves: Position[] = []
  const { row, col } = pos

  const addMove = (r: number, c: number) => {
    if (r >= 0 && r < 8 && c >= 0 && c < 8) {
      const target = board[r][c]
      if (!target || target.color !== piece.color) {
        moves.push({ row: r, col: c })
      }
      return !target // Can continue in this direction if empty
    }
    return false
  }

  switch (piece.type) {
    case 'pawn': {
      const direction = piece.color === 'white' ? -1 : 1
      const startRow = piece.color === 'white' ? 6 : 1

      // Forward move
      if (!board[row + direction]?.[col]) {
        moves.push({ row: row + direction, col })

        // Double move from start
        if (row === startRow && !board[row + 2 * direction]?.[col]) {
          moves.push({ row: row + 2 * direction, col })
        }
      }

      // Captures
      for (const dc of [-1, 1]) {
        const target = board[row + direction]?.[col + dc]
        if (target && target.color !== piece.color) {
          moves.push({ row: row + direction, col: col + dc })
        }
      }
      break
    }

    case 'rook': {
      // Horizontal and vertical
      for (const [dr, dc] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
        for (let i = 1; i < 8; i++) {
          if (!addMove(row + dr * i, col + dc * i)) break
        }
      }
      break
    }

    case 'knight': {
      const offsets = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1],
      ]
      for (const [dr, dc] of offsets) {
        addMove(row + dr, col + dc)
      }
      break
    }

    case 'bishop': {
      // Diagonals
      for (const [dr, dc] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
        for (let i = 1; i < 8; i++) {
          if (!addMove(row + dr * i, col + dc * i)) break
        }
      }
      break
    }

    case 'queen': {
      // Combination of rook and bishop
      for (const [dr, dc] of [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
        for (let i = 1; i < 8; i++) {
          if (!addMove(row + dr * i, col + dc * i)) break
        }
      }
      break
    }

    case 'king': {
      for (const dr of [-1, 0, 1]) {
        for (const dc of [-1, 0, 1]) {
          if (dr === 0 && dc === 0) continue
          addMove(row + dr, col + dc)
        }
      }
      break
    }
  }

  return moves
}

// Find the king's position
function findKing(board: Board, color: Color): Position | null {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col]
      if (piece?.type === 'king' && piece.color === color) {
        return { row, col }
      }
    }
  }
  return null
}

// Check if a position is under attack
function isPositionUnderAttack(board: Board, pos: Position, byColor: Color): boolean {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col]
      if (piece?.color === byColor) {
        const moves = getValidMoves(board, { row, col }, piece)
        if (moves.some(m => m.row === pos.row && m.col === pos.col)) {
          return true
        }
      }
    }
  }
  return false
}

// Check if a color is in check
function isInCheck(board: Board, color: Color): boolean {
  const kingPos = findKing(board, color)
  if (!kingPos) return false
  return isPositionUnderAttack(board, kingPos, color === 'white' ? 'black' : 'white')
}

// Make a move on the board (returns new board)
function makeMove(board: Board, from: Position, to: Position): Board {
  const newBoard = board.map(row => [...row])
  const piece = newBoard[from.row][from.col]

  // Handle pawn promotion
  if (piece?.type === 'pawn' && (to.row === 0 || to.row === 7)) {
    newBoard[to.row][to.col] = { type: 'queen', color: piece.color }
  } else {
    newBoard[to.row][to.col] = piece
  }

  newBoard[from.row][from.col] = null
  return newBoard
}

// Check if a move is legal (doesn't put own king in check)
function isMoveLegal(board: Board, from: Position, to: Position, color: Color): boolean {
  const newBoard = makeMove(board, from, to)
  return !isInCheck(newBoard, color)
}

// Get all legal moves for a color
function getAllLegalMoves(board: Board, color: Color): { from: Position; to: Position; piece: Piece }[] {
  const legalMoves: { from: Position; to: Position; piece: Piece }[] = []

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col]
      if (piece?.color === color) {
        const from = { row, col }
        const moves = getValidMoves(board, from, piece)

        for (const to of moves) {
          if (isMoveLegal(board, from, to, color)) {
            legalMoves.push({ from, to, piece })
          }
        }
      }
    }
  }

  return legalMoves
}

// Check if game is over (checkmate or stalemate)
function isGameOver(board: Board, color: Color): { checkmate: boolean; stalemate: boolean } {
  const legalMoves = getAllLegalMoves(board, color)
  const hasNoMoves = legalMoves.length === 0
  const inCheck = isInCheck(board, color)

  return {
    checkmate: hasNoMoves && inCheck,
    stalemate: hasNoMoves && !inCheck,
  }
}

// Evaluate board position for AI
function evaluateBoard(board: Board, color: Color): number {
  let score = 0

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col]
      if (!piece) continue

      const value = PIECE_VALUES[piece.type]
      const multiplier = piece.color === color ? 1 : -1
      score += value * multiplier

      // Center control bonus
      if (CENTER_SQUARES.some(([r, c]) => r === row && c === col)) {
        score += 0.3 * multiplier
      }
    }
  }

  // Check bonus
  if (isInCheck(board, color === 'white' ? 'black' : 'white')) {
    score += 0.5
  }

  return score
}

// AI move selection
function getComputerMove(
  board: Board,
  difficulty: Difficulty
): { from: Position; to: Position } | null {
  const legalMoves = getAllLegalMoves(board, 'black')
  if (legalMoves.length === 0) return null

  if (difficulty === 'easy') {
    // Random move
    const move = legalMoves[Math.floor(Math.random() * legalMoves.length)]
    return { from: move.from, to: move.to }
  }

  if (difficulty === 'medium') {
    // Prioritize captures and checks
    const captures = legalMoves.filter(m => board[m.to.row][m.to.col] !== null)
    const checks = legalMoves.filter(m => {
      const newBoard = makeMove(board, m.from, m.to)
      return isInCheck(newBoard, 'white')
    })

    if (checks.length > 0) {
      const move = checks[Math.floor(Math.random() * checks.length)]
      return { from: move.from, to: move.to }
    }

    if (captures.length > 0) {
      const move = captures[Math.floor(Math.random() * captures.length)]
      return { from: move.from, to: move.to }
    }

    const move = legalMoves[Math.floor(Math.random() * legalMoves.length)]
    return { from: move.from, to: move.to }
  }

  // Hard: Minimax with evaluation
  let bestMove = null
  let bestScore = -Infinity

  for (const move of legalMoves) {
    const newBoard = makeMove(board, move.from, move.to)
    let score = evaluateBoard(newBoard, 'black')

    // Look ahead one move for white's best response
    const whiteResponses = getAllLegalMoves(newBoard, 'white')
    if (whiteResponses.length > 0) {
      let worstResponse = Infinity
      for (const response of whiteResponses.slice(0, 10)) { // Limit search
        const responseBoard = makeMove(newBoard, response.from, response.to)
        const responseScore = evaluateBoard(responseBoard, 'black')
        worstResponse = Math.min(worstResponse, responseScore)
      }
      score = worstResponse
    }

    // Bonus for captures
    if (board[move.to.row][move.to.col]) {
      score += PIECE_VALUES[board[move.to.row][move.to.col]!.type] * 0.1
    }

    if (score > bestScore) {
      bestScore = score
      bestMove = move
    }
  }

  return bestMove ? { from: bestMove.from, to: bestMove.to } : null
}

// Convert move to algebraic notation
function getMoveNotation(board: Board, from: Position, to: Position, captured: boolean): string {
  const piece = board[from.row][from.col]
  if (!piece) return ''

  const pieceSymbol = piece.type === 'pawn' ? '' : piece.type[0].toUpperCase()
  const toSquare = `${String.fromCharCode(97 + to.col)}${8 - to.row}`
  const captureSymbol = captured ? 'x' : ''

  return `${pieceSymbol}${captureSymbol}${toSquare}`
}

export default function ChessPage() {
  const [board, setBoard] = useState<Board>(createInitialBoard())
  const [selectedPos, setSelectedPos] = useState<Position | null>(null)
  const [validMoves, setValidMoves] = useState<Position[]>([])
  const [currentTurn, setCurrentTurn] = useState<Color>('white')
  const [moveHistory, setMoveHistory] = useState<Move[]>([])
  const [lastMove, setLastMove] = useState<{ from: Position; to: Position } | null>(null)
  const [gameStatus, setGameStatus] = useState<string>('Your turn')
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [isThinking, setIsThinking] = useState(false)
  const [capturedPieces, setCapturedPieces] = useState<{ white: Piece[]; black: Piece[] }>({
    white: [],
    black: [],
  })

  // Check game state
  useEffect(() => {
    if (currentTurn === 'white' && !isThinking) {
      const { checkmate, stalemate } = isGameOver(board, 'white')

      if (checkmate) {
        setGameStatus('Checkmate! Computer wins!')
      } else if (stalemate) {
        setGameStatus('Stalemate! Draw.')
      } else if (isInCheck(board, 'white')) {
        setGameStatus('Check! Your turn')
      } else {
        setGameStatus('Your turn')
      }
    }
  }, [board, currentTurn, isThinking])

  // Computer's turn
  useEffect(() => {
    if (currentTurn === 'black' && !isThinking) {
      setIsThinking(true)
      setGameStatus('Computer thinking...')

      setTimeout(() => {
        const computerMove = getComputerMove(board, difficulty)

        if (computerMove) {
          const { from, to } = computerMove
          const piece = board[from.row][from.col]!
          const captured = board[to.row][to.col]

          const newBoard = makeMove(board, from, to)
          setBoard(newBoard)
          setLastMove({ from, to })

          // Track captured pieces
          if (captured) {
            setCapturedPieces(prev => ({
              ...prev,
              white: [...prev.white, captured],
            }))
          }

          // Add to move history
          const notation = getMoveNotation(board, from, to, !!captured)
          setMoveHistory(prev => [...prev, { from, to, piece, captured: captured ?? undefined, notation }])

          setCurrentTurn('white')
          setIsThinking(false)

          // Check if player is in checkmate/stalemate after computer's move
          const { checkmate, stalemate } = isGameOver(newBoard, 'white')
          if (checkmate) {
            setGameStatus('Checkmate! Computer wins!')
          } else if (stalemate) {
            setGameStatus('Stalemate! Draw.')
          }
        } else {
          // Computer has no moves (checkmate/stalemate)
          const { checkmate, stalemate } = isGameOver(board, 'black')
          if (checkmate) {
            setGameStatus('Checkmate! You win!')
          } else if (stalemate) {
            setGameStatus('Stalemate! Draw.')
          }
          setIsThinking(false)
        }
      }, 500)
    }
  }, [currentTurn, board, difficulty, isThinking])

  const handleSquareClick = (row: number, col: number) => {
    if (currentTurn !== 'white' || isThinking) return

    const clickedPiece = board[row][col]

    // If a piece is selected, try to move it
    if (selectedPos) {
      const isValidMove = validMoves.some(m => m.row === row && m.col === col)

      if (isValidMove) {
        const piece = board[selectedPos.row][selectedPos.col]!
        const captured = board[row][col]

        const newBoard = makeMove(board, selectedPos, { row, col })
        setBoard(newBoard)
        setLastMove({ from: selectedPos, to: { row, col } })

        // Track captured pieces
        if (captured) {
          setCapturedPieces(prev => ({
            ...prev,
            black: [...prev.black, captured],
          }))
        }

        // Add to move history
        const notation = getMoveNotation(board, selectedPos, { row, col }, !!captured)
        setMoveHistory(prev => [...prev, { from: selectedPos, to: { row, col }, piece, captured: captured ?? undefined, notation }])

        setSelectedPos(null)
        setValidMoves([])
        setCurrentTurn('black')
      } else if (clickedPiece?.color === 'white') {
        // Select different piece
        const moves = getValidMoves(board, { row, col }, clickedPiece).filter(to =>
          isMoveLegal(board, { row, col }, to, 'white')
        )
        setSelectedPos({ row, col })
        setValidMoves(moves)
      } else {
        // Deselect
        setSelectedPos(null)
        setValidMoves([])
      }
    } else if (clickedPiece?.color === 'white') {
      // Select a piece
      const moves = getValidMoves(board, { row, col }, clickedPiece).filter(to =>
        isMoveLegal(board, { row, col }, to, 'white')
      )
      setSelectedPos({ row, col })
      setValidMoves(moves)
    }
  }

  const handleNewGame = () => {
    setBoard(createInitialBoard())
    setSelectedPos(null)
    setValidMoves([])
    setCurrentTurn('white')
    setMoveHistory([])
    setLastMove(null)
    setGameStatus('Your turn')
    setCapturedPieces({ white: [], black: [] })
    setIsThinking(false)
  }

  const isSquareLight = (row: number, col: number) => (row + col) % 2 === 0

  const isSelected = (row: number, col: number) =>
    selectedPos?.row === row && selectedPos?.col === col

  const isValidMoveSquare = (row: number, col: number) =>
    validMoves.some(m => m.row === row && m.col === col)

  const isLastMoveSquare = (row: number, col: number) =>
    lastMove && ((lastMove.from.row === row && lastMove.from.col === col) ||
                  (lastMove.to.row === row && lastMove.to.col === col))

  return (
    <div className="min-h-screen space-y-6">
      <Link
        href="/student/tools"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Tools
      </Link>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Chess</h1>
        <p className="mt-1 text-muted-foreground">Play against the computer</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Chess Board */}
        <div className="lg:col-span-2">
          <div className="ocean-card rounded-2xl p-6">
            {/* Game Status */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${
                  currentTurn === 'white' && !isThinking ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
                }`} />
                <span className="text-lg font-semibold text-foreground">{gameStatus}</span>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                  className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground"
                  disabled={moveHistory.length > 0}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>

                <button
                  onClick={handleNewGame}
                  className="flex items-center gap-2 rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  New Game
                </button>
              </div>
            </div>

            {/* Captured pieces - Black */}
            <div className="mb-3 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Captured:</span>
              <div className="flex flex-wrap gap-1">
                {capturedPieces.black.map((piece, i) => (
                  <span key={i} className="text-2xl opacity-60">
                    {PIECE_SYMBOLS[piece.color][piece.type]}
                  </span>
                ))}
              </div>
            </div>

            {/* Board */}
            <div className="mx-auto w-full max-w-2xl">
              <div className="grid grid-cols-8 gap-0 rounded-xl overflow-hidden shadow-2xl border-4 border-amber-900">
                {board.map((row, rowIndex) =>
                  row.map((piece, colIndex) => {
                    const light = isSquareLight(rowIndex, colIndex)
                    const selected = isSelected(rowIndex, colIndex)
                    const validMove = isValidMoveSquare(rowIndex, colIndex)
                    const lastMoveSquare = isLastMoveSquare(rowIndex, colIndex)

                    return (
                      <button
                        key={`${rowIndex}-${colIndex}`}
                        onClick={() => handleSquareClick(rowIndex, colIndex)}
                        className={`
                          relative aspect-square flex items-center justify-center text-5xl sm:text-6xl
                          transition-all duration-200
                          ${light ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-amber-800 dark:bg-amber-700'}
                          ${selected ? 'bg-blue-400/50 ring-4 ring-blue-500' : ''}
                          ${lastMoveSquare ? 'bg-yellow-300/30' : ''}
                          ${!isThinking && currentTurn === 'white' && piece?.color === 'white' ? 'hover:bg-blue-300/30 cursor-pointer' : ''}
                          ${validMove && !piece ? 'hover:bg-green-400/40' : ''}
                        `}
                        disabled={isThinking}
                      >
                        {piece && (
                          <span className={`${piece.color === 'white' ? 'drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]' : 'drop-shadow-[0_2px_2px_rgba(255,255,255,0.3)]'}`}>
                            {PIECE_SYMBOLS[piece.color][piece.type]}
                          </span>
                        )}

                        {validMove && (
                          <div className={`absolute inset-0 flex items-center justify-center ${piece ? 'ring-4 ring-green-500 ring-inset' : ''}`}>
                            {!piece && (
                              <div className="h-4 w-4 rounded-full bg-green-500/60" />
                            )}
                          </div>
                        )}

                        {/* Coordinate labels */}
                        {colIndex === 0 && (
                          <span className="absolute left-1 top-1 text-xs font-medium opacity-40">
                            {8 - rowIndex}
                          </span>
                        )}
                        {rowIndex === 7 && (
                          <span className="absolute bottom-1 right-1 text-xs font-medium opacity-40">
                            {String.fromCharCode(97 + colIndex)}
                          </span>
                        )}
                      </button>
                    )
                  })
                )}
              </div>
            </div>

            {/* Captured pieces - White */}
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Captured:</span>
              <div className="flex flex-wrap gap-1">
                {capturedPieces.white.map((piece, i) => (
                  <span key={i} className="text-2xl opacity-60">
                    {PIECE_SYMBOLS[piece.color][piece.type]}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Move History & Info */}
        <div className="space-y-6">
          {/* Game Info */}
          <div className="ocean-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Game Info</h2>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Difficulty:</span>
                <span className="font-medium text-foreground capitalize">{difficulty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Moves:</span>
                <span className="font-medium text-foreground">{Math.ceil(moveHistory.length / 2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Turn:</span>
                <span className="font-medium text-foreground capitalize">{currentTurn}</span>
              </div>
            </div>
          </div>

          {/* Move History */}
          <div className="ocean-card rounded-2xl p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Move History</h2>

            <div className="max-h-96 overflow-y-auto space-y-2">
              {moveHistory.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No moves yet. Make your first move!
                </p>
              ) : (
                <div className="space-y-1">
                  {Array.from({ length: Math.ceil(moveHistory.length / 2) }, (_, i) => {
                    const whiteMove = moveHistory[i * 2]
                    const blackMove = moveHistory[i * 2 + 1]

                    return (
                      <div key={i} className="flex items-center gap-3 text-sm py-1.5 px-2 rounded hover:bg-muted/50">
                        <span className="text-muted-foreground font-medium w-8">{i + 1}.</span>
                        <div className="flex-1 flex gap-4">
                          <span className="font-mono text-foreground w-16">
                            {whiteMove.notation}
                          </span>
                          {blackMove && (
                            <span className="font-mono text-foreground w-16">
                              {blackMove.notation}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="ocean-card rounded-2xl p-6">
            <h2 className="text-lg font-bold text-foreground mb-3">How to Play</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Click a piece to select it and see valid moves</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Green dots show where you can move</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Yellow highlight shows the last move</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Pawns auto-promote to Queen</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
