
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
let speed = 9;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{ x: 8, y: 8 }];
let food = { x: 4, y: 5 };

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
    // Wall collision (15x15 board)
    if (snake[0].x >= 16 || snake[0].x <= 0 || snake[0].y >= 16 || snake[0].y <= 0) {
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
        snakeArr = [{ x: 8, y: 8 }];
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
        let b = 14;
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
    // Prevent 180 reverse only when snake has segments behind it
    if (snakeArr.length > 1) {
        if (x !== 0 && inputDir.x === -x) return;
        if (y !== 0 && inputDir.y === -y) return;
    }
    inputDir = { x: x, y: y };
    try { moveSound.play(); } catch(e){}
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
        if (mode === 'Easy') speed = 5.5;
        else if (mode === 'Medium') speed = 9.5;
        else if (mode === 'Hard') speed = 15;
    });
});

// Virtual Pointer Joystick & Direction Arrows
(function setupJoystick() {
    const base = document.getElementById('joystick-base');
    const knob = document.getElementById('joystick-knob');
    if (!base || !knob) return;

    let activePointerId = null;
    const maxRadius = 38;

    function getCenter() {
        const rect = base.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }

    function processPointer(clientX, clientY) {
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

        // Angle-based direction calculation with 8px deadzone
        if (dist > 8) {
            const angleDeg = Math.atan2(dy, dx) * (180 / Math.PI); // -180 to 180
            if (angleDeg >= -45 && angleDeg <= 45) {
                handleDirection(1, 0); // Right
            } else if (angleDeg > 45 && angleDeg < 135) {
                handleDirection(0, 1); // Down
            } else if (angleDeg >= 135 || angleDeg <= -135) {
                handleDirection(-1, 0); // Left
            } else if (angleDeg > -135 && angleDeg < -45) {
                handleDirection(0, -1); // Up
            }
        }
    }

    // Modern Pointer Events with PointerCapture
    base.addEventListener('pointerdown', function(e) {
        activePointerId = e.pointerId;
        try { base.setPointerCapture(e.pointerId); } catch(err){}
        processPointer(e.clientX, e.clientY);
        e.preventDefault();
    });

    base.addEventListener('pointermove', function(e) {
        if (activePointerId === e.pointerId) {
            processPointer(e.clientX, e.clientY);
            e.preventDefault();
        }
    });

    function resetJoystick(e) {
        if (activePointerId === e.pointerId || activePointerId !== null) {
            activePointerId = null;
            knob.style.transform = 'translate(0px, 0px)';
        }
    }

    base.addEventListener('pointerup', resetJoystick);
    base.addEventListener('pointercancel', resetJoystick);
    base.addEventListener('lostpointercapture', resetJoystick);

    // Direct Direction Arrow Taps
    document.querySelector('.j-up')?.addEventListener('pointerdown', (e) => { e.stopPropagation(); handleDirection(0, -1); });
    document.querySelector('.j-down')?.addEventListener('pointerdown', (e) => { e.stopPropagation(); handleDirection(0, 1); });
    document.querySelector('.j-left')?.addEventListener('pointerdown', (e) => { e.stopPropagation(); handleDirection(-1, 0); });
    document.querySelector('.j-right')?.addEventListener('pointerdown', (e) => { e.stopPropagation(); handleDirection(1, 0); });
})();

// Touch Swipe Gesture on Board
(function setupSwipeControls() {
    let startX = 0;
    let startY = 0;
    const threshold = 18;

    board.addEventListener('touchstart', function(e) {
        if (e.touches && e.touches[0]) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }
    }, { passive: true });

    board.addEventListener('touchend', function(e) {
        if (e.changedTouches && e.changedTouches[0]) {
            const dx = e.changedTouches[0].clientX - startX;
            const dy = e.changedTouches[0].clientY - startY;
            const absX = Math.abs(dx);
            const absY = Math.abs(dy);

            if (Math.max(absX, absY) > threshold) {
                if (absX > absY) {
                    if (dx > 0) handleDirection(1, 0);
                    else handleDirection(-1, 0);
                } else {
                    if (dy > 0) handleDirection(0, 1);
                    else handleDirection(0, -1);
                }
            }
        }
    }, { passive: true });
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
