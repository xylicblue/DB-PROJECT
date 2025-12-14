@echo off
title E-Commerce Deployment Master Script
echo ===================================================
echo   E-COMMERCE PROJECT - EXTRA CREDIT DEPLOYMENT
echo ===================================================

echo.
echo  Building Docker Images ...
echo ---------------------------------------------------
cd /d "%~dp0.."
cd ECommerceAPI
docker build -t ecommerce-backend:latest .
cd ..\ecommerce-frontend
docker build -t ecommerce-frontend:latest .
cd ..\k8s-scripts

echo.
echo Applying Kubernetes Configurations...
echo ---------------------------------------------------
kubectl apply -f storage-and-secret.yaml
kubectl apply -f database.yaml
kubectl apply -f backend.yaml
kubectl apply -f frontend.yaml

echo.
echo Verifying Deployment...
echo ---------------------------------------------------
echo Waiting 15 seconds for pods to initialize...
timeout /t 15
kubectl get pods

echo.
echo ===================================================
echo   OPENING CONNECTION TUNNELS
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