using ECommerceAPI.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly RepositoryFactory _repoFactory;

    public ReportsController(RepositoryFactory repoFactory)
    {
        _repoFactory = repoFactory;
    }

    [HttpGet("customer-summaries")]
    public async Task<ActionResult> GetCustomerOrderSummaries()
    {
        try
        {
            var repo = _repoFactory.GetRepository();
            var summaries = await repo.GetCustomerOrderSummariesAsync();
            return Ok(summaries);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("top-customers")]
    public async Task<ActionResult> GetTopCustomers()
    {
        try
        {
            var repo = _repoFactory.GetRepository();
            var topCustomers = await repo.GetTopCustomersAsync();
            return Ok(topCustomers);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("potential-discount/{customerId}")]
    public async Task<ActionResult> GetPotentialDiscount(int customerId)
    {
        try
        {
            var repo = _repoFactory.GetRepository();
            var discount = await repo.GetPotentialDiscountAsync(customerId);
            return Ok(new
            {
                customerId,
                potentialDiscount = discount,
                isEligible = discount > 0,
                message = discount > 0
                    ? $"You've earned ${discount:F2} in loyalty discounts!"
                    : "Spend over $5,000 to unlock 10% loyalty discount"
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
