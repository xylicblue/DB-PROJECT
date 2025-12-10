using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECommerceAPI.Models;

[Table("Customers")]
public class Customer
{
    [Key]
    public int CustomerID { get; set; }

    [Required]
    [MaxLength(50)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(20)]
    public string? PhoneNumber { get; set; }

    [MaxLength(255)]
    public string? Address { get; set; }

    [MaxLength(50)]
    public string? City { get; set; }

    [MaxLength(256)]
    public string PasswordHash { get; set; } = "dummy_hash";

    public DateTime RegistrationDate { get; set; } = DateTime.Now;
}
