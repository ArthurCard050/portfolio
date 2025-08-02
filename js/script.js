// js/script.js (SEU NOVO PONTO DE ENTRADA PRINCIPAL PARA O ROLLUP)
import { smoothPageTransition } from './animations.js';
import { debounce } from './utils.js'; // Importa debounce de utils.js
import './portfolio.js'; // Importa a lógica do portfolio (incluindo openModal global)
import './cms-loader.js'; // Importa e executa a lógica do CMS
import './service.js'; // Importa a lógica da página de serviço/galeria

// Configurações globais que estavam em service.js e script.js
document.documentElement.style.scrollBehavior = 'smooth';

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
        }
    });
}, observerOptions);

function observeGalleryItems() {
    document.querySelectorAll('.gallery-item').forEach(item => {
        observer.observe(item);
    });
}

// Adicione um pequeno delay para garantir que o DOM esteja pronto antes de observar
setTimeout(observeGalleryItems, 100);


document.addEventListener('DOMContentLoaded', () => {
    // Lógica dos Cards do Portfólio (Home Page)
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    const projectUrls = [
        'projeto1.html', 'projeto2.html', 'projeto3.html',
        'projeto4.html', 'projeto5.html', 'projeto6.html'
    ];

    portfolioCards.forEach((card, index) => {
        const handleCardClick = (e) => {
            e.preventDefault();
            card.style.cssText += `
                transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
                transform: translateY(-5px) scale(0.98);
                filter: brightness(1.1);
            `;
            setTimeout(() => smoothPageTransition(projectUrls[index]), 200);
        };

        const handleCardHover = (isHovering) => {
            if (isHovering) {
                card.style.cssText += `
                    transform: translateY(-10px) scale(1.01);
                    box-shadow: 0 20px 60px rgba(255, 255, 255, 0.12);
                    filter: brightness(1.05);
                `;
                card.classList.add('hover-active');
            } else {
                card.style.cssText += `
                    transform: translateY(0) scale(1);
                    filter: brightness(1);
                    box-shadow: none;
                `;
                card.classList.remove('hover-active');
            }
        };

        card.addEventListener('click', handleCardClick);
        card.addEventListener('mouseenter', () => handleCardHover(true));
        card.addEventListener('mouseleave', () => handleCardHover(false));
    });

    // Menu Mobile (Centralizado aqui)
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open'); // Adicionado para controle de overflow
        });

        // Fechar menu ao clicar em um link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open'); // Remover classe também
            });
        });
    }

    // Scroll da Navbar (Centralizado aqui)
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', debounce(() => {
            navbar.classList.toggle('navbar-scrolled', window.scrollY > 50);
        }, 50));
    }

    // Smooth Scroll para links âncora (Centralizado aqui)
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // REMOVA TODO O BLOCO elegantStyles CONSTANTE E SEU APPEND CHILD.
    // O CSS deve vir do seu `scss/style.min.css`
    // const elegantStyles = document.createElement('style');
    // elegantStyles.textContent = `...`;
    // document.head.appendChild(elegantStyles);
});