const game = (function() {
    const gameBoard = (function() {
        const board = [['', '', ''], ['', '', ''], ['', '', '']];
    
        function addToBoard(row, column, symbol) {
            if (board[row][column] === '') {
                board[row][column] = symbol;
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
        };
    })();
    
    const player = function(symbol) {

        function pickCell() {
            let row = prompt('row');
            let column = prompt('colum');
    
            row = Number(row);
            column = Number(column);

            gameBoard.addToBoard(row, column, symbol);
            return [row, column];
        }
    
        return {
            symbol,
            pickCell,
        }
    }

    const bot = function(symbol) {

        function pickCell() {
            let cellPicked = false;
            while (!cellPicked) {
                let row = Math.floor(Math.random()*3);
                let column = Math.floor(Math.random()*3);

                if (gameBoard.addToBoard(row, column, symbol)) {
                    cellPicked = true;
                    console.log(`bot picked: (${row}, ${column})`);
                    return [row, column];
                }
            }
        }

        return {
            symbol,
            pickCell,
        }
    }

    function runGame() {
        const player1 = player('X');
        const player2 = bot('O');

        let winner = false;
        let curChoice;
        while (!winner) {
            curChoice = player1.pickCell();
            if (gameBoard.checkWin(...curChoice, player1.symbol)) {
                console.log('winner: p1');
                winner = true;
                continue;
            }
            curChoice = player2.pickCell();
            if (gameBoard.checkWin(...curChoice, player2.symbol)) {
                console.log('winner: p2');
                winner = true;
            }
        }
    }

    return {runGame};
})();

game.runGame();