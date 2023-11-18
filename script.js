const gameBoard = (function () {
    const board = [['', '', ''], ['', '', ''], ['', '', '']];

    function addToBoard(row, column, symbol) {
        if (board[row][column] === '') {
            board[row][column] = symbol;
        }
    }

    function checkWin(row, column, symbol) {
        column = Number(column);
        row = Number(row);
        
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

const Player = function() {

}