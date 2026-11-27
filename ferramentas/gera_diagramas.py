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

# ===================== MOTORES ELÉTRICOS =====================
def flecha(x1, y1, x2, y2, cor, w=4):
    ang = math.atan2(y2 - y1, x2 - x1)
    p1 = (x2 - 14 * math.cos(ang - 0.45), y2 - 14 * math.sin(ang - 0.45))
    p2 = (x2 - 14 * math.cos(ang + 0.45), y2 - 14 * math.sin(ang + 0.45))
    return (f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2 - 8*math.cos(ang):.1f}" y2="{y2 - 8*math.sin(ang):.1f}" stroke="{cor}" stroke-width="{w}"/>'
            f'<polygon points="{x2:.1f},{y2:.1f} {p1[0]:.1f},{p1[1]:.1f} {p2[0]:.1f},{p2[1]:.1f}" fill="{cor}" stroke="none"/>')

# 1. campo girante
CORES = (RED, BLUE, ORANGE)
x0, x1, yc, A = 60, 420, 120, 55
b, tx = f'<line x1="{x0}" y1="{yc}" x2="{x1+10}" y2="{yc}" stroke="{MUTED}" stroke-width="1.5"/>', ""
for k, cor in enumerate(CORES):
    pts = " ".join(f"{x0 + (x1-x0)*d/360:.1f},{yc - A*math.sin(math.radians(d - 120*k)):.1f}" for d in range(0, 361, 5))
    b += f'<polyline points="{pts}" stroke="{cor}" stroke-width="3"/>'
for nome, cor, y in (("fase A", RED, 30), ("fase B", BLUE, 48), ("fase C", ORANGE, 66)):
    tx += t(x1 + 30, y, nome, cor, anc="start", peso="700", tam=13)
for i, d in enumerate((90, 210, 330)):
    x = x0 + (x1 - x0) * d / 360
    b += f'<line x1="{x}" y1="{yc-A-12}" x2="{x}" y2="{yc+A+8}" stroke="{MUTED}" stroke-width="1.5" stroke-dasharray="5 4"/>'
    tx += t(x, yc + A + 26, f"t{i+1}", peso="800", tam=14)
    cx, cy, r = 130 + i * 160, 290, 52
    b += f'<circle cx="{cx}" cy="{cy}" r="{r}" stroke="#c9ced6" stroke-width="2"/>'
    for k, cor in enumerate(CORES):
        a = math.radians(-90 + 120 * k)
        b += f'<line x1="{cx}" y1="{cy}" x2="{cx + r*math.cos(a):.1f}" y2="{cy + r*math.sin(a):.1f}" stroke="{cor}" stroke-width="1.5" stroke-dasharray="4 3"/>'
        tx += t(cx + (r+12)*math.cos(a), cy + (r+12)*math.sin(a) + 5, "ABC"[k], cor, peso="800", tam=12)
    a = math.radians(-90 + 120 * i)
    tx += flecha(cx, cy, cx + (r-6)*math.cos(a), cy + (r-6)*math.sin(a), GREEN)
    tx += t(cx, cy + r + 32, f"t{i+1}: campo no eixo {'ABC'[i]}", peso="700", tam=13)
tx += t(290, 410, "As três correntes defasadas criam um campo que gira, sem nenhuma peça se mover.", peso="700", tam=13)
arquivos["mot-campo-girante"] = svg(600, 425, (b, tx))

# 2. partes do motor (corte)
cx, cy = 180, 190
b = f'<circle cx="{cx}" cy="{cy}" r="150" fill="#e9ecf0"/>'
for k in range(16):
    a = math.radians(k * 22.5)
    b += f'<rect x="-6" y="-14" width="12" height="28" rx="3" fill="#e9ecf0" stroke="{MUTED}" stroke-width="1.5" transform="translate({cx+152*math.cos(a):.1f},{cy+152*math.sin(a):.1f}) rotate({k*22.5+90})"/>'
b += f'<circle cx="{cx}" cy="{cy}" r="138" fill="#cfd5dd"/>'
b += f'<circle cx="{cx}" cy="{cy}" r="96" fill="#fff"/>'
for k in range(24):
    a = math.radians(k * 15)
    b += f'<circle cx="{cx+108*math.cos(a):.1f}" cy="{cy+108*math.sin(a):.1f}" r="6" fill="{ORANGE}" stroke="{INK}" stroke-width="1.2"/>'
b += f'<circle cx="{cx}" cy="{cy}" r="90" fill="#dfe3e8"/>'
for k in range(20):
    a = math.radians(k * 18)
    b += f'<circle cx="{cx+78*math.cos(a):.1f}" cy="{cy+78*math.sin(a):.1f}" r="6" fill="#b0b7c0" stroke="{INK}" stroke-width="1.2"/>'
b += f'<circle cx="{cx}" cy="{cy}" r="20" fill="{MUTED}"/>'
tx = ""
for (px, py), y, nome, desc in (((cx+150, cy-10), 50, "Carcaça com aletas", "protege e dissipa o calor"),
                                 ((cx+120, cy-60), 105, "Núcleo do estator", "chapas de aço empilhadas"),
                                 ((cx+76, cy-58), 160, "Enrolamento do estator", "bobinas de cobre nas ranhuras"),
                                 ((cx+60, cy+52), 230, "Rotor gaiola de esquilo", "barras de alumínio em curto"),
                                 ((cx+14, cy+14), 300, "Eixo", "apoiado em rolamentos")):
    tx += f'<polyline points="{px:.0f},{py:.0f} 360,{y-5} 372,{y-5}" fill="none" stroke="{INK}" stroke-width="1.5"/>' + dot(px, py)
    tx += t(380, y, nome, anc="start", peso="700", tam=14) + t(380, y + 18, desc, MUTED, anc="start", tam=12)
tx += t(cx, 370, "Corte de um motor de indução (simplificado)", MUTED, tam=12)
arquivos["mot-partes"] = svg(620, 385, (b, tx))

