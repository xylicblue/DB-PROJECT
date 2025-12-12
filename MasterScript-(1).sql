USE master;
GO

IF EXISTS (SELECT name FROM sys.databases WHERE name = 'ECommerceDB')
BEGIN
    ALTER DATABASE ECommerceDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE ECommerceDB;
END
GO

IF NOT EXISTS (SELECT name
FROM sys.databases
WHERE name = 'ECommerceDB')
BEGIN
    CREATE DATABASE ECommerceDB;
END
GO

USE ECommerceDB;
GO


DROP TABLE IF EXISTS Reviews;
DROP TABLE IF EXISTS Payments;
DROP TABLE IF EXISTS OrderDetails;
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS Products;
DROP TABLE IF EXISTS Categories;
DROP TABLE IF EXISTS Customers;

IF EXISTS (SELECT *
FROM sys.partition_schemes
WHERE name = 'ps_OrderDate')
    DROP PARTITION SCHEME ps_OrderDate;

IF EXISTS (SELECT *
FROM sys.partition_functions
WHERE name = 'pf_OrderDate')
    DROP PARTITION FUNCTION pf_OrderDate;
GO

-- Setup Partitioning (Split by Year)
CREATE PARTITION FUNCTION pf_OrderDate (DATETIME)
AS RANGE RIGHT FOR VALUES ('2023-01-01', '2024-01-01', '2025-01-01');
GO

CREATE PARTITION SCHEME ps_OrderDate
AS PARTITION pf_OrderDate
ALL TO ([PRIMARY]);
GO

-- Create Tables
CREATE TABLE Customers
(
    CustomerID INT IDENTITY(1,1) NOT NULL,
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    Email NVARCHAR(100) NOT NULL CONSTRAINT UQ_Customer_Email UNIQUE,
    PhoneNumber NVARCHAR(20),
    Address NVARCHAR(255),
    City NVARCHAR(50),
    PasswordHash NVARCHAR(256) NOT NULL DEFAULT 'dummy_hash',
    RegistrationDate DATETIME DEFAULT GETDATE(),
    CONSTRAINT PK_Customers PRIMARY KEY CLUSTERED (CustomerID)
);
GO

CREATE TABLE Categories
(
    CategoryID INT IDENTITY(1,1) NOT NULL,
    CategoryName NVARCHAR(50) NOT NULL CONSTRAINT UQ_Category_Name UNIQUE,
    Description NVARCHAR(255),
    CONSTRAINT PK_Categories PRIMARY KEY CLUSTERED (CategoryID)
);
GO

CREATE TABLE Products
(
    ProductID INT IDENTITY(1,1) NOT NULL,
    ProductName NVARCHAR(100) NOT NULL,
    CategoryID INT NOT NULL,
    Description NVARCHAR(MAX),
    Price DECIMAL(18, 2) NOT NULL CONSTRAINT CHK_Price_Positive CHECK (Price >= 0),
    StockQuantity INT NOT NULL DEFAULT 0 CONSTRAINT CHK_Stock_Positive CHECK (StockQuantity >= 0),
    DateAdded DATETIME DEFAULT GETDATE(),
    CONSTRAINT PK_Products PRIMARY KEY CLUSTERED (ProductID),
    CONSTRAINT FK_Products_Categories FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)
);
GO

CREATE TABLE Orders
(
    OrderID INT IDENTITY(1,1) NOT NULL,
    CustomerID INT NOT NULL,
    OrderDate DATETIME NOT NULL DEFAULT GETDATE(),
    TotalAmount DECIMAL(18, 2) DEFAULT 0.00,
    Status NVARCHAR(20) DEFAULT 'Pending',
    CONSTRAINT PK_Orders PRIMARY KEY CLUSTERED (OrderID, OrderDate)
) ON ps_OrderDate(OrderDate);
GO

ALTER TABLE Orders
ADD CONSTRAINT FK_Orders_Customers FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID);
GO


