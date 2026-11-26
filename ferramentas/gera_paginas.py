"""Gera as páginas HTML do site (todas compartilham o mesmo <head>, cabeçalho e rodapé).

Uso (na raiz do projeto):  python3 ferramentas/gera_paginas.py
Ao mudar CSS ou JS, aumente VERSAO para o navegador baixar a versão nova.
"""
import os

VERSAO = "6"  # manter igual ao usado em sw.js
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DESC = "Rota Industrial: cursos online gratuitos de elétrica para os setores industrial, residencial e comercial, com testes, ranking e certificado."


def pagina(arq, titulo, id_pag, main_attr="", corpo="", desc=DESC):
    html = f'''<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>{titulo}</title>
  <meta name="description" content="{desc}">
  <meta name="theme-color" content="#0f1d30">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%230f1d30'/><path d='M56 10 24 58h22l-6 32 34-48H52z' fill='%23f5b300'/></svg>">
  <link rel="manifest" href="manifest.webmanifest">
  <link rel="apple-touch-icon" href="assets/icones/apple-touch-icon.png">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="Rota Industrial">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/style.css?v={VERSAO}">
</head>
<body data-pagina="{id_pag}">
  <header class="topo" id="topo"></header>
  <main{main_attr}>{corpo}</main>
  <footer class="rodape-site" id="rodape"></footer>
  <script src="data/cursos.js?v={VERSAO}"></script>
  <script src="data/quizzes.js?v={VERSAO}"></script>
  <script src="assets/js/main.js?v={VERSAO}"></script>
</body>
</html>
'''
    with open(os.path.join(RAIZ, arq), "w", encoding="utf-8") as f:
        f.write(html)


ARTE = '''<svg viewBox="0 0 440 380" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ilustração: painel com diagrama unifilar e cartões de pontuação">
  <defs><linearGradient id="pn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d3a60"/><stop offset="1" stop-color="#122842"/></linearGradient></defs>
  <rect x="40" y="30" width="300" height="320" rx="18" fill="url(#pn)" stroke="#2f5482" stroke-width="2"/>
  <rect x="40" y="30" width="300" height="16" rx="8" fill="#f5b300" opacity=".9"/>
  <g fill="none" stroke="#9fc1e8" stroke-width="3" stroke-linecap="round">
    <path d="M190 70v40"/><path d="M178 110h24"/><path d="M190 110l14-22" stroke="#f5b300"/>
    <path d="M190 130v40"/><rect x="172" y="170" width="36" height="46" rx="6"/><path d="M190 216v34"/>
    <circle cx="190" cy="285" r="34"/>
  </g>
  <text x="190" y="293" text-anchor="middle" font-family="Barlow Condensed, sans-serif" font-weight="700" font-size="24" fill="#fff">M 3~</text>
  <text x="222" y="98" font-family="Inter, sans-serif" font-size="12" fill="#9fb0c4">Q1</text>
  <text x="218" y="198" font-family="Inter, sans-serif" font-size="12" fill="#9fb0c4">K1 · F7</text>
  <g font-family="Inter, sans-serif">
    <rect x="250" y="64" width="176" height="62" rx="12" fill="#ffffff"/>
    <circle cx="276" cy="95" r="14" fill="#e1f4e9"/><text x="276" y="100" text-anchor="middle" font-size="14" fill="#1f8a4c">✔</text>
    <text x="298" y="90" font-size="13" font-weight="800" fill="#16202c">+10 XP</text>
    <text x="298" y="108" font-size="11.5" fill="#5a6676">Resposta certa</text>
    <rect x="0" y="196" width="160" height="62" rx="12" fill="#ffffff"/>
    <text x="16" y="233" font-size="20">🔥</text>
    <text x="46" y="222" font-size="13" font-weight="800" fill="#16202c">Sequência: 8</text>
    <text x="46" y="240" font-size="11.5" fill="#5a6676">acertos seguidos</text>
    <rect x="262" y="300" width="168" height="62" rx="12" fill="#f5b300"/>
    <text x="284" y="337" font-size="20">🏅</text>
    <text x="314" y="326" font-size="13" font-weight="800" fill="#0f1d30">Nível 5</text>
    <text x="314" y="344" font-size="11.5" fill="#3d2e00">Eletricista</text>
  </g>
</svg>'''

