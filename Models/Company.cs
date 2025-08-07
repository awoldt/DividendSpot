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
    AssetType = assetType;
  }

  public int Id { get; set; }
  public string Name { get; set; }
  public string Ticker { get; set; }
  public string? Description { get; set; }
  public string? WebsiteUrl { get; set; }
  public string? Address { get; set; }
  public string? Phone { get; set; }
  public DateTime? PageLastUpdated { get; set; }
  public bool HasCompanyImage { get; set; }
  private int AssetType { get; set; }

  public CompanyDividends[]? Dividends { get; set; }
  public CompanyNews[]? CompanyNews { get; set; }
  public RelatedCompany[]? RelatedCompanies { get; set; }
  public CompanyDividendYield? DivYield { get; set; }

  public string? CorporationJSONLD => AssetType == 1 ? JsonSerializer.Serialize(new CorporationJSONLD(Name,
             Description,
             WebsiteUrl,
             $"https://dividendspot.com/imgs/company-logo/{Ticker}.png",
             Phone,
             Ticker), new JsonSerializerOptions
             {
               DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
             }) : null;
  public string[]? CompanyNewsJSONLD
  => CompanyNews
     ?.Select(n => JsonSerializer.Serialize(
          new NewsArticleJSONLD(
            n.Title,
            n.PublishedAt,
            n.Url,
            n.Description,
            n.Publisher
          ),
          new JsonSerializerOptions
          {
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
          }
        ))
     .ToArray();
}