# 3. placa de identificação
b = f'<rect x="20" y="20" width="560" height="270" rx="14" fill="#eef0f3" stroke="{MUTED}" stroke-width="2"/>'
b += "".join(f'<circle cx="{x}" cy="{y}" r="6" fill="#fff" stroke="{MUTED}" stroke-width="1.5"/>' for x in (38, 562) for y in (38, 272))
tx = t(300, 55, "MOTOR DE INDUÇÃO TRIFÁSICO", peso="800", tam=16) + t(300, 74, "(placa de exemplo)", MUTED, tam=11)
campos = [[("3~", ""), ("60 Hz", ""), ("Carcaça 90L", "")],
          [("3,0 cv (2,2 kW)", "p"), ("1730 rpm", "r"), ("FS 1,15", "f")],
          [("220/380 V", "v"), ("8,6/5,0 A", "i"), ("Ip/In 7,5", "")],
          [("Isol. F", "c"), ("IP55", ""), ("Regime S1", "")],
          [("Rend. 84 %", ""), ("cos φ 0,80", ""), ("Cat. N", "")]]
for li, linha in enumerate(campos):
    y = 100 + li * 34
    for ci, (txt, dest) in enumerate(linha):
        x = 50 + ci * 170
        cor = "#fff7e6" if dest else "#ffffff"
        borda = ORANGE if dest else "#cfd5dd"
        tx += f'<rect x="{x}" y="{y}" width="160" height="28" rx="5" fill="{cor}" stroke="{borda}" stroke-width="1.5"/>' + t(x + 80, y + 19, txt, peso="700", tam=13)
tx += t(300, 285, "Em destaque: os dados que você mais vai usar no campo.", ORANGE, peso="700", tam=12)
arquivos["mot-placa"] = svg(600, 300, (b, tx))

# 4. ligações de 6 pontas
def bloco6(dx, tipo):
    b, tx = "", ""
    pos = {6: (dx+60, 70), 4: (dx+130, 70), 5: (dx+200, 70), 1: (dx+60, 150), 2: (dx+130, 150), 3: (dx+200, 150)}
    b += f'<rect x="{dx+25}" y="40" width="210" height="145" rx="10" fill="#f6f7f9" stroke="{MUTED}" stroke-width="2"/>'
    if tipo == "D":
        for a, z in ((6, 1), (4, 2), (5, 3)):
            b += f'<rect x="{pos[a][0]-9}" y="{pos[a][1]}" width="18" height="{pos[z][1]-pos[a][1]}" rx="5" fill="{ORANGE}" stroke="none"/>'
    else:
        b += f'<rect x="{pos[6][0]}" y="{pos[6][1]-9}" width="{pos[5][0]-pos[6][0]}" height="18" rx="5" fill="{ORANGE}" stroke="none"/>'
    for n, (x, y) in pos.items():
        tx += f'<circle cx="{x}" cy="{y}" r="15" fill="#fff" stroke="{INK}" stroke-width="2.5"/>' + t(x, y + 5, str(n), peso="800", tam=14)
    for n, L_ in ((1, "L1"), (2, "L2"), (3, "L3")):
        x, y = pos[n]
        b += f'<line x1="{x}" y1="{y+15}" x2="{x}" y2="235" stroke="{RED}" stroke-width="3"/>'
        tx += t(x, 255, L_, RED, peso="800", tam=13)
    tit = "Triângulo (Δ) — 220 V" if tipo == "D" else "Estrela (Y) — 380 V"
    sub = "pontes 6-1, 4-2, 5-3" if tipo == "D" else "ponte unindo 4-5-6"
    tx += t(dx+130, 24, tit, peso="800", tam=15) + t(dx+130, 282, sub, ORANGE, peso="700", tam=13)
    return b, tx
b1, t1 = bloco6(0, "D"); b2, t2 = bloco6(300, "Y")
tx = t1 + t2 + t(280, 315, "Motor 220/380 V: a mesma bobina, ligada de dois jeitos.", peso="700", tam=14)
arquivos["mot-6-pontas"] = svg(560, 330, (b1 + b2 + '<line x1="280" y1="20" x2="280" y2="290" stroke="#e2e5ea" stroke-width="2"/>', tx))

# 5. motor monofásico com capacitor de partida
b, tx = trilhos(40, 480, 40, 340, "Fase", "Neutro")
b += L((120, 40), (120, 340)) + f'<rect x="104" y="140" width="32" height="90" fill="#fff"/>'
tx += t(150, 180, "bobina principal", anc="start", peso="700", tam=13) + t(150, 198, "(trabalho)", MUTED, anc="start", tam=12)
bb, tt = ct(330, 40, 120, "nf", nome="chave centrífuga")
b += bb; tx += tt
b += L((330, 120), (330, 170)) + f'<line x1="308" y1="170" x2="352" y2="170" stroke-width="3"/><line x1="308" y1="182" x2="352" y2="182" stroke-width="3"/>'
b += L((330, 182), (330, 340)) + f'<rect x="314" y="230" width="32" height="70" fill="#fff"/>'
tx += t(362, 182, "capacitor de partida", anc="start", peso="700", tam=13)
tx += t(362, 262, "bobina auxiliar", anc="start", peso="700", tam=13) + t(362, 280, "(partida)", MUTED, anc="start", tam=12)
tx += dot(120, 40) + dot(120, 340) + dot(330, 40) + dot(330, 340)
tx += t(260, 390, "A chave centrífuga desliga a bobina auxiliar quando o motor chega a ≈ 75 % da rotação.", peso="700", tam=13)
arquivos["mot-monofasico"] = svg(540, 405, (b, tx))

# 6. megômetro
b = f'<rect x="300" y="60" width="200" height="150" rx="14" fill="#e9ecf0" stroke="{MUTED}" stroke-width="2"/>'
b += f'<rect x="330" y="85" width="140" height="45" rx="6" fill="#1b1f24" stroke="none"/>'
b += f'<circle cx="40" cy="140" r="70" fill="#f6f7f9"/>' + f'<rect x="10" y="40" width="60" height="30" rx="4" fill="#fff"/>'
for x in (22, 40, 58):
    b += f'<circle cx="{x}" cy="55" r="5" fill="#fff"/>'
