// Rota Industrial — Simulado final de um curso (simulado.html?curso=<id>)
// Sorteia até 20 questões dos testes do curso, com tempo, sem mostrar a resposta até o fim.
// Aprovação: 70 %. O simulado aprovado é exigido para o certificado.
(function () {
  "use strict";
  const raiz = document.getElementById("pagina-simulado");
  if (!raiz) return;
  const U = window.RotaUtil, Aluno = window.RotaAluno, Ef = window.RotaEfeitos;
  const { esc, toast, linkAula, linkCurso, acharCurso, aulasDoCurso, quizDe, estadoCurso, XP } = U;
  const c = acharCurso(new URLSearchParams(location.search).get("curso"));
  const MAX = 20, SEG_POR_QUESTAO = 90, APROVA = 70;
  if (!c) { raiz.innerHTML = '<section><div class="container"><h1>Curso não encontrado</h1><a class="botao botao-primario" href="cursos.html">Ver catálogo</a></div></section>'; return; }
  document.title = `Simulado: ${c.titulo} | Rota Industrial`;

  const rnd = (n) => Math.floor(Math.random() * n);
  const embaralhar = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  let banco = [];

  // monta o banco de questões a partir do texto das aulas + alternativas
  async function montarBanco() {
    const A = await U.carregarCurso(c.id);
    const lista = [];
    aulasDoCurso(c).forEach((x) => {
      const alt = quizDe(c.id, x.k), aula = A[x.k];
      if (!alt || !aula) return;
      const div = document.createElement("div");
      div.innerHTML = aula.texto;
      const dets = [...div.querySelectorAll("details")].filter((d) => /^\s*\d+\./.test((d.querySelector("summary") || {}).textContent || ""));
      if (dets.length !== alt.length) return;
      dets.forEach((d, i) => {
        const sum = d.querySelector("summary"), enunciado = sum.innerHTML.replace(/^\s*\d+\.\s*/, "");
        sum.remove();
        lista.push({ aula: x, enunciado, explicacao: d.innerHTML, opcoes: alt[i] });
      });
    });
    return lista;
  }

  function inicio() {
    const ant = Aluno.simulado(c.id), n = Math.min(MAX, banco.length), tempo = n * SEG_POR_QUESTAO;
    raiz.innerHTML = `<div class="pagina-topo"><div class="container">
        <div class="migalha"><a href="index.html">Início</a> › <a href="${linkCurso(c.id)}">${esc(c.titulo)}</a> › Simulado</div>
        <h1>Simulado final</h1><p>${esc(c.titulo)}</p></div></div>
      <section><div class="container" style="max-width:760px">
        <div class="bloco simulado-inicio">
          <div class="sim-numeros"><div><strong>${n}</strong><span>questões sorteadas</span></div><div><strong>${Math.round(tempo / 60)} min</strong><span>de tempo</span></div><div><strong>${APROVA}%</strong><span>para aprovar</span></div></div>
          <ul class="sim-regras">
            <li>As questões vêm de todos os testes do curso, em ordem aleatória.</li>
            <li>Você só vê as respostas certas <b>no final</b>. Dá para voltar e trocar a resposta antes de entregar.</li>
            <li>Se o tempo acabar, o simulado é entregue com o que estiver respondido.</li>
            <li>Aprovado pela 1ª vez: <b>+${XP.simulado} XP</b>. A aprovação é exigida para o certificado.</li>
          </ul>
          ${ant ? `<p class="secao-sub">Sua melhor nota: <b>${ant.melhor}%</b> · ${ant.tentativas} tentativa${ant.tentativas > 1 ? "s" : ""}${ant.melhor >= APROVA ? " · ✔ aprovado" : ""}</p>` : ""}
          <button class="botao botao-primario" id="sim-comecar" style="width:100%">Começar o simulado →</button>
          ${banco.length < 5 ? '<p class="erro-msg">Este curso ainda tem poucas questões para um simulado.</p>' : ""}
        </div></div></section>`;
    document.getElementById("sim-comecar").addEventListener("click", () => prova(n, tempo));
  }

  function prova(n, tempoTotal) {
    const qs = embaralhar(banco).slice(0, n).map((q) => ({ ...q, ordem: embaralhar([0, 1, 2, 3]) }));
    const resp = new Array(n).fill(null), revisar = new Array(n).fill(false);
    let atual = 0, resta = tempoTotal, terminado = false;
    const inicioMs = Date.now();
    const aviso = (e) => { if (!terminado) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", aviso);
    raiz.innerHTML = `<div class="sim-barra"><div class="container">
        <div><b>${esc(c.titulo)}</b><small id="sim-cont"></small></div>
        <div class="sim-relogio" id="sim-relogio">⏱ ${mmss(resta)}</div>
        <button class="botao botao-primario botao-pequeno" id="sim-entregar">Entregar</button>
      </div><div class="sim-progresso"><div id="sim-prog"></div></div></div>
      <section style="padding-top:24px"><div class="container sim-layout">
        <div class="bloco sim-questao" id="sim-q"></div>
        <aside class="bloco sim-mapa"><h3>Questões</h3><div class="sim-grade" id="sim-grade"></div>
          <p class="nota-mini">🟡 respondida · 🔖 marcada para revisar</p></aside>
      </div></section>`;
    const relogio = document.getElementById("sim-relogio");
    const timer = setInterval(() => {
      resta = tempoTotal - Math.floor((Date.now() - inicioMs) / 1000);
      if (resta <= 0) { resta = 0; relogio.textContent = "⏱ 00:00"; toast("⏰", "Tempo esgotado", "Simulado entregue automaticamente."); entregar(); return; }
      relogio.textContent = `⏱ ${mmss(resta)}`;
      relogio.classList.toggle("urgente", resta <= 60);
    }, 500);

    function desenhar() {
      const q = qs[atual];
      document.getElementById("sim-cont").textContent = ` · questão ${atual + 1} de ${n} · ${resp.filter((x) => x !== null).length} respondidas`;
      document.getElementById("sim-prog").style.width = `${(resp.filter((x) => x !== null).length / n) * 100}%`;
      document.getElementById("sim-q").innerHTML = `
        <div class="sim-topo-q"><span class="selo">Questão ${atual + 1}/${n}</span><small>${esc(q.aula.titulo)}</small></div>
        <div class="enunciado sim-enunciado">${q.enunciado}</div>
        <div class="opcoes">${q.ordem.map((o, j) => `<button class="opcao ${resp[atual] === o ? "escolhida" : ""}" data-o="${o}"><span class="letra">${"ABCD"[j]}</span><span>${esc(q.opcoes[o])}</span></button>`).join("")}</div>
        <div class="sim-nav">
          <button class="botao botao-secundario botao-pequeno" id="sim-ant" ${atual ? "" : "disabled"}>← Anterior</button>
          <button class="botao botao-secundario botao-pequeno ${revisar[atual] ? "marcada" : ""}" id="sim-marcar">🔖 ${revisar[atual] ? "Marcada" : "Revisar depois"}</button>
          ${atual + 1 < n ? '<button class="botao botao-primario botao-pequeno" id="sim-prox">Próxima →</button>' : '<button class="botao botao-primario botao-pequeno" id="sim-fim">Entregar ✔</button>'}
        </div>`;
      document.getElementById("sim-grade").innerHTML = qs.map((_, i) => `<button class="${i === atual ? "atual" : ""} ${resp[i] !== null ? "feita" : ""} ${revisar[i] ? "revisar" : ""}" data-ir="${i}">${i + 1}</button>`).join("");
      const box = document.getElementById("sim-q");
      box.querySelectorAll(".opcao").forEach((b) => b.addEventListener("click", () => {
        resp[atual] = Number(b.dataset.o);
        desenhar();
        if (atual + 1 < n) setTimeout(() => { atual++; desenhar(); }, 250);
      }));
      const ir = (i) => { atual = i; desenhar(); window.scrollTo({ top: 0, behavior: "smooth" }); };
      const ant = document.getElementById("sim-ant"); if (ant) ant.addEventListener("click", () => ir(atual - 1));
      const prox = document.getElementById("sim-prox"); if (prox) prox.addEventListener("click", () => ir(atual + 1));
      const fim = document.getElementById("sim-fim"); if (fim) fim.addEventListener("click", confirmar);
      document.getElementById("sim-marcar").addEventListener("click", () => { revisar[atual] = !revisar[atual]; desenhar(); });
      document.querySelectorAll("[data-ir]").forEach((b) => b.addEventListener("click", () => ir(Number(b.dataset.ir))));
    }
    function confirmar() {
      const faltam = resp.filter((x) => x === null).length;
      if (faltam && !confirm(`Ainda faltam ${faltam} questão(ões) sem resposta. Entregar mesmo assim?`)) return;
      entregar();
    }
    function entregar() {
      if (terminado) return;
      terminado = true;
      clearInterval(timer);
      window.removeEventListener("beforeunload", aviso);
      resultado(qs, resp, Math.min(tempoTotal, Math.round((Date.now() - inicioMs) / 1000)));
    }
    document.getElementById("sim-entregar").addEventListener("click", confirmar);
    desenhar();
  }

  function resultado(qs, resp, segundos) {
    const n = qs.length, acertos = resp.filter((r, i) => r === 0).length;
    const nota = Math.round((acertos / n) * 100), aprovado = nota >= APROVA;
    const antes = Aluno.simulado(c.id);
    const x = Aluno.registrarSimulado(c.id, nota, segundos);
    const e = estadoCurso(c);
    // desempenho por módulo
    const mods = {};
    qs.forEach((q, i) => { const m = q.aula.modulo; mods[m] = mods[m] || { ok: 0, n: 0 }; mods[m].n++; if (resp[i] === 0) mods[m].ok++; });
    raiz.innerHTML = `<div class="pagina-topo"><div class="container">
        <div class="migalha"><a href="${linkCurso(c.id)}">${esc(c.titulo)}</a> › Simulado › Resultado</div>
        <h1>${aprovado ? "Aprovado! 🎉" : "Ainda não foi desta vez"}</h1>
        <p>${aprovado ? "Você passou no simulado final." : `Você precisa de ${APROVA}% para aprovar. Revise as aulas abaixo e tente de novo.`}</p></div></div>
      <section style="padding-top:28px"><div class="container" style="max-width:860px">
        <div class="bloco sim-resultado">
          <div class="sim-nota ${aprovado ? "ok" : "nok"}"><strong>${nota}%</strong><span>${acertos} de ${n} certas</span></div>
          <div class="sim-dados"><p>⏱ Tempo: <b>${Math.floor(segundos / 60)} min ${segundos % 60} s</b></p>
            <p>🏆 Melhor nota: <b>${x.melhor}%</b>${antes && nota > antes.melhor ? " (novo recorde!)" : ""} · ${x.tentativas} tentativa${x.tentativas > 1 ? "s" : ""}</p>
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">
              <button class="botao botao-secundario botao-pequeno" id="sim-refazer">↻ Fazer outro simulado</button>
              <a class="botao botao-secundario botao-pequeno" href="${linkCurso(c.id)}">Voltar ao curso</a>
              ${e.certificado ? `<a class="botao botao-primario botao-pequeno" href="certificado.html?curso=${c.id}">🎓 Ver certificado</a>` : aprovado ? `<a class="botao botao-primario botao-pequeno" href="certificado.html?curso=${c.id}">O que falta para o certificado</a>` : ""}
            </div></div>
        </div>
        <div class="bloco"><h2>Desempenho por módulo</h2>
          ${Object.entries(mods).map(([m, v]) => { const p = Math.round((v.ok / v.n) * 100); return `<div class="adm-curso-linha"><div><b>${esc(m)}</b><small>${v.ok} de ${v.n} certas · ${p}%</small></div><div class="barra-h"><div style="width:${p}%;background:${p >= 70 ? "var(--ok)" : p >= 50 ? "var(--brand)" : "var(--erro)"}"></div></div></div>`; }).join("")}
        </div>
        <div class="bloco"><h2>Correção</h2>
          ${qs.map((q, i) => { const r = resp[i], ok = r === 0; return `<div class="sim-correcao ${ok ? "ok" : "nok"}">
            <div class="sim-c-topo"><span>${ok ? "✔" : "✘"} Questão ${i + 1}</span><a href="${linkAula(c.id, q.aula.k)}">${esc(q.aula.titulo)} →</a></div>
            <div class="enunciado">${q.enunciado}</div>
            ${ok ? `<p class="sim-c-resp">Sua resposta: <b>${esc(q.opcoes[0])}</b></p>` : `<p class="sim-c-resp">Sua resposta: <b>${r === null ? "em branco" : esc(q.opcoes[r])}</b><br>Certa: <b>${esc(q.opcoes[0])}</b></p>`}
            <div class="explicacao">${q.explicacao}</div></div>`; }).join("")}
        </div>
      </div></section>`;
    document.getElementById("sim-refazer").addEventListener("click", () => { inicio(); window.scrollTo(0, 0); });
    window.scrollTo(0, 0);
    if (aprovado) setTimeout(() => Ef.confete(null, null, nota === 100 ? 160 : 100), 300);
  }

  raiz.innerHTML = '<section><div class="container"><p class="vazio">Preparando o simulado…</p></div></section>';
  montarBanco().then((b) => { banco = b; inicio(); });
})();
