class ChessGame {
    constructor() {
        this.board = document.getElementById('board');
        this.turnIndicator = document.getElementById('turn-indicator');
        this.resetButton = document.getElementById('reset-btn');
        
        this.currentPlayer = 'white';
        this.selectedPiece = null;
        
        this.pieces = {
            'white-king': 'pieces/wK.svg', 
            'white-queen': 'pieces/wQ.svg', 
            'white-rook': 'pieces/wR.svg', 
            'white-bishop': 'pieces/wB.svg', 
            'white-knight': 'pieces/wN.svg', 
            'white-pawn': 'pieces/wP.svg',
            'black-king': 'pieces/bK.svg', 
            'black-queen': 'pieces/bQ.svg', 
            'black-rook': 'pieces/bR.svg', 
            'black-bishop': 'pieces/bB.svg', 
            'black-knight': 'pieces/bN.svg', 
            'black-pawn': 'pieces/bP.svg'
        };
        
        this.initialBoard = [
            ['black-rook', 'black-knight', 'black-bishop', 'black-queen', 'black-king', 'black-bishop', 'black-knight', 'black-rook'],
            ['black-pawn', 'black-pawn', 'black-pawn', 'black-pawn', 'black-pawn', 'black-pawn', 'black-pawn', 'black-pawn'],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            ['white-pawn', 'white-pawn', 'white-pawn', 'white-pawn', 'white-pawn', 'white-pawn', 'white-pawn', 'white-pawn'],
            ['white-rook', 'white-knight', 'white-bishop', 'white-queen', 'white-king', 'white-bishop', 'white-knight', 'white-rook']
        ];
        
        this.boardState = JSON.parse(JSON.stringify(this.initialBoard));
        
        this.resetButton.addEventListener('click', () => this.resetGame());
        
        this.initializeBoard();
    }
    
    isValidMove(fromRow, fromCol, toRow, toCol) {
        const piece = this.boardState[fromRow][fromCol];
        const targetPiece = this.boardState[toRow][toCol];
        
        // Prevent moving to a square with a piece of the same color
        if (targetPiece && targetPiece.split('-')[0] === piece.split('-')[0]) {
            return false;
        }
        
        const pieceName = piece.split('-')[1];
        const pieceColor = piece.split('-')[0];
        
        switch (pieceName) {
            case 'pawn':
                return this.isValidPawnMove(fromRow, fromCol, toRow, toCol, pieceColor);
            case 'rook':
                return this.isValidRookMove(fromRow, fromCol, toRow, toCol);
            case 'knight':
                return this.isValidKnightMove(fromRow, fromCol, toRow, toCol);
            case 'bishop':
                return this.isValidBishopMove(fromRow, fromCol, toRow, toCol);
            case 'queen':
                return this.isValidQueenMove(fromRow, fromCol, toRow, toCol);
            case 'king':
                return this.isValidKingMove(fromRow, fromCol, toRow, toCol);
            default:
                return false;
        }
    }
    
    isValidPawnMove(fromRow, fromCol, toRow, toCol, color) {
        const direction = color === 'white' ? -1 : 1;
        const startRow = color === 'white' ? 6 : 1;
        
        // Standard forward move
        if (fromCol === toCol && this.boardState[toRow][toCol] === null) {
            if (toRow === fromRow + direction) return true;
            
            // First move can go two squares
            if (fromRow === startRow && toRow === fromRow + (2 * direction) && 
                this.boardState[fromRow + direction][fromCol] === null) {
                return true;
            }
        }
        
        // Capture diagonally
        if (Math.abs(fromCol - toCol) === 1 && 
            toRow === fromRow + direction && 
            this.boardState[toRow][toCol] && 
            this.boardState[toRow][toCol].split('-')[0] !== color) {
            return true;
        }
        
        return false;
    }
    
    isValidRookMove(fromRow, fromCol, toRow, toCol) {
        // Must be in same row or same column
        if (fromRow !== toRow && fromCol !== toCol) return false;
        
        // Check for pieces blocking the path
        return this.isPathClear(fromRow, fromCol, toRow, toCol);
    }
    
    isValidKnightMove(fromRow, fromCol, toRow, toCol) {
        const rowDiff = Math.abs(fromRow - toRow);
        const colDiff = Math.abs(fromCol - toCol);
        return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
    }
    