b += f'<path d="M 22 55 L 58 55" stroke="{ORANGE}" stroke-width="3"/>'
b += fio([(40, 55), (40, 20), (250, 20), (250, 110), (340, 175)], RED)
b += fio([(105, 165), (250, 165), (250, 190), (440, 190), (440, 175)], GREEN)
tx = t(400, 115, "250 MΩ", "#7CFC9A", peso="800", tam=20) + t(400, 160, "500 V CC", peso="700", tam=13)
tx += f'<circle cx="340" cy="175" r="7" fill="{RED}"/><circle cx="440" cy="175" r="7" fill="{GREEN}"/>'
tx += t(340, 228, "LINE", RED, peso="800", tam=12) + t(440, 228, "EARTH", GREEN, peso="800", tam=12) + t(400, 52, "megômetro", peso="700", tam=13)
tx += dot(105, 165) + t(40, 145, "motor", peso="700", tam=14) + t(40, 163, "(carcaça)", MUTED, tam=12)
tx += t(88, 82, "pontas 1-2-3 (ou todas)", MUTED, anc="start", tam=11) + t(88, 96, "unidas para o teste", MUTED, anc="start", tam=11)
tx += t(250, 265, "Isolação entre enrolamento e carcaça: motor desligado e desconectado.", peso="700", tam=13)
arquivos["mot-megometro"] = svg(530, 280, (b, tx))

# ===================== INSTALAÇÕES COMERCIAIS =====================
# 1. sistema trifásico em estrela com neutro (220/127 V)
cx, cy = 130, 170
b, tx = "", ""
pontas = []
for k in range(3):
    a = math.radians(-90 + 120 * k)
    px, py = cx + 90 * math.cos(a), cy + 90 * math.sin(a)
    pontas.append((px, py))
    bb, tt = bobina_rot(cx, cy, px, py, (0, 0, "")); b += bb
(ax, ay), (bx, by), (cx2, cy2) = pontas
b += fio([(ax, ay), (ax, 60), (520, 60)], RED)
b += fio([(bx, by), (270, by), (270, 110), (520, 110)], BLUE)
b += fio([(cx2, cy2), (cx2, 300), (520, 300)], ORANGE)
b += fio([(cx, cy), (cx, 250), (520, 250)], MUTED)
tx += dot(cx, cy) + "".join(dot(px, py) for px, py in pontas)
for y, n, cor in ((60, "Fase A", RED), (110, "Fase B", BLUE), (250, "Neutro", MUTED), (300, "Fase C", ORANGE)):
    tx += t(530, y + 5, n, cor, anc="start", peso="700", tam=13)
tx += seta2(420, 64, 420, 106) + t(412, 90, "220 V", RED, anc="end", peso="800", tam=13) + t(412, 76, "linha (entre fases)", MUTED, anc="end", tam=11)
tx += seta2(420, 254, 420, 296) + t(412, 280, "127 V", RED, anc="end", peso="800", tam=13) + t(412, 266, "fase (fase-neutro)", MUTED, anc="end", tam=11)
tx += t(cx + 16, cy - 8, "N", peso="800", tam=13, anc="start")
tx += t(310, 345, "Secundário do transformador em estrela: 220 ÷ 127 = √3 ≈ 1,73", peso="800", tam=14)
arquivos["com-trifasico"] = svg(620, 365, (b, tx))

# 2. equilíbrio de fases (antes x depois)
def barras_fase(dx, vals, tit):
    b, tx = "", ""
    base, esc = 250, 0.042
    for i, (f, v, cor) in enumerate(zip("ABC", vals, (RED, BLUE, ORANGE))):
        x = dx + 30 + i * 70
        h = v * esc
        tx += f'<rect x="{x}" y="{base-h:.1f}" width="46" height="{h:.1f}" rx="4" fill="{cor}"/>' + t(x + 23, base - h - 8, f"{v:,}".replace(",", "."), peso="700", tam=12)
        tx += t(x + 23, base + 20, f"Fase {f}", peso="700", tam=12)
    media = sum(vals) / 3
    b += f'<line x1="{dx+20}" y1="{base-media*esc:.1f}" x2="{dx+236}" y2="{base-media*esc:.1f}" stroke="{INK}" stroke-width="1.5" stroke-dasharray="6 4"/>'
    b += f'<line x1="{dx+20}" y1="{base}" x2="{dx+236}" y2="{base}" stroke="{MUTED}" stroke-width="2"/>'
    tx += t(dx + 128, 30, tit, peso="800", tam=15)
    return b, tx
b1, t1 = barras_fase(0, (3280, 4680, 4200), "Antes (VA por fase)")
b2, t2 = barras_fase(300, (4080, 3880, 4200), "Depois (C7 → fase A)")
tx = t1 + t2 + t(280, 300, "Tracejado = média (≈ 4.053 VA). Depois da troca, nenhuma fase se afasta mais de 4,3 % da média.", MUTED, tam=12)
arquivos["com-equilibrio"] = svg(560, 315, (b1 + b2 + '<line x1="280" y1="40" x2="280" y2="270" stroke="#e2e5ea" stroke-width="2"/>', tx))

# 3. padrão de entrada (blocos)
def caixa(x, y, w, h, l1, l2, cor="#fff"):
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="{cor}" stroke="{INK}" stroke-width="2"/>'
            + t(x + w/2, y + h/2 - 2, l1, peso="700", tam=13) + t(x + w/2, y + h/2 + 15, l2, MUTED, tam=11))
b = fio([(20, 90), (80, 90)], RED) + fio([(200, 90), (230, 90)], RED) + fio([(350, 90), (380, 90)], RED) + fio([(500, 90), (530, 90)], RED)
b += fio([(440, 125), (440, 190)], GREEN) + '<line x1="420" y1="190" x2="460" y2="190"/><line x1="427" y1="198" x2="453" y2="198"/><line x1="434" y1="206" x2="446" y2="206"/>'
tx = t(20, 75, "rede", RED, anc="start", peso="700", tam=12)
tx += caixa(80, 55, 120, 70, "Ramal de ligação", "da concessionária")
tx += caixa(230, 55, 120, 70, "Medidor", "caixa padronizada")
tx += caixa(380, 55, 120, 70, "Disjuntor geral", "+ BEP / aterramento")
tx += caixa(530, 55, 110, 70, "QDG", "quadro geral", "#f6f7f9")
tx += t(470, 222, "haste(s) de aterramento", MUTED, anc="start", tam=12)
b += f'<line x1="215" y1="46" x2="215" y2="150" stroke="{ORANGE}" stroke-width="2" stroke-dasharray="6 5"/>'
tx += t(215, 18, "ponto de entrega", ORANGE, peso="800", tam=12) + t(205, 40, "rede", ORANGE, anc="end", tam=11) + t(225, 40, "instalação do cliente", ORANGE, anc="start", tam=11)
tx += t(330, 260, "Cada concessionária tem seu padrão: siga a norma técnica dela.", peso="700", tam=14)
arquivos["com-padrao-entrada"] = svg(660, 275, (b, tx))

