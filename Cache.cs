using Microsoft.Extensions.Caching.Memory;

public class CustomCache
{
  public CustomCache(IMemoryCache cache)
  {
    _cache = cache;
  }

  public IMemoryCache _cache { get; set; }

  public Company? GetCompanyFromCache(string ticker)
  {
    var company = _cache.Get<Company>(ticker);
    if (company == null) return null;
    return company;
  }

  public void AddCompanyToCache(Company company)
  {
    _cache.Set(company.Ticker, company, DateTimeOffset.UtcNow.AddHours(24)); // store in cache for 1 day
  }
}