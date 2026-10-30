"""Składa strony z szablonów w src/pages/*.html.
Tokeny w szablonach:
  {{head:Tytuł|opis}}  {{nav:klucz}}  {{footer}}  {{footer:slim}}  {{faq}}  {{scripts}}
  {{icon:nazwa}}  {{icon:nazwa:klasa}}  {{svc:nazwa}}  {{tile:nazwa}}  {{tile-dark:nazwa}}  {{logo}}
Wynik: gotowe pliki .html (bez kroku budowania po stronie zespołu).
"""
import re
import sys
from pathlib import Path
from icons import ICONS, SVC, tile, logo, svc_inner


def icon(name, cls=None):
    return sprite_icon(name, cls)

SRC = Path(__file__).parent / 'pages'
OUT = Path(sys.argv[1] if len(sys.argv) > 1 else Path(__file__).parent.parent / 'pirx')

PHONE = '+48 792 937 176'
PHONE_HREF = 'tel:+48792937176'

# Linki do stron kolegów z zespołu — nazwy plików do uzgodnienia.
LINKS = {
    'home': 'index.html', 'proces': 'proces.html', 'kontakt': 'kontakt.html',
    'onas': 'o-nas.html', 'cennik': 'cennik.html', 'blog': 'blog.html', 'faq': 'faq.html',
    'ogloszenia': 'oferta-ogloszenia.html', 'goscie': 'oferta-goscie.html',
    'housekeeping': 'oferta-housekeeping.html', 'serwis': 'oferta-serwis-techniczny.html',
    'przychody': 'oferta-przychody.html',
    'polityka': 'polityka-prywatnosci.html', 'regulamin': 'regulamin.html',
}

MENU = [
    ('Dlaczego PIRX?', 'why', [('Jak to działa?', 'proces', 'route'), ('O nas', 'onas', 'chat')]),
    ('Nasze usługi', 'uslugi', [
        ('Ogłoszenia', 'ogloszenia', 'svc:ogloszenia'),
        ('Goście', 'goscie', 'svc:goscie'),
        ('Housekeeping', 'housekeeping', 'svc:housekeeping'),
        ('Serwis techniczny', 'serwis', 'svc:serwis'),
        ('Przychody', 'przychody', 'pie'),
    ]),
    ('Wiedza', 'wiedza', [('Blog', 'blog', 'news'), ('FAQ', 'faq', 'help')]),
    ('Cennik', 'cennik', None),
    ('Kontakt', 'kontakt', None),
]


def menu_icon(spec):
    return svc_inner(spec[4:]) if spec.startswith('svc:') else icon(spec)


def head(arg):
    title, _, desc = arg.partition('|')
    return f'''<meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <meta name="description" content="{desc}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@500;600&family=Nunito+Sans:opsz,wght@6..12,400;6..12,700&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="css/style.css" rel="stylesheet">'''


def nav(active):
    items = []
    for label, key, sub in MENU:
        is_active = key == active or (sub and any(k == active for _, k, _ in sub))
        act = ' is-active' if is_active else ''
        if sub:
            sid = f'sub-{key}'
            links = ''.join(
                f'<a href="{LINKS[k]}"{" class=\"is-active\" aria-current=\"page\"" if k == active else ""}>{menu_icon(ic)}<span>{t}</span></a>'
                for t, k, ic in sub)
            items.append(f'''
        <li class="nav-item-pirx" data-dropdown>
          <button class="nav-link-pirx{act}" type="button" aria-expanded="false" aria-controls="{sid}"><span class="marker">{label}</span>{icon("chevron")}</button>
          <div class="submenu" id="{sid}">{links}</div>
        </li>''')
        else:
            cur = ' aria-current="page"' if key == active else ''
            items.append(f'''
        <li class="nav-item-pirx"><a class="nav-link-pirx{act}" href="{LINKS[key]}"{cur}><span class="marker">{label}</span></a></li>''')

    # menu mobilne
    m_items = []
    for label, key, sub in MENU:
        if sub:
            cid = f'mm-{key}'
            links = ''.join(f'<a href="{LINKS[k]}">{menu_icon(ic)}<span>{t}</span></a>' for t, k, ic in sub)
            m_items.append(f'''
          <li>
            <div class="mm-row">
              <button class="mm-label" type="button" data-bs-toggle="collapse" data-bs-target="#{cid}" aria-expanded="false" aria-controls="{cid}">{label}</button>
              <button class="mm-toggle" type="button" data-bs-toggle="collapse" data-bs-target="#{cid}" aria-expanded="false" aria-controls="{cid}" aria-label="Rozwiń: {label}">{icon("faq-chevron")}</button>
            </div>
            <div class="collapse" id="{cid}"><div class="mm-sub">{links}</div></div>
          </li>''')
        else:
            cls = ' class="is-active"' if key == active else ''
            m_items.append(f'''
          <li><div class="mm-row"><a href="{LINKS[key]}"{cls}>{label}</a></div></li>''')

    return f'''<header class="site-nav">
    <div class="wrap">
      <div class="nav-left">
        <a href="{LINKS["home"]}" aria-label="pirx.rent — strona główna">{logo()}</a>
        <nav aria-label="Główne menu">
          <ul class="nav-menu">{"".join(items)}
          </ul>
        </nav>
      </div>
      <a class="btn-pirx btn-pirx--outline nav-phone" href="{PHONE_HREF}">{icon("phone")}{PHONE}</a>
      <div class="nav-mobile-actions">
        <a class="icon-btn" href="{PHONE_HREF}" aria-label="Zadzwoń: {PHONE}">{icon("phone")}</a>
        <button class="icon-btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#menuMobile" aria-controls="menuMobile" aria-label="Otwórz menu">{icon("menu")}</button>
      </div>
    </div>
  </header>

  <div class="offcanvas offcanvas-end menu-mobile" tabindex="-1" id="menuMobile" aria-label="Menu">
    <div class="menu-mobile__top">
      <a href="{LINKS["home"]}" aria-label="pirx.rent — strona główna">{logo()}</a>
      <div class="d-flex gap-2">
        <a class="icon-btn" href="{PHONE_HREF}" aria-label="Zadzwoń: {PHONE}">{icon("phone")}</a>
        <button class="icon-btn" type="button" data-bs-dismiss="offcanvas" aria-label="Zamknij menu">{icon("close")}</button>
      </div>
    </div>
    <div class="offcanvas-body">
      <nav aria-label="Menu mobilne">
        <ul class="mm-links">{"".join(m_items)}
        </ul>
      </nav>
      <div class="mm-cta"><a class="btn-pirx btn-pirx--yellow" href="{PHONE_HREF}">{PHONE}</a></div>
    </div>
  </div>'''


