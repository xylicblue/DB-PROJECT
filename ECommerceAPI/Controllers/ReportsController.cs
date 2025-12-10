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

    /// <summary>
    /// Get customer order summaries
    /// </summary>
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

    /// <summary>
    /// Get top 10 customers by spending
    /// </summary>
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
}
