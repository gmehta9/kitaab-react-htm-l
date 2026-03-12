# Kitaab Junction — Frontend Integration Guide

> Base URL: `http://localhost:5000/api`

---

## Axios Setup (Both Apps)

### axiosInstance.js (or .ts)

```js
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers["x-token"] = token;
  }
  return config;
});

// Response interceptor — unwrap data
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/sign-in";
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default axiosInstance;
```

### File Upload Helper (Utils.js)

```js
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Use raw axios for file uploads (NOT axiosInstance)
export const uploadImage = async (file, type = "product") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);

  const token = localStorage.getItem("token");
  const res = await axios.post(`${API_BASE_URL}/upload-image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.image; // returns "product/filename.jpg"
};

// Image URL builder
export const getImageUrl = (imagePath) => {
  if (!imagePath) return "/placeholder.png";
  return `http://localhost:5000/public/storage/${imagePath}`;
};
```

### .env (Frontend)

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STORAGE_URL=http://localhost:5000/public/storage
```

---

## SUPER ADMIN Panel — API Endpoints

### Login / Auth

| Action | Method | Endpoint | Body / Query |
|--------|--------|----------|-------------|
| Sign In | `POST` | `/auth/sign-in` | `{ emailOrphone, password, type: "SuperAdmin" }` |
| Sign Out | `GET` | `/auth/sign-out` | — |
| Change Password | `POST` | `/auth/pass-change` | `{ old_password, new_password, password_confirmation }` |

**Login Response:**
```json
{ "token": "jwt...", "user": { "id": "...", "name": "...", "email": "...", "role": "SuperAdmin", "is_address": false } }
```

**Store after login:**
```js
const handleLogin = async (values) => {
  const res = await axiosInstance.post("/auth/sign-in", {
    emailOrphone: values.email,
    password: values.password,
    type: "SuperAdmin",
  });
  localStorage.setItem("token", res.token);
  localStorage.setItem("user", JSON.stringify(res.user));
};
```

---

### Dashboard

| Action | Method | Endpoint | Response |
|--------|--------|----------|----------|
| Get Counts | `GET` | `/dashboard/count` | `{ data: { product_count, user_count, order_count } }` |

```js
const res = await axiosInstance.get("/dashboard/count");
// res.data.product_count, res.data.user_count, res.data.order_count
```

---

### Products (Admin)

| Action | Method | Endpoint | Query / Body |
|--------|--------|----------|-------------|
| List Products | `GET` | `/sup-products` | `?page=1&size=20&filterBy=approved|not-approved&searching=text` |
| View Product | `GET` | `/product/:id` | — |
| Create Product | `POST` | `/product` | `{ title, category_id, price, sale_price, auther, transact_type, year_of_publication, short_description, description, images, is_approved, state, city }` |
| Update Product | `PUT` | `/product/:id` | Same as create |
| Delete Product | `DELETE` | `/product/:id` | — |
| Approve/Reject | `PUT` | `/product/:id` | Send full object with `is_approved: 1` or `0` |
| Upload Image | `POST` | `/upload-image` | `FormData: { file, type: "product" }` |

```js
// List products
const res = await axiosInstance.get("/sup-products", {
  params: { page: 1, size: 20, filterBy: "approved", searching: "physics" },
});
// res.data.data = [...products], res.data.total, res.data.per_page, res.data.current_page

// Approve product
await axiosInstance.put(`/product/${id}`, { ...productData, is_approved: 1 });
```

**NOTE:** Frontend sends `images` (string filename from upload), backend stores as `image`.

---

### Categories (Admin)

| Action | Method | Endpoint | Body |
|--------|--------|----------|------|
| List | `GET` | `/category?page=1&size=20` | — |
| Create | `POST` | `/category` | `{ name }` |
| Update | `PUT` | `/category/:id` | `{ name }` |
| Delete | `DELETE` | `/category/:id` | — |

```js
const res = await axiosInstance.get("/category", { params: { page: 1, size: 50 } });
// res.data.data = [{ id, name, products_count }]
// res.data.total, res.data.per_page, res.data.current_page
```

