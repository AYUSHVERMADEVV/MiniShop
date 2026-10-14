# 🛍️ MiniShop - MERN Stack Inventory Management Dashboard

MiniShop ek complete, modern aur responsive **MERN Stack** (MongoDB Atlas + Express.js + React.js Vite + Node.js) application hai jisse aap apne shop ya store ki inventory aur stock ko asaani se manage kar sakte hain.

Isme **Purple & White** premium dashboard theme, sidebar navigation, real-time calculations, low-stock alerts, aur full CRUD (Create, Read, Update, Delete) functionality di gayi hai.

---

## 🌟 Key Features

1. **Add Products**: Product Name, Category, Purchase Price, Selling Price, aur Stock Quantity ke saath naya item add karein.
2. **Clean & Responsive Table**: Sabhi products ek well-formatted table me show hote hain with currency formatting (₹ INR).
3. **Edit Existing Products**: Kisi bhi product ka data (naam, category, price, quantity) modal ke through update karein.
4. **Delete with Confirmation Dialog**: Product delete karne se pehle safety confirmation popup aata hai taaki accidentally data delete na ho.
5. **Real-time Profit Calculation**:
   - $\text{Profit per Unit} = \text{Selling Price} - \text{Purchase Price}$
   - Dynamic profit margin percentage calculator modal me live dikhta hai.
6. **Search & Category Filters**: Product name se instant live search aur category filter (Electronics, Groceries, Clothing, etc.).
7. **5 Dashboard Summary Cards**:
   - Total Products (Total unique SKUs)
   - Total Stock Units (Total warehouse quantity)
   - Low-Stock Products (Items with stock $\le 5$)
   - Total Stock Purchase Value (Total invested capital)
   - Expected Stock Profit (Projected earnings)
8. **Low-Stock Alert Badge**: Jab kisi product ki quantity **5 ya usse kam** hoti hai, tab automatic red warning badge highlight hota hai.
9. **MongoDB Atlas Status Indicator**: Real-time indicator jo batata hai ki database connected hai ya nahi.

---

## 🛠️ Tech Stack

- **Frontend**: React.js 18 + Vite, Lucide Icons, Modern CSS3 (CSS Variables, Flexbox, CSS Grid)
- **Backend**: Node.js + Express.js (ES Modules)
- **Database**: MongoDB Atlas via Mongoose ODM
- **Environment**: Dotenv for secure credentials handling
- **Dev Tools**: Concurrently, Nodemon

---

## 📁 Project Structure

```text
MINISHOP/
├── package.json              # Root scripts (run client & server together)
├── README.md                 # Project documentation & setup guide
├── .gitignore                # Git ignore for node_modules and .env
├── server/
│   ├── .env                  # Database URI & Port (Excluded from git)
│   ├── .env.example          # Template for environment variables
│   ├── package.json          # Backend dependencies (Express, Mongoose, etc.)
│   ├── test-schema.js        # Mongoose schema & calculation test suite
│   ├── test-api.js           # Express controller validation tests
│   └── src/
│       ├── config/
│       │   └── db.js         # Mongoose connection & status helpers
│       ├── models/
│       │   └── Product.js    # Mongoose schema, validations & virtuals
│       ├── controllers/
│       │   └── productController.js # REST API handlers
│       ├── routes/
│       │   └── productRoutes.js     # Express routes
│       └── index.js          # Express server entry point
└── client/
    ├── package.json          # Frontend dependencies (React, Vite, Lucide)
    ├── vite.config.js        # Vite config with backend API proxy
    ├── index.html            # Main HTML with Plus Jakarta Sans font
    └── src/
        ├── api/
        │   └── productApi.js # Fetch API calls for all endpoints
        ├── components/
        │   ├── Sidebar.jsx   # Purple sidebar with DB status & nav
        │   ├── Header.jsx    # Top header with date & quick actions
        │   ├── StatCard.jsx  # Summary metrics cards
        │   ├── FilterBar.jsx # Search, category, sort & low-stock filter
        │   ├── ProductTable.jsx # Responsive table with profit & badges
        │   ├── ProductModal.jsx # Add & Edit modal with live profit calculator
        │   ├── DeleteConfirmModal.jsx # Delete confirmation popup
        │   ├── DbAlertBanner.jsx # Helpful Atlas setup helper banner
        │   └── Toast.jsx     # Success / error notification toasts
        ├── App.jsx           # Main state management
        ├── App.css           # Premium purple/white dashboard CSS
        ├── index.css         # Reset & global design variables
        └── main.jsx          # React DOM entry point
```

---

## ⚡ Quick Start for Windows (Hinglish Guide)

### 1. Prerequisites Check
Apne Windows PowerShell ya Command Prompt me check karein ki **Node.js** installed hai:
```powershell
node -v
npm -v
```
*(Node.js v18+ recommended hai).*

---

### 2. Dependencies Install Karein
Aap root folder se ek single command se sabhi dependencies install kar sakte hain:
```powershell
npm run install:all
```
*Ya phir alag-alag install karein:*
```powershell
# Root dependencies
npm install

# Backend dependencies
cd server
npm install
cd ..

# Frontend dependencies
cd client
npm install
cd ..
```

---

### 3. MongoDB Atlas Setup (Free Cluster)

