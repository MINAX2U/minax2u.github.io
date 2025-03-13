// Remove ALL previous JavaScript and replace with:

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