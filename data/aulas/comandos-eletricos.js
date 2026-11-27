/*
 * Conteúdo das aulas do curso "Comandos Elétricos Industriais".
 * Chave = "<módulo>-<aula>" (mesma ordem de data/cursos.js).
 *
 * Simbologia IEC (desenho vertical, contatos em repouso). Identificação usada no curso:
 *   K = contator · KT = temporizador · F1-F3 = fusíveis de força · F7 = relé térmico · F21 = fusível de comando
 *   S0 = botão desliga · S1/S2 = botões liga · H = sinaleiro · M = motor
 * Motor de exemplo (partida direta/reversão): 3 cv, 220 V, In = 8,6 A (valor de exemplo).
 * Motor de exemplo (estrela-triângulo): 10 cv, 220/380 V em rede 220 V, In = 26 A (valor de exemplo).
 */
window.ROTA_AULAS = window.ROTA_AULAS || {};
(function () {
  const fig = (nome, alt, legenda) =>
    '<figure class="diagrama"><img src="assets/img/diagramas/' + nome + '.svg" alt="' + alt + '" loading="lazy"><figcaption>' + legenda + "</figcaption></figure>";
  const seg = '<div class="destaque alerta"><strong>Segurança:</strong> painéis de comando têm partes energizadas em 220 V ou 380 V. Trabalhar neles exige ' +
    'qualificação e treinamento conforme a <strong>NR-10</strong>. Máquinas acionadas por esses comandos seguem a <strong>NR-12</strong>. ' +
    'Monte e teste circuitos de estudo em bancada, com orientação, e sempre desenergize, bloqueie e teste a ausência de tensão antes de mexer.</div>';

  window.ROTA_AULAS["comandos-eletricos"] = {
    "1-1": {
      duracao: "11 min de leitura",
      texto: `
        <h2>O interruptor que é ligado por eletricidade</h2>
        <p>Um motor industrial pode puxar dezenas de ampères. Ligá-lo com um interruptor comum seria perigoso e o interruptor
        não aguentaria. A solução é o <strong>contator</strong>: uma chave eletromagnética. Uma corrente pequena, que passa por um
        botão, energiza a <strong>bobina</strong> do contator. A bobina vira um ímã, puxa a parte móvel e fecha os contatos
        por onde passa a corrente grande do motor.</p>
        ${seg}

        <h2>Partes do contator</h2>
        <ul>
          <li><strong>Bobina (A1-A2):</strong> o eletroímã. Tem tensão própria (ex.: 24 V, 127 V ou 220 V CA, ou 24 V CC), escrita no corpo dela.</li>
          <li><strong>Núcleo fixo e núcleo móvel:</strong> a bobina atrai o núcleo móvel, que arrasta os contatos.</li>
          <li><strong>Mola:</strong> devolve tudo à posição de repouso quando a bobina é desligada.</li>
          <li><strong>Contatos principais (1-2, 3-4, 5-6):</strong> robustos, levam a corrente do motor (circuito de força).</li>
          <li><strong>Contatos auxiliares:</strong> pequenos, usados no circuito de comando (selo, intertravamento, sinalização).</li>
        </ul>

        ${fig("cmd-contator", "Símbolo do contator: bobina, três contatos principais, um auxiliar NA e um NF ligados pela mesma linha tracejada", "A linha tracejada indica que tudo se move junto quando a bobina é energizada.")}

        <h2>NA e NF</h2>
        <p><strong>NA</strong> (normalmente aberto) é um contato que fica aberto com a bobina desligada e fecha quando ela é energizada.
        <strong>NF</strong> (normalmente fechado) faz o contrário. Os diagramas são <strong>sempre desenhados em repouso</strong>, com a bobina desligada.</p>

        <h2>A numeração conta uma história</h2>
        <table>
          <tr><th>Terminal</th><th>Significado</th></tr>
          <tr><td>A1-A2</td><td>Bobina</td></tr>
          <tr><td>1-2, 3-4, 5-6</td><td>Contatos principais (às vezes marcados 1/L1-2/T1, 3/L2-4/T2, 5/L3-6/T3)</td></tr>
          <tr><td>x3-x4</td><td>Auxiliar <strong>NA</strong> (13-14, 43-44...)</td></tr>
          <tr><td>x1-x2</td><td>Auxiliar <strong>NF</strong> (21-22, 31-32...)</td></tr>
        </table>
        <p>O <strong>segundo dígito</strong> diz a função (1-2 = NF, 3-4 = NA). O <strong>primeiro</strong> é só a ordem do contato no aparelho.</p>

        <h2>Como escolher um contator</h2>
        <ul>
          <li><strong>Categoria de emprego:</strong> para motor de indução com partida e parada normais, use a corrente da categoria <strong>AC-3</strong>.
          AC-1 é para cargas resistivas, e AC-4 para manobras pesadas (inversão em movimento, "pulsos").</li>
          <li><strong>Corrente:</strong> a corrente AC-3 do contator precisa ser <strong>maior ou igual</strong> à corrente nominal do motor (placa).</li>
          <li><strong>Tensão da bobina:</strong> igual à tensão do circuito de comando.</li>
          <li><strong>Contatos auxiliares:</strong> quantos NA e NF o comando vai precisar. Dá para acrescentar blocos auxiliares.</li>
        </ul>

        <h2>Defeitos típicos</h2>
        <table>
          <tr><th>Sintoma</th><th>Causa provável</th></tr>
          <tr><td>Contator não fecha</td><td>Sem tensão na bobina, ou bobina queimada (meça a resistência com tudo desligado)</td></tr>
          <tr><td>Zumbido forte</td><td>Tensão de comando baixa, sujeira entre os núcleos, anel de curto quebrado</td></tr>
          <tr><td>Motor não desliga</td><td>Contatos principais <strong>colados</strong> (soldados) por excesso de corrente</td></tr>
          <tr><td>Bobina queima seguido</td><td>Bobina de tensão errada (ex.: 127 V ligada em 220 V)</td></tr>
        </table>

        <h2>Teste rápido</h2>
        <details><summary>1. Um contato auxiliar marcado 33-34 é NA ou NF?</summary><p>O segundo dígito é 3-4, então é <strong>NA</strong>.</p></details>
        <details><summary>2. A placa do motor diz 8,6 A. Um contator de 9 A em AC-3 serve?</summary><p>Serve, porque 9 A ≥ 8,6 A. Muitos projetistas preferem uma folga (ex.: 12 A) em partidas frequentes.</p></details>
        <details><summary>3. Por que não ligar o motor direto pelo botão?</summary><p>O botão não suporta a corrente do motor e não permite comando a distância, intertravamentos e proteções. O contator separa a corrente pequena do comando da corrente grande da força.</p></details>
      `
    },

    "1-2": {
      duracao: "12 min de leitura",
      texto: `
        <h2>Dois inimigos diferentes</h2>
        <p>Um motor precisa de proteção contra dois problemas:</p>
        <ul>
          <li><strong>Curto-circuito:</strong> corrente enorme e instantânea. Precisa ser interrompida em milissegundos. Quem protege: <strong>fusível</strong> ou a parte magnética do <strong>disjuntor-motor</strong>.</li>
          <li><strong>Sobrecarga:</strong> corrente um pouco acima da nominal por muito tempo (eixo travando, falta de fase, carga excessiva). O motor esquenta devagar até queimar o isolamento. Quem protege: <strong>relé térmico</strong>.</li>
        </ul>

        <h2>Relé térmico (de sobrecarga)</h2>
        <p>Por dentro, cada fase passa por uma lâmina <strong>bimetálica</strong>: dois metais que dilatam de forma diferente. Com corrente
        acima do ajuste, a lâmina aquece, entorta e, depois de um tempo, aciona um mecanismo que abre o contato <strong>95-96 (NF)</strong>.
        Esse contato está em série com a bobina do contator, então o contator desliga o motor.</p>
        <ul>
          <li><strong>Ajuste:</strong> pela <strong>corrente nominal da placa do motor</strong>. Se a placa diz 8,6 A, ajuste em 8,6 A.</li>
          <li><strong>Faixa:</strong> escolha um relé cuja faixa contenha esse valor (ex.: 7 a 10 A).</li>
          <li><strong>Contatos:</strong> 95-96 (NF, desliga o comando) e 97-98 (NA, pode acender um sinaleiro de falha).</li>
          <li><strong>Rearme:</strong> manual (botão azul de reset) ou automático. Em máquinas, prefira o <strong>manual</strong>, para o motor não voltar sozinho.</li>
          <li><strong>Falta de fase:</strong> relés modernos têm sensibilidade a falta de fase e desarmam mais rápido.</li>
        </ul>
        <div class="destaque">O relé térmico <strong>não</strong> protege contra curto-circuito. Ele é lento de propósito, para tolerar a corrente de partida do motor (6 a 8 vezes a nominal por alguns segundos).</div>

        <h2>Fusíveis para motor</h2>
        <p>Em circuitos de motor usam-se fusíveis <strong>retardados</strong> (por exemplo, tipo Diazed ou NH de característica para motor),
        que aguentam o pico de partida sem queimar. Sempre troque um fusível queimado por outro <strong>igual</strong>, nunca maior,
        e nunca "remende" com fio.</p>

        <h2>Disjuntor-motor</h2>
        <p>Junta as duas proteções em um só aparelho: <strong>disparo térmico</strong> ajustável (sobrecarga) e <strong>disparo magnético</strong> (curto-circuito).
        Vantagens: rearma sem trocar peças, desliga as três fases juntas e serve como seccionamento do circuito.
        Também é ajustado pela corrente da placa do motor.</p>

        <h2>Exemplo: motor de 3 cv</h2>
        <table>
          <tr><th>Dado</th><th>Valor</th></tr>
          <tr><td>Placa (exemplo)</td><td>3 cv, 220 V, 8,6 A</td></tr>
          <tr><td>Corrente de partida estimada</td><td>≈ 7 × 8,6 ≈ 60 A por poucos segundos</td></tr>
          <tr><td>Relé térmico</td><td>Faixa 7 a 10 A, ajustado em <strong>8,6 A</strong></td></tr>
          <tr><td>Proteção contra curto</td><td>Fusíveis retardados ou disjuntor-motor, conforme a tabela do fabricante para o contator e o relé escolhidos (coordenação)</td></tr>
        </table>
        <p>Os fabricantes publicam tabelas de <strong>coordenação</strong> dizendo qual fusível ou disjuntor protege cada combinação de contator e relé. Use-as.</p>

        <h2>Teste rápido</h2>
        <details><summary>1. O relé térmico desarmou. Basta rearmar e ligar de novo?</summary><p>Não. Antes, descubra a causa: carga travada, falta de fase, ajuste errado, ventilação do motor obstruída. Rearmar sem investigar queima o motor.</p></details>
        <details><summary>2. Um relé foi ajustado em 12 A para um motor de 8,6 A "para não desarmar". Qual o problema?</summary><p>O motor pode trabalhar sobrecarregado por muito tempo sem proteção e queimar. O ajuste é a corrente da placa.</p></details>
        <details><summary>3. Qual contato do relé térmico vai em série com a bobina do contator?</summary><p>O <strong>95-96</strong>, que é NF.</p></details>
      `
    },

    "1-3": {
      duracao: "10 min de leitura",
      texto: `
        <h2>Botoeiras: a interface com o operador</h2>
        <p>Os botões de comando são <strong>pulsadores</strong>: só ficam acionados enquanto o dedo está apertando. Cada botão tem um bloco
        de contato NA ou NF (ou os dois).</p>
        <ul>
          <li><strong>Botão liga (S1):</strong> contato <strong>NA</strong>. Normalmente verde ou preto.</li>
          <li><strong>Botão desliga (S0):</strong> contato <strong>NF</strong>. Normalmente vermelho ou preto.</li>
          <li><strong>Botão de emergência:</strong> tipo cogumelo, vermelho sobre fundo amarelo, <strong>com trava</strong>: fica acionado até alguém girar ou puxar para soltar. Contato NF.</li>
        </ul>
        <div class="destaque">Por que o desliga é NF? Se um fio do botão se soltar, o circuito abre e a máquina <strong>para</strong>. Essa ideia de "falhar para o lado seguro" aparece em todo o comando.</div>

        <h2>Sinaleiros</h2>
        <p>São lâmpadas (hoje quase sempre LED) que mostram o estado da máquina. As normas de segurança de máquinas (como a IEC 60204-1)
        recomendam este código de cores:</p>
        <table>
          <tr><th>Cor</th><th>Significado</th></tr>
          <tr><td>Vermelho</td><td>Emergência, condição perigosa</td></tr>
          <tr><td>Amarelo</td><td>Condição anormal, atenção</td></tr>
          <tr><td>Verde</td><td>Condição normal</td></tr>
          <tr><td>Azul</td><td>Ação obrigatória do operador</td></tr>
          <tr><td>Branco</td><td>Informação geral</td></tr>
        </table>
        <p>Em painéis antigos, é comum encontrar vermelho = "motor ligado" e verde = "desligado". <strong>Confira sempre a legenda do painel.</strong></p>

        <h2>Temporizadores</h2>
        <p>Um temporizador (<strong>KT</strong>) é um relé cujo contato muda de estado só depois de um tempo ajustado no botão frontal.
        Os dois tipos mais usados:</p>
        <ul>
          <li><strong>Retardo na energização:</strong> a bobina recebe tensão, o tempo corre, e só então o contato muda. É o usado na partida estrela-triângulo.</li>
          <li><strong>Retardo na desenergização:</strong> o contato muda na hora, e só volta depois que a bobina é desligada e o tempo passa. Exemplo: ventilador que continua girando alguns minutos após desligar o equipamento.</li>
        </ul>
        ${fig("cmd-temporizador", "Diagrama de tempos de um temporizador com retardo na energização", "O contato 15-18 fecha só depois do tempo t. O 15-16 faz o oposto.")}
        <p>Muitos temporizadores têm um contato <strong>comutador</strong>: 15 é o comum, 16 é NF e 18 é NA. Confira o esquema impresso na lateral do aparelho, porque a numeração varia entre fabricantes.</p>

        <h2>Teste rápido</h2>
        <details><summary>1. Que tipo de contato tem o botão de emergência?</summary><p><strong>NF</strong>, com trava mecânica.</p></details>
        <details><summary>2. Uma esteira deve partir 5 s depois que a sirene começa a tocar. Qual temporizador?</summary><p><strong>Retardo na energização</strong> ajustado em 5 s.</p></details>
      `
    },

    "2-1": {
      duracao: "10 min de leitura",
      texto: `
        <h2>Uma linguagem comum</h2>
        <p>Diagramas elétricos são a "língua" do painel. No Brasil se usa a simbologia da <strong>IEC</strong> (adotada pelas normas ABNT).
        Nela, o circuito costuma ser desenhado na <strong>vertical</strong>: a fase em cima, o neutro (ou a outra fase) embaixo, e a corrente "descendo" pelos ramos.</p>

        ${fig("cmd-simbolos", "Tabela com os símbolos IEC de contato NA, NF, botões, bobina, fusível, contato térmico, sinaleiro, motor e bobina temporizada", "Símbolos mais usados nos diagramas de comando.")}

        <h2>Regra de ouro: tudo em repouso</h2>
        <p>Todo contato é desenhado como ele está com <strong>a bobina desligada e ninguém apertando nada</strong>. Por isso o S0 aparece fechado (NF)
        e o S1 aparece aberto (NA), mesmo que em funcionamento eles mudem.</p>

        <h2>Letras de identificação</h2>
        <table>
          <tr><th>Letra</th><th>Componente</th><th>Exemplo</th></tr>
          <tr><td>K</td><td>Contator ou relé auxiliar</td><td>K1, K2</td></tr>
          <tr><td>KT</td><td>Temporizador</td><td>KT1</td></tr>
          <tr><td>F</td><td>Proteções: fusíveis, relé térmico</td><td>F1-F3, F7, F21</td></tr>
          <tr><td>Q</td><td>Disjuntores, disjuntor-motor, seccionadoras</td><td>Q1</td></tr>
          <tr><td>S</td><td>Botões e chaves</td><td>S0, S1</td></tr>
          <tr><td>H</td><td>Sinaleiros e sirenes</td><td>H1</td></tr>
          <tr><td>M</td><td>Motores</td><td>M1</td></tr>
          <tr><td>X</td><td>Bornes e réguas de bornes</td><td>X1:3</td></tr>
        </table>
        <p>As letras exatas variam de empresa para empresa (algumas usam "FT" para o relé térmico, "C" para contator). O importante é que o mesmo nome
        apareça no diagrama, na etiqueta do componente e na lista de materiais.</p>

        <h2>Um componente, vários lugares</h2>
        <p>O contator K1 aparece "espalhado": os contatos principais estão no diagrama de força, a bobina e os auxiliares no de comando.
        Todos têm o mesmo nome K1 porque são o <strong>mesmo aparelho</strong>. Diagramas profissionais trazem, abaixo de cada bobina,
        uma <strong>referência cruzada</strong> dizendo em que página e coluna estão os contatos dela.</p>

        <h2>Teste rápido</h2>
        <details><summary>1. No diagrama, um contato de K2 aparece fechado. Com o motor ligado ele estará fechado?</summary><p>Depende. Desenhado fechado significa que é <strong>NF</strong>: fica fechado com K2 desligado e <strong>abre</strong> quando K2 liga.</p></details>
        <details><summary>2. O que costuma ser "F7" num diagrama de partida?</summary><p>O <strong>relé térmico</strong> (proteção contra sobrecarga).</p></details>
      `
    },

    "2-2": {
      duracao: "10 min de leitura",
      texto: `
        <h2>Dois circuitos, um só sistema</h2>
        <p>Todo comando de motor tem duas partes, desenhadas em diagramas separados:</p>
        <table>
          <tr><th></th><th>Circuito de força</th><th>Circuito de comando</th></tr>
          <tr><td>Função</td><td>Levar energia ao motor</td><td>Decidir quando o motor liga e desliga</td></tr>
          <tr><td>Corrente</td><td>Alta (a do motor)</td><td>Baixa (bobinas e sinaleiros)</td></tr>
          <tr><td>Componentes</td><td>Fusíveis, contatos principais, relé térmico, motor</td><td>Botões, bobinas, contatos auxiliares, temporizadores</td></tr>
          <tr><td>Cabos</td><td>Dimensionados pela corrente do motor</td><td>Normalmente 0,75 a 1,5 mm²</td></tr>
        </table>

        <h2>Diagrama de força da partida direta</h2>
        ${fig("cmd-forca-direta", "Diagrama de força: L1, L2 e L3 passam por fusíveis, pelo contator K1 e pelo relé térmico F7 até o motor", "Circuito de força: a energia desce da rede até o motor.")}
        <p>Leia de cima para baixo: as três fases passam pelos <strong>fusíveis</strong>, depois pelos <strong>contatos principais de K1</strong>,
        depois pelos elementos do <strong>relé térmico F7</strong> e chegam ao motor. Se K1 está desligado, o motor está parado.</p>

        <h2>De onde vem a tensão de comando?</h2>
        <ul>
          <li><strong>Fase e neutro</strong> (ex.: 127 V ou 220 V): o mais simples.</li>
          <li><strong>Entre duas fases</strong> (ex.: 220 V ou 380 V): comum em painéis sem neutro.</li>
          <li><strong>Transformador de comando</strong> (ex.: 220 V ou 24 V): isola o comando da rede. Tensões baixas como 24 V são mais seguras para botoeiras.</li>
        </ul>
        <p>O comando tem <strong>proteção própria</strong>: um fusível ou minidisjuntor pequeno (no curso chamamos de <strong>F21</strong>). A tensão da bobina
        dos contatores precisa ser igual à tensão escolhida para o comando.</p>

        <h2>Como ler um diagrama de comando</h2>
        <ol>
          <li>Ache a linha de cima (fase) e a de baixo (neutro).</li>
          <li>Cada ramo vertical termina numa <strong>carga</strong> (bobina ou sinaleiro).</li>
          <li>Pergunte: "que contatos precisam estar fechados para a corrente chegar a essa bobina?"</li>
          <li>Simule mentalmente: aperte um botão, energize a bobina, mude os contatos dela em todo o diagrama, e repita.</li>
        </ol>

        <h2>Teste rápido</h2>
        <details><summary>1. Onde fica o contato 95-96 do relé térmico: força ou comando?</summary><p>No <strong>comando</strong>, em série com a bobina. Os elementos térmicos ficam na força; o contato que eles acionam fica no comando.</p></details>
        <details><summary>2. Por que usar 24 V no comando?</summary><p>Reduz o risco de choque na operação e manutenção das botoeiras e permite usar sensores e CLPs diretamente.</p></details>
      `
    },

    "2-3": {
      duracao: "12 min de leitura",
      texto: `
        <h2>O problema do botão pulsador</h2>
        <p>Se a bobina do contator for ligada só pelo botão S1, o motor funciona apenas enquanto o dedo estiver apertando. Isso existe
        e tem nome: <strong>comando por impulso</strong> (ou "jog"), usado para posicionar máquinas. Mas, para funcionamento contínuo,
        precisamos que o contator "lembre" que foi ligado.</p>

        <h2>Selo (contato de retenção)</h2>
        <p>A solução é colocar um <strong>contato auxiliar NA do próprio contator (K1 13-14) em paralelo com o botão S1</strong>.</p>
        ${fig("cmd-selo", "Comando de partida direta: fusível F21, contato 95-96 de F7, botão S0, botão S1 com o selo K1 13-14 em paralelo, bobina K1 e sinaleiro H1", "Comando de partida direta com selo e sinalização.")}

        <h2>Passo a passo</h2>
        <ol>
          <li><strong>Repouso:</strong> F7 95-96 e S0 estão fechados. S1 e K1 13-14 estão abertos. A bobina K1 não recebe tensão.</li>
          <li><strong>Aperta S1:</strong> a corrente passa por S1 e chega à bobina. K1 liga: os principais fecham (motor gira), o 13-14 fecha e o 43-44 acende H1.</li>
          <li><strong>Solta S1:</strong> S1 abre, mas a corrente agora passa pelo <strong>13-14 de K1</strong>. A bobina continua alimentada: o contator está <strong>selado</strong>.</li>
          <li><strong>Aperta S0:</strong> o circuito abre, a bobina desliga, o 13-14 abre. Ao soltar S0, nada volta a ligar, porque S1 e o selo estão abertos.</li>
          <li><strong>Sobrecarga:</strong> F7 abre o 95-96, com o mesmo efeito do S0.</li>
        </ol>
        <div class="destaque">Uma vantagem escondida: se faltar energia, o contator cai e o selo abre. Quando a energia volta, o motor <strong>não</strong> liga sozinho. Isso é uma exigência de segurança em máquinas.</div>

        <h2>Mais de um ponto de comando</h2>
        <ul>
          <li><strong>Vários botões liga:</strong> em <strong>paralelo</strong> entre si (qualquer um liga).</li>
          <li><strong>Vários botões desliga e emergências:</strong> em <strong>série</strong> (qualquer um desliga).</li>
        </ul>

        <h2>Intertravamento</h2>
        <p>Às vezes, dois contatores <strong>não podem</strong> ligar ao mesmo tempo, como os de horário e anti-horário de um motor,
        que juntos causariam curto entre fases. O <strong>intertravamento elétrico</strong> coloca um contato <strong>NF de um contator em série com a bobina do outro</strong>.
        Se K1 está ligado, seu NF abre e K2 não consegue ligar, e vice-versa. Veremos o circuito completo na aula de reversão.</p>
        <p>Existe ainda o <strong>intertravamento mecânico</strong>: uma peça que trava fisicamente um contator quando o outro fecha.
        Em reversão, o ideal é usar os dois.</p>

        <h2>Teste rápido</h2>
        <details><summary>1. O motor liga, mas desliga assim que S1 é solto. Qual o defeito provável?</summary><p>O <strong>selo</strong> não funciona: contato 13-14 mal ligado, fio solto ou ligado num contato NF por engano.</p></details>
        <details><summary>2. Como ligar duas botoeiras de emergência?</summary><p>Em <strong>série</strong>, com seus contatos NF, para que qualquer uma desligue a máquina.</p></details>
        <details><summary>3. Por que o selo evita a religação automática depois de uma queda de energia?</summary><p>Sem energia o contator cai e abre o 13-14. Na volta, o caminho até a bobina está aberto até alguém apertar S1.</p></details>
      `
    },

    "3-1": {
      duracao: "11 min de leitura",
      texto: `
        <h2>A partida mais simples</h2>
        <p>Na <strong>partida direta</strong>, o motor recebe a tensão plena da rede de uma vez. É barata, simples e dá o maior conjugado (força) de partida.
        O preço é a <strong>corrente de partida</strong>: de 6 a 8 vezes a nominal, durante alguns segundos.</p>
        ${seg}

        <h2>Quando pode ser usada</h2>
        <ul>
          <li>Motores pequenos. Muitas concessionárias limitam a partida direta em baixa tensão a motores de poucos cv (é comum o limite de cerca de 5 cv). <strong>Consulte a norma da concessionária local.</strong></li>
          <li>Quando a rede e o transformador suportam o pico sem afundar a tensão de outras cargas (lâmpadas piscando, outros contatores caindo).</li>
          <li>Quando a máquina aguenta o "tranco" da partida.</li>
        </ul>

        <h2>Circuito completo</h2>
        ${fig("cmd-forca-direta", "Diagrama de força da partida direta", "Força: fusíveis, K1, F7 e motor.")}
        ${fig("cmd-selo", "Diagrama de comando da partida direta com selo", "Comando: F21, F7 95-96, S0, S1 com selo K1 13-14, bobina K1 e sinaleiro H1.")}

        <h2>Lista de materiais (motor de exemplo: 3 cv, 220 V, 8,6 A)</h2>
        <table>
          <tr><th>Item</th><th>Especificação</th></tr>
          <tr><td>F1-F3</td><td>Fusíveis retardados ou disjuntor-motor, pela tabela de coordenação do fabricante</td></tr>
          <tr><td>K1</td><td>Contator ≥ 8,6 A em AC-3 (ex.: 9 ou 12 A), bobina na tensão do comando, 2 auxiliares NA (13-14 e 43-44)</td></tr>
          <tr><td>F7</td><td>Relé térmico, faixa 7-10 A, ajuste 8,6 A</td></tr>
          <tr><td>F21</td><td>Fusível ou minidisjuntor de comando (ex.: 2 a 4 A)</td></tr>
          <tr><td>S0, S1</td><td>Botão NF vermelho e botão NA verde</td></tr>
          <tr><td>H1</td><td>Sinaleiro na tensão do comando</td></tr>
          <tr><td>Cabos</td><td>Força pela corrente do motor e método de instalação; comando 1 mm² (exemplo)</td></tr>
        </table>

        <h2>Montagem passo a passo (em bancada)</h2>
        <ol>
          <li>Com tudo <strong>desligado</strong>, fixe os componentes no trilho DIN.</li>
          <li>Ligue o <strong>comando primeiro</strong>, sem o motor: é mais fácil testar e mais seguro.</li>
          <li>Confira com o multímetro em continuidade (desenergizado): apertando S1, deve haver caminho até A1 da bobina.</li>
          <li>Energize só o comando: aperte S1 e veja K1 selar e H1 acender. Aperte S0 e veja K1 cair. Pressione o botão de teste do relé térmico: K1 deve cair.</li>
          <li>Desligue tudo, ligue a força e o motor, e só então faça o teste completo.</li>
          <li>Com o motor girando, meça a corrente nas três fases com alicate amperímetro e compare com a placa.</li>
        </ol>

        <h2>Teste rápido</h2>
        <details><summary>1. Por que ligar e testar o comando antes da força?</summary><p>Erros no comando aparecem sem risco de o motor partir inesperadamente ou de curto no circuito de força.</p></details>
        <details><summary>2. Um motor de 3 cv com 8,6 A pode puxar quanto na partida?</summary><p>Algo como 6 a 8 × 8,6 ≈ <strong>52 a 69 A</strong>, por poucos segundos.</p></details>
      `
    },

    "3-2": {
      duracao: "12 min de leitura",
      texto: `
        <h2>Como inverter o giro de um motor trifásico</h2>
        <p>Basta <strong>trocar duas fases quaisquer</strong> entre si. O campo girante dentro do motor passa a girar no sentido contrário e o eixo acompanha.
        Na partida com reversão, dois contatores fazem essa troca: <strong>K1</strong> liga o motor com a sequência normal e <strong>K2</strong> com L1 e L3 trocadas.</p>

        ${fig("cmd-reversao-forca", "Diagrama de força da reversão: K1 liga L1, L2 e L3 direto; K2 cruza L1 com L3 antes do relé térmico", "Força: K2 cruza L1 com L3. O relé térmico protege os dois sentidos.")}

        <div class="destaque alerta">Se K1 e K2 fecharem juntos, L1 e L3 ficam ligadas uma na outra: <strong>curto-circuito entre fases</strong>. Por isso o intertravamento é obrigatório.</div>

        <h2>Circuito de comando</h2>
        ${fig("cmd-reversao-comando", "Diagrama de comando da reversão com selo e intertravamento entre K1 e K2", "Cada bobina passa por um contato NF do outro contator.")}
        <ul>
          <li>F21, F7 95-96 e S0 são <strong>comuns</strong> aos dois sentidos: S0 desliga qualquer um.</li>
          <li><strong>S1 + selo K1 13-14</strong> ligam K1. <strong>S2 + selo K2 13-14</strong> ligam K2.</li>
          <li><strong>K2 21-22</strong> em série com a bobina de K1, e <strong>K1 21-22</strong> em série com a de K2: o intertravamento.</li>
        </ul>

        <h2>Simulando</h2>
        <ol>
          <li>Aperta S1: K1 liga e sela. O NF 21-22 de K1 <strong>abre</strong>, bloqueando K2.</li>
          <li>Com K1 ligado, aperta S2: nada acontece, porque o caminho até a bobina de K2 está aberto.</li>
          <li>Aperta S0: K1 cai. Espere o motor <strong>parar</strong>.</li>
          <li>Aperta S2: K2 liga e sela. O motor gira ao contrário.</li>
        </ol>

        <h2>Reversão direta (sem passar pelo S0)</h2>
        <p>Algumas máquinas pedem inversão imediata. Para isso, usam-se botões com contato duplo (NA + NF): o NF de S2 abre o ramo de K1
        antes que o NA de S2 feche o ramo de K2. Mas inverter com o motor girando é uma manobra pesada (categoria <strong>AC-4</strong>):
        exige contatores maiores e é desaconselhada para motores de carga pesada.</p>

        <h2>Teste rápido</h2>
        <details><summary>1. O motor girou ao contrário do desejado na primeira partida. Como corrigir?</summary><p>Com tudo desligado e bloqueado, troque <strong>duas fases</strong> na alimentação do motor (ou na saída do relé térmico).</p></details>
        <details><summary>2. Por que usar intertravamento elétrico e mecânico juntos?</summary><p>Redundância: se um contato NF colar ou um fio for ligado errado, a trava mecânica ainda impede o curto entre fases.</p></details>
        <details><summary>3. O motor só gira para um lado. K2 nunca liga. O que verificar?</summary><p>O botão S2, o selo de K2, o contato <strong>K1 21-22</strong> (pode estar aberto ou mal ligado) e a própria bobina de K2.</p></details>
      `
    },

    "3-3": {
      duracao: "14 min de leitura",
      texto: `
        <h2>Reduzindo a corrente de partida</h2>
        <p>Em motores maiores, a partida direta derruba a tensão da rede. A partida <strong>estrela-triângulo</strong> resolve isso ligando
        o motor primeiro em <strong>estrela</strong> (tensão menor em cada bobina) e, depois de alguns segundos, em <strong>triângulo</strong> (tensão plena).</p>

        ${fig("cmd-estrela-triangulo", "Ligações das bobinas do motor em estrela e em triângulo, com a numeração dos terminais", "Mesmo motor, duas ligações. Na estrela, cada bobina recebe a tensão de fase.")}

        <h2>Condições para usar</h2>
        <ul>
          <li>O motor precisa ter <strong>6 terminais</strong> acessíveis (1 a 6).</li>
          <li>A tensão do motor <strong>em triângulo</strong> deve ser igual à tensão da rede. Exemplo: motor 220/380 V em rede de <strong>220 V</strong>,
          ou motor 380/660 V em rede de <strong>380 V</strong>.</li>
          <li>A carga deve ser <strong>leve na partida</strong> (bombas centrífugas com registro fechado, ventiladores, máquinas que partem em vazio),
          porque o conjugado em estrela também cai para cerca de <strong>1/3</strong>.</li>
        </ul>

        <h2>A conta do "1/3"</h2>
        <p>Rede de 220 V. Em estrela, cada bobina recebe 220 ÷ √3 ≈ <strong>127 V</strong>. Isso é √3 vezes menos tensão, então cada bobina puxa √3 vezes menos corrente.
        Além disso, em triângulo a corrente de linha é √3 vezes a corrente da bobina, e em estrela ela é igual à da bobina.
        Juntando os dois efeitos: 1/√3 × 1/√3 = <strong>1/3</strong> da corrente da partida direta.
        O conjugado também cai na mesma proporção.</p>

        <h2>Os três contatores</h2>
        <table>
          <tr><th>Contator</th><th>Função</th><th>Corrente que passa</th></tr>
          <tr><td>K1 (rede)</td><td>Alimenta os terminais 1, 2 e 3</td><td>≈ 0,58 × In</td></tr>
          <tr><td>K2 (triângulo)</td><td>Liga 6, 4 e 5 a L1, L2 e L3</td><td>≈ 0,58 × In</td></tr>
          <tr><td>K3 (estrela)</td><td>Une 4, 5 e 6 (fecha a estrela)</td><td>≈ 0,33 × In</td></tr>
        </table>
        <p>O fator 0,58 é 1/√3: em triângulo, cada contator está em série com uma bobina do motor, e a corrente na bobina é a de linha dividida por √3.
        Pelo mesmo motivo, o <strong>relé térmico</strong>, instalado depois de K1, é ajustado em <strong>0,58 × In</strong>.</p>

        <h2>Sequência de funcionamento</h2>
        ${fig("cmd-yd-sequencia", "Diagrama de tempos: K1 e K3 ligam juntos, depois do tempo K3 desliga e K2 liga", "K3 sai antes de K2 entrar, com uma pequena pausa.")}
        <ol>
          <li>Aperta S1: <strong>K1 e K3</strong> ligam. O motor parte em <strong>estrela</strong>. O temporizador KT começa a contar.</li>
          <li>Depois do tempo ajustado (normalmente alguns segundos, até o motor chegar perto da rotação nominal), KT <strong>desliga K3</strong>.</li>
          <li>Com K3 aberto, o NF de K3 libera a bobina de <strong>K2</strong>: o motor passa para <strong>triângulo</strong>.</li>
          <li>K2 e K3 são <strong>intertravados</strong>: se ligassem juntos, haveria curto entre fases.</li>
        </ol>

        <h2>Exemplo: motor de 10 cv em rede de 220 V</h2>
        <table>
          <tr><th>Dado</th><th>Valor</th></tr>
          <tr><td>Placa (exemplo)</td><td>10 cv, 220/380 V, In = 26 A em 220 V</td></tr>
          <tr><td>K1 e K2</td><td>≥ 0,58 × 26 ≈ <strong>15,1 A</strong> em AC-3</td></tr>
          <tr><td>K3</td><td>≥ 0,33 × 26 ≈ <strong>8,6 A</strong> em AC-3</td></tr>
          <tr><td>Relé térmico (após K1)</td><td>Ajuste em <strong>15,1 A</strong></td></tr>
        </table>
        <p>Na prática, fabricantes trazem tabelas prontas de "chave estrela-triângulo" por potência. Use-as e confira com essas contas.</p>

        <h2>Teste rápido</h2>
        <details><summary>1. Um motor 220/380 V pode partir em estrela-triângulo numa rede de 380 V?</summary><p><strong>Não.</strong> Em 380 V ele precisa trabalhar em estrela. Ligá-lo em triângulo em 380 V aplicaria 380 V a bobinas de 220 V e queimaria o motor.</p></details>
        <details><summary>2. Se o tempo do KT for curto demais, o que acontece?</summary><p>A comutação para triângulo acontece com o motor ainda lento, e surge um pico de corrente quase igual ao da partida direta.</p></details>
        <details><summary>3. Por que existe a pausa entre K3 desligar e K2 ligar?</summary><p>Para garantir que os contatos de K3 já abriram (e o arco elétrico se apagou) antes de K2 fechar, evitando curto entre fases.</p></details>
      `
    },

    "3-4": {
      duracao: "10 min de leitura",
      texto: `
        <h2>Partida eletrônica</h2>
        <p>Contatores ligam e desligam: é tudo ou nada. Os acionamentos eletrônicos controlam a tensão (e a frequência) de forma gradual.
        Esta aula é uma <strong>introdução</strong>. Cada fabricante tem manual próprio, e é ele que manda na instalação e na parametrização.</p>

        <h2>Soft-starter (chave de partida suave)</h2>
        <p>Usa <strong>tiristores</strong> (chaves eletrônicas) para aumentar a tensão no motor aos poucos, numa <strong>rampa</strong> ajustável.
        A corrente de partida fica limitada e a máquina parte sem tranco.</p>
        <ul>
          <li>Também faz <strong>parada suave</strong>, útil em bombas (reduz o "golpe de aríete" nos canos).</li>
          <li>Depois da partida, muitos modelos fecham um contator de <strong>bypass</strong> interno para reduzir o aquecimento.</li>
          <li><strong>Não</strong> controla a velocidade em regime: depois da rampa, o motor gira na rotação nominal.</li>
        </ul>

        <h2>Inversor de frequência</h2>
        <p>Retifica a rede (CA → CC) e depois gera uma nova tensão alternada com <strong>frequência e tensão variáveis</strong>.
        Como a rotação do motor de indução depende da frequência, o inversor <strong>controla a velocidade</strong>.</p>
        <ul>
          <li>Partida e parada com rampas, corrente de partida baixa.</li>
          <li>Velocidade ajustável: ótimo para esteiras, bombas e ventiladores (reduzir a velocidade de ventiladores e bombas economiza muita energia).</li>
          <li>Proteções internas (sobrecorrente, sobretensão, falta de fase, temperatura).</li>
          <li>Inversão de sentido por parâmetro, sem contatores.</li>
        </ul>

        <h2>Parâmetros básicos de um inversor</h2>
        <table>
          <tr><th>Parâmetro</th><th>O que é</th></tr>
          <tr><td>Dados do motor</td><td>Tensão, corrente, frequência, rotação e potência da placa</td></tr>
          <tr><td>Rampa de aceleração</td><td>Tempo para ir de 0 à frequência máxima</td></tr>
          <tr><td>Rampa de desaceleração</td><td>Tempo para parar</td></tr>
          <tr><td>Frequência mínima e máxima</td><td>Limites de velocidade (ex.: 20 a 60 Hz)</td></tr>
          <tr><td>Fonte de comando</td><td>Teclado, bornes (botões, CLP) ou rede de comunicação</td></tr>
        </table>

        <h2>Comparando os métodos</h2>
        <table>
          <tr><th>Método</th><th>Corrente de partida</th><th>Controla velocidade?</th><th>Custo</th></tr>
          <tr><td>Direta</td><td>6 a 8 × In</td><td>Não</td><td>Baixo</td></tr>
          <tr><td>Estrela-triângulo</td><td>≈ 1/3 da direta</td><td>Não</td><td>Baixo a médio</td></tr>
          <tr><td>Soft-starter</td><td>Ajustável (ex.: 2 a 4 × In)</td><td>Não</td><td>Médio</td></tr>
          <tr><td>Inversor</td><td>Próxima da nominal</td><td><strong>Sim</strong></td><td>Mais alto</td></tr>
        </table>

        <h2>Cuidados</h2>
        <ul>
          <li>Os capacitores internos do inversor <strong>continuam carregados</strong> depois de desligado. Respeite o tempo de espera indicado no aparelho antes de abrir.</li>
          <li><strong>Não</strong> instale contator entre o inversor e o motor para ligar e desligar o motor (a não ser que o manual permita).</li>
          <li>Siga o manual quanto a aterramento e cabos blindados: inversores geram interferência.</li>
        </ul>

        <h2>Teste rápido</h2>
        <details><summary>1. Uma esteira precisa andar em três velocidades diferentes. Soft-starter ou inversor?</summary><p><strong>Inversor</strong>, porque o soft-starter não controla a velocidade em regime.</p></details>
        <details><summary>2. Por que esperar antes de mexer num inversor recém-desligado?</summary><p>Os capacitores do barramento CC ainda guardam tensão perigosa por alguns minutos.</p></details>
      `
    },

    "4-1": {
      duracao: "12 min de leitura",
      texto: `
        <h2>Pense antes de medir</h2>
        <p>Diagnosticar um painel é seguir a corrente pelo diagrama até achar onde ela "para". Um bom método evita trocar peças à toa.</p>
        ${seg}

        <h2>Método em 5 passos</h2>
        <ol>
          <li><strong>Converse e observe:</strong> o que aconteceu? Desarmou algo? Teve cheiro de queimado, barulho, faísca? Há sinaleiro de falha aceso?</li>
          <li><strong>Pegue o diagrama:</strong> identifique o ramo que não funciona (ex.: "a bobina de K2 não energiza").</li>
          <li><strong>Liste os suspeitos:</strong> todos os contatos e componentes em série com aquela carga.</li>
          <li><strong>Teste com segurança:</strong> de preferência <strong>desenergizado</strong>, com o multímetro em continuidade ou resistência, acionando os botões manualmente.
          Medições com o painel energizado só por profissionais qualificados (NR-10), com EPI e instrumento de categoria adequada.</li>
          <li><strong>Corrija a causa e teste de novo:</strong> trocar um fusível queimado sem descobrir por que ele queimou é só adiar o problema.</li>
        </ol>

        <h2>Tabela de sintomas</h2>
        <table>
          <tr><th>Sintoma</th><th>O que verificar</th></tr>
          <tr><td>Nada funciona, nem os sinaleiros</td><td>Alimentação do painel, fusível/minidisjuntor de comando (F21), transformador de comando</td></tr>
          <tr><td>Contator não liga ao apertar S1</td><td>Relé térmico desarmado (95-96 aberto), emergência travada, S0 com defeito, S1 não fecha, bobina aberta</td></tr>
          <tr><td>Contator liga, mas cai ao soltar S1</td><td>Selo (13-14) mal ligado ou com defeito</td></tr>
          <tr><td>Contator liga, motor não gira e ronca</td><td><strong>Falta de fase</strong> (fusível de força queimado, contato principal ruim), eixo travado</td></tr>
          <tr><td>Relé térmico desarma depois de um tempo</td><td>Sobrecarga real (meça a corrente), ajuste abaixo da placa, falta de fase, ventilação do motor</td></tr>
          <tr><td>Fusível de força queima na partida</td><td>Curto no motor ou nos cabos, fusível subdimensionado ou de tipo errado (rápido em vez de retardado)</td></tr>
          <tr><td>Contator vibra e faz barulho</td><td>Tensão de comando baixa, sujeira nos núcleos, mau contato no circuito da bobina</td></tr>
          <tr><td>Estrela-triângulo não passa para triângulo</td><td>Temporizador (ajuste ou defeito), intertravamento K3/K2, bobina de K2</td></tr>
          <tr><td>Motor não para ao apertar S0</td><td>Contatos principais <strong>colados</strong>, S0 em curto, fio em paralelo indevido. Desligue pela proteção geral!</td></tr>
        </table>

        <h2>Testes úteis no motor (desenergizado)</h2>
        <ul>
          <li><strong>Resistência das bobinas:</strong> as três devem ter valores praticamente iguais. Uma muito diferente indica espiras em curto ou bobina aberta.</li>
          <li><strong>Isolação:</strong> com megômetro, entre as bobinas e a carcaça. Esse teste é detalhado no curso de Motores Elétricos.</li>
          <li><strong>Corrente em funcionamento:</strong> com alicate amperímetro, nas três fases. Deve ficar próxima da placa e equilibrada.</li>
        </ul>

        <h2>Teste rápido</h2>
        <details><summary>1. O motor ronca e não parte. Um alicate mostra corrente só em duas fases. Causa provável?</summary><p><strong>Falta de fase</strong>: fusível queimado, contato principal com defeito ou cabo interrompido na fase sem corrente.</p></details>
        <details><summary>2. O relé térmico desarma sempre depois de 20 minutos, e a corrente medida é 10,5 A para um motor de 8,6 A. O que fazer?</summary><p>O motor está <strong>sobrecarregado</strong>. Investigue a carga mecânica (rolamentos, correias, material em excesso). Aumentar o ajuste do relé só esconderia o problema.</p></details>
      `
    },

    "4-2": {
      duracao: "12 min de leitura",
      texto: `
        <h2>Painel bem montado é painel fácil de manter</h2>
        <p>Um painel organizado se explica sozinho. Quem chegar depois (inclusive você daqui a dois anos) precisa entender o que está vendo.</p>

        <h2>Layout</h2>
        <ul>
          <li>Componentes em <strong>trilho DIN</strong>, com <strong>canaletas</strong> entre as fileiras.</li>
          <li>Fluxo lógico: entrada e proteções no alto, contatores e relés no meio, <strong>régua de bornes</strong> embaixo, onde chegam os cabos de campo (motores, botoeiras).</li>
          <li>Deixe <strong>espaço reserva</strong> (cerca de 20%) para ampliações.</li>
          <li>Separe força e comando nas canaletas quando possível, principalmente perto de inversores.</li>
          <li>Respeite a <strong>ventilação</strong>: componentes que esquentam (inversores, fontes) precisam do espaço livre indicado no manual.</li>
        </ul>

        <h2>Ligações</h2>
        <ul>
          <li>Use <strong>terminais tubulares</strong> (ponteiras) em todo cabo flexível. Fio "desfiado" no borne é mau contato garantido.</li>
          <li>Aperte com o <strong>torque</strong> indicado pelo fabricante. Borne frouxo esquenta (efeito Joule) e borne apertado demais danifica o componente.</li>
          <li>No máximo a quantidade de fios por borne que o fabricante permite.</li>
          <li>Sem emendas dentro de canaletas.</li>
          <li><strong>Anilhas de identificação</strong> nas duas pontas de cada fio, com o mesmo número do diagrama.</li>
        </ul>

        <h2>Cores dos condutores</h2>
        <p>Cada empresa define seu padrão no projeto. Um padrão muito usado, baseado na IEC 60204-1, é:</p>
        <table>
          <tr><th>Cor</th><th>Uso</th></tr>
          <tr><td>Preto</td><td>Força em CA e CC</td></tr>
          <tr><td>Vermelho</td><td>Comando em CA</td></tr>
          <tr><td>Azul escuro</td><td>Comando em CC</td></tr>
          <tr><td>Laranja</td><td>Circuitos que continuam energizados com a chave geral desligada (alimentação externa)</td></tr>
          <tr><td>Azul claro</td><td>Neutro</td></tr>
          <tr><td>Verde-amarelo</td><td>Proteção (terra)</td></tr>
        </table>

        <h2>Aterramento e segurança</h2>
        <ul>
          <li>A porta e a estrutura do painel ligadas ao <strong>terra</strong> (com cordoalha na porta).</li>
          <li>Partes energizadas protegidas contra toque (tampas, proteções de acrílico).</li>
          <li>Chave geral com possibilidade de <strong>bloqueio com cadeado</strong>.</li>
          <li>Placas de advertência de "risco de choque elétrico".</li>
        </ul>

        <h2>Antes de energizar: checklist</h2>
        <ol>
          <li>Inspeção visual: fios bem presos, anilhas, nada esquecido dentro do painel (sobras de fio, ferramentas).</li>
          <li>Conferência ponto a ponto com o diagrama.</li>
          <li>Teste de continuidade e de isolação (desenergizado).</li>
          <li>Ajuste dos relés térmicos e temporizadores conforme projeto.</li>
          <li>Teste do <strong>comando sem a força</strong> (motores desconectados ou disjuntores de força desligados).</li>
          <li>Teste com motor: sentido de giro, corrente nas três fases, botões de emergência.</li>
        </ol>

        <h2>Documentação</h2>
        <p>Deixe dentro do painel (num porta-documentos) os diagramas atualizados, a lista de componentes e os ajustes. Toda alteração feita
        em campo precisa ir para o diagrama, senão o próximo técnico vai trabalhar com informação errada.</p>

        <h2>Desafio final</h2>
        <p>Uma bomba de 3 cv (220 V, 8,6 A) deve ser comandada de dois locais: o painel e uma botoeira na casa de bombas. Ela também precisa de
        um botão de emergência e de um sinaleiro de "bomba ligada". Descreva o circuito de comando.</p>
        <details><summary>Ver resposta</summary><p>Partida direta com selo. No ramo da bobina K1, em <strong>série</strong>: F21, F7 95-96, emergência (NF), S0 do painel (NF) e S0 da casa de bombas (NF).
        Em <strong>paralelo</strong> entre si: S1 do painel, S1 da casa de bombas e o selo K1 13-14. Sinaleiro H1 por um auxiliar NA de K1.
        Relé térmico ajustado em 8,6 A e contator ≥ 8,6 A em AC-3.</p></details>
      `
    },

    "5-1": {
      duracao: "13 min de leitura",
      texto: `
        <h2>Quando a estrela-triângulo não serve</h2>
        <p>A partida estrela-triângulo exige um motor com <strong>6 pontas acessíveis</strong> e que trabalhe em triângulo na tensão da rede.
        Muitos motores grandes, bombas submersas e compressores não atendem a isso. Para eles existe a <strong>partida compensadora</strong>,
        que reduz a tensão na partida usando um <strong>autotransformador</strong>.</p>
        ${seg}

        <h2>O que é o autotransformador</h2>
        <p>É um transformador com um enrolamento só, que tem <strong>derivações</strong> (taps): pontos de saída a 50 %, 65 % e 80 % da tensão de entrada.
        Ligando o motor numa derivação, ele parte com tensão reduzida. Depois de alguns segundos, o motor passa para a tensão plena da rede.</p>
        ${fig("cmd-compensadora", "Esquema unifilar da partida compensadora com autotransformador, contatores K1, K2 e K3 e tabela de etapas", "Esquema simplificado de uma fase e a sequência dos contatores.")}

        <h2>A sequência de comando</h2>
        <ol>
          <li><strong>Partida:</strong> K3 fecha o ponto comum (estrela) do autotransformador e K2 liga o motor na derivação. O motor recebe, por exemplo, 65 % da tensão.</li>
          <li><strong>Transição:</strong> depois do tempo ajustado no temporizador, K3 abre. Por um instante, parte do enrolamento fica em série com o motor (funciona como um reator)
          e o motor <strong>não fica sem tensão</strong>. Isso evita o "tranco" e o pico de corrente da troca.</li>
          <li><strong>Regime:</strong> K1 liga o motor direto na rede e K2 desliga. O autotransformador sai do circuito.</li>
        </ol>
        <p>K1 e K2/K3 são <strong>intertravados</strong>: nunca podem estar fechados ao mesmo tempo, senão a rede fica em curto através do autotransformador.</p>

        <h2>Quanto a corrente cai</h2>
        <p>Com uma derivação de <em>k</em> (por exemplo, k = 0,65), o motor recebe k vezes a tensão e puxa k vezes a corrente de partida.
        Mas o autotransformador também "transforma" a corrente: do lado da rede, a corrente fica <strong>k²</strong> vezes a da partida direta.
        O conjugado (torque) do motor também cai para <strong>k²</strong>.</p>
        <table>
          <tr><th>Derivação</th><th>Tensão no motor</th><th>Corrente na rede</th><th>Conjugado de partida</th></tr>
          <tr><td>50 %</td><td>0,50 × U</td><td>≈ 25 %</td><td>≈ 25 %</td></tr>
          <tr><td>65 %</td><td>0,65 × U</td><td>≈ 42 %</td><td>≈ 42 %</td></tr>
          <tr><td>80 %</td><td>0,80 × U</td><td>≈ 64 %</td><td>≈ 64 %</td></tr>
        </table>
        <div class="destaque"><strong>Exemplo:</strong> um motor de 30 cv em 380 V tem In ≈ 42 A e Ip/In = 7. Na partida direta, puxaria cerca de 7 × 42 ≈ 294 A.
        Na derivação de 65 %, a rede vê ≈ 0,42 × 294 ≈ <strong>124 A</strong>, e o motor ainda parte com 42 % do conjugado.</div>

        <h2>Vantagens e cuidados</h2>
        <ul>
          <li><strong>Funciona com motor de 3 pontas</strong> e em qualquer tensão.</li>
          <li><strong>Dá para escolher</strong> a derivação: se a carga é pesada e o motor não sai do lugar com 65 %, passa-se para 80 %.</li>
          <li>Transição sem interrupção (menos pico na troca que a estrela-triângulo).</li>
          <li>Cuidados: o autotransformador é <strong>caro e pesado</strong> e esquenta. Ele tem um limite de <strong>partidas por hora</strong>, informado pelo fabricante.
          Muitos trazem um <strong>termostato</strong> interno que deve entrar no comando.</li>
        </ul>

        <h2>Teste rápido</h2>
        <details><summary>1. Na derivação de 80 %, a corrente na rede fica em torno de quantos % da partida direta?</summary><p>0,80² = 0,64 → <strong>cerca de 64 %</strong>.</p></details>
        <details><summary>2. Por que K1 não pode fechar enquanto K2 e K3 estão fechados?</summary><p>Porque a rede ficaria em <strong>curto-circuito</strong> através do autotransformador. Por isso eles são intertravados.</p></details>
        <details><summary>3. Um motor tem só 3 pontas acessíveis e precisa de partida com tensão reduzida. Estrela-triângulo ou compensadora?</summary><p><strong>Compensadora</strong> (ou soft-starter/inversor). A estrela-triângulo exige 6 pontas.</p></details>
      `
    },

    "5-2": {
      duracao: "12 min de leitura",
      texto: `
        <h2>Partida série-paralelo</h2>
        <p>Motores de <strong>12 pontas</strong> (ou 9) podem ser ligados em dois níveis de tensão: um o dobro do outro (por exemplo, 220 V e 440 V).
        Na ligação para a tensão maior, as meias-bobinas de cada fase ficam <strong>em série</strong>. Na ligação para a tensão menor, ficam <strong>em paralelo</strong>.</p>
        <p>A partida série-paralelo usa isso: numa rede de 220 V, o motor <strong>parte ligado como se fosse para 440 V</strong> (série) e, depois de alguns segundos,
        passa para a ligação de 220 V (paralelo).</p>
        ${seg}

        <h2>Por que a corrente cai para 1/4</h2>
        <p>Em série, cada meia-bobina recebe <strong>metade</strong> da tensão para a qual foi feita. Com metade da tensão, a corrente de cada caminho cai pela metade,
        e como agora há um caminho só (em vez de dois em paralelo), a corrente puxada da rede fica com <strong>1/4</strong> da partida direta.
        O conjugado também cai para cerca de <strong>1/4</strong>, porque depende do quadrado da tensão.</p>
        <div class="destaque">Por causa do conjugado baixo (≈ 25 %), a série-paralelo é indicada para partidas <strong>em vazio</strong> ou com carga leve: bombas centrífugas com
        válvula fechada, ventiladores, máquinas que só recebem carga depois de embalar.</div>

        <h2>As ligações (motor 12 pontas, exemplo)</h2>
        <p>Usando a numeração de exemplo do curso de Motores (confira sempre a placa do seu motor):</p>
        <table>
          <tr><th>Etapa</th><th>Ligação</th><th>L1</th><th>L2</th><th>L3</th><th>Unir</th></tr>
          <tr><td>Partida (série)</td><td>Δ série (de 440 V)</td><td>1-12</td><td>2-10</td><td>3-11</td><td>4-7, 5-8, 6-9</td></tr>
          <tr><td>Regime (paralelo)</td><td>ΔΔ (de 220 V)</td><td>1-6-7-12</td><td>2-4-8-10</td><td>3-5-9-11</td><td>—</td></tr>
        </table>
        <p>No painel, isso é feito com <strong>três contatores</strong>: um que alimenta o motor, um que faz as ligações da série e outro que faz as do paralelo,
        com <strong>intertravamento</strong> entre série e paralelo e um temporizador para a troca, igual à lógica da estrela-triângulo.</p>

        <h2>Comparando as partidas</h2>
        <table>
          <tr><th>Partida</th><th>Corrente na rede</th><th>Conjugado</th><th>Exige</th></tr>
          <tr><td>Direta</td><td>100 % (6 a 8 × In)</td><td>100 %</td><td>Rede que aguente o pico</td></tr>
          <tr><td>Estrela-triângulo</td><td>≈ 33 %</td><td>≈ 33 %</td><td>Motor de 6 pontas em Δ na tensão da rede</td></tr>
          <tr><td>Compensadora</td><td>25 %, 42 % ou 64 %</td><td>igual à corrente</td><td>Autotransformador</td></tr>
          <tr><td>Série-paralelo</td><td>≈ 25 %</td><td>≈ 25 %</td><td>Motor de 9 ou 12 pontas, dupla tensão</td></tr>
          <tr><td>Soft-starter</td><td>ajustável (2 a 4 × In, típico)</td><td>ajustável</td><td>Equipamento eletrônico</td></tr>
          <tr><td>Inversor de frequência</td><td>perto da nominal</td><td>alto, controlado</td><td>Equipamento eletrônico (controla a velocidade)</td></tr>
        </table>
        <p>Regra prática para escolher: <strong>a concessionária e a rede</strong> dizem até quanto a corrente pode subir; <strong>a carga</strong> diz quanto conjugado é preciso para sair do lugar.
        A partida escolhida tem que atender as duas coisas.</p>

        <h2>Teste rápido</h2>
        <details><summary>1. Na partida série-paralelo, a corrente na rede cai para aproximadamente quanto da partida direta?</summary><p>Para <strong>cerca de 1/4 (25 %)</strong>.</p></details>
        <details><summary>2. Uma correia transportadora parte carregada e precisa de conjugado alto. A série-paralelo é uma boa escolha?</summary><p><strong>Não</strong>: o conjugado de partida cai para cerca de 25 %. Melhor uma compensadora com derivação alta, soft-starter bem ajustado ou inversor.</p></details>
      `
    },

    "5-3": {
      duracao: "12 min de leitura",
      texto: `
        <h2>Duas velocidades num motor só</h2>
        <p>A rotação de um motor de indução depende do <strong>número de polos</strong> (n = 120 × f ÷ p, visto no curso de Motores). Para ter duas velocidades
        sem inversor, existem dois caminhos:</p>
        <ul>
          <li><strong>Dois enrolamentos independentes</strong> no mesmo motor, cada um com um número de polos (permite qualquer relação, por exemplo 6/4 polos).</li>
          <li><strong>Ligação Dahlander</strong>: um enrolamento só, que muda o número de polos conforme a ligação. A relação é sempre <strong>2 para 1</strong> (4/2, 8/4 polos…).</li>
        </ul>
        <p>Aplicações: ventiladores e exaustores (alta no calor, baixa no resto do tempo), máquinas-ferramenta, elevadores de carga antigos, misturadores.</p>
        ${seg}

        <h2>As ligações Dahlander</h2>
        ${fig("cmd-dahlander", "Ligação Dahlander: baixa velocidade em triângulo com terminais 1, 2 e 3 alimentados; alta velocidade em dupla estrela com 4, 5 e 6 alimentados e 1-2-3 unidos", "Baixa em triângulo (Δ) e alta em dupla estrela (YY).")}
        <ul>
          <li><strong>Baixa velocidade:</strong> rede em 1, 2 e 3. Os terminais 4, 5 e 6 (no meio de cada lado do triângulo) ficam <strong>livres e isolados</strong>.</li>
          <li><strong>Alta velocidade:</strong> rede em 4, 5 e 6 e os terminais 1, 2 e 3 <strong>unidos</strong> entre si (fecham o centro da dupla estrela).</li>
        </ul>

        <h2>Os contatores</h2>
        <ul>
          <li><strong>K1</strong> liga a rede em 1-2-3 (baixa).</li>
          <li><strong>K2</strong> liga a rede em 4-5-6 e <strong>K3</strong> une 1-2-3 (alta). K2 e K3 trabalham juntos.</li>
          <li>K1 é <strong>intertravado</strong> com K2 e K3 (elétrico e, de preferência, mecânico). Se K1 e K3 fechassem juntos, a rede entraria em curto.</li>
          <li>Cada velocidade tem a sua corrente nominal, por isso são usados <strong>dois relés térmicos</strong> (um para baixa, outro para alta), cada um ajustado pela placa.</li>
        </ul>
        <div class="destaque alerta">Ao passar da <strong>alta para a baixa</strong> com o motor girando, ele vira gerador por alguns instantes e freia bruscamente: corrente alta e tranco
        na mecânica. Em muitos projetos, o comando obriga a <strong>parar antes</strong> de trocar de alta para baixa (ou usa um tempo de espera).</div>
        <p>Confira também o <strong>sentido de giro</strong> nas duas velocidades. Dependendo do fabricante, pode ser preciso trocar duas fases na ligação de alta para o
        motor girar para o mesmo lado. Siga sempre o esquema da placa.</p>

        <h2>Teste rápido</h2>
        <details><summary>1. Um motor Dahlander 4/2 polos em 60 Hz tem quais velocidades síncronas?</summary><p>120 × 60 ÷ 4 = 1.800 rpm (baixa) e 120 × 60 ÷ 2 = <strong>3.600 rpm</strong> (alta).</p></details>
        <details><summary>2. Em alta velocidade (YY), o que acontece com os terminais 1, 2 e 3?</summary><p>Ficam <strong>unidos entre si</strong> (por K3), formando o centro da dupla estrela. A rede entra em 4, 5 e 6.</p></details>
        <details><summary>3. Por que usar dois relés térmicos num comando Dahlander?</summary><p>Porque a <strong>corrente nominal é diferente</strong> em cada velocidade. Cada relé é ajustado para a corrente da sua velocidade.</p></details>
      `
    },

    "5-4": {
      duracao: "11 min de leitura",
      texto: `
        <h2>Parar também é um projeto</h2>
        <p>Ao desligar, o motor para "sozinho", só pelo atrito. Em máquinas com muita inércia (serras, centrífugas, volantes) isso pode levar minutos.
        Em outras, parar rápido é questão de <strong>segurança</strong> (NR-12) ou de precisão. Por isso existem métodos de frenagem.</p>
        ${seg}

        <h2>1) Freio eletromagnético (motofreio)</h2>
        <p>Um disco de freio é apertado por <strong>molas</strong>. Uma bobina, alimentada junto com o motor, puxa o disco e <strong>libera</strong> o eixo. Desligou o motor
        (ou faltou energia), a bobina solta e as molas <strong>freiam</strong>. Por isso é chamado de freio de segurança: freia na falta de energia.
        É usado em talhas, pontes rolantes, portões e esteiras inclinadas.</p>

        <h2>2) Frenagem por injeção de corrente contínua</h2>
        ${fig("cmd-frenagem", "Frenagem por injeção de corrente contínua: K1 alimenta o motor, K2 injeta CC em duas fases a partir de um retificador; gráfico mostra parada mais rápida", "K1 desliga e K2 injeta CC por alguns segundos.")}
        <p>Depois que K1 desliga, o contator <strong>K2</strong> aplica <strong>corrente contínua</strong> em duas fases do motor, vinda de um transformador com retificador.
        A CC cria um campo magnético <strong>parado</strong>. O rotor, que ainda gira, é "segurado" por esse campo e para rápido, sem inverter o sentido.</p>
        <ul>
          <li>K1 e K2 são <strong>intertravados</strong> (CA e CC nunca juntas no motor).</li>
          <li>Um <strong>temporizador</strong> limita o tempo da injeção (alguns segundos). CC por muito tempo aquece o motor parado.</li>
          <li>Não segura a carga parada: depois que o motor para, não há mais conjugado de frenagem. Para segurar (talhas), use freio mecânico.</li>
        </ul>

        <h2>3) Frenagem por contracorrente</h2>
        <p>Inverte-se a ordem de duas fases com o motor ainda girando (como na reversão). O campo passa a girar ao contrário e freia o rotor com força.
        É a frenagem mais brusca e a que mais exige do motor e da rede (corrente muito alta). E tem um perigo: se não houver nada para desligar exatamente
        quando a rotação chega a zero, o motor <strong>começa a girar ao contrário</strong>. Por isso é usado um <strong>relé de rotação nula</strong> (sensor de velocidade).</p>

        <h2>4) Frenagem com inversor de frequência</h2>
        <p>O inversor reduz a frequência aos poucos e controla a parada (rampa de desaceleração). A energia que volta do motor vai para um <strong>resistor de frenagem</strong>
        ou de volta para a rede (inversores regenerativos). Hoje é a solução mais comum em máquinas novas.</p>

        <h2>Teste rápido</h2>
        <details><summary>1. Num motofreio, o que acontece com o freio se faltar energia?</summary><p>A bobina solta e as <strong>molas aplicam o freio</strong>. Ele freia na falta de energia (freio de segurança).</p></details>
        <details><summary>2. Por que a injeção de CC precisa de um temporizador?</summary><p>Para <strong>limitar o tempo</strong> de aplicação da CC. Com o motor parado, a CC só aqueceria os enrolamentos.</p></details>
        <details><summary>3. Qual o risco da frenagem por contracorrente sem relé de rotação nula?</summary><p>O motor <strong>começar a girar no sentido contrário</strong> depois de parar.</p></details>
      `
    },
    "6-1": {
      duracao: "13 min de leitura",
      texto: `
        <h2>O comando que "sente" a máquina</h2>
        <p>Até aqui, quem mandava ligar e desligar era o operador, pelos botões. Na automação, quem manda são os <strong>sensores e chaves</strong> que percebem
        posição, presença, nível, pressão ou temperatura. Para o comando, todos eles são, no fim, <strong>contatos NA ou NF</strong> que abrem e fecham.</p>
        ${seg}

        <h2>Chaves mecânicas</h2>
        <table>
          <tr><th>Dispositivo</th><th>O que detecta</th><th>Exemplo de uso</th></tr>
          <tr><td>Chave fim de curso</td><td>Posição: uma peça encosta no rolete ou haste</td><td>Portão abriu até o fim, mesa chegou ao limite</td></tr>
          <tr><td>Pressostato</td><td>Pressão do ar, água ou óleo</td><td>Compressor liga a 6 bar e desliga a 8 bar</td></tr>
          <tr><td>Termostato</td><td>Temperatura</td><td>Liga o exaustor quando o painel passa de 40 °C</td></tr>
          <tr><td>Chave boia</td><td>Nível de líquido</td><td>Bomba de caixa d'água</td></tr>
          <tr><td>Chave seletora</td><td>Escolha do operador</td><td>Manual – 0 – Automático</td></tr>
        </table>
        <p>O pressostato e o termostato têm um <strong>diferencial</strong> (histerese): ligam num valor e desligam em outro. Sem isso, o contator ficaria ligando e
        desligando sem parar perto do ponto ajustado.</p>

        <h2>Sensores eletrônicos (sem contato físico)</h2>
        <ul>
          <li><strong>Indutivo:</strong> detecta <strong>metal</strong> a poucos milímetros. Muito usado para contar peças e detectar posição de cilindros.</li>
          <li><strong>Capacitivo:</strong> detecta <strong>qualquer material</strong> (plástico, madeira, grãos, líquido através de parede de plástico). Útil para nível de silos.</li>
          <li><strong>Fotoelétrico:</strong> usa um feixe de luz. Pode ser de <strong>barreira</strong> (emissor e receptor separados, maior alcance),
          <strong>retrorreflexivo</strong> (com espelho) ou <strong>difuso</strong> (a própria peça reflete).</li>
        </ul>

        <h2>Sensores de 3 fios: PNP e NPN</h2>
        <p>A maioria trabalha em <strong>24 Vcc</strong> com 3 fios: marrom (+24 V), azul (0 V) e preto (saída).</p>
        <ul>
          <li><strong>PNP</strong>: quando detecta, a saída <strong>fornece +24 V</strong>. A carga (relé, entrada do CLP) fica entre a saída e o 0 V. É o padrão mais comum no Brasil e na Europa.</li>
          <li><strong>NPN</strong>: quando detecta, a saída <strong>liga ao 0 V</strong>. A carga fica entre o +24 V e a saída.</li>
        </ul>
        <div class="destaque alerta">Um sensor de 24 Vcc <strong>não aciona direto</strong> uma bobina de contator de 220 V. Usa-se um <strong>relé de interface</strong>
        (bobina 24 Vcc, contato para 220 V) ou a entrada de um CLP. Ligar 220 V no sensor queima o sensor na hora.</div>

        <h2>Teste rápido</h2>
        <details><summary>1. Que sensor usar para detectar uma garrafa PET passando numa esteira?</summary><p>Um sensor <strong>capacitivo</strong> ou <strong>fotoelétrico</strong>. O indutivo só detecta metal.</p></details>
        <details><summary>2. Um sensor PNP detectou a peça. O que aparece no fio preto?</summary><p><strong>+24 V</strong> (em relação ao 0 V).</p></details>
        <details><summary>3. Para que serve o diferencial de um pressostato?</summary><p>Para ele <strong>ligar e desligar em valores diferentes</strong> (ex.: 6 e 8 bar), evitando que o compressor fique ligando e desligando sem parar.</p></details>
      `
    },

    "6-2": {
      duracao: "13 min de leitura",
      texto: `
        <h2>Uma coisa depois da outra</h2>
        <p>Em muitas instalações, um motor <strong>só pode ligar se outro já estiver ligado</strong>. O exemplo clássico são esteiras em sequência: a esteira 2 joga
        material na esteira 1. Se a 2 ligar com a 1 parada, o material se acumula e entope tudo.</p>
        ${seg}

        <h2>Partida sequencial com permissão</h2>
        ${fig("cmd-sequencial", "Comando sequencial: a bobina de K2 só é energizada se o contato auxiliar de K1 estiver fechado", "O contato K1 43-44 em série com a bobina K2 é a permissão.")}
        <ul>
          <li>Um contato <strong>auxiliar NA de K1</strong> (43-44) fica em série com a bobina de K2. Sem K1 ligado, S2 não faz nada.</li>
          <li>Se K1 desligar por qualquer motivo, esse contato abre e <strong>K2 desliga junto</strong>.</li>
          <li>Os contatos dos dois relés térmicos (F7 e F8) ficam em série no começo do comando: a sobrecarga de qualquer motor <strong>para os dois</strong>.</li>
        </ul>
        <div class="destaque">Regra das esteiras: <strong>liga</strong> primeiro a que está no fim do caminho do material (a que descarrega) e vai voltando.
        Para <strong>desligar</strong>, faz o contrário: primeiro a que alimenta, depois as outras, para elas esvaziarem.</div>
        <p>Com um <strong>temporizador</strong>, a sequência pode ser automática: S1 liga K1 e um KT; depois de alguns segundos, o contato do KT liga K2.
        Isso também é usado para <strong>não ligar vários motores ao mesmo tempo</strong> e somar os picos de partida.</p>

        <h2>Bomba com boia e seletor Manual – 0 – Automático</h2>
        ${fig("cmd-boia", "Comando de bomba com seletor manual/automático, boia da caixa superior, boia da cisterna e relé falta de fase", "Seletor SA escolhe entre botões (manual) e boias (automático).")}
        <ul>
          <li><strong>Manual:</strong> funciona como uma partida direta comum, com S0, S1 e selo.</li>
          <li><strong>Automático:</strong> a bomba liga sozinha quando a <strong>caixa superior baixa</strong> (boia B1 fechada) e só se <strong>há água na cisterna</strong> (boia B2 fechada).
          Quando a caixa enche, B1 abre e a bomba para. Se a cisterna secar, B2 abre e protege a bomba de trabalhar a seco.</li>
          <li><strong>0:</strong> nenhum dos dois ramos alimenta a bobina.</li>
          <li>Relé térmico e relé de falta de fase (KFF) em série protegem nos dois modos.</li>
        </ul>
        <p>No modo automático não há selo: quem mantém a bomba ligada é a própria boia. Por isso a boia precisa de <strong>diferencial</strong> (liga em um nível, desliga em outro).</p>

        <h2>Teste rápido</h2>
        <details><summary>1. No comando sequencial, o operador aperta S2 com K1 desligado. O que acontece?</summary><p><strong>Nada</strong>: o contato K1 43-44 está aberto e a bobina de K2 não recebe energia.</p></details>
        <details><summary>2. Três esteiras levam material da 3 para a 2 e da 2 para a 1 (que descarrega). Qual a ordem de partida?</summary><p><strong>1, depois 2, depois 3</strong> (do fim do caminho para o começo).</p></details>
        <details><summary>3. No modo automático, por que a boia da cisterna fica em série com a da caixa superior?</summary><p>Para a bomba <strong>só ligar se houver água</strong> na cisterna, evitando trabalhar a seco.</p></details>
      `
    },

    "6-3": {
      duracao: "12 min de leitura",
      texto: `
        <h2>Proteções além do relé térmico</h2>
        <p>O relé térmico mede corrente e protege contra <strong>sobrecarga</strong>. Mas um motor pode queimar por outros motivos que o térmico não percebe bem:
        falta de uma fase, tensão muito baixa, fases invertidas, ventilação entupida, partidas demais. Para isso existem relés de proteção e monitoramento.</p>
        ${seg}

        <h2>Os principais</h2>
        <table>
          <tr><th>Relé</th><th>Protege contra</th><th>Onde é comum</th></tr>
          <tr><td>Falta de fase</td><td>Motor trabalhando com duas fases (aquece e queima)</td><td>Bombas, compressores, quase todo motor importante</td></tr>
          <tr><td>Sequência de fase</td><td>Fases invertidas (motor gira ao contrário)</td><td>Bombas, compressores de parafuso, elevadores, esteiras</td></tr>
          <tr><td>Sub e sobretensão</td><td>Tensão fora da faixa</td><td>Redes rurais ou fracas</td></tr>
          <tr><td>Assimetria</td><td>Tensões desequilibradas entre fases</td><td>Motores grandes</td></tr>
          <tr><td>PTC (termistor)</td><td>Temperatura alta DENTRO do motor</td><td>Motores com sensores PTC no enrolamento</td></tr>
          <tr><td>Nível (eletrodos)</td><td>Bomba trabalhando a seco</td><td>Poços, cisternas</td></tr>
        </table>
        <p>Muitos aparelhos juntam várias funções (falta, sequência, sub/sobretensão) num relé só, chamado de <strong>relé supervisor de rede</strong>.</p>

        <h2>Como entram no comando</h2>
        <p>Cada relé tem um <strong>contato de saída</strong> que fica <strong>fechado enquanto está tudo normal</strong>. Esse contato vai <strong>em série</strong> com a bobina
        do contator, junto com o 95-96 do térmico. Se aparece o problema, o contato abre e o motor para. Muitos têm um LED indicando o defeito.</p>
        <div class="destaque"><strong>Por que o PTC protege melhor em alguns casos?</strong> O térmico "estima" a temperatura pela corrente. Se o motor está com a
        <strong>ventilação entupida</strong> ou num ambiente muito quente, ele pode esquentar demais com corrente normal, e o térmico não percebe.
        O PTC fica dentro do enrolamento e mede a <strong>temperatura de verdade</strong>.</div>

        <h2>Relés de tempo multifunção</h2>
        <p>Além do retardo na energização (visto no módulo 1), relés modernos oferecem várias funções no mesmo aparelho: retardo na desenergização,
        <strong>cíclico</strong> (liga e desliga em intervalos, ex.: agitador), pulso único e estrela-triângulo. A função é escolhida por chave ou ponte de fio.</p>

        <h2>Teste rápido</h2>
        <details><summary>1. Um motor de bomba queimou porque um fusível de uma fase abriu e ele continuou girando. Que relé teria evitado?</summary><p>O relé de <strong>falta de fase</strong>.</p></details>
        <details><summary>2. Onde fica o contato do relé de proteção no comando?</summary><p><strong>Em série com a bobina</strong> do contator, como o 95-96 do relé térmico.</p></details>
        <details><summary>3. O motor esquenta muito porque a tampa da ventoinha está entupida, mas a corrente está normal. O que detecta isso?</summary><p>O <strong>PTC</strong> (termistor) no enrolamento, ligado a um relé PTC. O relé térmico não perceberia.</p></details>
      `
    },
    "7-1": {
      duracao: "13 min de leitura",
      texto: `
        <h2>Os fusíveis do painel</h2>
        <p>Nos comandos elétricos, a proteção contra <strong>curto-circuito</strong> da força costuma ser feita por fusíveis ou por disjuntor-motor (visto no módulo 1).
        Os dois tipos de fusível mais comuns em painéis brasileiros são o <strong>Diazed</strong> e o <strong>NH</strong>.</p>
        ${seg}

        <h2>Diazed (D)</h2>
        <ul>
          <li>Fusível de <strong>rosca</strong>, para correntes menores (de 2 A até cerca de 63 A, conforme o tamanho).</li>
          <li>Conjunto: <strong>base</strong>, <strong>parafuso de ajuste</strong> (anel que impede colocar fusível maior que o previsto), <strong>fusível</strong> e <strong>tampa</strong>.</li>
          <li>Tem um <strong>indicador de queima</strong> na ponta, com cor que identifica a corrente.</li>
          <li>Troca simples, com a tampa (sempre com o circuito desligado).</li>
        </ul>

        <h2>NH</h2>
        <ul>
          <li>Fusível de <strong>faca</strong>, para correntes maiores (de poucos ampères até mais de 1.000 A, conforme o tamanho 00, 1, 2, 3…).</li>
          <li>Alta <strong>capacidade de interrupção</strong> (dezenas de kA): aguenta abrir curtos muito fortes, comuns perto de transformadores.</li>
          <li>Troca com o <strong>punho saca-fusível</strong> e EPI. Nunca sob carga: o arco pode causar queimaduras graves.</li>
        </ul>

        <h2>Classes: para que serve cada fusível</h2>
        <table>
          <tr><th>Classe</th><th>Protege</th><th>Comentário</th></tr>
          <tr><td>gL / gG</td><td>Cabos e uso geral (sobrecarga e curto)</td><td>O mais comum. Retardado o suficiente para aguentar partidas curtas.</td></tr>
          <tr><td>aM</td><td>Motores (só curto-circuito)</td><td>Aguenta bem a partida. A sobrecarga fica por conta do relé térmico.</td></tr>
          <tr><td>aR / gR</td><td>Semicondutores (ultrarrápido)</td><td>Soft-starters, inversores, retificadores.</td></tr>
        </table>

        <h2>Como escolher para um motor</h2>
        <ol>
          <li>O fusível <strong>não pode queimar na partida</strong>: pela curva do fabricante, ele precisa aguentar a corrente de partida (Ip) durante o tempo de partida.</li>
          <li>Ele precisa <strong>proteger o contator e o relé térmico</strong>: os catálogos desses componentes informam o <strong>fusível máximo</strong> permitido. Não passe dele.</li>
          <li>E precisa proteger o <strong>cabo</strong> contra curto.</li>
        </ol>
        <div class="destaque">Por isso o fusível de motor quase sempre é <strong>bem maior</strong> que a corrente nominal (às vezes 2 a 3 vezes), e quem protege contra
        sobrecarga é o relé térmico. Cada um faz a sua parte: esse trabalho em conjunto se chama <strong>coordenação</strong>.</div>

        <h2>Teste rápido</h2>
        <details><summary>1. Para que serve o parafuso de ajuste do Diazed?</summary><p>Para <strong>impedir</strong> que se coloque um fusível de corrente maior que a prevista naquela base.</p></details>
        <details><summary>2. Um motor de 8,6 A tem fusíveis de 25 A. Isso está errado?</summary><p><strong>Não necessariamente</strong>: o fusível de motor precisa aguentar a partida e é escolhido pela curva e pelo fusível máximo do relé. A sobrecarga é com o relé térmico.</p></details>
        <details><summary>3. Que classe de fusível protege um soft-starter?</summary><p>Classe <strong>aR/gR (ultrarrápido)</strong>, para semicondutores.</p></details>
      `
    },

    "7-2": {
      duracao: "11 min de leitura",
      texto: `
        <h2>Por que um transformador só para o comando</h2>
        <p>Em painéis industriais, o comando raramente é ligado direto em 380 V. Usa-se um <strong>transformador de comando</strong> que baixa para 220 V, 110 V ou 24 Vca.</p>
        <ul>
          <li><strong>Segurança:</strong> tensão menor nos botões, sinaleiros e fiação que o operador e o mantenedor tocam.</li>
          <li><strong>Isolação:</strong> o comando fica separado da rede de força (enrolamentos separados).</li>
          <li><strong>Aterramento controlado:</strong> um lado do secundário é ligado ao terra. Assim, um fio de comando encostando na carcaça causa uma
          falta que <strong>queima o fusível</strong> do comando, em vez de ligar uma máquina sozinha.</li>
        </ul>
        ${seg}

        <h2>Dimensionamento: dois números</h2>
        <p>A bobina de um contator consome muito mais no instante em que <strong>fecha</strong> (potência de <strong>atração</strong>) do que depois de fechada
        (potência de <strong>retenção</strong>). A atração pode ser 6 a 10 vezes maior. Por isso o transformador é verificado em dois casos:</p>
        <ol>
          <li><strong>Regime:</strong> soma das potências de retenção de todas as bobinas que ficam ligadas juntas + sinaleiros + relés. O transformador precisa
          aguentar isso continuamente (potência nominal).</li>
          <li><strong>Pico:</strong> a maior bobina <strong>fechando</strong> (atração) enquanto as outras estão retidas. Os catálogos de transformadores de comando
          informam a <strong>potência instantânea</strong> (de pico) que eles aguentam sem a tensão cair demais.</li>
        </ol>
        <div class="destaque"><strong>Exemplo:</strong> três contatores (retenção 8 VA e atração 70 VA cada) e quatro sinaleiros de 1,5 W.<br>
        Regime: 3 × 8 + 4 × 1,5 = <strong>30 VA</strong>.<br>
        Pico (um contator fechando com os outros dois e os sinaleiros ligados): 70 + 2 × 8 + 6 = <strong>92 VA</strong>.<br>
        Escolhe-se um transformador com potência nominal ≥ 30 VA <strong>e</strong> potência instantânea ≥ 92 VA (por exemplo, um de 50 VA, conferindo no catálogo).</div>

        <h2>Proteção do transformador</h2>
        <ul>
          <li>Fusível (ou disjuntor) no <strong>primário</strong>, para curto no transformador.</li>
          <li>Fusível no <strong>secundário</strong> (o F21 dos nossos diagramas), dimensionado para o comando.</li>
          <li>Um lado do secundário <strong>aterrado</strong> e o fusível sempre no lado <strong>não aterrado</strong>.</li>
        </ul>
        <p>Comandos em <strong>24 Vcc</strong> (para sensores e CLP) usam uma <strong>fonte chaveada</strong> no lugar do transformador, com o mesmo raciocínio de potência.</p>

        <h2>Teste rápido</h2>
        <details><summary>1. Por que verificar o pico de potência, e não só o regime?</summary><p>Porque a bobina puxa <strong>muito mais potência ao fechar</strong> (atração). Se o transformador não aguentar, a tensão cai e o contator pode não fechar ou "trepidar".</p></details>
        <details><summary>2. Dois contatores (retenção 10 VA, atração 90 VA) e dois sinaleiros de 2 W. Qual o regime e o pico?</summary><p>Regime: 2 × 10 + 2 × 2 = <strong>24 VA</strong>. Pico: 90 + 10 + 4 = <strong>104 VA</strong>.</p></details>
        <details><summary>3. Em qual lado do secundário fica o fusível de comando?</summary><p>No lado <strong>não aterrado</strong>.</p></details>
      `
    },

    "7-3": {
      duracao: "15 min de leitura",
      texto: `
        <h2>Juntando tudo: dimensionar uma partida</h2>
        <p>Nesta aula fechamos o curso dimensionando os componentes de duas partidas. O roteiro é sempre o mesmo, e os valores finais vêm sempre dos
        <strong>catálogos do fabricante</strong> escolhido.</p>
        ${seg}

        <h2>O roteiro</h2>
        <ol>
          <li><strong>Dados do motor</strong> (placa): potência, tensão, In, Ip/In, fator de serviço, tempo de partida da carga.</li>
          <li><strong>Contatores:</strong> categoria AC-3, corrente ≥ à que passa por cada um.</li>
          <li><strong>Relé térmico:</strong> faixa de ajuste que contenha a corrente que passa por ele.</li>
          <li><strong>Fusíveis ou disjuntor-motor:</strong> aguentam a partida e não passam do máximo indicado para o relé/contator.</li>
          <li><strong>Cabos:</strong> capacidade com folga (muitos projetistas usam 1,25 × In para circuito de um motor), agrupamento e queda de tensão, conforme a NBR 5410.</li>
          <li><strong>Comando:</strong> transformador, fusível de comando, botões, sinaleiros e temporizadores.</li>
        </ol>

        <h2>Exemplo 1: partida direta</h2>
        <p>Motor de 3 cv, 220 V, In = 8,6 A, Ip/In = 7,5 (o mesmo dos módulos anteriores).</p>
        <table>
          <tr><th>Componente</th><th>Conta</th><th>Escolha (exemplo)</th></tr>
          <tr><td>Contator K1</td><td>AC-3 ≥ 8,6 A</td><td>9 A (ou 12 A para partidas frequentes)</td></tr>
          <tr><td>Relé térmico F7</td><td>faixa contendo 8,6 A</td><td>faixa 7 a 10 A, ajustado em 8,6 A</td></tr>
          <tr><td>Corrente de partida</td><td>7,5 × 8,6</td><td>≈ 65 A por poucos segundos</td></tr>
          <tr><td>Fusíveis F1-F3</td><td>aguentar ≈ 65 A na partida e ≤ máximo do relé</td><td>pela curva do fabricante (algo na faixa de 20 a 25 A gL)</td></tr>
          <tr><td>Cabo</td><td>1,25 × 8,6 ≈ 10,8 A</td><td>2,5 mm² (verificar agrupamento e queda de tensão)</td></tr>
        </table>

        <h2>Exemplo 2: estrela-triângulo</h2>
        <p>Motor de 10 cv, 220/380 V, ligado em rede de 220 V, In = 26 A (o exemplo do módulo 3).</p>
        <table>
          <tr><th>Componente</th><th>Corrente</th><th>Escolha (exemplo)</th></tr>
          <tr><td>K1 (rede) e K2 (triângulo)</td><td>0,58 × 26 ≈ 15,1 A</td><td>18 A em AC-3</td></tr>
          <tr><td>K3 (estrela)</td><td>0,33 × 26 ≈ 8,6 A</td><td>9 A em AC-3</td></tr>
          <tr><td>Relé térmico (depois de K1)</td><td>0,58 × 26 ≈ 15,1 A</td><td>faixa contendo 15,1 A</td></tr>
          <tr><td>Cabos até o motor (6 fios)</td><td>passam ≈ 15,1 A cada</td><td>dimensionar pela corrente de fase, não pela de linha</td></tr>
        </table>
        <div class="destaque">Na estrela-triângulo os seis cabos até o motor levam a <strong>corrente de fase</strong> (0,58 × In), por isso podem ser mais finos do que
        se fossem três cabos levando a corrente de linha. Mas o cabo que chega ao painel leva a corrente total (In).</div>

        <h2>Teste rápido</h2>
        <details><summary>1. Que categoria de emprego se usa para escolher o contator de um motor de gaiola?</summary><p><strong>AC-3</strong>.</p></details>
        <details><summary>2. Na estrela-triângulo de um motor de 40 A, qual a corrente do contator de estrela (K3)?</summary><p>0,33 × 40 ≈ <strong>13,2 A</strong>.</p></details>

        <h2>Desafio final</h2>
        <p>Dimensione a partida direta de um motor de 7,5 cv, 380 V, com In = 11,3 A e Ip/In = 7: contator, faixa do relé térmico, corrente de partida e o critério dos fusíveis e do cabo.</p>
        <details><summary>Ver resposta</summary><p>Contator <strong>AC-3 ≥ 11,3 A</strong> (12 A, ou 18 A com folga). Relé térmico com faixa contendo 11,3 A (ex.: 9 a 13 A), ajustado em 11,3 A.
        Corrente de partida ≈ 7 × 11,3 ≈ <strong>79 A</strong>. Fusíveis escolhidos pela curva para aguentar ≈ 79 A durante o tempo de partida e sem passar do
        fusível máximo do relé (consulte o catálogo). Cabo: 1,25 × 11,3 ≈ 14,1 A → <strong>2,5 mm²</strong> atende em 3 condutores carregados (método B1: 21 A), conferindo agrupamento e queda de tensão.</p></details>
      `
    }
  };
})();
