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

# 11. eletrização: atrito, contato, indução
def sinais(xs, y, sinal):
    cor = RED if sinal == "+" else BLUE
    return "".join(t(x, y, sinal, cor, peso="800", tam=20) for x in xs)
b = ('<rect x="20" y="90" width="95" height="60" rx="8" fill="#f3e3c3"/>'
     '<rect x="120" y="90" width="95" height="60" rx="8" fill="#dfe8f3"/>'
     + seta(55, 172, 175, 172))
tx = t(118, 40, "Atrito", peso="700", tam=17) + sinais((45, 67, 89), 127, "+") + sinais((145, 167, 189), 127, "−")
tx += t(67, 78, "perdeu e⁻", MUTED, tam=12) + t(167, 78, "ganhou e⁻", MUTED, tam=12) + t(115, 192, "elétrons", BLUE, tam=12)
tx += t(118, 228, "Sinais OPOSTOS", ORANGE, peso="700")
b += f'<circle cx="320" cy="120" r="38" fill="#dfe8f3"/><circle cx="396" cy="120" r="38" fill="#dfe8f3"/>'
tx += t(358, 40, "Contato", peso="700", tam=17) + sinais((305, 335), 127, "−") + sinais((381, 411), 127, "−")
tx += t(358, 192, "as cargas se dividem", MUTED, tam=12) + t(358, 228, "Sinais IGUAIS", ORANGE, peso="700")
b += ('<rect x="480" y="98" width="70" height="44" rx="8" fill="#f3e3c3"/>'
      '<circle cx="625" cy="120" r="45" fill="#eef1f4"/>' + L((625, 165), (625, 190)) +
      '<line x1="607" y1="190" x2="643" y2="190"/><line x1="613" y1="197" x2="637" y2="197"/><line x1="619" y1="204" x2="631" y2="204"/>')
tx += t(598, 40, "Indução", peso="700", tam=17) + sinais((497, 515, 533), 127, "+")
tx += sinais((597,), 112, "−") + sinais((597,), 137, "−") + sinais((653,), 112, "+") + sinais((653,), 137, "+")
tx += t(515, 85, "indutor", MUTED, tam=12) + t(625, 66, "induzido", MUTED, tam=12) + t(655, 205, "terra", MUTED, anc="start", tam=12)
tx += t(598, 228, "SEM encostar", ORANGE, peso="700")
b += '<line x1="240" y1="30" x2="240" y2="235" stroke="#e2e5ea" stroke-width="2"/><line x1="476" y1="30" x2="476" y2="235" stroke="#e2e5ea" stroke-width="2"/>'
arquivos["eletrizacao"] = svg(720, 250, (b, tx))

# 12. linhas de campo elétrico
def radiais(cx, cy, para_fora, angs=range(0, 360, 45), r1=30, r2=92):
    out = ""
    for a in angs:
        c, sn = math.cos(math.radians(a)), math.sin(math.radians(a))
        p1 = (cx + r1*c, cy + r1*sn); p2 = (cx + r2*c, cy + r2*sn)
        if not para_fora: p1, p2 = p2, p1
        out += f'<line x1="{p1[0]:.1f}" y1="{p1[1]:.1f}" x2="{p2[0]:.1f}" y2="{p2[1]:.1f}" stroke="{BLUE}" stroke-width="2" marker-end="url(#sa)"/>'
    return out
def carga(cx, cy, sinal):
    cor = RED if sinal == "+" else BLUE
    return f'<circle cx="{cx}" cy="{cy}" r="18" fill="{cor}" stroke="none"/>' + f'<text x="{cx}" y="{cy+7}" text-anchor="middle" fill="#fff" font-weight="800" font-size="22">{sinal}</text>'
b = radiais(105, 140, True) + radiais(318, 140, False)
for k in (-80, -40, 40, 80):
    b += f'<path d="M 538 {140 + k*0.15:.0f} Q 595 {140 + k*1.1:.0f} 652 {140 + k*0.15:.0f}" stroke="{BLUE}" stroke-width="2" marker-end="url(#sa)"/>'
