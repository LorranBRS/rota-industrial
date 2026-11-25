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
        ${c.modulos
          .map(
            (m, i) => `
          <details class="modulo" ${i === 0 ? "open" : ""}>
            <summary><span>Módulo ${i + 1} — ${m.titulo}</span><span class="selo">${m.aulas.length} aulas</span></summary>
            <ol>${m.aulas.map((a) => `<li>${a}</li>`).join("")}</ol>
          </details>`
          )
          .join("")}
      </div></section>`;
  }
})();
