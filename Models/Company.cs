using System.Text.Json;
using System.Text.Json.Serialization;

public class Company
{
  public Company(int id, string name, string ticker, string? description, string? websiteUrl, string? address, string? phone, DateTime? pageLastUpdated, int assetType)
  {
    Id = id;
    Name = name;
    Ticker = ticker;
    Description = description;
    WebsiteUrl = websiteUrl;
    Address = address;
    Phone = phone;
    PageLastUpdated = pageLastUpdated;

    if (assetType == 1)
    {
      CorporationJSONLD = JsonSerializer.Serialize(new CorporationJSONLD(name, description, websiteUrl, $"https://dividendspot.com/imgs/company-logo/{ticker}.png", phone, ticker), new JsonSerializerOptions { DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull });
    }
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
  public string? CorporationJSONLD { get; set; }
  public string[]? CompanyNewsJSONLD { get; set; }
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

public class CorporationJSONLD
{
  public CorporationJSONLD(string name, string? description, string? url, string logo, string? telephone, string ticker)
  {
    Name = name;
    Description = description;
    Url = url;
    Logo = logo;
    Telephone = telephone;
    TickerSymbol = ticker;
  }

  [JsonPropertyName("@context")]
  public string Context { get; set; } = "https://schema.org";

  [JsonPropertyName("@type")]
  public string Type { get; set; } = "Corporation";

  [JsonPropertyName("name")]
  public string Name { get; set; }

  [JsonPropertyName("description")]
  public string? Description { get; set; }

  [JsonPropertyName("url")]
  public string? Url { get; set; }

  [JsonPropertyName("logo")]
  public string Logo { get; set; }

  [JsonPropertyName("telephone")]
  public string? Telephone { get; set; }

  [JsonPropertyName("tickerSymbol")]
  public string TickerSymbol { get; set; }
}

public class NewsArticleJSONLD
{
  public NewsArticleJSONLD(string headline, string datePublished, string url, string description, string publisherName)
  {
    Headline = headline;
    DatePublished = datePublished;
    Url = url;
    Description = description;
    Publisher = new Organization
    {
      Name = publisherName
    };
    Author = new Organization
    {
      Name = publisherName
    };
  }

  [JsonPropertyName("@context")]
  public string Context { get; set; } = "https://schema.org";

  [JsonPropertyName("@type")]
  public string Type { get; set; } = "NewsArticle";

  [JsonPropertyName("headline")]
  public string Headline { get; set; }

  [JsonPropertyName("datePublished")]
  public string DatePublished { get; set; }

  [JsonPropertyName("url")]
  public string Url { get; set; }

  [JsonPropertyName("description")]
  public string Description { get; set; }

  [JsonPropertyName("author")]
  public Organization Author { get; set; }

  [JsonPropertyName("publisher")]
  public Organization Publisher { get; set; }
}

public class Organization
{
  [JsonPropertyName("@type")]
  public string Type { get; set; } = "Organization";

  [JsonPropertyName("name")]
  public string Name { get; set; }
}

public class ImageObject
{
  [JsonPropertyName("@type")]
  public string Type { get; set; } = "ImageObject";

  [JsonPropertyName("url")]
  public string Url { get; set; }
}