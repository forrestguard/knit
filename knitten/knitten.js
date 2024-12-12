document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const colors = ['yellow', 'blue', 'red'];
    let grid = Array(3).fill().map(() => Array(3).fill(null));
    let currentPlayer = 1;
    let bag = Array(6).fill('yellow').concat(Array(6).fill('blue')).concat(Array(6).fill('red'));
    let drawnYarn = null;
    let cards = [
        'Card_Yellow_C', 'Card_Yellow_Dia', 'Card_Yellow_I', 'Card_Yellow_J', 'Card_Yellow_L', 'Card_Yellow_O', 'Card_Yellow_T', 'Card_Yellow_S', 'Card_Yellow_Z',
        'Card_Blue_C', 'Card_Blue_Dia', 'Card_Blue_I', 'Card_Blue_J', 'Card_Blue_L', 'Card_Blue_O', 'Card_Blue_T', 'Card_Blue_S', 'Card_Blue_Z',
        'Card_Red_C', 'Card_Red_Dia', 'Card_Red_I', 'Card_Red_J', 'Card_Red_L', 'Card_Red_O', 'Card_Red_T', 'Card_Red_S', 'Card_Red_Z'
    ];
    let playerHands = [[], []];

    function createBoard() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = i;
                cell.dataset.col = j;
                board.appendChild(cell);
            }
        }
    }

    function placeYarn(row, col, color) {
        const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
        const yarn = document.createElement('div');
        yarn.classList.add('yarn', color);
        cell.appendChild(yarn);
        grid[row][col] = color;
    }

    function pushYarns(row, col, color, direction) {
        if (direction === 'up') {
            let temp = grid[0][col];
            for (let i = 0; i < 2; i++) {
                grid[i][col] = grid[i + 1][col];
                updateCell(i, col);
            }
            grid[2][col] = color;
            updateCell(2, col);
        } else if (direction === 'down') {
            let temp = grid[2][col];
            for (let i = 2; i > 0; i--) {
                grid[i][col] = grid[i - 1][col];
                updateCell(i, col);
            }
            grid[0][col] = color;
            updateCell(0, col);
        } else if (direction === 'left') {
            let temp = grid[row][0];
            for (let j = 0; j < 2; j++) {
                grid[row][j] = grid[row][j + 1];
                updateCell(row, j);
            }
            grid[row][2] = color;
            updateCell(row, 2);
        } else if (direction === 'right') {
            let temp = grid[row][2];
            for (let j = 2; j > 0; j--) {
                grid[row][j] = grid[row][j - 1];
                updateCell(row, j);
            }
            grid[row][0] = color;
            updateCell(row, 0);
        }
    }

    function updateCell(row, col) {
        const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
        cell.innerHTML = '';
        if (grid[row][col] !== null) {
            const yarn = document.createElement('div');
            yarn.classList.add('yarn', grid[row][col]);
            cell.appendChild(yarn);
        }
    }

    function drawYarn() {
        if (bag.length === 0) {
            alert('Oyun bitti! Kesedeki tüm yumaklar bitti.');
            return null;
        }
        const randomIndex = Math.floor(Math.random() * bag.length);
        const color = bag.splice(randomIndex, 1)[0];
        drawnYarn = color;
        displayDrawnYarn(color);
        return color;
    }

    function displayDrawnYarn(color) {
        const container = document.getElementById('drawn-yarn-container');
        container.innerHTML = '';
        const yarn = document.createElement('div');
        yarn.classList.add('yarn', color);
        container.appendChild(yarn);
    }

    function drawCard() {
        if (cards.length === 0) {
            alert('Tüm kartlar çekildi.');
            return null;
        }
        const randomIndex = Math.floor(Math.random() * cards.length);
        const card = cards.splice(randomIndex, 1)[0];
        playerHands[currentPlayer - 1].push(card);
        displayPlayerHand(currentPlayer);
        return card;
    }

    function displayPlayerHand(player) {
        const handContainer = document.getElementById(`player${player}-hand`);
        handContainer.innerHTML = '';
        playerHands[player - 1].forEach(card => {
            const cardImg = document.createElement('img');
            cardImg.src = `Card_Yellow_C.png`;
            cardImg.classList.add('Card');
            handContainer.appendChild(cardImg);
        });
    }

    function handleTurn(event) {
        if (!drawnYarn) {
            alert('Önce bir yumak çekmelisiniz!');
            return;
        }
        const direction = event.target.dataset.direction;
        let row, col;
        if (direction === 'up' || direction === 'down') {
            col = parseInt(event.target.dataset.col);
            row = direction === 'up' ? 2 : 0;
        } else if (direction === 'left' || direction === 'right') {
            row = parseInt(event.target.dataset.row);
            col = direction === 'left' ? 2 : 0;
        }
        pushYarns(row, col, drawnYarn, direction);
        drawnYarn = null;
        document.getElementById('drawn-yarn-container').innerHTML = '';
        currentPlayer = currentPlayer === 1 ? 2 : 1;
    }

    function initializeBoard() {
        const initialColors = ['yellow', 'yellow', 'yellow', 'blue', 'blue', 'blue', 'red', 'red', 'red'];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const randomIndex = Math.floor(Math.random() * initialColors.length);
                const color = initialColors.splice(randomIndex, 1)[0];
                placeYarn(i, j, color);
            }
        }
    }

    function initializeHands() {
        for (let i = 0; i < 2; i++) {
            drawCard();
            drawCard();
        }
    }

    createBoard();
    initializeBoard();
    initializeHands();
    document.querySelectorAll('.control-btn').forEach(button => {
        button.addEventListener('click', handleTurn);
    });
    document.getElementById('draw-card-btn').addEventListener('click', drawCard);
    document.getElementById('draw-yarn-btn').addEventListener('click', drawYarn);
});

