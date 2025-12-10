using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECommerceAPI.Models;

[Table("Products")]
public class Product
{
    [Key]
    public int ProductID { get; set; }

    [Required]
    [MaxLength(100)]
    public string ProductName { get; set; } = string.Empty;

    public int CategoryID { get; set; }

    public string? Description { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal Price { get; set; }

    public int StockQuantity { get; set; }

    public DateTime DateAdded { get; set; } = DateTime.Now;

    [ForeignKey("CategoryID")]
    public Category? Category { get; set; }
}
