import { update as updateSnake, draw as drawSnake, SNAKE_SPEED, getSnakeHead, snakeIntersection, getSnakeLength } from './snake.js';
import { update as updateFood, draw as drawFood } from './food.js';
import { update as updateScore, draw as drawScore } from './score.js';
import { outsideGrid } from './grid.js';

let lastRenderTime = 0;
let gameOver = false;
const gameBoard = document.getElementById('game-board');
const scoreBoard = document.getElementById('game-score-card');
let player = ''

function main(currentTime) {

    if (gameOver) {
        player = '';
        player = prompt('Enter your name (4-8 chars) to submit your score. Press ok to continue playing.')
        if (player.length < 9 && player.length > 3) {
            const playerScore = getSnakeLength();
            // console.log(playerScore)
            // console.log(player)
            const data = {
                name: player,
                score: playerScore
            }
            // console.log(data);
            fetch("https://playmysnake.herokuapp.com/api/newScore", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => {

                console.log("Request complete! response:", res);

            }).catch(err => {

                console.log("There was a problem sending the data", err);


            })
            window.location = '/'
        }
        return
    }

    window.requestAnimationFrame(main)
    const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;
    if (secondsSinceLastRender < 1 / SNAKE_SPEED) return;


    console.log("Render");
    lastRenderTime = currentTime;

    update()
    draw()
}

window.requestAnimationFrame(main);

function update() {
    updateSnake()
    updateFood()
    updateScore()
    checkDeath()
}
function draw() {
    gameBoard.innerHTML = '';
    drawSnake(gameBoard)
    drawFood(gameBoard);
    drawScore(scoreBoard)
}

function checkDeath() {
    gameOver = outsideGrid(getSnakeHead()) || snakeIntersection()
}