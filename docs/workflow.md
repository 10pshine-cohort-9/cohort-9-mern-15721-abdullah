### The Corrected Plan (Horizontal Slicing)

To match the expected PR size and structure of your cohort, you should break your plan down into smaller, strictly backend or strictly frontend branches.

Here is the revised, horizontally sliced roadmap:

1. **Feature 1: Backend Base & Database:** Branch from: develop.
Initialize Express, connect PostgreSQL/Neon, and implement Pino Logger and Global Exception Handling.


2. **Feature 2: Frontend Base Scaffold:** Branch from: feature-1.
Initialize React/Vite, set up Tailwind/CSS, and build the basic routing skeleton.


3. **Feature 3: Backend Auth API:** Branch from: feature-2.
Create the `Users` table and write the registration/login APIs with JWT.


4. **Feature 4: Frontend Auth UI:** Branch from: feature-3.
Build the Sign Up/Log In screens and connect them to the Auth API from Feature 3.


5. **Feature 5: Backend Notes API:** Branch from: feature-4.
Create the `Notes` table and write the secure CRUD APIs.


6. **Feature 6: Frontend Notes Dashboard & Editor:** Branch from: feature-5.
Build the UI to fetch notes and the rich text editor to create/update them.


7. **Feature 7: Unit Testing & SonarQube:** 
Add Mocha/Chai (backend) and Jest (frontend) tests in horizontally sliced branches. Run the final SonarQube audit before submitting.


This results in 7 smaller, highly focused PRs. It perfectly mirrors the scope your peers are using, making CodeRabbit's automated checks more accurate and Sir Tahir's manual review much faster.