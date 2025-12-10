using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECommerceAPI.Models;

[Table("OrderDetails")]
public class OrderDetail
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int OrderDetailID { get; set; }

    public int OrderID { get; set; }

    public DateTime OrderDate { get; set; }

    public int ProductID { get; set; }

    public int Quantity { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal UnitPrice { get; set; }

    [ForeignKey("ProductID")]
    public Product? Product { get; set; }
}