CREATE TABLE OrderDetails
(
    OrderDetailID INT IDENTITY(1,1) NOT NULL,
    OrderID INT NOT NULL,
    OrderDate DATETIME NOT NULL,
    ProductID INT NOT NULL,
    Quantity INT NOT NULL CONSTRAINT CHK_Qty_Positive CHECK (Quantity > 0),
    UnitPrice DECIMAL(18, 2) NOT NULL,

    CONSTRAINT PK_OrderDetails PRIMARY KEY CLUSTERED (OrderDetailID, OrderDate),
    CONSTRAINT FK_OrderDetails_Orders FOREIGN KEY (OrderID, OrderDate) 
        REFERENCES Orders(OrderID, OrderDate) ON DELETE CASCADE,
    CONSTRAINT FK_OrderDetails_Products FOREIGN KEY (ProductID) 
        REFERENCES Products(ProductID)
) ON ps_OrderDate(OrderDate); 
GO

CREATE TABLE Payments
(
    PaymentID INT IDENTITY(1,1) NOT NULL,
    OrderID INT NOT NULL,
    OrderDate DATETIME NOT NULL,
    PaymentDate DATETIME DEFAULT GETDATE(),
    PaymentMethod NVARCHAR(50) NOT NULL,
    Amount DECIMAL(18, 2) NOT NULL,
    CONSTRAINT PK_Payments PRIMARY KEY CLUSTERED (PaymentID),
    CONSTRAINT FK_Payments_Orders FOREIGN KEY (OrderID, OrderDate) REFERENCES Orders(OrderID, OrderDate) ON DELETE CASCADE
);
GO

CREATE TABLE Reviews
(
    ReviewID INT IDENTITY(1,1) NOT NULL,
    ProductID INT NOT NULL,
    CustomerID INT NOT NULL,
    Rating INT NOT NULL CONSTRAINT CHK_Rating_Range CHECK (Rating >= 1 AND Rating <= 5),
    Comment NVARCHAR(MAX),
    ReviewDate DATETIME DEFAULT GETDATE(),
    CONSTRAINT PK_Reviews PRIMARY KEY CLUSTERED (ReviewID),
    CONSTRAINT FK_Reviews_Products FOREIGN KEY (ProductID) REFERENCES Products(ProductID) ON DELETE CASCADE,
    CONSTRAINT FK_Reviews_Customers FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);
GO

-- Data Population Part
SET NOCOUNT ON;
GO

PRINT 'Starting Data Population...';

-- 1. Insert Categories 
IF NOT EXISTS (SELECT 1
FROM Categories)
BEGIN
    INSERT INTO Categories
        (CategoryName, Description)
    VALUES
        ('Electronics', 'Gadgets and devices'),
        ('Fashion', 'Clothing and accessories'),
        ('Home & Garden', 'Furniture and decor'),
        ('Sports', 'Equipment and apparel'),
        ('Toys', 'Games and fun items');
END

-- 2. Insert Products (50 items)
IF NOT EXISTS (SELECT 1
FROM Products)
BEGIN
    DECLARE @p INT = 1;
    WHILE @p <= 50
    BEGIN
        INSERT INTO Products
            (ProductName, CategoryID, Description, Price, StockQuantity)
        VALUES
            (
                'Product ' + CAST(@p AS NVARCHAR(10)),
                (1 + ABS(CHECKSUM(NEWID())) % 5),
                'Description for product ' + CAST(@p AS NVARCHAR(10)),
                (10 + ABS(CHECKSUM(NEWID())) % 5000),
                10000000
        );
        SET @p = @p + 1;
    END
END

-- 3. Insert Customers (1,000 users)
IF NOT EXISTS (SELECT 1
FROM Customers)
BEGIN
    DECLARE @c INT = 1;
    WHILE @c <= 1000
    BEGIN
        INSERT INTO Customers
            (FirstName, LastName, Email, PhoneNumber, City)
        VALUES
            (
                'Customer' + CAST(@c AS NVARCHAR(10)),
                'User' + CAST(@c AS NVARCHAR(10)),
                'user' + CAST(@c AS NVARCHAR(10)) + '@example.com',
                '0300-' + CAST((1000000 + @c) AS NVARCHAR(20)),
                CASE (ABS(CHECKSUM(NEWID())) % 3) 
                WHEN 0 THEN 'Lahore' 
                WHEN 1 THEN 'Karachi' 
                ELSE 'Islamabad' 
            END
        );
        SET @c = @c + 1;
    END
