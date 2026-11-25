# Gera os diagramas SVG das aulas.
# Uso: python3 ferramentas/gera_diagramas.py assets/img/diagramas
import math, os, sys
OUT = sys.argv[1]
INK, RED, BLUE, ORANGE, MUTED = "#1b1f24", "#c0392b", "#1f5fa8", "#e08a00", "#5b6470"

def svg(w, h, body):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="-30 0 {w+30} {h}" font-family="Inter, Arial, Helvetica, sans-serif" font-size="15">
<defs>
<marker id="sa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="{BLUE}"/></marker>
<marker id="sv" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="{RED}"/></marker>
</defs>
<rect x="-30" width="{w+30}" height="{h}" fill="#ffffff"/>
<g stroke="{INK}" stroke-width="2.5" fill="none" stroke-linecap="round">
{body[0]}
</g>
<g fill="{INK}">
{body[1]}
</g>
</svg>
'''

def L(*pts):  # polyline
    return '<polyline points="' + " ".join(f"{x},{y}" for x, y in pts) + '"/>'
def rh(x, y, w=70, h=28):  # resistor horizontal centered at x,y
    return f'<rect x="{x-w/2}" y="{y-h/2}" width="{w}" height="{h}" fill="#fff"/>'
def rv(x, y, w=28, h=70):
    return f'<rect x="{x-w/2}" y="{y-h/2}" width="{w}" height="{h}" fill="#fff"/>'
def bat(x, ytop, ybot, ymid):
    """fonte CC vertical: fio de ytop até a placa +, placa -, fio até ybot"""
    return (L((x, ytop), (x, ymid-8)) + f'<line x1="{x-22}" y1="{ymid-8}" x2="{x+22}" y2="{ymid-8}"/>'
            + f'<line x1="{x-11}" y1="{ymid+8}" x2="{x+11}" y2="{ymid+8}" stroke-width="6"/>' + L((x, ymid+8), (x, ybot)))
def batlbl(x, ymid, txt):
    return (f'<text x="{x+30}" y="{ymid-10}" font-weight="700">+</text><text x="{x+30}" y="{ymid+18}" font-weight="700">−</text>'
            f'<text x="{x-30}" y="{ymid+5}" text-anchor="end" font-weight="700" fill="{RED}">{txt}</text>')
def dot(x, y):
    return f'<circle cx="{x}" cy="{y}" r="4.5" fill="{INK}"/>'
def t(x, y, s, cor=INK, anc="middle", peso="400", tam=15):
    return f'<text x="{x}" y="{y}" text-anchor="{anc}" fill="{cor}" font-weight="{peso}" font-size="{tam}">{s}</text>'
def seta(x1, y1, x2, y2, cor="a"):
    c = BLUE if cor == "a" else RED
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{c}" stroke-width="2" marker-end="url(#s{cor})"/>'
def seta2(x1, y1, x2, y2):
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{RED}" stroke-width="2" marker-start="url(#sv)" marker-end="url(#sv)"/>'

arquivos = {}

# 1. circuito simples
b = (bat(70, 60, 220, 140) + L((70, 60), (360, 60), (360, 105)) + rv(360, 140) + L((360, 175), (360, 220), (70, 220))
     + seta(170, 42, 260, 42))
txt = batlbl(70, 140, "U") + t(395, 145, "R", anc="start", peso="700") + t(215, 30, "I (sentido convencional)", BLUE, peso="600", tam=14)
txt += t(215, 250, "A fonte (U) empurra a corrente (I) através da resistência (R)", MUTED, tam=13)
arquivos["circuito-simples"] = svg(440, 265, (b, txt))

# 2. série
b = (bat(60, 70, 230, 150) + L((60, 70), (130, 70)) + rh(165, 70) + L((200, 70), (260, 70)) + rh(295, 70)
     + L((330, 70), (390, 70)) + rh(425, 70) + L((460, 70), (510, 70), (510, 230), (60, 230)) + seta(340, 250, 240, 250))
txt = batlbl(60, 150, "12 V")
for x, r, u in ((165, "R1 = 10 Ω", "U1 = 2 V"), (295, "R2 = 20 Ω", "U2 = 4 V"), (425, "R3 = 30 Ω", "U3 = 6 V")):
    txt += t(x, 45, r, peso="600") + t(x, 108, u, RED, peso="600")
txt += t(290, 275, "I = 0,2 A (a mesma em todos)", BLUE, peso="600") + t(290, 165, "2 V + 4 V + 6 V = 12 V", MUTED, tam=14)
arquivos["serie"] = svg(560, 290, (b, txt))

# 3. paralelo
b = (bat(60, 60, 250, 155) + L((60, 60), (420, 60), (420, 120)) + rv(420, 155) + L((420, 190), (420, 250), (60, 250))
     + L((260, 60), (260, 120)) + rv(260, 155) + L((260, 190), (260, 250)) + seta(110, 42, 200, 42)
     + seta(236, 125, 236, 185) + seta(396, 125, 396, 185))
txt = batlbl(60, 155, "12 V") + dot(260, 60) + dot(260, 250) + t(155, 30, "I = 6 A", BLUE, peso="700")
txt += t(285, 145, "R1 = 6 Ω", anc="start", peso="600") + t(285, 168, "I1 = 2 A", BLUE, anc="start", peso="600")
txt += t(445, 145, "R2 = 3 Ω", anc="start", peso="600") + t(445, 168, "I2 = 4 A", BLUE, anc="start", peso="600")
txt += t(280, 285, "Tensão igual (12 V) em todos · 2 A + 4 A = 6 A", MUTED, tam=14)
arquivos["paralelo"] = svg(560, 300, (b, txt))

# 4. misto
b = (bat(60, 60, 240, 150) + L((60, 60), (110, 60)) + rh(145, 60) + L((180, 60), (440, 60), (440, 115)) + rv(440, 150)
     + L((440, 185), (440, 240), (60, 240)) + L((290, 60), (290, 115)) + rv(290, 150) + L((290, 185), (290, 240))
     + seta(110, 92, 180, 92) + seta(266, 120, 266, 180) + seta(416, 120, 416, 180))
txt = batlbl(60, 150, "24 V") + dot(290, 60) + dot(290, 240)
txt += t(145, 35, "R1 = 4 Ω", peso="600") + t(145, 115, "I = 3 A", BLUE, peso="600") + t(145, 135, "U1 = 12 V", RED, peso="600")
txt += t(315, 145, "R2 = 6 Ω", anc="start", peso="600") + t(315, 168, "I2 = 2 A", BLUE, anc="start", peso="600")
txt += t(465, 145, "R3 = 12 Ω", anc="start", peso="600") + t(465, 168, "I3 = 1 A", BLUE, anc="start", peso="600")
txt += t(365, 268, "Paralelo R2 // R3 = 4 Ω, com 12 V sobre ele", MUTED, tam=14)
txt += f'<rect x="250" y="80" width="300" height="135" rx="10" fill="none" stroke="{ORANGE}" stroke-width="2" stroke-dasharray="6 5"/>'
arquivos["misto"] = svg(580, 285, (b, txt))

# 5. medição de tensão e corrente
def painel(dx, tipo):
    b = (bat(40+dx, 80, 230, 155) + L((40+dx, 80), (120+dx, 80) if tipo == "A" else (240+dx, 80)))
    if tipo == "A":
        b += L((160+dx, 80), (240+dx, 80))
    b += L((240+dx, 80), (240+dx, 120)) + rv(240+dx, 155) + L((240+dx, 190), (240+dx, 230), (40+dx, 230))
    tx = batlbl(40+dx, 155, "") + t(268+dx, 160, "R", anc="start", peso="700")
    if tipo == "V":
        b += L((240+dx, 100), (300+dx, 100), (300+dx, 133)) + L((300+dx, 177), (300+dx, 210), (240+dx, 210))
        b += f'<circle cx="{300+dx}" cy="155" r="22" fill="#fff" stroke="{RED}" stroke-width="3"/>'
        tx = batlbl(40+dx, 155, "") + t(212+dx, 160, "R", anc="end", peso="700") + dot(240+dx, 100) + dot(240+dx, 210)
        tx += t(300+dx, 162, "V", RED, peso="800", tam=20) + t(170+dx, 38, "Tensão: em PARALELO", RED, peso="700", tam=16)
        tx += t(170+dx, 262, "circuito ligado, sem abrir nada", MUTED, tam=13)
    else:
        b += f'<circle cx="{140+dx}" cy="80" r="22" fill="#fff" stroke="{BLUE}" stroke-width="3"/>'
        tx += t(140+dx, 87, "A", BLUE, peso="800", tam=20) + t(150+dx, 38, "Corrente: em SÉRIE", BLUE, peso="700", tam=16)
        tx += t(150+dx, 262, "o circuito é aberto para o instrumento", MUTED, tam=13)
    return b, tx
b1, t1 = painel(0, "V"); b2, t2 = painel(360, "A")
arquivos["medicao-tensao-corrente"] = svg(680, 280, (b1+b2+f'<line x1="345" y1="20" x2="345" y2="265" stroke="#e2e5ea" stroke-width="2"/>', t1+t2))

# 6. alicate
def alicate(dx, ambos):
    b = L((20+dx, 90), (300+dx, 90)) + L((20+dx, 170), (300+dx, 170))
    b += seta(60+dx, 72, 120+dx, 72) + seta(120+dx, 188, 60+dx, 188)
    if ambos:
        b += f'<ellipse cx="{200+dx}" cy="130" rx="42" ry="72" stroke="{ORANGE}" stroke-width="6"/>'
    else:
        b += f'<ellipse cx="{200+dx}" cy="90" rx="30" ry="36" stroke="{ORANGE}" stroke-width="6"/>'
    tx = t(24+dx, 82, "Fase", anc="start", peso="600", tam=14) + t(24+dx, 210, "Neutro", anc="start", peso="600", tam=14)
    tx += f'<rect x="{120+dx}" y="225" width="90" height="34" rx="6" fill="#1b1f24"/>'
    tx += t(165+dx, 248, "0,0 A" if ambos else "5,2 A", "#7CFC9A", peso="700", tam=17)
    tx += t(160+dx, 30, "Fase + neutro: os campos se anulam" if ambos else "Um condutor só: leitura correta", ORANGE if ambos else INK, peso="700", tam=15)
    return b, tx
b1, t1 = alicate(0, False); b2, t2 = alicate(330, True)
arquivos["alicate"] = svg(660, 275, (b1+b2, t1+t2))

# 7. CC x CA
def eixos(x0, ymid, w):
    return f'<line x1="{x0}" y1="{ymid}" x2="{x0+w}" y2="{ymid}" stroke="{MUTED}" stroke-width="1.5"/><line x1="{x0}" y1="40" x2="{x0}" y2="220" stroke="{MUTED}" stroke-width="1.5"/>'
b = eixos(40, 130, 260) + f'<line x1="40" y1="70" x2="290" y2="70" stroke="{RED}" stroke-width="3"/>'
pts = []
for i in range(0, 241):
    x = 370 + i; y = 130 - 60 * math.sin(2 * math.pi * i / 120)
    pts.append(f"{x},{y:.1f}")
b += eixos(370, 130, 260) + f'<polyline points="{" ".join(pts)}" stroke="{BLUE}" stroke-width="3"/>'
b += f'<line x1="370" y1="228" x2="490" y2="228" stroke="{MUTED}" stroke-width="1.5" marker-start="url(#sa)" marker-end="url(#sa)"/>'
tx = t(170, 30, "Corrente contínua (CC)", RED, peso="700", tam=16) + t(48, 62, "+12 V", RED, anc="start", peso="600")
tx += t(295, 150, "tempo", MUTED, anc="end", tam=13) + t(170, 200, "polaridade fixa", MUTED, tam=14)
tx += t(500, 30, "Corrente alternada (CA)", BLUE, peso="700", tam=16) + t(668, 150, "tempo", MUTED, anc="end", tam=13)
tx += t(430, 250, "1 ciclo = 1/60 s", MUTED, tam=13) + t(378, 66, "+", BLUE, anc="start", peso="700") + t(378, 202, "−", BLUE, anc="start", peso="700")
arquivos["cc-ca"] = svg(680, 265, (b, tx))

# 8. resistor código de cores
b = L((30, 95), (140, 95)) + L((380, 95), (490, 95)) + '<rect x="140" y="62" width="240" height="66" rx="26" fill="#e9d6ad"/>'
tx = ""
for x, cor, dig in ((180, "#f2c200", "4"), (215, "#7d3c98", "7"), (250, "#d32f2f", "× 100"), (335, "#c9a227", "± 5%")):
    tx += (f'<line x1="{x}" y1="36" x2="{x}" y2="60" stroke="{MUTED}" stroke-width="1"/>' if x == 215 else "") + f'<rect x="{x-9}" y="62" width="18" height="66" fill="{cor}"/>'
    tx += f'<line x1="{x}" y1="132" x2="{x}" y2="150" stroke="{MUTED}" stroke-width="1.5"/>' + t(x, 168, dig, peso="700")
for x, nome, y in ((180, "amarelo", 52), (215, "violeta", 30), (250, "vermelho", 52), (335, "ouro", 52)):
    tx += t(x, y, nome, MUTED, tam=12)
tx += t(260, 205, "4 7 × 100 = 4.700 Ω = 4,7 kΩ  ±5%", peso="700", tam=17)
arquivos["resistor-cores"] = svg(520, 225, (b, tx))

# 9. trifásico 127/220
b = ""
for y in (50, 100, 150, 200):
    b += L((70, y), (480, y))
b += seta2(220, 54, 220, 196) + seta2(360, 54, 360, 96)
tx = "".join(t(60, y+5, n, anc="end", peso="700") for y, n in ((50, "L1"), (100, "L2"), (150, "L3"), (200, "N")))
tx += t(230, 120, "127 V", RED, anc="start", peso="700") + t(230, 138, "fase–neutro", MUTED, anc="start", tam=13)
tx += t(370, 70, "220 V", RED, anc="start", peso="700") + t(370, 88, "fase–fase", MUTED, anc="start", tam=13)
tx += t(275, 240, "220 V ≈ 127 V × √3 (1,732)", peso="700", tam=16)
arquivos["trifasico"] = svg(520, 260, (b, tx))

# 10. queda de tensão no cabo
sen = " ".join(f"{68+i},{130-8*math.sin(2*math.pi*i/24):.1f}" for i in range(25))
b = (L((80, 108), (80, 60), (200, 60)) + rh(250, 60, 90, 26) + L((295, 60), (520, 60), (520, 105)) + rv(520, 140, 40, 70)
     + L((520, 175), (520, 220), (295, 220)) + rh(250, 220, 90, 26) + L((205, 220), (80, 220), (80, 152))
     + f'<circle cx="80" cy="130" r="22" fill="#fff"/>' + f'<polyline points="{sen}" stroke-width="2"/>' + seta(330, 42, 410, 42))
tx = t(48, 135, "220 V", RED, anc="end", peso="700") + t(250, 34, "cabo (ida) 50 m · 2,5 mm²", peso="600", tam=13)
tx += t(250, 98, "0,344 Ω → 6,9 V", RED, peso="600", tam=14) + t(250, 258, "0,344 Ω → 6,9 V", RED, peso="600", tam=14)
tx += t(250, 200, "cabo (volta) 50 m · 2,5 mm²", peso="600", tam=13) + t(370, 30, "20 A", BLUE, peso="700")
tx += t(550, 135, "Carga", anc="start", peso="700") + t(550, 156, "recebe", anc="start", tam=13, cor=MUTED) + t(550, 176, "206,2 V", RED, anc="start", peso="700")
tx += t(330, 150, "Perda total: 13,8 V (6,3%)", ORANGE, peso="700", tam=15)
arquivos["queda-tensao"] = svg(640, 280, (b, tx))

for nome, conteudo in arquivos.items():
    open(os.path.join(OUT, nome + ".svg"), "w", encoding="utf-8").write(conteudo)
print(len(arquivos), "arquivos")
