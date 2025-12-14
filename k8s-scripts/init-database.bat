@echo off
title Database Initialization
echo.
echo Step 1: Getting SQL Server pod name...
echo ---------------------------------------------------
for /f "tokens=*" %%i in ('kubectl get pods -l app=mssql -o jsonpath^="{.items[0].metadata.name}"') do set POD_NAME=%%i

if "%POD_NAME%"=="" (
    echo ERROR: SQL Server pod not found!
    echo Make sure the database deployment is running.
    pause
    exit /b 1
)

echo Found pod: %POD_NAME%

echo.
echo Step 2: Waiting for SQL Server to be ready...
timeout /t 10

echo.
echo Step 3: Copying MasterScript to SQL Server pod...
kubectl cp ..\MasterScript-(1).sql %POD_NAME%:/tmp/MasterScript.sql

echo.
echo Step 4: Executing MasterScript...
echo ---------------------------------------------------
echo This will take several minutes (generating 1M rows)...
kubectl exec %POD_NAME% -- /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Str0ng!Pass123" -C -i /tmp/MasterScript.sql

echo.
echo   DATABASE INITIALIZATION COMPLETE!
pause
