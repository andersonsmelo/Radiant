#!/usr/bin/env python3
"""Build the printable A4 user-flow diagram from docs/CLIENT_FLOW.md."""

from pathlib import Path

from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4, landscape
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "docs" / "CLIENT_FLOW_PRINT.pdf"

NAVY = HexColor("#101A3A")
BLUE = HexColor("#3157D5")
PURPLE = HexColor("#7357D8")
TEAL = HexColor("#13877C")
AMBER = HexColor("#C07A16")
INK = HexColor("#182033")
MUTED = HexColor("#5C657A")
LINE = HexColor("#CBD2E1")
PAPER = HexColor("#FFFFFF")
SOFT_BLUE = HexColor("#EEF2FF")
SOFT_PURPLE = HexColor("#F4F0FF")
SOFT_TEAL = HexColor("#EAF8F5")
SOFT_AMBER = HexColor("#FFF5E5")
SOFT_GRAY = HexColor("#F5F7FA")


def centered_text(c, text, x, y, size, color=INK, font="Helvetica"):
    c.setFont(font, size)
    c.setFillColor(color)
    c.drawString(x - stringWidth(text, font, size) / 2, y, text)


def box(c, x, y, w, h, title, subtitle="", fill=PAPER, stroke=LINE, title_size=9):
    c.setFillColor(fill)
    c.setStrokeColor(stroke)
    c.setLineWidth(1.25)
    c.roundRect(x, y, w, h, 8, fill=1, stroke=1)
    title_y = y + h / 2 + (4 if subtitle else -3)
    centered_text(c, title, x + w / 2, title_y, title_size, INK, "Helvetica-Bold")
    if subtitle:
        lines = subtitle.split("\n")
        start_y = y + h / 2 - 9 + (len(lines) - 1) * 4
        for index, line in enumerate(lines):
            centered_text(c, line, x + w / 2, start_y - index * 9, 6.8, MUTED)


def arrow(c, x1, y1, x2, y2, color=BLUE, dashed=False, width=1.6):
    c.saveState()
    c.setStrokeColor(color)
    c.setFillColor(color)
    c.setLineWidth(width)
    if dashed:
        c.setDash(4, 3)
    c.line(x1, y1, x2, y2)
    if abs(x2 - x1) >= abs(y2 - y1):
        direction = 1 if x2 > x1 else -1
        points = [(x2, y2), (x2 - 7 * direction, y2 + 3.5), (x2 - 7 * direction, y2 - 3.5)]
    else:
        direction = 1 if y2 > y1 else -1
        points = [(x2, y2), (x2 - 3.5, y2 - 7 * direction), (x2 + 3.5, y2 - 7 * direction)]
    path = c.beginPath()
    path.moveTo(*points[0])
    path.lineTo(*points[1])
    path.lineTo(*points[2])
    path.close()
    c.drawPath(path, fill=1, stroke=0)
    c.restoreState()


def polyline_arrow(c, points, color=BLUE, dashed=False, width=1.4):
    c.saveState()
    c.setStrokeColor(color)
    c.setFillColor(color)
    c.setLineWidth(width)
    if dashed:
        c.setDash(4, 3)
    path = c.beginPath()
    path.moveTo(*points[0])
    for point in points[1:]:
        path.lineTo(*point)
    c.drawPath(path, fill=0, stroke=1)
    x1, y1 = points[-2]
    x2, y2 = points[-1]
    if abs(x2 - x1) >= abs(y2 - y1):
        direction = 1 if x2 > x1 else -1
        head = [(x2, y2), (x2 - 7 * direction, y2 + 3.5), (x2 - 7 * direction, y2 - 3.5)]
    else:
        direction = 1 if y2 > y1 else -1
        head = [(x2, y2), (x2 - 3.5, y2 - 7 * direction), (x2 + 3.5, y2 - 7 * direction)]
    arrowhead = c.beginPath()
    arrowhead.moveTo(*head[0])
    arrowhead.lineTo(*head[1])
    arrowhead.lineTo(*head[2])
    arrowhead.close()
    c.drawPath(arrowhead, fill=1, stroke=0)
    c.restoreState()