pagina("index.html", "Rota Industrial | Cursos de elétrica com testes, ranking e certificado", "inicio", corpo=f'''
    <section class="hero">
      <div class="container">
        <div>
          <span class="hero-tag">⚡ Trilha de Elétrica completa</span>
          <h1>Sua rota para a <em>elétrica profissional</em></h1>
          <p>Cursos práticos para quem trabalha — ou quer trabalhar — com instalações industriais, residenciais e comerciais. Estude, responda os testes, ganhe XP e suba no ranking.</p>
          <div class="acoes">
            <a class="botao botao-primario" href="curso.html?id=matematica-eletricistas">Começar a trilha →</a>
            <a class="botao botao-secundario" href="cursos.html">Ver catálogo</a>
          </div>
          <div class="numeros" id="numeros"></div>
        </div>
        <div class="hero-arte">{ARTE}</div>
      </div>
    </section>

    <div class="container oculto" id="cartao-app" style="margin-top:20px"></div>
    <div class="container oculto" id="continuar" style="margin-top:20px"></div>

    <section>
      <div class="container">
        <div class="secao-cabeca"><div><div class="eyebrow">Ordem recomendada</div><h2 class="secao-titulo">A trilha de Elétrica</h2></div>
          <p class="secao-sub">8 cursos, do cálculo básico aos comandos industriais.</p></div>
        <div class="trilha" id="trilha"></div>
      </div>
    </section>

    <section class="faixa">
      <div class="container">
        <div class="eyebrow">Como funciona</div><h2 class="secao-titulo">Estude, pratique, evolua</h2>
        <p class="secao-sub">Tudo gratuito e direto no navegador, sem cadastro.</p>
        <div class="grade-3" style="margin-top:28px">
          <div class="cartao etapa"><span class="num">1</span><div class="icone">📘</div><h3>Aulas com diagramas</h3><p>Texto direto ao ponto, exemplos de campo e mais de 50 diagramas desenhados para o curso.</p></div>
          <div class="cartao etapa"><span class="num">2</span><div class="icone">📝</div><h3>Testes com nota</h3><p>Cada aula termina com um teste de múltipla escolha. Acerte, ganhe XP e mantenha a sequência 🔥.</p></div>
          <div class="cartao etapa"><span class="num">3</span><div class="icone">🏆</div><h3>Ranking e certificado</h3><p>Suba de Aprendiz a Mestre da Rota, dispute o <a href="ranking.html">ranking</a> com outros alunos e emita certificados verificáveis.</p></div>
        </div>
      </div>
    </section>

    <section>
      <div class="container">
        <div class="eyebrow">Para cada tipo de obra</div><h2 class="secao-titulo">Três setores, uma rota</h2>
        <p class="secao-sub">Cada curso indica para qual tipo de instalação ele prepara você.</p>
        <div class="grade-3">
          <a class="cartao" href="cursos.html?setor=residencial"><div class="icone">🏠</div><h3>Residencial</h3><p>Casas e apartamentos: tomadas, iluminação, quadros, DR e DPS.</p></a>
          <a class="cartao" href="cursos.html?setor=comercial"><div class="icone">🏬</div><h3>Comercial</h3><p>Lojas, escritórios e prédios: trifásico, iluminação e eficiência.</p></a>
          <a class="cartao" href="cursos.html?setor=industrial"><div class="icone">🏭</div><h3>Industrial</h3><p>Fábricas: motores, comandos elétricos, painéis e automação.</p></a>
        </div>
      </div>
    </section>

    <section style="padding-top:0">
      <div class="container">
        <div class="eyebrow">Roteiro</div><h2 class="secao-titulo">Áreas de formação</h2>
        <p class="secao-sub">Começamos pela elétrica. As próximas áreas já estão no roteiro.</p>
        <div class="grade" id="lista-areas"></div>
      </div>
    </section>''')

pagina("cursos.html", "Cursos | Rota Industrial", "cursos", corpo='''
    <div class="pagina-topo"><div class="container">
      <div class="migalha"><a href="index.html">Início</a> › Cursos</div>
      <h1>Catálogo de cursos</h1>
      <p>Filtre pelo setor em que você atua. Todos os cursos têm aulas escritas, diagramas e testes com nota.</p>
    </div></div>
    <section><div class="container">
      <div class="filtros" id="filtros"></div>
      <div class="grade" id="catalogo"></div>
    </div></section>''')

pagina("curso.html", "Curso | Rota Industrial", "cursos", ' id="pagina-curso"')
pagina("aula.html", "Aula | Rota Industrial", "cursos", ' id="pagina-aula"')
pagina("perfil.html", "Meu progresso | Rota Industrial", "perfil", ' id="pagina-perfil"')
pagina("certificado.html", "Certificado | Rota Industrial", "perfil", ' id="pagina-certificado"')
pagina("ranking.html", "Ranking | Rota Industrial", "ranking", ' id="pagina-ranking"')

