using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceDB.Repositories
{
    public class LinqRepository : IECommerceRepository
    {
        // Login
        public Customer Login(string email)
        {
            using (var context = new ECommerceDBEntities1())
            {
                return context.Customers.FirstOrDefault(c => c.Email == email);
            }
        }

        // Register
        public void RegisterCustomer(Customer customer)
        {
            using (var context = new ECommerceDBEntities1())
            {
                context.Customers.Add(customer);
                context.SaveChanges();
            }
        }

        // Get all products
        public List<Product> GetAllProducts()
        {
            using (var context = new ECommerceDBEntities1())
            {
                return context.Products.ToList();
            }
        }

        // Stock status
        public string GetStockStatus(int productId)
        {
            using (var context = new ECommerceDBEntities1())
            {
                return context.Database.SqlQuery<string>(
                    "SELECT dbo.fn_GetStockLabel(@p0)", productId).FirstOrDefault();
            }
        }

        // Place order
        public void PlaceOrder(int customerId, int productId, int quantity)
        {
            using (var context = new ECommerceDBEntities1())
            {
                using (var transaction = context.Database.BeginTransaction())
                {
                    try
                    {
                        var product = context.Products.FirstOrDefault(p => p.ProductID == productId);
                        if (product == null) throw new Exception("Product not found");

                        var newOrder = new Order
                        {
                            CustomerID = customerId,
                            OrderDate = DateTime.Now,
                            Status = "Pending",
                            TotalAmount = product.Price * quantity
                        };
                        context.Orders.Add(newOrder);
                        context.SaveChanges();
                        
                        var detail = new OrderDetail
                        {
                            OrderID = newOrder.OrderID,
                            OrderDate = DateTime.Now,
                            ProductID = productId,
                            Quantity = quantity,
                            UnitPrice = product.Price
                        };
                        context.OrderDetails.Add(detail);

                        // Stock decrement done using trigger in DB
                       
                        context.SaveChanges();
                        transaction.Commit();
                    }
                    catch
                    {
                        transaction.Rollback();
                        throw;
                    }
                }
            }
        }

        // Reports
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
