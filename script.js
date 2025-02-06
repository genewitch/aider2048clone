class Game2048 {
    constructor() {
        this.grid = [];
        this.score = 0;
        this.setupGrid();
        this.addEventListeners();
        this.initNewGame();
    }

    setupGrid() {
        const gridContainer = document.querySelector('.grid');
        for (let i = 0; i < 16; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            gridContainer.appendChild(cell);
        }
    }

    initNewGame() {
        this.grid = Array(4).fill().map(() => Array(4).fill(0));
        this.score = 0;
        this.addNewNumber();
        this.addNewNumber();
        this.updateDisplay();
    }

    addNewNumber() {
        const emptyCells = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] === 0) {
                    emptyCells.push({x: i, y: j});
                }
            }
        }
        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.grid[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    move(direction) {
        let moved = false;
        const tempGrid = JSON.parse(JSON.stringify(this.grid));

        switch(direction) {
            case 'ArrowLeft':
                moved = this.moveLeft();
                break;
            case 'ArrowRight':
                moved = this.moveRight();
                break;
            case 'ArrowUp':
                moved = this.moveUp();
                break;
            case 'ArrowDown':
                moved = this.moveDown();
                break;
        }

        if (moved) {
            this.addNewNumber();
            this.updateDisplay();
            if (this.isGameOver()) {
                alert('Game Over!');
            }
        }
    }

    moveLeft() {
        let moved = false;
        for (let i = 0; i < 4; i++) {
            let row = this.grid[i].filter(cell => cell !== 0);
            for (let j = 0; j < row.length - 1; j++) {
                if (row[j] === row[j + 1]) {
                    row[j] *= 2;
                    this.score += row[j];
                    row.splice(j + 1, 1);
                    moved = true;
                }
            }
            const newRow = row.concat(Array(4 - row.length).fill(0));
            if (JSON.stringify(this.grid[i]) !== JSON.stringify(newRow)) {
                moved = true;
            }
            this.grid[i] = newRow;
        }
        return moved;
    }

    moveRight() {
        let moved = false;
        for (let i = 0; i < 4; i++) {
            let row = this.grid[i].filter(cell => cell !== 0);
            for (let j = row.length - 1; j > 0; j--) {
                if (row[j] === row[j - 1]) {
                    row[j] *= 2;
                    this.score += row[j];
                    row.splice(j - 1, 1);
                    moved = true;
                }
            }
            const newRow = Array(4 - row.length).fill(0).concat(row);
            if (JSON.stringify(this.grid[i]) !== JSON.stringify(newRow)) {
                moved = true;
            }
            this.grid[i] = newRow;
        }
        return moved;
    }

    moveUp() {
        let moved = false;
        for (let j = 0; j < 4; j++) {
            let column = [this.grid[0][j], this.grid[1][j], this.grid[2][j], this.grid[3][j]];
            let newColumn = this.mergeColumn(column);
            if (JSON.stringify(column) !== JSON.stringify(newColumn)) {
                moved = true;
            }
            for (let i = 0; i < 4; i++) {
                this.grid[i][j] = newColumn[i];
            }
        }
        return moved;
    }

    moveDown() {
        let moved = false;
        for (let j = 0; j < 4; j++) {
            let column = [this.grid[0][j], this.grid[1][j], this.grid[2][j], this.grid[3][j]];
            let newColumn = this.mergeColumn(column.reverse()).reverse();
            if (JSON.stringify(column.reverse()) !== JSON.stringify(newColumn)) {
                moved = true;
            }
            for (let i = 0; i < 4; i++) {
                this.grid[i][j] = newColumn[i];
            }
        }
        return moved;
    }

    mergeColumn(column) {
        let arr = column.filter(cell => cell !== 0);
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] === arr[i + 1]) {
                arr[i] *= 2;
                this.score += arr[i];
                arr.splice(i + 1, 1);
            }
        }
        return arr.concat(Array(4 - arr.length).fill(0));
    }

    isGameOver() {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] === 0) return false;
                if (i < 3 && this.grid[i][j] === this.grid[i + 1][j]) return false;
                if (j < 3 && this.grid[i][j] === this.grid[i][j + 1]) return false;
            }
        }
        return true;
    }

    updateDisplay() {
        const cells = document.querySelectorAll('.cell');
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const value = this.grid[i][j];
                const cell = cells[i * 4 + j];
                cell.textContent = value || '';
                cell.setAttribute('data-value', value);
            }
        }
        document.querySelector('.score').textContent = `Score: ${this.score}`;
    }

    addEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
                this.move(e.key);
            }
        });

        document.querySelector('.new-game').addEventListener('click', () => {
            this.initNewGame();
        });
    }
}

// Start the game
new Game2048();
