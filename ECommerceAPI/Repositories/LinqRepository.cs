using ECommerceAPI.Models;
using ECommerceAPI.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace ECommerceAPI.Repositories;

public class LinqRepository : IECommerceRepository
{
    private readonly ECommerceDbContext _context;

    public LinqRepository(ECommerceDbContext context)
    {
        _context = context;
    }

    // Login using LINQ
    public async Task<Customer?> LoginAsync(string email)
    {
        return await _context.Customers.FirstOrDefaultAsync(c => c.Email == email);
    }

    // Register using LINQ
    public async Task RegisterCustomerAsync(Customer customer)
    {
        _context.Customers.Add(customer);
        await _context.SaveChangesAsync();
    }

    // Get all products using LINQ
    public async Task<List<Product>> GetAllProductsAsync()
    {
        return await _context.Products.Include(p => p.Category).ToListAsync();
    }

    // Stock status using raw SQL to call the function
    public async Task<string> GetStockStatusAsync(int productId)
    {
        var result = await _context.Database
            .SqlQuery<string>($"SELECT dbo.fn_GetStockLabel({productId}) AS Value")
            .FirstOrDefaultAsync();
        return result ?? "Unknown";
    }

    // Place order using LINQ with transaction
    public async Task PlaceOrderAsync(int customerId, int productId, int quantity)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var product = await _context.Products.FirstOrDefaultAsync(p => p.ProductID == productId);
            if (product == null) throw new Exception("Product not found");

            var orderDate = DateTime.Now;

            var newOrder = new Order
            {
                CustomerID = customerId,
                OrderDate = orderDate,
                Status = "Pending",
                TotalAmount = product.Price * quantity
            };
            _context.Orders.Add(newOrder);
            await _context.SaveChangesAsync();

            // Use raw SQL for OrderDetails to avoid EF Core composite key issues with triggers
            var unitPrice = product.Price;
            await _context.Database.ExecuteSqlAsync(
                $"INSERT INTO OrderDetails (OrderID, OrderDate, ProductID, Quantity, UnitPrice) VALUES ({newOrder.OrderID}, {orderDate}, {productId}, {quantity}, {unitPrice})");

            await transaction.CommitAsync();
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    // Get customer orders using LINQ
    public async Task<List<CustomerOrder>> GetCustomerOrdersAsync(int customerId)
    {
        var orders = await _context.Orders
            .Where(o => o.CustomerID == customerId)
            .OrderByDescending(o => o.OrderDate)
            .Take(50)
            .ToListAsync();

        var result = new List<CustomerOrder>();

        foreach (var order in orders)
        {
            var items = await _context.OrderDetails
                .Where(od => od.OrderID == order.OrderID && od.OrderDate == order.OrderDate)
                .Join(_context.Products,
                    od => od.ProductID,
                    p => p.ProductID,
                    (od, p) => new OrderItemDetail
                    {
                        ProductID = od.ProductID,
                        ProductName = p.ProductName,
                        Quantity = od.Quantity,
                        UnitPrice = od.UnitPrice
                    })
                .ToListAsync();

            result.Add(new CustomerOrder
            {
                OrderID = order.OrderID,
                OrderDate = order.OrderDate,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                Items = items
            });
        }

        return result;
    }

    // Get customer order summaries using LINQ (equivalent to v_CustomerOrderSummary view)
    public async Task<List<CustomerOrderSummary>> GetCustomerOrderSummariesAsync()
    {
        var result = await _context.Customers
            .GroupJoin(
                _context.Orders,
                c => c.CustomerID,
                o => o.CustomerID,
                (c, orders) => new CustomerOrderSummary
                {
                    CustomerID = c.CustomerID,
                    CustomerName = c.FirstName + " " + c.LastName,
                    TotalOrders = orders.Count(),
                    TotalSpent = orders.Sum(o => o.TotalAmount)
                })
            .OrderByDescending(x => x.TotalSpent)
            .Take(100)
            .ToListAsync();

        return result;
    }

    // Get top customers using LINQ with CTE-like logic
    public async Task<List<TopCustomer>> GetTopCustomersAsync()
    {
        var result = await _context.Orders
            .GroupBy(o => o.CustomerID)
            .Select(g => new { CustomerID = g.Key, TotalSpent = g.Sum(o => o.TotalAmount) })
            .OrderByDescending(x => x.TotalSpent)
            .Take(10)
            .Join(
                _context.Customers,
                cs => cs.CustomerID,
                c => c.CustomerID,
                (cs, c) => new TopCustomer
                {
                    FirstName = c.FirstName,
                    LastName = c.LastName,
                    TotalSpent = cs.TotalSpent
                })
            .ToListAsync();

        return result;
    }

    // Get product sales status using LINQ (equivalent to v_ProductSalesStatus view)
    public async Task<List<ProductSalesStatus>> GetProductSalesStatusAsync()
    {
        var result = await _context.Products
            .GroupJoin(
                _context.OrderDetails,
                p => p.ProductID,
                od => od.ProductID,
                (p, orderDetails) => new ProductSalesStatus
                {
                    ProductID = p.ProductID,
                    ProductName = p.ProductName,
                    CurrentStock = p.StockQuantity,
                    TotalUnitsSold = orderDetails.Sum(od => od.Quantity)
                })
            .ToListAsync();

        return result;
    }
}
