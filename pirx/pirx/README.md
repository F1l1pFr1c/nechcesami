# pirx.rent — strony: Strona główna, Proces, Kontakt

Odtworzone z pliku Figma **pirx** (desktop 1920 px + wersje mobilne 375 px).
HTML + CSS + Bootstrap 5.3 (z CDN), bez kroku budowania — wystarczy otworzyć `index.html`.

## Struktura

```
index.html        strona główna
proces.html       Jak to działa? (proces)
kontakt.html      kontakt + formularz (z oboma stanami dropdownów)
css/style.css     wspólne: tokeny kolorów/fontów, przyciski, nawigacja, stopka, pola formularza, FAQ, opinie
css/home.css      tylko strona główna
css/proces.css    tylko proces
css/kontakt.css   tylko kontakt
js/main.js        dropdowny w menu, własny <select>, karuzela opinii, galeria, walidacja formularza
img/              (pusty) — tu wrzućcie zdjęcia, logotypy i ilustracje z Figmy
_build/           opcjonalnie: skrypt, który składa 3 strony ze wspólnego menu/stopki/FAQ
```

## Tokeny z Figmy

| Token | Wartość |
|---|---|
| Tekst / ciemne tło | `#1F1C17` |
| Żółty (akcent) | `#FFD000` |
| Jasne tło (`lightbg`) | `#F5F5ED` |
| Linie na jasnym (`gray-lg`) | `#E2DACF` |
| Linie na ciemnym | `#4E4A42` |
| Pomarańczowy (opinie) | `#E86100` |
| Promień (`radius12`) | 12 px |
| Nagłówki | Crimson Pro 500/600 (Google Fonts) |
| Tekst | Avenir Next → zastępczo **Nunito Sans** (Avenir jest płatny) |
| Szerokość treści | 1240 px |

## Do zrobienia (TODO w kodzie)

- **Ilustracje i zdjęcia** — w miejscach z kreskowanym tłem (`.ph`) jest placeholder z nazwą warstwy z Figmy.
  Eksport: zaznacz warstwę w Figmie → Export → SVG (ilustracje) / PNG lub JPG (zdjęcia) → podmień `<div class="ph …">` na `<img>`.
  Brakujące: animacja rakiety w hero (`pirx_story_anim_opt`), kokpit, rakieta w cenniku, 3 okrągłe ilustracje kroków,
  zdjęcia (właściciel z laptopem, kobieta z laptopem, mieszkanie w case study), orbita na procesie, planety w CTA, 11 logotypów platform.
- **Ikony** — te z Figmy (logo, telefon, check, usługi, zakładki, social media itd.) są już w kodzie jako SVG.
  Ikony listy „Czego już nigdy nie musisz robić?” i kilka innych to proste zamienniki w tym samym stylu.
- **Nawigacja** — tymczasowa wersja do uzgodnienia z zespołem. Linki do Waszych stron są zgadywane
  (`o-nas.html`, `cennik.html`, `blog.html`, `faq.html`, `oferta-*.html`) — zmieńcie je w jednym miejscu: `_build/build.py` → `LINKS`
  (albo ręcznie w każdym pliku).
- **Formularz kontaktowy** — tylko front: walidacja i komunikat „Dziękujemy”, bez wysyłki (`js/main.js`, komentarz `TODO`).
- **Kalkulator** na stronie głównej — przycisk nic nie liczy (w Figmie są osobne popupy kalkulatora, nie były w zakresie).
  Opcje „Standard” nie są opisane w Figmie — wpisałem tymczasowe.
- **Treści brakujące w Figmie**: odpowiedzi FAQ, zakładki „Wynajmujący długoterminowo” i „Inwestor”, „Co zrobiliśmy?” (lorem ipsum).

## Uwagi do projektu

- W Figmie na stronie Proces pierwszy element menu ma etykietę „Jak to działa?”. Zostawiłem wszędzie „Dlaczego PIRX?”
  (spójne menu) i zaznaczam go jako aktywny na procesie, a w rozwijanym menu podświetlam „Jak to działa?”.
- Usługa „Przychody” jest w Figmie tylko w wersji mobilnej strony głównej — tak też jest w kodzie (`d-lg-none`).

## `_build/` (opcjonalnie)

Menu, stopka i FAQ są identyczne na 3 stronach. Zamiast poprawiać je ręcznie w 3 plikach:

```
cd _build
python3 build.py ..     # nadpisuje index.html, proces.html, kontakt.html
```

Szablony stron są w `_build/pages/`, wspólne części i lista linków w `build.py`, ikony w `icons.py`.
Jeśli wolicie edytować HTML bezpośrednio — po prostu usuńcie folder `_build/`.