    isValidBishopMove(fromRow, fromCol, toRow, toCol) {
        // Must move diagonally
        if (Math.abs(fromRow - toRow) !== Math.abs(fromCol - toCol)) return false;
        
        // Check for pieces blocking the path
        return this.isPathClear(fromRow, fromCol, toRow, toCol);
    }
    
    isValidQueenMove(fromRow, fromCol, toRow, toCol) {
        // Queen moves like a rook or bishop
        return this.isValidRookMove(fromRow, fromCol, toRow, toCol) || 
               this.isValidBishopMove(fromRow, fromCol, toRow, toCol);
    }
    
    isValidKingMove(fromRow, fromCol, toRow, toCol) {
        const rowDiff = Math.abs(fromRow - toRow);
        const colDiff = Math.abs(fromCol - toCol);
        return rowDiff <= 1 && colDiff <= 1;
    }
    
    isPathClear(fromRow, fromCol, toRow, toCol) {
        const rowStep = fromRow === toRow ? 0 : (toRow > fromRow ? 1 : -1);
        const colStep = fromCol === toCol ? 0 : (toCol > fromCol ? 1 : -1);
        
        let currentRow = fromRow + rowStep;
        let currentCol = fromCol + colStep;
        
        while (currentRow !== toRow || currentCol !== toCol) {
            if (this.boardState[currentRow][currentCol] !== null) return false;
            currentRow += rowStep;
            currentCol += colStep;
        }
        
        return true;
    }
    
    getValidMoves(row, col) {
        const validMoves = [];
        const piece = this.boardState[row][col];
        
        for (let toRow = 0; toRow < 8; toRow++) {
            for (let toCol = 0; toCol < 8; toCol++) {
                if (this.isValidMove(row, col, toRow, toCol)) {
                    validMoves.push({ row: toRow, col: toCol });
                }
            }
        }
        
        return validMoves;
    }
    
    initializeBoard() {
        this.board.innerHTML = '';
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.classList.add('square');
                square.classList.add((row + col) % 2 === 0 ? 'light' : 'dark');
                square.dataset.row = row;
                square.dataset.col = col;
                
                const piece = this.boardState[row][col];
                if (piece) {
                    const pieceElement = document.createElement('img');
                    pieceElement.src = this.pieces[piece];
                    pieceElement.dataset.piece = piece;
                    pieceElement.classList.add('piece');
                    square.appendChild(pieceElement);
                    
                    pieceElement.addEventListener('click', () => this.selectPiece(pieceElement, row, col));
                }
                
                square.addEventListener('click', () => this.movePiece(row, col));
                
                this.board.appendChild(square);
            }
        }
    }
    
    selectPiece(pieceElement, row, col) {
        // Clear previous highlights
        this.clearHighlights();
        
        const piece = this.boardState[row][col];
        if (piece && piece.startsWith(this.currentPlayer)) {
            this.selectedPiece = { element: pieceElement, row, col };
            pieceElement.parentElement.classList.add('selected');
            
            // Highlight valid moves
            const validMoves = this.getValidMoves(row, col);
            validMoves.forEach(move => {
                const targetSquare = document.querySelector(`.square[data-row="${move.row}"][data-col="${move.col}"]`);
                targetSquare.classList.add('valid-move');
            });
        }
    }
    
    movePiece(toRow, toCol) {
        if (!this.selectedPiece) return;
        
        const { row: fromRow, col: fromCol } = this.selectedPiece;
        const piece = this.boardState[fromRow][fromCol];
        
        // Check if the move is valid
        if (this.isValidMove(fromRow, fromCol, toRow, toCol)) {
            this.boardState[toRow][toCol] = piece;
            this.boardState[fromRow][fromCol] = null;
            
            this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
            this.turnIndicator.textContent = `${this.currentPlayer.charAt(0).toUpperCase() + this.currentPlayer.slice(1)}'s Turn`;
            
            this.initializeBoard();
            this.selectedPiece = null;
        }
        
        // Clear highlights
        this.clearHighlights();
    }
    
    clearHighlights() {
        const squares = document.querySelectorAll('.square');
        squares.forEach(square => {
            square.classList.remove('selected');
            square.classList.remove('valid-move');
        });
    }
    
    resetGame() {
        this.boardState = JSON.parse(JSON.stringify(this.initialBoard));
        this.currentPlayer = 'white';
        this.turnIndicator.textContent = "White's Turn";
        this.selectedPiece = null;
        this.initializeBoard();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ChessGame();
});
