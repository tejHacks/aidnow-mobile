"""AidNow "how to help" scenes: one picture per guide showing the key action,
with a helper (teal shirt) and the person being helped (orange shirt).

Each scene matches the guide's own steps in src/data/guides.ts. Figures are
built from rounded capsules so they read clearly at phone size.

Writes SVGs (320×200 viewBox) to tool/scenes/. Render with tool/render-scenes.mjs.
"""
import os

OUT = os.path.join(os.path.dirname(__file__), "scenes")
os.makedirs(OUT, exist_ok=True)

# Palette
HELPER, HELPER_DARK = "#0E7490", "#0B5566"
PATIENT, PATIENT_DARK = "#EA580C", "#B4440A"
SKIN_A, SKIN_B, HAIR = "#8D5524", "#C68642", "#2B1B12"
PANTS, PANTS_B = "#334155", "#475569"
FLOOR, WALL = "#E7E0D6", "#F6F1EA"
RED, WHITE, SKY, WATER, GREEN, YELLOW, GREY = "#E11D48", "#FFFFFF", "#BAE6FD", "#38BDF8", "#16A34A", "#FACC15", "#94A3B8"


def svg(*parts):
    body = "".join(parts)
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200">'
        f'<rect width="320" height="200" rx="24" fill="{WALL}"/>'
        f'<rect y="168" width="320" height="32" fill="{FLOOR}"/>'
        f"{body}</svg>"
    )


def line(x1, y1, x2, y2, w, color):
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{w}" stroke-linecap="round"/>'


def poly(points, w, color):
    pts = " ".join(f"{x},{y}" for x, y in points)
    return f'<polyline points="{pts}" fill="none" stroke="{color}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"/>'


def head(cx, cy, skin, r=13, hair=True, face=None):
    """Round head; `face` = 'right'|'left'|'up'|'down' adds a nose bump on that side."""
    out = f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{skin}"/>'
    if hair:
        out += f'<path d="M{cx - r} {cy - 2} A{r} {r} 0 0 1 {cx + r} {cy - 2} Q{cx} {cy - r * 0.55} {cx - r} {cy - 2} Z" fill="{HAIR}"/>'
    if face == "right":
        out += f'<circle cx="{cx + r * 0.95}" cy="{cy + 2}" r="3" fill="{skin}"/>'
    if face == "left":
        out += f'<circle cx="{cx - r * 0.95}" cy="{cy + 2}" r="3" fill="{skin}"/>'
    return out


def arrow(x1, y1, x2, y2, color=RED, w=4):
    """A short action arrow from (x1,y1) to (x2,y2)."""
    import math
    a = math.atan2(y2 - y1, x2 - x1)
    hx1, hy1 = x2 - 9 * math.cos(a - 0.5), y2 - 9 * math.sin(a - 0.5)
    hx2, hy2 = x2 - 9 * math.cos(a + 0.5), y2 - 9 * math.sin(a + 0.5)
    return line(x1, y1, x2, y2, w, color) + f'<polygon points="{x2},{y2} {hx1:.1f},{hy1:.1f} {hx2:.1f},{hy2:.1f}" fill="{color}"/>'


def phone(x, y, s=1.0):
    return (f'<g transform="translate({x} {y}) scale({s})"><rect x="-8" y="-14" width="16" height="28" rx="3" fill="{PANTS}"/>'
            f'<rect x="-6" y="-10" width="12" height="18" rx="1.5" fill="{SKY}"/><circle cx="0" cy="11" r="1.4" fill="{WHITE}"/></g>')


def lying_on_back(x=60, skin=SKIN_B, shirt=PATIENT, legs_raised=False):
    """Patient lying on their back, head on the left, at floor level."""
    y = 156
    out = head(x, y - 2, skin, face="up")
    out += line(x + 16, y, x + 92, y, 24, shirt)  # torso
    out += line(x + 30, y + 4, x + 70, y + 8, 8, skin)  # near arm along side
    if legs_raised:
        out += poly([(x + 98, y), (x + 140, y - 30), (x + 180, y - 34)], 15, PANTS)
    else:
        out += line(x + 98, y + 1, x + 172, y + 4, 15, PANTS)
    return out


