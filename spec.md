
# Preffy Project Specification

## 1. Site Map

### Public Routes
- `/` — Landing  
- `/features` — Feature overview  
- `/pricing` — Plans & pricing  
- `/signup` — Create account  
- `/login` — Log in  

### Authenticated App (`/app`)
- `/app/dashboard` — Project list & status  
- `/app/projects/new` — New‑project wizard  
- `/app/projects/:projectId/overview` — Analysis progress & summary  
- `/app/projects/:projectId/body-feedback` — Body & facial feedback view  
- `/app/projects/:projectId/script-feedback` — Script feedback view  
- `/app/profile` — Personal details & avatar  
- `/app/settings` — Preferences, theme, language  

### Fallback  
- `*` — 404 Not Found


## 2. Page‑by‑Page Core Functions

**Landing** — Brand promise, hero CTA, teaser carousel, social proof.  
**Features / Pricing** — Animated walkthroughs, comparison cards.  
**Auth** — Email & social sign‑up, inline validation, magic‑link fallback.  
**Dashboard** — Card grid of projects, status chips, search & sort, "New Project" FAB.  
**New Project Wizard** — Title/desc → audience/formality/domain → video upload with progress.  
**Overview** — Realtime job progress bar, ETA, quick links to feedback screens.  
**Body Feedback** — Tabs (Gestures / Facial), badge grid with star ratings, 16:9 player, heat‑map timeline, synchronized thumbnails.  
**Script Feedback** — Structure pane vs. improved outline pane; "Why?" accordion; accept/reject suggestions; Habits sub‑tab with filler‑word stats and quick‑fix buttons.  
**Profile / Settings** — Avatar upload, password reset, theme toggle, language, subscription status.

## 3. Data Model (Conceptual)

- **User** (id, name, email, avatar, locale, plan)  
- **Project** (id, userId, title, desc, audience, formality, domain, status, createdAt)  
- **Video** (id, projectId, url, duration, resolution)  
- **ScriptSegment** (id, projectId, start, end, text, speechAct)  
- **BehaviorEvent** (id, projectId, start, end, type, category, severity)  
- **BadgeScore** (badgeId, projectId, stars, totalEvents)  
- **Suggestion** (id, projectId, segmentIds[], beforeText, afterText, rationale)

## 4. UI & Interaction Guidelines

- **Layout** — Responsive 12‑column grid, max‑width 1440 px, ample whitespace.  
- **Navigation** — Top bar + left drawer (desktop), bottom sheet (mobile).  
- **Motion** — Fade/slide 200 ms, skeleton loaders for async data.  
- **Accessibility** — WCAG AA contrast, keyboard navigation, captions.  
- **Tone** — Friendly, encouraging, second‑person.

## 5. Design Guide

### Palette
- Mint Green `#09A484` (primary)  
- Sunshine Yellow `#EACD10` (accent)  
- Jet `#222222` (text)  
- Cloud `#F9FAFB` (background)

### Typography
- **Inter SemiBold** (headlines)  
- **Inter Regular** (body)

### Iconography
- 2 px rounded‑stroke line icons; single‑color badge fills.

### Brand Elements
- Wordmark "**Preffy**" in Poppins ExtraBold Italic.  
- Rounded rectangles & circles as recurring motif.

## 6. Development Stages

### Step 1 — Front‑First Prototype
Static routes + mocked JSON; local video preview; fake auth in localStorage. **Goal:** validate UX.

### Step 2 — REST Backend Integration
JWT auth, video upload storage, async analysis jobs, CRUD endpoints, dashboard polling. **Goal:** full feature parity.

### Step 3 — Real‑Time Enhancements
WebSocket/SSE for live progress & badge updates; collaborative script editing with presence cursors. **Goal:** instantaneous feedback delight.

---
