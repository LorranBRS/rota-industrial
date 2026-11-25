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

# ===== Curso: Instalações Elétricas Residenciais =====
GREEN = "#1f8a4c"
def fio(pts, cor, w=3):
    return f'<polyline points="{" ".join(f"{x},{y}" for x, y in pts)}" stroke="{cor}" stroke-width="{w}"/>'
def tri(x, y, ang=0):
    return f'<g transform="translate({x},{y}) rotate({ang})"><polygon points="0,-11 10,7 -10,7" fill="#fff" stroke="{INK}" stroke-width="2"/></g>'
def lampada(cx, cy, r=22):
    d = r*0.7
    return (f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="#fff"/>'
            f'<line x1="{cx-d}" y1="{cy-d}" x2="{cx+d}" y2="{cy+d}"/><line x1="{cx-d}" y1="{cy+d}" x2="{cx+d}" y2="{cy-d}"/>')

# A. planta com simbologia
b = ('<rect x="20" y="30" width="360" height="270" stroke-width="7"/>'
     '<line x1="60" y1="300" x2="120" y2="300" stroke="#ffffff" stroke-width="9"/>'
     '<path d="M 60 300 A 60 60 0 0 1 120 240" stroke-width="1.5" stroke-dasharray="4 3"/>'
     f'<path d="M 140 282 Q 170 220 190 178" stroke="{MUTED}" stroke-width="2" stroke-dasharray="7 5"/>'
     f'<path d="M 214 160 Q 300 110 250 44" stroke="{MUTED}" stroke-width="2" stroke-dasharray="7 5"/>'
     f'<path d="M 186 160 Q 90 150 34 120" stroke="{MUTED}" stroke-width="2" stroke-dasharray="7 5"/>'
     f'<path d="M 214 170 Q 300 190 366 200" stroke="{MUTED}" stroke-width="2" stroke-dasharray="7 5"/>')
tx = (f'<circle cx="200" cy="165" r="16" fill="#fff" stroke="{INK}" stroke-width="2.5"/>' + t(200, 171, "1", peso="800", tam=14)
      + t(200, 200, "220 VA", MUTED, tam=12) + f'<circle cx="140" cy="285" r="9" fill="#fff" stroke="{INK}" stroke-width="2.5"/>'
      + t(140, 290, "S", peso="800", tam=11) + tri(32, 120, 90) + tri(368, 200, -90) + tri(250, 42, 180)
      + t(48, 112, "2", anc="start", peso="700", tam=12) + t(352, 192, "2", anc="end", peso="700", tam=12) + t(262, 62, "2", anc="start", peso="700", tam=12)
      + t(200, 22, "Sala 3,5 × 4,0 m (14 m²)", peso="700", tam=13))
lx = 415
tx += f'<rect x="{lx-10}" y="30" width="235" height="270" rx="10" fill="#f6f7f9" stroke="#e2e5ea"/>' + t(lx, 56, "Legenda (exemplo)", anc="start", peso="700")
tx += f'<circle cx="{lx+12}" cy="88" r="11" fill="#fff" stroke="{INK}" stroke-width="2.5"/>' + t(lx+12, 93, "1", peso="800", tam=11) + t(lx+34, 93, "ponto de luz no teto", anc="start", tam=13)
tx += f'<circle cx="{lx+12}" cy="128" r="9" fill="#fff" stroke="{INK}" stroke-width="2.5"/>' + t(lx+12, 133, "S", peso="800", tam=11) + t(lx+34, 133, "interruptor simples", anc="start", tam=13)
tx += tri(lx+12, 168) + t(lx+34, 173, "tomada de uso geral", anc="start", tam=13)
tx += f'<line x1="{lx}" y1="208" x2="{lx+24}" y2="208" stroke="{MUTED}" stroke-width="2" stroke-dasharray="7 5"/>' + t(lx+34, 213, "eletroduto", anc="start", tam=13)
tx += t(lx+12, 253, "2", peso="800", tam=14) + t(lx+34, 253, "número do circuito", anc="start", tam=13)
tx += t(lx, 285, "Cada projeto traz sua legenda.", MUTED, anc="start", tam=11)
arquivos["res-planta"] = svg(660, 320, (b, tx))

