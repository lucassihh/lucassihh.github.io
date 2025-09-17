const {
   classList
} = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme');
// Função para aplicar o tema e salvar no localStorage
const applyTheme = (theme) => {
   classList.toggle('dark', theme === 'dark');
   localStorage.setItem('theme', theme);
};
// Ao carregar a página, verifica o tema salvo
if (savedTheme) {
   applyTheme(savedTheme);
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
   // Se não houver tema salvo, usa a preferência do sistema do usuário
   applyTheme('dark');
}
// Adiciona o event listener
themeToggle.addEventListener('click', () => {
   const newTheme = classList.contains('dark') ? 'light' : 'dark';
   applyTheme(newTheme);
});