---
description: how to run the password manager application
---

To run the application, you need to start both the backend and the frontend in separate terminal windows.

### 1. Start the Backend
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd /Users/dedeepya/Desktop/password/backend
   ```
2. Install dependencies (if you haven't already):
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node server.js
   ```
   *You should see "Connected to MongoDB Atlas" and "Server is running on port 5001".*

### 2. Start the Frontend
1. Open a **new** terminal window and navigate to the `frontend` folder:
   ```bash
   cd /Users/dedeepya/Desktop/password/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and go to [http://localhost:5173](http://localhost:5173).

### 3. Usage Tip
When you first sign up, remember your **Master Password**. It is the key used to encrypt and decrypt all your vault entries locally in your browser.