# B. interruptor simples
b = (fio([(40, 60), (180, 60)], RED) + fio([(250, 60), (460, 60), (460, 108)], ORANGE) + fio([(460, 152), (460, 200), (40, 200)], BLUE)
     + '<line x1="180" y1="60" x2="240" y2="38" stroke-width="3"/>' + lampada(460, 130))
tx = dot(180, 60) + dot(250, 60) + t(36, 65, "F", RED, anc="end", peso="800") + t(36, 205, "N", BLUE, anc="end", peso="800")
tx += t(110, 50, "fase", RED, peso="600", tam=13) + t(355, 50, "retorno", ORANGE, peso="600", tam=13) + t(250, 222, "neutro (direto na lâmpada)", BLUE, peso="600", tam=13)
tx += t(215, 95, "interruptor", peso="700", tam=13) + t(496, 135, "lâmpada", anc="start", peso="600", tam=13)
tx += t(270, 252, "O interruptor sempre corta a FASE — nunca o neutro.", peso="700", tam=15)
arquivos["res-interruptor-simples"] = svg(580, 265, (b, tx))

# C. paralelo + intermediário
b = (fio([(20, 150), (110, 150)], RED) + '<line x1="110" y1="150" x2="168" y2="114" stroke-width="3"/>'
     + fio([(175, 110), (300, 110)], ORANGE) + fio([(175, 190), (300, 190)], ORANGE)
     + '<rect x="300" y="92" width="90" height="116" rx="8" fill="#fff"/>'
     + '<line x1="312" y1="110" x2="378" y2="110" stroke-width="2.5"/><line x1="312" y1="190" x2="378" y2="190" stroke-width="2.5"/>'
     + f'<line x1="312" y1="110" x2="378" y2="190" stroke="{MUTED}" stroke-width="2" stroke-dasharray="5 4"/><line x1="312" y1="190" x2="378" y2="110" stroke="{MUTED}" stroke-width="2" stroke-dasharray="5 4"/>'
     + fio([(390, 110), (515, 110)], ORANGE) + fio([(390, 190), (515, 190)], ORANGE)
     + '<line x1="580" y1="150" x2="522" y2="114" stroke-width="3"/>'
     + fio([(580, 150), (640, 150), (640, 112)], ORANGE) + lampada(640, 90) + fio([(640, 68), (640, 30), (20, 30)], BLUE))
tx = dot(110, 150) + dot(175, 110) + dot(175, 190) + dot(580, 150) + dot(515, 110) + dot(515, 190)
tx += t(16, 155, "F", RED, anc="end", peso="800") + t(16, 35, "N", BLUE, anc="end", peso="800")
tx += t(140, 228, "Paralelo 1", peso="700", tam=13) + t(345, 228, "Intermediário", peso="700", tam=13) + t(548, 228, "Paralelo 2", peso="700", tam=13)
tx += t(240, 100, "2 fios", ORANGE, peso="600", tam=12) + t(452, 100, "2 fios", ORANGE, peso="600", tam=12) + t(672, 95, "lâmpada", anc="start", peso="600", tam=12)
tx += t(350, 262, "Qualquer um dos três interruptores acende ou apaga a lâmpada.", peso="700", tam=14)
arquivos["res-paralelo-intermediario"] = svg(740, 278, (b, tx))

# D. quadro de distribuição
b = f'<rect x="20" y="20" width="620" height="330" rx="12" fill="#f6f7f9" stroke="{MUTED}" stroke-width="2"/>'
def modulo(x, y, w, h, l1, l2, cor="#ffffff", tracejado=False):
    d = ' stroke-dasharray="6 4"' if tracejado else ""
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="{cor}" stroke="{INK}" stroke-width="2"{d}/>'
            + t(x+w/2, y+h/2-2, l1, peso="700", tam=13) + t(x+w/2, y+h/2+16, l2, MUTED, tam=11))
tx = t(40, 46, "Chegam do medidor: F1, F2, N e PE", MUTED, anc="start", tam=12)
tx += modulo(45, 60, 90, 80, "Geral", "2P · padrão") + modulo(165, 60, 90, 80, "DR", "2P · 30 mA") + modulo(285, 60, 120, 80, "DPS", "F1, F2, N → PE")
b += '<line x1="135" y1="100" x2="165" y2="100"/><line x1="210" y1="140" x2="210" y2="170"/><line x1="50" y1="170" x2="440" y2="170"/>'
for i, (c, d, n) in enumerate((("C1", "10 A", "ilumin."), ("C2", "16 A", "TUG sala/q."), ("C3", "16 A", "TUG coz."), ("C4", "16 A", "TUG serv."), ("C5", "32 A", "chuveiro"))):
    x = 45 + i*80
    b += f'<line x1="{x+32}" y1="170" x2="{x+32}" y2="190"/>'
    tx += modulo(x, 190, 64, 80, c + " " + d, n)