---

### Users (Admin)

| Action | Method | Endpoint | Query |
|--------|--------|----------|-------|
| List Users | `GET` | `/user?page=1&size=20` | `?page=1&size=20` (large size for export) |

```js
const res = await axiosInstance.get("/user", { params: { page: 1, size: 20 } });
// res.data.data = [{ id, name, phone_number, email, city, state, organization }]
```

---

### Orders (Admin)

| Action | Method | Endpoint | Query / Body |
|--------|--------|----------|-------------|
| List Orders | `GET` | `/order?page=1&size=20` | `?todayfilter=2026-03-11` (optional date filter) |
| Update Status | `PATCH` | `/order/:id/status-update` | `{ status: "not_executed" \| "partially_executed" \| "fully_executed" }` |

```js
const res = await axiosInstance.get("/order", {
  params: { page: 1, size: 20, todayfilter: "2026-03-11" },
});
// res.data.data = [...orders]

await axiosInstance.patch(`/order/${id}/status-update`, { status: "fully_executed" });
```

---

### Wishlist (Admin View)

| Action | Method | Endpoint | Query |
|--------|--------|----------|-------|
| List All Wishlists | `GET` | `/admin-wishlist?page=1&size=20` | — |

```js
const res = await axiosInstance.get("/admin-wishlist", { params: { page: 1, size: 20 } });
// res.data.data = [{ id, title, author, publication_year, created_by_user: { name, email, phone_number, city } }]
```

---

### Contact Messages (Admin)

| Action | Method | Endpoint |
|--------|--------|----------|
| List Messages | `GET` | `/contact-us?page=1&size=20` |

```js
const res = await axiosInstance.get("/contact-us", { params: { page: 1, size: 20 } });
// res.data.data = [{ id, first_name, last_name, email, phone_number, message, createdAt }]
```

---

### Channels (Admin)

| Action | Method | Endpoint | Body / Query |
|--------|--------|----------|-------------|
| List Channels | `GET` | `/channel?page=1&size=20` | — |
| Create Channel | `POST` | `/channel` | `{ name }` |
| Update Channel | `PUT` | `/channel/:id` | `{ name }` |
| View Join Requests | `GET` | `/channel/:channelId/requestsList?status=pending` | `?status=pending\|active` |
| Accept Request | `PUT` | `/channel/:channelId/requestAccept` | `{ user_id }` |
| Reject Request | `PUT` | `/channel/:channelId/requestReject` | `{ user_id }` |
| View Messages | `GET` | `/channel/:channelId/messages?page=1&size=20` | — |
| Delete Message | `DELETE` | `/channel/admin/:channelId/message/:messageId/delete` | — |
| Delete All Messages | `DELETE` | `/channel/admin/:channelId/messages/delete` | — |

```js
// List channels
const res = await axiosInstance.get("/channel", { params: { page: 1, size: 20 } });
// res.data.data = [{ id, name, active_users_count, pending_users_count }]

// View requests
const requests = await axiosInstance.get(`/channel/${channelId}/requestsList`, {
  params: { status: "pending" },
});
// requests.data = [{ id, channel_id, user_id, status, user: { name, email, phone_number } }]

// Accept
await axiosInstance.put(`/channel/${channelId}/requestAccept`, { user_id: userId });

// Messages
const msgs = await axiosInstance.get(`/channel/${channelId}/messages`, { params: { page: 1, size: 20 } });
// msgs.data.data = [...messages], msgs.data.last_page = N

// Admin delete message
await axiosInstance.delete(`/channel/admin/${channelId}/message/${messageId}/delete`);

// Admin delete ALL messages
await axiosInstance.delete(`/channel/admin/${channelId}/messages/delete`);
```

---

---

## USER App — API Endpoints

### Auth (User)

