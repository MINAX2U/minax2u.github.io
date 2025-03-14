
// Highlight active page in navigation
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = location.pathname.split('/').pop();
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});

// Keep only card animations if needed
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.card, .social-card').forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(20px)';
    observer.observe(el);
});

document.addEventListener('DOMContentLoaded', function() {
    // Handle initial page load
    highlightActiveLink();
    initializePage();
});

// Smooth page transitions
document.querySelectorAll('.nav-link, .logo').forEach(link => {
    link.addEventListener('click', async function(e) {
        e.preventDefault();
        const url = this.href;

        // Show loading overlay
        const loadingOverlay = createLoadingOverlay();
        document.body.appendChild(loadingOverlay);

        try {
            // Fetch new page content
            const response = await fetch(url);
            const text = await response.text();
            const newDocument = new DOMParser().parseFromString(text, 'text/html');

            // Extract important parts
            const newMain = newDocument.querySelector('main');
            const newNav = newDocument.querySelector('.nav-links');

            // Start transition
            document.querySelector('main').classList.add('hidden');
            
            setTimeout(async () => {
                // Update content
                document.querySelector('main').replaceWith(newMain);
                document.querySelector('.nav-links').replaceWith(newNav);

                // Reinitialize components
                highlightActiveLink();
                initializePage();
                
                // Scroll to top
                window.scrollTo(0, 0);
                
                // Hide loading overlay
                loadingOverlay.remove();
                
                // Trigger new content animation
                setTimeout(() => {
                    newMain.classList.remove('hidden');
                }, 50);
            }, 300);

            // Update browser history
            window.history.pushState(null, null, url);

        } catch (error) {
            console.error('Page transition failed:', error);
            window.location = url;
        }
    });
});

// Handle browser back/forward
window.addEventListener('popstate', () => {
    window.location.reload();
});

function highlightActiveLink() {
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.href === window.location.href);
    });
}

function createLoadingOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    overlay.appendChild(spinner);
    return overlay;
}

function initializePage() {
    // Reinitialize animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.card, .social-card').forEach(el => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(20px)';
        observer.observe(el);
    });

    // Reinitialize game if on about page
    if (window.location.pathname.includes('about.html')) {
        initSnakeGame();
    }
}

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