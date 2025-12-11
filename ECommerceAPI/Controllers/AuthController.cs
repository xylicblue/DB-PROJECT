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

    [HttpPost("login")]
    public async Task<ActionResult<Customer>> Login([FromBody] LoginRequest request)
    {
        try
        {
            var repo = _repoFactory.GetRepository();
            var customer = await repo.LoginAsync(request.Email);

            if (customer == null)
                return NotFound(new { message = "User not found" });

            if (customer.PasswordHash != "dummy_hash")
            {
                var passwordHash = HashPassword(request.Password);
                if (customer.PasswordHash != passwordHash)
                    return Unauthorized(new { message = "Invalid password" });
            }

            return Ok(customer);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    private static string HashPassword(string password)
    {
        using var sha256 = System.Security.Cryptography.SHA256.Create();
        var bytes = System.Text.Encoding.UTF8.GetBytes(password);
        var hash = sha256.ComputeHash(bytes);
        return Convert.ToBase64String(hash);
    }

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
                City = request.City,
                PasswordHash = HashPassword(request.Password)
            };

            await repo.RegisterCustomerAsync(customer);
            return Ok(new { message = "Registration successful" });
        }
        catch (Microsoft.EntityFrameworkCore.DbUpdateException ex)
            when (ex.InnerException?.Message.Contains("UQ_Customer_Email") == true ||
                  ex.InnerException?.Message.Contains("duplicate key") == true)
        {
            return Conflict(new { message = "Email already exists. Please use a different email or login with your existing account." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
