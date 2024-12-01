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
        // Basic piece selection logic (simplified)
        if (this.selectedPiece) {
            this.selectedPiece = null;
            this.clearHighlights();
            return;
        }
        
        const piece = this.boardState[row][col];
        if (piece && piece.startsWith(this.currentPlayer)) {
            this.selectedPiece = { element: pieceElement, row, col };
            pieceElement.parentElement.classList.add('highlight');
        }
    }
    
    movePiece(toRow, toCol) {
        if (!this.selectedPiece) return;
        
        const { row: fromRow, col: fromCol } = this.selectedPiece;
        const piece = this.boardState[fromRow][fromCol];
        
        // Very basic move (just allows moving to any empty square)
        if (this.boardState[toRow][toCol] === null) {
            this.boardState[toRow][toCol] = piece;
            this.boardState[fromRow][fromCol] = null;
            
            this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
            this.turnIndicator.textContent = `${this.currentPlayer.charAt(0).toUpperCase() + this.currentPlayer.slice(1)}'s Turn`;
            
            this.initializeBoard();
            this.selectedPiece = null;
        }
    }
    
    clearHighlights() {
        const squares = document.querySelectorAll('.square');
        squares.forEach(square => square.classList.remove('highlight'));
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
