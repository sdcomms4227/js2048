class Game2048 {
  constructor() {
    // 4x4 게임 보드 초기화
    this.grid = Array(4).fill().map(() => Array(4).fill(0));
    this.score = 0;
    // localStorage에서 최고 점수 불러오기
    this.bestScore = localStorage.getItem('bestScore') || 0;
    this.gameOver = false;
    // DOM 요소 참조
    this.gridContainer = document.getElementById('grid-container');
    this.scoreElement = document.getElementById('score');
    this.bestScoreElement = document.getElementById('best-score');
    this.newGameButton = document.getElementById('new-game');

    this.init();
  }

  // 게임 초기화
  init() {
    this.createGrid();
    this.addRandomTile();
    this.addRandomTile();
    this.updateScore();
    this.setupEventListeners();
  }

  // 4x4 그리드 생성
  createGrid() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        this.gridContainer.appendChild(cell);
      }
    }
  }

  // 빈 칸에 랜덤한 타일 추가 (90% 확률로 2, 10% 확률로 4)
  addRandomTile() {
    const emptyCells = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.grid[i][j] === 0) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      this.grid[row][col] = Math.random() < 0.9 ? 2 : 4;
      this.updateGrid();
    }
  }

  // 그리드 UI 업데이트
  updateGrid() {
    const cells = this.gridContainer.querySelectorAll('.grid-cell');
    cells.forEach((cell, index) => {
      const row = Math.floor(index / 4);
      const col = index % 4;
      const value = this.grid[row][col];

      // 기존 타일 제거
      const existingTile = cell.querySelector('.tile');
      if (existingTile) {
        cell.removeChild(existingTile);
      }

      if (value !== 0) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.textContent = value;
        tile.setAttribute('data-value', value);
        cell.appendChild(tile);
      }
    });
  }

  // 점수 업데이트
  updateScore() {
    this.scoreElement.textContent = this.score;
    this.bestScoreElement.textContent = this.bestScore;
  }

  // 이벤트 리스너 설정
  setupEventListeners() {
    document.addEventListener('keydown', this.handleKeyPress.bind(this));
    this.newGameButton.addEventListener('click', () => this.resetGame());
  }

  // 키보드 입력 처리
  handleKeyPress(event) {
    if (this.gameOver) return;

    let moved = false;
    switch (event.key) {
      case 'ArrowUp':
        moved = this.moveUp();
        break;
      case 'ArrowDown':
        moved = this.moveDown();
        break;
      case 'ArrowLeft':
        moved = this.moveLeft();
        break;
      case 'ArrowRight':
        moved = this.moveRight();
        break;
      default:
        return;
    }

    if (moved) {
      this.addRandomTile();
      this.updateGrid();
      this.updateScore();
      this.checkGameOver();
    }
  }

  // 위로 이동
  moveUp() {
    let moved = false;
    for (let col = 0; col < 4; col++) {
      for (let row = 1; row < 4; row++) {
        if (this.grid[row][col] !== 0) {
          let currentRow = row;
          while (currentRow > 0) {
            if (this.grid[currentRow - 1][col] === 0) {
              this.grid[currentRow - 1][col] = this.grid[currentRow][col];
              this.grid[currentRow][col] = 0;
              currentRow--;
              moved = true;
            } else if (this.grid[currentRow - 1][col] === this.grid[currentRow][col]) {
              this.grid[currentRow - 1][col] *= 2;
              this.score += this.grid[currentRow - 1][col];
              this.grid[currentRow][col] = 0;
              moved = true;
              break;
            } else {
              break;
            }
          }
        }
      }
    }
    return moved;
  }

  // 아래로 이동
  moveDown() {
    let moved = false;
    for (let col = 0; col < 4; col++) {
      for (let row = 2; row >= 0; row--) {
        if (this.grid[row][col] !== 0) {
          let currentRow = row;
          while (currentRow < 3) {
            if (this.grid[currentRow + 1][col] === 0) {
              this.grid[currentRow + 1][col] = this.grid[currentRow][col];
              this.grid[currentRow][col] = 0;
              currentRow++;
              moved = true;
            } else if (this.grid[currentRow + 1][col] === this.grid[currentRow][col]) {
              this.grid[currentRow + 1][col] *= 2;
              this.score += this.grid[currentRow + 1][col];
              this.grid[currentRow][col] = 0;
              moved = true;
              break;
            } else {
              break;
            }
          }
        }
      }
    }
    return moved;
  }

  // 왼쪽으로 이동
  moveLeft() {
    let moved = false;
    for (let row = 0; row < 4; row++) {
      for (let col = 1; col < 4; col++) {
        if (this.grid[row][col] !== 0) {
          let currentCol = col;
          while (currentCol > 0) {
            if (this.grid[row][currentCol - 1] === 0) {
              this.grid[row][currentCol - 1] = this.grid[row][currentCol];
              this.grid[row][currentCol] = 0;
              currentCol--;
              moved = true;
            } else if (this.grid[row][currentCol - 1] === this.grid[row][currentCol]) {
              this.grid[row][currentCol - 1] *= 2;
              this.score += this.grid[row][currentCol - 1];
              this.grid[row][currentCol] = 0;
              moved = true;
              break;
            } else {
              break;
            }
          }
        }
      }
    }
    return moved;
  }

  // 오른쪽으로 이동
  moveRight() {
    let moved = false;
    for (let row = 0; row < 4; row++) {
      for (let col = 2; col >= 0; col--) {
        if (this.grid[row][col] !== 0) {
          let currentCol = col;
          while (currentCol < 3) {
            if (this.grid[row][currentCol + 1] === 0) {
              this.grid[row][currentCol + 1] = this.grid[row][currentCol];
              this.grid[row][currentCol] = 0;
              currentCol++;
              moved = true;
            } else if (this.grid[row][currentCol + 1] === this.grid[row][currentCol]) {
              this.grid[row][currentCol + 1] *= 2;
              this.score += this.grid[row][currentCol + 1];
              this.grid[row][currentCol] = 0;
              moved = true;
              break;
            } else {
              break;
            }
          }
        }
      }
    }
    return moved;
  }

  // 게임 오버 체크
  checkGameOver() {
    // 빈 칸이 있는지 확인
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.grid[i][j] === 0) return;
      }
    }

    // 합칠 수 있는 타일이 있는지 확인
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const current = this.grid[i][j];
        if (
          (i < 3 && current === this.grid[i + 1][j]) ||
          (j < 3 && current === this.grid[i][j + 1])
        ) {
          return;
        }
      }
    }

    this.gameOver = true;
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      localStorage.setItem('bestScore', this.bestScore);
      this.updateScore();
    }
    alert('Game Over! Your score: ' + this.score);
  }

  // 게임 리셋
  resetGame() {
    this.grid = Array(4).fill().map(() => Array(4).fill(0));
    this.score = 0;
    this.gameOver = false;
    this.updateScore();
    this.updateGrid();
    this.addRandomTile();
    this.addRandomTile();
  }
}

// 게임 초기화
const game = new Game2048(); 