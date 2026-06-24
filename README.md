# Coffee Store (The Grind Studio)

A React + TypeScript storefront for coffee brewing tools and accessories.

## Overview

This project demonstrates a small e-commerce style workflow:

- browse coffee accessories
- view product details
- add items to cart
- review cart totals and remove items
- submit a checkout form with client-side validation
- send a contact message via a validated contact form

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- Context API for shared cart state
- Vitest + Testing Library for unit/component tests

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Install

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Then open the local URL shown in your terminal (usually `http://localhost:5173`).

## Available Scripts

- `npm run dev` – start local dev server
- `npm run build` – type-check and create production build
- `npm run preview` – preview production build locally
- `npm run lint` – run ESLint
- `npm run test` – run tests in watch mode
- `npm run test:run` – run tests once

## Routes

- `/` – product list
- `/product/:productId` – product detail page
- `/cart` – cart and checkout form
- `/contact` – contact form

## Project Structure

```text
src/
	components/
		Card.tsx
		Layout.tsx
	context/
		CartContext.tsx
	hooks/
		useFetch.ts
	pages/
		ProductListPage.tsx
		ProductDetailPage.tsx
		CartPage.tsx
		ContactPage.tsx
	test/
		Card.test.tsx
		ContactPage.test.tsx
		CartPage.test.tsx
```

## Architecture Notes

- `Layout` contains shared app chrome (header, nav, footer, cart badge).
- `Card` is a reusable UI wrapper used by multiple pages.
- `CartContext` centralizes cart state and actions across routes.
- `useFetch` encapsulates reusable fetch lifecycle logic (`data`, `loading`, `error`, abort handling).

## Data Source

Product data is loaded from `public/data/accessories.json`.

## Testing

Run all tests:

```bash
npm run test:run
```

Run one test file:

```bash
npm run test:run -- src/test/CartPage.test.tsx
```
