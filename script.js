// Navigation and page transitions
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('href');
        
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        document.querySelector(target).classList.add('active');

        document.querySelectorAll('.nav-link').forEach(l => {
            l.classList.remove('active');
        });
        link.classList.add('active');
    });
});

// Scroll effects
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    document.documentElement.style.setProperty('--scroll', scrolled * 0.5 + 'px');
});

// Intersection Observer for animations
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

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

document.querySelector('.logo').addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('#home').scrollIntoView({
        behavior: 'smooth'
    });
    
    // Update active class
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector('[href="#home"]').classList.add('active');
});