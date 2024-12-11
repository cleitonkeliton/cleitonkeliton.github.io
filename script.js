console.log("Bem-vindo ao meu portfólio!");
const toggleButton = document.getElementById('trocar-tema');
const body = document.body;

toggleButton.addEventListener('click', () => {
  body.classList.toggle('dark-theme');
});

const btnCurriculo = document.getElementById('toggle-curriculo');
const curriculoSection = document.getElementById('curriculo-section');

btnCurriculo.addEventListener('click', () => {
  if (curriculoSection.style.display === 'none' || curriculoSection.style.display === '') {
    curriculoSection.style.display = 'block';
    console.log('Currículo exibido');
  } else {
    curriculoSection.style.display = 'none';
    console.log('Currículo ocultado');
  }
});

const downloadButton = document.getElementById('download-curriculo');

downloadButton.addEventListener('click', () => {
  window.location.href = 'CleitonKelitondaSilvaValdevino.png';
  console.log('Download do currículo iniciado');
});

console.log("Tema alternado!");
