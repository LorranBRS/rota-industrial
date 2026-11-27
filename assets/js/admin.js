// Rota Industrial — Painel administrativo (admin.html)
// Usa a mesma conta do site (telefone + senha). Só contas marcadas como admin no banco conseguem ver os dados:
// todas as funções adm_* conferem isso no servidor.
(function () {
  "use strict";
  const raiz = document.getElementById("painel");
  if (!raiz) return;
  const On = window.RotaOnline, U = window.RotaUtil, Ef = window.RotaEfeitos;
  const { esc, fmt, NIVEIS, aulasDoCurso, toast } = U;
  const CURSOS = (window.ROTA || { cursos: [] }).cursos;
  const tok = () => On.estado.token;
  const rpc = (fn, args) => On.rpc(fn, Object.assign({ p_token: tok() }, args || {}));
  const data = (t, hora) => t ? new Date(t).toLocaleString("pt-BR", hora ? { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" } : { day: "2-digit", month: "2-digit", year: "numeric" }) : "—";
  const atras = (t) => {
    if (!t) return "nunca";
    const m = Math.round((Date.now() - new Date(t)) / 60000);
    if (m < 2) return "agora"; if (m < 60) return `há ${m} min`;
    const h = Math.round(m / 60); if (h < 24) return `há ${h} h`;
    const d = Math.round(h / 24); return d < 30 ? `há ${d} dia${d > 1 ? "s" : ""}` : data(t);
  };
  const nomeNivel = (n) => (NIVEIS[(n || 1) - 1] || NIVEIS[0])[1];
  const tituloAula = (chave) => {
    const [cid, k] = String(chave).split("/");
    const c = CURSOS.find((x) => x.id === cid);
    const a = c && aulasDoCurso(c).find((x) => x.k === k);
    return { curso: c ? c.titulo : cid, aula: a ? a.titulo : k, cid, k };
  };

  // ------------------------------------------------------------ gráfico de barras em SVG
  function barras(serie, opc) {
    const o = Object.assign({ alt: 160, cor: "#f5b300", rotulo: (d) => d.dia.slice(8, 10) + "/" + d.dia.slice(5, 7) }, opc || {});
    const n = serie.length || 1, larg = 640, pad = 24, max = Math.max(1, ...serie.map((d) => d.n));
    const w = (larg - pad * 2) / n;
    const barrasSvg = serie.map((d, i) => {
      const h = Math.round((d.n / max) * (o.alt - 34));
      const x = pad + i * w + w * 0.15, y = o.alt - 20 - h;
      return `<g><rect x="${x.toFixed(1)}" y="${y}" width="${(w * 0.7).toFixed(1)}" height="${Math.max(h, d.n ? 2 : 0)}" rx="3" fill="${o.cor}"><title>${esc(o.rotulo(d))}: ${d.n}</title></rect>
        ${d.n && n <= 31 ? `<text x="${(x + w * 0.35).toFixed(1)}" y="${y - 4}" text-anchor="middle" class="g-num">${d.n}</text>` : ""}
        ${i % Math.ceil(n / 8) === 0 ? `<text x="${(x + w * 0.35).toFixed(1)}" y="${o.alt - 4}" text-anchor="middle" class="g-eixo">${esc(o.rotulo(d))}</text>` : ""}</g>`;
    }).join("");
    return `<svg class="grafico" viewBox="0 0 ${larg} ${o.alt}" role="img" aria-label="${esc(o.titulo || "gráfico")}">
      <line x1="${pad}" y1="${o.alt - 20}" x2="${larg - pad}" y2="${o.alt - 20}" class="g-base"/>${barrasSvg}</svg>`;
  }
  const barraH = (pct, cor) => `<div class="barra-h"><div style="width:${Math.max(0, Math.min(100, pct || 0))}%;${cor ? `background:${cor}` : ""}"></div></div>`;

  // ------------------------------------------------------------ login do admin
  async function iniciar() {
    if (!On.ativo) return telaLogin();
    raiz.innerHTML = '<div class="adm-carregando">Conferindo acesso…</div>';
    const p = await On.atualizarPerfil();
    if (!p) return telaLogin();
    if (!p.admin) return telaLogin("Esta conta não tem acesso ao painel administrativo.");
    montar();
  }
  function telaLogin(aviso) {
    raiz.innerHTML = `<div class="entrar-caixa"><div class="entrar-cartao">
      <div class="adm-marca"><span class="logo-icone"><span>RI</span></span> Painel administrativo</div>
      ${aviso ? `<p class="erro-msg">${esc(aviso)}</p>` : `<p class="secao-sub">Entre com o telefone e a senha da sua conta de administrador.</p>`}
      ${On.ativo ? `<p class="secao-sub">Conectado como <b>${esc((On.perfil || {}).nome || "")}</b>.</p><button class="botao botao-secundario" id="l-sair" style="width:100%">Sair e entrar com outra conta</button>`
        : `<form id="l-form"><label>Telefone<input id="l-tel" type="tel" inputmode="numeric" autocomplete="tel-national" placeholder="(11) 91234-5678"></label>
          <label>Senha<input id="l-senha" type="password" autocomplete="current-password"></label>
          <p class="erro-msg" id="l-erro"></p><button class="botao botao-primario" style="width:100%" id="l-btn">Entrar no painel</button></form>`}
      <p style="text-align:center;margin-top:14px"><a href="index.html">← Voltar ao site</a></p></div></div>`;
    const sair = document.getElementById("l-sair");
    if (sair) sair.addEventListener("click", async () => { await On.sair(); telaLogin(); });
    const f = document.getElementById("l-form");
    if (f) f.addEventListener("submit", async (e) => {
      e.preventDefault();
      const b = document.getElementById("l-btn"), er = document.getElementById("l-erro");
      b.disabled = true; er.textContent = "";
      try { await On.entrar(document.getElementById("l-tel").value, document.getElementById("l-senha").value); iniciar(); }
      catch (err) { er.textContent = err.message; b.disabled = false; }
    });
  }

  // ------------------------------------------------------------ estrutura do painel
  const SECOES = [
    { id: "geral", nome: "Visão geral", ic: "📊" },
    { id: "alunos", nome: "Alunos", ic: "👥" },
    { id: "cursos", nome: "Cursos", ic: "📚" },
    { id: "questoes", nome: "Questões", ic: "📝" },
    { id: "certificados", nome: "Certificados", ic: "🎓" },
    { id: "aviso", nome: "Aviso no site", ic: "📣" },
    { id: "registro", nome: "Registro de ações", ic: "🗂" }
  ];
  let secao = (location.hash || "#geral").slice(1);
  let conteudo;
  function montar() {
    const p = On.perfil || {};
    raiz.innerHTML = `<div class="adm">
      <aside class="adm-lado">
        <div class="adm-marca"><span class="logo-icone"><span>RI</span></span><span>Rota <b>Admin</b></span></div>
        <nav class="adm-nav">${SECOES.map((s) => `<a href="#${s.id}" data-sec="${s.id}"><span>${s.ic}</span>${s.nome}</a>`).join("")}</nav>
        <div class="adm-eu"><b>${esc(p.nome || p.apelido || "")}</b><small>${esc(p.telefone || "")}</small>
          <div class="adm-eu-acoes"><a href="index.html">Ver site</a> · <a href="#" id="adm-sair">Sair</a></div></div>
      </aside>
      <main class="adm-conteudo" id="adm-conteudo"></main>
    </div>`;
    conteudo = document.getElementById("adm-conteudo");
    document.getElementById("adm-sair").addEventListener("click", async (e) => { e.preventDefault(); await On.sair(); location.href = "index.html"; });
    window.addEventListener("hashchange", () => { secao = location.hash.slice(1) || "geral"; abrir(); });
    abrir();
  }
  async function abrir() {
    if (!SECOES.some((s) => s.id === secao)) secao = "geral";
    raiz.querySelectorAll("[data-sec]").forEach((a) => a.classList.toggle("ativo", a.dataset.sec === secao));
    const s = SECOES.find((x) => x.id === secao);
    conteudo.innerHTML = `<div class="adm-cabeca"><h1>${s.ic} ${s.nome}</h1><div id="adm-cabeca-acoes"></div></div><div id="adm-corpo"><div class="adm-carregando">Carregando…</div></div>`;
    const corpo = document.getElementById("adm-corpo");
    try { await ({ geral, alunos, cursos, questoes, certificados, aviso, registro })[secao](corpo); }
    catch (e) {
      if (/permissão|sessão/i.test(e.message)) return telaLogin(e.message);
      corpo.innerHTML = `<div class="bloco"><p class="erro-msg">⚠ ${esc(e.message)}</p><button class="botao botao-secundario botao-pequeno" onclick="location.reload()">Tentar de novo</button></div>`;
    }
  }

  // ------------------------------------------------------------ visão geral
  async function geral(corpo) {
    const r = await rpc("adm_resumo");
    const t = r.totais;
    const kpi = (v, l, ic, extra) => `<div class="stat"><span class="ic">${ic}</span><div class="v">${v}</div><div class="l">${l}</div>${extra ? `<small class="kpi-extra">${extra}</small>` : ""}</div>`;
    const totalCad30 = r.cadastros.reduce((n, d) => n + d.n, 0);
    corpo.innerHTML = `
      <div class="stats adm-stats">
        ${kpi(fmt(t.alunos), "alunos cadastrados", "👥", `+${t.novos7} nos últimos 7 dias`)}
        ${kpi(fmt(t.ativos7), "ativos (7 dias)", "🟢", `${fmt(t.ativos30)} em 30 dias`)}
        ${kpi(fmt(t.aulas), "aulas concluídas", "📘", t.alunos ? `${(t.aulas / t.alunos).toFixed(1).replace(".", ",")} por aluno` : "")}
        ${kpi(fmt(t.testes), "testes feitos", "📝", t.media != null ? `média ${t.media}%` : "")}
        ${kpi(fmt(r.certificados), "certificados", "🎓")}
        ${kpi(fmt(t.xp), "XP distribuído", "⚡", `${t.bloqueados} bloqueado${t.bloqueados === 1 ? "" : "s"} · ${t.admins} admin${t.admins === 1 ? "" : "s"}`)}
      </div>
      <div class="duas-colunas" style="margin-top:20px">
        <div class="bloco"><h2>Cadastros por dia</h2><p class="secao-sub">Últimos 30 dias · ${totalCad30} novo${totalCad30 === 1 ? "" : "s"}</p>${barras(r.cadastros, { titulo: "Cadastros por dia" })}</div>
        <div class="bloco"><h2>Alunos estudando por dia</h2><p class="secao-sub">Contas com atividade em cada dia</p>${barras(r.estudando, { cor: "#2e8a5a", titulo: "Alunos estudando por dia" })}</div>
      </div>
      <div class="duas-colunas">
        <div class="bloco"><h2>Funil por curso</h2><p class="secao-sub">Quantos começaram e quantos concluíram</p>
          <table class="tabela"><thead><tr><th>Curso</th><th>Começaram</th><th>Concluíram</th><th>Média</th><th>Cert.</th></tr></thead><tbody>
          ${r.cursos.map((c) => { const taxa = c.iniciaram ? Math.round((c.concluiram / c.iniciaram) * 100) : 0; return `<tr><td><b>${esc(c.titulo)}</b>${barraH(taxa)}</td><td>${c.iniciaram}</td><td>${c.concluiram} <small style="color:var(--muted)">(${taxa}%)</small></td><td>${c.media != null ? c.media + "%" : "—"}</td><td>${c.certificados}</td></tr>`; }).join("")}
          </tbody></table></div>
        <div class="bloco"><h2>Aulas mais concluídas</h2><p class="secao-sub">Top 10</p>
          ${r.aulas_top.length ? `<table class="tabela"><tbody>${r.aulas_top.map((a, i) => { const t2 = tituloAula(a.aula); return `<tr><td class="pos">${i + 1}</td><td><b>${esc(t2.aula)}</b><br><small style="color:var(--muted)">${esc(t2.curso)}</small></td><td><b>${a.n}</b></td></tr>`; }).join("")}</tbody></table>` : '<p class="vazio">Ainda sem dados.</p>'}
        </div>
      </div>`;
    corpo.querySelectorAll(".v").forEach((n) => Ef.contar(n));
    cabecaAcoes(`<button class="botao botao-secundario botao-pequeno" id="atualizar">↻ Atualizar</button>`, { atualizar: () => abrir() });
  }
  function cabecaAcoes(html, acoes) {
    const el = document.getElementById("adm-cabeca-acoes");
    el.innerHTML = html;
    Object.entries(acoes || {}).forEach(([id, fn]) => { const b = document.getElementById(id); if (b) b.addEventListener("click", fn); });
  }

  // ------------------------------------------------------------ alunos
  const filtro = { busca: "", ordem: "recentes", pagina: 0 };
  async function alunos(corpo) {
    corpo.innerHTML = `<div class="bloco">
      <div class="adm-filtros"><input id="a-busca" class="campo-claro" placeholder="Buscar por nome, apelido ou telefone" value="${esc(filtro.busca)}">
        <select id="a-ordem" class="campo-claro" style="flex:0 0 auto">
          ${[["recentes", "Mais recentes"], ["acesso", "Último acesso"], ["xp", "Mais XP"], ["nome", "Nome (A-Z)"]].map(([v, t]) => `<option value="${v}" ${filtro.ordem === v ? "selected" : ""}>${t}</option>`).join("")}
        </select></div>
      <div id="a-lista"><div class="adm-carregando">Carregando…</div></div></div>`;
    cabecaAcoes(`<button class="botao botao-secundario botao-pequeno" id="exportar">⬇ Exportar CSV</button>`, { exportar: exportarCsv });
    let espera;
    corpo.querySelector("#a-busca").addEventListener("input", (e) => { clearTimeout(espera); espera = setTimeout(() => { filtro.busca = e.target.value; filtro.pagina = 0; listar(); }, 300); });
    corpo.querySelector("#a-ordem").addEventListener("change", (e) => { filtro.ordem = e.target.value; filtro.pagina = 0; listar(); });
    listar();
  }
  async function listar() {
    const lista = document.getElementById("a-lista"); if (!lista) return;
    const POR = 30;
    const r = await rpc("adm_alunos", { p_busca: filtro.busca, p_ordem: filtro.ordem, p_limite: POR, p_offset: filtro.pagina * POR });
    const paginas = Math.max(1, Math.ceil(r.total / POR));
    lista.innerHTML = r.itens.length ? `
      <p class="secao-sub" style="margin:4px 0 10px">${r.total} aluno${r.total === 1 ? "" : "s"}</p>
      <div class="tabela-rolagem"><table class="tabela adm-tabela"><thead><tr><th>Aluno</th><th>Telefone</th><th>Nível · XP</th><th>Aulas</th><th>Média</th><th>Último acesso</th><th>Situação</th></tr></thead><tbody>
      ${r.itens.map((a) => `<tr data-id="${a.id}" tabindex="0">
        <td><b>${esc(a.nome || "—")}</b><br><small style="color:var(--muted)">@${esc(a.apelido)}</small></td>
        <td>${esc(a.telefone || "—")}</td>
        <td><span class="nivel-bola">${a.nivel}</span> ${fmt(a.xp)}</td>
        <td>${a.aulas}</td><td>${a.media != null ? a.media + "%" : "—"}</td>
        <td title="${data(a.ultimo_acesso, true)}">${atras(a.ultimo_acesso)}</td>
        <td>${a.admin ? '<span class="selo selo-ok">admin</span> ' : ""}${a.bloqueado ? '<span class="selo selo-erro">bloqueado</span> ' : ""}${a.oculto_ranking ? '<span class="selo">fora do ranking</span> ' : ""}${a.certificados ? `<span class="selo">🎓 ${a.certificados}</span>` : ""}</td>
      </tr>`).join("")}</tbody></table></div>
      ${paginas > 1 ? `<div class="adm-paginas"><button class="botao botao-secundario botao-pequeno" id="pg-ant" ${filtro.pagina ? "" : "disabled"}>← Anterior</button><span>Página ${filtro.pagina + 1} de ${paginas}</span><button class="botao botao-secundario botao-pequeno" id="pg-prox" ${filtro.pagina + 1 < paginas ? "" : "disabled"}>Próxima →</button></div>` : ""}`
      : `<p class="vazio">${filtro.busca ? "Nenhum aluno encontrado." : "Nenhum aluno cadastrado ainda."}</p>`;
    lista.querySelectorAll("tr[data-id]").forEach((tr) => {
      const abrirA = () => detalheAluno(Number(tr.dataset.id));
      tr.addEventListener("click", abrirA);
      tr.addEventListener("keydown", (e) => { if (e.key === "Enter") abrirA(); });
    });
    const ant = document.getElementById("pg-ant"), prox = document.getElementById("pg-prox");
    if (ant) ant.addEventListener("click", () => { filtro.pagina--; listar(); });
    if (prox) prox.addEventListener("click", () => { filtro.pagina++; listar(); });
  }
  async function exportarCsv() {
    const todos = [];
    for (let off = 0; ; off += 200) {
      const r = await rpc("adm_alunos", { p_busca: "", p_ordem: "recentes", p_limite: 200, p_offset: off });
      todos.push(...r.itens);
      if (r.itens.length < 200) break;
    }
    const col = ["id", "nome", "apelido", "telefone", "nivel", "xp", "aulas", "testes", "media", "seq_melhor", "certificados", "criado", "ultimo_acesso", "bloqueado", "oculto_ranking", "admin"];
    const cel = (v) => { const t = v == null ? "" : String(v); return /[";\n]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t; };
    const csv = "﻿" + [col.join(";"), ...todos.map((a) => col.map((c) => cel(a[c])).join(";"))].join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    link.download = `rota-industrial-alunos-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    toast("⬇", "CSV exportado", `${todos.length} alunos`);
  }

  // gaveta com o detalhe de um aluno
  async function detalheAluno(id) {
    const g = gaveta('<div class="adm-carregando">Carregando…</div>');
    let a;
    try { a = await rpc("adm_aluno", { p_id: id }); } catch (e) { g.corpo.innerHTML = `<p class="erro-msg">${esc(e.message)}</p>`; return; }
    if (!a) { g.corpo.innerHTML = '<p class="vazio">Aluno não encontrado.</p>'; return; }
    const prog = (a.dados && a.dados.progresso) || {}, quizzes = (a.dados && a.dados.aluno && a.dados.aluno.quizzes) || {};
    const porCurso = CURSOS.map((c) => {
      const tot = aulasDoCurso(c).length, feitas = Object.keys(prog).filter((k) => k.startsWith(c.id + "/")).length;
      const notas = Object.entries(quizzes).filter(([k]) => k.startsWith(c.id + "/")).map(([, q]) => q.melhor);
      return { c, tot, feitas, media: notas.length ? Math.round(notas.reduce((x, y) => x + y, 0) / notas.length) : null, testes: notas.length };
    }).filter((x) => x.feitas || x.testes);
    const eu = (On.perfil || {}).id === a.id;
    const acao = (id2, txt, cls) => `<button class="botao ${cls || "botao-secundario"} botao-pequeno" data-acao="${id2}">${txt}</button>`;
    g.corpo.innerHTML = `
      <div class="adm-aluno-topo"><div class="insignia" style="width:72px;height:72px;box-shadow:none"><div><strong style="font-size:2rem">${a.nivel}</strong><small>nível</small></div></div>
        <div><h2 style="margin:0">${esc(a.nome || "—")}</h2><div style="color:var(--muted)">@${esc(a.apelido)} · ${esc(nomeNivel(a.nivel))}</div>
        <div class="selos" style="margin-top:6px">${a.admin ? '<span class="selo selo-ok">admin</span>' : ""}${a.bloqueado ? '<span class="selo selo-erro">bloqueado</span>' : ""}${a.oculto_ranking ? '<span class="selo">fora do ranking</span>' : ""}<span class="selo">${a.sessoes} sessão(ões) ativa(s)</span></div></div></div>
      <table class="tabela" style="margin-top:12px"><tbody>
        <tr><td>Telefone</td><td><b>${esc(a.telefone || "—")}</b> ${a.telefone ? `<a href="https://wa.me/${esc(a.telefone.replace(/\D/g, ""))}" target="_blank" rel="noopener">WhatsApp ↗</a>` : ""}</td></tr>
        <tr><td>XP · sequência</td><td>${fmt(a.xp)} XP · melhor sequência ${a.seq_melhor} · ${a.dias_melhor} dias seguidos</td></tr>
        <tr><td>Aulas · testes</td><td>${a.aulas} aulas · ${a.testes} testes${a.media != null ? ` · média ${a.media}%` : ""}</td></tr>
        <tr><td>Cadastro</td><td>${data(a.criado, true)}</td></tr>
        <tr><td>Último acesso</td><td>${data(a.ultimo_acesso, true)} (${atras(a.ultimo_acesso)})</td></tr>
      </tbody></table>
      <h3>Progresso por curso</h3>
      ${porCurso.length ? porCurso.map((x) => `<div class="adm-curso-linha"><div><b>${esc(x.c.titulo)}</b><small>${x.feitas}/${x.tot} aulas${x.media != null ? ` · média ${x.media}% em ${x.testes} testes` : ""}</small></div>${barraH(Math.round((x.feitas / x.tot) * 100), "var(--ok)")}</div>`).join("") : '<p class="vazio">Ainda não começou nenhum curso.</p>'}
      <h3>Certificados</h3>
      ${a.certificados.length ? `<table class="tabela"><tbody>${a.certificados.map((c) => `<tr><td><a href="verificar.html?c=${encodeURIComponent(c.codigo)}" target="_blank" rel="noopener"><code>${esc(c.codigo)}</code></a><br><small style="color:var(--muted)">${esc((CURSOS.find((k) => k.id === c.curso) || {}).titulo || c.curso)} · ${c.media}%</small></td><td>${c.revogado ? '<span class="selo selo-erro">revogado</span>' : '<span class="selo selo-ok">válido</span>'}</td></tr>`).join("")}</tbody></table>` : '<p class="vazio">Nenhum.</p>'}
      <h3>Ações</h3>
      <div class="adm-acoes">
        ${acao("resetar_senha", "🔑 Gerar senha nova")}
        ${acao("editar", "✎ Editar nome/apelido")}
        ${a.oculto_ranking ? acao("mostrar_ranking", "🏆 Mostrar no ranking") : acao("ocultar_ranking", "🙈 Tirar do ranking")}
        ${acao("encerrar_sessoes", "🚪 Desconectar aparelhos")}
        ${eu ? "" : (a.bloqueado ? acao("desbloquear", "✅ Desbloquear") : acao("bloquear", "⛔ Bloquear conta"))}
        ${eu ? "" : (a.admin ? acao("admin_off", "Remover admin") : acao("admin_on", "⚙ Tornar admin"))}
        ${acao("zerar_progresso", "♻ Zerar progresso")}
        ${eu ? "" : acao("apagar", "🗑 Apagar conta", "botao-perigo")}
      </div>
      <p class="erro-msg" id="d-erro"></p>`;
    const CONFIRMA = {
      bloquear: "Bloquear esta conta? O aluno é desconectado, não consegue entrar e sai do ranking.",
      admin_on: "Dar acesso TOTAL ao painel administrativo para este aluno?",
      admin_off: "Remover o acesso de administrador deste aluno?",
      zerar_progresso: "Zerar todo o progresso, XP e notas deste aluno na nuvem? Não pode ser desfeito.",
      encerrar_sessoes: "Desconectar este aluno de todos os aparelhos?",
      resetar_senha: "Gerar uma senha nova para este aluno? A senha atual deixa de funcionar."
    };
    g.corpo.querySelectorAll("[data-acao]").forEach((b) => b.addEventListener("click", async () => {
      const ac = b.dataset.acao, er = document.getElementById("d-erro");
      er.textContent = "";
      try {
        if (ac === "editar") {
          const nome = prompt("Nome completo:", a.nome || ""); if (nome === null) return;
          const ap = prompt("Apelido no ranking:", a.apelido || ""); if (ap === null) return;
          if (nome !== a.nome) await rpc("adm_acao_aluno", { p_id: a.id, p_acao: "nome", p_valor: nome });
          if (ap !== a.apelido) await rpc("adm_acao_aluno", { p_id: a.id, p_acao: "apelido", p_valor: ap });
          toast("✔️", "Aluno atualizado"); return detalheAluno(a.id).then(listar);
        }
        if (ac === "apagar") {
          const t = prompt(`Para APAGAR a conta de ${a.nome || a.apelido} (dados, progresso e certificados), digite APAGAR:`);
          if (t !== "APAGAR") return;
        } else if (CONFIRMA[ac] && !confirm(CONFIRMA[ac])) return;
        b.disabled = true;
        const r = await rpc("adm_acao_aluno", { p_id: a.id, p_acao: ac });
        if (ac === "resetar_senha" && r.senha) {
          modalSenha(a, r.senha);
        } else toast("✔️", "Feito");
        if (ac === "apagar") { g.fechar(); listar(); return; }
        detalheAluno(a.id); listar();
      } catch (e) { er.textContent = e.message; b.disabled = false; }
    }));
  }
  function modalSenha(a, senha) {
    const tel = (a.telefone || "").replace(/\D/g, "");
    const texto = `Olá, ${a.nome || a.apelido}! Sua nova senha da Rota Industrial é: ${senha}\nEntre em https://lorranbrs.github.io/rota-industrial/entrar.html e troque a senha em Meu progresso.`;
    const m = document.createElement("div");
    m.className = "modal-fundo";
    m.innerHTML = `<div class="modal"><button class="modal-fechar" aria-label="Fechar">✕</button><h2>🔑 Senha nova gerada</h2>
      <p class="secao-sub">Passe para <b>${esc(a.nome || a.apelido)}</b>. Ela aparece só agora.</p>
      <div class="codigo-acesso"><code style="font-size:1.4rem">${esc(senha)}</code><button class="botao botao-secundario botao-pequeno" data-copiar>Copiar</button></div>
      ${tel ? `<a class="botao botao-primario" style="width:100%;margin-top:12px" target="_blank" rel="noopener" href="https://wa.me/${tel}?text=${encodeURIComponent(texto)}">Enviar pelo WhatsApp</a>` : ""}
      <button class="botao botao-secundario" style="width:100%;margin-top:8px" data-fechar>Fechar</button></div>`;
    document.body.appendChild(m);
    m.addEventListener("click", (e) => { if (e.target === m || e.target.closest(".modal-fechar,[data-fechar]")) m.remove(); });
    m.querySelector("[data-copiar]").addEventListener("click", () => navigator.clipboard && navigator.clipboard.writeText(senha).then(() => toast("📋", "Senha copiada")));
  }
  function gaveta(html) {
    const velho = document.querySelector(".gaveta-fundo"); if (velho) velho.remove();
    const f = document.createElement("div");
    f.className = "gaveta-fundo";
    f.innerHTML = `<aside class="gaveta" role="dialog" aria-modal="true"><button class="modal-fechar" aria-label="Fechar">✕</button><div class="gaveta-corpo">${html}</div></aside>`;
    document.body.appendChild(f);
    requestAnimationFrame(() => f.classList.add("aberta"));
    const fechar = () => { f.classList.remove("aberta"); setTimeout(() => f.remove(), 250); };
    f.addEventListener("click", (e) => { if (e.target === f || e.target.closest(".gaveta > .modal-fechar")) fechar(); });
    return { corpo: f.querySelector(".gaveta-corpo"), fechar };
  }

  // ------------------------------------------------------------ cursos (status no site)
  async function cursos(corpo) {
    const [cfg, r] = await Promise.all([On.rpc("rota_config"), rpc("adm_resumo")]);
    const st = Object.assign({}, cfg.cursos || {});
    const stats = Object.fromEntries(r.cursos.map((c) => [c.id, c]));
    const ROT = { disponivel: "Disponível", "em-breve": "Em breve", oculto: "Oculto" };
    corpo.innerHTML = `<div class="bloco"><p class="secao-sub">Mude como cada curso aparece no site. <b>Em breve</b>: aparece no catálogo com o selo "Em breve". <b>Oculto</b>: some do site (quem tiver o link direto da aula ainda abre).</p>
      <div class="tabela-rolagem"><table class="tabela"><thead><tr><th>Curso</th><th>Aulas</th><th>Começaram</th><th>Concluíram</th><th>Média</th><th>Status no site</th></tr></thead><tbody>
      ${CURSOS.map((c) => { const s2 = stats[c.id] || {}; const atual = st[c.id] || c.status; return `<tr>
        <td><a href="curso.html?id=${c.id}" target="_blank" rel="noopener"><b>${esc(c.titulo)}</b></a><br><small style="color:var(--muted)">${esc(c.nivel)} · ${esc(c.cargaHoraria)}</small></td>
        <td>${aulasDoCurso(c).length}</td><td>${s2.iniciaram || 0}</td><td>${s2.concluiram || 0}</td><td>${s2.media != null ? s2.media + "%" : "—"}</td>
        <td><select class="campo-claro" data-curso="${c.id}">${Object.entries(ROT).map(([v, t]) => `<option value="${v}" ${atual === v ? "selected" : ""}>${t}</option>`).join("")}</select></td></tr>`; }).join("")}
      </tbody></table></div>
      <button class="botao botao-primario" id="c-salvar" style="margin-top:14px">Salvar status</button>
      <p class="nota-mini">Para criar cursos ou editar aulas, o conteúdo continua nos arquivos do site (data/cursos.js e data/aulas/). O painel controla o que aparece.</p></div>`;
    corpo.querySelector("#c-salvar").addEventListener("click", async (e) => {
      const b = e.currentTarget; b.disabled = true;
      const novo = {};
      corpo.querySelectorAll("[data-curso]").forEach((s) => { const c = CURSOS.find((x) => x.id === s.dataset.curso); if (s.value !== c.status) novo[c.id] = s.value; });
      try { await rpc("adm_config", { p_chave: "cursos", p_valor: novo }); toast("✔️", "Status dos cursos salvo", "Os alunos veem a mudança na próxima visita."); }
      catch (err) { toast("⚠️", "Erro", err.message); }
      b.disabled = false;
    });
  }

  // ------------------------------------------------------------ questões (taxa de acerto)
  async function questoes(corpo) {
    const lista = await rpc("adm_questoes");
    // carrega o texto das perguntas a partir das aulas
    const textos = {};
    const cursosUsados = [...new Set(lista.map((q) => q.chave.split("/")[0]))];
    await Promise.all(cursosUsados.map(async (cid) => {
      const A = await U.carregarCurso(cid);
      Object.entries(A).forEach(([k, a]) => {
        const div = document.createElement("div"); div.innerHTML = a.texto || "";
        [...div.querySelectorAll("details summary")].filter((s) => /^\s*\d+\./.test(s.textContent)).forEach((s, i) => { textos[`${cid}/${k}/${i}`] = s.textContent.replace(/^\s*\d+\.\s*/, ""); });
      });
    }));
    let minimo = 1;
    const desenhar = () => {
      const itens = lista.filter((q) => q.total >= minimo).map((q) => ({ ...q, taxa: Math.round((q.acertos / q.total) * 100) })).sort((x, y) => x.taxa - y.taxa || y.total - x.total);
      corpo.querySelector("#q-lista").innerHTML = itens.length ? `<div class="tabela-rolagem"><table class="tabela"><thead><tr><th>Questão</th><th>Respostas</th><th>Acerto</th></tr></thead><tbody>
        ${itens.map((q) => { const t2 = tituloAula(q.chave.split("/").slice(0, 2).join("/")); const n = Number(q.chave.split("/")[2]) + 1; return `<tr>
          <td><b>${esc(textos[q.chave] || `Questão ${n}`)}</b><br><small style="color:var(--muted)"><a href="aula.html?curso=${t2.cid}&aula=${t2.k}#teste" target="_blank" rel="noopener">${esc(t2.curso)} · ${esc(t2.aula)} · Q${n}</a></small></td>
          <td>${q.total}</td><td style="min-width:140px"><b style="color:${q.taxa < 50 ? "var(--erro)" : q.taxa < 70 ? "var(--brand-dark)" : "var(--ok)"}">${q.taxa}%</b>${barraH(q.taxa, q.taxa < 50 ? "var(--erro)" : q.taxa < 70 ? "var(--brand)" : "var(--ok)")}</td></tr>`; }).join("")}
        </tbody></table></div>` : '<p class="vazio">Ainda não há respostas suficientes.</p>';
    };
    corpo.innerHTML = `<div class="bloco"><p class="secao-sub">Taxa de acerto na <b>primeira resposta</b> de cada aluno. As mais difíceis aparecem primeiro: podem indicar uma aula que precisa de reforço ou uma questão confusa.</p>
      <div class="adm-filtros"><label style="display:flex;gap:8px;align-items:center">Mínimo de respostas <select id="q-min" class="campo-claro" style="flex:0 0 auto">${[1, 3, 5, 10, 20].map((n) => `<option>${n}</option>`).join("")}</select></label></div>
      <div id="q-lista"></div></div>`;
    corpo.querySelector("#q-min").addEventListener("change", (e) => { minimo = Number(e.target.value); desenhar(); });
    desenhar();
  }

  // ------------------------------------------------------------ certificados
  async function certificados(corpo) {
    corpo.innerHTML = `<div class="bloco"><div class="adm-filtros"><input id="ct-busca" class="campo-claro" placeholder="Buscar por código, nome, curso ou apelido"></div><div id="ct-lista"><div class="adm-carregando">Carregando…</div></div></div>`;
    const listarC = async (b) => {
      const l = await rpc("adm_certificados", { p_busca: b || "" });
      const el = corpo.querySelector("#ct-lista");
      el.innerHTML = l.length ? `<div class="tabela-rolagem"><table class="tabela"><thead><tr><th>Código</th><th>Nome</th><th>Curso</th><th>Média</th><th>Concluído</th><th></th></tr></thead><tbody>
        ${l.map((c) => `<tr><td><a href="verificar.html?c=${encodeURIComponent(c.codigo)}" target="_blank" rel="noopener"><code>${esc(c.codigo)}</code></a></td><td><b>${esc(c.nome)}</b><br><small style="color:var(--muted)">@${esc(c.apelido)}</small></td>
          <td>${esc(c.curso)}</td><td>${c.media}%</td><td>${data(c.concluido)}</td>
          <td>${c.revogado ? `<span class="selo selo-erro">revogado</span> <button class="botao botao-secundario botao-pequeno" data-cod="${esc(c.codigo)}" data-rev="0">Restaurar</button>`
            : `<button class="botao botao-secundario botao-pequeno" data-cod="${esc(c.codigo)}" data-rev="1">Revogar</button>`}</td></tr>`).join("")}
        </tbody></table></div>` : '<p class="vazio">Nenhum certificado.</p>';
      el.querySelectorAll("[data-cod]").forEach((b2) => b2.addEventListener("click", async () => {
        const rev = b2.dataset.rev === "1";
        if (rev && !confirm(`Revogar o certificado ${b2.dataset.cod}? Na verificação pública ele passa a aparecer como REVOGADO.`)) return;
        try { await rpc("adm_certificado", { p_codigo: b2.dataset.cod, p_revogar: rev }); toast("✔️", rev ? "Certificado revogado" : "Certificado restaurado"); listarC(corpo.querySelector("#ct-busca").value); }
        catch (e) { toast("⚠️", "Erro", e.message); }
      }));
    };
    let espera;
    corpo.querySelector("#ct-busca").addEventListener("input", (e) => { clearTimeout(espera); espera = setTimeout(() => listarC(e.target.value), 300); });
    listarC("");
  }

  // ------------------------------------------------------------ aviso no site
  async function aviso(corpo) {
    const cfg = await On.rpc("rota_config");
    const a = Object.assign({ ativo: false, tipo: "info", texto: "", link: "", linkTexto: "" }, cfg.aviso || {});
    corpo.innerHTML = `<div class="duas-colunas"><div class="bloco">
      <p class="secao-sub">Uma faixa que aparece no topo de todas as páginas do site (o aluno pode fechar).</p>
      <form id="av-form" class="adm-form">
        <label class="check"><input type="checkbox" id="av-ativo" ${a.ativo ? "checked" : ""}> Mostrar o aviso no site</label>
        <label>Tipo<select id="av-tipo" class="campo-claro">${[["info", "Informação (azul)"], ["sucesso", "Novidade (verde)"], ["alerta", "Atenção (amarelo)"]].map(([v, t]) => `<option value="${v}" ${a.tipo === v ? "selected" : ""}>${t}</option>`).join("")}</select></label>
        <label>Texto<textarea id="av-texto" class="campo-claro" maxlength="220" rows="3" placeholder="Ex.: Novo curso de Automação chegando em dezembro!">${esc(a.texto)}</textarea></label>
        <label>Link (opcional)<input id="av-link" class="campo-claro" placeholder="ex.: curso.html?id=motores-eletricos ou https://..." value="${esc(a.link)}"></label>
        <label>Texto do link<input id="av-linkt" class="campo-claro" maxlength="30" placeholder="Saiba mais" value="${esc(a.linkTexto)}"></label>
        <button class="botao botao-primario">Salvar aviso</button>
      </form></div>
      <div class="bloco"><h2>Prévia</h2><div id="av-previa"></div></div></div>`;
    const v = (id) => corpo.querySelector(id);
    const ler = () => ({ ativo: v("#av-ativo").checked, tipo: v("#av-tipo").value, texto: v("#av-texto").value.trim(), link: v("#av-link").value.trim(), linkTexto: v("#av-linkt").value.trim() });
    const previa = () => { const x = ler(); v("#av-previa").innerHTML = x.texto ? `<div class="aviso-site aviso-${x.tipo}" style="position:static;border-radius:10px"><div class="container"><span>${esc(x.texto)}${x.link ? ` <a href="#">${esc(x.linkTexto || "Saiba mais")} →</a>` : ""}</span><button type="button">✕</button></div></div>${x.ativo ? "" : '<p class="nota-mini">Desligado: não aparece no site.</p>'}` : '<p class="vazio">Escreva o texto do aviso.</p>'; };
    corpo.querySelectorAll("input,select,textarea").forEach((el) => el.addEventListener("input", previa));
    previa();
    v("#av-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      try { await rpc("adm_config", { p_chave: "aviso", p_valor: ler() }); toast("📣", "Aviso salvo", "Aparece para os alunos em alguns segundos."); }
      catch (err) { toast("⚠️", "Erro", err.message); }
    });
  }

  // ------------------------------------------------------------ registro de ações
  async function registro(corpo) {
    const l = await rpc("adm_eventos", { p_limite: 200 });
    const NOMES = { resetar_senha: "gerou senha nova", bloquear: "bloqueou", desbloquear: "desbloqueou", ocultar_ranking: "tirou do ranking", mostrar_ranking: "voltou ao ranking",
      apelido: "mudou o apelido", nome: "mudou o nome", admin_on: "deu acesso admin", admin_off: "removeu acesso admin", encerrar_sessoes: "desconectou aparelhos",
      zerar_progresso: "zerou o progresso", apagar: "apagou a conta", revogar_certificado: "revogou certificado", restaurar_certificado: "restaurou certificado",
      config_aviso: "alterou o aviso do site", config_cursos: "alterou o status dos cursos" };
    corpo.innerHTML = `<div class="bloco"><p class="secao-sub">Tudo o que os administradores fizeram no painel (últimas 200 ações).</p>
      ${l.length ? `<div class="tabela-rolagem"><table class="tabela"><thead><tr><th>Quando</th><th>Quem</th><th>O quê</th><th>Alvo</th></tr></thead><tbody>
        ${l.map((e) => `<tr><td>${data(e.quando, true)}</td><td>${esc(e.admin || "—")}</td><td>${esc(NOMES[e.acao] || e.acao)}${e.detalhes && e.detalhes.valor ? `: <i>${esc(e.detalhes.valor)}</i>` : ""}</td><td>${esc(e.alvo || "")}</td></tr>`).join("")}
      </tbody></table></div>` : '<p class="vazio">Nenhuma ação registrada ainda.</p>'}</div>`;
  }

  iniciar();
})();
