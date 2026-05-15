# Lead Manager CRM

A full-stack Lead Management System built with MERN stack (MongoDB, Express, React, Node.js).

## 🚀 Features

- **Authentication** - JWT login/register with password hashing
- **Lead Management** - Create, read, update, delete leads
- **Search & Filter** - Search by name/email/phone, filter by status
- **Status Tracking** - Update status (New/Contacted/Converted) inline
- **Analytics** - Dashboard with conversion rates and lead distribution
- **Pagination** - 10 leads per page
- **Security** - Rate limiting, XSS protection, input validation

## 🛠️ Tech Stack

| Backend | Frontend |
|---------|----------|
| Node.js | React 18 |
| Express.js | Bootstrap 5 |
| MongoDB | Axios |
| JWT | React Router |
| bcryptjs | Context API |

## 📦 Quick Start

### Prerequisites
- Node.js installed
- MongoDB (local or Atlas cloud)

### Installation

```bash
# Clone repository
git clone https://github.com/Ammar-creater/Lead-Manager-CRM.git
cd Lead-Manager-CRM

# Backend setup
cd backend
npm install
npm run dev

# Frontend setup (new terminal)
cd frontend
npm install
npm start
Environment Variables
Create .env in backend folder:

env
MONGODB_URI=mongodb://localhost:27017/leadmanager
PORT=5000
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
📱 Usage
Open http://localhost:3000

Register a new account

Start adding leads

Search, filter, update status, or delete leads

View analytics dashboard

📡 API Endpoints
Method	Endpoint	Description
POST	/api/auth/register	Register user
POST	/api/auth/login	Login user
GET	/api/leads	Get all leads
POST	/api/leads	Create lead
PATCH	/api/leads/:id/status	Update status
DELETE	/api/leads/:id	Delete lead
🔒 Security Features
JWT with HTTP-only cookies

bcrypt password hashing (10 rounds)

Rate limiting (100 requests/15 min)

Account lockout after 5 attempts

XSS & NoSQL injection protection

📁 Project Structure
text
Lead-Manager-CRM/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── app.js
│   ├── .env
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   └── App.js
    └── package.json
🐛 Common Issues
MongoDB connection error?

Check MongoDB is running: mongod

Or use MongoDB Atlas cloud

Port already in use?

Change PORT in .env file

👨‍💻 Author
Ammar

GitHub: @Ammar-creater

⭐ Show Support
Give a ⭐️ if this project helped you!

text

## 📝 Even Shorter Version (For Quick Submission)

```markdown
# Lead Manager CRM

MERN stack application for managing leads with authentication, CRUD operations, and analytics.

## Features
- ✅ JWT Authentication (Login/Register)
- ✅ Create, Read, Update, Delete Leads
- ✅ Search by name/email/phone
- ✅ Filter by status (New/Contacted/Converted)
- ✅ Analytics Dashboard
- ✅ Pagination
- ✅ Security (rate limiting, XSS protection)

## Tech Stack
- **Backend**: Node.js, Express, MongoDB, JWT, bcrypt
- **Frontend**: React, Bootstrap, Axios, React Router

## Quick Setup

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm start
Environment Variables (.env in backend)
text
MONGODB_URI=mongodb://localhost:27017/leadmanager
PORT=5000
JWT_SECRET=your_secret_key