END

-- 4. Generate 1 Million Orders 
PRINT 'Beginning 1 Million Row Generation...';

DECLARE @Counter INT = 1;
DECLARE @MaxRows INT = 1000000;
DECLARE @RandomCustomerID INT;
DECLARE @RandomProductID INT;
DECLARE @RandomDate DATETIME;
DECLARE @RandomAmount DECIMAL(18,2);
DECLARE @RandomQty INT;
DECLARE @NewOrderID INT;

BEGIN TRAN;

WHILE @Counter <= @MaxRows
BEGIN

    SET @RandomCustomerID = 1 + (ABS(CHECKSUM(NEWID())) % 1000);
    SET @RandomProductID = 1 + (ABS(CHECKSUM(NEWID())) % 50);
    SET @RandomQty = 1 + (ABS(CHECKSUM(NEWID())) % 5);

    -- Random Date (2023-2025) to utilize partitions
    SET @RandomDate = DATEADD(DAY, (ABS(CHECKSUM(NEWID())) % 1000), '2023-01-01');
    SET @RandomAmount = @RandomQty * 100.00;

    -- Insert Order
    INSERT INTO Orders
        (CustomerID, OrderDate, TotalAmount, Status)
    VALUES
        (@RandomCustomerID, @RandomDate, @RandomAmount, 'Completed');

    -- Capture ID
    SET @NewOrderID = SCOPE_IDENTITY();

    -- Insert OrderDetails 
    INSERT INTO OrderDetails
        (OrderID, OrderDate, ProductID, Quantity, UnitPrice)
    VALUES
        (@NewOrderID, @RandomDate, @RandomProductID, @RandomQty, (@RandomAmount/@RandomQty));

    -- Insert Payment 
    INSERT INTO Payments
        (OrderID, OrderDate, PaymentMethod, Amount)
    VALUES
        (@NewOrderID, @RandomDate, 'Credit Card', @RandomAmount);

    -- Commit batch every 10k rows
    IF @Counter % 10000 = 0
    BEGIN
        COMMIT TRAN;
        PRINT 'Rows Inserted: ' + CAST(@Counter AS NVARCHAR(20));
        BEGIN TRAN;
    END

    SET @Counter = @Counter + 1;
END

COMMIT TRAN;
PRINT 'Completed: 1 Million Rows Generated.';
GO

USE ECommerceDB;
GO

PRINT 'Syncing Stock Levels...';
UPDATE p
SET p.StockQuantity = CASE 
    WHEN (p.StockQuantity - Sales.SoldQty) < 0 THEN 0 
    ELSE (p.StockQuantity - Sales.SoldQty) 
    END
FROM Products p
    INNER JOIN (
    SELECT ProductID, SUM(Quantity) as SoldQty
    FROM OrderDetails
    GROUP BY ProductID
) Sales ON p.ProductID = Sales.ProductID;
GO

PRINT 'Starting Programmability Setup...';

-- 1. Performance Indexes for 1M Row table
CREATE NONCLUSTERED INDEX IX_Orders_CustomerID ON Orders(CustomerID);
CREATE NONCLUSTERED INDEX IX_OrderDetails_ProductID ON OrderDetails(ProductID);
CREATE NONCLUSTERED INDEX IX_Payments_OrderID ON Payments(OrderID, OrderDate);
GO

-- 2. Views
-- Summary of customer spending behavior
CREATE OR ALTER VIEW v_CustomerOrderSummary
AS
    SELECT
        c.CustomerID,
        c.FirstName + ' ' + c.LastName AS CustomerName,
        COUNT(o.OrderID) AS TotalOrders,
        ISNULL(SUM(o.TotalAmount), 0) AS TotalSpent
    FROM Customers c
        LEFT JOIN Orders o ON c.CustomerID = o.CustomerID
    GROUP BY c.CustomerID, c.FirstName, c.LastName;
GO

