/*
 * Conteúdo das aulas do curso "Instalações Elétricas Comerciais".
 * Chave = "<módulo>-<aula>" (mesma ordem de data/cursos.js).
 *
 * Loja de exemplo usada no curso (rede trifásica 220/127 V, 3 fases + neutro):
 *   Salão de vendas 10 × 10 m, escritório, copa e banheiro.
 *   C1/C2 ilum. salão 480 VA cada (15 luminárias LED 32 W) · C3 ilum. demais 600 VA · C4 TUG salão 1.000 VA
 *   C5 TUG escritório 1.000 VA · C6 TUG copa 1.800 VA · C7 expositor refrigerado 800 VA (127 V)
 *   C8/C9 split 24.000 BTU/h 2.400 VA cada (220 V) · C10 split 12.000 BTU/h 1.200 VA (220 V)
 *   Total 12.160 VA. Fases (após equilíbrio): A 4.080 · B 3.880 · C 4.200 VA.
 * Regras resumidas da ABNT NBR 5410 e normas citadas — consultar as normas completas no projeto real.
 */
window.ROTA_AULAS = window.ROTA_AULAS || {};
(function () {
  const fig = (nome, alt, legenda) =>
    '<figure class="diagrama"><img src="assets/img/diagramas/' + nome + '.svg" alt="' + alt + '" loading="lazy"><figcaption>' + legenda + "</figcaption></figure>";
  const norma = '<div class="destaque"><strong>Norma:</strong> este curso resume regras da <strong>ABNT NBR 5410</strong> e de outras normas citadas. ' +
    'Instalações comerciais exigem projeto por profissional habilitado (com ART/TRT) e seguem também o padrão da concessionária e as exigências do Corpo de Bombeiros.</div>';

  window.ROTA_AULAS["instalacoes-comerciais"] = {
    "1-1": {
      duracao: "12 min de leitura",
      texto: `
        <h2>Por que o comércio usa trifásico</h2>
        <p>Lojas e escritórios têm ar-condicionado, motores, fornos e muitas cargas ao mesmo tempo. O sistema <strong>trifásico</strong> entrega mais potência
        com cabos mais finos, permite ligar motores trifásicos e distribui a carga em três fases.</p>
        ${norma}

        <h2>Tensão de linha e tensão de fase</h2>
        <p>O transformador da concessionária normalmente tem o secundário ligado em <strong>estrela</strong>, com o ponto central aterrado formando o <strong>neutro</strong>.
        Daí saem quatro condutores: três fases e o neutro.</p>
        ${fig("com-trifasico", "Secundário em estrela: 220 V entre fases e 127 V entre fase e neutro", "Sistema 220/127 V: as duas tensões saem do mesmo transformador.")}
        <ul>
          <li><strong>Tensão de linha (UL):</strong> entre duas fases.</li>
          <li><strong>Tensão de fase (UF):</strong> entre uma fase e o neutro.</li>
          <li>Relação: <strong>UL = √3 × UF</strong>.</li>
        </ul>
        <table>
          <tr><th>Sistema</th><th>Entre fases</th><th>Fase-neutro</th><th>Onde é comum</th></tr>
          <tr><td>220/127 V</td><td>220 V</td><td>127 V</td><td>Várias capitais e regiões do Sudeste</td></tr>
          <tr><td>380/220 V</td><td>380 V</td><td>220 V</td><td>Sul, Nordeste, Centro-Oeste e outras regiões</td></tr>
        </table>
        <p>Confirme sempre com a concessionária: há cidades vizinhas com sistemas diferentes.</p>

        <h2>Cargas em estrela e em triângulo</h2>
        <ul>
          <li><strong>Carga em estrela (Y):</strong> cada elemento fica entre fase e neutro (127 V no sistema 220/127 V). Ex.: lâmpadas e tomadas distribuídas nas três fases.</li>
          <li><strong>Carga em triângulo (Δ):</strong> cada elemento fica entre duas fases (220 V). Ex.: ar-condicionado 220 V, fornos trifásicos.</li>
        </ul>
        <p>Se as três fases estão com a mesma carga (<strong>equilibradas</strong>), as correntes no neutro se cancelam e ele leva corrente quase zero.
        Quanto mais desequilíbrio, mais corrente no neutro.</p>

        <h2>Potência trifásica</h2>
        <div class="destaque"><strong>P = √3 × UL × IL × cos φ</strong> &nbsp;(carga trifásica equilibrada)</div>
        <p>Forno trifásico resistivo de 9 kW em 220 V (cos φ = 1): I = 9.000 ÷ (1,732 × 220) ≈ <strong>23,6 A</strong> por fase.
        O mesmo forno em 380 V puxaria 9.000 ÷ (1,732 × 380) ≈ 13,7 A.</p>

        <h2>Teste rápido</h2>
        <details><summary>1. Num sistema 380/220 V, qual a tensão entre fase e neutro?</summary><p><strong>220 V</strong> (380 ÷ √3).</p></details>
        <details><summary>2. Um equipamento trifásico de 15 kVA em 380 V puxa quanto por fase?</summary><p>15.000 ÷ (1,732 × 380) ≈ <strong>22,8 A</strong>.</p></details>
        <details><summary>3. Por que o neutro de um sistema bem equilibrado leva pouca corrente?</summary><p>Porque as três correntes estão defasadas de 120° e, com mesma intensidade, sua soma é zero.</p></details>
      `
    },

    "1-2": {
      duracao: "13 min de leitura",
      texto: `
        <h2>A loja de exemplo</h2>
        <p>Neste curso vamos acompanhar uma <strong>loja com salão de vendas de 10 × 10 m</strong>, escritório, copa e banheiro,
        alimentada em <strong>220/127 V trifásico</strong>. Os circuitos (as contas da iluminação estão na aula 2-1):</p>
        <table>
          <tr><th>Circuito</th><th>Carga</th><th>Potência</th><th>Tensão</th><th>Corrente</th><th>Cabo / disjuntor</th></tr>
          <tr><td>C1</td><td>Iluminação salão (metade)</td><td>480 VA</td><td>127 V</td><td>3,8 A</td><td>1,5 mm² / 10 A</td></tr>
          <tr><td>C2</td><td>Iluminação salão (metade)</td><td>480 VA</td><td>127 V</td><td>3,8 A</td><td>1,5 mm² / 10 A</td></tr>
          <tr><td>C3</td><td>Iluminação escritório, copa, banheiro, vitrine</td><td>600 VA</td><td>127 V</td><td>4,7 A</td><td>1,5 mm² / 10 A</td></tr>
          <tr><td>C4</td><td>Tomadas salão</td><td>1.000 VA</td><td>127 V</td><td>7,9 A</td><td>2,5 mm² / 16 A</td></tr>
          <tr><td>C5</td><td>Tomadas escritório</td><td>1.000 VA</td><td>127 V</td><td>7,9 A</td><td>2,5 mm² / 16 A</td></tr>
          <tr><td>C6</td><td>Tomadas copa</td><td>1.800 VA</td><td>127 V</td><td>14,2 A</td><td>2,5 mm² / 16 A</td></tr>
          <tr><td>C7</td><td>Expositor refrigerado</td><td>800 VA</td><td>127 V</td><td>6,3 A</td><td>2,5 mm² / 16 A</td></tr>
          <tr><td>C8</td><td>Split 24.000 BTU/h salão</td><td>2.400 VA</td><td>220 V</td><td>10,9 A</td><td>2,5 mm² / 16 A bipolar</td></tr>
          <tr><td>C9</td><td>Split 24.000 BTU/h salão</td><td>2.400 VA</td><td>220 V</td><td>10,9 A</td><td>2,5 mm² / 16 A bipolar</td></tr>
          <tr><td>C10</td><td>Split 12.000 BTU/h escritório</td><td>1.200 VA</td><td>220 V</td><td>5,5 A</td><td>2,5 mm² / 10 A bipolar</td></tr>
        </table>
        <p><strong>Total: 12.160 VA.</strong> Os cabos consideram até três circuitos por eletroduto (fator 0,70), como no curso residencial.
        Para os splits, confira sempre o disjuntor e o cabo recomendados no manual do fabricante.</p>

        <h2>Como distribuir nas fases</h2>
        <ul>
          <li>Carga de <strong>127 V</strong> fica inteira na fase em que for ligada.</li>
          <li>Carga de <strong>220 V</strong> (entre duas fases) divide-se, para fins de equilíbrio, <strong>metade em cada fase</strong>.</li>
        </ul>

        <h2>Primeira tentativa</h2>
        <table>
          <tr><th>Fase</th><th>Circuitos</th><th>Total</th></tr>
          <tr><td>A</td><td>C1 480 + C4 1.000 + ½C8 1.200 + ½C10 600</td><td>3.280 VA</td></tr>
          <tr><td>B</td><td>C2 480 + C5 1.000 + C7 800 + ½C8 1.200 + ½C9 1.200</td><td>4.680 VA</td></tr>
          <tr><td>C</td><td>C3 600 + C6 1.800 + ½C9 1.200 + ½C10 600</td><td>4.200 VA</td></tr>
        </table>
        <p>A média é 12.160 ÷ 3 ≈ 4.053 VA. A fase B está 15 % acima da média e a A, 19 % abaixo. Dá para melhorar.</p>

        <h2>Ajuste: mover o C7 da fase B para a A</h2>
        ${fig("com-equilibrio", "Gráfico de barras das cargas por fase antes e depois de mover o circuito C7", "Uma troca simples deixa as fases próximas da média.")}
        <p>Fica A = 4.080, B = 3.880 e C = 4.200 VA. Maior afastamento da média: (4.053 − 3.880) ÷ 4.053 ≈ <strong>4,3 %</strong>. Ótimo.</p>

        <h2>Por que equilibrar</h2>
        <ul>
          <li>Fases sobrecarregadas desarmam o disjuntor geral antes da hora.</li>
          <li>Desequilíbrio aumenta a corrente no neutro e as perdas.</li>
          <li>Motores trifásicos sofrem com tensões desequilibradas (aquecem mais).</li>
        </ul>
        <div class="destaque">Na obra, o equilíbrio é conferido de verdade com o <strong>alicate amperímetro</strong> nas três fases e no neutro, em horário de uso normal.</div>

        <h2>Teste rápido</h2>
        <details><summary>1. Um forno de pizza de 3.000 VA em 220 V entre B e C: quanto soma em cada fase?</summary><p><strong>1.500 VA</strong> na B e 1.500 VA na C.</p></details>
        <details><summary>2. Depois do ajuste, qual a corrente na fase C (sem fator de demanda)?</summary><p>4.200 ÷ 127 ≈ <strong>33,1 A</strong>.</p></details>
      `
    },

    "1-3": {
      duracao: "10 min de leitura",
      texto: `
        <h2>A porta de entrada da energia</h2>
        <p>O <strong>padrão de entrada</strong> é o conjunto que recebe a energia da concessionária: poste ou pontalete, eletrodutos, caixa de medição,
        medidor, disjuntor geral e aterramento. Ele é construído pelo cliente, <strong>seguindo a norma técnica da concessionária local</strong>, e vistoriado antes da ligação.</p>
        ${fig("com-padrao-entrada", "Blocos: rede, ramal de ligação, medidor, disjuntor geral com aterramento e quadro geral", "Do ponto de entrega para dentro, a instalação é do cliente.")}

        <h2>Componentes</h2>
        <ul>
          <li><strong>Ramal de ligação:</strong> cabos da rede até o ponto de entrega. Feito pela concessionária.</li>
          <li><strong>Ramal de entrada:</strong> do ponto de entrega até a medição, por conta do cliente (aéreo ou subterrâneo).</li>
          <li><strong>Caixa de medição e medidor:</strong> caixa padronizada (modelo homologado); o medidor é instalado pela concessionária.</li>
          <li><strong>Disjuntor geral:</strong> tripolar no trifásico, com corrente definida pela categoria de atendimento.</li>
          <li><strong>Aterramento:</strong> haste(s) e condutor de aterramento ligados ao BEP (barramento de equipotencialização principal).</li>
          <li><strong>Ramal até o QDG:</strong> do disjuntor geral até o quadro de distribuição geral da loja.</li>
        </ul>

        <h2>Categoria de atendimento</h2>
        <p>A concessionária classifica o cliente por faixas de <strong>carga instalada</strong> e <strong>demanda</strong>. Cada faixa define o tipo de ligação
        (monofásica, bifásica, trifásica), a seção dos cabos de entrada e o disjuntor geral. Acima de certo limite, o atendimento passa a ser em
        <strong>média tensão</strong>, com subestação própria.</p>
        <p>Na loja de exemplo, a fase mais carregada fica em torno de 33 A sem fator de demanda. Na tabela da concessionária, isso costuma levar a um
        <strong>atendimento trifásico com disjuntor geral na faixa de 40 A</strong>. Mas é a tabela da sua concessionária que decide.</p>

        <h2>Caminho até a ligação</h2>
        <ol>
          <li>Levantar as cargas e definir a categoria.</li>
          <li>Projeto elétrico com ART/TRT (para cargas maiores, a concessionária exige o projeto aprovado).</li>
          <li>Pedido de ligação e construção do padrão conforme a norma.</li>
          <li>Vistoria da concessionária, instalação do medidor e ligação.</li>
        </ol>

        <h2>Erros que reprovam na vistoria</h2>
        <ul>
          <li>Caixa de medição fora do modelo, da altura ou da posição exigidos.</li>
          <li>Disjuntor geral diferente da categoria pedida.</li>
          <li>Aterramento ausente ou com conexões frouxas.</li>
          <li>Eletroduto do ramal de entrada com diâmetro ou material diferente do padrão.</li>
        </ul>

        <h2>Teste rápido</h2>
        <details><summary>1. Quem define o disjuntor geral do padrão?</summary><p>A <strong>norma da concessionária</strong>, conforme a categoria de atendimento calculada pela carga/demanda.</p></details>
        <details><summary>2. Depois de ligado, o cliente pode trocar o disjuntor geral por um maior?</summary><p><strong>Não</strong> sem pedir aumento de carga à concessionária. O disjuntor protege também o ramal de entrada.</p></details>
      `
    },

    "2-1": {
      duracao: "13 min de leitura",
      texto: `
        <h2>Luz vende</h2>
        <p>Numa loja, a iluminação valoriza o produto. No escritório, ela evita cansaço visual. Hoje, praticamente todo projeto novo usa <strong>LED</strong>.</p>

        <h2>Grandezas da iluminação</h2>
        <table>
          <tr><th>Grandeza</th><th>Unidade</th><th>O que é</th></tr>
          <tr><td>Fluxo luminoso</td><td>lúmen (lm)</td><td>Quantidade de luz emitida pela fonte</td></tr>
          <tr><td>Iluminância</td><td>lux (lx = lm/m²)</td><td>Quantidade de luz que chega à superfície</td></tr>
          <tr><td>Eficiência luminosa</td><td>lm/W</td><td>Luz por watt consumido (LED: mais de 100 lm/W)</td></tr>
          <tr><td>Temperatura de cor</td><td>kelvin (K)</td><td>Luz quente (≈ 3.000 K) a fria (≈ 6.500 K). 4.000 K é neutra</td></tr>
          <tr><td>IRC</td><td>0 a 100</td><td>Fidelidade das cores. Lojas de roupa e alimentos: prefira 90 ou mais</td></tr>
        </table>
        <p>A <strong>ABNT NBR ISO/CIE 8995-1</strong> define iluminâncias mínimas por ambiente e tarefa (ex.: 500 lux para trabalho de escritório).</p>

        <h2>Método dos lúmens</h2>
        <div class="destaque"><strong>N = (E × A) ÷ (φ × FU × FM)</strong><br>
        N = número de luminárias · E = iluminância (lux) · A = área (m²) · φ = lúmens por luminária ·
        FU = fator de utilização (depende das cores das paredes, do teto e do formato da sala; vem do catálogo) · FM = fator de manutenção (sujeira e envelhecimento)</div>

        <h2>Exemplo: salão de vendas da loja</h2>
        <p>Salão de 10 × 10 m. O lojista pediu <strong>500 lux</strong>. Luminária LED de <strong>4.000 lm e 32 W</strong>, FU = 0,6, FM = 0,8.</p>
        <p>N = (500 × 100) ÷ (4.000 × 0,6 × 0,8) = 50.000 ÷ 1.920 ≈ <strong>26,04 → mínimo 27</strong>.</p>
        <p>Para uma grade uniforme, adotamos <strong>5 × 6 = 30 luminárias</strong>. Iluminância resultante: 30 × 1.920 ÷ 100 ≈ <strong>576 lux</strong>.
        Potência: 30 × 32 = <strong>960 W</strong> (divididos em C1 e C2 com 15 luminárias cada).</p>
        ${fig("com-luminotecnico", "Planta do salão 10 × 10 m com 30 luminárias em grade 5 × 6", "Espaçamento de 1,67 m × 2,0 m, com metade do espaçamento junto às paredes.")}
        <p>Regra prática de distribuição: a distância da luminária à parede é cerca de <strong>metade</strong> da distância entre luminárias.</p>

        <h2>Detalhes que fazem diferença</h2>
        <ul>
          <li>Dividir a iluminação em <strong>mais de um circuito</strong> (se um disjuntor desarmar, o salão não fica no escuro).</li>
          <li>Iluminação de <strong>destaque</strong> (spots) em vitrines e produtos, em circuito separado.</li>
          <li><strong>Iluminação de emergência</strong> nas rotas de saída, conforme exigência do Corpo de Bombeiros.</li>
          <li>Comando por setores, sensores de presença em áreas de pouco uso e timers na fachada economizam energia.</li>
        </ul>

        <h2>Teste rápido</h2>
        <details><summary>1. Escritório de 5 × 6 m, 500 lux, luminária de 3.600 lm, FU 0,55, FM 0,8. Quantas luminárias?</summary><p>N = (500 × 30) ÷ (3.600 × 0,55 × 0,8) = 15.000 ÷ 1.584 ≈ 9,5 → <strong>10 luminárias</strong>.</p></details>
        <details><summary>2. Para que serve o IRC alto num açougue ou loja de roupas?</summary><p>Para as cores (da carne, dos tecidos) aparecerem fiéis. IRC baixo deixa o produto com aparência "apagada".</p></details>
      `
    },

    "2-2": {
      duracao: "11 min de leitura",
      texto: `
        <h2>As maiores cargas do comércio</h2>
        <p>Em lojas e escritórios, o ar-condicionado costuma ser a maior parcela do consumo. Junto com ele aparecem cargas especiais:
        refrigeradores, fornos, motores de portas, letreiros, nobreaks e servidores.</p>

        <h2>Ar-condicionado: o que o eletricista precisa saber</h2>
        <ul>
          <li><strong>BTU/h é capacidade térmica, não potência elétrica.</strong> Um split de 24.000 BTU/h (≈ 7 kW de frio) consome algo como 2 a 2,5 kW, dependendo da eficiência.
          Use os dados de <strong>tensão, corrente e potência</strong> da etiqueta da condensadora.</li>
          <li>O cálculo da carga térmica (quantos BTU/h cada ambiente precisa) é trabalho do projetista de climatização: depende de área, pessoas, insolação, equipamentos.</li>
          <li><strong>Circuito exclusivo</strong> para cada aparelho, com disjuntor e cabo conforme o manual.</li>
          <li>Em 220/127 V, splits maiores são ligados em <strong>220 V entre fases</strong> (disjuntor bipolar).</li>
          <li>Equipamentos com compressor partem com pico de corrente: disjuntor <strong>curva C</strong> costuma ser o indicado.</li>
          <li>Ponto de força próximo da condensadora, com <strong>dispositivo de seccionamento</strong> para manutenção, e aterramento.</li>
          <li>Modelos <strong>inverter</strong> economizam energia e partem suavemente, mas são sensíveis a surtos: o DPS no quadro é muito recomendado.</li>
        </ul>
        <p>Na loja de exemplo: C8 e C9 (24.000 BTU/h, 2.400 VA, 10,9 A em 220 V) com cabo de 2,5 mm² e disjuntor bipolar de 16 A, e C10 (12.000 BTU/h, 1.200 VA, 5,5 A) com 2,5 mm² e 10 A,
        <strong>desde que o manual do fabricante aceite</strong>.</p>

        <h2>Outras cargas especiais</h2>
        <table>
          <tr><th>Carga</th><th>Cuidados</th></tr>
          <tr><td>Expositores e câmaras frias</td><td>Circuito exclusivo; não podem desligar com o DR de outro circuito; atenção ao horário noturno</td></tr>
          <tr><td>Fornos e chapas</td><td>Potência alta, muitas vezes trifásicos; cabo dimensionado pela corrente e pelo calor do ambiente</td></tr>
          <tr><td>Motores (portas, bombas, elevadores de carga)</td><td>Proteção de motor (curso de Comandos)</td></tr>
          <tr><td>Letreiros e fachada</td><td>Comando por timer ou fotocélula; proteção contra umidade; DR</td></tr>
          <tr><td>Computadores, servidores e caixas (PDV)</td><td>Circuitos próprios, nobreak, aterramento bem feito</td></tr>
        </table>

        <h2>Harmônicas e o neutro</h2>
        <p>Drivers de LED, computadores e equipamentos inverter puxam corrente "deformada" (com <strong>harmônicas</strong>). A <strong>3ª harmônica</strong> das três fases
        <strong>soma no neutro</strong> em vez de se cancelar. Em instalações com muitas cargas eletrônicas, o neutro pode levar corrente igual ou maior que a das fases.</p>
        <div class="destaque alerta">Não reduza a seção do neutro em circuitos com muitas cargas eletrônicas. A NBR 5410 traz critérios para dimensionar o neutro quando há harmônicas: siga-os no projeto.</div>

        <h2>Teste rápido</h2>
        <details><summary>1. Um split de 18.000 BTU/h tem etiqueta 220 V, 8,2 A. Que corrente usar no projeto elétrico?</summary><p><strong>8,2 A</strong> (dado elétrico da etiqueta). BTU/h é só a capacidade de refrigeração.</p></details>
        <details><summary>2. Por que um escritório cheio de computadores pode ter o neutro quente mesmo com fases equilibradas?</summary><p>Por causa das <strong>harmônicas de 3ª ordem</strong>, que se somam no neutro.</p></details>
      `
    },

    "2-3": {
      duracao: "11 min de leitura",
      texto: `
        <h2>Instalação aparente e organizada</h2>
        <p>Em lojas, galpões e escritórios com forro, a fiação costuma correr por <strong>eletrocalhas</strong>, <strong>perfilados</strong> e eletrodutos aparentes.
        É mais rápido de montar e muito mais fácil de ampliar do que a instalação embutida em alvenaria.</p>

        <h2>Tipos de infraestrutura</h2>
        <table>
          <tr><th>Elemento</th><th>Uso típico</th></tr>
          <tr><td>Eletrocalha lisa</td><td>Cabos de energia e dados com proteção mecânica; tampa quando exigido</td></tr>
          <tr><td>Eletrocalha perfurada</td><td>Melhor ventilação dos cabos; facilita a fixação</td></tr>
          <tr><td>Leito para cabos</td><td>Grandes quantidades de cabos de potência, galpões e áreas técnicas</td></tr>
          <tr><td>Perfilado (ex.: 38 × 38 mm)</td><td>Distribuição até luminárias e tomadas; também sustenta as luminárias</td></tr>
          <tr><td>Eletroduto aparente (metálico ou PVC rígido)</td><td>Descidas até tomadas e quadros, trechos curtos</td></tr>
          <tr><td>Canaleta / rodapé técnico</td><td>Escritórios, junto às mesas</td></tr>
        </table>

        <h2>Montagem</h2>
        <ul>
          <li><strong>Sustentação:</strong> vergalhão roscado (tirante) e suportes, com espaçamento conforme o fabricante e o peso dos cabos.</li>
          <li><strong>Acessórios:</strong> curvas, tês e reduções próprios. Evite cortar e improvisar ângulos que danifiquem o isolamento dos cabos.</li>
          <li><strong>Saídas:</strong> derivações da eletrocalha para eletrodutos com saídas adequadas e buchas, sem arestas cortantes.</li>
          <li><strong>Separação:</strong> energia e dados separados (eletrocalhas diferentes ou <strong>septo divisor</strong>), para evitar interferência e por segurança.</li>
          <li><strong>Ocupação:</strong> deixe folga para ventilação e ampliações. Em eletrodutos, a NBR 5410 limita a ocupação a 40 % da área interna com três ou mais cabos.</li>
          <li><strong>Equipotencialização:</strong> eletrocalhas e perfilados metálicos ligados ao terra. Leve o condutor de proteção (PE) junto com os circuitos: não use a eletrocalha no lugar dele.</li>
          <li><strong>Identificação:</strong> marque os cabos com o número do circuito nas derivações e no quadro.</li>
        </ul>

        <h2>Cabos dentro de eletrocalhas</h2>
        <p>Em eletrocalhas abertas, use cabos com <strong>isolação e cobertura</strong> (cabos unipolares ou multipolares para 0,6/1 kV, por exemplo), e não fios só com isolação simples,
        a não ser que a eletrocalha seja fechada e o método de instalação permita. O método de instalação também muda a capacidade de corrente do cabo: consulte as tabelas da NBR 5410.</p>

        <h2>Segurança contra incêndio</h2>
        <ul>
          <li>Em locais de afluência de público, a NBR 5410 pede cabos com características de <strong>não propagação de chama, baixa emissão de fumaça e gases tóxicos</strong> em determinadas situações. Verifique no projeto.</li>
          <li>Onde a infraestrutura atravessar paredes corta-fogo, é necessário <strong>selagem corta-fogo</strong>.</li>
        </ul>

        <h2>Teste rápido</h2>
        <details><summary>1. Pode passar cabo de rede (dados) na mesma eletrocalha da energia, sem divisão?</summary><p><strong>Não é recomendado.</strong> Use septo divisor ou eletrocalhas separadas.</p></details>
        <details><summary>2. Eletrocalha metálica pode substituir o condutor terra?</summary><p><strong>Não.</strong> Ela deve ser aterrada (equipotencializada), mas o PE segue junto com cada circuito.</p></details>
      `
    },

    "3-1": {
      duracao: "12 min de leitura",
      texto: `
        <h2>Nem toda potência faz trabalho</h2>
        <p>Motores, reatores e transformadores precisam de energia para criar campo magnético. Essa parcela vai e volta da rede sem virar trabalho:
        é a <strong>potência reativa</strong>. Ela ocupa espaço nos cabos e transformadores.</p>
        ${fig("com-triangulo-potencias", "Triângulo de potências com P na horizontal, Q na vertical e S na hipotenusa", "P, Q e S formam um triângulo retângulo.")}
        <ul>
          <li><strong>P — potência ativa (W, kW):</strong> vira luz, calor, movimento.</li>
          <li><strong>Q — potência reativa (var, kvar):</strong> mantém os campos magnéticos.</li>
          <li><strong>S — potência aparente (VA, kVA):</strong> o que a rede realmente fornece. S² = P² + Q².</li>
          <li><strong>Fator de potência:</strong> cos φ = P ÷ S. Quanto mais perto de 1, melhor.</li>
        </ul>

        <h2>Por que o fator de potência importa</h2>
        <ul>
          <li><strong>Corrente maior</strong> para a mesma potência útil: mais aquecimento e queda de tensão nos cabos.</li>
          <li>Transformadores e cabos "lotados" de reativo.</li>
          <li><strong>Cobrança:</strong> a regulamentação da ANEEL usa <strong>0,92</strong> como fator de potência de referência. Consumidores atendidos em média tensão (grupo A)
          pagam pelo reativo excedente quando ficam abaixo desse valor.</li>
        </ul>

        <h2>Correção com capacitores</h2>
        <p>Capacitores fornecem a potência reativa localmente, aliviando a rede. A potência necessária:</p>
        <div class="destaque"><strong>Qc = P × (tg φ1 − tg φ2)</strong> &nbsp;(φ1 = atual, φ2 = desejado)</div>
        <p><strong>Exemplo:</strong> instalação de 50 kW com cos φ = 0,80, corrigir para 0,95.<br>
        tg φ1 = tg(arccos 0,80) = 0,750 · tg φ2 = tg(arccos 0,95) ≈ 0,329<br>
        Qc = 50 × (0,750 − 0,329) ≈ <strong>21 kvar</strong>.</p>
        <table>
          <tr><th></th><th>Antes (0,80)</th><th>Depois (0,95)</th></tr>
          <tr><td>Potência aparente</td><td>62,5 kVA</td><td>52,6 kVA</td></tr>
          <tr><td>Corrente em 380 V</td><td>95 A</td><td>80 A</td></tr>
        </table>
        <p>A mesma potência útil, com <strong>16 % menos corrente</strong>.</p>

        <h2>Na prática</h2>
        <ul>
          <li><strong>Correção localizada:</strong> capacitor junto ao motor grande, ligado e desligado com ele.</li>
          <li><strong>Banco automático:</strong> um controlador mede o fator de potência e liga estágios de capacitores conforme a necessidade. Comum em comércios grandes e indústrias.</li>
          <li><strong>Cuidado com o excesso:</strong> capacitor demais deixa o fator de potência capacitivo, o que também é indesejado (e cobrado em certos horários).</li>
          <li><strong>Harmônicas:</strong> em instalações com muitas cargas eletrônicas, capacitores podem entrar em ressonância. Bancos com <strong>reatores de dessintonia</strong> resolvem. Isso pede um estudo de qualidade de energia.</li>
          <li>Capacitores guardam carga: espere o tempo de descarga indicado antes de manusear.</li>
        </ul>

        <h2>Teste rápido</h2>
        <details><summary>1. Uma carga de 20 kW tem 25 kVA. Qual o fator de potência?</summary><p>20 ÷ 25 = <strong>0,80</strong>.</p></details>
        <details><summary>2. Quanto de capacitor para levar 30 kW de cos 0,75 para 0,92?</summary><p>tg(arccos 0,75) ≈ 0,882; tg(arccos 0,92) ≈ 0,426. Qc = 30 × 0,456 ≈ <strong>13,7 kvar</strong>.</p></details>
      `
    },

    "3-2": {
      duracao: "10 min de leitura",
      texto: `
        <h2>Enxergar o calor</h2>
        <p>Quase todo defeito elétrico <strong>esquenta antes de falhar</strong>: borne frouxo, contato oxidado, fase sobrecarregada, disjuntor com defeito.
        A <strong>termografia</strong> usa uma câmera infravermelha para ver esse calor com o equipamento funcionando, sem tocar em nada.
        É uma técnica de <strong>manutenção preditiva</strong>: acha o problema antes da parada ou do incêndio.</p>

        ${fig("com-termografia", "Imagem térmica de três disjuntores: a fase B está muito mais quente que A e C", "Componentes iguais, com carga parecida, deveriam ter temperaturas parecidas.")}

        <h2>Como inspecionar</h2>
        <ol>
          <li>Inspecione com a instalação em <strong>carga</strong> (de preferência acima de 40 % da nominal). Sem corrente, um mau contato não esquenta.</li>
          <li>Meça a corrente das fases com alicate e anote junto com a imagem.</li>
          <li><strong>Compare componentes semelhantes</strong> (as três fases de um disjuntor, os bornes de uma régua). A diferença de temperatura (ΔT) é mais confiável que o valor absoluto.</li>
          <li>Ajuste a <strong>emissividade</strong> na câmera. Superfícies metálicas brilhantes refletem calor de outros objetos e enganam a leitura; prefira medir em partes isoladas, terminais com tinta ou fita própria.</li>
          <li>Registre: local, equipamento, imagem térmica, foto comum, carga, temperatura ambiente e prioridade.</li>
        </ol>

        <h2>Classificando o problema</h2>
        <p>Um critério muito usado no mercado (baseado em normas internacionais de manutenção, como as da NETA) compara componentes semelhantes:</p>
        <table>
          <tr><th>ΔT entre componentes semelhantes</th><th>Interpretação</th><th>Ação</th></tr>
          <tr><td>1 a 3 °C</td><td>Possível anomalia</td><td>Acompanhar</td></tr>
          <tr><td>4 a 15 °C</td><td>Provável deficiência</td><td>Programar reparo</td></tr>
          <tr><td>Acima de 15 °C</td><td>Deficiência grave</td><td>Reparar o quanto antes</td></tr>
        </table>
        <p>No exemplo da figura, a fase B está cerca de 33 °C acima das outras: <strong>prioridade alta</strong>. Causa mais provável: borne frouxo ou oxidado.</p>

        <h2>Segurança</h2>
        <div class="destaque alerta">Abrir um painel energizado para fotografar expõe a <strong>choque e arco elétrico</strong>. Só profissionais autorizados (NR-10), com EPI adequado e procedimento.
        Em painéis críticos, existem <strong>janelas de inspeção infravermelha</strong> que permitem a termografia com a porta fechada.</div>

        <h2>Depois do reparo</h2>
        <p>Refaça a termografia com carga para confirmar que o problema sumiu. Sem nova medição, não dá para dizer que o defeito foi resolvido.</p>

        <h2>Teste rápido</h2>
        <details><summary>1. Por que fazer a termografia com carga?</summary><p>Porque o aquecimento vem da corrente passando pelo defeito (efeito Joule). Sem corrente, nada aparece.</p></details>
        <details><summary>2. Um barramento de cobre polido aparece "frio" na câmera, mas está quente ao toque. O que aconteceu?</summary><p>Baixa <strong>emissividade</strong>: o metal polido reflete o ambiente e engana a câmera.</p></details>
      `
    },

    "3-3": {
      duracao: "12 min de leitura",
      texto: `
        <h2>Três jeitos de fazer manutenção</h2>
        <table>
          <tr><th>Tipo</th><th>Quando</th><th>Exemplo</th></tr>
          <tr><td>Corretiva</td><td>Depois da falha</td><td>Trocar um disjuntor queimado</td></tr>
          <tr><td>Preventiva</td><td>Em intervalos programados</td><td>Reaperto de bornes a cada ano</td></tr>
          <tr><td>Preditiva</td><td>Pela condição medida</td><td>Termografia, medição de isolação, análise de corrente</td></tr>
        </table>
        <p>Um bom plano mistura preventiva e preditiva para reduzir ao mínimo a corretiva, que é a mais cara e chega na pior hora (loja cheia, sexta-feira à noite).</p>

        <h2>Plano de manutenção da loja de exemplo</h2>
        <table>
          <tr><th>Atividade</th><th>Periodicidade sugerida</th></tr>
          <tr><td>Teste do botão de teste dos DR</td><td>Mensal</td></tr>
          <tr><td>Teste da iluminação de emergência (autonomia)</td><td>Mensal / conforme Bombeiros</td></tr>
          <tr><td>Inspeção visual dos quadros (cheiro, ruído, sinais de aquecimento, DPS sinalizado)</td><td>Mensal</td></tr>
          <tr><td>Medição das correntes nas fases e no neutro (equilíbrio)</td><td>Trimestral</td></tr>
          <tr><td>Limpeza dos filtros e verificação elétrica dos aparelhos de ar-condicionado</td><td>Mensal a trimestral (conforme PMOC)</td></tr>
          <tr><td>Termografia dos quadros</td><td>Semestral ou anual</td></tr>
          <tr><td>Reaperto de bornes (desenergizado), limpeza dos quadros</td><td>Anual</td></tr>
          <tr><td>Medição da resistência de aterramento e continuidade do PE</td><td>Anual</td></tr>
          <tr><td>Revisão dos diagramas unifilares e identificação dos circuitos</td><td>A cada alteração</td></tr>
        </table>
        <p>As periodicidades são uma <strong>sugestão inicial</strong>: ajuste conforme o ambiente (poeira, umidade, calor), o histórico e o manual dos fabricantes.</p>

        <h2>Registros</h2>
        <ul>
          <li>Ordem de serviço para cada atividade, com data, responsável, o que foi medido e o que foi feito.</li>
          <li>Histórico por equipamento: mostra tendências (ex.: a corrente da fase C subindo a cada trimestre).</li>
          <li>Diagramas <strong>atualizados</strong> e quadros identificados.</li>
          <li>Estabelecimentos com carga instalada <strong>acima de 75 kW</strong> devem manter o <strong>Prontuário das Instalações Elétricas</strong> exigido pela NR-10.</li>
          <li>Ambientes climatizados de uso coletivo devem ter <strong>PMOC</strong> (Plano de Manutenção, Operação e Controle) do ar-condicionado.</li>
        </ul>

        <h2>Segurança em toda intervenção</h2>
        <div class="destaque alerta">Desligar, bloquear e etiquetar, testar a ausência de tensão, aterrar quando necessário e só então trabalhar.
        Atividades em quadros energizados (termografia, medições) só por profissionais autorizados conforme a NR-10.</div>

        <h2>Desafio final</h2>
        <p>Na loja de exemplo, o disjuntor geral (40 A) começou a desarmar no fim da tarde, em dias quentes. O que você investiga?</p>
        <details><summary>Ver resposta</summary><p>1) Medir com alicate as correntes das três fases e do neutro no horário do problema: o pico de ar-condicionado + iluminação pode ter
        <strong>desequilibrado</strong> as fases (ex.: alguém mudou circuitos de fase) ou alguma carga foi acrescentada (novo expositor, forno).
        2) Conferir com o levantamento: a fase C já era a mais carregada (4.200 VA ≈ 33 A). 3) Termografia do disjuntor geral e dos bornes: mau contato aquece e faz o térmico atuar abaixo da corrente nominal.
        4) Verificar a temperatura dentro do quadro (sol, falta de ventilação). Corrigir: reequilibrar as fases, reapertar/trocar componentes e, se a carga realmente cresceu,
        pedir <strong>aumento de carga</strong> à concessionária em vez de simplesmente trocar o disjuntor por um maior.</p></details>
      `
    }
  };
})();
