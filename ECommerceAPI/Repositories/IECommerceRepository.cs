using ECommerceAPI.Models;
using ECommerceAPI.Models.DTOs;

namespace ECommerceAPI.Repositories;

public interface IECommerceRepository
{
    // User auth
    Task<Customer?> LoginAsync(string email);
    Task RegisterCustomerAsync(Customer customer);

    // Read product catalog
    Task<List<Product>> GetAllProductsAsync();
    Task<string> GetStockStatusAsync(int productId);

    // Order processing
    Task PlaceOrderAsync(int customerId, int productId, int quantity);
    Task<List<CustomerOrder>> GetCustomerOrdersAsync(int customerId);

    // Reporting
    Task<List<CustomerOrderSummary>> GetCustomerOrderSummariesAsync();
    Task<List<TopCustomer>> GetTopCustomersAsync();
    Task<List<ProductSalesStatus>> GetProductSalesStatusAsync();
}