tx += modulo(455, 190, 75, 80, "reserva", "", tracejado=True) + modulo(545, 190, 75, 80, "reserva", "", tracejado=True)
tx += f'<rect x="45" y="290" width="575" height="14" rx="4" fill="{BLUE}"/>' + t(332, 301, "barramento de NEUTRO", "#fff", peso="700", tam=11)
tx += f'<rect x="45" y="318" width="575" height="14" rx="4" fill="{GREEN}"/>' + t(332, 329, "barramento de TERRA (PE)", "#fff", peso="700", tam=11)
tx += t(420, 100, "ou um DR por grupo de circuitos", MUTED, anc="start", tam=11)
arquivos["res-quadro"] = svg(660, 365, (b, tx))

# E. aterramento TN-S
b = (fio([(30, 70), (200, 70)], RED) + fio([(30, 110), (200, 110)], BLUE)
     + f'<rect x="200" y="40" width="140" height="190" rx="10" fill="#f6f7f9" stroke="{MUTED}" stroke-width="2"/>'
     + fio([(200, 70), (340, 70), (520, 70), (548, 120)], RED) + fio([(200, 110), (340, 110), (520, 110), (572, 120)], BLUE)
     + fio([(230, 110), (230, 190), (340, 190), (520, 190), (560, 160)], GREEN)
     + fio([(270, 190), (270, 265)], GREEN)
     + '<line x1="250" y1="265" x2="290" y2="265"/><line x1="257" y1="273" x2="283" y2="273"/><line x1="264" y1="281" x2="276" y2="281"/>'
     + '<circle cx="560" cy="135" r="38" fill="#fff"/>')
tx = dot(230, 110) + dot(270, 190) + f'<circle cx="548" cy="128" r="5" fill="{INK}"/><circle cx="572" cy="128" r="5" fill="{INK}"/><circle cx="560" cy="150" r="5" fill="{INK}"/>'
tx += t(30, 62, "Fase", RED, anc="start", peso="700", tam=13) + t(30, 102, "Neutro", BLUE, anc="start", peso="700", tam=13) + t(30, 140, "da rede", MUTED, anc="start", tam=12)
tx += t(270, 32, "Quadro / entrada", peso="700", tam=13) + t(238, 150, "BEP", GREEN, anc="start", peso="800", tam=13)
tx += t(300, 268, "haste de aterramento", MUTED, anc="start", tam=12) + t(430, 62, "F", RED, peso="700") + t(430, 102, "N", BLUE, peso="700") + t(430, 182, "PE", GREEN, peso="700")
tx += t(560, 195, "tomada 2P+T", peso="700", tam=13)
tx += t(330, 305, "Neutro e terra só se encontram no BEP. Depois seguem SEPARADOS.", peso="700", tam=14)
arquivos["res-aterramento"] = svg(640, 318, (b, tx))

# F. coordenação Ib ≤ In ≤ Iz
X = lambda a: 40 + a*11.5
b = f'<line x1="{X(0)}" y1="110" x2="{X(46)}" y2="110" stroke="{MUTED}" stroke-width="2"/>'
tx = "".join(f'<line x1="{X(a)}" y1="104" x2="{X(a)}" y2="116" stroke="{MUTED}" stroke-width="1.5"/>' + t(X(a), 134, str(a), MUTED, tam=12) for a in range(0, 46, 5))
for a, nome, desc, cor, y in ((25, "Ib = 25 A", "corrente do chuveiro", BLUE, 70), (32, "In = 32 A", "disjuntor", ORANGE, 40), (41, "Iz = 41 A", "cabo 6 mm²", GREEN, 70)):
    tx += f'<circle cx="{X(a)}" cy="110" r="8" fill="{cor}"/>' + f'<line x1="{X(a)}" y1="{y+8}" x2="{X(a)}" y2="100" stroke="{cor}" stroke-width="1.5"/>'
    tx += t(X(a), y-8, nome, cor, peso="800", tam=14) + t(X(a), y+6, desc, MUTED, tam=11)
