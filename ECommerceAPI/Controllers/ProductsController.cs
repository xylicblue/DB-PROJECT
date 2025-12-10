using ECommerceAPI.Models;
using ECommerceAPI.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly RepositoryFactory _repoFactory;

    public ProductsController(RepositoryFactory repoFactory)
    {
        _repoFactory = repoFactory;
    }

    /// <summary>
    /// Get all products
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<List<Product>>> GetAllProducts()
    {
        try
        {
            var repo = _repoFactory.GetRepository();
            var products = await repo.GetAllProductsAsync();
            return Ok(products);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Get stock status for a product
    /// </summary>
    [HttpGet("{productId}/stock-status")]
    public async Task<ActionResult<string>> GetStockStatus(int productId)
    {
        try
        {
            var repo = _repoFactory.GetRepository();
            var status = await repo.GetStockStatusAsync(productId);
            return Ok(new { productId, stockStatus = status });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Get product sales status (stock vs sold)
    /// </summary>
    [HttpGet("sales-status")]
    public async Task<ActionResult> GetProductSalesStatus()
    {
        try
        {
            var repo = _repoFactory.GetRepository();
            var status = await repo.GetProductSalesStatusAsync();
            return Ok(status);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
