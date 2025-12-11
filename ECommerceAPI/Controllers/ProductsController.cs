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
