// Rota Industrial — scripts compartilhados entre as páginas
(function () {
  const dados = window.ROTA || { areas: [], setores: [], cursos: [] };

  // Menu no celular
  const botaoMenu = document.querySelector(".menu-botao");
  const menu = document.querySelector(".menu");
  if (botaoMenu && menu) {
    botaoMenu.addEventListener("click", () => menu.classList.toggle("aberto"));
  }

  // Ano no rodapé
  document.querySelectorAll("[data-ano]").forEach((el) => (el.textContent = new Date().getFullYear()));

  // Progresso do aluno (fica só neste navegador)
  const CHAVE_PROGRESSO = "rota-progresso";
  function lerProgresso() {
    try { return JSON.parse(localStorage.getItem(CHAVE_PROGRESSO)) || {}; } catch (e) { return {}; }
  }
  function salvarProgresso(p) {
    try { localStorage.setItem(CHAVE_PROGRESSO, JSON.stringify(p)); } catch (e) { /* sem armazenamento */ }
  }
  const chaveAula = (cursoId, m, a) => `${cursoId}/${m}-${a}`;

  // Lista plana de aulas de um curso: [{m, a, titulo, modulo}]
  function aulasDoCurso(c) {
    const lista = [];
    c.modulos.forEach((mod, mi) =>
      mod.aulas.forEach((titulo, ai) => lista.push({ m: mi + 1, a: ai + 1, titulo, modulo: mod.titulo }))
    );
    return lista;
  }
  const linkAula = (cursoId, m, a) => `aula.html?curso=${encodeURIComponent(cursoId)}&aula=${m}-${a}`;

  const nomeSetor = (id) => (dados.setores.find((s) => s.id === id) || { nome: id }).nome;
  const seloStatus = (status) =>
    status === "disponivel"
      ? '<span class="selo selo-ok">Disponível</span>'
      : '<span class="selo selo-breve">Em breve</span>';

  function cartaoCurso(c) {
    const totalAulas = c.modulos.reduce((n, m) => n + m.aulas.length, 0);
    return `
      <a class="cartao" href="curso.html?id=${encodeURIComponent(c.id)}">
        <div class="selos">${seloStatus(c.status)}${c.setores.map((s) => `<span class="selo">${nomeSetor(s)}</span>`).join("")}</div>
        <h3>${c.titulo}</h3>
        <p>${c.resumo}</p>
        <div class="rodape"><span>${c.nivel}</span><span>${c.cargaHoraria} · ${totalAulas} aulas</span></div>
      </a>`;
  }

  // Página inicial: áreas
  const listaAreas = document.getElementById("lista-areas");
  if (listaAreas) {
    listaAreas.innerHTML = dados.areas
      .map(
        (a) => `
        <${a.ativa ? `a href="cursos.html?area=${a.id}"` : "div"} class="cartao ${a.ativa ? "" : "inativo"}">
          <div class="icone">${a.icone}</div>
          <h3>${a.nome}</h3>
          <p>${a.descricao}</p>
          <div class="selos">${a.ativa ? '<span class="selo selo-ok">Começando por aqui</span>' : '<span class="selo selo-breve">Em breve</span>'}</div>
        </${a.ativa ? "a" : "div"}>`
      )
      .join("");
  }

  // Página inicial: destaques
  const destaques = document.getElementById("cursos-destaque");
  if (destaques) {
    destaques.innerHTML = dados.cursos.slice(0, 3).map(cartaoCurso).join("");
  }

  // Catálogo com filtro por setor
  const catalogo = document.getElementById("catalogo");
  if (catalogo) {
    const params = new URLSearchParams(location.search);
    const area = params.get("area");
    let setorAtivo = params.get("setor") || "todos";

    const filtros = document.getElementById("filtros");
    const opcoes = [{ id: "todos", nome: "Todos" }, ...dados.setores];
    function render() {
      filtros.innerHTML = opcoes
        .map((o) => `<button class="filtro ${o.id === setorAtivo ? "ativo" : ""}" data-setor="${o.id}">${o.nome}</button>`)
        .join("");
      const lista = dados.cursos.filter(
        (c) => (!area || c.area === area) && (setorAtivo === "todos" || c.setores.includes(setorAtivo))
      );
      catalogo.innerHTML = lista.length
        ? lista.map(cartaoCurso).join("")
        : '<p class="secao-sub">Nenhum curso neste filtro ainda.</p>';
    }
    filtros.addEventListener("click", (e) => {
      const b = e.target.closest("[data-setor]");
      if (!b) return;
      setorAtivo = b.dataset.setor;
      render();
    });
    render();
  }

  // Página de um curso
  const paginaCurso = document.getElementById("pagina-curso");
  if (paginaCurso) {
    const id = new URLSearchParams(location.search).get("id");
    const c = dados.cursos.find((x) => x.id === id);
    if (!c) {
      paginaCurso.innerHTML = '<section><div class="container"><h1>Curso não encontrado</h1><a class="botao botao-primario" href="cursos.html">Ver catálogo</a></div></section>';
      return;
    }
    document.title = `${c.titulo} | Rota Industrial`;
    const areaNome = (dados.areas.find((a) => a.id === c.area) || {}).nome || c.area;
    const totalAulas = c.modulos.reduce((n, m) => n + m.aulas.length, 0);
    const progresso = lerProgresso();
    const todas = aulasDoCurso(c);
    const concluidas = todas.filter((x) => progresso[chaveAula(c.id, x.m, x.a)]).length;
    const proxima = todas.find((x) => !progresso[chaveAula(c.id, x.m, x.a)]) || todas[0];
    paginaCurso.innerHTML = `
      <div class="curso-topo"><div class="container">
        <div class="migalha"><a href="index.html">Início</a> › <a href="cursos.html?area=${c.area}">${areaNome}</a> › ${c.titulo}</div>
        <h1>${c.titulo}</h1>
        <p class="secao-sub" style="margin:0 0 16px">${c.resumo}</p>
        <div class="selos">${seloStatus(c.status)}<span class="selo">${c.nivel}</span><span class="selo">${c.cargaHoraria}</span><span class="selo">${c.modulos.length} módulos · ${totalAulas} aulas</span>${c.setores.map((s) => `<span class="selo">${nomeSetor(s)}</span>`).join("")}</div>
      </div></div>
      <section><div class="container">
        <h2 class="secao-titulo">Conteúdo do curso</h2>
        <p class="secao-sub">Grade prevista. As aulas serão liberadas conforme forem gravadas.</p>
        <div class="progresso"><div class="progresso-barra" style="width:${Math.round((concluidas / totalAulas) * 100)}%"></div></div>
        <p class="secao-sub" style="margin:-20px 0 24px">${concluidas} de ${totalAulas} aulas concluídas
          · <a href="${linkAula(c.id, proxima.m, proxima.a)}">${concluidas ? "Continuar" : "Começar pela 1ª aula"} →</a></p>
        ${c.modulos
          .map(
            (m, i) => `
          <details class="modulo" ${i === 0 ? "open" : ""}>
            <summary><span>Módulo ${i + 1} — ${m.titulo}</span><span class="selo">${m.aulas.length} aulas</span></summary>
            <ol>${m.aulas
              .map((a, ai) => {
                const feita = progresso[chaveAula(c.id, i + 1, ai + 1)];
                return `<li><a href="${linkAula(c.id, i + 1, ai + 1)}">${a}</a>${feita ? ' <span class="feita" title="Concluída">✓</span>' : ""}</li>`;
              })
              .join("")}</ol>
          </details>`
          )
          .join("")}
      </div></section>`;
  }

  // Página de uma aula: aula.html?curso=<id>&aula=<modulo>-<aula>
  const paginaAula = document.getElementById("pagina-aula");
  if (paginaAula) {
    const params = new URLSearchParams(location.search);
    const c = dados.cursos.find((x) => x.id === params.get("curso"));
    const [m, a] = (params.get("aula") || "1-1").split("-").map(Number);
    const todas = c ? aulasDoCurso(c) : [];
    const pos = todas.findIndex((x) => x.m === m && x.a === a);
    if (!c || pos < 0) {
      paginaAula.innerHTML = '<section><div class="container"><h1>Aula não encontrada</h1><a class="botao botao-primario" href="cursos.html">Ver catálogo</a></div></section>';
      return;
    }
    const aula = todas[pos];
    const anterior = todas[pos - 1];
    const seguinte = todas[pos + 1];
    const chave = chaveAula(c.id, m, a);
    document.title = `${aula.titulo} | ${c.titulo} | Rota Industrial`;

    // O conteúdo de cada curso fica em data/aulas/<curso>.js (carregado só aqui)
    window.ROTA_AULAS = window.ROTA_AULAS || {};
    const script = document.createElement("script");
    script.src = `data/aulas/${c.id}.js`;
    script.onload = script.onerror = () => render(((window.ROTA_AULAS[c.id] || {})[`${m}-${a}`]) || null);
    document.body.appendChild(script);

    function render(conteudo) {
      const progresso = lerProgresso();
      const feita = !!progresso[chave];
      const video = conteudo && conteudo.youtube
        ? `<div class="video"><iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(conteudo.youtube)}" title="${aula.titulo}" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe></div>`
        : `<div class="video video-vazio"><span>🎬</span><p>Vídeo em produção</p></div>`;
      const texto = conteudo && conteudo.texto
        ? `<article class="aula-texto">${conteudo.texto}</article>`
        : `<article class="aula-texto"><p class="secao-sub">O material escrito desta aula ainda está sendo preparado.</p></article>`;
      const materiais = conteudo && conteudo.materiais && conteudo.materiais.length
        ? `<h3>Materiais</h3><ul class="materiais">${conteudo.materiais.map((x) => `<li><a href="${x.url}" target="_blank" rel="noopener">📄 ${x.nome}</a></li>`).join("")}</ul>`
        : "";

      const lateral = c.modulos
        .map((mod, mi) => `
          <div class="lateral-modulo">Módulo ${mi + 1} — ${mod.titulo}</div>
          <ol>${mod.aulas.map((t, ai) => {
            const atual = mi + 1 === m && ai + 1 === a;
            const ok = progresso[chaveAula(c.id, mi + 1, ai + 1)];
            return `<li class="${atual ? "atual" : ""}"><a href="${linkAula(c.id, mi + 1, ai + 1)}">${ok ? "✓ " : ""}${t}</a></li>`;
          }).join("")}</ol>`)
        .join("");

      paginaAula.innerHTML = `
        <div class="container aula-layout">
          <div class="aula-principal">
            <div class="migalha"><a href="index.html">Início</a> › <a href="curso.html?id=${c.id}">${c.titulo}</a> › Módulo ${m}</div>
            <h1 class="aula-titulo">${aula.titulo}</h1>
            <p class="secao-sub" style="margin:0 0 16px">Módulo ${m} — ${aula.modulo} · Aula ${pos + 1} de ${todas.length}${conteudo && conteudo.duracao ? ` · ${conteudo.duracao}` : ""}</p>
            ${video}
            <div class="aula-acoes">
              <button class="botao ${feita ? "botao-secundario" : "botao-primario"}" id="marcar">${feita ? "✓ Concluída (desmarcar)" : "Marcar como concluída"}</button>
            </div>
            ${texto}
            ${materiais}
            <nav class="aula-nav">
              ${anterior ? `<a class="botao botao-secundario" href="${linkAula(c.id, anterior.m, anterior.a)}">← ${anterior.titulo}</a>` : "<span></span>"}
              ${seguinte ? `<a class="botao botao-primario" href="${linkAula(c.id, seguinte.m, seguinte.a)}">${seguinte.titulo} →</a>` : `<a class="botao botao-primario" href="curso.html?id=${c.id}">Voltar ao curso</a>`}
            </nav>
          </div>
          <aside class="aula-lateral">
            <a class="lateral-curso" href="curso.html?id=${c.id}">${c.titulo}</a>
            ${lateral}
          </aside>
        </div>`;

      document.getElementById("marcar").addEventListener("click", () => {
        const p = lerProgresso();
        if (p[chave]) delete p[chave]; else p[chave] = Date.now();
        salvarProgresso(p);
        render(conteudo);
      });
    }
  }
})();