b += f'<line x1="540" y1="140" x2="650" y2="140" stroke="{BLUE}" stroke-width="2" marker-end="url(#sa)"/>'
b += radiais(520, 140, True, angs=(150, 180, 210), r2=65) + radiais(670, 140, False, angs=(-30, 0, 30), r2=65)
tx = carga(105, 140, "+") + carga(318, 140, "−") + carga(520, 140, "+") + carga(670, 140, "−")
tx += t(105, 30, "Positiva: linhas SAEM", RED, peso="700", tam=15) + t(318, 30, "Negativa: linhas CHEGAM", BLUE, peso="700", tam=15)
tx += t(595, 30, "Par + e −", peso="700", tam=15) + t(595, 262, "as linhas vão do + para o −", MUTED, tam=13)
arquivos["linhas-campo"] = svg(760, 275, (b, tx))

# 13. fontes geradoras de tensão
def card(i):
    col, lin = i % 3, i // 3
    return 10 + col*240, 10 + lin*165
b = ""; tx = ""
dados = [("Química", "pilhas e baterias"), ("Magnética", "geradores e alternadores"), ("Térmica", "termopar (efeito Seebeck)"),
         ("Pressão", "piezoelétrico (acendedor)"), ("Luminosa", "placa solar"), ("Atrito", "eletricidade estática")]
for i, (nome, ex) in enumerate(dados):
    x0, y0 = card(i)
    b = f'<rect x="{x0}" y="{y0}" width="228" height="152" rx="12" fill="#f6f7f9" stroke="#e2e5ea" stroke-width="1.5"/>' + b
    tx += t(x0+114, y0+120, nome, peso="700", tam=16) + t(x0+114, y0+140, ex, MUTED, tam=12)
cx, cy = card(0)[0]+114, card(0)[1]+55   # pilha
b += f'<rect x="{cx-45}" y="{cy-20}" width="90" height="40" rx="6" fill="#fff"/><rect x="{cx+45}" y="{cy-8}" width="8" height="16" fill="{INK}"/>'
tx += t(cx+28, cy+7, "+", RED, peso="800", tam=20) + t(cx-28, cy+7, "−", BLUE, peso="800", tam=20) + t(cx, cy+6, "1,5 V", tam=13, peso="700")
cx, cy = card(1)[0]+114, card(1)[1]+55   # gerador: ímã girando dentro de bobina
b += f'<circle cx="{cx}" cy="{cy}" r="38" stroke-dasharray="6 4"/>' + f'<path d="M {cx+44} {cy-20} A 48 48 0 0 1 {cx+44} {cy+20}" stroke="{ORANGE}" stroke-width="2.5"/>'
tx += f'<rect x="{cx-28}" y="{cy-10}" width="28" height="20" fill="{RED}"/><rect x="{cx}" y="{cy-10}" width="28" height="20" fill="{BLUE}"/>'
tx += t(cx-14, cy+6, "N", "#fff", peso="800", tam=13) + t(cx+14, cy+6, "S", "#fff", peso="800", tam=13) + t(cx+54, cy+5, "gira", ORANGE, anc="start", tam=12)
cx, cy = card(2)[0]+114, card(2)[1]+50   # termopar
b += f'<polyline points="{cx-60},{cy-30} {cx},{cy+10}" stroke="{RED}" stroke-width="3"/><polyline points="{cx+60},{cy-30} {cx},{cy+10}" stroke="{BLUE}" stroke-width="3"/>'
tx += dot(cx, cy+10) + f'<path d="M {cx-12} {cy+42} Q {cx} {cy+10} {cx+2} {cy+18} Q {cx+6} {cy+28} {cx+12} {cy+42} Z" fill="{ORANGE}"/>'
tx += t(cx-68, cy-34, "metal A", MUTED, anc="start", tam=11) + t(cx+68, cy-34, "metal B", MUTED, anc="end", tam=11) + t(cx, cy-30, "mV", RED, peso="700", tam=13)
cx, cy = card(3)[0]+114, card(3)[1]+55   # piezo
b += f'<rect x="{cx-30}" y="{cy-18}" width="60" height="36" fill="#e6e1f5"/>' + seta(cx, cy-48, cx, cy-22) + seta(cx, cy+48, cx, cy+22)
tx += t(cx-44, cy+7, "+", RED, anc="middle", peso="800", tam=20) + t(cx+44, cy+7, "−", BLUE, peso="800", tam=20) + t(cx, cy+5, "cristal", MUTED, tam=11)
cx, cy = card(4)[0]+114, card(4)[1]+55   # solar
tx += f'<circle cx="{cx-55}" cy="{cy-22}" r="14" fill="#f2c200"/>'
for a in range(0, 360, 45):
    c, sn = math.cos(math.radians(a)), math.sin(math.radians(a))
    b += f'<line x1="{cx-55+19*c:.1f}" y1="{cy-22+19*sn:.1f}" x2="{cx-55+26*c:.1f}" y2="{cy-22+26*sn:.1f}" stroke="#e0a800" stroke-width="2"/>'
