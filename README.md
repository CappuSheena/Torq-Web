# Torq-Web

## Backend setup

From the project root:

1. Install backend dependencies:
   npm install --prefix backend
2. Copy the example environment file and update credentials:
   copy backend\.env.example backend\.env
3. Create the local MySQL database and import the schema:
   mysql -u root -p < backend/migrations/schema.sql
4. Start the backend server:
   npm run dev --prefix backend