# 4. layout luminotécnico (salão 10 × 10 m, 5 × 6 luminárias)
b = '<rect x="40" y="40" width="300" height="300" stroke-width="5"/>'
tx = ""
for i in range(6):
    for j in range(5):
        x = 40 + 25 + i * 50
        y = 40 + 30 + j * 60
        tx += f'<rect x="{x-16}" y="{y-6}" width="32" height="12" rx="3" fill="#fff7e6" stroke="{ORANGE}" stroke-width="2"/>'
b += f'<line x1="65" y1="365" x2="115" y2="365" stroke="{MUTED}" stroke-width="1.5"/>' + f'<line x1="360" y1="70" x2="360" y2="130" stroke="{MUTED}" stroke-width="1.5"/>'
tx += t(90, 385, "1,67 m", MUTED, tam=12) + t(368, 104, "2,0 m", MUTED, anc="start", tam=12)
tx += t(190, 25, "Salão de vendas 10 × 10 m (100 m²)", peso="700", tam=14)
lx = 420
tx += f'<rect x="{lx-12}" y="60" width="250" height="250" rx="10" fill="#f6f7f9" stroke="#e2e5ea"/>'
for k, (a, z) in enumerate((("Iluminância alvo", "500 lux"), ("Luminária LED", "4.000 lm · 32 W"), ("Fator de utilização", "0,6"), ("Fator de manutenção", "0,8"), ("Mínimo calculado", "26,04 → 27"), ("Adotado (grade 5 × 6)", "30 luminárias"), ("Resultado", "≈ 576 lux · 960 W"))):
    tx += t(lx, 88 + k * 32, a, MUTED, anc="start", tam=12) + t(lx, 104 + k * 32, z, peso="700", anc="start", tam=13)
arquivos["com-luminotecnico"] = svg(690, 400, (b, tx))

# 5. triângulo de potências
b = (fio([(60, 260), (420, 260)], BLUE, 4) + fio([(420, 260), (420, 80)], ORANGE, 4) + fio([(60, 260), (420, 80)], RED, 4)
     + f'<path d="M 130 260 A 70 70 0 0 0 123 229" stroke="{INK}" stroke-width="2"/>'
     + fio([(420, 260), (420, 120)], GREEN, 4) + f'<line x1="60" y1="260" x2="420" y2="120" stroke="{GREEN}" stroke-width="2.5" stroke-dasharray="7 5"/>')
tx = t(240, 285, "P = potência ativa (kW) — faz trabalho", BLUE, peso="700", tam=13)
tx += t(432, 100, "Q = reativa (kvar)", ORANGE, anc="start", peso="700", tam=13) + t(432, 118, "magnetiza motores e reatores", MUTED, anc="start", tam=11)
tx += t(200, 150, "S = aparente (kVA)", RED, anc="end", peso="700", tam=13)
tx += t(140, 252, "φ", peso="800", tam=16)
tx += t(432, 175, "capacitores reduzem Q", GREEN, anc="start", peso="700", tam=12) + t(432, 192, "→ φ menor, cos φ maior", GREEN, anc="start", tam=12)
tx += t(300, 330, "cos φ = P ÷ S   ·   S² = P² + Q²", peso="800", tam=15)
arquivos["com-triangulo-potencias"] = svg(640, 345, (b, tx))

# 6. termografia de disjuntores
def grad(id_, c1, c2):
    return f'<radialGradient id="{id_}"><stop offset="0" stop-color="{c1}"/><stop offset="1" stop-color="{c2}"/></radialGradient>'
b = f'<defs>{grad("gq", "#fff3b0", "#d7301f")}{grad("gm", "#fdae61", "#4b2991")}{grad("gf", "#7b3fa0", "#2c1160")}</defs>'
b += '<rect x="30" y="30" width="360" height="250" rx="10" fill="#1e0b3a" stroke="none"/>'
tx = ""
for i, (gid, temp) in enumerate((("gm", "38,2 °C"), ("gq", "71,5 °C"), ("gm", "39,0 °C"))):
    x = 70 + i * 105
    b += f'<rect x="{x}" y="70" width="70" height="150" rx="6" fill="url(#gf)" stroke="none"/>'
    b += f'<ellipse cx="{x+35}" cy="90" rx="34" ry="24" fill="url(#{gid})" stroke="none"/>'
    tx += t(x + 35, 245, temp, "#ffffff", peso="800", tam=14) + t(x + 35, 262, ["Fase A", "Fase B", "Fase C"][i], "#c9c2e0", tam=11)
tx += f'<circle cx="210" cy="90" r="6" fill="none" stroke="#fff" stroke-width="2"/>'
b += '<rect x="410" y="40" width="18" height="230" rx="4" fill="url(#lin)" stroke="none"/>'
b = b.replace("</defs>", '<linearGradient id="lin" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#2c1160"/><stop offset=".5" stop-color="#d7301f"/><stop offset="1" stop-color="#fff3b0"/></linearGradient></defs>')
tx += t(436, 50, "quente", anc="start", tam=12) + t(436, 270, "frio", anc="start", tam=12)
tx += t(500, 110, "ΔT = 71,5 − 38,6", ORANGE, anc="start", peso="800", tam=14) + t(500, 130, "≈ 33 °C (vs. média de A e C)", ORANGE, anc="start", peso="700", tam=13)
tx += t(500, 160, "Provável mau contato", anc="start", peso="700", tam=13) + t(500, 178, "no borne da fase B", anc="start", tam=13)
tx += t(500, 208, "Prioridade alta:", RED, anc="start", peso="800", tam=13) + t(500, 226, "programar reaperto/troca", RED, anc="start", tam=13)
tx += t(330, 310, "Imagem térmica ilustrativa de três disjuntores com a mesma carga.", MUTED, tam=12)
arquivos["com-termografia"] = svg(690, 325, (b, tx))

# ===================== SEGURANÇA EM ELETRICIDADE =====================
# 1. efeitos da corrente no corpo (escala logarítmica, valores aproximados)
def xm(ma):
    return 40 + 120 * math.log10(ma / 0.1)
faixas = [(0.1, 0.5, "#d9f2e3", "não sente"), (0.5, 10, "#a8dcbc", "formigamento, susto"), (10, 30, "#ffd591", "contração muscular, pode não conseguir soltar"),
          (30, 1000, "#f4a29a", "risco de fibrilação cardíaca"), (1000, 10000, "#c0392b", "queimaduras graves, parada cardíaca")]
