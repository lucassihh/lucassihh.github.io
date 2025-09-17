   document.addEventListener('DOMContentLoaded', () => {
      const tooltipElements = document.querySelectorAll('[data-tooltip-content]');

      tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', (event) => {
          const tooltipContent = event.target.getAttribute('data-tooltip-content');
          
          const tooltip = document.createElement('div');
          tooltip.className = 'absolute z-50 px-3 py-1.5 text-sm font-medium text-white px-2 py-1 bg-black rounded-sm shadow-sm opacity-0 transition-opacity duration-300 pointer-events-none';
          tooltip.textContent = tooltipContent;

          document.body.appendChild(tooltip);

          const elementRect = element.getBoundingClientRect();
          const tooltipRect = tooltip.getBoundingClientRect();

          // Calcula a posição do tooltip com base na posição do elemento
          tooltip.style.top = `${window.scrollY + elementRect.top - tooltipRect.height - 8}px`;
          tooltip.style.left = `${window.scrollX + elementRect.left + (elementRect.width / 2) - (tooltipRect.width / 2)}px`;

          // Adiciona uma pequena seta
          const arrow = document.createElement('div');
          arrow.className = 'absolute w-2 h-2 bg-black transform rotate-[-45deg]';
          arrow.style.bottom = '-4px';
          arrow.style.left = '50%';
          arrow.style.marginLeft = '-4px';
          tooltip.appendChild(arrow);
          
          // Torna o tooltip visível com uma transição
          setTimeout(() => {
            tooltip.style.opacity = '1';
          }, 10);
        });

        element.addEventListener('mouseleave', () => {
          const tooltip = document.querySelector('.absolute.z-50.px-3');
          if (tooltip) {
            tooltip.style.opacity = '0';
            setTimeout(() => {
              tooltip.remove();
            }, 300);
          }
        });
      });
    });
   
   