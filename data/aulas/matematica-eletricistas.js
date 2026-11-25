/*
 * Conteúdo das aulas do curso "Matemática para Eletricistas".
 * Chave = "<módulo>-<aula>" (mesma ordem de data/cursos.js).
 * Campos: youtube, duracao, texto (HTML), materiais. Ver fundamentos-eletricidade.js.
 */
window.ROTA_AULAS = window.ROTA_AULAS || {};
window.ROTA_AULAS["matematica-eletricistas"] = {
  "1-1": {
    duracao: "7 min de leitura",
    texto: `
      <h2>Por que começar pelos números?</h2>
      <p>Todo cálculo elétrico usa números de tipos diferentes: inteiros para contar pontos de tomada, decimais para correntes,
      raízes para sistemas trifásicos. Saber em que "família" cada número está ajuda a não errar nas contas.</p>

      <h2>As famílias (conjuntos)</h2>
      <table>
        <tr><th>Conjunto</th><th>O que tem</th><th>Exemplo na elétrica</th></tr>
        <tr><td><strong>Naturais (ℕ)</strong></td><td>0, 1, 2, 3...</td><td>Quantidade de tomadas, de circuitos, de lâmpadas</td></tr>
        <tr><td><strong>Inteiros (ℤ)</strong></td><td>Naturais + negativos: ... −2, −1, 0, 1, 2...</td><td>Temperatura de câmara fria (−18 °C), polo negativo</td></tr>
        <tr><td><strong>Racionais (ℚ)</strong></td><td>Tudo que vira fração: 1/2, 0,75, 2,5</td><td>Eletroduto de 3/4", corrente de 0,5 A</td></tr>
        <tr><td><strong>Irracionais (𝕀)</strong></td><td>Decimais infinitos sem repetição</td><td><strong>√3 ≈ 1,732</strong> (trifásico) e <strong>π ≈ 3,1416</strong></td></tr>
        <tr><td><strong>Reais (ℝ)</strong></td><td>Racionais + irracionais</td><td>Praticamente todo resultado de medição</td></tr>
      </table>
      <p>Um conjunto "cabe" dentro do outro: ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ.</p>

      <h2>E os números complexos?</h2>
      <p>Existe ainda o conjunto dos <strong>complexos (ℂ)</strong>, que inclui raízes de números negativos. Eles aparecem mais adiante, no
      estudo de <strong>corrente alternada</strong> (impedância, fator de potência). Por enquanto, basta saber que existem.</p>

      <div class="destaque"><strong>Dica:</strong> irracionais como √3 e π nunca "fecham". Use 1,732 e 3,1416 nas contas de campo — é precisão
      mais que suficiente.</div>

      <h2>Teste rápido</h2>
      <details><summary>1. A temperatura −5 °C pertence a qual conjunto mais simples?</summary><p><strong>Inteiros (ℤ)</strong>.</p></details>
      <details><summary>2. √3 é racional ou irracional?</summary><p><strong>Irracional</strong>.</p></details>
    `
  },
  "1-2": {
    duracao: "8 min de leitura",
    texto: `
      <h2>Números decimais</h2>
      <p>No Brasil a parte inteira é separada da decimal por <strong>vírgula</strong> (2,5 A) e os milhares por ponto (5.500 W).
      Calculadoras e programas em inglês usam o contrário — cuidado ao copiar valores.</p>
      <ul>
        <li>Na <strong>soma e subtração</strong>, alinhe as vírgulas: 12,5 + 0,75 = 13,25.</li>
        <li>Na <strong>multiplicação</strong>, multiplique normalmente e conte as casas decimais: 2,5 × 0,4 = 1,00 (3 casas no total → 1,000 = 1).</li>
        <li>Na <strong>divisão</strong>, dá para "andar com a vírgula" nos dois números igualmente: 4,5 ÷ 0,15 = 450 ÷ 15 = 30.</li>
      </ul>

      <h2>Arredondamento</h2>
      <p>Olhe o primeiro algarismo que será descartado:</p>
      <ul>
        <li><strong>5 ou mais</strong> → sobe o anterior: 17,3228 com 2 casas → <strong>17,32</strong>; 4,7256 → <strong>4,73</strong>.</li>
        <li><strong>Menos de 5</strong> → mantém: 0,6834 com 2 casas → <strong>0,68</strong>; 219,63 com 1 casa → <strong>219,6</strong>.</li>
      </ul>

      <h2>Atenção: dimensionamento não arredonda, escolhe para cima</h2>
      <div class="destaque alerta">Calculou 17,3 A? Você <strong>não</strong> arredonda para 17 A. Você escolhe o <strong>próximo valor comercial acima</strong>:
      disjuntor de 20 A, cabo que suporte essa corrente. Arredondar para baixo em proteção e cabos é risco de aquecimento.</div>

      <h2>Exemplo</h2>
      <p>Um aparelho de 2.200 W em 127 V: I = 2.200 ÷ 127 = 17,3228... → <strong>17,32 A</strong> (para anotar) → disjuntor de <strong>20 A</strong> (para instalar).</p>

      <h2>Teste rápido</h2>
      <details><summary>1. Arredonde 3,1416 para duas casas.</summary><p><strong>3,14</strong>.</p></details>
      <details><summary>2. Arredonde 9,995 para duas casas.</summary><p><strong>10,00</strong> (o 9 sobe e "vira" a conta).</p></details>
      <details><summary>3. Cálculo deu 26,1 A. Disjuntor de 25 A serve?</summary><p><strong>Não</strong> — escolha o próximo acima (32 A) e confira o cabo.</p></details>
    `
  },
  "1-3": {
    duracao: "8 min de leitura",
    texto: `
      <h2>Frações no dia a dia do eletricista</h2>
      <p>Fração é uma divisão escrita em cima/embaixo: <strong>3/4</strong> = 3 ÷ 4 = 0,75. Elas aparecem muito em
      <strong>polegadas</strong> (eletrodutos, roscas, brocas) e no cálculo de <strong>resistores em paralelo</strong>.</p>

      <h2>Polegadas para milímetros</h2>
      <div class="destaque"><strong>1" (uma polegada) = 25,4 mm</strong></div>
      <table>
        <tr><th>Medida</th><th>Decimal</th><th>Em mm</th></tr>
        <tr><td>1/2"</td><td>0,5</td><td>12,7 mm</td></tr>
        <tr><td>3/4"</td><td>0,75</td><td>19,05 mm</td></tr>
        <tr><td>1"</td><td>1</td><td>25,4 mm</td></tr>
        <tr><td>1 1/4"</td><td>1,25</td><td>31,75 mm</td></tr>
      </table>

      <h2>Operações</h2>
      <ul>
        <li><strong>Simplificar:</strong> divida em cima e embaixo pelo mesmo número: 6/8 = 3/4.</li>
        <li><strong>Somar com o mesmo denominador:</strong> soma os de cima: 1/4 + 2/4 = 3/4.</li>
        <li><strong>Somar com denominadores diferentes:</strong> deixe todos com o mesmo denominador: 1/2 + 1/4 = 2/4 + 1/4 = 3/4.</li>
        <li><strong>Multiplicar:</strong> em cima × em cima, embaixo × embaixo: 1/2 × 3/4 = 3/8.</li>
        <li><strong>Dividir:</strong> multiplique pela fração invertida: 1/2 ÷ 1/4 = 1/2 × 4/1 = 2.</li>
      </ul>

      <h2>Aplicação: resistores em paralelo</h2>
      <p>6 Ω e 3 Ω em paralelo: 1/R = 1/6 + 1/3 = 1/6 + 2/6 = 3/6 = <strong>1/2</strong> → R = <strong>2 Ω</strong>.</p>

      <h2>Teste rápido</h2>
      <details><summary>1. Quanto é 1/4 + 1/2?</summary><p><strong>3/4</strong>.</p></details>
      <details><summary>2. Um eletroduto de 1/2" tem quantos milímetros?</summary><p><strong>12,7 mm</strong>.</p></details>
      <details><summary>3. 1/R = 1/4 + 1/4. Quanto vale R?</summary><p>1/R = 2/4 = 1/2 → <strong>R = 2 Ω</strong>.</p></details>
    `
  },
  "2-1": {
    duracao: "9 min de leitura",
    texto: `
      <h2>Potenciação</h2>
      <p>É multiplicar um número por ele mesmo várias vezes: <strong>aⁿ</strong> = a × a × ... (n vezes).</p>
      <ul>
        <li>5² = 25 · 2³ = 8 · 10⁴ = 10.000</li>
        <li>Qualquer número elevado a 0 vale 1: 10⁰ = 1</li>
        <li>Expoente negativo = "1 dividido por": 10⁻³ = 1/1.000 = 0,001</li>
      </ul>
      <p><strong>Regras úteis:</strong> aᵐ × aⁿ = aᵐ⁺ⁿ (10² × 10³ = 10⁵) · aᵐ ÷ aⁿ = aᵐ⁻ⁿ (10⁶ ÷ 10² = 10⁴).</p>

      <h2>Onde aparece</h2>
      <ul>
        <li><strong>P = R · I²</strong> — a corrente ao quadrado: 10 Ω com 3 A → 10 × 9 = 90 W.</li>
        <li><strong>P = U² / R</strong> — 220² / 48,4 = 48.400 / 48,4 = 1.000 W.</li>
        <li><strong>Área de um círculo:</strong> A = π · r². Um condutor de 1,78 mm de diâmetro (r = 0,89 mm): A = 3,1416 × 0,89² ≈ <strong>2,5 mm²</strong>.</li>
      </ul>

      <h2>Radiciação (raiz)</h2>
      <p>É a operação inversa: √25 = 5 porque 5² = 25.</p>
      <p>Para achar a corrente a partir da potência e da resistência: P = R · I² → <strong>I = √(P / R)</strong>.<br>
      Ex.: 1.000 W em 10 Ω → I = √100 = <strong>10 A</strong>.</p>

      <h2>A raiz mais famosa da elétrica: √3</h2>
      <p>Em sistemas <strong>trifásicos</strong>, a tensão entre duas fases é √3 (≈ 1,732) vezes a tensão entre fase e neutro:</p>
      <ul>
        <li>127 V × 1,732 ≈ <strong>220 V</strong></li>
        <li>220 V × 1,732 ≈ <strong>380 V</strong></li>
      </ul>
      <p>É por isso que existem os pares 127/220 V e 220/380 V.</p>

      <h2>Teste rápido</h2>
      <details><summary>1. Quanto é 4³?</summary><p><strong>64</strong>.</p></details>
      <details><summary>2. Um resistor de 25 Ω dissipa 100 W. Qual a corrente?</summary><p>I = √(100/25) = √4 = <strong>2 A</strong>.</p></details>
      <details><summary>3. Quanto é 10⁻²?</summary><p><strong>0,01</strong>.</p></details>
    `
  },
  "2-2": {
    duracao: "7 min de leitura",
    texto: `
      <h2>Números muito grandes e muito pequenos</h2>
      <p>Na elétrica lidamos com 13.800 V e com 0,000001 F no mesmo dia. A <strong>notação científica</strong> escreve qualquer número como:</p>
      <div class="destaque"><strong>a × 10ⁿ</strong>, com <strong>a</strong> entre 1 e 9,99...</div>

      <h2>Convertendo</h2>
      <ul>
        <li>13.800 → andamos a vírgula 4 casas para a esquerda → <strong>1,38 × 10⁴</strong></li>
        <li>0,00047 → andamos 4 casas para a direita → <strong>4,7 × 10⁻⁴</strong></li>
        <li>Regra: vírgula para a esquerda → expoente <strong>positivo</strong>; para a direita → <strong>negativo</strong>.</li>
      </ul>

      <h2>Operando</h2>
      <ul>
        <li><strong>Multiplicar:</strong> multiplica os números e <strong>soma</strong> os expoentes: (2 × 10³) × (3 × 10⁻²) = 6 × 10¹ = 60.</li>
        <li><strong>Dividir:</strong> divide os números e <strong>subtrai</strong> os expoentes: (8 × 10⁶) ÷ (2 × 10²) = 4 × 10⁴.</li>
        <li><strong>Somar:</strong> primeiro deixe os expoentes iguais: 3 × 10³ + 2 × 10² = 3 × 10³ + 0,2 × 10³ = 3,2 × 10³.</li>
      </ul>

      <h2>Na calculadora</h2>
      <p>Use a tecla <strong>EXP</strong> (ou EE / ×10ˣ). Para digitar 4,7 × 10⁻⁴: <code>4,7 EXP −4</code>. Não digite "× 10 ^" à parte — é fonte comum de erro.</p>

      <h2>Exemplo</h2>
      <p>Corrente num resistor de 4,7 × 10³ Ω (4,7 kΩ) com 12 V: I = 12 ÷ 4.700 = 2,55 × 10⁻³ A = <strong>2,55 mA</strong>.</p>

      <h2>Teste rápido</h2>
      <details><summary>1. Escreva 220.000 em notação científica.</summary><p><strong>2,2 × 10⁵</strong>.</p></details>
      <details><summary>2. Quanto é (5 × 10⁻³) × (4 × 10²)?</summary><p>20 × 10⁻¹ = <strong>2</strong>.</p></details>
    `
  },
  "2-3": {
    duracao: "8 min de leitura",
    texto: `
      <h2>Os prefixos que você vai ver todo dia</h2>
      <table>
        <tr><th>Prefixo</th><th>Símbolo</th><th>Fator</th><th>Exemplo</th></tr>
        <tr><td>giga</td><td>G</td><td>10⁹ = 1.000.000.000</td><td>GWh (produção de usinas)</td></tr>
        <tr><td>mega</td><td>M</td><td>10⁶ = 1.000.000</td><td>MΩ (megômetro), MW</td></tr>
        <tr><td>quilo</td><td>k</td><td>10³ = 1.000</td><td>kW, kV, kΩ, kWh</td></tr>
        <tr><td>—</td><td>—</td><td>1</td><td>V, A, Ω, W</td></tr>
        <tr><td>mili</td><td>m</td><td>10⁻³ = 0,001</td><td>mA (DR de 30 mA), mV</td></tr>
        <tr><td>micro</td><td>µ</td><td>10⁻⁶ = 0,000001</td><td>µF (capacitores de motor)</td></tr>
        <tr><td>nano</td><td>n</td><td>10⁻⁹</td><td>nF</td></tr>
        <tr><td>pico</td><td>p</td><td>10⁻¹²</td><td>pF (eletrônica)</td></tr>
      </table>

      <div class="destaque alerta"><strong>Maiúscula e minúscula importam:</strong> <strong>M</strong> (mega) é um milhão de vezes maior;
      <strong>m</strong> (mili) é mil vezes menor. 1 MΩ e 1 mΩ diferem por um fator de um bilhão!</div>

      <h2>Convertendo: ande 3 casas</h2>
      <p>Entre prefixos vizinhos (k ↔ unidade ↔ m ↔ µ) o fator é sempre 1.000. Anda-se a vírgula 3 casas.</p>
      <ul>
        <li>2,2 kΩ → <strong>2.200 Ω</strong></li>
        <li>450 mA → <strong>0,45 A</strong></li>
        <li>0,03 A → <strong>30 mA</strong></li>
        <li>13,8 kV → <strong>13.800 V</strong></li>
        <li>3.500 W → <strong>3,5 kW</strong></li>
      </ul>

      <h2>Regra de ouro dos cálculos</h2>
      <p>Antes de usar uma fórmula, <strong>converta tudo para a unidade base</strong> (V, A, Ω, W). Ex.: 12 V em 2,2 kΩ → I = 12 ÷ 2.200 = 0,00545 A = <strong>5,45 mA</strong>.</p>

      <h2>Teste rápido</h2>
      <details><summary>1. 0,5 MΩ são quantos kΩ?</summary><p><strong>500 kΩ</strong>.</p></details>
      <details><summary>2. 75 mA em ampères?</summary><p><strong>0,075 A</strong>.</p></details>
      <details><summary>3. 18.000 W em kW?</summary><p><strong>18 kW</strong>.</p></details>
    `
  },
  "3-1": {
    duracao: "8 min de leitura",
    texto: `
      <h2>Razão</h2>
      <p><strong>Razão</strong> é a comparação entre duas grandezas por divisão: a / b (lê-se "a está para b").</p>
      <p><strong>Exemplo — transformador:</strong> primário de 13.800 V e secundário de 220 V. Relação de transformação =
      13.800 / 220 ≈ <strong>62,7</strong>. A tensão do primário é 62,7 vezes a do secundário.</p>
      <p><strong>Exemplo — escala de planta:</strong> 1:50 significa que 1 cm no papel = 50 cm na obra.</p>

      <h2>Proporção</h2>
      <p>É a igualdade entre duas razões: <strong>a / b = c / d</strong>. A propriedade principal é a "multiplicação cruzada":</p>
      <div class="destaque"><strong>a × d = b × c</strong></div>
      <p>Ex.: 2 / 5 = 6 / 15 → 2 × 15 = 5 × 6 = 30 ✓</p>

      <h2>Grandezas diretamente proporcionais</h2>
      <p>Uma <strong>aumenta</strong>, a outra aumenta na mesma razão.</p>
      <ul>
        <li>Com a resistência fixa, <strong>corrente e tensão</strong> (Lei de Ohm): dobrou a tensão, dobra a corrente.</li>
        <li><strong>Comprimento do cabo e sua resistência</strong>.</li>
        <li><strong>Tempo ligado e energia consumida</strong>.</li>
      </ul>

      <h2>Grandezas inversamente proporcionais</h2>
      <p>Uma <strong>aumenta</strong>, a outra <strong>diminui</strong> na mesma razão.</p>
      <ul>
        <li>Para a mesma potência, <strong>tensão e corrente</strong>: 220 V puxa menos corrente que 127 V.</li>
        <li><strong>Seção do cabo e resistência</strong>: cabo com o dobro da seção tem metade da resistência.</li>
      </ul>

      <h2>Teste rápido</h2>
      <details><summary>1. Um transformador 220/24 V tem qual relação?</summary><p>220 / 24 ≈ <strong>9,17</strong>.</p></details>
      <details><summary>2. Na planta 1:100, 4 cm correspondem a quanto na obra?</summary><p><strong>400 cm = 4 m</strong>.</p></details>
      <details><summary>3. Seção do cabo e resistência são direta ou inversamente proporcionais?</summary><p><strong>Inversamente</strong>.</p></details>
    `
  },
  "3-2": {
    duracao: "9 min de leitura",
    texto: `
      <h2>A ferramenta de cálculo mais usada no campo</h2>
      <p>A <strong>regra de três</strong> resolve qualquer problema com três valores conhecidos e um desconhecido, quando as grandezas são proporcionais.</p>

      <h2>Passo a passo</h2>
      <ol>
        <li>Monte duas colunas, uma para cada grandeza.</li>
        <li>Coloque os valores na mesma linha quando forem correspondentes.</li>
        <li>Decida: <strong>direta</strong> (as duas sobem juntas) ou <strong>inversa</strong> (uma sobe, a outra desce)?</li>
        <li>Direta → multiplique <strong>cruzado</strong>. Inversa → multiplique <strong>em linha</strong>.</li>
      </ol>

      <h2>Exemplo 1 — direta (orçamento)</h2>
      <p>10 m de cabo custam R$ 45,00. Quanto custam 35 m?</p>
      <table>
        <tr><th>Metros</th><th>R$</th></tr>
        <tr><td>10</td><td>45</td></tr>
        <tr><td>35</td><td>x</td></tr>
      </table>
      <p>Direta: 10 · x = 35 · 45 → x = 1.575 / 10 = <strong>R$ 157,50</strong></p>

      <h2>Exemplo 2 — direta (queda de tensão)</h2>
      <p>Num circuito, 30 m de cabo causam 3 V de queda. Com o mesmo cabo e corrente, quanto em 50 m?<br>
      30 · x = 50 · 3 → x = <strong>5 V</strong></p>

      <h2>Exemplo 3 — inversa (mesma potência, tensão diferente)</h2>
      <p>Um aparelho puxa 10 A em 220 V. Quanto puxaria um modelo de mesma potência em 127 V?</p>
      <p>Mais tensão → menos corrente: <strong>inversa</strong>. Multiplica em linha: 220 · 10 = 127 · x → x = 2.200 / 127 ≈ <strong>17,3 A</strong></p>

      <h2>Exemplo 4 — inversa (equipe)</h2>
      <p>4 eletricistas fazem uma instalação em 6 dias. Em quantos dias 3 eletricistas fariam?<br>
      4 · 6 = 3 · x → x = <strong>8 dias</strong></p>

      <h2>Teste rápido</h2>
      <details><summary>1. 5 luminárias consomem 90 W. Quanto consomem 12?</summary><p>5x = 12 × 90 → x = <strong>216 W</strong>.</p></details>
      <details><summary>2. Um motor gira a 1.800 rpm com polia de 10 cm movendo outra de 15 cm. Rotação da polia maior?</summary><p>Inversa: 10 × 1.800 = 15 × x → x = <strong>1.200 rpm</strong>.</p></details>
    `
  },
  "3-3": {
    duracao: "8 min de leitura",
    texto: `
      <h2>O que é porcentagem</h2>
      <p>É uma razão com denominador 100: <strong>x% = x / 100</strong>. Assim, 4% = 0,04 e 125% = 1,25.</p>
      <div class="destaque"><strong>x% de um valor = valor × x / 100</strong></div>

      <h2>Aplicação 1 — queda de tensão</h2>
      <p>Num circuito de 220 V a queda medida foi 8,8 V. Quanto isso representa?<br>
      8,8 / 220 = 0,04 → <strong>4%</strong>.</p>
      <p>Qual a queda máxima de 4% em 127 V? 127 × 0,04 = <strong>5,08 V</strong>.</p>

      <h2>Aplicação 2 — tolerância de resistores</h2>
      <p>Resistor de 1 kΩ ±5%: 5% de 1.000 = 50 Ω → valor real entre <strong>950 Ω e 1.050 Ω</strong>.</p>

      <h2>Aplicação 3 — fator de segurança</h2>
      <p>Em circuitos que alimentam motores, é comum dimensionar condutores para <strong>125%</strong> da corrente nominal:
      motor de 16 A → 16 × 1,25 = <strong>20 A</strong>.</p>

      <h2>Aplicação 4 — aumentos e descontos</h2>
      <ul>
        <li>Aumento de 8% na tarifa sobre uma conta de R$ 200: 200 × 1,08 = <strong>R$ 216</strong>.</li>
        <li>Desconto de 15% num orçamento de R$ 1.200: 1.200 × 0,85 = <strong>R$ 1.020</strong>.</li>
      </ul>

      <h2>Aplicação 5 — rendimento</h2>
      <p>Um motor recebe 8,5 kW e entrega 7,5 kW: 7,5 / 8,5 = 0,882 → <strong>88,2%</strong>.</p>

      <h2>Teste rápido</h2>
      <details><summary>1. Quanto é 30% de 250?</summary><p><strong>75</strong>.</p></details>
      <details><summary>2. Um resistor de 220 Ω ±10%: faixa de valores?</summary><p><strong>198 Ω a 242 Ω</strong>.</p></details>
      <details><summary>3. Queda de 6 V em 380 V é quantos %?</summary><p>6 / 380 ≈ <strong>1,58%</strong>.</p></details>
    `
  },
  "4-1": {
    duracao: "10 min de leitura",
    texto: `
      <h2>Uma fórmula, várias perguntas</h2>
      <p>Com U = R · I você pode achar U, R ou I. Basta <strong>isolar</strong> a grandeza desejada, fazendo do outro lado a
      <strong>operação inversa</strong>:</p>
      <table>
        <tr><th>Está fazendo...</th><th>Passa para o outro lado...</th></tr>
        <tr><td>multiplicando</td><td>dividindo</td></tr>
        <tr><td>dividindo</td><td>multiplicando</td></tr>
        <tr><td>somando</td><td>subtraindo</td></tr>
        <tr><td>ao quadrado</td><td>como raiz quadrada</td></tr>
      </table>

      <h2>Exemplos</h2>
      <ul>
        <li>U = R · I → I está multiplicando R → <strong>I = U / R</strong></li>
        <li>P = U · I → <strong>U = P / I</strong></li>
        <li>P = R · I² → I² = P / R → <strong>I = √(P / R)</strong></li>
        <li>R = ρ · L / A → A está dividindo → R · A = ρ · L → <strong>A = ρ · L / R</strong></li>
      </ul>

      <h2>Problema completo: qual a bitola mínima?</h2>
      <p>Carga de 20 A em 220 V, a 50 m do quadro (100 m de ida e volta), cabo de cobre (ρ = 0,0172 Ω·mm²/m). Queda máxima: 4%.</p>
      <ol>
        <li>Queda máxima em volts: 220 × 0,04 = <strong>8,8 V</strong></li>
        <li>Resistência máxima do cabo: R = U / I = 8,8 / 20 = <strong>0,44 Ω</strong></li>
        <li>Seção mínima: A = ρ · L / R = 0,0172 × 100 / 0,44 = <strong>3,91 mm²</strong></li>
        <li>Seção comercial acima: <strong>4 mm²</strong> (depois confira também a capacidade de corrente do cabo)</li>
      </ol>
      <div class="destaque">Repare como juntamos <strong>porcentagem</strong>, <strong>Lei de Ohm</strong> e <strong>isolamento de variável</strong> num cálculo real.</div>

      <h2>Teste rápido</h2>
      <details><summary>1. Isole R em P = U² / R.</summary><p><strong>R = U² / P</strong>.</p></details>
      <details><summary>2. Isole t em E = P · t.</summary><p><strong>t = E / P</strong>.</p></details>
      <details><summary>3. Um aparelho de 1.500 W puxa 6,8 A. Qual a tensão aproximada?</summary><p>U = 1.500 / 6,8 ≈ <strong>220 V</strong>.</p></details>
    `
  },
  "4-2": {
    duracao: "9 min de leitura",
    texto: `
      <h2>Toda medição tem limite de precisão</h2>
      <p>Quando o multímetro mostra <strong>219,6 V</strong>, ele garante os dígitos até a primeira casa decimal. Escrever "219,63 V" seria
      inventar um dígito. Os dígitos confiáveis de uma medida são os <strong>algarismos significativos</strong>.</p>

      <h2>Como contar</h2>
      <ul>
        <li>Todos os dígitos de 1 a 9 contam: 219,6 → <strong>4</strong> significativos.</li>
        <li>Zeros entre dígitos contam: 1,05 → <strong>3</strong>.</li>
        <li>Zeros à esquerda <strong>não</strong> contam: 0,045 A → <strong>2</strong> (4 e 5).</li>
        <li>Zeros à direita depois da vírgula contam: 12,0 V → <strong>3</strong> (o instrumento mostrou aquele zero).</li>
      </ul>

      <h2>Contas com medidas</h2>
      <ul>
        <li><strong>Multiplicação e divisão:</strong> o resultado fica com o número de significativos da medida <strong>menos precisa</strong>.<br>
        12,6 V ÷ 3,3 Ω = 3,8181... → 3,3 tem 2 significativos → <strong>3,8 A</strong>.</li>
        <li><strong>Soma e subtração:</strong> o resultado fica com as casas decimais da parcela <strong>com menos casas</strong>.<br>
        12,52 A + 3,1 A = 15,62 → <strong>15,6 A</strong>.</li>
      </ul>

      <h2>Instrumentos digitais</h2>
      <ul>
        <li><strong>Resolução</strong> é o menor passo que o display mostra (ex.: 0,1 V).</li>
        <li><strong>Contagens</strong> (2.000, 6.000...) dizem até quanto o display vai antes de mudar de escala.</li>
        <li><strong>"OL"</strong> = overload: o valor passou da escala (ou circuito aberto, na medição de resistência).</li>
        <li>Todo manual informa a <strong>exatidão</strong>, ex.: ±(1% + 2 dígitos). Em 219,6 V isso é cerca de ±2,4 V.</li>
      </ul>

      <h2>Instrumentos analógicos (de ponteiro)</h2>
      <ul>
        <li>Olhe o ponteiro <strong>de frente</strong>, para evitar o erro de paralaxe (muitos têm espelho na escala para isso).</li>
        <li>Leia até a divisão mais próxima e, no máximo, estime metade de uma divisão.</li>
      </ul>

      <h2>Teste rápido</h2>
      <details><summary>1. Quantos significativos tem 0,0230 A?</summary><p><strong>3</strong> (2, 3 e o zero final).</p></details>
      <details><summary>2. 220 V ÷ 4,7 Ω (220 com 3 significativos). Resultado?</summary><p>46,808... → 4,7 tem 2 significativos → <strong>47 A</strong>.</p></details>
      <details><summary>3. O que significa "OL" no display?</summary><p>Valor <strong>acima da escala</strong> (ou circuito aberto em Ω).</p></details>
    `
  }
};