pagina("busca.html", "Buscar nas aulas | Rota Industrial", "busca", ' id="pagina-busca"', '''
    <div class="pagina-topo"><div class="container">
      <div class="migalha"><a href="index.html">Início</a> › Buscar</div>
      <h1>Buscar nas aulas</h1>
      <p>Procure um assunto em todas as 89 aulas: fórmulas, normas, componentes, ligações.</p>
      <form class="campo-busca" id="form-busca" role="search"><input id="q" type="search" placeholder="Ex.: disjuntor curva C, estrela-triângulo, NR-10" autocomplete="off" autofocus aria-label="Buscar"></form>
    </div></div>
    <section><div class="container" style="max-width:860px" id="resultados"></div></section>''')

pagina("verificar.html", "Verificar certificado | Rota Industrial", "verificar", ' id="pagina-verificar"', '''
    <div class="pagina-topo"><div class="container">
      <div class="migalha"><a href="index.html">Início</a> › Verificar certificado</div>
      <h1>Verificar certificado</h1>
      <p>Digite o código impresso no certificado (formato RI-XXXXX-XXXXX) para conferir se ele foi emitido pela Rota Industrial.</p>
      <form class="campo-busca" id="form-verificar"><input id="codigo" placeholder="RI-XXXXX-XXXXX" autocomplete="off" spellcheck="false" aria-label="Código do certificado"><button class="botao botao-primario">Verificar</button></form>
    </div></div>
    <section><div class="container" id="verificacao"></div></section>''')

pagina("sobre.html", "Sobre | Rota Industrial", "sobre", corpo='''
    <div class="pagina-topo"><div class="container">
      <div class="migalha"><a href="index.html">Início</a> › Sobre</div>
      <h1>Sobre a Rota Industrial</h1>
      <p>Uma plataforma de cursos online para profissionais dos setores industrial, residencial e comercial.</p>
    </div></div>
    <section><div class="container texto-simples">
      <p>O objetivo é ensinar de forma direta e prática, com exemplos reais de campo: o que o eletricista, o técnico de manutenção e o instalador realmente usam no dia a dia.</p>
      <h2>Por onde começamos</h2>
      <p>A primeira trilha é a de <strong>Elétrica</strong>, com 8 cursos: matemática, fundamentos, segurança, análise de circuitos, instalações residenciais e comerciais, comandos elétricos e motores.</p>
      <h2>Como o aprendizado é medido</h2>
      <p>Cada aula tem um teste de múltipla escolha. Acertos valem XP, acertos seguidos formam uma sequência e o XP leva você de <em>Aprendiz</em> a <em>Mestre da Rota</em>. O progresso fica salvo no seu navegador; se quiser, entre no <a href="ranking.html">ranking online</a> com um apelido (sem e-mail) para comparar com outros alunos e levar o progresso para outro aparelho.</p>
      <h2>Privacidade</h2>
      <p>Não pedimos e-mail nem senha. No ranking aparecem só o apelido, o nível e os pontos. O nome digitado no certificado só fica visível para quem tem o código dele. A conta online pode ser apagada a qualquer momento em <a href="perfil.html">Meu progresso</a>.</p>
      <h2>Importante</h2>
      <p>Os cursos são <strong>livres e introdutórios</strong>. Eles não substituem a formação técnica nem os treinamentos obrigatórios por norma, como a NR-10. Trabalho em eletricidade exige profissional qualificado, habilitado e autorizado.</p>
      <h2>Próximas áreas</h2>
      <ul><li>Automação industrial (CLP, sensores, inversores)</li><li>Refrigeração e climatização</li><li>Manutenção mecânica</li></ul>
      <p><a class="botao botao-primario" href="cursos.html">Ver cursos</a></p>
    </div></section>''')

pagina("offline.html", "Sem conexão | Rota Industrial", "offline", corpo='''
    <div class="pagina-topo"><div class="container">
      <h1>Você está sem internet</h1>
      <p>Esta página ainda não foi aberta neste aparelho, então não está guardada para uso offline. As aulas que você já abriu continuam disponíveis.</p>
      <p><a class="botao botao-primario" href="index.html">Ir para o início</a> <a class="botao botao-secundario" style="background:transparent;color:#fff;border-color:rgba(255,255,255,.3)" href="perfil.html">Meu progresso</a></p>
    </div></div>''')

print("páginas geradas")
