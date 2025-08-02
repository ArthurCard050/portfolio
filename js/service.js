// js/service.js
import { debounce } from "./utils.js";

// Classe principal para gerenciar a galeria moderna
class ModernGallery {
    constructor() {
        this.currentFilter = 'all';
        this.currentView = 'grid-3';
        this.currentPage = 1;
        this.itemsPerPage = 6;
        this.currentLightboxIndex = 0;
        this.filteredItems = [];
        
        this.galleryData = [
            { id: 1, src: 'https://picsum.photos/400/300?random=1', title: 'Logo Principal', description: 'Desenvolvimento do logotipo principal da marca', category: 'logo', tags: ['Logo', 'Identidade'] },
            { id: 2, src: 'https://picsum.photos/400/400?random=2', title: 'Variações do Logo', description: 'Diferentes versões e aplicações do logo', category: 'logo', tags: ['Logo', 'Variações'] },
            { id: 3, src: 'https://picsum.photos/400/250?random=3', title: 'Cartão de Visita', description: 'Design do cartão de visita corporativo', category: 'papelaria', tags: ['Cartão', 'Papelaria'] },
            { id: 4, src: 'https://picsum.photos/400/350?random=4', title: 'Papel Timbrado', description: 'Aplicação em papel timbrado oficial', category: 'papelaria', tags: ['Papel', 'Corporativo'] },
            { id: 5, src: 'https://picsum.photos/400/280?random=5', title: 'Website Design', description: 'Interface do website da empresa', category: 'digital', tags: ['Web', 'UI/UX'] },
            { id: 6, src: 'https://picsum.photos/400/320?random=6', title: 'App Mobile', description: 'Design do aplicativo mobile', category: 'digital', tags: ['Mobile', 'App'] },
            { id: 7, src: 'https://picsum.photos/400/380?random=7', title: 'Mockup Corporativo', description: 'Apresentação em mockup realístico', category: 'mockup', tags: ['Mockup', 'Apresentação'] },
            { id: 8, src: 'https://picsum.photos/400/260?random=8', title: 'Envelope Corporativo', description: 'Design do envelope oficial da empresa', category: 'papelaria', tags: ['Envelope', 'Papelaria'] },
            { id: 9, src: 'https://picsum.photos/400/340?random=9', title: 'Social Media Kit', description: 'Templates para redes sociais', category: 'digital', tags: ['Social', 'Templates'] },
            { id: 10, src: 'https://picsum.photos/400/300?random=10', title: 'Pasta Corporativa', description: 'Design da pasta institucional', category: 'papelaria', tags: ['Pasta', 'Institucional'] },
            { id: 11, src: 'https://picsum.photos/400/280?random=11', title: 'Apresentação Mockup', description: 'Mockup de apresentação do projeto', category: 'mockup', tags: ['Mockup', 'Pitch'] },
            { id: 12, src: 'https://picsum.photos/400/360?random=12', title: 'Manual de Marca', description: 'Páginas do manual de identidade visual', category: 'logo', tags: ['Manual', 'Guidelines'] },
            { id: 13, src: 'https://picsum.photos/400/320?random=13', title: 'Sinalização Externa', description: 'Aplicação em placas e sinalização', category: 'mockup', tags: ['Sinalização', 'Externo'] },
            { id: 14, src: 'https://picsum.photos/400/280?random=14', title: 'Crachá Corporativo', description: 'Design do crachá dos funcionários', category: 'papelaria', tags: ['Crachá', 'ID'] },
            { id: 15, src: 'https://picsum.photos/400/350?random=15', title: 'Newsletter Design', description: 'Template para newsletter', category: 'digital', tags: ['Newsletter', 'Email'] }
        ];

        this.init();
    }

    init() {
        this.bindEvents();
        this.updateFilteredItems();
        this.renderGallery();
    }

