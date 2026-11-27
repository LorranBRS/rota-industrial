/*
 * Alternativas dos "Testes rápidos" (múltipla escolha).
 * A pergunta e a explicação vêm do próprio texto da aula (os <details> numerados).
 * Aqui ficam só as alternativas, na MESMA ORDEM das perguntas da aula.
 * A PRIMEIRA alternativa é sempre a correta (o site embaralha na hora de mostrar).
 */
window.ROTA_QUIZ = {
  "matematica-eletricistas": {
    "1-1": [["Inteiros (ℤ)", "Naturais (ℕ)", "Irracionais", "Só os reais (ℝ)"], ["Irracional", "Racional", "Inteiro", "Natural"]],
    "1-2": [["3,14", "3,1", "3,142", "3,15"], ["10,00", "9,99", "9,10", "10,10"], ["Não: escolher o próximo acima (32 A) e conferir o cabo", "Sim, a diferença é pequena", "Sim, se o cabo for de 4 mm²", "Não: escolher um de 20 A"]],
    "1-3": [["3/4", "2/6", "1/3", "2/4"], ["12,7 mm", "5 mm", "25,4 mm", "15 mm"], ["2 Ω", "8 Ω", "1/2 Ω", "4 Ω"]],
    "2-1": [["64", "12", "81", "43"], ["2 A", "4 A", "0,25 A", "25 A"], ["0,01", "−100", "0,1", "−20"]],
    "2-2": [["2,2 × 10⁵", "22 × 10³", "2,2 × 10⁴", "2,2 × 10⁶"], ["2", "20", "0,2", "200"]],
    "2-3": [["500 kΩ", "50 kΩ", "5.000 kΩ", "0,5 kΩ"], ["0,075 A", "0,75 A", "7,5 A", "0,0075 A"], ["18 kW", "1,8 kW", "180 kW", "0,18 kW"]],
    "3-1": [["≈ 9,17", "≈ 0,11", "196", "≈ 5,28"], ["4 m", "40 cm", "40 m", "1 m"], ["Inversamente", "Diretamente", "Não têm relação", "Depende da tensão"]],
    "3-2": [["216 W", "180 W", "108 W", "240 W"], ["1.200 rpm", "2.700 rpm", "1.800 rpm", "900 rpm"]],
    "3-3": [["75", "25", "7,5", "83"], ["198 Ω a 242 Ω", "210 Ω a 230 Ω", "200 Ω a 240 Ω", "220 Ω a 242 Ω"], ["≈ 1,58 %", "≈ 6 %", "≈ 0,16 %", "≈ 2,7 %"]],
    "4-1": [["R = U² / P", "R = P / U²", "R = P · U²", "R = √(P / U)"], ["t = E / P", "t = P / E", "t = E · P", "t = E − P"], ["≈ 220 V", "≈ 127 V", "≈ 10.200 V", "≈ 380 V"]],
    "4-2": [["3", "2", "4", "5"], ["47 A", "46,808 A", "46,8 A", "50 A"], ["Valor acima da escala (ou circuito aberto em Ω)", "Bateria fraca", "Curto-circuito", "Ponteiras invertidas"]]
  },

  "fundamentos-eletricidade": {
    "1-1": [["Os elétrons livres", "Os prótons", "Os nêutrons", "O núcleo inteiro do átomo"], ["Positiva", "Negativa", "Neutra", "Depende do material"], ["Tem muitos elétrons livres: é ótimo condutor", "É o metal mais barato que existe", "Não oxida nunca", "É isolante e não dá choque"]],
    "1-2": [["No atrito", "No contato", "Em nenhum: sempre ficam iguais", "Na ligação à terra"], ["Escoar a carga do corpo para o terra e evitar descarga nos componentes", "Proteger contra choque de 220 V", "Aumentar a carga estática do corpo", "Medir a tensão da placa"]],
    "1-3": [["Fica 9 vezes menor", "Fica 3 vezes menor", "Fica 9 vezes maior", "Não muda"], ["N/C ou V/m", "Coulomb (C)", "Ampère (A)", "Watt (W)"]],
    "1-4": [["220 V", "0 V", "110 V", "440 V"], ["Não: a DDP é zero", "Sim, 127 V", "Sim, 254 V", "Sim, mas pouca"]],
    "2-1": [["Indução eletromagnética", "Atrito", "Reação química", "Efeito fotoelétrico"], ["O termopar", "A fotocélula", "A pilha", "O cristal piezoelétrico"]],
    "2-2": [["60 Hz", "50 Hz", "127 Hz", "220 Hz"], ["Porque o transformador muda o nível de tensão", "Porque CA não dá choque", "Porque CA não tem perdas", "Porque as baterias geram CA"]],
    "3-1": [["3 A", "300 A", "0,33 A", "20 A"], ["O efeito magnético", "O efeito térmico (Joule)", "O efeito químico", "O efeito luminoso"]],
    "3-2": [["Em paralelo", "Em série", "Tanto faz", "Em série, com o circuito desligado"], ["13.800 V", "1.380 V", "138.000 V", "138 V"]],
    "3-3": [["Menos", "Mais", "A mesma", "Depende da tensão"], ["4.700 Ω", "470 Ω", "47.000 Ω", "0,0047 Ω"]],
    "3-4": [["Resistividade muito baixa e custo viável", "É o melhor condutor que existe", "É o metal mais leve", "Não precisa de isolação"], ["A tensão de isolamento do cabo", "A seção do cabo em mm²", "A corrente máxima em kA", "A resistência por km"]],
    "4-1": [["0,24 A", "2,4 A", "4,17 A", "2.400 A"], ["63,5 Ω", "254 Ω", "129 Ω", "0,016 Ω"], ["9,4 V", "23,5 V", "9.400 V", "0,94 V"]],
    "4-2": [["≈ 2,29 Ω", "≈ 0,23 Ω", "≈ 22,9 Ω", "≈ 5,16 Ω"], ["Fica 4 vezes menor", "Fica 4 vezes maior", "Fica 7,5 vezes menor", "Não muda"]],
    "5-1": [["10 kΩ ±5 %", "103 Ω ±5 %", "1 kΩ ±5 %", "100 kΩ ±10 %"], ["O termistor (PTC/NTC)", "O resistor de fio", "O potenciômetro", "O LDR"]],
    "5-2": [["0,2 A", "0,3 A", "0,6 A", "5 A"], ["20 V", "10 V", "15 V", "30 V"]],
    "5-3": [["60 Ω", "960 Ω", "240 Ω", "120 Ω"], ["8 Ω", "50 Ω", "25 Ω", "4 Ω"]],
    "5-4": [["2 A", "0,64 A", "1 A", "7 A"], ["1 A", "2 A", "0,5 A", "1,4 A"]],
    "6-1": [["10 A", "100 A", "1 A", "0,1 A"], ["3.680 W", "5.000 W", "4.000 W", "736 W"]],
    "6-2": [["336 kWh", "336.000 kWh", "11,2 kWh", "44,8 kWh"], ["kW é potência; kWh é energia", "São a mesma coisa", "kWh é potência por hora", "kW é energia; kWh é potência"]],
    "6-3": [["9 vezes", "3 vezes", "6 vezes", "Não muda"], ["O fusível", "O DPS", "O interruptor", "O capacitor"]],
    "6-4": [["80 %", "125 %", "96 %", "24 %"], ["24 W", "96 W", "216 W", "120 W"]],
    "7-1": [["No COM", "No borne de V/Ω", "No borne de 10 A", "No borne de mA"], ["CAT III", "CAT I", "CAT II", "Qualquer uma"]],
    "7-2": [["As correntes têm sentidos opostos e os campos se cancelam", "O alicate está com defeito", "Não há corrente no circuito", "O neutro está aberto"], ["Sobrecarga: investigar carga, tensão e rolamentos", "Funcionamento normal", "Motor com pouca carga", "Falta de neutro"]]
  },

  "analise-circuitos-cc": {
    "1-1": [["8 A", "4 A", "12 A", "3 A"], ["A corrente tem sentido oposto ao desenhado", "A conta está errada", "A fonte está invertida: refazer", "A corrente não existe"]],
    "1-2": [["14 V", "10 V", "24 V", "34 V"], ["2 A", "4 A", "3 A", "1 A"]],
    "1-3": [["Três", "Duas", "Uma", "Seis"], ["36 W", "12 W", "27 W", "9 W"]],
    "2-1": [["Três", "Duas", "Quatro", "Uma"], ["Ib circularia no sentido anti-horário", "O circuito estaria errado", "Ib seria 1 A no sentido horário", "Nada mudaria"]],
    "2-2": [["Substituindo por um curto-circuito", "Deixando o ramo aberto", "Trocando por um resistor de 1 Ω", "Invertendo a polaridade"], ["Porque P = R·I² não é linear", "Porque as fontes são diferentes", "Porque a potência é sempre zero", "Pode somar, não há problema"]],
    "3-1": [["5 A", "15 A", "7,5 A", "3 A"], ["0,06 Ω", "0,6 Ω", "1,26 Ω", "6 Ω"]],
    "3-2": [["IN = 6 A, RN = 4 Ω", "IN = 96 A, RN = 4 Ω", "IN = 6 A, RN = 0,25 Ω", "IN = 24 A, RN = 4 Ω"], ["Deixando o ramo aberto", "Substituindo por um curto-circuito", "Invertendo o sentido", "Dobrando a corrente"]],
    "4-1": [["1.000 Ω", "250 Ω", "4.000 Ω", "500 Ω"], ["Que a ponte está equilibrada", "Que a ponte está em curto", "Que o galvanômetro queimou", "Que Rx é infinito"]],
    "4-2": [["RL = 2 Ω; P = 18 W", "RL = 2 Ω; P = 72 W", "RL = 0 Ω; P = 72 W", "RL = 4 Ω; P = 16 W"], ["O rendimento seria de só 50 %", "Porque é proibido por norma", "Porque as cargas são indutivas", "Porque a tensão cairia a zero"]]
  },

  "instalacoes-residenciais": {
    "1-1": [["8,96 m² e 12,0 m", "8,96 m² e 6,0 m", "6,0 m² e 12,0 m", "12,0 m² e 8,96 m"], ["4 m", "40 cm", "8 m", "1,6 m"]],
    "1-2": [["160 VA", "100 VA", "220 VA", "120 VA"], ["4 tomadas, 1.900 VA", "4 tomadas, 2.400 VA", "5 tomadas, 2.000 VA", "3 tomadas, 1.800 VA"]],
    "1-3": [["Não obrigatoriamente (6,8 A), mas é boa prática", "Sim, sempre", "Não, nunca", "Sim, porque passa de 10 A"], ["Não: iluminação e tomadas em circuitos separados", "Sim, se for LED", "Sim, até 1.000 VA", "Sim, se o cabo for de 2,5 mm²"]],
    "2-1": [["19,2 A", "24 A", "16,8 A", "30 A"], ["2,5 mm²", "1,5 mm²", "4 mm²", "1,0 mm²"]],
    "2-2": [["20 A", "16 A", "25 A", "32 A"], ["Curva C", "Curva B", "Curva D", "Tanto faz"]],
    "2-3": [["Não: protege contra fuga (salvo o DDR, com disjuntor)", "Sim, contra qualquer sobrecarga", "Sim, até 30 A", "Sim, se for tetrapolar"], ["Para o terra", "Para o neutro", "Para a fase", "Para o disjuntor"]],
    "3-1": [["A fase", "O neutro", "O terra", "O neutro e o terra"], ["Não: só dentro de caixas", "Sim, com fita isolante", "Sim, se for cabo de cobre", "Sim, em eletroduto rígido"]],
    "3-2": [["Dois", "Três", "Um", "Quatro"], ["Dois", "Um", "Três", "Quatro"]],
    "3-3": [["3", "1", "2", "5"], ["Não: barramentos separados (TN-S)", "Sim, sempre", "Sim, se o quadro for metálico", "Sim, se o cabo for verde"]],
    "3-4": [["Somente no BEP, na entrada", "Em cada tomada", "Em cada quadro", "Em nenhum ponto"], ["2,5 mm²", "1,5 mm²", "1,0 mm²", "4 mm²"]],
    "4-1": [["O megômetro", "O alicate amperímetro", "O wattímetro", "O terrômetro"], ["Para não danificá-los nem falsear a medição", "Para economizar energia", "Porque o megômetro não liga", "Não é preciso desconectar"]]
  },

  "instalacoes-comerciais": {
    "1-1": [["220 V", "127 V", "380 V", "110 V"], ["≈ 22,8 A", "≈ 39,5 A", "≈ 13,2 A", "≈ 68,2 A"], ["As três correntes, defasadas de 120°, se anulam", "O neutro tem resistência maior", "O neutro é mais grosso", "Os disjuntores bloqueiam o neutro"]],
    "1-2": [["1.500 VA na B e 1.500 VA na C", "3.000 VA em cada uma", "3.000 VA só na B", "1.000 VA em cada uma das três"], ["≈ 33,1 A", "≈ 19,1 A", "≈ 57,3 A", "≈ 42,0 A"]],
    "1-3": [["A norma da concessionária, pela categoria de atendimento", "O eletricista, pela experiência", "O cliente, conforme o orçamento", "O fabricante do medidor"], ["Não, sem pedir aumento de carga à concessionária", "Sim, se o cabo aguentar", "Sim, a qualquer momento", "Sim, até 63 A"]],
    "2-1": [["10 luminárias", "9 luminárias", "16 luminárias", "5 luminárias"], ["Para as cores aparecerem fiéis", "Para gastar menos energia", "Para esquentar menos", "Para a lâmpada durar mais"]],
    "2-2": [["8,2 A", "18 A", "81,8 A", "5,3 A"], ["Harmônicas de 3ª ordem somadas no neutro", "Mau contato nas tomadas", "Excesso de luminárias", "Falta de aterramento"]],
    "2-3": [["Não é recomendado: usar septo divisor ou calhas separadas", "Sim, sem problema", "Sim, desde que a calha seja metálica", "Sim, se a calha for de PVC"], ["Não: ela é aterrada, mas o PE segue com cada circuito", "Sim, sempre", "Sim, se for galvanizada", "Sim, nos circuitos de iluminação"]],
    "3-1": [["0,80", "1,25", "0,20", "0,92"], ["≈ 13,7 kvar", "≈ 30 kvar", "≈ 26,5 kvar", "≈ 5,2 kvar"]],
    "3-2": [["O aquecimento vem da corrente passando pelo defeito", "A câmera precisa de tensão para funcionar", "Para gastar menos bateria", "Não precisa de carga"], ["Baixa emissividade: o metal polido engana a câmera", "A câmera está descalibrada", "O barramento está mesmo frio", "Excesso de corrente"]]
  },

  "comandos-eletricos": {
    "1-1": [["NA", "NF", "Temporizado", "Contato de força"], ["Serve (9 A ≥ 8,6 A), mas uma folga é bem-vinda", "Não, precisa ser de 25 A", "Não, precisa ser de 8,6 A exatos", "Só serve em AC-1"], ["O botão não aguenta a corrente nem permite intertravamentos", "Porque o motor giraria ao contrário", "Porque o botão gasta mais energia", "Pode ligar direto sem problema"]],
    "1-2": [["Não: antes, descobrir a causa", "Sim, é só rearmar e ligar", "Sim, depois de aumentar o ajuste", "Sim, quando o motor esfriar"], ["O motor fica sem proteção contra sobrecarga", "Nenhum, é uma boa folga", "O motor não parte", "O relé desarma mais cedo"], ["O 95-96 (NF)", "O 97-98 (NA)", "O 13-14 (NA)", "O 1-2 (força)"]],
    "1-3": [["NF, com trava mecânica", "NA, com retorno por mola", "NA, com trava", "NF, sem trava"], ["Retardo na energização, 5 s", "Retardo na desenergização, 5 s", "Cíclico, 5 s", "Estrela-triângulo"]],
    "2-1": [["Depende: é NF e abre quando K2 liga", "Sim, sempre fechado", "Não, sempre aberto", "Só se K2 estiver com defeito"], ["O relé térmico", "O fusível de comando", "O botão de emergência", "O temporizador"]],
    "2-2": [["No comando, em série com a bobina", "Na força, em série com o motor", "No comando, em paralelo com o selo", "Na força, em paralelo"], ["Menos risco de choque e uso direto de sensores e CLP", "Gasta menos cobre na força", "Aumenta a potência do motor", "Porque o contator não aceita 220 V"]],
    "2-3": [["O selo (13-14) não funciona", "O relé térmico desarmou", "Um fusível de força queimou", "Falta uma fase no motor"], ["Em série, com contatos NF", "Em paralelo, com contatos NA", "Em paralelo, com contatos NF", "Em série, com contatos NA"], ["O contator cai e o selo abre: é preciso apertar S1 de novo", "O relé térmico bloqueia a volta", "O fusível queima na volta", "Ele não evita"]],
    "3-1": [["Erros aparecem sem risco de partida inesperada ou curto", "Porque a força é mais cara", "Porque o comando gasta mais", "Não há diferença na ordem"], ["≈ 52 a 69 A", "≈ 8,6 A", "≈ 17 A", "≈ 260 A"]],
    "3-2": [["Trocar duas fases, com tudo desligado e bloqueado", "Trocar as três fases", "Inverter o neutro", "Inverter a bobina do contator"], ["Redundância contra curto entre fases", "Para o motor girar mais rápido", "Para economizar contatos", "Porque um só não funciona"], ["S2, o selo de K2, o K1 21-22 e a bobina de K2", "Só o relé térmico", "Só os fusíveis de força", "O sentido de giro do motor"]],
    "3-3": [["Não: em 380 V ele precisa trabalhar em estrela", "Sim, sem restrição", "Sim, se o tempo for curto", "Sim, com o relé em 15 A"], ["Um pico de corrente quase igual ao da partida direta", "O motor não parte", "O motor fica mais econômico", "Nada muda"], ["Garantir que K3 abriu e o arco se apagou", "Para o motor esfriar", "Para o temporizador zerar", "Para economizar energia"]],
    "3-4": [["Inversor", "Soft-starter", "Estrela-triângulo", "Partida direta"], ["Os capacitores do barramento CC ainda guardam tensão", "O motor ainda gira por inércia", "O display demora a apagar", "Não precisa esperar"]],
    "4-1": [["Falta de fase", "Sobrecarga leve", "Tensão alta", "Relé térmico desajustado"], ["Investigar a carga mecânica: o motor está sobrecarregado", "Aumentar o ajuste do relé para 11 A", "Trocar o relé por um maior", "Ignorar, é normal"]],
    "5-1": [["Cerca de 64 %", "Cerca de 80 %", "Cerca de 42 %", "Cerca de 25 %"], ["A rede entraria em curto pelo autotransformador", "O motor giraria ao contrário", "O autotransformador desligaria sozinho", "Não há problema nenhum"], ["Compensadora", "Estrela-triângulo", "Dahlander", "Série-paralelo"]],
    "5-2": [["Cerca de 1/4 (25 %)", "Cerca de 1/3 (33 %)", "Cerca de 1/2 (50 %)", "Não muda"], ["Não: o conjugado de partida cai para cerca de 25 %", "Sim, é a melhor para carga pesada", "Sim, porque a corrente cai", "Só se o motor tiver 6 pontas"]],
    "5-3": [["1.800 e 3.600 rpm", "900 e 1.800 rpm", "1.200 e 3.600 rpm", "1.800 e 2.400 rpm"], ["Ficam unidos entre si (centro da dupla estrela)", "Recebem L1, L2 e L3", "Ficam livres e isolados", "Vão para o terra"], ["A corrente nominal é diferente em cada velocidade", "Para ter um de reserva", "Porque a norma exige dois em todo motor", "Um é de sobrecarga e outro de curto"]],
    "5-4": [["As molas aplicam o freio", "O freio solta", "O motor acelera", "Nada muda"], ["Para limitar o tempo da CC e não aquecer o motor parado", "Para inverter o sentido de giro", "Para ligar o motor de novo", "Porque o retificador queima sem ele"], ["Começar a girar no sentido contrário", "Não frear nada", "Queimar o fusível de comando", "Ficar travado para sempre"]],
    "6-1": [["Capacitivo ou fotoelétrico", "Indutivo", "Pressostato", "Termostato"], ["+24 V", "0 V", "220 V", "Nada, fica desligado"], ["Ligar e desligar em valores diferentes, sem ficar ligando sem parar", "Aumentar a pressão máxima", "Proteger contra curto-circuito", "Medir a corrente do motor"]],
    "6-2": [["Nada: K1 43-44 está aberto", "K2 liga normalmente", "K1 liga junto", "O relé térmico desarma"], ["1, depois 2, depois 3", "3, depois 2, depois 1", "Todas juntas", "2, depois 1, depois 3"], ["Para a bomba só ligar se houver água na cisterna", "Para a bomba ligar mais rápido", "Para economizar energia", "Para substituir o relé térmico"]],
    "6-3": [["Relé de falta de fase", "Relé de tempo", "Relé de nível", "Disjuntor de comando"], ["Em série com a bobina do contator", "Em paralelo com o botão liga", "No circuito de força", "Em paralelo com a bobina"], ["O PTC no enrolamento (com relé PTC)", "O relé térmico", "O fusível NH", "O relé de sequência de fase"]],
    "7-1": [["Impedir que se coloque um fusível maior que o previsto", "Ajustar a corrente de queima", "Indicar que o fusível queimou", "Prender a tampa"], ["Não necessariamente: ele é escolhido pela partida e pelo máximo do relé", "Sim, devia ser de 10 A", "Sim, devia ser de 8,6 A", "Sim, fusível nunca passa da corrente nominal"], ["aR / gR (ultrarrápido)", "gL / gG", "aM", "Qualquer Diazed"]],
    "7-2": [["A bobina puxa muito mais ao fechar (atração)", "O transformador esquenta mais à noite", "Os sinaleiros dobram de consumo", "Não precisa: só o regime importa"], ["Regime 24 VA e pico 104 VA", "Regime 104 VA e pico 24 VA", "Regime 20 VA e pico 180 VA", "Regime 24 VA e pico 24 VA"], ["No lado não aterrado", "No lado aterrado", "Nos dois lados, sempre", "Só no primário"]],
    "7-3": [["AC-3", "AC-1", "DC-1", "AC-15"], ["≈ 13,2 A", "≈ 23,2 A", "≈ 40 A", "≈ 6,6 A"]]
  },

  "motores-eletricos": {
    "1-1": [["1.200 rpm", "1.800 rpm", "3.600 rpm", "1.150 rpm"], ["900 rpm", "1.800 rpm", "450 rpm", "1.200 rpm"]],
    "1-2": [["≈ 2,8 %", "≈ 97,2 %", "≈ 1,4 %", "≈ 5,6 %"], ["A corrente no rotor é induzida pelo campo do estator", "Porque ele gira devagar", "Porque o rotor é um ímã permanente", "Porque usa capacitor"], ["≈ 11,3 A", "≈ 8,4 A", "≈ 19,6 A", "≈ 14,5 A"]],
    "1-3": [["O capacitor", "O rolamento", "O fusível", "A chave de velocidade"], ["Sim: mesma capacitância e tensão maior", "Não, tem que ser de 250 V", "Sim, e qualquer µF serve", "Não, tem que ser de 20 µF"]],
    "2-1": [["5,0 A", "8,6 A", "13,6 A", "5,75 A"], ["Sim, com jatos d'água comuns", "Não, só em local seco", "Sim, até submerso", "Só com capa de proteção"], ["37,5 A", "7,5 A", "12,5 A", "64,5 A"]],
    "2-2": [["Estrela, unindo 4-5-6", "Triângulo: 1-6, 2-4, 3-5", "Estrela, unindo 1-2-3", "Triângulo duplo"], ["L1 em 1-12, L2 em 2-10, L3 em 3-11; unir 4-7, 5-8 e 6-9", "Unir 4-5-6 e 10-11-12", "Unir 1-7, 2-8 e 3-9", "Unir todas as pontas pares"], ["Fica entre fase e centro da estrela: recebe V ÷ √3", "Porque a corrente é maior", "Porque a estrela tem mais fios", "Não recebe menos tensão"]]
  },

  "seguranca-eletricidade": {
    "1-1": [["Desliga com fuga de até 30 mA, antes da faixa de fibrilação provável", "É a corrente nominal das tomadas", "Abaixo de 30 mA não existe fuga", "Para proteger contra sobrecarga"], ["≈ 220 mA: risco grave de fibrilação", "≈ 0,22 mA: só formigamento", "≈ 22 mA: só um susto", "≈ 2,2 A: só queimadura leve"]],
    "1-2": [["Não: o arco atinge quem está perto", "Sim, se não tocar em nada", "Sim, se estiver de botina", "Sim, a mais de 50 cm"], ["Fibras sintéticas derretem e grudam na pele", "Porque esquenta demais", "Porque conduz eletricidade", "Não há problema algum"]],
    "1-3": [["Mau contato ou tomada subdimensionada", "Umidade na parede", "Tensão da rede baixa", "Excesso de aterramento"], ["CO₂ ou pó (BC/ABC)", "Água", "Espuma", "Água em jato fino"]],
    "2-1": [["Não: quem isola é a luva de borracha", "Sim, a luva de couro já isola", "Sim, se o furo for pequeno", "Sim, em baixa tensão"], ["Protege todos e não depende de cada um usar certo", "Porque é mais barato", "Porque o EPI é proibido", "Porque a NR-6 só aceita EPC"]],
    "2-2": [["Só com teste antes e depois e os demais passos cumpridos", "Sim, se o detector não apitou", "Sim, se o disjuntor estiver desligado", "Sim, depois de 5 minutos"], ["Protege contra religação, tensão induzida e carga residual", "Serve só para medir a tensão", "Para acelerar a religação", "Não serve se o circuito já está desligado"]],
    "2-3": [["Três, um de cada, numa garra múltipla", "Um, do encarregado", "Dois", "Nenhum, basta a etiqueta"], ["Não: a etiqueta avisa, o cadeado impede", "Sim, se for vermelha", "Sim, se tiver o nome do responsável", "Sim, em baixa tensão"]],
    "3-1": [["Desligar; se não der, afastar com objeto seco e isolante", "Puxar o colega pelo braço", "Jogar água para ele soltar", "Esperar o SAMU sem fazer nada"], ["Não, sem avaliação médica", "Sim, se não houver queimadura", "Sim, depois de beber água", "Sim, porque foi em 127 V"]]
  }
};
