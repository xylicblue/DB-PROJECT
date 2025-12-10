using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceDB.Repositories
{
    public interface IECommerceRepository
    {
        // User auth
        Customer Login(string email);
        void RegisterCustomer(Customer customer);

        // Read product catalog
        List<Product> GetAllProducts();
        string GetStockStatus(int productId);

        // Order processing
        void PlaceOrder(int customerId, int productId, int quantity);

        // Reporting
        List<v_CustomerOrderSummary> GetCustomerOrderSummaries();
        List<sp_GetTopCustomers_Result> GetTopCustomers();
    }
}
