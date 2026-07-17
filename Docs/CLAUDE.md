# TORQ — project brief for Claude Code

Read this in full before writing any code. It's the working brief for a mobile-first
motorcycle maintenance and community app for Glasgow riders. The full requirement
spec (Requirement_Spec.docx) has the complete FR1–FR26 / NFR1–NFR11 list, user
personas, and timeline — treat this file as the condensed, buildable version of it.

## Project overview

TORQ helps riders track bike maintenance (services, MOT, tax, insurance), run a
pre-ride safety checklist, and connect with the local riding community (events,
local rides, guides) around Glasgow, Scotland. Target users range from new riders
(age 16+) to returning riders in their 60s, so the UI needs to stay simple and
readable throughout — this is not a power-user tool.

## Tech stack and hosting

- **Frontend:** React + Tailwind CSS, deployed on Netlify
- **Backend:** Node.js + Express, deployed on Railway or Render (not Netlify —
  Netlify only supports static hosting and short-lived serverless functions, not
  an always-on Express server)
- **Database:** MySQL, hosted alongside the backend (Railway/Render managed MySQL,
  or PlanetScale)
- **Auth:** custom JWT + bcrypt, implemented in Express — not Netlify Identity.
  Keeping auth in the same backend as bike/profile data avoids splitting session
  logic across two systems.
- Frontend and backend are separate deployments talking over a REST API — set up
  CORS on the Express side early, and confirm both deployments talk to each other
  with a trivial "hello world" route before building real features.

## Design system

Dark mode is the only theme (no light mode toggle). Brand mark is a white helmet
icon paired with the wordmark "TORQ". Colours (use as CSS variables/Tailwind
config, not hardcoded per-component):

| Token | Hex | Use |
|---|---|---|
| Page background | `#0A0E1A` | near-black dark blue, not pure black/grey |
| Card surface | `#131B2E` | one step lighter than page bg, no border needed |
| Text primary | `#F5F7FA` | |
| Text secondary | `#8B95AC` | muted, for supporting text |
| Accent (orange) | `#FF7A33` | **only** for meaning: active nav tab, urgent alerts, hover/click states, progress bars, card accents. Never decorative. |
| Secondary accent (teal) | `#5DCAA5` | calendar bike-meet dates only, to stay distinct from orange = maintenance |

Icons: Tabler outline icon set. Layout: flat cards, 12px radius, no gradients/
shadows. Mobile-first responsive — build and test the mobile layout first, then
adapt for tablet/desktop.

**Navigation:** mobile uses a hamburger menu; tablet and desktop use a horizontal
nav list in the top right, with the active item underlined/coloured in orange.

## Information architecture

**Home dashboard** — two card groups:
- *Your bike*: maintenance notification, service & MOT status, pre-ride checklist.
  Each is a tappable card linking to its own screen — don't show full detail on
  the dashboard itself.
- *Community*: upcoming events/meetups, local rides, guides.

Bike profile and account settings do **not** appear on the home dashboard — they
live entirely under Profile.

On desktop/tablet, add a persistent right-hand sidebar containing a bike snapshot
card (make/model/mileage/last service) and a mini calendar with colour-coded dates
(orange = maintenance, teal = bike meet) and a small legend. The main card content
reflows next to the sidebar rather than widening.

**Profile screen**:
- User header: avatar/icon circle (generic user icon placeholder until photo
  upload exists), display name, email, edit/logout actions
- *My bikes*: stacked bike cards. Each user can own multiple bikes (some riders
  own more than one and do their own servicing — don't assume a single bike per
  account).
- Each bike card, when expanded/opened, shows: mileage, last service, key dates
  (MOT/tax/insurance — colour the one that's actually due soon in orange, leave
  the others neutral), a per-bike mini calendar of its own maintenance dates, and
  cached spec data (engine, power, torque, kerb weight) with a "specs synced
  [x] ago" timestamp
- "Add another bike" button (dashed outline, not solid) below the bike list —
  opens an onboarding-style add-bike flow (not yet designed, stub it for now)

## Database schema

Core relational chain:

```
users (user_id PK, display_name, email UNIQUE, password_hash, avatar_url, created_at)
  └─ 1:N → bikes (bike_id PK, user_id FK, make, model, year,
                   spec_json, mileage, mot_date, tax_date, insurance_date,
                   last_synced_at, created_at)
```

