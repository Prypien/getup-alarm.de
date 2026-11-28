# getup-alarm.de

Website der App **GET UP! – Wecker mit Aufgaben** (iOS und Android). Reines HTML und CSS, kein Build-Schritt.
Ausgeliefert über GitHub Pages aus `main`, Domain über die Datei `CNAME`.

| Datei | Zweck |
| --- | --- |
| `index.html` | Landingpage mit Links in den App Store und zu Google Play |
| `privacy.html`, `delete.html`, `impressum.html` | Rechtsseiten, in den Stores und bei Meta verlinkt |
| `partner.html` | Creator-Programm (`/partner`) mit Bewerbungsformular, Versand über FormSubmit an `team@getup-alarm.de`; verlinkt in Menü, Fußzeile und Hinweis auf der Startseite |
| `join.html` | Einladungslink (`/join.html#CODE`), öffnet die App oder zeigt den Code |
| `404.html` | Seite für unbekannte Adressen |
| `.well-known/` | App-Verknüpfung für iOS (`apple-app-site-association`) und Android (`assetlinks.json`) |
| `app.css` | Design „Retro-Pop“ für Rechtsseiten, `join.html` und `404.html` wie in der App; Werte aus `GetUp/Design/Theme.swift` im App-Repo |
| `3d.css`, `js/3d.js`, `js/clock.js` | Startseite und Creator-Seite in 3D (seit 28.11.2026): 3D-Handys, Aufgaben-Karussell, Stufen-Treppe, cel-shaded 3D-Wecker im Kopf |
| `js/three.min.js` | three.js r128 (MIT), selbst gehostet statt CDN, damit keine Daten an Dritte gehen; nur für den 3D-Wecker |

## Stand

- Die App (1.0) kennt nur die alte Adresse `chasingdreamsinteractive.com/getup/`. Diese Seite ist vorbereitet;
  Einladungslinks, Store-Einträge und Meta ziehen erst mit Version 1.1 um. Bis dahin bleibt die alte Seite online.
- `join.html` reicht dem Banner „In der App öffnen“ deshalb noch die alte Adresse weiter.
- Die Bilder in `img/` stammen aus `docs/store/raw/` im App-Repo, `og.jpg` aus dem Store-Panorama.

## Lokal ansehen

```bash
python3 -m http.server 8767
```

## DNS (Squarespace)

`A` für `@` auf 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153 und `CNAME` für `www` auf
`prypien.github.io`. Die Mail-Einträge der Weiterleitung (MX, SPF) bleiben daneben bestehen.
