
# 🛍️ MiniShop — MERN Stack Inventory Management System

MiniShop is a modern, responsive inventory management dashboard built with the MERN stack. It helps shop owners manage products, track stock, maintain purchase and selling prices, and calculate potential profit.

The project uses MongoDB Atlas for cloud database storage, Express.js and Node.js for the backend API, and React with Vite for the frontend.

## ✨ Features

- **Product Management (CRUD):** Add, view, edit, and delete products.
- **Product Details:** Store product name, category, purchase price, selling price, and stock quantity.
- **Profit Calculation:** Calculate profit per unit using selling price minus purchase price.
- **Dashboard Statistics:** Display product count, total stock units, stock purchase value, and projected stock profit.
- **Low-Stock Alerts:** Highlight products with a quantity of 5 or fewer.
- **Search and Filtering:** Find products by name or filter them by category.
- **Responsive Interface:** Purple-and-white dashboard designed for desktop and smaller screens.
- **Cloud Database:** Store inventory records in MongoDB Atlas.
- **Environment Variables:** Keep database credentials outside the application source code.

> Note: Dashboard statistics, filters, database status indicators, and automated tests should be described as implemented only after verifying them in the project.

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Vite, CSS3 |
| Icons | Lucide React |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Configuration | dotenv |
| Development | Nodemon |

## 📁 Project Structure

```text
MiniShop/
├── package.json
├── README.md
├── .gitignore
├── server/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── config/
│       │   └── db.js
│       ├── models/
│       │   └── Product.js
│       ├── controllers/
│       │   └── productController.js
│       ├── routes/
│       │   └── productRoutes.js
│       └── index.js
└── client/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── api/
        │   └── productApi.js
        ├── components/
        ├── App.jsx
        ├── App.css
        ├── index.css
        └── main.jsx
```

The structure above is a reference. Keep only files and folders that actually exist in your project.

## ⚙️ Prerequisites

Install the following before running MiniShop:

- [Node.js](https://nodejs.org/) — preferably an active LTS version.
- npm — included with Node.js.
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account or another accessible MongoDB database.
- A code editor such as Visual Studio Code or Antigravity.

Check your Node.js and npm installations:

```powershell
node -v
npm -v
```

## 🚀 Installation and Setup

### 1. Clone or open the project

If the project is already on your computer, open its root directory in your terminal.

Otherwise, clone your repository:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd MiniShop
```

Replace the repository URL with your actual GitHub repository URL.

### 2. Install dependencies

If the root `package.json` defines an `install:all` script:

```bash
npm run install:all
```

Otherwise, install dependencies separately:

```bash
npm install
```

Then install the backend and frontend dependencies:

```bash
cd server
npm install
cd ../client
npm install
cd ..
```

### 3. Configure MongoDB Atlas

1. Sign in to [MongoDB Atlas](https://cloud.mongodb.com/).
2. Open your project and select your cluster.
3. Under **Database Access**, create a database user with an appropriate password and permissions.
4. Under **Network Access**, allow your current IP address.
5. Select **Connect → Drivers → Node.js**.
6. Copy the connection string and replace its credential placeholders locally.

Avoid allowing access from every IP address unless you specifically need it for temporary testing. Never commit database credentials to GitHub.

### 4. Configure environment variables

Create a file named `.env` inside the `server` directory.

Add the following configuration:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER_HOST>/minishop?retryWrites=true&w=majority
```

Replace the placeholders with your actual database username, password, and cluster hostname. URL-encode special characters in the password when necessary.

Create a `server/.env.example` file containing placeholders only:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER_HOST>/minishop?retryWrites=true&w=majority
```

Make sure `.env` is included in `.gitignore`. Never put real credentials in `.env.example`, screenshots, README files, or public repositories.

### 5. Start the application

If your root `package.json` has a configured `dev` script that starts both applications:

```bash
npm run dev
```

Otherwise, open two terminal windows.

**Terminal 1 — Backend**

```bash
cd server
npm run dev
```

**Terminal 2 — Frontend**

```bash
cd client
npm run dev
```

Open the local frontend URL printed by Vite in your terminal. It is commonly:

http://localhost:5173

The backend is configured to use port `5000` unless changed in the environment variables.

## 📡 REST API Documentation

Base URL:

```text
http://localhost:5000
```

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check server and database status |
| GET | `/api/products` | Retrieve products |
| GET | `/api/products/:id` | Retrieve a single product |
| POST | `/api/products` | Add a product |
| PUT | `/api/products/:id` | Update an existing product |
| DELETE | `/api/products/:id` | Delete a product |

These endpoints assume the backend implements the routes shown. Confirm them against the actual Express router before submitting.

### Supported query parameters

If implemented, the product-list endpoint can support:

- `search` — search by product name.
- `category` — filter by category.
- `lowStock=true` — show low-stock products.
- `sortBy` — select a supported sorting field.
- `order=asc` or `order=desc` — choose sorting order.

Example:

```text
GET /api/products?search=keyboard
GET /api/products?category=Electronics
GET /api/products?lowStock=true
```

### Example product request

**POST** `/api/products`

```json
{
  "name": "Wireless Keyboard",
  "category": "Electronics",
  "purchasePrice": 2200,
  "sellingPrice": 3499,
  "quantity": 15
}
```

The backend should validate the input and return the created product when the request succeeds.

### Business calculations

```text
Profit per Unit = Selling Price - Purchase Price

Total Purchase Value = Purchase Price × Quantity

Total Selling Value = Selling Price × Quantity

Low Stock = Quantity ≤ 5
```

These calculations represent potential stock value and profit, not guaranteed realized earnings.

## 🧪 Testing

Test the API using Thunder Client, Postman, or another HTTP client.

1. Check the health endpoint.
2. Add a product using a POST request.
3. Retrieve all products using GET.
4. Update its price or quantity using PUT.
5. Delete the product using DELETE.
6. Confirm that the changes persist in MongoDB Atlas.

If automated test scripts are present, run the commands defined in the project's `package.json`. Do not assume a test command exists until you verify it.

## 🛠️ Troubleshooting

**MongoDB connection fails**
- Verify the connection string in `server/.env`.
- Check the database username and password.
- Confirm that your current IP address is permitted in Atlas Network Access.
- Check that the cluster is available and the server loads environment variables.

**Port already in use**

Change the `PORT` value in `server/.env` to another available port, then restart the backend.

**Frontend cannot load products**
- Confirm that the backend is running.
- Check the browser console and terminal for errors.
- Verify the API base URL and Vite proxy configuration.
- Check that the frontend and backend use matching endpoint paths.

**Dependencies fail to install**

Verify your Node.js version, internet connection, and the relevant `package.json` files.

## 🔐 Security

- Keep `.env` out of version control.
- Use a dedicated MongoDB database user with appropriate permissions.
- Restrict Atlas network access to trusted IP addresses where practical.
- Validate and sanitize incoming API data.
- Never publish database passwords or other secrets in source code.

## 🎯 Project Objective

MiniShop demonstrates how to build a full-stack CRUD application using MongoDB, Express.js, React.js, and Node.js. It provides practical experience with REST APIs, database integration, product management, frontend-backend communication, and environment configuration.


