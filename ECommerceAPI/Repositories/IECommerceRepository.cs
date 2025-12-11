using ECommerceAPI.Models;
using ECommerceAPI.Models.DTOs;

namespace ECommerceAPI.Repositories;

public interface IECommerceRepository
{
    Task<Customer?> LoginAsync(string email);
    Task RegisterCustomerAsync(Customer customer);

    Task<List<Product>> GetAllProductsAsync();
    Task<string> GetStockStatusAsync(int productId);

    Task PlaceOrderAsync(int customerId, int productId, int quantity);
    Task<List<CustomerOrder>> GetCustomerOrdersAsync(int customerId);

    Task<List<CustomerOrderSummary>> GetCustomerOrderSummariesAsync();
    Task<List<TopCustomer>> GetTopCustomersAsync();
    Task<List<ProductSalesStatus>> GetProductSalesStatusAsync();
    Task<decimal> GetPotentialDiscountAsync(int customerId);
}
