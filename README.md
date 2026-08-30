# Notes Application (MERN Stack)

A full-stack, secure, and accessible Notes Management application built as part of the Cohort 9 MERN assignment for Abdullah Sajjad.

## 🚀 Features
- **User Authentication:** Secure JWT-based login and registration.
- **Notes Management:** Create, read, update, and delete notes.
- **Rich Text Editing:** Format notes with a rich text editor.
- **Real-time Search:** Instantly filter notes by title or content.
- **Profile Management:** Update user profile information.
- **Responsive Design:** Beautiful, accessible UI built with Tailwind CSS.
- **Quality Assured:** 80%+ test coverage with Jest/Mocha and 0 issues on SonarQube.

## 💻 Tech Stack
- **Frontend:** React 19, Vite, Tailwind CSS, React Router, Axios, Jest, React Testing Library.
- **Backend:** Node.js, Express.js, PostgreSQL, Prisma ORM, JSON Web Tokens (JWT), Mocha/Chai.

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL running locally or via a cloud provider.

### 1. Backend Setup
Navigate to the backend directory:
```bash
cd backend
```
Install dependencies:
```bash
npm install
```
Create a `.env` file in the `backend/` root and add the following:
```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/notes_db"
JWT_SECRET="your_super_secret_jwt_key"
```
Sync the Prisma schema with your database:
```bash
npx prisma db push
```
Start the backend development server:
```bash
npm run dev
```

### 2. Frontend Setup
Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```
Install dependencies:
```bash
npm install
```
Start the Vite development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## 🧪 Testing & Code Quality
Both the frontend and backend are thoroughly tested. To run tests and generate coverage reports:
```bash
# In the frontend directory
npm run test:coverage

# In the backend directory
npm run test:coverage
```
The codebase has been fully audited via **SonarQube**, successfully passing the Quality Gate with 0 Security Hotspots, 0 Bugs, and >80% test coverage on all code.
