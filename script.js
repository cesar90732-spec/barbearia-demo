// Troque pelo número autorizado da barbearia: código do país + DDD + número, somente dígitos.
const WHATSAPP_NUMBER = "5500000000000";
const message = encodeURIComponent("Olá! Gostaria de saber mais sobre os serviços e horários.");
document.querySelectorAll(".wa").forEach(link => {
  link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});

const nav = document.querySelector(".nav");
const toggle = document.querySelector(".menu-toggle");
const fab = document.querySelector(".fab");
const root = document.documentElement;

// Menu mobile
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});
document.querySelectorAll(".links a").forEach(a => a.addEventListener("click", () => {
  nav.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
}));

// Navegação compacta, barra de progresso e botão flutuante
let ticking = false;
function onScroll() {
  const y = window.scrollY;
  const max = root.scrollHeight - innerHeight;
  nav.classList.toggle("scrolled", y > 20);
  fab.classList.toggle("show", y > innerHeight * .7);
  root.style.setProperty("--progress", max > 0 ? (y / max).toFixed(4) : 0);
  ticking = false;
}
addEventListener("scroll", () => {
  if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
}, { passive: true });
onScroll();

// Revelação ao rolar
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .15, rootMargin: "0px 0px -40px 0px" });
document.querySelectorAll("[data-reveal]").forEach(el => revealObserver.observe(el));

// Link ativo no menu conforme a seção visível
const links = [...document.querySelectorAll(".links a")];
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`));
  });
}, { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("main section[id]").forEach(s => sectionObserver.observe(s));

// Contadores animados
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const countObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || "";
    countObserver.unobserve(el);
    if (reduceMotion) { el.textContent = target + suffix; return; }
    const start = performance.now();
    const duration = 1600;
    (function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    })(start);
  });
}, { threshold: .6 });
document.querySelectorAll("[data-count]").forEach(el => countObserver.observe(el));

// Brilho dos cards de serviço seguindo o cursor
document.querySelectorAll(".service").forEach(card => {
  card.addEventListener("pointermove", e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
});

// Galeria: esqueleto até a imagem carregar
document.querySelectorAll(".photo img").forEach(img => {
  const done = () => img.parentElement.classList.add("loaded");
  if (img.complete && img.naturalWidth) done();
  else { img.addEventListener("load", done); img.addEventListener("error", done); }
});
