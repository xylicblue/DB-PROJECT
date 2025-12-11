# ECommerce Database Project

A full-stack e-commerce application with 1M+ records, built with .NET 9 Web API and React.

## Prerequisites

- **Docker Desktop** (for SQL Server)
- **.NET 9 SDK**
- **Node.js** (v18+)

## Quick Start

### 1. Start SQL Server (Docker)

```powershell
docker start sqlserver
```

> If container doesn't exist, create it:
>
> ```powershell
> docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=Str0ng!Pass123" -p 1433:1433 --name sqlserver -d mcr.microsoft.com/mssql/server:2022-latest
> ```

### 2. Create the Database (First Time Only)

Run `MasterScript (1).sql` in SQL Server Management Studio (SSMS) or Azure Data Studio:

1. Connect to `localhost,1433` with user `sa` and password `Str0ng!Pass123`
2. Open and execute `MasterScript (1).sql`
3. This creates the `ECommerceDB` database with:
   - Tables (Customers, Products, Orders, OrderDetails, etc.)
   - 1M+ sample records
   - Partitioned tables, triggers, views, and stored procedures

> ⏱️ **Note:** Script takes ~5-10 minutes to generate 1M+ records.

### 3. Start the API Server

```powershell
cd ECommerceAPI
dotnet run --urls "http://localhost:5000"
```

### 4. Start the Frontend

```powershell
cd ecommerce-frontend
npm install   # First time only
npm run dev
```

### 5. Open the App

Navigate to **http://localhost:5173** in your browser.

## Features

- **LINQ / Stored Procedure toggle** - Switch query modes in real-time
- **1M+ Orders** with partitioned tables by year
- **Database triggers** for automatic stock updates
- **Views & Functions** for reporting

## Database Connection

- **Server:** localhost,1433
- **Database:** ECommerceDB
- **User:** sa
- **Password:** Str0ng!Pass123

## Tech Stack

| Layer    | Technology                  |
| -------- | --------------------------- |
| Frontend | React + Vite + Tailwind CSS |
| Backend  | .NET 9 Web API + EF Core 9  |
| Database | SQL Server 2022 (Docker)    |