| Action | Method | Endpoint | Body |
|--------|--------|----------|------|
| Sign Up | `POST` | `/auth/sign-up` | `{ name, email, phone_number, password, city, state, organization }` |
| Sign In | `POST` | `/auth/sign-in` | `{ emailOrphone, password, type: "Buyer/Seller" }` |
| Sign Out | `GET` | `/auth/sign-out` | — |
| Forgot Password | `POST` | `/auth/pass-reset` | `{ email }` |
| Change Password | `POST` | `/auth/pass-change` | `{ old_password, new_password, password_confirmation }` |
| Get Profile | `GET` | `/auth/profile` | — |
| Update Profile | `POST` | `/auth/profile` | `{ name, phone_number, email, city, state, pin_code, address, organization }` |

```js
// Sign Up
const res = await axiosInstance.post("/auth/sign-up", {
  name: "John",
  email: "john@example.com",
  phone_number: "9876543210",
  password: "pass123",
  city: "Mumbai",
  state: "Maharashtra",
  organization: "ABC School",
});
localStorage.setItem("token", res.token);
localStorage.setItem("user", JSON.stringify(res.user));

// Sign In (User app sends type as "Buyer/Seller")
const res = await axiosInstance.post("/auth/sign-in", {
  emailOrphone: "john@example.com",
  password: "pass123",
  type: "Buyer/Seller",
});
// res = { token: "jwt...", user: { id, name, email, role: "User", is_address } }

// Get Profile
const profile = await axiosInstance.get("/auth/profile");
// profile.data = { name, phone_number, email, city, state, pin_code, address, organization, is_address }

// Update Profile (POST not PUT)
const updated = await axiosInstance.post("/auth/profile", {
  name: "John Updated",
  phone_number: "9876543210",
  city: "Delhi",
  state: "Delhi",
  pin_code: "110001",
});
// updated.data = updatedUser, updated.message = "Profile updated successfully"

// Change Password
await axiosInstance.post("/auth/pass-change", {
  old_password: "oldpass",
  new_password: "newpass123",
  password_confirmation: "newpass123",
});

// Forgot Password
await axiosInstance.post("/auth/pass-reset", { email: "john@example.com" });
```

---

### Products (User)

| Action | Method | Endpoint | Query / Body |
|--------|--------|----------|-------------|
| Browse Products | `GET` | `/product` | `?page=1&size=50&searching=text&auther_searching=text&state=X&city=X&category[0]=id1&category[1]=id2` |
| My Products | `GET` | `/product` | `?user_id=MY_USER_ID&page=1&size=50` |
| View Product | `GET` | `/product/:id` | — |
| Add Product | `POST` | `/product` | `{ title, category_id, price, sale_price, auther, transact_type, year_of_publication, short_description, description, images, state, city }` |
| Edit Product | `PUT` | `/product/:id` | Same as above (sets `is_approved: 0` on edit) |
| Upload Image | `POST` | `/upload-image` | `FormData: { file, type: "product" }` |

```js
// Browse all approved products
const res = await axiosInstance.get("/product", {
  params: { page: 1, size: 50, searching: "physics" },
});
// res.data.data = [...products with created_by_user populated]
// res.data.total, res.data.per_page, res.data.current_page

// Filter by categories (array format)
const res = await axiosInstance.get("/product", {
  params: {
    page: 1,
    size: 50,
    "category[0]": "category_id_1",
    "category[1]": "category_id_2",
    state: "Maharashtra",
    auther_searching: "Sharma",
  },
});

// My listed products
const res = await axiosInstance.get("/product", {
  params: { user_id: currentUser.id, page: 1, size: 50 },
});

// Add new product (is_approved defaults to 0, user_id auto-set from JWT)
const product = await axiosInstance.post("/product", {
  title: "Physics NCERT",
  category_id: "cat_id_here",
  price: 200,
  sale_price: 150,
  auther: "NCERT",           // NOTE: spelling is "auther" not "author"
  transact_type: "sell",
  year_of_publication: "2024",
  short_description: "<p>Good condition</p>",
  description: "<p>Full description here</p>",
  images: "product/filename.jpg",  // from upload-image response
  state: "Maharashtra",
  city: "Mumbai",
});
```

---

### Cart (User)

| Action | Method | Endpoint | Body |
|--------|--------|----------|------|
| Get Cart | `GET` | `/cart` | — |
| Sync Cart | `POST` | `/cart` | `[{ product_id, quantity }, ...]` |

