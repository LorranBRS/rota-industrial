// Rota Industrial — service worker (app instalável e leitura offline)
// Ao publicar mudanças no site, aumente VERSAO aqui E em ferramentas/gera_paginas.py (os ?v= precisam bater).
const VERSAO = "rota-v6";
const BASICO = [
  "./", "index.html", "cursos.html", "curso.html", "aula.html", "busca.html", "perfil.html", "ranking.html",
  "certificado.html", "verificar.html", "sobre.html", "offline.html", "manifest.webmanifest",
  "assets/css/style.css?v=6", "assets/js/main.js?v=6", "data/cursos.js?v=6", "data/quizzes.js?v=6",
  "assets/icones/icone-192.png", "assets/icones/icone-512.png", "assets/icones/apple-touch-icon.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSAO).then((c) => c.addAll(BASICO)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((chaves) => Promise.all(chaves.filter((k) => k !== VERSAO).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // só o próprio site (Supabase e outros ficam sempre online) — exceto fontes do Google, que podem ficar em cache
  const fontes = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  if (url.origin !== location.origin && !fontes) return;

  // páginas: rede primeiro (conteúdo sempre novo), cache se estiver sem internet
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req).then((r) => { guardar(req, r.clone(), true); return r; })
        .catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || caches.match("offline.html")))
    );
    return;
  }
  // arquivos (css, js, aulas, diagramas, ícones, fontes): cache primeiro e atualiza em segundo plano
  e.respondWith(
    caches.match(req).then((cache) => {
      const rede = fetch(req).then((r) => { guardar(req, r.clone()); return r; }).catch(() => cache);
      return cache || rede;
    })
  );
});

function guardar(req, resp, semBusca) {
  if (!resp || (resp.status !== 200 && resp.type !== "opaque")) return;
  caches.open(VERSAO).then((c) => {
    if (semBusca) {
      // guarda a página sem os parâmetros (?id=...), já que o conteúdo é montado pelo JS
      const u = new URL(req.url); u.search = "";
      c.put(u.toString(), resp);
    } else c.put(req, resp);
  });
}
