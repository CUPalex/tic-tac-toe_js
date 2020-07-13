const statusDisplay = document.querySelector('.game--status');
const gameTitle = document.querySelector('.game--title');

let gameActive = true;
let currentPlayer = "X";
let currentCell = -1;
let bigGameState = ["", "", "", "", "", "", "", "", ""];
let gameState = []
for (let i = 0; i < 9; i++){
    gameState.push(["", "", "", "", "", "", "", "", ""]);
}

const winningMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;

statusDisplay.innerHTML = currentPlayerTurn();

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellPlayed(clickedCell, clickedCellIndex, clickedBigCellIndex) {
    gameState[clickedBigCellIndex][clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = currentPlayerTurn();
}

function drawWinCell(winCell){
    winCell.innerHTML = currentPlayer;
    winCell.className = "game--win";
}

function checkGameWon() {
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        let a = bigGameState[winCondition[0]];
        let b = bigGameState[winCondition[1]];
        let c = bigGameState[winCondition[2]];
        if (a === '' || a === "D") {
            continue;
        }
        if (a === b && b === c) {
            return true;
        }
    }
    return false;
}

function checkCellWon(clickedBigCellIndex) {
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[clickedBigCellIndex][winCondition[0]];
        let b = gameState[clickedBigCellIndex][winCondition[1]];
        let c = gameState[clickedBigCellIndex][winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            return true;
        }
    }
    return false;
}

function handleResultValidation(clickedBigCell, clickedBigCellIndex, clickedCellIndex) {
    currentCell = clickedCellIndex;
    if (checkCellWon(clickedBigCellIndex)) {
        drawWinCell(clickedBigCell);
        bigGameState[clickedBigCellIndex] = currentPlayer;
        if (checkGameWon()) {
            gameActive = false;
            statusDisplay.innerHTML = winningMessage();
            return;
        }
    }

    let roundDraw = !gameState[clickedBigCellIndex].includes("");
    if (roundDraw) {
        bigGameState[clickedBigCellIndex] = "D";
    }

    if (bigGameState[currentCell] !== "") {
        currentCell = -1;
    }

    let bigRoundDraw = !bigGameState.includes("");
    if (bigRoundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        return;
    }

    handlePlayerChange();
}

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));
    const clickedBigCell = clickedCell.parentNode;
    const clickedBigCellIndex = parseInt(clickedBigCell.getAttribute('data-cell-index'));

    if (gameState[clickedBigCellIndex][clickedCellIndex] !== ""||
        !gameActive ||
        bigGameState[clickedBigCellIndex] !== "") {
        return;
    }
    if (currentCell !== -1 && clickedBigCellIndex !== currentCell){
        let cellPosition = "";
        if (currentCell == 0 || currentCell == 1 || currentCell == 2){
            cellPosition += "top ";
        }
        if (currentCell == 6 || currentCell == 7 || currentCell == 8){
            cellPosition += "bottom ";
        }
        if (currentCell == 0 || currentCell == 3 || currentCell == 6){
            cellPosition += "left ";
        }
        if (currentCell == 2 || currentCell == 5 || currentCell == 8){
            cellPosition += "right ";
        }
        if (currentCell == 4 || currentCell == 1 || currentCell == 3 || currentCell == 5 || currentCell == 7){
            cellPosition += "center ";
        }
        alert("You can play only in the " + cellPosition + "cell of the big field\nWish you luck :)");
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex, clickedBigCellIndex);
    handleResultValidation(clickedBigCell, clickedBigCellIndex, clickedCellIndex);
}

function deleteField() {
    document.querySelector('.big--game--container').remove();
}

function createField() {
    let bigContainer = document.createElement('div');
    bigContainer.className = "big--game--container";
    for (let j = 0; j < 9; j++) {
        let bigCell = document.createElement('div');
        bigCell.setAttribute('data-cell-index', j);
        bigCell.className = "game--container";
        for (let i = 0; i < 9; i++) {
            let smallCell = document.createElement('div');
            smallCell.setAttribute('data-cell-index', i);
            smallCell.className = 'cell';
            bigCell.append(smallCell);
        }
        bigContainer.append(bigCell);
    }
    gameTitle.after(bigContainer);
}

function handleRestartGame() {
    gameActive = true;
    currentPlayer = "X";
    currentCell = -1;
    bigGameState = ["", "", "", "", "", "", "", "", ""];
    gameState = []
    for (let i = 0; i < 9; i++){
        gameState.push(["", "", "", "", "", "", "", "", ""]);
    }
    statusDisplay.innerHTML = currentPlayerTurn();
    deleteField();
    createField();
    document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
}

createField();
document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
document.querySelector('.game--restart').addEventListener('click', handleRestartGame);