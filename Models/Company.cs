public class Company
{
  public Company(int id, string name, string ticker, string? description, string? websiteUrl, string? address, string? phone, DateTime? pageLastUpdated)
  {
    Id = id;
    Name = name;
    Ticker = ticker;
    Description = description;
    WebsiteUrl = websiteUrl;
    Address = address;
    Phone = phone;
    PageLastUpdated = pageLastUpdated;
  }

  public int Id { get; set; }
  public string Name { get; set; }
  public string Ticker { get; set; }
  public string? Description { get; set; }
  public string? WebsiteUrl { get; set; }
  public string? Address { get; set; }
  public string? Phone { get; set; }
  public DateTime? PageLastUpdated { get; set; }

  public CompanyDividends[]? Dividends { get; set; }
  public CompanyNews[]? CompanyNews { get; set; }
  public RelatedCompany[]? RelatedCompanies { get; set; }
}

public class CompanyDividends
{
  public CompanyDividends(double amount, string exDate, string payDay, string recordDate)
  {
    Amount = amount;
    ExDividendDate = DateTime.Parse(exDate);
    DividendPayDate = DateTime.Parse(payDay);
    DividendRecordDate = DateTime.Parse(recordDate);
  }

  public double Amount { get; set; }
  public DateTime ExDividendDate { get; set; }
  public DateTime DividendPayDate { get; set; }
  public DateTime DividendRecordDate { get; set; }
}

public class CompanyNews
{
  public CompanyNews(string title, string publishedAt, string url, string[] featuredTickers, string description, string publisher)
  {
    Title = title;
    PublishedAt = publishedAt;
    Url = url;
    FeaturedTickers = featuredTickers;
    Description = description;
    Publisher = publisher;
  }

  public string Title { get; set; }
  public string PublishedAt { get; set; }
  public string Url { get; set; }
  public string[] FeaturedTickers { get; set; }
  public string Description { get; set; }
  public string Publisher { get; set; }
}

public class RelatedCompany
{
  public RelatedCompany(string ticker, string name)
  {
    Ticker = ticker;
    Name = name;
  }

  public string Ticker { get; set; }
  public string Name { get; set; }
}

public class CompanySearchResults
{

  public CompanySearchResults(string ticker, string name)
  {
    Ticker = ticker;
    Name = name;
  }

  public string Name { get; set; }
  public string Ticker { get; set; }
}