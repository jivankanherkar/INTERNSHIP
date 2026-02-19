 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/README.md b/README.md
index 114a5bd2b07f50e8cca357d00e807698f6ce5e07..3f2ad634693f2cf93053bc083ffdb4431d614660 100644
--- a/README.md
+++ b/README.md
@@ -1,2 +1,53 @@
-# INTERNSHIP
-INTERNSHIP
+# Internship Project - Full Stack Web Application
+
+## Project Overview
+This project is a complete full-stack internship website that combines a personal developer portfolio, a RESTful library management API, a real-time chat feature, and a code refactoring report section.
+
+The app includes:
+- **Portfolio frontend** with hero, skills, projects, and footer.
+- **Library CRUD API** powered by Node.js and Express using an in-memory array.
+- **Real-time chat** built with Socket.io.
+- **Refactoring report section** outlining key code quality improvements.
+
+## Technologies Used
+- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
+- **Backend:** Node.js, Express.js
+- **Real-time Communication:** Socket.io
+- **Data Storage:** In-memory JavaScript array (no database)
+- **Deployment Target:** Render
+
+## How to Run Locally
+1. Clone the repository.
+2. Install dependencies:
+   ```bash
+   npm install
+   ```
+3. Start the server:
+   ```bash
+   npm start
+   ```
+4. Open your browser at:
+   ```
+   http://localhost:3000
+   ```
+
+## API Endpoints
+- `POST /books` - Add a new book
+- `GET /books` - Retrieve all books
+- `PUT /books/:id` - Update a book by ID
+- `DELETE /books/:id` - Delete a book by ID
+
+## Deployment Instructions for Render
+1. Push this project to a GitHub repository.
+2. Log in to [Render](https://render.com/) and click **New + > Web Service**.
+3. Connect your repository and choose the project.
+4. Configure:
+   - **Build Command:** `npm install`
+   - **Start Command:** `npm start`
+5. Add environment variable if needed:
+   - `PORT` is automatically handled by Render and used via `process.env.PORT` in `server.js`.
+6. Deploy the service.
+
+## Notes
+- This project intentionally uses in-memory storage, so data resets on server restart.
+- The frontend and backend are served from one Express application for simple deployment.
 
EOF
)
