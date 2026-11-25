/* ============================================================
   SAMUEL MASSOTERAPIA — Interações
   ============================================================ */

/* ---------- 1. CONFIGURAÇÃO DO WHATSAPP ---------- */
const WHATSAPP_NUMBER = "5511999999999"; // ← troque aqui: 55 + DDD + número
const WHATSAPP_MESSAGE =
  "Oi, Samuel! Vim pelo site e quero agendar uma sessão de massoterapia.";

const waLink = document.getElementById("whatsapp");
if (waLink) {
  waLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    WHATSAPP_MESSAGE
  )}`;
  waLink.target = "_blank";
  waLink.rel = "noopener noreferrer";
  waLink.setAttribute("aria-label", "Agendar sessão pelo WhatsApp com Samuel");
}

/* ---------- 2. HEADER: ESTADO AO ROLAR ---------- */
const header = document.querySelector(".site-header");
if (header) {
  const syncHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });
}

/* ---------- 3. MENU MOBILE ---------- */
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
const MOBILE_BREAKPOINT = 720;

if (menuBtn && nav) {
  const setMenu = (open) => {
    nav.classList.toggle("is-open", open);
    menuBtn.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  };

  menuBtn.addEventListener("click", () => {
    setMenu(!nav.classList.contains("is-open"));
  });

  // Fecha ao clicar em qualquer link do menu
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenu(false);
  });

  // Fecha com ESC
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      setMenu(false);
      menuBtn.focus();
    }
  });

  // Fecha ao voltar para o desktop
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > MOBILE_BREAKPOINT) setMenu(false);
    }, 150);
  });
}

/* ---------- 4. REVEAL AO ROLAR (COM STAGGER) ---------- */
const revealEls = Array.from(document.querySelectorAll("[data-reveal]"));
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (revealEls.length) {
  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    // Agrupa por elemento-pai para aplicar um pequeno atraso em cascata
    const groups = new Map();
    revealEls.forEach((el) => {
      const parent = el.parentElement;
      if (!groups.has(parent)) groups.set(parent, []);
      groups.get(parent).push(el);
    });
    groups.forEach((list) => {
      list.forEach((el, index) => {
        el.style.transitionDelay = `${Math.min(index * 70, 280)}ms`;
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    revealEls.forEach((el) => observer.observe(el));
  } else {
    // Fallback: sem animação
    revealEls.forEach((el) => el.classList.add("is-in"));
  }
}

/* ---------- 5. ANO DINÂMICO NO RODAPÉ ---------- */
const footerNote = document.querySelector(".footer-note");
if (footerNote) {
  const year = new Date().getFullYear();
  footerNote.textContent = footerNote.textContent.replace(/\d{4}/, year);
}

/* ---------- 6. NAVEGAÇÃO SUAVE COM OFFSET DO HEADER ---------- */
// O CSS já define scroll-behavior + scroll-margin-top.
// Este bloco apenas garante compensação caso o header mude de altura.
if ("scrollBehavior" in document.documentElement.style) {
  const headerHeight = () =>
    header ? header.getBoundingClientRect().height : 0;

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    const id = link.getAttribute("href");
    if (!id || id === "#") return;

    const target = document.querySelector(id);
    if (!target) return;

    link.addEventListener("click", (event) => {
      const isSamePage = location.pathname === link.pathname;
      if (!isSamePage) return;

      event.preventDefault();
      const top =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight() -
        16;

      window.scrollTo({ top, behavior: "smooth" });
      history.replaceState(null, "", id);
    });
  });
}