# 🎓 Coreon Edu — by Kogia Group

**Quick classroom evaluation SaaS.** Teachers evaluate the whole class in seconds with **drag & drop**; results are shared instantly with admins, owners and parents.

🟢 Teacher · 🔵 Admin · 🟣 Owner · 🟠 Parent — each portal is **white + one colour**.

> **Status:** P0 prototype (this repo). See [`PLAN.md`](PLAN.md) for the full zero→production plan.

## ✨ The idea
- Teacher logs in → the **class scheduled right now** is already on screen (no navigation).
- **5 quick questions**, answered by **dragging students into buckets** (Excellent / Good / Average / Needs work).
- Add **badges** + a **note** → **Save & share**.
- Admin / Owner / Parent portals show the results live.

## 🔗 Live demo
Once GitHub Pages finishes building (Actions tab): **https://oounis.github.io/Kogia_Education/**
Pick any role on the login screen — start with **Teacher** to try the drag-and-drop.

## 🧑‍💻 Tech (P0)
React 19 · Vite · Tailwind v4 · **@dnd-kit** (drag & drop) · Framer Motion · Recharts · Lucide · date-fns. No backend yet — mock data + `localStorage`.

## ▶️ Run it locally
```bash
cd app
npm install
npm run dev      # http://localhost:5173
```
Build: `npm run build` → output in `app/dist`.

## 📁 Structure
```
Kogia_Education/
├── PLAN.md                  zero → production plan
├── README.md
├── app/                     the P0 prototype (React + Vite)
│   └── src/
│       ├── pages/           Login · Teacher · Admin · Owner · Parent
│       ├── components/      PortalShell · dnd primitives
│       ├── data.js          mock school / schedule / students
│       ├── theme.js         white + one accent per portal
│       └── results.js       evaluation aggregation
└── .github/workflows/       GitHub Pages auto-deploy
```

## 🗺️ Next (P1)
FastAPI backend + PostgreSQL (multi-tenant) + real auth/RBAC + schedule-driven loading. See `PLAN.md`.

---
*Clean start — built from a fresh vision, no legacy files reused.*