```js
// Get cart items (with populated product details)
const res = await axiosInstance.get("/cart");
// res.data = [{ id, product_id: { title, image, price, sale_price, auther, ... }, quantity }]

// Sync entire cart (replaces all items)
await axiosInstance.post("/cart", [
  { product_id: "prod_id_1", quantity: 1 },
  { product_id: "prod_id_2", quantity: 2 },
]);
// Send full cart array on EVERY change (add/remove/quantity change)
```

---

### Orders (User)

| Action | Method | Endpoint | Body / Query |
|--------|--------|----------|-------------|
| Place Order | `POST` | `/order` | `{ shipping_name, shipping_phone_no, shipping_email, shipping_address, shipping_state, shipping_city, shipping_pin_code, shipping_order_type, shipping_price, cart_ids }` |
| Order History (Buyer) | `GET` | `/order-history?user_id=X&page=1&size=15` | — |
| Sell History (Seller) | `GET` | `/sell-history?user_id=X&page=1&size=15` | — |

```js
// Place order from cart
const res = await axiosInstance.post("/order", {
  shipping_name: "John Doe",
  shipping_phone_no: "9876543210",
  shipping_email: "john@example.com",
  shipping_address: "123 Main St",
  shipping_state: "Maharashtra",
  shipping_city: "Mumbai",
  shipping_pin_code: "400001",
  shipping_order_type: "paid_delivery",  // or "self_pickup"
  shipping_price: 40,
  cart_ids: ["cart_item_id_1", "cart_item_id_2"],
});
// Cart items are auto-deleted after order creation

// My purchase history
const orders = await axiosInstance.get("/order-history", {
  params: { user_id: currentUser.id, page: 1, size: 15 },
});

// My sell history
const sells = await axiosInstance.get("/sell-history", {
  params: { user_id: currentUser.id, page: 1, size: 15 },
});
```

---

### Wishlist (User)

| Action | Method | Endpoint | Body |
|--------|--------|----------|------|
| My Wishlist | `GET` | `/wishlist?page=1&size=50` | — |
| Add Item | `POST` | `/wishlist` | `{ title, author, publication_year }` |
| Update Item | `PUT` | `/wishlist/:id` | `{ title, author, publication_year }` |
| Delete Item | `DELETE` | `/wishlist/:id` | — |

```js
const res = await axiosInstance.get("/wishlist", { params: { page: 1, size: 50 } });
// res.data.data = [...wishlist items]

await axiosInstance.post("/wishlist", {
  title: "Advanced Physics",
  author: "Resnick",          // NOTE: wishlist uses "author" (correct spelling)
  publication_year: "2023",
});

await axiosInstance.put(`/wishlist/${id}`, { title: "Updated Title", author: "New Author", publication_year: "2024" });

await axiosInstance.delete(`/wishlist/${id}`);
```

---

### Channels (User)

| Action | Method | Endpoint | Body / Query |
|--------|--------|----------|-------------|
| List Channels | `GET` | `/channel?page=1&size=20` | — |
| My Channels | `GET` | `/userChannel` | — |
| Join Channel | `PUT` | `/channel/:channelId/join` | — |
| View Messages | `GET` | `/channel/:channelId/messages?page=1&size=20` | — |
| Send Message | `POST` | `/channel/:channelId/messages` | `{ message, type, reply_to_message_id }` |
| Delete My Message | `DELETE` | `/channel/:channelId/message/:messageId/delete` | — |

```js
// List all channels
const channels = await axiosInstance.get("/channel", { params: { page: 1, size: 20 } });

// My joined/pending channels
const myChannels = await axiosInstance.get("/userChannel");
// myChannels.data = [{ channel_id, user_id, status: "pending"|"active"|"rejected" }]

// Join channel (PUT not POST)
await axiosInstance.put(`/channel/${channelId}/join`);

// Get messages (sorted newest first, frontend reverses)
const msgs = await axiosInstance.get(`/channel/${channelId}/messages`, {
  params: { page: 1, size: 20 },
});
// msgs.data.data = [{ id, message, type, user_id, created_at, user: { id, name }, reply_to }]
// msgs.data.last_page = N  (NOT total — uses last_page)

// Send message (URL is plural: /messages)
const sent = await axiosInstance.post(`/channel/${channelId}/messages`, {
  message: "Hello everyone!",
  type: "text",
  reply_to_message_id: "optional_msg_id",  // maps to reply_to in DB
});

// Delete own message (URL is singular: /message)
await axiosInstance.delete(`/channel/${channelId}/message/${messageId}/delete`);
```

