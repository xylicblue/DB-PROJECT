using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECommerceAPI.Models;

[Table("Payments")]
public class Payment
{
    [Key]
    public int PaymentID { get; set; }

    public int OrderID { get; set; }

    public DateTime OrderDate { get; set; }

    public DateTime PaymentDate { get; set; } = DateTime.Now;

    [Required]
    [MaxLength(50)]
    public string PaymentMethod { get; set; } = string.Empty;

    [Column(TypeName = "decimal(18,2)")]
    public decimal Amount { get; set; }
}
