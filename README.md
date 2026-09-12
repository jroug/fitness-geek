# Fitness Geek

Fitness Geek is a fitness and nutrition tracking application for recording meals, workouts, weight, and body composition, setting goals, and reviewing progress in a calendar.

It combines a Next.js frontend with a WordPress REST API backend and custom fitness-tracking functionality.

## Features

- **Dashboard:** Profile statistics, weight trends, workouts, and selected goals.
- **Nutrition:** Food management, meal logging, macronutrients, and AI-assisted nutrition lookup.
- **Workouts:** Exercise management and workout logging with duration and calorie information.
- **Measurements:** Weight and body-composition records, history, and charts.
- **Goals:** Targets, progress, completion status, and dashboard/calendar visibility controls.
- **Calendar:** Meals, workouts, measurements, daily comments, and grades, with token-based public sharing.
- **Reports:** Weekly calendar export to PDF.
- **Accounts:** Profile editing, profile pictures, password login, magic login, and logout.
- **Chat assistant:** Responses informed by the signed-in user's profile, goals, and calendar context.
- **Public pages:** Landing page, features, and contact information.

## Technology

| Layer | Tools |
| --- | --- |
| Application | Next.js 15, React 18, TypeScript |
| Interface | Material UI, Tailwind CSS, custom CSS, Framer Motion |
| Data fetching | SWR and Fetch API |
| Charts and calendar | Chart.js, React Chart.js 2, React Big Calendar |
| PDF export | jsPDF |
| Backend | WordPress, PHP, custom REST endpoints |
| Authentication | WordPress JWT authentication and an HTTP-only token cookie |
| AI features | Server-side OpenAI Responses API requests |
| Analytics | Vercel Analytics, enabled for the `live` environment |

## Architecture

Page routes use the Next.js App Router under `app/`. API handlers use the Pages Router under `pages/api/`.

Most authenticated requests follow this flow:

```text
React interface → Next.js /api endpoint → WordPress REST API → application data
```

The login endpoint exchanges credentials with WordPress and stores the returned JWT in an HTTP-only cookie. API handlers forward that token to the backend. Middleware redirects dashboard visitors without a token cookie; API authentication is handled separately. Shared calendars use their own token-based access flow.

AI requests run through Next.js API handlers. The chat handler retrieves user context from WordPress before calling OpenAI. The nutrition lookup handler requests structured food information.

## Project structure

```text
app/
├── (public)/                 # Landing, features, and contact pages
├── dashboard/                # Tracking, calendar, charts, goals, and profile
├── users/                    # Login, registration UI, logout, and magic login
├── layout.tsx                # Shared layout and metadata
└── globals.css
components/                   # Navigation, forms, calendar cells, and chat
lib/                          # Data fetchers, date helpers, and PDF export
pages/api/                    # Authentication, backend proxies, and AI handlers
public/                       # Images, fonts, icons, and styles
types/                        # Shared TypeScript declarations
middleware.ts                 # Dashboard cookie-presence routing guard
wp-backend/                   # Local WordPress installation (Git-ignored)
```

The local WordPress installation includes the custom `jr-fitnessgeek-core` plugin, with modules for meals, food macros, workouts, weighings, body composition, comments, tokens, and REST API customization.

## Local setup

### Prerequisites

- A Node.js version compatible with the locked dependencies and npm.
- A configured WordPress installation, database, and application-specific REST endpoints.
- WordPress JWT authentication configured for the frontend.
- An OpenAI API key for chat and nutrition lookup, if those features are needed.

The `wp-backend/` directory is excluded by `.gitignore`. A fresh frontend clone does **not** provision WordPress, its database, plugins, or application data. Obtain a matching backend separately, including the goals and chat-context endpoints consumed by the API handlers.

### Install dependencies

```bash
npm ci
```

### Configure the environment

Create `.env.local` in the project root. These are example values, not deployment credentials:

```dotenv
NEXT_PUBLIC_BASE_URL=http://localhost
NEXT_PUBLIC_BASE_PORT=:3000
NEXT_PUBLIC_ENV_NAME=local
WORDPRESS_API_URL=http://localhost/your-wordpress/wp-json
JWT_SECRET_KEY=replace-with-your-wordpress-jwt-signing-secret

# Optional: required only for AI features
OPENAI_API_KEY=replace-with-your-api-key
OPENAI_MODEL=gpt-4.1-mini
OPENAI_NUTRITION_MODEL=gpt-4.1-mini
```

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_BASE_URL` | Frontend origin without the separately configured port. |
| `NEXT_PUBLIC_BASE_PORT` | Port suffix including `:`, or empty when no explicit port is needed. |
| `NEXT_PUBLIC_ENV_NAME` | Environment label; `live` enables production-specific behavior such as analytics. |
| `WORDPRESS_API_URL` | WordPress REST API base ending in `/wp-json`, without a trailing slash. |
| `JWT_SECRET_KEY` | Secret used for token verification; must match the backend's JWT signing secret. |
| `OPENAI_API_KEY` | Server-side credential for chat and nutrition lookup. |
| `OPENAI_MODEL` | Optional chat model override; also used as a nutrition fallback. |
| `OPENAI_NUTRITION_MODEL` | Optional model override for nutrition lookup. |

Some profile handlers also accept `NEXT_PUBLIC_WORDPRESS_API_URL` as a fallback. Prefer `WORDPRESS_API_URL`. Variables prefixed with `NEXT_PUBLIC_` are public configuration. Keep credentials in server-only variables and do not commit real secrets.

### Start development

```bash
npm run dev
```

Open `http://localhost:3000`. The configured frontend URL and port must match the running server. Sign in using an application account on the configured WordPress backend; the password login handler expects the `subscriber` role.

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run build` | Create a production build. |
| `npm start` | Serve the production build. |
| `npm run lint` | Run the project's Next.js ESLint command. |

There is currently no dedicated automated test script in `package.json`.

## Deployment notes

- Use a Next.js server runtime: authentication, backend proxies, and AI features depend on server-side API handlers.
- Configure the frontend origin and backend URL for the target environment. Public environment values are incorporated into the frontend build.
- Keep WordPress reachable from the Next.js server and configure matching JWT secrets.
- Use HTTPS in production; the login handler sets a secure cookie in production mode.
- Keep the font files under `public/fonts/` available for PDF exports, including Greek text support.

## Data and integrations

The app uses backend data rather than a bundled mock dataset. Tracking, login, sharing, and profile features require the corresponding WordPress services. AI features additionally require a configured OpenAI account; the chat integration sends selected user context to that service when used.
