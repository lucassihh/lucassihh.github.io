            function toggleTip(element) {
                const detail = element.querySelector('.tip-detail');
                const isHidden = detail.classList.contains('hidden');
                
                // Close all other tips first
                document.querySelectorAll('.tip-detail').forEach(tip => {
                    if (tip !== detail) {
                        tip.classList.add('hidden');
                        tip.parentElement.parentElement.classList.remove('bg-white', 'border', 'border-border');
                        tip.parentElement.parentElement.classList.add('bg-white', 'border', 'border-border');
                    }
                });
                
                if (isHidden) {
                    detail.classList.remove('hidden');
                    element.classList.remove('bg-white', 'border', 'border-border');
                    element.classList.add('bg-white', 'border', 'border-border');
                    
                    // Add a gentle bounce animation
                    detail.style.animation = 'fadeIn 0.3s ease-out';
                } else {
                    detail.classList.add('hidden');
                    element.classList.remove('bg-white', 'border', 'border-border');
                    element.classList.add('bg-white', 'border', 'border-border');
                }
            }
            
            
            // Add entrance animations for tips
            document.addEventListener('DOMContentLoaded', () => {
                const tips = document.querySelectorAll('.tip-item');
                tips.forEach((tip, index) => {
                    tip.style.opacity = '0';
                    tip.style.transform = 'translateX(-20px)';
                    tip.style.transition = 'all 0.5s ease-out';
                    
                    setTimeout(() => {
                        tip.style.opacity = '1';
                        tip.style.transform = 'translateX(0)';
                    }, index * 150);
                });
                
                    const observerOptions = {
        root: null, // null significa o viewport
        threshold: 0.2 // 20% do elemento deve estar visível para disparar
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('invisible');
                entry.target.classList.add('animate-slide-up');
                observer.unobserve(entry.target); // Para a animação acontecer apenas uma vez
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });
    
            });
         
