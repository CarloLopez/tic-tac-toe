const gameBoard = (function () {
    let board = [['', '', ''], ['', '', ''], ['', '', '']];

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

    function _checkDiagonal(c, r, s) {
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
        checkWin: function(column, row, symbol) {
            let column = Number(column);
            let row = Number(row);
            
            if (_checkVertical(column, symbol)) return true;
            if (_checkHorizontal(row, symbol)) return true;

            // cells which can win diagonally either add up to 2, or its row no. == column no.
            if (column === row || column + row === 2) {
               if (_checkDiagonal(column, row, symbol)) return true;
            }

            return false;
        },
    };
})();