def footer_bottom():
    return f'''<div class="footer-bottom">
        <div class="footer-bottom__left">
          <div class="socials">
            <a href="#" aria-label="Facebook">{icon("facebook")}</a>
            <a href="#" aria-label="LinkedIn">{icon("linkedin")}</a>
            <a href="#" aria-label="Instagram">{icon("instagram")}</a>
          </div>
          <div class="footer-legal">
            <a href="{LINKS["polityka"]}">Polityka prywatności</a>
            <a href="{LINKS["regulamin"]}">Regulamin</a>
          </div>
        </div>
        <div class="footer-credit">
          <span>© Pirx Group. Design&amp;Code</span>
          <svg class="dc" viewBox="1539 8655 41 9" fill="currentColor" aria-hidden="true"><path d="M1547.9 8664V8655H1539V8656.8H1546.1V8662.2H1539V8664H1547.9Z"/><path d="M1540.8 8658.6H1539V8660.4H1540.8V8658.6Z"/><path d="M1558.6 8664V8655H1549.7V8664H1558.6ZM1551.5 8656.8H1556.8V8662.2H1551.5V8656.8Z"/><path d="M1569.3 8664V8662.2H1562.2V8656.8H1569.3V8655H1560.4V8664H1569.3Z"/><path d="M1578.2 8664H1580V8660.4H1578.2V8664Z"/><path d="M1580 8655H1578.2V8658.6H1580V8655Z"/><path d="M1572.9 8660.4H1578.2V8658.6H1572.9V8655H1571.1V8664H1572.9V8660.4Z"/></svg>
        </div>
      </div>'''


def footer(variant):
    if variant == 'slim':
        return f'''<footer class="site-footer site-footer--slim">
    <div class="wrap">
      {footer_bottom()}
    </div>
  </footer>'''
    return f'''<footer class="site-footer">
    <div class="wrap">
      <div class="footer-row">
        <div class="footer-about">
          <a href="{LINKS["home"]}" aria-label="pirx.rent — strona główna">{logo()}</a>
          <p class="txt-14">Pilotujemy Twój wynajem. Profesjonalne zarządzanie najmem krótkoterminowym dla właścicieli którzy cenią wyniki bardziej niż obietnice.</p>
        </div>
        <div class="footer-col">
          <p class="h-sm">Pirx Group Sp. z o. o.</p>
          <address>Al. Grunwaldzka 413,<br>80-309 Gdańsk</address>
          <p class="txt-14">Telefon: <a href="{PHONE_HREF}" class="text-decoration-none">{PHONE}</a><br>E-mail: <a href="mailto:hello@pirx.rent">hello@pirx.rent</a></p>
        </div>
        <div class="footer-col">
          <p class="h-sm">Oddział w Warszawie</p>
          <address>ul. Bukowińska 22/3,<br>02-703 Warszawa.</address>
        </div>
      </div>
      {footer_bottom()}
    </div>
  </footer>'''


