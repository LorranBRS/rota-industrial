/*
 * Conteúdo das aulas do curso "Análise de Circuitos em Corrente Contínua".
 * Chave = "<módulo>-<aula>" (mesma ordem de data/cursos.js).
 *
 * Circuito de referência (usado em várias aulas para comparar métodos):
 *   E1 = 20 V, R1 = 2 Ω, R3 = 4 Ω, R2 = 2 Ω, E2 = 10 V
 *   Resposta: VA = 12 V · I1 = 4 A · I3 = 3 A · I2 = 1 A (entrando no + de E2)
 */
window.ROTA_AULAS = window.ROTA_AULAS || {};
(function () {
  const fig = (nome, alt, legenda) =>
    '<figure class="diagrama"><img src="assets/img/diagramas/' + nome + '.svg" alt="' + alt + '" loading="lazy"><figcaption>' + legenda + "</figcaption></figure>";

  window.ROTA_AULAS["analise-circuitos-cc"] = {
    "1-1": {
      duracao: "8 min de leitura",
      texto: `
        <h2>Vocabulário dos circuitos</h2>
        <ul>
          <li><strong>Nó:</strong> ponto onde se ligam <strong>três ou mais</strong> condutores.</li>
          <li><strong>Ramo:</strong> trecho entre dois nós, percorrido por uma única corrente.</li>
          <li><strong>Malha:</strong> qualquer caminho fechado do circuito.</li>
        </ul>

        <h2>1ª Lei de Kirchhoff (lei dos nós)</h2>
        <p>Carga elétrica não se acumula num nó. Portanto:</p>
        <div class="destaque"><strong>A soma das correntes que entram num nó é igual à soma das correntes que saem.</strong><br>
        Σ I<sub>entrando</sub> = Σ I<sub>saindo</sub></div>

        ${fig("cc-lei-dos-nos", "Nó com uma corrente entrando e três saindo", "Entram 10 A; saem 3 A, 4 A e a corrente desconhecida.")}

        <h2>Exemplo resolvido</h2>
        <p>Entram 10 A num nó. Saem 3 A e 4 A por dois ramos. Quanto sai pelo terceiro?<br>
        10 = 3 + 4 + I → <strong>I = 3 A</strong></p>

        <h2>E se a conta der negativa?</h2>
        <p>Você pode escolher o sentido das correntes desconhecidas como quiser. Se o resultado der <strong>negativo</strong>, a corrente
        real tem o sentido contrário ao que você desenhou. Nada está errado.</p>

        <h2>No quadro de distribuição</h2>
        <p>O barramento de um quadro é um nó: a corrente do disjuntor geral é a soma das correntes dos circuitos ligados naquela fase.
        Com o alicate amperímetro dá para conferir: geral = soma dos parciais. Se não fechar, há carga ligada fora do lugar.</p>

        <h2>Teste rápido</h2>
        <details><summary>1. Entram 6 A e 2 A num nó; sai uma corrente única. Quanto vale?</summary><p><strong>8 A</strong>.</p></details>
        <details><summary>2. Calculei I = −1,5 A. O que significa?</summary><p>A corrente tem 1,5 A no <strong>sentido oposto</strong> ao desenhado.</p></details>
      `
    },
    "1-2": {
      duracao: "9 min de leitura",
      texto: `
        <h2>2ª Lei de Kirchhoff (lei das malhas)</h2>
        <p>Percorrendo qualquer caminho fechado e voltando ao ponto de partida, você volta ao mesmo potencial. Então:</p>
        <div class="destaque"><strong>A soma das tensões ao longo de uma malha fechada é zero.</strong><br>
        Em outras palavras: o que as fontes "sobem" os resistores "descem".</div>

        <h2>Regra de sinais (escolha um sentido e mantenha)</h2>
        <ul>
          <li>Atravessar uma fonte do <strong>− para o +</strong>: a tensão <strong>sobe</strong> (+E).</li>
          <li>Atravessar uma fonte do <strong>+ para o −</strong>: a tensão <strong>desce</strong> (−E).</li>
          <li>Atravessar um resistor <strong>no sentido da corrente</strong>: a tensão <strong>desce</strong> (−R·I).</li>
          <li>Atravessar um resistor <strong>contra a corrente</strong>: a tensão <strong>sobe</strong> (+R·I).</li>
        </ul>

        ${fig("serie", "Malha simples com três resistores em série", "Numa malha simples, a soma das quedas é igual à tensão da fonte.")}

        <h2>Exemplo 1 — uma fonte</h2>
        <p>Fonte de 12 V com 10 Ω, 20 Ω e 30 Ω em série (figura). Percorrendo no sentido da corrente:<br>
        +12 − 10·I − 20·I − 30·I = 0 → 60·I = 12 → <strong>I = 0,2 A</strong>.</p>

        <h2>Exemplo 2 — duas fontes em oposição</h2>
        <p>Numa malha há uma fonte de 12 V e outra de 4 V ligadas "uma contra a outra" (+ com +), mais dois resistores de 2 Ω.<br>
        +12 − 4 − 2·I − 2·I = 0 → 4·I = 8 → <strong>I = 2 A</strong>, no sentido imposto pela fonte maior.</p>
        <p>É o que acontece quando um carregador (fonte maior) carrega uma bateria (fonte menor).</p>

        <h2>Na prática</h2>
        <p>A lei das malhas explica por que, se a carga recebe menos que a tensão da fonte, a diferença ficou "no caminho":
        nos cabos, nos bornes ou em um mau contato. Medir a tensão em cada trecho e somar ajuda a achar onde está a perda.</p>

        <h2>Teste rápido</h2>
        <details><summary>1. Uma malha tem fonte de 24 V e dois resistores; um tem 10 V sobre ele. E o outro?</summary><p><strong>14 V</strong>.</p></details>
        <details><summary>2. 9 V e 3 V em oposição, com 3 Ω no total. Corrente?</summary><p>(9 − 3) / 3 = <strong>2 A</strong>.</p></details>
      `
    },
    "1-3": {
      duracao: "11 min de leitura",
      texto: `
        <h2>Quando as fórmulas de série/paralelo não bastam</h2>
        <p>Com duas fontes em ramos diferentes, não dá para reduzir o circuito a um resistor equivalente. A solução é montar
        um sistema de equações com as <strong>duas leis de Kirchhoff</strong>.</p>

        <h2>O circuito de referência deste curso</h2>
        <p>Vamos usar o mesmo circuito em várias aulas para comparar os métodos. Desta vez, já com a resposta:</p>
        ${fig("cc-duas-fontes", "Circuito com duas fontes e três resistores, com as correntes calculadas", "E1 = 20 V, R1 = 2 Ω, R3 = 4 Ω, R2 = 2 Ω, E2 = 10 V.")}

        <h2>Passo a passo</h2>
        <ol>
          <li><strong>Escolha os sentidos:</strong> I1 saindo de E1 para o nó A; I3 descendo por R3; I2 indo de A para E2.</li>
          <li><strong>Lei dos nós em A:</strong> I1 = I2 + I3</li>
          <li><strong>Malha da esquerda</strong> (E1, R1, R3): 20 = 2·I1 + 4·I3</li>
          <li><strong>Malha da direita</strong> (R3, R2, E2): a tensão em R3 é igual à de R2 mais E2 → 4·I3 = 2·I2 + 10</li>
        </ol>

        <h2>Resolvendo</h2>
        <ol>
          <li>Da malha da direita: I2 = (4·I3 − 10) / 2 = 2·I3 − 5</li>
          <li>No nó: I1 = (2·I3 − 5) + I3 = 3·I3 − 5</li>
          <li>Na malha da esquerda: 20 = 2·(3·I3 − 5) + 4·I3 = 10·I3 − 10 → <strong>I3 = 3 A</strong></li>
          <li>Então <strong>I2 = 1 A</strong> e <strong>I1 = 4 A</strong></li>
          <li>Tensão no nó A: V<sub>A</sub> = 4 Ω × 3 A = <strong>12 V</strong></li>
        </ol>

        <div class="destaque"><strong>Conferência:</strong> no nó, 4 = 1 + 3 ✓ · na malha da esquerda, 2×4 + 4×3 = 20 ✓</div>

        <h2>Interpretando</h2>
        <p>I2 é positivo no sentido de A para E2: a corrente <strong>entra pelo + de E2</strong>. Ou seja, a fonte E2 está
        <strong>recebendo energia</strong> — sendo carregada. É exatamente o que acontece com a bateria de um carro ligada ao alternador,
        ou com as baterias de um nobreak.</p>

        <h2>Teste rápido</h2>
        <details><summary>1. Quantas equações independentes precisamos para 3 correntes desconhecidas?</summary><p><strong>Três</strong> (aqui: 1 de nó + 2 de malha).</p></details>
        <details><summary>2. Qual a potência dissipada em R3?</summary><p>P = 4 × 3² = <strong>36 W</strong>.</p></details>
      `
    },
    "2-1": {
      duracao: "10 min de leitura",
      texto: `
        <h2>Menos incógnitas: correntes de malha</h2>
        <p>No método das malhas (também chamado de <strong>método de Maxwell</strong>), em vez de uma corrente por ramo, imaginamos uma
        corrente <strong>circulando em cada malha</strong>. No circuito de referência são só duas: Ia e Ib.</p>
        ${fig("cc-malhas", "Circuito de referência com as correntes de malha Ia e Ib no sentido horário", "Correntes de malha no sentido horário. Em R3 passam as duas, em sentidos opostos.")}

        <h2>Montando as equações</h2>
        <p>Regra prática para cada malha (sentido horário):</p>
        <div class="destaque">(soma dos resistores da malha) × I<sub>malha</sub> − (resistor comum) × I<sub>vizinha</sub> = soma das fontes no sentido da malha</div>
        <ul>
          <li><strong>Malha a:</strong> (2 + 4)·Ia − 4·Ib = +20 (Ia sobe por E1, do − para o +) → <strong>6·Ia − 4·Ib = 20</strong></li>
          <li><strong>Malha b:</strong> (4 + 2)·Ib − 4·Ia = −10 (Ib desce por E2, do + para o −) → <strong>−4·Ia + 6·Ib = −10</strong></li>
        </ul>

        <h2>Resolvendo o sistema</h2>
        <ol>
          <li>Multiplique a 1ª por 3: 18·Ia − 12·Ib = 60</li>
          <li>Multiplique a 2ª por 2: −8·Ia + 12·Ib = −20</li>
          <li>Some: 10·Ia = 40 → <strong>Ia = 4 A</strong></li>
          <li>Volte na 2ª: 6·Ib = −10 + 16 → <strong>Ib = 1 A</strong></li>
        </ol>

        <h2>Voltando às correntes de ramo</h2>
        <ul>
          <li>R1 só tem Ia → <strong>4 A</strong></li>
          <li>R2 só tem Ib → <strong>1 A</strong></li>
          <li>R3 tem as duas em sentidos opostos → Ia − Ib = <strong>3 A</strong> (para baixo)</li>
        </ul>
        <p>Mesma resposta da aula anterior, com 2 equações em vez de 3. Em circuitos maiores a economia é grande.</p>

        <h2>Teste rápido</h2>
        <details><summary>1. Quantas correntes de malha tem um circuito com 3 "janelas"?</summary><p><strong>Três</strong>.</p></details>
        <details><summary>2. Se Ib tivesse dado −1 A, o que mudaria?</summary><p>Ib circularia no sentido <strong>anti-horário</strong>.</p></details>
      `
    },
    "2-2": {
      duracao: "10 min de leitura",
      texto: `
        <h2>Uma fonte de cada vez</h2>
        <p>Em circuitos lineares (resistores comuns), o efeito de várias fontes é a <strong>soma dos efeitos de cada fonte agindo sozinha</strong>.</p>
        <div class="destaque"><strong>Como "desligar" uma fonte:</strong> fonte de tensão → troque por um <strong>curto</strong> (fio);
        fonte de corrente → troque por um <strong>circuito aberto</strong>.</div>

        <h2>Aplicando no circuito de referência</h2>
        <p>E1 = 20 V, R1 = 2 Ω, R3 = 4 Ω, R2 = 2 Ω, E2 = 10 V.</p>

        <h2>1) Só E1 (E2 em curto)</h2>
        <ul>
          <li>R3 e R2 ficam em paralelo: 4 × 2 / 6 = 1,333 Ω</li>
          <li>Total visto por E1: 2 + 1,333 = 3,333 Ω → corrente de E1 = 20 / 3,333 = <strong>6 A</strong></li>
          <li>Tensão em A: 6 × 1,333 = <strong>8 V</strong> → em R3: 8 / 4 = 2 A; em R2: 8 / 2 = 4 A (indo para E2)</li>
        </ul>

        <h2>2) Só E2 (E1 em curto)</h2>
        <ul>
          <li>R1 e R3 em paralelo: 2 × 4 / 6 = 1,333 Ω</li>
          <li>Total visto por E2: 2 + 1,333 = 3,333 Ω → corrente de E2 = 10 / 3,333 = <strong>3 A</strong> (saindo de E2 para A)</li>
          <li>Tensão em A: 3 × 1,333 = <strong>4 V</strong> → em R3: 1 A; em R1: 4 / 2 = 2 A (voltando para E1)</li>
        </ul>

        <h2>3) Somando (com sinais)</h2>
        <table>
          <tr><th>Grandeza</th><th>Só E1</th><th>Só E2</th><th>Total</th></tr>
          <tr><td>Tensão em A</td><td>8 V</td><td>4 V</td><td><strong>12 V</strong></td></tr>
          <tr><td>I3 (para baixo)</td><td>2 A</td><td>1 A</td><td><strong>3 A</strong></td></tr>
          <tr><td>I1 (de E1 para A)</td><td>6 A</td><td>−2 A</td><td><strong>4 A</strong></td></tr>
          <tr><td>I2 (de A para E2)</td><td>4 A</td><td>−3 A</td><td><strong>1 A</strong></td></tr>
        </table>
        <p>Terceiro método, mesma resposta.</p>

        <div class="destaque alerta"><strong>Atenção:</strong> a superposição vale para tensões e correntes, mas <strong>não para potência</strong>
        (P depende de I²). Calcule a corrente total primeiro e só depois a potência.</div>

        <h2>Teste rápido</h2>
        <details><summary>1. Como se "desliga" uma fonte de tensão na superposição?</summary><p>Substituindo por um <strong>curto-circuito</strong>.</p></details>
        <details><summary>2. Por que não somar as potências de cada caso?</summary><p>Porque P = R·I² não é linear: (2 + 1)² ≠ 2² + 1².</p></details>
      `
    },
    "3-1": {
      duracao: "11 min de leitura",
      texto: `
        <h2>A ideia</h2>
        <p>Qualquer circuito linear, visto de dois terminais A e B, se comporta como <strong>uma única fonte de tensão (Vth) em série com um
        resistor (Rth)</strong>. Isso é muito útil quando a carga muda e o resto do circuito não.</p>

        <h2>Como achar o equivalente</h2>
        <ol>
          <li>Retire a carga dos terminais A e B.</li>
          <li><strong>Vth</strong> = tensão entre A e B com a carga retirada (tensão "em aberto").</li>
          <li><strong>Rth</strong> = resistência vista de A e B com as fontes "desligadas" (tensão → curto).</li>
        </ol>

        <h2>Aplicando no circuito de referência (carga = R3)</h2>
        <ul>
          <li><strong>Vth:</strong> sem R3, sobra uma malha só: corrente = (20 − 10) / (2 + 2) = 2,5 A. Tensão em A = 20 − 2 × 2,5 = <strong>15 V</strong>.</li>
          <li><strong>Rth:</strong> com E1 e E2 em curto, R1 e R2 ficam em paralelo: 2 × 2 / 4 = <strong>1 Ω</strong>.</li>
        </ul>
        ${fig("cc-thevenin", "Equivalente de Thévenin de 15 V com 1 Ω alimentando R3 de 4 Ω", "Todo o lado esquerdo virou uma fonte de 15 V com 1 Ω em série.")}
        <p>Com R3 = 4 Ω: I = 15 / (1 + 4) = <strong>3 A</strong> e V<sub>A</sub> = 4 × 3 = <strong>12 V</strong> — de novo a mesma resposta.</p>

        <h2>Onde ele brilha: trocar a carga</h2>
        <p>E se R3 fosse 14 Ω? Sem refazer nada: I = 15 / (1 + 14) = <strong>1 A</strong>. E com R3 = 0 (curto)? I = 15 / 1 = 15 A.</p>

        <h2>Na vida real</h2>
        <p>Uma tomada, uma bateria ou a saída de um transformador se comportam como um equivalente de Thévenin: tensão "em vazio" e uma
        resistência interna. Por isso a tensão <strong>cai quando a carga aumenta</strong>. Medindo a tensão sem carga e com uma carga conhecida,
        dá para calcular a resistência interna.</p>

        <h2>Teste rápido</h2>
        <details><summary>1. Vth = 15 V, Rth = 1 Ω. Qual a corrente numa carga de 2 Ω?</summary><p>15 / 3 = <strong>5 A</strong>.</p></details>
        <details><summary>2. Uma bateria tem 12,6 V em vazio e 12,0 V fornecendo 10 A. Resistência interna?</summary><p>(12,6 − 12,0) / 10 = <strong>0,06 Ω</strong>.</p></details>
      `
    },
    "3-2": {
      duracao: "8 min de leitura",
      texto: `
        <h2>O "irmão" do Thévenin</h2>
        <p>O teorema de Norton diz que o mesmo circuito pode ser trocado por uma <strong>fonte de corrente (IN) em paralelo com um resistor (RN)</strong>.</p>
        <ul>
          <li><strong>IN</strong> = corrente que circula ao <strong>curto-circuitar</strong> os terminais A e B.</li>
          <li><strong>RN</strong> = a mesma resistência de Thévenin (RN = Rth).</li>
        </ul>

        <h2>Aplicando no circuito de referência</h2>
        <ul>
          <li>Curto entre A e B: E1 manda 20 / 2 = 10 A e E2 manda 10 / 2 = 5 A pelo curto → <strong>IN = 15 A</strong></li>
          <li><strong>RN = 1 Ω</strong> (igual ao Rth)</li>
        </ul>
        ${fig("cc-norton", "Fonte de corrente de 15 A com resistor de 1 Ω em paralelo alimentando R3", "Equivalente de Norton: 15 A em paralelo com 1 Ω.")}
        <p>Divisor de corrente para R3 = 4 Ω: I3 = 15 × 1 / (1 + 4) = <strong>3 A</strong>. Quinto método, mesma resposta.</p>

        <h2>Convertendo um no outro</h2>
        <div class="destaque"><strong>Vth = IN × RN</strong> &nbsp;·&nbsp; <strong>IN = Vth / Rth</strong> &nbsp;·&nbsp; <strong>Rth = RN</strong><br>
        Conferindo: 15 A × 1 Ω = 15 V ✓</div>

        <h2>Quando usar cada um</h2>
        <ul>
          <li><strong>Thévenin</strong> é mais intuitivo para cargas em série e fontes de tensão (baterias, redes).</li>
          <li><strong>Norton</strong> facilita quando há várias cargas em paralelo e em circuitos com sensores de corrente (ex.: transmissores 4–20 mA, que se comportam como fontes de corrente).</li>
        </ul>

        <h2>Teste rápido</h2>
        <details><summary>1. Vth = 24 V e Rth = 4 Ω. Qual o equivalente de Norton?</summary><p>IN = 24 / 4 = <strong>6 A</strong>, RN = <strong>4 Ω</strong>.</p></details>
        <details><summary>2. Como se "desliga" uma fonte de corrente para achar RN?</summary><p>Deixando o ramo <strong>aberto</strong>.</p></details>
      `
    },
    "4-1": {
      duracao: "9 min de leitura",
      texto: `
        <h2>O circuito</h2>
        <p>A <strong>ponte de Wheatstone</strong> tem quatro resistores em losango, uma fonte e um instrumento sensível (galvanômetro G) ligado
        entre os dois pontos do meio.</p>
        ${fig("cc-wheatstone", "Ponte de Wheatstone com R1, R2, R3, Rx e galvanômetro", "Quando a ponte está equilibrada, o galvanômetro marca zero.")}

        <h2>Equilíbrio</h2>
        <p>Quando os dois pontos do meio têm a mesma tensão, nenhuma corrente passa por G. Isso acontece quando:</p>
        <div class="destaque"><strong>R1 / R2 = R3 / Rx</strong> &nbsp;→&nbsp; <strong>Rx = R2 × R3 / R1</strong></div>

        <h2>Exemplo: medindo uma resistência desconhecida</h2>
        <p>R1 = 100 Ω, R2 = 150 Ω e R3 (ajustável) foi regulado até G zerar em 1.000 Ω:<br>
        Rx = 150 × 1.000 / 100 = <strong>1.500 Ω</strong></p>
        <p>A vantagem: a medição não depende da tensão da fonte nem da exatidão do galvanômetro — só de "achar o zero".</p>

        <h2>Ponte desequilibrada: virando sensor</h2>
        <p>Com fonte de 10 V e R1 = R2 = R3 = 1 kΩ, se Rx mudar para 1,1 kΩ:</p>
        <ul>
          <li>Ponto do meio à esquerda: 10 × 1.000 / 2.000 = 5,000 V</li>
          <li>Ponto do meio à direita: 10 × 1.100 / 2.100 = 5,238 V</li>
          <li>Diferença: <strong>0,238 V</strong> — proporcional à variação de Rx.</li>
        </ul>

        <h2>Onde aparece na indústria</h2>
        <ul>
          <li><strong>Células de carga</strong> (balanças industriais, pesagem de silos): extensômetros ligados em ponte.</li>
          <li><strong>Sensores de temperatura PT100</strong> ligados a transmissores.</li>
          <li><strong>Localização de defeitos em cabos</strong> longos (métodos em ponte).</li>
        </ul>

        <h2>Teste rápido</h2>
        <details><summary>1. R1 = 1 kΩ, R2 = 2 kΩ, R3 = 500 Ω, ponte equilibrada. Rx?</summary><p>Rx = 2.000 × 500 / 1.000 = <strong>1.000 Ω</strong>.</p></details>
        <details><summary>2. O que indica G marcando zero?</summary><p>Que a ponte está <strong>equilibrada</strong> (pontos do meio no mesmo potencial).</p></details>
      `
    },
    "4-2": {
      duracao: "9 min de leitura",
      texto: `
        <h2>Quanto de potência chega à carga?</h2>
        <p>Toda fonte real tem resistência interna (o Rth). Se a carga RL for muito pequena, a corrente é alta mas a tensão na carga é baixa;
        se RL for muito grande, a tensão é alta mas a corrente é pequena. Existe um ponto ótimo:</p>
        <div class="destaque"><strong>A carga recebe a potência máxima quando RL = Rth.</strong><br>
        Nesse ponto: <strong>P<sub>máx</sub> = Vth² / (4 · Rth)</strong></div>

        <h2>Exemplo com o circuito de referência</h2>
        <p>Equivalente de Thévenin: Vth = 15 V, Rth = 1 Ω.</p>
        <table>
          <tr><th>RL</th><th>I = 15 / (1 + RL)</th><th>P = RL · I²</th></tr>
          <tr><td>0,5 Ω</td><td>10 A</td><td>50 W</td></tr>
          <tr><td><strong>1 Ω</strong></td><td><strong>7,5 A</strong></td><td><strong>56,25 W</strong> ← máximo</td></tr>
          <tr><td>2 Ω</td><td>5 A</td><td>50 W</td></tr>
          <tr><td>4 Ω</td><td>3 A</td><td>36 W</td></tr>
        </table>
        <p>Conferindo pela fórmula: 15² / (4 × 1) = 225 / 4 = <strong>56,25 W</strong> ✓</p>
        ${fig("cc-max-potencia", "Curva da potência na carga em função de RL, com pico em 1 ohm", "A potência na carga é máxima quando RL é igual à resistência de Thévenin.")}

        <h2>O preço: rendimento de 50%</h2>
        <p>Com RL = Rth, a mesma potência que chega à carga é perdida dentro da fonte. O rendimento é só <strong>50%</strong>.</p>
        <ul>
          <li><strong>Sistemas de energia</strong> (rede, motores, instalações) <strong>não</strong> trabalham assim: lá o objetivo é rendimento alto,
          então a resistência da fonte e dos cabos deve ser muito <strong>menor</strong> que a da carga.</li>
          <li><strong>Eletrônica, áudio e telecomunicações</strong> usam o casamento (RL = Rth) para extrair o máximo de sinais fracos — o famoso
          "casamento de impedância" de alto-falantes e antenas.</li>
        </ul>

        <h2>Teste rápido</h2>
        <details><summary>1. Vth = 12 V, Rth = 2 Ω. Qual RL dá potência máxima e quanto vale?</summary><p>RL = <strong>2 Ω</strong>; P = 144 / 8 = <strong>18 W</strong>.</p></details>
        <details><summary>2. Por que a rede elétrica não opera em máxima transferência?</summary><p>Porque o rendimento seria de apenas <strong>50%</strong> — metade da energia perdida.</p></details>
      `
    }
  };
})();
