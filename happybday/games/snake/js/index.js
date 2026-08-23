
// Image Configuration (Square tiles with original images)
const imageConfig = {
    useImages: true,
    snakeHead: 'img/snake.jpg',
    snakeBody: 'img/snake.jpg',
    food: 'img/food.jpg'
};

// Game Constants & Variables
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/music.mp3');
let speed = 10;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{ x: 9, y: 9 }];
let food = { x: 6, y: 7 };

const board = document.getElementById('board');
const scoreBox = document.getElementById('scoreBox');
const hiscoreBox = document.getElementById('hiscoreBox');
const currentDifficultyEl = document.getElementById('current-difficulty');

// Game Loop
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    // Self collision
    for (let i = 1; i < snakeArr.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    // Wall collision
    if (snake[0].x >= 19 || snake[0].x <= 0 || snake[0].y >= 19 || snake[0].y <= 0) {
        return true;
    }
    return false;
}

function gameEngine() {
    // 1. Collision Check
    if (isCollide(snakeArr)) {
        try { gameOverSound.play(); } catch(e){}
        try { musicSound.pause(); } catch(e){}
        inputDir = { x: 0, y: 0 };
        snakeArr = [{ x: 9, y: 9 }];
        score = 0;
        scoreBox.innerHTML = "Score: 0";
    }

    // 2. Food Eating
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        try { foodSound.play(); } catch(e){}
        score += 1;
        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
        }
        scoreBox.innerHTML = "Score: " + score;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        let a = 2;
        let b = 16;
        food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
    }

    // 3. Moving the Snake
    if (inputDir.x !== 0 || inputDir.y !== 0) {
        for (let i = snakeArr.length - 2; i >= 0; i--) {
            snakeArr[i + 1] = { ...snakeArr[i] };
        }
        snakeArr[0].x += inputDir.x;
        snakeArr[0].y += inputDir.y;
    }

    // 4. Render
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        const snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        if (index === 0) {
            snakeElement.classList.add('head');
            if (imageConfig.useImages && imageConfig.snakeHead) {
                snakeElement.style.backgroundImage = 'url("' + imageConfig.snakeHead + '")';
            }
        } else {
            snakeElement.classList.add('snake');
            if (imageConfig.useImages && imageConfig.snakeBody) {
                snakeElement.style.backgroundImage = 'url("' + imageConfig.snakeBody + '")';
            }
        }
        board.appendChild(snakeElement);
    });

    // Display Food
    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    if (imageConfig.useImages && imageConfig.food) {
        foodElement.style.backgroundImage = 'url("' + imageConfig.food + '")';
    }
    board.appendChild(foodElement);
}

// Direction Handler
function handleDirection(x, y) {
    if (inputDir.x === 0 && inputDir.y === 0) {
        inputDir = { x: x, y: y };
        try { moveSound.play(); } catch(e){}
        return;
    }
    // Prevent 180 reverse into body
    if (x !== 0 && inputDir.x !== -x) {
        inputDir = { x: x, y: 0 };
        try { moveSound.play(); } catch(e){}
    } else if (y !== 0 && inputDir.y !== -y) {
        inputDir = { x: 0, y: y };
        try { moveSound.play(); } catch(e){}
    }
}

// Keyboard controls
window.addEventListener('keydown', e => {
    switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
            handleDirection(0, -1);
            e.preventDefault();
            break;
        case "ArrowDown":
        case "s":
        case "S":
            handleDirection(0, 1);
            e.preventDefault();
            break;
        case "ArrowLeft":
        case "a":
        case "A":
            handleDirection(-1, 0);
            e.preventDefault();
            break;
        case "ArrowRight":
        case "d":
        case "D":
            handleDirection(1, 0);
            e.preventDefault();
            break;
    }
});

// Difficulty Switcher Buttons
const diffButtons = document.querySelectorAll('.diff-btn');
diffButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        diffButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const mode = this.getAttribute('data-diff');
        currentDifficultyEl.textContent = mode;
        if (mode === 'Easy') speed = 6;
        else if (mode === 'Medium') speed = 11;
        else if (mode === 'Hard') speed = 17;
    });
});

// Virtual Touch Joystick
(function setupJoystick() {
    const base = document.getElementById('joystick-base');
    const knob = document.getElementById('joystick-knob');
    if (!base || !knob) return;

    let isDragging = false;
    const maxRadius = 34;

    function getCenter() {
        const rect = base.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }

    function handleMove(clientX, clientY) {
        const center = getCenter();
        const dx = clientX - center.x;
        const dy = clientY - center.y;
        const dist = Math.hypot(dx, dy);

        let clampedX = dx;
        let clampedY = dy;
        if (dist > maxRadius) {
            clampedX = (dx / dist) * maxRadius;
            clampedY = (dy / dist) * maxRadius;
        }

        knob.style.transform = 'translate(' + clampedX + 'px, ' + clampedY + 'px)';

        // Direction steering threshold (deadzone > 8px)
        if (dist > 8) {
            const absX = Math.abs(dx);
            const absY = Math.abs(dy);
            if (absX > absY) {
                if (dx > 0) handleDirection(1, 0);
                else handleDirection(-1, 0);
            } else {
                if (dy > 0) handleDirection(0, 1);
                else handleDirection(0, -1);
            }
        }
    }

    function onStart(e) {
        isDragging = true;
        const pt = e.touches ? e.touches[0] : e;
        handleMove(pt.clientX, pt.clientY);
    }

    function onMove(e) {
        if (!isDragging) return;
        const pt = e.touches ? e.touches[0] : e;
        handleMove(pt.clientX, pt.clientY);
        if (e.cancelable) e.preventDefault();
    }

    function onEnd() {
        isDragging = false;
        knob.style.transform = 'translate(0px, 0px)';
    }

    base.addEventListener('touchstart', onStart, { passive: false });
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);
    window.addEventListener('touchcancel', onEnd);

    base.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
})();

// HiScore setup & Start
let hiscore = localStorage.getItem("hiscore");
let hiscoreval = 0;
if (hiscore !== null) {
    hiscoreval = JSON.parse(hiscore);
    hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
} else {
    localStorage.setItem("hiscore", JSON.stringify(0));
}

window.requestAnimationFrame(main);
