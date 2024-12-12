console.log("Bem-vindo ao meu portfólio!");

// Seleciona o botão de troca de tema
const toggleButton = document.getElementById('trocar-tema');
const body = document.body;

toggleButton.addEventListener('click', () => {
  // Alterna a classe 'dark-theme' para habilitar/desabilitar
  body.classList.toggle('dark-theme');
});

// Seleciona o botão de alternância de currículo e a seção de currículo
const btnCurriculo = document.getElementById('toggle-curriculo');
const curriculoSection = document.getElementById('curriculo-section');

// Alternar a visibilidade da seção de currículo
btnCurriculo.addEventListener('click', () => {
  if (curriculoSection.style.display === 'none' || curriculoSection.style.display === '') {
    curriculoSection.style.display = 'block'; // Exibe a seção
    console.log('Currículo exibido');
  } else {
    curriculoSection.style.display = 'none'; // Oculta a seção
    console.log('Currículo ocultado');
  }
});

const downloadButton = document.getElementById('download-curriculo');

// Clique no botão de download
downloadButton.addEventListener('click', () => {
  // Redireciona o navegador para o arquivo PDF do currículo
  window.location.href = 'CleitonKelitondaSilvaValdevino.pdf';
  console.log('Download do currículo iniciado');
});
