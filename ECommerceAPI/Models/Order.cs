using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECommerceAPI.Models;

[Table("Orders")]
public class Order
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int OrderID { get; set; }

    public int CustomerID { get; set; }

    public DateTime OrderDate { get; set; } = DateTime.Now;

    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalAmount { get; set; }

    [MaxLength(20)]
    public string Status { get; set; } = "Pending";

    [ForeignKey("CustomerID")]
    public Customer? Customer { get; set; }
}
