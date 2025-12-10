using Microsoft.EntityFrameworkCore;

namespace ECommerceAPI.Models;

public class ECommerceDbContext : DbContext
{
    public ECommerceDbContext(DbContextOptions<ECommerceDbContext> options) : base(options)
    {
    }

    public DbSet<Customer> Customers { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderDetail> OrderDetails { get; set; }
    public DbSet<Payment> Payments { get; set; }
    public DbSet<Review> Reviews { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure composite key for Orders (partitioned table)
        modelBuilder.Entity<Order>()
            .HasKey(o => new { o.OrderID, o.OrderDate });

        // Configure OrderID as database-generated identity
        modelBuilder.Entity<Order>()
            .Property(o => o.OrderID)
            .ValueGeneratedOnAdd();

        // Configure composite key for OrderDetails (partitioned table)
        modelBuilder.Entity<OrderDetail>()
            .HasKey(od => new { od.OrderDetailID, od.OrderDate });

        // Configure OrderDetailID as database-generated identity
        modelBuilder.Entity<OrderDetail>()
            .Property(od => od.OrderDetailID)
            .ValueGeneratedOnAdd();

        // Configure tables with triggers (EF Core needs to know about triggers for OUTPUT clause workaround)
        modelBuilder.Entity<OrderDetail>()
            .ToTable(tb => tb.HasTrigger("trg_UpdateStock"));

        // Configure unique constraint on Customer Email
        modelBuilder.Entity<Customer>()
            .HasIndex(c => c.Email)
            .IsUnique();

        // Configure unique constraint on Category Name
        modelBuilder.Entity<Category>()
            .HasIndex(c => c.CategoryName)
            .IsUnique();
    }
}
