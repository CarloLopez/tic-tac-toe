const gameBoard = (function() {
    let board = [['', '', ''], ['', '', ''], ['', '', '']];
    let cellCounter = 0;

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
        checkWin: function(row, column, symbol) {
            if (_checkVertical(column, symbol)) return true;
            if (_checkHorizontal(row, symbol)) return true;

            // cells which can win diagonally either add up to 2, or its row no. == column no.
            if (column === row || column + row === 2) {
           if (_checkDiagonal(row, column, symbol)) return true;
        }
        return false;
        },
        checkTie: function() {
            return cellCounter === 9;
        },
        addToBoard: function(row, column, symbol) { 
            if (board[row][column] === '') {
                board[row][column] = symbol;
                const boardGridItem = document.querySelector(`#r${row}-c${column}`);
                boardGridItem.innerText = symbol;
                cellCounter++;
                // return validation if successful
                return true;
            }
        },
        resetBoard: function() {
            board = [['', '', ''], ['', '', ''], ['', '', '']];
            cellCounter = 0;
            this.boardGrids.forEach(cell => {
                cell.innerText = '';
                cell.classList.remove('disabled');
            });
        },
        boardGrids: Array.from(document.querySelectorAll('.board-child'))
    };
})();

const player = function(symbol) {
    const listeners = [];

    function _removeListeners() {
        listeners.forEach(({element, listener}) => {
            element.removeEventListener('click', listener);
        });
    }

    function _createClickListener() {
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
                game.nextTurn();
            }
        };
    }

    return {
        playTurn: function() {
            gameBoard.boardGrids.forEach((element) => {
                if (!Array.from(element.classList).includes('disabled')) {
                    const listener = _createClickListener()
                    element.addEventListener('click', listener);
                    listeners.push({element, listener});
                }
            });
            sectionHeader.innerText = `${symbol}'s Turn`
        }
    };
}

const bot = function(symbol) {
    let row;
    let column;
    return {
        playTurn: function() {
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
                    game.nextTurn();
                }
            }, 1000)
        }
    };
}

const game = (function() {
    let players;
    let turnCount;
    let currentPlayer;

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

    return {
        gameType: undefined,
        startNewGame: function(gameType) {
            gameBoard.resetBoard();
            const boardElement = document.querySelector('.board');
            boardElement.style.visibility = 'visible';
            sectionHeader.innerText = 'X'

            players = [..._setGameMode(this.gameType)]
            turnCount = 0;
            currentPlayer = 0;

            players[currentPlayer].playTurn();
        },
        nextTurn: function() {
            turnCount++;
            currentPlayer = turnCount % 2;
            players[currentPlayer].playTurn();
        }
    };
})();

const sectionHeader = document.querySelector('.header');
const resetButton = document.querySelector('.reset');
resetButton.addEventListener('click', () => {
    game.startNewGame(game.gameType);
    resetButton.style.visibility = 'hidden';
});

const twoPlayer = document.querySelector('.player-game');
const botGame = document.querySelector('.bot-game');
const startButtonHeader = document.querySelector('.start-button-header');
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
    startButtonHeader.style.visibility = 'hidden';
}