tx += t(300, 175, "Ib ≤ In ≤ Iz   (corrente do circuito ≤ disjuntor ≤ capacidade do cabo)", peso="700", tam=15) + t(X(46), 134, "A", MUTED, anc="end", tam=12)
arquivos["res-coordenacao"] = svg(600, 195, (b, tx))

# ===================== COMANDOS ELÉTRICOS =====================
# símbolos IEC desenhados na vertical (corrente de cima para baixo)
def ct(x, ya, yb, tipo="na", acion=None, ym=None, nome=None, nums=None):
    """contato NA/NF entre ya e yb; acion = None | 'botao' | 'termico'"""
    ym = (ya + yb) / 2 if ym is None else ym
    b = L((x, ya), (x, ym-18)) + L((x, ym+18), (x, yb))
    if tipo == "na":
        b += f'<line x1="{x}" y1="{ym+18}" x2="{x-14}" y2="{ym-16}"/>'
        mx = x - 7
    else:
        b += f'<line x1="{x}" y1="{ym-18}" x2="{x+12}" y2="{ym-18}"/><line x1="{x}" y1="{ym+18}" x2="{x+16}" y2="{ym-22}"/>'
        mx = x + 8
    tx = ""
    if acion == "botao":
        b += f'<line x1="{mx}" y1="{ym}" x2="{x-30}" y2="{ym}" stroke-width="2" stroke-dasharray="4 3"/>'
        b += L((x-24, ym-9), (x-30, ym-9), (x-30, ym+9), (x-24, ym+9))
    elif acion == "termico":
        b += f'<line x1="{mx}" y1="{ym}" x2="{x-28}" y2="{ym}" stroke-width="2" stroke-dasharray="4 3"/>'
        b += L((x-28, ym-8), (x-36, ym-8), (x-36, ym+8), (x-44, ym+8))
    if nome:
        xn = x - (52 if acion == "termico" else 40 if acion == "botao" else 22)
        tx += t(xn, ym+5, nome, anc="end", peso="700", tam=14)
    if nums:
        dx = 22 if tipo == "nf" else 10
        tx += t(x+dx, ym-14, nums[0], MUTED, anc="start", tam=11) + t(x+10, ym+30, nums[1], MUTED, anc="start", tam=11)
    return b, tx

def bob(x, ya, yb, nome=None, ym=None, temporizada=False):
    ym = (ya + yb) / 2 if ym is None else ym
    b = L((x, ya), (x, ym-14)) + L((x, ym+14), (x, yb)) + f'<rect x="{x-22}" y="{ym-14}" width="44" height="28" fill="#fff"/>'
    if temporizada:
        b += f'<rect x="{x+22}" y="{ym-14}" width="14" height="28" fill="{INK}"/>'
    tx = t(x+28 + (14 if temporizada else 0), ym-6, "A1", MUTED, anc="start", tam=11) + t(x+28 + (14 if temporizada else 0), ym+16, "A2", MUTED, anc="start", tam=11)
    if nome:
        tx += t(x-30, ym+5, nome, anc="end", peso="700", tam=14)
    return b, tx

def fus(x, ya, yb, nome=None):
    ym = (ya + yb) / 2
    b = L((x, ya), (x, yb)) + f'<rect x="{x-7}" y="{ym-18}" width="14" height="36" fill="#fff"/>' + L((x, ym-18), (x, ym+18))
    tx = t(x-16, ym+5, nome, anc="end", peso="700", tam=14) if nome else ""
    return b, tx

def sinal(x, ya, yb, nome=None):
    ym = (ya + yb) / 2
    b = L((x, ya), (x, yb)) + lampada(x, ym, 15)
    tx = t(x-24, ym+5, nome, anc="end", peso="700", tam=14) if nome else ""
    return b, tx

def soma(*partes):
    return "".join(p[0] for p in partes), "".join(p[1] for p in partes)

def motor(cx, cy, r=40):
    return f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="#fff"/>', t(cx, cy-2, "M", peso="800", tam=20) + t(cx, cy+18, "3~", peso="700", tam=14)

