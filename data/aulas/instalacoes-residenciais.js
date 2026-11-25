/*
 * Conteúdo das aulas do curso "Instalações Elétricas Residenciais".
 * Chave = "<módulo>-<aula>" (mesma ordem de data/cursos.js).
 *
 * Casa de exemplo usada no curso inteiro (rede 127/220 V, duas fases + neutro):
 *   Sala 3,5×4,0 · Dormitório 1 3,0×3,5 · Dormitório 2 3,0×3,0 · Cozinha 3,0×3,0
 *   Banheiro 1,5×2,2 · Área de serviço 1,8×2,0 · Chuveiro 5.500 W / 220 V
 *   Iluminação 780 VA · TUG 5.200 VA · TUE 5.500 W · Total 11.480 VA
 *   C1 ilum 780 VA (6,1 A) · C2 TUG sala/dorms/banho 1.500 VA (11,8 A) · C3 TUG cozinha 1.900 VA (15,0 A)
 *   C4 TUG serviço 1.800 VA (14,2 A) · C5 chuveiro 5.500 W 220 V (25 A)
 * Regras conforme ABNT NBR 5410:2004 (resumidas — consultar a norma no projeto real).
 */
window.ROTA_AULAS = window.ROTA_AULAS || {};
(function () {
  const fig = (nome, alt, legenda) =>
    '<figure class="diagrama"><img src="assets/img/diagramas/' + nome + '.svg" alt="' + alt + '" loading="lazy"><figcaption>' + legenda + "</figcaption></figure>";
  const norma = '<div class="destaque"><strong>Norma:</strong> as regras deste curso resumem a <strong>ABNT NBR 5410</strong> (instalações elétricas de baixa tensão). Num projeto real, consulte a norma completa, o padrão da concessionária local e um profissional habilitado (com ART/TRT).</div>';

  window.ROTA_AULAS["instalacoes-residenciais"] = {
    "1-1": {
      duracao: "9 min de leitura",
      texto: `
        <h2>O projeto começa no papel</h2>
        <p>Antes de passar o primeiro eletroduto, o eletricista precisa entender a <strong>planta baixa</strong>: o desenho da casa visto de cima,
        com paredes, portas, janelas e as medidas de cada cômodo. Sobre ela é feito o <strong>projeto elétrico</strong>.</p>
        ${norma}

        <h2>O que procurar na planta</h2>
        <ul>
          <li><strong>Cotas:</strong> medidas em metros (ou centímetros). Com elas calculamos área e perímetro de cada cômodo.</li>
          <li><strong>Escala:</strong> 1:50 significa que 1 cm no papel = 50 cm na obra.</li>
          <li><strong>Portas:</strong> indicam onde ficam os interruptores (do lado da maçaneta, na entrada do cômodo).</li>
          <li><strong>Legenda:</strong> explica cada símbolo. Os símbolos variam entre projetistas — <strong>sempre leia a legenda</strong>.</li>
        </ul>

        ${fig("res-planta", "Planta de uma sala com ponto de luz, interruptor, tomadas e eletrodutos", "Sala da casa de exemplo com a simbologia usada neste curso.")}

        <h2>A casa de exemplo deste curso</h2>
        <p>Vamos projetar uma casa térrea, do levantamento de cargas até a entrega:</p>
        <table>
          <tr><th>Cômodo</th><th>Medidas</th><th>Área</th><th>Perímetro</th></tr>
          <tr><td>Sala</td><td>3,5 × 4,0 m</td><td>14,0 m²</td><td>15,0 m</td></tr>
          <tr><td>Dormitório 1</td><td>3,0 × 3,5 m</td><td>10,5 m²</td><td>13,0 m</td></tr>
          <tr><td>Dormitório 2</td><td>3,0 × 3,0 m</td><td>9,0 m²</td><td>12,0 m</td></tr>
          <tr><td>Cozinha</td><td>3,0 × 3,0 m</td><td>9,0 m²</td><td>12,0 m</td></tr>
          <tr><td>Banheiro</td><td>1,5 × 2,2 m</td><td>3,3 m²</td><td>7,4 m</td></tr>
          <tr><td>Área de serviço</td><td>1,8 × 2,0 m</td><td>3,6 m²</td><td>7,6 m</td></tr>
        </table>
        <p>Área = comprimento × largura. Perímetro = soma dos quatro lados = 2 × (comprimento + largura).</p>

        <h2>Teste rápido</h2>
        <details><summary>1. Um quarto de 2,8 × 3,2 m tem que área e perímetro?</summary><p><strong>8,96 m²</strong> e <strong>12,0 m</strong>.</p></details>
        <details><summary>2. Na escala 1:50, uma parede de 8 cm no papel mede quanto?</summary><p>8 × 50 = 400 cm = <strong>4 m</strong>.</p></details>
      `
    },
    "1-2": {
      duracao: "12 min de leitura",
      texto: `
        <h2>Quanto de carga a casa vai ter?</h2>
        <p>A <strong>previsão de cargas</strong> define, para cada cômodo, quantos pontos de luz e tomadas instalar e qual potência considerar.
        A NBR 5410 dá os <strong>mínimos</strong> — o cliente pode (e muitas vezes deve) pedir mais.</p>

        <h2>Iluminação</h2>
        <ul>
          <li>Pelo menos <strong>um ponto de luz no teto</strong> por cômodo, comandado por interruptor.</li>
          <li>Área até 6 m² → no mínimo <strong>100 VA</strong>.</li>
          <li>Área acima de 6 m² → <strong>100 VA</strong> para os primeiros 6 m² + <strong>60 VA</strong> para cada <strong>4 m² inteiros</strong> a mais.</li>
        </ul>
        <p><strong>Sala (14 m²):</strong> 14 − 6 = 8 m² → 2 blocos de 4 m² → 100 + 2 × 60 = <strong>220 VA</strong>.<br>
        <strong>Dormitório 1 (10,5 m²):</strong> 4,5 m² → 1 bloco inteiro → <strong>160 VA</strong>.</p>

        <h2>Tomadas de uso geral (TUG) — quantidade mínima</h2>
        <table>
          <tr><th>Local</th><th>Regra</th></tr>
          <tr><td>Banheiro</td><td>Pelo menos 1, junto ao lavatório</td></tr>
          <tr><td>Cozinha, copa, área de serviço, lavanderia</td><td>1 para cada <strong>3,5 m</strong> de perímetro (ou fração)</td></tr>
          <tr><td>Sala e dormitórios</td><td>1 para cada <strong>5 m</strong> de perímetro (ou fração)</td></tr>
          <tr><td>Varanda</td><td>Pelo menos 1</td></tr>
        </table>

        <h2>TUG — potência mínima</h2>
        <ul>
          <li><strong>Cozinha, copa, área de serviço, lavanderia e banheiro:</strong> 600 VA por tomada até 3 tomadas; 100 VA para as demais.</li>
          <li><strong>Demais cômodos:</strong> 100 VA por tomada.</li>
        </ul>

        <h2>Tomadas de uso específico (TUE)</h2>
        <p>Equipamentos fixos (chuveiro, ar-condicionado, forno elétrico, torneira elétrica): use a <strong>potência nominal</strong> do aparelho.</p>

        <h2>Levantamento da casa de exemplo</h2>
        <table>
          <tr><th>Cômodo</th><th>Iluminação</th><th>TUG (qtd.)</th><th>TUG (VA)</th></tr>
          <tr><td>Sala</td><td>220 VA</td><td>15 ÷ 5 = 3</td><td>300</td></tr>
          <tr><td>Dormitório 1</td><td>160 VA</td><td>13 ÷ 5 = 2,6 → 3</td><td>300</td></tr>
          <tr><td>Dormitório 2</td><td>100 VA</td><td>12 ÷ 5 = 2,4 → 3</td><td>300</td></tr>
          <tr><td>Cozinha</td><td>100 VA</td><td>12 ÷ 3,5 = 3,4 → 4</td><td>3×600 + 100 = 1.900</td></tr>
          <tr><td>Banheiro</td><td>100 VA</td><td>1</td><td>600</td></tr>
          <tr><td>Área de serviço</td><td>100 VA</td><td>7,6 ÷ 3,5 = 2,2 → 3</td><td>3×600 = 1.800</td></tr>
          <tr><td><strong>Total</strong></td><td><strong>780 VA</strong></td><td></td><td><strong>5.200 VA</strong></td></tr>
        </table>
        <p>TUE: chuveiro de <strong>5.500 W</strong> (220 V). <strong>Carga instalada: 780 + 5.200 + 5.500 = 11.480 VA.</strong></p>
        <div class="destaque"><strong>VA ou W?</strong> VA é potência aparente. Para cargas resistivas (chuveiro, aquecedor), VA = W. Para simplificar,
        neste curso trataremos os valores de tomadas e iluminação como se fossem iguais em VA e W.</div>

        <h2>Teste rápido</h2>
        <details><summary>1. Iluminação mínima de um quarto de 12 m²?</summary><p>12 − 6 = 6 → 1 bloco de 4 m² → <strong>160 VA</strong>.</p></details>
        <details><summary>2. Cozinha com 14 m de perímetro: quantas TUGs e quantos VA?</summary><p>14 ÷ 3,5 = 4 → <strong>4 tomadas</strong>; 3 × 600 + 100 = <strong>1.900 VA</strong>.</p></details>
      `
    },
    "1-3": {
      duracao: "10 min de leitura",
      texto: `
        <h2>Por que dividir em circuitos?</h2>
        <ul>
          <li>Um defeito desliga só uma parte da casa.</li>
          <li>Cabos e disjuntores ficam de tamanho razoável.</li>
          <li>Manutenção mais segura e fácil.</li>
        </ul>

        <h2>Regras principais (NBR 5410)</h2>
        <ul>
          <li><strong>Iluminação e tomadas em circuitos separados.</strong></li>
          <li>Tomadas de <strong>cozinha, copa, área de serviço e lavanderia</strong> em circuitos exclusivos para esses locais.</li>
          <li>Todo equipamento com corrente nominal acima de <strong>10 A</strong> deve ter <strong>circuito próprio</strong> (ex.: chuveiro).</li>
        </ul>
        <p><strong>Boa prática:</strong> manter cada circuito de tomadas abaixo de ~1.500 a 2.000 VA em 127 V, para usar cabo de 2,5 mm² com folga.</p>

        <h2>Circuitos da casa de exemplo</h2>
        <table>
          <tr><th>Circuito</th><th>O que alimenta</th><th>Potência</th><th>Tensão</th><th>Corrente (P ÷ U)</th></tr>
          <tr><td>C1</td><td>Iluminação (todos os cômodos)</td><td>780 VA</td><td>127 V</td><td>6,1 A</td></tr>
          <tr><td>C2</td><td>TUG sala, dormitórios e banheiro</td><td>1.500 VA</td><td>127 V</td><td>11,8 A</td></tr>
          <tr><td>C3</td><td>TUG cozinha</td><td>1.900 VA</td><td>127 V</td><td>15,0 A</td></tr>
          <tr><td>C4</td><td>TUG área de serviço</td><td>1.800 VA</td><td>127 V</td><td>14,2 A</td></tr>
          <tr><td>C5</td><td>Chuveiro (TUE)</td><td>5.500 W</td><td>220 V</td><td>25,0 A</td></tr>
        </table>
        <p>Essa corrente de projeto se chama <strong>Ib</strong>. Ela vai definir cabos e disjuntores nas próximas aulas.</p>

        <h2>Equilibrando as fases</h2>
        <p>Numa ligação bifásica (2 fases + neutro), distribua os circuitos de 127 V entre as fases. O chuveiro, em 220 V, usa as duas:</p>
        <ul>
          <li><strong>Fase A:</strong> C1 + C3 + metade do chuveiro = 780 + 1.900 + 2.750 = <strong>5.430 VA</strong></li>
          <li><strong>Fase B:</strong> C2 + C4 + metade do chuveiro = 1.500 + 1.800 + 2.750 = <strong>6.050 VA</strong></li>
        </ul>
        <p>Diferença pequena — bom equilíbrio. O disjuntor geral e o padrão de entrada seguem a norma de fornecimento da sua concessionária.</p>

        <h2>Teste rápido</h2>
        <details><summary>1. Um ar-condicionado de 1.500 W em 220 V precisa de circuito próprio?</summary><p>I = 6,8 A (abaixo de 10 A) — não obrigatoriamente, mas é <strong>boa prática</strong> dar circuito próprio.</p></details>
        <details><summary>2. Posso ligar a iluminação da cozinha no circuito de tomadas da cozinha?</summary><p><strong>Não.</strong> Iluminação e tomadas ficam em circuitos separados.</p></details>
      `
    },
    "2-1": {
      duracao: "12 min de leitura",
      texto: `
        <h2>Três critérios para escolher o cabo</h2>
        <ol>
          <li><strong>Seção mínima</strong> da norma.</li>
          <li><strong>Capacidade de condução de corrente (Iz)</strong>, já corrigida pelo agrupamento.</li>
          <li><strong>Queda de tensão</strong> (até 4% nos circuitos terminais).</li>
        </ol>
        <p>Vale a <strong>maior</strong> seção entre os três critérios.</p>

        <h2>1) Seções mínimas (cobre)</h2>
        <ul>
          <li>Circuitos de <strong>iluminação: 1,5 mm²</strong></li>
          <li>Circuitos de <strong>força (tomadas): 2,5 mm²</strong></li>
        </ul>

        <h2>2) Capacidade de corrente</h2>
        <p>Valores para cabo de cobre com isolação de PVC, em eletroduto embutido na alvenaria (método B1), 2 condutores carregados:</p>
        <table>
          <tr><th>Seção</th><th>1,5</th><th>2,5</th><th>4</th><th>6</th><th>10</th></tr>
          <tr><td>Iz (A)</td><td>17,5</td><td>24</td><td>32</td><td>41</td><td>57</td></tr>
        </table>
        <p>Quando vários circuitos passam no <strong>mesmo eletroduto</strong>, eles se aquecem mutuamente e a capacidade cai:</p>
        <table>
          <tr><th>Circuitos juntos</th><th>1</th><th>2</th><th>3</th><th>4</th></tr>
          <tr><td>Fator de agrupamento</td><td>1,00</td><td>0,80</td><td>0,70</td><td>0,65</td></tr>
        </table>

        <h2>Aplicando na casa de exemplo</h2>
        <p>Supondo que C1 a C4 dividam eletrodutos em trechos com até <strong>3 circuitos</strong> (fator 0,70) e o chuveiro tenha eletroduto próprio:</p>
        <table>
          <tr><th>Circuito</th><th>Ib</th><th>Cabo</th><th>Iz corrigido</th></tr>
          <tr><td>C1 iluminação</td><td>6,1 A</td><td>1,5 mm²</td><td>17,5 × 0,7 = 12,25 A</td></tr>
          <tr><td>C2 TUG</td><td>11,8 A</td><td>2,5 mm²</td><td>24 × 0,7 = 16,8 A</td></tr>
          <tr><td>C3 TUG cozinha</td><td>15,0 A</td><td>2,5 mm²</td><td>16,8 A</td></tr>
          <tr><td>C4 TUG serviço</td><td>14,2 A</td><td>2,5 mm²</td><td>16,8 A</td></tr>
          <tr><td>C5 chuveiro</td><td>25,0 A</td><td><strong>6 mm²</strong></td><td>41 A (sozinho)</td></tr>
        </table>
        <p>Para o chuveiro, 4 mm² (Iz = 32 A) suportaria os 25 A, mas deixaria o disjuntor sem margem. Usamos <strong>6 mm²</strong> —
        veremos o porquê na aula de disjuntores.</p>

        <h2>3) Queda de tensão</h2>
        <p>Use a Segunda Lei de Ohm (curso de Fundamentos): R = 0,0172 × L<sub>ida+volta</sub> ÷ seção. Em circuitos longos, ela pode obrigar a
        aumentar a seção mesmo que a corrente seja baixa.</p>

        <h2>Cores dos condutores</h2>
        <ul>
          <li><strong>Neutro:</strong> azul-claro.</li>
          <li><strong>Proteção (terra, PE):</strong> verde-amarelo (ou verde).</li>
          <li><strong>Fase e retorno:</strong> outras cores (preto, vermelho, branco, cinza...). Padronize na obra.</li>
        </ul>

        <h2>Teste rápido</h2>
        <details><summary>1. Um circuito de 2,5 mm² dividindo eletroduto com outro (2 circuitos). Iz corrigido?</summary><p>24 × 0,80 = <strong>19,2 A</strong>.</p></details>
        <details><summary>2. Qual a seção mínima para um circuito de tomadas?</summary><p><strong>2,5 mm²</strong>.</p></details>
      `
    },
    "2-2": {
      duracao: "10 min de leitura",
      texto: `
        <h2>O que o disjuntor protege</h2>
        <p>O disjuntor termomagnético protege o <strong>cabo</strong> (e não o aparelho) contra:</p>
        <ul>
          <li><strong>Sobrecarga</strong> — parte térmica (lâmina bimetálica, efeito Joule): desarma com atraso.</li>
          <li><strong>Curto-circuito</strong> — parte magnética (bobina): desarma instantaneamente.</li>
        </ul>

        <h2>A regra de ouro da coordenação</h2>
        <div class="destaque"><strong>Ib ≤ In ≤ Iz</strong><br>
        corrente de projeto do circuito ≤ corrente nominal do disjuntor ≤ capacidade do cabo</div>
        ${fig("res-coordenacao", "Linha numérica com Ib 25 A, In 32 A e Iz 41 A", "Chuveiro da casa de exemplo: 25 A ≤ 32 A ≤ 41 A.")}
        <p>Disjuntores para instalações residenciais (NBR NM 60898) já atendem à segunda condição da norma (corrente de atuação ≤ 1,45 × Iz) quando In ≤ Iz.</p>

        <h2>Valores comerciais</h2>
        <p>6 · 10 · 16 · 20 · 25 · 32 · 40 · 50 · 63 A</p>

        <h2>Escolhendo os disjuntores da casa de exemplo</h2>
        <table>
          <tr><th>Circuito</th><th>Ib</th><th>In</th><th>Iz</th><th>Confere?</th></tr>
          <tr><td>C1</td><td>6,1</td><td>10 A</td><td>12,25</td><td>6,1 ≤ 10 ≤ 12,25 ✓</td></tr>
          <tr><td>C2</td><td>11,8</td><td>16 A</td><td>16,8</td><td>✓</td></tr>
          <tr><td>C3</td><td>15,0</td><td>16 A</td><td>16,8</td><td>✓</td></tr>
          <tr><td>C4</td><td>14,2</td><td>16 A</td><td>16,8</td><td>✓</td></tr>
          <tr><td>C5</td><td>25,0</td><td>32 A (bipolar)</td><td>41</td><td>✓</td></tr>
        </table>
        <p>Por que não 4 mm² (Iz = 32 A)? Haveria duas opções, ambas no limite: disjuntor de 25 A (In = Ib, sem folga — desarmes indesejados quando a
        tensão sobe um pouco) ou de 32 A (In = Iz, cabo trabalhando no máximo). Com <strong>6 mm² e 32 A</strong> há margem dos dois lados.</p>

        <h2>Curvas de disparo</h2>
        <ul>
          <li><strong>Curva B</strong> — cargas resistivas e iluminação (desarma rápido no curto).</li>
          <li><strong>Curva C</strong> — cargas com partida (motores, compressores de ar-condicionado, bombas).</li>
        </ul>

        <div class="destaque alerta"><strong>Nunca</strong> troque um disjuntor que "desarma toda hora" por um maior sem trocar o cabo.
        O disjuntor maior deixa o cabo aquecer acima do limite — é assim que começam muitos incêndios.</div>

        <h2>Teste rápido</h2>
        <details><summary>1. Ib = 18 A, cabo com Iz = 24 A. Qual disjuntor?</summary><p><strong>20 A</strong> (18 ≤ 20 ≤ 24).</p></details>
        <details><summary>2. Que curva usar no circuito de uma bomba d'água?</summary><p><strong>Curva C</strong>.</p></details>
      `
    },
    "2-3": {
      duracao: "10 min de leitura",
      texto: `
        <h2>DR — dispositivo diferencial residual</h2>
        <p>O DR compara a corrente que <strong>vai</strong> pela fase com a que <strong>volta</strong> pelo neutro. Se faltar uma parte (ela "fugiu"
        para a terra — às vezes através de uma pessoa), ele desliga em milissegundos.</p>
        <ul>
          <li>Para proteção de pessoas: sensibilidade de <strong>30 mA</strong>.</li>
          <li>O disjuntor protege o <strong>cabo</strong>; o DR protege as <strong>pessoas</strong>. Um não substitui o outro.</li>
        </ul>

        <h2>Onde o DR é obrigatório (NBR 5410)</h2>
        <ul>
          <li>Circuitos que atendem locais com <strong>banheira ou chuveiro</strong>.</li>
          <li>Tomadas em <strong>áreas externas</strong> e tomadas internas que possam alimentar equipamentos lá fora.</li>
          <li><strong>Cozinhas, copas, lavanderias, áreas de serviço, garagens</strong> e demais áreas internas molhadas ou sujeitas a lavagem.</li>
        </ul>
        <p>Na casa de exemplo: C2 (tomada do banheiro), C3, C4 e C5. Na prática, é comum usar <strong>um DR geral</strong> ou um DR por grupo de circuitos.</p>

        <div class="destaque"><strong>DR desarmando com o chuveiro?</strong> Chuveiros antigos com resistência exposta deixam passar corrente pela água para o terra.
        A solução é trocar por chuveiro com <strong>resistência blindada</strong> — não retirar o DR.</div>

        <h2>DPS — dispositivo de proteção contra surtos</h2>
        <p>Protege contra <strong>picos de tensão</strong> causados por raios e manobras na rede. Ele desvia o surto para o terra.</p>
        <ul>
          <li>Instalado no quadro, ligado entre <strong>cada fase (e o neutro) e o barramento de terra</strong>.</li>
          <li>Cabos de ligação <strong>curtos e retos</strong> — cada centímetro a mais piora a proteção.</li>
          <li>Tensão máxima de operação (Uc) compatível com a rede (ex.: 175 V em 127/220 V; 275 V em 220/380 V) — conforme o projeto.</li>
          <li>Sem um bom <strong>aterramento</strong>, o DPS não tem para onde mandar o surto.</li>
        </ul>

        <h2>Teste rápido</h2>
        <details><summary>1. O DR de 30 mA protege contra sobrecarga?</summary><p><strong>Não</strong> (a menos que seja um DR com disjuntor incorporado, o "DDR"). Ele protege contra fuga de corrente.</p></details>
        <details><summary>2. Para onde o DPS desvia o surto?</summary><p>Para o <strong>terra</strong>.</p></details>
      `
    },
    "3-1": {
      duracao: "9 min de leitura",
      texto: `
        <h2>Interruptor simples</h2>
        <p>O interruptor interrompe a <strong>fase</strong>. O fio que sai do interruptor e vai até a lâmpada se chama <strong>retorno</strong>.
        O neutro vai direto à lâmpada.</p>
        ${fig("res-interruptor-simples", "Ligação de interruptor simples: fase no interruptor, retorno até a lâmpada, neutro direto", "Fase → interruptor → retorno → lâmpada → neutro.")}
        <div class="destaque alerta"><strong>Por que nunca cortar o neutro?</strong> Com o interruptor no neutro, a lâmpada apaga mas o soquete continua
        <strong>energizado</strong> — quem for trocar a lâmpada leva choque.</div>

        <h2>Tomadas (padrão NBR 14136)</h2>
        <ul>
          <li>Três pinos: <strong>fase, neutro e terra</strong>. O terra é obrigatório.</li>
          <li><strong>10 A</strong> (pinos de 4 mm) para uso geral e <strong>20 A</strong> (pinos de 4,8 mm) para aparelhos de maior potência.</li>
          <li>Olhando a tomada de frente com o terra para cima: convenciona-se a <strong>fase à direita</strong> e o neutro à esquerda — siga o padrão da obra.</li>
        </ul>

        <h2>Alturas usuais (não são norma, são costume)</h2>
        <table>
          <tr><th>Ponto</th><th>Altura do piso</th></tr>
          <tr><td>Tomada baixa</td><td>≈ 0,30 m</td></tr>
          <tr><td>Interruptor e tomada média</td><td>≈ 1,10 a 1,30 m</td></tr>
          <tr><td>Tomada sobre bancada</td><td>≈ 1,10 a 1,20 m</td></tr>
          <tr><td>Tomada alta (ar-condicionado)</td><td>≈ 2,00 a 2,20 m</td></tr>
        </table>

        <h2>Boas práticas</h2>
        <ul>
          <li>Emendas <strong>somente dentro das caixas</strong>, nunca dentro do eletroduto.</li>
          <li>Use conectores de emenda ou solda + isolação adequada.</li>
          <li>Deixe ~15 cm de sobra de fio na caixa para futuras manutenções.</li>
        </ul>

        <h2>Teste rápido</h2>
        <details><summary>1. Qual fio passa pelo interruptor?</summary><p>A <strong>fase</strong> (e sai como retorno).</p></details>
        <details><summary>2. Pode emendar fio dentro do eletroduto?</summary><p><strong>Não</strong>. Só dentro de caixas.</p></details>
      `
    },
    "3-2": {
      duracao: "9 min de leitura",
      texto: `
        <h2>Comandar uma lâmpada de dois lugares</h2>
        <p>Em corredores, escadas e quartos grandes queremos acender a luz numa ponta e apagar na outra. Para isso usamos o
        <strong>interruptor paralelo</strong> (three-way), que tem 3 bornes: um comum e dois de comutação.</p>

        <h2>Ligação com dois paralelos</h2>
        <ol>
          <li>A <strong>fase</strong> chega no borne comum do paralelo 1.</li>
          <li>Os dois bornes de comutação do paralelo 1 são ligados aos dois do paralelo 2 (<strong>dois fios de ligação</strong>).</li>
          <li>Do borne comum do paralelo 2 sai o <strong>retorno</strong> para a lâmpada.</li>
          <li>O <strong>neutro</strong> vai direto à lâmpada.</li>
        </ol>

        <h2>Três ou mais pontos: o intermediário</h2>
        <p>O <strong>interruptor intermediário</strong> (four-way) fica entre os dois paralelos e "cruza" os dois fios de ligação. Pode haver quantos
        intermediários forem necessários.</p>
        ${fig("res-paralelo-intermediario", "Dois interruptores paralelos com um intermediário entre eles", "Paralelo → intermediário → paralelo: qualquer um deles liga ou desliga.")}

        <h2>Dica de campo: identificando os bornes</h2>
        <p>Com o circuito <strong>desenergizado</strong>, use o teste de continuidade do multímetro: o borne comum tem continuidade com um ou com o outro
        borne, conforme a posição da tecla.</p>

        <h2>Alternativa moderna</h2>
        <p>Para muitos pontos, pode-se usar <strong>pulsadores com relé de impulso</strong> (ou automação). A fiação fica mais simples:
        os pulsadores ficam todos em paralelo.</p>

        <h2>Teste rápido</h2>
        <details><summary>1. Quantos fios ligam um paralelo ao outro?</summary><p><strong>Dois</strong>.</p></details>
        <details><summary>2. Para comandar de 4 pontos, quantos intermediários?</summary><p><strong>Dois</strong> (paralelo + 2 intermediários + paralelo).</p></details>
      `
    },
    "3-3": {
      duracao: "10 min de leitura",
      texto: `
        <h2>O coração da instalação</h2>
        <p>O <strong>quadro de distribuição</strong> recebe a alimentação do medidor e a distribui para os circuitos, cada um com sua proteção.</p>
        ${fig("res-quadro", "Quadro com disjuntor geral, DR, DPS, cinco circuitos, reservas e barramentos", "Quadro da casa de exemplo.")}

        <h2>O que vai dentro</h2>
        <ul>
          <li><strong>Disjuntor geral</strong> (conforme o padrão da concessionária).</li>
          <li><strong>DR</strong> geral ou por grupos de circuitos.</li>
          <li><strong>DPS</strong> ligados ao barramento de terra.</li>
          <li><strong>Disjuntores dos circuitos</strong> (C1 a C5 na casa de exemplo).</li>
          <li><strong>Barramento de neutro</strong> e <strong>barramento de terra (PE)</strong>, separados.</li>
        </ul>

        <h2>Espaço reserva (NBR 5410)</h2>
        <table>
          <tr><th>Circuitos efetivos</th><th>Reserva mínima</th></tr>
          <tr><td>até 6</td><td>2 espaços</td></tr>
          <tr><td>7 a 12</td><td>3 espaços</td></tr>
          <tr><td>13 a 30</td><td>4 espaços</td></tr>
          <tr><td>acima de 30</td><td>15%</td></tr>
        </table>
        <p>A casa de exemplo tem 5 circuitos → <strong>2 espaços reserva</strong>.</p>

        <h2>Montagem: boas práticas</h2>
        <ul>
          <li>Cada circuito <strong>identificado</strong> (etiqueta com número e nome).</li>
          <li>Fios <strong>organizados</strong> e com as cores corretas.</li>
          <li>Terminais/ponteiras nos cabos flexíveis; <strong>aperto</strong> com o torque indicado pelo fabricante.</li>
          <li>Cada neutro do circuito volta pelo mesmo DR por onde passou sua fase.</li>
          <li>Deixar no quadro o <strong>diagrama unifilar</strong> ou a lista de circuitos.</li>
        </ul>

        <div class="destaque alerta"><strong>Erro comum:</strong> passar a fase pelo DR e o neutro por fora (ou misturar neutros de circuitos com e sem DR).
        O DR "vê" desequilíbrio e desarma sem motivo aparente.</div>

        <h2>Teste rápido</h2>
        <details><summary>1. Um quadro com 9 circuitos precisa de quantos espaços reserva?</summary><p><strong>3</strong>.</p></details>
        <details><summary>2. Neutro e terra podem ficar no mesmo barramento dentro do quadro de distribuição?</summary><p><strong>Não</strong> — barramentos separados (esquema TN-S).</p></details>
      `
    },
    "3-4": {
      duracao: "10 min de leitura",
      texto: `
        <h2>Para que serve o aterramento</h2>
        <ul>
          <li>Dar caminho seguro para correntes de falta (ex.: fase encostando na carcaça de uma máquina de lavar).</li>
          <li>Permitir que o DR e o disjuntor atuem.</li>
          <li>Escoar surtos (com o DPS).</li>
        </ul>

        <h2>Esquema TN-S (o mais usado em residências novas)</h2>
        <p>O neutro é aterrado na entrada, no <strong>BEP</strong> (barramento de equipotencialização principal). A partir daí, <strong>neutro e terra
        seguem separados</strong> até cada tomada.</p>
        ${fig("res-aterramento", "Esquema TN-S: neutro e terra ligados no BEP e separados até a tomada", "Esquema TN-S: neutro e PE só se encontram no BEP.")}

        <h2>Componentes</h2>
        <ul>
          <li><strong>Eletrodo de aterramento:</strong> haste de aço cobreado cravada no solo (ou a própria armadura da fundação).</li>
          <li><strong>Condutor de aterramento:</strong> liga o eletrodo ao BEP.</li>
          <li><strong>Condutor de proteção (PE):</strong> verde-amarelo, vai a todas as tomadas e carcaças. Até 16 mm², mesma seção da fase.</li>
        </ul>

        <div class="destaque alerta"><strong>Gambiarras proibidas:</strong>
        <ul>
          <li>Ligar o pino terra da tomada no neutro ("jumper").</li>
          <li>Usar cano de água ou de gás como terra.</li>
          <li>Haste isolada sem ligação ao BEP só para "um aparelho".</li>
        </ul>
        Todas elas podem energizar carcaças ou impedir o DR de atuar.</div>

        <h2>Equipotencialização</h2>
        <p>Partes metálicas (tubulações metálicas, estruturas) devem ser ligadas ao BEP, para que não apareça diferença de potencial perigosa entre elas.</p>

        <h2>Teste rápido</h2>
        <details><summary>1. Onde neutro e terra são ligados no esquema TN-S?</summary><p>Somente no <strong>BEP</strong>, na entrada.</p></details>
        <details><summary>2. Qual a seção do PE para um circuito de 2,5 mm²?</summary><p><strong>2,5 mm²</strong> (igual à fase, até 16 mm²).</p></details>
      `
    },
    "4-1": {
      duracao: "10 min de leitura",
      texto: `
        <h2>Antes de energizar: inspeção visual</h2>
        <ul>
          <li>Seções dos cabos e disjuntores conforme o projeto.</li>
          <li>Cores corretas; emendas só em caixas; tampas e espelhos instalados.</li>
          <li>Quadro identificado, com espaços reserva e barramentos separados.</li>
          <li>DR e DPS instalados onde exigido.</li>
        </ul>

        <h2>Ensaios (NBR 5410, seção de verificação final)</h2>
        <ol>
          <li><strong>Continuidade do condutor de proteção (PE):</strong> com o multímetro/ohmímetro, do pino terra de cada tomada até o BEP — resistência baixa.</li>
          <li><strong>Resistência de isolamento:</strong> com o <strong>megômetro</strong> (500 V para instalações até 500 V), entre condutores e entre condutores e terra,
          com tudo desligado e aparelhos desconectados. A norma pede no mínimo <strong>0,5 MΩ</strong>; instalações novas costumam medir muito mais.</li>
          <li><strong>Polaridade:</strong> fase nos interruptores e no borne correto das tomadas; nada de neutro interrompido.</li>
          <li><strong>Funcionamento do DR:</strong> pelo botão de teste e, de preferência, com testador de DR (mede a corrente e o tempo de disparo).</li>
          <li><strong>Tensões:</strong> medir em todas as tomadas (127/220 V) e conferir o equilíbrio de fases com carga.</li>
        </ol>

        <h2>Documentação de entrega</h2>
        <ul>
          <li>Projeto atualizado "como construído" (as built) e diagrama unifilar.</li>
          <li>Lista de circuitos colada no quadro.</li>
          <li>Registro dos ensaios realizados.</li>
          <li>ART/TRT do responsável técnico.</li>
          <li>Orientação ao cliente: testar o DR periodicamente (botão "T").</li>
        </ul>

        <h2>Teste rápido</h2>
        <details><summary>1. Que instrumento mede resistência de isolamento?</summary><p>O <strong>megômetro</strong>.</p></details>
        <details><summary>2. Por que desconectar os aparelhos antes do teste de isolamento?</summary><p>Para não danificá-los com a tensão do ensaio e não "contaminar" a medição.</p></details>
      `
    },
    "4-2": {
      duracao: "9 min de leitura",
      texto: `
        <h2>Os erros que mais aparecem em vistorias</h2>
        <table>
          <tr><th>Erro</th><th>Consequência</th><th>Correto</th></tr>
          <tr><td>Disjuntor maior que o cabo suporta</td><td>Cabo superaquece sem desarmar → incêndio</td><td>Ib ≤ In ≤ Iz</td></tr>
          <tr><td>Chuveiro em cabo fino</td><td>Aquecimento, plugue/derivação derretida</td><td>Circuito exclusivo, cabo dimensionado (ex.: 6 mm² e 32 A para 5.500 W/220 V)</td></tr>
          <tr><td>Interruptor cortando o neutro</td><td>Soquete energizado com a luz apagada</td><td>Interruptor sempre na fase</td></tr>
          <tr><td>Terra ligado no neutro na tomada</td><td>Carcaça energizada se o neutro abrir</td><td>PE independente até o BEP</td></tr>
          <tr><td>Emenda dentro do eletroduto</td><td>Mau contato escondido, curto</td><td>Emendas só em caixas</td></tr>
          <tr><td>Sem DR em áreas molhadas</td><td>Risco de choque fatal</td><td>DR 30 mA onde a norma exige</td></tr>
          <tr><td>Bornes mal apertados</td><td>Efeito Joule no contato, carbonização</td><td>Torque correto, reaperto na manutenção</td></tr>
          <tr><td>Benjamins e extensões permanentes</td><td>Sobrecarga de tomadas</td><td>Prever tomadas suficientes no projeto</td></tr>
          <tr><td>Cores trocadas</td><td>Erros de manutenção, choques</td><td>Azul = neutro, verde-amarelo = terra</td></tr>
          <tr><td>Quadro sem identificação</td><td>Desligamento errado na manutenção</td><td>Etiquetas e lista de circuitos</td></tr>
        </table>

        <h2>Lembrete final</h2>
        <div class="destaque alerta">Antes de qualquer intervenção: <strong>desligue o disjuntor, sinalize, teste a ausência de tensão</strong>
        (com o "testar o testador") e só então trabalhe. Essas práticas são aprofundadas no curso de <strong>Segurança em Eletricidade</strong>.</div>

        <h2>Desafio final</h2>
        <p>Refaça o projeto da casa de exemplo acrescentando um <strong>ar-condicionado de 2.000 W em 220 V</strong> no dormitório 1.
        Defina circuito, cabo e disjuntor.</p>
        <details><summary>Ver resposta</summary><p>I = 2.000 ÷ 220 ≈ 9,1 A. Circuito próprio (C6), cabo de <strong>2,5 mm²</strong> (mínimo de força), disjuntor bipolar de
        <strong>16 A curva C</strong> (compressor). Conferência: 9,1 ≤ 16 ≤ 16,8 (com fator 0,70) ✓. Acrescentar tomada alta 2P+T de 20 A e atualizar o equilíbrio de fases.</p></details>
      `
    }
  };
})();