b, tx = "", ""
for i, (a, z, cor, txt) in enumerate(faixas):
    tx += f'<rect x="{xm(a):.1f}" y="70" width="{xm(z)-xm(a):.1f}" height="44" fill="{cor}"/>'
for ma, lbl in ((0.5, "0,5"), (10, "10"), (30, "30"), (1000, "1.000")):
    b += f'<line x1="{xm(ma):.1f}" y1="64" x2="{xm(ma):.1f}" y2="120" stroke="{INK}" stroke-width="1.5"/>'
    tx += t(xm(ma), 138, lbl + " mA", peso="700", tam=12)
desc = [(xm(0.22), 175, "não sente", "middle"), (xm(2.2), 200, "formigamento, susto", "middle"),
        (xm(17), 225, "contração muscular: pode não conseguir largar", "middle"), (xm(170), 250, "risco de fibrilação ventricular", "middle"),
        (xm(3200), 275, "queimaduras graves, parada", "end")]
for x, y, s, anc in desc:
    b += f'<line x1="{x:.1f}" y1="118" x2="{x:.1f}" y2="{y-14}" stroke="{MUTED}" stroke-width="1" stroke-dasharray="3 3"/>'
    tx += t(x + (14 if anc == "end" else 0), y, s, anc=anc, peso="600", tam=12)
b += f'<line x1="{xm(30):.1f}" y1="30" x2="{xm(30):.1f}" y2="70" stroke="{BLUE}" stroke-width="3"/>'
tx += t(xm(30), 24, "DR de 30 mA: desliga antes da faixa de fibrilação", BLUE, peso="800", tam=13)
tx += t(340, 310, "Valores aproximados, corrente alternada 60 Hz, adulto. O tempo de passagem também conta.", MUTED, tam=12)
arquivos["seg-efeitos-corrente"] = svg(690, 325, (b, tx))

# 2. tensão de toque e tensão de passo
def boneco(x, ypé, braco=None, pernas=18):
    yq = ypé - 45; yo = ypé - 85; yc = ypé - 100
    s = f'<circle cx="{x}" cy="{yc}" r="12" fill="#fff"/>' + L((x, yc+12), (x, yq))
    s += L((x, yq), (x - pernas, ypé)) + L((x, yq), (x + pernas, ypé))
    s += L((x, yo), braco) if braco else L((x, yo), (x - 18, yo + 30))
    s += L((x, yo), (x + 18, yo + 30)) if not braco or braco[0] < x else L((x, yo), (x - 18, yo + 30))
    return s
b = f'<line x1="10" y1="250" x2="660" y2="250" stroke="{MUTED}" stroke-width="3"/>'
b += f'<rect x="40" y="150" width="80" height="100" rx="6" fill="#e9ecf0"/>' + boneco(190, 250, braco=(120, 175))
b += fio([(70, 150), (70, 110), (20, 110)], RED)
tx = t(80, 205, "máquina", peso="700", tam=12) + t(80, 221, "com falha", RED, peso="700", tam=12)
tx += f'<polygon points="80,165 88,180 72,180" fill="{ORANGE}"/>'
tx += seta2(225, 172, 225, 246) + t(232, 214, "tensão de", RED, anc="start", peso="700", tam=12) + t(232, 229, "toque", RED, anc="start", peso="700", tam=12)
tx += t(150, 290, "Mão na carcaça energizada, pés no chão.", tam=12)
for r in (25, 55, 90, 130):
    b += f'<path d="M {470-r} 250 A {r} {r*0.35} 0 0 1 {470+r} 250" stroke="{ORANGE}" stroke-width="1.5" stroke-dasharray="5 4"/>'
b += fio([(390, 120), (430, 120), (470, 248)], RED) + f'<circle cx="470" cy="248" r="5" fill="{RED}"/>'
b += boneco(590, 250, pernas=32)
tx += seta2(558, 262, 622, 262) + t(590, 282, "tensão de passo", RED, peso="700", tam=12)
tx += t(470, 108, "cabo caído", RED, peso="700", tam=12) + t(470, 310, "A tensão no solo cai com a distância.", tam=12)
tx += t(470, 326, "Afaste-se com passos curtos, pés juntos.", peso="700", tam=12)
b += '<line x1="330" y1="40" x2="330" y2="320" stroke="#e2e5ea" stroke-width="2"/>'
arquivos["seg-toque-passo"] = svg(670, 340, (b, tx))

# 3. sequência de desenergização (NR-10)
passos = [("1", "Seccionamento", "abrir o circuito"), ("2", "Impedimento de", "reenergização (bloqueio)"), ("3", "Constatação da", "ausência de tensão"),
          ("4", "Aterramento temporário", "com equipotencialização"), ("5", "Proteção dos elementos", "energizados próximos"), ("6", "Sinalização de", "impedimento de religação")]
b, tx = "", ""
for i, (n, l1, l2) in enumerate(passos):
    col, lin = i % 3, i // 3
    x, y = 20 + col * 225, 40 + lin * 130
    tx += f'<rect x="{x}" y="{y}" width="200" height="90" rx="12" fill="#f6f7f9" stroke="{INK}" stroke-width="2"/>'
    tx += f'<circle cx="{x+100}" cy="{y+22}" r="14" fill="{ORANGE}"/>' + t(x + 100, y + 28, n, "#fff", peso="800", tam=14)
    tx += t(x + 100, y + 56, l1, peso="700", tam=13) + t(x + 100, y + 74, l2, MUTED, tam=12)
    if col < 2:
        tx += seta(x + 204, y + 45, x + 220, y + 45)
tx += f'<path d="M 570 130 L 570 150 L 120 150 L 120 166" fill="none" stroke="{BLUE}" stroke-width="2" marker-end="url(#sa)"/>'
tx += t(345, 285, "Só depois dos 6 passos a instalação é considerada desenergizada (NR-10, item 10.5.1).", peso="700", tam=13)
arquivos["seg-desenergizacao"] = svg(690, 300, (b, tx))

