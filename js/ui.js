document.addEventListener('DOMContentLoaded', () => {
    // Função para rolagem suave
    const setupSmoothScroll = () => {
        const smoothScrollLinks = document.querySelectorAll('.smooth-scroll');

        if (smoothScrollLinks.length > 0) {
            smoothScrollLinks.forEach(link => {
                link.addEventListener('click', (event) => {
                    event.preventDefault(); // Impede o comportamento padrão do link

                    const targetId = link.getAttribute('href').substring(1);
                    const targetElement = document.getElementById(targetId);

                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
        }
    };

    // Função para aplicar efeitos de rolagem
    const setupScrollEffects = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Opcional: Para o efeito acontecer apenas uma vez
                }
            });
        }, {
            threshold: 0.2 // Define a porcentagem do elemento visível para o efeito acontecer
        });

        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            observer.observe(section);
        });
    };

    // Executa as funções quando a página estiver totalmente carregada
    setupSmoothScroll();
    setupScrollEffects();
});



// Ripple Effect
document.querySelectorAll(".ripple-btn").forEach(btn => {
    btn.addEventListener("click", rippleEffect);
});

// Função para o efeito de ripple
function rippleEffect(event) {
    const btn = event.currentTarget;

    // Remove qualquer ripple existente para evitar acúmulo
    const existingRipple = btn.querySelector(".ripple");
    if (existingRipple) {
        existingRipple.remove();
    }

    const circle = document.createElement("span");
    
    // Usa Math.max para criar um círculo que cobre a área total do botão
    const diameter = Math.max(btn.clientWidth, btn.clientHeight);
    
    circle.style.width = circle.style.height = `${diameter}px`;
    
    // Usa event.offsetX e event.offsetY para simplificar o cálculo
    circle.style.left = `${event.offsetX - diameter / 2}px`;
    circle.style.top = `${event.offsetY - diameter / 2}px`;
    
    circle.classList.add("ripple");
    
    btn.appendChild(circle);
}
