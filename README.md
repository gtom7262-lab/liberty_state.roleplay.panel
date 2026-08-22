Projekt-Forum (Scaffold)

Dieses Projekt ist ein Basis-Forum mit Next.js, NextAuth (E-Mail/Passwort via Credentials) und Prisma (Postgres).

Wichtigste Schritte zum Einrichten:


OWNER_EMAIL: Setze die E-Mail, die als Projekt-Eigentümer gelten soll (OWNER_EMAIL). Wenn sich dieser Benutzer anmeldet, bekommt er automatisch die Rolle "owner".

Hinweis: Dieses Scaffold ist ein Startpunkt — erweitere es mit Foren-Features, Ratenbegrenzung, E-Mail-Verifikation und Deployment-Konfiguration.
# Liberty State Roleplay Forum

## Lokal starten

```bash
npm install
npm run dev
```

Die Seite ist danach unter `http://localhost:3000` erreichbar. Der Projektinhaber öffnet die Rangverwaltung unter `http://localhost:3000/dashboard`.

## Supabase-Datenbank

1. In Supabase das Projekt öffnen oder ein neues Projekt erstellen.
2. Unter **Project Settings > Database > Connection string** den URI-String kopieren.
3. In `.env` `DATABASE_URL` durch diesen aktuellen String ersetzen. Der Host muss zu deinem aktiven Supabase-Projekt gehören.
4. `NEXTAUTH_SECRET`, `NEXTAUTH_URL` und `OWNER_EMAIL` setzen.
5. Migration ausführen:

```bash
npm run migrate:deploy
npx prisma generate
```

Danach werden Benutzer, Forumränge, Threads und Beiträge dauerhaft in PostgreSQL gespeichert.

## Öffentlich mit Vercel

1. Den Ordner `project-forum` in ein GitHub-Repository hochladen. `.env` wird durch `.gitignore` nicht hochgeladen.
2. Das Repository in Vercel importieren und als **Root Directory** `project-forum` wählen.
3. In Vercel unter **Settings > Environment Variables** setzen:

```env
DATABASE_URL=dein_aktueller_supabase_connection_string
NEXTAUTH_SECRET=ein_neuer_langer_geheimer_wert
NEXTAUTH_URL=https://deine-domain.de
OWNER_EMAIL=deine-e-mail-adresse
```

4. In Vercel unter **Settings > Domains** deine Domain hinzufügen.
5. Die angezeigten DNS-Einträge beim Domainanbieter setzen und anschließend deployen.
6. Im Vercel-Projekt unter **Settings > Build and Deployment** als Build Command `npm run build` verwenden. Die Migration sollte vor dem ersten Aufruf einmal lokal mit derselben `DATABASE_URL` oder über das Supabase SQL Editor-Tool angewendet werden.
