import { getSnakeLength } from './snake.js';

let snakeLength = 0;

export function update() {
    if (snakeLength < getSnakeLength()) return snakeLength++
}

export function draw(scoreBoard) {
    scoreBoard.innerText = snakeLength;
}