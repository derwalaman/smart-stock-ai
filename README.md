````md
# 🚀 SmartStock AI

A modern, full-stack **Inventory & Order Management System** built with:

- ⚡ FastAPI
- ⚛️ React + Vite
- 🐘 PostgreSQL
- 🐳 Docker
- 🎨 Tailwind CSS
- 📊 Recharts
- 🌙 Dark/Light Theme
- ☁️ Render + Vercel Deployment

SmartStock AI helps businesses manage:

✅ Products  
✅ Customers  
✅ Orders  
✅ Inventory  
✅ Revenue Analytics  
✅ Stock Validation  
✅ Performance Metrics  

with a beautiful enterprise-grade dashboard UI.

---

# 🌐 Live Demo

## Frontend

```bash
https://smart-stock-ai-iota.vercel.app
```

## Backend API

```bash
https://smartstock-api-ckdo.onrender.com
```

## Swagger API Docs

```bash
https://smartstock-api-ckdo.onrender.com/docs![alt text](image.png)
```

---

# 📸 Screenshots

## Dashboard

<img width="100%" src="./screenshots/dashboard.png" />

## Products

<img width="100%" src="./screenshots/products.png" />

## Orders

<img width="100%" src="./screenshots/orders.png" />

## Customers

<img width="100%" src="./screenshots/customers.png" />

## Settings

<img width="100%" src="./screenshots/settings.png" />

---

# ✨ Features

# 📦 Product Management

- Create products
- Edit products
- Delete products
- SKU uniqueness validation
- Category filtering
- Product search
- Inventory tracking
- Low stock alerts

---

# 🛒 Order Management

- Create orders
- Multi-product order system
- Dynamic stock deduction
- Order status updates
- Pending / Completed / Cancelled
- Revenue calculations
- Pagination
- Order analytics

---

# 👥 Customer Management

- Customer CRUD
- Email uniqueness validation
- Search customers
- Pagination
- Dynamic analytics

---

# 📊 Dashboard Analytics

- Revenue overview
- Monthly analytics
- Inventory charts
- Revenue charts
- Low stock metrics
- Recent activity
- Performance indicators
- Order success rate
- Inventory accuracy

---

# 🌙 Theme System

- Dark mode
- Light mode
- Animated theme switch
- Local storage persistence
- System theme support

---

# ⚙️ Settings System

- Company settings
- Tax percentage
- Shipping charges
- Currency settings
- Inventory thresholds
- Real-time updates

---

# 🎨 UI/UX Features

- Fully responsive design
- Mobile sidebar
- Tablet optimization
- Framer Motion animations
- Loading skeletons
- Toast notifications
- Glassmorphism UI
- Modern SaaS design

---

# 🐳 Docker Support

- Dockerized frontend
- Dockerized backend
- PostgreSQL container
- Docker Compose setup

---

# 🧠 Tech Stack

## Frontend

- React
- Vite
- Tailwind CSS
- Framer Motion
- Recharts
- Axios
- Lucide React
- shadcn/ui
- Sonner

---

## Backend

- FastAPI
- SQLAlchemy
- PostgreSQL
- Pydantic
- Uvicorn
- Psycopg

---

## Deployment

- Vercel
- Render
- Neon PostgreSQL
- Docker

---

# 📁 Project Structure

```bash
smart-stock-ai/
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── main.py
│   │
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── context/
│   │   └── utils/
│   │
│   ├── package.json
│   ├── Dockerfile
│   └── vite.config.js
│
├── docker-compose.yml
├── README.md
└── .gitignore
```

---

# ⚡ Local Development Setup

# 1️⃣ Clone Repository

```bash
git clone https://github.com/AnkitDabad/smart-stock-ai.git
```

---

# 2️⃣ Navigate Into Project

```bash
cd smartstock-ai
```

---

# 3️⃣ Setup Backend

```bash
cd backend
```

Create virtual environment:

```bash
python -m venv venv
```

Activate:

## Mac/Linux

```bash
source venv/bin/activate
```

## Windows

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

# 4️⃣ Setup Environment Variables

Create:

```bash
.env
```

Add:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/smartstock
```

---

# 5️⃣ Run Backend

```bash
uvicorn app.main:app --reload
```

Backend runs at:

```bash
http://localhost:8000
```

---

# 6️⃣ Setup Frontend

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

---

# 7️⃣ Run Frontend

```bash
npm run dev
```

Frontend runs at:

```bash
http://localhost:5173
```

---

# 🐳 Docker Setup

# Run Entire App

```bash
docker compose up --build
```

---

# Frontend

```bash
http://localhost:5173
```

# Backend

```bash
http://localhost:8000/docs
```

---

# ☁️ Deployment

# Backend → Render

- Connect GitHub repo
- Root directory → `backend`
- Environment variable:

```env
DATABASE_URL=YOUR_NEON_DATABASE_URL
```

---

# Frontend → Vercel

- Import GitHub repo
- Root directory → `frontend`

Update:

```js
baseURL:
"https://your-render-url.onrender.com"
```

---

# Database → Neon

Use free Neon PostgreSQL cloud database.

---

# 📊 API Endpoints

# Products

```http
GET     /products
POST    /products
PUT     /products/{id}
DELETE  /products/{id}
```

---

# Orders

```http
GET     /orders
POST    /orders
PUT     /orders/{id}/status
```

---

# Customers

```http
GET     /customers
POST    /customers
PUT     /customers/{id}
DELETE  /customers/{id}
```

---

# Dashboard

```http
GET /dashboard/stats
GET /dashboard/recent-activity
```

---

# 📈 Future Improvements

- AI inventory forecasting
- Role-based authentication
- JWT authentication
- Email notifications
- CSV/PDF export
- Multi-warehouse support
- Stripe billing
- AI analytics assistant

---

# 👨‍💻 Author

## Ankit Dabad

- GitHub:
  
```bash
https://github.com/AnkitDabad
```

---

# ⭐ If You Like This Project

Give this repository a ⭐ on GitHub!

---

# 📜 License

This project is licensed under the MIT License.
````
