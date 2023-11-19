const gameBoard = (function() {
    const board = [['', '', ''], ['', '', ''], ['', '', '']];
    const boardGrids = Array.from(document.querySelectorAll('.board-child'));

    function addToBoard(row, column, symbol) {
        if (board[row][column] === '') {
            board[row][column] = symbol;
            const boardGridItem = document.querySelector(`#r${row}-c${column}`);
            boardGridItem.innerText = symbol;
            // return validation if successful
            return true;
        }
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
        addToBoard,
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
                console.log("X wins");
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

    function playTurn(gameInstance) {
        let cellPicked = false;
        while (!cellPicked) {
            let row = Math.floor(Math.random()*3);
            let column = Math.floor(Math.random()*3);

            if (gameBoard.addToBoard(row, column, symbol)) {
                cellPicked = `r${row}-c${column}`;
                console.log(`bot picked: (${cellPicked})`);

                const boardGrid = document.querySelector(`#${cellPicked}`);
                boardGrid.classList.add('disabled');
            }
        }

        gameInstance.nextTurn();
    }

    return {
        playTurn,
    }
}

const game = (function() {
    let players;
    let turnCount;
    let currentPlayer;

    function startNewGame() {
        const player1 = player('X');
        const player2 = bot('O');
        this.players = [player1, player2];

        this.turnCount = 0;
        this.currentPlayer = 0;

        this.players[this.currentPlayer].playTurn(this);
    }

    function nextTurn() {
        this.turnCount++;
        this.currentPlayer = this.turnCount % 2;
        this.players[this.currentPlayer].playTurn(this);
    }

    return {
        players,
        turnCount,
        currentPlayer,
        startNewGame,
        nextTurn
    }
})();