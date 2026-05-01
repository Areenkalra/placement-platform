@echo off
echo ==============================================
echo Starting Placement Readiness Platform
echo ==============================================

echo [1/3] Starting ML Service (Python)...
cd ml-service
start cmd /k "python app.py"
cd ..

echo [2/3] Starting Backend (Node.js)...
cd server
start cmd /k "node server.js"
cd ..

echo [3/3] Starting Frontend (React)...
cd client
start cmd /k "npm run dev"
cd ..

echo ==============================================
echo All three services (ML, Backend, React) are starting!
echo They will open in 3 separate Command Prompt windows.
echo Please wait a few seconds, then go to: http://localhost:5173/
echo ==============================================
pause
