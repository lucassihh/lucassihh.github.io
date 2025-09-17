document.addEventListener('DOMContentLoaded', () => {
   // Funções de inicialização
   const setupSmoothScroll = () => {
      document.querySelectorAll('.smooth-scroll').forEach(link => {
         link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
               targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
         });
      });
   };

   const setupScrollAnimations = () => {
      const observer = new IntersectionObserver((entries) => {
         entries.forEach(entry => {
            if (entry.isIntersecting) {
               entry.target.classList.add('visible', 'animate-slide-up');
               observer.unobserve(entry.target);
            }
         });
      }, { threshold: 0.2 });

      document.querySelectorAll('section, .animate-on-scroll').forEach(element => {
         observer.observe(element);
      });
   };
   
   const setupTipEntrance = () => {
      document.querySelectorAll('.tip-item').forEach((tip, index) => {
         setTimeout(() => {
            tip.classList.add('animated-tip');
         }, index * 150);
      });
   };

   const setupTooltips = () => {
      document.querySelectorAll('[data-tooltip-content]').forEach(element => {
         element.addEventListener('mouseenter', handleTooltipEnter);
         element.addEventListener('mouseleave', handleTooltipLeave);
      });
   };

   const setupRippleEffects = () => {
      document.querySelectorAll(".ripple-btn").forEach(btn => {
         btn.addEventListener("click", rippleEffect);
      });
   };

   // Executa todas as funções de inicialização
   setupSmoothScroll();
   setupScrollAnimations();
   setupTipEntrance();
   setupTooltips();
   setupRippleEffects();
});

// Funções de manipulação de eventos
const handleTooltipEnter = (event) => {
   const element = event.target;
   const tooltipContent = element.getAttribute('data-tooltip-content');
   
   const tooltip = document.createElement('div');
   tooltip.className = 'tooltip-element absolute z-50 px-3 py-1.5 text-sm font-medium text-white bg-black rounded-sm shadow-sm opacity-0 transition-opacity duration-300 pointer-events-none';
   tooltip.textContent = tooltipContent;

   const arrow = document.createElement('div');
   arrow.className = 'tooltip-arrow absolute w-2 h-2 bg-black transform rotate-[-45deg]';
   
   tooltip.appendChild(arrow);
   document.body.appendChild(tooltip);

   // Usando requestAnimationFrame para posicionamento performático
   const positionTooltip = () => {
      const elementRect = element.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      const arrowRect = arrow.getBoundingClientRect();

      tooltip.style.top = `${window.scrollY + elementRect.top - tooltipRect.height - 8}px`;
      tooltip.style.left = `${window.scrollX + elementRect.left + (elementRect.width / 2) - (tooltipRect.width / 2)}px`;
      arrow.style.bottom = `${-(arrowRect.height / 2)}px`;
      arrow.style.left = '50%';
      arrow.style.marginLeft = `${-(arrowRect.width / 2)}px`;

      // Aplica a opacidade após o posicionamento
      tooltip.style.opacity = '1';
   };

   // Chama o posicionamento
   requestAnimationFrame(positionTooltip);
};

const handleTooltipLeave = () => {
   const tooltip = document.querySelector('.tooltip-element');
   if (tooltip) {
      tooltip.style.opacity = '0';
      setTimeout(() => tooltip.remove(), 300);
   }
};

const rippleEffect = (event) => {
   const btn = event.currentTarget;
   const existingRipple = btn.querySelector(".ripple");
   if (existingRipple) {
      existingRipple.remove();
   }
   
   const circle = document.createElement("span");
   const diameter = Math.max(btn.clientWidth, btn.clientHeight);
   circle.style.width = circle.style.height = `${diameter}px`;
   circle.style.left = `${event.offsetX - diameter / 2}px`;
   circle.style.top = `${event.offsetY - diameter / 2}px`;
   circle.classList.add("ripple");
   
   btn.appendChild(circle);
};

function toggleTip(element) {
   const detail = element.querySelector('.tip-detail');
   document.querySelectorAll('.tip-detail:not(.hidden)').forEach(tip => {
      if (tip !== detail) {
         tip.classList.add('hidden');
         tip.closest('.tip-item').classList.remove('active');
      }
   });
   detail.classList.toggle('hidden');
   element.classList.toggle('active', !detail.classList.contains('hidden'));
}
