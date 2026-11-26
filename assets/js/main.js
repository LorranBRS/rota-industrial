// Rota Industrial — scripts compartilhados entre as páginas (v2)
// Tudo do aluno (progresso, XP, recordes, medalhas) fica salvo SÓ neste navegador (localStorage).
// O objeto window.RotaAluno foi pensado para, no futuro, sincronizar com um banco online (ranking geral).
(function () {
  "use strict";
  const dados = window.ROTA || { areas: [], setores: [], cursos: [] };
  const cursos = dados.cursos;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const fmt = (n) => Number(n).toLocaleString("pt-BR");

  // ---------------------------------------------------------------- ícones
  const P = {
    calc: '<rect x="5" y="2.5" width="14" height="19" rx="2"/><rect x="8" y="5.5" width="8" height="4" rx="1"/><path d="M8.5 13h.01M12 13h.01M15.5 13h.01M8.5 16.5h.01M12 16.5h.01M15.5 16.5h.01"/>',
    raio: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    circuito: '<path d="M2 12h4l1.5-4 3 8 3-8 3 8 1.5-4h4"/>',
    casa: '<path d="M3 11 12 4l9 7"/><path d="M5 9.5V20h14V9.5"/><path d="M10 20v-5h4v5"/>',
    loja: '<path d="M3 9l2-5h14l2 5"/><path d="M3 9h18v1a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0z"/><path d="M5 12.5V20h14v-7.5M10 20v-5h4v5"/>',
    painel: '<rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><circle cx="15" cy="9" r="2"/><path d="M8 15h8M8 18h5"/>',
    motor: '<rect x="3" y="7" width="12" height="10" rx="2"/><path d="M15 10h3v4h-3M18 12h3M6 17v3h6v-3M6 7V5h6v2"/>',
    escudo: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="m9 12 2 2 4-4"/>',
    busca: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    trofeu: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 21h8M9 17h6"/>',
    livro: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19a2 2 0 0 1 2-2h13"/>'
  };
  const ico = (n) => `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || P.raio}</svg>`;
  const VISUAL = {
    "matematica-eletricistas": { ico: "calc", c1: "#3a6ea5", c2: "#1c3b62" },
    "fundamentos-eletricidade": { ico: "raio", c1: "#d99a00", c2: "#8a5b00" },
    "seguranca-eletricidade": { ico: "escudo", c1: "#c4473a", c2: "#7a2219" },
    "analise-circuitos-cc": { ico: "circuito", c1: "#5b4bb5", c2: "#2e2370" },
    "instalacoes-residenciais": { ico: "casa", c1: "#2e8a5a", c2: "#155233" },
    "instalacoes-comerciais": { ico: "loja", c1: "#1f7f95", c2: "#0e4756" },
    "comandos-eletricos": { ico: "painel", c1: "#3b4b63", c2: "#18222f" },
    "motores-eletricos": { ico: "motor", c1: "#b25d1f", c2: "#6a330c" }
  };
  const visual = (id) => VISUAL[id] || { ico: "livro", c1: "#17304f", c2: "#0f1d30" };

  // ---------------------------------------------------------------- armazenamento seguro
  function ler(chave, padrao) {
    try { const v = JSON.parse(localStorage.getItem(chave)); return v == null ? padrao : v; } catch (e) { return padrao; }
  }
  function gravar(chave, v) {
    try { localStorage.setItem(chave, JSON.stringify(v)); } catch (e) { /* sem armazenamento */ }
  }

  // ---------------------------------------------------------------- catálogo: utilidades
  function aulasDoCurso(c) {
    const lista = [];
    c.modulos.forEach((mod, mi) => mod.aulas.forEach((titulo, ai) => lista.push({ m: mi + 1, a: ai + 1, k: `${mi + 1}-${ai + 1}`, titulo, modulo: mod.titulo })));
    return lista;
  }
  const totalAulas = (c) => c.modulos.reduce((n, m) => n + m.aulas.length, 0);
  const linkAula = (cid, k) => `aula.html?curso=${encodeURIComponent(cid)}&aula=${k}`;
  const linkCurso = (cid) => `curso.html?id=${encodeURIComponent(cid)}`;
  const acharCurso = (id) => cursos.find((c) => c.id === id);
  const nomeSetor = (id) => (dados.setores.find((s) => s.id === id) || { nome: id }).nome;
  const quizDe = (cid, k) => ((window.ROTA_QUIZ || {})[cid] || {})[k] || null;

  // ---------------------------------------------------------------- níveis e medalhas
  const NIVEIS = [
    [0, "Aprendiz"], [100, "Ajudante"], [300, "Auxiliar de Eletricista"], [600, "Eletricista Iniciante"], [1000, "Eletricista"],
    [1600, "Eletricista Pleno"], [2400, "Técnico"], [3400, "Técnico Sênior"], [4600, "Especialista"], [6000, "Mestre da Rota"]
  ];
  function nivelDe(xp) {
    let i = 0;
    while (i + 1 < NIVEIS.length && xp >= NIVEIS[i + 1][0]) i++;
    const base = NIVEIS[i][0], prox = NIVEIS[i + 1] ? NIVEIS[i + 1][0] : null;
    return { n: i + 1, nome: NIVEIS[i][1], base, prox, pct: prox ? Math.round(((xp - base) / (prox - base)) * 100) : 100 };
  }
  const MEDALHAS = [
    { id: "primeira-aula", ic: "👣", nome: "Primeiro passo", desc: "Concluiu a 1ª aula", ok: (s) => s.aulas >= 1 },
    { id: "dez-aulas", ic: "📚", nome: "Ritmo de obra", desc: "10 aulas concluídas", ok: (s) => s.aulas >= 10 },
    { id: "cinquenta-aulas", ic: "🏃", nome: "Maratonista", desc: "50 aulas concluídas", ok: (s) => s.aulas >= 50 },
    { id: "primeiro-teste", ic: "📝", nome: "Primeira prova", desc: "Terminou um teste", ok: (s) => s.testes >= 1 },
    { id: "gabarito", ic: "✅", nome: "Gabarito", desc: "100 % num teste", ok: (s) => s.perfeitos >= 1 },
    { id: "dez-gabaritos", ic: "🎯", nome: "Mira certa", desc: "10 testes com 100 %", ok: (s) => s.perfeitos >= 10 },
    { id: "seq-5", ic: "🔥", nome: "Esquentando", desc: "5 acertos seguidos", ok: (s) => s.seqMelhor >= 5 },
    { id: "seq-10", ic: "⚡", nome: "Alta tensão", desc: "10 acertos seguidos", ok: (s) => s.seqMelhor >= 10 },
    { id: "seq-25", ic: "🌩️", nome: "Descarga total", desc: "25 acertos seguidos", ok: (s) => s.seqMelhor >= 25 },
    { id: "xp-1000", ic: "💡", nome: "Mil watts", desc: "1.000 XP acumulados", ok: (s) => s.xp >= 1000 },
    { id: "dias-3", ic: "📅", nome: "Constância", desc: "3 dias seguidos estudando", ok: (s) => s.diasMelhor >= 3 },
    { id: "dias-7", ic: "🗓️", nome: "Semana cheia", desc: "7 dias seguidos estudando", ok: (s) => s.diasMelhor >= 7 },
    { id: "seguranca", ic: "🦺", nome: "Segurança em 1º lugar", desc: "Concluiu Segurança em Eletricidade", ok: (s) => s.cursosFeitos.includes("seguranca-eletricidade") },
    { id: "um-curso", ic: "🎓", nome: "Formado", desc: "Concluiu um curso inteiro", ok: (s) => s.cursosFeitos.length >= 1 },
    { id: "trilha", ic: "🏆", nome: "Rota completa", desc: "Concluiu toda a trilha de Elétrica", ok: (s) => s.cursosFeitos.length >= cursos.filter((c) => c.area === "eletrica").length }
  ];
  const XP = { aula: 20, acerto: 10, gabarito: 20, curso: 100 };

  // ---------------------------------------------------------------- aluno (estado persistente)
  const Aluno = (function () {
    const CH = "rota-aluno";
    const novo = () => ({ versao: 1, apelido: "", nomeCertificado: "", xp: 0, seq: 0, seqMelhor: 0, respostas: 0, acertos: 0,
      respondidas: {}, quizzes: {}, medalhas: {}, xpAulas: {}, cursosXp: {}, dias: [], diasMelhor: 0, ultima: null, criado: Date.now() });
    let d = Object.assign(novo(), ler(CH, {}));
    // progresso das aulas (formato antigo, mantido): {"curso/m-a": timestamp}
    let prog = ler("rota-progresso", {});
    const ouvintes = [];

    const hoje = () => { const t = new Date(); return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`; };
    function diasSeguidos() {
      const set = new Set(d.dias);
      let n = 0;
      const t = new Date();
      if (!set.has(hoje())) t.setDate(t.getDate() - 1); // ainda vale se estudou ontem
      for (;;) {
        const k = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
        if (!set.has(k)) break;
        n++; t.setDate(t.getDate() - 1);
      }
      return n;
    }
    function marcarDia() {
      const h = hoje();
      if (!d.dias.includes(h)) { d.dias.push(h); if (d.dias.length > 400) d.dias.shift(); }
      d.diasMelhor = Math.max(d.diasMelhor, diasSeguidos());
    }
    function resumo() {
      const aulas = Object.keys(prog).length;
      const qs = Object.values(d.quizzes);
      const cursosFeitos = cursos.filter((c) => aulasDoCurso(c).every((x) => prog[`${c.id}/${x.k}`])).map((c) => c.id);
      return { xp: d.xp, aulas, testes: qs.length, perfeitos: qs.filter((q) => q.melhor === 100).length, seq: d.seq, seqMelhor: d.seqMelhor,
        diasMelhor: d.diasMelhor, dias: diasSeguidos(), cursosFeitos, respostas: d.respostas, acertos: d.acertos };
    }
    function salvar() {
      // bônus de curso concluído
      const s0 = resumo();
      s0.cursosFeitos.forEach((cid) => {
        if (!d.cursosXp[cid]) { d.cursosXp[cid] = Date.now(); ganhar(XP.curso, `Curso concluído: ${(acharCurso(cid) || {}).titulo}`, "🎓"); }
      });
      const s = resumo();
      MEDALHAS.forEach((m) => {
        if (!d.medalhas[m.id] && m.ok(s)) { d.medalhas[m.id] = Date.now(); toast(m.ic, `Medalha: ${m.nome}`, m.desc); }
      });
      gravar(CH, d);
      gravar("rota-progresso", prog);
      ouvintes.forEach((f) => { try { f(d); } catch (e) { /* ignora */ } });
    }
    function ganhar(n, motivo, ic) {
      const antes = nivelDe(d.xp).n;
      d.xp += n;
      marcarDia();
      toast(ic || "⚡", `+${n} XP`, motivo);
      const nv = nivelDe(d.xp);
      if (nv.n > antes) toast("⬆️", `Nível ${nv.n}: ${nv.nome}`, "Você subiu de nível!");
    }

    return {
      get dados() { return d; },
      get progresso() { return prog; },
      resumo, diasSeguidos,
      aoMudar(f) { ouvintes.push(f); },
      aulaFeita: (cid, k) => !!prog[`${cid}/${k}`],
      alternarAula(cid, k, titulo) {
        const ch = `${cid}/${k}`;
        if (prog[ch]) { delete prog[ch]; }
        else {
          prog[ch] = Date.now();
          if (!d.xpAulas[ch]) { d.xpAulas[ch] = 1; ganhar(XP.aula, `Aula concluída: ${titulo}`, "📘"); }
          marcarDia();
        }
        salvar();
        return !!prog[ch];
      },
      visitar(cid, k, titulo) { d.ultima = { curso: cid, aula: k, titulo, t: Date.now() }; gravar(CH, d); },
      // resposta de uma questão. Só a PRIMEIRA resposta de cada questão vale XP e sequência.
      responder(cid, k, i, certo) {
        const ch = `${cid}/${k}/${i}`;
        if (ch in d.respondidas) return { revisao: true };
        d.respondidas[ch] = certo ? 1 : 0;
        d.respostas++;
        if (certo) {
          d.acertos++; d.seq++; d.seqMelhor = Math.max(d.seqMelhor, d.seq);
          ganhar(XP.acerto, d.seq >= 3 ? `Acerto! Sequência de ${d.seq} 🔥` : "Resposta certa", "✔️");
        } else { d.seq = 0; marcarDia(); }
        salvar();
        return { revisao: false };
      },
      jaRespondida: (cid, k, i) => `${cid}/${k}/${i}` in d.respondidas,
      terminarTeste(cid, k, nota, primeiraVez) {
        const ch = `${cid}/${k}`;
        const q = d.quizzes[ch] || { melhor: 0, tentativas: 0, primeira: nota };
        q.tentativas++; q.ultima = nota; q.melhor = Math.max(q.melhor, nota); q.data = Date.now();
        d.quizzes[ch] = q;
        if (primeiraVez && nota === 100 && !q.bonus) { q.bonus = 1; ganhar(XP.gabarito, "Gabarito na primeira tentativa!", "🎯"); }
        salvar();
        return q;
      },
      notaTeste: (cid, k) => (d.quizzes[`${cid}/${k}`] || null),
      definir(campo, valor) { d[campo] = valor; gravar(CH, d); ouvintes.forEach((f) => f(d)); },
      exportar() { return JSON.stringify({ app: "rota-industrial", versao: 1, aluno: d, progresso: prog }, null, 2); },
      importar(txt) {
        const o = JSON.parse(txt);
        if (!o || o.app !== "rota-industrial" || !o.aluno) throw new Error("Arquivo inválido");
        d = Object.assign(novo(), o.aluno); prog = o.progresso || {};
        gravar(CH, d); gravar("rota-progresso", prog);
      },
      zerar() { d = novo(); prog = {}; gravar(CH, d); gravar("rota-progresso", prog); }
    };
  })();
  window.RotaAluno = Aluno;

  // ---------------------------------------------------------------- avisos (toasts)
  let caixaToasts = null;
  function toast(ic, titulo, texto) {
    if (!document.body) return;
    if (!caixaToasts) { caixaToasts = document.createElement("div"); caixaToasts.className = "toasts"; caixaToasts.setAttribute("aria-live", "polite"); document.body.appendChild(caixaToasts); }
    const t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = `<span class="ic">${ic}</span><div><b>${esc(titulo)}</b>${texto ? `<small>${esc(texto)}</small>` : ""}</div>`;
    caixaToasts.appendChild(t);
    while (caixaToasts.children.length > 4) caixaToasts.firstChild.remove();
    setTimeout(() => { t.classList.add("sai"); setTimeout(() => t.remove(), 320); }, 3200);
  }

  // ---------------------------------------------------------------- cabeçalho e rodapé
  const pagina = document.body.dataset.pagina || "";
  const topo = document.getElementById("topo");
  function chipXp() {
    const nv = nivelDe(Aluno.dados.xp);
    return `<a class="chip-xp" href="perfil.html" title="Nível ${nv.n}: ${esc(nv.nome)}"><span class="nivel-n">${nv.n}</span>${fmt(Aluno.dados.xp)} XP</a>`;
  }
  if (topo) {
    const item = (href, id, txt, icone) => `<a href="${href}" class="${pagina === id ? "ativo" : ""}">${icone ? ico(icone) : ""}${txt}</a>`;
    topo.innerHTML = `<div class="container">
      <a class="logo" href="index.html"><span class="logo-icone"><span>RI</span></span><span>Rota <b>Industrial</b></span></a>
      <nav class="menu" id="menu">
        ${item("index.html", "inicio", "Início")}${item("cursos.html", "cursos", "Cursos")}${item("busca.html", "busca", "Buscar", "busca")}${item("perfil.html", "perfil", "Meu progresso", "trofeu")}${item("sobre.html", "sobre", "Sobre")}
      </nav>
      <span id="chip">${chipXp()}</span>
      <button class="menu-botao" aria-label="Abrir menu" aria-controls="menu">☰</button>
    </div>`;
    topo.querySelector(".menu-botao").addEventListener("click", () => topo.querySelector(".menu").classList.toggle("aberto"));
    Aluno.aoMudar(() => { const c = document.getElementById("chip"); if (c) c.innerHTML = chipXp(); });
  }
  const rodape = document.getElementById("rodape");
  if (rodape) {
    rodape.innerHTML = `<div class="container">
      <div class="colunas">
        <div><a class="logo" href="index.html"><span class="logo-icone"><span>RI</span></span><span>Rota <b>Industrial</b></span></a>
          <p>Cursos práticos de elétrica para os setores industrial, residencial e comercial. Conteúdo introdutório: não substitui as capacitações obrigatórias (como a NR-10).</p></div>
        <div><h4>Estudar</h4><a href="cursos.html">Catálogo de cursos</a><a href="busca.html">Buscar nas aulas</a><a href="perfil.html">Meu progresso</a></div>
        <div><h4>Projeto</h4><a href="sobre.html">Sobre</a><a href="https://github.com/LorranBRS/rota-industrial" target="_blank" rel="noopener">Código no GitHub</a></div>
      </div>
      <div class="linha"><span>© ${new Date().getFullYear()} Rota Industrial</span><span>Feito no Brasil 🇧🇷</span></div>
    </div>`;
  }

  // ---------------------------------------------------------------- componentes
  function estadoCurso(c) {
    const todas = aulasDoCurso(c);
    const feitas = todas.filter((x) => Aluno.aulaFeita(c.id, x.k)).length;
    const notas = todas.map((x) => Aluno.notaTeste(c.id, x.k)).filter(Boolean).map((q) => q.melhor);
    const comTeste = todas.filter((x) => quizDe(c.id, x.k));
    const media = notas.length ? Math.round(notas.reduce((a, b) => a + b, 0) / notas.length) : null;
    const proxima = todas.find((x) => !Aluno.aulaFeita(c.id, x.k)) || todas[0];
    const testesOk = comTeste.every((x) => { const q = Aluno.notaTeste(c.id, x.k); return q && q.melhor >= 70; });
    return { todas, feitas, total: todas.length, pct: Math.round((feitas / todas.length) * 100), media, notas: notas.length, comTeste: comTeste.length, proxima,
      certificado: feitas === todas.length && testesOk, testesOk };
  }
  const seloStatus = (st) => st === "disponivel" ? '<span class="selo selo-ok">Disponível</span>' : '<span class="selo selo-breve">Em breve</span>';

  function cartaoCurso(c, numero) {
    const v = visual(c.id), e = estadoCurso(c);
    return `<a class="cartao cartao-curso" href="${linkCurso(c.id)}">
        <div class="capa" style="--c1:${v.c1};--c2:${v.c2}">${ico(v.ico)}${numero ? `<span class="numero">${String(numero).padStart(2, "0")}</span>` : ""}</div>
        <div class="corpo">
          <div class="selos">${seloStatus(c.status)}<span class="selo">${esc(c.nivel)}</span></div>
          <h3>${esc(c.titulo)}</h3>
          <p>${esc(c.resumo)}</p>
          ${e.feitas ? `<div class="mini-progresso" title="${e.pct}% concluído"><div style="width:${e.pct}%"></div></div>` : ""}
          <div class="rodape"><span>${c.setores.map(nomeSetor).join(" · ")}</span><span>${esc(c.cargaHoraria)} · ${e.total} aulas</span></div>
        </div></a>`;
  }

  // ---------------------------------------------------------------- página inicial
  const elNumeros = document.getElementById("numeros");
  if (elNumeros) {
    const aulas = cursos.reduce((n, c) => n + totalAulas(c), 0);
    const questoes = Object.values(window.ROTA_QUIZ || {}).reduce((n, cq) => n + Object.values(cq).reduce((m, l) => m + l.length, 0), 0);
    elNumeros.innerHTML = `<div><strong>${cursos.length}</strong><span>cursos</span></div><div><strong>${aulas}</strong><span>aulas escritas</span></div>
      <div><strong>${questoes || "180+"}</strong><span>questões com nota</span></div><div><strong>100%</strong><span>gratuito</span></div>`;
  }
  const elTrilha = document.getElementById("trilha");
  if (elTrilha) {
    elTrilha.innerHTML = cursos.filter((c) => c.area === "eletrica").map((c, i) => {
      const e = estadoCurso(c);
      return `<a class="passo ${e.feitas === e.total ? "completo" : ""}" href="${linkCurso(c.id)}">
        <span class="marco">${e.feitas === e.total ? "✓" : i + 1}</span>
        <div><h3>${esc(c.titulo)}</h3><p>${esc(c.nivel)} · ${esc(c.cargaHoraria)} · ${e.total} aulas</p></div>
        <div class="lado">${e.feitas ? `${e.pct}% concluído<div class="mini-progresso"><div style="width:${e.pct}%"></div></div>` : "Começar →"}</div></a>`;
    }).join("");
  }
  const elContinuar = document.getElementById("continuar");
  if (elContinuar) {
    const u = Aluno.dados.ultima, c = u && acharCurso(u.curso);
    if (c) {
      const e = estadoCurso(c), nv = nivelDe(Aluno.dados.xp);
      elContinuar.innerHTML = `<div class="bloco" style="display:flex;gap:18px;align-items:center;flex-wrap:wrap;margin:0">
        <div style="flex:1;min-width:220px"><div class="eyebrow">Continue de onde parou</div><h3 style="margin:0">${esc(u.titulo)}</h3>
        <p class="secao-sub" style="margin:2px 0 0">${esc(c.titulo)} · ${e.pct}% do curso · Nível ${nv.n} (${esc(nv.nome)})</p></div>
        <a class="botao botao-primario" href="${linkAula(c.id, u.aula)}">Continuar aula →</a></div>`;
      elContinuar.classList.remove("oculto");
    }
  }
  const listaAreas = document.getElementById("lista-areas");
  if (listaAreas) {
    listaAreas.innerHTML = dados.areas.map((a) => `
      <${a.ativa ? `a href="cursos.html?area=${a.id}"` : "div"} class="cartao ${a.ativa ? "" : "inativo"}">
        <div class="icone">${a.icone}</div><h3>${esc(a.nome)}</h3><p>${esc(a.descricao)}</p>
        <div class="selos">${a.ativa ? '<span class="selo selo-ok">Disponível</span>' : '<span class="selo selo-breve">Em breve</span>'}</div>
      </${a.ativa ? "a" : "div"}>`).join("");
  }

  // ---------------------------------------------------------------- catálogo
  const catalogo = document.getElementById("catalogo");
  if (catalogo) {
    const params = new URLSearchParams(location.search);
    const area = params.get("area");
    let setorAtivo = params.get("setor") || "todos";
    const filtros = document.getElementById("filtros");
    const opcoes = [{ id: "todos", nome: "Todos" }, ...dados.setores];
    const render = () => {
      filtros.innerHTML = opcoes.map((o) => `<button class="filtro ${o.id === setorAtivo ? "ativo" : ""}" data-setor="${o.id}">${esc(o.nome)}</button>`).join("");
      const lista = cursos.filter((c) => (!area || c.area === area) && (setorAtivo === "todos" || c.setores.includes(setorAtivo)));
      catalogo.innerHTML = lista.length ? lista.map((c) => cartaoCurso(c, cursos.indexOf(c) + 1)).join("") : '<p class="secao-sub">Nenhum curso neste filtro ainda.</p>';
    };
    filtros.addEventListener("click", (e) => { const b = e.target.closest("[data-setor]"); if (b) { setorAtivo = b.dataset.setor; render(); } });
    render();
  }

  // ---------------------------------------------------------------- página de um curso
  const paginaCurso = document.getElementById("pagina-curso");
  if (paginaCurso) {
    const c = acharCurso(new URLSearchParams(location.search).get("id"));
    if (!c) {
      paginaCurso.innerHTML = '<section><div class="container"><h1>Curso não encontrado</h1><a class="botao botao-primario" href="cursos.html">Ver catálogo</a></div></section>';
    } else {
      document.title = `${c.titulo} | Rota Industrial`;
      const areaNome = (dados.areas.find((a) => a.id === c.area) || {}).nome || c.area;
      const e = estadoCurso(c);
      paginaCurso.innerHTML = `
        <div class="pagina-topo"><div class="container curso-resumo">
          <div>
            <div class="migalha"><a href="index.html">Início</a> › <a href="cursos.html?area=${c.area}">${esc(areaNome)}</a> › ${esc(c.titulo)}</div>
            <h1>${esc(c.titulo)}</h1>
            <p>${esc(c.resumo)}</p>
            <div class="selos">${seloStatus(c.status)}<span class="selo">${esc(c.nivel)}</span><span class="selo">${esc(c.cargaHoraria)}</span><span class="selo">${c.modulos.length} módulos · ${e.total} aulas</span><span class="selo">${e.comTeste} testes</span>${c.setores.map((s) => `<span class="selo">${esc(nomeSetor(s))}</span>`).join("")}</div>
          </div>
          <div class="painel-progresso">
            <div class="grande">${e.pct}%</div><div>concluído · ${e.feitas} de ${e.total} aulas</div>
            <div class="progresso"><div class="progresso-barra" style="width:${e.pct}%"></div></div>
            <a class="botao botao-primario" href="${linkAula(c.id, e.proxima.k)}">${e.feitas ? (e.feitas === e.total ? "Revisar o curso" : "Continuar") : "Começar pela 1ª aula"} →</a>
            ${e.certificado ? `<a class="botao botao-secundario" style="margin-top:8px;background:transparent;color:#fff;border-color:rgba(255,255,255,.3)" href="certificado.html?curso=${c.id}">🎓 Ver certificado</a>` : ""}
            <small>${e.media != null ? `Média nos testes: <b>${e.media}%</b> (${e.notas} de ${e.comTeste})` : "Os testes de cada aula valem XP."}<br>Certificado: concluir todas as aulas e tirar 70% ou mais em todos os testes.</small>
          </div>
        </div></div>
        <section><div class="container">
          <div class="secao-cabeca"><div><div class="eyebrow">Conteúdo</div><h2 class="secao-titulo">Módulos e aulas</h2></div>
          <p class="secao-sub">Texto, diagramas e teste com nota em cada aula. Vídeos em produção.</p></div>
          ${c.modulos.map((m, i) => `
            <details class="modulo" ${i === 0 || m.aulas.some((_, ai) => `${i + 1}-${ai + 1}` === e.proxima.k) ? "open" : ""}>
              <summary><span>Módulo ${i + 1} — ${esc(m.titulo)}</span><span class="selo">${m.aulas.filter((_, ai) => Aluno.aulaFeita(c.id, `${i + 1}-${ai + 1}`)).length}/${m.aulas.length}</span></summary>
              <ol>${m.aulas.map((a, ai) => {
                const k = `${i + 1}-${ai + 1}`, q = Aluno.notaTeste(c.id, k);
                return `<li class="${Aluno.aulaFeita(c.id, k) ? "feita" : ""}"><a href="${linkAula(c.id, k)}">${esc(a)}${q ? `<span class="nota ${q.melhor >= 70 ? "boa" : ""}">${q.melhor}%</span>` : ""}</a></li>`;
              }).join("")}</ol>
            </details>`).join("")}
        </div></section>`;
    }
  }

  // ---------------------------------------------------------------- carregar conteúdo das aulas
  function carregarCurso(cid) {
    window.ROTA_AULAS = window.ROTA_AULAS || {};
    if (window.ROTA_AULAS[cid]) return Promise.resolve(window.ROTA_AULAS[cid]);
    return new Promise((ok) => {
      const s = document.createElement("script");
      s.src = `data/aulas/${cid}.js`;
      s.onload = s.onerror = () => ok(window.ROTA_AULAS[cid] || {});
      document.body.appendChild(s);
    });
  }

  // ---------------------------------------------------------------- quiz
  function embaralhar(n, semente) {
    const ordem = [...Array(n).keys()];
    let x = semente || 1;
    const rnd = () => { x = (x * 1103515245 + 12345) % 2147483648; return x / 2147483648; };
    for (let i = n - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [ordem[i], ordem[j]] = [ordem[j], ordem[i]]; }
    return ordem;
  }
  // transforma os <details> numerados do "Teste rápido" em questões de múltipla escolha
  function montarQuiz(artigo, c, k, titulo, aoConcluirAula) {
    const alternativas = quizDe(c.id, k);
    if (!alternativas) return;
    const detalhes = [...artigo.querySelectorAll("details")].filter((d) => /^\s*\d+\./.test((d.querySelector("summary") || {}).textContent || ""));
    if (!detalhes.length || detalhes.length !== alternativas.length) return;
    const questoes = detalhes.map((d) => {
      const sum = d.querySelector("summary");
      const enunciado = sum.innerHTML.replace(/^\s*\d+\.\s*/, "");
      sum.remove();
      return { enunciado, explicacao: d.innerHTML };
    });
    const h2 = [...artigo.querySelectorAll("h2")].find((h) => /teste rápido/i.test(h.textContent));
    const caixa = document.createElement("div");
    caixa.className = "quiz";
    caixa.id = "teste";
    detalhes[0].before(caixa);
    detalhes.forEach((d) => d.remove());
    if (h2) h2.remove();

    let tentativa = 0;
    function iniciar() {
      tentativa++;
      const anterior = Aluno.notaTeste(c.id, k);
      const primeiraVez = !anterior;
      const respostas = new Array(questoes.length).fill(null);
      const revisao = questoes.every((_, i) => Aluno.jaRespondida(c.id, k, i));
      const semente = Date.now() % 100000 + tentativa;
      caixa.innerHTML = `
        <div class="quiz-topo"><h2>📝 Teste rápido</h2>
          <div class="info"><span class="pill">${questoes.length} questões</span>${anterior ? `<span class="pill">Melhor nota: ${anterior.melhor}%</span>` : `<span class="pill">+${XP.acerto} XP por acerto</span>`}<span class="pill fogo" data-seq>🔥 Sequência: ${Aluno.dados.seq}</span></div></div>
        ${revisao ? `<div class="questao" style="font-size:.9rem;color:var(--muted)">Modo revisão: você já respondeu estas questões. A nota melhora o seu recorde, mas não conta XP nem sequência.</div>` : ""}
        ${questoes.map((q, i) => {
          const ordem = embaralhar(4, semente * (i + 3));
          return `<div class="questao" data-i="${i}">
            <div class="enunciado"><span class="n">${i + 1}</span>${q.enunciado}</div>
            <div class="opcoes">${ordem.map((o, j) => `<button class="opcao" data-o="${o}"><span class="letra">${"ABCD"[j]}</span><span>${esc(alternativas[i][o])}</span></button>`).join("")}</div>
          </div>`;
        }).join("")}
        <div class="quiz-resultado oculto"></div>`;

      caixa.querySelectorAll(".questao[data-i]").forEach((el) => {
        el.addEventListener("click", (ev) => {
          const b = ev.target.closest(".opcao");
          if (!b || b.disabled) return;
          const i = Number(el.dataset.i), o = Number(b.dataset.o), certo = o === 0;
          respostas[i] = certo;
          el.querySelectorAll(".opcao").forEach((x) => {
            x.disabled = true;
            if (Number(x.dataset.o) === 0) x.classList.add("certa");
            else if (x === b) x.classList.add("errada");
            else x.classList.add("apagada");
          });
          const r = Aluno.responder(c.id, k, i, certo);
          const exp = document.createElement("div");
          exp.className = "explicacao";
          exp.innerHTML = `${certo ? '<b class="ok">✔ Correto!</b>' : '<b class="nok">✘ Não foi dessa vez.</b>'}${r.revisao ? ' <small style="color:var(--muted)">(revisão)</small>' : ""}${questoes[i].explicacao}`;
          el.appendChild(exp);
          const s = caixa.querySelector("[data-seq]");
          if (s) s.textContent = `🔥 Sequência: ${Aluno.dados.seq}`;
          if (respostas.every((x) => x !== null)) concluir();
        });
      });

      function concluir() {
        const acertos = respostas.filter(Boolean).length;
        const nota = Math.round((acertos / questoes.length) * 100);
        const q = Aluno.terminarTeste(c.id, k, nota, primeiraVez);
        const feita = Aluno.aulaFeita(c.id, k);
        const res = caixa.querySelector(".quiz-resultado");
        res.classList.remove("oculto");
        res.innerHTML = `<div class="placar ${nota >= 70 ? "boa" : ""}">${acertos}/${questoes.length}</div>
          <div class="texto"><b>${nota === 100 ? "Gabarito! 🎯" : nota >= 70 ? "Aprovado neste teste ✔" : "Revise a aula e tente de novo"}</b>
          <p>Nota ${nota}% · melhor nota ${q.melhor}% · ${q.tentativas} tentativa${q.tentativas > 1 ? "s" : ""}</p></div>
          <button class="botao botao-secundario botao-pequeno" data-refazer>↻ Refazer</button>
          ${feita ? "" : `<button class="botao botao-primario botao-pequeno" data-concluir>Concluir aula (+${XP.aula} XP)</button>`}`;
        res.querySelector("[data-refazer]").addEventListener("click", () => { iniciar(); caixa.scrollIntoView({ behavior: "smooth", block: "start" }); });
        const bc = res.querySelector("[data-concluir]");
        if (bc) bc.addEventListener("click", () => { aoConcluirAula(); bc.remove(); });
      }
    }
    iniciar();
  }

  // ---------------------------------------------------------------- página de uma aula
  const paginaAula = document.getElementById("pagina-aula");
  if (paginaAula) {
    const params = new URLSearchParams(location.search);
    const c = acharCurso(params.get("curso"));
    const k = params.get("aula") || "1-1";
    const todas = c ? aulasDoCurso(c) : [];
    const pos = todas.findIndex((x) => x.k === k);
    if (!c || pos < 0) {
      paginaAula.innerHTML = '<section><div class="container"><h1>Aula não encontrada</h1><a class="botao botao-primario" href="cursos.html">Ver catálogo</a></div></section>';
    } else {
      const aula = todas[pos], anterior = todas[pos - 1], seguinte = todas[pos + 1];
      document.title = `${aula.titulo} | ${c.titulo} | Rota Industrial`;
      Aluno.visitar(c.id, k, aula.titulo);
      carregarCurso(c.id).then((A) => render(A[k] || null));

      function lateral() {
        const e = estadoCurso(c);
        return `<a class="lateral-curso" href="${linkCurso(c.id)}">${esc(c.titulo)}</a>
          <div class="lateral-progresso">${e.feitas} de ${e.total} aulas · ${e.pct}%</div>
          <div class="progresso" style="height:6px"><div class="progresso-barra" style="width:${e.pct}%"></div></div>
          ${c.modulos.map((mod, mi) => `<div class="lateral-modulo">Módulo ${mi + 1} — ${esc(mod.titulo)}</div>
            <ol>${mod.aulas.map((t, ai) => {
              const kk = `${mi + 1}-${ai + 1}`;
              return `<li class="${kk === k ? "atual" : ""}"><a href="${linkAula(c.id, kk)}">${Aluno.aulaFeita(c.id, kk) ? '<span class="ok">✓</span>' : `<span>${ai + 1}.</span>`}<span>${esc(t)}</span></a></li>`;
            }).join("")}</ol>`).join("")}`;
      }

      function render(conteudo) {
        const video = conteudo && conteudo.youtube
          ? `<div class="video"><iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(conteudo.youtube)}" title="${esc(aula.titulo)}" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe></div>`
          : `<div class="video video-vazio"><span>🎬</span><p>Vídeo em produção — estude pelo texto abaixo</p></div>`;
        const materiais = conteudo && conteudo.materiais && conteudo.materiais.length
          ? `<h3>Materiais</h3><ul class="materiais">${conteudo.materiais.map((x) => `<li><a href="${x.url}" target="_blank" rel="noopener">📄 ${esc(x.nome)}</a></li>`).join("")}</ul>` : "";
        const temQuiz = !!quizDe(c.id, k);
        paginaAula.innerHTML = `
          <div class="container aula-layout">
            <div class="aula-principal">
              <div class="aula-cabeca">
                <div class="migalha"><a href="index.html">Início</a> › <a href="${linkCurso(c.id)}">${esc(c.titulo)}</a> › Módulo ${aula.m}</div>
                <h1 class="aula-titulo">${esc(aula.titulo)}</h1>
                <div class="aula-meta"><span>Módulo ${aula.m} — ${esc(aula.modulo)}</span><span>Aula ${pos + 1} de ${todas.length}</span>${conteudo && conteudo.duracao ? `<span>⏱ ${esc(conteudo.duracao)}</span>` : ""}${temQuiz ? '<span><a href="#teste">📝 Ir para o teste</a></span>' : ""}</div>
              </div>
              ${video}
              <article class="aula-texto">${conteudo && conteudo.texto ? conteudo.texto : '<p class="secao-sub">O material escrito desta aula ainda está sendo preparado.</p>'}</article>
              ${materiais}
              <div class="aula-acoes"><button class="botao" id="marcar"></button><span class="secao-sub" style="margin:0" id="dica"></span></div>
              <nav class="aula-nav">
                ${anterior ? `<a href="${linkAula(c.id, anterior.k)}"><small>← Anterior</small>${esc(anterior.titulo)}</a>` : ""}
                ${seguinte ? `<a class="seguinte" href="${linkAula(c.id, seguinte.k)}"><small>Próxima →</small>${esc(seguinte.titulo)}</a>` : `<a class="seguinte" href="${linkCurso(c.id)}"><small>Fim do curso</small>Voltar ao curso</a>`}
              </nav>
            </div>
            <aside class="aula-lateral" id="lateral">${lateral()}</aside>
          </div>`;

        const botao = document.getElementById("marcar");
        const atualizarBotao = () => {
          const feita = Aluno.aulaFeita(c.id, k);
          botao.className = `botao ${feita ? "botao-secundario" : "botao-primario"}`;
          botao.textContent = feita ? "✓ Aula concluída (desmarcar)" : `Marcar como concluída (+${XP.aula} XP)`;
          document.getElementById("dica").textContent = feita && seguinte ? "Siga para a próxima aula." : "";
          document.getElementById("lateral").innerHTML = lateral();
        };
        const concluir = () => { if (!Aluno.aulaFeita(c.id, k)) Aluno.alternarAula(c.id, k, aula.titulo); atualizarBotao(); };
        botao.addEventListener("click", () => { Aluno.alternarAula(c.id, k, aula.titulo); atualizarBotao(); });
        atualizarBotao();
        montarQuiz(paginaAula.querySelector(".aula-texto"), c, k, aula.titulo, concluir);
      }
    }
  }

  // ---------------------------------------------------------------- busca
  const paginaBusca = document.getElementById("pagina-busca");
  if (paginaBusca) {
    const campo = document.getElementById("q");
    const saida = document.getElementById("resultados");
    const base = (s) => Array.from(s, (ch) => ch.normalize("NFD")[0].toLowerCase()).join(""); // mesmo comprimento do original
    let indice = null;
    async function montarIndice() {
      saida.innerHTML = '<p class="vazio">Carregando as aulas…</p>';
      const itens = [];
      for (const c of cursos) {
        const A = await carregarCurso(c.id);
        aulasDoCurso(c).forEach((x) => {
          const div = document.createElement("div");
          div.innerHTML = (A[x.k] && A[x.k].texto) || "";
          div.querySelectorAll("figure img").forEach((im) => im.remove());
          const texto = div.textContent.replace(/\s+/g, " ").trim();
          itens.push({ c, x, texto, nt: base(texto), ntit: base(x.titulo) });
        });
      }
      indice = itens;
    }
    function marcar(trecho, termos) {
      let h = esc(trecho);
      termos.forEach((t) => {
        const nb = base(h);
        const partes = []; let i = 0, p;
        while ((p = nb.indexOf(t, i)) >= 0) { partes.push(h.slice(i, p), `<mark>${h.slice(p, p + t.length)}</mark>`); i = p + t.length; }
        partes.push(h.slice(i));
        h = partes.join("");
      });
      return h;
    }
    function buscar(q) {
      const termos = base(q).split(/\s+/).filter((t) => t.length >= 2);
      if (!termos.length) { saida.innerHTML = '<p class="vazio">Digite pelo menos 2 letras. Exemplos: <a href="?q=disjuntor">disjuntor</a>, <a href="?q=estrela triângulo">estrela triângulo</a>, <a href="?q=NR-10">NR-10</a>, <a href="?q=lei de ohm">lei de ohm</a>.</p>'; return; }
      const res = [];
      indice.forEach((it) => {
        if (!termos.every((t) => it.nt.includes(t) || it.ntit.includes(t))) return;
        let pontos = 0;
        termos.forEach((t) => { if (it.ntit.includes(t)) pontos += 20; pontos += Math.min(it.nt.split(t).length - 1, 15); });
        const p = Math.max(0, it.nt.indexOf(termos[0]));
        const ini = Math.max(0, p - 80);
        const trecho = (ini ? "…" : "") + it.texto.slice(ini, p + 160) + "…";
        res.push({ it, pontos, trecho });
      });
      res.sort((a, b) => b.pontos - a.pontos);
      saida.innerHTML = res.length
        ? `<p class="secao-sub">${res.length} aula${res.length > 1 ? "s" : ""} encontrada${res.length > 1 ? "s" : ""} para “${esc(q)}”.</p>` + res.slice(0, 60).map(({ it, trecho }) => `
          <a class="resultado" href="${linkAula(it.c.id, it.x.k)}"><small>${esc(it.c.titulo)} · Módulo ${it.x.m}</small><h3>${marcar(it.x.titulo, termos)}</h3><p>${marcar(trecho, termos)}</p></a>`).join("")
        : `<p class="vazio">Nada encontrado para “${esc(q)}”. Tente outra palavra.</p>`;
    }
    const q0 = new URLSearchParams(location.search).get("q") || "";
    campo.value = q0;
    let espera;
    campo.addEventListener("input", () => { clearTimeout(espera); espera = setTimeout(() => { history.replaceState(null, "", campo.value ? `?q=${encodeURIComponent(campo.value)}` : "busca.html"); buscar(campo.value); }, 200); });
    document.getElementById("form-busca").addEventListener("submit", (e) => { e.preventDefault(); buscar(campo.value); });
    montarIndice().then(() => buscar(q0));
  }

  // ---------------------------------------------------------------- meu progresso (rank pessoal)
  const paginaPerfil = document.getElementById("pagina-perfil");
  if (paginaPerfil) {
    function render() {
      const d = Aluno.dados, s = Aluno.resumo(), nv = nivelDe(d.xp);
      const pctAcerto = s.respostas ? Math.round((s.acertos / s.respostas) * 100) : 0;
      const testes = Object.entries(d.quizzes).map(([ch, q]) => {
        const [cid, k] = ch.split("/"); const c = acharCurso(cid); if (!c) return null;
        const x = aulasDoCurso(c).find((a) => a.k === k); return x ? { c, x, q } : null;
      }).filter(Boolean).sort((a, b) => b.q.melhor - a.q.melhor || a.q.tentativas - b.q.tentativas || b.q.data - a.q.data);
      const rankCursos = cursos.map((c) => ({ c, e: estadoCurso(c) })).filter((r) => r.e.feitas || r.e.notas)
        .map((r) => ({ ...r, pontos: r.e.pct + (r.e.media || 0) })).sort((a, b) => b.pontos - a.pontos);
      const ganhas = MEDALHAS.filter((m) => d.medalhas[m.id]).length;

      paginaPerfil.innerHTML = `
        <div class="pagina-topo" style="padding-bottom:64px"><div class="container perfil-topo">
          <div class="insignia"><div><strong>${nv.n}</strong><small>nível</small></div></div>
          <div>
            <div class="apelido"><input id="apelido" maxlength="24" value="${esc(d.apelido)}" placeholder="Seu apelido" aria-label="Apelido"><span style="color:#9fb0c4;font-size:.85rem">✎ toque para editar</span></div>
            <div><span class="nivel-nome">${esc(nv.nome)}</span> · ${fmt(d.xp)} XP</div>
            <div class="barra-nivel"><div class="progresso"><div class="progresso-barra" style="width:${nv.pct}%"></div></div>
            <small>${nv.prox ? `Faltam ${fmt(nv.prox - d.xp)} XP para o nível ${nv.n + 1} (${esc(NIVEIS[nv.n][1])})` : "Nível máximo alcançado!"}</small></div>
          </div>
        </div></div>
        <div class="container">
          <div class="stats">
            <div class="stat"><span class="ic">⚡</span><div class="v">${fmt(d.xp)}</div><div class="l">XP total</div></div>
            <div class="stat"><span class="ic">📘</span><div class="v">${s.aulas}</div><div class="l">aulas concluídas</div></div>
            <div class="stat"><span class="ic">🎯</span><div class="v">${s.respostas ? pctAcerto + "%" : "—"}</div><div class="l">de acerto (${s.acertos}/${s.respostas})</div></div>
            <div class="stat"><span class="ic">🔥</span><div class="v">${s.seqMelhor}</div><div class="l">melhor sequência (atual ${s.seq})</div></div>
            <div class="stat"><span class="ic">📅</span><div class="v">${s.dias}</div><div class="l">dias seguidos (recorde ${s.diasMelhor})</div></div>
          </div>
          <section style="padding-top:28px">
            <div class="duas-colunas">
              <div>
                <div class="bloco"><h2>🏆 Seus melhores testes</h2><p class="secao-sub">Ranking pessoal das suas notas: melhor nota, depois menos tentativas.</p>
                  ${testes.length ? `<table class="tabela"><thead><tr><th>#</th><th>Aula</th><th>Nota</th><th>Tent.</th></tr></thead><tbody>
                    ${testes.slice(0, 10).map((t, i) => `<tr><td class="pos">${i + 1}</td><td><a href="${linkAula(t.c.id, t.x.k)}">${esc(t.x.titulo)}</a><br><small style="color:var(--muted)">${esc(t.c.titulo)}</small></td><td><b style="color:${t.q.melhor >= 70 ? "var(--ok)" : "var(--erro)"}">${t.q.melhor}%</b></td><td>${t.q.tentativas}</td></tr>`).join("")}
                  </tbody></table>` : '<p class="vazio">Faça o teste rápido de qualquer aula para entrar no ranking.</p>'}
                </div>
                <div class="bloco"><h2>📈 Ranking dos seus cursos</h2><p class="secao-sub">Pontos = % concluído + média nos testes.</p>
                  ${rankCursos.length ? `<table class="tabela"><thead><tr><th>#</th><th>Curso</th><th>Concluído</th><th>Média</th></tr></thead><tbody>
                    ${rankCursos.map((r, i) => `<tr><td class="pos">${i + 1}</td><td><a href="${linkCurso(r.c.id)}">${esc(r.c.titulo)}</a></td><td>${r.e.pct}%</td><td>${r.e.media != null ? r.e.media + "%" : "—"}</td></tr>`).join("")}
                  </tbody></table>` : '<p class="vazio">Conclua aulas para ver seus cursos aqui.</p>'}
                </div>
                <div class="bloco"><h2>🎓 Cursos e certificados</h2><p class="secao-sub">Certificado: todas as aulas concluídas e 70% ou mais em todos os testes do curso.</p>
                  ${cursos.map((c) => { const e = estadoCurso(c); return `<div class="curso-linha"><div><a class="nome" href="${linkCurso(c.id)}">${esc(c.titulo)}</a><small>${e.feitas}/${e.total} aulas · ${e.notas}/${e.comTeste} testes${e.media != null ? ` · média ${e.media}%` : ""}</small></div>
                    <div class="mini-progresso"><div style="width:${e.pct}%"></div></div>
                    <div>${e.certificado ? `<a class="botao botao-primario botao-pequeno" href="certificado.html?curso=${c.id}">Certificado</a>` : `<span class="selo">${e.pct}%</span>`}</div></div>`; }).join("")}
                </div>
              </div>
              <div>
                <div class="bloco"><h2>🏅 Medalhas</h2><p class="secao-sub">${ganhas} de ${MEDALHAS.length} conquistadas.</p>
                  <div class="medalhas">${MEDALHAS.map((m) => `<div class="medalha ${d.medalhas[m.id] ? "ganha" : "bloqueada"}" title="${esc(m.desc)}"><span class="ic">${m.ic}</span><b>${esc(m.nome)}</b><small>${esc(m.desc)}</small></div>`).join("")}</div>
                </div>
                <div class="bloco"><h2>⚡ Como ganhar XP</h2>
                  <table class="tabela"><tbody>
                    <tr><td>Concluir uma aula</td><td><b>+${XP.aula}</b></td></tr>
                    <tr><td>Acertar uma questão (1ª resposta)</td><td><b>+${XP.acerto}</b></td></tr>
                    <tr><td>Gabarito (100%) na 1ª tentativa</td><td><b>+${XP.gabarito}</b></td></tr>
                    <tr><td>Concluir um curso inteiro</td><td><b>+${XP.curso}</b></td></tr>
                  </tbody></table>
                  <p class="secao-sub" style="margin:10px 0 0;font-size:.85rem">A sequência 🔥 conta acertos seguidos na primeira resposta de cada questão. Um erro zera a sequência atual (o recorde fica).</p>
                </div>
                <div class="bloco"><h2>🌐 Ranking geral</h2>
                  <div class="em-breve-box">Em breve: ranking entre todos os alunos, por XP, melhor sequência e notas. Seu apelido será usado lá.</div>
                </div>
                <div class="bloco"><h2>💾 Seus dados</h2><p class="secao-sub">Tudo fica salvo só neste navegador. Baixe uma cópia para levar para outro aparelho.</p>
                  <div style="display:flex;gap:8px;flex-wrap:wrap">
                    <button class="botao botao-secundario botao-pequeno" id="exportar">⬇ Baixar progresso</button>
                    <label class="botao botao-secundario botao-pequeno">⬆ Importar<input type="file" id="importar" accept="application/json,.json" hidden></label>
                    <button class="botao botao-secundario botao-pequeno" id="zerar" style="color:var(--erro)">Zerar tudo</button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>`;

      const ap = document.getElementById("apelido");
      ap.addEventListener("change", () => { Aluno.definir("apelido", ap.value.trim().slice(0, 24)); toast("✎", "Apelido salvo", ap.value.trim()); });
      document.getElementById("exportar").addEventListener("click", () => {
        const blob = new Blob([Aluno.exportar()], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob); a.download = "rota-industrial-progresso.json"; a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      });
      document.getElementById("importar").addEventListener("change", (e) => {
        const f = e.target.files[0]; if (!f) return;
        f.text().then((t) => { try { Aluno.importar(t); toast("✔️", "Progresso importado"); render(); } catch (err) { toast("⚠️", "Arquivo inválido", "Use o arquivo baixado aqui no site."); } });
      });
      document.getElementById("zerar").addEventListener("click", () => {
        if (confirm("Apagar TODO o seu progresso, XP e medalhas deste navegador? Isso não pode ser desfeito (a menos que você tenha baixado uma cópia).")) { Aluno.zerar(); render(); }
      });
    }
    render();
  }

  // ---------------------------------------------------------------- certificado
  const paginaCert = document.getElementById("pagina-certificado");
  if (paginaCert) {
    const c = acharCurso(new URLSearchParams(location.search).get("curso"));
    if (!c) {
      paginaCert.innerHTML = '<section><div class="container"><h1>Curso não encontrado</h1><a class="botao botao-primario" href="perfil.html">Meu progresso</a></div></section>';
    } else {
      const e = estadoCurso(c);
      if (!e.certificado) {
        const faltam = e.todas.filter((x) => !Aluno.aulaFeita(c.id, x.k));
        const baixas = e.todas.filter((x) => quizDe(c.id, x.k)).filter((x) => { const q = Aluno.notaTeste(c.id, x.k); return !q || q.melhor < 70; });
        paginaCert.innerHTML = `<div class="pagina-topo"><div class="container"><div class="migalha"><a href="${linkCurso(c.id)}">${esc(c.titulo)}</a> › Certificado</div><h1>Quase lá!</h1>
          <p>Para liberar o certificado de <b>${esc(c.titulo)}</b>, conclua todas as aulas e tire 70% ou mais em todos os testes.</p></div></div>
          <section><div class="container duas-colunas">
            <div class="bloco"><h2>Aulas a concluir (${faltam.length})</h2>${faltam.length ? `<ul>${faltam.map((x) => `<li><a href="${linkAula(c.id, x.k)}">${esc(x.titulo)}</a></li>`).join("")}</ul>` : '<p class="vazio">Todas concluídas ✔</p>'}</div>
            <div class="bloco"><h2>Testes abaixo de 70% (${baixas.length})</h2>${baixas.length ? `<ul>${baixas.map((x) => { const q = Aluno.notaTeste(c.id, x.k); return `<li><a href="${linkAula(c.id, x.k)}#teste">${esc(x.titulo)}</a> — ${q ? q.melhor + "%" : "não feito"}</li>`; }).join("")}</ul>` : '<p class="vazio">Todos aprovados ✔</p>'}</div>
          </div></section>`;
      } else {
        const d = Aluno.dados;
        const datas = e.todas.map((x) => Aluno.progresso[`${c.id}/${x.k}`] || 0);
        const data = new Date(Math.max(...datas, d.cursosXp[c.id] || 0) || Date.now());
        const codigo = (s) => { let h = 2166136261; for (const ch of s) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619) >>> 0; } return h.toString(36).toUpperCase().padStart(7, "0"); };
        function desenhar() {
          const nome = d.nomeCertificado || d.apelido || "";
          const cod = `RI-${codigo(c.id + "|" + nome + "|" + data.toDateString())}`;
          paginaCert.innerHTML = `<div class="container cert-pagina">
            <div class="cert-acoes"><input id="nome-cert" maxlength="60" placeholder="Seu nome completo" value="${esc(nome)}" aria-label="Nome no certificado">
              <button class="botao botao-primario" id="imprimir">🖨 Imprimir / salvar em PDF</button><a class="botao botao-secundario" href="perfil.html">Meu progresso</a></div>
            <div class="certificado">
              <div class="faixa-cert"></div>
              <div class="marca">⚡ Rota Industrial</div>
              <h1>Certificado de conclusão</h1>
              <p>Certificamos que</p>
              <div class="nome">${esc(nome) || "<span style='color:#b8b2a0'>Seu nome aqui</span>"}</div>
              <p>concluiu o curso livre online</p>
              <p class="curso-nome">${esc(c.titulo)}</p>
              <p>com carga horária de <b>${esc(c.cargaHoraria)}</b>, ${e.total} aulas e média de <b>${e.media}%</b> nos testes de fixação.</p>
              <div class="rodape-cert">
                <div>Concluído em ${data.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}<br>Código: <b>${cod}</b></div>
                <div class="assin">Rota Industrial<br>lorranbrs.github.io/rota-industrial</div>
              </div>
              <div class="aviso">Curso livre de caráter introdutório, sem validade como habilitação profissional. Não substitui treinamentos obrigatórios (ex.: NR-10).</div>
            </div></div>`;
          const inp = document.getElementById("nome-cert");
          inp.addEventListener("change", () => { Aluno.definir("nomeCertificado", inp.value.trim()); desenhar(); });
          document.getElementById("imprimir").addEventListener("click", () => {
            if (inp.value.trim() !== (d.nomeCertificado || d.apelido || "")) { Aluno.definir("nomeCertificado", inp.value.trim()); desenhar(); }
            window.print();
          });
        }
        desenhar();
      }
    }
  }
})();
