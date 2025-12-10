using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceDB.Repositories
{
    public class StoredProcedureRepository : IECommerceRepository
    {
        // Login
        public Customer Login(string email)
        {
            using (var context = new ECommerceDBEntities1())
            {
                return context.sp_Login(email).FirstOrDefault();

            }
        }

        // Register
        public void RegisterCustomer(Customer customer)
        {
            using (var context = new ECommerceDBEntities1())
            {
                context.sp_RegisterCustomer(customer.FirstName, customer.LastName, customer.Email, customer.City);
            }
        }

        // Get all products
        public List<Product> GetAllProducts()
        {
            using (var context = new ECommerceDBEntities1())
            {
                var results = context.sp_GetAllProducts().ToList();

                return results.Select(r => new Product
                {
                    ProductID = r.ProductID,
                    ProductName = r.ProductName,
                    CategoryID = r.CategoryID,
                    Description = r.Description,
                    Price = r.Price,
                    StockQuantity = r.StockQuantity
                }).ToList();
            }

        }

        // Stock Status
        public string GetStockStatus(int productId)
        {
            using (var context = new ECommerceDBEntities1())
            {
                return context.sp_GetStockStatus(productId).FirstOrDefault();
            }
        }

        // Place order
        public void PlaceOrder(int customerId, int productId, int quantity)
        {
            using (var context = new ECommerceDBEntities1())
            {
                context.sp_PlaceOrder(customerId, productId, quantity);
            }
        }

        // Reporting
        public List<v_CustomerOrderSummary> GetCustomerOrderSummaries()
        {
            using (var context = new ECommerceDBEntities1())
            {
                return context.v_CustomerOrderSummary.ToList();
            }
        }

        // Top customers
        public List<sp_GetTopCustomers_Result> GetTopCustomers()
        {
            using (var context = new ECommerceDBEntities1())
            {
                return context.sp_GetTopCustomers().ToList();
            }
        }
    }
}