def standing(x, skin, shirt, facing="right", arms=None, pants=PANTS):
    """Upright figure. Feet at y=166. `arms` is a list of polyline point lists."""
    out = line(x - 6, 120, x - 8, 164, 12, pants) + line(x + 6, 120, x + 8, 164, 12, pants)
    out += line(x, 72, x, 118, 26, shirt)
    out += head(x, 50, skin, face=facing)
    for pts in arms or []:
        out += poly(pts, 8, skin)
    return out


def sitting(x, skin, shirt, lean=0, facing="right", chair=True):
    """Seated figure on a stool; hips at (x,128). lean shifts the shoulders forward."""
    out = ""
    if chair:
        out += f'<rect x="{x - 22}" y="128" width="44" height="8" rx="3" fill="{GREY}"/>' + line(x - 16, 136, x - 16, 166, 5, GREY) + line(x + 16, 136, x + 16, 166, 5, GREY)
    d = 1 if facing == "right" else -1
    out += poly([(x, 128), (x + 30 * d, 130), (x + 32 * d, 164)], 13, PANTS)
    out += line(x, 126, x + lean * d, 84, 24, shirt)
    out += head(x + (lean + 2) * d, 62, skin, face=facing)
    return out


scenes = {}

# CPR: helper kneels beside, straight arms, hands stacked on the centre of the chest, pushing down.
scenes["cpr"] = svg(
    # helper kneels behind the patient, level with the chest (legs and body drawn first, behind)
    line(128, 122, 134, 160, 14, PANTS), line(134, 160, 176, 162, 14, PANTS),
    line(128, 120, 102, 82, 26, HELPER),
    lying_on_back(40),
    # arms straight, hands stacked on the centre of the chest (drawn on top)
    line(98, 88, 90, 138, 9, SKIN_A), line(106, 90, 96, 138, 9, SKIN_A),
    f'<rect x="80" y="136" width="22" height="9" rx="4" fill="{SKIN_A}"/>',
    head(94, 62, SKIN_A, face="left"),
    arrow(66, 100, 66, 128), arrow(122, 100, 122, 128),
    f'<text x="196" y="44" font-family="Helvetica,Arial" font-weight="800" font-size="20" fill="{RED}">100 to 120</text>',
    f'<text x="198" y="62" font-family="Helvetica,Arial" font-weight="700" font-size="12" fill="{PANTS}">pushes a minute</text>',
)

# Seizure: person on the floor, jacket cushioning the head, space cleared, helper kneels by the head NOT holding them; timer running.
scenes["seizure"] = svg(
    # helper kneels behind, near the head, hands open (not holding them down)
    line(96, 118, 106, 160, 14, PANTS), line(106, 160, 142, 162, 14, PANTS),
    line(96, 116, 76, 80, 26, HELPER),
    f'<rect x="18" y="150" width="38" height="14" rx="7" fill="{HELPER_DARK}"/>',  # folded jacket cushions the head
    lying_on_back(40),
    poly([(78, 90), (58, 112), (62, 120)], 8, SKIN_A),
    head(70, 58, SKIN_A, face="left"),
    *[line(80 + i * 22, 132, 86 + i * 22, 126, 3, PATIENT_DARK) for i in range(4)],  # movement marks
    f'<g opacity=".4"><circle cx="246" cy="160" r="6" fill="{GREY}"/><rect x="280" y="144" width="22" height="16" rx="3" fill="{GREY}"/></g>',
    arrow(214, 160, 236, 160, GREY, 3), arrow(256, 150, 276, 140, GREY, 3),  # hard objects moved away
    f'<g transform="translate(266 50)"><circle r="22" fill="{WHITE}" stroke="{HELPER}" stroke-width="5"/>'
    f'<line x1="0" y1="0" x2="0" y2="-13" stroke="{PANTS}" stroke-width="4" stroke-linecap="round"/><line x1="0" y1="0" x2="9" y2="5" stroke="{RED}" stroke-width="4" stroke-linecap="round"/>'
    f'<rect x="-5" y="-30" width="10" height="7" rx="2" fill="{HELPER}"/></g>',
)