# 4. bloqueio e etiquetagem
b = f'<rect x="40" y="40" width="160" height="230" rx="12" fill="#e9ecf0"/>'
b += f'<rect x="85" y="80" width="70" height="110" rx="8" fill="#fff"/>' + f'<rect x="100" y="150" width="40" height="30" rx="4" fill="{INK}"/>'
tx = t(120, 110, "OFF", peso="800", tam=16) + t(120, 28, "seccionadora (desligada)", MUTED, tam=12)
b += f'<path d="M 120 180 L 120 215" stroke-width="5"/><rect x="95" y="212" width="50" height="70" rx="10" fill="#fff" stroke-width="4"/>'
for k in range(3):
    b += f'<circle cx="{107 + k*13}" cy="265" r="4" fill="#fff"/>'
for k, (cor, nome) in enumerate(((RED, "Ana"), (BLUE, "Bruno"), (GREEN, "Carla"))):
    x = 230 + k * 95
    b += fio([(107 + k*13, 265), (107 + k*13, 300), (x + 25, 300), (x + 25, 318)], MUTED, 2)
    b += f'<path d="M {x+12} 335 L {x+12} 322 A 13 13 0 0 1 {x+38} 322 L {x+38} 335" stroke-width="4"/>'
    tx += f'<rect x="{x}" y="333" width="50" height="45" rx="6" fill="{cor}"/>' + t(x + 25, 362, nome, "#fff", peso="700", tam=12)
b += f'<line x1="300" y1="60" x2="160" y2="215" stroke="{MUTED}" stroke-width="1.5"/>'
tx += f'<rect x="300" y="40" width="250" height="170" rx="8" fill="#fff4f2" stroke="{RED}" stroke-width="2.5"/>'
tx += t(425, 70, "PERIGO", RED, peso="800", tam=20) + t(425, 94, "NÃO LIGUE", RED, peso="800", tam=15)
for k, (a, z) in enumerate((("Responsável:", "Ana Souza"), ("Motivo:", "troca do motor M2"), ("Data:", "25/11"), ("Contato:", "manutenção"))):
    tx += t(318, 125 + k * 22, a, MUTED, anc="start", tam=12) + t(410, 125 + k * 22, z, anc="start", peso="700", tam=12)
tx += t(450, 240, "garra múltipla: a chave só religa", peso="700", tam=12, anc="middle") + t(450, 256, "quando o último cadeado sair", peso="700", tam=12)
tx += t(330, 405, "Cada trabalhador põe o seu cadeado e guarda a sua chave.", peso="700", tam=13)
arquivos["seg-loto"] = svg(600, 420, (b, tx))

# 5. RCP — compressões torácicas
b = f'<path d="M 60 300 L 60 120 Q 60 70 110 62 L 150 55 Q 175 40 200 55 L 240 62 Q 290 70 290 120 L 290 300 Z" fill="#f6f7f9"/>'
b += f'<line x1="175" y1="95" x2="175" y2="215" stroke="{MUTED}" stroke-width="2" stroke-dasharray="5 4"/>'
b += f'<ellipse cx="175" cy="185" rx="34" ry="22" fill="{ORANGE}" fill-opacity=".85" stroke="{INK}" stroke-width="2"/>'
tx = t(175, 330, "mãos sobrepostas no centro do peito", peso="700", tam=12) + t(175, 346, "(metade inferior do esterno)", MUTED, tam=12)
for k, (a, z) in enumerate((("100 a 120", "compressões por minuto"), ("5 a 6 cm", "de profundidade (adulto)"), ("Deixe o peito voltar", "entre uma compressão e outra"),
                            ("30 : 2", "se treinado; senão, só compressões"), ("Peça o DEA", "e use assim que chegar"))):
    y = 60 + k * 58
    tx += f'<rect x="330" y="{y}" width="300" height="48" rx="8" fill="#fff" stroke="#cfd5dd" stroke-width="1.5"/>'
    tx += t(345, y + 21, a, RED if k < 2 else INK, anc="start", peso="800", tam=14) + t(345, y + 38, z, MUTED, anc="start", tam=12)
tx += t(330, 30, "Ligue 192 (SAMU) antes de começar", BLUE, peso="800", tam=14, anc="start")
arquivos["seg-rcp"] = svg(660, 365, (b, tx))

# ===================== COMANDOS ELÉTRICOS — MÓDULOS 5 A 7 =====================
# 9. partida compensadora (esquema unifilar de uma fase + sequência)
b, tx = "", ""
b += L((60, 40), (60, 70))
bb, tt = fus(60, 70, 120, "F1"); b += bb; tx += tt
b += L((60, 120), (60, 150), (330, 150))
tx += dot(60, 150) + t(60, 28, "rede", RED, peso="800", tam=14)
b += L((100, 150), (100, 185))
bb, tt = ct(100, 185, 255, "na", nome="K1"); b += bb; tx += tt
b += L((100, 255), (100, 410), (166, 410))
tx += dot(100, 150)
b += L((300, 150), (300, 180))
b += '<rect x="286" y="180" width="28" height="120" fill="#fff"/>'
for yy in range(188, 300, 14):
    b += f'<path d="M 300 {yy} q 10 7 0 14" stroke-width="2"/>'
tx += dot(300, 150)
tx += t(278, 196, "100 %", MUTED, anc="end", tam=11) + t(278, 250, "65 %", ORANGE, anc="end", peso="800", tam=12) + t(278, 296, "0 %", MUTED, anc="end", tam=11)
tx += t(318, 174, "autotransformador", anc="start", peso="700", tam=12)
b += f'<polyline points="314,245 380,245 380,265" stroke="{ORANGE}" stroke-width="3"/>'
bb, tt = ct(380, 265, 320, "na"); b += bb; tx += tt
tx += t(400, 296, "K2", anc="start", peso="700", tam=14)
b += L((380, 320), (380, 410), (234, 410))
b += L((300, 300), (300, 312), (262, 312))
bb, tt = ct(262, 312, 365, "na"); b += bb; tx += tt
tx += t(236, 345, "K3", anc="end", peso="700", tam=14)
b += L((262, 365), (262, 378)) + '<line x1="246" y1="378" x2="278" y2="378"/>'
tx += t(292, 382, "fecha a estrela", MUTED, anc="start", tam=11)
bb, tt = motor(200, 410, 34); b += bb; tx += tt
lin = [("Etapa", "K1", "K2", "K3", "tensão no motor"), ("1 · partida", "—", "liga", "liga", "65 % (derivação)"), ("2 · transição", "—", "liga", "abre", "autotrafo vira reator"), ("3 · regime", "liga", "abre", "—", "100 % (rede)")]
for i, row in enumerate(lin):
    y = 70 + i * 34
    if i == 0:
        b += f'<rect x="470" y="{y-22}" width="400" height="30" rx="5" fill="#eef2f7" stroke="none"/>'
    for j, (xx, cel) in enumerate(zip((480, 590, 640, 690, 740), row)):
        cor = INK if i == 0 or cel == "—" else (GREEN if cel == "liga" else RED if cel == "abre" else INK)
        tx += t(xx, y, cel, cor, anc="start", peso="800" if i == 0 or j == 0 else "600", tam=12)
