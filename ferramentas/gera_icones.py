"""Gera os ícones do app (PWA) em assets/icones/.

Uso (na raiz do projeto):  python3 ferramentas/gera_icones.py
Desenho: quadrado azul industrial, raio amarelo de segurança e faixa zebrada embaixo.
"""
import os
from PIL import Image, ImageDraw

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SAIDA = os.path.join(RAIZ, "assets", "icones")
os.makedirs(SAIDA, exist_ok=True)

AZUL = (15, 29, 48)
AZUL2 = (29, 58, 96)
AMARELO = (245, 179, 0)
N = 1024  # desenha grande e reduz (antialias)


def desenhar(cantos_redondos: bool, escala_conteudo: float) -> Image.Image:
    img = Image.new("RGBA", (N, N), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    raio = int(N * 0.22) if cantos_redondos else 0
    # fundo com leve degradê vertical
    fundo = Image.new("RGBA", (N, N))
    fd = ImageDraw.Draw(fundo)
    for y in range(N):
        t = y / N
        cor = tuple(int(AZUL2[i] * (1 - t) + AZUL[i] * t) for i in range(3)) + (255,)
        fd.line([(0, y), (N, y)], fill=cor)
    mascara = Image.new("L", (N, N), 0)
    ImageDraw.Draw(mascara).rounded_rectangle([0, 0, N - 1, N - 1], radius=raio, fill=255)
    img.paste(fundo, (0, 0), mascara)

    # faixa zebrada (amarelo/azul) na base
    faixa = Image.new("RGBA", (N, N), (0, 0, 0, 0))
    fz = ImageDraw.Draw(faixa)
    h0 = int(N * (1 - 0.13 * escala_conteudo)) if escala_conteudo < 1 else int(N * 0.87)
    passo = N // 10
    for x in range(-N, 2 * N, passo):
        fz.polygon([(x, N), (x + passo // 2, N), (x + passo // 2 + (N - h0), h0), (x + (N - h0), h0)], fill=AMARELO + (255,))
    corte = Image.new("L", (N, N), 0)
    ImageDraw.Draw(corte).rectangle([0, h0, N, N], fill=255)
    corte = Image.composite(corte, Image.new("L", (N, N), 0), mascara)
    img.paste(faixa, (0, 0), Image.composite(faixa.split()[3], Image.new("L", (N, N), 0), corte))

    # raio
    pontos = [(0.56, 0.10), (0.24, 0.58), (0.46, 0.58), (0.40, 0.90), (0.74, 0.42), (0.52, 0.42), (0.56, 0.10)]
    c = N / 2
    s = escala_conteudo * 0.82
    desloc_y = -0.04 * N * escala_conteudo
    poly = [(c + (x - 0.5) * N * s, c + (y - 0.5) * N * s + desloc_y) for x, y in pontos]
    d.polygon(poly, fill=AMARELO + (255,))
    return img


def salvar(img: Image.Image, nome: str, tam: int, fundo_opaco=False):
    im = img.resize((tam, tam), Image.LANCZOS)
    if fundo_opaco:
        base = Image.new("RGB", (tam, tam), AZUL)
        base.paste(im, (0, 0), im)
        im = base
    im.save(os.path.join(SAIDA, nome), optimize=True)


normal = desenhar(cantos_redondos=True, escala_conteudo=1.0)
maskable = desenhar(cantos_redondos=False, escala_conteudo=0.78)  # conteúdo dentro da zona segura (80 %)
quadrado = desenhar(cantos_redondos=False, escala_conteudo=0.9)

salvar(normal, "icone-192.png", 192)
salvar(normal, "icone-512.png", 512)
salvar(maskable, "icone-maskable-512.png", 512, fundo_opaco=True)
salvar(maskable, "icone-maskable-192.png", 192, fundo_opaco=True)
salvar(quadrado, "apple-touch-icon.png", 180, fundo_opaco=True)  # iPhone arredonda sozinho
salvar(normal, "favicon-32.png", 32)
print("ícones gerados em", SAIDA)