function findLShapes() {
    const size = 3; // Matris boyutu
    const foundShapes = []; // Bulunan şekiller

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const color = grid[i][j];

            // L şekilleri:
            // 1. Üst üste 3 ve sağ altta 1
            if (i + 2 < size && j + 1 < size &&
                grid[i + 1][j] === color && grid[i + 2][j] === color &&
                grid[i + 2][j + 1] === color) {
                foundShapes.push([[i, j], [i + 1, j], [i + 2, j], [i + 2, j + 1]]);
            }

            // 2. Yan yana 3 ve alt sağda 1
            if (j + 2 < size && i + 1 < size &&
                grid[i][j + 1] === color && grid[i][j + 2] === color &&
                grid[i + 1][j + 2] === color) {
                foundShapes.push([[i, j], [i, j + 1], [i, j + 2], [i + 1, j + 2]]);
            }

            // 3. Yan yana 3 ve alt solda 1
            if (j + 2 < size && i + 1 < size &&
                grid[i][j + 1] === color && grid[i][j + 2] === color &&
                grid[i + 1][j] === color) {
                foundShapes.push([[i, j], [i, j + 1], [i, j + 2], [i + 1, j]]);
            }

            // 4. Üst üste 3 ve sol üstte 1
            if (i + 2 < size && j - 1 >= 0 &&
                grid[i + 1][j] === color && grid[i + 2][j] === color &&
                grid[i][j - 1] === color) {
                foundShapes.push([[i, j], [i + 1, j], [i + 2, j], [i, j - 1]]);
            }
        }
    }

    if (foundShapes.length > 0) {
        console.log("Bulunan L şekilleri:", foundShapes);
    } else {
        console.log("Hiçbir L şekli bulunamadı.");
    }
}

function findJShapes() {
    const size = 3; // Matris boyutu
    const foundShapes = []; // Bulunan şekiller

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const color = grid[i][j];

            // J şekilleri:
            // 1. Üst üste 3 ve sol altta 1
            if (i + 2 < size && j - 1 >= 0 &&
                grid[i + 1][j] === color && grid[i + 2][j] === color &&
                grid[i + 2][j - 1] === color) {
                foundShapes.push([[i, j], [i + 1, j], [i + 2, j], [i + 2, j - 1]]);
            }

            // 2. Yan yana 3 ve alt solda 1
            if (j + 2 < size && i + 1 < size &&
                grid[i][j + 1] === color && grid[i][j + 2] === color &&
                grid[i + 1][j] === color) {
                foundShapes.push([[i, j], [i, j + 1], [i, j + 2], [i + 1, j]]);
            }

            // 3. Yan yana 3 ve sağ üstte 1
            if (j + 2 < size && i - 1 >= 0 &&
                grid[i][j + 1] === color && grid[i][j + 2] === color &&
                grid[i - 1][j + 2] === color) {
                foundShapes.push([[i, j], [i, j + 1], [i, j + 2], [i - 1, j + 2]]);
            }

            // 4. Üst üste 3 ve sağ üstte 1
            if (i + 2 < size && j + 1 < size &&
                grid[i + 1][j] === color && grid[i + 2][j] === color &&
                grid[i][j + 1] === color) {
                foundShapes.push([[i, j], [i + 1, j], [i + 2, j], [i, j + 1]]);
            }
        }
    }

    if (foundShapes.length > 0) {
        console.log("Bulunan J şekilleri:", foundShapes);
    } else {
        console.log("Hiçbir J şekli bulunamadı.");
    }
}
