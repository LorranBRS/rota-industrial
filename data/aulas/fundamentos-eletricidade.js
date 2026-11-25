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
  }
};
