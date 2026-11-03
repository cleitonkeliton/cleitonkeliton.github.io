/*
 * Portfólio — Cleiton Keliton
 *
 * Carregado com "defer": roda depois que o HTML foi lido, então todos os
 * elementos já existem. A classe "js" e o tema inicial são aplicados antes,
 * por um script curto no <head> (assim a página não pisca no tema errado).
 */
'use strict';

const root = document.documentElement;
const THEME_KEY = 'dark-theme'; // mesma chave das versões anteriores do site
const THEME_COLOR = { light: '#ffffff', dark: '#0b1120' }; // barra do navegador no celular
const MOBILE_QUERY = '(max-width: 900px)'; // deve bater com o breakpoint do menu no CSS

/* Assina mudanças de uma media query (com alternativa para Safari antigo). */
function onMediaChange(query, callback) {
  const media = window.matchMedia(query);
  if (media.addEventListener) media.addEventListener('change', callback);
  else if (media.addListener) media.addListener(callback);
}

/* ---------- Animação de entrada das seções ---------- */
function initReveal() {
  clearTimeout(window.revealFallback); // o script carregou: cancela a contingência do <head>
  const sections = document.querySelectorAll('[data-reveal]');
  const reveal = (element) => element.classList.add('is-visible');

  // Revela sem animação a seção de destino de um link (#projects etc.). Sem isso, o
  // deslocamento da animação entra no cálculo da rolagem e o título da seção
  // termina escondido atrás do cabeçalho.
  const revealNow = (element) => {
    element.classList.add('reveal-instant', 'is-visible');
    void element.offsetHeight; // aplica o estado final antes de o navegador calcular a rolagem
    element.classList.remove('reveal-instant');
  };
  const sectionFromHash = (hash) => {
    if (!hash || hash.length < 2) return null;
    const element = document.getElementById(decodeURIComponent(hash.slice(1)));
    return element && element.matches('[data-reveal]') ? element : null;
  };

  const initialTarget = sectionFromHash(window.location.hash); // página aberta já com #seção
  if (initialTarget) revealNow(initialTarget);

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    const target = link && sectionFromHash(link.getAttribute('href'));
    if (target) revealNow(target);
  });

  if (!('IntersectionObserver' in window)) {
    sections.forEach(reveal);
    return;
  }

  // Revela cada seção uma única vez, quando ela entra na tela.
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        reveal(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -80px 0px' });

  sections.forEach((section) => observer.observe(section));
}

/* ---------- Tema claro/escuro ---------- */
function readSavedTheme() {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch {
    return null; // armazenamento bloqueado (ex.: modo privado restrito)
  }
}

function applyTheme(isDark) {
  const theme = isDark ? 'dark' : 'light';
  root.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme]);
  document.getElementById('theme-toggle')?.setAttribute('aria-pressed', String(isDark));
}

function initTheme() {
  applyTheme(root.dataset.theme === 'dark'); // sincroniza o botão com o tema aplicado no <head>

  document.getElementById('theme-toggle').addEventListener('click', () => {
    const isDark = root.dataset.theme !== 'dark';
    applyTheme(isDark);
    try {
      localStorage.setItem(THEME_KEY, String(isDark));
    } catch {
      /* sem armazenamento: o tema vale só até recarregar a página */
    }
  });

  // Enquanto o visitante não escolher um tema, acompanha o do sistema operacional.
  onMediaChange('(prefers-color-scheme: dark)', (event) => {
    if (readSavedTheme() === null) applyTheme(event.matches);
  });
}

/* ---------- Menu mobile ---------- */
function initMobileMenu() {
  const button = document.getElementById('mobile-menu');
  const menu = document.getElementById('nav-list');
  const pageContent = [document.querySelector('main'), document.querySelector('footer'), document.querySelector('.back-to-top')];
  const isOpen = () => menu.classList.contains('active');

  function setOpen(open) {
    menu.classList.toggle('active', open);
    button.setAttribute('aria-expanded', String(open)); // o CSS troca o ícone ☰/✕
    // Com o menu aberto, o conteúdo por trás dele não recebe foco nem cliques.
    pageContent.forEach((element) => {
      if (element) element.inert = open;
    });
  }

  button.addEventListener('click', () => setOpen(!isOpen()));

  // Fecha ao escolher um link (a rolagem suave fica por conta do CSS).
  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });

  // Fecha ao clicar fora do menu.
  document.addEventListener('click', (event) => {
    if (isOpen() && !menu.contains(event.target) && !button.contains(event.target)) setOpen(false);
  });

  // Fecha com Esc e devolve o foco ao botão.
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) {
      setOpen(false);
      button.focus();
    }
  });

  // Ao voltar para a largura de desktop, garante o menu fechado.
  onMediaChange(MOBILE_QUERY, (event) => {
    if (!event.matches) setOpen(false);
  });
}

/* ---------- Efeitos de rolagem: sombra do cabeçalho e "voltar ao topo" ---------- */
function initScrollEffects() {
  const header = document.querySelector('header');
  const backToTop = document.querySelector('.back-to-top');
  let scheduled = false;

  const update = () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 8);
    backToTop.classList.toggle('visible', y > 600);
    scheduled = false;
  };

  window.addEventListener('scroll', () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
  update();
}

/* ---------- Destaque, no menu, da seção que está na tela ---------- */
function initScrollSpy() {
  if (!('IntersectionObserver' in window)) return;
  const links = new Map(
    [...document.querySelectorAll('#nav-list a[href^="#"]')].map((link) => [link.getAttribute('href').slice(1), link]),
  );

  // Considera "atual" a seção que cruza a faixa central da tela.
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => link.removeAttribute('aria-current'));
      links.get(entry.target.id)?.setAttribute('aria-current', 'true');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  links.forEach((_, id) => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });
}

/* ---------- Formulário de contato (Formspree) ---------- */
let toastTimer;

function showToast(message, type) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `alert alert-${type} show`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 6000);
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  const submit = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const label = submit.textContent;
    submit.disabled = true;
    submit.textContent = 'Enviando…';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error(`Formspree respondeu ${response.status}`);
      form.reset();
      showToast('Mensagem enviada com sucesso! Obrigado pelo contato.', 'success');
    } catch (error) {
      console.error(error);
      showToast('Não foi possível enviar a mensagem. Tente de novo ou fale comigo pelo e-mail ou WhatsApp no rodapé.', 'error');
    } finally {
      submit.disabled = false;
      submit.textContent = label;
    }
  });
}

/* ---------- Ano atual no rodapé ---------- */
function updateYear() {
  const year = document.getElementById('ano-atual');
  if (year) year.textContent = String(new Date().getFullYear());
}

initReveal();
initContactForm();
initTheme();
initMobileMenu();
initScrollEffects();
initScrollSpy();
updateYear();
