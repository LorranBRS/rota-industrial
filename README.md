# Rota Industrial

Plataforma de cursos online voltada para os setores **industrial, residencial e comercial**.
A primeira trilha é a de **Elétrica**.

🔗 Site: https://lorranbrs.github.io/rota-industrial/

## Estrutura

```
index.html        Página inicial (setores, áreas e cursos em destaque)
cursos.html       Catálogo com filtro por setor (?area=eletrica&setor=industrial)
curso.html        Página de um curso (?id=comandos-eletricos)
sobre.html        Sobre o projeto
data/cursos.js    Catálogo: áreas, setores, cursos, módulos e aulas
assets/css/       Estilos
assets/js/        Scripts das páginas
```

Site estático (HTML, CSS e JavaScript puro), publicado pelo **GitHub Pages** a partir da branch `main`.

## Como adicionar um curso

1. Abra `data/cursos.js`.
2. Copie um objeto do array `cursos`, troque o `id` e preencha título, setores, módulos e aulas.
3. Faça commit e push — o site atualiza sozinho em ~1 minuto.

## Rodar localmente

Basta abrir o `index.html` no navegador, ou:

```bash
python3 -m http.server 8000
```

## Documentação do projeto

As decisões, roteiro e conteúdo planejado ficam no cofre do Obsidian, na pasta `Rota Industrial/`.