def build():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    width, height = landscape(A4)
    c = canvas.Canvas(str(OUTPUT), pagesize=(width, height), pageCompression=1)
    c.setTitle("Radiant - fluxo do usuário no app")
    c.setAuthor("Radiant")
    c.setSubject("Jornada canônica da pessoa dentro do aplicativo Radiant")

    c.setFillColor(PAPER)
    c.rect(0, 0, width, height, fill=1, stroke=0)

    # Header
    c.setFillColor(NAVY)
    c.circle(42, 553, 16, fill=1, stroke=0)
    centered_text(c, "R", 42, 547.5, 16, white, "Helvetica-Bold")
    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 19)
    c.drawString(70, 553, "Radiant - jornada da pessoa no app")
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 8.5)
    c.drawString(70, 536, "Fluxo canônico derivado do código | versão para impressão A4")
    c.setStrokeColor(LINE)
    c.setLineWidth(0.8)
    c.line(28, 520, width - 28, 520)

    # Entry flow
    centered_text(c, "ENTRADA E PRIMEIRA EXPERIÊNCIA", 214, 501, 7.5, BLUE, "Helvetica-Bold")
    entry_y, entry_h = 441, 46
    entry = [
        (30, 102, "Instalação", ""),
        (158, 142, "Apresentação do Pixel", "3 telas, puláveis"),
        (326, 142, "Onboarding", "especialidade + meta diária"),
        (494, 142, "Home", "Foco de hoje"),
    ]
    for x, w, title, subtitle in entry:
        fill = SOFT_PURPLE if title == "Home" else PAPER
        stroke = PURPLE if title == "Home" else LINE
        box(c, x, entry_y, w, entry_h, title, subtitle, fill, stroke, 9.2)
    for left, right in zip(entry, entry[1:]):
        arrow(c, left[0] + left[1] + 5, entry_y + entry_h / 2, right[0] - 5, entry_y + entry_h / 2)

    # Main recommendation path
    box(c, 515, 339, 158, 54, "Próximo passo recomendado", "um único CTA; o rótulo\nmuda com o estado", SOFT_BLUE, BLUE, 9.5)
    arrow(c, 565, entry_y - 5, 565, 398, PURPLE)
    centered_text(c, "CTA principal", 615, 414, 6.8, PURPLE, "Helvetica-Bold")

    # Free navigation panel
    panel_x, panel_y, panel_w, panel_h = 28, 205, 445, 186
    c.setFillColor(SOFT_GRAY)
    c.setStrokeColor(LINE)
    c.setLineWidth(1)
    c.roundRect(panel_x, panel_y, panel_w, panel_h, 10, fill=1, stroke=1)
    c.setFillColor(TEAL)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(panel_x + 14, panel_y + panel_h - 19, "NAVEGAÇÃO LIVRE A PARTIR DA HOME")

    galaxy_y = panel_y + 83
    box(c, 44, galaxy_y, 102, 44, "Galáxia: mapa", "", PAPER, TEAL, 8.7)
    box(c, 166, galaxy_y, 132, 44, "Interior da galáxia", "ativo | disponível | bloqueado", PAPER, TEAL, 8.1)
    box(c, 318, galaxy_y, 136, 44, "Interior do planeta", "leva ao próximo passo", PAPER, TEAL, 8.3)
    arrow(c, 151, galaxy_y + 22, 161, galaxy_y + 22, TEAL)
    arrow(c, 303, galaxy_y + 22, 313, galaxy_y + 22, TEAL)

    secondary_y = panel_y + 22
    box(c, 44, secondary_y, 112, 38, "Progresso", "XP | sequência | precisão", PAPER, LINE, 8.4)
    box(c, 173, secondary_y, 92, 38, "Missões", "", PAPER, LINE, 8.4)
    box(c, 282, secondary_y, 172, 38, "Ajuda e informações", "privacidade | suporte", PAPER, LINE, 8.2)

    polyline_arrow(c, [(505, entry_y + 8), (482, entry_y + 8), (482, 376), (466, 376)], TEAL, dashed=True)
    centered_text(c, "atalhos", 486, 395, 6.5, TEAL, "Helvetica-Bold")
    polyline_arrow(c, [(454, galaxy_y + 22), (486, galaxy_y + 22), (486, 366), (510, 366)], TEAL, dashed=True)

    # Outcomes
    c.setFillColor(AMBER)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(510, 298, "TIPOS DE PRÓXIMO PASSO")
    outcomes = [
        (493, "Lição"),
        (582, "Checkpoint"),
        (671, "Revisão"),
        (760, "Conquista"),
    ]
    branch_y = 280
    c.setStrokeColor(AMBER)
    c.setLineWidth(1.4)
    c.line(594, 334, 594, branch_y)
    c.line(530, branch_y, 797, branch_y)
    for x, title in outcomes:
        box(c, x - 37, 216, 74, 42, title, "volta à Home", SOFT_AMBER, AMBER, 8.3)
        arrow(c, x, branch_y, x, 263, AMBER)

    # Loop back without crossing the flow.
    polyline_arrow(c, [(797, 216), (817, 216), (817, 464), (641, 464)], PURPLE, dashed=True, width=1.2)
    centered_text(c, "concluiu", 796, 474, 6.5, PURPLE, "Helvetica-Bold")

    # Bottom notes
    note_y = 105
    c.setFillColor(NAVY)
    c.roundRect(28, note_y, width - 56, 70, 10, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(46, note_y + 47, "Como ler este fluxo")
    c.setFont("Helvetica", 8)
    c.drawString(46, note_y + 30, "A Home recomenda um único próximo passo. Galáxia, Progresso, Missões e Ajuda continuam acessíveis livremente.")
    c.drawString(46, note_y + 16, "Lição, checkpoint, revisão e conquista retornam à Home, que recalcula a recomendação seguinte.")
    c.setFillColor(HexColor("#BFD3FF"))
    c.setFont("Helvetica-Bold", 8)
    c.drawRightString(width - 46, note_y + 31, "SEM CONTA  |  SEM REDE")
    c.setFont("Helvetica", 7)
    c.drawRightString(width - 46, note_y + 17, "XP, sequência e catálogo persistem no aparelho")

    # Footer
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 6.8)
    c.drawString(28, 79, "Fonte: docs/CLIENT_FLOW.md - comportamento observado no código em 06 ago 2026")
    c.drawRightString(width - 28, 79, "Radiant | Educação em radiologia")
    c.setStrokeColor(LINE)
    c.line(28, 91, width - 28, 91)
    c.setFillColor(HexColor("#8790A4"))
    c.setFont("Helvetica", 6.3)
    c.drawCentredString(width / 2, 54, "Documento operacional: se o comportamento do app mudar, atualize o fluxo e esta folha no mesmo commit.")

    c.showPage()
    c.save()


if __name__ == "__main__":
    build()
