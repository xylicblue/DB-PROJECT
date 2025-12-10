using ECommerceAPI.Models;
using ECommerceAPI.Models.DTOs;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace ECommerceAPI.Repositories;

public class StoredProcedureRepository : IECommerceRepository
{
    private readonly ECommerceDbContext _context;

    public StoredProcedureRepository(ECommerceDbContext context)
    {
        _context = context;
    }

    // Login using stored procedure
    public async Task<Customer?> LoginAsync(string email)
    {
        var result = await _context.Customers
            .FromSqlRaw("EXEC sp_Login @Email", new SqlParameter("@Email", email))
            .ToListAsync();
        return result.FirstOrDefault();
    }

    // Register using stored procedure
    public async Task RegisterCustomerAsync(Customer customer)
    {
        await _context.Database.ExecuteSqlRawAsync(
            "EXEC sp_RegisterCustomer @FirstName, @LastName, @Email, @City",
            new SqlParameter("@FirstName", customer.FirstName),
            new SqlParameter("@LastName", customer.LastName),
            new SqlParameter("@Email", customer.Email),
            new SqlParameter("@City", customer.City ?? (object)DBNull.Value));
    }

    // Get all products using stored procedure
    public async Task<List<Product>> GetAllProductsAsync()
    {
        return await _context.Products
            .FromSqlRaw("EXEC sp_GetAllProducts")
            .ToListAsync();
    }

    // Stock status using stored procedure
    public async Task<string> GetStockStatusAsync(int productId)
    {
        var result = await _context.Database
            .SqlQuery<string>($"EXEC sp_GetStockStatus @ProductID = {productId}")
            .FirstOrDefaultAsync();
        return result ?? "Unknown";
    }

    // Place order using stored procedure
    public async Task PlaceOrderAsync(int customerId, int productId, int quantity)
    {
        await _context.Database.ExecuteSqlRawAsync(
            "EXEC sp_PlaceOrder @CustomerID, @ProductID, @Quantity",
            new SqlParameter("@CustomerID", customerId),
            new SqlParameter("@ProductID", productId),
            new SqlParameter("@Quantity", quantity));
    }

    // Get customer orders using raw SQL
    public async Task<List<CustomerOrder>> GetCustomerOrdersAsync(int customerId)
    {
        var orders = await _context.Orders
            .FromSqlRaw("SELECT * FROM Orders WHERE CustomerID = @CustomerID ORDER BY OrderDate DESC",
                new SqlParameter("@CustomerID", customerId))
            .Take(50)
            .ToListAsync();

        var result = new List<CustomerOrder>();

        foreach (var order in orders)
        {
            var items = await _context.Database
                .SqlQuery<OrderItemDetail>($@"
                    SELECT od.ProductID, p.ProductName, od.Quantity, od.UnitPrice 
                    FROM OrderDetails od 
                    INNER JOIN Products p ON od.ProductID = p.ProductID 
                    WHERE od.OrderID = {order.OrderID} AND od.OrderDate = {order.OrderDate}")
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

    // Get customer order summaries using the view
    public async Task<List<CustomerOrderSummary>> GetCustomerOrderSummariesAsync()
    {
        var result = await _context.Database
            .SqlQuery<CustomerOrderSummary>($"SELECT * FROM v_CustomerOrderSummary ORDER BY TotalSpent DESC")
            .ToListAsync();
        return result.Take(100).ToList();
    }

    // Get top customers using stored procedure
    public async Task<List<TopCustomer>> GetTopCustomersAsync()
    {
        return await _context.Database
            .SqlQuery<TopCustomer>($"EXEC sp_GetTopCustomers")
            .ToListAsync();
    }

    // Get product sales status using the view
    public async Task<List<ProductSalesStatus>> GetProductSalesStatusAsync()
    {
        return await _context.Database
            .SqlQuery<ProductSalesStatus>($"SELECT * FROM v_ProductSalesStatus")
            .ToListAsync();
    }
}
