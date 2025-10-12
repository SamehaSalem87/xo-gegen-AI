const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetBtn = document.getElementById('reset');

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X"; // Spieler beginnt
let gameOver = false;

const winCombos = [
    [0,1,2],[3,4,5],[6,7,8], // Reihen
    [0,3,6],[1,4,7],[2,5,8], // Spalten
    [0,4,8],[2,4,6]           // Diagonalen
];

// Spielfeld aktualisieren
function updateBoard() {
    cells.forEach((cell, index) => {
        cell.textContent = board[index];
    });
}

// Gewinner überprüfen
function checkWinner() {
    for (let combo of winCombos) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameOver = true;
            statusText.textContent = `${board[a]} hat gewonnen!`;
            highlightWinner(combo);
            return;
        }
    }
    if (!board.includes("")) {
        gameOver = true;
        statusText.textContent = "Unentschieden!";
    }
}

// Gewinner hervorheben
function highlightWinner(combo) {
    combo.forEach(index => {
        cells[index].style.backgroundColor = "#90ee90"; // grün
    });
}

// Spielerzug
cells.forEach(cell => {
    cell.addEventListener('click', () => {
        const index = cell.dataset.index;
        if (board[index] === "" && !gameOver && currentPlayer === "X") {
            board[index] = "X";
            currentPlayer = "O";
            updateBoard();
            checkWinner();
            if (!gameOver) {
                setTimeout(aiMove, 300); // AI spielt nach kurzer Pause
            }
        }
    });
});

// Minimax Algorithmus
function minimax(newBoard, player) {
    const availSpots = newBoard.map((v,i)=> v===""? i : null).filter(v => v!==null);

    // Gewinner prüfen
    if (checkWinnerMinimax(newBoard, "X")) return {score: -10};
    if (checkWinnerMinimax(newBoard, "O")) return {score: 10};
    if (availSpots.length === 0) return {score: 0};

    const moves = [];

    for (let i = 0; i < availSpots.length; i++) {
        const move = {};
        move.index = availSpots[i];
        newBoard[availSpots[i]] = player;

        if (player === "O") {
            const result = minimax(newBoard, "X");
            move.score = result.score;
        } else {
            const result = minimax(newBoard, "O");
            move.score = result.score;
        }

        newBoard[availSpots[i]] = "";
        moves.push(move);
    }

    let bestMove;
    if (player === "O") {
        let bestScore = -Infinity;
        for (let i=0; i<moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i=0; i<moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

// Hilfsfunktion zum Prüfen von Gewinner im Minimax
function checkWinnerMinimax(b, player) {
    return winCombos.some(combo => combo.every(i => b[i] === player));
}

// AI Zug mit Minimax
function aiMove() {
    let bestSpot = minimax(board, "O").index;
    board[bestSpot] = "O";
    currentPlayer = "X";
    updateBoard();
    checkWinner();
}

// Spiel zurücksetzen
resetBtn.addEventListener('click', () => {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameOver = false;
    statusText.textContent = "Dein Zug: X";
    cells.forEach(cell => cell.style.backgroundColor = "#fff");
    updateBoard();
});
