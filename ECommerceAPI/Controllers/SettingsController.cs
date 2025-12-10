using ECommerceAPI.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SettingsController : ControllerBase
{
    /// <summary>
    /// Get current repository mode
    /// </summary>
    [HttpGet("mode")]
    public ActionResult GetMode()
    {
        return Ok(new
        {
            mode = RepositoryFactory.CurrentMode.ToString(),
            description = RepositoryFactory.CurrentMode == RepositoryMode.StoredProcedure
                ? "Using Stored Procedures (Optimized)"
                : "Using LINQ (Entity Framework)"
        });
    }

    /// <summary>
    /// Switch repository mode (LINQ or StoredProcedure)
    /// </summary>
    [HttpPost("mode")]
    public ActionResult SetMode([FromBody] SetModeRequest request)
    {
        if (request.UseStoredProcedures)
        {
            RepositoryFactory.CurrentMode = RepositoryMode.StoredProcedure;
            return Ok(new { message = "Switched to Stored Procedures mode", mode = "StoredProcedure" });
        }
        else
        {
            RepositoryFactory.CurrentMode = RepositoryMode.Linq;
            return Ok(new { message = "Switched to LINQ mode", mode = "Linq" });
        }
    }
}

public class SetModeRequest
{
    public bool UseStoredProcedures { get; set; }
}