---

### Contact Us (User — No Auth)

| Action | Method | Endpoint | Body |
|--------|--------|----------|------|
| Submit Form | `POST` | `/contact-us` | `{ first_name, last_name, email, phone_number, message }` |

```js
// No auth required
await axios.post("http://localhost:5000/api/contact-us", {
  first_name: "John",
  last_name: "Doe",
  email: "john@example.com",
  phone_number: "9876543210",
  message: "I need help with my order",
});
```

---

## Quick Reference — Gotchas & Field Mappings

| # | Gotcha | Detail |
|---|--------|--------|
| 1 | `auther` spelling | Product model uses `auther` (NOT `author`). Wishlist uses `author` (correct). |
| 2 | `images` → `image` | Frontend sends `images` (string), backend stores as `image` |
| 3 | Login `type` | Super Admin: `"SuperAdmin"`, User app: `"Buyer/Seller"` |
| 4 | Login response | `{ token, user: {...} }` — both are top-level keys |
| 5 | Pagination | `res.data.data` = items, `res.data.total` = count |
| 6 | Channel messages | Uses `last_page` instead of `total` |
| 7 | Cart sync | POST entire array every time (not individual add/remove) |
| 8 | Profile route | `GET/POST auth/profile` (NOT `me/profile`) |
| 9 | Password change | `POST auth/pass-change` with snake_case fields |
| 10 | Channel join | `PUT` (NOT POST) |
| 11 | Channel send msg | `POST channel/:id/messages` (plural) |
| 12 | Channel delete msg | `DELETE channel/:id/message/:id/delete` (singular) |
| 13 | Admin delete msg | `DELETE channel/admin/:id/message/:id/delete` (has `/admin/` prefix) |
| 14 | Upload image | Uses raw `axios` not `axiosInstance`, reads `res.data.image` |
| 15 | `id` not `_id` | All responses return `id` (not `_id`), use `item.id` everywhere |
| 16 | Order history | Buyer: `GET /order-history`, Seller: `GET /sell-history` |
| 17 | Product listing | `GET /product` (NOT `/products`) |
| 18 | Category filter | `category[0]=id&category[1]=id` (array format in query) |
| 19 | `reply_to_message_id` | Frontend sends this, maps to `reply_to` ObjectId in DB |

---

## API Services — Copy-Paste Ready

### Super Admin API Service (`adminApi.js`)

```js
import axiosInstance from "./axiosInstance";

export const adminApi = {
  // Dashboard
  getDashboardCount: () => axiosInstance.get("/dashboard/count"),

  // Products
  getProducts: (params) => axiosInstance.get("/sup-products", { params }),
  getProduct: (id) => axiosInstance.get(`/product/${id}`),
  createProduct: (data) => axiosInstance.post("/product", data),
  updateProduct: (id, data) => axiosInstance.put(`/product/${id}`, data),
  deleteProduct: (id) => axiosInstance.delete(`/product/${id}`),

  // Categories
  getCategories: (params) => axiosInstance.get("/category", { params }),
  createCategory: (data) => axiosInstance.post("/category", data),
  updateCategory: (id, data) => axiosInstance.put(`/category/${id}`, data),
  deleteCategory: (id) => axiosInstance.delete(`/category/${id}`),

  // Users
  getUsers: (params) => axiosInstance.get("/user", { params }),

  // Orders
  getOrders: (params) => axiosInstance.get("/order", { params }),
  updateOrderStatus: (id, data) => axiosInstance.patch(`/order/${id}/status-update`, data),

  // Wishlist
  getWishlists: (params) => axiosInstance.get("/admin-wishlist", { params }),

  // Contact Messages
  getContactMessages: (params) => axiosInstance.get("/contact-us", { params }),

  // Channels
  getChannels: (params) => axiosInstance.get("/channel", { params }),
  createChannel: (data) => axiosInstance.post("/channel", data),
  updateChannel: (id, data) => axiosInstance.put(`/channel/${id}`, data),
  getChannelRequests: (channelId, params) => axiosInstance.get(`/channel/${channelId}/requestsList`, { params }),
  acceptRequest: (channelId, data) => axiosInstance.put(`/channel/${channelId}/requestAccept`, data),
  rejectRequest: (channelId, data) => axiosInstance.put(`/channel/${channelId}/requestReject`, data),
  getChannelMessages: (channelId, params) => axiosInstance.get(`/channel/${channelId}/messages`, { params }),
  deleteMessage: (channelId, messageId) => axiosInstance.delete(`/channel/admin/${channelId}/message/${messageId}/delete`),
  deleteAllMessages: (channelId) => axiosInstance.delete(`/channel/admin/${channelId}/messages/delete`),
};
```

