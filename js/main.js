// Sistema Principal de Navegação e Inicialização
document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 Iniciando VLFR Painel...');

    initializeNavigation();
    initializeToastSystem();

    console.log('🎉 VLFR Painel totalmente inicializado!');
});

function initializeNavigation() {
    const menuItems = document.querySelectorAll('.sidebar .menu-item');
    const contentSections = document.querySelectorAll('main .content');

    function navigateToSection(targetId) {
        console.log('Navegando para:', targetId);

        contentSections.forEach(section => section.classList.remove('active'));
        menuItems.forEach(item => item.classList.remove('active'));

        const targetSection = document.getElementById(targetId);
        const targetMenuItem = document.querySelector(`.menu-item[data-target="${targetId}"]`);

        if (targetSection) {
            targetSection.classList.add('active');
        }

        if (targetMenuItem) {
            targetMenuItem.classList.add('active');
        }

        localStorage.setItem('currentSection', targetId);
    }

    menuItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-target');
            navigateToSection(targetId);
        });
    });

    const savedSection = localStorage.getItem('currentSection') || 'inicio';
    navigateToSection(savedSection);

    console.log('✅ Navegação inicializada');
}

function initializeToastSystem() {
    window.showToast = function (message, type = 'success') {
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icon = type === 'success' ? 'check_circle' :
            type === 'error' ? 'error' : 'warning';

        toast.innerHTML = `
            <span class="material-icons-sharp">${icon}</span>
            ${message}
        `;

        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 100);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };
}
