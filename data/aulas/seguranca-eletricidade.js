/*
 * Conteúdo das aulas do curso "Segurança em Eletricidade".
 * Chave = "<módulo>-<aula>" (mesma ordem de data/cursos.js).
 *
 * Curso introdutório: NÃO substitui o treinamento obrigatório da NR-10 (básico 40 h, SEP 40 h, reciclagem bienal)
 * nem cursos práticos de primeiros socorros. Valores de efeitos da corrente são aproximados.
 */
window.ROTA_AULAS = window.ROTA_AULAS || {};
(function () {
  const fig = (nome, alt, legenda) =>
    '<figure class="diagrama"><img src="assets/img/diagramas/' + nome + '.svg" alt="' + alt + '" loading="lazy"><figcaption>' + legenda + "</figcaption></figure>";
  const nr10 = '<div class="destaque"><strong>Importante:</strong> este é um curso <strong>introdutório</strong>. Ele não substitui o treinamento obrigatório da ' +
    '<strong>NR-10</strong> (curso básico de 40 h, com reciclagem a cada dois anos), nem a autorização formal da empresa para trabalhar com eletricidade.</div>';
  const socorro = '<div class="destaque alerta"><strong>Primeiros socorros se aprendem na prática.</strong> Faça um curso presencial com manequim e instrutor. ' +
    'Em emergência ligue <strong>192 (SAMU)</strong> ou <strong>193 (Bombeiros)</strong>.</div>';

  window.ROTA_AULAS["seguranca-eletricidade"] = {
    "1-1": {
      duracao: "12 min de leitura",
      texto: `
        <h2>O que é o choque elétrico</h2>
        <p>Choque é a passagem de corrente elétrica pelo corpo. Ele acontece quando o corpo fica entre dois pontos com <strong>diferença de potencial</strong>:
        fase e terra, fase e neutro, ou duas fases. Quem mata não é a tensão sozinha, é a <strong>corrente</strong> que ela empurra pelo corpo, mas a tensão é que determina quanta corrente passa.</p>
        ${nr10}

        <h2>O corpo como resistência</h2>
        <p>Pela Lei de Ohm, I = U ÷ R. A resistência do corpo varia muito:</p>
        <ul>
          <li>Pele <strong>seca e grossa</strong>: alguns milhares de ohms.</li>
          <li>Pele <strong>molhada ou suada</strong>, ou com ferimento: pode cair para perto de <strong>1.000 Ω</strong> ou menos.</li>
        </ul>
        <p>Exemplo com pele molhada: 127 V ÷ 1.000 Ω ≈ <strong>127 mA</strong>. Pelo gráfico abaixo, já é uma corrente capaz de causar fibrilação.
        Por isso uma tomada comum pode matar, principalmente em banheiros, cozinhas e áreas externas.</p>

        ${fig("seg-efeitos-corrente", "Escala de efeitos da corrente alternada no corpo humano, de 0,5 mA a mais de 1.000 mA", "Efeitos aproximados da corrente alternada no corpo.")}

        <h2>Os efeitos</h2>
        <ul>
          <li><strong>Contração muscular (tetanização):</strong> a corrente comanda os músculos. Acima de uns 10 mA, a mão pode "grudar" no condutor e a pessoa não consegue soltar.</li>
          <li><strong>Parada respiratória:</strong> a contração atinge os músculos da respiração.</li>
          <li><strong>Fibrilação ventricular:</strong> o coração passa a tremer em vez de bombear. Sem atendimento (RCP e desfibrilador), leva à morte em minutos.</li>
          <li><strong>Queimaduras:</strong> internas e nos pontos de entrada e saída da corrente. As internas podem ser graves mesmo com marcas pequenas na pele.</li>
          <li><strong>Efeitos indiretos:</strong> quedas de escadas e andaimes provocadas pelo susto.</li>
        </ul>

        <h2>O que torna o choque mais grave</h2>
        <table>
          <tr><th>Fator</th><th>Por quê</th></tr>
          <tr><td>Intensidade da corrente</td><td>Mais corrente, efeitos piores</td></tr>
          <tr><td>Tempo de passagem</td><td>Quanto mais tempo, maior o risco de fibrilação. O DR atua em frações de segundo</td></tr>
          <tr><td>Caminho pelo corpo</td><td>Mão-mão e mão-pé passam pelo coração</td></tr>
          <tr><td>Condições da pele e do local</td><td>Umidade, suor, piso molhado e metal reduzem a resistência</td></tr>
          <tr><td>Tensão</td><td>Tensões mais altas rompem a resistência da pele</td></tr>
        </table>

        <h2>Tensão de toque e tensão de passo</h2>
        ${fig("seg-toque-passo", "Pessoa tocando máquina energizada (tensão de toque) e pessoa perto de cabo caído no chão (tensão de passo)", "Choque sem tocar num fio: carcaça com falha e solo energizado.")}
        <ul>
          <li><strong>Tensão de toque:</strong> entre a mão (numa carcaça que ficou energizada por falha) e os pés. O aterramento e o DR existem para eliminar esse risco.</li>
          <li><strong>Tensão de passo:</strong> perto de um cabo caído ou de um aterramento em falha, o solo fica energizado e a tensão cai com a distância.
          Com os pés afastados, a corrente entra por um pé e sai pelo outro.</li>
        </ul>
        <div class="destaque alerta">Cabo de rede caído no chão: <strong>não se aproxime</strong>, afaste as pessoas e ligue para a concessionária e para o 193.
        Se já estiver perto, afaste-se com passos curtos, sem afastar os pés.</div>

        <h2>Teste rápido</h2>
        <details><summary>1. Por que o DR é de 30 mA nas áreas molhadas?</summary><p>Porque desliga com corrente de fuga de até 30 mA, em fração de segundo, antes da faixa em que a fibrilação se torna provável.</p></details>
        <details><summary>2. Uma pessoa com a mão molhada (≈ 1.000 Ω) toca 220 V. Corrente aproximada?</summary><p>220 ÷ 1.000 = <strong>220 mA</strong>: risco grave de fibrilação.</p></details>
      `
    },

    "1-2": {
      duracao: "11 min de leitura",
      texto: `
        <h2>Mais perigoso do que parece</h2>
        <p>O <strong>arco elétrico</strong> é a passagem de corrente pelo ar, entre dois condutores ou entre condutor e terra. Ele acontece num curto-circuito,
        ao abrir uma chave sob carga ou quando uma ferramenta cai num barramento. Num instante, libera uma enorme quantidade de energia.</p>

        <h2>O que o arco produz</h2>
        <ul>
          <li><strong>Calor intenso:</strong> o centro do arco pode passar de <strong>15.000 °C</strong>, mais quente que a superfície do Sol. Queima a pele a distância, mesmo sem contato.</li>
          <li><strong>Metal derretido e vaporizado:</strong> gotas de cobre e alumínio são lançadas em alta velocidade.</li>
          <li><strong>Onda de pressão:</strong> pode arremessar a pessoa e romper tímpanos.</li>
          <li><strong>Luz e radiação ultravioleta:</strong> lesões nos olhos.</li>
          <li><strong>Gases tóxicos e fumaça.</strong></li>
        </ul>
        <p>Muitas vítimas de arco elétrico nem tocaram em partes energizadas: estavam só perto do painel.</p>

        <h2>Causas comuns</h2>
        <ul>
          <li>Ferramenta, parafuso ou fio que cai sobre barramentos.</li>
          <li>Medição com o multímetro na função errada (ex.: em corrente quando deveria estar em tensão) ou com instrumento de <strong>categoria</strong> inadequada.</li>
          <li>Inserir ou retirar disjuntores e fusíveis com carga.</li>
          <li>Isolamento danificado, poeira condutiva, umidade, animais (ratos, insetos) dentro do painel.</li>
          <li>Equipamentos mal mantidos: bornes frouxos e contatos desgastados.</li>
        </ul>

        <h2>Energia incidente e vestimenta</h2>
        <p>A energia que chega ao trabalhador é medida em <strong>cal/cm²</strong>. Cerca de <strong>1,2 cal/cm²</strong> já basta para uma queimadura de segundo grau na pele exposta.
        Em empresas, um <strong>estudo de energia incidente</strong> calcula esse valor em cada painel e define a vestimenta necessária.</p>
        <ul>
          <li>Vestimentas de proteção contra arco (antichama) têm uma classificação (<strong>ATPV</strong>, em cal/cm²): precisam ser maiores que a energia calculada.</li>
          <li><strong>Roupa sintética (poliéster, náilon) derrete e gruda na pele.</strong> Por baixo da vestimenta de proteção, use algodão.</li>
          <li>A NR-10 exige vestimentas de trabalho adequadas, que considerem condutibilidade, inflamabilidade e influências eletromagnéticas.</li>
          <li>Protetor facial e balaclava próprios para arco, luvas e óculos completam a proteção.</li>
        </ul>

        <h2>A melhor proteção</h2>
        <p>A vestimenta é a <strong>última barreira</strong>. Antes dela vêm: <strong>trabalhar desenergizado</strong> sempre que possível, manter distância, usar
        manobras remotas, painéis com portas fechadas e equipamentos bem mantidos.</p>

        <h2>Teste rápido</h2>
        <details><summary>1. É seguro ficar ao lado de um painel aberto, sem tocar em nada, enquanto outra pessoa trabalha nele energizado?</summary><p><strong>Não.</strong> O arco atinge quem está perto por calor, metal projetado e pressão. Só fica na área quem está autorizado e protegido.</p></details>
        <details><summary>2. Por que não usar camiseta de poliéster sob a vestimenta antichama?</summary><p>Porque fibras sintéticas <strong>derretem</strong> com o calor e grudam na pele, agravando a queimadura.</p></details>
      `
    },

    "1-3": {
      duracao: "10 min de leitura",
      texto: `
        <h2>Eletricidade e fogo</h2>
        <p>Uma parcela importante dos incêndios em residências, comércios e indústrias tem origem elétrica. Quase sempre o começo é o mesmo:
        <strong>calor demais num ponto da instalação</strong>.</p>

        <h2>As causas mais comuns</h2>
        <table>
          <tr><th>Causa</th><th>O que acontece</th><th>Prevenção</th></tr>
          <tr><td>Sobrecarga</td><td>Cabo leva mais corrente do que suporta e aquece por inteiro</td><td>Disjuntor coordenado com o cabo (Ib ≤ In ≤ Iz)</td></tr>
          <tr><td>Mau contato</td><td>Conexão frouxa ou oxidada aquece no ponto (efeito Joule)</td><td>Conectores corretos, torque, reaperto, termografia</td></tr>
          <tr><td>Curto-circuito</td><td>Corrente altíssima, faíscas, arco</td><td>Proteção adequada, isolamento em bom estado</td></tr>
          <tr><td>Benjamins e extensões</td><td>Vários aparelhos numa tomada, plugue aquecendo</td><td>Tomadas suficientes; extensão só provisória e dimensionada</td></tr>
          <tr><td>Disjuntor "aumentado"</td><td>Protege menos que o cabo precisa</td><td>Nunca trocar por maior sem refazer o dimensionamento</td></tr>
          <tr><td>Emendas mal feitas</td><td>Aquecimento escondido no forro ou na parede</td><td>Emendas só em caixas, com conectores</td></tr>
          <tr><td>Materiais combustíveis</td><td>Papel, caixas e tecidos encostados em quadros e reatores</td><td>Manter quadros desobstruídos</td></tr>
        </table>

        <h2>Sinais de alerta</h2>
        <ul>
          <li>Cheiro de plástico queimado, tomadas ou interruptores <strong>mornos</strong>, plugues escurecidos.</li>
          <li>Disjuntor que desarma com frequência (ele está avisando alguma coisa).</li>
          <li>Luzes piscando quando um aparelho liga, faíscas ao conectar plugues.</li>
          <li>Ruído (chiado, estalos) em quadros e tomadas.</li>
        </ul>

        <h2>Se o fogo começar</h2>
        <ol>
          <li><strong>Desligue a energia</strong> no quadro, se puder fazer isso com segurança.</li>
          <li>Acione o alarme, avise as pessoas e ligue <strong>193</strong>.</li>
          <li>Combata só se o foco for pequeno, você souber usar o extintor e tiver rota de fuga às costas.</li>
        </ol>

        <h2>Extintores e a classe C</h2>
        <table>
          <tr><th>Classe</th><th>Material</th><th>Extintor adequado</th></tr>
          <tr><td>A</td><td>Sólidos: madeira, papel, tecido</td><td>Água, espuma, pó ABC</td></tr>
          <tr><td>B</td><td>Líquidos inflamáveis</td><td>Espuma, CO₂, pó BC ou ABC</td></tr>
          <tr><td>C</td><td><strong>Equipamentos energizados</strong></td><td><strong>CO₂, pó BC ou ABC</strong></td></tr>
        </table>
        <div class="destaque alerta"><strong>Nunca use água ou espuma em equipamento energizado:</strong> elas conduzem eletricidade até você.
        Depois de desligada a energia, o fogo passa a ser tratado conforme o material que está queimando.</div>

        <h2>Teste rápido</h2>
        <details><summary>1. A tomada do micro-ondas está morna e escurecida. Qual a causa provável?</summary><p><strong>Mau contato</strong> (tomada gasta ou borne frouxo) ou tomada subdimensionada. Desligue o circuito e troque/reaperte.</p></details>
        <details><summary>2. Pegou fogo num quadro energizado. Qual extintor?</summary><p><strong>CO₂ ou pó (BC/ABC)</strong>. Nunca água.</p></details>
      `
    },

    "2-1": {
      duracao: "11 min de leitura",
      texto: `
        <h2>Proteção coletiva vem primeiro</h2>
        <p>A ordem de prioridade é: <strong>eliminar o risco</strong> (trabalhar desenergizado), depois <strong>proteções coletivas (EPC)</strong> e, por último,
        <strong>proteções individuais (EPI)</strong>. O EPI protege só quem está usando e só se estiver em bom estado e for usado corretamente.</p>

        <h2>EPCs — Equipamentos de Proteção Coletiva</h2>
        <table>
          <tr><th>EPC</th><th>Função</th></tr>
          <tr><td>Cones, fitas, correntes e grades</td><td>Isolar a área de trabalho e manter pessoas não autorizadas longe</td></tr>
          <tr><td>Placas e sinalização</td><td>Avisar o risco e o impedimento de religação</td></tr>
          <tr><td>Dispositivos de bloqueio (cadeados, garras)</td><td>Impedir que alguém religue o circuito</td></tr>
          <tr><td>Conjunto de aterramento temporário</td><td>Garantir que o circuito desligado fique no potencial de terra</td></tr>
          <tr><td>Coberturas e mantas isolantes</td><td>Isolar partes energizadas próximas</td></tr>
          <tr><td>Tapete isolante</td><td>Isolar o piso diante de painéis</td></tr>
          <tr><td>DR, aterramento, barreiras e invólucros</td><td>Proteções da própria instalação</td></tr>
        </table>

        <h2>EPIs para eletricidade</h2>
        <table>
          <tr><th>EPI</th><th>Observação</th></tr>
          <tr><td>Capacete com proteção para trabalho elétrico</td><td>Com jugular em trabalhos em altura</td></tr>
          <tr><td>Óculos de segurança e protetor facial</td><td>Facial próprio para arco quando houver o risco</td></tr>
          <tr><td>Luvas isolantes de borracha</td><td>Escolhidas pela <strong>classe de tensão</strong>; usadas com <strong>luva de cobertura</strong> (couro) por cima</td></tr>
          <tr><td>Calçado de segurança para eletricista</td><td>Isolante, sem partes metálicas</td></tr>
          <tr><td>Vestimenta de trabalho adequada</td><td>Antichama/proteção contra arco quando o estudo de risco exigir</td></tr>
          <tr><td>Cinto paraquedista e talabarte</td><td>Trabalho em altura (NR-35)</td></tr>
        </table>

        <h2>Cuidados com o EPI</h2>
        <ul>
          <li>Todo EPI precisa ter <strong>CA</strong> (Certificado de Aprovação) válido, conforme a NR-6.</li>
          <li><strong>Inspecione antes de usar.</strong> Luvas isolantes: teste de inflar (enrole o punho e veja se o ar escapa), procure cortes, furos e ressecamento.</li>
          <li>Guarde as luvas isolantes em bolsa própria, longe do sol e sem dobrar.</li>
          <li>Luvas isolantes passam por <strong>ensaios elétricos periódicos</strong> em laboratório.</li>
          <li>Ferramentas isoladas (alicates, chaves) também têm certificação e classe de tensão. Fita isolante em volta do cabo <strong>não</strong> transforma ferramenta comum em isolada.</li>
          <li>Retire anéis, relógios, correntes e crachás metálicos.</li>
        </ul>

        <h2>Instrumentos de medição</h2>
        <p>Multímetros e detectores também são equipamentos de segurança. Use instrumentos com <strong>categoria de medição</strong> (CAT III ou CAT IV) e tensão compatíveis com o local,
        pontas de prova em bom estado e com proteção nos dedos.</p>

        <h2>Teste rápido</h2>
        <details><summary>1. A luva isolante tem um pequeno furo, mas a luva de couro por cima está inteira. Pode usar?</summary><p><strong>Não.</strong> A luva de couro protege mecanicamente; quem isola é a de borracha. Descarte ou envie para avaliação.</p></details>
        <details><summary>2. Por que o EPC vem antes do EPI?</summary><p>Porque protege todos ao mesmo tempo e não depende de cada pessoa usar corretamente o seu equipamento.</p></details>
      `
    },

    "2-2": {
      duracao: "12 min de leitura",
      texto: `
        <h2>Desligar o disjuntor não basta</h2>
        <p>Muitos acidentes acontecem com quem "desligou": o disjuntor era de outro circuito, alguém religou, havia outra fonte (gerador, nobreak, solar)
        ou um capacitor carregado. Por isso a NR-10 define uma <strong>sequência</strong> para considerar uma instalação desenergizada.</p>
        ${nr10}

        ${fig("seg-desenergizacao", "Os seis passos da desenergização: seccionamento, impedimento de reenergização, constatação da ausência de tensão, aterramento temporário, proteção dos elementos energizados e sinalização", "Sequência de desenergização (NR-10, 10.5.1).")}

        <h2>Os 6 passos</h2>
        <ol>
          <li><strong>Seccionamento:</strong> abrir o circuito no dispositivo correto (disjuntor, seccionadora), conferindo no diagrama e na identificação. Lembre de <strong>todas</strong> as fontes.</li>
          <li><strong>Impedimento de reenergização:</strong> bloquear o dispositivo com cadeado e etiqueta (próxima aula).</li>
          <li><strong>Constatação da ausência de tensão:</strong> medir, com detector ou instrumento adequado, em <strong>todos</strong> os condutores (entre fases e entre fases e terra/neutro).</li>
          <li><strong>Aterramento temporário com equipotencialização:</strong> ligar os condutores entre si e à terra. Se alguém religar por engano ou houver indução, a corrente vai para a terra e o disjuntor atua.</li>
          <li><strong>Proteção dos elementos energizados</strong> que continuam na zona de trabalho (coberturas, barreiras).</li>
          <li><strong>Sinalização de impedimento de reenergização.</strong></li>
        </ol>

        <h2>Teste do testador</h2>
        <p>O passo 3 tem uma armadilha: e se o detector estiver com defeito? Use a regra <strong>"testa, mede, testa"</strong>:</p>
        <ol>
          <li>Teste o instrumento numa fonte <strong>sabidamente energizada</strong> (ou no testador próprio).</li>
          <li>Meça o circuito desligado.</li>
          <li>Teste de novo na fonte energizada, para confirmar que o instrumento não falhou no meio.</li>
        </ol>

        <h2>Reenergização (10.5.2)</h2>
        <p>Para religar, a ordem também é definida:</p>
        <ol>
          <li>Retirar ferramentas, utensílios e equipamentos.</li>
          <li>Retirar da zona controlada todos os trabalhadores não envolvidos na religação.</li>
          <li>Remover o aterramento temporário, a equipotencialização e as proteções adicionais.</li>
          <li>Remover a sinalização de impedimento.</li>
          <li>Destravar e religar os dispositivos de seccionamento.</li>
        </ol>

        <h2>Fontes esquecidas</h2>
        <ul>
          <li>Geradores, nobreaks e sistemas fotovoltaicos (que geram com sol mesmo com a rede desligada).</li>
          <li>Capacitores (inversores, bancos de correção, fontes): esperar a descarga.</li>
          <li>Circuitos de comando alimentados de outro quadro.</li>
          <li>Retorno por neutro compartilhado.</li>
        </ul>

        <h2>Teste rápido</h2>
        <details><summary>1. O detector não acusou tensão. Pode começar a trabalhar?</summary><p>Só se ele foi testado antes e depois numa fonte energizada, todos os condutores foram medidos e os demais passos (bloqueio, aterramento, sinalização) foram cumpridos.</p></details>
        <details><summary>2. Para que serve o aterramento temporário se o circuito já está desligado?</summary><p>Protege contra religação acidental, tensões induzidas e cargas residuais: qualquer energia vai para a terra em vez de passar pelo trabalhador.</p></details>
      `
    },

    "2-3": {
      duracao: "10 min de leitura",
      texto: `
        <h2>Cadeado e etiqueta</h2>
        <p><strong>Bloqueio e etiquetagem</strong> (em inglês, LOTO: <em>lockout/tagout</em>) é o procedimento que garante que ninguém religue uma máquina ou circuito
        enquanto alguém trabalha nele. É o passo 2 da desenergização, e vale para todas as energias perigosas.</p>

        ${fig("seg-loto", "Seccionadora desligada com garra múltipla, três cadeados de trabalhadores diferentes e etiqueta de perigo", "Garra múltipla: a chave só religa quando todos tiram o seu cadeado.")}

        <h2>Regras básicas</h2>
        <ul>
          <li><strong>Cada trabalhador coloca o seu próprio cadeado</strong>, e só ele tem a chave. Nada de "um cadeado para a equipe toda".</li>
          <li>Com várias pessoas, use uma <strong>garra múltipla</strong> (hasp): o dispositivo só pode ser religado quando o último cadeado sair.</li>
          <li>A <strong>etiqueta</strong> informa quem bloqueou, por quê, quando e como contatar. Etiqueta sozinha <strong>não</strong> é bloqueio: ela avisa, o cadeado impede.</li>
          <li>Depois de bloquear, <strong>tente ligar</strong> (pelo botão ou comando local) para confirmar que a máquina não parte, e volte o comando para desligado.</li>
          <li>Só quem colocou o cadeado o retira. A retirada por outra pessoa (ex.: trabalhador que foi embora com a chave) segue um procedimento formal da empresa.</li>
        </ul>

        <h2>Passo a passo</h2>
        <ol>
          <li><strong>Preparar:</strong> identificar todas as fontes de energia da máquina (diagrama, procedimento).</li>
          <li><strong>Avisar</strong> os operadores e quem será afetado.</li>
          <li><strong>Desligar</strong> a máquina pelo comando normal.</li>
          <li><strong>Isolar</strong> as fontes (seccionadora, disjuntor, válvulas).</li>
          <li><strong>Bloquear e etiquetar</strong> cada ponto de isolamento.</li>
          <li><strong>Liberar energias armazenadas:</strong> capacitores, molas, pressão pneumática e hidráulica, peças suspensas (calçar).</li>
          <li><strong>Verificar</strong> a ausência de energia (teste de partida e medição).</li>
        </ol>

        <h2>Não é só eletricidade</h2>
        <table>
          <tr><th>Energia</th><th>Exemplo de bloqueio</th></tr>
          <tr><td>Elétrica</td><td>Seccionadora ou disjuntor com cadeado</td></tr>
          <tr><td>Pneumática</td><td>Válvula de bloqueio com alívio de pressão</td></tr>
          <tr><td>Hidráulica</td><td>Válvula bloqueada, alívio do acumulador</td></tr>
          <tr><td>Mecânica / gravidade</td><td>Calço, trava de segurança em peças suspensas</td></tr>
          <tr><td>Térmica</td><td>Aguardar resfriamento</td></tr>
        </table>
        <p>Máquinas e equipamentos seguem também a <strong>NR-12</strong>, que exige dispositivos de bloqueio e procedimentos de manutenção seguros.</p>

        <h2>Teste rápido</h2>
        <details><summary>1. Três eletricistas vão trabalhar no mesmo motor. Quantos cadeados?</summary><p><strong>Três</strong>, um de cada, numa garra múltipla.</p></details>
        <details><summary>2. A etiqueta "não ligue" pendurada no disjuntor é suficiente?</summary><p><strong>Não.</strong> A etiqueta avisa; o cadeado é que impede fisicamente a religação.</p></details>
      `
    },

    "3-1": {
      duracao: "11 min de leitura",
      texto: `
        <h2>Primeiro: não vire a segunda vítima</h2>
        <p>Diante de alguém levando choque, o impulso é puxar a pessoa. Se ela ainda está em contato com a energia, <strong>você também leva o choque</strong>.</p>
        ${socorro}

        <h2>Passo a passo</h2>
        <ol>
          <li><strong>Desligue a energia</strong>: disjuntor do circuito, chave geral ou retirando o plugue da tomada (pelo plugue, não pelo fio).</li>
          <li>Se for impossível desligar <strong>em baixa tensão</strong>, afaste a vítima da fonte com um material <strong>seco e isolante</strong> (cabo de vassoura de madeira, cadeira de madeira, corda seca),
          pisando sobre algo seco. Nunca use metal ou material molhado.</li>
          <li><strong>Alta tensão</strong> (rede de rua, cabos caídos, subestações): <strong>não se aproxime</strong>. Mantenha distância, isole a área e chame a concessionária e o 193. Só técnicos com equipamento próprio podem agir.</li>
          <li><strong>Ligue 192 (SAMU) ou 193</strong>. Diga o endereço, o que aconteceu (choque elétrico) e o estado da vítima.</li>
          <li><strong>Avalie a vítima:</strong> ela responde? Está respirando normalmente? Se não responde e não respira (ou só "puxa o ar" de vez em quando), comece a <strong>RCP</strong> imediatamente (próxima aula) e peça um DEA.</li>
          <li>Se respira, mantenha-a deitada, aquecida e observe até o socorro chegar. Se vomitar, vire-a de lado.</li>
        </ol>

        <h2>Queimaduras elétricas</h2>
        <ul>
          <li>Resfrie a área com <strong>água corrente em temperatura ambiente</strong> por cerca de 20 minutos (se a energia já estiver desligada e a vítima estiver estável).</li>
          <li><strong>Não</strong> use gelo, pasta de dente, manteiga, óleo ou pomadas caseiras.</li>
          <li><strong>Não</strong> fure bolhas nem arranque roupa grudada na pele.</li>
          <li>Retire anéis, relógios e pulseiras antes que a região inche.</li>
          <li>Cubra com pano limpo e seco ou filme plástico, sem apertar.</li>
        </ul>

        <h2>Todo choque merece avaliação médica</h2>
        <p>Mesmo que a pessoa diga que está bem, a corrente pode ter causado <strong>queimaduras internas</strong> e <strong>alterações no ritmo do coração</strong> que aparecem depois.
        Vítimas de choque devem ser avaliadas por um médico, principalmente se a corrente passou pelo peito, houve desmaio ou o choque foi em tensão mais alta.</p>

        <h2>Na empresa</h2>
        <ul>
          <li>A NR-10 exige que os trabalhadores autorizados sejam capacitados em <strong>primeiros socorros</strong>, especialmente RCP, e em combate a incêndio.</li>
          <li>Tenha um plano de emergência: telefones visíveis, rota de acesso para a ambulância, localização do DEA.</li>
          <li>Todo acidente (e quase-acidente) deve ser comunicado e investigado para não se repetir.</li>
        </ul>

        <h2>Teste rápido</h2>
        <details><summary>1. Um colega está grudado num fio de 127 V e o quadro fica longe. O que fazer?</summary><p>Se der para desligar rapidamente (plugue, disjuntor), desligue. Se não, afaste-o com um objeto <strong>seco e isolante</strong>, pisando em superfície seca. Depois, 192 e avaliação.</p></details>
        <details><summary>2. A vítima levantou e disse que está bem. Pode voltar ao trabalho?</summary><p><strong>Não</strong> sem avaliação médica: lesões internas e arritmias podem aparecer depois.</p></details>
      `
    },

    "3-2": {
      duracao: "10 min de leitura",
      texto: `
        <h2>Cada minuto conta</h2>
        <p>Na parada cardíaca, o cérebro começa a sofrer lesões em poucos minutos sem oxigênio. A <strong>RCP</strong> (ressuscitação cardiopulmonar)
        mantém o sangue circulando até o desfibrilador e a equipe médica chegarem. Feita por quem está perto, ela pode dobrar ou triplicar as chances de sobrevivência.</p>
        ${socorro}

        <h2>Quando começar</h2>
        <p>A vítima <strong>não responde</strong> (chame alto e toque nos ombros) e <strong>não respira normalmente</strong> (não respira ou só faz "suspiros" irregulares,
        chamados de gasping). Não perca tempo procurando pulso: comece.</p>

        <h2>Passo a passo (adulto)</h2>
        <ol>
          <li>Confirme que o local é seguro (<strong>energia desligada!</strong>).</li>
          <li>Ligue <strong>192</strong> (ou peça a alguém) e peça para buscarem um <strong>DEA</strong> (desfibrilador externo automático).</li>
          <li>Deite a vítima de costas numa superfície firme.</li>
          <li>Ajoelhe-se ao lado, coloque a base de uma mão no <strong>centro do peito</strong> e a outra por cima, com os braços esticados.</li>
          <li>Comprima <strong>forte e rápido</strong>: 100 a 120 por minuto, afundando 5 a 6 cm, deixando o peito voltar totalmente.</li>
          <li>Se for treinado em ventilação: 30 compressões e 2 ventilações. Se não for treinado, faça <strong>só compressões</strong>, sem parar.</li>
          <li>Quando o DEA chegar, ligue-o e <strong>siga as instruções faladas</strong> pelo aparelho. Ninguém toca na vítima durante a análise e o choque.</li>
          <li>Continue até a vítima reagir ou a equipe médica assumir. Se houver outra pessoa, revezem a cada 2 minutos: o cansaço diminui a qualidade.</li>
        </ol>

        ${fig("seg-rcp", "Posição das mãos no centro do peito e os números da RCP: 100 a 120 por minuto, 5 a 6 cm, retorno total do tórax, 30 por 2 e uso do DEA", "Os números das compressões torácicas no adulto.")}

        <h2>O DEA</h2>
        <p>O DEA analisa o ritmo do coração e, se houver fibrilação, aplica o choque que pode fazer o coração voltar a bater normalmente.
        Ele foi feito para ser usado por leigos: fala cada passo. Shoppings, aeroportos, academias e muitas empresas têm um. <strong>Saiba onde fica o mais próximo do seu trabalho.</strong></p>

        <h2>Erros comuns</h2>
        <ul>
          <li>Compressões fracas ou devagar demais (contar em voz alta ajuda a manter o ritmo).</li>
          <li>Parar muitas vezes ou por muito tempo.</li>
          <li>Apoiar-se no peito sem deixar voltar.</li>
          <li>Medo de "machucar": costelas podem trincar, mas sem RCP a vítima não sobrevive.</li>
        </ul>
        <p>Esta aula dá uma noção. A habilidade só vem com <strong>treino prático em manequim</strong>, e as diretrizes são revisadas periodicamente: faça um curso e repita o treinamento.</p>

        <h2>Desafio final</h2>
        <p>Você entra na casa de máquinas e encontra um colega caído ao lado de um painel aberto, com um alicate na mão. O que você faz, na ordem?</p>
        <details><summary>Ver resposta</summary><p>1) Não toque nele ainda: verifique o risco (há partes energizadas expostas? cabo encostado nele?). 2) <strong>Desligue a energia</strong> pelo dispositivo de seccionamento
        (ou afaste-o com material seco e isolante, se for baixa tensão e não houver como desligar). 3) Ligue 192 e peça o DEA. 4) Verifique se ele responde e respira.
        5) Se não responde e não respira normalmente, comece a <strong>RCP</strong> e use o DEA assim que chegar. 6) Depois, o acidente deve ser comunicado e investigado.</p></details>
      `
    }
  };
})();
