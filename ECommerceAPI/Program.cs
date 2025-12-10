using ECommerceAPI.Models;
using ECommerceAPI.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// Add CORS for React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173", "http://localhost:5174")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Configure Entity Framework with SQL Server
var connectionString = builder.Configuration.GetConnectionString("ECommerceDB")
    ?? "Server=localhost,1433;Database=ECommerceDB;User Id=sa;Password=Str0ng!Pass123;TrustServerCertificate=True;";

builder.Services.AddDbContext<ECommerceDbContext>(options =>
    options.UseSqlServer(connectionString));

// Register repositories
builder.Services.AddScoped<LinqRepository>();
builder.Services.AddScoped<StoredProcedureRepository>();
builder.Services.AddScoped<RepositoryFactory>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("AllowReact");
app.MapControllers();

app.Run();
