// Rota Industrial — Calculadoras elétricas (ferramentas.html)
// Fórmulas iguais às dos cursos. Tabela de cabos: NBR 5410, método B1 (eletroduto embutido), cobre/PVC 70 °C, 30 °C.
(function () {
  "use strict";
  const raiz = document.getElementById("calculadoras");
  if (!raiz) return;
  const { esc } = window.RotaUtil;

  // ------------------------------------------------------------ números
  const num = (v) => {
    if (v == null) return NaN;
    let t = String(v).trim().replace(/\s/g, "");
    if (!t) return NaN;
    if (/,/.test(t)) t = t.replace(/\./g, "").replace(",", "."); // 1.234,5 → 1234.5
    return Number(t);
  };
  const f = (x, casas) => {
    if (!isFinite(x)) return "—";
    const c = casas != null ? casas : Math.abs(x) >= 100 ? 1 : Math.abs(x) >= 10 ? 2 : 3;
    return Number(x).toLocaleString("pt-BR", { maximumFractionDigits: c, minimumFractionDigits: 0 });
  };
  // valor com prefixo (m, k, M) para resistência/corrente/potência
  const eng = (x, u) => {
    if (!isFinite(x)) return "—";
    const a = Math.abs(x);
    if (a >= 1e6) return `${f(x / 1e6)} M${u}`;
    if (a >= 1e3) return `${f(x / 1e3)} k${u}`;
    if (a > 0 && a < 1) return `${f(x * 1e3)} m${u}`;
    return `${f(x)} ${u}`;
  };
  const RAIZ3 = Math.sqrt(3);
  const SECOES = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120];
  const IZ_B1 = { 2: [17.5, 24, 32, 41, 57, 76, 101, 125, 151, 192, 232, 269], 3: [15.5, 21, 28, 36, 50, 68, 89, 110, 134, 171, 207, 239] };
  const AGRUP = { 1: 1, 2: 0.8, 3: 0.7, 4: 0.65, 5: 0.6, 6: 0.57 };
  const DISJ = [6, 10, 13, 16, 20, 25, 32, 40, 50, 63, 70, 80, 100, 125, 150, 175, 200, 225, 250];
  const UNID_P = { W: 1, kW: 1000, cv: 735.5, hp: 745.7, "BTU/h": 0.29307, "kcal/h": 1.163 };

  // ------------------------------------------------------------ definição das calculadoras
  const C = [
    {
      id: "ohm", ic: "Ω", titulo: "Lei de Ohm e potência", desc: "Preencha <b>dois</b> valores quaisquer e veja os outros.",
      campos: [{ id: "u", rot: "Tensão (U)", un: "V" }, { id: "i", rot: "Corrente (I)", un: "A" }, { id: "r", rot: "Resistência (R)", un: "Ω" }, { id: "p", rot: "Potência (P)", un: "W" }],
      calc(v) {
        const dados = ["u", "i", "r", "p"].filter((k) => isFinite(v[k]) && v[k] > 0);
        if (dados.length < 2) return null;
        if (dados.length > 2) return { aviso: "Preencha só dois campos (apague os outros)." };
        let { u, i, r, p } = v;
        const k = dados.join("");
        if (k === "ui") { r = u / i; p = u * i; }
        else if (k === "ur") { i = u / r; p = u * i; }
        else if (k === "up") { i = p / u; r = u / i; }
        else if (k === "ir") { u = i * r; p = u * i; }
        else if (k === "ip") { u = p / i; r = u / i; }
        else if (k === "rp") { i = Math.sqrt(p / r); u = i * r; }
        return { linhas: [["Tensão", eng(u, "V")], ["Corrente", eng(i, "A")], ["Resistência", eng(r, "Ω")], ["Potência", eng(p, "W")]],
          formula: "U = R × I   ·   P = U × I = R × I² = U² ÷ R" };
      }
    },
    {
      id: "corrente", ic: "A", titulo: "Corrente de um equipamento", desc: "Da potência para a corrente (mono, bifásico ou trifásico).",
      campos: [
        { id: "sis", rot: "Sistema", tipo: "sel", op: [["mono", "Monofásico / bifásico"], ["tri", "Trifásico"]] },
        { id: "v", rot: "Tensão", un: "V", padrao: "220" },
        { id: "p", rot: "Potência", un: "", padrao: "" },
        { id: "up", rot: "Unidade", tipo: "sel", op: [["W", "W"], ["kW", "kW"], ["cv", "cv"], ["hp", "hp"], ["VA", "VA"], ["kVA", "kVA"]] },
        { id: "fp", rot: "Fator de potência (cos φ)", un: "", padrao: "1" },
        { id: "eta", rot: "Rendimento", un: "%", padrao: "100" }
      ],
      calc(v, t) {
        if (!(v.v > 0 && v.p > 0)) return null;
        const aparente = t.up === "VA" || t.up === "kVA";
        const fp = aparente ? 1 : (v.fp > 0 && v.fp <= 1 ? v.fp : 1), eta = aparente ? 1 : (v.eta > 0 && v.eta <= 100 ? v.eta / 100 : 1);
        const pw = v.p * (aparente ? (t.up === "kVA" ? 1000 : 1) : UNID_P[t.up]);
        const k = t.sis === "tri" ? RAIZ3 : 1;
        const i = pw / (k * v.v * fp * eta);
        const s = aparente ? pw : pw / (eta * fp);
        return { destaque: eng(i, "A"), rotulo: "corrente", linhas: [["Potência ativa útil", aparente ? "—" : eng(pw, "W")], ["Potência aparente", eng(s, "VA")]],
          formula: t.sis === "tri" ? "I = P ÷ (√3 × U × cos φ × η)" : "I = P ÷ (U × cos φ × η)",
          nota: aparente ? "Em VA a conta já é direta: I = S ÷ U (ou S ÷ √3U no trifásico)." : "Chuveiro e resistências: cos φ = 1 e rendimento 100 %. Motores: veja a calculadora de motor." };
      }
    },
    {
      id: "queda", ic: "ΔV", titulo: "Queda de tensão", desc: "Quanto a tensão cai no cabo até a carga.",
      campos: [
        { id: "sis", rot: "Sistema", tipo: "sel", op: [["mono", "Monofásico / bifásico"], ["tri", "Trifásico"]] },
        { id: "v", rot: "Tensão", un: "V", padrao: "220" },
        { id: "i", rot: "Corrente", un: "A" },
        { id: "l", rot: "Comprimento (só ida)", un: "m" },
        { id: "s", rot: "Seção do cabo", tipo: "sel", op: SECOES.map((x) => [String(x), `${f(x)} mm²`]), padrao: "2.5" },
        { id: "mat", rot: "Material", tipo: "sel", op: [["cu", "Cobre"], ["al", "Alumínio"]] }
      ],
      calc(v, t) {
        if (!(v.v > 0 && v.i > 0 && v.l > 0)) return null;
        const rho = t.mat === "al" ? 0.0282 : 0.0172, s = Number(t.s);
        const k = t.sis === "tri" ? RAIZ3 : 2;
        const dv = (k * rho * v.l * v.i) / s, pct = (dv / v.v) * 100;
        const sMin = (k * rho * v.l * v.i) / (0.04 * v.v);
        const sug = SECOES.find((x) => x >= sMin);
        const ok = pct <= 4;
        return { destaque: `${f(pct, 2)} %`, rotulo: `queda (${f(dv, 2)} V)`, estado: ok ? "ok" : "ruim",
          linhas: [["Tensão na carga", `${f(v.v - dv, 1)} V`], ["Limite usual (circuito terminal)", "4 %"], ["Seção mínima para ≤ 4 %", sug ? `${f(sug)} mm² (calculado ${f(sMin, 2)})` : "acima de 120 mm²"]],
          formula: t.sis === "tri" ? "ΔV = √3 × ρ × L × I ÷ S" : "ΔV = 2 × ρ × L × I ÷ S (ida e volta)",
          nota: `${ok ? "✔ Dentro" : "✘ Acima"} do limite de 4 %. Cálculo simplificado (resistivo, ρ a 20 °C), como nos cursos.` };
      }
    },
    {
      id: "cabo", ic: "mm²", titulo: "Cabo e disjuntor", desc: "Seção do cabo e disjuntores possíveis para uma corrente de projeto.",
      campos: [
        { id: "ib", rot: "Corrente de projeto (Ib)", un: "A" },
        { id: "uso", rot: "Tipo de circuito", tipo: "sel", op: [["forca", "Tomadas / força"], ["luz", "Iluminação"]] },
        { id: "cc", rot: "Condutores carregados", tipo: "sel", op: [["2", "2 (fase-neutro ou 2 fases)"], ["3", "3 (trifásico)"]] },
        { id: "ag", rot: "Circuitos no mesmo eletroduto", tipo: "sel", op: [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"]] }
      ],
      calc(v, t) {
        if (!(v.ib > 0)) return null;
        const fa = AGRUP[t.ag], tab = IZ_B1[t.cc], minimo = t.uso === "luz" ? 1.5 : 2.5;
        for (let n = 0; n < SECOES.length; n++) {
          if (SECOES[n] < minimo) continue;
          const iz = tab[n] * fa;
          const opc = DISJ.filter((d) => d >= v.ib && d <= iz);
          if (opc.length) {
            return { destaque: `${f(SECOES[n])} mm²`, rotulo: "seção do cabo", estado: "ok",
              linhas: [["Capacidade do cabo (Iz)", `${f(tab[n])} A × ${f(fa, 2)} = ${f(iz, 1)} A`], ["Disjuntores possíveis", opc.map((d) => `${d} A`).join(", ")], ["Seção mínima por norma", `${f(minimo)} mm²`]],
              formula: "Ib ≤ In ≤ Iz (corrente de projeto ≤ disjuntor ≤ capacidade do cabo corrigida)",
              nota: "Curva B para resistivos e iluminação, curva C para motores e compressores. Confira também a queda de tensão. Base: NBR 5410, método B1, cobre/PVC, 30 °C." };
          }
        }
        return { aviso: "Corrente alta demais para esta tabela (até 120 mm²). Faça o projeto com um profissional." };
      }
    },
    {
      id: "motor", ic: "M", titulo: "Corrente de motor", desc: "Corrente nominal, partida e ajustes de proteção.",
      campos: [
        { id: "p", rot: "Potência", un: "", padrao: "3" },
        { id: "up", rot: "Unidade", tipo: "sel", op: [["cv", "cv"], ["kW", "kW"], ["hp", "hp"]] },
        { id: "sis", rot: "Sistema", tipo: "sel", op: [["tri", "Trifásico"], ["mono", "Monofásico"]] },
        { id: "v", rot: "Tensão", un: "V", padrao: "220" },
        { id: "eta", rot: "Rendimento (η)", un: "%", padrao: "84" },
        { id: "fp", rot: "Fator de potência", un: "", padrao: "0,80" },
        { id: "ip", rot: "Ip/In (placa)", un: "", padrao: "7,5" }
      ],
      calc(v, t) {
        if (!(v.p > 0 && v.v > 0 && v.eta > 0 && v.fp > 0)) return null;
        const pw = v.p * UNID_P[t.up], k = t.sis === "tri" ? RAIZ3 : 1;
        const inom = pw / (k * v.v * (v.eta / 100) * v.fp);
        const ip = v.ip > 0 ? inom * v.ip : NaN;
        const linhas = [["Potência no eixo", eng(pw, "W")], ["Potência absorvida da rede", eng(pw / (v.eta / 100), "W")], ["Corrente de partida (direta)", isFinite(ip) ? eng(ip, "A") : "—"]];
        if (t.sis === "tri") linhas.push(["Estrela-triângulo: partida", isFinite(ip) ? `≈ ${f(ip / 3, 1)} A (1/3 da direta)` : "—"], ["Estrela-triângulo: K1 e K2 · K3", `${f(0.58 * inom, 1)} A · ${f(0.33 * inom, 1)} A`], ["Relé térmico", `direta: ${f(inom, 1)} A · Y-Δ: ${f(0.58 * inom, 1)} A`]);
        return { destaque: eng(inom, "A"), rotulo: "corrente nominal", linhas, formula: t.sis === "tri" ? "In = P ÷ (√3 × U × η × cos φ)" : "In = P ÷ (U × η × cos φ)",
          nota: "Prefira sempre a corrente da placa do motor. Esta conta serve para estimar quando a placa não está legível." };
      }
    },
    {
      id: "conv", ic: "⇄", titulo: "Conversão de potência", desc: "W, kW, cv, hp, BTU/h e kcal/h.",
      campos: [{ id: "x", rot: "Valor", un: "", padrao: "1" }, { id: "de", rot: "De", tipo: "sel", op: Object.keys(UNID_P).map((u) => [u, u]), padrao: "cv" }],
      calc(v, t) {
        if (!(v.x > 0)) return null;
        const w = v.x * UNID_P[t.de];
        return { linhas: Object.entries(UNID_P).filter(([u]) => u !== t.de).map(([u, fator]) => [u, `${f(w / fator)} ${u}`]),
          formula: "1 cv = 735,5 W · 1 hp = 745,7 W · 1 BTU/h = 0,293 W · 1 kcal/h = 1,163 W",
          nota: "Nos cursos usamos 1 cv ≈ 736 W. BTU/h de ar-condicionado é capacidade de refrigeração, não potência elétrica." };
      }
    },
    {
      id: "assoc", ic: "R", titulo: "Associação de resistores", desc: "Série ou paralelo. Aceita k e M (ex.: 4k7, 1,5k, 2M).",
      campos: [{ id: "lista", rot: "Valores (Ω), separados por espaço ou ;", tipo: "texto", padrao: "100; 220; 330" }, { id: "modo", rot: "Ligação", tipo: "sel", op: [["serie", "Série"], ["paralelo", "Paralelo"]] }],
      calc(v, t) {
        const vals = String(t.lista || "").split(/[;\s]+/).map((x) => {
          const m = x.trim().toLowerCase().replace(",", ".").match(/^(\d*\.?\d+)\s*([kmr]?)(\d*)$/);
          if (!m) return NaN;
          const mult = m[2] === "k" ? 1e3 : m[2] === "m" ? 1e6 : 1;
          const base = m[3] ? Number(`${m[1]}.${m[3]}`) : Number(m[1]); // 4k7 → 4.7k
          return base * mult;
        }).filter((x) => isFinite(x) && x > 0);
        if (vals.length < 2) return null;
        const req = t.modo === "serie" ? vals.reduce((a, b) => a + b, 0) : 1 / vals.reduce((a, b) => a + 1 / b, 0);
        return { destaque: eng(req, "Ω"), rotulo: "resistência equivalente", linhas: [["Resistores", vals.map((x) => eng(x, "Ω")).join(" · ")]],
          formula: t.modo === "serie" ? "Req = R1 + R2 + …" : "1/Req = 1/R1 + 1/R2 + …",
          nota: t.modo === "serie" ? "Em série, Req é sempre MAIOR que o maior resistor." : "Em paralelo, Req é sempre MENOR que o menor resistor." };
      }
    },
    {
      id: "cores", ic: "🎨", titulo: "Código de cores (4 faixas)", desc: "Escolha as faixas e veja o valor do resistor.",
      campos: [
        { id: "f1", rot: "1ª faixa", tipo: "cor", padrao: "1" }, { id: "f2", rot: "2ª faixa", tipo: "cor", padrao: "0" },
        { id: "f3", rot: "Multiplicador", tipo: "cor", mult: true, padrao: "2" }, { id: "f4", rot: "Tolerância", tipo: "tol", padrao: "ouro" }
      ],
      calc(v, t) {
        const val = (Number(t.f1) * 10 + Number(t.f2)) * Math.pow(10, Number(t.f3));
        const tol = { ouro: "±5 %", prata: "±10 %", marrom: "±1 %", vermelho: "±2 %" }[t.f4];
        return { destaque: eng(val, "Ω"), rotulo: tol, resistor: [CORES[t.f1].c, CORES[t.f2].c, CORES[t.f3].c, TOL[t.f4]] };
      }
    }
  ];
  const CORES = [["preto", "#111"], ["marrom", "#7b3f00"], ["vermelho", "#d62828"], ["laranja", "#f77f00"], ["amarelo", "#fcbf49"], ["verde", "#2a9d43"],
    ["azul", "#1d4ed8"], ["violeta", "#7b2cbf"], ["cinza", "#8d99ae"], ["branco", "#f8f9fa"]].map(([n, c]) => ({ n, c }));
  const TOL = { ouro: "#c9a227", prata: "#c0c0c0", marrom: "#7b3f00", vermelho: "#d62828" };

  // ------------------------------------------------------------ montagem
  const campoHtml = (calc, c) => {
    const id = `${calc.id}-${c.id}`;
    if (c.tipo === "sel") return `<label>${c.rot}<select id="${id}" class="campo-claro">${c.op.map(([v, t]) => `<option value="${v}" ${String(c.padrao) === v ? "selected" : ""}>${t}</option>`).join("")}</select></label>`;
    if (c.tipo === "cor") return `<label>${c.rot}<select id="${id}" class="campo-claro">${CORES.map((x, i) => (c.mult && i > 6) || (!c.mult && c.id === "f1" && i === 0) ? "" : `<option value="${i}" ${String(c.padrao) === String(i) ? "selected" : ""}>${x.n}${c.mult ? ` (×${eng(Math.pow(10, i), "").trim() || "1"})` : ` (${i})`}</option>`).join("")}</select></label>`;
    if (c.tipo === "tol") return `<label>${c.rot}<select id="${id}" class="campo-claro">${Object.keys(TOL).map((k) => `<option value="${k}" ${c.padrao === k ? "selected" : ""}>${k}</option>`).join("")}</select></label>`;
    if (c.tipo === "texto") return `<label>${c.rot}<input id="${id}" class="campo-claro" value="${esc(c.padrao || "")}" autocomplete="off"></label>`;
    return `<label>${c.rot}${c.un ? ` <small>(${c.un})</small>` : ""}<input id="${id}" class="campo-claro" inputmode="decimal" autocomplete="off" value="${esc(c.padrao || "")}" placeholder="${c.un || ""}"></label>`;
  };
  raiz.innerHTML = `<div class="calc-atalhos">${C.map((c) => `<a href="#calc-${c.id}"><span>${c.ic}</span>${c.titulo}</a>`).join("")}</div>
    <div class="calc-grade">${C.map((c) => `<section class="calc" id="calc-${c.id}">
      <div class="calc-cabeca"><span class="calc-ic">${c.ic}</span><div><h2>${c.titulo}</h2><p>${c.desc}</p></div></div>
      <div class="calc-campos">${c.campos.map((x) => campoHtml(c, x)).join("")}</div>
      <div class="calc-resultado" id="res-${c.id}"></div>
      <button class="calc-limpar" data-limpar="${c.id}">Limpar</button>
    </section>`).join("")}</div>`;

  function calcular(c) {
    const v = {}, t = {};
    c.campos.forEach((x) => { const el = document.getElementById(`${c.id}-${x.id}`); t[x.id] = el.value; v[x.id] = num(el.value); });
    const r = c.calc(v, t), out = document.getElementById(`res-${c.id}`);
    if (!r) { out.innerHTML = '<p class="calc-vazio">Preencha os campos para ver o resultado.</p>'; return; }
    if (r.aviso) { out.innerHTML = `<p class="calc-aviso">${r.aviso}</p>`; return; }
    out.innerHTML = `${r.resistor ? resistorSvg(r.resistor) : ""}
      ${r.destaque ? `<div class="calc-destaque ${r.estado || ""}"><strong>${r.destaque}</strong><span>${esc(r.rotulo || "")}</span></div>` : ""}
      ${r.linhas ? `<table class="tabela"><tbody>${r.linhas.map(([a, b]) => `<tr><td>${a}</td><td><b>${b}</b></td></tr>`).join("")}</tbody></table>` : ""}
      ${r.formula ? `<p class="calc-formula">${r.formula}</p>` : ""}${r.nota ? `<p class="nota-mini">${r.nota}</p>` : ""}`;
  }
  function resistorSvg(cs) {
    return `<svg viewBox="0 0 240 60" class="resistor" aria-hidden="true"><line x1="0" y1="30" x2="240" y2="30" stroke="#8d99ae" stroke-width="4"/>
      <rect x="50" y="12" width="140" height="36" rx="16" fill="#e8d5b0" stroke="#b89b6a" stroke-width="2"/>
      ${cs.map((c, i) => `<rect x="${[70, 92, 114, 160][i]}" y="12" width="12" height="36" fill="${c}"/>`).join("")}</svg>`;
  }
  C.forEach((c) => {
    const sec = document.getElementById(`calc-${c.id}`);
    sec.addEventListener("input", () => calcular(c));
    sec.addEventListener("change", () => calcular(c));
    calcular(c);
  });
  raiz.addEventListener("click", (e) => {
    const b = e.target.closest("[data-limpar]"); if (!b) return;
    const c = C.find((x) => x.id === b.dataset.limpar);
    c.campos.forEach((x) => { const el = document.getElementById(`${c.id}-${x.id}`); if (el.tagName === "INPUT") el.value = ""; });
    calcular(c);
  });
})();
