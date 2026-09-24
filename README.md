# Product Admin Dashboard

A responsive Product Admin Dashboard built with **Next.js, React, Tailwind CSS, Axios, and DummyJSON API**.

## Features

* Admin login using DummyJSON authentication API
* Bearer token authentication using Axios interceptor
* Product listing with:

  * Product image
  * Title
  * Category
  * Price
  * Rating
* Responsive product table for desktop
* Responsive product cards for mobile
* Pagination with 10, 20, and 50 products per page
* Search products
* Category filtering
* Sorting by:

  * Price
  * Rating
  * Title
* Product details page
* Product reviews and images
* Add new product
* Edit product
* Delete product with confirmation
* Form validation
* Loading states
* Empty states
* Error handling with retry option
* URL-based pagination, search, category, and sorting state
* Shared Axios API instance
* API calls separated into service files

## Tech Stack

* Next.js
* React
* Tailwind CSS
* Axios
* JavaScript
* DummyJSON API
* Sonner

## API

This project uses the DummyJSON API:

https://dummyjson.com

Main API operations:

* `POST /auth/login`
* `GET /products`
* `GET /products/search`
* `GET /products/categories`
* `GET /products/category/{category}`
* `GET /products/{id}`
* `POST /products/add`
* `PUT /products/{id}`
* `DELETE /products/{id}`

## Authentication

The login token is stored in `localStorage`.

A shared Axios instance automatically adds the token to API requests using:

`Authorization: Bearer <token>`

## Demo Login

Use the demo credentials provided by DummyJSON for authentication.

Username: `emilys`

Password: `emilyspass`

## Getting Started

Clone the repository:

```bash
git clone https://github.com/payalmangarule/product-admin-dashboard.git
```

Go to the project folder:

```bash
cd product-admin-dashboard
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Project Structure

```text
src/
├── app/
│   ├── products/
│   │   ├── [id]/
│   │   ├── add/
│   │   ├── edit/
│   │   └── page.js
│   ├── globals.css
│   ├── layout.js
│   └── page.js
│
├── components/
│   ├── header.js
│   ├── footer.js
│   └── LayoutContent.js
│
├── lib/
│   └── axios.js
│
└── services/
    ├── authService.js
    └── productService.js
```

## Important Note About DummyJSON

DummyJSON product mutation endpoints are simulated and do not permanently persist newly added, edited, or deleted products on the server.

The dashboard therefore updates the UI locally after successful mutation responses.

## GitHub Repository

https://github.com/payalmangarule/product-admin-dashboard
