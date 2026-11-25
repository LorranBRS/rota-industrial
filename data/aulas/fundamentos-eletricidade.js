/*
 * Conteúdo das aulas do curso "Fundamentos de Eletricidade".
 * Chave = "<módulo>-<aula>" (a mesma ordem de data/cursos.js).
 *
 * Campos (todos opcionais):
 *   youtube:   ID do vídeo no YouTube (ex.: "dQw4w9WgXcQ"), pode ser "não listado"
 *   duracao:   texto livre, ex.: "12 min"
 *   texto:     HTML da parte escrita da aula
 *   materiais: [{ nome: "Apostila (PDF)", url: "materiais/arquivo.pdf" }]
 *
 * Aula sem entrada aqui aparece como "em produção".
 */
window.ROTA_AULAS = window.ROTA_AULAS || {};
window.ROTA_AULAS["fundamentos-eletricidade"] = {
  "1-1": {
    duracao: "10 min de leitura",
    texto: `
      <h2>Tudo começa no átomo</h2>
      <p>Toda matéria é formada por <strong>átomos</strong>. No centro de cada átomo fica o <strong>núcleo</strong>, com
      <strong>prótons</strong> (carga positiva) e <strong>nêutrons</strong> (sem carga). Ao redor do núcleo giram os
      <strong>elétrons</strong>, que têm carga negativa.</p>

      <table>
        <tr><th>Partícula</th><th>Onde fica</th><th>Carga</th></tr>
        <tr><td>Próton</td><td>Núcleo</td><td>Positiva (+)</td></tr>
        <tr><td>Nêutron</td><td>Núcleo</td><td>Neutra (0)</td></tr>
        <tr><td>Elétron</td><td>Ao redor do núcleo (eletrosfera)</td><td>Negativa (−)</td></tr>
      </table>

      <h2>Elétrons livres: os protagonistas</h2>
      <p>Em alguns materiais, como o <strong>cobre</strong> e o <strong>alumínio</strong>, os elétrons da última camada
      estão fracamente presos ao núcleo. Eles conseguem pular de um átomo para outro: são os <strong>elétrons livres</strong>.</p>
      <p>Quando aplicamos uma <strong>tensão</strong> (uma "pressão elétrica") nas pontas de um fio, esses elétrons livres
      passam a se mover de forma organizada. Esse movimento ordenado é a <strong>corrente elétrica</strong>.</p>

      <div class="destaque">
        <strong>Comparação prática:</strong> pense num cano cheio de água. A água já está lá dentro — basta abrir o registro
        (aplicar pressão) para ela andar. No fio de cobre é igual: os elétrons livres já estão no fio, a tensão é que os faz andar.
      </div>

      <h2>Carga elétrica</h2>
      <p>Um corpo fica <strong>carregado</strong> quando ganha ou perde elétrons:</p>
      <ul>
        <li>Ganhou elétrons → carga <strong>negativa</strong>.</li>
        <li>Perdeu elétrons → carga <strong>positiva</strong>.</li>
        <li>Cargas <strong>iguais se repelem</strong>; cargas <strong>diferentes se atraem</strong>.</li>
      </ul>
      <p>A unidade de carga elétrica é o <strong>coulomb (C)</strong>. Um coulomb equivale a cerca de 6,25 × 10<sup>18</sup> elétrons.</p>

      <h2>Onde isso aparece no trabalho</h2>
      <ul>
        <li><strong>Escolha do cabo:</strong> cobre conduz melhor que alumínio porque tem mais facilidade de liberar elétrons.</li>
        <li><strong>Eletricidade estática:</strong> placas eletrônicas (inversores, CLPs) podem queimar só com a descarga do seu corpo — por isso existe a pulseira antiestática.</li>
      </ul>

      <div class="destaque alerta">
        <strong>Segurança:</strong> o corpo humano também conduz corrente. Nunca toque em partes energizadas — isso será
        aprofundado no curso de Segurança em Eletricidade.
      </div>

      <h2>Resumo</h2>
      <ol>
        <li>O átomo tem prótons (+), nêutrons (0) e elétrons (−).</li>
        <li>Metais como o cobre têm elétrons livres.</li>
        <li>Tensão faz os elétrons livres se moverem → isso é corrente elétrica.</li>
        <li>Carga elétrica se mede em coulomb (C).</li>
      </ol>

      <h2>Teste rápido</h2>
      <details><summary>1. Qual partícula se movimenta num fio quando há corrente?</summary><p>Os <strong>elétrons livres</strong>.</p></details>
      <details><summary>2. Um corpo que perdeu elétrons fica com que carga?</summary><p><strong>Positiva.</strong></p></details>
      <details><summary>3. Por que o cobre é usado em cabos elétricos?</summary><p>Porque tem muitos elétrons livres, ou seja, é um <strong>ótimo condutor</strong>.</p></details>
    `
  },
  "1-2": {
    duracao: "8 min de leitura",
    texto: `
      <h2>Como um corpo fica carregado</h2>
      <p>Na aula anterior vimos que um corpo fica carregado quando <strong>ganha ou perde elétrons</strong>. Esse processo se chama
      <strong>eletrização</strong>, e acontece de três formas.</p>

      <h2>1. Por atrito</h2>
      <p>Ao esfregar dois materiais diferentes, um deles "arranca" elétrons do outro. Os dois terminam com cargas
      <strong>de sinais opostos</strong> e de mesmo valor.</p>
      <p>Exemplo: passar um pente no cabelo seco e depois atrair pedacinhos de papel.</p>

      <h2>2. Por contato</h2>
      <p>Um corpo carregado encosta num corpo neutro (ambos condutores) e as cargas se dividem entre eles. Os dois terminam com cargas
      <strong>do mesmo sinal</strong>.</p>

      <h2>3. Por indução</h2>
      <p>Um corpo carregado (o <strong>indutor</strong>) é aproximado de um condutor neutro (o <strong>induzido</strong>) <em>sem encostar</em>.
      As cargas do induzido se reorganizam. Se nesse momento o induzido for ligado à terra e depois desligado, ele fica carregado com
      sinal <strong>oposto</strong> ao do indutor.</p>

      <table>
        <tr><th>Processo</th><th>Precisa encostar?</th><th>Sinal final</th></tr>
        <tr><td>Atrito</td><td>Sim (esfregar)</td><td>Opostos</td></tr>
        <tr><td>Contato</td><td>Sim</td><td>Iguais</td></tr>
        <tr><td>Indução</td><td>Não</td><td>Oposto ao do indutor</td></tr>
      </table>

      <h2>Onde isso importa no trabalho</h2>
      <ul>
        <li><strong>Eletrônica sensível:</strong> a carga acumulada no corpo por atrito (andar no carpete, roupa sintética) descarrega
        nos componentes e pode danificar placas de CLP, inversores e computadores. Use <strong>pulseira antiestática</strong> ligada ao terra.</li>
        <li><strong>Combustíveis:</strong> caminhões-tanque e tanques de inflamáveis são <strong>aterrados</strong> antes da descarga,
        para que uma faísca de eletricidade estática não provoque explosão.</li>
        <li><strong>Correias e esteiras</strong> em indústrias podem acumular carga por atrito — por isso existem escovas e aterramentos específicos.</li>
      </ul>

      <div class="destaque"><strong>Lembre:</strong> aterrar é dar um caminho seguro para as cargas escoarem.</div>

      <h2>Teste rápido</h2>
      <details><summary>1. Em qual processo os corpos terminam com cargas de sinais opostos?</summary><p>No <strong>atrito</strong> (e o induzido fica oposto ao indutor na indução).</p></details>
      <details><summary>2. Por que se usa pulseira antiestática ao mexer numa placa eletrônica?</summary><p>Para escoar para o terra a carga acumulada no corpo e evitar uma descarga sobre os componentes.</p></details>
    `
  },
  "1-3": {
    duracao: "9 min de leitura",
    texto: `
      <h2>A força entre cargas</h2>
      <p>Cargas iguais se repelem e cargas diferentes se atraem. A <strong>Lei de Coulomb</strong> diz quanto vale essa força:</p>
      <div class="destaque"><strong>F = k · |q₁ · q₂| / d²</strong><br>
      F = força (newton, N) · q₁ e q₂ = cargas (coulomb, C) · d = distância entre elas (metro, m) · k ≈ 9 × 10⁹ N·m²/C² (no vácuo/ar)</div>
      <p>Duas conclusões práticas:</p>
      <ul>
        <li>Quanto <strong>maiores as cargas</strong>, maior a força.</li>
        <li>A força cai com o <strong>quadrado da distância</strong>: dobrando a distância, a força fica 4 vezes menor.</li>
      </ul>

      <h2>Exemplo</h2>
      <p>Duas cargas de 2 µC (2 × 10⁻⁶ C) estão a 0,3 m uma da outra:</p>
      <p>F = 9×10⁹ × (2×10⁻⁶ × 2×10⁻⁶) / 0,3² = 9×10⁹ × 4×10⁻¹² / 0,09 = <strong>0,4 N</strong></p>

      <h2>Campo elétrico</h2>
      <p>Toda carga cria ao seu redor uma "região de influência": o <strong>campo elétrico (E)</strong>. Qualquer outra carga colocada
      ali sente uma força.</p>
      <div class="destaque"><strong>E = F / q</strong> — unidade: newton por coulomb (N/C), que é o mesmo que volt por metro (V/m).</div>
      <p>Por convenção, as <strong>linhas de campo</strong> saem das cargas positivas e chegam nas negativas.</p>

      <h2>Na prática</h2>
      <ul>
        <li>A <strong>isolação</strong> de cabos e equipamentos é especificada para suportar um campo elétrico máximo. Acima disso,
        o isolante "rompe" e surge um arco.</li>
        <li>Em linhas de alta tensão o campo é tão intenso que o ar ao redor dos cabos pode ionizar — é o chiado (efeito corona)
        que se ouve perto das torres.</li>
      </ul>

      <h2>Teste rápido</h2>
      <details><summary>1. Se a distância entre duas cargas triplicar, o que acontece com a força?</summary><p>Fica <strong>9 vezes menor</strong> (3²).</p></details>
      <details><summary>2. Qual a unidade de campo elétrico?</summary><p>N/C ou V/m.</p></details>
    `
  },
  "1-4": {
    duracao: "8 min de leitura",
    texto: `
      <h2>Potencial elétrico</h2>
      <p>O <strong>potencial elétrico</strong> é a "energia por unidade de carga" que um ponto do campo elétrico oferece.
      Pense numa caixa-d'água: quanto mais alta, mais energia a água tem para descer.</p>
      <p>A unidade é o <strong>volt (V)</strong>: 1 volt = 1 joule por coulomb (1 V = 1 J/C).</p>

      <h2>Diferença de potencial (DDP)</h2>
      <p>O que realmente faz as cargas se moverem não é o potencial de um ponto, e sim a <strong>diferença</strong> entre dois pontos:</p>
      <div class="destaque"><strong>U = V<sub>A</sub> − V<sub>B</sub></strong></div>
      <p>Essa diferença é o que chamamos no dia a dia de <strong>tensão</strong> ou <strong>voltagem</strong>.
      Sem DDP não há corrente — assim como sem desnível a água não corre no cano.</p>

      <h2>Por que o passarinho no fio não toma choque?</h2>
      <p>Os dois pés estão no <strong>mesmo potencial</strong> (mesmo fio). A DDP entre eles é praticamente zero, então não passa corrente
      pelo corpo. Se ele encostar ao mesmo tempo em dois fios diferentes (ou num fio e no poste aterrado), haverá DDP — e corrente.</p>

      <div class="destaque alerta"><strong>Segurança:</strong> é exatamente isso que acontece com uma pessoa descalça que toca numa fase:
      entre a mão (fase) e os pés (terra) existe uma DDP de 127 V ou 220 V.</div>

      <h2>Referência: o terra</h2>
      <p>Em instalações, adota-se o <strong>terra</strong> como potencial zero. Quando dizemos "a fase está a 127 V", queremos dizer
      127 V em relação ao terra/neutro.</p>

      <h2>Teste rápido</h2>
      <details><summary>1. Um ponto está a 220 V e outro a 0 V. Qual a DDP?</summary><p><strong>220 V</strong>.</p></details>
      <details><summary>2. Dois pontos estão ambos a 127 V. Passa corrente se ligarmos um fio entre eles?</summary><p><strong>Não</strong>: a DDP é zero.</p></details>
    `
  },
  "2-1": {
    duracao: "10 min de leitura",
    texto: `
      <h2>De onde vem a tensão?</h2>
      <p>Para existir corrente precisamos de uma DDP. Os equipamentos que criam essa DDP são as <strong>fontes geradoras</strong>.
      Elas transformam algum tipo de energia em energia elétrica.</p>

      <table>
        <tr><th>Ação</th><th>Como funciona</th><th>Exemplos</th></tr>
        <tr><td><strong>Química</strong></td><td>Reações químicas entre eletrodos e um eletrólito separam cargas</td><td>Pilhas, baterias de carro, nobreaks</td></tr>
        <tr><td><strong>Magnética</strong></td><td>Um condutor que se move num campo magnético (ou um campo que varia) gera tensão — indução eletromagnética</td><td>Geradores de usinas, alternador do carro, grupo gerador a diesel</td></tr>
        <tr><td><strong>Térmica</strong></td><td>A junção de dois metais diferentes, aquecida, gera uma pequena tensão (efeito Seebeck)</td><td>Termopares que medem temperatura em fornos e caldeiras</td></tr>
        <tr><td><strong>Pressão</strong></td><td>Certos cristais geram tensão quando comprimidos (efeito piezoelétrico)</td><td>Acendedor de fogão/isqueiro, sensores de vibração</td></tr>
        <tr><td><strong>Luminosa</strong></td><td>A luz libera elétrons em materiais semicondutores (efeito fotovoltaico)</td><td>Placas solares, fotocélulas de iluminação pública</td></tr>
        <tr><td><strong>Mecânica (atrito)</strong></td><td>O atrito separa cargas (eletricidade estática)</td><td>Geradores eletrostáticos de laboratório</td></tr>
      </table>

      <h2>A mais importante: magnética</h2>
      <p>Quase toda a energia que chega às casas e fábricas vem de <strong>geradores</strong> movidos por água (hidrelétricas), vapor
      (termelétricas) ou vento (eólicas). Em todos eles, o princípio é o mesmo: <strong>girar ímãs perto de bobinas</strong>.</p>

      <h2>No trabalho de campo</h2>
      <ul>
        <li><strong>Termopar</strong>: muito usado na indústria; a tensão gerada é de milivolts e varia com a temperatura.</li>
        <li><strong>Baterias</strong>: em painéis, nobreaks e sistemas de emergência.</li>
        <li><strong>Solar</strong>: um dos mercados que mais cresce para eletricistas no Brasil.</li>
      </ul>

      <h2>Teste rápido</h2>
      <details><summary>1. Qual o princípio de funcionamento dos geradores de uma hidrelétrica?</summary><p><strong>Indução eletromagnética</strong> (ação magnética).</p></details>
      <details><summary>2. Que sensor industrial gera tensão a partir do calor?</summary><p>O <strong>termopar</strong>.</p></details>
    `
  },
  "2-2": {
    duracao: "8 min de leitura",
    texto: `
      <h2>Corrente contínua (CC)</h2>
      <p>Na corrente contínua a tensão tem <strong>polaridade fixa</strong> (um polo é sempre + e o outro sempre −) e a corrente
      circula sempre no mesmo sentido.</p>
      <ul>
        <li>Fontes: pilhas, baterias, placas solares, fontes de alimentação de 12/24 V.</li>
        <li>Usos: eletrônica, comandos de CLP (24 Vcc), carregadores, veículos.</li>
        <li>Símbolo no multímetro: <strong>V⎓</strong> (ou VDC).</li>
      </ul>

      <h2>Corrente alternada (CA)</h2>
      <p>Na corrente alternada a polaridade <strong>inverte periodicamente</strong>. A forma da onda é uma senoide.</p>
      <ul>
        <li>No Brasil a frequência é de <strong>60 Hz</strong>: a polaridade inverte 120 vezes por segundo.</li>
        <li>É a energia das tomadas, dos motores e das indústrias.</li>
        <li>Símbolo no multímetro: <strong>V~</strong> (ou VAC).</li>
      </ul>

      <figure class="diagrama"><img src="assets/img/diagramas/cc-ca.svg" alt="Gráficos de tensão contínua (linha reta) e alternada (senoide)" loading="lazy"><figcaption>Na CC a tensão é constante; na CA ela oscila 60 vezes por segundo.</figcaption></figure>

      <h2>Por que a rede é em CA?</h2>
      <p>Porque a tensão alternada pode ser <strong>elevada e reduzida com transformadores</strong>. Isso permite transmitir energia
      em alta tensão (menos perdas) e baixar para valores seguros perto do consumidor.</p>

      <table>
        <tr><th>Nível</th><th>Tensões típicas no Brasil</th></tr>
        <tr><td>Residencial / comercial (baixa tensão)</td><td>127 V e 220 V</td></tr>
        <tr><td>Industrial (baixa tensão)</td><td>220 V, 380 V, 440 V</td></tr>
        <tr><td>Distribuição (média tensão)</td><td>13,8 kV; 34,5 kV</td></tr>
        <tr><td>Transmissão (alta tensão)</td><td>138 kV a 750 kV</td></tr>
      </table>

      <div class="destaque"><strong>Dica de campo:</strong> antes de medir, confira se o seletor do multímetro está em V~ ou V⎓.
      Medir CA na escala de CC dá leituras erradas.</div>

      <h2>Teste rápido</h2>
      <details><summary>1. Qual a frequência da rede elétrica no Brasil?</summary><p><strong>60 Hz</strong>.</p></details>
      <details><summary>2. Por que a energia é transmitida em CA?</summary><p>Porque dá para mudar o nível de tensão com <strong>transformadores</strong>.</p></details>
    `
  },
  "3-1": {
    duracao: "9 min de leitura",
    texto: `
      <h2>O que é corrente elétrica</h2>
      <p>Corrente elétrica é o <strong>movimento ordenado de cargas</strong> (nos metais, elétrons livres) através de um condutor,
      provocado por uma DDP.</p>
      <div class="destaque"><strong>I = Q / t</strong><br>I = corrente (ampère, A) · Q = carga que passou (C) · t = tempo (s)<br>
      1 ampère = 1 coulomb passando por segundo.</div>

      <h2>Sentido real x sentido convencional</h2>
      <p>Os elétrons andam do polo <strong>negativo para o positivo</strong> (sentido real). Por razões históricas, nos diagramas usamos o
      <strong>sentido convencional</strong>: do positivo para o negativo. Os cálculos dão o mesmo resultado.</p>

      <figure class="diagrama"><img src="assets/img/diagramas/circuito-simples.svg" alt="Circuito com fonte, resistor e seta da corrente" loading="lazy"><figcaption>Sentido convencional: a corrente sai do polo positivo da fonte.</figcaption></figure>

      <h2>Efeitos da corrente</h2>
      <table>
        <tr><th>Efeito</th><th>Exemplo</th></tr>
        <tr><td>Térmico (Joule)</td><td>Chuveiro, ferro de passar, fusível</td></tr>
        <tr><td>Luminoso</td><td>Lâmpadas</td></tr>
        <tr><td>Magnético</td><td>Motores, contatores, relés, transformadores</td></tr>
        <tr><td>Químico</td><td>Carga de baterias, galvanoplastia</td></tr>
        <tr><td>Fisiológico</td><td>Choque elétrico</td></tr>
      </table>

      <h2>Valores de referência</h2>
      <ul>
        <li>LED indicador: cerca de 0,02 A (20 mA)</li>
        <li>Lâmpada LED de 9 W em 127 V: cerca de 0,07 A</li>
        <li>Chuveiro de 5.500 W em 220 V: 25 A</li>
        <li>Motor de 10 cv em 380 V: cerca de 15 A</li>
      </ul>

      <div class="destaque alerta"><strong>Segurança:</strong> correntes de apenas algumas dezenas de <strong>miliampères</strong> passando
      pelo corpo já podem ser fatais. É por isso que o dispositivo DR desarma com 30 mA.</div>

      <h2>Como medir</h2>
      <p>Com o multímetro, a corrente é medida <strong>em série</strong> (o circuito precisa ser aberto). Na prática de campo, usa-se o
      <strong>alicate amperímetro</strong>, que mede sem abrir o circuito.</p>

      <h2>Teste rápido</h2>
      <details><summary>1. Passaram 30 C por um fio em 10 s. Qual a corrente?</summary><p>I = 30 / 10 = <strong>3 A</strong>.</p></details>
      <details><summary>2. Que efeito da corrente faz um motor girar?</summary><p>O efeito <strong>magnético</strong>.</p></details>
    `
  },
  "3-2": {
    duracao: "7 min de leitura",
    texto: `
      <h2>Tensão é "pressão elétrica"</h2>
      <p><strong>Tensão elétrica</strong> é o nome prático da diferença de potencial (DDP) entre dois pontos. Ela é a causa que
      empurra a corrente pelo circuito. Unidade: <strong>volt (V)</strong>. Símbolo nas fórmulas: <strong>U</strong> (ou V/E).</p>

      <h2>Múltiplos e submúltiplos</h2>
      <table>
        <tr><th>Nome</th><th>Símbolo</th><th>Valor</th><th>Onde aparece</th></tr>
        <tr><td>milivolt</td><td>mV</td><td>0,001 V</td><td>Termopares, sinais de sensores</td></tr>
        <tr><td>volt</td><td>V</td><td>1 V</td><td>Pilhas, comandos, tomadas</td></tr>
        <tr><td>quilovolt</td><td>kV</td><td>1.000 V</td><td>Redes de distribuição (13,8 kV)</td></tr>
      </table>

      <h2>Tensões que você vai encontrar</h2>
      <ul>
        <li>1,5 V — pilha comum</li>
        <li>12 V e 24 V (CC) — baterias, fontes, comandos de CLP</li>
        <li>127 V e 220 V (CA) — tomadas residenciais e comerciais</li>
        <li>380 V e 440 V (CA) — motores industriais</li>
      </ul>

      <h2>Como medir</h2>
      <p>A tensão é medida <strong>em paralelo</strong>: as ponteiras do multímetro tocam os dois pontos entre os quais se quer saber a DDP,
      sem abrir o circuito.</p>
      <ol>
        <li>Selecione V~ (CA) ou V⎓ (CC) numa escala acima do valor esperado.</li>
        <li>Ponteira preta no <strong>COM</strong>, vermelha no <strong>VΩ</strong>.</li>
        <li>Toque os dois pontos e leia.</li>
      </ol>

      <figure class="diagrama"><img src="assets/img/diagramas/medicao-tensao-corrente.svg" alt="Voltímetro ligado em paralelo e amperímetro ligado em série" loading="lazy"><figcaption>Voltímetro em paralelo com o componente; amperímetro em série, no caminho da corrente.</figcaption></figure>

      <div class="destaque alerta"><strong>Segurança:</strong> verifique antes se o instrumento e as ponteiras têm a categoria (CAT III/CAT IV)
      adequada ao local da medição. Veremos isso no módulo de instrumentos.</div>

      <h2>Teste rápido</h2>
      <details><summary>1. A tensão é medida em série ou em paralelo?</summary><p>Em <strong>paralelo</strong>.</p></details>
      <details><summary>2. Quantos volts há em 13,8 kV?</summary><p><strong>13.800 V</strong>.</p></details>
    `
  },
  "3-3": {
    duracao: "7 min de leitura",
    texto: `
      <h2>O que é resistência</h2>
      <p><strong>Resistência elétrica</strong> é a oposição que um material oferece à passagem da corrente. Os elétrons, ao andar,
      "esbarram" nos átomos do material, e parte da energia vira calor.</p>
      <p>Unidade: <strong>ohm (Ω)</strong>. Múltiplos: kΩ (1.000 Ω) e MΩ (1.000.000 Ω).</p>

      <h2>Do que depende</h2>
      <ul>
        <li><strong>Material</strong> — cobre resiste menos que alumínio, que resiste menos que ferro.</li>
        <li><strong>Comprimento</strong> — fio mais longo, mais resistência.</li>
        <li><strong>Seção (bitola)</strong> — fio mais grosso, menos resistência.</li>
        <li><strong>Temperatura</strong> — nos metais, quanto mais quente, mais resistência.</li>
      </ul>
      <p>Essas relações viram fórmula na <em>Segunda Lei de Ohm</em>.</p>

      <h2>Resistência boa e resistência ruim</h2>
      <p>Às vezes queremos resistência (resistência do chuveiro, resistores de eletrônica). Outras vezes ela é um problema:</p>
      <ul>
        <li><strong>Cabos finos demais</strong> aquecem e provocam queda de tensão.</li>
        <li><strong>Mau contato</strong> em bornes e emendas cria uma resistência extra que esquenta — causa clássica de incêndio.</li>
      </ul>

      <h2>Como medir</h2>
      <div class="destaque alerta"><strong>Sempre com o circuito desenergizado.</strong> O ohmímetro usa a própria bateria para medir;
      medir resistência em circuito ligado pode danificar o instrumento e dá leitura errada.</div>
      <p>Para isolação de motores e cabos (valores em MΩ) usa-se o <strong>megômetro</strong>, que aplica tensões de 500 V a 5 kV.</p>

      <h2>Teste rápido</h2>
      <details><summary>1. Um fio mais grosso tem mais ou menos resistência?</summary><p><strong>Menos</strong>.</p></details>
      <details><summary>2. Quantos ohms há em 4,7 kΩ?</summary><p><strong>4.700 Ω</strong>.</p></details>
    `
  },
  "3-4": {
    duracao: "8 min de leitura",
    texto: `
      <h2>Condutores</h2>
      <p>Materiais com muitos elétrons livres, que deixam a corrente passar com facilidade. A medida dessa facilidade é a
      <strong>resistividade (ρ)</strong>: quanto menor, melhor o condutor.</p>
      <table>
        <tr><th>Material</th><th>Resistividade a 20 °C (Ω·mm²/m)</th><th>Uso</th></tr>
        <tr><td>Prata</td><td>0,016</td><td>Contatos de relés e contatores</td></tr>
        <tr><td>Cobre</td><td>0,0172</td><td>Cabos e barramentos (o mais usado)</td></tr>
        <tr><td>Alumínio</td><td>0,028</td><td>Redes aéreas e cabos de grande seção</td></tr>
        <tr><td>Níquel-cromo</td><td>≈ 1,1</td><td>Resistências de aquecimento</td></tr>
      </table>
      <p>O alumínio conduz pior, mas é mais leve e barato — por isso domina nas redes das concessionárias.</p>

      <h2>Isolantes</h2>
      <p>Materiais com pouquíssimos elétrons livres: PVC, borracha, EPR/XLPE (cabos), porcelana, vidro, mica, óleo mineral (transformadores).</p>
      <p>Todo isolante tem um limite: a <strong>rigidez dielétrica</strong>, a tensão máxima que suporta por milímetro antes de "romper".
      Por isso cada cabo tem uma <strong>tensão de isolamento</strong> (ex.: 450/750 V, 0,6/1 kV).</p>

      <h2>Semicondutores</h2>
      <p>Ficam no meio do caminho (silício, germânio). São a base de diodos, transistores, LEDs e placas solares.</p>

      <div class="destaque alerta"><strong>Atenção:</strong> água com sais minerais, madeira úmida e o corpo humano <strong>conduzem</strong>.
      "Isolante" só vale enquanto o material estiver seco, limpo e íntegro.</div>

      <h2>Teste rápido</h2>
      <details><summary>1. Por que o cobre é o material mais usado em cabos?</summary><p>Tem resistividade muito baixa (só perde para a prata) e custo viável.</p></details>
      <details><summary>2. O que significa "0,6/1 kV" num cabo?</summary><p>É a <strong>tensão de isolamento</strong> do cabo.</p></details>
    `
  },
  "4-1": {
    duracao: "10 min de leitura",
    texto: `
      <h2>A lei mais usada da elétrica</h2>
      <p>Georg Ohm descobriu que, num resistor, a corrente é <strong>proporcional à tensão</strong> aplicada:</p>
      <div class="destaque"><strong>U = R · I</strong> &nbsp;→&nbsp; <strong>I = U / R</strong> &nbsp;→&nbsp; <strong>R = U / I</strong></div>
      <p>Truque do triângulo: escreva <strong>U</strong> em cima e <strong>R · I</strong> embaixo. Tape com o dedo a grandeza que você quer
      e o que sobra é a fórmula.</p>

      <figure class="diagrama"><img src="assets/img/diagramas/circuito-simples.svg" alt="Circuito com fonte U, resistência R e corrente I" loading="lazy"><figcaption>O circuito básico da Lei de Ohm: U = R · I.</figcaption></figure>

      <h2>Exemplos resolvidos</h2>
      <p><strong>1)</strong> Um resistor de 22 Ω está ligado em 12 V. Qual a corrente?<br>
      I = 12 / 22 = <strong>0,545 A</strong> (545 mA)</p>
      <p><strong>2)</strong> Uma resistência de aquecimento puxa 10 A em 220 V. Qual sua resistência?<br>
      R = 220 / 10 = <strong>22 Ω</strong></p>
      <p><strong>3)</strong> Por um resistor de 1 kΩ passam 5 mA. Qual a tensão sobre ele?<br>
      U = 1.000 × 0,005 = <strong>5 V</strong></p>

      <div class="destaque"><strong>Cuidado com as unidades:</strong> sempre converta para V, A e Ω antes de calcular
      (kΩ → ×1.000; mA → ÷1.000).</div>

      <h2>O que a lei explica no campo</h2>
      <ul>
        <li><strong>Curto-circuito:</strong> R quase zero → I enorme → o disjuntor precisa desarmar.</li>
        <li><strong>Mesma carga em tensão menor:</strong> para a mesma potência, 127 V exige mais corrente que 220 V.</li>
        <li><strong>Choque:</strong> pele molhada tem resistência menor → passa mais corrente pelo corpo.</li>
      </ul>

      <h2>Teste rápido</h2>
      <details><summary>1. Um resistor de 100 Ω em 24 V. Qual a corrente?</summary><p>I = 24 / 100 = <strong>0,24 A</strong>.</p></details>
      <details><summary>2. Um aparelho puxa 2 A em 127 V. Qual a resistência?</summary><p>R = 127 / 2 = <strong>63,5 Ω</strong>.</p></details>
      <details><summary>3. Que tensão aparece em 470 Ω com 20 mA?</summary><p>U = 470 × 0,02 = <strong>9,4 V</strong>.</p></details>
    `
  },
  "4-2": {
    duracao: "10 min de leitura",
    texto: `
      <h2>Calculando a resistência de um fio</h2>
      <p>A Segunda Lei de Ohm transforma em fórmula o que vimos na aula de resistência:</p>
      <div class="destaque"><strong>R = ρ · L / A</strong><br>
      ρ = resistividade do material (Ω·mm²/m) · L = comprimento (m) · A = seção do condutor (mm²)</div>
      <ul>
        <li>Dobrar o comprimento → dobra a resistência.</li>
        <li>Dobrar a seção → resistência cai pela metade.</li>
      </ul>

      <h2>Exemplo de campo: queda de tensão</h2>
      <p>Um circuito alimenta uma carga a <strong>50 m</strong> do quadro com cabo de cobre de <strong>2,5 mm²</strong>.
      A corrente vai e volta, então o comprimento total é <strong>100 m</strong>.</p>
      <p>R = 0,0172 × 100 / 2,5 = <strong>0,688 Ω</strong></p>
      <p>Com 20 A circulando, a queda de tensão no cabo é U = R · I = 0,688 × 20 = <strong>13,8 V</strong>.
      Em 220 V isso é <strong>6,3%</strong> — acima do limite usual de 4% para circuitos terminais.</p>
      <p>Trocando por cabo de <strong>4 mm²</strong>: R = 0,0172 × 100 / 4 = 0,43 Ω → queda de 8,6 V (3,9%). Resolvido.</p>

      <figure class="diagrama"><img src="assets/img/diagramas/queda-tensao.svg" alt="Circuito com resistência do cabo na ida e na volta e a carga" loading="lazy"><figcaption>A resistência do cabo de ida e de volta "rouba" 13,8 V antes de a energia chegar à carga.</figcaption></figure>

      <div class="destaque"><strong>Lição prática:</strong> o cabo não é escolhido só pela corrente que suporta; em distâncias longas,
      a <strong>queda de tensão</strong> é que manda. Motores com tensão baixa esquentam e perdem torque.</div>

      <h2>Temperatura</h2>
      <p>A resistividade dos metais aumenta com a temperatura. Um cabo sobrecarregado esquenta, sua resistência sobe, ele esquenta
      ainda mais... Por isso as tabelas de cabos consideram a temperatura de trabalho (70 °C no PVC, 90 °C no EPR/XLPE).</p>

      <h2>Teste rápido</h2>
      <details><summary>1. Resistência de 200 m de cobre de 1,5 mm²?</summary><p>R = 0,0172 × 200 / 1,5 = <strong>2,29 Ω</strong>.</p></details>
      <details><summary>2. O que acontece com R se trocarmos cabo de 2,5 por 10 mm² (mesmo comprimento)?</summary><p>Fica <strong>4 vezes menor</strong>.</p></details>
    `
  },
  "5-1": {
    duracao: "9 min de leitura",
    texto: `
      <h2>O que é um resistor</h2>
      <p>Componente feito para ter um valor de resistência definido. Serve para limitar corrente, dividir tensão e gerar calor.</p>

      <h2>Tipos</h2>
      <ul>
        <li><strong>Fixos</strong> — de carbono, filme metálico, fio (potências maiores).</li>
        <li><strong>Variáveis</strong> — potenciômetros e trimpots (ajuste de velocidade, volume, referência de inversor).</li>
        <li><strong>Dependentes</strong> — <strong>NTC/PTC</strong> (variam com a temperatura, usados em proteção de motores) e
        <strong>LDR</strong> (varia com a luz, usado em fotocélulas).</li>
      </ul>

      <h2>Código de cores (4 faixas)</h2>
      <table>
        <tr><th>Cor</th><th>Dígito</th><th>Multiplicador</th></tr>
        <tr><td>Preto</td><td>0</td><td>× 1</td></tr>
        <tr><td>Marrom</td><td>1</td><td>× 10</td></tr>
        <tr><td>Vermelho</td><td>2</td><td>× 100</td></tr>
        <tr><td>Laranja</td><td>3</td><td>× 1.000</td></tr>
        <tr><td>Amarelo</td><td>4</td><td>× 10.000</td></tr>
        <tr><td>Verde</td><td>5</td><td>× 100.000</td></tr>
        <tr><td>Azul</td><td>6</td><td>× 1.000.000</td></tr>
        <tr><td>Violeta</td><td>7</td><td>—</td></tr>
        <tr><td>Cinza</td><td>8</td><td>—</td></tr>
        <tr><td>Branco</td><td>9</td><td>—</td></tr>
      </table>
      <p>1ª e 2ª faixas = dígitos; 3ª = multiplicador; 4ª = tolerância (<strong>ouro ±5%</strong>, <strong>prata ±10%</strong>).</p>
      <p><strong>Exemplo:</strong> amarelo, violeta, vermelho, ouro → 4 7 × 100 = <strong>4.700 Ω (4,7 kΩ) ±5%</strong>.</p>

      <figure class="diagrama"><img src="assets/img/diagramas/resistor-cores.svg" alt="Resistor com faixas amarela, violeta, vermelha e ouro" loading="lazy"><figcaption>Lendo o código de cores: 4,7 kΩ ±5%.</figcaption></figure>

      <h2>Potência do resistor</h2>
      <p>Além do valor em ohms, todo resistor tem uma <strong>potência máxima</strong> (1/4 W, 1/2 W, 5 W...). Se dissipar mais que isso, queima.
      Calcularemos isso no módulo de potência.</p>

      <h2>Teste rápido</h2>
      <details><summary>1. Marrom, preto, laranja, ouro?</summary><p>1 0 × 1.000 = <strong>10 kΩ ±5%</strong>.</p></details>
      <details><summary>2. Que tipo de resistor protege motores contra superaquecimento?</summary><p>O <strong>termistor (PTC/NTC)</strong>.</p></details>
    `
  },
  "5-2": {
    duracao: "9 min de leitura",
    texto: `
      <h2>Ligação em série</h2>
      <p>Os componentes são ligados <strong>um depois do outro</strong>, formando um único caminho para a corrente.</p>
      <div class="destaque"><strong>R<sub>eq</sub> = R₁ + R₂ + R₃ + ...</strong></div>

      <h2>Regras</h2>
      <ul>
        <li>A <strong>corrente é a mesma</strong> em todos os componentes.</li>
        <li>A <strong>tensão da fonte se divide</strong> entre eles: U = U₁ + U₂ + U₃.</li>
        <li>O maior resistor fica com a maior parte da tensão.</li>
        <li>Se um componente abrir (queimar), <strong>todo o circuito para</strong>.</li>
      </ul>

      <figure class="diagrama"><img src="assets/img/diagramas/serie.svg" alt="Três resistores em série com fonte de 12 V" loading="lazy"><figcaption>Em série: mesma corrente, tensão dividida.</figcaption></figure>

      <h2>Exemplo resolvido</h2>
      <p>Resistores de 10 Ω, 20 Ω e 30 Ω em série numa fonte de 12 V:</p>
      <ol>
        <li>R<sub>eq</sub> = 10 + 20 + 30 = <strong>60 Ω</strong></li>
        <li>I = 12 / 60 = <strong>0,2 A</strong></li>
        <li>U₁ = 10 × 0,2 = 2 V · U₂ = 20 × 0,2 = 4 V · U₃ = 30 × 0,2 = 6 V</li>
        <li>Conferência: 2 + 4 + 6 = <strong>12 V</strong> ✓</li>
      </ol>

      <h2>Onde aparece</h2>
      <ul>
        <li>Botões de emergência e contatos de segurança ligados em série: qualquer um que abrir desliga a máquina.</li>
        <li>Divisor de tensão em eletrônica.</li>
        <li>Pisca-pisca antigo de Natal: uma lâmpada queimada apagava todas.</li>
      </ul>

      <h2>Teste rápido</h2>
      <details><summary>1. 100 Ω e 50 Ω em série em 30 V: qual a corrente?</summary><p>R<sub>eq</sub> = 150 Ω → I = 30 / 150 = <strong>0,2 A</strong>.</p></details>
      <details><summary>2. No exemplo anterior, qual a tensão no de 100 Ω?</summary><p>100 × 0,2 = <strong>20 V</strong>.</p></details>
    `
  },
  "5-3": {
    duracao: "9 min de leitura",
    texto: `
      <h2>Ligação em paralelo</h2>
      <p>Todos os componentes ficam ligados <strong>nos mesmos dois pontos</strong>. A corrente tem vários caminhos.</p>
      <div class="destaque"><strong>1 / R<sub>eq</sub> = 1/R₁ + 1/R₂ + 1/R₃ + ...</strong><br>
      Atalhos: dois resistores → R<sub>eq</sub> = (R₁ × R₂) / (R₁ + R₂) · n resistores iguais → R<sub>eq</sub> = R / n</div>

      <h2>Regras</h2>
      <ul>
        <li>A <strong>tensão é a mesma</strong> em todos.</li>
        <li>A <strong>corrente total se divide</strong>: I = I₁ + I₂ + I₃.</li>
        <li>O menor resistor recebe a maior corrente.</li>
        <li>R<sub>eq</sub> é sempre <strong>menor que o menor resistor</strong>.</li>
        <li>Se um componente abrir, os outros continuam funcionando.</li>
      </ul>

      <figure class="diagrama"><img src="assets/img/diagramas/paralelo.svg" alt="Dois resistores em paralelo com fonte de 12 V" loading="lazy"><figcaption>Em paralelo: mesma tensão, corrente dividida.</figcaption></figure>

      <h2>Exemplo resolvido</h2>
      <p>6 Ω e 3 Ω em paralelo numa fonte de 12 V:</p>
      <ol>
        <li>R<sub>eq</sub> = (6 × 3) / (6 + 3) = 18 / 9 = <strong>2 Ω</strong></li>
        <li>I total = 12 / 2 = <strong>6 A</strong></li>
        <li>I₁ = 12 / 6 = 2 A · I₂ = 12 / 3 = 4 A → 2 + 4 = 6 A ✓</li>
      </ol>

      <h2>Onde aparece</h2>
      <p><strong>Toda instalação residencial e comercial</strong>: tomadas e lâmpadas ficam em paralelo, para receberem a mesma tensão e
      funcionarem de forma independente. Cada aparelho ligado <strong>soma corrente</strong> no circuito — é por isso que o disjuntor desarma
      quando ligamos muitos aparelhos juntos.</p>

      <h2>Teste rápido</h2>
      <details><summary>1. Quatro lâmpadas de 240 Ω em paralelo: R<sub>eq</sub>?</summary><p>240 / 4 = <strong>60 Ω</strong>.</p></details>
      <details><summary>2. 10 Ω e 40 Ω em paralelo?</summary><p>(10 × 40) / 50 = <strong>8 Ω</strong>.</p></details>
    `
  },
  "5-4": {
    duracao: "10 min de leitura",
    texto: `
      <h2>Circuito misto</h2>
      <p>Tem partes em série e partes em paralelo. A técnica é <strong>simplificar por etapas</strong>, de dentro para fora, até chegar
      a um único resistor equivalente — e depois "voltar" calculando tensões e correntes.</p>

      <h2>Exemplo resolvido</h2>
      <p>R1 = 4 Ω em série com um paralelo de R2 = 6 Ω e R3 = 12 Ω. Fonte de 24 V.</p>
      <ol>
        <li><strong>Paralelo:</strong> R<sub>23</sub> = (6 × 12) / (6 + 12) = 72 / 18 = 4 Ω</li>
        <li><strong>Série:</strong> R<sub>eq</sub> = 4 + 4 = 8 Ω</li>
        <li><strong>Corrente total:</strong> I = 24 / 8 = 3 A (passa toda por R1)</li>
        <li><strong>Tensão em R1:</strong> 4 × 3 = 12 V</li>
        <li><strong>Tensão no paralelo:</strong> 24 − 12 = 12 V (ou 4 Ω × 3 A)</li>
        <li><strong>Correntes:</strong> I₂ = 12 / 6 = 2 A · I₃ = 12 / 12 = 1 A → 2 + 1 = 3 A ✓</li>
      </ol>

      <figure class="diagrama"><img src="assets/img/diagramas/misto.svg" alt="R1 em série com o paralelo de R2 e R3, fonte de 24 V" loading="lazy"><figcaption>O bloco tracejado (paralelo) vale 4 Ω; somado a R1 dá 8 Ω.</figcaption></figure>

      <div class="destaque"><strong>Método:</strong> 1) identifique blocos série/paralelo; 2) reduza um por vez, redesenhando o circuito;
      3) ache a corrente total; 4) volte calculando cada parte; 5) confira se as somas batem.</div>

      <h2>Na vida real</h2>
      <p>Um circuito de tomadas é misto: os aparelhos estão em paralelo entre si, mas todos estão <strong>em série com o cabo</strong>
      que vem do quadro. A resistência desse cabo (Segunda Lei de Ohm) causa a queda de tensão que vimos antes.</p>

      <h2>Teste rápido</h2>
      <details><summary>1. 2 Ω em série com (10 Ω // 10 Ω), em 14 V. Corrente total?</summary><p>Paralelo = 5 Ω; R<sub>eq</sub> = 7 Ω; I = 14 / 7 = <strong>2 A</strong>.</p></details>
      <details><summary>2. No exercício anterior, quanto passa em cada resistor de 10 Ω?</summary><p>Tensão no paralelo = 5 × 2 = 10 V → <strong>1 A</strong> em cada.</p></details>
    `
  },
  "6-1": {
    duracao: "9 min de leitura",
    texto: `
      <h2>O que é potência</h2>
      <p><strong>Potência</strong> é a rapidez com que a energia é transformada (em calor, luz, movimento). Unidade: <strong>watt (W)</strong>.</p>
      <div class="destaque">
        <strong>P = U · I</strong><br>
        Combinando com a Lei de Ohm: <strong>P = R · I²</strong> &nbsp; e &nbsp; <strong>P = U² / R</strong>
      </div>
      <p>Outras unidades: kW (1.000 W); cv ≈ 736 W; HP ≈ 746 W (comuns em placas de motores).</p>

      <h2>Exemplos resolvidos</h2>
      <p><strong>1) Chuveiro</strong> de 5.500 W em 220 V: I = P / U = 5.500 / 220 = <strong>25 A</strong>.<br>
      O mesmo chuveiro em 127 V puxaria 5.500 / 127 = <strong>43,3 A</strong> — exigiria cabo e disjuntor muito maiores.
      Por isso chuveiros potentes são 220 V.</p>
      <p><strong>2) Resistor</strong> de 100 Ω com 0,1 A: P = 100 × 0,1² = <strong>1 W</strong>. Um resistor de 1/4 W queimaria; use 2 W.</p>
      <p><strong>3) Resistência</strong> de 48,4 Ω ligada em 220 V: P = 220² / 48,4 = <strong>1.000 W</strong>.</p>

      <h2>Na placa dos equipamentos</h2>
      <p>A potência nominal indica quanto o aparelho consome (ou, no caso de motores, quanto entrega no eixo). Com ela você dimensiona
      o circuito: P → corrente → cabo → disjuntor.</p>

      <h2>Teste rápido</h2>
      <details><summary>1. Um forno de 2.200 W em 220 V puxa quantos ampères?</summary><p><strong>10 A</strong>.</p></details>
      <details><summary>2. Um motor de 5 cv tem quantos watts?</summary><p>5 × 736 = <strong>3.680 W</strong>.</p></details>
    `
  },
  "6-2": {
    duracao: "8 min de leitura",
    texto: `
      <h2>Potência x energia</h2>
      <p>Potência é "quão rápido" se consome; <strong>energia</strong> é "quanto" se consumiu ao longo do tempo.</p>
      <div class="destaque"><strong>E = P · t</strong><br>
      Na conta de luz: potência em <strong>kW</strong> × tempo em <strong>horas</strong> = energia em <strong>kWh</strong>.</div>

      <h2>Exemplo: quanto custa o banho?</h2>
      <p>Chuveiro de 5.500 W (5,5 kW), 30 minutos por dia (0,5 h), durante 30 dias:</p>
      <ol>
        <li>Por dia: 5,5 × 0,5 = 2,75 kWh</li>
        <li>Por mês: 2,75 × 30 = <strong>82,5 kWh</strong></li>
        <li>Com tarifa de exemplo de R$ 0,90/kWh: 82,5 × 0,90 ≈ <strong>R$ 74,25</strong></li>
      </ol>

      <h2>Exemplo comercial</h2>
      <p>Uma loja troca 40 lâmpadas fluorescentes de 40 W por LED de 18 W, ligadas 12 h por dia, 26 dias por mês:</p>
      <p>Economia = 40 × (40 − 18) W = 880 W = 0,88 kW → 0,88 × 12 × 26 = <strong>274,6 kWh por mês</strong>.</p>
      <p>Esse tipo de conta é argumento de venda para o eletricista que faz retrofit de iluminação.</p>

      <h2>Teste rápido</h2>
      <details><summary>1. Um ar-condicionado de 1.400 W ligado 8 h por dia, 30 dias. Consumo?</summary><p>1,4 × 8 × 30 = <strong>336 kWh</strong>.</p></details>
      <details><summary>2. Qual a diferença entre kW e kWh?</summary><p>kW é <strong>potência</strong>; kWh é <strong>energia</strong> (potência × tempo).</p></details>
    `
  },
  "6-3": {
    duracao: "8 min de leitura",
    texto: `
      <h2>Corrente que vira calor</h2>
      <p>Quando a corrente atravessa uma resistência, parte da energia vira calor. É o <strong>efeito Joule</strong>.</p>
      <div class="destaque"><strong>Calor gerado = R · I² · t</strong><br>
      Repare no <strong>I²</strong>: dobrar a corrente <strong>quadruplica</strong> o aquecimento.</div>

      <h2>Quando é útil</h2>
      <ul>
        <li>Chuveiros, aquecedores, fornos industriais, ferro de solda.</li>
        <li><strong>Fusíveis</strong>: o elo fino derrete quando a corrente passa do limite.</li>
        <li><strong>Relé térmico</strong> e parte térmica do disjuntor: uma lâmina bimetálica aquece e desarma em sobrecarga.</li>
      </ul>

      <h2>Quando é um problema</h2>
      <ul>
        <li><strong>Cabos subdimensionados</strong> esquentam, a isolação resseca e pode haver curto ou incêndio.</li>
        <li><strong>Mau contato:</strong> um borne frouxo com apenas 0,1 Ω de resistência e 30 A de corrente dissipa
        P = 0,1 × 30² = <strong>90 W</strong> concentrados num ponto minúsculo — calor de um ferro de solda dentro do quadro.</li>
        <li><strong>Benjamins e extensões</strong> com muitos aparelhos: corrente alta em fio fino.</li>
      </ul>

      <div class="destaque alerta"><strong>Manutenção:</strong> reapertar bornes periodicamente e fazer <strong>termografia</strong> em quadros
      são práticas que evitam incêndios causados pelo efeito Joule.</div>

      <h2>Teste rápido</h2>
      <details><summary>1. Se a corrente num cabo triplicar, o aquecimento aumenta quantas vezes?</summary><p><strong>9 vezes</strong> (3²).</p></details>
      <details><summary>2. Que dispositivo de proteção usa o efeito Joule para desligar?</summary><p>O <strong>fusível</strong> (e o relé térmico/disparo térmico do disjuntor).</p></details>
    `
  },
  "6-4": {
    duracao: "7 min de leitura",
    texto: `
      <h2>Nenhuma máquina é perfeita</h2>
      <p>Todo equipamento recebe uma potência (<strong>total</strong> ou absorvida) e entrega uma parte dela como trabalho útil. O resto são
      <strong>perdas</strong> — quase sempre calor.</p>
      <div class="destaque"><strong>η = P<sub>útil</sub> / P<sub>total</sub></strong> (multiplique por 100 para ter em %)<br>
      P<sub>perdas</sub> = P<sub>total</sub> − P<sub>útil</sub></div>

      <h2>Exemplo: motor</h2>
      <p>Um motor absorve 8,5 kW da rede e entrega 7,5 kW no eixo.</p>
      <ul>
        <li>η = 7,5 / 8,5 = 0,88 → <strong>88%</strong></li>
        <li>Perdas = 8,5 − 7,5 = <strong>1 kW</strong> virando calor (por isso o motor tem ventilador e aletas).</li>
      </ul>

      <h2>Valores típicos</h2>
      <table>
        <tr><th>Equipamento</th><th>Rendimento aproximado</th></tr>
        <tr><td>Transformador de distribuição</td><td>97% a 99%</td></tr>
        <tr><td>Motor de indução de alto rendimento (IR3)</td><td>85% a 96%</td></tr>
        <tr><td>Fonte chaveada</td><td>80% a 92%</td></tr>
        <tr><td>Lâmpada incandescente (como fonte de luz)</td><td>menos de 5%</td></tr>
      </table>

      <h2>Por que importa</h2>
      <p>Na indústria, motores consomem a maior parte da energia. Trocar um motor antigo por um de alto rendimento, ou usar inversor de
      frequência, pode pagar o investimento em poucos meses.</p>

      <h2>Teste rápido</h2>
      <details><summary>1. Uma fonte recebe 120 W e entrega 96 W. Rendimento?</summary><p>96 / 120 = <strong>80%</strong>.</p></details>
      <details><summary>2. No caso anterior, quanto vira calor?</summary><p><strong>24 W</strong>.</p></details>
    `
  },
  "7-1": {
    duracao: "10 min de leitura",
    texto: `
      <h2>O instrumento básico do eletricista</h2>
      <p>O <strong>multímetro</strong> reúne voltímetro, amperímetro e ohmímetro. Modelos comuns também testam continuidade, diodos,
      capacitância e frequência.</p>

      <h2>Bornes (entradas)</h2>
      <table>
        <tr><th>Borne</th><th>Uso</th></tr>
        <tr><td>COM</td><td>Ponteira <strong>preta</strong>, sempre</td></tr>
        <tr><td>VΩ</td><td>Ponteira vermelha para tensão, resistência e continuidade</td></tr>
        <tr><td>mA / A (10 A)</td><td>Ponteira vermelha <strong>só</strong> para medir corrente em série</td></tr>
      </table>

      <div class="destaque alerta"><strong>Erro clássico e perigoso:</strong> deixar a ponteira no borne <strong>A</strong> e medir tensão numa tomada.
      O borne de corrente tem resistência quase zero: é um <strong>curto-circuito</strong> na sua mão. Antes de cada medição, confira borne e seletor.</div>

      <h2>Como medir cada grandeza</h2>
      <ul>
        <li><strong>Tensão:</strong> em paralelo, circuito ligado, seletor em V~ ou V⎓.</li>
        <li><strong>Resistência/continuidade:</strong> circuito <strong>desligado</strong>; o bip indica caminho fechado.</li>
        <li><strong>Corrente:</strong> em série, abrindo o circuito — na prática, prefira o alicate amperímetro.</li>
      </ul>

      <figure class="diagrama"><img src="assets/img/diagramas/medicao-tensao-corrente.svg" alt="Como ligar o multímetro para medir tensão e corrente" loading="lazy"><figcaption>Tensão em paralelo, corrente em série.</figcaption></figure>

      <h2>Categorias de segurança (CAT)</h2>
      <p>Indicam onde o instrumento pode ser usado com segurança contra surtos:</p>
      <ul>
        <li><strong>CAT II</strong> — tomadas e aparelhos.</li>
        <li><strong>CAT III</strong> — quadros de distribuição, instalação fixa, motores.</li>
        <li><strong>CAT IV</strong> — entrada de energia, padrão, medidor.</li>
      </ul>
      <p>Use instrumento e ponteiras com categoria <strong>igual ou superior</strong> ao ponto de medição.</p>

      <h2>Teste do "testar o testador"</h2>
      <p>Antes de confirmar ausência de tensão, meça uma fonte conhecida (uma tomada viva), depois o ponto de trabalho, e de novo a fonte
      conhecida. Assim você garante que o instrumento não falhou no meio.</p>

      <h2>Algarismos significativos</h2>
      <p>Anote a leitura como o display mostra e respeite a resolução: "219,6 V" num multímetro de 1 casa decimal não deve virar "219,63 V".</p>

      <h2>Teste rápido</h2>
      <details><summary>1. Em que borne fica a ponteira preta?</summary><p>No <strong>COM</strong>.</p></details>
      <details><summary>2. Que categoria mínima usar num quadro de distribuição?</summary><p><strong>CAT III</strong>.</p></details>
    `
  },
  "7-2": {
    duracao: "8 min de leitura",
    texto: `
      <h2>Medindo corrente sem desligar nada</h2>
      <p>O <strong>alicate amperímetro</strong> mede a corrente pelo campo magnético que ela cria em volta do condutor. Basta abraçar o fio
      com a garra — sem abrir o circuito e sem contato elétrico.</p>

      <h2>Regra de ouro: um condutor só</h2>
      <p>Abrace <strong>apenas um condutor</strong>. Se você abraçar fase e neutro juntos, as correntes têm sentidos opostos, os campos se
      cancelam e o alicate mostra <strong>zero</strong> (ou quase).</p>
      <figure class="diagrama"><img src="assets/img/diagramas/alicate.svg" alt="Alicate abraçando só a fase (5,2 A) e fase com neutro (0,0 A)" loading="lazy"><figcaption>Abrace um condutor só. Com fase e neutro juntos, os campos se anulam.</figcaption></figure>

      <div class="destaque"><strong>Truque útil:</strong> esse "zero" pode ser usado a seu favor. Abrace fase e neutro de um circuito:
      se aparecer alguns miliampères, existe <strong>corrente de fuga</strong> para o terra — provável causa de DR desarmando.</div>

      <h2>Usos no dia a dia</h2>
      <ul>
        <li>Comparar a corrente de um motor com a <strong>corrente nominal da placa</strong> (sobrecarga?).</li>
        <li>Verificar <strong>desequilíbrio entre fases</strong> num quadro trifásico.</li>
        <li>Conferir se o disjuntor está adequado à carga real do circuito.</li>
      </ul>

      <h2>True RMS</h2>
      <p>Cargas eletrônicas (inversores, LEDs, fontes) deformam a forma de onda. Alicates comuns erram nessas medições;
      prefira modelos <strong>True RMS</strong>.</p>

      <h2>Outras funções</h2>
      <p>A maioria dos alicates também mede tensão e resistência pelas ponteiras, como um multímetro. As mesmas regras de segurança
      (bornes, seletor, categoria CAT) valem aqui.</p>

      <h2>Teste rápido</h2>
      <details><summary>1. Por que o alicate mostra zero ao abraçar fase e neutro?</summary><p>As correntes têm sentidos opostos e os campos magnéticos se <strong>cancelam</strong>.</p></details>
      <details><summary>2. Um motor de placa 15 A está puxando 19 A. O que isso indica?</summary><p><strong>Sobrecarga</strong> — investigar carga mecânica, tensão e rolamentos.</p></details>
    `
  }
};
