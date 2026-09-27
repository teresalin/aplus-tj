# A Plus TJ

A comprehensive cram school system.

## Demo link:

Access my site at [insert link here](https://google.com)

## Table of Content:

- [About The App](#about-the-app)
- [Screenshots](#screenshots)
- [Technologies](#technologies)
- [Setup](#setup)
- [Approach](#approach)
- [Status](#status)
- [Credits](#credits)
- [License](#license)

## About The App

A Plus TJ is a comprehensive management system designed for cram schools. It provides an efficient platform for owners and administrators to oversee and control various educational and administrative aspects. Key features include managing classes, teachers, and students; tracking student attendance; handling class schedules; assigning assignments; and handling billing processes. Built with React, Typescript, and NextJS.

## Screenshots

`![Writing](https://unsplash.com/photos/VBPzRgd7gfc)`

Picture by [Kelly Sikkema](https://unsplash.com/@kellysikkema)

## Technologies

I used `React`, `Typescript`, `NextJS`, `PostgreSQL`, `HTML`, and `CSS`.

The app uses the Next.js App Router with Prisma, NextAuth (Google sign-in), and MUI.

## Setup

- Download or clone the repository
- Run `npm install`
- Copy `.env.example` to `.env.local` and fill in the database URL, NextAuth secret, Google OAuth credentials, and the admin/teacher email allowlists
- Apply the database migrations: `npx prisma migrate deploy`
- Start the dev server: `npm run dev`

Other scripts: `npm run build`, `npm run lint`, and `npm run typecheck`.

### Project layout

- `src/app` – routes. Pages are Server Components that check access and load data; `src/app/api/**/route.ts` holds the mutation endpoints used by the UI.
- `src/modules/<domain>` – domain code: `*.service.ts` (server-only Prisma access), `schema.ts` (zod input validation), `types.ts`, and `components/` (client UI).
- `src/lib` – shared helpers (auth, API error handling, dates, Prisma client).

## Approach

...

## Status

This project is currently in development.

## Credits

List of contriubutors:

- [John Doe](johndoe.com)

## License

MIT license @ [author](author.com)