# Fainting: on their back with legs raised about 30 cm on a box/chair.
scenes["fainting"] = svg(
    f'<rect x="196" y="120" width="56" height="48" rx="6" fill="{GREY}"/>',
    lying_on_back(40, legs_raised=True),
    arrow(286, 160, 286, 126, RED, 4),
    f'<text x="262" y="112" font-family="Helvetica,Arial" font-weight="800" font-size="14" fill="{RED}">30 cm</text>',
)

# Choking (adult): helper stands behind, fist just above the belly button, pulls in and up.
scenes["choking"] = svg(
    standing(150, SKIN_B, PATIENT, facing="right", arms=[[(150, 82), (176, 70), (178, 56)]]),  # hand to throat
    standing(122, SKIN_A, HELPER, facing="right", arms=[[(122, 84), (148, 106), (154, 104)]]),
    f'<circle cx="157" cy="104" r="7" fill="{SKIN_A}"/>',  # fist above navel
    arrow(176, 116, 166, 96, RED, 4),
)

# Choking (baby): baby face down along the forearm, head lower than bottom, heel-of-hand back blows.
scenes["choking-baby"] = svg(
    sitting(96, SKIN_A, HELPER, lean=6, facing="right"),
    poly([(104, 92), (126, 120), (176, 126)], 9, SKIN_A),  # forearm along thigh
    line(140, 116, 184, 122, 16, PATIENT),  # baby body face down on forearm
    head(194, 128, SKIN_B, r=10, face="down"),  # head lower
    poly([(102, 82), (132, 70), (152, 96)], 8, SKIN_A),  # other arm, heel of hand over back
    arrow(156, 76, 156, 104, RED, 4),
)

# Bleeding: firm pressure with a cloth on the wound.
scenes["bleeding"] = svg(
    line(40, 140, 230, 146, 28, SKIN_B),  # forearm close-up
    f'<ellipse cx="140" cy="140" rx="34" ry="18" fill="{WHITE}" stroke="{GREY}" stroke-width="2"/>',  # cloth
    f'<circle cx="160" cy="146" r="5" fill="{RED}" opacity=".85"/>',
    poly([(220, 40), (170, 92), (146, 126)], 22, SKIN_A),  # helper's arm and hand pressing
    f'<ellipse cx="144" cy="128" rx="24" ry="12" fill="{SKIN_A}"/>',
    arrow(104, 70, 116, 108), arrow(186, 108, 174, 118),
)

# Burns: cool running water for 20 minutes.
scenes["burns"] = svg(
    f'<path d="M120 20 h60 v18 h-24 v14 h-12 v-14 h-24 Z" fill="{GREY}"/>',  # tap
    f'<rect x="146" y="52" width="10" height="86" fill="{WATER}" opacity=".75"/>',
    line(60, 120, 170, 130, 26, SKIN_B), f'<ellipse cx="174" cy="130" rx="16" ry="12" fill="{SKIN_B}"/>',
    *[f'<circle cx="{140 + i * 10}" cy="{140 + (i % 2) * 6}" r="3" fill="{WATER}"/>' for i in range(5)],
    f'<g transform="translate(250 70)"><circle r="30" fill="{WHITE}" stroke="{WATER}" stroke-width="5"/>'
    f'<text x="0" y="6" text-anchor="middle" font-family="Helvetica,Arial" font-weight="800" font-size="18" fill="{PANTS}">20</text>'
    f'<text x="0" y="20" text-anchor="middle" font-family="Helvetica,Arial" font-weight="700" font-size="9" fill="{PANTS}">min</text></g>',
)