-- Inventory vs Sales analysis
CREATE OR ALTER VIEW v_ProductSalesStatus
AS
    SELECT
        p.ProductID,
        p.ProductName,
        p.StockQuantity AS CurrentStock,
        ISNULL(SUM(od.Quantity), 0) AS TotalUnitsSold
    FROM Products p
        LEFT JOIN OrderDetails od ON p.ProductID = od.ProductID
    GROUP BY p.ProductID, p.ProductName, p.StockQuantity;
GO

-- 3. Functions
-- Helper to determine UI label for stock levels
CREATE OR ALTER FUNCTION fn_GetStockLabel(@ProductID INT)
RETURNS NVARCHAR(20)
AS
BEGIN
    DECLARE @Stock INT;
    DECLARE @Label NVARCHAR(20);

    SELECT @Stock = StockQuantity
    FROM Products
    WHERE ProductID = @ProductID;

    IF @Stock = 0 SET @Label = 'Out of Stock';
    ELSE IF @Stock < 20 SET @Label = 'Low Stock';
    ELSE SET @Label = 'In Stock';

    RETURN @Label;
END;
GO

-- Logic for loyalty discounts (>5000 spent gets 10% off next purchase)
CREATE OR ALTER FUNCTION fn_CalculatePotentialDiscount(@CustomerID INT)
RETURNS DECIMAL(18, 2)
AS
BEGIN
    DECLARE @TotalSpent DECIMAL(18,2);

    SELECT @TotalSpent = SUM(TotalAmount)
    FROM Orders
    WHERE CustomerID = @CustomerID;

    IF @TotalSpent > 5000
        RETURN @TotalSpent * 0.10;

    RETURN 0.00;
END;
GO

-- 4. Stored Procedures
-- Retrieve top 10 customers using CTE
CREATE OR ALTER PROCEDURE sp_GetTopCustomers
AS
BEGIN
    SET NOCOUNT ON;

    WITH
        CustomerSpendingCTE
        AS
        (
            SELECT CustomerID, SUM(TotalAmount) AS TotalSpent
            FROM Orders
            GROUP BY CustomerID
        )
    SELECT TOP 10
        c.FirstName, c.LastName, cte.TotalSpent
    FROM CustomerSpendingCTE cte
        JOIN Customers c ON cte.CustomerID = c.CustomerID
    ORDER BY cte.TotalSpent DESC;
END;
GO

-- Transactional Order Placement
CREATE OR ALTER PROCEDURE sp_PlaceOrder
    @CustomerID INT,
    @ProductID INT,
    @Quantity INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

        DECLARE @Price DECIMAL(18,2);
        SELECT @Price = Price
    FROM Products
    WHERE ProductID = @ProductID;

        IF @Price IS NULL THROW 50001, 'Product not found.', 1;

        INSERT INTO Orders
        (CustomerID, OrderDate, TotalAmount, Status)
    VALUES
        (@CustomerID, GETDATE(), (@Price * @Quantity), 'Pending');

        DECLARE @NewOrderID INT = SCOPE_IDENTITY();

        INSERT INTO OrderDetails
        (OrderID, OrderDate, ProductID, Quantity, UnitPrice)
    VALUES
        (@NewOrderID, GETDATE(), @ProductID, @Quantity, @Price);

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- 5. Triggers
-- Auto-decrement stock on sale
CREATE OR ALTER TRIGGER trg_UpdateStockAfterSale
ON OrderDetails
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE p
    SET p.StockQuantity = p.StockQuantity - i.Quantity
    FROM Products p
        INNER JOIN inserted i ON p.ProductID = i.ProductID;
END;
GO

-- Soft constraint: Prevent deletion of high-value historical records
CREATE OR ALTER TRIGGER trg_PreventHighValueDelete
ON Orders
INSTEAD OF DELETE
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1
    FROM deleted
    WHERE TotalAmount > 5000)
    BEGIN
        RAISERROR ('Cannot delete orders valued over 5000. Archive required.', 16, 1);
        RETURN;
    END

    -- Cascade delete manually for Instead Of trigger
    DELETE FROM OrderDetails WHERE OrderID IN (SELECT OrderID
    FROM deleted);
    DELETE FROM Payments WHERE OrderID IN (SELECT OrderID
    FROM deleted);
    DELETE FROM Orders WHERE OrderID IN (SELECT OrderID
    FROM deleted);
