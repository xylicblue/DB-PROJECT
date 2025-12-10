using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECommerceAPI.Models;

[Table("Categories")]
public class Category
{
    [Key]
    public int CategoryID { get; set; }

    [Required]
    [MaxLength(50)]
    public string CategoryName { get; set; } = string.Empty;

    [MaxLength(255)]
    public string? Description { get; set; }
}