tx += t(670, 230, "A corrente puxada da rede cai para", peso="700", tam=13) + t(670, 248, "≈ 0,65² ≈ 42 % da partida direta", ORANGE, peso="800", tam=13)
tx += t(670, 278, "Derivações usuais: 50 %, 65 % e 80 %", MUTED, tam=12)
tx += t(670, 296, "K1 nunca liga junto com K2/K3 (intertravamento)", MUTED, tam=12)
tx += t(440, 468, "Esquema simplificado de UMA fase (o real repete para as três).", MUTED, tam=12)
arquivos["cmd-compensadora"] = svg(890, 485, (b, tx))

# 10. Dahlander: baixa (Δ) e alta (YY)
b, tx = "", ""
V = [(170, 60), (70, 235), (270, 235)]           # vértices 1, 2, 3
M = [((V[0][0]+V[1][0])/2, (V[0][1]+V[1][1])/2), ((V[1][0]+V[2][0])/2, (V[1][1]+V[2][1])/2), ((V[2][0]+V[0][0])/2, (V[2][1]+V[0][1])/2)]
for (a, c) in ((0, 1), (1, 2), (2, 0)):
    xa, ya = V[a]; xc, yc = V[c]
    xm_, ym_ = (xa + xc) / 2, (ya + yc) / 2
    for (p1, p2) in (((xa, ya), (xm_, ym_)), ((xm_, ym_), (xc, yc))):
        bb, tt = bobina_rot(p1[0], p1[1], p2[0], p2[1], (0, 0, "")); b += bb
for (vx, vy), n in zip(V, ("1", "2", "3")):
    tx += dot(vx, vy)
for (mx_, my_), n in zip(M, ("4", "5", "6")):
    tx += f'<circle cx="{mx_:.1f}" cy="{my_:.1f}" r="5" fill="#fff" stroke="{INK}" stroke-width="2"/>'
tx += t(170, 44, "1 ← L1", RED, peso="800", tam=13) + t(48, 262, "L2 → 2", RED, peso="800", tam=13) + t(292, 262, "3 ← L3", RED, peso="800", tam=13)
tx += t(M[0][0] - 14, M[0][1], "4", MUTED, anc="end", peso="700", tam=13) + t(M[1][0], M[1][1] + 26, "5", MUTED, peso="700", tam=13) + t(M[2][0] + 14, M[2][1], "6", MUTED, anc="start", peso="700", tam=13)
tx += t(170, 305, "BAIXA velocidade — triângulo (Δ)", peso="800", tam=14) + t(170, 324, "L1-1, L2-2, L3-3 · 4, 5 e 6 livres", MUTED, tam=12)
tx += t(170, 342, "mais polos → menor rotação", MUTED, tam=12)
# alta YY
cx, cy = 520, 160
P = [(520, 50), (420, 230), (620, 230)]
for (px, py) in P:
    ang = math.atan2(py - cy, px - cx); ux, uy = math.cos(ang), math.sin(ang)
    a1 = (cx + ux * 28, cy + uy * 28); a2 = (px - ux * 12, py - uy * 12)
    b += L((cx, cy), a1) + L(a2, (px, py))
    for d in (-12, 12):
        ox, oy = -uy * d, ux * d
        b += L(a1, (a1[0] + ox, a1[1] + oy)) + L(a2, (a2[0] + ox, a2[1] + oy))
        bb, tt = bobina_rot(a1[0] + ox, a1[1] + oy, a2[0] + ox, a2[1] + oy, (0, 0, "")); b += bb
    tx += dot(px, py)
tx += dot(cx, cy) + t(cx + 30, cy - 18, "centro: 1-2-3 unidos", ORANGE, anc="start", peso="800", tam=12)
tx += t(520, 36, "4 ← L1", RED, peso="800", tam=13) + t(398, 258, "L2 → 5", RED, peso="800", tam=13) + t(642, 258, "6 ← L3", RED, peso="800", tam=13)
tx += t(520, 305, "ALTA velocidade — dupla estrela (YY)", peso="800", tam=14) + t(520, 324, "L1-4, L2-5, L3-6 · 1-2-3 em curto", MUTED, tam=12)
tx += t(520, 342, "metade dos polos → o dobro da rotação", MUTED, tam=12)
b += '<line x1="345" y1="30" x2="345" y2="340" stroke="#e2e5ea" stroke-width="2"/>'
tx += t(345, 372, "Exemplo: motor 4/2 polos em 60 Hz → 1.800 / 3.600 rpm síncronas (≈ 1.740 / 3.500 rpm na placa).", peso="700", tam=13)
arquivos["cmd-dahlander"] = svg(690, 390, (b, tx))

# 11. frenagem por injeção de CC (bloco) + gráfico de rotação
b, tx = "", ""
xs = (70, 110, 150)
for x, n in zip(xs, ("L1", "L2", "L3")):
    tx += t(x, 28, n, RED, peso="800", tam=13)
    b += L((x, 36), (x, 70))
