using System.Text.Json.Serialization;

public class PgonDividendResponse
{
  [JsonPropertyName("results")]
  public DividendResults[] Results { get; set; }
}

public class DividendResults
{
  [JsonPropertyName("cash_amount")]
  public float CashAmount { get; set; }
  [JsonPropertyName("currency")]
  public string Currency { get; set; }
  [JsonPropertyName("ex_dividend_date")]
  public string ExDividendDate { get; set; }
  [JsonPropertyName("pay_date")]
  public string PayDate { get; set; }
  [JsonPropertyName("record_date")]
  public string RecordDate { get; set; }
}

public class PgonNewsResponse
{
  [JsonPropertyName("results")]
  public NewsResults[] Results { get; set; }
}

public class NewsResults
{
  [JsonPropertyName("title")]
  public string Title { get; set; }
  [JsonPropertyName("published_utc")]
  public string PublishedAt { get; set; }
  [JsonPropertyName("article_url")]
  public string Url { get; set; }
  [JsonPropertyName("tickers")]
  public string[] FeaturedTickers { get; set; }
  [JsonPropertyName("description")]
  public string Description { get; set; }
  [JsonPropertyName("publisher")]
  public NewsPublisherResult Publisher { get; set; }
}

public class NewsPublisherResult
{
  [JsonPropertyName("name")]
  public string Name { get; set; }
}

public class PgonRelatedCompaniesResult
{
  [JsonPropertyName("results")]
  public RelatedCompanyArray[] Results { get; set; }
}

public class RelatedCompanyArray
{
  [JsonPropertyName("ticker")]
  public string Ticker { get; set; }
}