FAQ_Q = [
    'Oddaję Ci klucze do mojego mieszkania. Skąd mam wiedzieć, że wrócę do czegoś, co wciąż stoi?',
    'Mam najemcę od trzech lat. Płaci w miarę regularnie. Po co mi zmiana?',
    'Airbnb samo w sobie nie jest skomplikowane. Dlaczego miałbym płacić Wam prowizję?',
    'Ile realnie zarobię — bez owijania w bawełnę?',
    'Co się dzieje, jeśli gość zniszczy mieszkanie?',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
]
# Projekt w Figmie nie zawiera treści odpowiedzi — tymczasowy tekst.
FAQ_A = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'


def help_box(cls):
    return f'''<div class="help-box {cls}">
            {icon("info")}
            <p class="txt-14b">Nadal poszukujesz odpowiedzi? Chętnie pomożemy.</p>
            <a class="btn-pirx btn-pirx--white btn-pirx--block" href="{LINKS["kontakt"]}" style="height:48px">Skontaktuj się z nami</a>
          </div>'''


def faq(_=None):
    items = ''.join(f'''
            <div class="faq-item">
              <button class="faq-q" type="button" data-bs-toggle="collapse" data-bs-target="#faq-{i}" aria-expanded="false" aria-controls="faq-{i}">
                <span>{i:02d}.</span><span>{q}</span>{icon("faq-chevron")}
              </button>
              <div class="collapse" id="faq-{i}"><div class="faq-a">{FAQ_A}</div></div>
            </div>''' for i, q in enumerate(FAQ_Q, 1))
    return f'''<section class="section bg-light-pirx" id="faq" aria-labelledby="faq-title">
    <div class="wrap faq-grid">
      <div class="faq-intro">
        <h2 class="h-lg" id="faq-title">Najczęściej zadawane pytania</h2>
        <p class="txt-14">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        {help_box("faq-help-desktop")}
      </div>
      <div>
        <div class="faq-list">{items}
        </div>
        {help_box("faq-help-mobile mt-pirx-40")}
      </div>
    </div>
  </section>'''


def scripts(_=None):
    return '''<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="js/main.js"></script>'''


USED = set()


def sprite_icon(name, cls=None):
    USED.add(name)
    vb = re.search(r'viewBox="([^"]+)"', ICONS[name]).group(1).split()
    w, h = vb[2], vb[3]
    c = 'ico' + (' ' + cls if cls else '')
    # <symbol> ma własny viewBox (z offsetem z Figmy); zewnętrzny svg musi zaczynać się od 0 0
    return f'<svg class="{c}" viewBox="0 0 {w} {h}" aria-hidden="true" focusable="false"><use href="#i-{name}" width="{w}" height="{h}"/></svg>'


def sprite():
    out = []
    for name in sorted(USED):
        svg = ICONS[name]
        vb = re.search(r'viewBox="([^"]+)"', svg).group(1)
        fill = re.search(r'fill="([^"]+)"', svg).group(1)
        inner = re.sub(r'^<svg[^>]*>|</svg>$', '', svg)
        out.append(f'<symbol id="i-{name}" viewBox="{vb}" fill="{fill}">{inner}</symbol>')
    return ('<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true">'
            + ''.join(out) + '</svg>')


def render(text):
    USED.clear()
    def rep(m):
        kind, _, arg = m.group(1).partition(':')
        if kind == 'head': return head(arg)
        if kind == 'nav': return nav(arg)
        if kind == 'footer': return footer(arg)
        if kind == 'faq': return faq()
        if kind == 'scripts': return scripts()
        if kind == 'logo': return logo()
        if kind == 'icon':
            name, _, cls = arg.partition(':')
            return sprite_icon(name, cls or None)
        if kind == 'svc': return SVC[arg]
        if kind == 'tile': return f'<span class="tile">{sprite_icon(arg)}</span>'
        if kind == 'tile-dark': return f'<span class="tile tile--dark">{sprite_icon(arg)}</span>'
        if kind == 'phone': return PHONE
        if kind == 'phone-href': return PHONE_HREF
        if kind == 'link': return LINKS[arg]
        raise KeyError(m.group(0))
    # dwa przebiegi: partiale (nav/footer/faq) same używają icon(), więc podmieniamy je na sprite
    html = re.sub(r'\{\{([^}]+)\}\}', rep, text)
    return html.replace('<body>', '<body>\n  ' + sprite(), 1).replace('<body class="page-kontakt">', '<body class="page-kontakt">\n  ' + sprite(), 1)


if __name__ == '__main__':
    OUT.mkdir(parents=True, exist_ok=True)
    for page in sorted(SRC.glob('*.html')):
        html = render(page.read_text(encoding='utf-8'))
        (OUT / page.name).write_text(html, encoding='utf-8')
        print('zbudowano', page.name, len(html))