    bindEvents() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilterClick(e));
        });

        // View buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleViewClick(e));
        });

        // Load more button
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMoreItems());
        }

        this.bindLightboxEvents();
    }

    handleFilterClick(e) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.currentFilter = e.target.dataset.filter;
        this.currentPage = 1;
        this.updateFilteredItems();
        this.renderGallery();
    }

    handleViewClick(e) {
        document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.currentView = e.target.dataset.view;
        this.updateGalleryView();
    }

    updateFilteredItems() {
        this.filteredItems = this.currentFilter === 'all' 
            ? this.galleryData 
            : this.galleryData.filter(item => item.category === this.currentFilter);
    }

    renderGallery() {
        const grid = document.getElementById('galleryGrid');
        if (!grid) return;
        
        const itemsToShow = this.currentPage * this.itemsPerPage;
        const visibleItems = this.filteredItems.slice(0, itemsToShow);

        grid.innerHTML = visibleItems.map((item, index) => 
            this.createGalleryItemHTML(item, index)
        ).join('');

        this.updateLoadMoreButton();
        this.bindGalleryItemEvents();
    }

    createGalleryItemHTML(item, index) {
        return `
            <div class="gallery-item${this.currentView === 'masonry' ? ' masonry' : ''}" 
                 data-category="${item.category}" data-index="${index}">
                <img src="${item.src}" alt="${item.title}" class="gallery-image" loading="lazy">
                <div class="gallery-overlay">
                    <h4>${item.title}</h4>
                    <p>${item.description}</p>
                    <div class="gallery-tags">
                        ${item.tags.map(tag => `<span class="gallery-tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    updateGalleryView() {
        const grid = document.getElementById('galleryGrid');
        if (grid) {
            grid.className = `gallery-grid ${this.currentView}`;
        }
    }

    loadMoreItems() {
        const loadBtn = document.getElementById('loadMoreBtn');
        if (!loadBtn) return;
        
        loadBtn.innerHTML = '<span class="loading-spinner"></span>';
        loadBtn.disabled = true;

        setTimeout(() => {
            this.currentPage++;
            this.renderGallery();
            loadBtn.innerHTML = '<span>Carregar Mais</span><i class="fas fa-chevron-down"></i>';
            loadBtn.disabled = false;
        }, 1000);
    }

    updateLoadMoreButton() {
        const loadBtn = document.getElementById('loadMoreBtn');
        const container = document.querySelector('.load-more-container');
        if (!loadBtn || !container) return;
        
        const totalItems = this.filteredItems.length;
        const visibleItems = this.currentPage * this.itemsPerPage;

        if (visibleItems >= totalItems) {
            loadBtn.style.display = 'none';
            this.showHideButton(container);
        } else {
            loadBtn.style.display = 'inline-flex';
            this.hideHideButton();
        }
    }

    showHideButton(container) {
        let hideBtn = document.getElementById('hideImagesBtn');
        
        if (!hideBtn) {
            hideBtn = document.createElement('button');
            hideBtn.id = 'hideImagesBtn';
            hideBtn.className = 'load-more-btn';
            hideBtn.innerHTML = '<span>Ocultar Imagens</span><i class="fas fa-chevron-up"></i>';
            hideBtn.addEventListener('click', () => this.hideImages());
            container.appendChild(hideBtn);
        }
        
        hideBtn.style.display = 'inline-flex';
    }

    hideHideButton() {
        const hideBtn = document.getElementById('hideImagesBtn');
        if (hideBtn) {
            hideBtn.style.display = 'none';
        }
    }

    hideImages() {
        this.currentPage = 1;
        this.renderGallery();
    }

    bindGalleryItemEvents() {
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.index);
                this.openLightbox(index);
            });
        });
    }

    bindLightboxEvents() {
        const lightbox = document.getElementById('lightbox');
        const controls = {
            close: document.getElementById('lightboxClose'),
            prev: document.getElementById('lightboxPrev'),
            next: document.getElementById('lightboxNext')
        };

        if (!lightbox || !controls.close || !controls.prev || !controls.next) return;

        controls.close.addEventListener('click', () => this.closeLightbox());
        controls.prev.addEventListener('click', () => this.showPrevImage());
        controls.next.addEventListener('click', () => this.showNextImage());

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) this.closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            
            switch(e.key) {
                case 'Escape': this.closeLightbox(); break;
                case 'ArrowLeft': this.showPrevImage(); break;
                case 'ArrowRight': this.showNextImage(); break;
            }
        });
    }

    openLightbox(index) {
        this.currentLightboxIndex = index;
        this.updateLightboxContent();
        document.getElementById('lightbox').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        document.getElementById('lightbox').classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    showPrevImage() {
        const itemsToShow = this.currentPage * this.itemsPerPage;
        const visibleItems = this.filteredItems.slice(0, itemsToShow);
        this.currentLightboxIndex = (this.currentLightboxIndex - 1 + visibleItems.length) % visibleItems.length;
        this.updateLightboxContent();
    }

    showNextImage() {
        const itemsToShow = this.currentPage * this.itemsPerPage;
        const visibleItems = this.filteredItems.slice(0, itemsToShow);
        this.currentLightboxIndex = (this.currentLightboxIndex + 1) % visibleItems.length;
        this.updateLightboxContent();
    }

    updateLightboxContent() {
        const itemsToShow = this.currentPage * this.itemsPerPage;
        const visibleItems = this.filteredItems.slice(0, itemsToShow);
        const item = visibleItems[this.currentLightboxIndex];

        if (!item) return;

        const elements = {
            image: document.getElementById('lightboxImage'),
            title: document.getElementById('lightboxTitle'),
            description: document.getElementById('lightboxDescription')
        };

        if (!elements.image || !elements.title || !elements.description) return;

        elements.image.style.opacity = '0';
        
        setTimeout(() => {
            elements.image.src = item.src;
            elements.image.alt = item.title;
            elements.title.textContent = item.title;
            elements.description.textContent = item.description;
            elements.image.style.opacity = '1';
        }, 150);
    }
}

