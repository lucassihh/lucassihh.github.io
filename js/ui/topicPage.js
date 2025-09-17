// topicPage.js ES6
// Importações dos módulos necessários
import { languageTopics } from '../../data/topicsData.js'; 
let topics = [];

// Função que cria o HTML para um tópico ATIVO
function createActiveTopicCard(topic) {
    const levelColors = {
        //English
        'Beginner': 'bg-primary/20 text-primary',
        'Intermediate': 'bg-secondary/20 text-secondary',
        'Advanced': 'bg-accent/20 text-accent',
        //Portuguese
        'Iniciante': 'bg-primary/20 text-primary',
        'Intermediário': 'bg-secondary/20 text-secondary',
        'Avançado': 'bg-accent/20 text-accent'
    };

    return `
        <div class="bg-white/10 rounded-xl border border-border/30 hover:scale-105 transition-all duration-300 h-fit relative overflow-hidden" data-id="${topic.id}">
         <div class="absolute top-10 right-0 w-20 h-20 bg-secondary/50 rounded-full blur-3xl animate-pulse-slow"></div>
            <div class="p-4 space-y-6">
                <div class="flex items-start justify-between">
                    <div class="flex items-center gap-4">
                        <div>
                            <h3 class="font-bold text-2xl text-white">
                                ${topic.title}
                            </h3>
                            <p class="text-sm text-white/80 mt-2">${topic.description}</p>
                        </div>
                    </div>
                </div>
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                        <div class="inline-flex items-center rounded-full px-3 py-1 text-xs ${levelColors[topic.level]}">
                            ${topic.level}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Função que cria o HTML para um tópico BLOQUEADO
function createLockedTopicCard(topic) {
    const levelColors = {
        //English
        'Beginner': 'bg-primary/30 text-gray-700/70',
        'Intermediate': 'bg-secondary/20 text-gray-700/70',
        'Advanced': 'bg-accent/20 text-gray-700/70',
        //Portuguese
        'Iniciante': 'bg-primary/20 text-gray-700/70',
        'Intermediário': 'bg-secondary/20 text-gray-700/70',
        'Avançado': 'bg-accent/20 text-gray-700/70'
    };
    
    return `
        <div class="bg-white/10 rounded-xl border border-border/30 h-fit opacity-50" data-id="${topic.id}">
            <div class="p-4 space-y-4">
                <div class="flex items-start justify-between">
                    <div class="flex items-center gap-4">
                        <div>
                            <h3 class="font-bold text-xl text-white/80">
                                ${topic.title}
                            </h3>
                            <p class="text-sm text-white/70 mt-2">${topic.description}</p>
                        </div>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6 text-white">
                        <path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clip-rule="evenodd" />
                    </svg>
                </div>
            </div>
        </div>
    `;
}

// Funções de Renderização
function renderTopics() {
    const topicsGrid = document.getElementById('topicsGrid');
    if (!topicsGrid) {
        console.error("Elemento com ID 'topicsGrid' não encontrado.");
        return;
    }
    topicsGrid.innerHTML = '';
    
    topics.forEach(topic => {
        if (topic.url && topic.url !== '#') {
            topicsGrid.innerHTML += createActiveTopicCard(topic);
        } else {
            topicsGrid.innerHTML += createLockedTopicCard(topic);
        }
    });
}

// Funções de Interatividade
function addTopicInteractivity() {
    const topicsGrid = document.getElementById('topicsGrid');
    if (!topicsGrid) return; 

    topicsGrid.addEventListener('click', function(event) {
        const clickedCard = event.target.closest('[data-id]');
        if (!clickedCard) return;

        const topicId = clickedCard.dataset.id;
        const topic = topics.find(t => t.id == topicId);
        
        if (!topic) return;

        if (topic.url && topic.url !== '#') {
            window.location.href = topic.url;
        } else {
            showComingSoonNotification();
        }
    });
}

// Função Principal que orquestra tudo
export function getTopics(lang) {
    const selectedTopics = languageTopics[lang];

    if (selectedTopics) {
        topics = selectedTopics;
    } else {
        console.error(`Idioma '${lang}' não suportado. Carregando idioma padrão (inglês).`);
        topics = languageTopics['english'];
    }

    renderTopics();
    addTopicInteractivity();
}


function showComingSoonNotification() {
    const notification = document.createElement('div');
    notification.className = 'fixed top-10 right-5 bg-gray-50 border border-white rounded-2xl p-3 shadow-md';
    notification.innerHTML = `
        <div class="flex items-center space-x-2">
            <i class="fas fa-info-circle text-accent"></i>
            <span class="font-medium">Coming soon!</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}