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
    livro: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19a2 2 0 0 1 2-2h13"/>',
    usuario: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    celular: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18h2"/>',
    inicio: '<path d="M3 11 12 4l9 7"/><path d="M5 9.5V20h5v-6h4v6h5V9.5"/>'
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
      const media = qs.length ? Math.round(qs.reduce((n, q) => n + q.melhor, 0) / qs.length) : null;
      return { xp: d.xp, aulas, testes: qs.length, perfeitos: qs.filter((q) => q.melhor === 100).length, seq: d.seq, seqMelhor: d.seqMelhor,
        diasMelhor: d.diasMelhor, dias: diasSeguidos(), cursosFeitos, respostas: d.respostas, acertos: d.acertos, media };
    }
    function salvar() {
      // bônus de curso concluído
      const s0 = resumo();
      s0.cursosFeitos.forEach((cid) => {
        if (!d.cursosXp[cid]) { d.cursosXp[cid] = Date.now(); ganhar(XP.curso, `Curso concluído: ${(acharCurso(cid) || {}).titulo}`, "🎓"); }
      });
      const s = resumo();
      MEDALHAS.forEach((m) => {
        if (!d.medalhas[m.id] && m.ok(s)) { d.medalhas[m.id] = Date.now(); toast(m.ic, `Medalha: ${m.nome}`, m.desc, "medalha"); setTimeout(() => Efeitos.confete(innerWidth - 120, innerHeight - 90, 40), 150); }
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
      if (nv.n > antes) { toast("⬆️", `Nível ${nv.n}: ${nv.nome}`, "Você subiu de nível!"); setTimeout(() => Efeitos.nivel(nv.n, nv.nome), 400); }
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
      zerar() { d = novo(); prog = {}; gravar(CH, d); gravar("rota-progresso", prog); },
      // junta o progresso salvo online (outro aparelho) com o deste navegador, sem perder nada
      mesclar(remoto) {
        if (!remoto) return;
        const r = Object.assign(novo(), remoto.aluno || {});
        const p = remoto.progresso || {};
        Object.keys(p).forEach((ch) => { if (!prog[ch]) prog[ch] = p[ch]; });
        ["xp", "seqMelhor", "respostas", "acertos", "diasMelhor"].forEach((c) => { d[c] = Math.max(d[c] || 0, r[c] || 0); });
        ["respondidas", "medalhas", "xpAulas", "cursosXp"].forEach((c) => { d[c] = Object.assign({}, r[c] || {}, d[c] || {}); });
        Object.entries(r.quizzes || {}).forEach(([ch, q]) => {
          const l = d.quizzes[ch];
          d.quizzes[ch] = !l ? q : Object.assign({}, l, { melhor: Math.max(l.melhor, q.melhor), tentativas: Math.max(l.tentativas, q.tentativas), bonus: l.bonus || q.bonus });
        });
        d.dias = [...new Set([...(r.dias || []), ...d.dias])].sort().slice(-400);
        if (!d.apelido && r.apelido) d.apelido = r.apelido;
        if (!d.nomeCertificado && r.nomeCertificado) d.nomeCertificado = r.nomeCertificado;
        d.certificados = Object.assign({}, r.certificados || {}, d.certificados || {});
        gravar(CH, d); gravar("rota-progresso", prog);
        ouvintes.forEach((f) => { try { f(d); } catch (e) { /* ignora */ } });
      }
    };
  })();
  window.RotaAluno = Aluno;

  // ---------------------------------------------------------------- conta online (Supabase)
  // Sem e-mail e sem senha: o aluno recebe um CÓDIGO DE ACESSO aleatório (o banco guarda só o hash dele).
  // Com o código, o progresso vai para a nuvem, entra no ranking geral e o certificado fica verificável.
  const Online = (function () {
    const URL_API = "https://xwthvkvwastsalravkwv.supabase.co/rest/v1/rpc/";
    const CHAVE = "sb_publishable_m8N4WcwZ-GXfqBb5a8ibxA_G-GIHEi7"; // chave pública (pode ficar no site)
    const CH = "rota-online";
    let estado = ler(CH, {});
    const ERROS = {
      apelido_em_uso: "Esse apelido já está em uso. Escolha outro.",
      apelido_invalido: "Use de 3 a 24 caracteres: letras, números, espaço, ponto, hífen ou _.",
      token_invalido: "Código de acesso inválido.",
      curso_incompleto: "O progresso salvo online ainda não mostra o curso completo. Tente de novo em alguns segundos.",
      nome_invalido: "Digite o nome completo (3 a 80 caracteres).",
      aluno_nao_encontrado: "Código de acesso não encontrado."
    };
    async function rpc(fn, args) {
      let r;
      try {
        r = await fetch(URL_API + fn, { method: "POST", headers: { apikey: CHAVE, "Content-Type": "application/json" }, body: JSON.stringify(args) });
      } catch (e) { throw new Error("Sem conexão com o servidor. Tente de novo."); }
      const j = await r.json().catch(() => null);
      if (!r.ok) { const m = (j && j.message) || "erro"; throw new Error(ERROS[m] || `Erro no servidor (${m}).`); }
      return j;
    }
    function gerarCodigo() {
      const alfa = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // sem 0/O, 1/I/L
      const b = new Uint8Array(32);
      crypto.getRandomValues(b);
      return formatar(Array.from(b, (x) => alfa[x % alfa.length]).join(""));
    }
    const formatar = (s) => String(s || "").toUpperCase().replace(/[^A-Z0-9]/g, "").replace(/(.{4})(?=.)/g, "$1-");
    const resumo = () => {
      const s = Aluno.resumo();
      return { xp: s.xp, nivel: nivelDe(s.xp).n, seqMelhor: s.seqMelhor, media: s.media, testes: s.testes, aulas: s.aulas, diasMelhor: s.diasMelhor };
    };
    const pacote = () => ({ aluno: Aluno.dados, progresso: Aluno.progresso });
    function salvarEstado() { gravar(CH, estado); }

    let timer = null, enviando = null;
    async function enviar() {
      if (!estado.token) return null;
      enviando = rpc("rota_salvar", { p_token: estado.token, p_apelido: Aluno.dados.apelido, p_resumo: resumo(), p_dados: pacote() })
        .then((r) => { estado.ultimoEnvio = Date.now(); estado.erro = null; salvarEstado(); ouvir(); return r; })
        .catch((e) => { estado.erro = e.message; salvarEstado(); ouvir(); throw e; })
        .finally(() => { enviando = null; });
      return enviando;
    }
    const ouvintes = [];
    const ouvir = () => ouvintes.forEach((f) => { try { f(estado); } catch (e) { /* ignora */ } });

    // sincroniza sozinho depois de cada mudança (com uma pequena espera)
    Aluno.aoMudar(() => {
      if (!estado.token) return;
      clearTimeout(timer);
      timer = setTimeout(() => enviar().catch(() => {}), 2500);
    });

    return {
      get ativo() { return !!estado.token; },
      get estado() { return estado; },
      aoMudar(f) { ouvintes.push(f); },
      rpc, formatar,
      enviar,
      async aguardar() { if (enviando) { try { await enviando; } catch (e) { /* ignora */ } } },
      async participar(apelido) {
        const token = gerarCodigo();
        const antes = Aluno.dados.apelido;
        Aluno.definir("apelido", apelido);
        estado = { token };
        try { await enviar(); }
        catch (e) { estado = {}; salvarEstado(); Aluno.definir("apelido", antes); throw e; }
        salvarEstado(); ouvir();
        return token;
      },
      async entrar(codigo) {
        const token = formatar(codigo);
        const r = await rpc("rota_carregar", { p_token: token });
        if (!r) throw new Error("Código de acesso não encontrado.");
        Aluno.mesclar(r.dados);
        Aluno.definir("apelido", r.apelido);
        estado = { token }; salvarEstado();
        await enviar();
        return r;
      },
      sair() { estado = {}; salvarEstado(); ouvir(); },
      async apagar() {
        await rpc("rota_apagar", { p_token: estado.token });
        estado = {}; salvarEstado();
        const d = Aluno.dados; d.certificados = {}; Aluno.definir("certificados", {});
        ouvir();
      }
    };
  })();
  window.RotaOnline = Online;
  if (Online.ativo) {
    // atualiza o ranking a cada visita (no máximo a cada 10 min)
    if (!Online.estado.ultimoEnvio || Date.now() - Online.estado.ultimoEnvio > 600000) setTimeout(() => Online.enviar().catch(() => {}), 1200);
  }

  // ---------------------------------------------------------------- avisos (toasts)
  let caixaToasts = null;
  function toast(ic, titulo, texto, tipo) {
    if (!document.body) return;
    if (!caixaToasts) { caixaToasts = document.createElement("div"); caixaToasts.className = "toasts"; caixaToasts.setAttribute("aria-live", "polite"); document.body.appendChild(caixaToasts); }
    const t = document.createElement("div");
    t.className = `toast${tipo ? " toast-" + tipo : ""}`;
    t.innerHTML = `<span class="ic">${ic}</span><div><b>${esc(titulo)}</b>${texto ? `<small>${esc(texto)}</small>` : ""}</div>`;
    caixaToasts.appendChild(t);
    while (caixaToasts.children.length > 4) caixaToasts.firstChild.remove();
    setTimeout(() => { t.classList.add("sai"); setTimeout(() => t.remove(), 320); }, 3200);
  }

  // ---------------------------------------------------------------- animações e efeitos
  const Efeitos = (function () {
    const calmo = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const CORES = ["#f5b300", "#ffd34d", "#1f8a4c", "#4cc283", "#2563a8", "#ffffff", "#c4473a"];
    // confete saindo de um ponto (x, y) da tela; sem ponto = do topo
    function confete(x, y, qtd) {
      if (calmo() || !document.body.animate) return;
      const n = qtd || 90;
      const cx = x == null ? innerWidth / 2 : x, cy = y == null ? innerHeight * 0.35 : y;
      for (let i = 0; i < n; i++) {
        const p = document.createElement("i");
        p.className = "confete";
        const tam = 6 + Math.random() * 7;
        p.style.cssText = `left:${cx}px;top:${cy}px;width:${tam}px;height:${tam * (Math.random() < .5 ? .45 : 1)}px;background:${CORES[i % CORES.length]};border-radius:${Math.random() < .3 ? "50%" : "2px"}`;
        document.body.appendChild(p);
        const ang = Math.random() * Math.PI * 2, forca = 120 + Math.random() * 260;
        const dx = Math.cos(ang) * forca, dy = Math.sin(ang) * forca - 160;
        const queda = 320 + Math.random() * 380, giro = (Math.random() - .5) * 1080;
        p.animate([
          { transform: "translate(-50%,-50%) rotate(0)", opacity: 1 },
          { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${giro / 2}deg)`, opacity: 1, offset: .35 },
          { transform: `translate(calc(-50% + ${dx * 1.3}px), calc(-50% + ${dy + queda}px)) rotate(${giro}deg)`, opacity: 0 }
        ], { duration: 1400 + Math.random() * 900, easing: "cubic-bezier(.2,.7,.4,1)", fill: "forwards" }).onfinish = () => p.remove();
      }
    }
    function confeteDe(el, qtd) { const r = el.getBoundingClientRect(); confete(r.left + r.width / 2, r.top + r.height / 2, qtd); }
    // "+10 XP" subindo a partir de um elemento
    function voarXp(el, texto) {
      if (calmo() || !el || !document.body.animate) return;
      const r = el.getBoundingClientRect();
      const v = document.createElement("span");
      v.className = "xp-voa";
      v.textContent = texto;
      v.style.left = `${r.left + r.width - 40}px`;
      v.style.top = `${r.top + r.height / 2}px`;
      document.body.appendChild(v);
      v.animate([
        { transform: "translate(-50%,-50%) scale(.6)", opacity: 0 },
        { transform: "translate(-50%,-110%) scale(1.15)", opacity: 1, offset: .25 },
        { transform: "translate(-50%,-320%) scale(1)", opacity: 0 }
      ], { duration: 1200, easing: "ease-out", fill: "forwards" }).onfinish = () => v.remove();
    }
    // reinicia uma animação CSS de "pulsar" num elemento
    function pulsar(el, classe) {
      if (!el) return;
      const c = classe || "pulsa";
      el.classList.remove(c); void el.offsetWidth; el.classList.add(c);
    }
    // número contando de 0 até o valor (mantém o formato: "1.234", "67%")
    function contar(el, dur) {
      if (!el || el.dataset.contado) return;
      const txt = el.textContent.trim();
      const m = txt.match(/^([^0-9]*)([0-9][0-9.]*)(.*)$/);
      if (!m) return;
      el.dataset.contado = "1";
      const alvo = Number(m[2].replace(/\./g, ""));
      if (!alvo || calmo()) return;
      const t0 = performance.now(), d = dur || 1100;
      const passo = (t) => {
        const k = Math.min(1, (t - t0) / d), e = 1 - Math.pow(1 - k, 3);
        el.textContent = m[1] + Math.round(alvo * e).toLocaleString("pt-BR") + m[3];
        if (k < 1) requestAnimationFrame(passo); else el.textContent = txt;
      };
      requestAnimationFrame(passo);
    }
    // celebração de subir de nível (tela cheia, some sozinha)
    function nivel(n, nome) {
      const f = document.createElement("div");
      f.className = "celebra";
      f.innerHTML = `<div class="celebra-cartao"><div class="raios"></div><div class="insignia grande"><div><strong>${n}</strong><small>nível</small></div></div>
        <div class="celebra-titulo">Subiu de nível!</div><div class="celebra-nome">${esc(nome)}</div><small>toque para continuar</small></div>`;
      document.body.appendChild(f);
      requestAnimationFrame(() => f.classList.add("aberta"));
      setTimeout(() => confete(innerWidth / 2, innerHeight / 2, 140), 250);
      const fechar = () => { f.classList.remove("aberta"); setTimeout(() => f.remove(), 350); };
      f.addEventListener("click", fechar);
      setTimeout(fechar, 4200);
    }
    // entrada suave dos blocos ao rolar a página
    let obs = null;
    const SELETOR = ".cartao, .passo, .bloco, .modulo, .resultado, .stat, .diagrama, .secao-titulo, .quiz, .aula-texto table, .medalha, .curso-linha";
    function revelar(raiz) {
      if (!obs) return;
      const contagem = new Map();
      (raiz || document).querySelectorAll(SELETOR).forEach((el) => {
        if (el.dataset.rev || el.closest(".hero")) return;
        el.dataset.rev = "1";
        const pai = el.parentElement, i = contagem.get(pai) || 0;
        contagem.set(pai, i + 1);
        el.style.transitionDelay = `${Math.min(i, 8) * 60}ms`;
        el.classList.add("revelar");
        obs.observe(el);
      });
    }
    if ("IntersectionObserver" in window && !calmo()) {
      let disparou = false;
      // garantia: se o observador nunca responder (navegador antigo/aba em segundo plano), mostra tudo
      setTimeout(() => { if (!disparou) document.querySelectorAll(".revelar").forEach((el) => el.classList.add("visivel")); }, 3000);
      obs = new IntersectionObserver((ents) => ents.forEach((e) => {
        disparou = true;
        if (e.isIntersecting) {
          e.target.classList.add("visivel");
          e.target.querySelectorAll(".v, .grande, .placar").forEach((n) => contar(n));
          obs.unobserve(e.target);
          setTimeout(() => { e.target.style.transitionDelay = ""; }, 900);
        }
      }), { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
      const main = document.querySelector("main");
      if (main && "MutationObserver" in window) {
        let fila = false;
        new MutationObserver(() => { if (!fila) { fila = true; requestAnimationFrame(() => { fila = false; revelar(main); }); } })
          .observe(main, { childList: true, subtree: true });
      }
    }
    return { confete, confeteDe, voarXp, pulsar, contar, nivel, revelar, calmo };
  })();
  window.RotaEfeitos = Efeitos;

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
        ${item("index.html", "inicio", "Início")}${item("cursos.html", "cursos", "Cursos")}${item("busca.html", "busca", "Buscar", "busca")}${item("ranking.html", "ranking", "Ranking", "trofeu")}${item("perfil.html", "perfil", "Meu progresso")}${item("sobre.html", "sobre", "Sobre")}
      </nav>
      <span id="chip">${chipXp()}</span>
      <button class="menu-botao" aria-label="Abrir menu" aria-controls="menu">☰</button>
    </div>`;
    topo.querySelector(".menu-botao").addEventListener("click", () => topo.querySelector(".menu").classList.toggle("aberto"));
    let xpAntes = Aluno.dados.xp;
    Aluno.aoMudar(() => {
      const c = document.getElementById("chip"); if (!c) return;
      c.innerHTML = chipXp();
      if (Aluno.dados.xp !== xpAntes) { Efeitos.pulsar(c.firstElementChild, "pulsa"); xpAntes = Aluno.dados.xp; }
    });
  }
  const rodape = document.getElementById("rodape");
  if (rodape) {
    rodape.innerHTML = `<div class="container">
      <div class="colunas">
        <div><a class="logo" href="index.html"><span class="logo-icone"><span>RI</span></span><span>Rota <b>Industrial</b></span></a>
          <p>Cursos práticos de elétrica para os setores industrial, residencial e comercial. Conteúdo introdutório: não substitui as capacitações obrigatórias (como a NR-10).</p></div>
        <div><h4>Estudar</h4><a href="cursos.html">Catálogo de cursos</a><a href="busca.html">Buscar nas aulas</a><a href="perfil.html">Meu progresso</a><a href="ranking.html">Ranking</a><a href="verificar.html">Verificar certificado</a></div>
        <div><h4>Projeto</h4><a href="sobre.html">Sobre</a><a href="https://github.com/LorranBRS/rota-industrial" target="_blank" rel="noopener">Código no GitHub</a></div>
      </div>
      <div class="linha"><span>© ${new Date().getFullYear()} Rota Industrial</span><span>Feito no Brasil 🇧🇷</span></div>
    </div>`;
  }

  // ---------------------------------------------------------------- versão para celular (app instalável / PWA)
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => { /* sem app offline */ }));
  }
  const Instalar = (function () {
    const ua = navigator.userAgent || "";
    const ios = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const android = /android/i.test(ua);
    const celular = ios || android || window.matchMedia("(max-width: 820px)").matches;
    const instalado = () => window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
    let pedido = null; // evento beforeinstallprompt (Chrome/Edge/Samsung)
    const ouvintes = [];
    const avisar = () => ouvintes.forEach((f) => f());
    window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); pedido = e; avisar(); });
    window.addEventListener("appinstalled", () => { pedido = null; gravar("rota-app-instalado", 1); toast("📲", "App instalado!", "Procure o ícone Rota Industrial na tela inicial."); avisar(); });

    function modal() {
      const ja = document.getElementById("modal-instalar");
      if (ja) ja.remove();
      const passos = ios
        ? `<ol class="passos-instalar">
            <li>Abra este site no <b>Safari</b> (no iPhone, só ele instala apps da web).</li>
            <li>Toque no botão <b>Compartilhar</b> <span class="ic-ios">⬆︎</span> na barra de baixo.</li>
            <li>Role e toque em <b>“Adicionar à Tela de Início”</b>.</li>
            <li>Toque em <b>Adicionar</b>. Pronto: o ícone ⚡ aparece na tela do celular.</li></ol>`
        : `<ol class="passos-instalar">
            <li>Abra o <b>menu do navegador</b> (os três pontinhos <b>⋮</b> no canto).</li>
            <li>Toque em <b>“Instalar app”</b> ou <b>“Adicionar à tela inicial”</b>.</li>
            <li>Confirme. O ícone ⚡ Rota Industrial aparece na tela do celular.</li></ol>
            <p class="nota-mini">Funciona melhor no Chrome. No computador, procure o ícone de instalar na barra de endereço.</p>`;
      const m = document.createElement("div");
      m.id = "modal-instalar";
      m.className = "modal-fundo";
      m.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-labelledby="mi-titulo">
          <button class="modal-fechar" aria-label="Fechar">✕</button>
          <img src="assets/icones/icone-192.png" alt="" width="64" height="64" style="border-radius:16px">
          <h2 id="mi-titulo">Instale o app no celular</h2>
          <p class="secao-sub" style="margin:0 0 8px">Fica como um aplicativo: ícone na tela inicial, abre em tela cheia e as aulas já abertas funcionam sem internet.</p>
          ${passos}
          <button class="botao botao-primario" style="width:100%" data-fechar>Entendi</button>
        </div>`;
      document.body.appendChild(m);
      const fechar = () => m.remove();
      m.addEventListener("click", (e) => { if (e.target === m || e.target.closest(".modal-fechar,[data-fechar]")) fechar(); });
      document.addEventListener("keydown", function esc(e) { if (e.key === "Escape") { fechar(); document.removeEventListener("keydown", esc); } });
    }

    return {
      ios, celular,
      get instalado() { return instalado(); },
      get disponivel() { return !instalado(); },
      aoMudar(f) { ouvintes.push(f); },
      async instalar() {
        if (pedido) {
          pedido.prompt();
          const r = await pedido.userChoice.catch(() => null);
          pedido = null; avisar();
          if (r && r.outcome === "dismissed") toast("📲", "Instalação cancelada", "Você pode instalar depois pelo botão Instalar app.");
          return;
        }
        modal();
      }
    };
  })();
  window.RotaInstalar = Instalar;
  if (Instalar.instalado) document.documentElement.classList.add("modo-app");

  // botão "Instalar app" no cabeçalho e no menu
  if (topo && Instalar.disponivel) {
    const menu = topo.querySelector(".menu");
    const b = document.createElement("a");
    b.href = "#instalar";
    b.className = "menu-instalar";
    b.innerHTML = `${ico("celular")}Instalar app`;
    b.addEventListener("click", (e) => { e.preventDefault(); Instalar.instalar(); });
    menu.appendChild(b);
    Instalar.aoMudar(() => { if (Instalar.instalado) b.remove(); });
  }

  // barra de navegação inferior (só no celular, via CSS)
  if (topo) {
    const nav = document.createElement("nav");
    nav.className = "barra-app";
    nav.setAttribute("aria-label", "Navegação principal");
    const it = (href, id, txt, icone) => `<a href="${href}" class="${pagina === id ? "ativo" : ""}">${ico(icone)}<span>${txt}</span></a>`;
    nav.innerHTML = it("index.html", "inicio", "Início", "inicio") + it("cursos.html", "cursos", "Cursos", "livro") + it("busca.html", "busca", "Buscar", "busca")
      + it("ranking.html", "ranking", "Ranking", "trofeu") + it("perfil.html", "perfil", "Progresso", "usuario");
    document.body.appendChild(nav);
    document.body.classList.add("com-barra-app");
  }

  // botão "Instalar app" no topo da página inicial (só no celular)
  const acoesHero = document.querySelector(".hero .acoes");
  if (acoesHero && Instalar.disponivel && Instalar.celular) {
    const b = document.createElement("button");
    b.className = "botao botao-secundario";
    b.innerHTML = "📲 Instalar app";
    b.addEventListener("click", () => Instalar.instalar());
    acoesHero.appendChild(b);
    Instalar.aoMudar(() => { if (Instalar.instalado) b.remove(); });
  }

  // cartão "instale o app" na página inicial (celular, ainda não instalado, não dispensado)
  const elApp = document.getElementById("cartao-app");
  if (elApp && Instalar.disponivel && !ler("rota-app-dispensado", 0)) {
    elApp.innerHTML = `<div class="cartao-app">
        <img src="assets/icones/icone-192.png" alt="" width="56" height="56">
        <div class="txt"><b>Leve a Rota Industrial no bolso</b><span>Instale o app: ícone na tela inicial, tela cheia e aulas offline.</span></div>
        <button class="botao botao-primario botao-pequeno" data-instalar>📲 Instalar app</button>
        <button class="dispensar" aria-label="Dispensar" data-dispensar>✕</button>
      </div>`;
    elApp.classList.remove("oculto");
    elApp.querySelector("[data-instalar]").addEventListener("click", () => Instalar.instalar());
    elApp.querySelector("[data-dispensar]").addEventListener("click", () => { gravar("rota-app-dispensado", 1); elApp.classList.add("oculto"); });
    Instalar.aoMudar(() => { if (Instalar.instalado) elApp.classList.add("oculto"); });
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

  // ---------------------------------------------------------------- bloco "conta online" (perfil e ranking)
  function blocoOnline(el, aoMudarConta) {
    if (!el) return;
    const hora = (t) => t ? new Date(t).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : "—";
    function desenhar() {
      const st = Online.estado;
      if (!Online.ativo) {
        el.innerHTML = `<h2>🌐 Ranking geral online</h2>
          <p class="secao-sub">Entre no ranking com os outros alunos e salve seu progresso na nuvem. <b>Sem e-mail e sem senha</b>: você recebe um código de acesso para usar em outro aparelho.</p>
          <div class="form-linha"><input id="on-apelido" maxlength="24" placeholder="Seu apelido no ranking" value="${esc(Aluno.dados.apelido)}" aria-label="Apelido">
          <button class="botao botao-primario botao-pequeno" id="on-participar">Participar</button></div>
          <p class="nota-mini">No ranking aparecem só o apelido, o nível e os pontos. Você pode apagar sua conta online quando quiser.</p>
          <details class="ja-tenho"><summary>Já tenho um código de acesso</summary>
            <div class="form-linha"><input id="on-codigo" placeholder="XXXX-XXXX-XXXX-…" autocomplete="off" spellcheck="false" aria-label="Código de acesso">
            <button class="botao botao-secundario botao-pequeno" id="on-entrar">Entrar</button></div>
          </details>
          <p class="erro-msg" id="on-erro" role="alert"></p>`;
        const erro = el.querySelector("#on-erro");
        el.querySelector("#on-participar").addEventListener("click", async (ev) => {
          const b = ev.currentTarget; b.disabled = true; erro.textContent = "";
          try {
            await Online.participar(el.querySelector("#on-apelido").value.trim());
            toast("🌐", "Você entrou no ranking!", "Guarde seu código de acesso.");
            if (aoMudarConta) aoMudarConta(); else desenhar();
          } catch (e) { erro.textContent = e.message; b.disabled = false; }
        });
        el.querySelector("#on-entrar").addEventListener("click", async (ev) => {
          const b = ev.currentTarget; b.disabled = true; erro.textContent = "";
          try {
            const r = await Online.entrar(el.querySelector("#on-codigo").value);
            toast("✔️", `Bem-vindo de volta, ${r.apelido}!`, "Progresso deste aparelho e da nuvem foram juntados.");
            if (aoMudarConta) aoMudarConta(); else desenhar();
          } catch (e) { erro.textContent = e.message; b.disabled = false; }
        });
        return;
      }
      el.innerHTML = `<h2>🌐 Conta online ativa <span class="selo selo-ok">no ranking</span></h2>
        <p class="secao-sub">Apelido: <b>${esc(Aluno.dados.apelido)}</b> · ${st.erro ? `<span style="color:var(--erro)">⚠ ${esc(st.erro)}</span>` : `sincronizado em ${hora(st.ultimoEnvio)}`}</p>
        <div class="codigo-acesso"><span>Código de acesso</span><code id="on-cod">${"••••-".repeat(7)}••••</code>
          <button class="botao botao-secundario botao-pequeno" id="on-ver">Mostrar</button><button class="botao botao-secundario botao-pequeno" id="on-copiar">Copiar</button></div>
        <p class="nota-mini">⚠ Guarde este código (anote ou salve no celular). Ele é a <b>única forma</b> de recuperar seu progresso em outro aparelho. Não compartilhe.</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">
          <button class="botao botao-secundario botao-pequeno" id="on-sync">↻ Sincronizar agora</button>
          <a class="botao botao-secundario botao-pequeno" href="ranking.html">Ver ranking</a>
          <button class="botao botao-secundario botao-pequeno" id="on-sair">Sair deste aparelho</button>
          <button class="botao botao-secundario botao-pequeno" id="on-apagar" style="color:var(--erro)">Apagar conta online</button>
        </div>`;
      let visivel = false;
      el.querySelector("#on-ver").addEventListener("click", (ev) => {
        visivel = !visivel;
        el.querySelector("#on-cod").textContent = visivel ? st.token : `${"••••-".repeat(7)}••••`;
        ev.currentTarget.textContent = visivel ? "Ocultar" : "Mostrar";
      });
      el.querySelector("#on-copiar").addEventListener("click", () => {
        (navigator.clipboard ? navigator.clipboard.writeText(st.token) : Promise.reject()).then(() => toast("📋", "Código copiado")).catch(() => { el.querySelector("#on-cod").textContent = st.token; });
      });
      el.querySelector("#on-sync").addEventListener("click", () => Online.enviar().then(() => toast("☁️", "Sincronizado")).catch((e) => toast("⚠️", "Falha ao sincronizar", e.message)));
      el.querySelector("#on-sair").addEventListener("click", () => {
        if (confirm("Sair da conta online neste aparelho? O progresso continua aqui e na nuvem. Para voltar, você vai precisar do código de acesso.")) { Online.sair(); desenhar(); }
      });
      el.querySelector("#on-apagar").addEventListener("click", async () => {
        if (!confirm("Apagar sua conta online? Seu nome sai do ranking e os certificados registrados deixam de ser verificáveis. O progresso neste aparelho continua. Isso não pode ser desfeito.")) return;
        try { await Online.apagar(); toast("🗑", "Conta online apagada"); desenhar(); } catch (e) { toast("⚠️", "Não foi possível apagar", e.message); }
      });
    }
    Online.aoMudar(() => { if (document.body.contains(el)) desenhar(); });
    desenhar();
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
          if (certo && !r.revisao) Efeitos.voarXp(b, `+${XP.acerto} XP`);
          if (!certo) Efeitos.pulsar(b, "treme");
          const s = caixa.querySelector("[data-seq]");
          if (s) { s.textContent = `🔥 Sequência: ${Aluno.dados.seq}`; if (certo && !r.revisao) Efeitos.pulsar(s, "pulsa"); }
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
        Efeitos.pulsar(res.querySelector(".placar"), "estoura");
        if (nota === 100) setTimeout(() => Efeitos.confeteDe(res.querySelector(".placar"), 120), 200);
        else if (nota >= 70) setTimeout(() => Efeitos.confeteDe(res.querySelector(".placar"), 40), 200);
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
        botao.addEventListener("click", () => {
          const feita = Aluno.alternarAula(c.id, k, aula.titulo);
          atualizarBotao();
          if (feita) { Efeitos.confeteDe(botao, 50); Efeitos.pulsar(botao, "estoura"); }
        });
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
                <div class="bloco" id="bloco-online"></div>
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
      ap.addEventListener("change", async () => {
        const novo = ap.value.trim().slice(0, 24), antigo = Aluno.dados.apelido;
        Aluno.definir("apelido", novo);
        if (Online.ativo) {
          try { await Online.enviar(); toast("✎", "Apelido salvo", "Também no ranking geral."); }
          catch (e) { Aluno.definir("apelido", antigo); ap.value = antigo; toast("⚠️", "Apelido não alterado", e.message); }
        } else toast("✎", "Apelido salvo", novo);
      });
      blocoOnline(document.getElementById("bloco-online"), render);
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

  // ---------------------------------------------------------------- ranking geral (online)
  const paginaRanking = document.getElementById("pagina-ranking");
  if (paginaRanking) {
    const TIPOS = [
      { id: "xp", nome: "Geral", rot: "XP", desc: "Todo o XP acumulado." },
      { id: "semana", nome: "Esta semana", rot: "XP na semana", desc: "XP ganho desde segunda-feira (zera toda semana)." },
      { id: "sequencia", nome: "Sequência 🔥", rot: "Acertos seguidos", desc: "Maior sequência de acertos na primeira resposta." },
      { id: "media", nome: "Média nos testes", rot: "Média", desc: "Média das melhores notas (mínimo de 5 testes feitos)." }
    ];
    let tipo = new URLSearchParams(location.search).get("tipo");
    if (!TIPOS.some((t) => t.id === tipo)) tipo = "xp";
    paginaRanking.innerHTML = `
      <div class="pagina-topo"><div class="container">
        <div class="migalha"><a href="index.html">Início</a> › Ranking</div>
        <h1>Ranking dos alunos</h1>
        <p>Quem mais estudou e acertou na Rota Industrial. Participe com um apelido: sem e-mail, sem senha.</p>
        <div class="filtros" id="abas" style="margin:0"></div>
      </div></div>
      <section style="padding-top:28px"><div class="container duas-colunas">
        <div class="bloco"><div id="rk-titulo"></div><div id="rk-lista"><p class="vazio">Carregando…</p></div></div>
        <div><div class="bloco" id="rk-eu"></div><div class="bloco" id="rk-conta"></div></div>
      </div></section>`;
    const abas = paginaRanking.querySelector("#abas");
    abas.innerHTML = TIPOS.map((t) => `<button class="filtro" data-tipo="${t.id}">${t.nome}</button>`).join("");
    const fmtValor = (t, v) => t === "media" ? `${v}%` : fmt(v);
    async function carregar() {
      abas.querySelectorAll("[data-tipo]").forEach((b) => b.classList.toggle("ativo", b.dataset.tipo === tipo));
      const t = TIPOS.find((x) => x.id === tipo);
      paginaRanking.querySelector("#rk-titulo").innerHTML = `<h2>🏆 ${esc(t.nome)}</h2><p class="secao-sub">${esc(t.desc)}</p>`;
      const lista = paginaRanking.querySelector("#rk-lista");
      lista.innerHTML = '<p class="vazio">Carregando…</p>';
      try {
        const linhas = await Online.rpc("rota_ranking", { p_tipo: tipo, p_limite: 50 });
        const meu = Online.ativo ? (Aluno.dados.apelido || "").toLowerCase() : null;
        lista.innerHTML = linhas.length ? `<table class="tabela tabela-ranking"><thead><tr><th>#</th><th>Aluno</th><th>${esc(t.rot)}</th><th>Nível</th></tr></thead><tbody>
          ${linhas.map((l) => `<tr class="${meu && l.apelido.toLowerCase() === meu ? "eu" : ""}"><td class="pos">${l.pos <= 3 ? ["🥇", "🥈", "🥉"][l.pos - 1] : l.pos}</td>
            <td><b>${esc(l.apelido)}</b><br><small style="color:var(--muted)">${esc((NIVEIS[l.nivel - 1] || NIVEIS[0])[1])} · ${l.aulas} aulas</small></td>
            <td><b>${fmtValor(tipo, l.valor)}</b></td><td><span class="nivel-bola">${l.nivel}</span></td></tr>`).join("")}
          </tbody></table>` : `<p class="vazio">Ninguém pontuou aqui ainda${tipo === "semana" ? " nesta semana" : ""}. Seja o primeiro!</p>`;
      } catch (e) { lista.innerHTML = `<p class="vazio">⚠ ${esc(e.message)}</p>`; }
      const eu = paginaRanking.querySelector("#rk-eu");
      if (!Online.ativo) { eu.innerHTML = `<h2>📍 Sua posição</h2><p class="secao-sub" style="margin:0">Participe do ranking para ver sua posição.</p>`; return; }
      eu.innerHTML = `<h2>📍 Sua posição</h2><p class="vazio">Calculando…</p>`;
      try {
        await Online.aguardar();
        const p = await Online.rpc("rota_minha_posicao", { p_token: Online.estado.token, p_tipo: tipo });
        eu.innerHTML = `<h2>📍 Sua posição</h2>${p.pos ? `<div class="minha-pos"><strong>${p.pos}º</strong><span>de ${p.total} aluno${p.total > 1 ? "s" : ""} · ${fmtValor(tipo, p.valor)}</span></div>`
          : `<p class="secao-sub" style="margin:0">Você ainda não pontuou neste ranking.${tipo === "media" ? " Faça pelo menos 5 testes." : ""}</p>`}
          <p class="nota-mini">Apelido: <b>${esc(Aluno.dados.apelido)}</b> · <a href="perfil.html">Meu progresso</a></p>`;
      } catch (e) { eu.innerHTML = `<h2>📍 Sua posição</h2><p class="vazio">⚠ ${esc(e.message)}</p>`; }
    }
    abas.addEventListener("click", (e) => {
      const b = e.target.closest("[data-tipo]"); if (!b) return;
      tipo = b.dataset.tipo; history.replaceState(null, "", `?tipo=${tipo}`); carregar();
    });
    const conta = paginaRanking.querySelector("#rk-conta");
    const desenharConta = () => { if (Online.ativo) conta.classList.add("oculto"); else { conta.classList.remove("oculto"); blocoOnline(conta, () => { desenharConta(); carregar(); }); } };
    desenharConta();
    if (Online.ativo) Online.enviar().catch(() => {}).finally(carregar); else carregar();
  }

  // ---------------------------------------------------------------- verificar certificado
  const paginaVerificar = document.getElementById("pagina-verificar");
  if (paginaVerificar) {
    const campo = document.getElementById("codigo");
    const saida = document.getElementById("verificacao");
    async function verificar(cod) {
      cod = (cod || "").trim().toUpperCase();
      if (!cod) { saida.innerHTML = ""; return; }
      saida.innerHTML = '<p class="vazio">Consultando…</p>';
      try {
        const r = await Online.rpc("rota_verificar_certificado", { p_codigo: cod });
        const dt = (s) => new Date(s + (s.length === 10 ? "T12:00:00" : "")).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
        saida.innerHTML = r ? `<div class="bloco verificado"><div class="selo-grande ok">✔ Certificado válido</div>
            <table class="tabela"><tbody>
              <tr><td>Aluno(a)</td><td><b>${esc(r.nome)}</b></td></tr>
              <tr><td>Curso</td><td><b>${esc(r.curso)}</b> (${esc(r.carga)}, ${r.aulas} aulas)</td></tr>
              <tr><td>Média nos testes</td><td>${r.media}%</td></tr>
              <tr><td>Concluído em</td><td>${dt(r.concluido)}</td></tr>
              <tr><td>Código</td><td><code>${esc(r.codigo)}</code></td></tr>
            </tbody></table>
            <p class="nota-mini">Curso livre de caráter introdutório, sem validade como habilitação profissional.</p></div>`
          : `<div class="bloco verificado"><div class="selo-grande nok">✘ Código não encontrado</div><p class="secao-sub" style="margin:0">Confira se digitou o código exatamente como está no certificado (ex.: RI-1A2B3-C4D5E).</p></div>`;
      } catch (e) { saida.innerHTML = `<p class="vazio">⚠ ${esc(e.message)}</p>`; }
    }
    const c0 = new URLSearchParams(location.search).get("c") || "";
    campo.value = c0;
    document.getElementById("form-verificar").addEventListener("submit", (e) => {
      e.preventDefault(); history.replaceState(null, "", `?c=${encodeURIComponent(campo.value.trim().toUpperCase())}`); verificar(campo.value);
    });
    verificar(c0);
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
        const SITE = "lorranbrs.github.io/rota-industrial";
        async function registrar(nome) {
          await Online.enviar(); // garante que o banco tem o progresso mais recente
          const r = await Online.rpc("rota_emitir_certificado", { p_token: Online.estado.token, p_curso: c.id, p_nome: nome });
          const certs = Object.assign({}, d.certificados || {}, { [c.id]: { codigo: r.codigo, nome: r.nome } });
          Aluno.definir("certificados", certs);
          return r;
        }
        function desenhar() {
          const nome = d.nomeCertificado || d.apelido || "";
          const reg = (d.certificados || {})[c.id];
          const cod = reg ? reg.codigo : `RI-${codigo(c.id + "|" + nome + "|" + data.toDateString())}`;
          const status = reg
            ? `<p class="cert-status ok">✔ Certificado registrado e verificável: <a href="verificar.html?c=${encodeURIComponent(reg.codigo)}" target="_blank" rel="noopener">${esc(reg.codigo)}</a></p>`
            : Online.ativo
              ? `<p class="cert-status">Gere um código que qualquer pessoa pode conferir online. <button class="botao botao-escuro botao-pequeno" id="registrar">🔒 Registrar certificado verificável</button></p>`
              : `<p class="cert-status">Este código é só uma referência local. Para ter um certificado <b>verificável online</b>, entre no <a href="perfil.html">ranking online</a> (sem e-mail).</p>`;
          paginaCert.innerHTML = `<div class="container cert-pagina">
            <div class="cert-acoes"><input id="nome-cert" maxlength="60" placeholder="Seu nome completo" value="${esc(nome)}" aria-label="Nome no certificado">
              <button class="botao botao-primario" id="imprimir">🖨 Imprimir / salvar em PDF</button><a class="botao botao-secundario" href="perfil.html">Meu progresso</a></div>
            <div class="nao-imprimir" style="text-align:center">${status}<p class="erro-msg" id="cert-erro" role="alert"></p></div>
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
                <div>Concluído em ${data.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}<br>Código: <b>${esc(cod)}</b>${reg ? `<br>Verifique em ${SITE}/verificar.html` : ""}</div>
                <div class="assin">Rota Industrial<br>${SITE}</div>
              </div>
              <div class="aviso">Curso livre de caráter introdutório, sem validade como habilitação profissional. Não substitui treinamentos obrigatórios (ex.: NR-10).</div>
            </div></div>`;
          const inp = document.getElementById("nome-cert");
          const erro = document.getElementById("cert-erro");
          async function trocarNome() {
            const novo = inp.value.trim();
            if (novo === (d.nomeCertificado || d.apelido || "")) return;
            Aluno.definir("nomeCertificado", novo);
            if (reg && Online.ativo && novo.length >= 3) {
              try { await registrar(novo); toast("✔️", "Nome atualizado no registro"); } catch (e) { erro.textContent = e.message; }
            }
            desenhar();
          }
          inp.addEventListener("change", trocarNome);
          document.getElementById("imprimir").addEventListener("click", async () => { await trocarNome(); window.print(); });
          const br = document.getElementById("registrar");
          if (br) br.addEventListener("click", async () => {
            const n = inp.value.trim();
            if (n.length < 3) { erro.textContent = "Digite seu nome completo acima antes de registrar."; inp.focus(); return; }
            br.disabled = true; erro.textContent = "";
            try { Aluno.definir("nomeCertificado", n); const r = await registrar(n); toast("🔒", "Certificado registrado", r.codigo); desenhar(); }
            catch (e) { erro.textContent = e.message; br.disabled = false; }
          });
        }
        desenhar();
      }
    }
  }

  // ---------------------------------------------------------------- animações iniciais
  Efeitos.revelar(document.querySelector("main"));
  document.querySelectorAll(".numeros strong, .painel-progresso .grande").forEach((n, i) => setTimeout(() => Efeitos.contar(n), 350 + i * 120));
})();
