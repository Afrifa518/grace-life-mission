# GraceLife Mission International

> Full-stack website and staff CMS for **GraceLife Mission International**, a church based in Accra, Ghana. Public-facing site for members and visitors; protected admin area for staff to manage content.

**Live project** · Active development · Built and maintained solo.

---

## What's in it

### Public site
- **Home** — hero, upcoming events, latest sermons, ministry overview
- **About** — mission, vision, leadership
- **Sermons** — searchable sermon library with audio/video + notes
- **Events** — upcoming and past events with detail pages
- **Ministries** — every ministry has its own page (youth, worship, outreach, etc.)
- **Gallery** — photo and video galleries grouped by event
- **Give / Donations** — giving info and supported payment flows
- **Contact** — contact form, location, service times

### Protected staff CMS
Staff log in to an admin area where they can:

- Create, edit, publish, and archive **sermons, events, ministries, and gallery items**
- Manage **donation records** and giving campaigns
- Handle **contact submissions** from the public site
- Manage **users and roles** (pastor, media team, admin)
- Browse every domain through **server-side paginated admin tables** — fast even as the content library grows

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React · Vite · JSX |
| Styling | CSS / utility classes |
| Forms | Formik + Yup validation |
| HTTP | Axios |
| Auth | JWT with refresh, server-enforced role checks |
| Admin tables | Server-side pagination, sort, and filter |
| Hosting | Vercel (frontend) |

---

## Design decisions worth calling out

- **Server-side pagination for the admin area.** As sermon libraries and event archives grow past a few hundred items, client-side filtering stops scaling. Every admin table hits the API with `page`, `page_size`, `sort`, and `filter` params so the UI stays snappy regardless of how much content the church accumulates.
- **Separate public and admin bundles of behaviour.** Public pages are optimised for first-paint and SEO; admin routes are behind auth and carry the heavier CMS UI.
- **Media-first.** A church site lives or dies by whether sermons and event photos are easy to find and enjoyable to browse. Sermon playback, gallery navigation, and event storytelling get first-class treatment.
- **Built for non-techiical staff.** Admins are pastors and media volunteers — not engineers. The CMS prioritises clear forms, good defaults, and forgiving validation over power-user shortcuts.

---

## Running it locally

```bash
git clone https://github.com/Afrifa518/grace-life-mission.git
cd grace-life-mission

npm install
npm run dev      # Vite dev server
npm run build    # production build
npm run lint     # ESLint
```

Set your API base URL in an `.env` file (see `.env.example` if present).

---

## What this project demonstrates

- **Full end-to-end ownership of a real, live site** — design, frontend, backend integration, auth, deployment, ongoing maintenance.
- **Real-world CMS patterns** — role-based admin, server-side paginated tables, media management, donation tracking — the same patterns that power larger editorial platforms.
- **Shipping for non-technical users** — the people running the site day-to-day aren't engineers, which shapes every UX decision.
- **Consistent delivery on a live product** — this isn't a demo; it's a site the church actually uses.

---

## Related work

This is one of several production systems I've shipped solo. The main one is **KPee**, a multi-tenant SaaS platform for agricultural cooperatives in Ghana:

- [kpee-platform-overview](https://github.com/Afrifa518/kpee-platform-overview) — architecture of the full platform (1 FastAPI backend + 10 frontends + marketplace + General Ledger)
- [kpee-ai-overview](https://github.com/Afrifa518/kpee-ai-overview) — architecture of the role-scoped AI agent system inside KPee

---

## Contact

**Afrifa Yaw Ankamah** — CTO, Kibbutz Pishon Ltd
afrifabusiness518@gmail.com · +233 50 968 7490 · Accra, Ghana

Open to remote full-stack / backend engineering roles. [github.com/Afrifa518](https://github.com/Afrifa518)
