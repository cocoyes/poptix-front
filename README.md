# POPTIX

POPTIX is a dark, marketplace-first ticket experience prototype. Users can browse live events, discover ticket pools, draw mock ticket assets, explore listings, place simulated bids and manage a portfolio.

## Stack

Next.js App Router, React, TypeScript strict mode, Tailwind CSS, Zustand, TanStack Query-ready service layer, Lucide icons and Recharts-ready chart primitives.

## Run

```bash
npm install
npm run dev
```

`npm run build` validates the production bundle.

## Routes

`/`, `/events`, `/events/[eventId]`, `/marketplace`, `/pools`, `/pools/[poolId]`, `/trade`, `/portfolio`, `/rewards`, `/profile`.

## Architecture

Domain types live in `src/types`, generated mock fixtures in `src/mock`, and asynchronous repository functions in `src/services/mock.ts`. UI routes consume those boundaries instead of importing service-shaped logic. Zustand is limited to local interaction state: authentication, sidebar, favorites, points and ticket assets.

All money movement, login, draw randomness, order placement and wallet actions are mocked. Future API, Privy and WebSocket adapters should replace the service layer without changing page contracts.
