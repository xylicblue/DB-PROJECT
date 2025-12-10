using ECommerceAPI.Models;
using ECommerceAPI.Models.DTOs;
using ECommerceAPI.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly RepositoryFactory _repoFactory;

    public AuthController(RepositoryFactory repoFactory)
    {
        _repoFactory = repoFactory;
    }

    /// <summary>
    /// Login with email
    /// </summary>
    [HttpPost("login")]
    public async Task<ActionResult<Customer>> Login([FromBody] LoginRequest request)
    {
        try
        {
            var repo = _repoFactory.GetRepository();
            var customer = await repo.LoginAsync(request.Email);

            if (customer == null)
                return NotFound(new { message = "User not found" });

            return Ok(customer);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Register a new customer
    /// </summary>
    [HttpPost("register")]
    public async Task<ActionResult> Register([FromBody] RegisterRequest request)
    {
        try
        {
            var repo = _repoFactory.GetRepository();
            var customer = new Customer
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                City = request.City
            };

            await repo.RegisterCustomerAsync(customer);
            return Ok(new { message = "Registration successful" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
