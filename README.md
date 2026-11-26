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
ranking.html      Ranking geral online (geral, semana, sequência, média)
verificar.html    Verificação pública de certificado (?c=RI-XXXXX-XXXXX)
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
- Tudo em `localStorage` (`rota-aluno` e `rota-progresso`).

## Ranking online (Supabase)

- Projeto Supabase `rota-industrial` (região São Paulo). Esquema e funções em `supabase/001_ranking.sql`.
- Sem e-mail e sem senha: o aluno escolhe um apelido e recebe um **código de acesso** aleatório (o banco guarda só o hash).
- O site chama só funções RPC (`rota_salvar`, `rota_ranking`, `rota_minha_posicao`, `rota_carregar`, `rota_emitir_certificado`, `rota_verificar_certificado`, `rota_apagar`). As tabelas ficam no schema `privado`, fora da API.
- A chave no `main.js` é a chave **publicável** (pública por definição).
- Ao criar um curso novo, atualize a tabela `privado.cursos` (aulas e testes), senão o certificado online não libera.

## Versão para celular (app instalável / PWA)

- `manifest.webmanifest` + ícones em `assets/icones/` (gerados por `python3 ferramentas/gera_icones.py`).
- `sw.js` guarda o site para uso offline: páginas pela rede (cache se sem internet), arquivos pelo cache (atualiza em segundo plano). O Supabase nunca passa pelo cache.
- Botão **Instalar app**: no Android/Chrome abre a instalação nativa; no iPhone mostra o passo a passo (Safari → Compartilhar → Adicionar à Tela de Início).
- No celular aparece a barra de navegação inferior.
- **Ao publicar mudanças**: aumente `VERSAO` em `sw.js` e em `ferramentas/gera_paginas.py` (os `?v=` precisam ser iguais) e rode o gerador.

## Páginas HTML

Geradas por `python3 ferramentas/gera_paginas.py` (mesmo cabeçalho em todas). Ao mudar CSS/JS, aumente `VERSAO` no script.

## Rodar localmente

Basta abrir o `index.html` no navegador, ou:

```bash
python3 -m http.server 8000
```

## Documentação do projeto

As decisões, roteiro e conteúdo planejado ficam no cofre do Obsidian, na pasta `Rota Industrial/`.