END;
GO

-- 2nd CTE Implementation: Monthly Stats
WITH
    MonthlyStats_CTE
    AS
    (
        SELECT
            YEAR(OrderDate) AS OrderYear,
            MONTH(OrderDate) AS OrderMonth,
            SUM(TotalAmount) AS MonthlyRevenue,
            COUNT(OrderID) AS OrderCount
        FROM Orders
        GROUP BY YEAR(OrderDate), MONTH(OrderDate)
    )
SELECT
    OrderYear,
    OrderMonth,
    MonthlyRevenue,
    (MonthlyRevenue / OrderCount) AS AvgOrderValue
FROM MonthlyStats_CTE
ORDER BY OrderYear, OrderMonth;
GO

-- Features added for Phase 3

-- Login SP
CREATE OR ALTER PROCEDURE sp_Login
    @Email NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM Customers WHERE Email = @Email;
END;
GO

-- Register SP
CREATE OR ALTER PROCEDURE sp_RegisterCustomer
    @FirstName NVARCHAR(50),
    @LastName NVARCHAR(50),
    @Email NVARCHAR(100),
    @City NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO Customers (FirstName, LastName, Email, City)
    VALUES (@FirstName, @LastName, @Email, @City);
END;
GO

-- Get All Products SP
CREATE OR ALTER PROCEDURE sp_GetAllProducts
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM Products;
END;
GO

-- Stock Status Wrapper SP
CREATE OR ALTER PROCEDURE sp_GetStockStatus
    @ProductID INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT dbo.fn_GetStockLabel(@ProductID) as StockStatus;
END;
GO



USE ECommerceDB;
GO

PRINT '=== 1. DATA VOLUME CHECK ===';
-- Should be ~1,000,000 for Orders, ~1,000,000 for OrderDetails/Payments
SELECT 'Orders' AS TableName, COUNT(*) AS [Count] FROM Orders
UNION ALL
SELECT 'OrderDetails', COUNT(*) FROM OrderDetails
UNION ALL
SELECT 'Payments', COUNT(*) FROM Payments
UNION ALL
SELECT 'Products', COUNT(*) FROM Products -- Should be 50
UNION ALL
SELECT 'Customers', COUNT(*) FROM Customers; -- Should be 1000

PRINT '=== 2. PARTITIONING CHECK ===';
-- This proves the Orders table is physically split into buckets (years)
SELECT 
    p.partition_number, 
    fg.name AS FileGroupName,
    r.value AS BoundaryValue, 
    p.rows AS RowsInPartition
FROM sys.partitions p
JOIN sys.indexes i ON p.object_id = i.object_id AND p.index_id = i.index_id
JOIN sys.partition_schemes ps ON i.data_space_id = ps.data_space_id
JOIN sys.destination_data_spaces dds ON ps.data_space_id = dds.partition_scheme_id AND p.partition_number = dds.destination_id
JOIN sys.filegroups fg ON dds.data_space_id = fg.data_space_id
LEFT JOIN sys.partition_range_values r ON ps.function_id = r.function_id AND r.boundary_id = p.partition_number - 1
WHERE p.object_id = OBJECT_ID('Orders') AND i.index_id <= 1
ORDER BY p.partition_number;

PRINT '=== 3. PROGRAMMABILITY CHECK ===';
-- Check if all required "Smart Features" exist
SELECT name, type_desc 
FROM sys.objects 
WHERE name IN (
    -- Phase 2 Features
    'sp_PlaceOrder', 'sp_GetTopCustomers', 
    'v_CustomerOrderSummary', 'v_ProductSalesStatus',
    'fn_GetStockLabel', 'fn_CalculatePotentialDiscount',
    'trg_UpdateStockAfterSale', 'trg_PreventHighValueDelete',
    -- Phase 3 Features (App Logic)
    'sp_Login', 'sp_RegisterCustomer', 'sp_GetAllProducts', 'sp_GetStockStatus'
)
ORDER BY type_desc, name;