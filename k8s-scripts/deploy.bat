@echo off
title E-Commerce Deployment Master Script
echo ===================================================
echo   E-COMMERCE PROJECT - EXTRA CREDIT DEPLOYMENT
echo ===================================================

echo.
echo [Step 1] Building Docker Images (This takes a few minutes)...
echo ---------------------------------------------------
cd ECommerceAPI
docker build -t ecommerce-backend:latest .
cd ..\ecommerce-frontend
docker build -t ecommerce-frontend:latest .
cd ..

echo.
echo [Step 2] Applying Kubernetes Configurations...
echo ---------------------------------------------------
kubectl apply -f k8s-scripts/storage-and-secret.yaml
kubectl apply -f k8s-scripts/database.yaml
kubectl apply -f k8s-scripts/backend.yaml
kubectl apply -f k8s-scripts/frontend.yaml

echo.
echo [Step 3] Verifying Deployment...
echo ---------------------------------------------------
echo Waiting 15 seconds for pods to initialize...
timeout /t 15
kubectl get pods

echo.
echo ===================================================
echo   [Step 4] OPENING CONNECTION TUNNELS
echo   Opening 3 separate windows for Port Forwarding.
echo   DO NOT CLOSE THEM!
echo ===================================================

start "Tunnel: DATABASE (1433)" cmd /k "kubectl port-forward svc/mssql-service 1433:1433"
timeout /t 2
start "Tunnel: BACKEND API (5000)" cmd /k "kubectl port-forward svc/backend-service 5000:5000"
timeout /t 2
start "Tunnel: FRONTEND UI (3000)" cmd /k "kubectl port-forward svc/frontend-service 3000:3000"

echo.
echo ===================================================
echo   DEPLOYMENT COMPLETE!
echo   1. Check the 3 new windows are running (no errors).
echo   2. Initialize Database using SSMS (localhost, 1433).
echo   3. Open App: http://localhost:3000
echo ===================================================
pause