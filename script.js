// ================ FIXED SCRIPT.JS ================ 
// Highlight active page
document.addEventListener('DOMContentLoaded', highlightActiveLink);

// Intersection Observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

// Initialize page components
function initializePage() {
    // 1. Mobile menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger?.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!hamburger?.contains(e.target) && !navLinks?.contains(e.target)) {
            navLinks?.classList.remove('active');
        }
    });

    // 2. Navigation links (SPA transitions)
    document.querySelectorAll('.nav-link, .logo').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    // 3. Card animations
    document.querySelectorAll('.card, .social-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        observer.observe(el);
    });

    // 4. Snake game (about page only)
    if (window.location.pathname.includes('about.html')) {
        initSnakeGame();
    }
}

// SPA navigation handler
async function handleNavigation(e) {
    e.preventDefault();
    const url = this.href;
    const loadingOverlay = createLoadingOverlay();
    
    try {
        document.body.appendChild(loadingOverlay);
        const response = await fetch(url);
        const text = await response.text();
        const newDoc = new DOMParser().parseFromString(text, 'text/html');

        // Fade out old content
        document.querySelector('main').classList.add('hidden');

        setTimeout(() => {
            // Replace content
            document.querySelector('main').replaceWith(newDoc.querySelector('main'));
            document.querySelector('.nav-links').replaceWith(newDoc.querySelector('.nav-links'));
            
            // Reinitialize everything
            highlightActiveLink();
            initializePage();
            window.scrollTo(0, 0);
            
            // Fade in new content
            loadingOverlay.remove();
            setTimeout(() => {
                document.querySelector('main').classList.remove('hidden');
            }, 50);
        }, 300);

        window.history.pushState(null, null, url);
    } catch (error) {
        console.error('Navigation failed:', error);
        window.location = url;
    }
}

// Helper functions
function highlightActiveLink() {
    const currentPage = location.pathname.split('/').pop();
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === currentPage);
    });
}

function createLoadingOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = '<div class="loading-spinner"></div>';
    return overlay;
}

// Initial load
document.addEventListener('DOMContentLoaded', initializePage);
window.addEventListener('popstate', () => location.reload());

// Keep your existing snake game code below
// ================ END OF FIXES ================
// Snake game initialization function
function initSnakeGame() {
    (function() {
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const scoreElement = document.getElementById('score');
        const restartBtn = document.getElementById('restartBtn');
        
        const gridSize = 20;
        const tileCount = canvas.width / gridSize;
        let snake = [{x: 10, y: 10}];
        let food = {x: 15, y: 15};
        let dx = 0;
        let dy = 0;
        let score = 0;
        let gameLoop;

        function drawGame() {
            clearCanvas();
            moveSnake();
            drawFood();
            drawSnake();
            checkCollision();
            checkFoodCollision();
        }

        function drawSnake() {
            ctx.fillStyle = '#00f3ff';
            snake.forEach(segment => {
                ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize-2, gridSize-2);
            });
        }

        function drawFood() {
            ctx.fillStyle = '#ff206e';
            ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize-2, gridSize-2);
        }

        function moveSnake() {
            const head = {x: snake[0].x + dx, y: snake[0].y + dy};
            snake.unshift(head);
            snake.pop();
        }

        function clearCanvas() {
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        function checkCollision() {
            const head = snake[0];
            if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
                gameOver();
            }
            for (let i = 1; i < snake.length; i++) {
                if (head.x === snake[i].x && head.y === snake[i].y) {
                    gameOver();
                }
            }
        }

        function checkFoodCollision() {
            const head = snake[0];
            if (head.x === food.x && head.y === food.y) {
                score += 10;
                scoreElement.textContent = `Score: ${score}`;
                generateFood();
                snake.push({});
            }
        }

        function generateFood() {
            food = {
                x: Math.floor(Math.random() * tileCount),
                y: Math.floor(Math.random() * tileCount)
            };
        }

        function gameOver() {
            clearInterval(gameLoop);
            alert(`Game Over! Score: ${score}`);
        }

        function startGame() {
            snake = [{x: 10, y: 10}];
            dx = 0;
            dy = 0;
            score = 0;
            scoreElement.textContent = `Score: ${score}`;
            generateFood();
            if (gameLoop) clearInterval(gameLoop);
            gameLoop = setInterval(drawGame, 100);
        }

        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowUp': if (dy !== 1) { dx = 0; dy = -1; } break;
                case 'ArrowDown': if (dy !== -1) { dx = 0; dy = 1; } break;
                case 'ArrowLeft': if (dx !== 1) { dx = -1; dy = 0; } break;
                case 'ArrowRight': if (dx !== -1) { dx = 1; dy = 0; } break;
            }
        });

        restartBtn.addEventListener('click', startGame);
        startGame();
    })();
}