bb, tt = contatos3(xs, 70, 140, "K1"); b += bb; tx += tt
b += "".join(L((x, 140), (x, 230)) for x in xs)
bb, tt = motor(110, 265, 34); b += bb; tx += tt
# fonte CC
b += f'<rect x="210" y="70" width="110" height="70" rx="8" fill="#fff"/>'
tx += t(265, 98, "trafo +", peso="700", tam=12) + t(265, 116, "retificador", peso="700", tam=12) + t(265, 132, "(CC)", BLUE, peso="800", tam=12)
b += L((230, 140), (230, 160))
bb, tt = ct(230, 160, 215, "na"); b += bb
b += L((300, 140), (300, 160))
bb, tt = ct(300, 160, 215, "na"); b += bb
tx += t(335, 192, "K2", anc="start", peso="700", tam=14)
b += f'<polyline points="230,215 230,200 230,205" />' + f'<polyline points="230,215 230,215 70,215" stroke="{BLUE}" stroke-width="3"/>' + f'<polyline points="300,215 300,198" />'
b += f'<polyline points="300,215 300,222 110,222" stroke="{BLUE}" stroke-width="3"/>'
tx += dot(70, 215) + dot(110, 222)
tx += t(160, 254, "CC em duas fases", BLUE, anc="start", peso="700", tam=12)
tx += t(190, 330, "K1 desliga → K2 injeta CC por poucos segundos", peso="700", tam=12)
tx += t(190, 346, "(K1 e K2 intertravados; temporizador limita o tempo)", MUTED, tam=11)
# gráfico rotação x tempo
gx, gy, gw, gh = 420, 60, 300, 220
b += L((gx, gy), (gx, gy + gh), (gx + gw, gy + gh))
tx += t(gx - 8, gy + 6, "rpm", MUTED, anc="end", tam=12) + t(gx + gw, gy + gh + 20, "tempo", MUTED, anc="end", tam=12)
b += f'<path d="M {gx} {gy+20} C {gx+90} {gy+30}, {gx+200} {gy+150}, {gx+290} {gy+gh-2}" stroke="{MUTED}" stroke-width="3" stroke-dasharray="7 5"/>'
b += f'<path d="M {gx} {gy+20} C {gx+30} {gy+40}, {gx+60} {gy+150}, {gx+95} {gy+gh-2}" stroke="{RED}" stroke-width="3.5"/>'
tx += t(gx + 210, gy + 120, "parada livre", MUTED, anc="start", peso="700", tam=12) + t(gx + 210, gy + 136, "(só o atrito freia)", MUTED, anc="start", tam=11)
tx += t(gx + 100, gy + gh - 30, "com frenagem CC", RED, anc="start", peso="700", tam=12)
tx += t(gx + gw / 2, gy + gh + 50, "A CC cria um campo parado que segura o rotor.", peso="700", tam=12)
arquivos["cmd-frenagem"] = svg(740, 360, (b, tx))

# 12. partida sequencial (comando): M2 só liga depois de M1
b, tx = trilhos(40, 560, 40, 500)
p = [fus(110, 40, 100, "F21"),
     ct(110, 100, 160, "nf", acion="termico", nome="F7", nums=("95", "96")),
     ct(110, 160, 220, "nf", acion="termico", nome="F8", nums=("95", "96")),
     ct(110, 220, 285, "nf", acion="botao", nome="S0"),
     ct(110, 285, 365, "na", acion="botao", nome="S1"), ct(200, 285, 365, "na", nome="K1", nums=("13", "14")),
     bob(110, 365, 500, "K1"),
     ct(390, 285, 365, "na", acion="botao", nome="S2"), ct(480, 285, 365, "na", nome="K2", nums=("13", "14")),
     ct(390, 365, 425, "na", nome="K1", nums=("43", "44")), bob(390, 425, 500, "K2")]
bb, tt = soma(*p); b += bb; tx += tt
b += L((110, 285), (480, 285)) + L((110, 365), (200, 365)) + L((390, 365), (480, 365))
tx += dot(110, 285) + dot(200, 285) + dot(390, 285) + dot(110, 365) + dot(390, 365)
tx += f'<rect x="326" y="368" width="124" height="66" rx="8" fill="none" stroke="{ORANGE}" stroke-width="2" stroke-dasharray="6 5"/>'
tx += t(460, 392, "permissão:", ORANGE, anc="start", peso="800", tam=12) + t(460, 408, "só com K1 ligado", ORANGE, anc="start", tam=12)
tx += t(110, 528, "K1 — esteira 1 (descarga)", peso="700", tam=13) + t(390, 528, "K2 — esteira 2 (alimenta a 1)", peso="700", tam=13)
tx += t(300, 556, "Se K1 desligar (ou F7 desarmar), K2 cai junto: nada se acumula na esteira 1.", peso="700", tam=13)
arquivos["cmd-sequencial"] = svg(600, 570, (b, tx))

# 13. bomba com boia e seletor manual/automático
b, tx = trilhos(40, 600, 40, 500)
p = [fus(110, 40, 100, "F21"),
     ct(110, 100, 160, "nf", acion="termico", nome="F7", nums=("95", "96")),
     ct(110, 160, 225, "nf", nome="KFF", nums=("11", "12"))]
bb, tt = soma(*p); b += bb; tx += tt
b += L((110, 225), (110, 245), (450, 245))
tx += dot(110, 245)
# ramo MANUAL
p = [ct(180, 245, 305, "na", nome="SA-M"), ct(180, 305, 365, "nf", acion="botao", nome="S0"),
     ct(180, 365, 430, "na", acion="botao", nome="S1"), ct(270, 365, 430, "na", nome="K1", nums=("13", "14"))]
bb, tt = soma(*p); b += bb; tx += tt
b += L((180, 365), (270, 365)) + L((180, 430), (270, 430)) + L((180, 430), (180, 440), (330, 440))
tx += dot(180, 365) + dot(180, 430)
# ramo AUTOMÁTICO
p = [ct(450, 245, 305, "na", nome="SA-A"), ct(450, 305, 370, "nf", nome="B1"), ct(450, 370, 430, "na", nome="B2")]
bb, tt = soma(*p); b += bb; tx += tt
b += L((450, 430), (450, 440), (330, 440))
tx += dot(330, 440)
bb, tt = bob(330, 440, 500); b += bb; tx += tt
tx += t(300, 476, "K1", anc="end", peso="700", tam=14)
tx += t(480, 342, "boia da caixa superior", anc="start", tam=11) + t(480, 356, "abre quando ENCHE", ORANGE, anc="start", peso="700", tam=11)
tx += t(480, 404, "boia da cisterna", anc="start", tam=11) + t(480, 418, "fecha se HÁ ÁGUA", ORANGE, anc="start", peso="700", tam=11)
tx += t(210, 278, "manual", MUTED, anc="start", tam=11) + t(480, 278, "automático", MUTED, anc="start", tam=11)
tx += t(150, 200, "relé falta de fase", MUTED, anc="start", tam=11)
tx += t(320, 528, "Seletor SA: Manual (botões) · 0 (desligado) · Automático (boias). KFF desliga se faltar fase.", peso="700", tam=12)
arquivos["cmd-boia"] = svg(640, 545, (b, tx))

for nome, conteudo in arquivos.items():
    open(os.path.join(OUT, nome + ".svg"), "w", encoding="utf-8").write(conteudo)
print(len(arquivos), "arquivos")