def termico3(xs, y1, y2, nome=None):
    b = f'<rect x="{xs[0]-22}" y="{y1}" width="{xs[-1]-xs[0]+44}" height="{y2-y1}" rx="4" fill="#fff"/>'
    ym = (y1 + y2) / 2
    for x in xs:
        b += L((x, y1), (x, ym-7), (x+7, ym-7), (x+7, ym+7), (x, ym+7), (x, y2))
    return b, (t(xs[0]-30, ym+5, nome, anc="end", peso="700", tam=14) if nome else "")

def contatos3(xs, ya, yb, nome=None, nums=None):
    b, tx = "", ""
    for i, x in enumerate(xs):
        bb, tt = ct(x, ya, yb, "na", nome=nome if i == 0 else None)
        b += bb; tx += tt
    ym = (ya + yb) / 2
    b += f'<line x1="{xs[0]-7}" y1="{ym}" x2="{xs[-1]-7}" y2="{ym}" stroke="{MUTED}" stroke-width="2" stroke-dasharray="5 4"/>'
    return b, tx

def trilhos(x1, x2, ytop, ybot, ltop="L (fase)", lbot="N"):
    b = f'<line x1="{x1}" y1="{ytop}" x2="{x2}" y2="{ytop}" stroke="{RED}" stroke-width="3"/>'
    b += f'<line x1="{x1}" y1="{ybot}" x2="{x2}" y2="{ybot}" stroke="{BLUE}" stroke-width="3"/>'
    return b, t(x1, ytop-10, ltop, RED, anc="start", peso="700", tam=13) + t(x1, ybot+20, lbot, BLUE, anc="start", peso="700", tam=13)

# 1. contator: bobina e contatos que mudam juntos
p = [bob(70, 80, 220, "K1"),
     contatos3((170, 210, 250), 80, 220), ct(330, 80, 220, "na", nums=("13", "14")), ct(410, 80, 220, "nf", nums=("21", "22"))]
b, tx = soma(*p)
b += f'<line x1="92" y1="150" x2="418" y2="150" stroke="{ORANGE}" stroke-width="2" stroke-dasharray="6 4"/>'
for x, a, z in ((170, "1", "2"), (210, "3", "4"), (250, "5", "6")):
    tx += t(x+10, 136, a, MUTED, anc="start", tam=11) + t(x+10, 180, z, MUTED, anc="start", tam=11)
tx += t(70, 250, "bobina", peso="700", tam=13) + t(70, 266, "A1-A2", MUTED, tam=12)
tx += t(210, 250, "contatos principais", peso="700", tam=13) + t(210, 266, "força do motor", MUTED, tam=12)
tx += t(330, 250, "auxiliar NA", peso="700", tam=13) + t(330, 266, "13-14", MUTED, tam=12)
tx += t(410, 250, "auxiliar NF", peso="700", tam=13) + t(410, 266, "21-22", MUTED, tam=12)
tx += t(240, 40, "Bobina energizada → todos os contatos mudam de estado juntos", ORANGE, peso="700", tam=14)
tx += t(240, 60, "(desenho sempre na posição de repouso: bobina desligada)", MUTED, tam=12)
arquivos["cmd-contator"] = svg(470, 285, (b, tx))

# 2. tabela de símbolos
cel = [("na", "Contato NA", "aberto em repouso"), ("nf", "Contato NF", "fechado em repouso"), ("bna", "Botão NA", "liga (pulsador)"),
       ("bnf", "Botão NF", "desliga (pulsador)"), ("bob", "Bobina", "contator / relé"),
       ("fus", "Fusível", "proteção contra curto"), ("ter", "Contato térmico", "95-96 do relé"), ("lam", "Sinaleiro", "lâmpada indicadora"),
       ("mot", "Motor trifásico", "M 3~"), ("kt", "Bobina temporizada", "retardo na energização")]
