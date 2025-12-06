<h1 align="center">🏡 Smart Society Management System</h1>

<p align="center">
A full-stack web application designed to manage housing society operations such as Residents, Notices, Complaints, Visitors, Parking, Payments, Events, and more — with authentication, role-based access, and a modern dashboard UI.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React.js-blue?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Database-MongoDB-brightgreen?style=for-the-badge"/>
</p>


## ⚡ Features

- 🔐 **Authentication & Authorization**
  - Register, Login, Logout
  - JWT-based authenticated routes
  - Role-based access (Admin & Residents)

- 👨‍👩‍👧 **Residents Management**
  - Add, edit, delete, search residents
  - Backend-level protection so residents can't edit others' data

- 📢 **Notices**
  - Admin can create/edit/delete 
  - Residents can view only
  - Important notices highlighted!

- 📝 **Complaints**
  - Residents: add, edit, delete their own
  - Admin: view all & delete resolved

- 🚗 **Parking**
  - Track allocated & available slots

- 👥 **Visitors**
  - Log visitor entries/exits

- 💸 **Payments**
  - Residents can add payment for events/maintenance
  - Purpose field included
  - Full backend + frontend validation

- 🎉 **Events**
  - Search, filter, sort by date
  - Today’s highlight
  - Count badges

- ⚙️ **Profile Settings**
  - Upload profile image
  - Dark/Light mode toggle
  - Store user preferences

## 📷 Dashboard Preview

![Login Screenshot](docs/Proj%20Screenshots/Login.png)
![Dashboard Screenshot](docs/Proj%20Screenshots/Dashboard.png)

## 🧱 Project Structure

society-management-system/
- ├── society-frontend/ # React + Tailwind CSS
- ├── society-backend/ # Node.js + Express + MongoDB
- ├── docs/Proj Screenshots
- ├── package.json
- ├── package-lock.json 
- ├── .gitignore
- ├── .env.example
- └── README.md

## 🛠 Tech Stack

### 🌐 Frontend
- React.js
- React Router
- Tailwind CSS
- Axios
- React Hot Toast
- Context API / Reducers
- LocalStorage for auth

### ⚙️ Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT Authentication
- Multer (for profile image upload)
- Bcrypt (password hashing)
- CORS, Dotenv

## 🚀 Getting Started (Run Locally)

### 1️⃣ Clone repository
```bash
git clone https://github.com/EmanKhalid01/Smart-Society-Management-System.git
cd society-management-system

### 🖥 Backend Setup
cd society-backend
npm install
cp .env.example .env    # create environment file
node server.js

### 💻 Frontend Setup
cd society-frontend
npm install
npm start

## 📡 API Endpoints (Important Ones)
<details> <summary>🔐 Auth Routes</summary>

POST /api/auth/register

POST /api/auth/login

POST /api/auth/logout

</details> <details> <summary>👨‍👩‍👧 Residents</summary>

GET /api/residents

POST /api/residents

PUT /api/residents/:id

DELETE /api/residents/:id

</details> <details> <summary>📢 Notices</summary>

GET /api/notices

POST /api/notices (Admin)

PUT /api/notices/:id (Admin)

DELETE /api/notices/:id (Admin)

</details> <details> <summary>📝 Complaints</summary>

GET /api/complaints

POST /api/complaints

PUT /api/complaints/:id

DELETE /api/complaints/:id

</details> <details> <summary>💸 Payments</summary>

GET /api/payments

POST /api/payments

PUT /api/payments/:id

DELETE /api/payments/:id

</details>

# 🤝 Contributing
- Fork the repo
- Create your feature branch
- Commit changes
- Push
- Create Pull Request

# 📜 License
This project is licensed under the MIT License.

# ✨ Author
Eman Khalid
- GitHub: https://github.com/EmanKhalid01
- LinkedIn: https://linkedin.com/in/eman-khalid001
