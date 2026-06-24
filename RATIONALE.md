# Your component hierarchy and how you decided what to extract into separate components 

The application follows a layered React structure:

Entry setup in main.tsx wraps the application with router + global cart provider, then renders App.tsx.

App.tsx defines route-level pages and places them inside the shared Layout.tsx shell.

Layout.tsx provides global user interface (header, navigation, cart badge, footer), while page components in pages handle route-specific content.

Card.tsx is a reusable presentational wrapper used across pages for consistent section structure.

Shared logic is separated into CartContext.tsx for cart state and useFetch.ts for reusable data fetching.

I used a scope-and-reuse rule to decide extraction. I extracted components when it is shared responsibility or cross-route reuse. When it is single-page behavior, I kept local.

# State management decisions — where state lives, why you chose Context vs. lifting state 

State is organized by scope of responsibility:

Global shared state lives in CartContext.tsx: cart items, add/remove actions, and derived cart count.

Local user interface state stays inside page components in CartPage.tsx and ContactPage.tsx: form values, validation errors, submit status, and page-only interaction state.

I chose Context instead of lifting state because cart data is needed across non-parent/child branches (header cart badge in Layout.tsx, product pages, and cart page). Lifting to a common ancestor would force prop drilling through multiple layers and routes. Context gives one shared source of truth with cleaner consumption via the custom hook, reducing coupling between components.

Why some state is not in Context:

Contact and checkout form state is not reused across routes, so keeping it local avoids unnecessary global complexity.

This keeps ownership clear: shared business state is global, transient page behavior is local.

# Your custom hook(s) and what logic they encapsulate 

This project uses 2 custom hooks:

1. useFetch<T>(url) in useFetch.ts: encapsulates reusable async data-loading logic, including loading, error, and data state, HTTP status checks, error normalization, and request cancellation with AbortController on unmount.

2. useCart() in CartContext.tsx: a convenience hook over React Context that exposes shared cart state and actions (items, addToCart, removeFromCart, cartCount) and enforces provider usage with a guard error.

Together, they keep page components focused on rendering and page-specific behavior, while shared data and state-management logic stays centralized and reusable.

# How you structured routes and handled data fetching 

I centralized routes in App.tsx, where each path maps directly to a page component inside the shared Layout.tsx: / (product list), /product/:productId (product detail), /contact, and /cart. This keeps navigation structure simple and makes each page responsible for one user flow.

Data fetching is handled through the reusable useFetch<T>(url) hook in useFetch.ts, which manages loading, error, and data state in one place. Product pages call this hook with /data/accessories.json, then use the returned data differently: ProductListPage.tsx renders all items, while ProductDetailPage.tsx selects one item using the productId route parameter.