Independent reference tables (no FK to users):
- `checklist_items` (item_id, label, sort_order) — static pre-ride checklist.
  Completion state lives in frontend session state only, **not** persisted —
  it must reset on page reload and on logout.
  Current build (`PreRideChecklist.jsx`) is a deliberate scope-down of this:
  a static, read-only, hardcoded six-item display with no checkboxes, no
  state, and no backend/table at all. Upgrading it to the interactive
  FR6/FR7 version above (real checkboxes, session state, DB-backed items)
  is a planned addition, not a bug to fix.
- `events` (event_id, name, description, event_date, start_time, end_time,
  image_url, location) — `location` is a plain text field (e.g. "Riverside
  car park, Glasgow"), not latitude/longitude — simpler than geocoding every
  event, and there's no map view yet that would actually need coordinates.
  A featured-event preview on the profile page (`GET /api/events/featured`)
  automatically shows whichever upcoming event has the closest `event_date`
  — there's no admin panel to manually flag one as featured.
- `hotspots` (hotspot_id, name, description, category, latitude, longitude)
- `weather_cache` (cache_id, latitude, longitude, fetched_at, expires_at,
  raw_json) — short expiry (15–30 min), keyed by rounded lat/lng

`mot_date`, `tax_date`, `insurance_date` are nullable (optional fields).
`password_hash` is a bcrypt hash only — never store plaintext passwords.

## External APIs

**API Ninjas Motorcycles API** — free tier, no images provided.
- `/v1/motorcyclemakes` → populates the Make dropdown
- `/v1/motorcyclemodels?make=X` → populates Model dropdown once Make is chosen
- `/v1/motorcycles?make=X&model=Y&year=Z` → full spec, called once on bike
  creation and cached into `bikes.spec_json` — don't call this on every
  dashboard load
- Store the API key server-side as an environment variable; proxy all calls
  through Express, never call it directly from the frontend
- No reliable images from this API — until a separate image source is
  confirmed, show a generic icon based on bike type (sport/cruiser/adventure/
  naked) as a placeholder

**Open-Meteo** — free, no API key or account needed at all (one less credential
to manage). Used for the dashboard weather strip and a rider-friendliness
indicator.
- Call the forecast endpoint with the user's stored lat/lng, defaulting to
  Glasgow if unset
- Cache the response in `weather_cache`; calculate the ride-suitability score
  server-side from the cached data, not in the browser
- **Ride-suitability algorithm**: rule-based, not ML. Score temperature,
  precipitation probability, wind speed, and weather code independently, then
  take the single **worst** factor as the overall result (not an average) —
  one dangerous condition shouldn't be masked by otherwise good weather.
  Rough first-pass thresholds (expect to tune after user testing):
  - Temperature: good >10°C, caution 5–10°C, poor <5°C
  - Precipitation probability: good <30%, caution 30–60%, poor >60%
  - Wind speed: good <25 km/h, caution 25–40 km/h, poor >40 km/h
  - Weather code: thunderstorm/snow/ice → always poor, regardless of other factors
  - Result surfaces as Good / caution / poor on the dashboard

**Email reminders**: use Nodemailer with an SMTP provider to send reminder
emails ahead of MOT/tax/insurance renewal dates.

## Error handling and loading states

Every screen that depends on dynamically fetched content (events, hotspots,
weather, bike specs) needs an explicit loading state and an explicit error state
— never leave a blank or broken-looking screen if a fetch is slow or fails. If
Open-Meteo is unavailable, fall back to the last cached weather reading with its
timestamp shown, rather than hiding the weather section entirely.

## Suggested build order

1. Design and migrate the MySQL schema above; get Express talking to it
2. Auth: registration, login, JWT issuance, logout, bcrypt hashing
3. Bike CRUD (including the API Ninjas cascading dropdowns and spec caching),
   multi-bike support
4. Maintenance records and the pre-ride checklist (session-only state)
5. Dashboard frontend (mobile first, then desktop sidebar variant)
6. Profile frontend (mobile first, then desktop variant)
7. Events/hotspots/guides (static or lightly dynamic content is fine initially)
8. Weather integration and the ride-suitability score
9. Email reminders
10. Testing, accessibility pass (aim for WCAG 2.1 AA where feasible), polish

## Reference

The full Requirement_Spec.docx (functional/non-functional requirements, user
personas, full navigation structure, timeline) should live in this repo — add
it under `docs/` and treat it as the source of truth for anything this file
doesn't cover in enough detail.
