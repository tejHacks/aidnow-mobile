"""AidNow illustration set: one pictogram per guide/tool + onboarding art.

Writes SVGs to tool/art/. Render to PNG with tool/render-art.mjs (headless Chrome).
Flat, friendly, two-tone style on a transparent background; tiles are coloured in-app.
"""
import os

OUT = os.path.join(os.path.dirname(__file__), "art")
os.makedirs(OUT, exist_ok=True)

RED, DEEP, AMBER, ORANGE, SKY, TEAL, VIOLET, PINK, SLATE, SKIN, WHITE, YELLOW, GREEN = (
    "#E11D48", "#9F1239", "#F59E0B", "#F97316", "#0EA5E9", "#14B8A6", "#8B5CF6", "#F472B6", "#334155", "#F8C4A0", "#FFFFFF", "#FDE047", "#22C55E")

def svg(body, vb="0 0 96 96"):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}">{body}</svg>'

HEART = "M48 82 C 20 62, 10 46, 14 32 C 18 18, 36 14, 48 28 C 60 14, 78 18, 82 32 C 86 46, 76 62, 48 82 Z"

icons = {
    # CPR: heart with a pulse line
    "cpr": svg(f'<path d="{HEART}" fill="{RED}"/><path d="M14 50 H34 L40 38 L48 62 L55 44 L60 50 H82" fill="none" stroke="{WHITE}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>'),
    # Seizure: head profile with a lightning bolt
    "seizure": svg(f'<path d="M30 84 V70 C 18 64, 14 52, 16 40 C 18 22, 34 12, 50 12 C 68 12, 82 24, 82 42 C 82 48, 86 54, 88 58 L 80 60 V 70 C 80 76, 74 78, 66 76 V 84 Z" fill="{VIOLET}"/><path d="M52 22 L38 48 H50 L44 70 L64 40 H52 L58 22 Z" fill="{YELLOW}"/>'),
    # Fainting: dizzy face with spiral eyes and stars
    "fainting": svg(f'<circle cx="48" cy="54" r="30" fill="{SKIN}"/><path d="M36 50 m-6 0 a6 6 0 1 0 12 0 a4 4 0 1 0 -8 0 a2 2 0 1 0 4 0" fill="none" stroke="{SLATE}" stroke-width="3"/><path d="M60 50 m-6 0 a6 6 0 1 0 12 0 a4 4 0 1 0 -8 0 a2 2 0 1 0 4 0" fill="none" stroke="{SLATE}" stroke-width="3"/><ellipse cx="48" cy="68" rx="7" ry="4" fill="{SLATE}"/><path d="M22 18 l3 6 6 1 -5 4 1 6 -5 -3 -5 3 1 -6 -5 -4 6 -1 Z" fill="{AMBER}"/><path d="M70 12 l2.5 5 5 .8 -4 3.4 1 5 -4.5 -2.4 -4.5 2.4 1 -5 -4 -3.4 5 -.8 Z" fill="{AMBER}"/>'),
    # Choking: head + neck with blocked airway
    "choking": svg(f'<circle cx="48" cy="34" r="20" fill="{SKIN}"/><rect x="38" y="50" width="20" height="18" fill="{SKIN}"/><path d="M14 92 C 16 74, 30 66, 48 66 C 66 66, 80 74, 82 92 Z" fill="{SKY}"/><path d="M48 50 V 70" stroke="{WHITE}" stroke-width="5" stroke-linecap="round"/><circle cx="48" cy="60" r="7" fill="{RED}"/><path d="M28 64 C 30 58, 36 56, 40 58 M68 64 C 66 58, 60 56, 56 58" stroke="{SKIN}" stroke-width="7" stroke-linecap="round" fill="none"/>'),
    # Choking baby: baby face with curl
    "choking-baby": svg(f'<circle cx="48" cy="52" r="32" fill="{SKIN}"/><path d="M44 20 C 40 12, 52 8, 54 16 C 56 22, 48 24, 46 20" fill="none" stroke="{ORANGE}" stroke-width="4" stroke-linecap="round"/><circle cx="37" cy="48" r="4" fill="{SLATE}"/><circle cx="59" cy="48" r="4" fill="{SLATE}"/><circle cx="48" cy="66" r="6" fill="{DEEP}"/><circle cx="28" cy="60" r="5" fill="{PINK}" opacity=".6"/><circle cx="68" cy="60" r="5" fill="{PINK}" opacity=".6"/>'),
    # Bleeding: blood drop with a plus
    "bleeding": svg(f'<path d="M48 8 C 60 28, 76 44, 76 60 C 76 76, 64 88, 48 88 C 32 88, 20 76, 20 60 C 20 44, 36 28, 48 8 Z" fill="{RED}"/><path d="M48 50 V 74 M36 62 H 60" stroke="{WHITE}" stroke-width="7" stroke-linecap="round"/><path d="M32 58 C 32 50, 36 44, 40 40" stroke="{WHITE}" stroke-opacity=".45" stroke-width="4" stroke-linecap="round" fill="none"/>'),
    # Burns: flame
    "burns": svg(f'<path d="M48 8 C 54 24, 74 34, 74 58 C 74 76, 62 88, 48 88 C 34 88, 22 76, 22 60 C 22 46, 30 40, 34 30 C 38 40, 42 42, 44 40 C 46 30, 44 18, 48 8 Z" fill="{ORANGE}"/><path d="M48 46 C 52 56, 62 60, 62 70 C 62 80, 56 86, 48 86 C 40 86, 34 80, 34 72 C 34 64, 40 62, 42 56 C 44 60, 46 60, 48 46 Z" fill="{YELLOW}"/>'),
    # Allergy: adrenaline auto-injector
    "allergy": svg(f'<g transform="rotate(-35 48 48)"><rect x="40" y="10" width="16" height="16" rx="4" fill="{SKY}"/><rect x="38" y="24" width="20" height="50" rx="6" fill="{YELLOW}"/><rect x="38" y="44" width="20" height="10" fill="{AMBER}"/><rect x="41" y="72" width="14" height="14" rx="4" fill="{ORANGE}"/></g><circle cx="76" cy="22" r="10" fill="{RED}"/><path d="M76 16 V 28 M70 22 H 82" stroke="{WHITE}" stroke-width="4" stroke-linecap="round"/>'),
    # Asthma: inhaler with puffs
    "asthma": svg(f'<path d="M30 12 H 52 V 52 H 76 V 76 C 76 82, 72 86, 66 86 H 40 C 34 86, 30 82, 30 76 Z" fill="{TEAL}"/><rect x="34" y="6" width="14" height="12" rx="3" fill="{SLATE}"/><rect x="58" y="60" width="18" height="16" fill="{WHITE}" opacity=".35"/><circle cx="84" cy="54" r="5" fill="{SKY}" opacity=".7"/><circle cx="90" cy="42" r="3.5" fill="{SKY}" opacity=".55"/><circle cx="82" cy="34" r="2.5" fill="{SKY}" opacity=".45"/>'),
    # Stroke: brain with alert spot
    "stroke": svg(f'<path d="M48 18 C 40 12, 26 14, 22 24 C 12 26, 10 40, 16 46 C 10 54, 16 68, 26 68 C 28 78, 40 82, 48 76 C 56 82, 68 78, 70 68 C 80 68, 86 54, 80 46 C 86 40, 84 26, 74 24 C 70 14, 56 12, 48 18 Z" fill="{PINK}"/><path d="M48 20 V 74 M34 30 C 40 34, 38 42, 32 44 M62 30 C 56 34, 58 42, 64 44 M30 56 C 36 54, 40 58, 38 64 M66 56 C 60 54, 56 58, 58 64" stroke="{DEEP}" stroke-opacity=".35" stroke-width="3" stroke-linecap="round" fill="none"/><circle cx="64" cy="40" r="11" fill="{RED}"/><path d="M64 33 V 41" stroke="{WHITE}" stroke-width="4" stroke-linecap="round"/><circle cx="64" cy="46.5" r="2.3" fill="{WHITE}"/>'),
    # Heart attack: heart with crack
    "heart-attack": svg(f'<path d="{HEART}" fill="{DEEP}"/><path d="M48 28 L42 42 L54 50 L44 62 L50 72" fill="none" stroke="{WHITE}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>'),
    # Heat stroke: sun + thermometer
    "heat-stroke": svg(f'<circle cx="30" cy="30" r="14" fill="{AMBER}"/><g stroke="{AMBER}" stroke-width="4" stroke-linecap="round"><path d="M30 6 V 10 M30 50 V 54 M6 30 H 10 M50 30 H 54 M13 13 L16 16 M44 44 L47 47 M13 47 L16 44 M44 16 L47 13"/></g><rect x="58" y="14" width="18" height="54" rx="9" fill="{WHITE}" stroke="{SLATE}" stroke-width="3"/><circle cx="67" cy="74" r="13" fill="{RED}" stroke="{SLATE}" stroke-width="3"/><rect x="63" y="30" width="8" height="40" rx="4" fill="{RED}"/>'),
    # Low blood sugar: wrapped sweet
    "low-sugar": svg(f'<path d="M18 30 L6 20 L10 48 L6 76 L18 66 Z" fill="{PINK}"/><path d="M78 30 L90 20 L86 48 L90 76 L78 66 Z" fill="{PINK}"/><ellipse cx="48" cy="48" rx="32" ry="24" fill="{RED}"/><path d="M28 36 C 40 30, 56 30, 68 36" stroke="{WHITE}" stroke-opacity=".5" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M34 48 L42 56 M46 44 L54 52 M58 42 L64 48" stroke="{WHITE}" stroke-width="4" stroke-linecap="round"/>'),
    # Recovery position: person lying on side
    "recovery": svg(f'<rect x="6" y="74" width="84" height="6" rx="3" fill="{SLATE}" opacity=".35"/><circle cx="20" cy="56" r="11" fill="{SKIN}"/><path d="M30 60 C 40 50, 58 50, 66 58 L 64 72 H 32 Z" fill="{SKY}"/><path d="M60 62 L 80 52 L 86 64 L 70 72 Z" fill="{SLATE}"/><path d="M32 70 L 22 72" stroke="{SKIN}" stroke-width="7" stroke-linecap="round"/><path d="M44 54 C 46 44, 40 40, 34 42" stroke="{SKIN}" stroke-width="6" stroke-linecap="round" fill="none"/>'),
    # Nosebleed: nose profile with drop
    "nosebleed": svg(f'<path d="M26 10 C 30 26, 34 40, 44 54 C 50 62, 46 68, 38 68 H 30" fill="none" stroke="{SKIN}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M58 52 C 64 62, 72 68, 72 76 C 72 84, 66 90, 58 90 C 50 90, 44 84, 44 76 C 44 68, 52 62, 58 52 Z" fill="{RED}"/><path d="M52 76 C 52 72, 54 68, 56 66" stroke="{WHITE}" stroke-opacity=".5" stroke-width="3" stroke-linecap="round" fill="none"/>'),
    # Fracture: broken bone
    "fracture": svg(f'<g fill="{WHITE}" stroke="{SLATE}" stroke-width="4" stroke-linejoin="round"><path d="M12 30 C 8 24, 14 16, 20 20 C 22 12, 32 14, 30 22 L 44 36 L 38 44 L 40 46 L 36 50 L 22 36 C 14 38, 10 30, 12 30 Z"/><path d="M84 66 C 88 72, 82 80, 76 76 C 74 84, 64 82, 66 74 L 52 60 L 56 54 L 54 52 L 58 48 L 72 60 C 80 58, 86 66, 84 66 Z"/></g><path d="M40 40 L 46 46 L 42 48 L 50 54" stroke="{RED}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'),
    # Poisoning: bottle with skull
    "poisoning": svg(f'<rect x="38" y="6" width="20" height="12" rx="3" fill="{SLATE}"/><path d="M40 18 H 56 V 26 C 68 30, 74 40, 74 52 V 82 C 74 86, 70 90, 66 90 H 30 C 26 90, 22 86, 22 82 V 52 C 22 40, 28 30, 40 26 Z" fill="{GREEN}"/><circle cx="48" cy="56" r="12" fill="{WHITE}"/><rect x="42" y="64" width="12" height="7" rx="2" fill="{WHITE}"/><circle cx="43.5" cy="55" r="3" fill="{SLATE}"/><circle cx="52.5" cy="55" r="3" fill="{SLATE}"/><path d="M34 76 L62 84 M62 76 L34 84" stroke="{WHITE}" stroke-width="4" stroke-linecap="round"/>'),
    # Tools
    "tool-cpr": svg(f'<path d="{HEART}" fill="{RED}"/><g fill="{SKIN}" stroke="{DEEP}" stroke-opacity=".25" stroke-width="2"><rect x="30" y="34" width="36" height="16" rx="8"/><rect x="34" y="46" width="28" height="16" rx="8"/></g><path d="M48 6 V 18 M36 10 L 40 18 M60 10 L 56 18" stroke="{AMBER}" stroke-width="4" stroke-linecap="round"/>'),
    "tool-timer": svg(f'<rect x="40" y="6" width="16" height="10" rx="3" fill="{SLATE}"/><path d="M70 22 L 78 14" stroke="{SLATE}" stroke-width="6" stroke-linecap="round"/><circle cx="48" cy="54" r="34" fill="{WHITE}" stroke="{VIOLET}" stroke-width="7"/><path d="M48 54 L 48 32" stroke="{SLATE}" stroke-width="5" stroke-linecap="round"/><path d="M48 54 L 64 62" stroke="{RED}" stroke-width="5" stroke-linecap="round"/><circle cx="48" cy="54" r="4" fill="{SLATE}"/>'),
    "tool-medical-id": svg(f'<rect x="8" y="20" width="80" height="56" rx="10" fill="{WHITE}" stroke="{SKY}" stroke-width="5"/><rect x="8" y="20" width="80" height="14" rx="7" fill="{SKY}"/><circle cx="30" cy="54" r="10" fill="{SKIN}"/><path d="M18 72 C 20 64, 40 64, 42 72" fill="{SKY}"/><path d="M50 50 H 76 M50 60 H 70" stroke="{SLATE}" stroke-opacity=".35" stroke-width="4" stroke-linecap="round"/><circle cx="76" cy="27" r="0" fill="none"/><path d="M68 27 H 80 M74 21 V 33" stroke="{WHITE}" stroke-width="4" stroke-linecap="round"/>'),

    # UI glyphs
    "phone": svg(f'<path d="M30 14 C 34 12, 38 14, 40 18 L 46 32 C 48 36, 46 40, 42 42 L 36 46 C 40 58, 48 66, 60 72 L 64 66 C 66 62, 70 60, 74 62 L 86 68 C 90 70, 92 74, 90 78 L 86 86 C 84 90, 78 92, 72 90 C 42 82, 18 58, 10 28 C 8 22, 10 18, 14 16 Z" fill="{WHITE}"/>'),
    "dont": svg(f'<circle cx="48" cy="48" r="40" fill="{RED}"/><path d="M34 34 L62 62 M62 34 L34 62" stroke="{WHITE}" stroke-width="10" stroke-linecap="round"/>'),
}

