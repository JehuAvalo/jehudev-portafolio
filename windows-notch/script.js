const tabs = document.querySelectorAll('.mode-tabs button');
const modes = document.querySelectorAll('.mode-ui');
const title = document.querySelector('#mode-title');
const copy = document.querySelector('#mode-copy');
const content = {
  island: ['Isla dinámica', 'Una cápsula de cristal flotante que se expande para mostrar letras, controles y progreso.'],
  notch: ['Notch', 'Una silueta negra integrada al borde superior, inspirada en el notch físico de una pantalla.'],
  drop: ['Drop', 'La portada se convierte en un disco compacto que gira mientras tu música se reproduce.']
};
tabs.forEach(tab => tab.addEventListener('click', () => {
  tabs.forEach(item => item.classList.remove('active'));
  modes.forEach(item => item.classList.remove('active'));
  tab.classList.add('active');
  document.querySelector(`.${tab.dataset.mode === 'notch' ? 'notch-mode' : tab.dataset.mode === 'drop' ? 'drop-mode' : 'island'}`).classList.add('active');
  title.textContent = content[tab.dataset.mode][0];
  copy.textContent = content[tab.dataset.mode][1];
}));
document.querySelector('.menu').addEventListener('click', () => document.querySelector('.nav-links').classList.toggle('open'));
