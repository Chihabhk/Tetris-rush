import "./style.css";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const h1 = document.querySelector("h1");
// h1.innerText("hola");

const BLOCK_SIZE = 20;
const BOARD_WIDTH = 14;
const BOARD_HEIGHT = 30;

//1.Inicializar el canvas
canvas.width = BLOCK_SIZE * BOARD_WIDTH;
canvas.height = BLOCK_SIZE * BOARD_HEIGHT;

context.scale(BLOCK_SIZE, BLOCK_SIZE);

//2.game loop
function update() {
    drawBoard();
    removeRow();
    window.requestAnimationFrame(update);
}

//3.Board
const board = [];
for (let i = 0; i < BOARD_HEIGHT; i++) {
    board.push(new Array(BOARD_WIDTH).fill(0));
}

const PIECES = [
    [
        [0, 1],
        [1, 1],
        [1, 0],
    ],
    [
        [1, 0],
        [1, 0],
        [1, 1],
    ],
    [
        [1, 1],
        [1, 1],
    ],
    [[1, 1, 1, 1]],
    [
        [0, 1, 0],
        [1, 1, 1],
    ],
];
//4.pieza Player
const piece = {
    position: { x: Math.floor(Math.random() * 10 + 1), y: 0 },
    shape: PIECES[Math.floor(Math.random() * PIECES.length)],
};

function randomPiece() {
    piece.position.x = Math.floor(Math.random() * 10 + 1);
    piece.position.y = 0;
    piece.shape = PIECES[Math.floor(Math.random() * PIECES.length)];
}

drawBoard();

function drawBoard() {
    context.fillStyle = "black";
    context.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
    board.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value > 0) {
                context.fillStyle = "yellow";
                context.fillRect(x, y, 1, 1);
            }
        });
    });
    piece.shape.forEach((row, y) =>
        row.forEach((value, x) => {
            if (value > 0) {
                context.fillStyle = "red";
                context.fillRect(
                    piece.position.x + x,
                    piece.position.y + y,
                    1,
                    1
                );
            }
        })
    );
}
//MOVEMENTS
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
        piece.position.y++;
        if (checkCollision()) {
            piece.position.y--;
            solidifyPiece();
        }
    }
    if (event.key === "ArrowRight") {
        piece.position.x++;
        if (checkCollision()) piece.position.x--;
    }
    if (event.key === "ArrowLeft") {
        piece.position.x--;
        if (checkCollision()) piece.position.x++;
    }
    if (event.key === "ArrowUp") {
        const previousShape = piece.shape;
        rotate();
        if (checkCollision()) piece.shape = previousShape;
    }
});

//Auto Drop
setInterval(() => {
    piece.position.y++;
    if (checkCollision()) {
        piece.position.y--;
        solidifyPiece();
    }
}, 700);

//Game Over
function gameOver() {
    if (piece.position.y === 0) {
        alert("Game Over");
        location.reload();
    }
}

//Remove row
function removeRow() {
    let row = 0;
    for (let i = 0; i < board.length; i++) {
        if (board[i].every((value) => value > 0)) {
            row = i;
            board.splice(row, 1);
            board.unshift(new Array(BOARD_WIDTH).fill(0));
        }
    }
}

function solidifyPiece() {
    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value === 1) {
                board[piece.position.y + y][piece.position.x + x] = 1;
            }
        });
    });
    gameOver();
    //RESET PIECE
    randomPiece();
}

function rotate() {
    const newPiece = [];
    for (let i = 0; i < piece.shape[0].length; i++) {
        const row = [];
        for (let j = piece.shape.length - 1; j >= 0; j--) {
            row.push(piece.shape[j][i]);
        }
        newPiece.push(row);
    }
    piece.shape = newPiece;
}
function checkCollision() {
    return piece.shape.find((row, y) => {
        return row.find((value, x) => {
            return (
                value != 0 &&
                board[y + piece.position.y]?.[x + piece.position.x] != 0
            );
        });
    });
}

update();
