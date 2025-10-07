// Gerenciador de Tema
class ThemeManager {
    constructor() {
        this.themeFab = document.querySelector('.theme-fab');
        this.themePanel = document.querySelector('.theme-panel');
        this.colorOptions = document.querySelectorAll('.color-palette .color');
        this.toggleSwitch = document.querySelector('.toggle-switch');
        this.darkModeIcon = document.querySelector('.dark-mode-icon');

        this.init();
    }

    init() {
        // Carregar tema salvo
        this.loadSavedTheme();

        // Event Listeners
        this.themeFab?.addEventListener('click', (e) => this.toggleThemePanel(e));
        document.addEventListener('click', (e) => this.handleClickOutside(e));

        // Cores
        this.colorOptions.forEach(color => {
            color.addEventListener('click', (e) => this.changeColor(e.target));
        });

        // Dark Mode
        this.toggleSwitch?.addEventListener('click', () => this.toggleDarkMode());

        console.log('✅ Tema inicializado');
    }

    toggleThemePanel(e) {
        e.stopPropagation();
        this.themePanel.classList.toggle('active');
    }

    handleClickOutside(e) {
        if (this.themePanel && !this.themePanel.contains(e.target) &&
            this.themeFab && !this.themeFab.contains(e.target)) {
            this.themePanel.classList.remove('active');
        }
    }

    changeColor(colorElement) {
        const color = colorElement.getAttribute('data-color');

        // Remover active de todas as cores
        this.colorOptions.forEach(c => c.classList.remove('active'));

        // Adicionar active na cor selecionada
        colorElement.classList.add('active');

        // Definir cor baseada na seleção
        this.applyColor(color);

        // Salvar preferência
        this.saveTheme({
            color
        });
    }

    applyColor(color) {
        const colorHues = {
            red: {
                hue: 350,
                sat: '83%'
            },
            blue: {
                hue: 210,
                sat: '100%'
            },
            green: {
                hue: 136,
                sat: '65%'
            },
            pink: {
                hue: 332,
                sat: '79%'
            },
            lilac: {
                hue: 258,
                sat: '44%'
            },
            yellow: {
                hue: 54,
                sat: '100%'
            }
        };

        const theme = colorHues[color] || colorHues.red;
        document.documentElement.style.setProperty('--primary-hue', theme.hue);
        document.documentElement.style.setProperty('--primary-saturation', theme.sat);
    }

    toggleDarkMode() {
        const isCurrentlyDark = document.body.classList.contains('dark-theme-variables');
        const newDarkMode = !isCurrentlyDark;

        document.body.classList.toggle('dark-theme-variables', newDarkMode);

        // Atualizar ícone
        if (this.darkModeIcon) {
            this.darkModeIcon.textContent = newDarkMode ? 'dark_mode' : 'wb_sunny';
        }

        // Atualizar posição do toggle
        const toggleHandle = this.toggleSwitch.querySelector('.toggle-handle');
        if (toggleHandle) {
            toggleHandle.style.transform = newDarkMode ? 'translateX(26px)' : 'translateX(2px)';
        }

        // Salvar preferência
        this.saveTheme({
            darkMode: newDarkMode
        });
    }

    saveTheme(themeData) {
        const currentTheme = this.getSavedTheme();
        const newTheme = {
            ...currentTheme,
            ...themeData
        };
        localStorage.setItem('vlfr-theme', JSON.stringify(newTheme));
    }

    getSavedTheme() {
        return JSON.parse(localStorage.getItem('vlfr-theme') || '{}');
    }

    loadSavedTheme() {
        const savedTheme = this.getSavedTheme();

        // Aplicar cor
        if (savedTheme.color) {
            const colorElement = document.querySelector(`[data-color="${savedTheme.color}"]`);
            if (colorElement) {
                colorElement.classList.add('active');
                this.applyColor(savedTheme.color);
            }
        }

        // Aplicar dark mode
        if (savedTheme.darkMode) {
            document.body.classList.add('dark-theme-variables');
            if (this.darkModeIcon) {
                this.darkModeIcon.textContent = 'dark_mode';
            }
            const toggleHandle = this.toggleSwitch?.querySelector('.toggle-handle');
            if (toggleHandle) {
                toggleHandle.style.transform = 'translateX(26px)';
            }
        }
    }
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
});