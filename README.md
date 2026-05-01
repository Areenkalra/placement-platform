# Placement Readiness & Skill Gap Analysis System

This is a complete full-stack web application designed to evaluate a student's readiness for campus placements using Machine Learning.

## How to Run the Project

Since `node_modules` and other heavy cache files have been excluded from this zip file to make it easy to share, you will need to install the dependencies before running the project for the first time.

You will need to open **three separate terminals** to run the three services.

### 1. The React Frontend (Client)
In the first terminal, navigate to the `client` folder:
```bash
cd client
npm install
npm run dev
```
*This will start the frontend on `http://localhost:5173/`*

### 2. The Node.js Backend (Server)
In the second terminal, navigate to the `server` folder:
```bash
cd server
npm install
npm start
```
*This will start the backend API on port 5000. It uses an automatic in-memory mock database, so you don't even need to install MongoDB locally!*

### 3. The Python ML Service (ML)
In the third terminal, navigate to the `ml-service` folder:
```bash
cd ml-service
pip install -r requirements.txt
python app.py
```
*This will start the Python Machine Learning service on port 5001.*

### Testing the Application
Once all three are running, simply open your browser and go to the link provided by the React Frontend (usually `http://localhost:5173/`). You can now test the Mock Assessment, the PDF Resume Auto-Fill, and view your Interactive Dashboard!

---

## 🚀 Deployment Guide (Production)

To make your project live on the internet (so anyone can use it), you need to deploy all three services separately. Here is the recommended free stack:

### 1. Database (MongoDB Atlas)
- Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a **Free Cluster**.
- Click **Connect** and get your connection string (`mongodb+srv://...`).
- You will use this string as the `MONGO_URI` environment variable for your Node backend.

### 2. Node Backend (Render or Railway)
- Push your `server` code to a GitHub repository.
- Create an account on [Render](https://render.com/) or [Railway](https://railway.app/) and create a new **Web Service**.
- Connect your GitHub repo and set the Root Directory to `server`.
- In the deployment dashboard, add your `MONGO_URI` string as an Environment Variable.
- Once deployed, copy your new live Backend URL.

### 3. ML Service (Render)
- Push your `ml-service` code to GitHub.
- Create another Web Service on Render and connect the repo. 
- Set the Root Directory to `ml-service`.
- Set the start command to `gunicorn app:app`.
- **Note**: You will need to go into your Node backend (`server.js`) and replace `http://localhost:5001` with this new Live Python URL.

### 4. React Frontend (Vercel)
- **CRITICAL**: Before deploying, you must open your React code and search for `http://localhost:5000`. Replace every instance of it with your brand new Live Backend URL from Step 2!
- Push your updated `client` code to GitHub.
- Create an account on [Vercel](https://vercel.com/) and import your repository.
- Set the Root Directory to `client`.
- Click **Deploy**. Vercel will give you a beautiful, live `.vercel.app` domain within 30 seconds!
