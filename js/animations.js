export function createSmoothTransition() {
    const overlay = document.createElement('div');
    overlay.className = 'smooth-transition-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: linear-gradient(135deg,
            rgba(0, 0, 0, 0.9),
            rgba(17, 17, 17, 0.95),
            rgba(0, 0, 0, 0.9)
        );
        z-index: 9999;
        opacity: 0;
        backdrop-filter: blur(0px);
        transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
        pointer-events: none;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    document.body.appendChild(overlay);
    return overlay;
}

export function animatePageElements() {
    const elements = document.querySelectorAll('.portfolio-card, .hero-title, .nav-menu, .contact-form');
    elements.forEach((element, index) => {
        setTimeout(() => {
            element.style.cssText += `
                transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
                transform: translateY(20px) scale(0.95);
                opacity: 0.3;
                filter: blur(3px);
            `;
        }, index * 100);
    });
}

export function createFloatingParticles(container) {
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 6 + 2}px;
            height: ${Math.random() * 6 + 2}px;
            background: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2});
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: particleFloat ${Math.random() * 3 + 2}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
            pointer-events: none;
        `;
        container.appendChild(particle);
    }
}

const TRANSITION_CONFIG = {
    overlayAppearDelay: 300,
    loadingFadeDelay: 400,
    totalAnimationTime: 1500
};

export function smoothPageTransition(projectUrl) {
    const overlay = createSmoothTransition();
    document.body.style.overflow = 'hidden';
    animatePageElements();
    createFloatingParticles(overlay);

    // Criar loader
    const loadingContainer = document.createElement('div');
    loadingContainer.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        color: #fff;
        opacity: 0;
        transition: all 0.6s ease-out;
        z-index: 10001;
    `;
    
    loadingContainer.innerHTML = `
        <div class="elegant-loader"></div>
        <p style="margin-top: 20px; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 300; letter-spacing: 1px; opacity: 0.8;">
            Carregando projeto...
        </p>
    `;
    document.body.appendChild(loadingContainer);

    // Sequência de animações
    setTimeout(() => {
        overlay.style.cssText += 'opacity: 1; backdrop-filter: blur(20px); pointer-events: auto;';
    }, TRANSITION_CONFIG.overlayAppearDelay);

    setTimeout(() => {
        loadingContainer.style.opacity = '1';
    }, TRANSITION_CONFIG.loadingFadeDelay);

    setTimeout(() => {
        window.location.href = projectUrl;
    }, TRANSITION_CONFIG.totalAnimationTime);
}