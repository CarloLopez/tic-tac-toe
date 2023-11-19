const gameBoard = (function() {
    let board = [['', '', ''], ['', '', ''], ['', '', '']];
    const boardGrids = Array.from(document.querySelectorAll('.board-child'));
    let cellCounter = 0;

    function resetBoard() {
        board = [['', '', ''], ['', '', ''], ['', '', '']];
        cellCounter = 0;
        gameBoard.boardGrids.forEach(cell => {
            cell.innerText = '';
            cell.classList.remove('disabled');
        });
    }

    function addToBoard(row, column, symbol) {
        if (board[row][column] === '') {
            board[row][column] = symbol;
            const boardGridItem = document.querySelector(`#r${row}-c${column}`);
            boardGridItem.innerText = symbol;
            cellCounter++;
            // return validation if successful
            return true;
        }
    }

    function checkTie() {
        return cellCounter === 9;
    }

    function checkWin(row, column, symbol) {
        if (_checkVertical(column, symbol)) return true;
        if (_checkHorizontal(row, symbol)) return true;

        // cells which can win diagonally either add up to 2, or its row no. == column no.
        if (column === row || column + row === 2) {
           if (_checkDiagonal(row, column, symbol)) return true;
        }

        return false;
    }

    function _checkVertical(c, s) {
        for (let i = 0; i < 3; i++) {
            if (board[i][c] !== s) return false;
        }
        return true;
    }

    function _checkHorizontal(r, s) {
        for (let i = 0; i < 3; i++) {
            if (board[r][i] !== s) return false;
        }
        return true;
    }

    function _checkDiagonal(r, c, s) {
        // all diagonal wins contain cell [1][1]
        if (board[1][1] !== s) return false;

        if (c === r) {
            if (board[0][0] !== s || board[2][2] !== s) return false;
        } else {
            if (board[2][0] !==s || board[0][2] !== s) return false;
        }

        return true;
    }
    
    return {
        checkWin,
        checkTie,
        addToBoard,
        resetBoard,
        boardGrids,
    };
})();

const player = function(symbol) {
    const listeners = [];

    function playTurn(gameInstance) {
        gameBoard.boardGrids.forEach((element) => {
            if (!Array.from(element.classList).includes('disabled')) {
                const listener = _createClickListener(gameInstance)
                element.addEventListener('click', listener);
                listeners.push({element, listener});
            }
        });
        sectionHeader.innerText = `${symbol}'s Turn`
    }

    function _removeListeners() {
        listeners.forEach(({element, listener}) => {
            element.removeEventListener('click', listener);
        });
    }

    function _createClickListener(gameInstance) {
        return function(event) {
            let cellID = event.target.id;
            let cellRow = Number(cellID[1]);
            let cellColumn = Number(cellID[4]);

            gameBoard.addToBoard(cellRow, cellColumn, symbol);
            event.target.classList.add('disabled');

            _removeListeners();

            if (gameBoard.checkWin(cellRow, cellColumn, symbol)) {
                sectionHeader.innerText = `${symbol} WINS`;
                resetButton.style.visibility = 'visible';
            } else if (gameBoard.checkTie()) {
                sectionHeader.innerText = `DRAW`;
                resetButton.style.visibility = 'visible';
            } else {
                gameInstance.nextTurn();
            }
        };
    }

    return {
        playTurn
    }
}

const bot = function(symbol) {
    let row;
    let column;

    function playTurn(gameInstance) {
        sectionHeader.innerText = `${symbol}'s Turn`;
        setTimeout(() => {
            let cellPicked = false;
            while (!cellPicked) {
                row = Math.floor(Math.random()*3);
                column = Math.floor(Math.random()*3);

                if (gameBoard.addToBoard(row, column, symbol)) {
                    cellPicked = `r${row}-c${column}`;
                    console.log(`bot picked: (${cellPicked})`);

                    const boardGrid = document.querySelector(`#${cellPicked}`);
                    boardGrid.classList.add('disabled');
                }
            }

            if (gameBoard.checkWin(row, column, symbol)) {
                sectionHeader.innerText = `${symbol} WINS`;
                resetButton.style.visibility = 'visible';
            } else if (gameBoard.checkTie()) {
                sectionHeader.innerText = `DRAW`;
                resetButton.style.visibility = 'visible';
            } else {
                gameInstance.nextTurn();
            }
        }, 1000)
    }

    return {
        playTurn
    }
}

const game = (function() {
    let players;
    let turnCount;
    let currentPlayer;
    let gameType = 'bot';

    function startNewGame(gameType) {

        gameBoard.resetBoard();
        const boardElement = document.querySelector('.board');
        boardElement.style.visibility = 'visible';
        sectionHeader.innerText = 'X'

        this.players = [..._setGameMode(gameType)]
        this.turnCount = 0;
        this.currentPlayer = 0;

        this.players[this.currentPlayer].playTurn(this);
    }

    function _setGameMode(gameType) {
        let player1;
        let player2; 

        if (gameType === 'player') {
            player1 = player('X');
            player2 = player('O');
        } else {
            player1 = player('X');
            player2 = bot('O');
        }
        
        return [player1, player2];
    }

    function nextTurn() {
        this.turnCount++;
        this.currentPlayer = this.turnCount % 2;
        this.players[this.currentPlayer].playTurn(this);
    }

    return {
        gameType,
        startNewGame,
        nextTurn
    }
})();

const sectionHeader = document.querySelector('.header');
const resetButton = document.querySelector('.reset');
resetButton.addEventListener('click', () => {
    game.startNewGame(game.gameType);
    resetButton.style.visibility = 'hidden';
});

const twoPlayer = document.querySelector('.player-game');
const botGame = document.querySelector('.bot-game');
twoPlayer.addEventListener('click', () => {
    game.gameType = 'player';
    game.startNewGame(game.gameType);
    displayButtons();
});
botGame.addEventListener('click', () => {
    game.gameType = 'bot';
    game.startNewGame(game.gameType);
    displayButtons();
});

function displayButtons() {
    twoPlayer.style.visibility = 'hidden';
    botGame.style.visibility = 'hidden';
}