b += f'<polygon points="{cx-20},{cy+30} {cx+50},{cy+30} {cx+62},{cy-10} {cx-8},{cy-10}" fill="#1f3a5f"/>'
for k in (1, 2):
    b += f'<line x1="{cx-20+k*70/3+k*4:.1f}" y1="{cy+30}" x2="{cx-8+k*70/3+k*4:.1f}" y2="{cy-10}" stroke="#8db4e6" stroke-width="1.5"/>'
b += f'<line x1="{cx-14}" y1="{cy+10}" x2="{cx+56}" y2="{cy+10}" stroke="#8db4e6" stroke-width="1.5"/>'
cx, cy = card(5)[0]+114, card(5)[1]+55   # atrito
b += f'<rect x="{cx-62}" y="{cy-18}" width="58" height="36" rx="6" fill="#f3e3c3"/><rect x="{cx+4}" y="{cy-18}" width="58" height="36" rx="6" fill="#dfe8f3"/>'
b += f'<line x1="{cx-50}" y1="{cy-34}" x2="{cx+50}" y2="{cy-34}" stroke="{ORANGE}" stroke-width="2.5" marker-start="url(#sv)" marker-end="url(#sv)"/>'
tx += t(cx-33, cy+7, "+ +", RED, peso="800", tam=18) + t(cx+33, cy+7, "− −", BLUE, peso="800", tam=18)
arquivos["fontes-tensao"] = svg(730, 345, (b, tx))

# ===== Curso: Análise de Circuitos em CC =====
# Circuito de referência: E1 = 20 V, R1 = 2 Ω, R3 = 4 Ω, R2 = 2 Ω, E2 = 10 V → VA = 12 V; I1 = 4 A, I3 = 3 A, I2 = 1 A
def duas_fontes():
    b = (bat(60, 70, 240, 155) + L((60, 70), (125, 70)) + rh(160, 70) + L((195, 70), (405, 70)) + rh(440, 70)
         + L((475, 70), (540, 70)) + bat(540, 70, 240, 155) + L((300, 70), (300, 120)) + rv(300, 155)
         + L((300, 190), (300, 240)) + L((60, 240), (540, 240)))
    tx = batlbl(60, 155, "20 V") + t(30, 135, "E1", RED, anc="end", peso="700") + batlbl(540, 155, "10 V") + t(510, 135, "E2", RED, anc="end", peso="700")
    tx += dot(300, 70) + dot(300, 240) + t(160, 45, "R1 = 2 Ω", peso="600") + t(440, 45, "R2 = 2 Ω", peso="600")
    tx += t(322, 160, "R3 = 4 Ω", anc="start", peso="600") + t(308, 60, "A", anc="start", peso="800") + t(308, 262, "B", anc="start", peso="800")
    return b, tx

b, tx = duas_fontes()
b += seta(130, 95, 190, 95) + seta(410, 95, 470, 95) + seta(278, 125, 278, 185)
tx += t(160, 118, "I1 = 4 A", BLUE, peso="700") + t(440, 118, "I2 = 1 A", BLUE, peso="700") + t(272, 160, "I3 = 3 A", BLUE, anc="end", peso="700")
tx += t(300, 280, "VA = 12 V · a fonte E2 está RECEBENDO 1 A (sendo carregada)", MUTED, tam=13)
arquivos["cc-duas-fontes"] = svg(600, 295, (b, tx))

def arco(cx, cy, r=26):
    return f'<path d="M {cx-r} {cy} A {r} {r} 0 1 1 {cx} {cy+r}" stroke="{ORANGE}" stroke-width="2.5" marker-end="url(#so)"/>'