### User App API Service (`userApi.js`)

```js
import axiosInstance from "./axiosInstance";

export const userApi = {
  // Auth
  signUp: (data) => axiosInstance.post("/auth/sign-up", data),
  signIn: (data) => axiosInstance.post("/auth/sign-in", { ...data, type: "Buyer/Seller" }),
  signOut: () => axiosInstance.get("/auth/sign-out"),
  getProfile: () => axiosInstance.get("/auth/profile"),
  updateProfile: (data) => axiosInstance.post("/auth/profile", data),
  changePassword: (data) => axiosInstance.post("/auth/pass-change", data),
  resetPassword: (data) => axiosInstance.post("/auth/pass-reset", data),

  // Products
  getProducts: (params) => axiosInstance.get("/product", { params }),
  getProduct: (id) => axiosInstance.get(`/product/${id}`),
  createProduct: (data) => axiosInstance.post("/product", data),
  updateProduct: (id, data) => axiosInstance.put(`/product/${id}`, data),

  // Cart
  getCart: () => axiosInstance.get("/cart"),
  syncCart: (items) => axiosInstance.post("/cart", items),

  // Orders
  placeOrder: (data) => axiosInstance.post("/order", data),
  getOrderHistory: (params) => axiosInstance.get("/order-history", { params }),
  getSellHistory: (params) => axiosInstance.get("/sell-history", { params }),

  // Wishlist
  getWishlist: (params) => axiosInstance.get("/wishlist", { params }),
  addToWishlist: (data) => axiosInstance.post("/wishlist", data),
  updateWishlist: (id, data) => axiosInstance.put(`/wishlist/${id}`, data),
  deleteWishlist: (id) => axiosInstance.delete(`/wishlist/${id}`),

  // Channels
  getChannels: (params) => axiosInstance.get("/channel", { params }),
  getMyChannels: () => axiosInstance.get("/userChannel"),
  joinChannel: (channelId) => axiosInstance.put(`/channel/${channelId}/join`),
  getMessages: (channelId, params) => axiosInstance.get(`/channel/${channelId}/messages`, { params }),
  sendMessage: (channelId, data) => axiosInstance.post(`/channel/${channelId}/messages`, data),
  deleteMessage: (channelId, messageId) => axiosInstance.delete(`/channel/${channelId}/message/${messageId}/delete`),

  // Contact
  submitContactForm: (data) => axiosInstance.post("/contact-us", data),
};
```

---

## Environment Setup

### Development
```
API: http://localhost:5000
Admin Panel: http://localhost:3000
User App: http://localhost:3001
```

### Production
Update `.env` in both frontend apps:
```env
REACT_APP_API_URL=https://api.kitaabjunction.com/api
REACT_APP_STORAGE_URL=https://api.kitaabjunction.com/public/storage
```

Update backend `.env`:
```env
CORS_ORIGINS=https://admin.kitaabjunction.com,https://kitaabjunction.com
```
