namespace ECommerceAPI.Repositories;

public enum RepositoryMode
{
    Linq,
    StoredProcedure
}

public class RepositoryFactory
{
    private readonly IServiceProvider _serviceProvider;

    // Default mode - can be switched at runtime via API
    public static RepositoryMode CurrentMode { get; set; } = RepositoryMode.Linq;

    public RepositoryFactory(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public IECommerceRepository GetRepository()
    {
        return CurrentMode switch
        {
            RepositoryMode.StoredProcedure => _serviceProvider.GetRequiredService<StoredProcedureRepository>(),
            _ => _serviceProvider.GetRequiredService<LinqRepository>()
        };
    }

    public IECommerceRepository GetRepository(RepositoryMode mode)
    {
        return mode switch
        {
            RepositoryMode.StoredProcedure => _serviceProvider.GetRequiredService<StoredProcedureRepository>(),
            _ => _serviceProvider.GetRequiredService<LinqRepository>()
        };
    }
}