b, tx = duas_fontes()
b += arco(180, 165) + arco(420, 165)
tx += t(180, 171, "Ia", ORANGE, peso="800", tam=17) + t(420, 171, "Ib", ORANGE, peso="800", tam=17)
tx += t(300, 280, "Correntes de malha no sentido horário: Ia = 4 A, Ib = 1 A · em R3: Ia − Ib = 3 A", MUTED, tam=13)
arquivos["cc-malhas"] = svg(600, 295, (b, tx)).replace("</defs>", f'<marker id="so" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="{ORANGE}"/></marker></defs>')

# Thévenin equivalente
b = (bat(60, 60, 230, 145) + L((60, 60), (110, 60)) + rh(145, 60) + L((180, 60), (380, 60), (380, 110)) + rv(380, 145)
     + L((380, 180), (380, 230), (60, 230)) + seta(250, 42, 330, 42)
     + f'<rect x="10" y="22" width="250" height="232" rx="10" stroke="{ORANGE}" stroke-width="2" stroke-dasharray="6 5"/>')
tx = batlbl(60, 145, "15 V") + t(30, 125, "Vth", RED, anc="end", peso="700") + t(145, 95, "Rth = 1 Ω", peso="600")
tx += f'<circle cx="290" cy="60" r="6" fill="#fff" stroke="{INK}" stroke-width="2"/><circle cx="290" cy="230" r="6" fill="#fff" stroke="{INK}" stroke-width="2"/>'
tx += t(290, 85, "A", peso="800") + t(290, 215, "B", peso="800") + t(402, 150, "R3 = 4 Ω", anc="start", peso="600")
tx += t(290, 32, "I = 3 A", BLUE, peso="700") + t(135, 248, "equivalente de Thévenin", ORANGE, peso="700", tam=13)
tx += t(245, 285, "I = Vth / (Rth + R3) = 15 / (1 + 4) = 3 A", peso="700", tam=15)
arquivos["cc-thevenin"] = svg(500, 300, (b, tx))

# Norton equivalente
b = (L((70, 60), (70, 121)) + L((70, 169), (70, 230)) + f'<circle cx="70" cy="145" r="24" fill="#fff"/>'
     + f'<line x1="70" y1="160" x2="70" y2="130" stroke-width="2.5" marker-end="url(#sk)"/>'
     + L((70, 60), (390, 60), (390, 110)) + rv(390, 145) + L((390, 180), (390, 230), (70, 230))
     + L((190, 60), (190, 110)) + rv(190, 145) + L((190, 180), (190, 230)) + seta(366, 115, 366, 175)
     + f'<rect x="20" y="22" width="250" height="232" rx="10" stroke="{ORANGE}" stroke-width="2" stroke-dasharray="6 5"/>')
tx = dot(190, 60) + dot(190, 230) + t(105, 140, "IN", BLUE, anc="start", peso="700") + t(105, 160, "15 A", BLUE, anc="start", peso="700")
tx += t(212, 150, "RN = 1 Ω", anc="start", peso="600") + t(412, 140, "R3 = 4 Ω", anc="start", peso="600") + t(412, 162, "I3 = 3 A", BLUE, anc="start", peso="700")
tx += f'<circle cx="300" cy="60" r="6" fill="#fff" stroke="{INK}" stroke-width="2"/><circle cx="300" cy="230" r="6" fill="#fff" stroke="{INK}" stroke-width="2"/>'
tx += t(300, 85, "A", peso="800") + t(300, 215, "B", peso="800") + t(145, 248, "equivalente de Norton", ORANGE, peso="700", tam=13)
tx += t(250, 285, "I3 = IN × RN / (RN + R3) = 15 × 1 / 5 = 3 A", peso="700", tam=15)
arquivos["cc-norton"] = svg(510, 300, (b, tx)).replace("</defs>", f'<marker id="sk" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="{INK}"/></marker></defs>')

# Ponte de Wheatstone
T, Lf, Rt, Bt = (230, 60), (110, 175), (350, 175), (230, 290)
def rdiag(p1, p2, nome):
    mx, my = (p1[0]+p2[0])/2, (p1[1]+p2[1])/2
    ang = math.degrees(math.atan2(p2[1]-p1[1], p2[0]-p1[0]))
    return L(p1, p2) + f'<g transform="translate({mx},{my}) rotate({ang:.1f})"><rect x="-30" y="-12" width="60" height="24" fill="#fff"/></g>'
