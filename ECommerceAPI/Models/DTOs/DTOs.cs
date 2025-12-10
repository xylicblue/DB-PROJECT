namespace ECommerceAPI.Models.DTOs;

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
}

public class RegisterRequest
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? City { get; set; }
}

public class PlaceOrderRequest
{
    public int CustomerId { get; set; }
    public int ProductId { get; set; }
    public int Quantity { get; set; }
}

public class CustomerOrderSummary
{
    public int CustomerID { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public int TotalOrders { get; set; }
    public decimal TotalSpent { get; set; }
}

public class TopCustomer
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public decimal TotalSpent { get; set; }
}

public class ProductSalesStatus
{
    public int ProductID { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int CurrentStock { get; set; }
    public int TotalUnitsSold { get; set; }
}

public class CustomerOrder
{
    public int OrderID { get; set; }
    public DateTime OrderDate { get; set; }
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = string.Empty;
    public List<OrderItemDetail> Items { get; set; } = new();
}

public class OrderItemDetail
{
    public int ProductID { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
}
