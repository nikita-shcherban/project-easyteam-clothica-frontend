# Header

React + TypeScript header, styled with CSS Modules. Connected once in
`app/layout.tsx` before `<main>`. `Header.tsx` is the server wrapper;
`HeaderClient.tsx` handles navigation, auth state and the mobile menu.
On `/auth/*` it renders only the SVG logo on a light background.

- Figma: Clothica → UI Elements → Navbar.
- Mobile: 320–767 px, container capped at 375 px. Tablet: 768 px. Desktop: 1440 px.
- Mobile navigation uses a modal `<dialog>` with native focus containment and
  Escape handling. Closing restores focus and the page's scroll position.
- Routes: `/`, `/goods`, `/categories`, `/profile`, `/auth/login`,
  `/auth/register`; the cart opens `/basket` (an intercepted modal during client
  navigation). The basket's checkout button leads to `/order`.
- The server Header calls `getUser()` from `lib/api/server-api.ts`, forwarding
  session cookies to the backend's `GET /api/users/me` through Axios. Missing
  cookies or a backend `401` resolve to `null`; other failures propagate.
  Header receives the user as a prop, without a browser-side session request.
  Header initializes the team's `User | null` Zustand state from that prop
  before paint; login/logout update the same store. The server snapshot keeps
  the initial HTML and hydration consistent;
  logout calls `POST /api/auth/logout` before clearing user
  state. Session credentials remain in backend cookies.
- The cart badge sums item quantities and hides when the cart is empty. It uses
  the team's shared `useBasketStore`, persisted under `basket` in localStorage. Hydration
  happens after mounting to keep server and client markup consistent.

Other cart/product components can use the shared store:

```tsx
const addItem = useBasketStore((state) => state.addItem);
addItem({
  goodId: good._id,
  name: good.name,
  image: good.image,
  price: good.price.value,
  currency: good.price.currency,
  size: selectedSize,
  quantity,
  rating: good.rating,
  feedbacksCount: good.feedbacksCount,
});

const setQuantity = useBasketStore((state) => state.setQuantity);
setQuantity(good._id, selectedSize, 2);

const removeItem = useBasketStore((state) => state.removeItem);
removeItem(good._id, selectedSize);
```

Product ID and size identify a cart line. Adding the same pair increases its
quantity; another size creates a separate line. `clear()` empties the cart.

The basket modal and GoodsOrderList share this store with Header. The team has
implemented category pages. Order, profile and product-detail pages are still
placeholders in the current main branch.
