/* ============================= */
/* BOX ESCAPE WEBSITE JAVASCRIPT */
/* ============================= */

const playerBox = document.querySelector(".player-box");
const gameArea = document.querySelector(".game-area");
const scoreElement = document.querySelector("#score");
const startButton = document.querySelector("#start-game");
const resetButton = document.querySelector("#reset-game");
const navLinks = document.querySelectorAll("a[href^='#']");

/* ============================= */
/* SPLASH SCREEN                 */
/* ============================= */

const splashScreen = document.querySelector("#splash-screen");

if (splashScreen) {
    window.addEventListener("load", function () {
        setTimeout(function () {
            splashScreen.remove();
        }, 5000);
    });
}

/* ============================= */
/* 3D MOUSE MOVEMENT             */
/* ============================= */

document.addEventListener("mousemove", function (event) {
    if (!playerBox) return;

    const x = (window.innerWidth / 2 - event.clientX) / 35;
    const y = (window.innerHeight / 2 - event.clientY) / 35;

    playerBox.style.transform = `
        rotateX(${y}deg)
        rotateY(${-x}deg)
    `;
});

document.addEventListener("mouseleave", function () {
    if (!playerBox) return;

    playerBox.style.transform = `
        rotateX(0deg)
        rotateY(0deg)
    `;
});

/* ============================= */
/* SMOOTH NAVIGATION              */
/* ============================= */

navLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
        const targetId = link.getAttribute("href");

        if (!targetId || targetId === "#") return;

        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            event.preventDefault();

            targetSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
});

/* ============================= */
/* SCROLL REVEAL ANIMATION        */
/* ============================= */

const revealElements = document.querySelectorAll(
    ".analytics-card, .analytics-panel, .journey-card, .about-card"
);

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15
        }
    );

    revealElements.forEach(function (element) {
        element.classList.add("hidden");
        revealObserver.observe(element);
    });
} else {
    revealElements.forEach(function (element) {
        element.classList.add("show");
    });
}

/* ============================= */
/* BOX ESCAPE MINI GAME           */
/* ============================= */

let gameRunning = false;
let score = 0;
let gameTimer = null;
let fallingObjects = [];

function updateScore() {
    if (!scoreElement) return;

    scoreElement.textContent = score;
}

function createFallingObject() {
    if (!gameArea || !gameRunning) return;

    const object = document.createElement("div");

    object.classList.add("falling-object");

    object.style.left = Math.random() * 90 + "%";
    object.style.top = "-40px";

    gameArea.appendChild(object);
    fallingObjects.push(object);

    let objectPosition = -40;
    const fallSpeed = 2 + Math.random() * 2;

    function moveObject() {
        if (!gameRunning) return;

        objectPosition += fallSpeed;
        object.style.top = objectPosition + "px";

        const objectRect = object.getBoundingClientRect();
        const playerRect = playerBox
            ? playerBox.getBoundingClientRect()
            : null;

        if (
            playerRect &&
            objectRect.bottom > playerRect.top &&
            objectRect.top < playerRect.bottom &&
            objectRect.right > playerRect.left &&
            objectRect.left < playerRect.right
        ) {
            stopGame();
            return;
        }

        if (objectPosition > gameArea.clientHeight) {
            object.remove();

            fallingObjects = fallingObjects.filter(function (item) {
                return item !== object;
            });

            score += 1;
            updateScore();

            return;
        }

        requestAnimationFrame(moveObject);
    }

    requestAnimationFrame(moveObject);
}

function startGame() {
    if (!gameArea || gameRunning) return;

    gameRunning = true;
    score = 0;

    updateScore();

    gameArea.classList.add("game-active");

    gameTimer = setInterval(function () {
        createFallingObject();
    }, 850);

    createFallingObject();
}

function stopGame() {
    gameRunning = false;

    if (gameTimer) {
        clearInterval(gameTimer);
        gameTimer = null;
    }

    if (gameArea) {
        gameArea.classList.remove("game-active");
    }

    fallingObjects.forEach(function (object) {
        object.remove();
    });

    fallingObjects = [];

    if (scoreElement) {
        scoreElement.textContent = "Game Over: " + score;
    }
}

function resetGame() {
    if (gameTimer) {
        clearInterval(gameTimer);
        gameTimer = null;
    }

    gameRunning = false;
    score = 0;

    fallingObjects.forEach(function (object) {
        object.remove();
    });

    fallingObjects = [];

    updateScore();

    if (gameArea) {
        gameArea.classList.remove("game-active");
    }
}

if (startButton) {
    startButton.addEventListener("click", startGame);
}

if (resetButton) {
    resetButton.addEventListener("click", resetGame);
}

/* ============================= */
/* KEYBOARD MOVEMENT              */
/* ============================= */

let playerPosition = 50;

document.addEventListener("keydown", function (event) {
    if (!playerBox) return;

    const key = event.key.toLowerCase();

    if (
        event.key === "ArrowLeft" ||
        key === "a"
    ) {
        playerPosition -= 4;
    }

    if (
        event.key === "ArrowRight" ||
        key === "d"
    ) {
        playerPosition += 4;
    }

    playerPosition = Math.max(
        5,
        Math.min(90, playerPosition)
    );

    playerBox.style.left = playerPosition + "%";
});

/* ============================= */
/* ANALYTICS DATA                 */
/* ============================= */

const analyticsData = {
    activeUsers: 17,
    newUsers: 17,
    pageViews: 36,
    totalEvents: 119,

    /*
     * Keep actual analytics separate from presentation targets.
     * The measured value was 15 seconds.
     */
    averageEngagement: "15s",

    events: {
        pageViews: 36,
        scrolls: 29,
        sessionStarts: 29,
        firstVisits: 18
    },

    cities: {
        Indore: 6,
        Bhopal: 3,
        Gwalior: 3,
        Amsterdam: 1,
        Mumbai: 1,
        Ujjain: 1
    }
};

/* ============================= */
/* OPTIONAL ANALYTICS COUNTERS    */
/* ============================= */

const counterElements = document.querySelectorAll("[data-count]");

counterElements.forEach(function (element) {
    const target = Number(element.dataset.count);

    if (Number.isNaN(target)) return;

    let current = 0;
    const increment = Math.max(
        1,
        Math.ceil(target / 50)
    );

    function animateCounter() {
        current += increment;

        if (current >= target) {
            element.textContent = target;
            return;
        }

        element.textContent = current;

        requestAnimationFrame(animateCounter);
    }

    animateCounter();
});

/* ============================= */
/* CURRENT YEAR                  */
/* ============================= */

const yearElement = document.querySelector("#current-year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}