b, tx = "", ""
for i, (k, n1, n2) in enumerate(cel):
    cx = 75 + (i % 5) * 130; y0 = 20 + (i // 5) * 170
    b += f'<rect x="{cx-60}" y="{y0}" width="120" height="155" rx="10" fill="#f6f7f9" stroke="#e2e5ea" stroke-width="1.5"/>'
    ya, yb = y0 + 18, y0 + 100
    sx = cx + 8
    if k in ("na", "nf"):
        pp = ct(sx, ya, yb, k)
    elif k == "bna":
        pp = ct(sx + 8, ya, yb, "na", acion="botao")
    elif k == "bnf":
        pp = ct(sx + 4, ya, yb, "nf", acion="botao")
    elif k == "ter":
        pp = ct(sx + 10, ya, yb, "nf", acion="termico")
    elif k == "bob":
        pp = bob(cx - 4, ya, yb)
    elif k == "kt":
        pp = bob(cx - 10, ya, yb, temporizada=True)
    elif k == "fus":
        pp = fus(cx, ya, yb)
    elif k == "lam":
        pp = sinal(cx, ya, yb)
    else:
        pp = (L((cx, ya), (cx, ya + 20)) + f'<circle cx="{cx}" cy="{ya+50}" r="30" fill="#fff"/>',
              t(cx, ya + 48, "M", peso="800", tam=17) + t(cx, ya + 66, "3~", peso="700", tam=12))
    b += pp[0]; tx += pp[1]
    tx += t(cx, y0 + 125, n1, peso="700", tam=13) + t(cx, y0 + 143, n2, MUTED, tam=11)
arquivos["cmd-simbolos"] = svg(670, 360, (b, tx))

# 3. força da partida direta
xs = (130, 170, 210)
b, tx = "", ""
for x, n in zip(xs, ("L1", "L2", "L3")):
    tx += t(x, 28, n, RED, peso="800", tam=14)
    bb, tt = fus(x, 40, 120); b += bb
    b += L((x, 120), (x, 140)) + L((x, 205), (x, 225)) + L((x, 265), (x, 345))
bb, tt = contatos3(xs, 135, 210, "K1"); b += bb; tx += tt
bb, tt = termico3(xs, 225, 265, "F7"); b += bb; tx += tt
bb, tt = motor(170, 375); b += bb; tx += tt
tx += t(100, 85, "F1-F3", anc="end", peso="700", tam=14)
tx += t(250, 85, "fusíveis: proteção contra curto-circuito", anc="start", tam=13)
tx += t(250, 177, "K1: contator (liga e desliga o motor)", anc="start", tam=13)
tx += t(250, 250, "F7: relé térmico (sobrecarga)", anc="start", tam=13)
tx += t(250, 380, "motor de indução trifásico", anc="start", tam=13)
arquivos["cmd-forca-direta"] = svg(530, 430, (b, tx))

# 4. comando com selo
b, tx = trilhos(40, 400, 40, 440)
p = [fus(110, 40, 108, "F21"), ct(110, 108, 172, "nf", acion="termico", nome="F7", nums=("95", "96")),
     ct(110, 172, 245, "nf", acion="botao", nome="S0"), ct(110, 245, 325, "na", acion="botao", nome="S1"),
     ct(210, 245, 325, "na", nome="K1", nums=("13", "14")), bob(110, 325, 440, "K1"),
     ct(320, 105, 260, "na", nome="K1", nums=("43", "44")), sinal(320, 260, 440, "H1")]
bb, tt = soma(*p); b += bb; tx += tt
b += L((110, 245), (210, 245)) + L((110, 325), (210, 325)) + L((110, 105), (320, 105))
tx += dot(110, 245) + dot(110, 325) + dot(110, 105)
tx += f'<rect x="170" y="232" width="92" height="106" rx="8" fill="none" stroke="{ORANGE}" stroke-width="2" stroke-dasharray="6 5"/>'
tx += t(272, 300, "selo", ORANGE, anc="start", peso="800", tam=14)
tx += t(346, 355, "ligado", MUTED, anc="start", tam=12)
tx += t(210, 488, "Ao soltar S1, a bobina continua alimentada pelo contato K1 13-14.", peso="700", tam=13)
arquivos["cmd-selo"] = svg(440, 500, (b, tx))

# 5. reversão — força
b, tx = "", ""
K1x, K2x = (100, 140, 180), (300, 340, 380)
for x, n, yt in zip(K1x, ("L1", "L2", "L3"), (118, 133, 148)):
    tx += t(x, 28, n, RED, peso="800", tam=14)
    bb, tt = fus(x, 40, 100); b += bb
    b += L((x, 100), (x, 170))
    b += L((x, yt), (K2x[K1x.index(x)], yt), (K2x[K1x.index(x)], 170))
    tx += dot(x, yt)
bb, tt = contatos3(K1x, 165, 240, "K1"); b += bb; tx += tt
bb, tt = contatos3(K2x, 165, 240); b += bb; tx += tt
tx += t(410, 207, "K2", anc="start", peso="700", tam=14)
for x in K1x:
    b += L((x, 240), (x, 330))
for xk, xd, y in ((300, 180, 262), (340, 140, 280), (380, 100, 298)):
    b += f'<polyline points="{xk},240 {xk},{y} {xd},{y}" stroke="{ORANGE}" stroke-width="3"/>'
    tx += dot(xd, y)
bb, tt = termico3(K1x, 330, 366, "F7"); b += bb; tx += tt
b += "".join(L((x, 366), (x, 410)) for x in K1x)
bb, tt = motor(140, 440); b += bb; tx += tt
tx += t(340, 320, "K2 entrega L1 onde estava L3", ORANGE, peso="700", tam=13) + t(340, 338, "e L3 onde estava L1", ORANGE, peso="700", tam=13)
tx += t(240, 510, "Trocar duas fases inverte o sentido de giro do motor.", peso="700", tam=14)
arquivos["cmd-reversao-forca"] = svg(500, 525, (b, tx))

# 6. reversão — comando com intertravamento
b, tx = trilhos(40, 560, 40, 495)
p = [fus(110, 40, 108, "F21"), ct(110, 108, 172, "nf", acion="termico", nome="F7", nums=("95", "96")),
     ct(110, 172, 245, "nf", acion="botao", nome="S0"),
     ct(110, 245, 335, "na", acion="botao", nome="S1"), ct(200, 245, 335, "na", nome="K1", nums=("13", "14")),
     ct(110, 335, 412, "nf", nome="K2", nums=("21", "22")), bob(110, 412, 495, "K1"),
     ct(390, 245, 335, "na", acion="botao", nome="S2"), ct(480, 245, 335, "na", nome="K2", nums=("13", "14")),
     ct(390, 335, 412, "nf", nome="K1", nums=("21", "22")), bob(390, 412, 495, "K2")]
bb, tt = soma(*p); b += bb; tx += tt
b += L((110, 245), (480, 245)) + L((110, 335), (200, 335)) + L((390, 335), (480, 335))
tx += dot(110, 245) + dot(200, 245) + dot(390, 245) + dot(110, 335) + dot(390, 335)
for x in (110, 390):
    tx += f'<rect x="{x-50}" y="345" width="100" height="58" rx="8" fill="none" stroke="{ORANGE}" stroke-width="2" stroke-dasharray="6 5"/>'
tx += t(250, 370, "intertravamento", ORANGE, peso="800", tam=13) + t(250, 388, "um bloqueia o outro", ORANGE, tam=12)
tx += t(110, 542, "K1 — sentido horário", peso="700", tam=13) + t(390, 542, "K2 — anti-horário", peso="700", tam=13)
arquivos["cmd-reversao-comando"] = svg(600, 558, (b, tx))

# 7. ligações estrela e triângulo (motor de 6 pontas)
def bobina_rot(x1, y1, x2, y2, rot):
    cx, cy = (x1 + x2) / 2, (y1 + y2) / 2
    ang = math.degrees(math.atan2(y2 - y1, x2 - x1)) - 90
    return (L((x1, y1), (x2, y2)) + f'<rect x="-9" y="-24" width="18" height="48" fill="#fff" transform="translate({cx:.1f},{cy:.1f}) rotate({ang:.1f})"/>',
            t(cx + rot[0], cy + rot[1], rot[2], MUTED, tam=11))
cx, cy = 160, 170
pontas = [(cx + 95 * math.cos(math.radians(a)), cy + 95 * math.sin(math.radians(a))) for a in (-90, 30, 150)]
b, tx = "", ""
for (px, py), (n, lin), off in zip(pontas, (("1", "L1"), ("2", "L2"), ("3", "L3")), ((0, 0), (0, 0), (0, 0))):
    bb, tt = bobina_rot(cx, cy, px, py, (0, 0, "")); b += bb
    tx += dot(px, py)
tx += t(pontas[0][0], pontas[0][1] - 12, "1 → L1", RED, peso="700", tam=13)
tx += t(pontas[1][0] + 10, pontas[1][1] + 20, "2 → L2", RED, anc="start", peso="700", tam=13)
tx += t(pontas[2][0] - 10, pontas[2][1] + 20, "3 → L3", RED, anc="end", peso="700", tam=13)
tx += dot(cx, cy) + t(cx + 16, cy - 12, "4-5-6 unidas", ORANGE, anc="start", peso="700", tam=12)
tx += t(cx, 300, "Estrela (Y) — partida", peso="800", tam=15) + t(cx, 320, "cada bobina recebe 220 ÷ √3 ≈ 127 V", MUTED, tam=12)
tx += t(cx, 337, "corrente e conjugado caem para ≈ 1/3", MUTED, tam=12)
V = [(480, 70), (400, 225), (560, 225)]
for (a, c) in ((0, 1), (1, 2), (2, 0)):
    bb, tt = bobina_rot(V[a][0], V[a][1], V[c][0], V[c][1], (0, 0, "")); b += bb
for (vx, vy) in V:
    tx += dot(vx, vy)
tx += t(480, 56, "1+6 → L1", RED, peso="700", tam=13) + t(392, 250, "2+4 → L2", RED, peso="700", tam=13) + t(568, 250, "3+5 → L3", RED, peso="700", tam=13)
tx += t(480, 300, "Triângulo (Δ) — regime", peso="800", tam=15) + t(480, 320, "cada bobina recebe a tensão da rede: 220 V", MUTED, tam=12)
tx += t(480, 337, "motor desenvolve o conjugado nominal", MUTED, tam=12)
b += '<line x1="320" y1="30" x2="320" y2="340" stroke="#e2e5ea" stroke-width="2"/>'
tx += t(320, 368, "Exemplo: motor 220/380 V ligado em rede de 220 V", peso="700", tam=13)
arquivos["cmd-estrela-triangulo"] = svg(640, 382, (b, tx))

# 8. diagrama de tempos — temporizador e estrela-triângulo
def barras(linhas, marcas, legenda, w=620):
    b, tx = "", ""
    x0, x1 = 170, w - 40
    for i, (nome, cor, ini, fim) in enumerate(linhas):
        y = 40 + i * 46
        b += f'<line x1="{x0}" y1="{y+22}" x2="{x1}" y2="{y+22}" stroke="#e2e5ea" stroke-width="2"/>'
        tx += t(x0 - 14, y + 18, nome, anc="end", peso="700", tam=13)
        for a, z in ([(ini, fim)] if not isinstance(ini, list) else zip(ini, fim)):
            tx += f'<rect x="{a}" y="{y}" width="{z-a}" height="22" rx="4" fill="{cor}"/>'
    yb = 40 + len(linhas) * 46
    for x, txt in marcas:
        b += f'<line x1="{x}" y1="28" x2="{x}" y2="{yb}" stroke="{MUTED}" stroke-width="1.5" stroke-dasharray="5 4"/>'
        tx += t(x, yb + 18, txt, MUTED, tam=12)
    tx += t((x0 + x1) / 2, yb + 50, legenda, peso="700", tam=13)
    return b, tx, yb + 65
b, tx, h = barras([("bobina KT (A1-A2)", BLUE, 200, 470), ("contato 15-18 (NA)", ORANGE, 330, 470), ("contato 15-16 (NF)", GREEN, [170, 470], [330, 580])],
                  [(200, "energiza"), (330, "após o tempo t"), (470, "desenergiza")], "Retardo na energização: o contato só muda depois do tempo ajustado.")
b += seta(205, 30, 325, 30) + seta(325, 30, 205, 30)
tx += t(265, 22, "t", BLUE, peso="800", tam=14)
arquivos["cmd-temporizador"] = svg(620, h, (b, tx))

b, tx, h = barras([("K1 — rede", RED, 190, 580), ("K3 — estrela", BLUE, 190, 380), ("KT — temporizador", MUTED, 190, 580), ("K2 — triângulo", ORANGE, 400, 580)],
                  [(190, "liga (S1)"), (380, "fim do tempo"), (400, "")], "K3 e K2 nunca ficam ligados juntos (intertravamento).")
tx += t(390, 20, "pausa", MUTED, tam=11)
arquivos["cmd-yd-sequencia"] = svg(620, h, (b, tx))

for nome, conteudo in arquivos.items():
    open(os.path.join(OUT, nome + ".svg"), "w", encoding="utf-8").write(conteudo)
print(len(arquivos), "arquivos")
