# METRO Trainee Testportal

## Projekt starten

```bash
npm install
npm run dev
```

## Build testen

```bash
npm run build
```

## GitHub-Struktur

```txt
index.html
package.json
README.md
.env.example
supabase.sql
src/
  App.jsx
  main.jsx
  style.css
```

## Vercel

1. Neues GitHub-Repository erstellen, z. B. `metro-trainee-test`.
2. Alle entpackten Dateien hochladen.
3. In Vercel ein neues Projekt erstellen.
4. Framework: Vite
5. Build Command: `npm run build`
6. Output Directory: `dist`

## Supabase Backend einrichten

In Supabase im SQL Editor den Inhalt aus `supabase.sql` ausführen.

Dann in Vercel unter `Settings -> Environment Variables` eintragen:

```txt
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Danach Redeploy.

## Demo-Logins

Leitung:
- `leitung` / `metro2026`
- `leo` / `metro2026`
- `juergen` / `metro2026`

Trainees:
- `trainee01` / `test123`
- `trainee02` / `test123`
- `trainee03` / `test123`

## Wichtiger Hinweis

Die Login-Daten stehen aktuell im Frontend-Code. Für echten Zugriffsschutz sollte später Supabase Auth eingebaut werden.