1. **MongoDB Atlas Account**: [cloud.mongodb.com](https://cloud.mongodb.com) par free account banayein aur free **M0 Cluster** create karein.
2. **Database User Create Karein**:
   - Atlas dashboard me **Security** > **Database Access** par jayein.
   - **Add New Database User** par click karein.
   - Username (e.g. `admin`) aur strong Password (e.g. `MyShopPass123`) set karein.
   - Built-in Role me **Read and write to any database** select karein.
3. **Network Access (IP Whitelist)**:
   - **Security** > **Network Access** par jayein.
   - **Add IP Address** click karein aur **Allow Access from Anywhere** (`0.0.0.0/0`) select karein.
4. **Connection String Copy Karein**:
   - **Clusters** tab me **Connect** button click karein.
   - **Drivers** (Node.js) choose karein.
   - Connection string copy karein:
     ```text
     mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
     ```
5. **`server/.env` File Update Karein**:
   - `server/.env` file open karein.
   - `<username>` aur `<password>` ko apne actual credentials se replace karein aur database ka naam `minishop` daalein:
     ```env
     PORT=5000
     MONGODB_URI=mongodb+srv://admin:MyShopPass123@cluster0.abcde.mongodb.net/minishop?retryWrites=true&w=majority
     ```

> 🔒 **Security Note**: `server/.env` file `.gitignore` me added hai, isliye aapke database credentials kabhi bhi Git me leak nahi honge.

---

### 4. Application Run Karein

Aap frontend aur backend dono ko ek saath root folder se start kar sakte hain:

```powershell
npm run dev
```

Ya phir 2 alag terminal windows me run karein:

**Terminal 1 (Backend Server):**
```powershell
cd server
npm run dev
```
Backend chalega: `http://localhost:5000`

**Terminal 2 (Frontend Client):**
```powershell
cd client
npm run dev
```
Frontend chalega: `http://localhost:5173`

Browser me open karein: **[http://localhost:5173](http://localhost:5173)** 🚀

---

## 📡 REST API Documentation

Base URL: `http://localhost:5000`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Server uptime aur MongoDB connection status check karta hai |
| `GET` | `/api/products` | Sabhi products fetch karta hai (search, category filter, sort, low-stock filter ke saath) aur overall summary statistics deta hai |
| `GET` | `/api/products/:id` | Single product ki details fetch karta hai |
| `POST` | `/api/products` | Naya product inventory me add karta hai |
| `PUT` | `/api/products/:id` | Existing product ki details update karta hai |
| `DELETE`| `/api/products/:id` | Product ko permanently remove karta hai |

### Query Parameters for `GET /api/products`:
- `search`: Case-insensitive product name search (`?search=wireless`)
- `category`: Category filter (`?category=Electronics`)
- `lowStock`: Low stock items filter (`?lowStock=true`)
- `sortBy`: Field sort (`name`, `quantity`, `purchasePrice`, `sellingPrice`, `createdAt`)
- `order`: `asc` ya `desc`

### Example `POST /api/products` Request Body:
```json
{
  "name": "Wireless Mechanical Keyboard",
  "category": "Electronics",
  "purchasePrice": 2200,
  "sellingPrice": 3499,
  "quantity": 15
}
```

### Example `POST /api/products` Success Response (201 Created):
```json
{
  "success": true,
  "message": "Product added successfully",
  "data": {
    "_id": "670c5e93f...",
    "name": "Wireless Mechanical Keyboard",
    "category": "Electronics",
    "purchasePrice": 2200,
    "sellingPrice": 3499,
    "quantity": 15,
    "profitPerUnit": 1299,
    "isLowStock": false,
    "totalPurchaseValue": 33000,
    "totalSellingValue": 52485,
    "createdAt": "2026-10-14T00:15:00.000Z",
    "updatedAt": "2026-10-14T00:15:00.000Z"
  }
}
```

---

## 🧪 Testing Steps

Hamne project ke liye automated test suite create kiya hai jo schema validation, profit calculations, low-stock threshold logic, aur error handling ko verify karta hai.

Root directory se test run karne ke liye:
```powershell
npm run test:server
```

Ya `server/` directory ke andar:
```powershell
cd server
npm test
```

### Test Coverage:
- ✅ Schema validation for required fields (`name`, `category`, `purchasePrice`, `sellingPrice`, `quantity`)
- ✅ Rejection of negative numbers and non-integer quantities
- ✅ Correct formula calculation: $\text{profitPerUnit} = \text{sellingPrice} - \text{purchasePrice}$
- ✅ Correct threshold test: $\text{isLowStock} = \text{true}$ for quantity $\le 5$
- ✅ Correct calculation for $\text{totalPurchaseValue} = \text{purchasePrice} \times \text{quantity}$
- ✅ Serialization test: Virtual fields auto-present in JSON responses
- ✅ Controller error responses (503 on database disconnect, 400 on malformed ObjectIds)

---

## 💡 Troubleshooting (Aam Samasyaein)

1. **Port 5000 Already in Use (`EADDRINUSE`)**:
   Agar port 5000 par koi aur process chal raha hai, toh PowerShell me use check aur stop karein:
   ```powershell
   Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
   ```
   Ya phir `server/.env` me `PORT=5001` set kar lein.

2. **MongoDB Atlas Disconnected Error (Status 503)**:
   - Check karein ki `server/.env` me valid URI dali hai ya nahi.
   - Check karein ki password me `<` ya `>` brackets remove kar diye hain.
   - Atlas **Network Access** me `0.0.0.0/0` allowed hai ya nahi.

---

## 📄 License
ISC / MIT - MiniShop Inventory System
#   M i n i S h o p  
 