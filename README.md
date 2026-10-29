
# 🛍️ MiniShop — MERN Stack Inventory Management System

MiniShop is a modern, responsive inventory management dashboard built with the MERN stack. It helps shop owners manage products, track stock, maintain purchase and selling prices, and calculate potential profit.

The project uses MongoDB Atlas for cloud database storage, Express.js and Node.js for the backend API, and React with Vite for the frontend.

## ✨ Features

- **Product Management (CRUD):** Add, view, edit, and delete products with real MongoDB persistence.
- **Product Details:** Store product name, category, purchase price, selling price, and stock quantity.
- **Profit Calculation:** Calculate profit per unit (`sellingPrice - purchasePrice`), total purchase value, and expected profit.
- **Dashboard Statistics:** Display 5 live summary cards: Total Products, Total Stock Units, Low Stock Products, Purchase Inventory Value, and Expected Stock Profit.
- **Low-Stock Alerts:** Highlight and filter products with a quantity of 5 or fewer.
- **Search and Filtering:** Case-insensitive search by product name, category filter, low-stock toggle, and multi-column sorting.
- **CSV Export:** Download full or filtered inventory as a CSV file.
- **Responsive Interface:** Modern purple-and-white dashboard designed for desktop and mobile viewports.
- **Cloud Database:** Real-time data persistence with MongoDB Atlas and Mongoose.
- **Environment Security:** Local `.env` files kept strictly out of Git version control.

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

Expected Stock Profit = (Selling Price - Purchase Price) × Quantity

Low Stock = Quantity ≤ 5
```

These calculations represent potential stock value and expected profit, not guaranteed realized earnings.

## 🧪 Automated and Manual Testing

### 1. Automated Test Suites

The project includes two verified automated test suites that run with:

```bash
npm test
```

This executes both test suites:
1. **Model & Schema Validation Tests (`server/test-schema.js`)**:
   - Tests required fields (`name`, `category`, `purchasePrice`, `sellingPrice`, `quantity`).
   - Validates negative value rejections for prices and stock quantity.
   - Validates integer constraints on quantity (rejects decimals).
   - Validates calculation of virtual fields: `profitPerUnit`, `isLowStock` (threshold ≤ 5), `totalPurchaseValue`, and `totalSellingValue`.
   - Validates JSON serialization of virtual fields.
   - Result: 19/19 tests passing (100%).

2. **Controller & API Endpoint Validation Tests (`server/test-api.js`)**:
   - Tests `createProduct` input validation with missing fields (returns HTTP 400).
   - Tests `getProductById` with invalid ObjectId format (returns HTTP 400).
   - Tests `updateProduct` with invalid ObjectId format (returns HTTP 400).
   - Tests `deleteProduct` with invalid ObjectId format (returns HTTP 400).
   - Tests graceful database disconnection handling (returns HTTP 503 without server crash).
   - Result: 4/4 tests passing (100%).

### 2. Manual Testing Workflow (CRUD Verification)

To test the full user flow manually:
1. **Health Check**: Open `http://localhost:3000/api/health` or `http://localhost:5000/api/health` in your browser or Postman.
2. **Add Product**:
   - Click **"Add Product"** in the top navigation or sidebar.
   - Enter name, category, purchase price, selling price, and quantity.
   - Observe the live profit preview box dynamically calculating Unit Profit, Margin %, and Total Investment.
   - Submit and verify the product appears in the table and the 5 dashboard summary cards update.
3. **Edit Product**:
   - Click the clearly labeled purple **"Edit"** button on any table row.
   - Verify the modal pre-fills with current product details.
   - Change a field (e.g. adjust selling price or stock) and save.
   - Verify the table row and dashboard summary update with the response from the database.
4. **Delete Product**:
   - Click the clearly labeled red **"Delete"** button on any row.
   - Verify the confirmation modal opens, clearly displaying the product name, category, and quantity.
   - Click "Cancel" to verify the product is not deleted.
   - Reopen and click "Yes, Delete Product" to confirm permanent deletion.
5. **Search & Filters**:
   - Type in the search box to filter products case-insensitively.
   - Filter by category using the dropdown.
   - Toggle **"Low Stock (≤ 5)"** to isolate products needing reordering.
   - Click **"Reset"** to clear all active filters.
6. **Export CSV**:
   - Click **"Export CSV"** in the table controls.
   - Verify the downloaded `.csv` file contains Product Name, Category, Purchase Price, Selling Price, Profit Per Unit, Stock Quantity, and Low Stock Status.

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

## 📄 License

This repository does not currently include a LICENSE file. Before publishing or submitting publicly, choose an open-source license (such as MIT or ISC) according to your project requirements.