# Severe allergy: auto-injector pressed into the outer thigh.
scenes["allergy"] = svg(
    sitting(110, SKIN_B, PATIENT, lean=-2, facing="right"),
    f'<g transform="rotate(-70 150 126)"><rect x="134" y="118" width="40" height="13" rx="5" fill="{YELLOW}"/><rect x="170" y="119" width="10" height="11" rx="3" fill="{SKY}"/><rect x="128" y="120" width="8" height="9" rx="2" fill="{RED}"/></g>',
    poly([(222, 70), (190, 92), (160, 104)], 9, SKIN_A),  # helper hand on the pen
    line(234, 120, 236, 166, 14, PANTS), line(234, 118, 226, 72, 26, HELPER), head(222, 50, SKIN_A, face="left"),
    arrow(150, 84, 150, 104, RED, 4),
)

# Asthma: sit upright, lean slightly forward, use the reliever inhaler.
scenes["asthma"] = svg(
    sitting(120, SKIN_B, PATIENT, lean=8, facing="right"),
    poly([(128, 92), (150, 84), (144, 66)], 8, SKIN_B),
    f'<rect x="140" y="52" width="12" height="18" rx="3" fill="{SKY}"/><rect x="143" y="44" width="8" height="10" rx="2" fill="{PANTS}"/>',
    *[f'<circle cx="{160 + i * 9}" cy="{58 - i * 4}" r="{4 - i}" fill="{SKY}"/>' for i in range(3)],
    standing(236, SKIN_A, HELPER, facing="left", arms=[[(236, 86), (212, 100), (196, 96)]]),
)

# Stroke (FAST): face drooping on one side, one arm drifts down; helper calls emergency.
scenes["stroke"] = svg(
    standing(110, SKIN_B, PATIENT, facing="right", arms=[[(110, 82), (150, 76)], [(110, 84), (146, 104)]]),
    f'<path d="M104 56 q6 5 12 2" stroke="{HAIR}" stroke-width="2.5" fill="none" stroke-linecap="round"/>',  # drooping mouth
    arrow(160, 84, 160, 104, RED, 3),
    standing(228, SKIN_A, HELPER, facing="left", arms=[[(228, 82), (218, 66), (216, 56)]]),
    phone(214, 56, 0.8),
    f'<text x="260" y="36" font-family="Helvetica,Arial" font-weight="900" font-size="20" fill="{RED}">FAST</text>',
)

# Heart attack: half-sitting position, supported, while help is called.
scenes["heart-attack"] = svg(
    f'<rect x="20" y="40" width="16" height="128" fill="{GREY}" opacity=".55"/>',  # wall
    line(44, 160, 96, 164, 14, PANTS), poly([(96, 164), (122, 134), (148, 164)], 13, PANTS),  # knees bent
    line(48, 156, 60, 104, 24, PATIENT), head(62, 82, SKIN_B, face="right"),
    poly([(62, 112), (80, 116), (78, 104)], 8, SKIN_B),  # hand on chest
    f'<path d="M86 98 l8 -8 m-8 0 l8 8" stroke="{RED}" stroke-width="3" stroke-linecap="round"/>',
    line(222, 124, 230, 166, 14, PANTS), line(230, 166, 266, 166, 14, PANTS), line(222, 122, 204, 82, 26, HELPER),
    head(198, 60, SKIN_A, face="left"), poly([(202, 92), (186, 76), (190, 64)], 8, SKIN_A), phone(190, 62, 0.75),
)

# Heat stroke: move to shade, wet the skin and fan them.
scenes["heat-stroke"] = svg(
    f'<rect x="262" y="70" width="12" height="98" fill="#7C5A3A"/><circle cx="268" cy="54" r="44" fill="{GREEN}" opacity=".85"/>',
    f'<circle cx="34" cy="38" r="16" fill="{YELLOW}"/>',
    # helper kneels behind the patient's waist and fans them
    line(156, 118, 164, 160, 14, PANTS), line(164, 160, 200, 162, 14, PANTS),
    line(156, 116, 138, 80, 26, HELPER),
    lying_on_back(40),
    *[f'<path d="M{70 + i * 18} 128 q3 -8 6 0" stroke="{WATER}" stroke-width="3" fill="none"/>' for i in range(4)],
    poly([(138, 90), (116, 104)], 8, SKIN_A), f'<path d="M96 96 l22 6 l-8 18 Z" fill="{YELLOW}"/>',
    head(132, 58, SKIN_A, face="left"),
)