// Função utilitária para animação de digitação (Mantenha esta função)
function typeText(element, text, speed = 80) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

document.addEventListener('DOMContentLoaded', function() {
    // REMOVA A LÓGICA DO HAMBURGER, NAVMENU E NAVBAR SCROLL DAQUI
    // const hamburger = document.querySelector('.hamburger');
    // const navMenu = document.querySelector('.nav-menu');
    // const navbar = document.querySelector('.navbar');
    // if (hamburger && navMenu) { /* ... */ }
    // if (navbar) { /* ... */ }

    // Animação de entrada ao rolar (Mantenha esta lógica)
    const animatedElements = document.querySelectorAll('.content-section, .process-step, .detail-card, .gallery-item, .nav-project');
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => observer.observe(el));
    }
    
    // Animação de digitação do título (Mantenha esta lógica)
    const serviceTitle = document.querySelector('.service-title');
    if (serviceTitle) {
        const originalText = serviceTitle.textContent;
        
        const titleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeText(serviceTitle, originalText);
                    titleObserver.unobserve(entry.target);
                }
            });
        });
        titleObserver.observe(serviceTitle);
    }
    
    // Lightbox básico (para páginas que não usam ModernGallery) (Mantenha esta lógica)
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');

    if (galleryItems.length > 0 && lightbox && !document.getElementById('galleryGrid')) {
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const lightboxTitle = lightbox.querySelector('.lightbox-title');
        const controls = {
            close: lightbox.querySelector('.lightbox-close'),
            prev: lightbox.querySelector('.lightbox-prev'),
            next: lightbox.querySelector('.lightbox-next')
        };

        let currentIndex = 0;
        const images = Array.from(galleryItems).map(item => ({
            src: item.href || item.querySelector('img')?.src, // Use href ou src da imagem interna
            title: item.dataset.title || item.querySelector('h4')?.textContent // Use dataset.title ou h4
        }));

        const updateLightbox = () => {
            lightboxImage.style.opacity = 0;
            setTimeout(() => {
                lightboxImage.src = images[currentIndex].src;
                lightboxTitle.textContent = images[currentIndex].title;
                lightboxImage.style.opacity = 1;
            }, 200);
        };

        const showLightbox = (index) => {
            currentIndex = index;
            updateLightbox();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const hideLightbox = () => {
            lightbox.classList.remove('active');
            document.body.classList.remove('lightbox-active'); // Adicione para controle de overflow
            document.body.style.overflow = 'auto';
        };

        const showNextImage = () => {
            currentIndex = (currentIndex + 1) % images.length;
            updateLightbox();
        };

        const showPrevImage = () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateLightbox();
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', e => {
                e.preventDefault();
                showLightbox(index);
            });
        });

        controls.close.addEventListener('click', hideLightbox);
        controls.next.addEventListener('click', showNextImage);
        controls.prev.addEventListener('click', showPrevImage);

        lightbox.addEventListener('click', e => {
            if (e.target === lightbox) hideLightbox();
        });

        document.addEventListener('keydown', e => {
            if (!lightbox.classList.contains('active')) return;
            
            switch(e.key) {
                case 'Escape': hideLightbox(); break;
                case 'ArrowRight': showNextImage(); break;
                case 'ArrowLeft': showPrevImage(); break;
            }
        });
    }

    // Inicializar ModernGallery se necessário (Mantenha esta lógica)
    if (document.getElementById('galleryGrid')) {
        new ModernGallery();
    }
});

// REMOVA AS CONFIGURAÇÕES GLOBAIS DAQUI, SERÃO CENTRALIZADAS EM SCRIPT.JS
// document.documentElement.style.scrollBehavior = 'smooth';
// const observerOptions = { /* ... */ };
// const observer = new IntersectionObserver((entries) => { /* ... */ }, observerOptions);
// function observeGalleryItems() { /* ... */ }
// setTimeout(observeGalleryItems, 100);