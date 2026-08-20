# Project Overview: Notes App
Full-stack web application allowing authenticated users to create, edit, and delete private notes. 

## Technology Stack
- **Frontend:** React.js, Tailwind CSS, Jest (Unit Testing)
- **Backend:** Node.js, PostgreSQL (Neon), Prisma (ORM), Mocha/Chai (Unit Testing), Pino (Logging)
- **QA/DevOps:** SonarQube, Git

## Core Features
1. **User Authentication & Authorization:** Sign up, log in, log out. Notes tied securely to authenticated users.
2. **Note Management:** CRUD operations. Must include rich text editing.
3. **Application Logging:** Pino logger implemented across the app (events, errors, HTTP requests/responses, user activities).
4. **Exception Handling:** Global middleware for graceful error handling. Errors logged via Pino.
5. **Testing & QA:** Unit tests covering controllers, services, and data access layers.

## Application Screens
- **Auth (Sign Up / Log In):** Registration, authentication, redirect to Dashboard.
- **Dashboard:** List of user-specific notes, button to trigger new note creation.
- **Note Editor (Screen/Modal):** Rich text editor, save/cancel actions, redirects back to Dashboard.
- **User Profile (Optional):** Displays user details, logout action.

## Optional/Bonus Features
- Real-time task status updates via Socket.IO
- Export/Import tasks to/from a file
- Search and filter functionalities