# Low blood sugar: give fast sugar (juice) to someone who can swallow.
scenes["low-sugar"] = svg(
    sitting(110, SKIN_B, PATIENT, lean=4, facing="right"),
    standing(220, SKIN_A, HELPER, facing="left", arms=[[(220, 86), (190, 92), (166, 82)]]),
    f'<rect x="150" y="66" width="18" height="26" rx="3" fill="{YELLOW}"/><rect x="152" y="58" width="6" height="10" fill="{GREEN}"/>',
    poly([(118, 92), (140, 84), (150, 80)], 8, SKIN_B),
)

# Recovery position: on their side, top knee bent, hand under the cheek, head tilted back.
scenes["recovery"] = svg(
    head(70, 146, SKIN_B, face="left"),
    poly([(78, 158), (64, 160), (60, 150)], 7, SKIN_B),  # hand under cheek
    line(86, 140, 158, 146, 26, PATIENT),  # torso on side
    line(160, 152, 230, 160, 14, PANTS_B),  # bottom leg straight
    poly([(160, 140), (196, 116), (204, 158)], 14, PANTS),  # top knee bent
    poly([(104, 126), (120, 108), (140, 120)], 7, SKIN_B),  # top arm
    arrow(46, 128, 52, 112, GREY, 3),
)

# Nosebleed: sit, lean forward, pinch the soft part of the nose.
scenes["nosebleed"] = svg(
    sitting(140, SKIN_B, PATIENT, lean=22, facing="right"),
    poly([(150, 92), (174, 80), (168, 70)], 8, SKIN_B),
    f'<circle cx="170" cy="70" r="4" fill="{SKIN_B}"/>',
    f'<circle cx="172" cy="96" r="2.5" fill="{RED}"/>',
    arrow(206, 40, 190, 58, RED, 3),
    f'<text x="214" y="38" font-family="Helvetica,Arial" font-weight="800" font-size="14" fill="{RED}">10 to 15 min</text>',
)

# Fracture: support the injured arm as found, padded, with a sling.
scenes["fracture"] = svg(
    standing(140, SKIN_B, PATIENT, facing="right", arms=[[(140, 84), (156, 112), (182, 104)]]),
    f'<path d="M132 70 L188 112 L150 122 Z" fill="{WHITE}" stroke="{GREY}" stroke-width="2"/>',  # sling
    f'<path d="M164 100 l6 -6 m-6 0 l6 6" stroke="{RED}" stroke-width="3" stroke-linecap="round"/>',
    standing(236, SKIN_A, HELPER, facing="left", arms=[[(236, 88), (206, 108), (186, 112)]]),
)

# Poisoning: call for help, keep the container, don't make them vomit.
scenes["poisoning"] = svg(
    sitting(96, SKIN_B, PATIENT, lean=4, facing="right"),
    standing(212, SKIN_A, HELPER, facing="left", arms=[[(212, 84), (204, 66), (202, 56)], [(212, 86), (186, 96), (176, 92)]]),
    phone(200, 56, 0.8),
    f'<rect x="160" y="78" width="16" height="22" rx="3" fill="{GREEN}"/><rect x="163" y="72" width="10" height="7" fill="{WHITE}"/><path d="M164 86 h8 m-4 -4 v8" stroke="{WHITE}" stroke-width="2"/>',
)

for name, content in scenes.items():
    with open(os.path.join(OUT, f"{name}.svg"), "w") as f:
        f.write(content)
print("wrote", len(scenes), "scenes")
