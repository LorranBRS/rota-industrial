# Rota Industrial

Plataforma de cursos online voltada para os setores **industrial, residencial e comercial**.
A primeira trilha é a de **Elétrica**.

🔗 Site: https://lorranbrs.github.io/rota-industrial/

## Estrutura

```
index.html        Página inicial (trilha, como funciona, setores, áreas)
cursos.html       Catálogo com filtro por setor (?area=eletrica&setor=industrial)
curso.html        Página de um curso (?id=comandos-eletricos)
aula.html         Página de aula (?curso=<id>&aula=<módulo>-<aula>) com teste de múltipla escolha
busca.html        Busca em todas as aulas (?q=disjuntor)
perfil.html       Meu progresso: XP, nível, sequência, medalhas, ranking pessoal, exportar/importar
certificado.html  Certificado de conclusão (?curso=<id>), liberado com 100% das aulas e >= 70% nos testes
sobre.html        Sobre o projeto
data/cursos.js    Catálogo: áreas, setores, cursos, módulos e aulas
data/aulas/       Texto de cada aula (um arquivo por curso)
data/quizzes.js   Alternativas dos testes (a 1ª é a correta; o site embaralha)
assets/css/       Estilos
assets/js/        Scripts das páginas (window.RotaAluno guarda o progresso no navegador)
```

Site estático (HTML, CSS e JavaScript puro), publicado pelo **GitHub Pages** a partir da branch `main`.

## Como adicionar um curso

1. Abra `data/cursos.js`.
2. Copie um objeto do array `cursos`, troque o `id` e preencha título, setores, módulos e aulas.
3. Faça commit e push — o site atualiza sozinho em ~1 minuto.

## Gamificação (rank pessoal)

- Concluir aula: +20 XP · acertar questão (1ª resposta): +10 XP · gabarito na 1ª tentativa: +20 XP · concluir curso: +100 XP
- 10 níveis (Aprendiz → Mestre da Rota), 15 medalhas, sequência de acertos e dias seguidos
- Tudo em `localStorage` (`rota-aluno` e `rota-progresso`). O ranking geral entre alunos ficará para quando houver banco online.

## Rodar localmente

Basta abrir o `index.html` no navegador, ou:

```bash
python3 -m http.server 8000
```

## Documentação do projeto

As decisões, roteiro e conteúdo planejado ficam no cofre do Obsidian, na pasta `Rota Industrial/`.