# Onboarding illustrations (wider canvas)
ob_vb = "0 0 320 240"
onboarding = {
    "onboard-calm": svg(f'''
<circle cx="160" cy="120" r="110" fill="{RED}" opacity=".08"/><circle cx="160" cy="120" r="82" fill="{RED}" opacity=".12"/><circle cx="160" cy="120" r="56" fill="{RED}" opacity=".18"/>
<g transform="translate(112 72)"><path d="{HEART}" fill="{RED}"/><path d="M14 50 H34 L40 38 L48 62 L55 44 L60 50 H82" fill="none" stroke="{WHITE}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></g>
<g fill="{AMBER}"><circle cx="58" cy="60" r="5"/><circle cx="270" cy="70" r="4"/><circle cx="250" cy="190" r="6"/><circle cx="72" cy="180" r="4"/></g>''', ob_vb),
    "onboard-offline": svg(f'''
<rect x="104" y="20" width="112" height="208" rx="22" fill="{SLATE}"/><rect x="112" y="30" width="96" height="188" rx="16" fill="{WHITE}"/>
<rect x="144" y="36" width="32" height="8" rx="4" fill="{SLATE}"/>
<g><rect x="122" y="58" width="76" height="30" rx="8" fill="{RED}" opacity=".12"/><circle cx="136" cy="73" r="8" fill="{RED}"/><path d="M150 69 H 188 M150 78 H 176" stroke="{SLATE}" stroke-opacity=".4" stroke-width="4" stroke-linecap="round"/></g>
<g><rect x="122" y="96" width="76" height="30" rx="8" fill="{VIOLET}" opacity=".12"/><circle cx="136" cy="111" r="8" fill="{VIOLET}"/><path d="M150 107 H 188 M150 116 H 172" stroke="{SLATE}" stroke-opacity=".4" stroke-width="4" stroke-linecap="round"/></g>
<g><rect x="122" y="134" width="76" height="30" rx="8" fill="{ORANGE}" opacity=".12"/><circle cx="136" cy="149" r="8" fill="{ORANGE}"/><path d="M150 145 H 188 M150 154 H 180" stroke="{SLATE}" stroke-opacity=".4" stroke-width="4" stroke-linecap="round"/></g>
<g transform="translate(238 40)"><circle cx="30" cy="30" r="30" fill="{AMBER}"/><path d="M14 26 C 24 16, 36 16, 46 26 M20 33 C 26 27, 34 27, 40 33" stroke="{WHITE}" stroke-width="5" stroke-linecap="round" fill="none"/><circle cx="30" cy="40" r="4" fill="{WHITE}"/><path d="M14 14 L46 46" stroke="{WHITE}" stroke-width="5" stroke-linecap="round"/></g>
<g transform="translate(26 120)"><rect width="60" height="60" rx="16" fill="{TEAL}"/><path d="M18 30 L27 39 L44 21" stroke="{WHITE}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g>''', ob_vb),
    "onboard-call": svg(f'''
<circle cx="160" cy="124" r="96" fill="{RED}" opacity=".1"/><circle cx="160" cy="124" r="70" fill="{RED}"/>
<path d="M134 104 C 134 98, 140 94, 146 96 L 152 104 C 154 108, 152 112, 148 114 C 152 124, 158 130, 168 134 C 170 130, 174 128, 178 130 L 186 136 C 188 142, 184 148, 178 148 C 152 148, 134 130, 134 104 Z" fill="{WHITE}"/>
<g transform="translate(240 30)"><path d="M24 0 C 37 0, 48 11, 48 24 C 48 42, 24 64, 24 64 C 24 64, 0 42, 0 24 C 0 11, 11 0, 24 0 Z" fill="{SKY}"/><circle cx="24" cy="24" r="9" fill="{WHITE}"/></g>
<g transform="translate(36 40)" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="22">
<rect width="62" height="34" rx="17" fill="{WHITE}" stroke="{RED}" stroke-width="3"/><text x="31" y="24" text-anchor="middle" fill="{RED}">112</text></g>
<g transform="translate(232 176)" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="22">
<rect width="62" height="34" rx="17" fill="{WHITE}" stroke="{RED}" stroke-width="3"/><text x="31" y="24" text-anchor="middle" fill="{RED}">911</text></g>
<g transform="translate(24 172)" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="22">
<rect width="62" height="34" rx="17" fill="{WHITE}" stroke="{RED}" stroke-width="3"/><text x="31" y="24" text-anchor="middle" fill="{RED}">999</text></g>''', ob_vb),
}

for name, s in {**icons, **onboarding}.items():
    with open(os.path.join(OUT, f"{name}.svg"), "w") as f:
        f.write(s)
print(len(icons), "icons,", len(onboarding), "onboarding illustrations")
