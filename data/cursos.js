/*
 * Catálogo da Rota Industrial.
 * Para adicionar um curso: copie um objeto do array "cursos", mude o id
 * (sem espaços/acentos) e preencha os campos. A página curso.html?id=<id>
 * passa a funcionar automaticamente.
 *
 * status do curso: "disponivel" | "em-breve"
 * setor: "industrial" | "residencial" | "comercial"
 */
window.ROTA = {
  areas: [
    {
      id: "eletrica",
      nome: "Elétrica",
      icone: "⚡",
      ativa: true,
      descricao: "Da eletricidade básica aos comandos industriais: instalações, segurança e manutenção."
    },
    {
      id: "automacao",
      nome: "Automação",
      icone: "🤖",
      ativa: false,
      descricao: "CLP, sensores, inversores de frequência e redes industriais."
    },
    {
      id: "refrigeracao",
      nome: "Refrigeração e Climatização",
      icone: "❄️",
      ativa: false,
      descricao: "Ar-condicionado split, câmaras frias e sistemas comerciais."
    },
    {
      id: "mecanica",
      nome: "Manutenção Mecânica",
      icone: "⚙️",
      ativa: false,
      descricao: "Rolamentos, lubrificação, alinhamento e manutenção preventiva."
    }
  ],

  setores: [
    { id: "residencial", nome: "Residencial", descricao: "Casas e apartamentos: tomadas, iluminação, quadros de distribuição." },
    { id: "comercial", nome: "Comercial", descricao: "Lojas, escritórios e prédios: cargas maiores, iluminação e projetos." },
    { id: "industrial", nome: "Industrial", descricao: "Fábricas: motores, comandos elétricos, painéis e automação." }
  ],

  cursos: [
    {
      id: "matematica-eletricistas",
      area: "eletrica",
      setores: ["residencial", "comercial", "industrial"],
      titulo: "Matemática para Eletricistas",
      nivel: "Iniciante",
      cargaHoraria: "10h",
      status: "disponivel",
      resumo: "A matemática que o eletricista usa de verdade: decimais, frações, potências, prefixos (k, m, µ), regra de três e porcentagem.",
      modulos: [
        { titulo: "Números e operações", aulas: ["Conjuntos numéricos", "Números decimais e arredondamento", "Frações na prática"] },
        { titulo: "Potências e prefixos", aulas: ["Potenciação e radiciação", "Notação científica", "Prefixos do SI: quilo, mega, mili, micro"] },
        { titulo: "Proporções", aulas: ["Razão e proporção", "Regra de três simples", "Porcentagem"] },
        { titulo: "Fórmulas e medições", aulas: ["Isolando uma variável na fórmula", "Algarismos significativos na leitura de instrumentos"] }
      ]
    },
    {
      id: "fundamentos-eletricidade",
      area: "eletrica",
      setores: ["residencial", "comercial", "industrial"],
      titulo: "Fundamentos de Eletricidade",
      nivel: "Iniciante",
      cargaHoraria: "20h",
      status: "disponivel",
      resumo: "Da carga elétrica à potência: tensão, corrente, resistência, Leis de Ohm, circuitos série/paralelo e energia.",
      modulos: [
        { titulo: "Origem da eletricidade", aulas: ["Átomo, elétrons e carga elétrica", "Eletrização dos corpos", "Lei de Coulomb e campo elétrico", "Potencial elétrico e diferença de potencial (DDP)"] },
        { titulo: "Geração de energia elétrica", aulas: ["Fontes de tensão: química, magnética, térmica, mecânica, luminosa e pressão", "Corrente contínua x alternada"] },
        { titulo: "Grandezas fundamentais", aulas: ["Corrente elétrica", "Tensão elétrica", "Resistência elétrica", "Condutores e isolantes"] },
        { titulo: "Leis de Ohm", aulas: ["Primeira Lei de Ohm", "Segunda Lei de Ohm"] },
        { titulo: "Circuitos elétricos", aulas: ["Resistores", "Circuito em série", "Circuito em paralelo", "Circuito misto"] },
        { titulo: "Potência e energia", aulas: ["Potência elétrica", "Energia elétrica e consumo (kWh)", "Efeito Joule", "Rendimento"] },
        { titulo: "Instrumentos de medição", aulas: ["Multímetro: como usar com segurança", "Alicate amperímetro"] }
      ]
    },
    {
      id: "seguranca-eletricidade",
      area: "eletrica",
      setores: ["residencial", "comercial", "industrial"],
      titulo: "Segurança em Eletricidade",
      nivel: "Iniciante",
      cargaHoraria: "8h",
      status: "em-breve",
      resumo: "Riscos elétricos, EPIs e EPCs, desenergização e bloqueio. Base introdutória aos conceitos da NR-10.",
      modulos: [
        { titulo: "Riscos elétricos", aulas: ["Choque elétrico e seus efeitos", "Arco elétrico e queimaduras", "Incêndios de origem elétrica"] },
        { titulo: "Medidas de proteção", aulas: ["EPIs e EPCs", "Desenergização passo a passo", "Bloqueio e etiquetagem (LOTO)"] },
        { titulo: "Primeiros socorros", aulas: ["Como agir em um acidente elétrico", "Noções de RCP"] }
      ]
    },
    {
      id: "analise-circuitos-cc",
      area: "eletrica",
      setores: ["comercial", "industrial"],
      titulo: "Análise de Circuitos em Corrente Contínua",
      nivel: "Intermediário",
      cargaHoraria: "16h",
      status: "disponivel",
      resumo: "Kirchhoff, malhas, superposição, Thévenin, Norton e ponte de Wheatstone, com exercícios resolvidos.",
      modulos: [
        { titulo: "Leis de Kirchhoff", aulas: ["Lei dos nós (correntes)", "Lei das malhas (tensões)", "Circuitos com mais de uma fonte"] },
        { titulo: "Métodos de resolução", aulas: ["Método das malhas (Maxwell)", "Teorema da superposição"] },
        { titulo: "Teoremas de equivalência", aulas: ["Teorema de Thévenin", "Teorema de Norton"] },
        { titulo: "Aplicações", aulas: ["Ponte de Wheatstone", "Máxima transferência de potência"] }
      ]
    },
    {
      id: "instalacoes-residenciais",
      area: "eletrica",
      setores: ["residencial"],
      titulo: "Instalações Elétricas Residenciais",
      nivel: "Intermediário",
      cargaHoraria: "20h",
      status: "em-breve",
      resumo: "Do projeto à execução: circuitos, dimensionamento de cabos e disjuntores, DR e DPS conforme a NBR 5410.",
      modulos: [
        { titulo: "Planejamento", aulas: ["Leitura de planta baixa", "Previsão de cargas (NBR 5410)", "Divisão de circuitos"] },
        { titulo: "Dimensionamento", aulas: ["Seção de condutores", "Disjuntores termomagnéticos", "DR e DPS"] },
        { titulo: "Execução", aulas: ["Tomadas e interruptores", "Interruptor paralelo e intermediário", "Montagem do quadro de distribuição", "Aterramento"] },
        { titulo: "Entrega", aulas: ["Testes e inspeção final", "Erros mais comuns"] }
      ]
    },
    {
      id: "instalacoes-comerciais",
      area: "eletrica",
      setores: ["comercial"],
      titulo: "Instalações Elétricas Comerciais",
      nivel: "Intermediário",
      cargaHoraria: "16h",
      status: "em-breve",
      resumo: "Lojas e escritórios: sistemas trifásicos, iluminação, quadros maiores e eficiência energética.",
      modulos: [
        { titulo: "Sistema trifásico", aulas: ["Ligação estrela e triângulo", "Equilíbrio de fases", "Padrão de entrada"] },
        { titulo: "Cargas comerciais", aulas: ["Iluminação comercial e LED", "Ar-condicionado e cargas especiais", "Infraestrutura (eletrocalhas e perfilados)"] },
        { titulo: "Eficiência e manutenção", aulas: ["Fator de potência", "Termografia básica", "Plano de manutenção"] }
      ]
    },
    {
      id: "comandos-eletricos",
      area: "eletrica",
      setores: ["industrial"],
      titulo: "Comandos Elétricos Industriais",
      nivel: "Intermediário",
      cargaHoraria: "24h",
      status: "em-breve",
      resumo: "Contatores, relés, partida direta, reversora e estrela-triângulo. Leitura e montagem de diagramas.",
      modulos: [
        { titulo: "Componentes", aulas: ["Contatores", "Relé térmico e disjuntor-motor", "Botoeiras, sinaleiros e temporizadores"] },
        { titulo: "Diagramas", aulas: ["Simbologia", "Diagrama de força x comando", "Selo e intertravamento"] },
        { titulo: "Partidas de motores", aulas: ["Partida direta", "Partida com reversão", "Partida estrela-triângulo", "Soft-starter e inversor (introdução)"] },
        { titulo: "Manutenção", aulas: ["Diagnóstico de falhas em painéis", "Boas práticas de montagem"] }
      ]
    },
    {
      id: "motores-eletricos",
      area: "eletrica",
      setores: ["industrial", "comercial"],
      titulo: "Motores Elétricos",
      nivel: "Intermediário",
      cargaHoraria: "12h",
      status: "em-breve",
      resumo: "Motor de indução trifásico e monofásico: placa, ligações, testes e manutenção.",
      modulos: [
        { titulo: "Funcionamento", aulas: ["Campo girante", "Motor de indução trifásico", "Motores monofásicos"] },
        { titulo: "Na prática", aulas: ["Lendo a placa do motor", "Ligações de 6 e 12 pontas", "Teste de isolação (megômetro)"] }
      ]
    }
  ]
};
