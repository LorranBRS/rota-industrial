/*
 * Conteúdo das aulas do curso "Motores Elétricos".
 * Chave = "<módulo>-<aula>" (mesma ordem de data/cursos.js).
 *
 * Motor de exemplo (o mesmo do curso de Comandos): 3 cv (2,2 kW), 4 polos, 1730 rpm, 60 Hz,
 * 220/380 V, 8,6/5,0 A, rendimento 84 %, cos φ 0,80, FS 1,15, Ip/In 7,5, isolação F, IP55, S1.
 * Valores de exemplo, não de catálogo.
 */
window.ROTA_AULAS = window.ROTA_AULAS || {};
(function () {
  const fig = (nome, alt, legenda) =>
    '<figure class="diagrama"><img src="assets/img/diagramas/' + nome + '.svg" alt="' + alt + '" loading="lazy"><figcaption>' + legenda + "</figcaption></figure>";
  const seg = '<div class="destaque alerta"><strong>Segurança:</strong> antes de abrir a caixa de ligação, desligue o circuito, bloqueie, sinalize e ' +
    '<strong>teste a ausência de tensão</strong>. Lembre que o motor pode estar acoplado a uma máquina que gira por inércia. Trabalhos em instalações elétricas seguem a NR-10.</div>';

  window.ROTA_AULAS["motores-eletricos"] = {
    "1-1": {
      duracao: "10 min de leitura",
      texto: `
        <h2>O segredo do motor de indução</h2>
        <p>Um ímã que gira arrasta um pedaço de metal junto. O motor de indução faz algo parecido, só que o "ímã que gira" é um
        <strong>campo magnético criado por correntes</strong>, sem nenhuma peça se movendo. Esse é o <strong>campo girante</strong>.</p>

        <h2>Como três correntes fazem um campo girar</h2>
        <p>O estator tem três conjuntos de bobinas (fases A, B e C), distribuídos a 120° um do outro ao redor do motor.
        A rede trifásica entrega três correntes também defasadas de 120° no tempo. A cada instante, uma fase está mais forte que as outras,
        e o campo resultante aponta para o eixo dela. Como as fases vão se revezando, o campo vai mudando de direção, sempre no mesmo sentido.</p>

        ${fig("mot-campo-girante", "Três senoides defasadas e o campo resultante apontando para os eixos A, B e C em três instantes", "Em t1 a fase A está no máximo, em t2 a B, em t3 a C: o campo dá a volta.")}

        <h2>Velocidade síncrona</h2>
        <p>A velocidade do campo girante depende da <strong>frequência</strong> da rede e do <strong>número de polos</strong> do motor:</p>
        <div class="destaque"><strong>ns = 120 × f ÷ p</strong> &nbsp;(ns em rpm, f em Hz, p = número de polos)</div>
        <table>
          <tr><th>Polos</th><th>ns em 60 Hz</th><th>ns em 50 Hz</th></tr>
          <tr><td>2</td><td>3.600 rpm</td><td>3.000 rpm</td></tr>
          <tr><td>4</td><td>1.800 rpm</td><td>1.500 rpm</td></tr>
          <tr><td>6</td><td>1.200 rpm</td><td>1.000 rpm</td></tr>
          <tr><td>8</td><td>900 rpm</td><td>750 rpm</td></tr>
        </table>
        <p>Por isso um inversor de frequência controla a velocidade: mudando <strong>f</strong>, muda ns.</p>

        <h2>E se trocar duas fases?</h2>
        <p>A ordem em que as fases chegam ao máximo inverte (A → C → B), e o campo passa a girar ao contrário.
        É exatamente o que a partida com reversão faz.</p>

        <h2>Teste rápido</h2>
        <details><summary>1. Qual a velocidade síncrona de um motor de 6 polos em 60 Hz?</summary><p>120 × 60 ÷ 6 = <strong>1.200 rpm</strong>.</p></details>
        <details><summary>2. Um motor de 4 polos ligado a um inversor em 30 Hz: qual a velocidade síncrona?</summary><p>120 × 30 ÷ 4 = <strong>900 rpm</strong>.</p></details>
      `
    },

    "1-2": {
      duracao: "12 min de leitura",
      texto: `
        <h2>O motor mais usado do mundo</h2>
        <p>O <strong>motor de indução trifásico com rotor de gaiola</strong> está em bombas, compressores, esteiras, ventiladores e quase toda máquina industrial.
        É simples, robusto, barato e quase não precisa de manutenção além de rolamentos e limpeza.</p>

        ${fig("mot-partes", "Corte do motor mostrando carcaça, núcleo e enrolamento do estator, rotor gaiola de esquilo e eixo", "As partes principais, vistas em corte.")}

        <h2>Partes</h2>
        <ul>
          <li><strong>Estator:</strong> a parte fixa. Núcleo de chapas de aço (para reduzir perdas) com ranhuras onde ficam as <strong>bobinas de cobre</strong>, ligadas à rede.</li>
          <li><strong>Rotor de gaiola:</strong> barras de alumínio (ou cobre) ligadas por anéis nas pontas, como uma gaiola de esquilo. <strong>Não</strong> recebe fio da rede.</li>
          <li><strong>Eixo e rolamentos:</strong> transmitem o movimento e apoiam o rotor.</li>
          <li><strong>Carcaça, tampas e ventilador:</strong> protegem e resfriam. O ventilador fica atrás, sob a tampa defletora.</li>
          <li><strong>Caixa de ligação:</strong> onde estão as pontas do enrolamento e o borne de aterramento.</li>
        </ul>

        <h2>Por que "indução"?</h2>
        <p>O campo girante do estator corta as barras do rotor e <strong>induz</strong> correntes nelas (como num transformador).
        Essas correntes criam o campo do rotor, que é arrastado pelo campo girante. Resultado: o eixo gira.</p>

        <h2>Escorregamento</h2>
        <p>O rotor <strong>nunca</strong> alcança a velocidade do campo. Se alcançasse, as barras não seriam mais cortadas, não haveria corrente induzida e não haveria força.
        Essa diferença é o <strong>escorregamento</strong>:</p>
        <div class="destaque"><strong>s = (ns − n) ÷ ns</strong></div>
        <p>Motor de 4 polos com placa de 1.730 rpm: s = (1.800 − 1.730) ÷ 1.800 ≈ <strong>3,9 %</strong>. Valores entre 1 % e 6 % são típicos.
        Quanto mais carga, maior o escorregamento e maior a corrente.</p>

        <h2>Corrente do motor</h2>
        <div class="destaque"><strong>I = P ÷ (√3 × U × η × cos φ)</strong> &nbsp;(P em W, potência no eixo)</div>
        <p>Motor de 3 cv = 3 × 736 ≈ 2.206 W, 220 V, rendimento 84 %, cos φ 0,80:<br>
        I = 2.206 ÷ (1,732 × 220 × 0,84 × 0,80) ≈ <strong>8,6 A</strong>. É o valor da placa usado no curso de Comandos.</p>
        <p>Já o <strong>conjugado</strong> (torque) nominal: C = 9.550 × P(kW) ÷ n = 9.550 × 2,2 ÷ 1.730 ≈ <strong>12,1 N·m</strong>.</p>

        <h2>Comportamento na prática</h2>
        <ul>
          <li><strong>Na partida:</strong> corrente de 6 a 8 vezes a nominal.</li>
          <li><strong>Em vazio:</strong> a corrente cai, mas não vai a zero (é a corrente de magnetização), e o cos φ fica baixo.</li>
          <li><strong>Sobrecarregado:</strong> rotação cai um pouco, corrente sobe, o motor esquenta.</li>
        </ul>

        <h2>Teste rápido</h2>
        <details><summary>1. Um motor de 2 polos tem placa de 3.500 rpm. Qual o escorregamento?</summary><p>(3.600 − 3.500) ÷ 3.600 ≈ <strong>2,8 %</strong>.</p></details>
        <details><summary>2. Por que o rotor de gaiola não precisa de escovas?</summary><p>Porque a corrente nele é <strong>induzida</strong> pelo campo do estator. Nenhum fio da rede chega ao rotor.</p></details>
        <details><summary>3. Um motor de 7,5 cv em 380 V tem η = 88 % e cos φ = 0,84. Qual a corrente aproximada?</summary><p>P = 7,5 × 736 = 5.520 W. I = 5.520 ÷ (1,732 × 380 × 0,88 × 0,84) ≈ <strong>11,3 A</strong>.</p></details>
      `
    },

    "1-3": {
      duracao: "11 min de leitura",
      texto: `
        <h2>O problema de uma fase só</h2>
        <p>Com uma única bobina alimentada por corrente alternada monofásica, o campo apenas "pulsa" para frente e para trás. Ele não gira.
        O motor até continua girando se alguém empurrar, mas <strong>não parte sozinho</strong>. A solução é criar uma segunda fase artificial.</p>

        <h2>Bobina auxiliar e capacitor</h2>
        <p>O motor monofásico tem uma <strong>bobina principal</strong> (de trabalho) e uma <strong>bobina auxiliar</strong> (de partida), deslocada no estator.
        Um <strong>capacitor</strong> em série com a auxiliar adianta a corrente dela em relação à principal. Com duas correntes defasadas em bobinas deslocadas,
        surge um campo girante (imperfeito, mas suficiente para partir).</p>

        ${fig("mot-monofasico", "Motor monofásico com capacitor de partida: bobina principal em paralelo com chave centrífuga, capacitor e bobina auxiliar", "Motor com capacitor de partida.")}

        <h2>Tipos mais comuns</h2>
        <table>
          <tr><th>Tipo</th><th>Como funciona</th><th>Onde aparece</th></tr>
          <tr><td>Fase dividida</td><td>Bobina auxiliar sem capacitor, desligada pela chave centrífuga</td><td>Pequenas máquinas, conjugado de partida baixo</td></tr>
          <tr><td>Capacitor de partida</td><td>Capacitor eletrolítico + chave centrífuga</td><td>Compressores, bombas, betoneiras (bom conjugado de partida)</td></tr>
          <tr><td>Capacitor permanente</td><td>Capacitor fica ligado o tempo todo, sem chave centrífuga</td><td>Ventiladores, condensadoras de ar-condicionado</td></tr>
          <tr><td>Dois capacitores</td><td>Um de partida (sai) e um permanente (fica)</td><td>Motores monofásicos maiores</td></tr>
          <tr><td>Polos sombreados</td><td>Anel de cobre em parte do polo cria um pequeno deslocamento do campo</td><td>Ventiladores pequenos, exaustores, motores de eletrodomésticos</td></tr>
        </table>

        <h2>Defeitos típicos</h2>
        <ul>
          <li><strong>Motor zumbe e não parte, mas gira se empurrado:</strong> capacitor ruim, chave centrífuga aberta ou bobina auxiliar interrompida.</li>
          <li><strong>Capacitor de partida estufado ou estourado:</strong> chave centrífuga não abre (capacitor fica ligado direto) ou partidas demais por hora.</li>
          <li><strong>Motor esquenta e desarma:</strong> capacitor permanente com valor errado, sobrecarga, ventilação ruim.</li>
        </ul>
        <div class="destaque alerta">Capacitores guardam carga. Antes de manusear, <strong>descarregue</strong> com um resistor adequado (não em curto direto com chave de fenda).
        Na troca, use capacitor com a <strong>mesma capacitância (µF) e tensão igual ou maior</strong>.</div>

        <h2>Inverter o sentido</h2>
        <p>Invertem-se as pontas da <strong>bobina auxiliar</strong> (ou da principal, mas não das duas). Siga o esquema da placa: cada fabricante numera de um jeito.</p>

        <h2>Teste rápido</h2>
        <details><summary>1. O ventilador de teto zumbe, mas gira se você der um empurrão. Suspeito principal?</summary><p>O <strong>capacitor</strong>.</p></details>
        <details><summary>2. Um capacitor de 40 µF / 250 V queimou. Pode trocar por 40 µF / 440 V?</summary><p><strong>Sim</strong>: mesma capacitância e tensão maior. Trocar por outra capacitância muda o funcionamento do motor.</p></details>
      `
    },

    "2-1": {
      duracao: "12 min de leitura",
      texto: `
        <h2>A placa é o "RG" do motor</h2>
        <p>Toda informação necessária para ligar, proteger e escolher um motor está na <strong>placa de identificação</strong>. Antes de mexer num motor, leia a placa.</p>

        ${fig("mot-placa", "Placa de identificação de exemplo com potência, rotação, tensões, correntes, fator de serviço e classe de isolação", "Placa de exemplo (o motor de 3 cv usado nos cursos).")}

        <h2>Campo a campo</h2>
        <table>
          <tr><th>Campo</th><th>Exemplo</th><th>O que significa</th></tr>
          <tr><td>Potência</td><td>3,0 cv (2,2 kW)</td><td>Potência <strong>mecânica no eixo</strong>, não a consumida da rede</td></tr>
          <tr><td>Rotação</td><td>1730 rpm</td><td>Rotação com carga nominal (4 polos, síncrona 1.800)</td></tr>
          <tr><td>Tensões</td><td>220/380 V</td><td>Pode ser ligado em 220 V (triângulo) ou 380 V (estrela)</td></tr>
          <tr><td>Correntes</td><td>8,6/5,0 A</td><td>Corrente nominal em cada tensão, na mesma ordem. Use para ajustar o relé térmico</td></tr>
          <tr><td>Frequência</td><td>60 Hz</td><td>Frequência da rede (no Brasil, 60 Hz)</td></tr>
          <tr><td>FS</td><td>1,15</td><td>Fator de serviço: sobrecarga contínua que o motor aguenta (15 % aqui) em condições nominais. É uma reserva, não para uso permanente</td></tr>
          <tr><td>Ip/In</td><td>7,5</td><td>A corrente de partida é 7,5 vezes a nominal: 7,5 × 8,6 ≈ 65 A em 220 V</td></tr>
          <tr><td>Isolação</td><td>F</td><td>Classe térmica do isolamento (F = 155 °C)</td></tr>
          <tr><td>IP</td><td>IP55</td><td>Proteção contra poeira (5) e jatos d'água (5)</td></tr>
          <tr><td>Regime</td><td>S1</td><td>Regime contínuo. Outros (S2, S3...) são para uso intermitente</td></tr>
          <tr><td>Rendimento</td><td>84 %</td><td>Quanto da energia elétrica vira trabalho no eixo</td></tr>
          <tr><td>cos φ</td><td>0,80</td><td>Fator de potência na carga nominal</td></tr>
          <tr><td>Categoria</td><td>N</td><td>Conjugado de partida normal (H = alto, D = alto com grande escorregamento)</td></tr>
          <tr><td>Carcaça</td><td>90L</td><td>Tamanho padronizado: 90 mm é a altura do eixo. Facilita a troca entre fabricantes</td></tr>
        </table>

        <h2>Classes de isolação</h2>
        <table>
          <tr><th>Classe</th><th>A</th><th>E</th><th>B</th><th>F</th><th>H</th></tr>
          <tr><td>Temperatura máxima</td><td>105 °C</td><td>120 °C</td><td>130 °C</td><td>155 °C</td><td>180 °C</td></tr>
        </table>
        <p>Uma regra prática muito citada: cada <strong>10 °C acima</strong> do limite da classe pode reduzir a vida do isolamento <strong>pela metade</strong>.</p>

        <h2>Potência consumida x potência no eixo</h2>
        <p>Do motor de exemplo: a potência elétrica ativa consumida é P ÷ η = 2.206 ÷ 0,84 ≈ <strong>2.626 W</strong>.
        A diferença (≈ 420 W) vira calor no motor. Por isso rendimento alto economiza energia em motores que trabalham muitas horas.</p>

        <h2>Teste rápido</h2>
        <details><summary>1. A placa diz 220/380 V e 8,6/5,0 A. O motor está ligado em 380 V. Em quanto ajustar o relé térmico?</summary><p>Em <strong>5,0 A</strong> (corrente correspondente a 380 V).</p></details>
        <details><summary>2. Um motor IP55 pode trabalhar numa área lavada com mangueira?</summary><p>O segundo dígito 5 indica proteção contra <strong>jatos d'água</strong>, então é adequado para lavagem com jatos comuns (não para submersão ou jatos de alta pressão).</p></details>
        <details><summary>3. Qual a corrente de partida de um motor de 5,0 A em 380 V com Ip/In = 7,5?</summary><p>7,5 × 5,0 = <strong>37,5 A</strong>.</p></details>
      `
    },

    "2-2": {
      duracao: "13 min de leitura",
      texto: `
        <h2>Uma bobina, várias tensões</h2>
        <p>Cada bobina do motor foi projetada para uma tensão. Ligando as bobinas de jeitos diferentes, o mesmo motor funciona em redes diferentes.
        A regra que vale sempre: <strong>cada bobina deve receber a sua tensão de projeto</strong>.</p>
        ${seg}

        <h2>Motor de 6 pontas (220/380 V)</h2>
        <p>São três bobinas, cada uma com duas pontas: 1-4, 2-5 e 3-6. Cada bobina é feita para <strong>220 V</strong>.</p>
        <ul>
          <li><strong>Rede de 220 V → triângulo (Δ):</strong> cada bobina fica entre duas fases e recebe 220 V.</li>
          <li><strong>Rede de 380 V → estrela (Y):</strong> as pontas 4, 5 e 6 são unidas. Cada bobina recebe 380 ÷ √3 ≈ 220 V.</li>
        </ul>
        ${fig("mot-6-pontas", "Bloco de ligação de 6 pontas: pontes verticais 6-1, 4-2, 5-3 para triângulo em 220 V; ponte unindo 4-5-6 para estrela em 380 V", "A disposição 6-4-5 em cima e 1-2-3 embaixo facilita trocar as pontes.")}
        <p>Esse mesmo motor, numa rede de 220 V, pode partir em <strong>estrela-triângulo</strong>, porque a tensão em triângulo é a da rede (curso de Comandos, aula 3-3).</p>

        <h2>Motor de 12 pontas (220/380/440/760 V)</h2>
        <p>Cada fase é dividida em <strong>duas meias-bobinas</strong> de 220 V. Ligando as meias-bobinas em <strong>paralelo</strong> ou em <strong>série</strong>,
        e o conjunto em <strong>triângulo</strong> ou <strong>estrela</strong>, saem quatro tensões. Uma numeração muito usada:</p>
        <table>
          <tr><th>Tensão</th><th>Ligação</th><th>L1</th><th>L2</th><th>L3</th><th>Unir entre si</th></tr>
          <tr><td>220 V</td><td>Triângulo paralelo (ΔΔ)</td><td>1-6-7-12</td><td>2-4-8-10</td><td>3-5-9-11</td><td>—</td></tr>
          <tr><td>380 V</td><td>Estrela paralela (YY)</td><td>1-7</td><td>2-8</td><td>3-9</td><td>4-5-6-10-11-12</td></tr>
          <tr><td>440 V</td><td>Triângulo série (Δ)</td><td>1-12</td><td>2-10</td><td>3-11</td><td>4-7, 5-8, 6-9</td></tr>
          <tr><td>760 V</td><td>Estrela série (Y)</td><td>1</td><td>2</td><td>3</td><td>4-7, 5-8, 6-9 e 10-11-12</td></tr>
        </table>
        <div class="destaque alerta">A numeração pode mudar entre fabricantes e motores rebobinados. <strong>Sempre confira o esquema da placa ou da tampa da caixa de ligação.</strong>
        Ligar um motor de 220 V em 380 V queima o enrolamento em pouco tempo. O contrário (380 V ligado em 220 V) deixa o motor fraco e ele esquenta com carga.</div>

        <h2>Pontas sem numeração (motor rebobinado)</h2>
        <p>Com o multímetro em continuidade, identifique os pares de cada bobina. Descobrir a polaridade (início e fim) exige testes adicionais,
        como o do pulso com bateria e voltímetro. Isso é assunto para um rebobinador ou técnico experiente: um erro de polaridade faz o motor zumbir e esquentar.</p>

        <h2>Depois de ligar</h2>
        <ol>
          <li>Aperte bem as porcas das pontes e dos cabos. Mau contato na caixa de ligação é causa comum de falta de fase.</li>
          <li>Ligue o <strong>terra</strong> no borne de aterramento.</li>
          <li>Feche a caixa com a vedação no lugar (para manter o grau IP).</li>
          <li>Dê um pulso para conferir o sentido de giro antes de acoplar a carga, quando possível.</li>
          <li>Meça a corrente nas três fases com a máquina trabalhando.</li>
        </ol>

        <h2>Teste rápido</h2>
        <details><summary>1. Motor 220/380 V numa rede de 380 V: qual ligação?</summary><p><strong>Estrela</strong>, unindo 4-5-6 e ligando 1, 2 e 3 às fases.</p></details>
        <details><summary>2. Motor de 12 pontas numa rede de 440 V: o que unir?</summary><p>Pela tabela de exemplo: triângulo série. L1 em 1-12, L2 em 2-10, L3 em 3-11 e unir 4-7, 5-8 e 6-9. Conferir na placa.</p></details>
        <details><summary>3. Por que em estrela cada bobina recebe menos tensão?</summary><p>Porque cada bobina fica entre uma fase e o ponto comum da estrela, e não entre duas fases: recebe a tensão de linha dividida por √3.</p></details>
      `
    },

    "2-3": {
      duracao: "12 min de leitura",
      texto: `
        <h2>Por que medir a isolação?</h2>
        <p>O verniz e os materiais isolantes do enrolamento envelhecem com calor, umidade, poeira e vibração. Um isolamento fraco leva a
        <strong>fuga para a carcaça</strong> (choque, desarme do DR) e, depois, a <strong>curto e queima</strong> do motor. O multímetro comum
        mede com poucos volts e não mostra esse problema. O <strong>megômetro</strong> aplica uma tensão contínua alta (500 V, 1.000 V...) e mede
        resistências de milhões de ohms (MΩ).</p>
        ${seg}

        ${fig("mot-megometro", "Megômetro com o terminal LINE ligado às pontas do motor e o terminal EARTH ligado à carcaça", "Ligação básica: enrolamento × carcaça.")}

        <h2>Passo a passo</h2>
        <ol>
          <li><strong>Desenergize e bloqueie</strong> o circuito. Teste a ausência de tensão.</li>
          <li><strong>Desconecte</strong> os cabos de alimentação na caixa de ligação. Assim você mede só o motor (e protege inversores e outros componentes da tensão de teste).</li>
          <li>Una as pontas do motor (ou meça uma fase de cada vez, se as pontas estiverem separadas).</li>
          <li>Ligue o terminal <strong>LINE</strong> às pontas e o <strong>EARTH</strong> à carcaça, num ponto limpo sem tinta.</li>
          <li>Escolha a tensão de teste. Para motores de baixa tensão (até 1.000 V), use <strong>500 V CC</strong> (ou o que o fabricante indicar).</li>
          <li>Aplique a tensão por <strong>1 minuto</strong> e anote a leitura, a temperatura do motor e a umidade.</li>
          <li><strong>Descarregue</strong> o enrolamento ao final (muitos megômetros fazem isso automaticamente). O enrolamento guarda carga como um capacitor.</li>
        </ol>
        <div class="destaque alerta">Durante o teste há tensão perigosa nas pontas do motor. Ninguém deve tocar no motor ou nos cabos de teste.</div>

        <h2>Como interpretar</h2>
        <ul>
          <li><strong>Valor mínimo:</strong> uma regra antiga e simples é (tensão nominal em kV + 1) MΩ, ou seja, cerca de <strong>1 MΩ</strong> para motores de baixa tensão.
          A norma IEEE 43 recomenda pelo menos <strong>5 MΩ</strong> para enrolamentos de baixa tensão com fio esmaltado. Muitas empresas adotam o valor do fabricante ou um critério interno.</li>
          <li><strong>Temperatura:</strong> a resistência de isolação cai muito com o calor (aproximadamente pela metade a cada 10 °C). Compare medições na mesma temperatura, ou corrija.</li>
          <li><strong>Tendência:</strong> mais importante que um valor isolado é o <strong>histórico</strong>. Uma queda forte de uma medição para outra indica problema, mesmo que o valor ainda pareça alto.</li>
          <li><strong>Índice de polarização (IP):</strong> leitura de 10 min ÷ leitura de 1 min. Valor maior ou igual a 2 indica isolamento limpo e seco. Perto de 1 indica umidade ou sujeira.</li>
        </ul>

        <h2>Valor baixo. E agora?</h2>
        <ul>
          <li><strong>Umidade</strong> (motor parado muito tempo, ambiente úmido): secagem em estufa ou com resistência de aquecimento, por empresa especializada, e nova medição.</li>
          <li><strong>Sujeira e óleo:</strong> limpeza adequada do enrolamento.</li>
          <li><strong>Valor próximo de zero:</strong> isolamento danificado. Motor para rebobinamento ou troca.</li>
        </ul>

        <h2>Outras medições úteis</h2>
        <table>
          <tr><th>Medição</th><th>Instrumento</th><th>O que mostra</th></tr>
          <tr><td>Resistência de cada bobina</td><td>Multímetro (ou micro-ohmímetro)</td><td>Bobinas iguais entre si; diferença indica espiras em curto ou mau contato</td></tr>
          <tr><td>Isolação entre fases</td><td>Megômetro</td><td>Fuga entre bobinas (só com pontas separadas)</td></tr>
          <tr><td>Corrente nas três fases</td><td>Alicate amperímetro</td><td>Sobrecarga e desequilíbrio</td></tr>
          <tr><td>Temperatura da carcaça</td><td>Termômetro infravermelho</td><td>Aquecimento anormal, rolamentos</td></tr>
        </table>

        <h2>Desafio final</h2>
        <p>Um motor de 3 cv (220/380 V, 8,6/5,0 A) de uma bomba ficou 6 meses parado numa casa de bombas úmida. Antes de religá-lo, o que você faz?</p>
        <details><summary>Ver resposta</summary><p>Desenergizar e bloquear; abrir a caixa de ligação e conferir a ligação de acordo com a rede (triângulo em 220 V ou estrela em 380 V);
        desconectar os cabos e medir a isolação com megômetro em 500 V por 1 minuto. Se o valor estiver baixo, providenciar secagem antes de ligar.
        Conferir aperto das conexões e o aterramento, girar o eixo à mão para checar rolamentos, ajustar o relé térmico pela corrente da placa
        (8,6 A em 220 V ou 5,0 A em 380 V), ligar e medir a corrente nas três fases.</p></details>
      `
    }
  };
})();