b = rdiag(T, Lf, "R1") + rdiag(Lf, Bt, "R2") + rdiag(T, Rt, "R3") + rdiag(Rt, Bt, "Rx")
b += L(Lf, (206, 175)) + L((254, 175), Rt) + f'<circle cx="230" cy="175" r="24" fill="#fff" stroke="{ORANGE}" stroke-width="3"/>'
b += L(T, (230, 25), (30, 25), (30, 160)) + L((30, 176), (30, 325), (230, 325), Bt)
b += '<line x1="8" y1="160" x2="52" y2="160"/><line x1="19" y1="176" x2="41" y2="176" stroke-width="6"/>'
tx = dot(*T) + dot(*Lf) + dot(*Rt) + dot(*Bt) + t(230, 182, "G", ORANGE, peso="800", tam=20)
tx += t(0, 172, "E", RED, anc="end", peso="700") + t(58, 158, "+", anc="start", peso="700") + t(58, 186, "−", anc="start", peso="700")
tx += t(155, 105, "R1", anc="end", peso="700") + t(305, 105, "R3", anc="start", peso="700")
tx += t(155, 255, "R2", anc="end", peso="700") + t(305, 255, "Rx", anc="start", peso="700")
tx += t(230, 355, "Equilíbrio (G marca zero): R1 / R2 = R3 / Rx", peso="700", tam=15)
arquivos["cc-wheatstone"] = svg(460, 370, (b, tx))

# Máxima transferência de potência: P(RL) = 225·RL/(1+RL)²
x0, y0, sx, sy = 70, 250, 75, 200/60
pts = " ".join(f"{x0 + r*sx:.1f},{y0 - 225*r/(1+r)**2*sy:.1f}" for r in [i/50 for i in range(0, 301)])
b = (f'<line x1="{x0}" y1="{y0}" x2="{x0+6*sx+10}" y2="{y0}" stroke="{MUTED}" stroke-width="1.5"/>'
     f'<line x1="{x0}" y1="{y0}" x2="{x0}" y2="40" stroke="{MUTED}" stroke-width="1.5"/>'
     f'<polyline points="{pts}" stroke="{BLUE}" stroke-width="3"/>'
     f'<line x1="{x0+sx}" y1="{y0}" x2="{x0+sx}" y2="{y0-56.25*sy:.1f}" stroke="{ORANGE}" stroke-width="2" stroke-dasharray="5 4"/>')
tx = "".join(t(x0 + r*sx, y0+20, str(r), MUTED, tam=12) for r in range(7))
tx += "".join(t(x0-8, y0 - p*sy + 4, str(p), MUTED, anc="end", tam=12) for p in (0, 20, 40, 60))
tx += f'<circle cx="{x0+sx}" cy="{y0-56.25*sy:.1f}" r="6" fill="{ORANGE}"/>'
tx += t(x0+sx+12, y0-56.25*sy-8, "Pmáx = 56,25 W com RL = Rth = 1 Ω", ORANGE, anc="start", peso="700", tam=14)
tx += t(x0 + 3*sx, y0+42, "Resistência da carga RL (Ω)", peso="600", tam=13) + t(x0-45, 30, "P na carga (W)", anc="start", peso="600", tam=13)
arquivos["cc-max-potencia"] = svg(560, 305, (b, tx))

# Lei dos nós
b = (seta(50, 130, 196, 130) + seta(222, 122, 340, 50) + seta(226, 130, 380, 130) + seta(222, 138, 340, 210))
tx = dot(210, 130) + f'<circle cx="210" cy="130" r="9" fill="{INK}"/>' + t(110, 118, "10 A (entra)", BLUE, peso="700")
tx += t(350, 48, "3 A", BLUE, anc="start", peso="700") + t(390, 135, "4 A", BLUE, anc="start", peso="700") + t(350, 220, "I = ?", ORANGE, anc="start", peso="800")
tx += t(210, 262, "O que entra = o que sai: 10 = 3 + 4 + I → I = 3 A", peso="700", tam=15)
arquivos["cc-lei-dos-nos"] = svg(440, 280, (b, tx))

for nome, conteudo in arquivos.items():
    open(os.path.join(OUT, nome + ".svg"), "w", encoding="utf-8").write(conteudo)
print(len(arquivos), "arquivos")
