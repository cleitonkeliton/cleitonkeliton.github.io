document.addEventListener('DOMContentLoaded', () => {
  // Menu mobile
  const mobileMenu = document.getElementById('mobile-menu');
  const navList = document.getElementById('nav-list');

  mobileMenu.addEventListener('click', () => {
    navList.classList.toggle('active');
  });

  // Rolagem suave com offset
  document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      const headerHeight = document.querySelector('header').offsetHeight;
      
      window.scrollTo({
        top: targetElement.offsetTop - headerHeight,
        behavior: 'smooth'
      });
      
      navList.classList.remove('active');
    });
  });

  // Tema escuro com localStorage
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  // Carregar tema salvo
  const savedTheme = localStorage.getItem('dark-theme');
  if (savedTheme === 'true') {
    body.classList.add('dark-theme');
    themeToggle.textContent = 'Modo Claro';
  }

  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    const isDark = body.classList.contains('dark-theme');
    localStorage.setItem('dark-theme', isDark);
    themeToggle.textContent = isDark ? 'Modo Claro' : 'Modo Escuro';
  });

  // Formulário de contato
  const contactForm = document.getElementById('contact-form');
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    
    try {
      const response = await fetch('https://formspree.io/f/your-form-id', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        alert('Mensagem enviada com sucesso!');
        contactForm.reset();
      } else {
        throw new Error('Erro ao enviar mensagem');
      }
    } catch (error) {
      alert('Ocorreu um erro. Tente novamente mais tarde.');
    }
  });

  // Inicializar AOS (Animações)
  AOS.init({
    duration: 1000,
    offset: 100,
    once: true
  });

  // Carrossel de Projetos (Swiper)
  const swiper = new Swiper('.swiper-container', {
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });

  // Botão "Voltar ao Topo (não implementado)"
  /*const backToTopButton = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopButton.style.display = 'block';
    } else {
      backToTopButton.style.display = 'none';
    }
  });

  backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });*/
});