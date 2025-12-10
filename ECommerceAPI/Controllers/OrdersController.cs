using ECommerceAPI.Models.DTOs;
using ECommerceAPI.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly RepositoryFactory _repoFactory;

    public OrdersController(RepositoryFactory repoFactory)
    {
        _repoFactory = repoFactory;
    }

    /// <summary>
    /// Place a new order
    /// </summary>
    [HttpPost]
    public async Task<ActionResult> PlaceOrder([FromBody] PlaceOrderRequest request)
    {
        try
        {
            var repo = _repoFactory.GetRepository();
            await repo.PlaceOrderAsync(request.CustomerId, request.ProductId, request.Quantity);
            return Ok(new { message = "Order placed successfully! Stock updated by trigger." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Get orders for a specific customer
    /// </summary>
    [HttpGet("customer/{customerId}")]
    public async Task<ActionResult> GetCustomerOrders(int customerId)
    {
        try
        {
            var repo = _repoFactory.GetRepository();
            var orders = await repo.GetCustomerOrdersAsync(customerId);
            return Ok(orders);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
