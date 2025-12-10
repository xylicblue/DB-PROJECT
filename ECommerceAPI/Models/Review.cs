using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECommerceAPI.Models;

[Table("Reviews")]
public class Review
{
    [Key]
    public int ReviewID { get; set; }

    public int ProductID { get; set; }

    public int CustomerID { get; set; }

    [Range(1, 5)]
    public int Rating { get; set; }

    public string? Comment { get; set; }

    public DateTime ReviewDate { get; set; } = DateTime.Now;

    [ForeignKey("ProductID")]
    public Product? Product { get; set; }

    [ForeignKey("CustomerID")]
    public Customer? Customer { get; set; }
}
